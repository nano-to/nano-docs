- title: Sample Video
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----
## Nano.to PoW API

Standalone proof of work API. For scaling your Nano apps, easily. 

> **Free 5 PoW, per minute for testing**. Need more? Get a [prepaid API key](https://nano.to?register). 

## Usage

You can use any of the following URL types:

**Nano.to Username**
```
https://nano.to/@esteban/pow
```

**Nano Address**
```
https://nano.to/nano_37y6iq8m1z../pow
```

**Frontier Hash**
```
https://nano.to/7FA158DADE3082.../pow
```

## Curl Example

```
curl https://nano.to/@esteban/pow?key=API_KEY
```

> Keep your API key secret. Never use it in 'front-end' code. 

## App Example

```js
// npm install axios

const axios = require('axios')

axios.get('https://nano.to/@esteban/pow?key=API_KEY').then((res) => {
    console.log(res.data)
})

```

> You can also pass key via ```header``` ```Authorization: API_KEY``` .

**Response:**

```js
{
    "difficulty": "fffffffc79e7b2c6",
    "multiplier": "2.2702710497099794",
    "work": "8f996cd532133dbd",
    "credits": 4
}
```

> Valid ```fffffff800000000``` proof of work, good for any Nano block. 

## Errors Happen

Rarely, but it's important to be ready for them. We recommend you **precache** work. By requesting it from us, before you need it and storing it.

**Code 429: Exhausted your prepaid + the 5 free PoW:**

```js
{
    "error": 429,
    "message": "Too many requests."
}
```

**Code 503: GPUs are not available:**

```js
{
    "error": 503, 
    "message": "Sorry, no GPUs available. Try again in a few seconds."
}
```

**Code 500: Service is not available:**

```js
{
    "error": 500, 
    "message": "Service not available. Try again in a few minutes."
}
```

## Questions or Comments? 

- Email: support@nano.to
- Twitter: [@nano2dev](https://twitter.com/nano2dev)
- @nano2dev on [Nano Discord](https://discord.com/invite/RNAE2R9) 

## Data Deletion Policy

Most of the data provided by Nano.to comes from the Nano Blockchain. Nano.to only stores Usernames leases and Checkout metadata. Checkout metadata is stored in-memory and is deleted after 24 hours. It's cheaper to NOT store your data. Who could have guessed. Our Cloud provider (AWS & DigitalOcean) probably store your IP indefinitely. We can't control that. 