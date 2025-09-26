from pydantic import BaseModel, EmailStr
from typing import Literal

class ManagerCreate(BaseModel):
    firstname: str
    lastname: str
    email: EmailStr
    phone:str
    password: str
  
