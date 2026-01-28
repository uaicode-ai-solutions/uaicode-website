

# Simplificação: Limpeza do Wizard via CTAs Específicos

## Resumo da Solução

Limpar o `localStorage` do wizard apenas quando o usuário clica em CTAs que iniciam um **novo** report, e remover a limpeza de onde está agora (submit do wizard).

## Onde Limpar o localStorage

### ✅ Lugares que DEVEM limpar (novo report)

| Arquivo | Local | Ação |
|---------|-------|------|
| `src/pages/PmsDashboard.tsx` | `handleNewReport()` | ✅ Já limpa - manter |
| `src/pages/PmsReports.tsx` | Botão "New Report" no header | ❌ Não limpa - **adicionar** |
| `src/pages/PmsReports.tsx` | Card "Create new" no grid | ❌ Não limpa - **adicionar** |
| `src/components/planningmysaas/reports/EmptyReports.tsx` | Botão "Create Your First Report" | ❌ Não limpa - **adicionar** |
| `src/components/planningmysaas/PmsPricing.tsx` | CTA "Validate My Idea Now" | ❌ Não limpa - **adicionar** |

### ❌ Lugares que NÃO devem limpar

| Arquivo | Local | Situação Atual |
|---------|-------|----------------|
| `src/pages/PmsWizard.tsx` | `handleSubmit()` | ❌ Limpa no submit - **remover** |

## Implementação

### 1. `src/pages/PmsWizard.tsx`

**Remover linha ~322:**
```typescript
// REMOVER ESTA LINHA:
localStorage.removeItem(STORAGE_KEY);
```

Isso permite que, se o usuário voltar ao wizard (erro, "Back to Wizard"), os dados ainda estejam lá.

---

### 2. `src/pages/PmsReports.tsx`

**Criar helper function e usar nos dois CTAs:**

```typescript
// Adicionar função helper
const handleNewReport = () => {
  localStorage.removeItem("pms-wizard-data");
  navigate("/planningmysaas/wizard");
};

// Linha 122 - Botão "New Report" no header
// Antes:
onClick={() => navigate("/planningmysaas/wizard")}

// Depois:
onClick={handleNewReport}

// Linha 294 - Card "Create new" no grid  
// Antes:
onClick={() => navigate("/planningmysaas/wizard")}

// Depois:
onClick={handleNewReport}
```

---

### 3. `src/components/planningmysaas/reports/EmptyReports.tsx`

**Adicionar limpeza antes de navegar:**

```typescript
// Adicionar função
const handleNewReport = () => {
  localStorage.removeItem("pms-wizard-data");
  navigate("/planningmysaas/wizard");
};

// Linha 39 - Botão "Create Your First Report"
// Antes:
onClick={() => navigate("/planningmysaas/wizard")}

// Depois:
onClick={handleNewReport}
```

---

### 4. `src/components/planningmysaas/PmsPricing.tsx`

**Adicionar limpeza no CTA da landing page:**

```typescript
const handleValidate = () => {
  // Limpar draft anterior para garantir wizard limpo
  localStorage.removeItem("pms-wizard-data");
  navigate("/planningmysaas/login");
};
```

---

## Fluxo Corrigido

```text
Landing Page CTA → Limpa localStorage → Login → Wizard (vazio)
                        ↓
Reports "New Report" → Limpa localStorage → Wizard (vazio)
                        ↓
Dashboard "New Report" → Limpa localStorage → Wizard (vazio)

         ════════════════════════════════════════════

Wizard submit → NÃO limpa → Navega para Loading
                                    ↓
                 ┌──────────────────┴──────────────────┐
                 ↓                                     ↓
           Sucesso                                Erro/Volta
                 ↓                                     ↓
         Dashboard                              Wizard monta
         (dados ficam no                        (dados do localStorage
          localStorage                           ainda estão lá! ✅)
          até próximo
          "New Report")
```

## Critérios de Aceitação

1. ✅ Dados do wizard persistem se usuário voltar do Loading/Erro
2. ✅ Clicar "New Report" sempre inicia wizard zerado
3. ✅ CTA da landing page sempre inicia wizard zerado
4. ✅ Sem mudanças no comportamento do "Regenerate" (não afeta wizard)

