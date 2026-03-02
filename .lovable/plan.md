

# Plano: Orchestrador LP Report + Gatilho ThankYouStep

## Fluxo Completo

```text
User preenche /pms/wizard (14 steps)
  -> handleSubmit() chama pms-lp-wizard-submit
  -> Edge Function insere dados em tb_pms_lp_wizard (SEM webhook)
  -> Retorna { success: true, id: wizard_id }
  -> Frontend salva wizard_id no state
  -> Mostra ThankYouStep (confetti)
  -> ThankYouStep monta -> useEffect chama pms-orchestrate-lp-report (fire-and-forget)
  -> Backend roda 15 steps sequenciais via n8n, totalmente desacoplado
```

## Arquivos a Modificar/Criar

### 1. Modificar `supabase/functions/pms-lp-wizard-submit/index.ts`

Remover o bloco inteiro de webhook (linhas 84-138). A funcao fica somente como endpoint de insercao de dados, retornando `{ success: true, id: data.id }`.

### 2. Criar `supabase/functions/pms-orchestrate-lp-report/index.ts` (NOVO)

Baseado no `pms-orchestrate-report` existente, com estas diferencas:

- **Secret de webhook:** `WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT` (ja existe nos secrets)
- **Parser de URL robusto:** Mesmo parser que estava no `pms-lp-wizard-submit` (suporta URL direta, JSON export do n8n, ou path ID). Dominio padrao: `uaicode-n8n.ax5vln.easypanel.host`
- **15 steps sequenciais:**

| Step | tool_name | Label |
|------|-----------|-------|
| 1 | call_enrich_tb_pms_lp_wizard | Enrich Lead Data |
| 2 | call_new_report_requested | Initialize Report |
| 3 | call_create_new_report | Create Report |
| 4 | call_create_mvp_complexity | MVP Complexity |
| 5 | call_create_mvp_investment | Investment Analysis |
| 6 | call_get_mvp_benchmark | Market Benchmarks |
| 7 | call_get_mvp_competitors | Competitor Research |
| 8 | call_get_mvp_opportunity | Market Opportunity |
| 9 | call_get_mvp_price_intelligence | Pricing Strategy |
| 10 | call_get_mvp_icp_intelligence | Customer Profiling |
| 11 | call_get_mvp_paid_media | Paid Media Analysis |
| 12 | call_get_mvp_growth_intelligence | Growth Projections |
| 13 | call_get_mvp_summary | Executive Summary |
| 14 | call_get_mvp_score | Final Scoring |
| 15 | call_get_mvp_business_plan | Business Plan |

- **Background execution:** `EdgeRuntime.waitUntil()` -- retorna 202 imediatamente
- **AbortController:** 150s timeout por step
- **beforeunload:** Handler de graceful shutdown
- **Status tracking:** Atualiza `tb_pms_reports.status` a cada step. Steps 1-2 rodam antes do report row existir (criado no step 3), entao updates de status para steps 1-2 serao logged no console e silenciosamente ignorados se nao houver row
- **Pos-conclusao (apos os 15 steps):**
  - Gera `share_token` (32 hex chars, crypto random)
  - Constroi `share_url` usando URL de producao
  - Busca `wizard_snapshot` de `tb_pms_lp_wizard` (campos: id, saas_name, industry, description, saas_type, geographic_region, role, email, full_name)
  - Busca `marketing_snapshot` de `tb_pms_mkt_tier` (mesmo calculo do orchestrator existente)
  - Atualiza `tb_pms_reports` com: status="completed", share_token, share_url, share_enabled=true, share_created_at, wizard_snapshot, marketing_snapshot

### 3. Modificar `src/pages/PmsLeadWizard.tsx`

- Adicionar state `wizardId`: `const [wizardId, setWizardId] = useState<string | null>(null)`
- No `handleSubmit`, apos resposta OK, extrair o `id` do response JSON e salvar: `const data = await res.json(); setWizardId(data.id);`
- Passar `wizardId` como prop para ThankYouStep: `<ThankYouStep wizardId={wizardId} />`

### 4. Modificar `src/components/pms-lead-wizard/steps/ThankYouStep.tsx`

- Aceitar prop `wizardId?: string | null`
- Adicionar `useEffect` que dispara apos o mount (junto com o confetti), chamando `pms-orchestrate-lp-report` fire-and-forget:

```typescript
useEffect(() => {
  if (!wizardId) return;
  fetch(
    `https://ccjnxselfgdoeyyuziwt.supabase.co/functions/v1/pms-orchestrate-lp-report`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      },
      body: JSON.stringify({ wizard_id: wizardId }),
    }
  ).catch(() => {}); // fire-and-forget, sem impacto na UX
}, [wizardId]);
```

A tela ThankYouStep nao muda visualmente -- mesma UI, confetti, mensagens. Apenas dispara o backend.

### 5. Adicionar em `supabase/config.toml`

```toml
[functions.pms-orchestrate-lp-report]
verify_jwt = false
```

## Resumo de Arquivos

| Arquivo | Acao |
|---------|------|
| `supabase/functions/pms-lp-wizard-submit/index.ts` | Remover bloco webhook (linhas 84-138) |
| `supabase/functions/pms-orchestrate-lp-report/index.ts` | Criar (novo) |
| `supabase/config.toml` | Adicionar entry |
| `src/pages/PmsLeadWizard.tsx` | Adicionar state wizardId + passar para ThankYouStep |
| `src/components/pms-lead-wizard/steps/ThankYouStep.tsx` | Aceitar wizardId + useEffect fire-and-forget |

## O que NAO muda

- Nenhuma migration de banco necessaria
- Nenhum secret novo (WEBHOOK_PMS_LP_WIZARD_GENERATE_REPORT ja existe)
- Layout/visual da ThankYouStep permanece identico

