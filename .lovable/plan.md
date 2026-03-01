

## Criar tabela `tb_pms_mvp_features` (apenas banco de dados)

### O que sera feito

Criar a tabela `tb_pms_mvp_features` no Supabase para armazenar todas as features possiveis que a Uaicode pode implementar nos MVPs. Essa tabela sera consumida futuramente por uma automacao n8n (nao por Edge Functions nem pelo front-end atual).

**Nenhuma alteracao sera feita no front-end ou em qualquer codigo existente.**

### Schema da tabela

| Campo | Tipo | Nullable | Default | Descricao |
|---|---|---|---|---|
| id | uuid (PK) | No | gen_random_uuid() | ID unico |
| feature_id | text (UNIQUE) | No | - | Identificador da feature (ex: "auth", "ai") |
| feature_name | text | No | - | Nome legivel (ex: "User Registration & Authentication") |
| feature_description | text | Yes | - | Descricao da feature para contexto da IA |
| feature_category | text | No | - | Categoria: "essential", "advanced", "professional" |
| complexity_weight | integer | No | - | Peso para calculo de complexidade (essential=1, advanced=2, professional=3) |
| is_active | boolean | No | true | Se a feature esta disponivel |
| created_at | timestamptz | No | now() | Data de criacao |

### RLS

- SELECT publico (mesma politica das tabelas de referencia como `tb_pms_mvp_tiers`)
- Sem INSERT/UPDATE/DELETE para usuarios comuns

### Dados a inserir (28 features)

**Essential (8 features, weight=1):**
- auth: "User Registration & Authentication"
- profiles: "Basic User Profiles"
- crud: "Simple Database CRUD Operations"
- reporting: "Basic Reporting & Analytics"
- notifications: "Email Notifications"
- admin: "Basic Admin Panel"
- responsive: "Mobile Responsive Design"
- security: "Basic Security Measures"

**Advanced (10 features, weight=2):**
- advancedAnalytics: "Advanced Analytics Dashboard"
- apiIntegrations: "Third-party API Integrations"
- payments: "Payment Processing & Billing"
- roles: "Multi-user Roles & Permissions"
- search: "Advanced Search & Filtering"
- fileUpload: "File Upload & Management"
- realtime: "Real-time Updates"
- workflows: "Custom Workflows"
- advancedReporting: "Advanced Reporting Tools"
- emailMarketing: "Email Marketing Integration"

**Professional (10 features, weight=3):**
- ai: "AI/Machine Learning Capabilities"
- dataAnalytics: "Advanced Data Analytics"
- multiTenant: "Multi-tenant Architecture"
- sso: "SSO & Enterprise Security"
- customIntegrations: "Custom Integrations"
- apiManagement: "Advanced API Management"
- collaboration: "Real-time Collaboration Tools"
- automation: "Advanced Automation"
- customReporting: "Custom Reporting Engine"
- support: "Enterprise-grade Support"

### Por que o campo `complexity_weight`

Esse campo permite que a IA do n8n replique o calculo de complexidade sem precisar de logica hardcoded:
- Soma dos pesos das features sugeridas = score
- Soma de todos os pesos possiveis = maxScore
- percentage = (score / maxScore) * 100
- Tier = determinado pela feature de maior categoria sugerida

### Detalhes tecnicos

- 1 migracao SQL: CREATE TABLE + ENABLE RLS + CREATE POLICY
- Insert dos 28 registros via ferramenta de insert
- Nenhum arquivo do front-end sera alterado
- Nenhuma Edge Function sera criada
- A tabela sera usada exclusivamente pela automacao n8n

