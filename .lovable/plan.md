
# Plano: Nova Aba "Next Steps" (Abordagem Ultra-Conservadora)

## Análise do Código Atual

Após análise detalhada, a estrutura atual é:

```text
PmsDashboard.tsx (linhas 446-480)
├── Tab "Report"
│   └── 18 seções + NextStepsSection + ScheduleCallSection
├── Tab "Business Plan" → "My Plan"
│   └── BusinessPlanTab.tsx
```

### Componentes Críticos que NÃO Serão Tocados:
- `NextStepsSection.tsx` (842 linhas) - Intacto, apenas **re-exportado**
- `ScheduleCallSection.tsx` - Intacto, apenas **re-exportado**
- `BusinessPlanTab.tsx` - **Zero alterações**
- Toda a lógica de pricing, countdown, Kyle dialogs - **Intocável**

---

## Estratégia: ZERO Refatoração de Componentes

Em vez de mover código, vou apenas:
1. **Adicionar** uma nova tab "Next Steps" no array de tabs
2. **Reutilizar** os componentes existentes como estão
3. **Adicionar** um banner simples no My Plan

### O que NÃO farei:
- Mexer em NextStepsSection.tsx
- Mexer em ScheduleCallSection.tsx  
- Mexer em BusinessPlanTab.tsx
- Alterar lógica de pricing/countdown
- Refatorar imports ou exports

---

## Alterações Mínimas (Apenas PmsDashboard.tsx)

### Alteração 1: Adicionar nova tab no array (linha ~446)

```typescript
// DE:
{ id: "report", label: "Report", icon: FileText },
{ id: "businessplan", label: "Business Plan", icon: Briefcase },

// PARA:
{ id: "report", label: "Report", icon: FileText },
{ id: "businessplan", label: "My Plan", icon: Briefcase },
{ id: "nextsteps", label: "Next Steps", icon: Rocket },  // NOVO
```

**Impacto:** Adiciona 1 linha, altera 1 label

---

### Alteração 2: Adicionar conteúdo da nova tab (após linha ~526)

```typescript
{activeTab === "nextsteps" && (
  <div className="space-y-16">
    <NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
    <ScheduleCallSection projectName={projectName} />
  </div>
)}
```

**Impacto:** Adiciona ~6 linhas, reutiliza componentes existentes

---

### Alteração 3: Adicionar import do ícone Rocket (linha ~21)

```typescript
import { Rocket } from "lucide-react";
```

**Impacto:** Adiciona 1 import

---

### Alteração 4: Remover sections duplicadas da tab Report (linhas 519-520)

```typescript
// REMOVER estas 2 linhas da tab "report":
<NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
<ScheduleCallSection projectName={projectName} />
```

**Impacto:** Remove 2 linhas

---

### Alteração 5: Adicionar banner no Business Plan (linha ~525)

Criar um componente inline simples DENTRO do próprio PmsDashboard:

```typescript
{activeTab === "businessplan" && (
  <>
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
    <BusinessPlanTab />
  </>
)}
```

**Impacto:** Adiciona ~20 linhas inline (nenhum arquivo novo)

---

## Resumo de Alterações

| Local | Tipo | Linhas |
|-------|------|--------|
| PmsDashboard.tsx | Adicionar import Rocket | +1 |
| PmsDashboard.tsx | Adicionar tab no array | +1 |
| PmsDashboard.tsx | Mudar label "Business Plan" → "My Plan" | 0 (já feito) |
| PmsDashboard.tsx | Remover sections duplicadas do Report | -2 |
| PmsDashboard.tsx | Adicionar banner no businessplan | +20 |
| PmsDashboard.tsx | Adicionar conteúdo da nova tab | +6 |

**Total: ~26 linhas alteradas em 1 ÚNICO arquivo**

---

## Arquivos Tocados

| Arquivo | Ação |
|---------|------|
| `src/pages/PmsDashboard.tsx` | Modificar |

**Nenhum outro arquivo será tocado.**

---

## Fluxo do Usuário Após Implementação

```text
Report Tab
├── 16 seções de análise (sem mudança)
├── WhyUaicodeSection
└── [FIM - não tem mais Next Steps aqui]

My Plan Tab
├── Banner CTA "Ready to start?" → clica → vai para Next Steps
└── BusinessPlanTab (sem mudança)

Next Steps Tab (NOVA)
├── NextStepsSection (viability score, pricing cards, Kyle contact)
└── ScheduleCallSection (Cal.com embed)
```

---

## Rollback Fácil

Se algo quebrar, basta:
1. Remover a tab "nextsteps" do array
2. Adicionar as 2 sections de volta na tab "report"
3. Remover o banner do businessplan

---

## Técnica de Segurança

Antes de implementar, vou:
1. Ler o arquivo completo atual
2. Fazer as alterações de forma cirúrgica
3. Testar via browser tool para garantir que funciona

Essa abordagem é a mais segura possível - nenhum componente existente é modificado, apenas reutilizados.
