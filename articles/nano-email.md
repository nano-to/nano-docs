- title: Nano Email
-----

Send Nano to any Email address on the internet.

## Online UI

Visit https://email.nano.to

## Send via API

::: code-group-open

```bash
curl -d '{
  "action": "nano_email",
  "refund_address": "@bank",
  "amount": "5",
  "from": "",
  "message": "",
  "email_receipt": "",
  "expiration": "7 Days",
  "emails": [
    "steve@apple.com"
  ]
}' \
-H "Content-Type: application/json" \
"https://rpc.nano.to"
```

## Response

```js
const axios = require('axios');

axios.post('https://rpc.nano.to', {
  "action": "nano_email",
  "refund_address": "@bank",
  "amount": "5",
  "from": "",
  "message": "",
  "email_receipt": "",
  "expiration": "7 Days",
  "emails": [
    "steve@apple.com"
  ]
}).then((res) => {
  console.log(res.data);
});
```

```python
import requests

url = 'https://rpc.nano.to'

myobj = {
  "action": "nano_email",
  "refund_address": "@bank",
  "amount": "5",
  "from": "",
  "message": "",
  "email_receipt": "",
  "expiration": "7 Days",
  "emails": [
    "steve@apple.com"
  ]
}

x = requests.post(url, json = myobj)

print(x.text)
```

```rust
use reqwest::Client;
use serde_json::json;
use std::collections::HashMap;

async fn nano_email(title: &str) -> Result<reqwest::Response, reqwest::Error> {
    let client = Client::new();
    let url = "https://rpc.nano.to"

    let mut data = HashMap::new();
    data.insert("action", "nano_email");
    data.insert("refund_address", "@bank");
    data.insert("amount", "5");
    data.insert("from", "");
    data.insert("message", "");
    data.insert("email_receipt", "");
    data.insert("expiration", "7 Days");
    data.insert("emails", "steve@apple.com");
    

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

def nano_email(title)
  uri = URI.parse('https://rpc.nano.to')
  header = {'Content-Type': 'application/json'}
  data = {
  action: 'nano_email',
  refund_address: '@bank',
  amount: '5',
  from: '',
  message: '',
  email_receipt: '',
  expiration: '7 Days',
  emails: [
    'steve@apple.com'
  ]
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
function nano_email($title) {
  $url = 'https://rpc.nano.to';
  $data = array({
  action: 'nano_email',
  refund_address: '@bank',
  amount: '5',
  from: '',
  message: '',
  email_receipt: '',
  expiration: '7 Days',
  emails: [
    'steve@apple.com'
  ]
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
Future<http.Response> nano_email(String title) {
  return http.post(
  Uri.parse('https://rpc.nano.to'),
  headers: <String, String>{
    'Content-Type': 'application/json',
  },
  body: jsonEncode(<String, String>{
  "action": "nano_email",
  "refund_address": "@bank",
  "amount": "5",
  "from": "",
  "message": "",
  "email_receipt": "",
  "expiration": "7 Days",
  "emails": [
    "steve@apple.com"
  ]
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

func nano_email(title string) (*http.Response, error) {
  url := "https://rpc.nano.to"
  data := map[string]interface{}{
  action  "nano_email",
  refund_address  "@bank",
  amount  "5",
  from  "",
  message  "",
  email_receipt  "",
  expiration  "7 Days",
  emails  [
    "steve@apple.com"
  ]
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

    public static async Task<HttpResponseMessage> nano_email(string title) {
        var uri = new Uri("https://rpc.nano.to");
        var data = new {
  {
  action = "nano_email",
  refund_address = "@bank",
  amount = "5",
  from = "",
  message = "",
  email_receipt = "",
  expiration = "7 Days",
  emails = [
    "steve@apple.com"
  ]
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
  action: nano_email,
  refund_address: @bank,
  amount: 5,
  from: ,
  message: ,
  email_receipt: ,
  expiration: 7 Days,
  emails: [
    steve@apple.com
  ]
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
    "id": "a220db13",
    "address": "nano_1oc6cs3meem81q5zj....q7q57momqtpt7mfne8xnf95",
    "browser": "http://nano.to/id_a220db13",
    "check": "https://api.nano.to/confirm/a220db13",
    "subtotal": 5,
    "service_fee": 0,
    "amount": 5,
    "amount_raw": "5000000000000000000000000000000",
    "special_message": "",
    "qrcode": "data:image/png;base64,iVBORw0KGgoAAAAN...",
    "emails": [
        {
            "email": "esteban@gmail.com",
            "amount": 5
        }
    ],
    "expiration": "in a month",
    "created_at": 1733246689028
}
```