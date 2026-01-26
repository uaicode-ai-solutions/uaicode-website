
# Plano: Adicionar Link "Admin Panel" no Header do Dashboard

## Objetivo

Adicionar o link "Admin Panel" no dropdown do usuário (ícone de bonequinho) na página `PmsDashboard.tsx`, visível apenas para usuários com role `admin`. Isso garante que o acesso ao Admin Panel esteja disponível em **todas** as telas que têm o dropdown de usuário.

## Análise das Telas

| Tela | Tem Dropdown de Usuário | Tem "Admin Panel" |
|------|-------------------------|-------------------|
| PmsReports.tsx | ✅ Sim | ✅ Sim (já implementado) |
| PmsDashboard.tsx | ✅ Sim | ❌ **NÃO** (precisa adicionar) |
| PmsProfile.tsx | ❌ Não (só botão voltar) | N/A |

## Alterações Necessárias

### Arquivo: `src/pages/PmsDashboard.tsx`

#### 1. Adicionar Import do ícone Shield

```tsx
// Na seção de imports do lucide-react, adicionar Shield
import { Shield } from "lucide-react";
```

#### 2. Adicionar Import do hook useUserRoles

```tsx
import { useUserRoles } from "@/hooks/useUserRoles";
```

#### 3. Usar o Hook no Componente

Dentro do componente `PmsDashboardContent`, adicionar:

```tsx
const { isAdmin } = useUserRoles();
```

#### 4. Atualizar o Dropdown Menu (linhas 307-322)

Adicionar o item "Admin Panel" condicionalmente entre "Profile" e "Logout":

```tsx
<DropdownMenuContent 
  align="end" 
  className="w-48 glass-premium border-accent/20"
>
  <DropdownMenuItem 
    onClick={() => navigate("/planningmysaas/profile")}
    className="cursor-pointer"
  >
    <Settings className="h-4 w-4 mr-2" />
    Profile
  </DropdownMenuItem>
  
  {/* Admin Panel - visível apenas para admins */}
  {isAdmin && (
    <DropdownMenuItem 
      onClick={() => navigate("/planningmysaas/admin")}
      className="cursor-pointer"
    >
      <Shield className="h-4 w-4 mr-2 text-accent" />
      Admin Panel
    </DropdownMenuItem>
  )}
  
  <DropdownMenuSeparator className="bg-border/30" />
  <DropdownMenuItem 
    onClick={handleLogout}
    className="cursor-pointer text-red-400 focus:text-red-400"
  >
    <LogOut className="h-4 w-4 mr-2" />
    Logout
  </DropdownMenuItem>
</DropdownMenuContent>
```

## Resultado Visual

O dropdown do usuário ficará assim para **admins**:

```text
┌─────────────────────────┐
│ ⚙️  Profile             │
│ 🛡️  Admin Panel         │  ← Novo item (ícone dourado)
├─────────────────────────┤
│ 🚪  Logout              │
└─────────────────────────┘
```

Para usuários **não-admin**, o "Admin Panel" não aparece.

## Consistência

Esta implementação segue exatamente o mesmo padrão já utilizado em `PmsReports.tsx`:
- Mesmo hook `useUserRoles`
- Mesmo ícone `Shield` com cor accent
- Mesma navegação para `/planningmysaas/admin`
- Mesmo estilo visual UaiCode
