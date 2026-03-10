# Resumen detallado del proyecto Lawyer Sites (para contexto en ChatGPT u otro asistente)

---

## Resumen ejecutivo

- **Qué es:** Sistema que genera sitios web profesionales para abogados. Un backend FastAPI sirve **5 temas** (laboral, familia, penal, civil, general), cada uno con **layout y estilo distintos**. Frontend: HTML + CSS + JS vanilla; configuración por JSON.
- **Cómo ver:** Desde `lawyer-sites/backend`: `uvicorn app.main:app --host 127.0.0.1 --port 8082`. URLs: `http://127.0.0.1:8082/themes/{laboral|familia|penal|civil|general}/`. Admin: `http://127.0.0.1:8082/static/admin.html`.
- **Estado:** Los 5 temas están diferenciados (corporativo, storytelling, sidebar, landing conversión, revista). Tienen scroll reveal, hover en cards, imágenes (hero, perfil, opcional por sección). JSON admite `problem_awareness.image` y `services[].image`. No se modifica backend ni app.js (solo temas: HTML, layout.css, layout.js).

---

## 1. Qué es el proyecto

Sistema para generar **páginas web profesionales para abogados** (un producto base vendible/reutilizable). Un solo backend sirve a **5 variantes de sitio** según el tipo de abogado; cada variante se diferencia por **colores, textos e imágenes** definidos en un JSON. El frontend es **HTML + CSS + JavaScript vanilla** (sin React, Vue ni Angular). Objetivo: páginas con aspecto **premium** (como sitios legales de alto nivel), orientadas a conversión y confianza, fáciles de mantener y de replicar para nuevos clientes. La UI incluye hero con imagen a ancho completo, gradientes, cards con hover, timeline con animación al scroll, carrusel de testimonios, y secciones nuevas: Problem Awareness, Why Trust Me y Educational.

---

## 2. Stack técnico

| Capa | Tecnología |
|------|------------|
| Backend | Python, FastAPI |
| Base de datos | SQLite (por defecto), migrable a Postgres |
| ORM | SQLAlchemy |
| Frontend | HTML5, CSS3 (variables, flexbox, grid), JavaScript vanilla |
| Configuración por sitio | Archivos JSON en `config/sites/{site_key}.json` |
| Servidor de desarrollo | Uvicorn |

No hay frameworks frontend (no React, Vue, Angular). No hay CMS: los textos se editan en el JSON.

---

## 3. Estructura de carpetas (lo relevante)

```
lawyer-sites/
├── backend/
│   ├── app/
│   │   ├── main.py          # FastAPI app, rutas API, montaje de estáticos
│   │   ├── config.py        # Rutas, DB, admin, CORS
│   │   ├── database.py      # SQLAlchemy engine, Session, Base
│   │   ├── models.py        # Modelo Contact
│   │   ├── schemas.py       # Pydantic: ContactCreate, ContactResponse, LoginRequest, TokenResponse
│   │   ├── auth.py          # JWT, login simple (usuario/contraseña)
│   │   └── routers/
│   │       ├── contact.py   # POST /api/contact
│   │       └── config.py    # GET /api/config/{site_key}
│   ├── requirements.txt
│   └── lawyer_sites.db      # SQLite (se crea al arrancar)
├── config/
│   └── sites/
│       ├── laboral.json     # Derecho laboral
│       ├── familia.json     # Derecho de familia
│       ├── penal.json       # Derecho penal
│       ├── civil.json       # Derecho civil / contratos
│       └── general.json     # Abogado general / consultas
├── frontend/
│   ├── shared/
│   │   ├── base.css         # Estilos base (variables + componentes)
│   │   ├── app.js           # Lógica común: carga config, pinta secciones, formulario, WhatsApp, carrusel
│   │   ├── admin.html       # Panel admin (login + listado de consultas)
│   │   └── images/         # Opcional: imágenes propias (hero, perfil)
│   └── themes/
│       ├── laboral/         # index.html, theme.css, layout.css, layout.js
│       ├── familia/         # index.html, theme.css, layout.css, layout.js
│       ├── penal/           # index.html, theme.css, layout.css, layout.js
│       ├── civil/           # index.html, theme.css, layout.css, layout.js
│       └── general/         # index.html, theme.css, layout.css, layout.js
├── docs/
│   ├── NUEVO_SITIO.md       # Cómo crear un nuevo sitio
│   ├── VERIFICACION.md      # Checklist de verificación
│   ├── GUIA_ADAPTACION_DISEÑO.md  # Cómo adaptar diseño a los 5 tipos
│   ├── JSON_FIELDS_UPGRADE.md     # Campos opcionales: problem_awareness, why_trust_me, education
│   └── FRONTEND_THEMES_SUMMARY.md # Resumen frontend: cómo difieren los 5 temas (estructura, layout, interacción)
├── README.md
├── COMO_VER_LAS_PAGINAS.md
├── PROMPT_CURSOR_DISEÑO.md   # Brief de diseño para Cursor: reglas, 5 temas, checklist
├── RESUMEN_PAGINAS_1000.txt
└── RESUMEN_PARA_CHATGPT.md  # Este archivo
```

Las URLs de las páginas son: `http://localhost:8082/themes/{site_key}/` (ej. `/themes/laboral/`). El panel admin: `http://localhost:8082/static/admin.html`. Servidor: `uvicorn app.main:app --host 127.0.0.1 --port 8082` desde `lawyer-sites/backend`.

---

## 4. Cómo se ve la página (sección por sección)

La siguiente descripción corresponde a la **versión actual del frontend** tras la mejora de UI/UX: aspecto premium, hero a ancho completo, trust indicators, cards con hover, timeline con animación al scroll, carrusel de testimonios con comilla, y secciones nuevas (Problem Awareness, Why Trust Me, Educational). Todas las secciones se rellenan desde el JSON; si falta un bloque opcional, esa sección se oculta.

### 4.1 Header (sticky)
- **Apariencia:** Barra blanca fija arriba, sombra suave. A la izquierda: nombre del abogado en negrita y color primary. A la derecha: tagline en gris, fuente más pequeña.
- **Datos en JSON:** `name`, `tagline`.

### 4.2 Hero
- **Apariencia:** Bloque alto (min-height 85vh), imagen de fondo a pantalla completa (o gradiente primary si no hay imagen). Overlay en gradiente oscuro para legibilidad. Tipografía grande (clamp). Contenido centrado: título en blanco, subtítulo en blanco algo transparente. Dos botones destacados (más padding, hover con ligera elevación): uno primario “Consultar mi caso” (scroll a #contact-form) y uno secundario “Escribir por WhatsApp”.
- **Datos en JSON:** `images.hero`, `hero.title`, `hero.subtitle`, `hero.cta_text`, `hero.whatsapp_text`. Número WhatsApp: `whatsapp_number`.

### 4.3 Sección de confianza (trust)
- **Apariencia:** Franja debajo del hero. Grid responsive de 3–4 ítems. Cada ítem: icono en círculo (56px) en color primary, texto en negrita (ej. “Más de 300 casos asesorados”, “Consultas confidenciales”). Hover suave.
- **Datos en JSON:** `trust_indicators` (array de `{ "text": "...", "icon": "experience" | "confidential" | "personalized" | "fast" }`). Si no existe, la sección se oculta.

### 4.4 “¿En qué te puedo ayudar?”
- **Apariencia:** Título centrado (section-title) y subtítulo gris. Debajo, **cards** en grid (no botones planos): cada card tiene icono circular (briefcase, money, clock, shield, document según tipo), label del problema (ej. “Me despidieron”, “No me pagan bien”). La card activa tiene fondo primary y texto blanco; el resto borde y texto primary. Hover: ligera elevación y borde. Debajo de las cards, un bloque “content-area” con texto tipo “Puedes escribirme por WhatsApp o usar el formulario más abajo”.
- **Comportamiento:** Al hacer clic en una card se actualiza el mensaje que se envía por WhatsApp (flotante, hero y CTA) y se marca esa card como activa.
- **Datos en JSON:** `help_buttons` (array de `{ "id", "label", "whatsapp_msg", "icon" }`).

### 4.5 Problem Awareness (opcional)
- **Apariencia:** Título tipo "¿Estás viviendo alguna de estas situaciones?" y subtítulo. Grid de cards interactivas: borde izquierdo accent, texto del problema. Hover: ligero desplazamiento.
- **Comportamiento:** Clic en una card actualiza el mensaje de WhatsApp (igual que help_buttons) y todos los enlaces WA.
- **Datos en JSON:** `problem_awareness` con `title`, `subtitle`, `items[]` (`label`, `whatsapp_msg`). Si no existe, la sección se oculta.

### 4.6 Why Trust Me (opcional)
- **Apariencia:** Título (ej. "Por qué confiar en mi asesoría"), subtítulo. Grid de 4–5 tarjetas con borde superior primary; cada una: título y descripción. Hover suave.
- **Datos en JSON:** `why_trust_title`, `why_trust_subtitle` (opcionales), `why_trust_me` (array de `{ "title", "description" }` o `"desc"`). Si no hay array, la sección se oculta.

### 4.7 Áreas de trabajo (services)
- **Apariencia:** Título y subtítulo centrados. Grid de tarjetas: cada una con icono en cuadrado primary, título (ej. “Despidos e indemnizaciones”), descripción corta y enlace “Consultar →” que lleva a #contact-form.
- **Datos en JSON:** `services` (array de `{ "title", "description", "icon" }`). Si no existe, la sección se oculta.

### 4.8 Timeline “Así trabajamos tu caso”
- **Apariencia:** Lista vertical con línea lateral. Cada paso: círculo numerado (1–5) en color accent, a la derecha título en negrita (ej. “Consulta inicial”) y debajo descripción (ej. “Me cuentas tu situación en confianza”).
- **Datos en JSON:** `timeline_title`, `timeline_steps` (array de `{ "title", "desc" }` o strings). Animación al scroll con IntersectionObserver (clase `.visible`).

### 4.9 Educational (opcional)
- **Apariencia:** Título tipo "Lo que conviene que sepas sobre tus derechos", subtítulo. Lista de bullets con icono ✓ en color accent.
- **Datos en JSON:** `education` con `title`, `subtitle`, `items` (array de strings u objetos). Si no hay items, la sección se oculta.

### 4.10 Casos frecuentes
- **Apariencia:** Grid de cards con borde izquierdo de color (accent). Cada card muestra un texto (ej. “Me despidieron sin justa causa”, “No me pagan liquidación”).
- **Datos en JSON:** `cases_title`, `cases` (array de strings).

### 4.11 Perfil del abogado
- **Apariencia:** Dos columnas en desktop (imagen a la izquierda, texto a la derecha). Imagen cuadrada con bordes redondeados y sombra. Título “Sobre mí” y párrafo de texto cercano/humano.
- **Datos en JSON:** `profile_title`, `profile_text`, `images.profile` o `profile_image`. Si no hay URL de imagen, la foto se oculta.

### 4.12 Testimonios
- **Apariencia:** Título y subtítulo. Carrusel: un testimonio visible con icono de comilla ("), texto, nombre en negrita y ciudad en gris. Puntos de navegación; auto-slide cada 5 s y clic en puntos.
- **Datos en JSON:** `testimonials` (array de `{ "name", "city", "text" }`). Si no existe, la sección se oculta.

### 4.13 CTA fuerte
- **Apariencia:** Bloque con fondo en gradiente (primary a primaryLight), texto blanco. Título (ej. “Cuéntanos tu caso y te diremos si podemos ayudarte”), subtítulo y botón grande verde de WhatsApp (“Escribir por WhatsApp”) que abre el chat con mensaje actualizado.
- **Datos en JSON:** `cta_title`, `cta_subtitle`.

### 4.14 Formulario de contacto
- **Apariencia:** Título y texto intro. Formulario en tarjeta blanca con sombra: campos nombre*, email*, teléfono, tipo de caso (select rellenado desde help_buttons), mensaje (textarea), botón “Enviar mensaje”. Mensaje de éxito (verde) o error (rojo) debajo. Diseño espaciado y bordes redondeados.
- **Comportamiento:** Envío por POST a `/api/contact`; mismo backend para todos los sitios. El select “Tipo de caso” se rellena con las opciones del JSON.

### 4.15 Footer
- **Apariencia:** Fondo primary, texto blanco. Bloque nombre del abogado y ciudad. Bloque “Contacto” con enlace de teléfono (tel:) y enlace WhatsApp.
- **Datos en JSON:** `name`, `city`, `phone`.

### 4.16 Botón flotante WhatsApp
- **Apariencia:** Círculo verde fijo abajo a la derecha, con “WA” en blanco. Siempre visible. Al hacer clic abre WhatsApp con el número del JSON y el mensaje según la card activa en “¿En qué te puedo ayudar?”.

---

## 5. Configuración por sitio (JSON)

Cada sitio tiene un archivo en `config/sites/{site_key}.json`. El frontend obtiene la config con `GET /api/config/{site_key}` y la usa en `app.js` para rellenar todas las secciones. Ejemplo de campos (laboral):

- **Identificación:** `site_key`, `lawyer_type`, `name`, `tagline`, `whatsapp_number`, `city`, `phone`
- **Colores:** `colors.primary`, `colors.primaryLight`, `colors.accent`, `colors.text`, `colors.background`
- **Imágenes:** `images.hero`, `images.profile` (URLs; pueden ser externas o `/static/images/...`)
- **Hero:** `hero.title`, `hero.subtitle`, `hero.cta_text`, `hero.whatsapp_text`
- **Trust:** `trust_indicators[]` con `text` e `icon`
- **Ayuda:** `help_buttons[]` con `id`, `label`, `whatsapp_msg`, `icon`
- **Problem Awareness (opcional):** `problem_awareness` con `title`, `subtitle`, `items[]` (`label`, `whatsapp_msg`). Opcional: `problem_awareness.image` (URL) para temas que tengan elemento `#problem-section-image` (p. ej. Familia).
- **Why Trust Me (opcional):** `why_trust_title`, `why_trust_subtitle`, `why_trust_me[]` con `title` y `description` (o `desc`)
- **Servicios:** `services[]` con `title`, `description`, `icon`. Opcional: `image` (URL) por ítem para tarjeta con imagen (app.js genera `.service-card-image` si existe).
- **Educational (opcional):** `education` con `title`, `subtitle`, `items` (strings u objetos con `text`/`title`)
- **Timeline:** `timeline_title`, `timeline_steps[]` (objetos `{ title, desc }` o strings)
- **Casos:** `cases_title`, `cases[]` (strings)
- **Perfil:** `profile_title`, `profile_text`, opcionalmente `profile_image`
- **Testimonios:** `testimonials[]` con `name`, `city`, `text`
- **CTA y contacto:** `cta_title`, `cta_subtitle`, `contact_title`, `contact_intro`

Iconos usados en JS: `experience`, `confidential`, `personalized`, `fast`, `briefcase`, `money`, `clock`, `shield`, `document` (mapeados a símbolos/emoji en `app.js`).

Cada tema tiene además un `theme.css` que solo redefine variables CSS (`--primary`, `--primaryLight`, `--accent`, `--text`, `--bg`) para cambiar la paleta sin tocar el HTML.

---

## 6. Backend y API

- **POST /api/contact:** Recibe JSON con `site_key`, `lawyer_type`, `name`, `email`, `phone`, `case_type`, `message`. Guarda en SQLite (tabla `contacts`). Respuesta: objeto del contacto creado.
- **GET /api/config/{site_key}:** Devuelve el JSON completo del sitio (el que está en `config/sites/{site_key}.json`).
- **POST /api/admin/login:** Body `{ "username", "password" }`. Devuelve JWT (`access_token`). Usuario por defecto: `admin`; contraseña: `ADMIN_PASSWORD` (env) o por defecto `cambiar_en_produccion`.
- **GET /api/admin/contacts:** Requiere header `Authorization: Bearer <token>`. Parámetros opcionales: `site_key`, `case_type`, `from_date`, `to_date`. Lista consultas guardadas.

El panel admin (`/static/admin.html`) es una sola página: login con usuario/contraseña, guarda el token en localStorage y llama a `/api/admin/contacts` para mostrar la tabla con filtros.

---

## 7. Cómo correr el proyecto

1. `cd lawyer-sites/backend`
2. Activar venv: `.\venv\Scripts\activate` (Windows) o `source venv/bin/activate` (Linux/Mac)
3. Si hace falta: `pip install -r requirements.txt`
4. `uvicorn app.main:app --host 127.0.0.1 --port 8082`
5. Abrir en el navegador: `http://127.0.0.1:8082/themes/laboral/` (o familia, penal, civil, general). Admin: `http://127.0.0.1:8082/static/admin.html`

---

## 8. Archivos clave del frontend

- **frontend/shared/base.css:** Variables CSS (`:root`), tipografía (--text-xs a --text-4xl), sombras, espaciado de secciones. Estilos: header, hero (overlay gradiente), trust (iconos 56px), help-cards, problem-awareness, why-trust, services, timeline (línea en gradiente, .visible para animación), education, cases-grid, profile, testimonials (quote + carrusel), cta-strong, contact (.field-group), footer, botón WhatsApp. Mobile-first.
- **frontend/shared/app.js:** IIFE. Carga config con `fetch(/api/config/{SITE_KEY})`. Aplica colores al `documentElement`. Builders: buildProblemAwareness (cards que actualizan mensaje WA; si existe `problem_awareness.image` asigna backgroundImage a `#problem-section-image`), buildWhyTrustMe, buildServices (si ítem tiene `image` genera `.service-card-image`), buildTimeline, setupTimelineScroll (IntersectionObserver + clase .visible), buildEducation, buildCases, profile, testimonials (carrusel + quote), CTA, formulario (select desde help_buttons), footer. Envío a POST /api/contact. Actualización de enlaces WhatsApp (help, problem, hero, cta, sticky, header-wa-link, etc.). `window.SITE_KEY`, `window.API_BASE` en cada index.html.
- **frontend/themes/{site_key}/index.html:** Estructura por tema: mismos IDs que usa app.js (hero, trust-wrap, help-cards, problem-section, why-grid, services-grid, timeline-list, education-list, cases-grid, profile-photo, testimonials-slider, cta-wa, contact-form, footer-*). Algunos temas tienen estructura distinta (Familia: filas story-row; Penal: sidebar + design-main; Civil: sticky-cta-bar, cta-inline). Clases `reveal-section` para scroll reveal.
- **frontend/themes/{site_key}/theme.css:** Redefinición de variables (`--primary`, `--primaryLight`, `--accent`, `--text`, `--bg`).
- **frontend/themes/{site_key}/layout.css:** Layout y estilos específicos del tema (grid, hero, trust, hovers, scroll reveal). Laboral, Familia, Penal, Civil y General tienen layout.css.
- **frontend/themes/{site_key}/layout.js:** Opcional. Laboral y Familia: IntersectionObserver para reveal. Penal: reveal + sidebar nav activa. Civil: sticky CTA + reveal. General: reveal.

---

## 9. Los 5 tipos de sitio (estado actual)

| site_key | Enfoque | Paleta | Layout y características |
|----------|--------|--------|--------------------------|
| **laboral** | Derecho laboral: despidos, salarios, horas extra, acoso | Azul oscuro + naranja | Corporativo: barra arriba, hero grande (imagen + overlay), trust en grid tipo estadísticas, contenido max-width 960px. Scroll reveal, hover en cards. `layout.css` + `layout.js`. |
| **familia** | Derecho de familia: divorcio, custodia, pensiones | Morado + rosa | Storytelling: filas alternas imagen/texto. Cada columna con imagen (Unsplash) o gradiente; sin bloques vacíos. Hero con imagen, problem-section con `#problem-section-image` (JSON opcional). Scroll reveal, hover en cards. `layout.css` + `layout.js`. |
| **penal** | Defensa penal: investigación, libertad, audiencias | Azul oscuro + teal | Sidebar fija izquierda, contenido derecha. Hero a pantalla completa con imagen (tribunal). Timeline con animación escalonada al entrar en vista. Scroll reveal, hover en cards y why-card. `layout.css` + `layout.js` (sidebar activa + reveal). |
| **civil** | Civil y contratos: contratos, deudas | Verde azulado + azul | Landing conversión: header compacto (nombre + WhatsApp), barra CTA fija al hacer scroll, bloque CTA inline a mitad de página, secciones compactas, fondos alternos. Scroll reveal, hover en cards. `layout.css` + `layout.js` (sticky CTA + reveal). |
| **general** | Consultas legales generales | Azul oscuro + teal | Revista legal: hero con imagen y overlay, grid de tarjetas (servicios/casos), secciones con fondo alterno (blanco/bg), bloques tipo artículo (educación, perfil). Scroll reveal, hover en editorial cards y help/problem/why. `layout.css` + `layout.js` (reveal). |

Cada tema tiene `index.html`, `theme.css`, `layout.css` y, en los cinco, `layout.js` (scroll reveal y/o sticky CTA/sidebar). La lógica de datos está en `app.js` (mismos IDs en todos los temas).

---

## 10. Qué NO tiene el proyecto (a fecha de este resumen)

No hay blog, reserva de citas, pagos en línea, chat en vivo (solo WhatsApp y formulario), área de cliente, roles en el panel, envío de emails al recibir consulta, analytics integrado, CMS para editar desde el navegador, multiidioma, meta tags SEO automáticos, galería de equipo, ni captcha en el formulario. Las imágenes por defecto son URLs de Unsplash; para imágenes propias se usan `frontend/shared/images/` y en el JSON rutas tipo `/static/images/archivo.jpg`.

---

## 11. Estado multi-diseño (resumen actual)

**Objetivo:** Los 5 sitios (laboral, familia, penal, civil, general) son **plantillas visualmente distintas**: layout, storytelling, jerarquía, uso de imágenes, animaciones. Backend y JSON base no se modifican; solo HTML, CSS y layout.js por tema.

### Implementado (estado actual)

- **Laboral:** Corporativo. Hero grande con imagen + overlay, trust en grid tipo estadísticas (iconos, hover), contenido max-width 960px. Scroll reveal (IntersectionObserver), hover en help/problem/why/service/case. `layout.css` + `layout.js`. JSON: hero, profile, `problem_awareness.image`, un servicio con `image`.
- **Familia:** Storytelling. Filas alternas imagen/texto; cada columna `.story-media` tiene imagen (Unsplash por defecto o `problem_awareness.image` en problem). Hero con imagen + overlay. Sin bloques vacíos. Scroll reveal, hover en cards. `layout.css` + `layout.js`. JSON: hero, profile, `problem_awareness.image`, `services[].image` en algunos.
- **Penal:** Sidebar fija + contenido. Hero a pantalla completa con imagen (tribunal), overlay. Timeline con animación escalonada al entrar en vista. Scroll reveal, hover en cards y why-card. `layout.css` + `layout.js` (sidebar activa + reveal). JSON: hero, profile, `problem_awareness.image`, un servicio con `image`.
- **Civil:** Landing conversión. Header compacto (nombre + enlace WhatsApp), barra CTA fija al scroll, CTA inline a mitad de página, secciones compactas, fondos alternos. Scroll reveal, hover en cards. `layout.css` + `layout.js` (sticky CTA + reveal). JSON: hero, profile, `problem_awareness.image`.
- **General:** Revista legal. Hero con imagen + overlay, grid editorial, secciones con fondo alterno. Scroll reveal, hover en help/problem/why y en editorial cards. `layout.css` + `layout.js` (reveal). JSON: hero, profile, `problem_awareness.image`.

**Campos opcionales en JSON (sin cambiar backend):** `problem_awareness.image` (URL); `services[].image` (URL por ítem). Documentados en `docs/JSON_FIELDS_UPGRADE.md`. `app.js` aplica `problem_awareness.image` a `#problem-section-image` si existe; en services genera `.service-card-image` si `s.image` existe. `base.css` estiliza `.service-card-image`.

**Restricciones:** No tocar backend ni API. Frontend solo HTML + CSS + JS vanilla. Mismos IDs que usa `app.js` en todos los temas. Secciones se ocultan si no hay datos en JSON.

Documentación: `docs/MULTI_DESIGN_ARCHITECTURE.md`, `PROMPT_CURSOR_DISEÑO.md` (brief de diseño para Cursor).

---

Con este resumen, ChatGPT (u otro asistente) puede entender qué hay, cómo se ve cada parte, cómo se configura y ejecuta el proyecto, y qué estado y problemas tiene el multi-diseño para no tener que explorar todo el código.
