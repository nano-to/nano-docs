- title: Checkout UI
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----

Personal payment pages for your Nano address. 

![](https://camo.githubusercontent.com/592b2704a25c6e0ed446a6774d04a3df67bd70f3463b4eea65dc9dfcd81d5287/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f4677516f4a507958734141326332343f666f726d61743d6a7067266e616d653d6d656469756d)

## Basic Usage

Just share link. Most platforms support HTML and Markdown. Down below are examples for that. 

> Usernames are optional, but recommended. It makes creating links even easier. 

```
https://xno.to/NANO_ADDRESS_OR_USERNAME?title=Coffee
```

Live Demo: [https://xno.to/Esteban](https://nano.to/Esteban?title=Coffee&price=5&image=https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg)

***HTML***

```html
<a href="https://nano.to/Esteban?title=Coffee&price=5&image=https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg">https://nano.to/Esteban</a>
```

***Markdown***

```markdown
Live Demo: [https://nano.to/Esteban](https://nano.to/Esteban?title=Coffee&price=5&image=https://media-cldnry.s-nbcnews.com/image/upload/t_nbcnews-fp-1200-630,f_auto,q_auto:best/newscms/2019_33/2203981/171026-better-coffee-boost-se-329p.jpg)
```

## Available Options:

```bash
https://nano.to/Moon?title=Donate
&price=50
&donate=false
&color=white
&currency=USD
&background=blue,red
&image=https://media3.giphy.com/media/cnuNz0fTBIUGnx4F9T/giphy.gif
&description=<p>HTML allowed 😎</p>
&suggest=Basic:30,Premium:50
&success_url=https://mywebsite.com/success
&cancel_url=https://mywebsite.com/
```

> ***Note:*** When using **GET**, CSS colors with hashtags ex. #000000 are supported, but replace the **#** with a **$** symbol. This is a URL limitation. This is not an issue with POST requests. See below. 

***HTML***

```html
<a href="https://nano.to/ADDRESS_OR_USERNAME">Donate with Nano</a>
```

***Markdown***

```
[Tip me $5](https://nano.to/Esteban?price=5)
```

Demo: [Tip me in Nano](https://nano.to/Esteban)

## Customization

More advanced and sensitive data can be passed in the body of a POST request. 

```
POST: https://nano.to/NANO_ADDRESS_OR_USERNAME
```

```javascript
// npm install axios
const axios = require('axios')

axios.post('https://rpc.nano.to', {
    "action": "checkout",
    "title": "New Order",
    "currency": "USD", // any valid ISO string
    "plans": [
        { "name": "Fries", "price": 5 },
        { "name": "Burger", "price": 10 },
        { "name": "Happy Meal", "price": 15 },
        { "name": "Cookies 🍪", "price": 3 }
    ],
    "business": {
        "name": "McDonalds",
        "logo": "https://www.tailorbrands.com/wp-content/uploads/2020/07/mcdonalds-logo.jpg"
    },
    "image": "https://files.muzli.space/2d7af141fab097859ef66de8d7c50932.jpeg", 
    "color": "black,white",
    "background": "#00000,#311ac5",
    "success_url": "https://mywebsite.com/success?id={{id}}&anotherParam=hello",
    "cancel_url": "https://google.com",
    "webhook_url": "https://mywebsite.com/super-secret-webhook",
    "webhook_secret": "my-super-secret",
    "metadata": { "userId": "joe-mama" }
})
```

### Response:

```
{
    "id": "666ee7bf26a",
    "url": "https://nano.to/checkout/666ee7bf26a",
    "exp": "2021-09-23T01:51:23.853Z"
}
```

## Notifications

The recommended way to be notified of incoming payments is by passing a 'webhook_url' param in the body of a POST request. The JSON payload will look like this:

```javascript
{
    id: '6e9d1f58c40',
    status: 'complete',
    amount: 1,
    method: {
        symbol: 'nano',
        address: 'YOUR_ADDRESS',
        name: 'Nano',
        rate: '5.43262',
        amount: '0.18621',
        value: '1.01',
        raw: false
    },
    plan: {
        price: 1,
        name: '1 Month'
    },
    block: {
        type: 'pending',
        amount: '0.18621',
        hash: '6EE79D2BA2A8995179..',
        source: 'THEIR_ADDRESS',
        amount_raw: '1862100000000..'
    },
    metadata: {
        id: 'joe-mama'
    }
}
```

**Your server listening for POST request, would look like this:**

```js
// npm install fwd/server
const server = require('@fwd/server')

// listen at this path, with a POST method.
server.post('/super-secret-webhook', (req, res) => {
    console.log(req.body) // data from example above
    res.send("Ok")
})
// start server
server.start(8080)
```

## Fiat Conversion

```
https://nano.to/Esteban?currency=RUB
```

![](../assets/checkout-rub.png)

## Single Panel UI

When no ```plans``` are provided, there is no need for the left side of the Checkout UI. 

```
https://nano.to/Esteban?pay=100
```

> When setting the price, you can use ```pay```, ```price``` or ```amount```. They all work the same.

![](../assets/checkout-single.png)

## Metadata

Pass a ```?json=true``` URL flag to the ```url``` in the Response to get a JSON object of the Checkout. 

> In most cases you do don't need this.

```
https://nano.to/checkout/666ee7bf26a?json=true
```

![](../assets/address_highlight.png)

## Deep Linking

Clicking (or Tapping) the QR Code will open Natrium and automatically fill in amount and address, on most phones. 