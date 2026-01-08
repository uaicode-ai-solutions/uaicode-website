import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CalendarCheck, Clock, Mail, Sparkles } from "lucide-react";
import { useConfetti } from "@/hooks/useConfetti";
import { useEffect } from "react";

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
  const { fireConfetti } = useConfetti();

  useEffect(() => {
    if (open) {
      fireConfetti();
    }
  }, [open, fireConfetti]);

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
      <DialogContent className="sm:max-w-md border-accent/20 bg-gradient-to-b from-card to-background">
        <DialogHeader className="space-y-6 pt-4">
          {/* Animated Success Icon */}
          <div className="mx-auto relative">
            {/* Outer glow ring */}
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-accent to-accent/60 p-[2px] animate-pulse">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                <CalendarCheck className="w-10 h-10 text-accent" strokeWidth={2} />
              </div>
            </div>
            {/* Decorative sparkles */}
            <Sparkles className="w-5 h-5 text-accent absolute -top-1 -right-1 animate-pulse" />
            <Sparkles className="w-4 h-4 text-accent/70 absolute -bottom-1 -left-2 animate-pulse" style={{ animationDelay: '150ms' }} />
          </div>
          
          <div className="space-y-3 text-center">
            <DialogTitle className="text-2xl md:text-3xl font-bold">
              <span className="text-gradient-gold">Meeting</span> Scheduled!
            </DialogTitle>
            <DialogDescription className="text-base md:text-lg text-muted-foreground leading-relaxed">
              Your consultation has been successfully booked.
            </DialogDescription>
          </div>
        </DialogHeader>

        {/* Decorative divider */}
        <div className="flex items-center gap-4 my-2">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
        </div>

        {/* Booking Details with enhanced styling */}
        {hasDetails && (
          <div className="rounded-xl border border-accent/20 bg-card/50 p-4 space-y-4">
            {/* New York Time */}
            <div className="space-y-2">
              <p className="text-xs text-accent font-semibold uppercase tracking-wider">
                New York Time (EST/EDT)
              </p>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <CalendarCheck className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground font-medium">{nyDate}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Clock className="w-4 h-4 text-accent" />
                </div>
                <span className="text-foreground font-medium">{nyTime}</span>
              </div>
            </div>

            {/* Local Time */}
            {showLocalTime && (
              <>
                <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
                <div className="space-y-2">
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                    Your Local Time ({tzName})
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                      <CalendarCheck className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-foreground/80">{localDate}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-muted/50 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    </div>
                    <span className="text-foreground/80">{localTime}</span>
                  </div>
                </div>
              </>
            )}
          </div>
        )}

        {/* Email confirmation with enhanced styling */}
        <div className="flex items-start gap-3 p-4 rounded-xl border border-accent/10 bg-accent/5">
          <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
            <Mail className="w-4 h-4 text-accent" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A confirmation email has been sent to{" "}
            {bookingDetails?.email ? (
              <span className="text-accent font-medium">{bookingDetails.email}</span>
            ) : (
              "your inbox"
            )}{" "}
            with all the meeting details.
          </p>
        </div>

        <Button
          onClick={onClose}
          className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-lg shadow-[0_0_20px_hsl(var(--accent)/0.3)] hover:shadow-[0_0_30px_hsl(var(--accent)/0.5)] transition-all duration-300"
        >
          Got it!
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default BookingConfirmationDialog;
