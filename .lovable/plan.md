

# Banner Hero Premium para Página Pública Compartilhada

## Visão

Criar um banner visual impactante que impressione quem receber o link, transmitindo profissionalismo e credibilidade. O design será inspirado no `ReportHero.tsx` do dashboard, com efeitos visuais premium e uma apresentação imersiva.

## Design Proposto

```text
┌─────────────────────────────────────────────────────────────────┐
│  ░░░░░░░░░░░░░ Aurora Background + Gradient Orbs ░░░░░░░░░░░░░  │
│                                                                 │
│              ✨ Shared Business Plan (badge)                    │
│                                                                 │
│         ╔═══════════════════════════════════════╗               │
│         ║                                       ║               │
│         ║    NOME DO PROJETO (h1 grande)        ║               │
│         ║                                       ║               │
│         ╚═══════════════════════════════════════╝               │
│                                                                 │
│                    ┌─────────────┐                              │
│                    │             │                              │
│                    │     68      │   ← Score Ring c/ Glow       │
│                    │  Viability  │                              │
│                    │             │                              │
│                    └─────────────┘                              │
│                                                                 │
│           "Tagline de viabilidade do projeto"                   │
│                                                                 │
│    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│    │  📈 $713B    │  │  💰 4.2x     │  │  ⏱️ 8 mo     │         │
│    │  Total Market│  │  LTV/CAC     │  │  Payback     │         │
│    └──────────────┘  └──────────────┘  └──────────────┘         │
│                                                                 │
│                    ▼ (scroll indicator)                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## Elementos Visuais Premium

1. **Background Aurora**: Efeito de fundo com gradiente animado sutil
2. **Gradient Orbs**: Esferas desfocadas de cor accent criando profundidade
3. **Score Ring com Glow**: Anel de progresso animado com gradiente dourado e brilho
4. **Glass Cards**: Cards com backdrop-blur e bordas douradas sutis
5. **Animações**: fade-in suave ao carregar

## Arquivo a Modificar

**`src/components/planningmysaas/public/SharedReportHero.tsx`**

Reescrever completamente com:
- Background effects (aurora-bg, gradient orbs)
- Score ring SVG grande (w-32 h-32) com gradiente e glow
- 3 métricas chave em glass cards (TAM, LTV/CAC, Payback)
- Scroll indicator animado
- Layout responsivo (mobile-first)

## Dados a Utilizar

Do `SharedReportContext`:
- `report.saas_name` - Nome do projeto
- `reportData.hero_score_section.score` - Score de viabilidade
- `reportData.hero_score_section.tagline` - Tagline do veredicto
- `reportData.opportunity_section.tam_value` - TAM
- Usar `useFinancialMetrics` para LTV/CAC e Payback

## Componentes Técnicos

### Score Ring SVG

```tsx
<svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="42" strokeWidth="7" className="text-muted/20" />
  <circle 
    cx="50" cy="50" r="42" 
    stroke="url(#scoreGradient)"
    strokeDasharray={`${(score/100) * 2 * Math.PI * 42} ${2 * Math.PI * 42}`}
    filter="url(#glow)"
  />
</svg>
```

### Glass Cards para Métricas

```tsx
<Card className="glass-premium border-accent/20 p-5 hover:border-accent/40 transition-colors">
  <div className="p-2 rounded-lg bg-accent/10">
    <Icon className="h-4 w-4 text-accent" />
  </div>
  <div className="text-2xl font-bold text-foreground">{value}</div>
  <div className="text-sm text-muted-foreground">{label}</div>
</Card>
```

## Resultado Esperado

Um hero visualmente impressionante que:
1. Comunica imediatamente qual é o projeto
2. Mostra o score de viabilidade de forma impactante
3. Apresenta métricas-chave que validam a análise
4. Transmite profissionalismo e credibilidade
5. Incentiva a leitura completa do relatório

