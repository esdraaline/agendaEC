# PHILOSOPHY.md — AgendaEC

Última revisão: 2026-05-13  
Status: Filosofia oficial do MVP

---

# Propósito

O AgendaEC existe para:

- substituir grupos de WhatsApp como ferramenta de controle diário
- organizar vendas, cobranças, entregas e tarefas de uma loja de cosméticos
- manter a velocidade e naturalidade do WhatsApp
- adicionar estrutura, histórico e inteligência sem burocracia

O AgendaEC NÃO existe para:

- ser um ERP corporativo
- ser um SaaS para terceiros
- substituir o WhatsApp
- gerar dependência emocional
- funcionar como rede social ou entretenimento

---

# Identidade do Produto

O produto deve se comportar como:

- assistente operacional pessoal da loja
- caderno de anotações inteligente
- organizador de execução
- ferramenta operacional confiável

Nunca como:

- sistema de gestão empresarial complexo
- plataforma de auto-cadastro de clientes
- produto com planos e assinaturas
- personagem com personalidade excessiva

---

# Tom do produto

- direto
- claro
- profissional
- previsível
- sem linguagem emocional artificial
- sem antropomorfização exagerada
- foco operacional: "o que precisa ser feito hoje?"

---

# Filosofia Central

## P1 — Mobile first, sempre

O app é feito para celular.

Todas as decisões de UX, layout e performance priorizam o mobile.

Desktop é secundário.

---

## P2 — Extremamente rápido

Metas operacionais:

- menos de 3 segundos por ação
- captura de anotação em menos de 10 segundos
- abertura do app em menos de 2 segundos
- resposta visual em menos de 300ms

---

## P3 — Texto livre, zero burocracia

A usuária digita como pensa.

Princípios:

- nenhum campo obrigatório na captura
- IA interpreta nos bastidores
- sem formulários extensos
- sem fluxo burocrático
- se precisar de manual, está errado

---

## P4 — IA invisível

A IA organiza nos bastidores sem interromper o fluxo operacional.

Regras:

- preview passivo para confiança alta
- confirmação com 1 toque para confiança média
- fallback para Observação Livre
- nunca bloquear a usuária
- IA auxilia, não domina a interface

---

## P5 — WhatsApp fluido

O app e o WhatsApp trabalham juntos.

Objetivos:

- encaminhar do WA para o app com 1 toque
- cobrar no WA com 1 toque
- nunca copiar e colar manualmente
- integração invisível e rápida

---

## P6 — Simples de verdade

Uma solução simples e previsível é preferível a uma sofisticada e frágil.

Uma loja pequena não precisa de ERP.

Precisa de controle operacional confiável.

---

# CDP — Critérios de Desenvolvimento do Produto

## CDP1 — Clareza antes de abstração

Priorizar:

- código explícito
- leitura simples
- debugging rápido
- organização previsível

Evitar:

- engenharia excessiva
- abstrações prematuras
- padrões desnecessariamente complexos
- excesso de genericidade

---

## CDP2 — Menos infraestrutura

O MVP deve funcionar com:

- Vercel
- Supabase
- OpenAI
- baixo custo operacional
- setup simples

Evitar:

- microserviços prematuros
- infraestrutura distribuída desnecessária
- múltiplos provedores sem necessidade
- dependências excessivas

---

## CDP3 — Determinismo onde possível

Parser e ranking devem ser:

- transparentes
- previsíveis
- auditáveis
- debuggáveis

A IA do Inbox:

- sempre retorna JSON estruturado
- nunca inventa dados
- confidence score explícito
- fallback para Observação Livre

---

## CDP4 — Segurança mínima obrigatória

Obrigatório:

- RLS em todas as tabelas
- `auth.uid()` nas policies
- `CHECK` constraints
- validação de entrada
- sanitização de entrada

Tokens:

- gerenciados exclusivamente pelo Supabase
- não copiar manualmente para `localStorage`
- não copiar manualmente para `sessionStorage`
- não expor em logs

Método oficial:

- email e senha via Supabase Auth
- senha gerenciada pelo Supabase
- sem token customizado

---

## CDP5 — UX operacional

O produto deve:

- reduzir passos
- reduzir fricção
- acelerar captura
- minimizar cliques desnecessários
- priorizar ações rápidas

O produto NÃO deve:

- exigir treinamento complexo
- exigir preenchimento longo
- bloquear fluxo operacional
- parecer um ERP corporativo

---

## CDP6 — Offline pragmático

Offline existe para:

- tolerar internet instável
- evitar perda de captura
- permitir operação mínima

Offline NÃO existe para:

- sincronização distribuída avançada
- colaboração complexa em tempo real
- CRDT
- merge inteligente sofisticado

Estratégia oficial:

- fila local simples
- retry simples
- Last Write Wins (LWW)

---

## CDP7 — WhatsApp nunca automático

Regra absoluta:

O AgendaEC NUNCA envia mensagens automaticamente.

Fluxo obrigatório:

1. sistema gera texto
2. WhatsApp abre
3. usuária revisa
4. usuária toca "Enviar"

Objetivo:

- evitar erros
- evitar automações perigosas
- manter controle humano

---

## CDP8 — Mobile > Desktop

Quando houver conflito entre:

- experiência mobile
- experiência desktop

A prioridade é mobile.

Sempre.

---

## CDP9 — Escopo controlado

Toda decisão deve respeitar:

- simplicidade
- previsibilidade
- baixo custo operacional
- uso pessoal/interno
- MVP enxuto

Evitar expansão de escopo sem necessidade operacional real.

---

# Antiobjetivos

O projeto NÃO deve virar:

- ERP complexo
- plataforma SaaS
- dashboard corporativo
- sistema enterprise
- plataforma de automação total
- sistema social
- produto cheio de configurações desnecessárias

---

# Filosofia de implementação

Ao implementar qualquer funcionalidade:

Perguntar:

1. resolve um problema real da loja?
2. reduz fricção operacional?
3. mantém simplicidade?
4. é fácil de debugar?
5. aumenta complexidade sem necessidade?
6. funciona bem no celular?
7. respeita o escopo do sprint atual?

Se a resposta violar os princípios acima, a implementação deve ser rejeitada.

---

# Filosofia de evolução

O AgendaEC deve evoluir:

- incrementalmente
- com estabilidade
- guiado pelo uso real
- baseado em dores operacionais reais
- sem reescritas prematuras
- sem arquitetura futurista desnecessária

---

# Regra final

O AgendaEC deve parecer:

- rápido
- leve
- previsível
- operacional
- invisível

Nunca:

- burocrático
- pesado
- confuso
- excessivamente técnico
- corporativo demais
