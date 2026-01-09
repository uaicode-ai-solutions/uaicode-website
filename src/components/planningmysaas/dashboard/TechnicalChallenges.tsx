import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technicalChallenges } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const TechnicalChallenges = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Technical Challenges & Solutions</h2><p className="text-muted-foreground">Anticipated hurdles and how to overcome them</p></div>
    </div>
    <div className="grid gap-4">
      {technicalChallenges.map((c, i) => (
        <Card key={i} className="bg-card/50 border-border/50">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex items-center gap-2"><AlertTriangle className={`h-5 w-5 ${c.severity === "High" ? "text-red-500" : "text-amber-500"}`} /><h3 className="font-semibold text-foreground">{c.challenge}</h3></div>
              <div className="flex gap-2"><Badge variant={c.severity === "High" ? "destructive" : "outline"}>{c.severity}</Badge><Badge variant="secondary">{c.category}</Badge></div>
            </div>
            <p className="text-sm text-muted-foreground mb-4">{c.description}</p>
            <div className="p-4 rounded-lg bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2 mb-2"><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-sm font-medium text-green-500">Solution</span></div>
              <p className="text-sm text-foreground/80">{c.solution}</p>
              <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground"><Clock className="h-3 w-3" />{c.estimatedEffort}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default TechnicalChallenges;
