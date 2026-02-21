
# Exibir Escudo do Time ao Lado do Avatar no Header

## Resumo

Adicionar o escudo do time do usuario ao lado do avatar no header da pagina `/hero/dash`, utilizando as imagens de escudo ja existentes em `src/assets/`.

## Alteracao

### Arquivo: `src/components/hero/HeroHeader.tsx`

1. Importar as 6 imagens de escudo (`shield-admin.png`, `shield-marketing.png`, `shield-sales.png`, `shield-product.png`, `shield-education.png`, `shield-tech.png`)
2. Criar um mapa `teamShields` que associa o valor do campo `team` do usuario a imagem correspondente
3. No bloco do `DropdownMenuTrigger`, adicionar uma tag `<img>` do escudo (aproximadamente 24x24px) posicionada ao lado esquerdo do avatar
4. Caso o usuario nao tenha team definido ou seja "none", o escudo nao sera exibido

### Resultado visual

O header passara de:

`[Nome do Usuario] [Avatar]`

Para:

`[Nome do Usuario] [Escudo 24px] [Avatar]`

O escudo tera tamanho pequeno (h-6) para manter proporcao com o avatar de 36px.
