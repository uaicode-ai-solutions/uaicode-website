import { useState } from "react";
import LeadWizardStep from "../LeadWizardStep";
import { Button } from "@/components/ui/button";
import { Sparkles, Loader2, Upload, X } from "lucide-react";
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
  saasName: string;
  saasType: string;
  industry: string;
}

const SUPABASE_URL = "https://ccjnxselfgdoeyyuziwt.supabase.co";
const ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNjam54c2VsZmdkb2V5eXV6aXd0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU5ODAxNjksImV4cCI6MjA4MTU1NjE2OX0.L66tFhCjl6Tyr9v4qBdm-fmfr1_2rcFLLcJdJWbgYJg";

const LogoStep = ({ value, onChange, description, saasName, saasType, industry }: Props) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [generatedLogo, setGeneratedLogo] = useState("");

  const handleGenerate = async () => {
    if (description.trim().length < 20) {
      toast.error("Please fill in the description first");
      return;
    }
    setIsGenerating(true);
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/pms-generate-logo`, {
        method: "POST",
        headers: { "Content-Type": "application/json", apikey: ANON_KEY },
        body: JSON.stringify({
          description, name: saasName, saasType, industry,
          existingLogo: value || undefined,
          mode: value ? "improve" : "create",
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data?.logoUrl) {
        setGeneratedLogo(data.logoUrl);
        setShowDialog(true);
      }
    } catch {
      toast.error("Failed to generate logo. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      <LeadWizardStep title="Upload your logo" subtitle="Optional — or let AI create one for you">
        {value ? (
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img src={value} alt="Logo" className="w-24 h-24 rounded-xl object-contain bg-muted/30 border border-border/30 p-2" />
              <button
                onClick={() => onChange("")}
                className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-4 py-8 border-2 border-dashed border-border/40 rounded-xl">
            <Upload className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No logo yet</p>
          </div>
        )}
        <div className="flex justify-center mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleGenerate}
            disabled={isGenerating || description.trim().length < 20}
            className="border-accent/30 text-accent hover:bg-accent/10"
          >
            {isGenerating ? <Loader2 className="w-4 h-4 mr-1 animate-spin" /> : <Sparkles className="w-4 h-4 mr-1" />}
            {value ? "Regenerate with AI" : "Create with AI"}
          </Button>
        </div>
      </LeadWizardStep>

      <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
        <AlertDialogContent className="bg-card border-border">
          <AlertDialogHeader>
            <AlertDialogTitle>AI-Generated Logo</AlertDialogTitle>
            <AlertDialogDescription className="flex justify-center py-4">
              <img src={generatedLogo} alt="Generated logo" className="w-32 h-32 rounded-xl object-contain bg-muted/30 p-2" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Discard</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => { onChange(generatedLogo); toast.success("Logo applied!"); }}
              className="bg-accent text-accent-foreground"
            >
              Use This Logo
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default LogoStep;
