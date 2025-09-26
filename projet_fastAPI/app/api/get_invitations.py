from fastapi import APIRouter, Depends, Query,HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from app.schemas.invitation import InvitationOut
from app.services.get_invitations_by_status_formID import get_invitations_by_status_and_form
from app.security import get_current_user 

router = APIRouter()

@router.get("/invitations/experts", response_model=List[InvitationOut],
    summary="Lister les invitations envoyées aux experts",
    description=(
        "Récupère les invitations envoyées aux experts pour s’inscrire via un formulaire donné. "
        "Le filtrage peut se faire par **statut** (`used`, `unused`, `incomplete`, `all`) et par **form_id**."
    ),
    response_description="Liste des invitations correspondant aux critères",
    responses={
        200: {"description": "Invitations récupérées avec succès"},
        403: {"description": "Accès refusé : rôle non autorisé"},
        422: {"description": "Erreur de validation des paramètres"},
    },)
def fetch_invitations(
    status: str = Query(..., enum=["used", "unused", "incomplete", "all"]),
    form_id: int = Query(..., description="ID du formulaire"),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
    
):
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return get_invitations_by_status_and_form(status=status, form_id=form_id, db=db)
