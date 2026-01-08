import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, Mail } from "lucide-react";

interface BookingDetails {
  date?: string;
  time?: string;
  rawDate?: string;
  rawTime?: string;
  email?: string;
}

interface BookingConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails | null;
}

const BookingConfirmationDialog = ({
  open,
  onClose,
  bookingDetails,
}: BookingConfirmationDialogProps) => {
  

  // Create a proper Date object from NY time
  const getNyInstantDate = () => {
    if (!bookingDetails?.rawDate || !bookingDetails?.rawTime) return null;
    
    // Parse the date parts
    const [year, month, day] = bookingDetails.rawDate.split('-').map(Number);
    const [hour, minute] = bookingDetails.rawTime.split(':').map(Number);
    
    // Create a probe date at noon UTC to determine NY offset for that day
    const probeDate = new Date(Date.UTC(year, month - 1, day, 12, 0, 0));
    
    // Get NY offset using Intl
    const nyFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'shortOffset'
    });
    const parts = nyFormatter.formatToParts(probeDate);
    const offsetPart = parts.find(p => p.type === 'timeZoneName')?.value || 'GMT-5';
    
    // Parse offset (e.g., "GMT-5" or "GMT-4")
    const offsetMatch = offsetPart.match(/GMT([+-]?\d+)/);
    const nyOffsetHours = offsetMatch ? parseInt(offsetMatch[1]) : -5;
    
    // Build proper ISO string with correct offset format
    const sign = nyOffsetHours >= 0 ? '+' : '-';
    const absOffset = Math.abs(nyOffsetHours);
    const offsetStr = `${sign}${String(absOffset).padStart(2, '0')}:00`;
    const isoString = `${bookingDetails.rawDate}T${bookingDetails.rawTime}:00${offsetStr}`;
    
    const date = new Date(isoString);
    return isNaN(date.getTime()) ? null : date;
  };

  const nyInstant = getNyInstantDate();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const showLocalTime = nyInstant && userTimezone !== 'America/New_York';

  // Format dates from the instant
  const nyDate = nyInstant?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'America/New_York'
  });
  
  const nyTime = nyInstant?.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: 'America/New_York'
  });

  const localDate = nyInstant?.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: userTimezone
  });
  
  const localTime = nyInstant?.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
    timeZone: userTimezone
  });
  
  const tzName = userTimezone.split('/').pop()?.replace(/_/g, ' ') || userTimezone;

  const hasDetails = nyInstant !== null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
            <CalendarCheck className="w-8 h-8 text-green-500" />
          </div>
          <DialogTitle className="text-2xl font-bold text-center">
            Meeting Scheduled! 🎉
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground">
            Your consultation has been successfully booked.
          </DialogDescription>
        </DialogHeader>

        {hasDetails && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-4 my-4">
            {/* New York Time (Primary) */}
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                New York Time (EST/EDT)
              </p>
              <div className="flex items-center gap-3">
                <CalendarCheck className="w-5 h-5 text-accent" />
                <span className="text-foreground">{nyDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-foreground">{nyTime}</span>
              </div>
            </div>

            {/* User's Local Time */}
            {showLocalTime && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Your Local Time ({tzName})
                  </p>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-accent/70" />
                    <span className="text-foreground/80">{localDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent/70" />
                    <span className="text-foreground/80">{localTime}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        <div className="flex items-start gap-3 p-4 bg-accent/10 rounded-lg">
          <Mail className="w-5 h-5 text-accent mt-0.5" />
          <p className="text-sm text-muted-foreground">
            A confirmation email has been sent to{" "}
            {bookingDetails?.email ? (
              <span className="text-foreground font-medium">{bookingDetails.email}</span>
            ) : (
              "your inbox"
            )}{" "}
            with all the meeting details.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full mt-4 bg-accent text-accent-foreground hover:bg-accent/90"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
