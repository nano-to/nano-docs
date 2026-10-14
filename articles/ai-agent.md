- title: Nano AI Agent Integration Guide
- date: 2026-10-14
- updated: 2026-10-14
- description: Build safer AI wallet and commerce agents with Nano.to RPC. Covers dedicated agent keys, funding-only access, quota checks, payment verification, and signing boundaries.
- tags: Guide, AI, RPC
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: Checkout API / checkout.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/ai-agent.md
-----

Nano.to can provide the RPC, proof of work, checkout, quota, and confirmation infrastructure around an AI-assisted wallet or commerce workflow. Your application must keep control of identity, policy, wallet signing, order state, and fulfillment.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/docs/ai-agent">Read the live AI agent docs</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/login">Create an API key</a>
</div>

## Keep the trust boundary in your application

The model may propose an operation. Your application should validate and execute it:

- Validate destination addresses and amounts.
- Apply user, merchant, and risk policies.
- Keep API keys, wallet secrets, and payment evidence outside prompts and model output.
- Sign Nano blocks outside the model.
- Verify confirmation before claiming that funds moved.
- Make payment and fulfillment operations idempotent.

An API key authorizes API access. It is not a wallet seed or signing key.

## Dedicated agent keys

Issue a dedicated key with `POST /api/agent-keys`, providing `owner_email` and optionally `agent_id` or `name`:

```http
POST https://rpc.nano.to/api/agent-keys
Content-Type: application/json

{
  "owner_email": "owner@example.com",
  "agent_id": "commerce-agent",
  "name": "Checkout Agent"
}
```

The returned `AGENT-KEY-...` begins in `funding_only` mode. Before its first verified payment, it can create its own `buy_rpc` checkout and use limited bootstrap work requests. Normal RPC, quota, Cloud Wallet, hosted checkout, subscriptions, and ordinary PoW remain blocked until payment is verified. Activation is permanent after verified funding.

Store the returned key immediately in a server-side secret store. Key issuance is rate-limited by source IP.

## Fund the key safely

Use the bearer key to create the bound `buy_rpc` checkout. The key identifies the account; do not redirect ownership with an email field.

1. Create the checkout with `buy_rpc`.
2. Save the checkout ID and selected plan.
3. Pay the returned receiving address and exact amount.
4. Wait for a confirmed payment or webhook.
5. Verify checkout ID, plan, amount, destination, block hash, and confirmed send state before treating the key as funded.

Never post a fabricated purchase webhook or pay a second time just because a request timed out. Keep the checkout and block hash so the state can be checked again.

## Check quota before expensive work

Call `GET /api/account/quota` before a large batch or PoW workload. A quota response is observed state, not a reservation. A `429` can represent burst shaping, quota exhaustion, a plan cap, or abuse protection. Honor `Retry-After` or `retry_after` and use bounded backoff.

```js
async function nanoRpc(action, params = {}) {
  const response = await fetch('https://rpc.nano.to', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.NANO_RPC_KEY}`
    },
    body: JSON.stringify({ action, ...params })
  })

  const body = await response.json()
  if (!response.ok || body.error) {
    throw new Error(body.message || 'Nano.to request failed')
  }
  return body
}

const account = await nanoRpc('account_info', { account: wallet })
const balance = await nanoRpc('account_balance', { account: wallet })
```

## Payment and confirmation rules

For agent-created merchant checkouts, verify the checkout ID, metadata, amount, destination, event ID, block hash, and confirmation state. Webhook delivery is retryable and replayable; record event IDs before fulfillment. On reconnect, query state because WebSocket events can be missed.

## x402 pay-per-request

Some deployments may expose x402 for configured actions. Request without a payment signature first; if the response is `402`, use the current `PAYMENT-REQUIRED` requirements to create a Nano exact payment and retry with `PAYMENT-SIGNATURE`. x402 currently settles before the downstream action runs and does not bind the payment to the complete RPC body, so use it only for small, reconciled, configured actions. See the dedicated [x402 Nano guide](x402.html) for the complete flow.

x402 pays for one request. It does not add prepaid credits, activate a funding-only agent key, or replace the bound `buy_rpc` flow. Never hardcode the amount or destination from an old response.

## Related documentation

- [RPC API](nano-rpc.html)
- [Checkout API](checkout.html)
- [Proof of Work](pow.html)
- [WebSocket confirmations](websocket.html)
- [Live AI agent documentation](https://rpc.nano.to/docs/ai-agent)
