"""
Esquemas Pydantic para validación de API.
"""
from datetime import datetime
from typing import Optional

from pydantic import BaseModel, EmailStr, Field


# ----- Contact (formulario) -----
class ContactCreate(BaseModel):
    site_key: str = Field(..., min_length=1, max_length=50)
    lawyer_type: Optional[str] = Field(None, max_length=100)
    name: str = Field(..., min_length=1, max_length=200)
    email: EmailStr
    phone: Optional[str] = Field(None, max_length=50)
    case_type: Optional[str] = Field(None, max_length=200)
    message: Optional[str] = Field(None, max_length=5000)


class ContactResponse(BaseModel):
    id: int
    created_at: datetime
    site_key: str
    lawyer_type: Optional[str]
    name: str
    email: str
    phone: Optional[str]
    case_type: Optional[str]
    message: Optional[str]

    class Config:
        from_attributes = True


# ----- Admin / Listado -----
class ContactListFilters(BaseModel):
    site_key: Optional[str] = None
    case_type: Optional[str] = None
    from_date: Optional[datetime] = None
    to_date: Optional[datetime] = None


# ----- Auth -----
class LoginRequest(BaseModel):
    username: str
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
