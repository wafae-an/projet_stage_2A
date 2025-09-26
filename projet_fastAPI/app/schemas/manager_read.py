from pydantic import BaseModel
from typing import List

class ManagerRead(BaseModel):
    id: int
    firstname: str
    lastname: str
    email: str
    phone: str
    roles: List[str]  # <- c'est maintenant une vraie liste
    

    class Config:
        from_attributes = True
