initPage(() => {
  const cats = ['All', ...new Set(JOURNAL.map((j) => j.cat))]; let cat = 'All';
  $('#jchips').innerHTML = cats.map((c) => `<button class="chip ${c === cat ? 'on' : ''}" data-c="${c}">${c}</button>`).join('');
  const render = () => {
    const list = JOURNAL.filter((j) => cat === 'All' || j.cat === cat);
    $('#jgrid').innerHTML = list.map((j) => `<article class="jc rv" data-id="${j.id}" tabindex="0" role="button" data-cursor="Read" aria-label="Read: ${j.title}"><div class="im"><img src="${j.img}" alt="" loading="lazy" referrerpolicy="no-referrer"></div><div class="m"><span>${j.cat}</span><span class="muted">${j.read} read</span></div><h3>${j.title}</h3></article>`).join('');
    initReveals($('#jgrid')); ScrollTrigger.refresh();
  };
  $('#jchips').addEventListener('click', (e) => { const b = e.target.closest('.chip'); if (!b) return; cat = b.dataset.c; $$('#jchips .chip').forEach((x) => x.classList.toggle('on', x === b)); render(); });
  const open = (id) => { const j = JOURNAL.find((x) => x.id === id); if (!j) return; openModal(`<div><img src="${j.img.replace('w=900', 'w=1400')}" alt="" style="width:100%;aspect-ratio:16/8;object-fit:cover" referrerpolicy="no-referrer"><div style="padding:34px clamp(24px,5vw,56px) 50px"><span class="eyebrow">${j.cat} · ${j.read} read</span><h2 style="font-size:clamp(1.8rem,4vw,2.8rem);margin:14px 0 20px">${j.title}</h2>${j.body.map((p) => `<p class="muted" style="margin-bottom:16px">${p}</p>`).join('')}<a class="btn sm" href="shop.html" style="margin-top:12px">Shop the collection</a></div></div>`); };
  $('#jgrid').addEventListener('click', (e) => { const a = e.target.closest('.jc'); a && open(a.dataset.id); });
  $('#jgrid').addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { const a = e.target.closest('.jc'); if (a) { e.preventDefault(); open(a.dataset.id); } } });
  render();
});
