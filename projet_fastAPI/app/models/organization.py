# app/models/organization.py

from sqlalchemy import Column, Integer, String, DateTime, Text
from database import Base  # ✅ Utilise le même Base que toutes les autres classes
from datetime import datetime

class Organization(Base):
    __tablename__ = "organization"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    address = Column(String(255), nullable=True)
    city = Column(String(255), nullable=True)
    country = Column(String(255), nullable=True)
    email = Column(String(255), nullable=True)
    facebook = Column(String(255), nullable=True)
    linkedin = Column(String(255), nullable=True)
    twitter = Column(String(255), nullable=True)
    instagram = Column(String(255), nullable=True)
    logo = Column(String(255), nullable=True)
    cover = Column(String(255), nullable=True)
    presentation = Column(Text, nullable=True)
    website = Column(String(255), nullable=True)
    short_description = Column(String(180), nullable=True)
    created = Column(DateTime, default=datetime.utcnow)
    type = Column(String(100), nullable=True)
