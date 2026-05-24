# ARCHITECTURE.md — AgendaEC

Última revisão: 2026-05-13  
Status: MVP alinhado ao PRD v1.1

---

# Objetivo

Definir a arquitetura oficial do MVP do AgendaEC.

---

# Princípios arquiteturais

- simplicidade
- previsibilidade
- baixo custo operacional
- stack dominada
- evolução incremental
- debugging rápido
- mobile first

---

# Stack Oficial

## Frontend

- Next.js 14 (App Router)
- TypeScript 5
- Tailwind CSS 3
- shadcn/ui

## Backend

- Supabase (Supabase JS 2 + Edge Functions)

## Banco de dados

- PostgreSQL (gerenciado pelo Supabase)

## Estado global

- Zustand 5

## Cache/Sync

- TanStack Query 5 (recomendado, não obrigatório no Sprint 1)

## IA

- OpenAI GPT-4o mini (via Edge Function proxy)

## PWA / Offline

- Web Share Target API
- Workbox (Service Worker)
- IndexedDB (fila offline)

## WhatsApp

- `wa.me` deep links (oficiais, gratuitos)

## Deploy

- Vercel

---

# Estrutura Geral

```text
Frontend PWA (Next.js 14)
↓
Stores Zustand (com persist em localStorage)
↓
Supabase Client (Auth + DB + Edge Functions)
↓
PostgreSQL + Auth + RLS
↓
OpenAI API (via Edge Function proxy)
```

---

# Autenticação

## Método oficial

Magic link (email OTP) via Supabase Auth:

```ts
supabase.auth.signInWithOtp({ email })
```

## Regras

- não copiar tokens manualmente para `localStorage`
- não copiar tokens manualmente para `sessionStorage`
- não expor tokens em logs
- `authStore` não é persistida
- novos usuários cadastrados manualmente

---

# Perfis de usuário

- owner
- staff
- viewer

---

# PWA

## Manifest

```json
{
  "name": "AgendaEC",
  "short_name": "AgendaEC",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#F9FAFB",
  "theme_color": "#8B5CF6"
}
```

## Web Share Target API

- rota receptora: `/inbox/share`
- recebe POST do sistema operacional
- compartilhamento vindo do WhatsApp

---

# Banco de Dados

## Convenções obrigatórias

- todas as tabelas possuem `store_id`
- RLS obrigatório em todas as tabelas
- soft delete via `deleted_at` quando aplicável
- `CHECK` constraints em enums textuais e valores numéricos
- timestamps com `TIMESTAMPTZ`
- valores monetários em `DECIMAL(10,2)`

---

## Tabela stores

```sql
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela store_users

```sql
CREATE TABLE store_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  role TEXT DEFAULT 'staff'
    CHECK (role IN ('owner', 'staff', 'viewer')),
  name TEXT,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE (store_id, user_id)
);
```

---

## Tabela clients

```sql
CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  name TEXT NOT NULL,
  phone TEXT,
  tags TEXT[] DEFAULT '{}',
  notes TEXT,
  balance DECIMAL(10,2) DEFAULT 0,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela entries

```sql
CREATE TABLE entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  created_by UUID REFERENCES auth.users,
  raw_text TEXT NOT NULL,
  origin TEXT DEFAULT 'manual'
    CHECK (origin IN ('manual', 'whatsapp_share', 'audio')),
  type TEXT
    CHECK (type IN ('sale', 'payment', 'delivery', 'task', 'appointment', 'free_note')),
  status TEXT DEFAULT 'pending'
    CHECK (status IN ('pending', 'processing', 'confirmed', 'free_note')),
  ai_metadata JSONB,
  confidence FLOAT
    CHECK (confidence >= 0 AND confidence <= 1),
  linked_id UUID,
  linked_table TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela sales

```sql
CREATE TABLE sales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  client_id UUID REFERENCES clients,
  entry_id UUID REFERENCES entries,
  description TEXT,
  total_amount DECIMAL(10,2) NOT NULL
    CHECK (total_amount >= 0),
  paid_amount DECIMAL(10,2) DEFAULT 0
    CHECK (paid_amount >= 0),
  status TEXT DEFAULT 'confirmed'
    CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  notes TEXT,
  origin TEXT DEFAULT 'manual',
  sale_date DATE DEFAULT CURRENT_DATE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela payments

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  sale_id UUID REFERENCES sales,
  client_id UUID REFERENCES clients,
  amount DECIMAL(10,2) NOT NULL
    CHECK (amount > 0),
  payment_method TEXT,
  notes TEXT,
  payment_date DATE DEFAULT CURRENT_DATE,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

> **Regra:** nunca utilizar `DELETE` físico em registros financeiros (ver AGENTS.md, README.md e DEC-010). Um pagamento cancelado por engano deve ter `deleted_at` preenchido — jamais ser removido permanentemente do banco.

---

## Tabela deliveries

```sql
CREATE TABLE deliveries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  sale_id UUID REFERENCES sales,
  client_id UUID REFERENCES clients,
  description TEXT NOT NULL,
  address TEXT,
  scheduled_date DATE,
  scheduled_time TIME,
  status TEXT DEFAULT 'scheduled'
    CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
  notified_wa BOOLEAN DEFAULT false,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela tasks

```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  created_by UUID REFERENCES auth.users,
  title TEXT NOT NULL,
  priority TEXT DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high')),
  category TEXT,
  due_date DATE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMPTZ,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela appointments

```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  client_id UUID REFERENCES clients,
  title TEXT NOT NULL,
  date DATE NOT NULL,
  time TIME,
  notes TEXT,
  notified_wa BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela products

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  name TEXT NOT NULL,
  sku TEXT,
  price DECIMAL(10,2),
  stock_quantity INTEGER DEFAULT 0,
  min_stock INTEGER DEFAULT 0,
  category TEXT,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela wa_messages

```sql
CREATE TABLE wa_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  client_id UUID REFERENCES clients,
  sent_by UUID REFERENCES auth.users,
  linked_id UUID,
  linked_table TEXT,
  template TEXT,
  message_text TEXT NOT NULL,
  phone TEXT NOT NULL,
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela wa_templates

```sql
CREATE TABLE wa_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## Tabela daily_closings

```sql
CREATE TABLE daily_closings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores NOT NULL,
  closing_date DATE NOT NULL,
  total_sales DECIMAL(10,2),
  total_cash DECIMAL(10,2),
  total_pix DECIMAL(10,2),
  total_card DECIMAL(10,2),
  total_fiado DECIMAL(10,2),
  summary_data JSONB,
  confirmed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(store_id, closing_date)
);
```

---

## Tabela audit_logs

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID REFERENCES stores,
  user_id UUID REFERENCES auth.users,
  action TEXT NOT NULL,
  table_name TEXT,
  record_id UUID,
  old_data JSONB,
  new_data JSONB,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

# Triggers

## Função updated_at

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

## Triggers por tabela

```sql
CREATE TRIGGER update_clients_updated_at
  BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sales_updated_at
  BEFORE UPDATE ON sales
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_deliveries_updated_at
  BEFORE UPDATE ON deliveries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wa_templates_updated_at
  BEFORE UPDATE ON wa_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_appointments_updated_at
  BEFORE UPDATE ON appointments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

---

# Índices recomendados

> Todos os índices de listagem são **parciais** (`WHERE deleted_at IS NULL`) para evitar varredura de registros excluídos logicamente em tabelas com volume crescente.

```sql
CREATE INDEX idx_clients_store_name
  ON clients (store_id, name)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_sales_store_date
  ON sales (store_id, sale_date DESC)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_tasks_store_due
  ON tasks (store_id, due_date)
  WHERE deleted_at IS NULL;

CREATE INDEX idx_entries_store_created
  ON entries (store_id, created_at DESC);

CREATE INDEX idx_payments_store_date
  ON payments (store_id, payment_date DESC)
  WHERE deleted_at IS NULL;
```

---

# Row Level Security (RLS)

## Habilitação obrigatória

```sql
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
```

---

## Política base

```sql
CREATE POLICY "acesso_por_loja" ON clients
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid()
      AND active = true
  )
);

-- Aplicar a mesma lógica em:
-- store_users, entries, sales, payments, deliveries,
-- tasks, appointments, wa_messages, wa_templates,
-- daily_closings, audit_logs
```

---

## Política específica para a tabela stores

A tabela `stores` é a raiz do schema e não possui `store_id` — ela mesma é a entidade raiz. Por isso, a política base acima não se aplica a ela. Uma policy separada é obrigatória.

```sql
-- Leitura: usuário autenticado que pertence à loja (via store_users) ou que é o owner direto
CREATE POLICY "stores_leitura" ON stores
FOR SELECT USING (
  id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid()
      AND active = true
  )
  OR owner_id = auth.uid()
);

-- Escrita (INSERT/UPDATE/DELETE): restrita ao owner da loja
CREATE POLICY "stores_escrita" ON stores
FOR ALL USING (
  owner_id = auth.uid()
)
WITH CHECK (
  owner_id = auth.uid()
);
```

> **Atenção:** sem essa policy, qualquer usuário autenticado poderia ler ou escrever registros de lojas alheias assim que o RLS for ativado sem a restrição correta.

---

## Política específica para audit_logs

A lógica padrão por `store_id` é inadequada para logs de auditoria. Staff não deve poder ler os logs de outros staff. A escrita deve ocorrer exclusivamente via `service_role` ou trigger — nunca diretamente pelo cliente.

```sql
-- Leitura: restrita ao owner da loja
CREATE POLICY "audit_logs_leitura_owner" ON audit_logs
FOR SELECT USING (
  store_id IN (
    SELECT id FROM stores
    WHERE owner_id = auth.uid()
  )
);

-- Escrita: bloqueada para todos os roles de usuário final.
-- Inserção realizada exclusivamente via service_role (triggers ou Edge Functions).
-- Nenhuma policy FOR INSERT/UPDATE/DELETE é criada para roles de usuário.
```

> **Nota de implementação:** ao chamar a Edge Function que gera logs, utilize o `supabaseAdmin` (service role key), nunca o client autenticado.

---

# Offline e Sync

## Estratégia oficial

- persistência local simples
- fila de mutações (`PendingMutation[]`)
- retry simples
- sincronização automática ao reconectar
- Last Write Wins (LWW)

---

## NÃO implementar

- CRDT
- merge inteligente
- rollback visual
- resolução avançada de conflitos

---

# IA

## Pipeline oficial

1. Texto recebido
2. Contexto adicional enviado
3. OpenAI processa
4. Backend valida JSON
5. Frontend exibe preview
6. Usuária confirma ou ajusta
7. Persistência no banco

---

## Regras obrigatórias

- IA sempre retorna JSON válido
- nunca inventar dados
- campos ausentes = `null`
- confidence explícita (`0` a `1`)

---

# WhatsApp

## Regras oficiais

- app nunca envia mensagens automaticamente
- toda ação exige revisão humana
- integração baseada em `wa.me`
- compartilhamento via Web Share Target API

---

## Helpers previstos

```ts
https://wa.me/${numeroLimpo}?text=${encodeURIComponent(msg)}
```

---

# Segurança

## Obrigatório

- RLS em todas as tabelas
- policies com `auth.uid()`
- segregação por `store_id`
- sanitização de entrada
- validação client-side antes do insert
- logs mínimos

---

# Deploy

## Vercel

Requisitos:

- `vercel.json` configurado
- suporte PWA
- suporte SPA rewrite
- variáveis de ambiente protegidas

## Conteúdo mínimo canônico do vercel.json

```json
{
  "rewrites": [
    { "source": "/((?!api|_next|favicon.ico|manifest.json|sw.js|workbox-.*).*)", "destination": "/" }
  ],
  "headers": [
    {
      "source": "/sw.js",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" },
        { "key": "Service-Worker-Allowed", "value": "/" }
      ]
    }
  ]
}
```

> **Atenção:** o padrão de rewrite exclui explicitamente `api`, `_next`, `favicon.ico`, `manifest.json`, `sw.js` e arquivos Workbox para que o SPA routing do Next.js não intercepte assets estáticos nem o Service Worker. O header `Service-Worker-Allowed: /` é obrigatório para que o SW tenha escopo na raiz do domínio.

---

# Critérios arquiteturais do MVP

O sistema deve:

- funcionar bem em celular intermediário
- iniciar rapidamente
- tolerar conexão instável
- permitir captura offline básica
- ser simples de debugar
- evitar infraestrutura excessiva
