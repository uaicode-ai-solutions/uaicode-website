import { Target, Users, DollarSign, TrendingUp, Megaphone, PieChart } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import FourPsAnalysis from "../competitive/FourPsAnalysis";
import PaidMediaDiagnosis from "../competitive/PaidMediaDiagnosis";
import PaidMediaActionPlan from "../competitive/PaidMediaActionPlan";
import PricingDiagnosis from "../competitive/PricingDiagnosis";
import PricingActionPlan from "../competitive/PricingActionPlan";
import GrowthStrategyAEMR from "../competitive/GrowthStrategyAEMR";

const CompetitiveAnalysisSection = () => {
  return (
    <section className="space-y-8">
      {/* Section Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/20">
          <Target className="h-6 w-6 text-accent" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-foreground">Competitive Intelligence</h2>
          <p className="text-muted-foreground">Deep dive into your competitive landscape with actionable insights</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
        <CardContent className="pt-6">
          <Tabs defaultValue="fourps" className="w-full">
            <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto gap-2 bg-muted/30 p-2">
              <TabsTrigger 
                value="fourps" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
              >
                <PieChart className="h-4 w-4" />
                <span className="hidden sm:inline">4Ps Analysis</span>
                <span className="sm:hidden">4Ps</span>
              </TabsTrigger>
              <TabsTrigger 
                value="paid-media-diagnosis" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
              >
                <Megaphone className="h-4 w-4" />
                <span className="hidden sm:inline">Paid Media</span>
                <span className="sm:hidden">Media</span>
              </TabsTrigger>
              <TabsTrigger 
                value="paid-media-plan" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
              >
                <TrendingUp className="h-4 w-4" />
                <span className="hidden sm:inline">Media Plan</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing-diagnosis" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Pricing</span>
                <span className="sm:hidden">Price</span>
              </TabsTrigger>
              <TabsTrigger 
                value="pricing-plan" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
              >
                <DollarSign className="h-4 w-4" />
                <span className="hidden sm:inline">Price Plan</span>
                <span className="sm:hidden">Plan</span>
              </TabsTrigger>
              <TabsTrigger 
                value="growth" 
                className="flex items-center gap-2 data-[state=active]:bg-accent data-[state=active]:text-accent-foreground px-3 py-2"
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
