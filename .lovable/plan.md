

## Remover tabela `tb_pms_reports_investment` ✅ CONCLUÍDO

### Resultado

- Migration executada com sucesso: `DROP TABLE IF EXISTS public.tb_pms_reports_investment CASCADE;`
- Todas as 6 RLS policies foram removidas automaticamente pelo CASCADE
- O tipo em `types.ts` será atualizado na próxima sincronização automática

### Próximo passo (manual, fora do Lovable)

- **n8n**: remover o nó de Supabase Update/Insert que gravava na `tb_pms_reports_investment`. Manter apenas o nó que grava `section_investment` no `tb_pms_reports`.
