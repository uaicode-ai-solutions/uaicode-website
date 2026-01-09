import { Target, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { engagementLoops } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const EngagementLoops = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><Target className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Engagement & Retention Loops</h2><p className="text-muted-foreground">Keep users coming back</p></div>
    </div>
    <div className="grid md:grid-cols-2 gap-4">
      {engagementLoops.map((l, i) => (
        <Card key={i} className="bg-card/50 border-border/50 hover:border-accent/30 transition-colors">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2"><RefreshCw className="h-4 w-4 text-accent" />{l.name}</span>
              <Badge variant={l.retentionImpact === "High" ? "default" : "outline"}>{l.retentionImpact}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-muted-foreground">Type:</span><span className="ml-2 text-foreground">{l.type}</span></div>
                <div><span className="text-muted-foreground">Frequency:</span><span className="ml-2 text-foreground">{l.frequency}</span></div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="p-2 rounded bg-blue-500/10"><span className="text-blue-400 font-medium">Trigger:</span><span className="ml-2 text-foreground/80">{l.trigger}</span></div>
                <div className="p-2 rounded bg-purple-500/10"><span className="text-purple-400 font-medium">Action:</span><span className="ml-2 text-foreground/80">{l.action}</span></div>
                <div className="p-2 rounded bg-green-500/10"><span className="text-green-400 font-medium">Reward:</span><span className="ml-2 text-foreground/80">{l.reward}</span></div>
                <div className="p-2 rounded bg-accent/10"><span className="text-accent font-medium">Variable:</span><span className="ml-2 text-foreground/80">{l.variableReward}</span></div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default EngagementLoops;
