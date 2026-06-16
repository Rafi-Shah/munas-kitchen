-- ============================================================
--  Muna's Kitchen — Supabase Database Schema
--  Run this in: Supabase Dashboard → SQL Editor → New query
-- ============================================================

-- 1. Reservations table
CREATE TABLE IF NOT EXISTS reservations (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  phone      TEXT,
  guests     TEXT        NOT NULL DEFAULT '2 guests',
  date       DATE        NOT NULL,
  time       TEXT        NOT NULL,
  notes      TEXT,
  status     TEXT        NOT NULL DEFAULT 'pending'
               CHECK (status IN ('pending', 'confirmed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Index for faster email lookups
CREATE INDEX IF NOT EXISTS idx_reservations_email ON reservations(email);
CREATE INDEX IF NOT EXISTS idx_reservations_date  ON reservations(date);

-- 3. Row Level Security
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

-- Allow service role to do everything (used by PHP API)
CREATE POLICY "Service role full access" ON reservations
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- 4. Optional: contact messages table
CREATE TABLE IF NOT EXISTS contact_messages (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT        NOT NULL,
  email      TEXT        NOT NULL,
  message    TEXT        NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Service role full access" ON contact_messages
  FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');
