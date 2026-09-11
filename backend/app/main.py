from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import engine
from app.db.base import Base
from app.models import recipe 


app = FastAPI(title="yeschef")

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