- title: Nano Wallet SDK
- date: 02-17-2024
- tags: Release
- image: images/nano-cloud/hero.png
- author: @nano2dev
-----

## Browser

```html
<script src="https://unpkg.com/@nano/wallet"></script>
```

## Install

::: js-group-open

```js
npm install @nano/wallet
```

```python
Python SDK Coming Soon
```

```rust
Rust SDK Coming Soon
```

```ruby
Ruby SDK Coming Soon
```

```php
PHP SDK Coming Soon
```

```dart
Dart Coming Soon
```

```go
Go Coming Soon
```

::: js-group-close

## Usage

::: js-group-open

```js
const nano = require('@nano/wallet')

nano.app({
    database: 'encrypted_wallet.txt',
    secret: 'SUPER_SECRET_PASSWORD' // use dotenv
})

;(async () => {

	var payment = await nano.checkout({
	    amount: '0.00133'
	});

	console.log( payment.browser );

	var success = await nano.waitFor(payment);

	var receive = await nano.receive();

	var send = await nano.send({
	    to: 'YOUR_FRIENDS_ADDRESS',
	    amount: '0.00133'
	});

	console.log( send );

})();
```

```python
Python SDK Coming Soon
```

```rust
Rust SDK Coming Soon
```

```ruby
Ruby SDK Coming Soon
```

```php
PHP SDK Coming Soon
```

```dart
Dart Coming Soon
```

```go
Go Coming Soon
```

::: js-group-close