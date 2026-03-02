import { useEffect } from "react";
import { CheckCircle, Mail, Clock } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";

const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

interface ThankYouStepProps {
  wizardId?: string | null;
}

const ThankYouStep = ({ wizardId }: ThankYouStepProps) => {
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    fireConfetti();
  }, []);

  // Fire-and-forget: trigger orchestrator after mount
  useEffect(() => {
    if (!wizardId) return;
    fetch(`${SUPABASE_URL}/functions/v1/pms-orchestrate-lp-report`, {
      method: "POST",
      headers: { "Content-Type": "application/json", apikey: ANON_KEY },
      body: JSON.stringify({ wizard_id: wizardId }),
    }).catch(() => {}); // fire-and-forget
  }, [wizardId]);

  return (
  <div className="flex flex-col items-center justify-center text-center px-4 animate-step-enter max-w-lg mx-auto">
    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-6">
      <CheckCircle className="w-8 h-8 text-accent" />
    </div>

    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
      Thank You!
    </h1>

    <p className="text-muted-foreground text-base md:text-lg mb-8 max-w-md">
      We're generating your personalized SaaS validation report powered by AI.
    </p>

    <div className="flex flex-col gap-4 w-full max-w-sm">
      <div className="flex items-center gap-3 bg-muted/30 border border-border/30 rounded-xl p-4">
        <Mail className="w-5 h-5 text-accent shrink-0" />
        <span className="text-sm text-foreground/80">Your report will be sent to your email</span>
      </div>
      <div className="flex items-center gap-3 bg-muted/30 border border-border/30 rounded-xl p-4">
        <Clock className="w-5 h-5 text-accent shrink-0" />
        <span className="text-sm text-foreground/80">Expected delivery: ~10 minutes</span>
      </div>
    </div>
  </div>
  );
};

export default ThankYouStep;
