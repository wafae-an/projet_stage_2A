from app.security import create_access_token
from sqlalchemy.orm import Session
from app.models.user import User
from database import SessionLocal

db: Session = SessionLocal()

# Récupération de l'utilisateur cible
user = db.query(User).filter(User.email == "wafaeananouch761@gmail.com").first()

# Génération du token avec le bon rôle
token = create_access_token(user.email, ["ROLE_ADMIN"])

# Mise à jour du champ token dans la base
user.token = token
db.commit()

print("TOKEN AJOUTÉ :", token)
