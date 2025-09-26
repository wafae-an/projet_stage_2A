# routers/fields.py

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.schemas.field import FieldOut
from app.services.field_service import get_fields_by_form 
from app.security import get_current_user 

router = APIRouter(prefix="/fields", tags=["Fields"])

@router.get(
    "/form/{form_id}",
    response_model=list[FieldOut],
    summary="Récupérer les champs d’un formulaire",
    description=(
        "Cet endpoint permet à un utilisateur ayant le rôle **ROLE_ORGANIZATION** "
        "de récupérer la liste des champs associés à un formulaire donné."
    ),
    response_description="Liste des champs du formulaire demandée"
)
def get_fields_by_form_id(form_id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):
    
    
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return get_fields_by_form(form_id, db)
