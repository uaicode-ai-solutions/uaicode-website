

## Corrigir URL da logo no email da newsletter

O arquivo foi enviado para o bucket com o nome `logo-uaicode-fundo-preto.png`, mas o codigo aponta para `uaicode-logo.png`. Basta atualizar a URL.

### Alteracao

**Arquivo:** `supabase/functions/pms-send-newsletter-broadcast/index.ts` (linha 48)

- De: `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/uaicode-logo.png`
- Para: `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/logo-uaicode-fundo-preto.png`

Apos a alteracao, a Edge Function sera reimplantada automaticamente.

