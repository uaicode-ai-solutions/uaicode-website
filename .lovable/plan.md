

# Ordenacao por colunas na tabela de Leads

## O que muda

Adicionar setas clicaveis nos cabecalhos das colunas da tabela para ordenar os dados de forma ascendente ou descendente. O estado default sera ordenado por data de criacao (descendente).

## Detalhes Tecnicos

### `src/components/hero/mock/LeadManagement.tsx`

**Novos imports:**
- `ArrowUp`, `ArrowDown`, `ArrowUpDown` de `lucide-react`

**Novo estado:**
- `sortConfig: { key: string; direction: 'asc' | 'desc' }` com valor default `{ key: 'created_at', direction: 'desc' }`

**Logica de ordenacao:**
- Funcao `handleSort(key)`: se a coluna clicada ja e a ativa, inverte a direcao; caso contrario, define a nova coluna com direcao `asc`
- Aplicar ordenacao no `useMemo` de `filtered` (ou criar novo `useMemo` entre `filtered` e `paginatedLeads`) usando `sort()` com comparacao por string (para nome, email, company, job_title, country) e por data (para created_at)
- Tratar valores nulos colocando-os no final independente da direcao

**Colunas ordenaveis:**
- Name (`full_name`)
- Email (`email`)
- Company (`company_name`)
- Job Title (`job_title`)
- Country (`country`)
- Created (`created_at`)

**UI dos cabecalhos:**
- Cada `<th>` ordenavel se torna clicavel com `cursor-pointer` e `hover:text-white/60`
- Icone ao lado do texto:
  - `ArrowUp` (w-3 h-3) quando ativo e direcao `asc`
  - `ArrowDown` (w-3 h-3) quando ativo e direcao `desc`
  - `ArrowUpDown` (w-3 h-3, opacity mais baixa) quando inativo
- Layout do cabecalho: `flex items-center gap-1` dentro do `<th>`

**Componente auxiliar (inline):**
- `SortableHeader({ label, sortKey })` que renderiza o texto + icone correto baseado no `sortConfig` atual e chama `handleSort` no click

