# PRD.md — AgendaEC

Versão: 1.1.0  
Status: Draft — Revisado para MVP  
Última revisão: 2026-05-13

---

# Objetivo do Produto

AgendaEC é um assistente operacional pessoal para loja de cosméticos.

O sistema substitui grupos de WhatsApp como ferramenta principal de controle operacional diário, mantendo a velocidade da captura livre, mas adicionando:

- organização
- histórico
- estrutura
- integração com WhatsApp
- inteligência operacional

---

# Escopo do Produto

## O que o AgendaEC é

- aplicativo pessoal/interno
- ferramenta operacional da loja
- organizador inteligente de rotina
- sistema mobile first
- app focado em velocidade operacional

---

## O que o AgendaEC NÃO é

- ERP corporativo
- SaaS para terceiros
- plataforma multi-tenant complexa
- sistema enterprise
- produto com planos/assinaturas

---

# Público-Alvo

## Usuária principal

Dona da loja.

Necessidades principais:

- registrar rapidamente operações
- controlar cobranças
- acompanhar entregas
- visualizar tarefas do dia
- integrar com WhatsApp
- reduzir perda de informações

---

## Usuárias secundárias

Funcionárias da loja.

Limites:

- acesso operacional
- sem visão financeira completa
- sem acesso administrativo avançado

---

# Filosofia do Produto

## Mobile first

Todas as decisões priorizam celular.

---

## Texto livre

A usuária escreve como pensa.

---

## IA invisível

IA organiza sem interromper fluxo.

---

## Zero burocracia

Nenhum formulário complexo para captura.

---

## Simples de verdade

Menos complexidade.
Mais previsibilidade.

---

# Problemas Resolvidos

## Situação atual

Hoje a operação ocorre em grupos de WhatsApp.

Problemas:

- cobranças esquecidas
- entregas perdidas
- histórico difícil
- fechamento manual
- baixa organização
- excesso de mensagens misturadas

---

## Situação desejada

A operação continua rápida como WhatsApp, porém estruturada.

---

# Fluxo Principal

## Entrada manual

Usuária digita:

```text
Renata 6 tintas quinta 150 entrada
```

Sistema interpreta:

- cliente
- produto
- valor
- entrega
- saldo

---

## Entrada via WhatsApp

Fluxo:

1. mensagem recebida no WhatsApp
2. compartilhar para AgendaEC
3. Inbox abre preenchido
4. IA interpreta
5. usuária confirma
6. registro salvo

---

# Integração WhatsApp

## WhatsApp → AgendaEC

Tecnologia:

- Web Share Target API

Fluxo:

```text
WhatsApp → Compartilhar → AgendaEC
```

---

## AgendaEC → WhatsApp

Tecnologia:

- wa.me deep links

Fluxo:

```text
AgendaEC → Abrir WhatsApp → Revisar → Enviar
```

---

## Regra obrigatória

O app NUNCA envia mensagens automaticamente.

Sempre:

1. gera texto
2. abre WhatsApp
3. usuária revisa
4. usuária envia

---

# Módulos do MVP

## Inbox

Responsável por:

- captura rápida
- interpretação IA
- preview
- confirmação

---

## Hoje

Responsável por:

- entregas do dia
- cobranças
- tarefas
- resumo financeiro

---

## Clientes

Responsável por:

- histórico
- saldo
- contatos
- cobranças

---

## Vendas

Responsável por:

- registrar vendas
- pagamentos
- status
- saldos

---

## Entregas

Responsável por:

- agenda de entregas
- controle operacional
- confirmação manual

---

## Tarefas

Responsável por:

- checklist operacional
- organização do dia

---

## Agenda

Responsável por:

- compromissos
- clientes agendados

---

## Cobranças

Responsável por:

- saldos pendentes
- atalhos WhatsApp
- controle rápido

---

# IA

## Objetivo

Interpretar texto livre.

---

## Modelo

- OpenAI GPT-4o mini

---

## Regras obrigatórias

- retornar JSON válido
- nunca inventar dados
- confidence score obrigatório
- fallback seguro

---

## Thresholds

### >= 0.80

- preview automático

### 0.50–0.79

- confirmação obrigatória

### < 0.50

- salvar como Observação Livre

---

# Stack Oficial

## Frontend

- Next.js 14
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui

---

## Backend

- Supabase
- PostgreSQL
- Edge Functions

---

## Estado global

- Zustand 5

---

## Offline

- IndexedDB
- Workbox
- persistência local

---

## Deploy

- Vercel

---

# Offline

## Objetivo

Tolerar internet instável.

---

## Estratégia

- fila offline simples
- retry simples
- sync ao reconectar
- Last Write Wins (LWW)

---

## NÃO implementar

- CRDT
- merge inteligente
- rollback visual complexo

---

# Segurança

## Obrigatório

- RLS em todas as tabelas
- segregação por store_id
- auth.uid()
- sanitização de entrada
- CHECK constraints

---

## Tokens

- nunca expor em logs
- nunca copiar manualmente para localStorage
- nunca copiar manualmente para sessionStorage

---

# Banco de Dados

## Tabelas principais

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

# Regras Operacionais

## Não implementar no MVP

- SaaS
- planos
- cobrança recorrente
- marketplace
- chatbot
- WhatsApp automático
- notificações push
- geofencing
- automações avançadas
- dashboards enterprise

---

# Critérios de Sucesso

## Operacionais

- app usado diariamente
- captura rápida
- cobranças não esquecidas
- fechamento rápido
- redução do uso operacional do WhatsApp

---

## UX

- menos de 3 segundos por ação
- menos de 10 segundos para captura
- fluxo previsível
- experiência mobile fluida

---

# Critérios de Aceitação

Uma funcionalidade só é aceita se:

- funcionar no celular
- for previsível
- for simples de manter
- não aumentar drasticamente complexidade
- respeitar o sprint atual
- melhorar operação real da loja

---

# Roadmap resumido

## Sprint 1

Fundação técnica.

---

## Sprint 2

Inbox + IA.

---

## Sprint 3

Hoje + Clientes + Vendas.

---

## Sprint 4

WhatsApp + Cobranças.

---

## Sprint 5

Entregas + Agenda + Tarefas.

---

## Sprint 6

Uso real + estabilização.

---

# Regra Final

Toda decisão do AgendaEC deve priorizar:

- simplicidade
- previsibilidade
- velocidade operacional
- mobile first
- baixo custo operacional
- uso real da loja
