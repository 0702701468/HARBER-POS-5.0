# SMS Enabler → HarborPOS M-Pesa verification

SMS Enabler supports forwarding received SMS to a web server using HTTP. HarborPOS provides:

`POST /api/smsenabler/incoming`

## Local test

Start HarborPOS:

```bash
node server.js
```

Test an incoming payment SMS:

```bash
curl -X POST http://localhost:8787/api/mpesa/test \
  -H "Content-Type: application/json" \
  -d '{"sender":"MPESA","message":"Confirmed. KES 1,972.00 received from Jane Wanjiku. M-PESA reference QP123456."}'
```

Then:

```bash
curl http://localhost:8787/api/mpesa/messages
```

## Production configuration

1. Deploy the HarborPOS server behind HTTPS.
2. Set `SMS_ENABLER_TOKEN` in the server environment.
3. Configure SMS Enabler's SMS-to-Web action to POST to:
   `https://YOUR-DOMAIN/api/smsenabler/incoming`
4. Send the webhook token in the `X-HarborPOS-Token` header.
5. In HarborPOS Settings → M-Pesa + SMS Enabler, configure the verification window, amount tolerance and sender name.
6. On hotel checkout or POS M-Pesa payment, leave the payment pending until HarborPOS finds a matching SMS.

The webhook accepts JSON and form-encoded payloads and recognizes common fields such as `message`/`text`, `sender`/`from`, and timestamps.
