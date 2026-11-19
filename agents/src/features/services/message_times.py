from datetime import datetime

from features.schemas.ticket import TriageRequest
from features.schemas.triage import MessageTime

THAI_REGIONS = {"th", "tha", "thailand", "ประเทศไทย", "ไทย", "th-th"}


def relative_time(timestamp: datetime, now: datetime, region: str | None) -> str:
    thai = (region or "").strip().casefold() in THAI_REGIONS
    seconds = int((now - timestamp).total_seconds())
    if abs(seconds) < 60:
        return "เมื่อสักครู่" if thai else "just now"
    for size, english, local in [(86400, "day", "วัน"), (3600, "hour", "ชั่วโมง"), (60, "minute", "นาที")]:
        if abs(seconds) >= size:
            count = abs(seconds) // size
            if thai:
                return f"{count} {local}ที่แล้ว" if seconds > 0 else f"อีก {count} {local}"
            unit = english if count == 1 else english + "s"
            return f"{count} {unit} ago" if seconds > 0 else f"in {count} {unit}"
    raise ValueError("Unsupported time interval")


def message_times(ticket: TriageRequest, now: datetime) -> list[MessageTime]:
    return [
        MessageTime(
            message_index=index,
            updatedAt=message.updatedAt.isoformat(),
            relative_time=relative_time(message.updatedAt, now, ticket.customer_info.region),
        )
        for index, message in enumerate(ticket.messages, start=1)
    ]
