"""
Modelos de base de datos. Estables y mínimos.
"""
from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime

from app.database import Base


class Contact(Base):
    """Consulta/contacto recibida desde cualquier sitio."""
    __tablename__ = "contacts"

    id = Column(Integer, primary_key=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Identificación del sitio
    site_key = Column(String(50), nullable=False, index=True)  # laboral, familia, penal, etc.
    lawyer_type = Column(String(100), nullable=True)  # Tipo de abogado del sitio

    # Datos del cliente
    name = Column(String(200), nullable=False)
    email = Column(String(200), nullable=False)
    phone = Column(String(50), nullable=True)
    case_type = Column(String(200), nullable=True)  # Tipo de caso seleccionado
    message = Column(Text, nullable=True)

    def __repr__(self):
        return f"<Contact {self.id} {self.name} {self.site_key}>"
