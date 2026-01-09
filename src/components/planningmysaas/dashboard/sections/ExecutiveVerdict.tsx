import { 
  TrendingUp, 
  PiggyBank, 
  Target, 
  Clock, 
  AlertTriangle, 
  CheckCircle2,
  ShieldCheck,
  ArrowRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { reportData } from "@/lib/reportMockData";

const iconMap: Record<string, React.ElementType> = {
  TrendingUp,
  PiggyBank,
  Target,
  Clock,
};

const ExecutiveVerdict = () => {
  const data = reportData;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "text-red-400 bg-red-400/10 border-red-400/20";
      case "medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "low": return "text-green-400 bg-green-400/10 border-green-400/20";
      default: return "text-muted-foreground bg-muted/10 border-border/20";
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case "high": return "Alto";
      case "medium": return "Médio";
      case "low": return "Baixo";
      default: return priority;
    }
  };

  return (
    <section id="executive-verdict" className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <ShieldCheck className="h-5 w-5 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">O Veredicto</h2>
          <p className="text-sm text-muted-foreground">Resumo executivo da análise</p>
        </div>
      </div>

      {/* Main Summary Card */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6 md:p-8">
          {/* Narrative Summary */}
          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-lg text-foreground/90 leading-relaxed whitespace-pre-line">
              {data.executiveSummary}
            </p>
          </div>

          {/* Recommendation Badge */}
          <div className="flex items-center gap-3 mb-8 p-4 rounded-lg bg-green-500/10 border border-green-500/20">
            <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0" />
            <div>
              <span className="text-sm text-muted-foreground">Recomendação:</span>
              <span className="ml-2 text-lg font-semibold text-green-400">
                {data.recommendation}
              </span>
            </div>
          </div>

          {/* Highlights Grid */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-accent" />
              Pontos Fortes
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.highlights.map((highlight, index) => {
                const IconComponent = iconMap[highlight.icon] || CheckCircle2;
                return (
                  <div 
                    key={index}
                    className="flex gap-4 p-4 rounded-lg bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                  >
                    <div className="p-2 rounded-lg bg-accent/10 h-fit">
                      <IconComponent className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{highlight.text}</p>
                      <p className="text-sm text-muted-foreground mt-1">{highlight.detail}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Risks Section */}
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
              Riscos Identificados
            </h3>
            <div className="space-y-4">
              {data.risks.map((item, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-lg bg-card border border-border/30"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <p className="font-medium text-foreground">{item.risk}</p>
                    <Badge 
                      variant="outline" 
                      className={`flex-shrink-0 ${getPriorityColor(item.priority)}`}
                    >
                      {getPriorityLabel(item.priority)}
                    </Badge>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <ArrowRight className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                    <p className="text-muted-foreground">
                      <span className="text-green-400 font-medium">Mitigação:</span>{" "}
                      {item.mitigation}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </section>
  );
};

export default ExecutiveVerdict;
