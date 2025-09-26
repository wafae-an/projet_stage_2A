from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.get_organization_by_manager_service import get_organizations_by_manager
from app.security import get_current_user


router = APIRouter()

@router.get("/managers/{manager_id}/organizations",summary="Lister les organisations d’un gestionnaire",
    description=(
        "Cet endpoint permet à un administrateur de récupérer :\n"
        "- Les organisations **déjà assignées** à un gestionnaire donné\n"
        "- Les organisations **disponibles** (non encore assignées)\n\n"
        "⚠️ Accès réservé aux utilisateurs avec le rôle **ROLE_ADMIN**."
    ),
    response_description="Liste des organisations assignées et disponibles")
def get_organizations(manager_id: int, db: Session = Depends(get_db),current_user: dict = Depends(get_current_user)):

    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return get_organizations_by_manager(manager_id, db)
