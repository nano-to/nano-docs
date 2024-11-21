module.exports = {

    curlExample(action) {
      var string = ``
      if (action && action.body) {
        var object = {
          action: action.action
        }
        if (action.action === 'buy_rpc' && this.account) delete action.body.email
        Object.keys(action.body).map(a => {
          if (!this.account && action.body[a] === 'RPC-API-KEY') {
            var note = `<div style="margin-top: ${action.note ? '20px' : ''}">[Nano.to RPC-KEY Required]</div>`
          }
          if (!this.account && action.body[a] === 'WALLET-API-KEY') {
            var note = `<div style="margin-top: ${action.note ? '20px' : ''}">[Nano.to WALLET-KEY Required]</div>`
          }
          if (this.account && action.body[a] === 'WALLET-API-KEY') {
            var note = `<div style="margin-top: ${action.note ? '20px' : ''};color: #f0f427;">[Logged in. Your WALLET-KEY is shown below.]</div>`
            if (!action.note || !action.note.includes(note)) {
              if (action.note) action.note += note
              if (!action.note) action.note = note
            }
            action.body[a] = this.account.wallet_key
          }
          if (this.account && action.body[a] === 'RPC-API-KEY') {
            var note = `<div style="margin-top: ${action.note ? '20px' : ''};color: #f0f427;">[Logged in. Your RPC-KEY is shown below]</div>`
            if (!action.note || !action.note.includes(note)) {
              if (action.note) action.note += note
              if (!action.note) action.note = note
            }
            action.body[a] = this.account.key
          }
          object[a] = action.body[a]
        })
        string += `curl -d '${JSON.stringify(object, null, 2)}' \\`
      } else {
        string += `curl -d '{ "action": "${action.action}" }' \\`
      }
string += `
-H "Content-Type: application/json" \\
"https://rpc.nano.to"`
      return string

    },

    nodeExample(action) {
      var string = `const axios = require('axios');

axios.post('https://rpc.nano.to', `
  
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `${JSON.stringify(object, null, 2)}`
  } else {
    string += `{
action: "${action.action}"
}`
  }

string += `).then((res) => {
  console.log(res.data);
});`
      return string
    },

    browserExample(action) {
      var string = `<script src="https://unpkg.com/axios/dist/axios.min.js"><\/script>

<script>
axios.post('https://rpc.nano.to', `

  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `${JSON.stringify(object, null, 2)}`
  } else {
    string += `{ action: "${action.action}" }`
  }

string += `).then((res) => {
  console.log(res.data)
})
<\/script>`
      return string
    },

    flutterExample(action) {
      var string = `// import 'dart:convert';
Future<http.Response> ${action.action}(String title) {
  return http.post(
  Uri.parse('https://rpc.nano.to'),
  headers: <String, String>{
    'Content-Type': 'application/json',
  },
  body: jsonEncode(<String, String>`
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `${JSON.stringify(object, null, 2)}`
  } else {
    string += `{ action: "${action.action}" }`
  }
  string += `),
)}`
      return string
    },

    djangoExample(action) {
  var string = `import requests
import json

def ${action.action}(title):
    url = 'https://rpc.nano.to'
    headers = {'Content-Type': 'application/json'}
    `
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `data = ${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, "'$1':").replace(/"/g, "'")}`
  } else {
    string += `data = {'action': '${action.action}'}`
  }
  string += `

response = requests.post(url, headers=headers, data=json.dumps(data))
return response.json()`
  return string
},

    csharpExample(action) {
  var string = `using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

public class ApiClient {
    private static readonly HttpClient client = new HttpClient();

    public static async Task<HttpResponseMessage> ${action.action}(string title) {
        var uri = new Uri("https://rpc.nano.to");
        var data = new {
  `
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, '$1 =').replace(/"/g, "\"").replace(/:/g, " ")}`
  } else {
    string += `action = "${action.action}"`
  }
  string += `
        };

        var content = new StringContent(JsonConvert.SerializeObject(data), Encoding.UTF8, "application/json");

        return await client.PostAsync(uri, content);
    }
}`
  return string
},

    railsExample(action) {
  var string = `require 'net/http'
require 'uri'
require 'json'

def ${action.action}(title)
  uri = URI.parse('https://rpc.nano.to')
  header = {'Content-Type': 'application/json'}
  `
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `data = ${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'")}`
  } else {
    string += `data = { action: '${action.action}' }`
  }
  string += `

  http = Net::HTTP.new(uri.host, uri.port)
  request = Net::HTTP::Post.new(uri.request_uri, header)
  request.body = data.to_json

  response = http.request(request)
  response.body
end`
  return string
	},

	assemblyExample(action) {
	  var string = `section .data
  url db 'https://rpc.nano.to', 0
  header db 'Content-Type: application/json', 0
	    `
	  if (action && action.body) {
	    var object = {
	      action: action.action
	    }
	    Object.keys(action.body).map(a => object[a] = action.body[a])
	    string += `data db '${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, '')}', 0`
	  } else {
	    string += `data db 'action: ${action.action}', 0`
	  }
	  string += `

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

len equ $ - $$`
	  return string
	},

	rustExample(action) {
	  var string = `use reqwest::Client;
use serde_json::json;
use std::collections::HashMap;

async fn ${action.action}(title: &str) -> Result<reqwest::Response, reqwest::Error> {
    let client = Client::new();
    let url = "https://rpc.nano.to"

    let mut data = HashMap::new();
    data.insert("action", "${action.action}");
    `
  if (action && action.body) {
    Object.keys(action.body).forEach(a => {
      string += `data.insert("${a}", "${action.body[a]}");\n    `;
    });
  }
  string += `

  let res = client
    .post(url)
    .json(&data)
    .send()
    .await?;

  Ok(res)
}`

	  return string
	},

	golangExample(action) {
	  var string = `package main

import (
  "bytes"
  "encoding/json"
  "net/http"
)

func ${action.action}(title string) (*http.Response, error) {
  url := "https://rpc.nano.to"
  `
	  if (action && action.body) {
	    var object = {
	      action: action.action
	    }
	    Object.keys(action.body).map(a => object[a] = action.body[a])
	    string += `data := map[string]interface{}${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "\"").replace(/:/g, " ")}`
	  } else {
	    string += `data := map[string]interface{}{"action": "${action.action}"}`
	  }
	  string += `

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
}`

	  return string
	},

    phpExample(action) {
  var string = `<?php
function ${action.action}($title) {
  $url = 'https://rpc.nano.to';
  $data = array(`
  if (action && action.body) {
    var object = {
      action: action.action
    }
    Object.keys(action.body).map(a => object[a] = action.body[a])
    string += `${JSON.stringify(object, null, 2).replace(/"([^"]+)":/g, '$1:').replace(/"/g, "'")}`
  } else {
    string += `{ action: '${action.action}' }`
  }
  string += `);
  $options = array(
    'http' => array(
      'header'  => "Content-Type: application/json\\r\\n",
      'method'  => 'POST',
      'content' => json_encode($data),
    ),
  );
  $context  = stream_context_create($options);
  $result = file_get_contents($url, false, $context);
  if ($result === FALSE) { /* Handle error */ }

  return $result;
}`
  return string
  },
  
    pythonExample(action) {
      var string = `import requests

url = 'https://rpc.nano.to'

myobj = `
      if (action && action.body) {
        var object = {
          action: action.action
        }
        Object.keys(action.body).map(a => object[a] = action.body[a])
        string += `${JSON.stringify(object, null, 2)}`
      } else {
        string += `{ action: "${action.action}" }`
      }
      string += `

x = requests.post(url, json = myobj)

print(x.text)`
      return string
    },

}