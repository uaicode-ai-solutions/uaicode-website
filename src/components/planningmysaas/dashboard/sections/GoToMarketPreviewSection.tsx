import { Rocket, Target, Zap, Calendar, ArrowRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

interface GoToMarketPreviewSectionProps {
  onNavigateToMarketing?: () => void;
}

const GoToMarketPreviewSection = ({ onNavigateToMarketing }: GoToMarketPreviewSectionProps) => {
  const { goToMarketPreview } = reportData;

  const getImpactColor = (impact: string) => {
    switch (impact.toLowerCase()) {
      case "high": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-muted/20 text-muted-foreground border-border/30";
    }
  };

  const getEffortColor = (effort: string) => {
    switch (effort.toLowerCase()) {
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };

  return (
    <section id="go-to-market-preview" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Rocket className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">The Launch Strategy</h2>
            <InfoTooltip side="right" size="sm">
              Preview of your go-to-market strategy. Full details in Marketing tab.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Quick wins and initial channels to focus on</p>
        </div>
      </div>

      {/* Primary Channel Highlight */}
      <Card className="bg-gradient-to-r from-accent/10 to-accent/5 border-accent/20">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Primary Channel</p>
              <p className="text-xl font-bold text-accent">{goToMarketPreview.primaryChannel}</p>
            </div>
            <div className="p-3 rounded-full bg-accent/20">
              <Target className="h-6 w-6 text-accent" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Channel Priority Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {goToMarketPreview.channels.map((channel, index) => (
          <Card key={index} className={`bg-card/50 border-border/30 ${index === 0 ? 'ring-2 ring-accent/30' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <Badge className="bg-muted/20 text-muted-foreground border-border/30 text-xs">
                  Priority #{channel.priority}
                </Badge>
                <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                  {channel.roi}x ROI
                </Badge>
              </div>
              <h4 className="font-semibold text-foreground mb-2">{channel.name}</h4>
              <p className="text-xs text-muted-foreground">
                Results in {channel.timeToResults}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Wins & First 90 Days */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quick Wins Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Zap className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">Quick Wins</h3>
              <InfoTooltip size="sm">
                Immediate actions with high impact and low effort
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {goToMarketPreview.quickWins.map((win, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <p className="text-sm font-medium text-foreground mb-2">{win.action}</p>
                  <div className="flex items-center gap-2">
                    <Badge className={`${getImpactColor(win.impact)} text-xs`}>
                      {win.impact} Impact
                    </Badge>
                    <Badge className={`${getEffortColor(win.effort)} text-xs`}>
                      {win.effort} Effort
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* First 90 Days Timeline */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground">First 90 Days</h3>
            </div>
            
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-3 top-3 bottom-3 w-0.5 bg-border/50" />
              
              <div className="space-y-4">
                {goToMarketPreview.first90Days.map((item, index) => (
                  <div key={index} className="flex items-start gap-4 relative">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                      item.day <= 30 
                        ? 'bg-green-500/20 border-2 border-green-500' 
                        : item.day <= 60 
                          ? 'bg-yellow-500/20 border-2 border-yellow-500'
                          : 'bg-accent/20 border-2 border-accent'
                    }`}>
                      <span className="text-[10px] font-bold text-foreground">{item.day}</span>
                    </div>
                    <div className="flex-1 pb-2">
                      <p className="text-xs text-muted-foreground">Day {item.day}</p>
                      <p className="text-sm font-medium text-foreground">{item.milestone}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* CTA to Marketing Tab */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-foreground mb-1">See the Full Marketing Strategy</h3>
              <p className="text-sm text-muted-foreground">
                Detailed channel analysis, ICP definition, paid media strategy, and more.
              </p>
            </div>
            <Button 
              onClick={onNavigateToMarketing}
              className="bg-accent hover:bg-accent/90 text-accent-foreground gap-2"
            >
              Explore Marketing
              <ArrowRight className="h-4 w-4" />
            </Button>
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
            Focus on {goToMarketPreview.primaryChannel} as your primary channel with {goToMarketPreview.channels[0].roi}x expected ROI. 
            Execute the quick wins immediately while building toward your 90-day milestones.
          </p>
        </div>
      </div>
    </section>
  );
};

export default GoToMarketPreviewSection;
