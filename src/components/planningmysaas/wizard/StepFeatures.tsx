import { useState, useEffect } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChevronDown, ChevronUp, Zap, TrendingUp, Building, Info } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_WEIGHTS: Record<string, number> = {
  essential: 1,
  advanced: 2,
  enterprise: 3,
};

const tiers = [
  {
    id: "essential",
    title: "Essential Features",
    icon: Zap,
    features: [
      { id: "auth", label: "User Registration & Authentication", description: "Allows your users to create accounts and log in securely using email and password." },
      { id: "profiles", label: "Basic User Profiles", description: "Enable users to manage their personal information and preferences." },
      { id: "crud", label: "Simple Database CRUD Operations", description: "Create, read, update, and delete data with a simple interface." },
      { id: "reporting", label: "Basic Reporting & Analytics", description: "View basic metrics and reports about your application usage." },
      { id: "notifications", label: "Email Notifications", description: "Send automated emails for important events and updates." },
      { id: "admin", label: "Basic Admin Panel", description: "Manage users and content with a simple administration interface." },
      { id: "responsive", label: "Mobile Responsive Design", description: "Your application looks great on all devices and screen sizes." },
      { id: "security", label: "Basic Security Measures", description: "Essential security features like data encryption and secure connections." },
    ],
  },
  {
    id: "advanced",
    title: "Advanced Features",
    icon: TrendingUp,
    features: [
      { id: "advancedAnalytics", label: "Advanced Analytics Dashboard", description: "Deep insights with customizable charts and data visualization." },
      { id: "apiIntegrations", label: "Third-party API Integrations", description: "Connect with external services like Stripe, Mailchimp, and more." },
      { id: "payments", label: "Payment Processing & Billing", description: "Accept payments and manage subscriptions seamlessly." },
      { id: "roles", label: "Multi-user Roles & Permissions", description: "Define different access levels for admins, managers, and users." },
      { id: "search", label: "Advanced Search & Filtering", description: "Powerful search with filters, sorting, and pagination." },
      { id: "fileUpload", label: "File Upload & Management", description: "Upload, store, and manage files and documents." },
      { id: "realtime", label: "Real-time Updates", description: "Live updates without page refresh using WebSocket technology." },
      { id: "workflows", label: "Custom Workflows", description: "Automate business processes with customizable workflows." },
      { id: "advancedReporting", label: "Advanced Reporting Tools", description: "Generate custom reports with export capabilities." },
      { id: "emailMarketing", label: "Email Marketing Integration", description: "Connect with email marketing platforms for campaigns." },
    ],
  },
  {
    id: "enterprise",
    title: "Enterprise Features",
    icon: Building,
    features: [
      { id: "ai", label: "AI/Machine Learning Capabilities", description: "Leverage AI for predictions, recommendations, and automation." },
      { id: "dataAnalytics", label: "Advanced Data Analytics", description: "Big data processing and advanced statistical analysis." },
      { id: "multiTenant", label: "Multi-tenant Architecture", description: "Support multiple organizations with isolated data." },
      { id: "sso", label: "SSO & Enterprise Security", description: "Single Sign-On and enterprise-grade security features." },
      { id: "customIntegrations", label: "Custom Integrations", description: "Build custom integrations with any third-party system." },
      { id: "apiManagement", label: "Advanced API Management", description: "Full API control with rate limiting and versioning." },
      { id: "collaboration", label: "Real-time Collaboration Tools", description: "Work together in real-time with collaborative features." },
      { id: "automation", label: "Advanced Automation", description: "Complex automation rules and triggers." },
      { id: "customReporting", label: "Custom Reporting Engine", description: "Build any report you need with a flexible engine." },
      { id: "support", label: "Enterprise-grade Support", description: "Priority support with dedicated account management." },
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

  useEffect(() => {
    const planToTier: Record<string, string> = {
      starter: "essential",
      pro: "advanced",
      enterprise: "enterprise",
    };
    const defaultTier = planToTier[selectedPlan || ""] || "essential";
    setOpenTiers([defaultTier]);
    
    if (!data.selectedTier) {
      onChange("selectedTier", defaultTier);
    }
  }, [selectedPlan]);

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = data.selectedFeatures.includes(featureId)
      ? data.selectedFeatures.filter((f) => f !== featureId)
      : [...data.selectedFeatures, featureId];
    onChange("selectedFeatures", newFeatures);
  };

  const handleSelectAllForTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return;
    
    const tierFeatureIds = tier.features.map((f) => f.id);
    const allSelected = tierFeatureIds.every((id) => data.selectedFeatures.includes(id));
    
    if (allSelected) {
      const newFeatures = data.selectedFeatures.filter((f) => !tierFeatureIds.includes(f));
      onChange("selectedFeatures", newFeatures);
    } else {
      const newFeatures = [...new Set([...data.selectedFeatures, ...tierFeatureIds])];
      onChange("selectedFeatures", newFeatures);
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

  const isAllSelectedForTier = (tierId: string) => {
    const tier = tiers.find((t) => t.id === tierId);
    if (!tier) return false;
    return tier.features.every((f) => data.selectedFeatures.includes(f.id));
  };

  const calculateComplexity = () => {
    let score = 0;
    let maxScore = 0;
    const selectedByTier: Record<string, number> = {
      essential: 0,
      advanced: 0,
      enterprise: 0,
    };

    tiers.forEach((tier) => {
      const weight = TIER_WEIGHTS[tier.id];
      const tierMaxScore = tier.features.length * weight;
      maxScore += tierMaxScore;

      const selectedInTier = tier.features.filter((f) =>
        data.selectedFeatures.includes(f.id)
      ).length;
      
      selectedByTier[tier.id] = selectedInTier;
      score += selectedInTier * weight;
    });

    const percentage = maxScore > 0 ? Math.round((score / maxScore) * 100) : 0;
    return { score, maxScore, percentage, selectedByTier };
  };

  const getComplexityLevel = (
    percentage: number,
    selectedByTier: Record<string, number>
  ) => {
    if (percentage === 0) return { label: "No Features", color: "gray" };
    
    const hasEnterprise = selectedByTier.enterprise > 0;
    const hasAdvanced = selectedByTier.advanced > 0;
    
    // Se tem Enterprise, mínimo é High
    if (hasEnterprise) {
      if (percentage > 80) return { label: "Very High", color: "red" };
      return { label: "High", color: "orange" };
    }
    
    // Se tem Advanced, mínimo é Medium
    if (hasAdvanced) {
      if (percentage > 80) return { label: "Very High", color: "red" };
      if (percentage > 60) return { label: "High", color: "orange" };
      return { label: "Medium", color: "yellow" };
    }
    
    // Apenas Essential - usa porcentagem normal
    if (percentage <= 30) return { label: "Low", color: "green" };
    if (percentage <= 60) return { label: "Medium", color: "yellow" };
    if (percentage <= 80) return { label: "High", color: "orange" };
    return { label: "Very High", color: "red" };
  };

  const getVisualPercentage = (
    actualPercentage: number,
    selectedByTier: Record<string, number>
  ) => {
    if (actualPercentage === 0) return 0;
    
    const hasEnterprise = selectedByTier.enterprise > 0;
    const hasAdvanced = selectedByTier.advanced > 0;
    
    // Porcentagem mínima visual baseada no tier
    let minVisualPercentage = 0;
    
    if (hasEnterprise) {
      minVisualPercentage = 65; // Visualmente na zona "High" (laranja)
    } else if (hasAdvanced) {
      minVisualPercentage = 40; // Visualmente na zona "Medium" (amarelo)
    }
    
    // Retorna o maior valor entre a % real e a mínima forçada pelo tier
    return Math.max(actualPercentage, minVisualPercentage);
  };

  const { percentage, selectedByTier } = calculateComplexity();
  const complexityLevel = getComplexityLevel(percentage, selectedByTier);
  const visualPercentage = getVisualPercentage(percentage, selectedByTier);

  return (
    <TooltipProvider>
      <div className="space-y-6">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Select Your <span className="text-gradient-gold">Features</span>
          </h2>
          <p className="text-muted-foreground">
            Choose the features you need for your SaaS. At least one feature is required.
          </p>
        </div>

        {/* Complexity Score Card */}
        <div className="p-4 rounded-xl bg-muted/30 border border-border/50">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-semibold text-foreground text-sm">Complexity Score</h3>
              <p className="text-xs text-muted-foreground">Based on selected features</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-foreground">{percentage}</span>
              <span className="text-sm text-muted-foreground">/100</span>
              <span className={cn(
                "text-sm font-medium ml-2",
                complexityLevel.color === "green" && "text-green-500",
                complexityLevel.color === "yellow" && "text-yellow-500",
                complexityLevel.color === "orange" && "text-orange-500",
                complexityLevel.color === "red" && "text-red-500",
                complexityLevel.color === "gray" && "text-muted-foreground"
              )}>
                {complexityLevel.label}
              </span>
            </div>
          </div>
          
          {/* Gradient Progress Bar */}
          <div className="h-3 rounded-full bg-muted overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${visualPercentage}%`,
                background: "linear-gradient(90deg, #22c55e 0%, #eab308 40%, #f97316 70%, #ef4444 100%)"
              }}
            />
          </div>
        </div>

        {/* Accordion Tiers */}
        <div className="space-y-3">
          {tiers.map((tier) => {
            const isOpen = openTiers.includes(tier.id);
            const selectedCount = getSelectedCountForTier(tier.id);
            const allSelected = isAllSelectedForTier(tier.id);
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
                      "w-full flex items-center justify-between p-3 rounded-lg border transition-all",
                      "bg-muted/30 hover:bg-muted/50",
                      isOpen ? "border-accent/50" : "border-border/50"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-accent/20 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-accent" />
                      </div>
                      <h3 className="text-sm font-semibold text-foreground">{tier.title}</h3>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {selectedCount} selected
                      </span>
                      {isOpen ? (
                        <ChevronUp className="w-4 h-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                  </button>
                </CollapsibleTrigger>

                <CollapsibleContent>
                  <div className="pt-3 px-1">
                    {/* Select/Unselect All button */}
                    <div className="flex justify-end pb-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAllForTier(tier.id);
                        }}
                        className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
                      >
                        {allSelected ? "Unselect all" : "Select all"}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
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
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span
                                  className="cursor-help"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <Info className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                                </span>
                              </TooltipTrigger>
                              <TooltipContent side="top" className="max-w-xs">
                                <p>{feature.description}</p>
                              </TooltipContent>
                            </Tooltip>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </CollapsibleContent>
              </Collapsible>
            );
          })}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-muted-foreground">
          {data.selectedFeatures.length === 0 ? (
            <span className="text-destructive">Please select at least one feature to continue</span>
          ) : (
            <span>{data.selectedFeatures.length} feature{data.selectedFeatures.length !== 1 ? 's' : ''} selected</span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
};

export default StepFeatures;
