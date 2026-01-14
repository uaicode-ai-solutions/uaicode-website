import { Briefcase, DollarSign, Layers, Clock, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, emptyStates } from "@/lib/reportDataUtils";
import { BusinessModel } from "@/types/report";

const BusinessModelSection = () => {
  const { report } = useReportContext();
  
  // Parse business model from report
  const rawBusinessModel = parseJsonField<BusinessModel>(report?.business_model, null);
  
  const businessModel = rawBusinessModel || emptyStates.businessModel;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "recurring": return <TrendingUp className="h-3.5 w-3.5" />;
      case "transactional": return <DollarSign className="h-3.5 w-3.5" />;
      case "expansion": return <Layers className="h-3.5 w-3.5" />;
      case "partnership": return <Star className="h-3.5 w-3.5" />;
      default: return <DollarSign className="h-3.5 w-3.5" />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "recurring": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "transactional": return "bg-blue-500/10 text-blue-400 border-blue-500/20";
      case "expansion": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      case "partnership": return "bg-orange-500/10 text-orange-400 border-orange-500/20";
      default: return "bg-accent/10 text-accent border-accent/20";
    }
  };
  
  // Early return if no data
  if (!rawBusinessModel) {
    return (
      <section id="business-model" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <Briefcase className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">The Model</h2>
            <p className="text-sm text-muted-foreground">Business model data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="business-model" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Briefcase className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Model</h2>
            <InfoTooltip side="right" size="sm">
              How your SaaS will generate revenue and scale profitably
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Revenue structure and monetization strategy</p>
        </div>
      </div>

      {/* Primary Model Badge */}
      <div className="flex items-center gap-3">
        <Badge className="bg-accent/10 text-accent border-accent/20 px-4 py-1.5 text-sm">
          {businessModel.primaryModel}
        </Badge>
        <span className="text-sm text-muted-foreground">Recommended model based on market analysis</span>
      </div>

      {/* Revenue Streams & Pricing Tiers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Revenue Streams Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <DollarSign className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Revenue Streams</h3>
              <InfoTooltip size="sm">
                Different sources of income for your SaaS business
              </InfoTooltip>
            </div>
            
            <div className="space-y-4">
              {businessModel.revenueStreams.map((stream, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={`${getTypeColor(stream.type)} text-xs`}>
                        {getTypeIcon(stream.type)}
                        <span className="ml-1 capitalize">{stream.type}</span>
                      </Badge>
                      <span className="text-sm text-foreground">{stream.name}</span>
                    </div>
                    <span className="text-sm font-medium text-accent">{stream.percentage}%</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-2 bg-muted/30 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-accent/60 to-accent rounded-full transition-all duration-500"
                        style={{ width: `${stream.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs text-muted-foreground w-20 text-right">
                      ${stream.mrr.toLocaleString()}/mo
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border/30">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Total Projected MRR</span>
                <span className="text-lg font-bold text-accent">
                  ${businessModel.revenueStreams.reduce((acc, s) => acc + s.mrr, 0).toLocaleString()}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pricing Tiers Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Recommended Pricing</h3>
              <InfoTooltip size="sm">
                Suggested pricing tiers based on market analysis
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {businessModel.pricingTiers.map((tier, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border transition-all ${
                    tier.recommended 
                      ? 'border-accent/40 bg-accent/5' 
                      : 'border-border/30 bg-muted/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-foreground">{tier.name}</span>
                      {tier.recommended && (
                        <Badge className="bg-accent text-accent-foreground text-xs">
                          <Star className="h-3 w-3 mr-1" />
                          Recommended
                        </Badge>
                      )}
                    </div>
                    <div className="text-right">
                      <span className="text-xl font-bold text-accent">${tier.price}</span>
                      <span className="text-xs text-muted-foreground">/mo</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{tier.features} features</span>
                    <span>{tier.targetCustomers}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Monetization Timeline */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">Monetization Timeline</h3>
            <InfoTooltip size="sm">
              When each revenue stream becomes active
            </InfoTooltip>
          </div>
          
          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute top-4 left-0 right-0 h-0.5 bg-border/50" />
            
            <div className="flex justify-between relative">
              {businessModel.monetizationTimeline.map((item, index) => (
                <div key={index} className="flex flex-col items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 ${
                    item.status === 'active' 
                      ? 'bg-green-500/20 border-2 border-green-500' 
                      : 'bg-muted/30 border-2 border-border/50'
                  }`}>
                    <span className="text-xs font-medium text-foreground">M{item.month}</span>
                  </div>
                  <div className="mt-2 text-center">
                    <p className="text-xs font-medium text-foreground">{item.stream}</p>
                    <Badge className={`mt-1 text-xs ${
                      item.status === 'active' 
                        ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                        : 'bg-muted/20 text-muted-foreground border-border/30'
                    }`}>
                      {item.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <Briefcase className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            The {businessModel.primaryModel} model with tiered pricing is ideal for this market. 
            Starting with subscriptions and expanding to transaction fees creates multiple revenue streams 
            while maintaining predictable recurring revenue.
          </p>
        </div>
      </div>
    </section>
  );
};

export default BusinessModelSection;
