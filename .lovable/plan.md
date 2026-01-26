

# Plano: Adicionar Role "user" Automaticamente para Novos Usuários

## Objetivo

Modificar a função `handle_new_user()` para atribuir automaticamente a role `"user"` a cada novo usuário, **sem alterar nada do fluxo existente**.

## O Que NÃO Vou Mudar

- O INSERT em `tb_pms_users` continua EXATAMENTE igual
- O ON CONFLICT continua EXATAMENTE igual  
- O RETURN NEW continua EXATAMENTE igual
- Nenhuma lógica existente será alterada

## O Que Vou Adicionar

Apenas **UMA instrução INSERT** no final, antes do RETURN NEW:

```sql
-- Adicionar role "user" para o novo usuário (ignorar se já existe)
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'user'::app_role
FROM public.tb_pms_users
WHERE auth_user_id = NEW.id
ON CONFLICT (user_id, role) DO NOTHING;
```

## Por Que É Seguro

1. **ON CONFLICT DO NOTHING**: Se a role já existir, não faz nada (não dá erro)
2. **SELECT FROM tb_pms_users**: Busca o `user_id` correto baseado no `auth_user_id`
3. **Executa DEPOIS**: Só executa após o INSERT/UPDATE em `tb_pms_users` ter sido concluído
4. **Não altera fluxo**: Todo o código existente permanece intacto

## Função Atualizada (Diferença Mínima)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- ====== CÓDIGO EXISTENTE (INALTERADO) ======
  INSERT INTO public.tb_pms_users (auth_user_id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    split_part(NEW.email, '@', 1),
    COALESCE(
      NULLIF(TRIM(NEW.raw_user_meta_data->>'full_name'), ''),
      NULLIF(TRIM(NEW.raw_user_meta_data->>'name'), ''),
      NULLIF(TRIM(CONCAT(
        NEW.raw_user_meta_data->>'given_name',
        ' ',
        COALESCE(NEW.raw_user_meta_data->>'family_name', '')
      )), ''),
      ''
    )
  )
  ON CONFLICT (auth_user_id) DO UPDATE SET
    full_name = CASE 
      WHEN tb_pms_users.full_name = '' OR tb_pms_users.full_name IS NULL 
      THEN EXCLUDED.full_name 
      ELSE tb_pms_users.full_name 
    END;
  
  -- ====== ÚNICA ADIÇÃO: Atribuir role "user" ======
  INSERT INTO public.user_roles (user_id, role)
  SELECT id, 'user'::app_role
  FROM public.tb_pms_users
  WHERE auth_user_id = NEW.id
  ON CONFLICT (user_id, role) DO NOTHING;
  
  RETURN NEW;
END;
$$;
```

## Resumo

| Item | Status |
|------|--------|
| Criar perfil em tb_pms_users | ✅ Continua igual |
| Atualizar nome se vazio | ✅ Continua igual |
| Trigger existente | ✅ Continua igual |
| **NOVO:** Atribuir role "user" | ➕ Adicionado com segurança |

## Resultado

- **Novos usuários**: Receberão role "user" automaticamente
- **Usuários existentes**: Não serão afetados (podem receber role manualmente via Admin Panel se desejado)
- **Usuários que já têm role "user"**: ON CONFLICT ignora duplicatas

