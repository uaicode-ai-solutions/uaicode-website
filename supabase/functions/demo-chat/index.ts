import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const jewelryProducts = [
  {
    id: "ring-001",
    name: "Classic Solitaire Diamond Ring",
    price: 3499,
    description: "1-carat round diamond in 14K white gold",
    features: ["GIA certified", "Free sizing", "Lifetime warranty"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "ring-002",
    name: "Emerald Cut Engagement Ring",
    price: 5999,
    description: "1.5-carat emerald cut diamond in platinum",
    features: ["Custom engraving", "Complimentary appraisal"],
    inStock: true,
    shippingTime: "3-5 days"
  },
  {
    id: "ring-003",
    name: "Rose Gold Halo Ring",
    price: 2899,
    description: "0.75-carat center stone with halo setting",
    features: ["Rose gold finish", "Resizing included"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "necklace-001",
    name: "Diamond Tennis Necklace",
    price: 4299,
    description: "18-inch chain with brilliant-cut diamonds",
    features: ["14K white gold", "30-day returns"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "necklace-002",
    name: "Gold Heart Pendant",
    price: 899,
    description: "Elegant heart pendant in 18K gold",
    features: ["Adjustable chain", "Gift box included"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "bracelet-001",
    name: "Custom Name Bracelet",
    price: 699,
    description: "Personalized sterling silver bracelet",
    features: ["Free engraving", "Hypoallergenic"],
    inStock: true,
    shippingTime: "5-7 days"
  },
  {
    id: "earrings-001",
    name: "Diamond Stud Earrings",
    price: 1899,
    description: "0.5-carat total weight in 14K white gold",
    features: ["Push-back closure", "GIA certified"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "ring-004",
    name: "Vintage Art Deco Ring",
    price: 7499,
    description: "Rare 2-carat diamond in vintage setting",
    features: ["1920s style", "Certificate included"],
    inStock: false,
    shippingTime: "3-4 weeks"
  }
];

const techProducts = [
  {
    id: "earbuds-001",
    name: "ProSound Elite Wireless Earbuds",
    price: 129,
    description: "Active noise cancellation with 30-hour battery life",
    features: ["ANC", "Wireless charging", "IPX7 waterproof"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "watch-001",
    name: "SmartFit Pro Watch",
    price: 299,
    description: "Advanced health tracking with AMOLED display",
    features: ["Heart rate monitor", "GPS", "7-day battery"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "keyboard-001",
    name: "MechaRGB Gaming Keyboard",
    price: 179,
    description: "Mechanical keys with customizable RGB lighting",
    features: ["Cherry MX switches", "Programmable macros", "USB passthrough"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "drone-001",
    name: "SkyView Beginner Drone",
    price: 249,
    description: "4K camera drone with obstacle avoidance",
    features: ["Auto-hover", "GPS return home", "20-min flight time"],
    inStock: true,
    shippingTime: "3-5 days"
  },
  {
    id: "charger-001",
    name: "PowerBoost 100W Fast Charger",
    price: 59,
    description: "Multi-device charging station with USB-C PD",
    features: ["4 ports", "Foldable plug", "Surge protection"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "mouse-001",
    name: "Precision Gaming Mouse",
    price: 89,
    description: "Ultra-lightweight with 20K DPI sensor",
    features: ["Programmable buttons", "RGB lighting", "Wireless/wired"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "speaker-001",
    name: "BoomBox Pro Bluetooth Speaker",
    price: 149,
    description: "360° sound with 24-hour battery life",
    features: ["Waterproof", "Voice assistant", "Party mode"],
    inStock: false,
    shippingTime: "2-3 weeks"
  },
  {
    id: "tablet-001",
    name: "DrawPro Digital Tablet",
    price: 399,
    description: "11-inch screen for artists and designers",
    features: ["8192 pressure levels", "Tilt support", "Wireless"],
    inStock: true,
    shippingTime: "2-3 days"
  }
];

const supplementProducts = [
  {
    id: "immune-001",
    name: "ImmunityMax Defense Plus",
    price: 39,
    description: "Vitamin C, D3, Zinc, and Elderberry complex",
    features: ["Third-party tested", "Non-GMO", "90-day supply"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "protein-001",
    name: "WheyPro Isolate Powder",
    price: 54,
    description: "25g protein per serving, chocolate flavor",
    features: ["Grass-fed whey", "No artificial sweeteners", "30 servings"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "multi-001",
    name: "Organic Complete Multivitamin",
    price: 32,
    description: "Whole-food based daily multivitamin",
    features: ["USDA Organic", "Vegan", "60-day supply"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "sleep-001",
    name: "RestEasy Sleep Support",
    price: 28,
    description: "Magnesium, L-theanine, and melatonin blend",
    features: ["Non-habit forming", "Sugar-free", "60 capsules"],
    inStock: true,
    shippingTime: "1-2 days"
  },
  {
    id: "omega-001",
    name: "OmegaPure Fish Oil",
    price: 45,
    description: "Triple-strength EPA & DHA omega-3",
    features: ["Molecularly distilled", "No fishy aftertaste", "90 softgels"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "collagen-001",
    name: "BeautyGlow Collagen Peptides",
    price: 49,
    description: "Grass-fed collagen for skin, hair & nails",
    features: ["Unflavored", "Dissolves easily", "30 servings"],
    inStock: true,
    shippingTime: "2-3 days"
  },
  {
    id: "probiotic-001",
    name: "GutHealth Pro-50 Billion",
    price: 38,
    description: "15 probiotic strains for digestive health",
    features: ["Shelf-stable", "Delayed-release", "60 capsules"],
    inStock: false,
    shippingTime: "1-2 weeks"
  },
  {
    id: "energy-001",
    name: "VitalEnergy B-Complex",
    price: 24,
    description: "High-potency B vitamins for natural energy",
    features: ["Methylated forms", "Gluten-free", "90 tablets"],
    inStock: true,
    shippingTime: "1-2 days"
  }
];

const getSystemPrompt = (scenario: string, products: any[]) => {
  const scenarioConfig: Record<string, any> = {
    jewelry: {
      businessName: "Elegant Jewels",
      businessType: "luxury jewelry boutique",
      role: "Help customers find the perfect jewelry based on their needs",
      clarifications: "budget, preferences, and occasion",
      style: "Friendly, sophisticated, and professional",
      emojis: "💎, ⭐, ✨",
      customOptions: "custom engraving and sizing"
    },
    tech: {
      businessName: "TechHub Pro",
      businessType: "premium tech gadgets store",
      role: "Help customers find the perfect tech products for their needs",
      clarifications: "budget, use case, and technical requirements",
      style: "Enthusiastic, knowledgeable, and helpful",
      emojis: "🎮, 💻, ⚡",
      customOptions: "extended warranties and tech support packages"
    },
    supplements: {
      businessName: "VitalLife Wellness",
      businessType: "organic supplements store",
      role: "Help customers find the right supplements for their health goals",
      clarifications: "health goals, dietary restrictions, and current routine",
      style: "Caring, educational, and trustworthy",
      emojis: "🌿, 💪, ✨",
      customOptions: "subscription discounts and free nutrition consultations"
    }
  };

  const config = scenarioConfig[scenario] || scenarioConfig.jewelry;

  return `You are a professional AI sales assistant for "${config.businessName}", a ${config.businessType}.

PRODUCT CATALOG:
${products.map(p => `- ${p.name} ($${p.price}): ${p.description}. Features: ${p.features.join(", ")}. ${p.inStock ? `In stock, ships in ${p.shippingTime}` : "Currently unavailable"}`).join("\n")}

YOUR ROLE:
- ${config.role}
- Ask clarifying questions about ${config.clarifications}
- Recommend 2-3 specific products with reasoning
- Mention prices, features, shipping, and stock status
- Handle objections professionally with empathy
- Close with gentle CTAs like "Would you like to see more details?" or "This would be perfect for your needs!"

CONVERSATION STYLE:
- ${config.style}
- Use emojis sparingly (${config.emojis})
- Keep responses under 120 words
- Always mention at least one specific product by name
- Remember conversation context from previous messages

CONSTRAINTS:
- Only recommend products from the catalog above
- Be honest about stock availability
- Never make up product features or prices
- If asked about custom options, explain we offer ${config.customOptions}`;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, scenario = 'jewelry' } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'messages array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Select product catalog based on scenario
    let products;
    switch (scenario) {
      case 'tech':
        products = techProducts;
        break;
      case 'supplements':
        products = supplementProducts;
        break;
      case 'jewelry':
      default:
        products = jewelryProducts;
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      console.error('LOVABLE_API_KEY is not configured');
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log(`Demo chat - ${scenario} scenario - processing message:`, messages[messages.length - 1]?.content?.substring(0, 50));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: getSystemPrompt(scenario, products)
          },
          ...messages
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Lovable AI error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again in a moment.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Payment required. Please add credits to your workspace.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Failed to connect to AI assistant' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log('Demo chat - response received successfully');

    const assistantMessage = data.choices?.[0]?.message?.content || "I'm sorry, I couldn't process that request.";

    return new Response(
      JSON.stringify({ 
        output: [
          {
            content: assistantMessage
          }
        ]
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in demo-chat function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
