from fastapi import FastAPI

from app.routers.preview import router

app = FastAPI(title="Starter API", version="0.1.0")
app.include_router(router)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok"}
