initPage(() => {
  $$('.arr').forEach((e) => { e.innerHTML = icon('arrow', 18); });

  /* marquee */
  const words = ['Fabric, once more', 'Handmade in Faisalabad', 'Every piece one of one', 'Scrap to sofa', 'Fair wages, always', 'Inspired by ralli'];
  $('#marq').innerHTML = words.map((w) => `<span>${w}${logoMark(34)}</span>`).join('');
  initMarquee();

  /* featured products */
  const feat = ['rangeen-tote', 'sunrise-cushion', 'heirloom-throw', 'dastarkhwan-set'];
  $('#featured').innerHTML = feat.map((id) => productCard(PRODUCTS.find((p) => p.id === id))).join('');
  initReveals($('#featured'));

  /* hero: needle + 3D cloth */
  const nh = $('#needle-host'); nh.innerHTML = needleThread();
  const tp = $('.thread-path', nh); const len = tp.getTotalLength(); tp.style.setProperty('--len', len); tp.style.strokeDasharray = len; tp.style.strokeDashoffset = len;
  gsap.to(tp, { strokeDashoffset: 0, duration: 3.2, ease: 'power2.inOut', delay: .6 });
  gsap.from('.needle-art g', { y: -60, opacity: 0, duration: 1.4, delay: .4, ease: 'power3.out' });
  gsap.from(['.hero .eyebrow', '.hero .sub', '.hero .acts', '.hero .urdu-tag'], { y: 30, opacity: 0, duration: 1, stagger: .12, delay: .5, ease: 'power3.out' });

  const cv = document.createElement('canvas'); cv.width = 1280; cv.height = 880;
  PhirCloth.drawPatchwork(cv, { cols: 4, rows: 3, seed: 11 });
  const wide = innerWidth > 1100;
  const cloth = PhirCloth.mount($('#hero-gl'), { canvas: cv, floaters: 7, w: 4.8, h: 3.3, listenWindow: true, rx: -.28, ry: .32, camZ: 7.4, y: wide ? 0 : (innerWidth < 600 ? 2.15 : 1.35) });
  if (cloth) {
    cloth.group.position.x = wide ? 1.35 : .2; cloth.group.scale.setScalar(wide ? .92 : (innerWidth < 600 ? .36 : .7));
    ScrollTrigger.create({ trigger: '#hero', start: 'top top', end: 'bottom top', scrub: true, onUpdate: (s) => { cloth.state.scroll = s.progress; } });
  }
  gsap.to('.hero-in', { y: -90, opacity: 0, ease: 'none', scrollTrigger: { trigger: '#hero', start: 'top top', end: '70% top', scrub: true } });

  /* pinned process */
  const steps = $$('.proc-step'), art = $('#proc-art'), dotsEl = $('#proc-dots');
  art.innerHTML = ILLO.map((s) => `<div class="illo">${s}</div>`).join('');
  dotsEl.innerHTML = steps.map((_, i) => `<i class="${i ? '' : 'on'}"></i>`).join('');
  const illos = $$('.illo', art), dots = $$('i', dotsEl);
  gsap.set(steps, { yPercent: -50, y: 0 }); gsap.set(steps.slice(1), { opacity: 0, y: 70 }); gsap.set(illos.slice(1), { opacity: 0, scale: .9, rotate: 3 });
  const tl = gsap.timeline({ defaults: { ease: 'power2.inOut' }, scrollTrigger: { trigger: '#proc', start: 'top top', end: '+=420%', pin: true, scrub: .6, onUpdate: (s) => { const k = Math.min(4, Math.round(s.progress * 4)); dots.forEach((d, i) => d.classList.toggle('on', i === k)); } } });
  steps.forEach((_, i) => { if (!i) return; tl.to(steps[i - 1], { opacity: 0, y: -70, duration: .5 }, i - .5).to(illos[i - 1], { opacity: 0, scale: .9, rotate: -3, duration: .5 }, i - .5).to(steps[i], { opacity: 1, y: 0, duration: .5 }, i - .2).to(illos[i], { opacity: 1, scale: 1, rotate: 0, duration: .5 }, i - .2); });
  tl.to({}, { duration: .6 });

  /* testimonials */
  const quotes = [
    ['The cushions arrived with a little QR tag and my guests would not stop scanning it.', 'Demo review · Lahore', 'terracotta'],
    ['I ordered a Memory Throw from my late father\'s kurtas. I cannot describe how it feels.', 'Demo review · Islamabad', 'indigo'],
    ['We put six cushions in our café. Two sold within a week to customers.', 'Demo review · Karachi', 'mustard'],
    ['Heavier and better made than anything I have bought online for the same price.', 'Demo review · Faisalabad', 'sage'],
    ['Perfect Eid gift. The tote is already my everyday bag.', 'Demo review · Rawalpindi', 'rose'],
  ];
  const card = (q, i) => `<div class="tc"><div class="stars">${icon('star', 18, 1.2).repeat(5)}</div><q>${q[0]}</q><div class="who"><span class="av">${patchSVG(q[2], i + 3, { cols: 2, rows: 2 })}</span><span>${q[1]}</span></div></div>`;
  const tt = $('#ttrack'); tt.innerHTML = quotes.map(card).join('') + quotes.map(card).join('');
  const tw = tt.scrollWidth / 2;
  const tween = gsap.to(tt, { x: -tw, duration: 50, ease: 'none', repeat: -1 });
  tt.addEventListener('mouseenter', () => tween.timeScale(.15)); tt.addEventListener('mouseleave', () => tween.timeScale(1));

  /* CTA patch */
  $('#cta-patch').innerHTML = patchSVG('mustard', 42, { cols: 3, rows: 3 });
  gsap.to('#cta-patch', { rotate: 22, y: 40, ease: 'none', scrollTrigger: { trigger: '.cta', scrub: true } });
});
