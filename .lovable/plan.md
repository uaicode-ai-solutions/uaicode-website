

# Forgot Password para Hero Ecosystem

Adicionar funcionalidade de "Esqueci minha senha" na tela de login do Hero (`/hero`) e criar uma pagina dedicada de reset de senha (`/hero/reset-password`) com o visual dark/amber do Hero Ecosystem.

---

## Alteracoes

### 1. `src/pages/hero/HeroLogin.tsx`
- Adicionar estado para modo "forgot password" (dialog ou inline)
- Adicionar link "Forgot your password?" abaixo do campo de senha
- Ao clicar, abrir um Dialog pedindo o email
- Chamar `resetPassword(email)` do `useAuthContext()` com `redirectTo` apontando para `/hero/reset-password`
- Exibir mensagem de sucesso ("Check your email") ou erro

### 2. `src/pages/hero/HeroResetPassword.tsx` (novo arquivo)
- Pagina de redefinicao de senha no estilo Hero (fundo preto, amber accents)
- Escuta o evento `PASSWORD_RECOVERY` do Supabase Auth
- Formulario com: nova senha, confirmacao, indicador de forca
- Usa `updatePassword()` do `useAuthContext()`
- Estados: loading, link invalido/expirado, formulario, sucesso
- Botao "Back to Login" aponta para `/hero`

### 3. `src/App.tsx`
- Adicionar rota publica `/hero/reset-password` apontando para `HeroResetPassword`

---

## Detalhes Tecnicos

- O `redirectTo` no `resetPasswordForEmail` sera `window.location.origin + '/hero/reset-password'` para garantir que o link do email leve a pagina correta do Hero (nao do PMS)
- A pagina de reset reutiliza o componente `PasswordStrengthIndicator` ja existente
- O visual segue o padrao dark/glassmorphism do Hero Ecosystem (bg-black, amber-500, white text)
- Nenhuma alteracao no backend e necessaria -- usa as mesmas funcoes do Supabase Auth

