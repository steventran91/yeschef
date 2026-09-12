from datetime import datetime
from pydantic import BaseModel, ConfigDict

class RecipeIngredientCreate(BaseModel):
    name: str
    original_text: str 
    quantity: float | None = None 
    unit: str | None = None 
    preparation: str | None = None 
    section: str | None = None 
    is_optoinal: bool = False 

class RecipeIngredientRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int 
    name: str 
    original_text: str
    quantity: float | None 
    unit: str | None 
    preparation: str | None 
    section: str | None 
    is_optional: bool
    position: int 

class RecipeInstructionCreate(BaseModel):
    text: str 

class RecipeInstructionRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int 
    step_number: int 
    text: str 

class RecipeCreate(BaseModel):
    title: str 
    description: str | None = None 
    servings: int | None = None 
    prep_time_minutes: int | None = None 
    cook_time_minutes: int | None = None 
    cuisine: list[str] = []
    tags: list[str] = []
    notes: list[str] = []
    source_type: str = "manual"
    source_url: str | None = None 
    ingredients: list[RecipeIngredientCreate] = []
    insructions: list[RecipeInstructionCreate] = []

class RecipeUpdate(BaseModel):
    title: str | None = None 
    description: str | None = None 
    servings: int | None = None 
    prep_time_minutes: int | None = None 
    cook_time_minutes: int | None = None 
    cuisine: list[str] | None = None 
    tags: list[str] | None = None 
    notes: list[str] | None = None 
    source_type: str | None = None 
    source_url: str | None = None 
    ingredients: list[RecipeIngredientCreate] | None = None 
    instructions: list[RecipeInstructionCreate] | None = None 

class RecipeRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int 
    title: str
    description: str | None 
    servings: int | None 
    prep_time_minutes: int | None 
    cook_time_minutes: int | None 
    cuisine: list[str]
    tags: list[str]
    notes: list[str]
    source_type: str 
    source_url: str | None 
    is_archived: bool 
    created_at: datetime 
    updated_at: datetime
    ingredients: list[RecipeIngredientRead]
    instructions: list[RecipeInstructionRead]