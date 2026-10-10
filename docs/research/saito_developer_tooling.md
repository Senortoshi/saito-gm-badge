# Saito Network Developer Tooling for NFT Applications (2025-2026)

Research date: 2026-10-10. Primary sources are the `SaitoTech/saito` monorepo (branch `master`, read via GitHub API and raw files), the `SaitoTech/wiki` repo (source of wiki.saito.io), the npm registry, and the Dec 2025 mainnet press release. Where a wiki page is cited, the GitHub source file is linked because wiki.saito.io renders client-side and could not be fetched directly.

**Headline summary:** In 2026 the only current developer repo is the `SaitoTech/saito` monorepo (`node/` = NodeJS/TypeScript app client with `mods/`; `rust/` = saito-core, saito-rust, saito-wasm, saito-js). `saito-lite-rust` and `saito-rust-workspace` are superseded. NFTs are a consensus-level primitive (`TransactionType::Bound`, a three-slip "tuple"), minted from the browser wallet via `app.wallet.createMintNFTTransaction(...)`, with a wallet API for send/split/merge/atomize, a generic UI kit (`SaitoNFT`, `SaitoNFTCard`, `NFTOverlay`), a built-in marketplace mod (`store`), an NFT code editor mod (`nftstudio`), and a RustScript/P2SH access-control layer. Mainnet launched Dec 16, 2025; a large "Refactor 2026" release (RC1 targeted Aug 3, 2026) consolidated the NFT/asset system. The practical path is: clone monorepo -> `cd node && npm install && npm run nuke && npm run dev` -> write a `mods/<name>/<name>.js` class extending `ModTemplate` -> register in `config/modules.config.js` -> call the wallet NFT APIs -> optionally package as a `.saito` dynamic module or distribute via NFT/Store.

---

## Key Question 1: Primary developer repos and their roles; which are current vs deprecated

### Takeaway
As of October 2026, all active development is in the single `SaitoTech/saito` monorepo with two top-level trees, `node/` (the NodeJS "Saito-Lite" client, where dApps/mods live) and `rust/` (saito-core, saito-rust, saito-wasm, saito-js). `saito-lite-rust` is archived/deprecated and `saito-rust-workspace` is a legacy standalone workspace whose contents now live under `rust/`.

### Cited Findings
- `saito-lite-rust` README: "This repo is deprecated and archived. Current development is in the `saito` monorepo." The repo is archived and read-only. — [SaitoTech/saito-lite-rust](https://github.com/SaitoTech/saito-lite-rust)
- `SaitoTech/saito` is described as "Self-sufficient Layer 1 Blockchain for massive-scale apps without compromising openness for Web 3.0"; default branch `prod`; ~3,959 commits; root contains `.agents/`, `.design/`, `.github/`, `e2e/`, `node/`, `rust/`, `scripts/`, `README/` (a directory of AI-oriented coding chapters), `AGENTS.md`, `license`, `recompile`. — [SaitoTech/saito](https://github.com/SaitoTech/saito); directory listing via [GitHub contents API](https://api.github.com/repos/SaitoTech/saito/contents?ref=master)
- `rust/` contains `saito-core`, `saito-rust`, `saito-wasm`, `saito-js`, `saito-spammer`, `saito-e2e`, `scripts/`, `wiki/`, `VERSION`, `INSTALL.md`, `LINK.md`, `LINK_MAC.md`. — [rust/ listing](https://api.github.com/repos/SaitoTech/saito/contents/rust?ref=master)
- Roles per the Rust README: **saito-core** = "basic classes (blocks, transactions, mempool)" used by all versions; **saito-rust** = "storage and network services in the Rust language" (handlers passed into core); **saito-wasm** = compiles the shared library to WASM so "the network and browser code ... run lite-clients that use the same underlying code so as to prevent accidental forks." — [rust/README.md](https://github.com/SaitoTech/saito/blob/master/rust/README.md)
- Wiki "Install" overview: "The `node` sub-directory contains the main Saito client and is what 99% of developers will want to install and use. It is coded in NodeJS and most development work is in javascript. The `rust` subdirectory contains more specialized and high-performance software." Saito-Rust "does not support offering web3 applications or data to connecting clients." — [wiki install/overview.md](https://github.com/SaitoTech/wiki/blob/master/install/overview.md)
- `saito-js` npm: description "js wrappings around saito-core using wasm"; repository `git+https://github.com/SaitoTech/saito.git`; latest `0.3.12` published 2026-10-08; first published 2023-04-27; depends on `saito-wasm@0.3.12`, `ws`, `buffer`, `base-58`, `node-fetch`. No README on npm. — [registry.npmjs.org/saito-js](https://registry.npmjs.org/saito-js)
- `saito-wasm` npm: latest `0.3.12`, modified 2026-10-08, same description; no README. — [registry.npmjs.org/saito-wasm](https://registry.npmjs.org/saito-wasm)
- `node/package.json`: name `saito`, version `0.2.0`, depends on `saito-js: 0.3.11` (one behind npm latest at research time), plus `express`, `sqlite3`, `sqlite`, `localforage`, `jsstore`, `react 18.3.1`, `three`, `snarkjs`, `blake3`, `secp256k1`, `bip39`, `@mixin.dev/mixin-node-sdk`. — [node/package.json](https://github.com/SaitoTech/saito/blob/master/node/package.json)
- `saito-rust-workspace` still exists (2,904 commits, CI badge) and its README is the same text as `rust/README.md` in the monorepo. — [SaitoTech/saito-rust-workspace](https://github.com/SaitoTech/saito-rust-workspace)
- Older repos: `SaitoTech/saito-lite` ("A cross-platform javascript saito implementation") and `SaitoTech/saito-old` ("big-data application blockchain") appear in search results as predecessors. — [GitHub search results](https://github.com/SaitoTech/saito-lite)
- The `rust/saito-js/package.json` checked into the repo still says version `0.3.5` and depends on `saito-wasm 0.3.5`; the wiki explains releases are driven by incrementing `rust/VERSION`. — [rust/saito-js/package.json](https://github.com/SaitoTech/saito/blob/master/rust/saito-js/package.json); [wiki install/full.md](https://github.com/SaitoTech/wiki/blob/master/install/full.md)

### Inferences
- A developer should ignore `saito-lite-rust`, `saito-lite`, `saito-old`, and treat `saito-rust-workspace` as a mirror/legacy; clone `SaitoTech/saito` and work in `node/`.
- `saito-js`/`saito-wasm` are published to npm in lockstep (same version), and the node client pins a specific version, so the "SDK" for JS is effectively the `saito-js` package consumed by the node client (see Q3).

### Gaps
- The monorepo's `prod` vs `master` vs `staging`/`develop` branch policy was not documented on any page fetched; PRs #709/#712/#718 titled "Staging"/"Develop" suggest a develop -> staging -> prod promotion flow (and `node/scripts/promote-staging-to-prod.mjs` exists), but no written branching guide was found.

---

## Key Question 2: How the Saito module ("mod") system works

### Takeaway
A module is a directory `node/mods/<slug>/` whose main file `<slug>.js` exports a class extending `ModTemplate` (`node/lib/templates/modtemplate.js`); it is registered by adding its path to the `core` (server) and/or `lite` (browser bundle) arrays in `node/config/modules.config.js` and recompiling. Modules receive on-chain transactions via `onConfirmation(blk, tx, conf)`, off-chain peer messages via `handlePeerTransaction(app, tx, peer, cb)`, talk to each other via `respondTo(type, obj)` and `app.connection` events, and persist state via `app.options` + `app.storage.saveOptions()` (browser/wallet), per-module SQLite (`/data/<mod>.sq3` on nodes, from `sql/` files), the Archive service (`app.storage`), or on-chain transactions.

### Cited Findings
**Structure and registration**
- Minimal module (wiki Tutorial 1):
  ```js
  var ModTemplate = require('../../lib/templates/modtemplate');
  class Tutorial01 extends ModTemplate {
    constructor(app) {
      super(app);
      this.name = "Tutorial01";
      this.slug = "tutorial01";
      this.description = "Introductory tutorial for Saito App Development";
      return this;
    }
  }
  module.exports = Tutorial01;
  ```
  Register in `/saito/node/config/modules.config.js` under `lite: [ 'tutorial01/tutorial01.js', ...]` (and `core` if it needs a server-side web address); compile with `npm run nuke` (first time) or `npm run compile`; then `npm start`. — [wiki tutorials/dev/01.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/01.md)
- Directory convention: `appname.js`, `lib/`, `sql/`, `web/`, `README.md`. `sql/` holds sqlite3 DDL; "Saito clients with database support will automatically create a sqlite3 database (`/data/appname.sq3`) on installation if there are table definition files in this directory." `web/` is served at `https://appserver.com/appname`. — [wiki docs/module-api.md](https://github.com/SaitoTech/wiki/blob/master/docs/module-api.md)
- Default `modules.config.js` template lists core: `website, arcade, archive, chat, chess, encrypt, explorer, nftstudio, poker, qrscanner, relay, redsquare, registry, settings, settlers, solitrio, wordblocks, stun`; lite is the same minus `explorer`. — [node/config/.template.modules.config.js](https://github.com/SaitoTech/saito/blob/master/node/config/.template.modules.config.js)
- `node/AGENTS.md` project map: `mods/<module>/` (app modules), `lib/templates/` (framework templates incl. module base), `lib/saito/` (shared framework + UI components), `web/` (shared browser assets), `config/build/` (TS + Webpack config), `config/modules.config.js`, `scripts/`, `tests/`. Verification commands: `npm run compile -- dev`, `npm run dev`, `npm test -- --runInBand`. It warns "Webpack treats certain request strings, including `.html`, `.css`, and paths through `web/`, as externals" and "follow the `.template.js` convention" for markup helpers. — [node/AGENTS.md](https://github.com/SaitoTech/saito/blob/master/node/AGENTS.md)
- 95 modules exist in `node/mods/` including: `admin, arcade, archive, chat, crypto, devtools, encrypt, explorer, faucet, fileshare, invites, library, mixin, modtools, nftstudio, nwasm, profile, redsquare, registry, relay, rustscript, settings, stack, store, stun, vault, videocall, warehouse, website, zk-poll` plus many games (`twilight, his, imperium, chess, poker, ...`) and crypto bridges (`btc, eth, sol, usdc, usdt, xmr, zec, ...`). — [node/mods listing](https://api.github.com/repos/SaitoTech/saito/contents/node/mods?ref=master)

**ModTemplate lifecycle and API (from source)**
- Constructor fields: `name, slug, description, appname, dbname, link, img, teaser, events[], categories, services[], components[], db_tables[], urlpath[], version, styles[], scripts[], browser_active, possibleHome, publicKey`. — [modtemplate.js](https://github.com/SaitoTech/saito/blob/master/node/lib/templates/modtemplate.js)
- Methods (line numbers in source): `installModule(app)` (136), `initialize(app)` (224), `render()` (322), `initializeHTML(app)`, `attachEvents(app)`, `receiveNFT(nft)` (422), `onConfirmation(blk, tx, confnum)` (436), `onNewBlock(blk, lc)`, `onChainReorganization(block_id, block_hash, lc)`, `onUpgrade(...)`, `onPeerHandshakeComplete(app, peer)`, `onPeerServiceUp(app, peer, service)`, `onConnectionStable/Unstable`, `shouldAffixCallbackToModule(modname, tx)`, `webServer(app, expressapp, express)` (551), `addScript/addStyle/addComponent/removeComponent`, `renderInto(querySelector)`, `respondTo(request_type, obj)` (920), `receiveEvent/sendEvent`, `handlePeerTransaction(app, tx, peer, mycallback)` (955), `returnServices()`, `sendPeerRequestWithServiceFilter(servicename, msg, cb)`, `sendPeerRequestWithFilter(...)`, `sendPeerDatabaseRequestRaw(db, sql, cb)`, `returnSlug()`, `displayModal/displayWarning`, `hasSeenTransaction(tx)`, `onWebSocketServer(wss)`. — [modtemplate.js](https://github.com/SaitoTech/saito/blob/master/node/lib/templates/modtemplate.js)
- Other templates in `node/lib/templates/`: `cryptomodule.js`, `nftcryptomodule.js`, `dbmodtemplate.js`, `gametemplate.js`, `oneplayer-gametemplate.js`, `table-gametemplate.js`, `uimodtemplate.js`, `invitetemplate.js`, `dynamic-module-loader.template.js`. — [lib/templates listing](https://api.github.com/repos/SaitoTech/saito/contents/node/lib/templates?ref=master)
- Wiki Module API doc: `onConfirmation(blk, tx, conf, app)` "is executed whenever a transaction receives an additional confirmation ... The first time it is executed conf will be provided as 0"; `handlePeerTransaction(app, tx, peer, mycallback)` "is executed whenever a transaction is received from a peer over the peer-to-peer network (i.e. not an on-chain transaction)"; `shouldAffixCallbackToModule(modname, tx)` decides whether a module processes a transaction (default: those addressed to it via `txmsg.module`); `respondTo(type)` lets modules query others (e.g., Arcade queries games that `respondTo('arcade-games')`). — [wiki docs/module-api.md](https://github.com/SaitoTech/wiki/blob/master/docs/module-api.md)

**Sending and receiving transactions (tutorial code)**
- Send:
  ```js
  let newtx = await this.app.wallet.createUnsignedTransaction();
  newtx.msg = { module: this.name, data: { random: Math.random() } };
  await newtx.sign();
  this.app.network.propagateTransaction(newtx);
  ```
  — [wiki tutorials/dev/02.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/02.md)
- Receive on-chain: `async onConfirmation(blk, tx, conf) { if (Number(conf) == 0) { if (this.app.BROWSER) { this.ui.receiveTransaction(tx); } } }` and read with `tx.returnMessage()`. — [wiki tutorials/dev/03.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/03.md)
- Off-chain relay pattern (Chat): `handlePeerTransaction` unwraps `txmsg.request == 'chat relay'` into `new Transaction(undefined, txmsg.data)`; tutorial notes `app.network.sendTransactionWithCallback`, `sendRequestAsTransaction`, and the `Relay` module for targeting a publicKey. — [wiki tutorials/dev/04.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/04.md)
- Standard `tx.msg` fields: `msg.module` (target module), `msg.request` (operation e.g. "save", "load", "mint", "transfer"), `msg.data` (deterministic, hashed and signed), `msg.opt` (mutable, unsigned), `msg.sig`, plus script fields `access_hash/access_script/access_witness` and `payment_hash/payment_script/payment_witness`. — [wiki docs/transactions.md](https://github.com/SaitoTech/wiki/blob/master/docs/transactions.md)
- `node/lib/saito/wallet.ts` exposes `createUnsignedTransaction(publicKey = '', amount = BigInt(0), fee = BigInt(0), force_merge = false)`, `createUnsignedTransactionWithDefaultFee(...)` (falls back to fee 0 if "insufficient SAITO balance"), `createUnsignedTransactionWithMultiplePayments(...)`, `getBalance(ticker = 'SAITO')`, `signAndEncryptTransaction(tx, recipient, force_encrypt)`. `default_fee = BigInt(0)` (nolan) by default. — [node/lib/saito/wallet.ts](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts)

**Persistence**
- Tutorial 7: `this.mod.app.storage.saveOptions();` persists `this.app.options` in browser storage and "These options don't just persist between sessions, but live within the wallet. Therefore, a standard wallet backup the user performs will contain these saved module options." — [wiki tutorials/dev/07.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/07.md)
- Data topologies: blockchain data (in transactions), peer messages, "module servers" (node runs a DB and advertises a service), Archive services ("a database of transaction data. An Archive record does not imply that the transaction is currently on-chain"), local state (`memory; app.options; localForage; browser Archive storage`), direct P2P/STUN. "Module SQL is fundamentally a Node-side capability. Browsers should not assume that the module's SQLite database exists locally." "Use `app.storage` rather than depending directly on Archive." — [README/coding/SAITO-APPLICATIONS-DATA-AND-PERSISTENCE-PRACTICES.md](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-DATA-AND-PERSISTENCE-PRACTICES.md)
- Dynamic `.saito` modules: compiled by `node/scripts/dynmods/compile.js` (`npm run .saito`); "A dynamic application can be around 10 MB or more" because it bundles its own Saito/WASM dependencies; install flow is drag-and-drop into Saito -> stored in browser -> user enables -> refresh. Browser stores installed apps in IndexedDB table `dyn_mods`. — [README/coding/SAITO-DEVELOPMENT-MODULE-DISTRIBUTION-AND-RUNTIME-INSTALLATION.md](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-DEVELOPMENT-MODULE-DISTRIBUTION-AND-RUNTIME-INSTALLATION.md); [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- The monorepo ships 28 AI-agent-oriented coding chapters in `README/coding/` (e.g., `SAITO-APPLICATIONS-MODULE-MAIN-FILE-AND-MODTEMPLATE.md` 53 KB, `SAITO-APPLICATIONS-COMMUNICATION-AND-SYNCHRONIZATION.md` 61 KB, `SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md` 38 KB, `SAITO-APPLICATIONS-PAY-TO-SCRIPT-HASH.md`). — [README/coding listing](https://api.github.com/repos/SaitoTech/saito/contents/README/coding?ref=master)

### Inferences
- The framework is conceptually "every module runs on every node and in every browser at once"; `app.BROWSER` vs `this.browser_active` (slug matches URL) distinguishes global init from the active page.
- The repo is clearly being prepared for AI-assisted development (`AGENTS.md`, `.agents/`, `.codex`, `README/coding/*`), which is itself a developer-experience signal in 2026.

### Gaps
- `node/docs/applications.md` and `events.md` exist but were not read in full; the wiki Events API / Services API pages were not fetched (only indexed on docs.md).
- Tutorial 01 says `npm start`; README and wiki config say `npm run dev` — both scripts exist in `package.json`, but the docs are inconsistent about which to use.

---

## Key Question 3: JS/TS SDK (`saito-js`) for external apps or browsers

### Takeaway
`saito-js` (npm, v0.3.12, Oct 2026) is a TypeScript wrapper over the `saito-wasm` binary exposing `Saito.initialize(configs, ...)`, `Wallet`, `Transaction`, `Slip`, `Nft`, `Blockchain`, `Peer` classes; it is primarily consumed by the node client (`app.core.*`, `app.wallet`), has no npm README, and is not documented as a standalone third-party SDK, so an external app would practically embed the compiled `saito.js` browser payload or run inside a Saito module.

### Cited Findings
- `rust/saito-js/` contains `saito.ts`, `index.web.ts`, `index.node.ts`, `configs.ts`, `shared_methods.{browser,server}.ts`, and `lib/`: `balance_snapshot.ts, block.ts, blockchain.ts, factory.ts, hop.ts, network_peer.ts, nft.ts, peer.ts, peer_service.ts, slip.ts, stun_peer.ts, transaction.ts, util.ts, wallet.ts, wasm_wrapper.ts`. — [rust/saito-js/lib listing](https://api.github.com/repos/SaitoTech/saito/contents/rust/saito-js/lib?ref=master)
- `Saito` class (saito.ts): `static initialize(...)` wires callbacks `send_message`, `process_api_call`, `process_api_success`, `process_api_error`; instance methods `start()`, `getCore()`, `getWallet()`, `getBlockchain()`, `getMempoolTxs()`, `getBalanceSnapshot(keys)`, `getNftList(): Promise<string>`, `updateBalanceFrom(snapshot)`, `addPendingTx(tx)`, `produceBlockWithGt/WithoutGt`, `getBlock(blockHash)`, `addStunPeer(publicKey, rtcPeerConnection)`; `getCore()` builds `core.network.{call, getPeers, getPeer, propagateTransaction, sendTransactionWithCallback, sendRequest}`, `core.wallet.generatePublicKey`, `core.scripting.evaluate(script)` / `evaluateWithTransaction(...)`, `core.blockchain.get/getBlock/getBlocks`. — [rust/saito-js/saito.ts](https://github.com/SaitoTech/saito/blob/master/rust/saito-js/saito.ts)
- `Wallet` class (lib/wallet.ts): `save()`, `load()`, `reset(keepKeys)`, `getPublicKey()`, `setPublicKey(key)`, `getPrivateKey()`, `setPrivateKey(key)`, `getBalance()`, `getPendingTxs()`, `getSlips(): Promise<WalletSlip[]>`, `addSlips(slips)`, `getKeyList()`, `setKeyList()`, `addToPending(tx)`, `addNft(slip1UtxoKeyHex, slip2UtxoKeyHex, slip3UtxoKeyHex, idHex, txSigHex, ticker = "")`, and
  ```ts
  createNFTTransaction(recipientPublicKey: string, nftAmount: bigint, nftUuid: string,
                       fee: bigint = 0n, saitoDeposit: bigint = 0n, txMsg: object = {})
  ```
  which JSON-encodes `txMsg` into the tx data payload. — [rust/saito-js/lib/wallet.ts](https://github.com/SaitoTech/saito/blob/master/rust/saito-js/lib/wallet.ts)
- `Transaction` class (lib/transaction.ts): `msg: any = {}`, `addFromSlip(slip)`, `addToSlip(slip)`, getters `to`, `from`, `routing_path`, `type: TransactionType`, `timestamp`, `signature`, `data: Uint8Array`, `total_fees: bigint`; `sign()`, `isFrom(key)`, `isTo(key)`, `toJson()`, `serialize()/deserialize(buffer)`, `packData()/unpackData()` (JSON msg <-> bytes), `clone()`, `generateHashForSignature()`. — [rust/saito-js/lib/transaction.ts](https://github.com/SaitoTech/saito/blob/master/rust/saito-js/lib/transaction.ts)
- `Nft` class (lib/nft.ts): getters `id: Uint8Array`, `slip1/slip2/slip3: WasmSlip`, `tx_sig`; `static fromString(str)`; `toJSON()` returns `{ id (hex), tx_sig (hex), ticker, slip1{amount, slip_type, public_key, block_id, tx_ordinal, slip_index, utxo_key}, slip2{...}, slip3{...} }`. — [rust/saito-js/lib/nft.ts](https://github.com/SaitoTech/saito/blob/master/rust/saito-js/lib/nft.ts)
- The Node client re-exports the wasm wallet as `app.core.wallet` and wraps it in `app.wallet` (`node/lib/saito/wallet.ts`): e.g. `createMintNFTTransaction(...)` calls `this.app.core.wallet.createBoundTransaction(...)` and `createNFTTransaction(...)` calls `this.app.core.wallet.createNFTTransaction(...)`. — [node/lib/saito/wallet.ts](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts)
- Refactor 2026: "`app.core.*` now provides direct access to consensus functionality without requiring application-specific wrappers"; "Significantly expanded the Rust <-> WASM interface, exposing substantially more consensus functionality to JavaScript"; "New local linking pipeline allows developers to build against locally compiled Rust libraries." — [wiki refactor-2026/building-on-saito.md](https://github.com/SaitoTech/wiki/blob/master/refactor-2026/building-on-saito.md)
- Local build/link of the SDK: `cd rust/saito-wasm && npm install && npm run build && npm link`; `cd rust/saito-js && npm install && npm link saito-wasm && npm run build && cd dist && npm link`; then in `node/`: `npm install && npm link saito-js && npm run compile`. Shortcut: `npm run linklocal` after first setup. — [wiki install/full.md](https://github.com/SaitoTech/wiki/blob/master/install/full.md)
- The node README says: "Developers may also build applications that integrate directly with the blockchain-layer REST API described below. Tools to assist with this will be coming shortly." (the REST API section itself is commented out in the README; `node/docs/restapi.md` exists). — [node/README.md](https://github.com/SaitoTech/saito/blob/master/node/README.md)
- An older package `saito-lib` ("a Javascript library that allows developers to connect their Javscript application to the Saito blockchain") exists on npm but was not referenced by any 2025-2026 doc. — [npm saito-lib](https://npmjs.com/package/saito-lib)

### Inferences
- `saito-js` is an internal-facing SDK: types exist and are stable enough to publish monthly, but there is no quickstart for using it outside the `node/` client. The realistic "SDK" for an NFT app is the `app` object inside a module (`app.wallet`, `app.network`, `app.storage`, `app.crypto`, `app.keychain`, `app.connection`), or the compiled `web/saito/saito.js` payload loaded into any page.
- A third-party web app that wants direct chain access would likely either (a) ship as a `.saito` dynamic module, or (b) run a Saito node and expose its own REST/WebSocket service via `webServer()`/`returnServices()`.

### Gaps
- No npm README, typedoc, or standalone quickstart for `saito-js` was found; the `saitotech.github.io/saito-rust-workspace/` API guide link was not verified.
- `node/docs/restapi.md` content was not fetched, so whether a usable REST API for external apps exists today is unconfirmed.

---

## Key Question 4: How the Saito wallet works and how a third-party NFT app connects to it

### Takeaway
The wallet is a secp256k1 keypair generated on first run and persisted in `app.options.wallet` (browser localStorage-style storage via `app.storage`, or `config/options` on nodes); backup is a downloaded `saito-wallet-<publicKey>.json` export of options (including module options and NFT list), and encryption on nodes is via the `SAITO_PASS` env var. There is no external wallet-connect protocol: an NFT app connects by running *inside* the user's wallet as a module (or as an NFT/`.saito` payload the user installs), then calling `app.wallet.*`.

### Cited Findings
- "If no wallet data exists on start the node will auto generate a public/private key pair and store these in the wallet ... To backup the wallet simply backup the `config/options` file. To encrypt the wallet, add a `SAITO_PASS` environment variable." — [wiki config/network.md](https://github.com/SaitoTech/wiki/blob/master/config/network.md)
- `backupWallet()` in the browser creates a hidden anchor with `data:application/json;utf-8,` + `encodeURIComponent(this.exportWallet())` and downloads `saito-wallet-${publicKey}.json`. — [node/lib/saito/wallet.ts L1324](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts)
- "`app.options.wallet` contains a persistent representation of wallet information... `app.options` is a general persistence mechanism and configuration document. It is not a secure hardware-backed key vault. The current implementation persists wallet private-key material in wallet options. Browser persistence uses the application's local storage mechanism." "Applications should not create redundant copies of the wallet private key... Use the wallet API." — [README/coding/SAITO-FRAMEWORK-PKI-IDENTITY-WALLETS-AND-CRYPTOGRAPHY.md](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-FRAMEWORK-PKI-IDENTITY-WALLETS-AND-CRYPTOGRAPHY.md)
- Wallet API surface listed in that chapter: public key, private key, create/sign transactions, manage slips, manage NFTs, manage fees, import/export; adjacent APIs `app.crypto`, `app.keychain` (contacts/DH keys), `app.network`. The wallet "is not a conventional web account" (no username/password/session/JWT). — same source
- Developers page: "Instead of pushing transactions to smart-contracts, you write applications that run inside user wallets. Users choose whether or not they want to run them... The easiest way to write an application is actually to put it inside an NFT and let users send it around the network... you do not *need* to run a node to run applications on the network. You need to run a node to develop most applications." — [wiki developers.md](https://github.com/SaitoTech/wiki/blob/master/developers.md)
- PR #709 commit list includes "restores NFTs when importing a wallet", confirming NFT holdings are rehydrated from the wallet backup. — [SaitoTech/saito PR #709](https://github.com/SaitoTech/saito/pull/709)
- The wallet reloads its NFT list on startup via `addNFTList()` (replays the saved list into the Rust wallet) and `loadNFTs()` which "runs `data.js` and injects `data.css` only for signatures in [`app.options.permissions.nfts`]"; enabling is "a local decision. It is not a transfer and it is not consensus." — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- Node `package.json` includes `bip39` and `secp256k1` dependencies; user tutorials (not fetched) cover "creating a wallet, backing it up, installing modules, adding friends, sending and receiving SAITO, migrating tokens." — [node/package.json](https://github.com/SaitoTech/saito/blob/master/node/package.json); [wiki tutorials.md](https://github.com/SaitoTech/wiki/blob/master/tutorials.md)
- Wallet events: `app.connection.on('on-nft-sent', ...)` and `app.connection.on('on-nft-received', ...)` are registered in `wallet.ts` (L204-213), and the Store mod listens on `on-nft-received`. — [wallet.ts](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts); [store.js](https://github.com/SaitoTech/saito/blob/master/node/mods/store/store.js)

### Inferences
- There is no equivalent of WalletConnect/MetaMask injection; "connecting to a user's wallet" means being a module in the user's Saito client. A third-party NFT gallery therefore ships as a mod (compiled into a node's bundle or distributed as a `.saito`/NFT), and reads holdings from `app.options.wallet.nfts` after `app.wallet.updateNFTList()`.
- Because the private key sits in browser storage, security-sensitive apps should expect the "NFTSecurityOverlay" warning flow before enabling any JS/`.saito` payload.

### Gaps
- Whether a seed-phrase (bip39) flow exists for user wallets was not confirmed from docs (dependency present only).
- The user-facing wallet-management tutorial HTML (`tutorials/saito_wallet_management.html`) was not fetched.

---

## Key Question 5: Transaction types and fields, NFT/"bound" slips, size limits, fees

### Takeaway
Consensus defines `TransactionType { Normal=0, Fee=1, GoldenTicket=2, ATR=3, Vip=4 (deprecated), SPV=5, Issuance=6, BlockStake=7, Bound=8 }` and `SlipType { Normal=0, ATR=1, VipInput/Output, MinerInput/Output, RouterInput/Output, BlockStake=8, Bound=9, P2SH=10 }`; an NFT is a `Bound` transaction whose inputs/outputs contain consecutive triples `[Bound(qty, creator), Normal|ATR(deposit, owner), Bound(0, 33-byte id)]`. Fees are market/burn-fee based (blocks track `fee_per_byte` and `avg_fee_per_byte`; the client's default fee is 0 nolan), there is a 255-slip cap per side, and no fixed byte-size cap on `tx.data` was found in core.

### Cited Findings
- Enums as above. — [transaction.rs L28-40](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/transaction.rs); [slip.rs L17-29](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/slip.rs)
- NFT tuple definition: "Consensus recognizes an NFT as three consecutive slips in a transaction whose type is `TransactionType::Bound`: slip1 `Bound`, amount = quantity > 0, key = creator; slip2 `Normal` or `ATR`, amount = deposit in nolans (may be 0), key = current owner; slip3 `Bound`, amount must be 0, key = NFT id." "slip2 is the spendable custody slip... Its amount is the SAITO deposit that travels with the NFT and is what automatic transaction rebroadcast (ATR) treats as the payload." — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md); enforced in `nft::from_slips` — [nft.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/nft.rs)
- NFT id: `Wallet::create_nft_uuid(input_slip, nft_type) -> [u8; 33]` = `block_id` (8 BE bytes) + `tx_ordinal` (8) + `slip_index` (1) + `nft_type` UTF-8 padded/truncated to 16 bytes. "all NFTs have a UUID that is created from the UTXO slip that the creator selects as an input value... no-one else will be able to create an NFT with the same values." — [wallet.rs L2147](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/wallet.rs)
- Rust wallet NFT functions: `generate_nft_slips`, `create_nft_transaction(recipients, nft_amounts, nft_uuid, fee, saito_deposit, tx_msg)` ("SENDS existing NFTs, it does not CREATE them"), `create_bound_transaction(nft_num, nft_create_deposit_amt, tx_msg, recipient, _network, _latest_block_id, _genesis_period, nft_type)` (mint), `create_send_bound_transaction`, `create_split_bound_transaction`, `create_atomize_bound_transaction`, `create_merge_bound_transaction`, `create_remove_bound_transaction`, `return_nft_sender_publickey`, `add_nft`. — [wallet.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/wallet.rs)
- Validation of Bound txs (transaction.rs ~L1312-1530) enforces: slip1 input non-zero, slip3 zero, single creator, single uuid, single sender; "no bound slips outside tuples"; includes a backwards-compat edge case for "early on-chain NFTs [that] erroneously set a.public_key to the b.public_key value". Bound slip amounts are excluded from `nolan_in/out` fee accounting ("we are not counting the value in Bound slips"). — [transaction.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/transaction.rs)
- Transaction fields (from Debug impl): `type, data_size, timestamp, signature, hash, total_in, total_out, total_fees, total_work_for_me, cumulative_fees, from slips`; `tx.data` is the byte payload; JS `packData()` serializes `msg` JSON into `data`. Slip counts per side are capped: `if self.from.len() > u8::MAX ... / if self.to.len() > u8::MAX` (255). — [transaction.rs L755-760](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/transaction.rs)
- Fee model: `total_fees = nolan_in - nolan_out`; routing work halves per hop (`routing_work_this_hop / 2`). Block consensus values track `fee_per_byte` ("avg byte fees paid by all txs (single block)") and `avg_fee_per_byte` ("smoothed avg fee per byte (last epoch)"). Burn fee: `return_routing_work_needed_to_produce_block_in_nolan(burn_fee_previous_block, current_ts, previous_ts, heartbeat)` returns 0 once `elapsed_time >= 2 * heartbeat`. `NOLAN_PER_SAITO = 100_000_000`; `MAX_TOKEN_SUPPLY = 7_000_000_000 SAITO`. — [transaction.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/transaction.rs); [block.rs L106-110](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/block.rs); [burnfee.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/burnfee.rs); [defs.rs](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/defs.rs)
- Client default fee: `default_fee = BigInt(0); // in nolan`, persisted at `app.options.wallet.default_fee`. — [node/lib/saito/wallet.ts L33](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts)
- Consensus params in default config: `genesis_period 80640` blocks, `heartbeat_interval 30000` ms, `prune_after_blocks 99`, `default_social_stake 100000000000000` nolan (1,000,000 SAITO) "amount that must be staked to produce a block", `default_social_stake_period 100`, `block_confirmation_limit 1`. — [node/config/.template.options.conf](https://github.com/SaitoTech/saito/blob/master/node/config/.template.options.conf); [wiki config/network.md](https://github.com/SaitoTech/wiki/blob/master/config/network.md)
- Payload guidance: "Large content does not belong in the tuple. It may be inline in `data` when it is small enough to justify the transaction, or it may be a reference. Vault stores the file in Archive and puts `file_id` on the NFT message." Embedded-image NFT recipe "makes the NFT larger, but eliminates the need to fetch content from another server." — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md); [wiki nfts.md](https://github.com/SaitoTech/wiki/blob/master/nfts.md)
- Scripting (RustScript / P2SH): access scripts are JSON expression trees `{ "op": "<OPCODE>", "args": [...] }` with opcodes `AND, OR, NOT, CHECKSIG, CHECKMULTISIG, CHECKOWN, CHECKEXPIRY`; limits "Maximum recursion depth: 8; Maximum total nodes per script: 16; No loops or side effects." — [wiki docs/scripting.md](https://github.com/SaitoTech/wiki/blob/master/docs/scripting.md). NFT-specific opcodes `CHECKOWNNFT`, `CHECKOWNNFTWHERE`, `CHECKPATH`, `CHECKPATHHOP`, `IMPORTFIELD` are referenced in the NFT chapter. — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- Sept 2025 core-node update on X mentioned fixes for NFT "slips" and NFT group validation. — [@SaitoOfficial](https://x.com/SaitoOfficial/status/1963024866422161889)

### Inferences
- Data-carrying transactions pay fees in proportion to bytes through the routing-work/burn-fee market rather than a fixed schedule; the network's `avg_fee_per_byte` is the practical signal. With the client default at 0 nolan, a zero-fee tx may simply not be included when routing work is required.
- The slip2 "deposit" matters for persistence: ATR rebroadcasting charges against it, so an NFT with a 0 deposit may be pruned at the end of the genesis period unless re-funded (inference from ATR description; the exact ATR fee math was not read).

### Gaps
- No explicit maximum transaction size or block size constant was found in `defs.rs`, `mempool.rs`, `block.rs` or `transaction.rs`; a network-level message cap may exist in `core/network` but was not located.
- The precise ATR rebroadcast fee formula and how it draws on slip2 was not extracted.

---

## Key Question 6: Running a node (build, ports, mainnet, hardware, testnet/local dev)

### Takeaway
Node client: Node.js >= 16, 2 GB RAM minimum, `git clone https://github.com/saitotech/saito && cd saito/node && npm install && npm run nuke && npm run dev`, serving `http://localhost:12101`; production uses `config/options.conf` with an `endpoint` behind NGINX/Let's Encrypt (websockets + CORS) and peers `eames.saito.io:443` (USA) / `arthur.saito.io:443` (EU). A local dev mode is the default (no peers, `disable_block_production: true`); a public testnet with faucet exists at `staging.saito.io`. The Rust client is `cd rust/scripts && ./initial_setup.sh` then `RUST_LOG=debug cargo run`. No Docker image or hardware spec beyond RAM was found.

### Cited Findings
- Requirements: "Machine with at least 2GB RAM. Build tools: git, g++, make, python, tsc. Stack: node.js (v.16+), npm (v6+). TypeScript." Install: `git clone https://github.com/saitotech/saito; cd saito/node; npm install`. — [node/README.md](https://github.com/SaitoTech/saito/blob/master/node/README.md)
- Default options template: server `localhost:12101` http, `peers: []`, `spv_mode: false`, `browser_mode: false`, `consensus.disable_block_production: true`. — [.template.options.conf](https://github.com/SaitoTech/saito/blob/master/node/config/.template.options.conf)
- "`config/options.conf` is the main configuration file ... When you run Saito for the first time, this file is copied over into `config/options` which will contain your configuration options along with wallet information." `npm run nuke` = hard reset (chain + wallet) + compile; `npm run compile` = recompile apps without resetting; `dev` flag (`npm run compile dev`) ships unminified JS + source maps and linked CSS. — [wiki config.md](https://github.com/SaitoTech/wiki/blob/master/config.md)
- Mainnet peers: "The Saito project runs two nodes specifically designed to provide blocks: `eames.saito.io` (USA, port 443, https) and `arthur.saito.io` (EU, port 443, https)." Peer entries take `host, port, protocol, synctype: "full"|"lite"`. "Do not edit consensus values unless you are running a test network or developing locally." — [wiki config/network.md](https://github.com/SaitoTech/wiki/blob/master/config/network.md)
- Deploy guide (Ubuntu 22.04/24.04): "Quick Deploy Script for Ubuntu 24.04" gist; NGINX reverse proxy to `localhost:12101`, certbot SSL, websocket upgrade headers, CORS; then set `endpoint` to `yourdomain.com:443 https` and `npm run nuke`. — [wiki install/deploy.md](https://github.com/SaitoTech/wiki/blob/master/install/deploy.md); [quick deploy gist](https://gist.github.com/arpee/22cec55b8e74c09c2e17e5a42eead6cf)
- Rust client: `cd saito/rust/scripts && ./initial_setup.sh` then `cd ../saito-rust && RUST_LOG=debug cargo run`; "You can test if Saito is running on your machine by pointing your browser to http://localhost:12101/ ... It is not a full-featured web3-server." — [wiki install/saito-rust.md](https://github.com/SaitoTech/wiki/blob/master/install/saito-rust.md). Rust README adds `cp configs/config.template.json configs/config.json`, `cp data/issuance/issuance.template data/issuance/issuance`, `mkdir data/blocks`. — [rust/README.md](https://github.com/SaitoTech/saito/blob/master/rust/README.md)
- WASM build: `cargo install wasm-pack; cd saito-wasm; npm install; npm run build` (or `wasm-pack build --debug --target browser`). — [wiki install/full.md](https://github.com/SaitoTech/wiki/blob/master/install/full.md); [wiki install/saito-wasm.md](https://github.com/SaitoTech/wiki/blob/master/install/saito-wasm.md)
- Testnet: "we recommend grabbing some tokens from the Saito testnet faucet (https://staging.saito.io/faucet). You can then copy-and-paste these examples directly into your browser on staging." A `faucet` mod exists in `node/mods/`. — [wiki nfts.md](https://github.com/SaitoTech/wiki/blob/master/nfts.md); [mods listing](https://api.github.com/repos/SaitoTech/saito/contents/node/mods?ref=master)
- Mainnet: press release dated Dec 16, 2025, "Saito Blockchain Launches Mainnet"; nodes "compensated for routing, storage, and compute work"; "Smart NFTs" described as "dynamic, logic-bearing assets" that remove the need for complex VMs; Block Staking described as non-inflationary; ATR limits chain bloat. The article is a sponsored release with unverified claims ("more than 70 million blocks"). — [GlobeNewswire via Manila Times](https://www.manilatimes.net/2025/12/16/tmt-newswire/globenewswire/saito-blockchain-launches-mainnet-pioneering-decentralised-web3-infrastructure/2244176)
- CI workflows present: `issuance-test.yml, linting.yml, publish.yml, run-e2e.yml, rust-test-ci.yml`; no `Dockerfile` or docker-compose was found in root, `node/`, `rust/saito-rust/`, or `rust/scripts/` listings. — [.github/workflows listing](https://api.github.com/repos/SaitoTech/saito/contents/.github/workflows?ref=master)
- Node scripts of note: `npm run dev` (ts-node-dev, `--max_old_space_size=8144`), `npm start` (`--max-old-space-size=8192`), `npm run nuke`, `npm run compile`, `npm run .saito` (dynmods compile), `npm run linklocal`, `npm run generate-issuance`, `npm run generate-utxoset`, `npm run nettest`, `npm run promote:prod`, `npm run module-databases`. — [node/package.json](https://github.com/SaitoTech/saito/blob/master/node/package.json)

### Inferences
- The `--max-old-space-size=8192` flags in start scripts suggest a comfortable production node wants 8+ GB of RAM despite the "2 GB minimum" in the README.
- "Local dev mode" is simply the default template (no peers, block production disabled) — a developer can also set `heartbeat_interval` lower for a private test chain, per the config doc's caveat.

### Gaps
- No official Docker image, CPU/disk sizing, or bandwidth guidance was found.
- No dedicated testnet documentation page (chain params, faucet limits, reset cadence) beyond the single `staging.saito.io/faucet` mention.

---

## Key Question 7: Developer docs, tutorials, and example modules

### Takeaway
Documentation is split across wiki.saito.io (source: `SaitoTech/wiki`, actively updated through Sept 2026), the `node/docs/` folder, and the new AI-oriented `README/coding/` chapters in the monorepo; the dev tutorial series (7 parts, refreshed Dec 2025) walks from Hello World through sending/receiving transactions, chat relay, menus/events, CSS injection, and persistent options. Reference apps named by the docs: Arcade, RedSquare, Chat, Registry, Vault, Stack, Store, N-WASM, Twilight Struggle.

### Cited Findings
- Wiki docs index (updated 2026-09-09): General Conventions (`/docs/modules`), UI Components (`/docs/ui-components`), CSS Design (`/docs/css`), ZK-Proofs (`/docs/zk-proofs`), Wasm Support (`/docs/wasm`), Transaction API (`/docs/transactions`), Scripting API (`/docs/scripting`), Module API (`/docs/module-api`), Events API (`/docs/events-api`), Services API (`/docs/services-api`), Network API (`/docs/network-api`), Architecture (`/docs/architecture`, ~110 KB). — [wiki docs.md](https://github.com/SaitoTech/wiki/blob/master/docs.md); [wiki/docs listing](https://api.github.com/repos/SaitoTech/wiki/contents/docs?ref=master)
- Dev tutorials: 01 Basic Application Structure (2025-12-03), 02 Sending Transactions and UI Components, 03 Receiving Transactions, 04 Chat Monitor, 05 Saito Menus and More (inter-module communication, `respondTo`, events), 06 Modifying CSS (CSS injection, overlays), 07 Keyword Filtering (saving options). Hosted at `https://wiki.saito.io/en/tutorials/dev`. — [wiki tutorials/dev/*.md](https://github.com/SaitoTech/wiki/tree/master/tutorials/dev)
- Wiki also has `install/{overview,linux,mac,windows,full,deploy,compile,upgrade,saito-rust,saito-wasm}.md`, `config/{applications,network}.md`, `software/debugging.md`, `refactor-2026/{assets,building-on-saito,decentralized-finance,integration,rust-pipeline,saito-store,user-experience}.md`, `nfts.md`, `rustscript.md`, `tokenomics.md`, `roadmap.md`. — [wiki repo listing](https://api.github.com/repos/SaitoTech/wiki/contents?ref=master)
- `node/docs/`: `advanced-configuration.md, appcontext.md, applications.md, consensus/, events.md, gaming/, polkadot-old.md, restapi.md, roadmap.md, services.md, validation.md, web3/, saito-whitepaper.pdf, saito-litepaper.pdf`. — [node/docs listing](https://api.github.com/repos/SaitoTech/saito/contents/node/docs?ref=master)
- Node README points to the Module API, Events API, Services API, Network API wiki pages, and recommends starting with Saito Arcade and Red Square "since they serve as hubs and integrate many other popular applications"; also lists Saito Talk (videocall), Saito Chat, Swarmcast, Fileshare. — [node/README.md](https://github.com/SaitoTech/saito/blob/master/node/README.md)
- `node/AGENTS.md` maps tasks to chapters, e.g. "NFTs or scripts -> SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md; SAITO-APPLICATIONS-PAY-TO-SCRIPT-HASH.md"; "Module packaging -> SAITO-DEVELOPMENT-MODULE-DISTRIBUTION-AND-RUNTIME-INSTALLATION.md"; notes "Some `../README/coding/` chapters, including the game-engine chapter, are placeholders." — [node/AGENTS.md](https://github.com/SaitoTech/saito/blob/master/node/AGENTS.md)
- Example NFT recipes on the wiki (Nov-Dec 2025): JS NFTs (replace images via external URL or embedded base64, keyboard shortcuts, clickable menu item via `respondTo` to the Saito Header, overlay with wallet save/load), CSS NFTs ("Custom CSS Theme -- The Matrix Recipe": "CSS NFTs let you re-skin ALL SAITO APPS"), combined JS+CSS via "JSON" NFT-type in the CREATE NFT overlay, and "Add Support for Mixin Crypto" (adds any Mixin-supported web3 crypto to the wallet). — [wiki nfts.md](https://github.com/SaitoTech/wiki/blob/master/nfts.md)
- Older tutorial links (`org.saito.tech/introduction-to-saito-development`, `saitotech.github.io/saito-lite`) are still referenced in the archived `saito-lite-rust` README. — [saito-lite-rust](https://github.com/SaitoTech/saito-lite-rust)

### Inferences
- The docs are reasonably current for module basics and NFTs (late-2025/2026 dates) but are spread across three places with some stale cross-links (e.g., Tutorial 7 still links to `saito-lite-rust`).

### Gaps
- No YouTube developer tutorial series or Medium dev posts from 2025-2026 were found in search; this was not exhaustively searched.
- `saito.io/developers` rendered only "Checking for Dynamic Modules..." (client-side app), so its content could not be captured.

---

## Key Question 8: Existing NFT / asset-related modules and their code structure

### Takeaway
NFT functionality is split between the framework (`node/lib/saito/wallet.ts` NFT methods, `node/lib/saito/ui/saito-nft/*` UI kit, `node/lib/templates/nftcryptomodule.js`) and mods: `nftstudio` (browser code editor that publishes JS/CSS NFTs), `store` (asynchronous P2SH marketplace with NFT listings/rentals), `vault` (access-key NFTs gating Archive files), `stack` (subscription NFTs for publishing), `nwasm` (game ROMs as Vault-keyed NFTs), `library`, `warehouse`, `explorer`, `faucet`, and `rustscript`.

### Cited Findings
**Framework-level NFT API (`app.wallet`)**
- `wallet.getNFTList()`, `updateNFTList()` (returns `{ updated, rebroadcast, persisted }`), `addNft(slip1, slip2, slip3, id, txSig, ticker)`, `saveNFTList(nfts)`, `addNFTList()`, `loadNFTs()`, `addNFTToWallet(nft_id, ticker)`, `onNewBoundTransaction(tx)`, `extractNFTType(hex)`, `computeNFTIdFromTx(tx)`, `createMintNFTTransaction(num, deposit, tx_msg, fee, recipient, nft_type)`, `createNFTTransaction(nft, recipient, amount, fee, deposit, tx_msg)`, `createNFTShardTransaction(nft, recipient)` (legacy bound path), `createSplitNFTTransaction(nft, leftCount, rightCount)`, `createMergeNFTTransaction(nft)`, `createAtomizeNFTTransaction(nft)`, `createRemoveNFTTransaction(nft)`. — [node/lib/saito/wallet.ts L98, L1586-2151](https://github.com/SaitoTech/saito/blob/master/node/lib/saito/wallet.ts); table in [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- Mint call:
  ```js
  const tx = await app.wallet.createMintNFTTransaction(
    BigInt(quantity), depositNolan, txmsg, feeNolan, recipientPublicKey, nftType);
  await tx.sign();
  await app.network.propagateTransaction(tx);
  ```
  "The NFT is not in `getNFTList` until the transaction is confirmed and slip2 is spendable by this wallet. Call `updateNFTList` from `onConfirmation`." — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- Transfer call:
  ```js
  await nft.fetchTransaction();
  let tx = await app.wallet.createNFTTransaction(nft, recipientPublicKey, amount, fee, saitoDeposit, txmsg);
  tx = await nft.modifyBeforeSend(tx, recipientPublicKey, transferData);
  if (!tx) return; // a saito-nft-transfer handler blocked it
  await tx.sign();
  await app.network.propagateTransaction(tx);
  ```
  — same source
- UI kit under `node/lib/saito/ui/saito-nft/`: `SaitoNFT` (`new SaitoNFT(app, mod, tx, walletEntry)`; `fetchTransaction`, `returnType`, `returnCreator`, `returnMediaDisplay`, `modifyBeforeSend`, `getTotalAmount`, `remainingExpiresLabel`), `SaitoNFTCard`, `NFTOverlay`, `NFTAtomize` (UI caps: 20 outputs/tx, 100 total, 5 tx/block), `SelectNFTOverlay`, `create-overlay.js` (mint UI; built-in types `text, token, saito-app, json, css, js` plus types from modules that `respondTo('saito-create-nft')`), `NFTSecurityOverlay`, `saito-nft.css`. — same source
- `SaitoNFT.extractNFTData` reads `data.image, data.css, data.js, data.text, data.saito`, `txmsg.title`, `txmsg.description`, `data.expires_at`. — same source
- Module extension points: `respondTo('saito-create-nft')` returns `{ title, class: [nftType], text, createData }`; `respondTo('saito-nft-transfer')` with `onTransfer(nft, tx, receiver, data)` to mutate/append hops; `respondTo('saito-nft-create-footer')` (used by NFTStudio). — same source; [nftstudio.js](https://github.com/SaitoTech/saito/blob/master/node/mods/nftstudio/nftstudio.js)
- `NFTCryptoModule` (`node/lib/templates/nftcryptomodule.js`): "Treats a single NFT (by nft_id) as a CryptoModule so it can be: displayed in the wallet, selected as a payment asset, transferred fractionally, staked / wagered by games. One instance == one NFT id (aggregates all owned slips)"; ticker defaults to `NFT-<hash6>`; `chain_id = 'NATIVE'`; mirrors enums `TX_TYPE_BOUND = 8, SLIP_BOUND = 9`. — [nftcryptomodule.js](https://github.com/SaitoTech/saito/blob/master/node/lib/templates/nftcryptomodule.js)

**Mods**
- `nftstudio/` (`index.js, nftstudio.js, lib/{draft-store.js, main.js, main.template.js, validator.js}, web/`): class `NFTStudio extends ModTemplate`, slug `nftstudio`, "Create, preview, and publish JavaScript and CSS NFTs on Saito with NFT Studio, your browser-based code editor", `status = 'beta'`, categories "Utilities Development NFT"; `validator.js` validates JS with `acorn` and CSS with `csstree`; `main.js` has `publish()` emitting `{ type, description: 'JavaScript|CSS NFT created with NFT Studio', locked: ['type','content'] }` and a theme preview iframe. — [nftstudio.js](https://github.com/SaitoTech/saito/blob/master/node/mods/nftstudio/nftstudio.js); [validator.js](https://github.com/SaitoTech/saito/blob/master/node/mods/nftstudio/lib/validator.js); [lib listing](https://api.github.com/repos/SaitoTech/saito/contents/node/mods/nftstudio/lib?ref=master)
- `store/` (`store.js` 42 KB, `lib/{archive, categories, database, fulfillment-trace, helpers, images, listing, order, scripting, summary-media, summary, transactions, warehouse}.js`, `lib/ui/overlays/nft-picker.js`, `sql/`): responds to `saito-create-nft` with "Store Rental NFT" (`class: ['store-nft-rental']`, requires Vault `file_id`, `link`, `filename`, `file_access_script`); listens on `on-nft-received`; groups listings by seller and `nft_id`. — [store.js](https://github.com/SaitoTech/saito/blob/master/node/mods/store/store.js); [store/lib listing](https://api.github.com/repos/SaitoTech/saito/contents/node/mods/store/lib?ref=master); [PR #718](https://github.com/SaitoTech/saito/pull/718)
- Store design (Refactor 2026): "redesigned as asynchronous indexing-service"; "Use of Pay-to-Script-Hash (P2SH) to secure listed assets"; "Sellers no longer transfer assets to server custody"; "Store no longer mediates sales, just observes on-chain payments"; "Open API on listing page to permit similar integration elsewhere"; "The Saito store is interoperable with any third party store, no silos." — [wiki refactor-2026/saito-store.md](https://github.com/SaitoTech/wiki/blob/master/refactor-2026/saito-store.md)
- `vault/`: mints `vault-nft-key` (default) or `vault-nft-rental` NFTs with `createMintNFTTransaction(BigInt(1), oneSaitoDeposit, txmsg, 0, ownKey, nft_type)`; file stored in Archive with `owner` = script hash; NFT message holds `file_id` and `file_access_script`; download is a peer request `vault access file` evaluated with `CHECKOWNNFT`. — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md)
- `stack/`: subscription NFT type `stack`, minted via `saito-create-nft` with `createData` returning `{ module: 'Stack', duration }`; private posts gated by `CHECKOWNNFTWHERE` with `type == "stack"` and `creator == author`; transfers append hops `{ timestamp, delegate }` to `tx.msg.data.path`. — same source
- `nwasm/`: game ROM uploaded through Vault file overlay; returns `nft_id, file_id`; rental flag with local `rental_timer`. — same source
- `explorer/`: block explorer mod with `/explorer/chain` and `/explorer/chain/<hash-or-height>` fork viewer (Three.js), SQLite `data/explorer.sq3` tables `explorer_chain_blocks`, `explorer_chain_files`; a `request chain` peer request (max 50 heights, 500 records per response); offline backfill `node mods/explorer/scripts/index-blocks.js --source ... --database ...`; records "financial statistics and address indexes". — [explorer/README.md](https://github.com/SaitoTech/saito/blob/master/node/mods/explorer/README.md)
- Refactor 2026 asset features: "NFTs created directly by the wallet; Expanded NFT types including cryptocurrency tokens; NFT ownership tracked by consensus; NFT splitting; NFT merging; P2SH NFTs"; programmable ownership "Multisignature, Conditional transfers, Time-locked, Programmable royalty enforcement, Escrow-capable"; "New slip types supporting programmable ownership." — [wiki refactor-2026/assets.md](https://github.com/SaitoTech/wiki/blob/master/refactor-2026/assets.md)
- PR history: #712 "feat: saito applications as NFTs", NFT overlay CSS/JS; #709 "NFT studio feature", fixes to NFT sales and store, "restores NFTs when importing a wallet"; #718 store listings grouped by seller and NFT ID. — [PR #712](https://github.com/SaitoTech/saito/pull/712); [PR #709](https://github.com/SaitoTech/saito/pull/709); [PR #718](https://github.com/SaitoTech/saito/pull/718)

### Inferences (practical path for a mint/transfer/gallery app)
1. Install the node client (`saito/node`), run `npm run nuke && npm run dev`, open `http://localhost:12101`.
2. Create `node/mods/mygallery/mygallery.js` extending `ModTemplate`; add to `core` and `lite` in `config/modules.config.js`; `npm run compile dev`.
3. Mint: build `txmsg = { module: 'MyGallery', request: 'mint', title, description, data: { image: <data-uri or small base64>, ... } }`; call `app.wallet.createMintNFTTransaction(BigInt(1), depositNolan, txmsg, feeNolan, ownKey, 'mygallery')` (type <= 16 bytes); `sign()`; `app.network.propagateTransaction(tx)`; in `onConfirmation` call `app.wallet.updateNFTList()`. Optionally advertise a mint type via `respondTo('saito-create-nft')` so the wallet's generic Create NFT overlay offers it.
4. Gallery: after `updateNFTList()`, iterate `app.options.wallet.nfts`, filter `app.wallet.extractNFTType(entry.slip3.utxo_key) === 'mygallery'`, wrap each in `new SaitoNFT(app, this, null, entry)`, `await nft.fetchTransaction()`, render with `SaitoNFTCard`. For other users' galleries, run a node-side service: index Bound txs in `onConfirmation` into `sql/` SQLite and expose it via `returnServices()` + `handlePeerTransaction`.
5. Transfer: `createNFTTransaction(nft, recipient, BigInt(1), fee, deposit, txmsg)` -> `modifyBeforeSend` -> `sign` -> `propagateTransaction`; use `NFTOverlay` for the generic UI.
6. Sell: list via the Store (P2SH listing); or distribute the app itself as a `saito-app` NFT / `.saito` file.
7. Ship: deploy a node with NGINX/SSL peered to `eames.saito.io`/`arthur.saito.io`, or publish the module as a `.saito`/NFT so users install it into their existing wallet.

### Gaps
- `node/lib/saito/ui/saito-nft/saito-nft.js` and `create-overlay.js` were not read directly (described via the coding chapter); the chapter notes the `IMPORTFIELD` opcode field-name mismatch for Stack subscription scripts as a known inconsistency.
- `library/`, `warehouse/`, `rustscript/` mods were not inspected.

---

## Key Question 9: Tooling gaps — docs, testnet, indexers, explorers, APIs

### Takeaway
The biggest gaps for an NFT developer are: no standalone documented SDK or REST/indexer API for external (non-module) apps, no public NFT indexer or marketplace API beyond the in-client Store/Explorer mods, no Docker/hardware guidance, thin testnet docs, zero-fee defaults with no fee-estimation doc, and documentation that is split across the wiki, `node/docs`, and AI-oriented `README/coding` chapters with some stale links and placeholders.

### Cited Findings
- Node README: "Developers may also build applications that integrate directly with the blockchain-layer REST API described below. Tools to assist with this will be coming shortly." (REST section commented out). — [node/README.md](https://github.com/SaitoTech/saito/blob/master/node/README.md)
- `saito-js` and `saito-wasm` npm pages have "No README data found". — [registry.npmjs.org/saito-js](https://registry.npmjs.org/saito-js)
- `AGENTS.md`: "Some `../README/coding/` chapters, including the game-engine chapter, are placeholders"; docs "should be checked against the current implementation." — [node/AGENTS.md](https://github.com/SaitoTech/saito/blob/master/node/AGENTS.md)
- Explorer is a self-hosted mod that must be compiled in (`explorer` is in the default `core` list but not `lite`); discovery of forks "progresses while the viewer is used" and "There is no automatic full startup scan." — [explorer/README.md](https://github.com/SaitoTech/saito/blob/master/node/mods/explorer/README.md); [modules.config template](https://github.com/SaitoTech/saito/blob/master/node/config/.template.modules.config.js)
- Persistence chapter: "`app.storage` ... The current implementation has tighter coupling to the Archive module than the intended abstraction would suggest." — [persistence chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-DATA-AND-PERSISTENCE-PRACTICES.md)
- NFT chapter notes known rough edges: early on-chain NFTs with mis-set creator keys (backwards-compat branch in validation); `IMPORTFIELD` opcode field-name mismatch; `SelectNFTOverlay` type filter hard-codes `image, css, js, saito-app, vault-nft-key` so "A new type will not appear there until that set or the overlay's filter includes it." — [NFT chapter](https://github.com/SaitoTech/saito/blob/master/README/coding/SAITO-APPLICATIONS-NFTS-AND-SCRIPTING.md); [transaction.rs L1471-1479](https://github.com/SaitoTech/saito/blob/master/rust/saito-core/src/core/consensus/transaction.rs)
- Refactor 2026 is still labelled "RC1 Target Release Date: August 3rd. 2026" on a page dated 2026-07-20, indicating the asset/NFT system was in release-candidate state only ~2 months before this research. — [wiki refactor-2026.md](https://github.com/SaitoTech/wiki/blob/master/refactor-2026.md)
- NFTStudio is marked `status = 'beta'`. — [nftstudio.js](https://github.com/SaitoTech/saito/blob/master/node/mods/nftstudio/nftstudio.js)
- Store code still contains "TEMP debug" alert paths for `store-nft-rental` receipts. — [store.js L70-182](https://github.com/SaitoTech/saito/blob/master/node/mods/store/store.js)
- Monorepo popularity is low (9 stars, 8 forks on `SaitoTech/saito`; wiki 1 star), implying a small third-party developer community. — [SaitoTech/saito](https://github.com/SaitoTech/saito); [SaitoTech/wiki](https://github.com/SaitoTech/wiki)
- Tutorial 7 still links to `saito-lite-rust/tree/master/mods/tutorial07` (archived repo). — [wiki tutorials/dev/07.md](https://github.com/SaitoTech/wiki/blob/master/tutorials/dev/07.md)

### Inferences
- An NFT gallery that must show *other* users' NFTs needs its own indexer: the wallet list is local-only, and the documented on-chain ownership test (`CHECKOWNNFT`) requires the holder to present witness UTXO keys. The `explorer` mod's SQLite and `onConfirmation` are the available building blocks.
- Because scripts, Store, and NFT UI all changed in the 2026 refactor, examples older than mid-2026 (including some wiki recipes from Nov 2025) may need adjustment.

### Gaps
- No evidence either way on a hosted public explorer URL (e.g., `saito.io/explorer`) or a hosted indexer API; not verified.
- Community Q&A (Discord/Telegram/Reddit) was not indexed by search for 2025-2026 developer issues; no developer grant program page was found beyond the older Web3 Foundation grant mention.
