
# Plano: HTML Estático para Página Compartilhável (Dentro do Orchestrator)

## Resumo da Solução

Gerar um HTML estático completo do Business Plan **dentro do `pms-orchestrate-report`**, logo após o Step 12 (Business Plan) e antes de marcar como `completed`. O HTML será salvo na nova coluna `share_html` e usado para renderizar a página pública sem nenhuma dependência de React Context ou Hooks.

## Por que a Página Está Quebrando

O componente `InvestmentAskCard.tsx` (linha 35) chama:
```typescript
const { marketingTotals } = useReportContext();
```

Este hook só funciona dentro do `ReportProvider` que existe apenas no Dashboard autenticado. Na página pública (`/planningmysaas/shared/:token`), não há Provider, causando crash silencioso (tela preta).

## Arquitetura da Solução

```text
FLUXO ATUALIZADO (dentro do orchestrator)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  pms-orchestrate-report
     │
     ├─► Step 1-11: Gera seções do relatório
     │
     ├─► Step 12: Business Plan (completa)
     │
     ├─► [NOVO] Gera share_html:
     │       1. Busca dados JSONB do relatório
     │       2. Busca dados marketing (tb_pms_mkt_tier)
     │       3. Renderiza HTML via template
     │       4. Salva share_html + share_token
     │
     └─► Marca status = "completed"

VISUALIZAÇÃO PÚBLICA (simplificada)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

  /planningmysaas/shared/:token
     │
     └─► SELECT share_html WHERE share_token = :token
                  │
                  ▼
         dangerouslySetInnerHTML → Renderiza HTML

```

## Implementação Detalhada

### 1. Migração do Banco de Dados

Adicionar nova coluna para armazenar o HTML pré-renderizado:

```sql
ALTER TABLE public.tb_pms_reports 
ADD COLUMN share_html TEXT NULL;

COMMENT ON COLUMN public.tb_pms_reports.share_html IS 
  'Pre-rendered static HTML for public shared report view';
```

### 2. Modificar pms-orchestrate-report

Após a conclusão do Step 12 (linha ~145), adicionar:

```typescript
// === NOVA LÓGICA: Gerar share_html ===

// 1. Buscar dados do relatório
const { data: reportData } = await supabase
  .from("tb_pms_reports")
  .select(`
    business_plan_section,
    opportunity_section,
    competitive_analysis_section,
    icp_intelligence_section,
    price_intelligence_section,
    growth_intelligence_section,
    section_investment
  `)
  .eq("wizard_id", wizard_id)
  .single();

// 2. Buscar dados de marketing para calcular bundle
const { data: marketingData } = await supabase
  .from("tb_pms_mkt_tier")
  .select("service_name, uaicode_price_cents, traditional_max_cents")
  .eq("is_active", true);

// 3. Gerar HTML estático via função template
const shareHtml = generateBusinessPlanHtml(reportData, marketingData);

// 4. Salvar share_html junto com share_token
await supabase
  .from("tb_pms_reports")
  .update({ 
    status: "completed",
    share_token: shareToken,
    share_url: shareUrl,
    share_html: shareHtml,  // ← NOVO
    share_enabled: true,
    share_created_at: new Date().toISOString()
  })
  .eq("wizard_id", wizard_id);
```

### 3. Criar Função Template HTML (inline no orchestrator)

Criar função `generateBusinessPlanHtml()` que:
- Recebe os dados JSONB das 7 seções + dados marketing
- Renderiza as 9 seções do Business Plan como HTML estático
- Inclui CSS inline com cores do tema escuro
- Formata moeda/porcentagem estaticamente
- Não usa gráficos interativos (substituídos por grids/tabelas)

**Seções renderizadas:**
1. Executive Snapshot (grid 4x3 de métricas)
2. Executive Narrative (texto AI)
3. Market Analysis (TAM/SAM/SOM + trends)
4. Competitive Landscape (cards de competidores)
5. Target Customer (persona + pain points)
6. Business Model (pricing tiers)
7. Financial Projections (tabela de métricas)
8. Investment Ask (MVP + Bundle com valores calculados)
9. Strategic Verdict (veredicto + recomendações)

### 4. Calcular Marketing Bundle no Backend

Para o card "Investment Ask", preciso calcular os totais de marketing:

```typescript
// Calcular totais de marketing (todos os serviços ativos)
const marketingTotals = {
  uaicodeTotal: marketingData.reduce((sum, s) => sum + s.uaicode_price_cents, 0),
  traditionalMaxTotal: marketingData.reduce((sum, s) => sum + s.traditional_max_cents, 0),
};

// MVP + Marketing Bundle (anual)
const bundleTotalCents = (investment.investment_one_payment_cents || 0) 
  + (marketingTotals.uaicodeTotal * 12);
```

### 5. Simplificar useSharedReport.ts

Atualizar para buscar apenas `share_html`:

```typescript
export const useSharedReport = (shareToken: string | undefined) => {
  return useQuery({
    queryKey: ["shared-report", shareToken],
    queryFn: async (): Promise<string | null> => {
      if (!shareToken) return null;

      const { data, error } = await supabase
        .from("tb_pms_reports")
        .select("share_html")
        .eq("share_token", shareToken)
        .eq("share_enabled", true)
        .maybeSingle();

      if (error || !data?.share_html) return null;
      return data.share_html;
    },
    enabled: !!shareToken,
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
```

### 6. Simplificar PmsSharedReport.tsx

Reescrever para renderizar HTML diretamente:

```tsx
const PmsSharedReport = () => {
  const { shareToken } = useParams();
  const { data: html, isLoading, error } = useSharedReport(shareToken);

  if (isLoading) return <SharedReportSkeleton />;
  if (error || !html) return <SharedReportError />;

  return (
    <div className="min-h-screen bg-background">
      <SharedReportHeader />
      <main className="pt-24 pb-16">
        <div 
          className="shared-report-content max-w-4xl mx-auto px-4"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      </main>
      <SharedReportFooter />
    </div>
  );
};
```

### 7. Adicionar CSS Global para Shared Report

Adicionar estilos em `src/index.css`:

```css
/* Shared Report Static HTML Styles */
.shared-report-content .sr-card {
  background: hsl(var(--card));
  border: 1px solid hsl(var(--accent) / 0.2);
  border-radius: 0.75rem;
  padding: 1.5rem;
  margin-bottom: 1.5rem;
}
/* ... mais estilos */
```

### 8. Deletar Arquivos Não Utilizados

Remover:
- `src/components/planningmysaas/public/SharedReportContent.tsx`

---

## Arquivos a Criar/Modificar

| Arquivo | Ação | Descrição |
|---------|------|-----------|
| `supabase/functions/pms-orchestrate-report/index.ts` | **MODIFICAR** | Adicionar lógica de geração HTML após Step 12 |
| `src/hooks/useSharedReport.ts` | **MODIFICAR** | Simplificar para retornar apenas share_html |
| `src/pages/PmsSharedReport.tsx` | **MODIFICAR** | Usar dangerouslySetInnerHTML |
| `src/index.css` | **MODIFICAR** | Adicionar estilos para HTML estático |
| `src/components/planningmysaas/public/SharedReportContent.tsx` | **DELETAR** | Não mais necessário |
| **Migração SQL** | **CRIAR** | Adicionar coluna share_html |

---

## Benefícios

1. **Atomicidade** - Tudo gerado de uma vez, relatório só fica "completed" quando HTML está pronto
2. **Zero crashes** - Não depende de React Context/Hooks
3. **Carregamento instantâneo** - HTML pré-renderizado, sem JavaScript client-side
4. **Imutável** - Mostra exatamente o que foi gerado no momento
5. **SEO-friendly** - HTML semântico renderizado no servidor

---

## Considerações Técnicas

- **Tamanho estimado**: ~40-60KB de HTML
- **Tempo adicional**: <500ms (apenas template string)
- **Fallback**: Relatórios antigos terão `share_html = NULL` → mostrar erro amigável
- **Regeneração**: O botão "Regenerate Report" vai criar novo HTML automaticamente

---

## Ordem de Execução

1. Criar migração SQL (adicionar coluna `share_html`)
2. Modificar `pms-orchestrate-report` com função template
3. Atualizar `useSharedReport.ts`
4. Atualizar `PmsSharedReport.tsx`
5. Adicionar CSS global
6. Deletar `SharedReportContent.tsx`
7. Testar gerando novo relatório e acessando link compartilhável
