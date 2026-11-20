/* Phir Se Studio — demo data (no backend). Photos: Pexels (free licence). */
const PX = (id, w = 900) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=${w}`;

const PALETTES = {
  terracotta: ['#B5523B', '#D88C7A', '#F4ECDD', '#D9A441', '#2F4B7C'],
  indigo:     ['#2F4B7C', '#6C86B5', '#F4ECDD', '#B5523B', '#D9A441'],
  mustard:    ['#D9A441', '#B5523B', '#F4ECDD', '#7A9A7E', '#2F4B7C'],
  sage:       ['#7A9A7E', '#B9CBB3', '#F4ECDD', '#2F4B7C', '#D88C7A'],
  rose:       ['#D88C7A', '#B5523B', '#F4ECDD', '#7A9A7E', '#D9A441'],
};

const PRODUCTS = [
  { id: 'rangeen-tote', name: 'Rangeen Tote', cat: 'bags', price: 1900, kg: 0.4, palette: 'terracotta', tag: 'Bestseller',
    imgs: [PX(7405299), PX(634538)], maker: 'Zainab', stock: 14,
    blurb: 'A lined, reinforced everyday tote patched from mixed export-factory offcuts. No two are alike.',
    details: ['Size: 38 × 34 × 10 cm', 'Fully lined, inner zip pocket', 'Handles reinforced for up to 8 kg', 'Fabric: cotton and cotton-blend offcuts, pre-washed'] },
  { id: 'bazaar-weekender', name: 'Bazaar Weekender Tote', cat: 'bags', price: 2400, kg: 0.55, palette: 'indigo', tag: 'New',
    imgs: [PX(634538), PX(7405299)], maker: 'Rubina', stock: 9,
    blurb: 'A roomier tote with a flat base, made for market days, picnics and the Friday family trip.',
    details: ['Size: 45 × 36 × 14 cm', 'Flat base, magnetic closure', 'Wipe-clean lining', 'Fabric: denim and cotton offcuts'] },
  { id: 'scrap-pouch', name: 'Scrap-Stitch Pouch', cat: 'bags', price: 650, kg: 0.1, palette: 'mustard', tag: 'Gift idea',
    imgs: [PX(10566057), PX(18359544)], maker: 'Hina', stock: 40,
    blurb: 'A small zip pouch for cables, cosmetics or pens, patched from the smallest scraps we have.',
    details: ['Size: 20 × 12 cm', 'YKK-style metal zip', 'Made from scraps too small for anything else', 'Each pouch is unique'] },
  { id: 'sunrise-cushion', name: 'Sunrise Ralli Cushion', cat: 'cushions', price: 1500, kg: 0.35, palette: 'mustard', tag: 'Bestseller',
    imgs: [PX(7061404), PX(5998023), PX(4915583)], maker: 'Zainab', stock: 22,
    blurb: 'Warm mustard and terracotta patches with kantha-style running stitch. The cheerful corner of any sofa.',
    details: ['Cover size: 40 × 40 cm (16 × 16 in)', 'Concealed zip, insert sold separately', 'Hand-patched front, plain cotton back', 'Cold wash, line dry'] },
  { id: 'indigo-dusk-cushion', name: 'Indigo Dusk Cushion', cat: 'cushions', price: 1500, kg: 0.35, palette: 'indigo', tag: '',
    imgs: [PX(5998023), PX(7061404)], maker: 'Rubina', stock: 18,
    blurb: 'Deep indigo and cream patches that sit well with wood, brass and white walls.',
    details: ['Cover size: 40 × 40 cm', 'Concealed zip', 'Hand-patched front', 'Cold wash, line dry'] },
  { id: 'sage-lounge-cushion', name: 'Sage Lounge Cushion', cat: 'cushions', price: 1600, kg: 0.4, palette: 'sage', tag: 'New',
    imgs: [PX(4915583), PX(5998023)], maker: 'Hina', stock: 11,
    blurb: 'Calm sage tones with small pops of rose. Made for reading corners and quiet rooms.',
    details: ['Cover size: 45 × 45 cm', 'Concealed zip', 'Hand-patched front', 'Cold wash, line dry'] },
  { id: 'cafe-pair', name: 'Café Pair (set of 2)', cat: 'cushions', price: 2800, kg: 0.7, palette: 'rose', tag: 'Bundle',
    imgs: [PX(6309988), PX(7535045)], maker: 'Zainab', stock: 12,
    blurb: 'Two matching cushion covers at a bundle price. Popular with cafés and new homes.',
    details: ['Two covers, 40 × 40 cm', 'Saves PKR 200 against buying singly', 'Hand-patched fronts', 'Cold wash, line dry'] },
  { id: 'heirloom-throw', name: 'Heirloom Ralli Throw', cat: 'throws', price: 6800, kg: 2.5, palette: 'terracotta', tag: 'Signature',
    imgs: [PX(8266834), PX(8266835)], maker: 'Zainab & Rubina', stock: 6,
    blurb: 'Our signature quilted throw, patched in the ralli tradition and stitched in lines the way grandmothers did.',
    details: ['Size: 150 × 200 cm', 'Three layers: patched top, soft cotton fill, plain back', 'Hand-finished edges', 'Takes about two days to make'] },
  { id: 'morning-throw', name: 'Morning Bed Throw', cat: 'throws', price: 7400, kg: 2.8, palette: 'sage', tag: '',
    imgs: [PX(8266835), PX(8266834)], maker: 'Rubina', stock: 4,
    blurb: 'A lighter, wider throw for the foot of the bed. Soft colours that suit early light.',
    details: ['Size: 180 × 220 cm', 'Light cotton fill, all seasons', 'Hand-finished edges', 'Machine wash cold, gentle'] },
  { id: 'dastarkhwan-set', name: 'Dastarkhwan Runner Set', cat: 'table', price: 2300, kg: 0.6, palette: 'indigo', tag: 'New',
    imgs: [PX(19870054), PX(18359544)], maker: 'Hina', stock: 16,
    blurb: 'A patchwork runner with four matching placemats. Wipe-clean lining for real family meals.',
    details: ['Runner 35 × 150 cm, four placemats 30 × 40 cm', 'Wipe-clean lining', 'Hand-patched top', 'Spot clean or cold wash'] },
  { id: 'chai-placemats', name: 'Chai-Time Placemats (set of 4)', cat: 'table', price: 1400, kg: 0.35, palette: 'mustard', tag: '',
    imgs: [PX(18359544), PX(19870054)], maker: 'Hina', stock: 25,
    blurb: 'Four small placemats for the tea tray. Each one is a different patch mix.',
    details: ['Each 28 × 36 cm', 'Wipe-clean lining', 'Four different patch mixes', 'Spot clean or cold wash'] },
  { id: 'patch-and-chai', name: 'Patch & Chai Workshop', cat: 'experiences', price: 2500, kg: 0, palette: 'rose', tag: 'Experience',
    imgs: [PX(13806526), PX(3738095)], maker: 'Studio team', stock: 20, experience: true,
    blurb: 'A relaxed two-hour session at the studio. Learn to patch and stitch, and leave with your own pouch.',
    details: ['Two hours, all materials included', 'Up to 8 people per session', 'Tea and snacks provided', 'Faisalabad studio (demo schedule)'] },
];

const MAKERS = [
  { name: 'Zainab', role: 'Head stitcher', years: '9 yrs stitching', quote: 'I like finding where two odd pieces suddenly agree with each other.', img: PX(11951302, 700) },
  { name: 'Rubina', role: 'Stitcher', years: '6 yrs stitching', quote: 'A throw takes two days. By the end I know every patch by heart.', img: PX(7147619, 700) },
  { name: 'Hina', role: 'Stitcher and pattern cutter', years: '4 yrs stitching', quote: 'Scraps are not waste. They are just pieces waiting for a plan.', img: PX(3738095, 700) },
];

const JOURNAL = [
  { id: 'ralli', cat: 'Craft', title: 'What is ralli, and why do we love it?', read: '4 min', img: PX(8266834, 900),
    body: ['Ralli is a patchwork quilting tradition from Sindh and southern Punjab. Households saved scraps of cloth for months, then stitched them into bedspreads and throws, often in bright, bold combinations.', 'We borrow its spirit rather than copy any one design: nothing is wasted, every piece is different, and the stitching itself is part of the beauty.', 'Our patch layouts are cut by hand and planned on the table, so each throw has its own rhythm.'] },
  { id: 'offcuts', cat: 'Impact', title: 'Where do offcuts come from?', read: '3 min', img: PX(365066, 900),
    body: ['Every garment or home-textile order leaves trimmings on the cutting-room floor. Most are swept up and sold by weight to be burned, dumped or shredded.', 'We pick up clean, sorted offcuts from export units around Faisalabad, wash them, and sort them by colour and fibre. In our first year we plan to use about one tonne.', 'That is a very small share of the roughly 270,000 tonnes of textile waste Pakistan produces each year, so supply is never our problem.'] },
  { id: 'memory', cat: 'Stories', title: 'Turning a father\'s old kurtas into a throw', read: '5 min', img: PX(8266835, 900),
    body: ['Memory Throws are our most personal work. Customers send us clothes that mean something: a wedding dupatta, a school uniform, a grandfather\'s shawl.', 'We wash each piece, choose which parts will become patches, and plan the layout with the customer by message.', 'This story is an example written for the demo. Real stories will be added with permission from customers.'] },
  { id: 'care', cat: 'Care', title: 'How to wash a patchwork throw', read: '2 min', img: PX(6461401, 900),
    body: ['Wash cold, on a gentle cycle, with a mild detergent. Turn cushion covers inside out first.', 'Dry in the shade. Strong sun fades the deepest colours faster than you expect.', 'If a stitch loosens, bring it to a studio visit; we will fix it for free.'] },
  { id: 'wages', cat: 'People', title: 'Why we pay the minimum wage as a floor, not a target', read: '3 min', img: PX(13806526, 900),
    body: ['The Punjab minimum wage for unskilled workers is PKR 40,000 a month. Every full-time stitcher at Phir Se Studio is paid at least that, and we expect to pay more as skills grow.', 'Fair pay is built into our prices, which is why a throw costs more than an imported one.'] },
  { id: 'cafes', cat: 'Partners', title: 'Five ways cafés use patchwork cushions', read: '3 min', img: PX(6309988, 900),
    body: ['Cushions soften booth seating, make window benches inviting, and give regulars something to talk about.', 'With a small tag on each one, customers can scan a QR code to see the fabric it saved. Some cafés report that guests ask to buy them.', 'We offer a café programme with bulk pricing, replacement covers and a display card.'] },
];

const FAQ = [
  ['Are these really made from waste?', 'Yes. Fabric comes from clean offcuts and trimmings from export units near Faisalabad. We sort, wash and plan each piece before cutting.'],
  ['How long does delivery take?', 'Ready items ship in 2 to 3 working days. Throws and Memory Throws take 7 to 14 days because they are made to order. (Demo answer.)'],
  ['Can I pay cash on delivery?', 'Yes. Cash on delivery, bank transfer and mobile wallet are all supported. (Demo checkout only; no real payment is taken.)'],
  ['What is a Memory Throw?', 'A throw made from clothes that matter to you. Send us the garments, pick a layout, and we stitch them into a quilt.'],
  ['What does the QR tag show?', 'The kilograms of fabric your piece saved, the first name of the stitcher who made it, and care instructions.'],
  ['Can I return an item?', 'Ready items can be returned within 7 days if unused. Made-to-order items cannot be returned. (Demo policy.)'],
];

const EVENTS = [
  { d: '12', m: 'DEC', city: 'Lahore', name: 'Winter Design Bazaar', where: 'Pop-up stall' },
  { d: '19', m: 'DEC', city: 'Islamabad', name: 'Makers Market', where: 'Pop-up stall' },
  { d: '09', m: 'JAN', city: 'Faisalabad', name: 'Patch & Chai Workshop', where: 'At the studio' },
  { d: '23', m: 'JAN', city: 'Karachi', name: 'Craft & Cause Fair', where: 'Pop-up stall' },
];

const COLORS = { terracotta: '#B5523B', indigo: '#2F4B7C', mustard: '#D9A441', sage: '#7A9A7E', cream: '#F4ECDD', rose: '#D88C7A', ink: '#231B17' };
