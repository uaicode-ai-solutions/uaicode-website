import { Sparkles, Compass } from "lucide-react";
import { Button } from "./ui/button";
import { YouTubeEmbed } from "./blog/YouTubeEmbed";
import heroThumbnail from "@/assets/hero-video-thumbnail.webp";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();
  
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="hero" className="pt-32 md:pt-40 lg:pt-48 xl:pt-56 pb-20 px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-card/50 to-background pointer-events-none"></div>

      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-[60px] font-bold mb-6">
            <span className="block sm:inline-block whitespace-normal sm:whitespace-nowrap">Got a SaaS Idea?</span>
            <span className="block sm:inline-block whitespace-nowrap mt-2 sm:mt-0 sm:ml-3 text-gradient-gold">Validate It First</span>
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-[20px] font-semibold text-muted-foreground mb-6 sm:mb-8 max-w-3xl mx-auto">
            Most startups fail because they skip validation. Get your free AI-powered market analysis in minutes before investing in development.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-6 sm:mb-8">
            <Button
              size="lg"
              onClick={() => navigate("/planningmysaas")}
              className="w-full sm:w-auto bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 glow-white"
            >
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
              Validate My Idea
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => scrollToSection("how-it-works")}
              className="w-full sm:w-auto border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-base sm:text-lg px-5 sm:px-8 py-4 sm:py-6 transition-all duration-300"
            >
              <Compass className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" />
              How It Works
            </Button>
          </div>

          {/* Trust Badge */}
          <div className="glass-card border border-accent/20 px-6 py-4 rounded-2xl inline-flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6 mt-2 sm:mt-0 mb-10 sm:mb-10 md:mb-12 text-muted-foreground">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">2,500+ Ideas Validated</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">100% Free Analysis</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-accent" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs sm:text-sm font-medium">AI-Powered Insights</span>
            </div>
          </div>

          {/* Hero Video */}
          <div className="max-w-4xl mx-auto relative">
            <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl -z-10"></div>
            <YouTubeEmbed 
              videoId="" 
              title="Uaicode MVP Development Demo - See How We Launch SaaS Products in Weeks"
              customThumbnail={heroThumbnail}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
