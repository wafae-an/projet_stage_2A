from sqlalchemy.orm import Session
from sqlalchemy import text
from app.schemas.form import FormOut
from typing import Optional


def get_forms_by_type_status_and_program(program_id: int, form_type: int, form_status: Optional[int], db: Session):
    if form_type == 1:  # Formulaire de candidature
        query = """
            SELECT id, name, type, description
            FROM form
            WHERE type = :form_type AND program_id = :program_id
        """
        if form_status is not None:
            query += " AND status = :form_status"
        query += " ORDER BY id ASC"

        params = {
            "form_type": form_type,
            "program_id": program_id
        }
        if form_status is not None:
            params["form_status"] = form_status

    elif form_type == 3:  # Formulaire d’évaluation (lié à round)
        query = """
            SELECT f.id, f.name, f.type, f.description
            FROM form f
            WHERE f.type = 3
              AND f.id IN (
                  SELECT r.evaluation_form_id
                  FROM round r
                  WHERE r.program_id = :program_id
              )
        """
        if form_status is not None:
            query += " AND f.status = :form_status"
        query += " ORDER BY f.id ASC"

        params = {
            "program_id": program_id
        }
        if form_status is not None:
            params["form_status"] = form_status

    else:
        return []

    rows = db.execute(text(query), params).mappings().all()
    return [FormOut(**row) for row in rows]

