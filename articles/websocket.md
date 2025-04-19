- title: WebSocket API
- date: 04-19-2025
- tags: Guide
- author: @nano2bot
- video: true
-----

Nano.to offers enterprise-ready nano websockets for real-time data streaming.

## Endpoint

```
wss://ws.nano.to
```

## Basic Usage
```html
<script>
const socket = new WebSocket('wss://ws.nano.to');

socket.onopen = () => {
  console.log("WebSocket connected");
  const message = { 
    action: "subscribe", 
    topic: "confirmation" 
  };
  socket.send(JSON.stringify(message));
}
  
socket.onmessage = (event) => {
  const blob = event.data;
  const text = await blob.text();
  const json = JSON.parse(text);
  console.log("Message received:", json);
};

socket.onerror = (error) => {
  console.error("WebSocket error:", error);
};

socket.onclose = () => {
  console.log("WebSocket connection closed");
};
</script>
```

## Response

```json
{
    "topic": "confirmation",
    "time": "1744409899351",
    "message": {
        "account": "nano_1pnano4iwfigtwoq3dh4n7mubbsbzxh1f9kwmfa7ffazgicr1434hxg5p3ma",
        "amount": "417000000000000000000000000",
        "hash": "5E6652728CF808ECE35837CC6DA0C269C1CE67CEA7DF99F7E52B0E73C6F7436C",
        "confirmation_type": "active_quorum",
        "block": {
            "type": "state",
            "account": "nano_1pnano4iwfigtwoq3dh4n7mubbsbzxh1f9kwmfa7ffazgicr1434hxg5p3ma",
            "previous": "BC35797E8838367DF90CBE804768F50B8E3D8DD9E37BBCC3E8EC1FAF178DDE5A",
            "representative": "nano_3pnanopr3d5g7o45zh3nmdkqpaqxhhp3mw14nzr41smjz8xsrfyhtf9xac77",
            "balance": "77410544800000000000000000000000",
            "link": "73645FBD13053E04301A350412A56A7475B88E24435C262021F294C3F411B515",
            "link_as_account": "nano_1wu6dyyj83by1ir3nfa64ckpnx5oq494aitw6ri45wnnrht35faopumwepox",
            "signature": "DDD0E27DA4D0314D2AF07D424BA362C4178EBD1D346AFB425EA3F7C272C4F14AAEC17B7A4BB362A866C7D25AE5F7496BEDA7EBACF4C43CFBA05E01FF87339509",
            "work": "cecb2239dc7dd690",
            "subtype": "send"
        }
    }
}
```