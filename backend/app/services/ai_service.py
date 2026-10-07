import base64
import anthropic
from app.schemas.recipe_import import ExtractedRecipe

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

def chat_with_ai_chef(messages: list[dict]):
    response = client.messages.create(
        model="claude-opus-5",
        max_tokens=4096,
        system=AI_CHEF_PROMPT,
        messages=messages,
    )
    reply_text = next(block.text for block in response.content if block.type == "text")
    return reply_text