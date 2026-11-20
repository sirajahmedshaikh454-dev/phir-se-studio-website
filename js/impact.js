initPage(() => {
  const T = [['bags', 'Tote bags', .4, .5, 370, 2], ['cushions', 'Cushion covers', .35, .4, 290, 3], ['throws', 'Throws', 2.5, 2, 1500, 1], ['table', 'Table sets', .6, .7, 450, 1]];
  const q = T.map((t) => t[5]); const shown = { kg: 0, eq1: 0, eq2: 0, eq3: 0, eq4: 0 };
  $('#steppers').innerHTML = T.map((t, i) => `<div class="card" style="display:flex;align-items:center;gap:16px;margin-bottom:14px;background:rgba(251,247,239,.85)"><span class="ico" style="margin:0">${icon(t[0], 26)}</span><div style="flex:1"><b style="font-family:var(--display);font-size:1.2rem;font-weight:500">${t[1]}</b><div class="muted" style="font-size:.82rem">${t[2]} kg each</div></div><div class="qty" style="margin:0"><button data-i="${i}" data-d="-1" aria-label="Fewer ${t[1]}">${icon('minus', 14)}</button><span id="n${i}">${t[5]}</span><button data-i="${i}" data-d="1" aria-label="More ${t[1]}">${icon('plus', 14)}</button></div></div>`).join('');
  const set = (id, v, fmt) => { const el = $('#' + id); const from = shown[id]; shown[id] = v; hasM ? M.animate(from, v, { duration: .8, ease: EASE, onUpdate: (x) => { el.textContent = fmt(x); } }) : (el.textContent = fmt(v)); };
  const calc = () => {
    const kg = T.reduce((a, t, i) => a + t[2] * q[i], 0), days = T.reduce((a, t, i) => a + t[3] * q[i], 0), pay = T.reduce((a, t, i) => a + t[4] * q[i], 0), n = q.reduce((a, b) => a + b, 0);
    set('kg', kg, (x) => x.toFixed(1)); set('eq1', kg / .2, (x) => Math.round(x)); set('eq2', days, (x) => x.toFixed(1)); set('eq3', pay, (x) => money(x)); set('eq4', n, (x) => Math.round(x));
  };
  $('#steppers').addEventListener('click', (e) => { const b = e.target.closest('[data-i]'); if (!b) return; const i = +b.dataset.i; q[i] = Math.max(0, Math.min(40, q[i] + +b.dataset.d)); $('#n' + i).textContent = q[i]; calc(); });
  calc();

  /* planned growth chart (targets from the business plan) */
  const yrs = [['Year 1', 2000, 1073], ['Year 2', 2900, 1556], ['Year 3', 3770, 2023]];
  let g = '<line x1="30" y1="280" x2="510" y2="280" stroke="#231B17" stroke-width="2"/>';
  yrs.forEach((y, i) => {
    const x = 60 + i * 150, h1 = y[1] / 3770 * 220, h2 = y[2] / 2023 * 220;
    g += `<g class="bars"><rect x="${x}" y="${280 - h1}" width="46" height="${h1}" rx="6" fill="#2F4B7C"/><rect x="${x + 54}" y="${280 - h2}" width="46" height="${h2}" rx="6" fill="#B5523B"/>
      <text x="${x + 23}" y="${272 - h1}" text-anchor="middle" font-size="13" fill="#231B17" font-weight="600">${y[1].toLocaleString()}</text><text x="${x + 77}" y="${272 - h2}" text-anchor="middle" font-size="13" fill="#231B17" font-weight="600">${y[2].toLocaleString()}</text></g>
      <text x="${x + 50}" y="304" text-anchor="middle" font-size="14" fill="#5A4E46">${y[0]}</text>`;
  });
  g += `<g font-size="13" fill="#231B17"><rect x="30" y="8" width="12" height="12" rx="3" fill="#2F4B7C"/><text x="48" y="19">Pieces sold (plan)</text><rect x="200" y="8" width="12" height="12" rx="3" fill="#B5523B"/><text x="218" y="19">Fabric rescued, kg (plan)</text></g>`;
  $('#chart').innerHTML = g;
  $$('#chart rect').forEach((r) => { if (r.getAttribute('height') > 14) gsap.from(r, { scaleY: 0, transformOrigin: '50% 100%', duration: 1.2, ease: 'power3.out', scrollTrigger: { trigger: '#chart', start: 'top 80%' } }); });

  $('#tl').innerHTML = [['Months 0 to 4', 'Set up the studio', 'Register the business, rent the workshop, buy machines, sign offcut suppliers, hire the first stitchers.'], ['Month 4', 'Soft launch', 'First pieces on Instagram, WhatsApp and one pop-up. Target: the first 50 orders.'], ['Month 12', 'Year 1 goals', 'About 2,000 pieces sold and about one tonne of fabric rescued.'], ['Month 24', 'Growth', 'Third stitcher, Daraz store, first annual corporate contract.'], ['Month 36', 'Loan repaid', 'Four stitchers, diaspora shipping pilot and a review of long-term options.']].map(([w, t, d]) => `<div class="tl-i rv"><span class="eyebrow">${w}</span><b>${t}</b><p class="muted" style="max-width:56ch">${d}</p></div>`).join('');
  $('#promises').innerHTML = [['scissors', 'Fair wages', 'Every full-time stitcher earns at least the Punjab minimum wage of PKR 40,000 a month.'], ['leaf', 'Honest numbers', 'The kilograms on every tag come from weighing the offcuts that went into the piece.'], ['recycle', 'Circular scraps', 'Even the tiniest trimmings become stuffing, piping or pouches.'], ['star', 'Made to last', 'Reinforced seams and a free repair for loose stitches.']].map(([i, t, d], n) => `<div class="card rv" data-d="${n * .08}"><div class="ico">${icon(i, 26)}</div><h3>${t}</h3><p class="muted" style="margin-top:8px">${d}</p></div>`).join('');
  initReveals();
});
