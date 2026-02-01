

# Plano: Padronizar Largura do KyleChatDialog com o Chat da Eve

## Análise Comparativa

| Propriedade | Eve (ChatSection) | Kyle (KyleChatDialog) | Ação |
|-------------|-------------------|----------------------|------|
| Max-width | `max-w-4xl` (896px) | `sm:max-w-md` (448px) | Aumentar |
| Altura | `h-[550px] sm:h-[600px] md:h-[650px]` | `h-[580px]` | Tornar responsivo |
| Responsivo | Sim | Não | Adicionar breakpoints |

## Mudanças Propostas

### DialogContent - Nova Classe

```tsx
// ANTES
<DialogContent className="sm:max-w-md p-0 overflow-hidden glass-card border-amber-500/20 h-[580px] flex flex-col">

// DEPOIS
<DialogContent className="w-[95vw] max-w-4xl p-0 overflow-hidden glass-card border-amber-500/20 h-[85vh] sm:h-[600px] md:h-[650px] flex flex-col">
```

### Detalhes:

| Propriedade | Valor | Motivo |
|-------------|-------|--------|
| `w-[95vw]` | 95% da largura da tela | Responsivo em mobile |
| `max-w-4xl` | 896px máximo | Igual ao container da Eve |
| `h-[85vh]` | 85% da altura (mobile) | Aproveitamento de tela |
| `sm:h-[600px]` | 600px em telas pequenas | Igual à Eve |
| `md:h-[650px]` | 650px em tablets+ | Igual à Eve |

## Arquivo a Modificar

| Arquivo | Linha | Ação |
|---------|-------|------|
| `src/components/planningmysaas/dashboard/KyleChatDialog.tsx` | 159 | Atualizar classes do DialogContent |

## Código Final

```tsx
<DialogContent className="w-[95vw] max-w-4xl p-0 overflow-hidden glass-card border-amber-500/20 h-[85vh] sm:h-[600px] md:h-[650px] flex flex-col">
```

## Resultado Visual

### Mobile (< 640px)
- Largura: 95% da tela
- Altura: 85% da tela (85vh)
- Bordas arredondadas visíveis

### Tablet/Desktop (≥ 640px)
- Largura: até 896px (max-w-4xl)
- Altura: 600-650px
- Centralizado na tela

