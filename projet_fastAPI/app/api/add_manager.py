from fastapi import APIRouter, HTTPException, Depends
from sqlalchemy.orm import Session
from app.schemas.manager_add import ManagerCreate
from database import get_db
from app.services.create_manager_service import create_manager
from app.security import get_current_user

router = APIRouter()

@router.post(
    "/add_manager",
    summary="Ajouter un nouveau gestionnaire",
    description="""
    Cette route permet à un administrateur d’ajouter un nouveau gestionnaire dans le système.

     **Accès restreint** : seul un utilisateur avec le rôle `ROLE_ADMIN` peut effectuer cette opération.

     **Le gestionnaire sera créé avec les informations suivantes** : prénom, nom, email, mot de passe (et autres champs définis dans le schéma `ManagerCreate`).
    """,
    response_description="Retourne l'ID du nouveau gestionnaire et un message de confirmation"
)
def add_manager(
    manager: ManagerCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    """
    Ajoute un nouveau gestionnaire au système s’il est autorisé.
    """
    # Vérifie que l'utilisateur connecté est un administrateur
    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")

    # Crée le gestionnaire via le service
    new_user = create_manager(manager, db)

    # Réponse de confirmation
    return {
        "message": "Gestionnaire ajouté avec succès",
        "id": new_user.id
    }
