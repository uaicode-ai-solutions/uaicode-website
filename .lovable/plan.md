

## Node 9: Upload Image to Supabase Storage

### Pre-requisito: Criar bucket `blog-images`

Antes de configurar o no no n8n, precisamos criar um bucket publico no Supabase para armazenar as imagens do blog. Isso sera feito via migration SQL:

```sql
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true);

-- Permitir upload anonimo (pelo service_role do n8n)
CREATE POLICY "Allow public read blog-images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');
```

---

### Node 9a: Code Node — "Prepare Image Upload"

Esse no converte o base64 em binario e prepara os dados para o upload.

**Tipo:** Code (JavaScript)

```javascript
const imageBase64 = $input.first().json.image_url;

// Remove o prefixo data:image/...;base64, se existir
const base64Clean = imageBase64.replace(/^data:image\/\w+;base64,/, '');

// Gera filename unico usando o slug do artigo
const articleData = $('Article Parser').first().json;
const slug = articleData.slug || 'blog-' + Date.now();
const filename = `${slug}-${Date.now()}.png`;

// Converte base64 para Buffer binario
const binaryData = Buffer.from(base64Clean, 'base64');

return {
  json: {
    filename: filename,
    slug: slug,
    contentType: 'image/png'
  },
  binary: {
    image: {
      data: base64Clean,
      mimeType: 'image/png',
      fileName: filename
    }
  }
};
```

---

### Node 9b: HTTP Request — "Upload to Supabase Storage"

**Configuracao do no:**

| Campo | Valor |
|-------|-------|
| Method | `POST` |
| URL | `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/blog-images/{{ $json.filename }}` |
| Authentication | None (usaremos headers manuais) |
| Send Headers | Sim |
| Content-Type | `image/png` |
| Authorization | `Bearer SERVICE_ROLE_KEY` |
| Send Body | Binary Data |
| Input Data Field Name | `image` |

**Headers especificos:**

- `Authorization`: `Bearer` + sua **Service Role Key** do Supabase (usar credencial do n8n ou expressao referenciando variavel de ambiente)
- `Content-Type`: `image/png`
- `x-upsert`: `true`

---

### Node 9c: Code Node — "Build Public URL"

Monta a URL publica da imagem apos o upload.

```javascript
const filename = $('Prepare Image Upload').first().json.filename;
const publicUrl = `https://ccjnxselfgdoeyyuziwt.supabase.co/storage/v1/object/public/blog-images/${filename}`;

// Traz todos os dados do artigo junto
const articleData = $('Article Parser').first().json;

return {
  json: {
    ...articleData,
    cover_image_url: publicUrl
  }
};
```

---

### Resumo do fluxo

```text
Image Parser (base64)
       |
       v
Prepare Image Upload (Code) --> converte base64 em binario
       |
       v
Upload to Supabase Storage (HTTP Request) --> POST no bucket
       |
       v
Build Public URL (Code) --> monta URL publica + merge com dados do artigo
```

### Resultado esperado

O output do ultimo no tera todos os campos do artigo (`title`, `slug`, `content`, `category`, etc.) mais o campo `cover_image_url` com a URL publica da imagem, pronto para o proximo no de insercao no banco.

### Detalhe tecnico

A **Service Role Key** do Supabase deve ser configurada como credencial no n8n (Environment Variable ou Credential), nunca hardcoded no workflow. Isso garante permissao de upload sem precisar de autenticacao de usuario.

