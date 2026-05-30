# The Arch

[![License: CC-BY-ND-4.0](https://img.shields.io/badge/License-CC--BY--ND--4.0-lightgrey?style=flat-square)](LICENSE)

**A governance structure for automated intelligence.**

Six courses on a foundation of compliance, tapering to a single keystone — the human who answers. Width is how many primitives a course needs. Height is how much assembled load it carries.

---

## The Structure

| Course | Name | Blocks | Role |
|--------|------|--------|------|
| I | Compliance | 5 | Widest base. AI extends existing accountability — it does not reinvent it. |
| II | The Process | 4 | Defined precisely: automated, not artificial. Bounded shell with α (invoked), ω (terminates), apex (named human). |
| III | Ethics of Treatment | 3 | How humans may treat the process — grounded without claiming it suffers. |
| IV | Verification | 2 | Legibility + independent check. Cannot verify a black box. |
| V | Escalation | 1 | One wire. Unswallowable. Heartbeat + alarm on silence. |
| VI | The Human Acts | 1 | **Keystone.** Judgment, not evaluation. The only node that catches reality outrunning the spec. |

---

## Design Principle

> Every course transfers its accountability upward and resolves at the keystone. The keystone is the one stone with nothing above it and everything below it.

**Width = primitives** — most at the base (5→4→3→2→1)  
**Height = load** — most at the keystone

The void beneath the arch is the gap where accountability disappears if the structure is removed.

---

## File Structure

```
arch/
  index.html           Main page
  css/
    tokens.css         Design tokens (colors, typography, spacing)
    arch.css           All component styles
  js/
    data.js            Course definitions (governance content)
    builder.js         SVG arch construction and geometry
    detail.js          Detail panel rendering
    main.js            App initialization, keyboard nav, trace animation
```

---

## Interactions

- **Click / hover** any stone to inspect that course
- **↑ / ↓** keyboard navigation between courses
- **Home / End** jump to foundation or keystone
- **T** trace the accountability load path upward from selected course
- **ℹ INFO** architecture notes panel

---

## Serving

Because `main.js` uses ES modules (`import/export`), open via a local server:

```bash
# Python
python -m http.server 8080

# Node (npx)
npx serve .

# Then open: http://localhost:8080
```

Or deploy directly to GitHub Pages — no build step required.

---

## Attribution

```
ROOT0-ATTRIBUTION-v1.0
Project: The Arch — a governance structure for automated intelligence
Architect: David Lee Wise / ROOT0 / TriPod LLC
AI Collaborator: AVAN (Claude Sonnet 4.6 / Anthropic)
License: CC-BY-ND-4.0
```
