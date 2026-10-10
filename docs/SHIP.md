# Shipping the gm badge on Saito mainnet, step by step

There is no contract to deploy. You run a node that peers with mainnet; it indexes gm posts and mints
badges; people use it through the browser wallet your node serves. Every gm and badge is a real
mainnet transaction.

## Before you start
- Linux server: Ubuntu 24.04, 4 GB RAM (Hetzner / DigitalOcean, ~$10/mo)
- A domain or subdomain (e.g. gm.yourname.com) with an A record to the server IP
- Some SAITO (1 SAITO locks per badge as the rent deposit, plus fees)

## 1. Prove it on staging first
1. On the dev PC, in `saito/node/config/options`, set peers to `staging.saito.io` (443, https) and `disable_block_production: true`.
2. `npm run dev`; the node syncs with staging.
3. Faucet test SAITO to the node wallet: https://staging.saito.io/faucet (public key is in `config/options` -> `wallet`).
4. Open http://localhost:12101/gmbadge, say gm, wait a block, confirm the badge mints. This validates `fee_saito`.

## 2. Server setup
```bash
apt update && apt install -y git nginx certbot python3-certbot-nginx
curl -fsSL https://deb.nodesource.com/setup_22.x | bash - && apt install -y nodejs
git clone https://github.com/SaitoTech/saito && cd saito/node && npm install
git clone https://github.com/Senortoshi/saito-gm-badge /opt/gmb && cp -r /opt/gmb/mods/gmbadge mods/gmbadge
# add 'gmbadge/gmbadge.js' and 'league/league.js' to BOTH lists in config/modules.config.js
bash scripts/compile nuke
```

## 3. Mainnet config (`config/options`)
- `server.host` / `server.endpoint.host` = your domain, protocol https, port 443
- `peers`: `eames.saito.io` and `arthur.saito.io`, port 443, https, synctype lite
- `consensus.disable_block_production: true`
- `"gmbadge": { "mint": true, "deposit_saito": 1, "fee_saito": 0.01 }`

## 4. TLS + reverse proxy
NGINX: proxy the domain to `localhost:12101` with websocket headers (`Upgrade`, `Connection "upgrade"`),
then `certbot --nginx -d gm.yourname.com`. Websockets are required.

## 5. Run it
```bash
npm install -g pm2
pm2 start "npm run start" --name saito && pm2 save && pm2 startup
pm2 logs saito   # watch it sync blocks
```

## 6. Fund the issuer
Back up the node wallet private key from `config/options` first (losing it breaks verification of all
future badges). Send SAITO to its public key. SAITO (ERC-20 on Gate / Uniswap) migrates one way to
mainnet at https://saito.io/migration. 50 SAITO covers 50 badges plus fees.

## 7. Open it up
Share `https://gm.yourname.com/gmbadge`. That page is a full Saito wallet with the module inside.
For saito.io users to see badges, the Saito team must merge SaitoTech/saito#719.

## 8. Announce and monitor
- Say gm from your own wallet first (badge #1).
- Post on Red Square, X, Saito Telegram.
- `https://gm.yourname.com/gmbadge/api/leaderboard` to watch; `pm2 logs saito` for "GMBadge: mint failed" (usually an empty issuer wallet).
