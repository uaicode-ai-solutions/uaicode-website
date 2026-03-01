

## Atualizar descricoes das features na `tb_pms_mvp_features`

### Objetivo

Reescrever as 28 `feature_description` da tabela `tb_pms_mvp_features` com descricoes muito mais detalhadas e contextuais, para que a IA do n8n consiga identificar com precisao quando cada feature deve ser incluida no PRD de um projeto.

### O que muda

- 28 UPDATEs na coluna `feature_description` da tabela `tb_pms_mvp_features`
- Nenhuma alteracao de schema, front-end ou Edge Functions

### Abordagem das descricoes

Cada descricao incluira:
1. **O que a feature faz** - funcionalidade concreta
2. **Quando usar** - cenarios e tipos de SaaS onde faz sentido
3. **O que inclui tecnicamente** - componentes e capacidades especificas
4. **Exemplos praticos** - casos de uso reais

### Exemplo de antes/depois

**Antes:**
> "User signup, login, password recovery and session management"

**Depois:**
> "Complete user authentication system including email/password registration with validation, secure login with session tokens, password recovery via email, optional social login (Google, GitHub), email verification flow, rate limiting on auth endpoints, and session management with automatic token refresh. Essential for any SaaS that needs to identify individual users, protect private data, or offer personalized experiences. Includes signup forms, login pages, forgot password flow, and account verification. Use this feature when the product requires user accounts, saved preferences, or any form of personalized content."

### Execucao

- 1 operacao de UPDATE com todas as 28 descricoes usando o insert tool (ferramenta de dados, nao migracao)
- Sem alteracao de schema
- Sem alteracao de front-end

