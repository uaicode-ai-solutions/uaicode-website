
# Alterar Telefone para Usar Eve Voice

## Alteração Necessária

Modificar o botão do telefone "+1 (737) 225 9254" no footer para abrir o `EveVoiceDialog` ao invés do `PhoneCallDialog`.

---

## Detalhe Técnico

### Footer.tsx (linha 212)

**Antes:**
```tsx
<button 
  onClick={() => setShowPhoneDialog(true)}
  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
>
  <Phone className="w-5 h-5" />
  +1 (737) 225 9254
</button>
```

**Depois:**
```tsx
<button 
  onClick={() => setShowVoiceDialog(true)}
  className="text-muted-foreground hover:text-accent transition-colors flex items-center gap-2"
>
  <Phone className="w-5 h-5" />
  +1 (737) 225 9254
</button>
```

---

## Arquivo Afetado

| Arquivo | Ação |
|---------|------|
| `src/components/Footer.tsx` | **EDITAR** - linha 212 |

---

## Resultado

Ao clicar no número de telefone, o usuário verá o dialog da Eve Voice (ElevenLabs) ao invés do PhoneCallDialog tradicional, mantendo consistência com a experiência de "Call Eve" no mesmo footer.
