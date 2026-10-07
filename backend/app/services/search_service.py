from sqlalchemy.orm import Session 
from app.schemas.recipe import RecipeRead 
from app.schemas.search import IngredientMatchResult
from app.models.recipe import Recipe
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

        match_ingredients = []
        missing_ingredients = []
        for ingredient in required_ingredients:
            ing = ingredient.name.strip().lower()
            if any(ing in have or have in ing for have in search_ingredients):
                match_ingredients.append(ingredient.name)
            else:
                missing_ingredients.append(ingredient.name)

        match_count = len(match_ingredients)
        if match_count == 0:
            continue 

        results.append(
            IngredientMatchResult(
                recipe=RecipeRead.model_validate(recipe),
                match_count=match_count,
                total_count=total_count,
                match_percentage=match_count / total_count * 100,
                missing_ingredients=missing_ingredients,
            )
        )

    return sorted(results, key=lambda x:x.match_percentage, reverse=True)

def search_recipes_by_keyword(db: Session, user_id: int, keyword: str) -> list[Recipe]:
    filtered_recipes = []
    recipes = list_recipes(db, user_id, include_archived=False)

    for recipe in recipes:
        cuisines = [c.lower() for c in recipe.cuisine]
        if keyword.lower() in recipe.title.lower() or any(keyword.lower() in c for c in cuisines):
            filtered_recipes.append(recipe)

    return filtered_recipes

def ex




