from fastapi import FastAPI
from sqlalchemy import text
from app.db.session import engine
from app.api.recipes import router as recipes_router
from app.api.auth import router as auth_router
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="yeschef")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(recipes_router)
app.include_router(auth_router)

@app.get("/health")
def health():
    return {"status": "ok"}

@app.get("/health/db")
def health_db():
    with engine.connect() as conn:
        conn.execute(text("SELECT 1"))
    return {"status": "ok"}