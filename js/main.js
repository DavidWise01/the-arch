/**
 * main.js — App initialization, keyboard navigation, interactions
 * The Arch — a governance structure for automated intelligence
 */

import { COURSES, courseIndex, courseById } from "./data.js";
import { buildArch, buildLoadPath, GEO, courseY } from "./builder.js";
import { renderDetail } from "./detail.js";

const svg    = document.getElementById("arch");
const detail = document.getElementById("detail");
const traceBtn = document.getElementById("btn-trace");
const infoBtn  = document.getElementById("btn-info");

let selected  = "cap";         // default to keystone
let traceActive = false;
let traceGroup  = null;

// ── RENDER ────────────────────────────────────────────────────────
function render() {
  buildArch(svg, selected, {
    onSelect: id => { selected = id; render(); },
    onHover:  id => { selected = id; render(); },
  });
  renderDetail("detail", selected);
}

// ── KEYBOARD NAVIGATION ───────────────────────────────────────────
function navigateCourse(delta) {
  const idx  = courseIndex(selected);
  const next = idx + delta;
  if (next >= 0 && next < COURSES.length) {
    selected = COURSES[next].id;
    render();
    // Focus the new course element for accessibility
    const el = svg.querySelector(`[data-id="${selected}"]`);
    el?.focus();
  }
}

document.addEventListener("keydown", e => {
  switch (e.key) {
    case "ArrowUp":   e.preventDefault(); navigateCourse(1);  break;  // up = higher course
    case "ArrowDown": e.preventDefault(); navigateCourse(-1); break;  // down = lower course
    case "Home":      e.preventDefault(); selected = COURSES[0].id; render(); break;
    case "End":       e.preventDefault(); selected = COURSES[COURSES.length - 1].id; render(); break;
    case "t": case "T": toggleTrace(); break;
  }
});

// ── DETAIL NAV EVENTS ─────────────────────────────────────────────
detail.addEventListener("course-select", e => {
  selected = e.detail.id;
  render();
});

// ── LOAD PATH TRACE ───────────────────────────────────────────────
function toggleTrace() {
  traceActive = !traceActive;
  traceBtn?.classList.toggle("active", traceActive);

  if (traceGroup) { traceGroup.remove(); traceGroup = null; }

  if (traceActive) {
    const fromIdx = courseIndex(selected);
    traceGroup = buildLoadPath(svg, fromIdx);
    traceBtn.textContent = "▸ TRACING…";
    setTimeout(() => {
      traceActive = false;
      traceBtn?.classList.remove("active");
      traceBtn.textContent = "▸ TRACE LOAD";
      traceGroup?.remove();
      traceGroup = null;
    }, (COURSES.length - fromIdx) * 220 + 1800);
  } else {
    traceBtn.textContent = "▸ TRACE LOAD";
  }
}

traceBtn?.addEventListener("click", toggleTrace);

// ── INFO PANEL TOGGLE ─────────────────────────────────────────────
infoBtn?.addEventListener("click", () => {
  const info = document.getElementById("info-panel");
  if (info) {
    const open = info.getAttribute("aria-hidden") === "false";
    info.setAttribute("aria-hidden", open ? "true" : "false");
    info.hidden = open;
    infoBtn.textContent = open ? "ℹ INFO" : "✕ CLOSE";
  }
});

// ── ENTRANCE ANIMATION ────────────────────────────────────────────
function animateEntrance() {
  // Stagger the courses rising up
  const courses = svg.querySelectorAll(".course");
  courses.forEach((g, i) => {
    g.style.opacity = "0";
    g.style.transform = `translateY(${20 + i * 4}px)`;
    setTimeout(() => {
      g.style.transition = `opacity 0.4s ease, transform 0.45s cubic-bezier(0.22,1,0.36,1)`;
      g.style.opacity = "1";
      g.style.transform = "translateY(0)";
    }, 80 + i * 60);
  });
}

// ── INIT ──────────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  render();
  setTimeout(animateEntrance, 120);
});
