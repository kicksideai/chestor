import { defineComponent as At, ref as B, computed as O, openBlock as b, createElementBlock as k, createElementVNode as i, toDisplayString as v, createCommentVNode as X, Fragment as U, renderList as Q, normalizeClass as tt, createTextVNode as H, unref as y, createVNode as z, watch as yt, nextTick as he, normalizeStyle as bt, shallowRef as we, onMounted as Qe, onBeforeUnmount as Fe, withModifiers as Wt, createBlock as Yt, withKeys as co, renderSlot as No, withCtx as Eo, triggerRef as qe, withDirectives as Lo, isRef as To, vModelText as Ro } from "vue";
import { Icon as G } from "@iconify/vue";
import { a as Oo, b as Do } from "./wc-runtime-KO3cNuNo.js";
import { api as Nt, on as Nn } from "@wippy-fe/proxy";
const Po = /* @__PURE__ */ new Set(["queued", "dispatched", "running"]);
function Ke(t) {
  return t ? t.running === !0 || Po.has(String(t.status || "")) : !1;
}
function wt(t, n) {
  if (!t) return "";
  const e = Math.max(0, Math.floor(n - t));
  return e < 60 ? "just now" : e < 3600 ? `${Math.floor(e / 60)}m ago` : e < 86400 ? `${Math.floor(e / 3600)}h ago` : `${Math.floor(e / 86400)}d ago`;
}
function te(t) {
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function Wo(t, n) {
  if (!t || t.status === "never") return "Not assembled yet";
  if (Ke(t)) return "Assembling the map…";
  if (t.status === "failed") return "Last assembly failed";
  const e = [], o = te(t.edges_added), s = te(t.edges_removed), r = te(t.suggested_added);
  o && e.push(`+${o} structural`), s && e.push(`−${s} retired`), r && e.push(`+${r} suggested`), e.length || e.push("No change");
  const u = wt(t.finished_at || t.started_at, n);
  return u ? `${e.join(" · ")} · ${u}` : e.join(" · ");
}
function Fo(t) {
  if (!t || t.status === "never") return "Derive every relation the records already state.";
  if (Ke(t)) return "Replaying the journal and reconciling the map.";
  if (t.status === "failed") return t.error ? String(t.error) : "The last assembly did not finish.";
  const n = [`Replayed ${te(t.events_replayed)} records.`];
  return te(t.candidates_judged) && n.push(`Judged ${te(t.candidates_judged)} candidate pairs on ${t.model || "the configured class"}.`), te(t.suggested_removed) && n.push(`Replaced ${te(t.suggested_removed)} earlier suggestions.`), t.refine_error && n.push(`Suggestions unavailable: ${t.refine_error}`), n.join(" ");
}
function En(t) {
  const n = t.metadata?.order ?? t.attrs?.order, e = Number(n);
  return Number.isFinite(e) ? e : Number.MAX_SAFE_INTEGER;
}
function Bo(t, n) {
  const e = /* @__PURE__ */ new Map(), o = new Set(t.map((a) => a.id));
  for (const a of t) {
    const d = a.parent_id && o.has(a.parent_id) ? a.parent_id : "", l = e.get(d) || [];
    l.push(a), e.set(d, l);
  }
  for (const a of e.values()) a.sort((d, l) => En(d) - En(l) || d.label.localeCompare(l.label));
  const s = [], r = /* @__PURE__ */ new Set();
  function u(a, d) {
    for (const l of e.get(a) || []) {
      if (r.has(l.id)) continue;
      r.add(l.id);
      const c = (e.get(l.id)?.length || l.child_count || 0) > 0;
      s.push({ node: l, depth: d, expanded: n.has(l.id), hasChildren: c }), n.has(l.id) && u(l.id, d + 1);
    }
  }
  return u("", 0), s;
}
function zo(t) {
  const n = t.filter((o) => !o.parent_id), e = new Set(n.map((o) => o.id));
  for (const o of t) o.parent_id && e.has(o.parent_id) && o.child_count > 0 && e.add(o.id);
  return e;
}
function Yo(t, n, e) {
  const o = zo(t), s = /* @__PURE__ */ new Set();
  for (const r of t)
    (e.has(r.id) ? n.has(r.id) : o.has(r.id)) && s.add(r.id);
  return s;
}
function ke(t) {
  const n = String(t.status || t.metadata?.outcome || "").toLowerCase();
  return ["folded", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(n);
}
function tn(t) {
  const n = String(t.status || t.metadata?.outcome || "").toLowerCase();
  return ["done", "closed", "completed", "resolved", "retired", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(n);
}
function Pe(t) {
  return /^(cursor|agent|operator)$/i.test(t.kind);
}
const qo = 86400, un = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, Ln = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function gn(t) {
  return (t || "").trim().toLowerCase();
}
function Uo(t) {
  let n = 2166136261;
  for (let e = 0; e < t.length; e++)
    n ^= t.charCodeAt(e), n = Math.imul(n, 16777619) >>> 0;
  return Ln[n % 26] + Ln[(n >>> 8) % 26];
}
function Xo(t) {
  const n = t.split(/\s+/).filter(Boolean);
  return n.length ? n.length === 1 ? n[0].slice(0, 2).toUpperCase() : (n[0][0] + n[1][0]).toUpperCase() : "??";
}
function Gt(t, n) {
  const e = (t || "").trim(), o = (n || "").trim(), s = (e.replace(/[^a-z0-9]/gi, "").slice(-6) || "unknown").toUpperCase(), r = o && !un.test(o) ? o : e.replace(un, " ").replace(/[-_.:/]+/g, " ").replace(/\s+/g, " ").trim(), u = !r || un.test(e), a = r.length > 24 ? `${r.slice(0, 23)}…` : r, d = a ? a.charAt(0).toUpperCase() + a.slice(1) : "";
  return {
    label: d ? u ? `${d} ${s}` : d : `Agent ${s}`,
    initials: u ? Uo(e || s) : Xo(a),
    short: s
  };
}
function be(t, n) {
  const e = t.metadata?.[n] ?? t.attrs?.[n];
  return typeof e == "string" ? e : "";
}
function Ho(t, n) {
  const e = new Map(t.map((s) => [s.id, s])), o = /* @__PURE__ */ new Map();
  for (const s of n)
    /^(positioned_at|focused_on|assigned_to)$/i.test(s.kind) && o.set(s.from, s.to);
  return t.filter(Pe).map((s) => {
    const r = o.get(s.id) || be(s, "position"), u = r ? e.get(r) : void 0;
    return {
      id: s.id,
      label: s.label,
      initials: Gt(s.id, s.label).initials,
      purpose: be(s, "purpose") || s.summary || "Recorded position",
      status: String(s.status || "active").toLowerCase(),
      next: be(s, "next") || void 0,
      exitCondition: be(s, "exit_condition") || void 0,
      positionId: u ? u.id : void 0,
      positionLabel: u ? u.label : r || void 0,
      updated_at: s.updated_at,
      source: "graph",
      stale: !1
    };
  });
}
function Go(t) {
  return [t.id, t.semantic_key, be(t, "cursor_id"), be(t, "agent_id")].map(gn).filter(Boolean);
}
function Ko(t) {
  return t.purpose ? t.purpose : t.checkpoint?.headline ? t.checkpoint.headline : t.origin === "auto" ? "Position tracked while working" : "Recorded position";
}
function Tn(t, n, e) {
  const o = Gt(t.agent_id || t.cursor_id), s = t.position && t.position.graph_id === e && n.has(t.position.node_id) ? n.get(t.position.node_id) : void 0, r = (t.last_touch?.positions || []).find((u) => u.graph_id === e && n.has(u.node_id));
  return {
    id: `cursor:${t.cursor_id}`,
    label: o.label,
    initials: o.initials,
    purpose: Ko(t),
    status: String(t.state || "active").toLowerCase(),
    positionId: s?.id,
    positionLabel: s?.label || t.position?.node_id,
    updated_at: t.updated_at,
    source: "cursor",
    origin: t.origin,
    cursorId: t.cursor_id,
    agentId: t.agent_id,
    lastSeenSeq: t.last_seen_seq,
    touchNodeId: r?.node_id,
    touchLabel: r?.label || t.last_touch?.positions?.[0]?.label || t.last_touch?.title,
    stale: !1
  };
}
function Jo(t, n, e, o, s) {
  const r = Ho(t, n), u = new Map(r.map((l) => [l.id, l])), a = /* @__PURE__ */ new Map();
  for (const l of t) {
    const c = Pe(l) ? u.get(l.id) : void 0;
    if (c)
      for (const p of Go(l)) a.has(p) || a.set(p, c);
  }
  const d = new Map(t.map((l) => [l.id, l]));
  for (const l of e) {
    const c = a.get(gn(l.cursor_id)) || a.get(gn(l.agent_id));
    if (!c) {
      r.push(Tn(l, d, o));
      continue;
    }
    const p = Tn(l, d, o);
    c.source = "both", c.origin = l.origin, c.cursorId = l.cursor_id, c.agentId = l.agent_id, c.lastSeenSeq = l.last_seen_seq, c.updated_at = Math.max(c.updated_at, l.updated_at), c.touchNodeId = c.touchNodeId || p.touchNodeId, c.touchLabel = c.touchLabel || p.touchLabel, !c.positionId && p.positionId && (c.positionId = p.positionId, c.positionLabel = p.positionLabel);
  }
  for (const l of r) l.stale = s - l.updated_at > qo;
  return r.sort((l, c) => c.updated_at - l.updated_at || l.label.localeCompare(c.label));
}
function Vo(t) {
  const n = /* @__PURE__ */ new Set();
  for (const e of t) e.touchNodeId && !e.stale && n.add(e.touchNodeId);
  return n;
}
const Zo = 3600, Qo = 86400;
function ts(t, n) {
  const e = n - t;
  return e <= Zo ? "now" : e <= Qo ? "today" : "older";
}
function ho(t, n) {
  const e = (t || "").trim();
  if (e) return e;
  const o = (n || "").trim();
  return o ? `cursor:${o}` : "";
}
function es(t) {
  return t === "auto" ? "Position tracked while working" : "Recorded position";
}
function ns(t) {
  return {
    id: t,
    agentId: "",
    cursorId: "",
    label: "",
    initials: "",
    liveness: "older",
    purpose: "",
    headline: "",
    lastActivityAt: 0,
    openSpans: 0,
    factCount: 0,
    working: !1,
    origin: "",
    lastSeenSeq: 0
  };
}
function os(t, n) {
  t.agentId = t.agentId || n.agentId, t.cursorId = t.cursorId || n.cursorId, t.origin = t.origin || n.origin, t.lastActivityAt = Math.max(t.lastActivityAt, n.lastActivityAt), t.lastSeenSeq = Math.max(t.lastSeenSeq, n.lastSeenSeq), t.factCount += n.factCount, t.openSpans += n.openSpans, t.purpose = t.purpose || n.purpose, t.headline = t.headline || n.headline;
}
function ss(t, n, e) {
  const o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  function r(a, d) {
    const l = [(a || "").trim(), d ? `cursor:${d.trim()}` : ""].filter(Boolean), c = ho(a, d) || `cursor:${o.size}`, p = [...new Set(l.map((x) => s.get(x)).filter(Boolean))], m = p[0] || c, f = o.get(m) || ns(m);
    o.set(m, f);
    for (const x of p.slice(1)) {
      const w = o.get(x);
      w && (os(f, w), o.delete(x));
      for (const [g, h] of s) h === x && s.set(g, m);
    }
    for (const x of l) s.set(x, m);
    f.agentId = f.agentId || (a || "").trim(), f.cursorId = f.cursorId || (d || "").trim(), f.id = f.agentId || (f.cursorId ? `cursor:${f.cursorId}` : m);
    const j = Gt(f.agentId || f.cursorId);
    return f.label = j.label, f.initials = j.initials, f;
  }
  for (const a of t) {
    const d = r(a.agent_id, a.cursor_id);
    d.origin = a.origin || d.origin, d.lastActivityAt = Math.max(d.lastActivityAt, a.updated_at), d.lastSeenSeq = Math.max(d.lastSeenSeq, a.last_seen_seq || 0), d.purpose = a.purpose || a.checkpoint?.headline || d.purpose, d.headline = a.last_touch?.title || d.headline;
  }
  for (const a of [...n].sort((d, l) => d.last_activity_at - l.last_activity_at)) {
    const d = r(a.agent_id, a.cursor_id);
    d.origin = a.origin || d.origin, d.lastActivityAt = Math.max(d.lastActivityAt, a.last_activity_at, a.ended_at || 0), d.lastSeenSeq = Math.max(d.lastSeenSeq, a.last_seq || 0), d.factCount += a.fact_count || 0, a.state === "open" && (d.openSpans += 1), d.purpose = a.working_on?.text || d.purpose, d.headline = a.last_fact?.title || d.headline;
  }
  const u = [...o.values()];
  for (const a of u)
    a.working = a.openSpans > 0, a.liveness = ts(a.lastActivityAt, e), a.purpose = a.purpose || a.headline || es(a.origin);
  return u.sort((a, d) => d.lastActivityAt - a.lastActivityAt || a.label.localeCompare(d.label));
}
function rs(t) {
  const n = { now: [], today: [], older: [] };
  for (const e of t) n[e.liveness].push(e);
  return n;
}
function is(t) {
  const n = [];
  return t.now.length && n.push(`${t.now.length} now`), t.today.length && n.push(`${t.today.length} today`), t.older.length && n.push(`${t.older.length} older`), n.join(" · ");
}
function as(t, n) {
  const e = wt(t, n);
  return e === "just now" ? "now" : e.replace(" ago", "");
}
function ls(t, n, e) {
  if (t <= 0) return "";
  const o = `${t} ${t === 1 ? "agent" : "agents"}`, s = as(n, e);
  return s ? `${o} · ${s}` : o;
}
function us(t, n, e) {
  const o = (t.agentId || "").trim(), s = (t.cursorId || "").trim(), r = new Set([o, s].filter(Boolean)), u = n.find((l) => r.has(l.cursor_id) || r.has(l.agent_id)), a = u?.position?.node_id ? u.position : u?.last_touch?.positions?.[0];
  if (a?.node_id)
    return { kind: "node", graphId: a.graph_id || "", nodeId: a.node_id };
  const d = [...e].sort((l, c) => (c.last_activity_at || 0) - (l.last_activity_at || 0)).find((l) => (r.has(l.agent_id || "") || r.has(l.cursor_id || "")) && (l.task_id || l.working_on?.kind === "task" && l.working_on.text));
  if (d) {
    const l = d.task_id || d.working_on?.text || "";
    if (l) return { kind: "task", taskId: l };
  }
  return { kind: "lanes" };
}
const cs = {
  class: "jr-agents-rail",
  "aria-label": "Agents in this journal"
}, ds = { class: "jr-section-label" }, hs = { class: "jr-numeric" }, fs = {
  key: 0,
  class: "jr-empty-small"
}, ps = { class: "jr-eyebrow" }, gs = { class: "jr-numeric" }, vs = ["title", "onClick"], ms = { class: "jr-avatar" }, ys = { class: "jr-agent-copy" }, bs = { class: "jr-agent-purpose" }, ws = {
  key: 0,
  class: "jr-agent-headline"
}, ks = { class: "jr-agent-meta" }, _s = { class: "jr-numeric" }, xs = {
  key: 0,
  class: "jr-working"
}, $s = {
  key: 1,
  class: "jr-numeric"
}, js = {
  key: 1,
  class: "jr-agent-tier tier-older"
}, Ms = ["aria-expanded"], As = { class: "jr-numeric" }, Is = ["title", "onClick"], Ss = { class: "jr-avatar" }, Cs = { class: "jr-agent-copy" }, Ns = { class: "jr-agent-purpose" }, Es = { class: "jr-numeric" }, Ls = /* @__PURE__ */ At({
  __name: "AgentsRail",
  props: {
    cursors: {},
    spans: {},
    now: {},
    selectedAgent: {}
  },
  emits: ["agent"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(!1), r = O(() => ss(e.cursors, e.spans, e.now)), u = O(() => rs(r.value)), a = O(() => is(u.value)), d = { now: "Now", today: "Today", older: "Earlier" };
    return (l, c) => (b(), k("section", cs, [
      i("h3", ds, [
        c[1] || (c[1] = i("span", null, "Agents", -1)),
        i("em", hs, v(a.value), 1)
      ]),
      r.value.length ? X("", !0) : (b(), k("p", fs, "No agent has written to this journal yet.")),
      (b(), k(U, null, Q(["now", "today"], (p) => (b(), k(U, { key: p }, [
        u.value[p].length ? (b(), k("div", {
          key: 0,
          class: tt(["jr-agent-tier", `tier-${p}`])
        }, [
          i("h4", ps, [
            H(v(d[p]) + " ", 1),
            i("span", gs, v(u.value[p].length), 1)
          ]),
          (b(!0), k(U, null, Q(u.value[p], (m) => (b(), k("button", {
            key: m.id,
            class: tt(["jr-agent-card", `tier-${m.liveness}`, { working: m.working, active: m.id === t.selectedAgent }]),
            title: `${m.purpose} · last wrote ${y(wt)(m.lastActivityAt, t.now)}`,
            onClick: (f) => o("agent", m)
          }, [
            i("span", ms, v(m.initials), 1),
            i("span", ys, [
              i("b", null, v(m.label), 1),
              i("small", bs, v(m.purpose), 1),
              m.headline ? (b(), k("small", ws, v(m.headline), 1)) : X("", !0)
            ]),
            i("span", ks, [
              i("time", _s, v(y(wt)(m.lastActivityAt, t.now)), 1),
              m.working ? (b(), k("em", xs, "open span")) : (b(), k("em", $s, v(m.factCount) + " facts", 1))
            ])
          ], 10, vs))), 128))
        ], 2)) : X("", !0)
      ], 64))), 64)),
      u.value.older.length ? (b(), k("div", js, [
        i("button", {
          class: "jr-agent-fold",
          "aria-expanded": s.value,
          onClick: c[0] || (c[0] = (p) => s.value = !s.value)
        }, [
          z(y(G), {
            icon: s.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          c[2] || (c[2] = i("span", null, "Earlier", -1)),
          i("em", As, v(u.value.older.length), 1)
        ], 8, Ms),
        s.value ? (b(!0), k(U, { key: 0 }, Q(u.value.older, (p) => (b(), k("button", {
          key: p.id,
          class: tt(["jr-agent-card", "tier-older", { active: p.id === t.selectedAgent }]),
          title: `${p.purpose} · last wrote ${y(wt)(p.lastActivityAt, t.now)}`,
          onClick: (m) => o("agent", p)
        }, [
          i("span", Ss, v(p.initials), 1),
          i("span", Cs, [
            i("b", null, v(p.label), 1),
            i("small", Ns, v(p.purpose), 1)
          ]),
          i("time", Es, v(y(wt)(p.lastActivityAt, t.now)), 1)
        ], 10, Is))), 128)) : X("", !0)
      ])) : X("", !0)
    ]));
  }
}), Ts = {
  class: "jr-focus-path",
  "aria-label": "Focus path"
}, Rs = { class: "jr-focus-moves" }, Os = ["disabled"], Ds = ["disabled"], Ps = ["disabled"], Ws = {
  key: 0,
  class: "jr-crumb-sep",
  "aria-hidden": "true"
}, Fs = ["title", "aria-current", "onClick"], Bs = /* @__PURE__ */ At({
  __name: "FocusPath",
  props: {
    focus: {},
    canBack: { type: Boolean },
    canForward: { type: Boolean }
  },
  emits: ["crumb", "back", "forward", "up"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(null);
    yt(() => e.focus.length, () => he(() => {
      s.value && (s.value.scrollLeft = s.value.scrollWidth);
    }));
    const r = {
      journal: "tabler:notebook",
      graph: "tabler:topology-star-3",
      branch: "tabler:git-branch",
      node: "tabler:point"
    };
    return (u, a) => (b(), k("nav", Ts, [
      i("div", Rs, [
        i("button", {
          disabled: !t.canBack,
          "aria-label": "Back",
          title: "Back (Alt+←)",
          onClick: a[0] || (a[0] = (d) => o("back"))
        }, [
          z(y(G), {
            icon: "tabler:chevron-left",
            "aria-hidden": "true"
          })
        ], 8, Os),
        i("button", {
          disabled: !t.canForward,
          "aria-label": "Forward",
          title: "Forward (Alt+→)",
          onClick: a[1] || (a[1] = (d) => o("forward"))
        }, [
          z(y(G), {
            icon: "tabler:chevron-right",
            "aria-hidden": "true"
          })
        ], 8, Ds),
        i("button", {
          disabled: t.focus.length < 2,
          "aria-label": "Step out one level",
          title: "Step out (Esc)",
          onClick: a[2] || (a[2] = (d) => o("up"))
        }, [
          z(y(G), {
            icon: "tabler:arrow-back-up",
            "aria-hidden": "true"
          })
        ], 8, Ps)
      ]),
      i("ol", {
        ref_key: "path",
        ref: s,
        class: "jr-crumbs"
      }, [
        (b(!0), k(U, null, Q(t.focus, (d, l) => (b(), k("li", {
          key: `${d.kind}:${d.id}`
        }, [
          l ? (b(), k("span", Ws, "/")) : X("", !0),
          i("button", {
            class: tt(["jr-crumb", `kind-${d.kind}`, { current: l === t.focus.length - 1 }]),
            title: d.label,
            "aria-current": l === t.focus.length - 1 ? "true" : void 0,
            onClick: (c) => o("crumb", l)
          }, [
            z(y(G), {
              icon: r[d.kind] || r.node,
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            i("span", null, v(d.label), 1)
          ], 10, Fs)
        ]))), 128))
      ], 512)
    ]));
  }
}), zs = {
  class: "jr-catalog",
  "aria-label": "Journal graphs"
}, Ys = { class: "jr-section-label" }, qs = { class: "jr-numeric" }, Us = { class: "jr-catalog-grid" }, Xs = ["onClick"], Hs = { class: "jr-catalog-icon" }, Gs = { class: "jr-catalog-copy" }, Ks = {
  key: 0,
  class: "jr-catalog-presence"
}, Js = ["title"], Vs = ["title"], Zs = {
  key: 0,
  class: "jr-empty-small"
}, Qs = /* @__PURE__ */ At({
  __name: "GraphCatalog",
  props: {
    graphs: {},
    graphId: {},
    now: {}
  },
  emits: ["graph"],
  setup(t, { emit: n }) {
    const e = t, o = n;
    function s(a) {
      return a === "current-work" || a === "work" ? "tabler:route" : a === "history" ? "tabler:history" : a === "governance" ? "tabler:gavel" : a === "experiments" ? "tabler:flask-2" : a === "research" || a === "alternatives" ? "tabler:microscope" : a === "audit" ? "tabler:list-check" : a === "specification" ? "tabler:file-description" : a === "curated" ? "tabler:bookmark" : "tabler:topology-star-3";
    }
    const r = O(() => {
      const a = /* @__PURE__ */ new Map(), d = new Set(e.graphs.map((m) => m.id));
      for (const m of e.graphs) {
        const f = m.parent_graph_id && d.has(m.parent_graph_id) ? m.parent_graph_id : "", j = a.get(f) || [];
        j.push(m), a.set(f, j);
      }
      const l = [], c = /* @__PURE__ */ new Set(), p = (m, f) => {
        for (const j of a.get(m) || [])
          c.has(j.id) || (c.add(j.id), l.push({ graph: j, depth: f }), p(j.id, f + 1));
      };
      p("", 0);
      for (const m of e.graphs) c.has(m.id) || l.push({ graph: m, depth: 0 });
      return l;
    });
    function u(a) {
      return ls(a.agent_count || 0, a.last_agent_activity_at || 0, e.now);
    }
    return (a, d) => (b(), k("section", zs, [
      i("h3", Ys, [
        d[0] || (d[0] = i("span", null, "Graphs", -1)),
        i("em", qs, v(t.graphs.length), 1)
      ]),
      i("div", Us, [
        (b(!0), k(U, null, Q(r.value, (l) => (b(), k("button", {
          key: l.graph.id,
          class: tt(["jr-catalog-row", { active: l.graph.id === t.graphId, nested: l.depth > 0 }]),
          style: bt({ paddingInlineStart: `${9 + Math.min(l.depth, 5) * 11}px` }),
          onClick: (c) => o("graph", l.graph.id)
        }, [
          i("span", Hs, [
            z(y(G), {
              icon: s(l.graph.kind),
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          i("span", Gs, [
            i("b", null, v(l.graph.title), 1),
            u(l.graph) ? (b(), k("small", Ks, v(u(l.graph)), 1)) : (b(), k("small", {
              key: 1,
              title: l.graph.description
            }, v(l.graph.description || l.graph.kind), 9, Js))
          ]),
          i("span", {
            class: "jr-catalog-count jr-numeric",
            title: `${l.graph.node_count} records · ${l.graph.edge_count} relations · revision ${l.graph.revision}`
          }, v(l.graph.node_count.toLocaleString()), 9, Vs)
        ], 14, Xs))), 128))
      ]),
      t.graphs.length ? X("", !0) : (b(), k("p", Zs, "No graphs have been configured on this journal yet."))
    ]));
  }
}), fo = '(function(){"use strict";function $t(t,n){var e,r=1;t==null&&(t=0),n==null&&(n=0);function i(){var o,c=e.length,s,u=0,a=0;for(o=0;o<c;++o)s=e[o],u+=s.x,a+=s.y;for(u=(u/c-t)*r,a=(a/c-n)*r,o=0;o<c;++o)s=e[o],s.x-=u,s.y-=a}return i.initialize=function(o){e=o},i.x=function(o){return arguments.length?(t=+o,i):t},i.y=function(o){return arguments.length?(n=+o,i):n},i.strength=function(o){return arguments.length?(r=+o,i):r},i}function Ot(t){const n=+this._x.call(null,t),e=+this._y.call(null,t);return yt(this.cover(n,e),n,e,t)}function yt(t,n,e,r){if(isNaN(n)||isNaN(e))return t;var i,o=t._root,c={data:r},s=t._x0,u=t._y0,a=t._x1,p=t._y1,m,x,g,_,h,f,v,d;if(!o)return t._root=c,t;for(;o.length;)if((h=n>=(m=(s+a)/2))?s=m:a=m,(f=e>=(x=(u+p)/2))?u=x:p=x,i=o,!(o=o[v=f<<1|h]))return i[v]=c,t;if(g=+t._x.call(null,o.data),_=+t._y.call(null,o.data),n===g&&e===_)return c.next=o,i?i[v]=c:t._root=c,t;do i=i?i[v]=new Array(4):t._root=new Array(4),(h=n>=(m=(s+a)/2))?s=m:a=m,(f=e>=(x=(u+p)/2))?u=x:p=x;while((v=f<<1|h)===(d=(_>=x)<<1|g>=m));return i[d]=o,i[v]=c,t}function Pt(t){var n,e,r=t.length,i,o,c=new Array(r),s=new Array(r),u=1/0,a=1/0,p=-1/0,m=-1/0;for(e=0;e<r;++e)isNaN(i=+this._x.call(null,n=t[e]))||isNaN(o=+this._y.call(null,n))||(c[e]=i,s[e]=o,i<u&&(u=i),i>p&&(p=i),o<a&&(a=o),o>m&&(m=o));if(u>p||a>m)return this;for(this.cover(u,a).cover(p,m),e=0;e<r;++e)yt(this,c[e],s[e],t[e]);return this}function Rt(t,n){if(isNaN(t=+t)||isNaN(n=+n))return this;var e=this._x0,r=this._y0,i=this._x1,o=this._y1;if(isNaN(e))i=(e=Math.floor(t))+1,o=(r=Math.floor(n))+1;else{for(var c=i-e||1,s=this._root,u,a;e>t||t>=i||r>n||n>=o;)switch(a=(n<r)<<1|t<e,u=new Array(4),u[a]=s,s=u,c*=2,a){case 0:i=e+c,o=r+c;break;case 1:e=i-c,o=r+c;break;case 2:i=e+c,r=o-c;break;case 3:e=i-c,r=o-c;break}this._root&&this._root.length&&(this._root=s)}return this._x0=e,this._y0=r,this._x1=i,this._y1=o,this}function Bt(){var t=[];return this.visit(function(n){if(!n.length)do t.push(n.data);while(n=n.next)}),t}function Ct(t){return arguments.length?this.cover(+t[0][0],+t[0][1]).cover(+t[1][0],+t[1][1]):isNaN(this._x0)?void 0:[[this._x0,this._y0],[this._x1,this._y1]]}function D(t,n,e,r,i){this.node=t,this.x0=n,this.y0=e,this.x1=r,this.y1=i}function Yt(t,n,e){var r,i=this._x0,o=this._y0,c,s,u,a,p=this._x1,m=this._y1,x=[],g=this._root,_,h;for(g&&x.push(new D(g,i,o,p,m)),e==null?e=1/0:(i=t-e,o=n-e,p=t+e,m=n+e,e*=e);_=x.pop();)if(!(!(g=_.node)||(c=_.x0)>p||(s=_.y0)>m||(u=_.x1)<i||(a=_.y1)<o))if(g.length){var f=(c+u)/2,v=(s+a)/2;x.push(new D(g[3],f,v,u,a),new D(g[2],c,v,f,a),new D(g[1],f,s,u,v),new D(g[0],c,s,f,v)),(h=(n>=v)<<1|t>=f)&&(_=x[x.length-1],x[x.length-1]=x[x.length-1-h],x[x.length-1-h]=_)}else{var d=t-+this._x.call(null,g.data),w=n-+this._y.call(null,g.data),y=d*d+w*w;if(y<e){var A=Math.sqrt(e=y);i=t-A,o=n-A,p=t+A,m=n+A,r=g.data}}return r}function Xt(t){if(isNaN(p=+this._x.call(null,t))||isNaN(m=+this._y.call(null,t)))return this;var n,e=this._root,r,i,o,c=this._x0,s=this._y0,u=this._x1,a=this._y1,p,m,x,g,_,h,f,v;if(!e)return this;if(e.length)for(;;){if((_=p>=(x=(c+u)/2))?c=x:u=x,(h=m>=(g=(s+a)/2))?s=g:a=g,n=e,!(e=e[f=h<<1|_]))return this;if(!e.length)break;(n[f+1&3]||n[f+2&3]||n[f+3&3])&&(r=n,v=f)}for(;e.data!==t;)if(i=e,!(e=e.next))return this;return(o=e.next)&&delete e.next,i?(o?i.next=o:delete i.next,this):n?(o?n[f]=o:delete n[f],(e=n[0]||n[1]||n[2]||n[3])&&e===(n[3]||n[2]||n[1]||n[0])&&!e.length&&(r?r[v]=e:this._root=e),this):(this._root=o,this)}function Gt(t){for(var n=0,e=t.length;n<e;++n)this.remove(t[n]);return this}function Ht(){return this._root}function Kt(){var t=0;return this.visit(function(n){if(!n.length)do++t;while(n=n.next)}),t}function Qt(t){var n=[],e,r=this._root,i,o,c,s,u;for(r&&n.push(new D(r,this._x0,this._y0,this._x1,this._y1));e=n.pop();)if(!t(r=e.node,o=e.x0,c=e.y0,s=e.x1,u=e.y1)&&r.length){var a=(o+s)/2,p=(c+u)/2;(i=r[3])&&n.push(new D(i,a,p,s,u)),(i=r[2])&&n.push(new D(i,o,p,a,u)),(i=r[1])&&n.push(new D(i,a,c,s,p)),(i=r[0])&&n.push(new D(i,o,c,a,p))}return this}function Vt(t){var n=[],e=[],r;for(this._root&&n.push(new D(this._root,this._x0,this._y0,this._x1,this._y1));r=n.pop();){var i=r.node;if(i.length){var o,c=r.x0,s=r.y0,u=r.x1,a=r.y1,p=(c+u)/2,m=(s+a)/2;(o=i[0])&&n.push(new D(o,c,s,p,m)),(o=i[1])&&n.push(new D(o,p,s,u,m)),(o=i[2])&&n.push(new D(o,c,m,p,a)),(o=i[3])&&n.push(new D(o,p,m,u,a))}e.push(r)}for(;r=e.pop();)t(r.node,r.x0,r.y0,r.x1,r.y1);return this}function Jt(t){return t[0]}function Ut(t){return arguments.length?(this._x=t,this):this._x}function Zt(t){return t[1]}function qt(t){return arguments.length?(this._y=t,this):this._y}function ut(t,n,e){var r=new ft(n??Jt,e??Zt,NaN,NaN,NaN,NaN);return t==null?r:r.addAll(t)}function ft(t,n,e,r,i,o){this._x=t,this._y=n,this._x0=e,this._y0=r,this._x1=i,this._y1=o,this._root=void 0}function mt(t){for(var n={data:t.data},e=n;t=t.next;)e=e.next={data:t.data};return n}var W=ut.prototype=ft.prototype;W.copy=function(){var t=new ft(this._x,this._y,this._x0,this._y0,this._x1,this._y1),n=this._root,e,r;if(!n)return t;if(!n.length)return t._root=mt(n),t;for(e=[{source:n,target:t._root=new Array(4)}];n=e.pop();)for(var i=0;i<4;++i)(r=n.source[i])&&(r.length?e.push({source:r,target:n.target[i]=new Array(4)}):n.target[i]=mt(r));return t},W.add=Ot,W.addAll=Pt,W.cover=Rt,W.data=Bt,W.extent=Ct,W.find=Yt,W.remove=Xt,W.removeAll=Gt,W.root=Ht,W.size=Kt,W.visit=Qt,W.visitAfter=Vt,W.x=Ut,W.y=qt;function L(t){return function(){return t}}function Y(t){return(t()-.5)*1e-6}function tn(t){return t.x+t.vx}function nn(t){return t.y+t.vy}function en(t){var n,e,r,i=1,o=1;typeof t!="function"&&(t=L(t==null?1:+t));function c(){for(var a,p=n.length,m,x,g,_,h,f,v=0;v<o;++v)for(m=ut(n,tn,nn).visitAfter(s),a=0;a<p;++a)x=n[a],h=e[x.index],f=h*h,g=x.x+x.vx,_=x.y+x.vy,m.visit(d);function d(w,y,A,S,z){var j=w.data,F=w.r,I=h+F;if(j){if(j.index>x.index){var R=g-j.x-j.vx,B=_-j.y-j.vy,E=R*R+B*B;E<I*I&&(R===0&&(R=Y(r),E+=R*R),B===0&&(B=Y(r),E+=B*B),E=(I-(E=Math.sqrt(E)))/E*i,x.vx+=(R*=E)*(I=(F*=F)/(f+F)),x.vy+=(B*=E)*I,j.vx-=R*(I=1-I),j.vy-=B*I)}return}return y>g+I||S<g-I||A>_+I||z<_-I}}function s(a){if(a.data)return a.r=e[a.data.index];for(var p=a.r=0;p<4;++p)a[p]&&a[p].r>a.r&&(a.r=a[p].r)}function u(){if(n){var a,p=n.length,m;for(e=new Array(p),a=0;a<p;++a)m=n[a],e[m.index]=+t(m,a,n)}}return c.initialize=function(a,p){n=a,r=p,u()},c.iterations=function(a){return arguments.length?(o=+a,c):o},c.strength=function(a){return arguments.length?(i=+a,c):i},c.radius=function(a){return arguments.length?(t=typeof a=="function"?a:L(+a),u(),c):t},c}function rn(t){return t.index}function _t(t,n){var e=t.get(n);if(!e)throw new Error("node not found: "+n);return e}function on(t){var n=rn,e=m,r,i=L(30),o,c,s,u,a,p=1;t==null&&(t=[]);function m(f){return 1/Math.min(s[f.source.index],s[f.target.index])}function x(f){for(var v=0,d=t.length;v<p;++v)for(var w=0,y,A,S,z,j,F,I;w<d;++w)y=t[w],A=y.source,S=y.target,z=S.x+S.vx-A.x-A.vx||Y(a),j=S.y+S.vy-A.y-A.vy||Y(a),F=Math.sqrt(z*z+j*j),F=(F-o[w])/F*f*r[w],z*=F,j*=F,S.vx-=z*(I=u[w]),S.vy-=j*I,A.vx+=z*(I=1-I),A.vy+=j*I}function g(){if(c){var f,v=c.length,d=t.length,w=new Map(c.map((A,S)=>[n(A,S,c),A])),y;for(f=0,s=new Array(v);f<d;++f)y=t[f],y.index=f,typeof y.source!="object"&&(y.source=_t(w,y.source)),typeof y.target!="object"&&(y.target=_t(w,y.target)),s[y.source.index]=(s[y.source.index]||0)+1,s[y.target.index]=(s[y.target.index]||0)+1;for(f=0,u=new Array(d);f<d;++f)y=t[f],u[f]=s[y.source.index]/(s[y.source.index]+s[y.target.index]);r=new Array(d),_(),o=new Array(d),h()}}function _(){if(c)for(var f=0,v=t.length;f<v;++f)r[f]=+e(t[f],f,t)}function h(){if(c)for(var f=0,v=t.length;f<v;++f)o[f]=+i(t[f],f,t)}return x.initialize=function(f,v){c=f,a=v,g()},x.links=function(f){return arguments.length?(t=f,g(),x):t},x.id=function(f){return arguments.length?(n=f,x):n},x.iterations=function(f){return arguments.length?(p=+f,x):p},x.strength=function(f){return arguments.length?(e=typeof f=="function"?f:L(+f),_(),x):e},x.distance=function(f){return arguments.length?(i=typeof f=="function"?f:L(+f),h(),x):i},x}var sn={value:()=>{}};function wt(){for(var t=0,n=arguments.length,e={},r;t<n;++t){if(!(r=arguments[t]+"")||r in e||/[\\s.]/.test(r))throw new Error("illegal type: "+r);e[r]=[]}return new et(e)}function et(t){this._=t}function an(t,n){return t.trim().split(/^|\\s+/).map(function(e){var r="",i=e.indexOf(".");if(i>=0&&(r=e.slice(i+1),e=e.slice(0,i)),e&&!n.hasOwnProperty(e))throw new Error("unknown type: "+e);return{type:e,name:r}})}et.prototype=wt.prototype={constructor:et,on:function(t,n){var e=this._,r=an(t+"",e),i,o=-1,c=r.length;if(arguments.length<2){for(;++o<c;)if((i=(t=r[o]).type)&&(i=cn(e[i],t.name)))return i;return}if(n!=null&&typeof n!="function")throw new Error("invalid callback: "+n);for(;++o<c;)if(i=(t=r[o]).type)e[i]=Mt(e[i],t.name,n);else if(n==null)for(i in e)e[i]=Mt(e[i],t.name,null);return this},copy:function(){var t={},n=this._;for(var e in n)t[e]=n[e].slice();return new et(t)},call:function(t,n){if((i=arguments.length-2)>0)for(var e=new Array(i),r=0,i,o;r<i;++r)e[r]=arguments[r+2];if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(o=this._[t],r=0,i=o.length;r<i;++r)o[r].value.apply(n,e)},apply:function(t,n,e){if(!this._.hasOwnProperty(t))throw new Error("unknown type: "+t);for(var r=this._[t],i=0,o=r.length;i<o;++i)r[i].value.apply(n,e)}};function cn(t,n){for(var e=0,r=t.length,i;e<r;++e)if((i=t[e]).name===n)return i.value}function Mt(t,n,e){for(var r=0,i=t.length;r<i;++r)if(t[r].name===n){t[r]=sn,t=t.slice(0,r).concat(t.slice(r+1));break}return e!=null&&t.push({name:n,value:e}),t}var Q=0,Z=0,q=0,bt=1e3,rt,tt,it=0,X=0,ot=0,nt=typeof performance=="object"&&performance.now?performance:Date,Nt=typeof window=="object"&&window.requestAnimationFrame?window.requestAnimationFrame.bind(window):function(t){setTimeout(t,17)};function At(){return X||(Nt(un),X=nt.now()+ot)}function un(){X=0}function lt(){this._call=this._time=this._next=null}lt.prototype=kt.prototype={constructor:lt,restart:function(t,n,e){if(typeof t!="function")throw new TypeError("callback is not a function");e=(e==null?At():+e)+(n==null?0:+n),!this._next&&tt!==this&&(tt?tt._next=this:rt=this,tt=this),this._call=t,this._time=e,ht()},stop:function(){this._call&&(this._call=null,this._time=1/0,ht())}};function kt(t,n,e){var r=new lt;return r.restart(t,n,e),r}function fn(){At(),++Q;for(var t=rt,n;t;)(n=X-t._time)>=0&&t._call.call(void 0,n),t=t._next;--Q}function It(){X=(it=nt.now())+ot,Q=Z=0;try{fn()}finally{Q=0,hn(),X=0}}function ln(){var t=nt.now(),n=t-it;n>bt&&(ot-=n,it=t)}function hn(){for(var t,n=rt,e,r=1/0;n;)n._call?(r>n._time&&(r=n._time),t=n,n=n._next):(e=n._next,n._next=null,n=t?t._next=e:rt=e);tt=t,ht(r)}function ht(t){if(!Q){Z&&(Z=clearTimeout(Z));var n=t-X;n>24?(t<1/0&&(Z=setTimeout(It,t-nt.now()-ot)),q&&(q=clearInterval(q))):(q||(it=nt.now(),q=setInterval(ln,bt)),Q=1,Nt(It))}}const pn=1664525,gn=1013904223,Et=4294967296;function vn(){let t=1;return()=>(t=(pn*t+gn)%Et)/Et}function dn(t){return t.x}function xn(t){return t.y}var yn=10,mn=Math.PI*(3-Math.sqrt(5));function _n(t){var n,e=1,r=.001,i=1-Math.pow(r,1/300),o=0,c=.6,s=new Map,u=kt(m),a=wt("tick","end"),p=vn();t==null&&(t=[]);function m(){x(),a.call("tick",n),e<r&&(u.stop(),a.call("end",n))}function x(h){var f,v=t.length,d;h===void 0&&(h=1);for(var w=0;w<h;++w)for(e+=(o-e)*i,s.forEach(function(y){y(e)}),f=0;f<v;++f)d=t[f],d.fx==null?d.x+=d.vx*=c:(d.x=d.fx,d.vx=0),d.fy==null?d.y+=d.vy*=c:(d.y=d.fy,d.vy=0);return n}function g(){for(var h=0,f=t.length,v;h<f;++h){if(v=t[h],v.index=h,v.fx!=null&&(v.x=v.fx),v.fy!=null&&(v.y=v.fy),isNaN(v.x)||isNaN(v.y)){var d=yn*Math.sqrt(.5+h),w=h*mn;v.x=d*Math.cos(w),v.y=d*Math.sin(w)}(isNaN(v.vx)||isNaN(v.vy))&&(v.vx=v.vy=0)}}function _(h){return h.initialize&&h.initialize(t,p),h}return g(),n={tick:x,restart:function(){return u.restart(m),n},stop:function(){return u.stop(),n},nodes:function(h){return arguments.length?(t=h,g(),s.forEach(_),n):t},alpha:function(h){return arguments.length?(e=+h,n):e},alphaMin:function(h){return arguments.length?(r=+h,n):r},alphaDecay:function(h){return arguments.length?(i=+h,n):+i},alphaTarget:function(h){return arguments.length?(o=+h,n):o},velocityDecay:function(h){return arguments.length?(c=1-h,n):1-c},randomSource:function(h){return arguments.length?(p=h,s.forEach(_),n):p},force:function(h,f){return arguments.length>1?(f==null?s.delete(h):s.set(h,_(f)),n):s.get(h)},find:function(h,f,v){var d=0,w=t.length,y,A,S,z,j;for(v==null?v=1/0:v*=v,d=0;d<w;++d)z=t[d],y=h-z.x,A=f-z.y,S=y*y+A*A,S<v&&(j=z,v=S);return j},on:function(h,f){return arguments.length>1?(a.on(h,f),n):a.on(h)}}}function wn(){var t,n,e,r,i=L(-30),o,c=1,s=1/0,u=.81;function a(g){var _,h=t.length,f=ut(t,dn,xn).visitAfter(m);for(r=g,_=0;_<h;++_)n=t[_],f.visit(x)}function p(){if(t){var g,_=t.length,h;for(o=new Array(_),g=0;g<_;++g)h=t[g],o[h.index]=+i(h,g,t)}}function m(g){var _=0,h,f,v=0,d,w,y;if(g.length){for(d=w=y=0;y<4;++y)(h=g[y])&&(f=Math.abs(h.value))&&(_+=h.value,v+=f,d+=f*h.x,w+=f*h.y);g.x=d/v,g.y=w/v}else{h=g,h.x=h.data.x,h.y=h.data.y;do _+=o[h.data.index];while(h=h.next)}g.value=_}function x(g,_,h,f){if(!g.value)return!0;var v=g.x-n.x,d=g.y-n.y,w=f-_,y=v*v+d*d;if(w*w/u<y)return y<s&&(v===0&&(v=Y(e),y+=v*v),d===0&&(d=Y(e),y+=d*d),y<c&&(y=Math.sqrt(c*y)),n.vx+=v*g.value*r/y,n.vy+=d*g.value*r/y),!0;if(g.length||y>=s)return;(g.data!==n||g.next)&&(v===0&&(v=Y(e),y+=v*v),d===0&&(d=Y(e),y+=d*d),y<c&&(y=Math.sqrt(c*y)));do g.data!==n&&(w=o[g.data.index]*r/y,n.vx+=v*w,n.vy+=d*w);while(g=g.next)}return a.initialize=function(g,_){t=g,e=_,p()},a.strength=function(g){return arguments.length?(i=typeof g=="function"?g:L(+g),p(),a):i},a.distanceMin=function(g){return arguments.length?(c=g*g,a):Math.sqrt(c)},a.distanceMax=function(g){return arguments.length?(s=g*g,a):Math.sqrt(s)},a.theta=function(g){return arguments.length?(u=g*g,a):Math.sqrt(u)},a}function Mn(t){var n=L(.1),e,r,i;typeof t!="function"&&(t=L(t==null?0:+t));function o(s){for(var u=0,a=e.length,p;u<a;++u)p=e[u],p.vx+=(i[u]-p.x)*r[u]*s}function c(){if(e){var s,u=e.length;for(r=new Array(u),i=new Array(u),s=0;s<u;++s)r[s]=isNaN(i[s]=+t(e[s],s,e))?0:+n(e[s],s,e)}}return o.initialize=function(s){e=s,c()},o.strength=function(s){return arguments.length?(n=typeof s=="function"?s:L(+s),c(),o):n},o.x=function(s){return arguments.length?(t=typeof s=="function"?s:L(+s),c(),o):t},o}function bn(t){var n=L(.1),e,r,i;typeof t!="function"&&(t=L(t==null?0:+t));function o(s){for(var u=0,a=e.length,p;u<a;++u)p=e[u],p.vy+=(i[u]-p.y)*r[u]*s}function c(){if(e){var s,u=e.length;for(r=new Array(u),i=new Array(u),s=0;s<u;++s)r[s]=isNaN(i[s]=+t(e[s],s,e))?0:+n(e[s],s,e)}}return o.initialize=function(s){e=s,c()},o.strength=function(s){return arguments.length?(n=typeof s=="function"?s:L(+s),c(),o):n},o.y=function(s){return arguments.length?(t=typeof s=="function"?s:L(+s),c(),o):t},o}const Nn={project:"anchor",charter:"anchor",program:"anchor",workstream:"anchor",work_unit:"anchor",work:"anchor",task:"anchor",run:"anchor",milestone:"anchor",history:"anchor",era:"anchor",stage:"anchor",ontology:"anchor",subject:"anchor",goal:"anchor",epic:"anchor",phase:"anchor",invariant:"rule",constraint:"rule",rule:"rule",rule_set:"rule",design_rule:"rule",definition:"rule",requirement:"rule",governance:"rule",design:"rule",specification:"rule",policy:"rule",claim:"rule",schema:"rule",decision:"decision",approach:"decision",candidate:"decision",alternative:"decision",choice:"decision",selection:"decision",tradeoff:"decision",evidence:"evidence",proof:"evidence",experiment:"evidence",experiment_set:"evidence",observation:"evidence",audit:"evidence",artifact:"evidence",reference:"evidence",paper:"evidence",verification:"evidence",acceptance:"evidence",reflection:"evidence",integration_receipt:"evidence",measurement:"evidence",benchmark:"evidence",risk:"risk",failure:"risk",contradiction:"risk",reopening:"risk",legacy:"risk",rejected_approach:"risk",false_green:"risk",blocker:"risk",threat:"risk",conflict:"risk",regression:"risk",incident:"risk",question:"open",research_question:"open",proof_obligation:"open",obligation:"open",gate:"open",hypothesis:"open",unknown:"open",assumption:"open",agent:"agent",cursor:"agent",operator:"agent"};function pt(t){return Nn[String(t||"").toLowerCase()]||"note"}const An={anchor:"var(--jr-accent)",rule:"var(--jr-rule)",decision:"var(--jr-decision)",evidence:"var(--jr-evidence)",risk:"var(--jr-danger)",open:"var(--jr-warn)",agent:"var(--jr-accent-strong)",note:"var(--jr-muted)"};function kn(t){return An[pt(t)]}const In={contains:"structure",owns:"structure",precedes:"structure",next:"structure",defines:"structure",delegates:"structure",projects_from:"structure",binds:"structure",used_by:"structure",part_of:"structure",includes:"structure",supports:"support",verifies:"support",evaluates:"support",requires_proof:"support",candidate_for:"support",learned_from:"support",governed_by:"support",governs:"support",motivates:"support",informs:"support",cites:"support",relates:"support",duplicates:"support",contradicts:"conflict",conflicts:"conflict",refutes:"conflict",rejects:"conflict",blocks:"conflict",threatens:"conflict",deletes:"conflict",invalidates:"conflict",superseded_by:"succession",supersedes:"succession",selects:"succession",requires_integration:"succession",replaced_by:"succession",causes:"succession",positioned_at:"presence",focused_on:"presence",assigned_to:"presence"};function En(t){return In[String(t||"").toLowerCase()]||"support"}function jt(t){return En(t.kind)==="presence"}function gt(t){let n=2166136261;for(let e=0;e<t.length;e++)n^=t.charCodeAt(e),n=Math.imul(n,16777619);return n>>>0}function jn(t){let n=t||1;return()=>(n=Math.imul(1664525,n)+1013904223>>>0,n/4294967296)}const Sn=new Set([...`iljtIfr.,;:\'"!|()[]{} `]),zn=new Set([..."MWmw@%&"]);function st(t,n=9){let e=0;for(const r of t)e+=Sn.has(r)?2.5:zn.has(r)?7.6:4.95;return e*n/9}function Dn(t,n=128,e=2){const r=String(t||"").trim().split(/\\s+/).filter(Boolean);if(!r.length)return["untitled"];const i=[];let o="";for(const s of r){const u=o?`${o} ${s}`:s;o&&st(u)>n&&i.length<e-1?(i.push(o),o=s):o=u}i.push(o);const c=i.length-1;if(st(i[c])>n){let s=i[c];for(;s.length>1&&st(`${s}…`)>n;)s=s.slice(0,-1);i[c]=`${s.trimEnd()}…`}return i}function Wn(t,n){const e=6.6+Math.sqrt(Math.max(0,t))*3.1,r=n==="anchor"?1.12:n==="note"?.86:1;return Math.min(17.5,e)*r}const Ln=10.4;function Tn(t,n,e=!1){const r=pt(t.kind),i=Wn(n,r),o=Dn(t.label,e?132:112,e?2:1),c=Math.max(...o.map(s=>st(s)));return{radius:i,lines:o,halfWidth:Math.max(i+3,c/2+4),top:i+3,bottom:i+6+o.length*Ln}}function St(t,n){return t.bottom+n.top}function Fn(t){return Math.max(t.halfWidth,(t.top+t.bottom)/2)}const $n=.25,zt=420;function On(t,n){let e=1/0,r=-1/0;for(const i of t){const[o,c]=n(i);o<e&&(e=o),c>r&&(r=c)}return[e,r]}function Pn(t){const n=new Map;for(const e of t)jt(e)||(n.set(e.from,(n.get(e.from)||0)+1),n.set(e.to,(n.get(e.to)||0)+1));return n}function vt(t){const n=t.x??t.metadata?.x,e=t.y??t.metadata?.y;if(n==null||n===""||e===void 0||e===null||e==="")return;const r=Number(n),i=Number(e);return Number.isFinite(r)&&Number.isFinite(i)?[r,i]:void 0}function Rn(t,n,e,r,i,o){const c=o?void 0:vt(t);if(c)return c;const s=i?.get(t.id);if(s)return[s.px,s.py];const u=gt(`${t.kind}:${t.id}`),a=u%360/180*Math.PI,p=.25+(u>>>9)%48/80,m=(n%7-3)*5;return[e/2+Math.cos(a)*(e/2)*p+m,r/2+Math.sin(a)*(r/2)*p-m]}function Bn(t,n,e=920,r=620,i=new Set,o,c,s){const u=t,a=!!s?.unpin,p=Pn(n),m=new Map(u.map(l=>[l.id,Tn(l,p.get(l.id)||0,i.has(l.id))]));let x=0;if(o?.size)for(const l of u)o.has(l.id)&&x++;const g=x>0&&(u.length-x)/u.length>$n,_=u.map((l,M)=>{const N=m.get(l.id),b=c?.get(l.id),$=a?void 0:vt(l),[P,T]=b?[b.px,b.py]:Rn(l,M,e,r,o,a),O=Math.max(N.halfWidth,Math.min(e-N.halfWidth,P)),H=Math.max(N.top,Math.min(r-N.bottom,T)),C=!g&&o?.has(l.id);return{id:l.id,record:l,box:N,x:O,y:H,vx:0,vy:0,fx:$||b||C?O:null,fy:$||b||C?H:null}}),h=new Set(_.map(l=>l.id)),f=new Map(u.map(l=>[l.id,l])),v=l=>{let M=l;const N=new Set([M.id]);for(;M.parent_id&&f.has(M.parent_id)&&!N.has(M.parent_id);){const b=f.get(M.parent_id);if(!b.parent_id||!f.has(b.parent_id))return M.id;N.add(b.id),M=b}return M.id},d=n.filter(l=>!jt(l)&&h.has(l.from)&&h.has(l.to)).map(l=>({source:l.from,target:l.to})),w=gt([...h].sort().join("|")+d.length),y=new Map,A=[...new Set(u.map(l=>v(l)))].sort();A.forEach((l,M)=>{const N=M/A.length*Math.PI*2+w%360/180*Math.PI;y.set(l,[e/2+Math.cos(N)*e*.3,r/2+Math.sin(N)*r*.28])});const S=(l,M)=>{const N=y.get(v(l));return N?M==="x"?N[0]:N[1]:M==="x"?e/2:r/2},z=!g&&x>0,j=u.length>zt,F=l=>j?l.radius+6:Fn(l)*.92,I=_n(_).randomSource(jn(w)).alpha(z?.45:1).alphaDecay(.035).velocityDecay(.42).force("link",on(d).id(l=>l.id).distance(72).strength(.24)).force("charge",wn().strength(-108).distanceMin(16).distanceMax(300)).force("collision",en().radius(l=>F(l.box)).strength(1).iterations(3)).force("x",Mn(l=>l.record.parent_id?S(l.record,"x"):e/2).strength(l=>l.record.parent_id?.34:.2)).force("y",bn(l=>l.record.parent_id?S(l.record,"y"):r/2).strength(l=>l.record.parent_id?.34:.2)).force("center",$t(e/2,r/2).strength(.04)).stop(),R=_.length>2e3?.35:_.length>600?.6:1,B=Math.max(40,Math.round((z?90:260)*R));for(let l=0;l<B;l++)I.tick();I.stop();const E=_.map(l=>({...l.record,px:Math.max(l.box.halfWidth,Math.min(e-l.box.halfWidth,Number(l.x)||e/2)),py:Math.max(l.box.top,Math.min(r-l.box.bottom,Number(l.y)||r/2)),vx:Number(l.vx)||0,vy:Number(l.vy)||0,family:pt(l.record.kind),color:kn(l.record.kind),degree:p.get(l.id)||0,box:l.box,held:!!c?.get(l.id)})),G=l=>l.box;if(E.length>1&&!z&&(a||!E.some(l=>vt(l)))&&!c?.size){const l=M=>{const N=M==="x"?e:r,b=k=>M==="x"?G(k).halfWidth:G(k).top,$=k=>M==="x"?G(k).halfWidth:G(k).bottom,P=k=>M==="x"?k.px:k.py,[T,O]=On(E,k=>[P(k)-b(k),P(k)+$(k)]),H=Math.max(1,O-T),C=Math.min(4,Math.max(1,N*.88/H));if(C<=1.025)return;const at=(T+O)/2;for(const k of E){const V=N/2+(P(k)-at)*C;M==="x"?k.px=Math.max(b(k),Math.min(N-$(k),V)):k.py=Math.max(b(k),Math.min(N-$(k),V))}};l("x"),l("y")}const Yn=E.length>zt?0:E.length>70?64:220,dt=(l,M,N)=>{const b=G(l),$=M==="x"?l.px:l.py,P=M==="x"?b.halfWidth:b.top,T=M==="x"?e-b.halfWidth:r-b.bottom,O=Math.max(P,Math.min(Math.max(P,T),$+N));return M==="x"?l.px=O:l.py=O,O-$};for(let l=0;l<Yn;l++){let M=!1;for(let N=0;N<E.length;N++){const b=E[N],$=G(b);for(let P=N+1;P<E.length;P++){const T=E[P],O=G(T),H=T.px-b.px,C=T.py-b.py,at=$.halfWidth+O.halfWidth,k=C>=0?St($,O):St(O,$),V=at+4-Math.abs(H),xt=k+3-Math.abs(C);if(V<=0||xt<=0)continue;M=!0;const Lt=V/at<xt/k?"x":"y",Tt=J=>{const Ft=J==="x"?H:C,U=Ft===0?gt(J==="x"?`${b.id}:${T.id}`:`${T.id}:${b.id}`)%2?1:-1:Math.sign(Ft),ct=(J==="x"?V:xt)+.3;let K=0;return b.held||(K-=dt(b,J,-U*(ct/2))*U),T.held||(K+=dt(T,J,U*Math.max(0,ct-K))*U),!b.held&&K+.01<ct&&(K-=dt(b,J,-U*(ct-K))*U),K>.01};Tt(Lt)||Tt(Lt==="x"?"y":"x")}}if(!M)break}return E}const Dt=5;function Cn(t){const n=Date.now(),e=new Map(t.previous.map(([a,p,m])=>[a,{px:p,py:m}])),r=new Map(t.held.map(([a,p,m])=>[a,{px:p,py:m}])),i=Bn(t.nodes,t.edges,t.width,t.height,new Set(t.emphasis),e,r,{unpin:t.unpin}),o=new Array(i.length),c=new Array(i.length),s=new Float32Array(i.length*2),u=new Float32Array(i.length*Dt);for(let a=0;a<i.length;a++){const p=i[a];o[a]=p.id,c[a]=p.box.lines,s[a*2]=p.px,s[a*2+1]=p.py;const m=a*Dt;u[m]=p.box.radius,u[m+1]=p.box.halfWidth,u[m+2]=p.box.top,u[m+3]=p.box.bottom,u[m+4]=p.degree}return{generation:t.generation,ids:o,labels:c,positions:s,geometry:u,width:t.width,height:t.height,ms:Date.now()-n}}const Wt=self;Wt.onmessage=t=>{const n=Cn(t.data);Wt.postMessage(n,[n.positions.buffer,n.geometry.buffer])}})();\n//# sourceMappingURL=layout-worker-BsvX7bmA.js.map\n', Rn = typeof self < "u" && self.Blob && new Blob([fo], { type: "text/javascript;charset=utf-8" });
function tr(t) {
  let n;
  try {
    if (n = Rn && (self.URL || self.webkitURL).createObjectURL(Rn), !n) throw "";
    const e = new Worker(n, {
      name: t?.name
    });
    return e.addEventListener("error", () => {
      (self.URL || self.webkitURL).revokeObjectURL(n);
    }), e;
  } catch {
    return new Worker(
      "data:text/javascript;charset=utf-8," + encodeURIComponent(fo),
      {
        name: t?.name
      }
    );
  } finally {
    n && (self.URL || self.webkitURL).revokeObjectURL(n);
  }
}
function er(t, n) {
  var e, o = 1;
  t == null && (t = 0), n == null && (n = 0);
  function s() {
    var r, u = e.length, a, d = 0, l = 0;
    for (r = 0; r < u; ++r)
      a = e[r], d += a.x, l += a.y;
    for (d = (d / u - t) * o, l = (l / u - n) * o, r = 0; r < u; ++r)
      a = e[r], a.x -= d, a.y -= l;
  }
  return s.initialize = function(r) {
    e = r;
  }, s.x = function(r) {
    return arguments.length ? (t = +r, s) : t;
  }, s.y = function(r) {
    return arguments.length ? (n = +r, s) : n;
  }, s.strength = function(r) {
    return arguments.length ? (o = +r, s) : o;
  }, s;
}
function nr(t) {
  const n = +this._x.call(null, t), e = +this._y.call(null, t);
  return po(this.cover(n, e), n, e, t);
}
function po(t, n, e, o) {
  if (isNaN(n) || isNaN(e)) return t;
  var s, r = t._root, u = { data: o }, a = t._x0, d = t._y0, l = t._x1, c = t._y1, p, m, f, j, x, w, g, h;
  if (!r) return t._root = u, t;
  for (; r.length; )
    if ((x = n >= (p = (a + l) / 2)) ? a = p : l = p, (w = e >= (m = (d + c) / 2)) ? d = m : c = m, s = r, !(r = r[g = w << 1 | x])) return s[g] = u, t;
  if (f = +t._x.call(null, r.data), j = +t._y.call(null, r.data), n === f && e === j) return u.next = r, s ? s[g] = u : t._root = u, t;
  do
    s = s ? s[g] = new Array(4) : t._root = new Array(4), (x = n >= (p = (a + l) / 2)) ? a = p : l = p, (w = e >= (m = (d + c) / 2)) ? d = m : c = m;
  while ((g = w << 1 | x) === (h = (j >= m) << 1 | f >= p));
  return s[h] = r, s[g] = u, t;
}
function or(t) {
  var n, e, o = t.length, s, r, u = new Array(o), a = new Array(o), d = 1 / 0, l = 1 / 0, c = -1 / 0, p = -1 / 0;
  for (e = 0; e < o; ++e)
    isNaN(s = +this._x.call(null, n = t[e])) || isNaN(r = +this._y.call(null, n)) || (u[e] = s, a[e] = r, s < d && (d = s), s > c && (c = s), r < l && (l = r), r > p && (p = r));
  if (d > c || l > p) return this;
  for (this.cover(d, l).cover(c, p), e = 0; e < o; ++e)
    po(this, u[e], a[e], t[e]);
  return this;
}
function sr(t, n) {
  if (isNaN(t = +t) || isNaN(n = +n)) return this;
  var e = this._x0, o = this._y0, s = this._x1, r = this._y1;
  if (isNaN(e))
    s = (e = Math.floor(t)) + 1, r = (o = Math.floor(n)) + 1;
  else {
    for (var u = s - e || 1, a = this._root, d, l; e > t || t >= s || o > n || n >= r; )
      switch (l = (n < o) << 1 | t < e, d = new Array(4), d[l] = a, a = d, u *= 2, l) {
        case 0:
          s = e + u, r = o + u;
          break;
        case 1:
          e = s - u, r = o + u;
          break;
        case 2:
          s = e + u, o = r - u;
          break;
        case 3:
          e = s - u, o = r - u;
          break;
      }
    this._root && this._root.length && (this._root = a);
  }
  return this._x0 = e, this._y0 = o, this._x1 = s, this._y1 = r, this;
}
function rr() {
  var t = [];
  return this.visit(function(n) {
    if (!n.length) do
      t.push(n.data);
    while (n = n.next);
  }), t;
}
function ir(t) {
  return arguments.length ? this.cover(+t[0][0], +t[0][1]).cover(+t[1][0], +t[1][1]) : isNaN(this._x0) ? void 0 : [[this._x0, this._y0], [this._x1, this._y1]];
}
function jt(t, n, e, o, s) {
  this.node = t, this.x0 = n, this.y0 = e, this.x1 = o, this.y1 = s;
}
function ar(t, n, e) {
  var o, s = this._x0, r = this._y0, u, a, d, l, c = this._x1, p = this._y1, m = [], f = this._root, j, x;
  for (f && m.push(new jt(f, s, r, c, p)), e == null ? e = 1 / 0 : (s = t - e, r = n - e, c = t + e, p = n + e, e *= e); j = m.pop(); )
    if (!(!(f = j.node) || (u = j.x0) > c || (a = j.y0) > p || (d = j.x1) < s || (l = j.y1) < r))
      if (f.length) {
        var w = (u + d) / 2, g = (a + l) / 2;
        m.push(
          new jt(f[3], w, g, d, l),
          new jt(f[2], u, g, w, l),
          new jt(f[1], w, a, d, g),
          new jt(f[0], u, a, w, g)
        ), (x = (n >= g) << 1 | t >= w) && (j = m[m.length - 1], m[m.length - 1] = m[m.length - 1 - x], m[m.length - 1 - x] = j);
      } else {
        var h = t - +this._x.call(null, f.data), A = n - +this._y.call(null, f.data), S = h * h + A * A;
        if (S < e) {
          var $ = Math.sqrt(e = S);
          s = t - $, r = n - $, c = t + $, p = n + $, o = f.data;
        }
      }
  return o;
}
function lr(t) {
  if (isNaN(c = +this._x.call(null, t)) || isNaN(p = +this._y.call(null, t))) return this;
  var n, e = this._root, o, s, r, u = this._x0, a = this._y0, d = this._x1, l = this._y1, c, p, m, f, j, x, w, g;
  if (!e) return this;
  if (e.length) for (; ; ) {
    if ((j = c >= (m = (u + d) / 2)) ? u = m : d = m, (x = p >= (f = (a + l) / 2)) ? a = f : l = f, n = e, !(e = e[w = x << 1 | j])) return this;
    if (!e.length) break;
    (n[w + 1 & 3] || n[w + 2 & 3] || n[w + 3 & 3]) && (o = n, g = w);
  }
  for (; e.data !== t; ) if (s = e, !(e = e.next)) return this;
  return (r = e.next) && delete e.next, s ? (r ? s.next = r : delete s.next, this) : n ? (r ? n[w] = r : delete n[w], (e = n[0] || n[1] || n[2] || n[3]) && e === (n[3] || n[2] || n[1] || n[0]) && !e.length && (o ? o[g] = e : this._root = e), this) : (this._root = r, this);
}
function ur(t) {
  for (var n = 0, e = t.length; n < e; ++n) this.remove(t[n]);
  return this;
}
function cr() {
  return this._root;
}
function dr() {
  var t = 0;
  return this.visit(function(n) {
    if (!n.length) do
      ++t;
    while (n = n.next);
  }), t;
}
function hr(t) {
  var n = [], e, o = this._root, s, r, u, a, d;
  for (o && n.push(new jt(o, this._x0, this._y0, this._x1, this._y1)); e = n.pop(); )
    if (!t(o = e.node, r = e.x0, u = e.y0, a = e.x1, d = e.y1) && o.length) {
      var l = (r + a) / 2, c = (u + d) / 2;
      (s = o[3]) && n.push(new jt(s, l, c, a, d)), (s = o[2]) && n.push(new jt(s, r, c, l, d)), (s = o[1]) && n.push(new jt(s, l, u, a, c)), (s = o[0]) && n.push(new jt(s, r, u, l, c));
    }
  return this;
}
function fr(t) {
  var n = [], e = [], o;
  for (this._root && n.push(new jt(this._root, this._x0, this._y0, this._x1, this._y1)); o = n.pop(); ) {
    var s = o.node;
    if (s.length) {
      var r, u = o.x0, a = o.y0, d = o.x1, l = o.y1, c = (u + d) / 2, p = (a + l) / 2;
      (r = s[0]) && n.push(new jt(r, u, a, c, p)), (r = s[1]) && n.push(new jt(r, c, a, d, p)), (r = s[2]) && n.push(new jt(r, u, p, c, l)), (r = s[3]) && n.push(new jt(r, c, p, d, l));
    }
    e.push(o);
  }
  for (; o = e.pop(); )
    t(o.node, o.x0, o.y0, o.x1, o.y1);
  return this;
}
function pr(t) {
  return t[0];
}
function gr(t) {
  return arguments.length ? (this._x = t, this) : this._x;
}
function vr(t) {
  return t[1];
}
function mr(t) {
  return arguments.length ? (this._y = t, this) : this._y;
}
function An(t, n, e) {
  var o = new In(n ?? pr, e ?? vr, NaN, NaN, NaN, NaN);
  return t == null ? o : o.addAll(t);
}
function In(t, n, e, o, s, r) {
  this._x = t, this._y = n, this._x0 = e, this._y0 = o, this._x1 = s, this._y1 = r, this._root = void 0;
}
function On(t) {
  for (var n = { data: t.data }, e = n; t = t.next; ) e = e.next = { data: t.data };
  return n;
}
var It = An.prototype = In.prototype;
It.copy = function() {
  var t = new In(this._x, this._y, this._x0, this._y0, this._x1, this._y1), n = this._root, e, o;
  if (!n) return t;
  if (!n.length) return t._root = On(n), t;
  for (e = [{ source: n, target: t._root = new Array(4) }]; n = e.pop(); )
    for (var s = 0; s < 4; ++s)
      (o = n.source[s]) && (o.length ? e.push({ source: o, target: n.target[s] = new Array(4) }) : n.target[s] = On(o));
  return t;
};
It.add = nr;
It.addAll = or;
It.cover = sr;
It.data = rr;
It.extent = ir;
It.find = ar;
It.remove = lr;
It.removeAll = ur;
It.root = cr;
It.size = dr;
It.visit = hr;
It.visitAfter = fr;
It.x = gr;
It.y = mr;
function Mt(t) {
  return function() {
    return t;
  };
}
function ee(t) {
  return (t() - 0.5) * 1e-6;
}
function yr(t) {
  return t.x + t.vx;
}
function br(t) {
  return t.y + t.vy;
}
function wr(t) {
  var n, e, o, s = 1, r = 1;
  typeof t != "function" && (t = Mt(t == null ? 1 : +t));
  function u() {
    for (var l, c = n.length, p, m, f, j, x, w, g = 0; g < r; ++g)
      for (p = An(n, yr, br).visitAfter(a), l = 0; l < c; ++l)
        m = n[l], x = e[m.index], w = x * x, f = m.x + m.vx, j = m.y + m.vy, p.visit(h);
    function h(A, S, $, T, C) {
      var W = A.data, D = A.r, J = x + D;
      if (W) {
        if (W.index > m.index) {
          var rt = f - W.x - W.vx, E = j - W.y - W.vy, I = rt * rt + E * E;
          I < J * J && (rt === 0 && (rt = ee(o), I += rt * rt), E === 0 && (E = ee(o), I += E * E), I = (J - (I = Math.sqrt(I))) / I * s, m.vx += (rt *= I) * (J = (D *= D) / (w + D)), m.vy += (E *= I) * J, W.vx -= rt * (J = 1 - J), W.vy -= E * J);
        }
        return;
      }
      return S > f + J || T < f - J || $ > j + J || C < j - J;
    }
  }
  function a(l) {
    if (l.data) return l.r = e[l.data.index];
    for (var c = l.r = 0; c < 4; ++c)
      l[c] && l[c].r > l.r && (l.r = l[c].r);
  }
  function d() {
    if (n) {
      var l, c = n.length, p;
      for (e = new Array(c), l = 0; l < c; ++l) p = n[l], e[p.index] = +t(p, l, n);
    }
  }
  return u.initialize = function(l, c) {
    n = l, o = c, d();
  }, u.iterations = function(l) {
    return arguments.length ? (r = +l, u) : r;
  }, u.strength = function(l) {
    return arguments.length ? (s = +l, u) : s;
  }, u.radius = function(l) {
    return arguments.length ? (t = typeof l == "function" ? l : Mt(+l), d(), u) : t;
  }, u;
}
function kr(t) {
  return t.index;
}
function Dn(t, n) {
  var e = t.get(n);
  if (!e) throw new Error("node not found: " + n);
  return e;
}
function _r(t) {
  var n = kr, e = p, o, s = Mt(30), r, u, a, d, l, c = 1;
  t == null && (t = []);
  function p(w) {
    return 1 / Math.min(a[w.source.index], a[w.target.index]);
  }
  function m(w) {
    for (var g = 0, h = t.length; g < c; ++g)
      for (var A = 0, S, $, T, C, W, D, J; A < h; ++A)
        S = t[A], $ = S.source, T = S.target, C = T.x + T.vx - $.x - $.vx || ee(l), W = T.y + T.vy - $.y - $.vy || ee(l), D = Math.sqrt(C * C + W * W), D = (D - r[A]) / D * w * o[A], C *= D, W *= D, T.vx -= C * (J = d[A]), T.vy -= W * J, $.vx += C * (J = 1 - J), $.vy += W * J;
  }
  function f() {
    if (u) {
      var w, g = u.length, h = t.length, A = new Map(u.map(($, T) => [n($, T, u), $])), S;
      for (w = 0, a = new Array(g); w < h; ++w)
        S = t[w], S.index = w, typeof S.source != "object" && (S.source = Dn(A, S.source)), typeof S.target != "object" && (S.target = Dn(A, S.target)), a[S.source.index] = (a[S.source.index] || 0) + 1, a[S.target.index] = (a[S.target.index] || 0) + 1;
      for (w = 0, d = new Array(h); w < h; ++w)
        S = t[w], d[w] = a[S.source.index] / (a[S.source.index] + a[S.target.index]);
      o = new Array(h), j(), r = new Array(h), x();
    }
  }
  function j() {
    if (u)
      for (var w = 0, g = t.length; w < g; ++w)
        o[w] = +e(t[w], w, t);
  }
  function x() {
    if (u)
      for (var w = 0, g = t.length; w < g; ++w)
        r[w] = +s(t[w], w, t);
  }
  return m.initialize = function(w, g) {
    u = w, l = g, f();
  }, m.links = function(w) {
    return arguments.length ? (t = w, f(), m) : t;
  }, m.id = function(w) {
    return arguments.length ? (n = w, m) : n;
  }, m.iterations = function(w) {
    return arguments.length ? (c = +w, m) : c;
  }, m.strength = function(w) {
    return arguments.length ? (e = typeof w == "function" ? w : Mt(+w), j(), m) : e;
  }, m.distance = function(w) {
    return arguments.length ? (s = typeof w == "function" ? w : Mt(+w), x(), m) : s;
  }, m;
}
var xr = { value: () => {
} };
function go() {
  for (var t = 0, n = arguments.length, e = {}, o; t < n; ++t) {
    if (!(o = arguments[t] + "") || o in e || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    e[o] = [];
  }
  return new He(e);
}
function He(t) {
  this._ = t;
}
function $r(t, n) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var o = "", s = e.indexOf(".");
    if (s >= 0 && (o = e.slice(s + 1), e = e.slice(0, s)), e && !n.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    return { type: e, name: o };
  });
}
He.prototype = go.prototype = {
  constructor: He,
  on: function(t, n) {
    var e = this._, o = $r(t + "", e), s, r = -1, u = o.length;
    if (arguments.length < 2) {
      for (; ++r < u; ) if ((s = (t = o[r]).type) && (s = jr(e[s], t.name))) return s;
      return;
    }
    if (n != null && typeof n != "function") throw new Error("invalid callback: " + n);
    for (; ++r < u; )
      if (s = (t = o[r]).type) e[s] = Pn(e[s], t.name, n);
      else if (n == null) for (s in e) e[s] = Pn(e[s], t.name, null);
    return this;
  },
  copy: function() {
    var t = {}, n = this._;
    for (var e in n) t[e] = n[e].slice();
    return new He(t);
  },
  call: function(t, n) {
    if ((s = arguments.length - 2) > 0) for (var e = new Array(s), o = 0, s, r; o < s; ++o) e[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (r = this._[t], o = 0, s = r.length; o < s; ++o) r[o].value.apply(n, e);
  },
  apply: function(t, n, e) {
    if (!this._.hasOwnProperty(t)) throw new Error("unknown type: " + t);
    for (var o = this._[t], s = 0, r = o.length; s < r; ++s) o[s].value.apply(n, e);
  }
};
function jr(t, n) {
  for (var e = 0, o = t.length, s; e < o; ++e)
    if ((s = t[e]).name === n)
      return s.value;
}
function Pn(t, n, e) {
  for (var o = 0, s = t.length; o < s; ++o)
    if (t[o].name === n) {
      t[o] = xr, t = t.slice(0, o).concat(t.slice(o + 1));
      break;
    }
  return e != null && t.push({ name: n, value: e }), t;
}
var _e = 0, Re = 0, Le = 0, vo = 1e3, Je, Oe, Ve = 0, fe = 0, en = 0, We = typeof performance == "object" && performance.now ? performance : Date, mo = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function yo() {
  return fe || (mo(Mr), fe = We.now() + en);
}
function Mr() {
  fe = 0;
}
function vn() {
  this._call = this._time = this._next = null;
}
vn.prototype = bo.prototype = {
  constructor: vn,
  restart: function(t, n, e) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    e = (e == null ? yo() : +e) + (n == null ? 0 : +n), !this._next && Oe !== this && (Oe ? Oe._next = this : Je = this, Oe = this), this._call = t, this._time = e, mn();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, mn());
  }
};
function bo(t, n, e) {
  var o = new vn();
  return o.restart(t, n, e), o;
}
function Ar() {
  yo(), ++_e;
  for (var t = Je, n; t; )
    (n = fe - t._time) >= 0 && t._call.call(void 0, n), t = t._next;
  --_e;
}
function Wn() {
  fe = (Ve = We.now()) + en, _e = Re = 0;
  try {
    Ar();
  } finally {
    _e = 0, Sr(), fe = 0;
  }
}
function Ir() {
  var t = We.now(), n = t - Ve;
  n > vo && (en -= n, Ve = t);
}
function Sr() {
  for (var t, n = Je, e, o = 1 / 0; n; )
    n._call ? (o > n._time && (o = n._time), t = n, n = n._next) : (e = n._next, n._next = null, n = t ? t._next = e : Je = e);
  Oe = t, mn(o);
}
function mn(t) {
  if (!_e) {
    Re && (Re = clearTimeout(Re));
    var n = t - fe;
    n > 24 ? (t < 1 / 0 && (Re = setTimeout(Wn, t - We.now() - en)), Le && (Le = clearInterval(Le))) : (Le || (Ve = We.now(), Le = setInterval(Ir, vo)), _e = 1, mo(Wn));
  }
}
const Cr = 1664525, Nr = 1013904223, Fn = 4294967296;
function Er() {
  let t = 1;
  return () => (t = (Cr * t + Nr) % Fn) / Fn;
}
function Lr(t) {
  return t.x;
}
function Tr(t) {
  return t.y;
}
var Rr = 10, Or = Math.PI * (3 - Math.sqrt(5));
function Dr(t) {
  var n, e = 1, o = 1e-3, s = 1 - Math.pow(o, 1 / 300), r = 0, u = 0.6, a = /* @__PURE__ */ new Map(), d = bo(p), l = go("tick", "end"), c = Er();
  t == null && (t = []);
  function p() {
    m(), l.call("tick", n), e < o && (d.stop(), l.call("end", n));
  }
  function m(x) {
    var w, g = t.length, h;
    x === void 0 && (x = 1);
    for (var A = 0; A < x; ++A)
      for (e += (r - e) * s, a.forEach(function(S) {
        S(e);
      }), w = 0; w < g; ++w)
        h = t[w], h.fx == null ? h.x += h.vx *= u : (h.x = h.fx, h.vx = 0), h.fy == null ? h.y += h.vy *= u : (h.y = h.fy, h.vy = 0);
    return n;
  }
  function f() {
    for (var x = 0, w = t.length, g; x < w; ++x) {
      if (g = t[x], g.index = x, g.fx != null && (g.x = g.fx), g.fy != null && (g.y = g.fy), isNaN(g.x) || isNaN(g.y)) {
        var h = Rr * Math.sqrt(0.5 + x), A = x * Or;
        g.x = h * Math.cos(A), g.y = h * Math.sin(A);
      }
      (isNaN(g.vx) || isNaN(g.vy)) && (g.vx = g.vy = 0);
    }
  }
  function j(x) {
    return x.initialize && x.initialize(t, c), x;
  }
  return f(), n = {
    tick: m,
    restart: function() {
      return d.restart(p), n;
    },
    stop: function() {
      return d.stop(), n;
    },
    nodes: function(x) {
      return arguments.length ? (t = x, f(), a.forEach(j), n) : t;
    },
    alpha: function(x) {
      return arguments.length ? (e = +x, n) : e;
    },
    alphaMin: function(x) {
      return arguments.length ? (o = +x, n) : o;
    },
    alphaDecay: function(x) {
      return arguments.length ? (s = +x, n) : +s;
    },
    alphaTarget: function(x) {
      return arguments.length ? (r = +x, n) : r;
    },
    velocityDecay: function(x) {
      return arguments.length ? (u = 1 - x, n) : 1 - u;
    },
    randomSource: function(x) {
      return arguments.length ? (c = x, a.forEach(j), n) : c;
    },
    force: function(x, w) {
      return arguments.length > 1 ? (w == null ? a.delete(x) : a.set(x, j(w)), n) : a.get(x);
    },
    find: function(x, w, g) {
      var h = 0, A = t.length, S, $, T, C, W;
      for (g == null ? g = 1 / 0 : g *= g, h = 0; h < A; ++h)
        C = t[h], S = x - C.x, $ = w - C.y, T = S * S + $ * $, T < g && (W = C, g = T);
      return W;
    },
    on: function(x, w) {
      return arguments.length > 1 ? (l.on(x, w), n) : l.on(x);
    }
  };
}
function Pr() {
  var t, n, e, o, s = Mt(-30), r, u = 1, a = 1 / 0, d = 0.81;
  function l(f) {
    var j, x = t.length, w = An(t, Lr, Tr).visitAfter(p);
    for (o = f, j = 0; j < x; ++j) n = t[j], w.visit(m);
  }
  function c() {
    if (t) {
      var f, j = t.length, x;
      for (r = new Array(j), f = 0; f < j; ++f) x = t[f], r[x.index] = +s(x, f, t);
    }
  }
  function p(f) {
    var j = 0, x, w, g = 0, h, A, S;
    if (f.length) {
      for (h = A = S = 0; S < 4; ++S)
        (x = f[S]) && (w = Math.abs(x.value)) && (j += x.value, g += w, h += w * x.x, A += w * x.y);
      f.x = h / g, f.y = A / g;
    } else {
      x = f, x.x = x.data.x, x.y = x.data.y;
      do
        j += r[x.data.index];
      while (x = x.next);
    }
    f.value = j;
  }
  function m(f, j, x, w) {
    if (!f.value) return !0;
    var g = f.x - n.x, h = f.y - n.y, A = w - j, S = g * g + h * h;
    if (A * A / d < S)
      return S < a && (g === 0 && (g = ee(e), S += g * g), h === 0 && (h = ee(e), S += h * h), S < u && (S = Math.sqrt(u * S)), n.vx += g * f.value * o / S, n.vy += h * f.value * o / S), !0;
    if (f.length || S >= a) return;
    (f.data !== n || f.next) && (g === 0 && (g = ee(e), S += g * g), h === 0 && (h = ee(e), S += h * h), S < u && (S = Math.sqrt(u * S)));
    do
      f.data !== n && (A = r[f.data.index] * o / S, n.vx += g * A, n.vy += h * A);
    while (f = f.next);
  }
  return l.initialize = function(f, j) {
    t = f, e = j, c();
  }, l.strength = function(f) {
    return arguments.length ? (s = typeof f == "function" ? f : Mt(+f), c(), l) : s;
  }, l.distanceMin = function(f) {
    return arguments.length ? (u = f * f, l) : Math.sqrt(u);
  }, l.distanceMax = function(f) {
    return arguments.length ? (a = f * f, l) : Math.sqrt(a);
  }, l.theta = function(f) {
    return arguments.length ? (d = f * f, l) : Math.sqrt(d);
  }, l;
}
function Wr(t) {
  var n = Mt(0.1), e, o, s;
  typeof t != "function" && (t = Mt(t == null ? 0 : +t));
  function r(a) {
    for (var d = 0, l = e.length, c; d < l; ++d)
      c = e[d], c.vx += (s[d] - c.x) * o[d] * a;
  }
  function u() {
    if (e) {
      var a, d = e.length;
      for (o = new Array(d), s = new Array(d), a = 0; a < d; ++a)
        o[a] = isNaN(s[a] = +t(e[a], a, e)) ? 0 : +n(e[a], a, e);
    }
  }
  return r.initialize = function(a) {
    e = a, u();
  }, r.strength = function(a) {
    return arguments.length ? (n = typeof a == "function" ? a : Mt(+a), u(), r) : n;
  }, r.x = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : Mt(+a), u(), r) : t;
  }, r;
}
function Fr(t) {
  var n = Mt(0.1), e, o, s;
  typeof t != "function" && (t = Mt(t == null ? 0 : +t));
  function r(a) {
    for (var d = 0, l = e.length, c; d < l; ++d)
      c = e[d], c.vy += (s[d] - c.y) * o[d] * a;
  }
  function u() {
    if (e) {
      var a, d = e.length;
      for (o = new Array(d), s = new Array(d), a = 0; a < d; ++a)
        o[a] = isNaN(s[a] = +t(e[a], a, e)) ? 0 : +n(e[a], a, e);
    }
  }
  return r.initialize = function(a) {
    e = a, u();
  }, r.strength = function(a) {
    return arguments.length ? (n = typeof a == "function" ? a : Mt(+a), u(), r) : n;
  }, r.y = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : Mt(+a), u(), r) : t;
  }, r;
}
const Br = {
  project: "anchor",
  charter: "anchor",
  program: "anchor",
  workstream: "anchor",
  work_unit: "anchor",
  work: "anchor",
  task: "anchor",
  run: "anchor",
  milestone: "anchor",
  history: "anchor",
  era: "anchor",
  stage: "anchor",
  ontology: "anchor",
  subject: "anchor",
  goal: "anchor",
  epic: "anchor",
  phase: "anchor",
  invariant: "rule",
  constraint: "rule",
  rule: "rule",
  rule_set: "rule",
  design_rule: "rule",
  definition: "rule",
  requirement: "rule",
  governance: "rule",
  design: "rule",
  specification: "rule",
  policy: "rule",
  claim: "rule",
  schema: "rule",
  decision: "decision",
  approach: "decision",
  candidate: "decision",
  alternative: "decision",
  choice: "decision",
  selection: "decision",
  tradeoff: "decision",
  evidence: "evidence",
  proof: "evidence",
  experiment: "evidence",
  experiment_set: "evidence",
  observation: "evidence",
  audit: "evidence",
  artifact: "evidence",
  reference: "evidence",
  paper: "evidence",
  verification: "evidence",
  acceptance: "evidence",
  reflection: "evidence",
  integration_receipt: "evidence",
  measurement: "evidence",
  benchmark: "evidence",
  risk: "risk",
  failure: "risk",
  contradiction: "risk",
  reopening: "risk",
  legacy: "risk",
  rejected_approach: "risk",
  false_green: "risk",
  blocker: "risk",
  threat: "risk",
  conflict: "risk",
  regression: "risk",
  incident: "risk",
  question: "open",
  research_question: "open",
  proof_obligation: "open",
  obligation: "open",
  gate: "open",
  hypothesis: "open",
  unknown: "open",
  assumption: "open",
  agent: "agent",
  cursor: "agent",
  operator: "agent"
};
function $t(t) {
  return Br[String(t || "").toLowerCase()] || "note";
}
const zr = {
  anchor: "var(--jr-accent)",
  rule: "var(--jr-rule)",
  decision: "var(--jr-decision)",
  evidence: "var(--jr-evidence)",
  risk: "var(--jr-danger)",
  open: "var(--jr-warn)",
  agent: "var(--jr-accent-strong)",
  note: "var(--jr-muted)"
}, Bn = {
  anchor: "Structure",
  rule: "Rules",
  decision: "Decisions",
  evidence: "Evidence",
  risk: "Risk",
  open: "Open",
  agent: "Agents",
  note: "Notes"
}, wo = ["anchor", "rule", "decision", "evidence", "open", "risk", "note"];
function $e(t) {
  return zr[$t(t)];
}
function De(t, n) {
  const e = n;
  switch (t) {
    case "anchor": {
      const o = e * 0.92, s = o * 0.34;
      return `M ${-o + s} ${-o} H ${o - s} Q ${o} ${-o} ${o} ${-o + s} V ${o - s} Q ${o} ${o} ${o - s} ${o} H ${-o + s} Q ${-o} ${o} ${-o} ${o - s} V ${-o + s} Q ${-o} ${-o} ${-o + s} ${-o} Z`;
    }
    case "rule": {
      const o = [];
      for (let s = 0; s < 6; s++) {
        const r = Math.PI / 3 * s - Math.PI / 2;
        o.push(`${(Math.cos(r) * e).toFixed(2)} ${(Math.sin(r) * e).toFixed(2)}`);
      }
      return `M ${o.join(" L ")} Z`;
    }
    case "decision": {
      const o = e * 1.16;
      return `M 0 ${-o} L ${o} 0 L 0 ${o} L ${-o} 0 Z`;
    }
    case "risk": {
      const o = e * 1.2, s = e * 1.28, r = e * 0.28;
      return `M 0 ${-o} L ${s} ${o * 0.78} Q ${s} ${o * 0.78 + r} ${s - r} ${o * 0.78 + r} H ${-s + r} Q ${-s} ${o * 0.78 + r} ${-s} ${o * 0.78} Z`;
    }
    default:
      return `M ${-e} 0 A ${e} ${e} 0 1 0 ${e} 0 A ${e} ${e} 0 1 0 ${-e} 0 Z`;
  }
}
function ko(t) {
  return t === "open";
}
const Yr = {
  contains: "structure",
  owns: "structure",
  precedes: "structure",
  next: "structure",
  defines: "structure",
  delegates: "structure",
  projects_from: "structure",
  binds: "structure",
  used_by: "structure",
  part_of: "structure",
  includes: "structure",
  supports: "support",
  verifies: "support",
  evaluates: "support",
  requires_proof: "support",
  candidate_for: "support",
  learned_from: "support",
  governed_by: "support",
  governs: "support",
  motivates: "support",
  informs: "support",
  cites: "support",
  relates: "support",
  duplicates: "support",
  contradicts: "conflict",
  conflicts: "conflict",
  refutes: "conflict",
  rejects: "conflict",
  blocks: "conflict",
  threatens: "conflict",
  deletes: "conflict",
  invalidates: "conflict",
  superseded_by: "succession",
  supersedes: "succession",
  selects: "succession",
  requires_integration: "succession",
  replaced_by: "succession",
  causes: "succession",
  positioned_at: "presence",
  focused_on: "presence",
  assigned_to: "presence"
};
function ce(t) {
  return Yr[String(t || "").toLowerCase()] || "support";
}
function Sn(t) {
  return ce(t.kind) === "presence";
}
function qr(t) {
  const n = t.metadata || {};
  return String(n.origin || "") === "derived-llm";
}
function yn(t) {
  let n = 2166136261;
  for (let e = 0; e < t.length; e++)
    n ^= t.charCodeAt(e), n = Math.imul(n, 16777619);
  return n >>> 0;
}
function Ur(t) {
  let n = t || 1;
  return () => (n = Math.imul(1664525, n) + 1013904223 >>> 0, n / 4294967296);
}
const Xr = /* @__PURE__ */ new Set([...`iljtIfr.,;:'"!|()[]{} `]), Hr = /* @__PURE__ */ new Set([..."MWmw@%&"]);
function Ge(t, n = 9) {
  let e = 0;
  for (const o of t) e += Xr.has(o) ? 2.5 : Hr.has(o) ? 7.6 : 4.95;
  return e * n / 9;
}
function Gr(t, n = 128, e = 2) {
  const o = String(t || "").trim().split(/\s+/).filter(Boolean);
  if (!o.length) return ["untitled"];
  const s = [];
  let r = "";
  for (const a of o) {
    const d = r ? `${r} ${a}` : a;
    r && Ge(d) > n && s.length < e - 1 ? (s.push(r), r = a) : r = d;
  }
  s.push(r);
  const u = s.length - 1;
  if (Ge(s[u]) > n) {
    let a = s[u];
    for (; a.length > 1 && Ge(`${a}…`) > n; ) a = a.slice(0, -1);
    s[u] = `${a.trimEnd()}…`;
  }
  return s;
}
function Kr(t, n) {
  const e = 6.6 + Math.sqrt(Math.max(0, t)) * 3.1, o = n === "anchor" ? 1.12 : n === "note" ? 0.86 : 1;
  return Math.min(17.5, e) * o;
}
const bn = 10.4;
function Jr(t, n, e = !1) {
  const o = $t(t.kind), s = Kr(n, o), r = Gr(t.label, e ? 132 : 112, e ? 2 : 1), u = Math.max(...r.map((a) => Ge(a)));
  return {
    radius: s,
    lines: r,
    halfWidth: Math.max(s + 3, u / 2 + 4),
    top: s + 3,
    bottom: s + 6 + r.length * bn
  };
}
function zn(t, n) {
  return t.bottom + n.top;
}
function Vr(t) {
  return Math.max(t.halfWidth, (t.top + t.bottom) / 2);
}
const Zr = 0.25, wn = 420;
function Qr(t, n) {
  let e = 1 / 0, o = -1 / 0;
  for (const s of t) {
    const [r, u] = n(s);
    r < e && (e = r), u > o && (o = u);
  }
  return [e, o];
}
function _o(t) {
  const n = /* @__PURE__ */ new Map();
  for (const e of t)
    Sn(e) || (n.set(e.from, (n.get(e.from) || 0) + 1), n.set(e.to, (n.get(e.to) || 0) + 1));
  return n;
}
function kn(t) {
  const n = t.x ?? t.metadata?.x, e = t.y ?? t.metadata?.y;
  if (n == null || n === "" || e === void 0 || e === null || e === "") return;
  const o = Number(n), s = Number(e);
  return Number.isFinite(o) && Number.isFinite(s) ? [o, s] : void 0;
}
function ti(t, n, e, o, s, r) {
  const u = r ? void 0 : kn(t);
  if (u) return u;
  const a = s?.get(t.id);
  if (a) return [a.px, a.py];
  const d = yn(`${t.kind}:${t.id}`), l = d % 360 / 180 * Math.PI, c = 0.25 + (d >>> 9) % 48 / 80, p = (n % 7 - 3) * 5;
  return [
    e / 2 + Math.cos(l) * (e / 2) * c + p,
    o / 2 + Math.sin(l) * (o / 2) * c - p
  ];
}
function ei(t, n, e = 920, o = 620, s = /* @__PURE__ */ new Set(), r, u, a) {
  const d = t, l = !!a?.unpin, c = _o(n), p = new Map(d.map((L) => [L.id, Jr(L, c.get(L.id) || 0, s.has(L.id))]));
  let m = 0;
  if (r?.size) for (const L of d)
    r.has(L.id) && m++;
  const f = m > 0 && (d.length - m) / d.length > Zr, j = d.map((L, nt) => {
    const V = p.get(L.id), K = u?.get(L.id), ft = l ? void 0 : kn(L), [ut, ct] = K ? [K.px, K.py] : ti(L, nt, e, o, r, l), pt = Math.max(V.halfWidth, Math.min(e - V.halfWidth, ut)), vt = Math.max(V.top, Math.min(o - V.bottom, ct)), mt = !f && r?.has(L.id);
    return {
      id: L.id,
      record: L,
      box: V,
      x: pt,
      y: vt,
      vx: 0,
      vy: 0,
      // `pinned` protects semantic content from automatic replacement. Only an
      // explicit layout.position-set or a reader's drag owns a screen coordinate.
      fx: ft || K || mt ? pt : null,
      fy: ft || K || mt ? vt : null
    };
  }), x = new Set(j.map((L) => L.id)), w = new Map(d.map((L) => [L.id, L])), g = (L) => {
    let nt = L;
    const V = /* @__PURE__ */ new Set([nt.id]);
    for (; nt.parent_id && w.has(nt.parent_id) && !V.has(nt.parent_id); ) {
      const K = w.get(nt.parent_id);
      if (!K.parent_id || !w.has(K.parent_id)) return nt.id;
      V.add(K.id), nt = K;
    }
    return nt.id;
  }, h = n.filter((L) => !Sn(L) && x.has(L.from) && x.has(L.to)).map((L) => ({ source: L.from, target: L.to })), A = yn([...x].sort().join("|") + h.length), S = /* @__PURE__ */ new Map(), $ = [...new Set(d.map((L) => g(L)))].sort();
  $.forEach((L, nt) => {
    const V = nt / $.length * Math.PI * 2 + A % 360 / 180 * Math.PI;
    S.set(L, [
      e / 2 + Math.cos(V) * e * 0.3,
      o / 2 + Math.sin(V) * o * 0.28
    ]);
  });
  const T = (L, nt) => {
    const V = S.get(g(L));
    return V ? nt === "x" ? V[0] : V[1] : nt === "x" ? e / 2 : o / 2;
  }, C = !f && m > 0, W = d.length > wn, D = (L) => W ? L.radius + 6 : Vr(L) * 0.92, J = Dr(j).randomSource(Ur(A)).alpha(C ? 0.45 : 1).alphaDecay(0.035).velocityDecay(0.42).force("link", _r(h).id((L) => L.id).distance(72).strength(0.24)).force("charge", Pr().strength(-108).distanceMin(16).distanceMax(300)).force("collision", wr().radius((L) => D(L.box)).strength(1).iterations(3)).force("x", Wr((L) => L.record.parent_id ? T(L.record, "x") : e / 2).strength((L) => L.record.parent_id ? 0.34 : 0.2)).force("y", Fr((L) => L.record.parent_id ? T(L.record, "y") : o / 2).strength((L) => L.record.parent_id ? 0.34 : 0.2)).force("center", er(e / 2, o / 2).strength(0.04)).stop(), rt = j.length > 2e3 ? 0.35 : j.length > 600 ? 0.6 : 1, E = Math.max(40, Math.round((C ? 90 : 260) * rt));
  for (let L = 0; L < E; L++) J.tick();
  J.stop();
  const I = j.map((L) => ({
    ...L.record,
    px: Math.max(L.box.halfWidth, Math.min(e - L.box.halfWidth, Number(L.x) || e / 2)),
    py: Math.max(L.box.top, Math.min(o - L.box.bottom, Number(L.y) || o / 2)),
    vx: Number(L.vx) || 0,
    vy: Number(L.vy) || 0,
    family: $t(L.record.kind),
    color: $e(L.record.kind),
    degree: c.get(L.id) || 0,
    box: L.box,
    held: !!u?.get(L.id)
  })), N = (L) => L.box;
  if (I.length > 1 && !C && (l || !I.some((L) => kn(L))) && !u?.size) {
    const L = (nt) => {
      const V = nt === "x" ? e : o, K = (at) => nt === "x" ? N(at).halfWidth : N(at).top, ft = (at) => nt === "x" ? N(at).halfWidth : N(at).bottom, ut = (at) => nt === "x" ? at.px : at.py, [ct, pt] = Qr(I, (at) => [ut(at) - K(at), ut(at) + ft(at)]), vt = Math.max(1, pt - ct), mt = Math.min(4, Math.max(1, V * 0.88 / vt));
      if (mt <= 1.025) return;
      const Lt = (ct + pt) / 2;
      for (const at of I) {
        const et = V / 2 + (ut(at) - Lt) * mt;
        nt === "x" ? at.px = Math.max(K(at), Math.min(V - ft(at), et)) : at.py = Math.max(K(at), Math.min(V - ft(at), et));
      }
    };
    L("x"), L("y");
  }
  const Z = I.length > wn ? 0 : I.length > 70 ? 64 : 220, it = (L, nt, V) => {
    const K = N(L), ft = nt === "x" ? L.px : L.py, ut = nt === "x" ? K.halfWidth : K.top, ct = nt === "x" ? e - K.halfWidth : o - K.bottom, pt = Math.max(ut, Math.min(Math.max(ut, ct), ft + V));
    return nt === "x" ? L.px = pt : L.py = pt, pt - ft;
  };
  for (let L = 0; L < Z; L++) {
    let nt = !1;
    for (let V = 0; V < I.length; V++) {
      const K = I[V], ft = N(K);
      for (let ut = V + 1; ut < I.length; ut++) {
        const ct = I[ut], pt = N(ct), vt = ct.px - K.px, mt = ct.py - K.py, Lt = ft.halfWidth + pt.halfWidth, at = mt >= 0 ? zn(ft, pt) : zn(pt, ft), et = Lt + 4 - Math.abs(vt), dt = at + 3 - Math.abs(mt);
        if (et <= 0 || dt <= 0) continue;
        nt = !0;
        const Ut = et / Lt < dt / at ? "x" : "y", gt = (_t) => {
          const kt = _t === "x" ? vt : mt, xt = kt === 0 ? yn(_t === "x" ? `${K.id}:${ct.id}` : `${ct.id}:${K.id}`) % 2 ? 1 : -1 : Math.sign(kt), Tt = (_t === "x" ? et : dt) + 0.3;
          let St = 0;
          return K.held || (St -= it(K, _t, -xt * (Tt / 2)) * xt), ct.held || (St += it(ct, _t, xt * Math.max(0, Tt - St)) * xt), !K.held && St + 0.01 < Tt && (St -= it(K, _t, -xt * (Tt - St)) * xt), St > 0.01;
        };
        gt(Ut) || gt(Ut === "x" ? "y" : "x");
      }
    }
    if (!nt) break;
  }
  return I;
}
function ni(t) {
  const n = [...t].sort((s, r) => s[0] - r[0] || s[1] - r[1]), e = (s, r, u) => (r[0] - s[0]) * (u[1] - s[1]) - (r[1] - s[1]) * (u[0] - s[0]), o = (s) => {
    const r = [];
    for (const u of s) {
      for (; r.length >= 2 && e(r[r.length - 2], r[r.length - 1], u) <= 0; ) r.pop();
      r.push(u);
    }
    return r.pop(), r;
  };
  return n.length < 3 ? n : [...o(n), ...o([...n].reverse())];
}
function oi(t) {
  if (t.length < 3) return "";
  const n = [`M ${t[0][0].toFixed(1)} ${t[0][1].toFixed(1)}`], e = t.length;
  for (let o = 0; o < e; o++) {
    const s = t[(o - 1 + e) % e], r = t[o], u = t[(o + 1) % e], a = t[(o + 2) % e], d = r[0] + (u[0] - s[0]) / 6, l = r[1] + (u[1] - s[1]) / 6, c = u[0] - (a[0] - r[0]) / 6, p = u[1] - (a[1] - r[1]) / 6;
    n.push(`C ${d.toFixed(1)} ${l.toFixed(1)} ${c.toFixed(1)} ${p.toFixed(1)} ${u[0].toFixed(1)} ${u[1].toFixed(1)}`);
  }
  return `${n.join(" ")} Z`;
}
function si(t) {
  let n = 0;
  for (let e = 0; e < t.length; e++) {
    const [o, s] = t[e], [r, u] = t[(e + 1) % t.length];
    n += o * u - r * s;
  }
  return Math.abs(n) / 2;
}
function ri(t, n = 0, e = 0, o = 30) {
  const s = new Map(t.map((l) => [l.id, l])), r = (l) => {
    const c = [l], p = /* @__PURE__ */ new Set([l.id]);
    let m = l;
    for (; m.parent_id && s.has(m.parent_id) && !p.has(m.parent_id); )
      p.add(m.parent_id), m = s.get(m.parent_id), c.push(m);
    return c.length >= 2 ? c[c.length - 2] : null;
  }, u = /* @__PURE__ */ new Map();
  for (const l of t) {
    const c = r(l);
    if (!c) continue;
    const p = u.get(c.id) || [];
    p.push(l), u.set(c.id, p);
  }
  const a = n * e, d = [];
  for (const [l, c] of u) {
    if (c.length < 3) continue;
    const p = s.get(l), m = [];
    for (const A of c) {
      const S = A.box.radius + 5;
      for (let $ = 0; $ < 8; $++) {
        const T = $ / 8 * Math.PI * 2;
        m.push([A.px + Math.cos(T) * S, A.py + Math.sin(T) * S * 1.25]);
      }
    }
    const f = ni(m);
    if (f.length < 3) continue;
    const j = f.reduce((A, S) => A + S[0], 0) / f.length, x = f.reduce((A, S) => A + S[1], 0) / f.length, w = f.map(([A, S]) => {
      const $ = A - j, T = S - x, C = Math.max(1, Math.hypot($, T));
      return [A + $ / C * o, S + T / C * o];
    });
    if (a && si(w) > a * 0.42) continue;
    const g = oi(w);
    if (!g) continue;
    const h = Math.min(...w.map((A) => A[1]));
    d.push({
      id: l,
      label: p?.label || l,
      family: p ? p.family : "note",
      path: g,
      size: c.length,
      labelX: j,
      labelY: h + 15
    });
  }
  return d.sort((l, c) => c.size - l.size || l.id.localeCompare(c.id));
}
const ii = ["viewBox"], ai = ["d"], xe = /* @__PURE__ */ At({
  __name: "FamilyMark",
  props: {
    family: {},
    radius: { default: 7 },
    viewBox: { default: "-12 -12 24 24" },
    hollow: { type: Boolean }
  },
  setup(t) {
    const n = t, e = O(() => De(n.family, n.radius)), o = O(() => n.hollow ?? ko(n.family));
    return (s, r) => (b(), k("svg", {
      viewBox: t.viewBox,
      "aria-hidden": "true"
    }, [
      i("path", {
        d: e.value,
        class: tt({ hollow: o.value })
      }, null, 10, ai)
    ], 8, ii));
  }
}), _n = 5;
function li(t) {
  const n = {
    id: t.id,
    kind: t.kind,
    label: t.label,
    parent_id: t.parent_id,
    pinned: t.pinned,
    x: t.x,
    y: t.y
  }, e = t.metadata?.x, o = t.metadata?.y;
  return (e !== void 0 || o !== void 0) && (n.metadata = { x: e, y: o }), n;
}
function ui(t) {
  return { id: t.id, from: t.from, to: t.to, kind: t.kind };
}
function Yn(t) {
  const n = Date.now(), e = new Map(t.previous.map(([l, c, p]) => [l, { px: c, py: p }])), o = new Map(t.held.map(([l, c, p]) => [l, { px: c, py: p }])), s = ei(
    t.nodes,
    t.edges,
    t.width,
    t.height,
    new Set(t.emphasis),
    e,
    o,
    { unpin: t.unpin }
  ), r = new Array(s.length), u = new Array(s.length), a = new Float32Array(s.length * 2), d = new Float32Array(s.length * _n);
  for (let l = 0; l < s.length; l++) {
    const c = s[l];
    r[l] = c.id, u[l] = c.box.lines, a[l * 2] = c.px, a[l * 2 + 1] = c.py;
    const p = l * _n;
    d[p] = c.box.radius, d[p + 1] = c.box.halfWidth, d[p + 2] = c.box.top, d[p + 3] = c.box.bottom, d[p + 4] = c.degree;
  }
  return {
    generation: t.generation,
    ids: r,
    labels: u,
    positions: a,
    geometry: d,
    width: t.width,
    height: t.height,
    ms: Date.now() - n
  };
}
const ci = {
  ids: [],
  index: /* @__PURE__ */ new Map(),
  positions: new Float32Array(0),
  geometry: new Float32Array(0),
  labels: [],
  width: 0,
  height: 0,
  ms: 0
};
function cn(t) {
  const n = /* @__PURE__ */ new Map();
  for (let e = 0; e < t.ids.length; e++) n.set(t.ids[e], e);
  return {
    ids: t.ids,
    index: n,
    positions: t.positions,
    geometry: t.geometry,
    labels: t.labels,
    width: t.width,
    height: t.height,
    ms: t.ms
  };
}
function di(t, n) {
  const e = t.index.get(n);
  return e === void 0 ? null : { x: t.positions[e * 2], y: t.positions[e * 2 + 1] };
}
class hi {
  constructor(n) {
    this.makeWorker = n;
  }
  worker = null;
  generation = 0;
  memory = [];
  busy = !1;
  pending = null;
  /** Abandons the solve currently in the worker, so nothing waits on a dead one. */
  abandon = null;
  disposed = !1;
  /**
   * A reader's re-layout is a promise, not a race entrant: once asked for, it
   * rides every request until a solve actually reaches the screen. Without
   * this, a routine refresh arriving mid-solve would supersede the re-layout
   * and quietly leave the old arrangement in force.
   */
  sticky = { fresh: !1, unpin: !1 };
  /** Positions from the previous solve, so the next one keeps spatial memory. */
  remembered() {
    return this.memory;
  }
  remember(n) {
    const e = new Array(n.ids.length);
    for (let o = 0; o < n.ids.length; o++)
      e[o] = [n.ids[o], n.positions[o * 2], n.positions[o * 2 + 1]];
    this.memory = e;
  }
  request(n) {
    return {
      generation: ++this.generation,
      nodes: n.nodes.map(li),
      edges: n.edges.map(ui),
      width: Math.max(1, Math.round(n.width)),
      height: Math.max(1, Math.round(n.height)),
      emphasis: [...n.emphasis],
      previous: n.fresh ? [] : this.memory,
      held: [...n.held].map(([e, o]) => [e, o.px, o.py]),
      unpin: n.unpin
    };
  }
  /**
   * One solve at a time, with at most one request held behind it.
   *
   * A solve over a large journal costs real time, and the things that ask for
   * one arrive in bursts: a projection refresh, a drag on the pane edge, a
   * chunk of a whole-graph read. Queuing a solve per event would run them all
   * and repaint each superseded layout in turn on the way to the current one.
   *
   * So the newest request is the only one worth answering. It replaces whatever
   * was waiting, and it supersedes whatever is running — a superseded solve
   * answers `null`, which says the caller has nothing to paint because a newer
   * layout is already on its way.
   */
  solve(n) {
    if (this.disposed) return Promise.resolve(null);
    n.fresh && (this.sticky.fresh = !0), n.unpin && (this.sticky.unpin = !0);
    const e = { ...n, fresh: this.sticky.fresh, unpin: this.sticky.unpin };
    return this.busy ? (this.pending?.settle(null), new Promise((o) => {
      this.pending = { input: e, settle: o };
    })) : this.run(e);
  }
  async run(n) {
    this.busy = !0;
    try {
      const e = await this.dispatch(n);
      return this.pending || this.disposed ? null : (e && n.fresh && (this.sticky.fresh = !1), e && n.unpin && (this.sticky.unpin = !1), e);
    } finally {
      this.busy = !1;
      const e = this.pending;
      e && !this.disposed && (this.pending = null, this.run(e.input).then(e.settle));
    }
  }
  /**
   * Runs one solve in the worker when the runtime has one, and on this thread
   * when it does not. Both run the same projection; only the thread differs.
   */
  dispatch(n) {
    const e = this.request(n);
    if (!this.worker && this.makeWorker)
      try {
        this.worker = this.makeWorker();
      } catch {
        this.worker = null;
      }
    if (!this.worker) {
      const o = cn(Yn(e));
      return this.remember(o), Promise.resolve(o);
    }
    return new Promise((o) => {
      const s = this.worker, r = (d) => {
        s.removeEventListener("message", u), s.removeEventListener("error", a), this.abandon = null, o(d);
      }, u = (d) => {
        if (d.data.generation !== e.generation) return;
        const l = cn(d.data);
        this.remember(l), r(l);
      }, a = () => {
        this.worker?.terminate(), this.worker = null;
        const d = cn(Yn(e));
        this.remember(d), r(d);
      };
      this.abandon = () => r(null), s.addEventListener("message", u), s.addEventListener("error", a), s.postMessage(e);
    });
  }
  /** Drops remembered positions so the next solve lays the graph out afresh. */
  forget() {
    this.memory = [];
  }
  dispose() {
    this.disposed = !0;
    const n = this.pending;
    this.pending = null, n?.settle(null), this.abandon?.(), this.worker?.terminate(), this.worker = null;
  }
}
const fi = 0.04, pi = 3.2;
function Ze(t) {
  return Math.max(fi, Math.min(pi, t));
}
function gi(t) {
  if (!t.length) return null;
  let n = 1 / 0, e = 1 / 0, o = -1 / 0, s = -1 / 0;
  for (const r of t)
    n = Math.min(n, r.x - r.halfWidth), o = Math.max(o, r.x + r.halfWidth), e = Math.min(e, r.y - r.halfHeight), s = Math.max(s, r.y + r.halfHeight);
  return { minX: n, minY: e, maxX: o, maxY: s };
}
function vi(t, n, e = 44, o = 1.5) {
  const s = Math.max(1, n.width), r = Math.max(1, n.height);
  if (!t) return { zoom: 1, x: s / 2, y: r / 2 };
  const u = Math.max(1, t.maxX - t.minX), a = Math.max(1, t.maxY - t.minY), d = { width: Math.max(1, s - e * 2), height: Math.max(1, r - e * 2) }, l = Ze(Math.min(o, Math.min(d.width / u, d.height / a))), c = (t.minX + t.maxX) / 2, p = (t.minY + t.maxY) / 2;
  return { zoom: l, x: s / 2 - c * l, y: r / 2 - p * l };
}
const mi = 11e3, yi = 2600;
function bi(t, n, e) {
  const o = Math.max(320, n.width), s = Math.max(240, n.height), r = o / s, u = t <= wn ? mi : yi, a = Math.max(o * s, Math.max(1, t) * u);
  return { width: Math.round(Math.sqrt(a * r)), height: Math.round(Math.sqrt(a / r)) };
}
function qn(t, n, e, o) {
  const s = Ze(t.zoom * n), r = s / t.zoom;
  return { zoom: s, x: e - (e - t.x) * r, y: o - (o - t.y) * r };
}
function xn(t, n, e) {
  return { x: (n - t.x) / t.zoom, y: (e - t.y) / t.zoom };
}
function wi(t, n, e = 96) {
  const o = e / t.zoom, s = xn(t, 0, 0), r = xn(t, n.width, n.height);
  return {
    minX: s.x - o,
    minY: s.y - o,
    maxX: r.x + o,
    maxY: r.y + o
  };
}
function ki(t, n, e, o, s) {
  return n + o >= t.minX && n - o <= t.maxX && e + s >= t.minY && e - s <= t.maxY;
}
const $n = 0.78;
function Un(t, n) {
  return t < 0.22 || n > 2400 && t < 0.4 ? "envelope" : t < 0.42 || n > 1600 ? "dot" : t < $n || n > 420 ? "mark" : "full";
}
function _i(t, n) {
  return t < 0.42 ? 0 : t >= $n ? n <= 420 ? n : 48 : Math.max(0, Math.min(48, Math.round(48 * ((t - 0.42) / ($n - 0.42)))));
}
function xi(t) {
  return {
    arrows: t === "full",
    labels: t === "full",
    curves: t === "full" || t === "mark"
  };
}
const Xn = 86400, $i = 34, jn = 5, ji = 12, Hn = 54, dn = 96;
function xo(t, n, e) {
  return e * t.columns + n;
}
function Mi(t, n) {
  const e = {
    cell: dn,
    minX: n?.minX ?? 0,
    minY: n?.minY ?? 0,
    columns: Math.max(1, Math.ceil(((n?.maxX ?? 0) - (n?.minX ?? 0)) / dn) + 1),
    rows: Math.max(1, Math.ceil(((n?.maxY ?? 0) - (n?.minY ?? 0)) / dn) + 1),
    buckets: /* @__PURE__ */ new Map()
  };
  for (let o = 0; o < t.length; o++) {
    const s = t[o], r = Math.max(0, Math.min(e.columns - 1, Math.floor((s.x - e.minX) / e.cell))), u = Math.max(0, Math.min(e.rows - 1, Math.floor((s.y - e.minY) / e.cell))), a = xo(e, r, u), d = e.buckets.get(a);
    d ? d.push(o) : e.buckets.set(a, [o]);
  }
  return e;
}
function Ai(t, n, e, o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map()) {
  const r = new Map(n.map((f) => [f.id, f])), u = new Array(t.ids.length);
  for (let f = 0; f < t.ids.length; f++) {
    const j = t.ids[f], x = r.get(j), w = f * _n, g = $t(x?.kind), h = t.geometry[w + 4];
    u[f] = {
      id: j,
      x: t.positions[f * 2],
      y: t.positions[f * 2 + 1],
      radius: t.geometry[w],
      halfWidth: t.geometry[w + 1],
      top: t.geometry[w + 2],
      bottom: t.geometry[w + 3],
      degree: h,
      family: g,
      lines: t.labels[f] || [],
      hollow: ko(g),
      folded: x ? ke(x) : !1,
      settled: x ? tn(x) : !1,
      rank: h + (x?.parent_id ? 0 : 3) + (x?.pinned ? 4 : 0),
      sessions: s.get(j)?.sessions || 0,
      lastWorkedAt: s.get(j)?.lastActivityAt || 0
    };
  }
  const a = t.index, d = [], l = [], c = /* @__PURE__ */ new Map();
  for (const f of e) {
    const j = a.get(f.from), x = a.get(f.to);
    if (j !== void 0 && x !== void 0) {
      if (j === x) continue;
      d.push({
        from: j,
        to: x,
        family: ce(f.kind),
        suggested: qr(f),
        label: f.label || f.kind.replace(/_/g, " ")
      });
      continue;
    }
    const w = j ?? x;
    if (w === void 0) continue;
    const g = j === void 0 ? f.from : f.to, h = c.get(w) || 0;
    c.set(w, h + 1), l.push({
      at: w,
      targetId: g,
      targetLabel: o.get(g) || r.get(g)?.label || g,
      kind: f.kind.replace(/_/g, " "),
      outbound: x === void 0,
      angle: -Math.PI / 2 + h * (Math.PI / 5) * (h % 2 ? 1 : -1)
    });
  }
  const p = gi(u.map((f) => ({
    x: f.x,
    y: f.y + (f.bottom - f.top) / 2,
    halfWidth: f.halfWidth,
    halfHeight: (f.top + f.bottom) / 2
  }))), m = ri(
    u.map((f) => ({
      id: f.id,
      parent_id: r.get(f.id)?.parent_id,
      label: r.get(f.id)?.label || f.id,
      family: f.family,
      px: f.x,
      py: f.y,
      box: { radius: f.radius }
    })),
    t.width,
    t.height
  );
  return { nodes: u, edges: d, ports: l, regions: m, index: a, bounds: p, grid: Mi(u, p) };
}
function Te(t, n, e, o = 6) {
  const s = t.grid, r = Math.floor((n - s.minX) / s.cell), u = Math.floor((e - s.minY) / s.cell);
  let a = "", d = 1 / 0;
  for (let l = -1; l <= 1; l++)
    for (let c = -1; c <= 1; c++) {
      const p = r + c, m = u + l;
      if (!(p < 0 || m < 0 || p >= s.columns || m >= s.rows))
        for (const f of s.buckets.get(xo(s, p, m)) || []) {
          const j = t.nodes[f], x = Math.hypot(j.x - n, j.y - e);
          x <= j.radius + o && x < d && (d = x, a = j.id);
        }
    }
  return a;
}
function $o(t, n) {
  const e = t.nodes[n.at], o = e.radius + $i;
  return { x: e.x + Math.cos(n.angle) * o, y: e.y + Math.sin(n.angle) * o };
}
function Gn(t, n, e, o = 5) {
  for (const s of t.ports) {
    const r = $o(t, s);
    if (Math.hypot(r.x - n, r.y - e) <= jn + o) return s;
  }
  return null;
}
function Ii(t, n, e) {
  const o = wi(n, e), s = [];
  for (let r = 0; r < t.nodes.length; r++) {
    const u = t.nodes[r];
    ki(
      o,
      u.x,
      u.y + (u.bottom - u.top) / 2,
      u.halfWidth,
      (u.top + u.bottom) / 2
    ) && s.push(r);
  }
  return s;
}
const Kn = /* @__PURE__ */ new Map();
function Si(t) {
  let n = Kn.get(t);
  return n || (n = new Path2D(De(t, 1)), Kn.set(t, n)), n;
}
const Jn = /* @__PURE__ */ new Map();
function Vn(t) {
  const n = Jn.get(t);
  if (n) return n;
  const e = t.match(/-?\d*\.?\d+/g), o = e && e.length >= 3 ? [Number(e[0]), Number(e[1]), Number(e[2]), e.length > 3 ? Number(e[3]) : 1] : [128, 128, 128, 1];
  return Jn.set(t, o), o;
}
const Ue = /* @__PURE__ */ new Map(), hn = 16, Ci = 4096;
function Ft(t, n, e) {
  const o = Math.max(0, Math.min(hn, Math.round(e * hn))), s = `${t}|${n}|${o}`, r = Ue.get(s);
  if (r) return r;
  const u = o / hn, [a, d, l, c] = Vn(t);
  let p;
  if (n === "transparent")
    p = `rgba(${a}, ${d}, ${l}, ${(c * u).toFixed(3)})`;
  else {
    const [m, f, j, x] = Vn(n), w = (g, h) => Math.round(g * u + h * (1 - u));
    p = `rgba(${w(a, m)}, ${w(d, f)}, ${w(l, j)}, ${(c * u + x * (1 - u)).toFixed(3)})`;
  }
  return Ue.size >= Ci && Ue.clear(), Ue.set(s, p), p;
}
function Ni(t, n, e, o) {
  const s = _i(o, n.length), r = /* @__PURE__ */ new Set();
  if (!s) return r;
  if (s >= n.length) {
    for (const a of n) r.add(a);
    return r;
  }
  const u = [...n].sort((a, d) => t.nodes[d].rank - t.nodes[a].rank || t.nodes[a].id.localeCompare(t.nodes[d].id));
  for (let a = 0; a < s; a++) r.add(u[a]);
  for (const a of [e.selectedId, e.hoveredId]) {
    const d = a ? t.index.get(a) : void 0;
    d !== void 0 && r.add(d);
  }
  return r;
}
function Ei(t, n, e, o, s, r) {
  const { zoom: u } = e, a = (g) => g * u + e.x, d = (g) => g * u + e.y, l = Ii(n, e, o), c = { nodes: l.length, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }, p = xi(r.detail);
  if (t.clearRect(0, 0, o.width, o.height), r.showRegions && n.regions.length) {
    const g = n.regions.slice(0, ji);
    c.territoriesHeld = n.regions.length - g.length;
    const h = [];
    t.save(), t.translate(e.x, e.y), t.scale(u, u);
    for (const A of g)
      t.fillStyle = Ft(s.family[A.family], "transparent", 0.055), t.fill(new Path2D(A.path)), c.territories++;
    t.restore(), t.textAlign = "center", t.textBaseline = "alphabetic";
    for (const A of g) {
      const S = a(A.labelX), $ = d(A.labelY);
      S < -160 || S > o.width + 160 || $ < 58 || $ > o.height + 40 || h.some(([T, C]) => Math.abs(T - S) < Hn * 3 && Math.abs(C - $) < Hn) || (h.push([S, $]), t.fillStyle = Ft(s.family[A.family], s.bg, 0.66), t.font = `800 ${r.detail === "envelope" ? 12 : 9.5}px Inter, ui-sans-serif, system-ui, sans-serif`, t.fillText(A.label.toUpperCase(), S, $), t.fillStyle = s.muted, t.font = "600 10px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(`${A.size.toLocaleString()} records`, S, $ + 14));
    }
  }
  if (r.detail === "envelope") {
    const g = Math.max(1.4, Math.min(3, u * 8)), h = /* @__PURE__ */ new Map();
    for (const A of l) {
      const S = h.get(n.nodes[A].family);
      S ? S.push(A) : h.set(n.nodes[A].family, [A]);
    }
    for (const [A, S] of h) {
      t.beginPath();
      for (const $ of S) {
        const T = n.nodes[$];
        t.moveTo(a(T.x) + g, d(T.y)), t.arc(a(T.x), d(T.y), g, 0, Math.PI * 2);
      }
      t.fillStyle = Ft(s.family[A], "transparent", 0.62), t.fill();
    }
    return c;
  }
  const m = ["structure", "support", "succession", "conflict"], f = r.hoveredId || r.selectedId, j = f ? n.index.get(f) : void 0;
  for (const g of m) {
    t.beginPath();
    let h = 0;
    for (const A of n.edges) {
      if (A.family !== g || A.suggested) continue;
      const S = n.nodes[A.from], $ = n.nodes[A.to], T = a(S.x), C = d(S.y), W = a($.x), D = d($.y);
      if (!(Math.max(T, W) < 0 || Math.min(T, W) > o.width) && !(Math.max(C, D) < 0 || Math.min(C, D) > o.height)) {
        if (t.moveTo(T, C), p.curves) {
          const J = (T + W) / 2 - (D - C) * 0.09, rt = (C + D) / 2 + (W - T) * 0.09;
          t.quadraticCurveTo(J, rt, W, D);
        } else
          t.lineTo(W, D);
        h++;
      }
    }
    h && (c.edges += h, t.strokeStyle = s.edge[g], t.lineWidth = g === "conflict" ? 1.4 : g === "structure" ? 0.9 : 1.2, t.globalAlpha = j === void 0 ? 1 : 0.24, t.setLineDash(g === "conflict" ? [5, 4] : g === "succession" ? [9, 4] : []), t.stroke(), t.setLineDash([]), t.globalAlpha = 1);
  }
  t.beginPath();
  let x = 0;
  for (const g of n.edges) {
    if (!g.suggested) continue;
    const h = n.nodes[g.from], A = n.nodes[g.to];
    t.moveTo(a(h.x), d(h.y)), t.lineTo(a(A.x), d(A.y)), x++;
  }
  if (x && (c.edges += x, t.strokeStyle = Ft(s.accent, "transparent", 0.34), t.lineWidth = 0.9, t.setLineDash([2, 4]), t.stroke(), t.setLineDash([])), j !== void 0) {
    t.beginPath();
    for (const g of n.edges) {
      if (g.from !== j && g.to !== j) continue;
      const h = n.nodes[g.from], A = n.nodes[g.to];
      t.moveTo(a(h.x), d(h.y)), t.lineTo(a(A.x), d(A.y));
    }
    t.strokeStyle = s.fg, t.globalAlpha = 0.55, t.lineWidth = 1.8, t.stroke(), t.globalAlpha = 1;
  }
  if (r.detail === "dot") {
    const g = /* @__PURE__ */ new Map();
    for (const h of l) {
      const A = g.get(n.nodes[h].family);
      A ? A.push(h) : g.set(n.nodes[h].family, [h]);
    }
    for (const [h, A] of g) {
      t.beginPath();
      for (const S of A) {
        const $ = n.nodes[S], T = Math.max(1.4, $.radius * u * 0.62);
        t.moveTo(a($.x) + T, d($.y)), t.arc(a($.x), d($.y), T, 0, Math.PI * 2);
      }
      t.fillStyle = s.family[h], t.globalAlpha = r.mutedFamily && r.mutedFamily !== h ? 0.16 : 0.9, t.fill(), t.globalAlpha = 1;
    }
  } else
    for (const g of l) {
      const h = n.nodes[g], A = r.mutedFamily ? r.mutedFamily !== h.family : !1, S = s.family[h.family], $ = Math.max(2, h.radius * u);
      t.save(), t.globalAlpha = A ? 0.18 : 1, t.translate(a(h.x), d(h.y)), t.scale($, $);
      const T = Si(h.family);
      if (h.hollow ? (t.fillStyle = Ft(S, s.bg, 0.16), t.fill(T), t.strokeStyle = S, t.lineWidth = 2.6 / $, t.stroke(T)) : (t.fillStyle = h.settled ? Ft(S, s.bg, 0.46) : S, t.fill(T), h.folded && (t.strokeStyle = S, t.lineWidth = 1.6 / $, t.setLineDash([3 / $, 2.4 / $]), t.stroke(T), t.setLineDash([]))), t.restore(), h.lastWorkedAt && r.now - h.lastWorkedAt < Xn) {
        const C = 1 - (r.now - h.lastWorkedAt) / Xn;
        t.beginPath(), t.arc(a(h.x), d(h.y), $ + 5, 0, Math.PI * 2), t.strokeStyle = Ft(s.accent, "transparent", 0.18 + C * 0.62), t.lineWidth = 1 + C * 2.2, t.stroke();
      }
      r.touched.has(h.id) && (t.beginPath(), t.arc(a(h.x), d(h.y), $ + 8, 0, Math.PI * 2), t.strokeStyle = Ft(s.accent, "transparent", 0.4), t.lineWidth = 1.2, t.stroke()), (h.id === r.selectedId || h.id === r.hoveredId) && (t.beginPath(), t.arc(a(h.x), d(h.y), $ + 11, 0, Math.PI * 2), t.strokeStyle = S, t.lineWidth = 1.6, t.setLineDash(h.id === r.selectedId ? [2.5, 3.5] : []), t.stroke(), t.setLineDash([]));
    }
  const w = Ni(n, l, r, u);
  if (w.size) {
    t.textAlign = "center", t.textBaseline = "alphabetic", t.fillStyle = s.fg;
    for (const g of w) {
      const h = n.nodes[g];
      if (r.mutedFamily && r.mutedFamily !== h.family) continue;
      const A = h.id === r.selectedId || h.id === r.hoveredId;
      t.font = `${A ? 720 : 560} 9px Inter, ui-sans-serif, system-ui, sans-serif`;
      const S = d(h.y) + h.radius * u + 11.5;
      for (let $ = 0; $ < h.lines.length; $++)
        t.fillText(h.lines[$], a(h.x), S + $ * bn), c.labels++;
    }
  }
  if (r.detail === "full") {
    t.textAlign = "center", t.fillStyle = s.muted, t.font = "650 8px Inter, ui-sans-serif, system-ui, sans-serif";
    for (const g of w) {
      const h = n.nodes[g];
      if (!h.sessions) continue;
      const A = wt(h.lastWorkedAt, r.now), S = d(h.y) + h.radius * u + 11.5 + h.lines.length * bn;
      t.fillText(`${h.sessions} session${h.sessions === 1 ? "" : "s"}${A ? ` · ${A}` : ""}`, a(h.x), S);
    }
  }
  if (p.labels && j !== void 0) {
    t.textAlign = "center", t.fillStyle = s.muted, t.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
    let g = 0;
    const h = /* @__PURE__ */ new Set();
    for (const A of n.edges) {
      if (g >= 5 || A.suggested || A.family === "structure" || A.from !== j && A.to !== j || h.has(A.label)) continue;
      h.add(A.label), g++;
      const S = n.nodes[A.from], $ = n.nodes[A.to];
      t.fillText(A.label, (a(S.x) + a($.x)) / 2, (d(S.y) + d($.y)) / 2 - 4);
    }
  }
  if (r.detail !== "dot" && n.ports.length) {
    t.textAlign = "left", t.textBaseline = "middle";
    for (const g of n.ports) {
      const h = n.nodes[g.at], A = $o(n, g), S = a(A.x), $ = d(A.y);
      if (S < -180 || S > o.width + 180 || $ < -40 || $ > o.height + 40 || (t.beginPath(), t.moveTo(a(h.x), d(h.y)), t.lineTo(S, $), t.strokeStyle = Ft(s.muted, "transparent", 0.4), t.lineWidth = 1, t.setLineDash([2, 3]), t.stroke(), t.setLineDash([]), t.beginPath(), t.arc(S, $, jn, 0, Math.PI * 2), t.fillStyle = s.bg, t.fill(), t.strokeStyle = s.muted, t.lineWidth = 1.4, t.stroke(), r.detail !== "full")) continue;
      t.fillStyle = s.muted, t.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
      const T = g.targetLabel.length > 26 ? `${g.targetLabel.slice(0, 25)}…` : g.targetLabel;
      t.fillText(`${g.outbound ? "→" : "←"} ${T}`, S + jn + 4, $);
    }
    t.textBaseline = "alphabetic";
  }
  for (const g of r.pins) {
    const h = n.index.get(g.nodeId);
    if (h === void 0) continue;
    const A = n.nodes[h], S = a(A.x) + A.radius * u + 12, $ = d(A.y) - 26;
    if (S < -120 || S > o.width + 120 || $ < -40 || $ > o.height + 40) continue;
    t.globalAlpha = g.stale ? 0.38 : 1, t.beginPath(), t.moveTo(a(A.x), d(A.y)), t.lineTo(S, $ + 9), t.strokeStyle = s.accent, t.lineWidth = 1, t.setLineDash([2, 2.5]), t.stroke(), t.setLineDash([]);
    const T = 26 + g.label.length * 4.6;
    t.beginPath(), t.roundRect(S, $ - 9, T, 18, 9), t.fillStyle = Ft(s.accent, s.bg, 0.14), t.fill(), t.strokeStyle = Ft(s.accent, "transparent", 0.4), t.lineWidth = 1, t.stroke(), t.beginPath(), t.arc(S + 9, $, 6.4, 0, Math.PI * 2), t.fillStyle = s.accent, t.fill(), t.textAlign = "center", t.fillStyle = s.bg, t.font = "850 6.6px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(g.initials, S + 9, $ + 2.3), t.textAlign = "left", t.fillStyle = s.accent, t.font = "700 8.2px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(g.label, S + 19, $ + 2.6), t.globalAlpha = 1;
  }
  return c;
}
const qt = {
  anchor: "--jr-accent",
  rule: "--jr-rule",
  decision: "--jr-decision",
  evidence: "--jr-evidence",
  risk: "--jr-danger",
  open: "--jr-warn",
  agent: "--jr-accent-strong",
  note: "--jr-muted"
}, ye = {
  structure: "--jr-muted",
  support: "--jr-success",
  conflict: "--jr-danger",
  succession: "--jr-decision",
  presence: "--jr-accent"
}, Qt = {
  bg: "--jr-bg",
  fg: "--jr-fg",
  muted: "--jr-muted",
  faint: "--jr-faint",
  border: "--jr-border",
  accent: "--jr-accent",
  panel: "--jr-panel"
};
function Li() {
  return [
    ...Object.values(Qt),
    ...wo.map((t) => qt[t]),
    qt.agent,
    ...Object.values(ye)
  ];
}
function Ti(t) {
  const n = t.createElement("div");
  n.setAttribute("aria-hidden", "true"), n.className = "jr-ink-probe";
  const e = [...new Set(Li())];
  for (const o of e) {
    const s = t.createElement("i");
    s.dataset.token = o, s.style.color = `var(${o})`, n.appendChild(s);
  }
  return n;
}
const Zn = "CanvasText";
function Ri(t) {
  const n = /* @__PURE__ */ new Map();
  for (const o of Array.from(t.children)) {
    const s = o.dataset.token;
    if (!s) continue;
    const r = getComputedStyle(o).color;
    n.set(s, r && r !== "transparent" ? r : Zn);
  }
  const e = (o) => n.get(o) || Zn;
  return {
    bg: e(Qt.bg),
    fg: e(Qt.fg),
    muted: e(Qt.muted),
    faint: e(Qt.faint),
    border: e(Qt.border),
    accent: e(Qt.accent),
    panel: e(Qt.panel),
    family: {
      anchor: e(qt.anchor),
      rule: e(qt.rule),
      decision: e(qt.decision),
      evidence: e(qt.evidence),
      risk: e(qt.risk),
      open: e(qt.open),
      agent: e(qt.agent),
      note: e(qt.note)
    },
    edge: {
      structure: e(ye.structure),
      support: e(ye.support),
      conflict: e(ye.conflict),
      succession: e(ye.succession),
      presence: e(ye.presence)
    }
  };
}
function Oi(t) {
  const n = new MutationObserver(t);
  n.observe(document.documentElement, { attributes: !0, attributeFilter: ["class", "style", "data-theme"] });
  const e = window.matchMedia("(prefers-color-scheme: dark)");
  return e.addEventListener("change", t), () => {
    n.disconnect(), e.removeEventListener("change", t);
  };
}
const Di = { class: "jr-canvas-head" }, Pi = { class: "jr-canvas-stat" }, Wi = { class: "jr-canvas-drawn jr-numeric" }, Fi = {
  key: 0,
  class: "jr-bound-dock",
  role: "group",
  "aria-label": "Whole graph"
}, Bi = { class: "jr-bound-line" }, zi = { class: "jr-numeric" }, Yi = { class: "jr-numeric" }, qi = { class: "jr-bound-bar" }, Ui = { class: "jr-bound-line" }, Xi = { class: "jr-numeric" }, Hi = { class: "jr-numeric" }, Gi = { class: "jr-bound-line error" }, Ki = { class: "jr-bound-line" }, Ji = { class: "jr-numeric" }, Vi = {
  key: 4,
  class: "jr-bound-line"
}, Zi = { class: "jr-numeric" }, Qi = { class: "jr-numeric" }, ta = {
  class: "jr-legend",
  role: "group",
  "aria-label": "Highlight a record family"
}, ea = ["aria-pressed", "title", "onClick"], na = { class: "jr-numeric" }, oa = { class: "jr-canvas-tools" }, sa = ["disabled"], ra = ["disabled"], ia = { class: "jr-zoom-value jr-numeric" }, aa = { class: "jr-hovercard-kind" }, la = { key: 0 }, ua = { key: 0 }, ca = { class: "jr-assemble-dock" }, da = ["title"], ha = ["disabled", "aria-busy", "title"], fa = {
  key: 0,
  class: "jr-spinner",
  "aria-hidden": "true"
}, pa = {
  key: 2,
  class: "jr-canvas-state",
  role: "status"
}, ga = {
  key: 3,
  class: "jr-canvas-state"
}, va = {
  class: "jr-canvas-state-mark",
  viewBox: "-30 -30 60 60",
  "aria-hidden": "true"
}, ma = ["d"], ya = ["d"], ba = ["d"], wa = 4, ka = /* @__PURE__ */ At({
  __name: "GraphLens",
  props: {
    readOnly: { type: Boolean },
    nodes: {},
    edges: {},
    presence: {},
    touchedIds: {},
    selectedId: {},
    omittedNodes: {},
    omittedEdges: {},
    loading: { type: Boolean },
    assembly: {},
    assembling: { type: Boolean },
    whole: {},
    labels: {},
    activity: {},
    viewport: {},
    now: {}
  },
  emits: ["select", "focus", "port", "menu", "recompute", "loadAll", "cancelLoad", "viewport"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(null), r = B(null), u = B(null);
    let a = null;
    const d = B({ width: 900, height: 620 }), l = B({ zoom: 1, x: 0, y: 0 }), c = B(""), p = B(""), m = B(!0), f = B(!1), j = B(0), x = B({ nodes: 0, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }), w = we(/* @__PURE__ */ new Map()), g = B(null), h = we(null), A = we(ci);
    let S = null, $ = null, T = null, C, W, D = 0, J, rt = !1, E = null, I = 0, N = { x: 0, y: 0 };
    const Z = O(() => e.nodes.filter((R) => !Pe(R))), it = O(() => {
      const R = new Set(e.nodes.filter(Pe).map((M) => M.id));
      return e.edges.filter((M) => !Sn(M) && !R.has(M.from) && !R.has(M.to));
    }), L = O(() => {
      const R = /* @__PURE__ */ new Map();
      for (const M of Z.value) {
        const q = $t(M.kind);
        R.set(q, (R.get(q) || 0) + 1);
      }
      return wo.filter((M) => R.has(M)).map((M) => ({ family: M, count: R.get(M) || 0 }));
    }), nt = O(() => {
      const R = /* @__PURE__ */ new Set();
      for (const M of e.presence) M.positionId && R.add(M.positionId);
      return R;
    }), V = O(() => e.presence.filter((R) => R.positionId).map((R) => ({ id: R.id, nodeId: R.positionId, initials: R.initials, label: R.label, stale: R.stale }))), K = O(() => Un(l.value.zoom, x.value.nodes || Z.value.length)), ft = O(() => Math.round(l.value.zoom * 100)), ut = O(() => K.value === "envelope" ? "territories" : K.value === "dot" ? "marks" : K.value === "mark" ? "marks and landmarks" : "full detail"), ct = B(Math.floor(Date.now() / 1e3));
    let pt;
    const vt = O(() => Wo(e.assembly, ct.value)), mt = O(() => Fo(e.assembly)), Lt = O(() => (e.omittedNodes || 0) + (e.omittedEdges || 0)), at = O(() => {
      const R = e.whole;
      return !R || !R.total ? 0 : Math.min(1, R.loaded / R.total);
    }), et = O(() => c.value && e.nodes.find((R) => R.id === c.value) || null);
    function dt() {
      D || (D = requestAnimationFrame(() => {
        D = 0, Ut();
      }));
    }
    function Ut() {
      const R = h.value;
      if (!T || !r.value || !$ || !R) return;
      const M = Math.min(2, window.devicePixelRatio || 1), q = Math.round(d.value.width * M), ht = Math.round(d.value.height * M);
      (r.value.width !== q || r.value.height !== ht) && (r.value.width = q, r.value.height = ht), T.setTransform(M, 0, 0, M, 0, 0), x.value = Ei(T, R, l.value, d.value, $, {
        detail: Un(l.value.zoom, R.nodes.length),
        now: e.now,
        selectedId: e.selectedId || "",
        hoveredId: c.value,
        mutedFamily: p.value,
        touched: e.touchedIds || /* @__PURE__ */ new Set(),
        showRegions: m.value,
        pins: V.value
      });
    }
    async function gt(R = !1, M = !1) {
      if (!S) return;
      const q = Z.value, ht = it.value, Ct = bi(q.length, d.value);
      f.value = !0;
      const Et = await S.solve({
        nodes: q,
        edges: ht,
        width: Ct.width,
        height: Ct.height,
        emphasis: nt.value,
        held: w.value,
        fresh: R,
        unpin: M
      });
      Et && (f.value = !1, j.value = Et.ms, A.value = Et, h.value = Ai(Et, q, ht, e.labels || /* @__PURE__ */ new Map(), e.activity || /* @__PURE__ */ new Map()), rt || kt(), dt());
    }
    function _t(R = !1) {
      clearTimeout(J), J = setTimeout(() => {
        gt(R);
      }, 60);
    }
    function kt() {
      const R = h.value;
      l.value = vi(R?.bounds || null, d.value);
    }
    function xt() {
      o("viewport", { zoom: l.value.zoom, x: l.value.x, y: l.value.y });
    }
    function Tt() {
      rt = !1, kt(), xt(), dt();
    }
    function St(R) {
      rt = !0, l.value = qn(l.value, R, d.value.width / 2, d.value.height / 2), xt(), dt();
    }
    function ne() {
      const R = e.selectedId, M = R ? di(A.value, R) : null;
      if (!M) {
        Tt();
        return;
      }
      rt = !0;
      const q = Ze(Math.max(l.value.zoom, 1.2));
      l.value = { zoom: q, x: d.value.width / 2 - M.x * q, y: d.value.height / 2 - M.y * q }, xt(), dt();
    }
    function pe() {
      w.value = /* @__PURE__ */ new Map(), _t();
    }
    function ge() {
      w.value = /* @__PURE__ */ new Map(), rt = !1, gt(!0, !0);
    }
    function Kt(R) {
      p.value = p.value === R ? "" : R, dt();
    }
    function Bt(R) {
      const M = r.value?.getBoundingClientRect();
      return M ? xn(l.value, R.clientX - M.left, R.clientY - M.top) : { x: 0, y: 0 };
    }
    function je(R) {
      const M = r.value?.getBoundingClientRect();
      M && (rt = !0, l.value = qn(l.value, R.deltaY > 0 ? 0.9 : 1.1, R.clientX - M.left, R.clientY - M.top), xt(), dt());
    }
    function Me(R) {
      const M = Bt(R);
      R.currentTarget.setPointerCapture(R.pointerId), I = 0, N = { x: R.clientX, y: R.clientY };
      const ht = !!!(h.value && Gn(h.value, M.x, M.y)) && h.value ? Te(h.value, M.x, M.y) : "";
      if (ht) {
        const Ct = A.value.index.get(ht);
        E = { id: ht, offsetX: A.value.positions[Ct * 2] - M.x, offsetY: A.value.positions[Ct * 2 + 1] - M.y, moved: !1 };
        return;
      }
      g.value = { x: R.clientX, y: R.clientY, from: { ...l.value } };
    }
    function Ae(R) {
      if ((E || g.value) && (I = Math.max(I, Math.hypot(R.clientX - N.x, R.clientY - N.y))), E) {
        const ht = Bt(R), Ct = new Map(w.value);
        Ct.set(E.id, { px: ht.x + E.offsetX, py: ht.y + E.offsetY }), w.value = Ct, E.moved = !0;
        const Et = A.value.index.get(E.id);
        if (Et !== void 0) {
          A.value.positions[Et * 2] = ht.x + E.offsetX, A.value.positions[Et * 2 + 1] = ht.y + E.offsetY;
          const re = h.value?.nodes[Et];
          re && (re.x = ht.x + E.offsetX, re.y = ht.y + E.offsetY);
        }
        dt();
        return;
      }
      if (g.value) {
        rt = !0, l.value = {
          zoom: g.value.from.zoom,
          x: g.value.from.x + R.clientX - g.value.x,
          y: g.value.from.y + R.clientY - g.value.y
        }, dt();
        return;
      }
      const M = Bt(R), q = h.value ? Te(h.value, M.x, M.y) : "";
      q !== c.value && (c.value = q, dt());
    }
    function Rt() {
      g.value && xt(), g.value = null, E?.moved && _t(), E = null;
    }
    function Jt() {
      return I > wa;
    }
    function oe(R) {
      if (Jt()) return;
      const M = Bt(R), q = h.value ? Gn(h.value, M.x, M.y) : null;
      if (q) {
        o("port", q.targetId);
        return;
      }
      const ht = h.value ? Te(h.value, M.x, M.y) : "";
      ht && o("select", ht);
    }
    function ve(R) {
      if (Jt()) return;
      const M = Bt(R), q = h.value ? Te(h.value, M.x, M.y) : "";
      q && o("focus", q);
    }
    function Xt(R) {
      const M = Bt(R), q = h.value ? Te(h.value, M.x, M.y) : "";
      q && o("menu", q, R);
    }
    function se() {
      a && ($ = Ri(a), dt());
    }
    return Qe(() => {
      S = new hi(() => new tr()), T = r.value?.getContext("2d") || null, u.value && (a = Ti(document), u.value.appendChild(a)), he(se), W = Oi(se), pt = setInterval(() => {
        ct.value = Math.floor(Date.now() / 1e3);
      }, 3e4), C = new ResizeObserver((R) => {
        const M = R[0]?.contentRect;
        if (!M) return;
        const q = { width: Math.max(200, Math.round(M.width)), height: Math.max(160, Math.round(M.height)) };
        q.width === d.value.width && q.height === d.value.height || (d.value = q, _t());
      }), s.value && C.observe(s.value), gt();
    }), Fe(() => {
      C?.disconnect(), C = void 0, W?.(), W = void 0, pt && clearInterval(pt), pt = void 0, D && cancelAnimationFrame(D), D = 0, clearTimeout(J), J = void 0, a = null, S?.dispose(), S = null;
    }), yt(() => e.viewport, (R) => {
      !R || R.zoom === void 0 || (rt = !0, l.value = { zoom: Ze(R.zoom), x: R.x || 0, y: R.y || 0 }, dt());
    }, { immediate: !0 }), yt(() => [e.nodes, e.edges], () => _t()), yt(() => e.whole?.done, (R, M) => {
      !R || M || (rt = !1, gt(!0));
    }), yt(() => e.selectedId, dt), yt(() => e.touchedIds, dt), yt(() => e.presence, dt), yt(() => e.activity, () => {
      const R = h.value;
      if (R) for (const M of R.nodes) {
        const q = e.activity?.get(M.id);
        M.sessions = q?.sessions || 0, M.lastWorkedAt = q?.lastActivityAt || 0;
      }
      dt();
    }), (R, M) => (b(), k("section", {
      ref_key: "host",
      ref: s,
      class: "jr-graph",
      "aria-label": "Knowledge graph"
    }, [
      i("canvas", {
        ref_key: "canvas",
        ref: r,
        class: tt(["jr-graph-canvas", { grabbing: g.value }]),
        role: "application",
        "aria-label": "Bounded knowledge graph",
        onWheel: Wt(je, ["prevent"]),
        onPointerdown: Me,
        onPointermove: Ae,
        onPointerup: Rt,
        onPointercancel: Rt,
        onPointerleave: M[0] || (M[0] = (q) => {
          c.value = "", dt();
        }),
        onClick: oe,
        onDblclick: Wt(ve, ["prevent"]),
        onContextmenu: Wt(Xt, ["prevent"])
      }, null, 34),
      i("div", {
        ref_key: "probe",
        ref: u,
        class: "jr-ink-probe-host",
        "aria-hidden": "true"
      }, null, 512),
      i("div", Di, [
        i("div", Pi, [
          i("b", null, v(t.nodes.length.toLocaleString()), 1),
          M[11] || (M[11] = i("span", null, "records", -1)),
          M[12] || (M[12] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", null, v(t.edges.length.toLocaleString()), 1),
          M[13] || (M[13] = i("span", null, "relations", -1)),
          V.value.length ? (b(), k(U, { key: 0 }, [
            M[9] || (M[9] = i("i", { "aria-hidden": "true" }, null, -1)),
            i("b", null, v(V.value.length), 1),
            M[10] || (M[10] = i("span", null, "agents here", -1))
          ], 64)) : X("", !0)
        ]),
        i("p", Wi, [
          H(" Drawing " + v(x.value.nodes.toLocaleString()) + " on screen at " + v(ut.value) + " ", 1),
          x.value.territories ? (b(), k(U, { key: 0 }, [
            H(" · " + v(x.value.territories) + " territories named", 1)
          ], 64)) : X("", !0),
          x.value.territoriesHeld ? (b(), k(U, { key: 1 }, [
            H(" of " + v((x.value.territories + x.value.territoriesHeld).toLocaleString()), 1)
          ], 64)) : X("", !0),
          j.value ? (b(), k(U, { key: 2 }, [
            H(" · laid out in " + v(j.value) + "ms", 1)
          ], 64)) : X("", !0)
        ])
      ]),
      Lt.value || t.whole?.running || t.whole?.error || t.whole?.cancelled || t.whole?.done ? (b(), k("div", Fi, [
        t.whole?.running ? (b(), k(U, { key: 0 }, [
          i("p", Bi, [
            M[14] || (M[14] = i("span", { class: "jr-bound-label" }, "Loading the whole graph", -1)),
            i("b", zi, v(t.whole.loaded.toLocaleString()) + " / " + v(t.whole.total.toLocaleString()), 1),
            i("span", Yi, "· " + v(t.whole.chunks) + " chunk" + v(t.whole.chunks === 1 ? "" : "s"), 1)
          ]),
          i("div", qi, [
            i("i", {
              style: bt({ width: `${Math.round(at.value * 100)}%` })
            }, null, 4)
          ]),
          i("button", {
            class: "jr-bound-stop",
            onClick: M[1] || (M[1] = (q) => o("cancelLoad"))
          }, [
            z(y(G), {
              icon: "tabler:player-stop",
              "aria-hidden": "true"
            }),
            M[15] || (M[15] = H(" Stop ", -1))
          ])
        ], 64)) : Lt.value ? (b(), k(U, { key: 1 }, [
          i("p", Ui, [
            M[16] || (M[16] = i("span", { class: "jr-bound-label" }, "Window bounded", -1)),
            i("b", Xi, v((t.omittedNodes || 0).toLocaleString()), 1),
            M[17] || (M[17] = i("span", null, "records", -1)),
            M[18] || (M[18] = i("span", { class: "jr-numeric" }, "and", -1)),
            i("b", Hi, v((t.omittedEdges || 0).toLocaleString()), 1),
            M[19] || (M[19] = i("span", null, "relations outside", -1))
          ]),
          i("button", {
            class: "jr-bound-load",
            onClick: M[2] || (M[2] = (q) => o("loadAll"))
          }, [
            z(y(G), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            M[20] || (M[20] = H(" Load all ", -1))
          ])
        ], 64)) : t.whole?.error ? (b(), k(U, { key: 2 }, [
          i("p", Gi, v(t.whole.error), 1),
          i("button", {
            class: "jr-bound-load",
            onClick: M[3] || (M[3] = (q) => o("loadAll"))
          }, [
            z(y(G), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            }),
            M[21] || (M[21] = H(" Try again", -1))
          ])
        ], 64)) : t.whole?.cancelled ? (b(), k(U, { key: 3 }, [
          i("p", Ki, [
            M[22] || (M[22] = i("span", { class: "jr-bound-label" }, "Stopped", -1)),
            i("b", Ji, v(t.whole.loaded.toLocaleString()), 1),
            M[23] || (M[23] = i("span", null, "loaded", -1))
          ]),
          i("button", {
            class: "jr-bound-load",
            onClick: M[4] || (M[4] = (q) => o("loadAll"))
          }, [
            z(y(G), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            M[24] || (M[24] = H(" Continue", -1))
          ])
        ], 64)) : t.whole?.done ? (b(), k("p", Vi, [
          M[27] || (M[27] = i("span", { class: "jr-bound-label" }, "Fully loaded", -1)),
          i("b", Zi, v(t.whole.loaded.toLocaleString()), 1),
          M[28] || (M[28] = i("span", null, "records and relations", -1)),
          h.value && h.value.ports.length ? (b(), k(U, { key: 0 }, [
            M[25] || (M[25] = i("span", { class: "jr-numeric" }, "·", -1)),
            i("b", Qi, v(h.value.ports.length), 1),
            M[26] || (M[26] = i("span", null, "ports out", -1))
          ], 64)) : X("", !0)
        ])) : X("", !0)
      ])) : X("", !0),
      i("div", ta, [
        (b(!0), k(U, null, Q(L.value, (q) => (b(), k("button", {
          key: q.family,
          class: tt(["jr-legend-item", `family-${q.family}`, { on: p.value === q.family }]),
          "aria-pressed": p.value === q.family,
          title: `Highlight ${y(Bn)[q.family].toLowerCase()}`,
          onClick: (ht) => Kt(q.family)
        }, [
          z(xe, {
            class: "jr-legend-mark",
            family: q.family,
            radius: 7.2,
            "view-box": "-11 -11 22 22"
          }, null, 8, ["family"]),
          i("span", null, v(y(Bn)[q.family]), 1),
          i("em", na, v(q.count.toLocaleString()), 1)
        ], 10, ea))), 128))
      ]),
      i("div", oa, [
        i("button", {
          class: tt(["jr-tool", { on: m.value }]),
          "aria-label": "Toggle branch territories",
          title: "Branch territories",
          onClick: M[5] || (M[5] = (q) => {
            m.value = !m.value, dt();
          })
        }, [
          z(y(G), {
            icon: "tabler:chart-area-line",
            "aria-hidden": "true"
          })
        ], 2),
        i("button", {
          class: tt(["jr-tool", { on: w.value.size > 0 }]),
          disabled: !w.value.size,
          "aria-label": "Release held records",
          title: "Release held records",
          onClick: pe
        }, [
          z(y(G), {
            icon: "tabler:pinned-off",
            "aria-hidden": "true"
          })
        ], 10, sa),
        i("button", {
          class: "jr-tool",
          disabled: f.value,
          "aria-label": "Re-layout the graph",
          title: "Re-layout: arrange the whole graph afresh and fit it to the pane",
          onClick: ge
        }, [
          z(y(G), {
            icon: "tabler:refresh",
            "aria-hidden": "true"
          })
        ], 8, ra),
        M[29] || (M[29] = i("i", {
          class: "jr-tool-divider",
          "aria-hidden": "true"
        }, null, -1)),
        i("button", {
          class: "jr-tool",
          "aria-label": "Zoom out",
          title: "Zoom out",
          onClick: M[6] || (M[6] = (q) => St(0.82))
        }, [
          z(y(G), {
            icon: "tabler:minus",
            "aria-hidden": "true"
          })
        ]),
        i("span", ia, v(ft.value) + "%", 1),
        i("button", {
          class: "jr-tool",
          "aria-label": "Zoom in",
          title: "Zoom in",
          onClick: M[7] || (M[7] = (q) => St(1.22))
        }, [
          z(y(G), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          })
        ]),
        M[30] || (M[30] = i("i", {
          class: "jr-tool-divider",
          "aria-hidden": "true"
        }, null, -1)),
        i("button", {
          class: "jr-tool",
          "aria-label": "Centre the selected record",
          title: "Centre selection",
          onClick: ne
        }, [
          z(y(G), {
            icon: "tabler:focus-2",
            "aria-hidden": "true"
          })
        ]),
        i("button", {
          class: "jr-tool",
          "aria-label": "Fit the graph to the canvas",
          title: "Fit to canvas",
          onClick: Tt
        }, [
          z(y(G), {
            icon: "tabler:arrows-maximize",
            "aria-hidden": "true"
          })
        ])
      ]),
      et.value ? (b(), k("figure", {
        key: 1,
        class: tt(["jr-hovercard", `family-${y($t)(et.value.kind)}`])
      }, [
        i("figcaption", null, [
          i("span", aa, v(et.value.kind.replace(/_/g, " ")), 1),
          i("b", null, v(et.value.label), 1)
        ]),
        et.value.summary ? (b(), k("p", la, v(et.value.summary), 1)) : X("", !0),
        i("dl", null, [
          i("div", null, [
            M[31] || (M[31] = i("dt", null, "Children", -1)),
            i("dd", null, v(et.value.child_count), 1)
          ]),
          i("div", null, [
            M[32] || (M[32] = i("dt", null, "Revision", -1)),
            i("dd", null, v(et.value.revision), 1)
          ]),
          et.value.status ? (b(), k("div", ua, [
            M[33] || (M[33] = i("dt", null, "State", -1)),
            i("dd", null, v(et.value.status), 1)
          ])) : X("", !0)
        ])
      ], 2)) : X("", !0),
      i("div", ca, [
        i("p", {
          class: "jr-assemble-line",
          title: mt.value
        }, [
          i("span", {
            class: tt(["jr-assemble-state", { busy: t.assembling || f.value }]),
            "aria-hidden": "true"
          }, null, 2),
          H(" " + v(f.value ? "Laying out the graph…" : vt.value), 1)
        ], 8, da),
        t.readOnly ? X("", !0) : (b(), k("button", {
          key: 0,
          class: "jr-assemble-run",
          disabled: t.assembling,
          "aria-busy": t.assembling ? "true" : "false",
          title: t.assembling ? "An assembly pass is already running" : "Derive every relation the records state, then propose the rest",
          onClick: M[8] || (M[8] = (q) => o("recompute"))
        }, [
          t.assembling ? (b(), k("span", fa)) : (b(), Yt(y(G), {
            key: 1,
            icon: "tabler:topology-star-ring-3",
            "aria-hidden": "true"
          })),
          i("span", null, v(t.assembling ? "Assembling…" : "Recompute map"), 1)
        ], 8, ha))
      ]),
      t.loading && !t.nodes.length ? (b(), k("div", pa, [...M[34] || (M[34] = [
        i("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        i("h3", null, "Projecting the window", -1),
        i("p", null, "Reading the bounded graph around the current focus.", -1)
      ])])) : t.nodes.length ? X("", !0) : (b(), k("div", ga, [
        (b(), k("svg", va, [
          i("path", {
            d: y(De)("anchor", 11),
            transform: "translate(-16 -8)"
          }, null, 8, ma),
          i("path", {
            d: y(De)("rule", 9),
            transform: "translate(14 -12)"
          }, null, 8, ya),
          i("path", {
            d: y(De)("evidence", 8),
            transform: "translate(2 14)"
          }, null, 8, ba)
        ])),
        M[35] || (M[35] = i("h3", null, "Nothing in this window", -1)),
        M[36] || (M[36] = i("p", null, "This focus level holds no records yet. Step out, or pick another graph from the navigator.", -1))
      ]))
    ], 512));
  }
}), _a = /* @__PURE__ */ At({
  __name: "JournalContextMenu",
  props: {
    x: {},
    y: {}
  },
  emits: ["close", "details", "focus", "copy"],
  setup(t, { emit: n }) {
    const e = t, o = B(null), s = B(null), r = B({ left: "0px", top: "0px", visibility: "hidden" });
    function u() {
      const l = o.value?.getBoundingClientRect(), c = s.value?.getBoundingClientRect();
      if (!l || !c) return;
      const p = Math.max(0, Math.min(e.x - l.left, l.width - c.width)), m = Math.max(0, Math.min(e.y - l.top, l.height - c.height));
      r.value = { left: `${p}px`, top: `${m}px`, visibility: "visible" };
    }
    yt(() => [e.x, e.y], () => {
      he(u);
    }), Qe(() => {
      he(() => {
        u(), s.value?.focus();
      }), window.addEventListener("resize", u);
    }), Fe(() => window.removeEventListener("resize", u));
    const a = n;
    function d(l) {
      a(l), a("close");
    }
    return (l, c) => (b(), k("div", {
      ref_key: "layer",
      ref: o,
      class: "jr-context-overlay",
      onClick: c[6] || (c[6] = (p) => a("close")),
      onContextmenu: c[7] || (c[7] = Wt((p) => a("close"), ["prevent"]))
    }, [
      i("div", {
        ref_key: "panel",
        ref: s,
        class: "jr-context-menu",
        style: bt(r.value),
        role: "menu",
        tabindex: "-1",
        onKeydown: c[3] || (c[3] = co(Wt((p) => a("close"), ["stop", "prevent"]), ["esc"])),
        onClick: c[4] || (c[4] = Wt(() => {
        }, ["stop"])),
        onContextmenu: c[5] || (c[5] = Wt(() => {
        }, ["prevent", "stop"]))
      }, [
        i("button", {
          role: "menuitem",
          onClick: c[0] || (c[0] = (p) => d("details"))
        }, [
          z(y(G), {
            icon: "tabler:info-circle",
            "aria-hidden": "true"
          }),
          c[8] || (c[8] = H(" Details", -1))
        ]),
        i("button", {
          role: "menuitem",
          onClick: c[1] || (c[1] = (p) => d("focus"))
        }, [
          z(y(G), {
            icon: "tabler:arrow-up-right",
            "aria-hidden": "true"
          }),
          c[9] || (c[9] = H(" Focus here", -1))
        ]),
        i("button", {
          role: "menuitem",
          onClick: c[2] || (c[2] = (p) => d("copy"))
        }, [
          z(y(G), {
            icon: "tabler:copy",
            "aria-hidden": "true"
          }),
          c[10] || (c[10] = H(" Copy address", -1))
        ])
      ], 36)
    ], 544));
  }
}), Qn = 300, xa = 2700, $a = 10, Xe = 0.032, fn = "·journal";
function ja(t, n, e, o) {
  const s = [];
  for (const r of t) {
    if (!r.started_at) continue;
    const u = r.state === "open" ? o : r.ended_at || r.last_activity_at || r.started_at;
    s.push([r.started_at, Math.max(r.started_at, u)]);
  }
  for (const r of n)
    r.bucket_at && s.push([Math.min(r.bucket_at, o), Math.min(r.bucket_at + Math.max(60, e), o)]);
  return s;
}
function to(t, n) {
  const e = [...t].sort((s, r) => s[0] - r[0] || s[1] - r[1]), o = [];
  for (const [s, r] of e) {
    const u = o[o.length - 1];
    u && s - u[1] <= n ? u[1] = Math.max(u[1], r) : o.push([s, r]);
  }
  return o;
}
function Ma(t) {
  return t < 5400 ? `${Math.max(1, Math.round(t / 60))}m` : t < 36 * 3600 ? `${Math.round(t / 3600)}h` : `${(t / 86400).toFixed(1)}d`;
}
function eo(t, n) {
  const e = new Date(t * 1e3), o = e.toLocaleDateString([], { month: "short", day: "numeric" }), s = e.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return n > 30 * 86400 ? o : n > 40 * 3600 ? `${o} ${s}` : s;
}
function Aa(t, n, e, o) {
  let s = ja(t, n, e, o);
  s.length || (s = [[o - Qn, o]]), s.push([o - 60, o]);
  let r = xa, u = to(s, r);
  for (; u.length > $a; )
    r *= 2, u = to(s, r);
  const d = (u.length - 1) * Xe, l = Math.max(1e-9, 1 - d), c = Math.max(1, u.reduce(($, [T, C]) => $ + Math.max(1, C - T), 0)), p = [], m = [];
  let f = 0;
  for (let $ = 0; $ < u.length; $++) {
    const [T, C] = u[$], W = Math.max(1, C - T) / c * l;
    p.push({ from: T, to: C, x0: f, x1: f + W, idle: !1 }), f += W;
    const D = u[$ + 1];
    if (D) {
      const J = D[0] - C;
      p.push({ from: C, to: D[0], x0: f, x1: f + Xe, idle: !0 }), m.push({ offset: f, width: Xe, seconds: J, label: `${Ma(J)} idle` }), f += Xe;
    }
  }
  const j = p[p.length - 1];
  j && (j.x1 = 1);
  const x = u[0][0], w = u[u.length - 1][1], g = Math.max(Qn, w - x), h = [], A = g > 40 * 3600 ? 0.105 : 0.055, S = ($, T) => {
    const C = h[h.length - 1];
    C && T - C.offset < A || h.push({ at: $, offset: T, label: eo($, g) });
  };
  for (const $ of p)
    if (!$.idle && (S($.from, $.x0), $.x1 - $.x0 > 0.24)) {
      const T = ($.from + $.to) / 2;
      S(T, ($.x0 + $.x1) / 2);
    }
  for (; h.length && 1 - h[h.length - 1].offset < A; ) h.pop();
  return h.push({ at: w, offset: 1, label: eo(w, g) }), { from: x, to: w, segments: p, marks: h, gaps: m };
}
function Mn(t, n) {
  if (t <= n.from) return 0;
  if (t >= n.to) return 1;
  for (const e of n.segments) {
    if (t > e.to) continue;
    const o = Math.max(1, e.to - e.from);
    return e.x0 + (t - e.from) / o * (e.x1 - e.x0);
  }
  return 1;
}
function Ia(t, n) {
  const e = Mn(t.startedAt, n), o = Mn(t.endedAt, n);
  return { start: e, width: Math.max(0, o - e) };
}
function Sa(t, n) {
  const e = t.state === "open";
  return {
    spanId: t.span_id,
    startedAt: t.started_at,
    endedAt: e ? Math.max(n, t.last_activity_at) : t.ended_at || t.last_activity_at,
    open: e,
    purpose: t.working_on?.text || t.last_fact?.title || "",
    factCount: t.fact_count || 0,
    outcome: t.closed_reason || (e ? "open" : "sealed")
  };
}
function Ca(t, n, e) {
  const o = /* @__PURE__ */ new Map();
  function s(r, u) {
    const a = ho(r, u), d = o.get(a);
    if (d) return d;
    const l = Gt(r || u || a), c = {
      agentId: a,
      label: l.label,
      initials: l.initials,
      unattributed: !1,
      spans: [],
      ticks: [],
      events: 0,
      lastActivityAt: 0
    };
    return o.set(a, c), c;
  }
  for (const r of t) {
    const u = s(r.agent_id, r.cursor_id), a = Sa(r, e);
    u.spans.push(a), u.lastActivityAt = Math.max(u.lastActivityAt, r.last_activity_at, r.ended_at || 0);
  }
  for (const r of n) {
    let u;
    r.agent_id ? u = s(r.agent_id, "") : u = o.get(fn) || (() => {
      const a = {
        agentId: fn,
        label: "Journal · unattributed",
        initials: "·",
        unattributed: !0,
        spans: [],
        ticks: [],
        events: 0,
        lastActivityAt: 0
      };
      return o.set(fn, a), a;
    })(), u.ticks.push({ at: r.bucket_at, events: r.events || 0 }), u.events += r.events || 0, u.lastActivityAt = Math.max(u.lastActivityAt, r.last_ts || r.bucket_at);
  }
  for (const r of o.values())
    r.spans.sort((u, a) => u.startedAt - a.startedAt), r.ticks.sort((u, a) => u.at - a.at);
  return [...o.values()].sort((r, u) => Number(r.unattributed) - Number(u.unattributed) || u.lastActivityAt - r.lastActivityAt || r.label.localeCompare(u.label));
}
function jo(t) {
  return t.task_id || t.working_on?.kind === "task" && t.working_on.text || "";
}
function Na(t, n) {
  const e = t.find((o) => o.span_id === n);
  return e ? { taskId: jo(e), agentId: (e.agent_id || e.cursor_id || "").trim() } : null;
}
const Ea = {
  class: "jr-lanes",
  "aria-label": "Agent lanes"
}, La = { class: "jr-lens-meta" }, Ta = { class: "jr-lens-facts" }, Ra = { class: "jr-numeric" }, Oa = { class: "jr-numeric" }, Da = { class: "jr-numeric" }, Pa = {
  key: 0,
  class: "jr-empty-state"
}, Wa = {
  key: 1,
  class: "jr-lane-board"
}, Fa = {
  class: "jr-lane-ruler",
  "aria-hidden": "true"
}, Ba = { class: "jr-lane-rows" }, za = {
  class: "jr-lane-gaps",
  "aria-hidden": "true"
}, Ya = ["title", "disabled", "onClick"], qa = { class: "jr-avatar" }, Ua = { class: "jr-numeric" }, Xa = { class: "jr-lane-track" }, Ha = ["title"], Ga = ["title", "onClick"], Ka = { class: "jr-numeric" }, Ja = /* @__PURE__ */ At({
  __name: "LanesLens",
  props: {
    spans: {},
    buckets: {},
    bucketWidthS: {},
    now: {}
  },
  emits: ["agent", "span"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = O(() => Aa(e.spans, e.buckets, e.bucketWidthS || 3600, e.now)), r = O(() => Ca(e.spans, e.buckets, e.now)), u = O(() => Math.max(1, ...r.value.flatMap((d) => d.ticks.map((l) => l.events))));
    function a(d) {
      const l = Ia(d, s.value);
      return { left: `${l.start * 100}%`, width: `${l.width * 100}%` };
    }
    return (d, l) => (b(), k("section", Ea, [
      i("div", La, [
        l[5] || (l[5] = i("span", { class: "jr-lens-title" }, "Lanes", -1)),
        i("span", Ta, [
          i("b", Ra, v(r.value.length), 1),
          l[0] || (l[0] = H(" lanes ", -1)),
          l[1] || (l[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Oa, v(t.spans.length), 1),
          l[2] || (l[2] = H(" spans ", -1)),
          l[3] || (l[3] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Da, v(t.buckets.length), 1),
          l[4] || (l[4] = H(" buckets ", -1))
        ])
      ]),
      r.value.length ? (b(), k("div", Wa, [
        i("div", Fa, [
          (b(!0), k(U, null, Q(s.value.marks, (c) => (b(), k("span", {
            key: c.at,
            style: bt({ left: `${c.offset * 100}%` })
          }, v(c.label), 5))), 128))
        ]),
        i("div", Ba, [
          i("div", za, [
            (b(!0), k(U, null, Q(s.value.gaps, (c) => (b(), k("div", {
              key: c.offset,
              class: "jr-lane-gap",
              style: bt({ left: `${c.offset * 100}%`, width: `${c.width * 100}%` })
            }, [
              i("span", null, v(c.label), 1)
            ], 4))), 128))
          ]),
          (b(!0), k(U, null, Q(r.value, (c) => (b(), k("div", {
            key: c.agentId,
            class: tt(["jr-lane", { unattributed: c.unattributed }])
          }, [
            i("button", {
              class: "jr-lane-name",
              title: c.label,
              disabled: c.unattributed,
              onClick: (p) => o("agent", c.agentId)
            }, [
              i("span", qa, v(c.initials), 1),
              i("span", null, [
                i("b", null, v(c.label), 1),
                i("small", Ua, v(c.events) + " fact" + v(c.events === 1 ? "" : "s") + " · " + v(y(wt)(c.lastActivityAt, t.now)), 1)
              ])
            ], 8, Ya),
            i("div", Xa, [
              (b(!0), k(U, null, Q(c.ticks, (p) => (b(), k("i", {
                key: p.at,
                class: "jr-lane-tick",
                style: bt({ left: `${y(Mn)(p.at, s.value) * 100}%`, height: `${Math.max(12, p.events / u.value * 100)}%` }),
                title: `${p.events} facts`
              }, null, 12, Ha))), 128)),
              (b(!0), k(U, null, Q(c.spans, (p) => (b(), k("button", {
                key: p.spanId,
                class: tt(["jr-lane-span", { open: p.open, [`outcome-${p.outcome}`]: p.outcome }]),
                style: bt(a(p)),
                title: `${p.purpose} · ${p.factCount} facts · ${p.open ? "still open" : p.outcome}`,
                onClick: (m) => o("span", p.spanId)
              }, [
                i("span", null, v(p.purpose), 1),
                i("em", Ka, v(p.factCount), 1)
              ], 14, Ga))), 128))
            ])
          ], 2))), 128))
        ])
      ])) : (b(), k("div", Pa, [
        z(y(G), {
          icon: "tabler:timeline",
          "aria-hidden": "true"
        }),
        l[6] || (l[6] = i("h3", null, "No agent has worked in this journal yet", -1)),
        l[7] || (l[7] = i("p", null, "A lane appears the moment an identity writes its first fact; the span it opens is the bar.", -1))
      ]))
    ]));
  }
}), Mo = 3 * 86400;
function de(t, n) {
  const e = Math.max(0, Math.floor(n - t)), o = e < 3600 ? "live" : e < Mo ? "recent" : "dormant";
  return { seconds: e, label: wt(t, n), tier: o };
}
function Ao(t) {
  const n = { status: t };
  return tn(n) || ke(n);
}
function Va(t) {
  const n = new Set(t.map((o) => o.id)), e = /* @__PURE__ */ new Map();
  for (const o of t) {
    const s = o.parent_task_id && o.parent_task_id !== o.id && n.has(o.parent_task_id) ? o.parent_task_id : "", r = e.get(s) || [];
    r.push(o), e.set(s, r);
  }
  return e;
}
const no = /* @__PURE__ */ new WeakMap();
function Io(t) {
  const n = no.get(t);
  if (n) return n;
  const e = Va(t), o = { children: e, activity: Qa(t, e) };
  return no.set(t, o), o;
}
function Za(t, n, e) {
  const o = [], s = [...n.get(t.id) || []];
  for (; s.length; ) {
    const r = s.shift();
    e.has(r.id) || (e.add(r.id), o.push(r), s.push(...n.get(r.id) || []));
  }
  return o;
}
function Qa(t, n) {
  const e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), s = [], r = (u) => {
    for (s.push({ task: u, opened: !1 }); s.length; ) {
      const a = s.pop(), d = a.task;
      if (a.opened) {
        let l = d.updated_at;
        for (const c of n.get(d.id) || [])
          l = Math.max(l, e.get(c.id) ?? c.updated_at);
        e.set(d.id, l);
        continue;
      }
      if (!o.has(d.id)) {
        o.add(d.id), s.push({ task: d, opened: !0 });
        for (const l of n.get(d.id) || []) s.push({ task: l, opened: !1 });
      }
    }
  };
  for (const u of n.get("") || []) r(u);
  for (const u of t) o.has(u.id) || r(u);
  return e;
}
function tl(t, n) {
  const { activity: e } = Io(t), o = [], s = [];
  for (const r of t) {
    const u = e.get(r.id) ?? r.updated_at;
    de(u, n).tier === "dormant" ? s.push(r) : o.push(r);
  }
  return { worked: o, dormant: s };
}
function So(t, n) {
  const { children: e, activity: o } = Io(t), s = new Map(t.map((a) => [a.id, a])), r = (a) => de(o.get(a.id) ?? a.updated_at, n).tier === "dormant", u = [];
  for (const a of t) {
    if (!r(a)) continue;
    const d = a.parent_task_id && a.parent_task_id !== a.id ? s.get(a.parent_task_id) : void 0;
    if (d && r(d)) continue;
    const l = Za(a, e, /* @__PURE__ */ new Set([a.id])), c = o.get(a.id) ?? a.updated_at, p = {
      root: a,
      members: l,
      lastActivityAt: c,
      age: de(c, n),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const m of [a, ...l]) {
      const f = String(m.status || "").toLowerCase();
      Ao(f) ? p.doneCount += 1 : f === "blocked" ? p.blockedCount += 1 : p.openCount += 1;
    }
    u.push(p);
  }
  return u.sort((a, d) => a.lastActivityAt - d.lastActivityAt || a.root.title.localeCompare(d.root.title));
}
const el = {
  class: "jr-now",
  "aria-label": "What is happening now"
}, nl = { class: "jr-lens-meta" }, ol = { class: "jr-lens-facts" }, sl = { class: "jr-numeric" }, rl = { class: "jr-numeric" }, il = { class: "jr-numeric" }, al = { class: "jr-numeric" }, ll = ["title"], ul = { class: "jr-now-grid" }, cl = {
  class: "jr-now-block wide",
  "aria-label": "Mutation authority"
}, dl = { class: "jr-numeric" }, hl = {
  key: 0,
  class: "jr-empty-small"
}, fl = ["onClick"], pl = { class: "jr-now-copy" }, gl = { class: "jr-numeric" }, vl = ["onClick"], ml = { class: "jr-now-copy" }, yl = {
  key: 0,
  class: "jr-numeric"
}, bl = {
  key: 1,
  class: "jr-empty-small"
}, wl = {
  class: "jr-now-block",
  "aria-label": "Open work spans"
}, kl = { class: "jr-numeric" }, _l = {
  key: 0,
  class: "jr-empty-small"
}, xl = ["onClick"], $l = { class: "jr-avatar" }, jl = { class: "jr-now-copy" }, Ml = {
  key: 0,
  class: "jr-now-fact"
}, Al = { class: "jr-now-meta" }, Il = { class: "jr-numeric" }, Sl = { class: "jr-numeric" }, Cl = {
  class: "jr-now-block",
  "aria-label": "Open tasks"
}, Nl = { class: "jr-numeric" }, El = {
  key: 0,
  class: "jr-empty-small"
}, Ll = ["onClick"], Tl = { class: "jr-now-copy" }, Rl = { key: 0 }, Ol = ["onClick"], Dl = { class: "jr-now-copy" }, Pl = { key: 0 }, Wl = {
  class: "jr-now-block wide",
  "aria-label": "Recent significant facts"
}, Fl = { class: "jr-numeric" }, Bl = {
  key: 0,
  class: "jr-empty-small"
}, zl = {
  key: 1,
  class: "jr-now-facts"
}, Yl = { class: "jr-numeric" }, ql = /* @__PURE__ */ At({
  __name: "NowLens",
  props: {
    spans: {},
    workControl: {},
    tasks: {},
    events: {},
    now: {},
    spanCounts: {},
    taskBound: {}
  },
  emits: ["task", "agent", "stale"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = /^(milestone|decision|blocker|finding|risk|contradiction|acceptance|reflection)$/i, r = O(() => e.spans.filter((w) => w.state === "open").sort((w, g) => g.last_activity_at - w.last_activity_at)), u = O(() => e.tasks.filter((w) => !Ao(w.status))), a = O(() => tl(u.value, e.now)), d = O(() => a.value.worked.filter((w) => w.status !== "blocked").sort((w, g) => g.updated_at - w.updated_at)), l = O(() => e.tasks.filter((w) => w.status === "blocked").sort((w, g) => g.updated_at - w.updated_at)), c = O(() => {
      const w = new Map(e.tasks.map((h) => [h.id, h])), g = /* @__PURE__ */ new Set();
      for (const h of So(e.tasks, e.now)) {
        let A = w.get(h.root.id);
        const S = /* @__PURE__ */ new Set();
        for (; A?.parent_task_id && w.has(A.parent_task_id) && !S.has(A.id); )
          S.add(A.id), A = w.get(A.parent_task_id);
        g.add(A?.id || h.root.id);
      }
      return [...g];
    }), p = O(() => e.events.filter((w) => s.test(w.event_type)).sort((w, g) => g.seq - w.seq).slice(0, 24));
    function m(w) {
      return Gt(w.agent_id || w.cursor_id || "").label;
    }
    function f(w) {
      return Gt(w.agent_id || w.cursor_id || "").initials;
    }
    function j(w) {
      return w.working_on?.text || w.last_fact?.title || "Open activity span";
    }
    function x(w) {
      const g = Math.max(0, Math.floor(w - e.now));
      return g < 60 ? `${g}s` : g < 3600 ? `${Math.ceil(g / 60)}m` : `${Math.ceil(g / 3600)}h`;
    }
    return (w, g) => (b(), k("section", el, [
      i("div", nl, [
        g[5] || (g[5] = i("span", { class: "jr-lens-title" }, "Now", -1)),
        i("span", ol, [
          i("b", sl, v(r.value.length), 1),
          H(" open span" + v(r.value.length === 1 ? "" : "s") + " ", 1),
          g[1] || (g[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", rl, v(t.workControl.counts.active), 1),
          H(" active lease" + v(t.workControl.counts.active === 1 ? "" : "s") + " ", 1),
          g[2] || (g[2] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", il, v(l.value.length), 1),
          g[3] || (g[3] = H(" blocked ", -1)),
          g[4] || (g[4] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", al, v(c.value.length), 1),
          H(" dormant program" + v(c.value.length === 1 ? "" : "s"), 1)
        ]),
        t.taskBound.hasMore ? (b(), k("span", {
          key: 0,
          class: "jr-lens-bound",
          title: `The journal task read returns one page; ${(t.taskBound.total - t.taskBound.loaded).toLocaleString()} more tasks exist and this view does not count them`
        }, [
          z(y(G), {
            icon: "tabler:alert-circle",
            "aria-hidden": "true"
          }),
          H(" counted over " + v(t.taskBound.loaded.toLocaleString()) + " of " + v(t.taskBound.total.toLocaleString()) + " tasks ", 1)
        ], 8, ll)) : X("", !0),
        c.value.length ? (b(), k("button", {
          key: 1,
          class: "jr-lens-advice",
          title: "Review the work nothing has touched for days",
          onClick: g[0] || (g[0] = (h) => o("stale"))
        }, [
          z(y(G), {
            icon: "tabler:archive",
            "aria-hidden": "true"
          }),
          H(" Review " + v(c.value.length) + " dormant ", 1)
        ])) : X("", !0)
      ]),
      i("div", ul, [
        i("section", cl, [
          i("h3", null, [
            z(y(G), {
              icon: "tabler:key",
              "aria-hidden": "true"
            }),
            g[6] || (g[6] = H(" Authority ", -1)),
            i("em", dl, v(t.workControl.counts.active) + " live · " + v(t.workControl.counts.resumable) + " resumable", 1)
          ]),
          !t.workControl.leases.length && !t.workControl.resumable.length ? (b(), k("p", hl, " No mutation lease is active and no started task is waiting to be resumed. ")) : X("", !0),
          (b(!0), k(U, null, Q(t.workControl.leases, (h) => (b(), k("button", {
            key: h.lease_id,
            class: tt(["jr-now-task", "jr-authority-row", { planning: h.capability === "PLANNING" }]),
            onClick: (A) => o("task", h.task_id)
          }, [
            i("span", {
              class: tt(["jr-state-chip", h.capability === "WRITE" ? "state-in_progress" : "state-blocked"])
            }, v(h.capability === "WRITE" ? "write" : "planning"), 3),
            i("span", pl, [
              i("b", null, v(h.task_title || "Untitled task"), 1),
              i("small", null, v(y(Gt)(h.agent_id).label) + " · " + v(h.task_status || "unknown task state"), 1)
            ]),
            i("time", gl, "expires in " + v(x(h.expires_at)), 1)
          ], 10, fl))), 128)),
          (b(!0), k(U, null, Q(t.workControl.resumable, (h) => (b(), k("button", {
            key: `resume:${h.task_id}`,
            class: "jr-now-task jr-authority-row resumable",
            onClick: (A) => o("task", h.task_id)
          }, [
            g[8] || (g[8] = i("span", { class: "jr-state-chip state-open" }, "resume", -1)),
            i("span", ml, [
              i("b", null, v(h.task_title || "Untitled task"), 1),
              g[7] || (g[7] = i("small", null, "No live lease · open this branch to continue in place", -1))
            ]),
            h.task_updated_at ? (b(), k("time", yl, v(y(wt)(h.task_updated_at, t.now)), 1)) : X("", !0)
          ], 8, vl))), 128)),
          t.workControl.has_more ? (b(), k("p", bl, "More authority rows exist beyond this bounded control view.")) : X("", !0)
        ]),
        i("section", wl, [
          i("h3", null, [
            z(y(G), {
              icon: "tabler:activity-heartbeat",
              "aria-hidden": "true"
            }),
            g[9] || (g[9] = H(" Open spans ", -1)),
            i("em", kl, v(t.spanCounts.open || r.value.length), 1)
          ]),
          r.value.length ? X("", !0) : (b(), k("p", _l, "No identity has an open activity span.")),
          (b(!0), k(U, null, Q(r.value, (h) => (b(), k("button", {
            key: h.span_id,
            class: "jr-now-span",
            onClick: (A) => o("agent", h.agent_id || h.cursor_id || "")
          }, [
            i("span", $l, v(f(h)), 1),
            i("span", jl, [
              i("b", null, v(m(h)), 1),
              i("small", null, v(j(h)), 1),
              h.last_fact?.title ? (b(), k("small", Ml, [
                z(y(G), {
                  icon: "tabler:point",
                  "aria-hidden": "true"
                }),
                H(v(h.last_fact.title), 1)
              ])) : X("", !0)
            ]),
            i("span", Al, [
              i("time", Il, v(y(wt)(h.last_activity_at, t.now)), 1),
              i("em", Sl, v(h.fact_count || 0) + " fact" + v(h.fact_count === 1 ? "" : "s"), 1)
            ])
          ], 8, xl))), 128))
        ]),
        i("section", Cl, [
          i("h3", null, [
            z(y(G), {
              icon: "tabler:checkbox",
              "aria-hidden": "true"
            }),
            g[10] || (g[10] = H(" Open work ", -1)),
            i("em", Nl, v(d.value.length + l.value.length), 1)
          ]),
          !d.value.length && !l.value.length ? (b(), k("p", El, "Nothing is open in this journal.")) : X("", !0),
          (b(!0), k(U, null, Q(l.value, (h) => (b(), k("button", {
            key: h.id,
            class: "jr-now-task blocked",
            onClick: (A) => o("task", h.id)
          }, [
            g[11] || (g[11] = i("span", { class: "jr-state-chip state-blocked" }, "blocked", -1)),
            i("span", Tl, [
              i("b", null, v(h.title), 1),
              h.description ? (b(), k("small", Rl, v(h.description), 1)) : X("", !0)
            ]),
            i("time", {
              class: tt(["jr-numeric", y(de)(h.updated_at, t.now).tier])
            }, v(y(de)(h.updated_at, t.now).label), 3)
          ], 8, Ll))), 128)),
          (b(!0), k(U, null, Q(d.value, (h) => (b(), k("button", {
            key: h.id,
            class: "jr-now-task",
            onClick: (A) => o("task", h.id)
          }, [
            i("span", {
              class: tt(["jr-state-chip", `state-${h.status}`])
            }, v(h.status.replace(/_/g, " ")), 3),
            i("span", Dl, [
              i("b", null, v(h.title), 1),
              h.description ? (b(), k("small", Pl, v(h.description), 1)) : X("", !0)
            ]),
            i("time", {
              class: tt(["jr-numeric", y(de)(h.updated_at, t.now).tier])
            }, v(y(de)(h.updated_at, t.now).label), 3)
          ], 8, Ol))), 128))
        ]),
        i("section", Wl, [
          i("h3", null, [
            z(y(G), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            }),
            g[12] || (g[12] = H(" What changed ", -1)),
            i("em", Fl, v(p.value.length), 1)
          ]),
          p.value.length ? (b(), k("ol", zl, [
            (b(!0), k(U, null, Q(p.value, (h) => (b(), k("li", {
              key: h.id
            }, [
              i("span", {
                class: "jr-now-dot",
                style: bt({ background: y($e)(h.event_type) }),
                "aria-hidden": "true"
              }, null, 4),
              i("span", {
                class: tt(["jr-eyebrow", `family-${y($t)(h.event_type)}`])
              }, v(h.event_type.replace(/_/g, " ")), 3),
              i("b", null, v(h.title || h.body || "Journal entry"), 1),
              i("time", Yl, v(y(wt)(h.ts, t.now)), 1)
            ]))), 128))
          ])) : (b(), k("p", Bl, " Nothing decided, finished or blocked in the facts this journal has published so far. "))
        ])
      ])
    ]));
  }
}), Ul = {
  class: "jr-orbit",
  "aria-label": "Record orbit"
}, Xl = { class: "jr-panel-head" }, Hl = {
  key: 0,
  class: "jr-orbit-tabs",
  "aria-label": "Orbit or record"
}, Gl = {
  key: 0,
  class: "jr-empty-state"
}, Kl = { class: "jr-detail-head" }, Jl = { class: "jr-detail-title" }, Vl = { class: "jr-eyebrow" }, Zl = { class: "jr-detail-summary" }, Ql = { class: "jr-detail-meta" }, tu = { class: "jr-numeric" }, eu = { class: "jr-numeric" }, nu = { class: "jr-numeric" }, ou = {
  key: 0,
  class: "jr-detail-section jr-orbit-chain"
}, su = { class: "jr-numeric" }, ru = { class: "jr-chain" }, iu = ["onClick"], au = {
  key: 1,
  class: "jr-detail-section"
}, lu = { class: "jr-numeric" }, uu = ["onClick"], cu = {
  key: 2,
  class: "jr-detail-section jr-danger-section"
}, du = { class: "jr-numeric" }, hu = ["onClick"], fu = ["onClick"], pu = {
  key: 3,
  class: "jr-detail-section jr-danger-section"
}, gu = { class: "jr-numeric" }, vu = ["onClick"], mu = { class: "danger" }, yu = {
  key: 4,
  class: "jr-detail-section"
}, bu = { class: "jr-numeric" }, wu = ["open"], ku = { class: "jr-numeric" }, _u = ["onClick"], xu = ["onClick"], $u = {
  key: 5,
  class: "jr-detail-section"
}, ju = { class: "jr-numeric" }, Mu = { class: "jr-numeric" }, Au = {
  key: 6,
  class: "jr-detail-section jr-presence-section"
}, Iu = { class: "jr-numeric" }, Su = { class: "jr-avatar" }, Cu = { class: "jr-avatar" }, Nu = {
  key: 0,
  class: "jr-learning"
}, Eu = {
  key: 1,
  class: "jr-content-stack"
}, Lu = { class: "jr-numeric" }, Tu = ["open"], Ru = { key: 0 }, Ou = { key: 1 }, Du = {
  key: 2,
  class: "jr-detail-section jr-note-fields"
}, Pu = { class: "jr-numeric" }, Wu = {
  key: 3,
  class: "jr-detail-section"
}, Fu = { class: "jr-numeric" }, Bu = ["onClick"], zu = {
  key: 4,
  class: "jr-detail-section"
}, Yu = { class: "jr-detail-section" }, qu = { class: "jr-numeric" }, Uu = { class: "jr-numeric" }, Xu = { class: "jr-numeric" }, Hu = /* @__PURE__ */ At({
  __name: "OrbitPanel",
  props: {
    node: {},
    nodes: {},
    edges: {},
    presence: {},
    spans: {},
    events: {},
    graphId: {},
    now: {},
    peek: { type: Boolean }
  },
  emits: ["select", "focus", "close"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = O(() => new Map(e.nodes.map((E) => [E.id, E]))), r = O(() => e.node ? e.edges.filter((E) => E.to === e.node.id && ce(E.kind) !== "presence") : []), u = O(() => e.node ? e.edges.filter((E) => E.from === e.node.id && ce(E.kind) !== "presence") : []), a = O(() => ({ ...e.node?.attrs || {}, ...e.node?.metadata || {} })), d = O(() => {
      const E = [], I = /* @__PURE__ */ new Set();
      let N = e.node?.parent_id ? s.value.get(e.node.parent_id) : void 0;
      for (; N && !I.has(N.id) && E.length < 32; )
        I.add(N.id), E.push(N), N = N.parent_id ? s.value.get(N.parent_id) : void 0;
      return E.reverse();
    }), l = O(() => e.node ? e.nodes.filter((E) => E.parent_id === e.node.id).sort((E, I) => I.updated_at - E.updated_at) : []), c = O(() => {
      const E = /* @__PURE__ */ new Map(), I = (N) => {
        const Z = E.get(N);
        if (Z) return Z;
        const it = { kind: N, out: [], in: [] };
        return E.set(N, it), it;
      };
      for (const N of u.value) I(N.kind).out.push(N);
      for (const N of r.value) I(N.kind).in.push(N);
      return [...E.values()].sort((N, Z) => Z.out.length + Z.in.length - (N.out.length + N.in.length));
    }), p = O(() => u.value.filter((E) => /^(blocks|threatens|invalidates)$/i.test(E.kind))), m = O(() => r.value.filter((E) => /^(blocks|threatens|invalidates)$/i.test(E.kind))), f = O(() => [...r.value, ...u.value].filter((E) => ce(E.kind) === "conflict")), j = O(() => [...r.value, ...u.value].filter((E) => /support|evidence|source|reference|provenance|verif/.test(E.kind)).slice(0, 8)), x = O(() => u.value.find((E) => /supersed|successor|learned/.test(E.kind))), w = O(() => {
      const E = e.node?.id || "";
      if (!E) return [];
      const I = String(a.value.event_id || ""), N = E.replace(/^event:/, "");
      return (e.events || []).filter((Z) => Z.id === N || Z.id === I || (Z.linked_task_ids || []).includes(N)).sort((Z, it) => it.seq - Z.seq);
    }), g = O(() => (e.presence || []).filter((E) => E.positionId === e.node?.id || E.touchNodeId === e.node?.id)), h = O(() => {
      const E = new Set(w.value.map((I) => I.id));
      return (e.spans || []).filter((I) => I.last_fact && E.has(I.last_fact.event_id)).sort((I, N) => N.last_activity_at - I.last_activity_at);
    });
    function A(E) {
      return typeof E == "string" ? E : E == null ? "" : JSON.stringify(E, null, 2);
    }
    const S = O(() => {
      const E = a.value, I = [], N = (it, L, nt = "Content") => {
        if (typeof it == "string") {
          it && I.push({ id: `content-${L}`, title: nt, body: it, format: "text", role: "content", collapsed: !1 });
          return;
        }
        if (!it || typeof it != "object") return;
        const V = it, K = A(V.body ?? V.text ?? V.content);
        K && I.push({
          id: String(V.id || `content-${L}`),
          title: String(V.title || V.name || nt),
          body: K,
          format: String(V.format || V.media_type || "text").toLowerCase(),
          role: String(V.role || "content"),
          collapsed: V.collapsed === !0
        });
      };
      return N(E.content, 0), (Array.isArray(E.documents) ? E.documents : Array.isArray(E.content_blocks) ? E.content_blocks : []).forEach((it, L) => N(it, L + 1, `Document ${L + 1}`)), I;
    }), $ = O(() => {
      const E = { ...a.value };
      return delete E.content, delete E.documents, delete E.content_blocks, E;
    }), T = O(() => Object.entries($.value).filter(([E, I]) => E !== "journal_write" && E !== "provenance" && (typeof I == "string" || typeof I == "number" || typeof I == "boolean")).slice(0, 10).map(([E, I]) => ({
      key: E,
      label: E.replace(/[_-]+/g, " ").replace(/\b\w/g, (N) => N.toUpperCase()),
      value: String(I)
    }))), C = O(() => {
      const E = e.node?.summary || "No summary has been recorded for this record.";
      return E.length > 600 ? `${E.slice(0, 599)}…` : E;
    }), W = B("orbit");
    yt(() => e.node?.id, () => {
      W.value = "orbit";
    });
    function D(E) {
      return E.from === e.node?.id ? E.to : E.from;
    }
    function J(E) {
      return s.value.get(E)?.label || "Record outside this view";
    }
    function rt(E) {
      return E ? new Date(E * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Unknown";
    }
    return (E, I) => (b(), k("section", Ul, [
      i("header", Xl, [
        i("span", null, v(t.peek ? "Peek" : "Record"), 1),
        t.node ? (b(), k("nav", Hl, [
          i("button", {
            class: tt({ active: W.value === "orbit" }),
            onClick: I[0] || (I[0] = (N) => W.value = "orbit")
          }, "Orbit", 2),
          i("button", {
            class: tt({ active: W.value === "record" }),
            onClick: I[1] || (I[1] = (N) => W.value = "record")
          }, "Record", 2)
        ])) : X("", !0),
        i("button", {
          "aria-label": "Close",
          title: "Close",
          onClick: I[2] || (I[2] = (N) => o("close"))
        }, [
          z(y(G), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ]),
      t.node ? (b(), k("div", {
        key: 1,
        class: tt(["jr-orbit-body", `family-${y($t)(t.node.kind)}`]),
        style: bt({ "--node-color": y($e)(t.node.kind) })
      }, [
        i("div", Kl, [
          i("div", Jl, [
            z(xe, {
              class: "jr-kind-mark large",
              family: y($t)(t.node.kind),
              radius: 9,
              "view-box": "-14 -14 28 28"
            }, null, 8, ["family"]),
            i("div", null, [
              i("span", Vl, v(t.node.kind.replace(/_/g, " ")), 1),
              i("h2", null, v(t.node.label), 1)
            ])
          ]),
          i("p", Zl, v(C.value), 1),
          i("div", Ql, [
            t.node.status ? (b(), k("span", {
              key: 0,
              class: tt(["jr-state-chip", `state-${t.node.status.toLowerCase()}`])
            }, v(t.node.status), 3)) : X("", !0),
            i("span", tu, "rev " + v(t.node.revision), 1),
            i("span", eu, v(r.value.length + u.value.length) + " relations", 1),
            i("span", nu, v(y(wt)(t.node.updated_at, t.now)), 1),
            i("button", {
              class: "jr-root-action",
              onClick: I[3] || (I[3] = (N) => o("focus", t.node.id))
            }, [
              z(y(G), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              }),
              I[8] || (I[8] = H(" Descend", -1))
            ])
          ])
        ]),
        W.value === "orbit" ? (b(), k(U, { key: 0 }, [
          d.value.length ? (b(), k("section", ou, [
            i("h3", null, [
              I[9] || (I[9] = H("Hangs from ", -1)),
              i("span", su, v(d.value.length), 1)
            ]),
            i("ol", ru, [
              (b(!0), k(U, null, Q(d.value, (N, Z) => (b(), k("li", {
                key: N.id,
                style: bt({ "--step": Z })
              }, [
                i("button", {
                  class: "jr-related",
                  onClick: (it) => o("select", N.id)
                }, [
                  z(xe, {
                    class: "jr-kind-mark",
                    family: y($t)(N.kind),
                    radius: 9
                  }, null, 8, ["family"]),
                  i("span", null, v(N.label), 1),
                  I[10] || (I[10] = i("b", { "aria-hidden": "true" }, "›", -1))
                ], 8, iu)
              ], 4))), 128))
            ])
          ])) : X("", !0),
          l.value.length ? (b(), k("section", au, [
            i("h3", null, [
              I[11] || (I[11] = H("Holds ", -1)),
              i("span", lu, v(l.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(l.value.slice(0, 12), (N) => (b(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Z) => o("select", N.id)
            }, [
              i("i", null, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(N.label), 1),
              I[12] || (I[12] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, uu))), 128)),
            l.value.length > 12 ? (b(), k("button", {
              key: 0,
              class: "jr-orbit-more",
              onClick: I[4] || (I[4] = (N) => o("focus", t.node.id))
            }, " Descend to read all " + v(l.value.length), 1)) : X("", !0)
          ])) : X("", !0),
          m.value.length || p.value.length ? (b(), k("section", cu, [
            i("h3", null, [
              I[13] || (I[13] = H("Blocking ", -1)),
              i("span", du, v(m.value.length + p.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(m.value, (N) => (b(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Z) => o("select", D(N))
            }, [
              I[14] || (I[14] = i("i", { class: "danger" }, "blocked by", -1)),
              i("span", null, v(J(D(N))), 1),
              I[15] || (I[15] = i("b", { "aria-hidden": "true" }, "‹", -1))
            ], 8, hu))), 128)),
            (b(!0), k(U, null, Q(p.value, (N) => (b(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Z) => o("select", D(N))
            }, [
              I[16] || (I[16] = i("i", { class: "danger" }, "blocks", -1)),
              i("span", null, v(J(D(N))), 1),
              I[17] || (I[17] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, fu))), 128))
          ])) : X("", !0),
          f.value.length ? (b(), k("section", pu, [
            i("h3", null, [
              I[18] || (I[18] = H("Contested by ", -1)),
              i("span", gu, v(f.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(f.value, (N) => (b(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Z) => o("select", D(N))
            }, [
              i("i", mu, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(J(D(N))), 1),
              I[19] || (I[19] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, vu))), 128))
          ])) : X("", !0),
          c.value.length ? (b(), k("section", yu, [
            i("h3", null, [
              I[20] || (I[20] = H("Relations by kind ", -1)),
              i("span", bu, v(c.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(c.value, (N) => (b(), k("details", {
              key: N.kind,
              class: "jr-relation-group",
              open: N.out.length + N.in.length <= 4
            }, [
              i("summary", null, [
                i("span", {
                  class: tt(["jr-relation-kind", `edge-${y(ce)(N.kind)}`])
                }, v(N.kind.replace(/_/g, " ")), 3),
                i("em", ku, v(N.out.length) + " out · " + v(N.in.length) + " in", 1)
              ]),
              (b(!0), k(U, null, Q(N.out, (Z) => (b(), k("button", {
                key: `o-${Z.id}`,
                class: "jr-related",
                onClick: (it) => o("select", D(Z))
              }, [
                I[21] || (I[21] = i("i", null, "out", -1)),
                i("span", null, v(J(D(Z))), 1),
                I[22] || (I[22] = i("b", { "aria-hidden": "true" }, "›", -1))
              ], 8, _u))), 128)),
              (b(!0), k(U, null, Q(N.in, (Z) => (b(), k("button", {
                key: `i-${Z.id}`,
                class: "jr-related",
                onClick: (it) => o("select", D(Z))
              }, [
                I[23] || (I[23] = i("i", null, "in", -1)),
                i("span", null, v(J(D(Z))), 1),
                I[24] || (I[24] = i("b", { "aria-hidden": "true" }, "‹", -1))
              ], 8, xu))), 128))
            ], 8, wu))), 128))
          ])) : X("", !0),
          w.value.length ? (b(), k("section", $u, [
            i("h3", null, [
              I[25] || (I[25] = H("Facts attached ", -1)),
              i("span", ju, v(w.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(w.value.slice(0, 10), (N) => (b(), k("div", {
              key: N.id,
              class: "jr-orbit-fact"
            }, [
              i("span", {
                class: tt(["jr-eyebrow", `family-${y($t)(N.event_type)}`])
              }, v(N.event_type.replace(/_/g, " ")), 3),
              i("b", null, v(N.title || N.body || "Journal entry"), 1),
              i("time", Mu, v(y(wt)(N.ts, t.now)), 1)
            ]))), 128))
          ])) : X("", !0),
          g.value.length || h.value.length ? (b(), k("section", Au, [
            i("h3", null, [
              I[26] || (I[26] = H("Who has been here ", -1)),
              i("span", Iu, v(g.value.length + h.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(g.value, (N) => (b(), k("div", {
              key: N.id,
              class: "jr-presence-row"
            }, [
              i("span", Su, v(N.initials), 1),
              i("span", null, [
                i("b", null, v(N.label), 1),
                i("small", null, v(N.purpose), 1)
              ])
            ]))), 128)),
            (b(!0), k(U, null, Q(h.value, (N) => (b(), k("div", {
              key: N.span_id,
              class: "jr-presence-row"
            }, [
              i("span", Cu, v(y(Gt)(N.agent_id || N.cursor_id || "").initials), 1),
              i("span", null, [
                i("b", null, v(y(Gt)(N.agent_id || N.cursor_id || "").label), 1),
                i("small", null, v(N.working_on?.text || "Wrote here") + " · " + v(y(wt)(N.last_activity_at, t.now)), 1)
              ])
            ]))), 128))
          ])) : X("", !0)
        ], 64)) : (b(), k(U, { key: 1 }, [
          y(ke)(t.node) ? (b(), k("section", Nu, [
            I[27] || (I[27] = i("span", { class: "jr-eyebrow" }, "Distilled learning", -1)),
            i("p", null, v(a.value.learning || a.value.distilled || t.node.summary || "This branch was folded without a learning summary."), 1)
          ])) : X("", !0),
          S.value.length ? (b(), k("section", Eu, [
            i("h3", null, [
              I[28] || (I[28] = H("Content ", -1)),
              i("span", Lu, v(S.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(S.value, (N, Z) => (b(), k("details", {
              key: N.id,
              class: "jr-content-block",
              open: !N.collapsed && Z === 0
            }, [
              i("summary", null, [
                i("span", null, v(N.title), 1),
                i("em", null, v(N.role) + " · " + v(N.format), 1)
              ]),
              /json|code|lua|typescript|javascript|yaml/.test(N.format) ? (b(), k("pre", Ru, v(N.body), 1)) : (b(), k("div", Ou, v(N.body), 1))
            ], 8, Tu))), 128))
          ])) : X("", !0),
          T.value.length ? (b(), k("section", Du, [
            i("h3", null, [
              I[29] || (I[29] = H("Context ", -1)),
              i("span", Pu, v(T.value.length), 1)
            ]),
            i("dl", null, [
              (b(!0), k(U, null, Q(T.value, (N) => (b(), k(U, {
                key: N.key
              }, [
                i("dt", null, v(N.label), 1),
                i("dd", null, v(N.value), 1)
              ], 64))), 128))
            ])
          ])) : X("", !0),
          j.value.length ? (b(), k("section", Wu, [
            i("h3", null, [
              I[30] || (I[30] = H("Evidence ", -1)),
              i("span", Fu, v(j.value.length), 1)
            ]),
            (b(!0), k(U, null, Q(j.value, (N) => (b(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Z) => o("select", D(N))
            }, [
              i("i", null, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(J(D(N))), 1),
              I[31] || (I[31] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, Bu))), 128))
          ])) : X("", !0),
          x.value ? (b(), k("section", zu, [
            I[33] || (I[33] = i("h3", null, "Superseded by", -1)),
            i("button", {
              class: "jr-related",
              onClick: I[5] || (I[5] = (N) => o("select", D(x.value)))
            }, [
              i("i", null, v(x.value.kind.replace(/_/g, " ")), 1),
              i("span", null, v(J(D(x.value))), 1),
              I[32] || (I[32] = i("b", { "aria-hidden": "true" }, "›", -1))
            ])
          ])) : X("", !0),
          i("section", Yu, [
            I[38] || (I[38] = i("h3", null, "Position", -1)),
            i("dl", null, [
              I[34] || (I[34] = i("dt", null, "Parent", -1)),
              i("dd", null, v(s.value.get(t.node.parent_id || "")?.label || (t.node.parent_id ? "Parent outside this view" : "Graph root")), 1),
              I[35] || (I[35] = i("dt", null, "Children", -1)),
              i("dd", qu, v(t.node.child_count), 1),
              I[36] || (I[36] = i("dt", null, "Updated", -1)),
              i("dd", Uu, v(rt(t.node.updated_at)), 1),
              I[37] || (I[37] = i("dt", null, "Created", -1)),
              i("dd", Xu, v(rt(t.node.created_at)), 1)
            ])
          ])
        ], 64))
      ], 6)) : (b(), k("div", Gl, [
        z(y(G), {
          icon: "tabler:focus-2",
          "aria-hidden": "true"
        }),
        I[6] || (I[6] = i("h3", null, "Nothing selected", -1)),
        I[7] || (I[7] = i("p", null, "Pick a record in any lens to read what it hangs from, what argues with it, and who has been standing on it.", -1))
      ]))
    ]));
  }
}), Gu = 4, Ku = { start: 0, end: 0, padTop: 0, padBottom: 0 };
function Ju(t, n, e, o, s = Gu) {
  if (o <= 0 || e <= 0) return Ku;
  const r = Math.max(0, t), u = Math.max(0, n), a = Math.floor(r / e) - s, d = Math.ceil((r + u) / e) + s, l = Math.min(o - 1, Math.max(0, a)), c = Math.min(o, Math.max(l + 1, d));
  return { start: l, end: c, padTop: l * e, padBottom: (o - c) * e };
}
function Vu(t, n) {
  return Math.max(0, t) * Math.max(0, n);
}
function Zu(t, n, e, o) {
  const s = Vu(t, o), r = s + Math.max(0, o);
  return s < n ? s : r > n + Math.max(0, e) ? Math.max(0, r - Math.max(0, e)) : Math.max(0, n);
}
const Qu = /* @__PURE__ */ At({
  __name: "VirtualList",
  props: {
    items: {},
    rowHeight: {},
    overscan: {},
    scrollToIndex: {},
    restoreScrollTop: {}
  },
  emits: ["scroll"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(null), r = B(0), u = B(0);
    let a = 0, d = null;
    const l = O(() => Ju(r.value, u.value, e.rowHeight, e.items.length, e.overscan)), c = O(() => e.items.slice(l.value.start, l.value.end).map((j, x) => ({ item: j, index: l.value.start + x })));
    function p() {
      const j = s.value;
      j && (u.value = j.clientHeight, r.value = j.scrollTop);
    }
    function m() {
      a || (a = requestAnimationFrame(() => {
        a = 0, r.value = s.value?.scrollTop || 0, o("scroll", r.value);
      }));
    }
    yt(() => e.scrollToIndex, (j) => {
      const x = s.value;
      if (!x || j === void 0 || j < 0) return;
      const w = Zu(j, x.scrollTop, x.clientHeight || u.value, e.rowHeight);
      w === r.value && w === x.scrollTop || (x.scrollTop = w, r.value = w);
    });
    function f(j) {
      if (j === void 0 || j < 0) return;
      const x = s.value;
      r.value = j, x && (x.scrollTop = j);
    }
    return yt(() => e.restoreScrollTop, f), Qe(() => {
      p(), f(e.restoreScrollTop), d = new ResizeObserver(p), s.value && d.observe(s.value);
    }), Fe(() => {
      a && cancelAnimationFrame(a), a = 0, d?.disconnect(), d = null;
    }), (j, x) => (b(), k("div", {
      ref_key: "scroller",
      ref: s,
      class: "jr-vlist",
      onScrollPassive: m
    }, [
      i("div", {
        class: "jr-vlist-pad",
        style: bt({ height: `${l.value.padTop}px` }),
        "aria-hidden": "true"
      }, null, 4),
      (b(!0), k(U, null, Q(c.value, (w) => No(j.$slots, "row", {
        item: w.item,
        index: w.index
      }, void 0, void 0, w.index)), 128)),
      i("div", {
        class: "jr-vlist-pad",
        style: bt({ height: `${l.value.padBottom}px` }),
        "aria-hidden": "true"
      }, null, 4)
    ], 544));
  }
}), tc = {
  key: 0,
  class: "jr-empty-small"
}, ec = ["data-row", "tabindex", "aria-level", "aria-selected", "aria-setsize", "aria-posinset", "aria-expanded", "onClick", "onDblclick", "onContextmenu", "onFocusin", "onKeydown"], nc = ["aria-label", "onClick"], oc = {
  key: 1,
  class: "jr-disclosure-spacer",
  "aria-hidden": "true"
}, sc = { class: "jr-tree-copy" }, rc = { class: "jr-tree-title" }, ic = {
  key: 0,
  class: "jr-tree-summary"
}, ac = { class: "jr-tree-meta" }, lc = { class: "jr-tree-kind" }, uc = ["title"], cc = ["title"], dc = ["aria-label", "onClick"], hc = 44, fc = 34, pc = /* @__PURE__ */ At({
  __name: "OutlineTree",
  props: {
    nodes: {},
    edges: {},
    presence: {},
    touchedIds: {},
    selectedId: {},
    compact: { type: Boolean },
    viewport: {}
  },
  emits: ["select", "focus", "menu", "viewport"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(/* @__PURE__ */ new Set());
    let r = /* @__PURE__ */ new Set();
    yt(() => e.nodes, ($) => {
      s.value = Yo($, s.value, r), r = new Set($.map((T) => T.id));
    }, { immediate: !0 });
    const u = O(() => e.nodes.filter(($) => !Pe($))), a = O(() => Bo(u.value, s.value)), d = O(() => e.compact ? fc : hc), l = O(() => _o(e.edges || [])), c = O(() => {
      const $ = /* @__PURE__ */ new Map();
      for (const T of e.presence || []) {
        if (!T.positionId) continue;
        const C = $.get(T.positionId) || [];
        C.push(T), $.set(T.positionId, C);
      }
      return $;
    }), p = B(null), m = B(-1), f = B(void 0), j = O(() => Math.min(Math.max(m.value, 0), Math.max(a.value.length - 1, 0)));
    let x = "";
    yt(() => [e.selectedId, a.value], ([$]) => {
      if (!$ || $ === x) return;
      const T = a.value.findIndex((C) => C.node.id === $);
      T < 0 || (x = $, m.value = T, f.value = T);
    }, { immediate: !0 });
    function w($) {
      const T = new Set(s.value);
      T.has($) ? T.delete($) : T.add($), s.value = T;
    }
    function g($) {
      $ < 0 || $ >= a.value.length || (m.value = $, f.value = $, he(() => p.value?.querySelector(`[data-row="${$}"]`)?.focus()));
    }
    function h($) {
      const T = a.value[$].depth;
      for (let C = $ - 1; C >= 0; C--) if (a.value[C].depth < T) return C;
      return -1;
    }
    function A($, T) {
      const C = a.value[$];
      if (!C) return;
      const W = a.value[$ + 1];
      switch (T.key) {
        case "ArrowDown":
          g($ + 1);
          break;
        case "ArrowUp":
          g($ - 1);
          break;
        case "ArrowRight":
          if (!C.hasChildren) return;
          C.expanded ? W && W.depth > C.depth && g($ + 1) : w(C.node.id);
          break;
        case "ArrowLeft":
          C.hasChildren && C.expanded ? w(C.node.id) : g(h($));
          break;
        case "Enter":
        case " ":
          o("select", C.node.id);
          break;
        default:
          return;
      }
      T.preventDefault();
    }
    function S($) {
      return String($.status || $.metadata?.outcome || "");
    }
    return ($, T) => (b(), k("div", {
      ref_key: "root",
      ref: p,
      class: tt(["jr-tree", { compact: t.compact }]),
      role: "tree",
      "aria-label": "Journal outline",
      style: bt({ "--jr-row-height": `${d.value}px` })
    }, [
      a.value.length ? (b(), Yt(Qu, {
        key: 1,
        role: "presentation",
        items: a.value,
        "row-height": d.value,
        "scroll-to-index": f.value,
        "restore-scroll-top": t.viewport?.scrollTop,
        onScroll: T[0] || (T[0] = (C) => o("viewport", { scrollTop: C }))
      }, {
        row: Eo(({ item: C, index: W }) => [
          i("div", {
            class: tt(["jr-tree-row", `family-${y($t)(C.node.kind)}`, {
              selected: C.node.id === t.selectedId,
              folded: y(ke)(C.node),
              settled: y(tn)(C.node),
              branch: C.hasChildren,
              occupied: c.value.has(C.node.id),
              touched: t.touchedIds?.has(C.node.id)
            }]),
            style: bt({ "--depth": C.depth, "--node-color": y($e)(C.node.kind) }),
            "data-row": W,
            role: "treeitem",
            tabindex: W === j.value ? 0 : -1,
            "aria-level": C.depth + 1,
            "aria-selected": C.node.id === t.selectedId,
            "aria-setsize": a.value.length,
            "aria-posinset": W + 1,
            "aria-expanded": C.hasChildren ? C.expanded : void 0,
            onClick: (D) => o("select", C.node.id),
            onDblclick: Wt((D) => o("focus", C.node.id), ["prevent"]),
            onContextmenu: Wt((D) => o("menu", C.node.id, D), ["prevent"]),
            onFocusin: (D) => m.value = W,
            onKeydown: (D) => A(W, D)
          }, [
            T[1] || (T[1] = i("span", {
              class: "jr-tree-guides",
              "aria-hidden": "true"
            }, null, -1)),
            C.hasChildren ? (b(), k("button", {
              key: 0,
              class: "jr-disclosure",
              "aria-label": C.expanded ? "Collapse branch" : "Expand branch",
              onClick: Wt((D) => w(C.node.id), ["stop"])
            }, [
              z(y(G), {
                icon: C.expanded ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, nc)) : (b(), k("span", oc)),
            z(xe, {
              class: "jr-kind-mark",
              family: y($t)(C.node.kind),
              radius: 7,
              "view-box": "-11 -11 22 22"
            }, null, 8, ["family"]),
            i("span", sc, [
              i("span", rc, v(C.node.label), 1),
              !t.compact && C.node.summary ? (b(), k("span", ic, v(C.node.summary), 1)) : X("", !0)
            ]),
            i("span", ac, [
              i("span", lc, v(C.node.kind.replace(/_/g, " ")), 1),
              c.value.get(C.node.id) ? (b(), k("span", {
                key: 0,
                class: "jr-tree-presence",
                title: c.value.get(C.node.id).map((D) => D.label).join(", ")
              }, [
                (b(!0), k(U, null, Q(c.value.get(C.node.id).slice(0, 3), (D) => (b(), k("i", {
                  key: D.id
                }, v(D.initials), 1))), 128))
              ], 8, uc)) : X("", !0),
              S(C.node) ? (b(), k("span", {
                key: 1,
                class: tt(["jr-state-chip", `state-${S(C.node).toLowerCase()}`])
              }, v(S(C.node)), 3)) : X("", !0),
              i("span", {
                class: "jr-tree-links jr-numeric",
                title: `${l.value.get(C.node.id) || 0} relations · ${C.node.child_count} children`
              }, [
                z(y(G), {
                  icon: "tabler:link",
                  "aria-hidden": "true"
                }),
                H(v(l.value.get(C.node.id) || 0), 1)
              ], 8, cc)
            ]),
            i("button", {
              class: "jr-open-root",
              title: "Open as focus root",
              "aria-label": `Open ${C.node.label} as focus root`,
              onClick: Wt((D) => o("focus", C.node.id), ["stop"])
            }, [
              z(y(G), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              })
            ], 8, dc)
          ], 46, ec)
        ]),
        _: 1
      }, 8, ["items", "row-height", "scroll-to-index", "restore-scroll-top"])) : (b(), k("p", tc, "No records in this focus window."))
    ], 6));
  }
}), gc = { class: "jr-search-lens" }, vc = {
  key: 0,
  class: "jr-lens-meta"
}, mc = { class: "jr-lens-facts" }, yc = { class: "jr-numeric" }, bc = {
  key: 1,
  class: "jr-loading-lines",
  "aria-label": "Searching"
}, wc = {
  key: 2,
  class: "jr-empty-state"
}, kc = {
  key: 3,
  class: "jr-empty-state"
}, _c = {
  key: 4,
  class: "jr-result-list"
}, xc = ["onClick"], $c = { class: "jr-result-rank jr-numeric" }, jc = { class: "jr-result-copy" }, Mc = { class: "jr-eyebrow" }, Ac = { class: "jr-numeric" }, Ic = { class: "jr-score" }, Sc = { class: "jr-numeric" }, Cc = /* @__PURE__ */ At({
  __name: "SearchLens",
  props: {
    results: {},
    query: {},
    mode: {},
    loading: { type: Boolean }
  },
  emits: ["select"],
  setup(t, { emit: n }) {
    const e = n;
    function o(r) {
      return typeof r.distance == "number" ? Math.max(0, Math.min(1, 1 - r.distance)) : null;
    }
    function s(r) {
      return r ? new Date(r * 1e3).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" }) : "";
    }
    return (r, u) => (b(), k("section", gc, [
      t.query ? (b(), k("div", vc, [
        u[4] || (u[4] = i("span", { class: "jr-lens-title" }, "Recall", -1)),
        i("span", mc, [
          i("b", yc, v(t.results.length), 1),
          u[0] || (u[0] = H(" matches ", -1)),
          u[1] || (u[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          H(" " + v(t.mode) + " ", 1),
          u[2] || (u[2] = i("i", { "aria-hidden": "true" }, null, -1)),
          u[3] || (u[3] = H(" bounded to this graph", -1))
        ])
      ])) : X("", !0),
      t.loading ? (b(), k("div", bc, [
        (b(), k(U, null, Q(5, (a) => i("i", { key: a })), 64))
      ])) : t.query ? t.results.length ? (b(), k("ol", _c, [
        (b(!0), k(U, null, Q(t.results, (a, d) => (b(), k("li", {
          key: a.id
        }, [
          i("button", {
            class: tt(["jr-result", `family-${y($t)(a.kind)}`]),
            style: bt({ "--node-color": y($e)(a.kind) }),
            onClick: (l) => e("select", a.id)
          }, [
            i("span", $c, v(d + 1), 1),
            z(xe, {
              class: "jr-kind-mark",
              family: y($t)(a.kind),
              radius: 8
            }, null, 8, ["family"]),
            i("span", jc, [
              i("span", Mc, v(a.kind.replace(/_/g, " ")), 1),
              i("b", null, v(a.label), 1),
              i("span", null, v(a.summary || "No summary recorded."), 1),
              i("small", Ac, v(s(a.updated_at)), 1)
            ]),
            i("span", Ic, [
              i("b", Sc, v(o(a) !== null ? o(a)?.toFixed(2) : "exact"), 1),
              i("i", null, [
                i("span", {
                  style: bt({ width: `${(o(a) ?? 1) * 100}%` })
                }, null, 4)
              ]),
              i("small", null, v(o(a) !== null ? "semantic" : "text + attrs"), 1)
            ])
          ], 14, xc)
        ]))), 128))
      ])) : (b(), k("div", kc, [
        z(y(G), {
          icon: "tabler:file-search",
          "aria-hidden": "true"
        }),
        u[7] || (u[7] = i("h3", null, "Nothing matched", -1)),
        u[8] || (u[8] = i("p", null, "Try a broader phrase, or open the navigator and search a different graph.", -1))
      ])) : (b(), k("div", wc, [
        z(y(G), {
          icon: "tabler:search",
          "aria-hidden": "true"
        }),
        u[5] || (u[5] = i("h3", null, "Recall context, not just words", -1)),
        u[6] || (u[6] = i("p", null, "Match exact text or semantic meaning inside this graph. Every result keeps its address and revision, so you can cite what you find.", -1))
      ]))
    ]));
  }
}), Nc = {
  class: "jr-stale",
  "aria-label": "Stale review"
}, Ec = { class: "jr-lens-meta" }, Lc = { class: "jr-lens-facts" }, Tc = { class: "jr-numeric" }, Rc = { class: "jr-numeric" }, Oc = { class: "jr-numeric" }, Dc = ["title"], Pc = {
  key: 0,
  class: "jr-empty-state"
}, Wc = {
  key: 1,
  class: "jr-stale-list"
}, Fc = { class: "jr-stale-head" }, Bc = ["aria-label", "aria-expanded", "onClick"], zc = ["onClick"], Yc = {
  key: 0,
  class: "jr-numeric"
}, qc = {
  key: 1,
  class: "jr-numeric"
}, Uc = { class: "jr-numeric" }, Xc = { class: "jr-numeric" }, Hc = {
  key: 2,
  class: "jr-numeric"
}, Gc = { class: "jr-numeric" }, Kc = { class: "jr-numeric dormant" }, Jc = {
  key: 0,
  class: "jr-stale-members"
}, Vc = ["onClick"], Zc = { class: "jr-numeric" }, Qc = ["onClick"], td = { class: "jr-numeric" }, ed = /* @__PURE__ */ At({
  __name: "StaleReview",
  props: {
    tasks: {},
    now: {},
    taskBound: {}
  },
  emits: ["task", "close"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = O(() => So(e.tasks, e.now)), r = O(() => {
      const l = new Map(e.tasks.map((m) => [m.id, m])), c = (m) => {
        let f = l.get(m);
        const j = /* @__PURE__ */ new Set();
        for (; f?.parent_task_id && l.has(f.parent_task_id) && !j.has(f.id); )
          j.add(f.id), f = l.get(f.parent_task_id);
        return f;
      }, p = /* @__PURE__ */ new Map();
      for (const m of s.value) {
        const f = c(m.root.id) || m.root, j = p.get(f.id);
        j ? j.parts.push(m) : p.set(f.id, { root: f, parts: [m] });
      }
      return [...p.values()].map((m) => ({
        root: m.root,
        parts: m.parts.sort((f, j) => f.lastActivityAt - j.lastActivityAt),
        tasks: m.parts.reduce((f, j) => f + j.members.length + 1, 0),
        open: m.parts.reduce((f, j) => f + j.openCount, 0),
        blocked: m.parts.reduce((f, j) => f + j.blockedCount, 0),
        settled: m.parts.reduce((f, j) => f + j.doneCount, 0),
        lastActivityAt: Math.max(...m.parts.map((f) => f.lastActivityAt)),
        whole: m.parts.length === 1 && m.parts[0].root.id === m.root.id
      })).sort((m, f) => m.lastActivityAt - f.lastActivityAt);
    }), u = B(/* @__PURE__ */ new Set()), a = O(() => ({
      programs: r.value.length,
      tasks: r.value.reduce((l, c) => l + c.tasks, 0),
      open: r.value.reduce((l, c) => l + c.open, 0)
    }));
    function d(l) {
      const c = new Set(u.value);
      c.has(l) ? c.delete(l) : c.add(l), u.value = c;
    }
    return (l, c) => (b(), k("section", Nc, [
      i("div", Ec, [
        c[6] || (c[6] = i("span", { class: "jr-lens-title" }, "Stale review", -1)),
        i("span", Lc, [
          i("b", Tc, v(a.value.programs), 1),
          H(" dormant program" + v(a.value.programs === 1 ? "" : "s") + " ", 1),
          c[1] || (c[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Rc, v(a.value.tasks), 1),
          c[2] || (c[2] = H(" tasks ", -1)),
          c[3] || (c[3] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Oc, v(a.value.open), 1),
          c[4] || (c[4] = H(" still open ", -1))
        ]),
        t.taskBound.hasMore ? (b(), k("span", {
          key: 0,
          class: "jr-lens-bound",
          title: `The journal task read returns one page; ${(t.taskBound.total - t.taskBound.loaded).toLocaleString()} more tasks exist and this review does not see them`
        }, [
          z(y(G), {
            icon: "tabler:alert-circle",
            "aria-hidden": "true"
          }),
          H(" over " + v(t.taskBound.loaded.toLocaleString()) + " of " + v(t.taskBound.total.toLocaleString()) + " tasks ", 1)
        ], 8, Dc)) : X("", !0),
        i("button", {
          class: "jr-lens-advice",
          onClick: c[0] || (c[0] = (p) => o("close"))
        }, [
          z(y(G), {
            icon: "tabler:x",
            "aria-hidden": "true"
          }),
          c[5] || (c[5] = H(" Done", -1))
        ])
      ]),
      s.value.length ? (b(), k("ol", Wc, [
        (b(!0), k(U, null, Q(r.value, (p) => (b(), k("li", {
          key: p.root.id,
          class: "jr-stale-item"
        }, [
          i("div", Fc, [
            i("button", {
              class: "jr-stale-fold",
              "aria-label": u.value.has(p.root.id) ? `Collapse ${p.root.title}` : `Expand ${p.root.title}`,
              "aria-expanded": u.value.has(p.root.id),
              onClick: (m) => d(p.root.id)
            }, [
              z(y(G), {
                icon: u.value.has(p.root.id) ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, Bc),
            i("button", {
              class: "jr-stale-title",
              onClick: (m) => o("task", p.root.id)
            }, [
              i("b", null, v(p.root.title), 1),
              i("small", null, [
                p.whole ? (b(), k("span", Yc, "dormant whole")) : (b(), k("span", qc, v(p.parts.length) + " dormant part" + v(p.parts.length === 1 ? "" : "s"), 1)),
                i("span", Uc, v(p.tasks) + " task" + v(p.tasks === 1 ? "" : "s"), 1),
                i("span", Xc, v(p.open) + " open", 1),
                p.blocked ? (b(), k("span", Hc, v(p.blocked) + " blocked", 1)) : X("", !0),
                i("span", Gc, v(p.settled) + " settled", 1)
              ])
            ], 8, zc),
            i("time", Kc, v(y(wt)(p.lastActivityAt, t.now)), 1)
          ]),
          u.value.has(p.root.id) ? (b(), k("ul", Jc, [
            (b(!0), k(U, null, Q(p.parts, (m) => (b(), k(U, {
              key: m.root.id
            }, [
              i("li", null, [
                i("button", {
                  onClick: (f) => o("task", m.root.id)
                }, [
                  i("span", {
                    class: tt(["jr-state-chip", `state-${m.root.status}`])
                  }, v(m.root.status.replace(/_/g, " ")), 3),
                  i("span", null, [
                    i("b", null, v(m.root.title), 1)
                  ]),
                  i("time", Zc, v(y(wt)(m.lastActivityAt, t.now)), 1)
                ], 8, Vc)
              ]),
              (b(!0), k(U, null, Q(m.members, (f) => (b(), k("li", {
                key: f.id,
                class: "nested"
              }, [
                i("button", {
                  onClick: (j) => o("task", f.id)
                }, [
                  i("span", {
                    class: tt(["jr-state-chip", `state-${f.status}`])
                  }, v(f.status.replace(/_/g, " ")), 3),
                  i("span", null, v(f.title), 1),
                  i("time", td, v(y(wt)(f.updated_at, t.now)), 1)
                ], 8, Qc)
              ]))), 128))
            ], 64))), 128))
          ])) : X("", !0)
        ]))), 128))
      ])) : (b(), k("div", Pc, [
        z(y(G), {
          icon: "tabler:mood-check",
          "aria-hidden": "true"
        }),
        c[7] || (c[7] = i("h3", null, "Nothing has gone dormant", -1)),
        i("p", null, "Every program in this journal has been touched inside the last " + v(Math.round(y(Mo) / 86400)) + " days.", 1)
      ])),
      c[8] || (c[8] = i("p", { class: "jr-stale-note" }, " This is a review surface. Settling work remains a guarded agent action with a live task lease, evidence, and the transition-specific fields required by the work protocol. ", -1))
    ]));
  }
}), nd = { class: "jr-timeline-lens" }, od = { class: "jr-lens-meta" }, sd = { class: "jr-lens-facts" }, rd = { class: "jr-numeric" }, id = {
  key: 0,
  class: "jr-empty-state"
}, ad = {
  key: 1,
  class: "jr-timeline"
}, ld = { class: "jr-time-day" }, ud = { class: "jr-numeric" }, cd = { class: "jr-time-list" }, dd = ["disabled", "onClick"], hd = {
  class: "jr-time-rail",
  "aria-hidden": "true"
}, fd = { class: "jr-time-copy" }, pd = { class: "jr-time-kind" }, gd = { class: "jr-time-rev jr-numeric" }, vd = /* @__PURE__ */ At({
  __name: "TimelineLens",
  props: {
    items: {},
    nodes: {}
  },
  emits: ["select"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = O(() => new Map((e.nodes || []).map((c) => [c.id, c.label])));
    function r(c) {
      return c && s.value.get(c) || "Record outside this view";
    }
    function u(c, p) {
      const m = c.attrs?.[p];
      return typeof m == "string" ? m : "";
    }
    function a(c) {
      const p = c.attrs?.operation, m = p && typeof p == "object" ? p.kind : void 0;
      return typeof m == "string" ? m : "related";
    }
    function d(c, p) {
      const m = c.updated_at ? new Date(c.updated_at * 1e3) : null, f = m ? m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "", j = c.entity_type === "edge", x = /\.add$/.test(c.kind) ? "added" : /\.remove|\.delete/.test(c.kind) ? "removed" : "updated";
      if (j) {
        const g = a(c), h = ce(g);
        return {
          item: c,
          minute: f,
          repeated: p?.minute === f,
          isEdge: j,
          title: `${r(c.from_node_id)} → ${r(c.to_node_id)}`,
          kind: g.replace(/_/g, " "),
          status: "",
          verb: x,
          family: "relation",
          colour: h === "conflict" ? "var(--jr-danger)" : h === "support" ? "var(--jr-success)" : h === "succession" ? "var(--jr-decision)" : "var(--jr-muted)"
        };
      }
      const w = u(c, "kind") || "record";
      return {
        item: c,
        minute: f,
        repeated: p?.minute === f,
        isEdge: j,
        title: c.label || u(c, "label") || "Journal entry",
        kind: w.replace(/_/g, " "),
        status: u(c, "status"),
        verb: x,
        family: $t(w),
        colour: $e(w)
      };
    }
    const l = O(() => {
      const c = /* @__PURE__ */ new Map();
      for (const p of e.items) {
        const m = p.updated_at ? new Date(p.updated_at * 1e3).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }) : "Undated", f = c.get(m) || [];
        f.push(d(p, f[f.length - 1])), c.set(m, f);
      }
      return [...c.entries()].map(([p, m]) => ({
        day: p,
        entries: m,
        records: m.filter((f) => !f.isEdge).length,
        relations: m.filter((f) => f.isEdge).length
      }));
    });
    return (c, p) => (b(), k("section", nd, [
      i("div", od, [
        p[3] || (p[3] = i("span", { class: "jr-lens-title" }, "Changes", -1)),
        i("span", sd, [
          i("b", rd, v(t.items.length), 1),
          p[0] || (p[0] = H(" revisions ", -1)),
          p[1] || (p[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          p[2] || (p[2] = H(" newest first", -1))
        ])
      ]),
      t.items.length ? (b(), k("ol", ad, [
        (b(!0), k(U, null, Q(l.value, (m) => (b(), k("li", {
          key: m.day,
          class: "jr-time-group"
        }, [
          i("h3", ld, [
            i("span", null, v(m.day), 1),
            i("em", ud, v(m.records) + " records · " + v(m.relations) + " relations", 1)
          ]),
          i("ol", cd, [
            (b(!0), k(U, null, Q(m.entries, (f) => (b(), k("li", {
              key: `${f.item.entity_type}:${f.item.id}`
            }, [
              i("button", {
                class: tt(["jr-time-row", { "is-edge": f.isEdge }]),
                disabled: f.isEdge,
                onClick: (j) => !f.isEdge && o("select", f.item.id)
              }, [
                i("time", {
                  class: tt(["jr-numeric", { repeat: f.repeated }])
                }, v(f.minute), 3),
                i("span", hd, [
                  z(xe, {
                    family: f.family === "relation" ? "note" : f.family,
                    radius: f.isEdge ? 4.4 : 6.4,
                    hollow: f.isEdge ? !1 : void 0,
                    "view-box": "-10 -10 20 20",
                    style: bt({ color: f.colour })
                  }, null, 8, ["family", "radius", "hollow", "style"])
                ]),
                i("span", fd, [
                  i("b", null, v(f.title), 1),
                  i("small", pd, v(f.kind), 1),
                  f.status ? (b(), k("small", {
                    key: 0,
                    class: tt(["jr-state-chip", `state-${f.status.toLowerCase()}`])
                  }, v(f.status), 3)) : X("", !0)
                ]),
                i("span", gd, v(f.verb) + " · rev " + v(f.item.revision), 1)
              ], 10, dd)
            ]))), 128))
          ])
        ]))), 128))
      ])) : (b(), k("div", id, [
        z(y(G), {
          icon: "tabler:timeline-event",
          "aria-hidden": "true"
        }),
        p[4] || (p[4] = i("h3", null, "No revisions in range", -1)),
        p[5] || (p[5] = i("p", null, "Nothing has been written to this graph inside the bounded query window.", -1))
      ]))
    ]));
  }
});
function Ht(t) {
  const n = new URLSearchParams();
  for (const [o, s] of Object.entries(t)) s !== void 0 && s !== "" && n.set(o, String(s));
  const e = n.toString();
  return e ? `?${e}` : "";
}
function Pt(t, n) {
  const e = t, o = e?.response?.data?.error ?? e?.data?.error;
  return typeof o == "string" && o ? o : typeof e?.message == "string" && e.message && !/status code|request failed/i.test(e.message) ? e.message : n;
}
const oo = 500, so = 1e3;
class md {
  constructor(n) {
    this.journalId = n;
  }
  base() {
    return `/api/v1/workspace/journals/${this.journalId}`;
  }
  /**
   * The journal itself: counts, the task page, the graph catalog, the cursor
   * roll and the open work spans. Every collection in it is a keyset page.
   */
  async state() {
    try {
      const { data: n } = await Nt.get(this.base());
      if (!n.success) throw new Error(n.error || "failed to read the journal");
      return n.journal;
    } catch (n) {
      throw new Error(Pt(n, "Couldn’t read this Journal."));
    }
  }
  /**
   * The whole task tree. The journal snapshot carries one pinned page of tasks
   * and no usable continuation, so a count taken over it would be a count over
   * a page; the tree read honours its own bounds and answers with the work the
   * journal actually holds.
   */
  async tasks(n = 5e3, e = 6) {
    try {
      const { data: o } = await Nt.get(`${this.base()}/tree${Ht({ depth: e, limit: n })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task tree");
      const s = [], r = (u, a) => {
        for (const d of u || []) {
          const { children: l, ...c } = d;
          s.push({ ...c, parent_task_id: c.parent_task_id || a }), l?.length && r(l, c.id);
        }
      };
      return r(o.tree?.children || []), { tasks: s, bounded: s.length >= n };
    } catch (o) {
      throw new Error(Pt(o, "Couldn’t read this Journal’s work."));
    }
  }
  async graphs() {
    try {
      const { data: n } = await Nt.get(`${this.base()}/graphs?limit=100`);
      if (!n.success) throw new Error(n.error || "failed to list graphs");
      return n.graphs || [];
    } catch (n) {
      throw new Error(Pt(n, "Couldn’t load Journal graphs."));
    }
  }
  async window(n, e) {
    try {
      const o = Ht({ mode: "window", node_id: e, levels: 4, limit: 160, edge_limit: 480 }), { data: s } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}${o}`);
      if (!s.success) throw new Error(s.error || "failed to load graph window");
      return s.result;
    } catch (o) {
      throw new Error(Pt(o, "Couldn’t load the graph focus window."));
    }
  }
  /**
   * One page of the whole graph. The server states the real totals in the
   * manifest and routes the next page in its own continuation, so a reader is
   * never told a count the graph does not hold.
   */
  async bundle(n, e, o) {
    try {
      const s = Ht({
        mode: "bundle",
        node_limit: oo,
        edge_limit: so,
        node_offset: e,
        edge_offset: o
      }), { data: r } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}${s}`);
      if (!r.success) throw new Error(r.error || "failed to load the graph");
      return r.result;
    } catch (s) {
      throw new Error(Pt(s, "Couldn’t load the whole graph."));
    }
  }
  /** A branch as its own canvas: the complete subtree under one record. */
  async subtree(n, e, o = 0, s = 0) {
    try {
      const r = Ht({
        mode: "subtree",
        root_id: e,
        node_limit: oo,
        edge_limit: so,
        node_offset: o,
        edge_offset: s
      }), { data: u } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}${r}`);
      if (!u.success) throw new Error(u.error || "failed to load the branch");
      return u.result;
    } catch (r) {
      throw new Error(Pt(r, "Couldn’t open this branch."));
    }
  }
  async search(n, e, o = "search") {
    try {
      const s = Ht({ mode: o, query: e, limit: 60 }), { data: r } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}${s}`);
      if (!r.success) throw new Error(r.error || "search failed");
      return r.result?.items || [];
    } catch (s) {
      throw new Error(Pt(s, "Couldn’t search this graph."));
    }
  }
  async timeline(n) {
    try {
      const e = Ht({ mode: "timeline", limit: 200 }), { data: o } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}${e}`);
      if (!o.success) throw new Error(o.error || "timeline failed");
      return o.result?.items || [];
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load the graph timeline."));
    }
  }
  /** The cursor store itself: every agent that holds a position in this journal. */
  async cursors(n = 200) {
    try {
      const { data: e } = await Nt.get(`${this.base()}/cursors${Ht({ limit: n })}`);
      if (!e.success) throw new Error(e.error || "failed to list cursors");
      return e.cursors?.items || [];
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load agent positions."));
    }
  }
  /**
   * Work spans, journal-wide. A span begins at an identity's first write and
   * seals itself after inactivity, so this is what an agent actually did rather
   * than what it declared.
   */
  async spans(n = {}) {
    try {
      const e = Ht({
        state: n.state,
        agent_id: n.agentId,
        task_id: n.taskId,
        limit: n.limit ?? 200,
        after_activity_at: n.afterActivityAt,
        after_span_id: n.afterSpanId
      }), { data: o } = await Nt.get(`${this.base()}/spans${e}`);
      if (!o.success) throw new Error(o.error || "failed to list work spans");
      return o.spans;
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load work spans."));
    }
  }
  /** Server-bucketed activity, so a lane at scale is counted rather than folded. */
  async activity(n = {}) {
    try {
      const e = Ht({
        bucket: n.bucket || "hour",
        agent_id: n.agentId,
        since: n.since,
        limit: n.limit ?? 400,
        after_bucket_at: n.afterBucketAt,
        after_agent_id: n.afterAgentId
      }), { data: o } = await Nt.get(`${this.base()}/activity${e}`);
      if (!o.success) throw new Error(o.error || "failed to read activity");
      return o.activity;
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load journal activity."));
    }
  }
  /** What the last on-demand assembly of this map did. */
  async assembly(n) {
    try {
      const { data: e } = await Nt.get(`${this.base()}/graphs/${encodeURIComponent(n)}/assemble`);
      return e.success && e.assembly || null;
    } catch {
      return null;
    }
  }
  /** Requests one assembly pass; a pass already under way is the answer. */
  async assemble(n) {
    try {
      const { data: e } = await Nt.post(`${this.base()}/graphs/${encodeURIComponent(n)}/assemble`, {});
      if (!e.success) throw new Error(e.error || "failed to start the assembly");
      return e.assembly;
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t recompute this map."));
    }
  }
  async health() {
    try {
      const { data: n } = await Nt.get(`${this.base()}/health`);
      return n.success ? n.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
function yd() {
  return {
    nodes: [],
    edges: [],
    nodeIndex: /* @__PURE__ */ new Map(),
    edgeIndex: /* @__PURE__ */ new Map(),
    nodeOffset: 0,
    edgeOffset: 0,
    totalNodes: 0,
    totalEdges: 0,
    chunks: 0,
    done: !1,
    cancelled: !1,
    error: ""
  };
}
function bd(t, n) {
  return t ? (n.revision || 0) >= (t.revision || 0) : !0;
}
function ro(t, n, e) {
  for (const o of e || []) {
    const s = n.get(o.id);
    s === void 0 ? (n.set(o.id, t.length), t.push(o)) : bd(t[s], o) && (t[s] = o);
  }
}
function wd(t, n) {
  return ro(t.nodes, t.nodeIndex, n.nodes), ro(t.edges, t.edgeIndex, n.edges), t.nodeOffset += (n.nodes || []).length, t.edgeOffset += (n.edges || []).length, t.totalNodes = Math.max(t.totalNodes, Number(n.manifest?.node_count) || 0, t.nodes.length), t.totalEdges = Math.max(t.totalEdges, Number(n.manifest?.edge_count) || 0, t.edges.length), t.chunks += 1, t;
}
function kd(t) {
  return !!t.omissions?.nodes?.continuation || !!t.omissions?.edges?.continuation;
}
function io(t) {
  const n = t.nodes.length + t.edges.length, e = Math.max(n, t.totalNodes + t.totalEdges);
  return { loaded: n, total: e, ratio: e ? Math.min(1, n / e) : 0 };
}
async function _d(t, n = {}) {
  const e = yd(), o = n.maxChunks ?? 400;
  try {
    for (; ; ) {
      if (n.cancellation?.cancelled) {
        e.cancelled = !0;
        break;
      }
      const s = await t({ nodeOffset: e.nodeOffset, edgeOffset: e.edgeOffset }), r = { nodes: e.nodeOffset, edges: e.edgeOffset };
      if (wd(e, s), n.onChunk?.(e), n.cancellation?.cancelled) {
        e.cancelled = !0;
        break;
      }
      if (!kd(s)) {
        e.done = !0;
        break;
      }
      if (e.nodeOffset === r.nodes && e.edgeOffset === r.edges) {
        e.done = !0;
        break;
      }
      if (e.chunks >= o) {
        e.done = !0;
        break;
      }
    }
  } catch (s) {
    e.error = s instanceof Error ? s.message : "Loading the whole graph failed.";
  }
  return e;
}
const xd = ["now", "outline", "graph", "lanes", "recall", "changes"], ao = {
  n: "now",
  o: "outline",
  g: "graph",
  t: "lanes",
  r: "recall",
  c: "changes"
}, Co = { kind: "journal", id: "", label: "Journal" };
function $d(t, n) {
  return t.length === n.length && t.every((e, o) => e.kind === n[o].kind && e.id === n[o].id);
}
function jd(t, n) {
  return t.lens === n.lens && $d(t.focus, n.focus);
}
function lo(t) {
  return t.map((n) => `${n.kind}:${n.id}`).join("/");
}
function Md(t) {
  return encodeURIComponent(t);
}
function Ad(t) {
  const n = t.focus.filter((e) => e.kind !== "journal").map((e) => `${e.kind}:${Md(e.id)}`).join("/");
  return n ? `${t.lens}/${n}` : t.lens;
}
const Id = /* @__PURE__ */ new Set(["journal", "graph", "branch", "node"]);
function Sd(t) {
  const n = "".split("/").filter(Boolean), e = xd.includes(n[0]) ? n[0] : "now", o = [Co];
  let s = "";
  for (const r of n.slice(1)) {
    const u = r.indexOf(":");
    if (u < 0) continue;
    const a = r.slice(0, u), d = decodeURIComponent(r.slice(u + 1));
    !Id.has(a) || a === "journal" || !d || (a === "graph" && (s = d), o.push({ kind: a, id: d, label: d, graphId: a === "graph" ? d : s }));
  }
  return { focus: o, lens: e };
}
function Cd(t) {
  for (let n = t.focus.length - 1; n >= 0; n--) {
    const e = t.focus[n];
    if (e.kind === "graph") return e.id;
    if (e.graphId) return e.graphId;
  }
  return "";
}
function Nd(t) {
  const n = t.focus[t.focus.length - 1];
  return n && (n.kind === "branch" || n.kind === "node") ? n.id : "";
}
const uo = 120, Ed = 240;
class Ld {
  history;
  at = 0;
  memory = /* @__PURE__ */ new Map();
  constructor(n = { focus: [Co], lens: "now" }) {
    this.history = [n];
  }
  get place() {
    return this.history[this.at];
  }
  get focus() {
    return this.place.focus;
  }
  get lens() {
    return this.place.lens;
  }
  get current() {
    return this.place.focus[this.place.focus.length - 1];
  }
  get depth() {
    return this.place.focus.length;
  }
  get canBack() {
    return this.at > 0;
  }
  get canForward() {
    return this.at < this.history.length - 1;
  }
  commit(n) {
    jd(n, this.place) || (this.history = [...this.history.slice(0, this.at + 1), n], this.history.length > uo && (this.history = this.history.slice(this.history.length - uo)), this.at = this.history.length - 1);
  }
  /** One step down: into a graph, a branch or a record. */
  descend(n) {
    const e = this.place.focus.findIndex((o) => o.kind === n.kind && o.id === n.id);
    if (e >= 0) {
      this.toIndex(e);
      return;
    }
    this.commit({ lens: this.place.lens, focus: [...this.place.focus, n] });
  }
  /** One step out. The journal itself is the floor. */
  ascend() {
    return this.place.focus.length <= 1 ? !1 : (this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, -1) }), !0);
  }
  /** Straight to one step of the breadcrumb. */
  toIndex(n) {
    const e = Math.max(0, Math.min(n, this.place.focus.length - 1));
    this.commit({ lens: this.place.lens, focus: this.place.focus.slice(0, e + 1) });
  }
  /** A lens projects the focus, so switching one keeps the reader in place. */
  setLens(n) {
    this.commit({ lens: n, focus: this.place.focus });
  }
  /** Replaces the whole place, as a restored route or a shared link does. */
  go(n) {
    this.commit(n);
  }
  /** Relabels the crumbs once the data that names them has loaded. */
  relabel(n) {
    this.history = this.history.map((e) => ({
      lens: e.lens,
      focus: e.focus.map((o) => {
        const s = n.get(`${o.kind}:${o.id}`);
        return s && s !== o.label ? { ...o, label: s } : o;
      })
    }));
  }
  back() {
    return this.canBack ? (this.at--, !0) : !1;
  }
  forward() {
    return this.canForward ? (this.at++, !0) : !1;
  }
  /** Every lens keeps its own arrangement of each focus. */
  rememberViewport(n) {
    const e = `${this.lens}@${lo(this.focus)}`, o = this.memory.get(e);
    for (this.memory.delete(e), this.memory.set(e, { ...o, ...n }); this.memory.size > Ed; ) {
      const s = this.memory.keys().next();
      if (s.done) break;
      this.memory.delete(s.value);
    }
  }
  viewport() {
    return this.memory.get(`${this.lens}@${lo(this.focus)}`);
  }
  route() {
    return Ad(this.place);
  }
}
const pn = {
  running: !1,
  loaded: 0,
  total: 0,
  chunks: 0,
  done: !1,
  cancelled: !1,
  error: ""
};
function Td(t) {
  const n = O(() => new md(t.value)), e = new Ld(Sd()), o = B(e.place), s = () => {
    o.value = { lens: e.lens, focus: [...e.focus] };
  }, r = B({}), u = B([]), a = we(null), d = we(null), l = we(null), c = B({ ...pn }), p = B({ status: "unknown" }), m = B([]), f = B([]), j = B({
    now: 0,
    leases: [],
    resumable: [],
    counts: { active: 0, write: 0, planning: 0, resumable: 0 },
    limit: 100,
    has_more: !1
  }), x = B({ open: 0, sealed: 0, total: 0 }), w = B([]), g = B([]), h = B(!1), A = B([]), S = B(3600), $ = B(/* @__PURE__ */ new Map()), T = B({}), C = B(""), W = B(!0), D = B(""), J = B(""), rt = B("hybrid"), E = B([]), I = B(!1), N = B([]), Z = B(!1), it = B(null), L = B(!1), nt = B(null), V = B(Math.floor(Date.now() / 1e3));
  let K, ft, ut, ct, pt = 0, vt = null;
  const mt = [], Lt = O(() => o.value.lens), at = O(() => o.value.focus), et = O(() => Cd(o.value)), dt = O(() => Nd(o.value)), Ut = O(() => u.value.find((_) => _.id === et.value) || a.value?.graph || null), gt = O(() => d.value || a.value?.nodes || []), _t = O(() => l.value || a.value?.edges || []), kt = O(() => new Map(gt.value.map((_) => [_.id, _]))), xt = O(() => kt.value.get(C.value) || null), Tt = O(() => Jo(gt.value, _t.value, m.value, et.value, V.value)), St = O(() => Vo(Tt.value)), ne = O(() => gt.value.filter(ke).length), pe = O(() => gt.value.filter((_) => !ke(_) && !tn(_)).length), ge = O(() => {
    const _ = /* @__PURE__ */ new Map();
    for (const F of f.value) {
      const Y = jo(F);
      if (!Y) continue;
      const lt = `task:${Y}`, ot = _.get(lt);
      ot ? (ot.sessions += 1, ot.lastActivityAt = Math.max(ot.lastActivityAt, F.last_activity_at)) : _.set(lt, { sessions: 1, lastActivityAt: F.last_activity_at });
    }
    return _;
  }), Kt = O(() => d.value ? { nodes: 0, edges: 0 } : {
    nodes: a.value?.collapsed_node_count || 0,
    edges: a.value?.collapsed_edge_count || 0
  }), Bt = O(() => {
    let _ = 0;
    for (const F of gt.value) {
      let Y = 1, lt = F.parent_id;
      const ot = /* @__PURE__ */ new Set([F.id]);
      for (; lt && kt.value.has(lt) && !ot.has(lt); )
        ot.add(lt), Y++, lt = kt.value.get(lt)?.parent_id;
      _ = Math.max(_, Y);
    }
    return _;
  });
  function je() {
    return `kickside.thread.${t.value}.projection.chestor.journal:graph_state`;
  }
  function Me() {
    return `kickside.thread.${t.value}.projection.chestor.journal:state`;
  }
  function Ae() {
    return p.value.status === "ok" ? "Healthy" : p.value.status === "degraded" ? "Degraded" : "Health unknown";
  }
  function Rt() {
    const _ = /* @__PURE__ */ new Map();
    for (const Y of u.value) _.set(`graph:${Y.id}`, Y.title);
    for (const Y of gt.value)
      _.set(`node:${Y.id}`, Y.label), _.set(`branch:${Y.id}`, Y.label);
    e.relabel(_);
    const F = new Map($.value);
    for (const Y of gt.value) F.set(Y.id, Y.label);
    $.value = F, s();
  }
  function Jt() {
    d.value = null, l.value = null, c.value = { ...pn }, vt && (vt.cancelled = !0), vt = null;
  }
  async function oe() {
    if (u.value = await n.value.graphs(), et.value || !u.value.length) return;
    const _ = u.value.find((F) => F.kind === "current-work") || u.value.find((F) => F.id === "map") || u.value[0];
    e.descend({ kind: "graph", id: _.id, label: _.title, graphId: _.id }), s();
  }
  function ve(_, F) {
    if (F) return F;
    const Y = e.viewport()?.selectedId;
    return Y && _.some((lt) => lt.id === Y) ? Y : _[0]?.id || "";
  }
  async function Xt(_ = !1) {
    if (!et.value) return;
    const F = ++pt, Y = o.value.focus[o.value.focus.length - 1];
    if (Y?.kind === "branch") {
      const ot = await n.value.subtree(et.value, Y.id);
      if (F !== pt) return;
      d.value = ot.nodes || [], l.value = ot.edges || [], c.value = {
        running: !1,
        loaded: (ot.nodes || []).length + (ot.edges || []).length,
        total: (ot.manifest?.node_count || 0) + (ot.manifest?.edge_count || 0),
        chunks: 1,
        done: ot.complete !== !1,
        cancelled: !1,
        error: ""
      }, _ || (C.value = ve(ot.nodes || [], "") || Y.id);
      return;
    }
    const lt = await n.value.window(et.value, Y?.kind === "node" ? Y.id : void 0);
    F === pt && (a.value = lt, (!_ || !lt.nodes.some((ot) => ot.id === C.value)) && (C.value = ve(lt.nodes, Y?.kind === "node" ? Y.id : "")));
  }
  async function se() {
    const [_, F] = await Promise.all([n.value.state(), n.value.tasks()]);
    w.value = F.tasks, h.value = F.bounded, g.value = _.events || [], T.value = {
      events: _.stats?.total || 0,
      lastSeq: _.stats?.last_seq || 0,
      lastTs: _.stats?.last_ts || 0,
      tasks: _.stats?.task_count || 0,
      openTasks: _.stats?.open_task_count || 0
    }, _.graphs?.length && (u.value = _.graphs), _.work_control && (j.value = _.work_control);
  }
  async function R() {
    const [_, F] = await Promise.all([
      n.value.cursors(),
      n.value.spans({ limit: 200 })
    ]);
    m.value = _, f.value = F.items || [], x.value = {
      open: F.counts?.open || 0,
      sealed: F.counts?.sealed || 0,
      total: F.counts?.total || 0
    };
  }
  async function M() {
    const _ = t.value, F = n.value, Y = async (Ot) => {
      let Dt = await F.activity({ bucket: Ot, limit: 2e3 });
      const Ye = [...Dt.buckets || []];
      for (let Cn = 0; Dt.has_more && Cn < 20; Cn++) {
        const ln = Dt.next_cursor || {};
        if (ln.after_bucket_at === void 0) break;
        Dt = await F.activity({ bucket: Ot, limit: 2e3, afterBucketAt: ln.after_bucket_at, afterAgentId: ln.after_agent_id }), Ye.push(...Dt.buckets || []);
      }
      return { all: Ye, width: Dt.width_s, exhausted: !Dt.has_more };
    }, lt = await F.activity({ bucket: "hour", limit: 2e3 });
    if (_ !== t.value) return;
    if (!lt.has_more) {
      A.value = lt.buckets || [], S.value = lt.width_s || 3600;
      return;
    }
    const ot = await Y("day");
    _ === t.value && (A.value = ot.all, S.value = ot.width || 86400);
  }
  async function q() {
    if (!t.value) {
      D.value = "Journal entry id is required.", W.value = !1;
      return;
    }
    W.value = !0;
    try {
      await oe(), await Promise.all([
        Xt(),
        se(),
        R(),
        M(),
        n.value.health().then((_) => {
          p.value = _;
        }),
        ae()
      ]), Rt(), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Couldn’t load the Journal.";
    } finally {
      W.value = !1;
    }
  }
  async function ht() {
    const _ = et.value;
    if (!_ || c.value.running) return;
    const F = { cancelled: !1 };
    vt = F, c.value = { ...pn, running: !0 };
    const Y = await _d(
      (ot) => n.value.bundle(_, ot.nodeOffset, ot.edgeOffset),
      {
        cancellation: F,
        onChunk: (ot) => {
          const Ot = io(ot);
          d.value = ot.nodes, l.value = ot.edges, qe(d), qe(l), c.value = {
            running: !0,
            loaded: Ot.loaded,
            total: Ot.total,
            chunks: ot.chunks,
            done: !1,
            cancelled: !1,
            error: ""
          };
        }
      }
    );
    vt === F && (vt = null);
    const lt = io(Y);
    d.value = Y.nodes, l.value = Y.edges, qe(d), qe(l), c.value = {
      running: !1,
      loaded: lt.loaded,
      total: lt.total,
      chunks: Y.chunks,
      done: Y.done,
      cancelled: Y.cancelled,
      error: Y.error
    }, Rt();
  }
  function Ct() {
    vt && (vt.cancelled = !0);
  }
  async function Et(_) {
    if (_ === et.value) return;
    const F = u.value.find((Y) => Y.id === _);
    e.go({
      lens: e.lens === "now" ? "outline" : e.lens,
      focus: [o.value.focus[0], { kind: "graph", id: _, label: F?.title || _, graphId: _ }]
    }), s(), C.value = "", J.value = "", E.value = [], it.value = null, N.value = [], Jt(), a.value = null, W.value = !0;
    try {
      ae(), await Xt(), Rt(), me(), D.value = "";
    } catch (Y) {
      D.value = Y instanceof Error ? Y.message : "Couldn’t load graph.";
    } finally {
      W.value = !1;
    }
  }
  function re(_) {
    C.value = _;
  }
  function me() {
    r.value = { ...e.viewport() };
  }
  async function zt() {
    s(), Jt(), W.value = !0;
    try {
      await Xt(), Rt(), me(), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Couldn’t open this focus.";
    } finally {
      W.value = !1;
    }
  }
  async function Ie(_) {
    const F = kt.value.get(_);
    F && (e.descend({
      kind: F.child_count > 0 ? "branch" : "node",
      id: _,
      label: F.label,
      graphId: et.value
    }), C.value = _, await zt());
  }
  async function nn(_) {
    const F = o.value.focus.find((Y) => Y.kind === "graph");
    F && (e.go({
      lens: o.value.lens,
      focus: [o.value.focus[0], F, { kind: "node", id: _, label: $.value.get(_) || _, graphId: F.id }]
    }), C.value = _, await zt());
  }
  async function Be() {
    return e.ascend() ? (await zt(), !0) : !1;
  }
  async function Vt(_) {
    e.toIndex(_), await zt();
  }
  async function ze() {
    e.back() && await zt();
  }
  async function Se() {
    e.forward() && await zt();
  }
  function Ce(_) {
    e.setLens(_), s(), me(), _ === "recall" && he(() => nt.value?.focus()), _ === "changes" && Ee(), _ === "lanes" && !A.value.length && M();
  }
  async function Ne() {
    if (clearTimeout(K), !J.value.trim() || !et.value) {
      E.value = [];
      return;
    }
    I.value = !0;
    try {
      E.value = await n.value.search(et.value, J.value.trim(), rt.value), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Search failed.", E.value = [];
    } finally {
      I.value = !1;
    }
  }
  function on() {
    clearTimeout(K), K = setTimeout(Ne, 320);
  }
  async function sn(_) {
    C.value = _, kt.value.has(_) || await Ie(_);
  }
  async function Ee() {
    if (!(N.value.length || Z.value || !et.value)) {
      Z.value = !0;
      try {
        N.value = await n.value.timeline(et.value), D.value = "";
      } catch (_) {
        D.value = _ instanceof Error ? _.message : "Timeline failed.";
      } finally {
        Z.value = !1;
      }
    }
  }
  async function ie() {
    if (!(!t.value || W.value || c.value.running))
      try {
        await Promise.all([
          oe(),
          Xt(!0),
          se(),
          R(),
          M(),
          n.value.health().then((_) => {
            p.value = _;
          }),
          ae()
        ]), Rt();
      } catch {
      }
  }
  async function ae() {
    if (!et.value) return;
    const _ = await n.value.assembly(et.value);
    it.value = _, L.value = Ke(_);
  }
  function le() {
    clearTimeout(ct), ct = setTimeout(async () => {
      if (!t.value || !et.value) return;
      const _ = await n.value.assembly(et.value);
      if (it.value = _, Ke(_)) {
        le();
        return;
      }
      L.value = !1, await Xt(!0), await oe();
    }, 1200);
  }
  async function rn() {
    if (!(!et.value || L.value)) {
      L.value = !0;
      try {
        it.value = await n.value.assemble(et.value), D.value = "", le();
      } catch (_) {
        L.value = !1, D.value = _ instanceof Error ? _.message : "Couldn’t recompute this map.";
      }
    }
  }
  function an(_) {
    const F = kt.value.get(_);
    return F ? gt.value.filter((Y) => (Y.parent_id || "") === (F.parent_id || "")).sort((Y, lt) => Y.label.localeCompare(lt.label)) : [];
  }
  function Zt(_) {
    const F = C.value || gt.value[0]?.id || "", Y = kt.value.get(F);
    if (!Y) {
      C.value = gt.value[0]?.id || "";
      return;
    }
    if (_ === "out") {
      Y.parent_id && kt.value.has(Y.parent_id) && (C.value = Y.parent_id);
      return;
    }
    if (_ === "in") {
      const Dt = gt.value.find((Ye) => Ye.parent_id === Y.id);
      Dt && (C.value = Dt.id);
      return;
    }
    const lt = an(F), ot = lt.findIndex((Dt) => Dt.id === F), Ot = _ === "next" ? ot + 1 : ot - 1;
    Ot >= 0 && Ot < lt.length && (C.value = lt[Ot].id);
  }
  function ue(_) {
    const F = [...gt.value].sort((ot, Ot) => Ot.updated_at - ot.updated_at || ot.id.localeCompare(Ot.id));
    if (!F.length) return;
    const Y = F.findIndex((ot) => ot.id === C.value), lt = Y < 0 ? 0 : Math.max(0, Math.min(F.length - 1, Y + _));
    C.value = F[lt].id;
  }
  function st(_) {
    const F = _.target;
    if (F && ["INPUT", "TEXTAREA"].includes(F.tagName)) {
      _.key === "Escape" && F.blur();
      return;
    }
    if (_.key === "/") {
      _.preventDefault(), Ce("recall");
      return;
    }
    if (_.key === "Escape") {
      Be();
      return;
    }
    if (_.key === "Enter" && C.value) {
      Ie(C.value);
      return;
    }
    if (_.altKey && _.key === "ArrowLeft") {
      _.preventDefault(), ze();
      return;
    }
    if (_.altKey && _.key === "ArrowRight") {
      _.preventDefault(), Se();
      return;
    }
    if (_.key === "[") {
      _.preventDefault(), ue(-1);
      return;
    }
    if (_.key === "]") {
      _.preventDefault(), ue(1);
      return;
    }
    if (o.value.lens !== "outline") {
      if (_.key === "ArrowLeft") {
        _.preventDefault(), Zt("prev");
        return;
      }
      if (_.key === "ArrowRight") {
        _.preventDefault(), Zt("next");
        return;
      }
      if (_.key === "ArrowUp") {
        _.preventDefault(), Zt("out");
        return;
      }
      if (_.key === "ArrowDown") {
        _.preventDefault(), Zt("in");
        return;
      }
    }
    !_.metaKey && !_.ctrlKey && !_.altKey && ao[_.key] && (_.preventDefault(), Ce(ao[_.key]));
  }
  function P(_) {
    e.rememberViewport(_), r.value = { ...r.value, ..._ };
  }
  return yt(J, on), yt(rt, () => {
    J.value.trim() && Ne();
  }), yt(t, () => {
    q();
  }), yt(C, (_) => {
    _ && P({ selectedId: _ });
  }), Qe(() => {
    mt.push(Nn(je(), () => {
      ie();
    })), mt.push(Nn(Me(), () => {
      ie();
    })), ut = setInterval(ie, 15e3), ft = setInterval(() => {
      V.value = Math.floor(Date.now() / 1e3);
    }, 3e4), window.addEventListener("keydown", st);
  }), Fe(() => {
    clearTimeout(K), clearTimeout(ct), ut && clearInterval(ut), ft && clearInterval(ft);
    for (const _ of mt) _();
    window.removeEventListener("keydown", st), Ct();
  }), {
    navigation: e,
    place: o,
    lens: Lt,
    focus: at,
    graphId: et,
    focusRecord: dt,
    graphs: u,
    graphWindow: a,
    health: p,
    cursors: m,
    spans: f,
    spanCounts: x,
    workControl: j,
    tasks: w,
    taskHasMore: h,
    events: g,
    buckets: A,
    bucketWidthS: S,
    stats: T,
    selectedId: C,
    loading: W,
    error: D,
    query: J,
    searchMode: rt,
    searchResults: E,
    searchLoading: I,
    timeline: N,
    timelineLoading: Z,
    searchInput: nt,
    clock: V,
    activeGraph: Ut,
    nodes: gt,
    edges: _t,
    nodeById: kt,
    selectedNode: xt,
    presence: Tt,
    touchedIds: St,
    foldedCount: ne,
    activeCount: pe,
    maxDepth: Bt,
    outsideWindow: Kt,
    wholeLoad: c,
    recordActivity: ge,
    assembly: it,
    assembling: L,
    recomputeMap: rn,
    viewport: r,
    rememberViewport: P,
    healthLabel: Ae,
    loadAll: q,
    refresh: ie,
    selectGraph: Et,
    selectNode: re,
    descend: Ie,
    ascend: Be,
    toCrumb: Vt,
    back: ze,
    forward: Se,
    changeLens: Ce,
    runSearch: Ne,
    openSearchResult: sn,
    openTimeline: Ee,
    jumpToRecord: nn,
    labelIndex: $,
    walk: Zt,
    stepFact: ue,
    loadWholeGraphNow: ht,
    cancelWholeGraph: Ct,
    canBack: O(() => (o.value, e.canBack)),
    canForward: O(() => (o.value, e.canForward))
  };
}
const Rd = {
  key: 0,
  class: "jr-boot"
}, Od = {
  key: 1,
  class: "jr-boot error"
}, Dd = { class: "jr-boot-mark" }, Pd = { class: "jr-toolbar" }, Wd = ["title"], Fd = { class: "jr-kind-tag" }, Bd = { class: "jr-numeric" }, zd = {
  key: 0,
  class: "jr-searchbox"
}, Yd = { class: "jr-searchbox-mode" }, qd = {
  class: "jr-lens-switch",
  "aria-label": "Journal lens"
}, Ud = ["aria-label", "title", "onClick"], Xd = ["disabled"], Hd = {
  key: 2,
  class: "jr-toolbar-spinner",
  "aria-label": "Refreshing"
}, Gd = {
  key: 0,
  class: "jr-error",
  role: "status"
}, Kd = ["aria-label"], Jd = { class: "jr-lens-meta" }, Vd = { class: "jr-lens-facts" }, Zd = { class: "jr-numeric" }, Qd = { class: "jr-numeric" }, th = { class: "jr-numeric" }, eh = { class: "jr-numeric" }, nh = {
  key: 1,
  class: "jr-nav-drawer",
  "aria-label": "Journal navigator"
}, oh = { class: "jr-drawer-head" }, sh = {
  key: 2,
  class: "jr-orbit-drawer",
  "aria-label": "Record orbit"
}, rh = /* @__PURE__ */ At({
  __name: "JournalApp",
  setup(t) {
    const n = Oo(), e = O(() => n.value?.entryId || ""), o = O(() => (n.value?.mode || "preview") === "preview"), s = O(() => !o.value && !n.value?.readOnly), r = B(!o.value), u = B(!1), a = B(!1), d = B(400), l = B(null), c = B(null);
    let p = null;
    const {
      lens: m,
      focus: f,
      graphId: j,
      graphs: x,
      health: w,
      cursors: g,
      spans: h,
      spanCounts: A,
      workControl: S,
      tasks: $,
      events: T,
      buckets: C,
      bucketWidthS: W,
      stats: D,
      taskHasMore: J,
      selectedId: rt,
      loading: E,
      error: I,
      query: N,
      searchMode: Z,
      searchResults: it,
      searchLoading: L,
      timeline: nt,
      searchInput: V,
      clock: K,
      activeGraph: ft,
      nodes: ut,
      edges: ct,
      nodeById: pt,
      selectedNode: vt,
      presence: mt,
      touchedIds: Lt,
      foldedCount: at,
      activeCount: et,
      maxDepth: dt,
      outsideWindow: Ut,
      wholeLoad: gt,
      recordActivity: _t,
      assembly: kt,
      assembling: xt,
      recomputeMap: Tt,
      healthLabel: St,
      loadAll: ne,
      selectGraph: pe,
      selectNode: ge,
      descend: Kt,
      ascend: Bt,
      toCrumb: je,
      back: Me,
      forward: Ae,
      changeLens: Rt,
      runSearch: Jt,
      openSearchResult: oe,
      canBack: ve,
      canForward: Xt,
      loadWholeGraphNow: se,
      cancelWholeGraph: R,
      jumpToRecord: M,
      labelIndex: q,
      viewport: ht,
      rememberViewport: Ct
    } = Td(e);
    function Et() {
      s.value && Tt();
    }
    Do(ne);
    const re = O(() => String(ft.value?.kind || "graph").replace(/[-_]+/g, " ")), me = O(() => ({
      loaded: $.value.length,
      total: D.value.tasks || $.value.length,
      hasMore: J.value || (D.value.tasks || 0) > $.value.length
    })), zt = {
      now: "Now",
      outline: "Outline",
      graph: "Graph",
      lanes: "Lanes",
      recall: "Recall",
      changes: "Changes"
    }, Ie = {
      now: "tabler:bolt",
      outline: "tabler:list-tree",
      graph: "tabler:topology-star-3",
      lanes: "tabler:timeline",
      recall: "tabler:search",
      changes: "tabler:history"
    }, nn = {
      now: "Now (n)",
      outline: "Outline (o)",
      graph: "Graph (g)",
      lanes: "Lanes (t)",
      recall: "Recall (/)",
      changes: "Changes (c)"
    }, Be = ["now", "outline", "graph", "lanes", "recall", "changes"];
    function Vt(st) {
      ge(st), u.value = !0;
    }
    async function ze(st) {
      await pe(st);
    }
    function Se(st, P) {
      ge(st), c.value = {
        id: st,
        x: P.clientX,
        y: P.clientY
      };
    }
    async function Ce() {
      c.value = null, await he(), l.value?.focus();
    }
    function Ne() {
      c.value && Vt(c.value.id), c.value = null;
    }
    async function on() {
      const st = c.value?.id;
      c.value = null, st && await Kt(st);
    }
    async function sn() {
      const st = c.value?.id;
      c.value = null, st && await navigator.clipboard.writeText(`${j.value}/${st}`);
    }
    async function Ee(st) {
      await oe(st), u.value = !0;
    }
    async function ie(st) {
      const P = us(st, g.value, h.value);
      if (P.kind === "node") {
        if (P.graphId && P.graphId !== j.value && await pe(P.graphId), pt.value.has(P.nodeId)) {
          Vt(P.nodeId);
          return;
        }
        await M(P.nodeId);
        return;
      }
      P.kind === "task" && le(P.taskId) || Rt("lanes");
    }
    function ae(st) {
      ie({ agentId: st, cursorId: st });
    }
    function le(st) {
      const P = ut.value.find((_) => _.id === st || _.id === `task:${st}`);
      return P ? (Rt("outline"), Vt(P.id), !0) : !1;
    }
    function rn(st) {
      const P = Na(h.value, st);
      P && (P.taskId && le(P.taskId) || P.agentId && ae(P.agentId));
    }
    function an(st) {
      p = { x: st.clientX, width: d.value }, window.addEventListener("pointermove", Zt), window.addEventListener("pointerup", ue, { once: !0 });
    }
    function Zt(st) {
      p && (d.value = Math.max(320, Math.min(640, p.width + p.x - st.clientX)));
    }
    function ue() {
      p = null, window.removeEventListener("pointermove", Zt), window.removeEventListener("pointerup", ue);
    }
    return Fe(ue), yt(m, (st) => {
      st !== "now" && (a.value = !1);
    }), (st, P) => (b(), k("main", {
      ref_key: "rootEl",
      ref: l,
      tabindex: "-1",
      class: tt(["jr-app", { preview: o.value, "nav-open": r.value, "orbit-open": u.value }]),
      style: bt({ "--jr-orbit-width": `${d.value}px` })
    }, [
      y(E) && !y(ut).length && !y($).length ? (b(), k("div", Rd, [...P[10] || (P[10] = [
        i("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        i("h2", null, "Opening the journal", -1),
        i("p", null, "Loading your journal entries.", -1)
      ])])) : y(I) && !y(ut).length && !y($).length ? (b(), k("div", Od, [
        i("span", Dd, [
          z(y(G), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        P[12] || (P[12] = i("h2", null, "Journal is unavailable", -1)),
        i("p", null, v(y(I)), 1),
        i("button", {
          onClick: P[0] || (P[0] = //@ts-ignore
          (..._) => y(ne) && y(ne)(..._))
        }, [
          z(y(G), {
            icon: "tabler:refresh",
            "aria-hidden": "true"
          }),
          P[11] || (P[11] = H(" Try again", -1))
        ])
      ])) : (b(), k(U, { key: 2 }, [
        i("header", Pd, [
          i("button", {
            class: tt(["jr-nav-toggle", { active: r.value }]),
            "aria-label": "Toggle the journal navigator",
            title: "Graphs and agents",
            onClick: P[1] || (P[1] = (_) => r.value = !r.value)
          }, [
            z(y(G), {
              icon: r.value ? "tabler:layout-sidebar-left-collapse" : "tabler:layout-sidebar-left-expand",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ], 2),
          i("div", {
            class: "jr-identity",
            title: y(ft)?.description || y(ft)?.title
          }, [
            i("h1", null, v(y(ft)?.title || "Journal"), 1),
            i("p", null, [
              i("span", Fd, v(re.value), 1),
              i("span", {
                class: tt(["jr-health", y(w).status])
              }, v(y(St)()), 3),
              i("span", Bd, v((y(D).events || 0).toLocaleString()) + " facts", 1)
            ])
          ], 8, Wd),
          y(m) === "recall" ? (b(), k("div", zd, [
            z(y(G), {
              icon: "tabler:search",
              "aria-hidden": "true"
            }),
            Lo(i("input", {
              ref_key: "searchInput",
              ref: V,
              "onUpdate:modelValue": P[2] || (P[2] = (_) => To(N) ? N.value = _ : null),
              placeholder: "Recall by text or meaning…",
              "aria-label": "Search this journal graph",
              onKeydown: P[3] || (P[3] = co(
                //@ts-ignore
                (..._) => y(Jt) && y(Jt)(..._),
                ["enter"]
              ))
            }, null, 544), [
              [Ro, y(N)]
            ]),
            i("span", Yd, v(y(Z)), 1)
          ])) : (b(), Yt(Bs, {
            key: 1,
            focus: y(f),
            "can-back": y(ve),
            "can-forward": y(Xt),
            onCrumb: y(je),
            onBack: y(Me),
            onForward: y(Ae),
            onUp: y(Bt)
          }, null, 8, ["focus", "can-back", "can-forward", "onCrumb", "onBack", "onForward", "onUp"])),
          i("nav", qd, [
            (b(), k(U, null, Q(Be, (_) => i("button", {
              key: _,
              class: tt({ active: y(m) === _ }),
              "aria-label": `${zt[_]} lens`,
              title: nn[_],
              onClick: (F) => y(Rt)(_)
            }, [
              z(y(G), {
                icon: Ie[_],
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              i("span", null, v(zt[_]), 1)
            ], 10, Ud)), 64))
          ]),
          i("button", {
            class: tt(["jr-detail-toggle", { active: u.value }]),
            disabled: !y(vt),
            "aria-label": "Toggle the record orbit",
            title: "Record orbit",
            onClick: P[4] || (P[4] = (_) => u.value = !u.value)
          }, [
            z(y(G), {
              icon: "tabler:layout-sidebar-right-expand",
              "aria-hidden": "true"
            })
          ], 10, Xd),
          y(E) ? (b(), k("span", Hd, [...P[13] || (P[13] = [
            i("span", { class: "jr-spinner" }, null, -1)
          ])])) : X("", !0)
        ]),
        y(I) ? (b(), k("div", Gd, [
          z(y(G), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          H(v(y(I)) + " ", 1),
          i("button", {
            "aria-label": "Dismiss",
            title: "Dismiss",
            onClick: P[5] || (P[5] = (_) => I.value = "")
          }, [
            z(y(G), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : X("", !0),
        i("section", {
          class: tt(["jr-view", { "is-graph": y(m) === "graph" }]),
          "aria-label": `${zt[y(m)]} lens`
        }, [
          a.value ? (b(), Yt(ed, {
            key: 0,
            tasks: y($),
            now: y(K),
            "task-bound": me.value,
            onTask: le,
            onClose: P[6] || (P[6] = (_) => a.value = !1)
          }, null, 8, ["tasks", "now", "task-bound"])) : y(m) === "now" ? (b(), Yt(ql, {
            key: 1,
            spans: y(h),
            "work-control": y(S),
            tasks: y($),
            events: y(T),
            now: y(K),
            "span-counts": y(A),
            "task-bound": me.value,
            onTask: le,
            onAgent: ae,
            onStale: P[7] || (P[7] = (_) => a.value = !0)
          }, null, 8, ["spans", "work-control", "tasks", "events", "now", "span-counts", "task-bound"])) : y(m) === "outline" ? (b(), k(U, { key: 2 }, [
            i("div", Jd, [
              P[21] || (P[21] = i("span", { class: "jr-lens-title" }, "Outline", -1)),
              i("span", Vd, [
                i("b", Zd, v(y(et)), 1),
                P[14] || (P[14] = H(" open ", -1)),
                P[15] || (P[15] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", Qd, v(y(at)), 1),
                P[16] || (P[16] = H(" folded ", -1)),
                P[17] || (P[17] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", th, v(y(dt)), 1),
                P[18] || (P[18] = H(" levels ", -1)),
                P[19] || (P[19] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", eh, v(y(ut).length.toLocaleString()), 1),
                P[20] || (P[20] = H(" records ", -1))
              ])
            ]),
            z(pc, {
              nodes: y(ut),
              edges: y(ct),
              presence: y(mt),
              "touched-ids": y(Lt),
              "selected-id": y(rt),
              viewport: y(ht),
              onSelect: Vt,
              onFocus: y(Kt),
              onMenu: Se,
              onViewport: y(Ct)
            }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "viewport", "onFocus", "onViewport"])
          ], 64)) : y(m) === "graph" ? (b(), Yt(ka, {
            key: 3,
            nodes: y(ut),
            edges: y(ct),
            presence: y(mt),
            "touched-ids": y(Lt),
            "selected-id": y(rt),
            loading: y(E),
            "omitted-nodes": y(Ut).nodes,
            "omitted-edges": y(Ut).edges,
            "read-only": !s.value,
            assembly: y(kt),
            assembling: y(xt),
            whole: y(gt),
            labels: y(q),
            activity: y(_t),
            now: y(K),
            viewport: y(ht),
            onSelect: Vt,
            onFocus: y(Kt),
            onPort: y(M),
            onMenu: Se,
            onRecompute: Et,
            onLoadAll: y(se),
            onCancelLoad: y(R),
            onViewport: y(Ct)
          }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "loading", "omitted-nodes", "omitted-edges", "read-only", "assembly", "assembling", "whole", "labels", "activity", "now", "viewport", "onFocus", "onPort", "onLoadAll", "onCancelLoad", "onViewport"])) : y(m) === "lanes" ? (b(), Yt(Ja, {
            key: 4,
            spans: y(h),
            buckets: y(C),
            "bucket-width-s": y(W),
            now: y(K),
            onAgent: ae,
            onSpan: rn
          }, null, 8, ["spans", "buckets", "bucket-width-s", "now"])) : y(m) === "recall" ? (b(), Yt(Cc, {
            key: 5,
            results: y(it),
            query: y(N),
            mode: y(Z),
            loading: y(L),
            onSelect: Ee
          }, null, 8, ["results", "query", "mode", "loading"])) : (b(), Yt(vd, {
            key: 6,
            items: y(nt),
            nodes: y(ut),
            onSelect: Ee
          }, null, 8, ["items", "nodes"]))
        ], 10, Kd),
        r.value ? (b(), k("aside", nh, [
          i("header", oh, [
            i("div", null, [
              P[22] || (P[22] = i("b", null, "Journal", -1)),
              i("span", null, v(y(x).length) + " graph" + v(y(x).length === 1 ? "" : "s") + " · " + v((y(D).tasks || 0).toLocaleString()) + " task" + v(y(D).tasks === 1 ? "" : "s"), 1)
            ]),
            i("button", {
              "aria-label": "Close the navigator",
              title: "Close",
              onClick: P[8] || (P[8] = (_) => r.value = !1)
            }, [
              z(y(G), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])
          ]),
          z(Qs, {
            graphs: y(x),
            "graph-id": y(j),
            now: y(K),
            onGraph: ze
          }, null, 8, ["graphs", "graph-id", "now"]),
          z(Ls, {
            cursors: y(g),
            spans: y(h),
            now: y(K),
            onAgent: ie
          }, null, 8, ["cursors", "spans", "now"])
        ])) : X("", !0),
        u.value ? (b(), k("aside", sh, [
          i("button", {
            class: "jr-resize-handle",
            "aria-label": "Resize the orbit panel",
            title: "Drag to resize",
            onPointerdown: Wt(an, ["prevent"])
          }, null, 32),
          z(Hu, {
            node: y(vt),
            nodes: y(ut),
            edges: y(ct),
            presence: y(mt),
            spans: y(h),
            events: y(T),
            "graph-id": y(j),
            now: y(K),
            onSelect: Vt,
            onFocus: y(Kt),
            onClose: P[9] || (P[9] = (_) => u.value = !1)
          }, null, 8, ["node", "nodes", "edges", "presence", "spans", "events", "graph-id", "now", "onFocus"])
        ])) : X("", !0),
        c.value ? (b(), Yt(_a, {
          key: 3,
          x: c.value.x,
          y: c.value.y,
          onClose: Ce,
          onDetails: Ne,
          onFocus: on,
          onCopy: sn
        }, null, 8, ["x", "y"])) : X("", !0)
      ], 64))
    ], 6));
  }
}), ch = {
  rootComponent: rh
};
export {
  ch as mountConfig
};
//# sourceMappingURL=lazy-mount-CeaEMlz-.js.map
