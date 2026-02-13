

## Corrigir 500 intermitente no og-blog-meta para LinkedIn

### Diagnostico
A funcao funciona quando testada diretamente (retorna HTML com meta tags OG corretamente), mas o LinkedIn Post Inspector recebe 500 intermitentemente. A causa provavel e a instabilidade do import via `esm.sh` durante cold starts da Edge Function.

### Solucao
Trocar o import de `esm.sh` para `npm:` specifier (mais estavel no Deno) e adicionar logging para capturar erros silenciosos.

### Mudancas

**Arquivo:** `supabase/functions/og-blog-meta/index.ts`

1. Trocar `import { createClient } from "https://esm.sh/@supabase/supabase-js@2"` por `import { createClient } from "npm:@supabase/supabase-js@2"`
2. Adicionar `console.log` no inicio do GET handler para rastrear requests do LinkedIn
3. Adicionar log do erro real no catch do GET handler (incluir stack trace)
4. Redesenhar o edge function para evitar re-deploy desnecessario do client a cada request

### Detalhes tecnicos

```text
ANTES:  import from "https://esm.sh/@supabase/supabase-js@2"  (CDN externo, pode falhar)
DEPOIS: import from "npm:@supabase/supabase-js@2"             (resolvido pelo Deno nativamente)
```

Apos implementar, redesenhar e testar novamente no LinkedIn Post Inspector.

