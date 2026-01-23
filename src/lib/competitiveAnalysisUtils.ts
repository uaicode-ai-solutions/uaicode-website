// ============================================
// Competitive Analysis Utilities
// Parse and transform data from n8n competitive_analysis_section
// ============================================

// Structure of competitor from n8n API
export interface CompetitorFromAPI {
  company_name: string;
  company_website: string;
  saas_app_name: string;
  saas_app_base_price: string;        // "$29/month" or "$0.18/request"
  saas_app_price_range: string;        // "$29-$99/month"
  saas_app_pricing_type: string;       // "flat_monthly" | "tiered" | "usage_based" | "freemium"
  saas_app_features: string[];
  saas_app_strengths: string[];
  saas_app_weakness: string[];
  saas_app_positioning: string;
  saas_app_market_share_estimate: string;
  calculated_score: number;
  priority_score: string;              // "high" | "medium" | "low"
  competitor_type: string;             // "direct" | "indirect"
  scrape_status: string;               // "success" | "partial" | "failed"
}

export interface CompetitiveAnalysisSectionData {
  competitors: Record<string, CompetitorFromAPI>;
  average_pricing_range: string;
  common_features: string[];
  market_gaps_identified: string[];
  market_saturation_level: string;
  total_competitors_found: number;
  processing_status: string;
}

// Extract AVERAGE price from range string like "$29-$99/month" or "Free"
// This provides a more representative value for market positioning
export function extractAveragePrice(priceString: string | undefined | null): number {
  if (!priceString) return 0;
  
  const lowerPrice = priceString.toLowerCase();
  
  // Handle free tiers
  if (lowerPrice === 'free' || lowerPrice === '$0') return 0;
  
  // If it says "Free tier available" without numeric prices, return 0
  if (lowerPrice.includes('free tier') && !priceString.match(/\$\d/)) return 0;
  
  // Extract ALL monetary values from the string (handles $29-$99, $29, $1,299, etc.)
  const allMatches = priceString.match(/\$(\d+(?:,\d{3})*(?:\.\d+)?)/g);
  if (!allMatches || allMatches.length === 0) return 0;
  
  // Parse all values
  const prices = allMatches.map(m => {
    const numStr = m.replace('$', '').replace(/,/g, '');
    return parseFloat(numStr);
  });
  
  // Filter out very small values (usage-based like $0.18/request)
  const validPrices = prices.filter(p => p >= 1);
  if (validPrices.length === 0) return 0;
  
  // Calculate AVERAGE for more representative positioning
  const average = validPrices.reduce((sum, p) => sum + p, 0) / validPrices.length;
  
  return Math.round(average);
}

// Alias for backwards compatibility - now uses average
export const extractPrice = extractAveragePrice;

// Convert competitors object to sorted array
export function parseCompetitorsFromAPI(data: Record<string, CompetitorFromAPI> | null | undefined): CompetitorFromAPI[] {
  if (!data || typeof data !== 'object') return [];
  
  return Object.entries(data)
    .sort(([a], [b]) => {
      // Sort by competitor_1, competitor_2, etc.
      const numA = parseInt(a.replace('competitor_', '')) || 0;
      const numB = parseInt(b.replace('competitor_', '')) || 0;
      return numA - numB;
    })
    .map(([_, competitor]) => competitor)
    .filter(c => c && c.company_name); // Filter out invalid entries
}

// Format pricing type for display
export function formatPricingType(type: string | undefined | null): string {
  if (!type) return 'subscription';
  
  const normalized = type.toLowerCase().replace(/[_-]/g, ' ').trim();
  
  const map: Record<string, string> = {
    'flat monthly': 'flat',
    'flat_monthly': 'flat',
    'tiered': 'tiered',
    'tiered pricing': 'tiered',
    'usage based': 'usage',
    'usage_based': 'usage',
    'freemium': 'freemium',
    'free': 'freemium',
    'subscription': 'subscription',
    'per seat': 'per-seat',
    'per user': 'per-seat',
  };
  
  return map[normalized] || type.split('_')[0].toLowerCase();
}

// Get display name for competitor (prefer app name over company name)
export function getCompetitorDisplayName(competitor: CompetitorFromAPI): string {
  return competitor.saas_app_name || competitor.company_name || 'Unknown';
}

// Get competitor description (use positioning or fallback)
export function getCompetitorDescription(competitor: CompetitorFromAPI): string {
  return competitor.saas_app_positioning || 
    `${competitor.company_name} offers solutions in this market segment.`;
}

// Transform API competitor to UI format
export interface CompetitorUI {
  name: string;
  description: string;
  price: number;
  priceModel: string;
  website: string;
  features: string[];
  strengths: string[];
  weaknesses: string[];
  priceRange: string;
  competitorType: string;
  priorityScore: string;
}

export function transformCompetitorToUI(competitor: CompetitorFromAPI): CompetitorUI {
  return {
    name: getCompetitorDisplayName(competitor),
    description: getCompetitorDescription(competitor),
    // Prioritize price_range (has full range for average), fallback to base_price
    price: extractAveragePrice(competitor.saas_app_price_range) || 
           extractAveragePrice(competitor.saas_app_base_price),
    priceModel: formatPricingType(competitor.saas_app_pricing_type),
    website: competitor.company_website || '',
    features: competitor.saas_app_features || [],
    strengths: competitor.saas_app_strengths || [],
    weaknesses: competitor.saas_app_weakness || [],
    priceRange: competitor.saas_app_price_range || '',
    competitorType: competitor.competitor_type || 'direct',
    priorityScore: competitor.priority_score || 'medium',
  };
}

// Get all competitors transformed for UI
export function getCompetitorsForUI(data: CompetitiveAnalysisSectionData | null | undefined): CompetitorUI[] {
  if (!data?.competitors) return [];
  
  const apiCompetitors = parseCompetitorsFromAPI(data.competitors);
  return apiCompetitors.map(transformCompetitorToUI);
}
