# Phase 6 — UI/UX Specification

Mobile-first interface design for **Animal SOS (動物幫幫)**. The product must feel trustworthy, compassionate, fast, action-oriented, and community-driven — a blend of modern SaaS polish, emergency-response clarity, conservation-org warmth, and citizen-science playfulness. Explicitly **not** a government website: no portal grids, no PDF links as primary content, no bureaucratic language.

## 1. Design principles

1. **One thumb, one minute.** Every emergency path must be completable one-handed on a phone in under 60 seconds. Big tap targets (≥48px), bottom-anchored primary actions, no typing where a tap will do.
2. **Calm urgency.** Emergency UI uses high contrast and clear hierarchy, but never alarm-red panic styling. The user is already stressed; the interface is the calm friend who knows what to do.
3. **Show, don't write.** Photos, icons, and illustrated species cards over paragraphs. Text in short imperative sentences: 「先不要碰牠」("Don't touch it yet").
4. **Progressive disclosure.** Ask only what's needed to route help. Everything else (account, details, follow-up) comes after the animal is safe.
5. **Bilingual by design.** Traditional Chinese primary, English secondary, switchable everywhere; no mixed-language walls of text.

## 2. Color system

| Token | Hex | Usage |
|-------|-----|-------|
| `--sos-coral` | `#FF6B5B` | Primary action / SOS button. Warm, urgent-but-not-alarming. |
| `--sos-coral-dark` | `#E4503F` | Pressed/hover states, focus rings on coral |
| `--forest-700` | `#1E5945` | Brand primary; headers, nav, trust elements |
| `--forest-500` | `#2E7D5B` | Secondary buttons, links, success |
| `--leaf-100` | `#E8F4EC` | Soft section backgrounds, cards |
| `--sand-50` | `#FAF7F2` | Page background (warm off-white, not clinical) |
| `--ink-900` | `#1F2933` | Body text |
| `--ink-500` | `#5F6B76` | Secondary text |
| `--sky-500` | `#3B82C4` | Informational accents, map pins (sightings) |
| `--amber-500` | `#F2A93B` | Caution states ("keep distance"), pending status |
| `--white` | `#FFFFFF` | Cards, surfaces |

Semantic mapping: coral = act now; amber = caution/wait; forest = guidance/safe; sky = information/data. Never use pure red `#FF0000` (panic) or institutional blue headers (government feel).

Contrast: all text/background pairs meet WCAG AA (4.5:1); coral on white is used only at ≥18px bold or on buttons with white text checked at AA.

## 3. Typography

- **Latin:** Inter (UI), with system fallback stack. Display moments can use Inter Display.
- **Chinese:** Noto Sans TC, weights 400/500/700. Generous line-height (1.7) for TC body text.
- **Scale (mobile / desktop):** Display 32/48, H1 28/36, H2 22/28, H3 18/22, Body 16/16, Caption 13/13. Minimum body size 16px — emergency content is never smaller.
- **Tone:** Sentence case, imperative verbs on buttons (「拍照回報」 "Photo & report"), no ALL CAPS except the SOS button.

## 4. Component library

Build on **shadcn/ui + Tailwind** (tokens above as Tailwind theme), with these custom components:

| Component | Description |
|-----------|-------------|
| `SOSButton` | 64px-high pill, coral, fixed bottom-center on mobile (thumb zone), pulsing subtle halo. Label: 「動物SOS」/ "Animal SOS". Always one tap from anywhere. |
| `TriageCard` | Large tappable card with illustration + label used in the "what did you find" flow (bird / mammal / reptile / cat-dog / other). Min height 96px. |
| `SpeciesChip` | Photo thumbnail + common name + confidence % from AI ID, tappable to confirm/correct. |
| `GuidanceStep` | Numbered step with do/don't icon (green check / amber hand), one sentence, optional photo. Steps render as a vertical checklist users can tick. |
| `HotlineCard` | Org name, distance, open/closed badge, big `tel:` call button, secondary directions button. The call button is the card's whole right edge. |
| `IncidentPin` / `IncidentSheet` | Map pin + bottom sheet with photo, status (reported → dispatched → rescued/closed), timestamps. |
| `StatusTimeline` | Vertical timeline of an incident's lifecycle with actor avatars (reporter, org, volunteer). |
| `RescueOrgCard` | Directory entry: coverage area, species handled, hours, verified badge (forest check), last-active indicator. |
| `EduCard` | Article card: cover illustration, reading time, species tags, seasonal badge (e.g., 雛鳥季 fledgling season). |
| `BadgeToast` | Citizen-science gamification: contribution streaks, species count, gentle confetti (never during emergencies). |
| `AIChatBubble` | Assistant messages with structured quick-reply chips; photo upload affordance always visible in composer. |

## 5. Homepage wireframe (mobile-first)

```
┌─────────────────────────────────┐
│ ◉ 動物幫幫 Animal SOS    🌐 中/EN │  ← slim header, no mega-menu
├─────────────────────────────────┤
│  遇到需要幫助的動物嗎？           │  ← H1: "Found an animal in need?"
│  我們陪你一步一步處理。           │     reassurance subline
│                                 │
│  ┌───────────────────────────┐  │
│  │ 🆘 立即求助  GET HELP NOW │  │  ← coral SOSButton, 64px
│  └───────────────────────────┘  │
│  ┌─────────────┬─────────────┐  │
│  │📷 拍照辨識   │📍 回報目擊   │  │  ← secondary: AI photo ID /
│  └─────────────┴─────────────┘  │     report a sighting
├─────────────────────────────────┤
│  常見狀況 Common situations      │
│  [雛鳥掉落] [受傷野鳥] [路殺]     │  ← TriageCards, horizontal
│  [家附近有蛇] [受傷貓狗] [幼兔]   │     scroll, illustrated
├─────────────────────────────────┤
│  附近的救援資源 Nearby help       │
│  ⊕ map preview with org pins    │  ← tappable map → directory
├─────────────────────────────────┤
│  即時動態 Live community feed     │
│  • 台中・斑鳩 已送達救傷站 ✓      │  ← recent resolved cases =
│  • 新北・幼貓 志工前往中…        │     social proof of outcomes
├─────────────────────────────────┤
│  本季提醒 Seasonal               │
│  🐣 5–7月雛鳥季：先觀察再行動     │  ← seasonal EduCard
├─────────────────────────────────┤
│  數字會說話 Impact strip          │
│  12,840 件回報 · 312 合作單位     │  ← trust metrics
├─────────────────────────────────┤
│  footer: about / partners /      │
│  open data / volunteer / press   │
└─────────────────────────────────┘
```

Desktop: same order, hero becomes split layout (message left, live map right); SOS button moves into hero but a compact SOS affordance stays in the sticky header.

## 6. Key mobile layouts

### 6.1 Emergency triage flow (SOS tap → help)

```
Screen 1 "What did you find?"     Screen 2 "Quick check"          Screen 3 "Do this now"
┌───────────────┐                ┌───────────────┐               ┌───────────────┐
│ 你發現了什麼？  │                │ [photo of bird]│               │ ✅ 保持距離觀察 │
│ ┌────┐ ┌────┐ │                │ AI: 白頭翁 92% │               │ ✅ 準備紙箱+毛巾│
│ │ 🐦 │ │ 🐈 │ │   or            │ 牠會動嗎？     │               │ 🚫 不要餵食餵水 │
│ └────┘ └────┘ │  ┌──────────┐  │ (會跳/不太動/  │               ├───────────────┤
│ ┌────┐ ┌────┐ │  │📷 直接拍照│  │  不確定)       │               │ 📞 最近救援單位 │
│ │ 🦎 │ │ 🐇 │ │  └──────────┘  │ 有明顯外傷嗎？ │               │ HotlineCard ☎ │
│ └────┘ └────┘ │                │ (有/沒有/不確定)│               │ HotlineCard ☎ │
│  其他 / 不確定 │                │               │               │ [建立回報單→] │
└───────────────┘                └───────────────┘               └───────────────┘
```

- Photo shortcut bypasses the category picker — AI classifies and pre-fills.
- Max 3 triage questions before guidance; each is tap-only (chips, no typing).
- Screen 3 always shows guidance **before** contact options — the first minutes matter most — but the call card is visible without scrolling for true emergencies.
- A persistent 「情況危急？直接打電話」 escape hatch on every screen jumps straight to the hotline list.

### 6.2 Incident report form

Single scrolling form, photo-first: ① photo (camera opens immediately, GPS+time auto-captured from EXIF/device) ② location confirm (map pin, draggable, what3words-style plain-language fallback) ③ status chips (alive-injured / deceased / needs-watching / relocated) ④ optional note ⑤ contact (prefilled if logged in; anonymous allowed). Submit → StatusTimeline view with shareable link. Account creation is offered *after* submission, never required before.

### 6.3 Dashboards

- **Reporter dashboard:** my reports with StatusTimeline, my species contributions (citizen-science stats), badges, saved guides.
- **Rescue org dashboard (web-first):** incoming incident queue filtered by coverage area + species; map view; claim/assign/resolve actions; capacity toggle ("we're full" redirects routing); analytics (response time, outcomes); embeddable hotline widget.
- **Moderator/admin:** report verification queue, duplicate merging (same animal reported twice), data export (GBIF/Darwin Core), content CMS.

## 7. Motion & feedback

- Skeleton screens, never spinners, on emergency paths; target <1s perceived load.
- Submission success = single gentle checkmark animation + clear next step. Celebration animations (badges, streaks) only in non-emergency contexts.
- Haptic tap on SOS button press (mobile).

## 8. Accessibility & localization

- WCAG 2.2 AA. Visible focus states, full keyboard paths, `prefers-reduced-motion` respected.
- All emergency guidance written at ~6th-grade reading level in both languages; tested with screen readers (incident flow fully navigable via VoiceOver/TalkBack).
- Offline-tolerant: triage guidance pages cached via service worker — rural roadside = bad signal.
- Honorifics-free, blame-free microcopy: never imply the user caused the harm (important for roadkill reporting honesty).

## 9. What we deliberately avoid

From the bottom-10 pattern analysis (Phase 4): no homepage carousels, no donation popup before help is rendered, no PDF-only first-aid guides, no login walls before reporting, no dead phone numbers without hours listed, no government-portal link grids, no autoplay video, no tiny gray hotline text in footers.
