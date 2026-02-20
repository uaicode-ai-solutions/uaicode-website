
# Imagem de Fundo no Hero Login + Ano Dinamico no Rodape

## 1. Gerar imagem com Nano Banana

Criar uma imagem representativa da Uaicode usando o modelo `google/gemini-2.5-flash-image` via edge function. A imagem sera gerada com o prompt focado na identidade visual da Uaicode: fundo escuro com tons de dourado/amarelo (#FFBF1A), elementos de tecnologia e IA, estilo corporativo moderno.

A imagem sera gerada e salva como asset no projeto para uso como background do lado esquerdo da tela `/hero`.

**Prompt da imagem:**
"Abstract dark corporate technology background, deep black gradient with golden amber light rays (#FFBF1A), subtle circuit board patterns, AI neural network nodes glowing in gold, minimalist modern design, professional corporate feel, no text, 4K quality, portrait orientation 9:16"

## 2. Background no lado esquerdo do `/hero`

No arquivo `src/pages/hero/HeroLogin.tsx`, o lado esquerdo (linhas 69-96) atualmente tem apenas gradientes CSS. A alteracao sera:

- Adicionar a imagem gerada como `background-image` com `object-cover`
- Manter um overlay escuro com gradiente para garantir legibilidade do texto
- A imagem ficara como fundo com opacidade controlada

## 3. Ano dinamico no rodape

Existem **dois locais** com ano hardcoded "2025":

1. **Footer.tsx (linha 346)**: `© 2025 Uaicode. All rights reserved...`
2. **HeroLogin.tsx (linha 93)**: `© 2025 Uaicode. Internal use only.`

Ambos serao alterados para usar `new Date().getFullYear()` para atualizar automaticamente.

---

## Detalhes Tecnicos

### Edge Function para gerar imagem
Criar uma edge function temporaria ou usar o `LOVABLE_API_KEY` existente para chamar o endpoint `ai.gateway.lovable.dev` com o modelo Nano Banana e gerar a imagem. A imagem base64 resultante sera salva como arquivo `.webp` no projeto em `src/assets/hero-login-bg.webp`.

### HeroLogin.tsx - Lado esquerdo
```tsx
// Adicionar import da imagem
import heroLoginBg from "@/assets/hero-login-bg.webp";

// No div do lado esquerdo, adicionar a imagem como background
<div className="relative w-full lg:w-1/2 ...">
  <img src={heroLoginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
  <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/60 to-black/40" />
  {/* conteudo existente */}
</div>
```

### Footer.tsx - Ano dinamico (linha 346)
```tsx
// De:
© 2025 Uaicode. All rights reserved...
// Para:
© {new Date().getFullYear()} Uaicode. All rights reserved...
```

### HeroLogin.tsx - Ano dinamico (linha 93)
```tsx
// De:
© 2025 Uaicode. Internal use only.
// Para:
© {new Date().getFullYear()} Uaicode. Internal use only.
```

### Arquivos editados
| Arquivo | Alteracao |
|---|---|
| Nova edge function (temporaria) | Gerar imagem via Nano Banana |
| `src/assets/hero-login-bg.webp` | Novo arquivo - imagem gerada |
| `src/pages/hero/HeroLogin.tsx` | Background image + ano dinamico |
| `src/components/Footer.tsx` | Ano dinamico |
