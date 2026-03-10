# Imágenes del sitio

Puedes colocar aquí las imágenes propias del cliente para reemplazar las URLs de placeholder.

## Uso desde el JSON de configuración

En `config/sites/{site_key}.json` puedes definir:

- **hero**: imagen de fondo del hero. Ejemplo: `"/static/images/hero-lawyer.jpg"` o URL externa.
- **profile** (o **profile_image**): foto del abogado. Ejemplo: `"/static/images/foto-abogada.jpg"`.

Si usas rutas relativas al sitio, las imágenes deben estar en esta carpeta (`frontend/shared/images/`) y se sirven en `/static/images/`.

## Nombres sugeridos

- `hero-lawyer.jpg` – Hero (recomendado 1200×800 px o similar)
- `consultation.jpg` – Opcional para otras secciones
- `lawyer-office.jpg` – Opcional
- `foto-perfil.jpg` – Foto del abogado (cuadrado, ej. 400×400 px)

Las URLs que ves en los JSON por defecto son de Unsplash (placeholders). Sustituye en el JSON por `/static/images/tu-archivo.jpg` cuando tengas las imágenes del cliente.
