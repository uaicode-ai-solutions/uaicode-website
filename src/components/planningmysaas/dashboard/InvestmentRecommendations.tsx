import { TrendingUp, DollarSign, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { investmentData } from "@/lib/dashboardMockData";
import { Badge } from "@/components/ui/badge";

const InvestmentRecommendations = () => {
  const { monthlyMarketing, yearlyMarketing, cacEstimate, adsMonthlyBudget, infrastructureMonthly, recommendedChannels } = investmentData;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><TrendingUp className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">Investment Recommendations</h2><p className="text-muted-foreground">Where to allocate your budget</p></div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><DollarSign className="h-5 w-5 mx-auto text-accent mb-2" /><div className="text-xl font-bold text-foreground">{monthlyMarketing}</div><div className="text-xs text-muted-foreground">Monthly Marketing</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><DollarSign className="h-5 w-5 mx-auto text-accent mb-2" /><div className="text-xl font-bold text-foreground">{yearlyMarketing}</div><div className="text-xs text-muted-foreground">Yearly Marketing</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><Target className="h-5 w-5 mx-auto text-amber-500 mb-2" /><div className="text-xl font-bold text-foreground">{cacEstimate}</div><div className="text-xs text-muted-foreground">CAC Estimate</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><TrendingUp className="h-5 w-5 mx-auto text-blue-500 mb-2" /><div className="text-xl font-bold text-foreground">{adsMonthlyBudget}</div><div className="text-xs text-muted-foreground">ADS Budget/mo</div></CardContent></Card>
        <Card className="bg-card/50 border-border/50"><CardContent className="pt-6 text-center"><DollarSign className="h-5 w-5 mx-auto text-green-500 mb-2" /><div className="text-xl font-bold text-foreground">{infrastructureMonthly}</div><div className="text-xs text-muted-foreground">Infrastructure/mo</div></CardContent></Card>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg">Recommended Channels</CardTitle></CardHeader>
        <CardContent><div className="space-y-4">{recommendedChannels.map((c, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/20">
            <div className="flex-1"><div className="flex justify-between mb-1"><span className="font-medium text-foreground">{c.name}</span><span className="text-accent">{c.budget}</span></div><div className="h-2 bg-muted/30 rounded-full overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${c.allocation}%` }} /></div></div>
            <div className="flex items-center gap-2"><Badge variant={c.priority === "High" ? "default" : "outline"}>{c.priority}</Badge><span className="text-xs text-green-500">{c.expectedROI} ROI</span></div>
          </div>
        ))}</div></CardContent>
      </Card>
    </div>
  );
};

export default InvestmentRecommendations;
