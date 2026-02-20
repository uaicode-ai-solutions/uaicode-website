
# Migrar Sistema de Recuperacao de Senha do PMS para o Hero

## Problema Identificado

O sistema do PMS funciona porque usa a URL de producao fixa `APP_URL = "https://uaicode.ai"` para os redirects do Supabase Auth. O Hero usa `window.location.origin` que aponta para a URL de preview do Lovable, que provavelmente nao esta na allowlist do Supabase.

## Alteracoes

### 1. `src/pages/hero/HeroLogin.tsx`
- Substituir `window.location.origin` pela constante `APP_URL` (mesma usada no `useAuth.ts`)
- O redirect passa a ser `https://uaicode.ai/hero/reset-password` em vez da URL de preview

### 2. `src/pages/hero/HeroResetPassword.tsx`
- Adotar o mesmo padrao de deteccao de sessao do `PmsResetPassword.tsx` que funciona:
  - Escutar `PASSWORD_RECOVERY` e `SIGNED_IN` via `onAuthStateChange`
  - Fazer fallback com `getSession()` para verificar se ja existe sessao valida
  - Remover o check de `window.location.hash` (fragil e inconsistente)
- Manter visual Hero (dark/amber)
- Adicionar `calculatePasswordStrength` para validacao de forca minima (como no PMS)
- Redirecionar para `/hero/home` apos sucesso (em vez de `/hero`)

### 3. `src/hooks/useAuth.ts`
- Nenhuma alteracao necessaria -- ja suporta `redirectTo` customizado

## Detalhes Tecnicos

A raiz do problema e que o Supabase so envia emails de recovery com redirects para URLs que estao na allowlist de Authentication > URL Configuration. A URL `https://uaicode.ai` ja esta la (por isso o PMS funciona), mas a URL de preview do Lovable pode nao estar.

Ao usar `APP_URL` consistentemente, o email de recovery sera enviado com o link correto `https://uaicode.ai/hero/reset-password`, que o Supabase aceita e processa normalmente.
