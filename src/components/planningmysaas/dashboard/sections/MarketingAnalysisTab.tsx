import { TrendingUp } from "lucide-react";
import FourPsCards from "../marketing/FourPsCards";
import PaidMediaCards from "../marketing/PaidMediaCards";
import PricingCards from "../marketing/PricingCards";
import GrowthCards from "../marketing/GrowthCards";

const MarketingAnalysisTab = () => {
  return (
    <div className="space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-accent/10 border border-accent/20">
          <TrendingUp className="h-5 w-5 text-accent" />
          <span className="text-sm font-medium text-accent">Marketing Intelligence Report</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-foreground">
          Competitive & Marketing Analysis
        </h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Deep dive into your competitive landscape, paid media opportunities, pricing strategies, and growth framework
        </p>
      </div>

      {/* 4Ps Analysis */}
      <FourPsCards />

      {/* Paid Media Analysis */}
      <PaidMediaCards />

      {/* Pricing Analysis */}
      <PricingCards />

      {/* Growth Strategy (AEMR) */}
      <GrowthCards />
    </div>
  );
};

export default MarketingAnalysisTab;
