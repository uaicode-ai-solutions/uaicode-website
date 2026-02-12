

## Correcoes no Wizard - Step 1

### Problema
1. O campo Email esta read-only e puxado do login, mas o report pode ser criado para outra pessoa
2. Os campos de contato (email, full_name, phone, linkedin_profile) nao sao salvos na `tb_pms_wizard`, impossibilitando saber para quem o report foi criado

### Solucao

#### 1. Migration: Adicionar 4 colunas na tb_pms_wizard

Adicionar as colunas `client_email`, `client_full_name`, `client_phone` e `client_linkedin` na tabela `tb_pms_wizard`. Usar prefixo "client_" para diferenciar do user logado (user_id).

```sql
ALTER TABLE public.tb_pms_wizard
  ADD COLUMN client_email text,
  ADD COLUMN client_full_name text,
  ADD COLUMN client_phone text,
  ADD COLUMN client_linkedin text;
```

#### 2. Atualizar types.ts

Adicionar os 4 novos campos nos blocos Row, Insert e Update de `tb_pms_wizard`.

#### 3. Tornar campo Email editavel (StepYourInfo.tsx)

- Remover o bloco read-only que exibe o email como texto estatico com "Verified"
- Substituir por um Input normal editavel, igual ao Full Name
- Manter o valor pre-preenchido do login, mas permitir alteracao

#### 4. Adicionar validacao de email no Step 1 (PmsWizard.tsx)

Na funcao `validateStep` para o case 1, adicionar validacao de email:
- Email obrigatorio
- Formato basico de email valido (conter @ e .)

#### 5. Salvar os 4 campos no insert do wizard (PmsWizard.tsx)

No `handleSubmit`, adicionar ao insert de `tb_pms_wizard`:
```
client_email: data.email,
client_full_name: data.fullName,
client_phone: data.phone || null,
client_linkedin: data.linkedinProfile || null,
```

#### 6. Remover update de tb_pms_users no submit

O bloco que fazia update em `tb_pms_users` com os dados do Step 1 deve ser removido, ja que os dados do formulario agora pertencem ao cliente do report, nao ao usuario logado.

### Arquivos alterados
- `supabase/migrations/` - nova migration
- `src/integrations/supabase/types.ts` - 4 campos novos
- `src/components/planningmysaas/wizard/StepYourInfo.tsx` - email editavel
- `src/pages/PmsWizard.tsx` - validacao email + salvar 4 campos + remover update tb_pms_users

