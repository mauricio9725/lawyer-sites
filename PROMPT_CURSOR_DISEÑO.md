# PROMPT PARA CURSOR (MUY IMPORTANTE)

Copia todo esto.

---

## CONTEXTO DEL PROYECTO

Estás trabajando en un proyecto llamado **Lawyer Sites**, que genera sitios web profesionales para abogados.

**Stack:**
- Backend: FastAPI
- DB: SQLite
- ORM: SQLAlchemy
- Frontend: HTML + CSS + JavaScript vanilla
- Configuración por sitio: JSON
- Sin frameworks frontend

**NO puedes cambiar:**
- backend
- endpoints
- estructura JSON base
- lógica de app.js

**Solo puedes modificar:**
- HTML de cada tema
- CSS de cada tema (theme.css, layout.css)
- layout.js (si existe)
- imágenes
- animaciones
- distribución visual

El objetivo es que el resultado final sea **muy profesional, moderno y visualmente atractivo**.

Las páginas actuales funcionan, pero se ven demasiado simples, vacías y poco profesionales.

---

## OBJETIVO PRINCIPAL

Convertir los **5 temas** en experiencias visuales **completamente distintas**.

Actualmente muchos temas se ven iguales o con cambios mínimos.

Cada tema debe tener:
- Layout diferente
- Storytelling distinto
- Jerarquía visual diferente
- Uso intensivo de imágenes
- Interacciones
- Animaciones suaves
- Distribución profesional del espacio

**NO quiero solo cambiar colores.**  
Quiero **5 plantillas reales diferentes**.

---

## REGLAS GENERALES DE DISEÑO

Aplicar estas reglas a **TODOS** los temas.

### 1. NUNCA dejar espacios vacíos grandes

Si existe un bloque grande vacío:
- **NO** usar color plano como relleno.
- Debe contener:
  - imagen
  - iconos
  - texto
  - patrón visual
  - ilustración
  - fondo con gradiente

**Los bloques vacíos no están permitidos.**

### 2. Uso obligatorio de imágenes

Cada sitio debe tener **mínimo**:
- hero image
- imagen en perfil
- imagen en al menos 3 secciones

Puedes usar: **Unsplash**

Ejemplos: abogados, reuniones legales, tribunales, documentos, familias, justicia.

Las imágenes deben:
- ocupar bien el espacio
- no verse como placeholders
- tener overlay si es necesario

### 3. Animaciones obligatorias

Agregar animaciones suaves:
- fade in on scroll
- slide in
- hover elevation
- hover color change
- cards con micro interacción
- timeline animado

Usar: **IntersectionObserver** o **CSS animations**.  
**NO** usar librerías externas.

### 4. Micro interacciones

Agregar interacción en: cards, botones, testimonios, timeline, servicios.

Ejemplos hover:
- `transform: translateY(-4px)`
- `box-shadow`
- `scale`

### 5. Uso correcto del espacio

Cada sección debe:
- usar grid
- usar columnas
- tener equilibrio visual
- no verse vacía

### 6. Tipografía clara

Usar jerarquía fuerte:
- títulos grandes
- subtítulos
- texto secundario
- espacio entre bloques

---

## DIFERENCIACIÓN FUERTE ENTRE LOS 5 TEMAS

Esto es **crítico**. Cada tema debe parecer una **plantilla diferente**.

### TEMA 1 — LABORAL

- **Estilo:** corporativo moderno
- **Inspiración:** firmas legales empresariales
- **Layout:** hero grande, trust indicators debajo, grid profesional
- **Elementos visuales:** iconos, estadísticas, indicadores de confianza
- **Secciones destacadas:** trust, services, timeline
- **Colores:** azul oscuro + naranja
- **Sensación:** empresa seria

### TEMA 2 — FAMILIA

- **Estilo:** emocional y humano
- **Debe transmitir:** confianza, cercanía, apoyo
- **Layout:** storytelling vertical. Alternar: imagen izquierda / texto derecha, imagen derecha / texto izquierda
- **Agregar imágenes de:** familia, pareja, niños
- **Evitar:** bloques sólidos de color. El espacio visual debe estar lleno con imágenes
- **Colores:** morado + rosado suave
- **Sensación:** empatía y cercanía

### TEMA 3 — PENAL

- **Estilo:** dramático y profesional
- **Inspiración:** defensa penal
- **Layout:** sidebar fija izquierda, contenido derecha. Hero fuerte
- **Usar:** imágenes de tribunales, jueces, audiencias
- **Agregar:** animaciones, bloques visuales, timeline animado
- **Colores:** azul oscuro + teal
- **Sensación:** autoridad y defensa fuerte

### TEMA 4 — CIVIL

- **Estilo:** landing page orientada a conversión
- **Debe ser muy diferente al laboral**
- **Características:** CTA frecuente, bloques compactos, secciones rápidas
- **Agregar:** barra CTA fija al hacer scroll, bloques comparativos, tarjetas claras
- **Objetivo:** generar contacto rápido
- **Colores:** verde azulado
- **Sensación:** consultoría práctica

### TEMA 5 — GENERAL

- **Estilo:** revista legal
- **Layout:** grid de tarjetas, bloques tipo artículo, contenido educativo
- **Secciones tipo:** guías, consejos, artículos
- **Debe sentirse más informativo**
- **Colores:** azul + teal
- **Sensación:** portal legal

---

## CORRECCIÓN DE ERRORES ACTUALES

Debes revisar:
- Bloques gigantes de color sin contenido
- Columnas vacías
- Layouts con mucho espacio sin usar
- Secciones que no aprovechan la pantalla

Cada sección debe:
- tener contenido visual
- tener equilibrio visual
- ocupar correctamente el espacio

---

## IMÁGENES

Si el JSON no tiene imágenes suficientes: usar imágenes de **Unsplash** temporalmente.  
Pero **mantener compatibilidad con JSON**.

---

## ANTES DE TERMINAR — CHECKLIST OBLIGATORIO

Antes de finalizar revisa:

| Área | Verificación |
|------|---------------|
| **Diseño** | Los 5 temas se ven completamente distintos. Ningún layout es similar a otro. |
| **Visual** | Cada página tiene mínimo 4 imágenes. No existen bloques vacíos. |
| **Interacciones** | Existen animaciones al scroll. Cards tienen hover. Botones tienen interacción. |
| **UX** | El espacio está bien utilizado. El diseño se siente profesional. |
| **Técnica** | Backend no se rompió. JSON sigue funcionando. app.js sigue funcionando. |

---

## RESULTADO FINAL ESPERADO

**Debe verse como:** plantillas profesionales de abogados listas para vender.

**No debe parecer:** una página simple, un diseño escolar, un wireframe.

**Debe parecer:** sitios legales premium reales.
