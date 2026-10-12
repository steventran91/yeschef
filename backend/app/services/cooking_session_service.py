from sqlalchemy import select
from sqlalchemy.orm import Session
from app.models.cooking_session import CookingSession

def get_cooking_session(db: Session, user_id: int) -> CookingSession | None:
    query = select(CookingSession).where(CookingSession.user_id == user_id)
    session = db.execute(query).scalar_one_or_none()
    return session 

def start_cooking_session(db: Session, user_id: int, recipe_id: int) -> CookingSession:
    session = get_cooking_session(db, user_id)
    if session:
        session.recipe_id = recipe_id
        session.checked_ingredients_ids = []
        session.checked_instructions_ids = []
    else:
        session = CookingSession(
            user_id=user_id,
            recipe_id=recipe_id,
            checked_ingredients_ids=[],
            checked_instructions_ids=[],
        )
        db.add(session)
    db.commit()
    db.refresh(session) 
    return session 


def update_checked_items(db: Session, user_id: int, checked_ingredients_ids: list[int], checked_instructions_ids: list[int]) -> CookingSession | None:
    session = get_cooking_session(db, user_id)
    if session is None:
        return None 
    
    session.checked_instructions_ids = checked_instructions_ids
    session.checked_ingredients_ids = checked_ingredients_ids
    db.commit()
    db.refresh(session)
    return session

def end_cooking_session(db: Session, user_id: int) -> None:
    session = get_cooking_session(db, user_id)
    if session:
        db.delete(session)
        db.commit()
    else:
        return None 