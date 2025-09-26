from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List
from app.models.invitation import Invitation
from app.models.user import User
from app.schemas.invitation import InvitationOut
from app.schemas.config import settings


def get_invitations_by_status_and_form(status: str, form_id: int, db: Session) -> List[InvitationOut]:
    test_emails = [email.strip() for email in settings.lis_user_email_test.split(",")]

    query = (
        db.query(
            Invitation.id.label("inv_id"),
            Invitation.hash.label("inv_hash"),
            Invitation.email.label("inv_email"),
            Invitation.user_id.label("inv_user_id"),
            func.concat(User.firstname, " ", User.lastname).label("user_nom_complet"),
            Invitation.status.label("inv_status"),
        )
        .join(User, Invitation.user_id == User.id)
        .filter(Invitation.form_id == form_id)
        .filter(Invitation.type == 4)
        .filter(Invitation.email.notin_(test_emails))
    )

    if status == "used":
        query = query.filter(Invitation.status == 1)
    elif status == "incomplete":
        query = query.filter(Invitation.status == -1)
    elif status == "unused":
        query = query.filter(Invitation.status.is_(None))
    elif status == "all":
        pass
    else:
        raise ValueError("Statut d'invitation invalide")

    query = query.order_by(Invitation.type.asc())

    # 🔁 Transformer les résultats manuellement en objets Pydantic
    results = query.all()
    invitations = []

    for row in results:
        invitations.append(InvitationOut(
            id=row.inv_id,
            invitationHash=row.inv_hash,
            Expertemail=row.inv_email,
            managerId=row.inv_user_id,
            managerName=row.user_nom_complet,
            status=row.inv_status,
        ))

    return invitations
