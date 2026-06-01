# BeautyOps — Product Requirements Document

> **Central Operacional Inteligente para Lojas de Cosméticos**

| Campo | Valor |
|---|---|
| **Versão** | 3.0 |
| **Status** | Aprovado para Desenvolvimento |
| **Data** | Maio / 2026 |
| **Autor** | Josemar de Paula |
| **Stack** | Vite + React 19 + Supabase + IA Híbrida (Gemini Flash + Claude Haiku) |
| **Modelo de Execução** | Evolução incremental com Codex / Claude Code / Cursor / Gemini via VS Code |

---

## Sumário

0. [Histórico de Versões](#0-histórico-de-versões)
1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Princípios e Decisões de Design](#2-princípios-e-decisões-de-design)
3. [Arquitetura do Sistema](#3-arquitetura-do-sistema)
4. [Modelagem do Banco de Dados](#4-modelagem-do-banco-de-dados)
5. [Módulos do Sistema](#5-módulos-do-sistema)
6. [Motor de Inteligência Artificial](#6-motor-de-inteligência-artificial)
7. [Integração com WhatsApp](#7-integração-com-whatsapp)
8. [Estratégia Offline-First](#8-estratégia-offline-first)
9. [User Stories e Critérios de Aceitação](#9-user-stories-e-critérios-de-aceitação)
10. [Roadmap e MVP](#10-roadmap-e-mvp)
11. [Métricas, Monitoramento e Observabilidade](#11-métricas-monitoramento-e-observabilidade)
12. [Riscos Técnicos e Mitigações](#12-riscos-técnicos-e-mitigações)
13. [Segurança e Conformidade](#13-segurança-e-conformidade)
14. [UX Guidelines e Navegação](#14-ux-guidelines-e-navegação)
15. [Diretrizes para IA Codificadora](#15-diretrizes-para-ia-codificadora)
16. [Architecture Decision Records (ADRs)](#16-architecture-decision-records-adrs)
17. [Definition of Done por Fase](#17-definition-of-done-por-fase)
18. [Glossário](#18-glossário)

---

## 0. Histórico de Versões

| Versão | Data | Mudanças Principais |
|---|---|---|
| v1.0 | — | Conceito inicial |
| v2.0 | 05/2025 | Estrutura completa, schema inicial, Next.js 15 |
| **v3.0** | **05/2026** | Stack migrada para Vite + React 19; IA híbrida (Gemini Flash primário, Haiku secundário, regex local); schema completo com tabelas faltantes (`payments`, `sale_items`, `products`, `appointments`, `client_aliases`); idempotência e versionamento para sync offline; ADRs adicionados; seção de diretrizes para IA codificadora; DoD por fase; MVP recalibrado para 4 semanas |

---

## 1. Visão Geral do Produto

### 1.1 Proposta de Valor

BeautyOps é uma plataforma **mobile-first** de operações diárias para lojas de cosméticos de pequeno e médio porte. O produto transforma anotações caóticas em texto livre — hoje dispersas em grupos de WhatsApp — em uma central operacional organizada, inteligente e extremamente rápida.

O sistema combina a velocidade e naturalidade de um app de mensagens com a estrutura e inteligência de um ERP moderno, sem a burocracia nem a curva de aprendizado de sistemas tradicionais.

> **Diferencial Central** — Usuária não preenche o sistema. O sistema trabalha pela usuária. Tudo começa como uma anotação livre e a IA organiza automaticamente.

### 1.2 Problema que Resolve

Donas de lojas de cosméticos de pequeno porte operam hoje com WhatsApp como centro operacional. Essa abordagem é veloz, mas gera cinco categorias críticas de problemas:

| Categoria | Sintoma | Impacto no Negócio |
|---|---|---|
| Perda de Informação | Mensagens somem no histórico do WhatsApp | Cobranças esquecidas, clientes insatisfeitos |
| Visão Zero | Nenhum painel operacional diário | Decisões baseadas em memória, não em dados |
| Financeiro Manual | Fechamento feito na cabeça ou no caderno | Erros de caixa, desvios não detectados |
| Entregas Descontroladas | Misturadas com mensagens diversas | Atrasos, reclamações, retrabalho |
| Histórico Inexistente | Sem registro de clientes e compras | Zero personalização, perda de fidelização |

### 1.3 Personas

#### Persona Primária — Operadora da Loja

| Atributo | Descrição |
|---|---|
| Nome | Josefa, 34 anos |
| Perfil | Dona ou funcionária principal de loja de cosméticos de bairro |
| Dispositivo | Android mid-range (Samsung Galaxy A-series, 3-4GB RAM) |
| Conectividade | 4G instável, Wi-Fi residencial básico |
| Comportamento | Envia 100-200 mensagens/dia no WhatsApp operacional |
| Dores | Perde cobranças, esquece entregas, sem visão do dia |
| Objetivo | Saber exatamente o que precisa fazer hoje sem esforço |
| Resistência | Qualquer sistema com formulário ou múltiplos passos |

#### Persona Secundária — Proprietária com Visão Estratégica

| Atributo | Descrição |
|---|---|
| Nome | Renata, 42 anos |
| Perfil | Proprietária que também atende e quer ver resultados |
| Dispositivo | iPhone ou Android flagship |
| Dores | Sem visão financeira clara, não sabe quem deve quanto |
| Objetivo | Relatórios simples, cobranças automatizadas, histórico de clientes |

### 1.4 Objetivos de Negócio (OKRs — Ciclo 1)

> **Nota sobre baselines**: As metas abaixo são *targets* iniciais. Os primeiros 30 dias após o MVP em produção servirão para estabelecer baselines reais; as metas serão recalibradas no Ciclo 2.

| Objetivo | Key Result | Meta Inicial | Baseline |
|---|---|---|---|
| Adoção | Usuárias ativas após 30 dias | ≥ 70% | A medir |
| Engajamento | Capturas/dia por usuária ativa | ≥ 15 | A medir |
| Retenção | Churn em 90 dias | ≤ 10% | A medir |
| Velocidade | Tempo médio de uma captura | ≤ 8 segundos | A medir |
| Precisão IA | Taxa de classificação correta sem edição | ≥ 85% | A medir |
| NPS | Net Promoter Score | ≥ 60 | A medir |

---

## 2. Princípios e Decisões de Design

### 2.1 Princípios Absolutos do Produto

| Princípio | Significado Prático |
|---|---|
| Mobile-First, Mobile-Only (MVP) | Toda interface é desenhada primeiro para tela de 360-430px |
| Offline-First | Todas as ações funcionam sem rede; sync acontece em background |
| Captura Acima de Tudo | Nenhuma tela deve impedir ou atrasar uma nova captura |
| IA Invisível | IA processa em background; usuária não vê "carregando IA..." |
| Zero Formulário no Fluxo Principal | Formulários existem apenas para edição explícita |
| Ação em 1-2 Toques | Qualquer ação operacional crítica ≤ 2 toques |
| Linguagem da Usuária | Interface usa termos do negócio: "tinta", "entrega", "fiado" |
| Feedback Imediato | Toda ação responde em < 200ms visualmente, mesmo offline |

### 2.2 Anti-Padrões Proibidos

- Qualquer wizard ou formulário multi-etapa no fluxo de captura
- Loading spinners bloqueantes na tela principal
- Confirmações desnecessárias ("Tem certeza?") em ações reversíveis
- Navegação com mais de 3 níveis de profundidade
- Onboarding que exige preenchimento antes do primeiro uso
- Notificações push irrelevantes ou excessivas

### 2.3 Design System — Fundamentos

#### Tipografia

| Token | Uso | Tamanho / Peso |
|---|---|---|
| display-xl | Título da tela Hoje | 24px / 700 |
| heading-lg | Títulos de seção | 18px / 600 |
| heading-md | Subtítulos de card | 16px / 600 |
| body-md | Texto padrão | 14px / 400 |
| body-sm | Metadados, timestamps | 12px / 400 |
| mono-sm | Valores monetários, IDs | 13px / 500, monospace |

#### Paleta de Cores

| Token | Hex | Uso |
|---|---|---|
| brand-600 | `#7C3AED` | CTAs primários, ícones ativos |
| brand-100 | `#EDE9FE` | Backgrounds de destaque suave |
| success-600 | `#059669` | Status pago, concluído |
| warning-600 | `#D97706` | Pendências, alertas moderados |
| danger-600 | `#DC2626` | Cobranças vencidas, erros críticos |
| neutral-900 | `#111827` | Texto primário |
| neutral-500 | `#6B7280` | Texto secundário/metadados |
| neutral-100 | `#F3F4F6` | Fundo de cards |

#### Componentes Fundamentais

- **QuickCaptureInput**: textarea expansível, sempre visível, sem label
- **OperationalCard**: card swipeable com ações contextuais
- **StatusBadge**: pill colorido com ícone + texto de status
- **AmountDisplay**: valor monetário com formatação R$ consistente
- **ClientAvatar**: inicial do nome em círculo colorido deterministicamente
- **DateChip**: data relativa ("Hoje", "Amanhã", "Sex 14h")
- **SyncIndicator**: ícone sutil de status de sincronização

---

## 3. Arquitetura do Sistema

### 3.1 Visão de Alto Nível

BeautyOps adota uma arquitetura de três camadas com sincronização bidirecional, projetada para funcionar completamente offline e sincronizar quando a rede estiver disponível.

> **Stack Técnico Definido (v3.0)** — Vite 5 + React 19 + TypeScript 5 strict + Tailwind CSS 4 + shadcn/ui + Supabase (PostgreSQL 15 + Auth + Storage + Realtime + Edge Functions) + PWA + IndexedDB (Dexie.js) + Workbox + TanStack Query v5 + Zustand + Zod + Vercel

### 3.2 Camadas da Arquitetura

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Apresentação | Vite + React 19 + React Router v6 | UI, navegação, estado local |
| Estado Global | Zustand + TanStack Query v5 | Estado servidor, cache, mutações otimistas |
| Persistência Local | IndexedDB via Dexie.js | Offline storage, queue de operações pendentes |
| Sync Engine | Service Worker (Workbox) + Background Sync API | Sincronização offline↔server, conflict resolution |
| API Layer | Supabase JS Client + Edge Functions | Abstração de acesso a dados |
| Backend | Supabase (PostgreSQL 15) | Persistência, Auth, RLS, Realtime, Storage |
| IA | Gemini Flash (primário) + Claude Haiku (fallback) via Edge Functions | NLU, extração de entidades, classificação |
| CDN / Deploy | Vercel | Deploy, Edge Network, Analytics |

### 3.3 Estrutura de Pastas (Feature-Based, Vite)

```
src/
├── main.tsx                      # Entry point Vite
├── App.tsx                       # Router root
├── routes/                       # React Router v6 routes
│   ├── _layout.tsx               # Layout autenticado
│   ├── hoje.tsx                  # Tela Hoje
│   ├── inbox.tsx                 # Captura rápida
│   ├── inbox.share.tsx           # Share Target endpoint
│   ├── clientes.tsx
│   ├── clientes.$id.tsx
│   ├── financeiro.tsx
│   └── auth.tsx
├── features/                     # Feature modules
│   ├── capture/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types.ts
│   ├── today/
│   ├── clients/
│   ├── sales/
│   ├── deliveries/
│   ├── charges/
│   ├── financial/
│   └── ai/                       # IA/NLU pipeline
├── shared/
│   ├── components/               # Design system + shadcn/ui
│   ├── hooks/
│   ├── lib/                      # supabase client, dexie db, utils
│   ├── schemas/                  # Zod schemas globais
│   └── types/                    # Branded types, Result type
├── workers/
│   ├── sw.ts                     # Service Worker (Workbox)
│   └── sync.ts                   # Sync engine
├── offline/
│   ├── db.ts                     # Dexie schema
│   ├── queue.ts                  # Operações pendentes
│   └── conflicts.ts              # Resolução de conflitos
└── supabase/
    ├── migrations/               # SQL migrations versionadas
    └── functions/                # Edge Functions Deno
        ├── interpret-capture/
        └── ai-fallback/
```

### 3.4 Convenções TypeScript

| Padrão | Regra |
|---|---|
| Tipos vs Interfaces | `interface` para contratos de objeto; `type` para unions e utilitários |
| Strict Mode | `tsconfig` com `strict: true`, `noUncheckedIndexedAccess: true`, `exactOptionalPropertyTypes: true` |
| Zod Schemas | Toda entrada externa (API, formulário, IA output) validada com Zod |
| Result Type | Funções que falham retornam `Result<T, E>` — nunca lançam exceções implícitas |
| Branded Types | IDs tipados: `ClientId`, `SaleId`, `DeliveryId` |
| Async Boundaries | Toda operação de rede/db é async e retorna `Result` |
| Naming | `camelCase` para vars/funções, `PascalCase` para tipos, `SCREAMING_SNAKE_CASE` para constantes |
| Imports | Path aliases via `@/features/...`, `@/shared/...` |

---

## 4. Modelagem do Banco de Dados

### 4.1 Entidades Principais

| Entidade | Tabela | Descrição |
|---|---|---|
| Usuária | `users` (Supabase Auth) | Autenticação e perfil |
| Loja | `stores` | Configuração da loja |
| Captura | `captures` | Anotação bruta + resultado da IA |
| Cliente | `clients` | Cadastro de clientes |
| Alias de Cliente | `client_aliases` | Apelidos e variações para fuzzy match |
| Produto | `products` | Catálogo (opcional no MVP) |
| Venda | `sales` | Transação de venda |
| Item de Venda | `sale_items` | Produtos de uma venda |
| Pagamento | `payments` | Pagamentos vinculados a vendas |
| Entrega | `deliveries` | Registros de entrega |
| Cobrança | `charges` | Cobranças a receber |
| Tarefa | `tasks` | Tarefas operacionais |
| Compromisso | `appointments` | Agenda |
| Log de IA | `ai_logs` | Auditoria de interpretações |
| Fila de Sync | `ops_queue` (local, IndexedDB) | Operações pendentes |

### 4.2 Schema SQL Completo

```sql
-- ============================================================
-- BeautyOps — Schema SQL v3.0
-- PostgreSQL 15 (Supabase)
-- ============================================================

-- Extensões necessárias
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";          -- fuzzy search
CREATE EXTENSION IF NOT EXISTS "unaccent";         -- normalização PT-BR

-- ============================================================
-- TRIGGER GENÉRICO: updated_at automático
-- ============================================================
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  NEW.version = COALESCE(OLD.version, 0) + 1;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================
-- STORES
-- ============================================================
CREATE TABLE stores (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  settings    JSONB NOT NULL DEFAULT '{}',
  version     INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_stores_updated BEFORE UPDATE ON stores
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- CLIENTS
-- ============================================================
CREATE TABLE clients (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name         TEXT NOT NULL,
  name_normalized TEXT GENERATED ALWAYS AS (lower(unaccent(name))) STORED,
  phone        TEXT,
  notes        TEXT,
  tags         TEXT[] DEFAULT '{}',
  balance      NUMERIC(10,2) NOT NULL DEFAULT 0,
  version      INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_clients_updated BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE client_aliases (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id  UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  store_id   UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  alias      TEXT NOT NULL,
  alias_normalized TEXT GENERATED ALWAYS AS (lower(unaccent(alias))) STORED,
  source     TEXT NOT NULL DEFAULT 'manual',  -- manual | ai_inferred
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PRODUCTS (opcional MVP)
-- ============================================================
CREATE TABLE products (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id    UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,
  name_normalized TEXT GENERATED ALWAYS AS (lower(unaccent(name))) STORED,
  default_price NUMERIC(10,2),
  stock_qty   INT,
  active      BOOLEAN NOT NULL DEFAULT TRUE,
  version     INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE TRIGGER trg_products_updated BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- CAPTURES (inbox bruto)
-- ============================================================
CREATE TABLE captures (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id        UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_op_id    TEXT,                       -- idempotência (gerado no cliente)
  raw_text        TEXT NOT NULL,
  source          TEXT NOT NULL DEFAULT 'manual', -- manual|share|voice
  ai_status       TEXT NOT NULL DEFAULT 'pending', -- pending|processing|done|failed|review
  ai_provider     TEXT,                       -- gemini|claude|regex
  ai_result       JSONB,
  ai_confidence   NUMERIC(3,2),
  ai_model        TEXT,
  ai_tokens_used  INT,
  processed_at    TIMESTAMPTZ,
  linked_entities JSONB DEFAULT '[]',         -- [{type:'sale',id:'...'}, ...]
  version         INT NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_captures_updated BEFORE UPDATE ON captures
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- SALES
-- ============================================================
CREATE TABLE sales (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id       UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id),
  capture_id     UUID REFERENCES captures(id),
  client_op_id   TEXT,
  status         TEXT NOT NULL DEFAULT 'open', -- open|partial|paid|cancelled
  total          NUMERIC(10,2) NOT NULL DEFAULT 0,
  paid           NUMERIC(10,2) NOT NULL DEFAULT 0,
  balance        NUMERIC(10,2) GENERATED ALWAYS AS (total - paid) STORED,
  payment_method TEXT,
  notes          TEXT,
  sale_date      DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date       DATE,
  version        INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_sales_updated BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE sale_items (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sale_id     UUID NOT NULL REFERENCES sales(id) ON DELETE CASCADE,
  product_id  UUID REFERENCES products(id),
  description TEXT NOT NULL,                 -- texto livre quando sem produto
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  NUMERIC(10,2) NOT NULL DEFAULT 0,
  subtotal    NUMERIC(10,2) GENERATED ALWAYS AS (quantity * unit_price) STORED,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ============================================================
-- PAYMENTS
-- ============================================================
CREATE TABLE payments (
  id             UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id       UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  sale_id        UUID REFERENCES sales(id) ON DELETE CASCADE,
  client_id      UUID REFERENCES clients(id),
  capture_id     UUID REFERENCES captures(id),
  client_op_id   TEXT,
  amount         NUMERIC(10,2) NOT NULL,
  payment_method TEXT NOT NULL DEFAULT 'cash', -- cash|pix|card|credit|other
  payment_type   TEXT NOT NULL DEFAULT 'full', -- full|entry|balance|partial
  paid_at        TIMESTAMPTZ NOT NULL DEFAULT now(),
  notes          TEXT,
  version        INT NOT NULL DEFAULT 0,
  created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_payments_updated BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- DELIVERIES
-- ============================================================
CREATE TABLE deliveries (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id      UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES clients(id),
  sale_id       UUID REFERENCES sales(id),
  capture_id    UUID REFERENCES captures(id),
  client_op_id  TEXT,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|done|cancelled
  description   TEXT NOT NULL,
  scheduled_at  TIMESTAMPTZ,
  completed_at  TIMESTAMPTZ,
  notes         TEXT,
  version       INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_deliveries_updated BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- CHARGES
-- ============================================================
CREATE TABLE charges (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id    UUID NOT NULL REFERENCES clients(id),
  sale_id      UUID REFERENCES sales(id),
  client_op_id TEXT,
  amount       NUMERIC(10,2) NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending', -- pending|paid|waived
  due_date     DATE,
  paid_at      TIMESTAMPTZ,
  notes        TEXT,
  version      INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_charges_updated BEFORE UPDATE ON charges
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- TASKS
-- ============================================================
CREATE TABLE tasks (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id     UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  capture_id   UUID REFERENCES captures(id),
  client_op_id TEXT,
  title        TEXT NOT NULL,
  status       TEXT NOT NULL DEFAULT 'pending',
  priority     TEXT NOT NULL DEFAULT 'normal', -- low|normal|high
  due_date     DATE,
  completed_at TIMESTAMPTZ,
  version      INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_tasks_updated BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- APPOINTMENTS
-- ============================================================
CREATE TABLE appointments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id      UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  client_id     UUID REFERENCES clients(id),
  capture_id    UUID REFERENCES captures(id),
  client_op_id  TEXT,
  title         TEXT NOT NULL,
  scheduled_at  TIMESTAMPTZ NOT NULL,
  duration_min  INT DEFAULT 60,
  status        TEXT NOT NULL DEFAULT 'pending', -- pending|done|cancelled|no_show
  notes         TEXT,
  version       INT NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (store_id, client_op_id)
);
CREATE TRIGGER trg_appointments_updated BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- AI LOGS (auditoria completa, retenção 90 dias)
-- ============================================================
CREATE TABLE ai_logs (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  capture_id    UUID REFERENCES captures(id) ON DELETE SET NULL,
  store_id      UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  provider      TEXT NOT NULL,           -- gemini|claude|regex
  model         TEXT NOT NULL,
  prompt_version TEXT,                   -- versionamento de prompts (A/B)
  prompt_tokens INT NOT NULL DEFAULT 0,
  output_tokens INT NOT NULL DEFAULT 0,
  latency_ms    INT,
  confidence    NUMERIC(3,2),
  intent        TEXT,
  entities      JSONB,
  fallback_used BOOLEAN NOT NULL DEFAULT FALSE,
  error         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Particionamento mensal para retenção
CREATE INDEX idx_ai_logs_retention ON ai_logs(created_at);
```

### 4.3 Índices Críticos

```sql
CREATE INDEX idx_captures_store_status   ON captures(store_id, ai_status, created_at DESC);
CREATE INDEX idx_sales_store_status      ON sales(store_id, status, sale_date DESC);
CREATE INDEX idx_sales_client            ON sales(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_payments_sale           ON payments(sale_id);
CREATE INDEX idx_payments_store_date     ON payments(store_id, paid_at DESC);
CREATE INDEX idx_deliveries_scheduled    ON deliveries(store_id, status, scheduled_at);
CREATE INDEX idx_charges_due             ON charges(store_id, status, due_date);
CREATE INDEX idx_tasks_due               ON tasks(store_id, status, due_date);
CREATE INDEX idx_appointments_scheduled  ON appointments(store_id, scheduled_at);
CREATE INDEX idx_clients_name_trgm       ON clients USING GIN(name_normalized gin_trgm_ops);
CREATE INDEX idx_aliases_trgm            ON client_aliases USING GIN(alias_normalized gin_trgm_ops);
CREATE INDEX idx_products_name_trgm      ON products USING GIN(name_normalized gin_trgm_ops);
```

### 4.4 Row Level Security (RLS)

```sql
-- Padrão para TODAS as tabelas com store_id:
ALTER TABLE stores       ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients      ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_aliases ENABLE ROW LEVEL SECURITY;
ALTER TABLE products     ENABLE ROW LEVEL SECURITY;
ALTER TABLE captures     ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales        ENABLE ROW LEVEL SECURITY;
ALTER TABLE sale_items   ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments     ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries   ENABLE ROW LEVEL SECURITY;
ALTER TABLE charges      ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks        ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs      ENABLE ROW LEVEL SECURITY;

-- stores: dono é dono
CREATE POLICY stores_owner ON stores
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- Padrão para tabelas filhas (exemplo: sales)
CREATE POLICY sales_store_isolation ON sales
  USING (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()))
  WITH CHECK (store_id IN (SELECT id FROM stores WHERE user_id = auth.uid()));

-- (replicar para todas as demais tabelas)
```

### 4.5 Manutenção e Retenção

```sql
-- Limpeza de ai_logs > 90 dias (executar via cron Supabase)
CREATE OR REPLACE FUNCTION cleanup_old_ai_logs()
RETURNS void AS $$
BEGIN
  DELETE FROM ai_logs WHERE created_at < now() - INTERVAL '90 days';
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Módulos do Sistema

### 5.1 Módulo: Inbox — Captura Rápida

#### 5.1.1 Conceito

O Inbox é a tela de entrada do sistema. Funciona como um chat com o sistema. A usuária digita qualquer coisa em texto livre e o sistema interpreta. É a única tela que **nunca pode ter fricção**.

#### 5.1.2 Componentes da Tela

| Componente | Comportamento |
|---|---|
| QuickInput | Campo sempre focado ao abrir. Expansível. Enter envia. Shift+Enter quebra linha. |
| FeedList | Lista reversa cronológica das capturas. Cards compactos com status da IA. |
| AIStatusIndicator | Ícone sutil no card: processando / classificado / requer revisão |
| QuickActions | Botões flutuantes: Venda, Entrega, Tarefa — captura estruturada opcional |
| ShareIncoming | Banner quando captura chega via Web Share API do WhatsApp |
| SyncIndicator | Status global de sync (canto superior) |

#### 5.1.3 Fluxo de Captura

1. Usuária digita ou cola texto no campo
2. Toca "Enviar" (ou pressiona Enter)
3. Cliente gera `client_op_id` (UUID v4) e grava no IndexedDB
4. Card aparece imediatamente na lista (optimistic UI)
5. Operação entra na `ops_queue` para sync
6. Edge Function `interpret-capture` processa em background
7. Pipeline: regex local → Gemini Flash → (se confiança < 0.6) Claude Haiku
8. Card atualiza com resultado da IA via Supabase Realtime
9. Usuária pode tocar no card para revisar/editar

#### 5.1.4 Regras de Negócio

- Captura nunca é bloqueada por falha de rede — vai para queue offline
- Texto mínimo: 2 caracteres. Sem limite máximo (warning > 4000 chars)
- Se IA falhar definitivamente, captura fica como `nota livre` — nunca é perdida
- Captura com confiança IA < 0.6 mostra badge "Revisar"
- Máximo de 2 retentativas automáticas de IA por captura
- Captura duplicada (mesmo `client_op_id`) é ignorada no servidor (idempotência)

### 5.2 Módulo: Hoje

#### 5.2.1 Conceito

Tela Hoje é o painel operacional diário. Abre ao iniciar o app. Deve dar à usuária a sensação de que ela sabe exatamente o que precisa fazer hoje sem navegar.

#### 5.2.2 Seções da Tela Hoje

| Seção | Conteúdo | Ordenação |
|---|---|---|
| Resumo do Dia | Total recebido / pendências / itens abertos | Fixo no topo |
| Entregas do Dia | `deliveries.scheduled_at = hoje` | Hora agendada |
| Compromissos | `appointments.scheduled_at = hoje` | Hora |
| Cobranças Vencidas | `charges.due_date <= hoje AND status=pending` | Valor desc |
| Tarefas do Dia | `tasks.due_date = hoje OR criadas hoje` | Prioridade |
| Pendências da Inbox | `captures.ai_status IN (review, failed)` | Recente |

#### 5.2.3 Ações Rápidas nos Cards

- Swipe direito: ação primária (marcar como entregue/pago/concluído)
- Swipe esquerdo: ação secundária (adiar, editar)
- Toque longo: menu contextual completo
- Toque simples: expandir detalhes inline

### 5.3 Módulo: Clientes

#### 5.3.1 Cadastro Automático

Clientes são criados automaticamente pela IA quando um nome é detectado e não há match. Cadastro manual completo é opcional.

#### 5.3.2 Ficha do Cliente

| Seção | Informações |
|---|---|
| Resumo | Saldo devedor, última compra, frequência |
| Histórico de Compras | Lista de vendas com valores e status |
| Cobranças | Pendentes + histórico de pagamentos |
| Entregas | Pendentes + histórico |
| Anotações | Notas livres |
| Aliases | Apelidos e variações reconhecidas |

#### 5.3.3 Fuzzy Matching de Clientes

- Trigram similarity via `pg_trgm` (threshold ≥ 0.6 para sugestão, ≥ 0.85 para auto-match)
- Busca em `clients.name_normalized` E `client_aliases.alias_normalized`
- Conflitos exibidos à usuária para confirmação
- Apelidos confirmados pela usuária são salvos como `client_aliases`

### 5.4 Módulo: Financeiro

#### 5.4.1 Visão Geral

Painel financeiro voltado para operação diária, não contabilidade. Foco: quanto entrou, quanto tenho a receber, quem deve quanto.

#### 5.4.2 Métricas Exibidas

| Métrica | Cálculo | Período |
|---|---|---|
| Total Recebido | `SUM(payments.amount) WHERE paid_at::date = X` | Hoje / Semana / Mês |
| A Receber | `SUM(sales.balance) WHERE status != 'paid'` | Acumulado |
| Fiado Total | `SUM(clients.balance)` | Acumulado |
| Ticket Médio | `AVG(sales.total) WHERE sale_date BETWEEN X AND Y` | Semana / Mês |
| Top Devedores | `clients ORDER BY balance DESC LIMIT 5` | Acumulado |

---

## 6. Motor de Inteligência Artificial

### 6.1 Visão Geral do Pipeline

O motor de IA é o diferencial técnico central. Transforma texto livre em operações organizadas. Pipeline em 4 fases:

| Fase | Operação | Tecnologia |
|---|---|---|
| 1. Pré-processamento | Normalização, detecção, limpeza | TypeScript local |
| 2. Triagem | Regex para padrões muito comuns | TypeScript local |
| 3. Interpretação | Classificação + extração de entidades | **Gemini Flash (primário) → Claude Haiku (fallback)** |
| 4. Pós-processamento | Resolução, validação, criação | TypeScript + Supabase |

### 6.2 Estratégia Híbrida Multi-Provider

| Provider | Quando Usa | Custo Aprox. | Latência |
|---|---|---|---|
| **Regex Local** | Padrões claros: "X pagou Y", "Entregar Z amanhã" | R$ 0 | < 10ms |
| **Gemini 2.5 Flash** | Captura padrão (90% dos casos) | ~R$ 0,40/1k caps | 800-1500ms |
| **Claude Haiku 4.5** | Confiança Gemini < 0.6, ou Gemini retorna erro | ~R$ 1,20/1k caps | 1000-2000ms |
| **Nota Livre** | Ambos falharem ou IA totalmente offline | R$ 0 | — |

### 6.3 Classificação de Intenções

| Intenção | Código | Exemplos de Input |
|---|---|---|
| Venda | `SALE` | "Renata 6 tintas 150" |
| Pagamento | `PAYMENT` | "Sara pagou 150 dinheiro" |
| Abatimento | `DEDUCTION` | "Abater 45 da Renata" |
| Pagamento Parcial | `PARTIAL_PAYMENT` | "Paula pagou 50 do saldo de 150" |
| Entrega | `DELIVERY` | "Entregar perfume da Paula amanhã" |
| Cobrança | `CHARGE` | "Cobrar saldo da Paula" |
| Tarefa | `TASK` | "Comprar caixas de presente" |
| Compromisso | `APPOINTMENT` | "Cliente Gláucia sexta às 14h" |
| Encomenda | `ORDER` | "Separar encomenda da Vanessa" |
| Observação | `NOTE` | "Orlando cesta crédito" |
| Estoque | `STOCK_NOTE` | "Comprar mais hidratante" |
| Desconhecida | `UNKNOWN` | — |

### 6.4 Extração de Entidades

| Entidade | Tipo | Exemplos | Tratamento |
|---|---|---|---|
| `client_name` | string | Renata, Paula, Gláucia | Trigram + aliases |
| `product` | string | tintas, perfume | Normalização |
| `quantity` | integer | 6, uma, meia dúzia | Conversão numérica |
| `amount` | decimal | 150, R$45, cinquenta | Normalização monetária |
| `date` | ISO date | amanhã, sexta, 15/06 | Resolução relativa |
| `time` | HH:MM | 14h, às 3 | Inferência AM/PM |
| `payment_method` | enum | dinheiro, pix, cartão, crédito | Map para enum |
| `payment_type` | enum | total, entrada, saldo, parcial | Inferência de pagamento |
| `is_partial_payment` | boolean | — | Inferência |

### 6.5 Prompt de Sistema (versionado)

> **Versão atual: `v1`** (registrada em `ai_logs.prompt_version` para A/B testing)

```
Você é o motor de interpretação do BeautyOps, um sistema operacional
para lojas de cosméticos no Brasil.

Analise o texto e retorne APENAS JSON válido conforme o schema:

{
  "intent": "<SALE|PAYMENT|PARTIAL_PAYMENT|DEDUCTION|DELIVERY|CHARGE|TASK|APPOINTMENT|ORDER|NOTE|STOCK_NOTE|UNKNOWN>",
  "confidence": <0.0 a 1.0>,
  "entities": {
    "client_name": "<string|null>",
    "product": "<string|null>",
    "quantity": <number|null>,
    "amount": <number|null>,
    "payment_method": "<cash|pix|card|credit|null>",
    "payment_type": "<full|entry|balance|partial|null>",
    "date": "<YYYY-MM-DD|null>",
    "time": "<HH:MM|null>",
    "is_partial_payment": <boolean>
  },
  "suggested_action": "<string descrevendo a operação>",
  "ambiguities": ["<lista de ambiguidades detectadas>"]
}

REGRAS:
1. Retorne APENAS o JSON. Sem texto antes ou depois. Sem markdown.
2. Datas relativas (amanhã, sexta) devem ser resolvidas para YYYY-MM-DD usando {current_date}.
3. Se identificar pagamento de valor parcial de uma dívida maior, use PARTIAL_PAYMENT.
4. Confiança baixa (< 0.6) é OBRIGATÓRIA se houver ambiguidade real.
5. Se não conseguir classificar, use UNKNOWN com confidence 0.0.

CONTEXTO:
- Data atual: {current_date}
- Loja: {store_name}
- Clientes conhecidos (top 20 por interação recente): {client_list_sample}

TEXTO A ANALISAR:
{user_text}
```

### 6.6 Estratégia de Custo e Cache

| Estratégia | Implementação | Economia Estimada |
|---|---|---|
| Triagem Regex | Padrões muito comuns ("X pagou Y") | 15-25% das chamadas |
| Cache Semântico | Hash normalizado (`sha256(lower(unaccent(text)))`) — reutiliza se idêntico | 10-15% |
| Provider primário barato | Gemini Flash padrão; Haiku só em fallback | ~60% vs. só Haiku |
| Batching | Aguarda 3s após última digitação | 30-40% |
| Retry inteligente | Retry só em erro de rede | Evita gasto duplo |

### 6.7 Auditoria e Monitoramento da IA

- Toda chamada gera `ai_logs` com: provider, modelo, prompt_version, tokens, latência, confiança, intent
- Dashboard interno: confiança média, distribuição de intents, taxa de fallback, taxa de revisão manual
- Alertas: confiança média < 0.75 por 24h, taxa de fallback > 30%
- A/B testing de prompts via `store.settings.ai_prompt_version`

### 6.8 Fallback de IA Indisponível

Se ambos os providers falharem (5xx, timeout > 8s):

1. Captura é salva com `ai_status = 'failed'`, `ai_provider = null`
2. Card mostra badge "Revisar manualmente"
3. Job em background tenta reprocessar a cada 1h (máx. 3 vezes / 24h)
4. Usuária pode disparar reprocessamento manual

---

## 7. Integração com WhatsApp

### 7.1 Estratégia de Integração

> **Princípio**: BeautyOps **não concorre** com o WhatsApp como canal de comunicação. Usa o WhatsApp como canal de **entrada de dados operacionais**.

### 7.2 WhatsApp → BeautyOps (Receber Dados)

#### 7.2.1 Share Target API (PWA)

```json
// public/manifest.webmanifest
{
  "share_target": {
    "action": "/inbox/share",
    "method": "POST",
    "enctype": "multipart/form-data",
    "params": {
      "title": "title",
      "text": "text",
      "url": "url"
    }
  }
}
```

#### 7.2.2 Fluxo Completo de Share

1. Usuária recebe mensagem de cliente no WhatsApp
2. Toca "Encaminhar/Compartilhar" → seleciona BeautyOps
3. Sistema recebe via `POST /inbox/share`
4. Texto entra no Inbox como captura com `source = 'share'`
5. IA processa e cria entidade
6. Aparece no Hoje se relevante para o dia

#### 7.2.3 Limitações por Plataforma

| Plataforma | Share Target | Alternativa |
|---|---|---|
| Android (Chrome PWA) | Suporte completo | — |
| iOS (Safari PWA) | Limitado | Atalho "Copiar + abrir BeautyOps" com paste automático (Clipboard API) |
| Desktop (Chrome) | Funciona via PWA instalada | Copiar/colar |

### 7.3 BeautyOps → WhatsApp (Enviar Dados)

#### 7.3.1 Templates de Compartilhamento

| Ação | Template |
|---|---|
| Cobrança | `Olá {nome}, seu saldo em aberto é de R$ {valor}. Qualquer dúvida, pode me chamar! 😊` |
| Resumo da Venda | `Venda registrada ✅\n{produto} — R$ {total}\nPago: R$ {pago} \| Restante: R$ {saldo}` |
| Entrega | `Sua encomenda está separada! 📦 Combinamos entrega {data}.` |
| Agendamento | `Lembrando: {nome}, temos horário confirmado {dia} às {hora}. Até lá! 💜` |

#### 7.3.2 Implementação

```typescript
function shareToWhatsApp(message: string, phone?: string): void {
  const encoded = encodeURIComponent(message);
  const base = phone
    ? `https://wa.me/${phone}?text=${encoded}`
    : `https://wa.me/?text=${encoded}`;
  window.open(base, '_blank');
}
```

### 7.4 Arquitetura Futura: WhatsApp Business API

Capacidades preparadas para Fase 2+:

| Capacidade | Caso de Uso |
|---|---|
| Webhook de mensagens | Captura automática sem ação |
| Templates aprovados Meta | Cobrança/lembrete automatizado |
| Chatbot básico | Resposta a FAQs |
| Confirmação de entrega | "Recebi" → marca entregue |

---

## 8. Estratégia Offline-First

### 8.1 Princípio

BeautyOps funciona 100% sem conexão para todas as operações de leitura e escrita. Sync é transparente e automático.

### 8.2 Camadas do Sistema Offline

| Camada | Tecnologia | Responsabilidade |
|---|---|---|
| Armazenamento Local | IndexedDB (Dexie.js) | Cópia local |
| Queue de Operações | IndexedDB (`ops_queue`) | Pendentes de sync |
| Service Worker | Workbox (Cache-First assets) | Cache + intercept |
| Background Sync | Background Sync API | Retry automático |
| Conflict Resolution | Last-Write-Wins por `version` + UI manual em conflitos detectados | Consistência eventual |

### 8.3 Schema do IndexedDB (Dexie)

```typescript
import Dexie, { Table } from 'dexie';

export const db = new Dexie('beautyops');
db.version(1).stores({
  captures:    '++id, store_id, ai_status, created_at, client_op_id',
  clients:     '++id, store_id, name_normalized',
  client_aliases: '++id, client_id, alias_normalized',
  products:    '++id, store_id, name_normalized',
  sales:       '++id, store_id, client_id, status, sale_date, client_op_id',
  sale_items:  '++id, sale_id',
  deliveries:  '++id, store_id, status, scheduled_at, client_op_id',
  charges:     '++id, store_id, client_id, status, due_date, client_op_id',
  tasks:       '++id, store_id, status, due_date, client_op_id',
  payments:    '++id, store_id, sale_id, client_op_id',
  appointments:'++id, store_id, scheduled_at, client_op_id',
  ops_queue:   '++id, table_name, operation, client_op_id, retry_count, synced_at',
});
```

### 8.4 Estrutura da `ops_queue`

```typescript
interface QueuedOp {
  id?: number;
  client_op_id: string;          // UUID v4 gerado no cliente — idempotência
  table_name: string;
  operation: 'insert' | 'update' | 'delete';
  entity_id: string;
  payload: unknown;
  base_version: number;          // versão local antes da operação
  created_at: string;
  retry_count: number;
  last_error?: string;
  synced_at?: string;
}
```

### 8.5 Fluxo de Sync

1. Usuária realiza ação (ex: marcar entrega concluída)
2. Atualização imediata no IndexedDB local (`version + 1`)
3. UI atualiza instantaneamente (optimistic)
4. Operação adicionada à `ops_queue` com `client_op_id`
5. Service Worker tenta sync com servidor
6. Servidor verifica `UNIQUE (store_id, client_op_id)` → idempotência
7. Servidor compara `base_version` com `version` atual:
   - Iguais: aceita update, incrementa version, retorna nova versão
   - Diferentes: conflito detectado → resposta com versão remota
8. Cliente decide:
   - Sem conflito: marca `synced_at`
   - Conflito LWW (default): aplica o mais recente por `updated_at`
   - Conflito flagged (campos críticos): UI de resolução manual

### 8.6 Indicadores de Status de Sync

| Estado | Indicador Visual | Comportamento |
|---|---|---|
| Online, sync ok | Nenhum | Padrão |
| Online, sync pendente | Ícone girando (sutil) | Informativo |
| Offline | Banner: "Modo offline — dados salvos localmente" | Não bloqueia |
| Conflito detectado | Badge no item + opção "Resolver" | Requer ação |
| Falha persistente | Toast: "Algumas operações não sincronizaram" | Não-bloqueante |

---

## 9. User Stories e Critérios de Aceitação

### 9.1 Épicos

| Épico | Código | Descrição |
|---|---|---|
| Captura Rápida | EP-01 | Anotar qualquer coisa em < 10 segundos |
| Tela Hoje | EP-02 | Visão operacional completa ao abrir o app |
| Clientes | EP-03 | Histórico e saldo de cada cliente |
| Financeiro | EP-04 | Controle de recebimentos e cobranças |
| Entregas | EP-05 | Gestão de entregas |
| IA / NLU | EP-06 | Interpretação automática de texto livre |
| Offline | EP-07 | Funcionamento completo sem conexão |
| WhatsApp | EP-08 | Integração de captura e compartilhamento |

### 9.2 User Stories — EP-01: Captura Rápida

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-01 | Operadora | Digitar texto livre e enviar com 1 toque | Registrar sem formulário |
| US-02 | Operadora | Encaminhar mensagem do WhatsApp | Capturar sem redigitar |
| US-03 | Operadora | Ver o que a IA entendeu | Corrigir se necessário |
| US-04 | Operadora | Captura salva mesmo sem internet | Não perder dados |

**Critérios de Aceitação — US-01:**
- Dado que estou no Inbox, quando digito texto e toco "Enviar", então o card aparece em < 300ms
- Dado que enviei captura, quando a IA processa, então o card é atualizado sem reload
- Dado que estou offline, quando envio captura, então é salva localmente com indicador "salvando..."

### 9.3 User Stories — EP-02: Tela Hoje

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-10 | Operadora | Ao abrir o app, ver entregas de hoje | Não esquecer clientes |
| US-11 | Operadora | Marcar entrega concluída com 1 swipe | Registrar sem interromper |
| US-12 | Operadora | Ver cobranças vencidas em destaque | Priorizar urgentes |
| US-13 | Operadora | Adiar tarefa para amanhã com 1 toque | Reorganizar rapidamente |

### 9.4 User Stories — EP-08: WhatsApp

| ID | Como... | Quero... | Para... |
|---|---|---|---|
| US-40 | Operadora | Encaminhar msg do WhatsApp para o app | Capturar pedido de cliente |
| US-41 | Operadora | Compartilhar cobrança via WhatsApp | Enviar para o cliente |
| US-42 | Operadora | Compartilhar resumo de venda | Confirmar pedido |

---

## 10. Roadmap e MVP

### 10.1 MVP — Escopo Enxuto (4 semanas)

> **Critério do MVP**: usuária consegue capturar texto livre, ter venda + cliente + cobrança criados automaticamente pela IA, ver tudo no Hoje, marcar pagamento, tudo funcionando offline e no Android dela.

| Módulo | Entregável MVP | Prioridade |
|---|---|---|
| Auth | Email e senha via Supabase Auth + sessão | P0 |
| Inbox | Captura + IA híbrida (Gemini→Haiku→Regex) | P0 |
| Tela Hoje | Vendas + Cobranças + Resumo | P0 |
| Clientes | Auto-criação + fuzzy match + ficha | P0 |
| Vendas | Criação via IA + marcar pagamento | P0 |
| Cobranças | Geração automática + marcar pago | P0 |
| Offline | Captura + sync com idempotência | P0 |
| PWA | Instalável Android + iOS | P0 |
| Share Target | Receber texto do WhatsApp (Android) | P0 |
| Share para WA | Compartilhar cobrança via deep link | P0 |
| Financeiro v1 | Resumo: entradas do dia/semana | P1 |

**Fora do MVP** (Fase 2): Entregas, Tarefas, Compromissos, Catálogo de Produtos, Reconhecimento de voz, Push notifications, Multi-usuária.

### 10.2 Pós-MVP — Fase 2 (3-4 meses após MVP)

| Feature | Descrição | Valor |
|---|---|---|
| Entregas | Módulo completo + ETA | Operacional |
| Tarefas + Compromissos | Calendar lite | Organização |
| Reconhecimento de Voz | Captura por áudio (Whisper) | Hands-free |
| Relatórios Avançados | Vendas por período, top produtos | Estratégico |
| Catálogo de Produtos | Cadastro + preços + estoque básico | Automação |
| Push Notifications | Lembretes operacionais | Zero esquecimento |
| Histórico de IA | Dashboard de precisão + A/B prompts | Melhoria contínua |
| Multi-usuária | Funcionária + Proprietária | Escalabilidade |

### 10.3 Visão de Longo Prazo (12+ meses)

- WhatsApp Business API (webhook + templates)
- IA preditiva: reposição de estoque, clientes inativos
- App nativo React Native para performance máxima
- Marketplace: Mercado Livre, Instagram Shopping
- Multi-loja: proprietária com várias unidades

### 10.4 Cronograma MVP (4 Semanas)

| Sprint | Semana | Entregáveis |
|---|---|---|
| **F0** | Pré-sprint (3-5 dias) | Setup infra, ADRs, Design System, prompts IA |
| **F1** | 1 | Walking Skeleton: Auth + Inbox + IA happy path |
| **F2** | 2 | Núcleo: Clientes + Vendas + Hoje (resumo+vendas) |
| **F3** | 3 | Cobranças + Hoje completo + Financeiro v1 |
| **F4** | 4 | Offline real + PWA + Share Target + Polish + LGPD |

> Detalhamento por tarefa em **§17 Definition of Done por Fase**.

---

## 11. Métricas, Monitoramento e Observabilidade

### 11.1 KPIs do Produto

| KPI | Definição | Ferramenta | Alerta se |
|---|---|---|---|
| DAU | Usuárias ativas/dia | Supabase + PostHog | Queda > 20% s-a-s |
| Capturas/DAU | Média por usuária/dia | Custom events | < 5/dia |
| IA Accuracy | % capturas sem edição | `ai_logs` | < 80% |
| Sync Failure Rate | % ops que falham | `ops_queue` retry | > 2% |
| P95 Latência IA | Percentil 95 resposta IA | `ai_logs.latency_ms` | > 3000ms |
| App Crash Rate | % sessões com erro JS | Sentry | > 0.5% |
| Fallback Rate | % capturas que caem em Haiku | `ai_logs.fallback_used` | > 30% |

### 11.2 Stack de Observabilidade

| Ferramenta | Uso |
|---|---|
| Sentry | Errors frontend + Edge Functions |
| Vercel Analytics | Core Web Vitals, traffic |
| Supabase Dashboard | Query perf, connection pool |
| PostHog (free) | Product analytics, funnels, feature flags |
| `ai_logs` table | Métricas completas de IA |

### 11.3 CI/CD Pipeline

```yaml
# .github/workflows/deploy.yml
on:
  push:
    branches: [main]
jobs:
  quality:
    steps:
      - TypeScript type check (tsc --noEmit)
      - ESLint (zero warnings)
      - Unit tests (Vitest) — cobertura mínima 70%
      - E2E smoke tests (Playwright)
  deploy:
    needs: quality
    steps:
      - Vercel preview (branches)
      - Vercel production (main)
      - Supabase migrations via CLI
  post-deploy:
    steps:
      - Lighthouse CI (LCP < 2.5s, CLS < 0.1)
      - Sentry release tracking
```

### 11.4 Estimativa de Custos Mensais (MVP — 100 usuárias ativas)

> Recalibrada para refletir: 150k tokens/dia de captura real é otimista; 100 usuárias × 15 capturas/dia × ~200 tokens prompt + ~150 output ≈ 525k tokens/dia.

| Serviço | Plano | Custo/mês |
|---|---|---|
| Vercel | Hobby → Pro se necessário | US$ 0 — 20 |
| Supabase | Pro (após free tier) | US$ 25 |
| Gemini 2.5 Flash | ~70% das chamadas, ~370k tokens/dia | US$ 5 — 12 |
| Claude Haiku 4.5 (fallback) | ~10% das chamadas | US$ 5 — 10 |
| Sentry | Free tier | US$ 0 |
| PostHog | Free tier | US$ 0 |
| **TOTAL** | | **US$ 35 — 67/mês** |

Com regex local cobrindo ~20% e cache ~10%, redução adicional possível de 25-30%.

---

## 12. Riscos Técnicos e Mitigações

| Risco | Probabilidade | Impacto | Mitigação |
|---|---|---|---|
| IA interpreta mal textos ambíguos | Alta | Médio | Confiança mínima + UI de revisão + fallback para nota livre |
| Share Target não funciona iOS | Certa | Médio | Fluxo alternativo com Clipboard API |
| Conflitos de sync em uso simultâneo | Média | Alto | LWW + `version` + UI de resolução |
| Custo de IA escala com uso | Média | Alto | Regex local + cache + provider barato primário |
| Performance ruim em low-end | Alta | Alto | Virtualization + lazy loading + target Android 8+ 3GB |
| Adoção bloqueada por curva | Média | Alto | Onboarding com 3 exemplos + sem cadastro obrigatório |
| Custo Supabase escala (`ai_logs`) | Baixa | Baixo | Retenção 90 dias + cleanup automatizado |
| Gemini fica indisponível | Baixa | Alto | Fallback Haiku automático + retry job |
| Vendor lock-in IA | Média | Médio | Abstração `AIProvider` interface — trocar é mudar 1 arquivo |

---

## 13. Segurança e Conformidade

### 13.1 Autenticação e Autorização

- Supabase Auth (email e senha)
- JWT expiração 1h + refresh token rotativo
- Cada loja é tenant isolado via RLS
- Service Role key **nunca** no cliente
- ANON key com permissões mínimas

### 13.2 Proteção de Dados

- Dados de clientes (nomes, telefones) apenas no Supabase (região SA East 1 — São Paulo)
- Textos enviados para IA: PII anonimizada quando possível (substituição de nomes por placeholders no prompt, mantendo no cliente)
- Retenção: `ai_logs` 90 dias; dados operacionais permanentes
- Backup automático (Point-in-Time Recovery no Pro)

### 13.3 LGPD — Conformidade

| Requisito LGPD | Implementação |
|---|---|
| Base legal | Execução de contrato (operação da loja da titular) |
| Consentimento | Tela no primeiro acesso aceitando ToS + Política de Privacidade |
| Direito de acesso | `GET /api/export` retorna ZIP com todos os dados em JSON |
| Direito de exclusão | Botão "Excluir conta" → cascade delete via RLS |
| Anonimização | Nomes substituídos por hash em prompts para IA quando possível |
| DPO | Email de contato (`dpo@beautyops.app`) na Política de Privacidade |
| Registro de operações | Tabela `audit_logs` (Fase 2) registrando acessos e modificações |
| Política de Privacidade | Página `/privacidade` explicando uso de IA, transferência internacional (Anthropic US, Google US) |
| Transferência internacional | Cláusulas-padrão da ANPD nos contratos com provedores |

---

## 14. UX Guidelines e Navegação

### 14.1 Estrutura de Navegação

| Tab | Ícone | Conteúdo |
|---|---|---|
| Hoje | Calendário | Painel diário |
| Inbox | Mensagem | Captura + histórico |
| Clientes | Pessoas | Lista + busca |
| Financeiro | Gráfico | Resumo + cobranças |

### 14.2 Gestos e Interações Mobile

| Gesto | Ação |
|---|---|
| Swipe → direita | Ação primária (pago/entregue/concluído) |
| Swipe → esquerda | Ação secundária (adiar/editar) |
| Toque longo | Menu contextual |
| Pull-to-refresh | Sync manual |
| Tap FAB (+) | Abrir Inbox |

### 14.3 Performance Targets

| Métrica | Target | Crítico se |
|---|---|---|
| First Contentful Paint | < 1.5s | > 3s |
| Largest Contentful Paint | < 2.5s | > 4s |
| Time to Interactive | < 3s | > 5s |
| Cumulative Layout Shift | < 0.1 | > 0.25 |
| Input response | < 100ms | > 300ms |
| IA response P50 | < 1.5s | > 4s |

---

## 15. Diretrizes para IA Codificadora

> Esta seção é **crítica** para execução com Codex / Claude Code / Cursor / Gemini. Inclua o arquivo `CLAUDE.md` / `.cursorrules` / `AGENTS.md` na raiz do projeto.

### 15.1 Regras Globais (sempre aplicáveis)

```markdown
# REGRAS — BeautyOps

Você é uma IA codificadora trabalhando no BeautyOps, um app mobile-first
PWA para lojas de cosméticos. Siga ESTAS regras sem exceção:

## STACK FIXA
- Vite + React 19 + TypeScript 5 strict
- Tailwind CSS 4 + shadcn/ui
- Supabase (Postgres + Auth + Edge Functions Deno)
- Dexie.js para IndexedDB
- TanStack Query v5 + Zustand
- Zod para validação de toda entrada externa
- Workbox para Service Worker

## NUNCA FAÇA
- Não use Next.js, Remix, ou qualquer framework SSR
- Não use Redux, MobX, ou outro state manager
- Não use axios ou fetch direto — use TanStack Query + supabase-js
- Não use moment.js — use date-fns
- Não use CSS Modules ou styled-components — só Tailwind
- Não use any em TypeScript — sempre tipo específico ou unknown + narrowing
- Não use console.log em código de produção — use logger abstraído
- Não use localStorage para dados de domínio — use IndexedDB (Dexie)
- Não crie wizards ou formulários multi-etapa no Inbox
- Não adicione loading spinners bloqueantes na tela principal
- Não invente nomes de tabelas — consulte §4.1 do PRD

## SEMPRE FAÇA
- Validação Zod em toda entrada externa (API, IA, formulário)
- Result<T, E> em toda função que pode falhar
- Branded types para IDs (ClientId, SaleId, etc)
- Optimistic update com rollback em mutações
- client_op_id (UUID v4) em toda operação de escrita
- Versionamento de prompt em chamadas IA
- Testes Vitest junto com o código (mesma feature folder)
- ARIA labels e roles em componentes interativos
- Mobile-first: design 360px primeiro, escalar depois

## PADRÃO DE COMMIT (Conventional Commits)
- feat(capture): add voice input
- fix(sync): handle conflict on payment update
- chore(deps): bump dexie to 4.0.0
- docs(prd): update AI cost estimate

## FLUXO DE TRABALHO
1. Ler o PRD seção relevante ANTES de codar
2. Criar branch feat/F{fase}-{tarefa-curta}
3. Codar mantendo testes verde a cada commit
4. Abrir PR com checklist de DoD da fase
5. Aguardar aprovação manual antes de merge em main
```

### 15.2 Prompt System para Sessões Codex/Cursor

```
Contexto: Você está codificando o BeautyOps, um PWA mobile-first
para lojas de cosméticos. Leia o PRD em /docs/PRD.md antes de
qualquer mudança estrutural.

Sua tarefa atual: {descrição}
Fase atual: {F0|F1|F2|F3|F4}
Definition of Done: §17.{fase} do PRD

Regras inegociáveis: §15.1 do PRD

Antes de codar:
1. Quais arquivos serão criados/modificados? Liste.
2. Quais testes serão adicionados? Liste.
3. Há decisão arquitetural não coberta pelo PRD? Pare e pergunte.

Se identificar ambiguidade no PRD, NÃO assuma — pergunte.
Se identificar conflito entre tarefa e regras §15.1, regras vencem.
```

### 15.3 Estrutura de Documentação no Repo

```
docs/
├── PRD.md                    # Este documento
├── ADRs/                     # Architecture Decision Records
│   ├── 0001-stack-vite-react.md
│   ├── 0002-offline-first.md
│   ├── 0003-ai-hybrid-provider.md
│   ├── 0004-idempotency-via-client-op-id.md
│   └── 0005-sync-conflict-resolution.md
├── prompts/                  # Versões de prompts da IA
│   ├── interpret-capture-v1.md
│   └── interpret-capture-v2.md  (futuro A/B)
└── runbooks/
    ├── deploy.md
    ├── on-call.md
    └── ai-fallback.md

CLAUDE.md                     # Cópia de §15.1 + §15.2 — auto-carregada
.cursorrules                  # Mesmo conteúdo, formato Cursor
AGENTS.md                     # Mesmo conteúdo, formato OpenAI Codex
```

### 15.4 Tarefas-Tipo e Templates

#### Adicionar nova intenção da IA
1. Atualizar `src/features/ai/intents.ts` (enum + Zod schema)
2. Atualizar prompt em `docs/prompts/interpret-capture-v{N+1}.md`
3. Adicionar branch de pós-processamento em `src/features/ai/pipeline.ts`
4. Adicionar caso de teste em `src/features/ai/pipeline.test.ts`
5. Bumpar `prompt_version` em `src/features/ai/config.ts`
6. PR com 5+ exemplos reais cobertos

#### Adicionar nova tabela
1. Criar migration `supabase/migrations/YYYYMMDDHHmm_add_{table}.sql`
2. Adicionar trigger `updated_at` + coluna `version` + `client_op_id UNIQUE`
3. Adicionar RLS policy seguindo padrão `{table}_store_isolation`
4. Adicionar store no schema Dexie (incrementar version)
5. Adicionar Zod schema em `src/shared/schemas/`
6. Adicionar branded type para ID em `src/shared/types/`

---

## 16. Architecture Decision Records (ADRs)

> Cada ADR vive em `/docs/ADRs/`. Resumos abaixo.

### ADR-0001: Stack Frontend — Vite + React 19

**Status**: Aceito (Maio/2026)

**Contexto**: O PRD v2 propunha Next.js 15 App Router. Outros projetos do autor (FinanceiroJe, Esdra Cosméticos) usam Vite + React + Supabase + Vercel.

**Decisão**: Adotar Vite + React 19 + React Router v6.

**Consequências**:
- ✅ Consistência com outros projetos (curva zero)
- ✅ Build mais rápido em dev
- ✅ Service Worker mais simples (sem complexidade do App Router)
- ✅ Menor superfície de bugs em PWA offline
- ❌ Sem SSR (não é requisito — app autenticado)
- ❌ Sem Server Actions (não é requisito — Edge Functions cobrem)

### ADR-0002: Offline-First com IndexedDB + ops_queue

**Status**: Aceito

**Contexto**: Conectividade 4G instável da persona Josefa.

**Decisão**: Toda operação grava localmente primeiro (IndexedDB via Dexie), sincroniza em background via Service Worker + Background Sync API.

**Consequências**:
- ✅ App funciona 100% offline
- ✅ Latência percebida de 0ms para todas as ações
- ❌ Complexidade de conflict resolution
- ❌ Espaço de armazenamento no dispositivo

### ADR-0003: IA Híbrida — Gemini Flash + Claude Haiku + Regex

**Status**: Aceito

**Contexto**: PRD v2 propunha só Claude Haiku. Gemini Flash é 3x mais barato com qualidade comparável para tarefas estruturadas. Regex local cobre padrões repetitivos sem custo.

**Decisão**: Pipeline de 3 níveis:
1. **Regex local** para padrões muito comuns
2. **Gemini 2.5 Flash** como primário
3. **Claude Haiku 4.5** como fallback (confiança baixa ou erro)

**Consequências**:
- ✅ Custo reduzido em ~60% vs. só Haiku
- ✅ Redundância: se Gemini cair, Haiku assume
- ✅ Latência local em ~20% dos casos (regex)
- ❌ Complexidade de manter dois prompts em paralelo
- ❌ Possível inconsistência de output entre providers (mitigado por Zod validation no output)

### ADR-0004: Idempotência via client_op_id

**Status**: Aceito

**Contexto**: Operações offline podem ser reenviadas múltiplas vezes durante retry. Sem idempotência → duplicação de vendas, pagamentos.

**Decisão**: Toda escrita carrega `client_op_id` (UUID v4 gerado no cliente). Servidor tem `UNIQUE (store_id, client_op_id)` em cada tabela.

**Consequências**:
- ✅ Reenvios seguros
- ✅ Sync robusto contra falhas de rede no meio do request
- ❌ Coluna extra em cada tabela
- ❌ Cliente precisa gerar UUID corretamente

### ADR-0005: Conflict Resolution — LWW por version + UI Manual

**Status**: Aceito

**Contexto**: Multiusuária em loja com proprietária + funcionária. Sync simultâneo pode gerar conflitos.

**Decisão**:
- Toda tabela tem coluna `version` (incrementada por trigger)
- Cliente envia `base_version` no update
- Servidor compara: se igual, aceita; se diferente, retorna versão remota
- Cliente aplica LWW por `updated_at` (default)
- **Exceção**: campos críticos (`sales.total`, `payments.amount`) → UI de resolução manual

**Consequências**:
- ✅ Convergência eventual garantida
- ✅ Casos críticos preservam intervenção humana
- ❌ Lógica de cliente mais complexa
- ❌ Mensagens "conflito" precisam ser claras para a usuária

---

## 17. Definition of Done por Fase

### F0 — Fundação (3-5 dias)

- [ ] Repo Git criado com README, LICENSE, CONTRIBUTING
- [ ] Vite + React 19 + TS strict + ESLint + Prettier + Husky funcionando
- [ ] Supabase project criado (região SA East 1)
- [ ] Migration inicial com TODAS as tabelas do §4.2
- [ ] RLS policies em TODAS as tabelas
- [ ] Triggers `updated_at` + `version` em todas tabelas mutáveis
- [ ] Vercel project conectado com deploys de preview
- [ ] `.env.example` documentado (sem valores reais)
- [ ] Variáveis de ambiente configuradas em Vercel
- [ ] Design System: tokens em Tailwind config + 6 componentes base
- [ ] ADRs 0001-0005 documentados em `/docs/ADRs/`
- [ ] `CLAUDE.md`, `.cursorrules`, `AGENTS.md` na raiz
- [ ] Sentry projeto criado e SDK instalado
- [ ] PostHog projeto criado

### F1 — Walking Skeleton (Semana 1)

- [ ] Auth por email e senha funcionando ponta a ponta
- [ ] Rota `/hoje` protegida (redirect para `/auth` se anônimo)
- [ ] Tela Inbox: `QuickCaptureInput` + lista local
- [ ] Schema Dexie completo + sync inicial (pull de servidor)
- [ ] Edge Function `interpret-capture` (Gemini Flash) deployada
- [ ] Pipeline completo: captura → Edge Function → atualização via Realtime
- [ ] Optimistic UI com rollback em erro
- [ ] Testes Vitest: pipeline IA (mock providers) — 5 casos felizes
- [ ] Lighthouse mobile score ≥ 80
- [ ] **DoD ponta a ponta**: capturar texto → IA classifica → card atualiza em < 8s

### F2 — Núcleo (Semana 2)

- [ ] Tabela `clients` + auto-criação via IA
- [ ] Fuzzy match com `pg_trgm` (threshold 0.6 sugestão / 0.85 auto-match)
- [ ] Ficha de cliente: resumo + histórico de vendas
- [ ] Tabela `sales` + criação via IA
- [ ] Tabela `payments` + registro vinculado a venda
- [ ] Swipe direita em venda aberta → marcar pago
- [ ] Tela Hoje v1: Resumo + Seção Vendas
- [ ] Cache semântico de IA (hash + lookup local)
- [ ] Regex fallback para 5 padrões mais comuns
- [ ] Testes E2E Playwright: fluxo "capturar venda → marcar pago"
- [ ] **DoD ponta a ponta**: registrar venda por texto, ver cliente criado, marcar pago, ver no Hoje

### F3 — Operação Completa (Semana 3)

- [ ] Tabela `charges` + geração automática por trigger quando `sales.balance > 0 AND due_date IS NOT NULL`
- [ ] Tela Hoje v2: + Cobranças Vencidas + Pendências do Inbox
- [ ] Compartilhar cobrança via WhatsApp (`wa.me` deep link)
- [ ] Financeiro v1: Total Recebido (hoje/semana/mês) + A Receber + Top Devedores
- [ ] Tratamento de pagamento parcial via IA (intent `PARTIAL_PAYMENT`)
- [ ] Dashboard interno de IA em `/admin/ai-metrics` (gated por role)
- [ ] **DoD ponta a ponta**: capturar "Paula pagou 50 do saldo de 150" → registra payment parcial + ajusta cobrança

### F4 — Offline Real + PWA + Polish (Semana 4)

- [ ] `ops_queue` com `client_op_id` implementada
- [ ] Service Worker (Workbox) + Background Sync API
- [ ] Conflict resolution LWW + UI manual para campos críticos
- [ ] Indicador visual de sync (4 estados de §8.6)
- [ ] PWA manifest.webmanifest + ícones (192, 512, maskable)
- [ ] Instalação como PWA testada em Android + iOS
- [ ] Share Target API + rota `/inbox/share`
- [ ] Fallback iOS: Clipboard API + atalho
- [ ] Templates de mensagem WhatsApp implementados
- [ ] Onboarding com 3 exemplos práticos
- [ ] LGPD: página `/privacidade`, exportação de dados, exclusão de conta
- [ ] Lighthouse mobile score ≥ 90 em todas as rotas
- [ ] Cobertura de testes ≥ 70% nas pastas `features/`
- [ ] **DoD ponta a ponta**: usuária faz dia inteiro offline + sync funciona + dados não duplicam após restart

---

## 18. Glossário

| Termo | Definição |
|---|---|
| Capture | Anotação em texto livre feita pela usuária no Inbox |
| Intent | Classificação detectada pela IA (`SALE`, `DELIVERY`, `TASK`...) |
| Entity | Dado extraído pela IA (cliente, valor, data, produto) |
| Confidence | Score 0-1 de certeza da classificação |
| `client_op_id` | UUID v4 gerado no cliente para idempotência |
| `version` | Inteiro server-side incrementado por trigger — base para LWW |
| Ops Queue | Fila local de operações pendentes de sync |
| Share Target | Recurso PWA que faz o app aparecer no share sheet do SO |
| Fuzzy Match | Correspondência aproximada de strings (`pg_trgm` para PT-BR) |
| Branded Type | Tipo TypeScript com marca nominal para evitar mistura de IDs |
| RLS | Row Level Security — isolamento por usuário no PostgreSQL |
| LWW | Last Write Wins — estratégia de resolução de conflitos |
| ADR | Architecture Decision Record |
| DoD | Definition of Done |
| PII | Personally Identifiable Information |
| Fallback Rate | % de chamadas IA que precisaram cair no provider secundário |

---

*BeautyOps PRD v3.0 — Confidencial — Uso Interno*
*Autor: Josemar de Paula | Maio/2026*
