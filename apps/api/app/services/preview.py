from app.schemas.preview import PreviewRequest, PreviewResponse


def create_preview(request: PreviewRequest) -> PreviewResponse:
    """Pure demonstration: no persistence, AI calls or user account needed."""
    return PreviewResponse(
        title=request.title,
        word_count=len(request.title.split()),
        character_count=len(request.title),
    )
