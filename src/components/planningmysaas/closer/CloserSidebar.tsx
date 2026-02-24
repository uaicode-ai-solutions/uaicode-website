import { useState } from "react";
import { ChevronRight, ChevronLeft, MessageSquare, Lightbulb, Ear } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CloserSidebarProps {
  currentStep: number;
}

const STEP_SCRIPTS: Record<number, {
  title: string;
  askQuestions: string[];
  listenFor: string[];
  tip: string;
}> = {
  1: {
    title: "Your Info",
    askQuestions: [
      "Confirm the client's contact details.",
      "What's your role in the company?",
      "Any previous experience building SaaS products?",
    ],
    listenFor: [
      "Technical vs non-technical founder",
      "Solo founder or team",
      "Level of urgency",
    ],
    tip: "If the data was pre-filled via URL, just confirm it verbally and move on quickly.",
  },
  2: {
    title: "Your Idea",
    askQuestions: [
      "What problem does your product solve?",
      "Who are you solving this for?",
      "How do people solve this today without your tool?",
    ],
    listenFor: [
      "Clarity of the problem statement",
      "Names of competitors mentioned",
      "Emotional intensity about the problem",
    ],
    tip: "Use the 'Improve with AI' button together to refine the description live on the call.",
  },
  3: {
    title: "Market",
    askQuestions: [
      "Who would be your first 10 paying customers?",
      "What region are you targeting first?",
      "Is this a B2B or B2C play?",
    ],
    listenFor: [
      "Specific customer names or types",
      "Market size awareness",
      "International ambitions",
    ],
    tip: "If they say 'everyone', push back: 'Who feels the pain the most?'",
  },
  4: {
    title: "Features",
    askQuestions: [
      "Which features are essential for your first version?",
      "What can wait for v2?",
      "Are there any integrations you need?",
    ],
    listenFor: [
      "Feature creep tendencies",
      "Understanding of MVP concept",
      "Third-party dependencies",
    ],
    tip: "More features = higher tier. Guide them to start lean: 'Let's build what gets you paying customers first.'",
  },
  5: {
    title: "Goals",
    askQuestions: [
      "What's your budget range for this project?",
      "When do you need this launched?",
      "What does success look like in 6 months?",
    ],
    listenFor: [
      "Budget constraints or flexibility",
      "Timeline urgency",
      "Revenue expectations",
    ],
    tip: "Match their budget answer with the tier that will appear in the report. Set expectations now.",
  },
};

const CloserSidebar = ({ currentStep }: CloserSidebarProps) => {
  const [isOpen, setIsOpen] = useState(true);
  const script = STEP_SCRIPTS[currentStep] || STEP_SCRIPTS[1];

  if (!isOpen) {
    return (
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(true)}
        className="fixed right-4 top-1/2 -translate-y-1/2 z-50 h-10 w-10 rounded-full bg-accent/10 border border-accent/30 hover:bg-accent/20 shadow-lg"
      >
        <ChevronLeft className="h-5 w-5 text-accent" />
      </Button>
    );
  }

  return (
    <div className="w-72 lg:w-80 flex-shrink-0 border-l border-border/30 bg-card/30 backdrop-blur-sm overflow-y-auto">
      <div className="p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-accent" />
            <h3 className="text-sm font-bold text-foreground">Closer Guide</h3>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-7 w-7 rounded-full hover:bg-accent/10"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Step title */}
        <div className="text-xs text-accent font-semibold uppercase tracking-wider">
          Step {currentStep}: {script.title}
        </div>

        {/* Ask Questions */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <MessageSquare className="h-3.5 w-3.5 text-blue-400" />
            Ask the Client
          </div>
          <div className="space-y-1.5">
            {script.askQuestions.map((q, i) => (
              <p key={i} className="text-xs text-foreground/80 pl-5 leading-relaxed">
                "{q}"
              </p>
            ))}
          </div>
        </div>

        {/* Listen For */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Ear className="h-3.5 w-3.5 text-emerald-400" />
            Listen For
          </div>
          <ul className="space-y-1">
            {script.listenFor.map((item, i) => (
              <li key={i} className="text-xs text-muted-foreground pl-5 flex items-start gap-1.5">
                <span className="text-emerald-400 mt-0.5">•</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Tip */}
        <div className="p-3 rounded-lg bg-accent/5 border border-accent/10">
          <div className="flex items-start gap-2">
            <Lightbulb className="h-3.5 w-3.5 text-accent mt-0.5 flex-shrink-0" />
            <p className="text-xs text-foreground/80 leading-relaxed">
              {script.tip}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CloserSidebar;
