import { useState } from "react";
import LeadWizardStep from "../LeadWizardStep";
import { Textarea } from "@/components/ui/textarea";
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
  saasType: string;
  industry: string;
}

const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

const DescriptionStep = ({ value, onChange, saasType, industry }: Props) => {
  const [isImproving, setIsImproving] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [suggested, setSuggested] = useState("");

  const handleImprove = async () => {
    if (value.trim().length < 10) {
      toast.error("Please write at least 10 characters before improving");
      return;
    }
    setIsImproving(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/pms-improve-description`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY },
        body: JSON.stringify({ description: value, saasType, industry }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.improvedDescription) {
        setSuggested(data.improvedDescription);
        setShowDialog(true);
      }
    } catch {
      toast.error("Failed to improve description. Please try again.");
    } finally {
      setIsImproving(false);
    }
  };

  return (
    <>
      <LeadWizardStep title="Describe your SaaS idea" subtitle="Tell us what your product does (min 20 characters)">
        <Textarea
          autoFocus
          placeholder="Describe your SaaS idea in a few sentences..."
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="bg-muted/30 border-border/50 focus:border-accent text-base min-h-[120px]"
        />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{value.trim().length}/20 min characters</span>
          <Button
            variant="outline"
            size="sm"
            onClick={handleImprove}
            disabled={isImproving || value.trim().length < 10}
            className="border-accent/30 text-accent hover:bg-accent/10"
          >
            {isImproving ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            Improve with AI
          </Button>
        </div>
      </LeadWizardStep>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>AI-Improved Description</AlertDialogTitle>
            <AlertDialogDescription className="whitespace-pre-wrap text-foreground/80">
              {suggested}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Original</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onChange(suggested); toast.success("Description updated!"); }}
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

export default DescriptionStep;
