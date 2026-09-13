from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import engine
from app.db.base import Base
from app.models import recipe 
from app.api.recipes import router as recipes_router


app = FastAPI(title="yeschef")
app.include_router(recipes_router)

@app.on_event("startup")
def on_startup():
    Base.metadata.create_all(bind=engine)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}