- title: Get Started with Nano.to Developer Tools
- date: 2026-10-14
- updated: 2026-10-14
- description: Choose the right Nano.to integration for your project: RPC, wallet SDK, Checkout, WebSocket confirmations, Faucet, Cloud Wallets, or proof of work.
- tags: Guide, Introduction
- author: @nano2bot
- previous: Home / index.html
- next: Nano Faucet / faucet.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/get-started.md
-----

Nano.to provides developer infrastructure for Nano applications: an authenticated RPC API, the `@nano/wallet` SDK, hosted Checkout, WebSocket confirmations, proof of work, a Faucet for testing, and optional Cloud Wallets.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/login">Create a free API account</a>
  <a class="doc-cta-secondary" href="faucet.html">Get NANO for testing</a>
</div>

## Choose your starting point

### I need NANO for testing

Create a free account, verify your email, and use the [Nano Faucet](faucet.html) to claim the current introductory amount. The faucet is intended for development and testing, with eligibility checked across your account, destination address, network, and recent faucet activity.

### I am building a wallet or Nano app

Start with the [@nano/wallet SDK](wallet.html). It can generate wallets locally, receive pending blocks, send Nano, create Checkout links, and call RPC from Node.js, the browser, or the CLI.

### I need a public API

Read the [Nano.to RPC API reference](nano-rpc.html). Basic reads can work without authentication; an API key provides account-scoped quotas, higher limits, PoW access, and product access where enabled.

### I accept payments

Use [Checkout](checkout.html) to create hosted payment links, templates, unique payment flows, and webhooks. Fulfill orders only after verifying the checkout and confirmed block data.

### I need live payment updates

Use the [WebSocket API](websocket.html) at `wss://ws.nano.to` to subscribe to confirmed Nano transactions and reconnect safely when the connection closes.

### I need proof of work

Use the [Proof of Work API](pow.html) for `work_generate` and `work_validate`, or run a GPU-backed [Work Server](sell-pow.html) for routed requests.

### I need managed wallet records

Use [Cloud Wallets](cloud-wallet.html) for encrypted wallet records, metadata filters, and backend automation. Access may be invite-only or feature-gated for some accounts.

## First API request

The public RPC endpoint is:

```text
https://rpc.nano.to
```

Test it with a read-only request:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"version"}'
```

For account-scoped requests, send the API key as a bearer token:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{"action":"account_info","account":"nano_1youraddress..."}'
```

Keep API keys in environment variables or a secret manager. Do not place a private key, seed, or server API key in a public frontend bundle.

## Suggested build paths

### Wallet and faucet

1. Install `@nano/wallet`.
2. Generate a wallet locally.
3. Claim NANO for testing from the Faucet.
4. Receive pending funds.
5. Query balance and account history.

### Merchant checkout

1. Create an API account and key.
2. Create a checkout with your receiving address and order metadata.
3. Redirect the customer to the returned `browser` URL.
4. Verify the checkout and confirmed block or validate the signed webhook.
5. Fulfill once, using your own idempotency record.

### Live application

1. Use RPC for reads and block processing.
2. Subscribe to WebSocket confirmations.
3. Reconnect with backoff and query state after reconnecting.
4. Add bounded retries for safe reads and respect `429` responses.

## Security checklist

- Keep seeds, private keys, API keys, webhook secrets, and wallet passwords server-side.
- Validate Nano addresses and amounts before signing or fulfilling.
- Treat a redirect as navigation, not payment proof.
- Verify checkout IDs, destinations, amounts, block hashes, and confirmations.
- Record webhook event IDs and make fulfillment idempotent.
- Do not blindly retry non-idempotent `process`, payment, or claim requests.
- Read the [rate limits guide](rate-limits.html) before selecting concurrency.

## Support

For product or account issues, [contact Nano.to support](https://rpc.nano.to/account/support) or email [support@nano.to](mailto:support@nano.to). Never send support a seed, private key, or API key.
