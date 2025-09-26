from sqlalchemy import Column, Integer, String, SmallInteger, DateTime, Date, ForeignKey, Text

from database import Base  # ou declarative_base() selon ta structure

class Invitation(Base):
    __tablename__ = "invitation"

    id = Column(Integer, primary_key=True, autoincrement=True)
    
    user_id = Column(Integer, ForeignKey("user.id"), nullable=False)
    form_id = Column(Integer, ForeignKey("form.id"))
    round_id = Column(Integer, ForeignKey("round.id"))
    application_id = Column(Integer, ForeignKey("application.id"))
    
    hash = Column(String(255), nullable=True)
    type = Column(SmallInteger, nullable=True)
    email = Column(String(255), nullable=True)
    status = Column(SmallInteger, nullable=True)
    
    response_date = Column(DateTime, nullable=True)
    response = Column(Text, nullable=True)
    scoring_start = Column(Date, nullable=True)
    scoring_end = Column(Date, nullable=True)
    
    email_sent = Column(Integer, nullable=True)