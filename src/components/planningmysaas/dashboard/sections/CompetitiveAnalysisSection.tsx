import { Target, Users, DollarSign, TrendingUp, Megaphone, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { InfoTooltip } from "@/components/ui/info-tooltip";
import FourPsAnalysis from "../competitive/FourPsAnalysis";
import PaidMediaDiagnosis from "../competitive/PaidMediaDiagnosis";
import PaidMediaActionPlan from "../competitive/PaidMediaActionPlan";
import PricingDiagnosis from "../competitive/PricingDiagnosis";
import PricingActionPlan from "../competitive/PricingActionPlan";
import GrowthStrategyAEMR from "../competitive/GrowthStrategyAEMR";

const CompetitiveAnalysisSection = () => {
  return (
    <section id="competitive-analysis" className="space-y-6 animate-fade-in">
      {/* Section Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-accent/10">
          <Target className="h-5 w-5 text-accent" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-2xl font-bold text-foreground">Competitive Intelligence</h2>
            <InfoTooltip side="right" size="sm">
              Deep dive into your competitive landscape with actionable insights for 4Ps, paid media, pricing strategy, and growth tactics.
            </InfoTooltip>
          </div>
          <p className="text-sm text-muted-foreground">Know your competition</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Card className="bg-card/50 border-border/30">
        <CardContent className="p-6">
          <Tabs defaultValue="fourps" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-accent/5 border border-accent/10 p-2 rounded-xl">
              <TabsTrigger 
                value="fourps" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">4Ps Analysis</span>
                <span className="sm:hidden">4Ps</span>
              </TabsTrigger>
              <TabsTrigger 
                value="paid-media-diagnosis" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Paid Media</span>
                <span className="sm:hidden">Media</span>
              </TabsTrigger>
              <TabsTrigger 
                value="paid-media-plan" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Media Plan</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing-diagnosis" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Pricing</span>
                <span className="sm:hidden">Price</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing-plan" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Price Plan</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="growth" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-500 data-[state=active]:to-amber-400 data-[state=active]:text-white data-[state=active]:shadow-md px-3 py-2.5 rounded-lg transition-all hover:bg-accent/10"
              >
                <Users className="h-4 w-4" />
                <span className="hidden sm:inline">Growth</span>
                <span className="sm:hidden">AEMR</span>
              </TabsTrigger>
            </TabsList>

            <div className="mt-6">
              <TabsContent value="fourps" className="mt-0">
                <FourPsAnalysis />
              </TabsContent>
              <TabsContent value="paid-media-diagnosis" className="mt-0">
                <PaidMediaDiagnosis />
              </TabsContent>
              <TabsContent value="paid-media-plan" className="mt-0">
                <PaidMediaActionPlan />
              </TabsContent>
              <TabsContent value="pricing-diagnosis" className="mt-0">
                <PricingDiagnosis />
              </TabsContent>
              <TabsContent value="pricing-plan" className="mt-0">
                <PricingActionPlan />
              </TabsContent>
              <TabsContent value="growth" className="mt-0">
                <GrowthStrategyAEMR />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </section>
  );
};

export default CompetitiveAnalysisSection;
