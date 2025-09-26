from collections import defaultdict
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import text
from app.schemas.config import settings

def get_form_data(db: Session, form_id: int, field_ids: List[int], candidature_type: str, form_type: str):
    # Construction de la requête principale
    query = """
        SELECT a.id AS application_id, u.firstname, u.lastname, u.email,
               a.submitted,
               f.id AS field_id, f.caption, d.value
    """

    if form_type == "evaluation":
        query += """,
               up.firstname AS owner_firstname,
               up.lastname AS owner_lastname,
               up.email AS owner_email,
               up.id AS owner_id
        """

    query += """
        FROM application a
        JOIN user u ON u.id = a.submitted_by_id
        JOIN data d ON d.application_id = a.id AND d.form_id = a.form_id
        JOIN field f ON f.id = d.field_id
    """

    if form_type == "evaluation":
        query += """
        LEFT JOIN application ae ON ae.id = a.evaluation_id
        LEFT JOIN user up ON up.id = ae.submitted_by_id
        """

    query += """
        WHERE a.form_id = :form_id
          AND d.field_id IN :field_ids
    """

    if candidature_type == "submitted":
        query += " AND a.submitted = 1"
    elif candidature_type == "not-submitted":
        query += " AND a.submitted = 0"

    rows = db.execute(text(query), {
        "form_id": form_id,
        "field_ids": tuple(field_ids)
    }).fetchall()

    grouped = defaultdict(lambda: {"files": []})

    for row in rows:
        app_id = row.application_id
        grouped[app_id]["candidature_id"] = app_id
        grouped[app_id]["name"] = f"{row.firstname} {row.lastname}"
        grouped[app_id]["email"] = row.email
        grouped[app_id]["candidature_status"] = "Soumise" if row.submitted else "Non soumise"
        grouped[app_id][row.field_id] = row.value

        if form_type == "evaluation":
            grouped[app_id]["project_owner"] = f"{row.owner_firstname} {row.owner_lastname}" if row.owner_firstname else "-"
            grouped[app_id]["project_owner_email"] = row.owner_email or "-"
            grouped[app_id]["project_owner_id"] = row.owner_id

    # Requête pour récupérer les fichiers
    file_query = """
        SELECT file.id AS file_id, file.root AS file_root, file.name as file_name, file.application_id, f.caption
        FROM file
        JOIN field f ON file.field_id = f.id
        JOIN application a ON a.id = file.application_id
        WHERE a.form_id = :form_id
          AND f.type = 'file'
    """

    file_rows = db.execute(text(file_query), {"form_id": form_id}).fetchall()
    print("Fichiers récupérés :", file_rows)

    for file_row in file_rows:
        app_id = file_row.application_id
        if app_id in grouped:
            grouped[app_id]["files"].append({
                "caption": file_row.caption,
                "name": file_row.file_name,
                "url": f"{settings.DOMAIN_URL}/download/{file_row.file_id}"
            })

    print("Applications regroupées (grouped.keys()):", list(grouped.values()))

    return list(grouped.values())
