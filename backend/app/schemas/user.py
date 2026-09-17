from datetime import datetime
from pydantic import BaseModel, ConfigDict, EmailStr

class UserRegister(BaseModel):
    model_config = ConfigDict(extra="forbid")

    first_name: str
    last_name: str
    email: EmailStr
    password: str 

class UserLogin(BaseModel):
    model_config = ConfigDict(extra="forbid")

    email: EmailStr
    password: str

class UserRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    first_name: str
    last_name: str 
    email: str 
    created_at: datetime

class Token(BaseModel):
    access_token: str 
    token_type: str = "bearer"