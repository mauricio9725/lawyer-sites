"""
Autenticación simple para el panel admin.
Usuario/contraseña; sin roles ni permisos avanzados.
"""
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext

from app.config import ADMIN_USER, ADMIN_PASSWORD_PLAIN, ADMIN_PASSWORD_HASH

# Algoritmo y clave (en producción usar SECRET_KEY de env)
SECRET_KEY = __import__("os").environ.get("JWT_SECRET", "cambiar-secret-en-produccion")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 480  # 8 horas

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer(auto_error=False)


def _get_password_hash(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(plain: str, hashed: Optional[str]) -> bool:
    if hashed:
        return pwd_context.verify(plain, hashed)
    # Fallback: comparación directa con ADMIN_PASSWORD (solo desarrollo)
    return plain == ADMIN_PASSWORD_PLAIN


def create_access_token(data: dict) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> str:
    if not credentials:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Credenciales no proporcionadas",
        )
    token = credentials.credentials
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Token inválido")
        return username
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o expirado",
        )


def authenticate_user(username: str, password: str) -> bool:
    if username != ADMIN_USER:
        return False
    return verify_password(password, ADMIN_PASSWORD_HASH)
