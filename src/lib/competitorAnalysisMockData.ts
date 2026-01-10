// ============================================
// COMPETITIVE ANALYSIS DATA - English Version
// ============================================

export const competitorAnalysisData = {
  // 4Ps Analysis (Marketing Mix)
  fourPs: [
    {
      competitor: "DoorDash/Instacart",
      logo: "🚀",
      product: {
        features: ["Multi-category delivery", "Mobile app", "Real-time tracking", "Restaurant partnerships"],
        quality: "High",
        support: "Chat + Phone 24/7",
        differentiators: ["Massive network", "Restaurant integration", "Grocery partnership"],
        score: 85
      },
      price: {
        model: "Commission per order",
        range: "15-25%",
        averageTicket: "$35",
        discounts: "Frequent promos, subscription discounts (DashPass)",
        flexibility: "Low",
        score: 60
      },
      place: {
        channels: ["Mobile App", "Web", "API Partners"],
        markets: ["US", "Canada", "Australia"],
        digitalPresence: 95,
        distribution: "Direct-to-consumer + B2B",
        coverage: "Urban-focused",
        score: 90
      },
      promotion: {
        channels: ["TV Ads", "Meta Ads", "Influencer Marketing", "Podcast Sponsorship"],
        estimatedAdSpend: "$100M+/year",
        tone: "Casual, convenience-focused",
        socialFollowers: "2.5M+",
        contentStrategy: "User-generated content + Celebrity endorsements",
        score: 95
      }
    },
    {
      competitor: "HealthMart Online",
      logo: "💊",
      product: {
        features: ["Pharmacy network", "Prescription management", "Health consultations"],
        quality: "High",
        support: "Phone + Email (Business hours)",
        differentiators: ["Licensed pharmacists", "Insurance integration", "Compliance expertise"],
        score: 75
      },
      price: {
        model: "Fixed margin + Subscription",
        range: "$15-50/month",
        averageTicket: "$85",
        discounts: "Insurance-based, volume discounts",
        flexibility: "Medium",
        score: 70
      },
      place: {
        channels: ["Web", "Partner clinics", "B2B API"],
        markets: ["US only"],
        digitalPresence: 70,
        distribution: "B2B2C primarily",
        coverage: "National",
        score: 65
      },
      promotion: {
        channels: ["Google Ads", "Healthcare publications", "Trade shows"],
        estimatedAdSpend: "$5M/year",
        tone: "Professional, trustworthy",
        socialFollowers: "150K",
        contentStrategy: "Educational content + Whitepapers",
        score: 55
      }
    },
    {
      competitor: "WellnessERP Pro",
      logo: "📊",
      product: {
        features: ["Inventory management", "Basic POS", "Reporting", "Multi-location"],
        quality: "Medium",
        support: "Email + Knowledge base",
        differentiators: ["Industry-specific features", "Established brand"],
        score: 60
      },
      price: {
        model: "Per-seat subscription",
        range: "$50-200/month",
        averageTicket: "$120/month",
        discounts: "Annual commitment (20% off)",
        flexibility: "High",
        score: 75
      },
      place: {
        channels: ["Web", "Resellers", "Consultants"],
        markets: ["US", "UK", "Canada"],
        digitalPresence: 55,
        distribution: "Direct + Channel partners",
        coverage: "SMB focused",
        score: 50
      },
      promotion: {
        channels: ["LinkedIn", "Trade shows", "Partner referrals"],
        estimatedAdSpend: "$2M/year",
        tone: "Technical, feature-focused",
        socialFollowers: "50K",
        contentStrategy: "Product demos + Case studies",
        score: 45
      }
    }
  ],

  // Paid Media Diagnosis
  paidMediaDiagnosis: {
    competitors: [
      {
        name: "DoorDash/Instacart",
        platforms: [
          { name: "Google Ads", status: "strong", spend: "High" },
          { name: "Meta Ads", status: "strong", spend: "High" },
          { name: "TikTok", status: "medium", spend: "Medium" },
          { name: "YouTube", status: "strong", spend: "High" },
          { name: "LinkedIn", status: "weak", spend: "Low" }
        ],
        adTypes: ["Video", "Display", "Search", "Shopping", "Retargeting"],
        frequency: "Very High (5+ touchpoints/week)",
        estimatedBudget: "$8M+/month",
        strengths: [
          "Strong brand awareness campaigns",
          "Consistent visual identity",
          "Effective retargeting funnels",
          "Celebrity endorsements"
        ],
        weaknesses: [
          "No B2B targeting",
          "Generic health messaging",
          "Missing LinkedIn entirely",
          "No educational content"
        ],
        opportunities: [
          "B2B health business targeting",
          "LinkedIn thought leadership",
          "Long-form educational content",
          "Niche health community sponsorships"
        ]
      },
      {
        name: "HealthMart Online",
        platforms: [
          { name: "Google Ads", status: "strong", spend: "Medium" },
          { name: "Meta Ads", status: "medium", spend: "Low" },
          { name: "TikTok", status: "weak", spend: "None" },
          { name: "YouTube", status: "weak", spend: "Low" },
          { name: "LinkedIn", status: "medium", spend: "Medium" }
        ],
        adTypes: ["Search", "Display", "Native"],
        frequency: "Medium (2-3 touchpoints/week)",
        estimatedBudget: "$400K/month",
        strengths: [
          "Strong Google Search presence",
          "Healthcare publication partnerships",
          "Professional messaging"
        ],
        weaknesses: [
          "No video content",
          "Minimal social presence",
          "Outdated creatives",
          "No mobile-first strategy"
        ],
        opportunities: [
          "Video testimonials",
          "Social proof campaigns",
          "Mobile app promotion",
          "Influencer partnerships"
        ]
      },
      {
        name: "WellnessERP Pro",
        platforms: [
          { name: "Google Ads", status: "medium", spend: "Medium" },
          { name: "Meta Ads", status: "weak", spend: "Low" },
          { name: "TikTok", status: "weak", spend: "None" },
          { name: "YouTube", status: "weak", spend: "None" },
          { name: "LinkedIn", status: "medium", spend: "Medium" }
        ],
        adTypes: ["Search", "Display"],
        frequency: "Low (1-2 touchpoints/week)",
        estimatedBudget: "$150K/month",
        strengths: [
          "Targeted B2B keywords",
          "Industry-specific messaging"
        ],
        weaknesses: [
          "No video presence",
          "Limited creative variety",
          "Poor mobile optimization",
          "No retargeting strategy"
        ],
        opportunities: [
          "Product demo videos",
          "Customer success stories",
          "Comparison campaigns",
          "Free trial promotions"
        ]
      }
    ],
    marketGaps: [
      {
        gap: "No competitor effectively using TikTok for health business content",
        opportunity: "First-mover advantage in short-form educational content",
        priority: "high"
      },
      {
        gap: "Long-tail keywords for 'health product inventory management' available",
        opportunity: "Low CPC acquisition of high-intent traffic",
        priority: "high"
      },
      {
        gap: "Limited remarketing sophistication in the market",
        opportunity: "Build advanced funnel with segmented messaging",
        priority: "medium"
      },
      {
        gap: "No competitor targeting health business owners on LinkedIn",
        opportunity: "B2B lead generation with low competition",
        priority: "high"
      },
      {
        gap: "Podcast sponsorship underutilized in health business niche",
        opportunity: "Build authority through niche podcast presence",
        priority: "medium"
      }
    ],
    overallAssessment: "The competitive landscape shows heavy investment in B2C channels but significant gaps in B2B targeting and educational content. Your opportunity lies in positioning as the SMB-focused solution with targeted, value-driven advertising."
  },

  // Paid Media Action Plan
  paidMediaActionPlan: {
    totalBudget: "$15,000/month",
    channels: [
      { 
        name: "Google Ads", 
        allocation: 40, 
        budget: "$6,000",
        priority: 1, 
        expectedROAS: "3.5x",
        focus: "Search + Performance Max",
        keyMetrics: ["CTR > 4%", "CPC < $3", "Conv. Rate > 5%"]
      },
      { 
        name: "Meta Ads", 
        allocation: 30, 
        budget: "$4,500",
        priority: 2, 
        expectedROAS: "2.8x",
        focus: "Lead Gen + Retargeting",
        keyMetrics: ["CPL < $25", "Reach > 100K", "Engagement > 3%"]
      },
      { 
        name: "LinkedIn", 
        allocation: 20, 
        budget: "$3,000",
        priority: 3, 
        expectedROAS: "2.2x",
        focus: "B2B Lead Gen + Thought Leadership",
        keyMetrics: ["CPL < $50", "MQL Rate > 15%", "Engagement > 2%"]
      },
      { 
        name: "TikTok", 
        allocation: 10, 
        budget: "$1,500",
        priority: 4, 
        expectedROAS: "4.0x",
        focus: "Brand Awareness + Viral Content",
        keyMetrics: ["CPM < $5", "Views > 500K", "Follower Growth > 5K"]
      }
    ],
    campaigns: [
      { 
        phase: "Awareness", 
        duration: "Month 1-2", 
        budgetAllocation: 30,
        objective: "Brand recognition & audience building",
        channels: ["Meta", "TikTok", "YouTube"],
        kpis: ["Reach: 500K+", "Brand Recall: 15%+", "Follower Growth: 10K+"],
        creatives: ["Brand story video", "Founder intro", "Problem-agitation content"]
      },
      { 
        phase: "Consideration", 
        duration: "Month 2-3", 
        budgetAllocation: 40,
        objective: "Lead generation & nurturing",
        channels: ["Google", "LinkedIn", "Meta"],
        kpis: ["MQLs: 500+", "Email Signups: 2K+", "Demo Requests: 100+"],
        creatives: ["Feature demos", "Customer testimonials", "Comparison content"]
      },
      { 
        phase: "Conversion", 
        duration: "Month 3+", 
        budgetAllocation: 30,
        objective: "Free trials & paid signups",
        channels: ["Google", "Meta Retargeting", "Email"],
        kpis: ["Free Trials: 200+", "Paid Conversions: 50+", "CAC < $100"],
        creatives: ["Offer-focused ads", "Urgency messaging", "Social proof"]
      }
    ],
    creatives: [
      { 
        type: "Video Ads", 
        format: "15-30s vertical & horizontal", 
        platforms: ["Meta", "TikTok", "YouTube"],
        quantity: "8-12 variations",
        themes: ["Problem/Solution", "Customer Story", "Product Demo", "Founder Story"]
      },
      { 
        type: "Carousel", 
        format: "4-6 slides with CTA", 
        platforms: ["Meta", "LinkedIn"],
        quantity: "6-8 variations",
        themes: ["Feature highlights", "Before/After", "Step-by-step guide"]
      },
      { 
        type: "Search Ads", 
        format: "Responsive Search Ads", 
        platforms: ["Google"],
        quantity: "15-20 ad groups",
        themes: ["Solution keywords", "Competitor alternatives", "Feature-specific"]
      },
      { 
        type: "Static Images", 
        format: "1080x1080, 1200x628, 1080x1920", 
        platforms: ["All"],
        quantity: "20+ variations",
        themes: ["Brand awareness", "Promotional", "Testimonial quotes"]
      }
    ],
    timeline: [
      { 
        week: "Week 1-2", 
        action: "Account setup & creative production",
        deliverables: ["Ad accounts configured", "Pixel/tracking installed", "Initial creatives produced"],
        milestone: "Foundation Ready"
      },
      { 
        week: "Week 3-4", 
        action: "Launch awareness campaigns",
        deliverables: ["Awareness campaigns live", "A/B tests running", "Baseline metrics established"],
        milestone: "Campaigns Live"
      },
      { 
        week: "Week 5-8", 
        action: "Optimize & scale winning ads",
        deliverables: ["Top performers identified", "Budget reallocated", "New variations tested"],
        milestone: "Optimization Phase"
      },
      { 
        week: "Week 9-12", 
        action: "Conversion focus & retargeting",
        deliverables: ["Full-funnel active", "Retargeting optimized", "CAC targets achieved"],
        milestone: "Full Funnel Active"
      }
    ],
    expectedResults: {
      month3: {
        impressions: "2M+",
        clicks: "50K+",
        leads: "800+",
        trials: "150+",
        customers: "40+",
        cac: "$95"
      },
      month6: {
        impressions: "5M+",
        clicks: "150K+",
        leads: "2,500+",
        trials: "500+",
        customers: "150+",
        cac: "$75"
      }
    }
  },

  // Pricing Diagnosis
  pricingDiagnosis: {
    priceMap: [
      { 
        competitor: "DoorDash/Instacart", 
        position: "Premium", 
        price: "15-25% commission", 
        model: "Transaction-based",
        targetMarket: "High-volume merchants",
        valueProposition: "Massive customer reach"
      },
      { 
        competitor: "HealthMart Online", 
        position: "Mid-market", 
        price: "$50-150/month", 
        model: "Tiered subscription",
        targetMarket: "Established pharmacies",
        valueProposition: "Compliance + Insurance"
      },
      { 
        competitor: "WellnessERP Pro", 
        position: "Mid-market", 
        price: "$50-200/month", 
        model: "Per-seat",
        targetMarket: "Multi-location businesses",
        valueProposition: "Enterprise features"
      },
      { 
        competitor: "Generic POS Systems", 
        position: "Budget", 
        price: "$20-50/month", 
        model: "Flat rate",
        targetMarket: "Single-location stores",
        valueProposition: "Simplicity"
      }
    ],
    models: [
      { 
        type: "Per-seat", 
        prevalence: 35, 
        pros: ["Scales with team size", "Predictable per-user cost"], 
        cons: ["Limits adoption", "Users share accounts"],
        bestFor: "Enterprise sales"
      },
      { 
        type: "Flat-rate", 
        prevalence: 30, 
        pros: ["Simple to understand", "Predictable revenue"], 
        cons: ["May leave money on table", "One-size-fits-all"],
        bestFor: "SMB market"
      },
      { 
        type: "Usage-based", 
        prevalence: 20, 
        pros: ["Low barrier to entry", "Aligns with value"], 
        cons: ["Revenue unpredictable", "Complex to explain"],
        bestFor: "Variable usage patterns"
      },
      { 
        type: "Commission", 
        prevalence: 15, 
        pros: ["No upfront cost", "Aligned incentives"], 
        cons: ["Margin pressure", "High volume required"],
        bestFor: "Marketplace models"
      }
    ],
    gaps: [
      { 
        range: "$60-90/month", 
        description: "No strong player in the 'professional SMB' tier",
        opportunity: "Position as premium SMB solution",
        priority: "high"
      },
      { 
        range: "Freemium + Premium", 
        description: "Limited freemium options with meaningful features",
        opportunity: "Freemium as acquisition channel",
        priority: "high"
      },
      { 
        range: "Annual discounts 25%+", 
        description: "Most offer only 10-15% annual discount",
        opportunity: "Aggressive annual pricing for cash flow",
        priority: "medium"
      },
      { 
        range: "Vertical-specific bundles", 
        description: "No competitor offers health-specific add-ons",
        opportunity: "Compliance/delivery add-on packages",
        priority: "medium"
      }
    ],
    elasticity: {
      assessment: "Medium",
      insight: "Market research indicates customers are willing to pay 20-30% premium for better UX, dedicated support, and health-specific compliance features. Price sensitivity is lower for time-saving features.",
      recommendations: [
        "Emphasize time savings and compliance in pricing justification",
        "Offer flexible billing (monthly/annual) to reduce friction",
        "Create clear value metrics (orders processed, time saved)"
      ]
    },
    competitorPriceComparison: [
      { feature: "Basic inventory", you: "✓", competitor1: "✓", competitor2: "✓", competitor3: "✓" },
      { feature: "Delivery integration", you: "✓", competitor1: "✓", competitor2: "✗", competitor3: "✗" },
      { feature: "Health compliance", you: "✓", competitor1: "Partial", competitor2: "✓", competitor3: "✗" },
      { feature: "Multi-location", you: "✓", competitor1: "✓", competitor2: "✓", competitor3: "$$" },
      { feature: "24/7 Support", you: "Pro+", competitor1: "✓", competitor2: "$$", competitor3: "✗" },
      { feature: "Custom integrations", you: "Enterprise", competitor1: "✓", competitor2: "$$", competitor3: "✗" }
    ]
  },

  // Pricing Action Plan
  pricingActionPlan: {
    recommendedModel: "Tiered flat-rate with usage add-ons",
    rationale: "Flat-rate simplifies decision making for SMBs while usage-based add-ons capture value from power users. This hybrid approach maximizes both adoption and revenue.",
    tiers: [
      { 
        name: "Starter", 
        price: "$49/mo", 
        annualPrice: "$39/mo (billed annually)",
        features: [
          "Core inventory management",
          "Up to 500 SKUs",
          "5 team members",
          "Basic reporting",
          "Email support",
          "Standard integrations"
        ],
        targetCustomer: "Solo operators & new businesses",
        expectedConversion: "60% of free trials"
      },
      { 
        name: "Professional", 
        price: "$99/mo",
        annualPrice: "$79/mo (billed annually)", 
        features: [
          "Everything in Starter",
          "Unlimited SKUs",
          "25 team members",
          "Advanced analytics",
          "Priority support",
          "Delivery integrations",
          "Health compliance tools",
          "Multi-location (up to 3)"
        ],
        targetCustomer: "Growing health businesses",
        expectedConversion: "30% of free trials",
        recommended: true
      },
      { 
        name: "Enterprise", 
        price: "Custom",
        annualPrice: "Custom", 
        features: [
          "Everything in Professional",
          "Unlimited team members",
          "Unlimited locations",
          "Dedicated CSM",
          "Custom integrations",
          "SLA guarantee",
          "White-label options",
          "API access"
        ],
        targetCustomer: "Multi-location chains & franchises",
        expectedConversion: "10% of qualified leads"
      }
    ],
    addOns: [
      { name: "Advanced Delivery", price: "$29/mo", description: "Multi-carrier, route optimization" },
      { name: "Compliance Plus", price: "$19/mo", description: "FDA reporting, lot tracking" },
      { name: "Analytics Pro", price: "$25/mo", description: "Custom dashboards, forecasting" }
    ],
    launchStrategy: {
      phase1: {
        name: "Early Adopter",
        duration: "First 100 customers",
        discount: "30% lifetime discount",
        rationale: "Build social proof and case studies quickly"
      },
      phase2: {
        name: "Growth",
        duration: "Customers 101-500",
        discount: "20% first year",
        rationale: "Maintain momentum while building towards full price"
      },
      phase3: {
        name: "Scale",
        duration: "Customer 500+",
        discount: "Standard pricing",
        rationale: "Product-market fit established, full value capture"
      }
    },
    trialStrategy: { 
      type: "14-day free trial", 
      features: "Full Professional tier access",
      conversionTarget: "15%",
      tactics: [
        "Onboarding call at day 1",
        "Progress check at day 7",
        "Upgrade prompt at day 10",
        "Personal outreach at day 13"
      ]
    },
    upsellPath: [
      { 
        from: "Starter", 
        to: "Professional", 
        trigger: "Reaching 400+ SKUs or 5+ team members",
        messaging: "Unlock unlimited growth potential"
      },
      { 
        from: "Professional", 
        to: "Enterprise", 
        trigger: "Opening 4th location or needing custom integrations",
        messaging: "Scale without limits"
      },
      { 
        from: "Any tier", 
        to: "Add-ons", 
        trigger: "Feature usage indicates need",
        messaging: "Enhance your workflow"
      }
    ],
    projectedRevenue: {
      month12: {
        customers: 250,
        distribution: { starter: "55%", professional: "35%", enterprise: "10%" },
        mrr: "$28,500",
        arpu: "$114"
      }
    }
  },

  // Growth Strategy (AEMR Framework)
  growthStrategy: {
    acquisition: {
      targetCAC: "$75",
      monthlyLeadTarget: 500,
      channels: [
        { 
          name: "Content Marketing", 
          investment: "High", 
          expectedCAC: "$45",
          tactics: ["SEO blog content", "Health business guides", "Template library"],
          timeline: "3-6 months to scale"
        },
        { 
          name: "Paid Advertising", 
          investment: "Medium", 
          expectedCAC: "$85",
          tactics: ["Google Search", "LinkedIn B2B", "Meta retargeting"],
          timeline: "Immediate results"
        },
        { 
          name: "Partnerships", 
          investment: "Medium", 
          expectedCAC: "$35",
          tactics: ["Health distributors", "POS integrators", "Industry associations"],
          timeline: "2-4 months to develop"
        },
        { 
          name: "Referral Program", 
          investment: "Low", 
          expectedCAC: "$25",
          tactics: ["Customer referrals ($50 credit)", "Partner commissions", "Affiliate program"],
          timeline: "Ongoing"
        }
      ],
      tactics: [
        "SEO blog content (2-3 posts/week)",
        "LinkedIn thought leadership",
        "Monthly webinars on health business topics",
        "Product Hunt launch for initial traction",
        "Guest posts on industry publications"
      ],
      keyMetrics: [
        { metric: "Monthly Visitors", target: "25K", current: "0" },
        { metric: "Lead Conversion Rate", target: "3%", current: "0%" },
        { metric: "MQLs/month", target: "500", current: "0" },
        { metric: "CAC", target: "<$75", current: "N/A" }
      ]
    },
    engagement: {
      activationMetric: "Complete 3 key actions in first 7 days",
      activationTarget: "60%",
      onboardingSteps: [
        { step: 1, action: "Welcome email + product tour video", timing: "Immediate" },
        { step: 2, action: "Interactive product walkthrough", timing: "First login" },
        { step: 3, action: "First product added (guided)", timing: "Day 1" },
        { step: 4, action: "First order processed", timing: "Day 3-5" },
        { step: 5, action: "Team member invited", timing: "Day 5-7" }
      ],
      tactics: [
        "Interactive in-app onboarding with progress tracking",
        "Email drip sequence (7 emails over 14 days)",
        "In-app tips and contextual help",
        "Success milestone celebrations",
        "Optional onboarding call for Pro tier"
      ],
      engagementLoops: [
        { trigger: "Low stock alert", action: "Push notification + email", outcome: "User logs in to reorder" },
        { trigger: "New order received", action: "Mobile notification", outcome: "User processes order" },
        { trigger: "Weekly summary", action: "Email digest", outcome: "User reviews performance" }
      ],
      keyMetrics: [
        { metric: "Day 1 Activation", target: "70%", current: "0%" },
        { metric: "Day 7 Activation", target: "60%", current: "0%" },
        { metric: "Weekly Active Users", target: "75%", current: "0%" },
        { metric: "Feature Adoption", target: "5+ features", current: "0" }
      ]
    },
    monetization: {
      conversionTarget: "5% free-to-paid",
      averageContractValue: "$1,200/year",
      expansionRevenueTarget: "20% of total revenue",
      strategies: [
        { 
          strategy: "Feature Gating", 
          description: "Key features locked behind paid tiers",
          impact: "Primary conversion driver"
        },
        { 
          strategy: "Usage Limits", 
          description: "SKU and team member limits on Starter",
          impact: "Natural upgrade trigger"
        },
        { 
          strategy: "Premium Support", 
          description: "Priority support on higher tiers",
          impact: "Retention + upsell"
        },
        { 
          strategy: "Annual Incentive", 
          description: "20% discount for annual commitment",
          impact: "Cash flow + retention"
        }
      ],
      revenueStreams: [
        { stream: "Subscriptions", percentage: 75, description: "Core product tiers" },
        { stream: "Add-ons", percentage: 15, description: "Delivery, Compliance, Analytics" },
        { stream: "Services", percentage: 10, description: "Onboarding, training, custom dev" }
      ],
      keyMetrics: [
        { metric: "Trial-to-Paid Rate", target: "15%", current: "0%" },
        { metric: "ARPU", target: "$114", current: "$0" },
        { metric: "Expansion Revenue", target: "20%", current: "0%" },
        { metric: "LTV", target: "$1,800", current: "N/A" }
      ]
    },
    retention: {
      targetChurn: "< 5% monthly",
      npsTarget: 50,
      strategies: [
        { 
          strategy: "Proactive Outreach", 
          description: "CSM check-ins for at-risk accounts",
          trigger: "Usage drops 50% week-over-week"
        },
        { 
          strategy: "Quarterly Business Reviews", 
          description: "Strategic reviews for Pro/Enterprise",
          trigger: "Every 90 days"
        },
        { 
          strategy: "Feature Request Tracking", 
          description: "Public roadmap with voting",
          trigger: "Ongoing engagement"
        },
        { 
          strategy: "Loyalty Rewards", 
          description: "Anniversary discounts and perks",
          trigger: "Account milestones"
        }
      ],
      churnReasons: [
        { reason: "Business closed", percentage: 30, preventable: false },
        { reason: "Switched to competitor", percentage: 25, preventable: true },
        { reason: "Not using enough", percentage: 20, preventable: true },
        { reason: "Too expensive", percentage: 15, preventable: true },
        { reason: "Missing features", percentage: 10, preventable: true }
      ],
      keyMetrics: [
        { metric: "Monthly Churn", target: "<5%", current: "N/A" },
        { metric: "Net Revenue Retention", target: ">100%", current: "N/A" },
        { metric: "NPS", target: "50+", current: "N/A" },
        { metric: "Customer Lifetime", target: ">24 months", current: "N/A" }
      ]
    }
  },

  // Your Competitive Advantages Summary
  competitiveAdvantages: [
    {
      advantage: "SMB Focus",
      description: "Purpose-built for small health businesses, not retrofitted enterprise software",
      competitorGap: "Competitors focus on large chains or general retail",
      impact: "Lower complexity, faster adoption, better fit"
    },
    {
      advantage: "Health Compliance Built-in",
      description: "FDA compliance, lot tracking, and health-specific features from day one",
      competitorGap: "Generic ERPs require expensive customization for compliance",
      impact: "Reduced risk, faster time to market"
    },
    {
      advantage: "Integrated Delivery",
      description: "Native delivery management without third-party complexity",
      competitorGap: "Competitors require separate delivery solutions",
      impact: "Lower operational costs, better customer experience"
    },
    {
      advantage: "Modern UX",
      description: "Intuitive interface designed for non-technical users",
      competitorGap: "Legacy competitors have steep learning curves",
      impact: "Higher adoption, lower training costs"
    }
  ]
};
