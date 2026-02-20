

# Ajustar Opacidade do Background - Hero Login

## Problema
A imagem do founder esta muito escura no lado direito devido ao overlay de opacidade uniforme (`from-black/80 via-black/60 to-black/40`).

## Solucao
Alterar o gradiente para manter o lado esquerdo escuro (para o texto ficar legivel) e reduzir drasticamente a opacidade no lado direito, deixando a imagem do founder bem mais visivel.

## Alteracao

**Arquivo:** `src/pages/hero/HeroLogin.tsx` (linha 69)

De:
```
bg-gradient-to-br from-black/80 via-black/60 to-black/40
```

Para:
```
bg-gradient-to-r from-black/85 via-black/40 to-black/10
```

- `from-black/85` - lado esquerdo bem escuro (texto legivel)
- `via-black/40` - transicao suave no meio
- `to-black/10` - lado direito quase transparente (founder visivel)
- Direcao alterada de `to-br` para `to-r` (esquerda para direita, horizontal)

## Arquivo

| Arquivo | Acao |
|---|---|
| `src/pages/hero/HeroLogin.tsx` | Atualizar classe do overlay (linha 69) |

