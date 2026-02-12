
# Avatar do Usuário: Upload no Profile + Exibição nos Headers

## Resumo
Adicionar a possibilidade do usuário fazer upload de uma foto de perfil na página `/planningmysaas/profile`, e exibir essa foto nos botões de avatar dos headers das páginas PmsReports, PmsDashboard e PmsProfile.

## Mudanças

### 1. Banco de Dados
- Adicionar coluna `avatar_url` (text, nullable) na tabela `tb_pms_users`
- Criar bucket de storage `avatars` (público) para armazenar as fotos
- Criar políticas RLS no bucket: usuários autenticados podem fazer upload/update/delete dos próprios arquivos

### 2. Backend - Hook de autenticação
**Arquivo**: `src/hooks/useAuth.ts`
- Adicionar `avatar_url` à interface `PmsUser`
- Adicionar função `updateAvatar` que faz upload da imagem para o bucket `avatars`, atualiza `avatar_url` na tabela e refresca o `pmsUser`

### 3. Página de Profile - Upload de foto
**Arquivo**: `src/pages/PmsProfile.tsx`
- No card "Profile Information", adicionar um avatar circular clicável acima dos campos de nome/email
- Ao clicar, abre um input de arquivo (imagem)
- Ao selecionar, faz upload via `updateAvatar` do hook
- Exibe a foto atual ou um ícone de User como fallback
- Mostrar indicador de loading durante o upload

### 4. Headers - Exibir avatar
**Arquivos**: `src/pages/PmsReports.tsx`, `src/pages/PmsDashboard.tsx`, `src/pages/PmsProfile.tsx`
- No botão do User Dropdown (trigger), substituir o ícone `<User>` por um `<Avatar>` do Radix
- Se `pmsUser.avatar_url` existir, exibir `<AvatarImage>` com a URL
- Senão, exibir `<AvatarFallback>` com as iniciais do nome ou o ícone User

## Detalhes Técnicos

### Migration SQL
```sql
-- Adicionar coluna avatar_url
ALTER TABLE tb_pms_users ADD COLUMN avatar_url text;

-- Criar bucket de storage
INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- RLS: upload apenas do próprio avatar (path = auth_user_id/filename)
CREATE POLICY "Users can upload own avatar"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update own avatar"
ON storage.objects FOR UPDATE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete own avatar"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Anyone can view avatars"
ON storage.objects FOR SELECT
USING (bucket_id = 'avatars');
```

### Upload path pattern
`avatars/{auth_user_id}/avatar.{ext}` - cada usuario tem sua pasta, sobreescrevendo a foto anterior.

### Componente Avatar no Header
Usando o componente `@radix-ui/react-avatar` que ja esta instalado (`src/components/ui/avatar.tsx`):
```tsx
<Avatar className="h-9 w-9 border border-border/50">
  <AvatarImage src={pmsUser?.avatar_url} alt={pmsUser?.full_name} />
  <AvatarFallback className="bg-accent/10">
    <User className="h-4 w-4" />
  </AvatarFallback>
</Avatar>
```

### Profile Upload UI
Avatar circular de ~80px centralizado no topo do card Profile Information, com overlay de camera/edit ao hover, input file hidden acionado por click.
