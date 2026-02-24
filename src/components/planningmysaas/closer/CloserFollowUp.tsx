import { useState } from "react";
import { PartyPopper, Send, ArrowLeft, Check, Calendar, Gift } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useReport } from "@/hooks/useReport";
import { useReportData } from "@/hooks/useReportData";
import { useConfetti } from "@/hooks/useConfetti";
import { ClientInfo } from "@/pages/PmsCloserFlow";
import uaicodeLogo from "@/assets/uaicode-logo.png";

interface CloserFollowUpProps {
  wizardId: string;
  clientInfo: ClientInfo;
  onBack: () => void;
}

const CloserFollowUp = ({ wizardId, clientInfo, onBack }: CloserFollowUpProps) => {
  const [outcome, setOutcome] = useState<"closed" | "followup" | null>(null);
  const [personalMessage, setPersonalMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [sent, setSent] = useState(false);
  const { fireConfetti } = useConfetti();

  const { data: wizardData } = useReport(wizardId);
  const { data: reportData } = useReportData(wizardId);
  const projectName = wizardData?.saas_name || "Your SaaS";
  const shareUrl = (reportData as any)?.share_url;

  const handleClosed = () => {
    setOutcome("closed");
    fireConfetti();
  };

  const handleSendFollowUp = async () => {
    if (!clientInfo.email || isSending) return;
    setIsSending(true);

    try {
      await supabase.functions.invoke("pms-send-share-report", {
        body: {
          to_email: clientInfo.email,
          to_name: clientInfo.name,
          from_name: "UaiCode Team",
          project_name: projectName,
          report_url: shareUrl || `${window.location.origin}/planningmysaas/shared/${wizardId}`,
          personal_message: personalMessage || undefined,
        },
      });
      setSent(true);
    } catch (err) {
      console.error("Failed to send follow-up:", err);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 mesh-gradient opacity-20 pointer-events-none" />

      {/* Header */}
      <header className="sticky top-0 z-50 glass-premium border-b border-accent/10">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src={uaicodeLogo} alt="Uaicode" className="h-9 w-9 rounded-lg" />
              <span className="text-lg font-bold text-foreground">
                Sales <span className="text-accent">Closer</span> Tool
              </span>
            </div>
            <Badge variant="outline" className="border-accent/30 text-accent text-xs">
              Closing
            </Badge>
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-2xl px-4 py-12 relative z-10">
        {/* No outcome selected yet */}
        {!outcome && (
          <div className="space-y-8 text-center">
            <h1 className="text-3xl font-bold text-foreground">
              How Did the Call Go?
            </h1>
            <p className="text-muted-foreground">
              Call with <span className="text-accent font-semibold">{clientInfo.name || "the client"}</span> about <span className="text-accent font-semibold">{projectName}</span>
            </p>

            <div className="grid sm:grid-cols-2 gap-4 pt-4">
              <Card
                className="glass-card border-emerald-500/30 hover:border-emerald-500/50 cursor-pointer transition-all hover:-translate-y-1"
                onClick={handleClosed}
              >
                <CardContent className="p-8 text-center space-y-3">
                  <PartyPopper className="h-12 w-12 text-emerald-400 mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">Client Closed!</h3>
                  <p className="text-sm text-muted-foreground">They're ready to sign</p>
                </CardContent>
              </Card>

              <Card
                className="glass-card border-accent/30 hover:border-accent/50 cursor-pointer transition-all hover:-translate-y-1"
                onClick={() => setOutcome("followup")}
              >
                <CardContent className="p-8 text-center space-y-3">
                  <Send className="h-12 w-12 text-accent mx-auto" />
                  <h3 className="text-xl font-bold text-foreground">Send Follow-Up</h3>
                  <p className="text-sm text-muted-foreground">Email the proposal</p>
                </CardContent>
              </Card>
            </div>

            <Button variant="ghost" onClick={onBack} className="gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Presentation
            </Button>
          </div>
        )}

        {/* Client Closed */}
        {outcome === "closed" && (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center">
              <PartyPopper className="h-12 w-12 text-emerald-400" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">🎉 Deal Closed!</h1>
            <p className="text-muted-foreground">
              Congratulations! <span className="text-accent font-semibold">{clientInfo.name}</span> is on board for <span className="text-accent font-semibold">{projectName}</span>.
            </p>

            <Card className="glass-card border-emerald-500/20">
              <CardContent className="p-6 space-y-3">
                <h3 className="font-semibold text-foreground">Next Actions:</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Send contract for signature
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Schedule onboarding kickoff
                  </div>
                  <div className="flex items-center gap-2 text-sm text-foreground/80">
                    <Check className="h-4 w-4 text-emerald-400" />
                    Share report link with client
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Follow-Up */}
        {outcome === "followup" && !sent && (
          <div className="space-y-6">
            <h1 className="text-2xl font-bold text-foreground text-center">
              Send Proposal to {clientInfo.name || "Client"}
            </h1>

            <Card className="glass-card border-border/30">
              <CardContent className="p-6 space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <div className="flex justify-between">
                    <span>To:</span>
                    <span className="text-foreground">{clientInfo.email || "—"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Project:</span>
                    <span className="text-foreground">{projectName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Includes:</span>
                    <span className="text-accent">Report + Offer + Discount</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">
                    Personal Message (optional)
                  </label>
                  <Textarea
                    value={personalMessage}
                    onChange={e => setPersonalMessage(e.target.value)}
                    placeholder="Thanks for the great conversation today..."
                    className="bg-background/50 min-h-[80px]"
                  />
                </div>

                <Button
                  onClick={handleSendFollowUp}
                  disabled={!clientInfo.email || isSending}
                  className="w-full gap-2 bg-accent hover:bg-accent/90 text-background font-semibold"
                >
                  <Send className="h-4 w-4" />
                  {isSending ? "Sending..." : "Send Proposal Email"}
                </Button>
              </CardContent>
            </Card>

            <Button variant="ghost" onClick={() => setOutcome(null)} className="w-full gap-2 text-muted-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>
        )}

        {/* Follow-Up Sent */}
        {outcome === "followup" && sent && (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-24 h-24 bg-accent/10 rounded-full flex items-center justify-center">
              <Send className="h-12 w-12 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Proposal Sent! ✉️</h1>
            <p className="text-muted-foreground">
              Email sent to <span className="text-accent font-semibold">{clientInfo.email}</span> with the full report and offer details.
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 text-accent" />
              <span>Discount valid for 7 days</span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default CloserFollowUp;
