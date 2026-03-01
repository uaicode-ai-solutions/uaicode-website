

## Criar tabela `tb_pms_reports_investment`

### Objetivo
Criar a tabela que armazena os dados calculados de investimento (pricing, delivery, breakdown, discounts) para cada report, substituindo o JSONB `section_investment` da `tb_pms_reports`.

### Estrutura da tabela

| Coluna | Tipo | Nullable | Default | Descrição |
|---|---|---|---|---|
| id | uuid | NO | gen_random_uuid() | PK |
| report_id | uuid | NO | - | FK lógica para tb_pms_reports |
| wizard_id | uuid | NO | - | FK lógica para tb_pms_wizard |
| mvp_tier | text | NO | - | Tier determinado (starter/enterprise/professional) |
| investment_one_payment_cents | integer | NO | - | Preço Uaicode em centavos |
| investment_one_payment_cents_traditional | integer | NO | - | Preço agência tradicional em centavos |
| investment_breakdown | jsonb | NO | '{}' | { frontend, backend, integrations, infra, testing } |
| savings_amount_cents | integer | NO | 0 | Economia em centavos |
| savings_percentage | integer | NO | 0 | Economia percentual |
| savings_marketing_months | integer | NO | 0 | Meses de marketing equivalentes |
| discount_strategy | jsonb | NO | '{}' | { flash_24h, week, month, bundle, best_current } |
| delivery_days_uaicode_min | integer | NO | - | Dias mín Uaicode |
| delivery_days_uaicode_max | integer | NO | - | Dias máx Uaicode |
| delivery_days_traditional_min | integer | NO | - | Dias mín tradicional |
| delivery_days_traditional_max | integer | NO | - | Dias máx tradicional |
| delivery_weeks_uaicode_min | integer | NO | - | Semanas mín Uaicode |
| delivery_weeks_uaicode_max | integer | NO | - | Semanas máx Uaicode |
| delivery_weeks_traditional_min | integer | NO | - | Semanas mín tradicional |
| delivery_weeks_traditional_max | integer | NO | - | Semanas máx tradicional |
| feature_counts | jsonb | NO | '{}' | { starter, enterprise, professional } |
| created_at | timestamptz | NO | now() | Data de criação |

### Politicas RLS

Seguindo o mesmo padrão da `tb_pms_reports_complexity`:

1. **Users can view own investment** - SELECT via chain report_id -> tb_pms_reports -> tb_pms_wizard -> tb_pms_users -> auth.uid()
2. **Users can insert own investment** - INSERT com mesma chain
3. **Users can update own investment** - UPDATE com mesma chain
4. **Users can delete own investment** - DELETE com mesma chain
5. **Hero users can view all investment** - SELECT via get_hero_user_id() IS NOT NULL
6. **Public can view shared investment** - SELECT via report_id IN (shared reports)

### Indice

- UNIQUE index em `report_id` (1 investment por report)

### Detalhes tecnicos

Migration SQL unica que cria:
- Tabela com todas as colunas
- Enable RLS
- 6 politicas RLS (mesmo padrao da tb_pms_reports_complexity)
- Indice unico em report_id

