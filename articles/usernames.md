- title: Nano Usernames and Alias API
- date: 2026-10-14
- updated: 2026-10-14
- description: Resolve Nano.to usernames such as @development to Nano addresses, list known names, and preserve alias values through Nano.to payments and Checkout integrations.
- tags: Guide, Usernames, API
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: NanoPay.js / nanopay.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/usernames.md
-----

Nano.to usernames are human-readable aliases for Nano addresses. A username such as `@development` can be used in supported Nano.to flows and resolved server-side to its current `nano_` address.

## Resolve a username in RPC

The Nano.to RPC resolves a username supplied where an account is accepted:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"account_info","account":"@development"}'
```

Your application should store the resolved address used for a transaction or order, while retaining the original username for display. Aliases can change ownership or expiry, so resolve them at the point where you create a payment or validate a payout destination.

## List known usernames

Use the `known`, `names`, or `usernames` action to retrieve the current public list:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"known"}'
```

The response is a public list of names and addresses. Cache it briefly and handle upstream failures; do not assume a name exists forever.

## Nano Checkout and usernames

Checkout accepts a username in supported address fields, including merchant and receiving addresses. Resolve the username server-side before validating or persisting the checkout address:

```json
{
  "action": "checkout",
  "address": "@development",
  "amount": "0.01",
  "currency": "NANO",
  "metadata": { "order_id": "order_123" }
}
```

For fulfillment, trust the persisted receiving address and confirmed payment details, not a later alias lookup. See [Checkout API](checkout.html).

## Lease and registry flows

Legacy username registration and alias mutations are proxied through the RPC for compatible clients. The `get_name` action checks or starts the legacy lease flow, while `update_name` changes permitted profile metadata. Registry mutations remain part of the legacy username service, so do not assume a successful RPC proxy response is visible in a separate repository or account until the registry confirms it.

For current registration and pricing, use the [Nano.to username page](https://nano.to) and preserve the action shape required by the live registry service. The legacy API may return a hosted checkout for the selected lease term.

## `get_alias`

The `get_alias` action remains available for legacy alias integrations:

```json
{
  "action": "get_alias",
  "alias": "example",
  "address": "nano_1youraddress...",
  "amount": "0.01",
  "link": "https://example.com/"
}
```

Preserve all of these fields when proxying an alias mutation. A successful legacy mutation is not proof that another repository's registry database has been updated; verify the resulting name through the canonical registry source.

## Validation rules

- Accept `@name` and bare names only where the endpoint documents username support.
- Normalize the leading `@` for lookup but preserve the display form.
- Do not accept arbitrary strings as Nano addresses before resolution.
- Validate the resolved `nano_` address and checksum.
- Resolve again before creating a long-lived Checkout or payout record.
- Never use a username as a secret or authentication credential.

## Related documentation

- [RPC API](nano-rpc.html)
- [Checkout API](checkout.html)
- [NanoPay.js](nanopay.html)
- [Username integration](username-advanced-api.html)
