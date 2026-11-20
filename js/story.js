initPage(() => {
  $('#heritage').innerHTML = [[31935139, 'Hand embroidery', 'Fine needlework from Lahore teaches us patience and detail.'], [18652121, 'Handloom weaving', 'The loom reminds us that cloth is made one thread at a time.'], [28389703, 'Block printing', 'Carved blocks show how repeated patterns can still feel personal.'], [8266834, 'Ralli patchwork', 'The tradition that taught us nothing is too small to use.']]
    .map(([i, t, d]) => `<div class="hs-card" style="scroll-snap-align:start"><div class="frame"><img src="${PX(i, 900)}" alt="${t}" loading="lazy" referrerpolicy="no-referrer" style="top:0;height:100%"></div><div class="cap">${t}</div><p class="muted" style="font-size:.95rem">${d}</p></div>`).join('');
  $('#makers').innerHTML = MAKERS.map((m) => `<div class="maker rv"><img src="${m.img}" alt="${m.name}" loading="lazy" referrerpolicy="no-referrer"><div class="mt"><h3>${m.name}</h3><span style="font-size:.85rem;opacity:.85">${m.role} · ${m.years}</span><q>${m.quote}</q></div></div>`).join('');
  $('#values').innerHTML = [['recycle', 'Circularity', 'Nothing usable is thrown away.'], ['scissors', 'Craft', 'We build on ralli patchwork and keep stitching quality high.'], ['user', 'Fair work', 'Pay at or above the minimum wage, always.'], ['leaf', 'Transparency', 'Every product shows what it saved and who made it.']]
    .map(([i, t, d], n) => `<div class="card rv" data-d="${n * .08}"><div class="ico">${icon(i, 26)}</div><h3>${t}</h3><p class="muted" style="margin-top:8px">${d}</p></div>`).join('');
  initReveals();
});
