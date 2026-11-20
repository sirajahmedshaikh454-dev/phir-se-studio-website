initPage(() => {
  $$('.arr').forEach((e) => { e.innerHTML = icon('arrow', 18); });
  const id = new URLSearchParams(location.search).get('id');
  const p = PRODUCTS.find((x) => x.id === id) || PRODUCTS[0];
  document.title = `${p.name} | Phir Se Studio`;
  const names = { terracotta: 'Terracotta', indigo: 'Indigo', mustard: 'Mustard', sage: 'Sage', rose: 'Rose' };
  let pal = p.palette, qty = 1, img = 0;
  const catName = { bags: 'Bags', cushions: 'Cushions', throws: 'Throws', table: 'Table', experiences: 'Experiences' }[p.cat];
  const dates = EVENTS.map((e) => `${e.d} ${e.m} · ${e.city}`);

  $('#pp-root').innerHTML = `<div class="pp">
    <div class="gal"><div class="thumbs">${p.imgs.map((s, i) => `<button class="${i ? '' : 'on'}" data-i="${i}" aria-label="Photo ${i + 1}"><img src="${s}" alt="" referrerpolicy="no-referrer"></button>`).join('')}</div>
      <div class="main" id="main"><img id="mimg" src="${p.imgs[0]}" alt="${p.name}" referrerpolicy="no-referrer"></div></div>
    <div class="pinfo">
      <div class="crumbs"><a href="index.html">Home</a> / <a href="shop.html?cat=${p.cat}">${catName}</a> / ${p.name}</div>
      <h1 data-split>${p.name}</h1>
      <div class="pr">${money(p.price)}</div>
      <p class="muted">${p.blurb}</p>
      <div class="opt"><h4>${p.experience ? 'Choose a session' : 'Colourway: <span id="cwn">' + names[pal] + '</span>'}</h4>
        ${p.experience ? `<label class="field" style="max-width:320px"><span class="sr" style="position:absolute;left:-9999px">Session</span><select id="sess">${dates.map((d) => `<option>${d}</option>`).join('')}</select></label>` :
        `<div class="swr" id="swr">${Object.keys(names).map((k) => `<button class="swb ${k === pal ? 'on' : ''}" data-p="${k}" aria-label="${names[k]}" title="${names[k]}">${patchSVG(k, p.id + k, { cols: 2, rows: 2 })}</button>`).join('')}</div>
        <p class="muted" style="font-size:.85rem;margin-top:8px">Fabric mix varies slightly with each offcut batch, so yours will be one of a kind.</p>`}</div>
      <div class="buy"><div class="qty" role="group" aria-label="Quantity"><button id="qm" aria-label="Less">${icon('minus', 16)}</button><span id="qv">1</span><button id="qp" aria-label="More">${icon('plus', 16)}</button></div>
        <button class="btn" id="add" data-mag>${icon('cart', 18)} ${p.experience ? 'Book a seat' : 'Add to cart'}</button>
        <button class="ibtn wish ${Wish.has(p.id) ? 'on' : ''}" data-wish="${p.id}" style="border:1.5px solid var(--line)" aria-label="Save to wishlist">${icon('heart', 20)}</button></div>
      <p class="muted" style="margin-top:14px;font-size:.88rem;display:flex;gap:8px;align-items:center">${icon('truck', 16)} Free delivery over PKR 5,000 · ${p.stock} in stock (demo)</p>
      ${p.kg ? `<div class="tagcard"><div id="qr">${qrSVG(p.id, 110)}</div><div><b style="font-family:var(--display);font-size:1.2rem">Origin tag preview</b>
        <p class="muted" style="font-size:.88rem">Scan to see what this piece saved and who stitched it.</p>
        <div class="meter"><i id="meter"></i></div><div style="display:flex;justify-content:space-between;font-size:.85rem"><span><b>${p.kg} kg</b> fabric saved</span><span>Made by <b>${p.maker}</b></span></div></div></div>` : ''}
      <div class="acc"><div class="acc-i open"><button class="acc-q" aria-expanded="true">Details ${icon('plus', 18)}</button><div class="acc-a" style="height:auto"><div><ul>${p.details.map((d) => `<li>${d}</li>`).join('')}</ul></div></div></div>
        <div class="acc-i"><button class="acc-q" aria-expanded="false">Care ${icon('plus', 18)}</button><div class="acc-a"><div>Wash cold on a gentle cycle. Dry in the shade. Loose stitch? Bring it to a studio visit and we will fix it for free.</div></div></div>
        <div class="acc-i"><button class="acc-q" aria-expanded="false">Delivery and returns ${icon('plus', 18)}</button><div class="acc-a"><div>Ready items ship in 2 to 3 working days; made-to-order throws take 7 to 14 days. Unused ready items can be returned within 7 days. (Demo policy.)</div></div></div></div>
    </div></div>`;
  initReveals($('#pp-root')); initAccordions($('#pp-root'));
  const meter = $('#meter'); if (meter) gsap.to(meter, { width: Math.min(100, p.kg * 36) + '%', duration: 1.4, delay: .5, ease: 'power3.out' });

  /* gallery */
  const mimg = $('#mimg');
  $('.thumbs').addEventListener('click', (e) => {
    const b = e.target.closest('button'); if (!b) return; img = +b.dataset.i;
    $$('.thumbs button').forEach((x) => x.classList.toggle('on', x === b));
    if (hasM) M.animate(mimg, { opacity: [0, 1] }, { duration: .5 }); mimg.src = p.imgs[img];
  });
  const main = $('#main');
  main.addEventListener('mousemove', (e) => { const r = main.getBoundingClientRect(); mimg.style.transformOrigin = `${(e.clientX - r.left) / r.width * 100}% ${(e.clientY - r.top) / r.height * 100}%`; mimg.style.transform = 'scale(1.9)'; });
  main.addEventListener('mouseleave', () => { mimg.style.transform = 'scale(1)'; });

  /* options */
  const sw = $('#swr'); if (sw) sw.addEventListener('click', (e) => { const b = e.target.closest('.swb'); if (!b) return; pal = b.dataset.p; $$('.swb', sw).forEach((x) => x.classList.toggle('on', x === b)); $('#cwn').textContent = names[pal]; });
  $('#qm').onclick = () => { qty = Math.max(1, qty - 1); $('#qv').textContent = qty; };
  $('#qp').onclick = () => { qty = Math.min(p.stock, qty + 1); $('#qv').textContent = qty; };
  $('#add').onclick = () => addToCart(p.id, { qty, opts: p.experience ? { Session: $('#sess').value } : { Colourway: names[pal] } });

  /* related */
  const rel = PRODUCTS.filter((x) => x.id !== p.id && (x.cat === p.cat || x.palette === p.palette)).concat(PRODUCTS).filter((x, i, a) => x.id !== p.id && a.findIndex((y) => y.id === x.id) === i).slice(0, 4);
  $('#related').innerHTML = rel.map(productCard).join(''); initReveals($('#related'));
});
