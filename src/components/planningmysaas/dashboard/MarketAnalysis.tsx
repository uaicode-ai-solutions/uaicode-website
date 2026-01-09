import { BarChart3, Users, TrendingUp, AlertCircle, Target, Building2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketAnalysisData } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const MarketAnalysis = () => {
  const { overview, targetAudience, competitiveLandscape } = marketAnalysisData;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <BarChart3 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Market Analysis</h2>
          <p className="text-muted-foreground">Deep dive into your target market</p>
        </div>
      </div>

      {/* Market Overview */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <TrendingUp className="h-5 w-5 text-accent" />
            Market Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{overview.marketSize}</div>
              <div className="text-xs text-muted-foreground mt-1">Market Size</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-green-500">{overview.growthRate}</div>
              <div className="text-xs text-muted-foreground mt-1">Growth Rate</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{competitiveLandscape.directCompetitors}</div>
              <div className="text-xs text-muted-foreground mt-1">Direct Competitors</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{competitiveLandscape.marketConcentration}</div>
              <div className="text-xs text-muted-foreground mt-1">Market Type</div>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Key Market Drivers</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {overview.keyDrivers.map((driver, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30">
                  <span className="text-sm text-foreground">{driver.driver}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={driver.impact === "High" ? "default" : "secondary"} className="text-xs">
                      {driver.impact}
                    </Badge>
                    <span className={`text-xs ${driver.trend === "Accelerating" ? "text-green-500" : driver.trend === "Growing" ? "text-blue-500" : "text-muted-foreground"}`}>
                      {driver.trend}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Target Audience */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Users className="h-5 w-5 text-accent" />
            Target Audience Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-accent/5 border border-accent/20">
              <div className="flex items-center gap-2 mb-2">
                <Building2 className="h-4 w-4 text-accent" />
                <span className="text-xs font-medium text-muted-foreground">PRIMARY SEGMENT</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{targetAudience.primarySegment}</div>
              <div className="text-sm text-muted-foreground mt-1">{targetAudience.companySize} employees</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">REVENUE RANGE</span>
              </div>
              <div className="text-lg font-semibold text-foreground">{targetAudience.annualRevenue}</div>
              <div className="text-sm text-muted-foreground mt-1">Annual Revenue</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">DECISION MAKERS</span>
              </div>
              <div className="flex flex-wrap gap-1 mt-2">
                {targetAudience.decisionMakers.map((dm, index) => (
                  <Badge key={index} variant="outline" className="text-xs">{dm}</Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Pain Points
              </h4>
              <ul className="space-y-2">
                {targetAudience.painPoints.map((pain, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/90">
                    <div className="h-1.5 w-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                    {pain}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-green-500" />
                Buying Triggers
              </h4>
              <ul className="space-y-2">
                {targetAudience.buyingTriggers.map((trigger, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-foreground/90">
                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0" />
                    {trigger}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Competitive Landscape */}
      <Card className="bg-card/50 border-border/50 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-accent" />
            Competitive Landscape
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{competitiveLandscape.marketLeaders}</div>
              <div className="text-xs text-muted-foreground mt-1">Market Leaders</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{competitiveLandscape.directCompetitors}</div>
              <div className="text-xs text-muted-foreground mt-1">Direct Competitors</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-2xl font-bold text-foreground">{competitiveLandscape.indirectCompetitors}</div>
              <div className="text-xs text-muted-foreground mt-1">Indirect Competitors</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-lg font-bold text-foreground">{competitiveLandscape.marketConcentration}</div>
              <div className="text-xs text-muted-foreground mt-1">Concentration</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-lg font-bold text-foreground">{competitiveLandscape.entryBarriers}</div>
              <div className="text-xs text-muted-foreground mt-1">Entry Barriers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30">
              <div className="text-lg font-bold text-foreground">{competitiveLandscape.substituteThreat}</div>
              <div className="text-xs text-muted-foreground mt-1">Substitute Threat</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
