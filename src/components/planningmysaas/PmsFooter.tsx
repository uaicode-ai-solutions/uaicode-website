import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Youtube, Facebook, Instagram, Linkedin, Twitter, Loader2 } from "lucide-react";
import uaicodeLogo from "@/assets/uaicode-logo.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "@/components/newsletter/NewsletterSuccessDialog";
import EmailContactDialog from "@/components/chat/EmailContactDialog";

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

const PmsFooter = () => {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<NewsletterFormData>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: { email: "" },
  });

  const onNewsletterSubmit = async (data: NewsletterFormData) => {
    try {
      const sanitizedEmail = data.email.trim().toLowerCase();

      // Insert into Supabase
      const { error: dbError } = await supabase
        .from('tb_web_newsletter')
        .insert({ 
          email: sanitizedEmail, 
          source: 'pms_footer'
        });

      // Handle duplicate email
      if (dbError?.code === '23505') {
        toast({
          title: "Already subscribed!",
          description: "This email is already subscribed to our newsletter.",
        });
        return;
      }

      if (dbError) throw dbError;
      
      // Send welcome email (best-effort)
      supabase.functions.invoke('send-newsletter-welcome', {
        body: { email: sanitizedEmail, source: 'pms_footer' }
      }).catch(err => console.error('Welcome email error:', err));

      // Call webhook
      fetch(
        "https://uaicode-n8n.ax5vln.easypanel.host/webhook/a95bfd22-a4e0-48b2-b88d-bec4bfe84be4",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: sanitizedEmail,
            timestamp: new Date().toISOString(),
            source: "pms_footer",
          }),
        }
      ).catch(err => console.error('Webhook error:', err));

      // Show success dialog
      reset();
      setShowSuccessDialog(true);
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <NewsletterSuccessDialog 
        open={showSuccessDialog} 
        onOpenChange={setShowSuccessDialog} 
      />
      <footer className="relative pt-20 pb-8 px-4 border-t border-white/10 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 mesh-gradient opacity-20" />

        <div className="container mx-auto max-w-7xl relative z-10">
          {/* Newsletter Section - Clean Design */}
          <div className="glass-premium rounded-2xl border border-white/10 p-8 md:p-12 text-center mb-16">
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
              Stay Updated with <span className="text-gradient-gold">SaaS Insights</span>
            </h3>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Get exclusive tips on building, launching, and scaling successful SaaS products.
            </p>

            <form onSubmit={handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="your.email@company.com"
                  className="w-full bg-background/50 border-white/20 text-foreground placeholder:text-muted-foreground focus:border-accent/50"
                  disabled={isSubmitting}
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1 text-left">{errors.email.message}</p>
                )}
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(38,100%,50%)] hover:from-[hsl(45,100%,50%)] hover:to-[hsl(38,100%,45%)] text-background font-bold px-6 whitespace-nowrap"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>

            <p className="text-xs text-muted-foreground mt-4">
              We respect your privacy. Unsubscribe anytime.
            </p>
          </div>

          {/* Footer Content - Centered Layout */}
          <div className="text-center mb-12">
            {/* Brand */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-background" />
              </div>
              <span className="text-xl font-bold text-foreground">
                Planning<span className="text-gradient-gold">My</span>SaaS
              </span>
            </div>
            
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              AI-powered SaaS validation platform. From concept to market validation, 
              branding, and launch-ready assets — all in minutes.
            </p>
            
            {/* Social Links - Centered */}
            <div className="flex items-center justify-center gap-3">
              {[
                { Icon: Youtube, url: "https://www.youtube.com/@uaicodeai", label: "YouTube" },
                { Icon: Facebook, url: "https://web.facebook.com/uaicodeai", label: "Facebook" },
                { Icon: Instagram, url: "https://www.instagram.com/uaicode.ai/", label: "Instagram" },
                { Icon: Linkedin, url: "https://www.linkedin.com/company/uaicodeai/", label: "LinkedIn" },
                { Icon: Twitter, url: "https://x.com/uaicodeai", label: "X (Twitter)" },
              ].map(({ Icon, url, label }, index) => (
                <a 
                  key={index}
                  href={url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10">
            {/* Navigation Links - Inline */}
            <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 mb-6 text-sm">
              <button 
                onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Features
              </button>
              <span className="text-white/20">·</span>
              <button 
                onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Pricing
              </button>
              <span className="text-white/20">·</span>
              <button 
                onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                FAQ
              </button>
              <span className="text-white/20">·</span>
              <button 
                onClick={() => setShowEmailDialog(true)}
                className="text-muted-foreground hover:text-accent transition-colors"
              >
                Contact
              </button>
            </div>
            
            {/* Copyright Row */}
            <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6 text-sm text-muted-foreground">
              <p>© {new Date().getFullYear()} Planning My SaaS. All rights reserved.</p>
              <span className="hidden md:inline text-white/20">·</span>
              <p className="flex items-center gap-1.5">
                Made by 
                <a 
                  href="https://uaicode.ai" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-foreground hover:text-accent transition-colors font-medium"
                >
                  Uaicode
                  <img src={uaicodeLogo} alt="Uaicode" className="w-4 h-4" />
                </a>
                for founders everywhere
              </p>
            </div>
          </div>
        </div>

        <EmailContactDialog 
          open={showEmailDialog} 
          onOpenChange={setShowEmailDialog} 
          source="pms_footer"
        />
      </footer>
    </>
  );
};

export default PmsFooter;
