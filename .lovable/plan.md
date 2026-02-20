

# Badges no Topo dos Cards

Mover as badges (content_type, pillar, status) da parte inferior da imagem para o topo dos cards no grid do Social Media.

## Alteracao

**Arquivo:** `src/components/hero/mock/SocialMediaOverview.tsx`

Na secao do card grid, o bloco de badges atualmente esta posicionado no bottom da imagem com um gradiente `from-black/80` de baixo para cima. A mudanca consiste em:

1. Trocar o posicionamento do container de badges de `bottom-0` para `top-0`
2. Inverter o gradiente de `bg-gradient-to-t from-black/80 via-black/40 to-transparent` para `bg-gradient-to-b from-black/80 via-black/40 to-transparent`, ajustando o padding de `p-3 pt-8` para `p-3 pb-8`
3. Manter todo o restante (estilos das badges, icones, cores de status) inalterado

