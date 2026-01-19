import { useEffect } from "react";
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
  Lock,
  Info,
  ArrowLeft,
  Calendar,
  CalendarDays,
  Clock,
  type LucideIcon,
} from "lucide-react";
import SelectableCard from "./SelectableCard";
import { Input } from "@/components/ui/input";
import { determineMvpTier } from "@/types/report";

// Tier to budget/timeline availability mapping
const TIER_BUDGET_MAP: Record<string, string[]> = {
  starter: ['10k-25k', 'guidance'],
  growth: ['25k-60k', '60k-160k', '160k+', 'guidance'],
  enterprise: ['60k-160k', '160k+', 'guidance'],
};

const TIER_TIMELINE_MAP: Record<string, string[]> = {
  starter: ['asap', 'this-year', 'next-year', 'flexible'],
  growth: ['this-year', 'next-year', 'flexible'],
  enterprise: ['next-year', 'flexible'],
};

const TIER_LABELS: Record<string, { name: string; budget: string; timeline: string }> = {
  starter: { 
    name: 'Starter MVP', 
    budget: '$10K - $25K',
    timeline: '45-60 days'
  },
  growth: { 
    name: 'Growth MVP', 
    budget: '$25K - $60K',
    timeline: '60-90 days'
  },
  enterprise: { 
    name: 'Enterprise MVP', 
    budget: '$60K - $160K+',
    timeline: '90-120 days'
  },
};

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

const budgets: { id: string; title: string; description: string; icon: LucideIcon }[] = [
  { id: "10k-25k", title: "$10K - $25K", description: "Starter MVP", icon: Rocket },
  { id: "25k-60k", title: "$25K - $60K", description: "Growth MVP", icon: TrendingUp },
  { id: "60k-160k", title: "$60K - $160K", description: "Enterprise MVP", icon: Target },
  { id: "160k+", title: "$160K+", description: "Custom Solution", icon: Zap },
  { id: "guidance", title: "I need guidance", description: "Help me decide", icon: HelpCircle },
];

const timelines: { id: string; title: string; description: string; icon: LucideIcon }[] = [
  { id: "asap", title: "ASAP", description: "Within 3 months", icon: Zap },
  { id: "this-year", title: "This year", description: "3-6 months", icon: Calendar },
  { id: "next-year", title: "Next year", description: "6-12 months", icon: CalendarDays },
  { id: "flexible", title: "I'm flexible", description: "Open to suggestions", icon: Clock },
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
  selectedFeatures: string[];
}

const StepGoals = ({ data, onChange, selectedFeatures }: StepGoalsProps) => {
  // Determine tier based on selected features
  const currentTier = determineMvpTier(selectedFeatures);
  const availableBudgets = TIER_BUDGET_MAP[currentTier];
  const availableTimelines = TIER_TIMELINE_MAP[currentTier];
  const tierInfo = TIER_LABELS[currentTier];

  // Clear selections if they're no longer valid for the current tier
  useEffect(() => {
    if (data.budget && !availableBudgets.includes(data.budget)) {
      onChange("budget", "");
    }
    if (data.timeline && !availableTimelines.includes(data.timeline)) {
      onChange("timeline", "");
    }
  }, [currentTier, data.budget, data.timeline, availableBudgets, availableTimelines, onChange]);

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

      {/* Tier Info Card */}
      <div className="p-4 rounded-xl bg-accent/10 border border-accent/30">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-foreground">
              Based on your features, you're building a <span className="text-accent font-semibold">{tierInfo.name}</span>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Estimated: {tierInfo.budget} • {tierInfo.timeline} delivery
            </p>
            <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" />
              Go back to Step 4 to adjust features if you need different options
            </p>
          </div>
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
          {budgets.map((budget) => {
            const isAvailable = availableBudgets.includes(budget.id);

            return (
              <SelectableCard
                key={budget.id}
                icon={budget.icon}
                title={budget.title}
                description={budget.description}
                selected={data.budget === budget.id}
                onClick={() => onChange("budget", budget.id)}
                disabled={!isAvailable}
                disabledMessage="Not compatible with your features"
                className="p-4"
              />
            );
          })}
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

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {timelines.map((timeline) => {
            const isAvailable = availableTimelines.includes(timeline.id);

            return (
              <SelectableCard
                key={timeline.id}
                icon={timeline.icon}
                title={timeline.title}
                description={timeline.description}
                selected={data.timeline === timeline.id}
                onClick={() => onChange("timeline", timeline.id)}
                disabled={!isAvailable}
                disabledMessage="Requires more dev time"
                className="p-4"
              />
            );
          })}
        </div>
        
        {/* Timeline unavailable hint */}
        {availableTimelines.length < timelines.length && (
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <Lock className="w-3 h-3" />
            Some timelines are locked because your feature scope requires more development time
          </p>
        )}
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