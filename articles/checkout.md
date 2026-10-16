- title: Nano Checkout API: Hosted Payment Links and Webhooks
- date: 2026-10-14
- updated: 2026-10-16
- description: Create hosted Nano payment pages with the Nano.to Checkout API. Learn authentication, fiat pricing, templates, metadata, redirects, webhook verification, and payment confirmation.
- tags: Guide, Checkout, Payments
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: WebSocket API / websocket.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/checkout.md
-----

Nano.to Checkout creates hosted payment pages for merchants and applications. Create a checkout with the [Checkout API](https://rpc.nano.to/docs/checkout), redirect the customer to the returned `browser` URL, and verify payment through the returned `check` URL or a signed webhook.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/checkout">Open Checkout</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/login">Get an API key</a>
</div>

## Quick start

Create a checkout from a trusted server or serverless function. Keep API keys and webhook secrets out of browser code.

```js
const response = await fetch('https://rpc.nano.to', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'checkout',
    address: 'nano_1yourmerchantaddress...',
    amount: '5.00',
    currency: 'USD',
    title: 'Coffee',
    webhook_url: 'https://example.com/nano/webhook',
    metadata: { order_id: 'order_123' }
  })
})

const checkout = await response.json()
console.log(checkout.browser)
```

A successful response includes the checkout ID, hosted payment page, verification URL, receiving address, and currency-specific pricing fields. Nano-denominated checkouts include `amount`; fiat-denominated checkouts include `fiat_amount` and convert to Nano dynamically when the payment page loads:

```json
{
  "id": "abc123",
  "browser": "https://rpc.nano.to/pay/abc123",
  "check": "https://rpc.nano.to/check/abc123",
  "address": "nano_1yourmerchantaddress...",
  "currency": "USD",
  "fiat_amount": "5.00",
  "note": "Fiat-priced checkout (USD). Nano equivalent is calculated at page load using live rates."
}
```

Share `browser` with the customer. Do not construct payment URLs by hand or trust a client-supplied amount after checkout creation.

## Authentication

Use `Authorization: Bearer YOUR_API_KEY` for server-side and Cloudflare Worker integrations. A JSON `key` is also supported for trusted server-side calls. Never expose either credential in public browser code.

For client-side checkout creation, use a configured public key or a saved checkout template. A public key is not a substitute for webhook verification or server-side order validation.

## Checkout fields

- `action`: required; set to `checkout`.
- `address`: required; the Nano account that receives payment. Nano usernames such as `@development` can be resolved by the service where supported.
- `amount`: optional fixed amount. Use a string to avoid floating-point rounding.
- `currency`: optional; `NANO` by default, or a supported fiat currency such as `USD` or `EUR`.
- `title`, `description`, `image`: payment-page presentation.
- `webhook_url`: optional URL for signed payment events.
- `webhook_secret`: secret used to validate webhook signatures; keep it server-side.
- `notify`: optional merchant email address for one confirmation receipt after payment is confirmed. Requires an RPC API key; public keys cannot use it.
- `success_url`, `cancel_url`: optional customer redirects.
- `metadata`: application data returned with payment events.
- `template`: optional existing checkout ID whose saved configuration can be reused.
- `mode`: optional checkout mode such as `unique_amount`, `unique_address`, or `generated_wallet` when enabled for the account.

See the [current Checkout API reference](https://rpc.nano.to/docs/checkout) for the exact fields and availability of each mode.

## Completion email notifications

Add `notify` when you want Nano.to to email your team after a checkout payment is confirmed:

```js
const response = await fetch('https://rpc.nano.to', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'checkout',
    address: 'nano_1yourmerchantaddress...',
    amount: '5.00',
    currency: 'USD',
    title: 'Coffee',
    notify: 'orders@example.com',
    metadata: { order_id: 'order_123' }
  })
})
```

The email is sent from `Nano.to <alerts@nano.to>` with subject `Payment received` or `Payment received: <title>`. It includes:

- The payer username when available, otherwise the sending address.
- The confirmed NANO amount and fiat value.
- A link to the payment block on Blocklattice.
- Checkout metadata and checkout ID.

Nano.to sends the notification once per checkout after confirmation. It is a merchant notification, not proof of payment for fulfillment. Keep verifying the checkout status or signed webhook in your backend, and do not use `notify` with a public key or expose an RPC API key in browser code.

## Checkout reports

Authenticated RPC-key clients can query only the checkouts created with that key. Use `checkout_report` for order history and revenue summaries:

```js
const response = await fetch('https://rpc.nano.to', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_API_KEY'
  },
  body: JSON.stringify({
    action: 'checkout_report',
    query: 'revenue last 3 months',
    metadata_filter: { order_type: 'subscription' },
    limit: 50
  })
})

const report = await response.json()
console.log(report.summary, report.revenue)
```

Supported filters include `status`, `from`, `to`, `metadata_filter`, `metadata_key`, and `metadata_value`. Natural-language periods include `last 30 days`, `last 3 months`, and `last 1 year`. The response includes matching checkouts, status counts, and revenue totals grouped by currency.

## Administrative Checkout API

Nano.to also provides an authenticated REST API for dashboard and operational checkout management. This is separate from the `checkout` and `checkout_report` RPC actions and is not intended to be a homepage RPC example.

The base path is `https://rpc.nano.to/api/admin/checkouts`.

Authenticate with a dashboard session JWT or an RPC API key:

```http
Authorization: Bearer YOUR_TOKEN_OR_API_KEY
```

Available endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| `GET` | `/api/admin/checkouts` | List checkouts; supports `limit`, `offset`, and `status`. |
| `POST` | `/api/admin/checkouts` | Create a checkout using the normal checkout fields. |
| `GET` | `/api/admin/checkouts/:id` | Read a checkout, payments, webhook events, and wallet status. |
| `PUT` | `/api/admin/checkouts/:id` | Update an owned checkout. |
| `DELETE` | `/api/admin/checkouts/:id` | Delete an owned checkout. |
| `GET` | `/api/admin/checkouts/stats` | Return checkout statistics for the authenticated account. |
| `GET` | `/api/admin/checkouts/overview` | Return the global overview; administrator access is required. |

Example:

```bash
curl -s https://rpc.nano.to/api/admin/checkouts \
  -H "Authorization: Bearer YOUR_API_KEY"
```

The `/api/admin` path does not grant administrator access. Ordinary authenticated callers remain scoped to their own checkout records; administrator accounts can list and report across accounts. The `POST` endpoint accepts the same checkout fields documented above, including `notify`, `metadata`, webhooks, redirects, checkout modes, and payment plans. Use `/api/checkouts` for equivalent user-scoped REST paths.

## Templates for browser integrations

A template lets you save sensitive configuration once and create transaction-specific checkouts without placing an address, webhook URL, or secret in browser code.

Typical flow:

1. Create a template from the dashboard or a trusted backend.
2. Reference its checkout ID as `template` from the client integration.
3. Override only safe per-order fields such as `amount`, `title`, `description`, and `metadata`.
4. Confirm that the template belongs to the same account before using it.

Templates are a convenience layer, not an authorization boundary. Your backend still owns order state and fulfillment.

## Payment confirmation

Use the returned `check` URL or a webhook to observe payment state. Fulfill an order only after matching the event to your own checkout ID and verifying the confirmed block details.

Do not fulfill based only on:

- A customer redirect to `success_url`.
- A client-side “paid” message.
- An unconfirmed block.
- A matching amount without the expected checkout or destination.

Nano confirmations are fast, but your integration should still handle pending, delayed, duplicate, and replayed events safely.

## Webhooks

For a webhook integration:

1. Generate a high-entropy webhook secret and store it in a server secret manager.
2. Create the checkout with `webhook_url` and the secret.
3. Read the complete raw request body before parsing JSON.
4. Validate the HMAC signature over the exact serialized body.
5. Verify event ID, checkout ID, amount, destination, metadata, block hash, and confirmation state.
6. Make fulfillment idempotent. The same event may be delivered again after a timeout.
7. Return a successful HTTP response only after recording the event safely.

The payment monitor retries failed deliveries. Store event IDs and return the same result for a replay instead of delivering the product twice.

For generated-wallet checkouts, the persisted receiving address must match both the top-level payment address and the nested payment address in the webhook payload.

## Common mistakes

- Putting an API key or webhook secret in frontend JavaScript.
- Treating a redirect as proof of payment.
- Comparing decimal amounts with binary floating point.
- Fulfilling before confirmation.
- Ignoring duplicate webhook deliveries.
- Paying a timed-out checkout again without checking its status.

## Continue building

- [RPC API reference](nano-rpc.html)
- [WebSocket confirmations](websocket.html)
- [@nano/wallet SDK](wallet.html)
- [NanoPay.js browser integration](nanopay.html)
- [Common RPC errors](rpc-errors.html)
