import { useState } from "react";
import { Monitor, Loader2, Sparkles, ImageIcon, ZoomIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface JourneyStep {
  step: number;
  title: string;
  description: string;
  revenuePoint: boolean;
}

interface MockupData {
  step: number;
  title: string;
  description: string;
  imageUrl: string;
}

interface ScreenMockupsSectionProps {
  submissionId: string;
  saasIdea: string;
  companyName: string;
  steps: JourneyStep[];
  existingMockups: MockupData[] | null;
  onMockupsGenerated: (mockups: MockupData[]) => void;
}

export function ScreenMockupsSection({
  submissionId,
  saasIdea,
  companyName,
  steps,
  existingMockups,
  onMockupsGenerated
}: ScreenMockupsSectionProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [mockups, setMockups] = useState<MockupData[]>(existingMockups || []);
  const [selectedMockup, setSelectedMockup] = useState<MockupData | null>(null);

  const generateMockups = async () => {
    setIsGenerating(true);
    setCurrentStep(1);

    try {
      toast.info("Starting mockup generation...", {
        description: "This may take a few minutes."
      });

      const response = await supabase.functions.invoke('generate-screen-mockups', {
        body: {
          submissionId,
          saasIdea,
          companyName,
          steps: steps.slice(0, 5)
        }
      });

      if (response.error) {
        throw new Error(response.error.message);
      }

      if (response.data?.error) {
        if (response.data.error.includes('Rate limit')) {
          toast.error("Rate limit reached", {
            description: "Please try again in a few minutes."
          });
        } else if (response.data.error.includes('credits')) {
          toast.error("AI credits exhausted", {
            description: "Please contact support."
          });
        } else {
          throw new Error(response.data.error);
        }
        return;
      }

      const generatedMockups = response.data?.mockups || [];
      setMockups(generatedMockups);
      onMockupsGenerated(generatedMockups);

      toast.success(`${generatedMockups.length} mockups generated!`, {
        description: "View the suggested screens for your SaaS."
      });

    } catch (error) {
      console.error('Error generating mockups:', error);
      toast.error("Error generating mockups", {
        description: error instanceof Error ? error.message : "Please try again."
      });
    } finally {
      setIsGenerating(false);
      setCurrentStep(0);
    }
  };

  const hasMockups = mockups && mockups.length > 0;

  return (
    <section className="space-y-4">
      <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
        <Monitor className="w-5 h-5 text-accent" />
        Screen Mockups
      </h2>

      <div className="bg-card border border-border rounded-xl p-6">
        {!hasMockups && !isGenerating && (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Sparkles className="w-8 h-8 text-accent" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Visualize Your SaaS
              </h3>
              <p className="text-sm text-muted-foreground max-w-md mx-auto">
                Use AI to generate screen mockups for your SaaS based on user journey steps. 
                See a preview of what your product could look like.
              </p>
            </div>
            <Button 
              onClick={generateMockups}
              className="bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Generate Screen Mockups
            </Button>
          </div>
        )}

        {isGenerating && (
          <div className="text-center py-12 space-y-4">
            <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">
                Generating mockups...
              </h3>
              <p className="text-sm text-muted-foreground">
                {currentStep > 0 
                  ? `Creating screen ${currentStep} of ${Math.min(steps.length, 5)}...`
                  : "Preparing generation..."
                }
              </p>
              <p className="text-xs text-muted-foreground">
                This process may take 1 to 3 minutes.
              </p>
            </div>
          </div>
        )}

        {hasMockups && !isGenerating && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                {mockups.length} screens generated based on user journey
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={generateMockups}
              >
                <Sparkles className="w-3 h-3 mr-1" />
                Regenerate
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockups.map((mockup, index) => (
                <div
                  key={index}
                  className="group relative bg-muted/30 rounded-lg overflow-hidden border border-border hover:border-accent/50 transition-all cursor-pointer"
                  onClick={() => setSelectedMockup(mockup)}
                >
                  <div className="aspect-video relative bg-muted">
                    {mockup.imageUrl ? (
                      <img
                        src={mockup.imageUrl}
                        alt={`Mockup: ${mockup.title}`}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-8 h-8 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 left-2">
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                        {mockup.step}
                      </span>
                    </div>
                    {/* Hover overlay with zoom icon */}
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="bg-accent text-accent-foreground rounded-full p-2">
                        <ZoomIn className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                  <div className="p-3 space-y-1">
                    <h4 className="text-sm font-medium text-foreground line-clamp-1">
                      {mockup.title}
                    </h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {mockup.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Modal for enlarged mockup view */}
      <Dialog open={!!selectedMockup} onOpenChange={(open) => !open && setSelectedMockup(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-accent text-accent-foreground text-xs font-semibold">
                {selectedMockup?.step}
              </span>
              {selectedMockup?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedMockup?.description}
            </DialogDescription>
          </DialogHeader>
          <div className="relative mt-4">
            {selectedMockup?.imageUrl && (
              <img
                src={selectedMockup.imageUrl}
                alt={`Mockup: ${selectedMockup.title}`}
                className="w-full h-auto rounded-lg border border-border"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
