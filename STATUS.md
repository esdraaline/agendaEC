# STATUS.md — AgendaEC

Última atualização: 2026-05-14

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

## Sprint 1 — Fundação

Status: concluída

---

# Checklist Atual

## Estrutura Inicial

- [x] Definição da stack oficial
- [x] Definição da arquitetura
- [x] Definição dos princípios operacionais
- [x] Definição dos sprints do MVP
- [x] Estrutura inicial de diretórios
- [x] Manifest PWA planejado
- [x] Estratégia offline definida
- [x] Estratégia WhatsApp definida

---

## Setup do Projeto

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

## Banco de Dados

- [x] Criar tabela stores (migration gerada)
- [x] Criar tabela store_users (migration gerada)
- [x] Criar tabela clients (migration gerada)
- [x] Criar tabela entries (migration gerada)
- [x] Criar tabela sales (migration gerada)
- [x] Criar tabela payments (migration gerada)
- [x] Criar tabela deliveries (migration gerada)
- [x] Criar tabela tasks (migration gerada)
- [x] Criar tabela appointments (migration gerada)
- [x] Criar tabela wa_messages (migration gerada)
- [x] Criar tabela wa_templates (migration gerada)
- [x] Criar tabela daily_closings (migration gerada)
- [x] Criar tabela audit_logs (migration gerada)
- [x] Aplicar migration no Supabase (aplicada manualmente)

---

## Segurança

- [x] Ativar RLS em todas as tabelas (na migration)
- [x] Criar policies baseadas em store_id (na migration)
- [x] Criar policy owner_access (stores_escrita)
- [x] Criar policy audit_access (audit_logs_leitura_owner)
- [x] Validar segregação de dados (RLS aplicado)

---

## PWA

- [x] Criar manifest.json
- [x] Configurar share_target
- [x] Criar rota /inbox/share
- [x] Validar instalação PWA (instalou corretamente no celular)
- [x] Decisão registrada: Web Share Target removido do MVP inicial

---

## Offline

- [x] Criar PendingMutation[]
- [x] Persistência local (localStorage + Zustand persist)
- [ ] Retry simples
- [ ] Reconexão automática
- [x] Cache básico

---

# Próximo passo concreto

Iniciar Sprint 2 — Inbox + IA

Objetivos imediatos:

1. Implementar Inbox textual manual
2. Persistência simples do Inbox
3. Parser determinístico inicial
4. Fluxo captura → inbox → tarefa
5. Refinar UX mobile

---

# Bloqueios atuais

Nenhum bloqueio crítico no momento.

---

# Observações operacionais

- Não expandir escopo do MVP
- Não criar SaaS
- Não implementar multi-tenant complexo
- Não adicionar automações avançadas
- Não adicionar WhatsApp automático
- Priorizar previsibilidade e simplicidade
- Mobile first sempre
- Web Share Target removido do MVP inicial
- Captura inicial será manual/textual
- Suporte a mídia e compartilhamento Android adiado para pós-MVP
- SMTP próprio (Resend) adiado para pós-MVP
- Rate limit do Supabase free tier permanece conhecido
- Limitação aceitável durante desenvolvimento inicial
- Revisar estratégia de email antes de onboarding real de usuários

---

# Histórico de Sprints Concluídos

## Sprint 1 — Fundação (concluída em 2026-05-14)

- Magic link funcionando ✅
- Login no celular ✅
- PWA instalado ✅
- Web Share Target removido do MVP inicial por complexidade operacional ✅
- Offline básico ⏳ (retry + reconexão automática — deixado para Sprint 2)

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
