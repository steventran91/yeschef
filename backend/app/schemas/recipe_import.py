from pydantic import BaseModel

class ExtractedIngredient(BaseModel):
    name: str 
    original_text: str
    quantity: float | None = None 
    unit: str | None = None 
    preparation: str | None = None 
    section: str | None = None 
    is_optional: bool = False 

class ExtractedInstruction(BaseModel):
    text: str 
    section: str | None = None 

class ExtractedRecipe(BaseModel):
    title: str 
    description: str | None = None 
    servings: int | None = None 
    prep_time_minutes: int | None = None 
    cook_time_minutes: int | None = None 
    cuisine: list[str] = []
    tags: list[str] = []
    notes: list[str] = []
    ingredients: list[ExtractedIngredient] = []
    instructions: list[ExtractedInstruction] = []
    warnings: list[str] = []
    