

## Scroll to top ao avançar + autofocus no campo "Other"

### 1. Scroll to top ao mudar de step

**Arquivo:** `src/components/pms-lead-wizard/LeadWizardLayout.tsx`

Adicionar um `useEffect` que observa `currentStep` e faz scroll do `<main>` para o topo sempre que o step muda. Usar uma `ref` no elemento `<main>` e chamar `scrollTo(0, 0)` a cada mudanca de step.

### 2. Autofocus no campo "Other"

Os inputs de "Other" nos steps com cards ja possuem `autoFocus` no JSX (`CountryStep`, `RoleStep`, `SaasTypeStep`, `IndustryStep`, `GeographicRegionStep`). Porem, como o componente ja esta montado quando o usuario clica "Other" (apenas o bloco condicional aparece), o `autoFocus` do React funciona apenas na montagem inicial.

Para garantir o foco, usar `useEffect` com `useRef` em cada input "Other", ou mais simples: como os inputs ja usam `autoFocus` e o bloco condicional `{value === "other" && ...}` causa uma montagem nova do Input a cada vez que "other" e selecionado, o `autoFocus` ja deveria funcionar. Verificar se ha algum problema e, se necessario, adicionar um `useEffect` para forcar o foco.

**Verificacao:** Os 5 steps com "Other" (`CountryStep`, `RoleStep`, `SaasTypeStep`, `IndustryStep`, `GeographicRegionStep`) ja possuem `autoFocus` no Input. Como o Input e montado condicionalmente (`{value === "other" && <Input autoFocus ... />}`), o autoFocus do HTML nativo deve funcionar. Se nao funcionar, adicionaremos um `ref` com `useEffect` para forcar `.focus()`.

### Resumo

| Arquivo | Alteracao |
|---------|-----------|
| `LeadWizardLayout.tsx` | Adicionar `useRef` + `useEffect` para scroll to top ao mudar step |

