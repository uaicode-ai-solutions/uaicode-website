import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectableCard from "./SelectableCard";
import {
  Users,
  Building,
  ShoppingCart,
  UserPlus,
  DollarSign,
  Mail,
  BarChart3,
  MessageSquare,
  Headphones,
  Zap,
  BookOpen,
  Plus,
  Heart,
  GraduationCap,
  Building2,
  Store,
  Monitor,
  BarChart,
  Sparkles,
  Loader2,
} from "lucide-react";

const saasTypes = [
  { id: "crm", title: "CRM & Sales", description: "Customer relationship management", icon: Users },
  { id: "project", title: "Project Management", description: "Team collaboration tools", icon: Building },
  { id: "ecommerce", title: "E-commerce", description: "Online retail solutions", icon: ShoppingCart },
  { id: "hr", title: "HR & Recruiting", description: "Human resources platform", icon: UserPlus },
  { id: "finance", title: "Financial Management", description: "Business finance tools", icon: DollarSign },
  { id: "marketing", title: "Marketing Automation", description: "Campaign management", icon: Mail },
  { id: "analytics", title: "Analytics & BI", description: "Business intelligence", icon: BarChart3 },
  { id: "communication", title: "Communication", description: "Team messaging", icon: MessageSquare },
  { id: "support", title: "Customer Support", description: "Help desk & ticketing", icon: Headphones },
  { id: "productivity", title: "Productivity", description: "Workflow automation", icon: Zap },
  { id: "education", title: "Education & Learning", description: "LMS & e-learning", icon: BookOpen },
  { id: "other", title: "Other", description: "Something else", icon: Plus },
];

const industries = [
  { id: "healthcare", title: "Healthcare", description: "Medical & health services", icon: Heart },
  { id: "education", title: "Education", description: "Schools & universities", icon: GraduationCap },
  { id: "finance", title: "Finance", description: "Banking & fintech", icon: DollarSign },
  { id: "realestate", title: "Real Estate", description: "Property & construction", icon: Building2 },
  { id: "retail", title: "Retail", description: "Stores & commerce", icon: Store },
  { id: "technology", title: "Technology", description: "Software & IT", icon: Monitor },
  { id: "marketing", title: "Marketing", description: "Advertising & PR", icon: BarChart },
  { id: "other", title: "Other", description: "Different industry", icon: Plus },
];

interface StepYourIdeaProps {
  data: {
    saasType: string;
    saasTypeOther: string;
    industry: string;
    industryOther: string;
    description: string;
    saasName: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepYourIdea = ({ data, onChange }: StepYourIdeaProps) => {
  const [isGeneratingName, setIsGeneratingName] = useState(false);

  const isDescriptionValid = data.description.trim().length >= 20;

  const handleSuggestName = async () => {
    setIsGeneratingName(true);
    
    // Mock AI suggestion - simulates API call
    setTimeout(() => {
      const mockNames = [
        "FlowSync", "TaskPilot", "DataBridge", "CloudNest", 
        "SmartDesk", "LaunchPad", "GrowthHub", "NexGen",
        "BizFlow", "SyncPro", "MetricHub", "InsightAI",
        "PulseApp", "StreamLine", "VelocityHQ", "CoreStack"
      ];
      const randomName = mockNames[Math.floor(Math.random() * mockNames.length)];
      onChange("saasName", randomName);
      setIsGeneratingName(false);
    }, 1500);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
          Define Your <span className="text-gradient-gold">SaaS Product</span>
        </h2>
        <p className="text-muted-foreground">
          Help us understand your product vision. Select the category, industry, and describe your idea.
        </p>
      </div>

      {/* Type of SaaS */}
      <div className="space-y-3">
        <div>
          <Label className="text-foreground text-base font-medium">
            What type of SaaS are you building? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the category that best describes your product
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {saasTypes.map((type) => (
            <SelectableCard
              key={type.id}
              icon={type.icon}
              title={type.title}
              description={type.description}
              selected={data.saasType === type.id}
              onClick={() => onChange("saasType", type.id)}
            />
          ))}
        </div>
        {data.saasType === "other" && (
          <div className="mt-3">
            <Input
              placeholder="Please specify your SaaS type..."
              value={data.saasTypeOther}
              onChange={(e) => onChange("saasTypeOther", e.target.value)}
              className="bg-muted/30 border-border/50 focus:border-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 2 characters required
            </p>
          </div>
        )}
      </div>

      {/* Industry */}
      <div className="space-y-3">
        <div>
          <Label className="text-foreground text-base font-medium">
            Which industry are you targeting? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the primary industry for your product
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {industries.map((industry) => (
            <SelectableCard
              key={industry.id}
              icon={industry.icon}
              title={industry.title}
              description={industry.description}
              selected={data.industry === industry.id}
              onClick={() => onChange("industry", industry.id)}
            />
          ))}
        </div>
        {data.industry === "other" && (
          <div className="mt-3">
            <Input
              placeholder="Please specify your industry..."
              value={data.industryOther}
              onChange={(e) => onChange("industryOther", e.target.value)}
              className="bg-muted/30 border-border/50 focus:border-accent"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 2 characters required
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="description" className="text-foreground text-base font-medium">
            Describe your SaaS idea <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            The more detail you provide, the better our analysis will be (minimum 20 characters)
          </p>
        </div>
        <Textarea
          id="description"
          placeholder="Describe your SaaS idea in detail. What problem does it solve? Who is it for? What makes it unique?"
          value={data.description}
          onChange={(e) => onChange("description", e.target.value.slice(0, 1000))}
          className="bg-muted/30 border-border/50 focus:border-accent min-h-[120px] resize-none"
        />
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Improve with AI
          </Button>
          <span className="text-sm text-muted-foreground">
            {data.description.length}/1000
          </span>
        </div>
      </div>

      {/* SaaS Name */}
      <div className="space-y-3">
        <div>
          <Label htmlFor="saasName" className="text-foreground text-base font-medium">
            Name your SaaS <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Choose a memorable name for your product (minimum 3 characters)
          </p>
        </div>
        
        <div className="flex gap-3">
          <Input
            id="saasName"
            placeholder="e.g., TaskFlow, PayBuddy, HealthHub..."
            value={data.saasName}
            onChange={(e) => onChange("saasName", e.target.value.slice(0, 50))}
            disabled={!isDescriptionValid}
            className="bg-muted/30 border-border/50 focus:border-accent flex-1 
                       disabled:opacity-50 disabled:cursor-not-allowed"
            maxLength={50}
          />
          <Button
            type="button"
            variant="outline"
            disabled={!isDescriptionValid || isGeneratingName}
            onClick={handleSuggestName}
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent
                       disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isGeneratingName ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Suggest with AI
              </>
            )}
          </Button>
        </div>
        
        {!isDescriptionValid ? (
          <p className="text-xs text-muted-foreground italic">
            Fill in the description above (minimum 20 characters) to enable this field
          </p>
        ) : (
          <span className="text-xs text-muted-foreground">
            {data.saasName.length}/50 characters
          </span>
        )}
      </div>
    </div>
  );
};

export default StepYourIdea;
