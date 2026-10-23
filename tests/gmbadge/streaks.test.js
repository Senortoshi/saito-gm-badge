'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../../mods/gmbadge/lib/streaks');
const SVG = require('../../mods/gmbadge/lib/badge-svg');
const BadgeDecorator = require('../../mods/gmbadge/lib/ui/badge-decorator');

test('isGm accepts gm variants and rejects lookalikes', () => {
  for (const ok of ['gm', 'GM', 'Gm fam', 'gm!', '  gm', '☀️ gm', 'gm ☀️', "gm's", 'gm\nhow is everyone']) {
    assert.equal(S.isGm(ok), true, ok);
  }
  for (const no of ['gmgm', 'good morning', 'omg', 'g m', 'gmfam', '', null, 42, 'say gm']) {
    assert.equal(S.isGm(no), false, String(no));
  }
});

test('day index is UTC based', () => {
  assert.equal(S.dayIndex(0), 0);
  assert.equal(S.dayIndex(86399999), 0);
  assert.equal(S.dayIndex(86400000), 1);
  assert.equal(S.dayIndex(Date.UTC(2026, 9, 22, 23, 59, 59)), S.dayIndex(Date.UTC(2026, 9, 22, 0, 0, 0)));
  assert.equal(S.dayString(20000), '2024-10-04');
});

test('consecutive days count up, a missed day restarts at 1', () => {
  let r = S.applyGm(S.emptyState('pk'), 100, 5000);
  assert.equal(r.first, true);
  assert.equal(r.state.current, 1);
  assert.equal(r.state.lifetime, 1);

  r = S.applyGm(r.state, 100, 5001); // same day again
  assert.equal(r.duplicate, true);
  assert.equal(r.state.lifetime, 1);

  for (let d = 101; d <= 106; d++) r = S.applyGm(r.state, d, 5000 + d);
  assert.equal(r.state.current, 7);
  assert.equal(r.broke, false);

  r = S.applyGm(r.state, 108, 5108); // missed day 107
  assert.equal(r.broke, true);
  assert.equal(r.state.current, 1);
  assert.equal(r.state.longest, 7);
  assert.equal(r.state.lifetime, 8);

  r = S.applyGm(r.state, 90, 5200); // older day than the last one
  assert.equal(r.duplicate, true);
});

test('first gm records its block; later gms never move it', () => {
  let r = S.applyGm(S.emptyState('pk'), 100, 184223);
  assert.equal(r.state.first_block, 184223);
  r = S.applyGm(r.state, 101, 184900);
  r = S.applyGm(r.state, 105, 186000); // a break does not reset earliness
  assert.equal(r.state.first_block, 184223);
  assert.equal(S.applyGm(S.emptyState('pk'), 100).state.first_block, null); // block unknown
  assert.equal(S.applyGm(S.emptyState('pk'), 100, 0).state.first_block, null);
});

test('cube is on with the day count while the last gm was today or yesterday, otherwise off', () => {
  const st = { publickey: 'pk', first_block: 3, current: 10, longest: 12, lifetime: 30, first_day: 61, last_day: 100 };
  let v = S.view(st, 100);
  assert.equal(v.on, true);
  assert.equal(v.streak, 10);
  assert.equal(v.posted_today, true);
  v = S.view(st, 101);
  assert.equal(v.on, true);
  assert.equal(v.streak, 10);
  assert.equal(v.posted_today, false);
  v = S.view(st, 102); // missed yesterday
  assert.equal(v.on, false);
  assert.equal(v.streak, 0);
  assert.equal(v.longest, 12); // trivia survives
  assert.equal(v.lifetime, 30);
  assert.equal(v.first_block, 3);
  assert.equal(S.view(null, 5).on, false);
  assert.deepEqual(Object.keys(v).filter((k) => /tier|rank|crack|dormant|milestone/.test(k)), []);
});

test('p2p keeps gms in block order and drops backdated ones', () => {
  const day = (d, block, ts = d * S.DAY_MS) => ({ day: d, block, ts });
  assert.deepEqual(
    S.inBlockOrder([day(102, 30), day(100, 10), day(101, 20)]).map((g) => g.day),
    [100, 101, 102]
  );
  // dated day 95 but only confirmed after day 102 was on chain: a backdate
  assert.deepEqual(
    S.inBlockOrder([day(100, 10), day(101, 20), day(102, 30), day(95, 40)]).map((g) => g.day),
    [100, 101, 102]
  );
  let st = S.emptyState('pk');
  for (const g of S.inBlockOrder([day(100, 10), day(100, 11), day(101, 12)])) {
    st = S.applyGm(st, g.day, g.block).state;
  }
  assert.equal(st.current, 2);
  assert.equal(st.first_block, 10);
  assert.deepEqual(S.inBlockOrder(null), []);
});

test('decorator stamps names with a live streak and leaves others alone', () => {
  const states = {
    alive: { current: 12, longest: 12, lifetime: 12, first_day: 89, last_day: 100 },
    one: { current: 1, longest: 4, lifetime: 9, first_day: 50, last_day: 99 },
    lapsed: { current: 9, longest: 9, lifetime: 9, first_day: 90, last_day: 98 }
  };
  const mod = { viewFor: (k) => (states[k] ? S.view(states[k], 100) : null) };
  const d = new BadgeDecorator({}, mod);
  const html = (k) => `<div class="saito-address" data-id="${k}" >name</div>`;

  assert.equal(
    d.stamp(html('alive'), 'alive'),
    '<div data-gm="on" data-gm-n="12" title="gm 12 days in a row" class="saito-address" data-id="alive" >name</div>'
  );
  assert.match(d.stamp(html('one'), 'one'), /data-gm-n="1" title="gm 1 day in a row"/);
  assert.equal(d.stamp(html('lapsed'), 'lapsed'), html('lapsed')); // missed a day: no cube
  assert.equal(d.stamp(html('nobody'), 'nobody'), html('nobody'));
  assert.equal(d.stamp(undefined, 'alive'), undefined);
  // extra classes after saito-address (Red Square's `primary`) still match
  assert.match(d.stamp('<div class="saito-address primary" data-id="alive">n</div>', 'alive'), /^<div data-gm="on"/);
});

test('decorator wraps returnAddressHTML, calls through, and unwraps', () => {
  const calls = [];
  const browser = {
    returnAddressHTML(key, disable = false) {
      calls.push([key, disable]);
      return `<div class="saito-address" data-id="${key}">${key}</div>`;
    }
  };
  const original = browser.returnAddressHTML;
  const states = { alive: { current: 3, longest: 3, lifetime: 3, first_day: 98, last_day: 100 } };
  const d = new BadgeDecorator({ browser }, { viewFor: (k) => (states[k] ? S.view(states[k], 100) : null) });
  global.document = { getElementById: () => ({}), head: { appendChild() {} } };
  try {
    d.start();
    assert.match(browser.returnAddressHTML('alive', true), /data-gm-n="3"/);
    assert.deepEqual(calls, [['alive', true]]);
    d.stop();
    assert.equal(browser.returnAddressHTML, original);
  } finally {
    delete global.document;
  }
});

test('one cube, two levels of detail, no rank skins', () => {
  const key = 'pYKMUjEaXntK4XZjxDGsfYdVmJEJhpz5XMriMNaWukTu';
  const small = SVG.render({ size: 18, publickey: key, block: 184223 });
  const large = SVG.render({ size: 256, publickey: key, block: 184223 });
  assert.match(small, /^<svg /);
  assert.match(small, /width="18"/);
  // the nameplate stays clean: no microprint, no grain, no folds, no filters
  assert.doesNotMatch(small, /BLOCK|textPath|filter=|<animate|stroke-width="0\.9"/);
  // full detail carries the folds and the security layer
  assert.equal((large.match(/stroke-width="0\.9"/g) || []).length, 2);
  assert.match(large, /<textPath [^>]*>[^<]*FIRST GM BLOCK 184223/);
  assert.match(large, /pYKMUjEaXn/); // key fragment in the microtext ring
  assert.match(large, />gm gm gm /); // nanotext in the cube face
  assert.match(SVG.render({ size: 96, on: false }), /gm-cube-off/);
  assert.match(SVG.renderDataUri({ size: 18 }), /^data:image\/svg\+xml;utf8,/);
  assert.doesNotMatch(SVG.render({ title: '<script>' }), /<script>/);
  // streak length never changes the art
  assert.equal(
    SVG.render({ size: 18, streak: 1 }).replace(/gmc\d+/g, ''),
    SVG.render({ size: 18, streak: 1000 }).replace(/gmc\d+/g, '')
  );
  assert.match(BadgeDecorator.inlineCSS(), /content:attr\(data-gm-n\)/);
  assert.doesNotMatch(small + large, /Genesis|Timestamp|Merkle|Routing|Golden|Satoshi|Legendary|Exotic|verified/i);
});

test('rim light sweeps only on the large cube, and only when asked', () => {
  assert.doesNotMatch(SVG.render({ size: 18, sweep: true }), /<animate/); // the nameplate never moves
  assert.doesNotMatch(SVG.render({ size: 256 }), /<animate/);
  assert.match(SVG.render({ size: 256, sweep: true }), /<animateTransform attributeName="gradientTransform" type="rotate"[^>]*dur="7s"/);
  assert.doesNotMatch(BadgeDecorator.inlineCSS(), /animate/);
});

test('security engraving is unique per holder and stable for the same holder', () => {
  const rosette = (svg) => svg.match(/clip-path="url\(#gmc\d+well\)"><path d="([^"]+)"/)[1];
  const a1 = rosette(SVG.render({ size: 256, publickey: 'holder-a', block: 100 }));
  const a2 = rosette(SVG.render({ size: 256, publickey: 'holder-a', block: 100 }));
  const b = rosette(SVG.render({ size: 256, publickey: 'holder-b', block: 100 }));
  const c = rosette(SVG.render({ size: 256, publickey: 'holder-a', block: 101 }));
  assert.equal(a1, a2);
  assert.notEqual(a1, b);
  assert.notEqual(a1, c);
});
