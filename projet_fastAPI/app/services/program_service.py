from sqlalchemy.orm import Session
from typing import Union, List
from app.models.program import Program
from app.services.organization_service import get_organizations_for_manager  # adapte l'import

def get_programs_by_organization(
    organization_id: Union[int, str],
    db: Session,
    user_email: str
) -> List[Program]:

    if organization_id == "all":
        # Récupérer les organisations de l'utilisateur
        organizations = get_organizations_for_manager(db, user_email)
        org_ids = [org.id for org in organizations]

        # Filtrer les programmes par ces organizations
        return db.query(Program).filter(Program.organization_id.in_(org_ids)).all()

    else:
        return db.query(Program).filter(Program.organization_id == int(organization_id)).all()
