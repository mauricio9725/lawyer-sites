"""
API de configuración por sitio. Devuelve el JSON del sitio para el frontend.
"""
import json
from pathlib import Path

from fastapi import APIRouter, HTTPException

from app.config import CONFIG_SITES_DIR

router = APIRouter(prefix="/api/config", tags=["config"])


@router.get("/{site_key}")
def get_site_config(site_key: str):
    """Devuelve la configuración del sitio (nombre, WhatsApp, colores, copy)."""
    if not site_key.replace("-", "").isalnum():
        raise HTTPException(status_code=400, detail="site_key inválido")
    path = CONFIG_SITES_DIR / f"{site_key}.json"
    if not path.exists():
        raise HTTPException(status_code=404, detail=f"Config no encontrada: {site_key}")
    try:
        with open(path, "r", encoding="utf-8") as f:
            return json.load(f)
    except json.JSONDecodeError as e:
        raise HTTPException(status_code=500, detail=f"Config inválida: {e}")
