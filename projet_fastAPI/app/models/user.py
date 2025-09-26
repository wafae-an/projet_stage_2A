from sqlalchemy import Column, Integer, String, DateTime, Boolean, Text
from sqlalchemy.dialects.mysql import LONGTEXT
from sqlalchemy.ext.declarative import declarative_base
import json
from datetime import datetime
from database import Base

def default_roles():
    return json.dumps(["ROLE_ORGANIZATION"])

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True, autoincrement=True)
    firstname = Column(String(255), nullable=False)
    lastname = Column(String(255), nullable=False)
    job = Column(String(255), nullable=True)
    company = Column(String(255), nullable=True)
    phone = Column(String(255), nullable=True)
    photo = Column(String(255), nullable=True)
    cover = Column(String(255), nullable=True)
    created = Column(DateTime, nullable=False, default=datetime.utcnow)
    lastvisit = Column(DateTime, nullable=True)
    lastip = Column(String(255), nullable=True)
    email = Column(String(180), nullable=False, unique=True)
    roles = Column(LONGTEXT, nullable=False, default=default_roles)  # JSON stocké en texte
    password = Column(String(255), nullable=False)
    confirmed = Column(Boolean, nullable=False, default=False)
    confirmed_on = Column(DateTime, nullable=True)
    token = Column(String(255), nullable=True)
    organism = Column(String(255), nullable=True)
    is_jury = Column(Boolean, nullable=True)
    country = Column(String(50), nullable=True)


    @property
    def roles_list(self):
      try:
        return json.loads(self.roles) if self.roles else []
      except json.JSONDecodeError:
        return []

