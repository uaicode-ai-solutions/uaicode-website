

# Kyle Avatar no Header - Dashboard e Tela Compartilhavel

## Resumo
Adicionar o avatar do Kyle ao lado do avatar do usuario apenas no header do Dashboard (`PmsDashboard.tsx`) e no header da tela compartilhavel (`SharedReportHeader.tsx`). Ao clicar, abre dropdown com 3 opcoes: Email, Chat e Voice Call.

## Mudancas

### 1. `src/pages/PmsDashboard.tsx`
- Importar `kyleAvatar`, `KyleConsultantDialog`, `KyleChatDialog`, `EmailKyleDialog`, icones `Mail`, `MessageSquare`, `Phone`, e componentes de `DropdownMenu`
- Adicionar 3 estados: `kyleDialogOpen`, `kyleChatDialogOpen`, `emailKyleDialogOpen`
- Inserir o Kyle DropdownMenu ao lado do User avatar no header
- Renderizar os 3 dialogs no final do componente, passando `wizardId` (ja disponivel via `useParams`)

### 2. `src/components/planningmysaas/public/SharedReportHeader.tsx`
- Importar os mesmos componentes do Kyle
- Adicionar o Kyle avatar dropdown no header da pagina publica compartilhavel
- Na tela publica nao ha `wizardId` autenticado, entao passar o valor disponivel do contexto compartilhado ou undefined

## Detalhes Tecnicos

### Estrutura do Kyle Dropdown
```tsx
<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="ghost" size="icon" className="relative hover:bg-amber-500/10 border border-amber-500/30 rounded-full h-10 w-10">
      <img src={kyleAvatar} alt="Kyle" className="h-9 w-9 rounded-full object-cover" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent align="end" className="w-48 glass-premium border-amber-500/20">
    <DropdownMenuItem onClick={() => setEmailKyleDialogOpen(true)}>
      <Mail className="h-4 w-4 mr-2" /> Email Kyle
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setKyleChatDialogOpen(true)}>
      <MessageSquare className="h-4 w-4 mr-2" /> Chat with Kyle
    </DropdownMenuItem>
    <DropdownMenuItem onClick={() => setKyleDialogOpen(true)}>
      <Phone className="h-4 w-4 mr-2" /> Call Kyle
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>
```

### Paginas que NAO recebem o Kyle avatar
- `PmsReports.tsx` - nao precisa, Kyle tira duvidas do relatorio especifico
- `PmsProfile.tsx` - nao precisa

