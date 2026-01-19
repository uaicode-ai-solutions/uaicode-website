import { GitBranch, RefreshCw, Package, AlertTriangle, CheckCircle2, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { parseJsonField, parseScoreField, emptyStates } from "@/lib/reportDataUtils";
import { useSmartFallbackField } from "@/hooks/useSmartFallbackField";
import { InlineValueSkeleton, CardContentSkeleton } from "@/components/ui/fallback-skeleton";

interface PivotScenariosData {
  readinessScore: number;
  scenarios: Array<{ name: string; effortToShift: string; viability: number; marketSize: string; trigger: string }>;
  reusableAssets: Array<{ asset: string; reusabilityScore: number }>;
  decisionTriggers: Array<{ metric: string; threshold: string; action: string }>;
}

const PivotScenariosSection = () => {
  const { report, reportData, reportId } = useReportContext();
  const wizardId = reportData?.wizard_id;
  
  // Parse pivot scenarios from report
  const rawPivotScenarios = parseJsonField<PivotScenariosData>(report?.pivot_scenarios, null);
  const pivotReadinessScore = parseScoreField(report?.pivot_readiness_score, 0);
  
  // Smart fallback for readiness score
  const { value: fallbackReadinessScore, isLoading: scoreLoading } = useSmartFallbackField<number>({
    fieldPath: "pivot_scenarios.readinessScore",
    currentValue: pivotReadinessScore || rawPivotScenarios?.readinessScore,
  });
  
  // Smart fallback for scenarios
  const { value: fallbackScenarios, isLoading: scenariosLoading } = useSmartFallbackField<PivotScenariosData['scenarios']>({
    fieldPath: "pivot_scenarios.scenarios",
    currentValue: rawPivotScenarios?.scenarios,
  });
  
  const pivotScenarios = rawPivotScenarios ? {
    ...rawPivotScenarios,
    readinessScore: fallbackReadinessScore ?? pivotReadinessScore ?? rawPivotScenarios.readinessScore ?? 0,
    scenarios: fallbackScenarios ?? rawPivotScenarios.scenarios ?? []
  } : emptyStates.pivotScenarios;

  const getViabilityColor = (viability: number) => {
    if (viability >= 75) return "text-green-400";
    if (viability >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getEffortColor = (effort: string) => {
    switch (effort?.toLowerCase()) {
      case "low": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "medium": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-red-500/10 text-red-400 border-red-500/20";
    }
  };
  
  // Early return if no data and loading
  if (!rawPivotScenarios && scenariosLoading) {
    return (
      <section id="pivot-scenarios" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <GitBranch className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Plan B & Beyond</h2>
            <p className="text-sm text-muted-foreground">Loading pivot scenarios...</p>
          </div>
        </div>
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <CardContentSkeleton lines={4} />
          </CardContent>
        </Card>
      </section>
    );
  }
  
  // Early return if no data
  if (!rawPivotScenarios && !fallbackScenarios) {
    return (
      <section id="pivot-scenarios" className="space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-accent/10">
            <GitBranch className="h-5 w-5 text-accent" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Plan B & Beyond</h2>
            <p className="text-sm text-muted-foreground">Pivot scenarios data not available</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="pivot-scenarios" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <GitBranch className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Plan B & Beyond</h2>
            <InfoTooltip side="right" size="sm">
              Alternative directions if the primary plan needs adjustment
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Pivot scenarios and reusable assets</p>
        </div>
      </div>

      {/* Readiness Score */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Pivot Readiness Score</p>
              <div className="flex items-center gap-3">
                {scoreLoading ? (
                  <InlineValueSkeleton size="xl" />
                ) : (
                  <span className="text-3xl font-bold text-accent">{pivotScenarios.readinessScore}</span>
                )}
                <span className="text-lg text-muted-foreground">/100</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-accent/10">
              <RefreshCw className="h-6 w-6 text-accent" />
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            High flexibility to adjust direction if market signals suggest a pivot is needed.
          </p>
        </CardContent>
      </Card>

      {/* Pivot Scenario Cards */}
      <div className="grid md:grid-cols-3 gap-4">
        {(pivotScenarios.scenarios || []).map((scenario, index) => (
          <Card key={index} className="bg-card/50 border-border/30">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <span className="text-sm font-bold text-accent">{index + 1}</span>
                </div>
                <Badge className={getEffortColor(scenario.effortToShift)}>
                  {scenario.effortToShift} effort
                </Badge>
              </div>
              
              <h4 className="font-semibold text-foreground text-sm mb-3">{scenario.name}</h4>
              
              <div className="space-y-2 mb-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Viability</span>
                  <span className={`font-bold ${getViabilityColor(scenario.viability ?? 0)}`}>
                    {scenario.viability ?? 0}%
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Market Size</span>
                  <span className="font-medium text-foreground">{scenario.marketSize}</span>
                </div>
              </div>
              
              <div className="p-2 rounded-lg bg-orange-500/10 border border-orange-500/20">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-3.5 w-3.5 text-orange-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-muted-foreground">{scenario.trigger}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Reusable Assets & Decision Triggers */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Reusable Assets Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Reusable Assets</h3>
              <InfoTooltip size="sm">
                What can be preserved if you need to pivot
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {(pivotScenarios.reusableAssets || []).map((asset, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-foreground">{asset.asset}</span>
                    <span className="text-sm font-medium text-accent">{asset.reusabilityScore ?? 0}%</span>
                  </div>
                  <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500/60 to-green-500 rounded-full transition-all duration-500"
                      style={{ width: `${asset.reusabilityScore ?? 0}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {(pivotScenarios.reusableAssets || []).length > 0 && (
              <div className="mt-4 pt-4 border-t border-border/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Avg. Reusability</span>
                  <span className="text-lg font-bold text-green-400">
                    {Math.round((pivotScenarios.reusableAssets || []).reduce((acc, a) => acc + (a.reusabilityScore ?? 0), 0) / (pivotScenarios.reusableAssets?.length || 1))}%
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Decision Triggers Card */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-5">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-4 w-4 text-accent" />
              <h3 className="font-semibold text-foreground text-sm">Decision Triggers</h3>
              <InfoTooltip size="sm">
                Metrics that signal when to consider a pivot
              </InfoTooltip>
            </div>
            
            <div className="space-y-3">
              {(pivotScenarios.decisionTriggers || []).map((trigger, index) => (
                <div key={index} className="p-3 rounded-lg bg-muted/10 border border-border/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-foreground">{trigger.metric}</span>
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 text-xs">
                      Threshold
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{trigger.threshold}</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-accent">{trigger.action}</span>
                  </div>
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
            With a {scoreLoading ? <InlineValueSkeleton size="sm" /> : (pivotScenarios.readinessScore ?? 0)}% pivot readiness score and ~{Math.round((pivotScenarios.reusableAssets || []).reduce((acc, a) => acc + (a.reusabilityScore ?? 0), 0) / (pivotScenarios.reusableAssets?.length || 1))}% average asset reusability, 
            you have strong optionality. If triggers are hit, you can pivot efficiently while preserving most of your investment.
          </p>
        </div>
      </div>
    </section>
  );
};

export default PivotScenariosSection;
