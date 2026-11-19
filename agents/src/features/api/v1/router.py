from fastapi import APIRouter

from features.api.v1.endpoints import health, triage

api_router = APIRouter()
api_router.include_router(health.router, tags=["health"])
api_router.include_router(triage.router, tags=["TriageAgent"])
