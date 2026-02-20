
# Popup de "Usuario nao encontrado" + Trocar Amber para Amarelo UaiCode

## Resumo

Duas alteracoes no Hero Ecosystem:

1. **Novo popup no "Forgot Password"**: Quando o Supabase retorna sucesso mas o email nao existe, informar o usuario para entrar em contato com o administrador do sistema.
2. **Substituir todas as cores `amber` pelo amarelo UaiCode** (`#FFBF1A` / `#FF9F00`) em todos os arquivos do Hero.

---

## 1. Popup "Contate o Administrador"

No `HeroLogin.tsx`, apos o envio do email de recuperacao, ao inves de mostrar apenas "Check your email", exibir uma mensagem mais clara informando que, caso nao receba o email em poucos minutos, deve entrar em contato com o administrador do sistema.

Como o Supabase sempre retorna sucesso (por seguranca), nao temos como saber se o email existe. A melhor abordagem e adicionar uma nota no dialogo de sucesso com orientacao para contato com admin caso nao receba o email.

**Novo conteudo do dialogo de sucesso:**
- Icone de check verde
- Texto principal: "Reset link sent!"
- Texto secundario: "If you don't receive an email within a few minutes, your account may not exist in the system. Please contact the system administrator."
- Email/contato do admin visivel (ex: admin@uaicode.ai)
- Botao "Got it" para fechar

---

## 2. Trocar Amber para Amarelo UaiCode

Adicionar cor customizada `uai` no `tailwind.config.ts` para evitar uso de `amber`:

```
uai: {
  500: '#FFBF1A',
  600: '#FF9F00',
}
```

### Arquivos afetados (trocar toda referencia de `amber-500` para `uai-500` e `amber-600` para `uai-600`):

| Arquivo | Qtd aprox. de trocas |
|---|---|
| `src/pages/hero/HeroLogin.tsx` | ~8 |
| `src/pages/hero/HeroResetPassword.tsx` | ~12 |
| `src/pages/hero/HeroHome.tsx` | ~10 |
| `src/pages/hero/HeroDash.tsx` | 0 (sem amber direto) |
| `src/components/hero/HeroHeader.tsx` | ~3 |
| `src/components/hero/HeroSidebar.tsx` | ~2 |
| `src/components/hero/HeroRoute.tsx` | ~1 |
| `src/components/hero/mock/AdminOverview.tsx` | ~4 |
| `src/components/hero/mock/MarketingOverview.tsx` | ~6 |
| `src/components/hero/mock/SalesOverview.tsx` | ~6 |

**Mapeamento de cores:**
- `amber-500` -> `uai-500` (#FFBF1A)
- `amber-600` -> `uai-600` (#FF9F00)
- `amber-400` -> `uai-500` (sem necessidade de tom mais claro)
- `amber-500/xx` (opacidades) -> `uai-500/xx`

---

## Detalhes Tecnicos

### tailwind.config.ts
Adicionar no `extend.colors`:
```ts
uai: {
  500: '#FFBF1A',
  600: '#FF9F00',
},
```

### HeroLogin.tsx - Dialogo de Forgot Password
Alterar o bloco `forgotSuccess` para incluir mensagem sobre contato com admin, usando as cores UaiCode (#FFBF1A) no estilo do popup.

### Todos os arquivos Hero
Substituicao mecanica: `amber-500` -> `uai-500`, `amber-600` -> `uai-600`, `amber-400` -> `uai-500`.
