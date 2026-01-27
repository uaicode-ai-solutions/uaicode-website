
# Correção: Texto do Botão Retry

## Mudança

Simplificar o texto do botão de "Retry Step X" para apenas "Retry", já que o fluxo reinicia completamente do zero.

## Arquivo: `src/pages/PmsLoading.tsx`

### Linha 260

**Antes:**
```tsx
{isRetrying ? "Preparing..." : `Retry Step ${failedStepInfo?.stepNumber || ''}`}
```

**Depois:**
```tsx
{isRetrying ? "Preparing..." : "Retry"}
```

## Justificativa

O botão não retoma de um step específico - ele:
1. Atualiza status para "preparing"
2. Faz reload da página
3. A página detecta "preparing" e reinicia todo o fluxo

Portanto, o texto deve refletir isso: apenas "Retry".
