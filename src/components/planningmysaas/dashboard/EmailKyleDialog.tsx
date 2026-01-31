import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Send, Loader2 } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import { useReportContext } from "@/contexts/ReportContext";
import kyleAvatarImg from "@/assets/kyle-avatar.webp";

// Validation schema
const emailKyleSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name must be less than 100 characters"),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email must be less than 255 characters"),
  phone: z
    .string()
    .trim()
    .max(30, "Phone must be less than 30 characters")
    .optional()
    .or(z.literal("")),
  message: z
    .string()
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

  const onSubmit = async (data: EmailKyleFormData) => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke("pms-email-kyle", {
        body: {
          name: data.name,
          email: data.email,
          phone: data.phone || undefined,
          message: data.message,
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
      <DialogContent className="sm:max-w-md bg-card border-border/50">
        <DialogHeader className="text-center pb-2">
          {/* Kyle Avatar */}
          <div className="flex justify-center mb-4">
            <div className="relative">
              <Avatar className="h-20 w-20 border-2 border-accent/50 shadow-lg shadow-accent/20">
                <AvatarImage src={kyleAvatarImg} alt="Kyle - Sales Consultant" />
                <AvatarFallback className="bg-accent/20 text-accent text-xl font-bold">
                  K
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-br from-amber-500 to-yellow-500 shadow-lg border-2 border-background">
                <Mail className="h-3 w-3 text-black" />
              </div>
            </div>
          </div>

          <DialogTitle className="text-xl font-bold text-foreground">
            Email Kyle
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Send me a message and I'll get back to you within 24 hours
          </DialogDescription>
        </DialogHeader>

        {submitSuccess ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center">
              <Send className="h-8 w-8 text-accent" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                Message Sent!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                I'll be in touch soon. Check your inbox for a confirmation.
              </p>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Your name"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="you@example.com"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Phone <span className="text-muted-foreground">(optional)</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+1 (555) 123-4567"
                        {...field}
                        className="bg-background/50"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Tell me about your project and what you're looking for..."
                        rows={4}
                        {...field}
                        className="bg-background/50 resize-none"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-accent to-accent/80 text-accent-foreground font-semibold hover:opacity-90"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
              </Button>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EmailKyleDialog;
