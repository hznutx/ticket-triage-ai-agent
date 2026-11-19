from pydantic import BaseModel, ConfigDict, Field


class KnowledgeQuery(BaseModel):
    model_config = ConfigDict(extra="forbid")

    terms: list[str] = Field(min_length=1)


class Article(BaseModel):
    id: str
    title: str
    guidance: str


ARTICLES = (
    (
        ("charge", "payment", "billing", "refund", "ชำระเงิน", "ตัดเงิน"),
        Article(
            id="KB-101",
            title="Failed upgrade and duplicate charges",
            guidance="Route multiple reported charges with missing Pro access to Billing "
            "for reconciliation. A bank entry may be pending. Ask the customer to avoid "
            "repeating the payment while Billing investigates. Do not promise reversal.",
        ),
    ),
    (
        ("error 500", "outage", "status.company.com", "http 500", "เข้าไม่ได้"),
        Article(
            id="KB-201",
            title="Multi-user access failure",
            guidance="Escalate repeated HTTP 500 across users or devices to Incident Response. "
            "Include the observed region, time window and scope. A green public status page "
            "does not rule out local impact. Verify scope before declaring a regional outage.",
        ),
    ),
    (
        ("system default", "dark mode", "appearance", "light theme", "โหมดมืด"),
        Article(
            id="KB-301",
            title="Appearance settings and System Default",
            guidance="System Default follows the OS setting in supported clients. Ask for "
            "app and macOS versions if it remains light after a full relaunch. Route "
            "persistent mismatches to Product Support. The mock product has no in-app "
            "theme schedule. Treat a custom switch time as a feature request.",
        ),
    ),
)


def search_knowledge_base(query: KnowledgeQuery) -> list[Article]:
    """Return relevant mock articles ranked by distinct keyword matches."""
    terms = [term.casefold() for term in query.terms]
    ranked = [
        (sum(any(keyword in term for term in terms) for keyword in keywords), article)
        for keywords, article in ARTICLES
    ]
    ranked.sort(key=lambda match: match[0], reverse=True)
    return [article for score, article in ranked if score > 0]
