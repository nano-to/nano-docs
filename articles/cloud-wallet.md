- title: Nano Cloud Wallets API
- date: 2026-10-14
- updated: 2026-10-14
- description: Create encrypted Nano wallet records and automate sends, receives, and metadata filters with the Nano.to Cloud Wallets API.
- tags: Guide, Wallets, API
- author: @nano2bot
- previous: Wallet SDK / wallet.html
- next: Checkout API / checkout.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/cloud-wallet.md
-----

Cloud Wallets provide encrypted Nano wallet records for backend services, bots, merchant settlement, and checkout automation. Nano.to manages encrypted wallet record storage and Nano RPC orchestration; your application controls authentication, business metadata, spending policy, and when to sign or send.

Cloud Wallets may be invite-only or feature-gated for some accounts. [Sign in to request access](https://rpc.nano.to/login) and check the current product page before building a production dependency.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/cloud-wallets">Open Cloud Wallets</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/docs/cloud-wallets">Read the API docs</a>
</div>

## Security model

Nano.to handles:

- Encrypted seed storage.
- Wallet record lifecycle.
- Node RPC orchestration.
- Metadata indexing and filtering.

Your application handles:

- User authentication and authorization.
- Password or wallet-key protection.
- IP allowlists for `WALLET-KEY` usage.
- Spending limits and destination allowlists.
- Application metadata and reconciliation.

An API key is not a wallet seed. Keep all keys, passwords, and recovery material out of browser bundles, prompts, logs, and support requests.

## Create a wallet

Use `action: "cloud_wallet"` and a wallet action. The exact key and access requirements are account-specific; use a `WALLET-KEY` or authorized RPC key as shown in the current dashboard documentation.

```bash
curl -X POST https://rpc.nano.to/ \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer YOUR_API_KEY' \
  -d '{
    "action": "cloud_wallet",
    "wallet_action": "create_wallet",
    "password": "strong-application-secret",
    "name": "Primary",
    "metadata": { "userId": 123 }
  }'
```

Store the returned wallet identifier, but do not treat it as a replacement for authorization. Use a dedicated key and rotate it if it is exposed.

## List and filter wallets

Metadata lets an application map wallet records to its own users, merchants, or bots:

```json
{
  "action": "cloud_wallet",
  "wallet_action": "list_wallets",
  "filter_metadata": { "userId": 123 }
}
```

Use stable, non-sensitive identifiers in metadata. Do not place passwords, seeds, private keys, or payment secrets in metadata.

## Common wallet actions

- `create_wallet`: create an encrypted wallet record.
- `list_wallets`: list wallet records, optionally with `filter_metadata`.
- `get_wallet`: retrieve a wallet record or its current state.
- `send`: prepare and publish an authorized send.
- `receive`: receive pending Nano blocks.
- `update_metadata`: update application metadata without changing wallet ownership.

Read the [Cloud Wallets API reference](https://rpc.nano.to/docs/cloud-wallets) for required fields and current availability. Test on a dedicated account before connecting customer funds.

## When to use the Wallet SDK instead

If your application can keep encrypted wallet material itself and does not need managed wallet records, the [@nano/wallet SDK](wallet.html) is simpler and keeps wallet storage in your own environment. If you need per-user records, metadata filters, and service-level automation, Cloud Wallets may be a better fit.

## Related documentation

- [Wallet SDK](wallet.html)
- [Checkout API](checkout.html)
- [RPC API authentication](nano-rpc.html)
- [Cloud Wallets product page](https://rpc.nano.to/cloud-wallets)
