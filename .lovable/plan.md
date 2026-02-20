
# Fix: Invite User - Feedback Invisivel e Timeout

## Problema
Dois problemas combinados fazem parecer que "nada acontece":

1. **Toast desabilitado**: O arquivo `src/components/ui/sonner.tsx` exporta funcoes vazias (no-ops). Quando o invite falha, `toast.error()` nao mostra nada. Quando tem sucesso, `toast.success()` tambem nao mostra nada.

2. **Erro silencioso na chamada**: O request retorna "Failed to fetch" (visivel apenas no DevTools), mas o catch block so chama `toast.error()` que e um no-op.

## Solucao

### 1. Adicionar feedback inline no `InviteUserDialog.tsx`

Como o toast global esta desabilitado no projeto, adicionar um estado de erro/sucesso inline dentro do dialog:

- Adicionar estado `errorMessage` e `successMessage`
- Mostrar mensagem de erro em vermelho abaixo do formulario quando falha
- Mostrar mensagem de sucesso em verde quando funciona
- Adicionar `console.error` no catch para debugging
- Manter as chamadas de toast como bonus (caso sejam reativadas no futuro)

### 2. Adicionar timeout mais longo na chamada da edge function

O `supabase.functions.invoke` pode estar dando timeout porque a edge function faz varias operacoes (criar user, gerar link, enviar email). Nao ha como configurar timeout no invoke, mas podemos tratar o erro de forma mais informativa.

## Arquivos

| Arquivo | Acao |
|---|---|
| `src/components/hero/admin/InviteUserDialog.tsx` | Adicionar feedback inline (erro/sucesso) + console.error para debugging |

## Detalhes Tecnicos

Adicionar ao componente:
- `const [errorMessage, setErrorMessage] = useState("")`
- `const [successMessage, setSuccessMessage] = useState("")`
- Limpar mensagens no inicio do submit
- No catch: `setErrorMessage(err.message)` + `console.error`
- No sucesso: `setSuccessMessage("Invite sent!")` com auto-close apos 2s
- Renderizar mensagens inline com estilos verde/vermelho

Nenhuma alteracao no backend necessaria - a edge function esta funcionando corretamente (testada e retornando 401 sem auth, como esperado).
