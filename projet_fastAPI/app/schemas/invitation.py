from pydantic import BaseModel,ConfigDict
from typing import Optional
class InvitationOut(BaseModel):
    id: int
    managerId: int
    managerName: Optional[str] = None  # à peupler manuellement depuis la jointure
    Expertemail: Optional[str] = None
    status: Optional[int] = None
    invitationHash: Optional[str] = None



    model_config = ConfigDict(from_attributes=True)
 
