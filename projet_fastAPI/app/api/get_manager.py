from fastapi import APIRouter, Depends,HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from database import get_db
from app.models.user import User
from app.schemas.manager_read import ManagerRead
from app.security import get_current_user


router = APIRouter()

@router.get("/managers", response_model=list[ManagerRead],summary="Lister les gestionnaires",
    description=(
        "Retourne la liste des **gestionnaires** (utilisateurs ayant le rôle `ROLE_ORGANIZATION`).\n\n"
        "⚠️ Accès réservé aux utilisateurs avec le rôle **ROLE_ADMIN**."
    ),
    response_description="Tableau d'objets `ManagerRead`")
def get_managers(db: Session = Depends(get_db),current_user: dict = Depends(get_current_user)):

    if "ROLE_ADMIN" not in current_user["roles"]:
        raise HTTPException(status_code=403, detail="Accès refusé : rôle non autorisé")
    
    users = db.query(User).filter(func.json_contains(User.roles, '"ROLE_ORGANIZATION"')).all()
    return [
        ManagerRead(
            id=user.id,
            firstname=user.firstname,
            lastname=user.lastname,
            email=user.email,
            phone=user.phone,
            roles=user.roles_list,  
            
        )
        for user in users
    ]
