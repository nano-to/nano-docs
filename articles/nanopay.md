- title: NanoPay.js
- previous: Username API / usernames.html
- next: Developer API / nano-rpc.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/nanopay.md
- scripts: //cdn.nano.to/pay.js
-----

NanoPay.js is an [open source](https://github.com/fwd/nano-pay), non-custodial browser library for the Nano blockchain. Easily add crypto payments to your website.

![NanoPay.js](https://camo.githubusercontent.com/3f1e8133d0cd930cf87f9e1767801a0ffe1e1e783b4755ee85aeeb1e7db2ffe4/68747470733a2f2f7062732e7477696d672e636f6d2f6d656469612f465f344b366636586f4141597450453f666f726d61743d6a7067266e616d653d6d656469756d)

## Live Demo

<a 
data-title="Tip @Nano2Dev" 
data-amount="0.13300XXXX"  
data-address="@development" 
data-button="Open Natrium">
Tip 0.133 NANO</a>

## Edit on CodePen

[https://codepen.io/nano2dev/pen/VwRQypE](https://codepen.io/nano2dev/pen/VwRQypE)

## Install

Add NanoPay to your project's *index.html*.

**CDN:**
```html
<script src="https://cdn.nano.to/pay.js"></script>
```

**With Integrity Hash:**
```html
<script src="https://cdn.nano.to/pay.js" integrity="sha512-vihlRMJ5xlS5Lg+wcNs4RLbs2TdS3OvFjjtF2nVn2IfiVVUe/yo5LJMXpc62+nn8p9TFy/QEhclG/emWactPqw==" crossorigin="anonymous"></script>
```

**Locally Hosted:**
```html
<script src="/pay.js"></script>
```

Download [latest](https://cdn.nano.to/pay.js) version.

## HTML Usage

Simple payments can be achieved with basic HTML. No javascript required. Adding '**X**' to the amount will make it unique. Preventing payment collisions when using the same Nano address.

```html
<a 
data-title="Tip @Nano2Dev" 
data-amount="0.13300XXX"  
data-address="@development" 
data-button="Open Natrium" 
data-position="top">
Tip 0.133 NANO</a>
```

## Simple Usage

```js
NanoPay.open({ 
    title: "Donate",
    address: 'nano_37y6iq8...9jrcf4o',  // unique address per payment
    amount: 0.133, // fixed amount
    success: (block) => {
        window.alert("Thanks!")
    }
});
```

## Advanced Usage

Configure and open popup programmatically with *NanoPay.open()* method.

```js
NanoPay.open({ 
  title: "Demo",
  address: '@development', // Username or Nano Address
  notify: 'support@nano.to', // get an email receipt
  contact: true, // user's email
  shipping: 10, // user's shipping address, use 'true' for free shipping
  currency: 'EUR', // converts prices EUR, default USD
  // amount: 30, // not used if using line_items
  line_items: [
    { name: "Shirt (X-Small)", price: 50 }, 
    { name: "Mens Shoes (9.5)", price: 20 }
  ],
  success: (block) => {
      console.log(block)
      // {
      //     "hash": "D16FF348B634CDB3DF8...9D6F5B180CCD3B93F99A4D15203",
      //     "amount": "NANO_AMOUNT_PAID",
      //     "address": "PAYEE_NANO_ADDRESS",
      //     "username": "PAYEE_USERNAME",
      //     "height": "PAYEE_BLOCK_HEIGHT",
      //     "shipping": "PAYEE_SHIPPING_ADDRESS",
      //     "email": "PAYEE_EMAIL_ADDRESS",
      //     "nanolooker": "https://nanolooker.com/block/D16FF348B634CDB3DF8...9D6F5B180CCD3B93F99A4D15203"
      //     "checkout": "https://api.nano.to/checkout/93be1ab9",
      // }
  },
  cancel: () => {
      console.log("User cancelled")
  },
})
```

## All Options

- **title**: (*string*) Show custom title shown in popup.
- **address**: (*string*) Nano address or Nano.to @Username.
- **contact**: (*string*) User's email address.
- **shipping**: (*number or bool*) User's mailing address. 'true' for free shipping.
- **position**: (*string*) Control popup position (top, center, bottom).
- **wallet**: (*string*) Custom wallet icon: natrium, nault, nautilus, cake
- **button**: (*string*) Custom button text, default "Open Natrium".
- **symbol**: (*string*) Custom NANO symbol, default "NANO".
- **random**: (*bool*) Use unique payment amounts, default true.
- **notify**: (*string*) Send email notification to admin, default false.
- **amount**: (*string*) Custom popup amount, used for simple payments.
- **line_items**: (*array*) List of products user is buying, replaces amount.
- **currency**: (*string*) Fiat currency for Nano price conversion, default "USD".
- **note**: (*string*) Custom note shown in admin email, default false.
- **qrcode**: (*string*) Always show QR Code, default desktop only.
- **success**: (*function*) Called when payment is successful.
- **cancel**: (*function*) Called when popup is cancelled.
- **checkout**: (*string*) Use custom Nano.to Checkout. [Read More](https://rpc.nano.to/#checkout).
- **email**: (*string*) Pre-configure user's email
- **mailing_address**: (*string*) Pre-configure user's shipping address

## Notifications

NanoPay offers email notifications for your convenience. 

```javascript
NanoPay.open({ 
  address: '@bank', // Username or Nano Address
  notify: 'support@nano.to',
  contact: true,
  shipping: true,
  amount: 0.133
})
```

## Nano Login

NanoPay makes Login with Nano easy. 

```js
NanoPay.open({ 
  title: "Login",
  address: '@bank', // Your App's Address
  amount: 0.0001, // Small Amount
  success: (block) => {
      // {
      //     "hash": "D16FF348B634CDB3DF8...9D6F5B180CCD3B93F99A4D15203",
      //     "address": "PAYEE_NANO_ADDRESS",
      //     "username": "PAYEE_USERNAME",
      //      ...
      // }
      console.log("Hello:", block.username || block.address)
  }
})
```

## HTML Paywall

NanoPay includes an easy way to monetize any website client-side. 

> Please note, this method does not require a back-end, as such it's not for keeping secrets from public. Google bots can still crawl content.

```html
<style>
/* This css prevents flash of content on page load */
.premium { display: none; } 
</style>
<article class="premium">
  Lorem ipsum dolor sit, amet consectetur, adipisicing elit. Amet tenetur ab reprehenderit temporibus, illum recusandae nostrum iusto omnis repellendus id quae ullam reiciendis dolorem aliquam fuga, tempora iste animi.
</article>
```

```js
NanoPay.wall({ 
    element: '.premium',
    title: 'Read Story',
    button: 'Unlock Story', 
    free: true, // Allow free reading
    amount: 0.001, // Cost of Article
    address: '@development', // Your Nano Address or Username
    success: (block) => {
      // do stuff like render highlight.js
      console.log("Thanks for reading:", block.username || block.address)
    }
})
```
