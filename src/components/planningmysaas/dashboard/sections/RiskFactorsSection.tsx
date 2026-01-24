import { AlertTriangle, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const RiskFactorsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  
  // Check for risk_factors directly
  const rawRiskFactors = opportunityData?.risk_factors;
  
  // Normalize to string array for display
  const riskFactorsArray: string[] = Array.isArray(rawRiskFactors) ? rawRiskFactors : [];
  
  const hasValidRisks = riskFactorsArray.length > 0;
  const riskCount = riskFactorsArray.length;
  const riskScore = Math.max(0, 100 - (riskCount * 12)); // Each risk reduces score by ~12

  // Data for radial bar chart - plot riskScore directly (Safety Score)
  // This makes the visual arc match the displayed number (76 = 76% arc)
  const chartData = [
    {
      name: "Safety Score",
      value: riskScore, // Plot safety score directly (higher = better = more filled)
      fill: "url(#riskBarGradient)",
    },
  ];

  // Get risk level label
  const getRiskLevel = (score: number): string => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Moderate";
    if (score >= 40) return "Elevated";
    return "High Risk";
  };

  if (riskFactorsArray.length === 0) {
    return null;
  }

  return (
    <section id="risk-factors" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Shield className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Risk Factors</h2>
            <InfoTooltip side="right" size="sm">
              Key risks to consider before launching, based on market analysis.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Potential challenges ahead</p>
        </div>
      </div>

      {/* Two Cards Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Card 1: Radial Chart + Score */}
        <Card className="bg-card/50 border-border/30">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <h3 className="text-sm font-medium text-foreground">Risk Assessment</h3>
              <InfoTooltip side="top" size="sm">
                Safety score based on the number of identified risks. Higher is better.
              </InfoTooltip>
            </div>

            {/* Radial Bar Chart */}
            <div className="relative h-48 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="85%"
                  data={chartData}
                  startAngle={90}
                  endAngle={-270}
                >
                  <defs>
                    {/* Amber gradient for radial bar */}
                    <linearGradient id="riskBarGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#F59E0B" />
                      <stop offset="50%" stopColor="#FBBF24" />
                      <stop offset="100%" stopColor="#FCD34D" />
                    </linearGradient>
                    {/* Glow filter */}
                    <filter id="riskGlow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <PolarAngleAxis
                    type="number"
                    domain={[0, 100]}
                    angleAxisId={0}
                    tick={false}
                  />
                  <RadialBar
                    background={{ fill: "hsl(var(--muted) / 0.3)" }}
                    dataKey="value"
                    cornerRadius={10}
                    fill="url(#riskBarGradient)"
                    filter="url(#riskGlow)"
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Center content - number only */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-5xl font-bold text-gradient-gold">{riskScore}</span>
              </div>
            </div>

            {/* Label outside chart */}
            <p className="text-center text-sm text-muted-foreground mt-2">Safety Score</p>

            {/* Risk level badge */}
            <div className="mt-3 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {getRiskLevel(riskScore)}
                </span>
              </div>
            </div>

            {/* Stats in individual cards */}
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Risks Identified
                  <InfoTooltip side="top" size="sm">
                    Total number of potential challenges identified in market analysis.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-amber-500">{riskCount}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-accent/5 border border-accent/10">
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  Status
                  <InfoTooltip side="top" size="sm">
                    Overall risk status based on the number of identified challenges.
                  </InfoTooltip>
                </span>
                <span className="font-bold text-foreground">
                  {riskCount <= 3 ? "Manageable" : riskCount <= 5 ? "Monitor" : "Critical"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risk List (2 cols) */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2 flex flex-col">
          <CardContent className="p-6 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-5">
              <h3 className="text-sm font-medium text-foreground">Identified Risks</h3>
              <InfoTooltip side="top" size="sm">
                List of potential challenges to consider before launching your product.
              </InfoTooltip>
            </div>

            <div className="flex-1 space-y-3">
              {riskFactorsArray.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10 hover:border-accent/30 transition-colors"
                >
                  {/* Index badge with gradient */}
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500/20 to-amber-400/10 flex items-center justify-center border border-amber-500/20">
                    <span className="text-sm font-bold text-amber-500">{index + 1}</span>
                  </div>

                  {/* Risk text */}
                  <p className="text-sm text-foreground flex-1 leading-relaxed">
                    {risk}
                  </p>
                </div>
              ))}
            </div>

            {/* Risk awareness note */}
            <div className="mt-5 p-4 rounded-lg bg-accent/5 border border-accent/10">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  These risks are derived from market analysis and competitor landscape. 
                  Having awareness of potential challenges helps in building mitigation strategies.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default RiskFactorsSection;
