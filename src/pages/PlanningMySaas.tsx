import PmsHero from "@/components/planningmysaas/PmsHero";
import PmsTrustedBy from "@/components/planningmysaas/PmsTrustedBy";
import PmsPainPoints from "@/components/planningmysaas/PmsPainPoints";
import PmsHowItWorks from "@/components/planningmysaas/PmsHowItWorks";
import PmsSampleReport from "@/components/planningmysaas/PmsSampleReport";
import PmsPricing from "@/components/planningmysaas/PmsPricing";
import PmsFaq from "@/components/planningmysaas/PmsFaq";
import PmsFooter from "@/components/planningmysaas/PmsFooter";

const PlanningMySaas = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main>
        <PmsHero />
        <PmsTrustedBy />
        <PmsPainPoints />
        <PmsHowItWorks />
        <PmsSampleReport />
        <PmsPricing />
        <PmsFaq />
      </main>
      <PmsFooter />
    </div>
  );
};

export default PlanningMySaas;
