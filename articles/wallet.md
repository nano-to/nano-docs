- title: @nano/wallet SDK: Generate and Use Nano Wallets
- date: 2026-10-14
- updated: 2026-10-14
- description: Use the zero-dependency @nano/wallet SDK in Node.js or the browser to generate Nano wallets, claim faucet funds, receive, send, create checkouts, and call RPC.
- tags: Guide, SDK, Wallets
- author: @nano2bot
- previous: Get Started / get-started.html
- next: Checkout API / checkout.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/wallet.md
-----

`@nano/wallet` is a JavaScript wallet SDK for Node.js and browsers. It can generate wallets locally, encrypt wallet files for CLI use, receive pending blocks, send Nano, create hosted checkouts, and call the Nano.to RPC API.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://www.npmjs.com/package/@nano/wallet">Install @nano/wallet</a>
  <a class="doc-cta-secondary" href="faucet.html">Get free NANO for testing</a>
</div>

## Install

```bash
npm install @nano/wallet
```

For browser use:

```html
<script src="https://unpkg.com/@nano/wallet"></script>
```

## Configure the SDK

Use an API key for faucet, proof of work, checkout, and other authenticated Nano.to operations. Keep it in a server-side environment variable for backend applications.

```js
const nano = require('@nano/wallet')

nano.app({
  node: 'https://rpc.nano.to',
  rpc_key: process.env.NANO_RPC_KEY,
  database: 'encrypted_wallet.txt',
  secret: process.env.NANO_SECRET
})

const address = nano.accounts()[0].address
console.log(address)
```

`nano.app()` creates or loads the encrypted local wallet and sets the active RPC configuration. It requires a password or secret. The SDK does not make wallet seeds or private keys safe to expose; never put a production wallet seed in browser source code.

## Generate a wallet locally

```js
const generated = nano.generate()
console.log(generated.accounts[0].address)

// To use the generated wallet, import it into the encrypted SDK store.
nano.import(generated, process.env.NANO_SECRET)
nano.save()
console.log(nano.accounts()[0].address)
```

The generated seed and private keys are sensitive. Store wallet material in a protected secret store or encrypted local file. Back up recovery material before using a wallet with value.

## Claim, receive, and send

```js
await nano.faucet()
await nano.receive()

console.log(await nano.balances())

await nano.send({
  to: 'nano_1recipient...',
  amount: '0.0005'
})
```

Nano usernames are supported where the endpoint accepts them:

```js
await nano.send({ to: '@development', amount: 0.001 })
```

Read [Nano Faucet](faucet.html) for account eligibility and [Nano Usernames](usernames.html) for alias behavior.

## Create a checkout

```js
const checkout = await nano.checkout({
  address: nano.accounts()[0].address,
  amount: '0.133'
})

console.log(checkout.browser)
const payment = await nano.monitorPayment(checkout)
console.log(payment)
```

For merchant webhooks, metadata, templates, and confirmation rules, use the [Checkout API guide](checkout.html).

## Call raw RPC

```js
const info = await nano.rpc({
  action: 'account_info',
  account: nano.accounts()[0].address
})

console.log(info)
```

The [RPC API reference](nano-rpc.html) covers authentication, supported actions, errors, rate limits, and request examples.

## CLI quick start

```bash
npm install -g @nano/wallet

nano-wallet generate --secret mypassword
nano-wallet faucet --secret mypassword
nano-wallet receive --secret mypassword
nano-wallet balance --secret mypassword
nano-wallet send nano_1recipient... 0.0005 --secret mypassword
```

Use `NANO_RPC_KEY` or the CLI key option for authenticated operations. Do not commit the generated wallet file to source control.
