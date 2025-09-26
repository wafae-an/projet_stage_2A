from sqlalchemy.orm import Session
from app.models.user import User

def get_all_managers(db: Session):
    managers = (
        db.query(User)
        .filter(User.roles.like('%ROLE_ORGANIZATION%'))  # MATCH dans le texte JSON
        .all()
    )
    return [
        {
            "id": m.id,
            "firstname": m.firstname,
            "lastname": m.lastname,
            "email": m.email,
            "phone":m.phone
        }
        for m in managers
    ]
