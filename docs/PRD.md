# PRD: gm badge

If you cannot explain this to your grandma, we failed.

**You say gm. A cube shows up next to your name. You say gm tomorrow or it goes away.**

---

## Press release

Saito — Say gm. A cube appears next to your name.

Post `gm` in Red Square. After the block confirms, a Saito cube sits beside your name in Red Square, Chat, Arcade, and profiles. A number next to it is how many days in a row. Miss a day and the cube is gone until you say gm again.

There is nothing to buy, mint, or send. The cube is not an NFT. saito.io does not hold SAITO for this. Anyone can check the same posts on chain.

The cube is original Saito, finished like a real object: one silhouette, light on it, readable next to a name. It is not someone else’s badge.

---

## Grandma test (kill criteria)

Say the product in one breath. If a rank name, a rarity, a cracked state, or an NFT is required to explain it, cut that.

| Pass | Fail |
|---|---|
| “Say gm every day and a cube stays by your name.” | “You earn Rare Merkle at day 30.” |
| “Miss a day and it goes away.” | “It cracks for 24 hours, then goes dormant.” |
| “The number is how many days in a row.” | “Legendary Golden Ticket has a living gold rim.” |

---

## Appetite

Small. Cut the current module down. Do not add a token, an issuer, or a rank ladder.

---

## What it is

One badge. One look. On or off.

- **On** after the first qualifying `gm` post, while the streak is alive (posted today or yesterday, UTC).
- **Off** if you miss a day. Next `gm` starts the count at 1.
- **Number** beside the cube = consecutive days. Not a rank name.
- **`/gmbadge`** (click the name / open the page): days in a row, longest run, total gms, block of first gm. Trivia. Not the feed.

The on-chain object is the Red Square transaction. The cube is a view of that history.

---

## What it is not

- Not an NFT. Nothing is minted, deposited, dissolved, traded, or swept.
- Not funded by saito.io. The node only indexes. Wallet stays empty.
- Not a Twetch check, not an 8-lobe seal, not “verified green.”
- Not six ranks, not Common → Exotic, not cracked vs dormant looks, not animated rims.
- Not simulated data. Only real confirmed Red Square `gm` posts.

---

## Rules

- A post counts if, after stripping leading emoji/punctuation, it starts with the word `gm` (any case). `GM`, `gm fam`, `gm ☀️` count. `gmgm`, `good morning` do not.
- Days are UTC. One gm per public key per day.
- The index dates a gm by **block time**, not `tx.timestamp` (sender-set, not consensus).
- Earliness is the **block id of the first gm**, not a serial a node hands out.
- The cube only ever shows on the key that posted the gms.

---

## How it is drawn

Wrap `app.browser.returnAddressHTML`. Stamp `data-gm` (and the streak number) on the returned `.saito-address`. A stylesheet draws the cube as `::after`.

Why not a child or sibling: core rewrites the name with `innerText` (`treatIdentifiers` / `updateAddressHTML`); `.saito-user` is a CSS grid.

No MutationObserver on `document.body`.

**Upstream (own PR):** Red Square tweet headers still print the author name as a raw span. Route them through `returnAddressHTML`, with an optional `extra_classes` so `primary` survives. Patch: `docs/upstream/redsquare-tweet-header.patch`. Watch `span` → `div` in compact headers.

Art: original Saito hex + cube, enamel-pin quality (bevel, inner well, one key light, readable at 18px). Same object at every streak length. If the cube’s extra folds fail at 18px, simplify the nameplate glyph to three faces; keep detail on `/gmbadge`.

---

## Index vs archive

| Mode | Who | Trust |
|---|---|---|
| **Index** (saito.io or any node running the module) | SQLite of gm posts, block time, empty wallet | Source of truth for the feed |
| **p2p fallback** | Wallet reads Archive | Weaker until Archive returns block time; Red Square rows are pruned (`50 × prune_public_ts`) |

“Anyone can recompute” means: from an archive that still has the posts, or from a node that indexed them.

Asks for Saito core (not this module):

1. Archive load should keep `block_id` (today `storage.loadTransactions` drops the row).
2. Archive should persist `blk.timestamp` from `onConfirmation` (today `created_at` is `tx.timestamp`).

Until those land, p2p states are labelled as dated from the tx, and `/gmbadge` says so.

---

## User stories

**US-001 — First gm**  
Given I have never posted `gm`, when my `gm` confirms on Red Square, then the cube appears next to my name and the number is 1.

**US-002 — Keep going**  
Given I posted yesterday, when I post `gm` today, then the cube stays and the number goes up by 1.

**US-003 — Miss a day**  
Given I did not post yesterday or today, then no cube shows next to my name. My next `gm` shows the cube with 1.

**US-004 — Whose cube**  
Given I can see Alice’s name, then I see Alice’s cube only if Alice’s key posted the gms. There is nothing to send me that would put her cube on my name.

**US-005 — Empty node**  
Given saito.io runs this module with no SAITO in the node wallet, then indexing and drawing still work. The node never sends a transaction.

**US-006 — Check the page**  
Given I open `/gmbadge` for a key, then I see consecutive days, longest run, total gms, and the block of the first gm, all from confirmed posts.

---

## Done when

- Grandma sentence is true in the UI. No rank names anywhere in the feed.
- No mint path, no NFT type, no deposit, no issuer key.
- Names go through `returnAddressHTML` + `::after`. No body MutationObserver.
- Missed day → cube off. Number is consecutive days only.
- Unit tests cover `gm` detection, UTC day, consecutive vs break, first-gm block.
- Tweet-header change is a separate upstream PR, not buried in this module.

---

## Rabbit holes (do not enter)

- Milestone trophies, streak freeze, perks, raffles.
- Living rims / animation budgets.
- Soulbound / P2SH / tradable anything.
- A new `gm` transaction type. Red Square posts are enough.
- Reproducing Twetch’s seal or check.
