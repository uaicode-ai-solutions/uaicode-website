

## Criar tabela `tb_pms_reports_complexity`

### Schema

| Coluna | Tipo | Constraint |
|--------|------|------------|
| `id` | uuid | PK, default `gen_random_uuid()` |
| `report_id` | uuid | NOT NULL, UNIQUE, FK -> `tb_pms_reports(id)` ON DELETE CASCADE |
| `wizard_id` | uuid | NOT NULL (sem FK, valor copiado do report) |
| `complexity_score` | integer | NOT NULL |
| `complexity_classification` | text | NOT NULL, CHECK IN ('Low','Medium','High','Very High') |
| `created_at` | timestamptz | default `now()` |

- Apenas 1 foreign key: `report_id -> tb_pms_reports(id)`
- `wizard_id` armazenado como campo denormalizado, sem FK para `tb_pms_wizard`
- UNIQUE em `report_id` (1 registro por report)

### RLS Policies

Seguindo o padrao existente em `tb_pms_reports`:

1. **SELECT own** - usuario ve complexidade dos seus reports (via wizard chain: `report_id IN (SELECT id FROM tb_pms_reports WHERE wizard_id IN (...))`)
2. **INSERT own** - usuario insere para seus reports
3. **UPDATE own** - usuario atualiza seus registros
4. **DELETE own** - usuario deleta seus registros
5. **SELECT shared** - reports compartilhados (share_enabled + share_token) visiveis publicamente
6. **SELECT hero_users** - hero users veem todos

### Execucao

1. Migration SQL com CREATE TABLE, FK, CHECK, RLS enable + policies
2. `types.ts` atualiza automaticamente apos migration

