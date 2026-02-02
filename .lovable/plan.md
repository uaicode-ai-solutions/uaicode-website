

# Plano: Banners "Call to Action" no Final das Telas Report e My Plan

## Objetivo
Adicionar um banner premium com visual UaiCode no **final** das telas Report e My Plan que incentive o usuário a ir para a aba Next Steps.

---

## Estratégia: Banner Reutilizável Inline

Vou criar um **componente inline** dentro do próprio PmsDashboard para o banner, seguindo o padrão visual UaiCode (gradiente amber/gold, bordas com brilho).

### Design Visual do Banner

```text
┌─────────────────────────────────────────────────────────────────────┐
│  🚀  Ready to Turn This Analysis Into Reality?                     │
│                                                                     │
│  Your exclusive discount expires in 47:59:32. Lock in your          │
│  pricing now and start building with Uaicode.                       │
│                                                                     │
│                                    [ View Next Steps → ]            │
└─────────────────────────────────────────────────────────────────────┘
```

**Características visuais:**
- Fundo com gradiente `from-amber-500/10 via-yellow-500/5 to-amber-500/10`
- Borda amber com glow sutil `border-amber-500/30 shadow-amber-500/10`
- Ícone Rocket animado (pulse suave)
- Texto principal em branco, subtexto em muted
- Botão CTA com gradiente amber → yellow

---

## Alterações (Apenas PmsDashboard.tsx)

### Alteração 1: Criar componente local `NextStepsCTABanner`

Dentro do PmsDashboard, vou definir um componente funcional simples:

```typescript
const NextStepsCTABanner = ({ onViewNextSteps }: { onViewNextSteps: () => void }) => (
  <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-amber-500/10 via-yellow-500/5 to-amber-500/10 border border-amber-500/30 shadow-lg shadow-amber-500/5">
    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/30 to-yellow-500/20 animate-pulse">
          <Rocket className="h-6 w-6 text-amber-400" />
        </div>
        <div className="text-center md:text-left">
          <h3 className="text-xl font-bold text-foreground">
            Ready to Turn This Analysis Into Reality?
          </h3>
          <p className="text-muted-foreground mt-1">
            Lock in your exclusive discount and start building with Uaicode.
          </p>
        </div>
      </div>
      <Button 
        onClick={onViewNextSteps}
        size="lg"
        className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black font-semibold hover:from-amber-400 hover:to-yellow-400 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 transition-all hover:scale-105"
      >
        View Next Steps
        <ArrowRight className="h-5 w-5" />
      </Button>
    </div>
  </div>
);
```

**Localização:** Entre as linhas 70-90 (após imports, antes do componente principal)

---

### Alteração 2: Adicionar banner no final da tab Report (linha ~522)

```typescript
{activeTab === "report" && (
  <div className="space-y-16">
    <ReportHero projectName={projectName} onScheduleCall={handleScheduleCall} />
    <ExecutiveVerdict />
    {/* ... outras seções ... */}
    <WhyUaicodeSection />
    
    {/* NOVO: Banner CTA para Next Steps */}
    <NextStepsCTABanner onViewNextSteps={() => setActiveTab("nextsteps")} />
  </div>
)}
```

---

### Alteração 3: Adicionar banner no final da tab My Plan (linha ~545)

```typescript
{activeTab === "businessplan" && (
  <>
    {/* Banner superior existente - MANTER */}
    <div className="mb-6 p-4 rounded-xl ...">
      ...
    </div>
    
    <BusinessPlanTab />
    
    {/* NOVO: Banner CTA no final */}
    <NextStepsCTABanner onViewNextSteps={() => setActiveTab("nextsteps")} />
  </>
)}
```

---

## Resumo de Alterações

| Local | Tipo | Linhas |
|-------|------|--------|
| PmsDashboard.tsx | Criar componente `NextStepsCTABanner` | +25 |
| PmsDashboard.tsx | Adicionar banner no final da tab Report | +3 |
| PmsDashboard.tsx | Adicionar banner no final da tab My Plan | +3 |

**Total: ~31 linhas adicionadas em 1 ÚNICO arquivo**

---

## Arquivos Tocados

| Arquivo | Ação |
|---------|------|
| `src/pages/PmsDashboard.tsx` | Modificar |

**Nenhum outro arquivo será tocado.**

---

## Fluxo Visual Final

```text
Report Tab
├── 15 seções de análise
├── WhyUaicodeSection
└── 🆕 NextStepsCTABanner → "View Next Steps" → vai para Next Steps

My Plan Tab  
├── Banner topo (pequeno) ← já existe
├── BusinessPlanTab
└── 🆕 NextStepsCTABanner → "View Next Steps" → vai para Next Steps

Next Steps Tab
├── NextStepsSection
└── ScheduleCallSection
```

---

## Segurança

- **Zero alterações** em componentes existentes
- Apenas adição de conteúdo novo
- Reutiliza ícones já importados (Rocket, ArrowRight)
- Componente inline = sem novos arquivos

