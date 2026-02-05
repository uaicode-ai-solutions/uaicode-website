import { useState } from "react";
import { Rocket, Calculator, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { Badge } from "./ui/badge";
import ReactCountryFlag from "react-country-flag";
import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import marcusChenImg from "@/assets/author-marcus.webp";
import robertoSilvaImg from "@/assets/testimonial-carlos-oliveira.webp?v=2";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import jamesWilsonImg from "@/assets/testimonial-john-smith.webp?v=2";

const SuccessCases = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    element?.scrollIntoView({ behavior: "smooth" });
  };

  const testimonials = [
    {
      name: "Sarah Mitchell",
      role: "CEO, Startup Innovate",
      company: "Startup Innovate",
      country: "USA",
      countryCode: "US",
      image: sarahJohnsonImg,
      testimonial: "UaiCode.ai transformed our complex idea into a revenue-generating MVP faster than we thought possible. Their AI-driven approach was game-changing!",
      result: "MVP launched in 6 weeks, Revenue positive in 2 months",
      industry: "MVP Success",
      details: "Challenge: Complex idea with tight timeline. Solution: AI-accelerated development process delivering a production-ready MVP with core features and scalable architecture."
    },
    {
      name: "Robert Taylor",
      role: "Founder, TechFlow Solutions",
      company: "TechFlow Solutions",
      country: "USA",
      countryCode: "US",
      image: marcusChenImg,
      testimonial: "The speed and quality were exceptional. We launched in 6 weeks and secured our first 100 customers within a month. Incredible ROI!",
      result: "6-week launch, 100 customers in first month",
      industry: "Startup Launch",
      details: "Challenge: Need to validate market fit quickly. Solution: Rapid MVP development with user-centric design and integrated analytics for real-time feedback."
    },
    {
      name: "Emily Rodriguez",
      role: "Product Director, CloudScale",
      company: "CloudScale",
      country: "USA",
      countryCode: "US",
      image: emmaThompsonImg,
      testimonial: "Working with UaiCode.ai felt like having an entire tech team at our disposal. They understood our vision and made it reality with precision.",
      result: "Full-stack MVP, 95% client satisfaction",
      industry: "Product Launch",
      details: "Challenge: Limited technical resources and ambitious vision. Solution: Comprehensive MVP with modern tech stack, intuitive UX, and enterprise-grade features."
    },
    {
      name: "David Park",
      role: "CTO, DataSync Pro",
      company: "DataSync Pro",
      country: "USA",
      countryCode: "US",
      image: jamesWilsonImg,
      testimonial: "From concept to launch in 40 days. The AI integration they built for us has become our competitive advantage in the market.",
      result: "40-day MVP, Competitive AI features",
      industry: "Tech Innovation",
      details: "Challenge: Need AI-powered features to differentiate in crowded market. Solution: Custom AI integration with smart automation, delivering unique value proposition and market edge."
    },
  ];

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="success-cases" className="py-24 px-4 bg-black">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">Real Results, <span className="text-gradient-gold">Real Impact</span></h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Hear from clients who've transformed their ideas into thriving businesses
          </p>
        </div>

        <div className="max-w-4xl mx-auto mb-16">
          <div className="glass-card p-8 md:p-12 rounded-2xl relative border border-accent/20 shadow-[0_0_40px_rgba(234,171,8,0.1)]">
            <div className="flex justify-between items-start mb-4">
              <Quote className="w-12 h-12 md:w-16 md:h-16 text-accent/30" />
              <Badge className="bg-accent/20 text-accent border-accent/30">
                {testimonials[currentIndex].industry}
              </Badge>
            </div>
            
            <div className="relative z-10 animate-fade-in-up" key={currentIndex}>
              <p className="text-xl md:text-2xl font-medium mb-6 leading-relaxed italic">
                "{testimonials[currentIndex].testimonial}"
              </p>
              
              <div className="flex items-start justify-between flex-wrap gap-4 mb-6">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 md:w-20 md:h-20 border-2 border-accent/40 shadow-[0_0_20px_rgba(234,171,8,0.2)]">
                    <AvatarImage 
                      src={testimonials[currentIndex].image} 
                      alt={testimonials[currentIndex].name}
                      loading="lazy"
                    />
                    <AvatarFallback className="bg-accent/20 text-accent text-xl font-bold">
                      {testimonials[currentIndex].name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-xl">{testimonials[currentIndex].name}</span>
                      <ReactCountryFlag
                        countryCode={testimonials[currentIndex].countryCode}
                        svg
                        style={{
                          width: '1.5em',
                          height: '1.5em',
                        }}
                        title={testimonials[currentIndex].country}
                      />
                    </div>
                    <p className="text-muted-foreground">{testimonials[currentIndex].role}</p>
                    <p className="text-sm text-muted-foreground/70">{testimonials[currentIndex].company}</p>
                  </div>
                </div>
                
                <div className="text-accent font-semibold bg-accent/10 px-4 py-3 rounded-lg flex flex-col gap-1 text-sm md:text-base">
                  {testimonials[currentIndex].result.split(', ').map((benefit, idx) => (
                    <div key={idx}>{benefit}</div>
                  ))}
                </div>
              </div>

              <div className="border-t border-accent/20 pt-6">
                <p className="text-muted-foreground leading-relaxed">
                  {testimonials[currentIndex].details}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={prev}
                className="rounded-full border-accent/30 hover:bg-accent/20"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>

              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      index === currentIndex
                        ? "bg-accent w-8"
                        : "bg-muted-foreground/30"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={next}
                className="rounded-full border-accent/30 hover:bg-accent/20"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg"
            onClick={() => scrollToSection("schedule")}
            className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold text-lg px-8 py-6 glow-white"
          >
            <Calculator className="w-5 h-5 mr-2" />
            Get MVP Pricing
          </Button>
          <Button 
            size="lg"
            variant="outline"
            onClick={() => scrollToSection("schedule")}
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground font-semibold text-lg px-8 py-6 transition-all duration-300"
          >
            <Rocket className="w-5 h-5 mr-1.5" />
            Launch Your MVP
          </Button>
        </div>
      </div>
    </section>
  );
};

export default SuccessCases;
