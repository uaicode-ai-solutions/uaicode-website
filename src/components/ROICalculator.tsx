import { useState, useMemo, useRef } from "react";
import { Calculator, DollarSign, Users, TrendingUp, Rocket, Clock, Target, FileDown, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { Slider } from "./ui/slider";
import { Input } from "./ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, Area, AreaChart, Legend } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "./ui/chart";
import { generateROIPDF } from "@/lib/pdfExport";
import html2canvas from "html2canvas";
import logoImage from '@/assets/uaicode-logo.png';

const ROICalculator = () => {
  const [expectedUsers, setExpectedUsers] = useState(500);
  const [pricePerUser, setPricePerUser] = useState(29);
  const [marketValidation, setMarketValidation] = useState(5);
  const [mvpTier, setMvpTier] = useState("growth");
  const [timeToMarket, setTimeToMarket] = useState(45);
  const [isExporting, setIsExporting] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const handleExportPDF = async () => {
    setIsExporting(true);
    
    try {
      // Capture chart as image
      const chartElement = chartRef.current;
      let chartImageData = null;
      
      if (chartElement) {
        // Add export theme to force black graph
        chartElement.classList.add("pdf-export-chart");
        
        // Wait for styles to apply and any animations to complete
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const canvas = await html2canvas(chartElement, {
          scale: 3,
          backgroundColor: '#ffffff',
          logging: false,
          useCORS: true,
          allowTaint: true,
        });
        chartImageData = canvas.toDataURL('image/png');
        
        // Remove class so on-screen chart returns to normal colors
        chartElement.classList.remove("pdf-export-chart");
      }
      
      // Prepare data for PDF
      const pdfData = {
        expectedUsers,
        pricePerUser,
        marketValidation,
        mvpTier,
        timeToMarket,
        adoptionRate,
        timeBonus,
        monthlyRevenue,
        sixMonthRevenue,
        twelveMonthRevenue,
        investmentCost,
        breakEvenMonths,
        roi12Month,
        costPerDayDelay,
        urgencyMultiplier,
        tierInfo: tierPricing[mvpTier],
        chartImageData,
        logoImageData: logoImage,
      };
      
      await generateROIPDF(pdfData);
      console.log("PDF generated successfully");
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    min: number,
    max: number,
    setter: (value: number) => void
  ) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      const clampedValue = Math.min(Math.max(value, min), max);
      setter(clampedValue);
    }
  };

  // Tier pricing configuration
  const tierPricing: Record<string, { name: string; cost: string; min: number; max: number; timeline: string }> = {
    starter: { name: "Starter MVP", cost: "$10,000 - $25,000", min: 10000, max: 25000, timeline: "45-60 days" },
    growth: { name: "Growth MVP", cost: "$25,000 - $60,000", min: 25000, max: 60000, timeline: "60-90 days" },
    enterprise: { name: "Enterprise MVP", cost: "$60,000 - $160,000", min: 60000, max: 160000, timeline: "90-120 days" }
  };

  // MVP Investment Calculations
  // Adoption rate: 20-80% range based on market validation
  const baseAdoptionRate = 0.2 + ((marketValidation - 1) * (0.6 / 9));
  const timeBonus = timeToMarket <= 45 ? 0.05 : 0; // 5% bonus for fast launch
  const adoptionRate = Math.min(baseAdoptionRate + timeBonus, 0.85); // Cap at 85%
  
  const monthlyRevenue = expectedUsers * pricePerUser * adoptionRate;
  const sixMonthRevenue = monthlyRevenue * 6;
  const twelveMonthRevenue = monthlyRevenue * 12;
  const investmentCost = (tierPricing[mvpTier].min + tierPricing[mvpTier].max) / 2;
  const breakEvenMonths = monthlyRevenue > 0 ? investmentCost / monthlyRevenue : 0;
  const roi12Month = investmentCost > 0 ? ((twelveMonthRevenue - investmentCost) / investmentCost) * 100 : 0;
  
  // Opportunity cost increases with urgency
  const urgencyMultiplier = 1 + ((90 - timeToMarket) / 90); // 1.0x to 2.0x
  const costPerDayDelay = (monthlyRevenue / 30) * urgencyMultiplier;

  // Generate chart data for 12-month projection
  const chartData = useMemo(() => {
    const data = [];
    let cumulativeRevenue = 0;
    
    for (let month = 0; month <= 12; month++) {
      // Apply growth curve with time-to-market impact
      const timeImpact = (90 - timeToMarket) / 60; // 0 to 1.5 - faster launch = faster growth
      const growthFactor = month === 0 ? 0 : Math.min(1, 0.5 + (month / 24) + (timeImpact * 0.1));
      const monthRevenue = monthlyRevenue * growthFactor;
      cumulativeRevenue += monthRevenue;
      
      data.push({
        month: month === 0 ? "Launch" : `M${month}`,
        monthlyRevenue: Math.round(monthRevenue),
        cumulativeRevenue: Math.round(cumulativeRevenue),
        investment: investmentCost,
        breakEven: cumulativeRevenue >= investmentCost,
      });
    }
    
    return data;
  }, [monthlyRevenue, investmentCost]);

  const chartConfig = {
    cumulativeRevenue: {
      label: "Total Revenue",
      color: "hsl(var(--accent))",
    },
    monthlyRevenue: {
      label: "Monthly Revenue",
      color: "hsl(var(--primary))",
    },
    investment: {
      label: "Investment Cost",
      color: "hsl(var(--destructive))",
    },
  };

  return (
    <section id="investment" className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-8 md:mb-12 lg:mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">Calculate Your <span className="text-gradient-gold">MVP Investment Return</span></h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            See the potential impact of launching your SaaS idea with our proven MVP framework
          </p>
        </div>

        {/* Revenue Projection Chart */}
        <div ref={chartRef} className="mb-8 glass-card p-6 rounded-2xl animate-fade-in-up border border-accent/10 hover:shadow-[0_0_20px_rgba(234,171,8,0.1)] transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-accent" />
              12-Month Revenue Projection
            </h3>
            <div className="text-sm text-muted-foreground">
              Break-even: Month {breakEvenMonths > 0 ? Math.ceil(breakEvenMonths) : 'N/A'}
            </div>
          </div>
          
          <ChartContainer config={chartConfig} className="h-[300px] md:h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--accent))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--accent))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                />
                
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                />
                
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      formatter={(value, name) => {
                        const numValue = Number(value);
                        return [`$${numValue.toLocaleString()}`, name];
                      }}
                    />
                  }
                />
                
                <Legend 
                  wrapperStyle={{ paddingTop: "20px" }}
                  iconType="line"
                />
                
                {/* Investment cost reference line */}
                <ReferenceLine 
                  y={investmentCost} 
                  stroke="hsl(var(--destructive))" 
                  strokeDasharray="5 5"
                  label={{ 
                    value: "Investment", 
                    position: "right",
                    fill: "hsl(var(--destructive))",
                    fontSize: 12
                  }}
                />
                
                {/* Break-even vertical line */}
                {breakEvenMonths > 0 && breakEvenMonths <= 12 && (
                  <ReferenceLine 
                    x={`M${Math.ceil(breakEvenMonths)}`}
                    stroke="hsl(var(--accent))" 
                    strokeDasharray="5 5"
                    label={{ 
                      value: "Break-even", 
                      position: "top",
                      fill: "hsl(var(--accent))",
                      fontSize: 12
                    }}
                  />
                )}
                
                {/* Cumulative revenue area */}
                <Area
                  type="monotone"
                  dataKey="cumulativeRevenue"
                  stroke="hsl(var(--accent))"
                  strokeWidth={3}
                  fill="url(#colorRevenue)"
                  name="Total Revenue"
                />
                
                {/* Monthly revenue line */}
                <Line
                  type="monotone"
                  dataKey="monthlyRevenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", r: 3 }}
                  name="Monthly Revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartContainer>
          
          {/* Chart Legend Explanation */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-accent"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Total Revenue:</strong> Cumulative earnings over time
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-primary"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Monthly Revenue:</strong> Income per month
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-0.5 bg-destructive"></div>
              <span className="text-muted-foreground">
                <strong className="text-foreground">Investment Line:</strong> Initial development cost
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Input Section */}
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl border border-accent/10 hover:border-accent/20 transition-all duration-300">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Your SaaS Vision</h3>
            
            <div className="space-y-6 md:space-y-8">
              {/* Expected Monthly Users */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-base font-medium mb-2 md:mb-3">
                  <Users className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Expected Monthly Users: {expectedUsers.toLocaleString()}
                </label>
                <p className="text-xs text-muted-foreground mb-3">How many users do you expect in the first 6 months?</p>
                <div className="space-y-3">
                  <Slider
                    value={[expectedUsers]}
                    onValueChange={(value) => setExpectedUsers(value[0])}
                    min={50}
                    max={10000}
                    step={50}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={expectedUsers}
                    onChange={(e) => handleInputChange(e, 50, 10000, setExpectedUsers)}
                    min={50}
                    max={10000}
                    step={50}
                    className="w-full"
                    placeholder="50 - 10,000"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: 50</span>
                    <span>Max: 10,000</span>
                  </div>
                </div>
              </div>

              {/* Pricing Per User */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-base font-medium mb-2 md:mb-3">
                  <DollarSign className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Pricing Per User: ${pricePerUser}
                </label>
                <p className="text-xs text-muted-foreground mb-3">What's your target price per user/month?</p>
                <div className="space-y-3">
                  <Slider
                    value={[pricePerUser]}
                    onValueChange={(value) => setPricePerUser(value[0])}
                    min={5}
                    max={200}
                    step={5}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={pricePerUser}
                    onChange={(e) => handleInputChange(e, 5, 200, setPricePerUser)}
                    min={5}
                    max={200}
                    step={5}
                    className="w-full"
                    placeholder="5 - 200"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Min: $5</span>
                    <span>Max: $200</span>
                  </div>
                </div>
              </div>

              {/* Market Validation */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-base font-medium mb-2 md:mb-3">
                  <Target className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Market Validation: {marketValidation}/10
                </label>
                <p className="text-xs text-muted-foreground mb-3">How validated is your idea? (1=concept, 10=paying customers)</p>
                <div className="space-y-3">
                  <Slider
                    value={[marketValidation]}
                    onValueChange={(value) => setMarketValidation(value[0])}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={marketValidation}
                    onChange={(e) => handleInputChange(e, 1, 10, setMarketValidation)}
                    min={1}
                    max={10}
                    step={1}
                    className="w-full"
                    placeholder="1 - 10"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                   <span>Just an idea (20% adoption)</span>
                    <span>Validated (80% adoption)</span>
                  </div>
                </div>
              </div>

              {/* MVP Tier Selection */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-base font-medium mb-2 md:mb-3">
                  <Rocket className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Development Tier
                </label>
                <p className="text-xs text-muted-foreground mb-3">Choose your MVP development package</p>
                <Select value={mvpTier} onValueChange={setMvpTier}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="starter">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Starter MVP</span>
                        <span className="text-xs text-muted-foreground">${tierPricing.starter.min.toLocaleString()} - ${tierPricing.starter.max.toLocaleString()} • {tierPricing.starter.timeline}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="growth">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Growth MVP</span>
                        <span className="text-xs text-muted-foreground">${tierPricing.growth.min.toLocaleString()} - ${tierPricing.growth.max.toLocaleString()} • {tierPricing.growth.timeline}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="enterprise">
                      <div className="flex flex-col items-start">
                        <span className="font-semibold">Enterprise MVP</span>
                        <span className="text-xs text-muted-foreground">${tierPricing.enterprise.min.toLocaleString()} - ${tierPricing.enterprise.max.toLocaleString()} • {tierPricing.enterprise.timeline}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Time to Market */}
              <div>
                <label className="flex items-center gap-2 text-sm md:text-base font-medium mb-2 md:mb-3">
                  <Clock className="w-4 h-4 md:w-5 md:h-5 text-accent" />
                  Launch Timeline: {timeToMarket} days
                </label>
                <p className="text-xs text-muted-foreground mb-3">When do you need to launch?</p>
                <div className="space-y-3">
                  <Slider
                    value={[timeToMarket]}
                    onValueChange={(value) => setTimeToMarket(value[0])}
                    min={30}
                    max={90}
                    step={5}
                    className="w-full"
                  />
                  <Input
                    type="number"
                    value={timeToMarket}
                    onChange={(e) => handleInputChange(e, 30, 90, setTimeToMarket)}
                    min={30}
                    max={90}
                    step={5}
                    className="w-full"
                    placeholder="30 - 90"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>30 days (urgent)</span>
                    <span>90 days (flexible)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="glass-card p-4 sm:p-6 md:p-8 rounded-2xl bg-gradient-to-br from-accent/10 to-transparent border-2 border-accent/30">
            <h3 className="text-xl md:text-2xl font-bold mb-4 md:mb-6">Projected Success Metrics</h3>
            <div className="mb-4 p-3 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-xs font-medium text-foreground mb-1">
                Adoption Rate: {(adoptionRate * 100).toFixed(1)}%
                {timeBonus > 0 && <span className="text-accent ml-1">(+5% fast launch bonus)</span>}
              </p>
              <p className="text-xs text-muted-foreground">
                Based on market validation level {marketValidation}/10
              </p>
            </div>
            <p className="text-xs text-muted-foreground italic mb-4">
              Projections based on typical SaaS metrics and market conditions. Actual outcomes may vary.
            </p>
            
            <div className="space-y-4 md:space-y-6">
              {/* 6-Month Revenue Projection */}
              <div className="border-b border-border pb-4">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">6-Month Revenue Projection</div>
                <div className="text-2xl md:text-3xl font-bold text-accent">${sixMonthRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-muted-foreground mt-1">Monthly: ${monthlyRevenue.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
              </div>

              {/* Development Cost */}
              <div className="border-b border-border pb-4">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Development Investment</div>
                <div className="text-2xl md:text-3xl font-bold">${investmentCost.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground mt-1">{tierPricing[mvpTier].timeline} timeline</div>
              </div>

              {/* Break-Even Timeline */}
              <div className="border-b border-border pb-4">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Break-Even Timeline</div>
                <div className="text-2xl md:text-3xl font-bold text-gradient-gold">
                  {breakEvenMonths > 0 ? `${breakEvenMonths.toFixed(1)} months` : 'N/A'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">Time to recover investment</div>
              </div>

              {/* 12-Month ROI */}
              <div className="bg-accent/20 rounded-lg p-4 border-b border-border pb-4">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">12-Month ROI</div>
                <div className="text-3xl md:text-4xl font-bold text-accent">{roi12Month.toFixed(0)}%</div>
                <div className="text-xs text-muted-foreground mt-1">Annual return on investment</div>
              </div>

              {/* Cost per Day of Delay */}
              <div className="bg-destructive/10 rounded-lg p-4">
                <div className="text-xs md:text-sm text-muted-foreground mb-1">Cost per Day of Delay</div>
                <div className="text-xl md:text-2xl font-bold text-destructive">${costPerDayDelay.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Opportunity cost of waiting
                  {timeToMarket <= 60 && <span className="text-destructive"> (×{urgencyMultiplier.toFixed(2)} urgency)</span>}
                </div>
              </div>

              <Button 
                size="lg"
                onClick={() => scrollToSection("schedule")}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
              >
                <Calculator className="w-5 h-5 mr-2" />
                Get MVP Pricing
              </Button>

              <Button 
                size="lg"
                variant="outline"
                onClick={() => scrollToSection("schedule")}
                className="w-full border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-6 transition-all duration-300"
              >
                <Rocket className="w-5 h-5 mr-1.5" />
                Launch Your MVP
              </Button>

              <Button 
                size="lg"
                variant="secondary"
                onClick={handleExportPDF}
                disabled={isExporting}
                className="w-full border-2 border-accent/50 text-accent hover:bg-accent/10 font-semibold text-lg px-8 py-6 transition-all duration-300"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Generating PDF...
                  </>
                ) : (
                  <>
                    <FileDown className="w-5 h-5 mr-2" />
                    Export PDF Report
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ROICalculator;
