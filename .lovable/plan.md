

# Plano: Mostrar Todos os Serviços de Marketing no Bundle

## Objetivo

Modificar o card "Investment Ask" para:
1. Mostrar **todos os 5 serviços de marketing** (não apenas os 3 recomendados)
2. Remover a informação de "+30 bonus support days"

## Serviços a Incluir

| Serviço | Ícone |
|---------|-------|
| Project Manager | Briefcase |
| Paid Media Manager | Megaphone |
| Digital Media | Palette |
| Social Media | Share2 |
| CRM Pipeline Manager | Users |

## Alterações

### Arquivo: `src/components/planningmysaas/dashboard/businessplan/InvestmentAskCard.tsx`

1. **Atualizar lista de serviços** (linhas 71-76)
   - Expandir de 3 para 5 serviços
   - Adicionar ícones adequados para cada serviço

2. **Remover seção de bonus days** (linhas 156-163)
   - Remover o bloco condicional que exibe `bundleBonusDays`

## Resultado Visual

```
┌─────────────────────────────────────────────────────────────┐
│  🚀 MVP + Marketing Bundle          [BEST VALUE]           │
│  $101.5K                                                    │
│  [Save 30%] (Save $43.5K)                                   │
│                                                             │
│  Includes monthly marketing:                                │
│  ✓ Project Manager    ✓ Paid Media      ✓ Digital Media   │
│  ✓ Social Media       ✓ CRM Pipeline                       │
└─────────────────────────────────────────────────────────────┘
```

## Checklist

- [ ] Adicionar imports de ícones: `Briefcase`, `Palette`, `Share2`
- [ ] Expandir `recommendedServices` para incluir todos os 5 serviços
- [ ] Remover bloco de `bundleBonusDays` 
- [ ] Remover import não utilizado: `Gift`

