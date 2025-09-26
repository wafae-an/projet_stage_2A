from sqlalchemy import Column, Integer, String, Text, DateTime, Boolean, ForeignKey
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Program(Base):
    __tablename__ = "program"

    id = Column(Integer, primary_key=True, autoincrement=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=False)

    name = Column(String(255))
    description = Column(Text)
    timezone = Column(String(255))
    start = Column(DateTime)
    end = Column(DateTime)
    address = Column(String(255))
    city = Column(String(255))
    country = Column(String(255))
    industries = Column(Text)
    logo = Column(String(255))
    cover = Column(String(255))
    facebook = Column(String(255))
    twitter = Column(String(255))
    instagram = Column(String(255))
    website = Column(String(255))
    status = Column(Boolean)  # TINYINT(1) souvent utilisé pour booléens
    scoring_system_id = Column(Integer, ForeignKey("scoring_system.id"), nullable=True)
