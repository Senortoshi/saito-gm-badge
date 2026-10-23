# Running the gm cube index on a public Saito node

The browser side of this module works in any wallet that bundles it. The streak index runs on a
node. That node only reads blocks and answers queries: it holds no SAITO, mints nothing and sends no
transactions, so its wallet can be empty.

## 1. Node

Ubuntu 24.04, Node 20+, 4 GB RAM, a domain with TLS (NGINX + certbot, websocket + CORS forwarded).

```bash
git clone https://github.com/SaitoTech/saito && cd saito/node
npm install
# add 'gmbadge/gmbadge.js' and 'league/league.js' to BOTH lists in config/modules.config.js
bash scripts/compile nuke
```

## 2. Mainnet peers

In `config/options` set the server endpoint to your public host, and peer to mainnet:

```json
"peers": [
  { "host": "eames.saito.io", "port": 443, "protocol": "https", "synctype": "lite" },
  { "host": "arthur.saito.io", "port": 443, "protocol": "https", "synctype": "lite" }
]
```

Optional settings:

```json
"gmbadge": { "max_states": 2000 }
```

`max_states` caps how many live streaks a wallet pulls at once for drawing cubes beside names.

What it costs the node:
- one indexed SQLite insert per gm (at most one per key per UTC day), plus one row upsert;
- `onConfirmation` sees every Red Square tx but only parses ones whose text starts with `gm`;
- each connected wallet asks for every live streak (up to `max_states`) once on connect and every
  5 minutes, read-only;
- no transactions, no balance, no keys at risk.

## 3. History

The index only knows gms from blocks it has processed. Start it early: Red Square posts are pruned
from archives after roughly 347 days, so a streak older than what your node has seen cannot be
rebuilt later from an archive.

## 4. Start

```bash
npm run dev          # or scripts/prompt-start for production
# https://your.host/gmbadge
```

## 5. What users need

- A wallet that includes this module (a saito.io release that bundles it, or your node's own wallet).
- To say **gm** in Red Square once per UTC day. Nothing else: no mint, no fee beyond the post itself.

## 6. Checking a streak by hand

```
GET https://your.host/gmbadge/api/streak/<publickey>   -> streak, longest, lifetime, first_block
```

Every gm the index counted is a signed Red Square transaction in the block it names. Anyone running
their own index, or reading an archive, gets the same streak from the same posts.
