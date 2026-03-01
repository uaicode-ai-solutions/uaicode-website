

## Reduzir descrições das features na tb_pms_mvp_features

### Problema
As `feature_description` atuais têm 1.200-2.000 caracteres cada (28 features = ~44.000 chars / ~11.000 tokens). Quando enviadas ao Anthropic no n8n, excedem o rate limit de 30k input tokens/min.

### Solução
Encurtar cada `feature_description` para 1-2 frases (~150-200 chars), mantendo apenas o essencial para a IA entender o que a feature faz e quando incluí-la.

### Novas descrições propostas

| feature_id | Nova descrição (~150-200 chars) |
|---|---|
| auth | User registration, login, password reset, and session management with JWT tokens. Essential for any SaaS requiring user accounts. |
| profiles | User profile pages with editable fields (name, email, avatar), account settings, and notification preferences. |
| crud | Create, Read, Update, Delete operations for core entities with forms, list views, pagination, and validation. |
| reporting | Basic analytics dashboard with KPI cards, simple charts, and usage metrics overview. |
| notifications | Automated transactional emails for key events: welcome, password reset, status changes, and alerts. |
| admin | Admin panel for user management, content moderation, and system configuration. Protected area for operators. |
| responsive | Fully responsive design adapting to mobile, tablet, and desktop with touch-friendly interactions. |
| security | HTTPS, input validation, CSRF protection, rate limiting, and data encryption. Essential security baseline. |
| payments | Payment processing with Stripe/similar, subscription billing, invoicing, and webhook handling. |
| emailMarketing | Email marketing integration for campaigns, subscriber management, and audience segmentation. |
| roles | Role-based access control (RBAC) with predefined roles, permission levels, and access restrictions. |
| search | Full-text search with filters, sorting, autocomplete, and paginated results across entities. |
| fileUpload | File upload, storage, and management with drag-and-drop, preview, and organized file library. |
| realtime | Live data sync via WebSockets pushing updates to clients without page refresh. |
| workflows | Configurable multi-step workflows with status transitions, approval chains, and automated triggers. |
| advancedReporting | Custom report builder with scheduled delivery, multiple export formats, and drill-down analysis. |
| advancedAnalytics | Interactive analytics with custom date ranges, multiple chart types, drill-down, and data export. |
| apiIntegrations | Pre-built connectors for third-party services (CRMs, ERPs, marketing tools) with OAuth and webhooks. |
| support | Enterprise support with ticketing system, SLA management, knowledge base, and live chat. |
| ai | AI/ML capabilities: content generation, smart recommendations, NLP, predictive analytics. |
| dataAnalytics | Big data processing, statistical analysis, predictive modeling, and data pipeline management. |
| multiTenant | Multi-tenant architecture with data isolation, per-tenant config, and organization management. |
| sso | SSO with SAML 2.0/OIDC, audit logging, compliance features, and enterprise security controls. |
| customIntegrations | Custom integration layer for proprietary/legacy systems with ETL pipelines and protocol adapters. |
| apiManagement | API gateway with rate limiting, versioning, documentation, API keys, and usage analytics. |
| collaboration | Real-time co-editing, presence indicators, commenting, and shared workspaces for team collaboration. |
| automation | Advanced automation engine with complex rules, multi-condition triggers, and scheduled tasks. |
| customReporting | User-facing drag-and-drop report builder with custom metrics, formulas, and sharing capabilities. |

### Execução
Um único UPDATE por feature_id usando a ferramenta de insert/data do Supabase (não migration, pois é alteração de dados, não de schema).

### Resultado esperado
- Total de ~5.000 chars (~1.200 tokens) vs ~44.000 chars (~11.000 tokens) atual
- Redução de ~88% no tamanho do payload
- Compatível com o rate limit de 30k tokens/min do Anthropic
- IA ainda terá contexto suficiente para selecionar features corretamente

