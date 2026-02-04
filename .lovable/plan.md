
## Objetivo
Remover a barra de rolagem interna do modal “Email Kyle” (e manter consistência com o modal da Eve), sem quebrar a usabilidade em telas menores.

---

## Diagnóstico (por que a barra ainda aparece)
No `EmailKyleDialog`, o `DialogContent` está com:
- `max-h-[90vh] overflow-y-auto`

Isso força o conteúdo a ficar limitado a 90% da altura da tela. Se o conteúdo ficar **1px–20px maior** (por espaçamentos/line-heights/renderização do PhoneInput/Textarea), o Radix/Tailwind ativa a rolagem interna.

Observação importante: o modal da Eve também tem esse mesmo par de classes, mas como o conteúdo dela costuma ficar ligeiramente menor, a rolagem não aparece. No Kyle, qualquer diferença pequena pode “passar do limite” e gerar a barra.

---

## Solução proposta (remove a barra no desktop, mantém segurança no mobile)
Em vez de remover a rolagem “para sempre” (o que pode cortar conteúdo em telas baixas), vamos tornar isso **responsivo**:

- **Base (mobile / telas pequenas):** mantém `max-h-[90vh] overflow-y-auto` para garantir que nada fique inacessível.
- **A partir de `sm` (desktop):** remove a limitação e o overflow para eliminar a barra:
  - `sm:max-h-none sm:overflow-visible`

Isso garante que:
- No desktop: não aparece scrollbar (seu caso).
- No mobile: continua scrollável, evitando modal “estourar” fora da tela.

---

## Arquivos a alterar
1) `src/components/planningmysaas/dashboard/EmailKyleDialog.tsx`
- Atualizar a `className` do `DialogContent`:
  - De: `... max-h-[90vh] overflow-y-auto`
  - Para: `... max-h-[90vh] overflow-y-auto sm:max-h-none sm:overflow-visible`

2) (Recomendado para consistência visual) `src/components/chat/EmailContactDialog.tsx`
- Aplicar o mesmo ajuste no `DialogContent` para Kyle/Eve ficarem 100% iguais em comportamento.

---

## Passo a passo de implementação
1. Editar `EmailKyleDialog.tsx` e ajustar as classes do `DialogContent` com os modificadores `sm:`.
2. Editar `EmailContactDialog.tsx` e replicar o mesmo padrão (para manter consistência).
3. Validar visualmente:
   - No desktop (sua tela atual no dashboard): abrir o modal do Kyle e confirmar **sem barra de rolagem**.
   - Em viewport menor (simulação mobile): confirmar que, se necessário, o modal ainda consegue rolar.

---

## Critério de pronto (Definition of Done)
- Modal “Email Kyle” não mostra scrollbar interna no desktop.
- Modal continua utilizável em telas pequenas (rolagem apenas quando necessário).
- Kyle e Eve ficam com o mesmo comportamento de modal (consistência).
