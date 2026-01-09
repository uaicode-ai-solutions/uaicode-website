import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";

interface StepYourInfoProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepYourInfo = ({ data, onChange }: StepYourInfoProps) => {
  return (
    <div className="max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Tell us about <span className="text-gradient-gold">yourself</span>
        </h2>
        <p className="text-muted-foreground">
          We'll use this information to personalize your report.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-6">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName" className="text-foreground">
            Full Name <span className="text-accent">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="bg-muted/50 border-border/50 focus:border-accent"
          />
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-foreground">
            Email Address <span className="text-accent">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="john@example.com"
            value={data.email}
            onChange={(e) => onChange("email", e.target.value)}
            className="bg-muted/50 border-border/50 focus:border-accent"
          />
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-foreground">
            Phone Number <span className="text-accent">*</span>
          </Label>
          <PhoneInput
            value={data.phone}
            onChange={(value) => onChange("phone", value)}
            defaultCountry="us"
            placeholder="(555) 123-4567"
          />
        </div>
      </div>
    </div>
  );
};

export default StepYourInfo;
