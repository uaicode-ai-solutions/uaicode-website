

# Ajustes nos Cards do Planning My SaaS

## Mudancas

### 1. Adicionar nome completo e telefone do lead

- Adicionar `client_full_name` e `client_phone` na query do `tb_pms_wizard` (linha 78)
- Adicionar esses campos na interface `WizardRow` e `MergedCard`
- Exibir o nome completo abaixo do nome do projeto e o telefone ao lado do email no card

### 2. Substituir verde (emerald) por amber/gold (UaiCode)

Todas as ocorrencias de `emerald` serao trocadas por `amber` (tom gold da UaiCode):

| Onde | De | Para |
|---|---|---|
| `getScoreColor` (score >= 70) | `bg-emerald-500` | `bg-amber-500` |
| `getScoreColor` (score >= 40) | `bg-amber-500` | `bg-amber-400` |
| `getVerdictStyle` (proceed/strong) | `emerald-500/15`, `emerald-400`, `emerald-500/20` | `amber-500/15`, `amber-400`, `amber-500/20` |
| `getStatusStyle` (completed) | `emerald-500/15`, `emerald-400` | `amber-500/15`, `amber-400` |

### Arquivo modificado

`src/components/hero/mock/PlanningMySaasOverview.tsx`

### Detalhes tecnicos

**Interface `WizardRow`** -- adicionar:
```text
client_full_name: string | null;
client_phone: string | null;
```

**Interface `MergedCard`** -- adicionar:
```text
clientFullName: string | null;
clientPhone: string | null;
```

**Query Supabase** (linha 78) -- adicionar campos:
```text
id, saas_name, client_email, client_full_name, client_phone, industry, created_at, user_id
```

**Card UI** -- entre o nome do projeto e o email, adicionar linha com nome completo; adicionar telefone abaixo do email:
```text
SaaS Name          [Status Badge]
John Doe
john@email.com
+55 11 99999-0000
Industry
```

**Busca** -- tambem buscar pelo `clientFullName` no filtro de search.

