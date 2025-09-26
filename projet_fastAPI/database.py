import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
from urllib.parse import quote_plus
from sqlalchemy.orm import Session
from fastapi import Depends

load_dotenv()

DB_USER = os.getenv("DB_USER")
DB_PASSWORD = quote_plus(os.getenv("DB_PASSWORD"))  # Encode les caractères spéciaux
DB_HOST = os.getenv("DB_HOST")
DB_PORT = os.getenv("DB_PORT")
DB_NAME = os.getenv("DB_NAME")



DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"



# 🔧 Création de l'engine SQLAlchemy
engine = create_engine(DATABASE_URL)

# 🔄 Session locale
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)

# 📦 Base pour les modèles
Base = declarative_base()



def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()
