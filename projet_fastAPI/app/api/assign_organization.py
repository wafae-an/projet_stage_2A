from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from pydantic import BaseModel
from app.services.assign_organizations_service import assign_organizations
from app.security import get_current_user

router = APIRouter()

class AssignmentRequest(BaseModel):
    manager_id: int
    organization_ids: list[int]


@router.post("/organization/assign",
         summary="Assigner des organisations à un gestionnaire",
         description=(
        "Cet endpoint permet à un **administrateur** d’assigner une ou plusieurs organisations "
        "à un gestionnaire. Seuls les utilisateurs ayant le rôle `ROLE_ADMIN` sont autorisés."
    ),
    tags=["Organizations"],
    response_description="Résultat de l’assignation des organisations")
def assign_organizations_to_manager(payload: AssignmentRequest, db: Session = Depends(get_db),current_user: dict = Depends(get_current_user)):
    
     if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
     return assign_organizations(payload.manager_id, payload.organization_ids, db)
