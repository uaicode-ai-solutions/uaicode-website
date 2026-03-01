import LeadWizardStep from "../LeadWizardStep";
import { Input } from "@/components/ui/input";

const PREFIX = "https://linkedin.com/in/";

const extractUsername = (url: string) => {
  if (url.startsWith(PREFIX)) return url.slice(PREFIX.length);
  return url;
};

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const LinkedInStep = ({ value, onChange }: Props) => (
  <LeadWizardStep title="What's your LinkedIn?" subtitle="Optional — helps us understand your background">
    <div className="flex items-center h-12 rounded-md border border-border/50 bg-muted/30 overflow-hidden focus-within:border-accent transition-colors">
      <span className="px-3 text-sm text-muted-foreground whitespace-nowrap select-none bg-muted/50 h-full flex items-center border-r border-border/50">
        https://linkedin.com/in/
      </span>
      <Input
        autoFocus
        type="text"
        placeholder="your_username"
        value={extractUsername(value)}
        onChange={(e) => {
          const username = e.target.value.trim();
          onChange(username ? PREFIX + username : "");
        }}
        className="border-0 bg-transparent h-full focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
      />
    </div>
  </LeadWizardStep>
);

export default LinkedInStep;
