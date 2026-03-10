# Cómo ver las páginas web (paso a paso)

## Paso 1: Encender el servidor

Abre **PowerShell** o **CMD** y ejecuta estos comandos **uno por uno**:

```powershell
cd C:\Users\Digital11\Desktop\Corners\lawyer-sites\backend
```

Luego:

```powershell
.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8082
```

**Importante:**
- **Tienes que estar en la carpeta `lawyer-sites\backend`.** Si arrancas desde otra carpeta (por ejemplo solo `Corners`), el servidor no encontrará `frontend` ni `config` y las páginas no serán las últimas versiones.
- No cierres esa ventana. Tiene que quedar abierta mientras quieras ver las páginas. Si ves algo como:

```
Uvicorn running on http://127.0.0.1:8082
```

es que el servidor está encendido.

---

## Paso 2: Abrir el navegador

Abre **Chrome**, **Edge** o **Firefox** y en la barra de direcciones escribe **exactamente** una de estas URLs:

### Páginas de abogados (temas)

| Qué es | URL para copiar |
|--------|------------------|
| Tema Laboral | http://127.0.0.1:8082/themes/laboral/ |
| Tema Familia | http://127.0.0.1:8082/themes/familia/ |
| Tema Penal | http://127.0.0.1:8082/themes/penal/ |
| Tema Civil | http://127.0.0.1:8082/themes/civil/ |
| Tema General | http://127.0.0.1:8082/themes/general/ |

### Panel de consultas (admin)

| Qué es | URL para copiar |
|--------|------------------|
| Panel admin (ver consultas) | http://127.0.0.1:8082/static/admin.html |

Usuario: **admin**  
Contraseña: **cambiar_en_produccion**

---

## Resumen rápido

1. En una terminal: `cd ...\lawyer-sites\backend` y luego `.\venv\Scripts\python.exe -m uvicorn app.main:app --host 127.0.0.1 --port 8082`
2. No cierres esa terminal.
3. En el navegador pon: **http://127.0.0.1:8082/themes/laboral/** (o otra de la tabla).

Si no ves la página, revisa que la terminal siga abierta y que no haya dado error al ejecutar el segundo comando.

---

## Si no ves las versiones o todo se ve igual

1. **Tienes que entrar por el servidor, no abriendo el archivo**  
   Usa la URL en el navegador: `http://127.0.0.1:8082/themes/penal/`  
   No abras `index.html` desde el Explorador de archivos (eso sería `file://` y no cargará estilos ni scripts).

2. **Pon la barra final en la URL**  
   Prueba con: `http://127.0.0.1:8082/themes/penal/` (con `/` al final).  
   Si pones `http://127.0.0.1:8082/themes/penal` (sin barra), el servidor te redirige a la versión con barra.

3. **Arranca el servidor desde la carpeta correcta**  
   En la terminal debe ser:
   ```powershell
   cd C:\Users\Digital11\Desktop\Corners\lawyer-sites\backend
   ```
   Luego ejecuta uvicorn. Si arrancas desde otra carpeta (por ejemplo solo `Corners`), las páginas no se encontrarán.

4. **Refresco fuerte para ver las últimas versiones**  
   Si no ves los diseños actualizados (civil con barra WhatsApp, penal con menú lateral, etc.), haz **recarga forzada**: **Ctrl + F5** (o Cmd + Shift + R en Mac). Así el navegador no usa la caché y carga el CSS/JS nuevo.

5. **Qué verás en cada tema**  
   - **Laboral** y **Familia, Civil, General** por ahora se ven con el mismo diseño (barra arriba y secciones en columna).  
   - Solo **Penal** tiene diseño distinto: menú fijo a la izquierda y contenido a la derecha.  
   Si en Penal no ves el menú a la izquierda, abre la consola del navegador (F12 → pestaña “Consola”) y revisa si sale algún error en rojo (por ejemplo 404 en `layout.js` o `layout.css`).
