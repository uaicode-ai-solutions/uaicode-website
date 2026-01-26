

# Plano: Alterar Botão "Try Another" para Botão de Rejeição

## Resumo

Modificar o popup de logo gerado para substituir o botão "Try Another" (que dispara nova geração e pode travar o usuário em loop) por um simples botão de rejeição "Discard" que apenas fecha o popup.

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Modificar (alterar botão no AlertDialogFooter) |

---

## Mudança no Código

### Antes (linha 795-798)
```tsx
<AlertDialogFooter>
  <AlertDialogCancel onClick={() => handleAILogo()}>
    Try Another
  </AlertDialogCancel>
```

### Depois
```tsx
<AlertDialogFooter>
  <AlertDialogCancel>
    Discard
  </AlertDialogCancel>
```

---

## Comportamento Esperado

1. Usuário clica em "Create with AI" ou "Improve with AI"
2. Logo é gerado e popup abre
3. Usuário vê duas opções:
   - **"Discard"**: Fecha o popup sem aplicar o logo (usuário pode tentar novamente manualmente se quiser)
   - **"Use This Logo"**: Aplica o logo ao formulário
4. O usuário não fica preso em loop de geração

