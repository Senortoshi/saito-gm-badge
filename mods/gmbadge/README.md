# gm cube — a Saito module

**You say gm. A cube shows up next to your name. You say gm tomorrow or it goes away.**

The number beside the cube is consecutive days. Miss a day and it is off; the next gm starts at 1.
Nothing is minted, held or sent. The node never sends a transaction and its wallet can be empty.

## What it does

- **Indexes** every confirmed Red Square post and records one gm per public key per UTC day, dated by **block time**.
- **Counts** consecutive days. The cube is on while the last gm was today or yesterday (UTC).
- **Records** the block id of each key's first gm. That is earliness; there are no serials.
- **Draws** the cube and the day count beside names by wrapping `app.browser.returnAddressHTML`: the returned `.saito-address` gets `data-gm` and `data-gm-n`, and one stylesheet draws them as its `::after`. No MutationObserver.
- **Shows** `/gmbadge`: days in a row, longest run, total gms, block of the first gm, and the cube large.

## Layout

```
gmbadge.js                 module main (indexer, peer + HTTP API, browser glue)
lib/streaks.js             pure streak rules (tested)
lib/badge-svg.js           the cube: nameplate and full detail (tested)
lib/p2p-index.js           fallback: read streaks from the Archive when no index node is around
lib/ui/badge-decorator.js  returnAddressHTML wrap + the ::after stylesheet
lib/ui/gmbadge-main.js     the /gmbadge page
sql/*.sql                  gms and streaks tables (SQLite on the node)
web/                       index.html + css (compiled into /gmbadge/style.css)
../tests/gmbadge/streaks.test.js   node --test
```

## Install into a Saito node

```bash
# from saito/node
# link or copy this folder to mods/gmbadge, then register it:
#   config/modules.config.js -> add 'gmbadge/gmbadge.js' to both core and lite
bash scripts/compile nuke      # or: npm run nuke
npm run dev
# open http://localhost:12101/gmbadge
```

Upgrading a node that ran an earlier version: the `streaks` table changed (`serial`, `badge_sig`,
`badge_id`, `minted` are gone; `first_block` is new) and the `milestones` table is no longer used.
Delete the module's database file and let it re-index, or
`ALTER TABLE streaks ADD COLUMN first_block INTEGER`.

## Where the cube shows

| Surface | through `returnAddressHTML` today | cube |
|---|---|---|
| Chat messages + sidebar, Arcade, League, game playerboxes, `SaitoUser` | yes | yes |
| Red Square tweet headers | no (hand-written span) | after [`redsquare-tweet-header.patch`](../../docs/upstream/redsquare-tweet-header.patch) |
| Red Square notifications and profile name | no (hand-written) | not covered; same fix would apply |

## Index vs p2p

| | index node | p2p fallback |
|---|---|---|
| gm dated by | block timestamp | sender-signed tx timestamp, checked against block order |
| history | everything since the node started indexing | what the archive still holds: Red Square posts are pruned after ~347 days |
| whose cubes it draws | every key with a live streak | your own, and anyone you open on /gmbadge |
| archive load | none | one lookup (max 12 pages of 100 posts) per key you open |

Wallets use the index when a node advertises the `gmbadge` service and fall back to p2p otherwise.
`/gmbadge` says which one the numbers came from.

## HTTP API

- `GET /gmbadge/api/streak/:publickey` returns `{ today, state, view }`

## Peer API (handlePeerTransaction)

- `gmbadge: streak` with `{ publickey }`
- `gmbadge: states`: every key whose cube is on (up to `max_states`), used to draw names

## Rules

- A post counts if, after stripping leading emoji/punctuation, it starts with the word `gm` (any case). `GM`, `gm fam`, `gm ☀️` count. `gmgm`, `good morning`, `say gm` do not.
- Days are UTC. One gm per public key per day.
- The cube only ever shows on the key that posted the gms.
