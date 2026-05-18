# JTQ Comunidad — Workspace Guide

## Workspace
- **Path**: `C:\Users\jequi\OneDrive - JEQUIMA\CLAUDE\jtq-comunidad\`
- **Deploy**: https://jtqcomunidad.com (Vercel auto-deploy on push to `main`)
- **Admin login**: https://jtqcomunidad.com/admin/login
- **Stack**: Next.js 16.2.6 (App Router), React 19.2.6, Neon PostgreSQL 17.8 (`@neondatabase/serverless`), Tailwind CSS 4, bcryptjs, qrcode + html5-qrcode 2.3.8, puppeteer, Zod 4

## Active Sprint — Sprint 33 (Caller MVP, Option B)

**Goal**: Build a simplified caller workflow to confirm 90 mascotas for Phase 1 jornada at Casino Club de Leones (2-day event, Casino May/Jun 2026). Plan contract lives in `C:\Users\jequi\.claude\plans\perfecto-me-puede-describir-cached-crane.md`.

**Scope IN**:
- 3-4 callers + admin roles on `admin_users` table (new `role` column).
- FIFO caller queue with sticky assignment + `FOR UPDATE SKIP LOCKED` pop-next.
- 4 outcomes per call: `confirmed | no_answer | rejected | recall`. `no_answer` auto-recalls 4h, max 3 attempts. `rejected` terminal.
- At 90 global confirmed → narrative banner shift to "Phase 2 backup script". No hard stop.
- Slot time: caller anota libremente (no engine, no uniqueness constraint).
- Mobile-first caller UI on existing Dark Premium theme.

**Scope OUT (defer Sprint 34 if jornada #2 confirmed)**:
- Automatic slot scheduling engine (caller writes free-text hour).
- Multi-device QR check-in UI (day-of: paper + 1 admin tablet using `registrations.qr_token`).
- Auto-waitlist cron promotion (admin notifies caller via WhatsApp manually day-of).
- WhatsApp outbound automation (callers use their own WhatsApp).
- PDF reminder.
- Realtime WebSocket (polling 10s suffices for 3-4 callers).

**Fallback (Option A)**: If gate A6 fails (race conditions, mobile UI broken >3h debug, migration fails), pivot same-day to Google Sheets workflow described in plan file. Re-evaluate app build post-jornada #1.

## Architecture

### Database
- Existing tables: `activities`, `registrations` (with `qr_token UUID UNIQUE`), `admin_users` (SERIAL id, username/password_hash/name).
- Sprint 33 migration: `src/migrations/002_caller_mvp.sql`.
  - `ALTER admin_users ADD role/active/last_login_at`.
  - `caller_assignments(caller_id, registration_id UNIQUE, registration_position, outcome, attempts, recall_after, contacted_at, notes, slot_day, slot_time)`.
  - `audit_log(user_id, action, entity_type, entity_id, ip, user_agent, metadata, created_at)`.
- IDs are SERIAL integers, not UUID (matches existing schema).
- `registrations.status` flow already supports `confirmed` state — caller success updates BOTH `caller_assignments.outcome='confirmed'` AND `registrations.status='confirmed'`.

### Auth
- Cookie-based (`jtq_admin_session`, httpOnly, 24h). Token format: `{userId}-{timestamp}-{random}`.
- Pre-existing weakness: token only encodes user ID prefix, no signature. Acceptable for MVP volume; revisit Sprint 34+.
- `getSession()` reads cookie → `{adminId}`. `getCurrentUser()` does DB lookup → `{id, name, role}`. `requireRole(allowed)` throws 401/403.
- Middleware (`src/middleware.ts`) only checks cookie presence — runs at edge, no DB lookup. Role enforcement is server-component-level via `getCurrentUser()` + `redirect()`.

### Routing
- `(auth)/login` → `/admin/login` (unprotected, redirects to `/admin` post-login).
- `(dashboard)/...` → all admin routes; layout calls `requireRole('admin')` and redirects callers to `/admin/caller`.
- `(caller)/caller` → `/admin/caller`; layout allows admin OR caller, redirects others to `/admin/login`.

### API
- `POST /api/auth` (extended): returns `{success, name, role}` for client-side role-based redirect.
- `POST /api/admin/callers` (admin): create caller user.
- `GET /api/admin/callers` (admin): list with per-caller progress.
- `PATCH /api/admin/callers/[id]` (admin): toggle active.
- `POST /api/admin/callers/distribute` (admin): round-robin assign all unassigned `registered` records.
- `GET /api/admin/callers/stats` (admin): aggregate dashboard.
- `GET /api/caller/next` (caller): pop next via `FOR UPDATE SKIP LOCKED`.
- `POST /api/caller/outcome/[id]` (caller, must own): mark outcome + optional `slot_day`/`slot_time`/`notes`.
- `GET /api/caller/stats` (caller): own counts + global `confirmed` count.

## Phase 0 TODOs (run by user before A1)

1. `SELECT COUNT(*) FROM registrations WHERE status IN ('registered','confirmed') AND activity_id = (SELECT id FROM activities WHERE slug='esterilizacion')` against production Neon → reconcile 187 (memory) vs ~768 (brief).
2. Apply migration: `psql $DATABASE_URL -f src/migrations/002_caller_mvp.sql`.
3. Seed first caller via `/admin/callers` UI after admin logs in.

## A5/A6 — Verification gate

Manual E2E checklist:
1. Admin crea 3 callers via `/admin/callers`.
2. Admin dispara `POST /api/admin/callers/distribute` → todos los registros `registered` pending se reparten round-robin.
3. 3 navegadores simultáneos (caller 1/2/3) `GET /api/caller/next` → reciben asignaciones distintas dentro de 100ms (verifica `FOR UPDATE SKIP LOCKED`).
4. Caller 1 marca ✅ con `slot_day=1 slot_time="10:30"` → next pops. Global counter `1/90 confirmadas` aparece en 3 navegadores ≤10s.
5. Caller 2 marca ❌ no_answer → `recall_after = NOW() + 4h`. Próxima asignación pops.
6. SQL manual `UPDATE caller_assignments SET outcome='confirmed' WHERE id IN (...)` para llegar a 90 → banner cambia globalmente.
7. Caller intenta abrir `/admin/dashboard` → layout redirige a `/admin/caller`.
8. Admin abre `/admin/dashboard` y `/admin/callers` → ambos funcionan, counter live visible.
9. Mobile: probar caller UI en Chrome iOS + Android. Botones ≥44px target.
10. `audit_log` tiene rows con `user_id + ip + action` para cada outcome.

**GO** si: 3 colaboradoras de prueba operan sin fricción, contador llega a 5+ confirmados sin race, auth de roles funciona.

**PIVOT a Option A (Sheets)** si: migration falla, race conditions detectadas, mobile UI rota >3h debug, o cualquier blocker irrecuperable.

## Defaults applied (revisar post-Phase-A)
- `no_answer` auto-recalls 4h, máx 3 intentos. `rejected` terminal.
- En 90 confirmados → banner cambia, callers siguen pop-next para backup 20-30 (no hard stop).
- Caller anota hora libremente — sin `UNIQUE(slot_day, slot_time)`. Riesgo cluster mitigado por # callers paralelos 3-4 + rango horario amplio.
- Admin crea cuentas caller manualmente (no self-signup).
- Polling 10s para counter global (no WebSocket).
- `audit_log` retain indefinido en Sprint 33.

## Commands
```
npm run dev          # local dev server localhost:3000
npm run build        # production build
npm run lint         # eslint
psql $DATABASE_URL -f src/migrations/002_caller_mvp.sql   # apply migration
```

## Skill references
- `call-queue-distribution-workflow` — pop-next SQL + round-robin modulo + sticky-on-attempted
- `multi-role-rbac-admin-callers-checkin` — role enum + audit_log + middleware prefix
- `next-admin-cookie-session` — extend existing pattern, do not replace
- `admin-dashboard-stats-pattern` — Promise.all aggregation pattern
- `duplicate-detection-cte-pattern` — already in `/api/registrations`
- `qr-event-checkin-multi-device` — DEFERRED Sprint 34
- `event-slot-scheduling-engine` — DEFERRED Sprint 34
