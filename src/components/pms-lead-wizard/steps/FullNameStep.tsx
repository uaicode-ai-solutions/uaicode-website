import LeadWizardStep from "../LeadWizardStep";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const FullNameStep = ({ value, onChange }: Props) => (
  <LeadWizardStep title="What's your full name?" subtitle="So we know who to address the report to">
    <Input
      autoFocus
      placeholder="John Doe"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
    />
  </LeadWizardStep>
);

export default FullNameStep;
