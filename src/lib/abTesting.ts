/**
 * A/B Testing Utilities
 * Manages variant assignment and event tracking for conversion optimization
 */

export type Variant = 'A' | 'B';

/**
 * Gets or assigns an A/B test variant for a given test name
 * Variant is persisted in localStorage for consistent user experience
 */
export const getVariant = (testName: string): Variant => {
  const storageKey = `ab_${testName}`;
  const stored = localStorage.getItem(storageKey);
  
  if (stored === 'A' || stored === 'B') {
    return stored;
  }
  
  // Randomly assign variant (50/50 split)
  const variant: Variant = Math.random() < 0.5 ? 'A' : 'B';
  localStorage.setItem(storageKey, variant);
  
  return variant;
};

/**
 * Tracks A/B test events for analytics
 * In production, this should send to your analytics platform
 */
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  // Log to console for development
  console.log('AB Test Event:', eventName, properties);
  
  // TODO: Integrate with analytics platform (Google Analytics, Mixpanel, etc.)
  // Example: window.gtag?.('event', eventName, properties);
};
