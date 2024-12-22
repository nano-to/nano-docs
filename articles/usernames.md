- title: Username API
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- previous: Public Nano Node / nano-rpc.html
- next: NanoPay.js / nanopay.html
- edit: //github.com/nano-to/nano-docs/blob/master/articles/usernames.md
-----

Nano.to Usernames are aliases for Nano addresses. They are standardized for API use, and cost a small nano fee to prevent spam. 

Usernames can be reserved for 1 Month, 1 Year, 2 Years, 5 Years and 10 Years.

## Register a Username

To lease a Username, visit https://nano.to or register via API.

- Usernames may only contain letters and numbers, up to 30 characters long.
- You can lease multiple Usernames with the same nano address. 
- Any service that connects to Nano.to, supports Usernames. 

## Register via API

::: code-group-open

```bash
curl -d '{
  "action": "get_name",
  "name": "NanoBull"
}' \
-H "Content-Type: application/json" \
"https://rpc.nano.to"
```

```js
const axios = require('axios');

axios.post('https://rpc.nano.to', {
  "action": "get_name",
  "name": "NanoBull"
}).then((res) => {
  console.log(res.data);
});
```

```python
import requests

url = 'https://rpc.nano.to'

myobj = {
  "action": "get_name",
  "name": "NanoBull"
}

x = requests.post(url, json = myobj)

print(x.text)
```

```rust
use reqwest::Client;
use serde_json::json;
use std::collections::HashMap;

async fn get_name(title: &str) -> Result<reqwest::Response, reqwest::Error> {
    let client = Client::new();
    let url = "https://rpc.nano.to"

    let mut data = HashMap::new();
    data.insert("action", "get_name");
    data.insert("name", "NanoBull");
    

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

def get_name(title)
  uri = URI.parse('https://rpc.nano.to')
  header = {'Content-Type': 'application/json'}
  data = {
  action: 'get_name',
  name: 'NanoBull'
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
function get_name($title) {
  $url = 'https://rpc.nano.to';
  $data = array({
  action: 'get_name',
  name: 'NanoBull'
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
Future<http.Response> get_name(String title) {
  return http.post(
  Uri.parse('https://rpc.nano.to'),
  headers: <String, String>{
    'Content-Type': 'application/json',
  },
  body: jsonEncode(<String, String>{
  "action": "get_name",
  "name": "NanoBull"
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

func get_name(title string) (*http.Response, error) {
  url := "https://rpc.nano.to"
  data := map[string]interface{}{
  action  "get_name",
  name  "NanoBull"
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

    public static async Task<HttpResponseMessage> get_name(string title) {
        var uri = new Uri("https://rpc.nano.to");
        var data = new {
  {
  action = "get_name",
  name = "NanoBull"
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
  action: get_name,
  name: NanoBull
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
  "address": "nano_1name....",
  "browser": "http://nano.to/pay_CHECKOUT_ID",
  "check": "https://rpc.nano.to/check/CHECKOUT_ID",
  "available": true,
  "plans": [{
      "value": "0.0106987",
      "title": "2 Days",
      "value_raw": "10698700000000000000000000000"
  }, {
      "value": "0.0508923",
      "title": "1 Month",
      "discount": 50,
      "value_raw": "50892300000000000000000000000"
  }, {
      "value": "0.309268",
      "title": "1 Year",
      "discount": 50,
      "value_raw": "309268000000000000000000000000"
  }, {
      "value": "0.505576",
      "title": "2 Years",
      "discount": 50,
      "value_raw": "505576000000000000000000000000"
  }, {
      "value": "10.04408",
      "title": "10 Years",
      "value_raw": "10044080000000000000000000000000"
  }]
}
```

## Renew a Username

You can renew your Username at any time by visting the following URL:

> Only the username owner can extend registration

```
https://nano.to/:USERNAME/renew
```

Demo: https://nano.to/Esteban/renew

## Nano.to Connected Apps

We actively encourage other developers to add [add Nano Usernames to their apps](/username-advanced-api.html).

> For privacy, don't get a Username for a particular address, and avoid the publicity.

- [List of Third-Party Nano.to Apps](/nano-apps.html)

## Dedicated Support

Software bugs happen. Be sure to mention the address you tried to pay with, and which Username you were trying to get. 

- Email: support@nano.to