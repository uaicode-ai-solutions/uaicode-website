import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Mail, Sparkles, Send } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PhoneInput } from "@/components/ui/phone-input";
import { toast } from "@/hooks/use-toast";
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
}

export const EmailContactDialog: React.FC<EmailContactDialogProps> = ({ open, onOpenChange }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          source: 'email_contact_popup',
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      toast({
        title: "Message Sent! ✨",
        description: "We'll get back to you within 24 hours.",
      });

      reset();
      onOpenChange(false);
    } catch (error) {
      console.error("Email contact form error:", error);
      toast({
        title: "Unable to Send",
        description: error instanceof Error ? error.message : "There was an error sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      reset();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-lg bg-gradient-to-b from-card via-card to-background border-accent/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          {/* Icon with glow effect */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-accent/30 blur-xl rounded-full" />
              <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 border border-accent/30 flex items-center justify-center">
                <Mail className="w-10 h-10 text-accent" />
              </div>
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-accent animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-accent/70 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            Send Us a <span className="text-gradient-gold">Message</span>
          </DialogTitle>
          <p className="text-muted-foreground text-sm mt-2 text-center">
            We'll respond within 24 hours
          </p>
        </DialogHeader>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 py-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
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
              className="bg-background/50 border-border/50 focus:border-accent/50"
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
              className="bg-background/50 border-border/50 focus:border-accent/50"
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
              className="bg-background/50 border-border/50 focus:border-accent/50 min-h-[100px] max-h-[150px] resize-y"
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
            className="w-full bg-accent text-accent-foreground hover:bg-accent/90 font-semibold py-5 shadow-lg shadow-accent/20 hover:shadow-accent/30 transition-all duration-300"
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
            <a href="/privacy" className="text-accent hover:underline">Privacy Policy</a>
            {" "}and{" "}
            <a href="/terms" className="text-accent hover:underline">Terms of Service</a>.
          </p>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EmailContactDialog;
