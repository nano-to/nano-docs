- title: Nano.to PoW API
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----

Standalone proof of work API. For scaling your Nano apps, easily. 

> **Free 30 PoW, per 30 minute for testing**. Need more? Get a [prepaid API key](https://nano.to?register). 

## Usage

You can use any of the following URL types:

**Username**
```
https://nano.to/@esteban/pow
```

**Address**
```
https://nano.to/nano_37y6iq8m1z../pow
```

**Frontier**
```
https://nano.to/7FA158DADE3082.../pow
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