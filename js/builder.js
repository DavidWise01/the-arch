/**
 * builder.js — SVG arch construction and geometry
 * Builds the stone arch, pillars, arch-void, and all SVG elements.
 */

import { COURSES } from "./data.js";

export const GEO = {
  cx:    380,
  blockW: 104,
  blockH: 54,
  gap:    7,
  base:   540,   // y of bottom of foundation course
  pillW:  68,
  pillH:  160,
  voidRx: 220,
  voidRy: 90,
};

const SVGNS = "http://www.w3.org/2000/svg";
function el(tag, attrs = {}, text = "") {
  const e = document.createElementNS(SVGNS, tag);
  for (const [k, v] of Object.entries(attrs)) e.setAttribute(k, v);
  if (text) e.textContent = text;
  return e;
}

export function courseY(idx) {
  return GEO.base - (idx + 1) * GEO.blockH - idx * GEO.gap;
}

export function courseWidth(c) {
  return c.blocks * GEO.blockW;
}

// ─── DEFS ────────────────────────────────────────────────────────
function buildDefs(svg) {
  const defs = el("defs");

  // Stone gradient
  const sg = el("linearGradient", { id:"grad-stone", x1:"0", y1:"0", x2:"0", y2:"1" });
  sg.append(
    el("stop", { offset:"0",    "stop-color":"var(--stone-l)" }),
    el("stop", { offset:"0.55", "stop-color":"var(--stone)" }),
    el("stop", { offset:"1",    "stop-color":"var(--stone-d)" }),
  );
  defs.appendChild(sg);

  // Stone texture filter
  const stoneFilter = el("filter", { id:"f-stone", x:"-5%", y:"-5%", width:"110%", height:"110%" });
  const turb = el("feTurbulence", { type:"fractalNoise", baseFrequency:"0.65 0.4", numOctaves:"3", result:"noise", seed:"7" });
  const disp = el("feDisplacementMap", { in:"SourceGraphic", in2:"noise", scale:"2.5", xChannelSelector:"R", yChannelSelector:"G", result:"displaced" });
  stoneFilter.append(turb, disp);
  defs.appendChild(stoneFilter);

  // Bronze gradient
  const bg = el("linearGradient", { id:"grad-bronze", x1:"0", y1:"0", x2:"0", y2:"1" });
  bg.append(
    el("stop", { offset:"0",   "stop-color":"var(--bronze-l)" }),
    el("stop", { offset:"0.5", "stop-color":"var(--bronze)" }),
    el("stop", { offset:"1",   "stop-color":"var(--bronze-d)" }),
  );
  defs.appendChild(bg);

  // Keystone glow filter
  const gf = el("filter", { id:"f-glow", x:"-60%", y:"-60%", width:"220%", height:"220%" });
  const gb = el("feGaussianBlur", { in:"SourceGraphic", stdDeviation:"8", result:"b" });
  const gm = el("feMerge");
  gm.append(el("feMergeNode", { in:"b" }), el("feMergeNode", { in:"SourceGraphic" }));
  gf.append(gb, gm);
  defs.appendChild(gf);

  // Pillar gradient
  const pg = el("linearGradient", { id:"grad-pillar", x1:"0", y1:"0", x2:"1", y2:"0" });
  pg.append(
    el("stop", { offset:"0",    "stop-color":"var(--stone-d)" }),
    el("stop", { offset:"0.4",  "stop-color":"var(--stone)" }),
    el("stop", { offset:"1",    "stop-color":"var(--stone-d)" }),
  );
  defs.appendChild(pg);

  // Arch void gradient — inner glow
  const vg = el("radialGradient", { id:"grad-void", cx:"50%", cy:"100%", r:"80%", fx:"50%", fy:"100%" });
  vg.append(
    el("stop", { offset:"0",   "stop-color":"#0d1018" }),
    el("stop", { offset:"0.7", "stop-color":"#090c12" }),
    el("stop", { offset:"1",   "stop-color":"#060810" }),
  );
  defs.appendChild(vg);

  // Drop shadow for pillar caps
  const ds = el("filter", { id:"f-shadow", x:"-10%", y:"-10%", width:"120%", height:"130%" });
  ds.append(
    el("feDropShadow", { dx:"0", dy:"6", stdDeviation:"8", "flood-color":"rgba(0,0,0,.5)", result:"s" }),
  );
  defs.appendChild(ds);

  // Clip path for arch void (bottom half only)
  const clip = el("clipPath", { id:"clip-void" });
  clip.appendChild(el("rect", { x:"0", y: GEO.base - 5, width:"760", height:"200" }));
  defs.appendChild(clip);

  svg.appendChild(defs);
}

// ─── ARCH VOID + PILLARS ────────────────────────────────────────
function buildArchBase(svg) {
  const { cx, base, pillW, pillH, voidRx, voidRy } = GEO;

  // Ground shadow ellipse
  svg.appendChild(el("ellipse", {
    cx, cy: base + pillH + 22, rx: 310, ry: 16, fill:"rgba(0,0,0,.4)"
  }));

  // Left pillar
  const lx = cx - voidRx - pillW;
  const pillY = base;
  svg.appendChild(buildPillar(lx, pillY, pillW, pillH, "left"));

  // Right pillar
  const rx2 = cx + voidRx;
  svg.appendChild(buildPillar(rx2, pillY, pillW, pillH, "right"));

  // Arch void — ellipse clipped to bottom half
  const voidG = el("g", { "clip-path":"url(#clip-void)" });
  voidG.appendChild(el("ellipse", {
    cx, cy: base - 4, rx: voidRx, ry: voidRy,
    fill:"url(#grad-void)", stroke:"var(--hair)", "stroke-width":"1.5"
  }));
  // inner glow line
  voidG.appendChild(el("ellipse", {
    cx, cy: base - 4, rx: voidRx - 6, ry: voidRy - 5,
    fill:"none", stroke:"rgba(50,60,80,.5)", "stroke-width":"1"
  }));
  svg.appendChild(voidG);

  // Impost blocks (where arch springs from pillars)
  const impH = 14;
  [lx, rx2].forEach(px => {
    svg.appendChild(el("rect", {
      x: px, y: pillY - impH, width: pillW, height: impH, rx: 2,
      fill:"url(#grad-stone)", stroke:"var(--stone-d)", "stroke-width":"1"
    }));
  });
}

function buildPillar(x, y, w, h, side) {
  const g = el("g");

  // Pillar body
  g.appendChild(el("rect", {
    x, y, width: w, height: h, rx: 2,
    fill:"url(#grad-pillar)", stroke:"var(--stone-d)", "stroke-width":"1"
  }));

  // Pillar cap (decorative moulding)
  const capH = 12;
  g.appendChild(el("rect", {
    x: x - 3, y: y - capH, width: w + 6, height: capH + 2, rx: 3,
    fill:"url(#grad-stone)", stroke:"var(--stone-d)", "stroke-width":"1"
  }));

  // Horizontal stone courses in pillar (decorative)
  for (let i = 1; i < 3; i++) {
    g.appendChild(el("line", {
      x1: x + 2, y1: y + (h / 3) * i, x2: x + w - 2, y2: y + (h / 3) * i,
      stroke:"var(--joint)", "stroke-width":"1.5"
    }));
  }

  // Bevel highlight (top edge)
  g.appendChild(el("line", {
    x1: x + 1, y1: y + 0.5, x2: x + w - 1, y2: y + 0.5,
    stroke:"var(--stone-l)", "stroke-width":"1", "stroke-opacity":"0.5"
  }));

  return g;
}

// ─── INDIVIDUAL COURSE ───────────────────────────────────────────
function buildCourse(c, idx, selectedId) {
  const { cx, blockW, blockH } = GEO;
  const w   = courseWidth(c);
  const x0  = cx - w / 2;
  const y   = courseY(idx);
  const sel = selectedId === c.id;

  const g = el("g", {
    class: `course${sel ? " sel" : ""}`,
    "data-id": c.id,
    "aria-label": `Course ${c.number}: ${c.name}`,
    role: "button",
    tabindex: "0",
    style: `--delay:${idx * 55}ms`,
  });

  if (c.key) {
    // Keystone — trapezoidal, bronze
    const overhang = 36;
    const tx0  = cx - (w + overhang) / 2;
    const tw   = w + overhang;
    const path = `M${x0},${y + blockH} L${tx0},${y} L${tx0 + tw},${y} L${x0 + w},${y + blockH} Z`;

    // Selection ring / glow ring
    g.appendChild(el("path", {
      class: "ring",
      d: `M${x0 - 4},${y + blockH + 3} L${tx0 - 5},${y - 4} L${tx0 + tw + 5},${y - 4} L${x0 + w + 4},${y + blockH + 3} Z`,
      fill:"none", stroke:"var(--bronze-glow)", "stroke-width":"2.5",
      filter:"url(#f-glow)", opacity: sel ? "1" : "0",
    }));

    // Face
    g.appendChild(el("path", { class:"face", d:path, fill:"url(#grad-bronze)", stroke:"var(--bronze-d)", "stroke-width":"1.5" }));

    // Top highlight
    g.appendChild(el("line", {
      x1: tx0 + 2, y1: y + 1, x2: tx0 + tw - 2, y2: y + 1,
      stroke:"var(--bronze-glow)", "stroke-width":"1.5", "stroke-opacity":"0.8",
    }));

    // Side highlights (bevel)
    g.appendChild(el("line", {
      x1: tx0 + 1, y1: y + 1, x2: x0 + 2, y2: y + blockH - 2,
      stroke:"var(--bronze-l)", "stroke-width":"1", "stroke-opacity":"0.4",
    }));

    // Inscription
    const label = el("text", {
      x: cx, y: y + blockH / 2 + 1,
      "text-anchor":"middle", "dominant-baseline":"middle",
      "font-family":"Cinzel, serif", "font-weight":"700",
      "font-size":"14", "letter-spacing":"2", fill:"var(--bronze-ink)",
    });
    label.textContent = "THE HUMAN ACTS";
    g.appendChild(label);

    // Pulse ring animation (always on for keystone)
    const pulseRing = el("path", {
      class: "keystone-pulse",
      d: `M${x0 - 6},${y + blockH + 5} L${tx0 - 8},${y - 6} L${tx0 + tw + 8},${y - 6} L${x0 + w + 6},${y + blockH + 5} Z`,
      fill:"none", stroke:"var(--bronze-glow)", "stroke-width":"2", "stroke-opacity":"0.6",
      filter:"url(#f-glow)",
    });
    g.appendChild(pulseRing);

  } else {
    // Standard course — rectangular stone blocks
    const rx = 3;

    // Selection ring
    g.appendChild(el("rect", {
      class: "ring",
      x: x0 - 4, y: y - 4, width: w + 8, height: blockH + 8, rx: rx + 2,
      fill:"none", stroke:"var(--bronze)", "stroke-width":"2.5",
      opacity: sel ? "1" : "0",
    }));

    // Main face (stone)
    g.appendChild(el("rect", {
      class: "face",
      x: x0, y, width: w, height: blockH, rx,
      fill:"url(#grad-stone)", stroke:"var(--stone-d)", "stroke-width":"1",
      filter:"url(#f-stone)",
    }));

    // Top bevel highlight
    g.appendChild(el("line", {
      x1: x0 + rx, y1: y + 1, x2: x0 + w - rx, y2: y + 1,
      stroke:"var(--stone-l)", "stroke-width":"1.5", "stroke-opacity":"0.7",
    }));

    // Bottom shadow line
    g.appendChild(el("line", {
      x1: x0 + rx, y1: y + blockH - 1, x2: x0 + w - rx, y2: y + blockH - 1,
      stroke:"var(--stone-d)", "stroke-width":"1", "stroke-opacity":"0.5",
    }));

    // Mortar joints between blocks
    for (let b = 1; b < c.blocks; b++) {
      const jx = x0 + b * blockW;
      // Main joint
      g.appendChild(el("line", {
        x1: jx, y1: y + 3, x2: jx, y2: y + blockH - 3,
        stroke:"var(--joint)", "stroke-width":"2.5",
      }));
      // Shadow on right of joint
      g.appendChild(el("line", {
        x1: jx + 1.5, y1: y + 3, x2: jx + 1.5, y2: y + blockH - 3,
        stroke:"rgba(0,0,0,.3)", "stroke-width":"1",
      }));
    }

    // Course label
    const fontSize = c.name.length > 18 ? "12" : c.name.length > 14 ? "13" : "14";
    const label = el("text", {
      x: cx, y: y + blockH / 2 + 1,
      "text-anchor":"middle", "dominant-baseline":"middle",
      "font-family":"Cinzel, serif", "font-weight":"600",
      "font-size": fontSize, "letter-spacing":"1.8", fill:"var(--inscribe)",
    });
    label.textContent = c.name;
    g.appendChild(label);

    // Block count indicator (left side)
    const counter = el("text", {
      x: x0 - 13, y: y + blockH / 2 + 1,
      "text-anchor":"end", "dominant-baseline":"middle",
      "font-family":"JetBrains Mono, monospace", "font-size":"11.5",
      fill:"var(--faint)",
    });
    counter.textContent = c.blocks;
    g.appendChild(counter);

    // Roman numeral (right side)
    const roman = el("text", {
      x: x0 + w + 13, y: y + blockH / 2 + 1,
      "text-anchor":"start", "dominant-baseline":"middle",
      "font-family":"Cinzel, serif", "font-size":"10.5",
      fill:"var(--dim)",
    });
    roman.textContent = c.number;
    g.appendChild(roman);
  }

  return g;
}

// ─── LOAD PATH ──────────────────────────────────────────────────
export function buildLoadPath(svg, fromIdx, toIdx = COURSES.length - 1) {
  const { cx } = GEO;
  const pathGroup = el("g", { class:"load-path", "pointer-events":"none" });

  for (let i = fromIdx; i < toIdx; i++) {
    const y0 = courseY(i) - 1;
    const y1 = courseY(i + 1) + GEO.blockH + 1;
    const arrowPath = el("path", {
      d: `M${cx},${y0} L${cx},${y1}`,
      stroke:"var(--bronze-glow)", "stroke-width":"2", "stroke-dasharray":"4 4",
      fill:"none", opacity:"0", "pointer-events":"none",
    });
    arrowPath.animate(
      [{ opacity:0 }, { opacity:0.7, offset:0.3 }, { opacity:0 }],
      { duration:1800, delay: (i - fromIdx) * 220, fill:"forwards", easing:"ease-in-out" }
    );
    pathGroup.appendChild(arrowPath);
  }
  svg.appendChild(pathGroup);
  return pathGroup;
}

// ─── AXIS ARROWS ─────────────────────────────────────────────────
function buildAxes(svg) {
  // Primitives axis (left, pointing down)
  svg.append(
    el("line", { x1:"44", y1:"200", x2:"44", y2:"530", stroke:"var(--dim)", "stroke-width":"1.2" }),
    el("path", { d:"M44,530 l-4,-9 l8,0 z", fill:"var(--dim)" }),
  );

  // Load axis (right, pointing up)
  svg.append(
    el("line", { x1:"716", y1:"530", x2:"716", y2:"200", stroke:"var(--dim)", "stroke-width":"1.2" }),
    el("path", { d:"M716,200 l-4,9 l8,0 z", fill:"var(--dim)" }),
  );
}

// ─── MAIN BUILD ──────────────────────────────────────────────────
export function buildArch(svg, selectedId, callbacks = {}) {
  svg.innerHTML = "";
  buildDefs(svg);
  buildAxes(svg);
  buildArchBase(svg);

  COURSES.forEach((c, i) => {
    const g = buildCourse(c, i, selectedId);

    g.addEventListener("click", () => callbacks.onSelect?.(c.id));
    g.addEventListener("mouseenter", () => callbacks.onHover?.(c.id));
    g.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") { e.preventDefault(); callbacks.onSelect?.(c.id); }
    });

    svg.appendChild(g);
  });

  // Floor line
  svg.appendChild(el("line", {
    x1:"80", y1: GEO.base + GEO.blockH + GEO.gap + GEO.pillH + 2,
    x2:"680", y2: GEO.base + GEO.blockH + GEO.gap + GEO.pillH + 2,
    stroke:"var(--dim)", "stroke-width":"1", "stroke-opacity":"0.5",
  }));
}
