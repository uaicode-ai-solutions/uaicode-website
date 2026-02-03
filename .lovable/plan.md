
# Correção: Largura do Footer na Página Pública

## Problema
O `SharedReportFooter` está renderizado **fora** do container `max-w-5xl mx-auto px-4`, resultando em largura total da tela ao invés de alinhar com o conteúdo.

## Estrutura Atual
```text
<main className="pt-24 pb-16">
  <div className="max-w-5xl mx-auto px-4">   ← Container limitado
    <BusinessPlanTab />                       ← Conteúdo alinhado
  </div>
</main>
<SharedReportFooter />                        ← FORA do container!
```

## Solução
Mover o `SharedReportFooter` para dentro do container existente, ou aplicar o mesmo `max-w-5xl mx-auto px-4` ao footer.

## Arquivo a Modificar

**`src/pages/PmsSharedReport.tsx`** (linhas 29-41)

```tsx
return (
  <div className="min-h-screen bg-background">
    <SharedReportHeader />
    
    <main className="pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 lg:px-6">
        <BusinessPlanTab />
        
        {/* Footer agora dentro do container */}
        <SharedReportFooter />
      </div>
    </main>
  </div>
);
```

## Resultado
O banner CTA e o footer terão a mesma largura máxima de 5xl (1024px) alinhados com o BusinessPlanTab.
