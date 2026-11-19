from typing import Literal, Self

from pydantic import BaseModel, Field, model_validator

Urgency = Literal["critical", "high", "medium", "low"]
Sentiment = Literal["Negative", "Concerned", "Normal", "Positive"]
Decision = Literal["auto_respond", "route_specialist", "escalate", "request_info"]
IssueType = Literal[
    "billing", "outage", "bug", "feature_request", "how_to", "account", "other"
]


class TriageAnalysis(BaseModel):
    priority_level: Urgency
    product: str
    issue_types: list[IssueType]
    case_sensitive: Sentiment
    decision: Decision
    route_to: str | None = Field(
        description="Required team name for escalate or route_specialist. "
        "Use Incident Response for outages, Billing for payments, "
        "Product Support for product defects, or General Support for other issues. "
        "Must be null for auto_respond or request_info."
    )
    rationale: str
    suggested_reply: str
    uncertainty: str
    knowledge_refs: list[str]


    @model_validator(mode="after")
    def validate_routing(self) -> Self:
        if self.decision in {"escalate", "route_specialist"}:
            if self.route_to is None or not self.route_to.strip():
                raise ValueError("A team is required for escalation or specialist routing")
            self.route_to = self.route_to.strip()
        elif self.route_to is not None:
            raise ValueError("Auto-response and information requests must have no route")
        return self


class MessageTime(BaseModel):
    message_index: int
    updatedAt: str
    relative_time: str


class TriageResult(TriageAnalysis):
    analyzed_at: str
    message_times: list[MessageTime]
