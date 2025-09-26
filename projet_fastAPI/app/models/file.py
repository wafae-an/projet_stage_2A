from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from database import Base
from sqlalchemy.orm import relationship

class File(Base):
    __tablename__ = "file"

    id = Column(Integer, primary_key=True, index=True)
    field_id = Column(Integer, nullable=False)
    application_id = Column(Integer, ForeignKey("application.id"), nullable=False)
    name = Column(String(255), nullable=False)
    root = Column(String(255), nullable=False)
    created = Column(DateTime, nullable=False)
    data_id = Column(Integer, nullable=True)

    application = relationship("Application", back_populates="files")
