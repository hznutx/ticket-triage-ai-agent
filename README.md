# Support Ticket Triage Agent

This application reads a customer support ticket and suggests how a support team should handle it. It uses OpenAI GPT to decide the priority_level, issue type, next action, and a suggested reply.

## What you need

Install these programs before starting:

- [Node.js](https://nodejs.org/) version 20 or newer
- [pnpm](https://pnpm.io/installation)
- [Python](https://www.python.org/downloads/) version 3.12
- [uv](https://docs.astral.sh/uv/getting-started/installation/)
- An [OpenAI API key](https://platform.openai.com/api-keys) with available API credits

## First-time setup

Open a terminal in this project folder and run:

```bash
pnpm install
uv sync --locked --project agents
```

Create a file named `.env` in the project root. Add your OpenAI API key:

```text
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your key. Keep this file private. Do not upload it to GitHub.

## Start the application

Run this command in the project root:

```bash
pnpm dev
```

Wait until both services start. Keep this terminal open while you use the application.

Open Swagger in your browser:

```text
http://localhost:3000/docs
```

## Try a ticket

1. In Swagger, open `POST /triage-ticket-case`.
2. Click **Try it out**.
3. Paste a ticket payload.
4. Click **Execute**.
5. Read the response below the request.

The `updatedAt` field must use an ISO 8601 timestamp with a time zone. For example:

```text
2026-11-19T10:00:00+07:00
```

You can copy sample payloads from the `examples` folder:

- `examples/billing.json`
- `examples/outage.json`
- `examples/appearance.json`

## Stop the application

Return to the terminal where `pnpm dev` is running and press `Ctrl + C`.

## Common problems

If Swagger does not open, confirm that `pnpm dev` is still running, then refresh `http://localhost:3000/docs`.

If you receive an error about OpenAI credits or quota, check the API key and billing details in your OpenAI Platform account. Restart `pnpm dev` after changing `.env`.
