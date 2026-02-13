import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import founderRafaelLuz from "@/assets/founder-rafael-luz.webp";

export const FounderCard = () => {
  return (
    <div className="border border-accent/20 rounded-2xl p-8 md:p-10 bg-card/30 backdrop-blur-sm shadow-lg hover:shadow-accent/20 hover:shadow-2xl transition-all duration-300">
      <h3 className="text-2xl font-bold text-accent mb-8">About the Founder</h3>
      <div className="flex flex-col md:flex-row gap-8 items-start">
        <img 
          src={founderRafaelLuz} 
          alt="Rafael Luz - Founder & CEO"
          loading="lazy"
          className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover border-4 border-accent shadow-2xl"
        />
        <div className="flex-1">
          <h4 className="text-2xl font-bold text-foreground mb-3">Rafael Luz</h4>
          <p className="text-lg text-accent font-bold mb-1">Founder & CEO at Uaicode.ai</p>
          <p className="text-sm text-muted-foreground mb-6">Ex-Microsoft AI Solutions Architect</p>
          <p className="text-muted-foreground leading-relaxed mb-6 text-base">
            Rafael is a former Microsoft AI Solutions Architect who spent years helping enterprise giants design and deploy intelligent systems at scale. Now, through Uaicode.ai, he has democratized that expertise — partnering with startups and businesses of all sizes to accelerate Problem-Market Fit Validation and AI-powered MVP development. His mission: turn bold ideas into validated products in weeks, not months.
          </p>
          <Button 
            variant="outline" 
            size="lg"
            className="gap-2 border-accent/30 hover:bg-accent hover:text-background transition-all duration-300 hover:scale-105"
            onClick={() => window.open('https://www.linkedin.com/in/rafaelluzoficial/', '_blank')}
          >
            <Linkedin className="h-5 w-5" />
            Connect on LinkedIn
          </Button>
        </div>
      </div>
    </div>
  );
};
