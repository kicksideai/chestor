import { f as j, u as Lt, a as Nt, e as ae, b as zt, _ as ot, c as Wt, d as Vt, W as Ft, s as Ot } from "./styles-DH7MJabM.js";
import { defineComponent as _, openBlock as s, createElementBlock as i, normalizeClass as H, createBlock as S, unref as o, createVNode as u, createElementVNode as l, createCommentVNode as p, renderSlot as vt, toDisplayString as y, withCtx as T, createTextVNode as w, ref as m, onMounted as Ee, watch as xe, onBeforeUnmount as Fe, withDirectives as Ut, vShow as Pt, nextTick as Ve, withModifiers as L, normalizeStyle as X, Fragment as z, withKeys as fe, computed as W, renderList as Q, reactive as at, onUnmounted as Bt } from "vue";
import { Icon as E } from "@iconify/vue";
import { loadByTagName as dt, define as jt } from "@wippy-fe/proxy";
const Kt = ["aria-label", "title", "disabled"], Ht = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, U = /* @__PURE__ */ _({
  __name: "IconButton",
  props: {
    icon: {},
    label: {},
    active: { type: Boolean },
    disabled: { type: Boolean },
    variant: { default: "plain" },
    tone: {},
    size: { default: "md" },
    spin: { type: Boolean }
  },
  emits: ["click"],
  setup(d, { emit: c }) {
    const $ = c;
    return (x, v) => (s(), i("button", {
      class: H(["km-iconbtn", [d.variant !== "plain" && d.variant, d.size !== "md" && d.size, d.active && "on", d.tone && `tone-${d.tone}`]]),
      "aria-label": d.label,
      title: d.label,
      disabled: d.disabled,
      onClick: v[0] || (v[0] = (f) => $("click"))
    }, [
      d.spin ? (s(), i("span", Ht)) : (s(), S(o(E), {
        key: 1,
        icon: d.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"]))
    ], 10, Kt));
  }
}), qt = { class: "km-search" }, _t = ["value", "placeholder"], Gt = /* @__PURE__ */ _({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(d, { emit: c }) {
    const $ = c;
    return (x, v) => (s(), i("div", qt, [
      u(o(E), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      l("input", {
        class: "km-search-input",
        value: d.modelValue,
        placeholder: d.placeholder || "Search",
        onInput: v[0] || (v[0] = (f) => $("update:modelValue", f.target.value))
      }, null, 40, _t),
      d.modelValue ? (s(), i("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: v[1] || (v[1] = (f) => $("update:modelValue", ""))
      }, [
        u(o(E), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : p("", !0)
    ]));
  }
}), Xt = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, it = /* @__PURE__ */ _({
  __name: "Pill",
  props: {
    tone: { default: "muted" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(d) {
    return (c, $) => (s(), i("span", {
      class: H(["km-pill", `t-${d.tone}`])
    }, [
      d.dot ? (s(), i("span", Xt)) : d.icon ? (s(), S(o(E), {
        key: 1,
        icon: d.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : p("", !0),
      vt(c.$slots, "default")
    ], 2));
  }
}), Jt = { class: "km-loading" }, Yt = { key: 0 }, rt = /* @__PURE__ */ _({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(d) {
    return (c, $) => (s(), i("div", Jt, [
      $[0] || ($[0] = l("span", {
        class: "km-spin lg",
        "aria-hidden": "true"
      }, null, -1)),
      d.label ? (s(), i("span", Yt, y(d.label), 1)) : p("", !0)
    ]));
  }
}), Qt = { class: "km-empty" }, Zt = { class: "km-empty-title" }, en = {
  key: 0,
  class: "km-empty-hint"
}, We = /* @__PURE__ */ _({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(d, { emit: c }) {
    const $ = c;
    return (x, v) => (s(), i("div", Qt, [
      u(o(E), {
        icon: d.icon,
        class: "km-empty-ico",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      l("div", Zt, y(d.title), 1),
      d.hint ? (s(), i("p", en, y(d.hint), 1)) : p("", !0),
      d.cta ? (s(), S(j, {
        key: 1,
        icon: d.ctaIcon,
        onClick: v[0] || (v[0] = (f) => $("cta"))
      }, {
        default: T(() => [
          w(y(d.cta), 1)
        ]),
        _: 1
      }, 8, ["icon"])) : p("", !0)
    ]));
  }
}), tn = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function nn(d, c) {
  return {
    "entry-id": d.id,
    route: d.id,
    mode: c,
    "read-only": String(d.access_level != null && (d.access_level & 2) !== 2)
  };
}
const ln = () => Lt(), sn = () => Nt(), on = {
  key: 0,
  class: "ws-renderer-fail"
}, De = /* @__PURE__ */ _({
  __name: "EntryRenderer",
  props: {
    tag: {},
    attrs: {},
    fill: { type: Boolean, default: !0 }
  },
  setup(d) {
    const c = d, $ = m(null), x = m(!1);
    let v = null;
    async function f(R) {
      if (!customElements.get(R) && (await dt(R, { timeoutMs: 8e3 }), !customElements.get(R)))
        throw new Error("Content is unavailable.");
    }
    async function C() {
      if (x.value = !1, !!$.value) {
        $.value.innerHTML = "", v = null;
        try {
          await f(c.tag), v = document.createElement(c.tag);
          for (const [R, k] of Object.entries(c.attrs || {}))
            k != null && k !== "" && v.setAttribute(R, String(k));
          c.fill === !1 ? (v.style.display = "block", v.style.width = "100%") : (v.style.position = "absolute", v.style.inset = "0"), $.value.appendChild(v), x.value = !customElements.get(c.tag);
        } catch {
          x.value = !0;
        }
      }
    }
    return Ee(C), xe(() => [c.tag, JSON.stringify(c.attrs)], C), Fe(() => {
      v = null;
    }), (R, k) => (s(), i("div", {
      class: H(["ws-renderer-host", { "ws-renderer-flow": d.fill === !1 }])
    }, [
      x.value ? (s(), i("div", on, [
        u(o(ae), { tone: "error" }, {
          default: T(() => [
            k[1] || (k[1] = w("Content is unavailable. ", -1)),
            u(o(j), { onClick: C }, {
              default: T(() => [...k[0] || (k[0] = [
                w("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : p("", !0),
      Ut(l("div", {
        ref_key: "host",
        ref: $,
        class: "ws-renderer-mount"
      }, null, 512), [
        [Pt, !x.value]
      ])
    ], 2));
  }
}), an = /* @__PURE__ */ _({
  __name: "MenuLayer",
  props: {
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(d, { emit: c }) {
    const $ = d, x = m(null), v = m(null), f = m({ left: "0px", top: "0px", visibility: "hidden" });
    function C() {
      const k = x.value?.getBoundingClientRect(), h = v.value?.getBoundingClientRect();
      if (!k || !h) return;
      const b = Math.max(0, Math.min($.x - k.left, k.width - h.width)), r = Math.max(0, Math.min($.y - k.top, k.height - h.height));
      f.value = { left: `${b}px`, top: `${r}px`, visibility: "visible" };
    }
    xe(() => [$.x, $.y], () => {
      Ve(C);
    }), Ee(() => {
      Ve(C), window.addEventListener("resize", C);
    }), Fe(() => window.removeEventListener("resize", C));
    const R = c;
    return (k, h) => (s(), i("div", {
      ref_key: "layer",
      ref: x,
      class: "ws-menu-layer",
      onClick: h[1] || (h[1] = (b) => R("close")),
      onContextmenu: h[2] || (h[2] = L((b) => R("close"), ["prevent"]))
    }, [
      l("div", {
        ref_key: "panel",
        ref: v,
        class: "ws-menu",
        style: X(f.value),
        onClick: h[0] || (h[0] = L(() => {
        }, ["stop"]))
      }, [
        vt(k.$slots, "default")
      ], 4)
    ], 544));
  }
}), rn = ["onKeydown"], un = {
  class: "ws-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "Sharing"
}, vn = { class: "ws-dialog-foot" }, dn = /* @__PURE__ */ _({
  __name: "ShareHost",
  props: {
    config: {}
  },
  emits: ["close", "changed"],
  setup(d, { emit: c }) {
    const $ = d, x = c, v = m(null);
    let f = null;
    const C = m(!1);
    function R() {
      x("close");
    }
    function k(b) {
      x("changed", b.detail);
    }
    async function h() {
      if (C.value = !1, !!v.value)
        try {
          if (await dt("kickside-share", { timeoutMs: 8e3 }), !customElements.get("kickside-share")) throw new Error("Sharing is unavailable.");
          f = document.createElement("kickside-share"), $.config && f.setAttribute("config", $.config), f.addEventListener("close", R), f.addEventListener("changed", k), v.value.appendChild(f);
        } catch {
          C.value = !0;
        }
    }
    return Ee(h), xe(() => $.config, (b) => {
      f && b && f.setAttribute("config", b);
    }), Fe(() => {
      f && (f.removeEventListener("close", R), f.removeEventListener("changed", k), f.remove(), f = null);
    }), (b, r) => (s(), i(z, null, [
      l("div", {
        ref_key: "host",
        ref: v,
        class: "ws-share-host"
      }, null, 512),
      C.value ? (s(), i("div", {
        key: 0,
        class: "ws-modal",
        onKeydown: fe(L(R, ["stop"]), ["esc"]),
        onClick: L(R, ["self"])
      }, [
        l("section", un, [
          u(o(ae), {
            tone: "error",
            onDismiss: R
          }, {
            default: T(() => [...r[0] || (r[0] = [
              w("Sharing is unavailable.", -1)
            ])]),
            _: 1
          }),
          l("div", vn, [
            u(o(j), {
              "aria-label": "Retry sharing",
              onClick: h
            }, {
              default: T(() => [...r[1] || (r[1] = [
                w("Retry", -1)
              ])]),
              _: 1
            }),
            u(o(j), {
              variant: "ghost",
              onClick: R
            }, {
              default: T(() => [...r[2] || (r[2] = [
                w("Close", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ], 40, rn)) : p("", !0)
    ], 64));
  }
}), cn = { class: "ws-cv-section" }, fn = { class: "ws-cv-row" }, mn = { class: "ws-cv-v" }, pn = { class: "ws-cv-row" }, yn = { class: "ws-cv-v" }, wn = { class: "ws-cv-row" }, gn = { class: "ws-cv-v" }, kn = {
  key: 0,
  class: "ws-cv-section"
}, bn = {
  key: 0,
  class: "ws-cv-row"
}, Cn = { class: "ws-cv-v" }, $n = {
  key: 1,
  class: "ws-cv-row"
}, Dn = { class: "ws-cv-v" }, En = {
  key: 1,
  class: "ws-cv-section"
}, xn = { class: "ws-cv-k" }, hn = { class: "ws-cv-v" }, ut = /* @__PURE__ */ _({
  __name: "ComponentView",
  props: {
    entry: {},
    mode: {}
  },
  setup(d) {
    const c = d, $ = /* @__PURE__ */ new Set(["title", "name", "icon", "type", "status", "color", "renderer"]);
    function x(b) {
      if (b == null || b === "") return null;
      if (typeof b == "number") return new Date(b < 2e10 ? b * 1e3 : b);
      const r = new Date(String(b));
      return isNaN(r.getTime()) ? null : r;
    }
    function v(b) {
      const r = x(b);
      return r ? r.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    }
    const f = W(() => ((c.entry.type || "item").split(".").pop() || "item").replace(/[_-]/g, " ").toUpperCase()), C = W(() => v(c.entry.created_at)), R = W(() => v(c.entry.updated_at)), k = W(() => {
      const b = c.entry.access_level;
      if (b == null) return "Full (owner)";
      const r = [];
      return b & 1 && r.push("Read"), b & 2 && r.push("Write"), b & 4 && r.push("Delete"), b & 8 && r.push("Admin"), r.length ? r.join(" · ") : "None";
    }), h = W(() => {
      const b = c.entry.meta || {}, r = [];
      for (const [G, D] of Object.entries(b)) {
        if ($.has(G) || D == null || typeof D == "object") continue;
        const ne = String(D);
        ne !== "" && r.push({ k: G.replace(/[_-]/g, " "), v: ne });
      }
      return r;
    });
    return (b, r) => (s(), i("div", {
      class: H(["ws-cv", `ws-cv--${d.mode || "preview"}`])
    }, [
      l("div", cn, [
        l("div", fn, [
          r[0] || (r[0] = l("span", { class: "ws-cv-k" }, "Type", -1)),
          l("span", mn, y(f.value), 1)
        ]),
        l("div", pn, [
          r[1] || (r[1] = l("span", { class: "ws-cv-k" }, "Status", -1)),
          l("span", yn, y(d.entry.status || "active"), 1)
        ]),
        l("div", wn, [
          r[2] || (r[2] = l("span", { class: "ws-cv-k" }, "Access", -1)),
          l("span", gn, y(k.value), 1)
        ])
      ]),
      C.value || R.value ? (s(), i("div", kn, [
        C.value ? (s(), i("div", bn, [
          r[3] || (r[3] = l("span", { class: "ws-cv-k" }, "Created", -1)),
          l("span", Cn, y(C.value), 1)
        ])) : p("", !0),
        R.value ? (s(), i("div", $n, [
          r[4] || (r[4] = l("span", { class: "ws-cv-k" }, "Updated", -1)),
          l("span", Dn, y(R.value), 1)
        ])) : p("", !0)
      ])) : p("", !0),
      h.value.length ? (s(), i("div", En, [
        r[5] || (r[5] = l("div", { class: "ws-cv-sec-title" }, "Metadata", -1)),
        (s(!0), i(z, null, Q(h.value, (G) => (s(), i("div", {
          key: G.k,
          class: "ws-cv-row"
        }, [
          l("span", xn, y(G.k), 1),
          l("span", hn, y(G.v), 1)
        ]))), 128))
      ])) : p("", !0)
    ], 2));
  }
}), Sn = { class: "ws-strip" }, Tn = { class: "ws-crumbs" }, Rn = ["title", "onClick", "onDragover", "onDrop"], Mn = { class: "ws-body" }, An = {
  key: 0,
  class: "ws-drop-hint"
}, In = {
  key: 2,
  class: "ws-list"
}, Ln = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], Nn = { class: "ws-row-name" }, zn = { class: "ws-age" }, Wn = ["aria-label", "onClick"], Vn = {
  key: 3,
  class: "ws-grid"
}, Fn = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], On = ["aria-label", "onClick"], Un = ["title"], Pn = { class: "ws-preview-head" }, Bn = { class: "ws-preview-title" }, jn = {
  key: 5,
  class: "ws-menu-div"
}, Kn = { class: "ws-dialog" }, Hn = {
  class: "ws-dialog-head",
  id: "ws-new-heading"
}, qn = { class: "ws-type-grid" }, _n = ["title", "onClick"], Gn = { class: "ws-create-panel" }, Xn = { class: "ws-dialog" }, Jn = { class: "ws-dialog-head" }, Yn = {
  key: 0,
  class: "ws-confirm-body"
}, Qn = {
  key: 1,
  class: "ws-confirm-body"
}, Zn = {
  key: 2,
  class: "ws-confirm-body"
}, el = { class: "ws-dialog-foot" }, tl = { class: "ws-dialog-head" }, nl = { class: "ws-name-row" }, ll = { class: "ws-swatches" }, sl = ["title", "aria-label", "onClick"], ol = { class: "ws-meta-grid" }, al = { class: "ws-dialog-foot" }, il = { class: "ws-dialog" }, rl = { class: "ws-dialog-head" }, ul = { class: "ws-move-crumbs" }, vl = ["onClick"], dl = { class: "ws-move-list" }, cl = ["onClick"], fl = {
  key: 0,
  class: "ws-move-none"
}, ml = { class: "ws-dialog-foot" }, pl = {
  key: 10,
  class: "ws-manage"
}, yl = { class: "ws-manage-head" }, wl = { class: "ws-manage-title" }, gl = "wc-entry-create", kl = /* @__PURE__ */ _({
  __name: "Workspace",
  setup(d) {
    const c = zt(), $ = ln(), x = sn(), v = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };
    function f(n, e) {
      const t = n?.access_level;
      return t == null || (Number(t) & e) === e;
    }
    function C(n) {
      return !!n && (n.type === "folder" || !!n.container);
    }
    function R(n) {
      if (n == null) return "Full";
      const e = Number(n), a = [[v.READ, "Read"], [v.WRITE, "Write"], [v.DELETE, "Delete"], [v.ADMIN, "Admin"]].filter(([O]) => (e & O) === O).map(([, O]) => O);
      return a.length ? a.join(" · ") : "None";
    }
    const k = m([]), h = m(""), b = m([]), r = m(null), G = m(null), D = m(null), ne = m(!1), A = m(""), le = m(localStorage.getItem("ws-view") || "list"), J = m(!1), N = m(null), Oe = m(null), he = m(!1), se = m(!1), ie = W(() => {
      const n = {};
      for (const e of c.types.value) n[e.value] = e;
      return n;
    }), ct = W(() => {
      const n = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
      for (const t of c.types.value) (n.has(t.value) ? e : n).add(t.value);
      return e;
    }), ft = W(() => c.types.value.filter((n) => n.creatable && !n.picker_excluded && n.create?.view).sort((n, e) => n.value === "folder" ? -1 : e.value === "folder" ? 1 : (n.label || "").localeCompare(e.label || ""))), Se = W(() => f(G.value, v.WRITE)), me = W(() => {
      const n = h.value.trim().toLowerCase();
      return (n ? k.value.filter((t) => (t.name || "").toLowerCase().includes(n)) : [...k.value]).sort((t, a) => {
        const O = C(t) ? 0 : 1, ce = C(a) ? 0 : 1;
        return O !== ce ? O - ce : (t.name || "").localeCompare(a.name || "", void 0, { sensitivity: "base" });
      });
    });
    function re(n) {
      return n.icon || n.meta?.icon || ie.value[n.type]?.icon || "tabler:file";
    }
    function ue(n) {
      return n.meta?.color || ie.value[n.type]?.color || "var(--km-muted)";
    }
    function Te(n) {
      const e = ct.value.has(n.type) ? "" : ie.value[n.type]?.label;
      return e ? e.toUpperCase() : ((n.type || "item").split(".").pop() || "item").replace(/[_-]+/g, " ").toUpperCase();
    }
    function Ue(n) {
      if (n == null || n === "") return null;
      if (typeof n == "number") return new Date(n < 2e10 ? n * 1e3 : n);
      const e = new Date(String(n));
      return isNaN(e.getTime()) ? null : e;
    }
    function mt(n) {
      const e = Ue(n);
      if (!e) return "";
      const t = Math.floor((Date.now() - e.getTime()) / 1e3);
      return t < 60 ? "now" : t < 3600 ? Math.floor(t / 60) + "m" : t < 86400 ? Math.floor(t / 3600) + "h" : Math.floor(t / 86400) + "d";
    }
    function Pe(n) {
      const e = Ue(n);
      return e ? e.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function pe(n) {
      const e = n.renderer || ie.value[n.type]?.renderer;
      return e ? e.startsWith("/c/") ? e.slice(3) : e : "";
    }
    function Be(n, e) {
      const t = nn(n, e), a = n.meta?.upload_id;
      return a && (t["source-url"] = `/api/v1/uploads/${a}/raw`, t["content-type"] = n.meta?.content_type || "", t.filename = n.name), t;
    }
    const I = m(null), je = W(() => String($.value.route || "").replace(/^\/+|\/+$/g, "").split("/")[0] || "");
    function ye(n) {
      F(), x("navigate", n.id);
    }
    function we() {
      x("navigate", r.value || "");
    }
    async function Ke() {
      const n = je.value;
      if (!n) {
        I.value = null, (r.value !== null || k.value.length === 0) && await P(null);
        return;
      }
      let e = k.value.find((a) => a.id === n) || null;
      if (!e)
        try {
          e = await c.get(n);
        } catch (a) {
          A.value = a instanceof Error ? a.message : "failed to open entry";
          return;
        }
      if (!e) {
        A.value = "entry not found";
        return;
      }
      if (C(e)) {
        I.value = null, r.value !== n && await P(n);
        return;
      }
      const t = e.parent_id ?? null;
      (r.value !== t || k.value.length === 0) && await P(t), I.value = e;
    }
    xe(je, Ke);
    let ve = 0;
    async function P(n) {
      const e = n === r.value && k.value.length > 0;
      r.value = n, e || (D.value = null, h.value = "", ne.value = !0), F(), A.value = "";
      const t = ++ve;
      try {
        const a = await c.list(n);
        if (t !== ve) return;
        k.value = a;
        const O = D.value;
        if (O && !a.some((ce) => ce.id === O.id) && (D.value = null), b.value = n ? await c.breadcrumbs(n) : [], G.value = n ? await c.get(n) : null, t !== ve) return;
      } catch (a) {
        if (t !== ve) return;
        A.value = a instanceof Error ? a.message : "failed to load", e || (k.value = []);
      } finally {
        t === ve && (ne.value = !1);
      }
    }
    function Z(n) {
      if (C(n)) {
        x("navigate", n.id);
        return;
      }
      D.value = D.value?.id === n.id ? null : n;
    }
    const He = W(() => ({
      type: N.value?.value || "",
      "parent-id": r.value || "",
      mode: "create"
    })), pt = W(() => N.value?.create?.view === gl);
    function yt(n) {
      J.value = !1, N.value = n;
    }
    function qe() {
      N.value = null, P(r.value);
    }
    function wt() {
      P(r.value);
      for (const n of [900, 2200, 4500]) setTimeout(() => P(r.value), n);
    }
    async function _e(n, e) {
      he.value = !0, A.value = "";
      try {
        for (const t of n) await c.uploadFile(t, e);
        wt();
      } catch (t) {
        A.value = t instanceof Error ? t.message : "upload failed";
      } finally {
        he.value = !1;
      }
    }
    async function Ge(n, e) {
      await _e(n, e);
    }
    function gt(n) {
      _e(Array.from(n), r.value);
    }
    function kt(n) {
      const e = n.target;
      e.files?.length && gt(e.files), e.value = "";
    }
    function bt(n) {
      if (n.preventDefault(), se.value = !1, q.value || !Se.value) return;
      const e = n.dataTransfer?.files;
      e?.length && Ge(Array.from(e), r.value);
    }
    const q = m(null), V = m(null);
    function Xe(n, e) {
      if (!f(e, v.WRITE)) {
        n.preventDefault();
        return;
      }
      q.value = e.id, n.dataTransfer?.setData("text/plain", e.id);
    }
    function Je() {
      q.value = null, V.value = null;
    }
    async function Re(n, e) {
      const t = q.value;
      if (q.value = null, V.value = null, !(!t || t === n) && !(e && !f(e, v.WRITE)))
        try {
          await c.move(t, n), P(r.value);
        } catch (a) {
          A.value = a instanceof Error ? a.message : "move failed";
        }
    }
    function Ye(n, e) {
      if (n.preventDefault(), n.stopPropagation(), se.value = !1, !C(e)) return;
      if (q.value) {
        Re(e.id, e);
        return;
      }
      const t = n.dataTransfer?.files;
      t?.length && f(e, v.WRITE) && Ge(Array.from(t), e.id);
    }
    function Qe(n, e) {
      C(e) && (n.preventDefault(), V.value = e.id);
    }
    const M = at({ entry: null, x: 0, y: 0 });
    function ge(n, e) {
      e.preventDefault(), e.stopPropagation(), M.entry = n, M.x = e.clientX, M.y = e.clientY;
    }
    function F() {
      M.entry = null;
    }
    const de = m("");
    let Ze;
    function et(n) {
      de.value = n, clearTimeout(Ze), Ze = setTimeout(() => {
        de.value = "";
      }, 1800);
    }
    async function Ct(n) {
      F();
      try {
        await navigator.clipboard.writeText(n.id), et("ID copied");
      } catch {
        A.value = "clipboard unavailable";
      }
    }
    const B = m(null), Me = m(null), Ae = m([]), Ie = m([]), Le = m(!1);
    async function ke(n) {
      Le.value = !0;
      try {
        Me.value = n;
        const e = await c.list(n);
        Ie.value = e.filter((t) => C(t) && t.id !== B.value?.id && f(t, v.WRITE)), Ae.value = n ? await c.breadcrumbs(n) : [];
      } catch (e) {
        A.value = e instanceof Error ? e.message : "failed to browse";
      } finally {
        Le.value = !1;
      }
    }
    function $t(n) {
      F(), B.value = n, ke(r.value);
    }
    async function Dt() {
      const n = B.value;
      if (!n) return;
      const e = Me.value;
      if (B.value = null, e !== (n.parent_id ?? null))
        try {
          await c.move(n.id, e), et(`Moved to ${Ae.value.at(-1)?.name || "root"}`), P(r.value);
        } catch (t) {
          A.value = t instanceof Error ? t.message : "move failed";
        }
    }
    async function Et(n) {
      F();
      try {
        const e = await c.exportEntry(n.id), t = URL.createObjectURL(e), a = document.createElement("a");
        a.href = t, a.download = `${n.name || "entry"}.kxb`, a.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
      } catch (e) {
        A.value = e instanceof Error ? e.message : "export failed";
      }
    }
    function tt(n, e) {
      if (n.key === "ArrowDown" || n.key === "ArrowUp") {
        n.preventDefault();
        const t = n.currentTarget, a = [...t.parentElement?.children || []].filter((It) => It.matches?.(".ws-row, .ws-tile")), O = a.indexOf(t);
        a[n.key === "ArrowDown" ? O + 1 : O - 1]?.focus();
      } else n.key === "F2" && f(e, v.WRITE) ? (n.preventDefault(), Ce(e)) : n.key === "Delete" && f(e, v.DELETE) && (n.preventDefault(), nt(e));
    }
    const K = m(null), be = m(""), ee = m(null);
    async function nt(n) {
      if (F(), K.value = n, ee.value = null, C(n))
        try {
          ee.value = await c.countDescendants(n.id);
        } catch (e) {
          A.value = e instanceof Error ? e.message : "failed to inspect folder";
        }
    }
    async function xt() {
      const n = K.value;
      if (K.value = null, ee.value = null, !!n)
        try {
          const e = await c.remove(n.id);
          be.value = e.inProgress ? `Deleting "${n.name}": cleanup is in progress and continues in the background.` : "", D.value?.id === n.id && (D.value = null), I.value?.id === n.id && we(), P(r.value);
        } catch (e) {
          A.value = e instanceof Error ? e.message : "failed to delete";
        }
    }
    const g = at(
      { open: !1, entry: null, name: "", icon: "", color: "" }
    ), ht = [{ label: "Default", value: "" }, ...tn], oe = m(""), lt = m(null);
    function Ce(n) {
      F(), g.entry = n, g.name = n.name, g.icon = n.meta?.icon || "", g.color = n.meta?.color || "", oe.value = "", g.open = !0, Ve(() => {
        const e = lt.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])');
        e?.focus(), e?.select();
      });
    }
    async function St() {
      if (g.entry) {
        oe.value = "";
        try {
          await c.update(g.entry.id, { name: g.name.trim() || g.entry.name, icon: g.icon, color: g.color }), g.open = !1, P(r.value);
        } catch (n) {
          oe.value = n instanceof Error ? n.message : "failed to save";
        }
      }
    }
    function Tt() {
      le.value = le.value === "list" ? "grid" : "list", localStorage.setItem("ws-view", le.value);
    }
    const Y = m(null), Rt = W(() => {
      const n = Y.value;
      return n ? JSON.stringify({
        resource_id: n.id,
        title: n.name,
        access_url: `/api/v1/component-access/grants/${n.id}`,
        share_url: `/api/v1/component-access/share/${n.id}`
      }) : "";
    }), $e = m(parseInt(localStorage.getItem("ws-panel-w") || "440", 10)), Ne = m(!1);
    let te = null;
    function Mt(n) {
      n.preventDefault(), te = { pointerId: n.pointerId, x: n.clientX, width: $e.value }, Ne.value = !0, n.currentTarget.setPointerCapture(n.pointerId);
    }
    function At(n) {
      if (!te || n.pointerId !== te.pointerId) return;
      const e = te.width + te.x - n.clientX;
      $e.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), e));
    }
    function ze() {
      te && (te = null, Ne.value = !1, localStorage.setItem("ws-panel-w", String($e.value)));
    }
    function st(n) {
      n.key === "Escape" && (F(), K.value ? (K.value = null, ee.value = null) : J.value ? J.value = !1 : N.value ? N.value = null : Y.value ? Y.value = null : B.value ? B.value = null : g.open ? g.open = !1 : I.value && we());
    }
    return Ee(async () => {
      window.addEventListener("keydown", st), await c.loadTypes(), c.error.value && (A.value = c.error.value), await Ke();
    }), Bt(() => window.removeEventListener("keydown", st)), (n, e) => (s(), i("div", {
      class: "ws",
      onClick: F
    }, [
      l("div", Sn, [
        l("button", {
          class: H(["ws-home", { "ws-crumb--drop": q.value && V.value === "" }]),
          title: "Workspace root",
          "aria-label": "Workspace root",
          onClick: e[0] || (e[0] = (t) => o(x)("navigate", "")),
          onDragover: e[1] || (e[1] = L((t) => V.value = "", ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => V.value = null),
          onDrop: e[3] || (e[3] = (t) => Re(null))
        }, [
          u(o(E), { icon: "tabler:home" })
        ], 34),
        l("div", Tn, [
          (s(!0), i(z, null, Q(b.value, (t) => (s(), i(z, {
            key: t.id
          }, [
            e[55] || (e[55] = l("span", { class: "ws-sep" }, "/", -1)),
            l("button", {
              class: H(["ws-crumb", { "ws-crumb--drop": q.value && V.value === t.id }]),
              title: t.name,
              onClick: (a) => o(x)("navigate", t.id),
              onDragover: L((a) => V.value = t.id, ["prevent"]),
              onDragleave: e[4] || (e[4] = (a) => V.value = null),
              onDrop: (a) => Re(t.id)
            }, y(t.name), 43, Rn)
          ], 64))), 128))
        ]),
        e[57] || (e[57] = l("span", { class: "ws-spacer" }, null, -1)),
        u(o(Gt), {
          modelValue: h.value,
          "onUpdate:modelValue": e[5] || (e[5] = (t) => h.value = t),
          placeholder: "Filter this folder",
          class: "ws-filter"
        }, null, 8, ["modelValue"]),
        u(o(U), {
          icon: le.value === "list" ? "tabler:layout-grid" : "tabler:list",
          label: le.value === "list" ? "Grid view" : "List view",
          size: "sm",
          onClick: Tt
        }, null, 8, ["icon", "label"]),
        u(o(U), {
          icon: "tabler:upload",
          label: "Upload files",
          size: "sm",
          spin: he.value,
          disabled: !Se.value,
          onClick: e[6] || (e[6] = (t) => Oe.value?.click())
        }, null, 8, ["spin", "disabled"]),
        u(o(j), {
          icon: "tabler:plus",
          small: "",
          onClick: e[7] || (e[7] = (t) => J.value = !0)
        }, {
          default: T(() => [...e[56] || (e[56] = [
            w("New", -1)
          ])]),
          _: 1
        }),
        l("input", {
          ref_key: "fileInput",
          ref: Oe,
          type: "file",
          multiple: "",
          hidden: "",
          onChange: kt
        }, null, 544)
      ]),
      A.value ? (s(), S(o(ae), {
        key: 0,
        tone: "error",
        onDismiss: e[9] || (e[9] = (t) => A.value = "")
      }, {
        default: T(() => [
          w(y(A.value) + " ", 1),
          u(o(j), {
            variant: "ghost",
            small: "",
            onClick: e[8] || (e[8] = (t) => P(r.value))
          }, {
            default: T(() => [...e[58] || (e[58] = [
              w("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : p("", !0),
      de.value ? (s(), S(o(ae), {
        key: 1,
        onDismiss: e[10] || (e[10] = (t) => de.value = "")
      }, {
        default: T(() => [
          w(y(de.value), 1)
        ]),
        _: 1
      })) : p("", !0),
      be.value ? (s(), S(o(ae), {
        key: 2,
        onDismiss: e[11] || (e[11] = (t) => be.value = "")
      }, {
        default: T(() => [
          w(y(be.value), 1)
        ]),
        _: 1
      })) : p("", !0),
      l("div", Mn, [
        l("div", {
          class: H(["ws-list-pane", { "ws-list-pane--aside": D.value, "ws-list-pane--drop": se.value }]),
          onDragover: e[16] || (e[16] = L((t) => se.value = !q.value, ["prevent"])),
          onDragleave: e[17] || (e[17] = (t) => se.value = !1),
          onDrop: bt
        }, [
          se.value ? (s(), i("div", An, [
            u(o(E), { icon: "tabler:upload" }),
            e[59] || (e[59] = w(" Drop to upload", -1))
          ])) : p("", !0),
          ne.value ? (s(), S(o(rt), {
            key: 1,
            label: "Loading…"
          })) : me.value.length && le.value === "list" ? (s(), i("div", In, [
            (s(!0), i(z, null, Q(me.value, (t) => (s(), i("div", {
              key: t.id,
              class: H(["ws-row", {
                "ws-row--sel": D.value?.id === t.id,
                "ws-row--drop": V.value === t.id,
                "ws-row--drag": q.value === t.id
              }]),
              draggable: f(t, v.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (a) => Xe(a, t),
              onDragend: Je,
              onDragover: (a) => Qe(a, t),
              onDragleave: e[12] || (e[12] = (a) => V.value = null),
              onDrop: (a) => Ye(a, t),
              onClick: (a) => Z(t),
              onDblclick: (a) => C(t) ? o(x)("navigate", t.id) : ye(t),
              onKeydown: [
                fe((a) => Z(t), ["enter"]),
                fe(L((a) => Z(t), ["prevent"]), ["space"]),
                (a) => tt(a, t)
              ],
              onContextmenu: (a) => ge(t, a)
            }, [
              e[60] || (e[60] = l("span", { class: "ws-edge" }, null, -1)),
              u(o(E), {
                icon: re(t),
                class: "ws-row-ico",
                style: X({ color: ue(t) })
              }, null, 8, ["icon", "style"]),
              l("span", Nn, y(t.name), 1),
              u(o(it), { tone: "muted" }, {
                default: T(() => [
                  w(y(Te(t)), 1)
                ]),
                _: 2
              }, 1024),
              l("span", zn, y(mt(t.updated_at)), 1),
              l("button", {
                class: "ws-row-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: L((a) => ge(t, a), ["stop"])
              }, [
                u(o(E), { icon: "tabler:dots" })
              ], 8, Wn)
            ], 42, Ln))), 128))
          ])) : me.value.length ? (s(), i("div", Vn, [
            (s(!0), i(z, null, Q(me.value, (t) => (s(), i("div", {
              key: t.id,
              class: H(["ws-tile", {
                "ws-tile--sel": D.value?.id === t.id,
                "ws-row--drop": V.value === t.id
              }]),
              draggable: f(t, v.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (a) => Xe(a, t),
              onDragend: Je,
              onDragover: (a) => Qe(a, t),
              onDragleave: e[13] || (e[13] = (a) => V.value = null),
              onDrop: (a) => Ye(a, t),
              onClick: (a) => Z(t),
              onDblclick: (a) => C(t) ? o(x)("navigate", t.id) : ye(t),
              onKeydown: [
                fe((a) => Z(t), ["enter"]),
                fe(L((a) => Z(t), ["prevent"]), ["space"]),
                (a) => tt(a, t)
              ],
              onContextmenu: (a) => ge(t, a)
            }, [
              l("button", {
                class: "ws-row-menu ws-tile-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: L((a) => ge(t, a), ["stop"])
              }, [
                u(o(E), { icon: "tabler:dots" })
              ], 8, On),
              u(o(E), {
                icon: re(t),
                class: "ws-tile-ico",
                style: X({ color: ue(t) })
              }, null, 8, ["icon", "style"]),
              l("span", {
                class: "ws-tile-name",
                title: t.name
              }, y(t.name), 9, Un)
            ], 42, Fn))), 128))
          ])) : k.value.length ? (s(), S(o(We), {
            key: 4,
            icon: "tabler:search-off",
            title: "No matches",
            hint: `Nothing here matches “${h.value}”.`,
            cta: "Clear filter",
            "cta-icon": "tabler:x",
            onCta: e[14] || (e[14] = (t) => h.value = "")
          }, null, 8, ["hint"])) : Se.value ? (s(), S(o(We), {
            key: 5,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Create a folder or entry, or upload files.",
            cta: "New entry",
            "cta-icon": "tabler:plus",
            onCta: e[15] || (e[15] = (t) => J.value = !0)
          })) : (s(), S(o(We), {
            key: 6,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Nothing has been shared into this folder yet."
          }))
        ], 34),
        D.value ? (s(), i(z, { key: 0 }, [
          l("div", {
            class: H(["ws-divider", { resizing: Ne.value }]),
            onPointerdown: Mt,
            onPointermove: At,
            onPointerup: ze,
            onPointercancel: ze,
            onLostpointercapture: ze
          }, null, 34),
          l("aside", {
            class: "ws-preview",
            style: X({ "--ws-preview-width": $e.value + "px" })
          }, [
            l("div", Pn, [
              u(o(E), {
                icon: re(D.value),
                style: X({ color: ue(D.value) })
              }, null, 8, ["icon", "style"]),
              l("span", Bn, y(D.value.name), 1),
              e[61] || (e[61] = l("span", { class: "ws-spacer" }, null, -1)),
              D.value.type !== "folder" ? (s(), S(o(U), {
                key: 0,
                icon: "tabler:maximize",
                label: "Open (full)",
                size: "sm",
                onClick: e[18] || (e[18] = (t) => ye(D.value))
              })) : p("", !0),
              f(D.value, v.ADMIN) ? (s(), S(o(U), {
                key: 1,
                icon: "tabler:share-3",
                label: "Share",
                size: "sm",
                onClick: e[19] || (e[19] = (t) => Y.value = D.value)
              })) : p("", !0),
              u(o(U), {
                icon: "tabler:adjustments",
                label: "Properties",
                size: "sm",
                onClick: e[20] || (e[20] = (t) => Ce(D.value))
              }),
              u(o(U), {
                icon: "tabler:x",
                label: "Close",
                size: "sm",
                onClick: e[21] || (e[21] = (t) => D.value = null)
              })
            ]),
            pe(D.value) ? (s(), S(De, {
              key: 0,
              tag: pe(D.value),
              attrs: Be(D.value, "preview"),
              class: "ws-renderer"
            }, null, 8, ["tag", "attrs"])) : (s(), S(ut, {
              key: 1,
              entry: D.value,
              mode: "preview",
              class: "ws-renderer"
            }, null, 8, ["entry"]))
          ], 4)
        ], 64)) : p("", !0)
      ]),
      M.entry ? (s(), S(an, {
        key: 3,
        x: M.x,
        y: M.y,
        onClose: F
      }, {
        default: T(() => [
          C(M.entry) ? (s(), i("button", {
            key: 0,
            class: "ws-menu-item",
            onClick: e[22] || (e[22] = (t) => {
              o(x)("navigate", M.entry.id), F();
            })
          }, [
            u(o(E), { icon: "tabler:folder-open" }),
            e[62] || (e[62] = w(" Open", -1))
          ])) : (s(), i(z, { key: 1 }, [
            l("button", {
              class: "ws-menu-item",
              onClick: e[23] || (e[23] = (t) => {
                Z(M.entry), F();
              })
            }, [
              u(o(E), { icon: "tabler:eye" }),
              e[63] || (e[63] = w(" Preview", -1))
            ]),
            l("button", {
              class: "ws-menu-item",
              onClick: e[24] || (e[24] = (t) => ye(M.entry))
            }, [
              u(o(E), { icon: "tabler:maximize" }),
              e[64] || (e[64] = w(" Open (manage)", -1))
            ])
          ], 64)),
          f(M.entry, v.WRITE) ? (s(), i("button", {
            key: 2,
            class: "ws-menu-item",
            onClick: e[25] || (e[25] = (t) => Ce(M.entry))
          }, [
            u(o(E), { icon: "tabler:cursor-text" }),
            e[65] || (e[65] = w(" Rename…", -1))
          ])) : p("", !0),
          f(M.entry, v.WRITE) ? (s(), i("button", {
            key: 3,
            class: "ws-menu-item",
            onClick: e[26] || (e[26] = (t) => $t(M.entry))
          }, [
            u(o(E), { icon: "tabler:folder-symlink" }),
            e[66] || (e[66] = w(" Move to…", -1))
          ])) : p("", !0),
          f(M.entry, v.ADMIN) ? (s(), i("button", {
            key: 4,
            class: "ws-menu-item",
            onClick: e[27] || (e[27] = (t) => {
              Y.value = M.entry, F();
            })
          }, [
            u(o(E), { icon: "tabler:user-plus" }),
            e[67] || (e[67] = w(" Share…", -1))
          ])) : p("", !0),
          l("button", {
            class: "ws-menu-item",
            onClick: e[28] || (e[28] = (t) => Et(M.entry))
          }, [
            u(o(E), { icon: "tabler:package-export" }),
            e[68] || (e[68] = w(" Export", -1))
          ]),
          l("button", {
            class: "ws-menu-item",
            onClick: e[29] || (e[29] = (t) => Ct(M.entry))
          }, [
            u(o(E), { icon: "tabler:copy" }),
            e[69] || (e[69] = w(" Copy ID", -1))
          ]),
          f(M.entry, v.DELETE) ? (s(), i("div", jn)) : p("", !0),
          f(M.entry, v.DELETE) ? (s(), i("button", {
            key: 6,
            class: "ws-menu-item ws-menu-danger",
            onClick: e[30] || (e[30] = (t) => nt(M.entry))
          }, [
            u(o(E), { icon: "tabler:trash" }),
            e[70] || (e[70] = w(" Delete", -1))
          ])) : p("", !0)
        ]),
        _: 1
      }, 8, ["x", "y"])) : p("", !0),
      J.value ? (s(), i("div", {
        key: 4,
        class: "ws-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "ws-new-heading",
        onClick: e[32] || (e[32] = L((t) => J.value = !1, ["self"]))
      }, [
        l("div", Kn, [
          l("div", Hn, [
            e[71] || (e[71] = w("New entry", -1)),
            e[72] || (e[72] = l("span", { class: "ws-spacer" }, null, -1)),
            u(o(U), {
              icon: "tabler:x",
              label: "Close new entry",
              size: "sm",
              onClick: e[31] || (e[31] = (t) => J.value = !1)
            })
          ]),
          l("div", qn, [
            (s(!0), i(z, null, Q(ft.value, (t) => (s(), i("button", {
              key: t.value,
              type: "button",
              class: "ws-type-btn",
              title: t.description || t.label,
              onClick: (a) => yt(t)
            }, [
              u(o(E), {
                icon: t.icon,
                style: X({ color: t.color })
              }, null, 8, ["icon", "style"]),
              l("span", null, y(t.label), 1)
            ], 8, _n))), 128))
          ])
        ])
      ])) : p("", !0),
      N.value?.create?.view && pt.value ? (s(), i("div", {
        key: 5,
        class: "ws-modal",
        onCreated: qe,
        onClose: e[33] || (e[33] = (t) => N.value = null),
        onClick: e[34] || (e[34] = L((t) => N.value = null, ["self"]))
      }, [
        u(De, {
          tag: N.value.create.view,
          attrs: He.value
        }, null, 8, ["tag", "attrs"])
      ], 32)) : N.value?.create?.view ? (s(), i("div", {
        key: 6,
        class: "ws-modal",
        onCreated: qe,
        onClose: e[35] || (e[35] = (t) => N.value = null),
        onClick: e[36] || (e[36] = L((t) => N.value = null, ["self"]))
      }, [
        l("div", Gn, [
          u(De, {
            tag: N.value.create.view,
            attrs: He.value,
            fill: !1,
            class: "ws-create-mount"
          }, null, 8, ["tag", "attrs"])
        ])
      ], 32)) : p("", !0),
      K.value ? (s(), i("div", {
        key: 7,
        class: "ws-modal",
        onClick: e[38] || (e[38] = L((t) => {
          K.value = null, ee.value = null;
        }, ["self"]))
      }, [
        l("div", Xn, [
          l("div", Jn, "Delete " + y(C(K.value) ? "folder" : "entry"), 1),
          C(K.value) ? (s(), i("div", Yn, " Deletes this folder and " + y(ee.value ?? "…") + " entries. Uploaded files stay in Files. ", 1)) : K.value.type === "file" ? (s(), i("div", Qn, "Removes it from the workspace. The file stays in Files.")) : (s(), i("div", Zn, "Deletes this entry from the workspace.")),
          l("div", el, [
            u(o(j), {
              variant: "ghost",
              onClick: e[37] || (e[37] = (t) => {
                K.value = null, ee.value = null;
              })
            }, {
              default: T(() => [...e[73] || (e[73] = [
                w("Cancel", -1)
              ])]),
              _: 1
            }),
            u(o(j), {
              icon: "tabler:trash",
              onClick: xt
            }, {
              default: T(() => [...e[74] || (e[74] = [
                w("Delete", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])) : p("", !0),
      g.open && g.entry ? (s(), i("div", {
        key: 8,
        class: "ws-modal",
        onClick: e[44] || (e[44] = L((t) => g.open = !1, ["self"]))
      }, [
        l("div", {
          ref_key: "propsDialogEl",
          ref: lt,
          class: "ws-dialog"
        }, [
          l("div", tl, [
            e[75] || (e[75] = w("Properties", -1)),
            e[76] || (e[76] = l("span", { class: "ws-spacer" }, null, -1)),
            u(o(U), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[39] || (e[39] = (t) => g.open = !1)
            })
          ]),
          oe.value ? (s(), S(o(ae), {
            key: 0,
            tone: "error",
            onDismiss: e[40] || (e[40] = (t) => oe.value = "")
          }, {
            default: T(() => [
              w(y(oe.value), 1)
            ]),
            _: 1
          })) : p("", !0),
          u(o(ot), { label: "Name" }, {
            default: T(() => [
              l("div", nl, [
                u(o(Wt), {
                  modelValue: g.icon,
                  "onUpdate:modelValue": e[41] || (e[41] = (t) => g.icon = t),
                  fallback: ie.value[g.entry.type]?.icon
                }, null, 8, ["modelValue", "fallback"]),
                u(o(Vt), {
                  modelValue: g.name,
                  "onUpdate:modelValue": e[42] || (e[42] = (t) => g.name = t)
                }, null, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          u(o(ot), { label: "Color" }, {
            default: T(() => [
              l("div", ll, [
                (s(), i(z, null, Q(ht, (t) => l("button", {
                  key: t.value,
                  type: "button",
                  class: H(["ws-swatch", { on: g.color === t.value }]),
                  title: t.label,
                  "aria-label": `Use color ${t.label}`,
                  style: X({ background: t.value || "transparent" }),
                  onClick: (a) => g.color = t.value
                }, [
                  t.value ? p("", !0) : (s(), S(o(E), {
                    key: 0,
                    icon: "tabler:ban"
                  }))
                ], 14, sl)), 64))
              ])
            ]),
            _: 1
          }),
          l("div", ol, [
            l("div", null, [
              e[77] || (e[77] = l("span", null, "Type", -1)),
              l("span", null, y(Te(g.entry)), 1)
            ]),
            l("div", null, [
              e[78] || (e[78] = l("span", null, "Status", -1)),
              l("code", null, y(g.entry.status), 1)
            ]),
            l("div", null, [
              e[79] || (e[79] = l("span", null, "Access", -1)),
              l("code", null, y(R(g.entry.access_level)), 1)
            ]),
            l("div", null, [
              e[80] || (e[80] = l("span", null, "Created", -1)),
              l("code", null, y(Pe(g.entry.created_at)), 1)
            ]),
            l("div", null, [
              e[81] || (e[81] = l("span", null, "Updated", -1)),
              l("code", null, y(Pe(g.entry.updated_at)), 1)
            ])
          ]),
          l("div", al, [
            u(o(j), {
              variant: "ghost",
              onClick: e[43] || (e[43] = (t) => g.open = !1)
            }, {
              default: T(() => [...e[82] || (e[82] = [
                w("Close", -1)
              ])]),
              _: 1
            }),
            f(g.entry, v.WRITE) ? (s(), S(o(j), {
              key: 0,
              icon: "tabler:device-floppy",
              onClick: St
            }, {
              default: T(() => [...e[83] || (e[83] = [
                w("Save", -1)
              ])]),
              _: 1
            })) : p("", !0)
          ])
        ], 512)
      ])) : p("", !0),
      B.value ? (s(), i("div", {
        key: 9,
        class: "ws-modal",
        onClick: e[48] || (e[48] = L((t) => B.value = null, ["self"]))
      }, [
        l("div", il, [
          l("div", rl, [
            w("Move “" + y(B.value.name) + "”", 1),
            e[84] || (e[84] = l("span", { class: "ws-spacer" }, null, -1)),
            u(o(U), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[45] || (e[45] = (t) => B.value = null)
            })
          ]),
          l("div", ul, [
            l("button", {
              class: "ws-crumb",
              onClick: e[46] || (e[46] = (t) => ke(null))
            }, [
              u(o(E), { icon: "tabler:home" })
            ]),
            (s(!0), i(z, null, Q(Ae.value, (t) => (s(), i(z, {
              key: t.id
            }, [
              e[85] || (e[85] = l("span", { class: "ws-sep" }, "/", -1)),
              l("button", {
                class: "ws-crumb",
                onClick: (a) => ke(t.id)
              }, y(t.name), 9, vl)
            ], 64))), 128))
          ]),
          l("div", dl, [
            Le.value ? (s(), S(o(rt), {
              key: 0,
              label: "Loading…"
            })) : (s(), i(z, { key: 1 }, [
              (s(!0), i(z, null, Q(Ie.value, (t) => (s(), i("button", {
                key: t.id,
                class: "ws-move-folder",
                onClick: (a) => ke(t.id)
              }, [
                u(o(E), {
                  icon: re(t),
                  style: X({ color: ue(t) })
                }, null, 8, ["icon", "style"]),
                l("span", null, y(t.name), 1),
                u(o(E), {
                  icon: "tabler:chevron-right",
                  class: "ws-move-into"
                })
              ], 8, cl))), 128)),
              Ie.value.length ? p("", !0) : (s(), i("p", fl, "No folders here."))
            ], 64))
          ]),
          l("div", ml, [
            u(o(j), {
              variant: "ghost",
              onClick: e[47] || (e[47] = (t) => B.value = null)
            }, {
              default: T(() => [...e[86] || (e[86] = [
                w("Cancel", -1)
              ])]),
              _: 1
            }),
            u(o(j), {
              icon: "tabler:folder-symlink",
              disabled: Me.value === (B.value.parent_id ?? null),
              onClick: Dt
            }, {
              default: T(() => [...e[87] || (e[87] = [
                w("Move here", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ])) : p("", !0),
      I.value ? (s(), i("div", pl, [
        l("div", yl, [
          u(o(U), {
            icon: "tabler:arrow-left",
            label: "Back",
            size: "sm",
            onClick: e[49] || (e[49] = (t) => we())
          }),
          u(o(E), {
            icon: re(I.value),
            style: X({ color: ue(I.value) })
          }, null, 8, ["icon", "style"]),
          l("span", wl, y(I.value.name), 1),
          u(o(it), { tone: "muted" }, {
            default: T(() => [
              w(y(Te(I.value)), 1)
            ]),
            _: 1
          }),
          e[88] || (e[88] = l("span", { class: "ws-spacer" }, null, -1)),
          f(I.value, v.ADMIN) ? (s(), S(o(U), {
            key: 0,
            icon: "tabler:share-3",
            label: "Share",
            size: "sm",
            onClick: e[50] || (e[50] = (t) => Y.value = I.value)
          })) : p("", !0),
          u(o(U), {
            icon: "tabler:adjustments",
            label: "Properties",
            size: "sm",
            onClick: e[51] || (e[51] = (t) => Ce(I.value))
          }),
          u(o(U), {
            icon: "tabler:x",
            label: "Close",
            size: "sm",
            onClick: e[52] || (e[52] = (t) => we())
          })
        ]),
        pe(I.value) ? (s(), S(De, {
          key: 0,
          tag: pe(I.value),
          attrs: Be(I.value, "full"),
          class: "ws-manage-body"
        }, null, 8, ["tag", "attrs"])) : (s(), S(ut, {
          key: 1,
          entry: I.value,
          mode: "full",
          class: "ws-manage-body"
        }, null, 8, ["entry"]))
      ])) : p("", !0),
      Y.value ? (s(), S(dn, {
        key: 11,
        config: Rt.value,
        onClose: e[53] || (e[53] = (t) => Y.value = null),
        onChanged: e[54] || (e[54] = (t) => P(r.value))
      }, null, 8, ["config"])) : p("", !0)
    ]));
  }
});
class bl extends Ft {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { route: { type: "string" } } },
      hostCssKeys: ["themeConfigUrl", "iframeCssUrl"],
      inlineCss: Ot
    };
  }
  static get vueConfig() {
    return { rootComponent: kl };
  }
}
jt(import.meta.url, bl);
//# sourceMappingURL=index.js.map
