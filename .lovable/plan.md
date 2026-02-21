
# Adicionar Novos Teams com Escudos de Animais Mineiros

## Resumo

Adicionar 3 novos teams (Product, Education, Tech) ao sistema Hero, incluindo escudos personalizados com animais de Minas Gerais gerados por IA nas cores da UaiCode (dourado/amber sobre fundo preto) para todos os 6 teams.

## Animais Mineiros para os Escudos

| Team       | Animal             | Justificativa                    |
|------------|--------------------|----------------------------------|
| Admin      | Lobo-guara         | Lideranca, visao estrategica     |
| Marketing  | Arara-caninde      | Comunicacao, cores vibrantes     |
| Sales      | Onca-pintada       | Agilidade, forca comercial       |
| Product    | Tamandua-bandeira  | Precisao, foco no detalhe        |
| Education  | Coruja-buraqueira  | Sabedoria, conhecimento          |
| Tech       | Tatu-bola          | Resiliencia, engenharia natural  |

## Alteracoes

### 1. Gerar 6 imagens de escudos via Edge Function

Criar edge function `generate-hero-shields` que usa o Nano Banana (google/gemini-2.5-flash-image) para gerar 6 escudos 2D estilizados com:
- Formato de escudo/brasao
- Animal em estilo flat/vetorial 2D
- Paleta UaiCode: dourado (#FFBF1A, #FF9F00) sobre fundo preto (#000000)
- Salvar no bucket `uaicode-images` no storage

### 2. Atualizar selects de Team nos dialogs

**Arquivos:** `EditUserDialog.tsx` e `InviteUserDialog.tsx`

Adicionar as 3 novas opcoes de team nos selects:
- `<SelectItem value="product">Product</SelectItem>`
- `<SelectItem value="education">Education</SelectItem>`
- `<SelectItem value="tech">Tech</SelectItem>`

### 3. Atualizar a tela /hero/home

**Arquivo:** `src/pages/hero/HeroHome.tsx`

- Adicionar 3 novos subsystems ao array (Product, Education, Tech)
- Substituir os icones do Lucide por imagens dos escudos gerados
- Cada card mostrara o escudo do animal como imagem em vez de icone
- Cards dos novos teams terao `defaultView` vazio (sem dashboard ainda) e serao "coming soon"
- Ajustar grid para acomodar 6 cards: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3`

### 4. Atualizar Sidebar e acessos

**Arquivo:** `src/components/hero/HeroSidebar.tsx`

- Adicionar `"product"`, `"education"`, `"tech"` ao array `accessibleSubsystems`
- Adicionar labels no `subsystemLabels`

**Arquivo:** `src/hooks/useHeroAuth.ts`

- Nenhuma alteracao necessaria: `canAccessSubsystem` ja verifica `heroTeam === subsystem` dinamicamente

### 5. Sequencia de execucao

1. Criar edge function para gerar os 6 escudos e salvar no storage
2. Executar a geracao das imagens
3. Atualizar `EditUserDialog.tsx` e `InviteUserDialog.tsx` com novos teams
4. Atualizar `HeroHome.tsx` com novos cards usando as imagens dos escudos
5. Atualizar `HeroSidebar.tsx` com novos subsystems
