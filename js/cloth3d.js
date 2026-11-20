/* Phir Se Studio — Three.js waving patchwork cloth (used on home hero + Memory Throw designer) */
const PhirCloth = (() => {
  const VERT = `uniform float uTime;uniform vec2 uMouse;uniform float uAmp;varying vec2 vUv;varying vec3 vPos;
  void main(){vUv=uv;vec3 p=position;
    float w1=sin(p.x*1.15+uTime*1.1)*.18;float w2=sin(p.y*1.55-uTime*.9+p.x*.6)*.12;float w3=sin((p.x+p.y)*2.4+uTime*1.7)*.04;
    float d=distance(p.xy,uMouse*vec2(3.2,2.2));float bump=exp(-d*d*.9)*.38;
    p.z+=(w1+w2+w3)*uAmp+bump*uAmp;vPos=p;gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);}`;
  const FRAG = `uniform sampler2D uTex;uniform float uTime;varying vec2 vUv;varying vec3 vPos;
  void main(){
    vec3 n=normalize(cross(dFdx(vPos),dFdy(vPos)));if(!gl_FrontFacing)n=-n;
    vec3 L=normalize(vec3(-.4,.6,.8));float diff=max(dot(n,L),0.);
    vec2 uv=vUv+vec2(sin(vUv.y*220.)*.0007,cos(vUv.x*220.)*.0007);
    vec4 c=texture2D(uTex,uv);
    float shade=.62+.55*diff+.12*n.z;
    vec3 col=c.rgb*shade;
    float spec=pow(max(dot(reflect(-L,n),vec3(0.,0.,1.)),0.),18.)*.12;col+=spec;
    float edge=smoothstep(0.,.025,vUv.x)*smoothstep(0.,.025,1.-vUv.x)*smoothstep(0.,.025,vUv.y)*smoothstep(0.,.025,1.-vUv.y);
    gl_FragColor=vec4(col,edge);}`;

  /* draw a patchwork onto a canvas. cells: optional [{c:'#hex',k:pattern}] row-major */
  function drawPatchwork(cv, o = {}) {
    const cols = o.cols || 4, rows = o.rows || 4, W = cv.width, H = cv.height, cw = W / cols, ch = H / rows;
    const ctx = cv.getContext('2d'); const r = rng(o.seed || 7);
    const pal = o.palette || ['#B5523B', '#2F4B7C', '#D9A441', '#7A9A7E', '#D88C7A', '#F4ECDD'];
    ctx.fillStyle = '#F4ECDD'; ctx.fillRect(0, 0, W, H);
    for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
      const cell = o.cells ? o.cells[y * cols + x] : null;
      const base = cell ? cell.c : pal[Math.floor(r() * pal.length)];
      const k = cell ? cell.k : Math.floor(r() * 6);
      const px = x * cw, py = y * ch;
      ctx.fillStyle = base; ctx.fillRect(px, py, cw, ch);
      ctx.save(); ctx.beginPath(); ctx.rect(px, py, cw, ch); ctx.clip(); ctx.globalAlpha = .45; ctx.fillStyle = '#F4ECDD'; ctx.strokeStyle = '#F4ECDD';
      if (k === 1) { ctx.lineWidth = ch / 26; for (let i = 1; i < 7; i++) { ctx.beginPath(); ctx.moveTo(px, py + i * ch / 7); ctx.lineTo(px + cw, py + i * ch / 7); ctx.stroke(); } }
      if (k === 2) for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) { ctx.beginPath(); ctx.arc(px + (i + .5) * cw / 5, py + (j + .5) * ch / 5, cw / 28, 0, 7); ctx.fill(); }
      if (k === 3) for (let i = 0; i < 5; i++) for (let j = 0; j < 5; j++) if ((i + j) % 2 === 0) ctx.fillRect(px + i * cw / 5, py + j * ch / 5, cw / 5, ch / 5);
      if (k === 4) { ctx.beginPath(); ctx.moveTo(px + cw / 2, py + ch * .12); ctx.lineTo(px + cw * .88, py + ch / 2); ctx.lineTo(px + cw / 2, py + ch * .88); ctx.lineTo(px + cw * .12, py + ch / 2); ctx.fill(); }
      if (k === 5) for (let a = 0; a < 6; a++) { const an = a * Math.PI / 3; ctx.beginPath(); ctx.arc(px + cw / 2 + Math.cos(an) * cw * .17, py + ch / 2 + Math.sin(an) * ch * .17, cw * .1, 0, 7); ctx.fill(); }
      ctx.restore();
      // woven grain
      ctx.globalAlpha = .08; ctx.strokeStyle = '#000'; ctx.lineWidth = 1;
      for (let i = 0; i < cw; i += 5) { ctx.beginPath(); ctx.moveTo(px + i, py); ctx.lineTo(px + i, py + ch); ctx.stroke(); }
      for (let j = 0; j < ch; j += 5) { ctx.beginPath(); ctx.moveTo(px, py + j); ctx.lineTo(px + cw, py + j); ctx.stroke(); }
      // running stitch
      ctx.globalAlpha = .9; ctx.strokeStyle = '#F4ECDD'; ctx.lineWidth = Math.max(2, cw / 60); ctx.setLineDash([cw / 14, cw / 18]);
      ctx.strokeRect(px + cw * .08, py + ch * .08, cw * .84, ch * .84); ctx.setLineDash([]);
      // seam shadow
      ctx.globalAlpha = .35; ctx.strokeStyle = '#231B17'; ctx.lineWidth = 2; ctx.strokeRect(px, py, cw, ch); ctx.globalAlpha = 1;
    }
    return cv;
  }

  function mount(container, opt = {}) {
    if (!window.THREE) return null;
    const THREE = window.THREE;
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
    container.appendChild(renderer.domElement); renderer.domElement.style.cssText = 'width:100%;height:100%;display:block';
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(opt.fov || 38, 1, .1, 50); camera.position.set(0, 0, opt.camZ || 7.2);
    const mk = (cv) => { const t = new THREE.CanvasTexture(cv); t.anisotropy = 8; t.colorSpace = THREE.SRGBColorSpace; t.needsUpdate = true; return t; };
    const uniforms = (cv) => ({ uTime: { value: 0 }, uMouse: { value: new THREE.Vector2(9, 9) }, uAmp: { value: opt.amp || 1 }, uTex: { value: mk(cv) } });
    const mat = (cv) => new THREE.ShaderMaterial({ uniforms: uniforms(cv), vertexShader: VERT, fragmentShader: FRAG, side: THREE.DoubleSide, transparent: true });
    const group = new THREE.Group(); scene.add(group);
    const main = new THREE.Mesh(new THREE.PlaneGeometry(opt.w || 4.6, opt.h || 3.2, 90, 64), mat(opt.canvas)); group.add(main);
    const floaters = [];
    for (let i = 0; i < (opt.floaters || 0); i++) {
      const c = document.createElement('canvas'); c.width = c.height = 256; drawPatchwork(c, { cols: 2, rows: 2, seed: 30 + i * 11 });
      const m = new THREE.Mesh(new THREE.PlaneGeometry(.9 + Math.random() * .5, .9 + Math.random() * .5, 16, 16), mat(c));
      m.position.set((Math.random() - .5) * 9, (Math.random() - .5) * 5, -1.5 - Math.random() * 3); m.userData = { s: .3 + Math.random() * .6, p: Math.random() * 6 };
      m.rotation.set(Math.random(), Math.random(), Math.random()); scene.add(m); floaters.push(m);
    }
    const state = { mx: 0, my: 0, tx: 0, ty: 0, run: true, drag: false, rx: opt.rx ?? -.35, ry: opt.ry ?? .28, scroll: 0 };
    const size = () => { const w = container.clientWidth, h = container.clientHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); if (opt.fit) { const s = Math.min(1, (w / h) / ((opt.w || 4.6) / (opt.h || 3.2)) * 1.05); group.scale.setScalar(Math.max(.55, s)); } };
    size(); new ResizeObserver(size).observe(container);
    const onMove = (e) => { const r = container.getBoundingClientRect(); const nx = ((e.clientX - r.left) / r.width) * 2 - 1, ny = -(((e.clientY - r.top) / r.height) * 2 - 1); state.tx = nx; state.ty = ny; main.material.uniforms.uMouse.value.set(nx, ny); };
    (opt.listenWindow ? window : container).addEventListener('pointermove', onMove);
    if (opt.drag) {
      container.style.cursor = 'grab'; let sx = 0, sy = 0;
      container.addEventListener('pointerdown', (e) => { state.drag = true; sx = e.clientX; sy = e.clientY; container.style.cursor = 'grabbing'; });
      addEventListener('pointerup', () => { state.drag = false; container.style.cursor = 'grab'; });
      addEventListener('pointermove', (e) => { if (!state.drag) return; state.ry += (e.clientX - sx) * .005; state.rx += (e.clientY - sy) * .005; state.rx = Math.max(-1.2, Math.min(.6, state.rx)); state.ry = Math.max(-1.1, Math.min(1.1, state.ry)); sx = e.clientX; sy = e.clientY; });
    }
    new IntersectionObserver((en) => { state.run = en[0].isIntersecting; }, { threshold: 0 }).observe(container);
    const clock = new THREE.Clock();
    const reduceM = matchMedia('(prefers-reduced-motion: reduce)').matches;
    (function loop() {
      requestAnimationFrame(loop); if (!state.run) return;
      const t = reduceM ? 0 : clock.getElapsedTime();
      main.material.uniforms.uTime.value = t; floaters.forEach((f) => { f.material.uniforms.uTime.value = t; f.rotation.x += .002 * f.userData.s; f.rotation.y += .003 * f.userData.s; f.position.y += Math.sin(t * f.userData.s + f.userData.p) * .002; });
      group.rotation.x += ((state.rx + state.ty * -.08 + state.scroll * .6) - group.rotation.x) * .06;
      group.rotation.y += ((state.ry + state.tx * .14) - group.rotation.y) * .06;
      group.position.y += ((opt.y || 0) + state.scroll * 1.2 - group.position.y) * .08;
      renderer.render(scene, camera);
    })();
    return { renderer, scene, state, group, main,
      setCanvas(cv) { main.material.uniforms.uTex.value.dispose(); main.material.uniforms.uTex.value = mk(cv); },
      refresh() { main.material.uniforms.uTex.value.needsUpdate = true; } };
  }
  return { mount, drawPatchwork };
})();
