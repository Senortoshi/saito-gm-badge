# gm cube for Saito

**You say gm. A cube shows up next to your name. You say gm tomorrow or it goes away.**

<img src="docs/gm-cube.svg" width="128" alt="gm cube" />

- The number next to the cube is how many days in a row.
- Miss a day and the cube is gone. Your next gm starts it again at 1.
- It is not an NFT. Nothing is minted, deposited, traded or sent. saito.io can run this with an empty wallet; the node never sends a transaction.
- Only real, confirmed Red Square `gm` posts count. Anyone can check the same posts.

Spec: [`docs/PRD.md`](docs/PRD.md).

## Layout

```
mods/gmbadge/      the Saito module (drop into saito/node/mods/)
tests/gmbadge/     unit tests (kept outside mods/ so webpack never bundles them)
docs/PRD.md        what we are building and what we are not
docs/design.md     how it is built, and what we checked against the Saito source
docs/upstream/     a separate ask for SaitoTech/saito (Red Square tweet headers)
docs/research/     background research
```

## Install into a Saito node

```bash
git clone https://github.com/SaitoTech/saito && cd saito/node && npm install
cp -r /path/to/saito-gm-badge/mods/gmbadge mods/gmbadge
# add 'gmbadge/gmbadge.js' to both lists in config/modules.config.js
bash scripts/compile nuke && npm run dev
# http://localhost:12101/gmbadge
```

The node only indexes. Its wallet can be empty. See `mods/gmbadge/DEPLOY.md` for mainnet.

## Test

```bash
npm test
```

## Where the cube shows

Every name Saito draws through `app.browser.returnAddressHTML`: Chat, Arcade, League, game
playerboxes and anything using `SaitoUser`. Red Square tweet headers print the author's name by
hand, so tweet authors get the cube once
[`docs/upstream/redsquare-tweet-header.patch`](docs/upstream/redsquare-tweet-header.patch) lands upstream.
