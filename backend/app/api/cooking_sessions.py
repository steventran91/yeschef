from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.db.session import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.cooking_sessions import CookingSession, StartCookingSessionRequest, UpdateCheckedItemsRequest
from app.services.cooking_session_service import get_cooking_session, start_cooking_session, update_checked_items, end_cooking_session

router = APIRouter(prefix="/cooking-sessions", tags=["cooking-sessions"])

@router.get("", response_model=CookingSession | None)
def get_cook_mode_session(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return get_cooking_session(db, current_user.id)

@router.post("", response_model=CookingSession)
def create_cook_mode_session(data: StartCookingSessionRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return start_cooking_session(db, current_user.id, data.recipe_id)
    

@router.patch("", response_model=CookingSession | None)
def update_items_cook_mode_session(data: UpdateCheckedItemsRequest, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    updated_items = update_checked_items(db, current_user.id, data.checked_ingredients_ids, data.checked_instructions_ids)
    if updated_items is None:
        raise HTTPException(status_code=404, detail="Cooking session not found.")

    return updated_items

@router.delete("")
def end_cook_mode_session(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return end_cooking_session(db, current_user.id)