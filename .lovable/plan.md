

# Remover coluna "Company" da tabela de Lead Management

## O que muda

Remover a coluna "Company" da tabela principal no componente `LeadManagement.tsx`. A informacao de Company continuara disponivel no popup de detalhes.

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

1. Remover o header "Company" do array de headers na linha do `thead`
2. Remover o `<td>` que exibe `lead.company_name` nas linhas da tabela
3. Atualizar o `colSpan` dos estados de loading e empty de `7` para `6`

