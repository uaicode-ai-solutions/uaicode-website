

## Adicionar campo `support_days` na `tb_pms_mvp_tiers`

### Passo 1 - Migration (schema)
Adicionar coluna `support_days` (integer, NOT NULL, default 45):

```sql
ALTER TABLE public.tb_pms_mvp_tiers
  ADD COLUMN support_days integer NOT NULL DEFAULT 45;
```

### Passo 2 - Atualizar dados por tier
Usando o insert tool (UPDATE statements):

```sql
UPDATE public.tb_pms_mvp_tiers SET support_days = 45 WHERE tier_id = 'starter';
UPDATE public.tb_pms_mvp_tiers SET support_days = 90 WHERE tier_id = 'enterprise';
UPDATE public.tb_pms_mvp_tiers SET support_days = 120 WHERE tier_id = 'professional';
```

### Passo 3 - types.ts
Atualizado automaticamente apos a migration com o novo campo `support_days`.

