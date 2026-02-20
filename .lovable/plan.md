

# Regenerar Imagem Hero Login - Tentativa 2

## O que sera feito

Gerar uma nova imagem usando a edge function `generate-hero-bg` ja existente, com um prompt refinado e mais descritivo para melhor resultado. A imagem atual sera substituida.

## Mudancas no prompt

O prompt sera mais detalhado para guiar melhor a geracao:

**Novo prompt:**
"Professional cinematic photograph of two businessmen in dark suits shaking hands, closing a business deal. One businessman must look exactly like the person in the reference photo. Setting: modern dark office or conference room. Lighting: dramatic golden yellow spotlights (#FFBF1A, #FF9F00) creating warm highlights on faces and hands. Background: deep black (#000000) with subtle golden bokeh lights. Color palette: ONLY black and golden yellow - NO amber, NO orange, NO brown tones. Photorealistic, shallow depth of field, 9:16 portrait orientation. No text overlays."

## Passos

1. Atualizar o prompt na edge function `generate-hero-bg/index.ts` com o texto refinado acima
2. Fazer deploy da edge function atualizada
3. Chamar a edge function passando a imagem do founder (`founder-rafael-luz.webp`) como referencia
4. Salvar a nova imagem gerada em `src/assets/hero-login-bg.webp` (substituindo a atual)

## Arquivos afetados

| Arquivo | Alteracao |
|---|---|
| `supabase/functions/generate-hero-bg/index.ts` | Prompt refinado |
| `src/assets/hero-login-bg.webp` | Nova imagem gerada |

