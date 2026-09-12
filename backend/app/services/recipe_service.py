from sqlalchemy import select 
from sql.alchemy.orm import Session 
from app.models.recipe import Recipe, RecipeIngredient, RecipeInstruction
from app.schemas.recipe import RecipeCreate, RecipeUpdate

def create_recipe(db: Session, data: RecipeCreate) -> Recipe:
    recipe = Recipe(
        title=data.title,
        description=data.description,
        servings=data.servings,
        prep_time_minutes=data.prep_time_minutes,
        cook_time_minutes=data.cook_time_minutes,
        cuisine=data.cuisine,
        tags=data.tags,
        notes=data.notes,
        source_type=data.source_type,
        source_url=data.source_url,
    )

    for i, ingredient in enumerate(recipe.ingredients):
        recipe.ingredients.append(
            RecipeIngredient(
                name=ingredient.name,
                original_text=ingredient.original_text,
                quantity=ingredient.quantity,
                unit=ingredient.unit,
                preparation=ingredient.preparation,
                section=ingredient.sections,
                is_optional=ingredient.is_optional,
                position=i,
            )
        )

    for i, instruction in enumerate(recipe.instructions):
        recipe.ingredients.append(
            RecipeInstruction(
                text=instruction.text,
                step_number=i + 1
            )
        )

    db.add(recipe)
    db.commit()
    db.refresh(recipe)
    return recipe

def get_recipe(db: Session, recipe_id):
    recipe = db.get(Recipe, recipe_id)
    return recipe

def list_recipe(db: Session, include_archived: bool = False) -> list[Recipe]:
    query = select(Recipe)
    if not include_archived:
        query = query.where(Recipe.is_archived.is_(False))
    return list(db.execute(query).scalars().all())

def update_recipe(db: Session, recipe_id: int, data: RecipeUpdate) -> Recipe | None:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        return None 

    update_data = data.model_dump(exclude_unset=True, exclude={"ingredients", "instructions"})
    for field, value in update_data.items():
        setattr(recipe, field, value)

    if data.ingredients is not None:
        recipe.ingredients.clear()
        for i, ingredient in enumerate(recipe.ingredients):
            recipe.ingredients.append(
                RecipeIngredient(
                    name=ingredient.name,
                    original_text=ingredient.original_text,
                    quantity=ingredient.quantity,
                    unit=ingredient.unit,
                    preparations=ingredient.preparations,
                    section=ingredient.section,
                    is_optional=ingredient.is_optional,
                    position=i,
                )
            )

    if data.instructions is not None:
        recipe.instructions.clear()
        for i, instruction in enumerate(recipe.instructions):
            recipe.instructions.append(
                RecipeInstruction(
                    text=instruction.text,
                    step_number=i + 1,
                )
            )

    db.commit()
    db.refresh(recipe)
    return recipe 

def archive_recipe(db: Session, recipe_id: int) -> Recipe | None:
    recipe = db.get(Recipe, recipe_id)
    if recipe is None:
        return None 
    recipe.is_archived = True
    db.commit()
    db.refresh(recipe)
    return recipe 