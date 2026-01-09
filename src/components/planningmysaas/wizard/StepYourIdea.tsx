import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import SelectableCard from "./SelectableCard";
import {
  Building2,
  Users,
  ShoppingBag,
  Wrench,
  Bot,
  Lightbulb,
  Heart,
  DollarSign,
  ShoppingCart,
  GraduationCap,
  Home,
  Megaphone,
  UserPlus,
  Truck,
  Globe,
} from "lucide-react";

const saasTypes = [
  { id: "b2b", title: "B2B Platform", description: "Business-to-business software", icon: Building2 },
  { id: "b2c", title: "B2C App", description: "Consumer-facing application", icon: Users },
  { id: "marketplace", title: "Marketplace", description: "Two-sided platform", icon: ShoppingBag },
  { id: "tool", title: "SaaS Tool", description: "Productivity/utility tool", icon: Wrench },
  { id: "ai", title: "AI/Automation", description: "AI-powered solution", icon: Bot },
  { id: "other", title: "Other", description: "Something unique", icon: Lightbulb },
];

const industries = [
  { id: "healthcare", title: "Healthcare", icon: Heart },
  { id: "finance", title: "Finance", icon: DollarSign },
  { id: "ecommerce", title: "E-commerce", icon: ShoppingCart },
  { id: "education", title: "Education", icon: GraduationCap },
  { id: "realestate", title: "Real Estate", icon: Home },
  { id: "marketing", title: "Marketing", icon: Megaphone },
  { id: "hr", title: "HR/Recruiting", icon: UserPlus },
  { id: "logistics", title: "Logistics", icon: Truck },
  { id: "other", title: "Other", icon: Globe },
];

interface StepYourIdeaProps {
  data: {
    saasType: string;
    industry: string;
    description: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepYourIdea = ({ data, onChange }: StepYourIdeaProps) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Describe your <span className="text-gradient-gold">SaaS idea</span>
        </h2>
        <p className="text-muted-foreground">
          Help us understand what you're building.
        </p>
      </div>

      {/* Type of SaaS */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Type of SaaS <span className="text-accent">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {saasTypes.map((type) => (
            <SelectableCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={data.saasType === type.id}
              onClick={() => onChange("saasType", type.id)}
            />
          ))}
        </div>
      </div>

      {/* Industry */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Industry <span className="text-accent">*</span>
        </Label>
        <div className="grid grid-cols-3 gap-3">
          {industries.map((industry) => (
            <SelectableCard
              key={industry.id}
              icon={industry.icon}
              title={industry.title}
              selected={data.industry === industry.id}
              onClick={() => onChange("industry", industry.id)}
              className="p-4"
            />
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="description" className="text-foreground text-lg">
            Describe your idea
          </Label>
          <span className="text-xs text-muted-foreground">
            {data.description.length}/500
          </span>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your SaaS idea in a few sentences..."
          value={data.description}
          onChange={(e) => onChange("description", e.target.value.slice(0, 500))}
          className="bg-muted/50 border-border/50 focus:border-accent min-h-[120px] resize-none"
        />
      </div>
    </div>
  );
};

export default StepYourIdea;
