# app/api/users.py

from fastapi import APIRouter, Query, Depends,HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.schemas.user import UserOut
from app.services.get_users import get_users_by_role_and_confirmation
from app.security import get_current_user


router = APIRouter()

@router.get("/users", response_model=List[UserOut],
    summary="Récupérer les utilisateurs filtrés par rôle et confirmation",
    description=(
        "Cet endpoint permet de récupérer les utilisateurs en fonction de leur rôle :\n\n"
        "- **ROLE_ADMIN** → Administrateurs\n"
        "- **ROLE_ORGANIZATION** → Gestionnaires\n"
        "- **ROLE_EXPERT** → Experts\n"
        "- **ROLE_OWNER** → Porteurs de projet\n\n"
        "Il est aussi possible de filtrer selon leur statut de confirmation "
        "(`confirmed` ou `not-confirmed`). ⚠️ Seuls les administrateurs peuvent accéder à cet endpoint."
    ),
    response_description="Liste des utilisateurs correspondant aux filtres")
def get_users(
     role_label: str = Query("Tous"),
    confirmed_user: int = Query(1),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)

):
    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")

    return get_users_by_role_and_confirmation(
        db=db,
        role_label=role_label,
        confirmed=confirmed_user
    )
