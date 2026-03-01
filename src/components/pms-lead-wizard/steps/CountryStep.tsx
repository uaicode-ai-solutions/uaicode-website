import LeadWizardStep from "../LeadWizardStep";
import SelectableCard from "@/components/planningmysaas/wizard/SelectableCard";
import { Input } from "@/components/ui/input";
import { Globe, Flag, MapPin, Landmark, MoreHorizontal } from "lucide-react";

const countries = [
  { id: "us", title: "United States", icon: Globe },
  { id: "brazil", title: "Brazil", icon: Flag },
  { id: "europe", title: "Europe", icon: Landmark },
  { id: "asia", title: "Asia", icon: MapPin },
  { id: "other", title: "Other", icon: MoreHorizontal },
];

interface Props {
  value: string;
  otherValue?: string;
  onChange: (v: string) => void;
  onOtherChange?: (v: string) => void;
}

const CountryStep = ({ value, otherValue, onChange, onOtherChange }: Props) => (
  <LeadWizardStep title="Where are you based?" subtitle="Select your country or region">
    <div className="grid grid-cols-2 gap-3">
      {countries.map((c) => (
        <SelectableCard
          key={c.id}
          icon={c.icon}
          title={c.title}
          selected={value === c.id}
          onClick={() => onChange(c.id)}
        />
      ))}
    </div>
    {value === "other" && onOtherChange && (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <Input
          autoFocus
          placeholder="Please specify your country..."
          value={otherValue || ""}
          onChange={(e) => onOtherChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
      </div>
    )}
  </LeadWizardStep>
);

export default CountryStep;
