import { cn } from "@/lib/utils";

interface LeadWizardStepProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

const LeadWizardStep = ({ title, subtitle, children, className }: LeadWizardStepProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center w-full max-w-xl mx-auto px-4 animate-step-enter",
        className
      )}
    >
      <h2 className="text-2xl md:text-3xl font-bold text-foreground text-center mb-2">
        {title}
      </h2>
      {subtitle && (
        <p className="text-muted-foreground text-center text-sm md:text-base mb-8 max-w-md">
          {subtitle}
        </p>
      )}
      <div className="w-full">{children}</div>
    </div>
  );
};

export default LeadWizardStep;
