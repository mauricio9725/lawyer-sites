# Checklist de verificación - Lawyer Sites

Cuando tengas espacio en disco y dependencias instaladas, usa esta lista para comprobar que todo quedó bien.

## 1. Entorno

- [ ] Borrar el venv incompleto (carpeta `backend/venv`) si solo tiene `pyvenv.cfg`.
- [ ] Crear venv de nuevo:
  ```bash
  cd lawyer-sites/backend
  python -m venv venv
  venv\Scripts\activate
  pip install -r requirements.txt
  ```
- [ ] Opcional: definir `ADMIN_PASSWORD` y `JWT_SECRET` en entorno o en un archivo `.env` (y cargarlo con `python-dotenv` si lo añades).

## 2. Arranque del backend

- [ ] Desde `lawyer-sites/backend` con el venv activado:
  ```bash
  uvicorn app.main:app --reload --host 0.0.0.0 --port 8080
  ```
- [ ] No debe aparecer ningún error de importación ni al iniciar.
- [ ] Se crea el archivo `lawyer_sites.db` en `backend/` (SQLite).

## 3. API

- [ ] **Raíz:** abrir `http://localhost:8080/` → JSON con `"message": "Lawyer Sites API"`.
- [ ] **Docs:** `http://localhost:8080/docs` → Swagger UI.
- [ ] **Config:** `http://localhost:8080/api/config/laboral` → JSON con name, colors, hero, help_buttons, etc.
- [ ] **Contacto:** en `/docs`, probar `POST /api/contact` con body:
  ```json
  {
    "site_key": "laboral",
    "name": "Prueba",
    "email": "prueba@test.com",
    "phone": "",
    "case_type": "despido",
    "message": "Test"
  }
  ```
  → Respuesta 200 con el contacto guardado.
- [ ] **Login:** `POST /api/admin/login` con `{"username": "admin", "password": "cambiar_en_produccion"}` → respuesta con `access_token`.
- [ ] **Listado:** con el token en header `Authorization: Bearer <token>`, `GET /api/admin/contacts` → lista (puede estar vacía o con la prueba anterior).

## 4. Sitios (temas)

- [ ] `http://localhost:8080/themes/laboral/` → página con nombre "María González...", hero, botones "¿En qué te puedo ayudar?", timeline, formulario.
- [ ] Probar los otros: `/themes/familia/`, `/themes/penal/`, `/themes/civil/`, `/themes/general/`. Cada uno debe mostrar colores y textos distintos.
- [ ] Al hacer clic en un botón de ayuda, el botón flotante verde (WA) debe abrir WhatsApp con el mensaje correspondiente (número por defecto 573001234567).

## 5. Formulario y WhatsApp

- [ ] En cualquier tema, rellenar nombre, email y enviar el formulario → mensaje de éxito y el registro aparece en `GET /api/admin/contacts` (tras login).
- [ ] Botón flotante WA abre `https://wa.me/573001234567?text=...` con el mensaje del botón activo.

## 6. Panel admin

- [ ] `http://localhost:8080/static/admin.html` → pantalla de login.
- [ ] Usuario `admin`, contraseña `cambiar_en_produccion` → entra y se ve la tabla de consultas.
- [ ] Filtrar por sitio (ej. laboral) y por fechas y comprobar que la lista se actualiza.

## Si algo falla

- **ImportError o ModuleNotFoundError:** revisar que todas las dependencias de `requirements.txt` están instaladas en el venv activo.
- **404 en /api/config/laboral:** comprobar que existe `config/sites/laboral.json` y que el backend se ejecuta desde `lawyer-sites/backend` (o que `PROJECT_ROOT` apunta a la raíz del proyecto).
- **Página en blanco o "Cargando...":** abrir la consola del navegador (F12); si hay error de CORS o 404 al llamar a `/api/config/<site_key>`, el front no recibe la config.
- **Admin no hace login:** comprobar que `ADMIN_PASSWORD` no está definido (o que coincide con lo que pones); si usas `ADMIN_PASSWORD_HASH`, entonces la contraseña debe ser la que generó ese hash con bcrypt.
