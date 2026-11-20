/* Phir Se Studio — shared shell: nav, cart, transitions, smooth scroll, cursor, reveals */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const money = (n) => 'PKR ' + Math.round(n).toLocaleString('en-US');
const M = window.Motion || {};
const hasM = !!M.animate;
const EASE = [0.22, 1, 0.36, 1];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const PAGE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

const Store = {
  get(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch (e) { return d; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* storage blocked: demo still works for this page */ } },
};
let _cart = Store.get('ps_cart', []);
let _wish = Store.get('ps_wish', []);
const Cart = {
  items: () => _cart,
  count: () => _cart.reduce((a, i) => a + i.qty, 0),
  sub: () => _cart.reduce((a, i) => a + i.qty * i.price, 0),
  kg: () => _cart.reduce((a, i) => a + i.qty * (i.kg || 0), 0),
  ship: () => (Cart.sub() === 0 || Cart.sub() >= 5000 ? 0 : 250),
  save() { Store.set('ps_cart', _cart); document.dispatchEvent(new CustomEvent('cart:change')); },
  add(item) {
    const key = item.id + '|' + JSON.stringify(item.opts || {});
    const ex = _cart.find((i) => i.key === key);
    if (ex) ex.qty += item.qty || 1; else _cart.push({ ...item, key, qty: item.qty || 1 });
    Cart.save(); Toast(`${item.name} added to cart`, 'check'); popBadge();
  },
  qty(key, d) { const i = _cart.find((x) => x.key === key); if (!i) return; i.qty = Math.max(0, i.qty + d); if (!i.qty) _cart = _cart.filter((x) => x.key !== key); Cart.save(); },
  rm(key) { _cart = _cart.filter((x) => x.key !== key); Cart.save(); },
  clear() { _cart = []; Cart.save(); },
};
const Wish = {
  has: (id) => _wish.includes(id),
  toggle(id) { _wish = _wish.includes(id) ? _wish.filter((x) => x !== id) : [..._wish, id]; Store.set('ps_wish', _wish); document.dispatchEvent(new CustomEvent('wish:change')); return _wish.includes(id); },
  count: () => _wish.length,
};

/* ---------- toast ---------- */
function Toast(msg, ic = 'check') {
  let host = $('.toasts'); if (!host) { host = document.createElement('div'); host.className = 'toasts'; document.body.appendChild(host); }
  const t = document.createElement('div'); t.className = 'toast'; t.innerHTML = icon(ic, 18) + `<span>${msg}</span>`; host.appendChild(t);
  if (hasM) {
    M.animate(t, { opacity: [0, 1], transform: ['translateY(24px) scale(.95)', 'translateY(0) scale(1)'] }, { duration: .5, ease: EASE });
    setTimeout(() => M.animate(t, { opacity: 0, transform: 'translateY(-10px)' }, { duration: .35 }).finished.then(() => t.remove()), 2400);
  } else setTimeout(() => t.remove(), 2600);
}
function popBadge() { const b = $('#cart-badge'); if (b && hasM) M.animate(b, { transform: ['scale(1)', 'scale(1.6)', 'scale(1)'] }, { duration: .5 }); }

/* ---------- product card (shared by home + shop + product page) ---------- */
function productCard(p) {
  const wished = Wish.has(p.id);
  return `<article class="pc rv" data-id="${p.id}">
    <a href="product.html?id=${p.id}" data-cursor="View" aria-label="${p.name}">
      <div class="im">${p.tag ? `<span class="tag">${p.tag}</span>` : ''}
        <img src="${p.imgs[0]}" alt="${p.name}" loading="lazy" referrerpolicy="no-referrer">${p.imgs[1] ? `<img src="${p.imgs[1]}" alt="" loading="lazy" referrerpolicy="no-referrer">` : ''}
        <span class="sw">${patchSVG(p.palette, p.id, { cols: 2, rows: 2 })}</span>
      </div>
    </a>
    <button class="ibtn wish ${wished ? 'on' : ''}" data-wish="${p.id}" aria-label="Save ${p.name}">${icon('heart', 20)}</button>
    <div class="quick"><button class="btn sm" data-add="${p.id}">${icon('plus', 16)} ${p.experience ? 'Book a seat' : 'Add to cart'}</button></div>
    <div class="meta"><div><h3>${p.name}</h3>${p.kg ? `<span class="kg">${icon('leaf', 14)} saves ${p.kg} kg fabric</span>` : `<span class="kg">${icon('scissors', 14)} 2 hours, materials included</span>`}</div><span class="pr">${money(p.price)}</span></div>
  </article>`;
}
function addToCart(id, extra = {}) {
  const p = PRODUCTS.find((x) => x.id === id); if (!p) return;
  Cart.add({ id: p.id, name: p.name, price: p.price, kg: p.kg, img: p.imgs[0], opts: extra.opts || {}, qty: extra.qty || 1 });
}
document.addEventListener('click', (e) => {
  const a = e.target.closest('[data-add]'); if (a) { e.preventDefault(); addToCart(a.dataset.add); return; }
  const w = e.target.closest('[data-wish]'); if (w) {
    e.preventDefault(); const on = Wish.toggle(w.dataset.wish); w.classList.toggle('on', on);
    if (hasM) M.animate(w, { transform: ['scale(1)', 'scale(1.35)', 'scale(1)'] }, { duration: .45 });
    Toast(on ? 'Saved to your wishlist' : 'Removed from wishlist', 'heart');
  }
});

/* ---------- header / footer / drawer ---------- */
const NAV = [['shop.html', 'Shop'], ['memory.html', 'Memory Throw'], ['impact.html', 'Impact'], ['story.html', 'Our Story'], ['partners.html', 'Partners'], ['journal.html', 'Journal']];
function buildShell() {
  const hdr = document.createElement('header'); hdr.className = 'hdr'; hdr.id = 'hdr';
  hdr.innerHTML = `<a class="brand" href="index.html" aria-label="Phir Se Studio home">${logoMark(36)}<span>Phir Se<small>Studio</small></span></a>
    <nav class="nav" aria-label="Main">${NAV.map(([h, t]) => `<a href="${h}" class="${PAGE === h ? 'on' : ''}">${t}</a>`).join('')}</nav>
    <div class="hdr-actions"><a class="ibtn" href="shop.html?wish=1" aria-label="Wishlist">${icon('heart', 22)}<span class="badge" id="wish-badge" style="display:none">0</span></a>
    <button class="ibtn" id="cart-btn" aria-label="Open cart">${icon('cart', 22)}<span class="badge" id="cart-badge">0</span></button>
    <button class="ibtn burger" id="burger" aria-label="Menu">${icon('menu', 24)}</button></div>`;
  document.body.prepend(hdr);

  const mn = document.createElement('div'); mn.className = 'mnav'; mn.id = 'mnav';
  mn.innerHTML = `<button class="ibtn mclose" id="mclose" aria-label="Close menu">${icon('close', 26)}</button>` + [['index.html', 'Home']].concat(NAV, [['contact.html', 'Contact']]).map(([h, t], i) => `<a href="${h}"><span>0${i + 1}</span>${t}</a>`).join('');
  document.body.appendChild(mn);

  const d = document.createElement('div');
  d.innerHTML = `<div class="scrim" id="scrim"></div><aside class="drawer" id="drawer" aria-label="Cart"><header><h3>Your cart</h3><button class="ibtn" id="dclose" aria-label="Close cart">${icon('close', 22)}</button></header><div class="d-body" id="d-body"></div><footer id="d-foot"></footer></aside>`;
  while (d.firstChild) document.body.appendChild(d.firstChild);

  const f = document.createElement('footer'); f.className = 'ftr';
  f.innerHTML = `<div class="ftr-g"><div><a class="brand" href="index.html">${logoMark(40)}<span>Phir Se<small>Studio</small></span></a><p style="margin-top:18px;max-width:34ch;color:rgba(246,239,227,.7)">Patchwork home décor and bags, hand-stitched in Faisalabad from export-factory offcuts. Fabric, once more.</p><div class="soc"><a href="#" aria-label="Instagram">${icon('instagram', 20)}</a><a href="contact.html" aria-label="WhatsApp">${icon('whatsapp', 20)}</a><a href="contact.html" aria-label="Email">${icon('mail', 20)}</a></div></div>
    <div><h4>Shop</h4><ul><li><a href="shop.html?cat=bags">Bags</a></li><li><a href="shop.html?cat=cushions">Cushions</a></li><li><a href="shop.html?cat=throws">Throws</a></li><li><a href="shop.html?cat=table">Table linen</a></li><li><a href="memory.html">Memory Throw</a></li></ul></div>
    <div><h4>Studio</h4><ul><li><a href="story.html">Our story</a></li><li><a href="impact.html">Impact</a></li><li><a href="partners.html">Cafés and gifting</a></li><li><a href="journal.html">Journal</a></li><li><a href="contact.html">Contact</a></li></ul></div>
    <div><h4>Letters from the studio</h4><p style="color:rgba(246,239,227,.7);margin-bottom:14px">New drops, pop-up dates and a 10% launch code (PHIRSE10).</p><form class="nl" id="nl"><input type="email" placeholder="you@example.com" aria-label="Email" required><button class="btn light sm" type="submit">Join</button></form></div></div>
    <div class="big" aria-hidden="true">Phir Se</div>
    <div class="bot"><span>© 2026 Phir Se Studio. A demo website: no real orders or payments.</span><span>Photos: Pexels (free licence)</span></div>`;
  document.body.appendChild(f);

  const pt = document.createElement('div'); pt.className = 'pt'; pt.id = 'pt';
  const cs = ['#B5523B', '#2F4B7C', '#D9A441', '#7A9A7E', '#D88C7A', '#231B17'];
  pt.innerHTML = Array.from({ length: 24 }, (_, i) => `<i style="--c:${cs[(i * 7 + (i >> 2)) % 6]}"></i>`).join('') + `<div class="pt-logo">${logoMark(90)}</div>`;
  document.body.appendChild(pt);
  if (!matchMedia('(hover:none)').matches) {
    const c = document.createElement('div'); c.className = 'cur'; c.innerHTML = '<span class="cur-t"></span>'; const dot = document.createElement('div'); dot.className = 'cur-dot';
    document.body.append(c, dot);
  }
}

let lenis;
function initScroll() {
  if (window.Lenis && !reduce) {
    lenis = new Lenis({ duration: 1.15, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), smoothWheel: true });
    if (window.gsap && window.ScrollTrigger) { lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((t) => lenis.raf(t * 1000)); gsap.ticker.lagSmoothing(0); }
    else { const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); }
  }
  if (window.gsap && window.ScrollTrigger) gsap.registerPlugin(ScrollTrigger);
  const h = $('#hdr'); let last = 0;
  addEventListener('scroll', () => { const y = scrollY; h.classList.toggle('scrolled', y > 30); h.classList.toggle('hide', y > last && y > 400 && !document.body.classList.contains('lock')); last = y; }, { passive: true });
}
const lockScroll = (on) => { document.body.classList.toggle('lock', on); if (lenis) on ? lenis.stop() : lenis.start(); };

/* ---------- drawer ---------- */
function renderCart() {
  const items = Cart.items(), body = $('#d-body'), foot = $('#d-foot');
  const n = Cart.count(); const b = $('#cart-badge'); b.textContent = n; b.style.display = n ? 'grid' : 'none';
  const wb = $('#wish-badge'); wb.textContent = Wish.count(); wb.style.display = Wish.count() ? 'grid' : 'none';
  if (!items.length) {
    body.innerHTML = `<div class="empty">${icon('cart', 56, 1.2)}<p>Your cart is empty.<br>Every piece starts as scrap. Pick one to give it a second life.</p><a href="shop.html" class="btn sm" style="margin-top:18px">Browse the shop</a></div>`; foot.innerHTML = ''; return;
  }
  const left = Math.max(0, 5000 - Cart.sub());
  body.innerHTML = `<div style="padding:14px 0 4px;font-size:.88rem">${left ? `Add <b>${money(left)}</b> more for free delivery` : `<b style="color:var(--sage)">You have free delivery</b>`}<div class="meter"><i style="width:${Math.min(100, Cart.sub() / 50)}%"></i></div></div>` +
    items.map((i) => `<div class="ci"><div class="th">${i.thumb ? `<img src="${i.thumb}" alt="">` : `<img src="${i.img}" alt="" referrerpolicy="no-referrer">`}</div><div><h4>${i.name}</h4><small>${Object.values(i.opts || {}).join(' · ')}</small><div class="qty"><button data-q="${i.key}" data-d="-1" aria-label="Less">${icon('minus', 14)}</button><span>${i.qty}</span><button data-q="${i.key}" data-d="1" aria-label="More">${icon('plus', 14)}</button></div></div><div style="text-align:right"><div class="price">${money(i.price * i.qty)}</div><button data-rm="${i.key}" class="muted" style="font-size:.8rem;text-decoration:underline">Remove</button></div></div>`).join('');
  foot.innerHTML = `<div class="row"><span>Subtotal</span><b>${money(Cart.sub())}</b></div><div class="row muted"><span>Fabric saved</span><span>${Cart.kg().toFixed(1)} kg</span></div><a href="cart.html" class="btn" style="width:100%;justify-content:center;margin-top:10px">Checkout ${icon('arrow', 18)}</a>`;
  $$('.meter i', body).forEach((el) => { const w = el.style.width; el.style.width = 0; requestAnimationFrame(() => { el.style.transition = 'width .8s'; el.style.width = w; }); });
}
let drawerOpen = false;
function setDrawer(open) {
  drawerOpen = open; const d = $('#drawer'), s = $('#scrim'); lockScroll(open);
  s.classList.toggle('on', open);
  if (hasM) { M.animate(d, { transform: open ? ['translateX(105%)', 'translateX(0%)'] : 'translateX(105%)' }, { duration: .6, ease: EASE }); M.animate(s, { opacity: open ? 1 : 0 }, { duration: .4 }); }
  else { d.style.transform = open ? 'none' : 'translateX(105%)'; s.style.opacity = open ? 1 : 0; }
  if (open) renderCart();
}
function bindShell() {
  $('#cart-btn').onclick = () => setDrawer(true);
  $('#dclose').onclick = $('#scrim').onclick = () => setDrawer(false);
  addEventListener('keydown', (e) => { if (e.key === 'Escape') { if (drawerOpen) setDrawer(false); closeMenu(); } });
  $('#drawer').addEventListener('click', (e) => {
    const q = e.target.closest('[data-q]'); if (q) Cart.qty(q.dataset.q, +q.dataset.d);
    const r = e.target.closest('[data-rm]'); if (r) Cart.rm(r.dataset.rm);
  });
  document.addEventListener('cart:change', () => { renderCart(); });
  document.addEventListener('wish:change', () => renderCart());
  const mn = $('#mnav');
  const closeMenu = () => { if (!mn.classList.contains('open')) return; mn.classList.remove('open'); lockScroll(false); gsap.to(mn, { clipPath: 'circle(0% at calc(100% - 44px) 36px)', duration: .7, ease: 'power3.inOut' }); };
  window.closeMenu = closeMenu;
  $('#burger').onclick = () => { mn.classList.add('open'); lockScroll(true); gsap.to(mn, { clipPath: 'circle(150% at calc(100% - 44px) 36px)', duration: .9, ease: 'power3.inOut' }); gsap.from('#mnav a', { y: 60, opacity: 0, stagger: .06, duration: .8, delay: .25, ease: 'power3.out' }); };
  $('#mclose').onclick = closeMenu;
  $('#nl').addEventListener('submit', (e) => { e.preventDefault(); e.target.reset(); Toast('Thank you! Use code PHIRSE10 at checkout.', 'mail'); });
  renderCart();
}

/* ---------- page transitions ---------- */
function initTransitions() {
  const pt = $('#pt'), cells = $$('#pt i'), logo = $('.pt-logo'); let busy = false;
  const reveal = () => { busy = false; pt.classList.remove('on'); gsap.to(logo, { opacity: 0, duration: .2 }); gsap.to(cells, { scale: 0, duration: .7, stagger: { each: .03, from: 'random' }, ease: 'power3.inOut' }); };
  gsap.set(cells, { scale: 1 });
  const first = !!$('.pre');
  if (first) gsap.set(cells, { scale: 0 }); else setTimeout(reveal, 120);
  addEventListener('pageshow', (e) => { if (e.persisted) reveal(); });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]'); if (!a || busy) return;
    const h = a.getAttribute('href');
    if (e.metaKey || e.ctrlKey || e.shiftKey || a.target === '_blank' || !h || h.startsWith('#') || /^(https?:|mailto:|tel:)/.test(h)) return;
    if (h.split('#')[0].split('?')[0] === PAGE && !h.includes('?')) { e.preventDefault(); return; }
    e.preventDefault(); busy = true; pt.classList.add('on'); closeMenu && closeMenu();
    gsap.to(cells, { scale: 1, duration: .55, stagger: { each: .025, from: 'random' }, ease: 'power3.inOut', onComplete: () => { gsap.to(logo, { opacity: 1, duration: .2 }); setTimeout(() => { location.href = h; }, 180); } });
  });
}

/* ---------- cursor ---------- */
function initCursor() {
  const c = $('.cur'), d = $('.cur-dot'); if (!c) return;
  const xc = gsap.quickTo(c, 'x', { duration: .45, ease: 'power3' }), yc = gsap.quickTo(c, 'y', { duration: .45, ease: 'power3' });
  const xd = gsap.quickTo(d, 'x', { duration: .1 }), yd = gsap.quickTo(d, 'y', { duration: .1 });
  addEventListener('mousemove', (e) => { xc(e.clientX); yc(e.clientY); xd(e.clientX); yd(e.clientY); });
  document.addEventListener('mouseover', (e) => {
    const t = e.target.closest('[data-cursor]');
    c.classList.toggle('big', !!t); $('.cur-t', c).textContent = t ? t.dataset.cursor : '';
    d.style.opacity = t ? 0 : 1;
  });
}

/* ---------- text split + reveals ---------- */
function splitWords(el) {
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        const frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach((w) => { if (!w.trim()) { frag.appendChild(document.createTextNode(w)); return; } const o = document.createElement('span'); o.className = 'ln'; o.style.display = 'inline-block'; o.innerHTML = `<span>${w}</span>`; frag.appendChild(o); });
        n.replaceWith(frag);
      } else if (n.nodeType === 1) walk(n);
    });
  };
  walk(el); return $$('.ln > span', el);
}
function initReveals(root = document) {
  $$('[data-split]', root).forEach((el) => {
    if (el._sp) return; el._sp = 1; const w = splitWords(el);
    gsap.set(w, { yPercent: 115 });
    ScrollTrigger.create({ trigger: el, start: 'top 88%', once: true, onEnter: () => gsap.to(w, { yPercent: 0, duration: 1.1, stagger: .045, ease: 'power4.out', delay: +(el.dataset.delay || 0) }) });
  });
  $$('.rv', root).forEach((el) => {
    if (el._rv) return; el._rv = 1;
    const go = () => hasM ? M.animate(el, { opacity: 1, transform: 'translateY(0px)' }, { duration: .9, delay: +(el.dataset.d || 0), ease: EASE }) : (el.style.opacity = 1, el.style.transform = 'none');
    if (hasM && M.inView) M.inView(el, () => { go(); }, { margin: '0px 0px -8% 0px' }); else go();
  });
  $$('.frame img[data-par]', root).forEach((img) => { if (img._p) return; img._p = 1; gsap.fromTo(img, { yPercent: -5 }, { yPercent: 5, ease: 'none', scrollTrigger: { trigger: img.parentElement, scrub: true } }); });
  $$('[data-count]', root).forEach((el) => {
    if (el._c) return; el._c = 1; const to = +el.dataset.count, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const set = (v) => { el.textContent = pre + (dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US')) + suf; };
    set(0);
    const run = () => hasM ? M.animate(0, to, { duration: 2.2, ease: EASE, onUpdate: set }) : set(to);
    if (hasM && M.inView) M.inView(el, () => { run(); }); else run();
  });
  $$('[data-mag]', root).forEach((el) => {
    if (el._m || matchMedia('(hover:none)').matches) return; el._m = 1;
    const x = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), y = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
    el.addEventListener('mousemove', (e) => { const r = el.getBoundingClientRect(); x((e.clientX - r.left - r.width / 2) * .28); y((e.clientY - r.top - r.height / 2) * .28); });
    el.addEventListener('mouseleave', () => { x(0); y(0); });
  });
}

/* ---------- accordion (Motion) ---------- */
function initAccordions(root = document) {
  $$('.acc-i', root).forEach((it) => {
    if (it._a) return; it._a = 1; const q = $('.acc-q', it), a = $('.acc-a', it);
    q.addEventListener('click', () => {
      const open = it.classList.toggle('open');
      const h = a.firstElementChild.offsetHeight;
      hasM ? M.animate(a, { height: open ? [0, h + 'px'] : [a.offsetHeight + 'px', 0] }, { duration: .5, ease: EASE }).finished.then(() => { if (open) a.style.height = 'auto'; }) : (a.style.height = open ? 'auto' : 0);
      q.setAttribute('aria-expanded', open);
    });
  });
}

/* ---------- modal helper ---------- */
function openModal(html, opts = {}) {
  const m = document.createElement('div'); m.className = 'modal on'; m.innerHTML = `<div class="box"><button class="ibtn x" aria-label="Close">${icon('close', 22)}</button>${html}</div>`;
  document.body.appendChild(m); lockScroll(true);
  const box = $('.box', m);
  if (hasM) { M.animate(m, { opacity: [0, 1] }, { duration: .3 }); M.animate(box, { opacity: [0, 1], transform: ['translateY(40px) scale(.96)', 'translateY(0) scale(1)'] }, { duration: .6, ease: EASE }); }
  const close = () => { const done = () => { m.remove(); lockScroll(false); opts.onClose && opts.onClose(); }; hasM ? M.animate(m, { opacity: 0 }, { duration: .3 }).finished.then(done) : done(); };
  m.addEventListener('click', (e) => { if (e.target === m || e.target.closest('.x')) close(); });
  addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { close(); removeEventListener('keydown', esc); } });
  return { el: m, close };
}

/* ---------- marquee ---------- */
function initMarquee() {
  $$('.marq-in').forEach((m) => {
    if (!m.children.length || m._mq) return; m._mq = 1;
    m.innerHTML += m.innerHTML; const w = m.scrollWidth / 2;
    gsap.to(m, { x: -w, duration: 34, ease: 'none', repeat: -1 });
    ScrollTrigger.create({ trigger: m, onUpdate: (s) => gsap.to(m, { timeScale: 1 + Math.abs(s.getVelocity()) / 400, duration: .3 }) });
  });
}

/* ---------- preloader (home, first visit per session) ---------- */
function initPreloader(done) {
  const pre = $('.pre'); if (!pre) { done(); return; }
  if (sessionStorage.getItem('ps_seen')) { pre.remove(); done(); return; }
  sessionStorage.setItem('ps_seen', '1'); lockScroll(true);
  const path = $('.pre-thread path', pre), len = path.getTotalLength(); gsap.set(path, { strokeDasharray: len, strokeDashoffset: len });
  const tl = gsap.timeline({ onComplete: () => { pre.remove(); lockScroll(false); done(); } });
  tl.to(path, { strokeDashoffset: 0, duration: 1.8, ease: 'power2.inOut' }, 0)
    .to($('.bar i', pre), { width: '100%', duration: 1.9, ease: 'power1.inOut' }, 0)
    .from($('.urdu', pre), { y: 40, opacity: 0, duration: .9, ease: 'power3.out' }, .2)
    .to(pre, { yPercent: -100, duration: 1, ease: 'power4.inOut', delay: .2 });
}

function initPage(extra) {
  buildShell(); initScroll(); bindShell(); initTransitions(); initCursor();
  const start = () => { initReveals(); initAccordions(); initMarquee(); if (extra) extra(); ScrollTrigger.refresh(); };
  initPreloader(() => { start(); document.dispatchEvent(new CustomEvent('ps:ready')); });
}
