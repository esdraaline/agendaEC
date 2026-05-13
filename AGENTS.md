# AGENTS.md — AgendaEC

## Objetivo deste arquivo

Definir:

- comportamento esperado
- limites técnicos
- prioridades do MVP
- regras de arquitetura
- restrições de escopo
- princípios de implementação

---

# Tom esperado

- direto
- profissional
- claro
- sem linguagem motivacional artificial
- sem antropomorfização exagerada
- foco operacional: "o que precisa ser feito hoje?"

---

# Filosofia Operacional

Prioridade máxima:

- segurança
- estabilidade
- bugs que comprometam uso diário da loja

## Exceção

Correções críticas podem ser aplicadas fora do sprint.

---

# Stack Oficial

## Frontend

- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui

## Backend

- Supabase (Supabase JS 2 + Edge Functions)

## Banco de dados

- PostgreSQL (gerenciado pelo Supabase)

## Estado global

- Zustand 5 (com persist em `localStorage` via `zustand/middleware/persist`)

## Cache e Sync (recomendado, não obrigatório no Sprint 1)

- TanStack Query 5 (cache de servidor, sync otimista, stale-while-revalidate)

## IA

- OpenAI GPT-4o mini (API REST, chamada via Supabase Edge Function)

## PWA / Offline

- Web Share Target API
- Workbox (Service Worker)
- IndexedDB (fila offline)

## WhatsApp

- `wa.me` deep links (oficiais, gratuitos)
- Web Share Target API (receber do WhatsApp)

## Deploy

- Vercel (com `vercel.json` rewrite SPA)

## Monitoramento (opcional, pós-Sprint 3)

- Sentry (free tier) para erros de runtime

---

# Autenticação

## Método oficial

- não copiar tokens manualmente para `localStorage` ou `sessionStorage`
- sessão gerenciada exclusivamente pelo Supabase Client
- `authStore` não é persistida
- novos usuários (funcionários) são cadastrados manualmente pela dona
- sem self-signup
- máximo 5 usuários

---

# NÃO implementar no MVP

- sistema de cobrança/planos/assinaturas
- multi-tenant complexo (múltiplas lojas)
- onboarding para clientes externos
- landing page
- dashboard de métricas para investidores
- área de suporte para clientes externos
- integrações com marketplaces
- relatórios para contador
- auto-cadastro de novos usuários
- WhatsApp Business API (fica para v2.5)
- envio automático de mensagens WhatsApp (sempre revisão humana)
- análise comportamental de clientes
- automações inteligentes
- busca semântica
- notificações push
- geofencing
- captura por voz
- recorrência de tarefas
- subtarefas
- anexos
- notas avançadas
- outbox avançada
- conflict resolution avançado
- CRDT
- tabelas `profiles` ou `user_settings` extras

---

# O QUE permanece igual ao PRD

- IA para interpretação do Inbox (core do MVP)
- integração WhatsApp (`share_target` + `wa.me`)
- módulos de vendas, clientes, entregas, tarefas, agenda e financeiro
- fechamento do dia
- templates de mensagem WhatsApp editáveis
- cadastro manual de funcionários (máximo 5 usuários)

---

# Restrições do MVP

## IA

- via OpenAI GPT-4o mini (barato e eficiente)
- desacoplado (provider pode ser trocado)
- sempre retornar JSON válido
- nunca inventar dados (`campos ausentes = null`)
- confidence score de `0` a `1`

## Thresholds de confiança

- `>= 0.80`: aplica automaticamente, preview passivo
- `0.50–0.79`: exibe campos editáveis, pede confirmação
- `< 0.50`: salva como "Observação Livre"

---

# Pipeline da IA

1. Texto vai para backend com contexto (data/hora, clientes cadastrados, produtos frequentes)
2. IA retorna JSON estruturado
3. Backend valida e complementa com dados do banco
4. Frontend exibe preview
5. Usuária confirma (1 toque) ou ajusta
6. Registro salvo

## NÃO utilizar

- NLP local complexo
- embeddings para parsing
- inferência probabilística no cliente
- LLM para gerar SQL diretamente

---

# WhatsApp

## Regras absolutas

- RN-WA06: O app NUNCA envia mensagens automaticamente para o WA. A dona sempre revisa e toca "Enviar" no próprio WhatsApp.
- RN-WA03: Telefone da cliente armazenado com DDI (`+55...`)
- RN-WA05: Toda mensagem enviada via WA é registrada no histórico da cliente
- RN-WA01: Texto recebido via share passa pelo mesmo pipeline de IA que entrada digitada

## Implementação

- `lib/whatsapp/deeplink.ts`: gera links `https://wa.me/{numero}?text={msg}`
- `lib/whatsapp/templates.ts`: textos com variáveis `{nome}`, `{valor}`, `{produto}`, `{data}`, `{saldo}`
- Templates editáveis em Configurações → Templates WhatsApp

---

# Offline e Sync

## Permitido no MVP

- offline básico
- persistência local via `zustand/middleware/persist`
- fila persistida de mutações (`PendingMutation[]`)
- cache simples
- retry simples
- sincronização ao reconectar
- Workbox para cache de assets

## NÃO implementar

- outbox sofisticada
- CRDT
- sync distribuído complexo
- rollback visual
- reversão temporal
- toast de conflito
- merge inteligente de campos

## Estratégia oficial

- Last Write Wins (LWW) em nível de registro inteiro

## Mitigação para deletes

- soft delete via `deleted_at`

## Vocabulário de operações

- `sync_log.operation`: `'insert' | 'update' | 'delete'`
- `PendingMutation.operation`: `'insert' | 'update' | 'delete'`

## Tipo PendingMutation

Estrutura formal da fila offline. Definida em `src/types/offline.ts`:

```ts
export type PendingMutation = {
  id: string;                              // crypto.randomUUID()
  table: string;                           // nome da tabela alvo (ex: 'sales')
  operation: 'insert' | 'update' | 'delete';
  payload: Record<string, unknown>;        // dados completos do registro
  created_at: string;                      // ISO 8601
  retries: number;                         // tentativas de sync realizadas
}
```

Campos ausentes ou parciais não são aceitos na fila — o payload deve ser completo no momento do enqueue.

## Responsabilidade das stores

| Store | Responsabilidade |
|---|---|
| `authStore` | sessão do usuário autenticado (não persistida) |
| `contextStore` | contexto operacional da sessão: data corrente, loja ativa (`store_id`), usuária logada resumida. Evita prop drilling entre módulos |
| `uiStore` | estado de UI global: modais abertos, toasts, loading states |
| `clientsStore` | cache local de clientes da loja ativa |
| `salesStore` | cache local de vendas recentes |
| `tasksStore` | cache local de tarefas da loja ativa |

> `contextStore` não duplica dados de `authStore`. Armazena apenas o que é necessário para exibição e filtragem operacional (ex: `storeId`, `storeName`, `currentDate`). Não é persistida.

---

# Segurança

## Obrigatório

- RLS por `auth.uid()` em todas as tabelas
- `CHECK` constraints em campos numéricos e enums textuais
- validação no cliente antes do insert
- sanitização de entrada
- logs mínimos
- segregação básica de dados

## PII

- evitar exposição desnecessária de dados de clientes
- mascarar quando necessário
- não expor tokens em logs
- evitar circulação desnecessária de sessão

---

# Organização de Código

## Prioridades

1. clareza
2. previsibilidade
3. simplicidade
4. baixo acoplamento
5. debugging rápido

## Evitar

- abstrações prematuras
- arquitetura excessiva
- sistemas genéricos demais
- acoplamento desnecessário
- padrões complexos sem necessidade operacional

---

# Estrutura Esperada

```text
src/
├── app/
│   ├── layout.tsx
│   ├── hoje/page.tsx
│   ├── inbox/
│   │   ├── page.tsx
│   │   └── share/route.ts
│   ├── central/
│   ├── clientes/[id]/page.tsx
│   ├── fechamento/
│   └── configuracoes/
│       ├── page.tsx
│       ├── usuarios/page.tsx
│       └── templates/page.tsx
├── components/
│   ├── ui/
│   ├── features/
│   │   ├── inbox/
│   │   ├── hoje/
│   │   ├── clientes/
│   │   └── whatsapp/
│   └── shared/
├── hooks/
├── lib/
│   ├── supabase.ts
│   ├── ai/
│   ├── offline/
│   └── whatsapp/
├── stores/
│   ├── authStore.ts
│   ├── contextStore.ts
│   ├── uiStore.ts
│   ├── clientsStore.ts
│   ├── salesStore.ts
│   └── tasksStore.ts
├── types/
└── utils/

supabase/
├── migrations/
└── policies/

Na raiz:
public/manifest.json
vercel.json
.env.example
tailwind.config.ts
next.config.js
```

---

# Documentos do projeto

## Documentos vivos

Atualizados durante o desenvolvimento, a cada sessão ou decisão relevante:

- STATUS.md — estado atual do projeto (atualizado ao encerrar toda sessão)
- DECISIONS.md — registro de decisões técnicas e operacionais

## Documentos de referência (estáticos)

Definem o escopo, arquitetura e filosofia do projeto. Alterados apenas por decisão explícita registrada em DECISIONS.md:

- README.md
- AGENTS.md
- PRD.md
- ARCHITECTURE.md
- PHILOSOPHY.md
- ROADMAP.md
- SPRINT_LOG.md
- ESTRUTURA_PROJETO.md

---

# Ordem de prevalência

1. STATUS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. demais documentos estáticos

A ordem NÃO pode ser alterada sem decisão explícita em `DECISIONS.md`.

---

# Padronizações operacionais

## Datas

`YYYY-MM-DD` (ISO 8601)

## Commits

- `feat:`
- `fix:`
- `chore:`
- `docs:`

## localStorage

Prefixo obrigatório: `agendaec:`

## Valores monetários

- banco: `DECIMAL(10,2)`
- exibição: `Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })`

## Telefones

- armazenados com DDI: `+5511999999999`
- links wa.me: `https://wa.me/${numeroLimpo}?text=${encodeURIComponent(msg)}`

---

# Nunca

- adicionar sistema de cobrança/planos
- criar multi-tenant complexo
- adicionar onboarding para clientes externos
- criar landing page ou métricas SaaS
- adicionar auto-cadastro de usuários
- enviar mensagem WhatsApp automaticamente sem revisão humana
- adicionar infraestrutura não planejada
- expandir escopo sem solicitação explícita da dona
- introduzir abstrações prematuras
- adicionar dependências desnecessárias
- criar tabelas não definidas em `ARCHITECTURE.md`
- alterar schemas SQL sem atualizar `ARCHITECTURE.md`
- encerrar a sessão sem atualizar `STATUS.md`
- copiar tokens de autenticação para `localStorage` ou `sessionStorage`
- usar `DELETE` físico em registros financeiros
- gerar UUID no banco para inserts de tarefas/vendas
- alterar a ordem de precedência documental sem registrar em `DECISIONS.md`

---

# Critério Geral de Aceitação

Uma feature só é aceita se:

- funcionar localmente
- possuir comportamento previsível
- for simples de manter
- não aumentar drasticamente complexidade
- possuir debugging simples
- respeitar o escopo do sprint atual
- não violar as restrições acima

---

# Backlog Pós-MVP (v1.5+)

- módulo de estoque
- tarefas recorrentes
- relatórios para contador
- exportação PDF
- Google Calendar
- Mercado Pago / Pix confirmação automática
- WhatsApp Business API (número dedicado)
- notificações push
- análise comportamental de clientes
- automações avançadas
- testes automatizados (Vitest + Testing Library)
- migração de persistência local para IndexedDB
