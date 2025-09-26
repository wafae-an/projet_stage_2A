# services/field_service.py

from sqlalchemy.orm import Session
from sqlalchemy import text
from fastapi import HTTPException

def get_fields_by_form(form_id: int, db: Session):
    query = text("""
        SELECT f.id AS field_id, f.caption AS field_caption
        FROM field f
        WHERE f.form_id = :form_id AND f.type NOT IN ('header', 'paragraph', 'file')
        ORDER BY f.id ASC
    """)
    result = db.execute(query, {"form_id": form_id}).fetchall()

    if not result:
        raise HTTPException(status_code=404, detail="Aucun champ trouvé pour ce formulaire")

    # transformer les résultats en liste de dicts
    return [{"id": row.field_id, "caption": row.field_caption} for row in result]
