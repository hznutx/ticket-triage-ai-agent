# Support Ticket Triage AI Agent

This project is a Support Ticket Triage AI Agent that receives customer support tickets and uses GPT to analyze them and recommend the next action. The system consists of two separate services.

- NestJS is located at the project root. It provides the main API and Swagger documentation.
- FastAPI is located in `agents/`. It acts as the AI service, calls OpenAI, and manages the agent logic.

Clients call the following endpoint:

```text
POST /triage-ticket-case
```

NestJS forwards the request to the FastAPI endpoint:

```text
POST /api/v1/triage-ticket-case
```

The FastAPI service processes each ticket in the following order:

1. It validates the request payload with Pydantic.
2. It converts each `updatedAt` value from ISO 8601 into a relative time expression, such as `2 วันที่แล้ว` or `2 days ago`, based on `customer_info.region`.
3. It runs two mock tools:
   - `customer_history.py` retrieves customer information using `customer_info.id`.
   - `knowledge_base.py` retrieves mock knowledge articles for topics such as billing, outages, and dark mode.
4. It sends the ticket, customer history, knowledge articles, and system prompt to GPT.
5. It receives structured output and validates that the routing decision and knowledge references follow the defined rules.
6. It returns the result to NestJS and Swagger.

The current request payload accepts customer information as an object:

```json
{
  "customer_info": {
    "id": "demo-outage",
    "planType": "Enterprise",
    "userName": "Operations Test",
    "region": "Thailand",
    "seats": 45,
    "tenureMonths": 8,
    "notes": "First critical issue"
  },
  "messages": [
    {
      "updatedAt": "2026-11-19T10:00:00+07:00",
      "user_detail": "ระบบเข้าไม่ได้ครับ ขึ้น error 500"
    }
  ]
}
```

The response includes the priority_level level as `critical`, `high`, `medium`, or `low`, as well as the product, issue types, and customer sentiment in `case_sensitive` using `Negative`, `Concerned`, `Normal`, or `Positive`. It also includes the recommended decision, which can be `auto_respond`, `route_specialist`, `escalate`, or `request_info`, together with `route_to`, `rationale`, `suggested_reply`, `uncertainty`, `knowledge_refs`, `analyzed_at`, and `message_times`.

The OpenAI API key is loaded only from the root `.env` file through `OPENAI_API_KEY`.

## Trade-offs to Evaluate

1.The current design uses a separate NestJS API and FastAPI AI service. For a small demo, a single service would be simpler to operate. The two-service design is easier to extend when the AI workflow becomes more complex.

2.The knowledge base is a small keyword-based mock implementation. It is easy to inspect, deterministic, and appropriate for the assignment, but it may miss relevant articles when customers use different wording or languages. A semantic search system would improve retrieval quality, while adding document ingestion, embedding costs, and evaluation work.

3.This produces a clear response contract, but output quality still depends on the prompt and model. Deterministic rules could improve consistency for known cases, though too many rules would make the triage logic harder to maintain and less adaptable to new issue types.
