from fastapi import APIRouter, Depends, HTTPException, status
from openai import APITimeoutError, OpenAIError, RateLimitError

from features.api.v1.dependencies import get_triage_service
from features.schemas.ticket import TriageRequest
from features.schemas.triage import TriageResult
from features.services.triage_service import TriageService

router = APIRouter()


@router.post("/triage-ticket-case", response_model=TriageResult)
async def triage_ticket(
    ticket: TriageRequest,
    service: TriageService = Depends(get_triage_service),
) -> TriageResult:
    try:
        return await service.triage(ticket)
    except APITimeoutError as exc:
        raise HTTPException(
            status_code=status.HTTP_504_GATEWAY_TIMEOUT,
            detail="AI provider timed out",
        ) from exc
    except RateLimitError as exc:
        quota_exhausted = (
            exc.code in {"credit_balance_exhausted", "insufficient_quota"}
            or exc.type == "insufficient_quota"
        )
        detail = (
            "OpenAI API credits are exhausted. Check billing for the configured API key."
            if quota_exhausted
            else "OpenAI rate limit reached. Please retry later."
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=detail,
        ) from exc
    except (OpenAIError, ValueError) as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="AI provider request failed",
        ) from exc
