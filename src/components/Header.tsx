import { useState, useLayoutEffect, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Menu, X, Calculator, Youtube, Instagram, Linkedin, Facebook, Twitter } from "lucide-react";
import { Button } from "./ui/button";
import logo from "@/assets/uaicode-logo.png";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const scrollToSection = (id: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    } else {
      navigate("/", { state: { scrollTo: id } });
      setIsMenuOpen(false);
    }
  };

  useLayoutEffect(() => {
    if (location.pathname === "/") {
      const state = location.state as { scrollTo?: string } | null;
      if (state?.scrollTo) {
        const id = state.scrollTo;
        setTimeout(() => {
          const element = document.getElementById(id);
          element?.scrollIntoView({ behavior: "smooth" });
          navigate("/", { replace: true, state: null });
        }, 0);
        return;
      }
      if (location.hash) {
        navigate("/", { replace: true });
        window.scrollTo({ top: 0, behavior: "auto" });
      }
    }
  }, [location, navigate]);


  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-4 left-0 right-0 z-50 px-4 lg:px-8 pointer-events-none transition-all duration-300`}>
      <div className="bg-background border border-border/50 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] pointer-events-auto">
        <div className={`container mx-auto px-4 transition-all duration-300 ${isScrolled ? 'py-2 md:py-3' : 'py-3 md:py-4'}`}>
          <div className="flex items-center justify-between">
            <button onClick={() => scrollToSection("hero")} className="flex items-center gap-3 hover:opacity-80 transition-all duration-300 cursor-pointer focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded" aria-label="Return to home">
              <img src={logo} alt="Uaicode AI" className={`transition-all duration-300 ${isScrolled ? 'h-8 sm:h-10 md:h-12' : 'h-10 sm:h-14 md:h-16'}`} loading="lazy" />
              <span className="text-xl sm:text-2xl font-bold text-foreground">uaicode.ai</span>
            </button>
          <nav className="hidden lg:flex items-center gap-10">
            <button onClick={() => scrollToSection("how-it-works")} className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Process</button>
            <button onClick={() => scrollToSection("investment")} className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Investment</button>
            <button onClick={() => scrollToSection("pricing")} className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Solutions</button>
            <button onClick={() => { setIsMenuOpen(false); navigate("/planning"); }} className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Planning</button>
            <Link to="/jobs" className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Jobs</Link>
            <Link to="/newsletter" className="text-foreground hover:text-accent transition-all duration-300 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Insights</Link>
          </nav>
          <div className="hidden lg:flex items-center gap-6">
            <div className="flex items-center gap-3 pr-6 border-r border-border/30">
              {[
                { Icon: Youtube, url: "https://www.youtube.com/@uaicodeai", label: "Visit our YouTube channel" },
                { Icon: Facebook, url: "https://web.facebook.com/uaicodeai", label: "Follow us on Facebook" },
                { Icon: Instagram, url: "https://www.instagram.com/uaicode.ai/", label: "Follow us on Instagram" },
                { Icon: Linkedin, url: "https://www.linkedin.com/company/uaicodeai/", label: "Connect on LinkedIn" },
                { Icon: Twitter, url: "https://x.com/uaicodeai", label: "Follow us on X" },
              ].map(({ Icon, url, label }, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={label}
                    className="h-10 w-10 rounded-full border border-accent/30 bg-background hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 transition-all duration-300 group flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="h-4 w-4 text-accent group-hover:text-background" />
                  </a>
                </Button>
              ))}
            </div>
            <Button onClick={() => scrollToSection("schedule")} className="font-semibold bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background">
              <Calculator className="w-4 h-4 mr-2" />Get MVP Pricing
            </Button>
          </div>
          <button className="lg:hidden text-foreground hover:text-accent transition-colors focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded p-2" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label={isMenuOpen ? "Close menu" : "Open menu"}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      </div>
      {isMenuOpen && (
        <div className="lg:hidden mt-2 bg-background border border-border/50 rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.15)] pointer-events-auto animate-fade-in">
          <div className="container mx-auto px-6 py-6 flex flex-col gap-4">
            <nav className="flex flex-col gap-3">
              <button onClick={() => scrollToSection("how-it-works")} className="text-left text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Process</button>
              <button onClick={() => scrollToSection("investment")} className="text-left text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Investment</button>
              <button onClick={() => scrollToSection("pricing")} className="text-left text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Solutions</button>
              <button onClick={() => { setIsMenuOpen(false); navigate("/planning"); }} className="text-left text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Planning</button>
              <Link to="/jobs" className="text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Jobs</Link>
              <Link to="/newsletter" className="text-foreground hover:text-accent transition-all duration-300 py-2 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded">Insights</Link>
            </nav>
            <div className="flex items-center gap-3 pt-4 border-t border-border/40">
              {[
                { Icon: Youtube, url: "https://www.youtube.com/@uaicodeai", label: "Visit our YouTube channel" },
                { Icon: Facebook, url: "https://web.facebook.com/uaicodeai", label: "Follow us on Facebook" },
                { Icon: Instagram, url: "https://www.instagram.com/uaicode.ai/", label: "Follow us on Instagram" },
                { Icon: Linkedin, url: "https://www.linkedin.com/company/uaicodeai/", label: "Connect on LinkedIn" },
                { Icon: Twitter, url: "https://x.com/uaicodeai", label: "Follow us on X" }
              ].map(({ Icon, url, label }, index) => (
                <Button key={index} variant="ghost" size="icon" asChild>
                  <a 
                    href={url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    aria-label={label}
                    className="h-10 w-10 rounded-full border border-accent/30 bg-background hover:bg-accent hover:border-accent hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:scale-110 transition-all duration-300 group flex items-center justify-center focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                  >
                    <Icon className="h-4 w-4 text-accent group-hover:text-background" />
                  </a>
                </Button>
              ))}
            </div>
            <Button onClick={() => scrollToSection("schedule")} className="w-full font-semibold bg-accent text-accent-foreground hover:bg-accent/90 focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"><Calculator className="w-4 h-4 mr-2" />Get MVP Pricing</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
