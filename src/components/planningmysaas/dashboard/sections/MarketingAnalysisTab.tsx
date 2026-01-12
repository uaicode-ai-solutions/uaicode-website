import MarketingVerdict from "./MarketingVerdict";
import ICPCard from "../marketing/ICPCard";
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Marketing Intelligence</h2>
          <p className="text-sm text-muted-foreground">Competitive analysis and go-to-market strategy</p>
        </div>
      </div>

      {/* Executive Summary */}
      <MarketingVerdict />

      {/* Ideal Customer Profile */}
      <ICPCard />

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
