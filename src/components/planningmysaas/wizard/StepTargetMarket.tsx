import { Label } from "@/components/ui/label";
import SelectableCard from "./SelectableCard";
import {
  Rocket,
  Building,
  Building2,
  Factory,
  User,
  Briefcase,
  Users,
  TrendingUp,
  BarChart3,
  Globe,
} from "lucide-react";

const customerTypes = [
  { id: "startups", title: "Startups & Founders", description: "Early-stage companies", icon: Rocket },
  { id: "small", title: "Small Businesses", description: "1-50 employees", icon: Building },
  { id: "midmarket", title: "Mid-Market", description: "51-500 employees", icon: Building2 },
  { id: "enterprise", title: "Enterprise", description: "500+ employees", icon: Factory },
  { id: "consumers", title: "Consumers", description: "Individual users", icon: User },
  { id: "freelancers", title: "Freelancers", description: "Solo professionals", icon: Briefcase },
];

const marketSizes = [
  { id: "niche", title: "Niche", description: "Less than 10K potential users", icon: Users },
  { id: "growing", title: "Growing", description: "10K - 100K users", icon: TrendingUp },
  { id: "established", title: "Established", description: "100K - 1M users", icon: BarChart3 },
  { id: "massive", title: "Massive", description: "1M+ users", icon: Globe },
];

interface StepTargetMarketProps {
  data: {
    customerType: string;
    marketSize: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepTargetMarket = ({ data, onChange }: StepTargetMarketProps) => {
  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Define your <span className="text-gradient-gold">target market</span>
        </h2>
        <p className="text-muted-foreground">
          Who are you building this for?
        </p>
      </div>

      {/* Ideal Customer */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Ideal Customer <span className="text-accent">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {customerTypes.map((type) => (
            <SelectableCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={data.customerType === type.id}
              onClick={() => onChange("customerType", type.id)}
            />
          ))}
        </div>
      </div>

      {/* Market Size */}
      <div className="space-y-4">
        <Label className="text-foreground text-lg">
          Market Size <span className="text-accent">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketSizes.map((size) => (
            <SelectableCard
              key={size.id}
              icon={size.icon}
              title={size.title}
              description={size.description}
              selected={data.marketSize === size.id}
              onClick={() => onChange("marketSize", size.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepTargetMarket;
