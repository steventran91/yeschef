from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.cooking_session import CookingSession

def get_cooking_session(db: Session, user_id: int) -> CookingSession | None:
    query = select(CookingSession).where(CookingSession.user_id == user_id)
    session = db.execute(query).scalar_one_or_none()
    return session 

def start_cooking_session(db: Session, user_id: int, recipe_id: int) -> CookingSession:
    # check session already exists for user, reuse logic #1
    # if it does, update its recipe_id to the new one and reset both checked-ids arrays back to empty 
    # if it doesn't exist yet, create a new row with empty checked arrays. commit either way and return the session

def update_checked_items(db: Session, user_id: int, checked_ingredients_ids: list[int], checked_instructions_ids: list[int]) -> CookingSession:
    # find the user's existing session, 
    # overwrite both arrays with whatever was passed in, commit, return it

def end_cooking_sesison(db: Session, user_id: int) -> None:
    # find the users session and delete it entirely