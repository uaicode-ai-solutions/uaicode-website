/**
 * Input Sanitization Utility
 * Provides security layer to prevent XSS and injection attacks
 */

export const sanitizeInput = (input: string): string => {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers (onclick, onload, etc.)
    .slice(0, 10000); // Hard limit on any input (10k characters max)
};

/**
 * Sanitize all string values in an object
 */
export const sanitizeFormData = <T extends Record<string, any>>(data: T): T => {
  const sanitized: any = { ...data };
  
  Object.keys(sanitized).forEach((key) => {
    if (typeof sanitized[key] === 'string') {
      sanitized[key] = sanitizeInput(sanitized[key]);
    }
  });
  
  return sanitized as T;
};
