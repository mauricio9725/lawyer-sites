"""
Lawyer Sites - Backend centralizado.
Sirve API REST y archivos estáticos de cada tema.
"""
from pathlib import Path
from typing import Optional

from fastapi import FastAPI, Depends, Query
from sqlalchemy.orm import Session
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from app.config import CORS_ORIGINS, PROJECT_ROOT
from app.database import get_db, init_db
from app.routers import contact, config
from app.models import Contact
from app.schemas import ContactResponse, LoginRequest, TokenResponse
from app.auth import get_current_user, authenticate_user, create_access_token

app = FastAPI(
    title="Lawyer Sites API",
    description="Backend para sitios web de abogados",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(contact.router)
app.include_router(config.router)

# Admin: listado de contactos (protegido)
@app.get("/api/admin/contacts", response_model=list[ContactResponse])
def list_contacts(
    site_key: Optional[str] = Query(None),
    case_type: Optional[str] = Query(None),
    from_date: Optional[str] = Query(None),
    to_date: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _: str = Depends(get_current_user),
):
    from datetime import datetime
    q = db.query(Contact)
    if site_key:
        q = q.filter(Contact.site_key == site_key)
    if case_type:
        q = q.filter(Contact.case_type == case_type)
    if from_date:
        try:
            q = q.filter(Contact.created_at >= datetime.fromisoformat(from_date.replace("Z", "+00:00")))
        except ValueError:
            pass
    if to_date:
        try:
            q = q.filter(Contact.created_at <= datetime.fromisoformat(to_date.replace("Z", "+00:00")))
        except ValueError:
            pass
    return q.order_by(Contact.created_at.desc()).all()

# Auth: login
@app.post("/api/admin/login", response_model=TokenResponse)
def login(data: LoginRequest):
    from fastapi import HTTPException, status
    if not authenticate_user(data.username, data.password):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Usuario o contraseña incorrectos")
    return TokenResponse(access_token=create_access_token(data={"sub": data.username}))

# Archivos estáticos compartidos (CSS base, JS)
frontend_dir = PROJECT_ROOT / "frontend"
shared_dir = frontend_dir / "shared"
if shared_dir.exists():
    app.mount("/static", StaticFiles(directory=str(shared_dir)), name="static")

# Redirigir /themes/penal -> /themes/penal/ (antes del mount para que tenga prioridad)
from fastapi.responses import RedirectResponse
for _key in ("laboral", "familia", "penal", "civil", "general"):
    _path = f"/themes/{_key}"
    _target = _path + "/"
    app.add_api_route(_path, lambda u=_target: RedirectResponse(url=u, status_code=302), methods=["GET"])

# Temas: /themes/{site_key}/ -> index.html, theme.css
themes_dir = frontend_dir / "themes"
if themes_dir.exists():
    app.mount("/themes", StaticFiles(directory=str(themes_dir), html=True), name="themes")


@app.on_event("startup")
def startup():
    init_db()


@app.get("/")
def root():
    return {"message": "Lawyer Sites API", "docs": "/docs"}
