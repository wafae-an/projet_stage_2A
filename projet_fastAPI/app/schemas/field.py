
from pydantic import BaseModel

class FieldOut(BaseModel):
    id: int
    caption: str

    class Config:
        from_attributes = True
