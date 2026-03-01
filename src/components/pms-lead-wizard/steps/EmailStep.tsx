import LeadWizardStep from "../LeadWizardStep";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const EmailStep = ({ value, onChange }: Props) => (
  <LeadWizardStep title="What's your company email?" subtitle="We'll send your report to this address">
    <Input
      autoFocus
      type="email"
      placeholder="john@company.com"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
    />
  </LeadWizardStep>
);

export default EmailStep;
