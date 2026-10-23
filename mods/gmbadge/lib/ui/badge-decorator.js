'use strict';

const BadgeSVG = require('../badge-svg');

//
// Draws the gm cube and the day count beside names. Saito renders most
// names through one helper, `app.browser.returnAddressHTML`, which Chat,
// Arcade, League, game playerboxes and the SaitoUser component call. We wrap
// it (keeping whatever was there before) and stamp the returned
// `.saito-address` with `data-gm` and `data-gm-n`; one stylesheet draws the
// cube and the number as that element's ::after. No MutationObserver.
//
// Why ::after and not a child or sibling element:
//   - core rewrites the name with innerText when it resolves a username
//     (browser.treatIdentifiers / updateAddressHTML), which would wipe a child
//   - `.saito-user` lays out its children on a grid, so a new sibling would
//     land in the wrong cell
// Attributes survive both.
//
// Red Square tweet headers print the author's name by hand and never call
// returnAddressHTML. That is an upstream change, kept out of this module:
// docs/upstream/redsquare-tweet-header.patch.
//

function inlineCSS() {
  const cube = BadgeSVG.renderDataUri({ size: 18 });
  return (
    `.saito-address[data-gm]::after{content:attr(data-gm-n);display:inline-block;white-space:nowrap;` +
    `margin-left:5px;padding-left:21px;line-height:18px;` +
    `background:url("${cube}") no-repeat left center/18px 18px;` +
    `font-size:0.8em;font-weight:600;font-variant-numeric:tabular-nums;opacity:0.85}`
  );
}

class BadgeDecorator {
  constructor(app, mod) {
    this.app = app;
    this.mod = mod;
    this.previous = null; // the returnAddressHTML we wrapped
  }

  start() {
    if (this.previous || typeof document === 'undefined' || !this.app.browser) {
      return;
    }
    if (!document.getElementById('gmbadge-inline-styles')) {
      const style = document.createElement('style');
      style.id = 'gmbadge-inline-styles';
      style.textContent = inlineCSS();
      document.head.appendChild(style);
    }
    const browser = this.app.browser;
    this.previous = browser.returnAddressHTML;
    const self = this;
    browser.returnAddressHTML = function (key, ...rest) {
      return self.stamp(self.previous.call(this, key, ...rest), key);
    };
  }

  stop() {
    if (!this.previous) {
      return;
    }
    this.app.browser.returnAddressHTML = this.previous;
    this.previous = null;
  }

  // The day count for a name, or null when the cube is off.
  look(publickey) {
    const v = publickey ? this.mod.viewFor(publickey) : null;
    if (!v || !v.on) {
      return null;
    }
    return {
      n: String(v.streak),
      title: `gm ${v.streak} day${v.streak === 1 ? '' : 's'} in a row`
    };
  }

  // Add our attributes to the markup returnAddressHTML produced.
  stamp(html, publickey) {
    const look = this.look(publickey);
    if (!look || typeof html !== 'string') {
      return html;
    }
    return html.replace(
      /class="saito-address\b/,
      `data-gm="on" data-gm-n="${look.n}" title="${look.title}" class="saito-address`
    );
  }

  //
  // New streak data arrived. Re-stamp names already on the page: only the
  // given keys, or every name when keys is omitted (index refresh, every few
  // minutes, not per DOM change).
  //
  update(keys = null) {
    if (typeof document === 'undefined') {
      return;
    }
    const sel = (k) => `.saito-address[data-id="${String(k).replace(/["\\]/g, '\\$&')}"]`;
    const els = keys
      ? keys.flatMap((k) => Array.from(document.querySelectorAll(sel(k))))
      : Array.from(document.querySelectorAll('.saito-address[data-id]'));
    for (const el of els) {
      const look = this.look(el.getAttribute('data-id'));
      if (!look) {
        if (el.hasAttribute('data-gm')) {
          el.removeAttribute('data-gm');
          el.removeAttribute('data-gm-n');
          el.removeAttribute('title');
        }
        continue;
      }
      el.setAttribute('data-gm', 'on');
      el.setAttribute('data-gm-n', look.n);
      el.title = look.title;
    }
  }
}

BadgeDecorator.inlineCSS = inlineCSS;

module.exports = BadgeDecorator;
