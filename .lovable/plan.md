
# Plano: Remover Banner Superior da Tela My Plan

## Objetivo
Remover o banner pequeno "Ready to start building?" do **topo** da aba "My Plan", mantendo apenas o banner maior `NextStepsCTABanner` no **rodapé**.

---

## Alteração Única

**Arquivo:** `src/pages/PmsDashboard.tsx`

**Linhas 559-575** - Remover o banner superior inline:

```typescript
// REMOVER ESTE BLOCO (linhas 559-575):
{/* CTA Banner para Next Steps */}
<div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border border-amber-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
  <div className="flex items-center gap-3">
    <Rocket className="h-5 w-5 text-amber-400" />
    <div>
      <p className="font-medium text-foreground">Ready to start building?</p>
      <p className="text-sm text-muted-foreground">Lock in your exclusive discount</p>
    </div>
  </div>
  <Button 
    onClick={() => setActiveTab("nextsteps")}
    className="gap-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-black hover:from-amber-400 hover:to-yellow-400"
  >
    <ArrowRight className="h-4 w-4" />
    View Next Steps
  </Button>
</div>
```

**Código Final (linhas 557-581):**

```typescript
{activeTab === "businessplan" && (
  <>
    <BusinessPlanTab />
    
    {/* CTA Banner at the bottom */}
    <NextStepsCTABanner onViewNextSteps={() => setActiveTab("nextsteps")} />
  </>
)}
```

---

## Resumo

| Local | Tipo | Linhas |
|-------|------|--------|
| PmsDashboard.tsx | Remover banner topo | -16 |

**Resultado:** My Plan terá apenas o banner no rodapé, visual mais limpo.

---

## Arquivos Tocados

| Arquivo | Ação |
|---------|------|
| `src/pages/PmsDashboard.tsx` | Modificar |
