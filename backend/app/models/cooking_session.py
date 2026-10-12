from datetime import datetime, timezone
from sqlalchemy import ARRAY, DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.db.base import Base
from app.models.user import User 

class CookingSession(Base):
    __tablename__ = "cooking_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), unique=True, nullable=False)
    recipe_id: Mapped[int] = mapped_column(Integer, ForeignKey("recipes.id"), nullable=False)
    checked_ingredients_ids: Mapped[list[int]] = mapped_column(ARRAY(Integer), default=list)
    checked_instructions_ids: Mapped[list[int]] = mapped_column(ARRAY(Integer), default=list)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), onupdate=lambda: datetime.now(timezone.utc), default=lambda: datetime.now(timezone.utc))
