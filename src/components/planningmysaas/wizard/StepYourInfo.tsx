import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Check, Users, Sparkles, Shield, Mail, UserCircle, User, Code, ClipboardList, TrendingUp, MoreHorizontal } from "lucide-react";
import SelectableCard from "./SelectableCard";

interface StepYourInfoProps {
  data: {
    fullName: string;
    email: string;
    linkedinProfile: string;
    phone: string;
    userRole: string;
    userRoleOther: string;
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

const roleOptions = [
  { 
    id: "founder", 
    title: "Founder / Co-founder", 
    description: "Leading the vision", 
    icon: UserCircle 
  },
  { 
    id: "solo", 
    title: "Solo Founder", 
    description: "Building alone", 
    icon: User 
  },
  { 
    id: "cto", 
    title: "CTO / Technical Partner", 
    description: "Technical leadership", 
    icon: Code 
  },
  { 
    id: "pm", 
    title: "Product Manager", 
    description: "Product strategy", 
    icon: ClipboardList 
  },
  { 
    id: "investor", 
    title: "Investor / Advisor", 
    description: "Supporting growth", 
    icon: TrendingUp 
  },
  { 
    id: "other", 
    title: "Other", 
    description: "Different role", 
    icon: MoreHorizontal 
  },
];

const StepYourInfo = ({ data, onChange }: StepYourInfoProps) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Hero Section */}
      <div className="text-center space-y-3">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Complete Your <span className="text-gradient-gold">Profile</span>
        </h2>
        <p className="text-muted-foreground text-base max-w-xl mx-auto">
          Help us personalize your SaaS validation report with a few more details.
        </p>
      </div>

      {/* Feature Bullets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {features.map((feature, index) => (
          <div key={index} className="flex items-start gap-2">
            <Check className="w-4 h-4 text-accent shrink-0 mt-0.5" />
            <span className="text-sm text-foreground/80">{feature}</span>
          </div>
        ))}
      </div>

      {/* Role Selection */}
      <div className="space-y-4">
        <div>
          <Label className="text-foreground text-lg">
            What's your role? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the option that best describes you
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {roleOptions.map((role) => (
            <SelectableCard
              key={role.id}
              icon={role.icon}
              title={role.title}
              description={role.description}
              selected={data.userRole === role.id}
              onClick={() => onChange("userRole", role.id)}
            />
          ))}
        </div>
        
        {/* Other role text input */}
        {data.userRole === "other" && (
          <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
            <Label htmlFor="userRoleOther" className="text-sm text-muted-foreground">
              Please specify your role <span className="text-accent">*</span>
            </Label>
            <Input
              id="userRoleOther"
              type="text"
              placeholder="e.g., Marketing Director, Investor..."
              value={data.userRoleOther}
              onChange={(e) => onChange("userRoleOther", e.target.value)}
              className="bg-background border-border/50 focus:border-accent"
            />
          </div>
        )}
      </div>

      {/* Form Card */}
      <div className="bg-muted/30 border border-border/30 rounded-xl p-6 space-y-5">
        {/* Email - Read-only from login */}
        <div className="space-y-1.5">
          <Label className="text-sm text-muted-foreground flex items-center gap-2">
            <Mail className="w-3.5 h-3.5" />
            Email Address
          </Label>
          <div className="bg-muted/50 border border-border/30 rounded-md px-3 py-2.5 text-foreground flex items-center gap-2">
            <span className="text-sm">{data.email || "From login"}</span>
            <span className="text-xs text-muted-foreground ml-auto">✓ Verified</span>
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <Label htmlFor="fullName" className="text-sm text-muted-foreground">
            Full Name <span className="text-accent">*</span>
          </Label>
          <Input
            id="fullName"
            type="text"
            placeholder="John Doe"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
            className="bg-background border-border/50 focus:border-accent"
          />
        </div>

        {/* Phone */}
        <div className="space-y-1.5">
          <Label htmlFor="phone" className="text-sm text-muted-foreground">
            Phone Number <span className="text-accent">*</span>
          </Label>
          <PhoneInput
            value={data.phone}
            onChange={(value) => onChange("phone", value)}
            defaultCountry="us"
            placeholder="(555) 123-4567"
          />
        </div>

        {/* LinkedIn Profile - Optional */}
        <div className="space-y-1.5">
          <Label htmlFor="linkedinProfile" className="text-sm text-muted-foreground">
            LinkedIn Profile
          </Label>
          <Input
            id="linkedinProfile"
            type="url"
            placeholder="https://linkedin.com/in/johndoe"
            value={data.linkedinProfile}
            onChange={(e) => onChange("linkedinProfile", e.target.value)}
            className="bg-background border-border/50 focus:border-accent"
          />
        </div>
      </div>

      {/* Trust Badges */}
      <div className="flex flex-wrap justify-center gap-6">
        {trustBadges.map((badge, index) => (
          <div key={index} className="flex items-center gap-2">
            <badge.icon className="w-4 h-4 text-accent" />
            <span className="text-xs text-muted-foreground">{badge.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepYourInfo;
