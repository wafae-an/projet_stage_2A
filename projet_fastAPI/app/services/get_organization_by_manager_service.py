from sqlalchemy.orm import Session
from fastapi import HTTPException
from sqlalchemy import func
from app.models.user import User
from app.models.organization import Organization
from app.models.organization_user import organization_user_table



def get_organizations_by_manager(manager_id: int, db: Session):
    # Vérifier si l'utilisateur est un gestionnaire
    manager = db.query(User).filter(
        User.id == manager_id,
        func.json_contains(User.roles, '"ROLE_ORGANIZATION"')
    ).first()

    if not manager:
        raise HTTPException(status_code=404, detail="Gestionnaire non trouvé")

    # Récupérer toutes les organisations
    all_orgs = db.query(Organization).all()

    # Récupérer les IDs des organisations affectées à ce gestionnaire
    assigned_orgs = db.query(organization_user_table).filter(
        organization_user_table.user_id == manager_id
    ).all()

    assigned_ids = [org.organization_id for org in assigned_orgs]

    # Séparer les organisations en affectées / disponibles
    assigned = [org for org in all_orgs if org.id in assigned_ids]
    available = [org for org in all_orgs if org.id not in assigned_ids]

    # Sérialiser les objets à renvoyer
    def serialize(org):
        return {
            "id": org.id,
            "name": org.name,
            "type": org.type
        }

    return {
        "assigned": [serialize(o) for o in assigned],
        "available": [serialize(o) for o in available]
    }
