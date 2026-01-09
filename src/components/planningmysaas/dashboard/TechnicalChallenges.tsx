import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { technicalChallenges } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const TechnicalChallenges = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-amber-500/10"><AlertTriangle className="h-5 w-5 text-amber-500" /></div>
      <div><h2 className="text-lg font-semibold text-foreground">Technical Challenges & Solutions</h2><p className="text-sm text-muted-foreground">Anticipated hurdles and how to overcome them</p></div>
    </div>
    <div className="grid gap-3">
      {technicalChallenges.map((c, i) => (
        <Card key={i} className="bg-card/50 border-border/50">
          <CardContent className="p-4">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2"><AlertTriangle className={`h-4 w-4 ${c.severity === "High" ? "text-red-500" : "text-amber-500"}`} /><h3 className="font-semibold text-sm text-foreground">{c.challenge}</h3></div>
              <div className="flex gap-1.5"><Badge variant={c.severity === "High" ? "destructive" : "outline"} className="text-[10px]">{c.severity}</Badge><Badge variant="secondary" className="text-[10px]">{c.category}</Badge></div>
            </div>
            <p className="text-xs text-muted-foreground mb-3">{c.description}</p>
            <div className="p-3 rounded-md bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-1.5 mb-1.5"><CheckCircle2 className="h-3 w-3 text-green-500" /><span className="text-xs font-medium text-green-500">Solution</span></div>
              <p className="text-xs text-foreground/80">{c.solution}</p>
              <div className="flex items-center gap-1 mt-1.5 text-[10px] text-muted-foreground"><Clock className="h-3 w-3" />{c.estimatedEffort}</div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default TechnicalChallenges;
