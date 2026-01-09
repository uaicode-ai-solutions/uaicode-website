import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userJourneyData } from "@/lib/dashboardMockData";

const UserJourneyChart = () => {
  const { businessType, stages } = userJourneyData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><Users className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">User Journey</h2><p className="text-muted-foreground">{businessType}</p></div>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {stages.map((s, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-4">
                  <div className="w-24 text-right"><span className="text-2xl font-bold" style={{ color: s.color }}>{s.percentage}%</span><div className="text-xs text-muted-foreground">{s.users.toLocaleString()} users</div></div>
                  <div className="flex-1">
                    <div className="h-12 rounded-lg overflow-hidden bg-muted/20" style={{ width: `${s.percentage}%`, minWidth: "120px" }}>
                      <div className="h-full flex items-center px-4" style={{ backgroundColor: s.color + "20", borderLeft: `4px solid ${s.color}` }}>
                        <span className="font-medium text-foreground">{s.stage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-28 mt-2 flex flex-wrap gap-2">
                  {s.actions.map((a, j) => <span key={j} className="text-xs px-2 py-1 rounded-full bg-muted/30 text-muted-foreground">{a}</span>)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserJourneyChart;
