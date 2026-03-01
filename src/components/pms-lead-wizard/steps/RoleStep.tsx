import LeadWizardStep from "../LeadWizardStep";
import SelectableCard from "@/components/planningmysaas/wizard/SelectableCard";
import { Input } from "@/components/ui/input";
import { UserCircle, User, Code, ClipboardList, TrendingUp, MoreHorizontal } from "lucide-react";

const roles = [
  { id: "founder", title: "Founder / Co-founder", description: "Leading the vision", icon: UserCircle },
  { id: "solo", title: "Solo Founder", description: "Building alone", icon: User },
  { id: "cto", title: "CTO / Technical Partner", description: "Technical leadership", icon: Code },
  { id: "pm", title: "Product Manager", description: "Product strategy", icon: ClipboardList },
  { id: "investor", title: "Investor / Advisor", description: "Supporting growth", icon: TrendingUp },
  { id: "other", title: "Other", description: "Different role", icon: MoreHorizontal },
];

interface Props {
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}

const RoleStep = ({ value, otherValue, onChange, onOtherChange }: Props) => (
  <LeadWizardStep title="What's your role?" subtitle="Select the option that best describes you">
    <div className="grid grid-cols-2 gap-3">
      {roles.map((r) => (
        <SelectableCard
          key={r.id}
          icon={r.icon}
          title={r.title}
          description={r.description}
          selected={value === r.id}
          onClick={() => onChange(r.id)}
        />
      ))}
    </div>
    {value === "other" && (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <Input
          autoFocus
          placeholder="Please specify your role..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
      </div>
    )}
  </LeadWizardStep>
);

export default RoleStep;
