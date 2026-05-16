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

## Sprint 2 — Inbox + IA (Parser Determinístico)

Status: concluída

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

## Banco de Dados & Infra

- [x] Tabelas base migradas e RLS ativo
- [ ] Sincronização Supabase (Fila Offline → Banco Remoto) — *Adiado para próximas etapas*
- [ ] Retry offline e reconexão automática — *Adiado para próximas etapas*

---

# Próximo passo concreto

Iniciar Sprint 3 — Hoje + Vendas + Clientes

Objetivos imediatos:

1. Implementar a sincronização da fila offline local com o Supabase (para Tasks e Entries).
2. Criar a tela "Hoje" consolidando o faturamento do dia e tarefas pendentes.
3. Iniciar o CRUD e persistência remota do módulo de Vendas (Sales).
4. Preparar o perfil básico do Cliente (Clients) integrado à captura de dados.

---

# Bloqueios atuais

Nenhum bloqueio crítico no momento.

---

# Observações operacionais

- IA probabilística e NLP foram temporariamente descartados em favor de um parser puramente determinístico para garantir previsibilidade e facilidade de depuração nesta fase do MVP.
- O parser atual funciona 100% offline e de forma instantânea (síncrona).
- A UX mobile-first provou-se altamente eficaz; manter a regra de "simplicidade > abstração" para o restante do projeto.
- Não expandir escopo do MVP nem criar SaaS.
- Priorizar previsibilidade e simplicidade sempre.

---

# Histórico de Sprints Concluídos

## Sprint 1 — Fundação (concluída em 2026-05-14)
- Magic link, PWA, e banco base funcionando ✅

## Sprint 2 — Inbox + Parser (concluída em 2026-05-16)
- Captura de texto ágil e local ✅
- Transformação determinística textual → Tarefa ✅
- Persistência offline-first robusta (Zustand) ✅
- UX refinada para mobile (contadores, empty states) ✅

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
