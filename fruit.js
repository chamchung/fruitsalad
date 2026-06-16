/* ============================================================
   FRUIT SALAD — SVG fruit factory
   Every fruit is built from geometric primitives so it stays
   crisp, recolorable and animatable. No raster images.
   ============================================================ */
(function () {
  const NS = 'http://www.w3.org/2000/svg';

  // ---- math helpers -----------------------------------------
  function polar(cx, cy, r, deg) {
    const a = (deg - 90) * Math.PI / 180;
    return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
  }
  function wedge(cx, cy, r, a0, a1, gap) {
    gap = gap || 0;
    const [x0, y0] = polar(cx, cy, r, a0 + gap);
    const [x1, y1] = polar(cx, cy, r, a1 - gap);
    const large = (a1 - a0) % 360 > 180 ? 1 : 0;
    return `M${cx} ${cy} L${x0.toFixed(2)} ${y0.toFixed(2)} A${r} ${r} 0 ${large} 1 ${x1.toFixed(2)} ${y1.toFixed(2)} Z`;
  }
  function n(v) { return Number(v).toFixed(2); }

  // ---- citrus / grapefruit ----------------------------------
  // a cut citrus: skin ring + flesh wedges + pith lines + core
  function citrus(o) {
    o = o || {};
    const skin = o.skin || '#F4A6A0';
    const segA = o.segA || '#F2433F';
    const segB = o.segB || '#FF6F61';
    const pith = o.pith || '#FBE7E0';
    const segs = o.segments || 8;
    const C = 100, R = 96, flesh = 80;
    let wedges = '';
    for (let i = 0; i < segs; i++) {
      const a0 = i * (360 / segs);
      const a1 = a0 + (360 / segs);
      const fill = i % 2 === 0 ? segA : segB;
      wedges += `<path d="${wedge(C, C, flesh, a0, a1, 1.6)}" fill="${fill}"/>`;
    }
    let pithLines = '';
    for (let i = 0; i < segs; i++) {
      const [x, y] = polar(C, C, flesh, i * (360 / segs));
      pithLines += `<line x1="${C}" y1="${C}" x2="${n(x)}" y2="${n(y)}" stroke="${pith}" stroke-width="3.4" stroke-linecap="round"/>`;
    }
    return svg(`
      <circle cx="${C}" cy="${C}" r="${R}" fill="${skin}"/>
      <circle cx="${C}" cy="${C}" r="${flesh + 4}" fill="${pith}"/>
      <g class="spin-host">${wedges}${pithLines}
        <circle cx="${C}" cy="${C}" r="7" fill="${pith}"/>
      </g>`, o);
  }

  // ---- orange wedge (half slice) ----------------------------
  function orange(o) {
    o = o || {};
    const skin = o.skin || '#F2871E';
    const segA = o.segA || '#F7A23A';
    const segB = o.segB || '#FFB957';
    const pith = o.pith || '#FFE6C2';
    const C = 100, flesh = 86;
    // half circle facing up (180deg span)
    let wedges = '';
    const segs = 5;
    for (let i = 0; i < segs; i++) {
      const a0 = -90 + i * (180 / segs);
      const a1 = a0 + 180 / segs;
      wedges += `<path d="${wedge(C, C, flesh, a0, a1, 1.4)}" fill="${i % 2 ? segA : segB}"/>`;
    }
    return svg(`
      <path d="M4 100 A96 96 0 0 1 196 100 Z" fill="${skin}"/>
      <path d="M${C - (flesh + 3)} 100 A${flesh + 3} ${flesh + 3} 0 0 1 ${C + (flesh + 3)} 100 Z" fill="${pith}"/>
      <g class="spin-host" style="transform-origin:100px 100px">${wedges}</g>`, o, '0 0 200 110');
  }

  // ---- kiwi -------------------------------------------------
  function kiwi(o) {
    o = o || {};
    const edge = o.edge || '#8FAE1F';
    const flesh = o.flesh || '#AFCB2C';
    const core = o.core || '#F4EFD8';
    const seed = o.seed || '#1a1a22';
    const C = 100;
    let seeds = '';
    const ring = 24;
    for (let i = 0; i < ring; i++) {
      const a = i * (360 / ring);
      const [x, y] = polar(C, C, 60, a);
      seeds += `<ellipse cx="${n(x)}" cy="${n(y)}" rx="2.3" ry="6.2" fill="${seed}" transform="rotate(${a.toFixed(1)} ${n(x)} ${n(y)})"/>`;
    }
    return svg(`
      <circle cx="${C}" cy="${C}" r="96" fill="${edge}"/>
      <circle cx="${C}" cy="${C}" r="88" fill="${flesh}"/>
      <g class="spin-host">
        ${seeds}
        <circle cx="${C}" cy="${C}" r="22" fill="${core}"/>
        <g stroke="${flesh}" stroke-width="2.4" stroke-linecap="round">
          ${Array.from({ length: 12 }).map((_, i) => {
            const a = i * 30; const [x1, y1] = polar(C, C, 6, a); const [x2, y2] = polar(C, C, 20, a);
            return `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}"/>`;
          }).join('')}
        </g>
      </g>`, o);
  }

  // ---- strawberry -------------------------------------------
  function strawberry(o) {
    o = o || {};
    const body = o.body || '#F2433F';
    const seed = o.seed || '#FBE7B0';
    const leaf = o.leaf || '#1a1a22';
    // body: rounded inverted teardrop
    const path = 'M100 24 C150 24 176 56 176 96 C176 150 132 188 100 196 C68 188 24 150 24 96 C24 56 50 24 100 24 Z';
    let seeds = '';
    const pts = [[100, 70], [70, 80], [130, 80], [85, 108], [115, 108], [100, 135], [60, 110], [140, 110], [78, 150], [122, 150], [100, 168]];
    pts.forEach(([x, y]) => { seeds += `<ellipse cx="${x}" cy="${y}" rx="3" ry="6.5" fill="${seed}"/>`; });
    // leafy calyx
    const leaves = `
      <g fill="${leaf}">
        <path d="M100 8 C112 18 120 26 120 40 C108 36 100 30 100 22 C100 30 92 36 80 40 C80 26 88 18 100 8 Z"/>
        <path d="M100 26 C118 26 138 22 152 30 C138 44 118 46 100 38 C82 46 62 44 48 30 C62 22 82 26 100 26 Z"/>
        <rect x="96" y="2" width="8" height="20" rx="4"/>
      </g>`;
    return svg(`
      <path class="berry-body" d="${path}" fill="${body}"/>
      ${seeds}
      ${leaves}`, o);
  }

  // ---- blueberry --------------------------------------------
  function blueberry(o) {
    o = o || {};
    const body = o.body || '#5B3CD6';
    const dark = o.dark || '#15131f';
    const C = 100;
    const star = (cx, cy, r, inner) => {
      let p = '';
      for (let i = 0; i < 10; i++) {
        const rr = i % 2 ? inner : r;
        const [x, y] = polar(cx, cy, rr, i * 36);
        p += (i ? 'L' : 'M') + n(x) + ' ' + n(y) + ' ';
      }
      return p + 'Z';
    };
    return svg(`
      <circle cx="${C}" cy="${C}" r="94" fill="${body}"/>
      <circle cx="${C}" cy="${C}" r="94" fill="url(#bbShade)"/>
      <circle cx="${C}" cy="68" r="26" fill="${dark}"/>
      <path d="${star(C, 68, 22, 8)}" fill="${body}"/>`, o, '0 0 200 200',
      `<radialGradient id="bbShade" cx="38%" cy="32%" r="75%">
         <stop offset="0%" stop-color="#7E63E8"/>
         <stop offset="60%" stop-color="${body}" stop-opacity="0"/>
       </radialGradient>`);
  }

  // ---- watermelon wedge -------------------------------------
  function watermelon(o) {
    o = o || {};
    const rind = o.rind || '#3FA34D';
    const rind2 = o.rind2 || '#BFE08A';
    const flesh = o.flesh || '#F2433F';
    const seed = o.seed || '#15131f';
    let seeds = '';
    const pts = [[100, 70], [74, 92], [126, 92], [90, 118], [110, 118], [100, 150]];
    pts.forEach(([x, y]) => { seeds += `<ellipse cx="${x}" cy="${y}" rx="3.4" ry="7" fill="${seed}" transform="rotate(${(x - 100) * 0.6} ${x} ${y})"/>`; });
    return svg(`
      <path d="M8 40 A100 130 0 0 0 192 40 Z" fill="${rind}"/>
      <path d="M22 44 A86 112 0 0 0 178 44 Z" fill="${rind2}"/>
      <path d="M30 46 A78 102 0 0 0 170 46 Z" fill="${flesh}"/>
      ${seeds}`, o, '0 0 200 165');
  }

  // ---- decorative blobs / shapes ----------------------------
  function semicircle(o) {
    o = o || {};
    return svg(`<path d="M0 100 A100 100 0 0 1 200 100 Z" fill="${o.fill || '#EB5C9A'}"/>`, o, '0 0 200 100');
  }
  function blob(o) {
    o = o || {};
    return svg(`<path d="M44 12 C92 -8 168 6 188 56 C206 102 176 150 122 168 C70 185 14 168 6 116 C-1 70 12 24 44 12 Z" fill="${o.fill || '#F4D27A'}"/>`, o, '0 0 200 180');
  }
  function arc(o) {
    o = o || {};
    return svg(`<path d="M10 190 A180 180 0 0 1 190 10" fill="none" stroke="${o.fill || '#F4A6A0'}" stroke-width="${o.w || 22}" stroke-linecap="round"/>`, o);
  }

  // ---- abstract value-icons (asterisk / flower / burst) -----
  function burst(o) {
    o = o || {};
    const c = o.fill || '#F2433F';
    let lines = '';
    const k = o.points || 8;
    for (let i = 0; i < k; i++) {
      const a = i * (360 / k);
      const [x1, y1] = polar(100, 100, 24, a);
      const [x2, y2] = polar(100, 100, 78, a);
      lines += `<line x1="${n(x1)}" y1="${n(y1)}" x2="${n(x2)}" y2="${n(y2)}" stroke="${c}" stroke-width="${o.w || 13}" stroke-linecap="round"/>`;
    }
    return svg(`<g class="spin-host">${lines}</g>`, o);
  }
  function flower(o) {
    o = o || {};
    const c = o.fill || '#F2871E';
    let petals = '';
    const k = o.petals || 6;
    for (let i = 0; i < k; i++) {
      const a = i * (360 / k);
      const [x, y] = polar(100, 100, 50, a);
      petals += `<circle cx="${n(x)}" cy="${n(y)}" r="30" fill="${c}"/>`;
    }
    return svg(`<g class="spin-host">${petals}<circle cx="100" cy="100" r="30" fill="${c}"/></g>`, o);
  }

  // ---- svg wrapper ------------------------------------------
  function svg(inner, o, vb, defs) {
    o = o || {};
    vb = vb || '0 0 200 200';
    const el = document.createElementNS(NS, 'svg');
    el.setAttribute('viewBox', vb);
    el.setAttribute('class', 'fruit-svg' + (o.cls ? ' ' + o.cls : ''));
    el.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    el.innerHTML = (defs ? `<defs>${defs}</defs>` : '') + inner;
    return el;
  }

  const FRUIT = { citrus, orange, kiwi, strawberry, blueberry, watermelon, semicircle, blob, arc, burst, flower };

  // mount any element with data-fruit
  function mountAll(root) {
    (root || document).querySelectorAll('[data-fruit]').forEach((host) => {
      if (host.__mounted) return;
      const kind = host.getAttribute('data-fruit');
      if (!FRUIT[kind]) return;
      let opts = {};
      const cfg = host.getAttribute('data-cfg');
      if (cfg) { try { opts = JSON.parse(cfg); } catch (e) {} }
      host.appendChild(FRUIT[kind](opts));
      host.__mounted = true;
    });
  }

  window.FRUIT = FRUIT;
  window.mountFruit = mountAll;
  document.addEventListener('DOMContentLoaded', () => mountAll());
})();
