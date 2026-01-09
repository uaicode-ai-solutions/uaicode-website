import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { marketTrends } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const MarketTrends = () => (
  <div className="space-y-6">
    <div className="flex items-center gap-3">
      <div className="p-2 rounded-lg bg-accent/10"><TrendingUp className="h-5 w-5 text-accent" /></div>
      <div><h2 className="text-2xl font-bold text-foreground">Key Market Trends</h2><p className="text-muted-foreground">Stay ahead of the curve</p></div>
    </div>
    <div className="grid gap-4">
      {marketTrends.map((t, i) => (
        <Card key={i} className="bg-card/50 border-border/50 hover:border-accent/30 transition-colors">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between gap-4 mb-3">
              <h3 className="font-semibold text-foreground">{t.trend}</h3>
              <div className="flex gap-2">
                <Badge variant={t.impact === "High" ? "default" : "outline"}>{t.impact} Impact</Badge>
                <Badge variant={t.relevance === "Direct" ? "default" : "secondary"}>{t.relevance}</Badge>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-3">{t.description}</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-accent font-medium">Opportunity: {t.opportunity}</span>
              <span className="text-muted-foreground">{t.timeframe}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);

export default MarketTrends;
