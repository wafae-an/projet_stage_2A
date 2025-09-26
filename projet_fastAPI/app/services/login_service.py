from sqlalchemy.orm import Session
from app.models.user import User
from app.security import verify_password
from fastapi import HTTPException
from app.send_email import send_otp_email  #  à créer
import json
from random import randint
from app.redis_client import r  #  ou stock temporaire
from datetime import timedelta

def authenticate_user(email: str, password: str, db: Session):
    user = db.query(User).filter(User.email == email).first()

    if not user or not verify_password(password, user.password):
        raise HTTPException(status_code=401, detail="Email ou mot de passe incorrect")

    # Générer un code OTP à 6 chiffres
    code = str(randint(100000, 999999))

    # Envoyer le code par email
    send_otp_email(user.email, code)

    # Stocker le code temporairement (par exemple dans Redis pour 5 minutes)
    r.setex(f"otp:{email}", timedelta(minutes=5), code)

    return {
        "message": "Un code de vérification a été envoyé à votre adresse e-mail.",
        "email": user.email
    }
