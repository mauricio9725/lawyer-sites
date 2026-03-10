# Lawyer Sites - Producto base para sitios web de abogados

Producto SaaS simple para generar páginas web profesionales por tipo de abogado: mismo backend, múltiples temas (frontend) configurables por JSON.

## Estructura del proyecto

```
lawyer-sites/
├── backend/                 # FastAPI, SQLite, SQLAlchemy
│   ├── app/
│   │   ├── main.py          # App, rutas API, montaje estático
│   │   ├── config.py
│   │   ├── database.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   ├── auth.py
│   │   └── routers/        # contact, config
│   ├── requirements.txt
│   └── lawyer_sites.db      # Creado al arrancar (SQLite)
├── config/
│   └── sites/              # Un JSON por sitio
│       ├── laboral.json
│       ├── familia.json
│       ├── penal.json
│       ├── civil.json
│       └── general.json
├── frontend/
│   ├── shared/             # CSS/JS común + admin
│   │   ├── base.css
│   │   ├── app.js
│   │   └── admin.html
│   └── themes/
│       ├── laboral/        # index.html + theme.css
│       ├── familia/
│       ├── penal/
│       ├── civil/
│       └── general/
└── docs/
    └── NUEVO_SITIO.md      # Cómo crear un nuevo sitio
```

## Cómo correr el proyecto

1. **Entorno Python** (recomendado 3.9+):

   Si la carpeta `backend/venv` existe pero está incompleta (solo tiene `pyvenv.cfg`), bórrala y créala de nuevo.

   ```bash
   cd lawyer-sites/backend
   python -m venv venv
   venv\Scripts\activate    # Windows
   pip install -r requirements.txt
   ```

2. **Variables de entorno** (opcional):

   - `ADMIN_USER`: usuario del panel (default: `admin`)
   - `ADMIN_PASSWORD`: contraseña (default: `cambiar_en_produccion`)
   - `DATABASE_URL`: si no se define, usa SQLite en `backend/lawyer_sites.db`
   - `JWT_SECRET`: clave para tokens (cambiar en producción)

3. **Arrancar el servidor**:

   ```bash
   uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
   ```

4. **URLs útiles**:

   - API: `http://localhost:8080`
   - Documentación: `http://localhost:8080/docs`
   - Temas (sitios):
     - Laboral: `http://localhost:8080/themes/laboral/`
     - Familia: `http://localhost:8080/themes/familia/`
     - Penal: `http://localhost:8080/themes/penal/`
     - Civil: `http://localhost:8080/themes/civil/`
     - General: `http://localhost:8080/themes/general/`
   - Panel admin: `http://localhost:8080/static/admin.html`

   Para comprobar que todo quedó bien, sigue la checklist en `docs/VERIFICACION.md`.

## Configuración por sitio

Cada sitio se controla con un JSON en `config/sites/{site_key}.json`. Ejemplo de campos:

- `site_key`, `lawyer_type`, `name`, `tagline`
- `whatsapp_number`: número sin espacios (ej. `573001234567`)
- `colors`: `primary`, `primaryLight`, `accent`, `text`, `background`
- `hero`: `title`, `subtitle`
- `help_buttons`: array de `{ "id", "label", "whatsapp_msg" }`
- `timeline_title`, `timeline_steps` (array de strings)
- `cases_title`, `cases` (array de strings)
- `profile_title`, `profile_text`
- `cta_title`, `cta_subtitle`

Para crear un nuevo sitio solo hace falta copiar un JSON, ajustar valores y añadir una carpeta en `frontend/themes/` con `index.html` y `theme.css` (y en `index.html` poner `window.SITE_KEY = 'nuevo_sitio'`). Ver `docs/NUEVO_SITIO.md`.

## API

- `POST /api/contact`: body JSON con `site_key`, `lawyer_type`, `name`, `email`, `phone`, `case_type`, `message`. Guarda la consulta en la base de datos.
- `GET /api/config/{site_key}`: devuelve el JSON de configuración del sitio (para el front).
- `POST /api/admin/login`: body `{ "username", "password" }` → devuelve `{ "access_token" }`.
- `GET /api/admin/contacts`: requiere header `Authorization: Bearer <token>`. Parámetros opcionales: `site_key`, `case_type`, `from_date`, `to_date`. Lista consultas.

## Panel admin

- URL: `/static/admin.html`
- Login con `ADMIN_USER` / `ADMIN_PASSWORD`.
- Tras entrar se muestra la lista de consultas; se puede filtrar por sitio y rango de fechas.

## Despliegue en VPS

- Usar un proceso manager (systemd, supervisor) para `uvicorn app.main:app --host 0.0.0.0 --port 8080`.
- Poner un reverse proxy (Nginx) delante y, si aplica, HTTPS.
- En producción: definir `ADMIN_PASSWORD`, `JWT_SECRET` y, si se usa Postgres, `DATABASE_URL`.

## Migrar a Postgres

En `config.py` usar por ejemplo:

`DATABASE_URL=postgresql://user:pass@localhost/lawyer_sites`

y en `requirements.txt` descomentar `psycopg2-binary`. Las tablas son las mismas (SQLAlchemy).
