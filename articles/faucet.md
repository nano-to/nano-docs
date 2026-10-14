- title: Nano Faucet: Get Free NANO for Testing
- date: 2026-10-14
- updated: 2026-10-14
- description: Get a small amount of real Nano for wallet, RPC, and payment testing. Learn how the Nano.to faucet works, who can claim, and how to use it from the dashboard, CLI, SDK, or API.
- tags: Guide, Faucet, RPC
- author: @nano2bot
- previous: Get Started / get-started.html
- next: RPC API / nano-rpc.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/faucet.md
-----

The [Nano.to Faucet](https://rpc.nano.to/faucet) helps developers test Nano wallets, payments, receiving flows, and integrations with a small amount of real NANO on mainnet.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/faucet">Open the live Nano Faucet</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/login">Create a free RPC account</a>
</div>

## What the faucet provides

- The current default claim is **0.001 NANO**. The live status endpoint controls the amount, so the dashboard is the final source of truth.
- Faucet claims are intended for development and testing, not regular income or production funding.
- The claim is sent to the Nano address you provide. The request can remain `pending` while the payout is processed.
- Eligibility is checked against the account, destination address, source network, email verification/provider policy, and recent faucet activity before a payout is submitted.
- The faucet is currently available only to authenticated accounts with an API key.

This is real mainnet NANO. It is useful for testing a wallet or payment flow, but it is not a substitute for production funding and it is not Nano testnet currency.

## How to claim

1. [Create a free Nano.to account](https://rpc.nano.to/login) and complete email verification.
2. Sign in and create or copy an API key from the dashboard.
3. Open the [live faucet](https://rpc.nano.to/faucet).
4. Enter a valid Nano address and submit the claim.
5. Wait for the claim status to move from `pending` to `sent`, then receive the pending block in your wallet if your wallet requires that step.

The browser faucet checks eligibility for your account before enabling the claim button. If you already claimed, the page explains that the introductory claim has been used and may show any available milestone rewards.

## Claim from the command line

Install the wallet CLI and keep the API key in an environment variable rather than committing it to source control:

```bash
npm install -g @nano/wallet
export NANO_RPC_KEY=YOUR_RPC_KEY

nano-wallet generate --secret mypassword
nano-wallet faucet --secret mypassword
nano-wallet receive --secret mypassword
nano-wallet balance --secret mypassword
```

The wallet file is encrypted locally with the secret you provide. Never publish the wallet file, seed, mnemonic, private key, or API key.

## Use the wallet SDK

```js
const nano = require('@nano/wallet')

nano.app({
  node: 'https://rpc.nano.to',
  rpc_key: process.env.NANO_RPC_KEY,
  database: 'encrypted_wallet.txt',
  secret: process.env.NANO_SECRET
})

console.log(nano.accounts()[0].address)

const claim = await nano.faucet()
console.log(claim)

await nano.receive()
console.log(await nano.balances())
```

See the [@nano/wallet SDK guide](wallet.html) for wallet generation, sending, receiving, checkout creation, and raw RPC calls.

## Use the faucet API

Check eligibility first:

```bash
curl -X POST https://rpc.nano.to/ \
  -H 'Content-Type: application/json' \
  -H 'key: YOUR_RPC_KEY' \
  -d '{"action":"faucet_check"}'
```

Submit a claim:

```bash
curl -X POST https://rpc.nano.to/ \
  -H 'Content-Type: application/json' \
  -H 'key: YOUR_RPC_KEY' \
  -d '{
    "action": "faucet_claim",
    "nano_address": "nano_1youraddress..."
  }'
```

The API returns a claim record similar to:

```json
{
  "success": true,
  "message": "Your request for 0.001 NANO has been submitted.",
  "claim": {
    "id": 42,
    "nano_address": "nano_1youraddress...",
    "amount": "0.001",
    "status": "pending"
  }
}
```

For server-side integrations, bearer authentication is preferred where supported:

```http
Authorization: Bearer YOUR_RPC_KEY
```

Read the [RPC API reference](nano-rpc.html) and [common RPC errors](rpc-errors.html) before adding retries around a claim. Do not retry a successful submission blindly: first check the claim or account state so you do not create duplicate application-side records.

## Eligibility and abuse controls

The faucet uses account and request checks to limit abuse and protect the payout balance. A claim can be rejected when:

- The account has no API key, is not verified, or has already claimed.
- The Nano address, source network, or recent subnet activity is not eligible.
- The email provider does not meet the current faucet policy.
- The faucet is temporarily disabled for maintenance.

The API response contains the current rejection reason or claim status. Treat that response as authoritative because abuse controls and eligibility rules can change.

## Earn more through milestones

After the introductory claim, the faucet page may show reward milestones for eligible account activity. Rewards and progress are account-specific and can change. Open the [Rewards section](https://rpc.nano.to/faucet#rewards) to see the current requirements instead of relying on an old screenshot or fixed reward table.

## Faucet FAQ

### Is this free Nano real?

Yes. Faucet payouts are real NANO on the Nano mainnet. Use small claims for development and testing, and verify the transaction in a block explorer or your wallet.

### Why is my claim pending?

The claim request may be accepted before the payout is sent. Keep the claim response and address, then check the live faucet status or the resulting account activity. Do not submit repeated claims while the first request is pending.

### Do I need an API key?

Yes. Create a free account, verify your email, sign in, and create an API key before claiming.

### Can I claim to an exchange address?

Use a wallet address that you control. Exchanges may not credit very small deposits or may require a memo that Nano does not use.

### Where should I start after claiming?

Try the [wallet SDK](wallet.html), call the [RPC API](nano-rpc.html), create a [hosted Checkout](checkout.html), or subscribe to [WebSocket confirmations](websocket.html).

## Support

If an accepted claim remains unresolved, keep the claim ID, destination address, and response status, then [open a support request](https://rpc.nano.to/account/support) or email [support@nano.to](mailto:support@nano.to). Never send a seed or private key to support.
