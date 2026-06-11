# Phase 2 — Scoring Framework

How we evaluate the 50+ platforms identified in [Phase 1 — Discovery](01-discovery.md).

## Design principles behind the methodology

Animal SOS is built for a person standing on a roadside with an injured animal in front of them. That person is stressed, on a phone, and has seconds of patience. The framework therefore weights **time-to-help** dimensions (ease of reporting, speed to action, mobile usability) more heavily than dimensions that matter for browsing-mode visitors (SEO, community, education). A platform can have world-class educational content and still fail its core user if the emergency path is buried three clicks deep.

A second principle: **trust converts**. People will not call a number or follow first-aid instructions from a site that looks abandoned or amateurish, so credibility signals get meaningful weight.

## Criteria, weights, and scoring anchors

Each criterion is scored 1–5. The weighted total is normalized to 100.

| # | Criterion | Weight | What we measure |
|---|-----------|:------:|-----------------|
| 1 | **Ease of reporting / getting help** | 15% | Clicks and form fields between landing and a submitted report or a dialable number. Photo-first? Map pin? Can you finish in under 2 minutes one-handed? |
| 2 | **Speed to action** | 12% | Does the homepage answer "I have an emergency NOW"? Hotline visibility, emergency CTA above the fold, triage shortcuts. |
| 3 | **Mobile usability** | 10% | Responsive layout, tap targets, native app or PWA, GPS auto-capture, camera integration. Most real incidents are reported from a phone in the field. |
| 4 | **User experience (overall)** | 10% | Coherent flows, low friction, no dead ends, sensible defaults, error tolerance. |
| 5 | **Public trust & credibility** | 10% | Registered charity/agency status, transparency (annual reports, outcome stats), professional design, HTTPS, recency of content, press/partners. |
| 6 | **Information architecture** | 8% | Can users predict where things live? Audience-based vs. org-based navigation. Search quality. Depth of menus. |
| 7 | **Educational content quality** | 8% | Accuracy, species coverage, actionable first-aid guidance, "do/don't" clarity, readability, illustrations. |
| 8 | **Rescue workflow effectiveness** | 8% | Does a report actually reach someone who can act? Routing to rehabbers/agencies, status feedback to the reporter, closure of the loop. |
| 9 | **Website design quality** | 6% | Visual polish, hierarchy, consistency, imagery, emotional tone appropriate to the mission. |
| 10 | **Citizen science integration** | 5% | Does public data feed research (GBIF, papers, policy)? Species ID assistance, data quality controls, observer feedback. |
| 11 | **Community engagement** | 4% | Active forums/social presence, volunteer pathways, gamification, contributor retention signals. |
| 12 | **Accessibility** | 2% | WCAG basics: contrast, alt text, keyboard navigation, language options, plain-language emergency content. |
| 13 | **SEO visibility** | 1% | Ranking for intent queries ("found a baby bird", "撿到幼鳥怎麼辦"), structured data, content targeting question keywords. |
| 14 | **Traffic & authority signals** | 1% | Relative traffic, backlinks, app downloads, social following, observation counts. |

**Total = 100%.**

SEO and raw traffic are deliberately near-zero weight as *quality* signals — they measure incumbency, not how good the experience is — but they are recorded in Phase 1 as popularity evidence and used in Phase 4 to separate "successful" from merely "good".

### Scoring anchors (1–5)

- **5** — Best-in-class; the pattern other platforms should copy.
- **4** — Strong; minor friction or gaps.
- **3** — Adequate; works but with clear weaknesses.
- **2** — Poor; significant barriers for the core use case.
- **1** — Failing; broken, abandoned, or actively misleading.

### How scores were assigned

1. Each platform's live site was reviewed (homepage, navigation, reporting/help flow) during Phase 1 research (June 2026).
2. Popularity/credibility evidence (observation counts, charity registrations, app-store presence, press) was collected from public sources.
3. Criteria 1–4 were scored against the concrete walkthrough of the "injured animal" user journey; criteria 5–14 from site-wide review and external signals.
4. Scores are comparative within this cohort, not absolute. A 5 means "best among the ~50 platforms studied".

### Category fairness note

The cohort mixes four archetypes — emergency directories, rescue organizations, citizen-science networks, and government/welfare reporting systems. A roadkill database is not *trying* to be an emergency triage tool. Phase 3 ranks on weighted totals (because Animal SOS spans all four archetypes, the best teachers are the platforms that score well across the board), but Phase 4 also analyzes per-archetype patterns so weak-but-focused platforms are critiqued on their own terms.

## Worked example

Animal Help Now (US): Ease of reporting 5 (location → instant list of nearby rehabbers, ~10 seconds), Speed to action 5, Mobile 5 (apps + GPS), UX 4, Trust 4, IA 4, Education 3, Rescue workflow 5, Design 3, Citizen science 2, Community 2, Accessibility 3, SEO 3, Traffic 3 → **weighted ≈ 82/100**.

Full scored matrix: see [Phase 3 — Top 10 Analysis](03-top10-analysis.md) and the comparison table in [Phase 4](04-comparative-analysis.md).
