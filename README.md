# Get IT Done

Task & Reminder app (Next.js + Prisma + BullMQ).

## Quick Start (dev)
1. Copy `.env.example` to `.env` and fill.
2. `pnpm i`
3. `docker compose -f infra/docker-compose.yml up -d db redis`
4. `pnpm db:generate && pnpm db:migrate && pnpm db:seed`
5. In another shell: `pnpm --filter @getitdone/web dev`
6. In another shell: `pnpm --filter @getitdone/worker dev`

## Scripts
- `pnpm db:migrate` – apply migrations
- `pnpm db:seed` – seed demo data
- `pnpm test` – unit tests (Vitest)
- `pnpm e2e` – Playwright e2e

## Architecture
- Next.js app for UI + API routes
- Prisma/Postgres for data
- BullMQ + Redis workers for reminder delivery
- node-cron scans for due occurrences every minute
- flowchart LR
  subgraph Web[Next.js App]
    API[/API Routes/]
    UI[Tasks/Settings]
  end
  subgraph Worker[BullMQ Workers]
    CRON[cron scanner]
    MAIL[mail worker]
    SMS[sms worker]
  end
  DB[(PostgreSQL)]
  Q[(Redis)]

  UI --> API
  API <--> DB
  CRON --> DB
  CRON --> Q
  MAIL --> Q
  SMS --> Q
  MAIL --> DB
  SMS --> DB

## Notes
- All times stored in UTC; user timezone used for quiet hours
- Email via Resend with SendGrid fallback; SMS via Twilio with Vonage fallback
- Add provider webhooks to `/api/webhooks/{provider}` and wire STOP/UNSUB logic
