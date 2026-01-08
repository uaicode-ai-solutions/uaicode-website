import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram, Linkedin, Twitter, MessageCircle, Building2 } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { toast } from "@/hooks/use-toast";
import { sanitizeInput } from "@/lib/inputSanitization";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "./newsletter/NewsletterSuccessDialog";
import logo from "@/assets/uaicode-logo.png";

const newsletterSchema = z.object({
  email: z.string()
    .trim()
    .min(1, "Email is required")
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase()
    .refine(
      (email) => !email.includes('+'),
      "Please use a standard email address without '+' symbols"
    ),
});

type NewsletterFormData = z.infer<typeof newsletterSchema>;

const Footer = () => {
  const [lastSubmitTime, setLastSubmitTime] = useState(0);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });

  const emailValue = watch("email");
  const emailCharCount = emailValue?.length || 0;

  const scrollToSection = (id: string) => {
    if (location.pathname === "/") {
      const element = document.getElementById(id);
      element?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate("/", { state: { scrollTo: id } });
    }
  };

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    // Prevent double submissions (3 second cooldown)
    const now = Date.now();
    if (now - lastSubmitTime < 3000) {
      toast({
        title: "Please Wait",
        description: "Please wait a moment before submitting again.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Sanitize email input
      const sanitizedEmail = sanitizeInput(data.email).toLowerCase();
      
      // First, try to insert into Supabase
      const { error: dbError } = await supabase
        .from('tb_web_newsletter')
        .insert({ 
          email: sanitizedEmail, 
          source: 'footer_newsletter' 
        });

      // Handle duplicate email error
      if (dbError?.code === '23505') {
        toast({
          title: "Already subscribed!",
          description: "This email is already subscribed to our newsletter.",
        });
        return;
      }

      if (dbError) {
        throw dbError;
      }
      
      // Call the webhook
      await fetch("https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          timestamp: new Date().toISOString(),
          source: "footer_newsletter",
        }),
      });

      // Show success dialog
      reset();
      setLastSubmitTime(now);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Unable to Subscribe",
        description: "There was an error subscribing. Please check your internet connection and try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <NewsletterSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    <footer className="bg-card border-t border-border pt-12 pb-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-10">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection("investment")}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Investment
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("pricing")}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Solutions
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate("/planning")}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Planning
                </button>
              </li>
              <li>
                <Link to="/jobs" className="text-muted-foreground hover:text-accent transition-colors">
                  Jobs
                </Link>
              </li>
              <li>
                <Link to="/newsletter" className="text-muted-foreground hover:text-accent transition-colors">
                  Insights
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Company</h3>
            <div className="space-y-3 text-muted-foreground">
              <div className="flex items-start gap-2">
                <Building2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p className="font-semibold">Uaicode Data & AI Solutions LLC</p>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <p>6751 Forum Drive, Suite 240<br />Orlando, FL 32821</p>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a 
                  href="mailto:hello@uaicode.ai" 
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  hello@uaicode.ai
                </a>
              </li>
              <li>
                <a 
                  href="tel:+13215291451" 
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  +1 (321) 529 1451
                </a>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("chat")}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Talk to Eve!
                </button>
              </li>
            </ul>
          </div>

          {/* Insights */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Insights</h3>
            <p className="text-muted-foreground mb-4">
              Get exclusive AI insights delivered to your inbox.
            </p>
            <form onSubmit={handleSubmit(onNewsletterSubmit)} className="space-y-3">
              <div>
                <Input
                  type="email"
                  placeholder="your.email@company.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="bg-background border-border disabled:opacity-50"
                  maxLength={255}
                />
                <p className="text-xs text-muted-foreground mt-1">{emailCharCount}/255 characters</p>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
                )}
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Subscribing..." : "Subscribe to Insights"}
              </Button>
              <p className="text-xs text-muted-foreground">
                By signing up I accept the terms of the Uaicode Privacy Policy and Terms of Use.
              </p>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-6 mb-6">
            {/* Logo and Site Name */}
            <div className="flex items-center gap-4">
              <img src={logo} alt="Uaicode AI" className="h-8" loading="lazy" />
              <span className="text-muted-foreground">uaicode.ai</span>
            </div>
            
            {/* Social Media Links */}
            <div className="flex items-center gap-3 sm:gap-4">
              <a 
                href="https://www.youtube.com/@uaicodeai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="YouTube"
              >
                <Youtube className="w-5 h-5" />
              </a>
              <a 
                href="https://web.facebook.com/uaicodeai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://www.instagram.com/uaicode.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://www.linkedin.com/company/uaicodeai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://x.com/uaicodeai" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-accent transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>

            {/* Privacy and Terms Links */}
            <div className="flex gap-4 sm:gap-6">
              <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Privacy Policy
              </Link>
              <Link to="/terms" className="text-muted-foreground hover:text-accent transition-colors text-sm">
                Terms of Use
              </Link>
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground border-t border-border pt-6">
            <p className="mb-2">
              © 2025 Uaicode. All rights reserved. This website and all its content, including text and visual identity, are protected by intellectual property laws.
            </p>
            <p>
              Any reproduction, plagiarism, or improper use, in whole or in part, without express authorization, may result in legal action, including extrajudicial notifications, forced removal, and civil and criminal liability.
            </p>
          </div>
        </div>
      </div>
    </footer>
    </>
  );
};

export default Footer;
