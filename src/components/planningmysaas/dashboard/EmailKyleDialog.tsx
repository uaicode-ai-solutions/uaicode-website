import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Loader2, Sparkles } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { supabase } from "@/integrations/supabase/client";
import { useReportContext } from "@/contexts/ReportContext";
import { sanitizeFormData } from "@/lib/inputSanitization";
import KyleAvatar from "@/components/chat/KyleAvatar";

// Validation schema
const emailKyleSchema = z.object({
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
    .max(2000, "Message must be less than 2000 characters"),
});

type EmailKyleFormData = z.infer<typeof emailKyleSchema>;

interface EmailKyleDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EmailKyleDialog = ({ open, onOpenChange }: EmailKyleDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const { report, pmsReportId } = useReportContext();

  const form = useForm<EmailKyleFormData>({
    resolver: zodResolver(emailKyleSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
    },
  });

  const messageValue = form.watch("message");
  const messageCharCount = messageValue?.length || 0;

  const onSubmit = async (data: EmailKyleFormData) => {
    setIsSubmitting(true);
    try {
      const sanitizedData = sanitizeFormData(data);
      
      const { error } = await supabase.functions.invoke("pms-email-kyle", {
        body: {
          name: sanitizedData.name,
          email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          reportId: pmsReportId,
          projectName: report?.saas_name,
        },
      });

      if (error) {
        console.error("[EmailKyleDialog] Error sending email:", error);
        throw error;
      }

      setSubmitSuccess(true);
      form.reset();

      // Close dialog after showing success
      setTimeout(() => {
        setSubmitSuccess(false);
        onOpenChange(false);
      }, 2500);
    } catch (err) {
      console.error("[EmailKyleDialog] Failed to send:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSubmitSuccess(false);
      form.reset();
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-lg glass-card border-amber-500/20 shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="text-center pb-2">
          {/* Kyle Avatar with glow */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-amber-500/30 blur-xl rounded-full scale-110" />
              <KyleAvatar size="lg" />
              <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-400 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-yellow-400 animate-pulse" style={{ animationDelay: '0.5s' }} />
            </div>
          </div>

          <DialogTitle className="text-2xl font-bold text-center">
            Email <span className="text-gradient-gold">Kyle</span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Fill out the form below to send Kyle a message. He'll respond within 24 hours.
          </DialogDescription>
          <p className="text-muted-foreground text-sm mt-2 text-center" aria-hidden="true">
            I'll respond within 24 hours
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
                I'll be in touch soon. Check your inbox for a confirmation.
              </p>
            </div>
          </div>
        ) : (
          <>
            {/* Decorative divider */}
            <div className="flex items-center gap-4 py-2">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
            </div>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                {/* Full Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Full Name <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Doe"
                          {...field}
                          disabled={isSubmitting}
                          className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                          maxLength={100}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Email Address <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@company.com"
                          {...field}
                          disabled={isSubmitting}
                          className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20"
                          maxLength={255}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Phone */}
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Phone <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <PhoneInput
                          value={field.value}
                          onChange={field.onChange}
                          disabled={isSubmitting}
                          placeholder="Phone number"
                          defaultCountry="us"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Message <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell me about your project and what you're looking for..."
                          rows={4}
                          {...field}
                          disabled={isSubmitting}
                          className="bg-background/50 border-border/50 focus:border-amber-500/50 focus:ring-amber-500/20 resize-none"
                          maxLength={2000}
                        />
                      </FormControl>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-xs text-muted-foreground">{messageCharCount}/2000</p>
                        {messageCharCount > 1800 && (
                          <p className={`text-xs ${messageCharCount > 1950 ? 'text-destructive' : 'text-yellow-500'}`}>
                            {messageCharCount > 1950 ? 'Limit reached' : 'Approaching limit'}
                          </p>
                        )}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-600 hover:to-yellow-600 font-semibold py-5 shadow-lg shadow-amber-500/30 hover:shadow-amber-500/40 transition-all duration-300"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
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
            </Form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailKyleDialog;
