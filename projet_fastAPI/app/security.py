from datetime import datetime, timedelta
from typing import Union
from jose import jwt, JWTError
from passlib.context import CryptContext
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

# === Configuration ===
SECRET_KEY = "votre_clé_très_secrète"
ALGORITHM = "HS256"

# === Password hashing ===
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# === JWT Token generation ===
def create_access_token(user_email: str, roles: list[str], expires_delta: Union[timedelta, None] = None) -> str:
    expire = datetime.utcnow() + (expires_delta or timedelta(days= 60))
    to_encode = {
        "sub": user_email,
        "roles": roles,  # pluriel et liste
        "exp": expire
    }
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


# === JWT Token decoding ===
def decode_access_token(token: str) -> dict:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        raise ValueError("Token invalide ou expiré")

# === Récupérer l'utilisateur courant ===
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")  # ou autre URL

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    try:
        print(f"Token reçu dans get_current_user : {token}")
        payload = decode_access_token(token)  # retourne un dict avec "sub" et "roles"
        user_email: str = payload.get("sub")
        roles: list = payload.get("roles")

        if user_email is None or roles is None:
            raise HTTPException(status_code=401, detail="Token invalide")

        return {"email": user_email, "roles": roles}

    except ValueError:
        raise HTTPException(status_code=401, detail="Token invalide ou expiré")



def get_current_user_email(user: dict = Depends(get_current_user)) -> str:
    return user["email"]