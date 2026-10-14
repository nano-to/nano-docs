- title: Common Nano.to RPC Errors and Retry Rules
- date: 2026-10-14
- updated: 2026-10-14
- description: Diagnose common Nano.to RPC errors, invalid requests, authentication failures, rate limits, stale frontiers, invalid work, and upstream node problems.
- tags: Guide, RPC, Troubleshooting
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: Rate Limits / rate-limits.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/rpc-errors.md
-----

Nano.to returns structured JSON errors from the RPC, product, and account layers. Always inspect the HTTP status and response body, and log the request ID if one is returned. Do not log API keys, seeds, private keys, or wallet passwords.

## Error handling baseline

```js
const response = await fetch('https://rpc.nano.to', options)
const body = await response.json()

if (!response.ok || body.error) {
  if (response.status === 429) {
    // Honor Retry-After or body.retry_after.
  }
  throw new Error(body.message || body.error || 'Nano.to request failed')
}
```

### `400` invalid request

Check the action name, required fields, JSON syntax, Nano address, amount format, and block structure. Fix the request rather than retrying the same payload.

### `401` invalid authentication

The API key is missing, malformed, revoked, or not authorized for the route. Send `Authorization: Bearer YOUR_API_KEY` from a trusted backend and rotate exposed keys.

### `403` access or funding restriction

The account may be suspended, the feature may be disabled or invite-only, an agent key may still be `funding_only`, or a plan/credit requirement may not be met. Read the response's `funding_action`, `upgrade`, or access message.

### `429` rate or quota limit

The request hit a burst, free allowance, plan cap, or abuse-protection limit. Honor `Retry-After` or `retry_after`, reduce concurrency, and read [Rate Limits](rate-limits.html). A burst rejection does not consume a credit.

### `5xx` service or upstream failure

Retry safe reads with bounded exponential backoff. For block processing, Faucet claims, Checkout creation, and payment fulfillment, check state before retrying so a timeout does not create a duplicate operation.

## Nano state errors

### Gap source

The referenced source block is unavailable on the node or the `link` field does not identify the expected source. Re-read account and pending state, then prepare the receive block again.

### Gap previous / stale frontier

The `previous` block is not the account's current frontier. Another process may have sent or received first. Serialize account writes, call `account_info`, rebuild the state block, sign it again, and regenerate work.

### Account not found

An account may not have an opened ledger entry yet, may have only pending funds, or the address may be wrong. Check the address, `account_info`, `account_balance`, `pending`, and block history before assuming funds are lost.

### Bad destination account / bad source

The Nano address is malformed, has the wrong prefix, or fails its checksum. Do not normalize user input by truncation; validate the complete address.

### Invalid amount number

Nano node amounts are integer raw units. One NANO is `10^30` raw. Convert decimal user input with a decimal or big-integer library and never use binary floating point for a balance or transfer amount.

### Error generating block

The account state, pending source, representative, amount, or concurrent operation may be invalid. Read current state, avoid two writes to the same account at once, and retry only after rebuilding the operation.

### Unreceivable

The source may already be received, may not exist, or may not be receivable by the current account state. Read pending blocks and account history before attempting another receive.

## Block and work errors

### Fork

Another block already uses the same previous frontier. A second writer or stale cache likely produced the block. Discard the stale block, read the current frontier, and create a new one.

### Invalid work

Validate work against the exact block root and difficulty. Record the server that returned it, regenerate after a short backoff, and do not broadcast until `work_validate` succeeds.

### Block already known / old block

The node already has the block. Query `block_info` or account history and treat the operation as completed if it matches your signed block.

## Product-specific checks

- **Checkout:** verify checkout ID, amount, destination, block hash, confirmation, and webhook event ID. A redirect is not payment proof.
- **Faucet:** call `faucet_check` before `faucet_claim`; do not submit duplicate claims while one is pending.
- **WebSocket:** reconnect and query state; a dropped socket does not mean a transaction failed.
- **Cloud Wallets:** check feature access, `WALLET-KEY` restrictions, and wallet action requirements.
- **AI agent keys:** a `funding_only` key must complete its bound `buy_rpc` payment before normal access is enabled.

## Get help

Include action, HTTP status, response message, timestamp, and request ID when contacting [support](https://rpc.nano.to/account/support). Redact API keys, seeds, private keys, wallet passwords, and payment signatures.
