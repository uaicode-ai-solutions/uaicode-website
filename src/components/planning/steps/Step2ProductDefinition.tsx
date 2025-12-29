import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  ArrowLeft, 
  ArrowRight, 
  ShoppingCart,
  Store,
  Users, 
  DollarSign, 
  BarChart3, 
  Mail, 
  Briefcase, 
  PieChart, 
  MessageSquare,
  Headphones,
  Zap,
  GraduationCap,
  Plus,
  Heart,
  Building,
  Cpu,
  Sparkles,
  Loader2
} from "lucide-react";
import { WizardData } from "@/pages/Planning";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step2Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  onNext: (stepData?: Partial<WizardData>) => void;
  onPrev: (stepData?: Partial<WizardData>) => void;
}

const saasCategories = [
  { id: "crm-sales", icon: Users, title: "CRM & Sales", description: "Customer relationship management" },
  { id: "project-management", icon: Briefcase, title: "Project Management", description: "Team collaboration tools" },
  { id: "ecommerce", icon: ShoppingCart, title: "E-commerce", description: "Online retail solutions" },
  { id: "hr-recruiting", icon: Users, title: "HR & Recruiting", description: "Human resources platform" },
  { id: "financial", icon: DollarSign, title: "Financial Management", description: "Business finance tools" },
  { id: "marketing", icon: Mail, title: "Marketing Automation", description: "Campaign management" },
  { id: "analytics", icon: PieChart, title: "Analytics & BI", description: "Business intelligence" },
  { id: "communication", icon: MessageSquare, title: "Communication", description: "Team messaging" },
  { id: "customer-support", icon: Headphones, title: "Customer Support", description: "Help desk & ticketing" },
  { id: "productivity", icon: Zap, title: "Productivity", description: "Workflow automation" },
  { id: "education", icon: GraduationCap, title: "Education & Learning", description: "LMS & e-learning" },
  { id: "other", icon: Plus, title: "Other", description: "Something else" },
];

const industries = [
  { id: "healthcare", icon: Heart, title: "Healthcare", description: "Medical & health services" },
  { id: "education", icon: GraduationCap, title: "Education", description: "Schools & universities" },
  { id: "finance", icon: DollarSign, title: "Finance", description: "Banking & fintech" },
  { id: "real-estate", icon: Building, title: "Real Estate", description: "Property & construction" },
  { id: "retail", icon: Store, title: "Retail", description: "Stores & commerce" },
  { id: "technology", icon: Cpu, title: "Technology", description: "Software & IT" },
  { id: "marketing", icon: BarChart3, title: "Marketing", description: "Advertising & PR" },
  { id: "other", icon: Plus, title: "Other", description: "Different industry" },
];

const Step2ProductDefinition = ({ data, updateData, onNext, onPrev }: Step2Props) => {
  const [saasCategory, setSaasCategory] = useState(data.saasCategory);
  const [industry, setIndustry] = useState(data.industry);
  const [saasIdea, setSaasIdea] = useState(data.saasIdea);
  const [isImproving, setIsImproving] = useState(false);
  const charLimit = 1000;

  useEffect(() => {
    setSaasCategory(data.saasCategory);
    setIndustry(data.industry);
    setSaasIdea(data.saasIdea);
  }, [data.saasCategory, data.industry, data.saasIdea]);

  const handleImproveWithAI = async () => {
    if (saasIdea.length < 20) {
      toast.error("Please write at least 20 characters before improving");
      return;
    }

    setIsImproving(true);
    try {
      const { data: result, error } = await supabase.functions.invoke('improve-description', {
        body: { description: saasIdea }
      });

      if (error) {
        console.error("Error improving description:", error);
        toast.error("Failed to improve description. Please try again.");
        return;
      }

      if (result?.improvedDescription) {
        setSaasIdea(result.improvedDescription);
        toast.success("Description improved!");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  const handleNext = () => {
    const stepData = { saasCategory, saasIdea, industry };
    updateData(stepData);
    onNext(stepData);
  };

  const isValid = saasCategory && industry && saasIdea.length >= 20;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Define Your <span className="text-accent">SaaS Product</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Help us understand your product vision. Select the category, industry, and describe your idea.
        </p>
      </div>

      {/* SaaS Category Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">What type of SaaS are you building? *</h3>
          <p className="text-sm text-muted-foreground">Select the category that best describes your product</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {saasCategories.map((category) => {
            const Icon = category.icon;
            const isSelected = saasCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => setSaasCategory(category.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                    : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${
                  isSelected ? "text-accent scale-110" : "text-muted-foreground group-hover:text-accent group-hover:scale-110"
                }`} />
                <h4 className="font-medium text-sm text-foreground">{category.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{category.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Industry Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Which industry are you targeting? *</h3>
          <p className="text-sm text-muted-foreground">Select the primary industry for your product</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {industries.map((ind) => {
            const Icon = ind.icon;
            const isSelected = industry === ind.id;
            return (
              <button
                key={ind.id}
                onClick={() => setIndustry(ind.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                    : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${
                  isSelected ? "text-accent scale-110" : "text-muted-foreground group-hover:text-accent group-hover:scale-110"
                }`} />
                <h4 className="font-medium text-sm text-foreground">{ind.title}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{ind.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Description Textarea */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Describe your SaaS idea *</h3>
          <p className="text-sm text-muted-foreground">
            The more detail you provide, the better our analysis will be (minimum 20 characters)
          </p>
        </div>
        <div className="max-w-2xl mx-auto space-y-3">
          <Textarea
            value={saasIdea}
            onChange={(e) => setSaasIdea(e.target.value.slice(0, charLimit))}
            placeholder="Example: A project management tool for remote teams that integrates with Slack and automates reporting. It helps teams track progress, manage tasks, and collaborate effectively across different time zones..."
            className="min-h-[150px] resize-none"
          />
          <div className="flex justify-between items-center">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleImproveWithAI}
              disabled={isImproving || saasIdea.length < 20}
              className="gap-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent"
            >
              {isImproving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Improving...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Improve with AI
                </>
              )}
            </Button>
            <span className={`text-xs ${saasIdea.length >= charLimit ? "text-destructive" : "text-muted-foreground"}`}>
              {saasIdea.length}/{charLimit}
            </span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto pt-4">
        <Button variant="outline" onClick={() => onPrev({ saasCategory, saasIdea, industry })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button 
          onClick={handleNext} 
          disabled={!isValid}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default Step2ProductDefinition;
