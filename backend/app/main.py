from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import engine


app = FastAPI(title="yeschef")

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}