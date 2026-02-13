

## Ajustar Email da Newsletter: Branding "Uaicode Insights"

Tres ajustes no arquivo `supabase/functions/pms-send-newsletter-broadcast/index.ts`:

### 1. Titulo do remetente (linha 190)
- De: `"UaiCode Newsletter <noreply@uaicode.ai>"`
- Para: `"Uaicode Insights <noreply@uaicode.ai>"`

### 2. Cabecalho do email - logo + nome (linhas 47-50)
- Substituir o emoji `✨` por uma tag `<img>` com a logo da Uaicode hospedada no Supabase Storage
- Alterar o texto de "UaiCode" para "Uaicode Insights"
- Layout: logo (imagem ~28px) ao lado do texto, alinhados horizontalmente

Codigo do header atualizado:
```html
<div style="text-align: center; margin-bottom: 32px;">
  <div style="display: inline-flex; align-items: center; gap: 8px;">
    <img src="https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/uaicode-logo.png" 
         alt="Uaicode" style="width: 28px; height: 28px; border-radius: 6px;" />
    <span style="font-size: 24px; font-weight: 700; color: #FACC15; letter-spacing: -0.5px;">Uaicode Insights</span>
  </div>
  <p style="color: #71717A; font-size: 13px; margin-top: 4px;">New Article Published</p>
</div>
```

> **Nota:** A URL da logo usa o bucket `blog-images` do Supabase Storage. Se a logo ainda nao estiver nesse bucket, sera necessario fazer upload. Caso ja exista em outro path, ajustaremos a URL.

### 3. Rodape do email (linha 86)
- De: `"You're receiving this because you subscribed to the UaiCode newsletter."`
- Para: `"You're receiving this because you subscribed to the Uaicode Insights."`

