import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Mail, Twitter, Linkedin, Github, Loader2, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import NewsletterSuccessDialog from "@/components/newsletter/NewsletterSuccessDialog";

import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";

const founderAvatars = [
  { src: sarahJohnsonImg, alt: "Sarah" },
  { src: emmaThompsonImg, alt: "Emma" },
  { src: johnSmithImg, alt: "John" },
];

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
        {/* Newsletter Section - Premium Design */}
        <div className="relative mb-16">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-accent/5 to-accent/10 blur-3xl rounded-3xl scale-95" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent/20 blur-[100px] rounded-full" />
          
          <div className="relative glass-premium rounded-3xl border border-accent/20 p-10 md:p-16 text-center overflow-hidden">
            {/* Decorative Elements */}
            <div className="absolute top-6 right-6 md:top-10 md:right-10">
              <Sparkles className="w-8 h-8 text-accent/40 animate-pulse" />
            </div>
            <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10">
              <Star className="w-6 h-6 text-accent/30" />
            </div>
            <div className="absolute top-1/2 right-8 -translate-y-1/2 hidden lg:block">
              <Zap className="w-5 h-5 text-accent/20" />
            </div>
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/10 border border-accent/30 mb-8 shadow-lg shadow-accent/10">
              <Mail className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">Newsletter</span>
            </div>
            
            {/* Headline with Gradient */}
            <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              <span className="text-foreground">Get Weekly</span>
              <br />
              <span className="text-gradient-gold">SaaS Insights</span>
            </h3>
            
            {/* Description */}
            <p className="text-muted-foreground max-w-lg mx-auto mb-10 text-lg leading-relaxed">
              Join <span className="text-accent font-semibold">5,000+</span> founders getting exclusive tips on building, 
              launching, and scaling successful SaaS products.
            </p>

            {/* Form with Premium Style */}
            <form onSubmit={handleSubmit(onNewsletterSubmit)} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto mb-10">
              <div className="flex-1">
                <Input
                  type="email"
                  {...register("email")}
                  placeholder="Enter your email address"
                  className="w-full px-5 py-4 rounded-xl glass-premium border border-white/20 text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/20 transition-all h-auto text-base"
                  disabled={isSubmitting}
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-2 text-left">{errors.email.message}</p>
                )}
              </div>
              <Button 
                type="submit"
                disabled={isSubmitting}
                className="bg-gradient-to-r from-[hsl(45,100%,55%)] to-[hsl(38,100%,50%)] hover:from-[hsl(45,100%,50%)] hover:to-[hsl(38,100%,45%)] text-background font-bold px-10 py-4 rounded-xl h-auto text-base shadow-lg shadow-accent/25 hover:shadow-accent/40 hover:scale-[1.02] transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Subscribe Free
                  </>
                )}
              </Button>
            </form>

            {/* Social Proof with Avatars */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <div className="flex -space-x-3">
                {founderAvatars.map((avatar, i) => (
                  <img 
                    key={i} 
                    src={avatar.src} 
                    alt={avatar.alt}
                    className="w-10 h-10 rounded-full border-2 border-background object-cover shadow-lg" 
                  />
                ))}
                <div className="w-10 h-10 rounded-full border-2 border-background bg-accent/20 flex items-center justify-center text-xs font-bold text-accent shadow-lg">
                  +5k
                </div>
              </div>
              <div className="text-center sm:text-left">
                <p className="text-sm text-muted-foreground">
                  Trusted by <span className="text-accent font-semibold">5,000+</span> founders worldwide
                </p>
                <div className="flex items-center justify-center sm:justify-start gap-1 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">4.9/5</span>
                </div>
              </div>
            </div>
          </div>
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
