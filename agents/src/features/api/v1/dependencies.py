from collections.abc import AsyncIterator

from fastapi import HTTPException, status
from openai import AsyncOpenAI

from features.core.config import get_settings
from features.services.triage_service import TriageService


async def get_triage_service() -> AsyncIterator[TriageService]:
    settings = get_settings()
    api_key = (settings.openai_api_key or "").strip()
    if not api_key:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Configure OPENAI_API_KEY in the server environment",
        )
    async with AsyncOpenAI(
        api_key=api_key,
        timeout=settings.openai_timeout_seconds,
        max_retries=0,
    ) as client:
        yield TriageService(client=client, model=settings.openai_model)
