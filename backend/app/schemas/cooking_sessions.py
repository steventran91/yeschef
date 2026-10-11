from pydantic import BaseModel, ConfigDict
from datetime import datetime

class CookingSession(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    recipe_id: int
    checked_ingredients_ids: list[int]
    checked_instructions_ids: list[int] 
    updated_at: datetime