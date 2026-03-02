
# Adicionar botão "Voltar ao Topo" nas páginas PMS

## Alteração

Reutilizar o componente `BackToTopButton` (já existente em `src/components/blog/BackToTopButton.tsx`) nas páginas que precisam dele.

**Arquivo:** `src/pages/PmsDashboard.tsx`
- Importar e adicionar `<BackToTopButton />` no final do JSX

**Arquivo:** `src/pages/PmsSharedReport.tsx`
- Importar e adicionar `<BackToTopButton />` no final do JSX

**Arquivo:** `src/pages/hero/HeroReportPreview.tsx`
- Importar e adicionar `<BackToTopButton />` dentro do componente `HeroReportContent`

O componente já existe e funciona: aparece ao scrollar 300px, com animação suave de volta ao topo.
