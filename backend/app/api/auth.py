from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.api.deps import get_current_user
from app.services.auth_service import hash_password, verify_password, create_access_token
from app.models.user import User 
from app.schemas.user import UserRegister, UserLogin, UserRead, Token

router = APIRouter()

@router.post("/auth/register", response_model=Token, status_code=status.HTTP_201_CREATED)
def register(user_in: UserRegister, db: Session = Depends(get_db)):
    user = User(
        first_name=user_in.first_name,
        last_name=user_in.last_name,
        email=user_in.email,
        password_hash=hash_password(user_in.password),
    )
    db.add(user)
    try:
        db.commit()
    except IntegrityError:
        db.rollback()
        raise HTTPException(status_code=400, detail="Email already exist.")
    db.refresh(user)
    token = create_access_token(user.id)
    return Token(access_token=token, token_type="bearer")

@router.post("/auth/login", response_model=Token)
def login(login_request: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == login_request.email).first()
    if not user or not verify_password(login_request.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Email or Password is incorrect", headers={"WWW-Authenticate": "Bearer"})

    token = create_access_token(user.id)
    return Token(access_token=token, token_type="bearer")

@router.get("/auth/me", response_model=UserRead)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user