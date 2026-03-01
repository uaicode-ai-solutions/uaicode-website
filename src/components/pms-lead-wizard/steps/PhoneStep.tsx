import LeadWizardStep from "../LeadWizardStep";
import { PhoneInput } from "@/components/ui/phone-input";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const PhoneStep = ({ value, onChange }: Props) => (
  <LeadWizardStep title="What's your phone number?" subtitle="For follow-up if needed">
    <PhoneInput
      value={value}
      onChange={onChange}
      defaultCountry="us"
    />
  </LeadWizardStep>
);

export default PhoneStep;
