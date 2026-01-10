import { AlertTriangle, CheckCircle2, XCircle, Lightbulb, TrendingUp, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { competitorAnalysisData } from "@/lib/competitorAnalysisMockData";

const statusConfig = {
  strong: { color: "bg-green-500", text: "text-green-500", label: "Strong", icon: CheckCircle2 },
  medium: { color: "bg-yellow-500", text: "text-yellow-500", label: "Medium", icon: AlertTriangle },
  weak: { color: "bg-red-500", text: "text-red-500", label: "Weak", icon: XCircle },
};

const priorityConfig = {
  high: { color: "bg-accent text-accent-foreground", label: "High Priority" },
  medium: { color: "bg-yellow-500/20 text-yellow-600", label: "Medium Priority" },
  low: { color: "bg-muted text-muted-foreground", label: "Low Priority" },
};

const PaidMediaDiagnosis = () => {
  const { paidMediaDiagnosis } = competitorAnalysisData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h3 className="text-lg font-semibold text-foreground">Paid Media Diagnosis</h3>
        <p className="text-sm text-muted-foreground">Analysis of competitor advertising strategies, gaps, and opportunities</p>
      </div>

      {/* Competitor Analysis Cards */}
      <div className="space-y-4">
        {paidMediaDiagnosis.competitors.map((competitor, index) => (
          <Card key={index} className="bg-card/50 border-border/50">
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-base">{competitor.name}</CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    Est. Budget: <span className="font-semibold text-accent">{competitor.estimatedBudget}</span>
                  </p>
                </div>
                <Badge variant="outline">{competitor.frequency}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Platform Grid */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Platform Presence</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {competitor.platforms.map((platform, i) => {
                    const config = statusConfig[platform.status as keyof typeof statusConfig];
                    const StatusIcon = config.icon;
                    return (
                      <div 
                        key={i} 
                        className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 border border-border/30"
                      >
                        <div className={`w-2 h-2 rounded-full ${config.color}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{platform.name}</p>
                          <p className="text-xs text-muted-foreground">{platform.spend}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Ad Types */}
              <div>
                <p className="text-xs text-muted-foreground mb-2">Ad Types Used</p>
                <div className="flex flex-wrap gap-1">
                  {competitor.adTypes.map((type, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{type}</Badge>
                  ))}
                </div>
              </div>

              {/* Strengths, Weaknesses, Opportunities Grid */}
              <div className="grid md:grid-cols-3 gap-4 pt-2">
                {/* Strengths */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                    <span className="text-sm font-medium text-green-500">Strengths</span>
                  </div>
                  <ul className="space-y-1">
                    {competitor.strengths.map((s, i) => (
                      <li key={i} className="text-xs text-foreground/80 pl-6">• {s}</li>
                    ))}
                  </ul>
                </div>

                {/* Weaknesses */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span className="text-sm font-medium text-red-500">Weaknesses</span>
                  </div>
                  <ul className="space-y-1">
                    {competitor.weaknesses.map((w, i) => (
                      <li key={i} className="text-xs text-foreground/80 pl-6">• {w}</li>
                    ))}
                  </ul>
                </div>

                {/* Opportunities */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent">Opportunities</span>
                  </div>
                  <ul className="space-y-1">
                    {competitor.opportunities.map((o, i) => (
                      <li key={i} className="text-xs text-foreground/80 pl-6">• {o}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Market Gaps Section */}
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-accent" />
            Market Gaps & Opportunities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {paidMediaDiagnosis.marketGaps.map((gap, index) => (
            <div 
              key={index}
              className="p-4 rounded-lg bg-background/50 border border-border/30"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge className={priorityConfig[gap.priority as keyof typeof priorityConfig].color}>
                      {priorityConfig[gap.priority as keyof typeof priorityConfig].label}
                    </Badge>
                  </div>
                  <p className="text-sm font-medium text-foreground">{gap.gap}</p>
                  <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                    <TrendingUp className="h-3 w-3 text-accent" />
                    {gap.opportunity}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Overall Assessment */}
      <div className="p-4 rounded-xl bg-muted/30 border border-border/30">
        <p className="text-sm text-foreground/80 italic">
          <span className="font-semibold text-foreground">Assessment: </span>
          {paidMediaDiagnosis.overallAssessment}
        </p>
      </div>
    </div>
  );
};

export default PaidMediaDiagnosis;
