import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Cal, { getCalApi } from "@calcom/embed-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { Mail, Phone, MapPin } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sanitizeFormData } from "@/lib/inputSanitization";
import { supabase } from "@/integrations/supabase/client";
import BookingConfirmationDialog from "@/components/scheduler/BookingConfirmationDialog";

const scheduleFormSchema = z.object({
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

type ScheduleFormData = z.infer<typeof scheduleFormSchema>;

interface BookingDetails {
  date?: string;
  time?: string;
  email?: string;
}

const Schedule = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    watch,
    setValue,
  } = useForm<ScheduleFormData>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      project: "",
    },
  });

  const projectValue = watch("project");
  const projectCharCount = projectValue?.length || 0;

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "diagnostic-45min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: {
            "cal-brand": "#FFC61A"
          },
          light: {
            "cal-brand": "#FFC61A"
          }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  const onSubmit = async (data: ScheduleFormData) => {
    const sanitizedData = sanitizeFormData(data);
    
    const attemptSubmit = async (): Promise<{ data: unknown; error: Error | null }> => {
      try {
        console.log("Attempting form submission...");
        const { data: responseData, error } = await supabase.functions.invoke('submit-contact-form', {
          body: sanitizedData,
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
      // First attempt
      let result = await attemptSubmit();
      
      // If first attempt fails, retry after 2 seconds
      if (result.error) {
        console.warn("First attempt failed, retrying in 2 seconds...", result.error.message);
        await new Promise(resolve => setTimeout(resolve, 2000));
        result = await attemptSubmit();
      }
      
      if (result.error) {
        throw result.error;
      }
      
      const responseData = result.data as { 
        title?: string; 
        message?: string;
        booking?: {
          date?: string;
          time?: string;
        };
      } | null;
      
      // Set booking details for the confirmation dialog
      setBookingDetails({
        date: responseData?.booking?.date,
        time: responseData?.booking?.time,
        email: data.email,
      });
      setShowConfirmation(true);
      reset();
    } catch (error) {
      console.error("Form submission error:", error);
      toast({
        title: "Unable to Submit",
        description: error instanceof Error ? error.message : "There was an error submitting your form.",
        variant: "destructive",
      });
    }
  };

  return (
    <section id="schedule" className="py-20 px-4 bg-card/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Ready to <span className="text-gradient-gold">Build Your Next Big Thing?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Schedule a free consultation to discuss your project. We'll provide honest feedback, estimated timelines, and transparent pricing
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-card rounded-2xl overflow-hidden">
          <div className="w-full h-[500px] md:h-[700px] overflow-auto">
            <Cal
              namespace="diagnostic-45min"
              calLink="uaicode-ai/diagnostic-45min"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", theme: "dark" }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground py-4">
            Having trouble seeing the calendar?{" "}
            <a 
              href="https://cal.com/uaicode-ai/diagnostic-45min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Click here to open it in a new tab
            </a>
          </p>
        </div>

        {/* Contact Form Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12 max-w-5xl mx-auto">
          {/* Left Column - Contact Info */}
          <div className="glass-card rounded-2xl p-8 flex flex-col">
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
                  <a href="mailto:hello@uaicode.ai" className="text-muted-foreground hover:text-accent transition-colors">
                    hello@uaicode.ai
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">Call Us</h4>
                  <a href="tel:+13215291451" className="text-muted-foreground hover:text-accent transition-colors">
                    +1 (321) 529 1451
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <h4 className="font-semibold mb-1 text-base">Location</h4>
                  <p className="text-muted-foreground">
                    Remote-First • Serving Clients Worldwide
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
          <div className="glass-card rounded-2xl p-8">
            {/* Form Header - Title & Subtitle */}
            <div className="mb-8 pb-6 border-b border-border">
              <h3 className="text-2xl md:text-3xl font-bold mb-3">
                Start Your Project <span className="text-gradient-gold">Today</span>
              </h3>
              <p className="text-muted-foreground text-base leading-relaxed">
                Share your vision with us and get a personalized consultation. 
                We'll help turn your ideas into a scalable SaaS product.
              </p>
            </div>
            
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 flex flex-col">
              <div>
                <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                  Your Name <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">Enter your first and last name</p>
                <Input
                  id="name"
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
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.name.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">We'll send your quote here</p>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@company.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="bg-background"
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
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
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone.message}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="project" className="text-sm font-medium mb-2 block">
                  Tell Us About Your Project <span className="text-destructive">*</span>
                </Label>
                <p className="text-xs text-muted-foreground mb-1.5">
                  Describe your SaaS idea, target users, and key features (minimum 20 characters)
                </p>
                <Textarea
                  id="project"
                  placeholder="Describe your SaaS idea, target market, and any specific features you have in mind..."
                  {...register("project")}
                  disabled={isSubmitting}
                  className="bg-background min-h-[120px] max-h-[180px] resize-y"
                  maxLength={2000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{projectCharCount}/2000 characters</p>
                  {projectCharCount > 1800 && (
                    <p className={`text-xs ${projectCharCount > 1960 ? 'text-destructive' : 'text-yellow-500'}`}>
                      {projectCharCount > 1960 ? 'Character limit reached' : 'Approaching character limit'}
                    </p>
                  )}
                </div>
                {errors.project && (
                  <p className="text-red-500 text-xs md:text-sm mt-1">{errors.project.message}</p>
                )}
              </div>
              
              <div className="space-y-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg py-6 disabled:opacity-50"
                >
                  {isSubmitting ? "Sending..." : "Get a Free Consultation"}
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

      <BookingConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingDetails={bookingDetails}
      />
    </section>
  );
};

export default Schedule;
