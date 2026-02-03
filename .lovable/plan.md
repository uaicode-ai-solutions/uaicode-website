

# Plano: Adicionar Chart Roadmap Timeline (Sem Quebrar Funcionalidades)

## Arquivos Impactados

| Arquivo | Tipo de Alteração | Risco |
|---------|-------------------|-------|
| `src/types/report.ts` | Adicionar campo opcional | Baixo |
| `src/components/planningmysaas/public/SharedReportCharts.tsx` | Adicionar novo case + componente | Baixo |
| `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx` | Adicionar novo case + componente | Baixo |
| `src/lib/businessPlanPdfExport.ts` | Adicionar novo case | Baixo |

## Garantias de Compatibilidade

1. **Campo opcional**: O novo `roadmap_timeline?` e opcional, entao reports antigos sem esse campo continuam funcionando
2. **Graceful degradation**: Se dados nao existirem, o componente retorna `null` (nao renderiza nada)
3. **Fallback existente**: O `default` case no switch ja existe e funciona para tipos desconhecidos
4. **Sem breaking changes**: Nenhum campo existente e modificado ou removido

## Alteracoes Detalhadas

### 1. Types (src/types/report.ts)

Adicionar ao `BusinessPlanChartsData` interface (linha ~1700):

```typescript
export interface BusinessPlanChartsData {
  market_sizing?: { /* ... existente ... */ };
  financial_projections?: { /* ... existente ... */ };
  competitor_pricing?: Array<{ /* ... existente ... */ }>;
  investment_breakdown?: Array<{ /* ... existente ... */ }>;
  
  // NOVO: Roadmap Timeline
  roadmap_timeline?: Array<{
    phase: string;      // "Phase 1: MVP"
    focus: string;      // "Core platform functionality..."
    timeline: string;   // "13-23 weeks"
    outcomes: string[]; // ["Launch secure platform", ...]
  }>;
}
```

### 2. SharedReportCharts.tsx (Pagina Publica)

Adicionar novo case no switch e componente:

```typescript
// No SharedChartRenderer switch (linha ~44):
case "roadmap_timeline":
  return <SharedRoadmapTimelineChart data={data.roadmap_timeline} />;

// Novo componente (apos Investment Breakdown):
const SharedRoadmapTimelineChart = ({ 
  data 
}: { 
  data?: BusinessPlanChartsData["roadmap_timeline"] 
}) => {
  if (!data || data.length === 0) return null;
  // ... implementacao visual
};
```

### 3. BusinessPlanTab.tsx (Dashboard)

Adicionar mesmo chart ao dashboard interno:

```typescript
// No ChartRenderer switch (linha ~86):
case "roadmap_timeline":
  return <RoadmapTimelineChart data={data.roadmap_timeline} />;

// Novo componente (apos Investment Breakdown):
const RoadmapTimelineChart = ({ 
  data 
}: { 
  data?: BusinessPlanChartsData["roadmap_timeline"] 
}) => {
  if (!data || data.length === 0) return null;
  // ... mesma implementacao visual
};
```

### 4. businessPlanPdfExport.ts (PDF)

Adicionar case para exportar timeline como tabela:

```typescript
// No switch (linha ~278, antes do default):
case "roadmap_timeline": {
  const data = chartsData.roadmap_timeline;
  if (!data || data.length === 0) return yPos;

  pdf.text("Product Roadmap", tableStartX, yPos);
  yPos += 8;

  data.forEach((phase) => {
    // Render phase name + timeline
    pdf.setFont("helvetica", "bold");
    pdf.text(`${phase.phase} (${phase.timeline})`, tableStartX + 5, yPos);
    yPos += LINE_HEIGHT;
    
    // Render focus
    pdf.setFont("helvetica", "normal");
    const focusLines = pdf.splitTextToSize(phase.focus, CONTENT_WIDTH - 10);
    focusLines.forEach((line: string) => {
      pdf.text(line, tableStartX + 5, yPos);
      yPos += LINE_HEIGHT;
    });
    
    // Render outcomes
    phase.outcomes.forEach((outcome) => {
      pdf.text(`• ${outcome}`, tableStartX + 10, yPos);
      yPos += LINE_HEIGHT;
    });
    
    yPos += 5;
  });

  break;
}
```

## Design Visual do Componente

O timeline tera design responsivo:

### Desktop (Horizontal)
```text
┌──────────────────────────────────────────────────────────┐
│  📅 Product Roadmap                                      │
├──────────────────────────────────────────────────────────┤
│                                                          │
│  ●────────────────●────────────────●                     │
│  │                │                │                     │
│ Phase 1          Phase 2         Phase 3                │
│ 13-23 weeks      +3-6 months     +6-12 months           │
│                                                          │
│ • Core platform  • Advanced       • Prescription        │
│ • Discovery      filtering        support               │
│ • Booking        • Progress       • EHR integrations   │
│                  tracking                               │
└──────────────────────────────────────────────────────────┘
```

### Mobile (Vertical)
```text
┌─────────────────────┐
│ 📅 Product Roadmap  │
├─────────────────────┤
│  ●                  │
│  │ Phase 1: MVP     │
│  │ 13-23 weeks      │
│  │ • Core platform  │
│  │ • Discovery      │
│  │                  │
│  ●                  │
│  │ Phase 2          │
│  │ +3-6 months      │
│  │ ...              │
└─────────────────────┘
```

## Codigo do Componente Timeline

```typescript
const RoadmapTimelineChart = ({ 
  data 
}: { 
  data?: BusinessPlanChartsData["roadmap_timeline"] 
}) => {
  if (!data || data.length === 0) return null;

  return (
    <Card className="glass-card border-accent/20 my-6">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg flex items-center gap-2">
          <Calendar className="h-5 w-5 text-accent" />
          Product Roadmap
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden md:block">
          <div className="relative">
            {/* Connecting Line */}
            <div 
              className="absolute top-4 h-0.5 bg-accent/30" 
              style={{ 
                left: `${100 / (data.length * 2)}%`, 
                right: `${100 / (data.length * 2)}%` 
              }} 
            />
            
            {/* Phases Grid */}
            <div 
              className="grid gap-4" 
              style={{ gridTemplateColumns: `repeat(${data.length}, 1fr)` }}
            >
              {data.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="w-8 h-8 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center mb-4 mx-auto z-10 relative">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Phase Content */}
                  <div className="p-4 rounded-lg bg-muted/10 border border-border/30">
                    <h4 className="font-semibold text-foreground text-sm mb-1 text-center">
                      {phase.phase}
                    </h4>
                    <p className="text-xs text-accent mb-2 text-center">
                      {phase.timeline}
                    </p>
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                      {phase.focus}
                    </p>
                    <ul className="space-y-1">
                      {phase.outcomes.slice(0, 3).map((outcome, i) => (
                        <li 
                          key={i} 
                          className="text-xs text-muted-foreground flex items-start gap-1.5"
                        >
                          <span className="text-accent shrink-0">•</span>
                          <span className="line-clamp-1">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        {/* Mobile: Vertical Timeline */}
        <div className="md:hidden">
          <div className="relative pl-6">
            {/* Vertical Line */}
            <div className="absolute left-3 top-4 bottom-4 w-0.5 bg-accent/30" />
            
            <div className="space-y-6">
              {data.map((phase, index) => (
                <div key={index} className="relative">
                  {/* Timeline Dot */}
                  <div className="absolute -left-6 w-6 h-6 rounded-full bg-accent/20 border-2 border-accent flex items-center justify-center">
                    <span className="text-xs font-bold text-accent">
                      {index + 1}
                    </span>
                  </div>
                  
                  {/* Phase Content */}
                  <div className="p-3 rounded-lg bg-muted/10 border border-border/30 ml-2">
                    <h4 className="font-semibold text-foreground text-sm">
                      {phase.phase}
                    </h4>
                    <p className="text-xs text-accent mb-2">{phase.timeline}</p>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {phase.focus}
                    </p>
                    <ul className="space-y-0.5">
                      {phase.outcomes.slice(0, 2).map((outcome, i) => (
                        <li 
                          key={i} 
                          className="text-xs text-muted-foreground flex items-start gap-1"
                        >
                          <span className="text-accent">•</span>
                          <span className="line-clamp-1">{outcome}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
```

## Acao Necessaria no n8n

Apos implementar a UI, atualizar o prompt do Document Writer para incluir no `charts_data`:

```json
"roadmap_timeline": [
  {
    "phase": "Phase 1: MVP",
    "focus": "Core platform functionality for provider discovery, vetting, and booking.",
    "timeline": "13-23 weeks",
    "outcomes": ["Launch secure platform", "Connect users with verified professionals"]
  },
  {
    "phase": "Phase 2: Feature Expansion",
    "focus": "Introduce advanced filtering, progress tracking, and behavioral coaches.",
    "timeline": "+3-6 months",
    "outcomes": ["Enhance user engagement", "Expand professional network"]
  },
  {
    "phase": "Phase 3: Scaling",
    "focus": "Implement prescription support and EHR integrations.",
    "timeline": "+6-12 months",
    "outcomes": ["Establish comprehensive ecosystem", "Explore new monetization"]
  }
]
```

## Checklist de Validacao

Antes de deploy, verificar:

- [ ] Reports antigos (sem `roadmap_timeline`) continuam funcionando
- [ ] Os 4 charts existentes continuam renderizando corretamente
- [ ] O novo chart aparece apenas quando dados existem
- [ ] PDF export funciona com e sem dados de roadmap
- [ ] Layout responsivo (desktop horizontal, mobile vertical)
- [ ] Cores consistentes com tema gold/amber

