export type DemoScenario = 'jewelry' | 'tech' | 'supplements';

export const demoScenarios = {
  jewelry: {
    name: "Elegant Jewels",
    type: "Luxury Jewelry Boutique",
    description: "Try our AI with a realistic luxury jewelry shopping experience",
    icon: "💎"
  },
  tech: {
    name: "TechHub Pro",
    type: "Premium Tech Gadgets Store",
    description: "Experience AI-powered tech product recommendations",
    icon: "🎮"
  },
  supplements: {
    name: "VitalLife Wellness",
    type: "Organic Supplements Store",
    description: "See how AI helps customers find the right wellness products",
    icon: "🌿"
  }
};

export const sampleQuestions = {
  jewelry: [
    "What diamond rings do you have under $5,000?",
    "I need a gift for my wife's anniversary",
    "Do you offer custom engraving?",
    "Show me your most popular engagement rings",
    "What's your return policy?"
  ],
  tech: [
    "What wireless earbuds do you recommend under $150?",
    "I need a gaming keyboard with RGB lighting",
    "Compare your top smartwatches",
    "Do you have drones for beginners?",
    "What's your warranty and return policy?"
  ],
  supplements: [
    "I need something to boost my immune system",
    "What protein powder do you recommend for muscle gain?",
    "Do you have organic multivitamins?",
    "I'm looking for sleep support supplements",
    "Are your products third-party tested?"
  ]
};

export const demoWelcomeMessages = {
  jewelry: `Welcome to Elegant Jewels! 💎

I'm your personal jewelry consultant. I can help you find the perfect piece for any occasion - whether it's an engagement ring, anniversary gift, or something special for yourself.

What are you looking for today?`,

  tech: `Welcome to TechHub Pro! 🎮

I'm your tech expert assistant. Whether you're looking for gaming gear, smart home devices, or the latest gadgets, I can help you find exactly what you need.

What tech are you interested in today?`,

  supplements: `Welcome to VitalLife Wellness! 🌿

I'm your wellness consultant. I can help you find the right supplements for your health goals - whether it's immunity, energy, fitness, or overall wellness.

What are your wellness goals?`
};
