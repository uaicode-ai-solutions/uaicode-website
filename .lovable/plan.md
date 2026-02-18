

## Remover constraint `tb_media_trends_pillar_check`

A constraint `tb_media_trends_pillar_check` na coluna `pillar` da tabela `tb_media_trends` esta bloqueando insercoes com os novos valores de categoria (ex: "Growth & Scaling"). Vamos remove-la.

### Migration SQL

```sql
ALTER TABLE public.tb_media_trends
DROP CONSTRAINT IF EXISTS tb_media_trends_pillar_check;
```

### Detalhes tecnicos

- **Tabela afetada**: `tb_media_trends`
- **Constraint removida**: `tb_media_trends_pillar_check`
- **Motivo**: Os valores de `pillar` sao definidos pelo workflow n8n e nao precisam de validacao no banco. A constraint antiga limitava a valores antigos (ex: "strategy", "technology", "marketing") que nao correspondem mais as categorias atuais.
- **Risco**: Nenhum. A validacao dos valores corretos ja e feita no prompt do agente de IA no n8n.

