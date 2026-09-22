import anthropic
from fastapi import APIRouter, Depends, File, HTTPException, UploadFile

from app.api.deps import get_current_user
from app.models.user import User 
from app.schemas.recipe_import import ExtractedRecipe
from app.services import ai_service

router = APIRouter(prefix="/ai", tags=["ai"])

ALLOWED_CONTENT_TYPES ={"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 # 10MB
MAX_IMAGES = 5

@router.post("/extract-recipe-image", response_model=ExtractedRecipe)
async def extract_recipe_image(files: list[UploadFile] = File(...), current_user: User = Depends(get_current_user)):
    if not files:
        raise HTTPException(status_code=400, detail="At least one image is required.")
    if len(files) > MAX_IMAGES:
        raise HTTPException(status_code=400, detail=f"Too many images. Max is {MAX_IMAGES}.")

    images = []
    for file in files:
        if file.content_type not in ALLOWED_CONTENT_TYPES:
            raise HTTPException(status_code=400, detail=f"Unsupported file type for {file.filename}. Use JPEG, PNG, or WebP.")
        image_bytes = await file.read()
        if len(image_bytes) > MAX_FILE_SIZE_BYTES:
            raise HTTPException(status_code=400, detail=f"{file.filename} is too large. Max size is 10MB.")
        images.append((image_bytes, file.content_type))

    try:
        return ai_service.extract_recipe_from_images(images)
    except anthropic.APIConnectionError as e:
        print(e)
        raise HTTPException(status_code=502, detail="Could not reach the AI service. Please try again.")
    except anthropic.RateLimitError as e:
        print(e)
        raise HTTPException(status_code=429, detail="AI service rate limit reached. Please try again shortly.")
    except anthropic.APIStatusError as e:
        print(e)
        raise HTTPException(status_code=502, detail="AI extraction failed. Please try again or enter the recipe manually.")
    