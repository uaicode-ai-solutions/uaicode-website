

# Corrigir Imagem Hero Login - Altura Total + Founder a Direita

## Problemas identificados

1. **Imagem quadrada** - precisa ser em formato retrato (9:16) para preencher a altura total da tela
2. **Founder no lado errado** - o founder (Rafael Luz) precisa estar do lado direito da imagem, nao do esquerdo

## O que sera feito

### 1. Regenerar a imagem com composicao corrigida

Usar o modelo Nano Banana (`google/gemini-2.5-flash-image`) com a imagem do founder como referencia e um prompt corrigido:

- Formato **retrato 9:16** (portrait) para preencher a altura total
- **Founder posicionado do lado direito** da imagem
- Outro empresario do lado esquerdo
- Mesma paleta UaiCode: preto (#000000), amarelo dourado (#FFBF1A, #FF9F00)
- Sem tons amber/laranja/marrom

**Prompt atualizado:**
"Professional cinematic photograph, portrait orientation 9:16 tall format. Two businessmen in dark suits shaking hands closing a deal. The person from the reference photo must be positioned on the RIGHT side of the image. The other businessman on the LEFT side. Setting: modern dark office. Lighting: dramatic golden yellow spotlights (#FFBF1A, #FF9F00). Background: deep black (#000000) with subtle golden bokeh. Color palette: ONLY black and golden yellow. NO amber, NO orange, NO brown. Photorealistic, shallow depth of field. No text."

### 2. Verificar CSS do HeroLogin.tsx

O CSS atual ja tem `object-cover` e `h-full` no container, mas verificar se o `lg:min-h-screen` esta funcionando corretamente para garantir que a imagem preencha 100% da altura da tela.

O container atual (linha 69):
```
<div className="relative w-full lg:w-1/2 h-56 sm:h-72 lg:h-auto lg:min-h-screen overflow-hidden">
```

A tag `<img>` (linha 70):
```
<img src={heroLoginBg} alt="" className="absolute inset-0 w-full h-full object-cover" />
```

Isso ja deveria funcionar - o `object-cover` garante que a imagem cubra todo o espaco. Com uma imagem em formato retrato (tall), o resultado sera muito melhor.

## Arquivos afetados

| Arquivo | Alteracao |
|---|---|
| `src/assets/hero-login-bg.webp` | Nova imagem regenerada (retrato, founder a direita) |

Nenhuma alteracao de codigo necessaria - apenas a nova imagem.
