# SPRINT_LOG.md — AgendaEC

Última revisão: 2026-05-13  
Status: alinhado ao ROADMAP oficial

---

# Objetivo do Documento

Definir:

- objetivos por sprint
- entregas concretas
- critérios de conclusão
- limites de escopo
- direção operacional do desenvolvimento

---

# Sprint 1 — Fundação

## Objetivo

Construir a base técnica do AgendaEC.

---

## Entregas concretas

- Scaffold Next.js 14
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui
- Supabase configurado
- `.env.example`
- `vercel.json`
- `manifest.json` com `share_target`
- autenticação via email e senha
- Zustand 5
- persistência local
- fila offline `PendingMutation[]`
- UUID via `crypto.randomUUID()`
- layout base
- captura offline simples
- estrutura base de rotas
- rota `/inbox/share`

---

## Schema aplicado

- stores
- store_users
- clients
- entries
- sales
- payments
- deliveries
- tasks
- appointments
- wa_messages
- wa_templates
- daily_closings
- audit_logs

---

## Triggers previstos

- `update_updated_at_column()`
- clients
- sales
- deliveries
- wa_templates
- appointments

---

## RLS

- todas as tabelas com RLS ativo
- acesso por `store_id`
- `owner_id` em stores
- `audit_logs` protegidos

---

## Arquivos previstos

- `src/app/layout.tsx`
- `src/app/page.tsx`
- `src/app/hoje/page.tsx`
- `src/app/inbox/page.tsx`
- `src/app/inbox/share/route.ts`
- `src/lib/supabase.ts`
- `src/stores/authStore.ts`
- `src/stores/contextStore.ts`
- `src/stores/tasksStore.ts`
- `BottomNav.tsx`
- `FAB.tsx`
- `Layout.tsx`
- `public/manifest.json`
- `vercel.json`
- `next.config.js`
- `tailwind.config.ts`

---

## Fora do escopo

- motor de IA
- Tela Hoje real
- WhatsApp `wa.me`
- agenda completa
- fechamento do dia

---

## Critérios de conclusão

- app inicia corretamente
- login funciona
- banco conectado
- PWA instalável
- `share_target` funcionando
- persistência local funcional
- `PendingMutation` operacional
- `vercel.json` funcionando

---

# Sprint 2 — Inbox + IA

## Objetivo

Implementar o Inbox inteligente.

---

## Entregas concretas

- InboxForm
- campo de texto livre
- OpenAI GPT-4o mini
- Edge Function
- prompt do sistema
- pipeline IA
- preview editável
- confirmação
- ajuste manual
- fallback Observação Livre
- histórico do Inbox
- sugestão de clientes
- atalhos rápidos
- detecção de paste
- processamento do share target

---

## Fora do escopo

- entrada por áudio
- IA contextual avançada
- sugestões proativas

---

## Critérios de conclusão

Entrada:

> "Renata 6 tintas quinta 150 entrada"

Resultado:

- cliente reconhecida
- valor reconhecido
- produto reconhecido
- entrega reconhecida
- saldo calculado

Além disso:

- preview funcionando
- confirmação salva registros
- confidence aplicada corretamente
- offline funcionando

---

# Sprint 3 — Hoje + Vendas + Clientes

## Objetivo

Construir o núcleo operacional diário.

---

## Tela Hoje

- faturamento do dia
- entregas do dia
- clientes agendados
- cobranças pendentes
- tarefas
- resumo financeiro

---

## Módulo de Vendas

- criação via Inbox
- filtros
- status
- pagamento parcial
- botão WhatsApp

---

## Módulo de Clientes

- perfil da cliente
- saldo devedor
- histórico
- tags
- busca tolerante
- botão WhatsApp

---

## Fora do escopo

- estoque
- relatórios contábeis

---

## Critérios de conclusão

- tela Hoje operacional
- entregas funcionando
- perfil completo
- saldo correto
- busca rápida

---

# Sprint 4 — WhatsApp + Cobranças

## Objetivo

Integrar profundamente com o WhatsApp.

---

## Entregas concretas

- geração de links `wa.me`
- botão Cobrar WA
- templates editáveis
- tela de cobranças
- fluxo rápido para cobrança
- histórico de mensagens
- testes reais no celular

---

## Templates previstos

O texto canônico de cada template está definido em **DEC-015** (`DECISIONS.md`). Em caso de conflito, DEC-015 prevalece sobre qualquer versão anterior presente neste documento.

Templates previstos para o Sprint 4:

- **Cobrança de saldo devedor** — variáveis: `{nome}`, `{saldo}`
- **Confirmação de pedido** — variáveis: `{nome}`, `{produto}`, `{data}`
- **Lembrete de entrega** — variáveis: `{nome}`, `{produto}`, `{data}`

Consulte DEC-015 para o texto completo de cada template antes de popular a tabela `wa_templates` ou o arquivo `lib/whatsapp/templates.ts`.

---

## Fora do escopo

- WhatsApp Business API
- automação de envio
- chatbot

---

## Critérios de conclusão

- WA abre corretamente
- mensagens formatadas corretamente
- fluxo rápido
- cobrança operacional

---

# Sprint 5 — Entregas + Tarefas + Agenda

## Objetivo

Completar o fluxo operacional da loja.

---

## Entregas

- lista do dia
- status
- confirmação manual
- visualização rápida

---

## Tarefas

- checklist
- prioridade
- conclusão rápida
- visão diária

---

## Agenda

- compromissos
- clientes agendados
- visão simples do dia

---

## Fechamento do dia

- total vendido
- total recebido
- pendências
- resumo rápido

---

## Fora do escopo

- recorrência complexa
- agenda avançada
- sincronização externa

---

## Critérios de conclusão

- operação diária possível apenas pelo app
- tarefas organizadas
- entregas controladas
- fechamento rápido

---

# Sprint 6 — Uso Real

## Objetivo

Refinar o AgendaEC em uso real diário.

---

## Foco principal

- estabilidade
- performance
- UX
- previsibilidade
- correção de bugs
- refinamento operacional

---

## Ajustes previstos

- refinamento de fluxos
- melhoria do parser IA
- melhoria da navegação
- redução de cliques
- melhoria mobile
- simplificações operacionais

---

## Fora do escopo

- expansão arquitetural grande
- funcionalidades enterprise
- reescritas estruturais

---

## Critérios de conclusão

- uso diário estável
- sem bugs críticos
- experiência rápida no celular
- previsibilidade operacional

---

# Regras Operacionais

Durante qualquer sprint:

- não expandir escopo sem necessidade real
- não adicionar complexidade excessiva
- priorizar mobile
- priorizar estabilidade
- priorizar velocidade operacional
- manter debugging simples

---

# Regra final

Antes de iniciar qualquer implementação:

Perguntar:

1. resolve dor real da loja?
2. respeita o escopo atual?
3. mantém simplicidade?
4. funciona bem no celular?
5. adiciona complexidade desnecessária?
6. é simples de debugar?

Se a resposta for negativa, reavaliar a implementação.
