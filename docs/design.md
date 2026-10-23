# gm cube — design notes

Product and scope live in [`PRD.md`](PRD.md). This file is how it is built and what was checked
against the Saito source (SaitoTech/saito at 942afcbd, 2026-07-27).

## Data
- Node: `shouldAffixCallbackToModule('RedSquare')` → `onConfirmation` sees every Red Square tx → if the text passes `Streaks.isGm`, `INSERT OR IGNORE` into `gms` (unique per key per UTC day, dated by `blk.timestamp`) → `Streaks.applyGm(state, day, blk.id)` → upsert `streaks`.
- `applyGm` records `first_block` on the first gm only. Earliness is that block id.
- `Streaks.view(state, today)` is the whole feed contract: `on` (last gm today or yesterday, UTC) and `streak` (consecutive days). Longest, total and first block are page trivia.
- The node never creates a transaction. Peer API (`gmbadge: states`, `gmbadge: streak`) and `GET /gmbadge/api/streak/:publickey` are read-only.

## Drawing
- `BadgeDecorator` wraps `app.browser.returnAddressHTML` (keeps the previous function, calls through, restores on `stop()`) and adds `data-gm="on" data-gm-n="<days>" title` to the returned `.saito-address`.
- One stylesheet draws the cube and number as `::after`: a single 18px data-URI background plus `content: attr(data-gm-n)`. Inline-block on the text baseline so the number sits on the name's baseline.
- Not a child: core rewrites names with `innerText` (`browser.treatIdentifiers`, `updateAddressHTML`). Not a sibling: `.saito-user` is a CSS grid. Attributes survive both.
- When streak data arrives, `update(keys)` re-stamps names already on screen in one pass. No MutationObserver, no IntersectionObserver, no animation.

## Art
One object, two levels of detail (`lib/badge-svg.js`), lit by one key light from the upper left:
- Machined bevel as six chamfer facets, each shaded by its real angle to the light (with a little sheen along its length). Dark enamel band under a clearcoat softbox reflection. A recessed well whose walls are lit on the far side, as a real recess is. The Saito cube stands on the well floor with ambient occlusion under it; top face takes the key light, left the fill, right is in shade. Specular glints on the cube and the bevel, a two-layer contact shadow.
- Nameplate (< 48px): facets, well and three solid faces only. No grain, microprint, folds or filters; nothing carries shape with a hairline stroke.
- Full (>= 48px): brushed-metal grain on the bevel, a cool rim light on the shadow-side edges, cube edge bevels, the impossible-cube folds as engraved grooves, and a security layer that only resolves when zoomed:
  - a guilloché rosette engraved in the well floor, its curves seeded by `hash(publickey | first_block)`, so every holder's cube is fingerprinted (same holder, same engraving);
  - a microtext ring around the enamel: `GM · SAITO · <key fragment> · FIRST GM BLOCK <n>`;
  - nanotext `gm` inside the cube's top face.
- Same art at every streak length; `render()` takes `size`, `on`, `block`, `publickey`, `title`. `on: false` (page only) is the same pin, unlit.
- The security layer is not a token and proves nothing on its own: the streak is always recomputed from posts. It makes a screenshot of someone else's cube recognisably theirs and hard to pass off.
- Checked by screenshot in headless Chrome at 18px on light and dark rows and at 300px and 1400px.

## Index vs p2p
- Index is the source of truth: block time, every live streak sent in bulk.
- p2p (no index node): reads the Archive directly (`sendRequestAsTransaction('archive', { request: 'load' })`), because `storage.loadTransactions` drops the row's `block_id`. Days come from `tx.timestamp`, which consensus does not check; `Streaks.inBlockOrder` drops any gm dated earlier than one that confirmed before it. States are labelled `time_source: 'tx'` and `/gmbadge` says so.
- The Archive deletes Red Square rows after ~347 days (`archive.js`: `field1 = 'RedSquare' and updated_at < now - 50 * prune_public_ts`), so archive-only history cannot prove a run longer than that.
- p2p only looks up your own key and keys opened on `/gmbadge` (max 12 pages of 100 posts each). Names drawn around the app never trigger archive reads.
- Asks for Saito core (not implemented here): keep `block_id` through `loadTransactions`; persist `blk.timestamp` from the archive's `onConfirmation`.

## Red Square
Red Square tweet headers print `<span class="primary saito-address">${name}</span>` with no `data-id`, so they never reach `returnAddressHTML`. `docs/upstream/redsquare-tweet-header.patch` routes them through it, adding an optional `extra_classes` argument so `primary` survives. The header is a flex container, so the helper's `<div>` lays out like the `<span>`. It is a separate upstream PR, not part of this module. Notifications and the profile name are hand-written too and would need the same treatment.

## Gotchas (verified on a local dev chain, 2026-10-10)
- `onConfirmation(blk, tx, conf)` receives `conf` as a BigInt on the node. Use `Number(conf) !== 0`.
- Node resolves `require` through junctions to the real path; a module's real folder must live inside `saito/node/mods/`.
- Any file inside a module dir can be swept into the webpack bundle; keep tests outside `mods/`.
- The upstream `.template.modules.config.js` omits `league`, which `arcade` requires; add `league/league.js` to both lists or the bundle silently produces a 1 KB stub.
- Windows: Saito build scripts are bash; run `bash scripts/compile nuke` from Git Bash. Recompile the browser bundle with `bash scripts/compile recompile dev` (`nuke` wipes the local chain).
- `.saito` app bundles are built with `node scripts/dynmods/compile.js --zip <zip> --slug gmbadge` (zip of `mods/gmbadge` without `web/`).

## History
- 2026-10-10/11: first version minted a `gm` NFT per holder with a 1 SAITO deposit, six ranks, animated rims.
- 2026-10-22: review on SaitoTech/saito#719 (saito.io holds no balance; deposit could be farmed and swept; body-wide observer too aggressive; tradeability) → dropped the NFT, issuer and serials, moved to `returnAddressHTML`. Then cut to the PRD: one cube, on or off, the number is days in a row; ranks, cracked/dormant looks, rims, animation budget, milestones, leaderboard and the say-gm button removed.
