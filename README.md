# README.md — AgendaEC

1. Leia `STATUS.md` PRIMEIRO — diz onde o projeto parou  
2. Leia o protocolo no topo do `STATUS.md` — diz o que fazer nesta sessão  
3. Em sessão normal de desenvolvimento, leia também a seção do sprint atual em `SPRINT_LOG.md`  
4. Para o contrato completo de trabalho, consulte `AGENTS.md`  
5. Os demais documentos são consultados sob demanda  

## Por onde começar

| Arquivo | Função | Quando atualizar |
|---|---|---|
| `STATUS.md` | Marcador de página: sprint atual, progresso, próximo passo | Toda sessão |
| `DECISIONS.md` | Registro de decisões técnicas não-triviais | Quando decisão importante for tomada |

## Documentos vivos (atualizados a cada sessão ou decisão relevante)

| Arquivo | Função | Quando atualizar |
|---|---|---|
| `STATUS.md` | Estado atual: sprint, progresso, próximo passo | Toda sessão — obrigatório |
| `DECISIONS.md` | Registro de decisões técnicas e operacionais não-triviais | Sempre que uma decisão importante for tomada |

## Documentos de referência (estáticos)

Definem escopo, arquitetura e filosofia do projeto. Alterados apenas por decisão explícita registrada em `DECISIONS.md`.

| Arquivo | Função |
|---|---|
| `README.md` | Este arquivo: índice e protocolo resumido |
| `AGENTS.md` | Contrato de trabalho com IAs e colaboradores |
| `PRD.md` | Visão geral do produto e restrições (`AgendaEC_PRD_v1.1`) |
| `ARCHITECTURE.md` | Schema SQL, PWA config, RLS, triggers, índices, offline, WhatsApp |
| `PHILOSOPHY.md` | Princípios P1–P6 e critérios CDP1–CDP9 |
| `ROADMAP.md` | Entregas por sprint |
| `SPRINT_LOG.md` | Detalhamento operacional dos sprints |
| `ESTRUTURA_PROJETO.md` | Estrutura de arquivos e diretórios Next.js 14 |

Índice dos documentos

Início: ler `STATUS.md` + sprint atual em `SPRINT_LOG.md`  
Trabalhar  
Fim: marcar `[x]` no `STATUS.md`, atualizar próximo passo, commit  
Overhead: ~3 minutos por sessão  

## Modo 1 — Sessão normal (90% dos casos)

Ritual completo no `AGENTS.md`  
Tempo: 15–20 minutos  

## Modo 2 — Início de sprint (6 vezes no projeto)

Validação + consolidação de decisões  
Tempo: 20–30 minutos  

## Modo 3 — Encerramento de sprint (6 vezes no projeto)

Protocolo de trabalho resumido  

### Stack oficial

- **Frontend:** Next.js 14 App Router + TypeScript 5 + Tailwind CSS 3 + shadcn/ui
- **Estado:** Zustand 5 (com persist em `localStorage`)
- **Cache/Sync:** TanStack Query 5 (recomendado, não obrigatório no Sprint 1)
- **Backend:** Supabase (Supabase JS 2 + PostgreSQL + Auth + RLS + Edge Functions)
- **IA:** OpenAI GPT-4o mini (API REST via Edge Function proxy)
- **PWA:** Web Share Target API + Workbox (Service Worker)
- **WhatsApp:** `wa.me` deep links (oficiais, gratuitos)
- **Deploy:** Vercel (com `vercel.json` rewrite SPA)
- **Auth:** magic link (email OTP)
- **Monitoramento:** Sentry (opcional, free tier, pós-Sprint 3)

## Sprints do MVP

1. **Sprint 1 — Fundação:** scaffold Next.js 14, auth (magic link), banco completo (12 tabelas do PRD), PWA manifest com `share_target`, rota `/inbox/share`, captura offline básica, fila offline  
2. **Sprint 2 — Inbox + IA:** motor de IA (OpenAI), preview de interpretação, confirmação/ajuste, histórico do Inbox  
3. **Sprint 3 — Hoje + Vendas + Clientes:** tela Hoje com dados reais, CRUD de vendas, perfil de cliente, saldo devedor  
4. **Sprint 4 — WhatsApp + Cobranças:** `wa.me` links, templates editáveis, tela de cobranças, botão "Cobrar no WhatsApp"  
5. **Sprint 5 — Entregas + Tarefas + Agenda:** módulos de entregas, checklist de tarefas, compromissos, fechamento do dia  
6. **Sprint 6 — Uso Real:** estabilização, performance, uso diário contínuo, ajustes com a dona da loja  

## Princípios não-negociáveis

App pessoal e interno — nunca se tornar SaaS  
Sem sistema de cobrança/planos/assinaturas  
Sem multi-tenant complexo (só uma loja)  
Sem auto-cadastro de usuários (dona cadastra manualmente, máximo 5)  
IA invisível: organiza nos bastidores, sem interromper  
WhatsApp fluido: app e WA trabalham juntos  
Mobile first: feito para celular, sempre  
Zero burocracia: nenhum campo obrigatório na captura  
Soft delete via `deleted_at` (nunca `DELETE` físico em registros financeiros)  
RLS obrigatório em todas as tabelas  
`CHECK` constraints em campos numéricos e enums textuais  
App NUNCA envia mensagem WhatsApp automaticamente — sempre revisa e toca "Enviar"  
Sem testes automatizados no MVP (validação manual diária com a dona)  
ESLint default do Next.js, sem Prettier  

## Padrões operacionais

- `STATUS.md` e `DECISIONS.md` são vivos — atualize conforme o trabalho avança  
- `ARCHITECTURE.md`: quando schema SQL muda ou nova tabela é criada  
- Demais: praticamente nunca durante o MVP  

## Documentos estáticos só mudam em casos específicos

Em caso de conflito entre documentos, ordem de prevalência:

1. `STATUS.md` → autoridade sobre estado atual do projeto  
2. `DECISIONS.md` → autoridade sobre decisões que substituem padrões  
3. `ARCHITECTURE.md` → autoridade técnica sobre schemas e infraestrutura  
4. `PRD.md` → autoridade sobre escopo e funcionalidades  
5. Demais documentos estáticos  

## Como atualizar a documentação

- Datas: `YYYY-MM-DD` (ISO 8601)
- Commits: `feat:`, `fix:`, `chore:`, `docs:`
- Chaves de `localStorage`: prefixo `agendaec:`
- Vocabulário de operações: `'insert' | 'update' | 'delete'`
- Valores monetários: `DECIMAL(10,2)` no banco, exibição com `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`
- Telefones: armazenados com DDI (`+55...`) para links `wa.me`
