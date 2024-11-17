- title: Sample Video
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----

## JavaScript API

Accept Nano on the web, to your own Nano address.

> If you are looking to control wallets and move Nano via code. See the [Custodial Wallet API](/wallet-api).

## Basic Usage

**Nano.to Username**
```
https://nano.to/@esteban?pay=100
```

**Nano Address**
```
https://nano.to/nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o?pay=100
```

Demo: https://nano.to/Moon?request=500

> You can test these URLs using a browser. We recommend a [JSON Formatter Plugin](https://chrome.google.com/webstore/detail/json-formatter/bcjindcccaagfpapjjmafapmmgkkhgoa?hl=en) to clean up raw JSON. Makes for cleaner development.

```js
{
    "currency": "USD",
    "address": "[YOUR_ADDRESS]",
    "amount": "[UNIQUE_AMOUNT]",
    "rate": 2.18,
    "price": "500", // NANO
    "value": "1090.00", // in USD
    "amount_raw": "229358614800000000000000000000000",
    "href": "nano:[YOUR_ADDRESS]?amount=229358614800000000000000000000000",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUhE....HtZax8Na6/g/xd7Qn+uus8kAAAAASUVORK5CYII=",
    "expires": "April 14, 2022 5:07 AM", 
    "expires_unix": 1649912836,
    "id": "[UNIQUE_ID]",
    "timestamp": 1649740036144,
    "check_url": "https://nano.to/[YOUR_ADDRESS]/history/[UNIQUE_AMOUNT]?check=[UNIQUE_ID]" // for checking payment 
}
```

### Check For Payments

Every response comes with a ```check_url``` field. You can perform a GET request on this URL every 5 seconds behind the scenes. Or when ever you wish.

**Successful response:**

```js
{
    "id": "69fcb25c8f7",
    "completed": true,
    "hash": "7FA158DADE3082FA5569328D20858CC3955D6D9BB17E376108D1CD07D4B6C24E",
    "success_url": "https://nano.to/hash/7FA158DADE3082FA5569328D20858CC3955D6D9BB17E376108D1CD07D4B6C24E"
}
```

**Failed response:**

```js
{
    "code": 404,
    "error": true,
    "message": "Payment not found."
}
```

### Additional Data

Optionally, if you need more data. Every successful response includes a ```success_url``` field. You can perform a GET request on this URL like so.

```js
const axios = require('axios')

const headers = { 
    'Authorization': 'API_KEY'
}

axios.get('https://nano.to/hash/[HASH]', { headers }).then((res) => {
    console.log(res.data)
})
```

```js
{
    "type": "send",
    "from": "nano_37y6iq8m1zx9inwkkcgqh34kqsihzpjfwgp9jir8xpb9jrcwhkmoxpo61f4o",
    "to": "nano_1m747htgqw5fbhuafuswpwuc18y7zjwqntbi1fynehmz1zaqoj1puj7h96oj",
    "amount": "0.0448222",
    "amount_raw": "44822200000000000000000000000",
    "height": 1958,
    "sender": "@moon",
    "recipient": "@esteban"
    "message": null
}
```

> Data always comes directly from the Nano Blockchain. You are talking to the Blockchain, through our Nano node.

## Multi-Fiat Support

You can pass a **currency** URL param with any valid currency ISO. To convert all nano values to your local Fiat.

## Rate Limit

You can expect **1 request per second** on this endpoint. This plenty for most use cases. It's encoraged to 'debounce' requests. If you're interested in using this API for lots of use, please let us know in advanced. 

## Data Deletion Policy

Nano.to's data comes from the Nano Blockchain. Nano.to only stores Usernames and Checkout metadata. Checkout metadata is stored in-memory and is deleted after 24 hours. It's cheaper to NOT store your data. Who could have guessed. 

## Nano.to Support

- Email: support@nano.to
- Twitter: [@nano2dev](https://twitter.com/nano2dev)