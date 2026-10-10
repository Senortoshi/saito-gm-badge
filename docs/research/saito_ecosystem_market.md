# Saito Network Ecosystem, Community, and Market Situation (2025-2026)

All price/market/follower figures below were observed on 2026-10-10 unless another date is stated. "Hard data" = figures from aggregators, exchanges, GitHub, or Saito's own primary documents; "sentiment" = community or promotional opinion, flagged as such.

## Who is behind Saito, where are they based, and what is the funding/foundation structure? Is the project actively developed in 2025-2026?

### Takeaway
Saito is a small, founder-led project (co-founders David Lancashire and Richard Parris, plus a handful of contributors) operating through a Hong Kong legal entity (Proclus Technologies Limited) with people in Thailand/HK/Singapore/Beijing. There is no public evidence of VC funding, a named foundation, or a treasury; the only documented external funding is a 1.65 BTC Web3 Foundation grant. Development is demonstrably active as of October 2026 (commits dated Oct 6-8, 2026 in the main repo), and a "mainnet" was formally declared on Dec 16, 2025.

### Cited Findings
- David Lancashire's LinkedIn describes him as co-founder of Saito, based in Phuket, Thailand — [LinkedIn](https://th.linkedin.com/in/david-lancashire)
- The first Saito whitepaper (consensus mechanism) was authored by David Lancashire and Richard Parris — [IQ.wiki Saito milestones](https://iq.wiki/kr/wiki/saito/milestones)
- The Web3 Foundation grant application lists the legal entity as "Proclus Technologies Limited, 1101 299QRC, 299 Queens Road Central, Hong Kong"; proposer @trevelyan (David Lancashire); team: David Lancashire, Richard Parris, Clayton Rabenda; grant total 1.65 BTC (0.9 BTC milestone 1 + 0.75 BTC milestone 2) for 8 weeks at 1.5 FTE; deliverables were a Polkadot API module for in-browser Saito apps and asset-transfer instructions in the gaming protocol plus at least one open-source demo game. Status of completion is not stated on the page — [W3F Grants-Program application](https://github.com/w3f/Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
- The Dec 16, 2025 mainnet press release is datelined Hong Kong, quotes Richard Parris (Co-Founder) and David Lancashire (Co-Founder), lists Richard Parris (info@saito.io) and Oliver Mills of PR agency Growthy (ollie@growthy.io) as media contacts, and is labelled a paid press release that the publisher did not independently verify — [Live Bitcoin News (GlobeNewswire)](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/); same release syndicated at [Manila Times](https://www.manilatimes.net/2025/12/16/tmt-newswire/globenewswire/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/2244176) and [StreetInsider](https://www.streetinsider.com/Globe+Newswire/Saito+Blockchain+Launches+Mainnet%2C+Pioneering+Decentralised+Web3+Infrastructure/25742646.html)
- Mainnet press release claims: >70 million blocks processed, "consistent uptime," no known exploits; mainnet declared after self-defined benchmarks (node decentralisation, ATR pruning cycles in production, stability under load); features named: Automatic Transaction Rebroadcasting (ATR), Block Staking ("low-overhead and non-inflationary"), and "Smart NFTs" ("dynamic, logic-bearing assets that avoid complex virtual machines"); docs at wiki.saito.io — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)
- GitHub org "SaitoTech": description "Home of the Saito Blockchain," location "Beiing, HK, SG and around," 35 public repos, 45 followers, four member avatars shown — [github.com/SaitoTech](https://github.com/SaitoTech)
- Main repo `SaitoTech/saito`: "Self-sufficient Layer 1 Blockchain for massive-scale apps," 9 stars, 8 forks, 3,959 commits on the `prod` branch, 132 issues, 3 open PRs, no releases published — [github.com/SaitoTech/saito](https://github.com/SaitoTech/saito)
- Most recent commits on `SaitoTech/saito` master are dated Oct 8, 2026 (authors "arpee" and david.lancashire@gmail.com), including "Add Explorer chain and fork viewer with persistent metadata indexing," "fix: store patch," and "kick npent build 0.3.12"; earlier commits Oct 6-7, 2026 by arpee, Lancashire, and f8daniel — [SaitoTech/saito commits](https://github.com/SaitoTech/saito/commits/master)
- Repo activity snapshot (Oct 2026): `saito` updated Oct 10, 2026; `wiki` Oct 5, 2026; `papers` Sep 15, 2026; `saito-lite-rust` and `saito-lite` are archived (last Sep 4, 2026; 28 and 59 stars respectively); `saito-rust-workspace` (2,904 commits, 4 stars) last updated May 20, 2025 — [github.com/SaitoTech](https://github.com/SaitoTech)
- Saito's own archived blog says the blog "now lives on-chain" at saito.io/blog; archived posts by Lancashire run 2020-2023 (e.g., "Token Persistence Update – September 4, 2023") — [archive.saito.io](https://archive.saito.io/saito.tech/token-persistence-update-september-4-2023/)
- Saito's "Saito Summer 12 – The Big Picture" update (Nov 4, 2024) describes the roadmap toward native tokens/NFTs, an "ATR Hyperloop" to shorten epochs, Red Square archive-node integration, a Dynamic Modules (DCM) app store, and asks the community for contributors to revive the Realms NFT card game — [archive.saito.io Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Cryptorank's fundraising panel shows a "Public Sale (30%) / Funding Rounds (70%)" split but no round details, and a nonsensical "Raised $100.00" figure; the page itself returned HTTP 403 on direct fetch — [Cryptorank ICO page (via search snippet)](https://cryptorank.io/ico/saito)
- AlphaGrowth's investor section shows "No investors found" — [AlphaGrowth Saito community](https://alphagrowth.io/saito/community)
- 2021 Town Hall recap: co-founders explained that Saito patented its routing methodology to "prevent consortia and other chains from undermining the public network" — [Saito Town Hall #1 recap (Jul 1, 2021)](https://archive.saito.io/saito.tech/saito-community-town-hall-1-highlights-and-recap/)

### Inferences
- The project is best understood as a small private company (Proclus Technologies Ltd, HK) rather than a foundation-governed network; there is no evidence of a Saito Foundation, DAO, or treasury disclosure. Any "grant" or sponsorship for an NFT project would have to come from the founders directly.
- Commit cadence (multiple commits per day in October 2026, by at least three people) indicates genuine ongoing engineering, but the team size appears to be roughly 3-5 active developers, and the low star counts (9 on the main repo) indicate essentially no external developer community on GitHub.
- The "mainnet" label was self-declared in Dec 2025 after years of running a live chain; the press release was PR-agency distributed and paid, so the "70M blocks / no exploits" claims should be treated as company statements.

### Gaps
- No source discloses how the company is funded (runway, private sale amounts, investors). The 2021-era ICO/sale history could not be verified because Cryptorank blocked fetching and no other source lists rounds.
- The Web3 Foundation grant's completion status (milestones delivered/paid) was not found.
- Current headcount and roles (e.g., who "arpee" and "f8daniel" are) were not identifiable from public sources.

## SAITO token: market cap, price history, supply, exchanges, ERC-20/BEP-20 versions, and migration to native SAITO

### Takeaway
As of 2026-10-10, SAITO trades at roughly $0.00036 with a market cap between ~$0.7M (CMC) and ~$1.08M (CoinGecko), daily volume of only ~$4K, and it sits ~99.7% below its Nov 2021 ATH of ~$0.13; the all-time low was set as recently as July 13, 2026. Supply figures conflict badly across aggregators (3B vs 4.2B total; 7B max per Saito/LCX). The ERC-20 and BEP-20 tokens remain the tradeable form (Gate, Uniswap, PancakeSwap, LCX), and there is no published official migration guide or deadline for converting to native on-chain SAITO.

### Cited Findings
- CoinGecko (2026-10-10): price $0.000360; market cap $1,080,106; rank #2950; 24h volume $4,086.81; circulating/total/max supply all shown as 3B; ATH $0.1104; ATL $0.0002704; CEX: Gate (SAITO/USDT); DEX: Uniswap V4 (USDT/SAITO), Uniswap V3 (SAITO/WETH, SAITO/USDC), PancakeSwap v2 (SAITO/BUSD), PancakeSwap V3 (SAITO/FDUSD); ERC-20 contract 0xfa14fa6958401314851a17d6c5360ca29f74b57b; BEP-20 contract 0x3c6dad0475d3a1696b359dc04c99fd401be134da; last DEX trades were hours to one day old — [CoinGecko](https://www.coingecko.com/en/coins/saito)
- CoinMarketCap (2026-10-10): price $0.000360 (-2.82% 24h); market cap $712,704; FDV $2.52M; 24h volume $3,912; Vol/MktCap 0.55%; rank #2138; circulating supply 1,979,292,275 (28.28% of max); total supply 4.2B; max supply 7B; ATH $0.1292 (Nov 16, 2021, -99.72%); ATL $0.0002709 (Jul 13, 2026); 16.22K holders; CertiK rating 4.0; tags: Gaming, DeFi, Ethereum Ecosystem — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/)
- Supply conflict across aggregators: Cryptorank lists total 3.00B and circulating 665M; MEXC shows 3.00B total with circulating equal to total; MEXC's June 2026 snapshot showed ~$0.00036 and ATH $0.110352 — [MEXC tokenomics](https://www.mexc.com/price/SAITO/tokenomics); [Cryptorank](https://cryptorank.io/ico/saito)
- Saito's own statement (via LCX listing, Nov 2024): "The Saito Network has a token supply of 7bb," ~4.2B in public circulation at that time, and "A portion of publicly-circulating SAITO is also available in the form of ERC20 / BEP20 tokens that holders can migrate on-chain as needed." LCX listed SAITO/EUR from Nov 12, 2024; the announcement was still live (updated Jun 3, 2025) with no delisting notice found — [LCX listing announcement](https://www.lcx.com/saito-token-is-getting-listed-on-the-lcx-exchange)
- Gate SAITO/USDT page shows a live price of 0.0003602 with no delisting notice; volume not displayed in the fetched content — [Gate SAITO_USDT](https://www.gate.com/trade/SAITO_USDT); a TradingView snapshot of Gate SAITOUSDT showed "Market closed / No trades" (undated) — [TradingView SAITOUSDT](https://in.tradingview.com/symbols/SAITOUSDT/minds)
- Coinbase lists SAITO as not tradeable on Coinbase and shows circulating 2B / total 4.2B sourced from CMC/CoinGecko — [Coinbase price page](https://www.coinbase.com/price/saito)
- Third-party explainer: the ERC-20 is described as a wrapped form of the token, with versions on Ethereum, BNB Smart Chain, BSV, and the native Saito chain — [TheBigWhale](https://thebigwhale.io/tokens/saito)
- 2024 r/SaitoCrypto threads: a user's ERC-20 to BEP-20 swap via AnySwap failed, and another asked whether there was any announcement on when to convert to the native coin, with no official answer shown — [r/SaitoCrypto mirror](https://axebps-redlib.hf.space/r/SaitoCrypto)
- Historic exchange list (2021): Hotbit, Gate.io, Bkex, Decoin, Bilaxy, Coincap.io — [Town Hall #1 recap](https://archive.saito.io/saito.tech/saito-community-town-hall-1-highlights-and-recap/)
- Aggregator snapshots differ widely in price ($0.0004 to $0.0053) and market cap ($0.7M to $15.8M); the higher figures (Mobula $15.8M, CMC 7d page $8.8M) appear to be stale caches — [Mobula](https://mobula.io/asset/saito); [Zerion](https://app.zerion.io/tokens/SAITO-0xfa14fa6958401314851a17d6c5360ca29f74b57b)

### Inferences
- With ~$4K/day in volume and a sub-$1.1M market cap, SAITO is a micro-cap with negligible liquidity. An NFT project priced in SAITO would face severe slippage risk for buyers trying to acquire SAITO, and would have practically no secondary-market depth to lean on.
- The circulating-supply discrepancy (2B vs 3B vs 4.2B) means market-cap figures are unreliable by a factor of ~1.5x; the native-chain supply is not indexed by any aggregator, so the ERC-20/BEP-20 float is what the market sees.
- The absence of any 2025-2026 exchange-listing announcement beyond LCX (Nov 2024) implies no new on-ramps were added around mainnet.
- Native SAITO appears to be obtainable only by bridging ERC-20/BEP-20 tokens through Saito's own wallet tooling; there is no third-party wallet, custodian, or fiat on-ramp for native SAITO.

### Gaps
- No official migration guide, deadline, or conversion ratio from ERC-20/BEP-20 to native SAITO was found in indexed sources (the on-chain blog and wiki returned empty content to the fetcher).
- No token allocation table (team/foundation/community percentages) or vesting/unlock schedule is published in any source found; OneKey's Nov 2025 report explicitly says it could not find one.
- Current Gate.io trading volume for SAITO/USDT could not be confirmed; CoinGecko lists it as the sole CEX, while LCX (EUR pair) may still be live.

## User base and activity: users, nodes, Saito Arcade usage, Red Square usage, on-chain metrics

### Takeaway
No public dashboard, explorer, or official statistic for users, daily actives, or node counts exists in indexed sources; the only quantitative activity proxies are the company's "70M blocks" claim, 16.22K ERC-20 token holders (CMC), ~41K X followers, and ~3.9-4.9K Telegram members. An explorer with a fork viewer was committed to GitHub in Oct 2026 but explorer.saito.io had an expired TLS certificate when checked.

### Cited Findings
- Press release claim: more than 70 million blocks processed; no node count or user count given — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)
- CMC: 16.22K holders (ERC-20) — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/)
- An Oct 8, 2026 commit added an "Explorer chain and fork viewer with persistent metadata indexing" — [SaitoTech/saito commits](https://github.com/SaitoTech/saito/commits/master)
- explorer.saito.io returned "certificate has expired" on fetch (2026-10-10) — observed directly; no page content available
- The npm package `saitotop` is a CLI dashboard that tails a local node's saito.stats file; it reports local, not network-wide, stats — [npm saitotop](https://npmjs.org/package/saitotop)
- saito.io/arcade rendered only the title "Saito Arcade — PEER-TO-PEER, PROVABLY FAIR, FUN" and a "0%" loader to a non-JS fetcher; no game/player counts were extractable — [saito.io/arcade](https://saito.io/arcade/)
- LunarCrush-derived Reddit activity shown on Coinbase pages varies by locale (43 posts/1,019 comments in one; 7 posts/61 comments in another) and reports more downvotes than upvotes on posts and the reverse on comments — [Coinbase price page](https://www.coinbase.com/es/price/saito)
- Saito Summer 12 (Nov 2024) states Red Square archive-node integration was "in development" and more unreleased games were "nearing completion"; an April 2025 X update said the Red Square refactor was "still underway" — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/); [@SaitoOfficial Apr 2025 post](https://x.com/SaitoOfficial/status/1912013501683695829)
- OneKey (Nov 20, 2025) names "low dApp traction, which would leave node payments minimal" as a key risk and gives no user metrics — [OneKey research report](https://onekey.so/blog/ecosystem/saito-deep-research-report-token-fundamentals-development-roadmap-and-price-outlook)

### Inferences
- Because Saito apps run in-browser and the chain is not indexed by any third-party analytics (DefiLlama, Dune, Messari), the project has no verifiable on-chain usage signal; an NFT project cannot cite Saito ecosystem traction numbers.
- The 16K ERC-20 holder count is a ceiling on the plausible addressable base of existing SAITO owners; the real active base is likely far smaller given ~$4K daily volume.

### Gaps
- No node count, active-user count, daily transactions, Arcade games-played, or Red Square post volume was found anywhere. DefiLlama, Messari, and Dune do not cover Saito (no results surfaced).
- Saito's own on-chain blog (saito.io/blog) and wiki (wiki.saito.io) did not return readable content to the fetcher, so any statistics they may host were not captured.

## Existing apps and games on Saito, and which involve NFTs or digital assets

### Takeaway
saito.io (Oct 2026) lists seven first-party apps: RedSquare (social), Arcade (P2P games), Chat, Saito Talk (browser video calls), Stack (publishing), Vault (key-controlled storage for "private files and digital assets"), and Store ("discover and exchange peer-published offers"). NFTs on Saito are a UTXO-bound construct ("Smart NFTs" per the mainnet release), with the standard described as still under development/testing in Nov 2024; the only named NFT game (Realms, an MTG-style card game) was stalled and seeking volunteers as of Nov 2024.

### Cited Findings
- saito.io app list: RedSquare (post, follow, discover content without a platform owning the conversation); Arcade (meet players, launch P2P games); Chat (encrypted P2P messaging); Saito Talk (browser-to-browser calls, no account); Stack (open publishing); Vault ("key-controlled storage for private files and digital assets"); Store ("discover and exchange peer-published offers"); plus "One wallet" shared across apps for identity, signing, payments, portable ownership; the page mentions user-created assets that can be listed and sold — [saito.io](https://saito.io/)
- Saito NFT design (Nov 4, 2024): "A Saito NFT is a special UTXO that is bound to another UTXO that has fees and can be transferred normally"; enables "split NFTs" that could support a fungible-token standard; "still under development and testing" — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Realms: "a Magic: The Gathering-style NFT card game"; much artwork finished, but the team was "seeking contributors to revive development, including assets and basic code, ahead of the release of native NFTs and tokens on Saito" (Nov 2024) — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Mainnet release (Dec 2025) markets "Smart NFTs: dynamic, logic-bearing assets that avoid complex virtual machines"; no specific NFT app or collection named — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)
- Dynamic Modules (DCM) "App Store": lets users share and install small app files that run in-browser without central servers (Nov 2024) — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Games: first titles were Chess, WordBlocks, Twilight Struggle via the Saito Arcade; a 2023 X post pitches Chess, Poker, Quake 3 and Mario-style games on the open-source Arcade engine; Settlers of Saitoa and other P2P games had ongoing UI/UX work in Nov 2024; a "Saito Mania" game is playable at the Arcade URL — [Saito.tech "Playing games on the blockchain"](https://saito.tech/playing-games-on-the-blockchain/); [@SaitoOfficial Jul 2023](https://x.com/SaitoOfficial/status/1681895614672433153); [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/); [Saito Mania](https://saito.io/arcade/?view_game=SaitoMania)
- A Polkadot-era listing described Saito Arcade as "Play POKER with Polkadot ecosystem Tokens" — [CypherHunter Saito Arcade](https://www.cypherhunter.com/en/p/saito-arcade/)
- Saito published "Introducing SAGE: The Saito Blockchain Game Engine" on Medium (content not retrievable; HTTP 403) — [Medium @saitoofficial](https://medium.com/@saitoofficial/introducing-sage-the-saito-blockchain-game-engine-cadc22ef0f75)
- Saito Summer 8 (Sep 2024) added profile customization on Red Square, P2P fileshare improvements, and "info on NFTs" — [@SaitoOfficial Sep 2024](https://x.com/SaitoOfficial/status/1836873278880723018)
- Red Square positioning: "social media, P2P video calls, and gaming" on Web3 (Feb 2024) — [@SaitoOfficial Feb 2024](https://x.com/SaitoOfficial/status/1753307857616073086)
- Oct 2026 commits reference "store patch" and "npent build 0.3.12" (likely the Store module and a "npent"/NFT-related package), indicating the Store/asset layer is under active development — [SaitoTech/saito commits](https://github.com/SaitoTech/saito/commits/master)

### Inferences
- The Vault + Store + shared wallet combination on saito.io is the closest thing to native NFT infrastructure (storage of "digital assets," listing/selling "peer-published offers"), but there is no evidence of a launched NFT marketplace, mint tooling documentation, or any live collection as of Oct 2026.
- The NFT standard is bespoke (UTXO-bound, no EVM), so standard NFT tooling (ERC-721 marketplaces, OpenSea, Rarible, wallet NFT tabs) does not apply; an NFT project would depend entirely on Saito's in-house modules.
- Realms being stalled since at least Nov 2024 suggests the team's own flagship NFT use case lacked developer bandwidth; a new NFT project could position itself as filling that void.

### Gaps
- The wiki page describing Smart NFTs (minting API, metadata, fees, transfer semantics) could not be retrieved; wiki.saito.io returned only a title to the fetcher.
- Whether Realms or any NFT game shipped after mainnet (Dec 2025) is unknown; no 2026 announcements were found.
- SAGE game engine details (date, features) were not retrievable due to Medium's 403 block.

## Partnerships and integrations: Mixin, Polkadot/Kusama, gaming partners, others

### Takeaway
Only two partnerships are documented: a Web3 Foundation grant (Polkadot API module and asset transfers for games) and a Mixin Network "strategic partnership" beginning with integrating SAITO into Mixin Messenger (announced roughly early 2022). No Mixin NFT/collectible bridge, no Tezos tie-up, no gaming-studio partner, and no 2025-2026 partnership announcements were found.

### Cited Findings
- Web3 Foundation grant: Milestone 1 = Saito Polkadot API module (in-browser connection to a Polkadot API access point, docs, test env with Polkadot node, tutorial); Milestone 2 = asset-transfer instructions in the gaming protocol (deposit, send between players, request balances) plus at least one open-source game; the proposal states Saito apps should be able to "send and receive NFTs and other financial assets on Polkadot and its parachains," cites in-game NFT assets (weapons, land), and plans to partner with a parachain NFT/token project on a game issuing tokens as prizes/trophies/badges; Kusama not mentioned — [W3F Grants-Program application](https://github.com/w3f/Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
- Mixin: "Mixin Network Established Strategic Partnership With Saito" — the collaboration "will begin with integration of SAITO into the industry leading Mixin Messenger"; Medium metadata dated it ~1,737 days before 2026-10-10 (approximately January 2022); full text not retrievable (HTTP 403) — [Mixin Network Medium](https://medium.com/mixinnetwork/mixin-network-established-strategic-partnership-with-saito-be7f9ba6aea7)
- Mixin Messenger (2026 profile): open-source, Signal-protocol E2E messenger with multi-chain wallet, >$1B AUM, 2,900+ assets across 42 chains, mini-app ecosystem; added Coinbase Onramp for fiat purchases (Apr 15, 2026) — [HackerNoon Mixin interview](https://hackernoon.com/how-mixin-built-a-$1-trillion-volume-crypto-wallet-that-prioritizes-privacy-over-profit); [HackerNoon Coinbase Onramp](https://hackernoon.com/lang/ja/the-apple-pay-moment-for-web3-mixin-integrates-coinbase-to-make-fiat-to-crypto-faster-than-a-text)
- Searches for "Saito Mixin NFT/collectible" returned no results connecting Saito to Mixin NFTs — searches on 2026-10-10 across [this query](https://medium.com/mixinnetwork/mixin-network-established-strategic-partnership-with-saito-be7f9ba6aea7) and related terms
- Mainnet press release (Dec 2025) names no partners — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)

### Inferences
- The Mixin integration is a token-listing/wallet integration (SAITO inside Mixin Messenger), not an NFT bridge; whether SAITO is still supported in Mixin Messenger in 2026 is unverified. If it is, Mixin's new Coinbase fiat on-ramp (Apr 2026) would be the only fiat path to SAITO found in this research, which could matter for an NFT project's buyers.
- The Polkadot grant work dates from the 2021 era and has no visible 2025-2026 continuation; an NFT project should not assume functioning Polkadot asset bridging.

### Gaps
- Whether SAITO remains listed/supported inside Mixin Messenger as of 2026 could not be confirmed.
- No evidence either way on Tezos or other chain integrations; no such sources surfaced.
- Delivery status of the W3F grant milestones is not stated.

## Grants, hackathons, developer incentives, Saito DAO/treasury

### Takeaway
No Saito grants program, hackathon, developer incentive fund, DAO, or treasury disclosure exists in any indexed source as of Oct 2026. Saito has been a grant recipient (Web3 Foundation), not a grant giver; its only visible "developer incentive" is an open call for volunteers (e.g., to revive Realms).

### Cited Findings
- Multiple searches for "Saito grants program," "Saito hackathon," "Saito developer incentives," and "Saito DAO" returned no Saito-specific results — searches on 2026-10-10 (no matching sources)
- Saito's self-description on aggregators: "a Web3 Foundation grant recipient that runs blockchain applications directly in your browser" — [CoinGecko](https://www.coingecko.com/en/coins/saito)
- Nov 2024: the team "is seeking contributors to revive development" of Realms (assets and basic code) — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Dynamic Modules (DCM) let third parties ship small in-browser app files via the app store, which is the stated developer-distribution path — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- Saito's economic design pays nodes for routing/storage/compute rather than offering grants; OneKey notes token flows are "designed to fund continuous node payments" — [OneKey report](https://onekey.so/blog/ecosystem/saito-deep-research-report-token-fundamentals-development-roadmap-and-price-outlook)

### Inferences
- An NFT project should expect zero ecosystem funding from Saito; the realistic upside is direct founder attention/co-marketing (the team is small and publicly solicits contributors) rather than money.

### Gaps
- Whether Proclus Technologies holds a token reserve that could be used for ecosystem incentives is undisclosed.

## Community channels and size, and overall sentiment

### Takeaway
Saito's community is small and flat-to-declining: ~41.2K X followers (down ~0.17% over 30 days), ~3.9-4.9K Telegram members (two AlphaGrowth snapshots), a low-activity subreddit, and no indexed Discord. saito.io itself links only email, GitHub, X, Mastodon, and the on-chain blog. Sentiment data is sparse; what exists is a mix of long-time advocates and quiet holders asking about migration timelines.

### Cited Findings
- X/Twitter @SaitoOfficial: 41,169 followers latest; 41,190 seven days ago; 41,238 thirty days ago (-0.167%); a second AlphaGrowth page showed 41,455 (-0.22% 30d) — [AlphaGrowth Saito community](https://alphagrowth.io/saito/community); [AlphaGrowth Saito](https://alphagrowth.io/saito)
- Telegram @SaitoIO: 3,903 members latest (-0.077% 24h) on one AlphaGrowth page; 4,887 (-1.7% 30d) on another snapshot — [AlphaGrowth Saito community](https://alphagrowth.io/saito/community)
- saito.io community links: email info@saito.io, GitHub, X, Mastodon, blog; no Discord, Telegram, YouTube, or Reddit listed on the homepage — [saito.io](https://saito.io/)
- CMC lists reddit.com/r/saito and twitter.com/SaitoOfficial as official links — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/)
- Reddit activity (LunarCrush via Coinbase): 7-43 posts and 61-1,019 comments depending on snapshot; posts net-downvoted, comments net-upvoted — [Coinbase price page](https://www.coinbase.com/es/price/saito)
- Community sentiment (advocate): a Substack post argues Saito's design is non-inflationary and that paying infrastructure solves the Web3 economics problem — proponent opinion — [mukdde Substack](https://mukdde.substack.com/p/the-economic-solution-to-the-blockchainweb3)
- Community sentiment (holder frustration): 2024 r/SaitoCrypto posts about failed ERC-20/BEP-20 swaps and unanswered questions about native-coin conversion timing — [r/SaitoCrypto mirror](https://axebps-redlib.hf.space/r/SaitoCrypto)
- Historic sentiment: 2023 TradingView idea "Saito is poised to break above $0.03 during 2023" (price today is ~$0.00036) — [TradingView idea](https://il.tradingview.com/chart/SAITOUSDT/Sk3Anw6S-Saito-testing-key-resistance-level)
- Saito previously ran monthly Town Halls with the founders (2021) — [Medium tag page](https://medium.com/tag/saito); [Town Hall #1 recap](https://archive.saito.io/saito.tech/saito-community-town-hall-1-highlights-and-recap/)

### Inferences
- The ~41K X follower base is largely legacy from the 2021 cycle (follower count is slowly shrinking, not growing, ten months after mainnet), which suggests limited reach for an NFT launch relying on Saito's own channels.
- Saito's deliberate move of its blog and social presence on-chain (Red Square, on-chain blog, Mastodon) means much community activity is invisible to search engines and to aggregators like AlphaGrowth; actual engagement may be somewhat higher than indexed figures, but it also means discoverability for newcomers is poor.

### Gaps
- No Discord server or member count could be found; it is unclear whether an official Discord exists in 2026.
- No YouTube subscriber count or newsletter size was found.
- No systematic sentiment data (e.g., LunarCrush score, Santiment) was retrievable.

## Existing NFT projects, collections, or marketplaces on or for Saito

### Takeaway
No launched NFT collection, third-party NFT project, or NFT marketplace on Saito was found. The only NFT initiatives are first-party: the Realms card game (stalled, seeking volunteers as of Nov 2024), the UTXO-bound NFT standard (in testing Nov 2024; marketed as "Smart NFTs" at mainnet Dec 2025), and the Vault/Store apps that can hold and list "digital assets."

### Cited Findings
- Realms NFT card game: artwork largely done, code needed, awaiting native NFTs/tokens (Nov 2024) — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/)
- "Smart NFTs" named as a mainnet feature with no collection or marketplace cited (Dec 2025) — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)
- Vault stores "private files and digital assets"; Store is for "peer-published offers"; the site refers to user-created assets that can be listed and sold (Oct 2026) — [saito.io](https://saito.io/)
- W3F grant envisioned partnering with a parachain NFT project to issue in-game NFT prizes; no follow-up project found — [W3F application](https://github.com/w3f/Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md)
- Searches for "Saito NFT collection," "Saito NFT marketplace," "Saito Realms NFT," and "Saito Mixin NFT" returned no Saito-specific NFT launches — searches on 2026-10-10

### Inferences
- A new NFT project on Saito would be, as far as public evidence shows, the first external NFT collection on the chain; this is both a positioning advantage (novelty, founder attention) and a warning (no proven mint/trade tooling, no existing collector base).

### Gaps
- Whether Saito's Store already supports NFT listing/purchase in SAITO as of Oct 2026 could not be verified (the app is JS-rendered and the wiki was not readable).

## Known controversies, risks, or criticisms

### Takeaway
There is no major public controversy (no hack, no legal action, no rug allegations found), but the risk profile is severe on commercial grounds: 99.7% drawdown from ATH with a new all-time low in July 2026, ~$4K daily volume, conflicting supply data, a single-company structure with a patented consensus method, no published token allocation/vesting, no third-party analytics coverage, and (by the team's own 2024 admission) insufficient developer bandwidth for its flagship NFT game.

### Cited Findings
- Price: ATH $0.1292 (Nov 16, 2021) to ATL $0.0002709 (Jul 13, 2026); currently -99.72% from ATH — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/)
- Liquidity: 24h volume ~$3.9-4.1K; Vol/MktCap 0.55%; sole CEX on CoinGecko is Gate — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/); [CoinGecko](https://www.coingecko.com/en/coins/saito)
- Supply/transparency: aggregators disagree (3B vs 4.2B total; 7B max per Saito); no allocation or unlock schedule published; OneKey directs readers to primary materials it could not cite — [OneKey report](https://onekey.so/blog/ecosystem/saito-deep-research-report-token-fundamentals-development-roadmap-and-price-outlook); [LCX](https://www.lcx.com/saito-token-is-getting-listed-on-the-lcx-exchange)
- Centralization/governance: the project is run by Proclus Technologies Ltd (HK); the founders patented the routing methodology, acknowledging this "may seem odd for an open-source project" — [W3F application](https://github.com/w3f/Grants-Program/blob/master/applications/saito-game-protocol-and-engine.md); [Town Hall #1 recap](https://archive.saito.io/saito.tech/saito-community-town-hall-1-highlights-and-recap/)
- Adoption risk named by a third party: "low dApp traction, which would leave node payments minimal"; macro/liquidity shocks for small caps; generic token sell-pressure warning (Nov 2025) — [OneKey report](https://onekey.so/blog/ecosystem/saito-deep-research-report-token-fundamentals-development-roadmap-and-price-outlook)
- Claims vs. verification: the mainnet announcement was a paid press release; the publisher stated it did not independently verify the claims — [Live Bitcoin News](https://www.livebitcoinnews.com/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/)
- Delivery history: Saito's 2024 roadmap still listed items (ATR Hyperloop, native NFT/token standard, Realms) as pending more than four years after the 2021 Town Hall discussed "mainnet ETA" — [Saito Summer 12](https://archive.saito.io/saito.tech/saito-summer-12-the-big-picture/); [Town Hall #1 recap](https://archive.saito.io/saito.tech/saito-community-town-hall-1-highlights-and-recap/)
- Infrastructure hygiene: explorer.saito.io had an expired TLS certificate on 2026-10-10 — observed directly
- User-reported friction: failed cross-chain swaps and unanswered migration questions on Reddit (2024) — [r/SaitoCrypto mirror](https://axebps-redlib.hf.space/r/SaitoCrypto)
- Positive signal: CertiK rating 4.0 on CMC; no exploits claimed; GitHub shows daily commits in Oct 2026 — [CoinMarketCap](https://coinmarketcap.com/currencies/saito/); [SaitoTech/saito commits](https://github.com/SaitoTech/saito/commits/master)
- No Saito-specific coverage was found on CoinDesk, Cointelegraph, The Block, or Decrypt for 2025-2026 (the mainnet release appeared only via GlobeNewswire syndication and crypto PR sites) — searches on 2026-10-10; [CoinTrust](https://www.cointrust.com/market-news/saito-unveils-mainnet-focused-on-scalable-decentralized-applications)

### Inferences
- The commercial realities for an NFT project are stark: buyers would need to acquire an illiquid token on Gate or a DEX, bridge it to a bespoke native chain via Saito's own wallet, and trade on an unproven in-house Store with no third-party marketplace, wallet, or analytics support. Pricing NFTs in SAITO ties the project's revenue to a token that just hit an all-time low.
- Counterbalancing factors: the chain is live and actively maintained, the founders are reachable and openly soliciting builders, and there is no competing NFT collection, so a well-executed project could become the de facto reference NFT on Saito and benefit from direct team promotion.
- Technically, Saito's "no VM, UTXO-bound NFT" model may be cheap to mint on, but it also means NFTs cannot be exported to EVM ecosystems without a bridge that does not exist.

### Gaps
- No independent security audit of the Saito L1 or its NFT standard was found (CertiK's 4.0 score refers to the token listing, not a protocol audit).
- No documented evidence of insider token movements or unlock events; this is a disclosure gap, not evidence of absence.
