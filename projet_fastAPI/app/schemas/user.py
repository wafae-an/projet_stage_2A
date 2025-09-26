from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class UserOut(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    phone: Optional[str] = None
    organism: Optional[str] = None
    country: Optional[str] = None
    roles: str
    created: datetime  # ou Optional[datetime] si tu veux autoriser les valeurs nulles
    confirmed: int
    confirmed_on: Optional[datetime] = None
    token: Optional[str] = None
    is_jury: Optional[int] = None

    class Config:
        from_attributes = True  # ✅ Nécessaire pour utiliser .from_orm()
