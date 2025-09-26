from pydantic import BaseModel
from typing import Optional

class ProgramOut(BaseModel):
    id: int
    name: Optional[str]
    organization_id: int
    
  

    class Config:
        from_attributes = True
        
