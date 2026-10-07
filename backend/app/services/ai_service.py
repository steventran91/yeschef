import json
import base64
import anthropic
from app.schemas.recipe_import import ExtractedRecipe
from sqlalchemy.orm import Session
from app.services.search_service import match_recipes_by_ingredients, search_recipes_by_keyword


client = anthropic.Anthropic()

EXTRACTION_PROMPT = (
    "Extract the recipe shown in this image into structured data. "
    "For each ingredient, preserve the exact original wording in 'original_text' "
    "even after also breaking it into name/quantity/unit/preparation. "
    "Never invent or make up information that isn't shown in the image. If something is "
    "unclear, ambiguous, or missing, note it in the 'warnings' instead of guessing. "
    "These images may together represent a single recipe (e.g. ingredients in one screenshot, " 
    "instructions in another) — combine information across all of them into one recipe rather than treating them separately. "
    "If the instructions are organized into labeled sections (e.g. 'Prep', 'Make the sauce'), "
    "capture each instruction's section name in its 'section' field — leave it blank if there are no such groupings."
)

AI_CHEF_PROMPT = (
    "You are a AI sous chef, knowledgeable about cooking, baking, coffee, desserts, and cocktails. "
    "You give clear, practical advice, and suggestions on cooking, baking, coffee, desserts, and cocktails. "
    "You are also very creative, you can create new recipes as well. "
)

SEARCH_RECIPES_BY_INGREDIENTS_TOOL = {
    "name": "search_recipes_by_ingredients_tool",
    "description": "Search the user's saved recipes by which ingredients they have on hand.",
    "input_schema": {
        "type": "object",
        "properties": {"ingredients": {"type": "array", "items": {"type": "string"}, "description": "..."}},
        "required": ["ingredients"],
    }

}

SEARCH_RECIPES_BY_KEYWORD = {
    "name": "search_recipes_by_keyword",
    "description": "Search user's saved recipes by keyword. Example, user inputs Vietnamese, search for Vietnamese in the title or cuisine.",
    "input_schema": {
        "type": "object",
        "properties": {"keyword": {"type": "string", "description": "..."}},
        "required": ["keyword"],
    }
}

def extract_recipe_from_images(images: list[tuple[bytes, str]]) -> ExtractedRecipe:
    content = []

    for image_bytes, media_type in images:
        image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")
        content.append({
            "type": "image",
            "source": {"type": "base64", "media_type": media_type, "data": image_b64},
        })
    content.append({"type": "text", "text": EXTRACTION_PROMPT})

    response = client.messages.parse(
        model="claude-opus-5",
        max_tokens=4096,
        messages=[{"role": "user", "content": content}],
        output_format=ExtractedRecipe,
    )

    return response.parsed_output

def chat_with_ai_chef(messages: list[dict], db: Session, user_id: int):
    response = client.messages.create(
        model="claude-opus-5",
        max_tokens=4096,
        system=AI_CHEF_PROMPT,
        tools = [SEARCH_RECIPES_BY_INGREDIENTS_TOOL, SEARCH_RECIPES_BY_KEYWORD],
        messages=messages,
    )
    if response.stop_reason != "tool_use":
        reply_text = next(block.text for block in response.content if block.type == "text")
        return reply_text
    else:
        for block in response.content:
            if block.type == "tool_use":
                tool_result = execute_tool(block.name, block.input, db, user_id)
                messages.append({
                    "role": "assistant", "content": response.content
                })
                messages.append({
                    "role": "user", "content": [{"type": "tool_result", "tool_use_id": block.id, "content": tool_result}]
                })

    final_response = client.messages.create(
        model="claude-opus-5",
        max_tokens=4096,
        system=AI_CHEF_PROMPT,
        tools=[SEARCH_RECIPES_BY_INGREDIENTS_TOOL, SEARCH_RECIPES_BY_KEYWORD],
        messages=messages,
    )
    return next(block.text for block in final_response.content if block.type == "text")

def execute_tool(tool_name: str, tool_input: dict, db: Session, user_id: int) -> str:
    recipes = []
    if tool_name == SEARCH_RECIPES_BY_INGREDIENTS_TOOL["name"]:
        results = match_recipes_by_ingredients(db, user_id, tool_input["ingredients"])
        for res in results:
            recipes.append({"id": res.recipe.id, "title": res.recipe.title, "cuisine": res.recipe.cuisine})
    elif tool_name ==  SEARCH_RECIPES_BY_KEYWORD["name"]:
        results = search_recipes_by_keyword(db, user_id, tool_input["keyword"])
        for res in results:
            recipes.append({"id": res.id, "title": res.title, "cuisine": res.cuisine})
    else:
        return None

    return json.dumps(recipes)

   
    
