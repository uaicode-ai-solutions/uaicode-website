import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ArrowRight, Zap, TrendingUp, Building2, Info } from "lucide-react";
import { WizardData } from "@/pages/Planning";

interface Step4Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  onNext: (stepData?: Partial<WizardData>) => void;
  onPrev: (stepData?: Partial<WizardData>) => void;
}

interface FeatureInfo {
  name: string;
  description: string;
}

const starterFeatures: FeatureInfo[] = [
  {
    name: "User Registration & Authentication",
    description: "Allows your users to create accounts and log in securely using email and password."
  },
  {
    name: "Basic User Profiles",
    description: "A profile page where users can view and edit their personal information."
  },
  {
    name: "Simple Database CRUD Operations",
    description: "Ability to create, view, update, and delete data in your system."
  },
  {
    name: "Basic Reporting & Analytics",
    description: "Simple reports about system usage and performance."
  },
  {
    name: "Email Notifications",
    description: "Automatic emails to notify users about updates and important events."
  },
  {
    name: "Basic Admin Panel",
    description: "A dashboard for you to manage users and system settings."
  },
  {
    name: "Mobile Responsive Design",
    description: "Your system works well on phones, tablets, and computers."
  },
  {
    name: "Basic Security Measures",
    description: "Basic protection against hacking and data leaks."
  },
];

const growthFeatures: FeatureInfo[] = [
  {
    name: "Advanced Analytics Dashboard",
    description: "Detailed charts and metrics about your business in real-time."
  },
  {
    name: "Third-party API Integrations",
    description: "Connect with other services like Google, Facebook, WhatsApp, etc."
  },
  {
    name: "Payment Processing & Billing",
    description: "Accept credit card and digital payments, generate invoices automatically."
  },
  {
    name: "Multi-user Roles & Permissions",
    description: "Different access levels like admin, editor, and viewer."
  },
  {
    name: "Advanced Search & Filtering",
    description: "Powerful search with filters to find data quickly."
  },
  {
    name: "File Upload & Management",
    description: "Upload and organize files like photos, PDFs, and documents."
  },
  {
    name: "Real-time Updates",
    description: "Instant updates without needing to refresh the page."
  },
  {
    name: "Custom Workflows",
    description: "Automate custom sequences of actions in your process."
  },
  {
    name: "Advanced Reporting Tools",
    description: "Create custom reports and export data in various formats."
  },
  {
    name: "Email Marketing Integration",
    description: "Connect with email marketing tools like Mailchimp or HubSpot."
  },
];

const enterpriseFeatures: FeatureInfo[] = [
  {
    name: "AI/Machine Learning Capabilities",
    description: "Artificial intelligence for predictions, recommendations, and smart automations."
  },
  {
    name: "Advanced Data Analytics",
    description: "Deep analysis of large data volumes with advanced insights."
  },
  {
    name: "Multi-tenant Architecture",
    description: "A single system that serves multiple companies separately and securely."
  },
  {
    name: "SSO & Enterprise Security",
    description: "Single sign-on integrated with corporate systems and advanced security."
  },
  {
    name: "Custom Integrations",
    description: "Custom connections with your company's specific systems."
  },
  {
    name: "Advanced API Management",
    description: "Create APIs so other systems can connect to your product."
  },
  {
    name: "Real-time Collaboration Tools",
    description: "Multiple users working together at the same time."
  },
  {
    name: "Advanced Automation",
    description: "Complex automations based on specific rules and conditions."
  },
  {
    name: "Custom Reporting Engine",
    description: "Fully customizable reporting engine for your needs."
  },
  {
    name: "Enterprise-grade Support",
    description: "Priority support with guaranteed response time (SLA)."
  },
];

const Step4Features = ({ data, updateData, onNext, onPrev }: Step4Props) => {
  const [starter, setStarter] = useState<string[]>(data.starterFeatures);
  const [growth, setGrowth] = useState<string[]>(data.growthFeatures);
  const [enterprise, setEnterprise] = useState<string[]>(data.enterpriseFeatures);

  // Sync local state with parent when data prop changes (e.g., after HMR or navigation)
  useEffect(() => {
    setStarter(data.starterFeatures);
    setGrowth(data.growthFeatures);
    setEnterprise(data.enterpriseFeatures);
  }, [data.starterFeatures, data.growthFeatures, data.enterpriseFeatures]);

  const toggleFeature = (
    featureName: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: 'starterFeatures' | 'growthFeatures' | 'enterpriseFeatures'
  ) => {
    const newList = list.includes(featureName) 
      ? list.filter((f) => f !== featureName) 
      : [...list, featureName];
    setList(newList);
    updateData({ [fieldName]: newList });
  };

  const complexityScore = useMemo(() => {
    const starterScore = starter.length * 3;
    const growthScore = growth.length * 7;
    const enterpriseScore = enterprise.length * 15;
    return Math.min(100, starterScore + growthScore + enterpriseScore);
  }, [starter, growth, enterprise]);

  const recommendedPlan = useMemo(() => {
    // Prioritize by feature type, not just score
    if (enterprise.length >= 1) return "Enterprise";
    if (growth.length >= 1) return "Growth";
    return "Starter";
  }, [enterprise.length, growth.length]);

  const complexityLevel = useMemo(() => {
    if (complexityScore >= 70) return { label: "High", color: "text-red-500" };
    if (complexityScore >= 40) return { label: "Medium", color: "text-yellow-500" };
    return { label: "Low", color: "text-green-500" };
  }, [complexityScore]);

  const handleNext = () => {
    const stepData = {
      starterFeatures: starter,
      growthFeatures: growth,
      enterpriseFeatures: enterprise,
    };
    updateData(stepData);
    onNext(stepData);
  };

  const isValid = starter.length > 0 || growth.length > 0 || enterprise.length > 0;

  const renderFeatureItem = (
    feature: FeatureInfo,
    selectedList: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>,
    fieldName: 'starterFeatures' | 'growthFeatures' | 'enterpriseFeatures'
  ) => {
    const isSelected = selectedList.includes(feature.name);
    
    return (
      <label
        key={feature.name}
        className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
          isSelected 
            ? "border-accent bg-accent/10 ring-1 ring-accent/30" 
            : "border-border hover:border-accent/50"
        }`}
      >
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => toggleFeature(feature.name, selectedList, setList, fieldName)}
        />
        <span className="text-sm text-foreground flex-1">{feature.name}</span>
        <Tooltip>
          <TooltipTrigger asChild>
            <Info className="w-4 h-4 text-muted-foreground hover:text-accent cursor-help flex-shrink-0" />
          </TooltipTrigger>
          <TooltipContent side="top" className="max-w-xs">
            <p className="text-sm">{feature.description}</p>
          </TooltipContent>
        </Tooltip>
      </label>
    );
  };

  return (
    <TooltipProvider delayDuration={200}>
      <div className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">
            Select Your <span className="text-accent">Features</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Choose the features you need for your SaaS. This helps us estimate complexity and recommend the right plan.
          </p>
        </div>

        {/* Complexity Calculator */}
        <div className="bg-card border border-border rounded-2xl p-6 max-w-2xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-medium text-foreground">Complexity Score</h4>
              <p className="text-sm text-muted-foreground">Based on selected features</p>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <span className="text-3xl font-bold text-accent">{complexityScore}</span>
                <span className="text-muted-foreground">/100</span>
              </div>
              <div className="text-center">
                <span className={`text-lg font-medium ${complexityLevel.color}`}>
                  {complexityLevel.label}
                </span>
                <p className="text-xs text-muted-foreground">Complexity</p>
              </div>
            </div>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all duration-500"
              style={{ width: `${complexityScore}%` }}
            />
          </div>
          
          {/* Recommended Plan */}
          <div className="mt-4 pt-4 border-t border-border flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Recommended Plan:</span>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {recommendedPlan}
            </span>
          </div>
        </div>

        {/* Feature Accordions */}
        <Accordion type="multiple" defaultValue={["starter"]} className="max-w-2xl mx-auto">
          <AccordionItem value="starter" className="border border-border rounded-xl mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-green-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Essential Features</h4>
                  <p className="text-xs text-muted-foreground">Starter Plan</p>
                </div>
                <span className="ml-auto mr-4 text-sm text-muted-foreground">
                  {starter.length} selected
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {starterFeatures.map((feature) => renderFeatureItem(feature, starter, setStarter, 'starterFeatures'))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="growth" className="border border-border rounded-xl mb-3 overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-yellow-500/20 flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-yellow-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Advanced Features</h4>
                  <p className="text-xs text-muted-foreground">Growth Plan</p>
                </div>
                <span className="ml-auto mr-4 text-sm text-muted-foreground">
                  {growth.length} selected
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {growthFeatures.map((feature) => renderFeatureItem(feature, growth, setGrowth, 'growthFeatures'))}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="enterprise" className="border border-border rounded-xl overflow-hidden">
            <AccordionTrigger className="px-4 py-3 hover:no-underline">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Building2 className="w-4 h-4 text-purple-500" />
                </div>
                <div className="text-left">
                  <h4 className="font-medium text-foreground">Enterprise Features</h4>
                  <p className="text-xs text-muted-foreground">Enterprise Plan</p>
                </div>
                <span className="ml-auto mr-4 text-sm text-muted-foreground">
                  {enterprise.length} selected
                </span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {enterpriseFeatures.map((feature) => renderFeatureItem(feature, enterprise, setEnterprise, 'enterpriseFeatures'))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Navigation */}
        <div className="flex justify-between max-w-2xl mx-auto pt-4">
          <Button variant="outline" onClick={() => onPrev({ 
            starterFeatures: starter, 
            growthFeatures: growth, 
            enterpriseFeatures: enterprise 
          })}>
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
    </TooltipProvider>
  );
};

export default Step4Features;
