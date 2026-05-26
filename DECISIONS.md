# DECISIONS.md — AgendaEC

Última revisão: 2026-05-14

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

# DEC-016 — Remoção temporária do Web Share Target

## Data

2026-05-14

## Decisão

O suporte a Web Share Target (texto/imagens via Android share sheet) foi removido do MVP inicial.

---

## Motivo

- inconsistências entre Android/WhatsApp/Chrome
- alta complexidade operacional para baixo valor imediato
- necessidade de preservar simplicidade do MVP
- foco no fluxo principal de captura manual textual

---

## Consequência

- captura inicial via Inbox textual manual
- suporte a compartilhamento e mídia poderá retornar pós-MVP
- código existente (manifest.json, sw.js, rota /inbox/share) preservado

---

# DEC-017 — SMTP próprio removido do MVP inicial

## Data

2026-05-14

## Decisão

A configuração de SMTP próprio via Resend foi adiada para pós-MVP.

---

## Motivo

- autenticação atual é suficiente para desenvolvimento e validação inicial
- não é bloqueador do fluxo principal do produto
- reduz complexidade operacional e dependências externas
- prioridade atual é validar captura operacional e Inbox

---

## Consequência

- rate limit do Supabase free tier permanece ativo
- aceitável durante fase inicial de desenvolvimento
- revisar antes de onboarding real de usuários

---

# DEC-018 — Sincronização Offline-First com Fila Sequencial

## Data

2026-05-16

## Decisão

Implementar sincronização offline baseada em uma fila de mutações (`PendingMutation[]`) processada de forma estritamente sequencial e manual.

---

## Motivo

- Garantir que a ordem das operações do usuário seja preservada (ex: Criar -> Editar -> Deletar).
- Minimizar conflitos de concorrência sem a complexidade de CRDTs.
- Oferecer controle total ao usuário sobre quando os dados são enviados para a nuvem.
- Manter a UI 100% responsiva e independente da conectividade.

---

## Consequência

- As stores locais (ex: `tasksStore`) são responsáveis por registrar mutações no `queueStore`.
- O `syncEngine` processa a fila uma por uma, parando no primeiro erro para evitar estados inconsistentes no servidor.
- É necessário um botão explícito de "Sincronizar" na interface.
- A aplicação utiliza `unknown` para payloads de mutação, exigindo tratamento tipado no motor de sincronização.

---

# DEC-019 — Captura Determinística de Vendas via Inbox

## Data

2026-05-16

## Decisão

O parser do Inbox foi estendido para identificar vendas automaticamente com base na detecção de valores monetários.

---

## Motivo

- Manter a filosofia de "IA invisível" e captura rápida.
- Reduzir a necessidade de formulários manuais para vendas simples.

---

## Consequência

- Entradas contendo padrões de moeda (ex: "R$ 150", "150,00") são classificadas como `sale`.
- O parser gera um objeto `Sale` em vez de `Task`.
- O processamento na Inbox decide qual store (`tasksStore` ou `salesStore`) alimentar.

---

# DEC-020 — Soft Delete para Domínios Operacionais

## Data

2026-05-16

## Decisão

Implementação estrita de soft delete (`deleted_at`) para as tabelas de `sales` e `clients`.

---

## Motivo

- Conforme **DEC-010**, preservar histórico financeiro e de contatos é crítico.
- Evitar que erros de sincronização ou exclusões acidentais removam dados permanentemente.

---

## Consequência

- O `syncEngine` utiliza `update({ deleted_at: ... })` em vez de `delete()` para esses domínios.
- As stores locais filtram registros onde `deleted_at` é não-nulo.

---

# DEC-021 — Normalização de Datas para Resumo Diário

## Data

2026-05-16

## Decisão

Utilizar normalização explícita (`value.slice(0, 10)`) para comparações de data nos filtros de UI.

---

## Motivo

- Prevenir bugs causados por timestamps ISO ou variações de timezone ao comparar `yyyy-MM-dd`.

---

## Consequência

- Filtros na tela "Hoje" e similares utilizam uma função local de normalização para garantir determinismo temporal.

---

# DEC-022 — Contexto Explícito para Captura de Vendas

## Data

2026-05-16

## Decisão

A classificação de vendas via Inbox exige:
- valor monetário detectado
- contexto explícito de venda

---

## Motivo

Evitar falsos positivos em entradas contendo números não financeiros (ex: "ligar às 15h").

---

## Consequência

O parser utiliza uma lista de palavras-chave explícitas (`SALE_KEYWORDS`) antes de classificar uma entrada como `sale`. Caso contrário, a entrada é tratada como `task`.

---

# DEC-023 — Módulo de Relatórios e Exportação Múltipla

## Data

2026-05-25

## Decisão

O MVP de relatórios incluirá:
- Acesso prioritário via ícone no topo da tela "Hoje".
- Exportação híbrida: "Baixar CSV" (contador) e "Copiar Texto" (WhatsApp).
- Seleção de período simplificada: navegação apenas entre meses (Mês Atual / Mês Anterior).

---

## Motivo

- **Acesso:** Mantém o fluxo natural da dona (visão diária -> visão mensal), evitando inflar o BottomNav.
- **Exportação:** CSV atende à necessidade rigorosa da contabilidade; texto atende à rapidez do uso no WhatsApp. A complexidade de ter os dois utilitários é baixa e o valor gerado é alto.
- **Período:** Filtros de período livre adicionam complexidade desnecessária agora.

---

## Consequência

- Relatórios isolados na rota `/relatorios`.
- Criação de `exportUtils.ts` para dual export.
- Sem necessidade de Date Range Picker no MVP.

---

# DEC-024 — Inbound Sync Híbrido

## Data

2026-05-25

## Decisão

As stores locais (Zustand) realizarão fetch no banco (Supabase) exclusivamente se seus respectivos caches estiverem vazios, utilizando a tabela `store_users` para resgate dinâmico do `store_id` durante a autenticação.

---

## Motivo

- **Limitação descoberta:** A aplicação era 100% outbound (só enviava para nuvem), impedindo a recuperação de histórico após limpeza de cache do navegador.
- **Eficiência:** Evitar conflitos de merge e requests desnecessários mantendo a premissa Offline-First, mas garantindo segurança na troca de aparelho.

---

## Consequência

- `AuthProvider.tsx` passa a acionar o `contextStore` com o `store_id`.
- Todas as stores principais (sales, clients, tasks, closings) ganham método `fetchFromRemote`.
- Fetch de `tasksStore` traz tudo (inclusive concluídas), sem ignorar `deleted_at` pois usa hard-delete.

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
