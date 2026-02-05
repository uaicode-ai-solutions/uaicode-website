import { useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Challenges from "@/components/Challenges";
import Deliveries from "@/components/Deliveries";
import HowItWorks from "@/components/HowItWorks";
import SuccessCases from "@/components/SuccessCases";
import PMSShowcase from "@/components/PMSShowcase";
import About from "@/components/About";
import Tools from "@/components/Tools";
import PricingTransparency from "@/components/PricingTransparency";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import MeetEve from "@/components/MeetEve";
import MeetTheFounder from "@/components/MeetTheFounder";
import { BackToTopButton } from "@/components/blog/BackToTopButton";

const Index = () => {
  useEffect(() => {
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-fade-in-up");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("section").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main>
        <Hero />
        <Challenges />
        <HowItWorks />
        <Deliveries />
        <SuccessCases />
        <PMSShowcase />
        <About />
        <Tools />
        <PricingTransparency />
        <FAQ />
        <MeetEve />
        <MeetTheFounder />
      </main>
      <Footer />
      <BackToTopButton />
    </div>
  );
};

export default Index;
