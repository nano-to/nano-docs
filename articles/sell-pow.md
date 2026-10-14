- title: Nano Work Servers: Earn NANO with GPU Proof of Work
- date: 2026-10-14
- updated: 2026-10-14
- description: Connect a GPU-backed Nano work server to Nano.to. Learn the installer flow, WORK_API_KEY setup, fixed payout, routing bid, health checks, and access requirements.
- tags: Guide, Work Servers, PoW
- author: @nano2bot
- previous: Proof of Work API / pow.html
- next: Cloud Wallets / cloud-wallet.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/sell-pow.md
-----

Nano does not use mining rewards. It uses lightweight proof of work to rate-limit spam. A Work Server earns NANO by generating valid work for Nano.to requests and returning the result quickly.

<div class="doc-cta">
  <a class="doc-cta-primary" href="https://rpc.nano.to/work-servers">Open Work Servers</a>
  <a class="doc-cta-secondary" href="https://rpc.nano.to/login">Request access</a>
</div>

## Current program

- Successful work currently pays a fixed **0.000001 NANO per PoW**.
- Payouts settle daily to the Nano payout address configured for the server.
- The editable bid affects routing priority; it does not change the fixed payout amount.
- Work Servers may be invite-only or feature-gated. Request access from the dashboard before deploying capacity.
- Your server must return valid work within the service health and latency requirements.

Do not model revenue from the example dashboard estimate. Actual requests depend on account traffic, availability, latency, validation, and routing.

## Installer

Create or obtain a Work API key from the dashboard. On Linux or macOS:

```bash
export WORK_API_KEY="WORK-KEY-..."
curl -fsSL https://rpc.nano.to/install/pow.sh | bash
```

On Windows PowerShell:

```powershell
$env:WORK_API_KEY="WORK-KEY-..."
iwr https://rpc.nano.to/install/pow.ps1 -UseB | iex
```

The installer configures the Nano work server, public tunnel, service startup, and health check. Review the installer source and run it only on a machine you control. Never paste a Work API key into a public issue, screenshot, or shared shell history.

## After installation

Use the local CLI to inspect and maintain the worker:

```bash
nano-pow status
nano-pow logs --tail 100
nano-pow restart
nano-pow doctor
```

The dashboard lets you configure the Nano payout address, view status, and change routing settings. Keep the worker online and monitor rejects; an invalid work server can be removed from routing.

## Work request contract

Nano.to sends a request like:

```json
{
  "action": "work_generate",
  "hash": "718CC2121C3E641059BC1C2CFC45666C...",
  "difficulty": "fffffff800000000"
}
```

Your server returns a valid work value:

```json
{
  "work": "2bf29ef00786a6bc"
}
```

Validate returned work against the exact hash and difficulty. A `200` response with an invalid work value is still a failed job.

## Hardware and operations

The worker needs a GPU or CPU capacity capable of generating Nano work within the service latency target. Use a stable Linux host for the simplest deployment, keep system packages current, and restrict access to the worker management interface. The public endpoint should accept only the expected work-generation contract.

When troubleshooting:

1. Run `nano-pow doctor`.
2. Check worker logs and GPU utilization.
3. Confirm the tunnel is online and the service can reach Nano.to.
4. Validate a sample work response.
5. Contact support with server ID and timestamps, never with private keys or API secrets.

## Related documentation

- [Proof of Work API](pow.html)
- [RPC API](nano-rpc.html)
- [Work Servers product page](https://rpc.nano.to/work-servers)
- [Support](https://rpc.nano.to/account/support)
