

## Nova Tabela: `tb_crm_leads`

Criar uma tabela dedicada para armazenar os leads gerados pelo workflow n8n, combinando dados do usuario e do wizard.

### Estrutura da Tabela

| Coluna | Tipo | Obrigatorio | Default | Origem |
|---|---|---|---|---|
| `id` | uuid | Sim | `gen_random_uuid()` | Auto |
| `created_at` | timestamptz | Sim | `now()` | Auto |
| `updated_at` | timestamptz | Sim | `now()` | Trigger |
| `user_id` | uuid | Nao | - | `tb_pms_users.id` |
| `wizard_id` | uuid | Nao | - | `tb_pms_wizard.id` |
| `full_name` | text | Nao | - | Usuario |
| `email` | text | Nao | - | Usuario |
| `phone` | text | Nao | - | Usuario |
| `linkedin_profile` | text | Nao | - | Usuario |
| `saas_name` | text | Nao | - | Wizard |
| `industry` | text | Nao | - | Wizard |
| `budget` | text | Nao | - | Wizard |
| `timeline` | text | Nao | - | Wizard |
| `goal` | text | Nao | - | Wizard |
| `challenge` | text | Nao | - | Wizard |
| `description` | text | Nao | - | Wizard |
| `geographic_region` | text | Nao | - | Wizard |
| `source` | text | Nao | `'n8n_workflow'` | Identificacao |
| `status` | text | Nao | `'new'` | CRM |
| `notes` | text | Nao | - | CRM |
| `score` | integer | Nao | - | Scoring futuro |

### Seguranca (RLS)

- **SELECT**: Apenas admins podem visualizar (`has_role(get_pms_user_id(), 'admin')`)
- **INSERT**: Apenas via service_role (edge functions / n8n com service key)
- **UPDATE**: Apenas admins
- **DELETE**: Apenas admins
- RLS habilitado para proteger os dados dos leads

### Indices

- Indice unico em `(user_id, wizard_id)` para evitar duplicatas no workflow
- Indice em `email` para buscas rapidas
- Indice em `status` para filtragem no CRM

### Trigger

- Trigger `update_tb_crm_leads_updated_at` para atualizar automaticamente o campo `updated_at`

### Detalhes Tecnicos

A migration SQL vai:
1. Criar a tabela `tb_crm_leads`
2. Habilitar RLS
3. Criar as policies de acesso (admin-only para SELECT/UPDATE/DELETE, service_role para INSERT)
4. Criar indices para performance e unicidade
5. Criar trigger para `updated_at`
6. Criar a funcao de trigger se necessario (reutilizando o padrao existente no projeto)

Nenhuma alteracao de codigo frontend e necessaria neste momento -- a tabela sera consumida pelo workflow n8n.

