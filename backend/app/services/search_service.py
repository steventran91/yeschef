from sqlalchemy.orm import Session 
from app.schemas.recipe import RecipeRead 
from app.schemas.search import IngredientMatchResult
from app.services.recipe_service import list_recipes

def match_recipes_by_ingredients(db: Session, user_id: int, have_ingredients: list[str]) -> list[IngredientMatchResult]:
    search_ingredients = [ing.strip().lower() for ing in have_ingredients]
    users_recipes = list_recipes(db, user_id=user_id, include_archived=False)

    results = []

    for recipe in users_recipes:
        required_ingredients = []
        for ingredient in recipe.ingredients:
            if ingredient.is_optional == False:
                required_ingredients.append(ingredient)

        total_count = len(required_ingredients)
        if total_count == 0:
            continue

        matched_ingredients = []
        missing_ingredients = []
        for ingredient in required_ingredients:
            ing = ingredient.name.strip().lower()
            if any(ing in ingredient for ingredient in search_ingredients) == True:
                matched_ingredients.append(ing)
            else:
                missing_ingredients.append(ing)

        ing_total_count = len(matched_ingredients)
        if ing_total_count == 0:
            continue 




