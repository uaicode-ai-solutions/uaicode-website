

## Ajustes no Lead Wizard

### 1. Remover icone Sparkles da WelcomeStep

Remover o bloco do icone de estrela (Sparkles) que aparece acima do titulo "Validate Your SaaS Idea". O logo da UaiCode ja esta no header do layout, entao nao precisa de icone adicional.

**Arquivo:** `src/components/pms-lead-wizard/steps/WelcomeStep.tsx`
- Remover o `div` com o icone `Sparkles` (linhas 11-13)
- Remover import de `Sparkles` (manter apenas nos items da lista onde e reutilizado)

### 2. Corrigir layout para header/footer fixos com conteudo scrollavel

O problema atual: o `main` usa `flex-1 flex items-center justify-center` o que tenta centralizar verticalmente o conteudo mas cria scroll interno quando ha muitos cards (como no SaasTypeStep com `max-h-[50vh] overflow-y-auto`).

**Arquivo:** `src/components/pms-lead-wizard/LeadWizardLayout.tsx`
- Tornar o header (logo + progress dots) `sticky top-0` com `z-50` e `backdrop-blur`
- O footer ja e `fixed bottom-0` -- manter
- Mudar o `main` de `flex items-center justify-center` para `overflow-y-auto` com padding adequado, permitindo scroll nativo da pagina ao inves de scroll interno no frame do meio

**Arquivo:** `src/components/pms-lead-wizard/steps/SaasTypeStep.tsx`
- Remover `max-h-[50vh] overflow-y-auto` do grid de cards -- o scroll agora sera feito pelo conteudo principal da pagina

**Arquivo:** `src/components/pms-lead-wizard/steps/IndustryStep.tsx`
- Verificar e remover `max-h` / `overflow-y-auto` se existir (mesmo padrao)

### Resumo de alteracoes

| Arquivo | Alteracao |
|---------|-----------|
| `WelcomeStep.tsx` | Remover icone Sparkles acima do titulo |
| `LeadWizardLayout.tsx` | Header sticky, main com scroll nativo |
| `SaasTypeStep.tsx` | Remover `max-h-[50vh] overflow-y-auto` |
| `IndustryStep.tsx` | Remover `max-h` / `overflow` se existir |
