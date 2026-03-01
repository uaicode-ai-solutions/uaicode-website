

## Centralizar conteudo verticalmente no frame central

Alterar o `<main>` no `LeadWizardLayout.tsx` para usar `flex items-center justify-center` combinado com `min-h` calculado (descontando header e footer), permitindo centralizacao vertical em steps curtos enquanto steps com muito conteudo continuam scrollando naturalmente.

### Alteracao

**Arquivo:** `src/components/pms-lead-wizard/LeadWizardLayout.tsx` (linha 61)

Mudar o `<main>` de:
```
<main className="flex-1 overflow-y-auto py-8 pb-24">
```
Para:
```
<main className="flex-1 overflow-y-auto py-8 pb-24 flex items-center justify-center">
```

Isso centraliza verticalmente o conteudo quando ele e menor que o espaco disponivel, e permite scroll natural quando o conteudo excede a area visivel.

