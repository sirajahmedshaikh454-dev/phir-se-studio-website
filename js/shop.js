initPage(() => {
  $$('.arr').forEach((e) => { e.innerHTML = icon('arrow', 18); });
  $('#srch-ic').innerHTML = icon('search', 18);
  const params = new URLSearchParams(location.search);
  const cats = [['all', 'All'], ['bags', 'Bags'], ['cushions', 'Cushions'], ['throws', 'Throws'], ['table', 'Table'], ['experiences', 'Experiences']];
  const st = { cat: params.get('cat') || 'all', q: '', max: 8000, sort: 'feat', wish: params.get('wish') === '1' };
  $('#chips').innerHTML = cats.map(([k, t]) => `<button class="chip ${k === st.cat ? 'on' : ''}" data-cat="${k}">${icon(k, 16)} ${t}</button>`).join('') + `<button class="chip ${st.wish ? 'on' : ''}" id="wishchip">${icon('heart', 16)} Saved</button>`;
  const render = () => {
    let list = PRODUCTS.filter((p) => (st.cat === 'all' || p.cat === st.cat) && p.price <= st.max && (!st.q || (p.name + ' ' + p.blurb).toLowerCase().includes(st.q)) && (!st.wish || Wish.has(p.id)));
    const s = { pa: (a, b) => a.price - b.price, pd: (a, b) => b.price - a.price, kg: (a, b) => b.kg - a.kg }[st.sort]; if (s) list = [...list].sort(s);
    $('#count').textContent = `${list.length} ${list.length === 1 ? 'piece' : 'pieces'}${st.wish ? ' you saved' : ''}`;
    const g = $('#grid');
    g.innerHTML = list.length ? list.map(productCard).join('') : `<div class="no-res">${icon('search', 48, 1.2)}<p style="margin-top:12px">${st.wish ? 'Nothing saved yet. Tap the heart on any piece.' : 'No pieces match. Try clearing a filter.'}</p><button class="btn sm ghost" id="clear" style="margin-top:16px">Clear filters</button></div>`;
    initReveals(g);
    ScrollTrigger.refresh();
  };
  $('#chips').addEventListener('click', (e) => {
    const c = e.target.closest('.chip'); if (!c) return;
    if (c.id === 'wishchip') { st.wish = !st.wish; c.classList.toggle('on', st.wish); }
    else { st.cat = c.dataset.cat; $$('#chips .chip[data-cat]').forEach((x) => x.classList.toggle('on', x === c)); }
    render();
  });
  $('#q').addEventListener('input', (e) => { st.q = e.target.value.trim().toLowerCase(); render(); });
  $('#pr').addEventListener('input', (e) => { st.max = +e.target.value; $('#pv').textContent = money(st.max); render(); });
  $('#sort').addEventListener('change', (e) => { st.sort = e.target.value; render(); });
  document.addEventListener('click', (e) => { if (e.target.closest('#clear')) { Object.assign(st, { cat: 'all', q: '', max: 8000, wish: false }); $('#q').value = ''; $('#pr').value = 8000; $('#pv').textContent = money(8000); $$('#chips .chip').forEach((x) => x.classList.toggle('on', x.dataset.cat === 'all')); render(); } });
  document.addEventListener('wish:change', () => { if (st.wish) render(); });
  render();
});
