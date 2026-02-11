

## Deduplicacao de Leads: Apollo + Supabase

### Problema
Cada execucao do workflow Apollo pode trazer leads que ja existem no banco, gerando duplicatas.

### Solucao em 2 camadas

**Camada 1 — Constraint UNIQUE no banco (rede de seguranca)**

Adicionar constraint UNIQUE na coluna `email` da `tb_crm_leads`. Isso garante que mesmo que um lead duplicado chegue ao insert, o banco rejeita silenciosamente.

```text
ALTER TABLE public.tb_crm_leads
  ADD CONSTRAINT tb_crm_leads_email_unique UNIQUE (email);
```

No Supabase Insert Node do n8n, ativar a opcao **"On Conflict: Do Nothing"** (ou trocar para Upsert com `email` como conflict column).

**Camada 2 — Filtro no n8n (otimizacao)**

Adicionar 2 nos entre o Format Lead Data e o Supabase Insert:

1. **Supabase Node (Select):** Buscar todos os emails existentes na `tb_crm_leads`
   - Operacao: Select
   - Tabela: `tb_crm_leads`  
   - Colunas: `email`
   - Filtro: nenhum (ou filtrar por `source = 'apollo_prospecting'`)

2. **Code Node (Filter Duplicates):**
```javascript
const existingEmails = $('Supabase Query').all().map(item => item.json.email);
const newLeads = $('Format Lead Data').all().filter(item => !existingEmails.includes(item.json.email));
return newLeads;
```

### Fluxo atualizado

```text
Apollo Search
  --> Format Lead Data (Code Node)
  --> Supabase Query (buscar emails existentes)
  --> Filter Duplicates (Code Node - remover ja existentes)
  --> Supabase Insert (com ON CONFLICT DO NOTHING)
```

### Detalhes tecnicos

- A constraint UNIQUE no `email` e a protecao definitiva contra duplicatas
- O filtro no n8n evita processamento desnecessario (nao tenta inserir o que ja existe)
- Leads sem email (campo vazio/null) nao serao afetados pela constraint — considerar se isso e desejavel
- Se a base crescer muito (+10k leads), considerar paginar a query de emails existentes ou usar uma abordagem com batch lookup

### Alteracoes necessarias

| Onde | O que |
|---|---|
| Supabase (migration) | `ADD CONSTRAINT tb_crm_leads_email_unique UNIQUE (email)` |
| n8n | Adicionar no Supabase Select + Code Node de filtro |
| n8n | Configurar ON CONFLICT DO NOTHING no Supabase Insert Node |

