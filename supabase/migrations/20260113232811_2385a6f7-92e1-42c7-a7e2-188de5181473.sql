-- Remover trigger duplicado que está causando chamada dupla do webhook
DROP TRIGGER IF EXISTS tb_pms_users_after_insert_webhook ON public.tb_pms_users;