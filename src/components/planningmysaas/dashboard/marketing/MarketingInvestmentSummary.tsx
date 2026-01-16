import { PieChart as PieChartIcon, Check, AlertCircle, Minus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { MarketingTotals, MarketingService } from "@/hooks/useMarketingTiers";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

interface MarketingInvestmentSummaryProps {
  selectedServiceIds: string[];
  services: MarketingService[];
  totals: MarketingTotals;
  suggestedPaidMedia?: number; // in cents
  budgetSource?: string | null; // User's budget selection from wizard
}

const formatCurrency = (cents: number) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
};

const CHART_COLORS = [
  "hsl(var(--accent))",
  "hsl(var(--muted-foreground))",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border/50 rounded-lg px-3 py-2 shadow-lg">
        <p className="text-xs text-muted-foreground">{payload[0].name}</p>
        <p className="text-sm font-semibold text-foreground">
          ${payload[0].value.toLocaleString()}/mo
        </p>
      </div>
    );
  }
  return null;
};

const MarketingInvestmentSummary = ({
  selectedServiceIds,
  services,
  totals,
  suggestedPaidMedia = 500000, // $5,000 default
  budgetSource,
}: MarketingInvestmentSummaryProps) => {
  const selectedServices = services.filter((s) =>
    selectedServiceIds.includes(s.service_id)
  );

  const totalMonthly = totals.uaicodeTotal + suggestedPaidMedia;

  // Chart data
  const marketingChartData = [
    {
      name: "Uaicode Subscription",
      value: totals.uaicodeTotal / 100,
      fill: CHART_COLORS[0],
    },
    {
      name: "Paid Media Budget",
      value: suggestedPaidMedia / 100,
      fill: CHART_COLORS[1],
    },
  ];

  // No services selected
  if (selectedServiceIds.length === 0) {
    return (
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-5 text-center">
          <div className="flex items-center justify-center gap-2 text-muted-foreground">
            <AlertCircle className="h-4 w-4" />
            <span className="text-sm">Select at least one service to see your investment summary</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-muted/30 border-border/50 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10 transition-all duration-300">
      <CardContent className="p-5">
        {/* Total Investment - Centralized */}
        <div className="text-center mb-6">
          <p className="text-sm text-muted-foreground mb-1">Your Marketing Investment</p>
          <div className="text-4xl md:text-5xl font-bold text-gradient-gold">
            {formatCurrency(totalMonthly)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            per month • {selectedServiceIds.length} service{selectedServiceIds.length !== 1 ? "s" : ""} selected
          </p>
        </div>

        {/* Grid: Chart + Legend */}
        <div className="grid md:grid-cols-2 gap-4 mb-5">
          {/* Donut Chart */}
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={marketingChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={2}
                  dataKey="value"
                  stroke="none"
                >
                  {marketingChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend - Breakdown */}
          <div className="space-y-3 flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1">
              <div className="p-2 rounded-lg bg-accent/10">
                <PieChartIcon className="h-4 w-4 text-accent" />
              </div>
              <h4 className="font-medium text-foreground text-sm">Monthly Breakdown</h4>
            </div>

            {/* Uaicode Subscription */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-accent/10 border-l-4 border-accent">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[0] }} />
                <span className="text-xs text-foreground">Uaicode Subscription</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(totals.uaicodeTotal)}
              </span>
            </div>

            {/* Paid Media Budget */}
            <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/20 border-l-4 border-accent/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: CHART_COLORS[1] }} />
                <span className="text-xs text-foreground">Paid Media Budget*</span>
              </div>
              <span className="text-sm font-semibold text-foreground">
                {formatCurrency(suggestedPaidMedia)}
              </span>
            </div>
          </div>
        </div>

        {/* Services Included */}
        <div className="pt-5 border-t border-border/30">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2 text-sm">
            <Check className="h-4 w-4 text-accent" />
            Services Included
          </h3>
          <ul className="space-y-2">
            {selectedServices.map((service) => (
              <li 
                key={service.service_id} 
                className="flex items-center justify-between text-xs bg-accent/10 p-2 rounded-lg border border-accent/10"
              >
                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-accent flex-shrink-0" />
                  <span className="text-muted-foreground">{service.service_name}</span>
                </div>
                <span className="font-medium text-foreground">
                  {formatCurrency(service.uaicode_price_cents)}/mo
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Disclaimer */}
        <div className="mt-4 flex items-start gap-2 text-[10px] text-muted-foreground">
          <AlertCircle className="h-3 w-3 mt-0.5 flex-shrink-0" />
          <span>
            {budgetSource && budgetSource !== "guidance"
              ? `*Based on your selected budget range (${budgetSource.replace("-", " - $").replace("k", "K")}). You can adjust as needed.`
              : "*Calculated at 75% of your subscription (min $3K, max $15K). You can start smaller and scale as you see results."}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MarketingInvestmentSummary;
