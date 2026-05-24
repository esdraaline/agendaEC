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

## Sprint 6 — Agenda, Entregas e Fechamento

Status: concluída em 2026-05-23

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

## Hoje + Vendas + Clientes (Sprint 4)

- [x] Criar store Zustand persistida para Vendas (`salesStore.ts`)
- [x] Criar store Zustand persistida para Clientes (`clientsStore.ts`)
- [x] Implementar tela "Hoje" consolidada (Faturamento + Tarefas)
- [x] Integrar captura de Vendas no Inbox (Parser de valores)
- [x] Implementar listagem e busca de Clientes
- [x] Implementar criação rápida de Vendas e Clientes
- [x] Garantir sincronização offline-first para Vendas e Clientes
- [x] Hardening do parser monetário com contexto explícito

---

## Banco de Dados & Infra

- [x] Tabelas base migradas e RLS ativo
- [x] Sincronização Supabase (Fila Offline → Banco Remoto)
- [ ] Retry offline e reconexão automática — *Adiado para próximas etapas*

---

# Próximo passo concreto

Definir e iniciar Sprint 8

Objetivos imediatos:

1. Iniciar o desenvolvimento do módulo de **Relatórios** (exportação para contador, PDF, ou visão mensal).

---

# Bloqueios atuais

Nenhum bloqueio crítico no momento.

---

# Observações operacionais

- A integração de Vendas no Inbox utiliza detecção determinística de valores monetários.
- A tela Hoje prioriza a visibilidade imediata do faturamento e recebimentos do dia.
- O domínio de Clientes foi mantido mínimo (sem tags) para focar na operação de saldo e contato.

---

# Histórico de Sprints Concluídos

## Sprint 1 — Fundação (concluída em 2026-05-14)
- Magic link, PWA, e banco base funcionando ✅

## Sprint 2 — Inbox + Parser (concluída em 2026-05-16)
- Captura de texto ágil e local ✅
- Transformação determinística textual → Tarefa ✅

## Sprint 3 — Offline-First Sync (concluída em 2026-05-16)
- Sincronização manual e sequencial com Supabase ✅

## Sprint 4 — Hoje + Vendas + Clientes (concluída em 2026-05-16)
- Resumo diário consolidado ✅
- Módulos de Vendas e Clientes operacionais ✅
- Captura inteligente de vendas via Inbox ✅

## Sprint 5 — WhatsApp + Cobranças (concluída em 2026-05-23)
- Templates de WhatsApp operacionais ✅
- Tela de Cobranças pendentes implementada ✅
- Botão "Cobrar" integrado no módulo de clientes ✅

## Sprint 6 — Agenda, Entregas e Fechamento (concluída em 2026-05-23)
- Central de Entregas e Compromissos ✅
- Tela de Fechamento de Caixa Diário ✅
- Fluxo de trabalho operacional completo estabelecido ✅

## Sprint 7 — Módulo de Estoque (concluída em 2026-05-23)
- Controle e gerenciamento de produtos ✅
- Alertas de estoque baixo ✅
- Integração da Central de Estoque na tela Hoje ✅

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
