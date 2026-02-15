

## Adicionar coluna `slides_json` na tabela `tb_media_content`

### O que sera feito

Adicionar uma coluna `slides_json` do tipo `jsonb` na tabela `tb_media_content` para armazenar o array de slides dos carrosséis gerados pela IA.

### SQL da Migration

```sql
ALTER TABLE public.tb_media_content
ADD COLUMN slides_json jsonb DEFAULT '[]'::jsonb;
```

### Detalhes tecnicos

- **Tipo:** `jsonb` — permite queries e indexacao eficiente no Postgres
- **Default:** `'[]'::jsonb` — array vazio para evitar nulls
- **Nullable:** Sim (posts do tipo `single_image` podem nao ter slides)
- **Nenhuma alteracao de RLS necessaria** — as policies existentes ja cobrem todas as operacoes na tabela

### Apos a migration

No **Node 14 do n8n**, adicionar o mapeamento:

| Campo | Valor |
|---|---|
| `slides_json` | `{{ JSON.stringify($json.slides) }}` |

Nenhuma alteracao de codigo no frontend e necessaria — essas tabelas sao consumidas exclusivamente pelos workflows n8n.

