'use strict';

//
// Pure streak logic. No Saito dependencies so it can run on the node,
// in the browser bundle, and under `node --test`.
//
// A "day" is a UTC day index: Math.floor(unix_ms / 86400000).
//

const DAY_MS = 86400000;

//
// "gm", "GM", "gm fam", "gm ☀️", "☀️ gm", "gm!" all count.
// "gmgm", "good morning", "omg", "say gm" do not.
//
function isGm(text) {
  if (typeof text !== 'string') {
    return false;
  }
  const stripped = text.replace(/^[^\p{L}\p{N}]+/u, '');
  return /^gm(?![\p{L}\p{N}])/iu.test(stripped);
}

function dayIndex(timestampMs) {
  return Math.floor(Number(timestampMs) / DAY_MS);
}

function dayString(index) {
  if (index == null) {
    return null;
  }
  return new Date(Number(index) * DAY_MS).toISOString().slice(0, 10);
}

function emptyState(publickey = '') {
  return {
    publickey,
    first_block: null, // block of the first gm; earlier is lower
    current: 0,
    longest: 0,
    lifetime: 0,
    first_day: null,
    last_day: null
  };
}

//
// Apply one confirmed gm on `day`, included in block `block`, to a stored
// state. Days must arrive in non-decreasing order (blocks are processed in
// order). A second gm on the same day, or a day older than the last one, is
// ignored. The first gm ever records its block: that is the earliness proof.
//
function applyGm(previous, day, block = null) {
  const state = Object.assign(emptyState(), previous || {});
  const result = { state, duplicate: false, first: false, broke: false };
  day = Number(day);

  if (state.last_day != null && day <= Number(state.last_day)) {
    result.duplicate = true;
    return result;
  }

  if (!state.lifetime || state.first_day == null) {
    result.first = true;
    state.first_day = day;
    state.first_block = block != null && Number(block) > 0 ? Number(block) : null;
  }

  if (state.last_day != null && day === Number(state.last_day) + 1) {
    state.current = Number(state.current) + 1;
  } else {
    if (state.last_day != null) {
      result.broke = true;
    }
    state.current = 1;
  }

  state.lifetime = Number(state.lifetime) + 1;
  state.last_day = day;
  if (state.current > Number(state.longest)) {
    state.longest = state.current;
  }
  return result;
}

//
// p2p only. gms = [{ day, block, ts }] read from an archive, where day comes
// from the sender-signed tx timestamp. Sort by block, then keep a gm only if
// its day is not earlier than a gm that confirmed before it, so nobody can
// backdate a gm into their existing history. Same-day repeats are left for
// applyGm to drop.
//
function inBlockOrder(gms) {
  const sorted = (gms || []).slice().sort((a, b) => a.block - b.block || a.ts - b.ts);
  const kept = [];
  let last = -Infinity;
  for (const gm of sorted) {
    if (gm.day >= last) {
      kept.push(gm);
      last = gm.day;
    }
  }
  return kept;
}

//
// What shows *today*. The cube is on while the last gm was today or
// yesterday (UTC), and the number is the consecutive days. Otherwise it is
// off; the next gm starts again at 1.
//
function view(state, today) {
  const s = Object.assign(emptyState(), state || {});
  const gap = s.last_day == null ? null : Number(today) - Number(s.last_day);
  const on = gap != null && gap >= 0 && gap <= 1;

  return {
    publickey: s.publickey,
    on,
    streak: on ? Number(s.current) : 0,
    posted_today: gap === 0,
    longest: Number(s.longest),
    lifetime: Number(s.lifetime),
    first_block: s.first_block,
    first_date: dayString(s.first_day)
  };
}

module.exports = {
  DAY_MS,
  isGm,
  dayIndex,
  dayString,
  emptyState,
  applyGm,
  inBlockOrder,
  view
};
