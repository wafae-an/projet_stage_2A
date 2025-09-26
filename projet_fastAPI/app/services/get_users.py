from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserOut
from typing import List
import json

# Mapping visible <-> rôle système
ROLE_MAPPING = {
    "Porteurs": "ROLE_STARTUP",
    "Experts": "ROLE_JURY",
    "Gestionnaires": "ROLE_ORGANIZATION",
    "Administrateurs": "ROLE_ADMIN",
    "Utilisateurs": "ROLE_USER",
    "Tous": None
}

def get_users_by_role_and_confirmation(
    db: Session,
    role_label: str,
    confirmed: int
) -> List[UserOut]:

    selected_role = ROLE_MAPPING.get(role_label)

    users = db.query(User).filter(User.confirmed == confirmed).all()
    filtered_users = []

    for user in users:
        try:
            user_roles = json.loads(user.roles)
        except json.JSONDecodeError:
            user_roles = []

        if selected_role is None or selected_role in user_roles:
            filtered_users.append(UserOut.from_orm(user))

    return filtered_users


