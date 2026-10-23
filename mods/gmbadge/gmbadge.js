'use strict';

const ModTemplate = require('./../../lib/templates/modtemplate');
const SaitoHeader = require('./../../lib/saito/ui/saito-header/saito-header');
const SaitoOverlay = require('./../../lib/saito/ui/saito-overlay/saito-overlay');
const PeerService = require('saito-js/lib/peer_service').default;
const Streaks = require('./lib/streaks');
const P2PIndex = require('./lib/p2p-index');
const BadgeDecorator = require('./lib/ui/badge-decorator');
const GMBadgeMain = require('./lib/ui/gmbadge-main');
const STYLES = require('./lib/ui/styles');

//
// GMBadge
//
// You say gm. A cube shows up next to your name. You say gm tomorrow or it
// goes away. The number beside it is how many days in a row.
//
// The cube is a view of your confirmed Red Square gm posts, not an asset:
// nothing is minted, held, sent, sold or drained, the node never sends a
// transaction, and its wallet can be empty.
//
//   index (preferred) a node running this module advertises the `gmbadge`
//         service and keeps a SQLite index of gm posts, dated by block time.
//         It works with an empty wallet.
//
//   p2p   (fallback, no server) the wallet reads gm history from the
//         Archive of the node it is connected to and computes streaks with
//         the same rules. See lib/p2p-index.js for its limits.
//
// Earliness is the block id of a holder's first gm, not a node-assigned
// serial.
//
class GMBadge extends ModTemplate {
  constructor(app) {
    super(app);

    this.name = 'GMBadge';
    this.slug = 'gmbadge';
    this.description = 'Say gm in Red Square. A cube shows up next to your name.';
    this.categories = 'Social Utilities';
    this.icon_fa = 'fa-solid fa-cube';
    this.publisher_message =
      'Say gm in Red Square. A cube shows up next to your name. Say gm tomorrow or it goes away.';
    this.status = 'beta';
    this.class = 'utility';
    this.styles = ['/gmbadge/style.css'];

    // overridable via app.options.gmbadge
    this.config = {
      max_states: 2000
    };

    this.mode = 'p2p';
    this.states = {}; // publickey -> state (from index service or p2p)
    this.today = Streaks.dayIndex(Date.now());
    this.peer = null;
    this.p2p = null;
    this.decorator = null;
    this.main = null;
    this.header = null;
    this.overlay = null;
    this.refresh_timer = null;
    this.p2p_refresh_timer = null;
    this.p2p_seen = new Set();
    this.index_asked = new Set(); // keys looked up one by one on the index
    this.p2p_pending = new Set(); // keys whose names need re-stamping
    this.styles_injected = false;
  }

  async initialize(app) {
    await super.initialize(app);

    if (app.options?.gmbadge && typeof app.options.gmbadge === 'object') {
      Object.assign(this.config, app.options.gmbadge);
    }

    if (app.BROWSER) {
      this.injectStyles();
      this.p2p = new P2PIndex(app, this);
      this.decorator = new BadgeDecorator(app, this);
      this.decorator.start();
      this.refresh_timer = setInterval(() => this.refreshStates(), 5 * 60 * 1000);
    }
  }

  injectStyles() {
    if (this.styles_injected || typeof document === 'undefined') {
      return;
    }
    if (document.getElementById('gmbadge-styles')) {
      this.styles_injected = true;
      return;
    }
    const style = document.createElement('style');
    style.id = 'gmbadge-styles';
    style.textContent = STYLES;
    document.head.appendChild(style);
    this.styles_injected = true;
  }

  //////////////////
  // Services     //
  //////////////////

  returnServices() {
    const services = [];
    if (this.app.BROWSER == 0) {
      services.push(new PeerService(null, 'gmbadge'));
    }
    return services;
  }

  async onPeerServiceUp(app, peer, service = {}) {
    if (!app.BROWSER || service.service !== 'gmbadge') {
      return;
    }
    if (this.app.browser?.returnURLParameter?.('p2p')) {
      return; // dev switch: force p2p mode even when an index service exists
    }
    this.peer = peer;
    this.mode = 'index';
    await this.refreshStates();
  }

  //
  // We want every Red Square transaction, not only our own.
  //
  shouldAffixCallbackToModule(modname, tx = null) {
    if (modname === 'RedSquare') {
      return 1;
    }
    return 0;
  }

  //////////////////
  // On-chain     //
  //////////////////

  async onConfirmation(blk, tx, conf) {
    if (Number(conf) !== 0) {
      return; // confirmations arrive as BigInt; only act on the first
    }
    const txmsg = tx.returnMessage();
    if (!txmsg) {
      return;
    }

    //
    // a gm post in Red Square
    //
    if (txmsg.module === 'RedSquare' && txmsg.request === 'create tweet') {
      if (!Streaks.isGm(txmsg.data?.text)) {
        return;
      }
      const publickey = tx.from?.[0]?.publicKey ? String(tx.from[0].publicKey) : '';
      if (!publickey) {
        return;
      }
      const ts = Number(blk?.timestamp) || Number(tx.timestamp) || Date.now();
      const day = Streaks.dayIndex(ts);

      if (this.app.BROWSER) {
        if (this.mode === 'p2p' && this.p2p) {
          if (publickey !== this.publicKey && !this.states[publickey]) {
            return; // only re-read keys we already follow
          }
          delete this.p2p.cache[publickey];
          this.p2p.stateFor(publickey, true).then((st) => this.absorbP2P(publickey, st));
        } else if (publickey === this.publicKey) {
          setTimeout(() => this.refreshStates(), 2000);
        }
        return;
      }

      await this.receiveGm(publickey, day, String(tx.signature), ts, Number(blk?.id || 0));
    }
  }

  //////////////////
  // Indexer      //
  //////////////////

  async receiveGm(publickey, day, sig, ts, block_id) {
    let inserted = 0;
    try {
      const res = await this.app.storage.runDatabase(
        'INSERT OR IGNORE INTO gms (publickey, day, sig, ts, block_id) VALUES (?, ?, ?, ?, ?)',
        [publickey, day, sig, ts, block_id],
        'gmbadge'
      );
      inserted = res?.changes || 0;
    } catch (err) {
      console.error('GMBadge: failed to record gm', err);
      return;
    }
    if (!inserted) {
      return; // already said gm today
    }

    const previous = await this.loadState(publickey);
    const { state, duplicate } = Streaks.applyGm(previous, day, block_id);
    if (duplicate) {
      return;
    }
    await this.saveState(state);
  }

  async loadState(publickey) {
    const rows = await this.app.storage.queryDatabase(
      'SELECT * FROM streaks WHERE publickey = ?',
      [publickey],
      'gmbadge'
    );
    if (rows?.length) {
      return rows[0];
    }
    return Streaks.emptyState(publickey);
  }

  async saveState(s) {
    await this.app.storage.runDatabase(
      `INSERT INTO streaks (publickey, first_block, current, longest, lifetime, first_day, last_day, updated)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON CONFLICT(publickey) DO UPDATE SET
         first_block = COALESCE(streaks.first_block, excluded.first_block),
         current = excluded.current,
         longest = excluded.longest,
         lifetime = excluded.lifetime,
         first_day = COALESCE(streaks.first_day, excluded.first_day),
         last_day = excluded.last_day,
         updated = excluded.updated`,
      [
        s.publickey,
        s.first_block,
        s.current,
        s.longest,
        s.lifetime,
        s.first_day,
        s.last_day,
        Date.now()
      ],
      'gmbadge'
    );
  }

  //////////////////
  // Peer API     //
  //////////////////

  async handlePeerTransaction(app, tx = null, peer, mycallback) {
    if (tx == null) {
      return 0;
    }
    const txmsg = tx.returnMessage();
    if (!txmsg?.request || app.BROWSER) {
      return super.handlePeerTransaction(app, tx, peer, mycallback);
    }

    if (txmsg.request === 'gmbadge: streak') {
      const publickey = String(txmsg.data?.publickey || '');
      const state = publickey ? await this.loadState(publickey) : null;
      if (mycallback) {
        mycallback({
          today: Streaks.dayIndex(Date.now()),
          state: this.publicState(state)
        });
      }
      return 1;
    }

    if (txmsg.request === 'gmbadge: states') {
      const rows = await this.queryStates(this.config.max_states);
      if (mycallback) {
        mycallback({ today: Streaks.dayIndex(Date.now()), states: rows });
      }
      return 1;
    }

    return super.handlePeerTransaction(app, tx, peer, mycallback);
  }

  //
  // Every key whose cube is on (last gm today or yesterday, UTC). That is all
  // a wallet needs to draw cubes beside names.
  //
  async queryStates(limit = 2000) {
    const today = Streaks.dayIndex(Date.now());
    const rows = await this.app.storage.queryDatabase(
      `SELECT publickey, first_block, current, longest, lifetime, first_day, last_day
       FROM streaks
       WHERE last_day >= ?
       ORDER BY current DESC, first_block ASC
       LIMIT ?`,
      [today - 1, Math.max(1, Math.min(Number(limit) || 2000, 5000))],
      'gmbadge'
    );
    return (rows || []).map((r) => this.publicState(r));
  }

  publicState(row) {
    if (!row) {
      return null;
    }
    return {
      publickey: row.publickey,
      first_block: row.first_block,
      current: row.current,
      longest: row.longest,
      lifetime: row.lifetime,
      first_day: row.first_day,
      last_day: row.last_day,
      source: 'index',
      time_source: 'block'
    };
  }

  //////////////////
  // HTTP API     //
  //////////////////

  webServer(app, expressapp, express) {
    super.webServer(app, expressapp, express);
    const uri = '/' + encodeURI(this.returnSlug());
    const self = this;

    expressapp.get(`${uri}/api/streak/:publickey`, async (req, res) => {
      res.setHeader('Cache-Control', 'no-store');
      try {
        const state = await self.loadState(String(req.params.publickey));
        const today = Streaks.dayIndex(Date.now());
        return res.json({
          today,
          state: self.publicState(state),
          view: Streaks.view(state, today)
        });
      } catch (err) {
        return res.status(500).json({ error: 'unavailable' });
      }
    });

  }

  //////////////////
  // Browser      //
  //////////////////

  //
  // State lookup used by the decorator and the page.
  // Only the page asks to fetch (`fetch`), for the key it is showing: the
  // index sends live streaks in bulk, so a key with an older history is
  // looked up on its own. Names drawn around the app never trigger lookups;
  // in p2p mode a chat with 50 people must not become 50 archive scans
  // against the node, so there other people's cubes show only once opened.
  //
  viewFor(publickey, fetch = false) {
    const state = this.states[publickey];
    if (state) {
      return Streaks.view(state, this.today);
    }
    if (!fetch || !publickey) {
      return null;
    }
    if (this.mode === 'index' && this.peer && !this.index_asked.has(publickey)) {
      this.index_asked.add(publickey);
      this.fetchFromIndex(publickey);
    } else if (this.mode === 'p2p' && this.p2p && !this.p2p_seen.has(publickey)) {
      this.p2p_seen.add(publickey);
      this.p2p.stateFor(publickey).then((st) => this.absorbP2P(publickey, st));
    }
    return null;
  }

  async fetchFromIndex(publickey) {
    try {
      await this.app.network.sendRequestAsTransaction(
        'gmbadge: streak',
        { publickey },
        (res) => {
          if (!res?.state) {
            return;
          }
          this.states[publickey] = res.state;
          this.decorator?.update([publickey]);
          this.rerender();
        },
        this.peer.publicKey
      );
    } catch (err) {
      console.error('GMBadge: streak lookup failed', err);
    }
  }

  absorbP2P(publickey, state) {
    if (!state) {
      return;
    }
    this.states[publickey] = state;
    this.today = Streaks.dayIndex(Date.now());
    this.p2p_pending.add(publickey);
    clearTimeout(this.p2p_refresh_timer);
    this.p2p_refresh_timer = setTimeout(() => {
      const keys = Array.from(this.p2p_pending);
      this.p2p_pending.clear();
      this.decorator?.update(keys);
      this.rerender();
    }, 400);
  }

  async refreshStates() {
    if (!this.app.BROWSER) {
      return;
    }
    if (this.mode === 'p2p' || !this.peer) {
      if (this.p2p && this.publicKey) {
        const st = await this.p2p.stateFor(this.publicKey, true);
        this.absorbP2P(this.publicKey, st);
      }
      return;
    }
    try {
      await this.app.network.sendRequestAsTransaction(
        'gmbadge: states',
        {},
        (res) => {
          if (!res || !Array.isArray(res.states)) {
            return;
          }
          this.today = Number(res.today) || Streaks.dayIndex(Date.now());
          const next = {};
          for (const row of res.states) {
            if (row?.publickey) {
              next[row.publickey] = row;
            }
          }
          for (const key of this.index_asked) {
            if (!next[key] && this.states[key]) {
              next[key] = this.states[key]; // looked up one by one; not in the live list
            }
          }
          this.states = next;
          this.decorator?.update();
          this.rerender();
        },
        this.peer.publicKey
      );
    } catch (err) {
      console.error('GMBadge: refresh failed', err);
    }
  }

  rerender() {
    if (this.main && (this.browser_active || this.overlay)) {
      this.main.render();
    }
  }

  //
  // /gmbadge page (node mode)
  //
  async render() {
    if (!this.browser_active) {
      return;
    }
    if (!this.main) {
      this.main = new GMBadgeMain(this.app, this, '.gmbadge-page');
      this.header = new SaitoHeader(this.app, this);
      await this.header.initialize(this.app);
      this.addComponent(this.header);
    }
    await super.render();
    await this.main.render();
    this.refreshStates();
  }

  //
  // Overlay (installed-app mode, works inside any Saito wallet)
  //
  async openOverlay() {
    this.injectStyles();
    if (!this.overlay) {
      this.overlay = new SaitoOverlay(this.app, this, true, false);
    }
    this.overlay.show('<div class="gmbadge-page gmbadge-overlay"></div>');
    this.main = new GMBadgeMain(this.app, this, '.gmbadge-overlay');
    await this.main.render();
    this.refreshStates();
  }

  respondTo(type = '', obj = null) {
    if (type === 'saito-header') {
      const self = this;
      if (this.browser_active) {
        return [];
      }
      return [
        {
          text: 'gm badge',
          icon: this.icon_fa,
          rank: 60,
          type: 'navigation',
          callback: function (app, id) {
            self.openOverlay();
          }
        }
      ];
    }

    return super.respondTo(type, obj);
  }
}

module.exports = GMBadge;
