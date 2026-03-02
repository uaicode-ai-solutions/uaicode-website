

# Adicionar banner do Kyle abaixo da Hero no relatório

## Alteração

**Arquivo:** `src/pages/hero/HeroReportPreview.tsx`

Adicionar o componente `MeetKyleSection` (já existente) logo abaixo do `<SharedReportHero />`. Este componente já tem os 3 botões (Email, Chat, Call) com os dialogs do Kyle incluídos.

- Importar `MeetKyleSection` de `@/components/planningmysaas/dashboard/sections/MeetKyleSection`
- Importar `useReportContext` (já usado) para obter o `wizardId`
- Inserir `<MeetKyleSection wizardId={wizardId} />` entre `<SharedReportHero />` e `<BusinessPlanTab />`
- Obter `wizardId` do `useReportContext()` no componente `HeroReportContent`

O texto do banner existente já diz "Have questions? Talk to Kyle - Your AI sales consultant, available 24/7", que encaixa perfeitamente com o pedido de ajudar com dúvidas sobre o relatório ou agendar a call.

## Arquivo Alterado
1. `src/pages/hero/HeroReportPreview.tsx` -- adicionar MeetKyleSection após SharedReportHero
