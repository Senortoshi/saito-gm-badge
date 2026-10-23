# Shipping the gm cube on Saito mainnet, step by step

There is no contract to deploy and nothing to fund. You run a node that peers with mainnet; it
indexes gm posts and serves streaks to the browser wallet your node serves. Every gm is a real
mainnet Red Square post.

## Before you start
- Linux server: Ubuntu 24.04, 4 GB RAM (Hetzner / DigitalOcean, ~$10/mo)
- A domain or subdomain (e.g. gm.yourname.com) with an A record to the server IP
- No SAITO needed on the node

## 1. Prove it on staging first
1. On the dev PC, in `saito/node/config/options`, set peers to `staging.saito.io` (443, https) and `disable_block_production: true`.
2. `npm run dev`; the node syncs with staging.
3. Faucet test SAITO to a browser wallet (not the node) so it can post: https://staging.saito.io/faucet
4. Open http://localhost:12101/gmbadge, say gm, wait a block, confirm the page shows 1 day in a row and the cube appears beside your name in Chat.

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

## 4. TLS + reverse proxy
NGINX: proxy the domain to `localhost:12101` with websocket headers (`Upgrade`, `Connection "upgrade"`),
then `certbot --nginx -d gm.yourname.com`. Websockets are required.

## 5. Run it
```bash
npm install -g pm2
pm2 start "npm run start" --name saito && pm2 save && pm2 startup
pm2 logs saito   # watch it sync blocks
```

## 6. Open it up
Share `https://gm.yourname.com/gmbadge`. That page is a full Saito wallet with the module inside.
For saito.io users to see cubes, the Saito team must merge the module (SaitoTech/saito#719).
For cubes on Red Square tweet authors, they also need `docs/upstream/redsquare-tweet-header.patch`
(its own PR) or an equivalent.

## 7. Announce and monitor
- Say gm from your own wallet first.
- Post on Red Square, X, Saito Telegram.
- `https://gm.yourname.com/gmbadge/api/streak/<publickey>` to check a key; `pm2 logs saito` for "GMBadge:" errors.
