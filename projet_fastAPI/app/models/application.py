from sqlalchemy import Column, Integer, SmallInteger, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from database import Base  # ou declarative_base()

class Application(Base):
    __tablename__ = "application"

    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, nullable=True)
    program_id = Column(Integer, nullable=True)
    startup_id = Column(Integer, nullable=True)
    submitted_by_id = Column(Integer, nullable=False)
    form_id = Column(Integer, nullable=False)
    evaluation_id = Column(Integer, nullable=True)
    invitation_id = Column(Integer, unique=True, nullable=True)
    success_by_id = Column(Integer, nullable=True)
    submitted = Column(Boolean, nullable=False)
    created_on = Column(DateTime, nullable=False)
    submitted_on = Column(DateTime, nullable=True)
    type = Column(SmallInteger, nullable=False)
    success = Column(SmallInteger, nullable=True)
    success_on = Column(DateTime, nullable=True)
    user_task_id = Column(Integer, nullable=True)
    task_element_id = Column(Integer, nullable=True)
    passed = Column(Boolean, nullable=True)

    files = relationship("File", back_populates="application")
