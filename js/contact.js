initPage(() => {
  $('#info').innerHTML = [['pin', 'Studio', 'Workshop and showroom corner, Faisalabad, Punjab (demo address)'], ['clock', 'Hours', 'Monday to Saturday, 10:00 to 18:00'], ['phone', 'WhatsApp', '+92 300 0000000 (demo number)'], ['mail', 'Email', 'hello@phirse.example (demo)']].map(([i, t, d]) => `<li>${icon(i, 22)}<div><b>${t}</b><div class="muted">${d}</div></div></li>`).join('');

  /* illustrative map: Faisalabad's famous clock tower with eight bazaars */
  let m = '<rect width="520" height="360" fill="#EFE5D3"/><g stroke="#231B17" stroke-opacity=".18" stroke-width="10" stroke-linecap="round">';
  for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4; m += `<line x1="260" y1="180" x2="${260 + Math.cos(a) * 280}" y2="${180 + Math.sin(a) * 280}"/>`; }
  m += '</g><g fill="#7A9A7E" opacity=".35"><circle cx="90" cy="70" r="36"/><circle cx="440" cy="290" r="44"/><circle cx="430" cy="60" r="26"/></g>';
  m += '<circle cx="260" cy="180" r="46" fill="#F6EFE3" stroke="#231B17" stroke-width="2" stroke-dasharray="7 6"/><rect x="252" y="158" width="16" height="44" fill="#B5523B"/><path d="M250 158 L260 144 L270 158Z" fill="#231B17"/><circle cx="260" cy="170" r="4" fill="#F6EFE3"/>';
  m += '<g transform="translate(340 96)"><path d="M0 40 C -22 18 -26 -6 0 -20 C 26 -6 22 18 0 40Z" fill="#B5523B"/><circle cx="0" cy="-2" r="8" fill="#F6EFE3"/></g><text x="340" y="150" text-anchor="middle" font-family="Fraunces,serif" font-size="16" fill="#231B17" font-weight="600">Phir Se Studio</text><text x="260" y="250" text-anchor="middle" font-size="12" fill="#5A4E46">Clock tower and eight bazaars (illustrative, not to scale)</text>';
  $('#map').innerHTML = `<svg viewBox="0 0 520 360" role="img" aria-label="Illustrative map of the studio location in Faisalabad" style="width:100%;height:auto;display:block">${m}</svg>`;

  $('#events').innerHTML = EVENTS.map((e, i) => `<div class="ev rv"><div class="dt"><b>${e.d}</b><span>${e.m}</span></div><div><b>${e.name}</b><div class="muted" style="font-size:.9rem">${e.city} · ${e.where}</div></div><button class="btn ghost sm" data-r="${i}">Remind me</button></div>`).join('');
  $('#events').addEventListener('click', (e) => { const b = e.target.closest('[data-r]'); if (!b) return; b.textContent = 'Reminder set'; b.disabled = true; Toast('We will remind you before the event (demo)', 'clock'); });
  $('#faq').innerHTML = FAQ.map(([q, a]) => `<div class="acc-i"><button class="acc-q" aria-expanded="false">${q}${icon('plus', 18)}</button><div class="acc-a"><div>${a}</div></div></div>`).join('');

  const f = $('#cf'); const bad = (n, on) => f.elements[n].closest('.field').classList.toggle('err', on);
  f.addEventListener('input', (e) => e.target.closest('.field') && e.target.closest('.field').classList.remove('err'));
  f.addEventListener('submit', (e) => {
    e.preventDefault(); const v = f.elements;
    const r = { nm: v.nm.value.trim().length > 1, em: /^\S+@\S+\.\S+$/.test(v.em.value), tp: !!v.tp.value, ms: v.ms.value.trim().length > 9 }; Object.entries(r).forEach(([k, ok]) => bad(k, !ok));
    if (!Object.values(r).every(Boolean)) { Toast('Please fix the highlighted fields', 'close'); return; }
    const b = $('#cb'); b.disabled = true; b.textContent = 'Sending…';
    setTimeout(() => { b.disabled = false; b.textContent = 'Send message'; f.reset(); Toast('Message saved in this browser. No email was sent. (Demo)', 'check'); }, 900);
  });
  initReveals(); initAccordions();
});
