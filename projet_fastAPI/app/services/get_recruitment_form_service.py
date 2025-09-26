from sqlalchemy.orm import Session
from app.models.form import Form

def get_recruitment_forms(status: int | None, db: Session):
    query = db.query(Form).filter(Form.type == 2)  # 2 = formulaire de recrutement
    if status is not None:
        query = query.filter(Form.status == status)
    return query.all()
