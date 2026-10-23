Thanks Robert, all four points land. We cut it way down.

**How it works now.** You say gm in Red Square. A cube shows up next to your name, with the number of days in a row. Say gm tomorrow or it goes away; the next gm starts at 1. That's the whole product. No NFT, no ranks.

**Balance / drain.** Gone. Nothing is minted, there's no deposit, nothing to dissolve or sweep. The module only indexes confirmed Red Square gm posts (dated by block time) and never sends a transaction, so saito.io can run it with an empty wallet. Cost to the node: one SQLite insert per gm (max one per key per UTC day). Each connected wallet also pulls the list of keys whose cube is on, at connect and every 5 min, read-only.

**Observer.** Gone. We wrap `browser.returnAddressHTML` (call through to the previous one) and add `data-gm` + the day count to the returned `.saito-address`. One stylesheet draws the cube and number as `::after`, so `treatIdentifiers` rewriting the name and the `.saito-user` grid both leave it alone. No DOM scanning.

**Trading / whose streak.** There's no token, so nothing to trade or send. A cube only ever shows on the key that posted the gms.

**Who runs the index is your call.** Without an index node, wallets fall back to reading the Archive, but only for their own key and anyone opened on /gmbadge, never for every name on screen.

**One ask, as its own PR.** Red Square tweet headers print the author name directly, so they never hit `returnAddressHTML`. This patch routes them through it, with an optional `extra_classes` arg so `primary` survives: `docs/upstream/redsquare-tweet-header.patch`. The visible name doesn't change, since it already comes from `keychain.returnUsername`. Notifications and the profile name are hand-written the same way, if you want those too.

Two things we noticed while digging, in case they're useful:
- `storage.loadTransactions` drops the archive row's `block_id`.
- Red Square posts are pruned from archives at ~347 days.

If the archive kept `block_id` and the block timestamp it sees in `onConfirmation`, wallets could verify streaks without trusting `tx.timestamp`.
