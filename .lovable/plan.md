

# Plano: Reorganizar Tela "Next Steps" (Preservando Kyle + Cálculos)

## Resumo Executivo

Reorganizar a tela "Next Steps" para focar no **calendário como hero**, removendo elementos redundantes e simplificando a hierarquia visual - **sem quebrar nenhuma lógica de cálculos ou o Kyle**.

---

## O Que Será PRESERVADO (Intacto)

| Elemento | Arquivo | Razão |
|----------|---------|-------|
| `useReportContext` | NextStepsSection.tsx | Fornece dados calculados |
| `getSectionInvestment()` | sectionInvestmentUtils.ts | Cálculos de pricing |
| `getDiscountStrategy()` | sectionInvestmentUtils.ts | Estratégias de desconto |
| `useCountdownTimer()` | NextStepsSection.tsx | Timer funcional |
| `formatCurrency()` | NextStepsSection.tsx | Formatação monetária |
| **Pricing Cards completos** | NextStepsSection.tsx | Flash Deal + Bundle (todo o cálculo) |
| **MeetKyleSection** | MeetKyleSection.tsx | 100% intacto |
| **Dialogs do Kyle** | KyleConsultantDialog, etc. | 100% intactos |

---

## O Que Será REMOVIDO (Limpar Ruído)

| Elemento | Linhas | Justificativa |
|----------|--------|---------------|
| Viability Score Card | 241-258 | Já aparece no ReportHero - redundante |
| 4 cards "What happens when you choose" | 260-312 | Info secundária que distrai |
| 3 cards "What to Expect" no ScheduleCallSection | 126-152 | Repete info do pricing |
| Segundo countdown timer no ScheduleCallSection | 155-180 | Redundante - já tem no NextStepsSection |

---

## O Que Será SIMPLIFICADO

| Elemento | Mudança |
|----------|---------|
| Header do NextStepsSection | Remover score card, manter apenas "Choose Your Package" |
| ScheduleCallSection | Mover calendário para cima, remover cards de feature |

---

## Nova Ordem da Tela (De Cima para Baixo)

```text
┌─────────────────────────────────────────────────────────────────────┐
│  1. SCHEDULE CALL SECTION (promovido para HERO)                     │
│     - Header simplificado "Book Your Call"                          │
│     - Timer único e grande                                          │
│     - Calendário Cal.com (destaque máximo)                          │
│     - Garantias em linha                                            │
├─────────────────────────────────────────────────────────────────────┤
│  2. MEET KYLE SECTION (sem mudanças)                                │
│     - Mantido exatamente como está                                  │
│     - Botões Email/Chat/Call funcionando                            │
├─────────────────────────────────────────────────────────────────────┤
│  3. PRICING SECTION (movido para o final)                           │
│     - Header "Choose Your Package"                                  │
│     - 2 Pricing Cards (Flash Deal + Bundle) - TODOS OS CÁLCULOS     │
│     - Marketing billing notice                                      │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Alterações Detalhadas

### 1. PmsDashboard.tsx - Reordenar Componentes

**Arquivo:** `src/pages/PmsDashboard.tsx`  
**Linhas:** 567-573

**De:**
```typescript
{activeTab === "nextsteps" && (
  <div className="space-y-16">
    <NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
    <MeetKyleSection wizardId={wizardId} />
    <ScheduleCallSection projectName={projectName} />
  </div>
)}
```

**Para:**
```typescript
{activeTab === "nextsteps" && (
  <div className="space-y-16">
    <ScheduleCallSection projectName={projectName} />
    <MeetKyleSection wizardId={wizardId} />
    <NextStepsSection onScheduleCall={handleScheduleCall} onNewReport={handleNewReport} />
  </div>
)}
```

**Justificativa:** Calendário vira o HERO da página (primeira coisa que o usuário vê).

---

### 2. ScheduleCallSection.tsx - Simplificar (Remover 3 Cards)

**Arquivo:** `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx`

**Remoções:**
- Linhas 126-152: Bloco `{/* What to Expect Cards */}` (3 cards de features)
- Linhas 155-180: Bloco `{/* Countdown Timer */}` (timer redundante)

O componente ficará apenas com:
- Header "Book Your Call" + badge + social proof
- Garantias (Shield icons)
- Calendário Cal.com (destaque máximo)
- Link "Having trouble?"

---

### 3. NextStepsSection.tsx - Remover Elementos Redundantes

**Arquivo:** `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx`

**Remoções:**
- Linhas 241-258: Viability Score Card
- Linhas 260-312: 4 cards "What happens when you choose"

**O que PERMANECE (linhas 315-720):**
- Header "Choose Your Package"
- Timer countdown (o único da página)
- Pricing Card 1: MVP Flash Deal (25% OFF)
- Pricing Card 2: Complete Launch Bundle (30% OFF)
- Marketing Billing Notice

**TODOS os cálculos permanecem intactos:**
- `getSectionInvestment(reportData)`
- `getDiscountStrategy(sectionInvestment, mvpPriceCents)`
- `getDiscountSavings()`
- `formatCurrency()`
- `useCountdownTimer()`

---

## Comparação Visual: Antes vs Depois

```text
ANTES (12+ elementos)                    DEPOIS (6 elementos)
─────────────────────                    ──────────────────────
1. Header "Next Steps"                   1. Header "Book Your Call"
2. Viability Score Card                  2. Garantias inline
3. 4 cards "What happens"                3. Calendário Cal.com (HERO)
4. Header "Choose Your Package"          4. Meet Kyle Section
5. Timer                                 5. Header "Choose Your Package"
6. 2 Pricing Cards                       6. Timer + 2 Pricing Cards
7. Marketing Notice                      
8. Meet Kyle Section (grande)            
9. Header "Book Your Call"               
10. 3 cards "What to Expect"             
11. Timer (duplicado)                    
12. Garantias                            
13. Calendário Cal.com (afogado)         
```

---

## Arquivos Tocados

| Arquivo | Ação | Linhas Afetadas |
|---------|------|-----------------|
| `src/pages/PmsDashboard.tsx` | Reordenar componentes | ~3 linhas |
| `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx` | Remover 3 cards + timer | ~55 linhas removidas |
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | Remover score + 4 cards | ~75 linhas removidas |

---

## Segurança dos Cálculos

```text
✅ useReportContext()           → NÃO TOCADO
✅ getSectionInvestment()       → NÃO TOCADO
✅ getDiscountStrategy()        → NÃO TOCADO
✅ getDiscountSavings()         → NÃO TOCADO
✅ useCountdownTimer()          → MANTIDO (1 único)
✅ formatCurrency()             → NÃO TOCADO
✅ discountStrategy.flash_24h   → NÃO TOCADO
✅ discountStrategy.bundle      → NÃO TOCADO
✅ mvpPriceCents                → NÃO TOCADO
✅ marketingAnnualUaicode       → NÃO TOCADO
```

---

## Segurança do Kyle

```text
✅ MeetKyleSection.tsx          → 100% INTACTO
✅ KyleConsultantDialog         → NÃO TOCADO
✅ KyleChatDialog               → NÃO TOCADO
✅ EmailKyleDialog              → NÃO TOCADO
✅ useKyleElevenLabs            → NÃO TOCADO
✅ useKyleChatElevenLabs        → NÃO TOCADO
```

---

## Resultado Esperado

| Métrica | Antes | Depois |
|---------|-------|--------|
| Elementos visuais | 12+ | 6 |
| Scroll necessário | 4-5 telas | 2 telas |
| Timers duplicados | 2 | 1 |
| Tempo para ver calendário | ~30s scroll | Imediato |
| Cálculos funcionando | ✅ | ✅ |
| Kyle funcionando | ✅ | ✅ |

