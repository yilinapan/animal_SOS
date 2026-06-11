# Phase 5 — Animal SOS Blueprint

The ideal Animal SOS (動物幫幫) platform, designed from the [Phase 4 findings](../research/04-comparative-analysis.md). The thesis: **collapse the fragmented chain (identify → triage → dispatch → follow-up) into one mobile-first flow**, built for a stressed person on a roadside with seconds of patience.

## Product principles

1. **The animal in front of you comes first.** Every path renders actionable guidance *before* asking for an account, a donation, or login.
2. **One front door, smart routing behind it.** The user never picks a jurisdiction or org — the system routes. (Fixes the #1 bottom-10 failure.)
3. **Identify → triage → act → follow-up, unbroken.** No handoff to a different site to find help.
4. **Trust through transparency.** Open data, visible outcomes, verified orgs — not donation pressure.
5. **Bilingual, mobile-first, not a government website.**

## Sitemap

```
/                         Home (emergency-first)
/sos                      Triage flow (tap-based + AI chat)
  /sos/identify           Photo → AI species ID
/report                   Incident report form (photo/GPS/status)
  /report/:code           Public incident status page (shareable)
/guides                   Education library (searchable, bilingual)
  /guides/:slug           Single guide (do/don't steps, seasonal)
  /guides/baby-bird, /snake, /roadkill, /stray, /baby-rabbit ...
/help                     Rescue org directory
  /help/:org-slug         Org profile (coverage, species, hours)
/map                      Public live incident map (privacy-fuzzed)
/citizen-science          Contribute observations; data/impact dashboards
  /data                   Open-data downloads (Darwin Core / CSV)
/community                Volunteer, contributor stats, badges, stories
/about                    Mission, team, partners, transparency/impact
/account                  My reports, contributions, saved guides
/org                      Rescue-org dashboard (auth)
/admin                    Moderator/admin (auth)
```

## Homepage structure

Emergency-first, single dominant CTA (per AHNow / Wildlife Victoria). Top to bottom on mobile:

1. **Slim header** — logo, language toggle (中/EN), compact SOS shortcut.
2. **Hero** — "遇到需要幫助的動物嗎？" + reassurance line + the **coral SOS button** (64px).
3. **Two secondary actions** — 📷 Photo ID · 📍 Report a sighting.
4. **Common situations** — horizontally scrolling illustrated TriageCards (baby bird, injured bird, roadkill, snake near home, injured stray, baby rabbit) — intent-matched entry points (per WBST's "我撿到鳥").
5. **Nearby help** — map preview with org pins → directory.
6. **Live community feed** — recently resolved cases ("台中・斑鳩 已送達救傷站 ✓") as social proof of outcomes (per Petco Love Lost reunions).
7. **Seasonal reminder** — e.g., fledgling-season "observe before acting" card.
8. **Impact strip** — report count, partner-org count (trust signal).
9. **Footer** — about, partners, open data, volunteer, press.

No carousel, no donation popup before help, no portal grid. Full wireframe in [Phase 6](../design/06-ui-ux-spec.md).

## Key user flows

**A. Emergency (SOS):** Home → tap SOS → "What did you find?" (TriageCards or photo shortcut) → ≤3 tap-only triage questions (moves? visible injury? safe to approach?) → **guidance first** (do/don't checklist) → nearest open orgs with tap-to-call → optional one-tap "create report." A persistent "情況危急？直接打電話" escape hatch jumps to hotlines on every screen. Human-danger cases (venomous snake indoors, large animal on a highway) short-circuit to the hotline immediately.

**B. Photo ID:** Camera opens → AI returns top-3 SpeciesChips with confidence (Merlin "show your work" style) → user confirms/corrects → pre-fills triage + report.

**C. Report a sighting/roadkill:** Photo-first → EXIF auto date/GPS (TaiRON pattern) → confirm map pin → status chips (alive-injured / deceased / needs-watching / relocated) → optional note → submit → StatusTimeline + shareable link. Anonymous allowed; account offered after.

**D. Find help directly:** Directory → auto-location → distance-sorted, open-now-filtered orgs, species-filterable (HelpWildlife + AHNow) → org profile → call/route.

**E. Track & close the loop:** Reporter gets notifications at every status transition (routed → claimed → resolved); public status page shows the timeline.

## Information architecture

Audience- and intent-based, never org-chart-based. Top nav: **求助 (Get Help) · 回報 (Report) · 圖鑑/指南 (Guides) · 救援資源 (Directory) · 公民科學 (Citizen Science) · 關於 (About)**. Guides are cross-indexed by species, situation, and season so search and the AI both retrieve the right content. Search supports zh + en and natural-language intent ("撿到幼鳥", "found a baby bird").

## Navigation design

- **Mobile:** persistent bottom SOS button (thumb zone) + a slim top bar; hamburger holds secondary nav. The emergency path is always one tap away.
- **Desktop:** horizontal intent-based nav; SOS persists in the sticky header.
- Breadcrumbs on guides/directory; no menu deeper than two levels.

## AI assistant workflow

Conversational triage built on the Claude API with tool use and strict guardrails (full spec in [Phase 7 §5](../engineering/07-build-spec.md)):

1. User opens chat or photo flow.
2. Assistant classifies category + urgency; **urgency-1 human-danger cases short-circuit to hotlines** before any conversation.
3. Tools: `get_guidance` (pulls *vetted* guide content — the AI sequences approved steps, never freelances medical advice), `find_orgs` (open-now directory query), `create_incident` (pre-filled draft the user confirms), `escalate_to_human`.
4. Every recommendation cites the guide it came from.
5. Pre-launch eval set of 200+ scripted scenarios reviewed by partner rehabbers; regression-tested on every prompt change.

This is the differentiator no incumbent has: Merlin-quality ID + AHNow-quality routing + RSPCA-quality triage content, in one conversation.

## Incident reporting workflow

Photo-first, EXIF auto-fill, anonymous-capable, value-before-account. On submit: AI classification → routing to matching open orgs (coverage polygon ∋ location, species match, capacity ≠ full) → top-3 notified → first to accept claims it → reporter always receives guidance + fallback hotlines immediately regardless of routing → status updates close the loop. Duplicate detection merges the same animal reported twice. Full schema and routing logic in [Phase 7 §3 & §6](../engineering/07-build-spec.md).

## Rescue organization directory structure

Each entry: bilingual name, type (gov agency / wildlife rehab / shelter / NGO / vet clinic / volunteer group), **coverage polygon** (for routing), **species matrix**, hours (+ 24h flag), contact channels (incl. LINE), capacity status (open/limited/full), and a **verified badge** earned via email/phone claim. Maintenance: orgs self-manage listings; quarterly liveness pings flag stale entries; a user-correction queue catches errors. Seeded from Phase 1 research (1959/county 動保處, WRRC, ARTT, TSPCA, bird societies, vet clinics). **Published as open data (CC-BY)** to earn backlinks and trust — the asset HelpWildlife.co.uk built by hand, automated.

## Citizen-science integration

- Every report is a potential observation: species + photo + location + time → **Darwin Core export to GBIF/TaiRON/TBN** (with disclosed CC-BY-NC licensing).
- Roadkill reports capture **condition/freshness** (CROS pattern) for scientific value; graceful **higher-taxon fallback** when species is unknown.
- Optional iNaturalist cross-posting; public **data dashboards** (hotspot maps, species trends) as both a research output and a trust engine.
- Observer feedback loop: contributors see where their data went (fixes the citizen-science "no feedback" failure).

## Community features

Volunteer onboarding and rescue-ambassador training (per WBST); contributor stats, species counts, streaks, and badges (Seek/Hedgehog Street gamification — never shown during emergencies); resolved-case stories; org and volunteer profiles. A LINE-based community channel for rapid local coordination (mirroring China's human-broker speed without the platform lock-in).

## SEO strategy

Win the moment of need. Build intent-targeted, question-framed guides for high-volume queries in both languages ("撿到幼鳥怎麼辦", "found a baby bird", "家裡有蛇", "受傷野鳥"), with structured data (HowTo/FAQ schema), fast SSR pages, and internal links to the relevant triage flow. Goal: when someone Googles their situation, Animal SOS is the top result *and* one tap from action — capturing the traffic RSPCA/RSPB/Cornell currently own, but converting it into a guided flow instead of a static article.

## Content strategy

- **Launch set:** 20 vetted guides covering the request's core scenarios (injured wildlife, roadkill, baby birds, baby rabbits, snakes near homes, injured strays, lost animals, cruelty reporting), each with structured `do/don't` emergency steps reusable by the AI.
- **Voice:** compassionate, blame-free, plain-language (~6th-grade), imperative ("先不要碰牠"). Never imply the finder caused the harm — critical for honest roadkill reporting.
- **Seasonal calendar:** fledgling season, snake-activity months, typhoon aftermath — surfaced on the homepage and pushed via LINE.
- **Review:** every medical/first-aid claim signed off by a partner wildlife vet/rehabber before publish; guides versioned and dated.

## How the blueprint maps to the research

| Animal SOS feature | Borrowed from | Failure it avoids |
|---|---|---|
| Single SOS CTA, one front door | AHNow, Wildlife Victoria | Japan/Korea/county jurisdiction-hunting |
| Open-now location routing | Animal Help Now | Directories of closed offices |
| Show-your-work AI triage + ID | Merlin, iNaturalist/Seek | Over-trusting a single opaque AI guess |
| EXIF auto-fill, higher-taxon fallback | TaiRON, CROS | Typing-heavy forms; demanding expert IDs |
| Closed-loop dispatch + interim guidance | Wildlife Victoria + WIRES | Callback-only silence; vanished reports |
| Open-data directory + dashboards | HelpWildlife, TaiRON, eBird | Stale listings; opaque outcomes |
| Triage-as-load-management + SEO guides | RSPCA UK, RSPB, Cornell | Advice scattered/absent; PDF-only |
| Consumer polish + AI matching | Petco Love Lost | Government-CMS density |
| Value-before-account, anonymous reporting | Petco Love Lost, TaiRON | Login walls before help |
| No FB-login / Chrome-only / language lock-in | (correcting TaiRON, TSPCA) | Channel exclusion |

Design and build specifications continue in [Phase 6 — UI/UX](../design/06-ui-ux-spec.md) and [Phase 7 — Build Spec](../engineering/07-build-spec.md).
