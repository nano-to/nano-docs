- title: Nano.to RPC API Reference
- date: 2026-10-14
- updated: 2026-10-14
- description: Use the Nano.to JSON RPC API for Nano account reads, block processing, proof of work, payment Checkout, Faucet claims, and authenticated application infrastructure.
- tags: Guide, RPC, API
- author: @nano2bot
- previous: Get Started / get-started.html
- next: Rate Limits / rate-limits.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/nano-rpc.md
-----

Nano.to exposes a JSON RPC endpoint for Nano applications:

```text
https://rpc.nano.to
```

Send a `POST` request with an `action` and the action's parameters. The service proxies and augments Nano operations with account authentication, quotas, proof of work, Checkout, Faucet, and developer tooling.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/docs/rpc">Open the live API reference</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/login">Get a free API key</a>
</div>

## Basic request

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"version"}'
```

```json
{
  "rpc_version": "1",
  "nano_core_version": "..."
}
```

The exact response fields depend on the action and the upstream Nano node version.

## Authentication

Most read-only actions can be called without a key. Use an API key for account-scoped quotas, higher limits, authenticated PoW, Faucet claims, Checkout, Cloud Wallets, and paid features.

Preferred server-side authentication:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"action":"account_balance","account":"nano_1youraddress..."}'
```

The JSON body form is also supported for trusted backend calls:

```json
{
  "action": "account_balance",
  "account": "nano_1youraddress...",
  "key": "YOUR_API_KEY"
}
```

Never expose a private API key, seed, private key, or wallet password in browser code, logs, screenshots, or model prompts.

## Core Nano actions

| Action | Purpose |
| --- | --- |
| `version` | Read the service and Nano node version. |
| `block_count` | Read confirmed, cemented, unchecked, and total block counts. |
| `account_info` | Read an account frontier, representative, balance, and block count. |
| `account_balance` | Read confirmed and pending balances. |
| `account_history` | Read recent account activity. |
| `account_frontiers` | Read account frontier data where supported. |
| `block_info` | Read block details and confirmation state. |
| `blocks_info` | Read multiple blocks in one request. |
| `pending` | Read pending incoming blocks for an account. |
| `process` | Broadcast a signed Nano block. |
| `work_generate` | Generate proof of work for a hash or frontier. |
| `work_validate` | Validate work against a hash and difficulty. |

The live reference is authoritative for action names, parameters, and plan requirements.

## Read account state before writing

Nano state blocks must reference the account's current frontier and balance. Read account state immediately before preparing a block, then sign and process the block with your own wallet logic.

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"action":"account_info","account":"nano_1youraddress..."}'
```

Do not use a stale frontier after another process has sent or received from the same account. Serialize writes per account and handle a changed frontier by reading state again.

## Process a block

Sign the block locally, generate valid work for its exact root, and submit the signed block:

```json
{
  "action": "process",
  "json_block": "true",
  "subtype": "send",
  "block": {
    "type": "state",
    "account": "nano_1youraddress...",
    "previous": "FRONTIER_HASH",
    "representative": "nano_1representative...",
    "balance": "999000000000000000000000000000",
    "link": "DESTINATION_OR_SOURCE_HASH",
    "work": "WORK_VALUE",
    "signature": "BLOCK_SIGNATURE"
  }
}
```

The block must be valid, signed, and consistent with the account frontier. Treat `process` as non-idempotent in your application: check resulting account or block state before retrying after a timeout.

## Proof of work

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"action":"work_generate","hash":"FRONTIER_HASH"}'
```

Validate returned work before publishing:

```json
{
  "action": "work_validate",
  "hash": "FRONTIER_HASH",
  "work": "WORK_VALUE"
}
```

Read [Proof of Work](pow.html) and [Rate Limits](rate-limits.html) for quotas, retry behavior, and GPU Work Servers.

## Product actions

### Checkout

Create hosted payment links with `action: "checkout"`. The response includes `browser`, `check`, receiving address, amount, and checkout ID. See [Checkout API](checkout.html) for templates, fiat pricing, metadata, webhook HMAC validation, confirmation, and replay idempotency.

### Faucet

Use `faucet_check` before `faucet_claim`. Claims require an authenticated API key and valid `nano_address`:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"action":"faucet_claim","nano_address":"nano_1youraddress..."}'
```

See [Nano Faucet](faucet.html) for eligibility and pending claim behavior.

### Cloud Wallets

Cloud Wallet requests use `action: "cloud_wallet"` with a `wallet_action` such as `create_wallet`, `list_wallets`, `send`, `receive`, or `update_metadata`. Access may be feature-gated. See [Cloud Wallets](cloud-wallet.html).

## Errors and limits

Read both the HTTP status and JSON body. A JSON `error` field is a failed request even if a legacy path returns HTTP 200.

- `400`: invalid action, parameters, address, block, or JSON.
- `401`: missing or invalid authentication.
- `403`: account, feature, funding, or permission restriction.
- `429`: burst, quota, plan, or abuse limit. Honor `Retry-After` or `retry_after`.
- `5xx`: service or upstream failure. Retry safe reads with bounded backoff.

Do not blindly retry payments, Faucet claims, block processing, or fulfillment. Read [Common RPC Errors](rpc-errors.html) and [Rate Limits](rate-limits.html).

## Related APIs

- [WebSocket confirmations](websocket.html)
- [@nano/wallet SDK](wallet.html)
- [x402 Nano payments](x402.html)
- [Nano Usernames](usernames.html)
- [Nano to Email](nano-email.html)
- [AI Agent Integration](ai-agent.html)
