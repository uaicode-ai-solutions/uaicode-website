import { Button } from "@/components/ui/button";
import { sampleQuestions, type DemoScenario } from "@/lib/demoConfig";

interface SampleQuestionsProps {
  scenario: DemoScenario;
  onSelect: (question: string) => void;
}

const SampleQuestions = ({ scenario, onSelect }: SampleQuestionsProps) => {
  const questions = sampleQuestions[scenario];
  return (
    <div className="border-t border-border bg-muted/30 p-3">
      <p className="text-xs text-muted-foreground mb-2 font-medium">Try these sample questions:</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((question, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(question)}
            className="text-xs h-8 bg-background hover:bg-accent hover:text-accent-foreground"
          >
            {question}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SampleQuestions;
