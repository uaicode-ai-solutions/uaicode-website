

# Padronizar Botao de Limpar Filtro no Social Media

## Resumo

Substituir o botao atual "Clear Filters" (texto + icone, estilo ghost, visivel apenas quando ha filtros ativos) pelo mesmo estilo usado na tela Leads: botao quadrado com apenas o icone Eraser, sempre visivel mas desabilitado quando nao ha filtros.

## Alteracao

### Arquivo: `src/components/hero/mock/SocialMediaOverview.tsx`

Substituir o bloco condicional das linhas 226-231:

**De:**
```tsx
{hasFilters && (
  <Button variant="ghost" className="h-8 text-xs text-white/40 hover:text-white hover:bg-white/[0.08] gap-1.5" onClick={clearFilters}>
    <Eraser className="w-3.5 h-3.5" />
    Clear Filters
  </Button>
)}
```

**Para:**
```tsx
<button
  onClick={clearFilters}
  disabled={!hasFilters}
  title="Clear filters"
  className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.06] text-white/40 hover:bg-white/[0.08] hover:text-white transition-colors disabled:opacity-30 disabled:pointer-events-none"
>
  <Eraser className="w-4 h-4" />
</button>
```

Diferencas visuais:
- Botao sempre visivel (nao mais condicional), desabilitado quando sem filtros
- Apenas icone, sem texto "Clear Filters"
- Estilo consistente com Leads: borda, fundo sutil, `disabled:opacity-30`
- Icone ligeiramente maior (`w-4 h-4` em vez de `w-3.5 h-3.5`)

