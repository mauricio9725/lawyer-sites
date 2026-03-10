# New JSON fields for premium UI upgrade

These optional fields were added to support the new sections and improved trust copy. All remain **optional**: if omitted, the corresponding section is hidden.

---

## 1. Problem Awareness section

**"Are you experiencing any of these?"** – Interactive cards that update the WhatsApp message on click.

```json
"problem_awareness": {
  "title": "¿Estás viviendo alguna de estas situaciones?",
  "subtitle": "Haz clic en la que se acerque a tu caso para contactarnos con el mensaje adecuado.",
  "items": [
    { "label": "Me despidieron sin justa causa", "whatsapp_msg": "Hola, me despidieron sin justa causa y quiero asesoría." },
    { "label": "No me pagaron mi liquidación", "whatsapp_msg": "Hola, no me pagaron mi liquidación y necesito ayuda." }
  ]
}
```

- **title** (string): Section heading.
- **subtitle** (string): Short intro below the title.
- **items** (array): Each item:
  - **label** (string): Text shown on the card.
  - **whatsapp_msg** (string): Message pre-filled when user clicks (opens WhatsApp).
- **image** (string, optional): URL of an image for the problem section. Used in themes that support it (e.g. familia storytelling block). Frontend applies it to `#problem-section-image` when present.

If `problem_awareness` or `problem_awareness.items` is missing or empty, the section is hidden.

---

## 2. Why Trust Me section

**4–5 trust points** (e.g. transparent guidance, clear language, personalized analysis).

```json
"why_trust_title": "Por qué confiar en mi asesoría",
"why_trust_subtitle": "Compromiso con tu caso desde el primer contacto.",
"why_trust_me": [
  { "title": "Orientación legal transparente", "description": "Te explico las opciones reales y los posibles resultados." },
  { "title": "Lenguaje claro, sin tecnicismos", "description": "Hablamos en términos que entiendes." }
]
```

- **why_trust_title** (string, optional): Section heading. If not set, a default heading can be used.
- **why_trust_subtitle** (string, optional): Intro below the title.
- **why_trust_me** (array): Each item:
  - **title** or **text** (string): Card title.
  - **description** or **desc** (string, optional): Short text below the title.

If `why_trust_me` is missing or empty, the section is hidden.

---

## 3. Education section

**"What you should know about your rights"** – Bullet list of short explanations.

```json
"education": {
  "title": "Lo que conviene que sepas sobre tus derechos",
  "subtitle": "Información clara para que tomes mejores decisiones.",
  "items": [
    "Tienes derecho a una liquidación cuando te despiden, según tu tipo de contrato.",
    "Las horas extra deben ser reconocidas y pagadas."
  ]
}
```

- **title** (string): Section heading.
- **subtitle** (string, optional): Intro below the title.
- **items** (array of strings): One string per bullet. Can also be objects with **text** or **title** if the JS is extended.

If `education` or `education.items` is missing or empty, the section is hidden.

---

## 4. Trust indicators (existing, improved copy)

You can keep or adjust the existing **trust_indicators** for the strip under the hero. Example with stronger numbers:

```json
"trust_indicators": [
  { "text": "Más de 300 casos asesorados", "icon": "experience" },
  { "text": "Consultas confidenciales", "icon": "confidential" },
  { "text": "Estrategia legal personalizada", "icon": "personalized" },
  { "text": "Respuesta rápida", "icon": "fast" }
]
```

**Icon** values used in the app: `experience`, `confidential`, `personalized`, `fast`, `briefcase`, `money`, `clock`, `shield`, `document`.

---

## Summary table

| Field | Type | Required | Section |
|-------|------|----------|---------|
| `problem_awareness` | object | No | Problem Awareness |
| `problem_awareness.title` | string | No | |
| `problem_awareness.subtitle` | string | No | |
| `problem_awareness.items` | array | No | |
| `problem_awareness.items[].label` | string | Yes (if section used) | |
| `problem_awareness.items[].whatsapp_msg` | string | Yes (if section used) | |
| `why_trust_title` | string | No | Why Trust Me |
| `why_trust_subtitle` | string | No | |
| `why_trust_me` | array | No | |
| `why_trust_me[].title` or `.text` | string | Yes (if section used) | |
| `why_trust_me[].description` or `.desc` | string | No | |
| `education` | object | No | Education |
| `education.title` | string | No | |
| `education.subtitle` | string | No | |
| `education.items` | array of strings | No | |
| `problem_awareness.image` | string (URL) | No | Problem section image (themes that support it) |
| `services[].image` | string (URL) | No | Optional image per service card (themes that support it) |

No backend or API changes are required; these fields are read from the existing `GET /api/config/{site_key}` response.

---

## 5. Optional image fields (visual upgrade)

To enable more visual, image-driven layouts without changing the backend:

### problem_awareness.image

URL of an image for the “problem awareness” section. Themes that have a dedicated image block (e.g. familia) will use it as background or featured image for that section.

```json
"problem_awareness": {
  "title": "...",
  "subtitle": "...",
  "image": "https://example.com/images/family-law.jpg",
  "items": [ ... ]
}
```

Frontend: if present, `app.js` sets it on the element with `id="problem-section-image"`.

### services[].image

Each service can optionally have an image URL. Rendered as a card image in themes that support it (e.g. card with `background-image` or `<img>`).

```json
"services": [
  { "title": "Divorcio", "description": "...", "icon": "document", "image": "https://example.com/divorcio.jpg" },
  { "title": "Custodia", "description": "...", "icon": "shield" }
]
```

Frontend: `app.js` builds a `.service-card-image` with the image when `s.image` is present.
