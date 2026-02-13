

## Remover og-blog-meta e recursos relacionados

### O que sera removido

1. **Edge Function `og-blog-meta`** -- deletar o arquivo `supabase/functions/og-blog-meta/index.ts` e remover a funcao deployada do Supabase

2. **Config.toml** -- remover a entrada `[functions.og-blog-meta]` do arquivo `supabase/config.toml`

3. **Bucket `og-meta` no Storage** -- precisa ser deletado manualmente no dashboard do Supabase (Lovable nao consegue deletar buckets via codigo)

4. **Custom Domain / DNS** -- precisa ser removido manualmente:
   - No **dashboard do Supabase**: Settings > Edge Functions > remover custom domain (se configurado la)
   - No **provedor de DNS** (Cloudflare, etc): remover o registro CNAME/A que aponta `api.uaicode.ai` para o Supabase (se esse dominio era usado apenas para o og-blog-meta)

### O que NAO sera removido (por seguranca)

- Se `api.uaicode.ai` e usado por outras edge functions alem do og-blog-meta, o DNS e custom domain devem permanecer

### Acoes automaticas (Lovable faz)

- Deletar `supabase/functions/og-blog-meta/index.ts`
- Remover entrada do `supabase/config.toml`
- Remover a funcao deployada do Supabase

### Acoes manuais (voce faz)

- Deletar bucket `og-meta` no Supabase Storage: https://supabase.com/dashboard/project/ccjnxselfgdoeyyuziwt/storage/buckets
- Atualizar/remover DNS e custom domain conforme necessario
- Remover o no do n8n que chamava o POST do og-blog-meta

### Detalhe tecnico

No `supabase/config.toml`, sera removido:

```text
[functions.og-blog-meta]
verify_jwt = false
```

O plano tambem inclui remover o arquivo `.lovable/plan.md` que continha o plano anterior relacionado ao og-blog-meta (ou limpar seu conteudo).

