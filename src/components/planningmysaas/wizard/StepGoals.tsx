import { 
  RefreshCw, 
  DollarSign, 
  Users, 
  Zap, 
  Lightbulb, 
  HelpCircle,
  Target,
  Search,
  Rocket,
  TrendingUp,
  PiggyBank,
} from "lucide-react";
import SelectableCard from "./SelectableCard";
import { Input } from "@/components/ui/input";

const goals = [
  { 
    id: "replace-manual", 
    title: "Replace manual processes", 
    description: "Automate existing business workflows", 
    icon: RefreshCw 
  },
  { 
    id: "new-revenue", 
    title: "Create a new revenue stream", 
    description: "Build a new product to sell", 
    icon: DollarSign 
  },
  { 
    id: "serve-customers", 
    title: "Serve customers in a new way", 
    description: "Improve customer experience", 
    icon: Users 
  },
  { 
    id: "disrupt-market", 
    title: "Disrupt an existing market", 
    description: "Challenge established players", 
    icon: Zap 
  },
  { 
    id: "solve-problem", 
    title: "Solve a problem I personally face", 
    description: "Scratch your own itch", 
    icon: Lightbulb 
  },
  { 
    id: "other", 
    title: "Other", 
    description: "Something different", 
    icon: HelpCircle 
  },
];

const budgets = [
  { id: "10k-25k", title: "$10K - $25K", description: "Starter MVP" },
  { id: "25k-60k", title: "$25K - $60K", description: "Growth MVP" },
  { id: "60k-160k", title: "$60K - $160K", description: "Enterprise MVP" },
  { id: "160k+", title: "$160K+", description: "Custom Solution" },
  { id: "guidance", title: "I need guidance", description: "Help me decide" },
];

const timelines = [
  { id: "asap", label: "ASAP (within 3 months)" },
  { id: "this-year", label: "This year (3-6 months)" },
  { id: "next-year", label: "Next year (6-12 months)" },
  { id: "flexible", label: "I'm flexible on timing" },
];

const challenges = [
  { id: "validating", title: "Validating the idea", description: "Need market proof", icon: Search },
  { id: "building-mvp", title: "Building the MVP fast", description: "Speed to market", icon: Rocket },
  { id: "scaling", title: "Scaling without breaking", description: "Technical growth", icon: TrendingUp },
  { id: "reducing-costs", title: "Reducing dev costs", description: "Budget optimization", icon: PiggyBank },
  { id: "finding-team", title: "Finding the right team", description: "Talent acquisition", icon: Users },
  { id: "figuring-out", title: "Still figuring it out", description: "Exploring options", icon: HelpCircle },
];

interface StepGoalsProps {
  data: {
    goal: string;
    goalOther: string;
    challenge: string;
    budget: string;
    timeline: string;
  };
  onChange: (field: string, value: string | string[]) => void;
}

const StepGoals = ({ data, onChange }: StepGoalsProps) => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Set Your <span className="text-gradient-gold">Goals</span>
        </h2>
        <p className="text-muted-foreground">
          Final step! Tell us about your objectives and timeline so we can provide accurate recommendations.
        </p>
      </div>

      {/* Main Goal Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            What's your primary goal? <span className="text-accent">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">Select the main objective for your SaaS</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {goals.map((goal) => (
            <SelectableCard
              key={goal.id}
              icon={goal.icon}
              title={goal.title}
              description={goal.description}
              selected={data.goal === goal.id}
              onClick={() => onChange("goal", goal.id)}
              className="p-4"
            />
          ))}
        </div>

        {data.goal === "other" && (
          <div className="mt-3 animate-fade-in">
            <Input
              placeholder="Please describe your primary goal..."
              value={data.goalOther}
              onChange={(e) => onChange("goalOther", e.target.value)}
              className="bg-muted/30 border-border/50 focus:border-accent"
              maxLength={200}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Minimum 2 characters required
            </p>
          </div>
        )}
      </div>

      {/* Biggest Challenge Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            What's your biggest challenge right now? <span className="text-accent">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">Select the main obstacle you're facing</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {challenges.map((challenge) => (
            <SelectableCard
              key={challenge.id}
              icon={challenge.icon}
              title={challenge.title}
              description={challenge.description}
              selected={data.challenge === challenge.id}
              onClick={() => onChange("challenge", challenge.id)}
              className="p-4"
            />
          ))}
        </div>
      </div>

      {/* Budget Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            What's your estimated development budget? <span className="text-accent">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">Select your estimated investment range</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {budgets.map((budget) => (
            <button
              key={budget.id}
              type="button"
              onClick={() => onChange("budget", budget.id)}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                data.budget === budget.id
                  ? "border-accent bg-accent/10 shadow-md"
                  : "border-border/50 hover:border-accent/50 hover:bg-muted/50"
              }`}
            >
              <p className={`font-semibold ${
                data.budget === budget.id ? "text-accent" : "text-foreground"
              }`}>
                {budget.title}
              </p>
              <p className="text-sm text-muted-foreground">{budget.description}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Timeline Section */}
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            When do you plan to launch? <span className="text-accent">*</span>
          </h3>
          <p className="text-sm text-muted-foreground">When do you want to go live?</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {timelines.map((timeline) => (
            <button
              key={timeline.id}
              type="button"
              onClick={() => onChange("timeline", timeline.id)}
              className={`px-4 py-2.5 rounded-full border-2 transition-all duration-200 text-sm font-medium ${
                data.timeline === timeline.id
                  ? "border-accent bg-accent text-background shadow-md"
                  : "border-border/50 text-muted-foreground hover:border-accent/50 hover:text-foreground"
              }`}
            >
              {timeline.label}
            </button>
          ))}
        </div>
      </div>

      {/* CTA Container */}
      <div className="rounded-2xl p-8 border border-accent/30 text-center bg-gradient-to-br from-accent/15 to-accent/5">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
          <Target className="w-8 h-8 text-accent" />
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold text-foreground mb-3">
          Don't risk launching without a solid plan
        </h3>
        
        <p className="text-muted-foreground max-w-xl mx-auto mb-4">
          <strong className="text-foreground">9 out of 10 startups fail</strong> due to lack of market validation 
          and poor planning. Get your personalized feasibility study with market analysis, 
          competitive insights, and financial projections — everything you need to 
          <strong className="text-foreground"> launch with confidence</strong>.
        </p>
        
        <p className="text-sm text-accent font-medium">
          ✓ Reduce risk before investing your time and money
        </p>
      </div>
    </div>
  );
};

export default StepGoals;
