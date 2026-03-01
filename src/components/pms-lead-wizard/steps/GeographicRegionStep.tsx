import LeadWizardStep from "../LeadWizardStep";
import SelectableCard from "@/components/planningmysaas/wizard/SelectableCard";
import { Input } from "@/components/ui/input";
import { Globe, Flag, Landmark, MapPin, MoreHorizontal } from "lucide-react";

const regions = [
  { id: "north_america", title: "North America", icon: Globe },
  { id: "latin_america", title: "Latin America", icon: Flag },
  { id: "europe", title: "Europe", icon: Landmark },
  { id: "asia_pacific", title: "Asia Pacific", icon: MapPin },
  { id: "other", title: "Other / Global", icon: MoreHorizontal },
];

interface Props {
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}

const GeographicRegionStep = ({ value, otherValue, onChange, onOtherChange }: Props) => (
  <LeadWizardStep title="Target geographic region?" subtitle="Where will your product primarily operate?">
    <div className="grid grid-cols-2 gap-3">
      {regions.map((r) => (
        <SelectableCard
          key={r.id}
          icon={r.icon}
          title={r.title}
          selected={value === r.id}
          onClick={() => onChange(r.id)}
        />
      ))}
    </div>
    {value === "other" && (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <Input
          autoFocus
          placeholder="Please specify your target region..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
      </div>
    )}
  </LeadWizardStep>
);

export default GeographicRegionStep;
