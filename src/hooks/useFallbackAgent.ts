import { useState, useCallback, useRef, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getFieldConfig, getCriticalFields, requiresFallback as checkRequiresFallback } from "@/lib/fallbackConfig";

export interface FallbackParams {
  wizardId: string;
  reportId: string;
  fieldPath: string;
  sectionName?: string;
  fieldDescription?: string;
  fieldPurpose?: string;
  expectedType?: "string" | "number" | "array" | "object";
  expectedFormat?: string;
  validationRules?: Record<string, unknown>;
  perplexitySearchType?: string;
}

export interface FallbackResponse {
  success: boolean;
  value: unknown;
  source: "perplexity" | "ai_estimation" | "static";
  persisted: boolean;
  retryCount: number;
  reasoning?: string;
  error?: string;
}

interface CacheEntry {
  value: unknown;
  timestamp: number;
  source: string;
}

const CACHE_DURATION_MS = 10 * 60 * 1000; // 10 minutes

export interface UseFallbackAgentReturn {
  requestFallback: (params: FallbackParams) => Promise<FallbackResponse>;
  requestFallbackDebounced: (params: FallbackParams) => void;
  batchRequest: (params: FallbackParams[]) => Promise<FallbackResponse[]>;
  prefetchCriticalFields: (reportId: string, wizardId: string) => void;
  isLoading: (fieldPath: string) => boolean;
  getError: (fieldPath: string) => Error | null;
  getCachedValue: (fieldPath: string) => unknown | null;
  invalidateCache: (fieldPath: string) => void;
  invalidateAllCache: () => void;
  requiresFallback: (value: unknown) => boolean;
}

export function useFallbackAgent(): UseFallbackAgentReturn {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});
  const [errors, setErrors] = useState<Record<string, Error | null>>({});
  const cache = useRef<Record<string, CacheEntry>>({});
  const requestQueue = useRef<Set<string>>(new Set());
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Clean expired cache entries periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      Object.entries(cache.current).forEach(([key, entry]) => {
        if (now - entry.timestamp > CACHE_DURATION_MS) {
          delete cache.current[key];
        }
      });
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const requestFallback = useCallback(async (params: FallbackParams): Promise<FallbackResponse> => {
    const { fieldPath, wizardId, reportId } = params;
    const cacheKey = `${reportId}:${fieldPath}`;

    // Check cache first
    const cachedEntry = cache.current[cacheKey];
    if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_DURATION_MS) {
      console.log(`[FallbackAgent] Cache hit for ${fieldPath}`);
      return {
        success: true,
        value: cachedEntry.value,
        source: cachedEntry.source as "perplexity" | "ai_estimation" | "static",
        persisted: true,
        retryCount: 0,
        reasoning: "Returned from cache"
      };
    }

    // Check if already in queue (prevent duplicate requests)
    if (requestQueue.current.has(cacheKey)) {
      console.log(`[FallbackAgent] Request already in queue for ${fieldPath}`);
      return {
        success: false,
        value: null,
        source: "static",
        persisted: false,
        retryCount: 0,
        reasoning: "Request already in progress"
      };
    }

    // Add to queue
    requestQueue.current.add(cacheKey);
    setLoadingStates(prev => ({ ...prev, [fieldPath]: true }));
    setErrors(prev => ({ ...prev, [fieldPath]: null }));

    try {
      // Get field config if not provided
      const config = getFieldConfig(fieldPath);
      const requestBody: FallbackParams = {
        wizardId,
        reportId,
        fieldPath,
        sectionName: params.sectionName || config?.sectionName || "Unknown",
        fieldDescription: params.fieldDescription || config?.fieldDescription || fieldPath,
        fieldPurpose: params.fieldPurpose || config?.fieldPurpose,
        expectedType: params.expectedType || config?.expectedType || "string",
        expectedFormat: params.expectedFormat || config?.expectedFormat,
        validationRules: params.validationRules || (config?.validationRules as Record<string, unknown> | undefined),
        perplexitySearchType: params.perplexitySearchType || config?.perplexitySearchType,
      };

      console.log(`[FallbackAgent] Requesting fallback for ${fieldPath}`);

      const { data, error } = await supabase.functions.invoke("pms-smart-fallback", {
        body: requestBody,
      });

      if (error) {
        throw new Error(error.message);
      }

      const response = data as FallbackResponse;

      // Update cache if successful
      if (response.success && response.value !== null) {
        cache.current[cacheKey] = {
          value: response.value,
          timestamp: Date.now(),
          source: response.source,
        };
      }

      console.log(`[FallbackAgent] Fallback response for ${fieldPath}:`, response);
      return response;

    } catch (error) {
      console.error(`[FallbackAgent] Error for ${fieldPath}:`, error);
      const err = error instanceof Error ? error : new Error("Unknown error");
      setErrors(prev => ({ ...prev, [fieldPath]: err }));
      
      return {
        success: false,
        value: null,
        source: "static",
        persisted: false,
        retryCount: 0,
        error: err.message,
      };
    } finally {
      requestQueue.current.delete(cacheKey);
      setLoadingStates(prev => ({ ...prev, [fieldPath]: false }));
    }
  }, []);

  const requestFallbackDebounced = useCallback((params: FallbackParams) => {
    const { fieldPath } = params;

    // Clear existing timer for this field
    if (debounceTimers.current[fieldPath]) {
      clearTimeout(debounceTimers.current[fieldPath]);
    }

    // Set new timer
    debounceTimers.current[fieldPath] = setTimeout(() => {
      requestFallback(params);
      delete debounceTimers.current[fieldPath];
    }, 300);
  }, [requestFallback]);

  const batchRequest = useCallback(async (paramsList: FallbackParams[]): Promise<FallbackResponse[]> => {
    console.log(`[FallbackAgent] Batch request for ${paramsList.length} fields`);
    
    // Process in parallel with a concurrency limit
    const CONCURRENCY_LIMIT = 3;
    const results: FallbackResponse[] = [];
    
    for (let i = 0; i < paramsList.length; i += CONCURRENCY_LIMIT) {
      const batch = paramsList.slice(i, i + CONCURRENCY_LIMIT);
      const batchResults = await Promise.all(batch.map(params => requestFallback(params)));
      results.push(...batchResults);
    }
    
    return results;
  }, [requestFallback]);

  const prefetchCriticalFields = useCallback((reportId: string, wizardId: string) => {
    const criticalFieldPaths = getCriticalFields();
    console.log(`[FallbackAgent] Prefetching ${criticalFieldPaths.length} critical fields`);
    
    const params: FallbackParams[] = criticalFieldPaths.map(fieldPath => ({
      wizardId,
      reportId,
      fieldPath,
    }));

    // Don't await - let it run in background
    batchRequest(params).catch(err => {
      console.error("[FallbackAgent] Prefetch error:", err);
    });
  }, [batchRequest]);

  const isLoading = useCallback((fieldPath: string): boolean => {
    return loadingStates[fieldPath] ?? false;
  }, [loadingStates]);

  const getError = useCallback((fieldPath: string): Error | null => {
    return errors[fieldPath] ?? null;
  }, [errors]);

  const getCachedValue = useCallback((fieldPath: string): unknown | null => {
    const entry = cache.current[fieldPath];
    if (entry && Date.now() - entry.timestamp < CACHE_DURATION_MS) {
      return entry.value;
    }
    return null;
  }, []);

  const invalidateCache = useCallback((fieldPath: string) => {
    // Find all cache entries that match this field path
    Object.keys(cache.current).forEach(key => {
      if (key.endsWith(`:${fieldPath}`)) {
        delete cache.current[key];
      }
    });
  }, []);

  const invalidateAllCache = useCallback(() => {
    cache.current = {};
  }, []);

  return {
    requestFallback,
    requestFallbackDebounced,
    batchRequest,
    prefetchCriticalFields,
    isLoading,
    getError,
    getCachedValue,
    invalidateCache,
    invalidateAllCache,
    requiresFallback: checkRequiresFallback,
  };
}

export default useFallbackAgent;
