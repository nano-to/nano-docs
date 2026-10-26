- title: Nano.to API Rate Limits, Quotas, and Credits
- date: 2026-10-14
- updated: 2026-10-14
- description: Understand Nano.to public limits, free allowances, paid-plan shaping, PoW caps, prepaid credits, 429 responses, and how to design safe retries.
- tags: Guide, RPC, Limits
- author: @nano2bot
- previous: RPC API / nano-rpc.html
- next: Proof of Work API / pow.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/rate-limits.md
-----

Nano.to uses several limit layers. They protect shared infrastructure, shape bursts, and determine when a request uses a free allowance, subscription entitlement, or prepaid credit.

The live account quota and response fields are authoritative. Product limits can change as capacity and plans change.

## Limit layers

### Public IP protection

Unauthenticated traffic is subject to IP burst, sustained, extreme, and suspicious IP-rotation limits. These controls are separate from product quotas. A public IP block can affect all clients behind the same abusive address.

### Free product allowances

Eligible free traffic receives rolling or daily allowances. The current fallback values are:

- `rpc_free`: 1,000 RPC requests per rolling 24 hours.
- `pow_free`: 100 PoW requests per day.

The configured account state and current dashboard may differ from fallback values.

### Paid burst shaping

Authenticated subscriptions bypass public IP bans but still receive account-level burst shaping. The current limits are:

| Plan | RPC burst | RPC sustained | PoW burst | PoW sustained |
| --- | ---: | ---: | ---: | ---: |
| Starter | 6/second | 180/minute | 2/second | 40/minute |
| Growth | 120/second | 600/minute | 60/second | 120/minute |
| Enterprise | 1,000/second | 2,400/minute | 100/second | 300/minute |

RPC limits apply to normal actions. PoW limits apply to `work_generate`. Burst limits are account-scoped one-second buckets; sustained limits are account-scoped one-minute buckets. A burst response is temporary and does not consume a credit. The plan limits are currently fixed configuration, not dynamically adjusted from historical account usage.

### Plan allowances

RPC subscriptions are currently modeled as effectively unlimited monthly volume, subject to burst and service protections. PoW subscriptions can have finite billing-period caps. When a finite PoW allowance is exhausted, prepaid credits may allow continued use.

## Prepaid credits

One credit can be consumed for eligible overage requests. Credits may apply when:

- A free RPC or PoW allowance is exhausted.
- A finite PoW subscription allowance is exhausted.
- PoW is globally protected by a service lock.

Active subscriptions within their allowance do not consume prepaid credits. Keep a balance buffer for production workloads and monitor low-balance notifications.

## Handling `429`

Read the complete JSON error response. Plan shaping responses include `retry_after`, `plan_id`, `limit_type`, `usage`, and an actionable message.

```js
const response = await fetch('https://rpc.nano.to', options)
const body = await response.json()

if (response.status === 429) {
  const seconds = Number(body.retry_after || 2)
  await new Promise(resolve => setTimeout(resolve, Math.min(seconds, 30) * 1000))
  // Retry only an operation that is safe to repeat.
}
```

Do not blindly retry `process`, payment creation, or fulfillment operations. Read state first and use an idempotency strategy in your own application.

## Design recommendations

- Authenticate backend and serverless requests with a bearer header.
- Keep concurrency below the plan burst rate and use a bounded queue.
- Separate retryable reads from non-idempotent writes.
- Cache immutable or slow-changing reads where appropriate.
- Query `/api/account/quota` before expensive PoW batches.
- Log action, status, request ID, and limit reason without logging API keys.

See [RPC API](nano-rpc.html), [Proof of Work](pow.html), and the [live quota endpoint](https://rpc.nano.to/api/account/quota) for current behavior.
