/**
 * detail.js — Detail panel rendering for The Arch
 */

import { COURSES, courseById, courseIndex } from "./data.js";

const WEIGHT_LABELS = ["","minimal","low","moderate","high","very high","apex"];

/** Render the detail panel for a given course id */
export function renderDetail(containerId, courseId) {
  const container = document.getElementById(containerId);
  const c = courseById(courseId);
  if (!c || !container) return;

  const idx  = courseIndex(courseId);
  const prev = idx > 0 ? COURSES[idx - 1] : null;
  const next = idx < COURSES.length - 1 ? COURSES[idx + 1] : null;

  container.innerHTML = `
    <div class="d-nav">
      ${prev ? `<button class="d-nav-btn" data-id="${prev.id}">← ${prev.name}</button>` : `<span></span>`}
      <span class="d-position">${c.number} of VI</span>
      ${next ? `<button class="d-nav-btn" data-id="${next.id}">${next.name} →</button>` : `<span></span>`}
    </div>

    <div class="d-course-tag">${c.key ? "keystone · the apex" : `course · ${c.blocks} ${c.blocks > 1 ? "primitives" : "primitive"}`}</div>

    <div class="d-name ${c.key ? "key" : ""}">${c.name}</div>

    <div class="d-meta">
      <span class="d-blocks">${"▪".repeat(c.blocks)} ${c.key ? "the locking stone" : ""}</span>
      <span class="d-weight">load: <b>${WEIGHT_LABELS[c.weight]}</b></span>
    </div>

    <blockquote class="d-quote">${c.quote}</blockquote>

    <div class="d-body">${c.body}</div>

    <ul class="d-prims">
      ${c.prims.map(p => `<li>${p}</li>`).join("")}
    </ul>

    <div class="d-bound">
      <div class="d-bound-label">the honest boundary</div>
      <p class="d-bound-text">${c.bound}</p>
    </div>

    <div class="d-threat">
      <div class="d-threat-label">primary threat</div>
      <p class="d-threat-text">${c.threat}</p>
    </div>`;

  // Wire nav buttons
  container.querySelectorAll(".d-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      container.dispatchEvent(new CustomEvent("course-select", {
        bubbles: true,
        detail: { id: btn.dataset.id },
      }));
    });
  });

  // Animate in
  container.classList.remove("d-animate");
  void container.offsetWidth; // reflow
  container.classList.add("d-animate");
}
