# HarborPOS Staff Login

## Login methods
Staff can sign in using either:
- Email + Password
- Card No + PIN

## Adding staff
In **Staff & Access → Add staff**:
- Name is required.
- Enter an email, a card number, or both.
- Set a password and/or a 4–8 digit PIN.
- Assign an access level and at least one branch.

Credentials are hashed and stored server-side in PostgreSQL when cloud mode is active.

## Existing database migration
The HarborPOS server automatically adds these columns to the existing `users` table at startup when PostgreSQL is connected:
- `card_no`
- `pin_hash`

It also permits email/password to be optional so card-only staff accounts can be created.

## Important
Do not store real staff passwords or PINs in frontend code, GitHub, or screenshots. Keep `DATABASE_URL` and `SESSION_SECRET` in server environment variables.
