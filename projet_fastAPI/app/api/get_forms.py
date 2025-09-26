from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from typing import Optional, Union
from database import get_db
from app.schemas.form import FormOut
from app.services.get_forms_by_type_status_program import get_forms_by_type_status_and_program
from app.services.get_forms_by_type_status import get_forms_by_type_and_status
from app.security import get_current_user


router = APIRouter()

@router.get("/forms", response_model=list[FormOut],summary="Récupérer les formulaires",
    description=(
        "Cet endpoint permet de récupérer les formulaires en fonction de critères sélectionnés :\n\n"
        "- **Type de formulaire** : `application` ou `evaluation`\n"
        "- **Statut du formulaire** : `submitted`, `not-submitted`, ou `all`\n"
        "- **Programme** : optionnel, filtrage par identifiant de programme\n"
        "- **Organisation** : optionnel, par défaut `all`\n\n"
        "⚠️ Seuls les utilisateurs ayant le rôle **ROLE_ORGANIZATION** peuvent accéder à cet endpoint."
    ),
    response_description="Liste des formulaires correspondant aux critères sélectionnés")
def get_forms(
    form_type: str = Query(..., pattern="^(application|evaluation)$"),
    form_status: str = Query(..., pattern="^(submitted|not-submitted|all)$"),
    program_id: Optional[int] = Query(None),
    organization_id: Optional[Union[int, str]] = Query("all"),  # 👈 ajouté ici
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)

):
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
   
    
    # Mapping des valeurs
    type_map = {
        "application": 1,
        "evaluation": 3
    }

    status_map = {
        "submitted": 1,
        "not-submitted": 0
    }

    type_value = type_map.get(form_type)
    status_value = None if form_status == "all" else status_map.get(form_status)

    if program_id is None:
        # Cas où on filtre par organisation uniquement
        return get_forms_by_type_and_status(
            db=db,
            form_type=type_value,
            form_status=status_value,
            selected_organization=organization_id
        )
    else:
        return get_forms_by_type_status_and_program(
            program_id=program_id,
            form_type=type_value,
            form_status=status_value,
            db=db
        )
