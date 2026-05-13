# DECISIONS.md — AgendaEC

Última revisão: 2026-05-13

---

# Objetivo

Registrar decisões técnicas e operacionais não-triviais tomadas durante o desenvolvimento do AgendaEC.

Este documento existe para preservar contexto histórico e evitar retrabalho futuro.

---

# Regras para registrar decisões

Registrar quando:

- houver escolha técnica relevante
- existir trade-off importante
- ocorrer desvio deliberado do PRD
- surgir novo padrão arquitetural
- houver mudança de stack
- existir impacto operacional significativo

Não registrar:

- bugs triviais
- ajustes cosméticos
- mudanças pequenas
- implementações óbvias
- tarefas rotineiras

---

# Ordem de precedência documental

1. STATUS.md
2. DECISIONS.md
3. ARCHITECTURE.md
4. PRD.md
5. demais documentos

---

# DEC-001 — Next.js App Router

## Data

2026-05-12

## Decisão

Utilizar exclusivamente:

- Next.js 14
- App Router

---

## Motivo

- alinhamento com stack moderna
- melhor integração com layouts
- melhor suporte PWA
- simplificação estrutural
- compatibilidade futura

---

## Consequência

Não utilizar:

- Pages Router
- API Routes antigas

---

# DEC-002 — Estado Global com Zustand

## Data

2026-05-12

## Decisão

Utilizar Zustand 5 como solução oficial de estado global.

---

## Motivo

- simplicidade
- baixo boilerplate
- integração simples com persistência
- menor custo cognitivo
- melhor adequação ao MVP

---

## Consequência

Não utilizar:

- Redux
- MobX
- Context API como store principal

---

# DEC-003 — Persistência Offline Simples

## Data

2026-05-12

## Decisão

Adotar estratégia offline simples baseada em:

- `zustand/persist`
- fila `PendingMutation[]`
- Last Write Wins (LWW)

---

## Motivo

- menor complexidade
- debugging previsível
- velocidade de implementação
- alinhamento com MVP

---

## Consequência

Não implementar:

- CRDT
- merge inteligente
- rollback visual
- resolução avançada de conflitos

---

# DEC-004 — WhatsApp via wa.me

## Data

2026-05-12

## Decisão

Utilizar integração oficial baseada em:

- `wa.me` deep links
- Web Share Target API

---

## Motivo

- custo zero
- simplicidade operacional
- conformidade com MVP
- menor risco técnico

---

## Consequência

Não utilizar:

- WhatsApp Business API no MVP
- automações de envio
- bots automáticos

---

# DEC-005 — IA Invisível

## Data

2026-05-12

## Decisão

A IA deve atuar nos bastidores, sem interromper o fluxo operacional da usuária.

---

## Motivo

- reduzir fricção
- preservar velocidade
- evitar burocracia
- manter experiência natural

---

## Consequência

- preview passivo
- confirmação com 1 toque
- fallback para Observação Livre
- IA nunca bloqueia o fluxo

---

# DEC-006 — Sem SaaS

## Data

2026-05-12

## Decisão

O AgendaEC será um sistema pessoal/interno.

---

## Motivo

- reduzir complexidade
- evitar multi-tenant
- reduzir custo operacional
- manter foco operacional

---

## Consequência

Não implementar:

- planos
- cobrança
- onboarding externo
- dashboards SaaS
- métricas para investidores

---

# DEC-007 — Supabase como Backend Principal

## Data

2026-05-12

## Decisão

Utilizar Supabase como backend oficial do MVP.

---

## Motivo

- PostgreSQL gerenciado
- Auth integrado
- RLS nativo
- Edge Functions
- velocidade de implementação

---

## Consequência

Stack oficial:

- Supabase Auth
- Supabase Database
- Supabase Edge Functions

---

# DEC-008 — Autenticação por Magic Link

## Data

2026-05-12

## Decisão

Utilizar autenticação por email OTP (magic link).

---

## Motivo

- simplicidade operacional
- menos fricção
- menos suporte técnico
- menor risco de senha fraca
- melhor experiência mobile

---

## Consequência

Não utilizar:

- senha tradicional
- autenticação customizada
- sessão manual
- armazenamento manual de token

---

# DEC-009 — Captura Mobile First

## Data

2026-05-13

## Decisão

Toda experiência principal do app será desenhada primeiro para celular.

---

## Motivo

- uso real ocorre majoritariamente no celular
- operação rápida da loja depende de mobilidade
- alinhamento com filosofia operacional

---

## Consequência

- desktop é secundário
- layouts priorizam telas pequenas
- ações rápidas devem estar acessíveis com uma mão

---

# DEC-010 — Soft Delete Obrigatório

## Data

2026-05-13

## Decisão

Registros operacionais e financeiros não devem utilizar `DELETE` físico.

---

## Motivo

- preservar histórico
- evitar perda acidental
- facilitar auditoria
- melhorar previsibilidade operacional

---

## Consequência

Utilizar:

- `deleted_at TIMESTAMPTZ`

Evitar:

- remoção física de registros financeiros
- exclusão irreversível no MVP

---

# DEC-011 — IA Sempre Retorna JSON

## Data

2026-05-13

## Decisão

Toda resposta da IA deve retornar JSON estruturado validável.

---

## Motivo

- previsibilidade
- parsing seguro
- debugging mais simples
- redução de ambiguidade

---

## Consequência

Obrigatório:

- validação antes de persistir
- fallback seguro
- campos ausentes como `null`

---

# DEC-012 — Sem Testes Automatizados no MVP

## Data

2026-05-13

## Decisão

O MVP não terá suíte formal de testes automatizados inicialmente.

---

## Motivo

- foco em velocidade operacional
- escopo enxuto
- validação diária com uso real
- baixo número de usuários

---

## Consequência

Validação será feita via:

- uso manual diário
- testes operacionais reais
- correções incrementais

Testes automatizados ficam para pós-MVP.

---

# DEC-013 — Edge Function para IA

## Data

2026-05-13

## Decisão

As chamadas para OpenAI serão feitas via Supabase Edge Functions.

---

## Motivo

- proteger API keys
- centralizar lógica
- permitir validação server-side
- facilitar troca futura de provider

---

## Consequência

Frontend nunca chama OpenAI diretamente.

Fluxo oficial:

```text
Frontend → Edge Function → OpenAI
```

---

# DEC-014 — Convenção de Saldo Devedor em clients.balance

## Data

2026-05-13

## Decisão

A coluna `clients.balance` representa o saldo da cliente em relação à loja, adotando a seguinte convenção:

- **valor negativo** → cliente deve à loja (saldo devedor)
- **valor zero** → cliente sem débito
- **valor positivo** → cliente possui crédito na loja (ex: pagamento antecipado)

O `CHECK (balance >= 0)` foi removido do schema porque impediria o registro de qualquer saldo devedor, contradizendo o fluxo principal do sistema.

---

## Motivo

- o produto é explicitamente um sistema de "saldo devedor"
- venda fiada ou pagamento parcial resulta em `balance < 0`
- o constraint anterior tornaria inválido o insert/update no primeiro pagamento parcial

---

## Consequência

- sem constraint de valor mínimo em `balance`
- frontend deve exibir saldo negativo como "deve R$ X" e saldo positivo como "crédito R$ X"
- nenhuma validação deve impedir `balance < 0`

---

# DEC-015 — Templates Canônicos de WhatsApp

## Data

2026-05-13

## Decisão

O texto canônico de cada template WhatsApp é definido abaixo. Esta entrada substitui e unifica as versões divergentes presentes no ROADMAP.md (Sprint 4) e no SPRINT_LOG.md (Sprint 4). Em caso de conflito, esta entrada prevalece.

---

## Templates canônicos

### Confirmação de pedido

```
Olá {nome}! Seu pedido de {produto} foi confirmado. Entrega prevista: {data}. Qualquer dúvida, estamos à disposição!
```

Variáveis: `{nome}`, `{produto}`, `{data}`

---

### Lembrete de entrega

```
Olá {nome}! Passando para lembrar que sua entrega de {produto} está prevista para hoje, {data}. Qualquer dúvida, é só chamar!
```

Variáveis: `{nome}`, `{produto}`, `{data}`

---

### Cobrança de saldo devedor

```
Olá {nome}! Seu saldo em aberto é de {saldo}. Quando puder, nos avise para combinarmos o pagamento. Obrigada!
```

Variáveis: `{nome}`, `{saldo}`

---

## Motivo

- ROADMAP e SPRINT_LOG traziam versões levemente diferentes do mesmo template
- templates vão para `wa_templates` no banco e para `lib/whatsapp/templates.ts`
- texto ambíguo pode gerar inconsistência entre banco e código

---

## Consequência

- ROADMAP.md e SPRINT_LOG.md não devem mais conter o texto literal dos templates — apenas referência a esta entrada
- qualquer alteração de template deve ser registrada aqui como nova sub-versão

---

# Regra final

Toda nova decisão deve responder:

1. reduz complexidade?
2. melhora previsibilidade?
3. mantém baixo custo operacional?
4. respeita o escopo do MVP?
5. melhora operação real da loja?
6. continua simples de debugar?

Se não atender aos princípios acima, deve ser reavaliada.
