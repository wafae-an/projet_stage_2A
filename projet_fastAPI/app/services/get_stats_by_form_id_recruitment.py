from sqlalchemy.orm import Session
from sqlalchemy import text
from app.schemas.application_stat_recruitment import ApplicationStats

def get_stats_by_form_id_recruitment(form_id: int, db: Session) -> ApplicationStats:
    query = text("""
        SELECT
            COUNT(a.id) AS total,
            SUM(CASE WHEN a.submitted = 1 THEN 1 ELSE 0 END) AS submitted,
            SUM(CASE WHEN a.submitted = 0 THEN 1 ELSE 0 END) AS not_submitted,
            COUNT(DISTINCT f.application_id) AS with_documents
        FROM application a
        LEFT JOIN file f ON a.id = f.application_id
        WHERE a.form_id = :form_id
    """)
    result = db.execute(query, {"form_id": form_id}).fetchone()

    return ApplicationStats(
        total=result.total or 0,
        submitted=result.submitted or 0,
        not_submitted=result.not_submitted or 0,
        with_documents=result.with_documents or 0
    )
