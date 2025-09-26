from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.get_recruitment_form_service import get_recruitment_forms
from database import get_db
from app.schemas.form import FormOut 
from app.security import get_current_user 

router = APIRouter()

@router.get("/forms/registration", response_model=list[FormOut])
def fetch_submitted_registration_forms(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    allowed_roles = {"ROLE_ORGANIZATION", "ROLE_ADMIN"}
    user_roles = set(current_user.get("roles", []))
    
    if not user_roles.intersection(allowed_roles):
        raise HTTPException(status_code=403, detail="Accès réservé aux gestionnaires et administrateurs")

    forms = get_recruitment_forms(status=1, db=db)
    
    if not forms:
        raise HTTPException(status_code=404, detail="Aucun formulaire de recrutement soumis trouvé.")
    
    return forms
