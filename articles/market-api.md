- title: Market API
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
- hidden: true
-----

## Public Blockchain Data

### Base URL
```
https://nano.to
```

> If your HTTPS request includes a ```user-agent```, which most browsers do, you will get a HTML response. Otherwise a JSON response.

## Get Usernames

As of January 2022, there are over 500 registered Nano.to Usernames. You're welcomed to use Nano Usernames in your application.  

```bash
GET: https://nano.to/known
```

```json
[
  {
    "name": "kikio",
    "address": "nano_37y6iq8m...xpo6dd1f4o",
    "created": "March 31, 2022",
    "expires": "April 1, 2022",
    "created_unix": 1648688880,
    "expires_unix": 1648775280
  },
  {
    "name": "marvin",
    "address": "nano_18wd...8roiaoc",
    "created": "March 30, 2022",
    "created_unix": 1648677060,
    "expires_unix": 1648763460
  },
  // {...}
]
```

Demo: https://nano.to/known

> This specific endpoint is specially designed for high capacity. Rate limit is increased up to 1/s.


## Get Nano Price

Nano (XNO) price in USD. The price refreshes every 60 seconds. 

```bash
https://nano.to/price
```

```javascript
{
    "symbol": "NANO",
    "price": 4.93371887482106,
    "timestamp": "2021-09-23T01:57:52.020Z"
}
```

**Params**

|  name |  type |  description
|---|---|---|
|   currency | string |  [ISO-4217](https://docs.1010data.com/1010dataReferenceManual/DataTypesAndFormats/currencyUnitCodes.html) symbol. **Default** USD |
|   json | string | false | Response is JSON data |


Demo: https://nano.to/price


## Get Address balance

Balance information of any Nano address on the live blockchain.

```bash
https://nano.to/NANO_ADDRESS_OR_USERNAME/account
```

Response

```javascript
{
  "balance": "0.121514",
  "block_count": "1235",
  "representative": "nano_1x7biz69cem95oo7gxkrw6kzhfywq4x5dupw4z1bdzkb74dk9kpxwzjbdhhs",
  "weight": "0",
  "pending": "0.00000000009999",
  "balance_raw": "121514000000000000000000000000",
  "pending_raw": "99990000000000000000",
  "usd_rate": "3.64",
  "usd_value": "0.44",
  "alias": "Nano.to/Development",
  "address": "nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o",
  "username": "moon"
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/Kraken/account

## Get Address Pending

Array of pending blocks (payments) for a Nano address.

```bash
https://nano.to/NANO_ADDRESS_OR_USERNAME/pending
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

## Get Address History

Array of historical blocks (payments) of any Nano address. For now, API only goes back 50 blocks. If you need the entire history of an Address, this what running your own is for. Contact us if you need assistance: support@nano.to 

```bash
https://nano.to/NANO_ADDRESS_OR_USERNAME/history
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

Get a specific block (i.e payment) by it's unique hash.

```bash
https://nano.to/hash/HASH
```

### Response

```javascript
{
  "type": "receive",
  "amount": "1.732",
  "amount_raw": "1732000000000000000000000000000",
  "work": "f837dc89456e0d37",
  "representative": "nano_37imps4zk1dfahkqweqa91xpysacb7scqxf3jqhktepeofcxqnpx531b3mnt",
  "sender": "nano_3cpz7oh9qr5b7obbcb5867omqf8esix4sdd5w6mh8kkknamjgbnwrimxsaaf",
  "recipient": "nano_3aez6so5gx8shuk3f1m7scz4k75h71zz5ahgtwfasdaae8gdkgr5z6au8ffu",
  "timestamp": "2021-11-06T02:50:58.000Z"
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |

Demo: https://nano.to/hash/A341FBD3942B411D98BAC16241E5BC149DBE0D54D9BB23A873BC2A2C2B92B113

## Get Payment By Amount

Check if a Nano address has received a block (i.e payment) with a specific amount. **Searches Pending & History.** This is useful if you want to build your own payment checking service.

> Fun fact: Nano.to uses multiple nodes to check your address's history & pending for potential payments. At any given time, one node may not have your ```pending``` history up to date. We found using multiple nodes eliminates this problem.

```bash
https://nano.to/NANO_ADDRESS_OR_USERNAME/history/AMOUNT
```

**Amount must be in whole or decimal numbers (i.e MEGA) not RAW (used by RPC).**

### Response

```javascript
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
```

If no transaction is found, the response will be:

```js
{
  "code": 404,
  "error": true,
  "message": "Payment not found."
}
```

**Params**

|  name |  type | default |  description
|---|---|---|---|
|   json | string | false | Response is JSON data |


## Get List Of Public Representatives

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