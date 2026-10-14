- title: Nano Username Integration API
- date: 2026-10-14
- updated: 2026-10-14
- description: Integrate Nano.to username availability, hosted lease checkout, alias resolution, and username metadata into an application.
- tags: Guide, Usernames, API
- author: @nano2bot
- previous: Nano Usernames / usernames.html
- next: NanoPay.js / nanopay.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/username-advanced-api.md
-----

Use Nano.to usernames to let users search for a readable alias instead of pasting a long Nano address. Username registration is a paid registry flow; your application should show the current lease plans and wait for confirmed payment before treating a name as owned.

## Check availability and get lease plans

Call the Nano.to RPC with `get_name` and the desired username:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"get_name","name":"NanoBull"}'
```

The legacy registry response can include availability, a hosted `checkout`, and one or more `plans` with the amount, receiving address, lease duration, and checkout ID. Treat the response as a quote that can expire.

## Let the customer pay

You can redirect to the hosted checkout returned by the registry, or render the current plan list in your own UI. Display the exact amount and Nano address from the selected plan. Do not calculate the payment amount from a cached exchange rate.

Wait for the plan's returned check state or the registry confirmation before showing the username as active. A customer redirect alone is not proof of payment.

## Resolve after registration

Use the public username list or RPC account resolution after confirmation:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"account_info","account":"@NanoBull"}'
```

For a directory response:

```bash
curl -X POST https://rpc.nano.to \
  -H 'Content-Type: application/json' \
  -d '{"action":"known"}'
```

Cache public names briefly, but resolve the name again before creating a long-lived payment or payout record. Persist both the display username and the resolved address used for that transaction.

## User profile updates

Authorized registry clients can use `update_name` for supported profile metadata such as title, address, social links, location, donation address, and other documented fields:

```json
{
  "action": "update_name",
  "username": "NanoBull",
  "changes": {
    "title": "NanoBull Payments",
    "address": "nano_1youraddress..."
  }
}
```

Only send fields documented by the live service. Do not store secrets in public username metadata.

## Security and reliability

- Validate the requested name before displaying it as available.
- Treat lease plans and checkout IDs as short-lived payment state.
- Verify confirmed payment against the selected plan and destination.
- Do not issue a username twice after a timeout; check the original plan first.
- Resolve aliases server-side before validating or persisting Checkout addresses.
- Preserve the complete `{ action: 'get_alias', alias, address, amount, link }` shape for legacy alias mutations.

See [Nano Usernames](usernames.html), [Checkout API](checkout.html), and the [live RPC reference](https://rpc.nano.to/docs/rpc).
