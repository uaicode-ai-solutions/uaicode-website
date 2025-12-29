import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface TimeSlotPickerProps {
  selectedDate: Date;
  selectedTime: string | null;
  availableSlots: string[];
  bookedSlots: string[];
  onSelectTime: (time: string) => void;
  onBack: () => void;
}

export const TimeSlotPicker = ({
  selectedDate,
  selectedTime,
  availableSlots,
  bookedSlots,
  onSelectTime,
  onBack,
}: TimeSlotPickerProps) => {
  return (
    <div className="space-y-4 md:space-y-6">
      <div>
        <h3 className="font-semibold text-lg md:text-xl mb-2">Select Time Slot</h3>
        <p className="text-sm md:text-base text-muted-foreground">
          {selectedDate.toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 md:gap-3">
        {availableSlots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedTime === slot;

          return (
            <Button
              key={slot}
              variant={isSelected ? "default" : "outline"}
              disabled={isBooked}
              onClick={() => onSelectTime(slot)}
              className={cn(
                "h-12 md:h-14 text-sm md:text-base",
                isBooked && "opacity-50 cursor-not-allowed"
              )}
            >
              <Clock className="mr-1.5 h-3 w-3 md:h-4 md:w-4" />
              {slot}
            </Button>
          );
        })}
      </div>

      {availableSlots.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p className="text-sm md:text-base">No available time slots for this date.</p>
          <p className="text-xs md:text-sm mt-2">Please select another date.</p>
        </div>
      )}

      <Button
        variant="outline"
        onClick={onBack}
        className="w-full sm:w-auto"
      >
        Back to Calendar
      </Button>
    </div>
  );
};
