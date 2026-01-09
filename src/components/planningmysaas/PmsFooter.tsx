import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Mail, Twitter, Linkedin, Github, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "@/components/newsletter/NewsletterSuccessDialog";

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
          {/* Newsletter Section */}
          <div className="glass-premium rounded-2xl border border-white/10 p-8 md:p-12 mb-16 text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/30 mb-6">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm font-medium text-accent">Stay Updated</span>
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Get SaaS Tips & Updates
            </h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Join 5,000+ founders getting weekly insights on building and launching successful SaaS products.
            </p>

            <form onSubmit={handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1">
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 rounded-xl bg-background/50 border border-white/10 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 transition-colors h-auto"
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
                className="bg-accent hover:bg-accent/90 text-background font-bold px-8 py-3 rounded-xl h-auto"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  "Subscribe"
                )}
              </Button>
            </form>
          </div>

          {/* Footer Content */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent to-orange-500 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-background" />
                </div>
                <span className="text-xl font-bold text-foreground">
                  Planning<span className="text-gradient-gold">My</span>SaaS
                </span>
              </div>
              <p className="text-muted-foreground max-w-sm mb-6">
                AI-powered SaaS validation platform. From concept to market validation, 
                branding, and launch-ready assets — all in minutes.
              </p>
              
              {/* Social Links */}
              <div className="flex items-center gap-3">
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-muted-foreground hover:text-accent hover:border-accent/30 transition-colors"
                >
                  <Github className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Links */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Product</h4>
              <ul className="space-y-3">
                <li>
                  <button 
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    Features
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    Pricing
                  </button>
                </li>
                <li>
                  <button 
                    onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    FAQ
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-foreground mb-4">Legal</h4>
              <ul className="space-y-3">
                <li>
                  <Link to="/terms" className="text-muted-foreground hover:text-accent transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="text-muted-foreground hover:text-accent transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <a 
                    href="mailto:support@planningmysaas.com"
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Planning My SaaS. All rights reserved.
            </p>
            <p className="text-sm text-muted-foreground">
              Made with ❤️ for founders everywhere
            </p>
          </div>
        </div>
      </footer>
    </>
  );
};

export default PmsFooter;
