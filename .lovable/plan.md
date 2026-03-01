

## Criar tabela `tb_pms_mvp_tiers` com dados renomeados

### O que sera feito

1. **Criar a tabela `tb_pms_mvp_tiers`** com a mesma estrutura da `tb_pms_mvp_tier` (mesmas colunas, tipos, defaults)
2. **Adicionar RLS policy** de leitura publica (mesma da tabela original)
3. **Inserir os 3 registros** com os nomes de tier alterados:
   - `growth` -> `enterprise` (tier_name: "Enterprise MVP")
   - `enterprise` -> `professional` (tier_name: "Professional MVP")
   - `starter` permanece igual

### Dados que serao inseridos

| tier_id | tier_name | min_price | max_price | min_days | max_days |
|---|---|---|---|---|---|
| starter | Starter MVP | 1,700,000 | 3,200,000 | 45 | 60 |
| enterprise | Enterprise MVP | 3,200,000 | 6,700,000 | 60 | 90 |
| professional | Professional MVP | 6,700,000 | 16,700,000 | 90 | 120 |

### Alteracoes no codigo

**`src/hooks/useMvpTier.ts`** - Atualizar a query para usar `tb_pms_mvp_tiers` em vez de `tb_pms_mvp_tier`

**`src/types/report.ts`** - Atualizar referências de tier IDs (`growth` -> `enterprise`, `enterprise` -> `professional`) nas constantes `FEATURE_TIERS` e `determineMvpTier`

**`src/components/planningmysaas/wizard/StepFeatures.tsx`** - Atualizar os IDs dos tiers no array `tiers` e mapeamentos relacionados

### Detalhes tecnicos

- Migracao SQL: CREATE TABLE + ENABLE RLS + CREATE POLICY
- Insert dos dados via ferramenta de insert (nao via migracao)
- A tabela original `tb_pms_mvp_tier` nao sera removida (pode ser feito depois manualmente)
