- title: Nano.to PoW API
- date: 04-12-2024
- tags: Guide
- image: images/setup-node/hero.jpeg
- author: @nano2bot
- video: true
-----

Standalone GPU powered Proof of Work API. Scale Nano apps, easily. 

## Authentication

> [Get Free API Key](https://rpc.nano.to?buy)

**Free 30 PoW / 30 minute for testing**. For production get [prepaid GPU credits](https://rpc.nano.to?buy).

## Add GPU PoW To Your Node

- **Windows:** ```C:\Users\<user>\AppData\Local\Nano\config-node.toml```
- **macOS**: ```/Users/<user>/Library/Nano/config-node.toml```
- **Linux**: ```/home/<user>/Nano/config-node.toml```
- **Docker**: As defined by the ```-v``` flag in the ```docker run``` command
- **.deb/rpm**: ```/var/nanocurrency/Nano/config-node.toml```

```toml
[node]
work_peers = [
    "rpc.nano.to/pow/:API_KEY",
]
```

## HTTPS API

::: code-group-open

```bash
curl -d '{
  "action": "work_generate",
  "hash": ":FRONTIER",
  "key": "RPC-API-KEY"
}' \
-H "Content-Type: application/json" \
"https://rpc.nano.to"
```

```js
const axios = require('axios');

axios.post('https://rpc.nano.to', {
  "action": "work_generate",
  "hash": ":FRONTIER",
  "key": "RPC-API-KEY"
}).then((res) => {
  console.log(res.data);
});
```

```python
import requests

url = 'https://rpc.nano.to'

myobj = {
  "action": "work_generate",
  "hash": ":FRONTIER",
  "key": "RPC-API-KEY"
}

x = requests.post(url, json = myobj)

print(x.text)
```

```rust
use reqwest::Client;
use serde_json::json;
use std::collections::HashMap;

async fn work_generate(title: &str) -> Result<reqwest::Response, reqwest::Error> {
    let client = Client::new();
    let url = "https://rpc.nano.to"

    let mut data = HashMap::new();
    data.insert("action", "work_generate");
    data.insert("hash", ":FRONTIER");
    data.insert("key", "RPC-API-KEY");
    

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

def work_generate(title)
  uri = URI.parse('https://rpc.nano.to')
  header = {'Content-Type': 'application/json'}
  data = {
  action: 'work_generate',
  hash: ':FRONTIER',
  key: 'RPC-API-KEY'
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
function work_generate($title) {
  $url = 'https://rpc.nano.to';
  $data = array({
  action: 'work_generate',
  hash: ':FRONTIER',
  key: 'RPC-API-KEY'
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
Future<http.Response> work_generate(String title) {
  return http.post(
  Uri.parse('https://rpc.nano.to'),
  headers: <String, String>{
    'Content-Type': 'application/json',
  },
  body: jsonEncode(<String, String>{
  "action": "work_generate",
  "hash": ":FRONTIER",
  "key": "RPC-API-KEY"
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

func work_generate(title string) (*http.Response, error) {
  url := "https://rpc.nano.to"
  data := map[string]interface{}{
  action  "work_generate",
  hash  " FRONTIER",
  key  "RPC-API-KEY"
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

    public static async Task<HttpResponseMessage> work_generate(string title) {
        var uri = new Uri("https://rpc.nano.to");
        var data = new {
  {
  action = "work_generate",
  hash = " FRONTIER",
  key = "RPC-API-KEY"
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
  action: work_generate,
  hash: :FRONTIER,
  key: RPC-API-KEY
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
  "difficulty": "fffffff800000000",
  "multiplier": "1.4403398628545552",
  "work": "4e278d4edc807508",
  "frontier": "7D27B311666C82....6C8637D277F1FD2ED",
  "duration": "0.883s"
  "credits": 9,
  "cached": false,
}
```

## Common Errors

Rarely, but it's important to be ready for them. We recommend you **precache** work. By requesting it from us, before you need it and storing it.

**Code 429: Exhausted your free usage:**

```js
{
    "error": 429,
    "message": "Too many requests."
}
```

**Code 503: GPUs are not available, (very rare):**

```js
{
    "error": 503, 
    "message": "Sorry, no GPUs available. Try again in a few seconds."
}
```

**Code 500: Service is not available (very rare):**

```js
{
    "error": 500, 
    "message": "Service not available. Try again in a few minutes."
}
```

## Questions or Comments? 

- Support: support@nano.to
- Twitter: [@nano2dev](https://twitter.com/nano2dev)
- BlueSky: [@nano2dev](https://twitter.com/nano2dev)
- @nano2dev on [Nano Discord](https://discord.com/invite/RNAE2R9) 
