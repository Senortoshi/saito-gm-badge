'use strict';

const BadgeSVG = require('../badge-svg');
const Streaks = require('../streaks');

//
// The /gmbadge page: the cube, large, and the trivia behind it. Days in a
// row, longest run, total gms, block of the first gm. Renders into a
// container selector so it works both as the /gmbadge page (node mode) and
// inside an overlay (installed-app mode).
//
class GMBadgeMain {
  constructor(app, mod, container = '.gmbadge-page') {
    this.app = app;
    this.mod = mod;
    this.container = container;
  }

  targetKey() {
    const param = this.app.browser.returnURLParameter?.('key');
    return param && param.length > 20 ? param : this.mod.publicKey;
  }

  async render() {
    let el = document.querySelector(this.container);
    if (!el && this.container === '.gmbadge-page') {
      this.app.browser.addElementToDom('<div class="gmbadge-page"></div>');
      el = document.querySelector(this.container);
    }
    if (!el) {
      return;
    }
    el.innerHTML = this.template();
  }

  // the rim's light sweep is the page's only motion; respect reduced motion
  motionOk() {
    try {
      return !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    } catch (err) {
      return false;
    }
  }

  template() {
    const key = this.targetKey();
    const mine = key === this.mod.publicKey;
    const state = this.mod.states[key] || null;
    const v = this.mod.viewFor(key, true) || Streaks.view(null, this.mod.today);
    const name = this.app.keychain.returnUsername(key) || key;
    const esc = (s) => this.app.browser.escapeHTML(String(s == null ? '' : s));

    let status = '';
    if (!state) {
      status = 'Reading gm posts…';
    } else if (v.on && v.posted_today) {
      status = mine ? 'You said gm today.' : 'Said gm today.';
    } else if (v.on) {
      status = mine
        ? 'Say gm today or your cube goes away at midnight UTC.'
        : 'Said gm yesterday. The cube stays if they say gm today.';
    } else {
      status = mine
        ? 'Say gm in Red Square and your cube shows up.'
        : 'Their next gm in Red Square brings it back at 1.';
    }

    let source = '';
    if (state?.source === 'index') {
      source = 'From confirmed Red Square posts, dated by block time.';
    } else if (state) {
      source =
        'Read from the archive. Days come from post timestamps, not block time, and the archive keeps about 347 days of Red Square posts.';
    }

    const cube = BadgeSVG.render({
      size: 200,
      on: v.on,
      block: v.first_block,
      publickey: key, // seeds this holder's engraving
      sweep: this.motionOk(),
      title: v.on ? `gm ${v.streak} days in a row` : 'gm cube, off'
    });
    const stat = (n, label) =>
      `<div class="gmbadge-stat"><span class="gmbadge-stat-n">${esc(n)}</span><span class="gmbadge-stat-l">${label}</span></div>`;

    return `
      <section class="gmbadge-hero">
        <div class="gmbadge-hero-cube">${cube}</div>
        <div class="gmbadge-hero-body">
          <h1 class="gmbadge-hero-name" title="${esc(key)}">${esc(name)}</h1>
          <div class="gmbadge-hero-days${v.on ? ' gmbadge-on' : ''}">${v.on ? `${v.streak} day${v.streak === 1 ? '' : 's'} in a row` : 'No cube today'}</div>
          <div class="gmbadge-stats">
            ${stat(v.streak, 'days in a row')}
            ${stat(v.longest, 'longest run')}
            ${stat(v.lifetime, 'total gms')}
            ${stat(v.first_block || '—', 'first gm block')}
          </div>
          <p class="gmbadge-status">${esc(status)}</p>
          ${source ? `<p class="gmbadge-source">${esc(source)}</p>` : ''}
          <div class="gmbadge-actions"><a class="gmbadge-link" href="/redsquare">open Red Square</a></div>
        </div>
      </section>
    `;
  }
}

module.exports = GMBadgeMain;
