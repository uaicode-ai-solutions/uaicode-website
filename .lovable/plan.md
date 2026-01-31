
# Plano: Implementar Envio de Email no Share Report

## Visão Geral

Quando o usuário preencher o email no popup "Share Report" e clicar em "Send Email", o sistema enviará um email formatado no padrão visual UaiCode para o destinatário com o link do relatório e a mensagem personalizada (se houver).

## Arquitetura

```text
┌─────────────────────────────────────────────────────────────────┐
│                    ShareReportDialog (Frontend)                  │
│  • email, message, projectName, reportUrl                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                    POST /pms-send-share-report
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│              pms-send-share-report (Edge Function)              │
│  • Recebe: recipientEmail, senderName, projectName,             │
│            reportUrl, personalMessage                           │
│  • Gera HTML com padrão UaiCode                                 │
│  • Envia via Resend API                                         │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                        Resend API                                │
│  • From: PlanningMySaaS <noreply@uaicode.ai>                    │
│  • Subject: "🔗 [SenderName] shared a SaaS Report with you"     │
└─────────────────────────────────────────────────────────────────┘
```

## Mudanças Necessárias

### 1. Nova Edge Function: `pms-send-share-report`

Criar nova edge function seguindo o padrão existente:

| Parâmetro | Tipo | Descrição |
|-----------|------|-----------|
| `recipientEmail` | string | Email do destinatário |
| `senderName` | string | Nome de quem está compartilhando |
| `projectName` | string | Nome do projeto SaaS |
| `reportUrl` | string | URL do relatório compartilhado |
| `personalMessage` | string (opcional) | Mensagem personalizada |

**Template do Email:**
- Header: Gradiente dourado com "🔗 SaaS Report Shared"
- Corpo:
  - Saudação: "Hi there! [SenderName] shared a SaaS validation report with you."
  - Se houver mensagem pessoal: Card com a mensagem
  - Card de Preview: Nome do projeto + botão "View Report"
  - What's Inside: Lista de conteúdo do relatório
- Footer: Links UaiCode + disclaimer
- Cores: `#0A0A0A` (background), `#FACC15` (accent gold), `#141414` (cards)

### 2. Atualizar `ShareReportDialog.tsx`

Conectar o frontend à nova edge function:

- Adicionar import do `supabase` client
- Adicionar import do `toast` (sonner)
- Adicionar import do `useAuth` hook para pegar o nome do usuário logado
- Substituir o `setTimeout` simulado por chamada real à edge function
- Adicionar tratamento de erro com toast
- Adicionar toast de sucesso quando email for enviado

### 3. Adicionar Props Extras ao Dialog

O componente precisa receber informações adicionais:
- `senderName`: Nome do usuário logado (pode vir via `useAuth`)

Alternativa: buscar o `senderName` dentro do próprio componente usando `useAuth()`.

## Detalhes Técnicos

### Edge Function: Estrutura do Código

```typescript
interface ShareReportEmailRequest {
  recipientEmail: string;
  senderName: string;
  projectName: string;
  reportUrl: string;
  personalMessage?: string;
}

// Gera HTML seguindo padrão UaiCode
const generateShareReportEmail = (
  senderName: string,
  projectName: string,
  reportUrl: string,
  personalMessage?: string
) => {
  // Template HTML com cores UaiCode
  // Header dourado, cards escuros, tipografia consistente
};

// Handler padrão com CORS
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  // Validação, geração de email, envio via Resend
});
```

### Frontend: Chamada à Edge Function

```typescript
const handleSendEmail = async () => {
  // Validações existentes...
  
  setIsSending(true);
  
  try {
    const { error } = await supabase.functions.invoke('pms-send-share-report', {
      body: {
        recipientEmail: email,
        senderName: user?.full_name || 'Someone',
        projectName,
        reportUrl,
        personalMessage: message || undefined
      }
    });
    
    if (error) throw error;
    
    toast.success('Email sent successfully!');
    // Reset e fechar dialog
  } catch (err) {
    toast.error('Failed to send email');
  } finally {
    setIsSending(false);
  }
};
```

## Design do Email

**Paleta de Cores (padrão UaiCode):**
- Background: `#0A0A0A`
- Card: `#141414`
- Border: `#2A2A2A`
- Gold accent: `#FACC15`
- Text primary: `#FFFFFF`
- Text secondary: `#B3B3B3`

**Estrutura Visual:**
1. **Header** (gradiente dourado): "🔗 SaaS Report Shared" + "PlanningMySaaS by UaiCode"
2. **Greeting**: "Hi there! [SenderName] shared a SaaS validation report with you."
3. **Personal Message Card** (se houver): Fundo `#1A1A1A` com aspas decorativas
4. **Report Preview Card**: Nome do projeto + link clicável + botão CTA
5. **What's Included**: Lista de features do relatório
6. **CTA Button**: "View Full Report" (gradiente dourado)
7. **Footer**: Links sociais + copyright UaiCode

## Arquivos a Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/pms-send-share-report/index.ts` | **Criar** | Nova edge function para enviar email |
| `src/components/planningmysaas/dashboard/ShareReportDialog.tsx` | **Modificar** | Conectar ao backend, adicionar toasts |

## Fluxo Completo

1. Usuário abre popup Share Report
2. Preenche email do destinatário
3. (Opcional) Adiciona mensagem personalizada
4. Clica "Send Email"
5. Frontend chama `pms-send-share-report`
6. Edge function valida dados
7. Gera HTML do email no padrão UaiCode
8. Envia via Resend API
9. Retorna sucesso/erro
10. Frontend mostra toast e fecha dialog

## Validações

**Frontend:**
- Email obrigatório e formato válido
- Mensagem opcional (máximo 500 caracteres, se necessário)

**Backend:**
- `recipientEmail`, `senderName`, `projectName`, `reportUrl` obrigatórios
- Validação de formato de email
- `RESEND_API_KEY` configurada (já existe no projeto)
