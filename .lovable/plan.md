
# Plano: Corrigir Cards "Your Marketing Investment" e "Marketing Cost Comparison"

## Problema Identificado

Os componentes `MarketingInvestmentSummary` e `MarketingComparisonSlider` ainda mostram valores baseados em 3 serviços ($4,800/mês) ao invés de 5 serviços ($6,000/mês):

| Card | Esperado | Atual |
|------|----------|-------|
| Your Marketing Investment | $21,000/mês (5 serviços) | $19,800/mês (3 serviços) |
| Marketing Cost Comparison | Baseado em todos os serviços | Baseado em 3 serviços |

## Causa Raiz

O `MarketingServiceSelector` inicializa corretamente com todos os serviços quando `readOnly={true}`, mas há uma condição de corrida:

1. O `InvestmentSection` renderiza
2. O `MarketingServiceSelector` recebe `readOnly={true}` e inicia a carga de serviços
3. Enquanto carrega, `marketingTotals` no contexto ainda tem valores zerados/default
4. Os componentes `MarketingInvestmentSummary` e `MarketingComparisonSlider` renderizam com valores errados
5. Depois que o `useEffect` do selector notifica o parent, os valores são atualizados - mas pode não estar funcionando corretamente

## Solução

### Opção A: Inicialização direta no InvestmentSection (Recomendada)

Ao invés de depender do callback do `MarketingServiceSelector`, o `InvestmentSection` deve **inicializar diretamente** os totais com todos os serviços quando estiver em modo readOnly:

```typescript
// InvestmentSection.tsx - Adicionar useEffect para inicializar com todos os serviços
useEffect(() => {
  if (!marketingLoading && services.length > 0) {
    // Em modo readOnly, sempre usar todos os serviços
    const allServiceIds = services.map(s => s.service_id);
    setSelectedMarketingIds(allServiceIds);
    
    const totals = calculateMarketingTotals(allServiceIds, services);
    setMarketingTotals(totals);
  }
}, [services, marketingLoading]);
```

### Arquivos a Modificar

| Arquivo | Mudança |
|---------|---------|
| `InvestmentSection.tsx` | Adicionar useEffect para inicializar totais com todos os serviços |

### Detalhes da Implementação

1. Importar `calculateMarketingTotals` do hook `useMarketingTiers`
2. Adicionar useEffect que:
   - Aguarda serviços carregarem (`!marketingLoading && services.length > 0`)
   - Calcula IDs de todos os serviços
   - Chama `setSelectedMarketingIds` e `setMarketingTotals` diretamente
3. Garantir que isso aconteça antes do primeiro render dos componentes filhos

### Resultado Esperado

| Card | Valor |
|------|-------|
| Your Marketing Investment | $21,000/mês |
| Uaicode Subscription | $6,000/mês |
| Paid Media Budget | $15,000/mês |
| Marketing Cost Comparison - Uaicode | $6,000/mês |
| Marketing Cost Comparison - Uaicode + ADS | $21,000/mês |

## Checklist

- [ ] Importar `calculateMarketingTotals` em InvestmentSection
- [ ] Adicionar useEffect para inicializar com todos os serviços
- [ ] Remover dependência do callback `handleMarketingSelectionChange` para inicialização
- [ ] Testar que os valores aparecem corretamente em "Your Marketing Investment"
- [ ] Testar que os valores aparecem corretamente em "Marketing Cost Comparison"
- [ ] Verificar que os valores são consistentes com Business Plan e Next Steps
