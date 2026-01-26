import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectableCard from "./SelectableCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
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
  Upload,
  X,
  Image as ImageIcon,
  Lightbulb,
  Search,
  Rocket,
  CircleDollarSign,
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

const productStages = [
  { id: "idea", title: "Just an idea", description: "Hypothesis stage", icon: Lightbulb },
  { id: "validating", title: "Validating", description: "Testing the problem", icon: Search },
  { id: "mvp", title: "MVP built", description: "Testing with users", icon: Rocket },
  { id: "live", title: "Already live", description: "With paying users", icon: CircleDollarSign },
];

interface StepYourIdeaProps {
  data: {
    productStage: string;
    saasType: string;
    saasTypeOther: string;
    industry: string;
    industryOther: string;
    description: string;
    saasName: string;
    saasLogo: string;
  };
  onChange: (field: string, value: string) => void;
}

const StepYourIdea = ({ data, onChange }: StepYourIdeaProps) => {
  const [isGeneratingName, setIsGeneratingName] = useState(false);
  const [isImprovingDescription, setIsImprovingDescription] = useState(false);

  const isDescriptionValid = data.description.trim().length >= 20;

  const handleImproveDescription = async (retryCount = 0) => {
    if (data.description.length < 10) {
      toast.error("Please write at least 10 characters before improving");
      return;
    }
    
    setIsImprovingDescription(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('pms-improve-description', {
        body: {
          description: data.description,
          saasType: data.saasType,
          industry: data.industry
        }
      });
      
      if (error) throw error;
      
      if (result?.improvedDescription) {
        onChange("description", result.improvedDescription);
        toast.success("Description improved successfully!");
      }
    } catch (error: any) {
      console.error("Error improving description:", error);
      
      // Retry up to 2 times for transient failures (network/deployment issues)
      if (retryCount < 2 && (error?.message?.includes('Failed to fetch') || error?.message?.includes('NetworkError'))) {
        console.log(`Retrying... attempt ${retryCount + 2}`);
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait 1.5s before retry
        return handleImproveDescription(retryCount + 1);
      }
      
      if (error?.status === 429) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error?.status === 402) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error("Failed to improve description. Please try again.");
      }
    } finally {
      setIsImprovingDescription(false);
    }
  };

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

      {/* Product Stage */}
      <div className="space-y-3">
        <div>
          <Label className="text-foreground text-base font-medium">
            What stage is your product in right now? <span className="text-accent">*</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            Select the option that best describes your current progress
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {productStages.map((stage) => (
            <SelectableCard
              key={stage.id}
              icon={stage.icon}
              title={stage.title}
              description={stage.description}
              selected={data.productStage === stage.id}
              onClick={() => onChange("productStage", stage.id)}
            />
          ))}
        </div>
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
            onClick={() => handleImproveDescription()}
            disabled={data.description.length < 10 || isImprovingDescription}
            className="border-accent text-accent hover:bg-accent/10 hover:text-accent
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isImprovingDescription ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Improving...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Improve with AI
              </>
            )}
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

      {/* Logo Upload - Optional */}
      <div className="space-y-3">
        <div>
          <Label className="text-foreground text-base font-medium">
            Upload your Logo <span className="text-muted-foreground text-sm font-normal">(optional)</span>
          </Label>
          <p className="text-sm text-muted-foreground mt-1">
            If you don't have a logo yet, don't worry — we'll create one for you!
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {/* Logo Preview */}
          {data.saasLogo ? (
            <div className="relative">
              <div className="w-20 h-20 rounded-lg border-2 border-accent/50 overflow-hidden bg-muted/30 flex items-center justify-center">
                <img 
                  src={data.saasLogo} 
                  alt="Logo preview" 
                  className="max-w-full max-h-full object-contain"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
                onClick={() => onChange("saasLogo", "")}
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          ) : (
            <div className="w-20 h-20 rounded-lg border-2 border-dashed border-border/50 bg-muted/20 flex items-center justify-center">
              <ImageIcon className="w-8 h-8 text-muted-foreground/50" />
            </div>
          )}
          
          {/* Upload Button */}
          <div className="flex-1">
            <input
              type="file"
              id="logo-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                // Validate file size (max 2MB)
                if (file.size > 2 * 1024 * 1024) {
                  alert("File size must be less than 2MB");
                  return;
                }
                
                // Validate file type
                if (!file.type.startsWith("image/")) {
                  alert("Please upload an image file");
                  return;
                }
                
                // Convert to base64 for preview and storage
                const reader = new FileReader();
                reader.onloadend = () => {
                  onChange("saasLogo", reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              className="border-border/50 hover:border-accent hover:bg-accent/10"
            >
              <Upload className="w-4 h-4 mr-2" />
              {data.saasLogo ? "Change Logo" : "Upload Logo"}
            </Button>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG or SVG. Max 2MB. Recommended: 512×512px
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepYourIdea;
