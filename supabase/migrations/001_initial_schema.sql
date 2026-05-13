-- ============================================================
-- AgendaEC — Schema inicial (Sprint 1)
-- ============================================================

-- stores
CREATE TABLE stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id UUID REFERENCES auth.users NOT NULL,
  name TEXT NOT NULL,
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- store_users
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

-- clients
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

-- entries
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

-- sales
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

-- payments
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

-- deliveries
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

-- tasks
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

-- appointments
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

-- wa_messages
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

-- wa_templates
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

-- daily_closings
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

-- audit_logs
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

-- ============================================================
-- Trigger updated_at
-- ============================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

-- ============================================================
-- Índices
-- ============================================================

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

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE sales ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE wa_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_closings ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Stores: leitura
CREATE POLICY "stores_leitura" ON stores
FOR SELECT USING (
  id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
  OR owner_id = auth.uid()
);

-- Stores: escrita (apenas owner)
CREATE POLICY "stores_escrita" ON stores
FOR ALL USING (owner_id = auth.uid())
WITH CHECK (owner_id = auth.uid());

-- Política base por store_id (aplicada em todas as demais tabelas)
CREATE POLICY "acesso_por_loja" ON store_users
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON clients
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON entries
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON sales
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON payments
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON deliveries
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON tasks
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON appointments
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON wa_messages
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON wa_templates
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

CREATE POLICY "acesso_por_loja" ON daily_closings
FOR ALL USING (
  store_id IN (
    SELECT store_id FROM store_users
    WHERE user_id = auth.uid() AND active = true
  )
);

-- Audit logs: leitura restrita ao owner
CREATE POLICY "audit_logs_leitura_owner" ON audit_logs
FOR SELECT USING (
  store_id IN (
    SELECT id FROM stores WHERE owner_id = auth.uid()
  )
);
