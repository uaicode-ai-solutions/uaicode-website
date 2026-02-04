
# Ocultar Export PDF para Usuários Comuns

## Mudança Solicitada

Esconder a opção "Export to PDF" no dropdown de compartilhamento para usuários comuns, mantendo visível apenas para **admin** e **contributor**.

## Situação Atual

- O componente já importa e usa o hook `useUserRoles` (linha 67, 134)
- As variáveis `isAdmin` e `isContributor` já estão disponíveis
- O botão "Export to PDF" está nas linhas 420-426 do dropdown

## Arquivo a Modificar

**`src/pages/PmsDashboard.tsx`** - linhas 419-426

### De:
```tsx
<DropdownMenuSeparator className="bg-border/30" />
<DropdownMenuItem 
  onClick={handleExportPDF} 
  className="cursor-pointer"
>
  <FileDown className="h-4 w-4 mr-2" />
  Export to PDF
</DropdownMenuItem>
```

### Para:
```tsx
{(isAdmin || isContributor) && (
  <>
    <DropdownMenuSeparator className="bg-border/30" />
    <DropdownMenuItem 
      onClick={handleExportPDF} 
      className="cursor-pointer"
    >
      <FileDown className="h-4 w-4 mr-2" />
      Export to PDF
    </DropdownMenuItem>
  </>
)}
```

## Resultado

| Tipo de Usuário | Vê "Export to PDF"? |
|-----------------|---------------------|
| Admin           | ✅ Sim              |
| Contributor     | ✅ Sim              |
| User (comum)    | ❌ Não              |

A mesma lógica já é usada para o botão "Regenerate" no dashboard, então mantém consistência.
