

## Remover tabela `tb_pms_reports_investment`

### Contexto

A tabela `tb_pms_reports_investment` duplica dados que ja existem no campo JSONB `section_investment` da tabela `tb_pms_reports`. Nenhum codigo frontend consome essa tabela diretamente — apenas o `types.ts` auto-gerado a referencia.

### Etapas

1. **Migration SQL** para dropar a tabela e suas RLS policies:

```sql
DROP TABLE IF EXISTS public.tb_pms_reports_investment CASCADE;
```

O `CASCADE` remove automaticamente todas as policies, indexes e constraints associadas.

2. **Atualizar `src/integrations/supabase/types.ts`** — o tipo sera removido automaticamente na proxima sincronizacao apos a migration rodar.

3. **Atualizar o n8n** (manual, fora do Lovable): remover o no de Supabase Update/Insert que grava na `tb_pms_reports_investment`. Manter apenas o no que grava `section_investment` no `tb_pms_reports`.

### Impacto

- Zero impacto no frontend — nenhum componente, hook ou utility importa dessa tabela
- Os campos `_filter_report_id`, `report_id`, `wizard_id` e demais campos flat do output do n8n continuam disponiveis, mas devem ser ignorados no workflow (ou removidos do Code node para limpeza)

### Detalhes tecnicos

- A migration usa `DROP TABLE ... CASCADE` que remove 6 RLS policies (Hero, Public shared, Users CRUD) automaticamente
- Nenhum foreign key referencia essa tabela, entao nao ha risco de quebra em cascata
