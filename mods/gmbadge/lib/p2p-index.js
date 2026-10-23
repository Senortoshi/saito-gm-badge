'use strict';

const Transaction = require('../../../lib/saito/transaction').default;
const Streaks = require('./streaks');

//
// Peer-to-peer streak index. No gm badge server required.
//
// Every Red Square post is an on-chain transaction that the node a wallet is
// connected to keeps in its Archive. This class pages a public key's posts out
// of that archive, keeps the ones that say gm, and replays them through the
// same streak rules the node-side indexer uses. Any wallet can therefore
// compute anyone's streak from an archive.
//
// Limits, stated plainly:
//   - Archive nodes delete Red Square posts after roughly 347 days
//     (archive.js prunes field1 = 'RedSquare' at 50 x prune_public_ts), so
//     p2p mode cannot see a streak older than that. Longer runs need an
//     index node that has watched the chain since they started.
//   - The archive returns block_id but not block time. Days here come from
//     tx.timestamp, which the sender signs but consensus does not check.
//     We order gms by block_id and drop any gm dated earlier than a gm that
//     confirmed before it, which stops backdating into existing history.
//     A fresh key can still pre-date a batch, so p2p states are marked
//     time_source 'tx' and the index (block time) wins whenever present.
//   - Each lookup reads at most 12 pages of 100 posts, newest first, so a
//     very chatty poster's oldest gms may fall outside it. Lookups run only
//     for your own key and keys opened on /gmbadge, never for every name
//     on screen, to keep load off the archive node.
//
class P2PIndex {
  constructor(app, mod) {
    this.app = app;
    this.mod = mod;
    this.cache = {}; // publickey -> { state, at }
    this.inflight = {}; // publickey -> Promise
    this.ttl_ms = 10 * 60 * 1000;
    this.page = 100;
    this.max_pages = 12; // 1200 posts; bounds the load one lookup puts on the archive node
    this.max_age_ms = 1100 * Streaks.DAY_MS;
    this.timeout_ms = 15000;
  }

  cached(publickey) {
    const hit = this.cache[publickey];
    if (hit && Date.now() - hit.at < this.ttl_ms) {
      return hit.state;
    }
    return null;
  }

  async stateFor(publickey, force = false) {
    if (!publickey) {
      return null;
    }
    if (!force) {
      const hit = this.cached(publickey);
      if (hit) {
        return hit;
      }
    }
    if (this.inflight[publickey]) {
      return this.inflight[publickey];
    }
    const p = this.build(publickey)
      .catch((err) => {
        console.warn('GMBadge: p2p index failed for', publickey, err);
        return null;
      })
      .then((state) => {
        delete this.inflight[publickey];
        if (state) {
          this.cache[publickey] = { state, at: Date.now() };
        }
        return state;
      });
    this.inflight[publickey] = p;
    return p;
  }

  async build(publickey) {
    const gms = await this.fetchGms(publickey);
    let state = Streaks.emptyState(publickey);
    for (const gm of gms) {
      state = Streaks.applyGm(state, gm.day, gm.block).state;
    }
    state.source = 'p2p';
    state.time_source = 'tx';
    return state;
  }

  //
  // Page the key's Red Square posts newest-first until the archive runs dry,
  // the page cap is hit, or we are past max_age. Return confirmed gms in
  // block order with backdated ones removed.
  //
  async fetchGms(publickey) {
    const found = [];
    const seen = new Set();
    let earlier = Date.now() + 60000;
    const floor = Date.now() - this.max_age_ms;
    const horizon = Date.now() + 10 * 60000; // nothing dated in the future

    for (let i = 0; i < this.max_pages; i++) {
      const rows = await this.load({
        field1: 'RedSquare',
        field2: publickey,
        created_earlier_than: earlier,
        limit: this.page
      });
      if (!rows.length) {
        break;
      }
      let oldest = earlier;
      for (const { tx, block } of rows) {
        const ts = Number(tx.timestamp) || 0;
        if (ts && ts < oldest) {
          oldest = ts;
        }
        if (!block || !ts || ts > horizon || seen.has(tx.signature)) {
          continue; // unconfirmed, undated or future-dated
        }
        let msg = null;
        try {
          msg = tx.returnMessage();
        } catch (err) {
          msg = tx.msg;
        }
        if (msg?.request !== 'create tweet') {
          continue;
        }
        const from = tx.from?.[0]?.publicKey ? String(tx.from[0].publicKey) : '';
        if (from && from !== publickey) {
          continue;
        }
        if (Streaks.isGm(msg.data?.text)) {
          seen.add(tx.signature);
          found.push({ day: Streaks.dayIndex(ts), block, ts });
        }
      }
      if (rows.length < this.page || oldest <= floor || oldest >= earlier) {
        break;
      }
      earlier = oldest;
    }
    return Streaks.inBlockOrder(found);
  }

  //
  // Ask the archive directly rather than through storage.loadTransactions,
  // which drops the row's block_id. Resolves to [{ tx, block }].
  //
  load(query) {
    return new Promise((resolve) => {
      let done = false;
      const finish = (rows) => {
        if (done) {
          return;
        }
        done = true;
        clearTimeout(timer);
        resolve(rows);
      };
      const timer = setTimeout(() => finish([]), this.timeout_ms);
      try {
        this.app.network.sendRequestAsTransaction(
          'archive',
          Object.assign({ request: 'load' }, query),
          (res) => {
            const out = [];
            for (const row of Array.isArray(res) ? res : []) {
              if (!row?.tx) {
                continue;
              }
              try {
                const tx = new Transaction();
                tx.deserialize_from_web(this.app, row.tx);
                out.push({ tx, block: Number(row.block_id) || 0 });
              } catch (err) {}
            }
            finish(out);
          }
        );
      } catch (err) {
        finish([]);
      }
    });
  }
}

module.exports = P2PIndex;
