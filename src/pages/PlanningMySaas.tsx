import PmsHeader from "@/components/planningmysaas/PmsHeader";
import PmsHero from "@/components/planningmysaas/PmsHero";
import PmsPainPoints from "@/components/planningmysaas/PmsPainPoints";
import PmsHowItWorks from "@/components/planningmysaas/PmsHowItWorks";
import PmsFeatures from "@/components/planningmysaas/PmsFeatures";
import PmsPricing from "@/components/planningmysaas/PmsPricing";
import PmsFaq from "@/components/planningmysaas/PmsFaq";
import PmsCta from "@/components/planningmysaas/PmsCta";
import PmsFooter from "@/components/planningmysaas/PmsFooter";

const PlanningMySaas = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PmsHeader />
      <main>
        <PmsHero />
        <PmsPainPoints />
        <PmsHowItWorks />
        <PmsFeatures />
        <PmsPricing />
        <PmsFaq />
        <PmsCta />
      </main>
      <PmsFooter />
    </div>
  );
};

export default PlanningMySaas;
