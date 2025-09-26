from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from app.schemas.form import FormOut
from database import get_db
from app.services.get_recruitment_form_service import get_recruitment_forms
from app.security import get_current_user


router = APIRouter(prefix="/forms", tags=["Forms"])

@router.get("/recrutement", response_model=list[FormOut],
    summary="Récupérer les formulaires d’inscription des experts",
    description=(
        "Cet endpoint permet à une organisation de récupérer les formulaires d’inscription des experts, "
        "en filtrant selon leur statut : soumis, non soumis ou tous. ⚠️ Accès réservé aux utilisateurs "
        "ayant le rôle **ROLE_ORGANIZATION**."
    ),
    response_description="Liste des formulaires d’inscription des experts")
def get_forms_by_status(status: int | None = Query(None), db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):

    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return get_recruitment_forms(status, db)
