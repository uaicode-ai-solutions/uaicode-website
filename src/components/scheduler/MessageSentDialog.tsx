import { useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Mail, Sparkles } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";

interface MessageSentDialogProps {
  open: boolean;
  onClose: () => void;
  email?: string;
}

const MessageSentDialog = ({ open, onClose, email }: MessageSentDialogProps) => {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (open) {
      fireConfetti();
    }
  }, [open, fireConfetti]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible border-accent/20 bg-card">
        <DialogHeader className="text-center pb-2">
          {/* Icon with glow effect */}
          <div className="mx-auto mb-4 relative">
            <div className="absolute inset-0 bg-accent/20 blur-xl rounded-full" />
            <div className="relative w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center border border-accent/30">
              <Mail className="w-8 h-8 text-accent" />
            </div>
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
            <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-accent/70 animate-pulse" />
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            <span className="text-gradient-gold">Message</span> Sent!
          </DialogTitle>
          
          <DialogDescription className="text-center text-muted-foreground pt-2">
            Our team will get back to you within 24 hours.
          </DialogDescription>
        </DialogHeader>

        {/* Email confirmation */}
        {email && (
          <div className="mt-4 p-4 rounded-lg bg-accent/5 border border-accent/10">
            <div className="flex items-center gap-3">
              <Mail className="w-5 h-5 text-accent flex-shrink-0" />
              <div className="text-sm">
                <p className="text-muted-foreground">A confirmation was sent to</p>
                <p className="font-medium text-foreground">{email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Close button */}
        <div className="mt-6">
          <Button
            onClick={onClose}
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          >
            Got it!
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MessageSentDialog;
