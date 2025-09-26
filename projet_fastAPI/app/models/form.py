from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base  # ou ton Base déclaré via declarative_base()

class Form(Base):
    __tablename__ = "form"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(Integer)  # 2 = formulaire de recrutement
    status = Column(Integer, nullable=False)  # 0 = non soumis, 1 = soumis
    program_id = Column(Integer, ForeignKey("program.id"), nullable=True)
    organization_id = Column(Integer, ForeignKey("organization.id"), nullable=True)