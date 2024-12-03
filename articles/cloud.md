- title: Nano.to Cloud
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
- hidden: true
-----

Use Nano at scale. One simple API.

> First Nano Bank is **not** a "Crypto Ramp". This API only facilitates using the Nano blockchain.

## Usecases

Let's say you wanted to add Nano as an in-game currency to a game you're building. You have two choices. Setup your own Nano Node, and code all Wallet logic. Or use First Nano Bank's HTTPS API, and have it setup in your game, in under 5 minutes. 

> Prefer non-custodial? We encourage you to [run your own Node](/setup-node). 

> Already have a Node? Need faster proof of work? We offer a standalone [PoW API](/pow-api).

### Base URL

```
https://firstnanobank.com
```

> This specific API was isolated to different domain, with additional physical and digital security protocols. It is still owned and managed by Nano.to

## List Addresses

Send a **GET** request to ```/wallets``` with your API key as an **Authorization** header. 

```js
// npm i axios
const axios = require('axios')

const headers = { 'Authorization': 'API_KEY'}

axios.post('https://firstnanobank.com/wallets', { headers }).then((res) => {
	console.log(res.data)
})
```

```Response``` will be a JSON **array**. 

```js
[
	{
		"pending": 0,
		"balance": 0,
		"address": "nano_1bank29dkjdk49902ll4s..",
		"platform": "nanobank-beta",
		"href": "nano:nano_1bankx5gdfadbn..",
		"balance_url": "https://firstnanobank.com/wallet/nano_1bankx5gdfadbnx1sxd..",
		"qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUh..",
		"created": 1652830246328
	}
]
```

## Create Address

```js
// npm i axios
const axios = require('axios')

const headers = { 'Authorization': 'API_KEY'}

axios.get('https://firstnanobank.com/wallet', { headers }).then((res) => {
    console.log(res.data)
})
```

```Response``` will be a JSON **object**. 

```js
{
	"pending": 0,
	"balance": 0,
	"address": "nano_1bankx5gdfadbnx1sxdab4s....",
	"platform": "nanobank-beta",
	"href": "nano:nano_1bankx5gdfadbn....",
	"balance_url": "https://firstnanobank.com/wallet/nano_1bankx5gdfadbnx1sxd....",
	"qrcode": "data:image/png;base64,iVBORw0KGgoAAAANSUh...",
	"created": 1652830246328
}
```

## Move Nano via API 

Send a POST request to ```/wallet```.

```js
// npm i axios
const axios = require('axios')

const headers = { 'Authorization': 'API_KEY'}

axios.post('https://firstnanobank.com/wallet', {
    "type": "send"
    "to": "@nike", // Any nano address or a Nano.to @Username
    "amount": "87.39",
    "from": "[WALLET_ADDRESS]", // your Hot Wallet address
    "webhook": "https://mywebsite.com/secret-webhook", // optional, webhook notification for when it processes
}, { headers })

```

```Response``` will be a JSON **array**. 

```js
[
	{
	    "type": "send"
	    "amount": "0.133",
	    "to": "[TO_ADDRESS]", // fosse's address
	    "from": "[WALLET_ADDRESS]", // your Hot Wallet address
	    "hash": "C02F1A71A1B9C5ECFF6EB974F6296ACA504D0B9D7043FBDED0A6CDA92"
	}
]
```


**Body Params**

|  name |  type | required | description
|---|---|---|---|
|   type | string |  required  | "send"
|   to | string/array |  required  | String or Array of Nano address or @Username
|   from | string |  required  | Hot Address from GET /wallet request
|   webhook | string |  optional | Send a HTTP post request when transaction processes. 


### Get Balance

Check the balance of any nano address, including your own. 

```
https://firstnanobank.com/wallet/:address
```

```Response``` will be a JSON **object**. 

```js
{
	"balance": 0.1,
	"pending": 0,
	"address": "[YOUR_ADDRESS]",
	"usd_rate": 2.21,
	"usd_value": 0.2
}
```

## Vanity Address

This API supports using custom vanity addresses per API key. Example: ```nano_1nike``` . Available upon request.

## API Restrictions

- First Nano Bank is **not** a "Crypto Ramp". This API only facilitates using the Nano blockchain. 
- This API is **not** to be used to create consumer wallets, or store long term funds. 
- Minimum amount that can be sent or received using this API is **0.0001**.

## Nano.to Support

[Nano.to](https://fwd.dev/) offers free email support. Think of us like StackOverflow for Nano. 

- Email: support@nano.to
- Twitter: [@nano2dev](https://twitter.com/nano2dev)
