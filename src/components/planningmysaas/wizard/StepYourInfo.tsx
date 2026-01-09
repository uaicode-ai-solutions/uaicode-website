import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Sparkles, Users, Shield } from "lucide-react";

interface StepYourInfoProps {
  data: {
    fullName: string;
    email: string;
    phone: string;
  };
  onChange: (field: string, value: string) => void;
}

const features = [
  "Market analysis and competitive landscape",
  "Technical feasibility assessment",
  "Financial projections and ROI estimates",
  "Personalized development recommendations"
];

const trustBadges = [
  { icon: Users, text: "Used by 500+ entrepreneurs" },
  { icon: Sparkles, text: "Powered by AI technology" },
  { icon: Shield, text: "Your data is 100% secure" }
];

const StepYourInfo = ({ data, onChange }: StepYourInfoProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground">
          Unlock Your <span className="text-gradient-gold">SaaS Potential</span> in 5 Minutes
        </h2>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Get a comprehensive feasibility study tailored to your idea. Our AI-powered analysis will help you understand your market opportunity.
        </p>
      </div>

      {/* Feature Bullets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-3">
            <Sparkles className="w-5 h-5 text-accent shrink-0 mt-0.5" />
            <span className="text-foreground/90">{feature}</span>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <div className="bg-card/80 backdrop-blur border border-border/50 rounded-xl p-6 md:p-8 space-y-6">
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

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-6 md:gap-8">
        {trustBadges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2">
            <badge.icon className="w-4 h-4 text-accent" />
            <span className="text-sm text-muted-foreground">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepYourInfo;
