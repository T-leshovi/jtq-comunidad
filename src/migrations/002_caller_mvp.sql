-- JTQ Comunidad — Sprint 33 Caller MVP migration
-- Adds caller role support to admin_users + caller queue + audit log.
-- Idempotent: safe to run multiple times.

BEGIN;

-- 1. Extend admin_users with role + active + last_login_at -----------------
ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'admin';

-- Drop and recreate check constraint to be safe (Postgres has no IF NOT EXISTS for constraints).
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'admin_users_role_check') THEN
    ALTER TABLE admin_users DROP CONSTRAINT admin_users_role_check;
  END IF;
END $$;
ALTER TABLE admin_users
  ADD CONSTRAINT admin_users_role_check CHECK (role IN ('admin','caller'));

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS active BOOLEAN NOT NULL DEFAULT true;

ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- 2. caller_assignments: queue with sticky assignment ---------------------
CREATE TABLE IF NOT EXISTS caller_assignments (
  id SERIAL PRIMARY KEY,
  caller_id INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  registration_id INTEGER UNIQUE NOT NULL REFERENCES registrations(id) ON DELETE CASCADE,
  registration_position INTEGER NOT NULL,
  outcome VARCHAR(20) NOT NULL DEFAULT 'pending'
    CHECK (outcome IN ('pending','confirmed','no_answer','rejected','recall')),
  attempts INTEGER NOT NULL DEFAULT 0,
  recall_after TIMESTAMPTZ,
  contacted_at TIMESTAMPTZ,
  notes TEXT,
  slot_day SMALLINT CHECK (slot_day IS NULL OR slot_day IN (1,2)),
  slot_time VARCHAR(10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial index drives the FIFO pop-next query.
CREATE INDEX IF NOT EXISTS idx_caller_queue
  ON caller_assignments(caller_id, registration_position)
  WHERE outcome IN ('pending','recall');

-- For global counters and stats.
CREATE INDEX IF NOT EXISTS idx_caller_outcome
  ON caller_assignments(outcome);

-- For caller-scoped joins.
CREATE INDEX IF NOT EXISTS idx_caller_assignments_caller
  ON caller_assignments(caller_id);

-- 3. audit_log: lightweight history --------------------------------------
CREATE TABLE IF NOT EXISTS audit_log (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INTEGER,
  ip INET,
  user_agent TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_time
  ON audit_log(user_id, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_audit_action_time
  ON audit_log(action, created_at DESC);

-- 4. updated_at trigger on caller_assignments ----------------------------
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_caller_assignments_updated_at ON caller_assignments;
CREATE TRIGGER trg_caller_assignments_updated_at
  BEFORE UPDATE ON caller_assignments
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

COMMIT;
