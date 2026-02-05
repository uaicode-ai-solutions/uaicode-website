

# Atualização de Dados de Contato - Uaicode

## Resumo
Atualizar os dados de localização e contato da Uaicode para refletir a nova sede em Austin, Texas.

---

## Alterações

### 1. About.tsx - Seção "Why Choose Uaicode?"

**Arquivo:** `src/components/About.tsx`  
**Linha:** 21

| Campo | Valor Atual | Novo Valor |
|-------|-------------|------------|
| Localização | "based in Orlando, FL" | "based in Austin, TX" |

---

### 2. Footer.tsx - Rodapé

**Arquivo:** `src/components/Footer.tsx`

| Campo | Linha | Valor Atual | Novo Valor |
|-------|-------|-------------|------------|
| Endereço | 180 | "6751 Forum Drive, Suite 240, Orlando, FL 32821" | "5900 Balcones Drive, Ste 100, Austin, Texas, 78731" |
| Telefone | 220 | "+1 (321) 529 1451" | "+1 (737) 225 9254" |

---

## Detalhes Técnicos

### About.tsx
```text
Linha 21 (antes):
Uaicode is an AI-powered MVP development partner based in Orlando, FL, serving entrepreneurs globally.

Linha 21 (depois):
Uaicode is an AI-powered MVP development partner based in Austin, TX, serving entrepreneurs globally.
```

### Footer.tsx
```text
Linha 180 (antes):
<p>6751 Forum Drive, Suite 240<br />Orlando, FL 32821</p>

Linha 180 (depois):
<p>5900 Balcones Drive, Ste 100<br />Austin, Texas, 78731</p>

Linha 220 (antes):
+1 (321) 529 1451

Linha 220 (depois):
+1 (737) 225 9254
```

---

## Impacto
- Nenhuma alteração funcional
- Apenas atualização de texto estático
- Consistência com os dados já atualizados no PmsFooter.tsx e no prompt da Eve

