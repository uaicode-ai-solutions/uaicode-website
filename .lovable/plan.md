
# Plano: Trocar "Try Another" por "Discard" no Popup de Nome AI

## Resumo

Alterar o texto do botão de cancelamento no popup de sugestão de nome AI de "Try Another" para "Discard", mantendo o comportamento padrão de apenas fechar o dialog.

---

## Arquivo a Modificar

| Arquivo | Ação |
|---------|------|
| `src/components/planningmysaas/wizard/StepYourIdea.tsx` | Alterar texto do botão (linha 746) |

---

## Alteração

### Linha 746 - AlertDialogCancel

```typescript
// Antes:
<AlertDialogCancel>Try Another</AlertDialogCancel>

// Depois:
<AlertDialogCancel>Discard</AlertDialogCancel>
```

---

## Comportamento

O botão `AlertDialogCancel` já possui o comportamento padrão de fechar o dialog sem executar nenhuma ação adicional. A mudança é puramente textual.

---

## Resultado Esperado

Ao clicar em "Discard", o popup simplesmente fecha, sem gerar um novo nome. O usuário pode clicar novamente no botão "Suggest with AI" se quiser uma nova sugestão.
