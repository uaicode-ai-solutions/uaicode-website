import { MessageSquare, Calendar, DollarSign, Clock, Sparkles } from "lucide-react";

interface QuickRepliesProps {
  onSelect: (message: string) => void;
  isVisible: boolean;
}

const quickReplies = [
  {
    icon: MessageSquare,
    label: "How it works",
    message: "How does the development process work with UaiCode?",
  },
  {
    icon: DollarSign,
    label: "Investment",
    message: "What investment is needed to start a project?",
  },
  {
    icon: Calendar,
    label: "Schedule meeting",
    message: "I would like to schedule a meeting to discuss my project.",
  },
  {
    icon: Clock,
    label: "Timelines",
    message: "What is the average delivery time for an MVP?",
  },
];

const QuickReplies = ({ onSelect, isVisible }: QuickRepliesProps) => {
  if (!isVisible) return null;

  return (
    <div className="flex flex-wrap gap-2 justify-center px-4 animate-fade-in-up">
      {quickReplies.map((reply, index) => {
        const Icon = reply.icon;
        return (
          <button
            key={index}
            onClick={() => onSelect(reply.message)}
            className="group flex items-center gap-2 px-4 py-2 rounded-full border border-accent/30 bg-accent/5 hover:bg-accent/15 hover:border-accent/60 transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(250,204,21,0.15)]"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Icon className="w-4 h-4 text-accent group-hover:scale-110 transition-transform duration-300" />
            <span className="text-sm text-foreground/90 group-hover:text-foreground transition-colors">
              {reply.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export default QuickReplies;
