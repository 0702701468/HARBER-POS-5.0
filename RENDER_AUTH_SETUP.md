# HarborPOS Render Authentication Setup

## First-time owner setup

For initial account creation, temporarily add `SETUP_MODE=true` to the HarborPOS Render Web Service environment variables and redeploy. The login page will show **First-time owner setup**. Use it to create the real Owner account (name, email, password, optional card number and PIN).

After the owner account is created, set `SETUP_MODE=false` and redeploy. Do not leave setup mode enabled on a public production site.

The existing PostgreSQL database is reused; this process does not recreate or wipe the database.
