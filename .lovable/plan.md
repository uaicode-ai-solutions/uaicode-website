

# Lead Management - Dados Reais + Filtros + CSV Export

## Resumo

Transformar o componente `LeadManagement` de placeholder para uma tela funcional que carrega dados reais da tabela `tb_crm_leads` (49 leads atualmente), com filtros, busca, visualizacao detalhada em popup e export CSV.

## Estrutura da Tela

### Tabela principal (colunas visiveis)
| Coluna | Campo |
|---|---|
| Name | `full_name` |
| Email | `email` |
| Company | `company_name` |
| Job Title | `job_title` |
| Country | `country` |
| Created | `created_at` (formatado) |
| Actions | Icone de "eye" para abrir detalhes |

### Popup de detalhes (ao clicar no icone)
Exibe todas as informacoes do lead organizadas em secoes:
- **Contact**: email, phone, LinkedIn, Facebook, Twitter, GitHub
- **Company**: name, website, industry, size, revenue
- **Location**: city, state, country
- **Role**: job title, seniority, departments

### Filtros (barra acima da tabela)
- **Search** (texto): busca por nome ou email
- **Source** (select): filtro por source
- **Country** (select): filtro por country
- **Botao Download CSV**: exporta os leads filtrados

## Detalhes Tecnicos

### 1. `src/components/hero/mock/LeadManagement.tsx` -- REESCREVER
- Buscar dados do Supabase usando `supabase.from('tb_crm_leads').select('*').order('created_at', { ascending: false })`
- Estados: `leads`, `loading`, `searchTerm`, `sourceFilter`, `countryFilter`, `selectedLead`
- Filtros client-side (49 registros, nao precisa server-side)
- Funcao `downloadCSV()` que gera arquivo CSV dos leads filtrados
- Dialog para exibir detalhes do lead selecionado
- Manter visual dark theme consistente com o restante do dashboard

### 2. Componentes utilizados
- `Dialog` / `DialogContent` do shadcn para o popup de detalhes
- `Select` do shadcn para filtros de source e country
- Icone `Eye` do lucide-react para acao de visualizar
- Icone `Download` do lucide-react para botao CSV

### 3. RLS
- A tabela `tb_crm_leads` ja tem policy de SELECT para admins (`has_role(get_pms_user_id(), 'admin')`)
- O usuario precisa estar logado e ter role admin para ver os leads
- Nenhuma mudanca de schema necessaria

