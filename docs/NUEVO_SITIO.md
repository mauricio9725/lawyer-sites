# Cómo crear un nuevo sitio a partir del producto base

Sin tocar código del backend puedes sumar un nuevo sitio (nuevo tema de abogado) en tres pasos.

## 1. Crear la configuración del sitio

En la carpeta `config/sites/` crea un archivo `{site_key}.json`. El `site_key` debe ser alfanumérico o con guiones (ej: `inmobiliario`, `mi-firma`).

Copia uno de los existentes (por ejemplo `config/sites/general.json`) y ajusta:

- **site_key**: mismo que el nombre del archivo sin `.json`
- **lawyer_type**: tipo de abogado (ej: "Derecho Inmobiliario")
- **name**: nombre del abogado o firma
- **tagline**: frase corta debajo del nombre
- **whatsapp_number**: número con código de país, sin espacios (ej: 573001234567)
- **colors**: primary, primaryLight, accent, text, background (hex)
- **hero**: title, subtitle
- **help_buttons**: array de objetos con `id`, `label`, `whatsapp_msg` (3 a 5 botones)
- **timeline_title**, **timeline_steps**: título y array de 5 pasos
- **cases_title**, **cases**: título y lista de casos frecuentes
- **profile_title**, **profile_text**
- **cta_title**, **cta_subtitle**

Guarda el archivo con codificación UTF-8.

## 2. Crear la carpeta del tema en el frontend

En `frontend/themes/` crea una carpeta con el mismo `site_key` (ej: `frontend/themes/inmobiliario/`).

Dentro necesitas:

### `index.html`

Copia el `index.html` de cualquier tema existente (por ejemplo `frontend/themes/general/index.html`). Cambia solo:

- La línea del script donde se define el sitio:

  ```html
  <script>window.SITE_KEY = 'inmobiliario'; window.API_BASE = '';</script>
  ```

- Las rutas de la hoja del tema para que apunten a tu carpeta:

  ```html
  <link rel="stylesheet" href="/themes/inmobiliario/theme.css">
  ```

El resto (estructura, formulario, secciones) puede quedar igual; el contenido se rellena desde el JSON de configuración.

### `theme.css`

Solo define las variables de color (y, si quieres, alguna regla extra). Ejemplo:

```css
:root {
  --primary: #1e3a5f;
  --primaryLight: #2d4a6f;
  --accent: #0d9488;
  --text: #2d3748;
  --bg: #f0fdfa;
}
```

Usa los mismos valores que pusiste en `config/sites/inmobiliario.json` en la sección `colors` (primary → `--primary`, etc.).

## 3. Probar el sitio

1. Reinicia el backend si estaba corriendo.
2. Abre en el navegador: `http://localhost:8080/themes/inmobiliario/` (o la URL de tu servidor).
3. Comprueba que se ve el nombre, colores, botones de ayuda, timeline, casos y formulario.
4. Prueba el botón de WhatsApp y el envío del formulario de contacto.

Las consultas se guardan en la misma base de datos; en el panel admin (`/static/admin.html`) puedes filtrar por `site_key` si añades la opción en el desplegable (opcional: editar `admin.html` y agregar `<option value="inmobiliario">inmobiliario</option>` en el select de sitio).

## Resumen

| Qué | Dónde |
|-----|--------|
| Config (nombre, WhatsApp, colores, textos) | `config/sites/{site_key}.json` |
| Página del sitio | `frontend/themes/{site_key}/index.html` + `theme.css` |
| Identificador en el HTML | `window.SITE_KEY = '{site_key}'` en `index.html` |

No hace falta modificar el backend ni el `app.js` compartido para un nuevo sitio; solo nuevo JSON y nueva carpeta de tema.
