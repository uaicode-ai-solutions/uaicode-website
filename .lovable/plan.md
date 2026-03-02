

# Corrigir Gráfico J-Curve (Projeções Financeiras)

## Problema
O gráfico J-Curve está sempre caindo porque a receita cresce de forma linear (muito devagar) enquanto os custos de marketing se mantêm altos. A receita nunca ultrapassa os custos, então o gráfico nunca se recupera.

## Solução
Trocar o modelo de crescimento da receita (após o mês 12) de **linear** para **composto**, simulando um crescimento real de SaaS onde a receita cresce um percentual por mês (ex: 5-6% ao mês), desacelerando gradualmente conforme o negócio amadurece.

## Alteração Técnica

### Arquivo: `src/components/planningmysaas/dashboard/JCurveChart.tsx`

Na função `calculateCumulativeFlow`, substituir o cálculo do `revenueGrowthFactor` após o mês 12:

**Antes (linear -- cresce devagar demais):**
```text
revenueGrowthFactor = 1 + ((m - 12) * 0.025)
```

**Depois (composto -- cresce realisticamente):**
```text
Taxa inicial: 6% ao mês
Desaceleração: -0.2% por mês (amadurecimento natural)
Piso mínimo: 2% ao mês (nunca para de crescer)

Resultado:
- Mês 12: fator 1.0x (baseline)
- Mês 24: fator ~1.9x
- Mês 36: fator ~3.2x
- Mês 48: fator ~4.8x
- Mês 60: fator ~6.2x
```

Com isso, a receita eventualmente ultrapassa os custos, criando o formato "J" esperado no gráfico -- queda inicial (investimento) seguida de recuperação (lucro).

## Resultado Esperado
- Gráfico mostra a queda inicial normalmente (fase de investimento)
- Após alguns meses, a receita supera os custos e o gráfico sobe
- O ponto de break-even (equilíbrio) fica visível no gráfico
- Cenários conservador, realista e otimista se diferenciam corretamente

## Arquivos Alterados
1. `src/components/planningmysaas/dashboard/JCurveChart.tsx` -- corrigir fórmula de crescimento na função `calculateCumulativeFlow`
