# HarborPOS Render authentication setup

1. Build Command: `npm install`
2. Start Command: `npm start`
3. Environment variables:
   - `NODE_ENV=production`
   - `DATABASE_URL=<your PostgreSQL connection string>`
   - `PGSSLMODE=require`
   - `SESSION_SECRET=<long random secret>`
   - `SMS_ENABLER_TOKEN=<optional>`
4. Do not set a fixed `PORT`; Render supplies `PORT`.
5. Deploy and test `GET /api/health`. It should return `ok:true` and `databaseConfigured:true`.
6. The login page calls `/api/auth/login` on the same Render origin.
