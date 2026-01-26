

# Plano: Agente de IA para Geração de Logo com Justificativa de Mercado

## Resumo

Criar um agente de IA inteligente que usa conhecimento profundo de branding e marketing para gerar logos 2D flat. O agente terá dois modos:
- **Create with AI**: Analisa a descrição do SaaS e gera um logo do zero
- **Improve with AI**: Analisa o logo existente + descrição para melhorar o logo

O popup incluirá uma **descrição detalhada** que explica o logo gerado e sua **justificativa frente às tendências de mercado**.

---

## Arquitetura do Agente

```text
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUXO CREATE WITH AI                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────────────┐  │
│  │  STEP 1      │     │  STEP 2            │     │  STEP 3               │  │
│  │  Análise     │────▶│  Pesquisa Cores    │────▶│  Pesquisa Formas      │  │
│  │  Descrição   │     │  + Tendências      │     │  Vetoriais            │  │
│  └──────────────┘     └────────────────────┘     └───────────────────────┘  │
│        │                                                    │               │
│        │              ┌───────────────────────┐             │               │
│        └─────────────▶│  STEP 4               │◀────────────┘               │
│                       │  Gerar Prompt +       │                             │
│                       │  Justificativa        │                             │
│                       └───────────────────────┘                             │
│                                    │                                        │
│                       ┌───────────────────────┐                             │
│                       │  STEP 5               │                             │
│                       │  Nano Banana          │                             │
│                       │  (gemini-2.5-flash-   │                             │
│                       │   image)              │                             │
│                       └───────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────────┐
│                          FLUXO IMPROVE WITH AI                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────────────┐  │
│  │  STEP 1      │     │  STEP 2            │     │  STEP 3               │  │
│  │  Análise     │────▶│  Análise Logo      │────▶│  Pesquisa Cores       │  │
│  │  Descrição   │     │  Existente         │     │  + Tendências         │  │
│  └──────────────┘     │  (cores/formas)    │     └───────────────────────┘  │
│                       └────────────────────┘              │                 │
│                               │                           │                 │
│        ┌──────────────────────┘                           │                 │
│        ▼                                                  ▼                 │
│  ┌──────────────┐     ┌────────────────────┐     ┌───────────────────────┐  │
│  │  STEP 4      │────▶│  STEP 5            │────▶│  STEP 6               │  │
│  │  Pesquisa    │     │  Mesclar Insights  │     │  Gerar Prompt +       │  │
│  │  Formas      │     │  (Logo + Nicho)    │     │  Justificativa        │  │
│  └──────────────┘     └────────────────────┘     └───────────────────────┘  │
│                                                           │                 │
│                       ┌───────────────────────┐           │                 │
│                       │  STEP 7               │◀──────────┘                 │
│                       │  Nano Banana          │                             │
│                       └───────────────────────┘                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/pms-generate-logo/index.ts` | CRIAR | Edge Function com agente de IA |
| `supabase/config.toml` | MODIFICAR | Adicionar configuração da nova função |
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | MODIFICAR | Implementar chamada e popup |

---

## 1. Edge Function: `pms-generate-logo`

### Input da Função

```typescript
interface RequestBody {
  description: string;       // Descrição do SaaS (obrigatório)
  saasType?: string;        // Tipo do SaaS (crm, project, etc)
  industry?: string;        // Indústria alvo
  existingLogo?: string;    // Base64 do logo atual (se improve)
  mode: "create" | "improve";
}
```

### Output da Função

```typescript
interface ResponseBody {
  logoUrl: string;           // Base64 da imagem gerada
  logoDescription: string;   // Descrição do logo (2-3 frases)
  marketJustification: string; // Justificativa frente às tendências de mercado
}
```

### System Prompt do Agente (Gemini Flash)

```text
You are an expert brand strategist and visual identity designer with 20+ years 
of experience in SaaS and tech startups. You have deep knowledge of market 
trends, color psychology, and visual communication.

Your task is to analyze a SaaS product and create a detailed image generation 
prompt for a 2D flat logo, along with comprehensive branding rationale.

ANALYSIS REQUIREMENTS:

1. BRAND ESSENCE: Identify the core value proposition and emotional appeal
   - What problem does this SaaS solve?
   - What feelings should the brand evoke?

2. COLOR PSYCHOLOGY & MARKET TRENDS: Research and recommend 2-3 colors based on:
   - Current industry standards and competitor analysis
   - Psychological impact on target audience
   - 2024-2025 design trends in the specific niche
   - Cultural associations and trust signals

3. SHAPE LANGUAGE & SYMBOLISM: Recommend geometric elements based on:
   - Brand personality (trustworthy, innovative, friendly, professional)
   - Industry visual conventions and expectations
   - Symbolic meaning (circles = unity/community, triangles = growth/innovation, 
     squares = stability/trust, etc.)
   - Current design trends in logo iconography

4. STYLE DIRECTION: Define visual approach:
   - Minimalist vs detailed
   - Abstract vs literal representation
   - Geometric vs organic shapes

LOGO GENERATION RULES (CRITICAL - MUST FOLLOW):
- MUST be 2D flat design (absolutely NO gradients, NO 3D effects, NO shadows)
- NO text, letters, or typography - PURE ICONOGRAPHIC SYMBOL ONLY
- Clean vector-style appearance with solid colors
- Simple enough to work at small sizes (favicon)
- Modern and professional aesthetic
- Maximum 3 colors (including white if used)
- Suitable for both light and dark backgrounds
- Icon should be centered in a square composition

RESPONSE REQUIREMENTS:
You must provide:
1. A detailed image generation prompt
2. A description of the logo design (2-3 sentences explaining what it depicts)
3. A market justification (2-3 sentences explaining why this design aligns with 
   current market trends and industry standards)
```

### Tool Calling para Estruturar Output

```typescript
tools: [{
  type: "function",
  function: {
    name: "generate_logo_design",
    description: "Generate a complete logo design specification with branding rationale",
    parameters: {
      type: "object",
      properties: {
        imagePrompt: {
          type: "string",
          description: "Detailed prompt for Nano Banana image generation (must specify 2D flat, no text, vector style)"
        },
        primaryColor: {
          type: "string",
          description: "Primary brand color with hex code (e.g., 'Deep Blue #1E40AF')"
        },
        secondaryColor: {
          type: "string", 
          description: "Secondary accent color with hex code (e.g., 'Vibrant Teal #14B8A6')"
        },
        logoDescription: {
          type: "string",
          description: "Description of the logo design in 2-3 sentences. Explain what the icon represents and its visual elements."
        },
        marketJustification: {
          type: "string",
          description: "2-3 sentences explaining why this design aligns with current market trends, industry standards, and target audience expectations."
        }
      },
      required: ["imagePrompt", "primaryColor", "secondaryColor", "logoDescription", "marketJustification"]
    }
  }
}]
```

### Fluxo de Execução

```typescript
// 1. Primeira chamada: Análise de branding com Gemini Flash
const analysisResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash",
    messages: [
      { role: "system", content: BRAND_ANALYST_PROMPT },
      { 
        role: "user", 
        content: mode === "improve" && existingLogo 
          ? [
              { type: "text", text: buildAnalysisPrompt(description, saasType, industry, true) },
              { type: "image_url", image_url: { url: existingLogo } }
            ]
          : buildAnalysisPrompt(description, saasType, industry, false)
      }
    ],
    tools: [/* generate_logo_design tool */],
    tool_choice: { type: "function", function: { name: "generate_logo_design" } }
  })
});

// 2. Extrair dados do tool call
const { imagePrompt, logoDescription, marketJustification } = parseToolCall(analysisResponse);

// 3. Segunda chamada: Gerar imagem com Nano Banana
const imageResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
  method: "POST",
  headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
  body: JSON.stringify({
    model: "google/gemini-2.5-flash-image",  // Nano Banana
    messages: [{ role: "user", content: imagePrompt }],
    modalities: ["image", "text"]
  })
});

// 4. Retornar resultado
return {
  logoUrl: imageResponse.choices[0].message.images[0].image_url.url,
  logoDescription,
  marketJustification
};
```

### Prompt para Modo "Improve"

Quando há um logo existente, o prompt inclui:

```text
EXISTING LOGO ANALYSIS:
I have uploaded the current logo. Please analyze it to identify:
- Current color palette being used
- Shape language and geometric elements
- Overall style and aesthetic
- Strengths to preserve
- Weaknesses to address

Then create an IMPROVED version that:
- Maintains brand recognition (evolves rather than revolutionizes)
- Addresses identified weaknesses
- Aligns better with current market trends
- Improves visual clarity and scalability
```

---

## 2. Frontend: StepYourIdea.tsx

### Novos Estados

```typescript
const [showLogoDialog, setShowLogoDialog] = useState(false);
const [generatedLogo, setGeneratedLogo] = useState("");
const [logoDescription, setLogoDescription] = useState("");
const [logoMarketJustification, setLogoMarketJustification] = useState("");
```

### Implementação da Função `handleAILogo`

```typescript
const handleAILogo = async (retryCount = 0) => {
  if (!isDescriptionValid) {
    toast.error("Please fill in the description first (min 20 characters)");
    return;
  }
  
  setIsGeneratingLogo(true);
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 90000); // 90s para geração de imagem
  
  try {
    const response = await fetch(
      'https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-generate-logo',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': '...'
        },
        body: JSON.stringify({
          description: data.description,
          saasType: data.saasType,
          industry: data.industry,
          existingLogo: data.saasLogo || undefined,
          mode: data.saasLogo ? "improve" : "create"
        }),
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }
    
    const result = await response.json();
    
    if (result?.logoUrl) {
      setGeneratedLogo(result.logoUrl);
      setLogoDescription(result.logoDescription || "");
      setLogoMarketJustification(result.marketJustification || "");
      setShowLogoDialog(true);
    }
  } catch (error: any) {
    clearTimeout(timeoutId);
    console.error("Error generating logo:", error);
    
    // Retry logic para erros transitórios
    if (retryCount < 2 && (
      error?.message?.includes('Failed to fetch') || 
      error?.message?.includes('NetworkError') ||
      error?.name === 'AbortError'
    )) {
      console.log(`Retrying... attempt ${retryCount + 2}`);
      await new Promise(resolve => setTimeout(resolve, 2000));
      return handleAILogo(retryCount + 1);
    }
    
    if (error?.message?.includes('429')) {
      toast.error("Rate limit exceeded. Please try again later.");
    } else if (error?.message?.includes('402')) {
      toast.error("Payment required. Please add credits to continue.");
    } else {
      toast.error("Failed to generate logo. Please try again.");
    }
  } finally {
    setIsGeneratingLogo(false);
  }
};
```

### Popup de Aprovação com Descrição e Justificativa

```tsx
<AlertDialog open={showLogoDialog} onOpenChange={setShowLogoDialog}>
  <AlertDialogContent className="max-w-lg">
    <AlertDialogHeader>
      <AlertDialogTitle className="flex items-center gap-2">
        <Sparkles className="w-5 h-5 text-accent" />
        {data.saasLogo ? "AI Logo Improvement" : "AI Generated Logo"}
      </AlertDialogTitle>
      <AlertDialogDescription>
        {data.saasLogo 
          ? "Here's an improved version of your logo based on market analysis"
          : "Here's a logo created based on your SaaS description and market trends"}
      </AlertDialogDescription>
    </AlertDialogHeader>
    
    <div className="my-6 space-y-4">
      {/* Preview do Logo Gerado */}
      <div className="flex justify-center">
        <div className="w-32 h-32 rounded-xl border-2 border-accent/50 
                        overflow-hidden bg-white flex items-center justify-center p-4">
          <img 
            src={generatedLogo} 
            alt="Generated logo" 
            className="max-w-full max-h-full object-contain"
          />
        </div>
      </div>
      
      {/* Descrição do Logo */}
      {logoDescription && (
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-accent" />
            About this design
          </h4>
          <p className="text-sm text-muted-foreground">
            {logoDescription}
          </p>
        </div>
      )}
      
      {/* Justificativa de Mercado */}
      {logoMarketJustification && (
        <div className="bg-accent/5 border border-accent/20 rounded-lg p-4 space-y-2">
          <h4 className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BarChart className="w-4 h-4 text-accent" />
            Market alignment
          </h4>
          <p className="text-sm text-muted-foreground">
            {logoMarketJustification}
          </p>
        </div>
      )}
    </div>
    
    <AlertDialogFooter>
      <AlertDialogCancel onClick={() => handleAILogo()}>
        Try Another
      </AlertDialogCancel>
      <AlertDialogAction 
        onClick={() => {
          onChange("saasLogo", generatedLogo);
          setShowLogoDialog(false);
          setGeneratedLogo("");
          setLogoDescription("");
          setLogoMarketJustification("");
          toast.success("Logo applied!");
        }} 
        className="bg-accent hover:bg-accent/90"
      >
        Use This Logo
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

---

## 3. Configuração do Supabase

Adicionar ao `supabase/config.toml`:

```toml
[functions.pms-generate-logo]
verify_jwt = false
```

---

## Fluxo Visual do Popup

```text
┌─────────────────────────────────────────────────────────────┐
│  ✨ AI Generated Logo                                       │
│                                                             │
│  Here's a logo created based on your SaaS description      │
│  and market trends                                          │
│                                                             │
│              ┌──────────────────────┐                       │
│              │                      │                       │
│              │      [LOGO IMG]      │                       │
│              │                      │                       │
│              └──────────────────────┘                       │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 🖼️ About this design                                │   │
│  │                                                      │   │
│  │ A modern circular icon featuring interconnected      │   │
│  │ nodes representing seamless data flow. The gradient  │   │
│  │ blue tones convey trust and technology.              │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐   │
│  │ 📊 Market alignment                                  │   │
│  │                                                      │   │
│  │ This design aligns with 2024 SaaS trends favoring    │   │
│  │ minimalist icons and blue color palettes that signal │   │
│  │ reliability. Competitors in the CRM space use        │   │
│  │ similar geometric approaches for brand recognition.  │   │
│  └─────────────────────────────────────────────────────┘   │
│                                                             │
│              [Try Another]  [Use This Logo]                 │
└─────────────────────────────────────────────────────────────┘
```

---

## Detalhes Técnicos

### Timeout e Retry

- Timeout de 90 segundos (geração de imagem + análise)
- Retry automático até 2 vezes para erros de rede
- Delay de 2 segundos entre retries

### Validações

- Descrição mínima de 20 caracteres
- Rate limiting (429) e pagamento (402) tratados
- Fallback para erros de rede

### Imports Necessários

O componente `StepYourIdea.tsx` já possui todos os imports necessários:
- `AlertDialog` e componentes relacionados
- `Sparkles`, `Loader2`, `ImageIcon`, `BarChart` (Lucide icons)
- `toast` do Sonner

---

## Resultado Esperado

1. Usuário clica em "Create with AI" ou "Improve with AI"
2. Botão mostra "Generating..." com spinner (até 90s)
3. Agente de IA analisa a descrição, tipo e indústria
4. Pesquisa tendências de mercado e psicologia de cores
5. Gera prompt otimizado para logo 2D flat
6. Nano Banana cria a imagem
7. Popup exibe:
   - **Logo gerado** em destaque
   - **Descrição** explicando os elementos visuais
   - **Justificativa de mercado** explicando alinhamento com tendências
8. Usuário pode aprovar, rejeitar ou pedir outra opção

