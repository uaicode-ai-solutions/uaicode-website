import { DollarSign, TrendingUp, AlertTriangle, CheckCircle2, XCircle, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";
import { PricingBadge } from "@/components/planningmysaas/dashboard/ui/PricingBadge";

const positionColors = {
  Premium: "bg-purple-500/20 text-purple-600 border-purple-500/30",
  "Mid-market": "bg-blue-500/20 text-blue-600 border-blue-500/30",
  Budget: "bg-green-500/20 text-green-600 border-green-500/30",
};

const PricingDiagnosis = () => {
  const { pricingDiagnosis } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Pricing Diagnosis</h3>
        <p className="text-sm text-muted-foreground">Competitive pricing analysis and market positioning</p>
      </div>

      {/* Price Map */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <DollarSign className="h-5 w-5 text-accent" />
            Competitor Price Map
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {pricingDiagnosis.priceMap.map((competitor, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-muted/30 border border-border/30"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{competitor.competitor}</h4>
                      <Badge className={positionColors[competitor.position as keyof typeof positionColors]}>
                        {competitor.position}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{competitor.valueProposition}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-accent">{competitor.price}</p>
                    <PricingBadge modelId={competitor.model} showIcon={false} />
                    <p className="text-xs text-muted-foreground mt-1">Target: {competitor.targetMarket}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Models Comparison */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="h-5 w-5 text-accent" />
            Pricing Models in Market
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid sm:grid-cols-2 gap-4">
            {pricingDiagnosis.models.map((model, index) => (
              <div 
                key={index}
                className="p-4 rounded-lg bg-muted/30 border border-border/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-foreground">{model.type}</h4>
                  <Badge variant="outline">{model.prevalence}% of market</Badge>
                </div>
                <Progress value={model.prevalence} className="h-2" />
                
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <p className="text-xs text-green-500 flex items-center gap-1 mb-1">
                      <CheckCircle2 className="h-3 w-3" /> Pros
                    </p>
                    <ul className="space-y-0.5">
                      {model.pros.map((pro, i) => (
                        <li key={i} className="text-xs text-foreground/80">• {pro}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-xs text-red-500 flex items-center gap-1 mb-1">
                      <XCircle className="h-3 w-3" /> Cons
                    </p>
                    <ul className="space-y-0.5">
                      {model.cons.map((con, i) => (
                        <li key={i} className="text-xs text-foreground/80">• {con}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="pt-2 border-t border-border/30">
                  <p className="text-xs text-muted-foreground">
                    <span className="font-medium">Best for:</span> {model.bestFor}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Pricing Gaps */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Pricing Gaps & Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {pricingDiagnosis.gaps.map((gap, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-background/50 border border-border/30"
            >
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-lg bg-accent/10">
                  <AlertTriangle className="h-4 w-4 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant="outline" className="font-mono">{gap.range}</Badge>
                    <Badge className={
                      gap.priority === 'high' 
                        ? 'bg-accent text-accent-foreground' 
                        : 'bg-muted text-muted-foreground'
                    }>
                      {gap.priority === 'high' ? 'High Priority' : 'Medium Priority'}
                    </Badge>
                  </div>
                  <p className="text-sm text-foreground">{gap.description}</p>
                  <p className="text-xs text-accent mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3" />
                    {gap.opportunity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Price Elasticity */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Price Elasticity Analysis</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/30">
              <p className="text-2xl font-bold text-accent">{pricingDiagnosis.elasticity.assessment}</p>
              <p className="text-xs text-muted-foreground">Elasticity Level</p>
            </div>
            <p className="text-sm text-foreground/80 flex-1">{pricingDiagnosis.elasticity.insight}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-foreground mb-2">Recommendations:</p>
            <ul className="space-y-2">
              {pricingDiagnosis.elasticity.recommendations.map((rec, index) => (
                <li key={index} className="text-sm text-foreground/80 flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-accent flex-shrink-0 mt-0.5" />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Feature Comparison Table */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base">Feature-Price Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50">
                  <th className="text-left py-2 px-3 font-medium text-muted-foreground">Feature</th>
                  <th className="text-center py-2 px-3 font-medium text-accent">You</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">DoorDash</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">HealthMart</th>
                  <th className="text-center py-2 px-3 font-medium text-muted-foreground">WellnessERP</th>
                </tr>
              </thead>
              <tbody>
                {pricingDiagnosis.competitorPriceComparison.map((row, index) => (
                  <tr key={index} className="border-b border-border/30">
                    <td className="py-2 px-3 text-foreground">{row.feature}</td>
                    <td className="py-2 px-3 text-center">
                      {row.you === '✓' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                      ) : row.you === '✗' ? (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-accent">{row.you}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {row.competitor1 === '✓' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                      ) : row.competitor1 === '✗' ? (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{row.competitor1}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {row.competitor2 === '✓' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                      ) : row.competitor2 === '✗' ? (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{row.competitor2}</span>
                      )}
                    </td>
                    <td className="py-2 px-3 text-center">
                      {row.competitor3 === '✓' ? (
                        <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                      ) : row.competitor3 === '✗' ? (
                        <XCircle className="h-4 w-4 text-red-500 mx-auto" />
                      ) : (
                        <span className="text-xs text-muted-foreground">{row.competitor3}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PricingDiagnosis;
