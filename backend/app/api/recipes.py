from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session 
from app.models.user import User
from app.db.session import get_db
from app.api.deps import get_current_user
from app.schemas.recipe import RecipeCreate, RecipeRead, RecipeUpdate
from app.services import recipe_service

router = APIRouter(tags=["recipes"])

@router.post("/recipes", response_model=RecipeRead, status_code=201)
def create_recipe(data: RecipeCreate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return recipe_service.create_recipe(db, data, current_user.id)

@router.get("/recipes", response_model=list[RecipeRead])
def get_list_recipes(include_archived: bool = False, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return recipe_service.list_recipes(db, current_user.id, include_archived=include_archived)

@router.get("/recipes/{recipe_id}", response_model=RecipeRead)
def get_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipe = recipe_service.get_recipe(db, recipe_id, current_user.id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return recipe

@router.patch("/recipes/{recipe_id}", response_model=RecipeRead)
def update_recipe(recipe_id: int, data: RecipeUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipe = recipe_service.update_recipe(db, recipe_id, current_user.id, data)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return recipe

@router.delete("/recipes/{recipe_id}", response_model=RecipeRead)
def archive_recipe(recipe_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    recipe = recipe_service.archive_recipe(db, recipe_id, current_user.id)
    if recipe is None:
        raise HTTPException(status_code=404, detail="Recipe not found.")
    return recipe 
