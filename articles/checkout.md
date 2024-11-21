- title: Checkout API
-----

The Checkout API lets you build apps with the Nano blockchain easily.

::: code-group-open

```bash
curl -d '{
  "action": "checkout",
  "title": "Nano Bird Feeder",
  "notify": "steve@apple.com",
  "webhook": "https://example/webhook/secret",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "metadata": {
    "secret": "joe-doe"
  }
}' \
-H "Content-Type: application/json" \
"https://rpc.nano.to"
```

```js
const axios = require('axios');

axios.post('https://rpc.nano.to', {
  "action": "checkout",
  "title": "Nano Bird Feeder",
  "notify": "steve@apple.com",
  "webhook": "https://example/webhook/secret",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "metadata": {
    "secret": "joe-doe"
  }
}).then((res) => {
  console.log(res.data);
});
```

```python
import requests

url = 'https://rpc.nano.to'

myobj = {
  "action": "checkout",
  "title": "Nano Bird Feeder",
  "notify": "steve@apple.com",
  "webhook": "https://example/webhook/secret",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "metadata": {
    "secret": "joe-doe"
  }
}

x = requests.post(url, json = myobj)

print(x.text)
```

```rust
use reqwest::Client;
use serde_json::json;
use std::collections::HashMap;

async fn checkout(title: &str) -> Result<reqwest::Response, reqwest::Error> {
    let client = Client::new();
    let url = "https://rpc.nano.to"

    let mut data = HashMap::new();
    data.insert("action", "checkout");
    data.insert("title", "Nano Bird Feeder");
    data.insert("notify", "steve@apple.com");
    data.insert("webhook", "https://example/webhook/secret");
    data.insert("address", "YOUR_ADDRESS");
    data.insert("amount", "0.133");
    data.insert("metadata", "[object Object]");
    

  let res = client
    .post(url)
    .json(&data)
    .send()
    .await?;

  Ok(res)
}
```

```ruby
require 'net/http'
require 'uri'
require 'json'

def checkout(title)
  uri = URI.parse('https://rpc.nano.to')
  header = {'Content-Type': 'application/json'}
  data = {
  action: 'checkout',
  title: 'Nano Bird Feeder',
  notify: 'steve@apple.com',
  webhook: 'https://example/webhook/secret',
  address: 'YOUR_ADDRESS',
  amount: '0.133',
  metadata: {
    secret: 'joe-doe'
  }
}

  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri, header)
  request.body = data.to_json

  response = http.request(request)
  response.body
end
```

```php
<?php
function checkout($title) {
  $url = 'https://rpc.nano.to';
  $data = array({
  action: 'checkout',
  title: 'Nano Bird Feeder',
  notify: 'steve@apple.com',
  webhook: 'https://example/webhook/secret',
  address: 'YOUR_ADDRESS',
  amount: '0.133',
  metadata: {
    secret: 'joe-doe'
  }
});
  $options = array(
    'http' => array(
      'header'  => "Content-Type: application/json\r\n",
      'method'  => 'POST',
      'content' => json_encode($data),
    ),
  );
  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  if ($result === FALSE) { /* Handle error */ }

  return $result;
}
```

```dart
// import 'dart:convert';
Future<http.Response> checkout(String title) {
  return http.post(
  Uri.parse('https://rpc.nano.to'),
  headers: <String, String>{
    'Content-Type': 'application/json',
  },
  body: jsonEncode(<String, String>{
  "action": "checkout",
  "title": "Nano Bird Feeder",
  "notify": "steve@apple.com",
  "webhook": "https://example/webhook/secret",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "metadata": {
    "secret": "joe-doe"
  }
}),
)}
```

```go
package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func checkout(title string) (*http.Response, error) {
  url := "https://rpc.nano.to"
  data := map[string]interface{}{
  action  "checkout",
  title  "Nano Bird Feeder",
  notify  "steve@apple.com",
  webhook  "https //example/webhook/secret",
  address  "YOUR_ADDRESS",
  amount  "0.133",
  metadata  {
    secret  "joe-doe"
  }
}

  jsonData, err := json.Marshal(data)
  if err != nil {
      return nil, err
  }

  req, err := http.NewRequest("POST", url, bytes.NewBuffer(jsonData))
  if err != nil {
      return nil, err
  }
  req.Header.Set("Content-Type", "application/json")

  client := &http.Client{}
  resp, err := client.Do(req)
  if err != nil {
      return nil, err
  }

  return resp, nil
}
```

```c
using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ApiClient {
    private static readonly HttpClient client = new HttpClient();

    public static async Task<HttpResponseMessage> checkout(string title) {
        var uri = new Uri("https://rpc.nano.to");
        var data = new {
  {
  action = "checkout",
  title = "Nano Bird Feeder",
  notify = "steve@apple.com",
  webhook = "https //example/webhook/secret",
  address = "YOUR_ADDRESS",
  amount = "0.133",
  metadata = {
    secret = "joe-doe"
  }
}
        };

        var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

        return await client.PostAsync(uri, content);
    }
}
```

```x86asm
section .data
  url db 'https://rpc.nano.to', 0
  header db 'Content-Type: application/json', 0
        data db '{
  action: checkout,
  title: Nano Bird Feeder,
  notify: steve@apple.com,
  webhook: https://example/webhook/secret,
  address: YOUR_ADDRESS,
  amount: 0.133,
  metadata: {
    secret: joe-doe
  }
}', 0

section .bss
  response resb 256

section .text
  global _start

_start:
  ; Normally here you would set up a socket and perform the HTTP request
  ; For simplicity, print the URL, headers, and data

  ; Print URL
  mov edx, len url
  mov ecx, url
  mov ebx, 1
  mov eax, 4
  int 0x80

  ; Print Header
  mov edx, len header
  mov ecx, header
  mov ebx, 1
  mov eax, 4
  int 0x80

  ; Print Data
  mov edx, len data
  mov ecx, data
  mov ebx, 1
  mov eax, 4
  int 0x80

  ; Exit
  mov eax, 1
  xor ebx, ebx
  int 0x80

len equ $ - $$
```

::: code-group-close

```json
{
  "id": "CHECKOUT_ID",
  "browser": "https://nano.to/CHECKOUT_ID",
  "json": "https://api.nano.to/checkout/CHECKOUT_ID",
  "check": "https://api.nano.to/confirm/CHECKOUT_ID",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "amount_raw": "133000000000000000000000000000",
  "link": "nano:YOUR_ADDRESS?amount=133000047580000000000000000000",
  "qrcode": "data:image/png;base64.."
}
```