import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles, Youtube, Facebook, Instagram, Linkedin, Twitter } from "lucide-react";

const socialLinks = [
  { Icon: Youtube, url: "https://www.youtube.com/@uaicodeai", label: "Visit our YouTube channel" },
  { Icon: Facebook, url: "https://web.facebook.com/uaicodeai", label: "Follow us on Facebook" },
  { Icon: Instagram, url: "https://www.instagram.com/uaicode.ai/", label: "Follow us on Instagram" },
  { Icon: Linkedin, url: "https://www.linkedin.com/company/uaicodeai/", label: "Connect on LinkedIn" },
  { Icon: Twitter, url: "https://x.com/uaicodeai", label: "Follow us on X" },
];

const PmsHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleValidate = () => {
    navigate("/planningmysaas/wizard?plan=pro");
    setIsMenuOpen(false);
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-accent/60 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-background" />
            </div>
            <span className="text-xl font-bold text-foreground">
              Planning<span className="text-accent">My</span>SaaS
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              FAQ
            </button>
          </nav>

          {/* Social Icons + CTA Button */}
          <div className="hidden md:flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-border/30">
              {socialLinks.map(({ Icon, url, label }, index) => (
                <a 
                  key={index}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  className="h-10 w-10 rounded-full border border-accent/30 bg-background hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 transition-all duration-300 group flex items-center justify-center"
                >
                  <Icon className="h-4 w-4 text-accent group-hover:text-background" />
                </a>
              ))}
            </div>
            <Button
              onClick={handleValidate}
              className="bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              Validate My Idea
            </Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pb-4 flex flex-col gap-4 animate-fade-in">
            <button
              onClick={() => scrollToSection("how-it-works")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              How It Works
            </button>
            <button
              onClick={() => scrollToSection("features")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Features
            </button>
            <button
              onClick={() => scrollToSection("pricing")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              Pricing
            </button>
            <button
              onClick={() => scrollToSection("faq")}
              className="text-muted-foreground hover:text-foreground transition-colors text-left"
            >
              FAQ
            </button>
            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
              {socialLinks.map(({ Icon, url, label }, index) => (
                <a 
                  key={index}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  aria-label={label}
                  className="h-10 w-10 rounded-full border border-accent/30 bg-background hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 transition-all duration-300 group flex items-center justify-center"
                >
                  <Icon className="h-4 w-4 text-accent group-hover:text-background" />
                </a>
              ))}
            </div>
            <Button
              onClick={handleValidate}
              className="bg-accent hover:bg-accent/90 text-background font-semibold w-full"
            >
              Validate My Idea
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PmsHeader;
