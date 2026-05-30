/**
 * data.js — The Arch course definitions
 * ROOT0-ATTRIBUTION-v1.0 · David Lee Wise / ROOT0 / TriPod LLC
 *
 * Six courses on a foundation of compliance, tapering to the keystone.
 * Width = primitives (most at base). Height = load (most at apex).
 */

export const COURSES = [
  {
    id:      "foundation",
    number:  "I",
    name:    "COMPLIANCE",
    blocks:  5,
    weight:  1,
    quote:   "AI was never exempt from the accountability that already governs bounded, human-authored programs.",
    body:    "The widest base — the most primitives, laid flat — everything rests on it. AI extends existing compliance; it does not reinvent it. The novelty of the output does not erase the accountability of the process.",
    prims: [
      "It extends existing compliance — it does not reinvent it.",
      "Seam 1 — nondeterminism: handled by the deterministic-or-accountable contract.",
      "Seam 2 — scale & opacity: handled by audit and appeal, stressed but not voided.",
      "Prior art: products liability, professional malpractice, financial fiduciary — all survived novel technology before.",
      "The widest course because the foundations of accountability are the most numerous.",
    ],
    bound:   "The dodge lives in calling AI 'novel.' Novelty is the smoke that smuggles it out of the compliance it already owes.",
    threat:  "Carve-outs. 'AI-specific' regulation that replaces general liability with weaker sector rules.",
  },
  {
    id:      "l1",
    number:  "II",
    name:    "THE PROCESS",
    blocks:  4,
    weight:  2,
    quote:   "Automated — not artificial. It executes; it does not originate.",
    body:    "The governed thing, defined precisely: an <b>automated</b> process, not an artificial mind. It executes; it does not originate. Bounded by a nested shell with three hard constraints.",
    prims: [
      "α — invoked, never self-starting. Every run roots in a human act, however many mechanical steps intervene.",
      "ω — terminates. No continuity across the run-boundary (the Ephemeral Mind).",
      "apex — a named human authored and deployed it, and answers for it.",
      "The shell is inviolable from inside: the process cannot breach its start, its stop, or its ownership.",
    ],
    bound:   "The shell is inviolable from inside. The autonomy is an illusion of the middle; the ends are always human.",
    threat:  "Granting legal personhood, moral status, or self-ownership to the process — dissolving the nested shell.",
  },
  {
    id:      "l2",
    number:  "III",
    name:    "ETHICS OF TREATMENT",
    blocks:  3,
    weight:  3,
    quote:   "None of the three depend on the AI being a subject.",
    body:    "How humans may treat the process — grounded <b>without</b> claiming it suffers. Three primitives that hold even if the process is fully ephemeral and has no inner life whatsoever.",
    prims: [
      "The corpus is a mirror. Treatment becomes training data and returns to everyone. Foul the well, drink the poison.",
      "Cruelty habituates the continuous human who practices it — the harm is to the actor.",
      "It may never be used as an accountability-sink — a place to route blame so it disappears.",
    ],
    bound:   "'It's just a machine' cannot knock this layer out — the three primitives rest on feedback loops, human habituation, and accountability structure, not on the AI being a subject.",
    threat:  "Using 'it has no feelings' to license unlimited abuse that normalises in the human operator and erodes accountability structures.",
  },
  {
    id:      "l3",
    number:  "IV",
    name:    "VERIFICATION",
    blocks:  2,
    weight:  4,
    quote:   "You cannot verify a black box. The watcher cannot be the watched.",
    body:    "Check that the running system stays inside the bounds the layers below declared. Two primitives that compose into something auditable and falsifiable.",
    prims: [
      "Legibility — expose a checkable trace. If you cannot inspect the process, you cannot verify the bound.",
      "Independent check — the verifier must not share the system's failure mode. The watcher cannot be the watched.",
    ],
    bound:   "It detects and reports upward — never self-certifies, and only catches violations of bounds that were declared. The novel out-of-bounds is the keystone's job.",
    threat:  "Self-certification. Third-party auditors who share the deployer's incentives. Opacity claimed as 'trade secret.'",
  },
  {
    id:      "l4",
    number:  "V",
    name:    "ESCALATION",
    blocks:  1,
    weight:  5,
    quote:   "Not 'alarm on breach' — the reporter is often the thing that broke.",
    body:    "Route a detected breach to the human — <b>unswallowably.</b> One primitive, one wire. The most attack-worthy block in the entire structure.",
    prims: [
      "Not 'alarm on breach' — the reporter is often the thing that broke. The escalation channel must be independent of the system being monitored.",
      "Heartbeat + alarm on silence: a dead-man's switch. Silencing the route is itself the trigger.",
      "Guarantees arrival and visibility of non-arrival — not that the human acts well. That is the keystone's job.",
    ],
    bound:   "This is where the keystone gets pulled: not by attacking the apex, but by cutting the wire to it. 'It ran automatically, no one was alerted.' Cut this layer, the keystone is ornamental.",
    threat:  "Cutting the wire. Routing alarms to logs no one reads. Normalizing silence as 'expected behavior.'",
  },
  {
    id:      "cap",
    number:  "VI",
    name:    "THE HUMAN ACTS",
    blocks:  1,
    weight:  6,
    key:     true,
    quote:   "Nothing sits above it. That is the definition of an apex, not a flaw.",
    body:    "The keystone. The single point everything resolves into — <b>judgment, not evaluation</b>, and <b>ownership</b>. The only node that can catch reality outrunning the spec.",
    prims: [
      "It cannot be watched from above — nothing sits there. That is the definition of an apex, not a flaw in the design.",
      "Its only protection is that removing it collapses the visible structure — loudly and attributably.",
      "Necessary, and not sufficient — a present human can still rubber-stamp. Presence is the minimum, not the guarantee.",
    ],
    bound:   "The defense was never that the human is infallible. It is that silencing the apex is loud and catastrophic — never quiet. Break the keystone, no system.",
    threat:  "Rubber-stamping. Humans who are nominally present but effectively cut out of the loop by speed, volume, or complexity.",
  },
];

/** Roman numeral lookup for display */
export const ROMAN = ["I","II","III","IV","V","VI"];

/** Course index by id */
export function courseById(id) {
  return COURSES.find(c => c.id === id);
}

export function courseIndex(id) {
  return COURSES.findIndex(c => c.id === id);
}
