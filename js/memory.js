initPage(() => {
  $('#drop-ic').innerHTML = icon('upload', 34); $('#shuf-ic').innerHTML = icon('shuffle', 16);
  const SAMPLES = { 'Wedding red': ['#9E2A2B', '#D9A441', '#F4ECDD', '#6B1F24', '#C97B63'], "Grandfather's shawl": ['#5C6B73', '#2F4B7C', '#C9BBA2', '#3B3A36', '#8FA3AD'], 'School blue': ['#2F4B7C', '#F4ECDD', '#7EA0C9', '#1C2E4F', '#D9A441'], 'Summer cotton': ['#7A9A7E', '#F2D49B', '#D88C7A', '#F4ECDD', '#B9CBB3'] };
  const SIZES = [['S', '100 × 150 cm', 9500], ['M', '150 × 200 cm', 12500], ['L', '180 × 220 cm', 15500]];
  const st = { pal: SAMPLES['Wedding red'], n: 4, size: 1, cells: [], label: 'Wedding red' };
  const cv = document.createElement('canvas'); cv.width = cv.height = 1024;
  const rand = (a) => a[Math.floor(Math.random() * a.length)];
  const shuffle = () => { st.cells = Array.from({ length: st.n * st.n }, () => ({ c: rand(st.pal), k: Math.floor(Math.random() * 6) })); };
  const draw = () => { PhirCloth.drawPatchwork(cv, { cols: st.n, rows: st.n, cells: st.cells }); cloth && cloth.refresh(); flat(); };
  const flat = () => {
    const f = $('#flat'); f.style.gridTemplateColumns = `repeat(${st.n},1fr)`;
    f.innerHTML = st.cells.map((c, i) => `<button data-i="${i}" aria-label="Patch ${i + 1}, change colour" style="aspect-ratio:1;border-radius:8px;background:${c.c};border:2px dashed rgba(246,239,227,.7);box-shadow:inset 0 0 0 1px rgba(0,0,0,.15)"></button>`).join('');
  };
  const palette = () => { $('#pal').innerHTML = st.pal.map((c) => `<i style="background:${c}" title="${c}"></i>`).join(''); };
  const price = () => { const p = SIZES[st.size][2]; $('#mp').textContent = money(p); $('#madd').innerHTML = `${icon('cart', 18)} Add Memory Throw · ${money(p)}`; return p; };

  $('#samples').innerHTML = Object.keys(SAMPLES).map((k, i) => `<button class="chip ${i ? '' : 'on'}" data-s="${k}">${k}</button>`).join('');
  $('#sizes').innerHTML = SIZES.map(([k, d, p], i) => `<button class="${i === st.size ? 'on' : ''}" data-z="${i}"><b>${k}</b><span class="muted" style="font-size:.78rem">${d}</span><br><span style="font-weight:600">${money(p)}</span></button>`).join('');

  /* 3D */
  shuffle(); PhirCloth.drawPatchwork(cv, { cols: st.n, rows: st.n, cells: st.cells });
  const cloth = PhirCloth.mount($('#mem-gl'), { canvas: cv, w: 3.6, h: 3.6, camZ: 6.6, amp: .65, drag: true, rx: -.45, ry: .25, fov: 40 });
  palette(); flat(); price();

  /* palette from image: bucket the pixels, pick distinct dominant colours */
  function fromImage(img) {
    const c = document.createElement('canvas'); c.width = c.height = 64; const x = c.getContext('2d'); x.drawImage(img, 0, 0, 64, 64);
    const d = x.getImageData(0, 0, 64, 64).data, b = {};
    for (let i = 0; i < d.length; i += 4) { if (d[i + 3] < 200) continue; const k = (d[i] >> 4) + ',' + (d[i + 1] >> 4) + ',' + (d[i + 2] >> 4); (b[k] = b[k] || [0, 0, 0, 0]); b[k][0] += d[i]; b[k][1] += d[i + 1]; b[k][2] += d[i + 2]; b[k][3]++; }
    const cols = Object.values(b).sort((a, z) => z[3] - a[3]).map((v) => [v[0] / v[3], v[1] / v[3], v[2] / v[3]]);
    const out = []; cols.forEach((c1) => { if (out.length < 5 && out.every((o) => Math.hypot(o[0] - c1[0], o[1] - c1[1], o[2] - c1[2]) > 55)) out.push(c1); });
    while (out.length < 3 && cols.length) out.push(cols[out.length]);
    return out.map((v) => '#' + v.map((n) => Math.round(n).toString(16).padStart(2, '0')).join(''));
  }
  const useFile = (f) => {
    if (!f || !f.type.startsWith('image/')) { Toast('Please choose an image file', 'close'); return; }
    const img = new Image(); img.onload = () => { st.pal = fromImage(img); st.label = 'Your garment'; $$('#samples .chip').forEach((x) => x.classList.remove('on')); shuffle(); palette(); draw(); URL.revokeObjectURL(img.src); Toast('Colours pulled from your photo', 'check'); };
    img.onerror = () => Toast('That image could not be read', 'close'); img.src = URL.createObjectURL(f);
  };
  const drop = $('#drop'); $('#file').addEventListener('change', (e) => useFile(e.target.files[0]));
  ['dragover', 'dragenter'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.add('over'); }));
  ['dragleave', 'drop'].forEach((ev) => drop.addEventListener(ev, (e) => { e.preventDefault(); drop.classList.remove('over'); }));
  drop.addEventListener('drop', (e) => useFile(e.dataTransfer.files[0]));
  drop.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); $('#file').click(); } });

  $('#samples').addEventListener('click', (e) => { const b = e.target.closest('[data-s]'); if (!b) return; st.pal = SAMPLES[b.dataset.s]; st.label = b.dataset.s; $$('#samples .chip').forEach((x) => x.classList.toggle('on', x === b)); shuffle(); palette(); draw(); });
  document.addEventListener('click', (e) => {
    const n = e.target.closest('[data-n]'); if (n) { st.n = +n.dataset.n; $$('[data-n]').forEach((x) => x.classList.toggle('on', x === n)); shuffle(); draw(); }
    const p = e.target.closest('#flat [data-i]'); if (p) { const c = st.cells[+p.dataset.i]; const i = st.pal.indexOf(c.c); c.c = st.pal[(i + 1) % st.pal.length]; draw(); }
    const z = e.target.closest('[data-z]'); if (z) { st.size = +z.dataset.z; $$('#sizes button').forEach((x) => x.classList.toggle('on', x === z)); price(); }
  });
  $('#shuf').onclick = () => { shuffle(); draw(); };
  $('#madd').onclick = () => {
    const gn = Math.max(1, Math.min(12, +$('#gn').value || 1)); const note = $('#note').value.trim();
    const t = document.createElement('canvas'); t.width = t.height = 160; t.getContext('2d').drawImage(cv, 0, 0, 160, 160);
    Cart.add({ id: 'memory-throw', name: 'Memory Throw', price: SIZES[st.size][2], kg: 2, img: PRODUCTS.find((x) => x.id === 'morning-throw').imgs[0], thumb: t.toDataURL('image/jpeg', .8), opts: { Size: SIZES[st.size][0] + ' (' + SIZES[st.size][1] + ')', Grid: st.n + ' × ' + st.n, Garments: gn, ...(note ? { Note: note.slice(0, 60) } : {}) } });
  };
});
