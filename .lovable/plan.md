
# Melhorias na Página Pública de Compartilhamento

## Problema 1: Footer "Grudado"

O `SharedReportFooter` está renderizado imediatamente após o `BusinessPlanTab` sem espaçamento vertical adequado.

**Solução**: Adicionar margin-top ao footer para criar separação visual.

## Problema 2: Falta de Contexto para o Destinatário

Quem recebe o link compartilhado não sabe imediatamente qual relatório está visualizando. Falta um "hero" com o nome do projeto e o score de viabilidade.

**Solução**: Criar um hero simplificado específico para a página pública, reutilizando a lógica do `ReportHero` existente mas de forma mais compacta.

---

## Arquivos a Modificar/Criar

### 1. Novo Componente: `SharedReportHero.tsx`

Criar um hero compacto para a página pública com:
- Badge "Shared Business Plan"
- Nome do projeto (extraído do `wizard_snapshot.saas_name`)
- Score de viabilidade em formato visual (anel circular)
- Tagline/veredicto curto

**Localização**: `src/components/planningmysaas/public/SharedReportHero.tsx`

```tsx
// Estrutura proposta:
<div className="text-center py-12 space-y-6">
  <Badge>Shared Business Plan</Badge>
  <h1>Nome do Projeto</h1>
  
  {/* Score Ring (versão compacta do ReportHero) */}
  <div className="w-24 h-24">
    <ScoreRing score={68} />
  </div>
  
  <p className="text-accent">Tagline do veredicto</p>
</div>
```

### 2. Modificar: `PmsSharedReport.tsx`

- Importar e adicionar o novo `SharedReportHero` após o header
- Adicionar classe `mt-12` antes do `SharedReportFooter` para espaçamento

```tsx
// Estrutura atualizada:
<main className="pt-24 pb-16">
  <div className="max-w-5xl mx-auto px-4 lg:px-6">
    <SharedReportHero />    {/* NOVO: Hero com nome e score */}
    <BusinessPlanTab />
    <div className="mt-12">  {/* NOVO: Espaçamento */}
      <SharedReportFooter />
    </div>
  </div>
</main>
```

---

## Detalhes Técnicos

### Dados para o SharedReportHero

O `SharedReportContext` já fornece:
- `report.saas_name` - nome do projeto (via `wizard_snapshot`)
- `reportData.hero_score_section.score` - score de viabilidade
- `reportData.hero_score_section.tagline` - tagline do veredicto

### Estilo do Score Ring

Reutilizar o SVG do `ReportHero` existente, mas em tamanho menor (w-24 h-24) para um visual mais compacto adequado à página pública.

---

## Resultado Visual Esperado

```text
┌─────────────────────────────────────────┐
│  [Header com logo e badge]              │
├─────────────────────────────────────────┤
│                                         │
│        🏷️ Shared Business Plan          │
│                                         │
│        **Nome do Projeto**              │
│                                         │
│            ┌─────┐                      │
│            │  68 │  <- Score Ring       │
│            └─────┘                      │
│                                         │
│   "Tagline de viabilidade do projeto"   │
│                                         │
├─────────────────────────────────────────┤
│  [BusinessPlanTab - conteúdo atual]     │
│           ...                           │
│           ...                           │
├─────────────────────────────────────────┤
│                                         │  <- NOVO: mt-12 gap
│  [SharedReportFooter - CTA + credits]   │
│                                         │
└─────────────────────────────────────────┘
```
