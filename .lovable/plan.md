

# Nova Imagem de Fundo - Hero Login

## O que sera feito

Excluir a imagem atual `src/assets/hero-login-bg.webp` e gerar uma nova usando Nano Banana (google/gemini-2.5-flash-image) com as seguintes caracteristicas:

- **Dois empresarios fechando negocio** (aperto de maos, reuniao corporativa)
- **Um dos empresarios com o rosto do founder Rafael Luz** - usando a imagem `src/assets/founder-rafael-luz.webp` como referencia
- **Paleta de cores UaiCode**: fundo escuro (#000000), destaques em amarelo dourado (#FFBF1A, #FF9F00), cinza escuro (#222A2E)
- **SEM usar amber** - foco no amarelo UaiCode como cor principal
- **Estilo**: corporativo premium, iluminacao cinematografica com tons dourados, orientacao retrato (9:16)

## Abordagem tecnica

1. Criar uma edge function temporaria `generate-hero-bg` que:
   - Recebe a imagem do founder como input (base64)
   - Usa o modelo `google/gemini-2.5-flash-image` com image editing (passando a foto do founder + prompt descritivo)
   - Retorna a imagem gerada

2. **Prompt da imagem:**
   "Create a professional corporate photo of two businessmen shaking hands closing a deal. One of the businessmen should look exactly like the person in the reference photo. Dark moody background with warm golden yellow lighting (#FFBF1A). Cinematic corporate atmosphere, shallow depth of field, professional studio quality. Portrait orientation 9:16. No text."

3. Salvar a imagem gerada em `src/assets/hero-login-bg.webp` (substituindo a atual)

4. Nenhuma alteracao em `HeroLogin.tsx` necessaria - ja esta usando o import correto

## Arquivos afetados

| Arquivo | Alteracao |
|---|---|
| `supabase/functions/generate-hero-bg/index.ts` | Nova edge function temporaria |
| `src/assets/hero-login-bg.webp` | Substituir pela nova imagem |

Apos confirmar que a imagem ficou boa, a edge function temporaria sera removida.

