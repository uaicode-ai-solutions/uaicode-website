

# Default Author Avatar - Foto do Founder

O upload foi confirmado no bucket `blog-images`. Agora vamos configurar tudo para que essa imagem seja o avatar padrao do autor em todos os posts.

URL publica: `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png`

---

## Passo 1: Migration - Default na coluna

Alterar a coluna `author_avatar_url` da tabela `tb_web_newsletter_posts` para ter o valor default apontando para a imagem do founder.

## Passo 2: Atualizar registros existentes

Todos os posts que atualmente tem `author_avatar_url = NULL` serao atualizados com a URL da foto do founder.

## Passo 3: Fallback na edge function

Atualizar `pms-send-newsletter-broadcast/index.ts` para usar essa URL como fallback caso `author_avatar_url` venha null do banco (mesma logica que ja existe para `author_name`).

## Passo 4: Fallback no frontend (BlogPost e BlogCard)

Garantir que os componentes que exibem o avatar do autor usem essa URL como fallback quando nenhuma imagem for fornecida.

---

## Detalhes tecnicos

### Migration SQL
```sql
ALTER TABLE tb_web_newsletter_posts
ALTER COLUMN author_avatar_url
SET DEFAULT 'https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png';
```

### Update dos registros existentes
```sql
UPDATE tb_web_newsletter_posts
SET author_avatar_url = 'https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png'
WHERE author_avatar_url IS NULL;
```

### Edge function (pms-send-newsletter-broadcast)
Adicionar fallback na funcao `generateNewsletterEmail`:
```typescript
const authorAvatar = post.author_avatar_url || 'https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/founder-rafael-luz-00.png';
```
E incluir a imagem do autor no template HTML do email, ao lado do nome.

### Frontend
Nos componentes `BlogPost.tsx` e `BlogCard.tsx`, usar a mesma URL como fallback para o avatar do autor quando os dados vierem do banco.

