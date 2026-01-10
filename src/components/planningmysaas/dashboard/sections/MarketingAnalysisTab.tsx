import MarketingHero from "./MarketingHero";
import MarketingVerdict from "./MarketingVerdict";
import FourPsCards from "../marketing/FourPsCards";
import PaidMediaCards from "../marketing/PaidMediaCards";
import PricingCards from "../marketing/PricingCards";
import GrowthCards from "../marketing/GrowthCards";
import WhyUaicodeMarketing from "./WhyUaicodeMarketing";
import MarketingNextSteps from "./MarketingNextSteps";

interface MarketingAnalysisTabProps {
  projectName?: string;
  onScheduleCall?: () => void;
  onDownloadPDF?: () => void;
}

const MarketingAnalysisTab = ({ projectName, onScheduleCall, onDownloadPDF }: MarketingAnalysisTabProps) => {
  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <MarketingHero 
        projectName={projectName}
        onScheduleCall={onScheduleCall}
        onExploreAnalysis={() => {
          document.getElementById('marketing-verdict')?.scrollIntoView({ behavior: 'smooth' });
        }}
      />

      {/* Executive Summary */}
      <MarketingVerdict />

      {/* 4Ps Analysis */}
      <FourPsCards />

      {/* Paid Media Analysis */}
      <PaidMediaCards />

      {/* Pricing Analysis */}
      <PricingCards />

      {/* Growth Strategy (AEMR) */}
      <GrowthCards />

      {/* Why Uaicode */}
      <WhyUaicodeMarketing />

      {/* Next Steps CTA */}
      <MarketingNextSteps 
        onScheduleCall={onScheduleCall}
        onDownloadPDF={onDownloadPDF}
      />
    </div>
  );
};

export default MarketingAnalysisTab;
