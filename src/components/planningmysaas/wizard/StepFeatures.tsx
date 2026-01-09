import { useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Lock,
  LayoutDashboard,
  Bell,
  Download,
  Smartphone,
  BarChart3,
  Users,
  Palette,
  Plug,
  TrendingUp,
  Workflow,
  Languages,
  Key,
  Bot,
  Building,
  Headphones,
  Settings,
  UserCheck,
} from "lucide-react";

const featuresByTier = {
  essential: [
    { id: "auth", label: "User Authentication", icon: Lock },
    { id: "dashboard", label: "Basic Dashboard", icon: LayoutDashboard },
    { id: "notifications", label: "Email Notifications", icon: Bell },
    { id: "export", label: "Data Export (CSV)", icon: Download },
    { id: "mobile", label: "Mobile Responsive", icon: Smartphone },
    { id: "analytics", label: "Basic Analytics", icon: BarChart3 },
  ],
  advanced: [
    { id: "roles", label: "Role-Based Access", icon: Users },
    { id: "branding", label: "Custom Branding", icon: Palette },
    { id: "api", label: "API Integration", icon: Plug },
    { id: "advancedAnalytics", label: "Advanced Analytics", icon: TrendingUp },
    { id: "workflows", label: "Automated Workflows", icon: Workflow },
    { id: "multilang", label: "Multi-language Support", icon: Languages },
  ],
  enterprise: [
    { id: "sso", label: "SSO Integration", icon: Key },
    { id: "ai", label: "Custom AI Models", icon: Bot },
    { id: "whitelabel", label: "White-label Solution", icon: Building },
    { id: "priority", label: "Priority Support", icon: Headphones },
    { id: "customIntegrations", label: "Custom Integrations", icon: Settings },
    { id: "accountManager", label: "Dedicated Account Manager", icon: UserCheck },
  ],
};

interface StepFeaturesProps {
  data: {
    selectedFeatures: string[];
    selectedTier: string;
  };
  onChange: (field: string, value: string | string[]) => void;
  selectedPlan?: string;
}

const StepFeatures = ({ data, onChange, selectedPlan }: StepFeaturesProps) => {
  // Set initial tier based on selected plan
  useEffect(() => {
    if (selectedPlan && !data.selectedTier) {
      const tierMap: Record<string, string> = {
        starter: "essential",
        pro: "advanced",
        enterprise: "enterprise",
      };
      const tier = tierMap[selectedPlan.toLowerCase()] || "essential";
      onChange("selectedTier", tier);
    }
  }, [selectedPlan, data.selectedTier, onChange]);

  const handleFeatureToggle = (featureId: string) => {
    const newFeatures = data.selectedFeatures.includes(featureId)
      ? data.selectedFeatures.filter((id) => id !== featureId)
      : [...data.selectedFeatures, featureId];
    onChange("selectedFeatures", newFeatures);
  };

  const handleTabChange = (tier: string) => {
    onChange("selectedTier", tier);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Select your <span className="text-gradient-gold">features</span>
        </h2>
        <p className="text-muted-foreground">
          Choose the features you want in your SaaS product.
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        value={data.selectedTier || "essential"}
        onValueChange={handleTabChange}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 bg-muted/50">
          <TabsTrigger
            value="essential"
            className="data-[state=active]:bg-accent data-[state=active]:text-background"
          >
            Essential
          </TabsTrigger>
          <TabsTrigger
            value="advanced"
            className="data-[state=active]:bg-accent data-[state=active]:text-background"
          >
            Advanced
          </TabsTrigger>
          <TabsTrigger
            value="enterprise"
            className="data-[state=active]:bg-accent data-[state=active]:text-background"
          >
            Enterprise
          </TabsTrigger>
        </TabsList>

        {Object.entries(featuresByTier).map(([tier, features]) => (
          <TabsContent key={tier} value={tier} className="mt-6">
            <div className="space-y-4">
              {tier !== "essential" && (
                <p className="text-sm text-muted-foreground text-center mb-6">
                  {tier === "advanced"
                    ? "Includes all Essential features plus:"
                    : "Includes all Essential and Advanced features plus:"}
                </p>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature) => {
                  const Icon = feature.icon;
                  const isSelected = data.selectedFeatures.includes(feature.id);

                  return (
                    <button
                      key={feature.id}
                      type="button"
                      onClick={() => handleFeatureToggle(feature.id)}
                      className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 glass-card border ${
                        isSelected
                          ? "border-accent bg-accent/10"
                          : "border-border/50 hover:border-accent/50"
                      }`}
                    >
                      <Checkbox
                        checked={isSelected}
                        className="data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <div
                        className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          isSelected ? "bg-accent/20" : "bg-muted"
                        }`}
                      >
                        <Icon
                          className={`w-5 h-5 ${
                            isSelected ? "text-accent" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <span
                        className={`font-medium ${
                          isSelected ? "text-foreground" : "text-muted-foreground"
                        }`}
                      >
                        {feature.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Selected count */}
      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          {data.selectedFeatures.length} feature
          {data.selectedFeatures.length !== 1 ? "s" : ""} selected
        </span>
      </div>
    </div>
  );
};

export default StepFeatures;
