from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from app.services.get_form_data_service import get_form_data
from app.schemas.formdata import FormDataRequest
from app.security import get_current_user


router = APIRouter()

@router.post("/formulaires/data",
    summary="Récupérer les candidatures d’un formulaire d’inscription expert",
    description=(
        "Cet endpoint permet de récupérer les **candidatures** (réponses des experts) "
        "pour un formulaire d’inscription donné. ⚠️ Seuls les utilisateurs ayant le rôle "
        "**ROLE_ORGANIZATION** sont autorisés."
    ),
    response_description="Liste des candidatures correspondant au formulaire et aux champs sélectionnés")
def fetch_form_data(payload: FormDataRequest, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):  
    
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    data = get_form_data(db, payload.form_id, payload.field_ids, payload.candidature_type, payload.form_type)
    return {"results": data}
