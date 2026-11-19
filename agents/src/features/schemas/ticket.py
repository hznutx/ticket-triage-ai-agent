from typing import Literal

from pydantic import AwareDatetime, BaseModel, ConfigDict, Field, field_validator


class CustomerInfo(BaseModel):
    model_config = ConfigDict(extra="forbid")

    id: str | None = Field(default=None, min_length=1, max_length=100)
    planType: Literal["Free", "Pro", "Enterprise"]
    userName: str | None = Field(default=None, min_length=1, max_length=100)
    region: str | None = Field(default=None, min_length=1, max_length=100)
    seats: int | None = Field(default=None, ge=1)
    tenureMonths: int | None = Field(default=None, ge=0)
    notes: str | None = Field(default=None, max_length=2000)


class TicketMessage(BaseModel):
    updatedAt: AwareDatetime

    @field_validator("updatedAt", mode="before")
    @classmethod
    def require_iso_string(cls, value: object) -> object:
        if not isinstance(value, str) or "T" not in value:
            raise ValueError("updatedAt must be an ISO 8601 string with a timezone")
        return value
    user_detail: str = Field(min_length=1)


class TriageRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    customer_info: CustomerInfo
    messages: list[TicketMessage] = Field(min_length=1)
