import { Star, Quote } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

import sarahJohnsonImg from "@/assets/testimonial-sarah-johnson.webp";
import marcusChenImg from "@/assets/author-marcus.webp";
import emmaThompsonImg from "@/assets/testimonial-emma-thompson.webp";
import johnSmithImg from "@/assets/testimonial-john-smith.webp";

const testimonials = [
  {
    name: "Sarah Mitchell",
    role: "CEO, Startup Innovate",
    image: sarahJohnsonImg,
    rating: 5,
    text: "I was skeptical at first, but the validation report saved me from building a product no one wanted. The market analysis was spot-on!",
  },
  {
    name: "Robert Taylor",
    role: "Founder, TechFlow Solutions",
    image: marcusChenImg,
    rating: 5,
    text: "The brand kit alone was worth the price. Got a professional logo and mockups in minutes instead of weeks with a designer.",
  },
  {
    name: "Emily Rodriguez",
    role: "Product Director, CloudScale",
    image: emmaThompsonImg,
    rating: 5,
    text: "Finally, a tool that gives real data, not just generic advice. Used the competitor analysis to find our unique positioning.",
  },
  {
    name: "David Park",
    role: "CTO, DataSync Pro",
    image: johnSmithImg,
    rating: 5,
    text: "From idea to validated concept in under an hour. The ROI on this was incredible — saved me months of research.",
  },
];

const PmsTestimonials = () => {
  return (
    <section className="py-24 px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-muted/20" />
      <div className="absolute inset-0 mesh-gradient opacity-20" />
      
      {/* Top Border */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium border border-accent/30 mb-6">
            <Star className="w-4 h-4 text-accent fill-accent" />
            <span className="text-sm font-medium text-accent">Testimonials</span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Loved by <span className="text-gradient-gold">Founders</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of founders who validated their ideas and launched with confidence.
          </p>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="group relative glass-card rounded-2xl p-6 border border-border/50 hover:border-accent/40 transition-all duration-500"
            >
              {/* Quote Icon */}
              <Quote className="w-8 h-8 text-accent/20 mb-4" />
              
              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                ))}
              </div>
              
              {/* Text */}
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                "{testimonial.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name}
                  className="w-10 h-10 rounded-full object-cover border border-accent/20"
                />
                <div>
                  <div className="font-semibold text-foreground text-sm">
                    {testimonial.name}
                  </div>
                  <div className="text-muted-foreground text-xs">
                    {testimonial.role}
                  </div>
                </div>
              </div>
              
              {/* Hover Glow */}
              <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-accent/10 rounded-full blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
            </div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden">
          <Carousel className="w-full">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index}>
                  <div className="glass-card rounded-2xl p-6 border border-border/50">
                    <Quote className="w-8 h-8 text-accent/20 mb-4" />
                    
                    <div className="flex gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-accent fill-accent" />
                      ))}
                    </div>
                    
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      "{testimonial.text}"
                    </p>
                    
                    <div className="flex items-center gap-3">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover border border-accent/20"
                      />
                      <div>
                        <div className="font-semibold text-foreground text-sm">
                          {testimonial.name}
                        </div>
                        <div className="text-muted-foreground text-xs">
                          {testimonial.role}
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2" />
            <CarouselNext className="right-2" />
          </Carousel>
        </div>

        {/* Stats */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 md:gap-16">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient-gold">2,500+</div>
            <div className="text-muted-foreground text-sm">Ideas Validated</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient-gold">4.9/5</div>
            <div className="text-muted-foreground text-sm">Average Rating</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-gradient-gold">98%</div>
            <div className="text-muted-foreground text-sm">Would Recommend</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PmsTestimonials;
