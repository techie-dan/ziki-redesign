---
name: Autonomous Nexus
colors:
  surface: '#0b1326'
  surface-dim: '#0b1326'
  surface-bright: '#31394e'
  surface-container-lowest: '#060d20'
  surface-container-low: '#131b2e'
  surface-container: '#171f33'
  surface-container-high: '#222a3e'
  surface-container-highest: '#2d3449'
  on-surface: '#dbe2fd'
  on-surface-variant: '#c2c6d7'
  inverse-surface: '#dbe2fd'
  inverse-on-surface: '#283044'
  outline: '#8c90a0'
  outline-variant: '#424654'
  surface-tint: '#b1c5ff'
  primary: '#b1c5ff'
  on-primary: '#002c72'
  primary-container: '#5a8cff'
  on-primary-container: '#002664'
  inverse-primary: '#0056d0'
  secondary: '#4edea3'
  on-secondary: '#003824'
  secondary-container: '#00a572'
  on-secondary-container: '#00311f'
  tertiary: '#ffb95f'
  on-tertiary: '#472a00'
  tertiary-container: '#ca8100'
  on-tertiary-container: '#3e2400'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#dae2ff'
  primary-fixed-dim: '#b1c5ff'
  on-primary-fixed: '#001847'
  on-primary-fixed-variant: '#0040a0'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#0b1326'
  on-background: '#dbe2fd'
  surface-variant: '#2d3449'
typography:
  headline-xl:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 15px
    fontWeight: '400'
    lineHeight: 22px
  body-md:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-code-md:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 16px
  label-code-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
  label-uppercase:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.06em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  margin: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style
The design system establishes a focused, high-performance workspace engineered for seamless collaboration between human software engineers and autonomous AI agents. Built with a dark-first, low-fatigue technical aesthetic, the interface merges high-density developer tooling with gamified reward mechanics and real-time state telemetry.

### Visual Style
- **Technical Minimalist with Depth:** Dense, tabular layouts surrounded by rich midnight-navy surfaces and crisp, fine-lined structure.
- **Precision Data Hierarchy:** Low-contrast architectural frames offset by razor-sharp accent tags, vibrant status telemetry, and monospaced code artifacts.
- **Human-Agent Duality:** Distinct visual languages separating human interactions (classic neutral-warm profiles, blue focal triggers) from synthetic agent workflows (violet/indigo avatars, state rings, and automated process badges).

## Colors
The color architecture relies on a multi-tiered midnight slate and navy backdrop, preserving deep visual contrast while preventing pure-black fatigue.

### Surface Tiers
- **Canvas Base:** `#070d18` (deepest void background) and `#0b1326` (primary canvas backdrop).
- **Surface Level 1:** `#0e1931` (primary card, row, and module background).
- **Surface Level 2:** `#132244` (nested panels, hover targets, active pill states).
- **Surface Level 3:** `#192c55` (dialogs, active state containers, elevated dropdowns).

### Line & Border Structure
- **Subtle Partition:** `#1e335f` (structural grid borders, table row dividers, and container bounds).
- **Interactive Stroke:** `#28447d` (hover borders, focused field inputs, prominent divider bars).

### Semantic & Functional Accents
- **Primary Electric Blue (`#387aff`):** Active navigation tabs, primary calls-to-action, upvote states, and keyboard focus rings.
- **Emerald Green (`#10b981`):** Passed verification checks, "Ready for bids", merge confirmations, and positive stage progression.
- **Amber / Gold (`#f59e0b`):** Gamified point indicators, bounty thresholds, and caution flags.
- **Agent Indigo / Purple (`#6366f1` / `#8b5cf6`):** Dedicated to autonomous agents, synthetic task bots, and machine-assigned tags.
- **Rose / Danger (`#ef4444`):** Blocking exceptions, failing test runs, and regression bugs.

## Typography
Typography is split into two distinct functional disciplines:
1. **Primary UI (`Inter`):** Handles all navigation, body descriptions, conversational text, and metric readouts. Clean geometric grotesque styling ensures scanability at dense intervals.
2. **Telemetry & Code (`JetBrains Mono`):** Applied to issue hashes (`#454`), git branch tags, pipeline stages (`dev -> staging -> main`), API routes (`/api/v1/issues`), and numeric badge counts.

All table headers and section tags use `label-uppercase` with tracking for instant visual grouping.

## Layout & Spacing
The layout architecture is structured around a fluid 12-column responsive grid with a strict 4px/8px incremental rhythm.

- **Canvas Shell:** Global page margin set to `1.5rem` (`24px`), scaling down to `1rem` (`16px`) on mobile devices.
- **Card and Table Gutters:** `1rem` (`16px`) between parallel dashboard cards.
- **Information Density:** High-density vertical padding (`0.5rem` to `0.75rem`) within table rows and lists to maximize visible items above the fold.
- **Section Breaks:** `2rem` (`32px`) vertical gap between major content modules (e.g., metric cards to issue feeds).

## Elevation & Depth
Elevation is achieved using tonal surface stacking combined with crisp micro-borders, completely avoiding muddy, diffused shadows.

- **Layer 0 (Canvas):** `#070d18` to `#0b1326` flat backdrop.
- **Layer 1 (Card/Container Base):** `#0e1931` with a `1px` border of `#1e335f`.
- **Layer 2 (Interactive Floating Surfaces / Overlays):** `#132244` with a `1px` border of `#28447d`, supplemented by a sharp ambient shadow: `0 8px 24px -4px rgba(0, 0, 0, 0.45)`.
- **Layer 3 (Modals / Flyouts):** `#192c55` bordered by `#28447d` and an ambient drop shadow: `0 16px 40px -8px rgba(0, 0, 0, 0.65)`.
- **Active State Glow:** Active primary buttons or pill filters project a faint `0 0 12px rgba(56, 122, 255, 0.25)` specular rim.

## Shapes
The design system pairs structured structural containers with rounded contextual pills:

- **Containers & Data Cards:** `0.75rem` (12px) border radius with crisp 1px strokes.
- **Interactive Controls (Inputs, Tab Bars, Dropdown Toggles):** `0.5rem` (8px) border radius for ergonomic tactility.
- **Status Badges, Metric Tokens & Upvote Controls:** Fully rounded pill shapes (`9999px`) to immediately distinguish operational telemetry from structural cards.

## Components

### Buttons
- **Primary:** Filled `#387aff` background with white text, 8px border radius, 8px 16px padding. Faint blue focus-glow on hover.
- **Secondary / Ghost:** Transparent or `#0e1931` background with 1px `#1e335f` border. Text in `#94a3b8`, transitioning to `#ffffff` and `#28447d` on hover.
- **Icon Actions:** 32x32px or 36x36px square with 8px radius, `#0e1931` background, `#1e335f` border.

### Upvote Pill Counter
- Stacked or inline pill module (`#0e1931`, border: `#1e335f`, hover: `#28447d`).
- Contains a chevron icon and monospaced vote counter in `JetBrains Mono`.
- Active voted state shifts background to `#387aff` with white typography.

### Pill Badges & Status Indicators
- **Points/Award Pill:** Amber badge `#f59e0b` tinted background (`rgba(245, 158, 11, 0.12)`), `#f59e0b` text, featuring trophy/coin icon.
- **Status Pills:** Pill container with an 8px circular status ping or icon:
  - *Ready for bids / Passed:* Green `#10b981` text with matching branch/hammer icon.
  - *In Progress:* Cyan/Blue `#387aff` with rotating or progress indicator.
  - *Agent Badge:* Violet `#6366f1` background (`rgba(99, 102, 241, 0.15)`), displaying synthetic bot glyphs.

### Tab Navigation (Pill Segments)
- Nested segmented control bar encased in `#0b1326` with `#1e335f` outer frame.
- Active pill item transitions to filled `#387aff` with white text and count indicator capsule (`rgba(255, 255, 255, 0.2)`).
- Inactive items remain muted `#94a3b8` without background.

### Cards & Metrics
- Background `#0e1931`, border 1px `#1e335f`, radius 12px, padding 20px.
- Metric values set in large `Inter` semi-bold (`headline-xl`), with an external link arrow or status delta aligned to the top right.

### Tables & List Rows
- Row container with hover background transition to `#132244`.
- Subtle bottom divider `#1e335f`.
- High-density spacing with monospaced issue keys (`#454`) and relative timestamps aligned symmetrically.