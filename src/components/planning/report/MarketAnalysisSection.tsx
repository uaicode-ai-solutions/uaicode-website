import { BarChart3, Users, Target, TrendingUp, DollarSign, Megaphone, Tag, Info, CheckCircle2, ExternalLink, Swords, Award, Zap } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface CompetitorData {
  name: string;
  website: string;
  description: string;
  pricing: {
    startingPrice: number;
    pricingModel: string;
    targetSegment: string;
  };
}

interface MarketAnalysisProps {
  data: {
    overview: string;
    targetAudienceInsights: string;
    competitiveLandscape: string;
    marketTrends: string[];
    marketPricing?: {
      averageTicket: number;
      priceRange: { min: number; max: number };
      pricingModel: string;
    };
    investmentRecommendations?: {
      monthlyMarketingBudget: number;
      cacEstimate: number;
      adsPercentageOfCac: { min: number; max: number };
      marketingChannels: string[];
    };
  };
  recommendedPlan?: string;
  competitorsData?: CompetitorData[];
  starterFeatures?: string[];
  growthFeatures?: string[];
  enterpriseFeatures?: string[];
}

// Infrastructure costs by plan
const INFRASTRUCTURE_COSTS: Record<string, number> = {
  Starter: 500,
  Growth: 1000,
  Enterprise: 2000,
};

// Customer lifetime assumption (months)
const CUSTOMER_LIFETIME_MONTHS = 24;

export function MarketAnalysisSection({ 
  data, 
  recommendedPlan = "Starter",
  competitorsData = [],
  starterFeatures = [],
  growthFeatures = [],
  enterpriseFeatures = []
}: MarketAnalysisProps) {
  const allFeatures = [...starterFeatures, ...growthFeatures, ...enterpriseFeatures];
  const hasCompetitors = competitorsData && competitorsData.length > 0;
  const infrastructureCost = INFRASTRUCTURE_COSTS[recommendedPlan] || 500;
  // Default values for investment recommendations
  const investment = data.investmentRecommendations || {
    monthlyMarketingBudget: 1500,
    cacEstimate: 150,
    adsPercentageOfCac: { min: 5, max: 30 },
    marketingChannels: ["Google Ads", "LinkedIn", "Content Marketing", "Email Marketing"],
  };

  // Default values for market pricing
  const marketPricing = data.marketPricing || {
    averageTicket: 49,
    priceRange: { min: 29, max: 99 },
    pricingModel: "Per User",
  };

  const formatCurrency = (value: number) => {
    if (value >= 1000) return `$${(value / 1000).toFixed(1)}K`;
    return `$${value}`;
  };

  const adsMin = (investment.cacEstimate * investment.adsPercentageOfCac.min) / 100;
  const adsMax = (investment.cacEstimate * investment.adsPercentageOfCac.max) / 100;

  // Unit Economics calculations
  const idealTicket = Math.round(marketPricing.averageTicket * 0.85); // 15% below market avg
  const ltv = idealTicket * CUSTOMER_LIFETIME_MONTHS;
  const ltvCacRatio = ltv / investment.cacEstimate;
  const paybackMonths = investment.cacEstimate / idealTicket;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <BarChart3 className="w-5 h-5 text-accent" />
        Market Analysis
      </h2>

      {/* Overview */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-4 h-4 text-accent" />
          Market Overview
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {data.overview}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Target Audience */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-accent" />
            Target Audience Insights
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.targetAudienceInsights}
          </p>
        </div>

        {/* Competitive Landscape */}
        <div className="bg-card border border-border rounded-xl p-4">
          <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-accent" />
            Competitive Landscape
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {data.competitiveLandscape}
          </p>
        </div>
      </div>

      {/* Competitive Analysis Section */}
      {hasCompetitors && (
        <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/5 border border-orange-500/20 rounded-xl p-4">
          <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
            <Swords className="w-4 h-4 text-orange-500" />
            Competitive Analysis
          </h3>
          
          {/* Competitors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {competitorsData.map((competitor, index) => (
              <div key={index} className="bg-card/80 border border-border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-foreground text-sm">{competitor.name}</h4>
                  {competitor.website && (
                    <a 
                      href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground hover:text-accent transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {competitor.description}
                </p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-bold text-foreground">
                      ${competitor.pricing?.startingPrice || 0}
                    </p>
                    <p className="text-xs text-muted-foreground">/month</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-muted-foreground">{competitor.pricing?.pricingModel || 'Per User'}</p>
                    <p className="text-xs text-accent">{competitor.pricing?.targetSegment || 'SMB'}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Market Price Comparison */}
          <div className="bg-card/80 border border-border rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
              <Tag className="w-4 h-4 text-orange-500" />
              Price Positioning
            </h4>
            <div className="space-y-2">
              {competitorsData.map((competitor, index) => {
                const price = competitor.pricing?.startingPrice || 0;
                const maxPrice = Math.max(...competitorsData.map(c => c.pricing?.startingPrice || 0), 100);
                const percentage = (price / maxPrice) * 100;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground w-24 truncate">{competitor.name}</span>
                    <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-amber-500 rounded-full transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-foreground w-16 text-right">${price}/mo</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Competitive Advantages */}
          {allFeatures.length > 0 && (
            <div className="bg-card/80 border border-border rounded-lg p-4">
              <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                <Award className="w-4 h-4 text-orange-500" />
                Your Competitive Advantages
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {allFeatures.slice(0, 6).map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="text-xs text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
              {allFeatures.length > 6 && (
                <p className="text-xs text-muted-foreground mt-2">
                  +{allFeatures.length - 6} more features
                </p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Market Pricing Intelligence */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <Tag className="w-4 h-4 text-accent" />
          Market Pricing Intelligence
        </h3>
        
        <div className="grid grid-cols-3 gap-3">
          {/* Average Market Price */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Market Average</p>
            <p className="text-xl font-bold text-foreground">
              ${marketPricing.averageTicket}
            </p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>

          {/* Price Range */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Price Range</p>
            <p className="text-xl font-bold text-foreground">
              ${marketPricing.priceRange.min} - ${marketPricing.priceRange.max}
            </p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>

          {/* Pricing Model */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Pricing Model</p>
            <p className="text-lg font-bold text-foreground">
              {marketPricing.pricingModel}
            </p>
            <p className="text-xs text-muted-foreground">common model</p>
          </div>
        </div>
      </div>

      {/* Investment Recommendations */}
      <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-accent" />
          Investment Recommendations
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 mb-4">
          {/* Monthly Marketing Budget */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Monthly Marketing</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(investment.monthlyMarketingBudget)}
            </p>
            <p className="text-xs text-muted-foreground">recommended</p>
          </div>

          {/* Yearly Marketing */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Yearly Marketing</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(investment.monthlyMarketingBudget * 12)}
            </p>
            <p className="text-xs text-muted-foreground">annual budget</p>
          </div>

          {/* CAC Estimate with Tooltip */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="bg-card/80 border border-border rounded-lg p-3 text-center cursor-help relative">
                  <Info className="w-3 h-3 text-muted-foreground absolute top-2 right-2" />
                  <p className="text-xs text-muted-foreground mb-1">CAC Estimate</p>
                  <p className="text-lg font-bold text-foreground">
                    ${investment.cacEstimate}
                  </p>
                  <p className="text-xs text-muted-foreground">per customer</p>
                </div>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs p-3">
                <p className="text-xs">
                  <strong>CAC (Customer Acquisition Cost)</strong> is a one-time cost. 
                  Each customer pays ${idealTicket}/month for ~{CUSTOMER_LIFETIME_MONTHS} months = ${ltv} total (LTV), 
                  which is {ltvCacRatio.toFixed(1)}x greater than the CAC.
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* ADS Investment */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">ADS Budget</p>
            <p className="text-lg font-bold text-foreground">
              {investment.adsPercentageOfCac.min}-{investment.adsPercentageOfCac.max}%
            </p>
            <p className="text-xs text-muted-foreground">of CAC (${adsMin.toFixed(0)}-${adsMax.toFixed(0)})</p>
          </div>

          {/* Infrastructure/Month */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Infrastructure</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(infrastructureCost)}
            </p>
            <p className="text-xs text-muted-foreground">/month ({recommendedPlan})</p>
          </div>
        </div>

        {/* Marketing Channels */}
        <div className="bg-card/80 border border-border rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="w-4 h-4 text-accent" />
            <p className="text-sm font-medium text-foreground">Recommended Channels</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {investment.marketingChannels.map((channel, index) => (
              <span
                key={index}
                className="px-2.5 py-1 bg-accent/10 text-accent text-xs rounded-full font-medium"
              >
                {channel}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Unit Economics */}
      <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/5 border border-green-500/20 rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-4 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-green-500" />
          Unit Economics
        </h3>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Ideal Ticket */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Ideal Ticket</p>
            <p className="text-lg font-bold text-foreground">${idealTicket}</p>
            <p className="text-xs text-muted-foreground">/month</p>
          </div>

          {/* Payback Period */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Payback Period</p>
            <p className="text-lg font-bold text-foreground">{paybackMonths.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">months</p>
          </div>

          {/* LTV */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">LTV (Lifetime Value)</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(ltv)}</p>
            <p className="text-xs text-muted-foreground">{CUSTOMER_LIFETIME_MONTHS} months</p>
          </div>

          {/* LTV/CAC Ratio */}
          <div className="bg-card/80 border border-border rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">LTV/CAC Ratio</p>
            <div className="flex items-center justify-center gap-1">
              <p className="text-lg font-bold text-foreground">{ltvCacRatio.toFixed(1)}x</p>
              {ltvCacRatio >= 3 && <CheckCircle2 className="w-4 h-4 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground">{ltvCacRatio >= 3 ? 'healthy (>3x)' : 'needs improvement'}</p>
          </div>
        </div>

        {/* Explanation */}
        <div className="bg-card/80 border border-border rounded-lg p-3">
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong className="text-foreground">How it works:</strong> You invest ${investment.cacEstimate} once to acquire a customer (CAC). 
            They pay ${idealTicket}/month for an average of {CUSTOMER_LIFETIME_MONTHS} months, generating ${ltv} in total revenue (LTV). 
            You recover your acquisition cost in {paybackMonths.toFixed(1)} months, then profit for the remaining {(CUSTOMER_LIFETIME_MONTHS - paybackMonths).toFixed(1)} months.
            {ltvCacRatio >= 3 && " This is a healthy business model with strong unit economics."}
          </p>
        </div>
      </div>

      {/* Market Trends */}
      <div className="bg-card border border-border rounded-xl p-4">
        <h3 className="text-base font-semibold text-foreground mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-accent" />
          Key Market Trends
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {data.marketTrends.map((trend, index) => (
            <div
              key={index}
              className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg"
            >
              <span className="w-6 h-6 rounded-lg bg-accent/20 text-accent flex items-center justify-center text-xs font-semibold shrink-0">
                {index + 1}
              </span>
              <span className="text-sm text-foreground">{trend}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
