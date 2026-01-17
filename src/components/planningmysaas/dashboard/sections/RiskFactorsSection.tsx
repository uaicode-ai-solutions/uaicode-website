import { AlertTriangle, Shield, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import { useReportContext } from "@/contexts/ReportContext";
import { OpportunitySection } from "@/types/report";
import ScoreCircle from "@/components/planningmysaas/dashboard/ui/ScoreCircle";
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  PolarAngleAxis,
} from "recharts";

const RiskFactorsSection = () => {
  const { reportData } = useReportContext();
  const opportunityData = reportData?.opportunity_section as OpportunitySection | null;
  const riskFactors = opportunityData?.risk_factors || [];

  // Calculate risk score based on number of risks (inverted - more risks = lower score)
  const riskCount = riskFactors.length;
  const riskScore = Math.max(0, 100 - (riskCount * 12)); // Each risk reduces score by ~12

  // Data for radial bar chart
  const chartData = [
    {
      name: "Risk Level",
      value: 100 - riskScore, // Show risk level (higher = more risk)
      fill: "hsl(var(--accent))",
    },
  ];

  // Get risk level label
  const getRiskLevel = (score: number): string => {
    if (score >= 80) return "Low Risk";
    if (score >= 60) return "Moderate";
    if (score >= 40) return "Elevated";
    return "High Risk";
  };

  if (riskFactors.length === 0) {
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
            <h3 className="text-sm font-medium text-foreground mb-4">Risk Assessment</h3>

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
                    fill="hsl(var(--accent))"
                    fillOpacity={0.8}
                  />
                </RadialBarChart>
              </ResponsiveContainer>

              {/* Center content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-accent">{riskScore}</span>
                <span className="text-xs text-muted-foreground">Safety Score</span>
              </div>
            </div>

            {/* Risk level badge */}
            <div className="mt-4 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
                <Shield className="h-4 w-4 text-accent" />
                <span className="text-sm font-medium text-foreground">
                  {getRiskLevel(riskScore)}
                </span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-4 flex justify-center gap-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-accent">{riskCount}</div>
                <div className="text-xs text-muted-foreground">Risks</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground">
                  {riskCount <= 3 ? "Manageable" : riskCount <= 5 ? "Monitor" : "Critical"}
                </div>
                <div className="text-xs text-muted-foreground">Status</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Risk List (2 cols) */}
        <Card className="bg-card/50 border-border/30 lg:col-span-2">
          <CardContent className="p-6">
            <h3 className="text-sm font-medium text-foreground mb-5">Identified Risks</h3>

            <div className="space-y-3">
              {riskFactors.map((risk, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 p-3 rounded-xl bg-accent/5 border border-accent/10 transition-all duration-300 hover:border-accent/30"
                >
                  {/* Index badge */}
                  <div className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/10 flex items-center justify-center">
                    <span className="text-xs font-medium text-accent">{index + 1}</span>
                  </div>

                  {/* Risk text */}
                  <p className="text-sm text-foreground flex-1 leading-relaxed">
                    {risk}
                  </p>

                  {/* Arrow icon */}
                  <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                </div>
              ))}
            </div>

            {/* Risk awareness note */}
            <div className="mt-5 p-3 rounded-lg bg-muted/10 border border-border/30">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-4 w-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
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
