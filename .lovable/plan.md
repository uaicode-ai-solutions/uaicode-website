

## Adicionar confetti na tela de agradecimento (ThankYouStep)

Disparar a animacao de confetti quando o usuario chega na ultima tela apos submeter o formulario.

### Alteracao

**Arquivo:** `src/components/pms-lead-wizard/steps/ThankYouStep.tsx`

- Importar `useEffect` do React e `useConfetti` de `@/hooks/useConfetti`
- Converter o componente de arrow function pura para incluir o hook
- Chamar `fireConfetti()` dentro de um `useEffect` na montagem do componente

