from fastapi import APIRouter

from app.schemas.preview import PreviewRequest, PreviewResponse
from app.services.preview import create_preview

router = APIRouter(prefix="/api")


@router.post("/preview", response_model=PreviewResponse)
def preview(request: PreviewRequest) -> PreviewResponse:
    return create_preview(request)
