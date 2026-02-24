

# Ferramenta de Vendas PMS -- Solucao Completa com Preco Fechado

## Contexto

A Uaicode agora oferece uma **solucao completa com preco unico** (MVP + Marketing Launch Plan + Suporte), sem separacao de servicos de marketing. O plano de descontos incentiva fechamento imediato ou em ate 7 dias. A ferramenta sera usada exclusivamente pelo closer durante calls estrategicas.

---

## Nova Estrutura da Oferta (3 Entregas)

```text
ENTREGA 1: Reuniao Estrategica (gratis)
  -> Plano de Negocios + Oferta personalizada

ENTREGA 2: MVP + Marketing Launch Plan (preco fechado por tier)
  -> APP completo + Branding + Brand Manual + Landing Page + Paid Media Strategy + 8-12 Ad Creatives

ENTREGA 3: Post-Launch Support (incluso no preco)
  -> Starter: 45 dias | Growth: 90 dias | Enterprise: 120 dias
  -> Bug fixes, performance monitoring, feature enhancements, marketing metrics monitoring
  -> Extensao mensal disponivel apos o periodo incluso
```

---

## Fluxo Completo do Closer (6 Etapas)

```text
[1] RECEPCAO        [2] ENTREVISTA       [3] GERACAO        [4] APRESENTACAO     [5] OFERTA          [6] FECHAMENTO
Checklist +     --> Wizard com      --> Loading com     --> Dashboard modo  --> Pricing card    --> Fechar ou
Script SPICED       Sidebar scripts     Prompts SPICED      apresentacao        unico + desconto     Follow-up
```

---

## Mudancas Detalhadas

### 1. PmsCloserFlow.tsx (NOVO -- Orquestrador)

Pagina principal em `/planningmysaas/closer` que gerencia o estado de cada etapa:

- Aceita parametros URL: `?name=John&email=john@x.com&phone=+1234`
- Gerencia `closerStage`: welcome -> interview -> generating -> presenting -> offer -> closing
- Renderiza o componente correto para cada etapa
- Requer autenticacao PMS (admin ou contributor)

### 2. CloserWelcome.tsx (NOVO -- Etapa 1: Recepcao)

Tela de preparacao pre-call:

```text
+------------------------------------------------------+
|  CLIENT INFO                                          |
|  Name: John Doe | Email: john@x.com                  |
|                                                       |
|  PRE-CALL CHECKLIST                                   |
|  [ ] Reviewed LinkedIn  [ ] Identified segment        |
|  [ ] Prepared questions [ ] Tested screen sharing     |
|                                                       |
|  OPENING SCRIPT (SPICED)                              |
|  "Hi [Name], thanks for joining..."                   |
|  Situation: "Tell me about your current business..."  |
|  Problem: "What's your biggest challenge?"            |
|                                                       |
|         [  Start Interview  -->  ]                    |
+------------------------------------------------------+
```

### 3. CloserSidebar.tsx (NOVO -- Etapa 2: Guia lateral no Wizard)

Painel lateral colapsavel ao lado do wizard com scripts por step:

- **Step 1 (Your Info):** "Confirme os dados. Pergunte sobre experiencia com SaaS."
- **Step 2 (Your Idea):** "Peca para descrever o problema que resolve. Use 'Improve with AI' juntos."
- **Step 3 (Market):** "Quem sao seus primeiros 10 clientes ideais?"
- **Step 4 (Features):** "Mais features = maior investimento. Comece pelo essencial."
- **Step 5 (Goals):** "Pergunte sobre orcamento e timeline."

Arquivo: `src/components/planningmysaas/closer/CloserSidebar.tsx`
Modificacao: `src/components/planningmysaas/wizard/WizardLayout.tsx` (aceitar prop `closerMode`)

### 4. CloserLoadingPrompts.tsx (NOVO -- Etapa 3: Loading com SPICED)

Integrado ao `GeneratingReportSkeleton.tsx`, mostra perguntas rotativas enquanto o relatorio gera:

1. **Situation:** "Tell me about your current business model..."
2. **Problem:** "What's the biggest challenge you're facing?"
3. **Impact:** "How is this problem affecting your revenue?"
4. **Critical Event:** "What made you decide to act now?"
5. **Decision:** "What does success look like in 6 months?"

Troca automatica a cada 30s com botao "Next Question".

### 5. ExecutiveSummaryTab.tsx (NOVO -- Etapa 4: Resumo para apresentacao)

Nova tab "Executive Summary" no dashboard, projetada para apresentacao em 5-10 minutos:

```text
[Score: 82]  "Strong Market Opportunity"

KEY METRICS
TAM: $713B  |  LTV/CAC: 4.2x  |  Payback: 8 mo

TOP 3 OPPORTUNITIES
1. Growing demand for AI in FinTech
2. Underserved SMB segment with 40% growth
3. Low competition in LATAM

TOP 3 RISKS
1. Regulatory uncertainty
2. High CAC in early months
3. Technical complexity

[  Let's See the Investment  -->  ]
```

Dados do `ReportContext` (sem queries adicionais).

### 6. NextStepsSection.tsx (REFATORADO -- Etapa 5: Oferta Unificada)

**Mudanca principal:** Substituir os 2 cards atuais (MVP Flash Deal + Complete Launch Bundle) por um **unico card de oferta completa** com a estrutura de 3 entregas:

```text
+------------------------------------------------------+
|  YOUR COMPLETE SAAS PARTNERSHIP                       |
|                                                       |
|  ENTREGA 1: Strategic Meeting (Today!)                |
|  -> Business Plan + Personalized Offer                |
|  Status: [COMPLETED]                                  |
|                                                       |
|  ENTREGA 2: MVP + Marketing Launch Plan               |
|  -> Complete SaaS Application                         |
|  -> Branding & Brand Identity                         |
|  -> Brand Manual                                      |
|  -> Optimized Landing Page                            |
|  -> Paid Media Strategy                               |
|  -> 8-12 Ad Creatives                                 |
|                                                       |
|  ENTREGA 3: Post-Launch Support (45/90/120 days)      |
|  -> Bug fixes & performance monitoring                |
|  -> Feature enhancements & technical guidance          |
|  -> Marketing campaign metrics monitoring              |
|  -> Monthly extension available after included period  |
|                                                       |
|  INVESTMENT                                           |
|  Full Price: $35,000                                  |
|  Close Today: $26,250 (25% OFF)                       |
|  Close in 7 days: $29,750 (15% OFF)                   |
|  After 7 days: Full price                             |
|                                                       |
|  [  CLOSE THE DEAL  ]   [  Send Proposal  ]           |
+------------------------------------------------------+
```

**Descontos simplificados:**

| Momento | Desconto | Validade |
|---------|----------|----------|
| Fechamento imediato (na call) | flash_24h (25%) | 24h |
| Fechamento em ate 7 dias | week (15%) | 7 dias |
| Apos 7 dias | Preco cheio | -- |

**Remover:**
- Card separado "Complete Launch Bundle" (nao existe mais marketing separado)
- Secao "Marketing Billing Notice" (marketing esta embutido no preco)
- Referencia a `marketingMonthlyUaicode` e `marketingAnnualUaicode` (tudo unificado)
- Labels "MVP only" e "MVP + Marketing" (agora e' um pacote so)

### 7. ScheduleCallSection.tsx (REFATORADO -- Session Offer)

- **Remover** countdown fake de 24h baseado em localStorage
- **Substituir** por "Session Offer" com data de expiracao real:
  - Calcula `report.created_at + 7 dias` para o desconto de 15%
  - Calcula `report.created_at + 24h` para o desconto de 25%
  - Mostra data real: "Valid until Mar 3, 2026"
- **Remover** `useCountdownTimer` hook

### 8. CloserFollowUp.tsx (NOVO -- Etapa 6: Fechamento)

Tela final com duas opcoes:

- **"Client Closed!"**: Animacao de celebracao + botao enviar contrato
- **"Send Follow-Up"**: Email pre-formatado com:
  - Link do relatorio compartilhado
  - Resumo do pacote selecionado (3 entregas)
  - Data de expiracao do desconto (7 dias)
  - Link do calendario para proxima call

Usa a edge function `pms-send-share-report` existente.

### 9. PmsDashboard.tsx (MODIFICADO -- Modo Apresentacao)

- Adicionar prop `presenterMode` que, quando ativo:
  - Esconde navegacao (back, new report, user menu)
  - Reorganiza tabs: `Executive Summary | Deep Dive | Investment`
  - Mostra botao flutuante "Next Section"
  - Mini indicador de progresso

- Tab "Deep Dive" = Market Analysis + Business Plan (merged)
- Tab "Investment" = NextStepsSection refatorado (oferta unica)

### 10. CloserPresentMode.tsx (NOVO -- Controles flutuantes)

Componente flutuante no canto inferior direito:

- Botao "Next" para scroll suave entre secoes
- Mini barra: "Section 3 of 8"
- Toggle para ligar/desligar modo apresentacao

### 11. App.tsx (MODIFICADO -- Nova rota)

Adicionar rota: `/planningmysaas/closer` -> `PmsCloserFlow`

---

## Impacto nos Calculos de Preco

Atualmente o `NextStepsSection` calcula:
- `mvpPrice` (preco do MVP via `section_investment`)
- `marketingMonthlyUaicode` e `marketingAnnualUaicode` (do `marketingTotals` do contexto)
- Soma ambos para o bundle

**Nova logica:** O preco final ja vem calculado do `section_investment.investment_one_payment_cents` e **ja inclui o Marketing Launch Plan**. Nao ha mais calculo separado de marketing mensal.

Os descontos continuam vindo de `discount_strategy` (flash_24h, week), mas o `bundle` deixa de existir como opcao separada.

---

## Resumo de Arquivos

| Arquivo | Acao | Descricao |
|---------|------|-----------|
| `src/pages/PmsCloserFlow.tsx` | NOVO | Orquestrador do fluxo do closer |
| `src/components/planningmysaas/closer/CloserWelcome.tsx` | NOVO | Tela de recepcao pre-call |
| `src/components/planningmysaas/closer/CloserSidebar.tsx` | NOVO | Guia lateral com scripts por step |
| `src/components/planningmysaas/closer/CloserLoadingPrompts.tsx` | NOVO | Prompts SPICED no loading |
| `src/components/planningmysaas/closer/CloserPresentMode.tsx` | NOVO | Controles flutuantes de apresentacao |
| `src/components/planningmysaas/closer/CloserFollowUp.tsx` | NOVO | Tela de fechamento/follow-up |
| `src/components/planningmysaas/dashboard/sections/ExecutiveSummaryTab.tsx` | NOVO | Resumo executivo curado |
| `src/pages/PmsDashboard.tsx` | MODIFICADO | Modo apresentacao + tabs reorganizadas |
| `src/components/planningmysaas/dashboard/sections/NextStepsSection.tsx` | REFATORADO | Card unico com 3 entregas + desconto simplificado |
| `src/components/planningmysaas/dashboard/sections/ScheduleCallSection.tsx` | REFATORADO | Session Offer com data real |
| `src/components/planningmysaas/wizard/WizardLayout.tsx` | MODIFICADO | Aceitar prop closerMode para sidebar |
| `src/components/planningmysaas/skeletons/GeneratingReportSkeleton.tsx` | MODIFICADO | Aceitar prop closerMode para prompts SPICED |
| `src/App.tsx` | MODIFICADO | Adicionar rota /planningmysaas/closer |

### Sem mudancas no banco de dados
### Sem novas dependencias

---

## Ordem de Implementacao Recomendada

| # | Task | Impacto |
|---|------|---------|
| 1 | `PmsCloserFlow.tsx` + `CloserWelcome.tsx` + rota | Estrutura base |
| 2 | `NextStepsSection.tsx` refatorado (card unico, 3 entregas) | Oferta unificada |
| 3 | `ScheduleCallSection.tsx` (Session Offer real) | Credibilidade |
| 4 | `ExecutiveSummaryTab.tsx` + reorganizar tabs do dashboard | Narrativa de vendas |
| 5 | `CloserSidebar.tsx` + adaptar WizardLayout | Scripts para entrevista |
| 6 | `CloserLoadingPrompts.tsx` + adaptar GeneratingReportSkeleton | Elimina tempo morto |
| 7 | `CloserPresentMode.tsx` + adaptar PmsDashboard | Modo apresentacao |
| 8 | `CloserFollowUp.tsx` | Fechamento/follow-up |

