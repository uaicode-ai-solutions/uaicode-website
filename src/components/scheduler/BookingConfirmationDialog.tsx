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
          <div className="bg-muted/50 rounded-lg p-4 space-y-3 my-4">
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
