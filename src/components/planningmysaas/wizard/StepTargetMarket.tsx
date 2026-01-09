import { Label } from "@/components/ui/label";
import SelectableCard from "./SelectableCard";
import {
  Building,
  Building2,
  Landmark,
  User,
  Rocket,
  Heart,
  MapPin,
  Flag,
  Globe,
  HelpCircle,
} from "lucide-react";

const customerTypes = [
  { id: "small", title: "Small Businesses", description: "1-50 employees", icon: Building },
  { id: "medium", title: "Medium Companies", description: "51-500 employees", icon: Building2 },
  { id: "enterprise", title: "Large Enterprises", description: "500+ employees", icon: Landmark },
  { id: "individual", title: "Individual Professionals", description: "Freelancers & consultants", icon: User },
  { id: "startups", title: "Startups & Entrepreneurs", description: "Early-stage companies", icon: Rocket },
  { id: "government", title: "Government/Non-profit", description: "Public sector organizations", icon: Heart },
];

const marketSizes = [
  { id: "local", title: "Local/Regional", description: "under $1M", icon: MapPin },
  { id: "national", title: "National", description: "$1M - $100M", icon: Flag },
  { id: "global", title: "Global", description: "$100M+", icon: Globe },
  { id: "unsure", title: "I'm not sure yet", description: "", icon: HelpCircle },
];

interface StepTargetMarketProps {
  data: {
    customerTypes: string[];
    marketSize: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const StepTargetMarket = ({ data, onChange }: StepTargetMarketProps) => {
  const handleCustomerTypeToggle = (typeId: string) => {
    const currentTypes = data.customerTypes;
    if (currentTypes.includes(typeId)) {
      onChange("customerTypes", currentTypes.filter(t => t !== typeId));
    } else {
      onChange("customerTypes", [...currentTypes, typeId]);
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Define Your <span className="text-gradient-gold">Target Market</span>
        </h2>
        <p className="text-muted-foreground">
          Help us understand who your ideal customers are and the size of your market opportunity.
        </p>
      </div>

      {/* Ideal Customer - Multi-Select */}
      <div className="space-y-4">
        <div>
          <Label className="text-foreground text-lg">
            Who is your ideal customer? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select all that apply
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {customerTypes.map((type) => (
            <SelectableCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={data.customerTypes.includes(type.id)}
              onClick={() => handleCustomerTypeToggle(type.id)}
            />
          ))}
        </div>
      </div>

      {/* Market Size - Single Select */}
      <div className="space-y-4">
        <div>
          <Label className="text-foreground text-lg">
            What's your estimated addressable market size? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the option that best fits your target market
          </p>
        </div>
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
