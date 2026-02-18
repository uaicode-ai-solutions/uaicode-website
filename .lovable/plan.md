

## Corrigir imagem de capa no email da newsletter

### O que muda

Uma unica alteracao cirurgica na edge function `pms-send-newsletter-broadcast/index.ts`. Nenhum outro arquivo sera tocado.

### Alteracao 1: Adicionar funcao helper (apos linha 18, depois da constante `DEFAULT_AUTHOR_AVATAR`)

Inserir esta funcao utilitaria:

```typescript
function encodeStorageUrl(url: string): string {
  try {
    const parsed = new URL(url);
    parsed.pathname = parsed.pathname
      .split('/')
      .map(segment => encodeURIComponent(decodeURIComponent(segment)))
      .join('/');
    return parsed.toString();
  } catch {
    return url;
  }
}
```

### Alteracao 2: Usar a funcao na imagem de capa (linha ~57)

De:
```html
<img src="${post.cover_image_url}"
```

Para:
```html
<img src="${encodeStorageUrl(post.cover_image_url)}"
```

### O que NAO sera alterado

- Nenhuma tabela ou migration
- Nenhum outro arquivo do projeto
- Nenhuma outra parte do HTML do email
- Nenhuma logica de envio, batching ou busca de subscribers
- O campo `cover_image_url` no banco permanece inalterado

### Por que funciona

A funcao apenas codifica os segmentos do path da URL (espacos viram `%20`, `&` vira `%26`), permitindo que clientes de email carreguem a imagem corretamente. Se a URL ja estiver ok, ela passa sem alteracao. Se houver qualquer erro no parsing, retorna a URL original como fallback.

