from sqlalchemy import Column, Integer, String, Text, SmallInteger, Boolean, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Field(Base):
    __tablename__ = "field"

    id = Column(Integer, primary_key=True, index=True)
    form_id = Column(Integer, ForeignKey("form.id"), nullable=False)
    caption = Column(Text, nullable=True)
    type = Column(String(255), nullable=False)
    required = Column(Boolean, default=False)
    name = Column(String(255), nullable=True)
    subtype = Column(String(255), nullable=True)
    multiple = Column(Boolean, default=False)
    options = Column(Text, nullable=True)  # on peut utiliser JSON dans Postgres
    class_ = Column("class", String(50), nullable=True)
    maximum = Column(SmallInteger, nullable=True)
    minimum = Column(SmallInteger, nullable=True)
    maxlength = Column(SmallInteger, nullable=True)
    step = Column(SmallInteger, nullable=True)
    textrows = Column(SmallInteger, nullable=True)
    page = Column(String(10), nullable=True)

    # relation facultative
    form = relationship("Form", back_populates="fields")
