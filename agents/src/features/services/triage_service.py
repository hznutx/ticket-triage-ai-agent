import json
from datetime import datetime, timezone

from openai import AsyncOpenAI

from features.prompts.triage_system import TRIAGE_SYSTEM_PROMPT
from features.schemas.ticket import TriageRequest
from features.schemas.triage import TriageAnalysis, TriageResult
from features.services.message_times import message_times
from features.tools.customer_history import CustomerHistoryQuery, lookup_customer_history
from features.tools.knowledge_base import KnowledgeQuery, search_knowledge_base


class TriageService:
    def __init__(self, client: AsyncOpenAI, model: str) -> None:
        self._client = client
        self._model = model

    async def triage(self, ticket: TriageRequest) -> TriageResult:
        now = datetime.now(timezone.utc)
        times = message_times(ticket, now)
        rendered_ticket = ticket.model_dump(mode="json", exclude={"customer_info": {"id", "userName"}})
        for message, time in zip(rendered_ticket["messages"], times):
            message["relative_time"] = time.relative_time
        history = lookup_customer_history(CustomerHistoryQuery(customer_id=ticket.customer_info.id))
        articles = search_knowledge_base(
            KnowledgeQuery(terms=[message.user_detail for message in ticket.messages])
        )
        evidence = {
            "ticket": rendered_ticket,
            "analyzed_at": now.isoformat(),
            "customer_history": history.model_dump() if history else None,
            "knowledge_articles": [article.model_dump() for article in articles],
        }
        completion = await self._client.chat.completions.parse(
            model=self._model,
            messages=[
                {"role": "system", "content": TRIAGE_SYSTEM_PROMPT},
                {"role": "user", "content": json.dumps(evidence, ensure_ascii=False)},
            ],
            response_format=TriageAnalysis,
            store=False,
            max_completion_tokens=1200,
        )
        result = completion.choices[0].message.parsed if completion.choices else None
        if result is None:
            raise ValueError("Model returned no structured result")
        if set(result.knowledge_refs) - {article.id for article in articles}:
            raise ValueError("Model cited an article outside the retrieved evidence")
        if result.decision == "auto_respond" and (
            result.priority_level in {"critical", "high"} or not result.knowledge_refs
        ):
            raise ValueError("Auto-response requires documentation and medium or low priority_level")
        return TriageResult(**result.model_dump(), analyzed_at=now.isoformat(), message_times=times)
