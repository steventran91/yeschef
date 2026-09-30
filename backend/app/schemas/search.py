from pydantic import BaseModel 
from app.schemas.recipe import RecipeRead

class IngredientMatchRequest(BaseModel):
    ingredients: list[str]

class IngredientMatchResult(BaseModel):
    recipe: RecipeRead
    match_count: int 
    total_count: int 
    match_percentage: float 
    missing_ingredients: list[str]