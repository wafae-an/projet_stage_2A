from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Boolean, ForeignKey, UniqueConstraint
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Round(Base):
    __tablename__ = "round"

    id = Column(Integer, primary_key=True, autoincrement=True)
    program_id = Column(Integer, ForeignKey("program.id"), nullable=False)
    scoring_system_id = Column(Integer, ForeignKey("scoring_system.id"), nullable=True)
    name = Column(String(255), nullable=False)
    status = Column(SmallInteger, nullable=False)
    created = Column(DateTime, nullable=False)
    has_scoring_form = Column(Boolean, nullable=False)
    has_program_form = Column(Boolean, nullable=False)
    application_form_id = Column(Integer, ForeignKey("form.id"), unique=True, nullable=True)
    evaluation_form_id = Column(Integer, ForeignKey("form.id"), unique=True, nullable=True)
    step = Column(Integer, nullable=False)

    __table_args__ = (
        UniqueConstraint('application_form_id', name='UNIQ_C5EEEA34B4489E4E'),
        UniqueConstraint('evaluation_form_id', name='UNIQ_C5EEEA347CE583F7'),
    )
