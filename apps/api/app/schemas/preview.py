from typing import Annotated

from pydantic import BaseModel, ConfigDict, StringConstraints


class PreviewRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")
    title: Annotated[str, StringConstraints(strip_whitespace=True, min_length=1, max_length=120)]


class PreviewResponse(BaseModel):
    title: str
    word_count: int
    character_count: int
