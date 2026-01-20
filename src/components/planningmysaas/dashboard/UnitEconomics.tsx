import { DollarSign, TrendingUp, Clock, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { unitEconomicsData } from "@/lib/dashboardMockData";
import ScoreCircle from "./ui/ScoreCircle";

const UnitEconomics = () => {
  const { idealTicket, paybackPeriod, ltv, cac, ltvCacRatio, monthlyChurn, grossMargin, howItWorks } = unitEconomicsData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><DollarSign className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-lg font-semibold text-foreground">Unit Economics</h2><p className="text-sm text-muted-foreground">Your path to profitability</p></div>
      </div>
      <Card className="bg-accent/5 border-accent/20">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6 flex-wrap">
            <ScoreCircle score={Math.min(Math.round(ltvCacRatio * 8), 100)} label="LTV/CAC" color="accent" size="lg" />
            <div><h3 className="text-lg font-semibold text-foreground">LTV/CAC Ratio: {ltvCacRatio}x</h3><p className="text-sm text-muted-foreground">Excellent! Target is &gt;3x. Your ratio indicates very healthy unit economics.</p></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><DollarSign className="h-5 w-5 mx-auto text-accent mb-2" /><div className="text-2xl font-bold text-accent">{idealTicket}</div><div className="text-xs text-muted-foreground">Ideal Ticket</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><Clock className="h-5 w-5 mx-auto text-muted-foreground mb-2" /><div className="text-2xl font-bold text-foreground">{paybackPeriod}</div><div className="text-xs text-muted-foreground">Payback Period</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><TrendingUp className="h-5 w-5 mx-auto text-accent mb-2" /><div className="text-2xl font-bold text-accent">{ltv}</div><div className="text-xs text-muted-foreground">LTV (Lifetime Value)</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><Target className="h-5 w-5 mx-auto text-muted-foreground mb-2" /><div className="text-2xl font-bold text-foreground">{cac}</div><div className="text-xs text-muted-foreground">CAC</div></CardContent></Card>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-foreground">{monthlyChurn}</div><div className="text-sm text-muted-foreground">Monthly Churn Rate</div></div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6"><div className="text-center"><div className="text-2xl font-bold text-foreground">{grossMargin}</div><div className="text-sm text-muted-foreground">Gross Margin</div></div></CardContent></Card>
      </div>
      {/* How It Works - Educational Banner (same style as J-Curve expected) */}
      <div className="flex items-start gap-3 text-sm text-amber-600/80 bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
        <DollarSign className="h-5 w-5 mt-0.5 flex-shrink-0 text-amber-500" />
        <div>
          <strong className="text-amber-500">How It Works:</strong>{' '}
          <span className="text-muted-foreground">{howItWorks}</span>
        </div>
      </div>
    </div>
  );
};

export default UnitEconomics;
