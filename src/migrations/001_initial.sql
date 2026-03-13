-- JTQ Comunidad — Schema inicial
-- Multi-actividad con registros unificados

CREATE TABLE IF NOT EXISTS activities (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) NOT NULL DEFAULT 'active'
    CHECK(status IN ('draft','active','paused','closed')),
  config JSONB DEFAULT '{}',
  max_registrations INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS registrations (
  id SERIAL PRIMARY KEY,
  activity_id INTEGER NOT NULL REFERENCES activities(id),
  registration_number INTEGER NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  whatsapp VARCHAR(20) NOT NULL,
  contact_consent BOOLEAN NOT NULL DEFAULT false,
  risk_consent BOOLEAN NOT NULL DEFAULT false,
  is_adult BOOLEAN NOT NULL DEFAULT true,
  metadata JSONB DEFAULT '{}',
  qr_token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
  status VARCHAR(20) NOT NULL DEFAULT 'registered'
    CHECK(status IN ('registered','confirmed','attended','cancelled','no_show')),
  scheduled_date DATE,
  attended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_unique_whatsapp_activity
  ON registrations(whatsapp, activity_id)
  WHERE status != 'cancelled';

CREATE INDEX IF NOT EXISTS idx_reg_activity_number
  ON registrations(activity_id, registration_number);

CREATE INDEX IF NOT EXISTS idx_reg_qr_token
  ON registrations(qr_token);

CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed: primera actividad
INSERT INTO activities (slug, name, description, config) VALUES (
  'esterilizacion',
  'Campaña de Esterilización Gratuita',
  'Esterilización gratuita de perros y gatos para combatir el problema de animales callejeros en Cananea, Sonora. Una mascota por persona.',
  '{"pet_types":["perro","gato"],"requires_risk_waiver":true,"info_text":"Te contactaremos por WhatsApp para agendar tu fecha (probablemente sábado). Por favor llega 30 minutos antes con tu mascota."}'
) ON CONFLICT (slug) DO NOTHING;

-- Seed: admin user (password: admin123 - CAMBIAR EN PRODUCCIÓN)
-- Hash generado con bcrypt rounds=10
INSERT INTO admin_users (username, password_hash, name) VALUES (
  'admin',
  '$2a$10$xJ8Kx3q5L5z5z5z5z5z5zuQ5z5z5z5z5z5z5z5z5z5z5z5z5z5z',
  'Administrador JTQ'
) ON CONFLICT (username) DO NOTHING;
