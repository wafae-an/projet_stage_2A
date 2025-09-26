from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User

def update_manager_by_id(manager_id: int, update_data: dict, db: Session):
    manager = db.query(User).filter(User.id == manager_id).first()
    if not manager:
        raise HTTPException(status_code=404, detail="Gestionnaire introuvable")

    for key, value in update_data.items():
        setattr(manager, key, value)

    db.commit()
    db.refresh(manager)

    return {"message": "Mise à jour réussie", "manager": manager}
