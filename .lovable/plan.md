

# Reestruturação Estratégica da Homepage - Remover Schedule e Converter ROI Calculator

## Resumo Executivo

Aplicar duas mudanças estruturais importantes na homepage para alinhar 100% com o funil de qualificação via Planning My SaaS:

1. **Converter ROICalculator → Showcase do PMS**: Transformar a calculadora interativa em uma prévia visual do que o Planning My SaaS oferece
2. **Remover Schedule completamente**: Eliminar a seção de agendamento da homepage para que leads só possam agendar após validar no PMS

---

## Alteração 1: Converter ROICalculator em Showcase do PMS

### Conceito

Substituir a calculadora interativa (que confunde com o PMS) por uma seção de "preview" do relatório do Planning My SaaS, similar ao `PmsSampleReport.tsx` mas adaptada para a homepage.

### Novo Design

```text
┌─────────────────────────────────────────────────────────────────┐
│              See What Your Validation Report Reveals            │
│         Get AI-powered insights in minutes, not months          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                                                           │  │
│  │   [Exemplo de métricas do relatório PMS]                  │  │
│  │                                                           │  │
│  │   • Viability Score: 87/100                               │  │
│  │   • Market Size: $4.2B TAM                                │  │
│  │   • Competition: Moderate                                 │  │
│  │   • ROI Projection: 180% Year 1                           │  │
│  │   • Investment Required: $15,000                          │  │
│  │                                                           │  │
│  │   [Preview borrado de gráficos e análise]                 │  │
│  │                                                           │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  [Validate My Idea Free]              [See Full Sample Report]  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Conteúdo Proposto

**Título**: "See What Your Validation Report Reveals"

**Subtítulo**: "Get AI-powered market insights in minutes, not months. Here's what you'll discover:"

**Métricas de exemplo** (dados reais de um relatório):
- Viability Score: 87/100 (High potential)
- Market Size (TAM): $4.2B by 2026
- Competition Level: Moderate
- Market Timing: 92% (Optimal entry window)
- Investment Required: $15,000 (MVP development)
- Projected ROI Year 1: 180%

**CTAs**:
- Primário: "Validate My Idea Free" → `/planningmysaas`
- Secundário: "See Full Sample Report" → scroll para `#pricing` na página PMS

### Elementos Visuais

- Reutilizar componentes do `PmsSampleReport.tsx`:
  - `ScoreRing` para viability score
  - `ProgressBar` para market timing
  - `MetricCard` para as métricas
- Manter o estilo `glass-card` com glow amber
- Preview "borrado" de gráficos no fundo

---

## Alteração 2: Remover Schedule da Homepage

### Impacto

A seção `Schedule` será completamente removida da homepage. Leads que quiserem agendar deverão:

1. Ir para Planning My SaaS
2. Validar sua ideia
3. No dashboard do relatório, acessar a opção de agendar call

### Onde o Schedule ainda existirá

- **PMS Dashboard**: Seção "Schedule a Strategy Call" após ver o relatório
- **MeetEve**: Botões de contato (Email, Chat, Voice) continuam disponíveis para dúvidas

### Arquivo Index.tsx

Remover:
```tsx
import Schedule from "@/components/Schedule";
// ...
<Schedule />
```

### Arquivo Schedule.tsx

Manter o arquivo para uso no PMS Dashboard, mas não será mais importado na homepage.

---

## Ajustes Consequentes

### MeetEve.tsx

A seção "Meet Eve" ficará logo antes do MeetTheFounder, substituindo a posição do Schedule como último ponto de contato antes do founder.

**Ordem final das seções**:
```
Hero
Challenges
HowItWorks
Deliveries
SuccessCases
[NOVA] PMS Showcase (substitui ROICalculator)
About
Tools
PricingTransparency
FAQ
MeetEve
MeetTheFounder
Footer
```

### Links Internos

Atualizar referências a `#schedule` em outras seções:
- Links que iam para `#schedule` agora vão para `#eve` ou `/planningmysaas`

---

## Detalhes Técnicos

### Novo componente: PMSShowcase.tsx

```tsx
// Localização: src/components/PMSShowcase.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { 
  Target, DollarSign, Users, TrendingUp, 
  BarChart3, Percent, Sparkles, FileText,
  ArrowRight
} from "lucide-react";

// Reutilizar componentes do PmsSampleReport
// ScoreRing, ProgressBar, MetricCard

const PMSShowcase = () => {
  const navigate = useNavigate();
  
  // Métricas de exemplo (mesmo do PmsSampleReport)
  const sampleMetrics = [
    { label: "Viability Score", value: 87, type: "score", icon: Target },
    { label: "Market Size (TAM)", value: "$4.2B", type: "text", icon: DollarSign },
    { label: "Competition Level", value: "Moderate", type: "badge", icon: Users },
    { label: "Market Timing", value: 92, type: "percentage", icon: TrendingUp },
    { label: "Investment Required", value: "$15,000", type: "text", icon: BarChart3 },
    { label: "Projected ROI Y1", value: 180, type: "percentage", icon: Percent },
  ];
  
  return (
    <section id="validation" className="py-24 px-4 bg-card/30">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full 
                          glass-card border border-accent/30 mb-6">
            <FileText className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">
              AI-Powered Validation
            </span>
          </div>
          
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            See What Your <span className="text-gradient-gold">Validation Report</span> Reveals
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get AI-powered market insights in minutes, not months. 
            Here's what you'll discover about your SaaS idea:
          </p>
        </div>
        
        {/* Métricas Grid */}
        <div className="relative">
          <div className="absolute inset-0 bg-accent/10 blur-3xl rounded-3xl" />
          
          <div className="relative glass-card rounded-3xl border border-accent/20 p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
              {sampleMetrics.map((metric, index) => (
                <MetricCard key={index} {...metric} delay={index * 100} />
              ))}
            </div>
            
            {/* Preview borrado */}
            <div className="relative rounded-xl border border-border/50 
                            overflow-hidden bg-muted/20 p-6 mb-8">
              <div className="blur-sm select-none pointer-events-none">
                {/* Placeholder de gráficos */}
              </div>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-accent font-medium">
                  + 10 more sections in your full report
                </span>
              </div>
            </div>
            
            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                onClick={() => navigate("/planningmysaas")}
                className="bg-accent text-accent-foreground font-bold"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Validate My Idea Free
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                onClick={() => navigate("/planningmysaas#sample")}
                className="border-accent/30 hover:border-accent"
              >
                See Full Sample Report
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PMSShowcase;
```

### Atualizar Index.tsx

```tsx
// Remover
import ROICalculator from "@/components/ROICalculator";
import Schedule from "@/components/Schedule";

// Adicionar
import PMSShowcase from "@/components/PMSShowcase";

// Na ordem dos componentes:
<Hero />
<Challenges />
<HowItWorks />
<Deliveries />
<SuccessCases />
<PMSShowcase />  // Substitui ROICalculator
<About />
<Tools />
<PricingTransparency />
<FAQ />
<MeetEve />
// <Schedule /> - REMOVIDO
<MeetTheFounder />
```

### Atualizar referências a #schedule

**Arquivos a verificar**:
- `Hero.tsx` - CTAs secundários
- `HowItWorks.tsx` - CTAs
- `About.tsx` - CTAs
- `SuccessCases.tsx` - CTAs
- `PricingTransparency.tsx` - CTAs

**Substituir** `scrollToSection("schedule")` por:
- `navigate("/planningmysaas")` para CTAs primários
- `scrollToSection("eve")` para CTAs de contato

---

## Resumo das Alterações

| Arquivo | Ação |
|---------|------|
| `src/components/PMSShowcase.tsx` | **CRIAR** - Nova seção showcase do PMS |
| `src/components/ROICalculator.tsx` | **MANTER** - Não deletar, pode ser usado em outro lugar |
| `src/pages/Index.tsx` | **EDITAR** - Trocar ROICalculator por PMSShowcase, remover Schedule |
| `src/components/Hero.tsx` | **EDITAR** - Atualizar referências a #schedule |
| `src/components/HowItWorks.tsx` | **EDITAR** - Atualizar referências a #schedule |
| `src/components/About.tsx` | **EDITAR** - Atualizar referências a #schedule |
| `src/components/SuccessCases.tsx` | **EDITAR** - Atualizar referências a #schedule |
| `src/components/PricingTransparency.tsx` | **EDITAR** - Atualizar referências a #schedule |

---

## Impacto no Funil

**Antes**:
```
Home (ROI Calculator) → Schedule → Desenvolvimento
              ↓
         [Confusão com PMS]
```

**Depois**:
```
Home (PMS Showcase) → Planning My SaaS → Qualificação → Dashboard → Schedule
         ↓                    ↓
    [Prévia do valor]   [Validação real]
```

**Benefícios**:
1. Zero confusão entre calculadora e PMS
2. 100% dos leads passam pela qualificação
3. Closers só recebem leads qualificados
4. Valor do PMS é demonstrado na homepage

