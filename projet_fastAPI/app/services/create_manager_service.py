# app/services/manager_service.py

from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.schemas.manager_add import ManagerCreate
from app.models.user import User
from app.security import hash_password
import json


def create_manager(manager: ManagerCreate, db: Session):
    existing_user = db.query(User).filter(User.email == manager.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Cet email est déjà utilisé.")

    new_user = User(
        firstname=manager.firstname,
        lastname=manager.lastname,
        email=manager.email,
        password=hash_password(manager.password),
        roles=json.dumps(["ROLE_ORGANIZATION"])  # JSON string
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

