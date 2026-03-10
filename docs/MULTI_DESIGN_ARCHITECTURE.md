# Multi-Design Website Generator – Architecture

This document describes how Lawyer Sites is extended from a single-layout system to a **multi-template generator** where each site type (laboral, familia, penal, civil, general) has a **distinct visual experience and navigation**, while keeping the same backend and JSON configuration.

---

## 1. Folder Structure

### Current (unchanged)

```
lawyer-sites/
├── backend/                    # No changes
├── config/sites/{site_key}.json
├── frontend/
│   ├── shared/
│   │   ├── base.css            # Global reset, variables, shared utilities
│   │   ├── app.js              # Data loading, config, section builders (ID-based)
│   │   └── admin.html
│   └── themes/
│       ├── laboral/
│       │   ├── index.html
│       │   └── theme.css
│       ├── familia/
│       ├── penal/
│       ├── civil/
│       └── general/
```

### New (per-theme design assets)

```
frontend/themes/
├── laboral/
│   ├── index.html              # Design 1: corporate layout (existing)
│   ├── theme.css               # Colors only
│   └── layout.css              # Design 1: top nav, vertical sections (optional; can stay in base)
│
├── familia/
│   ├── index.html              # Design 2: storytelling, alternating image/text
│   ├── theme.css
│   ├── layout.css              # Alternating sections, overlapping cards, parallax
│   └── layout.js               # Scroll animations, parallax (optional)
│
├── penal/
│   ├── index.html              # Design 3: sidebar nav, content on right
│   ├── theme.css
│   ├── layout.css              # Sidebar, full-height sections, sticky nav
│   └── layout.js               # Smooth scroll, section-in-view highlight
│
├── civil/
│   ├── index.html              # Design 4: conversion landing
│   ├── theme.css
│   └── layout.css              # CTAs, badges, compact sections, sticky CTA bar
│
└── general/
    ├── index.html              # Design 5: magazine / card grid
    ├── theme.css
    └── layout.css              # Grid layouts, article-like blocks, cards with images
```

**Rules:**

- Each theme’s `index.html` **must** contain elements with the **same IDs** that `app.js` expects (`#hero`, `#trust-wrap`, `#help-cards`, `#problem-section`, `#why-trust-section`, `#services-section`, `#timeline-list`, `#education-section`, `#cases-grid`, `#profile-title`, `#profile-text`, `#profile-photo`, `#testimonials-section`, `#cta-strong`, `#contact-form`, `#footer-name`, etc.), so the shared script can fill content without changes.
- **Order and wrapper structure** (e.g. sidebar + main, alternating rows, grid) are entirely up to each theme’s HTML + layout CSS.
- `theme.css` continues to define only **colors** (e.g. `--primary`, `--accent`). Layout and design-specific visuals live in `layout.css` (and optionally `layout.js`).

---

## 2. Layout Strategy by Design

### Design 1 – Corporate Legal (laboral)

- **Navigation:** Classic top navbar (existing header), scroll to sections.
- **Layout:** Single column, vertical sections, same as current.
- **Assets:** `index.html` (current), `theme.css`, optionally `layout.css` for any laboral-specific overrides. No `layout.js` required.
- **Behavior:** Keep current `base.css` as default; laboral can override with `layout.css` for spacing/typography only.

### Design 2 – Storytelling (familia)

- **Navigation:** Minimal top bar or transparent header; scroll-driven narrative.
- **Layout:** Alternating sections:
  - Row 1: Image left (e.g. hero or problem image) / Text right  
  - Row 2: Text left / Image right  
  - Repeat. Sections: Hero → Client problem (problem awareness) → How I help (help + why trust) → Services → Cases → Testimonials → Contact.
- **Assets:** `layout.css` for alternating grid, large images, overlapping cards; `layout.js` for scroll-triggered fade-in and optional subtle parallax (CSS + IntersectionObserver).
- **Images:** Use `config.images` (hero, profile) and optional section images in JSON (e.g. `problem_awareness.image`, `services[].image`) when available.

### Design 3 – Side Navigation (penal)

- **Navigation:** Fixed **left sidebar** with anchors: Inicio, Problemas, Servicios, Proceso, Casos, Perfil, Contacto. Content scrolls on the right.
- **Layout:** Two columns: `.design-sidebar` (fixed, ~260px) + `.design-main` (scrollable). Full-height sections where appropriate.
- **Assets:** `layout.css` for sidebar and main; `layout.js` for smooth scroll and sidebar link highlight (IntersectionObserver for “section in view”).
- **Behavior:** Same IDs live inside `.design-main`; header can be minimal or merged into sidebar.

### Design 4 – Conversion Landing (civil)

- **Navigation:** Top nav + **sticky CTA bar** (e.g. “Consultar por WhatsApp”) that stays visible on scroll.
- **Layout:** Compact sections, strong CTAs, trust badges, testimonials early. Fewer long paragraphs; more bullets and buttons.
- **Assets:** `layout.css` for sticky CTA, badge-style trust, compact cards, bold headlines. No `layout.js` required unless adding simple scroll effects.

### Design 5 – Magazine / Knowledge (general)

- **Navigation:** Top nav with section anchors; editorial feel.
- **Layout:** Card-based grids for services, cases, education; article-like blocks for profile and “what you should know.”
- **Assets:** `layout.css` for grid, cards with optional images, typography hierarchy. Optional `layout.js` for fade-in on scroll.

---

## 3. HTML Layout Examples

### Design 1 (laboral) – existing

Already in place: single `<main>` with sections in order. No structural change required.

### Design 3 (penal) – sidebar layout

```html
<body class="design-penal">
  <aside class="design-sidebar" aria-label="Navegación">
    <div class="sidebar-brand">
      <p class="name" id="header-name">Cargando...</p>
      <p class="tagline" id="header-tagline">Cargando...</p>
    </div>
    <nav class="sidebar-nav">
      <a href="#hero" class="sidebar-link active">Inicio</a>
      <a href="#problem-section" class="sidebar-link">Problemas</a>
      <a href="#services-section" class="sidebar-link">Servicios</a>
      <a href="#timeline-section" class="sidebar-link">Proceso</a>
      <a href="#cases-section" class="sidebar-link">Casos</a>
      <a href="#profile-section" class="sidebar-link">Perfil</a>
      <a href="#contact-form" class="sidebar-link">Contacto</a>
    </nav>
    <a href="#" class="sidebar-cta btn-whatsapp" id="sidebar-wa">WhatsApp</a>
  </aside>
  <div class="design-main">
    <section class="hero" id="hero">...</section>
    <section id="trust-section"><div id="trust-wrap"></div></section>
    <section class="help">...</section>
    <section id="problem-section">...</section>
    <section id="why-trust-section">...</section>
    <section id="services-section">...</section>
    <section class="timeline" id="timeline-section">...</section>
    <section id="education-section">...</section>
    <section class="cases" id="cases-section">...</section>
    <section class="profile" id="profile-section">...</section>
    <section id="testimonials-section">...</section>
    <section id="cta-strong">...</section>
    <section class="contact">...</section>
    <footer>...</footer>
  </div>
  <a class="whatsapp-float" href="#">WA</a>
  <script>window.SITE_KEY = 'penal'; window.API_BASE = '';</script>
  <script src="/static/app.js?v=3"></script>
  <script src="/themes/penal/layout.js?v=1"></script>
</body>
```

### Design 2 (familia) – alternating (conceptual)

```html
<body class="design-familia">
  <header class="site-header minimal">...</header>
  <main>
    <section class="hero hero-story" id="hero">...</section>
    <section class="story-row story-row--image-left">
      <div class="story-media"><img src="" alt="" id="problem-image"></div>
      <div class="story-content"><div id="problem-section">...</div></div>
    </section>
    <section class="story-row story-row--image-right">
      <div class="story-content"><div id="help-cards">...</div></div>
      <div class="story-media">...</div>
    </section>
    ...
  </main>
</body>
```

Design 2 requires `layout.js` (or small additions to `app.js`) to inject content into `.story-content` while keeping IDs for builders (e.g. a wrapper `<div id="problem-section">` so `buildProblemAwareness` still finds it).

### Design 4 (civil) – conversion

```html
<body class="design-civil">
  <header class="site-header">...</header>
  <div class="sticky-cta-bar" id="sticky-cta">
    <span>¿Tienes una duda legal?</span>
    <a href="#" class="btn-whatsapp" id="sticky-cta-wa">Escribir por WhatsApp</a>
  </div>
  <main>
    <section class="hero hero-compact" id="hero">...</section>
    <section class="trust trust-badges" id="trust-wrap">...</section>
    ...
  </main>
</body>
```

`app.js` can update `#sticky-cta-wa` and `#sidebar-wa` in `updateAllWhatsAppLinks` by adding those IDs to the selector list.

### Design 5 (general) – grid

```html
<body class="design-general">
  <header class="site-header">...</header>
  <main class="content-grid">
    <section class="hero hero-editorial" id="hero">...</section>
    <section class="grid-section" id="services-section">
      <h2 id="services-title">...</h2>
      <div class="cards-grid" id="services-grid"></div>
    </section>
    <section class="grid-section" id="cases-section">...</section>
    ...
  </main>
</body>
```

Same IDs; only class names and grid CSS change.

---

## 4. CSS Strategy

### Layering

1. **base.css (shared)**  
   - Reset, `:root` variables (colors can be overridden by theme.css).  
   - Base typography, body.  
   - **Minimal default layout** for sections (e.g. `.wrap`, `.section-title`) so that themes that do not load a layout still work.  
   - **No design-specific layout** for sidebar or alternating; those live in theme layout.css.

2. **theme.css (per theme)**  
   - Only overrides for `--primary`, `--primaryLight`, `--accent`, `--text`, `--bg`, etc.  
   - No structural layout.

3. **layout.css (per theme)**  
   - Design-specific layout:  
     - **laboral:** Optional; can rely on base or add spacing/hero tweaks.  
     - **familia:** `.design-familia .story-row`, `.story-media`, `.story-content`, alternating grid, parallax containers.  
     - **penal:** `.design-penal .design-sidebar`, `.design-main`, `.sidebar-nav`, full-height sections.  
     - **civil:** `.design-civil .sticky-cta-bar`, `.trust-badges`, compact hero.  
     - **general:** `.design-general .content-grid`, `.cards-grid`, article-style blocks.  
   - Section visibility: sections without data are hidden by `app.js` (display: none); layout.css only positions visible sections.

### Scoping

- Use a **body class** per design (e.g. `design-penal`, `design-familia`) so layout.css can scope all rules and avoid affecting other themes.  
- Example:  
  `body.design-penal .design-sidebar { ... }`  
  `body.design-familia .story-row { ... }`

### Images

- Use `config.images.hero`, `config.images.profile` (already in app.js).  
- For more image usage, extend JSON with optional fields (e.g. `services[].image`, `problem_awareness.image`).  
- In layout.css, use background-image or `<img>` injected by app.js; support both external URLs and `/static/images/...`.

### Animations (CSS + minimal JS)

- **Fade-in on scroll:** Class `.reveal` or `.visible` toggled by IntersectionObserver (already used for timeline; reuse for sections).  
- **Hover elevation:** `transform: translateY(-4px); box-shadow: ...` on cards.  
- **Smooth section transitions:** `scroll-behavior: smooth` (already on html).  
- **Parallax:** Optional; in `layout.js` use scroll position to set `transform: translateY(...)` or a data attribute for CSS. No libraries.

---

## 5. JavaScript Structure

### app.js (shared) – unchanged contract

- **Load config:** `GET /api/config/{site_key}`.  
- **Apply colors**, **populate all sections by ID** (hero, trust, help, problem, why-trust, services, timeline, education, cases, profile, testimonials, CTA, contact, footer).  
- **WhatsApp:** `updateAllWhatsAppLinks()` updates every link that uses the current message.  
- **Form submit:** POST to `/api/contact`.  

**Compatibility:** Any theme whose HTML includes the same IDs will work. New IDs (e.g. `#sidebar-wa`, `#sticky-cta-wa`) can be added to `updateAllWhatsAppLinks` so theme-specific buttons stay in sync.

### layout.js (per theme, optional)

- **Design 2 (familia):**  
  - Optional: IntersectionObserver to add `.visible` / `.reveal` to sections for fade-in.  
  - Optional: Parallax for `.story-media` (read scrollY, set transform or data attribute).

- **Design 3 (penal):**  
  - **Smooth scroll:** `document.querySelectorAll('.sidebar-link').forEach(link => link.addEventListener('click', (e) => { e.preventDefault(); document.querySelector(link.getAttribute('href')).scrollIntoView({ behavior: 'smooth' }); }));`  
  - **Section-in-view highlight:** IntersectionObserver on sections; add/remove `.active` on the corresponding `.sidebar-link` (match by `href` and section id).

- **Design 4 (civil):**  
  - Optional: Show/hide sticky CTA bar on scroll (e.g. show after hero leaves viewport).

- **Design 5 (general):**  
  - Optional: Fade-in on scroll for grid cards (same IntersectionObserver pattern).

**Load order in HTML:** `app.js` first (so DOM is filled), then `layout.js` (so it can bind to existing elements).

---

## 6. JSON Compatibility

- Existing fields stay as-is. Sections are hidden when data is missing (e.g. no `trust_indicators` → trust section hidden).  
- **Optional extensions** for richer designs:  
  - `images.services_bg`, `images.problem_bg` for section backgrounds.  
  - `services[].image` for design 2/5.  
  - No backend change required; app.js can be extended to set `img.src` or `backgroundImage` when present.

---

## 7. Implementation Status

- **Design 1 (laboral):** Uses `design-laboral` body class; no layout.css (base.css is the layout). Unchanged behavior.
- **Design 3 (penal):** **Fully implemented.** Sidebar HTML in `themes/penal/index.html`, styles in `themes/penal/layout.css`, behavior in `themes/penal/layout.js`. Use as reference for other designs.
- **Design 2 (familia), 4 (civil), 5 (general):** Body classes and placeholder `layout.css` added; full alternate HTML/layout to be added following the penal pattern.

---

## 8. Summary

| Design   | Theme   | Nav           | Layout           | layout.css | layout.js        |
|----------|--------|---------------|------------------|------------|------------------|
| Corporate| laboral| Top           | Vertical         | Optional   | No               |
| Story    | familia| Scroll        | Alternating L/R  | Yes        | Optional (scroll)|
| Sidebar  | penal  | Left sidebar  | Main scroll      | Yes        | Yes (scroll/spy) |
| Landing  | civil  | Top + sticky CTA | Compact       | Yes        | Optional         |
| Magazine | general| Top           | Grid / cards     | Yes        | Optional         |

- **Backend:** Unchanged.
- **app.js:** Same API and IDs; extended to fill `.sidebar-brand .name/.tagline` and to update `#sidebar-wa`, `#sticky-cta-wa` in `updateAllWhatsAppLinks` / `applyWhatsAppFloat`.
- **Per theme:** Different `index.html` structure + `theme.css` + `layout.css` + optional `layout.js` give five distinct premium templates while reusing one codebase and one config format.
