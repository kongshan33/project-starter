import json
from pathlib import Path

import pytest
from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_contract_fixture() -> None:
    fixture = json.loads(
        (Path(__file__).parents[3] / "packages/types/fixtures/preview.json").read_text()
    )
    response = client.post("/api/preview", json=fixture["input"])
    assert response.status_code == 200
    assert response.json() == fixture["output"]


@pytest.mark.parametrize("title", ["", "   ", "x" * 121, 42, None])
def test_rejects_invalid_titles(title: object) -> None:
    assert client.post("/api/preview", json={"title": title}).status_code == 422


def test_unicode_and_extra_fields() -> None:
    result = client.post("/api/preview", json={"title": "  你好 🌱  "}).json()
    assert result == {"title": "你好 🌱", "word_count": 2, "character_count": 4}
    assert client.post("/api/preview", json={"title": "Hello", "owner_id": "x"}).status_code == 422


def test_health() -> None:
    assert client.get("/health").json() == {"status": "ok"}
