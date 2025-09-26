from sqlalchemy.orm import Session
from app.models.user import User
from app.models.organization import Organization
from app.models.organization_user import organization_user_table
from fastapi import HTTPException

def get_organizations_for_manager(db: Session, user_email: str):
    # Vérifier que l'utilisateur existe
    user = db.query(User).filter(User.email == user_email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    # Récupérer les organisations liées à l'utilisateur via la table de liaison
    organizations = (
        db.query(Organization)
        .join(organization_user_table, Organization.id == organization_user_table.organization_id)
        .filter(organization_user_table.user_id == user.id)
        .all()
    )

    return organizations
