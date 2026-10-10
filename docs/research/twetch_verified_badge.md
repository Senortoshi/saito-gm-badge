# Twetch "Green Verified Badge" and Twetch Status Mechanics (BSV social network, 2019-2024, relaunched 2026)

Research date: 2026-10-10. Scope note: the assignment framed Twetch as 2019-2023; sourced reporting shows it ran publicly from a private beta in late May 2019 until an abrupt shutdown on June 5-6, 2024, and returned as an invite-only beta in July 2026. All dates below are from the cited sources.

IMPORTANT HEADLINE FINDING: After ~13 rounds of searching (CoinGeek, CoinDesk, Cointelegraph, Nanopay/Isaac Morehouse, Chris Hughes' guide, the Twetch blog via Wayback, the archived twetch.com/features page and its Next.js data payloads, the reverse-engineered "Twonks" NFT protocol repo, and multiple query phrasings including "green check", "verified badge", "checkmark", "verified users"), I found NO reliable source that documents a "green verified badge" on Twetch: no price, no launch date, no mechanism, no visual description. The only "verification" feature any source confirms is automatic verification of NFT profile-picture ownership (Dec 2022). Everything about a green checkmark specifically must be treated as unsourced. The report-writer should not state that Twetch sold a green verified badge unless the parent effort has a primary source (a Twetch tweet, screenshot, or user testimony) that I could not reach. Details are in the Gaps of Q1-Q4.

---

## Q1. What exactly was the Twetch green verified badge, when was it introduced, how did a user get it, and what did it cost?

### Takeaway
No source found describes a Twetch green verified badge. What IS documented is that Twetch sold small paid "features" from day one via a "You buy it, we build it" feature store (Dark Mode $1, Tweet from Twetch $1 in Aug 2019), that it later offered automatic NFT-profile-picture ownership verification (Dec 2022), and that account numbers and NFT collectibles were the platform's real status signals.

### Cited Findings
- Twetch's own features page was titled "Twetch Features - You buy it, we build it." (archived Feb 2022, May 2022, Jan 2023, Mar 2023, Jun 2023 snapshots exist; the page was client-rendered so the archived HTML only contains the title) — [Wayback CDX index for twetch.com/features](http://web.archive.org/cdx/search/cdx?url=twetch.com/features&output=json); live page title today: [twetch.com/features](https://twetch.com/features)
- CoinGeek's August 16, 2019 review of the private beta: "For $1, users can active Dark Mode, a must have in 2019. There's also Tweet from Twetch for $1, which will help you spread awareness of Twetch to the more classical variety of social media." Also: "Twetch accounts connect to a Money Button wallet, and other than browsing, nearly every action either consumes BSV, or pays the user for their contribution." — [CoinGeek, Twetch review, Aug 16 2019](https://coingeek.com/twetch-review-bitcoin-svs-exciting-evolution-of-social-media/)
- CoinGeek (April 12, 2022) quotes Twetch: "Tweet from Twetch and Twetchdat were some of our earliest and most popular features." — [CoinGeek, Twetch launches Twetch Jobs, Apr 12 2022](https://coingeek.com/twetch-launches-twetch-jobs/)
- Isaac Morehouse (Dec 13, 2022, on blog.twetch.com) lists Twetch's extras: "an NFT marketplace, a mini arcade game, fully encrypted DMs ... a browser extension for the Twetch wallet ... and even a way of automatically verifying ownership of NFT profile pictures (not my thing, but people seem to love it.)" — [Twetch blog, "Twetch: A glimpse of the future of social media?", Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/) (fetched via Wayback)
- The current (2026) twetch.com/features page lists only: Home (on-chain feed), Twetch Meme Library, Explore, Leaderboard ("see the people leading the public Twetch community"), Market ("browse and trade on-chain NFT collections"), Sign up/in. No badge, checkmark or premium tier is mentioned. — [twetch.com/features](https://twetch.com/features)
- Twetch was invite-only / waitlist in its first years: "Twetch is still invite-only and officially in beta, so you'll have to take a place on the waiting list to post and earn." — [CoinGeek, How to earn Bitcoin via Twetch, Dec 15 2020](https://coingeek.com/how-to-earn-bitcoin-via-twetch/); private beta launched late May 2019 — [CoinGeek review, Aug 2019](https://coingeek.com/twetch-review-bitcoin-svs-exciting-evolution-of-social-media/)
- Sign-up switched from email/password + invite to a one-click seed-phrase sign-up on Jan 4-5, 2023, and the public feed became visible to non-members. — [Twetch blog, "A whole new way to join Twetch", Jan 5 2023](https://blog.twetch.com/a-whole-new-way-to-join-twetch/) (fetched via Wayback)

### Inferences
- If a green verified badge existed, the most plausible home for it was the "You buy it, we build it" feature store (same place Dark Mode and Tweet-from-Twetch were sold for $1 in 2019), i.e., a purchasable cosmetic rather than an identity check. This is inference only.
- The one confirmed "verification" is NFT-PFP ownership verification (Dec 2022). It is possible the "green badge" the parent effort remembers is the visual marker for a verified NFT profile picture, analogous to Twitter's hexagon PFP of Jan 2022. Not confirmed.
- Twetch's own 2023 Next.js data payloads expose only pages for welcome, trade (fiat-to-crypto "Trade Desk"), downloads, mintdat, twonks (NFT items) and collections; there is no "verified" or "badge" route among archived routes, which weakly suggests any badge was a profile attribute rather than its own product page.

### Gaps
- No source for: the badge's existence, introduction date, acquisition path (purchase vs. invite vs. token-gated), price in BSV/USD, or whether it was ever sold on the market. The Twetch blog, CoinGeek, CoinDesk, Cointelegraph and Nanopay never mention it.
- The original twetch.com/features price list was rendered client-side and the archived API payloads for it were not captured, so I could not enumerate the full paid-feature list after 2019.
- Medium review by @Austerity_Sucks (which contains a sign-up walk-through, user ID #13440) was blocked (Cloudflare 403) and not in Wayback; it may contain UI details.
- Josh Petty / @twetchapp tweets were not reachable (no X API token available; WebSearch returned nothing).

---

## Q2. Was the badge an on-chain NFT (Run, RelayX, Sigil, 1Sat ordinal) or a centralized flag? Could it be traded?

### Takeaway
Unknown for the badge itself. Twetch's collectibles were on-chain but in a proprietary, closed format (Sigil co-signed tokens for the 2021 Hats; later the "Twonks" 546-sat UTXO format); Twetch's co-founder admitted the closed system "could not move assets off-platform," and surviving NFTs must be converted to 1Sat Ordinals to be useful.

### Cited Findings
- Twetch Hats (Feb 24, 2021) were the first implementation of Dean Little's Sigil protocol: "Twetch was the first to implement Sigil with their Hat launch." Sigil requires issuer + user co-signing so "contract execution and indexing of the resulting UTXOs happen in one process"; UTXO-based design handled the purchase surge because "each UTXO can only be spent once." — [CoinGeek, Token protocols on BSV: Sigil Token, Jun 17 2021](https://coingeek.com/token-protocols-on-bsv-sigil-token/)
- Twetch Rare Hats "are minted on a different protocol and cannot directly be traded on RelayX" (claim by a RUN-token issuer that wrapped 5 Hats as "HAT" tokens; promotional source). — [search result summary citing RelayX/HAT token post](https://relayx.medium.com)
- Twetch's later NFT format ("Twonks"), reverse-engineered: each token is a 546-sat UTXO; the locking script checks HASH160 of a 32-byte collection ID then the owner's pubkey-hash with signature; an OP_RETURN section carries JSON with `attributes`, `image` (b:// reference), `number`, `title`. Tokens are transferable (on-chain transfer of TWONKLAB #1 and a burn to P2PKH observed); trades are atomic swaps; one NOOGIES trade paid ~6.9% market fee. — [GitHub auxon/twonk-market README](https://github.com/auxon/twonk-market)
- Twetch Egg (Apr 2021): the 3D object "is stored entirely on-chain, so it doesn't depend on a server or IPFS link. Twetch stated that the egg would survive even if Twetch shut down." Billy Rose: "You can't have true ownership of a digital item if it can be taken away from you by a centralized issuer." — [CoinGeek, Twetch's non-vanishing NFT airdrop, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/)
- At shutdown (June 2024), Billy Rose said Twetch's proprietary NFT technology was a "closed system" that could not move assets off-platform, which "may have contributed to its downfall"; surviving NFTs "must be converted to the 1Sat Ordinals format to be useful again." — [CoinGeek, Twetch shuts down, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Twetch Wallet: at sign-up Twetch generates a 12-word seed tied to the wallet pubkey; "Twetch encrypts the seed and stores it in its database. Users decrypt it to log in." Money Button and RelayX (paymail) wallets were also accepted. — [CoinDesk, Twetch launches encrypted messaging, Sep 9 2020](https://www.coindesk.com/business/2020/09/09/twetch-launches-encrypted-messaging-in-chat-payments-on-bsv-blockchain)
- Sept 2022: "Twetch Wallet now supports signing messages to authenticate into apps and websites" and can "interact with different forms of smart contracts"; the Frog Cartel "vaccine evolutions" mechanic (mutate 35% / kill 15% / unchanged 50%, vaxx NFT burnt on use) was "the first time Twetch.com and Twetch Wallet have been used for upgrading NFTs." — [Twetch blog, Introducing NFT Evolutions, Sep 7 2022](https://blog.twetch.com/twetch-wallet-nft-evolutions/) (fetched via Wayback)
- Twetch "Planetary" test mints: internal test NFTs were found on-chain by outsiders and "minted on Relayx for sale," after which Twetch said "From now on WE DO IT LIVE" and posted test mints publicly from @0. — [Twetch blog, Updates to Planetary NFT Mints, Oct 30 2022](https://blog.twetch.com/planetary-nft-mints-on-twetch/) (fetched via Wayback)

### Inferences
- Twetch's own paid "features" of 2019 (Dark Mode, Tweet from Twetch) pre-date any Twetch NFT tech (first NFT = Hats, Feb 2021), so early purchasable perks were almost certainly database flags paid for with a BSV transaction, not tokens. Any 2019-2020-era badge would have been the same.
- Because post-2021 Twetch NFTs lived in Twetch's own marketplace and could not be listed elsewhere (RelayX could not trade Hats), even an "on-chain" badge would have been practically non-transferable outside Twetch.

### Gaps
- No source states which format (flag, Sigil, Twonk) a verified badge used, or whether it was tradable.

---

## Q3. What visual design did the badge have (color, shape, placement)? Any screenshots described?

### Takeaway
No textual description of a Twetch verified-badge visual exists in any source found. The only documented Twetch status visuals are numbered accounts (e.g., "@3", "@33", "@58572", "@0") shown with usernames, and NFT profile pictures.

### Cited Findings
- Twetch usernames are displayed with sequential account numbers; e.g., Twetch tells artists to "DM @3 on Twetch" and users quoted in Twetch's blog are "Ric RoSS @33 the BoSS" and "Cutedogs @58572"; the official account is @0. — [CoinGeek, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/); [Twetch blog, Nov 2 2022](https://blog.twetch.com/generative-3d-nft-comfy-sweatpants-on-the-blockchain/); [Twetch blog, Oct 30 2022](https://blog.twetch.com/planetary-nft-mints-on-twetch/)
- A 2019 reviewer was assigned user ID #13440 at sign-up (indicates sequential public numbering from launch). — [Medium, @Austerity_Sucks review](https://medium.com/@Austerity_Sucks/i-signed-up-for-bsvs-twetch-social-media-platform-so-you-don-t-have-to-462f0db8b614) (search-snippet only; page blocked)
- "Numbered user accounts are back. Low-numbered accounts carried prestige and were sometimes traded or auctioned." — [CoinGeek, Twetch is back, Jul 21 2026](https://coingeek.com/twetch-is-back-can-bsv-social-network-regain-its-meme-magic/)
- Twitter's comparable NFT-PFP marker (Jan 2022): hexagonal frame, Twitter Blue subscribers only, reverted to a circle if the NFT was sold. — [CoinDesk, Jan 20 2022](https://www.coindesk.com/business/2022/01/20/twitter-launches-nft-profile-picture-verification)

### Inferences
- The low account number next to the handle functioned as Twetch's de facto "badge": it was always visible, non-purchasable at issuance, scarce by construction, and (per CoinGeek) traded on a secondary market.

### Gaps
- No screenshot descriptions, color, or placement for any Twetch checkmark. The Twetch iOS app and web UI are not archived in a readable form.

---

## Q4. What perks did the badge unlock?

### Takeaway
Unknown for the badge. Twetch's documented paid perks were: Dark Mode ($1), Tweet-from-Twetch ($1), Twetchdat, encrypted chat, advanced search, Troll Toll (user-set price for others to interact with you), Twetch Jobs (paid engagement), NFT-PFP verification, and NFT marketplace access.

### Cited Findings
- Dark Mode $1 and Tweet from Twetch $1 (Aug 2019). — [CoinGeek review, Aug 16 2019](https://coingeek.com/twetch-review-bitcoin-svs-exciting-evolution-of-social-media/)
- A community BSV blog (bsv.guru) described Twetch features as "some ... cosmetic such as Dark mode but others ... more functional like encrypted messaging and the advanced search feature" (secondhand; site unreachable at fetch time). — [bsv.guru NFT tag feed](https://bsv.guru/tag/nft/feed/)
- Troll Toll (May 5, 2020): Twetchers "choose how much it costs for a user to interact with them using the command /trolltoll"; posts cost $0.02; a /pay command sends P2P BSV. — [CoinGeek, Twetch launches Troll Toll, May 5 2020](https://coingeek.com/twetch-introduces-the-troll-toll-putting-a-price-on-internet-trolls/)
- "You can even add a trolltoll to any user instantly, choosing an amount they must pay to interact with your posts - monetizing your haters!" Posts can be encrypted and "You can also revoke Twetch's access at any time, effectively deleting the readable version of the post." — [Twetch blog, Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/)
- Encrypted DMs with in-chat payments launched Sep 2020; AES cipher protected by the user's seed. — [CoinDesk, Sep 9 2020](https://www.coindesk.com/business/2020/09/09/twetch-launches-encrypted-messaging-in-chat-payments-on-bsv-blockchain)
- Twetch Jobs (Apr 2022): advertisers buy up to 200 likes at $0.10, 100 retweets at $0.20, 50 comments at $1; promoters earn $0.05/like, $0.10/retweet, $0.50/reply and must link Twetch to Twitter. — [CoinGeek, Apr 12 2022](https://coingeek.com/twetch-launches-twetch-jobs/)
- Twetch also had a "Trade Desk" ("Buy large amounts of cryptocurrency with your bank account") and a job board. — archived [twetch.com trade.json payload](http://web.archive.org/web/2023id_/https://twetch.com/_next/data/8vA_Xqzi7sqIYfTLwcxKK/en-US/trade.json); [CoinDesk, Feb 8 2023](https://www.coindesk.com/tech/2023/02/08/bitcoins-newfound-nft-hype-attracts-interest-of-bsv-developer-twetch)

### Inferences
- Twetch never bundled perks into a single "verified" tier in any documented period; perks were sold a la carte for ~$1 each, which is itself a design datum (micro-priced cosmetics rather than a subscription).

### Gaps
- No source lists badge-specific perks (fee discounts, visibility, access).

---

## Q5. How did the community react; what made status items coveted; secondary-market prices?

### Takeaway
Twetch's status economy ran on scarcity (101 Hats, one-per-active-user Egg airdrop), on-chain permanence, meme culture, and low account numbers; the Egg resold for a ~$199 floor within days of a free airdrop, and low-numbered accounts were traded or auctioned.

### Cited Findings
- Twetch Hats: launched Feb 24, 2021; only 101 exist, each numbered; buyer received a physical hat plus a digital trading card in their Twetch account; "both the physical and digital items are NFTs." Twetch was "the first bitcoin business to release NFTs that gained traction." — [CoinGeek, Josh Petty on Bitstocks podcast, Mar 10 2021](https://coingeek.com/josh-petty-talks-nfts-on-bitstocks-podcast/); [CoinGeek, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/)
- Twetch Egg (Easter, Apr 2021): one Egg airdropped to every user active in the previous 30 days; Petty teased on CoinGeek's April 1 livestream, "Those who are active on Twetch will be rewarded"; "At the time, the Egg was reselling for a minimum of about $199" on the Twetch marketplace; a later "Tendies" token followed. — [CoinGeek, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/)
- Streetwear NFT series: "First it was Twetch Rare Hats, then it was Twetch Cozy Hoodies, now ... Twetch Comfy Sweatpants" (mint Nov 2, 2022 at 2:22pm ET on twetch.com/mint; users told to top up "at least 5 BSV"; a "very rare comfy+cozy surprise for all those who hold both"). — [Twetch blog, Nov 2 2022](https://blog.twetch.com/generative-3d-nft-comfy-sweatpants-on-the-blockchain/)
- Low-numbered accounts "carried prestige and were sometimes traded or auctioned." — [CoinGeek, Jul 21 2026](https://coingeek.com/twetch-is-back-can-bsv-social-network-regain-its-meme-magic/)
- Twetch marketplace did not allow third-party creations (Apr 2021); artists had to DM @3 to be featured. — [CoinGeek, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/)
- Scale: ~70,000 accounts created but "daily active numbers are usually in the hundreds" (Dec 2022); >100,000 users over six years (Jun 2024). — [Twetch blog, Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/); [CoinGeek, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Engagement density: a 31-follower Twetch account got 9 engagements and earned $0.27 on a post vs. 13 likes/5 RTs from 1,471 Twitter followers (Jul 2020). — [CoinGeek, Twetch vs PowPing, Jul 24 2020](https://coingeek.com/twetch-vs-powping-to-tip-or-to-pay/)
- Culture/meme angle: Twetch blog authored by "Elon Moist" (Josh Petty's alias), "Join the Bright Gang Movement" (Sep 6, 2022). — [Twetch blog, Coming soon, Sep 6 2022](https://blog.twetch.com/coming-soon/)

### Inferences
- The strongest "status" lever Twetch had was activity-gated airdrops (Egg: be active in the last 30 days) that immediately acquired a secondary-market floor; that is the closest Twetch analogue to a streak-badge.
- Scarcity plus physical-digital pairing (Hats) created the first traction; purely cosmetic $1 flags did not generate secondary-market stories.

### Gaps
- No price history for Hats, Hoodies, Sweatpants, or account-number sales; no numbers on how many users bought Dark Mode or any badge.

---

## Q6. Other Twetch gamified mechanics: pay-to-post, like/branch/follow economics, earnings, leaderboards, streaks

### Takeaway
Every action cost money and most paid the counterparty: post/comment/branch ~$0.02-0.03, like $0.05-0.10, follow $0.10, with Twetch keeping ~1 cent (or ~20%) and the rest going to the creator; Troll Toll let users price interactions; a public Leaderboard existed; no source documents streaks or daily-login rewards, though the Egg airdrop was gated on 30-day activity.

### Cited Findings
- Aug 2019 (beta): text post/reply $0.02; post with image $0.07; like $0.10 of which $0.09 to creator; follow $0.10, creator earns $0.08 per follower; reply pays creator $0.01. — [CoinGeek review, Aug 16 2019](https://coingeek.com/twetch-review-bitcoin-svs-exciting-evolution-of-social-media/)
- Dec 2020: earn $0.04 per like, $0.08 per follow, $0.01 per branch; "some users have reportedly earned over $1,000 in total." — [CoinGeek, Dec 15 2020](https://coingeek.com/how-to-earn-bitcoin-via-twetch/)
- 2021 (Chris Hughes guide): follow $0.10, like $0.05, comment $0.02, branch $0.03, quote $0.03, branch+like $0.08; earnings: follower ~$0.08-0.09, like ~$0.02-0.04, branch ~$0.01, like+branch ~$0.05; "Twetch takes about 20% of each transaction"; inviters earn 10% of Twetch revenue from invitees. — [whoschrishughes.com, What is Twetch?](https://whoschrishughes.com/what-is-twetch-a-beginners-guide/)
- Dec 2022 (Morehouse): follow 10c, like 5c, post/comment/branch 2c; "Twetch takes 1 penny for each of these actions, a tiny fraction goes to miners ... and the rest goes to the user whose content was liked"; branch-of-branch royalties: "the original poster gets a % of that like and so do you"; "Paying 2 cents to post means scams, bots, sock-puppets, spam, and click-bait are rarely sustainable. It creates micro-skin-in-the-game." — [Twetch blog, Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/)
- Jul 2020: one post cost $0.08 and earned $0.27. — [CoinGeek, Jul 24 2020](https://coingeek.com/twetch-vs-powping-to-tip-or-to-pay/)
- Leaderboard: "see the people leading the public Twetch community." — [twetch.com/features](https://twetch.com/features)
- Feature voting: "Users could vote for new features by donating to developers." — [CoinGeek, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Barrier: "you need to obtain BSV to use Twetch ... a fairly high barrier to entry that results in a smaller number of users, most who are BSV fans first." — [Twetch blog, Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/)

### Inferences
- Price points drifted (like $0.10 -> $0.05; branch $0.02-0.03) and were denominated in USD-equivalent BSV, so the user-facing "cost" was stable even as BSV moved.
- The Twetch fee was effectively a flat ~1 cent per action (described elsewhere as ~20%), meaning status purchases were tiny relative to the ~$1 cosmetic features.

### Gaps
- No evidence of streaks, daily check-ins, or login rewards on Twetch. The only activity-gated reward found is the 30-day-active Egg airdrop (Apr 2021).
- "Twetch SuperFollow" and "Twetch Pass": no source found; likely not Twetch products.
- The "mini arcade game" (Dec 2022) is named but not described.

---

## Q7. What happened to Twetch, and did badges/NFTs survive?

### Takeaway
Twetch announced its wind-down on June 5, 2024 and went offline June 6, 2024, citing unscalable databases/APIs, insufficient growth for micropayment fees, and Musk's Twitter acquisition; NFT holders were initially stranded ("We are working on it"), keys were exposed for export to Yours Wallet, and the platform relaunched as an invite-only beta in July 2026 "with all memes and tokens intact."

### Cited Findings
- Shutdown announced June 5, 2024 on X; co-founders Billy Rose (@nondualrandy) and Josh Petty (@coinyeezy); reasons per Rose: "Bloated databases and APIs that did not scale," "Failure to grow enough for micropayment fees to sustain the business," Musk's 2022 acquisition of Twitter weakening the user-capture strategy. Twetch stated users' BSV and assets are on-chain; the Twetch.com page displayed seed/key info; users could import the seed into Yours Wallet. — [CoinGeek, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Cointelegraph (Jun 7, 2024): shut down "on June 6 without prior notice"; "several investors reported they could not redeem or cash out their NFTs and virtual collections"; Twetch replied "We are working on it" and said "We are also seriously considering open-sourcing, so anyone can spin up whatever version of Twetch they want." — [Cointelegraph, Jun 7 2024](https://cointelegraph.com/news/twetch-shutdown-web3-social-media-bsv)
- Petty on the future: the team would focus on "building on-chain applications, taking all we learned and reapplying." — [CoinGeek, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Feb 2023: Twetch explored raising capital for an NFT ecosystem on BTC Ordinals; Rose: "Ethereum laid the road map out for us - OpenSea, Bored Ape and MetaMask." — [CoinDesk, Feb 8 2023](https://www.coindesk.com/tech/2023/02/08/bitcoins-newfound-nft-hype-attracts-interest-of-bsv-developer-twetch)
- Relaunch (article Jul 21, 2026): invite-only beta; previous users can recover old usernames, wallets, and assets; wallet, DMs, groups, NFT marketplace work; "lots of things (are) still missing"; Treechat had already rebuilt the full post archive via Bitcoin Schema + JungleBus; HandCash login still supported. The article speculates (unconfirmed) that the NFT format moved to 1Sat Ordinals. — [CoinGeek, Jul 21 2026](https://coingeek.com/twetch-is-back-can-bsv-social-network-regain-its-meme-magic/)

### Inferences
- Because posts were on-chain in an open schema, third parties (Treechat) could resurrect the content; because NFTs were in a closed format, they could not be used elsewhere until converted. The asymmetry is the central lesson: on-chain is not the same as portable.

### Gaps
- No confirmation of whether any verified badge or Dark Mode entitlement survived the relaunch (they were likely database flags).

---

## Q8. Comparable paid-verification and status-badge systems and what they teach

### Takeaway
Twitter Blue (paid identical badge, impersonation chaos), Warpcast's Power Badge (algorithmic, weekly re-evaluated, silently removed from UI), Nostr NIP-58 (issuer-awarded, non-transferable, user-curated display), and friend.tech (speculative keys with no durable utility) together bracket the design space: badges must be legible, hard to counterfeit, tied to real behavior, and portable.

### Cited Findings
- Twitter Blue: $7.99/$8 per month; rolled out ~Nov 1-9, 2022 and suspended within days after impersonators ("Jesus Christ," "George Bush," Eli Lilly "insulin is free," Nintendo, Lockheed Martin, Tesla, SpaceX) all showed the same blue check; Twitter added an "Official" label; Musk paused relaunch "until there is high confidence of stopping impersonation." — [Fortune, Nov 10 2022](https://fortune.com/2022/11/10/lebron-james-joe-biden-nintendo-twitter-impersonators-blue-check-mark); [Moneylife](https://moneylife.in/article/elon-musk-pauses-relaunch-of-twitters-8-plan-till-impersonation-stops/68972.html); [Fox2 Detroit/AP, Nov 11 2022](https://www.fox2detroit.com/news/twitter-blue-signups-unavailable-fake-accounts)
- Twitter NFT PFP verification (Jan 2022): hexagon frame, Twitter Blue only, linked Ethereum wallet, reverts to circle when the NFT is sold. — [CoinDesk, Jan 20 2022](https://www.coindesk.com/business/2022/01/20/twitter-launches-nft-profile-picture-verification)
- Warpcast Power Badge: "smol purple lightning bolt icon by a user's name"; "not an official protocol-level feature, and is solely implemented on Warpcast"; checked "on a weekly basis: on Tuesdays. If your score drops below the threshold, you can lose your Power Badge!"; selection is "a PageRank like system" weighing activity, affinity, and spam labelling; replaced the "Active" badge deprecated Mar 20, 2024. — [Power Badge guide (Paragraph)](https://paragraph.xyz/@arfonzo/power-badge-guide); [Warpcast Power Badge Notion](https://warpcast.notion.site/Power-Badge-d81fea2e953e4dafae7c85295ffaf3ae); [Paragraph, Aug-Oct 2024 user account](https://paragraph.xyz/@madlog1c.eth/warpcast-experience)
- Power badges are "NOT stored on the Farcaster protocol itself." — [Dune docs, farcaster power_badge](https://docs.dune.com/data-catalog/community/farcaster/power_badge.md)
- Late 2024: "Power Badges have been removed from the UI, but still exist in the background, and still affect Cast visibility in almost every channel" (single-user account, unofficial). — [Paragraph, madlog1c.eth](https://paragraph.xyz/@madlog1c.eth/warpcast-experience)
- Nostr NIP-58: badge definition = addressable kind 30009 event with a `d` tag (issuer can update); badge award = kind 8 event with one `a` tag to the definition and one `p` tag per recipient, "immutable and non-transferable"; profile badges = user-curated list (sources conflict on kind 30008 vs 10008 - verify in nostr-protocol/nips) pairing `a` and `e` tags; clients SHOULD ignore unpaired entries. — [nips.4rs.nl NIP-58 mirror](https://nips.4rs.nl/nips/58); [nostr-tools nip58 docs](https://jsr.io/@nostr/tools@2.25.0/doc/nip58/)
- friend.tech (Aug 2023, Base): keys on a quadratic bonding curve; daily transactions fell 95% within ~20 days; 10% trading fee split; keys mainly gated private chats; "absence of new use cases for keys made the token's value hard to sustain"; creators relinquished contract control (sent ownership to a burn address) ~4 months after the token launch. — [TechCrunch, Aug 28 2023](https://www.techcrunch.com/2023/08/28/friend-tech-daily-transactions-drop/); [Decrypt, Sep 2024](https://decrypt.co/248576/friendtech-creators-bail-ethereum-social-platform?amp=1); [Blockworks](https://blockworks.com/news/friend-tech-social-tokens-harmless)
- Hashinals (Hedera HCS-5): WebSearch returned nothing usable; not covered here.

### Inferences
- Paid, uniform badges (Twitter Blue) convert a trust signal into a spam vector; algorithmic badges (Warpcast) feel arbitrary and can be revoked silently; speculative badges (friend.tech) decay when utility is thin. Twetch's best-received items were earned-by-activity (Egg) or genuinely scarce (Hats), and its worst outcome was lock-in of a closed token format.

### Gaps
- No primary Warpcast/Dan Romero statement on the power badge's UI removal; Hashinals not sourced.

---

## Q9. Design lessons for a streak badge NFT (synthesized from the above)

### Takeaway
Build a streak badge that is earned (not bought), visibly numbered/tiered, open-format and portable from day one, re-validated on-chain, and paired with modest but real utility - avoiding Twetch's closed-token trap, Twitter Blue's counterfeit problem, Warpcast's silent revocation, and friend.tech's utility vacuum.

### Cited Findings (basis)
- Egg airdrop gated on "active within the last 30 days," resold at ~$199 floor. — [CoinGeek, Apr 5 2021](https://coingeek.com/twetchs-non-vanishing-nft-airdrop/)
- 101 numbered Hats with physical pairing were the first BSV NFTs "that gained traction." — [CoinGeek, Mar 10 2021](https://coingeek.com/josh-petty-talks-nfts-on-bitstocks-podcast/)
- Closed NFT system "could not move assets off-platform ... may have contributed to its downfall." — [CoinGeek, Jun 7 2024](https://coingeek.com/much-loved-social-network-twetch-shuts-down-after-6-year-attempt-to-dent-twitter/)
- Twitter Blue impersonation wave. — [Fortune, Nov 10 2022](https://fortune.com/2022/11/10/lebron-james-joe-biden-nintendo-twitter-impersonators-blue-check-mark)
- Warpcast weekly re-scoring and off-protocol storage. — [Power Badge guide](https://paragraph.xyz/@arfonzo/power-badge-guide); [Dune docs](https://docs.dune.com/data-catalog/community/farcaster/power_badge.md)
- NIP-58 non-transferable awards + user-curated display. — [NIP-58 mirror](https://nips.4rs.nl/nips/58)
- NFT Evolutions burn/mutate mechanic. — [Twetch blog, Sep 7 2022](https://blog.twetch.com/twetch-wallet-nft-evolutions/)
- Micro-skin-in-the-game (2c post) suppresses spam. — [Twetch blog, Dec 13 2022](https://blog.twetch.com/twetch-a-glimpse-of-the-future-of-social-media/)

### Inferences (the actionable takeaways)
1. Earn it, don't sell it. Twetch's only status item with a documented resale story (Egg, ~$199 floor) was free and gated on recent activity; its $1 purchasable cosmetics (Dark Mode, Tweet-from-Twetch) left no secondary-market trace. A streak badge should be minted only by provable consecutive activity, never by direct purchase, so holding it is a credible signal.
2. Make the number the status. Twetch's low account numbers were traded and auctioned; Hats were numbered 1-101. Put the streak length and the mint ordinal (e.g., "Streak #37, 90 days") in the on-chain metadata and render it next to the name.
3. Tier the visual, don't flatten it. Twitter Blue failed because notable and paying accounts got the identical glyph. Use visibly different marks for 7/30/90/365-day streaks so a glance conveys magnitude and a cheap badge cannot be confused with an expensive one.
4. Use an open, portable token format from day one. Twetch's Sigil/Twonk NFTs were on-chain but "could not move assets off-platform," and holders were stranded at shutdown. On BSV that means 1Sat Ordinals (which Twetch itself had to convert to); on any chain, pick the standard with the most third-party wallets and indexers.
5. Store the artwork and the rule set on-chain, not on a server. The Twetch Egg's selling point was that it "would survive even if Twetch shut down." Inscribe the badge image and a machine-readable streak policy so any indexer can re-derive validity.
6. Make loss legible and fair. Warpcast re-scored badges silently every Tuesday and later hid them while still using them for ranking, which users experienced as arbitrary. If a streak break downgrades or burns a badge, do it with an on-chain event users can see and anticipate (grace period, visible countdown).
7. Non-transferable award + transferable collectible, kept separate. NIP-58 makes awards immutable and non-transferable, which preserves meaning; Twetch's Hats/Eggs were transferable, which created a market. Issue a soulbound "streak record" to the identity and, optionally, a tradable "season" collectible at milestones so speculation does not corrupt the signal.
8. Let holders curate display. NIP-58's profile-badges list lets users choose which badges show and in what order. Give users a slot system rather than auto-cluttering the profile.
9. Attach modest, real utility. friend.tech collapsed because keys gated only a chat; Twetch's most-used paid features were practical (encrypted chat, search, Troll Toll). Give streak holders something functional (fee discounts, posting priority, a Troll-Toll-style gate others must pay through) and not merely a cosmetic.
10. Add evolution mechanics with risk. Twetch's Frog Cartel "vaccine" (35% mutate / 15% kill / 50% unchanged, consumable burnt on use) is a template: allow a streak badge to be "upgraded" at milestones with a consumable, with a small chance of a rare variant, to create talk-value.
11. Gate airdrops on recent activity, announce them obliquely. The Egg went to users active in the prior 30 days and was teased ("Those who are active on Twetch will be rewarded") rather than announced, rewarding the already-engaged and creating FOMO for the next drop.
12. Price the on-ramp low and charge micro-fees for actions, not for the badge. Twetch's 2c-post / 5c-like economy suppressed bots ("micro-skin-in-the-game") but the need to acquire BSV first capped DAU in the hundreds. A streak badge program should subsidize the first actions (e.g., sponsored fees for the first 7 days) so the streak can start without a wallet-funding wall.

### Gaps
- Because the Twetch green verified badge itself is undocumented, lesson 1-3 are derived from Twetch's other status items and from Twitter/Warpcast, not from direct evidence about the badge.
