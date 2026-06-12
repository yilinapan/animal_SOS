# Phase 7 — Build Specification (Production-Ready MVP)

Technical specification for the **Animal SOS (動物幫幫)** MVP. Detailed enough for a development team to start immediately.

## 1. MVP scope

**In scope (v1):**
1. Emergency triage flow (tap-based + AI photo ID + AI chat assistant)
2. Incident reporting with photo, GPS, status lifecycle
3. Rescue organization directory with geo-routing and hours-aware availability
4. Educational guide library (CMS-backed, bilingual)
5. Reporter accounts + incident status tracking
6. Org dashboard (incident queue, claim/resolve)
7. Public live map of recent incidents (privacy-fuzzed)
8. Threads/social monitoring pipeline (ingest public posts about animals in need, surface to moderators)

**Out of scope (v1):** donations processing, volunteer dispatch logistics, native apps (PWA first), adoption marketplace, multi-country expansion.

## 2. Tech stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Web framework | **Next.js 15 (App Router, TypeScript)** | SSR for SEO-critical edu content + SPA interactivity for flows; one codebase |
| UI | Tailwind CSS + shadcn/ui + design tokens from Phase 6 | Fast to build, accessible primitives |
| PWA | `next-pwa` / service worker | Offline-cached triage guides, installable, camera/GPS via web APIs |
| API | Next.js route handlers + **tRPC** internal; **REST (OpenAPI)** public endpoints | Type safety internally; documented public API for partners/researchers |
| Database | **PostgreSQL 16 + PostGIS** (hosted: Supabase or Neon) | Geo-queries are core (nearest org, incident clustering) |
| ORM | Drizzle | Type-safe, plays well with PostGIS via custom types |
| Auth | Supabase Auth or Auth.js — email OTP, LINE Login, Google | LINE is essential in Taiwan |
| Storage | S3-compatible (Supabase Storage / Cloudflare R2) + image resizing CDN | Photo-heavy product |
| AI | **Claude API (claude-fable-5 for triage agent; claude-haiku-4-5 for classification at scale)** + iNaturalist computer-vision API for species ID | Triage = conversational reasoning; species ID = specialized vision model with Taiwan species coverage |
| Maps | MapLibre GL + OpenStreetMap tiles (or Mapbox) | Cost control, custom pin styling |
| Search | Postgres full-text (zh + en config) → Typesense if needed | Start simple |
| Background jobs | **Inngest** (or BullMQ + Redis) | Webhooks, social monitoring crons, notification fan-out |
| Notifications | LINE Messaging API (primary in TW), web push, email (Resend), SMS fallback (Twilio) | Meet users where they are |
| Hosting | Vercel (app) + Supabase (db/auth/storage); or Fly.io if co-location needed | Fast iteration for a small team |
| Observability | Sentry + Vercel Analytics + structured logs (Axiom) | |
| i18n | next-intl, `zh-TW` default, `en` secondary | |

## 3. Database schema (core tables)

```sql
-- Users
users (
  id uuid PK, auth_id text UNIQUE, display_name text,
  email text, phone text, line_user_id text,
  locale text DEFAULT 'zh-TW', role text CHECK (role IN ('reporter','org_member','moderator','admin')),
  created_at timestamptz, last_seen_at timestamptz
)

-- Rescue organizations (directory)
organizations (
  id uuid PK, slug text UNIQUE, name_zh text, name_en text,
  type text CHECK (type IN ('gov_agency','wildlife_rehab','animal_shelter','ngo','vet_clinic','volunteer_group')),
  description_zh text, description_en text,
  phone text, line_id text, website text, email text,
  address text, location geography(Point,4326),
  coverage_area geography(MultiPolygon,4326),      -- service region for routing
  species_handled text[],                           -- ['bird','mammal','reptile','cat_dog','marine',...]
  hours jsonb,                                      -- weekly schedule + emergency_24h bool
  capacity_status text DEFAULT 'open' CHECK (capacity_status IN ('open','limited','full')),
  verified boolean DEFAULT false, verified_at timestamptz,
  claimed_by_user_id uuid FK users, created_at, updated_at
)
org_members (org_id FK, user_id FK, role text, PRIMARY KEY(org_id,user_id))

-- Incidents (the heart of the system)
incidents (
  id uuid PK, public_code text UNIQUE,              -- short shareable code e.g. 'SOS-8F3K2'
  reporter_id uuid NULL FK users,                   -- nullable: anonymous reporting allowed
  reporter_contact jsonb,                           -- {phone|line|email} for anonymous follow-up
  category text CHECK (category IN ('injured_wildlife','roadkill','baby_animal','snake_encounter','stray_injured','lost_pet','cruelty_report','other')),
  animal_class text,                                -- bird/mammal/reptile/amphibian/cat/dog/other
  species_guess text, species_confirmed text,       -- scientific or common name
  species_ai jsonb,                                 -- [{name, score}] from vision API
  condition text CHECK (condition IN ('alive_injured','alive_orphaned','alive_trapped','deceased','unknown')),
  urgency smallint,                                 -- 1-4, set by triage engine
  location geography(Point,4326) NOT NULL,
  location_accuracy_m int, location_text text,
  occurred_at timestamptz, reported_at timestamptz DEFAULT now(),
  description text,
  status text DEFAULT 'open' CHECK (status IN ('open','routed','claimed','in_progress','resolved','closed_no_action','duplicate')),
  resolution text,                                  -- rescued/released/deceased/referred/...
  duplicate_of uuid NULL FK incidents,
  source text DEFAULT 'web' CHECK (source IN ('web','pwa','line_bot','threads_monitor','partner_api','phone_log')),
  is_public boolean DEFAULT true,                   -- shown on live map (fuzzed)
  created_at, updated_at
)
CREATE INDEX incidents_location_gix ON incidents USING GIST (location);
CREATE INDEX incidents_status_idx ON incidents (status, reported_at DESC);

incident_photos (id PK, incident_id FK, storage_key text, exif jsonb, taken_at timestamptz, width int, height int, ai_labels jsonb)
incident_events (                                    -- full audit timeline → StatusTimeline UI
  id PK, incident_id FK, actor_user_id FK NULL, actor_org_id FK NULL,
  event_type text,                                   -- created/triaged/routed/claimed/note/status_change/resolved
  payload jsonb, created_at timestamptz
)
incident_routings (                                  -- which orgs were notified
  id PK, incident_id FK, org_id FK,
  notified_via text, notified_at timestamptz,
  response text CHECK (response IN ('pending','accepted','declined','timeout')), responded_at timestamptz
)

-- Triage & AI
triage_sessions (
  id uuid PK, user_id FK NULL, incident_id FK NULL,
  channel text CHECK (channel IN ('web_chat','line_bot')),
  transcript jsonb,                                  -- message array
  outcome text,                                      -- guidance_only/report_created/hotline_handoff/escalated
  model text, started_at, ended_at
)

-- Education
guides (
  id PK, slug UNIQUE, title_zh, title_en, body_mdx_zh, body_mdx_en,
  category text, species_tags text[], season_months int[],
  emergency_summary jsonb,                           -- structured do/don't steps for triage reuse
  status text, published_at, author_id FK, updated_at
)

-- Social monitoring (Threads etc.)
social_mentions (
  id PK, platform text, external_id text UNIQUE, url text,
  author_handle text, content text, media jsonb,
  detected_at timestamptz, posted_at timestamptz,
  ai_classification jsonb,                           -- {is_animal_emergency, category, location_guess, confidence}
  review_status text DEFAULT 'pending' CHECK (review_status IN ('pending','actioned','dismissed')),
  linked_incident_id FK NULL
)

-- Citizen science export
observation_exports (id PK, incident_id FK, exported_to text, dwc_payload jsonb, exported_at)  -- Darwin Core to GBIF/TaiRON partners

-- Gamification
user_stats (user_id PK FK, reports_count int, species_count int, verified_count int, badges jsonb, streak_days int)
```

Privacy: public map reads go through a view that fuzzes `location` to ~300 m grid and strips reporter identity; exact coordinates visible only to routed orgs and moderators.

## 4. API architecture

Public REST (OpenAPI, versioned `/api/v1`):

```
POST /incidents                    create report (anonymous-capable, rate-limited, captcha)
GET  /incidents/:publicCode        public status view
GET  /incidents?bbox=&category=    fuzzed map data
POST /triage/identify              photo → species candidates (proxies vision API)
POST /triage/chat                  AI assistant turn (SSE streaming)
GET  /orgs?lat=&lng=&species=&open_now=   directory search (PostGIS nearest + coverage contains)
GET  /guides, GET /guides/:slug
POST /orgs/:id/claim               org onboarding
-- org-authenticated --
GET  /org/queue                    incidents routed to my org
POST /org/incidents/:id/respond    accept/decline
POST /org/incidents/:id/events     status updates, notes, resolution
-- webhooks --
POST /webhooks/line                LINE bot messages → triage engine
POST /webhooks/threads             social monitor ingestion
```

Internal app uses tRPC mirroring these. All writes emit `incident_events` and trigger Inngest jobs (notifications, routing, exports).

## 5. AI integration

### 5.1 Species identification
Photo upload → (1) iNaturalist computer-vision scoring endpoint (best Taiwan coverage) → (2) fallback Claude vision with a constrained Taiwan-species prompt → top-3 `SpeciesChip`s with confidence. Store all candidates in `species_ai`; human/org confirmation writes `species_confirmed` (training-data flywheel).

### 5.2 Triage assistant (the core differentiator)
- Claude (claude-fable-5) with a structured system prompt + **tool use**:
  - `get_guidance(category, species, condition)` → pulls vetted `guides.emergency_summary` (assistant never freestyles medical advice; it selects and sequences approved content)
  - `find_orgs(lat, lng, species, urgency)` → directory query
  - `create_incident(draft)` → pre-filled report the user confirms
  - `escalate_to_human()` → flags moderator
- Guardrails: urgency-1 (human danger: venomous snake indoors, large injured mammal on road) short-circuits to hotline numbers immediately, before any conversation. System prompt forbids euthanasia/medical-procedure instructions; responses cite the guide they came from.
- Eval set before launch: ≥200 scripted scenarios (baby bird, snake, roadkill, cruelty) reviewed by partner rehabbers; regression-run on every prompt change.

### 5.3 Incident classification
Every inbound report/social mention → claude-haiku-4-5 classifier → `{category, animal_class, urgency, duplicate_candidates}`. Duplicate detection combines embedding similarity + PostGIS distance + time window; suggested merges go to moderator queue.

### 5.4 Threads monitoring workflow
1. Inngest cron (every 5 min) queries Threads API keyword sets (受傷, 鳥掉下來, 路殺, 撿到幼鳥, 蛇, …) and watched hashtags/accounts.
2. New posts → `social_mentions` → Haiku classification (emergency? location inferable?).
3. High-confidence emergencies → moderator queue with one-click "reply with help template + link to triage" and "create incident".
4. Never auto-reply without moderator approval in v1 (platform ToS + tone risk).

## 6. Incident routing workflow

```
report submitted
  → classify (AI) → urgency + category
  → match orgs: coverage_area ∋ point, species_handled ∋ class,
    capacity_status ≠ 'full', open now (or emergency_24h)
  → rank by distance + historical response rate
  → notify top 3 via LINE/email/webhook (incident_routings)
  → first 'accepted' claims it; others auto-released
  → no acceptance in 30 min (urgency≥3: 10 min) → escalate to moderator
    + show reporter fallback hotlines (1959, local 動保處) immediately regardless
  → org updates status → reporter notified at every transition → resolution closes loop
```

The reporter **always** gets actionable next steps at submission time (guidance + hotline numbers); routing is additive, never a gate.

## 7. Rescue resource database structure

Directory seeded from Phase 1 research: government (1959 hotline, county 動保處, 特生中心急救站), NGOs (ARTT, TSPCA, HOTAC, bird societies), licensed wildlife rehabbers, cooperating vet clinics. Each entry: coverage polygon, species matrix, hours, channels, verification status. Maintenance: orgs claim listings (email/phone verification → `verified` badge), quarterly liveness pings auto-flag stale entries, user-reported corrections queue. Open data: directory published as JSON/CSV under CC-BY to earn backlinks and trust.

## 8. Scalability & operations

- **Load profile:** spiky (typhoons, fledgling season, viral posts). Vercel serverless absorbs spikes; Postgres connection pooling (pgBouncer); map tiles and edu content CDN-cached.
- **Images:** client-side resize before upload (cap 2048px), EXIF GPS parsed client-side, virus/abuse scan async.
- **Rate limiting:** per-IP and per-account on report creation + AI endpoints (AI cost control); CAPTCHA only on anonymous spam signals, never on the happy path.
- **Data growth:** incidents partitioned by year when >5 M rows; photos lifecycle to cold storage after 18 months (keep thumbnails).
- **Backups/DR:** PITR on Postgres, daily storage snapshots, RPO 24h / RTO 4h for MVP.
- **Compliance:** Taiwan PDPA — explicit consent for contact info, anonymized public data, deletion requests honored; photo uploads grant CC-BY-NC license for citizen-science export (clearly disclosed).

## 9. Build plan (suggested)

| Sprint | Deliverable |
|--------|-------------|
| 1–2 | Repo, CI, design tokens, auth, org directory schema + seeded data, directory search UI |
| 3–4 | Incident report flow (photo/GPS/form), public status page, live map |
| 5–6 | Triage flow (tap-based) + guide CMS + 20 launch guides (fledgling, snake, roadkill, stray) |
| 7–8 | AI assistant (chat + photo ID) with guardrails + eval harness |
| 9–10 | Org dashboard + routing/notifications (LINE bot) |
| 11–12 | Threads monitoring, moderator tools, gamification, polish, load test, partner pilot launch |

Team shape: 2 full-stack, 1 designer, 1 PM/content lead (bilingual), part-time wildlife-vet advisor for guide review.
