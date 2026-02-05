import { Linkedin } from "lucide-react";
import { Button } from "@/components/ui/button";
import founderImage from "@/assets/founder-rafael-luz-circular.webp";

const MeetTheFounder = () => {
  return (
    <section id="founder" className="bg-black py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
                <span className="text-gradient-gold">Meet the Founder</span>
              </h2>
              <p className="text-xl md:text-2xl text-muted-foreground mb-8">
                The Vision Behind Uaicode.ai
              </p>
            </div>

            <div className="space-y-6 text-base text-muted-foreground leading-relaxed">
              <p>
                Rafael Luz is the founder and CEO of Uaicode.ai, bringing over a decade of experience in AI-powered software development and startup consulting. After witnessing countless promising ideas fail due to slow, expensive development cycles, he created Uaicode.ai to democratize access to rapid MVP development.
              </p>

              <p>
                Under Rafael's leadership, Uaicode.ai has launched over 1,200 MVPs across diverse industries. His hands-on approach combines cutting-edge AI capabilities with proven methodologies, enabling startups to validate their ideas in weeks instead of months—with transparent pricing and honest feedback every step of the way.
              </p>
            </div>

            <Button
              size="lg"
              className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 gap-2 transition-all duration-300 hover:scale-105"
              asChild
            >
              <a 
                href="https://www.linkedin.com/in/rafaelluzoficial/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Linkedin className="h-5 w-5" />
                Connect on LinkedIn
              </a>
            </Button>
          </div>

          {/* Right Column - Photo */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/5 rounded-full blur-2xl" />
              <img
                src={founderImage}
                alt="Rafael Luz - Founder and CEO of Uaicode.ai"
                loading="lazy"
                className="relative w-full h-auto max-w-md lg:max-w-lg rounded-full shadow-2xl hover-lift border-4 border-accent/20"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MeetTheFounder;
