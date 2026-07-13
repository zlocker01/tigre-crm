-- Crear tabla de recibos
CREATE TABLE IF NOT EXISTS recibos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  folio VARCHAR(50) NOT NULL UNIQUE,
  fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  monto NUMERIC(10, 2) NOT NULL,
  concepto TEXT NOT NULL,
  metodo_pago VARCHAR(50),
  datos_recibo JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar Row Level Security (RLS)
ALTER TABLE recibos ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios vean solo sus propios recibos
CREATE POLICY "Users can view their own receipts"
  ON recibos FOR SELECT
  USING (auth.uid() = user_id);

-- Política para que los usuarios creen sus propios recibos
CREATE POLICY "Users can insert their own receipts"
  ON recibos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política para que los usuarios actualicen sus propios recibos
CREATE POLICY "Users can update their own receipts"
  ON recibos FOR UPDATE
  USING (auth.uid() = user_id);

-- Política para que los usuarios eliminen sus propios recibos
CREATE POLICY "Users can delete their own receipts"
  ON recibos FOR DELETE
  USING (auth.uid() = user_id);

-- Crear índice para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_recibos_client_id ON recibos(client_id);
CREATE INDEX IF NOT EXISTS idx_recibos_user_id ON recibos(user_id);
CREATE INDEX IF NOT EXISTS idx_recibos_fecha_emision ON recibos(fecha_emision DESC);
