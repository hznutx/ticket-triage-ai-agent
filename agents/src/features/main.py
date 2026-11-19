from fastapi import FastAPI

from features.api.v1.router import api_router

app = FastAPI(title="Ticket Triage AI Service", version="0.1.0")
app.include_router(api_router, prefix="/api/v1")
