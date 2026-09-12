# HarborPOS v4 — Cloud / Multi-device

HarborPOS now supports central authentication and central state synchronization.

## Demo mode
Run `npm start`. If `DATABASE_URL` is not configured, the server stores the shared state in `data/cloud-state.json`. Any phone, laptop, or computer connecting to the same deployed server will use that same server-side state.

Demo logins:
- Owner: `admin@harborpos.local` / `HarborPOS123!`
- Manager: `manager@harborpos.local` / `HarborPOS123!`
- Cashier: `cashier@harborpos.local` / `HarborPOS123!`

## Production mode
Configure PostgreSQL using `DATABASE_URL`, set `PGSSLMODE=require`, set a strong `SESSION_SECRET`, run `npm install`, then `npm run db:init` once. Deploy the Node server to a persistent Node host. All devices then connect to the same URL and same PostgreSQL-backed business state.

See `CLOUD_SETUP.md` for deployment details.
