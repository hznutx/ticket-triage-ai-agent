from pydantic import BaseModel, ConfigDict, Field


class CustomerHistoryQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    customer_id: str | None = Field(min_length=1, max_length=100)


class CustomerHistory(BaseModel):
    plan: str
    tenure_months: int
    support_context: str


RECORDS = {
    "demo-billing": CustomerHistory(
        plan="Free", tenure_months=4, support_context="First support contact"
    ),
    "demo-outage": CustomerHistory(
        plan="Enterprise",
        tenure_months=8,
        support_context="Thailand, 45 seats, first critical issue",
    ),
    "demo-appearance": CustomerHistory(
        plan="Pro", tenure_months=5, support_context="Daily use, no prior tickets"
    ),
}


def lookup_customer_history(query: CustomerHistoryQuery) -> CustomerHistory | None:
    """Return a synthetic history record or None when the ID is missing or unknown."""
    return RECORDS.get(query.customer_id) if query.customer_id is not None else None
