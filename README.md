# Animal SOS (動物幫幫)

An AI-powered website and platform that helps people who unexpectedly encounter animals in need — injured wildlife, roadkill, baby birds, baby rabbits, snakes near homes, injured strays, lost pets — and don't know what to do. Animal SOS bridges the gap between the public and existing rescue organizations through immediate guidance, educational resources, reporting workflows, and AI-assisted triage.

> **Mission:** When you find an animal in need, Animal SOS walks you through what to do, identifies the animal, gives compassionate step-by-step guidance, and connects you to the nearest help that's actually open — in one mobile-first flow.

## Research & design dossier

This repository currently holds the complete research-and-specification dossier (Phases 1–7) produced from extensive competitive research across Taiwan and 20+ countries, covering 76 platforms. It is detailed enough for a development team to begin building immediately.

| Phase | Document | Contents |
|---|---|---|
| 1 — Discovery | [docs/research/01-discovery.md](docs/research/01-discovery.md) | 76 platforms worldwide with URL, country, purpose, popularity, and notable features |
| 2 — Scoring Framework | [docs/research/02-scoring-framework.md](docs/research/02-scoring-framework.md) | 14-criterion weighted matrix (100 pts), methodology, scoring anchors |
| 3 — Top 10 Analysis | [docs/research/03-top10-analysis.md](docs/research/03-top10-analysis.md) | Scored leaderboard + deep breakdown of the 10 strongest platforms |
| 4 — Comparative Analysis | [docs/research/04-comparative-analysis.md](docs/research/04-comparative-analysis.md) | Best vs. worst patterns: design, content, trust, conversion, onboarding |
| 5 — Blueprint | [docs/blueprint/05-blueprint.md](docs/blueprint/05-blueprint.md) | Sitemap, IA, user flows, AI workflow, directory, citizen science, SEO, content |
| 6 — UI/UX Spec | [docs/design/06-ui-ux-spec.md](docs/design/06-ui-ux-spec.md) | Color system, typography, components, homepage wireframe, mobile layouts |
| 7 — Build Spec | [docs/engineering/07-build-spec.md](docs/engineering/07-build-spec.md) | Tech stack, DB schema, API, AI integration, routing, scalability, build plan |

## Key findings at a glance

- **The market is fragmented by capability.** No existing platform unifies *identify → triage → dispatch → follow-up*. A finder today chains a bird-ID app, an advice article, a rescue directory, and a phone call — losing momentum at every handoff.
- **The strongest platforms** (Animal Help Now, iNaturalist/Seek, WIRES, Merlin, RSPCA UK, Wildlife Victoria, Taiwan's 路殺社/TaiRON, Petco Love Lost, HelpWildlife.co.uk, eBird) each nail one piece: open-now location routing, show-your-work AI ID, EXIF auto-fill, closed-loop dispatch, consumer-grade polish, or SEO-winning triage education.
- **The weakest** force users to pick a jurisdiction first, offer phone-only dead ends, or bury emergency info in government-CMS density.
- **Taiwan specifically lacks** a unified, mobile-first "injured animal near me" triage tool with case tracking — the gap Animal SOS fills.

## Proposed stack (MVP)

Next.js 15 · PostgreSQL + PostGIS · Drizzle · Claude API (triage agent) + iNaturalist CV (species ID) · LINE Messaging API · MapLibre · Supabase/Vercel. See [Phase 7](docs/engineering/07-build-spec.md).

## Status

Research and specification complete. Implementation not yet started — the build plan and 12-sprint roadmap are in the build spec.

---

*Research conducted June 2026. Organizational reach statistics are as reported by the platforms and secondary sources, not independently audited; see method caveats in each research document.*
