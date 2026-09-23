import uuid
from pathlib import Path 

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads" / "recipes"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

def save_image(image_bytes: bytes, content_type: str) -> str:
    extension = {"image/jpeg": "jpg", "image/png": "png", "image/webp": "webp"}[content_type]
    filename = f"{uuid.uuid4()}.{extension}"

    file_path = UPLOAD_DIR / filename
    file_path.write_bytes(image_bytes)

    return f"/uploads/recipes/{filename}"

def delete_image(image_url: str) -> None:
    filename = image_url.rsplit("/", 1)[-1]
    file_path = UPLOAD_DIR / filename
    file_path.unlink(missing_ok=True) 