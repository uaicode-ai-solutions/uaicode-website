

# Migrar Newsletter para Dados Dinamicos do Supabase

## Problema
A pagina `/newsletter` exibe posts hardcoded no codigo (`mockPosts`). Posts criados no banco `tb_web_newsletter_posts` nao aparecem na interface.

## Solucao
Buscar posts dinamicamente da tabela `tb_web_newsletter_posts` usando React Query, mantendo os `mockPosts` como fallback caso a query falhe.

---

## Passo 1: Criar hook `useNewsletterPosts`

Criar um hook dedicado em `src/hooks/useNewsletterPosts.ts` que:
- Busca posts publicados da tabela `tb_web_newsletter_posts` ordenados por data
- Mapeia os campos do banco para a interface `BlogPost` existente
- Usa o avatar default do founder como fallback para `author_avatar_url`
- Usa "UaiCode Team" como fallback para `author_name`

## Passo 2: Atualizar `Newsletter.tsx`

- Importar e usar o hook `useNewsletterPosts`
- Combinar posts do banco com os `mockPosts` existentes (banco primeiro, mock depois)
- Ou substituir completamente os mock posts pelos dados do banco (dependendo se queremos manter os posts hardcoded)
- Adicionar estado de loading enquanto os dados carregam
- Manter toda a logica existente de filtros, paginacao e busca

## Passo 3: Garantir fallback do avatar no `BlogCard.tsx`

- Adicionar fallback para o avatar do autor caso venha vazio do banco
- Usar a URL `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png`

---

## Detalhes tecnicos

### Hook `useNewsletterPosts.ts`
```typescript
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const DEFAULT_AVATAR = "https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png";

export const useNewsletterPosts = () => {
  return useQuery({
    queryKey: ["newsletter-posts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("tb_web_newsletter_posts")
        .select("*")
        .eq("status", "published")
        .order("published_at", { ascending: false });

      if (error) throw error;

      return (data || []).map((post) => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt || "",
        content: post.content || "",
        imageUrl: post.cover_image_url || "",
        author: {
          name: post.author_name || "UaiCode Team",
          avatar: post.author_avatar_url || DEFAULT_AVATAR,
        },
        category: post.category || "General",
        publishedAt: post.published_at || post.created_at,
        readTime: post.read_time || "5 min read",
      }));
    },
  });
};
```

### Newsletter.tsx (mudancas principais)
- Importar `useNewsletterPosts`
- Combinar dados do banco com `mockPosts` como fallback
- Mostrar skeleton/loading enquanto carrega
- Posts do banco aparecem primeiro, seguidos dos mock posts

### BlogCard.tsx
- Adicionar fallback no `<img>` do avatar com `onError` handler

### Consideracoes
- Os mock posts existentes continuam funcionando como fallback
- Posts do banco tem prioridade e aparecem primeiro
- A paginacao e filtros existentes continuam funcionando normalmente
- RLS: verificar se a tabela permite leitura publica dos posts publicados

