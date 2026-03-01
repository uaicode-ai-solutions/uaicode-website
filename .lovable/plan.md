

## Adicionar campos de enriquecimento por IA na tb_pms_lp_wizard

### Objetivo
Adicionar 3 novos campos na tabela `tb_pms_lp_wizard` que serao preenchidos por uma IA com base nos dados ja existentes (industry, description, saas_type, role, geographic_region, etc.).

### Novos campos

| Coluna | Tipo | Nullable | Default | Descricao |
|---|---|---|---|---|
| ideal_target_customers | text | YES | NULL | Perfil dos clientes ideais gerado por IA |
| ideal_target_audience | text | YES | NULL | Audiencia-alvo ideal gerada por IA |
| ideal_business_model | text | YES | NULL | Modelo de negocio ideal gerado por IA |

### Detalhes tecnicos

- Todos os campos sao `text` e `nullable` com default `NULL`, pois serao preenchidos posteriormente por um processo de enriquecimento via IA (nao no momento da insercao pelo wizard).
- Nao e necessario alterar politicas RLS, pois os campos herdam as politicas ja existentes na tabela.
- Uma unica migration SQL com 3 `ALTER TABLE ... ADD COLUMN`.

### Migration SQL

```sql
ALTER TABLE public.tb_pms_lp_wizard
  ADD COLUMN ideal_target_customers text,
  ADD COLUMN ideal_target_audience text,
  ADD COLUMN ideal_business_model text;
```

### Impacto no codigo

- O arquivo `src/integrations/supabase/types.ts` sera atualizado automaticamente apos a migration para refletir os novos campos.
- Nenhuma outra alteracao de codigo e necessaria neste momento, pois os campos serao consumidos em uma etapa futura.

