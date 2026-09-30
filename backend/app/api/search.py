from fastapi import APIRouter, Depends 
from sqlalchemy.orm import Session 
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User 
from app.schemas.search import IngredientMatchRequest, IngredientMatchResult
from app.services.search_service import match_recipes_by_ingredients

router = APIRouter(prefix="/recipes", tags=["search"])

@router.post("/match-by-ingredients", response_model=list[IngredientMatchResult])
def match_by_ingredients(data: IngredientMatchRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return match_recipes_by_ingredients(db, current_user.id, data.ingredients)