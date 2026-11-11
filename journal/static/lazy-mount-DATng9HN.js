import { defineComponent as $t, ref as B, computed as O, openBlock as w, createElementBlock as k, createElementVNode as i, toDisplayString as v, createCommentVNode as X, Fragment as U, renderList as et, normalizeClass as nt, createTextVNode as G, unref as y, createVNode as q, watch as yt, nextTick as ce, normalizeStyle as bt, shallowRef as be, onMounted as Ze, onBeforeUnmount as We, withModifiers as Wt, createBlock as qt, withKeys as co, renderSlot as No, withCtx as Eo, triggerRef as Ye, withDirectives as Lo, isRef as To, vModelText as Ro } from "vue";
import { Icon as K } from "@iconify/vue";
import { a as Oo, b as Do } from "./wc-runtime-KO3cNuNo.js";
import { api as It, on as Nn } from "@wippy-fe/proxy";
const Po = /* @__PURE__ */ new Set(["queued", "dispatched", "running"]);
function Ge(t) {
  return t ? t.running === !0 || Po.has(String(t.status || "")) : !1;
}
function wt(t, n) {
  if (!t) return "";
  const e = Math.max(0, Math.floor(n - t));
  return e < 60 ? "just now" : e < 3600 ? `${Math.floor(e / 60)}m ago` : e < 86400 ? `${Math.floor(e / 3600)}h ago` : `${Math.floor(e / 86400)}d ago`;
}
function Zt(t) {
  const n = Number(t);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}
function Wo(t, n) {
  if (!t || t.status === "never") return "Not assembled yet";
  if (Ge(t)) return "Assembling the map…";
  if (t.status === "failed") return "Last assembly failed";
  const e = [], o = Zt(t.edges_added), s = Zt(t.edges_removed), r = Zt(t.suggested_added);
  o && e.push(`+${o} structural`), s && e.push(`−${s} retired`), r && e.push(`+${r} suggested`), e.length || e.push("No change");
  const u = wt(t.finished_at || t.started_at, n);
  return u ? `${e.join(" · ")} · ${u}` : e.join(" · ");
}
function Fo(t) {
  if (!t || t.status === "never") return "Derive every relation the records already state.";
  if (Ge(t)) return "Replaying the journal and reconciling the map.";
  if (t.status === "failed") return t.error ? String(t.error) : "The last assembly did not finish.";
  const n = [`Replayed ${Zt(t.events_replayed)} records.`];
  return Zt(t.candidates_judged) && n.push(`Judged ${Zt(t.candidates_judged)} candidate pairs on ${t.model || "the configured class"}.`), Zt(t.suggested_removed) && n.push(`Replaced ${Zt(t.suggested_removed)} earlier suggestions.`), t.refine_error && n.push(`Suggestions unavailable: ${t.refine_error}`), n.join(" ");
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
function we(t) {
  const n = String(t.status || t.metadata?.outcome || "").toLowerCase();
  return ["folded", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(n);
}
function Qe(t) {
  const n = String(t.status || t.metadata?.outcome || "").toLowerCase();
  return ["done", "closed", "completed", "resolved", "retired", "failed", "abandoned", "inconclusive", "rejected", "superseded"].includes(n);
}
function De(t) {
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
function ye(t, n) {
  const e = t.metadata?.[n] ?? t.attrs?.[n];
  return typeof e == "string" ? e : "";
}
function Ho(t, n) {
  const e = new Map(t.map((s) => [s.id, s])), o = /* @__PURE__ */ new Map();
  for (const s of n)
    /^(positioned_at|focused_on|assigned_to)$/i.test(s.kind) && o.set(s.from, s.to);
  return t.filter(De).map((s) => {
    const r = o.get(s.id) || ye(s, "position"), u = r ? e.get(r) : void 0;
    return {
      id: s.id,
      label: s.label,
      initials: Gt(s.id, s.label).initials,
      purpose: ye(s, "purpose") || s.summary || "Recorded position",
      status: String(s.status || "active").toLowerCase(),
      next: ye(s, "next") || void 0,
      exitCondition: ye(s, "exit_condition") || void 0,
      positionId: u ? u.id : void 0,
      positionLabel: u ? u.label : r || void 0,
      updated_at: s.updated_at,
      source: "graph",
      stale: !1
    };
  });
}
function Go(t) {
  return [t.id, t.semantic_key, ye(t, "cursor_id"), ye(t, "agent_id")].map(gn).filter(Boolean);
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
    const c = De(l) ? u.get(l.id) : void 0;
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
    const l = [(a || "").trim(), d ? `cursor:${d.trim()}` : ""].filter(Boolean), c = ho(a, d) || `cursor:${o.size}`, p = [...new Set(l.map((x) => s.get(x)).filter(Boolean))], m = p[0] || c, h = o.get(m) || ns(m);
    o.set(m, h);
    for (const x of p.slice(1)) {
      const b = o.get(x);
      b && (os(h, b), o.delete(x));
      for (const [g, f] of s) f === x && s.set(g, m);
    }
    for (const x of l) s.set(x, m);
    h.agentId = h.agentId || (a || "").trim(), h.cursorId = h.cursorId || (d || "").trim(), h.id = h.agentId || (h.cursorId ? `cursor:${h.cursorId}` : m);
    const j = Gt(h.agentId || h.cursorId);
    return h.label = j.label, h.initials = j.initials, h;
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
}, Ms = ["aria-expanded"], As = { class: "jr-numeric" }, Is = ["title", "onClick"], Ss = { class: "jr-avatar" }, Cs = { class: "jr-agent-copy" }, Ns = { class: "jr-agent-purpose" }, Es = { class: "jr-numeric" }, Ls = /* @__PURE__ */ $t({
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
    return (l, c) => (w(), k("section", cs, [
      i("h3", ds, [
        c[1] || (c[1] = i("span", null, "Agents", -1)),
        i("em", hs, v(a.value), 1)
      ]),
      r.value.length ? X("", !0) : (w(), k("p", fs, "No agent has written to this journal yet.")),
      (w(), k(U, null, et(["now", "today"], (p) => (w(), k(U, { key: p }, [
        u.value[p].length ? (w(), k("div", {
          key: 0,
          class: nt(["jr-agent-tier", `tier-${p}`])
        }, [
          i("h4", ps, [
            G(v(d[p]) + " ", 1),
            i("span", gs, v(u.value[p].length), 1)
          ]),
          (w(!0), k(U, null, et(u.value[p], (m) => (w(), k("button", {
            key: m.id,
            class: nt(["jr-agent-card", `tier-${m.liveness}`, { working: m.working, active: m.id === t.selectedAgent }]),
            title: `${m.purpose} · last wrote ${y(wt)(m.lastActivityAt, t.now)}`,
            onClick: (h) => o("agent", m)
          }, [
            i("span", ms, v(m.initials), 1),
            i("span", ys, [
              i("b", null, v(m.label), 1),
              i("small", bs, v(m.purpose), 1),
              m.headline ? (w(), k("small", ws, v(m.headline), 1)) : X("", !0)
            ]),
            i("span", ks, [
              i("time", _s, v(y(wt)(m.lastActivityAt, t.now)), 1),
              m.working ? (w(), k("em", xs, "open span")) : (w(), k("em", $s, v(m.factCount) + " facts", 1))
            ])
          ], 10, vs))), 128))
        ], 2)) : X("", !0)
      ], 64))), 64)),
      u.value.older.length ? (w(), k("div", js, [
        i("button", {
          class: "jr-agent-fold",
          "aria-expanded": s.value,
          onClick: c[0] || (c[0] = (p) => s.value = !s.value)
        }, [
          q(y(K), {
            icon: s.value ? "tabler:chevron-down" : "tabler:chevron-right",
            "aria-hidden": "true"
          }, null, 8, ["icon"]),
          c[2] || (c[2] = i("span", null, "Earlier", -1)),
          i("em", As, v(u.value.older.length), 1)
        ], 8, Ms),
        s.value ? (w(!0), k(U, { key: 0 }, et(u.value.older, (p) => (w(), k("button", {
          key: p.id,
          class: nt(["jr-agent-card", "tier-older", { active: p.id === t.selectedAgent }]),
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
}, Fs = ["title", "aria-current", "onClick"], Bs = /* @__PURE__ */ $t({
  __name: "FocusPath",
  props: {
    focus: {},
    canBack: { type: Boolean },
    canForward: { type: Boolean }
  },
  emits: ["crumb", "back", "forward", "up"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = B(null);
    yt(() => e.focus.length, () => ce(() => {
      s.value && (s.value.scrollLeft = s.value.scrollWidth);
    }));
    const r = {
      journal: "tabler:notebook",
      graph: "tabler:topology-star-3",
      branch: "tabler:git-branch",
      node: "tabler:point"
    };
    return (u, a) => (w(), k("nav", Ts, [
      i("div", Rs, [
        i("button", {
          disabled: !t.canBack,
          "aria-label": "Back",
          title: "Back (Alt+←)",
          onClick: a[0] || (a[0] = (d) => o("back"))
        }, [
          q(y(K), {
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
          q(y(K), {
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
          q(y(K), {
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
        (w(!0), k(U, null, et(t.focus, (d, l) => (w(), k("li", {
          key: `${d.kind}:${d.id}`
        }, [
          l ? (w(), k("span", Ws, "/")) : X("", !0),
          i("button", {
            class: nt(["jr-crumb", `kind-${d.kind}`, { current: l === t.focus.length - 1 }]),
            title: d.label,
            "aria-current": l === t.focus.length - 1 ? "true" : void 0,
            onClick: (c) => o("crumb", l)
          }, [
            q(y(K), {
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
}, Qs = /* @__PURE__ */ $t({
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
        const h = m.parent_graph_id && d.has(m.parent_graph_id) ? m.parent_graph_id : "", j = a.get(h) || [];
        j.push(m), a.set(h, j);
      }
      const l = [], c = /* @__PURE__ */ new Set(), p = (m, h) => {
        for (const j of a.get(m) || [])
          c.has(j.id) || (c.add(j.id), l.push({ graph: j, depth: h }), p(j.id, h + 1));
      };
      p("", 0);
      for (const m of e.graphs) c.has(m.id) || l.push({ graph: m, depth: 0 });
      return l;
    });
    function u(a) {
      return ls(a.agent_count || 0, a.last_agent_activity_at || 0, e.now);
    }
    return (a, d) => (w(), k("section", zs, [
      i("h3", Ys, [
        d[0] || (d[0] = i("span", null, "Graphs", -1)),
        i("em", qs, v(t.graphs.length), 1)
      ]),
      i("div", Us, [
        (w(!0), k(U, null, et(r.value, (l) => (w(), k("button", {
          key: l.graph.id,
          class: nt(["jr-catalog-row", { active: l.graph.id === t.graphId, nested: l.depth > 0 }]),
          style: bt({ paddingInlineStart: `${9 + Math.min(l.depth, 5) * 11}px` }),
          onClick: (c) => o("graph", l.graph.id)
        }, [
          i("span", Hs, [
            q(y(K), {
              icon: s(l.graph.kind),
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ]),
          i("span", Gs, [
            i("b", null, v(l.graph.title), 1),
            u(l.graph) ? (w(), k("small", Ks, v(u(l.graph)), 1)) : (w(), k("small", {
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
      t.graphs.length ? X("", !0) : (w(), k("p", Zs, "No graphs have been configured on this journal yet."))
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
  var s, r = t._root, u = { data: o }, a = t._x0, d = t._y0, l = t._x1, c = t._y1, p, m, h, j, x, b, g, f;
  if (!r) return t._root = u, t;
  for (; r.length; )
    if ((x = n >= (p = (a + l) / 2)) ? a = p : l = p, (b = e >= (m = (d + c) / 2)) ? d = m : c = m, s = r, !(r = r[g = b << 1 | x])) return s[g] = u, t;
  if (h = +t._x.call(null, r.data), j = +t._y.call(null, r.data), n === h && e === j) return u.next = r, s ? s[g] = u : t._root = u, t;
  do
    s = s ? s[g] = new Array(4) : t._root = new Array(4), (x = n >= (p = (a + l) / 2)) ? a = p : l = p, (b = e >= (m = (d + c) / 2)) ? d = m : c = m;
  while ((g = b << 1 | x) === (f = (j >= m) << 1 | h >= p));
  return s[f] = r, s[g] = u, t;
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
function _t(t, n, e, o, s) {
  this.node = t, this.x0 = n, this.y0 = e, this.x1 = o, this.y1 = s;
}
function ar(t, n, e) {
  var o, s = this._x0, r = this._y0, u, a, d, l, c = this._x1, p = this._y1, m = [], h = this._root, j, x;
  for (h && m.push(new _t(h, s, r, c, p)), e == null ? e = 1 / 0 : (s = t - e, r = n - e, c = t + e, p = n + e, e *= e); j = m.pop(); )
    if (!(!(h = j.node) || (u = j.x0) > c || (a = j.y0) > p || (d = j.x1) < s || (l = j.y1) < r))
      if (h.length) {
        var b = (u + d) / 2, g = (a + l) / 2;
        m.push(
          new _t(h[3], b, g, d, l),
          new _t(h[2], u, g, b, l),
          new _t(h[1], b, a, d, g),
          new _t(h[0], u, a, b, g)
        ), (x = (n >= g) << 1 | t >= b) && (j = m[m.length - 1], m[m.length - 1] = m[m.length - 1 - x], m[m.length - 1 - x] = j);
      } else {
        var f = t - +this._x.call(null, h.data), I = n - +this._y.call(null, h.data), S = f * f + I * I;
        if (S < e) {
          var $ = Math.sqrt(e = S);
          s = t - $, r = n - $, c = t + $, p = n + $, o = h.data;
        }
      }
  return o;
}
function lr(t) {
  if (isNaN(c = +this._x.call(null, t)) || isNaN(p = +this._y.call(null, t))) return this;
  var n, e = this._root, o, s, r, u = this._x0, a = this._y0, d = this._x1, l = this._y1, c, p, m, h, j, x, b, g;
  if (!e) return this;
  if (e.length) for (; ; ) {
    if ((j = c >= (m = (u + d) / 2)) ? u = m : d = m, (x = p >= (h = (a + l) / 2)) ? a = h : l = h, n = e, !(e = e[b = x << 1 | j])) return this;
    if (!e.length) break;
    (n[b + 1 & 3] || n[b + 2 & 3] || n[b + 3 & 3]) && (o = n, g = b);
  }
  for (; e.data !== t; ) if (s = e, !(e = e.next)) return this;
  return (r = e.next) && delete e.next, s ? (r ? s.next = r : delete s.next, this) : n ? (r ? n[b] = r : delete n[b], (e = n[0] || n[1] || n[2] || n[3]) && e === (n[3] || n[2] || n[1] || n[0]) && !e.length && (o ? o[g] = e : this._root = e), this) : (this._root = r, this);
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
  for (o && n.push(new _t(o, this._x0, this._y0, this._x1, this._y1)); e = n.pop(); )
    if (!t(o = e.node, r = e.x0, u = e.y0, a = e.x1, d = e.y1) && o.length) {
      var l = (r + a) / 2, c = (u + d) / 2;
      (s = o[3]) && n.push(new _t(s, l, c, a, d)), (s = o[2]) && n.push(new _t(s, r, c, l, d)), (s = o[1]) && n.push(new _t(s, l, u, a, c)), (s = o[0]) && n.push(new _t(s, r, u, l, c));
    }
  return this;
}
function fr(t) {
  var n = [], e = [], o;
  for (this._root && n.push(new _t(this._root, this._x0, this._y0, this._x1, this._y1)); o = n.pop(); ) {
    var s = o.node;
    if (s.length) {
      var r, u = o.x0, a = o.y0, d = o.x1, l = o.y1, c = (u + d) / 2, p = (a + l) / 2;
      (r = s[0]) && n.push(new _t(r, u, a, c, p)), (r = s[1]) && n.push(new _t(r, c, a, d, p)), (r = s[2]) && n.push(new _t(r, u, p, c, l)), (r = s[3]) && n.push(new _t(r, c, p, d, l));
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
var jt = An.prototype = In.prototype;
jt.copy = function() {
  var t = new In(this._x, this._y, this._x0, this._y0, this._x1, this._y1), n = this._root, e, o;
  if (!n) return t;
  if (!n.length) return t._root = On(n), t;
  for (e = [{ source: n, target: t._root = new Array(4) }]; n = e.pop(); )
    for (var s = 0; s < 4; ++s)
      (o = n.source[s]) && (o.length ? e.push({ source: o, target: n.target[s] = new Array(4) }) : n.target[s] = On(o));
  return t;
};
jt.add = nr;
jt.addAll = or;
jt.cover = sr;
jt.data = rr;
jt.extent = ir;
jt.find = ar;
jt.remove = lr;
jt.removeAll = ur;
jt.root = cr;
jt.size = dr;
jt.visit = hr;
jt.visitAfter = fr;
jt.x = gr;
jt.y = mr;
function xt(t) {
  return function() {
    return t;
  };
}
function Qt(t) {
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
  typeof t != "function" && (t = xt(t == null ? 1 : +t));
  function u() {
    for (var l, c = n.length, p, m, h, j, x, b, g = 0; g < r; ++g)
      for (p = An(n, yr, br).visitAfter(a), l = 0; l < c; ++l)
        m = n[l], x = e[m.index], b = x * x, h = m.x + m.vx, j = m.y + m.vy, p.visit(f);
    function f(I, S, $, L, C) {
      var W = I.data, D = I.r, H = x + D;
      if (W) {
        if (W.index > m.index) {
          var st = h - W.x - W.vx, T = j - W.y - W.vy, A = st * st + T * T;
          A < H * H && (st === 0 && (st = Qt(o), A += st * st), T === 0 && (T = Qt(o), A += T * T), A = (H - (A = Math.sqrt(A))) / A * s, m.vx += (st *= A) * (H = (D *= D) / (b + D)), m.vy += (T *= A) * H, W.vx -= st * (H = 1 - H), W.vy -= T * H);
        }
        return;
      }
      return S > h + H || L < h - H || $ > j + H || C < j - H;
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
    return arguments.length ? (t = typeof l == "function" ? l : xt(+l), d(), u) : t;
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
  var n = kr, e = p, o, s = xt(30), r, u, a, d, l, c = 1;
  t == null && (t = []);
  function p(b) {
    return 1 / Math.min(a[b.source.index], a[b.target.index]);
  }
  function m(b) {
    for (var g = 0, f = t.length; g < c; ++g)
      for (var I = 0, S, $, L, C, W, D, H; I < f; ++I)
        S = t[I], $ = S.source, L = S.target, C = L.x + L.vx - $.x - $.vx || Qt(l), W = L.y + L.vy - $.y - $.vy || Qt(l), D = Math.sqrt(C * C + W * W), D = (D - r[I]) / D * b * o[I], C *= D, W *= D, L.vx -= C * (H = d[I]), L.vy -= W * H, $.vx += C * (H = 1 - H), $.vy += W * H;
  }
  function h() {
    if (u) {
      var b, g = u.length, f = t.length, I = new Map(u.map(($, L) => [n($, L, u), $])), S;
      for (b = 0, a = new Array(g); b < f; ++b)
        S = t[b], S.index = b, typeof S.source != "object" && (S.source = Dn(I, S.source)), typeof S.target != "object" && (S.target = Dn(I, S.target)), a[S.source.index] = (a[S.source.index] || 0) + 1, a[S.target.index] = (a[S.target.index] || 0) + 1;
      for (b = 0, d = new Array(f); b < f; ++b)
        S = t[b], d[b] = a[S.source.index] / (a[S.source.index] + a[S.target.index]);
      o = new Array(f), j(), r = new Array(f), x();
    }
  }
  function j() {
    if (u)
      for (var b = 0, g = t.length; b < g; ++b)
        o[b] = +e(t[b], b, t);
  }
  function x() {
    if (u)
      for (var b = 0, g = t.length; b < g; ++b)
        r[b] = +s(t[b], b, t);
  }
  return m.initialize = function(b, g) {
    u = b, l = g, h();
  }, m.links = function(b) {
    return arguments.length ? (t = b, h(), m) : t;
  }, m.id = function(b) {
    return arguments.length ? (n = b, m) : n;
  }, m.iterations = function(b) {
    return arguments.length ? (c = +b, m) : c;
  }, m.strength = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : xt(+b), j(), m) : e;
  }, m.distance = function(b) {
    return arguments.length ? (s = typeof b == "function" ? b : xt(+b), x(), m) : s;
  }, m;
}
var xr = { value: () => {
} };
function go() {
  for (var t = 0, n = arguments.length, e = {}, o; t < n; ++t) {
    if (!(o = arguments[t] + "") || o in e || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    e[o] = [];
  }
  return new Xe(e);
}
function Xe(t) {
  this._ = t;
}
function $r(t, n) {
  return t.trim().split(/^|\s+/).map(function(e) {
    var o = "", s = e.indexOf(".");
    if (s >= 0 && (o = e.slice(s + 1), e = e.slice(0, s)), e && !n.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    return { type: e, name: o };
  });
}
Xe.prototype = go.prototype = {
  constructor: Xe,
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
    return new Xe(t);
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
var ke = 0, Te = 0, Ee = 0, vo = 1e3, Ke, Re, Je = 0, de = 0, tn = 0, Pe = typeof performance == "object" && performance.now ? performance : Date, mo = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(t) {
  setTimeout(t, 17);
};
function yo() {
  return de || (mo(Mr), de = Pe.now() + tn);
}
function Mr() {
  de = 0;
}
function vn() {
  this._call = this._time = this._next = null;
}
vn.prototype = bo.prototype = {
  constructor: vn,
  restart: function(t, n, e) {
    if (typeof t != "function") throw new TypeError("callback is not a function");
    e = (e == null ? yo() : +e) + (n == null ? 0 : +n), !this._next && Re !== this && (Re ? Re._next = this : Ke = this, Re = this), this._call = t, this._time = e, mn();
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
  yo(), ++ke;
  for (var t = Ke, n; t; )
    (n = de - t._time) >= 0 && t._call.call(void 0, n), t = t._next;
  --ke;
}
function Wn() {
  de = (Je = Pe.now()) + tn, ke = Te = 0;
  try {
    Ar();
  } finally {
    ke = 0, Sr(), de = 0;
  }
}
function Ir() {
  var t = Pe.now(), n = t - Je;
  n > vo && (tn -= n, Je = t);
}
function Sr() {
  for (var t, n = Ke, e, o = 1 / 0; n; )
    n._call ? (o > n._time && (o = n._time), t = n, n = n._next) : (e = n._next, n._next = null, n = t ? t._next = e : Ke = e);
  Re = t, mn(o);
}
function mn(t) {
  if (!ke) {
    Te && (Te = clearTimeout(Te));
    var n = t - de;
    n > 24 ? (t < 1 / 0 && (Te = setTimeout(Wn, t - Pe.now() - tn)), Ee && (Ee = clearInterval(Ee))) : (Ee || (Je = Pe.now(), Ee = setInterval(Ir, vo)), ke = 1, mo(Wn));
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
    var b, g = t.length, f;
    x === void 0 && (x = 1);
    for (var I = 0; I < x; ++I)
      for (e += (r - e) * s, a.forEach(function(S) {
        S(e);
      }), b = 0; b < g; ++b)
        f = t[b], f.fx == null ? f.x += f.vx *= u : (f.x = f.fx, f.vx = 0), f.fy == null ? f.y += f.vy *= u : (f.y = f.fy, f.vy = 0);
    return n;
  }
  function h() {
    for (var x = 0, b = t.length, g; x < b; ++x) {
      if (g = t[x], g.index = x, g.fx != null && (g.x = g.fx), g.fy != null && (g.y = g.fy), isNaN(g.x) || isNaN(g.y)) {
        var f = Rr * Math.sqrt(0.5 + x), I = x * Or;
        g.x = f * Math.cos(I), g.y = f * Math.sin(I);
      }
      (isNaN(g.vx) || isNaN(g.vy)) && (g.vx = g.vy = 0);
    }
  }
  function j(x) {
    return x.initialize && x.initialize(t, c), x;
  }
  return h(), n = {
    tick: m,
    restart: function() {
      return d.restart(p), n;
    },
    stop: function() {
      return d.stop(), n;
    },
    nodes: function(x) {
      return arguments.length ? (t = x, h(), a.forEach(j), n) : t;
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
    force: function(x, b) {
      return arguments.length > 1 ? (b == null ? a.delete(x) : a.set(x, j(b)), n) : a.get(x);
    },
    find: function(x, b, g) {
      var f = 0, I = t.length, S, $, L, C, W;
      for (g == null ? g = 1 / 0 : g *= g, f = 0; f < I; ++f)
        C = t[f], S = x - C.x, $ = b - C.y, L = S * S + $ * $, L < g && (W = C, g = L);
      return W;
    },
    on: function(x, b) {
      return arguments.length > 1 ? (l.on(x, b), n) : l.on(x);
    }
  };
}
function Pr() {
  var t, n, e, o, s = xt(-30), r, u = 1, a = 1 / 0, d = 0.81;
  function l(h) {
    var j, x = t.length, b = An(t, Lr, Tr).visitAfter(p);
    for (o = h, j = 0; j < x; ++j) n = t[j], b.visit(m);
  }
  function c() {
    if (t) {
      var h, j = t.length, x;
      for (r = new Array(j), h = 0; h < j; ++h) x = t[h], r[x.index] = +s(x, h, t);
    }
  }
  function p(h) {
    var j = 0, x, b, g = 0, f, I, S;
    if (h.length) {
      for (f = I = S = 0; S < 4; ++S)
        (x = h[S]) && (b = Math.abs(x.value)) && (j += x.value, g += b, f += b * x.x, I += b * x.y);
      h.x = f / g, h.y = I / g;
    } else {
      x = h, x.x = x.data.x, x.y = x.data.y;
      do
        j += r[x.data.index];
      while (x = x.next);
    }
    h.value = j;
  }
  function m(h, j, x, b) {
    if (!h.value) return !0;
    var g = h.x - n.x, f = h.y - n.y, I = b - j, S = g * g + f * f;
    if (I * I / d < S)
      return S < a && (g === 0 && (g = Qt(e), S += g * g), f === 0 && (f = Qt(e), S += f * f), S < u && (S = Math.sqrt(u * S)), n.vx += g * h.value * o / S, n.vy += f * h.value * o / S), !0;
    if (h.length || S >= a) return;
    (h.data !== n || h.next) && (g === 0 && (g = Qt(e), S += g * g), f === 0 && (f = Qt(e), S += f * f), S < u && (S = Math.sqrt(u * S)));
    do
      h.data !== n && (I = r[h.data.index] * o / S, n.vx += g * I, n.vy += f * I);
    while (h = h.next);
  }
  return l.initialize = function(h, j) {
    t = h, e = j, c();
  }, l.strength = function(h) {
    return arguments.length ? (s = typeof h == "function" ? h : xt(+h), c(), l) : s;
  }, l.distanceMin = function(h) {
    return arguments.length ? (u = h * h, l) : Math.sqrt(u);
  }, l.distanceMax = function(h) {
    return arguments.length ? (a = h * h, l) : Math.sqrt(a);
  }, l.theta = function(h) {
    return arguments.length ? (d = h * h, l) : Math.sqrt(d);
  }, l;
}
function Wr(t) {
  var n = xt(0.1), e, o, s;
  typeof t != "function" && (t = xt(t == null ? 0 : +t));
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
    return arguments.length ? (n = typeof a == "function" ? a : xt(+a), u(), r) : n;
  }, r.x = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : xt(+a), u(), r) : t;
  }, r;
}
function Fr(t) {
  var n = xt(0.1), e, o, s;
  typeof t != "function" && (t = xt(t == null ? 0 : +t));
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
    return arguments.length ? (n = typeof a == "function" ? a : xt(+a), u(), r) : n;
  }, r.y = function(a) {
    return arguments.length ? (t = typeof a == "function" ? a : xt(+a), u(), r) : t;
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
function kt(t) {
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
function xe(t) {
  return zr[kt(t)];
}
function Oe(t, n) {
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
function le(t) {
  return Yr[String(t || "").toLowerCase()] || "support";
}
function Sn(t) {
  return le(t.kind) === "presence";
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
function He(t, n = 9) {
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
    r && He(d) > n && s.length < e - 1 ? (s.push(r), r = a) : r = d;
  }
  s.push(r);
  const u = s.length - 1;
  if (He(s[u]) > n) {
    let a = s[u];
    for (; a.length > 1 && He(`${a}…`) > n; ) a = a.slice(0, -1);
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
  const o = kt(t.kind), s = Kr(n, o), r = Gr(t.label, e ? 132 : 112, e ? 2 : 1), u = Math.max(...r.map((a) => He(a)));
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
  const d = t, l = !!a?.unpin, c = _o(n), p = new Map(d.map((E) => [E.id, Jr(E, c.get(E.id) || 0, s.has(E.id))]));
  let m = 0;
  if (r?.size) for (const E of d)
    r.has(E.id) && m++;
  const h = m > 0 && (d.length - m) / d.length > Zr, j = d.map((E, tt) => {
    const J = p.get(E.id), V = u?.get(E.id), ht = l ? void 0 : kn(E), [ut, ct] = V ? [V.px, V.py] : ti(E, tt, e, o, r, l), pt = Math.max(J.halfWidth, Math.min(e - J.halfWidth, ut)), gt = Math.max(J.top, Math.min(o - J.bottom, ct)), vt = !h && r?.has(E.id);
    return {
      id: E.id,
      record: E,
      box: J,
      x: pt,
      y: gt,
      vx: 0,
      vy: 0,
      // `pinned` protects semantic content from automatic replacement. Only an
      // explicit layout.position-set or a reader's drag owns a screen coordinate.
      fx: ht || V || vt ? pt : null,
      fy: ht || V || vt ? gt : null
    };
  }), x = new Set(j.map((E) => E.id)), b = new Map(d.map((E) => [E.id, E])), g = (E) => {
    let tt = E;
    const J = /* @__PURE__ */ new Set([tt.id]);
    for (; tt.parent_id && b.has(tt.parent_id) && !J.has(tt.parent_id); ) {
      const V = b.get(tt.parent_id);
      if (!V.parent_id || !b.has(V.parent_id)) return tt.id;
      J.add(V.id), tt = V;
    }
    return tt.id;
  }, f = n.filter((E) => !Sn(E) && x.has(E.from) && x.has(E.to)).map((E) => ({ source: E.from, target: E.to })), I = yn([...x].sort().join("|") + f.length), S = /* @__PURE__ */ new Map(), $ = [...new Set(d.map((E) => g(E)))].sort();
  $.forEach((E, tt) => {
    const J = tt / $.length * Math.PI * 2 + I % 360 / 180 * Math.PI;
    S.set(E, [
      e / 2 + Math.cos(J) * e * 0.3,
      o / 2 + Math.sin(J) * o * 0.28
    ]);
  });
  const L = (E, tt) => {
    const J = S.get(g(E));
    return J ? tt === "x" ? J[0] : J[1] : tt === "x" ? e / 2 : o / 2;
  }, C = !h && m > 0, W = d.length > wn, D = (E) => W ? E.radius + 6 : Vr(E) * 0.92, H = Dr(j).randomSource(Ur(I)).alpha(C ? 0.45 : 1).alphaDecay(0.035).velocityDecay(0.42).force("link", _r(f).id((E) => E.id).distance(72).strength(0.24)).force("charge", Pr().strength(-108).distanceMin(16).distanceMax(300)).force("collision", wr().radius((E) => D(E.box)).strength(1).iterations(3)).force("x", Wr((E) => E.record.parent_id ? L(E.record, "x") : e / 2).strength((E) => E.record.parent_id ? 0.34 : 0.2)).force("y", Fr((E) => E.record.parent_id ? L(E.record, "y") : o / 2).strength((E) => E.record.parent_id ? 0.34 : 0.2)).force("center", er(e / 2, o / 2).strength(0.04)).stop(), st = j.length > 2e3 ? 0.35 : j.length > 600 ? 0.6 : 1, T = Math.max(40, Math.round((C ? 90 : 260) * st));
  for (let E = 0; E < T; E++) H.tick();
  H.stop();
  const A = j.map((E) => ({
    ...E.record,
    px: Math.max(E.box.halfWidth, Math.min(e - E.box.halfWidth, Number(E.x) || e / 2)),
    py: Math.max(E.box.top, Math.min(o - E.box.bottom, Number(E.y) || o / 2)),
    vx: Number(E.vx) || 0,
    vy: Number(E.vy) || 0,
    family: kt(E.record.kind),
    color: xe(E.record.kind),
    degree: c.get(E.id) || 0,
    box: E.box,
    held: !!u?.get(E.id)
  })), N = (E) => E.box;
  if (A.length > 1 && !C && (l || !A.some((E) => kn(E))) && !u?.size) {
    const E = (tt) => {
      const J = tt === "x" ? e : o, V = (ot) => tt === "x" ? N(ot).halfWidth : N(ot).top, ht = (ot) => tt === "x" ? N(ot).halfWidth : N(ot).bottom, ut = (ot) => tt === "x" ? ot.px : ot.py, [ct, pt] = Qr(A, (ot) => [ut(ot) - V(ot), ut(ot) + ht(ot)]), gt = Math.max(1, pt - ct), vt = Math.min(4, Math.max(1, J * 0.88 / gt));
      if (vt <= 1.025) return;
      const Ft = (ct + pt) / 2;
      for (const ot of A) {
        const Z = J / 2 + (ut(ot) - Ft) * vt;
        tt === "x" ? ot.px = Math.max(V(ot), Math.min(J - ht(ot), Z)) : ot.py = Math.max(V(ot), Math.min(J - ht(ot), Z));
      }
    };
    E("x"), E("y");
  }
  const Q = A.length > wn ? 0 : A.length > 70 ? 64 : 220, at = (E, tt, J) => {
    const V = N(E), ht = tt === "x" ? E.px : E.py, ut = tt === "x" ? V.halfWidth : V.top, ct = tt === "x" ? e - V.halfWidth : o - V.bottom, pt = Math.max(ut, Math.min(Math.max(ut, ct), ht + J));
    return tt === "x" ? E.px = pt : E.py = pt, pt - ht;
  };
  for (let E = 0; E < Q; E++) {
    let tt = !1;
    for (let J = 0; J < A.length; J++) {
      const V = A[J], ht = N(V);
      for (let ut = J + 1; ut < A.length; ut++) {
        const ct = A[ut], pt = N(ct), gt = ct.px - V.px, vt = ct.py - V.py, Ft = ht.halfWidth + pt.halfWidth, ot = vt >= 0 ? zn(ht, pt) : zn(pt, ht), Z = Ft + 4 - Math.abs(gt), Xt = ot + 3 - Math.abs(vt);
        if (Z <= 0 || Xt <= 0) continue;
        tt = !0;
        const Lt = Z / Ft < Xt / ot ? "x" : "y", ft = (Mt) => {
          const mt = Mt === "x" ? gt : vt, St = mt === 0 ? yn(Mt === "x" ? `${V.id}:${ct.id}` : `${ct.id}:${V.id}`) % 2 ? 1 : -1 : Math.sign(mt), Tt = (Mt === "x" ? Z : Xt) + 0.3;
          let Ct = 0;
          return V.held || (Ct -= at(V, Mt, -St * (Tt / 2)) * St), ct.held || (Ct += at(ct, Mt, St * Math.max(0, Tt - Ct)) * St), !V.held && Ct + 0.01 < Tt && (Ct -= at(V, Mt, -St * (Tt - Ct)) * St), Ct > 0.01;
        };
        ft(Lt) || ft(Lt === "x" ? "y" : "x");
      }
    }
    if (!tt) break;
  }
  return A;
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
    for (const I of c) {
      const S = I.box.radius + 5;
      for (let $ = 0; $ < 8; $++) {
        const L = $ / 8 * Math.PI * 2;
        m.push([I.px + Math.cos(L) * S, I.py + Math.sin(L) * S * 1.25]);
      }
    }
    const h = ni(m);
    if (h.length < 3) continue;
    const j = h.reduce((I, S) => I + S[0], 0) / h.length, x = h.reduce((I, S) => I + S[1], 0) / h.length, b = h.map(([I, S]) => {
      const $ = I - j, L = S - x, C = Math.max(1, Math.hypot($, L));
      return [I + $ / C * o, S + L / C * o];
    });
    if (a && si(b) > a * 0.42) continue;
    const g = oi(b);
    if (!g) continue;
    const f = Math.min(...b.map((I) => I[1]));
    d.push({
      id: l,
      label: p?.label || l,
      family: p ? p.family : "note",
      path: g,
      size: c.length,
      labelX: j,
      labelY: f + 15
    });
  }
  return d.sort((l, c) => c.size - l.size || l.id.localeCompare(c.id));
}
const ii = ["viewBox"], ai = ["d"], _e = /* @__PURE__ */ $t({
  __name: "FamilyMark",
  props: {
    family: {},
    radius: { default: 7 },
    viewBox: { default: "-12 -12 24 24" },
    hollow: { type: Boolean }
  },
  setup(t) {
    const n = t, e = O(() => Oe(n.family, n.radius)), o = O(() => n.hollow ?? ko(n.family));
    return (s, r) => (w(), k("svg", {
      viewBox: t.viewBox,
      "aria-hidden": "true"
    }, [
      i("path", {
        d: e.value,
        class: nt({ hollow: o.value })
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
function Ve(t) {
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
  const u = Math.max(1, t.maxX - t.minX), a = Math.max(1, t.maxY - t.minY), d = { width: Math.max(1, s - e * 2), height: Math.max(1, r - e * 2) }, l = Ve(Math.min(o, Math.min(d.width / u, d.height / a))), c = (t.minX + t.maxX) / 2, p = (t.minY + t.maxY) / 2;
  return { zoom: l, x: s / 2 - c * l, y: r / 2 - p * l };
}
const mi = 11e3, yi = 2600;
function bi(t, n, e) {
  const o = Math.max(320, n.width), s = Math.max(240, n.height), r = o / s, u = t <= wn ? mi : yi, a = Math.max(o * s, Math.max(1, t) * u);
  return { width: Math.round(Math.sqrt(a * r)), height: Math.round(Math.sqrt(a / r)) };
}
function qn(t, n, e, o) {
  const s = Ve(t.zoom * n), r = s / t.zoom;
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
  const r = new Map(n.map((h) => [h.id, h])), u = new Array(t.ids.length);
  for (let h = 0; h < t.ids.length; h++) {
    const j = t.ids[h], x = r.get(j), b = h * _n, g = kt(x?.kind), f = t.geometry[b + 4];
    u[h] = {
      id: j,
      x: t.positions[h * 2],
      y: t.positions[h * 2 + 1],
      radius: t.geometry[b],
      halfWidth: t.geometry[b + 1],
      top: t.geometry[b + 2],
      bottom: t.geometry[b + 3],
      degree: f,
      family: g,
      lines: t.labels[h] || [],
      hollow: ko(g),
      folded: x ? we(x) : !1,
      settled: x ? Qe(x) : !1,
      rank: f + (x?.parent_id ? 0 : 3) + (x?.pinned ? 4 : 0),
      sessions: s.get(j)?.sessions || 0,
      lastWorkedAt: s.get(j)?.lastActivityAt || 0
    };
  }
  const a = t.index, d = [], l = [], c = /* @__PURE__ */ new Map();
  for (const h of e) {
    const j = a.get(h.from), x = a.get(h.to);
    if (j !== void 0 && x !== void 0) {
      if (j === x) continue;
      d.push({
        from: j,
        to: x,
        family: le(h.kind),
        suggested: qr(h),
        label: h.label || h.kind.replace(/_/g, " ")
      });
      continue;
    }
    const b = j ?? x;
    if (b === void 0) continue;
    const g = j === void 0 ? h.from : h.to, f = c.get(b) || 0;
    c.set(b, f + 1), l.push({
      at: b,
      targetId: g,
      targetLabel: o.get(g) || r.get(g)?.label || g,
      kind: h.kind.replace(/_/g, " "),
      outbound: x === void 0,
      angle: -Math.PI / 2 + f * (Math.PI / 5) * (f % 2 ? 1 : -1)
    });
  }
  const p = gi(u.map((h) => ({
    x: h.x,
    y: h.y + (h.bottom - h.top) / 2,
    halfWidth: h.halfWidth,
    halfHeight: (h.top + h.bottom) / 2
  }))), m = ri(
    u.map((h) => ({
      id: h.id,
      parent_id: r.get(h.id)?.parent_id,
      label: r.get(h.id)?.label || h.id,
      family: h.family,
      px: h.x,
      py: h.y,
      box: { radius: h.radius }
    })),
    t.width,
    t.height
  );
  return { nodes: u, edges: d, ports: l, regions: m, index: a, bounds: p, grid: Mi(u, p) };
}
function Le(t, n, e, o = 6) {
  const s = t.grid, r = Math.floor((n - s.minX) / s.cell), u = Math.floor((e - s.minY) / s.cell);
  let a = "", d = 1 / 0;
  for (let l = -1; l <= 1; l++)
    for (let c = -1; c <= 1; c++) {
      const p = r + c, m = u + l;
      if (!(p < 0 || m < 0 || p >= s.columns || m >= s.rows))
        for (const h of s.buckets.get(xo(s, p, m)) || []) {
          const j = t.nodes[h], x = Math.hypot(j.x - n, j.y - e);
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
  return n || (n = new Path2D(Oe(t, 1)), Kn.set(t, n)), n;
}
const Jn = /* @__PURE__ */ new Map();
function Vn(t) {
  const n = Jn.get(t);
  if (n) return n;
  const e = t.match(/-?\d*\.?\d+/g), o = e && e.length >= 3 ? [Number(e[0]), Number(e[1]), Number(e[2]), e.length > 3 ? Number(e[3]) : 1] : [128, 128, 128, 1];
  return Jn.set(t, o), o;
}
const qe = /* @__PURE__ */ new Map(), hn = 16, Ci = 4096;
function Bt(t, n, e) {
  const o = Math.max(0, Math.min(hn, Math.round(e * hn))), s = `${t}|${n}|${o}`, r = qe.get(s);
  if (r) return r;
  const u = o / hn, [a, d, l, c] = Vn(t);
  let p;
  if (n === "transparent")
    p = `rgba(${a}, ${d}, ${l}, ${(c * u).toFixed(3)})`;
  else {
    const [m, h, j, x] = Vn(n), b = (g, f) => Math.round(g * u + f * (1 - u));
    p = `rgba(${b(a, m)}, ${b(d, h)}, ${b(l, j)}, ${(c * u + x * (1 - u)).toFixed(3)})`;
  }
  return qe.size >= Ci && qe.clear(), qe.set(s, p), p;
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
    const f = [];
    t.save(), t.translate(e.x, e.y), t.scale(u, u);
    for (const I of g)
      t.fillStyle = Bt(s.family[I.family], "transparent", 0.055), t.fill(new Path2D(I.path)), c.territories++;
    t.restore(), t.textAlign = "center", t.textBaseline = "alphabetic";
    for (const I of g) {
      const S = a(I.labelX), $ = d(I.labelY);
      S < -160 || S > o.width + 160 || $ < 58 || $ > o.height + 40 || f.some(([L, C]) => Math.abs(L - S) < Hn * 3 && Math.abs(C - $) < Hn) || (f.push([S, $]), t.fillStyle = Bt(s.family[I.family], s.bg, 0.66), t.font = `800 ${r.detail === "envelope" ? 12 : 9.5}px Inter, ui-sans-serif, system-ui, sans-serif`, t.fillText(I.label.toUpperCase(), S, $), t.fillStyle = s.muted, t.font = "600 10px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(`${I.size.toLocaleString()} records`, S, $ + 14));
    }
  }
  if (r.detail === "envelope") {
    const g = Math.max(1.4, Math.min(3, u * 8)), f = /* @__PURE__ */ new Map();
    for (const I of l) {
      const S = f.get(n.nodes[I].family);
      S ? S.push(I) : f.set(n.nodes[I].family, [I]);
    }
    for (const [I, S] of f) {
      t.beginPath();
      for (const $ of S) {
        const L = n.nodes[$];
        t.moveTo(a(L.x) + g, d(L.y)), t.arc(a(L.x), d(L.y), g, 0, Math.PI * 2);
      }
      t.fillStyle = Bt(s.family[I], "transparent", 0.62), t.fill();
    }
    return c;
  }
  const m = ["structure", "support", "succession", "conflict"], h = r.hoveredId || r.selectedId, j = h ? n.index.get(h) : void 0;
  for (const g of m) {
    t.beginPath();
    let f = 0;
    for (const I of n.edges) {
      if (I.family !== g || I.suggested) continue;
      const S = n.nodes[I.from], $ = n.nodes[I.to], L = a(S.x), C = d(S.y), W = a($.x), D = d($.y);
      if (!(Math.max(L, W) < 0 || Math.min(L, W) > o.width) && !(Math.max(C, D) < 0 || Math.min(C, D) > o.height)) {
        if (t.moveTo(L, C), p.curves) {
          const H = (L + W) / 2 - (D - C) * 0.09, st = (C + D) / 2 + (W - L) * 0.09;
          t.quadraticCurveTo(H, st, W, D);
        } else
          t.lineTo(W, D);
        f++;
      }
    }
    f && (c.edges += f, t.strokeStyle = s.edge[g], t.lineWidth = g === "conflict" ? 1.4 : g === "structure" ? 0.9 : 1.2, t.globalAlpha = j === void 0 ? 1 : 0.24, t.setLineDash(g === "conflict" ? [5, 4] : g === "succession" ? [9, 4] : []), t.stroke(), t.setLineDash([]), t.globalAlpha = 1);
  }
  t.beginPath();
  let x = 0;
  for (const g of n.edges) {
    if (!g.suggested) continue;
    const f = n.nodes[g.from], I = n.nodes[g.to];
    t.moveTo(a(f.x), d(f.y)), t.lineTo(a(I.x), d(I.y)), x++;
  }
  if (x && (c.edges += x, t.strokeStyle = Bt(s.accent, "transparent", 0.34), t.lineWidth = 0.9, t.setLineDash([2, 4]), t.stroke(), t.setLineDash([])), j !== void 0) {
    t.beginPath();
    for (const g of n.edges) {
      if (g.from !== j && g.to !== j) continue;
      const f = n.nodes[g.from], I = n.nodes[g.to];
      t.moveTo(a(f.x), d(f.y)), t.lineTo(a(I.x), d(I.y));
    }
    t.strokeStyle = s.fg, t.globalAlpha = 0.55, t.lineWidth = 1.8, t.stroke(), t.globalAlpha = 1;
  }
  if (r.detail === "dot") {
    const g = /* @__PURE__ */ new Map();
    for (const f of l) {
      const I = g.get(n.nodes[f].family);
      I ? I.push(f) : g.set(n.nodes[f].family, [f]);
    }
    for (const [f, I] of g) {
      t.beginPath();
      for (const S of I) {
        const $ = n.nodes[S], L = Math.max(1.4, $.radius * u * 0.62);
        t.moveTo(a($.x) + L, d($.y)), t.arc(a($.x), d($.y), L, 0, Math.PI * 2);
      }
      t.fillStyle = s.family[f], t.globalAlpha = r.mutedFamily && r.mutedFamily !== f ? 0.16 : 0.9, t.fill(), t.globalAlpha = 1;
    }
  } else
    for (const g of l) {
      const f = n.nodes[g], I = r.mutedFamily ? r.mutedFamily !== f.family : !1, S = s.family[f.family], $ = Math.max(2, f.radius * u);
      t.save(), t.globalAlpha = I ? 0.18 : 1, t.translate(a(f.x), d(f.y)), t.scale($, $);
      const L = Si(f.family);
      if (f.hollow ? (t.fillStyle = Bt(S, s.bg, 0.16), t.fill(L), t.strokeStyle = S, t.lineWidth = 2.6 / $, t.stroke(L)) : (t.fillStyle = f.settled ? Bt(S, s.bg, 0.46) : S, t.fill(L), f.folded && (t.strokeStyle = S, t.lineWidth = 1.6 / $, t.setLineDash([3 / $, 2.4 / $]), t.stroke(L), t.setLineDash([]))), t.restore(), f.lastWorkedAt && r.now - f.lastWorkedAt < Xn) {
        const C = 1 - (r.now - f.lastWorkedAt) / Xn;
        t.beginPath(), t.arc(a(f.x), d(f.y), $ + 5, 0, Math.PI * 2), t.strokeStyle = Bt(s.accent, "transparent", 0.18 + C * 0.62), t.lineWidth = 1 + C * 2.2, t.stroke();
      }
      r.touched.has(f.id) && (t.beginPath(), t.arc(a(f.x), d(f.y), $ + 8, 0, Math.PI * 2), t.strokeStyle = Bt(s.accent, "transparent", 0.4), t.lineWidth = 1.2, t.stroke()), (f.id === r.selectedId || f.id === r.hoveredId) && (t.beginPath(), t.arc(a(f.x), d(f.y), $ + 11, 0, Math.PI * 2), t.strokeStyle = S, t.lineWidth = 1.6, t.setLineDash(f.id === r.selectedId ? [2.5, 3.5] : []), t.stroke(), t.setLineDash([]));
    }
  const b = Ni(n, l, r, u);
  if (b.size) {
    t.textAlign = "center", t.textBaseline = "alphabetic", t.fillStyle = s.fg;
    for (const g of b) {
      const f = n.nodes[g];
      if (r.mutedFamily && r.mutedFamily !== f.family) continue;
      const I = f.id === r.selectedId || f.id === r.hoveredId;
      t.font = `${I ? 720 : 560} 9px Inter, ui-sans-serif, system-ui, sans-serif`;
      const S = d(f.y) + f.radius * u + 11.5;
      for (let $ = 0; $ < f.lines.length; $++)
        t.fillText(f.lines[$], a(f.x), S + $ * bn), c.labels++;
    }
  }
  if (r.detail === "full") {
    t.textAlign = "center", t.fillStyle = s.muted, t.font = "650 8px Inter, ui-sans-serif, system-ui, sans-serif";
    for (const g of b) {
      const f = n.nodes[g];
      if (!f.sessions) continue;
      const I = wt(f.lastWorkedAt, r.now), S = d(f.y) + f.radius * u + 11.5 + f.lines.length * bn;
      t.fillText(`${f.sessions} session${f.sessions === 1 ? "" : "s"}${I ? ` · ${I}` : ""}`, a(f.x), S);
    }
  }
  if (p.labels && j !== void 0) {
    t.textAlign = "center", t.fillStyle = s.muted, t.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
    let g = 0;
    const f = /* @__PURE__ */ new Set();
    for (const I of n.edges) {
      if (g >= 5 || I.suggested || I.family === "structure" || I.from !== j && I.to !== j || f.has(I.label)) continue;
      f.add(I.label), g++;
      const S = n.nodes[I.from], $ = n.nodes[I.to];
      t.fillText(I.label, (a(S.x) + a($.x)) / 2, (d(S.y) + d($.y)) / 2 - 4);
    }
  }
  if (r.detail !== "dot" && n.ports.length) {
    t.textAlign = "left", t.textBaseline = "middle";
    for (const g of n.ports) {
      const f = n.nodes[g.at], I = $o(n, g), S = a(I.x), $ = d(I.y);
      if (S < -180 || S > o.width + 180 || $ < -40 || $ > o.height + 40 || (t.beginPath(), t.moveTo(a(f.x), d(f.y)), t.lineTo(S, $), t.strokeStyle = Bt(s.muted, "transparent", 0.4), t.lineWidth = 1, t.setLineDash([2, 3]), t.stroke(), t.setLineDash([]), t.beginPath(), t.arc(S, $, jn, 0, Math.PI * 2), t.fillStyle = s.bg, t.fill(), t.strokeStyle = s.muted, t.lineWidth = 1.4, t.stroke(), r.detail !== "full")) continue;
      t.fillStyle = s.muted, t.font = "600 8.5px Inter, ui-sans-serif, system-ui, sans-serif";
      const L = g.targetLabel.length > 26 ? `${g.targetLabel.slice(0, 25)}…` : g.targetLabel;
      t.fillText(`${g.outbound ? "→" : "←"} ${L}`, S + jn + 4, $);
    }
    t.textBaseline = "alphabetic";
  }
  for (const g of r.pins) {
    const f = n.index.get(g.nodeId);
    if (f === void 0) continue;
    const I = n.nodes[f], S = a(I.x) + I.radius * u + 12, $ = d(I.y) - 26;
    if (S < -120 || S > o.width + 120 || $ < -40 || $ > o.height + 40) continue;
    t.globalAlpha = g.stale ? 0.38 : 1, t.beginPath(), t.moveTo(a(I.x), d(I.y)), t.lineTo(S, $ + 9), t.strokeStyle = s.accent, t.lineWidth = 1, t.setLineDash([2, 2.5]), t.stroke(), t.setLineDash([]);
    const L = 26 + g.label.length * 4.6;
    t.beginPath(), t.roundRect(S, $ - 9, L, 18, 9), t.fillStyle = Bt(s.accent, s.bg, 0.14), t.fill(), t.strokeStyle = Bt(s.accent, "transparent", 0.4), t.lineWidth = 1, t.stroke(), t.beginPath(), t.arc(S + 9, $, 6.4, 0, Math.PI * 2), t.fillStyle = s.accent, t.fill(), t.textAlign = "center", t.fillStyle = s.bg, t.font = "850 6.6px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(g.initials, S + 9, $ + 2.3), t.textAlign = "left", t.fillStyle = s.accent, t.font = "700 8.2px Inter, ui-sans-serif, system-ui, sans-serif", t.fillText(g.label, S + 19, $ + 2.6), t.globalAlpha = 1;
  }
  return c;
}
const Ut = {
  anchor: "--jr-accent",
  rule: "--jr-rule",
  decision: "--jr-decision",
  evidence: "--jr-evidence",
  risk: "--jr-danger",
  open: "--jr-warn",
  agent: "--jr-accent-strong",
  note: "--jr-muted"
}, me = {
  structure: "--jr-muted",
  support: "--jr-success",
  conflict: "--jr-danger",
  succession: "--jr-decision",
  presence: "--jr-accent"
}, Vt = {
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
    ...Object.values(Vt),
    ...wo.map((t) => Ut[t]),
    Ut.agent,
    ...Object.values(me)
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
    bg: e(Vt.bg),
    fg: e(Vt.fg),
    muted: e(Vt.muted),
    faint: e(Vt.faint),
    border: e(Vt.border),
    accent: e(Vt.accent),
    panel: e(Vt.panel),
    family: {
      anchor: e(Ut.anchor),
      rule: e(Ut.rule),
      decision: e(Ut.decision),
      evidence: e(Ut.evidence),
      risk: e(Ut.risk),
      open: e(Ut.open),
      agent: e(Ut.agent),
      note: e(Ut.note)
    },
    edge: {
      structure: e(me.structure),
      support: e(me.support),
      conflict: e(me.conflict),
      succession: e(me.succession),
      presence: e(me.presence)
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
}, ma = ["d"], ya = ["d"], ba = ["d"], wa = 4, ka = /* @__PURE__ */ $t({
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
    const d = B({ width: 900, height: 620 }), l = B({ zoom: 1, x: 0, y: 0 }), c = B(""), p = B(""), m = B(!0), h = B(!1), j = B({ nodes: 0, edges: 0, labels: 0, territories: 0, territoriesHeld: 0 }), x = be(/* @__PURE__ */ new Map()), b = B(null), g = be(null), f = be(ci);
    let I = null, S = null, $ = null, L, C, W = 0, D, H = !1, st = null, T = 0, A = { x: 0, y: 0 };
    const N = O(() => e.nodes.filter((R) => !De(R))), Q = O(() => {
      const R = new Set(e.nodes.filter(De).map((M) => M.id));
      return e.edges.filter((M) => !Sn(M) && !R.has(M.from) && !R.has(M.to));
    }), at = O(() => {
      const R = /* @__PURE__ */ new Map();
      for (const M of N.value) {
        const z = kt(M.kind);
        R.set(z, (R.get(z) || 0) + 1);
      }
      return wo.filter((M) => R.has(M)).map((M) => ({ family: M, count: R.get(M) || 0 }));
    }), E = O(() => {
      const R = /* @__PURE__ */ new Set();
      for (const M of e.presence) M.positionId && R.add(M.positionId);
      return R;
    }), tt = O(() => e.presence.filter((R) => R.positionId).map((R) => ({ id: R.id, nodeId: R.positionId, initials: R.initials, label: R.label, stale: R.stale }))), J = O(() => Un(l.value.zoom, j.value.nodes || N.value.length)), V = O(() => Math.round(l.value.zoom * 100)), ht = O(() => J.value === "envelope" ? "territories" : J.value === "dot" ? "marks" : J.value === "mark" ? "marks and landmarks" : "full detail"), ut = B(Math.floor(Date.now() / 1e3));
    let ct;
    const pt = O(() => Wo(e.assembly, ut.value)), gt = O(() => Fo(e.assembly)), vt = O(() => (e.omittedNodes || 0) + (e.omittedEdges || 0)), Ft = O(() => {
      const R = e.whole;
      return !R || !R.total ? 0 : Math.min(1, R.loaded / R.total);
    }), ot = O(() => c.value && e.nodes.find((R) => R.id === c.value) || null);
    function Z() {
      W || (W = requestAnimationFrame(() => {
        W = 0, Xt();
      }));
    }
    function Xt() {
      const R = g.value;
      if (!$ || !r.value || !S || !R) return;
      const M = Math.min(2, window.devicePixelRatio || 1), z = Math.round(d.value.width * M), dt = Math.round(d.value.height * M);
      (r.value.width !== z || r.value.height !== dt) && (r.value.width = z, r.value.height = dt), $.setTransform(M, 0, 0, M, 0, 0), j.value = Ei($, R, l.value, d.value, S, {
        detail: Un(l.value.zoom, R.nodes.length),
        now: e.now,
        selectedId: e.selectedId || "",
        hoveredId: c.value,
        mutedFamily: p.value,
        touched: e.touchedIds || /* @__PURE__ */ new Set(),
        showRegions: m.value,
        pins: tt.value
      });
    }
    async function Lt(R = !1, M = !1) {
      if (!I) return;
      const z = N.value, dt = Q.value, Et = bi(z.length, d.value);
      h.value = !0;
      const At = await I.solve({
        nodes: z,
        edges: dt,
        width: Et.width,
        height: Et.height,
        emphasis: E.value,
        held: x.value,
        fresh: R,
        unpin: M
      });
      At && (h.value = !1, f.value = At, g.value = Ai(At, z, dt, e.labels || /* @__PURE__ */ new Map(), e.activity || /* @__PURE__ */ new Map()), H || Mt(), Z());
    }
    function ft(R = !1) {
      clearTimeout(D), D = setTimeout(() => {
        Lt(R);
      }, 60);
    }
    function Mt() {
      const R = g.value;
      l.value = vi(R?.bounds || null, d.value);
    }
    function mt() {
      o("viewport", { zoom: l.value.zoom, x: l.value.x, y: l.value.y });
    }
    function St() {
      H = !1, Mt(), mt(), Z();
    }
    function Tt(R) {
      H = !0, l.value = qn(l.value, R, d.value.width / 2, d.value.height / 2), mt(), Z();
    }
    function Ct() {
      const R = e.selectedId, M = R ? di(f.value, R) : null;
      if (!M) {
        St();
        return;
      }
      H = !0;
      const z = Ve(Math.max(l.value.zoom, 1.2));
      l.value = { zoom: z, x: d.value.width / 2 - M.x * z, y: d.value.height / 2 - M.y * z }, mt(), Z();
    }
    function te() {
      x.value = /* @__PURE__ */ new Map(), ft();
    }
    function he() {
      x.value = /* @__PURE__ */ new Map(), H = !1, Lt(!0, !0);
    }
    function fe(R) {
      p.value = p.value === R ? "" : R, Z();
    }
    function Nt(R) {
      const M = r.value?.getBoundingClientRect();
      return M ? xn(l.value, R.clientX - M.left, R.clientY - M.top) : { x: 0, y: 0 };
    }
    function $e(R) {
      const M = r.value?.getBoundingClientRect();
      M && (H = !0, l.value = qn(l.value, R.deltaY > 0 ? 0.9 : 1.1, R.clientX - M.left, R.clientY - M.top), mt(), Z());
    }
    function je(R) {
      const M = Nt(R);
      R.currentTarget.setPointerCapture(R.pointerId), T = 0, A = { x: R.clientX, y: R.clientY };
      const dt = !!!(g.value && Gn(g.value, M.x, M.y)) && g.value ? Le(g.value, M.x, M.y) : "";
      if (dt) {
        const Et = f.value.index.get(dt);
        st = { id: dt, offsetX: f.value.positions[Et * 2] - M.x, offsetY: f.value.positions[Et * 2 + 1] - M.y, moved: !1 };
        return;
      }
      b.value = { x: R.clientX, y: R.clientY, from: { ...l.value } };
    }
    function Me(R) {
      if ((st || b.value) && (T = Math.max(T, Math.hypot(R.clientX - A.x, R.clientY - A.y))), st) {
        const dt = Nt(R), Et = new Map(x.value);
        Et.set(st.id, { px: dt.x + st.offsetX, py: dt.y + st.offsetY }), x.value = Et, st.moved = !0;
        const At = f.value.index.get(st.id);
        if (At !== void 0) {
          f.value.positions[At * 2] = dt.x + st.offsetX, f.value.positions[At * 2 + 1] = dt.y + st.offsetY;
          const oe = g.value?.nodes[At];
          oe && (oe.x = dt.x + st.offsetX, oe.y = dt.y + st.offsetY);
        }
        Z();
        return;
      }
      if (b.value) {
        H = !0, l.value = {
          zoom: b.value.from.zoom,
          x: b.value.from.x + R.clientX - b.value.x,
          y: b.value.from.y + R.clientY - b.value.y
        }, Z();
        return;
      }
      const M = Nt(R), z = g.value ? Le(g.value, M.x, M.y) : "";
      z !== c.value && (c.value = z, Z());
    }
    function pe() {
      b.value && mt(), b.value = null, st?.moved && ft(), st = null;
    }
    function Rt() {
      return T > wa;
    }
    function ee(R) {
      if (Rt()) return;
      const M = Nt(R), z = g.value ? Gn(g.value, M.x, M.y) : null;
      if (z) {
        o("port", z.targetId);
        return;
      }
      const dt = g.value ? Le(g.value, M.x, M.y) : "";
      dt && o("select", dt);
    }
    function ne(R) {
      if (Rt()) return;
      const M = Nt(R), z = g.value ? Le(g.value, M.x, M.y) : "";
      z && o("focus", z);
    }
    function ge(R) {
      const M = Nt(R), z = g.value ? Le(g.value, M.x, M.y) : "";
      z && o("menu", z, R);
    }
    function zt() {
      a && (S = Ri(a), Z());
    }
    return Ze(() => {
      I = new hi(() => new tr()), $ = r.value?.getContext("2d") || null, u.value && (a = Ti(document), u.value.appendChild(a)), ce(zt), C = Oi(zt), ct = setInterval(() => {
        ut.value = Math.floor(Date.now() / 1e3);
      }, 3e4), L = new ResizeObserver((R) => {
        const M = R[0]?.contentRect;
        if (!M) return;
        const z = { width: Math.max(200, Math.round(M.width)), height: Math.max(160, Math.round(M.height)) };
        z.width === d.value.width && z.height === d.value.height || (d.value = z, ft());
      }), s.value && L.observe(s.value), Lt();
    }), We(() => {
      L?.disconnect(), L = void 0, C?.(), C = void 0, ct && clearInterval(ct), ct = void 0, W && cancelAnimationFrame(W), W = 0, clearTimeout(D), D = void 0, a = null, I?.dispose(), I = null;
    }), yt(() => e.viewport, (R) => {
      !R || R.zoom === void 0 || (H = !0, l.value = { zoom: Ve(R.zoom), x: R.x || 0, y: R.y || 0 }, Z());
    }, { immediate: !0 }), yt(() => [e.nodes, e.edges], () => ft()), yt(() => e.whole?.done, (R, M) => {
      !R || M || (H = !1, Lt(!0));
    }), yt(() => e.selectedId, Z), yt(() => e.touchedIds, Z), yt(() => e.presence, Z), yt(() => e.activity, () => {
      const R = g.value;
      if (R) for (const M of R.nodes) {
        const z = e.activity?.get(M.id);
        M.sessions = z?.sessions || 0, M.lastWorkedAt = z?.lastActivityAt || 0;
      }
      Z();
    }), (R, M) => (w(), k("section", {
      ref_key: "host",
      ref: s,
      class: "jr-graph",
      "aria-label": "Knowledge graph"
    }, [
      i("canvas", {
        ref_key: "canvas",
        ref: r,
        class: nt(["jr-graph-canvas", { grabbing: b.value }]),
        role: "application",
        "aria-label": "Bounded knowledge graph",
        onWheel: Wt($e, ["prevent"]),
        onPointerdown: je,
        onPointermove: Me,
        onPointerup: pe,
        onPointercancel: pe,
        onPointerleave: M[0] || (M[0] = (z) => {
          c.value = "", Z();
        }),
        onClick: ee,
        onDblclick: Wt(ne, ["prevent"]),
        onContextmenu: Wt(ge, ["prevent"])
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
          tt.value.length ? (w(), k(U, { key: 0 }, [
            M[9] || (M[9] = i("i", { "aria-hidden": "true" }, null, -1)),
            i("b", null, v(tt.value.length), 1),
            M[10] || (M[10] = i("span", null, "agents here", -1))
          ], 64)) : X("", !0)
        ]),
        i("p", Wi, [
          G(" Drawing " + v(j.value.nodes.toLocaleString()) + " on screen at " + v(ht.value) + " ", 1),
          j.value.territories ? (w(), k(U, { key: 0 }, [
            G(" · " + v(j.value.territories) + " territories named", 1)
          ], 64)) : X("", !0),
          j.value.territoriesHeld ? (w(), k(U, { key: 1 }, [
            G(" of " + v((j.value.territories + j.value.territoriesHeld).toLocaleString()), 1)
          ], 64)) : X("", !0)
        ])
      ]),
      vt.value || t.whole?.running || t.whole?.error || t.whole?.cancelled || t.whole?.done ? (w(), k("div", Fi, [
        t.whole?.running ? (w(), k(U, { key: 0 }, [
          i("p", Bi, [
            M[14] || (M[14] = i("span", { class: "jr-bound-label" }, "Loading the whole graph", -1)),
            i("b", zi, v(t.whole.loaded.toLocaleString()) + " / " + v(t.whole.total.toLocaleString()), 1),
            i("span", Yi, "· " + v(t.whole.chunks) + " chunk" + v(t.whole.chunks === 1 ? "" : "s"), 1)
          ]),
          i("div", qi, [
            i("i", {
              style: bt({ width: `${Math.round(Ft.value * 100)}%` })
            }, null, 4)
          ]),
          i("button", {
            class: "jr-bound-stop",
            onClick: M[1] || (M[1] = (z) => o("cancelLoad"))
          }, [
            q(y(K), {
              icon: "tabler:player-stop",
              "aria-hidden": "true"
            }),
            M[15] || (M[15] = G(" Stop ", -1))
          ])
        ], 64)) : vt.value ? (w(), k(U, { key: 1 }, [
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
            onClick: M[2] || (M[2] = (z) => o("loadAll"))
          }, [
            q(y(K), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            M[20] || (M[20] = G(" Load all ", -1))
          ])
        ], 64)) : t.whole?.error ? (w(), k(U, { key: 2 }, [
          i("p", Gi, v(t.whole.error), 1),
          i("button", {
            class: "jr-bound-load",
            onClick: M[3] || (M[3] = (z) => o("loadAll"))
          }, [
            q(y(K), {
              icon: "tabler:refresh",
              "aria-hidden": "true"
            }),
            M[21] || (M[21] = G(" Try again", -1))
          ])
        ], 64)) : t.whole?.cancelled ? (w(), k(U, { key: 3 }, [
          i("p", Ki, [
            M[22] || (M[22] = i("span", { class: "jr-bound-label" }, "Stopped", -1)),
            i("b", Ji, v(t.whole.loaded.toLocaleString()), 1),
            M[23] || (M[23] = i("span", null, "loaded", -1))
          ]),
          i("button", {
            class: "jr-bound-load",
            onClick: M[4] || (M[4] = (z) => o("loadAll"))
          }, [
            q(y(K), {
              icon: "tabler:arrow-bar-to-down",
              "aria-hidden": "true"
            }),
            M[24] || (M[24] = G(" Continue", -1))
          ])
        ], 64)) : t.whole?.done ? (w(), k("p", Vi, [
          M[27] || (M[27] = i("span", { class: "jr-bound-label" }, "Fully loaded", -1)),
          i("b", Zi, v(t.whole.loaded.toLocaleString()), 1),
          M[28] || (M[28] = i("span", null, "records and relations", -1)),
          g.value && g.value.ports.length ? (w(), k(U, { key: 0 }, [
            M[25] || (M[25] = i("span", { class: "jr-numeric" }, "·", -1)),
            i("b", Qi, v(g.value.ports.length), 1),
            M[26] || (M[26] = i("span", null, "ports out", -1))
          ], 64)) : X("", !0)
        ])) : X("", !0)
      ])) : X("", !0),
      i("div", ta, [
        (w(!0), k(U, null, et(at.value, (z) => (w(), k("button", {
          key: z.family,
          class: nt(["jr-legend-item", `family-${z.family}`, { on: p.value === z.family }]),
          "aria-pressed": p.value === z.family,
          title: `Highlight ${y(Bn)[z.family].toLowerCase()}`,
          onClick: (dt) => fe(z.family)
        }, [
          q(_e, {
            class: "jr-legend-mark",
            family: z.family,
            radius: 7.2,
            "view-box": "-11 -11 22 22"
          }, null, 8, ["family"]),
          i("span", null, v(y(Bn)[z.family]), 1),
          i("em", na, v(z.count.toLocaleString()), 1)
        ], 10, ea))), 128))
      ]),
      i("div", oa, [
        i("button", {
          class: nt(["jr-tool", { on: m.value }]),
          "aria-label": "Toggle branch territories",
          title: "Branch territories",
          onClick: M[5] || (M[5] = (z) => {
            m.value = !m.value, Z();
          })
        }, [
          q(y(K), {
            icon: "tabler:chart-area-line",
            "aria-hidden": "true"
          })
        ], 2),
        i("button", {
          class: nt(["jr-tool", { on: x.value.size > 0 }]),
          disabled: !x.value.size,
          "aria-label": "Release held records",
          title: "Release held records",
          onClick: te
        }, [
          q(y(K), {
            icon: "tabler:pinned-off",
            "aria-hidden": "true"
          })
        ], 10, sa),
        i("button", {
          class: "jr-tool",
          disabled: h.value,
          "aria-label": "Re-layout the graph",
          title: "Re-layout: arrange the whole graph afresh and fit it to the pane",
          onClick: he
        }, [
          q(y(K), {
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
          onClick: M[6] || (M[6] = (z) => Tt(0.82))
        }, [
          q(y(K), {
            icon: "tabler:minus",
            "aria-hidden": "true"
          })
        ]),
        i("span", ia, v(V.value) + "%", 1),
        i("button", {
          class: "jr-tool",
          "aria-label": "Zoom in",
          title: "Zoom in",
          onClick: M[7] || (M[7] = (z) => Tt(1.22))
        }, [
          q(y(K), {
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
          onClick: Ct
        }, [
          q(y(K), {
            icon: "tabler:focus-2",
            "aria-hidden": "true"
          })
        ]),
        i("button", {
          class: "jr-tool",
          "aria-label": "Fit the graph to the canvas",
          title: "Fit to canvas",
          onClick: St
        }, [
          q(y(K), {
            icon: "tabler:arrows-maximize",
            "aria-hidden": "true"
          })
        ])
      ]),
      ot.value ? (w(), k("figure", {
        key: 1,
        class: nt(["jr-hovercard", `family-${y(kt)(ot.value.kind)}`])
      }, [
        i("figcaption", null, [
          i("span", aa, v(ot.value.kind.replace(/_/g, " ")), 1),
          i("b", null, v(ot.value.label), 1)
        ]),
        ot.value.summary ? (w(), k("p", la, v(ot.value.summary), 1)) : X("", !0),
        i("dl", null, [
          i("div", null, [
            M[31] || (M[31] = i("dt", null, "Children", -1)),
            i("dd", null, v(ot.value.child_count), 1)
          ]),
          i("div", null, [
            M[32] || (M[32] = i("dt", null, "Revision", -1)),
            i("dd", null, v(ot.value.revision), 1)
          ]),
          ot.value.status ? (w(), k("div", ua, [
            M[33] || (M[33] = i("dt", null, "State", -1)),
            i("dd", null, v(ot.value.status), 1)
          ])) : X("", !0)
        ])
      ], 2)) : X("", !0),
      i("div", ca, [
        i("p", {
          class: "jr-assemble-line",
          title: gt.value
        }, [
          i("span", {
            class: nt(["jr-assemble-state", { busy: t.assembling || h.value }]),
            "aria-hidden": "true"
          }, null, 2),
          G(" " + v(h.value ? "Laying out the graph…" : pt.value), 1)
        ], 8, da),
        t.readOnly ? X("", !0) : (w(), k("button", {
          key: 0,
          class: "jr-assemble-run",
          disabled: t.assembling,
          "aria-busy": t.assembling ? "true" : "false",
          title: t.assembling ? "An assembly pass is already running" : "Derive every relation the records state, then propose the rest",
          onClick: M[8] || (M[8] = (z) => o("recompute"))
        }, [
          t.assembling ? (w(), k("span", fa)) : (w(), qt(y(K), {
            key: 1,
            icon: "tabler:topology-star-ring-3",
            "aria-hidden": "true"
          })),
          i("span", null, v(t.assembling ? "Assembling…" : "Recompute map"), 1)
        ], 8, ha))
      ]),
      t.loading && !t.nodes.length ? (w(), k("div", pa, [...M[34] || (M[34] = [
        i("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        i("h3", null, "Projecting the window", -1),
        i("p", null, "Reading the bounded graph around the current focus.", -1)
      ])])) : t.nodes.length ? X("", !0) : (w(), k("div", ga, [
        (w(), k("svg", va, [
          i("path", {
            d: y(Oe)("anchor", 11),
            transform: "translate(-16 -8)"
          }, null, 8, ma),
          i("path", {
            d: y(Oe)("rule", 9),
            transform: "translate(14 -12)"
          }, null, 8, ya),
          i("path", {
            d: y(Oe)("evidence", 8),
            transform: "translate(2 14)"
          }, null, 8, ba)
        ])),
        M[35] || (M[35] = i("h3", null, "Nothing in this window", -1)),
        M[36] || (M[36] = i("p", null, "This focus level holds no records yet. Step out, or pick another graph from the navigator.", -1))
      ]))
    ], 512));
  }
}), _a = /* @__PURE__ */ $t({
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
      ce(u);
    }), Ze(() => {
      ce(() => {
        u(), s.value?.focus();
      }), window.addEventListener("resize", u);
    }), We(() => window.removeEventListener("resize", u));
    const a = n;
    function d(l) {
      a(l), a("close");
    }
    return (l, c) => (w(), k("div", {
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
          q(y(K), {
            icon: "tabler:info-circle",
            "aria-hidden": "true"
          }),
          c[8] || (c[8] = G(" Details", -1))
        ]),
        i("button", {
          role: "menuitem",
          onClick: c[1] || (c[1] = (p) => d("focus"))
        }, [
          q(y(K), {
            icon: "tabler:arrow-up-right",
            "aria-hidden": "true"
          }),
          c[9] || (c[9] = G(" Focus here", -1))
        ]),
        i("button", {
          role: "menuitem",
          onClick: c[2] || (c[2] = (p) => d("copy"))
        }, [
          q(y(K), {
            icon: "tabler:copy",
            "aria-hidden": "true"
          }),
          c[10] || (c[10] = G(" Copy address", -1))
        ])
      ], 36)
    ], 544));
  }
}), Qn = 300, xa = 2700, $a = 10, Ue = 0.032, fn = "·journal";
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
  const d = (u.length - 1) * Ue, l = Math.max(1e-9, 1 - d), c = Math.max(1, u.reduce(($, [L, C]) => $ + Math.max(1, C - L), 0)), p = [], m = [];
  let h = 0;
  for (let $ = 0; $ < u.length; $++) {
    const [L, C] = u[$], W = Math.max(1, C - L) / c * l;
    p.push({ from: L, to: C, x0: h, x1: h + W, idle: !1 }), h += W;
    const D = u[$ + 1];
    if (D) {
      const H = D[0] - C;
      p.push({ from: C, to: D[0], x0: h, x1: h + Ue, idle: !0 }), m.push({ offset: h, width: Ue, seconds: H, label: `${Ma(H)} idle` }), h += Ue;
    }
  }
  const j = p[p.length - 1];
  j && (j.x1 = 1);
  const x = u[0][0], b = u[u.length - 1][1], g = Math.max(Qn, b - x), f = [], I = g > 40 * 3600 ? 0.105 : 0.055, S = ($, L) => {
    const C = f[f.length - 1];
    C && L - C.offset < I || f.push({ at: $, offset: L, label: eo($, g) });
  };
  for (const $ of p)
    if (!$.idle && (S($.from, $.x0), $.x1 - $.x0 > 0.24)) {
      const L = ($.from + $.to) / 2;
      S(L, ($.x0 + $.x1) / 2);
    }
  for (; f.length && 1 - f[f.length - 1].offset < I; ) f.pop();
  return f.push({ at: b, offset: 1, label: eo(b, g) }), { from: x, to: b, segments: p, marks: f, gaps: m };
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
}, Ya = ["title", "disabled", "onClick"], qa = { class: "jr-avatar" }, Ua = { class: "jr-numeric" }, Xa = { class: "jr-lane-track" }, Ha = ["title"], Ga = ["title", "onClick"], Ka = { class: "jr-numeric" }, Ja = /* @__PURE__ */ $t({
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
    return (d, l) => (w(), k("section", Ea, [
      i("div", La, [
        l[5] || (l[5] = i("span", { class: "jr-lens-title" }, "Lanes", -1)),
        i("span", Ta, [
          i("b", Ra, v(r.value.length), 1),
          l[0] || (l[0] = G(" lanes ", -1)),
          l[1] || (l[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Oa, v(t.spans.length), 1),
          l[2] || (l[2] = G(" spans ", -1)),
          l[3] || (l[3] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Da, v(t.buckets.length), 1),
          l[4] || (l[4] = G(" buckets ", -1))
        ])
      ]),
      r.value.length ? (w(), k("div", Wa, [
        i("div", Fa, [
          (w(!0), k(U, null, et(s.value.marks, (c) => (w(), k("span", {
            key: c.at,
            style: bt({ left: `${c.offset * 100}%` })
          }, v(c.label), 5))), 128))
        ]),
        i("div", Ba, [
          i("div", za, [
            (w(!0), k(U, null, et(s.value.gaps, (c) => (w(), k("div", {
              key: c.offset,
              class: "jr-lane-gap",
              style: bt({ left: `${c.offset * 100}%`, width: `${c.width * 100}%` })
            }, [
              i("span", null, v(c.label), 1)
            ], 4))), 128))
          ]),
          (w(!0), k(U, null, et(r.value, (c) => (w(), k("div", {
            key: c.agentId,
            class: nt(["jr-lane", { unattributed: c.unattributed }])
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
              (w(!0), k(U, null, et(c.ticks, (p) => (w(), k("i", {
                key: p.at,
                class: "jr-lane-tick",
                style: bt({ left: `${y(Mn)(p.at, s.value) * 100}%`, height: `${Math.max(12, p.events / u.value * 100)}%` }),
                title: `${p.events} facts`
              }, null, 12, Ha))), 128)),
              (w(!0), k(U, null, et(c.spans, (p) => (w(), k("button", {
                key: p.spanId,
                class: nt(["jr-lane-span", { open: p.open, [`outcome-${p.outcome}`]: p.outcome }]),
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
      ])) : (w(), k("div", Pa, [
        q(y(K), {
          icon: "tabler:timeline",
          "aria-hidden": "true"
        }),
        l[6] || (l[6] = i("h3", null, "No agent has worked in this journal yet", -1)),
        l[7] || (l[7] = i("p", null, "A lane appears the moment an identity writes its first fact; the span it opens is the bar.", -1))
      ]))
    ]));
  }
}), Mo = 3 * 86400;
function ue(t, n) {
  const e = Math.max(0, Math.floor(n - t)), o = e < 3600 ? "live" : e < Mo ? "recent" : "dormant";
  return { seconds: e, label: wt(t, n), tier: o };
}
function Ao(t) {
  const n = { status: t };
  return Qe(n) || we(n);
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
    ue(u, n).tier === "dormant" ? s.push(r) : o.push(r);
  }
  return { worked: o, dormant: s };
}
function So(t, n) {
  const { children: e, activity: o } = Io(t), s = new Map(t.map((a) => [a.id, a])), r = (a) => ue(o.get(a.id) ?? a.updated_at, n).tier === "dormant", u = [];
  for (const a of t) {
    if (!r(a)) continue;
    const d = a.parent_task_id && a.parent_task_id !== a.id ? s.get(a.parent_task_id) : void 0;
    if (d && r(d)) continue;
    const l = Za(a, e, /* @__PURE__ */ new Set([a.id])), c = o.get(a.id) ?? a.updated_at, p = {
      root: a,
      members: l,
      lastActivityAt: c,
      age: ue(c, n),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const m of [a, ...l]) {
      const h = String(m.status || "").toLowerCase();
      Ao(h) ? p.doneCount += 1 : h === "blocked" ? p.blockedCount += 1 : p.openCount += 1;
    }
    u.push(p);
  }
  return u.sort((a, d) => a.lastActivityAt - d.lastActivityAt || a.root.title.localeCompare(d.root.title));
}
const el = {
  class: "jr-now",
  "aria-label": "What is happening now"
}, nl = { class: "jr-lens-meta" }, ol = { class: "jr-lens-facts" }, sl = { class: "jr-numeric" }, rl = { class: "jr-numeric" }, il = { class: "jr-numeric" }, al = {
  key: 0,
  class: "jr-lens-bound"
}, ll = { class: "jr-now-grid" }, ul = {
  class: "jr-now-block wide",
  "aria-label": "Who can edit"
}, cl = { class: "jr-numeric" }, dl = {
  key: 0,
  class: "jr-empty-small"
}, hl = ["onClick"], fl = { class: "jr-now-copy" }, pl = { class: "jr-numeric" }, gl = ["onClick"], vl = { class: "jr-now-copy" }, ml = {
  key: 0,
  class: "jr-numeric"
}, yl = {
  class: "jr-now-block",
  "aria-label": "Open work spans"
}, bl = { class: "jr-numeric" }, wl = {
  key: 0,
  class: "jr-empty-small"
}, kl = ["onClick"], _l = { class: "jr-avatar" }, xl = { class: "jr-now-copy" }, $l = {
  key: 0,
  class: "jr-now-fact"
}, jl = { class: "jr-now-meta" }, Ml = { class: "jr-numeric" }, Al = { class: "jr-numeric" }, Il = {
  class: "jr-now-block",
  "aria-label": "Open tasks"
}, Sl = { class: "jr-numeric" }, Cl = {
  key: 0,
  class: "jr-empty-small"
}, Nl = ["onClick"], El = { class: "jr-now-copy" }, Ll = { key: 0 }, Tl = ["onClick"], Rl = { class: "jr-now-copy" }, Ol = { key: 0 }, Dl = {
  class: "jr-now-block wide",
  "aria-label": "Recent significant facts"
}, Pl = { class: "jr-numeric" }, Wl = {
  key: 0,
  class: "jr-empty-small"
}, Fl = {
  key: 1,
  class: "jr-now-facts"
}, Bl = { class: "jr-numeric" }, zl = /* @__PURE__ */ $t({
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
    const e = t, o = n, s = /^(milestone|decision|blocker|finding|risk|contradiction|acceptance|reflection)$/i, r = O(() => e.spans.filter((b) => b.state === "open").sort((b, g) => g.last_activity_at - b.last_activity_at)), u = O(() => e.tasks.filter((b) => !Ao(b.status))), a = O(() => tl(u.value, e.now)), d = O(() => a.value.worked.filter((b) => b.status !== "blocked").sort((b, g) => g.updated_at - b.updated_at)), l = O(() => e.tasks.filter((b) => b.status === "blocked").sort((b, g) => g.updated_at - b.updated_at)), c = O(() => {
      const b = new Map(e.tasks.map((f) => [f.id, f])), g = /* @__PURE__ */ new Set();
      for (const f of So(e.tasks, e.now)) {
        let I = b.get(f.root.id);
        const S = /* @__PURE__ */ new Set();
        for (; I?.parent_task_id && b.has(I.parent_task_id) && !S.has(I.id); )
          S.add(I.id), I = b.get(I.parent_task_id);
        g.add(I?.id || f.root.id);
      }
      return [...g];
    }), p = O(() => e.events.filter((b) => s.test(b.event_type)).sort((b, g) => g.seq - b.seq).slice(0, 24));
    function m(b) {
      return Gt(b.agent_id || b.cursor_id || "").label;
    }
    function h(b) {
      return Gt(b.agent_id || b.cursor_id || "").initials;
    }
    function j(b) {
      return b.working_on?.text || b.last_fact?.title || "Open activity span";
    }
    function x(b) {
      const g = Math.max(0, Math.floor(b - e.now));
      return g < 60 ? `${g}s` : g < 3600 ? `${Math.ceil(g / 60)}m` : `${Math.ceil(g / 3600)}h`;
    }
    return (b, g) => (w(), k("section", el, [
      i("div", nl, [
        g[4] || (g[4] = i("span", { class: "jr-lens-title" }, "Now", -1)),
        i("span", ol, [
          i("b", sl, v(r.value.length), 1),
          G(" open span" + v(r.value.length === 1 ? "" : "s") + " ", 1),
          g[1] || (g[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", rl, v(l.value.length), 1),
          g[2] || (g[2] = G(" blocked ", -1)),
          g[3] || (g[3] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", il, v(c.value.length), 1),
          G(" dormant program" + v(c.value.length === 1 ? "" : "s"), 1)
        ]),
        t.taskBound.hasMore ? (w(), k("span", al, v(t.taskBound.loaded.toLocaleString()) + " of " + v(t.taskBound.total.toLocaleString()) + " tasks ", 1)) : X("", !0),
        c.value.length ? (w(), k("button", {
          key: 1,
          class: "jr-lens-advice",
          title: "Review the work nothing has touched for days",
          onClick: g[0] || (g[0] = (f) => o("stale"))
        }, [
          q(y(K), {
            icon: "tabler:archive",
            "aria-hidden": "true"
          }),
          G(" Review " + v(c.value.length) + " dormant ", 1)
        ])) : X("", !0)
      ]),
      i("div", ll, [
        i("section", ul, [
          i("h3", null, [
            q(y(K), {
              icon: "tabler:key",
              "aria-hidden": "true"
            }),
            g[5] || (g[5] = G(" Who can edit ", -1)),
            i("em", cl, v(t.workControl.counts.active) + " active · " + v(t.workControl.counts.resumable) + " ready to continue", 1)
          ]),
          !t.workControl.leases.length && !t.workControl.resumable.length ? (w(), k("p", dl, " No active editing session or task waiting to continue. ")) : X("", !0),
          (w(!0), k(U, null, et(t.workControl.leases, (f) => (w(), k("button", {
            key: f.lease_id,
            class: nt(["jr-now-task", "jr-authority-row", { planning: f.capability === "PLANNING" }]),
            onClick: (I) => o("task", f.task_id)
          }, [
            i("span", {
              class: nt(["jr-state-chip", f.capability === "WRITE" ? "state-in_progress" : "state-blocked"])
            }, v(f.capability === "WRITE" ? "editing" : "planning"), 3),
            i("span", fl, [
              i("b", null, v(f.task_title || "Untitled task"), 1),
              i("small", null, v(y(Gt)(f.agent_id).label) + " · " + v(f.task_status?.replace(/_/g, " ") || "unknown task state"), 1)
            ]),
            i("time", pl, "expires in " + v(x(f.expires_at)), 1)
          ], 10, hl))), 128)),
          (w(!0), k(U, null, et(t.workControl.resumable, (f) => (w(), k("button", {
            key: `resume:${f.task_id}`,
            class: "jr-now-task jr-authority-row resumable",
            onClick: (I) => o("task", f.task_id)
          }, [
            g[7] || (g[7] = i("span", { class: "jr-state-chip state-open" }, "resume", -1)),
            i("span", vl, [
              i("b", null, v(f.task_title || "Untitled task"), 1),
              g[6] || (g[6] = i("small", null, "No active editing session · open this task to continue", -1))
            ]),
            f.task_updated_at ? (w(), k("time", ml, v(y(wt)(f.task_updated_at, t.now)), 1)) : X("", !0)
          ], 8, gl))), 128))
        ]),
        i("section", yl, [
          i("h3", null, [
            q(y(K), {
              icon: "tabler:activity-heartbeat",
              "aria-hidden": "true"
            }),
            g[8] || (g[8] = G(" Open spans ", -1)),
            i("em", bl, v(t.spanCounts.open || r.value.length), 1)
          ]),
          r.value.length ? X("", !0) : (w(), k("p", wl, "No identity has an open activity span.")),
          (w(!0), k(U, null, et(r.value, (f) => (w(), k("button", {
            key: f.span_id,
            class: "jr-now-span",
            onClick: (I) => o("agent", f.agent_id || f.cursor_id || "")
          }, [
            i("span", _l, v(h(f)), 1),
            i("span", xl, [
              i("b", null, v(m(f)), 1),
              i("small", null, v(j(f)), 1),
              f.last_fact?.title ? (w(), k("small", $l, [
                q(y(K), {
                  icon: "tabler:point",
                  "aria-hidden": "true"
                }),
                G(v(f.last_fact.title), 1)
              ])) : X("", !0)
            ]),
            i("span", jl, [
              i("time", Ml, v(y(wt)(f.last_activity_at, t.now)), 1),
              i("em", Al, v(f.fact_count || 0) + " fact" + v(f.fact_count === 1 ? "" : "s"), 1)
            ])
          ], 8, kl))), 128))
        ]),
        i("section", Il, [
          i("h3", null, [
            q(y(K), {
              icon: "tabler:checkbox",
              "aria-hidden": "true"
            }),
            g[9] || (g[9] = G(" Open work ", -1)),
            i("em", Sl, v(d.value.length + l.value.length), 1)
          ]),
          !d.value.length && !l.value.length ? (w(), k("p", Cl, "Nothing is open in this journal.")) : X("", !0),
          (w(!0), k(U, null, et(l.value, (f) => (w(), k("button", {
            key: f.id,
            class: "jr-now-task blocked",
            onClick: (I) => o("task", f.id)
          }, [
            g[10] || (g[10] = i("span", { class: "jr-state-chip state-blocked" }, "blocked", -1)),
            i("span", El, [
              i("b", null, v(f.title), 1),
              f.description ? (w(), k("small", Ll, v(f.description), 1)) : X("", !0)
            ]),
            i("time", {
              class: nt(["jr-numeric", y(ue)(f.updated_at, t.now).tier])
            }, v(y(ue)(f.updated_at, t.now).label), 3)
          ], 8, Nl))), 128)),
          (w(!0), k(U, null, et(d.value, (f) => (w(), k("button", {
            key: f.id,
            class: "jr-now-task",
            onClick: (I) => o("task", f.id)
          }, [
            i("span", {
              class: nt(["jr-state-chip", `state-${f.status}`])
            }, v(f.status.replace(/_/g, " ")), 3),
            i("span", Rl, [
              i("b", null, v(f.title), 1),
              f.description ? (w(), k("small", Ol, v(f.description), 1)) : X("", !0)
            ]),
            i("time", {
              class: nt(["jr-numeric", y(ue)(f.updated_at, t.now).tier])
            }, v(y(ue)(f.updated_at, t.now).label), 3)
          ], 8, Tl))), 128))
        ]),
        i("section", Dl, [
          i("h3", null, [
            q(y(K), {
              icon: "tabler:sparkles",
              "aria-hidden": "true"
            }),
            g[11] || (g[11] = G(" What changed ", -1)),
            i("em", Pl, v(p.value.length), 1)
          ]),
          p.value.length ? (w(), k("ol", Fl, [
            (w(!0), k(U, null, et(p.value, (f) => (w(), k("li", {
              key: f.id
            }, [
              i("span", {
                class: "jr-now-dot",
                style: bt({ background: y(xe)(f.event_type) }),
                "aria-hidden": "true"
              }, null, 4),
              i("span", {
                class: nt(["jr-eyebrow", `family-${y(kt)(f.event_type)}`])
              }, v(f.event_type.replace(/_/g, " ")), 3),
              i("b", null, v(f.title || f.body || "Journal entry"), 1),
              i("time", Bl, v(y(wt)(f.ts, t.now)), 1)
            ]))), 128))
          ])) : (w(), k("p", Wl, " Nothing decided, finished or blocked in the facts this journal has published so far. "))
        ])
      ])
    ]));
  }
}), Yl = {
  class: "jr-orbit",
  "aria-label": "Record orbit"
}, ql = { class: "jr-panel-head" }, Ul = {
  key: 0,
  class: "jr-orbit-tabs",
  "aria-label": "Orbit or record"
}, Xl = {
  key: 0,
  class: "jr-empty-state"
}, Hl = { class: "jr-detail-head" }, Gl = { class: "jr-detail-title" }, Kl = { class: "jr-eyebrow" }, Jl = { class: "jr-detail-summary" }, Vl = { class: "jr-detail-meta" }, Zl = { class: "jr-numeric" }, Ql = { class: "jr-numeric" }, tu = { class: "jr-numeric" }, eu = {
  key: 0,
  class: "jr-detail-section jr-orbit-chain"
}, nu = { class: "jr-numeric" }, ou = { class: "jr-chain" }, su = ["onClick"], ru = {
  key: 1,
  class: "jr-detail-section"
}, iu = { class: "jr-numeric" }, au = ["onClick"], lu = {
  key: 2,
  class: "jr-detail-section jr-danger-section"
}, uu = { class: "jr-numeric" }, cu = ["onClick"], du = ["onClick"], hu = {
  key: 3,
  class: "jr-detail-section jr-danger-section"
}, fu = { class: "jr-numeric" }, pu = ["onClick"], gu = { class: "danger" }, vu = {
  key: 4,
  class: "jr-detail-section"
}, mu = { class: "jr-numeric" }, yu = ["open"], bu = { class: "jr-numeric" }, wu = ["onClick"], ku = ["onClick"], _u = {
  key: 5,
  class: "jr-detail-section"
}, xu = { class: "jr-numeric" }, $u = { class: "jr-numeric" }, ju = {
  key: 6,
  class: "jr-detail-section jr-presence-section"
}, Mu = { class: "jr-numeric" }, Au = { class: "jr-avatar" }, Iu = { class: "jr-avatar" }, Su = {
  key: 0,
  class: "jr-learning"
}, Cu = {
  key: 1,
  class: "jr-content-stack"
}, Nu = { class: "jr-numeric" }, Eu = ["open"], Lu = { key: 0 }, Tu = { key: 1 }, Ru = {
  key: 2,
  class: "jr-detail-section jr-note-fields"
}, Ou = { class: "jr-numeric" }, Du = {
  key: 3,
  class: "jr-detail-section"
}, Pu = { class: "jr-numeric" }, Wu = ["onClick"], Fu = {
  key: 4,
  class: "jr-detail-section"
}, Bu = { class: "jr-detail-section" }, zu = { class: "jr-numeric" }, Yu = { class: "jr-numeric" }, qu = { class: "jr-numeric" }, Uu = /* @__PURE__ */ $t({
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
    const e = t, o = n, s = O(() => new Map(e.nodes.map((T) => [T.id, T]))), r = O(() => e.node ? e.edges.filter((T) => T.to === e.node.id && le(T.kind) !== "presence") : []), u = O(() => e.node ? e.edges.filter((T) => T.from === e.node.id && le(T.kind) !== "presence") : []), a = O(() => ({ ...e.node?.attrs || {}, ...e.node?.metadata || {} })), d = O(() => {
      const T = [], A = /* @__PURE__ */ new Set();
      let N = e.node?.parent_id ? s.value.get(e.node.parent_id) : void 0;
      for (; N && !A.has(N.id) && T.length < 32; )
        A.add(N.id), T.push(N), N = N.parent_id ? s.value.get(N.parent_id) : void 0;
      return T.reverse();
    }), l = O(() => e.node ? e.nodes.filter((T) => T.parent_id === e.node.id).sort((T, A) => A.updated_at - T.updated_at) : []), c = O(() => {
      const T = /* @__PURE__ */ new Map(), A = (N) => {
        const Q = T.get(N);
        if (Q) return Q;
        const at = { kind: N, out: [], in: [] };
        return T.set(N, at), at;
      };
      for (const N of u.value) A(N.kind).out.push(N);
      for (const N of r.value) A(N.kind).in.push(N);
      return [...T.values()].sort((N, Q) => Q.out.length + Q.in.length - (N.out.length + N.in.length));
    }), p = O(() => u.value.filter((T) => /^(blocks|threatens|invalidates)$/i.test(T.kind))), m = O(() => r.value.filter((T) => /^(blocks|threatens|invalidates)$/i.test(T.kind))), h = O(() => [...r.value, ...u.value].filter((T) => le(T.kind) === "conflict")), j = O(() => [...r.value, ...u.value].filter((T) => /support|evidence|source|reference|provenance|verif/.test(T.kind)).slice(0, 8)), x = O(() => u.value.find((T) => /supersed|successor|learned/.test(T.kind))), b = O(() => {
      const T = e.node?.id || "";
      if (!T) return [];
      const A = String(a.value.event_id || ""), N = T.replace(/^event:/, "");
      return (e.events || []).filter((Q) => Q.id === N || Q.id === A || (Q.linked_task_ids || []).includes(N)).sort((Q, at) => at.seq - Q.seq);
    }), g = O(() => (e.presence || []).filter((T) => T.positionId === e.node?.id || T.touchNodeId === e.node?.id)), f = O(() => {
      const T = new Set(b.value.map((A) => A.id));
      return (e.spans || []).filter((A) => A.last_fact && T.has(A.last_fact.event_id)).sort((A, N) => N.last_activity_at - A.last_activity_at);
    });
    function I(T) {
      return typeof T == "string" ? T : T == null ? "" : JSON.stringify(T, null, 2);
    }
    const S = O(() => {
      const T = a.value, A = [], N = (at, E, tt = "Content") => {
        if (typeof at == "string") {
          at && A.push({ id: `content-${E}`, title: tt, body: at, format: "text", role: "content", collapsed: !1 });
          return;
        }
        if (!at || typeof at != "object") return;
        const J = at, V = I(J.body ?? J.text ?? J.content);
        V && A.push({
          id: String(J.id || `content-${E}`),
          title: String(J.title || J.name || tt),
          body: V,
          format: String(J.format || J.media_type || "text").toLowerCase(),
          role: String(J.role || "content"),
          collapsed: J.collapsed === !0
        });
      };
      return N(T.content, 0), (Array.isArray(T.documents) ? T.documents : Array.isArray(T.content_blocks) ? T.content_blocks : []).forEach((at, E) => N(at, E + 1, `Document ${E + 1}`)), A;
    }), $ = O(() => {
      const T = { ...a.value };
      return delete T.content, delete T.documents, delete T.content_blocks, T;
    }), L = O(() => Object.entries($.value).filter(([T, A]) => T !== "journal_write" && T !== "provenance" && (typeof A == "string" || typeof A == "number" || typeof A == "boolean")).slice(0, 10).map(([T, A]) => ({
      key: T,
      label: T.replace(/[_-]+/g, " ").replace(/\b\w/g, (N) => N.toUpperCase()),
      value: String(A)
    }))), C = O(() => {
      const T = e.node?.summary || "No summary has been recorded for this record.";
      return T.length > 600 ? `${T.slice(0, 599)}…` : T;
    }), W = B("orbit");
    yt(() => e.node?.id, () => {
      W.value = "orbit";
    });
    function D(T) {
      return T.from === e.node?.id ? T.to : T.from;
    }
    function H(T) {
      return s.value.get(T)?.label || "Record outside this view";
    }
    function st(T) {
      return T ? new Date(T * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "Unknown";
    }
    return (T, A) => (w(), k("section", Yl, [
      i("header", ql, [
        i("span", null, v(t.peek ? "Peek" : "Record"), 1),
        t.node ? (w(), k("nav", Ul, [
          i("button", {
            class: nt({ active: W.value === "orbit" }),
            onClick: A[0] || (A[0] = (N) => W.value = "orbit")
          }, "Orbit", 2),
          i("button", {
            class: nt({ active: W.value === "record" }),
            onClick: A[1] || (A[1] = (N) => W.value = "record")
          }, "Record", 2)
        ])) : X("", !0),
        i("button", {
          "aria-label": "Close",
          title: "Close",
          onClick: A[2] || (A[2] = (N) => o("close"))
        }, [
          q(y(K), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ]),
      t.node ? (w(), k("div", {
        key: 1,
        class: nt(["jr-orbit-body", `family-${y(kt)(t.node.kind)}`]),
        style: bt({ "--node-color": y(xe)(t.node.kind) })
      }, [
        i("div", Hl, [
          i("div", Gl, [
            q(_e, {
              class: "jr-kind-mark large",
              family: y(kt)(t.node.kind),
              radius: 9,
              "view-box": "-14 -14 28 28"
            }, null, 8, ["family"]),
            i("div", null, [
              i("span", Kl, v(t.node.kind.replace(/_/g, " ")), 1),
              i("h2", null, v(t.node.label), 1)
            ])
          ]),
          i("p", Jl, v(C.value), 1),
          i("div", Vl, [
            t.node.status ? (w(), k("span", {
              key: 0,
              class: nt(["jr-state-chip", `state-${t.node.status.toLowerCase()}`])
            }, v(t.node.status), 3)) : X("", !0),
            i("span", Zl, "rev " + v(t.node.revision), 1),
            i("span", Ql, v(r.value.length + u.value.length) + " relations", 1),
            i("span", tu, v(y(wt)(t.node.updated_at, t.now)), 1),
            i("button", {
              class: "jr-root-action",
              onClick: A[3] || (A[3] = (N) => o("focus", t.node.id))
            }, [
              q(y(K), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              }),
              A[8] || (A[8] = G(" Descend", -1))
            ])
          ])
        ]),
        W.value === "orbit" ? (w(), k(U, { key: 0 }, [
          d.value.length ? (w(), k("section", eu, [
            i("h3", null, [
              A[9] || (A[9] = G("Hangs from ", -1)),
              i("span", nu, v(d.value.length), 1)
            ]),
            i("ol", ou, [
              (w(!0), k(U, null, et(d.value, (N, Q) => (w(), k("li", {
                key: N.id,
                style: bt({ "--step": Q })
              }, [
                i("button", {
                  class: "jr-related",
                  onClick: (at) => o("select", N.id)
                }, [
                  q(_e, {
                    class: "jr-kind-mark",
                    family: y(kt)(N.kind),
                    radius: 9
                  }, null, 8, ["family"]),
                  i("span", null, v(N.label), 1),
                  A[10] || (A[10] = i("b", { "aria-hidden": "true" }, "›", -1))
                ], 8, su)
              ], 4))), 128))
            ])
          ])) : X("", !0),
          l.value.length ? (w(), k("section", ru, [
            i("h3", null, [
              A[11] || (A[11] = G("Holds ", -1)),
              i("span", iu, v(l.value.length), 1)
            ]),
            (w(!0), k(U, null, et(l.value.slice(0, 12), (N) => (w(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Q) => o("select", N.id)
            }, [
              i("i", null, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(N.label), 1),
              A[12] || (A[12] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, au))), 128)),
            l.value.length > 12 ? (w(), k("button", {
              key: 0,
              class: "jr-orbit-more",
              onClick: A[4] || (A[4] = (N) => o("focus", t.node.id))
            }, " Descend to read all " + v(l.value.length), 1)) : X("", !0)
          ])) : X("", !0),
          m.value.length || p.value.length ? (w(), k("section", lu, [
            i("h3", null, [
              A[13] || (A[13] = G("Blocking ", -1)),
              i("span", uu, v(m.value.length + p.value.length), 1)
            ]),
            (w(!0), k(U, null, et(m.value, (N) => (w(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Q) => o("select", D(N))
            }, [
              A[14] || (A[14] = i("i", { class: "danger" }, "blocked by", -1)),
              i("span", null, v(H(D(N))), 1),
              A[15] || (A[15] = i("b", { "aria-hidden": "true" }, "‹", -1))
            ], 8, cu))), 128)),
            (w(!0), k(U, null, et(p.value, (N) => (w(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Q) => o("select", D(N))
            }, [
              A[16] || (A[16] = i("i", { class: "danger" }, "blocks", -1)),
              i("span", null, v(H(D(N))), 1),
              A[17] || (A[17] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, du))), 128))
          ])) : X("", !0),
          h.value.length ? (w(), k("section", hu, [
            i("h3", null, [
              A[18] || (A[18] = G("Contested by ", -1)),
              i("span", fu, v(h.value.length), 1)
            ]),
            (w(!0), k(U, null, et(h.value, (N) => (w(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Q) => o("select", D(N))
            }, [
              i("i", gu, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(H(D(N))), 1),
              A[19] || (A[19] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, pu))), 128))
          ])) : X("", !0),
          c.value.length ? (w(), k("section", vu, [
            i("h3", null, [
              A[20] || (A[20] = G("Relations by kind ", -1)),
              i("span", mu, v(c.value.length), 1)
            ]),
            (w(!0), k(U, null, et(c.value, (N) => (w(), k("details", {
              key: N.kind,
              class: "jr-relation-group",
              open: N.out.length + N.in.length <= 4
            }, [
              i("summary", null, [
                i("span", {
                  class: nt(["jr-relation-kind", `edge-${y(le)(N.kind)}`])
                }, v(N.kind.replace(/_/g, " ")), 3),
                i("em", bu, v(N.out.length) + " out · " + v(N.in.length) + " in", 1)
              ]),
              (w(!0), k(U, null, et(N.out, (Q) => (w(), k("button", {
                key: `o-${Q.id}`,
                class: "jr-related",
                onClick: (at) => o("select", D(Q))
              }, [
                A[21] || (A[21] = i("i", null, "out", -1)),
                i("span", null, v(H(D(Q))), 1),
                A[22] || (A[22] = i("b", { "aria-hidden": "true" }, "›", -1))
              ], 8, wu))), 128)),
              (w(!0), k(U, null, et(N.in, (Q) => (w(), k("button", {
                key: `i-${Q.id}`,
                class: "jr-related",
                onClick: (at) => o("select", D(Q))
              }, [
                A[23] || (A[23] = i("i", null, "in", -1)),
                i("span", null, v(H(D(Q))), 1),
                A[24] || (A[24] = i("b", { "aria-hidden": "true" }, "‹", -1))
              ], 8, ku))), 128))
            ], 8, yu))), 128))
          ])) : X("", !0),
          b.value.length ? (w(), k("section", _u, [
            i("h3", null, [
              A[25] || (A[25] = G("Facts attached ", -1)),
              i("span", xu, v(b.value.length), 1)
            ]),
            (w(!0), k(U, null, et(b.value.slice(0, 10), (N) => (w(), k("div", {
              key: N.id,
              class: "jr-orbit-fact"
            }, [
              i("span", {
                class: nt(["jr-eyebrow", `family-${y(kt)(N.event_type)}`])
              }, v(N.event_type.replace(/_/g, " ")), 3),
              i("b", null, v(N.title || N.body || "Journal entry"), 1),
              i("time", $u, v(y(wt)(N.ts, t.now)), 1)
            ]))), 128))
          ])) : X("", !0),
          g.value.length || f.value.length ? (w(), k("section", ju, [
            i("h3", null, [
              A[26] || (A[26] = G("Who has been here ", -1)),
              i("span", Mu, v(g.value.length + f.value.length), 1)
            ]),
            (w(!0), k(U, null, et(g.value, (N) => (w(), k("div", {
              key: N.id,
              class: "jr-presence-row"
            }, [
              i("span", Au, v(N.initials), 1),
              i("span", null, [
                i("b", null, v(N.label), 1),
                i("small", null, v(N.purpose), 1)
              ])
            ]))), 128)),
            (w(!0), k(U, null, et(f.value, (N) => (w(), k("div", {
              key: N.span_id,
              class: "jr-presence-row"
            }, [
              i("span", Iu, v(y(Gt)(N.agent_id || N.cursor_id || "").initials), 1),
              i("span", null, [
                i("b", null, v(y(Gt)(N.agent_id || N.cursor_id || "").label), 1),
                i("small", null, v(N.working_on?.text || "Wrote here") + " · " + v(y(wt)(N.last_activity_at, t.now)), 1)
              ])
            ]))), 128))
          ])) : X("", !0)
        ], 64)) : (w(), k(U, { key: 1 }, [
          y(we)(t.node) ? (w(), k("section", Su, [
            A[27] || (A[27] = i("span", { class: "jr-eyebrow" }, "Distilled learning", -1)),
            i("p", null, v(a.value.learning || a.value.distilled || t.node.summary || "This branch was folded without a learning summary."), 1)
          ])) : X("", !0),
          S.value.length ? (w(), k("section", Cu, [
            i("h3", null, [
              A[28] || (A[28] = G("Content ", -1)),
              i("span", Nu, v(S.value.length), 1)
            ]),
            (w(!0), k(U, null, et(S.value, (N, Q) => (w(), k("details", {
              key: N.id,
              class: "jr-content-block",
              open: !N.collapsed && Q === 0
            }, [
              i("summary", null, [
                i("span", null, v(N.title), 1),
                i("em", null, v(N.role) + " · " + v(N.format), 1)
              ]),
              /json|code|lua|typescript|javascript|yaml/.test(N.format) ? (w(), k("pre", Lu, v(N.body), 1)) : (w(), k("div", Tu, v(N.body), 1))
            ], 8, Eu))), 128))
          ])) : X("", !0),
          L.value.length ? (w(), k("section", Ru, [
            i("h3", null, [
              A[29] || (A[29] = G("Context ", -1)),
              i("span", Ou, v(L.value.length), 1)
            ]),
            i("dl", null, [
              (w(!0), k(U, null, et(L.value, (N) => (w(), k(U, {
                key: N.key
              }, [
                i("dt", null, v(N.label), 1),
                i("dd", null, v(N.value), 1)
              ], 64))), 128))
            ])
          ])) : X("", !0),
          j.value.length ? (w(), k("section", Du, [
            i("h3", null, [
              A[30] || (A[30] = G("Evidence ", -1)),
              i("span", Pu, v(j.value.length), 1)
            ]),
            (w(!0), k(U, null, et(j.value, (N) => (w(), k("button", {
              key: N.id,
              class: "jr-related",
              onClick: (Q) => o("select", D(N))
            }, [
              i("i", null, v(N.kind.replace(/_/g, " ")), 1),
              i("span", null, v(H(D(N))), 1),
              A[31] || (A[31] = i("b", { "aria-hidden": "true" }, "›", -1))
            ], 8, Wu))), 128))
          ])) : X("", !0),
          x.value ? (w(), k("section", Fu, [
            A[33] || (A[33] = i("h3", null, "Superseded by", -1)),
            i("button", {
              class: "jr-related",
              onClick: A[5] || (A[5] = (N) => o("select", D(x.value)))
            }, [
              i("i", null, v(x.value.kind.replace(/_/g, " ")), 1),
              i("span", null, v(H(D(x.value))), 1),
              A[32] || (A[32] = i("b", { "aria-hidden": "true" }, "›", -1))
            ])
          ])) : X("", !0),
          i("section", Bu, [
            A[38] || (A[38] = i("h3", null, "Position", -1)),
            i("dl", null, [
              A[34] || (A[34] = i("dt", null, "Parent", -1)),
              i("dd", null, v(s.value.get(t.node.parent_id || "")?.label || (t.node.parent_id ? "Parent outside this view" : "Graph root")), 1),
              A[35] || (A[35] = i("dt", null, "Children", -1)),
              i("dd", zu, v(t.node.child_count), 1),
              A[36] || (A[36] = i("dt", null, "Updated", -1)),
              i("dd", Yu, v(st(t.node.updated_at)), 1),
              A[37] || (A[37] = i("dt", null, "Created", -1)),
              i("dd", qu, v(st(t.node.created_at)), 1)
            ])
          ])
        ], 64))
      ], 6)) : (w(), k("div", Xl, [
        q(y(K), {
          icon: "tabler:focus-2",
          "aria-hidden": "true"
        }),
        A[6] || (A[6] = i("h3", null, "Nothing selected", -1)),
        A[7] || (A[7] = i("p", null, "Pick a record in any lens to read what it hangs from, what argues with it, and who has been standing on it.", -1))
      ]))
    ]));
  }
}), Xu = 4, Hu = { start: 0, end: 0, padTop: 0, padBottom: 0 };
function Gu(t, n, e, o, s = Xu) {
  if (o <= 0 || e <= 0) return Hu;
  const r = Math.max(0, t), u = Math.max(0, n), a = Math.floor(r / e) - s, d = Math.ceil((r + u) / e) + s, l = Math.min(o - 1, Math.max(0, a)), c = Math.min(o, Math.max(l + 1, d));
  return { start: l, end: c, padTop: l * e, padBottom: (o - c) * e };
}
function Ku(t, n) {
  return Math.max(0, t) * Math.max(0, n);
}
function Ju(t, n, e, o) {
  const s = Ku(t, o), r = s + Math.max(0, o);
  return s < n ? s : r > n + Math.max(0, e) ? Math.max(0, r - Math.max(0, e)) : Math.max(0, n);
}
const Vu = /* @__PURE__ */ $t({
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
    const l = O(() => Gu(r.value, u.value, e.rowHeight, e.items.length, e.overscan)), c = O(() => e.items.slice(l.value.start, l.value.end).map((j, x) => ({ item: j, index: l.value.start + x })));
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
      const b = Ju(j, x.scrollTop, x.clientHeight || u.value, e.rowHeight);
      b === r.value && b === x.scrollTop || (x.scrollTop = b, r.value = b);
    });
    function h(j) {
      if (j === void 0 || j < 0) return;
      const x = s.value;
      r.value = j, x && (x.scrollTop = j);
    }
    return yt(() => e.restoreScrollTop, h), Ze(() => {
      p(), h(e.restoreScrollTop), d = new ResizeObserver(p), s.value && d.observe(s.value);
    }), We(() => {
      a && cancelAnimationFrame(a), a = 0, d?.disconnect(), d = null;
    }), (j, x) => (w(), k("div", {
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
      (w(!0), k(U, null, et(c.value, (b) => No(j.$slots, "row", {
        item: b.item,
        index: b.index
      }, void 0, void 0, b.index)), 128)),
      i("div", {
        class: "jr-vlist-pad",
        style: bt({ height: `${l.value.padBottom}px` }),
        "aria-hidden": "true"
      }, null, 4)
    ], 544));
  }
}), Zu = {
  key: 0,
  class: "jr-empty-small"
}, Qu = ["data-row", "tabindex", "aria-level", "aria-selected", "aria-setsize", "aria-posinset", "aria-expanded", "onClick", "onDblclick", "onContextmenu", "onFocusin", "onKeydown"], tc = ["aria-label", "onClick"], ec = {
  key: 1,
  class: "jr-disclosure-spacer",
  "aria-hidden": "true"
}, nc = { class: "jr-tree-copy" }, oc = { class: "jr-tree-title" }, sc = {
  key: 0,
  class: "jr-tree-summary"
}, rc = { class: "jr-tree-meta" }, ic = { class: "jr-tree-kind" }, ac = ["title"], lc = ["title"], uc = ["aria-label", "onClick"], cc = 44, dc = 34, hc = /* @__PURE__ */ $t({
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
      s.value = Yo($, s.value, r), r = new Set($.map((L) => L.id));
    }, { immediate: !0 });
    const u = O(() => e.nodes.filter(($) => !De($))), a = O(() => Bo(u.value, s.value)), d = O(() => e.compact ? dc : cc), l = O(() => _o(e.edges || [])), c = O(() => {
      const $ = /* @__PURE__ */ new Map();
      for (const L of e.presence || []) {
        if (!L.positionId) continue;
        const C = $.get(L.positionId) || [];
        C.push(L), $.set(L.positionId, C);
      }
      return $;
    }), p = B(null), m = B(-1), h = B(void 0), j = O(() => Math.min(Math.max(m.value, 0), Math.max(a.value.length - 1, 0)));
    let x = "";
    yt(() => [e.selectedId, a.value], ([$]) => {
      if (!$ || $ === x) return;
      const L = a.value.findIndex((C) => C.node.id === $);
      L < 0 || (x = $, m.value = L, h.value = L);
    }, { immediate: !0 });
    function b($) {
      const L = new Set(s.value);
      L.has($) ? L.delete($) : L.add($), s.value = L;
    }
    function g($) {
      $ < 0 || $ >= a.value.length || (m.value = $, h.value = $, ce(() => p.value?.querySelector(`[data-row="${$}"]`)?.focus()));
    }
    function f($) {
      const L = a.value[$].depth;
      for (let C = $ - 1; C >= 0; C--) if (a.value[C].depth < L) return C;
      return -1;
    }
    function I($, L) {
      const C = a.value[$];
      if (!C) return;
      const W = a.value[$ + 1];
      switch (L.key) {
        case "ArrowDown":
          g($ + 1);
          break;
        case "ArrowUp":
          g($ - 1);
          break;
        case "ArrowRight":
          if (!C.hasChildren) return;
          C.expanded ? W && W.depth > C.depth && g($ + 1) : b(C.node.id);
          break;
        case "ArrowLeft":
          C.hasChildren && C.expanded ? b(C.node.id) : g(f($));
          break;
        case "Enter":
        case " ":
          o("select", C.node.id);
          break;
        default:
          return;
      }
      L.preventDefault();
    }
    function S($) {
      return String($.status || $.metadata?.outcome || "");
    }
    return ($, L) => (w(), k("div", {
      ref_key: "root",
      ref: p,
      class: nt(["jr-tree", { compact: t.compact }]),
      role: "tree",
      "aria-label": "Journal outline",
      style: bt({ "--jr-row-height": `${d.value}px` })
    }, [
      a.value.length ? (w(), qt(Vu, {
        key: 1,
        role: "presentation",
        items: a.value,
        "row-height": d.value,
        "scroll-to-index": h.value,
        "restore-scroll-top": t.viewport?.scrollTop,
        onScroll: L[0] || (L[0] = (C) => o("viewport", { scrollTop: C }))
      }, {
        row: Eo(({ item: C, index: W }) => [
          i("div", {
            class: nt(["jr-tree-row", `family-${y(kt)(C.node.kind)}`, {
              selected: C.node.id === t.selectedId,
              folded: y(we)(C.node),
              settled: y(Qe)(C.node),
              branch: C.hasChildren,
              occupied: c.value.has(C.node.id),
              touched: t.touchedIds?.has(C.node.id)
            }]),
            style: bt({ "--depth": C.depth, "--node-color": y(xe)(C.node.kind) }),
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
            onKeydown: (D) => I(W, D)
          }, [
            L[1] || (L[1] = i("span", {
              class: "jr-tree-guides",
              "aria-hidden": "true"
            }, null, -1)),
            C.hasChildren ? (w(), k("button", {
              key: 0,
              class: "jr-disclosure",
              "aria-label": C.expanded ? "Collapse branch" : "Expand branch",
              onClick: Wt((D) => b(C.node.id), ["stop"])
            }, [
              q(y(K), {
                icon: C.expanded ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, tc)) : (w(), k("span", ec)),
            q(_e, {
              class: "jr-kind-mark",
              family: y(kt)(C.node.kind),
              radius: 7,
              "view-box": "-11 -11 22 22"
            }, null, 8, ["family"]),
            i("span", nc, [
              i("span", oc, v(C.node.label), 1),
              !t.compact && C.node.summary ? (w(), k("span", sc, v(C.node.summary), 1)) : X("", !0)
            ]),
            i("span", rc, [
              i("span", ic, v(C.node.kind.replace(/_/g, " ")), 1),
              c.value.get(C.node.id) ? (w(), k("span", {
                key: 0,
                class: "jr-tree-presence",
                title: c.value.get(C.node.id).map((D) => D.label).join(", ")
              }, [
                (w(!0), k(U, null, et(c.value.get(C.node.id).slice(0, 3), (D) => (w(), k("i", {
                  key: D.id
                }, v(D.initials), 1))), 128))
              ], 8, ac)) : X("", !0),
              S(C.node) ? (w(), k("span", {
                key: 1,
                class: nt(["jr-state-chip", `state-${S(C.node).toLowerCase()}`])
              }, v(S(C.node)), 3)) : X("", !0),
              i("span", {
                class: "jr-tree-links jr-numeric",
                title: `${l.value.get(C.node.id) || 0} relations · ${C.node.child_count} children`
              }, [
                q(y(K), {
                  icon: "tabler:link",
                  "aria-hidden": "true"
                }),
                G(v(l.value.get(C.node.id) || 0), 1)
              ], 8, lc)
            ]),
            i("button", {
              class: "jr-open-root",
              title: "Open as focus root",
              "aria-label": `Open ${C.node.label} as focus root`,
              onClick: Wt((D) => o("focus", C.node.id), ["stop"])
            }, [
              q(y(K), {
                icon: "tabler:arrow-up-right",
                "aria-hidden": "true"
              })
            ], 8, uc)
          ], 46, Qu)
        ]),
        _: 1
      }, 8, ["items", "row-height", "scroll-to-index", "restore-scroll-top"])) : (w(), k("p", Zu, "No records in this focus window."))
    ], 6));
  }
}), fc = { class: "jr-search-lens" }, pc = {
  key: 0,
  class: "jr-lens-meta"
}, gc = { class: "jr-lens-facts" }, vc = { class: "jr-numeric" }, mc = {
  key: 1,
  class: "jr-loading-lines",
  "aria-label": "Searching"
}, yc = {
  key: 2,
  class: "jr-empty-state"
}, bc = {
  key: 3,
  class: "jr-empty-state"
}, wc = {
  key: 4,
  class: "jr-result-list"
}, kc = ["onClick"], _c = { class: "jr-result-rank jr-numeric" }, xc = { class: "jr-result-copy" }, $c = { class: "jr-eyebrow" }, jc = { class: "jr-numeric" }, Mc = { class: "jr-score" }, Ac = { class: "jr-numeric" }, Ic = /* @__PURE__ */ $t({
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
    return (r, u) => (w(), k("section", fc, [
      t.query ? (w(), k("div", pc, [
        u[4] || (u[4] = i("span", { class: "jr-lens-title" }, "Recall", -1)),
        i("span", gc, [
          i("b", vc, v(t.results.length), 1),
          u[0] || (u[0] = G(" matches ", -1)),
          u[1] || (u[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          G(" " + v(t.mode) + " ", 1),
          u[2] || (u[2] = i("i", { "aria-hidden": "true" }, null, -1)),
          u[3] || (u[3] = G(" bounded to this graph", -1))
        ])
      ])) : X("", !0),
      t.loading ? (w(), k("div", mc, [
        (w(), k(U, null, et(5, (a) => i("i", { key: a })), 64))
      ])) : t.query ? t.results.length ? (w(), k("ol", wc, [
        (w(!0), k(U, null, et(t.results, (a, d) => (w(), k("li", {
          key: a.id
        }, [
          i("button", {
            class: nt(["jr-result", `family-${y(kt)(a.kind)}`]),
            style: bt({ "--node-color": y(xe)(a.kind) }),
            onClick: (l) => e("select", a.id)
          }, [
            i("span", _c, v(d + 1), 1),
            q(_e, {
              class: "jr-kind-mark",
              family: y(kt)(a.kind),
              radius: 8
            }, null, 8, ["family"]),
            i("span", xc, [
              i("span", $c, v(a.kind.replace(/_/g, " ")), 1),
              i("b", null, v(a.label), 1),
              i("span", null, v(a.summary || "No summary recorded."), 1),
              i("small", jc, v(s(a.updated_at)), 1)
            ]),
            i("span", Mc, [
              i("b", Ac, v(o(a) !== null ? o(a)?.toFixed(2) : "exact"), 1),
              i("i", null, [
                i("span", {
                  style: bt({ width: `${(o(a) ?? 1) * 100}%` })
                }, null, 4)
              ]),
              i("small", null, v(o(a) !== null ? "semantic" : "text + attrs"), 1)
            ])
          ], 14, kc)
        ]))), 128))
      ])) : (w(), k("div", bc, [
        q(y(K), {
          icon: "tabler:file-search",
          "aria-hidden": "true"
        }),
        u[7] || (u[7] = i("h3", null, "Nothing matched", -1)),
        u[8] || (u[8] = i("p", null, "Try a broader phrase, or open the navigator and search a different graph.", -1))
      ])) : (w(), k("div", yc, [
        q(y(K), {
          icon: "tabler:search",
          "aria-hidden": "true"
        }),
        u[5] || (u[5] = i("h3", null, "Recall context, not just words", -1)),
        u[6] || (u[6] = i("p", null, "Match exact text or semantic meaning inside this graph. Every result keeps its address and revision, so you can cite what you find.", -1))
      ]))
    ]));
  }
}), Sc = {
  class: "jr-stale",
  "aria-label": "Stale review"
}, Cc = { class: "jr-lens-meta" }, Nc = { class: "jr-lens-facts" }, Ec = { class: "jr-numeric" }, Lc = { class: "jr-numeric" }, Tc = { class: "jr-numeric" }, Rc = {
  key: 0,
  class: "jr-lens-bound"
}, Oc = {
  key: 0,
  class: "jr-empty-state"
}, Dc = {
  key: 1,
  class: "jr-stale-list"
}, Pc = { class: "jr-stale-head" }, Wc = ["aria-label", "aria-expanded", "onClick"], Fc = ["onClick"], Bc = {
  key: 0,
  class: "jr-numeric"
}, zc = {
  key: 1,
  class: "jr-numeric"
}, Yc = { class: "jr-numeric" }, qc = { class: "jr-numeric" }, Uc = {
  key: 2,
  class: "jr-numeric"
}, Xc = { class: "jr-numeric" }, Hc = { class: "jr-numeric dormant" }, Gc = {
  key: 0,
  class: "jr-stale-members"
}, Kc = ["onClick"], Jc = { class: "jr-numeric" }, Vc = ["onClick"], Zc = { class: "jr-numeric" }, Qc = /* @__PURE__ */ $t({
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
        let h = l.get(m);
        const j = /* @__PURE__ */ new Set();
        for (; h?.parent_task_id && l.has(h.parent_task_id) && !j.has(h.id); )
          j.add(h.id), h = l.get(h.parent_task_id);
        return h;
      }, p = /* @__PURE__ */ new Map();
      for (const m of s.value) {
        const h = c(m.root.id) || m.root, j = p.get(h.id);
        j ? j.parts.push(m) : p.set(h.id, { root: h, parts: [m] });
      }
      return [...p.values()].map((m) => ({
        root: m.root,
        parts: m.parts.sort((h, j) => h.lastActivityAt - j.lastActivityAt),
        tasks: m.parts.reduce((h, j) => h + j.members.length + 1, 0),
        open: m.parts.reduce((h, j) => h + j.openCount, 0),
        blocked: m.parts.reduce((h, j) => h + j.blockedCount, 0),
        settled: m.parts.reduce((h, j) => h + j.doneCount, 0),
        lastActivityAt: Math.max(...m.parts.map((h) => h.lastActivityAt)),
        whole: m.parts.length === 1 && m.parts[0].root.id === m.root.id
      })).sort((m, h) => m.lastActivityAt - h.lastActivityAt);
    }), u = B(/* @__PURE__ */ new Set()), a = O(() => ({
      programs: r.value.length,
      tasks: r.value.reduce((l, c) => l + c.tasks, 0),
      open: r.value.reduce((l, c) => l + c.open, 0)
    }));
    function d(l) {
      const c = new Set(u.value);
      c.has(l) ? c.delete(l) : c.add(l), u.value = c;
    }
    return (l, c) => (w(), k("section", Sc, [
      i("div", Cc, [
        c[6] || (c[6] = i("span", { class: "jr-lens-title" }, "Stale review", -1)),
        i("span", Nc, [
          i("b", Ec, v(a.value.programs), 1),
          G(" dormant program" + v(a.value.programs === 1 ? "" : "s") + " ", 1),
          c[1] || (c[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Lc, v(a.value.tasks), 1),
          c[2] || (c[2] = G(" tasks ", -1)),
          c[3] || (c[3] = i("i", { "aria-hidden": "true" }, null, -1)),
          i("b", Tc, v(a.value.open), 1),
          c[4] || (c[4] = G(" still open ", -1))
        ]),
        t.taskBound.hasMore ? (w(), k("span", Rc, v(t.taskBound.loaded.toLocaleString()) + " of " + v(t.taskBound.total.toLocaleString()) + " tasks ", 1)) : X("", !0),
        i("button", {
          class: "jr-lens-advice",
          onClick: c[0] || (c[0] = (p) => o("close"))
        }, [
          q(y(K), {
            icon: "tabler:x",
            "aria-hidden": "true"
          }),
          c[5] || (c[5] = G(" Done", -1))
        ])
      ]),
      s.value.length ? (w(), k("ol", Dc, [
        (w(!0), k(U, null, et(r.value, (p) => (w(), k("li", {
          key: p.root.id,
          class: "jr-stale-item"
        }, [
          i("div", Pc, [
            i("button", {
              class: "jr-stale-fold",
              "aria-label": u.value.has(p.root.id) ? `Collapse ${p.root.title}` : `Expand ${p.root.title}`,
              "aria-expanded": u.value.has(p.root.id),
              onClick: (m) => d(p.root.id)
            }, [
              q(y(K), {
                icon: u.value.has(p.root.id) ? "tabler:chevron-down" : "tabler:chevron-right",
                "aria-hidden": "true"
              }, null, 8, ["icon"])
            ], 8, Wc),
            i("button", {
              class: "jr-stale-title",
              onClick: (m) => o("task", p.root.id)
            }, [
              i("b", null, v(p.root.title), 1),
              i("small", null, [
                p.whole ? (w(), k("span", Bc, "dormant whole")) : (w(), k("span", zc, v(p.parts.length) + " dormant part" + v(p.parts.length === 1 ? "" : "s"), 1)),
                i("span", Yc, v(p.tasks) + " task" + v(p.tasks === 1 ? "" : "s"), 1),
                i("span", qc, v(p.open) + " open", 1),
                p.blocked ? (w(), k("span", Uc, v(p.blocked) + " blocked", 1)) : X("", !0),
                i("span", Xc, v(p.settled) + " settled", 1)
              ])
            ], 8, Fc),
            i("time", Hc, v(y(wt)(p.lastActivityAt, t.now)), 1)
          ]),
          u.value.has(p.root.id) ? (w(), k("ul", Gc, [
            (w(!0), k(U, null, et(p.parts, (m) => (w(), k(U, {
              key: m.root.id
            }, [
              i("li", null, [
                i("button", {
                  onClick: (h) => o("task", m.root.id)
                }, [
                  i("span", {
                    class: nt(["jr-state-chip", `state-${m.root.status}`])
                  }, v(m.root.status.replace(/_/g, " ")), 3),
                  i("span", null, [
                    i("b", null, v(m.root.title), 1)
                  ]),
                  i("time", Jc, v(y(wt)(m.lastActivityAt, t.now)), 1)
                ], 8, Kc)
              ]),
              (w(!0), k(U, null, et(m.members, (h) => (w(), k("li", {
                key: h.id,
                class: "nested"
              }, [
                i("button", {
                  onClick: (j) => o("task", h.id)
                }, [
                  i("span", {
                    class: nt(["jr-state-chip", `state-${h.status}`])
                  }, v(h.status.replace(/_/g, " ")), 3),
                  i("span", null, v(h.title), 1),
                  i("time", Zc, v(y(wt)(h.updated_at, t.now)), 1)
                ], 8, Vc)
              ]))), 128))
            ], 64))), 128))
          ])) : X("", !0)
        ]))), 128))
      ])) : (w(), k("div", Oc, [
        q(y(K), {
          icon: "tabler:mood-check",
          "aria-hidden": "true"
        }),
        c[7] || (c[7] = i("h3", null, "Nothing has gone dormant", -1)),
        i("p", null, "Every program in this journal has been touched inside the last " + v(Math.round(y(Mo) / 86400)) + " days.", 1)
      ])),
      c[8] || (c[8] = i("p", { class: "jr-stale-note" }, " Ask an agent to settle work after reviewing its history. ", -1))
    ]));
  }
}), td = { class: "jr-timeline-lens" }, ed = { class: "jr-lens-meta" }, nd = { class: "jr-lens-facts" }, od = { class: "jr-numeric" }, sd = {
  key: 0,
  class: "jr-empty-state"
}, rd = {
  key: 1,
  class: "jr-timeline"
}, id = { class: "jr-time-day" }, ad = { class: "jr-numeric" }, ld = { class: "jr-time-list" }, ud = ["disabled", "onClick"], cd = {
  class: "jr-time-rail",
  "aria-hidden": "true"
}, dd = { class: "jr-time-copy" }, hd = { class: "jr-time-kind" }, fd = { class: "jr-time-rev jr-numeric" }, pd = /* @__PURE__ */ $t({
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
      const m = c.updated_at ? new Date(c.updated_at * 1e3) : null, h = m ? m.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "", j = c.entity_type === "edge", x = /\.add$/.test(c.kind) ? "added" : /\.remove|\.delete/.test(c.kind) ? "removed" : "updated";
      if (j) {
        const g = a(c), f = le(g);
        return {
          item: c,
          minute: h,
          repeated: p?.minute === h,
          isEdge: j,
          title: `${r(c.from_node_id)} → ${r(c.to_node_id)}`,
          kind: g.replace(/_/g, " "),
          status: "",
          verb: x,
          family: "relation",
          colour: f === "conflict" ? "var(--jr-danger)" : f === "support" ? "var(--jr-success)" : f === "succession" ? "var(--jr-decision)" : "var(--jr-muted)"
        };
      }
      const b = u(c, "kind") || "record";
      return {
        item: c,
        minute: h,
        repeated: p?.minute === h,
        isEdge: j,
        title: c.label || u(c, "label") || "Journal entry",
        kind: b.replace(/_/g, " "),
        status: u(c, "status"),
        verb: x,
        family: kt(b),
        colour: xe(b)
      };
    }
    const l = O(() => {
      const c = /* @__PURE__ */ new Map();
      for (const p of e.items) {
        const m = p.updated_at ? new Date(p.updated_at * 1e3).toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" }) : "Undated", h = c.get(m) || [];
        h.push(d(p, h[h.length - 1])), c.set(m, h);
      }
      return [...c.entries()].map(([p, m]) => ({
        day: p,
        entries: m,
        records: m.filter((h) => !h.isEdge).length,
        relations: m.filter((h) => h.isEdge).length
      }));
    });
    return (c, p) => (w(), k("section", td, [
      i("div", ed, [
        p[3] || (p[3] = i("span", { class: "jr-lens-title" }, "Changes", -1)),
        i("span", nd, [
          i("b", od, v(t.items.length), 1),
          p[0] || (p[0] = G(" revisions ", -1)),
          p[1] || (p[1] = i("i", { "aria-hidden": "true" }, null, -1)),
          p[2] || (p[2] = G(" newest first", -1))
        ])
      ]),
      t.items.length ? (w(), k("ol", rd, [
        (w(!0), k(U, null, et(l.value, (m) => (w(), k("li", {
          key: m.day,
          class: "jr-time-group"
        }, [
          i("h3", id, [
            i("span", null, v(m.day), 1),
            i("em", ad, v(m.records) + " records · " + v(m.relations) + " relations", 1)
          ]),
          i("ol", ld, [
            (w(!0), k(U, null, et(m.entries, (h) => (w(), k("li", {
              key: `${h.item.entity_type}:${h.item.id}`
            }, [
              i("button", {
                class: nt(["jr-time-row", { "is-edge": h.isEdge }]),
                disabled: h.isEdge,
                onClick: (j) => !h.isEdge && o("select", h.item.id)
              }, [
                i("time", {
                  class: nt(["jr-numeric", { repeat: h.repeated }])
                }, v(h.minute), 3),
                i("span", cd, [
                  q(_e, {
                    family: h.family === "relation" ? "note" : h.family,
                    radius: h.isEdge ? 4.4 : 6.4,
                    hollow: h.isEdge ? !1 : void 0,
                    "view-box": "-10 -10 20 20",
                    style: bt({ color: h.colour })
                  }, null, 8, ["family", "radius", "hollow", "style"])
                ]),
                i("span", dd, [
                  i("b", null, v(h.title), 1),
                  i("small", hd, v(h.kind), 1),
                  h.status ? (w(), k("small", {
                    key: 0,
                    class: nt(["jr-state-chip", `state-${h.status.toLowerCase()}`])
                  }, v(h.status), 3)) : X("", !0)
                ]),
                i("span", fd, v(h.verb) + " · rev " + v(h.item.revision), 1)
              ], 10, ud)
            ]))), 128))
          ])
        ]))), 128))
      ])) : (w(), k("div", sd, [
        q(y(K), {
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
class gd {
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
      const { data: n } = await It.get(this.base());
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
      const { data: o } = await It.get(`${this.base()}/tree${Ht({ depth: e, limit: n })}`);
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
      const { data: n } = await It.get(`${this.base()}/graphs?limit=100`);
      if (!n.success) throw new Error(n.error || "failed to list graphs");
      return n.graphs || [];
    } catch (n) {
      throw new Error(Pt(n, "Couldn’t load Journal graphs."));
    }
  }
  async window(n, e) {
    try {
      const o = Ht({ mode: "window", node_id: e, levels: 4, limit: 160, edge_limit: 480 }), { data: s } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}${o}`);
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
      }), { data: r } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}${s}`);
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
      }), { data: u } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}${r}`);
      if (!u.success) throw new Error(u.error || "failed to load the branch");
      return u.result;
    } catch (r) {
      throw new Error(Pt(r, "Couldn’t open this branch."));
    }
  }
  async search(n, e, o = "search") {
    try {
      const s = Ht({ mode: o, query: e, limit: 60 }), { data: r } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}${s}`);
      if (!r.success) throw new Error(r.error || "search failed");
      return r.result?.items || [];
    } catch (s) {
      throw new Error(Pt(s, "Couldn’t search this graph."));
    }
  }
  async timeline(n) {
    try {
      const e = Ht({ mode: "timeline", limit: 200 }), { data: o } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}${e}`);
      if (!o.success) throw new Error(o.error || "timeline failed");
      return o.result?.items || [];
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load the graph timeline."));
    }
  }
  /** The cursor store itself: every agent that holds a position in this journal. */
  async cursors(n = 200) {
    try {
      const { data: e } = await It.get(`${this.base()}/cursors${Ht({ limit: n })}`);
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
      }), { data: o } = await It.get(`${this.base()}/spans${e}`);
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
      }), { data: o } = await It.get(`${this.base()}/activity${e}`);
      if (!o.success) throw new Error(o.error || "failed to read activity");
      return o.activity;
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t load journal activity."));
    }
  }
  /** What the last on-demand assembly of this map did. */
  async assembly(n) {
    try {
      const { data: e } = await It.get(`${this.base()}/graphs/${encodeURIComponent(n)}/assemble`);
      return e.success && e.assembly || null;
    } catch {
      return null;
    }
  }
  /** Requests one assembly pass; a pass already under way is the answer. */
  async assemble(n) {
    try {
      const { data: e } = await It.post(`${this.base()}/graphs/${encodeURIComponent(n)}/assemble`, {});
      if (!e.success) throw new Error(e.error || "failed to start the assembly");
      return e.assembly;
    } catch (e) {
      throw new Error(Pt(e, "Couldn’t recompute this map."));
    }
  }
  async health() {
    try {
      const { data: n } = await It.get(`${this.base()}/health`);
      return n.success ? n.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
function vd() {
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
function md(t, n) {
  return t ? (n.revision || 0) >= (t.revision || 0) : !0;
}
function ro(t, n, e) {
  for (const o of e || []) {
    const s = n.get(o.id);
    s === void 0 ? (n.set(o.id, t.length), t.push(o)) : md(t[s], o) && (t[s] = o);
  }
}
function yd(t, n) {
  return ro(t.nodes, t.nodeIndex, n.nodes), ro(t.edges, t.edgeIndex, n.edges), t.nodeOffset += (n.nodes || []).length, t.edgeOffset += (n.edges || []).length, t.totalNodes = Math.max(t.totalNodes, Number(n.manifest?.node_count) || 0, t.nodes.length), t.totalEdges = Math.max(t.totalEdges, Number(n.manifest?.edge_count) || 0, t.edges.length), t.chunks += 1, t;
}
function bd(t) {
  return !!t.omissions?.nodes?.continuation || !!t.omissions?.edges?.continuation;
}
function io(t) {
  const n = t.nodes.length + t.edges.length, e = Math.max(n, t.totalNodes + t.totalEdges);
  return { loaded: n, total: e, ratio: e ? Math.min(1, n / e) : 0 };
}
async function wd(t, n = {}) {
  const e = vd(), o = n.maxChunks ?? 400;
  try {
    for (; ; ) {
      if (n.cancellation?.cancelled) {
        e.cancelled = !0;
        break;
      }
      const s = await t({ nodeOffset: e.nodeOffset, edgeOffset: e.edgeOffset }), r = { nodes: e.nodeOffset, edges: e.edgeOffset };
      if (yd(e, s), n.onChunk?.(e), n.cancellation?.cancelled) {
        e.cancelled = !0;
        break;
      }
      if (!bd(s)) {
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
const kd = ["now", "outline", "graph", "lanes", "recall", "changes"], ao = {
  n: "now",
  o: "outline",
  g: "graph",
  t: "lanes",
  r: "recall",
  c: "changes"
}, Co = { kind: "journal", id: "", label: "Journal" };
function _d(t, n) {
  return t.length === n.length && t.every((e, o) => e.kind === n[o].kind && e.id === n[o].id);
}
function xd(t, n) {
  return t.lens === n.lens && _d(t.focus, n.focus);
}
function lo(t) {
  return t.map((n) => `${n.kind}:${n.id}`).join("/");
}
function $d(t) {
  return encodeURIComponent(t);
}
function jd(t) {
  const n = t.focus.filter((e) => e.kind !== "journal").map((e) => `${e.kind}:${$d(e.id)}`).join("/");
  return n ? `${t.lens}/${n}` : t.lens;
}
const Md = /* @__PURE__ */ new Set(["journal", "graph", "branch", "node"]);
function Ad(t) {
  const n = "".split("/").filter(Boolean), e = kd.includes(n[0]) ? n[0] : "now", o = [Co];
  let s = "";
  for (const r of n.slice(1)) {
    const u = r.indexOf(":");
    if (u < 0) continue;
    const a = r.slice(0, u), d = decodeURIComponent(r.slice(u + 1));
    !Md.has(a) || a === "journal" || !d || (a === "graph" && (s = d), o.push({ kind: a, id: d, label: d, graphId: a === "graph" ? d : s }));
  }
  return { focus: o, lens: e };
}
function Id(t) {
  for (let n = t.focus.length - 1; n >= 0; n--) {
    const e = t.focus[n];
    if (e.kind === "graph") return e.id;
    if (e.graphId) return e.graphId;
  }
  return "";
}
function Sd(t) {
  const n = t.focus[t.focus.length - 1];
  return n && (n.kind === "branch" || n.kind === "node") ? n.id : "";
}
const uo = 120, Cd = 240;
class Nd {
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
    xd(n, this.place) || (this.history = [...this.history.slice(0, this.at + 1), n], this.history.length > uo && (this.history = this.history.slice(this.history.length - uo)), this.at = this.history.length - 1);
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
    for (this.memory.delete(e), this.memory.set(e, { ...o, ...n }); this.memory.size > Cd; ) {
      const s = this.memory.keys().next();
      if (s.done) break;
      this.memory.delete(s.value);
    }
  }
  viewport() {
    return this.memory.get(`${this.lens}@${lo(this.focus)}`);
  }
  route() {
    return jd(this.place);
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
function Ed(t) {
  const n = O(() => new gd(t.value)), e = new Nd(Ad()), o = B(e.place), s = () => {
    o.value = { lens: e.lens, focus: [...e.focus] };
  }, r = B({}), u = B([]), a = be(null), d = be(null), l = be(null), c = B({ ...pn }), p = B({ status: "unknown" }), m = B([]), h = B([]), j = B({
    now: 0,
    leases: [],
    resumable: [],
    counts: { active: 0, write: 0, planning: 0, resumable: 0 },
    limit: 100,
    has_more: !1
  }), x = B({ open: 0, sealed: 0, total: 0 }), b = B([]), g = B([]), f = B(!1), I = B([]), S = B(3600), $ = B(/* @__PURE__ */ new Map()), L = B({}), C = B(""), W = B(!0), D = B(""), H = B(""), st = B("hybrid"), T = B([]), A = B(!1), N = B([]), Q = B(!1), at = B(null), E = B(!1), tt = B(null), J = B(Math.floor(Date.now() / 1e3));
  let V, ht, ut, ct, pt = 0, gt = null;
  const vt = [], Ft = O(() => o.value.lens), ot = O(() => o.value.focus), Z = O(() => Id(o.value)), Xt = O(() => Sd(o.value)), Lt = O(() => u.value.find((_) => _.id === Z.value) || a.value?.graph || null), ft = O(() => d.value || a.value?.nodes || []), Mt = O(() => l.value || a.value?.edges || []), mt = O(() => new Map(ft.value.map((_) => [_.id, _]))), St = O(() => mt.value.get(C.value) || null), Tt = O(() => Jo(ft.value, Mt.value, m.value, Z.value, J.value)), Ct = O(() => Vo(Tt.value)), te = O(() => ft.value.filter(we).length), he = O(() => ft.value.filter((_) => !we(_) && !Qe(_)).length), fe = O(() => {
    const _ = /* @__PURE__ */ new Map();
    for (const F of h.value) {
      const Y = jo(F);
      if (!Y) continue;
      const lt = `task:${Y}`, rt = _.get(lt);
      rt ? (rt.sessions += 1, rt.lastActivityAt = Math.max(rt.lastActivityAt, F.last_activity_at)) : _.set(lt, { sessions: 1, lastActivityAt: F.last_activity_at });
    }
    return _;
  }), Nt = O(() => d.value ? { nodes: 0, edges: 0 } : {
    nodes: a.value?.collapsed_node_count || 0,
    edges: a.value?.collapsed_edge_count || 0
  }), $e = O(() => {
    let _ = 0;
    for (const F of ft.value) {
      let Y = 1, lt = F.parent_id;
      const rt = /* @__PURE__ */ new Set([F.id]);
      for (; lt && mt.value.has(lt) && !rt.has(lt); )
        rt.add(lt), Y++, lt = mt.value.get(lt)?.parent_id;
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
  function pe() {
    return p.value.status === "ok" ? "Healthy" : p.value.status === "degraded" ? "Degraded" : "Health unknown";
  }
  function Rt() {
    const _ = /* @__PURE__ */ new Map();
    for (const Y of u.value) _.set(`graph:${Y.id}`, Y.title);
    for (const Y of ft.value)
      _.set(`node:${Y.id}`, Y.label), _.set(`branch:${Y.id}`, Y.label);
    e.relabel(_);
    const F = new Map($.value);
    for (const Y of ft.value) F.set(Y.id, Y.label);
    $.value = F, s();
  }
  function ee() {
    d.value = null, l.value = null, c.value = { ...pn }, gt && (gt.cancelled = !0), gt = null;
  }
  async function ne() {
    if (u.value = await n.value.graphs(), Z.value || !u.value.length) return;
    const _ = u.value.find((F) => F.kind === "current-work") || u.value.find((F) => F.id === "map") || u.value[0];
    e.descend({ kind: "graph", id: _.id, label: _.title, graphId: _.id }), s();
  }
  function ge(_, F) {
    if (F) return F;
    const Y = e.viewport()?.selectedId;
    return Y && _.some((lt) => lt.id === Y) ? Y : _[0]?.id || "";
  }
  async function zt(_ = !1) {
    if (!Z.value) return;
    const F = ++pt, Y = o.value.focus[o.value.focus.length - 1];
    if (Y?.kind === "branch") {
      const rt = await n.value.subtree(Z.value, Y.id);
      if (F !== pt) return;
      d.value = rt.nodes || [], l.value = rt.edges || [], c.value = {
        running: !1,
        loaded: (rt.nodes || []).length + (rt.edges || []).length,
        total: (rt.manifest?.node_count || 0) + (rt.manifest?.edge_count || 0),
        chunks: 1,
        done: rt.complete !== !1,
        cancelled: !1,
        error: ""
      }, _ || (C.value = ge(rt.nodes || [], "") || Y.id);
      return;
    }
    const lt = await n.value.window(Z.value, Y?.kind === "node" ? Y.id : void 0);
    F === pt && (a.value = lt, (!_ || !lt.nodes.some((rt) => rt.id === C.value)) && (C.value = ge(lt.nodes, Y?.kind === "node" ? Y.id : "")));
  }
  async function R() {
    const [_, F] = await Promise.all([n.value.state(), n.value.tasks()]);
    b.value = F.tasks, f.value = F.bounded, g.value = _.events || [], L.value = {
      events: _.stats?.total || 0,
      lastSeq: _.stats?.last_seq || 0,
      lastTs: _.stats?.last_ts || 0,
      tasks: _.stats?.task_count || 0,
      openTasks: _.stats?.open_task_count || 0
    }, _.graphs?.length && (u.value = _.graphs), _.work_control && (j.value = _.work_control);
  }
  async function M() {
    const [_, F] = await Promise.all([
      n.value.cursors(),
      n.value.spans({ limit: 200 })
    ]);
    m.value = _, h.value = F.items || [], x.value = {
      open: F.counts?.open || 0,
      sealed: F.counts?.sealed || 0,
      total: F.counts?.total || 0
    };
  }
  async function z() {
    const _ = t.value, F = n.value, Y = async (Ot) => {
      let Dt = await F.activity({ bucket: Ot, limit: 2e3 });
      const ze = [...Dt.buckets || []];
      for (let Cn = 0; Dt.has_more && Cn < 20; Cn++) {
        const ln = Dt.next_cursor || {};
        if (ln.after_bucket_at === void 0) break;
        Dt = await F.activity({ bucket: Ot, limit: 2e3, afterBucketAt: ln.after_bucket_at, afterAgentId: ln.after_agent_id }), ze.push(...Dt.buckets || []);
      }
      return { all: ze, width: Dt.width_s, exhausted: !Dt.has_more };
    }, lt = await F.activity({ bucket: "hour", limit: 2e3 });
    if (_ !== t.value) return;
    if (!lt.has_more) {
      I.value = lt.buckets || [], S.value = lt.width_s || 3600;
      return;
    }
    const rt = await Y("day");
    _ === t.value && (I.value = rt.all, S.value = rt.width || 86400);
  }
  async function dt() {
    if (!t.value) {
      D.value = "Journal entry id is required.", W.value = !1;
      return;
    }
    W.value = !0;
    try {
      await ne(), await Promise.all([
        zt(),
        R(),
        M(),
        z(),
        n.value.health().then((_) => {
          p.value = _;
        }),
        re()
      ]), Rt(), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Couldn’t load the Journal.";
    } finally {
      W.value = !1;
    }
  }
  async function Et() {
    const _ = Z.value;
    if (!_ || c.value.running) return;
    const F = { cancelled: !1 };
    gt = F, c.value = { ...pn, running: !0 };
    const Y = await wd(
      (rt) => n.value.bundle(_, rt.nodeOffset, rt.edgeOffset),
      {
        cancellation: F,
        onChunk: (rt) => {
          const Ot = io(rt);
          d.value = rt.nodes, l.value = rt.edges, Ye(d), Ye(l), c.value = {
            running: !0,
            loaded: Ot.loaded,
            total: Ot.total,
            chunks: rt.chunks,
            done: !1,
            cancelled: !1,
            error: ""
          };
        }
      }
    );
    gt === F && (gt = null);
    const lt = io(Y);
    d.value = Y.nodes, l.value = Y.edges, Ye(d), Ye(l), c.value = {
      running: !1,
      loaded: lt.loaded,
      total: lt.total,
      chunks: Y.chunks,
      done: Y.done,
      cancelled: Y.cancelled,
      error: Y.error
    }, Rt();
  }
  function At() {
    gt && (gt.cancelled = !0);
  }
  async function oe(_) {
    if (_ === Z.value) return;
    const F = u.value.find((Y) => Y.id === _);
    e.go({
      lens: e.lens === "now" ? "outline" : e.lens,
      focus: [o.value.focus[0], { kind: "graph", id: _, label: F?.title || _, graphId: _ }]
    }), s(), C.value = "", H.value = "", T.value = [], at.value = null, N.value = [], ee(), a.value = null, W.value = !0;
    try {
      re(), await zt(), Rt(), ve(), D.value = "";
    } catch (Y) {
      D.value = Y instanceof Error ? Y.message : "Couldn’t load graph.";
    } finally {
      W.value = !1;
    }
  }
  function en(_) {
    C.value = _;
  }
  function ve() {
    r.value = { ...e.viewport() };
  }
  async function Yt() {
    s(), ee(), W.value = !0;
    try {
      await zt(), Rt(), ve(), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Couldn’t open this focus.";
    } finally {
      W.value = !1;
    }
  }
  async function Ae(_) {
    const F = mt.value.get(_);
    F && (e.descend({
      kind: F.child_count > 0 ? "branch" : "node",
      id: _,
      label: F.label,
      graphId: Z.value
    }), C.value = _, await Yt());
  }
  async function nn(_) {
    const F = o.value.focus.find((Y) => Y.kind === "graph");
    F && (e.go({
      lens: o.value.lens,
      focus: [o.value.focus[0], F, { kind: "node", id: _, label: $.value.get(_) || _, graphId: F.id }]
    }), C.value = _, await Yt());
  }
  async function Fe() {
    return e.ascend() ? (await Yt(), !0) : !1;
  }
  async function Kt(_) {
    e.toIndex(_), await Yt();
  }
  async function Be() {
    e.back() && await Yt();
  }
  async function Ie() {
    e.forward() && await Yt();
  }
  function Se(_) {
    e.setLens(_), s(), ve(), _ === "recall" && ce(() => tt.value?.focus()), _ === "changes" && Ne(), _ === "lanes" && !I.value.length && z();
  }
  async function Ce() {
    if (clearTimeout(V), !H.value.trim() || !Z.value) {
      T.value = [];
      return;
    }
    A.value = !0;
    try {
      T.value = await n.value.search(Z.value, H.value.trim(), st.value), D.value = "";
    } catch (_) {
      D.value = _ instanceof Error ? _.message : "Search failed.", T.value = [];
    } finally {
      A.value = !1;
    }
  }
  function on() {
    clearTimeout(V), V = setTimeout(Ce, 320);
  }
  async function sn(_) {
    C.value = _, mt.value.has(_) || await Ae(_);
  }
  async function Ne() {
    if (!(N.value.length || Q.value || !Z.value)) {
      Q.value = !0;
      try {
        N.value = await n.value.timeline(Z.value), D.value = "";
      } catch (_) {
        D.value = _ instanceof Error ? _.message : "Timeline failed.";
      } finally {
        Q.value = !1;
      }
    }
  }
  async function se() {
    if (!(!t.value || W.value || c.value.running))
      try {
        await Promise.all([
          ne(),
          zt(!0),
          R(),
          M(),
          z(),
          n.value.health().then((_) => {
            p.value = _;
          }),
          re()
        ]), Rt();
      } catch {
      }
  }
  async function re() {
    if (!Z.value) return;
    const _ = await n.value.assembly(Z.value);
    at.value = _, E.value = Ge(_);
  }
  function ie() {
    clearTimeout(ct), ct = setTimeout(async () => {
      if (!t.value || !Z.value) return;
      const _ = await n.value.assembly(Z.value);
      if (at.value = _, Ge(_)) {
        ie();
        return;
      }
      E.value = !1, await zt(!0), await ne();
    }, 1200);
  }
  async function rn() {
    if (!(!Z.value || E.value)) {
      E.value = !0;
      try {
        at.value = await n.value.assemble(Z.value), D.value = "", ie();
      } catch (_) {
        E.value = !1, D.value = _ instanceof Error ? _.message : "Couldn’t recompute this map.";
      }
    }
  }
  function an(_) {
    const F = mt.value.get(_);
    return F ? ft.value.filter((Y) => (Y.parent_id || "") === (F.parent_id || "")).sort((Y, lt) => Y.label.localeCompare(lt.label)) : [];
  }
  function Jt(_) {
    const F = C.value || ft.value[0]?.id || "", Y = mt.value.get(F);
    if (!Y) {
      C.value = ft.value[0]?.id || "";
      return;
    }
    if (_ === "out") {
      Y.parent_id && mt.value.has(Y.parent_id) && (C.value = Y.parent_id);
      return;
    }
    if (_ === "in") {
      const Dt = ft.value.find((ze) => ze.parent_id === Y.id);
      Dt && (C.value = Dt.id);
      return;
    }
    const lt = an(F), rt = lt.findIndex((Dt) => Dt.id === F), Ot = _ === "next" ? rt + 1 : rt - 1;
    Ot >= 0 && Ot < lt.length && (C.value = lt[Ot].id);
  }
  function ae(_) {
    const F = [...ft.value].sort((rt, Ot) => Ot.updated_at - rt.updated_at || rt.id.localeCompare(Ot.id));
    if (!F.length) return;
    const Y = F.findIndex((rt) => rt.id === C.value), lt = Y < 0 ? 0 : Math.max(0, Math.min(F.length - 1, Y + _));
    C.value = F[lt].id;
  }
  function it(_) {
    const F = _.target;
    if (F && ["INPUT", "TEXTAREA"].includes(F.tagName)) {
      _.key === "Escape" && F.blur();
      return;
    }
    if (_.key === "/") {
      _.preventDefault(), Se("recall");
      return;
    }
    if (_.key === "Escape") {
      Fe();
      return;
    }
    if (_.key === "Enter" && C.value) {
      Ae(C.value);
      return;
    }
    if (_.altKey && _.key === "ArrowLeft") {
      _.preventDefault(), Be();
      return;
    }
    if (_.altKey && _.key === "ArrowRight") {
      _.preventDefault(), Ie();
      return;
    }
    if (_.key === "[") {
      _.preventDefault(), ae(-1);
      return;
    }
    if (_.key === "]") {
      _.preventDefault(), ae(1);
      return;
    }
    if (o.value.lens !== "outline") {
      if (_.key === "ArrowLeft") {
        _.preventDefault(), Jt("prev");
        return;
      }
      if (_.key === "ArrowRight") {
        _.preventDefault(), Jt("next");
        return;
      }
      if (_.key === "ArrowUp") {
        _.preventDefault(), Jt("out");
        return;
      }
      if (_.key === "ArrowDown") {
        _.preventDefault(), Jt("in");
        return;
      }
    }
    !_.metaKey && !_.ctrlKey && !_.altKey && ao[_.key] && (_.preventDefault(), Se(ao[_.key]));
  }
  function P(_) {
    e.rememberViewport(_), r.value = { ...r.value, ..._ };
  }
  return yt(H, on), yt(st, () => {
    H.value.trim() && Ce();
  }), yt(t, () => {
    dt();
  }), yt(C, (_) => {
    _ && P({ selectedId: _ });
  }), Ze(() => {
    vt.push(Nn(je(), () => {
      se();
    })), vt.push(Nn(Me(), () => {
      se();
    })), ut = setInterval(se, 15e3), ht = setInterval(() => {
      J.value = Math.floor(Date.now() / 1e3);
    }, 3e4), window.addEventListener("keydown", it);
  }), We(() => {
    clearTimeout(V), clearTimeout(ct), ut && clearInterval(ut), ht && clearInterval(ht);
    for (const _ of vt) _();
    window.removeEventListener("keydown", it), At();
  }), {
    navigation: e,
    place: o,
    lens: Ft,
    focus: ot,
    graphId: Z,
    focusRecord: Xt,
    graphs: u,
    graphWindow: a,
    health: p,
    cursors: m,
    spans: h,
    spanCounts: x,
    workControl: j,
    tasks: b,
    taskHasMore: f,
    events: g,
    buckets: I,
    bucketWidthS: S,
    stats: L,
    selectedId: C,
    loading: W,
    error: D,
    query: H,
    searchMode: st,
    searchResults: T,
    searchLoading: A,
    timeline: N,
    timelineLoading: Q,
    searchInput: tt,
    clock: J,
    activeGraph: Lt,
    nodes: ft,
    edges: Mt,
    nodeById: mt,
    selectedNode: St,
    presence: Tt,
    touchedIds: Ct,
    foldedCount: te,
    activeCount: he,
    maxDepth: $e,
    outsideWindow: Nt,
    wholeLoad: c,
    recordActivity: fe,
    assembly: at,
    assembling: E,
    recomputeMap: rn,
    viewport: r,
    rememberViewport: P,
    healthLabel: pe,
    loadAll: dt,
    refresh: se,
    selectGraph: oe,
    selectNode: en,
    descend: Ae,
    ascend: Fe,
    toCrumb: Kt,
    back: Be,
    forward: Ie,
    changeLens: Se,
    runSearch: Ce,
    openSearchResult: sn,
    openTimeline: Ne,
    jumpToRecord: nn,
    labelIndex: $,
    walk: Jt,
    stepFact: ae,
    loadWholeGraphNow: Et,
    cancelWholeGraph: At,
    canBack: O(() => (o.value, e.canBack)),
    canForward: O(() => (o.value, e.canForward))
  };
}
const Ld = {
  key: 0,
  class: "jr-boot"
}, Td = {
  key: 1,
  class: "jr-boot error"
}, Rd = { class: "jr-boot-mark" }, Od = { class: "jr-toolbar" }, Dd = ["title"], Pd = { class: "jr-kind-tag" }, Wd = { class: "jr-numeric" }, Fd = {
  key: 0,
  class: "jr-searchbox"
}, Bd = { class: "jr-searchbox-mode" }, zd = {
  class: "jr-lens-switch",
  "aria-label": "Journal lens"
}, Yd = ["aria-label", "title", "onClick"], qd = ["disabled"], Ud = {
  key: 2,
  class: "jr-toolbar-spinner",
  "aria-label": "Refreshing"
}, Xd = {
  key: 0,
  class: "jr-error",
  role: "status"
}, Hd = ["aria-label"], Gd = { class: "jr-lens-meta" }, Kd = { class: "jr-lens-facts" }, Jd = { class: "jr-numeric" }, Vd = { class: "jr-numeric" }, Zd = { class: "jr-numeric" }, Qd = { class: "jr-numeric" }, th = {
  key: 1,
  class: "jr-nav-drawer",
  "aria-label": "Journal navigator"
}, eh = { class: "jr-drawer-head" }, nh = {
  key: 2,
  class: "jr-orbit-drawer",
  "aria-label": "Record orbit"
}, oh = /* @__PURE__ */ $t({
  __name: "JournalApp",
  setup(t) {
    const n = Oo(), e = O(() => n.value?.entryId || ""), o = O(() => (n.value?.mode || "preview") === "preview"), s = O(() => !o.value && !n.value?.readOnly), r = B(!o.value), u = B(!1), a = B(!1), d = B(400), l = B(null), c = B(null);
    let p = null;
    const {
      lens: m,
      focus: h,
      graphId: j,
      graphs: x,
      health: b,
      cursors: g,
      spans: f,
      spanCounts: I,
      workControl: S,
      tasks: $,
      events: L,
      buckets: C,
      bucketWidthS: W,
      stats: D,
      taskHasMore: H,
      selectedId: st,
      loading: T,
      error: A,
      query: N,
      searchMode: Q,
      searchResults: at,
      searchLoading: E,
      timeline: tt,
      searchInput: J,
      clock: V,
      activeGraph: ht,
      nodes: ut,
      edges: ct,
      nodeById: pt,
      selectedNode: gt,
      presence: vt,
      touchedIds: Ft,
      foldedCount: ot,
      activeCount: Z,
      maxDepth: Xt,
      outsideWindow: Lt,
      wholeLoad: ft,
      recordActivity: Mt,
      assembly: mt,
      assembling: St,
      recomputeMap: Tt,
      healthLabel: Ct,
      loadAll: te,
      selectGraph: he,
      selectNode: fe,
      descend: Nt,
      ascend: $e,
      toCrumb: je,
      back: Me,
      forward: pe,
      changeLens: Rt,
      runSearch: ee,
      openSearchResult: ne,
      canBack: ge,
      canForward: zt,
      loadWholeGraphNow: R,
      cancelWholeGraph: M,
      jumpToRecord: z,
      labelIndex: dt,
      viewport: Et,
      rememberViewport: At
    } = Ed(e);
    function oe() {
      s.value && Tt();
    }
    Do(te);
    const en = O(() => String(ht.value?.kind || "graph").replace(/[-_]+/g, " ")), ve = O(() => ({
      loaded: $.value.length,
      total: D.value.tasks || $.value.length,
      hasMore: H.value || (D.value.tasks || 0) > $.value.length
    })), Yt = {
      now: "Now",
      outline: "Outline",
      graph: "Graph",
      lanes: "Lanes",
      recall: "Recall",
      changes: "Changes"
    }, Ae = {
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
    }, Fe = ["now", "outline", "graph", "lanes", "recall", "changes"];
    function Kt(it) {
      fe(it), u.value = !0;
    }
    async function Be(it) {
      await he(it);
    }
    function Ie(it, P) {
      fe(it), c.value = {
        id: it,
        x: P.clientX,
        y: P.clientY
      };
    }
    async function Se() {
      c.value = null, await ce(), l.value?.focus();
    }
    function Ce() {
      c.value && Kt(c.value.id), c.value = null;
    }
    async function on() {
      const it = c.value?.id;
      c.value = null, it && await Nt(it);
    }
    async function sn() {
      const it = c.value?.id;
      c.value = null, it && await navigator.clipboard.writeText(`${j.value}/${it}`);
    }
    async function Ne(it) {
      await ne(it), u.value = !0;
    }
    async function se(it) {
      const P = us(it, g.value, f.value);
      if (P.kind === "node") {
        if (P.graphId && P.graphId !== j.value && await he(P.graphId), pt.value.has(P.nodeId)) {
          Kt(P.nodeId);
          return;
        }
        await z(P.nodeId);
        return;
      }
      P.kind === "task" && ie(P.taskId) || Rt("lanes");
    }
    function re(it) {
      se({ agentId: it, cursorId: it });
    }
    function ie(it) {
      const P = ut.value.find((_) => _.id === it || _.id === `task:${it}`);
      return P ? (Rt("outline"), Kt(P.id), !0) : !1;
    }
    function rn(it) {
      const P = Na(f.value, it);
      P && (P.taskId && ie(P.taskId) || P.agentId && re(P.agentId));
    }
    function an(it) {
      p = { x: it.clientX, width: d.value }, window.addEventListener("pointermove", Jt), window.addEventListener("pointerup", ae, { once: !0 });
    }
    function Jt(it) {
      p && (d.value = Math.max(320, Math.min(640, p.width + p.x - it.clientX)));
    }
    function ae() {
      p = null, window.removeEventListener("pointermove", Jt), window.removeEventListener("pointerup", ae);
    }
    return We(ae), yt(m, (it) => {
      it !== "now" && (a.value = !1);
    }), (it, P) => (w(), k("main", {
      ref_key: "rootEl",
      ref: l,
      tabindex: "-1",
      class: nt(["jr-app", { preview: o.value, "nav-open": r.value, "orbit-open": u.value }]),
      style: bt({ "--jr-orbit-width": `${d.value}px` })
    }, [
      y(T) && !y(ut).length && !y($).length ? (w(), k("div", Ld, [...P[10] || (P[10] = [
        i("span", {
          class: "jr-spinner",
          "aria-hidden": "true"
        }, null, -1),
        i("h2", null, "Opening the journal", -1),
        i("p", null, "Loading your journal entries.", -1)
      ])])) : y(A) && !y(ut).length && !y($).length ? (w(), k("div", Td, [
        i("span", Rd, [
          q(y(K), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          })
        ]),
        P[12] || (P[12] = i("h2", null, "Journal is unavailable", -1)),
        i("p", null, v(y(A)), 1),
        i("button", {
          onClick: P[0] || (P[0] = //@ts-ignore
          (..._) => y(te) && y(te)(..._))
        }, [
          q(y(K), {
            icon: "tabler:refresh",
            "aria-hidden": "true"
          }),
          P[11] || (P[11] = G(" Try again", -1))
        ])
      ])) : (w(), k(U, { key: 2 }, [
        i("header", Od, [
          i("button", {
            class: nt(["jr-nav-toggle", { active: r.value }]),
            "aria-label": "Toggle the journal navigator",
            title: "Graphs and agents",
            onClick: P[1] || (P[1] = (_) => r.value = !r.value)
          }, [
            q(y(K), {
              icon: r.value ? "tabler:layout-sidebar-left-collapse" : "tabler:layout-sidebar-left-expand",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ], 2),
          i("div", {
            class: "jr-identity",
            title: y(ht)?.description || y(ht)?.title
          }, [
            i("h1", null, v(y(ht)?.title || "Journal"), 1),
            i("p", null, [
              i("span", Pd, v(en.value), 1),
              i("span", {
                class: nt(["jr-health", y(b).status])
              }, v(y(Ct)()), 3),
              i("span", Wd, v((y(D).events || 0).toLocaleString()) + " facts", 1)
            ])
          ], 8, Dd),
          y(m) === "recall" ? (w(), k("div", Fd, [
            q(y(K), {
              icon: "tabler:search",
              "aria-hidden": "true"
            }),
            Lo(i("input", {
              ref_key: "searchInput",
              ref: J,
              "onUpdate:modelValue": P[2] || (P[2] = (_) => To(N) ? N.value = _ : null),
              placeholder: "Recall by text or meaning…",
              "aria-label": "Search this journal graph",
              onKeydown: P[3] || (P[3] = co(
                //@ts-ignore
                (..._) => y(ee) && y(ee)(..._),
                ["enter"]
              ))
            }, null, 544), [
              [Ro, y(N)]
            ]),
            i("span", Bd, v(y(Q)), 1)
          ])) : (w(), qt(Bs, {
            key: 1,
            focus: y(h),
            "can-back": y(ge),
            "can-forward": y(zt),
            onCrumb: y(je),
            onBack: y(Me),
            onForward: y(pe),
            onUp: y($e)
          }, null, 8, ["focus", "can-back", "can-forward", "onCrumb", "onBack", "onForward", "onUp"])),
          i("nav", zd, [
            (w(), k(U, null, et(Fe, (_) => i("button", {
              key: _,
              class: nt({ active: y(m) === _ }),
              "aria-label": `${Yt[_]} lens`,
              title: nn[_],
              onClick: (F) => y(Rt)(_)
            }, [
              q(y(K), {
                icon: Ae[_],
                "aria-hidden": "true"
              }, null, 8, ["icon"]),
              i("span", null, v(Yt[_]), 1)
            ], 10, Yd)), 64))
          ]),
          i("button", {
            class: nt(["jr-detail-toggle", { active: u.value }]),
            disabled: !y(gt),
            "aria-label": "Toggle the record orbit",
            title: "Record orbit",
            onClick: P[4] || (P[4] = (_) => u.value = !u.value)
          }, [
            q(y(K), {
              icon: "tabler:layout-sidebar-right-expand",
              "aria-hidden": "true"
            })
          ], 10, qd),
          y(T) ? (w(), k("span", Ud, [...P[13] || (P[13] = [
            i("span", { class: "jr-spinner" }, null, -1)
          ])])) : X("", !0)
        ]),
        y(A) ? (w(), k("div", Xd, [
          q(y(K), {
            icon: "tabler:alert-triangle",
            "aria-hidden": "true"
          }),
          G(v(y(A)) + " ", 1),
          i("button", {
            "aria-label": "Dismiss",
            title: "Dismiss",
            onClick: P[5] || (P[5] = (_) => A.value = "")
          }, [
            q(y(K), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ])) : X("", !0),
        i("section", {
          class: nt(["jr-view", { "is-graph": y(m) === "graph" }]),
          "aria-label": `${Yt[y(m)]} lens`
        }, [
          a.value ? (w(), qt(Qc, {
            key: 0,
            tasks: y($),
            now: y(V),
            "task-bound": ve.value,
            onTask: ie,
            onClose: P[6] || (P[6] = (_) => a.value = !1)
          }, null, 8, ["tasks", "now", "task-bound"])) : y(m) === "now" ? (w(), qt(zl, {
            key: 1,
            spans: y(f),
            "work-control": y(S),
            tasks: y($),
            events: y(L),
            now: y(V),
            "span-counts": y(I),
            "task-bound": ve.value,
            onTask: ie,
            onAgent: re,
            onStale: P[7] || (P[7] = (_) => a.value = !0)
          }, null, 8, ["spans", "work-control", "tasks", "events", "now", "span-counts", "task-bound"])) : y(m) === "outline" ? (w(), k(U, { key: 2 }, [
            i("div", Gd, [
              P[21] || (P[21] = i("span", { class: "jr-lens-title" }, "Outline", -1)),
              i("span", Kd, [
                i("b", Jd, v(y(Z)), 1),
                P[14] || (P[14] = G(" open ", -1)),
                P[15] || (P[15] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", Vd, v(y(ot)), 1),
                P[16] || (P[16] = G(" folded ", -1)),
                P[17] || (P[17] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", Zd, v(y(Xt)), 1),
                P[18] || (P[18] = G(" levels ", -1)),
                P[19] || (P[19] = i("i", { "aria-hidden": "true" }, null, -1)),
                i("b", Qd, v(y(ut).length.toLocaleString()), 1),
                P[20] || (P[20] = G(" records ", -1))
              ])
            ]),
            q(hc, {
              nodes: y(ut),
              edges: y(ct),
              presence: y(vt),
              "touched-ids": y(Ft),
              "selected-id": y(st),
              viewport: y(Et),
              onSelect: Kt,
              onFocus: y(Nt),
              onMenu: Ie,
              onViewport: y(At)
            }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "viewport", "onFocus", "onViewport"])
          ], 64)) : y(m) === "graph" ? (w(), qt(ka, {
            key: 3,
            nodes: y(ut),
            edges: y(ct),
            presence: y(vt),
            "touched-ids": y(Ft),
            "selected-id": y(st),
            loading: y(T),
            "omitted-nodes": y(Lt).nodes,
            "omitted-edges": y(Lt).edges,
            "read-only": !s.value,
            assembly: y(mt),
            assembling: y(St),
            whole: y(ft),
            labels: y(dt),
            activity: y(Mt),
            now: y(V),
            viewport: y(Et),
            onSelect: Kt,
            onFocus: y(Nt),
            onPort: y(z),
            onMenu: Ie,
            onRecompute: oe,
            onLoadAll: y(R),
            onCancelLoad: y(M),
            onViewport: y(At)
          }, null, 8, ["nodes", "edges", "presence", "touched-ids", "selected-id", "loading", "omitted-nodes", "omitted-edges", "read-only", "assembly", "assembling", "whole", "labels", "activity", "now", "viewport", "onFocus", "onPort", "onLoadAll", "onCancelLoad", "onViewport"])) : y(m) === "lanes" ? (w(), qt(Ja, {
            key: 4,
            spans: y(f),
            buckets: y(C),
            "bucket-width-s": y(W),
            now: y(V),
            onAgent: re,
            onSpan: rn
          }, null, 8, ["spans", "buckets", "bucket-width-s", "now"])) : y(m) === "recall" ? (w(), qt(Ic, {
            key: 5,
            results: y(at),
            query: y(N),
            mode: y(Q),
            loading: y(E),
            onSelect: Ne
          }, null, 8, ["results", "query", "mode", "loading"])) : (w(), qt(pd, {
            key: 6,
            items: y(tt),
            nodes: y(ut),
            onSelect: Ne
          }, null, 8, ["items", "nodes"]))
        ], 10, Hd),
        r.value ? (w(), k("aside", th, [
          i("header", eh, [
            i("div", null, [
              P[22] || (P[22] = i("b", null, "Journal", -1)),
              i("span", null, v(y(x).length) + " graph" + v(y(x).length === 1 ? "" : "s") + " · " + v((y(D).tasks || 0).toLocaleString()) + " task" + v(y(D).tasks === 1 ? "" : "s"), 1)
            ]),
            i("button", {
              "aria-label": "Close the navigator",
              title: "Close",
              onClick: P[8] || (P[8] = (_) => r.value = !1)
            }, [
              q(y(K), {
                icon: "tabler:x",
                "aria-hidden": "true"
              })
            ])
          ]),
          q(Qs, {
            graphs: y(x),
            "graph-id": y(j),
            now: y(V),
            onGraph: Be
          }, null, 8, ["graphs", "graph-id", "now"]),
          q(Ls, {
            cursors: y(g),
            spans: y(f),
            now: y(V),
            onAgent: se
          }, null, 8, ["cursors", "spans", "now"])
        ])) : X("", !0),
        u.value ? (w(), k("aside", nh, [
          i("button", {
            class: "jr-resize-handle",
            "aria-label": "Resize the orbit panel",
            title: "Drag to resize",
            onPointerdown: Wt(an, ["prevent"])
          }, null, 32),
          q(Uu, {
            node: y(gt),
            nodes: y(ut),
            edges: y(ct),
            presence: y(vt),
            spans: y(f),
            events: y(L),
            "graph-id": y(j),
            now: y(V),
            onSelect: Kt,
            onFocus: y(Nt),
            onClose: P[9] || (P[9] = (_) => u.value = !1)
          }, null, 8, ["node", "nodes", "edges", "presence", "spans", "events", "graph-id", "now", "onFocus"])
        ])) : X("", !0),
        c.value ? (w(), qt(_a, {
          key: 3,
          x: c.value.x,
          y: c.value.y,
          onClose: Se,
          onDetails: Ce,
          onFocus: on,
          onCopy: sn
        }, null, 8, ["x", "y"])) : X("", !0)
      ], 64))
    ], 6));
  }
}), lh = {
  rootComponent: oh
};
export {
  lh as mountConfig
};
//# sourceMappingURL=lazy-mount-DATng9HN.js.map
