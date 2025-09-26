from pydantic import BaseModel
from typing import Optional

class FormOut(BaseModel):
    id: int
    name: str
    type: int
    description: Optional[str] = None  # 👈 bonne pratique : valeur par défaut

    class Config:
        from_attributes = True  # ✅ Pydantic v2 only
