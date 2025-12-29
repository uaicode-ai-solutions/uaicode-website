import { useEffect, useState } from 'react';
import { Sparkles, TrendingUp, Code, DollarSign, Brain } from 'lucide-react';

const loadingSteps = [
  { text: 'Analyzing your market opportunity...', icon: TrendingUp, color: 'from-amber-400 to-yellow-500' },
  { text: 'Evaluating technical complexity...', icon: Code, color: 'from-yellow-500 to-amber-400' },
  { text: 'Calculating financial projections...', icon: DollarSign, color: 'from-amber-500 to-yellow-400' },
  { text: 'AI is crafting your report...', icon: Brain, color: 'from-yellow-400 to-amber-500' },
  { text: 'Finalizing recommendations...', icon: Sparkles, color: 'from-amber-400 to-yellow-500' },
];

export function LoadingReport() {
  const [stepIndex, setStepIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 0.5, 95));
    }, 150);

    const stepInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setStepIndex(prev => (prev + 1) % loadingSteps.length);
        setIsTransitioning(false);
      }, 300);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
    };
  }, []);

  const currentStep = loadingSteps[stepIndex];
  const Icon = currentStep.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden">
      {/* Solid opaque background to completely hide underlying content */}
      <div className="absolute inset-0 bg-background" />
      
      {/* Animated gradient background (decorative layer) */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10" />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 bg-accent/40 rounded-full animate-float"
            style={{
              left: `${10 + Math.random() * 80}%`,
              top: `${10 + Math.random() * 80}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative flex flex-col items-center gap-8 p-8 text-center max-w-lg">
        
        {/* Animated rings */}
        <div className="relative">
          {/* Outer pulsing rings */}
          <div className="absolute inset-0 -m-12 animate-ping-slow rounded-full bg-accent/10" />
          <div className="absolute inset-0 -m-8 animate-pulse rounded-full bg-accent/20" />
          <div className="absolute inset-0 -m-4 animate-ping-slow rounded-full bg-accent/15" style={{ animationDelay: '0.5s' }} />
          
          {/* Rotating gradient ring */}
          <div className={`absolute inset-0 -m-3 rounded-full bg-gradient-to-r ${currentStep.color} animate-spin-slow opacity-60 blur-md`} />
          
          {/* Main icon container */}
          <div className={`relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br ${currentStep.color} shadow-2xl`}>
            <div className="absolute inset-1.5 rounded-full bg-background/95" />
            <Icon 
              className={`relative h-12 w-12 transition-all duration-500 ${isTransitioning ? 'scale-0 opacity-0 rotate-180' : 'scale-100 opacity-100 rotate-0'}`}
              style={{ color: `var(--tw-gradient-from)` }}
            />
          </div>
        </div>

        {/* Text with transition */}
        <div className="space-y-3 min-h-[80px]">
          <div className={`flex items-center justify-center gap-3 text-xl font-semibold transition-all duration-500 ${isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <span className={`bg-gradient-to-r ${currentStep.color} bg-clip-text text-transparent`}>
              {currentStep.text}
            </span>
          </div>
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            <Sparkles className="h-4 w-4 animate-pulse text-accent" />
            <span>AI is working its magic...</span>
            <Sparkles className="h-4 w-4 animate-pulse text-accent" />
          </p>
        </div>

        {/* Progress bar */}
        <div className="w-full max-w-xs space-y-3">
          <div className="h-3 w-full rounded-full bg-muted/30 overflow-hidden backdrop-blur-sm border border-border/50">
            <div 
              className={`h-full rounded-full bg-gradient-to-r ${currentStep.color} transition-all duration-300 ease-out relative overflow-hidden`}
              style={{ width: `${progress}%` }}
            >
              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
            </div>
          </div>
          <div className="flex justify-between text-xs text-muted-foreground font-medium">
            <span>Step {stepIndex + 1} of {loadingSteps.length}</span>
            <span className={`bg-gradient-to-r ${currentStep.color} bg-clip-text text-transparent font-bold`}>
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Step indicators */}
        <div className="flex gap-2">
          {loadingSteps.map((step, index) => (
            <div
              key={index}
              className={`rounded-full transition-all duration-500 ${
                index === stepIndex 
                  ? `w-10 h-3 bg-gradient-to-r ${step.color}` 
                  : index < stepIndex 
                    ? 'w-3 h-3 bg-accent/70' 
                    : 'w-3 h-3 bg-muted/50'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
