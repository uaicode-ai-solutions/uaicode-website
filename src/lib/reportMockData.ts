// ============================================
// NEW REPORT DATA - Storytelling-focused structure
// ============================================

// ==========================================
// REPORT DATA (Viability Report Tab)
// ==========================================

export const reportData = {
  // Hero Section
  projectName: "My Doctor Hub",
  viabilityScore: 87,
  verdictHeadline: "Projeto com forte potencial de mercado",
  keyMetrics: {
    marketSize: "$12.4B",
    marketLabel: "Mercado Total",
    expectedROI: "363%",
    roiLabel: "ROI Esperado",
    paybackMonths: 8,
    paybackLabel: "Meses até Payback"
  },

  // Executive Verdict
  executiveSummary: `Após analisar profundamente seu projeto My Doctor Hub, identificamos uma oportunidade sólida em um mercado de $12.4 bilhões que cresce 23% ao ano.

Seu diferencial de conectar consumidores com fornecedores locais de produtos de saúde e suplementos, combinado com gestão de estoque e delivery, posiciona você favoravelmente contra competidores que focam apenas em grandes redes.

O investimento estimado de $55.000 para o MVP tem potencial de retorno em 8 meses, com LTV/CAC de 11.5x indicando unit economics extremamente saudáveis.`,
  
  recommendation: "Prosseguir com o desenvolvimento",
  
  highlights: [
    { 
      icon: "TrendingUp", 
      text: "Mercado em crescimento de 23% ao ano",
      detail: "Healthcare e-commerce é um dos setores que mais cresce" 
    },
    { 
      icon: "PiggyBank", 
      text: "Unit Economics favorável (LTV/CAC 11.5x)",
      detail: "Indicadores financeiros acima da média do mercado" 
    },
    { 
      icon: "Target", 
      text: "Baixa competição no nicho de pequenos negócios",
      detail: "Competidores focam em grandes redes, negligenciando SMBs" 
    },
    { 
      icon: "Clock", 
      text: "Tecnicamente viável em 4-6 meses",
      detail: "Stack moderno permite desenvolvimento ágil" 
    },
  ],
  
  risks: [
    { 
      risk: "Dependência de APIs de terceiros para pagamentos e delivery",
      priority: "medium" as const,
      mitigation: "Implementamos fallbacks multi-provider e cache inteligente" 
    },
    { 
      risk: "Ciclo de vendas mais longo para pequenos negócios",
      priority: "medium" as const,
      mitigation: "Abordagem PLG com freemium reduz atrito de adoção" 
    },
    { 
      risk: "Regulamentações de saúde e alimentos funcionais",
      priority: "low" as const,
      mitigation: "Compliance integrado desde o dia 1 com validações ANVISA" 
    },
  ],

  // Market Opportunity
  market: {
    tam: { value: "$12.4B", label: "TAM", description: "Mercado Total Endereçável - Healthcare E-commerce Global" },
    sam: { value: "$2.8B", label: "SAM", description: "Mercado Disponível - Segmento Brasil/LATAM" },
    som: { value: "$180M", label: "SOM", description: "Mercado Obtível - Primeiros 3 anos" },
    growthRate: "23%",
    growthLabel: "Crescimento Anual",
    conclusion: "Há espaço claro para um novo player focado em pequenos negócios de saúde e bem-estar na América Latina."
  },
  
  competitors: [
    { 
      name: "iFood/Rappi", 
      price: "Comissão 15-25%", 
      weakness: "Focados em alimentação geral, sem especialização em saúde",
      yourAdvantage: "Especialização em produtos de saúde com compliance"
    },
    { 
      name: "Farmácias Online", 
      price: "Margem fixa", 
      weakness: "Apenas grandes redes, sem suporte a pequenos",
      yourAdvantage: "Plataforma para pequenos produtores e lojas"
    },
    { 
      name: "ERPs Genéricos", 
      price: "$50-200/mês", 
      weakness: "Sem delivery integrado, curva de aprendizado alta",
      yourAdvantage: "Solução completa e simples de usar"
    },
  ],
  
  competitiveAdvantage: "Única plataforma que combina gestão de estoque, delivery local e compliance de produtos de saúde, focada em pequenos negócios.",

  // Investment
  investment: {
    total: 55000,
    currency: "USD",
    breakdown: [
      { name: "Desenvolvimento Frontend", value: 18000, percentage: 33 },
      { name: "Backend & API", value: 15000, percentage: 27 },
      { name: "Integrações (Pagamento, Delivery)", value: 12000, percentage: 22 },
      { name: "Infraestrutura (12 meses)", value: 5000, percentage: 9 },
      { name: "Testes & QA", value: 5000, percentage: 9 },
    ],
    included: [
      "Desenvolvimento completo do MVP",
      "12 meses de hospedagem e infraestrutura",
      "Integrações com pagamento e delivery",
      "App web responsivo (mobile-first)",
      "Suporte pós-lançamento (30 dias)",
      "Documentação técnica completa",
    ],
    notIncluded: [
      "Marketing e aquisição de clientes",
      "Apps nativos iOS/Android",
      "Integrações customizadas adicionais",
      "Suporte 24/7 após período inicial",
    ],
    comparison: {
      traditional: 120000,
      savings: "54%",
      note: "Agência tradicional cobraria $120.000+ pelo mesmo escopo"
    }
  },

  // Financial Return
  financials: {
    breakEvenMonths: 8,
    roiYear1: 363,
    mrrMonth12: 69420,
    arrProjected: 833000,
    ltvCacRatio: 11.5,
    monthlyChurn: "5%",
    
    scenarios: [
      { 
        name: "Conservador", 
        mrrMonth12: 45000, 
        arrYear1: 540000,
        breakEven: 11,
        probability: "70%"
      },
      { 
        name: "Realista", 
        mrrMonth12: 69420, 
        arrYear1: 833000,
        breakEven: 8,
        probability: "60%"
      },
      { 
        name: "Otimista", 
        mrrMonth12: 95000, 
        arrYear1: 1140000,
        breakEven: 6,
        probability: "40%"
      },
    ],
    
    projectionData: [
      { month: "M1", revenue: 890, costs: 18500, cumulative: -17610 },
      { month: "M2", revenue: 2670, costs: 12500, cumulative: -27440 },
      { month: "M3", revenue: 5340, costs: 12500, cumulative: -34600 },
      { month: "M4", revenue: 8900, costs: 12500, cumulative: -38200 },
      { month: "M5", revenue: 13350, costs: 12500, cumulative: -37350 },
      { month: "M6", revenue: 18690, costs: 13000, cumulative: -31660 },
      { month: "M7", revenue: 24920, costs: 13000, cumulative: -19740 },
      { month: "M8", revenue: 32040, costs: 13500, cumulative: -1200 },
      { month: "M9", revenue: 40050, costs: 14000, cumulative: 24850 },
      { month: "M10", revenue: 48950, costs: 14000, cumulative: 59800 },
      { month: "M11", revenue: 58740, costs: 14500, cumulative: 104040 },
      { month: "M12", revenue: 69420, costs: 15000, cumulative: 158460 },
    ]
  },

  // Execution Plan
  timeline: [
    { 
      phase: 1,
      name: "Discovery", 
      duration: "2-3 semanas",
      description: "Refinamento de requisitos e arquitetura",
      deliverables: ["PRD completo", "Wireframes", "Arquitetura técnica", "Cronograma detalhado"],
      icon: "Search"
    },
    { 
      phase: 2,
      name: "MVP Build", 
      duration: "10-14 semanas",
      description: "Desenvolvimento das funcionalidades core",
      deliverables: ["Auth e usuários", "Gestão de produtos", "Carrinho e pedidos", "Integrações"],
      icon: "Code"
    },
    { 
      phase: 3,
      name: "Beta", 
      duration: "4-6 semanas",
      description: "Testes com usuários reais e iterações",
      deliverables: ["Onboarding beta users", "Coleta de feedback", "Correções e melhorias", "Documentação"],
      icon: "Users"
    },
    { 
      phase: 4,
      name: "Launch", 
      duration: "2 semanas",
      description: "Lançamento público e go-to-market",
      deliverables: ["Deploy produção", "Marketing ativo", "Suporte ao cliente", "Monitoramento"],
      icon: "Rocket"
    },
  ],
  
  techStack: [
    { category: "Frontend", techs: ["React 18", "TypeScript", "TailwindCSS"] },
    { category: "Backend", techs: ["Node.js", "PostgreSQL", "Supabase"] },
    { category: "Infra", techs: ["Vercel", "AWS", "Docker"] },
    { category: "Integrações", techs: ["Stripe", "API Delivery", "SendGrid"] },
  ],

  // Why Uaicode
  uaicode: {
    successRate: 94,
    projectsDelivered: 47,
    avgDeliveryWeeks: 12,
    
    differentials: [
      { 
        icon: "Award", 
        title: "94% Taxa de Sucesso", 
        description: "Projetos entregues com sucesso em tempo e orçamento" 
      },
      { 
        icon: "Users", 
        title: "Time Especializado em SaaS", 
        description: "Desenvolvedores seniores focados em produtos digitais" 
      },
      { 
        icon: "Zap", 
        title: "Metodologia Ágil", 
        description: "Entregas semanais com demos e comunicação transparente" 
      },
      { 
        icon: "HeadphonesIcon", 
        title: "Suporte Pós-Lançamento", 
        description: "30 dias de suporte incluído após o go-live" 
      },
    ],
    
    testimonials: [
      { 
        name: "Carlos Oliveira", 
        company: "FinTech Solutions", 
        avatar: "/testimonial-carlos.webp",
        quote: "A Uaicode entregou nosso MVP em 12 semanas com qualidade superior ao esperado. Recomendo fortemente.",
        role: "CEO"
      },
      { 
        name: "Maria Santos", 
        company: "HealthTech Co", 
        avatar: "/testimonial-maria.webp",
        quote: "Profissionais, ágeis e transparentes. Exatamente o que precisávamos para tirar nossa ideia do papel.",
        role: "Fundadora"
      },
    ],
    
    guarantees: [
      "Demos semanais para acompanhamento",
      "Preço fixo para o escopo do MVP",
      "30 dias de suporte pós-lançamento",
      "Código fonte 100% seu",
      "Documentação completa",
    ],
  },

  // Next Steps
  nextSteps: {
    verdictSummary: "Seu projeto está pronto para ser construído.",
    
    steps: [
      { 
        step: 1, 
        title: "Reunião de Kickoff", 
        description: "1 hora para alinhar expectativas e definir prioridades",
        icon: "Calendar"
      },
      { 
        step: 2, 
        title: "Proposta e Contrato", 
        description: "Documentação clara com escopo, prazo e investimento",
        icon: "FileText"
      },
      { 
        step: 3, 
        title: "Início em 5 dias úteis", 
        description: "Começamos o projeto logo após a aprovação",
        icon: "PlayCircle"
      },
      { 
        step: 4, 
        title: "Primeira entrega em 2 semanas", 
        description: "Você verá progresso real rapidamente",
        icon: "Package"
      },
    ],
    
    cta: {
      primary: "Agendar Conversa",
      secondary: "Baixar Relatório PDF",
    },
    
    contact: {
      email: "contato@uaicode.com.br",
      whatsapp: "+55 31 99999-9999",
      calendly: "https://calendly.com/uaicode",
    }
  }
};

// ==========================================
// ASSETS DATA (Brand Assets Tab)
// ==========================================

export const assetsData = {
  // Screen Mockups
  screenMockups: [
    {
      name: "Dashboard Principal",
      description: "Visão geral com métricas, pedidos recentes e alertas de estoque",
      category: "Desktop",
      features: ["KPIs em tempo real", "Gráficos de vendas", "Alertas inteligentes", "Ações rápidas"],
      priority: "Core"
    },
    {
      name: "Catálogo de Produtos",
      description: "Gestão completa de produtos com categorias e variações",
      category: "Desktop",
      features: ["Grid/Lista view", "Filtros avançados", "Bulk actions", "Import/Export"],
      priority: "Core"
    },
    {
      name: "Gestão de Pedidos",
      description: "Fluxo completo de pedidos com status e tracking",
      category: "Desktop",
      features: ["Pipeline visual", "Detalhes do pedido", "Histórico cliente", "Comunicação"],
      priority: "Core"
    },
    {
      name: "App do Cliente",
      description: "Interface do cliente para buscar e comprar produtos",
      category: "Mobile",
      features: ["Busca inteligente", "Carrinho", "Checkout", "Tracking"],
      priority: "Core"
    },
    {
      name: "Controle de Estoque",
      description: "Inventário com alertas e reposição automática",
      category: "Desktop",
      features: ["Níveis de estoque", "Alertas low-stock", "Histórico", "Fornecedores"],
      priority: "Secondary"
    },
    {
      name: "Relatórios",
      description: "Analytics e relatórios de performance",
      category: "Desktop",
      features: ["Vendas", "Produtos", "Clientes", "Exportação"],
      priority: "Secondary"
    },
    {
      name: "Login & Onboarding",
      description: "Fluxo de autenticação e configuração inicial",
      category: "Mobile",
      features: ["Social login", "Wizard setup", "Verificação", "Tour guiado"],
      priority: "Core"
    },
    {
      name: "Configurações",
      description: "Configurações da loja, integrações e perfil",
      category: "Desktop",
      features: ["Dados da loja", "Pagamentos", "Delivery", "Notificações"],
      priority: "Secondary"
    },
  ],

  // Brand Copy
  brandCopy: {
    brandName: "My Doctor Hub",
    
    valueProposition: "Simplifique a gestão do seu negócio de saúde com uma plataforma completa de estoque, vendas e delivery.",
    
    voiceTone: {
      primary: "Profissional e acessível",
      characteristics: [
        { trait: "Confiável", description: "Transmitimos segurança e expertise no setor" },
        { trait: "Simples", description: "Comunicação clara, sem jargões técnicos" },
        { trait: "Empático", description: "Entendemos os desafios do pequeno empreendedor" },
        { trait: "Inovador", description: "Soluções modernas para problemas reais" },
      ],
    },
    
    taglines: [
      { text: "Saúde ao alcance de todos", usage: "Principal", context: "Hero, campanhas" },
      { text: "Seu negócio de saúde, simplificado", usage: "Secundária", context: "Features, social" },
      { text: "Do estoque ao cliente, tudo em um só lugar", usage: "Descritiva", context: "Explicações" },
    ],
    
    elevatorPitch: "My Doctor Hub é a plataforma completa para pequenos negócios de saúde e bem-estar gerenciarem estoque, vendas e delivery em um só lugar. Diferente de ERPs genéricos ou apps de delivery, combinamos gestão inteligente com compliance de produtos de saúde, ajudando empreendedores a vender mais com menos esforço.",
    
    keyMessages: [
      { 
        message: "Gestão de estoque inteligente evita perdas e rupturas", 
        audience: "Donos de loja", 
        proof: "Alertas automáticos de reposição" 
      },
      { 
        message: "Delivery integrado aumenta seu alcance sem complicação", 
        audience: "Pequenos produtores", 
        proof: "Integração com principais apps" 
      },
      { 
        message: "Compliance simplificado para produtos de saúde", 
        audience: "Todos", 
        proof: "Validações ANVISA automatizadas" 
      },
    ],
    
    ctaExamples: [
      { cta: "Comece Gratuitamente", context: "Landing page hero" },
      { cta: "Ver Demo", context: "Página de features" },
      { cta: "Falar com Especialista", context: "Enterprise/dúvidas" },
      { cta: "Agendar Demonstração", context: "B2B" },
    ],
  },

  // Brand Identity
  brandIdentity: {
    colorPalette: [
      { 
        name: "Primary", 
        hex: "#10B981", 
        hsl: "160, 84%, 39%", 
        usage: "CTAs, elementos principais, sucesso",
        role: "Cor principal - transmite saúde e confiança"
      },
      { 
        name: "Secondary", 
        hex: "#1E293B", 
        hsl: "217, 33%, 17%", 
        usage: "Textos, backgrounds escuros",
        role: "Cor de suporte - profissionalismo"
      },
      { 
        name: "Accent", 
        hex: "#3B82F6", 
        hsl: "217, 91%, 60%", 
        usage: "Links, elementos interativos",
        role: "Destaque - tecnologia e inovação"
      },
      { 
        name: "Background", 
        hex: "#F8FAFC", 
        hsl: "210, 40%, 98%", 
        usage: "Fundos claros",
        role: "Base - leveza e limpeza"
      },
      { 
        name: "Success", 
        hex: "#22C55E", 
        hsl: "142, 71%, 45%", 
        usage: "Confirmações, status positivo",
        role: "Feedback positivo"
      },
      { 
        name: "Warning", 
        hex: "#F59E0B", 
        hsl: "38, 92%, 50%", 
        usage: "Alertas, atenção",
        role: "Feedback de atenção"
      },
    ],
    
    typography: {
      headings: { font: "Inter", weight: "700", fallback: "system-ui, sans-serif" },
      body: { font: "Inter", weight: "400", fallback: "system-ui, sans-serif" },
      accent: { font: "Inter", weight: "600", fallback: "system-ui, sans-serif" },
      scale: [
        { name: "Display", size: "3rem", usage: "Títulos principais" },
        { name: "H1", size: "2.25rem", usage: "Títulos de página" },
        { name: "H2", size: "1.875rem", usage: "Seções" },
        { name: "H3", size: "1.5rem", usage: "Subsections" },
        { name: "Body", size: "1rem", usage: "Texto principal" },
        { name: "Small", size: "0.875rem", usage: "Labels, captions" },
      ],
    },
    
    logoUsage: {
      minSize: "32px de altura",
      clearSpace: "Igual à altura da letra 'M' do logo",
      backgrounds: ["Funciona em fundos escuros (preferido)", "Versão light para fundos claros"],
      donts: ["Não distorcer", "Não alterar cores", "Não adicionar efeitos", "Não rotacionar"],
    },
    
    spacing: {
      base: "4px",
      scale: ["4px", "8px", "12px", "16px", "24px", "32px", "48px", "64px"],
      containerMax: "1280px",
    },
    
    borderRadius: {
      small: "4px",
      medium: "8px",
      large: "12px",
      full: "9999px",
    },
  },

  // Logo Suggestions
  logos: [
    {
      variant: "Full Color",
      description: "Logo completo com símbolo e wordmark em cores",
      usage: "Website, materiais de marketing, apresentações",
      preview: "gradient",
      colors: { primary: "#10B981", secondary: "#1E293B" }
    },
    {
      variant: "Icon Only",
      description: "Apenas o símbolo, sem texto",
      usage: "Favicon, app icon, espaços pequenos, redes sociais",
      preview: "icon",
      colors: { primary: "#10B981" }
    },
    {
      variant: "Light Mode",
      description: "Versão para fundos claros",
      usage: "Materiais impressos, fundos brancos",
      preview: "light",
      colors: { primary: "#1E293B", secondary: "#10B981" }
    },
    {
      variant: "Dark Mode",
      description: "Versão para fundos escuros",
      usage: "Headers escuros, modo noturno, overlays",
      preview: "dark",
      colors: { primary: "#FFFFFF", secondary: "#10B981" }
    },
  ],

  // Landing Page
  landingPage: {
    sections: [
      { 
        name: "Hero", 
        description: "Headline, proposta de valor, CTA principal e imagem/vídeo do produto",
        keyElements: ["Headline impactante", "Subheadline com benefício", "CTA acima da dobra", "Prova social rápida"]
      },
      { 
        name: "Problemas", 
        description: "3 dores principais que o produto resolve",
        keyElements: ["Ícones visuais", "Copy empático", "Conexão emocional"]
      },
      { 
        name: "Solução", 
        description: "Como o produto resolve cada problema",
        keyElements: ["Screenshots do produto", "Benefícios claros", "Diferencial competitivo"]
      },
      { 
        name: "Features", 
        description: "Funcionalidades principais em destaque",
        keyElements: ["Grid de features", "Ícones", "Descrições curtas"]
      },
      { 
        name: "Depoimentos", 
        description: "Prova social com clientes reais",
        keyElements: ["Fotos de clientes", "Quotes impactantes", "Logos de empresas"]
      },
      { 
        name: "Preços", 
        description: "Planos e pricing transparente",
        keyElements: ["Comparativo de planos", "CTA por plano", "Destaque do plano popular"]
      },
      { 
        name: "FAQ", 
        description: "Perguntas frequentes",
        keyElements: ["Accordion format", "Objeções comuns", "Link para suporte"]
      },
      { 
        name: "CTA Final", 
        description: "Chamada final para ação",
        keyElements: ["Urgência sutil", "CTA principal", "Opção secundária"]
      },
    ],
    
    conversionElements: [
      "CTA visível acima da dobra",
      "Prova social próxima aos CTAs",
      "Design mobile-first",
      "Carregamento rápido (<3s)",
      "Chat widget para dúvidas",
      "Exit-intent popup (opcional)",
    ],
    
    downloadNote: "Template completo de landing page incluído no pacote de download. Personalize com suas cores, copy e imagens."
  },

  // Mockup Previews (additional assets)
  mockupPreviews: [
    { type: "Cartões de Visita", description: "Frente e verso profissional", specs: "3.5\" x 2\", 350gsm" },
    { type: "Kit Redes Sociais", description: "Perfil, capa e templates de post", specs: "LinkedIn, Instagram, Facebook" },
    { type: "App Icon", description: "Ícones para iOS e Android", specs: "1024x1024 master + todos os tamanhos" },
    { type: "Email Signature", description: "Assinatura HTML com logo", specs: "600px, versões light/dark" },
    { type: "Apresentação", description: "Template de slides", specs: "16:9, Google Slides e PowerPoint" },
  ],
};
