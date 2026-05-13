# ESTRUTURA_PROJETO.md — AgendaEC

Última revisão: 2026-05-13  
Status: Estrutura oficial do MVP

---

# Objetivo

Definir a estrutura oficial de arquivos e diretórios do AgendaEC.

A organização do projeto deve priorizar:

- simplicidade
- previsibilidade
- baixo acoplamento
- crescimento incremental
- manutenção simples
- debugging rápido
- mobile first

---

# Estrutura do Sprint 1 (mínima funcional)

```text
agendaec/
│
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── hoje/
│   │   │   └── page.tsx
│   │   ├── inbox/
│   │   │   ├── page.tsx
│   │   │   └── share/
│   │   │       └── route.ts
│   │   └── configuracoes/
│   │       └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── features/
│   │   │   └── inbox/
│   │   │       └── InboxForm.tsx
│   │   └── shared/
│   │       ├── BottomNav.tsx
│   │       ├── FAB.tsx
│   │       └── Layout.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── offline/
│   │   └── whatsapp/
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── contextStore.ts
│   │   └── tasksStore.ts
│   │
│   ├── types/
│   │   └── index.ts
│   │
│   └── utils/
│
├── supabase/
│   ├── migrations/
│   └── policies/
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
└── vercel.json
```

---

# Estrutura completa do MVP (Sprint 3+)

```text
agendaec/
│
├── public/
│   ├── manifest.json
│   ├── icon-192.png
│   └── icon-512.png
│
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   │
│   │   ├── hoje/
│   │   │   └── page.tsx
│   │   │
│   │   ├── inbox/
│   │   │   ├── page.tsx
│   │   │   └── share/
│   │   │       └── route.ts
│   │   │
│   │   ├── central/
│   │   │   ├── vendas/
│   │   │   │   └── page.tsx
│   │   │   ├── entregas/
│   │   │   │   └── page.tsx
│   │   │   ├── tarefas/
│   │   │   │   └── page.tsx
│   │   │   ├── financeiro/
│   │   │   │   └── page.tsx
│   │   │   └── agenda/
│   │   │       └── page.tsx
│   │   │   (estoque/ → pós-MVP v1.5+, não criar no MVP)
│   │   │
│   │   ├── clientes/
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx
│   │   │
│   │   ├── fechamento/
│   │   │   └── page.tsx
│   │   │
│   │   └── configuracoes/
│   │       ├── page.tsx
│   │       ├── usuarios/
│   │       │   └── page.tsx
│   │       └── templates/
│   │           └── page.tsx
│   │
│   ├── components/
│   │   ├── ui/
│   │   ├── features/
│   │   │   ├── inbox/
│   │   │   ├── hoje/
│   │   │   ├── vendas/
│   │   │   ├── clientes/
│   │   │   ├── entregas/
│   │   │   ├── tarefas/
│   │   │   ├── agenda/
│   │   │   └── whatsapp/
│   │   │
│   │   └── shared/
│   │       ├── BottomNav.tsx
│   │       ├── FAB.tsx
│   │       ├── Layout.tsx
│   │       ├── Loading.tsx
│   │       └── EmptyState.tsx
│   │
│   ├── hooks/
│   │
│   ├── lib/
│   │   ├── supabase.ts
│   │   ├── ai/
│   │   │   ├── parseEntry.ts
│   │   │   ├── prompts.ts
│   │   │   └── validators.ts
│   │   │
│   │   ├── offline/
│   │   │   ├── queue.ts
│   │   │   ├── retry.ts
│   │   │   └── sync.ts
│   │   │
│   │   └── whatsapp/
│   │       ├── deeplink.ts
│   │       └── templates.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts
│   │   ├── contextStore.ts
│   │   ├── inboxStore.ts
│   │   ├── salesStore.ts
│   │   ├── clientsStore.ts
│   │   ├── tasksStore.ts
│   │   └── uiStore.ts
│   │
│   ├── types/
│   │   ├── database.ts
│   │   ├── inbox.ts
│   │   ├── sales.ts
│   │   ├── clients.ts
│   │   └── common.ts
│   │
│   └── utils/
│       ├── currency.ts
│       ├── dates.ts
│       ├── masks.ts
│       └── validators.ts
│
├── supabase/
│   ├── migrations/
│   ├── policies/
│   └── functions/
│       └── parse-inbox/
│
├── docs/
│   ├── README.md
│   ├── AGENTS.md
│   ├── ARCHITECTURE.md
│   ├── PHILOSOPHY.md
│   ├── ROADMAP.md
│   ├── SPRINT_LOG.md
│   ├── STATUS.md
│   ├── DECISIONS.md
│   └── PRD.md
│
├── .env
├── .env.example
├── .gitignore
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.ts
├── vercel.json
└── README.md
```

---

# Convenções de Organização

## app/

Responsável por:

- rotas App Router
- layouts
- páginas
- rotas de compartilhamento
- rotas server-side simples

---

## components/

Separação obrigatória:

- `ui/` → componentes visuais reutilizáveis
- `features/` → componentes específicos de domínio
- `shared/` → elementos compartilhados da aplicação

---

## lib/

Responsável por:

- integrações externas
- IA
- offline
- WhatsApp
- Supabase
- lógica desacoplada

Evitar:

- componentes React
- lógica visual
- dependências circulares

---

## stores/

Responsável por:

- estado global
- persistência local
- fila offline
- contexto operacional

Regras:

- stores pequenas
- responsabilidade clara
- sem lógica pesada
- persistência seletiva

---

## types/

Responsável por:

- tipos globais
- tipos do banco
- contratos da IA
- DTOs simples

---

## utils/

Responsável por:

- funções puras
- helpers reutilizáveis
- máscaras
- formatação
- validação simples

---

# Convenções de nomenclatura

## Arquivos React

- PascalCase

Exemplos:

- `InboxForm.tsx`
- `BottomNav.tsx`
- `ClientCard.tsx`

---

## Hooks

Prefixo obrigatório:

```text
useXxx
```

Exemplos:

- `useOfflineQueue.ts`
- `useClientSearch.ts`

---

## Stores

Sufixo obrigatório:

```text
Store.ts
```

Exemplos:

- `authStore.ts`
- `salesStore.ts`

---

## Rotas

- minúsculas
- sem espaços
- sem acentos

Exemplos:

- `/inbox`
- `/clientes`
- `/fechamento`

---

# Regras estruturais

## Não criar

- arquitetura em camadas complexa
- módulos enterprise
- abstrações excessivas
- pasta `services/` genérica gigante
- pasta `helpers/` caótica

---

## Priorizar

- clareza
- previsibilidade
- baixo acoplamento
- debugging rápido
- crescimento incremental

---

# Estrutura offline

## Persistência

- Zustand persist
- IndexedDB
- PendingMutation[]

---

## Estratégia

- retry simples
- sync ao reconectar
- Last Write Wins (LWW)

---

# Estrutura WhatsApp

## Compartilhamento

```text
/inbox/share
```

Recebe:

- texto compartilhado
- múltiplas linhas
- links
- mensagens encaminhadas

---

## Deep links

```text
lib/whatsapp/deeplink.ts
```

Responsável por:

- gerar links `wa.me`
- encode de mensagens
- padronização de telefone

---

# Estrutura IA

## Edge Function

```text
supabase/functions/parse-inbox/
```

Responsável por:

- receber texto
- montar contexto
- chamar OpenAI
- validar JSON
- retornar estrutura segura

---

## Cliente

```text
lib/ai/
```

Responsável por:

- prompts
- tipos
- validação
- parsing auxiliar

---

# Regra final

Toda estrutura deve favorecer:

- simplicidade
- previsibilidade
- manutenção rápida
- onboarding rápido
- uso operacional real
- mobile first
