initPage(() => {
  const root = $('#cart-root'); let promo = Store.get('ps_promo', null);
  const disc = () => (promo === 'PHIRSE10' ? Math.round(Cart.sub() * .1) : 0);
  const total = () => Cart.sub() - disc() + Cart.ship();

  function render() {
    const items = Cart.items();
    if (!items.length) { root.innerHTML = `<div class="empty" style="grid-column:1/-1;padding:80px 0">${icon('cart', 64, 1.1)}<h3 style="margin:10px 0">Nothing here yet</h3><p>Every piece starts as scrap. Pick one to give it a second life.</p><a class="btn" href="shop.html" style="margin-top:20px">Browse the shop</a></div>`; return; }
    root.innerHTML = `<div>
      ${items.map((i) => `<div class="ci" style="grid-template-columns:96px 1fr auto"><div class="th" style="width:96px;height:96px">${i.thumb ? `<img src="${i.thumb}" alt="">` : `<img src="${i.img}" alt="" referrerpolicy="no-referrer">`}</div>
        <div><h4 style="font-size:1.05rem">${i.name}</h4><small>${Object.entries(i.opts || {}).map(([k, v]) => `${k}: ${v}`).join(' · ')}</small>
        <div class="qty"><button data-q="${i.key}" data-d="-1" aria-label="Less">${icon('minus', 14)}</button><span>${i.qty}</span><button data-q="${i.key}" data-d="1" aria-label="More">${icon('plus', 14)}</button></div></div>
        <div style="text-align:right"><div class="price">${money(i.price * i.qty)}</div><button data-rm="${i.key}" class="muted" style="font-size:.82rem;text-decoration:underline;padding:8px">Remove</button></div></div>`).join('')}
      <div style="display:flex;gap:10px;margin-top:22px;flex-wrap:wrap"><label class="fld" style="flex:1;min-width:200px"><span class="sr" style="position:absolute;left:-9999px">Promo code</span><input id="promo" placeholder="Promo code (try PHIRSE10)" value="${promo || ''}"></label><button class="btn sm ghost" id="apply">Apply</button></div>
      <div class="panel" style="margin-top:30px"><h3>Delivery details</h3><p class="muted" style="margin-bottom:18px;font-size:.9rem">Demo form. Nothing is stored except in this browser.</p>
      <form id="co" novalidate>
        <div class="g2"><label class="field"><span>Full name</span><input name="name" autocomplete="name"><em class="em">Please enter your name</em></label><label class="field"><span>Mobile number</span><input name="phone" inputmode="tel" placeholder="03XX XXXXXXX" autocomplete="tel"><em class="em">Enter a valid Pakistani mobile number</em></label></div>
        <div class="g2"><label class="field"><span>City</span><select name="city"><option value="">Choose a city</option><option>Faisalabad</option><option>Lahore</option><option>Islamabad</option><option>Rawalpindi</option><option>Karachi</option><option>Other</option></select><em class="em">Please choose a city</em></label><label class="field"><span>Email (optional)</span><input name="email" type="email" autocomplete="email"><em class="em">Enter a valid email</em></label></div>
        <label class="field"><span>Delivery address</span><textarea name="addr" rows="3" autocomplete="street-address"></textarea><em class="em">Please add your address</em></label>
        <div class="pay"><label><input type="radio" name="pay" value="Cash on delivery" checked>Cash on delivery</label><label><input type="radio" name="pay" value="Bank transfer">Bank transfer</label><label><input type="radio" name="pay" value="Mobile wallet">Mobile wallet</label></div>
        <button class="btn" type="submit" id="place" style="width:100%;justify-content:center">Place demo order</button></form></div></div>
      <aside class="sum"><h3 style="margin-bottom:16px">Order summary</h3>
        <div class="row"><span>Subtotal</span><span>${money(Cart.sub())}</span></div>
        ${disc() ? `<div class="row" style="color:var(--sage)"><span>Launch code PHIRSE10</span><span>- ${money(disc())}</span></div>` : ''}
        <div class="row"><span>Delivery</span><span>${Cart.ship() ? money(Cart.ship()) : 'Free'}</span></div>
        <div class="row tot"><span>Total</span><span>${money(total())}</span></div>
        <div style="margin-top:18px;padding:14px;border-radius:16px;background:var(--cream2);display:flex;gap:10px;align-items:center">${icon('leaf', 22)}<span style="font-size:.92rem"><b>${Cart.kg().toFixed(1)} kg</b> of fabric saved with this order</span></div></aside>`;
    bind();
  }
  function bind() {
    $('#apply').onclick = () => { const v = $('#promo').value.trim().toUpperCase(); if (v === 'PHIRSE10') { promo = v; Store.set('ps_promo', v); Toast('Launch code applied: 10% off', 'check'); } else { promo = null; Store.set('ps_promo', null); Toast(v ? 'That code is not valid' : 'Code cleared', 'close'); } render(); };
    const form = $('#co'), bad = (n, on) => form.elements[n].closest('.field').classList.toggle('err', on);
    form.addEventListener('submit', (e) => {
      e.preventDefault(); const f = form.elements; let ok = true;
      const rules = { name: f.name.value.trim().length > 1, phone: /^(\+92|0)?3\d{2}[\s-]?\d{7}$/.test(f.phone.value.trim()), city: !!f.city.value, addr: f.addr.value.trim().length > 6, email: !f.email.value || /^\S+@\S+\.\S+$/.test(f.email.value) };
      Object.entries(rules).forEach(([k, v]) => { bad(k, !v); if (!v) ok = false; });
      if (!ok) { Toast('Please fix the highlighted fields', 'close'); const first = $('.field.err', form); first && lenis ? lenis.scrollTo(first, { offset: -140 }) : first && first.scrollIntoView({ block: 'center' }); return; }
      const btn = $('#place'); btn.disabled = true; btn.innerHTML = 'Placing order…';
      setTimeout(() => {
        const order = { id: 'PS-' + Math.floor(10000 + Math.random() * 89999), total: total(), kg: Cart.kg(), items: Cart.count(), name: f.name.value.trim(), pay: f.pay.value, at: new Date().toISOString() };
        Store.set('ps_orders', [...Store.get('ps_orders', []), order]); Cart.clear(); Store.set('ps_promo', null); promo = null;
        const m = openModal(`<div class="done">${logoMark(64)}<h2>Thank you, ${order.name.split(' ')[0]}!</h2><p class="muted">Order <b>${order.id}</b> is a demo order, so nothing was charged or shipped.</p><div class="equiv" style="max-width:420px;margin:24px auto"><div><b>${money(order.total)}</b><span class="muted">${order.pay}</span></div><div><b>${order.kg.toFixed(1)} kg</b><span class="muted">fabric saved</span></div></div><a class="btn" href="shop.html">Keep browsing</a></div>`, { onClose: render });
        confettiPatches(document.body, 46);
      }, 1100);
    });
    form.addEventListener('input', (e) => { const fld = e.target.closest('.field'); fld && fld.classList.remove('err'); });
  }
  root.addEventListener('click', (e) => { const q = e.target.closest('[data-q]'); if (q) Cart.qty(q.dataset.q, +q.dataset.d); const r = e.target.closest('[data-rm]'); if (r) Cart.rm(r.dataset.rm); });
  document.addEventListener('cart:change', render);
  render();
});
