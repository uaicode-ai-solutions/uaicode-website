

## Remover mock posts da Newsletter

Remover todos os posts hardcoded (mockPosts) e usar apenas dados do banco de dados.

### Alteracoes

**1. `src/pages/Newsletter.tsx`**

- Deletar o array `export const mockPosts: BlogPost[]` inteiro (linhas 68 ate ~993 aproximadamente)
- Simplificar o `allPosts` memo para usar apenas `dbPosts`:
  ```ts
  const allPosts = useMemo(() => dbPosts, [dbPosts]);
  ```
  (ou usar `dbPosts` diretamente onde `allPosts` e referenciado)

**2. `src/pages/BlogPost.tsx`**

- Remover o import `import { mockPosts } from "./Newsletter";`
- Simplificar o `allPosts` memo para usar apenas `dbPosts`:
  ```ts
  const allPosts = useMemo(() => dbPosts, [dbPosts]);
  ```

Nenhuma alteracao visual -- a pagina continuara funcionando normalmente, agora 100% orientada por dados do banco.

