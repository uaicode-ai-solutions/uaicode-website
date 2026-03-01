import LeadWizardStep from "../LeadWizardStep";
import { Input } from "@/components/ui/input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const LinkedInStep = ({ value, onChange }: Props) => (
  <LeadWizardStep title="What's your LinkedIn?" subtitle="Optional — helps us understand your background">
    <Input
      autoFocus
      type="url"
      placeholder="https://linkedin.com/in/johndoe"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
    />
  </LeadWizardStep>
);

export default LinkedInStep;
