const server = require('@fwd/server')
const languages = require('./languages')

var json = [ 
        {
          action: "version",
          response: `{
  "rpc_version": "1",
  "store_version": "22",
  "protocol_version": "19",
  "node_vendor": "Nano V25.0",
  "store_vendor": "LMDB 0.9.25",
  "network": "live"
}`
        },
        {
          action: "account_info",
          body: {
            account: '@development'
          },
          response: `{
  "frontier": "023B94B7D27B311666C8636954FE17F1FD2EAA97A8BAC27DE5084FBBD5C6B02C",
  "open_block": "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
  "representative_block": "023B94B7D27B311666C8636954FE17F1FD2EAA97A8BAC27DE5084FBBD5C6B02C",
  "balance": "325586539664609129644855132177",
  "balance_nano": "0.32558653966460912964",
  "modified_timestamp": "1598514077",
  "block_count": "44",
  "account_version": "2",
  "confirmation_height": "44",
  "confirmation_height_frontier": "023B94B7D27B311666C8636954FE17F1FD2EAA97A8BAC27DE5084FBBD5C6B02C"
}`
        }, 
        {
          action: "account_history",
          body: { account: '@faucet', count: "1" },
          response: `{
  "account": "nano_1faucet7b6xjyha7m13objpn5ubkquzd6ska8kwopzf1ecbfmn35d1zey3ys",
  "history": [{
      "type": "send",
      "account": "nano_1bank1q3...aosg8kyr51qsdkm8g45",
      "amount": "10000000000000000000000",
      "amount_nano": "0.00000001"
      "local_timestamp": "1679167126",
      "height": "40648",
      "hash": "54DD08EE75157BC03E3B94FBDCBEBF9E3112704F15E21FBD014234FA7ADC131E",
      "confirmed": "true",
      "username": "bank"
  }],
  "previous": "036FF72D6204CAC1024777FE535F4DB5BB4052DF130DC2E431FD360086D71F49"
}`
        }, 
        {
          action: "receivable",
          body: { 
            account: '@faucet', 
            count: "5"
          },
          response: `[
  {
    "hash": "9DA74CCE700808EB4BB91DB43F42E739244B0FD5F2BB0D00B2C7F9074C367E83",
    "source": "nano_38gxz93y39yqbeqkcgcyrhkyu183otfpaymjcstzsa9isp9epdsudhmf9shm",
    "amount": "100000000000000000000000000000",
    "amount_nano": "0.1"
  }, 
  {
    "hash": "A12FC2862F07F1CEFF8C848C8AD5B13E41578959C526588B5940CAA27B7B215E",
    "source": "nano_16ouai59d7eu4mnd9rxojncey65p1d5r3oipxyn1ceqgjkxtx8n5hxremooi",
    "amount": "1000000000000000000000000000",
    "amount_nano": "0.001"
  }, 
  {
    "hash": "C11BC728B8007CC875AA75040E8563C2C9195BAEE0A3CA424E98D089F7A336F5",
    "source": "nano_3qx5cz95xxpd5wsm9imggxpuxhpf5oupx14456ms5f5hn9qhyexiszfhshfb",
    "amount": "1000971397140000000000000000",
    "amount_nano": "0.00100097139714",
    "username": "lorem"
  }
]`
        }, 
        {
          action: "account_balance",
          body: {
            account: "@development"
          },
          response: `{
  "balance": "325586539664609129644855132177",
  "pending": "2309372510769300000000000000000000",
  "receivable": "2309372510769300000000000000000000",
  "balance_nano": "0.32558653966460912964",
  "pending_nano": "2309.3725107693",
  "receivable_nano": "2309.3725107693"
}`,
        error: `{ error: "Bad account number" }`
        }, 
        {
          action: "accounts_balances",
          body: {
            accounts: [
  "@development", 
  "nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7",
  "@faucet",
  ]
          },
          response: `{
  "balances": {
      "@development": {
          "balance": "325586539664609129644855132177",
          "balance_nano": "0.32558653966460912964",
          "pending": "2309372510769300000000000000000000",
          "pending_nano": "2309.3725107693",
          "receivable": "2309372510769300000000000000000000",
          "receivable_nano": "2309.3725107693"
      },
      "nano_3i1aq1cchnmbn9x5rsbap8b15akfh7wj7pwskuzi7ahz8oq6cobd99d4r3b7": {
          "balance": "0",
          "balance_nano": "0",
          "pending": "0",
          "pending_nano": "0",
          "receivable": "0",
          "receivable_nano": "0"
      },
      "@faucet": {
          "balance": "2815988528585400000000000000000",
          "balance_nano": "2.8159885285854",
          "pending": "0",
          "pending_nano": "0",
          "receivable": "0",
          "receivable_nano": "0",
          "address": "nano_1faucet7b6xjyha7m13objpn5ubkquzd6ska8kwopzf1ecbfmn35d1zey3ys"
      }
  }
}`,
        error: `{ error: "Bad account number" }`
        }, 
        {
          action: "accounts_receivable",
          body: { 
            accounts: [
  "nano_1111111111111111111111111111111111111111111111111117353trpda", 
  "@development"
  ],
            // array: "true" 
          },
          response: `{
  "blocks" : {
    "nano_1111111111111111111111111111111111111111111111111117353trpda": [
      "142A538F36833D1CC78B94E11C766F75818F8B940771335C6C1B8AB880C5BB1D": {
        "amount": "6000000000000000000000000000000",
        "source": "nano_3dcfozsmekr1tr9skf1oa5wbgmxt81qepfdnt7zicq5x3hk65fg4fqj58mbr"
      }
    ],
    "@development": [
      "4C1FEEF0BEA7F50BE35489A1233FE002B212DEA554B55B1B470D78BD8F210C74": {
        "amount": "106370018000000000000000000000000",
        "source": "nano_13ezf4od79h1tgj9aiu4djzcmmguendtjfuhwfukhuucboua8cpoihmh8byo"
      }
    ]
  }
}`
        }, 
        
        {
          action: "block_info",
          body: {
            hash: 'B5E0BE6DAB75740A...06CC4EC7A548F4AFD37A'
          },
          response: `{
  "block_account": "nano_36zroxcwrc3okientagy18ccr51fz9qbj3y9guwzroh46uu3oyford19n5sp",
  "amount": "110000000000000000000000000000",
  "amount_nano": "0.11"
  "balance": "1798087000000000000000000000000",
  "balance_nano": "1.798087",
  "height": "347",
  "local_timestamp": "1679170643",
  "successor": "0000000000000000000000000000000000000000000000000000000000000000",
  "confirmed": "true",
  "contents": {
      "type": "state",
      "account": "nano_36zroxcwrc3okientagy18ccr51fz9qbj3y9guwzroh46uu3oyford19n5sp",
      "previous": "F87183445CCBDA814D4FEA653D58DAA5E0BE35ACE33FF04ED1EC7B79430A1DF9",
      "representative": "nano_3pnanopr3d5g7o45zh3nmdkqpaqxhhp3mw14nzr41smjz8xsrfyhtf9xac77",
      "balance": "1798087000000000000000000000000",
      "balance_nano": "1.798087"
      "link": "3A9938F2E17DE4DA81D4E4FA413B1291BBCAC7839775BC76562731386B547883",
      "link_as_account": "nano_1gns95sg4zh6uc1xbs9ta6xj76fusd5r97uoqju7ebsj93ooay656kwa6i8p",
      "signature": "04320501F47B4FD291B5EC7438F31BEAF59B22A447E33021296F3113C38FC26375C4DB14C26901159A900DAB18E91CA5152C6FE8DB5F19B70A3E4FE54048FD09",
      "work": "1ed0bc478d446610",
  },
  "subtype": "send",
}`
        },

        {
          action: "blocks_info",
          body: {
            "source": "true",
            "receive_hash": "true",
            "hashes": [
              "E2FB233EF4554077A7BF1AA85851D5BF0B36965D2B0FB504B2BC778AB89917D3",
              "67D9F9F03566D22926159193BD5BDE549FBE8308807C666BCCD3CEA098FBF49D",
            ]
        },

        response: `{
  "blocks": {
    "67D9F9F03566D22926159193BD5BDE549FBE8308807C666BCCD3CEA098FBF49D": {
        "amount": "1240000000000000000000000000",
        "balance": "11017588042701000000000000000000",
        "block_account": "nano_1pnano6m6o1ix3eshr6fj9rryd4ckziyii1mf3ychqno9t3soz638dc9fj9a",
        "confirmed": "true",
        "contents": {
            "account": "nano_1pnano6m6o1ix3eshr6fj9rryd4ckziyii1mf3ychqno9t3soz638dc9fj9a",
            "balance": "11017588042701000000000000000000",
            "link": "3E9955573B6A932AF30DA52C33E8152E78D203ADA8B8BC1DC99E785019A34E9D",
            "link_as_account": "nano_1hnscodmptnm7dsiubbe8hn3cdmrta3tuc7rqigwm9mrc1et8mnxibtso67a",
            "previous": "7FD83954BC187AF1473BAD33F07D4EE634733BFEDBE3D56CC10997F417F3C625",
            "representative": "nano_3pnanopr3d5g7o45zh3nmdkqpaqxhhp3mw14nzr41smjz8xsrfyhtf9xac77",
            "signature": "3D2438195A0E91A1F26C959C47F9014A84C11ED150241B4B017411FA6C79096D74FD7E731D708AFAAEEB7F95534DA7D5D42BB6343D7C3F51CA0BE5520058980F",
            "type": "state",
            "work": "14c98d6e8f7f4ad8",
            "balance_nano": "11.017588042701"
        },
        "height": "271199",
        "local_timestamp": "1674588370",
        "receive_hash": "4DCA5A5E2C732A6899292B9091B7A90CE87E8063954498DF30F469416E6DD6C0",
        "source_account": "0",
        "subtype": "send",
        "successor": "FD83C514FA18E59EF1A3D7C3D3760AEF942C077BD0660A5C4C10F617FFB3D580",
        "balance_nano": "11.017588042701",
        "amount_nano": "0.00124"
    },
    "E2FB233EF4554077A7BF1AA85851D5BF0B36965D2B0FB504B2BC778AB89917D3": {
        "amount": "30000000000000000000000000000000000",
        "balance": "40200000001000000000000000000000000",
        "block_account": "nano_1qato4k7z3spc8gq1zyd8xeqfbzsoxwo36a45ozbrxcatut7up8ohyardu1z",
        "confirmed": "true",
        "contents": {
            "account": "nano_1qato4k7z3spc8gq1zyd8xeqfbzsoxwo36a45ozbrxcatut7up8ohyardu1z",
            "balance": "40200000001000000000000000000000000",
            "link": "87434F8041869A01C8F6F263B87972D7BA443A72E0A97D7A3FD0CCC2358FD6F9",
            "link_as_account": "nano_33t5by1653nt196hfwm5q3wq7oxtaix97r7bhox5zn8eratrzoqsny49ftsd",
            "previous": "6CDDA48608C7843A0AC1122BDD46D9E20E21190986B19EAC23E7F33F2E6A6766",
            "representative": "nano_3pczxuorp48td8645bs3m6c3xotxd3idskrenmi65rbrga5zmkemzhwkaznh",
            "signature": "A5DB164F6B81648F914E49CAB533900C389FAAD64FBB24F6902F9261312B29F730D07E9BCCD21D918301419B4E05B181637CF8419ED4DCBF8EF2539EB2467F07",
            "type": "state",
            "work": "000bc55b014e807d",
            "balance_nano": "40200.000001"
        },
        "height": "74",
        "local_timestamp": "0",
        "receive_hash": "0000000000000000000000000000000000000000000000000000000000000000",
        "source_account": "nano_1ipx847tk8o46pwxt5qjdbncjqcbwcc1rrmqnkztrfjy5k7z4imsrata9est",
        "subtype": "receive",
        "successor": "678B9357455396B228325CA5A5CA7237DCC42362693DCAEFA840DEE171596349",
        "balance_nano": "40200.000001",
        "amount_nano": "30000"
    }
  }
}`
        },

        {
          layer: 2,
          action: "find_block", 
          // docs: 'https://docs.nano.to/#checkout',
          // note: ' <a href="" target="_blank" style="color: inherit; text-decoration: underline">Full Docs</a>',
          body: {
            "address": "@bank",
            "amount": "0.00755"
          },
          response: `{
    "block": {
        "type": "receive",
        "account": "nano_1rpc19tpfzuotsk346bt674mehj96ju86n5xiop4o68mepqexf5f55xa7ycx",
        "amount": "0.00755",
        "local_timestamp": "1712536738",
        "height": "5873",
        "hash": "B64C23DD46A05B9774F4812E86463815784CFA37E834ED5F2F77B13A9C6D6254",
        "confirmed": "true",
        "amount_nano": "0.00755",
        "username": "Rpc",
        "amount_raw": "7550000000000000000000000000"
    }
}`,
        'response_two': `{ 
  "block": false, 
  "error": true, 
  "message": "Payment not found." 
}`,
        'response_two_label': `Block Not Found`,
        },

        {
          action: "block_sign",
          note: `You sign blocks locally, using your preferred language. <br><br> Popular Libraries: <a href="https://github.com/numsu/nanocurrency-web-js#installation" target="_blank">@Numsu/NanoCurrency</a>, <a href="https://github.com/fwd/nano-offline#javascript-nano-wallet"  target="_blank">@Nano/Wallet</a> <br><br> All Libraries: <a target="_blank" href="https://hub.nano.org/developer-tools">https://hub.nano.org/developer-tools</a>
  `,
          example: `// NodeJS
  import axios from 'axios'

  import { block } from 'nanocurrency-web'

  const privateKey = '781186FB9EF17DB6E3....C370E4CBB938B1DC71DA3'

  // write it
  const data = {
    // Current balance from account info
    walletBalanceRaw: '5618869000000000000000000000000',
    // Your wallet address
    fromAddress: 'nano_1e5aqegc1jb7qe964u4adzmcezyo6o146zb8hm6dft8tkp79za3sxwjym5rx',
    // The address to send to
    toAddress: 'nano_1q3hqecaw15cjt7thbtxu3pbzr1eihtzzpzxguoc37bj1wc5ffoh7w74gi6p',
    // From account info
    representativeAddress: 'nano_1stofnrxuz3cai7ze75o174bpm7scwj9jn3nxsn8ntzg784jf1gzn1jjdkou',
    // Previous block, from account info
    frontier: '92BA74A7D6DC7557F3EDA95ADC6341D51AC777A0A6FF0688A5C492AB2B2CB40D',
    // The amount to send in RAW
    amountRaw: '2000000000000000000000000000000',
    // Generate work yourself or let Nano.to handle it.
    work: 'fbffed7c73b61367',
  }

  // sign it
  const signedBlock = block.send(data, privateKey)

  // process it
  await axios.post('https://rpc.nano.to', {
    "subtype": "send",
    "block": signedBlock
  })
  `
        }, 

        {
          action: "process",
          // note: `Publish self-signed blocks to Nano blockchain.`,
      body: {
        "action": "process",
        "json_block": "true",
        "subtype": "send",
        "block": {
          "type": "state",
          "account": "nano_1qato4k7z3spc8gq1zyd8xeqfbzsoxwo36a45ozbrxcatut7up8ohyardu1z",
          "previous": "6CDDA48608C7843A...EAC23E7F33F2E6A6766",
          "representative": "nano_3pczxuorp48td8645bs3m6c3xotxd3idskrenmi65rbrga5zmkemzhwkaznh",
          "balance": "40200000001000000000000000000000000",
          "link": "87434F8041869A0...7D7A3FD0CCC2358FD6F9",
          "link_as_account": "nano_33t5by1653nt196hfwm5q3wq7oxtaix97r7bhox5zn8eratrzoqsny49ftsd",
          "signature": "A5DB164F6B81648533900C3...ED4DCBF8EF2539EB2467F07",
          "work": "000bc55b014e807d"
        }
      },
          response: `{
  "hash": "7D27B311666C8...6C8637D277F1FD2ED"
}`
        }, 

        {
          action: "work_generate",
          private: true,
          // offline: true,
          limit: 30,
//           note: `
//   FREE: 10 POW / MIN (<a onclick="window.app.getKey = true" style="color: inherit; text-decoration: underline">Get API Key</a>)<br>
//   PREPAID: Unlimited / MIN (<a onclick="window.app.buyRPC = true" style="color: inherit; text-decoration: underline">Buy RPC</a>)<br>
// `,
  // Community Projects: 30 POW / MIN (<a href="mailto:support@nano.to" style="color: inherit; text-decoration: underline">Contact Us</a>)<br>
          // note: `Nano.to RPC Update<br><br> All GPU systems back to normal. <br><br>  November 6, 2023 @ 6PM US-EAST `,
  //             note: `All GPUs are temporarily unavailable. 
  // <br><br>
  // Update: Tuesday, 7AM US-EAST
  // <br>
  // - 'work_generate' is down
  // <br>
  // - 6 out 6 GPUs offline
  // <br>
  // - ATT Fiber Outage
  // <br>
  // - ATT provides <a target="_blank" href="https://pbs.twimg.com/media/F-QIyvQW0AA1ziQ?format=jpg&name=medium">12 hour fix window</a>.
  // <br><br>
  // Please find <a target="_blank" href="https://nano.casa/public-nodes">alternative</a> PoW source until this is resolved. 
  // `,
          // note: 'All GPU service temporarily unavailable. Please use prepaid API key for an emergency PoW source. <br><br> 11:00 AM US-EAST: We\'ve identified problem and working on a solution.',
          body: { 
            hash: ":FRONTIER",
            key: "RPC-API-KEY"
          },
          response: `{
  "difficulty": "fffffff800000000",
  "multiplier": "1.4403398628545552",
  "work": "4e278d4edc807508",
  "frontier": "7D27B311666C82....6C8637D277F1FD2ED",
  "duration": "0.883s"
  "credits": 9,
  "cached": false,
}`
        }, 
  //           {
  //             action: "work_validate",
  //             body: {
  //               "work": "2bf29ef00786a6bc",
  //               "hash": "718CC2121C3E641059BC1C2CFC45666C99E8AE922F7A807B7D07B62C995D79E2"
  //             },
  //             response: `{
  //   "valid_all": "1",
  //   "valid_receive": "1",
  //   "difficulty": "fffffff93c41ec94",
  //   "multiplier": "1.182623871097636"
  // }`
  //           }, 
        {
          action: "block_count",
          response: `{
  "block_count": "175659188",
  "cemented_count": "175659165",
  "unchecked_count": "23"
}`
        },

  //           {
  //             action: "telemetry",
  //             response: `{
  //     "block_count": "175659188",
  //     "cemented_count": "175659165",
  //     "unchecked_count": "23"
  // }`
  //           },
  //           {
  //             action: "telemetry",
  //             response: `{
  //     "block_count": "175659188",
  //     "cemented_count": "175659165",
  //     "unchecked_count": "23",
  //     "account_count": "31007870",
  //     "bandwidth_cap": "10485760",
  //     "peer_count": "219",
  //     "protocol_version": "19",
  //     "uptime": "3893364",
  //     "genesis_block": "991CF190094C00F0B68E2E5F75F6BEE95A2E0BD93CEAA4A6734DB9F19B728948",
  //     "major_version": "24",
  //     "minor_version": "0",
  //     "patch_version": "0",
  //     "pre_release_version": "0",
  //     "maker": "0",
  //     "timestamp": "1677123849438",
  //     "active_difficulty": "fffffff800000000"
  // }`
  //           }, 
  //           {
  //             layer: 2,
  //             action: "reps_online",
  //             response: `{
  //   "representatives": [
  //     "nano_114nk4rwjctu6n6tr6g6ps61g1w3hdpjxfas4xj1tq6i8jyomc5d858xr1xi"
  //     ...
  //   ]
  // }`
  //           }, 
        {
          action: "account_key",
          body: {
            account: '@faucet'
          },
          response: `{
  "key": "3068BB1CA04525BB0E4...8B6E8DA958A7FA039"
}`
        },  


        {
          layer: 2,
          action: "price",
          // action: "fiat_price",
          body: {
            currency: "EUR"
          },
          response: `{
  "symbol": "xno",
  "currency": "eur",
  "price": 1.019,
  "timestamp": "January 17, 2024 1:36 PM",
  "timestamp_unix": 1705516615,
  "source": "coingecko.com"
}`
        },

        {
          layer: 2,
          action: "reps",
          // body: {},
          response: `[
  {
    "rep_address": "nano_37imps4zk1dfahkqweqa91xpysacb7scqxf3jqhktepeofcxqnpx531b3mnt",
    "donation_address": null,
    "weight": 11.24,
    "weight_nano": 14982239.746242842,
    "uptime": "good",
    "synced": 100,
    "website": null,
    "location": null,
    "alias": "Kraken",
    "username": "Kraken",
    "score": 100,
    "version": "26.1.0.0",
    "protocol": 20,
    "database": ""
  }
  ...
]`
        },

        {
          layer: 2,
          action: "rep_info",
          body: {
            account: "nano_1jtx5p8141zjtukz4msp1x93st7nh475f74odj8673qqm96xczmtcnanos1o"
          },
          response: `{
  "rep_address": "nano_37imps4zk1dfahkqweqa91xpysacb7scqxf3jqhktepeofcxqnpx531b3mnt",
  "donation_address": null,
  "weight": 11.24,
  "weight_nano": 14982239.746242842,
  "uptime": "good",
  "synced": 100,
  "website": null,
  "location": null,
  "alias": "Kraken",
  "username": "Kraken",
  "score": 100,
  "version": "26.1.0.0",
  "protocol": 20,
  "database": ""
}`
        },



        {
          action: "nano_to_raw",
          body: {
            amount: "420.69"
          },
          response: `{
  "raw":"420690000000000000000000000000000"
}`
        },
        {
          action: "raw_to_nano", 
          body: {
            amount: "420690000000000000000000000000000"
          },
          response: `{
  "nano":"420.69"
}`
        },
   
        {
          layer: 2,
          action: "known", 
          docs: 'https://docs.nano.to/#usernames',
          body: {},
          note: '<b>Nano.to</b> is a ~70kb <a href="https://github.com/fwd/nano-to/blob/master/known.json" target="_blank" style="color: inherit; text-decoration: underline">Address Book</a> for Nano. Versioned on <a href="https://github.com/fwd/nano-to" target="_blank" style="color: inherit; text-decoration: underline">Github</a> and hosted by Cloudflare. Names are standardized for API use.',
          response: `[
  {
    "name": "lorem",
    "address": "nano_1bufcw71emxym6er16qjnwd3oer7rw4jxqu4tzi49m4a4wnuer6h335ytco",
    "created": "February 24, 2023",
    "expires": "February 26, 2023",
    "created_unix": 1677276269,
    "expires_unix": 1677431040
  }, 
  {
    "name": "test",
    "address": "nano_1faucet7b6xjyha7m13objpn5ubkquzd6ska8kwopzf1ecbfmn35d1zey3ys",
    "created": "February 19, 2023",
    "expires": "February 21, 2023",
    "created_unix": 1676835957,
    "expires_unix": 1676990700
  }
  ...
]`
        },

//      {
//           layer: 2,
//           action: "aliases", 
//           docs: 'https://docs.nano.to/#usernames',
//           body: {},
//           note: '<b>Aliases</b> are used on <a href="https://nanobrowse.com" target="_blank" style="color: inherit; text-decoration: underline">NanoBrowse.com</a> and <a href="https://nanolooker.com" target="_blank" style="color: inherit; text-decoration: underline">NanoLooker.com</a>. Versioned on <a href="https://github.com/fwd/nano-to/blob/master/aliases.json" target="_blank" style="color: inherit; text-decoration: underline">Github</a> and hosted by Cloudflare. Aliases don\'t expire, can contain spaces, and are <i>not</i> standardized for API use.',
//           response: `[
//   {
//     "account": "nano_1111111111111111111111111111111111111111111111111111hifc8npp",
//     "alias": "Nano Burn Address"
//   },
//   {
//     "account": "nano_13q3fmh7gxy3a3poj63846fzwbjfnq8pbpciymscb4c4dhth5hiu5zhqpts6",
//     "alias": "Another Nano Node"
//   },
//   ...
// ]`
//         },

        {
          layer: 2,
          action: "get_name", 
          body: {
            name: "NanoBull"
          },
          docs: 'https://docs.nano.to/#get_name',
          note: `Register online at <a href="https://nano.to" target="_blank">Nano.to</a>, <a href="https://Nault.pro" target="_blank">Nault.pro</a> and RPC`,
          response: `{
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
}`
        },

        {
          layer: 2,
          action: "update_name", 
          docs: 'https://docs.nano.to/#update_name',
          body: {
            name: "NanoBull",
            // title: "Software Developer",
            // rep_address: "nano_3t6k35gi95xu6tergt6p...xtoncuohr3"
          },
          // note: `Name updates are free. Only the owner may update name.`,
          response: `{
  "address": "nano_37y6iq8m1zx...9jrcwhkmoxpo61f4o",
  "browser": "http://nano.to/pay_f2b27af7",
  "check": "https://api.nano.to/check/f2b27af7",
  "update_name": "@NanoBull",
  "amount": "0.00884"
}`
        },

        {
          layer: 2,
          action: "checkout", 
          docs: 'https://docs.nano.to/#checkout',
          // note: ' <a href="" target="_blank" style="color: inherit; text-decoration: underline">Full Docs</a>',
          body: {
            "title": "Nano Bird Feeder",
            "notify": "steve@apple.com",
            "webhook": "https://example/webhook/secret",
            "address": "YOUR_ADDRESS",
            "amount": "0.133",
            "metadata": {
                "secret": "joe-doe"
            },
          },
          response: `{
  "id": "CHECKOUT_ID",
  "browser": "https://nano.to/CHECKOUT_ID",
  "json": "https://api.nano.to/checkout/CHECKOUT_ID",
  "check": "https://api.nano.to/confirm/CHECKOUT_ID",
  "address": "YOUR_ADDRESS",
  "amount": "0.133",
  "amount_raw": "133000000000000000000000000000",
  "link": "nano:YOUR_ADDRESS?amount=133000047580000000000000000000",
  "qrcode": "data:image/png;base64.."
}`,
        'response_two': `{
  "block": {
      "hash": "786DD3F82BFEAF80A668EB87498531DE114F1A9BB7AF30558B4136AB69F5133E",
      "account": "PAYER_ADDRESS",
      "amount": "0.133",
      "amount_raw": "133000000000000000000000000000"
  },
  "metadata": {
      "secret": "joe-doe"
  },
  "checkout": "https://api.nano.to/checkout/CHECKOUT_ID"
}`
        },

        {
          layer: 2,
          action: "market_data", 
          // body: {},
          // note: 'Get <a onclick="window.app.getKey = true" style="color: inherit; text-decoration: underline">new RPC key</a> or <a onclick="window.app.purchasePow = true" style="color: inherit; text-decoration: underline">add RPC</a> to existing key.',
          response: `{
  "source": "coingecko.com",
  "id": "nano",
  "symbol": "xno",
  "name": "Nano",
  "hashing_algorithm": "Directed Acyclic Graph (DAG)",
  "categories": [
      "Cryptocurrency"
  ],
  "public_notice": "Nano has rebranded to a new ticker $XNO. Read more at: https://medium.com/@nanocurrency/say-hello-to-xno-7ed55e419e3f",
  "links": {
      "homepage": [
          "https://nano.org/en"
      ],
      "blockchain_site": [
          "https://nanolooker.com/"
      ],
      "official_forum_url": [
          "https://medium.com/nanocurrency"
      ],
      "chat_url": [
          "https://discordapp.com/invite/Jph***",
          "https://chat.nano.org/"
      ],
      "announcement_url": [
          "https://nanoticker.info/",
          "https://nault.cc/"
      ],
      "twitter_screen_name": "nano",
      "facebook_username": "nanofoundation",
      "bitcointalk_thread_identifier": null,
      "telegram_channel_identifier": "nanocurrency",
      "subreddit_url": "https://www.reddit.com/r/nanocurrency",
      "repos_url": {
          "github": [
              "https://github.com/nanocurrency/raiblocks"
          ],
          "bitbucket": []
      }
  },
  "image": {
      "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
      "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
      "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
  },
  "sentiment_votes_up_percentage": 60,
  "sentiment_votes_down_percentage": 40,
  "watchlist_portfolio_users": 48007,
  "market_cap_rank": 263,
  "coingecko_rank": 33,
  "coingecko_score": 53.169,
  "developer_score": 86.2,
  "community_score": 45.614,
  "liquidity_score": 38.51,
  "public_interest_score": 0.004,
  "market_data": {
      "current_price": {
          "btc": 0.00002341,
          "usd": 0.704173
          ...
      },
      "total_value_locked": null,
      "mcap_to_tvl_ratio": null,
      "fdv_to_tvl_ratio": null,
      "roi": null,
      "ath": { ... },
      "ath_change_percentage": { ... },
      "ath_date": { ... },
      "atl": { ... },
      "atl_change_percentage": { ... },
      "atl_date": { ... },
      "market_cap": { ... },
      "market_cap_rank": 263,
      "fully_diluted_valuation": { ... },
      "total_volume": { ... },
      "high_24h": { ... },
      "low_24h": { ... },
      "price_change_24h": -0.004395865597632,
      "price_change_percentage_24h": -0.62039,
      "price_change_percentage_7d": 3.88828,
      "price_change_percentage_14d": 3.28418,
      "price_change_percentage_30d": -11.80108,
      "price_change_percentage_60d": -9.46265,
      "price_change_percentage_200d": 1.74205,
      "price_change_percentage_1y": -17.43601,
      "market_cap_change_24h": -529418.1285252,
      "market_cap_change_percentage_24h": -0.56125,
      "price_change_24h_in_currency": { ... },
      "price_change_percentage_1h_in_currency": { ... },
      "price_change_percentage_24h_in_currency": { ... },
      "price_change_percentage_7d_in_currency": { ... },
      "price_change_percentage_14d_in_currency": { ... },
      "price_change_percentage_30d_in_currency": { ... },
      "price_change_percentage_60d_in_currency": { ... },
      "price_change_percentage_200d_in_currency": { ... },
      "price_change_percentage_1y_in_currency": { ... },
      "market_cap_change_24h_in_currency": { ... },
      "market_cap_change_percentage_24h_in_currency": { ... },
      "total_supply": 133248290,
      "max_supply": 133248290,
      "circulating_supply": 133248290,
      "last_updated": "2023-07-06T14:41:51.470Z"
  },
  "public_interest_stats": {
      "alexa_rank": 313412,
      "bing_matches": null
  },
  "status_updates": [
      {
          "description": "In the lead up to Follis V23, get up to speed with the software improvements that will allow for faster and more stable development.\r\n\r\nFeatures include:\r\n🔹 Node initialisation parameter redesign\r\n🔹 Ledger constraints\r\n🔹 New naming conventions\r\n🔹 Updated integration docs\r\n\r\nhttps://blog.nano.org/v23-0-follis-development-update-55ef8c41cbb",
          "category": "general",
          "created_at": "2021-10-04T20:45:57.611Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "The latest Nano Digest has hit the timeline.\r\nJoin us for a round-up of everything new in the NANO ecosystem.\r\n\r\nhttps://blog.nano.org/nano-digest-cyberfirst-cryptouk-coincloud-dcm-nowpayments-pos-nano-community-program-and-a86bacb45133 ",
          "category": "general",
          "created_at": "2021-10-02T18:26:04.434Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "It is with great pride that we announce our support for Cyber First, an educational programme created by the National Cyber Security Centre to develop the UK's next generation of cyber professionals by helping young people aged 11-17 in the UK explore their passion for tech.\r\n\r\nFind out more about Cyber First here: https://www.ncsc.gov.uk/cyberfirst/overview\r\n",
          "category": "general",
          "created_at": "2021-10-01T10:27:55.398Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "1 HOUR TO GO until the Fintech & FS Group: Communicating crypto in 2021 event!\r\n\r\nCheck out the impressive lineup of speakers including George Coxon of Nano Foundation, Roopa Ramaiya of Luno, Elliott Suthers of Coinbase, Christian Williams of Crypto Briefing, Samantha Yap of YAP Global Ltd.\r\n\r\nHosted by the PRCA.\r\n\r\nREGISTER HERE: https://www.prca.org.uk/event/4944/communicating-crypto-in-2021%3A-how-to-talk-crypto-without-alienating-traditional-financial-audiences",
          "category": "general",
          "created_at": "2021-09-09T13:39:22.682Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "You can now buy and sell NANO with INR & USDT on Indian exchange Koinbazar\r\n\r\nhttps://www.koinbazar.com/blog/buy-sell-trade-nano-on-koinbazar",
          "category": "general",
          "created_at": "2021-08-16T15:50:16.901Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "That's right, your Friday just got a whole lot better! \r\nThe latest Nano Digest just dropped. Join us as we catch up on everything new in the Nano ecosystem.\r\n\r\nhttps://medium.com/nanocurrency/nano-digest-nano-on-airtm-p2p-new-partnerships-team-updates-media-moments-charitable-252b42ea44a7\r\n",
          "category": "general",
          "created_at": "2021-07-16T16:26:50.772Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      },
      {
          "description": "Great news Argentina & Venezuela! NANO is now available on the Airtm P2P Marketplace!\r\n\r\nhttps://medium.com/nanocurrency/nano-is-now-available-on-airtm-p2p-marketplace-28ad9acfc856",
          "category": "general",
          "created_at": "2021-07-08T16:41:33.669Z",
          "user": "Naome Jones",
          "user_title": "Communications Manager",
          "pin": false,
          "project": {
              "type": "Coin",
              "id": "nano",
              "name": "Nano",
              "symbol": "xno",
              "image": {
                  "thumb": "https://assets.coingecko.com/coins/images/756/thumb/nano.png?1637232468",
                  "small": "https://assets.coingecko.com/coins/images/756/small/nano.png?1637232468",
                  "large": "https://assets.coingecko.com/coins/images/756/large/nano.png?1637232468"
              }
          }
      }
  ],
  "last_updated": "2023-07-06T14:41:51.470Z"
}`
        },

        // {
        //   layer: 2,
        //   action: "rpc_key", 
        //   body: {
        //     email: "VALID_EMAIL",
        //     // key: "OR_EXISTING_KEY",
        //   },
        //   note: 'Get <a onclick="window.app.getKey = true" style="color: inherit; text-decoration: underline">new RPC key</a> or <a onclick="window.app.purchasePow = true" style="color: inherit; text-decoration: underline">add RPC</a> to existing key.',
        //   response: `{ "key": "API-53206E3B1838B426EB44D16C13E7936D" } `
        // },


  //           {
  //             layer: 2,
  //             action: "nano_quote", 
  //             // url: true,
  //             note: 'Crypto swap estimte service by <a href="https://simpleswap.io/?ref=ecc1985b556a" target="_blank">SimpleSwap</a>.',
  //             body: {
  //               "amount": 100,
  //               "from": "nano",
  //               "to": "usdt"
  //             },
  //             response: `{
  //     "estimate": "72.29899"
  // }`
  //           },

//         {
//           layer: 2,
//           action: "nano_swap", 
//           // url: true,
//           note: 'Crypto swap service by <a href="https://simpleswap.io/?ref=ecc1985b556a" target="_blank">SimpleSwap</a>.',
//           body: {
//             "amount": 100,
//             "from": "nano",
//             "to": "usdt",
//             "address": "YOUR_USDT_ADDRESS",
//             "refund_address": "@Bank",
//           },
//           response: `{
//   "send": 100,
//   "receive": "72.29899 USDT",
//   "simple_swap_address": "nano_3x1w775zr7jbstorwky...qn7skcf3tinpajz",
//   "refund_address": "@Bank",
//   "status": "waiting"
// }`
//         },


//         {
//           layer: 2,
//           private: true,
//           action: "nano_ai",
//           note: `Highly Available AI Models for Nano Ecosystems
//           <br><br> LLAMA-7B = FREE 
//           <br> GPT3.5 = 1 Credit
//           <br> GPT4 = 2 Credit
//           <br> DALLE-2.5 = 1 Credit<br><br>
//           <a onclick="window.app.buyRPC = true" style="color: inherit; text-decoration: underline">Buy RPC Credits w/ Nano</a>`,
          
//           body: { 
//             // action: '',
//             model: 'llama2-7b',
//             prompt: 'What is Nano currency',
//             // key: 'YOUR_API_KEY', 
//           },
//           response: `{
//   "model": "model_name",
//   "response": "text_response"
// }`
//         },

//         {

//           docs: 'https://docs.nano.to/#cloud',
          
//           action: "cloud_wallet",

//           private: true,

//           note: `Encrypted cloud wallets for rapid development.
//   <a style="margin-top: 25px;display: block;" href="https://docs.nano.to/#cloud-wallets" target="_blank">Read Documentation</a>
//           `,

//           body: {
//             "refund_address": "YOUR_ADDRESS_OR_USERNAME",
//             "vanity": "1temp",
//             "key": 'WALLET-API-KEY', 
//           },

//           response: `{
//   "balance": 0,
//   "address": "nano_1temp11h63w5357rm79to1ke63wn5h6wu8bf35iyj4i7y6pqs84jk4ydyoioy",
// }`
//         },

            {
              action: "nano_email",

              note: `<div style=" font-size: 24px; margin-bottom: 10px">Send Nano To Any Email</div> If not claimed within 90 days, funds are sent to refund_address.`,
              body: {
                "refund_address": "@bank",
                "amount": "5",
                "from": "",
                "message": "",
                "email_receipt": "",
                "expiration": "7 Days",
                "emails": ["steve@apple.com"]
              },
              response: `{
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
}`
            },

        {
          layer: 2,
          action: "buy_rpc", 
          body: {
            email: "your_account_email",
            key: "RPC-API-KEY",
          },
          // note: 'Get <a onclick="window.app.getKey = true" style="color: inherit; text-decoration: underline">new RPC key</a> or <a onclick="window.app.purchasePow = true" style="color: inherit; text-decoration: underline">add RPC</a> to existing key.',
          response: `{
  "id": "4c89c2c5",
  "browser": "https://nano.to/id_4c89c2c5",
  "json": "https://api.nano.to/checkout/4c89c2c5",
  "check": "https://api.nano.to/check/4c89c2c5",
  "plans": [
      {
          "title": "1,000 GPU Credits",
          "value": "0.203259",
          "discount": false,
          "value_raw": "203259000000000000000000000000"
      },
      {
          "title": "10,000 GPU Credits",
          "value": "2.03309",
          "discount": false,
          "value_raw": "2033090000000000000000000000000"
      },
      {
          "title": "20,000 GPU Credits",
          "value": "4.06457",
          "discount": false,
          "value_raw": "4064570000000000000000000000000"
      },
      ...
  ]
}`
        },


        {
          layer: 2,
          action: "rpc_credits", 
          body: {
            key: "RPC-API-KEY",
          },
          response: `{
  "credits": 91813,
  "usage": {
    "2024-09-08": {
      "receivable": 1,
      "account_info": 7,
      "work_generate": 9,
      "process": 4,
      "rpc_credits": 2
    }
    ...
  }
}`
        },

    ]


var markdown = `- title: Nano Node RPC
-----`

for (var action of json) {
	markdown += `
## ${action.action}

::: code-group-open

\`\`\`bash
${languages.curlExample(action)}
\`\`\`

\`\`\`js
${languages.nodeExample(action)}
\`\`\`

\`\`\`python
${languages.pythonExample(action)}
\`\`\`

\`\`\`rust
${languages.rustExample(action)}
\`\`\`

\`\`\`ruby
${languages.railsExample(action)}
\`\`\`

\`\`\`php
${languages.phpExample(action)}
\`\`\`

\`\`\`dart
${languages.flutterExample(action)}
\`\`\`

\`\`\`go
${languages.golangExample(action)}
\`\`\`

\`\`\`c
${languages.csharpExample(action)}
\`\`\`

\`\`\`x86asm
${languages.assemblyExample(action)}
\`\`\`

::: code-group-close

\`\`\`json
${action.response}
\`\`\`

	`
}

server.write('../articles/nano-rpc.md', markdown)