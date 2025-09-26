from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class ApplicationStats(BaseModel):
    total: int
    submitted: int
    not_submitted: int
    with_documents: int

    class Config:
        from_attributes = True
