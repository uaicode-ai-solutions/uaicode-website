import { useState } from "react";
import { Mail, Link, Copy, Send, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

interface ShareReportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reportUrl: string;
  projectName: string;
}

const ShareReportDialog = ({
  open,
  onOpenChange,
  reportUrl,
  projectName,
}: ShareReportDialogProps) => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      toast({
        title: "Link copied!",
        description: "Report link copied to clipboard.",
      });
    } catch (error) {
      toast({
        title: "Failed to copy",
        description: "Please copy the link manually.",
        variant: "destructive",
      });
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a recipient email address.",
        variant: "destructive",
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);

    // Simulate sending email (replace with actual API call)
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSending(false);
    toast({
      title: "Email sent!",
      description: `Report shared with ${email}`,
    });

    // Reset form and close dialog
    setEmail("");
    setMessage("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-premium border-accent/20 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-accent" />
            Share Report
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Share "<span className="text-foreground font-medium">{projectName}</span>" viability report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2">
          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Recipient Email <span className="text-red-400">*</span>
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-background/50 border-border/50 focus:border-accent/50 transition-colors"
            />
          </div>

          {/* Personal Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Personal Message <span className="text-muted-foreground">(optional)</span>
            </Label>
            <Textarea
              id="message"
              placeholder="Check out this SaaS validation report I created using PlanningMySaaS!"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={3}
              className="bg-background/50 border-border/50 focus:border-accent/50 transition-colors resize-none"
            />
          </div>

          {/* Link Preview */}
          <div className="space-y-2">
            <Label className="text-sm font-medium text-muted-foreground">
              Link to be shared
            </Label>
            <div className="flex items-center gap-2 p-3 rounded-lg bg-background/30 border border-border/30">
              <Link className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm text-muted-foreground truncate flex-1">
                {reportUrl}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 hover:bg-accent/10"
                onClick={handleCopyLink}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-border/50 hover:bg-background/50"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSendEmail}
              disabled={isSending}
              className="gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              {isSending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Send Email
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareReportDialog;
