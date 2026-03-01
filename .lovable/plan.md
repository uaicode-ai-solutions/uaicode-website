

## Adicionar campo `selected_feature_ids` na `tb_pms_reports_complexity`

### Alteracao

Adicionar coluna `selected_feature_ids` (jsonb, default '[]') na tabela `tb_pms_reports_complexity` para armazenar os IDs das features selecionadas pela IA, referenciando os valores de `tb_pms_mvp_features.feature_id`.

### Migration SQL

```sql
ALTER TABLE public.tb_pms_reports_complexity
  ADD COLUMN selected_feature_ids jsonb NOT NULL DEFAULT '[]'::jsonb;
```

### Exemplo de valor armazenado

```json
["auth_basic", "crud_operations", "dashboard_analytics", "api_integration"]
```

Cada string corresponde a um `feature_id` da tabela `tb_pms_mvp_features`.

### Impacto

- `src/integrations/supabase/types.ts` sera atualizado automaticamente com o novo campo
- Registros existentes receberao `[]` como valor default (array vazio)
- Nenhuma foreign key formal e necessaria pois o campo armazena um array de text IDs dentro de jsonb

