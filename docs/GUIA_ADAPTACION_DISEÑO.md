# Guía para adaptar el diseño a los 5 tipos de abogados

El frontend mejorado usa la misma estructura HTML/CSS/JS para todos los temas. La personalización se hace por **archivo JSON** y **theme.css** (solo variables de color).

---

## 1. Estructura común de las páginas

Todas las variantes incluyen, en este orden:

| Sección | Descripción | Dato en JSON |
|--------|-------------|--------------|
| **Header** | Nombre y tagline | `name`, `tagline` |
| **Hero** | Imagen de fondo, título, subtítulo, CTA + WhatsApp | `hero`, `images.hero` |
| **Trust** | 3–4 indicadores con icono | `trust_indicators` |
| **¿En qué te puedo ayudar?** | Cards clicables que cambian mensaje WhatsApp | `help_buttons` |
| **Áreas de trabajo** | Tarjetas con icono, título, descripción, enlace | `services` |
| **Timeline** | 5 pasos (título + descripción) | `timeline_title`, `timeline_steps` |
| **Casos frecuentes** | Cards con texto | `cases_title`, `cases` |
| **Perfil** | Foto + texto humano | `profile_*`, `images.profile` |
| **Testimonios** | Carrusel (nombre, ciudad, texto) | `testimonials` |
| **CTA fuerte** | Título + subtítulo + botón WhatsApp | `cta_title`, `cta_subtitle` |
| **Formulario** | Contacto | `contact_title`, `contact_intro` + `help_buttons` para select |
| **Footer** | Nombre, ciudad, teléfono, WhatsApp | `name`, `city`, `phone` |

Si en el JSON falta un bloque (por ejemplo `trust_indicators` o `services`), esa sección se oculta o no se rellena.

---

## 2. Cómo adaptar por tipo de abogado

### Derecho Laboral (`laboral`)

- **Colores**: azul oscuro + naranja (confianza + acción). En `theme.css`: `--primary`, `--accent`.
- **Copy**: lenguaje de “derechos en el trabajo”, “lo que te deben”, “despido”, “horas extra”.
- **help_buttons**: Despido, salarios, horas extra, acoso, otro.
- **services**: Despidos, salarios/prestaciones, horas extra, acoso laboral.
- **testimonials**: Frases cortas sobre liquidaciones, claridad, resultados.

### Derecho de Familia (`familia`)

- **Colores**: morado + rosa (calidez, respeto). En `theme.css`: `--primary` #553c9a, `--accent` #d53f8c.
- **Copy**: “momentos difíciles”, “sin juzgar”, “bienestar”, “custodia”, “pensión”.
- **help_buttons**: Divorcio, custodia, pensión, unión marital/herencias, otro.
- **services**: Divorcio, custodia y visitas, pensión alimenticia, unión marital y herencias.
- **testimonials**: Enfoque en respeto, acompañamiento, claridad.

### Derecho Penal (`penal`)

- **Colores**: vino/burdeos + tierra (seriedad, discreción). En `theme.css`: `--primary` #742a2a.
- **Copy**: “defensa”, “discreción”, “opciones”, “estrategia”, “representación”.
- **help_buttons**: Detención, investigación, audiencia, libertad, otro.
- **services**: Defensa en investigación, libertad, audiencias/juicio, recursos.
- **testimonials**: Discreción, profesionalidad, apoyo en momentos difíciles.

### Derecho Civil / Contratos (`civil`)

- **Colores**: verde azulado + azul (claridad, soluciones). En `theme.css`: `--primary` #234e52.
- **Copy**: “contratos”, “reclamar”, “deudas”, “daños y perjuicios”, “práctico”.
- **help_buttons**: Redactar/revisar contrato, incumplimiento, deudas, daños, otro.
- **services**: Contratos, incumplimiento, cobro de deudas, daños y perjuicios.
- **testimonials**: Resultados concretos, claridad, recuperar lo debido.

### Abogado General (`general`)

- **Colores**: azul oscuro + teal (orientación, calma). En `theme.css`: `--primary` #1e3a5f, `--accent` #0d9488.
- **Copy**: “orientación”, “no sabes por dónde empezar”, “opciones”, “derivar a especialista”.
- **help_buttons**: Consulta general, revisar documento, empresa/negocio, consumidor, otro.
- **services**: Consultas, revisión de documentos, empresas, consumidor.
- **testimonials**: Utilidad de la orientación, derivación correcta.

---

## 3. Dónde se cambia cada cosa

| Qué cambiar | Dónde |
|-------------|--------|
| Colores del tema | `frontend/themes/{site_key}/theme.css` (variables `--primary`, `--primaryLight`, `--accent`, `--text`, `--bg`) |
| Textos, botones, servicios, testimonios, footer | `config/sites/{site_key}.json` |
| Imágenes del hero y perfil | En el JSON: `images.hero`, `images.profile` (URL o `/static/images/archivo.jpg`) |
| Iconos de trust/help/services | En el JSON: campo `icon` con valor `experience`, `confidential`, `personalized`, `fast`, `briefcase`, `money`, `clock`, `shield`, `document` (ver `app.js`) |

No hace falta tocar el HTML ni el backend para adaptar el diseño a cada tipo de abogado; solo JSON + theme.css.

---

## 4. Formato del JSON ampliado

Ejemplo mínimo para que todas las secciones se vean bien:

```json
{
  "site_key": "laboral",
  "name": "Nombre del abogado",
  "tagline": "Frase corta",
  "whatsapp_number": "573001234567",
  "city": "Ciudad",
  "phone": "+57 300 123 4567",
  "colors": { "primary": "#1a365d", "primaryLight": "#2c5282", "accent": "#ed8936", "text": "#2d3748", "background": "#f7fafc" },
  "images": { "hero": "URL o /static/images/hero.jpg", "profile": "URL o /static/images/foto.jpg" },
  "hero": { "title": "...", "subtitle": "...", "cta_text": "Consultar mi caso", "whatsapp_text": "Escribir por WhatsApp" },
  "trust_indicators": [ { "text": "Más de X años", "icon": "experience" }, ... ],
  "help_buttons": [ { "id": "...", "label": "...", "whatsapp_msg": "...", "icon": "briefcase" }, ... ],
  "services": [ { "title": "...", "description": "...", "icon": "document" }, ... ],
  "timeline_title": "Así trabajamos tu caso",
  "timeline_steps": [ { "title": "Consulta inicial", "desc": "..." }, ... ],
  "cases_title": "...",
  "cases": [ "Caso 1", "Caso 2", ... ],
  "profile_title": "Sobre mí",
  "profile_text": "...",
  "testimonials": [ { "name": "...", "city": "...", "text": "..." }, ... ],
  "cta_title": "...",
  "cta_subtitle": "...",
  "contact_title": "Formulario de contacto",
  "contact_intro": "..."
}
```

`timeline_steps` puede ser también un array de strings (como antes); el JS admite los dos formatos.

---

## 5. Imágenes propias del cliente

- Colocar archivos en `frontend/shared/images/` (ej. `hero-lawyer.jpg`, `foto-perfil.jpg`).
- En el JSON usar: `"images": { "hero": "/static/images/hero-lawyer.jpg", "profile": "/static/images/foto-perfil.jpg" }`.

Con esto el diseño queda adaptado a los 5 tipos de abogado sin tocar código, solo configuración y tema de color.
