import { Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { userJourneyData } from "@/lib/dashboardMockData";

const UserJourneyChart = () => {
  const { businessType, stages } = userJourneyData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><Users className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-lg font-semibold text-foreground">User Journey</h2><p className="text-sm text-muted-foreground">{businessType}</p></div>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardContent className="pt-6">
          <div className="space-y-4">
            {stages.map((s, i) => (
              <div key={i} className="relative">
                <div className="flex items-center gap-3">
                  <div className="w-20 text-right"><span className="text-lg font-semibold" style={{ color: s.color }}>{s.percentage}%</span><div className="text-[10px] text-muted-foreground">{s.users.toLocaleString()} users</div></div>
                  <div className="flex-1">
                    <div className="h-10 rounded-md overflow-hidden bg-muted/20" style={{ width: `${s.percentage}%`, minWidth: "100px" }}>
                      <div className="h-full flex items-center px-3" style={{ backgroundColor: s.color + "20", borderLeft: `3px solid ${s.color}` }}>
                        <span className="font-medium text-sm text-foreground">{s.stage}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="ml-24 mt-1.5 flex flex-wrap gap-1.5">
                  {s.actions.map((a, j) => <span key={j} className="text-[10px] px-1.5 py-0.5 rounded-full bg-muted/30 text-muted-foreground">{a}</span>)}
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
