// ============================================
// Debug Logger for Financial Metrics
// Tracks fallback usage and data extraction events
// Only active in development mode
// ============================================

export type LogLevel = 'info' | 'warn' | 'fallback' | 'extraction';

export interface FallbackLog {
  timestamp: Date;
  field: string;
  attemptedSource: string;
  reason: string;
  fallbackUsed: string;
  finalValue: unknown;
}

export interface ExtractionLog {
  timestamp: Date;
  field: string;
  source: string;
  rawValue: unknown;
  parsedValue: unknown;
  success: boolean;
}

// Store logs in memory for the current session
const fallbackLogs: FallbackLog[] = [];
const extractionLogs: ExtractionLog[] = [];

const isEnabled = (): boolean => {
  // Only enable in development
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost' || 
           window.location.hostname.includes('preview') ||
           window.location.search.includes('debug=true');
  }
  return false;
};

export const debugLogger = {
  isEnabled,
  
  /**
   * Log when a fallback value is used instead of database data
   */
  logFallback: (log: Omit<FallbackLog, 'timestamp'>): void => {
    if (!isEnabled()) return;
    
    const fullLog: FallbackLog = {
      ...log,
      timestamp: new Date(),
    };
    
    fallbackLogs.push(fullLog);
    
    console.groupCollapsed(
      `%c🔄 Fallback: ${log.field}`,
      'color: #f59e0b; font-weight: bold;'
    );
    console.log('%cAttempted source:', 'color: #6b7280;', log.attemptedSource);
    console.log('%cReason:', 'color: #ef4444;', log.reason);
    console.log('%cFallback used:', 'color: #3b82f6;', log.fallbackUsed);
    console.log('%cFinal value:', 'color: #10b981;', log.finalValue);
    console.groupEnd();
  },
  
  /**
   * Log successful data extraction from database
   */
  logExtraction: (
    field: string, 
    source: string, 
    rawValue: unknown, 
    parsedValue: unknown, 
    success: boolean = true
  ): void => {
    if (!isEnabled()) return;
    
    const log: ExtractionLog = {
      timestamp: new Date(),
      field,
      source,
      rawValue,
      parsedValue,
      success,
    };
    
    extractionLogs.push(log);
    
    if (success) {
      console.log(
        `%c✓ Extracted: ${field}`,
        'color: #10b981;',
        `from ${source}:`,
        parsedValue
      );
    } else {
      console.log(
        `%c✗ Failed: ${field}`,
        'color: #ef4444;',
        `from ${source}:`,
        rawValue
      );
    }
  },
  
  /**
   * Log general info message
   */
  logInfo: (message: string, data?: unknown): void => {
    if (!isEnabled()) return;
    console.log(`%cℹ️ ${message}`, 'color: #3b82f6;', data || '');
  },
  
  /**
   * Log warning message
   */
  logWarn: (message: string, data?: unknown): void => {
    if (!isEnabled()) return;
    console.warn(`⚠️ ${message}`, data || '');
  },
  
  /**
   * Get summary of all fallbacks used
   */
  getFallbackSummary: (): { total: number; byField: Record<string, number> } => {
    const byField: Record<string, number> = {};
    fallbackLogs.forEach(log => {
      byField[log.field] = (byField[log.field] || 0) + 1;
    });
    return { total: fallbackLogs.length, byField };
  },
  
  /**
   * Get all fallback logs
   */
  getFallbackLogs: (): FallbackLog[] => [...fallbackLogs],
  
  /**
   * Get all extraction logs
   */
  getExtractionLogs: (): ExtractionLog[] => [...extractionLogs],
  
  /**
   * Clear all logs (useful when navigating between reports)
   */
  clearLogs: (): void => {
    fallbackLogs.length = 0;
    extractionLogs.length = 0;
  },
  
  /**
   * Print a summary report to console
   */
  printSummary: (): void => {
    if (!isEnabled()) return;
    
    const summary = debugLogger.getFallbackSummary();
    const successfulExtractions = extractionLogs.filter(l => l.success).length;
    const failedExtractions = extractionLogs.filter(l => !l.success).length;
    
    console.group('%c📊 Financial Metrics Debug Summary', 'font-size: 14px; font-weight: bold; color: #f59e0b;');
    console.log(`%cTotal fallbacks used: ${summary.total}`, 'color: #ef4444;');
    console.log(`%cSuccessful extractions: ${successfulExtractions}`, 'color: #10b981;');
    console.log(`%cFailed extractions: ${failedExtractions}`, 'color: #ef4444;');
    
    if (summary.total > 0) {
      console.log('%cFallbacks by field:', 'color: #6b7280;');
      console.table(summary.byField);
    }
    console.groupEnd();
  },
};

// Export for testing
export { fallbackLogs, extractionLogs };
