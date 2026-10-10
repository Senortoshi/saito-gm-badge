# gm badge — design decisions (2026-10-10)

Project: a Twetch-green-inspired verified badge on Saito, earned only by saying "gm" in Red Square daily.
Source lives at `Desktop/saitonfts/gmbadge/` and is junction-linked into `saitonfts/saito/node/mods/gmbadge/`.

## The twist beyond Twetch
Twetch never had a streak mechanic. Its status came from low account numbers and NFT-PFP ownership proof.
We keep both lessons (sequential serials, on-chain proof) and add what only Saito can do:
- the badge is a consensus-level NFT (3-slip Bound tuple, type `gm`) that pays its own ATR rent from a 1 SAITO deposit;
- its look is recomputed from on-chain Red Square posts, so tiers cannot be faked by screenshot;
- it is drawn next to the holder's name in every Saito app because the apps share one `.saito-user` component;
- it cracks when a day is missed, and restarts; lifetime gms never reset.

## Rules (defaults chosen, user can override)
- "gm" counts when the post, after stripping leading emoji/punctuation, starts with `gm` as a word (any case).
- Days are UTC. One gm per public key per day.
- Tiers: Sprout 1, Green Check 7, Gold Ring 30, Diamond 100, Flame 365.
- Missed day: cracked for 24h (gap == 2), dormant after (gap > 2).

## Architecture
- Node: `shouldAffixCallbackToModule('RedSquare')` → `onConfirmation` sees every Red Square tx → `INSERT OR IGNORE` into `gms` → streak upsert → first gm mints badge via `app.wallet.createMintNFTTransaction(1n, deposit, txmsg, 0n, holder, 'gm')`.
- Peer service `gmbadge`; browser pulls top 2000 states via `sendRequestAsTransaction('gmbadge: states')` and decorates with a MutationObserver.
- HTTP: `/gmbadge/api/streak/:pk`, `/gmbadge/api/leaderboard`, `/gmbadge/api/badge/:pk.svg`.
- Wallet card: `respondTo('saito-nft-media')` with class `['gm']` renders the live badge.
- Mint message carries a small inline SVG `image` so wallets without the module still show something.

## Known gaps / next
- Milestone trophies (7/30/100/365) are recorded in `milestones` but not minted yet.
- Streak freeze (one per month, paid in SAITO) not built.
- Perks (Vault drop, Stack feed, raffle) not built.
- No reorg handling (`onChainReorganization`) in v1.
- Node requires a funded issuer wallet; `config.mint=false` disables minting.
- Windows: Saito build scripts are bash; run `bash scripts/compile nuke` from Git Bash, not `npm run nuke`.

## Verified 2026-10-10 on a local dev chain
- Posted "gm" from a browser wallet -> node indexed it in block 7 -> streak 1, serial 1 -> badge NFT (type `gm`, Bound tx) minted by the node wallet and confirmed -> appeared in the browser wallet's NFT list; /gmbadge page showed "Sprout - badge #1".
- Gotcha: `onConfirmation(blk, tx, conf)` receives `conf` as a BigInt on the node. `conf !== 0` is always true for `0n`. Use `Number(conf) !== 0`.
- Gotcha: Node resolves `require` through junctions to the real path, so a module's real folder must live inside `saito/node/mods/`; link outward from the project, not inward.
- Gotcha: any file inside a module dir can be swept into the webpack bundle; keep tests outside `mods/`.
- Gotcha: the upstream `.template.modules.config.js` omits `league`, which `arcade` requires; add `league/league.js` to both lists or the bundle silently produces a 1 KB stub.
- Local dev: copy `data/issuance/issuance.localdev` to `data/issuance/issuance`, create empty `issuance/default` and `issuance/earlybirds`, set `consensus.disable_block_production=false` and social stakes to 0 in `config/options`, put a localdev key in `options.wallet`. Funded localdev keys: `scripts/nettest/scenarios/base/1/data/issuance/issuance.keys`.
- Art direction (user, 2026-10-10): "start plain and go 3D" like the Twetch green badge. Tiers 1-2 flat; 3 = shaded seal + metallic gold ring + drop shadow; 4 = glass with specular highlight and facets; 5 = embossed ember with glow. Preview at /gmbadge/preview.html.
- Recompile the browser bundle with `bash scripts/compile recompile dev` (NOT `nuke`, which wipes the local chain).

## Shipped 2026-10-10
- Security layer: wallets verify slip1 creator == issuer key (announced in `gmbadge: states` responses) and mint serial == index; mismatch renders COUNTERFEIT. Inline badges draw from the index only. Art embeds Saito-cube micro matrix, micro-text ring, micro-printed serial `gm-<serial>-<issuer8>-<sig8>`.
- Art: 8-lobe seal, teal->green gradient, dark check (classic green verification look); tiers 1-2 flat, 3 gold metallic, 4 glass, 5 embossed ember with glow. Preview: /gmbadge/preview.html.
- Upstream PR: https://github.com/SaitoTech/saito/pull/719 (branch `gmbadge` on fork github.com/Senortoshi/saito, base `master`).
- To reach saito.io users the Saito team must merge AND run the module on their nodes (the node wallet is the issuer). Alternative: run our own public node per `mods/gmbadge/DEPLOY.md` (needs a VPS + domain; not provisioned yet).
- Still open: milestone trophies, streak freeze, perks, reorg handling, mainnet fee/rent measurement on staging.saito.io.
