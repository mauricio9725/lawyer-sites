# Frontend summary: how the five themes differ

This document describes the **frontend only**: how the app is built and how each of the five lawyer themes (laboral, familia, penal, civil, general) is different in structure, layout, and behavior. Backend and API are out of scope.

---

## 1. Frontend architecture (shared vs theme-specific)

### Shared (same for all themes)

- **`frontend/shared/base.css`**  
  Global styles: CSS variables (`--primary`, `--accent`, `--text`, `--bg`, typography scale, shadows, radii), base components (header, hero, trust strip, help cards, problem grid, why-trust, services grid, timeline, education, cases, profile, testimonials, CTA, contact form, footer, WhatsApp float). All themes load this first.

- **`frontend/shared/app.js`**  
  Single data layer. It:
  - Fetches config from `GET /api/config/{site_key}`.
  - Applies `config.colors` to `document.documentElement` (overrides CSS variables).
  - Fills every section using fixed **IDs** (e.g. `#hero`, `#trust-wrap`, `#help-cards`, `#problem-section`, `#problem-title`, `#problem-grid`, `#problem-section-image`, `#why-trust-section`, `#why-grid`, `#services-grid`, `#timeline-list`, `#education-list`, `#cases-grid`, `#profile-photo`, `#profile-title`, `#profile-text`, `#testimonials-slider`, `#cta-wa`, `#contact-form`, footer and WhatsApp links).
  - Handles form submit, WhatsApp link updates, testimonial carousel, timeline scroll class.

**Rule:** Theme HTML must keep these IDs and structure so `app.js` can find and fill them. No changes are made to `app.js` per theme.

### Per theme (what makes each site look and behave differently)

Each theme lives under `frontend/themes/{theme}/`:

| File        | Role |
|------------|------|
| **index.html** | Page structure: order of sections, wrapper classes, optional blocks (e.g. sidebar, sticky bar, story rows). Same IDs as other themes. |
| **theme.css**  | Color palette only: `--primary`, `--primaryLight`, `--accent`, `--text`, `--bg` (and optional `--textMuted`, `--white`). Loaded after `base.css`. Note: at runtime, `app.js` overwrites these from `config.colors` when the API returns. |
| **layout.css** | Layout and visuals: grid/flex, hero height and overlay, section padding, trust/service/card layout, typography overrides, backgrounds, hover states, scroll-reveal styles. Scoped with `body.design-{theme}`. |
| **layout.js**  | Optional. Theme-specific behavior: scroll reveal (IntersectionObserver), sticky CTA show/hide, sidebar “active” section, etc. No shared logic; each theme’s script is independent. |

So: **same data and same IDs everywhere**, but **different HTML layout, different CSS layout, and different optional JS** so each theme feels like a different template.

---

## 2. How each of the five themes differs

Below is a concise, theme-by-theme breakdown of structure, layout, and interactions.

---

### Theme 1 — Laboral (`design-laboral`)

**Purpose:** Corporate, professional, trust-focused (e.g. labour law / employment).

**HTML structure**

- **Header:** Sticky bar with nav: `.site-header` with `.header-wrap`, `.header-brand` (`.name` + `.tagline`) and `.site-nav` (links: Servicios, Casos, Sobre mí, Contacto). High z-index; background blur/solid and shadow on scroll.
- **Main:** Single column. Order: hero → trust → help → problem → why-trust → services → timeline → education → cases → profile → testimonials → cta-strong → contact. All sections direct children of `<main>`; no sidebar, no story rows.
- **Hero:** Includes `#hero-lawyer-name` (filled by layout.js from profile/footer), “Ver servicios” link, and scroll indicator (↓) to `#trust-section`.
- **Sections:** Standard wrappers with usual IDs; `id="cases-section"` and `id="profile-section"` on sections for nav anchors. Class `reveal-section` for scroll reveal.
- **Global (after footer):** `.floating-lawyer-card` (photo, name, spec, `#floating-card-wa`) and `.lawyer-tooltip` (photo, text, WhatsApp). WhatsApp href synced from `.whatsapp-float` in layout.js.

**Layout (layout.css)**

- **Header:** `position: sticky`, `top: 0`, `z-index: 200`; `.scrolled` adds stronger background and shadow.
- **Hero:** Full-width, `min-height: 80vh`, background image + overlay **max 0.45** (e.g. 0.4 / 0.35). Title ~48–64px. Two buttons + “Ver servicios” + scroll indicator with bounce animation.
- **Trust:** Horizontal strip; grid of stat-style items. Cards with hover lift.
- **Content width:** `max-width: 960px`; single readable column.
- **Sections:** Generous padding (e.g. `5rem`), strong section titles. Cards: rounded, shadow, hover `translateY(-4px)`.
- **Profile:** Two columns; photo up to 320px, stronger title hierarchy. **Footer:** `.footer-name` with font-weight 700.
- **Floating card:** Fixed right 20px, bottom 80px, ~220px wide; visible after hero leaves viewport; on mobile becomes bottom bar. **Tooltip:** Fixed, follows cursor on hover over lawyer photo/name (hero, profile, floating card).

**Interactions (layout.js)**

- Scroll reveal (IntersectionObserver), header scroll class, hero name + floating card fill when content ready, sync `#floating-card-wa` from `.whatsapp-float` (MutationObserver), floating card visibility (IntersectionObserver on hero), lawyer tooltip on hover.

**Visual identity**

- Blue primary, gray accent, white/gray backgrounds. Corporate, structured, trust-focused.

---

### Theme 2 — Familia (`design-familia`)

**Purpose:** Human, warm, narrative (e.g. family law). Storytelling layout.

**HTML structure**

- **Header:** Sticky (no longer absolute): `.site-header.site-header--minimal` with `.header-wrap`, `.header-brand` and `.site-nav` (Servicios, Casos, Sobre mí, Contacto). Translucent then solid on scroll.
- **Main:** Wrapper `.story-main`. Mix of **story rows** (alternating image/text) and **full-width rows**.
  - **Story rows:** `.story-row--image-left` / `.story-row--image-right` with `.story-media` + `.story-content`. One `.story-media` has `id="problem-section-image"` for `problem_awareness.image`.
  - **Full rows:** trust (`id="trust-section"`), services, timeline, education, cases (`id="cases-section"`), profile (`id="profile-section"`), testimonials, cta, contact.
- **Hero:** `#hero-lawyer-name`, “Ver servicios”, scroll indicator (↓) to `#problem-section`.
- **Global:** `.floating-lawyer-card` and `.lawyer-tooltip` (same pattern as Laboral).

**Layout (layout.css)**

- **Header:** Sticky, z-index 200; `.scrolled` for solid background and shadow.
- **Hero:** `.hero-story`, ~80vh, image + overlay **max 0.45**. Story-media overlays (help, education) also reduced to ~0.35–0.4 so images stay visible.
- **Story rows:** 50/50 grid; `.story-media` min-height, `background-size: cover`, gradient or Unsplash fallback. Alternation via `grid-template-areas`.
- **Trust / full rows:** Centered, padding 5rem. Cards: rounded, shadow, hover lift.
- **Profile row:** Photo + text; **Footer:** `.footer-name` font-weight 700.
- **Floating card + tooltip:** Same behavior as Laboral (fixed right, bottom bar on mobile).

**Interactions (layout.js)**

- Scroll reveal, header scroll class, hero name + floating card fill, WA sync, floating card visibility, lawyer tooltip on hover (triggers: profile photo/title, hero name, floating card photo/name).

**Visual identity**

- Green/teal palette. Storytelling: alternating image and text rows; warmer, more human feel.

---

### Theme 3 — Penal (`design-penal`)

**Purpose:** Strong, serious, “premium” (e.g. criminal defence). **Only theme with sidebar navigation** (no top nav).

**HTML structure**

- **No top header.** All nav in **fixed sidebar**.
- **Sidebar:** `.design-sidebar`: `.sidebar-brand` (name + tagline), `.sidebar-nav` (links to all sections: hero, trust, help, problem, why-trust, services, timeline, education, cases, profile, testimonials, cta, contact form), `.sidebar-cta` `#sidebar-wa`.
- **Main:** `.design-main` (single column beside sidebar). Hero includes `#hero-lawyer-name`, “Ver servicios”, scroll indicator (↓). Same section IDs as other themes.
- **Global:** `.floating-lawyer-card` and `.lawyer-tooltip` (floating card on the right, in content area).

**Layout (layout.css)**

- **Sidebar:** Fixed left, 280px, dark `--primary`. Links with padding, font-weight 600 when active, 4px left border (accent). Improved typography (letter-spacing, size).
- **Hero:** Overlay **max 0.45** (was 0.9/0.8); lawyer name line, “Ver servicios”, scroll indicator with bounce.
- **Main:** `margin-left: 280px`. Sections 5rem padding. **Profile:** 320px photo column. **Footer:** `.footer-name` font-weight 700.
- **Timeline:** Staggered “in” animation (opacity + translateX) when section is visible.
- **Floating card + tooltip:** Fixed right; on mobile, card becomes bottom bar.

**Interactions (layout.js)**

- Scroll reveal, **sidebar active section** (scroll position + smooth scroll on click), hero name + floating card fill, WA sync, floating card visibility, lawyer tooltip on hover.

**Visual identity**

- Dark palette; sidebar as primary nav; strong typography and premium feel.

---

### Theme 4 — Civil (`design-civil`)

**Purpose:** Conversion-focused landing (e.g. civil / contracts). **Only theme with sticky CTA bar + inline CTA block.**

**HTML structure**

- **Header:** Sticky. `.site-header.site-header--compact` with `.header-wrap`: `.header-brand` (`.name` only, tagline hidden), `.site-nav` (Servicios, Casos, Sobre mí, Contacto), and `#header-wa-link` (WhatsApp).
- **Sticky CTA bar:** `#sticky-cta` (hidden until user scrolls past hero): text + `#sticky-cta-wa`. `app.js` updates WA links.
- **Main:** `.landing-main`. Order: hero → trust → **inline CTA** (`#cta-mid-section`, `#cta-mid-wa`) → help → problem → why-trust → services → testimonials → cta-strong → timeline → education → cases → profile → contact.
- **Hero:** `#hero-lawyer-name`, `.hero-compact` with stacked buttons (WhatsApp first), “Ver servicios”, scroll indicator (↓).
- **Global:** `.floating-lawyer-card` and `.lawyer-tooltip`.

**Layout (layout.css)**

- **Header:** Sticky, z-index 200, blur + shadow on scroll.
- **Hero:** ~80vh, overlay **max 0.45**. Stacked buttons (WhatsApp first). Lawyer name, “Ver servicios”, scroll indicator.
- **Trust:** Compact badges/pills. **Sections:** 5rem padding, alternating backgrounds.
- **Sticky bar:** Fixed top, `translateY(-100%)` until `.visible` when past hero.
- **Profile:** Photo 140px (larger than before). **Footer:** `.footer-name` font-weight 700.
- **Floating card + tooltip:** Same pattern; bottom bar on mobile.

**Interactions (layout.js)**

- Sticky CTA show/hide on scroll, scroll reveal, header scroll class, hero name + floating card fill, WA sync, floating card visibility, lawyer tooltip.

**Visual identity**

- Dark blue / gray. Conversion layout: compact header, nav + header WA, sticky bar, inline CTA, repeated CTAs, testimonials early.

---

### Theme 5 — General (`design-general`)

**Purpose:** Magazine / editorial, informative (e.g. general legal advice). **Only theme with editorial grid + article-style narrow blocks.**

**HTML structure**

- **Header:** Sticky with nav: `.site-header`, `.header-wrap`, `.header-brand` (name + tagline), `.site-nav` (Servicios, Casos, Sobre mí, Contacto).
- **Main:** `.content-grid`. `.hero-editorial`; `.grid-section` (some `--cards`, some `--article`). Same IDs (e.g. `help-cards`, `services-grid`, `profile-section`, `cases-section`).
- **Hero:** `#hero-lawyer-name`, “Ver servicios”, scroll indicator (↓).
- **Global:** `.floating-lawyer-card` and `.lawyer-tooltip`.

**Layout (layout.css)**

- **Header:** Sticky, z-index 200, shadow on scroll.
- **Hero:** `.hero-editorial`, ~80vh, overlay **max 0.45**, rounded bottom corners. Lawyer name, “Ver servicios”, scroll indicator.
- **Sections:** Alternating background per `.grid-section`, 5rem padding.
- **Cards:** **Editorial grid** (`.editorial-grid`): services/cases with optional `.service-card-image`; hover: card lift + image `scale(1.05)`.
- **Education / profile:** `.wrap--narrow`, article-style list (checkmarks). Profile photo max-width 280px. **Footer:** `.footer-name` font-weight 700.
- **Floating card + tooltip:** Same pattern; bottom bar on mobile.

**Interactions (layout.js)**

- Scroll reveal, header scroll class, hero name + floating card fill, WA sync, floating card visibility, lawyer tooltip.

**Visual identity**

- Blue, white, light gray. Magazine layout: editorial card grid, image zoom on hover, narrow article blocks.

---

## 3. Quick comparison table

| Aspect | Laboral | Familia | Penal | Civil | General |
|--------|---------|---------|--------|--------|---------|
| **Header** | Sticky, name + tagline + **nav** | Sticky minimal, name + tagline + **nav** | None (sidebar) | Sticky compact, name + **nav** + WA link | Sticky, name + tagline + **nav** |
| **Nav** | Top: Servicios, Casos, Sobre mí, Contacto | Top: same 4 links | **Sidebar** (all sections) | Top: same 4 links + header WA | Top: same 4 links |
| **Hero** | 80vh, overlay ≤0.45, lawyer name, “Ver servicios”, ↓ | 80vh, overlay ≤0.45, lawyer name, “Ver servicios”, ↓ | 80vh, overlay ≤0.45, lawyer name, “Ver servicios”, ↓ | 80vh, stacked btns (WA first), lawyer name, “Ver servicios”, ↓ | 80vh, rounded bottom, overlay ≤0.45, lawyer name, “Ver servicios”, ↓ |
| **Content layout** | Single column, max-width 960px | **Story rows** (image/text alternated) + full rows | Single column beside **sidebar** | Single column, **sticky CTA + inline CTA** | **Editorial grid** + article narrow blocks |
| **Trust** | Grid stat-style | Full row centered | Standard strip | **Badges / pills** | Inline strip |
| **Extra CTA** | — | — | **Sidebar WhatsApp** | **Sticky bar + inline CTA** (`#cta-mid-wa`) | — |
| **Floating lawyer card** | Yes (right; bottom bar mobile) | Yes | Yes | Yes | Yes |
| **Lawyer tooltip** | Yes (hover photo/name) | Yes | Yes | Yes | Yes |
| **Scroll reveal** | Yes | Yes | Yes | Yes | Yes |
| **Other** | Card hover | Card hover, **story rows** | **Sidebar active** + timeline stagger | Sticky bar show/hide | Card hover + **image zoom** |
| **Section order** | Classic | Story (problem first, help, trust, why…) | Classic | Conversion (trust → CTA → help…) | Classic |

---

## 4. What each theme has that the others don’t

| Feature | Laboral | Familia | Penal | Civil | General |
|--------|:-------:|:-------:|:-----:|:-----:|:-------:|
| **Top nav (Servicios, Casos, Sobre mí, Contacto)** | ✓ | ✓ | — | ✓ | ✓ |
| **Sidebar navigation (fixed left)** | — | — | ✓ | — | — |
| **Story rows (alternating image + text)** | — | ✓ | — | — | — |
| **`#problem-section-image` (configurable hero for problem block)** | — | ✓ | — | — | — |
| **Sticky CTA bar (after hero)** | — | — | — | ✓ | — |
| **Inline CTA block mid-page (`#cta-mid-wa`)** | — | — | — | ✓ | — |
| **Header: only name + WhatsApp (no tagline, no nav in brand)** | — | — | — | ✓ | — |
| **Stacked hero buttons (WhatsApp first)** | — | — | — | ✓ | — |
| **Editorial grid (services/cases with image zoom on hover)** | — | — | — | — | ✓ |
| **Article-style narrow blocks (`.wrap--narrow`)** | — | — | — | — | ✓ |
| **Hero with rounded bottom corners** | — | — | — | — | ✓ |
| **Sidebar WhatsApp button (`#sidebar-wa`)** | — | — | ✓ | — | — |
| **Timeline staggered “in” animation** | — | — | ✓ | — | — |
| **Trust as badges/pills (compact)** | — | — | — | ✓ | — |
| **Single column, max-width 960px (no grid)** | ✓ | — | — | — | — |

**Shared by all five (after latest UX pass):** Sticky header (where applicable), hero lawyer name, “Ver servicios” + scroll indicator, overlay max 0.45, floating lawyer card (WA synced), lawyer tooltip on hover, scroll reveal, footer name prominence, profile photo visibility.

---

## 5. Suggested improvements

Based on the current implementation and the UX/navigation work done, these are possible next steps (without changing `app.js`):

**Accessibility**

- **Focus visible:** Ensure nav links, “Ver servicios”, scroll indicator, floating card WhatsApp and tooltip links have a clear `:focus-visible` style (e.g. outline or ring) for keyboard users.
- **Reduced motion:** Respect `prefers-reduced-motion` (e.g. disable bounce on scroll indicator, reduce or disable scroll-reveal transform, keep only opacity if needed).
- **Tooltip:** Add `aria-describedby` / `role="tooltip"` and ensure tooltip doesn’t trap focus; consider closing on Escape.

**UX and robustness**

- **Tooltip position:** In layout.js, clamp tooltip position so it never goes off-screen (e.g. flip left/above when near viewport edge).
- **Floating card:** Optional “minimize” or “dismiss for this session” (e.g. `sessionStorage`) so returning users aren’t always shown the card; or a small “×” that collapses it to a small pill.
- **Mobile nav:** Laboral, Familia, Civil and General use a horizontal nav that can wrap on small screens; consider a hamburger menu below a breakpoint (e.g. 640px) for a single “Menú” that opens the same four links.
- **Back to top:** A small “Subir” or arrow that appears after the user scrolls past the hero (e.g. fixed bottom-left or next to the floating card) and smooth-scrolls to `#hero`.

**Differentiation and content**

- **Typography:** Give each theme a distinct `font-family` (e.g. Laboral: serif for titles; Familia: rounded sans; Penal: strong sans; Civil: neutral sans; General: editorial serif + sans) in `theme.css` or `layout.css` to reinforce identity.
- **Microcopy:** Ensure each theme’s default or JSON copy (hero subtitle, “Ver servicios”, CTA text) matches the tone (corporate / warm / serious / conversion / editorial).

**Performance and data**

- **Images:** Lazy-load the floating card and tooltip lawyer photo (e.g. `loading="lazy"` or copy `src` from profile only when card/tooltip is first shown or hovered).
- **Analytics (if added later):** Track which entry point led to contact (nav “Contacto”, “Ver servicios”, floating card WA, hero WA, sticky bar, etc.) to compare themes and placements.

**Penal-specific**

- **Sidebar on mobile:** Sidebar is hidden by default on small viewports; ensure there is a visible trigger (e.g. “Menú” or hamburger) that toggles `.open` so users can still navigate. (If this is already in place in HTML/JS, document it in this summary.)

---

## 6. Files to touch when changing a theme

- **Only under `frontend/themes/{theme}/`:**
  - `index.html` — structure and order (keep IDs).
  - `theme.css` — palette (optional; JSON can override).
  - `layout.css` — all layout and visual differences.
  - `layout.js` — theme-specific behavior (optional).
- **Do not change:** `frontend/shared/app.js`, backend, or API. Optional image fields (`problem_awareness.image`, `services[].image`) are supported by `app.js` and only need to be used in the theme HTML/CSS where desired (e.g. Familia’s `#problem-section-image`).

This is how the frontend is structured, how each of the five options differs in layout and interaction, what is unique per theme, and what could be improved next.
