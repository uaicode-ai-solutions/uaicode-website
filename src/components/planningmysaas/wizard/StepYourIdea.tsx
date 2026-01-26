import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SelectableCard from "./SelectableCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [showSuggestionDialog, setShowSuggestionDialog] = useState(false);
  const [suggestedDescription, setSuggestedDescription] = useState("");
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [suggestedNameRationale, setSuggestedNameRationale] = useState("");
  
  // Logo generation states
  const [showLogoDialog, setShowLogoDialog] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState("");
  const [logoDescription, setLogoDescription] = useState("");
  const [logoMarketJustification, setLogoMarketJustification] = useState("");

  const isDescriptionValid = data.description.trim().length >= 20;

  const handleAILogo = async (retryCount = 0) => {
    if (!isDescriptionValid) {
      toast.error("Please fill in the description first (min 20 characters)");
      return;
    }
    
    setIsGeneratingLogo(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s for image generation
    
    try {
      const response = await fetch(
        'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-generate-logo',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
          },
          body: JSON.stringify({
            description: data.description,
            saasType: data.saasType,
            industry: data.industry,
            existingLogo: data.saasLogo || undefined,
            mode: data.saasLogo ? "improve" : "create"
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result?.logoUrl) {
        setGeneratedLogo(result.logoUrl);
        setLogoDescription(result.logoDescription || "");
        setLogoMarketJustification(result.marketJustification || "");
        setShowLogoDialog(true);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error generating logo:", error);
      
      // Retry up to 2 times for transient failures
      if (retryCount < 2 && (
        error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.name === 'AbortError'
      )) {
        console.log(`Retrying... attempt ${retryCount + 2}`);
        await new Promise(resolve => setTimeout(resolve, 2000));
        return handleAILogo(retryCount + 1);
      }
      
      if (error?.message?.includes('429')) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error?.message?.includes('402')) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error("Failed to generate logo. Please try again.");
      }
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const handleApplyLogo = () => {
    onChange("saasLogo", generatedLogo);
    setShowLogoDialog(false);
    setGeneratedLogo("");
    setLogoDescription("");
    setLogoMarketJustification("");
    toast.success("Logo applied!");
  };

  const handleApplySuggestion = () => {
    onChange("description", suggestedDescription);
    setShowSuggestionDialog(false);
    setSuggestedDescription("");
    toast.success("Description updated!");
  };

  const handleImproveDescription = async (retryCount = 0) => {
    if (data.description.length < 10) {
      toast.error("Please write at least 10 characters before improving");
      return;
    }
    
    setIsImprovingDescription(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for cold starts
    
    try {
      const response = await fetch(
        'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-improve-description',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
          },
          body: JSON.stringify({
            description: data.description,
            saasType: data.saasType,
            industry: data.industry
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result?.improvedDescription) {
        setSuggestedDescription(result.improvedDescription);
        setShowSuggestionDialog(true);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error improving description:", error);
      
      // Retry up to 2 times for transient failures (network/deployment/abort issues)
      if (retryCount < 2 && (
        error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.name === 'AbortError'
      )) {
        console.log(`Retrying... attempt ${retryCount + 2}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return handleImproveDescription(retryCount + 1);
      }
      
      if (error?.message?.includes('429')) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error?.message?.includes('402')) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error("Failed to improve description. Please try again.");
      }
    } finally {
      setIsImprovingDescription(false);
    }
  };

  const handleApplyName = () => {
    onChange("saasName", suggestedName);
    setShowNameDialog(false);
    setSuggestedName("");
    setSuggestedNameRationale("");
    toast.success("Name applied!");
  };

  const handleSuggestName = async (retryCount = 0) => {
    if (!isDescriptionValid) {
      toast.error("Please fill in the description first (min 20 characters)");
      return;
    }
    
    setIsGeneratingName(true);
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);
    
    try {
      const response = await fetch(
        'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-suggest-name',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg'
          },
          body: JSON.stringify({
            description: data.description,
            saasType: data.saasType,
            industry: data.industry
          }),
          signal: controller.signal
        }
      );
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result?.suggestedName) {
        setSuggestedName(result.suggestedName);
        setSuggestedNameRationale(result.rationale || "");
        setShowNameDialog(true);
      }
    } catch (error: any) {
      clearTimeout(timeoutId);
      console.error("Error suggesting name:", error);
      
      // Retry up to 2 times for transient failures
      if (retryCount < 2 && (
        error?.message?.includes('Failed to fetch') || 
        error?.message?.includes('NetworkError') ||
        error?.name === 'AbortError'
      )) {
        console.log(`Retrying... attempt ${retryCount + 2}`);
        await new Promise(resolve => setTimeout(resolve, 1500));
        return handleSuggestName(retryCount + 1);
      }
      
      if (error?.message?.includes('429')) {
        toast.error("Rate limit exceeded. Please try again later.");
      } else if (error?.message?.includes('402')) {
        toast.error("Payment required. Please add credits to continue.");
      } else {
        toast.error("Failed to suggest name. Please try again.");
      }
    } finally {
      setIsGeneratingName(false);
    }
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
            onClick={() => handleSuggestName()}
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
            <div className="flex gap-2 flex-wrap">
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('logo-upload')?.click()}
                className="border-border/50 hover:border-accent hover:bg-accent/10"
              >
                <Upload className="w-4 h-4 mr-2" />
                {data.saasLogo ? "Change Logo" : "Upload Logo"}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                disabled={!isDescriptionValid || isGeneratingLogo}
                onClick={() => handleAILogo()}
                className="border-accent text-accent hover:bg-accent/10 hover:text-accent
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGeneratingLogo ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {data.saasLogo ? "Improve with AI" : "Create with AI"}
                  </>
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              PNG, JPG or SVG. Max 2MB. Recommended: 512×512px
            </p>
          </div>
        </div>
      </div>

      {/* AI Suggestion Dialog for Description */}
      <AlertDialog open={showSuggestionDialog} onOpenChange={setShowSuggestionDialog}>
        <AlertDialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Suggestion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Compare your original text with the AI-improved version
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="grid md:grid-cols-2 gap-4 my-4">
            {/* Original */}
            <div className="p-4 bg-muted/50 rounded-lg border border-border/50">
              <Label className="text-sm text-muted-foreground font-medium">Your Original</Label>
              <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{data.description}</p>
            </div>
            
            {/* Suggestion */}
            <div className="p-4 bg-accent/10 border border-accent/30 rounded-lg">
              <Label className="text-sm text-accent font-medium">AI Suggestion</Label>
              <p className="mt-2 text-sm text-foreground whitespace-pre-wrap">{suggestedDescription}</p>
            </div>
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Original</AlertDialogCancel>
            <AlertDialogAction onClick={handleApplySuggestion} className="bg-accent hover:bg-accent/90">
              Apply Suggestion
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Suggestion Dialog for Name */}
      <AlertDialog open={showNameDialog} onOpenChange={setShowNameDialog}>
        <AlertDialogContent className="max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              AI Name Suggestion
            </AlertDialogTitle>
            <AlertDialogDescription>
              Based on your description, here's a suggested name for your SaaS
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-6 text-center">
            <div className="inline-block px-6 py-4 bg-accent/10 border border-accent/30 rounded-xl">
              <span className="text-2xl font-bold text-foreground">{suggestedName}</span>
            </div>
            
            {/* Branding rationale */}
            {suggestedNameRationale && (
              <p className="mt-4 text-sm text-muted-foreground italic max-w-sm mx-auto">
                "{suggestedNameRationale}"
              </p>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Try Another</AlertDialogCancel>
            <AlertDialogAction onClick={handleApplyName} className="bg-accent hover:bg-accent/90">
              Use This Name
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* AI Logo Dialog */}
      <AlertDialog open={showLogoDialog} onOpenChange={setShowLogoDialog}>
        <AlertDialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent" />
              {data.saasLogo ? "AI Logo Improvement" : "AI Generated Logo"}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {data.saasLogo 
                ? "Here's an improved version of your logo based on market analysis"
                : "Here's a logo created based on your SaaS description and market trends"}
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="my-6 space-y-4">
            {/* Preview do Logo Gerado */}
            <div className="flex justify-center">
              <div className="w-32 h-32 rounded-xl border-2 border-accent/50 
                              overflow-hidden bg-white flex items-center justify-center p-4">
                {generatedLogo && (
                  <img 
                    src={generatedLogo} 
                    alt="Generated logo" 
                    className="max-w-full max-h-full object-contain"
                  />
                )}
              </div>
            </div>
            
            {/* Descrição do Logo */}
            {logoDescription && (
              <div className="bg-muted/30 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-accent" />
                  About this design
                </h4>
                <p className="text-sm text-muted-foreground">
                  {logoDescription}
                </p>
              </div>
            )}
            
            {/* Justificativa de Mercado */}
            {logoMarketJustification && (
              <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-2">
                <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <BarChart className="w-4 h-4 text-accent" />
                  Market alignment
                </h4>
                <p className="text-sm text-muted-foreground">
                  {logoMarketJustification}
                </p>
              </div>
            )}
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleAILogo()}>
              Try Another
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleApplyLogo} className="bg-accent hover:bg-accent/90">
              Use This Logo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default StepYourIdea;
