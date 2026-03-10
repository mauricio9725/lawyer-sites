"""
API de contacto: guardar consultas desde el frontend.
"""
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Contact
from app.schemas import ContactCreate, ContactResponse

router = APIRouter(prefix="/api/contact", tags=["contact"])


@router.post("", response_model=ContactResponse)
def create_contact(data: ContactCreate, db: Session = Depends(get_db)):
    """Recibe el formulario de contacto y lo guarda en la base de datos."""
    contact = Contact(
        site_key=data.site_key,
        lawyer_type=data.lawyer_type,
        name=data.name,
        email=data.email,
        phone=data.phone,
        case_type=data.case_type,
        message=data.message,
    )
    db.add(contact)
    db.commit()
    db.refresh(contact)
    return contact
