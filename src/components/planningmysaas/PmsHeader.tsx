import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Sparkles } from "lucide-react";

const PmsHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button
              onClick={() => scrollToSection("hero")}
              className="bg-accent hover:bg-accent/90 text-background font-semibold"
            >
              Get Started Now
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
            <Button
              onClick={() => scrollToSection("hero")}
              className="bg-accent hover:bg-accent/90 text-background font-semibold w-full"
            >
              Get Started Now
            </Button>
          </nav>
        )}
      </div>
    </header>
  );
};

export default PmsHeader;
