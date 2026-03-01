import LeadWizardStep from "../LeadWizardStep";
import SelectableCard from "@/components/planningmysaas/wizard/SelectableCard";
import { Input } from "@/components/ui/input";
import {
  Heart, GraduationCap, DollarSign, Building2, Store,
  Monitor, BarChart, Truck, Plane, Factory, Scale, Plus,
} from "lucide-react";

const industries = [
  { id: "healthcare", title: "Healthcare", description: "Medical & health", icon: Heart },
  { id: "education", title: "Education", description: "Schools & universities", icon: GraduationCap },
  { id: "finance", title: "Finance", description: "Banking & fintech", icon: DollarSign },
  { id: "realestate", title: "Real Estate", description: "Property & construction", icon: Building2 },
  { id: "retail", title: "Retail", description: "Stores & commerce", icon: Store },
  { id: "technology", title: "Technology", description: "Software & IT", icon: Monitor },
  { id: "marketing", title: "Marketing", description: "Advertising & PR", icon: BarChart },
  { id: "logistics", title: "Logistics", description: "Shipping & warehousing", icon: Truck },
  { id: "hospitality", title: "Hospitality", description: "Hotels & tourism", icon: Plane },
  { id: "manufacturing", title: "Manufacturing", description: "Production & Industry", icon: Factory },
  { id: "legal", title: "Legal", description: "Law & compliance", icon: Scale },
  { id: "other", title: "Other", description: "Different industry", icon: Plus },
];

interface Props {
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}

const IndustryStep = ({ value, otherValue, onChange, onOtherChange }: Props) => (
  <LeadWizardStep title="Which industry are you targeting?" subtitle="Select the primary industry for your product">
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {industries.map((ind) => (
        <SelectableCard
          key={ind.id}
          icon={ind.icon}
          title={ind.title}
          description={ind.description}
          selected={value === ind.id}
          onClick={() => onChange(ind.id)}
        />
      ))}
    </div>
    {value === "other" && (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <Input
          autoFocus
          placeholder="Please specify your industry..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
      </div>
    )}
  </LeadWizardStep>
);

export default IndustryStep;
