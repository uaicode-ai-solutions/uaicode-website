import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, ArrowRight, Building, Building2, Landmark, User, Rocket, Heart, Plus, X, Search, Loader2, Lightbulb, AlertTriangle, ExternalLink, CheckCircle, XCircle } from "lucide-react";
import { WizardData } from "@/pages/Planning";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Step3Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  onNext: (stepData?: Partial<WizardData>) => void;
  onPrev: (stepData?: Partial<WizardData>) => void;
}

interface CompetitorPricing {
  startingPrice?: number;
  pricingModel?: string;
  targetSegment?: string;
  priceVerified?: boolean;
}

interface CompetitorResult {
  name: string;
  website?: string;
  description?: string;
  urlValid?: boolean;
  verified?: boolean;
  pricing?: CompetitorPricing;
  source?: string;
}

const customerTypes = [
  { id: "small", label: "Small Businesses", description: "1-50 employees", icon: Building },
  { id: "medium", label: "Medium Companies", description: "51-500 employees", icon: Building2 },
  { id: "large", label: "Large Enterprises", description: "500+ employees", icon: Landmark },
  { id: "individual", label: "Individual Professionals", description: "Freelancers & consultants", icon: User },
  { id: "startup", label: "Startups & Entrepreneurs", description: "Early-stage companies", icon: Rocket },
  { id: "nonprofit", label: "Government/Non-profit", description: "Public sector organizations", icon: Heart },
];

const marketSizes = [
  { value: "local", label: "Local/Regional", description: "under $1M" },
  { value: "national", label: "National", description: "$1M - $100M" },
  { value: "global", label: "Global", description: "$100M+" },
  { value: "unsure", label: "I'm not sure yet", description: "" },
];

const Step3TargetAudience = ({ data, updateData, onNext, onPrev }: Step3Props) => {
  const [targetCustomers, setTargetCustomers] = useState<string[]>(data.targetCustomers);
  const [marketSize, setMarketSize] = useState(data.marketSize);
  const [competitors, setCompetitors] = useState<string[]>(data.competitors.length > 0 ? data.competitors : [""]);
  const [isSearching, setIsSearching] = useState(false);
  const [aiResults, setAiResults] = useState<CompetitorResult[]>([]);
  const [citations, setCitations] = useState<string[]>([]);
  const [showWarning, setShowWarning] = useState(false);
  const [hasSearchedWithAI, setHasSearchedWithAI] = useState(data.hasSearchedCompetitors || false);
  const [dataSource, setDataSource] = useState<string | null>(null);

  // Sync local state with parent when data prop changes
  useEffect(() => {
    setTargetCustomers(data.targetCustomers);
    setMarketSize(data.marketSize);
    if (data.competitors.length > 0) {
      setCompetitors(data.competitors);
    }
    setHasSearchedWithAI(data.hasSearchedCompetitors || false);
    // Restore AI results if we have competitorsData
    if (data.competitorsData && data.competitorsData.length > 0) {
      setAiResults(data.competitorsData as CompetitorResult[]);
      setShowWarning(true);
      if (data.competitorsData[0]?.source) {
        setDataSource(data.competitorsData[0].source as string);
      }
    }
  }, [data.targetCustomers, data.marketSize, data.competitors, data.hasSearchedCompetitors, data.competitorsData]);

  const toggleCustomer = (id: string) => {
    const newCustomers = targetCustomers.includes(id) 
      ? targetCustomers.filter((c) => c !== id) 
      : [...targetCustomers, id];
    setTargetCustomers(newCustomers);
    updateData({ targetCustomers: newCustomers });
  };

  const addCompetitor = () => {
    if (competitors.length < 6) {
      const newCompetitors = [...competitors, ""];
      setCompetitors(newCompetitors);
    }
  };

  const removeCompetitor = (index: number) => {
    const newCompetitors = competitors.filter((_, i) => i !== index);
    setCompetitors(newCompetitors);
    updateData({ competitors: newCompetitors.filter((c) => c.trim()) });
  };

  const updateCompetitor = (index: number, value: string) => {
    const updated = [...competitors];
    updated[index] = value;
    setCompetitors(updated);
    updateData({ competitors: updated.filter((c) => c.trim()) });
  };

  const handleSearchCompetitors = async () => {
    // Check if we have enough data to search
    if (!data.saasIdea && !data.saasCategory && !data.industry) {
      toast.error("Please fill in your product details in the previous step first.");
      return;
    }

    setIsSearching(true);
    setAiResults([]);
    setCitations([]);
    setShowWarning(false);
    setDataSource(null);

    try {
      const { data: result, error } = await supabase.functions.invoke('search-competitors', {
        body: {
          saasIdea: data.saasIdea,
          saasCategory: data.saasCategory,
          industry: data.industry,
          targetCustomers: targetCustomers,
          marketSize: marketSize
        }
      });

      if (error) {
        throw error;
      }

      if (result.success && result.data?.competitors?.length > 0) {
        const competitorResults = result.data.competitors as CompetitorResult[];
        const source = result.data.source || 'perplexity';
        
        // Add source to each competitor
        const competitorsWithSource = competitorResults.map(c => ({ ...c, source }));
        
        setAiResults(competitorsWithSource);
        setCitations(result.citations || []);
        setShowWarning(true);
        setDataSource(source);
        setHasSearchedWithAI(true);
        
        const competitorNames = competitorsWithSource.map(
          (c) => c.website ? `${c.name} (${c.website})` : c.name
        );
        setCompetitors(competitorNames);
        
        // Save both competitor names and full data with pricing
        updateData({ 
          competitors: competitorNames,
          competitorsData: competitorsWithSource,
          hasSearchedCompetitors: true
        });
        
        const validCount = competitorsWithSource.filter(c => c.urlValid).length;
        const sourceLabel = source === 'lovable-ai' ? '(AI knowledge base)' : '';
        toast.success(`Found ${competitorNames.length} competitor(s)! ${validCount} URL(s) verified. ${sourceLabel}`);
      } else if (result.success && result.data?.competitors?.length === 0) {
        // Even with no competitors, mark as searched
        setHasSearchedWithAI(true);
        setCompetitors([""]);
        updateData({ 
          competitors: [], 
          competitorsData: [],
          hasSearchedCompetitors: true 
        });
        toast.info("No competitors found. You can proceed - the report will note this as a unique market opportunity.");
      } else {
        throw new Error(result.error || 'Failed to search competitors');
      }
    } catch (error) {
      console.error('Error searching competitors:', error);
      toast.error("Failed to search competitors. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleNext = () => {
    const stepData = {
      targetCustomers,
      marketSize,
      competitors: competitors.filter((c) => c.trim()),
      hasSearchedCompetitors: hasSearchedWithAI,
    };
    updateData(stepData);
    onNext(stepData);
  };

  const isValid = targetCustomers.length > 0 && marketSize && hasSearchedWithAI;

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">
          Define Your <span className="text-accent">Target Market</span>
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Help us understand who your ideal customers are and the size of your market opportunity.
        </p>
      </div>

      {/* Target Customer Selection */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Who is your ideal customer? *</h3>
          <p className="text-sm text-muted-foreground">Select all that apply</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {customerTypes.map((type) => {
            const Icon = type.icon;
            const isSelected = targetCustomers.includes(type.id);
            return (
              <button
                key={type.id}
                onClick={() => toggleCustomer(type.id)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left group ${
                  isSelected
                    ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                    : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
                }`}
              >
                <Icon className={`w-6 h-6 mb-2 transition-all duration-300 ${
                  isSelected ? "text-accent scale-110" : "text-muted-foreground group-hover:text-accent group-hover:scale-110"
                }`} />
                <h4 className="font-medium text-sm text-foreground">{type.label}</h4>
                <p className="text-xs text-muted-foreground mt-0.5">{type.description}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Market Size */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">What's your estimated addressable market size? *</h3>
          <p className="text-sm text-muted-foreground">Select the option that best fits your target market</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {marketSizes.map((size) => (
            <button
              key={size.value}
              onClick={() => {
                setMarketSize(size.value);
                updateData({ marketSize: size.value });
              }}
              className={`p-4 rounded-xl border-2 text-center transition-all duration-300 group ${
                marketSize === size.value
                  ? "border-accent bg-accent/10 shadow-[0_0_15px_rgba(250,204,21,0.2)]"
                  : "border-border bg-card hover:border-accent/50 hover:bg-accent/5"
              }`}
            >
              <h4 className="font-medium text-sm text-foreground">{size.label}</h4>
              {size.description && (
                <p className="text-xs text-muted-foreground mt-1">{size.description}</p>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Competitors */}
      <div className="space-y-4">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-foreground mb-1">Competitor Analysis *</h3>
          <p className="text-sm text-muted-foreground">We need competitor pricing data to generate accurate market analysis</p>
        </div>
        
        <div className="max-w-2xl mx-auto space-y-4">
          {/* Required message */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-accent/10 border border-accent/30">
            <Lightbulb className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
            <p className="text-sm text-foreground">
              <span className="font-medium text-accent">Required:</span> Click{" "}
              <span className="font-semibold text-accent">"Search with AI"</span> to find competitors and their pricing. 
              This data is essential for accurate market pricing recommendations in your report.
            </p>
          </div>

          {/* AI Search Button with Status */}
          <div className="space-y-2">
            <Button
              variant="outline"
              onClick={handleSearchCompetitors}
              disabled={isSearching}
              className={`w-full border-2 transition-all duration-300 ${
                hasSearchedWithAI 
                  ? "border-green-500/50 bg-green-500/10 hover:bg-green-500/20" 
                  : "border-accent/50 hover:border-accent hover:bg-accent/10"
              }`}
            >
              {isSearching ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Searching competitors...
                </>
              ) : hasSearchedWithAI ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  Search Complete - Click to Search Again
                </>
              ) : (
                <>
                  <Search className="w-4 h-4 mr-2" />
                  Search with AI
                </>
              )}
            </Button>
            
            {/* Status indicator */}
            {hasSearchedWithAI && (
              <div className="flex items-center justify-center gap-2 text-green-500 text-sm">
                <CheckCircle className="w-4 h-4" />
                <span>
                  Competitor search completed
                  {dataSource === 'lovable-ai' && (
                    <span className="text-amber-500 ml-1">(AI knowledge base)</span>
                  )}
                </span>
              </div>
            )}
          </div>

          {/* AI Results Warning */}
          {showWarning && aiResults.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/10 border border-amber-500/30">
                <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground">
                  {dataSource === 'lovable-ai' 
                    ? "Pricing data generated from AI knowledge base. These are estimates based on industry patterns."
                    : "AI-generated results may contain inaccuracies. Please verify URLs before visiting."
                  }
                </p>
              </div>
              
              {/* Competitor Results with Pricing */}
              <div className="grid gap-2">
                {aiResults.map((result, index) => (
                  <div key={index} className="flex flex-col gap-1 text-xs p-3 rounded-lg bg-muted/50">
                    <div className="flex items-center gap-2">
                      {result.urlValid ? (
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      ) : (
                        <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                      )}
                      <span className="font-medium text-foreground">{result.name}</span>
                      {result.website && (
                        <a 
                          href={result.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline flex items-center gap-1 ml-auto"
                        >
                          <span className="truncate max-w-[150px]">{result.website}</span>
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                      <span className={`text-[10px] px-1.5 py-0.5 rounded ${result.urlValid ? 'bg-green-500/20 text-green-600' : 'bg-destructive/20 text-destructive'}`}>
                        {result.urlValid ? 'Verified' : 'Unverified'}
                      </span>
                    </div>
                    {result.pricing?.startingPrice && (
                      <div className="flex items-center gap-2 ml-6 text-muted-foreground">
                        <span className="font-semibold text-accent">${result.pricing.startingPrice}/mo</span>
                        <span>•</span>
                        <span>{result.pricing.pricingModel || 'unknown model'}</span>
                        {result.pricing.targetSegment && (
                          <>
                            <span>•</span>
                            <span>{result.pricing.targetSegment}</span>
                          </>
                        )}
                        <span className={`text-[10px] px-1.5 py-0.5 rounded ${result.pricing.priceVerified ? 'bg-green-500/20 text-green-600' : 'bg-amber-500/20 text-amber-600'}`}>
                          {result.pricing.priceVerified ? 'Price verified' : 'Estimated'}
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Citations */}
              {citations.length > 0 && (
                <details className="text-xs">
                  <summary className="cursor-pointer text-muted-foreground hover:text-foreground transition-colors">
                    Sources researched ({citations.length})
                  </summary>
                  <ul className="mt-2 space-y-1 pl-4">
                    {citations.slice(0, 5).map((citation, index) => (
                      <li key={index}>
                        <a 
                          href={citation} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-accent hover:underline truncate block max-w-full"
                        >
                          {citation}
                        </a>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </div>
          )}

          {/* Manual competitor inputs (only show after search with no results) */}
          {hasSearchedWithAI && aiResults.length === 0 && (
            <div className="space-y-3 pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground text-center">
                You can also add competitors manually if needed:
              </p>
              {competitors.map((competitor, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={competitor}
                    onChange={(e) => updateCompetitor(index, e.target.value)}
                    placeholder="Enter competitor name or website"
                    className="flex-1"
                  />
                  {competitors.length > 1 && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeCompetitor(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {competitors.length < 6 && (
                <Button variant="outline" onClick={addCompetitor} className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Add another competitor
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between max-w-2xl mx-auto pt-4">
        <Button variant="outline" onClick={() => onPrev({ 
          targetCustomers, 
          marketSize, 
          competitors: competitors.filter((c) => c.trim()),
          hasSearchedCompetitors: hasSearchedWithAI
        })}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isValid}
          className="bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Validation hint */}
      {!hasSearchedWithAI && targetCustomers.length > 0 && marketSize && (
        <p className="text-center text-sm text-amber-500">
          Please click "Search with AI" above to analyze competitors before continuing.
        </p>
      )}
    </div>
  );
};

export default Step3TargetAudience;
