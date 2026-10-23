'use strict';

//
// Pure SVG renderer for the gm cube.
//
// One object at every streak length: a hex pin with a thin polished chrome
// rim, a flat enamel band under clearcoat, a recessed well with lit and
// shadowed walls, and the Saito cube standing on the well floor. One key
// light from the upper left, with a soft fill, specular glints, ambient
// occlusion under the cube and a contact shadow.
//
// The rim's light can sweep slowly around it (`sweep`), at full size only.
// The nameplate never animates.
//
// Two levels of detail of the same object:
//   nameplate (size < 48) rim, well and three-face cube only; no microprint,
//             no animation, nothing that turns to noise at 18px
//   full      (size >= 48) adds cube edge bevels and the impossible-cube
//             folds, plus a security layer you find by zooming:
//               - a guilloché rosette engraved in the well floor, its curves
//                 derived from the holder's key and first-gm block, so every
//                 holder's cube is fingerprinted
//               - a microtext ring around the enamel (key fragment, block)
//               - nanotext "gm" inside the cube's top face
//
// Shape is carried by fills and gradients only; strokes are detail, never
// structure, so the silhouette survives at 18px.
//

const LIT = { hi: '#ff9aa6', top: '#ff4d63', mid: '#f71f3d', low: '#c8102e', deep: '#7a0a1d', shade: '#3a030c' };
const UNLIT = { hi: '#d4d4d8', top: '#a1a1aa', mid: '#8a8a93', low: '#6b6b74', deep: '#45454d', shade: '#26262b' };

// direction toward the key light (upper left), normalised
const LIGHT = (() => {
  const x = -0.56;
  const y = -0.83;
  const m = Math.hypot(x, y);
  return [x / m, y / m];
})();

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

function poly(pts) {
  return 'M' + pts.map((p) => `${f(p[0])} ${f(p[1])}`).join(' L') + ' Z';
}

function line(a, b) {
  return `M${f(a[0])} ${f(a[1])} L${f(b[0])} ${f(b[1])}`;
}

// a hex ring as one even-odd path
function ring(cx, cy, outer, inner) {
  return `${poly(hexPoints(cx, cy, outer))} ${poly(hexPoints(cx, cy, inner).reverse())}`;
}

// mix two #rrggbb colours
function mix(a, b, t) {
  const p = (h, i) => parseInt(h.slice(1 + i * 2, 3 + i * 2), 16);
  const c = [0, 1, 2].map((i) => Math.round(p(a, i) + (p(b, i) - p(a, i)) * t));
  return '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
}

// metal tone for a surface whose normal points along angle `phi`
function metal(phi) {
  const b = Math.cos(phi) * LIGHT[0] + Math.sin(phi) * LIGHT[1]; // -1 .. 1
  const t = (b + 1) / 2;
  return t < 0.5 ? mix('#1f2025', '#7c7f88', t * 2) : mix('#7c7f88', '#f7f8fa', (t - 0.5) * 2);
}

function hash32(str) {
  let h = 2166136261;
  const s = String(str == null ? '' : str);
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
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

//
// Six chamfer facets between two hex radii. `inward` shades the walls of a
// recess (their surface faces the centre) instead of an outward bevel.
//
function facets(cx, cy, outer, inner, inward, id) {
  const o = hexPoints(cx, cy, outer);
  const n = hexPoints(cx, cy, inner);
  let defs = '';
  let out = '';
  for (let i = 0; i < 6; i++) {
    const j = (i + 1) % 6;
    const phi = (Math.PI / 3) * i - Math.PI / 2 + Math.PI / 6; // outward normal of edge i
    const tone = metal(inward ? phi + Math.PI : phi);
    // anisotropic sheen along the facet: a little brighter toward the light
    const a = o[i];
    const b = o[j];
    const towardA = (a[0] - b[0]) * LIGHT[0] + (a[1] - b[1]) * LIGHT[1] > 0;
    defs +=
      `<linearGradient id="${id}f${i}" gradientUnits="userSpaceOnUse" x1="${f(a[0])}" y1="${f(a[1])}" x2="${f(b[0])}" y2="${f(b[1])}">` +
      `<stop offset="0" stop-color="${mix(tone, towardA ? '#ffffff' : '#000000', 0.14)}"/>` +
      `<stop offset="1" stop-color="${mix(tone, towardA ? '#000000' : '#ffffff', 0.14)}"/></linearGradient>`;
    out += `<path d="${poly([o[i], o[j], n[j], n[i]])}" fill="url(#${id}f${i})"/>`;
  }
  return { defs, out };
}

//
// Guilloché rosette: rotated copies of a wavy loop, its waves seeded by the
// holder. Engraved fine enough that it only resolves when zoomed.
//
function guilloche(cx, cy, r, seed, copies = 18, steps = 144) {
  const k1 = 5 + (seed % 5);
  const k2 = 11 + ((seed >>> 4) % 7);
  const a1 = 1.6 + ((seed >>> 9) % 10) / 10;
  const a2 = 0.7 + ((seed >>> 14) % 8) / 10;
  const p1 = ((seed >>> 18) % 628) / 100;
  let d = '';
  for (let c = 0; c < copies; c++) {
    const rot = (Math.PI * 2 * c) / copies;
    for (let s = 0; s <= steps; s++) {
      const t = (Math.PI * 2 * s) / steps;
      const rr = r - 1.6 + (c % 3) * 1.6 + a1 * Math.sin(k1 * t + p1) + a2 * Math.sin(k2 * t);
      const x = cx + rr * Math.cos(t + rot);
      const y = cy + rr * Math.sin(t + rot);
      d += `${s === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`;
    }
  }
  return d;
}

let uid = 0;

//
// opts:
//   size       pixel size (default 64)
//   on         lit cube (default true); false draws the same pin, unlit
//   block      first-gm block id (full detail: microtext)
//   publickey  holder key (full detail: guilloché seed and microtext)
//   sweep      full size only: the rim's light circles once every 7s
//   title      accessible label
//
function render(opts = {}) {
  const size = Number(opts.size || 64);
  const on = opts.on !== false;
  const full = size >= 48;
  const id = `gmc${++uid}`;
  const title = opts.title || 'gm cube';
  const c = on ? LIT : UNLIT;

  const cx = 50;
  const cy = 46.5;
  const R = full
    ? { outer: 46, metal: 43, band: 36, floor: 32.5, cube: 21.5 }
    : { outer: 46, metal: 40.5, band: 35.5, floor: 32.5, cube: 25.5 };
  const k = cubePoints(cx, cy + 1.2, R.cube);

  let defs =
    // contact shadow: tight core and a wide soft pool
    `<radialGradient id="${id}sh" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="#000" stop-opacity="0.5"/><stop offset="0.55" stop-color="#000" stop-opacity="0.16"/><stop offset="1" stop-color="#000" stop-opacity="0"/></radialGradient>` +
    // enamel band under clearcoat
    `<radialGradient id="${id}enamel" cx="0.32" cy="0.22" r="0.95">` +
    `<stop offset="0" stop-color="#34353d"/><stop offset="0.45" stop-color="#16171c"/><stop offset="1" stop-color="#060608"/></radialGradient>` +
    // well floor, darker toward the walls (occlusion)
    `<radialGradient id="${id}floor" cx="0.5" cy="0.55" r="0.62">` +
    `<stop offset="0" stop-color="#17181d"/><stop offset="0.75" stop-color="#0b0b0e"/><stop offset="1" stop-color="#020203"/></radialGradient>` +
    // cube faces: top takes the key light, left the fill, right is in shade
    `<linearGradient id="${id}top" x1="0.15" y1="0.1" x2="0.85" y2="0.9">` +
    `<stop offset="0" stop-color="${c.hi}"/><stop offset="0.45" stop-color="${c.top}"/><stop offset="1" stop-color="${c.mid}"/></linearGradient>` +
    `<linearGradient id="${id}left" x1="0" y1="0" x2="0.35" y2="1">` +
    `<stop offset="0" stop-color="${c.mid}"/><stop offset="0.6" stop-color="${c.low}"/><stop offset="1" stop-color="${mix(c.low, '#000000', 0.25)}"/></linearGradient>` +
    `<linearGradient id="${id}right" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="${c.deep}"/><stop offset="1" stop-color="${c.shade}"/></linearGradient>` +
    // reflections
    `<linearGradient id="${id}soft" x1="0" y1="0" x2="1" y2="1">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="0.16"/><stop offset="0.5" stop-color="#fff" stop-opacity="0.05"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>` +
    `<radialGradient id="${id}spec" cx="0.5" cy="0.5" r="0.5">` +
    `<stop offset="0" stop-color="#fff" stop-opacity="1"/><stop offset="0.4" stop-color="#fff" stop-opacity="0.55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="${id}face"><path d="${poly(hexPoints(cx, cy, R.metal))}"/></clipPath>` +
    `<clipPath id="${id}well"><path d="${poly(hexPoints(cx, cy, R.floor))}"/></clipPath>` +
    `<clipPath id="${id}topface"><path d="${poly([k.N, k.NE, k.C, k.NW])}"/></clipPath>`;

  if (full) {
    defs +=
      `<filter id="${id}blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6"/></filter>`;
  }

  let out = '';

  // contact shadow
  out += `<ellipse cx="50.5" cy="93.4" rx="33" ry="3.6" fill="url(#${id}sh)"/>`;
  out += `<ellipse cx="51" cy="92.6" rx="20" ry="1.5" fill="#000" opacity="0.3"/>`;

  // thin polished rim: a dark outline for the silhouette, a chrome band with
  // bright and dark bands of light along it, and a fine inner highlight
  const spin =
    full && opts.sweep
      ? `<animateTransform attributeName="gradientTransform" type="rotate" from="40 0.5 0.5" to="400 0.5 0.5" dur="7s" repeatCount="indefinite"/>`
      : '';
  defs +=
    `<linearGradient id="${id}rim" x1="0" y1="0" x2="1" y2="1" gradientUnits="objectBoundingBox" gradientTransform="rotate(40 0.5 0.5)">` +
    `<stop offset="0" stop-color="#3f3f46"/><stop offset="0.16" stop-color="#f4f4f5"/><stop offset="0.3" stop-color="#a1a1aa"/>` +
    `<stop offset="0.44" stop-color="#ffffff"/><stop offset="0.6" stop-color="#52525b"/><stop offset="0.8" stop-color="#d4d4d8"/>` +
    `<stop offset="1" stop-color="#27272a"/>${spin}</linearGradient>`;
  out += `<path d="${poly(hexPoints(cx, cy, R.outer + 0.6))}" fill="#09090b"/>`;
  out += `<path d="${ring(cx, cy, R.outer, R.metal)}" fill-rule="evenodd" fill="url(#${id}rim)"/>`;
  out += `<path d="${poly(hexPoints(cx, cy, R.metal + 0.35))}" fill="none" stroke="#fff" stroke-opacity="0.35" stroke-width="${full ? 0.5 : 1}" stroke-linejoin="round"/>`;

  // enamel band, the well walls (lit on the far side, as a recess is) and floor
  out += `<path d="${poly(hexPoints(cx, cy, R.metal))}" fill="url(#${id}enamel)"/>`;
  const walls = facets(cx, cy, R.band, R.floor, true, `${id}w`);
  defs += walls.defs;
  out += `<g opacity="0.85">${walls.out}</g>`;
  out += `<path d="${poly(hexPoints(cx, cy, R.floor))}" fill="url(#${id}floor)"/>`;

  // security layer, engraved in the floor
  const seed = hash32(`${opts.publickey || 'saito'}|${opts.block || ''}`);
  if (full) {
    out +=
      `<g clip-path="url(#${id}well)"><path d="${guilloche(cx, cy + 0.6, R.floor - 4.2, seed)}" fill="none" ` +
      `stroke="${on ? '#ff5a6e' : '#a1a1aa'}" stroke-opacity="0.15" stroke-width="0.14"/></g>`;
  }

  // ambient occlusion under the cube
  const sil = poly([k.N, k.NE, k.SE, k.S, k.SW, k.NW]);
  out += full
    ? `<path d="${sil}" transform="translate(1.4 2.2)" fill="#000" opacity="0.75" filter="url(#${id}blur)"/>`
    : `<path d="${sil}" transform="translate(1 1.6)" fill="#000" opacity="0.55"/>`;

  // the cube
  out += `<path d="${poly([k.N, k.NE, k.C, k.NW])}" fill="url(#${id}top)"/>`;
  out += `<path d="${poly([k.NW, k.C, k.S, k.SW])}" fill="url(#${id}left)"/>`;
  out += `<path d="${poly([k.NE, k.SE, k.S, k.C])}" fill="url(#${id}right)"/>`;

  if (full) {
    // nanotext inside the top face: only resolves at extreme zoom
    let nano = '';
    for (let row = 0; row < 18; row++) {
      nano += `<text x="${f(k.NW[0] - 4)}" y="${f(k.N[1] + 0.9 + row * 1.05)}" font-size="0.75" letter-spacing="0.12">${'gm '.repeat(16)}</text>`;
    }
    out += `<g clip-path="url(#${id}topface)" fill="#5a0612" opacity="0.13" font-family="ui-monospace, Menlo, Consolas, monospace">${nano}</g>`;

    // impossible-cube folds as quiet engraved grooves
    const folds = [line(k.SW, k.L), line(k.L, k.NW), line(k.L, k.C), line(k.N, k.T), line(k.T, k.NE), line(k.T, k.C), line(k.B, k.SE)].join(' ');
    out += `<path d="${folds}" fill="none" stroke="#fff" stroke-opacity="${on ? 0.16 : 0.08}" stroke-width="0.9" stroke-linecap="round" transform="translate(0.3 0.45)"/>`;
    out += `<path d="${folds}" fill="none" stroke="#2a030a" stroke-opacity="0.38" stroke-width="0.9" stroke-linecap="round"/>`;

    // bevelled cube edges: the convex edges catch light by how they face it
    out += `<path d="${line(k.NW, k.C)}" stroke="#fff" stroke-opacity="0.32" stroke-width="0.6"/>`;
    out += `<path d="${line(k.C, k.NE)}" stroke="#fff" stroke-opacity="0.14" stroke-width="0.5"/>`;
    out += `<path d="${line(k.C, k.S)}" stroke="#fff" stroke-opacity="0.08" stroke-width="0.5"/>`;
    out += `<path d="${line(k.N, k.NE)}" stroke="#fff" stroke-opacity="0.26" stroke-width="0.5"/>`;
    // environment reflection down the left face
    out += `<path d="${poly([[k.NW[0] + 2.2, k.NW[1] + 1.2], [k.NW[0] + 5.2, k.NW[1] + 2.9], [k.SW[0] + 5.2, k.SW[1] + 2.9], [k.SW[0] + 2.2, k.SW[1] + 1.2]])}" fill="#fff" opacity="0.07"/>`;
  }

  // the brightest edge of the cube, facing the light
  out += `<path d="${line(k.NW, k.N)}" stroke="#fff" stroke-opacity="${on ? 0.75 : 0.4}" stroke-width="${full ? 0.8 : 2.2}" stroke-linecap="${full ? 'butt' : 'round'}"/>`;

  // clearcoat: a softbox reflection across the enamel, and glints
  out += `<path d="M${f(cx - 46)} ${f(cy - 4)} L${f(cx + 6)} ${f(cy - 46)} L${f(cx + 22)} ${f(cy - 46)} L${f(cx - 30)} ${f(cy + 4)} Z" fill="url(#${id}soft)" clip-path="url(#${id}face)"/>`;
  if (on) {
    const gx = (k.N[0] + k.NW[0]) / 2 + 1.5;
    const gy = (k.N[1] + k.C[1]) / 2 - 1;
    out += `<ellipse cx="${f(gx)}" cy="${f(gy)}" rx="${full ? 4.8 : 6}" ry="${full ? 1.5 : 2.4}" fill="url(#${id}spec)" opacity="0.8" transform="rotate(-30 ${f(gx)} ${f(gy)})"/>`;
  }
  const bv = hexPoints(cx, cy, (R.outer + R.metal) / 2);
  out += `<ellipse cx="${f(bv[5][0] + 3)}" cy="${f(bv[5][1] - 1.5)}" rx="${full ? 5 : 7}" ry="${full ? 1.2 : 2}" fill="url(#${id}spec)" transform="rotate(-30 ${f(bv[5][0] + 3)} ${f(bv[5][1] - 1.5)})"/>`;

  // microtext ring around the enamel band
  if (full) {
    const ringR = (R.metal + R.band) / 2;
    const rp = hexPoints(cx, cy, ringR);
    const order = [4, 5, 0, 1, 2, 3, 4]; // start at the left corner, run clockwise
    const pathD = 'M' + order.map((i) => `${f(rp[i][0])} ${f(rp[i][1])}`).join(' L');
    const key = String(opts.publickey || '').slice(0, 10);
    const unit = `GM · SAITO · ${key ? `${key} · ` : ''}${opts.block ? `FIRST GM BLOCK ${opts.block} · ` : ''}`;
    defs += `<path id="${id}mt" d="${pathD}"/>`;
    out +=
      `<text font-family="ui-monospace, Menlo, Consolas, monospace" font-size="1.45" letter-spacing="0.18" fill="#e4e4e7" opacity="0.38" dominant-baseline="middle">` +
      `<textPath href="#${id}mt">${esc(unit.repeat(12))}</textPath></text>`;
  }

  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="${size}" height="${size}" class="gm-cube${on ? '' : ' gm-cube-off'}" role="img" aria-label="${esc(title)}">` +
    `<title>${esc(title)}</title>` +
    `<defs>${defs}</defs>` +
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
