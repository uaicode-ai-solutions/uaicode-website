import PmsHeader from "@/components/planningmysaas/PmsHeader";
import PmsHero from "@/components/planningmysaas/PmsHero";
import PmsTrustedBy from "@/components/planningmysaas/PmsTrustedBy";
import PmsPainPoints from "@/components/planningmysaas/PmsPainPoints";
import PmsHowItWorks from "@/components/planningmysaas/PmsHowItWorks";
import PmsSampleReport from "@/components/planningmysaas/PmsSampleReport";
import PmsFeatures from "@/components/planningmysaas/PmsFeatures";
import PmsTestimonials from "@/components/planningmysaas/PmsTestimonials";
import PmsPricing from "@/components/planningmysaas/PmsPricing";
import PmsFaq from "@/components/planningmysaas/PmsFaq";
import PmsFooter from "@/components/planningmysaas/PmsFooter";

const PlanningMySaas = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <PmsHeader />
      <main>
        <PmsHero />
        <PmsTrustedBy />
        <PmsPainPoints />
        <PmsHowItWorks />
        <PmsSampleReport />
        <PmsFeatures />
        <PmsTestimonials />
        <PmsPricing />
        <PmsFaq />
      </main>
      <PmsFooter />
    </div>
  );
};

export default PlanningMySaas;
