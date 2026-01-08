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
  const hasDetails = bookingDetails?.date || bookingDetails?.time;

  // Calculate local timezone equivalent
  const getLocalTimeDetails = () => {
    if (!bookingDetails?.rawDate || !bookingDetails?.rawTime) return null;
    
    // Create a date string and parse it as NY time
    const nyDateTimeString = `${bookingDetails.rawDate}T${bookingDetails.rawTime}:00`;
    
    // Create date object - we need to interpret this as NY time
    // Use Intl.DateTimeFormat to get the offset for NY at that date
    const tempDate = new Date(nyDateTimeString);
    const nyFormatter = new Intl.DateTimeFormat('en-US', {
      timeZone: 'America/New_York',
      timeZoneName: 'shortOffset'
    });
    const nyParts = nyFormatter.formatToParts(tempDate);
    const offsetPart = nyParts.find(p => p.type === 'timeZoneName')?.value || 'GMT-5';
    
    // Parse offset (e.g., "GMT-5" or "GMT-4")
    const offsetMatch = offsetPart.match(/GMT([+-]?\d+)/);
    const nyOffset = offsetMatch ? parseInt(offsetMatch[1]) : -5;
    
    // Create date with NY timezone offset
    const nyDate = new Date(`${nyDateTimeString}${nyOffset >= 0 ? '+' : ''}${String(nyOffset).padStart(2, '0')}:00`);
    
    // Get user's timezone
    const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    
    // Format in user's local timezone
    const localFormattedDate = nyDate.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: userTimezone
    });
    
    const localFormattedTime = nyDate.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: userTimezone
    });
    
    // Get friendly timezone name
    const tzName = userTimezone.split('/').pop()?.replace(/_/g, ' ') || userTimezone;
    
    return {
      date: localFormattedDate,
      time: localFormattedTime,
      timezone: tzName
    };
  };

  const localDetails = getLocalTimeDetails();
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const showLocalTime = localDetails && userTimezone !== 'America/New_York';

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
              {bookingDetails?.date && (
                <div className="flex items-center gap-3">
                  <CalendarCheck className="w-5 h-5 text-accent" />
                  <span className="text-foreground">{bookingDetails.date}</span>
                </div>
              )}
              {bookingDetails?.time && (
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-accent" />
                  <span className="text-foreground">{bookingDetails.time}</span>
                </div>
              )}
            </div>

            {/* User's Local Time */}
            {showLocalTime && localDetails && (
              <>
                <div className="border-t border-border" />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
                    Your Local Time ({localDetails.timezone})
                  </p>
                  <div className="flex items-center gap-3">
                    <CalendarCheck className="w-5 h-5 text-accent/70" />
                    <span className="text-foreground/80">{localDetails.date}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-accent/70" />
                    <span className="text-foreground/80">{localDetails.time}</span>
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
