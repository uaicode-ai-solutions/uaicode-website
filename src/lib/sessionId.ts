// Centralized session ID management for conversation isolation
export const getSessionId = (): string => {
  const key = 'eve_session_id';
  
  // Use sessionStorage first to avoid conflicts between tabs
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    // Try to recover from localStorage as fallback
    sessionId = localStorage.getItem(key);
    
    if (!sessionId) {
      sessionId = crypto.randomUUID();
    }
    
    // Sync both storages
    localStorage.setItem(key, sessionId);
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
};
