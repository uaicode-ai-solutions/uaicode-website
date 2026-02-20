

# Fixar largura das colunas e truncar Job Title

## O que muda

Definir larguras fixas para cada coluna da tabela de leads, garantindo que todas caibam na tela. A coluna "Job Title" tera seu conteudo truncado com "..." via CSS quando exceder o espaco disponivel.

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

1. Substituir o loop generico de headers por colunas individuais com `width` ou `className` de largura fixa:
   - Name: `w-[20%]`
   - Email: `w-[25%]`
   - Job Title: `w-[20%]`
   - Country: `w-[12%]`
   - Created: `w-[15%]`
   - Actions: `w-[8%]`

2. Na celula de Job Title no `<tbody>`, aplicar `max-w-[160px] truncate` (CSS nativo do Tailwind que adiciona `overflow: hidden; text-overflow: ellipsis; white-space: nowrap`) e um atributo `title` com o texto completo para que o usuario veja ao passar o mouse.

3. Aplicar `table-fixed` na tag `<table>` para forcar o navegador a respeitar as larguras definidas.

