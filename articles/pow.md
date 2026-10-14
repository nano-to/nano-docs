- title: Nano Proof of Work API
- date: 2026-10-14
- updated: 2026-10-14
- description: Generate Nano proof of work through Nano.to. Learn API authentication, free and paid usage, work validation, rate limits, and how to run your own GPU work server.
- tags: Guide, PoW, RPC
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: Work Servers / sell-pow.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/pow.md
-----

Nano uses lightweight proof of work as an anti-spam mechanism. You do not mine Nano with PoW; you generate a work value for a block before publishing it. Nano.to provides an API for applications that need reliable work generation without operating their own GPU infrastructure.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/login">Get a free RPC key</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/docs/work-servers">Run a Work Server</a>
</div>

## Generate work

Send `work_generate` to `https://rpc.nano.to` with the block frontier or hash that needs work. Use a bearer header for backend applications:

```bash
curl -X POST https://rpc.nano.to/ \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "action": "work_generate",
    "hash": "FRONTIER_HASH"
  }'
```

The response includes a work value and difficulty information. Attach the returned work to the block you are preparing, then validate and process the block through your normal signing and broadcast flow.

## Validate work

Use `work_validate` to check a work value before publishing a block or accepting work from an external worker:

```bash
curl -X POST https://rpc.nano.to/ \
  -H 'Content-Type: application/json' \
  -d '{
    "action": "work_validate",
    "hash": "FRONTIER_HASH",
    "work": "WORK_VALUE"
  }'
```

For a paid work server integration, validate samples against a trusted Nano node as well as checking the API response. A successful HTTP response is not proof that a returned work value is valid for your exact frontier and difficulty.

## Usage and authentication

- Public unauthenticated PoW is protected by strict anti-abuse limits.
- Authenticated accounts receive the free PoW allowance shown by the current account quota and product configuration.
- The current free fallback is 100 PoW requests per day for eligible users.
- Active paid plans have plan-specific PoW allowances and burst limits.
- Prepaid credits can continue eligible usage after free or finite-plan allowances are exhausted, subject to account and abuse controls.
- A `429` response can mean burst shaping, a free allowance, a plan cap, or abuse protection. Read `retry_after` and the response message before retrying.

Limits can change. Check [account quota](https://rpc.nano.to/api/account/quota), the dashboard, or the [current RPC docs](https://rpc.nano.to/docs/rpc) before designing capacity around a fixed number.

## Work-generation reliability

Use bounded retries with backoff and keep the original frontier attached to each request. If work is invalid:

1. Validate the exact `hash`, `work`, and `difficulty` together.
2. Record which work server returned the value.
3. Retry against the service after a short backoff.
4. Do not publish a block until work validates.

For high-volume applications, combine the API with your own fallback work server or [Nano.to Work Servers](sell-pow.html).

## Run your own Work Server

Nano.to can route work requests to approved GPU-backed servers. The current installer and access flow are documented in [Work Servers](sell-pow.html). It uses a `WORK_API_KEY`, a public work endpoint, health checks, and a Nano payout address.

## Related documentation

- [RPC API authentication](nano-rpc.html)
- [Common RPC errors](rpc-errors.html)
- [Work Servers](sell-pow.html)
- [Wallet SDK](wallet.html)
