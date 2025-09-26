from sqlalchemy import Column, Integer, ForeignKey
from database import Base  # ou ton Base déclaré via declarative_base()

class organization_user_table(Base):
    __tablename__ = "organization_user"

    organization_id = Column(Integer, ForeignKey("organization.id", ondelete="CASCADE"), primary_key=True)
    user_id = Column(Integer, ForeignKey("user.id", ondelete="CASCADE"), primary_key=True)
