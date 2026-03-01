import LeadWizardStep from "../LeadWizardStep";
import SelectableCard from "@/components/planningmysaas/wizard/SelectableCard";
import { Input } from "@/components/ui/input";
import {
  Users, Building, ShoppingCart, UserPlus, DollarSign, Mail,
  BarChart3, MessageSquare, Headphones, Zap, BookOpen, Brain,
  Shield, Code, Layers, Plus,
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
  { id: "ai", title: "AI & Automation", description: "AI-powered solutions", icon: Brain },
  { id: "security", title: "Cybersecurity", description: "Security & compliance", icon: Shield },
  { id: "devtools", title: "Developer Tools", description: "APIs, SDKs & platforms", icon: Code },
  { id: "platform", title: "Platform", description: "Multi-sided marketplace", icon: Layers },
  { id: "other", title: "Other", description: "Something else", icon: Plus },
];

interface Props {
  value: string;
  otherValue: string;
  onChange: (v: string) => void;
  onOtherChange: (v: string) => void;
}

const SaasTypeStep = ({ value, otherValue, onChange, onOtherChange }: Props) => (
  <LeadWizardStep title="What type of SaaS are you building?" subtitle="Select the category that best describes your product">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {saasTypes.map((t) => (
        <SelectableCard
          key={t.id}
          icon={t.icon}
          title={t.title}
          description={t.description}
          selected={value === t.id}
          onClick={() => onChange(t.id)}
        />
      ))}
    </div>
    {value === "other" && (
      <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
        <Input
          autoFocus
          placeholder="Please specify your SaaS type..."
          value={otherValue}
          onChange={(e) => onOtherChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
      </div>
    )}
  </LeadWizardStep>
);

export default SaasTypeStep;
