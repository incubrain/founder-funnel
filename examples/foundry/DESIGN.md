---
name: Foundry — Signal Station
description: Observatory strip-chart station — a smoked-drum seismogram recording the agent-traffic transition.
colors:
  soot: "#141110"
  soot-raised: "#1b1714"
  soot-plate: "#26201b"
  scratch-light: "#f2efe6"
  scratch-dim: "#beb7a6"
  scratch-faint: "#8f887a"
  vermilion: "#e33d24"
  vermilion-bright: "#ff5a3c"
  graticule: "rgba(242, 239, 230, 0.13)"
  graticule-label: "#98917f"
typography:
  display:
    fontFamily: "Big Shoulders, Archivo Narrow, Arial Narrow, sans-serif"
    fontSize: "clamp(2.6rem, 7vw, 5.6rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "0.01em"
  headline:
    fontFamily: "Big Shoulders, Archivo Narrow, Arial Narrow, sans-serif"
    fontSize: "clamp(1.9rem, 4vw, 3.2rem)"
    fontWeight: 700
    lineHeight: 0.92
    letterSpacing: "0.01em"
  body:
    fontFamily: "Archivo, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.625
  readout:
    fontFamily: "Martian Mono, Courier New, monospace"
    fontSize: "0.72rem"
    fontWeight: 400
    letterSpacing: "0.04em"
  label:
    fontFamily: "Martian Mono, Courier New, monospace"
    fontSize: "0.66rem"
    fontWeight: 400
    letterSpacing: "0.14em"
rounded:
  none: "0px"
spacing:
  gutter: "1.25rem"
  gutter-wide: "2rem"
  section: "3.5rem"
  section-wide: "5rem"
  plate-gap: "2.5rem"
components:
  button-install:
    backgroundColor: "transparent"
    textColor: "{colors.scratch-light}"
    rounded: "{rounded.none}"
    padding: "16px 20px"
  button-install-hover:
    backgroundColor: "{colors.vermilion}"
    textColor: "{colors.soot}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.scratch-dim}"
    rounded: "{rounded.none}"
    padding: "12px 20px"
  button-ghost-hover:
    backgroundColor: "{colors.scratch-light}"
    textColor: "{colors.soot}"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.scratch-dim}"
    typography: "{typography.label}"
    padding: "4px 8px"
  nav-link-hover:
    backgroundColor: "{colors.scratch-light}"
    textColor: "{colors.soot}"
---

# Design System: Foundry — Signal Station

## Overview

**Creative North Star: "The Smoked-Drum Seismogram"**

This site is an observatory strip-chart station recording the agent-traffic transition. The ground is soot — a smoked drum surface, textured, never a flat dark-mode gray. Everything drawn on it is one of exactly three inks: light scratched out of the deposit, a dim tint of that same light, and vermilion event ink reserved for alarm and action. The instrument is the interface: the sticky masthead carries the station name, a blinking REC lamp, and a live UTC clock; the hero is a full-bleed drum trace of real project events; sections are plates on a single ruled record, each hung off one governing datum rail. It explicitly refuses the dark dev-tool hero with three feature cards that this category ships.

Density is archival, not spacious-SaaS: hairline graticule rules separate every section, monospace readouts annotate everything, and copy reads like a station log. Interaction is mechanical — states flip fully from ground to ink like a stamped plate, with no fades, no easing on state change, no soft glows. Motion is rationed to two authored moments (the hero trace drawing on, the REC lamp blinking), both guarded by `prefers-reduced-motion`.

**Key Characteristics:**
- Two inks + one alarm color, total; zero gradients anywhere
- Soot ground carries a real grain texture (inline SVG noise on `body`, produced soot-film raster on the drum)
- Condensed uppercase display type at line-height 0.92; monospace readouts everywhere else
- Full-inversion hover/active states — `transition: none`, ink and ground swap
- One governing datum rail down the left of the whole record, with vermilion plate ticks
- Square corners everywhere; the only circle on the page is the REC lamp

## Colors

A three-ink system on a smoked ground: every non-soot color is either the scratch-light, a tint of it, or vermilion.

### Primary
- **Vermilion Event Ink** (#e33d24, `--st-verm`): the single alarm/accent color. Used for event marks on the drum, plate ticks, stat rules, the crossover point on FIG. 1, the REC lamp, install-button borders and labels, `::selection`, `caret-color`, `accent-color`, and `:focus-visible` outlines. It marks *events and actions*, never decoration.
- **Vermilion Bright** (#ff5a3c, `--st-verm-bright`): reserved high-energy step of the same ink; rarely drawn.

### Neutral
- **Soot Ground** (#141110, `--st-soot`): the page ground — always textured with the soot grain, never presented as flat black.
- **Soot Raised** (#1b1714, `--st-soot-2`) / **Soot Plate** (#26201b, `--st-soot-3`): warmer soot steps for raised/elevated surfaces (Nuxt UI `--ui-bg-muted` / `--ui-bg-elevated`) and the scrollbar track/thumb.
- **Scratch Light** (#f2efe6, `--st-light`): the primary ink — headlines, the hero trace, key values. Reads as light scratched out of the soot deposit.
- **Scratch Dim** (#beb7a6, `--st-dim`): secondary ink for body copy and nav — a tint of the light, never a gray.
- **Scratch Faint** (#8f887a, `--st-faint`): dimmest text step (`--ui-text-dimmed`).
- **Graticule** (rgba(242, 239, 230, 0.13), `--st-grat`): hairline ruled lines — section borders, chart grids, the datum rail, quiet component borders.
- **Graticule Label** (#98917f, `--st-grat-label`): plate labels and axis annotations.

### Named Rules
**The Two-Inks Rule.** Every color on the page is soot, the scratch-light family (light → dim → faint → graticule), or vermilion. No third hue, no blue-grays, no green/success colors, no gradients of any kind.

**The Event-Ink Rule.** Vermilion marks events and actions only: a tick on the drum, a datum tick, an install command, a recording lamp. If it isn't an event or an action, it isn't vermilion.

## Typography

**Display Font:** Big Shoulders (with Archivo Narrow, Arial Narrow fallback)
**Body Font:** Archivo (with system-ui fallback)
**Label/Mono Font:** Martian Mono (with Courier New fallback)

**Character:** Condensed industrial caps stamped over an instrument's monospace annotations. Display type is always uppercase, bold (700), and tight (line-height 0.92); everything metadata-like — plates, dates, captions, commands, the UTC clock — is Martian Mono in small sizes with wide tracking.

### Hierarchy
- **Display** (`.st-display`, 700, clamp(2.6rem, 7vw, 5.6rem) on the hero h1, line-height 0.92, uppercase, 0.01em tracking): the station headline; also clamp(2.2rem, 6vw, 4.6rem) on the closing tag headline.
- **Headline** (`.st-display` at section scale, 700, clamp(1.9rem, 4vw, 3.2rem)): plate titles (section h2), always paired with a mono plate label above.
- **Title** (`.st-display` at text-lg/text-3xl): FAQ summaries and stat values reuse the display voice at small sizes rather than introducing a title face.
- **Body** (Archivo 400, 1rem–1.125rem, line-height ~1.6, max 52–70ch): station-log prose, always in Scratch Dim.
- **Readout** (`.st-mono`, Martian Mono, 0.72rem, 0.04em tracking, Scratch Dim): figcaptions, colophon, footer, event labels; drops to 0.58–0.68rem in dense strips.
- **Label** (`.st-mono-label`, Martian Mono, 0.66rem, 0.14em tracking, uppercase, Graticule Label): plate numbers ("PLATE II — THE LOOP"), axis labels, button micro-labels.

### Named Rules
**The Plate-Label Rule.** Every section opens with a mono plate label (`.st-mono-label`) above its display headline — "FIG. 1 — THE READING", "PLATE II — THE LOOP". The label is the section's catalog number, not a marketing kicker: it names the plate in the record's own numbering voice.

**The Annotation Rule.** Anything that reads as instrument metadata — dates, commands, sources, captions, the clock — is Martian Mono. Archivo is only for narrative prose.

## Layout

One continuous vertical record. Sections stack full-width, each closed by a hairline graticule rule (`border-b` in `--st-grat`); inner content sits in a 12-column grid (`md:grid-cols-12`, gap 2.5rem) with gutters of 1.25rem (2rem from `sm:`). Section rhythm is 3.5rem vertical padding, 5rem from `md:`. There is no boxed container: content is bounded by an 80rem-centered datum instead.

**The Datum Rail.** One vertical hairline (`.st-datum::before`) runs the full height of the record at `max(1.25rem, calc(50vw - 40rem))` (1rem on ≤640px viewports). Section plates hang off it via `.st-plate-tick` — a 0.95rem vermilion tick extending left from each plate label onto the rail. This one line is the page's spine; nothing else provides global alignment.

Typical plate split: label + headline + prose in `md:col-span-4/5`, the figure or content in the remaining 7–8 columns. The masthead is a sticky single-strip header (station name / anchor nav / REC lamp + live UTC); the footer is a matching single strip. On mobile, instrument tables collapse to two-column grids (`.st-table-stack`) and the drum's event labels move to a horizontal ticker.

## Elevation & Depth

No shadows anywhere. Depth is material, not lit: the soot ground carries grain (inline SVG turbulence noise tiled on `body`, scrolling with the record), the hero drum band uses the produced `public/textures/soot-film.jpg` raster (1600×400 repeat) so light reads as scratched from deposit rather than drawn on flat hex, and the hero trace gets a faint blurred halo pass (same path, 3.4px stroke at 0.28 opacity, 2.2px blur) under the sharp 1.6px stroke. Raised UI surfaces step to the warmer soot tones (#1b1714, #26201b). Hierarchy otherwise comes from hairline graticule rules and ink weight.

### Named Rules
**The No-Lamp Rule.** No box-shadows, no glows, no elevation blur on UI. The only "light" on the page is ink scratched out of soot.

## Shapes

Square everything. Border-radius is 0 on every button, plate, input, label chip, and card — the world is ruled plates and stamped tags, not pills. Borders are 1px hairlines: graticule-tinted (`--st-grat`) for quiet frames, scratch-light or vermilion for actionable edges. The single sanctioned circle is the 8px REC lamp dot in the masthead. Charts and the drum are drawn SVG with visible graticule grids; recorded data uses solid strokes, projections use dashed strokes (`6 6`), and event marks are dashed vermilion verticals.

## Components

### Buttons (bordered plates)
- **Shape:** square (0 radius), 1px border, generous plate padding (~1.25rem–1.5rem x, ~1rem–1.25rem y).
- **Primary (install tag):** transparent on soot, border in Scratch Light or Vermilion, two-line content — a vermilion `.st-mono-label` micro-label ("install · click to copy") over a mono command line (`$ npm i @incubrain/foundry`). Click copies to clipboard; the label swaps to "copied to clipboard" for 2s.
- **Hover / Focus:** full inversion via `.st-invert-verm` — background snaps to Vermilion, text to Soot, `transition: none`. Focus additionally gets the global 2px vermilion `:focus-visible` outline (offset 2px).
- **Ghost (GitHub / secondary):** same plate, graticule border, mono text in Scratch Dim; `.st-invert` hover inverts to Scratch Light ground with Soot text.

### Navigation
- **Masthead:** sticky, soot ground, bottom graticule rule. Station name in `.st-mono-label` (Scratch Light), anchor links in uppercase mono 0.66rem (Scratch Dim) with `.st-invert` hover, right cluster = social icons + blinking vermilion REC lamp + live UTC clock in `<time>`. Nav hides below `md:`; no hamburger, the page is one record.
- **Footer:** single mono strip — copyright/license left, uppercase social links (`.st-invert`) and layer version right.

### FAQ (native details)
- **Style:** zero-JS `<details class="st-details">` rows separated by graticule top rules; summary pairs a display-voice question with a mono `+`/`−` mark (CSS content swap).
- **Open state:** the entire summary inverts — Scratch Light ground, Soot text — the stamped-plate state grammar applied to disclosure.

### Plate header (recurring pattern)
- `.st-plate-tick` wrapper → `.st-mono-label` plate number → `.st-display` headline (clamp(1.9rem, 4vw, 3.2rem)) → optional Scratch Dim body at max ~58ch. Stats sit as vermilion-left-bordered entries: display-voice value over dim claim with a mono bracketed source link.

### The Drum (signature component)
Full-bleed SVG seismogram band on the soot-film raster: graticule grid, scratch-light trace of real project events (halo pass + sharp pass, draw-on animation `st-trace-draw` 5.5s `cubic-bezier(0.16, 1, 0.3, 1)`, reduced-motion-guarded), dashed vermilion event verticals, and positioned event tags (date in vermilion mono over label in light mono, `.st-invert-verm` hover). Every section reports visibility through `useSectionSignal` — the page instruments itself.

## Do's and Don'ts

### Do:
- **Do** keep every color inside the three-ink system: soot ground, scratch-light family, vermilion — and reserve vermilion for events and actions.
- **Do** use full-inversion states (`.st-invert` / `.st-invert-verm`, `transition: none`) for every interactive element; the snap is the world's mechanics.
- **Do** open every new section with a mono plate label on a `.st-plate-tick` hung off the datum rail, and close it with a graticule `border-b`.
- **Do** draw data as SVG on a graticule grid: solid strokes for recorded values, dashed for projections, dashed vermilion verticals for events.
- **Do** guard any new animation with `prefers-reduced-motion: reduce`; the budget is two moments (trace draw-on, REC blink) and additions need to earn it.
- **Do** keep new sections legible without JavaScript (native `<details>`, SSR markup, selectable command text) — agents are half the readership.

### Don't:
- **Don't** use gradients, box-shadows, glows, or blur on UI surfaces — depth comes from soot texture and ink weight only.
- **Don't** round corners; the only circle is the REC lamp.
- **Don't** introduce a third hue (no blue-grays, no success-green, no warning-yellow); tint everything from #f2efe6 or use vermilion.
- **Don't** fade or ease state changes — no opacity hovers, no color transitions; states flip.
- **Don't** present soot as flat hex on large surfaces: the body grain or the soot-film raster must carry the ground.
- **Don't** reuse the legacy layer sections (`section/Hero.vue`, `section/Offer.vue`) on this surface — their gradients, rounded cards, and shadows are off-world.
