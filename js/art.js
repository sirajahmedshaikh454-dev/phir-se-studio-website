/* Phir Se Studio — custom SVG art (all hand-built, no external assets) */
const rng = (seed) => { let a = seed >>> 0; return () => { a |= 0; a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };
const hashStr = (s) => { let h = 2166136261; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; };

/* ---------- icons ---------- */
const ICONS = {
  cart: '<circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.7 13.4a2 2 0 0 0 2 1.6h9.7a2 2 0 0 0 2-1.6L23 6H6"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  heart: '<path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/>',
  close: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>', minus: '<path d="M5 12h14"/>',
  arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>', arrowur: '<path d="M7 17 17 7M8 7h9v9"/>',
  leaf: '<path d="M11 20A7 7 0 0 1 4 13c0-5 4-9 16-9 0 12-4 16-9 16z"/><path d="M4 21c3-6 6-9 11-12"/>',
  recycle: '<path d="M7 19H4l3-5M17 5h3l-3 5"/><path d="M20 12a8 8 0 0 1-13 6M4 12a8 8 0 0 1 13-6"/>',
  scissors: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
  truck: '<path d="M1 3h15v13H1zM16 8h4l3 3v5h-7z"/><circle cx="5.5" cy="18.5" r="2"/><circle cx="18.5" cy="18.5" r="2"/>',
  check: '<path d="m5 12 5 5L20 7"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z"/>',
  menu: '<path d="M3 7h18M3 12h18M3 17h12"/>',
  gift: '<rect x="3" y="8" width="18" height="13" rx="1"/><path d="M12 8v13M3 12h18M12 8C10 4 6 5 7 8c.6 1.5 5 0 5 0zm0 0c2-4 6-3 5 0-.6 1.5-5 0-5 0z"/>',
  upload: '<path d="M12 16V4m-5 5 5-5 5 5M4 20h16"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".8"/>',
  whatsapp: '<path d="M3 21l1.6-4.6A8.5 8.5 0 1 1 8 19.5z"/><path d="M9 9c0 3 3 6 6 6l1-2-2-1-1 .8c-1-.4-2-1.4-2.4-2.4l.8-1-1-2z"/>',
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>',
  pin: '<path d="M12 22s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/>',
  filter: '<path d="M3 5h18M6 12h12M10 19h4"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  phone: '<path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  bags: '<path d="M5 8h14l1 13H4z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>',
  cushions: '<path d="M4 6c4-2 12-2 16 0 1 4 1 8 0 12-4 2-12 2-16 0-1-4-1-8 0-12z"/><path d="M8 9l1 1M16 9l-1 1M8 15l1-1M16 15l-1-1"/>',
  throws: '<path d="M3 7h18v10H3z"/><path d="M3 12h18M9 7v10M15 7v10"/>',
  table: '<path d="M2 9h20M5 9v10M19 9v10M7 9l1-4h8l1 4"/>',
  experiences: '<path d="M7 3h10l-1 8a4 4 0 0 1-8 0zM12 15v6M8 21h8"/>',
  all: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',
};
const icon = (n, s = 22, sw = 1.7) => `<svg class="ic" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[n] || ''}</svg>`;

/* ---------- patchwork swatch ---------- */
function patchSVG(pal, seed = 1, opt = {}) {
  const colors = Array.isArray(pal) ? pal : (PALETTES[pal] || PALETTES.terracotta);
  const cols = opt.cols || 3, rows = opt.rows || 3, s = opt.size || 100;
  const r = rng(typeof seed === 'string' ? hashStr(seed) : seed);
  const W = cols * s, H = rows * s; let out = '';
  for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
    const base = colors[Math.floor(r() * colors.length)];
    let alt = colors[Math.floor(r() * colors.length)]; if (alt === base) alt = '#F4ECDD';
    const px = x * s, py = y * s, k = Math.floor(r() * 6); let g = '';
    const id = `c${x}${y}${Math.floor(r() * 1e6)}`;
    g += `<rect x="${px}" y="${py}" width="${s}" height="${s}" fill="${base}"/>`;
    if (k === 1) for (let i = 1; i < 6; i++) g += `<rect x="${px}" y="${py + i * s / 6 - s / 36}" width="${s}" height="${s / 18}" fill="${alt}" opacity=".55"/>`;
    if (k === 2) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) g += `<circle cx="${px + (i + .5) * s / 4}" cy="${py + (j + .5) * s / 4}" r="${s / 22}" fill="${alt}" opacity=".7"/>`;
    if (k === 3) for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) if ((i + j) % 2 === 0) g += `<rect x="${px + i * s / 4}" y="${py + j * s / 4}" width="${s / 4}" height="${s / 4}" fill="${alt}" opacity=".35"/>`;
    if (k === 4) g += `<path d="M${px + s / 2} ${py + s * .12} L${px + s * .88} ${py + s / 2} L${px + s / 2} ${py + s * .88} L${px + s * .12} ${py + s / 2}Z" fill="${alt}" opacity=".6"/>`;
    if (k === 5) for (let a = 0; a < 6; a++) { const an = a * Math.PI / 3; g += `<circle cx="${px + s / 2 + Math.cos(an) * s * .17}" cy="${py + s / 2 + Math.sin(an) * s * .17}" r="${s * .1}" fill="${alt}" opacity=".75"/>`; }
    if (k === 5) g += `<circle cx="${px + s / 2}" cy="${py + s / 2}" r="${s * .07}" fill="#F4ECDD"/>`;
    g += `<rect x="${px + s * .08}" y="${py + s * .08}" width="${s * .84}" height="${s * .84}" fill="none" stroke="#F4ECDD" stroke-width="${s * .025}" stroke-dasharray="${s * .07} ${s * .05}" opacity=".85"/>`;
    out += g;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" role="img" aria-label="Patchwork swatch">${out}</svg>`;
}

/* ---------- logo ---------- */
const LOGO_COLS = ['#B5523B', '#2F4B7C', '#D9A441', '#2F4B7C', '#7A9A7E', '#B5523B', '#D9A441', '#B5523B', '#2F4B7C'];
function logoMark(size = 34) {
  let g = ''; const s = 10;
  LOGO_COLS.forEach((c, i) => { const x = (i % 3) * s, y = Math.floor(i / 3) * s; g += `<rect x="${x}" y="${y}" width="${s}" height="${s}" fill="${c}"/><rect x="${x + 1.6}" y="${y + 1.6}" width="${s - 3.2}" height="${s - 3.2}" fill="none" stroke="#F4ECDD" stroke-width=".55" stroke-dasharray="1.4 1"/>`; });
  return `<svg class="logo-mark" width="${size}" height="${size}" viewBox="0 0 30 30" aria-hidden="true">${g}</svg>`;
}

/* ---------- pseudo-QR (demo only, not scannable) ---------- */
function qrSVG(seed = 'demo', px = 120) {
  const n = 21, r = rng(hashStr(seed)); let g = '';
  const inFinder = (x, y) => (x < 8 && y < 8) || (x > n - 9 && y < 8) || (x < 8 && y > n - 9);
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inFinder(x, y) && r() > .52) g += `<rect x="${x}" y="${y}" width="1" height="1"/>`;
  const finder = (ox, oy) => `<rect x="${ox}" y="${oy}" width="7" height="7"/><rect x="${ox + 1}" y="${oy + 1}" width="5" height="5" fill="#F4ECDD"/><rect x="${ox + 2}" y="${oy + 2}" width="3" height="3"/>`;
  return `<svg width="${px}" height="${px}" viewBox="-1 -1 ${n + 2} ${n + 2}" fill="#231B17" shape-rendering="crispEdges" aria-label="Demo QR code"><rect x="-1" y="-1" width="${n + 2}" height="${n + 2}" fill="#F4ECDD"/>${g}${finder(0, 0)}${finder(n - 7, 0)}${finder(0, n - 7)}</svg>`;
}

/* ---------- stitched divider ---------- */
const stitchDivider = (c = '#B5523B') => `<svg class="stitch-div" viewBox="0 0 1200 24" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12 Q 30 0 60 12 T 120 12 T 180 12 T 240 12 T 300 12 T 360 12 T 420 12 T 480 12 T 540 12 T 600 12 T 660 12 T 720 12 T 780 12 T 840 12 T 900 12 T 960 12 T 1020 12 T 1080 12 T 1140 12 T 1200 12" fill="none" stroke="${c}" stroke-width="2" stroke-dasharray="9 7" stroke-linecap="round"/></svg>`;

/* ---------- needle & thread hero ornament ---------- */
const needleThread = () => `<svg class="needle-art" viewBox="0 0 420 520" fill="none" aria-hidden="true">
  <path class="thread-path" d="M338 40 C 120 60, 380 170, 160 220 S 60 330, 180 380 S 320 450, 236 506" stroke="#B5523B" stroke-width="3.2" stroke-linecap="round"/>
  <g transform="translate(318 18) rotate(32)"><rect x="-3" y="0" width="6" height="108" rx="3" fill="#231B17"/><ellipse cx="0" cy="14" rx="2" ry="9" fill="#F4ECDD"/><path d="M-3 108 L0 128 L3 108Z" fill="#231B17"/></g>
  <circle cx="236" cy="506" r="5" fill="#D9A441"/></svg>`;

/* ---------- the five process illustrations (viewBox 400x300) ---------- */
const C = { t: '#B5523B', i: '#2F4B7C', m: '#D9A441', s: '#7A9A7E', c: '#F4ECDD', k: '#231B17', r: '#D88C7A' };
const ILLO = [
  // 1 offcuts: factory + pile of folded fabric
  `<svg viewBox="0 0 400 300" fill="none"><rect x="20" y="90" width="150" height="120" fill="${C.i}" opacity=".12"/><path d="M20 90 L60 60 V90 L100 60 V90 L140 60 V90 H170 V210 H20Z" fill="${C.i}" opacity=".2"/><rect x="132" y="30" width="20" height="60" fill="${C.i}" opacity=".25"/><g class="puff"><circle cx="142" cy="22" r="9" fill="${C.k}" opacity=".12"/><circle cx="154" cy="10" r="7" fill="${C.k}" opacity=".08"/></g>
  <g transform="translate(150 150)"><rect x="0" y="80" width="210" height="26" rx="6" fill="${C.t}"/><rect x="14" y="56" width="190" height="26" rx="6" fill="${C.m}" transform="rotate(-2 100 70)"/><rect x="8" y="32" width="196" height="26" rx="6" fill="${C.i}" transform="rotate(1.5 100 45)"/><rect x="24" y="8" width="170" height="26" rx="6" fill="${C.s}" transform="rotate(-1.5 100 20)"/><path d="M20 24h150M12 48h180M22 72h170M10 96h196" stroke="${C.c}" stroke-width="2" stroke-dasharray="7 6" opacity=".75"/></g>
  <path d="M10 232 H390" stroke="${C.k}" stroke-width="2" stroke-dasharray="10 8" opacity=".35"/></svg>`,
  // 2 sort & wash
  `<svg viewBox="0 0 400 300" fill="none"><g><path d="M30 130 h100 l-12 110 a10 10 0 0 1 -10 9 h-56 a10 10 0 0 1 -10 -9z" fill="${C.t}"/><path d="M150 130 h100 l-12 110 a10 10 0 0 1 -10 9 h-56 a10 10 0 0 1 -10 -9z" fill="${C.i}"/><path d="M270 130 h100 l-12 110 a10 10 0 0 1 -10 9 h-56 a10 10 0 0 1 -10 -9z" fill="${C.m}"/></g>
  <g stroke="${C.c}" stroke-width="2.4" stroke-dasharray="6 5" opacity=".8"><path d="M44 168h72M42 196h76M46 222h68"/><path d="M164 168h72M162 196h76M166 222h68"/><path d="M284 168h72M282 196h76M286 222h68"/></g>
  <g fill="${C.c}" stroke="${C.k}" stroke-opacity=".25"><circle class="bub" cx="62" cy="96" r="12"/><circle class="bub" cx="92" cy="70" r="8"/><circle class="bub" cx="188" cy="90" r="10"/><circle class="bub" cx="312" cy="84" r="13"/><circle class="bub" cx="340" cy="56" r="7"/></g>
  <path d="M200 20 c-12 22 -18 30 -18 42 a18 18 0 0 0 36 0 c0 -12 -6 -20 -18 -42z" fill="${C.i}" opacity=".5"/></svg>`,
  // 3 cut & plan
  `<svg viewBox="0 0 400 300" fill="none"><rect x="30" y="60" width="250" height="190" rx="8" fill="${C.c}" stroke="${C.k}" stroke-opacity=".25" stroke-width="2"/>
  <g stroke="${C.c}" stroke-width="2" stroke-dasharray="5 4"><rect x="46" y="76" width="68" height="68" fill="${C.t}"/><rect x="118" y="76" width="68" height="68" fill="${C.i}"/><rect x="190" y="76" width="74" height="68" fill="${C.m}"/><rect x="46" y="148" width="68" height="86" fill="${C.s}"/><rect x="118" y="148" width="68" height="86" fill="${C.m}"/><rect x="190" y="148" width="74" height="86" fill="${C.r}"/></g>
  <g class="scis" transform="translate(300 150) rotate(-25)"><circle cx="-14" cy="62" r="16" fill="none" stroke="${C.k}" stroke-width="7"/><circle cx="26" cy="62" r="16" fill="none" stroke="${C.k}" stroke-width="7"/><path d="M-6 48 L26 -60 L38 -56 L10 52Z" fill="${C.k}"/><path d="M18 48 L-12 -60 L-24 -56 L4 52Z" fill="${C.i}"/><circle cx="6" cy="46" r="5" fill="${C.m}"/></g>
  <path d="M30 262 H280" stroke="${C.k}" stroke-width="3"/><g stroke="${C.k}" stroke-width="2"><path d="M60 262v-8M90 262v-8M120 262v-8M150 262v-8M180 262v-8M210 262v-8M240 262v-8M270 262v-8"/></g></svg>`,
  // 4 stitch (sewing machine)
  `<svg viewBox="0 0 400 300" fill="none"><rect x="30" y="236" width="340" height="16" rx="8" fill="${C.k}" opacity=".85"/>
  <path d="M70 236 V120 a30 30 0 0 1 30 -30 H300 a26 26 0 0 1 26 26 v30 h-26 v14 h-34 v-14 h-30 v20 h-18 v90z" fill="${C.t}"/><rect x="92" y="108" width="120" height="14" rx="7" fill="${C.c}" opacity=".5"/><circle cx="104" cy="170" r="20" fill="${C.c}" opacity=".9"/><circle cx="104" cy="170" r="8" fill="${C.t}"/>
  <rect x="236" y="168" width="12" height="52" rx="3" fill="${C.k}"/><path d="M242 220 v10" stroke="${C.k}" stroke-width="3"/>
  <g class="spool"><rect x="140" y="62" width="34" height="32" rx="5" fill="${C.m}"/><rect x="134" y="58" width="46" height="8" rx="4" fill="${C.k}"/><rect x="134" y="90" width="46" height="8" rx="4" fill="${C.k}"/></g>
  <path class="thread-path" d="M157 62 C 157 30, 230 30, 242 150" stroke="${C.m}" stroke-width="3" stroke-linecap="round"/>
  <path d="M170 230 h200 v8 h-200z" fill="${C.i}"/><path class="seam" d="M176 226 H366" stroke="${C.c}" stroke-width="3" stroke-dasharray="9 7"/></svg>`,
  // 5 tag & ship
  `<svg viewBox="0 0 400 300" fill="none"><rect x="60" y="110" width="220" height="150" rx="6" fill="${C.m}"/><path d="M60 110 L170 60 L280 110" fill="${C.t}"/><path d="M170 60 V260" stroke="${C.k}" stroke-opacity=".2" stroke-width="3"/><path d="M60 170 H280" stroke="${C.c}" stroke-width="3" stroke-dasharray="8 6"/>
  <g class="tag" transform="translate(238 150) rotate(12)"><path d="M0 0 H70 V96 H0Z" fill="${C.c}" stroke="${C.k}" stroke-width="2"/><circle cx="35" cy="10" r="4" fill="none" stroke="${C.k}" stroke-width="2"/><g transform="translate(10 22) scale(2.6)">${qrSVG('tag', 20).replace(/<svg[^>]*>|<\/svg>/g, '')}</g></g>
  <path d="M273 140 C 262 128, 250 130, 246 150" stroke="${C.k}" stroke-width="2.4"/>
  <g transform="translate(300 40)"><circle cx="40" cy="40" r="38" fill="${C.s}"/><path d="M26 56 C 22 36, 38 22, 58 24 C 58 44, 48 58, 26 56Z" fill="${C.c}"/><path d="M26 56 C 36 46, 44 40, 52 32" stroke="${C.s}" stroke-width="2.4"/></g>
  <path d="M30 276 H370" stroke="${C.k}" stroke-width="2" stroke-dasharray="10 8" opacity=".35"/></svg>`,
];

/* ---------- confetti of patches ---------- */
function confettiPatches(host, n = 40) {
  const cs = Object.values(COLORS).slice(0, 6);
  for (let i = 0; i < n; i++) {
    const d = document.createElement('i'); d.className = 'confetti';
    d.style.cssText = `left:${50 + (Math.random() - .5) * 20}%;top:50%;background:${cs[i % cs.length]};width:${10 + Math.random() * 12}px;height:${10 + Math.random() * 12}px;`;
    host.appendChild(d);
    gsap.to(d, { x: (Math.random() - .5) * 700, y: (Math.random() - .8) * 500, rotation: Math.random() * 540, opacity: 0, duration: 1.6 + Math.random(), ease: 'power3.out', onComplete: () => d.remove() });
  }
}
