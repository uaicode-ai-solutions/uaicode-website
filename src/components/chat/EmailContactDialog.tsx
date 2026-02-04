import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Sparkles, Send } from "lucide-react";
import EveAvatar from "@/components/chat/EveAvatar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { sanitizeFormData } from "@/lib/inputSanitization";
import { supabase } from "@/integrations/supabase/client";

const emailContactSchema = z.object({
  name: z.string()
    .trim()
    .min(2, "Please enter your full name (at least 2 characters)")
    .max(100, "Name must be less than 100 characters")
    .regex(/^[a-zA-Z\s'\-]+$/, "Name can only contain letters, spaces, hyphens, and apostrophes"),
  
  email: z.string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters")
    .toLowerCase(),
  
  phone: z.string()
    .refine(
      (val) => val.replace(/\D/g, '').length >= 10,
      "Phone number must be at least 10 digits"
    ),
  
  message: z.string()
    .trim()
    .min(10, "Message must be at least 10 characters")
    .max(1000, "Message must be less than 1000 characters"),
});

type EmailContactFormData = z.infer<typeof emailContactSchema>;

interface EmailContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  source?: string;
}

export const EmailContactDialog: React.FC<EmailContactDialogProps> = ({ open, onOpenChange, source = 'website_uaicode' }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<EmailContactFormData>({
    resolver: zodResolver(emailContactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const messageValue = watch("message");
  const messageCharCount = messageValue?.length || 0;

  const onSubmit = async (data: EmailContactFormData) => {
    setIsSubmitting(true);
    
    try {
      const sanitizedData = sanitizeFormData(data);
      
      const { error } = await supabase.functions.invoke('send-email-contact', {
        body: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          source,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log("Message sent successfully");
      setSubmitSuccess(true);
      reset();

      // Close dialog after showing success
      setTimeout(() => {
        setSubmitSuccess(false);
        onOpenChange(false);
      }, 2500);
    } catch (error) {
      console.error("Email contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setSubmitSuccess(false);
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg glass-card border-amber-500/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          {/* Icon with glow effect */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full scale-110" />
              <EveAvatar size="lg" isActive={true} />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            Send Us a <span className="text-gradient-gold">Message</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form below to send us a message. We'll respond within 24 hours.
          </DialogDescription>
          <p className="text-muted-foreground text-sm mt-2 text-center" aria-hidden="true">
            We'll respond within 24 hours
          </p>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-amber-500/20 to-yellow-500/20 flex items-center justify-center">
              <Send className="h-8 w-8 text-amber-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Message <span className="text-gradient-gold">Sent!</span>
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                We'll be in touch soon. Check your inbox for a confirmation.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Decorative divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Full Name */}
              <div>
                <Label htmlFor="contact-name" className="text-sm font-medium mb-1.5 block">
                  Full Name <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-name"
                  type="text"
                  placeholder="John Doe"
                  {...register("name")}
                  disabled={isSubmitting}
                  className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                  maxLength={100}
                />
                {errors.name && (
                  <p className="text-destructive text-xs mt-1">{errors.name.message}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <Label htmlFor="contact-email" className="text-sm font-medium mb-1.5 block">
                  Email Address <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="john@company.com"
                  {...register("email")}
                  disabled={isSubmitting}
                  className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                  maxLength={255}
                />
                {errors.email && (
                  <p className="text-destructive text-xs mt-1">{errors.email.message}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <Label htmlFor="contact-phone" className="text-sm font-medium mb-1.5 block">
                  Phone <span className="text-destructive">*</span>
                </Label>
                <PhoneInput
                  value={watch("phone") || ""}
                  onChange={(phone) => setValue("phone", phone)}
                  disabled={isSubmitting}
                  placeholder="Phone number"
                  defaultCountry="us"
                />
                {errors.phone && (
                  <p className="text-destructive text-xs mt-1">{errors.phone.message}</p>
                )}
              </div>

              {/* Message */}
              <div>
                <Label htmlFor="contact-message" className="text-sm font-medium mb-1.5 block">
                  Your Message <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="contact-message"
                  placeholder="Tell us about your project or how we can help..."
                  {...register("message")}
                  disabled={isSubmitting}
                  className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20 min-h-[100px] max-h-[150px] resize-y"
                  maxLength={1000}
                />
                <div className="flex justify-between items-center mt-1">
                  <p className="text-xs text-muted-foreground">{messageCharCount}/1000</p>
                  {messageCharCount > 900 && (
                    <p className={`text-xs ${messageCharCount > 980 ? 'text-destructive' : 'text-yellow-500'}`}>
                      {messageCharCount > 980 ? 'Limit reached' : 'Approaching limit'}
                    </p>
                  )}
                </div>
                {errors.message && (
                  <p className="text-destructive text-xs mt-1">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 font-semibold py-5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-accent-foreground/30 border-t-accent-foreground rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send className="w-4 h-4" />
                    Send Message
                  </span>
                )}
              </Button>

              {/* Privacy note */}
              <p className="text-xs text-muted-foreground text-center">
                By submitting, you agree to our{" "}
                <a href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</a>
                {" "}and{" "}
                <a href="/terms" className="text-amber-400 hover:underline">Terms of Service</a>.
              </p>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailContactDialog;
