import { useState } from "react";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  BarChart3, 
  Users, 
  Palette, 
  Lock,
  ArrowRight,
  CheckCircle
} from "lucide-react";

const tabs = [
  { id: "overview", label: "Overview", icon: FileText },
  { id: "market", label: "Market Analysis", icon: BarChart3 },
  { id: "competitors", label: "Competitors", icon: Users },
  { id: "brand", label: "Brand Assets", icon: Palette },
];

const tabContent = {
  overview: {
    title: "Executive Summary",
    items: [
      "Market Opportunity Score: 87/100",
      "Estimated TAM: $4.2B by 2026",
      "Competition Level: Moderate",
      "Recommended Positioning: Premium B2B SaaS",
      "Go-to-Market Strategy: Product-led Growth",
    ],
  },
  market: {
    title: "Market Analysis",
    items: [
      "Market Size Growth: 23% YoY",
      "Target Segments Identified: 4",
      "Key Trends: AI Integration, Remote Work",
      "Regulatory Considerations: GDPR Compliant",
      "Market Entry Timing: Optimal",
    ],
  },
  competitors: {
    title: "Competitor Landscape",
    items: [
      "Direct Competitors: 12 identified",
      "Market Leaders: 3 dominant players",
      "Pricing Range: $29 - $299/mo",
      "Feature Gap Opportunities: 7 found",
      "Differentiation Score: Strong",
    ],
  },
  brand: {
    title: "Brand Kit Preview",
    items: [
      "Logo Variations: 3 concepts",
      "Color Palette: Primary + 4 accents",
      "Typography: Headers + Body fonts",
      "Product Mockups: 5 screens",
      "Landing Page Template: Included",
    ],
  },
};

const PmsSampleReport = () => {
  const [activeTab, setActiveTab] = useState("overview");

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 mesh-gradient opacity-30" />
      
      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">Sample Report</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            See What You'll <span className="text-gradient-gold">Get</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Here's a preview of the comprehensive validation report and assets 
            you'll receive for your SaaS idea.
          </p>
        </div>

        {/* Report Preview Card */}
        <div className="relative">
          {/* Glow Effect */}
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
          
          <div className="relative glass-premium rounded-3xl border border-accent/20 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-border/50 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    activeTab === tab.id
                      ? "text-accent border-b-2 border-accent bg-accent/5"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  }`}
                >
                  <tab.icon className="w-4 h-4" />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="p-8 relative min-h-[300px]">
              {/* Content */}
              <div className="relative z-10">
                <h3 className="text-2xl font-bold text-foreground mb-6">
                  {tabContent[activeTab as keyof typeof tabContent].title}
                </h3>
                
                <ul className="space-y-4">
                  {tabContent[activeTab as keyof typeof tabContent].items.map((item, index) => (
                    <li 
                      key={index}
                      className="flex items-center gap-3 text-muted-foreground animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <CheckCircle className="w-5 h-5 text-accent flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Blur Overlay */}
              <div className="absolute inset-0 top-1/2 bg-gradient-to-t from-card via-card/80 to-transparent flex flex-col items-center justify-end pb-8">
                <div className="flex items-center gap-2 text-muted-foreground mb-4">
                  <Lock className="w-5 h-5 text-accent" />
                  <span className="text-sm">Full report unlocked after purchase</span>
                </div>
                <Button
                  size="lg"
                  className="bg-accent hover:bg-accent/90 text-background font-bold glow-white"
                  onClick={() => scrollToSection("pricing")}
                >
                  Unlock Full Report
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsSampleReport;
