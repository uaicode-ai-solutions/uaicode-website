import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Sparkles, Calendar, X } from "lucide-react";
import { demoScenarios, type DemoScenario } from "@/lib/demoConfig";

interface DemoCTAModalProps {
  open: boolean;
  onClose: () => void;
  onSchedule: () => void;
  onContinue: () => void;
  scenario: DemoScenario;
}

const DemoCTAModal = ({ open, onClose, onSchedule, onContinue, scenario }: DemoCTAModalProps) => {
  const scenarioName = demoScenarios[scenario].name;
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
            <Sparkles className="h-6 w-6 text-accent" />
          </div>
          <DialogTitle className="text-center text-2xl">Impressed with what you saw? 🎉</DialogTitle>
          <DialogDescription className="text-center pt-2">
            You've just experienced how our AI can transform customer engagement for businesses like <span className="font-semibold text-foreground">{scenarioName}</span>. Imagine this level of personalization for YOUR products!
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-3 pt-4">
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <p className="text-sm font-medium">What you just experienced:</p>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>✓ Smart product recommendations</li>
              <li>✓ Natural conversation flow</li>
              <li>✓ Real-time inventory awareness</li>
              <li>✓ Objection handling</li>
            </ul>
          </div>

          <Button 
            onClick={onSchedule}
            className="w-full bg-accent hover:bg-accent/90 text-black font-semibold h-12"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Your Free Diagnostic
          </Button>
          
          <Button 
            onClick={onContinue}
            variant="outline"
            className="w-full"
          >
            Continue Exploring Demo
          </Button>

          <button
            onClick={onClose}
            className="w-full text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1"
          >
            <X className="h-3 w-3" />
            Exit Demo Mode
          </button>
        </div>

        <p className="text-xs text-center text-muted-foreground pt-2">
          Join 200+ businesses already using AI to grow sales by 300%+
        </p>
      </DialogContent>
    </Dialog>
  );
};

export default DemoCTAModal;
