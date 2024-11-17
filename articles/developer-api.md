- title: Sample Video
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----

## Blockchain API

General API for fetching most public data from the live [Nano](https://github.com/nanocurrency/nano-node) blockchain. 

### Automatic HTML/JSON

If you visit the API urls in the browser, some pages will be HTML. Using a back-end server will always return JSON. Use ``` ?json=true ``` flag in the browser to force JSON response.

> For Chrome users, we recommend a [JSON Formatter Plugin](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) to clean up raw JSON responses. Makes for cleaner development. We did not build this Chrome plugin.

### Authentication

No API key is required to interact with Nano.to. 

### Rate Limiting

On most endpoints, you can expect to have up to 5 requests, per second. **This is plenty for most use cases.** Remember to throttle your requests, and you won't hit the limit.

### Base URL

```
https://nano.to
```

## Live USD Price

Get price of ([$XNO](https://www.coingecko.com/en/coins/nano/usd)) in USD, or any fiat. The price updates every 60 seconds. CoinMarketCap is used for price data.

```bash
https://nano.to/price
```

```javascript
{
  "symbol": "XNO",
  "price": 2.27,
  "currency": "USD",
  "timestamp": "2022-04-13T17:39:05.348Z"
}
```

***Support for conversion:***

```bash
https://nano.to/price?currency=CAD
```

```javascript
{
  "symbol": "XNO",
  "price": 2.85,
  "currency": "CAD",
  "timestamp": "2022-04-13T17:39:19.825Z"
}
```

**Params**

|  name |  type |  description
|---|---|---|
|   currency | string |  [ISO-4217](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html) symbol. **Default** USD |
|   json | string | false | Response is JSON data |


Demo: https://nano.to/price


## Address Balance

Balance information of any Nano address.

```bash
https://nano.to/:NANO_ADDRESS_OR_USERNAME/account
```

Response

```javascript
{
  "address": "[NANO_ADDRESS]",
  "balance": "0.1435",
  "frontier": "[HASH]",
  "representative": "[NANO_REPRESENTATIVE]",
  "height": "[BLOCK_HEIGHT]",
  "pending": "0",
  "usd_rate": "1.74", // live USD price
  "usd_value": "0.24", // balance * rate
  "href": "nano:[NANO_ADDRESS]",
  "qrcode": "[QR_CODE_BASE64]",
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/Kraken/account

## Address Pending

Array of pending blocks (payments) for a Nano address.

```bash
https://nano.to/:NANO_ADDRESS_OR_USERNAME/pending
```

### Response

```javascript
[
  {
    "amount": "0.0718359999999997",
    "hash": "6C0F4535283550CE0E38CC5DA78CE15F5CB553727A3EA643FD9D142C12126A55",
    "from": "nano_1reason1q976g9wkrt69nux7konww46ux73c7xzm7jrm3w4kqdtigym6btq3",
    "to": "nano_3shrydersd7kpbmkhrd3bnqece5j86s34q7zjq5wtf3f5kqintzks5m93zz8",
    "amount_raw": "71835999999999700000000000000",
    "usd_value": "0.26",
    "sender": "reps",
    "receiver": "shryder"
  },
  // {..}
]
```

Demo: https://nano.to/Shryder/pending

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/pending/moon

## Address History

Array of historical blocks (payments) of any Nano address. For now, API only goes back 50 blocks. If you need the entire history of an Address, this what running your own is for. Contact us if you need assistance: support@nano.to 

```bash
https://nano.to/:NANO_ADDRESS_OR_USERNAME/history
```

Response

```javascript
[
  {
    "type": "receive",
    "representative": "nano_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs",
    "balance": "0.121514",
    "previous": "6B70B0D69838FBC60BD2015104613851D363CE56EF7B228D0821BD327B7B1265",
    "account": "nano_1m747htgqw5fbhuafuswpwuc18y7zjwqntbi1fynehmz1zaqoj1puj7h96oj",
    "amount": "0.121514",
    "height": "1235",
    "hash": "CA2F00E4FE2F92979B68F32509D11838E79BD9610497F1EA4B30727EA788CAD9",
    "work": "0455df00843c2dd8",
    "timestamp": "1641407719",
    "amount_raw": "121514000000000000000000000000",
    "balance_raw": "121514000000000000000000000000",
    "from": "nano_1m747htgqw5fbhuafuswpwuc18y7zjwqntbi1fynehmz1zaqoj1puj7h96oj",
    "to": "nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o",
    "sender": "esteban",
    "receiver": "moon"
  }
  // {...}
]
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/Moon/history

## Block by Hash

```bash
https://nano.to/hash/:HASH
```

### Response

```javascript
{
    "type": "send",
    "from": "nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o",
    "to": "nano_1m747htgqw5fbhuafuswpwuc18y7zjwqntbi1fynehmz1zaqoj1puj7h96oj",
    "amount": "0.0448222",
    "amount_raw": "44822200000000000000000000000",
    "height": 1958,
    "sender": "@moon",
    "recipient": "@esteban"
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/hash/A341FBD3942B411D98BAC16241E5BC149DBE0D54D9BB23A873BC2A2C2B92B113

## Find Payment By Amount

Check if a Nano address has received a block (i.e Payment) with a specific amount. **Searches Pending & History.** This is useful if you want to build your own payment checking service.

```bash
https://nano.to/NANO_ADDRESS_OR_USERNAME/history/AMOUNT
```

**Amount must be in whole or decimal numbers (i.e MEGA) not RAW (used by RPC).**

### Response

```javascript
{
    "type": "send",
    "from": "nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o",
    "to": "nano_1m747htgqw5fbhuafuswpwuc18y7zjwqntbi1fynehmz1zaqoj1puj7h96oj",
    "amount": "0.0448222",
    "amount_raw": "44822200000000000000000000000",
    "height": 1958,
    "sender": "@moon",
    "recipient": "@esteban"
}
```

If no transaction is found, the response will be:

```js
{
  "message": "Not found.",
  "error": 404
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |


## List Of Nano Representatives

```bash
https://nano.to/reps
```

```json
{
  "cached": true,
  "representatives": [
    {
        "username": "1. High Performance Server 🚀 - DE",
        "rep_address": "nano_18shbirtzhmkf7166h39nowj9c9zrpufeg75bkbyoobqwf1iu3srfm9eo3pz",
        "est_payment": "0.000000",
        "donation_address": "nano_18shbirtzhmkf7166h39nowj9c9zrpufeg75bkbyoobqwf1iu3srfm9eo3pz",
        "weight": 7.66,
        "delegators": 3662,
        "uptime": "good",
        "synced": 100,
        "website": "https://node.mansour.io",
        "latitude": 49.405,
        "longitude": 11.1617
    },
    // {...}
  ],
  "last_checked": "2021-12-21T04:18:52.768Z",
  "source": "https://mynano.ninja"
}
```

## List of Nano.to Usernames

As of January 2022, there are over 500 registered Usernames on Nano.to. You're welcomed to use these Usernames in your applications. You may cache the list on your machine for as long as you'd like, or hit our endpoint everytime (up to 5 per second). This specific endpoint is designed for hobby & high demand applications.

> Looking to add Nano.to Usernames to your app? See the [Username Integration Docs](/username-advanced-api). 

```bash
https://nano.to/known
```

```json
[
  {
    "name": "razer",
    "address": "[THEIR_NANO_ADDRESS]",
    "created": "April 13, 2022",
    "expires": "April 14, 2022",
    "created_unix": 1649849400,
    "expires_unix": 1649935800
  },
  {
    "name": "kio",
    "address": "[THEIR_NANO_ADDRESS]",
    "created": "April 12, 2022",
    "expires": "April 13, 2022",
    "created_unix": 1649791380,
    "expires_unix": 1649877780
  },
    // {...}
]
```

Demo: https://nano.to/known

## Data Deletion Policy

Nano.to's data comes from the Nano Blockchain itself. Nano.to only stores Username leases and Checkout metadata. Username lease is kept for the duration of the rental. Checkout metadata is stored in-memory and is deleted after 24 hours. It's cheaper to NOT store unnecessary data. Who could have guessed. 

## Nano.to Support

[Nano.to](https://fwd.dev/) offers free email support. Think of us like StackOverflow for Nano. 

- Email: support@nano.to
- Twitter: [@nano2dev](https://twitter.com/nano2dev)