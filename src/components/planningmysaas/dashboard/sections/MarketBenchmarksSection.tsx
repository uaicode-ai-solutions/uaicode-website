import { BarChart3, TrendingUp, Award, Landmark, ArrowUpRight, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { reportData } from "@/lib/reportMockData";

const MarketBenchmarksSection = () => {
  const { marketBenchmarks } = reportData;

  const getPercentileColor = (percentile: string) => {
    if (percentile.includes("10") || percentile.includes("15")) return "bg-green-500/10 text-green-400 border-green-500/20";
    if (percentile.includes("20") || percentile.includes("25")) return "bg-blue-500/10 text-blue-400 border-blue-500/20";
    return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
  };

  return (
    <section id="market-benchmarks" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <BarChart3 className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Industry Standards</h2>
            <InfoTooltip side="right" size="sm">
              How your projections compare to industry benchmarks and successful SaaS companies
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Your projections vs market benchmarks</p>
        </div>
      </div>

      {/* Industry Comparison & Success Rates */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Your Projections vs Industry */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Your Projections vs Industry</h3>
              <InfoTooltip size="sm">
                How your metrics compare to industry standards
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {marketBenchmarks.industryComparison.map((item, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{item.metric}</span>
                    <Badge className={`${getPercentileColor(item.percentile)} text-xs`}>
                      {item.percentile}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-accent">{item.yourProjection}</span>
                      <ArrowUpRight className="h-4 w-4 text-green-400" />
                    </div>
                    <div className="text-right">
                      <span className="text-sm text-muted-foreground">vs avg </span>
                      <span className="text-sm font-medium text-foreground">{item.industryAvg}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Success Rates Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Award className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Success Rate Statistics</h3>
              <InfoTooltip size="sm">
                Based on {marketBenchmarks.successRates.category} historical data
              </InfoTooltip>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-lg bg-muted/10 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-foreground">{marketBenchmarks.successRates.survivalYear1}</p>
                  <p className="text-xs text-muted-foreground">Year 1 Survival</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/10 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-foreground">{marketBenchmarks.successRates.survivalYear3}</p>
                  <p className="text-xs text-muted-foreground">Year 3 Survival</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/10 border border-border/30 text-center">
                  <p className="text-2xl font-bold text-foreground">{marketBenchmarks.successRates.reaching1MARR}</p>
                  <p className="text-xs text-muted-foreground">Reach $1M ARR</p>
                </div>
                <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
                  <p className="text-2xl font-bold text-green-400">{marketBenchmarks.successRates.yourEstimatedProbability}</p>
                  <p className="text-xs text-muted-foreground">Your Est. Success</p>
                </div>
              </div>
              
              <div className="p-3 rounded-lg bg-accent/5 border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Why above average:</p>
                <p className="text-sm text-foreground">{marketBenchmarks.successRates.whyHigher}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Funding Benchmarks & Exit Scenarios */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Funding Benchmarks Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Landmark className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Funding Benchmarks</h3>
              <InfoTooltip size="sm">
                Typical funding rounds and requirements for SaaS companies
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Seed Round</span>
                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                    {marketBenchmarks.fundingBenchmarks.seedRound.typical}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{marketBenchmarks.fundingBenchmarks.seedRound.requires}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-muted/10 border border-border/30">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-foreground">Series A</span>
                  <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/20 text-xs">
                    {marketBenchmarks.fundingBenchmarks.seriesA.typical}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">{marketBenchmarks.fundingBenchmarks.seriesA.requires}</p>
              </div>
              
              <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
                <p className="text-xs text-muted-foreground mb-1">Your Current Readiness</p>
                <p className="text-sm text-foreground">{marketBenchmarks.fundingBenchmarks.yourReadiness}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Exit Scenarios Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <ArrowUpRight className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Exit Scenarios</h3>
              <InfoTooltip size="sm">
                Potential exit opportunities based on industry multiples
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {marketBenchmarks.exitScenarios.map((scenario, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{scenario.type}</span>
                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20 text-xs">
                      {scenario.multipleRange}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Typical timeframe: {scenario.timeframe}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Conclusion */}
      <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20">
        <div className="flex items-start gap-3">
          <div className="p-1.5 rounded-lg bg-green-500/20 flex-shrink-0">
            <CheckCircle2 className="h-4 w-4 text-green-400" />
          </div>
          <p className="text-sm text-foreground/90">
            Your projections position you in the top 20% of comparable SaaS companies. 
            With an estimated {marketBenchmarks.successRates.yourEstimatedProbability} success probability, 
            the fundamentals are strong for both bootstrapping and future fundraising.
          </p>
        </div>
      </div>
    </section>
  );
};

export default MarketBenchmarksSection;
