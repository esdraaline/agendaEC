# ROADMAP.md — AgendaEC

Última revisão: 2026-05-13  
Status: Roadmap oficial do MVP

---

# Objetivo do Roadmap

Garantir uma evolução:

- incremental
- previsível
- operacionalmente sustentável
- alinhada à filosofia do produto
- focada em estabilidade
- focada em uso diário real
- de baixo custo operacional
- com previsibilidade arquitetural

---

# Sprint 1 — Fundação

## Objetivo

Construir a fundação técnica inicial do projeto.

---

## Entregas concretas

- Scaffold Next.js 14 + TypeScript 5 + Tailwind CSS 3 + shadcn/ui
- Projeto Supabase criado e configurado
- `.env.example` versionado
- `.env` no `.gitignore`
- `vercel.json` com rewrite SPA
- `manifest.json` com `share_target`
- autenticação via magic link
- Zustand 5 configurado
- persistência local
- fila offline de mutações
- UUID gerado no cliente via `crypto.randomUUID()`

---

## Schema do MVP

Aplicar:

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

## Infraestrutura

- triggers `updated_at`
- políticas RLS
- rota `/inbox/share`
- layout base
- captura offline básica
- estrutura base de rotas

---

## Fora do escopo

- Motor de IA
- Tela Hoje completa
- Integração WhatsApp `wa.me`
- Módulos avançados
- Agenda completa
- Fechamento do dia

---

## Critério de conclusão

- aplicação inicia corretamente
- login funcional
- banco conectado
- PWA instalável
- `share_target` funcionando
- persistência local funcional
- `vercel.json` funcionando em produção

---

# Sprint 2 — Inbox + IA

## Objetivo

Construir o Inbox inteligente.

---

## Entregas concretas

- InboxForm
- campo de texto livre
- integração OpenAI GPT-4o mini
- Edge Function Supabase
- prompt do sistema
- pipeline completo IA
- preview editável
- botão Confirmar
- botão Ajustar
- fallback Observação Livre
- histórico do Inbox
- sugestão automática de clientes
- atalhos rápidos
- detecção automática de paste
- processamento de compartilhamento do WhatsApp

---

## Fora do escopo

- entrada por áudio
- IA contextual avançada
- sugestões proativas

---

## Critério de conclusão

A usuária consegue digitar:

> "Renata 6 tintas quinta 150 entrada"

E o sistema interpreta corretamente:

- cliente
- produto
- valor
- data
- saldo

Além disso:

- preview exibe os campos
- confirmação salva os registros
- confidence funciona corretamente
- Inbox funciona offline

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
- tarefas do dia
- resumo por forma de pagamento

---

## Módulo de Vendas

- listagem
- filtros
- pagamento parcial
- status da venda
- botão WhatsApp

---

## Módulo de Clientes

- perfil da cliente
- saldo devedor
- histórico completo
- busca tolerante a erros
- tags automáticas
- botão WhatsApp

---

## Fora do escopo

- módulo de estoque
- relatórios contábeis

---

## Critério de conclusão

- app abre mostrando entregas e cobranças
- entrega pode ser marcada como feita
- saldo calculado corretamente
- busca rápida
- perfil funcional

---

# Sprint 4 — WhatsApp + Cobranças

## Objetivo

Integrar profundamente com o WhatsApp.

---

## Entregas concretas

- botão Cobrar no WhatsApp
- geração de links `wa.me`
- templates padrão
- tela de templates editáveis
- tela de cobranças pendentes
- total geral de cobranças
- botão verde Cobrar WA
- testes reais de Web Share Target

---

## Templates

O texto canônico de cada template está definido em **DEC-015** (`DECISIONS.md`). Em caso de conflito, DEC-015 prevalece sobre qualquer versão anterior presente neste documento.

Templates previstos para o Sprint 4:

- **Cobrança de saldo devedor** — variáveis: `{nome}`, `{saldo}`
- **Confirmação de pedido** — variáveis: `{nome}`, `{produto}`, `{data}`
- **Lembrete de entrega** — variáveis: `{nome}`, `{produto}`, `{data}`

Consulte DEC-015 para o texto completo de cada template antes de popular a tabela `wa_templates` ou o arquivo `lib/whatsapp/templates.ts`.

---

## Fora do escopo

- WhatsApp Business API
- envio automático
- chatbot
- automações de conversa

---

## Critério de conclusão

- botão abre WA corretamente
- mensagens formatadas corretamente
- templates editáveis funcionando
- cobranças visíveis no app
- fluxo rápido e previsível

---

# Sprint 5 — Entregas + Tarefas + Agenda

## Objetivo

Completar a operação diária da loja.

---

## Entregas

- calendário simples
- status de entrega
- filtro por dia
- confirmação manual

---

## Tarefas

- checklist simples
- prioridade
- conclusão rápida
- visualização do dia

---

## Agenda

- compromissos
- clientes agendados
- visão diária
- visão semanal simples

---

## Fechamento do dia

- total vendido
- total recebido
- pendências
- resumo diário

---

## Fora do escopo

- agenda compartilhada avançada
- recorrência complexa
- automações inteligentes

---

## Critério de conclusão

- dona consegue operar o dia inteiro no app
- tarefas organizadas
- entregas controladas
- fechamento rápido

---

# Sprint 6 — Uso Real

## Objetivo

Estabilizar o produto em uso diário real.

---

## Foco

- correção de bugs
- performance
- UX
- estabilidade
- previsibilidade
- melhoria operacional

---

## Ajustes esperados

- refinamento de telas
- melhorias de fluxo
- melhorias no Inbox
- refinamento do parser IA
- redução de cliques
- melhorias mobile
- ajustes baseados em uso real

---

## Fora do escopo

- expansão grande de escopo
- funcionalidades enterprise
- reescrita arquitetural

---

## Critério de conclusão

- app usado diariamente sem fricção grave
- estabilidade operacional
- sem bugs críticos
- experiência fluida no celular

---

# Pós-MVP (v1.5+)

## Funcionalidades possíveis

- módulo de estoque
- exportação PDF
- relatórios financeiros
- Google Calendar
- notificações push
- tarefas recorrentes
- Mercado Pago / Pix automático
- WhatsApp Business API
- testes automatizados
- melhorias avançadas offline

---

# Regras do roadmap

O roadmap deve:

- respeitar escopo do MVP
- evitar expansão prematura
- priorizar simplicidade
- priorizar estabilidade
- priorizar velocidade operacional
- priorizar uso real

---

# Regra final

Antes de adicionar qualquer funcionalidade, perguntar:

1. resolve dor operacional real?
2. reduz fricção?
3. mantém simplicidade?
4. respeita o escopo?
5. funciona bem no celular?
6. aumenta complexidade sem necessidade?

Se violar os princípios acima, a funcionalidade deve ser adiada.
