import { Flag, Star, Activity, AlertTriangle, Target, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const SuccessMetricsSection = () => {
  const { successMetrics } = reportData;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "critical": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "important": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "ambitious": return "bg-purple-500/10 text-purple-400 border-purple-500/20";
      default: return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  const getHealthColor = (level: string) => {
    switch (level) {
      case "healthy": return "text-green-400";
      case "warning": return "text-yellow-400";
      case "critical": return "text-red-400";
      default: return "text-muted-foreground";
    }
  };

  return (
    <section id="success-metrics" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Flag className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Success Milestones</h2>
            <InfoTooltip side="right" size="sm">
              Key metrics and milestones to track your progress
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">How to measure and track success</p>
        </div>
      </div>

      {/* North Star Metric */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-accent" />
            <h3 className="font-semibold text-foreground text-sm">North Star Metric</h3>
            <Badge className="bg-accent text-accent-foreground text-xs ml-auto">
              Primary KPI
            </Badge>
          </div>
          
          <p className="text-2xl font-bold text-accent mb-4">{successMetrics.northStar.metric}</p>
          
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-xs text-muted-foreground">Current</p>
              <p className="text-xl font-bold text-foreground">{successMetrics.northStar.current}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-xs text-muted-foreground">Month 3</p>
              <p className="text-xl font-bold text-foreground">{successMetrics.northStar.month3Target}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-muted/20 border border-border/30">
              <p className="text-xs text-muted-foreground">Month 6</p>
              <p className="text-xl font-bold text-foreground">{successMetrics.northStar.month6Target}</p>
            </div>
            <div className="text-center p-3 rounded-lg bg-green-500/10 border border-green-500/20">
              <p className="text-xs text-muted-foreground">Month 12</p>
              <p className="text-xl font-bold text-green-400">{successMetrics.northStar.month12Target}</p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground">{successMetrics.northStar.why}</p>
        </CardContent>
      </Card>

      {/* Launch Milestones & Health Indicators */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Launch Milestones Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Launch Milestones</h3>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border/50" />
              
              <div className="space-y-4">
                {successMetrics.launchMilestones.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      item.status === 'critical' 
                        ? 'bg-red-500/20 border-2 border-red-500' 
                        : item.status === 'important'
                          ? 'bg-yellow-500/20 border-2 border-yellow-500'
                          : 'bg-purple-500/20 border-2 border-purple-500'
                    }`}>
                      <span className="text-[10px] font-bold text-foreground">M{item.month}</span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{item.milestone}</p>
                        <Badge className={`${getStatusColor(item.status)} text-xs`}>
                          {item.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Health Indicators Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Activity className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Health Indicators</h3>
              <InfoTooltip size="sm">
                KPIs to monitor product health
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {successMetrics.healthIndicators.map((indicator, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <p className="text-sm font-medium text-foreground mb-2">{indicator.kpi}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-center p-1.5 rounded bg-green-500/10">
                      <span className={getHealthColor("healthy")}>Healthy</span>
                      <p className="text-muted-foreground mt-0.5">{indicator.healthy}</p>
                    </div>
                    <div className="text-center p-1.5 rounded bg-yellow-500/10">
                      <span className={getHealthColor("warning")}>Warning</span>
                      <p className="text-muted-foreground mt-0.5">{indicator.warning}</p>
                    </div>
                    <div className="text-center p-1.5 rounded bg-red-500/10">
                      <span className={getHealthColor("critical")}>Critical</span>
                      <p className="text-muted-foreground mt-0.5">{indicator.critical}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Signs */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-4 w-4 text-orange-400" />
            <h3 className="font-semibold text-foreground text-sm">Warning Signs to Watch</h3>
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {successMetrics.warningSigns.map((warning, index) => (
              <div key={index} className="p-3 rounded-lg bg-orange-500/5 border border-orange-500/20">
                <p className="text-sm font-medium text-foreground mb-2">{warning.sign}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-red-400">Threshold: {warning.threshold}</span>
                </div>
                <div className="mt-2 pt-2 border-t border-border/30">
                  <p className="text-xs text-accent">Action: {warning.action}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            Focus on "{successMetrics.northStar.metric}" as your North Star metric. 
            Hit {successMetrics.launchMilestones[0].milestone} (Month 1) and {successMetrics.launchMilestones[1].milestone} (Month 3) 
            as critical early milestones. Monitor health indicators weekly to catch issues early.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SuccessMetricsSection;
