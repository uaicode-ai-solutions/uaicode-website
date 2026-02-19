import { useEffect, useState } from "react";
import Cal, { getCalApi } from "@calcom/embed-react";
import BookingConfirmationDialog from "@/components/scheduler/BookingConfirmationDialog";

interface BookingDetails {
  date?: string;
  time?: string;
  rawDate?: string;
  rawTime?: string;
  email?: string;
}

const Schedule = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  useEffect(() => {
    (async function () {
      const cal = await getCalApi({ namespace: "diagnostic-45min" });
      cal("ui", {
        theme: "dark",
        cssVarsPerTheme: {
          dark: { "cal-brand": "#FFC61A" },
          light: { "cal-brand": "#FFC61A" }
        },
        hideEventTypeDetails: false,
        layout: "month_view"
      });
    })();
  }, []);

  return (
    <section id="schedule" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl px-4">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            Book Your <span className="text-gradient-gold">Free Strategy Call</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            In 45 minutes, Rafael validates your SaaS idea live with AI — market analysis, competitors, viability score, and a personalized roadmap. No cost. No obligation.
          </p>
        </div>

        <div className="max-w-5xl mx-auto glass-card rounded-2xl overflow-hidden border border-accent/20 shadow-[0_0_40px_rgba(234,171,8,0.1)]">
          <div className="w-full h-[500px] md:h-[700px] overflow-auto">
            <Cal
              namespace="diagnostic-45min"
              calLink="uaicode-ai/diagnostic-45min"
              style={{ width: "100%", height: "100%", overflow: "scroll" }}
              config={{ layout: "month_view", theme: "dark" }}
            />
          </div>
          <p className="text-center text-sm text-muted-foreground py-4">
            Having trouble seeing the calendar?{" "}
            <a 
              href="https://cal.com/uaicode-ai/diagnostic-45min" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              Click here to open it in a new tab
            </a>
          </p>
        </div>
      </div>

      <BookingConfirmationDialog
        open={showConfirmation}
        onClose={() => setShowConfirmation(false)}
        bookingDetails={bookingDetails}
      />
    </section>
  );
};

export default Schedule;
