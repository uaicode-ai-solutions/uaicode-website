import { Swords, Globe, Tag, Trophy, Zap, Users, DollarSign, BarChart3 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { 
  CompetitiveAnalysisSectionData, 
  getCompetitorsForUI,
} from "@/lib/competitiveAnalysisUtils";
import { PricingBadge } from "@/components/planningmysaas/dashboard/ui/PricingBadge";

const CompetitorsDifferentiationSection = () => {
  const { report, reportData } = useReportContext();
  
  // Parse competitive analysis section from report data
  const competitiveData = parseJsonField<CompetitiveAnalysisSectionData>(
    reportData?.competitive_analysis_section,
    null
  );
  
  // Get competitors transformed for UI
  const competitors = getCompetitorsForUI(competitiveData);
  
  // Get selected features as competitive advantages (from wizard data)
  const selectedFeatures = parseJsonField<string[]>(report?.selected_features, []);
  
  // Feature labels for display
  const featureLabels: Record<string, string> = {
    'auth': 'User Authentication & Authorization',
    'profiles': 'User Profile Management',
    'crud': 'Simple Database CRUD Operations',
    'reporting': 'Basic Reporting & Analytics',
    'notifications': 'Email Notifications & Alerts',
    'admin': 'Admin Dashboard',
    'responsive': 'Mobile-first Design',
    'security': 'Security Best Practices',
    'advancedAnalytics': 'Advanced Analytics Dashboard',
    'apiIntegrations': 'API Integrations',
    'payments': 'Payment Processing & Billing',
    'roles': 'Role-based Access Control',
    'search': 'Advanced Search & Filtering',
    'fileUpload': 'File Upload & Management',
    'realtime': 'Real-time Updates',
    'workflows': 'Workflow Automation',
    'advancedReporting': 'Advanced Reporting',
    'emailMarketing': 'Email Marketing Integration',
    'ai': 'AI-powered Features',
    'dataAnalytics': 'Data Analytics & Insights',
    'multiTenant': 'Multi-tenant Architecture',
    'sso': 'Single Sign-On (SSO)',
    'customIntegrations': 'Custom Integrations',
    'apiManagement': 'API Management',
    'collaboration': 'Team Collaboration Tools',
    'automation': 'Process Automation',
    'customReporting': 'Custom Report Builder',
    'support': 'Priority Support System',
    'inventory': 'Inventory Management System',
    'multiLocation': 'Multi-location Support',
  };
  
  // Calculate stats for overview
  const maxPrice = competitors.length > 0 
    ? Math.max(...competitors.map(c => c.price || 0), 1) 
    : 100;
    
  const minPrice = competitors.length > 0 
    ? Math.min(...competitors.map(c => c.price || 0))
    : 0;
    
  const avgPrice = competitors.length > 0 
    ? Math.round(competitors.reduce((sum, c) => sum + (c.price || 0), 0) / competitors.length)
    : 0;
  
  // Early return if no data
  if (competitors.length === 0) {
    return (
      <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Swords className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <p className="text-sm text-muted-foreground">Competitor data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="competitors-differentiation" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Swords className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Competitive Analysis</h2>
            <InfoTooltip side="right" size="sm">
              Analysis of your main competitors and your unique advantages in the market.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Know your competition</p>
        </div>
      </div>

      {/* Overview Stats + Competitors Grid */}
      <div className="grid lg:grid-cols-4 gap-6">
        {/* Overview Stats */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Overview</h3>
            
            {/* Big number */}
            <div className="text-center mb-6">
              <div className="text-5xl font-bold text-accent mb-1">
                {competitors.length}
              </div>
              <div className="text-sm text-muted-foreground">Competitors Analyzed</div>
            </div>
            
            {/* Stats with tooltips */}
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <DollarSign className="w-3 h-3" />
                  Avg. Price
                  <InfoTooltip side="top" size="sm">
                    Average monthly price across all analyzed competitors.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-accent">${avgPrice}/mo</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <BarChart3 className="w-3 h-3" />
                  Price Range
                  <InfoTooltip side="top" size="sm">
                    Lowest to highest pricing in the market.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-foreground">${minPrice} - ${maxPrice}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Your Features
                  <InfoTooltip side="top" size="sm">
                    Number of competitive advantages you bring to the market.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-accent">{selectedFeatures.length}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Competitors Grid (3 cols) */}
        <div className="lg:col-span-3 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {competitors.slice(0, 6).map((competitor, index) => (
            <Card key={index} className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors flex flex-col h-full">
              <CardContent className="p-4 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center">
                      <span className="text-xs font-bold text-amber-500">{index + 1}</span>
                    </div>
                    <span className="font-semibold text-foreground text-sm">{competitor.name}</span>
                  </div>
                  {competitor.website && (
                    <a 
                      href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`} 
                      target="_blank" 
                      rel="noopener noreferrer"
                    >
                      <Globe className="w-4 h-4 text-amber-400 hover:text-amber-300 cursor-pointer transition-colors" />
                    </a>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-4 flex-1 line-clamp-3">
                  {competitor.description}
                </p>
                <div className="flex justify-between items-end mt-auto">
                  <div>
                    <span className="text-2xl font-bold text-foreground">
                      ${competitor.price}
                    </span>
                    <span className="text-xs text-muted-foreground">/month</span>
                  </div>
                  <PricingBadge modelId={competitor.priceModel} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Bottom Row: Price Positioning + Your Advantages */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Price Positioning Chart */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Tag className="w-4 h-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Price Positioning</h3>
              <InfoTooltip size="sm">
                Comparison of competitor pricing in your market segment.
              </InfoTooltip>
            </div>
            <div className="space-y-3">
              {competitors.slice(0, 6).map((competitor, index) => (
                <div key={index} className="flex items-center gap-3">
                  <span className="w-28 text-xs text-muted-foreground truncate">{competitor.name}</span>
                  <div className="flex-1 h-3 bg-background/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 rounded-full transition-all duration-500"
                      style={{ width: `${maxPrice > 0 ? (competitor.price / maxPrice) * 100 : 0}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-16 text-right">
                    {competitor.price === 0 ? "Free" : `$${competitor.price}/mo`}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Your Competitive Advantages */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="font-semibold text-foreground text-sm">Your Competitive Advantages</h3>
              <InfoTooltip size="sm">
                Features and capabilities that set you apart from competitors.
              </InfoTooltip>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {selectedFeatures.map((feature, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 p-2 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                >
                  <div className="p-1.5 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10">
                    <Zap className="w-3 h-3 text-amber-500" />
                  </div>
                  <span className="text-xs text-foreground">
                    {featureLabels[feature] || feature}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default CompetitorsDifferentiationSection;
