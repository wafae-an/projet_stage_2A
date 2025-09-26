# app/services/assign_organizations_service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.models.organization_user import organization_user_table

def assign_organizations(manager_id: int, organization_ids: list[int], db: Session):
    # Vérifie que le gestionnaire a le bon rôle
    manager = db.query(User).filter(
        User.id == manager_id,
        User.roles.like('%"ROLE_ORGANIZATION"%')
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Gestionnaire introuvable")

    # Supprime les affectations existantes
    db.query(organization_user_table).filter(
        organization_user_table.user_id == manager_id
    ).delete()

    # Ajoute les nouvelles affectations
    for org_id in organization_ids:
        db.add(organization_user_table(
            organization_id=org_id,
            user_id=manager_id
        ))

    db.commit()
    return {"message": "Affectations mises à jour avec succès"}
