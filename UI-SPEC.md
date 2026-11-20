# Phir Se Studio: UI design contract (demo site)

Stack: plain HTML, CSS and JS. Libraries: GSAP + ScrollTrigger, Lenis, Motion (Framer Motion's vanilla API), Three.js. No backend; cart, wishlist and orders live in localStorage.

## Design tokens
- Colours: cream `#F6EFE3`, ink `#231B17`, terracotta `#B5523B`, indigo `#2F4B7C`, mustard `#D9A441`, sage `#7A9A7E`, rose `#D88C7A`. Muted text `#5A4E46` on cream passes 4.5:1.
- Type: Fraunces (display), Instrument Sans (body, 17px, 1.6 line height), Noto Nastaliq Urdu (brand word), Caveat (hand notes, sparing).
- Radius 22px; spacing from `--pad` (20 to 72px); easing `cubic-bezier(.22,1,.36,1)`.
- Motion: 300 to 900ms, ease-out; exits faster than entries.

## Rules taken from the UI/UX checks
1. Pin at most one section (home process story). Other pages use plain scroll and native horizontal scroll.
2. Every input has a visible label; errors appear next to the field; submit shows loading, then success.
3. Filter chips wrap, never clip.
4. Visible focus ring on all controls; touch targets at least 44px; `cursor:pointer` on clickable items.
5. `prefers-reduced-motion`: no animation, content in its final state.
6. SVG icons only; no emoji as icons.
7. Check widths 375, 768, 1024, 1440.

## Pages
index, shop, product (`?id=`), memory (designer), impact, story, partners, journal, contact, cart (checkout demo).
