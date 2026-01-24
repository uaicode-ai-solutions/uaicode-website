import { useState, useEffect, useRef, useCallback } from "react";
import { useReportContext } from "@/contexts/ReportContext";
import { requiresFallback } from "@/lib/fallbackConfig";

export interface UseSmartFallbackFieldOptions<T> {
  /** Field path in dot notation (e.g., "opportunity_section.tam_value") */
  fieldPath: string;
  /** Current value from the database */
  currentValue: T | null | undefined;
  /** Optional formatting function */
  formatter?: (value: T) => T;
  /** Skip fallback even if value is empty */
  skipFallback?: boolean;
}

export interface UseSmartFallbackFieldReturn<T> {
  /** The resolved value (from DB or fallback) */
  value: T | null;
  /** Whether a fallback request is in progress */
  isLoading: boolean;
  /** Any error that occurred during fallback */
  error: Error | null;
  /** Whether the current value came from fallback */
  isFallback: boolean;
  /** Manually trigger a fallback request */
  requestFallback: () => void;
}

/**
 * Hook that intelligently fetches fallback data when a field is empty.
 * Uses the fallbackAgent from ReportContext to call the pms-smart-fallback edge function.
 * 
 * NOMENCLATURA:
 * - wizardId: UUID de tb_pms_wizard (do contexto)
 * - pmsReportId: UUID de tb_pms_reports (para operações de fallback)
 */
export function useSmartFallbackField<T = unknown>(
  options: UseSmartFallbackFieldOptions<T>
): UseSmartFallbackFieldReturn<T> {
  const { fieldPath, currentValue, formatter, skipFallback = false } = options;
  const { fallbackAgent, wizardId, pmsReportId, report, refreshReportData } = useReportContext();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [fallbackValue, setFallbackValue] = useState<T | null>(null);
  const [isFallback, setIsFallback] = useState(false);
  const requestedRef = useRef(false);
  const mountedRef = useRef(true);

  // Determine if current value needs fallback
  const needsFallback = !skipFallback && requiresFallback(currentValue);

  const doRequestFallback = useCallback(async () => {
    if (!fallbackAgent || !wizardId || !pmsReportId) {
      console.log(`[SmartFallback] Missing deps for ${fieldPath}:`, { 
        hasAgent: !!fallbackAgent, 
        wizardId, 
        pmsReportId 
      });
      return;
    }

    if (requestedRef.current) {
      console.log(`[SmartFallback] Already requested ${fieldPath}`);
      return;
    }

    requestedRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      console.log(`[SmartFallback] Requesting fallback for ${fieldPath}`);
      
      const response = await fallbackAgent.requestFallback({
        wizardId,
        reportId: pmsReportId, // Edge function expects reportId param
        fieldPath,
      });

      if (!mountedRef.current) return;

      if (response.success && response.value !== null && response.value !== undefined) {
        console.log(`[SmartFallback] Got fallback for ${fieldPath}:`, response.value);
        
        let resolvedValue = response.value as T;
        if (formatter) {
          resolvedValue = formatter(resolvedValue);
        }
        
        setFallbackValue(resolvedValue);
        setIsFallback(true);
        
        // If the value was persisted, refresh report data
        if (response.persisted) {
          console.log(`[SmartFallback] Refreshing report data after persist for ${fieldPath}`);
          await refreshReportData();
        }
      } else if (response.error) {
        console.error(`[SmartFallback] Error for ${fieldPath}:`, response.error);
        setError(new Error(response.error));
      }
    } catch (err) {
      if (!mountedRef.current) return;
      console.error(`[SmartFallback] Exception for ${fieldPath}:`, err);
      setError(err instanceof Error ? err : new Error(String(err)));
    } finally {
      if (mountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [fallbackAgent, wizardId, pmsReportId, fieldPath, formatter, refreshReportData]);

  // Auto-trigger fallback when needed
  useEffect(() => {
    mountedRef.current = true;
    
    if (needsFallback && !requestedRef.current && fallbackAgent && wizardId && pmsReportId) {
      doRequestFallback();
    }

    return () => {
      mountedRef.current = false;
    };
  }, [needsFallback, fallbackAgent, wizardId, pmsReportId, doRequestFallback]);

  // Reset request flag when field path changes
  useEffect(() => {
    requestedRef.current = false;
    setFallbackValue(null);
    setIsFallback(false);
    setError(null);
  }, [fieldPath]);

  // Determine the final value
  let resolvedValue: T | null = null;
  
  if (!needsFallback && currentValue !== null && currentValue !== undefined) {
    // Current value is valid, use it
    resolvedValue = formatter ? formatter(currentValue) : currentValue;
  } else if (fallbackValue !== null) {
    // Use fallback value
    resolvedValue = fallbackValue;
  } else if (currentValue !== null && currentValue !== undefined) {
    // Use current value as-is (even if it looks empty, better than null)
    resolvedValue = formatter ? formatter(currentValue) : currentValue;
  }

  return {
    value: resolvedValue,
    isLoading,
    error,
    isFallback,
    requestFallback: doRequestFallback,
  };
}

/**
 * Batch hook for multiple fields at once
 */
export function useSmartFallbackFields(
  fields: Array<{
    fieldPath: string;
    currentValue: unknown;
    skipFallback?: boolean;
  }>
): {
  isAnyLoading: boolean;
  hasAnyError: boolean;
  results: Map<string, { value: unknown; isLoading: boolean; isFallback: boolean }>;
} {
  const { fallbackAgent, wizardId, pmsReportId, refreshReportData } = useReportContext();
  
  const [loadingFields, setLoadingFields] = useState<Set<string>>(new Set());
  const [fallbackValues, setFallbackValues] = useState<Map<string, unknown>>(new Map());
  const [errors, setErrors] = useState<Map<string, Error>>(new Map());
  const requestedFieldsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!fallbackAgent || !wizardId || !pmsReportId) return;

    const fieldsNeedingFallback = fields.filter(f => 
      !f.skipFallback && 
      requiresFallback(f.currentValue) && 
      !requestedFieldsRef.current.has(f.fieldPath)
    );

    if (fieldsNeedingFallback.length === 0) return;

    // Mark as requested
    fieldsNeedingFallback.forEach(f => requestedFieldsRef.current.add(f.fieldPath));
    setLoadingFields(prev => new Set([...prev, ...fieldsNeedingFallback.map(f => f.fieldPath)]));

    // Batch request - edge function expects reportId param
    const params = fieldsNeedingFallback.map(f => ({
      wizardId,
      reportId: pmsReportId,
      fieldPath: f.fieldPath,
    }));

    fallbackAgent.batchRequest(params).then(responses => {
      const newValues = new Map(fallbackValues);
      const newErrors = new Map(errors);
      let anyPersisted = false;

      responses.forEach((response, index) => {
        const fieldPath = fieldsNeedingFallback[index].fieldPath;
        
        if (response.success && response.value !== null) {
          newValues.set(fieldPath, response.value);
          if (response.persisted) anyPersisted = true;
        } else if (response.error) {
          newErrors.set(fieldPath, new Error(response.error));
        }
      });

      setFallbackValues(newValues);
      setErrors(newErrors);
      setLoadingFields(prev => {
        const next = new Set(prev);
        fieldsNeedingFallback.forEach(f => next.delete(f.fieldPath));
        return next;
      });

      if (anyPersisted) {
        refreshReportData();
      }
    });
  }, [fallbackAgent, wizardId, pmsReportId, fields, fallbackValues, errors, refreshReportData]);

  const results = new Map<string, { value: unknown; isLoading: boolean; isFallback: boolean }>();
  
  fields.forEach(f => {
    const hasDbValue = !requiresFallback(f.currentValue);
    const hasFallbackValue = fallbackValues.has(f.fieldPath);
    
    results.set(f.fieldPath, {
      value: hasDbValue ? f.currentValue : (fallbackValues.get(f.fieldPath) ?? f.currentValue),
      isLoading: loadingFields.has(f.fieldPath),
      isFallback: !hasDbValue && hasFallbackValue,
    });
  });

  return {
    isAnyLoading: loadingFields.size > 0,
    hasAnyError: errors.size > 0,
    results,
  };
}

export default useSmartFallbackField;
