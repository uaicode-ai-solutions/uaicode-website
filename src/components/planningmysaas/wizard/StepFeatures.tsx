import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp, Zap, TrendingUp, Building, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const tiers = [
  {
    id: "essential",
    title: "Essential Features",
    subtitle: "Starter Plan",
    icon: Zap,
    features: [
      { id: "auth", label: "User Registration & Authentication" },
      { id: "profiles", label: "Basic User Profiles" },
      { id: "crud", label: "Simple Database CRUD Operations" },
      { id: "reporting", label: "Basic Reporting & Analytics" },
      { id: "notifications", label: "Email Notifications" },
      { id: "admin", label: "Basic Admin Panel" },
      { id: "responsive", label: "Mobile Responsive Design" },
      { id: "security", label: "Basic Security Measures" },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Features",
    subtitle: "Growth Plan",
    icon: TrendingUp,
    features: [
      { id: "advancedAnalytics", label: "Advanced Analytics Dashboard" },
      { id: "apiIntegrations", label: "Third-party API Integrations" },
      { id: "payments", label: "Payment Processing & Billing" },
      { id: "roles", label: "Multi-user Roles & Permissions" },
      { id: "search", label: "Advanced Search & Filtering" },
      { id: "fileUpload", label: "File Upload & Management" },
      { id: "realtime", label: "Real-time Updates" },
      { id: "workflows", label: "Custom Workflows" },
      { id: "advancedReporting", label: "Advanced Reporting Tools" },
      { id: "emailMarketing", label: "Email Marketing Integration" },
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise Features",
    subtitle: "Enterprise Plan",
    icon: Building,
    features: [
      { id: "ai", label: "AI/Machine Learning Capabilities" },
      { id: "dataAnalytics", label: "Advanced Data Analytics" },
      { id: "multiTenant", label: "Multi-tenant Architecture" },
      { id: "sso", label: "SSO & Enterprise Security" },
      { id: "customIntegrations", label: "Custom Integrations" },
      { id: "apiManagement", label: "Advanced API Management" },
      { id: "collaboration", label: "Real-time Collaboration Tools" },
      { id: "automation", label: "Advanced Automation" },
      { id: "customReporting", label: "Custom Reporting Engine" },
      { id: "support", label: "Enterprise-grade Support" },
    ],
  },
];

interface StepFeaturesProps {
  data: {
    selectedFeatures: string[];
    selectedTier: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  selectedPlan?: string;
}

const StepFeatures = ({ data, onChange, selectedPlan }: StepFeaturesProps) => {
  const [openTiers, setOpenTiers] = useState<string[]>([]);

  // Initialize open tier based on selected plan
  useEffect(() => {
    if (selectedPlan) {
      const planToTier: Record<string, string> = {
        starter: "essential",
        pro: "advanced",
        enterprise: "enterprise",
      };
      const defaultTier = planToTier[selectedPlan] || "essential";
      setOpenTiers([defaultTier]);
      
      if (!data.selectedTier) {
        onChange("selectedTier", defaultTier);
      }
    } else if (openTiers.length === 0) {
      setOpenTiers(["essential"]);
    }
  }, [selectedPlan]);

  const handleFeatureToggle = (featureId: string) => {
    const currentFeatures = data.selectedFeatures;
    if (currentFeatures.includes(featureId)) {
      onChange("selectedFeatures", currentFeatures.filter((f) => f !== featureId));
    } else {
      onChange("selectedFeatures", [...currentFeatures, featureId]);
    }
  };

  const toggleTier = (tierId: string) => {
    setOpenTiers((prev) =>
      prev.includes(tierId)
        ? prev.filter((t) => t !== tierId)
        : [...prev, tierId]
    );
  };

  const getSelectedCountForTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return 0;
    return tier.features.filter((f) => data.selectedFeatures.includes(f.id)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Select Your <span className="text-gradient-gold">Features</span>
        </h2>
        <p className="text-muted-foreground">
          Choose the features you need for your SaaS. This helps us estimate complexity and recommend the right plan.
        </p>
      </div>

      {/* Accordion Tiers */}
      <div className="space-y-3">
        {tiers.map((tier) => {
          const isOpen = openTiers.includes(tier.id);
          const selectedCount = getSelectedCountForTier(tier.id);
          const Icon = tier.icon;

          return (
            <Collapsible
              key={tier.id}
              open={isOpen}
              onOpenChange={() => toggleTier(tier.id)}
            >
              <CollapsibleTrigger asChild>
                <button
                  className={cn(
                    "w-full flex items-center justify-between p-4 rounded-xl border transition-all",
                    "bg-muted/30 hover:bg-muted/50",
                    isOpen ? "border-accent/50" : "border-border/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/20 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-accent" />
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-foreground">{tier.title}</h3>
                      <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-muted-foreground">
                      {selectedCount} selected
                    </span>
                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </button>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-3 pb-1">
                  {tier.features.map((feature) => {
                    const isSelected = data.selectedFeatures.includes(feature.id);

                    return (
                      <button
                        key={feature.id}
                        onClick={() => handleFeatureToggle(feature.id)}
                        className={cn(
                          "flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          "bg-muted/30 hover:bg-muted/50",
                          isSelected ? "border-accent/50" : "border-border/50"
                        )}
                      >
                        <div
                          className={cn(
                            "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                            isSelected
                              ? "border-accent bg-accent"
                              : "border-muted-foreground"
                          )}
                        >
                          {isSelected && (
                            <div className="w-2 h-2 rounded-full bg-accent-foreground" />
                          )}
                        </div>
                        <span className="flex-1 text-sm text-foreground">
                          {feature.label}
                        </span>
                        <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      </button>
                    );
                  })}
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })}
      </div>

      {/* Summary */}
      {data.selectedFeatures.length > 0 && (
        <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
          <p className="text-sm text-foreground">
            <span className="font-semibold text-accent">
              {data.selectedFeatures.length} feature{data.selectedFeatures.length !== 1 ? "s" : ""}
            </span>{" "}
            selected across all tiers
          </p>
        </div>
      )}
    </div>
  );
};

export default StepFeatures;
