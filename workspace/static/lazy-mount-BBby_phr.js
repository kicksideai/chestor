import Jt from "primevue/config";
import Qt from "primevue/contextmenu";
import Zt from "primevue/menu";
import en from "primevue/portal";
import { defineComponent as Y, openBlock as a, createElementBlock as v, normalizeClass as X, createBlock as A, unref as r, createVNode as p, createElementVNode as s, createCommentVNode as k, renderSlot as _e, toDisplayString as $, withCtx as M, createTextVNode as x, h as tn, Teleport as nn, ref as h, onMounted as Re, watch as me, onBeforeUnmount as Le, withDirectives as on, vShow as ln, nextTick as Be, withModifiers as O, normalizeStyle as Q, Fragment as z, withKeys as fe, computed as I, renderList as ee, reactive as ct, onUnmounted as sn } from "vue";
import { Icon as R } from "@iconify/vue";
import { a as an, u as rn } from "./wc-runtime-CNDpK4lj.js";
import { d as q, c as pe, u as un, _ as vt, a as dn, b as cn } from "./Notice.vue_vue_type_script_setup_true_lang-Cz2etgDv.js";
import { loadByTagName as xt, on as vn, api as fn, host as pn } from "@wippy-fe/proxy";
import mn from "primevue/button";
import yn from "primevue/progressspinner";
const wn = ["aria-label", "title", "disabled"], gn = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, U = /* @__PURE__ */ Y({
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
  setup(o, { emit: l }) {
    const c = l;
    return (m, i) => (a(), v("button", {
      class: X(["km-iconbtn", [o.variant !== "plain" && o.variant, o.size !== "md" && o.size, o.active && "on", o.tone && `tone-${o.tone}`]]),
      "aria-label": o.label,
      title: o.label,
      disabled: o.disabled,
      onClick: i[0] || (i[0] = (d) => c("click"))
    }, [
      o.spin ? (a(), v("span", gn)) : (a(), A(r(R), {
        key: 1,
        icon: o.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"]))
    ], 10, wn));
  }
}), bn = { class: "km-search" }, kn = ["value", "placeholder"], hn = /* @__PURE__ */ Y({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(o, { emit: l }) {
    const c = l;
    return (m, i) => (a(), v("div", bn, [
      p(r(R), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      s("input", {
        class: "km-search-input",
        value: o.modelValue,
        placeholder: o.placeholder || "Search",
        onInput: i[0] || (i[0] = (d) => c("update:modelValue", d.target.value))
      }, null, 40, kn),
      o.modelValue ? (a(), v("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: i[1] || (i[1] = (d) => c("update:modelValue", ""))
      }, [
        p(r(R), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : k("", !0)
    ]));
  }
}), Cn = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, ft = /* @__PURE__ */ Y({
  __name: "Pill",
  props: {
    tone: { default: "muted" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(o) {
    return (l, c) => (a(), v("span", {
      class: X(["km-pill", `t-${o.tone}`])
    }, [
      o.dot ? (a(), v("span", Cn)) : o.icon ? (a(), A(r(R), {
        key: 1,
        icon: o.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : k("", !0),
      _e(l.$slots, "default")
    ], 2));
  }
}), $n = { class: "km-loading" }, En = { key: 0 }, pt = /* @__PURE__ */ Y({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(o) {
    return (l, c) => (a(), v("div", $n, [
      c[0] || (c[0] = s("span", {
        class: "km-spin lg",
        "aria-hidden": "true"
      }, null, -1)),
      o.label ? (a(), v("span", En, $(o.label), 1)) : k("", !0)
    ]));
  }
}), Dn = { class: "km-empty" }, xn = { class: "km-empty-title" }, _n = {
  key: 0,
  class: "km-empty-hint"
}, Fe = /* @__PURE__ */ Y({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(o, { emit: l }) {
    const c = l;
    return (m, i) => (a(), v("div", Dn, [
      p(r(R), {
        icon: o.icon,
        class: "km-empty-ico",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      s("div", xn, $(o.title), 1),
      o.hint ? (a(), v("p", _n, $(o.hint), 1)) : k("", !0),
      o.cta ? (a(), A(q, {
        key: 1,
        icon: o.ctaIcon,
        onClick: i[0] || (i[0] = (d) => c("cta"))
      }, {
        default: M(() => [
          x($(o.cta), 1)
        ]),
        _: 1
      }, 8, ["icon"])) : k("", !0)
    ]));
  }
}), Sn = "data-wippy-overlay-layer";
function _t() {
  return typeof window < "u" && typeof window.document < "u";
}
function St() {
  return _t() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function Tn() {
  return St() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Rn = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ln = 0;
const Se = /* @__PURE__ */ new WeakMap();
function mt(o, l) {
  const c = o.style;
  c.setProperty("position", "fixed", "important"), c.setProperty("inset", "auto", "important"), c.setProperty("margin", "0", "important"), c.setProperty("position-anchor", l), c.setProperty("position-area", "bottom span-right"), c.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), c.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), c.setProperty("max-width", "stretch", "important");
}
function An(o, l) {
  if (!Rn.test(o.className))
    return;
  const c = o.style.cssText;
  mt(o, l), o.getAttribute("popover") !== "manual" && o.setAttribute("popover", "manual");
  try {
    o.matches(":popover-open") || o.showPopover();
  } catch {
  }
  if (!o.matches(":popover-open")) {
    o.removeAttribute("popover"), o.style.cssText = c;
    return;
  }
  if (!Se.has(o)) {
    const m = new MutationObserver(() => {
      const i = o.style;
      (i.top !== "auto" || i.left !== "auto" || i.margin !== "0px" || i.getPropertyPriority("top") !== "important" || i.getPropertyPriority("left") !== "important" || i.getPropertyPriority("margin") !== "important" || i.getPropertyPriority("min-width") !== "important" || i.maxWidth !== "stretch" || i.getPropertyPriority("max-width") !== "important") && mt(o, l);
    });
    m.observe(o, { attributes: !0, attributeFilter: ["style"] }), Se.set(o, m);
  }
}
function Ke(o) {
  const l = Se.get(o);
  l && (l.disconnect(), Se.delete(o));
}
function Mn(o) {
  const l = o && typeof o.getRootNode == "function" ? o.getRootNode() : null;
  return l instanceof ShadowRoot ? l : null;
}
function Ue(o) {
  o.style.top = "0px", o.style.left = "0px";
  const l = o.getBoundingClientRect();
  o.style.top = `${-window.scrollY - l.top}px`, o.style.left = `${-window.scrollX - l.left}px`;
}
const Te = /* @__PURE__ */ new Set(), qe = /* @__PURE__ */ new WeakMap();
let yt = !1, He = !1;
function Pn() {
  He = !1;
  for (const o of Te) {
    if (!o.isConnected) {
      for (const l of Array.from(o.children))
        l instanceof HTMLElement && Ke(l);
      Te.delete(o), qe.get(o)?.disconnect();
      continue;
    }
    o.childElementCount > 0 && Ue(o);
  }
}
function wt() {
  He || (He = !0, requestAnimationFrame(Pn));
}
function On(o) {
  const l = document.createElement("div");
  l.setAttribute(Sn, "");
  const c = St();
  if (l.style.cssText = c ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", c && l.setAttribute("popover", "manual"), o.appendChild(l), c) {
    try {
      l.showPopover();
    } catch {
    }
    l.matches(":popover-open") || (l.removeAttribute("popover"), l.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Ue(l);
  const m = new MutationObserver((i) => {
    const d = l.__wippyAnchorName;
    for (const g of i) {
      if (d)
        for (const C of Array.from(g.addedNodes))
          C instanceof HTMLElement && An(C, d);
      for (const C of Array.from(g.removedNodes))
        C instanceof HTMLElement && Ke(C);
    }
    l.isConnected && l.childElementCount > 0 && Ue(l);
  });
  return m.observe(l, { childList: !0 }), qe.set(l, m), Te.add(l), yt || (yt = !0, window.addEventListener("scroll", wt, { capture: !0, passive: !0 }), window.addEventListener("resize", wt, { passive: !0 })), l;
}
function gt(o) {
  if (!(!o.hostRoot || o.layer) && (o.layer = On(o.hostRoot), Tn())) {
    const l = o.$el ? o.$el.parentElement : null;
    l && (o.anchorName = `--wippy-a-${++Ln}`, o.anchorTrigger = l, l.style.setProperty("anchor-name", o.anchorName), o.layer.__wippyAnchorName = o.anchorName);
  }
}
function bt(o) {
  if (o.anchorTrigger && (o.anchorTrigger.style.removeProperty("anchor-name"), o.anchorTrigger = null), o.anchorName = null, o.layer) {
    for (const l of Array.from(o.layer.children))
      l instanceof HTMLElement && Ke(l);
    Te.delete(o.layer), qe.get(o.layer)?.disconnect(), o.layer.remove(), o.layer = null;
  }
}
let kt = !1;
function jn() {
  if (kt)
    return;
  const o = Zt;
  !o.methods || typeof o.methods.bindOutsideClickListener != "function" || (o.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (l) => {
      const c = l.composedPath(), m = this.container && !c.includes(this.container), i = !(this.target && c.includes(this.target));
      this.overlayVisible && m && i ? this.hide() : !this.popup && m && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, kt = !0);
}
let ht = !1;
function Nn() {
  if (ht)
    return;
  const o = Qt;
  !o.methods || typeof o.methods.bindOutsideClickListener != "function" || (o.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (l) => {
      const c = l.composedPath(), m = this.container && !c.includes(this.container), i = this.visible ? !(this.target && c.includes(this.target)) : !0;
      m && i && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, ht = !0);
}
let Ct = !1;
function zn() {
  if (Ct)
    return;
  Ct = !0;
  const o = en;
  o.computed = o.computed || {}, o.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, o.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, o.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, o.mounted = function() {
    _t() && (this.hostRoot = Mn(this.$el), this.mounted = !0, this.hostRoot && (this.inline || gt(this), this.$watch("inline", (l) => {
      l ? bt(this) : gt(this);
    })));
  }, o.render = function() {
    return this.inline ? _e(this.$slots, "default", { key: 0 }) : this.mounted ? tn(nn, { key: 1, to: this.resolvedTarget || document.body }, [
      _e(this.$slots, "default")
    ]) : k("", !0);
  }, o.unmounted = function() {
    bt(this);
  };
}
const In = {
  install: (o) => {
    jn(), Nn(), zn(), o.use(Jt, { theme: "none" });
  }
}, Wn = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function Vn(o, l) {
  return {
    "entry-id": o.id,
    route: o.id,
    mode: l,
    "read-only": String(o.access_level != null && (o.access_level & 2) !== 2)
  };
}
const Fn = () => an(), Bn = () => rn(), Un = {
  key: 0,
  class: "ws-renderer-fail"
}, xe = /* @__PURE__ */ Y({
  __name: "EntryRenderer",
  props: {
    tag: {},
    attrs: {},
    fill: { type: Boolean, default: !0 }
  },
  setup(o) {
    const l = o, c = h(null), m = h(!1);
    let i = null;
    async function d(C) {
      if (!customElements.get(C) && (await xt(C, { timeoutMs: 8e3 }), !customElements.get(C)))
        throw new Error("Content is unavailable.");
    }
    async function g() {
      if (m.value = !1, !!c.value) {
        c.value.innerHTML = "", i = null;
        try {
          await d(l.tag), i = document.createElement(l.tag);
          for (const [C, b] of Object.entries(l.attrs || {}))
            b != null && b !== "" && i.setAttribute(C, String(b));
          l.fill === !1 ? (i.style.display = "block", i.style.width = "100%") : (i.style.position = "absolute", i.style.inset = "0"), c.value.appendChild(i), m.value = !customElements.get(l.tag);
        } catch {
          m.value = !0;
        }
      }
    }
    return Re(g), me(() => [l.tag, JSON.stringify(l.attrs)], g), Le(() => {
      i = null;
    }), (C, b) => (a(), v("div", {
      class: X(["ws-renderer-host", { "ws-renderer-flow": o.fill === !1 }])
    }, [
      m.value ? (a(), v("div", Un, [
        p(r(pe), { tone: "error" }, {
          default: M(() => [
            b[1] || (b[1] = x("Content is unavailable. ", -1)),
            p(r(q), { onClick: g }, {
              default: M(() => [...b[0] || (b[0] = [
                x("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : k("", !0),
      on(s("div", {
        ref_key: "host",
        ref: c,
        class: "ws-renderer-mount"
      }, null, 512), [
        [ln, !m.value]
      ])
    ], 2));
  }
}), Hn = /* @__PURE__ */ Y({
  __name: "MenuLayer",
  props: {
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(o, { emit: l }) {
    const c = o, m = h(null), i = h(null), d = h({ left: "0px", top: "0px", visibility: "hidden" });
    function g() {
      const b = m.value?.getBoundingClientRect(), T = i.value?.getBoundingClientRect();
      if (!b || !T) return;
      const E = Math.max(0, Math.min(c.x - b.left, b.width - T.width)), f = Math.max(0, Math.min(c.y - b.top, b.height - T.height));
      d.value = { left: `${E}px`, top: `${f}px`, visibility: "visible" };
    }
    me(() => [c.x, c.y], () => {
      Be(g);
    }), Re(() => {
      Be(g), window.addEventListener("resize", g);
    }), Le(() => window.removeEventListener("resize", g));
    const C = l;
    return (b, T) => (a(), v("div", {
      ref_key: "layer",
      ref: m,
      class: "ws-menu-layer",
      onClick: T[1] || (T[1] = (E) => C("close")),
      onContextmenu: T[2] || (T[2] = O((E) => C("close"), ["prevent"]))
    }, [
      s("div", {
        ref_key: "panel",
        ref: i,
        class: "ws-menu",
        style: Q(d.value),
        onClick: T[0] || (T[0] = O(() => {
        }, ["stop"]))
      }, [
        _e(b.$slots, "default")
      ], 4)
    ], 544));
  }
}), Kn = ["onKeydown"], qn = {
  class: "ws-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "Sharing"
}, Gn = { class: "ws-dialog-foot" }, Xn = /* @__PURE__ */ Y({
  __name: "ShareHost",
  props: {
    config: {}
  },
  emits: ["close", "changed"],
  setup(o, { emit: l }) {
    const c = o, m = l, i = h(null);
    let d = null;
    const g = h(!1);
    function C() {
      m("close");
    }
    function b(E) {
      m("changed", E.detail);
    }
    async function T() {
      if (g.value = !1, !!i.value)
        try {
          if (await xt("kickside-share", { timeoutMs: 8e3 }), !customElements.get("kickside-share")) throw new Error("Sharing is unavailable.");
          d = document.createElement("kickside-share"), c.config && d.setAttribute("config", c.config), d.addEventListener("close", C), d.addEventListener("changed", b), i.value.appendChild(d);
        } catch {
          g.value = !0;
        }
    }
    return Re(T), me(() => c.config, (E) => {
      d && E && d.setAttribute("config", E);
    }), Le(() => {
      d && (d.removeEventListener("close", C), d.removeEventListener("changed", b), d.remove(), d = null);
    }), (E, f) => (a(), v(z, null, [
      s("div", {
        ref_key: "host",
        ref: i,
        class: "ws-share-host"
      }, null, 512),
      g.value ? (a(), v("div", {
        key: 0,
        class: "ws-modal",
        onKeydown: fe(O(C, ["stop"]), ["esc"]),
        onClick: O(C, ["self"])
      }, [
        s("section", qn, [
          p(r(pe), {
            tone: "error",
            onDismiss: C
          }, {
            default: M(() => [...f[0] || (f[0] = [
              x("Sharing is unavailable.", -1)
            ])]),
            _: 1
          }),
          s("div", Gn, [
            p(r(q), {
              "aria-label": "Retry sharing",
              onClick: T
            }, {
              default: M(() => [...f[1] || (f[1] = [
                x("Retry", -1)
              ])]),
              _: 1
            }),
            p(r(q), {
              variant: "ghost",
              onClick: C
            }, {
              default: M(() => [...f[2] || (f[2] = [
                x("Close", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ], 40, Kn)) : k("", !0)
    ], 64));
  }
}), Yn = { class: "ws-cv-section" }, Jn = { class: "ws-cv-row" }, Qn = { class: "ws-cv-v" }, Zn = { class: "ws-cv-row" }, eo = { class: "ws-cv-v" }, to = { class: "ws-cv-row" }, no = { class: "ws-cv-v" }, oo = {
  key: 0,
  class: "ws-cv-section"
}, lo = {
  key: 0,
  class: "ws-cv-row"
}, so = { class: "ws-cv-v" }, io = {
  key: 1,
  class: "ws-cv-row"
}, ao = { class: "ws-cv-v" }, ro = {
  key: 1,
  class: "ws-cv-section"
}, uo = { class: "ws-cv-k" }, co = { class: "ws-cv-v" }, $t = /* @__PURE__ */ Y({
  __name: "ComponentView",
  props: {
    entry: {},
    mode: {}
  },
  setup(o) {
    const l = o, c = /* @__PURE__ */ new Set(["title", "name", "icon", "type", "status", "color", "renderer"]);
    function m(E) {
      if (E == null || E === "") return null;
      if (typeof E == "number") return new Date(E < 2e10 ? E * 1e3 : E);
      const f = new Date(String(E));
      return isNaN(f.getTime()) ? null : f;
    }
    function i(E) {
      const f = m(E);
      return f ? f.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    }
    const d = I(() => ((l.entry.type || "item").split(".").pop() || "item").replace(/[_-]/g, " ").toUpperCase()), g = I(() => i(l.entry.created_at)), C = I(() => i(l.entry.updated_at)), b = I(() => {
      const E = l.entry.access_level;
      if (E == null) return "Full (owner)";
      const f = [];
      return E & 1 && f.push("Read"), E & 2 && f.push("Write"), E & 4 && f.push("Delete"), E & 8 && f.push("Admin"), f.length ? f.join(" · ") : "None";
    }), T = I(() => {
      const E = l.entry.meta || {}, f = [];
      for (const [_, y] of Object.entries(E)) {
        if (c.has(_) || y == null || typeof y == "object") continue;
        const S = String(y);
        S !== "" && f.push({ k: _.replace(/[_-]/g, " "), v: S });
      }
      return f;
    });
    return (E, f) => (a(), v("div", {
      class: X(["ws-cv", `ws-cv--${o.mode || "preview"}`])
    }, [
      s("div", Yn, [
        s("div", Jn, [
          f[0] || (f[0] = s("span", { class: "ws-cv-k" }, "Type", -1)),
          s("span", Qn, $(d.value), 1)
        ]),
        s("div", Zn, [
          f[1] || (f[1] = s("span", { class: "ws-cv-k" }, "Status", -1)),
          s("span", eo, $(o.entry.status || "active"), 1)
        ]),
        s("div", to, [
          f[2] || (f[2] = s("span", { class: "ws-cv-k" }, "Access", -1)),
          s("span", no, $(b.value), 1)
        ])
      ]),
      g.value || C.value ? (a(), v("div", oo, [
        g.value ? (a(), v("div", lo, [
          f[3] || (f[3] = s("span", { class: "ws-cv-k" }, "Created", -1)),
          s("span", so, $(g.value), 1)
        ])) : k("", !0),
        C.value ? (a(), v("div", io, [
          f[4] || (f[4] = s("span", { class: "ws-cv-k" }, "Updated", -1)),
          s("span", ao, $(C.value), 1)
        ])) : k("", !0)
      ])) : k("", !0),
      T.value.length ? (a(), v("div", ro, [
        f[5] || (f[5] = s("div", { class: "ws-cv-sec-title" }, "Metadata", -1)),
        (a(!0), v(z, null, ee(T.value, (_) => (a(), v("div", {
          key: _.k,
          class: "ws-cv-row"
        }, [
          s("span", uo, $(_.k), 1),
          s("span", co, $(_.v), 1)
        ]))), 128))
      ])) : k("", !0)
    ], 2));
  }
}), vo = { key: 0 }, Et = /* @__PURE__ */ Y({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(o) {
    const l = o, c = I(() => l.state.deletion_job === null || ["dead", "cancelled"].includes(l.state.deletion_job?.status || ""));
    return (m, i) => o.state.deleting_at ? (a(), v("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: i[1] || (i[1] = O(() => {
      }, ["stop"])),
      onKeydown: i[2] || (i[2] = O(() => {
      }, ["stop"]))
    }, [
      c.value ? (a(), v(z, { key: 0 }, [
        s("span", null, [
          i[3] || (i[3] = x("Deletion failed", -1)),
          o.state.deletion_job?.last_error ? (a(), v("span", vo, ": " + $(o.state.deletion_job.last_error), 1)) : k("", !0)
        ]),
        p(r(mn), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: i[0] || (i[0] = O((d) => m.$emit("retry"), ["stop"]))
        })
      ], 64)) : (a(), v(z, { key: 1 }, [
        p(r(yn), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        i[4] || (i[4] = s("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : k("", !0);
  }
});
function ve(o) {
  return !!o && typeof o == "object" && !Array.isArray(o);
}
function fo(o, l) {
  return o;
}
function po(o, l, c) {
  const m = ve(o) ? o : {}, i = [
    m,
    ve(m.data) ? m.data : null,
    ve(m.payload) ? m.payload : null,
    ve(m.detail) ? m.detail : null
  ].filter(Boolean);
  for (const d of i) {
    if (d.event !== "component.meta.changed" && d.event !== "component.deleting" && d.event !== "component.deleted") continue;
    const g = String(d.component_id || ""), C = String(m.topic || d.topic || "");
    if (!g && (!C.startsWith("component.") || C === "component.")) continue;
    const b = g || l || C.slice(10);
    return d.event === "component.deleting" && typeof d.deletion_job_id == "string" && d.deletion_job_id ? { event: d.event, component_id: b, deletion_job_id: d.deletion_job_id } : d.event !== "component.meta.changed" ? { event: d.event, component_id: b } : {
      event: "component.meta.changed",
      component_id: b,
      meta: fo(ve(d.meta) ? d.meta : {}),
      deleted: Array.isArray(d.deleted) ? d.deleted.map(String) : []
    };
  }
  return null;
}
function mo(o, l) {
  const c = po(o, l);
  return c && c.event !== "component.meta.changed" ? c : null;
}
function Dt(o, l) {
  if (o && typeof o == "object") {
    const c = o, m = c.response?.data?.error;
    if (typeof m == "string") return m;
    if (m && typeof m == "object" && typeof m.message == "string")
      return m.message;
    if (typeof c.message == "string" && c.message) return c.message;
  }
  return l;
}
function yo(o, l, c, m) {
  let i = !0;
  const d = /* @__PURE__ */ new Set(), g = /* @__PURE__ */ new Map();
  function C(_, y) {
    const S = o.value.find((ye) => l(ye) === _), w = g.get(_), L = y?.job_id || w?.deletion_job_id || S?.deletion_job_id, W = w ? w.deletion_job_id : S?.deleting_at ? S.deletion_job_id : void 0;
    if ((w || S?.deleting_at) && L === W) return;
    const j = {
      deleting_at: w?.deleting_at || S?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: L
    };
    g.set(_, j), S && (Object.assign(S, j), S.deletion_job = void 0);
  }
  async function b(_) {
    const y = l(_), S = g.get(y), w = () => i && o.value.includes(_) && g.get(y) === S;
    try {
      const { data: L } = await fn.get(`/api/v1/components/${encodeURIComponent(y)}`);
      if (!L?.success) throw new Error(Dt(L, "Could not read deletion progress"));
      w() && (_.deleting_at = S?.deleting_at || L.deleting_at, _.deletion_job_id = L.deletion_job_id, S && (S.deletion_job_id = _.deletion_job_id), _.deletion_job = L.deletion_job ?? null);
    } catch (L) {
      w() && pn.handleError("other", { message: Dt(L, "Could not read deletion progress") });
    }
  }
  let T = [];
  const E = me(() => o.value, (_, y = []) => {
    const S = _.filter((w) => !d.has(l(w)));
    for (const w of y)
      d.has(l(w)) || S.some((L) => l(L) === l(w)) || (c?.(l(w)), w.deleting_at && m?.(l(w)));
    if (S.length !== _.length) {
      o.value = S;
      return;
    }
    for (const w of _) {
      const L = g.get(l(w));
      L && (w.deletion_job_id !== L.deletion_job_id && (w.deletion_job = void 0), Object.assign(w, L));
      const W = y.find((j) => l(j) === l(w));
      w.deletion_job === void 0 && W?.deletion_job_id === w.deletion_job_id && (w.deletion_job = W?.deletion_job), w.deleting_at && !T.includes(w) && b(w);
    }
    T = _;
  }, { immediate: !0 }), f = vn("@message", (_) => {
    const y = mo(_);
    if (!y) return;
    const S = o.value.find((w) => l(w) === y.component_id);
    y.event === "component.deleted" ? (S && !d.has(y.component_id) && (c?.(y.component_id), m?.(y.component_id)), d.add(y.component_id), g.delete(y.component_id), o.value = o.value.filter((w) => l(w) !== y.component_id)) : S && C(y.component_id, { job_id: y.deletion_job_id });
  });
  return Le(() => {
    i = !1, E(), typeof f == "function" && f();
  }), { acceptDeletion: C };
}
const wo = { class: "ws-strip" }, go = { class: "ws-crumbs" }, bo = ["title", "onClick", "onDragover", "onDrop"], ko = { class: "ws-body" }, ho = {
  key: 0,
  class: "ws-drop-hint"
}, Co = {
  key: 2,
  class: "ws-list"
}, $o = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], Eo = { class: "ws-row-name" }, Do = { class: "ws-age" }, xo = ["aria-label", "onClick"], _o = {
  key: 3,
  class: "ws-grid"
}, So = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], To = ["aria-label", "onClick"], Ro = ["title"], Lo = { class: "ws-preview-head" }, Ao = { class: "ws-preview-title" }, Mo = {
  key: 5,
  class: "ws-menu-div"
}, Po = { class: "ws-dialog" }, Oo = {
  class: "ws-dialog-head",
  id: "ws-new-heading"
}, jo = { class: "ws-type-grid" }, No = ["title", "onClick"], zo = { class: "ws-create-panel" }, Io = { class: "ws-dialog" }, Wo = { class: "ws-dialog-head" }, Vo = {
  key: 0,
  class: "ws-confirm-body"
}, Fo = {
  key: 1,
  class: "ws-confirm-body"
}, Bo = {
  key: 2,
  class: "ws-confirm-body"
}, Uo = { class: "ws-dialog-foot" }, Ho = { class: "ws-dialog-head" }, Ko = { class: "ws-name-row" }, qo = { class: "ws-swatches" }, Go = ["title", "aria-label", "onClick"], Xo = { class: "ws-meta-grid" }, Yo = { class: "ws-dialog-foot" }, Jo = { class: "ws-dialog" }, Qo = { class: "ws-dialog-head" }, Zo = { class: "ws-move-crumbs" }, el = ["onClick"], tl = { class: "ws-move-list" }, nl = ["onClick"], ol = {
  key: 0,
  class: "ws-move-none"
}, ll = { class: "ws-dialog-foot" }, sl = {
  key: 9,
  class: "ws-manage"
}, il = { class: "ws-manage-head" }, al = { class: "ws-manage-title" }, rl = "wc-entry-create", ul = /* @__PURE__ */ Y({
  __name: "Workspace",
  setup(o) {
    const l = un(), c = Fn(), m = Bn(), i = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };
    function d(n, e) {
      const t = n?.access_level;
      return t == null || (Number(t) & e) === e;
    }
    function g(n) {
      return !!n && (n.type === "folder" || !!n.container);
    }
    function C(n) {
      if (n == null) return "Full";
      const e = Number(n), u = [[i.READ, "Read"], [i.WRITE, "Write"], [i.DELETE, "Delete"], [i.ADMIN, "Admin"]].filter(([B]) => (e & B) === B).map(([, B]) => B);
      return u.length ? u.join(" · ") : "None";
    }
    const b = h([]), T = h(""), E = h([]), f = h(null), _ = h(null), y = h(null), S = h(!1), w = h(""), L = h(localStorage.getItem("ws-view") || "list"), W = h(!1), j = h(null), ye = h(null), Ae = h(!1), le = h(!1), ie = I(() => {
      const n = {};
      for (const e of l.types.value) n[e.value] = e;
      return n;
    }), Tt = I(() => {
      const n = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
      for (const t of l.types.value) (n.has(t.value) ? e : n).add(t.value);
      return e;
    }), Rt = I(() => l.types.value.filter((n) => n.creatable && !n.picker_excluded && n.create?.view).sort((n, e) => n.value === "folder" ? -1 : e.value === "folder" ? 1 : (n.label || "").localeCompare(e.label || ""))), Me = I(() => d(_.value, i.WRITE)), we = I(() => {
      const n = T.value.trim().toLowerCase();
      return (n ? b.value.filter((t) => (t.name || "").toLowerCase().includes(n)) : [...b.value]).sort((t, u) => {
        const B = g(t) ? 0 : 1, ce = g(u) ? 0 : 1;
        return B !== ce ? B - ce : (t.name || "").localeCompare(u.name || "", void 0, { sensitivity: "base" });
      });
    });
    function ae(n) {
      return n.icon || n.meta?.icon || ie.value[n.type]?.icon || "tabler:file";
    }
    function re(n) {
      return n.meta?.color || ie.value[n.type]?.color || "var(--km-muted)";
    }
    function Pe(n) {
      const e = Tt.value.has(n.type) ? "" : ie.value[n.type]?.label;
      return e ? e.toUpperCase() : ((n.type || "item").split(".").pop() || "item").replace(/[_-]+/g, " ").toUpperCase();
    }
    function Ge(n) {
      if (n == null || n === "") return null;
      if (typeof n == "number") return new Date(n < 2e10 ? n * 1e3 : n);
      const e = new Date(String(n));
      return isNaN(e.getTime()) ? null : e;
    }
    function Lt(n) {
      const e = Ge(n);
      if (!e) return "";
      const t = Math.floor((Date.now() - e.getTime()) / 1e3);
      return t < 60 ? "now" : t < 3600 ? Math.floor(t / 60) + "m" : t < 86400 ? Math.floor(t / 3600) + "h" : Math.floor(t / 86400) + "d";
    }
    function Xe(n) {
      const e = Ge(n);
      return e ? e.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function ge(n) {
      const e = n.renderer || ie.value[n.type]?.renderer;
      return e ? e.startsWith("/c/") ? e.slice(3) : e : "";
    }
    function Ye(n, e) {
      const t = Vn(n, e), u = n.meta?.upload_id;
      return u && (t["source-url"] = `/api/v1/uploads/${u}/raw`, t["content-type"] = n.meta?.content_type || "", t.filename = n.name), t;
    }
    const N = h(null), Je = I(() => String(c.value.route || "").replace(/^\/+|\/+$/g, "").split("/")[0] || "");
    function be(n) {
      H(), m("navigate", n.id);
    }
    function ke() {
      m("navigate", f.value || "");
    }
    async function Qe() {
      const n = Je.value;
      if (!n) {
        N.value = null, (f.value !== null || b.value.length === 0) && await V(null);
        return;
      }
      let e = b.value.find((u) => u.id === n) || null;
      if (!e)
        try {
          e = await l.get(n);
        } catch (u) {
          w.value = u instanceof Error ? u.message : "failed to open entry";
          return;
        }
      if (!e) {
        w.value = "entry not found";
        return;
      }
      if (g(e)) {
        N.value = null, f.value !== n && await V(n);
        return;
      }
      const t = e.parent_id ?? null;
      (f.value !== t || b.value.length === 0) && await V(t), N.value = e;
    }
    me(Je, Qe);
    let ue = 0;
    async function V(n) {
      const e = n === f.value && b.value.length > 0;
      f.value = n, e || (y.value = null, T.value = "", S.value = !0), H(), w.value = "";
      const t = ++ue;
      try {
        const u = await l.list(n);
        if (t !== ue) return;
        b.value = u;
        const B = y.value;
        if (B && !u.some((ce) => ce.id === B.id) && (y.value = null), E.value = n ? await l.breadcrumbs(n) : [], _.value = n ? await l.get(n) : null, t !== ue) return;
      } catch (u) {
        if (t !== ue) return;
        w.value = u instanceof Error ? u.message : "failed to load", e || (b.value = []);
      } finally {
        t === ue && (S.value = !1);
      }
    }
    function te(n) {
      if (g(n)) {
        m("navigate", n.id);
        return;
      }
      y.value = y.value?.id === n.id ? null : n;
    }
    const Ze = I(() => ({
      type: j.value?.value || "",
      "parent-id": f.value || "",
      mode: "create"
    })), At = I(() => j.value?.create?.view === rl);
    function Mt(n) {
      W.value = !1, j.value = n;
    }
    function et() {
      j.value = null, V(f.value);
    }
    function Pt() {
      V(f.value);
      for (const n of [900, 2200, 4500]) setTimeout(() => V(f.value), n);
    }
    async function tt(n, e) {
      Ae.value = !0, w.value = "";
      try {
        for (const t of n) await l.uploadFile(t, e);
        Pt();
      } catch (t) {
        w.value = t instanceof Error ? t.message : "upload failed";
      } finally {
        Ae.value = !1;
      }
    }
    async function nt(n, e) {
      await tt(n, e);
    }
    function Ot(n) {
      tt(Array.from(n), f.value);
    }
    function jt(n) {
      const e = n.target;
      e.files?.length && Ot(e.files), e.value = "";
    }
    function Nt(n) {
      if (n.preventDefault(), le.value = !1, J.value || !Me.value) return;
      const e = n.dataTransfer?.files;
      e?.length && nt(Array.from(e), f.value);
    }
    const J = h(null), F = h(null);
    function ot(n, e) {
      if (!d(e, i.WRITE)) {
        n.preventDefault();
        return;
      }
      J.value = e.id, n.dataTransfer?.setData("text/plain", e.id);
    }
    function lt() {
      J.value = null, F.value = null;
    }
    async function Oe(n, e) {
      const t = J.value;
      if (J.value = null, F.value = null, !(!t || t === n) && !(e && !d(e, i.WRITE)))
        try {
          await l.move(t, n), V(f.value);
        } catch (u) {
          w.value = u instanceof Error ? u.message : "move failed";
        }
    }
    function st(n, e) {
      if (n.preventDefault(), n.stopPropagation(), le.value = !1, !g(e)) return;
      if (J.value) {
        Oe(e.id, e);
        return;
      }
      const t = n.dataTransfer?.files;
      t?.length && d(e, i.WRITE) && nt(Array.from(t), e.id);
    }
    function it(n, e) {
      g(e) && (n.preventDefault(), F.value = e.id);
    }
    const P = ct({ entry: null, x: 0, y: 0 });
    function he(n, e) {
      e.preventDefault(), e.stopPropagation(), P.entry = n, P.x = e.clientX, P.y = e.clientY;
    }
    function H() {
      P.entry = null;
    }
    const de = h("");
    let at;
    function zt(n) {
      de.value = n, clearTimeout(at), at = setTimeout(() => {
        de.value = "";
      }, 1800);
    }
    const K = h(null), je = h(null), Ne = h([]), ze = h([]), Ie = h(!1);
    async function Ce(n) {
      Ie.value = !0;
      try {
        je.value = n;
        const e = await l.list(n);
        ze.value = e.filter((t) => g(t) && t.id !== K.value?.id && d(t, i.WRITE)), Ne.value = n ? await l.breadcrumbs(n) : [];
      } catch (e) {
        w.value = e instanceof Error ? e.message : "failed to browse";
      } finally {
        Ie.value = !1;
      }
    }
    function It(n) {
      H(), K.value = n, Ce(f.value);
    }
    async function Wt() {
      const n = K.value;
      if (!n) return;
      const e = je.value;
      if (K.value = null, e !== (n.parent_id ?? null))
        try {
          await l.move(n.id, e), zt(`Moved to ${Ne.value.at(-1)?.name || "root"}`), V(f.value);
        } catch (t) {
          w.value = t instanceof Error ? t.message : "move failed";
        }
    }
    async function Vt(n) {
      H();
      try {
        const e = await l.exportEntry(n.id), t = URL.createObjectURL(e), u = document.createElement("a");
        u.href = t, u.download = `${n.name || "entry"}.kxb`, u.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
      } catch (e) {
        w.value = e instanceof Error ? e.message : "export failed";
      }
    }
    function rt(n, e) {
      if (n.key === "ArrowDown" || n.key === "ArrowUp") {
        n.preventDefault();
        const t = n.currentTarget, u = [...t.parentElement?.children || []].filter((Yt) => Yt.matches?.(".ws-row, .ws-tile")), B = u.indexOf(t);
        u[n.key === "ArrowDown" ? B + 1 : B - 1]?.focus();
      } else n.key === "F2" && d(e, i.WRITE) ? (n.preventDefault(), Ee(e)) : n.key === "Delete" && d(e, i.DELETE) && (n.preventDefault(), $e(e));
    }
    const G = h(null), ne = h(null);
    async function $e(n) {
      if (H(), G.value = n, ne.value = null, g(n))
        try {
          ne.value = await l.countDescendants(n.id);
        } catch (e) {
          w.value = e instanceof Error ? e.message : "failed to inspect folder";
        }
    }
    async function Ft() {
      const n = G.value;
      if (G.value = null, ne.value = null, !!n)
        try {
          const e = await l.remove(n.id);
          e.in_progress && Bt(n.id, e), y.value?.id === n.id && (y.value = null), N.value?.id === n.id && ke(), V(f.value);
        } catch (e) {
          w.value = e instanceof Error ? e.message : "failed to delete";
        }
    }
    const { acceptDeletion: Bt } = yo(
      b,
      (n) => n.id,
      (n) => {
        y.value?.id === n && (y.value = null);
      },
      () => V(f.value)
    ), D = ct(
      { open: !1, entry: null, name: "", icon: "", color: "" }
    ), Ut = [{ label: "Default", value: "" }, ...Wn], se = h(""), ut = h(null);
    function Ee(n) {
      H(), D.entry = n, D.name = n.name, D.icon = n.meta?.icon || "", D.color = n.meta?.color || "", se.value = "", D.open = !0, Be(() => {
        const e = ut.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])');
        e?.focus(), e?.select();
      });
    }
    async function Ht() {
      if (D.entry) {
        se.value = "";
        try {
          await l.update(D.entry.id, { name: D.name.trim() || D.entry.name, icon: D.icon, color: D.color }), D.open = !1, V(f.value);
        } catch (n) {
          se.value = n instanceof Error ? n.message : "failed to save";
        }
      }
    }
    function Kt() {
      L.value = L.value === "list" ? "grid" : "list", localStorage.setItem("ws-view", L.value);
    }
    const Z = h(null), qt = I(() => {
      const n = Z.value;
      return n ? JSON.stringify({
        resource_id: n.id,
        title: n.name,
        access_url: `/api/v1/component-access/grants/${n.id}`,
        share_url: `/api/v1/component-access/share/${n.id}`
      }) : "";
    }), De = h(parseInt(localStorage.getItem("ws-panel-w") || "440", 10)), We = h(!1);
    let oe = null;
    function Gt(n) {
      n.preventDefault(), oe = { pointerId: n.pointerId, x: n.clientX, width: De.value }, We.value = !0, n.currentTarget.setPointerCapture(n.pointerId);
    }
    function Xt(n) {
      if (!oe || n.pointerId !== oe.pointerId) return;
      const e = oe.width + oe.x - n.clientX;
      De.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), e));
    }
    function Ve() {
      oe && (oe = null, We.value = !1, localStorage.setItem("ws-panel-w", String(De.value)));
    }
    function dt(n) {
      n.key === "Escape" && (H(), G.value ? (G.value = null, ne.value = null) : W.value ? W.value = !1 : j.value ? j.value = null : Z.value ? Z.value = null : K.value ? K.value = null : D.open ? D.open = !1 : N.value && ke());
    }
    return Re(async () => {
      window.addEventListener("keydown", dt), await l.loadTypes(), l.error.value && (w.value = l.error.value), await Qe();
    }), sn(() => window.removeEventListener("keydown", dt)), (n, e) => (a(), v("div", {
      class: "ws",
      onClick: H
    }, [
      s("div", wo, [
        s("button", {
          class: X(["ws-home", { "ws-crumb--drop": J.value && F.value === "" }]),
          title: "Workspace root",
          "aria-label": "Workspace root",
          onClick: e[0] || (e[0] = (t) => r(m)("navigate", "")),
          onDragover: e[1] || (e[1] = O((t) => F.value = "", ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => F.value = null),
          onDrop: e[3] || (e[3] = (t) => Oe(null))
        }, [
          p(r(R), { icon: "tabler:home" })
        ], 34),
        s("div", go, [
          (a(!0), v(z, null, ee(E.value, (t) => (a(), v(z, {
            key: t.id
          }, [
            e[53] || (e[53] = s("span", { class: "ws-sep" }, "/", -1)),
            s("button", {
              class: X(["ws-crumb", { "ws-crumb--drop": J.value && F.value === t.id }]),
              title: t.name,
              onClick: (u) => r(m)("navigate", t.id),
              onDragover: O((u) => F.value = t.id, ["prevent"]),
              onDragleave: e[4] || (e[4] = (u) => F.value = null),
              onDrop: (u) => Oe(t.id)
            }, $(t.name), 43, bo)
          ], 64))), 128))
        ]),
        e[55] || (e[55] = s("span", { class: "ws-spacer" }, null, -1)),
        p(r(hn), {
          modelValue: T.value,
          "onUpdate:modelValue": e[5] || (e[5] = (t) => T.value = t),
          placeholder: "Filter this folder",
          class: "ws-filter"
        }, null, 8, ["modelValue"]),
        p(r(U), {
          icon: L.value === "list" ? "tabler:layout-grid" : "tabler:list",
          label: L.value === "list" ? "Grid view" : "List view",
          size: "sm",
          onClick: Kt
        }, null, 8, ["icon", "label"]),
        p(r(U), {
          icon: "tabler:upload",
          label: "Upload files",
          size: "sm",
          spin: Ae.value,
          disabled: !Me.value,
          onClick: e[6] || (e[6] = (t) => ye.value?.click())
        }, null, 8, ["spin", "disabled"]),
        p(r(q), {
          icon: "tabler:plus",
          small: "",
          onClick: e[7] || (e[7] = (t) => W.value = !0)
        }, {
          default: M(() => [...e[54] || (e[54] = [
            x("New", -1)
          ])]),
          _: 1
        }),
        s("input", {
          ref_key: "fileInput",
          ref: ye,
          type: "file",
          multiple: "",
          hidden: "",
          onChange: jt
        }, null, 544)
      ]),
      w.value ? (a(), A(r(pe), {
        key: 0,
        tone: "error",
        onDismiss: e[9] || (e[9] = (t) => w.value = "")
      }, {
        default: M(() => [
          x($(w.value) + " ", 1),
          p(r(q), {
            variant: "ghost",
            small: "",
            onClick: e[8] || (e[8] = (t) => V(f.value))
          }, {
            default: M(() => [...e[56] || (e[56] = [
              x("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : k("", !0),
      de.value ? (a(), A(r(pe), {
        key: 1,
        onDismiss: e[10] || (e[10] = (t) => de.value = "")
      }, {
        default: M(() => [
          x($(de.value), 1)
        ]),
        _: 1
      })) : k("", !0),
      s("div", ko, [
        s("div", {
          class: X(["ws-list-pane", { "ws-list-pane--aside": y.value, "ws-list-pane--drop": le.value }]),
          onDragover: e[15] || (e[15] = O((t) => le.value = !J.value, ["prevent"])),
          onDragleave: e[16] || (e[16] = (t) => le.value = !1),
          onDrop: Nt
        }, [
          le.value ? (a(), v("div", ho, [
            p(r(R), { icon: "tabler:upload" }),
            e[57] || (e[57] = x(" Drop to upload", -1))
          ])) : k("", !0),
          S.value ? (a(), A(r(pt), {
            key: 1,
            label: "Loading…"
          })) : we.value.length && L.value === "list" ? (a(), v("div", Co, [
            (a(!0), v(z, null, ee(we.value, (t) => (a(), v("div", {
              key: t.id,
              class: X(["ws-row", {
                "ws-row--sel": y.value?.id === t.id,
                "ws-row--drop": F.value === t.id,
                "ws-row--drag": J.value === t.id
              }]),
              draggable: d(t, i.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (u) => ot(u, t),
              onDragend: lt,
              onDragover: (u) => it(u, t),
              onDragleave: e[11] || (e[11] = (u) => F.value = null),
              onDrop: (u) => st(u, t),
              onClick: (u) => te(t),
              onDblclick: (u) => g(t) ? r(m)("navigate", t.id) : be(t),
              onKeydown: [
                fe((u) => te(t), ["enter"]),
                fe(O((u) => te(t), ["prevent"]), ["space"]),
                (u) => rt(u, t)
              ],
              onContextmenu: (u) => he(t, u)
            }, [
              e[58] || (e[58] = s("span", { class: "ws-edge" }, null, -1)),
              p(r(R), {
                icon: ae(t),
                class: "ws-row-ico",
                style: Q({ color: re(t) })
              }, null, 8, ["icon", "style"]),
              s("span", Eo, $(t.name), 1),
              p(Et, {
                state: t,
                onRetry: (u) => $e(t)
              }, null, 8, ["state", "onRetry"]),
              p(r(ft), { tone: "muted" }, {
                default: M(() => [
                  x($(Pe(t)), 1)
                ]),
                _: 2
              }, 1024),
              s("span", Do, $(Lt(t.updated_at)), 1),
              s("button", {
                class: "ws-row-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: O((u) => he(t, u), ["stop"])
              }, [
                p(r(R), { icon: "tabler:dots" })
              ], 8, xo)
            ], 42, $o))), 128))
          ])) : we.value.length ? (a(), v("div", _o, [
            (a(!0), v(z, null, ee(we.value, (t) => (a(), v("div", {
              key: t.id,
              class: X(["ws-tile", {
                "ws-tile--sel": y.value?.id === t.id,
                "ws-row--drop": F.value === t.id
              }]),
              draggable: d(t, i.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (u) => ot(u, t),
              onDragend: lt,
              onDragover: (u) => it(u, t),
              onDragleave: e[12] || (e[12] = (u) => F.value = null),
              onDrop: (u) => st(u, t),
              onClick: (u) => te(t),
              onDblclick: (u) => g(t) ? r(m)("navigate", t.id) : be(t),
              onKeydown: [
                fe((u) => te(t), ["enter"]),
                fe(O((u) => te(t), ["prevent"]), ["space"]),
                (u) => rt(u, t)
              ],
              onContextmenu: (u) => he(t, u)
            }, [
              s("button", {
                class: "ws-row-menu ws-tile-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: O((u) => he(t, u), ["stop"])
              }, [
                p(r(R), { icon: "tabler:dots" })
              ], 8, To),
              p(r(R), {
                icon: ae(t),
                class: "ws-tile-ico",
                style: Q({ color: re(t) })
              }, null, 8, ["icon", "style"]),
              s("span", {
                class: "ws-tile-name",
                title: t.name
              }, $(t.name), 9, Ro),
              p(Et, {
                state: t,
                onRetry: (u) => $e(t)
              }, null, 8, ["state", "onRetry"])
            ], 42, So))), 128))
          ])) : b.value.length ? (a(), A(r(Fe), {
            key: 4,
            icon: "tabler:search-off",
            title: "No matches",
            hint: `Nothing here matches “${T.value}”.`,
            cta: "Clear filter",
            "cta-icon": "tabler:x",
            onCta: e[13] || (e[13] = (t) => T.value = "")
          }, null, 8, ["hint"])) : Me.value ? (a(), A(r(Fe), {
            key: 5,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Create a folder or entry, or upload files.",
            cta: "New entry",
            "cta-icon": "tabler:plus",
            onCta: e[14] || (e[14] = (t) => W.value = !0)
          })) : (a(), A(r(Fe), {
            key: 6,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Nothing has been shared into this folder yet."
          }))
        ], 34),
        y.value ? (a(), v(z, { key: 0 }, [
          s("div", {
            class: X(["ws-divider", { resizing: We.value }]),
            onPointerdown: Gt,
            onPointermove: Xt,
            onPointerup: Ve,
            onPointercancel: Ve,
            onLostpointercapture: Ve
          }, null, 34),
          s("aside", {
            class: "ws-preview",
            style: Q({ "--ws-preview-width": De.value + "px" })
          }, [
            s("div", Lo, [
              p(r(R), {
                icon: ae(y.value),
                style: Q({ color: re(y.value) })
              }, null, 8, ["icon", "style"]),
              s("span", Ao, $(y.value.name), 1),
              e[59] || (e[59] = s("span", { class: "ws-spacer" }, null, -1)),
              y.value.type !== "folder" ? (a(), A(r(U), {
                key: 0,
                icon: "tabler:maximize",
                label: "Open",
                size: "sm",
                onClick: e[17] || (e[17] = (t) => be(y.value))
              })) : k("", !0),
              d(y.value, i.ADMIN) ? (a(), A(r(U), {
                key: 1,
                icon: "tabler:share-3",
                label: "Share",
                size: "sm",
                onClick: e[18] || (e[18] = (t) => Z.value = y.value)
              })) : k("", !0),
              p(r(U), {
                icon: "tabler:adjustments",
                label: "Properties",
                size: "sm",
                onClick: e[19] || (e[19] = (t) => Ee(y.value))
              }),
              p(r(U), {
                icon: "tabler:x",
                label: "Close",
                size: "sm",
                onClick: e[20] || (e[20] = (t) => y.value = null)
              })
            ]),
            ge(y.value) ? (a(), A(xe, {
              key: 0,
              tag: ge(y.value),
              attrs: Ye(y.value, "preview"),
              class: "ws-renderer"
            }, null, 8, ["tag", "attrs"])) : (a(), A($t, {
              key: 1,
              entry: y.value,
              mode: "preview",
              class: "ws-renderer"
            }, null, 8, ["entry"]))
          ], 4)
        ], 64)) : k("", !0)
      ]),
      P.entry ? (a(), A(Hn, {
        key: 2,
        x: P.x,
        y: P.y,
        onClose: H
      }, {
        default: M(() => [
          g(P.entry) ? (a(), v("button", {
            key: 0,
            class: "ws-menu-item",
            onClick: e[21] || (e[21] = (t) => {
              r(m)("navigate", P.entry.id), H();
            })
          }, [
            p(r(R), { icon: "tabler:folder-open" }),
            e[60] || (e[60] = x(" Open", -1))
          ])) : (a(), v(z, { key: 1 }, [
            s("button", {
              class: "ws-menu-item",
              onClick: e[22] || (e[22] = (t) => {
                te(P.entry), H();
              })
            }, [
              p(r(R), { icon: "tabler:eye" }),
              e[61] || (e[61] = x(" Preview", -1))
            ]),
            s("button", {
              class: "ws-menu-item",
              onClick: e[23] || (e[23] = (t) => be(P.entry))
            }, [
              p(r(R), { icon: "tabler:maximize" }),
              e[62] || (e[62] = x(" Open", -1))
            ])
          ], 64)),
          d(P.entry, i.WRITE) ? (a(), v("button", {
            key: 2,
            class: "ws-menu-item",
            onClick: e[24] || (e[24] = (t) => Ee(P.entry))
          }, [
            p(r(R), { icon: "tabler:cursor-text" }),
            e[63] || (e[63] = x(" Rename…", -1))
          ])) : k("", !0),
          d(P.entry, i.WRITE) ? (a(), v("button", {
            key: 3,
            class: "ws-menu-item",
            onClick: e[25] || (e[25] = (t) => It(P.entry))
          }, [
            p(r(R), { icon: "tabler:folder-symlink" }),
            e[64] || (e[64] = x(" Move to…", -1))
          ])) : k("", !0),
          d(P.entry, i.ADMIN) ? (a(), v("button", {
            key: 4,
            class: "ws-menu-item",
            onClick: e[26] || (e[26] = (t) => {
              Z.value = P.entry, H();
            })
          }, [
            p(r(R), { icon: "tabler:user-plus" }),
            e[65] || (e[65] = x(" Share…", -1))
          ])) : k("", !0),
          s("button", {
            class: "ws-menu-item",
            onClick: e[27] || (e[27] = (t) => Vt(P.entry))
          }, [
            p(r(R), { icon: "tabler:package-export" }),
            e[66] || (e[66] = x(" Export", -1))
          ]),
          d(P.entry, i.DELETE) ? (a(), v("div", Mo)) : k("", !0),
          d(P.entry, i.DELETE) ? (a(), v("button", {
            key: 6,
            class: "ws-menu-item ws-menu-danger",
            onClick: e[28] || (e[28] = (t) => $e(P.entry))
          }, [
            p(r(R), { icon: "tabler:trash" }),
            e[67] || (e[67] = x(" Delete", -1))
          ])) : k("", !0)
        ]),
        _: 1
      }, 8, ["x", "y"])) : k("", !0),
      W.value ? (a(), v("div", {
        key: 3,
        class: "ws-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "ws-new-heading",
        onClick: e[30] || (e[30] = O((t) => W.value = !1, ["self"]))
      }, [
        s("div", Po, [
          s("div", Oo, [
            e[68] || (e[68] = x("New entry", -1)),
            e[69] || (e[69] = s("span", { class: "ws-spacer" }, null, -1)),
            p(r(U), {
              icon: "tabler:x",
              label: "Close new entry",
              size: "sm",
              onClick: e[29] || (e[29] = (t) => W.value = !1)
            })
          ]),
          s("div", jo, [
            (a(!0), v(z, null, ee(Rt.value, (t) => (a(), v("button", {
              key: t.value,
              type: "button",
              class: "ws-type-btn",
              title: t.description || t.label,
              onClick: (u) => Mt(t)
            }, [
              p(r(R), {
                icon: t.icon,
                style: Q({ color: t.color })
              }, null, 8, ["icon", "style"]),
              s("span", null, $(t.label), 1)
            ], 8, No))), 128))
          ])
        ])
      ])) : k("", !0),
      j.value?.create?.view && At.value ? (a(), v("div", {
        key: 4,
        class: "ws-modal",
        onCreated: et,
        onClose: e[31] || (e[31] = (t) => j.value = null),
        onClick: e[32] || (e[32] = O((t) => j.value = null, ["self"]))
      }, [
        p(xe, {
          tag: j.value.create.view,
          attrs: Ze.value
        }, null, 8, ["tag", "attrs"])
      ], 32)) : j.value?.create?.view ? (a(), v("div", {
        key: 5,
        class: "ws-modal",
        onCreated: et,
        onClose: e[33] || (e[33] = (t) => j.value = null),
        onClick: e[34] || (e[34] = O((t) => j.value = null, ["self"]))
      }, [
        s("div", zo, [
          p(xe, {
            tag: j.value.create.view,
            attrs: Ze.value,
            fill: !1,
            class: "ws-create-mount"
          }, null, 8, ["tag", "attrs"])
        ])
      ], 32)) : k("", !0),
      G.value ? (a(), v("div", {
        key: 6,
        class: "ws-modal",
        onClick: e[36] || (e[36] = O((t) => {
          G.value = null, ne.value = null;
        }, ["self"]))
      }, [
        s("div", Io, [
          s("div", Wo, "Delete " + $(g(G.value) ? "folder" : "entry"), 1),
          g(G.value) ? (a(), v("div", Vo, " Deletes this folder and " + $(ne.value ?? "…") + " entries. Uploaded files stay in Files. ", 1)) : G.value.type === "file" ? (a(), v("div", Fo, "Removes it from the workspace. The file stays in Files.")) : (a(), v("div", Bo, "Deletes this entry from the workspace.")),
          s("div", Uo, [
            p(r(q), {
              variant: "ghost",
              onClick: e[35] || (e[35] = (t) => {
                G.value = null, ne.value = null;
              })
            }, {
              default: M(() => [...e[70] || (e[70] = [
                x("Cancel", -1)
              ])]),
              _: 1
            }),
            p(r(q), {
              icon: "tabler:trash",
              onClick: Ft
            }, {
              default: M(() => [...e[71] || (e[71] = [
                x("Delete", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])) : k("", !0),
      D.open && D.entry ? (a(), v("div", {
        key: 7,
        class: "ws-modal",
        onClick: e[42] || (e[42] = O((t) => D.open = !1, ["self"]))
      }, [
        s("div", {
          ref_key: "propsDialogEl",
          ref: ut,
          class: "ws-dialog"
        }, [
          s("div", Ho, [
            e[72] || (e[72] = x("Properties", -1)),
            e[73] || (e[73] = s("span", { class: "ws-spacer" }, null, -1)),
            p(r(U), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[37] || (e[37] = (t) => D.open = !1)
            })
          ]),
          se.value ? (a(), A(r(pe), {
            key: 0,
            tone: "error",
            onDismiss: e[38] || (e[38] = (t) => se.value = "")
          }, {
            default: M(() => [
              x($(se.value), 1)
            ]),
            _: 1
          })) : k("", !0),
          p(r(vt), { label: "Name" }, {
            default: M(() => [
              s("div", Ko, [
                p(r(dn), {
                  modelValue: D.icon,
                  "onUpdate:modelValue": e[39] || (e[39] = (t) => D.icon = t),
                  fallback: ie.value[D.entry.type]?.icon
                }, null, 8, ["modelValue", "fallback"]),
                p(r(cn), {
                  modelValue: D.name,
                  "onUpdate:modelValue": e[40] || (e[40] = (t) => D.name = t)
                }, null, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          p(r(vt), { label: "Color" }, {
            default: M(() => [
              s("div", qo, [
                (a(), v(z, null, ee(Ut, (t) => s("button", {
                  key: t.value,
                  type: "button",
                  class: X(["ws-swatch", { on: D.color === t.value }]),
                  title: t.label,
                  "aria-label": `Use color ${t.label}`,
                  style: Q({ background: t.value || "transparent" }),
                  onClick: (u) => D.color = t.value
                }, [
                  t.value ? k("", !0) : (a(), A(r(R), {
                    key: 0,
                    icon: "tabler:ban"
                  }))
                ], 14, Go)), 64))
              ])
            ]),
            _: 1
          }),
          s("div", Xo, [
            s("div", null, [
              e[74] || (e[74] = s("span", null, "Type", -1)),
              s("span", null, $(Pe(D.entry)), 1)
            ]),
            s("div", null, [
              e[75] || (e[75] = s("span", null, "Status", -1)),
              s("code", null, $(D.entry.status), 1)
            ]),
            s("div", null, [
              e[76] || (e[76] = s("span", null, "Access", -1)),
              s("code", null, $(C(D.entry.access_level)), 1)
            ]),
            s("div", null, [
              e[77] || (e[77] = s("span", null, "Created", -1)),
              s("code", null, $(Xe(D.entry.created_at)), 1)
            ]),
            s("div", null, [
              e[78] || (e[78] = s("span", null, "Updated", -1)),
              s("code", null, $(Xe(D.entry.updated_at)), 1)
            ])
          ]),
          s("div", Yo, [
            p(r(q), {
              variant: "ghost",
              onClick: e[41] || (e[41] = (t) => D.open = !1)
            }, {
              default: M(() => [...e[79] || (e[79] = [
                x("Close", -1)
              ])]),
              _: 1
            }),
            d(D.entry, i.WRITE) ? (a(), A(r(q), {
              key: 0,
              icon: "tabler:device-floppy",
              onClick: Ht
            }, {
              default: M(() => [...e[80] || (e[80] = [
                x("Save", -1)
              ])]),
              _: 1
            })) : k("", !0)
          ])
        ], 512)
      ])) : k("", !0),
      K.value ? (a(), v("div", {
        key: 8,
        class: "ws-modal",
        onClick: e[46] || (e[46] = O((t) => K.value = null, ["self"]))
      }, [
        s("div", Jo, [
          s("div", Qo, [
            x("Move “" + $(K.value.name) + "”", 1),
            e[81] || (e[81] = s("span", { class: "ws-spacer" }, null, -1)),
            p(r(U), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[43] || (e[43] = (t) => K.value = null)
            })
          ]),
          s("div", Zo, [
            s("button", {
              class: "ws-crumb",
              onClick: e[44] || (e[44] = (t) => Ce(null))
            }, [
              p(r(R), { icon: "tabler:home" })
            ]),
            (a(!0), v(z, null, ee(Ne.value, (t) => (a(), v(z, {
              key: t.id
            }, [
              e[82] || (e[82] = s("span", { class: "ws-sep" }, "/", -1)),
              s("button", {
                class: "ws-crumb",
                onClick: (u) => Ce(t.id)
              }, $(t.name), 9, el)
            ], 64))), 128))
          ]),
          s("div", tl, [
            Ie.value ? (a(), A(r(pt), {
              key: 0,
              label: "Loading…"
            })) : (a(), v(z, { key: 1 }, [
              (a(!0), v(z, null, ee(ze.value, (t) => (a(), v("button", {
                key: t.id,
                class: "ws-move-folder",
                onClick: (u) => Ce(t.id)
              }, [
                p(r(R), {
                  icon: ae(t),
                  style: Q({ color: re(t) })
                }, null, 8, ["icon", "style"]),
                s("span", null, $(t.name), 1),
                p(r(R), {
                  icon: "tabler:chevron-right",
                  class: "ws-move-into"
                })
              ], 8, nl))), 128)),
              ze.value.length ? k("", !0) : (a(), v("p", ol, "No folders here."))
            ], 64))
          ]),
          s("div", ll, [
            p(r(q), {
              variant: "ghost",
              onClick: e[45] || (e[45] = (t) => K.value = null)
            }, {
              default: M(() => [...e[83] || (e[83] = [
                x("Cancel", -1)
              ])]),
              _: 1
            }),
            p(r(q), {
              icon: "tabler:folder-symlink",
              disabled: je.value === (K.value.parent_id ?? null),
              onClick: Wt
            }, {
              default: M(() => [...e[84] || (e[84] = [
                x("Move here", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ])) : k("", !0),
      N.value ? (a(), v("div", sl, [
        s("div", il, [
          p(r(U), {
            icon: "tabler:arrow-left",
            label: "Back",
            size: "sm",
            onClick: e[47] || (e[47] = (t) => ke())
          }),
          p(r(R), {
            icon: ae(N.value),
            style: Q({ color: re(N.value) })
          }, null, 8, ["icon", "style"]),
          s("span", al, $(N.value.name), 1),
          p(r(ft), { tone: "muted" }, {
            default: M(() => [
              x($(Pe(N.value)), 1)
            ]),
            _: 1
          }),
          e[85] || (e[85] = s("span", { class: "ws-spacer" }, null, -1)),
          d(N.value, i.ADMIN) ? (a(), A(r(U), {
            key: 0,
            icon: "tabler:share-3",
            label: "Share",
            size: "sm",
            onClick: e[48] || (e[48] = (t) => Z.value = N.value)
          })) : k("", !0),
          p(r(U), {
            icon: "tabler:adjustments",
            label: "Properties",
            size: "sm",
            onClick: e[49] || (e[49] = (t) => Ee(N.value))
          }),
          p(r(U), {
            icon: "tabler:x",
            label: "Close",
            size: "sm",
            onClick: e[50] || (e[50] = (t) => ke())
          })
        ]),
        ge(N.value) ? (a(), A(xe, {
          key: 0,
          tag: ge(N.value),
          attrs: Ye(N.value, "full"),
          class: "ws-manage-body"
        }, null, 8, ["tag", "attrs"])) : (a(), A($t, {
          key: 1,
          entry: N.value,
          mode: "full",
          class: "ws-manage-body"
        }, null, 8, ["entry"]))
      ])) : k("", !0),
      Z.value ? (a(), A(Xn, {
        key: 10,
        config: qt.value,
        onClose: e[51] || (e[51] = (t) => Z.value = null),
        onChanged: e[52] || (e[52] = (t) => V(f.value))
      }, null, 8, ["config"])) : k("", !0)
    ]));
  }
}), hl = {
  rootComponent: ul,
  plugins: [In]
};
export {
  hl as mountConfig
};
//# sourceMappingURL=lazy-mount-BBby_phr.js.map
