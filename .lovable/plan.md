

# Incluir coluna Company e ajustar larguras

## O que muda

Adicionar de volta a coluna "Company" na tabela de leads e redistribuir as larguras para que tudo caiba na tela.

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

1. Adicionar header "Company" entre "Email" e "Job Title" com largura fixa
2. Adicionar `<td>` com `lead.company_name` na mesma posicao, com `truncate` para textos longos
3. Redistribuir larguras das colunas:
   - Name: `w-[18%]`
   - Email: `w-[22%]`
   - Company: `w-[15%]`
   - Job Title: `w-[17%]`
   - Country: `w-[10%]`
   - Created: `w-[12%]`
   - Actions: `w-[6%]`
4. Atualizar `colSpan` de loading e empty state de `6` para `7`
5. Adicionar "Company" de volta no array de headers do CSV export

