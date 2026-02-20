

# Fix Definitivo: hero-invite-user - CORS bloqueando x-session-id

## Causa Raiz (Confirmada)

O cliente Supabase (`src/integrations/supabase/client.ts`) adiciona um header customizado `x-session-id` a TODAS as requisicoes:

```text
global: {
  headers: {
    'x-session-id': getSessionId()
  }
}
```

Quando o browser faz o preflight CORS (OPTIONS) para a edge function, ele inclui `x-session-id` no `Access-Control-Request-Headers`. A edge function responde com uma lista de headers permitidos que **NAO inclui** `x-session-id`. O browser entao bloqueia o POST -- o request nunca chega ao servidor.

**Evidencia dos analytics:**
- OPTIONS: 200 (preflight passou)
- POST: **nunca aparece nos logs** (browser bloqueou antes de enviar)
- Erro no browser: "Failed to fetch" / "Failed to send a request to the Edge Function"

## Solucao

### Arquivo: `supabase/functions/hero-invite-user/index.ts`

Adicionar `x-session-id` ao `Access-Control-Allow-Headers`:

```text
ANTES:
"authorization, x-client-info, apikey, content-type, x-supabase-client-platform, ..."

DEPOIS:
"authorization, x-client-info, apikey, content-type, x-session-id, x-supabase-client-platform, ..."
```

Isso e uma mudanca de uma unica linha no header CORS da edge function.

## Detalhes Tecnicos

| Aspecto | Detalhe |
|---|---|
| Arquivo alterado | `supabase/functions/hero-invite-user/index.ts` (linha 6) |
| Causa raiz | Header customizado `x-session-id` nao listado no CORS `Allow-Headers` |
| Por que nao apareceu antes | O OPTIONS retorna 200, mas o browser bloqueia o POST silenciosamente |
| Por que o curl funcionou | O curl nao faz preflight CORS |
| Redeploy | Sim, automatico |
| Risco | Zero -- apenas adiciona um header a lista de permissoes CORS |

## Por que os fixes anteriores nao resolveram

1. **Fix do feedback inline**: Correto, mas nao resolvia o problema de rede
2. **Fix do userClient vs adminClient**: Correto para auth, mas o request nunca chegava ao servidor por causa do CORS
3. **Ambos os fixes continuam validos** -- o CORS era o bloqueio que impedia qualquer request de chegar

