# HarborPOS Cloud / Multi-device Setup

HarborPOS v4 uses a central API and PostgreSQL when `DATABASE_URL` is configured. Without a database URL, the server still uses a persistent server-side JSON store so multiple devices hitting the same server share the same demo state.

## Production setup

1. Create a managed PostgreSQL database.
2. Set `DATABASE_URL`, `PGSSLMODE=require`, and a strong `SESSION_SECRET`.
3. Run `npm install`.
4. Run `npm run db:init` once to create the schema and seed the first HarborPOS business, branch, access levels and demo users.
5. Start with `npm start` or deploy the server to a Node-compatible host.
6. Point every phone, laptop and computer at the same HarborPOS URL.

## What synchronizes

The app authenticates users through `/api/auth/login`, loads the central business state through `/api/cloud/state`, and automatically saves changes to the same central state. Branch selection remains part of the application state, so sales, stock, replenishment, hotel operations and reports stay associated with the active branch.

## Offline behavior

The browser keeps a local cache. If the server is temporarily unavailable, the UI can continue using the cached state. Changes are queued and sent when connectivity returns after the next successful authenticated save. For high-volume production installations, replace whole-state synchronization with transaction-level synchronization and conflict resolution.

## Important security note

Production passwords are stored as server-side scrypt hashes in PostgreSQL. Do not put `DATABASE_URL`, `SESSION_SECRET`, SMS Enabler tokens, or payment credentials in browser code.
