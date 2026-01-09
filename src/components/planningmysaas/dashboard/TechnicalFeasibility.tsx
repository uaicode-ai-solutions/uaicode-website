import { Cpu, Clock, Layers } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technicalData, developmentPhases } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";
import { Badge } from "@/components/ui/badge";

const TechnicalFeasibility = () => {
  const { description, feasibilityScore, complexityLevel, estimatedDevTime, recommendedStack } = technicalData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><Cpu className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">Technical Feasibility</h2><p className="text-muted-foreground">Technology and development roadmap</p></div>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 flex-wrap">
            <ScoreCircle score={feasibilityScore} label="Feasibility" color="accent" size="lg" />
            <div className="flex-1"><p className="text-sm text-muted-foreground mb-3">{description}</p><div className="flex gap-4"><Badge variant="outline">{complexityLevel}</Badge><span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="h-4 w-4" />{estimatedDevTime}</span></div></div>
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="flex items-center gap-2 text-lg"><Layers className="h-5 w-5 text-accent" />Recommended Tech Stack</CardTitle></CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(recommendedStack).map(([category, items]) => (
              <div key={category} className="p-4 rounded-lg bg-muted/20">
                <h4 className="font-medium text-foreground capitalize mb-3">{category}</h4>
                <div className="space-y-2">{items.map((item, i) => (
                  <div key={i} className="text-sm"><span className="text-accent">{item.tech}</span><span className="text-muted-foreground ml-2">- {item.reason}</span></div>
                ))}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Development Phases (UAICode Strategy)</CardTitle></CardHeader>
        <CardContent>
          <div className="space-y-6">{developmentPhases.map((p) => (
            <div key={p.phase} className="relative pl-8 pb-6 border-l-2 border-accent/30 last:border-transparent last:pb-0">
              <div className="absolute -left-3 top-0 w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm font-bold">{p.phase}</div>
              <div className="flex items-center gap-3 mb-2"><h4 className="font-semibold text-foreground">{p.name}</h4><Badge variant="outline">{p.duration}</Badge></div>
              <p className="text-sm text-muted-foreground mb-3">{p.description}</p>
              <div className="flex flex-wrap gap-2">{p.deliverables.map((d, i) => <Badge key={i} variant="secondary" className="text-xs">{d}</Badge>)}</div>
            </div>
          ))}</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TechnicalFeasibility;
