import { Swords, ExternalLink, Tag, Trophy, Zap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField } from "@/lib/reportDataUtils";
import { 
  CompetitiveAnalysisSectionData, 
  getCompetitorsForUI,
  CompetitorUI 
} from "@/lib/competitiveAnalysisUtils";

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
  
  // Calculate max price for chart scaling
  const maxPrice = competitors.length > 0 
    ? Math.max(...competitors.map(c => c.price || 0), 1) 
    : 100;
  
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

      {/* Competitors Grid - 3x2 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {competitors.slice(0, 6).map((competitor, index) => (
          <Card key={index} className="bg-card/50 border-border/30 hover:border-accent/30 transition-colors flex flex-col h-full">
            <CardContent className="p-4 flex flex-col flex-1">
              <div className="flex justify-between items-start mb-2">
                <span className="font-semibold text-foreground text-sm">{competitor.name}</span>
                {competitor.website && (
                  <a 
                    href={competitor.website.startsWith('http') ? competitor.website : `https://${competitor.website}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="w-4 h-4 text-muted-foreground hover:text-accent cursor-pointer transition-colors" />
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
                <Badge 
                  variant="outline" 
                  className="text-[10px] px-2 py-0.5 bg-yellow-500/10 border-yellow-500/30 text-yellow-400"
                >
                  {competitor.priceModel}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
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
                      className="h-full bg-gradient-to-r from-accent to-yellow-500 rounded-full transition-all duration-500"
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
              <Trophy className="w-4 h-4 text-green-400" />
              <h3 className="font-semibold text-foreground text-sm">Your Competitive Advantages</h3>
              <InfoTooltip size="sm">
                Features and capabilities that set you apart from competitors.
              </InfoTooltip>
            </div>
            <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
              {selectedFeatures.map((feature, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="p-1 rounded bg-accent/10">
                    <Zap className="w-3 h-3 text-accent" />
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
