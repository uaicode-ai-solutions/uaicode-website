

# Simplificar a Tela /hero/home

## Resumo

Remover os cards de Quick Stats, Internal News e Quick Links da pagina HeroHome, mantendo apenas o Header e a secao de Workspaces (incluindo o banner de boas-vindas).

## Alteracao

### Arquivo: `src/pages/hero/HeroHome.tsx`

1. Remover as constantes `quickStats`, `newsItems` e `usefulLinks` (linhas 53-68)
2. Remover os imports nao mais utilizados: `Users`, `FileText`, `Zap`, `BookOpen`, `ExternalLink` (linha 9)
3. Remover os blocos JSX:
   - Quick Stats (linhas 113-123)
   - News + Useful Links (linhas 126-156)

A pagina ficara apenas com:
- Header (`HeroHeader`)
- Banner de boas-vindas (saudacao + nome)
- Secao "Your Workspaces" (cards de Admin, Marketing, Sales)

