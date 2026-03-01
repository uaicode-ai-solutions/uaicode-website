

## Lead Capture Wizard - `/pms/wizard` (Nova Tabela `tb_pms_lp_wizard`)

Criar um wizard publico minimalista com uma pergunta por pagina, transicoes suaves, e uma nova tabela dedicada para nao interferir no sistema existente.

### 1. Nova Tabela `tb_pms_lp_wizard`

Migration SQL criando tabela independente com todas as colunas necessarias:

```text
id (uuid, PK), created_at, updated_at,
full_name, email, phone, linkedin (opcional),
country, role, role_other,
saas_type, saas_type_other,
industry, industry_other,
description, saas_name, saas_logo_url,
geographic_region, geographic_region_other,
status (default 'pending')
```

**RLS Policies:**
- INSERT para `anon` (formulario publico) -- OU via Edge Function com service_role (mais seguro)
- SELECT/UPDATE/DELETE para admins
- SELECT para hero_users

**Decisao:** Usar Edge Function `pms-lp-wizard-submit` com `service_role` para o insert (mais seguro que abrir INSERT anonimo).

### 2. Edge Function `pms-lp-wizard-submit`

- Recebe JSON com todos os campos do wizard
- Valida campos obrigatorios (full_name, email, saas_type, industry, description, saas_name, country, role, geographic_region)
- Insere na `tb_pms_lp_wizard` usando service_role
- Retorna `{ success: true, id: wizard_id }`

### 3. Arquivos Frontend

**Pagina principal:**
- `src/pages/PmsLeadWizard.tsx` - Gerencia estado, navegacao entre 14 telas (0=Welcome ate 13=ThankYou), validacao por step, submit via edge function

**Layout:**
- `src/components/pms-lead-wizard/LeadWizardLayout.tsx` - Layout minimalista: logo UaiCode no topo, progress bar (dots), botoes Back/Next no footer fixo, transicao fade+slide

**Step wrapper:**
- `src/components/pms-lead-wizard/LeadWizardStep.tsx` - Wrapper com animacao de entrada (fade-in + translateY), recebe titulo e children

**Steps individuais (15 arquivos):**

| Step | Arquivo | Tipo | Obrigatorio |
|------|---------|------|-------------|
| 0 | `WelcomeStep.tsx` | Intro com botao Start, informa "~3 minutes to complete" | - |
| 1 | `FullNameStep.tsx` | Input text | Sim |
| 2 | `EmailStep.tsx` | Input email | Sim |
| 3 | `PhoneStep.tsx` | PhoneInput (reutiliza componente existente) | Sim |
| 4 | `LinkedInStep.tsx` | Input url | Nao |
| 5 | `CountryStep.tsx` | SelectableCards (US, Brazil, Europe, Asia, Other) | Sim |
| 6 | `RoleStep.tsx` | SelectableCards + Other input | Sim |
| 7 | `SaasTypeStep.tsx` | SelectableCards + Other (reutiliza mesmas opcoes do wizard existente) | Sim |
| 8 | `IndustryStep.tsx` | SelectableCards + Other (reutiliza mesmas opcoes) | Sim |
| 9 | `DescriptionStep.tsx` | Textarea + botao "Improve with AI" (reutiliza edge function `pms-improve-description`) | Sim (min 20 chars) |
| 10 | `SaasNameStep.tsx` | Input + botao "Suggest with AI" (reutiliza edge function `pms-suggest-name`) | Sim (min 3 chars) |
| 11 | `LogoStep.tsx` | Upload + botao "Create with AI" (reutiliza edge function `pms-generate-logo`) | Nao |
| 12 | `GeographicRegionStep.tsx` | SelectableCards + Other (US, Brazil, Europe, Asia, Other) | Sim |
| 13 | `ThankYouStep.tsx` | Mensagem de confirmacao, informa que relatorio sera enviado por email em ~10 min | - |

### 4. Rota

Adicionar no `App.tsx`:
```
<Route path="/pms/wizard" element={<PmsLeadWizard />} />
```
Rota publica, sem `ProtectedRoute`.

### 5. Design

- Fundo escuro (background do tema), mesh-gradient sutil
- Uma pergunta centralizada por pagina com titulo grande
- Progress dots no topo (14 dots, nao labels)
- Transicao entre steps: `opacity 0->1` + `translateY 10px->0` com `duration-500`
- Auto-advance apos selecionar card em steps sem "Other" ativo
- Botoes Back/Next no footer fixo com backdrop-blur
- Welcome page mostra: icone, titulo, descricao do beneficio, badge "~3 minutes", e botao "Let's Start"

### 6. Config TOML

Adicionar entrada para a nova edge function:
```toml
[functions.pms-lp-wizard-submit]
verify_jwt = false
```

### Resumo de Arquivos

| Acao | Arquivo |
|------|---------|
| Migration | Criar `tb_pms_lp_wizard` |
| Criar | `supabase/functions/pms-lp-wizard-submit/index.ts` |
| Criar | `src/pages/PmsLeadWizard.tsx` |
| Criar | `src/components/pms-lead-wizard/LeadWizardLayout.tsx` |
| Criar | `src/components/pms-lead-wizard/LeadWizardStep.tsx` |
| Criar | 14 arquivos de steps em `src/components/pms-lead-wizard/steps/` |
| Editar | `src/App.tsx` (adicionar rota `/pms/wizard`) |
| Editar | `supabase/config.toml` (adicionar entry da edge function) |

