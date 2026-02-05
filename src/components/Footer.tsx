import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Phone, MapPin, Youtube, Facebook, Instagram, Linkedin, Twitter, MessageCircle, Building2, Sparkles } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { sanitizeInput } from "@/lib/inputSanitization";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "./newsletter/NewsletterSuccessDialog";
import PhoneCallDialog from "./chat/PhoneCallDialog";
import EmailContactDialog from "./chat/EmailContactDialog";
import EveChatDialog from "./chat/EveChatDialog";
import EveVoiceDialog from "./chat/EveVoiceDialog";
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
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showChatDialog, setShowChatDialog] = useState(false);
  const [showVoiceDialog, setShowVoiceDialog] = useState(false);
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
      console.log("Please wait before submitting again");
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
        console.log("Email already subscribed");
        return;
      }

      if (dbError) {
        throw dbError;
      }
      
      // Send welcome email (best-effort, don't block success)
      supabase.functions.invoke('send-newsletter-welcome', {
        body: { email: sanitizedEmail, source: 'footer_newsletter' }
      }).then(({ error }) => {
        if (error) console.error('Welcome email error:', error);
      }).catch(err => console.error('Welcome email fetch error:', err));

      // Call the webhook
      fetch("https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: sanitizedEmail,
          timestamp: new Date().toISOString(),
          source: "footer_newsletter",
        }),
      }).catch(err => console.error('Webhook error:', err));

      // Show success dialog
      reset();
      setLastSubmitTime(now);
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
    }
  };

  return (
    <>
    <NewsletterSuccessDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog} />
    <footer className="bg-card border-t border-border pt-12 pb-6 px-4">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-8 mb-10">
          {/* Navigation */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Navigation</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => scrollToSection("how-it-works")}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Process
                </button>
              </li>
              <li>
                <button 
                  onClick={() => scrollToSection("pricing")}
                  className="text-muted-foreground hover:text-accent transition-colors"
                >
                  Investment
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
                <p>5900 Balcones Drive, Ste 100<br />Austin, Texas, 78731</p>
              </div>
            </div>

            {/* Validate My Idea */}
            <div className="mt-6">
              <h4 className="text-lg font-semibold mb-4 text-accent">Validate My Idea</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => navigate("/planningmysaas")}
                    className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-5 h-5" />
                    Planning My SaaS
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-accent">Contact</h3>
            <ul className="space-y-3">
              <li>
                <button 
                  onClick={() => setShowEmailDialog(true)}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Mail className="w-5 h-5" />
                  hello@uaicode.ai
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowVoiceDialog(true)}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  +1 (737) 225 9254
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowChatDialog(true)}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <MessageCircle className="w-5 h-5" />
                  Chat with Eve
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowVoiceDialog(true)}
                  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
                >
                  <Phone className="w-5 h-5" />
                  Call Eve
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
    <PhoneCallDialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog} />
    <EmailContactDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} />
    <EveChatDialog open={showChatDialog} onOpenChange={setShowChatDialog} />
    <EveVoiceDialog open={showVoiceDialog} onOpenChange={setShowVoiceDialog} />
    </>
  );
};

export default Footer;
