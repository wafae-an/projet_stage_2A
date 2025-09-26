from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.security import get_current_user
from app.services.organization_service import get_organizations_for_manager

router = APIRouter()

@router.get("/my-organizations",summary="Lister les organisations du manager connecté",
    description="""
    Cet endpoint retourne la liste des **organisations assignées** 
    au manager actuellement connecté.

    ### Conditions d'accès :
    - L'utilisateur doit posséder le rôle **ROLE_ORGANIZATION**.
    - L'authentification est obligatoire (JWT).
    
    ### Exemple d'utilisation :
    ```
    GET /my-organizations
    Authorization: Bearer <token>
    ```
    """,
    responses={
        200: {"description": "Liste des organisations récupérée avec succès"},
        403: {"description": "Accès refusé : rôle non autorisé"},
        401: {"description": "Non authentifié ou token invalide"},
    },)
def list_my_organizations(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    print("👤 Utilisateur connecté :", current_user)
    
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")

    return get_organizations_for_manager(db, current_user["email"])
