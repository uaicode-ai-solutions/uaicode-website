
# Corrigir 3 problemas: imagem no card, post nao abre, email

## Problemas identificados

### 1. Post nao abre para leitura
**Causa raiz:** `BlogPost.tsx` (linha 26) busca o post apenas nos `mockPosts` hardcoded:
```typescript
const post = mockPosts.find(p => p.slug === slug);
```
Posts vindos do banco nao existem nesse array, entao o componente redireciona para `/newsletter`.

**Solucao:** Usar o hook `useNewsletterPosts` no `BlogPost.tsx` e combinar com `mockPosts`, assim como foi feito no `Newsletter.tsx`.

### 2. Imagem nao aparece no card
**Causa provavel:** A tabela `tb_web_newsletter_posts` tem RLS habilitada mas pode nao ter uma policy de SELECT para usuarios anonimos. Isso impediria a query do hook de retornar dados. Precisamos verificar e, se necessario, criar uma policy publica de leitura para posts publicados.

Tambem pode ser que a imagem em si esteja acessivel (esta no bucket publico `blog-images`), mas a query do Supabase nao retorna os dados por falta de policy.

### 3. Email sem imagem
O template do email na edge function ja inclui a `cover_image_url`. Se a URL da imagem estiver correta no banco (e esta - verificamos que aponta para o bucket publico), a imagem deveria aparecer. Este problema pode ser resolvido automaticamente ao corrigir os outros dois.

---

## Plano de implementacao

### Passo 1: Verificar/criar RLS policy para leitura publica
Verificar se existe uma policy de SELECT na tabela `tb_web_newsletter_posts`. Se nao houver, criar uma que permita leitura publica dos posts publicados:
```sql
CREATE POLICY "Allow public read of published posts"
ON public.tb_web_newsletter_posts
FOR SELECT USING (is_published = true);
```

### Passo 2: Atualizar BlogPost.tsx para buscar posts do banco
- Importar `useNewsletterPosts`
- Combinar posts do banco com `mockPosts` (mesma logica do Newsletter.tsx)
- Buscar o post pelo slug nesse array combinado
- Passar `allPosts` para o componente `RelatedPosts` tambem
- Adicionar fallback de loading enquanto os dados carregam

### Passo 3: Verificar imagem no email
- Confirmar que a URL `cover_image_url` no banco aponta para um recurso publico acessivel
- A URL atual (`supabase.co/storage/v1/object/public/blog-images/...`) deveria funcionar diretamente em clientes de email

---

## Detalhes tecnicos

### BlogPost.tsx (mudancas)
```typescript
import { useNewsletterPosts } from "@/hooks/useNewsletterPosts";
import { mockPosts } from "./Newsletter";

const BlogPost = () => {
  const { slug } = useParams();
  const { data: dbPosts = [] } = useNewsletterPosts();

  const allPosts = useMemo(() => {
    const slugSet = new Set(dbPosts.map(p => p.slug));
    const uniqueMock = mockPosts.filter(p => !slugSet.has(p.slug));
    return [...dbPosts, ...uniqueMock];
  }, [dbPosts]);

  const post = allPosts.find(p => p.slug === slug);
  // ... rest stays the same, but RelatedPosts uses allPosts
};
```

### Resumo das mudancas
- 1 migration SQL (RLS policy se necessario)
- 1 arquivo editado: `src/pages/BlogPost.tsx`
