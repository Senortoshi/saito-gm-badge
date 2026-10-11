'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const S = require('../../mods/gmbadge/lib/streaks');
const SVG = require('../../mods/gmbadge/lib/badge-svg');

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
  assert.equal(S.dayString(20000), '2024-10-04');
});

test('streak builds, breaks, and resets correctly', () => {
  let st = S.emptyState('pk');
  let r = S.applyGm(st, 100);
  assert.equal(r.first, true);
  assert.equal(r.state.current, 1);
  assert.equal(r.state.lifetime, 1);

  r = S.applyGm(r.state, 100); // same day again
  assert.equal(r.duplicate, true);
  assert.equal(r.state.lifetime, 1);

  for (let d = 101; d <= 106; d++) r = S.applyGm(r.state, d);
  assert.equal(r.state.current, 7);
  assert.equal(r.milestone, 7);
  assert.equal(S.tierFor(r.state.current).name, 'timestamp');

  r = S.applyGm(r.state, 108); // missed day 107
  assert.equal(r.broke, true);
  assert.equal(r.state.current, 1);
  assert.equal(r.state.longest, 7);
  assert.equal(r.state.lifetime, 8);

  r = S.applyGm(r.state, 90); // out of order / reorg artifact
  assert.equal(r.duplicate, true);
});

test('view reports alive, at risk, cracked, dormant', () => {
  const st = { publickey: 'pk', serial: 3, current: 10, longest: 10, lifetime: 10, first_day: 91, last_day: 100 };
  let v = S.view(st, 100);
  assert.equal(v.streak, 10);
  assert.equal(v.posted_today, true);
  assert.equal(v.tier.name, 'timestamp');
  v = S.view(st, 101);
  assert.equal(v.streak, 10);
  assert.equal(v.at_risk, true);
  v = S.view(st, 102);
  assert.equal(v.streak, 0);
  assert.equal(v.cracked, true);
  assert.equal(v.lost_streak, 10);
  v = S.view(st, 103);
  assert.equal(v.cracked, false);
  assert.equal(v.dormant, true);
  assert.equal(S.view(null, 5).tier.id, 0);
});

test('tiers and milestones', () => {
  assert.equal(S.tierFor(0).name, 'none');
  assert.equal(S.tierFor(1).name, 'genesis');
  assert.equal(S.tierFor(6).name, 'genesis');
  assert.equal(S.tierFor(7).name, 'timestamp');
  assert.equal(S.tierFor(30).name, 'merkle');
  assert.equal(S.tierFor(100).name, 'routing');
  assert.equal(S.tierFor(365).name, 'goldenticket');
  assert.equal(S.tierFor(1000).name, 'satoshi');
  assert.equal(S.nextMilestone(0), 7);
  assert.equal(S.nextMilestone(7), 30);
  assert.equal(S.nextMilestone(400), 1000);
  assert.equal(S.nextMilestone(1000), null);
});

test('svg renders for every tier and state', () => {
  for (let t = 0; t <= 6; t++) {
    const svg = SVG.render({
      tier: t,
      streak: t ? S.TIERS[t].min : 0,
      serial: 1,
      issuer: 'saitoissuerkey',
      sig: 'deadbeef',
      size: 64
    });
    assert.match(svg, /^<svg /);
    assert.match(svg, new RegExp(`gm-badge-tier-${t}`));
    if (t >= 1) {
      assert.match(svg, /gm-1-saitoiss-deadbeef/);
      assert.match(svg, /clipPath/);
    }
  }
  const cracked = SVG.render({ tier: 2, cracked: true, streak: 0, size: 32 });
  assert.match(cracked, /gm-badge-cracked/);
  assert.match(SVG.renderDataUri({ tier: 2, streak: 7 }), /^data:image\/svg\+xml;utf8,/);
  assert.doesNotMatch(SVG.render({ title: '<script>' }), /<script>/);
  const zoom = SVG.render({
    tier: 1,
    streak: 1,
    serial: 420,
    issuer: 'saitoissuerkey',
    sig: 'egg420aa',
    size: 400
  });
  assert.match(zoom, /<pattern /);
  assert.match(zoom, /GM SAITO GM FAM/);
  assert.match(zoom, />gm gm gm gm/);
  assert.match(zoom, /gm-420-saitoiss-egg420aa/);
});
