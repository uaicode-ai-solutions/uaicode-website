import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { PhoneInput } from "@/components/ui/phone-input";
import { ArrowRight, Shield, Sparkles, Users } from "lucide-react";
import { WizardData } from "@/pages/Planning";

const formSchema = z.object({
  fullName: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  companyName: z.string().min(2, "Please enter your company name"),
});

interface Step1Props {
  data: WizardData;
  updateData: (data: Partial<WizardData>) => void;
  onNext: (stepData?: Partial<WizardData>) => void;
}

const Step1LeadCapture = ({ data, updateData, onNext }: Step1Props) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
    },
  });

  useEffect(() => {
    form.reset({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      companyName: data.companyName,
    });
  }, [data.fullName, data.email, data.phone, data.companyName, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    updateData(values);
    onNext(values);
  };

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground">
          Unlock Your <span className="text-accent">SaaS Potential</span> in 5 Minutes
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Get a comprehensive feasibility study tailored to your idea. Our AI-powered analysis will help you understand your market opportunity.
        </p>
      </div>

      {/* Benefits */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {[
          "Market analysis and competitive landscape",
          "Technical feasibility assessment",
          "Financial projections and ROI estimates",
          "Personalized development recommendations",
        ].map((benefit, index) => (
          <div key={index} className="flex items-center gap-3 text-muted-foreground">
            <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-3 h-3 text-accent" />
            </div>
            <span className="text-sm">{benefit}</span>
          </div>
        ))}
      </div>

      {/* Form */}
      <div className="bg-card border border-border rounded-2xl p-6 md:p-8 max-w-xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name" {...field} />
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
                  <FormLabel>Email Address *</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="your.email@company.com" {...field} />
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
                  <FormLabel>Phone Number *</FormLabel>
                  <FormControl>
                    <PhoneInput
                      value={field.value}
                      onChange={field.onChange}
                      defaultCountry="us"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="companyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company Name *</FormLabel>
                  <FormControl>
                    <Input placeholder="Your company or startup name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              Continue
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>
        </Form>
      </div>

      {/* Trust Indicators */}
      <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-accent" />
          <span>Used by 500+ entrepreneurs</span>
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent" />
          <span>Powered by AI technology</span>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-accent" />
          <span>Your data is 100% secure</span>
        </div>
      </div>
    </div>
  );
};

export default Step1LeadCapture;
