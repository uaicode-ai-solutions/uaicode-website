import { Building2 } from "lucide-react";

const companies = [
  "TechCorp",
  "StartupX",
  "InnovateLab",
  "DigitalFlow",
  "CloudBase",
  "DataSync",
  "AppForge",
  "ScaleUp",
];

const PmsTrustedBy = () => {
  return (
    <section className="py-12 px-4 relative overflow-hidden border-y border-border/30">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />
      
      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <p className="text-center text-sm text-muted-foreground mb-8 uppercase tracking-wider">
          Trusted by founders from
        </p>
        
        {/* Marquee Container */}
        <div className="relative overflow-hidden">
          {/* Fade Edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
          
          {/* Scrolling Content */}
          <div className="flex animate-marquee">
            {[...companies, ...companies].map((company, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-8 py-3 mx-4 rounded-xl bg-muted/30 border border-border/50 flex-shrink-0"
              >
                <Building2 className="w-5 h-5 text-accent" />
                <span className="text-foreground font-medium whitespace-nowrap">{company}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsTrustedBy;
