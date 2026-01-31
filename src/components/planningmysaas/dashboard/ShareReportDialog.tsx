import { useState } from "react";
import { Mail, Link, Copy, Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/contexts/AuthContext";

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
  const { pmsUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(reportUrl);
      setFeedback({ type: "success", message: "Link copied to clipboard!" });
      setTimeout(() => setFeedback(null), 3000);
    } catch (error) {
      console.error("Failed to copy link:", error);
      setFeedback({ type: "error", message: "Failed to copy link" });
      setTimeout(() => setFeedback(null), 3000);
    }
  };

  const handleSendEmail = async () => {
    if (!email.trim()) {
      setFeedback({ type: "error", message: "Email is required" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setFeedback({ type: "error", message: "Please enter a valid email address" });
      setTimeout(() => setFeedback(null), 3000);
      return;
    }

    setIsSending(true);
    setFeedback(null);

    try {
      const { error } = await supabase.functions.invoke('pms-send-share-report', {
        body: {
          recipientEmail: email,
          senderName: pmsUser?.full_name || 'Someone',
          projectName,
          reportUrl,
          personalMessage: message || undefined
        }
      });

      if (error) throw error;

      setFeedback({ type: "success", message: "Email sent successfully!" });
      
      // Reset form and close dialog after a brief delay
      setTimeout(() => {
        setEmail("");
        setMessage("");
        setFeedback(null);
        onOpenChange(false);
      }, 1500);
    } catch (err: any) {
      console.error("Failed to send email:", err);
      setFeedback({ type: "error", message: err.message || "Failed to send email. Please try again." });
      setTimeout(() => setFeedback(null), 5000);
    } finally {
      setIsSending(false);
    }
  };

  const handleClose = () => {
    setEmail("");
    setMessage("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="glass-premium border-accent/20 max-w-[calc(100vw-2rem)] sm:max-w-md overflow-hidden p-4 sm:p-6">
        <DialogHeader className="min-w-0">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Mail className="h-5 w-5 text-accent shrink-0" />
            Share Report
          </DialogTitle>
          <DialogDescription className="text-muted-foreground break-words">
            Share "<span className="text-foreground font-medium break-all">{projectName}</span>" viability report
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-2 min-w-0">
          {/* Feedback Message */}
          {feedback && (
            <div className={`flex items-center gap-2 p-3 rounded-lg text-sm ${
              feedback.type === "success" 
                ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                : "bg-red-500/10 border border-red-500/20 text-red-400"
            }`}>
              {feedback.type === "success" ? (
                <CheckCircle className="h-4 w-4 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 shrink-0" />
              )}
              {feedback.message}
            </div>
          )}

          {/* Recipient Email */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Recipient Email <span className="text-destructive">*</span>
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
          <div className="space-y-2 min-w-0">
            <Label className="text-sm font-medium text-muted-foreground">
              Link to be shared
            </Label>
            <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 p-3 rounded-lg bg-background/30 border border-border/30 overflow-hidden">
              <Link className="h-4 w-4 text-accent shrink-0" />
              <span className="text-sm text-muted-foreground truncate min-w-0 block">
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
