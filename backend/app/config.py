"""
Configuración central del backend.
Variables de entorno para VPS; valores por defecto para desarrollo.
"""
import os
from pathlib import Path

# Ruta base del proyecto (backend)
BASE_DIR = Path(__file__).resolve().parent.parent
# Ruta a config/sites (por encima de backend)
PROJECT_ROOT = BASE_DIR.parent
CONFIG_SITES_DIR = PROJECT_ROOT / "config" / "sites"

# Base de datos
DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR / 'lawyer_sites.db'}")

# Admin panel - credenciales simples (cambiar en producción)
ADMIN_USER = os.getenv("ADMIN_USER", "admin")
ADMIN_PASSWORD_HASH = os.getenv("ADMIN_PASSWORD_HASH")  # Si está definido, se usa; si no, ver auth.py
ADMIN_PASSWORD_PLAIN = os.getenv("ADMIN_PASSWORD", "cambiar_en_produccion")

# CORS - en producción restringir orígenes
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")
