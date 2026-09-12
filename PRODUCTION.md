# HarborPOS production notes — v2.1

## M-Pesa verification with SMS Enabler

SMS Enabler can forward incoming SMS to a web server by HTTP. HarborPOS exposes `POST /api/smsenabler/incoming`; deploy it behind HTTPS and configure SMS Enabler's SMS-to-Web action to call that endpoint. The server accepts JSON or form-encoded payloads and stores a normalized SMS record. It parses common M-Pesa/Safaricom confirmation formats and the app matches the payment amount within the configured tolerance and verification window.

Production security:
- Set `SMS_ENABLER_TOKEN` in the server environment and send it as `X-HarborPOS-Token`.
- Never put database, M-Pesa API, or webhook secrets in browser JavaScript.
- Use HTTPS for the webhook and enforce rate limits/replay protection in the production API.
- Prefer official M-Pesa/Daraja callbacks where available; SMS verification is a reconciliation mechanism, not a substitute for an authenticated payment API.

## New operational modules

Customers, suppliers, stock conversions, credit sales, credit repayments, room reservations, stays/check-in/check-out, payment ledger, receipt designer and audit logging are represented in `schema.sql` and the demo app.

## Staff level access

Levels 1–5 have feature sets. Each staff record has a `level`, and navigation/action guards hide or block features that the level cannot access. The level editor provides a feature-by-feature access matrix.

## Feature settings

The Settings area contains property/tax settings, M-Pesa/SMS Enabler settings, inventory settings, credit settings, receipt designer controls, and feature enable/disable controls. In a multi-tenant production version these should be stored in `feature_settings` and scoped to a business.

## Receipt/PDFs

Every major module has a downloadable PDF report, including customers and statements, suppliers, products/stock, stock conversions, credit customers, repayments, rooms, reservations, stays, payments, staff access, audit log and sales receipts.
