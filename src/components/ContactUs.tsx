import { useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Mail, Phone, MapPin, Sparkles } from "lucide-react";
import { sanitizeFormData } from "@/lib/inputSanitization";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import PhoneCallDialog from "@/components/chat/PhoneCallDialog";
import EmailContactDialog from "@/components/chat/EmailContactDialog";
import MessageSentDialog from "@/components/scheduler/MessageSentDialog";

const contactFormSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters)")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .trim()
    .email("Please enter a valid email address (e.g., john@company.com)")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  
  phone: z.string()
    .optional()
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      "Phone number must be at least 10 digits"
    ),
  
  project: z.string()
    .trim()
    .min(20, "Please provide more details about your project (at least 20 characters)")
    .max(2000, "Project description must be less than 2000 characters"),
});

type ContactFormData = z.infer<typeof contactFormSchema>;

const ContactUs = () => {
  const [showPhoneDialog, setShowPhoneDialog] = useState(false);
  const [showEmailDialog, setShowEmailDialog] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project: "",
    },
  });

  const projectValue = watch("project");
  const projectCharCount = projectValue?.length || 0;

  const onSubmit = async (data: ContactFormData) => {
    const sanitizedData = sanitizeFormData(data);
    
    const attemptSubmit = async (): Promise<{ data: unknown; error: Error | null }> => {
      try {
        const { data: responseData, error } = await supabase.functions.invoke('send-email-contact', {
          body: {
            name: sanitizedData.name,
            email: sanitizedData.email,
            phone: sanitizedData.phone || '',
            message: sanitizedData.project,
            source: 'website_uaicode',
          },
        });
        
        if (error) {
          return { data: null, error: new Error(error.message) };
        }
        
        return { data: responseData, error: null };
      } catch (err) {
        return { data: null, error: err instanceof Error ? err : new Error('Unknown error') };
      }
    };

    try {
      let result = await attemptSubmit();
      
      if (result.error) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await attemptSubmit();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      setSubmittedEmail(data.email);
      setShowConfirmation(true);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <section id="contact" className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient-gold">Turn Your Validated Idea Into Revenue?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Already had your strategy call? Share your details and get a custom development roadmap with fixed pricing.
          </p>
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="glass-card rounded-2xl p-8 flex flex-col border border-accent/10 hover:border-accent/30 transition-all duration-300">
            <h3 className="text-2xl font-bold mb-4">Get in Touch</h3>
            <p className="text-muted-foreground mb-8">
              Schedule a free consultation to discuss your project. We'll provide honest feedback, estimated timelines, and transparent pricing.
            </p>
            
            {/* Contact Details */}
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">Email Us</h4>
                  <button 
                    onClick={() => setShowEmailDialog(true)}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    hello@uaicode.ai
                  </button>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">Call Us</h4>
                  <button 
                    onClick={() => setShowPhoneDialog(true)}
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    +1 (737) 225 9254
                  </button>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">Location</h4>
                  <p className="text-muted-foreground">
                    5900 Balcones Drive, Ste 100, Austin, Texas
                  </p>
                </div>
              </div>
            </div>
            
            {/* What to Expect Section */}
            <div className="mt-8 pt-8 border-t border-border">
              <h4 className="text-xl font-bold mb-4">What to Expect</h4>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Response within 24 hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Free 45-minute consultation</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Honest assessment of your project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>Transparent pricing and timeline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-accent">•</span>
                  <span>No obligation to proceed</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* Right Column - Contact Form */}
          <div className="glass-card rounded-2xl p-8 border border-accent/10 hover:border-accent/30 transition-all duration-300">
            {/* Form Header */}
            <div className="mb-8 pb-6 border-b border-border">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Start Your <span className="text-gradient-gold">Project Today</span>
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Tell us about your Planning My SaaS report or validated idea. 
                We'll create a personalized development roadmap for you.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
              <div>
                <Label htmlFor="contact-name" className="text-sm font-medium mb-2 block">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">Enter your first and last name</p>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  disabled={isSubmitting}
                  className="bg-background"
                  maxLength={100}
                  minLength={2}
                  pattern="[a-zA-Z\s'\-]+"
                  title="Name can only contain letters, spaces, hyphens, and apostrophes"
                />
                {errors.name && (
                  <p className="text-destructive text-xs md:text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contact-email" className="text-sm font-medium mb-2 block">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">We'll send your quote here</p>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@company.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="bg-background"
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-destructive text-xs md:text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contact-phone" className="text-sm font-medium mb-2 block">
                  Phone
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">Include country code (e.g., +1 555 123-4567)</p>
                <PhoneInput
                  value={watch("phone") || ""}
                  onChange={(phone) => setValue("phone", phone)}
                  disabled={isSubmitting}
                  placeholder="Phone number"
                  defaultCountry="us"
                />
                {errors.phone && (
                  <p className="text-destructive text-xs md:text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="contact-project" className="text-sm font-medium mb-2 block">
                  Tell Us About Your Project <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Describe your SaaS idea, target users, and key features (minimum 20 characters)
                </p>
                <Textarea
                  id="contact-project"
                  placeholder="Describe your SaaS idea, target market, and any specific features you have in mind..."
                  {...register("project")}
                  disabled={isSubmitting}
                  className="bg-background min-h-[120px] max-h-[180px] resize-y"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{projectCharCount}/2000 characters</p>
                  {projectCharCount > 1800 && (
                    <p className={`text-xs ${projectCharCount > 1960 ? 'text-destructive' : 'text-amber-500'}`}>
                      {projectCharCount > 1960 ? 'Character limit reached' : 'Approaching character limit'}
                    </p>
                  )}
                </div>
                {errors.project && (
                  <p className="text-destructive text-xs md:text-sm mt-1">{errors.project.message}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-base sm:text-lg py-4 sm:py-6 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    "Sending..."
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5 sm:mr-2" />
                      Send Message
                    </>
                  )}
                </Button>
                
                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our{" "}
                  <Link to="/privacy" className="text-accent hover:underline">Privacy Policy</Link>
                  {" "}and{" "}
                  <Link to="/terms" className="text-accent hover:underline">Terms of Service</Link>.
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>

      <PhoneCallDialog open={showPhoneDialog} onOpenChange={setShowPhoneDialog} />
      <EmailContactDialog open={showEmailDialog} onOpenChange={setShowEmailDialog} />
      <MessageSentDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        email={submittedEmail}
      />
    </section>
  );
};

export default ContactUs;
