import { DollarSign, TrendingUp, PiggyBank, Calculator, Megaphone, Target, ArrowUpRight, Wallet, Users, BarChart3, Sparkles, Check, AlertTriangle } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  ReferenceLine,
  ReferenceDot,
  LineChart,
  Line,
  Label,
} from "recharts";

interface MarketPricing {
  averageTicket: number;
  priceRange: { min: number; max: number };
  pricingModel: string;
}

interface FinancialProjectionsProps {
  data: {
    developmentCost: {
      min: number;
      max: number;
      breakdown: { item: string; percentage: number }[];
    };
    marketingCosts?: {
      monthlyBudget: number;
      yearlyBudget: number;
      cacEstimate: number;
      adsBudgetMin: number;
      adsBudgetMax: number;
    };
    revenueProjections: {
      year1: { mrr: number; arr: number };
      year2: { mrr: number; arr: number };
      year3: { mrr: number; arr: number };
    };
    breakEvenAnalysis: {
      monthsToBreakEven: number;
      assumptions: string[];
    };
    roiEstimate: {
      percentage: number;
      timeframe: string;
    };
    recommendedPricing?: {
      idealTicket: number;
      minimumTicket: number;
      competitiveAdvantage: string;
    };
  };
  marketPricing?: MarketPricing;
  recommendedPlan?: string;
}

// Infrastructure costs by plan
const INFRASTRUCTURE_COSTS: Record<string, number> = {
  Starter: 500,
  Growth: 1000,
  Enterprise: 2000,
};

const COLORS = ["hsl(47, 100%, 50%)", "hsl(47, 80%, 60%)", "hsl(47, 60%, 70%)", "hsl(47, 40%, 80%)", "hsl(200, 50%, 50%)"];

export function FinancialProjectionsSection({ data, marketPricing, recommendedPlan = "Starter" }: FinancialProjectionsProps) {
  // Infrastructure cost based on plan
  const monthlyInfrastructure = INFRASTRUCTURE_COSTS[recommendedPlan] || 500;
  const yearlyInfrastructure = monthlyInfrastructure * 12;

  // Default marketing costs if not provided
  const marketingCosts = data.marketingCosts || {
    monthlyBudget: 1500,
    yearlyBudget: 18000,
    cacEstimate: 150,
    adsBudgetMin: 7.5,
    adsBudgetMax: 45,
  };

  // Default market pricing if not provided
  const pricing = marketPricing || {
    averageTicket: 49,
    priceRange: { min: 29, max: 99 },
    pricingModel: "Per User",
  };

  // Calculate ideal ticket if not provided by AI
  const avgCustomerLifetimeMonths = 24;
  const targetLtvCacRatio = 3;
  const calculatedMinimumTicket = (marketingCosts.cacEstimate * targetLtvCacRatio) / avgCustomerLifetimeMonths;
  const calculatedIdealTicket = pricing.averageTicket * 0.85; // 15% below market

  const recommendedPricing = data.recommendedPricing || {
    idealTicket: Math.max(calculatedIdealTicket, calculatedMinimumTicket),
    minimumTicket: calculatedMinimumTicket,
    competitiveAdvantage: `${Math.round((1 - calculatedIdealTicket / pricing.averageTicket) * 100)}% below market average, designed to accelerate customer acquisition`,
  };

  // Calculate LTV/CAC ratio
  const ltv = recommendedPricing.idealTicket * avgCustomerLifetimeMonths;
  const ltvCacRatio = ltv / marketingCosts.cacEstimate;
  const discountFromMarket = Math.round((1 - recommendedPricing.idealTicket / pricing.averageTicket) * 100);

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toFixed(0)}`;
  };

  // Generate monthly MRR data for 36 months
  const generateMonthlyRevenueData = () => {
    const startingMRR = data.revenueProjections.year1.mrr / 12; // Starting MRR (monthly)
    const growthRate = 0.05; // 5% monthly growth

    return Array.from({ length: 37 }, (_, i) => {
      const mrr = i === 0 ? startingMRR : startingMRR * Math.pow(1 + growthRate, i);
      const isYearEnd = i === 12 || i === 24 || i === 36;
      
      return {
        month: i,
        mrr: Math.round(mrr),
        arr: Math.round(mrr * 12),
        isYearEnd,
      };
    });
  };

  const monthlyRevenueData = generateMonthlyRevenueData();
  
  // Get ARR milestones at year ends
  const arrMilestones = {
    year1: monthlyRevenueData[12],
    year2: monthlyRevenueData[24],
    year3: monthlyRevenueData[36],
  };

  const costBreakdownData = data.developmentCost.breakdown.map((item) => ({
    name: item.item,
    value: item.percentage,
  }));

  // Calculate total first year investment (dev + marketing + infrastructure)
  const avgDevCost = (data.developmentCost.min + data.developmentCost.max) / 2;
  const totalFirstYearInvestment = avgDevCost + marketingCosts.yearlyBudget + yearlyInfrastructure;

  // Generate break-even chart data with realistic 5% monthly growth
  const generateBreakEvenData = () => {
    const months = Math.min(Math.max(data.breakEvenAnalysis.monthsToBreakEven + 4, 12), 36);
    const initialInvestment = avgDevCost;
    const monthlyOperational = marketingCosts.monthlyBudget + monthlyInfrastructure;
    const monthlyRevenue = data.revenueProjections.year1.mrr;
    const growthRate = 0.05; // 5% monthly growth (more conservative/realistic)

    return Array.from({ length: months + 1 }, (_, i) => {
      const cumulativeCosts = initialInvestment + (monthlyOperational * i);
      // Cumulative revenue with compound growth
      const cumulativeRevenue = i === 0 ? 0 : 
        monthlyRevenue * ((Math.pow(1 + growthRate, i) - 1) / growthRate);
      
      return {
        month: i,
        costs: Math.round(cumulativeCosts),
        revenue: Math.round(cumulativeRevenue),
      };
    });
  };

  const breakEvenData = generateBreakEvenData();
  const breakEvenMonth = data.breakEvenAnalysis.monthsToBreakEven;
  const breakEvenPoint = breakEvenData.find(d => d.month === breakEvenMonth);

  // ROI visual calculation
  const roiPercentage = data.roiEstimate.percentage;
  const industryAvgMin = 80;
  const industryAvgMax = 120;
  const roiReturn = (1 + roiPercentage / 100).toFixed(2);

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <DollarSign className="w-5 h-5 text-accent" />
        Financial Projections
      </h2>

      {/* Total First Year Investment */}
      <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-transparent border border-accent/30 rounded-xl p-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground mb-1">Total First Year Investment</p>
            <p className="text-2xl font-bold text-foreground">
              {formatCurrency(totalFirstYearInvestment)}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Dev + Marketing + Infrastructure ({recommendedPlan})
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-card/80 border border-border rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground">Dev Cost</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(avgDevCost)}</p>
            </div>
            <div className="bg-card/80 border border-border rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground">Marketing/Year</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(marketingCosts.yearlyBudget)}</p>
            </div>
            <div className="bg-card/80 border border-border rounded-lg px-3 py-2">
              <p className="text-xs text-muted-foreground">Infra/Year</p>
              <p className="text-sm font-semibold text-foreground">{formatCurrency(yearlyInfrastructure)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Development Cost Breakdown */}
        <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Calculator className="w-4 h-4 text-accent" />
            Development Cost Breakdown
          </h3>
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-0.5">Range</p>
            <p className="text-lg font-bold text-foreground">
              {formatCurrency(data.developmentCost.min)} - {formatCurrency(data.developmentCost.max)}
            </p>
          </div>
          <div className="h-48 md:h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costBreakdownData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="name" 
                  tick={false}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={false}
                  height={10}
                />
                <YAxis 
                  tick={{ fill: 'hsl(var(--foreground))', fontSize: 11 }}
                  axisLine={{ stroke: 'hsl(var(--border))' }}
                  tickLine={{ stroke: 'hsl(var(--border))' }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  formatter={(value: number) => [`${value}%`, 'Percentage']}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                    color: "hsl(var(--foreground))",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))" }}
                  itemStyle={{ color: "hsl(var(--foreground))" }}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {costBreakdownData.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2">
            {costBreakdownData.map((item, index) => {
              const legendLabelMap: Record<string, string> = {
                'Development & Coding (MVP)': 'Dev & Coding (MVP)',
                'Testing & QA': 'Testing & QA',
                'UX/UI Design (essential for MVP)': 'UX/UI Design',
                'Project Management': 'Project Management',
              };
              return (
                <div key={index} className="flex items-center gap-2 text-xs min-w-0">
                  <span
                    className="w-3 h-3 rounded-sm shrink-0"
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-foreground truncate">
                    {legendLabelMap[item.name] || item.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Marketing & Acquisition Costs - Improved */}
        <div className="bg-card border border-border rounded-xl p-4 space-y-4">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
            <Megaphone className="w-4 h-4 text-accent" />
            Marketing & Acquisition Costs
          </h3>
          
          {/* Main metrics in horizontal layout */}
          <div className="flex items-stretch justify-between divide-x divide-border">
            <div className="flex-1 text-center px-3 first:pl-0 last:pr-0">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 mb-2">
                <Wallet className="w-4 h-4 text-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">{formatCurrency(marketingCosts.monthlyBudget)}</p>
              <p className="text-xs text-muted-foreground">Monthly</p>
            </div>
            <div className="flex-1 text-center px-3">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 mb-2">
                <BarChart3 className="w-4 h-4 text-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">{formatCurrency(marketingCosts.yearlyBudget)}</p>
              <p className="text-xs text-muted-foreground">Annual</p>
            </div>
            <div className="flex-1 text-center px-3 last:pr-0">
              <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-accent/10 mb-2">
                <Users className="w-4 h-4 text-accent" />
              </div>
              <p className="text-lg font-bold text-foreground">${marketingCosts.cacEstimate}</p>
              <p className="text-xs text-muted-foreground">CAC</p>
            </div>
          </div>

          {/* ADS Budget */}
          <div className="bg-muted/30 rounded-lg p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">ADS Investment (5-30% CAC)</span>
            </div>
            <span className="text-sm font-semibold text-foreground">
              ${marketingCosts.adsBudgetMin.toFixed(0)} - ${marketingCosts.adsBudgetMax.toFixed(0)}/customer
            </span>
          </div>

          {/* Recommended Pricing Section */}
          <div className="border-t border-border pt-4 mt-2">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-foreground">Recommended Pricing Strategy</span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {/* Ideal Ticket - Highlighted in Yellow/Accent */}
              <div className="bg-gradient-to-br from-accent/30 to-accent/10 border-2 border-accent rounded-lg p-3 text-center relative">
                <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-accent flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-accent-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mb-1">Ideal Ticket</p>
                <p className="text-2xl font-bold text-accent">${recommendedPricing.idealTicket.toFixed(0)}</p>
                <p className="text-xs text-accent font-medium">/month</p>
                {discountFromMarket > 0 && (
                  <span className="inline-block mt-1 px-2 py-0.5 bg-accent/30 text-accent-foreground text-xs rounded-full font-semibold">
                    {discountFromMarket}% below market
                  </span>
                )}
              </div>

              {/* Market Average */}
              <div className="bg-card border border-border rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground mb-1">Market Average</p>
                <p className="text-2xl font-bold text-muted-foreground">${pricing.averageTicket}</p>
                <p className="text-xs text-muted-foreground">/month</p>
                <span className="inline-block mt-1 px-2 py-0.5 bg-muted text-muted-foreground text-xs rounded-full">
                  competitors
                </span>
              </div>
            </div>

            {/* Viability Checks */}
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-xs">
                <Check className={`w-3.5 h-3.5 ${ltvCacRatio >= 3 ? 'text-green-500' : ltvCacRatio >= 2 ? 'text-yellow-500' : 'text-red-500'}`} />
                <span className="text-muted-foreground">LTV/CAC ratio:</span>
                <span className={`font-semibold ${ltvCacRatio >= 3 ? 'text-green-500' : ltvCacRatio >= 2 ? 'text-yellow-500' : 'text-red-500'}`}>
                  {ltvCacRatio.toFixed(1)}x
                </span>
                <span className="text-muted-foreground">(healthy ≥ 3x)</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <Check className="w-3.5 h-3.5 text-green-500" />
                <span className="text-muted-foreground">Competitive:</span>
                <span className="font-medium text-foreground">{discountFromMarket > 0 ? `${discountFromMarket}% below market` : 'At market rate'}</span>
              </div>
              <div className="flex items-center gap-2 text-xs">
                {recommendedPricing.idealTicket >= recommendedPricing.minimumTicket ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <AlertTriangle className="w-3.5 h-3.5 text-yellow-500" />
                )}
                <span className="text-muted-foreground">Break-even:</span>
                <span className="font-medium text-foreground">achievable in {data.breakEvenAnalysis.monthsToBreakEven} months</span>
              </div>
            </div>

            {/* Competitive Advantage Note */}
            <p className="text-xs text-muted-foreground border-l-2 border-accent/50 pl-2 mt-3">
              {recommendedPricing.competitiveAdvantage}
            </p>
          </div>
        </div>
      </div>

      {/* ROI & Break Even - Improved */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* ROI Estimate - Enhanced */}
        <div className="bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 rounded-xl p-4 min-h-[280px] flex flex-col">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-4">
            <TrendingUp className="w-4 h-4 text-accent" />
            ROI Estimate
          </h3>
          
          <div className="flex-1 flex flex-col items-center justify-center">
            {/* Circular gauge visual */}
            <div className="relative w-32 h-32 mb-4">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--muted))"
                  strokeWidth="12"
                />
                {/* Progress arc */}
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  fill="none"
                  stroke="hsl(var(--accent))"
                  strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min((roiPercentage / 300) * 352, 352)} 352`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-accent">{roiPercentage}%</span>
                <ArrowUpRight className="w-4 h-4 text-accent" />
              </div>
            </div>

            {/* Return explanation */}
            <div className="text-center mb-4">
              <p className="text-sm text-foreground">
                <span className="font-semibold">$1</span> invested → <span className="font-bold text-accent">${roiReturn}</span> return
              </p>
              <p className="text-xs text-muted-foreground">{data.roiEstimate.timeframe}</p>
            </div>

            {/* Industry comparison */}
            <div className="w-full space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Industry Avg: {industryAvgMin}-{industryAvgMax}%</span>
                <span className={roiPercentage > industryAvgMax ? "text-accent font-medium" : ""}>
                  {roiPercentage > industryAvgMax ? "Above Average" : roiPercentage >= industryAvgMin ? "On Par" : "Below Average"}
                </span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-accent rounded-full transition-all"
                  style={{ width: `${Math.min((roiPercentage / 200) * 100, 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Break-Even Analysis - With Chart */}
        <div className="bg-card border border-border rounded-xl p-4 min-h-[280px] flex flex-col">
          <h3 className="text-base font-semibold text-foreground flex items-center gap-2 mb-2">
            <PiggyBank className="w-4 h-4 text-accent" />
            Break-Even Analysis
          </h3>
          
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-2xl font-bold text-foreground">{breakEvenMonth}</span>
              <span className="text-sm text-muted-foreground ml-1">months</span>
            </div>
            <div className="text-right text-xs text-muted-foreground">
              ~{formatCurrency(breakEvenPoint?.costs || 0)} at break-even
            </div>
          </div>

          {/* Break-even chart */}
          <div className="flex-1 min-h-[140px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={breakEvenData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <defs>
                  <linearGradient id="costGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 70%, 50%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(0, 70%, 50%)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(142, 70%, 45%)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickFormatter={(v) => `${v}m`}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={10}
                  tickFormatter={(v) => formatCurrency(v)}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    formatCurrency(value),
                    name === "costs" ? "Cumulative Costs" : "Cumulative Revenue",
                  ]}
                  labelFormatter={(label) => `Month ${label}`}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "11px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="costs"
                  stroke="hsl(0, 70%, 50%)"
                  strokeWidth={2}
                  fill="url(#costGradient)"
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(142, 70%, 45%)"
                  strokeWidth={2}
                  fill="url(#revenueGradient)"
                />
                <ReferenceLine 
                  x={breakEvenMonth} 
                  stroke="hsl(var(--accent))" 
                  strokeDasharray="5 5"
                  strokeWidth={1.5}
                />
                {breakEvenPoint && (
                  <ReferenceDot
                    x={breakEvenMonth}
                    y={breakEvenPoint.costs}
                    r={5}
                    fill="hsl(var(--accent))"
                    stroke="hsl(var(--background))"
                    strokeWidth={2}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Legend and assumptions */}
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-border">
            <div className="flex gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(0, 70%, 50%)" }} />
                <span className="text-xs text-muted-foreground">Costs</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(142, 70%, 45%)" }} />
                <span className="text-xs text-muted-foreground">Revenue</span>
              </div>
            </div>
            <span className="text-xs text-muted-foreground">5% monthly growth</span>
          </div>
        </div>
      </div>

      {/* Revenue Projections Chart - Monthly MRR with ARR Milestones */}
      <div className="bg-card border border-border rounded-xl p-4 space-y-3">
        <h3 className="text-base font-semibold text-foreground">3-Year MRR Evolution</h3>
        <p className="text-xs text-muted-foreground">Monthly Recurring Revenue growth over 36 months</p>
        
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyRevenueData} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="month" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={11}
                tickFormatter={(value) => {
                  if (value === 0) return 'Start';
                  if (value === 12) return 'Y1';
                  if (value === 24) return 'Y2';
                  if (value === 36) return 'Y3';
                  return '';
                }}
                ticks={[0, 12, 24, 36]}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                tickFormatter={(value) => formatCurrency(value)}
                fontSize={11}
              />
              <Tooltip
                formatter={(value: number, name: string) => [
                  formatCurrency(value),
                  name === "mrr" ? "MRR" : "ARR",
                ]}
                labelFormatter={(label) => `Month ${label}`}
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
              />
              <Line 
                type="monotone" 
                dataKey="mrr" 
                stroke="hsl(47, 100%, 50%)" 
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 4, fill: "hsl(47, 100%, 50%)" }}
              />
              {/* Year-end milestone markers */}
              <ReferenceDot 
                x={12} 
                y={arrMilestones.year1.mrr} 
                r={6} 
                fill="hsl(47, 100%, 50%)" 
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
              <ReferenceDot 
                x={24} 
                y={arrMilestones.year2.mrr} 
                r={6} 
                fill="hsl(47, 100%, 50%)" 
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
              <ReferenceDot 
                x={36} 
                y={arrMilestones.year3.mrr} 
                r={6} 
                fill="hsl(47, 100%, 50%)" 
                stroke="hsl(var(--background))"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* ARR Milestones Cards */}
        <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Year 1</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(arrMilestones.year1.arr)}</p>
            <p className="text-xs text-muted-foreground">ARR</p>
            <p className="text-xs text-accent mt-1">{formatCurrency(arrMilestones.year1.mrr)} MRR</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Year 2</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(arrMilestones.year2.arr)}</p>
            <p className="text-xs text-muted-foreground">ARR</p>
            <p className="text-xs text-accent mt-1">{formatCurrency(arrMilestones.year2.mrr)} MRR</p>
          </div>
          <div className="bg-background/50 rounded-lg p-3 text-center">
            <p className="text-xs text-muted-foreground mb-1">Year 3</p>
            <p className="text-lg font-bold text-foreground">{formatCurrency(arrMilestones.year3.arr)}</p>
            <p className="text-xs text-muted-foreground">ARR</p>
            <p className="text-xs text-accent mt-1">{formatCurrency(arrMilestones.year3.mrr)} MRR</p>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-between pt-2 border-t border-border">
          <div className="flex gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-6 h-0.5 rounded-full" style={{ backgroundColor: "hsl(47, 100%, 50%)" }} />
              <span className="text-xs text-muted-foreground">MRR Evolution</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: "hsl(47, 100%, 50%)" }} />
              <span className="text-xs text-muted-foreground">Year-end Milestone</span>
            </div>
          </div>
          <span className="text-xs text-muted-foreground">5% monthly growth rate</span>
        </div>
      </div>
    </section>
  );
}
