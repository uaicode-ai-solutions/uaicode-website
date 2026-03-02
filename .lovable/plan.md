
# Remover Investment Ask e Alterar CTA do Footer

## Alterações

### 1. Remover seção "Investment Ask" do BusinessPlanTab
**Arquivo:** `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx`
- Remover o import do `InvestmentAskCard`
- Remover o bloco que renderiza `<InvestmentAskCard />` (linhas 121-124)

### 2. Alterar o banner CTA do SharedReportFooter
**Arquivo:** `src/components/planningmysaas/public/SharedReportFooter.tsx`
- Trocar o título de "Want Your Own SaaS Validation Report?" para algo como "Liked What You Saw? Let's Talk Strategy"
- Trocar a descrição para convidar o cliente a agendar uma reunião com um especialista
- Trocar o botão de "Create Your Report" (link para `/planningmysaas`) para "Schedule a Call" (link para `/booking`)
- Trocar o ícone de `ArrowRight` para `Calendar`

## Arquivos Alterados
1. `src/components/planningmysaas/dashboard/sections/BusinessPlanTab.tsx` -- remover InvestmentAskCard
2. `src/components/planningmysaas/public/SharedReportFooter.tsx` -- alterar CTA para agendar reunião via /booking
