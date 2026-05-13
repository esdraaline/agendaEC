# STATUS.md — AgendaEC

Última atualização: 2026-05-13 (fim de sessão)

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

Status: validação em andamento (código concluído, testes mobile pendentes)

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
- [ ] Validar compartilhamento WhatsApp (SW corrigido, pendente reteste)

---

## Offline

- [x] Criar PendingMutation[]
- [x] Persistência local (localStorage + Zustand persist)
- [ ] Retry simples
- [ ] Reconexão automática
- [x] Cache básico

---

# Próximo passo concreto

Retomar amanhã (2026-05-14):

1. Aguardar reset do rate limit de email do Supabase (1h a partir de ~15h de 2026-05-13)
2. Fazer login no celular com novo magic link
3. Reinstalar PWA após último deploy (SW corrigido)
4. Testar share_target: WhatsApp → Compartilhar → AgendaEC → Inbox
5. Configurar SMTP próprio (Resend) para evitar rate limit futuro
6. Se tudo validado: encerrar Sprint 1 e iniciar Sprint 2 (Inbox + IA)

---

# Bloqueios atuais

- Rate limit de email Supabase (free tier: 2 emails/hora) — resolver configurando SMTP próprio via Resend

---

# Observações operacionais

- Não expandir escopo do MVP
- Não criar SaaS
- Não implementar multi-tenant complexo
- Não adicionar automações avançadas
- Não adicionar WhatsApp automático
- Priorizar previsibilidade e simplicidade
- Mobile first sempre

---

# Histórico de Sprints Concluídos

Nenhum sprint concluído formalmente ainda.

## Sprint 1 — progresso em 2026-05-13

Código 100% implementado. Pendente validação mobile final:
- Magic link funcionando ✅
- Login no celular ✅
- PWA instalado ✅
- share_target WhatsApp ⏳ (reteste após fix do SW)
- Offline básico ⏳

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
