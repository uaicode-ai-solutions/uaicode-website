

## Separar titulo e subtitulo no FounderCard

Quebrar a linha unica em dois elementos para um visual mais elegante.

### Alteracao

**Arquivo:** `src/components/blog/FounderCard.tsx` (linha 18)

- De:
  ```html
  <p class="text-lg text-accent font-bold mb-6">Founder & CEO at Uaicode.ai | Ex-Microsoft AI Solutions Architect</p>
  ```

- Para:
  ```html
  <p class="text-lg text-accent font-bold mb-1">Founder & CEO at Uaicode.ai</p>
  <p class="text-sm text-muted-foreground mb-6">Ex-Microsoft AI Solutions Architect</p>
  ```

O titulo principal fica em destaque com a cor accent e o subtitulo aparece menor e mais discreto logo abaixo.

