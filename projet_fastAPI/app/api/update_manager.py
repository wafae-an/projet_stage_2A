from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from database import get_db
from app.services.update_manager_service import update_manager_by_id  
from app.security import get_current_user

router = APIRouter()

@router.put("/managers/{manager_id}",summary="Mettre à jour un manager",
    description="""
    Cet endpoint permet de **mettre à jour les informations d’un manager** identifié par son `ID`.

    ### Conditions d'accès :
    - L'utilisateur doit posséder le rôle **ROLE_ADMIN**.
    - L'authentification via **JWT** est obligatoire.

    ### Exemple d'appel :
    ```
    PUT /managers/1
    Authorization: Bearer <token>
    Content-Type: application/json

    {
      "name": "Nouveau Nom",
      "email": "newmail@example.com",
      "phone": "+212600000000",
      "role": "ROLE_ORGANIZATION"
    }
    ```
    """,
    responses={
        200: {"description": "Manager mis à jour avec succès"},
        400: {"description": "Requête invalide"},
        401: {"description": "Non authentifié ou token invalide"},
        403: {"description": "Accès refusé : rôle non autorisé"},
        404: {"description": "Manager non trouvé"},
    },)
def update_manager(manager_id: int, data: dict, db: Session = Depends(get_db),current_user: dict = Depends(get_current_user)):
    
    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")

    return update_manager_by_id(manager_id, data, db)
