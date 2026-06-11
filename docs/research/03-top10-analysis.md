# Phase 3 — Top 10 Analysis

Applying the [Phase 2 scoring framework](02-scoring-framework.md) to the 76 platforms, ranked by weighted total (0–100). Because Animal SOS spans emergency triage, directory, citizen science, and reporting at once, the platforms that score well *across* the framework are the most instructive teachers — but each entry below also notes the single thing it does better than anyone.

## Scored leaderboard (top 10 + key comparators)

| Rank | Platform | Reporting | Speed | Mobile | UX | Trust | IA | Edu | Workflow | Design | CitSci | **Weighted** |
|---:|---|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| 1 | Animal Help Now | 5 | 5 | 5 | 4 | 4 | 4 | 3 | 5 | 3 | 2 | **82** |
| 2 | iNaturalist (+Seek) | 5 | 3 | 5 | 4 | 5 | 4 | 4 | 3 | 4 | 5 | **80** |
| 3 | WIRES | 4 | 5 | 5 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | **79** |
| 4 | Merlin Bird ID | 5 | 4 | 5 | 5 | 5 | 4 | 4 | 2 | 4 | 4 | **78** |
| 5 | RSPCA (UK) | 4 | 4 | 4 | 4 | 5 | 4 | 5 | 5 | 4 | 2 | **77** |
| 6 | Wildlife Victoria | 4 | 5 | 4 | 4 | 5 | 4 | 4 | 5 | 4 | 3 | **76** |
| 7 | TaiRON (路殺社) | 5 | 3 | 4 | 4 | 5 | 3 | 4 | 3 | 3 | 5 | **74** |
| 8 | Petco Love Lost | 5 | 4 | 5 | 4 | 4 | 3 | 2 | 4 | 4 | 1 | **73** |
| 9 | HelpWildlife.co.uk | 4 | 4 | 3 | 4 | 4 | 4 | 4 | 4 | 2 | 2 | **70** |
| 10 | eBird (+Merlin) | 4 | 3 | 5 | 4 | 5 | 4 | 4 | 3 | 4 | 5 | **70** |
| — | SPCA Hong Kong | 4 | 4 | 3 | 3 | 5 | 3 | 3 | 5 | 3 | 1 | 68 |
| — | 1959 (Taiwan) | 3 | 4 | 2 | 3 | 5 | 3 | 3 | 4 | 2 | 1 | 60 |

*(Remaining criteria — community, accessibility, SEO, traffic — are folded into the weighted total but omitted from the table for width.)*

---

## 1. Animal Help Now (ahnow.org) — 82

The purest expression of "wildlife 911," and the closest existing model for the Animal SOS emergency path.

- **Homepage breakdown:** A single task screen. Confirm your location (auto-detected on mobile), then tap one of two large buttons — **Wildlife Emergency** or **Wildlife Conflict**. No carousel, no donation wall, no nav distraction. The page *is* the tool.
- **Navigation:** Minimal secondary nav (About, Resources, News, Blog, Apps, Feedback). Everything serves the one job.
- **User journey:** Open → location detected → tap Emergency → optionally specify animal type (marine mammal routes differently) → ranked list of nearest helpers **filtered to who is open right now** → tap-to-call. ~10 seconds to a dialable number.
- **Strengths:** Fastest time-to-phone-number of any platform reviewed; uniquely solves "is it open right now?" that static directories ignore; separates *emergency* from *conflict* (a raccoon in the attic is not a medical emergency) and vets conflict operators for humane methods.
- **Weaknesses:** Dated visual design; low brand awareness (~49K Android installs) means in-the-moment discoverability depends on prior install or a lucky Google search; no follow-up loop — its role ends at connection, so it can't confirm the listed org actually responded.
- **Copy:** The two-track split (emergency vs conflict), open-now filtering, single-task homepage, tap-to-call.
- **Avoid:** Letting the brand/design feel like abandonware; the dead-end with no outcome tracking.

## 2. iNaturalist + Seek (inaturalist.org) — 80

The gold standard for species identification and the citizen-science data flywheel.

- **Homepage breakdown:** Logged-out hero ("A Community for Naturalists") + sign-up CTA, a live recent-observations feed (social proof of activity), and featured projects. Logged in, a green **Upload** button dominates the header.
- **Navigation:** Observations · Explore/Community · Identify · Projects · More — verb-based and stable.
- **User journey:** Upload photo → date/location auto-pulled from EXIF → accept a computer-vision suggestion or pick a coarse taxon → save → community upgrades it to Research Grade → flows to GBIF. **Seek** is the friction-free sibling: real-time on-device camera ID, no account, location never stored — built for kids and casual users.
- **Strengths:** Best-in-class ID accuracy (CV + a global expert crowd); the labeling community continuously improves the model; transparent open-data provenance builds deep institutional trust; clean cross-platform apps.
- **Weaknesses:** Zero emergency/rescue function — wrong tool when an animal is dying now; taxonomy/data-grade jargon intimidates newcomers.
- **Copy:** EXIF auto-fill; Seek's no-signup, privacy-first, gamified on-ramp; the confirm-a-suggestion ID UX; Darwin Core → GBIF pipeline.
- **Avoid:** Jargon-heavy onboarding; assuming users want to learn taxonomy before they can act.

## 3. WIRES (wires.org.au) — 79

Australia's largest wildlife rescue and the best example of multi-channel emergency intake from a single org.

- **Homepage breakdown:** Rescue-imagery hero with the 1300 094 737 number prominent; clear paths to Report a Rescue, Wildlife Information, and (heavily) Donate.
- **Navigation:** Wildlife Rescue · Report a Rescue · Wildlife Information · About · Get Involved · Donate.
- **User journey:** Homepage → "Report a Rescue" or call (24/7). Site nudges you to read **Emergency Advice** first to safely contain the animal. Phone → operator triages and dispatches a trained volunteer or directs to a vet. App → submit species, photo, location; can route you to the nearest 24-hr vet as self-service.
- **Strengths:** Genuine 24/7 coverage; truly multi-channel (phone / app / web form / dedicated vet form); the app's photo-ID and vet-finder cut friction; strong post-bushfire brand and donor trust.
- **Weaknesses:** Coverage deepest in NSW (interstate users get re-referred); hotline saturates during disaster peaks; volunteer-dependent response times vary.
- **Copy:** Advice-before-form nudge; the app's nearest-24hr-vet finder; dedicated vet-reporting channel.
- **Avoid:** Donation prominence competing with the emergency path; geographic promises the volunteer base can't always keep.

## 4. Merlin Bird ID (merlin.allaboutbirds.org) — 78

The best consumer AI-identification UX in existence — the template for trustworthy AI triage.

- **Homepage/app breakdown:** Three entry paths surfaced immediately — Sound ID, Photo ID, and a 5-question wizard (size, color, behavior, location, date).
- **User journey:** Tap Sound ID → a live scrolling **spectrogram** appears as the model listens → detected species light up in real time → you compare against reference recordings → confirm. The spectrogram is the genius move: it "shows its work," so users trust an AI guess they can visually verify.
- **Strengths:** Best-in-class progressive disclosure; fully offline after downloading packs; reassuring transparency; graceful fallback wizard when the primary signal is weak.
- **Weaknesses:** Can over/under-suggest in noisy conditions; relies on user judgment for the final call; single-taxon (birds only).
- **Copy:** Real-time "show your work" confidence display; multiple input paths to the same answer; offline-first; the wizard fallback.
- **Avoid:** Over-trusting a single AI guess on high-stakes IDs (see SnakeSnap for the venomous-species counter-pattern).

## 5. RSPCA UK (rspca.org.uk) — 77

The benchmark for triage-as-load-management and educational content that ranks.

- **Homepage breakdown:** Utility bar (search, donate); primary nav; seasonal-campaign hero; a prominent yellow **Report a concern** entry point; then adoption, advice, news, donate blocks.
- **Navigation:** What we do · Advice and welfare · Adopt a pet · Get involved · Report a concern.
- **User journey:** Most users arrive from Google directly on an advice page ("found an injured X"). The "Report a concern" flow is a **decision tree** that pushes self-service first — for a small injured wild animal, the official advice is "take it to your nearest vet yourself," explicitly to keep inspectors free for cruelty cases. Genuine cruelty/emergency routes to online chat or the 0300 line, where callers answer prioritization questions before an officer is dispatched.
- **Strengths:** Enormous brand trust; data-backed triage that deflected 200,000+ low-acuity cases to self-service; advice content ranks #1 organically for nearly every "found injured X" UK query.
- **Weaknesses:** Phone-line congestion is notorious; the self-service-first flow can feel like deflection; semi-independent branch sites fragment the UX; cruelty line not 24/7.
- **Copy:** SEO-winning question-based advice articles; the triage decision tree that deflects load; one clear "Report a concern" CTA.
- **Avoid:** Making genuine emergencies feel deflected; brand/site fragmentation across regions.

## 6. Wildlife Victoria (wildlifevictoria.org.au) — 76

The cleanest "report → callback → dispatch" loop reviewed, plus the smartest distribution trick.

- **Homepage breakdown:** Emergency number at the top of every page; a giant "Report a wildlife emergency" hero CTA; impact stats; acknowledgement-of-country footer.
- **User journey:** Tap the big button or call (03) 8400 7300 → online form (location via map/GPS, species, condition, photos, contact) → **an operator calls you back shortly after lodgement** to advise or dispatch a trained volunteer; serious cases route to vets/Zoos Victoria. Alternative: report via **Snap Send Solve**, a civic app people already have, auto-geotagged to Wildlife Victoria.
- **Strengths:** Best closed-loop dispatch model; the Snap Send Solve integration is a masterclass in meeting users where they already are instead of demanding a new app install.
- **Weaknesses:** Victoria-only; the callback model leaves the finder waiting without immediate guidance unless they find the advice pages; peak-season overload.
- **Copy:** Emergency number on every page; one dominant report CTA; piggybacking on an existing mainstream app for distribution.
- **Avoid:** Callback-only with no interim guidance (the animal is suffering while the finder waits).

## 7. TaiRON / 路殺社 (roadkill.tw) — 74

The most relevant Taiwan comparable and the regional gold standard for low-friction incident capture.

- **Homepage breakdown:** News, About, How to Participate/Upload, the report web app, Data Query, a data-visualization dashboard, results reports, and downloads — a research-community portal.
- **User journey:** Photograph the carcass (GPS + geotagging on) → move it off-road to prevent secondary roadkill → later, open 線上回報 → **log in via Facebook** → select photo → system auto-fills date + coordinates from EXIF → confirm → submit. Or just post to the Facebook group, where experts ID the species.
- **Strengths:** Near-zero-friction reporting via EXIF auto-fill (the regional gold standard); strong community feedback loop; genuinely open data feeding real research (rabies surveillance, pesticide detection, road-fence retrofits) — which builds enormous credibility.
- **Weaknesses:** Facebook-login dependency excludes non-FB users (the clearest opening for a competitor); no native app since 2017; information-dense, research-oriented layout overwhelms first-time reporters.
- **Copy:** EXIF auto date/GPS fill; open-data dashboard as a trust engine; the "move the carcass to prevent secondary roadkill" safety coaching.
- **Avoid:** Hard dependency on a single third-party login; research-portal density as the front door for panicked lay users.

## 8. Petco Love Lost (lost.petcolove.org) — 73

The most commercially mature consumer UX in the whole cohort — a model the wildlife space hasn't matched.

- **Homepage breakdown:** Two primary CTAs — Report a Lost Pet, Report/Search a Found Pet — plus a photo-upload search box and reunion stories as social proof.
- **User journey:** Upload a clear photo → **patented facial-recognition AI** instantly searches the national database and surfaces candidate matches → add details → if no match, broadcast a Found alert to the area and opted-in users → SMS/email when a match or message arrives. Shelter intake auto-enters newly impounded strays into the match pool.
- **Strengths:** The photo-match removes the hardest step (describing/searching); strongest reunite-rate claim in the category (100,000+); free and shelter-integrated, so network effects compound.
- **Weaknesses:** Match quality depends on photo clarity and on the other party also being in the system (coverage gaps in low-participation regions); confusing sub-brand/domain sprawl.
- **Copy:** AI photo-matching to eliminate manual search; real-time match alerts; shelter-system data integration; reunion stories as conversion proof.
- **Avoid:** Domain/sub-brand fragmentation that disorients users mid-task.

## 9. HelpWildlife.co.uk — 70

The hand-built version of what Animal SOS should automate: the directory that answers "who near me will actually take this animal."

- **Homepage breakdown:** Tagline "Helping You to Help Them"; an immediate location-search box / "Find a rescue" CTA; species-categorized advice; minimal donation pressure.
- **User journey:** Land (usually from Google) → enter postcode → "Find a rescue" → distance-sorted results filterable by species, each with phone and species handled → advice pages teach you to contain the animal and what to say when calling → no luck? Escalate through small rescues and national lines to a human **HelpDesk** that consults private directory tiers.
- **Strengths:** Solves the single hardest problem in the sector — which nearby rescue will actually accept *this* animal — that no big charity solves; layered fallbacks mean users rarely dead-end.
- **Weaknesses:** Volunteer-run, so listing freshness depends on rescues self-updating; dated design and limited mobile polish; signposting only — no dispatch, no app.
- **Copy:** Distance-sorted, species-filtered directory; the tiered human-fallback HelpDesk; "what to say when you call" coaching.
- **Avoid:** Stale listings from no liveness checks; design that undermines trust.

## 10. eBird + Merlin (ebird.org) — 70

The proof that rigorous citizen-science data and a friendly consumer on-ramp can coexist — if you separate them.

- **Homepage breakdown:** "Discover a new world of birding" hero; **Submit** is the load-bearing action on every page; Explore tools (hotspots, range maps, Status & Trends).
- **User journey:** Submit → choose where you birded (map/hotspot) → date/effort → enter species with region/season-aware plausibility filtering → submit → expert reviewers follow up on rare records. The general public enters through **Merlin** (ID) and graduates to eBird (structured data).
- **Strengths:** Unmatched scientific rigor and scale (2B+ observations); the effort metadata makes the data uniquely powerful; Merlin is an exceptional approachable funnel.
- **Weaknesses:** eBird proper has a steep, birder-jargon learning curve — not for casual finders; no welfare/rescue dimension.
- **Copy:** The two-tier design — friendly ID app (Merlin) feeding a rigorous data platform (eBird); plausibility filtering to keep data clean; expert review of outliers.
- **Avoid:** Exposing casual users to the rigorous-data complexity; assuming one interface fits both novices and experts.

---

### Why these ten

They collectively cover every capability Animal SOS needs: **emergency routing** (AHNow, WIRES, Wildlife Victoria), **AI identification and triage UX** (Merlin, iNaturalist/Seek), **low-friction incident capture and open data** (TaiRON, eBird), **the directory problem** (HelpWildlife), **consumer-grade polish and AI matching** (Petco Love Lost), and **triage-as-load-management with SEO-winning education** (RSPCA UK). The Taiwan-specific incumbents (1959, SPCA HK) score lower on digital experience precisely because of the gaps Animal SOS exists to fill — see [Phase 4](04-comparative-analysis.md).
