

# Alterar Email de Recuperacao de Senha para "UaiCode Hero Ecosystem"

## Problema

O email de recuperacao de senha esta usando o branding "PlanningMySaaS by UaiCode". Precisa ser alterado para "UaiCode Hero Ecosystem".

## Solucao

Customizar o template de email de recuperacao de senha do Supabase Auth usando a configuracao em `config.toml` e um arquivo HTML customizado.

## Passos

### 1. Criar template HTML customizado

Criar o arquivo `supabase/templates/recovery.html` com:
- Header: "UaiCode Hero Ecosystem" (em vez de "PlanningMySaaS")
- Mesma paleta visual UaiCode (fundo escuro #0A0A0A, dourado #FACC15)
- Botao "Reset My Password" com link `{{ .ConfirmationURL }}`
- Footer com "UaiCode. All rights reserved." e ano atualizado
- Design premium consistente com os outros emails do sistema

### 2. Atualizar config.toml

Adicionar a configuracao do template de recovery:

```
[auth.email.template.recovery]
subject = "Reset Your Password - UaiCode Hero Ecosystem"
content_path = "./supabase/templates/recovery.html"
```

## Arquivos afetados

| Arquivo | Alteracao |
|---|---|
| `supabase/templates/recovery.html` | Novo - template HTML customizado |
| `supabase/config.toml` | Adicionar configuracao do template de recovery |

## Observacao

O template usa variaveis do Supabase Auth como `{{ .ConfirmationURL }}` para o link de reset e `{{ .SiteURL }}` para URLs do site. O design seguira o mesmo padrao visual dos emails existentes (como o `pms-send-password-changed`), mas com branding "UaiCode Hero Ecosystem".
