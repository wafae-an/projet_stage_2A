from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from database import get_db
from app.schemas.application_stat_recruitment import ApplicationStats
from app.services.get_stats_by_form_id_recruitment import get_stats_by_form_id_recruitment
from app.security import get_current_user



router = APIRouter()

@router.get("/stats/form/{form_id}", response_model=ApplicationStats, summary="📊 Récupérer les statistiques des candidatures",
    description="""
    Cet endpoint permet de récupérer les statistiques des candidatures
    associées à un formulaire de recrutement spécifique.
    
    Les informations retournées incluent :
    - Nombre total de candidats
    - Nombre de candidatures soumises
    - Nombre de candidatures en attente
    - Nombre de candidatures avec documents joints
    
    ⚠️ Accès restreint aux utilisateurs ayant le rôle **ROLE_ORGANIZATION**
    """,
    responses={
        200: {
            "description": "Statistiques récupérées avec succès",
            "content": {
                "application/json": {
                    "example": {
                        "total_candidates": 3,
                        "submitted": 3,
                        "pending": 0,
                        "with_documents": 0
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
            "description": "Formulaire introuvable",
            "content": {
                "application/json": {
                    "example": {"detail": "Formulaire non trouvé"}
                }
            },
        },
    },)
def get_application_stats(form_id: int, db: Session = Depends(get_db),current_user: str = Depends(get_current_user)):

    if "ROLE_ORGANIZATION" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    return get_stats_by_form_id_recruitment(form_id, db)
