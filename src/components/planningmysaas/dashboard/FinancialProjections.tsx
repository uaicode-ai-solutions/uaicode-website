import { BarChart3, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { financialProjections } from "@/lib/dashboardMockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const COLORS = ["#FFD700", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];

const FinancialProjections = () => {
  const { totalFirstYearInvestment, breakdown, developmentBreakdown, marketingBreakdown, pricingStrategy } = financialProjections;
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10"><BarChart3 className="h-5 w-5 text-accent" /></div>
        <div><h2 className="text-2xl font-bold text-foreground">Financial Projections</h2><p className="text-muted-foreground">Investment breakdown and cost analysis</p></div>
      </div>
      <Card className="bg-gradient-to-br from-accent/5 to-accent/10 border-accent/20">
        <CardContent className="pt-6">
          <div className="text-center"><div className="text-sm text-muted-foreground mb-2">Total First Year Investment</div><div className="text-4xl font-bold text-accent">{totalFirstYearInvestment}</div></div>
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center p-3 rounded-lg bg-background/50"><div className="text-xl font-bold text-foreground">{breakdown.developmentCost}</div><div className="text-xs text-muted-foreground">Development</div></div>
            <div className="text-center p-3 rounded-lg bg-background/50"><div className="text-xl font-bold text-foreground">{breakdown.marketingYear}</div><div className="text-xs text-muted-foreground">Marketing/Year</div></div>
            <div className="text-center p-3 rounded-lg bg-background/50"><div className="text-xl font-bold text-foreground">{breakdown.infrastructureYear}</div><div className="text-xs text-muted-foreground">Infra/Year</div></div>
          </div>
        </CardContent>
      </Card>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Development Cost Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={developmentBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percentage }) => `${name}: ${percentage}%`} labelLine={false}>{developmentBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => `$${v.toLocaleString()}`} /></PieChart></ResponsiveContainer></div>
          </CardContent>
        </Card>
        <Card className="bg-card/50 border-border/50">
          <CardHeader><CardTitle className="text-lg">Marketing & Acquisition Costs</CardTitle></CardHeader>
          <CardContent>
            <div className="h-64"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={marketingBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, percentage }) => `${name}: ${percentage}%`} labelLine={false}>{marketingBreakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={(v) => `$${v.toLocaleString()}`} /></PieChart></ResponsiveContainer></div>
          </CardContent>
        </Card>
      </div>
      <Card className="bg-card/50 border-border/50">
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><DollarSign className="h-5 w-5 text-accent" />Recommended Pricing Strategy</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-accent/10"><div className="text-2xl font-bold text-accent">{pricingStrategy.idealTicket}</div><div className="text-xs text-muted-foreground">Ideal Ticket</div></div>
            <div className="text-center p-4 rounded-lg bg-muted/30"><div className="text-2xl font-bold text-foreground">{pricingStrategy.marketAverage}</div><div className="text-xs text-muted-foreground">Market Average</div></div>
            <div className="text-center p-4 rounded-lg bg-muted/30"><div className="text-xl font-bold text-foreground">{pricingStrategy.positioning}</div><div className="text-xs text-muted-foreground">Positioning</div></div>
            <div className="text-center p-4 rounded-lg bg-green-500/10"><div className="text-2xl font-bold text-green-500">{pricingStrategy.breakEvenMonths} mo</div><div className="text-xs text-muted-foreground">Break-even</div></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialProjections;
