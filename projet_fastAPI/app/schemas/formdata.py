# schemas/field_data.py
from pydantic import BaseModel
from typing import List

class FormDataRequest(BaseModel):
    form_id: int
    field_ids: List[int]
    candidature_type: str
    form_type: str
