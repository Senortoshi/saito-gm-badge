'use strict';

//
// Pure SVG renderer for the gm cube.
//
// One object at every streak length: a machined hex pin with a dark enamel
// face, a recessed well, and the Saito cube sitting in it. Lit by a single
// key light from the upper left, with a soft fill, a specular glint and a
// faint contact shadow.
//
// Two levels of detail of the same object:
//   nameplate (size < 48) three solid cube faces, thick bevel, no microprint
//   full      (size >= 48) adds the impossible-cube folds as engraved grooves
//             and a quiet microprint of the first-gm block
//
// Shape is carried by fills and gradients only. No hairline strokes, so the
// silhouette survives at 18px.
//

const BRAND = {
  lit: '#ff8d99',
  red: '#f71f3d',
  mid: '#c8102e',
  deep: '#6e0718',
  shade: '#3d030c'
};

const UNLIT = {
  lit: '#a1a1aa',
  red: '#71717a',
  mid: '#52525b',
  deep: '#3f3f46',
  shade: '#27272a'
};

function f(n) {
  return Number(n).toFixed(2);
}

function hexPoints(cx, cy, r) {
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i - Math.PI / 2;
    pts.push([cx + r * Math.cos(a), cy + r * Math.sin(a)]);
  }
  return pts;
}

//
// Pointy-top hexagon with rounded corners: straight edges joined by
// quadratic curves through each vertex.
//
function roundedHex(cx, cy, r, round) {
  const pts = hexPoints(cx, cy, r);
  const t = Math.min(round / r, 0.45);
  let d = '';
  for (let i = 0; i < 6; i++) {
    const p = pts[i];
    const prev = pts[(i + 5) % 6];
    const next = pts[(i + 1) % 6];
    const a = [p[0] + (prev[0] - p[0]) * t, p[1] + (prev[1] - p[1]) * t];
    const b = [p[0] + (next[0] - p[0]) * t, p[1] + (next[1] - p[1]) * t];
    d += `${i === 0 ? 'M' : 'L'}${f(a[0])} ${f(a[1])} Q${f(p[0])} ${f(p[1])} ${f(b[0])} ${f(b[1])} `;
  }
  return d + 'Z';
}

function poly(pts) {
  return 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L') + ' Z';
}

function line(a, b) {
  return `M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`;
}

//
// Isometric cube points around (cx, cy) with silhouette radius r.
// L, T and B are the Saito "impossible cube" fold points.
//
function cubePoints(cx, cy, r) {
  const dx = r * Math.cos(Math.PI / 6);
  const dy = r * 0.5;
  return {
    N: [cx, cy - r],
    NE: [cx + dx, cy - dy],
    SE: [cx + dx, cy + dy],
    S: [cx, cy + r],
    SW: [cx - dx, cy + dy],
    NW: [cx - dx, cy - dy],
    C: [cx, cy],
    L: [cx - dx * 0.5, cy - r * 0.296],
    T: [cx + dx * 0.458, cy - r * 0.296],
    B: [cx, cy + r * 0.481]
  };
}

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}

let uid = 0;

function gradients(id, on) {
  const c = on ? BRAND : UNLIT;
  return (
    // contact shadow
    `<radialGradient id="${id}sh" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="#000" stop-opacity="0.42"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>` +
    // machined bevel: bright where the key light hits, dark on the far side
    `<linearGradient id="${id}bevel" x1="0.18" y1="0.04" x2="0.82" y2="0.96">` +
    `<stop offset="0" stop-color="#fbfbfc"/><stop offset="0.28" stop-color="#d4d4d8"/>` +
    `<stop offset="0.62" stop-color="#71717a"/><stop offset="1" stop-color="#27272a"/></linearGradient>` +
    // enamel face, warmed by the key light at the upper left
    `<radialGradient id="${id}face" cx="0.34" cy="0.26" r="0.86">` +
    `<stop offset="0" stop-color="#3a3a43"/><stop offset="0.5" stop-color="#18181d"/><stop offset="1" stop-color="#08080a"/></radialGradient>` +
    // recessed well: its upper wall is in shadow, its lower lip catches light
    `<linearGradient id="${id}well" x1="0.3" y1="0" x2="0.7" y2="1">` +
    `<stop offset="0" stop-color="#020203"/><stop offset="0.7" stop-color="#0d0d10"/><stop offset="1" stop-color="#26262c"/></linearGradient>` +
    // cube faces: top takes the key light, left the fill, right is in shade
    `<linearGradient id="${id}top" x1="0.1" y1="0.2" x2="0.9" y2="0.8">` +
    `<stop offset="0" stop-color="${c.lit}"/><stop offset="1" stop-color="${c.red}"/></linearGradient>` +
    `<linearGradient id="${id}left" x1="0" y1="0" x2="0.6" y2="1">` +
    `<stop offset="0" stop-color="${c.red}"/><stop offset="1" stop-color="${c.mid}"/></linearGradient>` +
    `<linearGradient id="${id}right" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c.deep}"/><stop offset="1" stop-color="${c.shade}"/></linearGradient>` +
    // gloss over the upper enamel, and the specular glint
    `<radialGradient id="${id}gloss" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0.2"/><stop offset="0.6" stop-color="#fff" stop-opacity="0.06"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="${id}spec" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0.95"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>`
  );
}

//
// opts:
//   size   pixel size (default 64)
//   on     lit cube (default true); false draws the same pin, unlit
//   block  first-gm block id, microprinted at full detail
//   title  accessible label
//
function render(opts = {}) {
  const size = Number(opts.size || 64);
  const on = opts.on !== false;
  const full = size >= 48;
  const id = `gmc${++uid}`;
  const title = opts.title || 'gm cube';

  const cx = 50;
  const cy = 47;
  const faceR = full ? 39 : 37; // thicker bevel at nameplate size
  const wellR = full ? 33 : 32.5;
  const round = full ? 1 : 0.7; // tighter corners keep the hex reading as a hex when tiny
  const k = cubePoints(cx, cy + 1, full ? 22 : 26);
  const face = roundedHex(cx, cy, faceR, 7.5 * round);

  let out =
    `<defs>${gradients(id, on)}` +
    `<clipPath id="${id}clip"><path d="${face}"/></clipPath></defs>`;

  // contact shadow, then the pin body
  out += `<ellipse cx="50" cy="93.5" rx="31" ry="4.6" fill="url(#${id}sh)"/>`;
  out += `<path d="${roundedHex(cx, cy, 44, 9 * round)}" fill="url(#${id}bevel)"/>`;
  out += `<path d="${face}" fill="url(#${id}face)"/>`;
  out += `<path d="${roundedHex(cx, cy + 0.8, wellR, 6.5 * round)}" fill="url(#${id}well)"/>`;

  // the cube: a soft shadow in the well, then three solid faces
  out += `<path d="${poly([k.N, k.NE, k.SE, k.S, k.SW, k.NW])}" transform="translate(0.9 1.4)" fill="#000" opacity="0.45"/>`;
  out += `<path d="${poly([k.N, k.NE, k.C, k.NW])}" fill="url(#${id}top)"/>`;
  out += `<path d="${poly([k.NW, k.C, k.S, k.SW])}" fill="url(#${id}left)"/>`;
  out += `<path d="${poly([k.NE, k.SE, k.S, k.C])}" fill="url(#${id}right)"/>`;

  if (full) {
    // impossible-cube folds as engraved grooves: dark cut, light lower lip
    const folds = [
      line(k.SW, k.L),
      line(k.L, k.NW),
      line(k.L, k.C),
      line(k.N, k.T),
      line(k.T, k.NE),
      line(k.T, k.C),
      line(k.B, k.SE)
    ].join(' ');
    out += `<path d="${folds}" fill="none" stroke="#fff" stroke-opacity="${on ? 0.16 : 0.08}" stroke-width="0.9" stroke-linecap="round" transform="translate(0.3 0.45)"/>`;
    out += `<path d="${folds}" fill="none" stroke="#2a030a" stroke-opacity="0.38" stroke-width="0.9" stroke-linecap="round"/>`;
  }

  // light catching the cube's upper-left edge
  out += `<path d="${line(k.NW, k.N)}" stroke="#fff" stroke-opacity="${on ? 0.7 : 0.35}" stroke-width="${full ? 1.3 : 2.2}" stroke-linecap="round"/>`;

  // a soft reflection of the key light on the enamel, the glint on the cube and on the bevel
  out += `<ellipse cx="33" cy="20" rx="42" ry="24" fill="url(#${id}gloss)" clip-path="url(#${id}clip)"/>`;
  if (on) {
    const gx = k.N[0] - 4.5;
    const gy = k.N[1] + 4.2;
    out += `<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="${full ? 3.6 : 5}" ry="${full ? 2 : 2.8}" fill="url(#${id}spec)" transform="rotate(-30 ${f(gx)} ${f(gy)})"/>`;
  }
  out += `<ellipse cx="25" cy="17.5" rx="${full ? 7 : 9}" ry="${full ? 2.2 : 3}" fill="url(#${id}spec)" opacity="0.85" transform="rotate(-30 25 17.5)"/>`;

  if (full && opts.block) {
    // engraved along the two lower edges of the enamel, between well and bevel
    const band = (faceR + wellR) / 2 + 0.4;
    const mx = band * Math.cos(Math.PI / 6) * 0.5;
    const my = cy + band * 0.75;
    const print = (x, angle, text) =>
      `<text x="${f(x)}" y="${f(my)}" transform="rotate(${angle} ${f(x)} ${f(my)})" text-anchor="middle" dominant-baseline="middle" ` +
      `font-family="ui-monospace, Menlo, Consolas, monospace" font-size="2.7" letter-spacing="0.45" fill="#e4e4e7" opacity="0.42">${esc(text)}</text>`;
    out += print(50 - mx, 30, 'FIRST GM');
    out += print(50 + mx, -30, `BLOCK ${opts.block}`);
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="gm-cube${on ? '' : ' gm-cube-off'}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title>` +
    out +
    `</svg>`
  );
}

function renderDataUri(opts = {}) {
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(render(opts));
}

const api = { render, renderDataUri };
if (typeof module !== 'undefined' && module.exports) {
  module.exports = api;
}
if (typeof window !== 'undefined') {
  window.GMCubeSVG = api;
}
