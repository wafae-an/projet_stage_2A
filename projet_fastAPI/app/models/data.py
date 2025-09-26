from sqlalchemy import Column, Integer, ForeignKey, Text, DateTime
from sqlalchemy.orm import relationship
from database import Base  # ajuste si le chemin vers Base est différent

class Data(Base):
    __tablename__ = "data"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, ForeignKey("field.id"), nullable=False)
    program_id = Column(Integer, ForeignKey("program.id"), nullable=True)
    created_by_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    form_id = Column(Integer, ForeignKey("form.id"), nullable=False)
    application_id = Column(Integer, ForeignKey("application.id"), nullable=False)
    value = Column(Text, nullable=False)
    created = Column(DateTime, nullable=False)

    # Relations (optionnelles)
    field = relationship("Field", backref="data_entries")
    program = relationship("Program", backref="data_entries")
    user = relationship("User", foreign_keys=[created_by_id])
    form = relationship("Form", backref="data_entries")
    application = relationship("Application", backref="data_entries")
