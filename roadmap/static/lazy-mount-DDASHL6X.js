import { defineComponent as Z, ref as F, watch as pe, nextTick as ye, onMounted as Je, onBeforeUnmount as _e, openBlock as l, createElementBlock as d, withModifiers as V, createElementVNode as i, normalizeStyle as q, Fragment as S, renderList as N, normalizeClass as U, toDisplayString as x, createVNode as K, unref as P, createTextVNode as ie, createCommentVNode as O, withKeys as ve, computed as M, createBlock as oe } from "vue";
import { Icon as j } from "@iconify/vue";
import { a as Tt } from "./wc-runtime-CNDpK4lj.js";
import { api as ke, on as Nt } from "@wippy-fe/proxy";
const At = ["disabled", "onClick"], Lt = /* @__PURE__ */ Z({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = F(null), s = F(null), r = F({ left: "0px", top: "0px", visibility: "hidden" });
    function y() {
      const p = o.value?.getBoundingClientRect(), b = s.value?.getBoundingClientRect();
      if (!p || !b) return;
      const k = Math.max(0, Math.min(n.x - p.left, p.width - b.width)), $ = Math.max(0, Math.min(n.y - p.top, p.height - b.height));
      r.value = { left: `${k}px`, top: `${$}px`, visibility: "visible" };
    }
    pe(() => [n.x, n.y], () => {
      ye(y);
    }), Je(() => {
      ye(y), window.addEventListener("resize", y);
    }), _e(() => window.removeEventListener("resize", y));
    const f = t;
    function v(p) {
      p.action(), f("close");
    }
    return (p, b) => (l(), d("div", {
      ref_key: "layer",
      ref: o,
      class: "rm-ctx-overlay",
      onClick: b[2] || (b[2] = (k) => f("close")),
      onContextmenu: b[3] || (b[3] = V((k) => f("close"), ["prevent"]))
    }, [
      i("div", {
        ref_key: "panel",
        ref: s,
        class: "rm-ctx",
        style: q(r.value),
        onClick: b[0] || (b[0] = V(() => {
        }, ["stop"])),
        onContextmenu: b[1] || (b[1] = V(() => {
        }, ["prevent", "stop"]))
      }, [
        (l(!0), d(S, null, N(e.items, (k, $) => (l(), d("button", {
          key: $,
          class: U(["rm-ctx-item", { "rm-ctx-danger": k.danger }]),
          disabled: k.disabled,
          onClick: (D) => v(k)
        }, x(k.label), 11, At))), 128))
      ], 36)
    ], 544));
  }
}), Ot = { class: "rm-empty" }, Pt = {
  key: 0,
  class: "rm-empty-actions"
}, Rt = {
  key: 1,
  class: "rm-empty-starter"
}, zt = {
  key: 2,
  class: "rm-empty-starter"
}, Kt = /* @__PURE__ */ Z({
  __name: "EmptyState",
  props: {
    editable: { type: Boolean },
    starter: {}
  },
  emits: ["add-layer", "add-starter"],
  setup(e, { emit: t }) {
    const n = t;
    return (o, s) => (l(), d("div", Ot, [
      K(P(j), {
        class: "rm-empty-icon",
        icon: "tabler:layout-rows",
        "aria-hidden": "true"
      }),
      s[3] || (s[3] = i("h2", null, "No layers yet", -1)),
      s[4] || (s[4] = i("p", null, " A roadmap is drawn in layers — the lanes of the timeline, the strata of the build order. Add the first one, or start from a set you can rename. ", -1)),
      e.editable ? (l(), d("div", Pt, [
        i("button", {
          class: "rm-btn rm-btn--primary",
          onClick: s[0] || (s[0] = (r) => n("add-layer"))
        }, [
          K(P(j), {
            icon: "tabler:plus",
            "aria-hidden": "true"
          }),
          s[2] || (s[2] = ie("Add a layer ", -1))
        ]),
        i("button", {
          class: "rm-btn",
          onClick: s[1] || (s[1] = (r) => n("add-starter"))
        }, [
          K(P(j), {
            icon: "tabler:stack-2",
            "aria-hidden": "true"
          }),
          ie("Add " + x(e.starter.length) + " starter layers ", 1)
        ])
      ])) : O("", !0),
      e.editable ? (l(), d("p", Rt, x(e.starter.join(" · ")), 1)) : (l(), d("p", zt, "Open this roadmap in full mode to add one."))
    ]));
  }
}), Ut = ["title", "aria-label"], Ae = /* @__PURE__ */ Z({
  __name: "ConfidenceMeter",
  props: {
    confidence: {}
  },
  setup(e) {
    return (t, n) => (l(), d("span", {
      class: U(["rm-conf", `rm-conf--${e.confidence}`]),
      title: `confidence: ${e.confidence}`,
      "aria-label": `confidence ${e.confidence}`
    }, [...n[0] || (n[0] = [
      i("i", null, null, -1),
      i("i", null, null, -1),
      i("i", null, null, -1)
    ])], 10, Ut));
  }
}), Bt = ["aria-label"], Vt = {
  key: 0,
  d: "M5 1a4 4 0 0 1 0 8z"
}, Yt = {
  key: 1,
  d: "M2.5 2.5 7.5 7.5"
}, me = /* @__PURE__ */ Z({
  __name: "StatusGlyph",
  props: {
    status: {},
    color: {},
    title: {}
  },
  setup(e) {
    return (t, n) => (l(), d("svg", {
      class: U(["rm-st", `rm-st--${e.status}`]),
      viewBox: "0 0 10 10",
      style: q({ "--rm-glyph": e.color || "currentColor" }),
      role: "img",
      "aria-label": e.title || e.status
    }, [
      i("title", null, x(e.title || e.status), 1),
      n[0] || (n[0] = i("circle", {
        cx: "5",
        cy: "5",
        r: "4"
      }, null, -1)),
      e.status === "active" ? (l(), d("path", Vt)) : O("", !0),
      e.status === "dropped" ? (l(), d("path", Yt)) : O("", !0)
    ], 14, Bt));
  }
}), Ft = /^(\d{4})-Q([1-4])$/, qt = /^(\d{4})-(0[1-9]|1[0-2])$/, Ze = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
function et(e) {
  return e === "month" ? 12 : 4;
}
function Le(e, t) {
  const n = (t === "month" ? qt : Ft).exec(String(e || ""));
  return n ? { year: Number(n[1]), unit: Number(n[2]) } : null;
}
function Q(e, t) {
  const n = Le(e, t);
  return n ? n.year * et(t) + (n.unit - 1) : null;
}
function he(e, t) {
  const n = et(t), o = Math.floor(e / n), s = e - o * n + 1;
  return t === "month" ? `${o}-${String(s).padStart(2, "0")}` : `${o}-Q${s}`;
}
function Xt(e, t, n) {
  const o = Q(e, n);
  return o === null ? null : he(o + t, n);
}
function Gt(e, t, n) {
  const o = Q(e, n), s = Math.max(1, Math.floor(t) || 0);
  if (o === null) return [];
  const r = [];
  for (let y = 0; y < s; y++) r.push(he(o + y, n));
  return r;
}
function we(e, t) {
  const n = Le(e, t);
  if (!n) return e || "—";
  const o = `’${String(n.year % 100).padStart(2, "0")}`;
  return t === "month" ? `${Ze[n.unit - 1]} ${o}` : `Q${n.unit} ${o}`;
}
function Se(e, t) {
  const n = Le(e, t);
  return n ? t === "month" ? `${Ze[n.unit - 1]} ${n.year}` : `Q${n.unit} ${n.year}` : e || "—";
}
function tt(e, t, n, o = 4) {
  const s = Q(e, n);
  if (s === null) return [];
  const r = Math.max(1, Math.floor(t) || 0), y = [];
  for (let f = -o; f < r + o; f++) y.push(he(s + f, n));
  return y;
}
const Ht = { class: "rm-hz" }, Wt = ["onDrop"], jt = { class: "rm-hz-head" }, Qt = { class: "rm-hz-group" }, Jt = ["draggable", "onDragstart", "onClick", "onKeydown", "onContextmenu"], Zt = { class: "rm-card-title" }, en = { class: "rm-card-meta" }, tn = { class: "rm-lchip" }, nn = { class: "rm-size" }, on = {
  key: 0,
  class: "rm-card-period"
}, sn = {
  key: 0,
  class: "rm-hz-empty"
}, rn = /* @__PURE__ */ Z({
  __name: "HorizonsLens",
  props: {
    columns: {},
    periodKind: {},
    selectedId: {},
    trace: {},
    editable: { type: Boolean }
  },
  emits: ["select", "schedule", "context"],
  setup(e, { emit: t }) {
    const n = e, o = t;
    function s(v) {
      return n.trace.selected ? {
        "is-sel": v === n.trace.selected,
        "is-need": n.trace.needs.has(v),
        "is-unlock": n.trace.unlocks.has(v),
        "is-dim": !n.trace.chain.has(v)
      } : {};
    }
    function r(v, p) {
      n.editable && (v.dataTransfer?.setData("text/plain", p.id), v.dataTransfer && (v.dataTransfer.effectAllowed = "move"));
    }
    function y(v, p) {
      if (!n.editable) return;
      const b = v.dataTransfer?.getData("text/plain") || "";
      b && o("schedule", b, p);
    }
    function f(v) {
      return { "--rm-layer": v.color || "var(--rm-accent)" };
    }
    return (v, p) => (l(), d("div", Ht, [
      (l(!0), d(S, null, N(e.columns, (b) => (l(), d("section", {
        key: b.horizon,
        class: U(["rm-hz-col", { "is-droppable": e.editable }]),
        onDragover: p[0] || (p[0] = V(() => {
        }, ["prevent"])),
        onDrop: V((k) => y(k, b.horizon), ["prevent"])
      }, [
        i("header", jt, [
          i("b", null, x(b.title), 1),
          i("span", null, x(b.hint), 1),
          i("em", null, x(b.count), 1)
        ]),
        (l(!0), d(S, null, N(b.groups, (k) => (l(), d(S, {
          key: k.layer.id
        }, [
          i("div", Qt, x(k.layer.title), 1),
          (l(!0), d(S, null, N(k.initiatives, ($) => (l(), d("article", {
            key: $.id,
            class: U(["rm-card", [s($.id), { "rm-card--low": $.confidence === "low" }]]),
            style: q(f(k.layer)),
            role: "button",
            tabindex: "0",
            draggable: e.editable,
            onDragstart: (D) => r(D, $),
            onClick: (D) => o("select", "initiative", $.id),
            onKeydown: [
              ve(V((D) => o("select", "initiative", $.id), ["prevent"]), ["enter"]),
              ve(V((D) => o("select", "initiative", $.id), ["prevent"]), ["space"])
            ],
            onContextmenu: V((D) => o("context", D, "initiative", $.id), ["prevent"])
          }, [
            i("div", Zt, [
              K(me, {
                status: $.status,
                color: k.layer.color
              }, null, 8, ["status", "color"]),
              i("span", null, x($.title), 1)
            ]),
            i("div", en, [
              i("span", tn, [
                i("i", {
                  class: "rm-dot",
                  style: q({ "--rm-dot-color": k.layer.color || "var(--rm-accent)" })
                }, null, 4),
                ie(x(k.layer.title), 1)
              ]),
              i("span", nn, x($.size), 1),
              K(Ae, {
                confidence: $.confidence
              }, null, 8, ["confidence"]),
              $.start_period ? (l(), d("span", on, x(P(we)($.start_period, e.periodKind)), 1)) : O("", !0)
            ])
          ], 46, Jt))), 128))
        ], 64))), 128)),
        b.groups.length ? O("", !0) : (l(), d("p", sn, "Nothing here."))
      ], 42, Wt))), 128))
    ]));
  }
}), ln = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
], nt = ["idea", "planned", "active", "done", "dropped"], an = ["low", "med", "high"], dn = ["S", "M", "L", "XL"], un = ["requires", "informs"], Te = ["timeline", "horizons", "strata", "outcomes"], Y = {
  LAYER_ADDED: "chestor.roadmap.events:layer.added",
  LAYER_UPDATED: "chestor.roadmap.events:layer.updated",
  LAYER_REMOVED: "chestor.roadmap.events:layer.removed",
  OUTCOME_ADDED: "chestor.roadmap.events:outcome.added",
  OUTCOME_UPDATED: "chestor.roadmap.events:outcome.updated",
  OUTCOME_REMOVED: "chestor.roadmap.events:outcome.removed",
  INITIATIVE_ADDED: "chestor.roadmap.events:initiative.added",
  INITIATIVE_UPDATED: "chestor.roadmap.events:initiative.updated",
  INITIATIVE_REMOVED: "chestor.roadmap.events:initiative.removed",
  DEPENDENCY_ADDED: "chestor.roadmap.events:dependency.added",
  DEPENDENCY_UPDATED: "chestor.roadmap.events:dependency.updated",
  DEPENDENCY_REMOVED: "chestor.roadmap.events:dependency.removed",
  MILESTONE_ADDED: "chestor.roadmap.events:milestone.added",
  MILESTONE_UPDATED: "chestor.roadmap.events:milestone.updated",
  MILESTONE_REMOVED: "chestor.roadmap.events:milestone.removed",
  SETTINGS_UPDATED: "chestor.roadmap.events:roadmap.settings-updated",
  LENS_STATE_SET: "chestor.roadmap.events:roadmap.lens-state-set"
}, cn = "chestor.roadmap:state", Fe = {
  period_kind: "quarter",
  origin: "",
  columns: 5,
  default_lens: "timeline",
  lens_state: {}
}, vn = { class: "rm-form" }, mn = { class: "rm-field" }, fn = ["value", "disabled"], pn = { class: "rm-field" }, yn = ["value", "disabled"], hn = { class: "rm-field-row" }, bn = { class: "rm-field" }, gn = ["value", "disabled"], kn = ["value"], $n = { class: "rm-field" }, _n = ["value", "disabled"], wn = ["value"], En = { class: "rm-field-row" }, Cn = { class: "rm-field" }, xn = ["value", "disabled"], In = ["value"], Dn = { class: "rm-field" }, Mn = ["value", "disabled"], Sn = ["value"], Tn = { class: "rm-field" }, Nn = ["value", "disabled"], An = ["value"], Ln = { class: "rm-field-row" }, On = { class: "rm-field" }, Pn = ["value", "disabled"], Rn = ["value"], zn = { class: "rm-field rm-field--narrow" }, Kn = ["value", "disabled"], Un = { class: "rm-field" }, Bn = { class: "rm-field-value" }, Vn = ["value", "disabled"], Yn = { class: "rm-field-row" }, Fn = { class: "rm-field" }, qn = ["value", "disabled"], Xn = { class: "rm-field" }, Gn = ["value", "disabled"], Hn = { class: "rm-chain" }, Wn = {
  key: 0,
  class: "rm-chain-empty"
}, jn = ["onClick"], Qn = {
  key: 1,
  class: "rm-chain-empty"
}, Jn = ["onClick"], Zn = /* @__PURE__ */ Z({
  __name: "InitiativeForm",
  props: {
    state: {},
    initiative: {},
    trace: {},
    editable: { type: Boolean }
  },
  emits: ["patch", "select"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = M(() => n.state.settings.period_kind), r = M(() => tt(n.state.settings.origin, n.state.settings.columns, s.value)), y = M(() => n.state.layers), f = M(() => n.state.outcomes);
    function v(B) {
      return n.state.initiatives.find((h) => h.id === B)?.title || "Unavailable initiative";
    }
    const p = M(() => [...n.trace.needs]), b = M(() => [...n.trace.unlocks]);
    function k(B, h) {
      o("patch", { [h]: B.target.value });
    }
    function $(B, h) {
      o("patch", { [h]: B.target.value });
    }
    function D(B) {
      const h = Math.max(1, Math.round(Number(B.target.value) || 1));
      o("patch", { span: h });
    }
    function R(B) {
      const h = Math.min(1, Math.max(0, Number(B.target.value) / 100));
      o("patch", { progress: h });
    }
    function z(B) {
      const h = B.target.value;
      o("patch", { tags: h.split(",").map((w) => w.trim()).filter(Boolean) });
    }
    return (B, h) => (l(), d("div", vn, [
      i("label", mn, [
        h[9] || (h[9] = i("span", null, "Title", -1)),
        i("input", {
          class: "rm-input",
          type: "text",
          value: e.initiative.title,
          disabled: !e.editable,
          onChange: h[0] || (h[0] = (w) => k(w, "title"))
        }, null, 40, fn)
      ]),
      i("label", pn, [
        h[10] || (h[10] = i("span", null, "Description", -1)),
        i("textarea", {
          class: "rm-input rm-input--area",
          rows: "3",
          value: e.initiative.description,
          disabled: !e.editable,
          onChange: h[1] || (h[1] = (w) => k(w, "description"))
        }, null, 40, yn)
      ]),
      i("div", hn, [
        i("label", bn, [
          h[11] || (h[11] = i("span", null, "Layer", -1)),
          i("select", {
            class: "rm-input",
            value: e.initiative.layer_id,
            disabled: !e.editable,
            onChange: h[2] || (h[2] = (w) => $(w, "layer_id"))
          }, [
            (l(!0), d(S, null, N(y.value, (w) => (l(), d("option", {
              key: w.id,
              value: w.id
            }, x(w.title), 9, kn))), 128))
          ], 40, gn)
        ]),
        i("label", $n, [
          h[13] || (h[13] = i("span", null, "Outcome", -1)),
          i("select", {
            class: "rm-input",
            value: e.initiative.outcome_id,
            disabled: !e.editable,
            onChange: h[3] || (h[3] = (w) => $(w, "outcome_id"))
          }, [
            h[12] || (h[12] = i("option", { value: "" }, "— none —", -1)),
            (l(!0), d(S, null, N(f.value, (w) => (l(), d("option", {
              key: w.id,
              value: w.id
            }, x(w.title), 9, wn))), 128))
          ], 40, _n)
        ])
      ]),
      i("div", En, [
        i("label", Cn, [
          h[14] || (h[14] = i("span", null, "Status", -1)),
          i("select", {
            class: "rm-input",
            value: e.initiative.status,
            disabled: !e.editable,
            onChange: h[4] || (h[4] = (w) => $(w, "status"))
          }, [
            (l(!0), d(S, null, N(P(nt), (w) => (l(), d("option", {
              key: w,
              value: w
            }, x(w), 9, In))), 128))
          ], 40, xn)
        ]),
        i("label", Dn, [
          h[15] || (h[15] = i("span", null, "Size", -1)),
          i("select", {
            class: "rm-input",
            value: e.initiative.size,
            disabled: !e.editable,
            onChange: h[5] || (h[5] = (w) => $(w, "size"))
          }, [
            (l(!0), d(S, null, N(P(dn), (w) => (l(), d("option", {
              key: w,
              value: w
            }, x(w), 9, Sn))), 128))
          ], 40, Mn)
        ])
      ]),
      i("label", Tn, [
        i("span", null, [
          h[16] || (h[16] = ie("Confidence ", -1)),
          K(Ae, {
            confidence: e.initiative.confidence
          }, null, 8, ["confidence"])
        ]),
        i("select", {
          class: "rm-input",
          value: e.initiative.confidence,
          disabled: !e.editable,
          onChange: h[6] || (h[6] = (w) => $(w, "confidence"))
        }, [
          (l(!0), d(S, null, N(P(an), (w) => (l(), d("option", {
            key: w,
            value: w
          }, x(w), 9, An))), 128))
        ], 40, Nn)
      ]),
      i("div", Ln, [
        i("label", On, [
          h[18] || (h[18] = i("span", null, "Start", -1)),
          i("select", {
            class: "rm-input",
            value: e.initiative.start_period,
            disabled: !e.editable,
            onChange: h[7] || (h[7] = (w) => $(w, "start_period"))
          }, [
            h[17] || (h[17] = i("option", { value: "" }, "— unscheduled —", -1)),
            (l(!0), d(S, null, N(r.value, (w) => (l(), d("option", {
              key: w,
              value: w
            }, x(P(Se)(w, s.value)), 9, Rn))), 128))
          ], 40, Pn)
        ]),
        i("label", zn, [
          h[19] || (h[19] = i("span", null, "Span", -1)),
          i("input", {
            class: "rm-input",
            type: "number",
            min: "1",
            value: e.initiative.span,
            disabled: !e.editable,
            onChange: D
          }, null, 40, Kn)
        ])
      ]),
      i("label", Un, [
        i("span", null, [
          h[20] || (h[20] = ie("Progress ", -1)),
          i("em", Bn, x(Math.round((e.initiative.progress || 0) * 100)) + "%", 1)
        ]),
        i("input", {
          class: "rm-range",
          type: "range",
          min: "0",
          max: "100",
          step: "5",
          value: Math.round((e.initiative.progress || 0) * 100),
          disabled: !e.editable || e.initiative.status === "done",
          onChange: R
        }, null, 40, Vn)
      ]),
      i("div", Yn, [
        i("label", Fn, [
          h[21] || (h[21] = i("span", null, "Owner", -1)),
          i("input", {
            class: "rm-input",
            type: "text",
            value: e.initiative.owner,
            disabled: !e.editable,
            onChange: h[8] || (h[8] = (w) => k(w, "owner"))
          }, null, 40, qn)
        ]),
        i("label", Xn, [
          h[22] || (h[22] = i("span", null, "Tags", -1)),
          i("input", {
            class: "rm-input",
            type: "text",
            value: e.initiative.tags.join(", "),
            disabled: !e.editable,
            onChange: z
          }, null, 40, Gn)
        ])
      ]),
      i("section", Hn, [
        h[23] || (h[23] = i("h4", null, "Needs", -1)),
        p.value.length ? O("", !0) : (l(), d("p", Wn, "Nothing — this can start on its own.")),
        (l(!0), d(S, null, N(p.value, (w) => (l(), d("button", {
          key: w,
          class: "rm-chain-row",
          onClick: (T) => o("select", "initiative", w)
        }, x(v(w)), 9, jn))), 128)),
        h[24] || (h[24] = i("h4", null, "Unlocks", -1)),
        b.value.length ? O("", !0) : (l(), d("p", Qn, "Nothing depends on this yet.")),
        (l(!0), d(S, null, N(b.value, (w) => (l(), d("button", {
          key: w,
          class: "rm-chain-row",
          onClick: (T) => o("select", "initiative", w)
        }, x(v(w)), 9, Jn))), 128))
      ])
    ]));
  }
}), ei = { class: "rm-legend" }, ti = { key: 0 }, ni = /* @__PURE__ */ Z({
  __name: "Legend",
  props: {
    layers: {}
  },
  setup(e) {
    const t = {
      idea: "Idea — not a promise",
      planned: "Planned",
      active: "In progress",
      done: "Shipped",
      dropped: "Dropped"
    };
    return (n, o) => (l(), d("div", ei, [
      e.layers.length ? (l(), d("section", ti, [
        o[0] || (o[0] = i("h4", null, "Layers", -1)),
        (l(!0), d(S, null, N(e.layers, (s) => (l(), d("div", {
          key: s.id,
          class: "rm-legend-row"
        }, [
          i("i", {
            class: "rm-dot",
            style: q({ "--rm-dot-color": s.color || "var(--rm-accent)" })
          }, null, 4),
          i("span", null, x(s.title), 1)
        ]))), 128))
      ])) : O("", !0),
      i("section", null, [
        o[1] || (o[1] = i("h4", null, "Status", -1)),
        (l(!0), d(S, null, N(P(nt), (s) => (l(), d("div", {
          key: s,
          class: "rm-legend-row"
        }, [
          K(me, { status: s }, null, 8, ["status"]),
          i("span", null, x(t[s]), 1)
        ]))), 128)),
        o[2] || (o[2] = i("div", { class: "rm-legend-row" }, [
          i("i", { class: "rm-swatch rm-swatch--low" }),
          i("span", null, "Low confidence")
        ], -1))
      ]),
      o[3] || (o[3] = i("p", { class: "rm-legend-hint" }, "Select an initiative to trace what it needs and what it unlocks across every lens.", -1))
    ]));
  }
}), ii = { class: "rm-panel" }, oi = { class: "rm-panel-head" }, si = {
  key: 0,
  class: "rm-suggest"
}, ri = { class: "rm-suggest-actions" }, li = ["disabled"], ai = { class: "rm-panel-body" }, di = {
  key: 1,
  class: "rm-form"
}, ui = { class: "rm-field" }, ci = ["value", "disabled"], vi = { class: "rm-field" }, mi = ["value", "disabled"], fi = { class: "rm-field-row" }, pi = { class: "rm-field" }, yi = ["value", "disabled"], hi = ["value"], bi = { class: "rm-field rm-field--narrow" }, gi = ["value", "disabled"], ki = {
  key: 2,
  class: "rm-form"
}, $i = { class: "rm-field" }, _i = ["value", "disabled"], wi = { class: "rm-field" }, Ei = ["value", "disabled"], Ci = { class: "rm-field rm-field--narrow" }, xi = ["value", "disabled"], Ii = {
  key: 3,
  class: "rm-form"
}, Di = { class: "rm-field" }, Mi = ["value", "disabled"], Si = { class: "rm-field" }, Ti = ["value", "disabled"], Ni = { class: "rm-field-row" }, Ai = { class: "rm-field" }, Li = ["value", "disabled"], Oi = ["value"], Pi = { class: "rm-field" }, Ri = ["value", "disabled"], zi = ["value"], Ki = {
  key: 0,
  class: "rm-chain"
}, Ui = ["onClick"], Bi = {
  key: 4,
  class: "rm-form"
}, Vi = { class: "rm-dep" }, Yi = { class: "rm-field" }, Fi = ["value", "disabled"], qi = ["value"], Xi = { class: "rm-field" }, Gi = ["value", "disabled"], Hi = {
  key: 1,
  class: "rm-panel-foot"
}, Wi = /* @__PURE__ */ Z({
  __name: "Inspector",
  props: {
    state: {},
    selection: {},
    trace: {},
    editable: { type: Boolean },
    suggestion: {}
  },
  emits: ["patch", "remove", "select", "apply-suggestion", "dismiss-suggestion", "close"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = M(() => n.state.settings.period_kind), r = M(() => tt(n.state.settings.origin, n.state.settings.columns, s.value)), y = M(() => n.selection?.kind === "initiative" && n.state.initiatives.find((T) => T.id === n.selection?.id) || null), f = M(() => n.selection?.kind === "layer" && n.state.layers.find((T) => T.id === n.selection?.id) || null), v = M(() => n.selection?.kind === "outcome" && n.state.outcomes.find((T) => T.id === n.selection?.id) || null), p = M(() => n.selection?.kind === "milestone" && n.state.milestones.find((T) => T.id === n.selection?.id) || null), b = M(() => n.selection?.kind === "dependency" && n.state.dependencies.find((T) => T.id === n.selection?.id) || null), k = {
      initiative: "Initiative",
      dependency: "Dependency",
      milestone: "Milestone",
      layer: "Layer",
      outcome: "Outcome"
    }, $ = M(() => n.selection ? k[n.selection.kind] : "Roadmap");
    function D(T) {
      return n.state.initiatives.find((m) => m.id === T)?.title || "Initiative outside this view";
    }
    function R(T) {
      n.selection && o("patch", n.selection.kind, n.selection.id, T);
    }
    function z(T, m) {
      R({ [m]: T.target.value });
    }
    function B(T, m) {
      R({ [m]: T.target.value });
    }
    function h(T) {
      R({ sort_order: Math.round(Number(T.target.value) || 0) });
    }
    const w = M(() => {
      const T = n.suggestion;
      return T ? `Move to ${T.horizon} by starting in ${Se(T.period, s.value)}.` : "";
    });
    return (T, m) => (l(), d("aside", ii, [
      i("header", oi, [
        i("h3", null, x($.value), 1),
        i("button", {
          class: "rm-icon-btn",
          title: "Close panel",
          "aria-label": "Close panel",
          onClick: m[0] || (m[0] = (_) => o("close"))
        }, [
          K(P(j), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ]),
      e.suggestion ? (l(), d("div", si, [
        i("p", null, x(w.value), 1),
        i("div", ri, [
          i("button", {
            class: "rm-btn rm-btn--primary rm-btn--mini",
            disabled: !e.editable,
            onClick: m[1] || (m[1] = (_) => o("apply-suggestion"))
          }, "Set start", 8, li),
          i("button", {
            class: "rm-btn rm-btn--mini",
            onClick: m[2] || (m[2] = (_) => o("dismiss-suggestion"))
          }, "Keep as is")
        ])
      ])) : O("", !0),
      i("div", ai, [
        y.value ? (l(), oe(Zn, {
          key: 0,
          state: e.state,
          initiative: y.value,
          trace: e.trace,
          editable: e.editable,
          onPatch: R,
          onSelect: m[3] || (m[3] = (_, ee) => o("select", _, ee))
        }, null, 8, ["state", "initiative", "trace", "editable"])) : f.value ? (l(), d("div", di, [
          i("label", ui, [
            m[18] || (m[18] = i("span", null, "Title", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: f.value.title,
              disabled: !e.editable,
              onChange: m[4] || (m[4] = (_) => z(_, "title"))
            }, null, 40, ci)
          ]),
          i("label", vi, [
            m[19] || (m[19] = i("span", null, "Description", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: f.value.description,
              disabled: !e.editable,
              onChange: m[5] || (m[5] = (_) => z(_, "description"))
            }, null, 40, mi)
          ]),
          i("div", fi, [
            i("label", pi, [
              m[20] || (m[20] = i("span", null, "Colour", -1)),
              i("select", {
                class: "rm-input",
                value: f.value.color || "var(--p-text-muted-color)",
                disabled: !e.editable,
                onChange: m[6] || (m[6] = (_) => B(_, "color"))
              }, [
                (l(!0), d(S, null, N(P(ln), (_) => (l(), d("option", {
                  key: _.value,
                  value: _.value
                }, x(_.label), 9, hi))), 128))
              ], 40, yi)
            ]),
            i("label", bi, [
              m[21] || (m[21] = i("span", null, "Order", -1)),
              i("input", {
                class: "rm-input",
                type: "number",
                value: f.value.sort_order,
                disabled: !e.editable,
                onChange: h
              }, null, 40, gi)
            ])
          ]),
          m[22] || (m[22] = i("p", { class: "rm-note" }, "Order runs bottom to top: the foundation is 0.", -1))
        ])) : v.value ? (l(), d("div", ki, [
          i("label", $i, [
            m[23] || (m[23] = i("span", null, "Title", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: v.value.title,
              disabled: !e.editable,
              onChange: m[7] || (m[7] = (_) => z(_, "title"))
            }, null, 40, _i)
          ]),
          i("label", wi, [
            m[24] || (m[24] = i("span", null, "Why it exists", -1)),
            i("textarea", {
              class: "rm-input rm-input--area",
              rows: "3",
              value: v.value.description,
              disabled: !e.editable,
              onChange: m[8] || (m[8] = (_) => z(_, "description"))
            }, null, 40, Ei)
          ]),
          i("label", Ci, [
            m[25] || (m[25] = i("span", null, "Order", -1)),
            i("input", {
              class: "rm-input",
              type: "number",
              value: v.value.sort_order,
              disabled: !e.editable,
              onChange: h
            }, null, 40, xi)
          ])
        ])) : p.value ? (l(), d("div", Ii, [
          i("label", Di, [
            m[26] || (m[26] = i("span", null, "Title", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: p.value.title,
              disabled: !e.editable,
              onChange: m[9] || (m[9] = (_) => z(_, "title"))
            }, null, 40, Mi)
          ]),
          i("label", Si, [
            m[27] || (m[27] = i("span", null, "Description", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: p.value.description,
              disabled: !e.editable,
              onChange: m[10] || (m[10] = (_) => z(_, "description"))
            }, null, 40, Ti)
          ]),
          i("div", Ni, [
            i("label", Ai, [
              m[28] || (m[28] = i("span", null, "Period", -1)),
              i("select", {
                class: "rm-input",
                value: p.value.period,
                disabled: !e.editable,
                onChange: m[11] || (m[11] = (_) => B(_, "period"))
              }, [
                (l(!0), d(S, null, N(r.value, (_) => (l(), d("option", {
                  key: _,
                  value: _
                }, x(P(Se)(_, s.value)), 9, Oi))), 128))
              ], 40, Li)
            ]),
            i("label", Pi, [
              m[30] || (m[30] = i("span", null, "Layer", -1)),
              i("select", {
                class: "rm-input",
                value: p.value.layer_id,
                disabled: !e.editable,
                onChange: m[12] || (m[12] = (_) => B(_, "layer_id"))
              }, [
                m[29] || (m[29] = i("option", { value: "" }, "— all layers —", -1)),
                (l(!0), d(S, null, N(e.state.layers, (_) => (l(), d("option", {
                  key: _.id,
                  value: _.id
                }, x(_.title), 9, zi))), 128))
              ], 40, Ri)
            ])
          ]),
          p.value.initiative_ids.length ? (l(), d("section", Ki, [
            m[31] || (m[31] = i("h4", null, "Marks", -1)),
            (l(!0), d(S, null, N(p.value.initiative_ids, (_) => (l(), d("button", {
              key: _,
              class: "rm-chain-row",
              onClick: (ee) => o("select", "initiative", _)
            }, x(D(_)), 9, Ui))), 128))
          ])) : O("", !0)
        ])) : b.value ? (l(), d("div", Bi, [
          i("div", Vi, [
            i("button", {
              class: "rm-chain-row",
              onClick: m[13] || (m[13] = (_) => o("select", "initiative", b.value.from_id))
            }, x(D(b.value.from_id)), 1),
            m[32] || (m[32] = i("span", { class: "rm-dep-arrow" }, "unlocks", -1)),
            i("button", {
              class: "rm-chain-row",
              onClick: m[14] || (m[14] = (_) => o("select", "initiative", b.value.to_id))
            }, x(D(b.value.to_id)), 1)
          ]),
          i("label", Yi, [
            m[33] || (m[33] = i("span", null, "Kind", -1)),
            i("select", {
              class: "rm-input",
              value: b.value.kind,
              disabled: !e.editable,
              onChange: m[15] || (m[15] = (_) => B(_, "kind"))
            }, [
              (l(!0), d(S, null, N(P(un), (_) => (l(), d("option", {
                key: _,
                value: _
              }, x(_), 9, qi))), 128))
            ], 40, Fi)
          ]),
          i("label", Xi, [
            m[34] || (m[34] = i("span", null, "Note", -1)),
            i("input", {
              class: "rm-input",
              type: "text",
              value: b.value.note,
              disabled: !e.editable,
              onChange: m[16] || (m[16] = (_) => z(_, "note"))
            }, null, 40, Gi)
          ]),
          m[35] || (m[35] = i("p", { class: "rm-note" }, "Only a requires edge sits on the critical path; informs is advisory.", -1))
        ])) : (l(), oe(ni, {
          key: 5,
          layers: e.state.layers
        }, null, 8, ["layers"]))
      ]),
      e.selection && e.editable ? (l(), d("footer", Hi, [
        i("button", {
          class: "rm-btn rm-btn--danger",
          onClick: m[17] || (m[17] = (_) => o("remove", e.selection.kind, e.selection.id))
        }, [
          K(P(j), {
            icon: "tabler:trash",
            "aria-hidden": "true"
          }),
          ie("Remove " + x($.value.toLowerCase()), 1)
        ])
      ])) : O("", !0)
    ]));
  }
});
function ji(e) {
  return e.status === "done" ? 1 : e.status === "active" ? it(e.progress) : 0;
}
function it(e) {
  const t = Number(e);
  return Number.isFinite(t) ? Math.min(1, Math.max(0, t)) : 0;
}
function qe(e) {
  const t = e.filter((o) => o.status !== "dropped");
  return t.length ? t.reduce((o, s) => o + ji(s), 0) / t.length : 0;
}
function Qi(e, t = {}) {
  const n = e.settings.period_kind, o = (f, v) => {
    const p = Q(f.start_period, n), b = Q(v.start_period, n);
    return p !== b ? (p ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER) : f.sort_order - v.sort_order || f.title.localeCompare(v.title);
  }, s = e.outcomes.map((f) => {
    const v = e.initiatives.filter((p) => p.outcome_id === f.id).sort(o);
    return { outcome: f, initiatives: v, progress: qe(v) };
  });
  t.sortByProgress && s.sort((f, v) => v.progress - f.progress);
  const r = new Set(e.outcomes.map((f) => f.id)), y = e.initiatives.filter((f) => !f.outcome_id || !r.has(f.outcome_id)).sort(o);
  return y.length && s.push({ outcome: null, initiatives: y, progress: qe(y) }), s;
}
function Xe(e) {
  return Math.round(it(e) * 100);
}
const Ji = { class: "rm-oc" }, Zi = ["role", "tabindex", "onClick", "onKeydown", "onContextmenu"], eo = { class: "rm-obj-why" }, to = { class: "rm-meter" }, no = { class: "rm-meter-track" }, io = { class: "rm-meter-value" }, oo = { class: "rm-bets" }, so = ["onClick", "onKeydown", "onContextmenu"], ro = { class: "rm-bet-line" }, lo = { class: "rm-bet-title" }, ao = { class: "rm-bet-period" }, uo = {
  key: 0,
  class: "rm-bet rm-bet--empty"
}, co = /* @__PURE__ */ Z({
  __name: "OutcomesLens",
  props: {
    cards: {},
    layers: {},
    periodKind: {},
    selectedId: {},
    trace: {}
  },
  emits: ["select", "context"],
  setup(e, { emit: t }) {
    const n = e, o = t;
    function s(y) {
      return n.layers.find((f) => f.id === y);
    }
    function r(y) {
      return n.trace.selected ? {
        "is-sel": y === n.trace.selected,
        "is-need": n.trace.needs.has(y),
        "is-unlock": n.trace.unlocks.has(y),
        "is-dim": !n.trace.chain.has(y)
      } : {};
    }
    return (y, f) => (l(), d("div", Ji, [
      (l(!0), d(S, null, N(e.cards, (v) => (l(), d("section", {
        key: v.outcome?.id || "unfiled",
        class: "rm-obj"
      }, [
        i("header", {
          class: U(["rm-obj-head", { "is-clickable": !!v.outcome }]),
          role: v.outcome ? "button" : void 0,
          tabindex: v.outcome ? 0 : void 0,
          onClick: (p) => v.outcome && o("select", "outcome", v.outcome.id),
          onKeydown: ve(V((p) => v.outcome && o("select", "outcome", v.outcome.id), ["prevent"]), ["enter"]),
          onContextmenu: V((p) => v.outcome && o("context", p, "outcome", v.outcome.id), ["prevent"])
        }, [
          i("h3", null, x(v.outcome ? v.outcome.title : "Unfiled bets"), 1),
          i("p", eo, x(v.outcome ? v.outcome.description : "Work that serves no stated outcome."), 1)
        ], 42, Zi),
        i("div", to, [
          i("span", no, [
            i("span", {
              class: "rm-meter-fill",
              style: q({ width: `${P(Xe)(v.progress)}%` })
            }, null, 4)
          ]),
          i("span", io, x(P(Xe)(v.progress)) + "%", 1)
        ]),
        i("ul", oo, [
          (l(!0), d(S, null, N(v.initiatives, (p) => (l(), d("li", {
            key: p.id,
            class: U(["rm-bet", r(p.id)]),
            style: q({ "--rm-layer": s(p.layer_id)?.color || "var(--rm-accent)" }),
            role: "button",
            tabindex: "0",
            onClick: (b) => o("select", "initiative", p.id),
            onKeydown: ve(V((b) => o("select", "initiative", p.id), ["prevent"]), ["enter"]),
            onContextmenu: V((b) => o("context", b, "initiative", p.id), ["prevent"])
          }, [
            K(me, {
              status: p.status,
              color: s(p.layer_id)?.color
            }, null, 8, ["status", "color"]),
            i("span", ro, [
              i("i", {
                class: "rm-dot",
                style: q({ "--rm-dot-color": s(p.layer_id)?.color || "var(--rm-accent)" })
              }, null, 4),
              i("span", lo, x(p.title), 1),
              K(Ae, {
                confidence: p.confidence
              }, null, 8, ["confidence"])
            ]),
            i("span", ao, x(p.start_period ? P(we)(p.start_period, e.periodKind) : "—"), 1)
          ], 46, so))), 128)),
          v.initiatives.length ? O("", !0) : (l(), d("li", uo, "No bets filed here yet."))
        ])
      ]))), 128))
    ]));
  }
});
function vo(e, t, n) {
  if (n === "vertical") {
    const v = e.x + e.width / 2, p = e.y, b = t.x + t.width / 2, k = t.y + t.height, $ = (p + k) / 2;
    return `M${G(v)},${G(p)} C${G(v)},${G($)} ${G(b)},${G($)} ${G(b)},${G(k)}`;
  }
  const o = e.x + e.width, s = e.y + e.height / 2, r = t.x, y = t.y + t.height / 2, f = Math.max(16, (r - o) / 2);
  return `M${G(o)},${G(s)} C${G(o + f)},${G(s)} ${G(r - f)},${G(y)} ${G(r)},${G(y)}`;
}
function G(e) {
  return Math.round(e * 100) / 100;
}
function ot(e, t, n) {
  const o = n.chain, s = n.selectedOnly || "", r = [];
  for (const y of e || []) {
    if (s && y.from_id !== s && y.to_id !== s) continue;
    const f = t.get(y.from_id), v = t.get(y.to_id);
    !f || !v || r.push({
      id: y.id,
      d: vo(f, v, n.orientation),
      kind: y.kind,
      hot: !!(o && o.has(y.from_id) && o.has(y.to_id))
    });
  }
  return r;
}
function mo(e, t = {}) {
  const n = e.settings.period_kind, o = [...e.layers].sort((r, y) => y.sort_order - r.sort_order || y.title.localeCompare(r.title)), s = t.rank;
  return o.map((r) => {
    const y = e.initiatives.filter((f) => f.layer_id === r.id && (t.includeDropped || f.status !== "dropped")).sort((f, v) => {
      if (s) {
        const k = (s.get(v.id) ?? 0) - (s.get(f.id) ?? 0);
        if (k) return k;
      }
      const p = Q(f.start_period, n), b = Q(v.start_period, n);
      return p !== b ? (p ?? Number.MAX_SAFE_INTEGER) - (b ?? Number.MAX_SAFE_INTEGER) : f.sort_order - v.sort_order || f.title.localeCompare(v.title);
    });
    return { layer: r, initiatives: y };
  });
}
function fo(e, t = {}) {
  return (e || []).filter((n) => n.kind === "requires" || t.includeInforms && n.kind === "informs");
}
function po(e, t, n) {
  return ot(e, t, { orientation: "vertical", chain: n });
}
const yo = {
  class: "rm-overlay",
  "aria-hidden": "true"
}, ho = ["d"], bo = { class: "rm-stratum-lab" }, go = { key: 0 }, ko = { class: "rm-stratum-pills" }, $o = ["data-initiative-id", "title", "onClick", "onContextmenu"], _o = {
  key: 0,
  class: "rm-pill-rank"
}, wo = {
  key: 0,
  class: "rm-stratum-empty"
}, Eo = /* @__PURE__ */ Z({
  __name: "StrataLens",
  props: {
    bands: {},
    edges: {},
    selectedId: {},
    trace: {},
    ranks: {}
  },
  emits: ["select", "context"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = F(null), r = F(/* @__PURE__ */ new Map());
    function y() {
      const b = s.value;
      if (!b) {
        r.value = /* @__PURE__ */ new Map();
        return;
      }
      const k = b.getBoundingClientRect(), $ = /* @__PURE__ */ new Map();
      for (const D of Array.from(b.querySelectorAll("[data-initiative-id]"))) {
        const R = D.dataset.initiativeId || "";
        if (!R) continue;
        const z = D.getBoundingClientRect();
        $.set(R, { id: R, x: z.left - k.left, y: z.top - k.top, width: z.width, height: z.height });
      }
      r.value = $;
    }
    const f = M(() => po(n.edges, r.value, n.trace.chain));
    let v = null;
    pe(s, (b) => {
      v?.disconnect(), v = null, !(!b || typeof ResizeObserver > "u") && (v = new ResizeObserver(() => y()), v.observe(b));
    }, { immediate: !0 }), pe(() => n.bands, () => {
      ye(y);
    }, { immediate: !0 }), _e(() => {
      v?.disconnect(), v = null;
    });
    function p(b) {
      return n.trace.selected ? {
        "is-sel": b === n.trace.selected,
        "is-need": n.trace.needs.has(b),
        "is-unlock": n.trace.unlocks.has(b),
        "is-dim": !n.trace.chain.has(b)
      } : {};
    }
    return (b, k) => (l(), d("div", {
      class: "rm-strata",
      ref_key: "rootEl",
      ref: s
    }, [
      (l(), d("svg", yo, [
        (l(!0), d(S, null, N(f.value, ($) => (l(), d("path", {
          key: $.id,
          d: $.d,
          class: U([`rm-edge--${$.kind}`, { "is-hot": $.hot }])
        }, null, 10, ho))), 128))
      ])),
      (l(!0), d(S, null, N(e.bands, ($) => (l(), d("div", {
        key: $.layer.id,
        class: "rm-stratum"
      }, [
        i("div", bo, [
          i("i", {
            class: "rm-dot",
            style: q({ "--rm-dot-color": $.layer.color || "var(--rm-accent)" })
          }, null, 4),
          i("div", null, [
            ie(x($.layer.title) + " ", 1),
            $.layer.description ? (l(), d("small", go, x($.layer.description), 1)) : O("", !0)
          ])
        ]),
        i("div", ko, [
          (l(!0), d(S, null, N($.initiatives, (D) => (l(), d("button", {
            key: D.id,
            class: U(["rm-pill", [`rm-pill--${D.status}`, p(D.id), { "rm-pill--low": D.confidence === "low" }]]),
            style: q({ "--rm-layer": $.layer.color || "var(--rm-accent)" }),
            "data-initiative-id": D.id,
            title: e.ranks && e.ranks.get(D.id) ? `${D.title} — blocks ${e.ranks.get(D.id)}` : D.title,
            onClick: (R) => o("select", "initiative", D.id),
            onContextmenu: V((R) => o("context", R, "initiative", D.id), ["prevent"])
          }, [
            K(me, {
              status: D.status
            }, null, 8, ["status"]),
            i("span", null, x(D.title), 1),
            e.ranks && e.ranks.get(D.id) ? (l(), d("em", _o, x(e.ranks.get(D.id)), 1)) : O("", !0)
          ], 46, $o))), 128)),
          $.initiatives.length ? O("", !0) : (l(), d("span", wo, "No work in this layer."))
        ])
      ]))), 128))
    ], 512));
  }
});
function st(e, t, n, o, s = 0.5) {
  const r = Q(e, o);
  if (r === null || n <= 0) return null;
  const y = (r - t + s) / n;
  return y < 0 || y > 1 ? null : y;
}
function Co(e) {
  return typeof e != "number" || !Number.isFinite(e) ? 0.5 : Math.min(1, Math.max(0, e));
}
function xo(e, t) {
  const n = [], o = [];
  for (const s of e) {
    const r = Q(s.start_period, t);
    if (r === null) {
      o.push(s);
      continue;
    }
    const y = Math.max(1, Math.round(s.span) || 1);
    n.push({ initiative: s, start: r, end: r + y - 1 });
  }
  return n.sort((s, r) => s.start - r.start || r.end - r.start - (s.end - s.start) || s.initiative.title.localeCompare(r.initiative.title)), { placed: n, unscheduled: o };
}
function Io(e) {
  const t = [];
  for (const n of e) {
    let o = t.find((s) => s.every((r) => n.start > r.end || n.end < r.start));
    o || (o = [], t.push(o)), o.push(n);
  }
  return t;
}
function Do(e, t, n, o) {
  const s = /* @__PURE__ */ new Map();
  for (const f of e || []) {
    if (t === null) continue;
    const v = s.get(f.period);
    if (v) {
      v.group.push(f);
      continue;
    }
    const p = st(f.period, t, n, o);
    p !== null && s.set(f.period, { left: p, group: [f] });
  }
  const r = [];
  let y = 1;
  for (const [f, { left: v, group: p }] of s)
    p.sort((b, k) => b.title.localeCompare(k.title) || b.id.localeCompare(k.id)), y = Math.max(y, p.length), p.forEach((b, k) => r.push({ milestone: b, period: f, row: k, left: v }));
  return { marks: r, rows: y };
}
function Mo(e, t = {}) {
  const n = e.settings.period_kind, o = Q(e.settings.origin, n), s = Math.max(1, Math.floor(e.settings.columns) || 0), y = Gt(e.settings.origin, s, n).map((D, R) => ({
    key: D,
    label: we(D, n),
    index: (o ?? 0) + R,
    current: D === e.current_period
  })), f = o ?? 0, v = f + s - 1, p = e.initiatives.filter((D) => t.includeDropped || D.status !== "dropped"), b = e.layers.map((D) => {
    const R = p.filter((m) => m.layer_id === D.id), { placed: z, unscheduled: B } = xo(R, n), h = z.filter((m) => m.end >= f && m.start <= v), w = z.filter((m) => m.end < f || m.start > v).map((m) => m.initiative), T = Io(h).map((m) => m.map((_) => {
      const ee = Math.max(_.start, f), te = Math.min(_.end, v);
      return {
        initiative: _.initiative,
        colStart: ee - f + 1,
        span: te - ee + 1,
        clippedStart: _.start < f,
        clippedEnd: _.end > v
      };
    }));
    return { layer: D, rows: T, unscheduled: B, offscreen: w };
  }), k = Do(e.milestones, o, s, n), $ = o === null ? null : st(e.current_period, o, s, n, Co(e.current_position));
  return { columns: y, lanes: b, milestones: k.marks, milestoneRows: k.rows, todayPosition: $ };
}
function So(e, t, n, o) {
  return n ? ot(e, t, { orientation: "horizontal", selectedOnly: n, chain: o }) : [];
}
function To(e, t) {
  return !Number.isFinite(t) || t <= 0 ? 0 : Math.round(e / t);
}
function De(e) {
  const t = To(e.dx, e.columnWidth), n = Math.max(1, Math.round(e.span) || 1);
  if (e.mode === "resize") {
    const r = Math.max(1, e.windowEnd - e.startIndex + 1);
    return { startIndex: e.startIndex, span: Math.min(r, Math.max(1, n + t)) };
  }
  const o = Math.max(e.windowStart, e.windowEnd - n + 1);
  return { startIndex: Math.min(o, Math.max(e.windowStart, e.startIndex + t)), span: n };
}
function No(e, t) {
  if (!e.length) return null;
  for (const s of e) if (t >= s.top && t < s.bottom) return s.layerId;
  let n = e[0], o = 1 / 0;
  for (const s of e) {
    const r = t < s.top ? s.top - t : t - s.bottom;
    r < o && (o = r, n = s);
  }
  return n.layerId;
}
const Ao = { class: "rm-tl-head" }, Lo = ["title", "aria-label", "onClick", "onContextmenu"], Oo = { class: "rm-tl-lab" }, Po = { key: 0 }, Ro = { class: "rm-tl-rows" }, zo = ["data-initiative-id", "title", "onPointerdown", "onClick", "onKeydown", "onContextmenu"], Ko = { class: "rm-bar-title" }, Uo = { class: "rm-bar-size" }, Bo = ["aria-label", "onPointerdown"], Vo = {
  key: 0,
  class: "rm-tl-row rm-tl-row--empty"
}, Yo = {
  key: 0,
  class: "rm-tl-aside"
}, Fo = ["title", "onClick", "onContextmenu"], qo = ["title", "onClick"], Xo = {
  class: "rm-overlay",
  "aria-hidden": "true"
}, Go = ["d"], Ho = /* @__PURE__ */ Z({
  __name: "TimelineLens",
  props: {
    state: {},
    model: {},
    selectedId: {},
    trace: {},
    editable: { type: Boolean },
    compact: { type: Boolean }
  },
  emits: ["select", "place", "context"],
  setup(e, { emit: t }) {
    const n = e, o = t, s = F(null), r = /* @__PURE__ */ new Map(), y = F(/* @__PURE__ */ new Map()), f = M(() => n.state.settings.period_kind), v = M(() => Q(n.state.settings.origin, f.value) ?? 0), p = M(() => Math.max(1, n.model.columns.length)), b = M(() => ({ "--rm-cols": String(p.value) })), k = F(null);
    let $ = 0;
    function D(E) {
      Date.now() < $ || o("select", "initiative", E);
    }
    function R(E, g) {
      g instanceof HTMLElement ? r.set(E, g) : r.delete(E);
    }
    function z() {
      const E = s.value;
      if (!E) {
        y.value = /* @__PURE__ */ new Map();
        return;
      }
      const g = E.getBoundingClientRect(), C = /* @__PURE__ */ new Map();
      for (const I of Array.from(E.querySelectorAll("[data-initiative-id]"))) {
        const X = I.dataset.initiativeId || "";
        if (!X) continue;
        const A = I.getBoundingClientRect();
        C.set(X, { id: X, x: A.left - g.left, y: A.top - g.top, width: A.width, height: A.height });
      }
      y.value = C;
    }
    const B = M(() => So(n.state.dependencies, y.value, n.selectedId, n.trace.chain));
    let h = null;
    pe(s, (E) => {
      h?.disconnect(), h = null, !(!E || typeof ResizeObserver > "u") && (h = new ResizeObserver(() => z()), h.observe(E));
    }, { immediate: !0 }), pe([() => n.model, () => n.selectedId], () => {
      ye(z);
    }, { immediate: !0, deep: !1 }), _e(() => {
      h?.disconnect(), h = null, ue(!1);
    });
    function w(E) {
      const g = k.value, I = {
        "--rm-layer": n.state.layers.find((H) => H.id === E.initiative.layer_id)?.color || "var(--rm-accent)",
        "--rm-progress": `${Math.round((E.initiative.progress || 0) * 100)}%`,
        gridColumn: `${E.colStart} / span ${E.span}`
      };
      if (!g || g.id !== E.initiative.id) return I;
      if (g.mode === "resize") {
        const H = De(T(g));
        return I.gridColumn = `${E.colStart} / span ${Math.max(1, Math.min(p.value - E.colStart + 1, H.span))}`, I;
      }
      const A = (De(T(g)).startIndex - g.startIndex) * g.columnWidth;
      return I.transform = `translate(${A}px, ${g.dy}px)`, I;
    }
    function T(E) {
      return {
        mode: E.mode,
        startIndex: E.startIndex,
        span: E.span,
        dx: E.dx,
        columnWidth: E.columnWidth,
        windowStart: v.value,
        windowEnd: v.value + p.value - 1
      };
    }
    function m() {
      const E = s.value;
      if (!E) return [];
      const g = E.getBoundingClientRect(), C = [];
      for (const I of n.state.layers) {
        const X = r.get(I.id);
        if (!X) continue;
        const A = X.getBoundingClientRect();
        C.push({ layerId: I.id, top: A.top - g.top, bottom: A.bottom - g.top });
      }
      return C;
    }
    function _() {
      const g = n.state.layers.map((C) => r.get(C.id)).find(Boolean)?.querySelector(".rm-tl-rows");
      return g ? g.clientWidth / p.value : 0;
    }
    function ee(E, g, C) {
      if (!n.editable || E.button !== 0) return;
      const I = Q(g.initiative.start_period, f.value);
      I !== null && (E.preventDefault(), E.stopPropagation(), k.value = {
        id: g.initiative.id,
        mode: C,
        pointerId: E.pointerId,
        originX: E.clientX,
        originY: E.clientY,
        dx: 0,
        dy: 0,
        startIndex: I,
        span: Math.max(1, Math.round(g.initiative.span) || 1),
        layerId: g.initiative.layer_id,
        targetLayerId: g.initiative.layer_id,
        columnWidth: _(),
        bands: m(),
        moved: !1
      }, window.addEventListener("pointermove", te), window.addEventListener("pointerup", re), window.addEventListener("keydown", de, !0));
    }
    function te(E) {
      const g = k.value;
      if (!(!g || E.pointerId !== g.pointerId)) {
        if (g.dx = E.clientX - g.originX, g.dy = g.mode === "move" ? E.clientY - g.originY : 0, (Math.abs(g.dx) > 3 || Math.abs(g.dy) > 3) && (g.moved = !0), g.mode === "move") {
          const C = s.value, I = C ? E.clientY - C.getBoundingClientRect().top : 0;
          g.targetLayerId = No(g.bands, I) || g.layerId;
        }
        k.value = { ...g };
      }
    }
    function re(E) {
      const g = k.value;
      !g || E.pointerId !== g.pointerId || ue(g.moved);
    }
    function de(E) {
      E.key !== "Escape" || !k.value || (E.preventDefault(), E.stopPropagation(), ue(!1));
    }
    function ue(E) {
      const g = k.value;
      if (window.removeEventListener("pointermove", te), window.removeEventListener("pointerup", re), window.removeEventListener("keydown", de, !0), k.value = null, !g || !E) return;
      $ = Date.now() + 300;
      const C = De(T(g)), I = {};
      g.mode === "resize" ? C.span !== g.span && (I.span = C.span) : (C.startIndex !== g.startIndex && (I.startPeriod = he(C.startIndex, f.value)), g.targetLayerId !== g.layerId && (I.layerId = g.targetLayerId)), Object.keys(I).length && o("place", g.id, I);
    }
    function ce(E) {
      return n.trace.selected ? {
        "is-sel": E === n.trace.selected,
        "is-need": n.trace.needs.has(E),
        "is-unlock": n.trace.unlocks.has(E),
        "is-dim": !n.trace.chain.has(E)
      } : {};
    }
    function fe(E) {
      return n.state.layers.find((g) => g.id === E)?.color || "var(--rm-accent)";
    }
    return (E, g) => (l(), d("div", {
      class: U(["rm-tl", { "rm-tl--compact": e.compact, "rm-tl--dragging": !!k.value }]),
      style: q(b.value),
      ref_key: "gridEl",
      ref: s
    }, [
      i("div", Ao, [
        g[0] || (g[0] = i("div", { class: "rm-tl-head-lab" }, "Layer", -1)),
        (l(!0), d(S, null, N(e.model.columns, (C) => (l(), d("div", {
          key: C.key,
          class: U({ "is-current": C.current })
        }, x(C.label), 3))), 128))
      ]),
      i("div", {
        class: "rm-tl-ms",
        style: q({ "--rm-ms-rows": String(e.model.milestoneRows) })
      }, [
        g[2] || (g[2] = i("div", { class: "rm-tl-head-lab" }, "Milestones", -1)),
        (l(!0), d(S, null, N(e.model.milestones, (C) => (l(), d("button", {
          key: C.milestone.id,
          class: "rm-ms",
          style: q({ left: `calc(var(--rm-label) + (100% - var(--rm-label)) * ${C.left})`, "--rm-ms-row": String(C.row) }),
          title: C.milestone.title,
          "aria-label": `Milestone ${C.milestone.title}`,
          onClick: (I) => o("select", "milestone", C.milestone.id),
          onContextmenu: V((I) => o("context", I, "milestone", C.milestone.id), ["prevent"])
        }, [
          g[1] || (g[1] = i("i", null, null, -1)),
          ie(x(C.milestone.title), 1)
        ], 44, Lo))), 128))
      ], 4),
      (l(!0), d(S, null, N(e.model.lanes, (C) => (l(), d("div", {
        key: C.layer.id,
        class: U(["rm-tl-lane", { "is-drop": k.value?.mode === "move" && k.value?.targetLayerId === C.layer.id }]),
        ref_for: !0,
        ref: (I) => R(C.layer.id, I)
      }, [
        i("div", Oo, [
          i("i", {
            class: "rm-dot",
            style: q({ "--rm-dot-color": C.layer.color || "var(--rm-accent)" })
          }, null, 4),
          i("div", null, [
            ie(x(C.layer.title) + " ", 1),
            C.layer.description ? (l(), d("small", Po, x(C.layer.description), 1)) : O("", !0)
          ])
        ]),
        i("div", Ro, [
          (l(!0), d(S, null, N(C.rows, (I, X) => (l(), d("div", {
            key: X,
            class: "rm-tl-row"
          }, [
            (l(!0), d(S, null, N(I, (A) => (l(), d("div", {
              key: A.initiative.id,
              class: U(["rm-bar", [
                `rm-bar--${A.initiative.status}`,
                ce(A.initiative.id),
                {
                  "rm-bar--low": A.initiative.confidence === "low",
                  "rm-bar--clip-start": A.clippedStart,
                  "rm-bar--clip-end": A.clippedEnd,
                  "is-dragging": k.value?.id === A.initiative.id
                }
              ]]),
              style: q(w(A)),
              "data-initiative-id": A.initiative.id,
              role: "button",
              tabindex: "0",
              title: A.initiative.title,
              onPointerdown: (H) => ee(H, A, "move"),
              onClick: (H) => D(A.initiative.id),
              onKeydown: [
                ve(V((H) => D(A.initiative.id), ["prevent"]), ["enter"]),
                ve(V((H) => D(A.initiative.id), ["prevent"]), ["space"])
              ],
              onContextmenu: V((H) => o("context", H, "initiative", A.initiative.id), ["prevent"])
            }, [
              K(me, {
                status: A.initiative.status,
                title: A.initiative.status
              }, null, 8, ["status", "title"]),
              i("span", Ko, x(A.initiative.title), 1),
              i("span", Uo, x(A.initiative.size), 1),
              e.editable ? (l(), d("span", {
                key: 0,
                class: "rm-bar-grip",
                role: "separator",
                "aria-label": `Resize ${A.initiative.title}`,
                onPointerdown: V((H) => ee(H, A, "resize"), ["stop"])
              }, null, 40, Bo)) : O("", !0)
            ], 46, zo))), 128))
          ]))), 128)),
          C.rows.length ? O("", !0) : (l(), d("div", Vo))
        ]),
        C.unscheduled.length || C.offscreen.length ? (l(), d("div", Yo, [
          (l(!0), d(S, null, N(C.unscheduled, (I) => (l(), d("button", {
            key: I.id,
            class: U(["rm-chip rm-chip--idea", ce(I.id)]),
            style: q({ "--rm-layer": fe(I.layer_id) }),
            title: `${I.title} — no start period`,
            onClick: (X) => o("select", "initiative", I.id),
            onContextmenu: V((X) => o("context", X, "initiative", I.id), ["prevent"])
          }, [
            K(me, {
              status: I.status
            }, null, 8, ["status"]),
            ie(x(I.title), 1)
          ], 46, Fo))), 128)),
          (l(!0), d(S, null, N(C.offscreen, (I) => (l(), d("button", {
            key: I.id,
            class: U(["rm-chip rm-chip--offscreen", ce(I.id)]),
            style: q({ "--rm-layer": fe(I.layer_id) }),
            title: `${I.title} — ${I.start_period}, outside the visible window`,
            onClick: (X) => o("select", "initiative", I.id)
          }, x(I.title), 15, qo))), 128))
        ])) : O("", !0)
      ], 2))), 128)),
      e.model.todayPosition !== null ? (l(), d("div", {
        key: 0,
        class: "rm-today",
        style: q({ "--rm-today-pos": String(e.model.todayPosition) })
      }, null, 4)) : O("", !0),
      (l(), d("svg", Xo, [
        (l(!0), d(S, null, N(B.value, (C) => (l(), d("path", {
          key: C.id,
          d: C.d,
          class: U([`rm-edge--${C.kind}`, { "is-hot": C.hot }])
        }, null, 10, Go))), 128))
      ]))
    ], 6));
  }
});
function $e(e, t) {
  const n = e, o = n?.response?.data?.error ?? n?.data?.error, s = typeof o == "string" && o ? o : typeof n?.message == "string" && n.message && !/status code|request failed/i.test(n.message) ? n.message : "";
  return s ? /nothing to undo/i.test(s) ? "Nothing to undo." : /nothing to redo/i.test(s) ? "Nothing to redo." : s : t;
}
class Wo {
  constructor(t) {
    this.roadmapId = t;
  }
  base() {
    return `/api/v1/workspace/roadmaps/${this.roadmapId}`;
  }
  /** The full snapshot: settings, every collection, current period, history position. */
  async state() {
    try {
      const { data: t } = await ke.get(this.base());
      if (!t.success) throw new Error(t.error || "failed to load the roadmap");
      return t.roadmap;
    } catch (t) {
      throw new Error($e(t, "Couldn’t load the roadmap."));
    }
  }
  /** One validated batch; the whole batch fails or the whole batch lands. */
  async apply(t) {
    try {
      const { data: n } = await ke.post(`${this.base()}/apply`, { commands: t });
      if (!n.success) throw new Error(n.error || "apply failed");
      return n.roadmap;
    } catch (n) {
      throw new Error($e(n, "Couldn’t save the change."));
    }
  }
  async undo() {
    try {
      const { data: t } = await ke.post(`${this.base()}/undo`, {});
      if (!t.success) throw new Error(t.error || "undo failed");
      return t.roadmap;
    } catch (t) {
      throw new Error($e(t, "Nothing to undo."));
    }
  }
  async redo() {
    try {
      const { data: t } = await ke.post(`${this.base()}/redo`, {});
      if (!t.success) throw new Error(t.error || "redo failed");
      return t.roadmap;
    } catch (t) {
      throw new Error($e(t, "Nothing to redo."));
    }
  }
}
function se() {
  const e = globalThis.crypto;
  return e && typeof e.randomUUID == "function" ? e.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function Ge(e) {
  const t = { id: e.id || se(), title: e.title };
  return e.description && (t.description = e.description), e.color && (t.color = e.color), e.icon && (t.icon = e.icon), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: Y.LAYER_ADDED, body: t };
}
function jo(e, t) {
  return { type: Y.LAYER_UPDATED, body: { id: e, ...t } };
}
function Qo(e) {
  return { type: Y.LAYER_REMOVED, body: { id: e } };
}
function Jo(e) {
  const t = { id: e.id || se(), title: e.title };
  return e.description && (t.description = e.description), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: Y.OUTCOME_ADDED, body: t };
}
function Zo(e, t) {
  return { type: Y.OUTCOME_UPDATED, body: { id: e, ...t } };
}
function es(e) {
  return { type: Y.OUTCOME_REMOVED, body: { id: e } };
}
function ts(e) {
  const t = { id: e.id || se(), title: e.title, layer_id: e.layerId };
  return e.description && (t.description = e.description), e.outcomeId && (t.outcome_id = e.outcomeId), e.status && (t.status = e.status), e.confidence && (t.confidence = e.confidence), e.size && (t.size = e.size), e.startPeriod && (t.start_period = e.startPeriod), e.span !== void 0 && (t.span = e.span), e.progress !== void 0 && (t.progress = e.progress), e.owner && (t.owner = e.owner), e.tags && (t.tags = e.tags), e.properties && (t.properties = e.properties), e.sortOrder !== void 0 && (t.sort_order = e.sortOrder), { type: Y.INITIATIVE_ADDED, body: t };
}
function ns(e, t) {
  return { type: Y.INITIATIVE_UPDATED, body: { id: e, ...t } };
}
function is(e, t) {
  const n = { id: e };
  return t.startPeriod !== void 0 && (n.start_period = t.startPeriod), t.span !== void 0 && (n.span = Math.max(1, Math.round(t.span))), t.layerId !== void 0 && (n.layer_id = t.layerId), { type: Y.INITIATIVE_UPDATED, body: n };
}
function os(e) {
  return { type: Y.INITIATIVE_REMOVED, body: { id: e } };
}
function He(e) {
  const t = { id: e.id || se(), from_id: e.fromId, to_id: e.toId };
  return e.kind && (t.kind = e.kind), e.note && (t.note = e.note), { type: Y.DEPENDENCY_ADDED, body: t };
}
function ss(e, t) {
  return { type: Y.DEPENDENCY_UPDATED, body: { id: e, ...t } };
}
function We(e) {
  return { type: Y.DEPENDENCY_REMOVED, body: { id: e } };
}
function rs(e) {
  const t = { id: e.id || se(), title: e.title, period: e.period };
  return e.description && (t.description = e.description), e.layerId && (t.layer_id = e.layerId), e.initiativeIds && (t.initiative_ids = e.initiativeIds), { type: Y.MILESTONE_ADDED, body: t };
}
function je(e, t) {
  return { type: Y.MILESTONE_UPDATED, body: { id: e, ...t } };
}
function ls(e) {
  return { type: Y.MILESTONE_REMOVED, body: { id: e } };
}
function Me(e) {
  return { type: Y.SETTINGS_UPDATED, body: { settings: { ...e } } };
}
function as(e, t) {
  return { type: Y.LENS_STATE_SET, body: { lens: e, state: t } };
}
const rt = 2;
function ds(e, t, n) {
  if (e.status === "done" || e.status === "dropped") return "past";
  const o = Q(e.start_period, n), s = Q(t, n);
  return o === null || s === null || o > s + rt ? "later" : o <= s ? "now" : "next";
}
const Qe = [
  { horizon: "now", title: "Now", hint: "in flight or next up" },
  { horizon: "next", title: "Next", hint: "after current work lands" },
  { horizon: "later", title: "Later", hint: "directionally right, not scheduled" }
];
function us(e, t = {}) {
  const n = e.settings.period_kind;
  return (t.includePast ? [...Qe, { horizon: "past", title: "Shipped", hint: "done or dropped" }] : Qe).map((s) => {
    const r = e.initiatives.filter((f) => ds(f, e.current_period, n) === s.horizon), y = [];
    for (const f of e.layers) {
      const v = r.filter((p) => p.layer_id === f.id);
      v.length && y.push({ layer: f, initiatives: v });
    }
    return { ...s, groups: y, count: r.length };
  });
}
function cs(e, t, n) {
  const o = Q(t, n);
  return o === null ? null : e === "now" ? o : e === "next" ? o + 1 : e === "later" ? o + rt + 1 : null;
}
function vs(e, t) {
  return `kickside.thread.${e}.projection.${t}`;
}
const ms = ["start_period", "span", "layer_id"];
function fs(e, t, n) {
  for (const o of t) {
    if (o.type !== Y.INITIATIVE_UPDATED) continue;
    const s = String(o.body.id || "");
    if (!s) continue;
    const r = {};
    for (const y of ms)
      if (o.body[y] !== void 0) {
        if (y === "span") {
          const f = Number(o.body.span);
          Number.isFinite(f) && (r.span = f);
          continue;
        }
        r[y] = String(o.body[y]);
      }
    Object.keys(r).length && e.set(s, { revision: n, placement: r });
  }
}
function ps(e, t) {
  for (const [n, o] of e)
    o.revision === t && e.delete(n);
}
function ys(e, t) {
  return (t.start_period === void 0 || e.start_period === t.start_period) && (t.span === void 0 || e.span === t.span) && (t.layer_id === void 0 || e.layer_id === t.layer_id);
}
function hs(e, t, n) {
  if (!t.size) return e;
  const o = new Set((e.initiatives || []).map((r) => r.id));
  for (const r of [...t.keys()]) o.has(r) || t.delete(r);
  if (!t.size) return e;
  const s = (e.initiatives || []).map((r) => {
    const y = t.get(r.id);
    return y ? n && ys(r, y.placement) ? (t.delete(r.id), r) : { ...r, ...y.placement } : r;
  });
  return { ...e, initiatives: s };
}
const bs = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
function Oe(e) {
  const t = e?.tagName;
  return typeof t == "string" && bs.has(t.toUpperCase());
}
function gs(e) {
  if (Oe(e.target)) return null;
  const t = !!(e.ctrlKey || e.metaKey);
  return t && (e.key === "z" || e.key === "Z") ? e.shiftKey ? "redo" : "undo" : t && (e.key === "y" || e.key === "Y") ? "redo" : e.key === "Delete" || e.key === "Backspace" ? "delete" : e.key === "Escape" ? "escape" : null;
}
function ks(e) {
  if (Oe(e.target) || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey) return null;
  const t = Number(e.key);
  return !Number.isInteger(t) || t < 1 || t > Te.length ? null : Te[t - 1];
}
function $s(e, t = "requires") {
  const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  for (const s of e || []) {
    if (t === "requires" && s.kind !== "requires" || !s.from_id || !s.to_id) continue;
    const r = n.get(s.to_id) || [];
    r.push(s.from_id), n.set(s.to_id, r);
    const y = o.get(s.from_id) || [];
    y.push(s.to_id), o.set(s.from_id, y);
  }
  return { needs: n, unlocks: o };
}
function Ne(e, t, n) {
  const o = /* @__PURE__ */ new Set(), s = [...t.get(e) || []];
  for (; s.length; ) {
    const r = s.shift();
    r === e || o.has(r) || (o.add(r), n && s.push(...t.get(r) || []));
  }
  return o;
}
const _s = { selected: "", needs: /* @__PURE__ */ new Set(), unlocks: /* @__PURE__ */ new Set(), chain: /* @__PURE__ */ new Set() };
function ws(e, t, n = !1) {
  if (!e) return _s;
  const o = Ne(e, t.needs, n), s = Ne(e, t.unlocks, n), r = /* @__PURE__ */ new Set([e, ...o, ...s]);
  return { selected: e, needs: o, unlocks: s, chain: r };
}
function Es(e, t) {
  return Ne(e, t.unlocks, !0).size;
}
function Cs(e, t) {
  return e.map((n) => ({ id: n, score: Es(n, t) })).sort((n, o) => o.score - n.score || n.id.localeCompare(o.id));
}
const xs = { class: "rm-top" }, Is = { class: "rm-brand" }, Ds = {
  key: 0,
  class: "rm-lenses",
  "aria-label": "Lens"
}, Ms = ["aria-pressed", "title", "aria-label", "onClick"], Ss = {
  key: 1,
  class: "rm-tools"
}, Ts = { class: "rm-window" }, Ns = ["value"], As = ["value"], Ls = ["disabled"], Os = ["disabled"], Ps = {
  key: 0,
  class: "rm-error",
  role: "status"
}, Rs = { class: "rm-body" }, zs = { class: "rm-stage" }, Ks = {
  key: 0,
  class: "rm-status"
}, Us = {
  key: 1,
  class: "rm-foot"
}, Bs = { key: 0 }, Vs = /* @__PURE__ */ Z({
  __name: "RoadmapApp",
  setup(e) {
    const t = Tt(), n = M(() => t.value?.entryId || ""), o = M(() => (t.value?.mode || "preview") === "full"), s = M(() => o.value && !t.value?.readOnly), r = F(null), y = F(!0), f = F(""), v = F("timeline"), p = F(null), b = F(!0), k = F(null), $ = F(null), D = F(null), R = F({}), z = /* @__PURE__ */ new Map();
    let B = 0, h = 0, w = !1, T = Promise.resolve();
    const m = M(() => new Wo(n.value)), _ = ["var(--p-text-muted-color)", "var(--p-primary-color)", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))"], ee = ["Platform", "Product", "Cloud", "Services", "Monetization"];
    function te(a, u) {
      return R.value[a]?.[u] === !0;
    }
    function re(a, u) {
      const c = { ...R.value[a] || {}, [u]: !te(a, u) };
      R.value = { ...R.value, [a]: c };
    }
    const de = M(() => te("timeline", "dropped")), ue = M(() => te("horizons", "past")), ce = M(() => te("strata", "informs")), fe = M(() => te("strata", "critical")), E = M(() => te("outcomes", "progress")), g = M(() => $s(r.value?.dependencies || [])), C = M(() => p.value?.kind === "initiative" ? p.value.id : null), I = M(() => ws(C.value, g.value, v.value === "strata")), X = M(() => r.value ? Mo(r.value, { includeDropped: de.value }) : null), A = M(() => r.value ? us(r.value, { includePast: ue.value }) : []), H = M(() => {
      if (!(!r.value || !fe.value))
        return new Map(Cs(r.value.initiatives.map((a) => a.id), g.value).map((a) => [a.id, a.score]));
    }), lt = M(() => r.value ? mo(r.value, { includeDropped: de.value, rank: H.value }) : []), at = M(() => fo(r.value?.dependencies || [], { includeInforms: ce.value })), dt = M(() => r.value ? Qi(r.value, { sortByProgress: E.value }) : []), ut = M(() => (r.value?.layers.length || 0) > 0), ct = M(() => {
      const a = X.value;
      return !a || !a.columns.length ? "" : `${a.columns[0].label} – ${a.columns[a.columns.length - 1].label}`;
    }), vt = {
      timeline: "tabler:timeline",
      horizons: "tabler:layout-columns",
      strata: "tabler:stack-2",
      outcomes: "tabler:target-arrow"
    };
    function Ee(a, u = !1) {
      const c = hs(a, z, u), L = c.settings || Fe;
      r.value = {
        entry_id: c.entry_id || n.value,
        thread_id: c.thread_id || "",
        settings: {
          period_kind: L.period_kind || "quarter",
          origin: L.origin || "",
          columns: Math.max(1, Number(L.columns) || Fe.columns),
          default_lens: L.default_lens || "timeline",
          lens_state: L.lens_state || {}
        },
        current_period: c.current_period || "",
        current_position: typeof c.current_position == "number" ? c.current_position : void 0,
        layers: c.layers || [],
        outcomes: c.outcomes || [],
        initiatives: c.initiatives || [],
        dependencies: c.dependencies || [],
        milestones: c.milestones || [],
        counts: c.counts || { layers: 0, outcomes: 0, initiatives: 0, dependencies: 0, milestones: 0 },
        can_undo: c.can_undo === !0,
        can_redo: c.can_redo === !0
      }, w || (w = !0, R.value = r.value.settings.lens_state, v.value = o.value ? r.value.settings.default_lens : "timeline"), p.value && !mt(p.value) && (p.value = null);
    }
    function mt(a) {
      const u = r.value;
      return u ? {
        initiative: u.initiatives,
        dependency: u.dependencies,
        milestone: u.milestones,
        layer: u.layers,
        outcome: u.outcomes
      }[a.kind].some((L) => L.id === a.id) : !1;
    }
    async function Ce(a = !1) {
      if (!n.value) {
        f.value = "entry id required", y.value = !1;
        return;
      }
      const u = ++h;
      try {
        const c = await m.value.state();
        if (u !== h) return;
        Ee(c, a), f.value = "";
      } catch (c) {
        if (u !== h) return;
        f.value = c instanceof Error ? c.message : "Couldn’t load the roadmap.";
      } finally {
        u === h && (y.value = !1);
      }
    }
    function Pe(a) {
      const u = T.then(a);
      return T = u.catch((c) => {
        f.value = c instanceof Error ? c.message : "Couldn’t save the change.";
      }), u;
    }
    async function ft(a, u = {}) {
      try {
        Ee(await m.value.apply(a)), f.value = "";
      } catch (c) {
        u.moveRevision !== void 0 && (ps(z, u.moveRevision), await Ce()), f.value = c instanceof Error ? c.message : "Couldn’t save the change.";
      }
    }
    function J(a, u = {}) {
      return !s.value || !a.length ? Promise.resolve() : Pe(() => ft(a, u));
    }
    async function pt(a) {
      const u = r.value;
      if (u && !(a === "undo" && !u.can_undo) && !(a === "redo" && !u.can_redo))
        try {
          z.clear(), Ee(a === "undo" ? await m.value.undo() : await m.value.redo()), f.value = "";
        } catch (c) {
          f.value = c instanceof Error ? c.message : `Couldn’t ${a}.`;
        }
    }
    function be(a) {
      return s.value ? Pe(() => pt(a)) : Promise.resolve();
    }
    function ne(a, u) {
      const c = p.value;
      p.value = c && c.kind === a && c.id === u ? null : { kind: a, id: u }, p.value && (b.value = !0), $.value = null;
    }
    function Re(a) {
      v.value = a;
    }
    const ze = M(() => r.value?.settings.default_lens === v.value);
    function yt() {
      ze.value || J([Me({ default_lens: v.value })]);
    }
    function ht() {
      J([as(v.value, R.value[v.value] || {})]);
    }
    async function bt() {
      k.value = null, await ye(), D.value?.focus();
    }
    function gt(a) {
      k.value = {
        x: a.clientX,
        y: a.clientY,
        items: [
          { label: "Set as default lens", action: yt, disabled: ze.value },
          { label: "Remember view", action: ht }
        ]
      };
    }
    function kt(a, u, c) {
      J([{
        initiative: ns,
        dependency: ss,
        milestone: je,
        layer: jo,
        outcome: Zo
      }[a](u, c)]);
    }
    function $t(a, u) {
      const c = r.value;
      if (!c) return [];
      if (a !== "initiative")
        return [{
          dependency: We,
          milestone: ls,
          layer: Qo,
          outcome: es
        }[a](u)];
      const L = [];
      for (const W of c.dependencies)
        (W.from_id === u || W.to_id === u) && L.push(We(W.id));
      for (const W of c.milestones)
        W.initiative_ids.includes(u) && L.push(je(W.id, { initiative_ids: W.initiative_ids.filter((ae) => ae !== u) }));
      return L.push(os(u)), L;
    }
    function xe(a, u) {
      const c = $t(a, u);
      c.length && (p.value?.id === u && (p.value = null), J(c));
    }
    function Ke(a, u) {
      const c = is(a, u), L = ++B;
      fs(z, [c], L), J([c], { moveRevision: L });
    }
    function Ue(a) {
      const u = r.value;
      if (!u || !u.layers.length) return;
      const c = se(), L = a || (C.value ? u.initiatives.find((W) => W.id === C.value)?.layer_id : "") || u.layers[0].id;
      J([ts({ id: c, title: "New initiative", layerId: L, startPeriod: u.current_period, status: "idea" })]), ne("initiative", c);
    }
    function Be() {
      const a = r.value;
      if (!a) return;
      const u = se(), c = a.layers.reduce((L, W) => Math.max(L, W.sort_order), -1) + 1;
      J([Ge({ id: u, title: "New layer", color: _[c % _.length], sortOrder: c })]), ne("layer", u);
    }
    function _t() {
      const a = ee.map((u, c) => Ge({ title: u, color: _[c % _.length], sortOrder: c }));
      J(a);
    }
    function wt() {
      const a = r.value;
      if (!a) return;
      const u = se();
      J([Jo({ id: u, title: "New outcome", sortOrder: a.outcomes.length })]), ne("outcome", u);
    }
    function Et() {
      const a = r.value;
      if (!a || !a.current_period) return;
      const u = se();
      J([rs({ id: u, title: "New milestone", period: a.current_period })]), ne("milestone", u);
    }
    function Ve(a) {
      const u = r.value;
      if (!u) return;
      const c = Xt(u.settings.origin, a, u.settings.period_kind);
      c && J([Me({ origin: c })]);
    }
    function Ct(a) {
      const u = Math.max(1, Math.round(Number(a.target.value) || 0));
      J([Me({ columns: u })]);
    }
    function xt(a, u) {
      const c = r.value;
      if (!c) return;
      const L = cs(u, c.current_period, c.settings.period_kind);
      L !== null && (ne("initiative", a), $.value = { id: a, horizon: u, period: he(L, c.settings.period_kind) });
    }
    function It() {
      const a = $.value;
      a && ($.value = null, Ke(a.id, { startPeriod: a.period }));
    }
    function ge(a, u, c) {
      if (!s.value) return;
      const L = [{ label: "Open in panel", action: () => ne(u, c) }];
      if (u === "initiative") {
        const W = r.value, ae = C.value;
        ae && ae !== c && (L.push({ label: `Make “${Ye(ae)}” need this`, action: () => void J([He({ fromId: c, toId: ae })]) }), L.push({ label: `Make this need “${Ye(ae)}”`, action: () => void J([He({ fromId: ae, toId: c })]) })), W && L.push({ label: "Add initiative in this layer", action: () => Ue(W.initiatives.find((St) => St.id === c)?.layer_id) });
      }
      L.push({ label: `Remove ${u}`, action: () => xe(u, c), danger: !0 }), k.value = { x: a.clientX, y: a.clientY, items: L };
    }
    function Ye(a) {
      return r.value?.initiatives.find((u) => u.id === a)?.title || a;
    }
    function Dt(a) {
      k.value = {
        x: a.clientX,
        y: a.clientY,
        items: [
          { label: "Initiative", action: () => Ue() },
          { label: "Layer", action: () => Be() },
          { label: "Outcome", action: () => wt() },
          { label: "Milestone", action: () => Et() }
        ]
      };
    }
    function le(a) {
      a.preventDefault(), a.stopPropagation();
    }
    function Mt(a) {
      if (!o.value) return;
      if (Oe(a.target)) {
        if (a.key === "Escape") {
          const L = a.target;
          typeof L.blur == "function" && L.blur(), le(a);
        }
        return;
      }
      const u = ks({ key: a.key, ctrlKey: a.ctrlKey, metaKey: a.metaKey, shiftKey: a.shiftKey, altKey: a.altKey, target: a.target });
      if (u) {
        le(a), Re(u);
        return;
      }
      const c = gs({ key: a.key, ctrlKey: a.ctrlKey, metaKey: a.metaKey, shiftKey: a.shiftKey, target: a.target });
      !s.value && ["undo", "redo", "delete"].includes(c || "") || (c === "undo" ? (le(a), be("undo")) : c === "redo" ? (le(a), be("redo")) : c === "delete" ? p.value && (le(a), xe(p.value.kind, p.value.id)) : c === "escape" && (k.value ? (le(a), k.value = null) : $.value ? (le(a), $.value = null) : p.value && (le(a), p.value = null)));
    }
    let Ie = [];
    return Je(async () => {
      await Ce();
      const a = r.value?.thread_id;
      if (a)
        try {
          Ie.push(Nt(vs(a, cn), () => {
            Ce(!0);
          }));
        } catch {
          f.value = "Live updates are unavailable. Reload to read the latest roadmap.";
        }
    }), _e(() => {
      const a = [];
      for (const u of Ie)
        try {
          u();
        } catch (c) {
          a.push(c);
        }
      if (Ie = [], a.length) throw new AggregateError(a, "Couldn’t close live updates.");
    }), (a, u) => (l(), d("div", {
      ref_key: "rootEl",
      ref: D,
      class: U(["rm", { "rm--preview": !o.value }]),
      tabindex: "0",
      onKeydown: Mt
    }, [
      i("header", xs, [
        i("span", Is, [
          K(P(j), {
            icon: "tabler:map-2",
            "aria-hidden": "true"
          }),
          u[13] || (u[13] = i("span", null, "Roadmap", -1))
        ]),
        o.value ? (l(), d("nav", Ds, [
          (l(!0), d(S, null, N(P(Te), (c) => (l(), d("button", {
            key: c,
            class: U(["rm-lens-btn", { "is-active": v.value === c }]),
            "aria-pressed": v.value === c,
            title: `${c[0].toUpperCase() + c.slice(1)} lens`,
            "aria-label": `${c[0].toUpperCase() + c.slice(1)} lens`,
            onClick: (L) => Re(c)
          }, [
            K(P(j), {
              icon: vt[c],
              "aria-hidden": "true"
            }, null, 8, ["icon"]),
            i("span", null, x(c[0].toUpperCase() + c.slice(1)), 1)
          ], 10, Ms))), 128))
        ])) : O("", !0),
        u[15] || (u[15] = i("span", { class: "rm-spacer" }, null, -1)),
        o.value && r.value ? (l(), d("div", Ss, [
          v.value === "timeline" ? (l(), d(S, { key: 0 }, [
            i("button", {
              class: "rm-icon-btn",
              title: "Earlier window",
              "aria-label": "Earlier window",
              onClick: u[0] || (u[0] = (c) => Ve(-1))
            }, [
              K(P(j), {
                icon: "tabler:chevron-left",
                "aria-hidden": "true"
              })
            ]),
            i("span", Ts, x(ct.value), 1),
            i("button", {
              class: "rm-icon-btn",
              title: "Later window",
              "aria-label": "Later window",
              onClick: u[1] || (u[1] = (c) => Ve(1))
            }, [
              K(P(j), {
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              })
            ]),
            i("select", {
              class: "rm-select",
              value: r.value.settings.columns,
              title: "Visible periods",
              "aria-label": "Visible periods",
              onChange: Ct
            }, [
              (l(), d(S, null, N([3, 4, 5, 6, 8, 12], (c) => i("option", {
                key: c,
                value: c
              }, x(c) + " cols", 9, As)), 64))
            ], 40, Ns),
            i("button", {
              class: U(["rm-chip-btn", { "is-on": de.value }]),
              onClick: u[2] || (u[2] = (c) => re("timeline", "dropped"))
            }, "Dropped", 2)
          ], 64)) : v.value === "horizons" ? (l(), d("button", {
            key: 1,
            class: U(["rm-chip-btn", { "is-on": ue.value }]),
            onClick: u[3] || (u[3] = (c) => re("horizons", "past"))
          }, "Shipped", 2)) : v.value === "strata" ? (l(), d(S, { key: 2 }, [
            i("button", {
              class: U(["rm-chip-btn", { "is-on": ce.value }]),
              onClick: u[4] || (u[4] = (c) => re("strata", "informs"))
            }, "Informs", 2),
            i("button", {
              class: U(["rm-chip-btn", { "is-on": fe.value }]),
              onClick: u[5] || (u[5] = (c) => re("strata", "critical"))
            }, "Critical", 2)
          ], 64)) : (l(), d("button", {
            key: 3,
            class: U(["rm-chip-btn", { "is-on": E.value }]),
            onClick: u[6] || (u[6] = (c) => re("outcomes", "progress"))
          }, "Sort by progress", 2)),
          i("button", {
            class: "rm-icon-btn rm-more-btn",
            title: "View options",
            "aria-label": "View options",
            onClick: gt
          }, [
            K(P(j), {
              icon: "tabler:dots",
              "aria-hidden": "true"
            })
          ]),
          u[14] || (u[14] = i("span", { class: "rm-vsep" }, null, -1)),
          s.value ? (l(), d("button", {
            key: 4,
            class: "rm-icon-btn",
            title: "Add",
            "aria-label": "Add",
            onClick: Dt
          }, [
            K(P(j), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ])) : O("", !0),
          s.value ? (l(), d("button", {
            key: 5,
            class: "rm-icon-btn",
            disabled: !r.value.can_undo,
            title: "Undo",
            "aria-label": "Undo",
            onClick: u[7] || (u[7] = (c) => be("undo"))
          }, [
            K(P(j), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ], 8, Ls)) : O("", !0),
          s.value ? (l(), d("button", {
            key: 6,
            class: "rm-icon-btn",
            disabled: !r.value.can_redo,
            title: "Redo",
            "aria-label": "Redo",
            onClick: u[8] || (u[8] = (c) => be("redo"))
          }, [
            K(P(j), {
              icon: "tabler:arrow-forward-up",
              "aria-hidden": "true"
            })
          ], 8, Os)) : O("", !0),
          i("button", {
            class: U(["rm-icon-btn", { "is-on": b.value }]),
            title: "Toggle panel",
            "aria-label": "Toggle panel",
            onClick: u[9] || (u[9] = (c) => b.value = !b.value)
          }, [
            K(P(j), {
              icon: "tabler:layout-sidebar-right",
              "aria-hidden": "true"
            })
          ], 2)
        ])) : O("", !0)
      ]),
      f.value ? (l(), d("div", Ps, [
        i("span", null, x(f.value), 1),
        i("button", {
          class: "rm-icon-btn",
          title: "Dismiss",
          "aria-label": "Dismiss",
          onClick: u[10] || (u[10] = (c) => f.value = "")
        }, [
          K(P(j), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ])
      ])) : O("", !0),
      i("div", Rs, [
        i("main", zs, [
          y.value ? (l(), d("p", Ks, "Loading the roadmap…")) : r.value && !ut.value ? (l(), oe(Kt, {
            key: 1,
            editable: s.value,
            starter: ee,
            onAddLayer: Be,
            onAddStarter: _t
          }, null, 8, ["editable"])) : r.value && v.value === "timeline" && X.value ? (l(), oe(Ho, {
            key: 2,
            state: r.value,
            model: X.value,
            "selected-id": C.value,
            trace: I.value,
            editable: s.value,
            compact: !o.value,
            onSelect: ne,
            onPlace: Ke,
            onContext: ge
          }, null, 8, ["state", "model", "selected-id", "trace", "editable", "compact"])) : r.value && v.value === "horizons" ? (l(), oe(rn, {
            key: 3,
            columns: A.value,
            "period-kind": r.value.settings.period_kind,
            "selected-id": C.value,
            trace: I.value,
            editable: s.value,
            onSelect: ne,
            onSchedule: xt,
            onContext: ge
          }, null, 8, ["columns", "period-kind", "selected-id", "trace", "editable"])) : r.value && v.value === "strata" ? (l(), oe(Eo, {
            key: 4,
            bands: lt.value,
            edges: at.value,
            "selected-id": C.value,
            trace: I.value,
            ranks: H.value,
            onSelect: ne,
            onContext: ge
          }, null, 8, ["bands", "edges", "selected-id", "trace", "ranks"])) : r.value ? (l(), oe(co, {
            key: 5,
            cards: dt.value,
            layers: r.value.layers,
            "period-kind": r.value.settings.period_kind,
            "selected-id": C.value,
            trace: I.value,
            onSelect: ne,
            onContext: ge
          }, null, 8, ["cards", "layers", "period-kind", "selected-id", "trace"])) : O("", !0)
        ]),
        o.value && b.value && r.value ? (l(), oe(Wi, {
          key: 0,
          state: r.value,
          selection: p.value,
          trace: I.value,
          editable: s.value,
          suggestion: $.value,
          onPatch: kt,
          onRemove: xe,
          onSelect: ne,
          onApplySuggestion: It,
          onDismissSuggestion: u[11] || (u[11] = (c) => $.value = null),
          onClose: u[12] || (u[12] = (c) => b.value = !1)
        }, null, 8, ["state", "selection", "trace", "editable", "suggestion"])) : O("", !0)
      ]),
      !o.value && r.value ? (l(), d("footer", Us, [
        i("span", null, x(r.value.counts.initiatives) + " initiatives across " + x(r.value.counts.layers) + " layers", 1),
        r.value.current_period ? (l(), d("span", Bs, x(P(we)(r.value.current_period, r.value.settings.period_kind)), 1)) : O("", !0)
      ])) : O("", !0),
      k.value ? (l(), oe(Lt, {
        key: 2,
        x: k.value.x,
        y: k.value.y,
        items: k.value.items,
        onClose: bt
      }, null, 8, ["x", "y", "items"])) : O("", !0)
    ], 34));
  }
}), Gs = {
  rootComponent: Vs
};
export {
  Gs as mountConfig
};
//# sourceMappingURL=lazy-mount-DDASHL6X.js.map
