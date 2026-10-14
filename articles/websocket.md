- title: Nano WebSocket API: Real-Time Confirmations
- date: 2026-10-14
- updated: 2026-10-14
- description: Subscribe to confirmed Nano transactions over wss://ws.nano.to. Learn confirmation subscriptions, account filters, browser Blob frames, reconnects, and live payment receipts.
- tags: Guide, WebSocket, API
- author: @nano2bot
- previous: Checkout API / checkout.html
- next: RPC API / nano-rpc.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/websocket.md
-----

Use the Nano.to WebSocket API to stream confirmed Nano transactions into payment pages, dashboards, alerts, and backend workers.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/websocket">Open WebSocket guide</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/checkout">Build a payment flow</a>
</div>

## Endpoint

```text
wss://ws.nano.to
```

Basic subscriptions do not require an API key. Use the RPC API for account reads and payment verification alongside the stream.

## Subscribe to confirmations

```html
<script>
const socket = new WebSocket('wss://ws.nano.to')

socket.addEventListener('open', () => {
  socket.send(JSON.stringify({
    action: 'subscribe',
    topic: 'confirmation'
  }))
})

socket.addEventListener('message', async event => {
  const text = event.data instanceof Blob ? await event.data.text() : event.data
  const payload = JSON.parse(text)
  console.log(payload)
})

socket.addEventListener('close', () => {
  // Reconnect with bounded backoff and query missed state.
})
</script>
```

## Filter by account

Subscribe with an account filter when your application only needs confirmations involving one or more addresses. Use the exact topic and filter shape shown by the [live WebSocket documentation](https://rpc.nano.to/docs/websocket); reconnecting clients should restore subscriptions after every new connection.

## Confirmation payload

Messages contain UTF-8 JSON. Browser clients can receive a text frame or a binary `Blob`, so decode before parsing:

```json
{
  "topic": "confirmation",
  "time": "1744409899351",
  "message": {
    "account": "nano_1youraddress...",
    "amount": "417000000000000000000000000",
    "hash": "BLOCK_HASH",
    "confirmation_type": "active_quorum",
    "block": {
      "type": "state",
      "subtype": "send",
      "account": "nano_1youraddress...",
      "previous": "PREVIOUS_HASH",
      "representative": "nano_1representative...",
      "balance": "77410544800000000000000000000000",
      "link": "LINK_HASH",
      "work": "WORK_VALUE",
      "signature": "BLOCK_SIGNATURE"
    }
  }
}
```

Amounts are Nano raw units. Convert them with an integer-safe library; do not use JavaScript floating point for balances.

## Use WebSocket with Checkout

WebSocket events are useful for UI updates, but they should not be your only fulfillment authority. For a Checkout payment:

1. Create the Checkout and save its ID, amount, destination, and metadata.
2. Show the returned `browser` URL to the customer.
3. Listen for confirmation events involving the expected address.
4. Verify the checkout and block details through the returned `check` URL or signed webhook.
5. Fulfill once using an idempotent order record.

On reconnect, query Checkout state and recent account history because events may have arrived while the socket was offline.

## Reconnect safely

- Use exponential backoff with a maximum delay.
- Restore every subscription after opening the new socket.
- Do not assume a close event means payment failure.
- Query state after reconnecting to cover missed confirmations.
- Deduplicate by block hash or your own event key.
- Keep the socket handler lightweight and move fulfillment to a durable queue.

## Related documentation

- [Checkout API](checkout.html)
- [RPC API](nano-rpc.html)
- [@nano/wallet SDK](wallet.html)
- [Live WebSocket docs](https://rpc.nano.to/docs/websocket)
