initPage(() => {
  $('#how').innerHTML = [['mail', '1. Tell us what you need', 'Choose pieces and quantities, or ask for a custom colour mix to match your space.'], ['scissors', '2. We make it', 'Typical lead time is 2 to 3 weeks for 25 to 50 pieces. (Demo estimate.)'], ['gift', '3. Tag and deliver', 'Each piece carries a QR tag, with your own branding if you choose.']].map(([i, t, d], n) => `<div class="card rv" data-d="${n * .08}"><div class="ico">${icon(i, 26)}</div><h3>${t}</h3><p class="muted" style="margin-top:8px">${d}</p></div>`).join('');
  const tiers = [['Starter', '10 to 24 pieces', '5% off', ['Mixed colourways', 'QR origin tags', 'Free delivery']], ['Partner', '25 to 49 pieces', '10% off', ['Colours matched to your space', 'Display card for the counter', 'Free replacement covers for loose stitching'], true], ['Corporate', '50+ pieces', '15% off', ['Branded tags', 'Gift-box packing', 'Impact report with fabric saved']]];
  $('#tiers').innerHTML = tiers.map(([n, r, p, f, hot]) => `<div class="tier rv ${hot ? 'hot' : ''}"><span class="eyebrow" ${hot ? 'style="color:var(--mustard)"' : ''}>${n}</span><div class="p">${p}</div><div style="opacity:.75">${r}</div><ul>${f.map((x) => `<li>${icon('check', 18)}<span>${x}</span></li>`).join('')}</ul><a href="#quote" class="btn ${hot ? 'light' : 'ghost'} sm" style="margin-top:auto;align-self:flex-start">Build a quote</a></div>`).join('');

  const ids = ['sunrise-cushion', 'cafe-pair', 'rangeen-tote', 'dastarkhwan-set', 'chai-placemats', 'scrap-pouch'];
  const items = ids.map((id) => PRODUCTS.find((p) => p.id === id)); const q = Object.fromEntries(ids.map((i) => [i, 0]));
  $('#items').innerHTML = items.map((p) => `<label class="chk" style="cursor:default"><img src="${p.imgs[0]}" alt="" referrerpolicy="no-referrer"><span>${p.name}<br><span class="muted" style="font-size:.82rem">${money(p.price)} each</span></span><span class="pr"><span class="sr" style="position:absolute;left:-9999px">Quantity of ${p.name}</span><input type="number" min="0" max="500" value="0" data-id="${p.id}" style="width:74px;padding:.5em;border:1.5px solid var(--line);border-radius:12px;background:var(--paper);font:inherit"></span></label>`).join('');
  const calc = () => {
    const n = Object.values(q).reduce((a, b) => a + b, 0), sub = items.reduce((a, p) => a + p.price * q[p.id], 0), d = n >= 50 ? .15 : n >= 25 ? .1 : n >= 10 ? .05 : 0, tag = $('#tag').checked ? 120 * n : 0;
    const set = (id, v) => { $('#' + id).textContent = v; };
    set('qn', n); set('qs', money(sub)); set('qd', Math.round(d * 100) + '%'); set('qda', '- ' + money(sub * d)); set('qt', money(tag)); set('qtot', money(sub - sub * d + tag));
    const next = n < 10 ? 10 : n < 25 ? 25 : n < 50 ? 50 : 0; $('#qh').textContent = next ? `Add ${next - n} more pieces to reach the next discount.` : 'You have the best discount tier.';
    gsap.to('#qm', { width: Math.min(100, n / 50 * 100) + '%', duration: .5 });
  };
  $('#items').addEventListener('input', (e) => { const i = e.target.dataset.id; if (!i) return; q[i] = Math.max(0, Math.min(500, +e.target.value || 0)); calc(); });
  $('#tag').addEventListener('change', calc); calc();

  const f = $('#qf'); const bad = (n, on) => f.elements[n].closest('.field').classList.toggle('err', on);
  f.addEventListener('input', (e) => e.target.closest('.field') && e.target.closest('.field').classList.remove('err'));
  f.addEventListener('submit', (e) => {
    e.preventDefault(); const v = f.elements; const n = +$('#qn').textContent;
    const r = { co: v.co.value.trim().length > 1, nm: v.nm.value.trim().length > 1, em: /^\S+@\S+\.\S+$/.test(v.em.value) }; Object.entries(r).forEach(([k, ok]) => bad(k, !ok));
    if (!Object.values(r).every(Boolean)) { Toast('Please fix the highlighted fields', 'close'); return; }
    if (!n) { Toast('Add at least one piece to your estimate', 'close'); return; }
    const b = $('#qb'); b.disabled = true; b.textContent = 'Sending…';
    setTimeout(() => { Store.set('ps_quotes', [...Store.get('ps_quotes', []), { co: v.co.value, n, at: Date.now() }]); b.disabled = false; b.textContent = 'Request a quote'; f.reset(); Toast('Quote request saved. We will reply within a working day. (Demo)', 'check'); }, 900);
  });
  initReveals();
});
