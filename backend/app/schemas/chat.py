from pydantic import BaseModel
from app.schemas.recipe_import import ExtractedRecipe

class ChatMessage(BaseModel):
    role: str
    content: str 

class ChatRequest(BaseModel):
    messages: list[ChatMessage]

class RecipeCard(BaseModel):
    id: int
    title: str 

class ChatResponse(BaseModel):
    reply: str
    recipes: list[RecipeCard] | None 
    pending_recipe: ExtractedRecipe | None 