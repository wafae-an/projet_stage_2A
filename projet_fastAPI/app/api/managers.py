from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.get_managers_service_2 import get_all_managers 
from app.security import get_current_user
 



router = APIRouter()

@router.get("/gestionnaires",  # Liste des gestionnaires
    summary="Récupérer la liste des gestionnaires",
    description=(
        "Cet endpoint permet à un administrateur de récupérer la liste de tous les gestionnaires. "
        "Cette liste peut ensuite être utilisée pour assigner des organisations à un gestionnaire spécifique. "
        "⚠️ Seuls les utilisateurs ayant le rôle **ROLE_ADMIN** sont autorisés."
    ),
    response_description="Liste de gestionnaires disponibles")


def get_managers(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
    
):
    
    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    # Si current_user["roles"] est une liste (ce qui est généralement le cas avec des rôles JSON)
    

    return get_all_managers(db)
