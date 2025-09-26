from fastapi import APIRouter, Depends, Query,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.services.program_form_service import count_forms_by_status_for_program
from app.security import get_current_user 


router = APIRouter(prefix="/stats", tags=["Form Stats"])

@router.get("/forms",summary="Récupérer les statistiques des formulaires d’un programme",
    description="""
    Cet endpoint retourne le nombre de formulaires soumis et non soumis 
    pour un programme donné, ainsi que le total des formulaires.
    """,
    responses={
        200: {
            "description": "Statistiques récupérées avec succès",
            "content": {
                "application/json": {
                    "example": {
                        "submitted": 5,
                        "not_submitted": 0,
                        "total": 5
                    }
                }
            },
        },
        403: {
            "description": "Accès refusé : rôle non autorisé",
            "content": {
                "application/json": {
                    "example": {"detail": "Accès refusé : rôle non autorisé"}
                }
            },
        },
        404: {
            "description": "Programme introuvable",
            "content": {
                "application/json": {
                    "example": {"detail": "Programme non trouvé"}
                }
            },
        },
    },)
def get_form_status_counts_by_program(
    program_id: int = Query(..., description="ID du programme"),
    db: Session = Depends(get_db),
    current_user: str = Depends(get_current_user)
):
    
    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return count_forms_by_status_for_program(db, program_id)
