import { Label } from "@/components/ui/label";
import SelectableCard from "./SelectableCard";
import { cn } from "@/lib/utils";
import {
  Target,
  Rocket,
  TrendingUp,
  Calendar,
  User,
  Mail,
  Phone,
  Lightbulb,
  Building2,
  Users,
  CheckCircle,
} from "lucide-react";

const goals = [
  { id: "validate", title: "Validate Idea", description: "Test market demand first", icon: Target },
  { id: "launch", title: "Launch MVP", description: "Build and ship quickly", icon: Rocket },
  { id: "scale", title: "Scale Product", description: "Grow existing solution", icon: TrendingUp },
];

const timelines = [
  { id: "1month", label: "1 month" },
  { id: "3months", label: "3 months" },
  { id: "6months", label: "6 months" },
  { id: "flexible", label: "Flexible" },
];

interface StepGoalsProps {
  data: {
    goal: string;
    timeline: string;
  };
  allData: {
    fullName: string;
    email: string;
    phone: string;
    saasType: string;
    industry: string;
    description: string;
    customerTypes: string[];
    marketSize: string;
    selectedFeatures: string[];
    selectedTier: string;
    goal: string;
    timeline: string;
  };
  selectedPlan?: string;
  onChange: (field: string, value: string) => void;
}

const StepGoals = ({ data, allData, selectedPlan, onChange }: StepGoalsProps) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Set your <span className="text-gradient-gold">goals</span>
        </h2>
        <p className="text-muted-foreground">
          What do you want to achieve?
        </p>
      </div>

      {/* Primary Goal */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Primary Goal <span className="text-accent">*</span>
        </Label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {goals.map((goal) => (
            <SelectableCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              selected={data.goal === goal.id}
              onClick={() => onChange("goal", goal.id)}
              className="p-8"
            />
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Timeline <span className="text-accent">*</span>
        </Label>
        <div className="flex flex-wrap gap-3">
          {timelines.map((timeline) => (
            <button
              key={timeline.id}
              type="button"
              onClick={() => onChange("timeline", timeline.id)}
              className={cn(
                "px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2",
                data.timeline === timeline.id
                  ? "bg-accent text-background"
                  : "glass-card border border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
              )}
            >
              <Calendar className="w-4 h-4" />
              {timeline.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">Summary</Label>
        <div className="glass-premium rounded-2xl p-6 border border-accent/20">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Personal Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                Personal Info
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{allData.fullName || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{allData.email || "Not provided"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground">{allData.phone || "Not provided"}</span>
                </div>
              </div>
            </div>

            {/* SaaS Details */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                SaaS Details
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Lightbulb className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground capitalize">
                    {allData.saasType?.replace(/([A-Z])/g, " $1").trim() || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Building2 className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground capitalize">
                    {allData.industry || "Not selected"}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-foreground capitalize">
                    {allData.customerTypes?.length > 0 
                      ? `${allData.customerTypes.length} customer type(s) selected`
                      : "Not selected"}
                  </span>
                </div>
              </div>
            </div>

            {/* Selected Plan */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                Selected Plan
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-foreground font-medium capitalize">
                  {selectedPlan || "Not selected"}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-accent uppercase tracking-wider">
                Features
              </h4>
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-foreground">
                  {allData.selectedFeatures?.length || 0} features selected
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          {allData.description && (
            <div className="mt-6 pt-6 border-t border-border/30">
              <h4 className="text-sm font-medium text-accent uppercase tracking-wider mb-2">
                Idea Description
              </h4>
              <p className="text-sm text-muted-foreground">{allData.description}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepGoals;
