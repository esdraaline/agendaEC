# STATUS.md — AgendaEC

Última atualização: 2026-05-16

---

# Objetivo

Servir como marcador oficial do estado atual do projeto.

Este documento deve responder rapidamente:

- em qual sprint o projeto está
- o que já foi concluído
- o que falta
- qual o próximo passo concreto
- quais bloqueios existem

---

# Sprint Atual

## Sprint 4 — Hoje + Vendas + Clientes

Status: em planejamento

---

# Checklist Atual

## Estrutura Inicial (Sprint 1)

- [x] Definição da stack oficial
- [x] Definição da arquitetura
- [x] Definição dos princípios operacionais
- [x] Definição dos sprints do MVP
- [x] Estrutura inicial de diretórios
- [x] Manifest PWA planejado
- [x] Estratégia offline definida
- [x] Estratégia WhatsApp definida

---

## Setup do Projeto (Sprint 1)

- [x] Scaffold Next.js 14
- [x] Configuração TypeScript
- [x] Configuração Tailwind CSS
- [x] Instalação shadcn/ui
- [x] Configuração Supabase (projeto criado + .env preenchido)
- [x] Configuração Zustand
- [x] Configuração TanStack Query (instalado)
- [x] Configuração Service Worker (SW puro, sem Workbox)
- [x] Configuração vercel.json
- [x] Configuração manifest.json

---

## Inbox + Parser (Sprint 2)

- [x] Criar store Zustand persistida para Inbox (`inboxStore.ts`)
- [x] Criar store Zustand persistida para Tarefas (`tasksStore.ts`)
- [x] Versionamento e preparação offline segura para stores
- [x] Criar tipos de domínio (`InboxEntry`, `Task`)
- [x] Interface mobile-first para captura textual (`InboxInput`)
- [x] Interface para gerenciamento da fila e tarefas (`InboxList`, `TaskList`)
- [x] Implementar parser determinístico limpo e isolado (`src/lib/ai/`)
- [x] Suporte robusto a extração de datas (hoje, amanhã, dias da semana, DD/MM)
- [x] Suporte robusto a níveis de prioridade
- [x] Normalização inteligente (remoção de acentos e espaços extras)
- [x] Fluxo de conversão (Captura → Processamento → Tarefa)
- [x] Proteção de autenticação na rota `/inbox` restabelecida

---

## Offline Sync (Sprint 3)

- [x] Criar store de fila de mutações (`queueStore.ts`)
- [x] Implementar motor de sincronização sequencial (`syncEngine.ts`)
- [x] Integrar rastreamento de mutações no `tasksStore`
- [x] Interface manual de sincronização em Configurações
- [x] Garantir persistência offline da fila de sincronização
- [x] Suporte a Create, Update e Delete de Tarefas via Sync

---

## Banco de Dados & Infra

- [x] Tabelas base migradas e RLS ativo
- [x] Sincronização Supabase (Fila Offline → Banco Remoto)
- [ ] Retry offline e reconexão automática — *Adiado para próximas etapas*

---

# Próximo passo concreto

Iniciar Sprint 4 — Hoje + Vendas + Clientes

Objetivos imediatos:

1. Criar a tela "Hoje" consolidando o faturamento do dia e tarefas pendentes.
2. Iniciar o CRUD e persistência remota do módulo de Vendas (Sales).
3. Preparar o perfil básico do Cliente (Clients) integrado à captura de dados.

---

# Bloqueios atuais

Nenhum bloqueio crítico no momento.

---

# Observações operacionais

- O sistema de sincronização offline-first é manual e sequencial por design, priorizando a integridade dos dados e a simplicidade operacional.
- O parser determinístico continua sendo a peça central da captura rápida de dados.
- A arquitetura desacoplada do `syncEngine` permite expansão futura para outros domínios (vendas, clientes) com baixo esforço.

---

# Histórico de Sprints Concluídos

## Sprint 1 — Fundação (concluída em 2026-05-14)
- Magic link, PWA, e banco base funcionando ✅

## Sprint 2 — Inbox + Parser (concluída em 2026-05-16)
- Captura de texto ágil e local ✅
- Transformação determinística textual → Tarefa ✅

## Sprint 3 — Offline-First Sync (concluída em 2026-05-16)
- Sincronização manual e sequencial com Supabase ✅
- Fila de mutações persistente e segura ✅
- Gerenciamento de estado de sincronização na UI ✅

---

# Regras de Atualização

Atualizar este arquivo:

- no início de cada sessão
- no fim de cada sessão
- ao concluir tarefas importantes
- ao mudar de sprint

---

# Ordem de precedência documental

1. STATUS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. demais documentos

---

# Critério de saúde do projeto

O projeto está saudável quando:

- build funciona
- fluxo principal funciona
- PWA instala corretamente
- sincronização funciona
- offline não perde dados
- arquitetura continua simples
- debugging permanece previsível

---

# Regra final

Antes de iniciar qualquer implementação:

Perguntar:

1. resolve problema real da loja?
2. respeita o escopo do sprint?
3. mantém simplicidade?
4. funciona bem no celular?
5. adiciona complexidade desnecessária?
6. continua fácil de debugar?

Se a resposta violar os princípios acima, reavaliar a implementação.
