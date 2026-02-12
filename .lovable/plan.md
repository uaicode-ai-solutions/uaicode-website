
# Mover Schedule e Remover Forms Duplicados

## Mudancas

### 1. `src/pages/Index.tsx` -- Mover Schedule para depois da Eve
- Mover `<Schedule />` de depois de `<MeetTheFounder />` para depois de `<MeetEve />`
- Ordem final: `...MeetEve > Schedule > ContactUs > MeetTheFounder...`

### 2. `src/components/Schedule.tsx` -- Remover grid de forms
- Remover todo o bloco do grid com os dois cards "Get in Touch" e "Share Your Validated Idea" (linhas 211-411)
- Remover imports nao utilizados apos a remocao: `Link`, `useForm`, `zodResolver`, `z`, `Button`, `Input`, `Textarea`, `Label`, `PhoneInput`, `Mail`, `Phone`, `MapPin`, `sanitizeFormData`, `supabase`, `PhoneCallDialog`, `EmailContactDialog`
- Remover o schema `scheduleFormSchema`, type `ScheduleFormData`, interface `BookingDetails`
- Remover states e logica do form (`useForm`, `onSubmit`, `showPhoneDialog`, `showEmailDialog`, etc.)
- Manter apenas: o header com titulo/subtitulo, o embed Cal.com com o link fallback, e o `BookingConfirmationDialog`

### Resultado
A section Schedule fica limpa, contendo apenas o calendario Cal.com, posicionada logo apos a Eve. Os forms de contato continuam funcionando na section "Ready to Build Something Great?" (ContactUs).
