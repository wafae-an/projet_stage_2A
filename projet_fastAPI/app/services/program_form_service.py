from sqlalchemy.orm import Session
from sqlalchemy import func
from app.models.form import Form

def count_forms_by_status_for_program(db: Session, program_id: int) -> dict:
    """
    Retourne le nombre de formulaires soumis (status=1) et non soumis (status=0) pour un programme donné.
    """
    # Initialiser les stats à 0
    submitted_count = 0
    not_submitted_count = 0

    # Récupérer les comptes groupés par status
    results = (
        db.query(Form.status, func.count(Form.id))
        .filter(Form.program_id == program_id)
        .group_by(Form.status)
        .all()
    )

    # Affecter les résultats aux bonnes variables
    for status, count in results:
        if status == 1:
            submitted_count = count
        elif status == 0:
            not_submitted_count = count

    return {
        "submitted": submitted_count,
        "not_submitted": not_submitted_count
    }
