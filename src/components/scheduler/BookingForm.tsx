import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, ArrowLeft } from "lucide-react";
import { useState } from "react";

const bookingSchema = z.object({
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
      (val) => !val || /^[\d\s\-\+\(\)]+$/.test(val),
      "Phone number can only contain numbers, spaces, and symbols like +, -, (, )"
    )
    .refine(
      (val) => !val || val.replace(/\D/g, '').length >= 10,
      "Phone number must be at least 10 digits"
    ),
  
  company: z.string()
    .trim()
    .max(100, "Company name must be less than 100 characters")
    .optional()
    .or(z.literal("")),
  
  notes: z.string()
    .trim()
    .max(1000, "Notes must be less than 1000 characters")
    .optional()
    .or(z.literal("")),
});

export type BookingFormData = z.infer<typeof bookingSchema>;

interface BookingFormProps {
  selectedDate: Date;
  selectedTime: string;
  onSubmit: (data: BookingFormData) => Promise<void>;
  onBack: () => void;
  isSubmitting: boolean;
}

export const BookingForm = ({
  selectedDate,
  selectedTime,
  onSubmit,
  onBack,
  isSubmitting,
}: BookingFormProps) => {
  const [notesCount, setNotesCount] = useState(0);
  const [companyCount, setCompanyCount] = useState(0);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
  });

  // Watch fields for character counting
  const notes = watch("notes");
  const company = watch("company");

  // Update character counts
  useState(() => {
    setNotesCount(notes?.length || 0);
    setCompanyCount(company?.length || 0);
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">Enter Your Details</h3>
        <p className="text-sm text-muted-foreground">
          We'll use this information to send you the meeting link
        </p>
      </div>

      {/* Form Fields */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name" className="text-sm md:text-base">Full Name *</Label>
            <p className="text-xs text-muted-foreground mb-1.5">Enter your first and last name</p>
            <Input
              id="name"
              {...register("name")}
              placeholder="John Doe"
              className="mt-1.5"
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
            <Label htmlFor="company" className="text-sm md:text-base">Company Name</Label>
            <Input
              id="company"
              {...register("company", {
                onChange: (e) => setCompanyCount(e.target.value.length)
              })}
              placeholder="Your Company"
              className="mt-1.5"
              maxLength={100}
            />
            <p className="text-xs text-muted-foreground mt-1">{companyCount}/100 characters</p>
          </div>
        </div>

        <div>
          <Label htmlFor="email" className="text-sm md:text-base">Email Address *</Label>
          <p className="text-xs text-muted-foreground mb-1.5">We'll send your meeting link here</p>
          <Input
            id="email"
            type="email"
            {...register("email")}
            placeholder="john@company.com"
            className="mt-1.5"
            maxLength={255}
          />
          {errors.email && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="phone" className="text-sm md:text-base">Phone Number</Label>
          <p className="text-xs text-muted-foreground mb-1.5">Include country code (e.g., +1 555 123-4567)</p>
          <Input
            id="phone"
            type="tel"
            {...register("phone")}
            placeholder="+1 (555) 123-4567"
            className="mt-1.5"
            maxLength={20}
            pattern="[\d\s\-\+\(\)]+"
            title="Phone number format: +1 (555) 123-4567"
          />
          {errors.phone && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.phone.message}</p>
          )}
        </div>


        <div>
          <Label htmlFor="notes" className="text-sm md:text-base">Additional Notes</Label>
          <Textarea
            id="notes"
            {...register("notes", {
              onChange: (e) => setNotesCount(e.target.value.length)
            })}
            placeholder="Tell us about your business needs..."
            className="mt-1.5 min-h-[100px]"
            maxLength={1000}
          />
          <div className="flex justify-between items-center mt-1">
            <p className="text-xs text-muted-foreground">{notesCount}/1000 characters</p>
            {notesCount > 900 && (
              <p className={`text-xs ${notesCount > 980 ? 'text-destructive' : 'text-yellow-500'}`}>
                {notesCount > 980 ? 'Character limit reached' : 'Approaching character limit'}
              </p>
            )}
          </div>
          {errors.notes && (
            <p className="text-red-500 text-xs md:text-sm mt-1">{errors.notes.message}</p>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-between items-center pt-4 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          size="lg"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Button
          type="submit"
          disabled={isSubmitting}
          size="lg"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Confirming Booking...
            </>
          ) : (
            'Confirm Booking'
          )}
        </Button>
      </div>
    </form>
  );
};
