import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Sparkles } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { useEffect } from "react";

interface NewsletterSuccessDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NewsletterSuccessDialog = ({ open, onOpenChange }: NewsletterSuccessDialogProps) => {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (open) {
      fireConfetti();
    }
  }, [open, fireConfetti]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-accent/20 bg-gradient-to-b from-card to-background">
        <DialogHeader className="space-y-6 pt-4">
          {/* Animated Success Icon */}
          <div className="mx-auto relative">
            {/* Outer glow ring */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/60 p-[2px] animate-pulse">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <Check className="w-10 h-10 text-accent" strokeWidth={3} />
              </div>
            </div>
            {/* Decorative sparkles */}
            <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            <Sparkles className="w-4 h-4 text-accent/70 absolute -bottom-1 -left-2 animate-pulse" style={{ animationDelay: '150ms' }} />
          </div>
          
          <div className="space-y-3 text-center">
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              <span className="text-gradient-gold">Successfully</span> subscribed!
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
              You will receive our insights by email with each new release.
            </DialogDescription>
          </div>
        </DialogHeader>
        
        {/* Decorative divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>
        
        <Button 
          onClick={() => onOpenChange(false)} 
          className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-lg shadow-[0_0_20px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] transition-all duration-300"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default NewsletterSuccessDialog;
