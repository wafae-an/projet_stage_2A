from fastapi import APIRouter, Query, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Union, List

from database import get_db
from app.schemas.program import ProgramOut
from app.services.program_service import get_programs_by_organization
from app.security import get_current_user_email,get_current_user  # dépendances

router = APIRouter()

@router.get("/programs", response_model=List[ProgramOut],
    summary="Récupérer les programmes d’une organisation",
    description=(
        "Cet endpoint permet de récupérer tous les programmes associés à une organisation donnée, "
        "en se basant sur son `organization_id`. ⚠️ Seuls les utilisateurs ayant le rôle "
        "**ROLE_ORGANIZATION** sont autorisés."
    ),
    response_description="Liste des programmes de l’organisation")
def get_programs(
    organization_id: Union[int, str] = Query(...),
    db: Session = Depends(get_db),
    user_email: str = Depends(get_current_user_email),
    current_user: dict = Depends(get_current_user)
    
):
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    

    
    return get_programs_by_organization(organization_id, db, user_email)
