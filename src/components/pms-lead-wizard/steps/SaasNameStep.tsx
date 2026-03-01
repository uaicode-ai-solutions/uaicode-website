import { useState } from "react";
import LeadWizardStep from "../LeadWizardStep";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Props {
  value: string;
  onChange: (v: string) => void;
  description: string;
  saasType: string;
  industry: string;
}

const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

const SaasNameStep = ({ value, onChange, description, saasType, industry }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [suggestedName, setSuggestedName] = useState("");
  const [rationale, setRationale] = useState("");

  const handleSuggest = async () => {
    if (description.trim().length < 20) {
      toast.error("Please fill in the description first");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/pms-suggest-name`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY },
        body: JSON.stringify({ description, saasType, industry }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.suggestedName) {
        setSuggestedName(data.suggestedName);
        setRationale(data.rationale || "");
        setShowDialog(true);
      }
    } catch {
      toast.error("Failed to suggest name. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <LeadWizardStep title="Name your SaaS" subtitle="Choose a name for your product (min 3 characters)">
        <Input
          autoFocus
          placeholder="e.g., TaskFlow, DataPulse..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base h-12"
        />
        <div className="flex justify-end mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSuggest}
            disabled={isGenerating || description.trim().length < 20}
            className="border-accent/30 text-accent hover:bg-accent/10"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Suggest with AI
          </Button>
        </div>
      </LeadWizardStep>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>Suggested Name: {suggestedName}</AlertDialogTitle>
            {rationale && (
              <AlertDialogDescription className="text-foreground/80">
                {rationale}
              </AlertDialogDescription>
            )}
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Current</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onChange(suggestedName); toast.success("Name applied!"); }}
              className="bg-accent text-accent-foreground"
            >
              Apply
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default SaasNameStep;
