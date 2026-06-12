# Phase 4 — Comparative Analysis

Comparing the strongest platforms against the weakest to extract the patterns Animal SOS should adopt and avoid.

## The two cohorts

**Top 10** (weighted ≥70, from [Phase 3](03-top10-analysis.md)): Animal Help Now, iNaturalist/Seek, WIRES, Merlin, RSPCA UK, Wildlife Victoria, TaiRON, Petco Love Lost, HelpWildlife.co.uk, eBird.

**Bottom 10** (lowest weighted totals in the cohort — judged as digital public-service experiences, while acknowledging several are excellent *organizations* whose web presence simply isn't the product):

| Platform | Weighted | Core failing as a digital experience |
|---|:--:|---|
| Japan prefectural 傷病鳥獣 system | 34 | No national entry point; user must hunt their prefecture's buried gov page |
| Norway Fallviltregisteret | 38 | "Call the police"; zero citizen feedback or engagement; small species invisible |
| China 让候鸟飞 (public path) | 40 | No web product; coordination via Weibo/WeChat threads + 12345 hotline |
| WRRC 野生動物急救站 (TBRI) | 42 | Buried in a government CMS; phone/physical intake only; single location |
| pet.gov.tw cluster | 44 | Multiple overlapping migrated ASPX systems; confusing entry points |
| 1959 + 22 county forms | 48 | One great number, but fragmented per-county web forms, no case tracking |
| World Animal Protection | 49 | Polished, but zero utility for "I found an animal" — advocacy only |
| HOTAC (legacy site) | 50 | Classic-ASP pages; weak mobile; event-signup, not incident-oriented |
| Korea per-province centers | 51 | Fragmented per-province numbers; Korean-only; no unified flow |
| ASPCA (for general injuries) | 55 | Diffuse; lots of reading, no single "get help now" action; users bounce |

*(ASPCA's poison hotline is world-class; it scores low only on the general "found an injured animal" journey, where the site offers no transactional path.)*

## 1. What the best platforms consistently do well

1. **One unmistakable primary action above the fold.** AHNow's two buttons, Wildlife Victoria's giant "Report a wildlife emergency," eBird's omnipresent "Submit," Petco Love Lost's photo box. The user never wonders what to do first.
2. **Location is captured automatically, not typed.** AHNow auto-detects; TaiRON and iNaturalist pull GPS from photo EXIF; WIRES/Wildlife Victoria use map pins. Typing an address in a panic is friction the best designs eliminate.
3. **They reduce what they ask the user to know.** AHNow asks about *handling and safety*, never a diagnosis. Merlin shows its work so users trust a guess. TaiRON lets you report at a higher taxon if unsure. The burden of expertise is on the system.
4. **Time/availability awareness.** AHNow's "open right now" filter is the standout — it respects that a directory of closed offices is useless at 11pm.
5. **Trust through transparency and outcomes.** TaiRON's open-data dashboards, eBird's Status & Trends, Wildlife Center of Virginia's live Critter Cams and patient tracker, Petco Love Lost's reunion counter — visible impact converts.
6. **Education that deflects load and ranks in search.** RSPCA UK (200K self-served) and RSPB's fledgling-vs-nestling guide demonstrably prevent unnecessary "rescues" and win organic traffic on "found a baby bird" queries.
7. **Meet users on platforms they already have.** Wildlife Victoria via Snap Send Solve, Belgium via Observation.org, Austria via SPOTTERON, Project Splatter via Twitter. Distribution beats building.
8. **A friendly on-ramp separated from the rigorous core.** Merlin → eBird; Seek → iNaturalist. Novices and experts get different doors to the same data.

## 2. What the weakest platforms consistently fail to do

1. **No single front door.** Japan, Korea, and Taiwan's county system all force the user to first figure out *which* jurisdiction/page applies — a fatal first step in an emergency.
2. **Phone-only, with no digital alternative or feedback.** Norway's "call the police," 1959's per-county fragmentation, WRRC's phone intake — no online form, no status tracking, no closure of the loop.
3. **Government-CMS architecture as the public front end.** Dense tables, ASPX/Drupal sprawl, multiple migrated systems (pet.gov.tw), buried emergency info — exactly the "government website" feel Animal SOS must avoid.
4. **Advocacy/donation framing crowding out utility.** World Animal Protection and Four Paws are conversion-optimized for *campaigns*, leaving someone with an injured animal completely unserved.
5. **Stale or legacy technology that erodes trust.** Classic-ASP pages, no mobile polish, dead phone numbers in third-party listings — visitors infer the service itself is neglected.
6. **No interim guidance during wait time.** Callback-only models (and pure hotlines) leave the finder holding a suffering animal with nothing to do.
7. **Channel lock-in.** Korean-only, Facebook-login-required (TaiRON's one weakness), Chrome-only (TSPCA's report system) each exclude a slice of users.

## 3–7. Pattern comparison table

| Dimension | Top platforms consistently… | Bottom platforms consistently… | Animal SOS decision |
|---|---|---|---|
| **Design patterns** | Single-task homepage; one dominant CTA above the fold; auto-location; map-pin + photo-first reporting; big tap targets; minimal nav | Portal link-grids; dense tables; buried emergency info; carousels; multiple competing CTAs | Single coral SOS CTA; photo-first + auto-GPS; no portal grid ([Phase 6](../design/06-ui-ux-spec.md)) |
| **Content patterns** | Question-framed advice ("found a baby bird?"); do/don't decision trees; nestling-vs-fledgling clarity; SEO-targeted; plain language | PDF-only guides; legal/bureaucratic prose; advocacy copy; advice scattered or absent | Intent-named guides + structured do/don't steps reused by the AI triage engine |
| **Trust mechanisms** | Open data dashboards; outcome counters; live cams; charity/agency credentials; reunion/impact stats; partner logos | No transparency; stale content; dead links; anonymous authorship; donation-first | Live resolved-case feed; impact strip; verified-org badges; open directory data |
| **Conversion mechanisms** | "Open now" filtering; tap-to-call; one-tap photo report; SMS/email match alerts; EXIF auto-fill; submit-then-register | Multi-step forms before any value; login walls; jurisdiction-selection gates; fee surprises | Value before account (report first, register after); tap-to-call hotlines; instant guidance |
| **Onboarding mechanisms** | No-signup tiers (Seek); progressive disclosure (Merlin); plausibility-filtered inputs; friendly on-ramp → rigorous core | Expertise assumed up front; taxonomy jargon; "find your region first"; Chrome/FB/language lock-in | Anonymous-capable reporting; tap-only triage; photo shortcut; bilingual everywhere |
| **Workflow / loop closure** | Report → route to open helper → status updates → resolution; expert review of outliers; shelter-data integration | Report vanishes; no acknowledgement; no dispatch tracking; no reporter feedback | Full incident lifecycle with StatusTimeline + notifications to reporter ([Phase 7](../engineering/07-build-spec.md)) |
| **Distribution** | Piggyback existing apps; win SEO; AI-ID app as funnel; social-channel intake | Single buried gov URL; no SEO; no social presence; awareness depends on luck | SEO-first edu content; LINE bot; social monitoring; partner embeds |

## Synthesis for Animal SOS

The market is **fragmented by capability**: nobody unifies *identify → triage → dispatch → follow-up*. A finder today chains Merlin (ID) → All About Birds/ACRES (advice) → AHNow/HelpWildlife (find help) → a phone call (no outcome tracking). Every handoff loses users.

The defensible opportunity for Animal SOS is to **collapse that chain into one mobile-first flow**, taking the best single pattern from each leader:
- AHNow's **open-now location routing** and emergency/conflict split,
- Merlin's **show-your-work AI triage**,
- TaiRON's **EXIF auto-fill** and **open-data trust engine** (minus its Facebook-login lock-in),
- Wildlife Victoria's **closed-loop dispatch** plus interim guidance,
- Petco Love Lost's **consumer-grade polish and AI matching**,
- RSPCA's **triage-as-load-management** and SEO-winning education,
- and Seek/eBird's **friendly-on-ramp-to-rigorous-core** separation —

while avoiding every bottom-10 failure: no single-front-door confusion, no phone-only dead ends, no government-portal density, no advocacy-over-utility, no stale tech, no channel lock-in. The full design follows in [Phase 5 — Blueprint](../blueprint/05-blueprint.md).
