- title: Nano Wallet SDK
- date: 02-17-2024
- tags: Release
- image: images/nano-cloud/hero.png
- author: @nano2dev
-----

## Install

::: js-group-open

```js
Javascript SDK Coming Soon
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
// const nano = require('@nano/js')
import nano from '@nano/js'

const wallet = new nano.wallet()

console.log( wallet )

// {
//     "mnemonic": "body hire team image luxury banana panther tiny clog beauty only cover frost tourist process grit unlock rice",
//     "seed": "7202a6eb69fa3a465539648c35e55ad7e295f25c9a7a340f82b3d3e338f....33a4ee0939cd44a7abb1afe83ff2170cae4",
//     "accounts": [{
//         "accountIndex": 0,
//         "private": "d7cace49b3a20f83.....58cb61b8f2ef84f3",
//         "address": "nano_1h4ymsbu....3wotjakm1copzy56bd8na"
//     }]
// }

await wallet.receive()

console.log( await wallet.balance() )

await wallet.send({ to: 'nano_1h4ycopzy56bd8...', amount: '0.001' })

console.log( await wallet.balance() )
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