import Yt from "primevue/config";
import Jt from "primevue/contextmenu";
import Qt from "primevue/menu";
import Zt from "primevue/portal";
import { defineComponent as X, openBlock as a, createElementBlock as v, normalizeClass as G, createBlock as R, unref as u, createVNode as p, createElementVNode as s, createCommentVNode as h, renderSlot as xe, toDisplayString as E, withCtx as L, createTextVNode as _, h as en, Teleport as tn, ref as C, onMounted as Te, watch as me, onBeforeUnmount as Re, withDirectives as nn, vShow as on, nextTick as Fe, withModifiers as M, normalizeStyle as Q, Fragment as j, withKeys as fe, computed as O, renderList as ee, reactive as ct, onUnmounted as ln } from "vue";
import { Icon as T } from "@iconify/vue";
import { a as sn, u as an } from "./wc-runtime-CNDpK4lj.js";
import { d as H, c as pe, u as rn, _ as vt, a as un, b as dn } from "./Notice.vue_vue_type_script_setup_true_lang-Cz2etgDv.js";
import { loadByTagName as Dt, on as cn } from "@wippy-fe/proxy";
import vn from "primevue/button";
import fn from "primevue/progressspinner";
const pn = ["aria-label", "title", "disabled"], mn = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, F = /* @__PURE__ */ X({
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
    const f = l;
    return (m, i) => (a(), v("button", {
      class: G(["km-iconbtn", [o.variant !== "plain" && o.variant, o.size !== "md" && o.size, o.active && "on", o.tone && `tone-${o.tone}`]]),
      "aria-label": o.label,
      title: o.label,
      disabled: o.disabled,
      onClick: i[0] || (i[0] = (c) => f("click"))
    }, [
      o.spin ? (a(), v("span", mn)) : (a(), R(u(T), {
        key: 1,
        icon: o.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"]))
    ], 10, pn));
  }
}), yn = { class: "km-search" }, wn = ["value", "placeholder"], gn = /* @__PURE__ */ X({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(o, { emit: l }) {
    const f = l;
    return (m, i) => (a(), v("div", yn, [
      p(u(T), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      s("input", {
        class: "km-search-input",
        value: o.modelValue,
        placeholder: o.placeholder || "Search",
        onInput: i[0] || (i[0] = (c) => f("update:modelValue", c.target.value))
      }, null, 40, wn),
      o.modelValue ? (a(), v("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: i[1] || (i[1] = (c) => f("update:modelValue", ""))
      }, [
        p(u(T), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : h("", !0)
    ]));
  }
}), bn = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, ft = /* @__PURE__ */ X({
  __name: "Pill",
  props: {
    tone: { default: "muted" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(o) {
    return (l, f) => (a(), v("span", {
      class: G(["km-pill", `t-${o.tone}`])
    }, [
      o.dot ? (a(), v("span", bn)) : o.icon ? (a(), R(u(T), {
        key: 1,
        icon: o.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : h("", !0),
      xe(l.$slots, "default")
    ], 2));
  }
}), kn = { class: "km-loading" }, hn = { key: 0 }, pt = /* @__PURE__ */ X({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(o) {
    return (l, f) => (a(), v("div", kn, [
      f[0] || (f[0] = s("span", {
        class: "km-spin lg",
        "aria-hidden": "true"
      }, null, -1)),
      o.label ? (a(), v("span", hn, E(o.label), 1)) : h("", !0)
    ]));
  }
}), Cn = { class: "km-empty" }, $n = { class: "km-empty-title" }, En = {
  key: 0,
  class: "km-empty-hint"
}, Ve = /* @__PURE__ */ X({
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
    const f = l;
    return (m, i) => (a(), v("div", Cn, [
      p(u(T), {
        icon: o.icon,
        class: "km-empty-ico",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      s("div", $n, E(o.title), 1),
      o.hint ? (a(), v("p", En, E(o.hint), 1)) : h("", !0),
      o.cta ? (a(), R(H, {
        key: 1,
        icon: o.ctaIcon,
        onClick: i[0] || (i[0] = (c) => f("cta"))
      }, {
        default: L(() => [
          _(E(o.cta), 1)
        ]),
        _: 1
      }, 8, ["icon"])) : h("", !0)
    ]));
  }
}), Dn = "data-wippy-overlay-layer";
function xt() {
  return typeof window < "u" && typeof window.document < "u";
}
function _t() {
  return xt() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function xn() {
  return _t() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const _n = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Sn = 0;
const _e = /* @__PURE__ */ new WeakMap();
function mt(o, l) {
  const f = o.style;
  f.setProperty("position", "fixed", "important"), f.setProperty("inset", "auto", "important"), f.setProperty("margin", "0", "important"), f.setProperty("position-anchor", l), f.setProperty("position-area", "bottom span-right"), f.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), f.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), f.setProperty("max-width", "stretch", "important");
}
function Tn(o, l) {
  if (!_n.test(o.className))
    return;
  const f = o.style.cssText;
  mt(o, l), o.getAttribute("popover") !== "manual" && o.setAttribute("popover", "manual");
  try {
    o.matches(":popover-open") || o.showPopover();
  } catch {
  }
  if (!o.matches(":popover-open")) {
    o.removeAttribute("popover"), o.style.cssText = f;
    return;
  }
  if (!_e.has(o)) {
    const m = new MutationObserver(() => {
      const i = o.style;
      (i.top !== "auto" || i.left !== "auto" || i.margin !== "0px" || i.getPropertyPriority("top") !== "important" || i.getPropertyPriority("left") !== "important" || i.getPropertyPriority("margin") !== "important" || i.getPropertyPriority("min-width") !== "important" || i.maxWidth !== "stretch" || i.getPropertyPriority("max-width") !== "important") && mt(o, l);
    });
    m.observe(o, { attributes: !0, attributeFilter: ["style"] }), _e.set(o, m);
  }
}
function He(o) {
  const l = _e.get(o);
  l && (l.disconnect(), _e.delete(o));
}
function Rn(o) {
  const l = o && typeof o.getRootNode == "function" ? o.getRootNode() : null;
  return l instanceof ShadowRoot ? l : null;
}
function Be(o) {
  o.style.top = "0px", o.style.left = "0px";
  const l = o.getBoundingClientRect();
  o.style.top = `${-window.scrollY - l.top}px`, o.style.left = `${-window.scrollX - l.left}px`;
}
const Se = /* @__PURE__ */ new Set(), Ke = /* @__PURE__ */ new WeakMap();
let yt = !1, Ue = !1;
function Ln() {
  Ue = !1;
  for (const o of Se) {
    if (!o.isConnected) {
      for (const l of Array.from(o.children))
        l instanceof HTMLElement && He(l);
      Se.delete(o), Ke.get(o)?.disconnect();
      continue;
    }
    o.childElementCount > 0 && Be(o);
  }
}
function wt() {
  Ue || (Ue = !0, requestAnimationFrame(Ln));
}
function An(o) {
  const l = document.createElement("div");
  l.setAttribute(Dn, "");
  const f = _t();
  if (l.style.cssText = f ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", f && l.setAttribute("popover", "manual"), o.appendChild(l), f) {
    try {
      l.showPopover();
    } catch {
    }
    l.matches(":popover-open") || (l.removeAttribute("popover"), l.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  Be(l);
  const m = new MutationObserver((i) => {
    const c = l.__wippyAnchorName;
    for (const b of i) {
      if (c)
        for (const $ of Array.from(b.addedNodes))
          $ instanceof HTMLElement && Tn($, c);
      for (const $ of Array.from(b.removedNodes))
        $ instanceof HTMLElement && He($);
    }
    l.isConnected && l.childElementCount > 0 && Be(l);
  });
  return m.observe(l, { childList: !0 }), Ke.set(l, m), Se.add(l), yt || (yt = !0, window.addEventListener("scroll", wt, { capture: !0, passive: !0 }), window.addEventListener("resize", wt, { passive: !0 })), l;
}
function gt(o) {
  if (!(!o.hostRoot || o.layer) && (o.layer = An(o.hostRoot), xn())) {
    const l = o.$el ? o.$el.parentElement : null;
    l && (o.anchorName = `--wippy-a-${++Sn}`, o.anchorTrigger = l, l.style.setProperty("anchor-name", o.anchorName), o.layer.__wippyAnchorName = o.anchorName);
  }
}
function bt(o) {
  if (o.anchorTrigger && (o.anchorTrigger.style.removeProperty("anchor-name"), o.anchorTrigger = null), o.anchorName = null, o.layer) {
    for (const l of Array.from(o.layer.children))
      l instanceof HTMLElement && He(l);
    Se.delete(o.layer), Ke.get(o.layer)?.disconnect(), o.layer.remove(), o.layer = null;
  }
}
let kt = !1;
function Mn() {
  if (kt)
    return;
  const o = Qt;
  !o.methods || typeof o.methods.bindOutsideClickListener != "function" || (o.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (l) => {
      const f = l.composedPath(), m = this.container && !f.includes(this.container), i = !(this.target && f.includes(this.target));
      this.overlayVisible && m && i ? this.hide() : !this.popup && m && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, kt = !0);
}
let ht = !1;
function Pn() {
  if (ht)
    return;
  const o = Jt;
  !o.methods || typeof o.methods.bindOutsideClickListener != "function" || (o.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (l) => {
      const f = l.composedPath(), m = this.container && !f.includes(this.container), i = this.visible ? !(this.target && f.includes(this.target)) : !0;
      m && i && this.hide();
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, ht = !0);
}
let Ct = !1;
function jn() {
  if (Ct)
    return;
  Ct = !0;
  const o = Zt;
  o.computed = o.computed || {}, o.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, o.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, o.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, o.mounted = function() {
    xt() && (this.hostRoot = Rn(this.$el), this.mounted = !0, this.hostRoot && (this.inline || gt(this), this.$watch("inline", (l) => {
      l ? bt(this) : gt(this);
    })));
  }, o.render = function() {
    return this.inline ? xe(this.$slots, "default", { key: 0 }) : this.mounted ? en(tn, { key: 1, to: this.resolvedTarget || document.body }, [
      xe(this.$slots, "default")
    ]) : h("", !0);
  }, o.unmounted = function() {
    bt(this);
  };
}
const On = {
  install: (o) => {
    Mn(), Pn(), jn(), o.use(Yt, { theme: "none" });
  }
}, Nn = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function zn(o, l) {
  return {
    "entry-id": o.id,
    route: o.id,
    mode: l,
    "read-only": String(o.access_level != null && (o.access_level & 2) !== 2)
  };
}
const In = () => sn(), Wn = () => an(), Vn = {
  key: 0,
  class: "ws-renderer-fail"
}, De = /* @__PURE__ */ X({
  __name: "EntryRenderer",
  props: {
    tag: {},
    attrs: {},
    fill: { type: Boolean, default: !0 }
  },
  setup(o) {
    const l = o, f = C(null), m = C(!1);
    let i = null;
    async function c($) {
      if (!customElements.get($) && (await Dt($, { timeoutMs: 8e3 }), !customElements.get($)))
        throw new Error("Content is unavailable.");
    }
    async function b() {
      if (m.value = !1, !!f.value) {
        f.value.innerHTML = "", i = null;
        try {
          await c(l.tag), i = document.createElement(l.tag);
          for (const [$, k] of Object.entries(l.attrs || {}))
            k != null && k !== "" && i.setAttribute($, String(k));
          l.fill === !1 ? (i.style.display = "block", i.style.width = "100%") : (i.style.position = "absolute", i.style.inset = "0"), f.value.appendChild(i), m.value = !customElements.get(l.tag);
        } catch {
          m.value = !0;
        }
      }
    }
    return Te(b), me(() => [l.tag, JSON.stringify(l.attrs)], b), Re(() => {
      i = null;
    }), ($, k) => (a(), v("div", {
      class: G(["ws-renderer-host", { "ws-renderer-flow": o.fill === !1 }])
    }, [
      m.value ? (a(), v("div", Vn, [
        p(u(pe), { tone: "error" }, {
          default: L(() => [
            k[1] || (k[1] = _("Content is unavailable. ", -1)),
            p(u(H), { onClick: b }, {
              default: L(() => [...k[0] || (k[0] = [
                _("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : h("", !0),
      nn(s("div", {
        ref_key: "host",
        ref: f,
        class: "ws-renderer-mount"
      }, null, 512), [
        [on, !m.value]
      ])
    ], 2));
  }
}), Fn = /* @__PURE__ */ X({
  __name: "MenuLayer",
  props: {
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(o, { emit: l }) {
    const f = o, m = C(null), i = C(null), c = C({ left: "0px", top: "0px", visibility: "hidden" });
    function b() {
      const k = m.value?.getBoundingClientRect(), D = i.value?.getBoundingClientRect();
      if (!k || !D) return;
      const y = Math.max(0, Math.min(f.x - k.left, k.width - D.width)), r = Math.max(0, Math.min(f.y - k.top, k.height - D.height));
      c.value = { left: `${y}px`, top: `${r}px`, visibility: "visible" };
    }
    me(() => [f.x, f.y], () => {
      Fe(b);
    }), Te(() => {
      Fe(b), window.addEventListener("resize", b);
    }), Re(() => window.removeEventListener("resize", b));
    const $ = l;
    return (k, D) => (a(), v("div", {
      ref_key: "layer",
      ref: m,
      class: "ws-menu-layer",
      onClick: D[1] || (D[1] = (y) => $("close")),
      onContextmenu: D[2] || (D[2] = M((y) => $("close"), ["prevent"]))
    }, [
      s("div", {
        ref_key: "panel",
        ref: i,
        class: "ws-menu",
        style: Q(c.value),
        onClick: D[0] || (D[0] = M(() => {
        }, ["stop"]))
      }, [
        xe(k.$slots, "default")
      ], 4)
    ], 544));
  }
}), Bn = ["onKeydown"], Un = {
  class: "ws-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "Sharing"
}, Hn = { class: "ws-dialog-foot" }, Kn = /* @__PURE__ */ X({
  __name: "ShareHost",
  props: {
    config: {}
  },
  emits: ["close", "changed"],
  setup(o, { emit: l }) {
    const f = o, m = l, i = C(null);
    let c = null;
    const b = C(!1);
    function $() {
      m("close");
    }
    function k(y) {
      m("changed", y.detail);
    }
    async function D() {
      if (b.value = !1, !!i.value)
        try {
          if (await Dt("kickside-share", { timeoutMs: 8e3 }), !customElements.get("kickside-share")) throw new Error("Sharing is unavailable.");
          c = document.createElement("kickside-share"), f.config && c.setAttribute("config", f.config), c.addEventListener("close", $), c.addEventListener("changed", k), i.value.appendChild(c);
        } catch {
          b.value = !0;
        }
    }
    return Te(D), me(() => f.config, (y) => {
      c && y && c.setAttribute("config", y);
    }), Re(() => {
      c && (c.removeEventListener("close", $), c.removeEventListener("changed", k), c.remove(), c = null);
    }), (y, r) => (a(), v(j, null, [
      s("div", {
        ref_key: "host",
        ref: i,
        class: "ws-share-host"
      }, null, 512),
      b.value ? (a(), v("div", {
        key: 0,
        class: "ws-modal",
        onKeydown: fe(M($, ["stop"]), ["esc"]),
        onClick: M($, ["self"])
      }, [
        s("section", Un, [
          p(u(pe), {
            tone: "error",
            onDismiss: $
          }, {
            default: L(() => [...r[0] || (r[0] = [
              _("Sharing is unavailable.", -1)
            ])]),
            _: 1
          }),
          s("div", Hn, [
            p(u(H), {
              "aria-label": "Retry sharing",
              onClick: D
            }, {
              default: L(() => [...r[1] || (r[1] = [
                _("Retry", -1)
              ])]),
              _: 1
            }),
            p(u(H), {
              variant: "ghost",
              onClick: $
            }, {
              default: L(() => [...r[2] || (r[2] = [
                _("Close", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ], 40, Bn)) : h("", !0)
    ], 64));
  }
}), qn = { class: "ws-cv-section" }, Gn = { class: "ws-cv-row" }, Xn = { class: "ws-cv-v" }, Yn = { class: "ws-cv-row" }, Jn = { class: "ws-cv-v" }, Qn = { class: "ws-cv-row" }, Zn = { class: "ws-cv-v" }, eo = {
  key: 0,
  class: "ws-cv-section"
}, to = {
  key: 0,
  class: "ws-cv-row"
}, no = { class: "ws-cv-v" }, oo = {
  key: 1,
  class: "ws-cv-row"
}, lo = { class: "ws-cv-v" }, so = {
  key: 1,
  class: "ws-cv-section"
}, io = { class: "ws-cv-k" }, ao = { class: "ws-cv-v" }, $t = /* @__PURE__ */ X({
  __name: "ComponentView",
  props: {
    entry: {},
    mode: {}
  },
  setup(o) {
    const l = o, f = /* @__PURE__ */ new Set(["title", "name", "icon", "type", "status", "color", "renderer"]);
    function m(y) {
      if (y == null || y === "") return null;
      if (typeof y == "number") return new Date(y < 2e10 ? y * 1e3 : y);
      const r = new Date(String(y));
      return isNaN(r.getTime()) ? null : r;
    }
    function i(y) {
      const r = m(y);
      return r ? r.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    }
    const c = O(() => ((l.entry.type || "item").split(".").pop() || "item").replace(/[_-]/g, " ").toUpperCase()), b = O(() => i(l.entry.created_at)), $ = O(() => i(l.entry.updated_at)), k = O(() => {
      const y = l.entry.access_level;
      if (y == null) return "Full (owner)";
      const r = [];
      return y & 1 && r.push("Read"), y & 2 && r.push("Write"), y & 4 && r.push("Delete"), y & 8 && r.push("Admin"), r.length ? r.join(" · ") : "None";
    }), D = O(() => {
      const y = l.entry.meta || {}, r = [];
      for (const [g, w] of Object.entries(y)) {
        if (f.has(g) || w == null || typeof w == "object") continue;
        const K = String(w);
        K !== "" && r.push({ k: g.replace(/[_-]/g, " "), v: K });
      }
      return r;
    });
    return (y, r) => (a(), v("div", {
      class: G(["ws-cv", `ws-cv--${o.mode || "preview"}`])
    }, [
      s("div", qn, [
        s("div", Gn, [
          r[0] || (r[0] = s("span", { class: "ws-cv-k" }, "Type", -1)),
          s("span", Xn, E(c.value), 1)
        ]),
        s("div", Yn, [
          r[1] || (r[1] = s("span", { class: "ws-cv-k" }, "Status", -1)),
          s("span", Jn, E(o.entry.status || "active"), 1)
        ]),
        s("div", Qn, [
          r[2] || (r[2] = s("span", { class: "ws-cv-k" }, "Access", -1)),
          s("span", Zn, E(k.value), 1)
        ])
      ]),
      b.value || $.value ? (a(), v("div", eo, [
        b.value ? (a(), v("div", to, [
          r[3] || (r[3] = s("span", { class: "ws-cv-k" }, "Created", -1)),
          s("span", no, E(b.value), 1)
        ])) : h("", !0),
        $.value ? (a(), v("div", oo, [
          r[4] || (r[4] = s("span", { class: "ws-cv-k" }, "Updated", -1)),
          s("span", lo, E($.value), 1)
        ])) : h("", !0)
      ])) : h("", !0),
      D.value.length ? (a(), v("div", so, [
        r[5] || (r[5] = s("div", { class: "ws-cv-sec-title" }, "Metadata", -1)),
        (a(!0), v(j, null, ee(D.value, (g) => (a(), v("div", {
          key: g.k,
          class: "ws-cv-row"
        }, [
          s("span", io, E(g.k), 1),
          s("span", ao, E(g.v), 1)
        ]))), 128))
      ])) : h("", !0)
    ], 2));
  }
}), ro = { key: 0 }, Et = /* @__PURE__ */ X({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(o) {
    const l = o, f = O(() => l.state.deletion_job === null || ["dead", "cancelled"].includes(l.state.deletion_job?.status || ""));
    return (m, i) => o.state.deleting_at ? (a(), v("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: i[1] || (i[1] = M(() => {
      }, ["stop"])),
      onKeydown: i[2] || (i[2] = M(() => {
      }, ["stop"]))
    }, [
      f.value ? (a(), v(j, { key: 0 }, [
        s("span", null, [
          i[3] || (i[3] = _("Deletion failed", -1)),
          o.state.deletion_job?.last_error ? (a(), v("span", ro, ": " + E(o.state.deletion_job.last_error), 1)) : h("", !0)
        ]),
        p(u(vn), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: i[0] || (i[0] = M((c) => m.$emit("retry"), ["stop"]))
        })
      ], 64)) : (a(), v(j, { key: 1 }, [
        p(u(fn), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        i[4] || (i[4] = s("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : h("", !0);
  }
});
function ve(o) {
  return !!o && typeof o == "object" && !Array.isArray(o);
}
function uo(o, l) {
  return o;
}
function co(o, l, f) {
  const m = ve(o) ? o : {}, i = [
    m,
    ve(m.data) ? m.data : null,
    ve(m.payload) ? m.payload : null,
    ve(m.detail) ? m.detail : null
  ].filter(Boolean);
  for (const c of i) {
    if (c.event !== "component.meta.changed" && c.event !== "component.deleting" && c.event !== "component.deleted") continue;
    const b = String(c.component_id || ""), $ = String(m.topic || c.topic || "");
    if (!b && (!$.startsWith("component.") || $ === "component.")) continue;
    const k = b || l || $.slice(10);
    return c.event === "component.deleting" && typeof c.deletion_job_id == "string" && c.deletion_job_id ? { event: c.event, component_id: k, deletion_job_id: c.deletion_job_id } : c.event !== "component.meta.changed" ? { event: c.event, component_id: k } : {
      event: "component.meta.changed",
      component_id: k,
      meta: uo(ve(c.meta) ? c.meta : {}),
      deleted: Array.isArray(c.deleted) ? c.deleted.map(String) : []
    };
  }
  return null;
}
function vo(o, l) {
  const f = co(o, l);
  return f && f.event !== "component.meta.changed" ? f : null;
}
function fo(o, l, f, m) {
  const i = /* @__PURE__ */ new Set(), c = /* @__PURE__ */ new Map();
  function b(D, y) {
    const r = o.value.find((N) => l(N) === D), g = c.get(D), w = y?.job_id || g?.state.deletion_job_id || r?.deletion_job_id, K = g ? g.state.deletion_job_id : r?.deleting_at ? r.deletion_job_id : void 0;
    if ((g || r?.deleting_at) && w === K || w && g?.superseded.has(w)) return;
    const S = {
      deleting_at: g?.state.deleting_at || r?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: w
    }, J = new Set(g?.superseded);
    for (const N of [g?.state.deletion_job_id, r?.deletion_job_id])
      N && N !== w && J.add(N);
    c.set(D, { state: S, superseded: J }), r && (Object.assign(r, S), r.deletion_job = void 0);
  }
  const $ = me(() => o.value, (D, y = []) => {
    const r = D.filter((g) => !i.has(l(g)));
    for (const g of y)
      i.has(l(g)) || r.some((w) => l(w) === l(g)) || (f?.(l(g)), g.deleting_at && m?.(l(g)));
    if (r.length !== D.length) {
      o.value = r;
      return;
    }
    for (const g of D) {
      g.deleting_at && g.deletion_job === void 0 && !y.includes(g) && (g.deletion_job = null);
      const w = c.get(l(g));
      if (w) {
        const S = g.deletion_job_id;
        g.deleting_at && S && S !== w.state.deletion_job_id && !w.superseded.has(S) && (w.state.deletion_job_id && w.superseded.add(w.state.deletion_job_id), w.state.deletion_job_id = S), S !== w.state.deletion_job_id && (g.deletion_job = void 0), Object.assign(g, w.state);
      }
      const K = y.find((S) => l(S) === l(g));
      g.deletion_job === void 0 && K?.deletion_job_id === g.deletion_job_id && (g.deletion_job = K?.deletion_job);
    }
  }, { immediate: !0 }), k = cn("@message", (D) => {
    const y = vo(D);
    if (!y) return;
    const r = o.value.find((g) => l(g) === y.component_id);
    y.event === "component.deleted" ? (r && !i.has(y.component_id) && (f?.(y.component_id), m?.(y.component_id)), i.add(y.component_id), c.delete(y.component_id), o.value = o.value.filter((g) => l(g) !== y.component_id)) : r && b(y.component_id, { job_id: y.deletion_job_id });
  });
  return Re(() => {
    $(), typeof k == "function" && k();
  }), { acceptDeletion: b };
}
const po = { class: "ws-strip" }, mo = { class: "ws-crumbs" }, yo = ["title", "onClick", "onDragover", "onDrop"], wo = { class: "ws-body" }, go = {
  key: 0,
  class: "ws-drop-hint"
}, bo = {
  key: 2,
  class: "ws-list"
}, ko = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], ho = { class: "ws-row-name" }, Co = { class: "ws-age" }, $o = ["aria-label", "onClick"], Eo = {
  key: 3,
  class: "ws-grid"
}, Do = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], xo = ["aria-label", "onClick"], _o = ["title"], So = { class: "ws-preview-head" }, To = { class: "ws-preview-title" }, Ro = {
  key: 5,
  class: "ws-menu-div"
}, Lo = { class: "ws-dialog" }, Ao = {
  class: "ws-dialog-head",
  id: "ws-new-heading"
}, Mo = { class: "ws-type-grid" }, Po = ["title", "onClick"], jo = { class: "ws-create-panel" }, Oo = { class: "ws-dialog" }, No = { class: "ws-dialog-head" }, zo = {
  key: 0,
  class: "ws-confirm-body"
}, Io = {
  key: 1,
  class: "ws-confirm-body"
}, Wo = {
  key: 2,
  class: "ws-confirm-body"
}, Vo = { class: "ws-dialog-foot" }, Fo = { class: "ws-dialog-head" }, Bo = { class: "ws-name-row" }, Uo = { class: "ws-swatches" }, Ho = ["title", "aria-label", "onClick"], Ko = { class: "ws-meta-grid" }, qo = { class: "ws-dialog-foot" }, Go = { class: "ws-dialog" }, Xo = { class: "ws-dialog-head" }, Yo = { class: "ws-move-crumbs" }, Jo = ["onClick"], Qo = { class: "ws-move-list" }, Zo = ["onClick"], el = {
  key: 0,
  class: "ws-move-none"
}, tl = { class: "ws-dialog-foot" }, nl = {
  key: 9,
  class: "ws-manage"
}, ol = { class: "ws-manage-head" }, ll = { class: "ws-manage-title" }, sl = "wc-entry-create", il = /* @__PURE__ */ X({
  __name: "Workspace",
  setup(o) {
    const l = rn(), f = In(), m = Wn(), i = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };
    function c(n, e) {
      const t = n?.access_level;
      return t == null || (Number(t) & e) === e;
    }
    function b(n) {
      return !!n && (n.type === "folder" || !!n.container);
    }
    function $(n) {
      if (n == null) return "Full";
      const e = Number(n), d = [[i.READ, "Read"], [i.WRITE, "Write"], [i.DELETE, "Delete"], [i.ADMIN, "Admin"]].filter(([V]) => (e & V) === V).map(([, V]) => V);
      return d.length ? d.join(" · ") : "None";
    }
    const k = C([]), D = C(""), y = C([]), r = C(null), g = C(null), w = C(null), K = C(!1), S = C(""), J = C(localStorage.getItem("ws-view") || "list"), N = C(!1), z = C(null), qe = C(null), Le = C(!1), le = C(!1), ie = O(() => {
      const n = {};
      for (const e of l.types.value) n[e.value] = e;
      return n;
    }), St = O(() => {
      const n = /* @__PURE__ */ new Set(), e = /* @__PURE__ */ new Set();
      for (const t of l.types.value) (n.has(t.value) ? e : n).add(t.value);
      return e;
    }), Tt = O(() => l.types.value.filter((n) => n.creatable && !n.picker_excluded && n.create?.view).sort((n, e) => n.value === "folder" ? -1 : e.value === "folder" ? 1 : (n.label || "").localeCompare(e.label || ""))), Ae = O(() => c(g.value, i.WRITE)), ye = O(() => {
      const n = D.value.trim().toLowerCase();
      return (n ? k.value.filter((t) => (t.name || "").toLowerCase().includes(n)) : [...k.value]).sort((t, d) => {
        const V = b(t) ? 0 : 1, ce = b(d) ? 0 : 1;
        return V !== ce ? V - ce : (t.name || "").localeCompare(d.name || "", void 0, { sensitivity: "base" });
      });
    });
    function ae(n) {
      return n.icon || n.meta?.icon || ie.value[n.type]?.icon || "tabler:file";
    }
    function re(n) {
      return n.meta?.color || ie.value[n.type]?.color || "var(--km-muted)";
    }
    function Me(n) {
      const e = St.value.has(n.type) ? "" : ie.value[n.type]?.label;
      return e ? e.toUpperCase() : ((n.type || "item").split(".").pop() || "item").replace(/[_-]+/g, " ").toUpperCase();
    }
    function Ge(n) {
      if (n == null || n === "") return null;
      if (typeof n == "number") return new Date(n < 2e10 ? n * 1e3 : n);
      const e = new Date(String(n));
      return isNaN(e.getTime()) ? null : e;
    }
    function Rt(n) {
      const e = Ge(n);
      if (!e) return "";
      const t = Math.floor((Date.now() - e.getTime()) / 1e3);
      return t < 60 ? "now" : t < 3600 ? Math.floor(t / 60) + "m" : t < 86400 ? Math.floor(t / 3600) + "h" : Math.floor(t / 86400) + "d";
    }
    function Xe(n) {
      const e = Ge(n);
      return e ? e.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function we(n) {
      const e = n.renderer || ie.value[n.type]?.renderer;
      return e ? e.startsWith("/c/") ? e.slice(3) : e : "";
    }
    function Ye(n, e) {
      const t = zn(n, e), d = n.meta?.upload_id;
      return d && (t["source-url"] = `/api/v1/uploads/${d}/raw`, t["content-type"] = n.meta?.content_type || "", t.filename = n.name), t;
    }
    const P = C(null), Je = O(() => String(f.value.route || "").replace(/^\/+|\/+$/g, "").split("/")[0] || "");
    function ge(n) {
      B(), m("navigate", n.id);
    }
    function be() {
      m("navigate", r.value || "");
    }
    async function Qe() {
      const n = Je.value;
      if (!n) {
        P.value = null, (r.value !== null || k.value.length === 0) && await I(null);
        return;
      }
      let e = k.value.find((d) => d.id === n) || null;
      if (!e)
        try {
          e = await l.get(n);
        } catch (d) {
          S.value = d instanceof Error ? d.message : "failed to open entry";
          return;
        }
      if (!e) {
        S.value = "entry not found";
        return;
      }
      if (b(e)) {
        P.value = null, r.value !== n && await I(n);
        return;
      }
      const t = e.parent_id ?? null;
      (r.value !== t || k.value.length === 0) && await I(t), P.value = e;
    }
    me(Je, Qe);
    let ue = 0;
    async function I(n) {
      const e = n === r.value && k.value.length > 0;
      r.value = n, e || (w.value = null, D.value = "", K.value = !0), B(), S.value = "";
      const t = ++ue;
      try {
        const d = await l.list(n);
        if (t !== ue) return;
        k.value = d;
        const V = w.value;
        if (V && !d.some((ce) => ce.id === V.id) && (w.value = null), y.value = n ? await l.breadcrumbs(n) : [], g.value = n ? await l.get(n) : null, t !== ue) return;
      } catch (d) {
        if (t !== ue) return;
        S.value = d instanceof Error ? d.message : "failed to load", e || (k.value = []);
      } finally {
        t === ue && (K.value = !1);
      }
    }
    function te(n) {
      if (b(n)) {
        m("navigate", n.id);
        return;
      }
      w.value = w.value?.id === n.id ? null : n;
    }
    const Ze = O(() => ({
      type: z.value?.value || "",
      "parent-id": r.value || "",
      mode: "create"
    })), Lt = O(() => z.value?.create?.view === sl);
    function At(n) {
      N.value = !1, z.value = n;
    }
    function et() {
      z.value = null, I(r.value);
    }
    function Mt() {
      I(r.value);
      for (const n of [900, 2200, 4500]) setTimeout(() => I(r.value), n);
    }
    async function tt(n, e) {
      Le.value = !0, S.value = "";
      try {
        for (const t of n) await l.uploadFile(t, e);
        Mt();
      } catch (t) {
        S.value = t instanceof Error ? t.message : "upload failed";
      } finally {
        Le.value = !1;
      }
    }
    async function nt(n, e) {
      await tt(n, e);
    }
    function Pt(n) {
      tt(Array.from(n), r.value);
    }
    function jt(n) {
      const e = n.target;
      e.files?.length && Pt(e.files), e.value = "";
    }
    function Ot(n) {
      if (n.preventDefault(), le.value = !1, Y.value || !Ae.value) return;
      const e = n.dataTransfer?.files;
      e?.length && nt(Array.from(e), r.value);
    }
    const Y = C(null), W = C(null);
    function ot(n, e) {
      if (!c(e, i.WRITE)) {
        n.preventDefault();
        return;
      }
      Y.value = e.id, n.dataTransfer?.setData("text/plain", e.id);
    }
    function lt() {
      Y.value = null, W.value = null;
    }
    async function Pe(n, e) {
      const t = Y.value;
      if (Y.value = null, W.value = null, !(!t || t === n) && !(e && !c(e, i.WRITE)))
        try {
          await l.move(t, n), I(r.value);
        } catch (d) {
          S.value = d instanceof Error ? d.message : "move failed";
        }
    }
    function st(n, e) {
      if (n.preventDefault(), n.stopPropagation(), le.value = !1, !b(e)) return;
      if (Y.value) {
        Pe(e.id, e);
        return;
      }
      const t = n.dataTransfer?.files;
      t?.length && c(e, i.WRITE) && nt(Array.from(t), e.id);
    }
    function it(n, e) {
      b(e) && (n.preventDefault(), W.value = e.id);
    }
    const A = ct({ entry: null, x: 0, y: 0 });
    function ke(n, e) {
      e.preventDefault(), e.stopPropagation(), A.entry = n, A.x = e.clientX, A.y = e.clientY;
    }
    function B() {
      A.entry = null;
    }
    const de = C("");
    let at;
    function Nt(n) {
      de.value = n, clearTimeout(at), at = setTimeout(() => {
        de.value = "";
      }, 1800);
    }
    const U = C(null), je = C(null), Oe = C([]), Ne = C([]), ze = C(!1);
    async function he(n) {
      ze.value = !0;
      try {
        je.value = n;
        const e = await l.list(n);
        Ne.value = e.filter((t) => b(t) && t.id !== U.value?.id && c(t, i.WRITE)), Oe.value = n ? await l.breadcrumbs(n) : [];
      } catch (e) {
        S.value = e instanceof Error ? e.message : "failed to browse";
      } finally {
        ze.value = !1;
      }
    }
    function zt(n) {
      B(), U.value = n, he(r.value);
    }
    async function It() {
      const n = U.value;
      if (!n) return;
      const e = je.value;
      if (U.value = null, e !== (n.parent_id ?? null))
        try {
          await l.move(n.id, e), Nt(`Moved to ${Oe.value.at(-1)?.name || "root"}`), I(r.value);
        } catch (t) {
          S.value = t instanceof Error ? t.message : "move failed";
        }
    }
    async function Wt(n) {
      B();
      try {
        const e = await l.exportEntry(n.id), t = URL.createObjectURL(e), d = document.createElement("a");
        d.href = t, d.download = `${n.name || "entry"}.kxb`, d.click(), setTimeout(() => URL.revokeObjectURL(t), 1e3);
      } catch (e) {
        S.value = e instanceof Error ? e.message : "export failed";
      }
    }
    function rt(n, e) {
      if (n.key === "ArrowDown" || n.key === "ArrowUp") {
        n.preventDefault();
        const t = n.currentTarget, d = [...t.parentElement?.children || []].filter((Xt) => Xt.matches?.(".ws-row, .ws-tile")), V = d.indexOf(t);
        d[n.key === "ArrowDown" ? V + 1 : V - 1]?.focus();
      } else n.key === "F2" && c(e, i.WRITE) ? (n.preventDefault(), $e(e)) : n.key === "Delete" && c(e, i.DELETE) && (n.preventDefault(), Ce(e));
    }
    const q = C(null), ne = C(null);
    async function Ce(n) {
      if (B(), q.value = n, ne.value = null, b(n))
        try {
          ne.value = await l.countDescendants(n.id);
        } catch (e) {
          S.value = e instanceof Error ? e.message : "failed to inspect folder";
        }
    }
    async function Vt() {
      const n = q.value;
      if (q.value = null, ne.value = null, !!n)
        try {
          const e = await l.remove(n.id);
          e.in_progress && Ft(n.id, e), w.value?.id === n.id && (w.value = null), P.value?.id === n.id && be(), I(r.value);
        } catch (e) {
          S.value = e instanceof Error ? e.message : "failed to delete";
        }
    }
    const { acceptDeletion: Ft } = fo(
      k,
      (n) => n.id,
      (n) => {
        w.value?.id === n && (w.value = null);
      },
      () => I(r.value)
    ), x = ct(
      { open: !1, entry: null, name: "", icon: "", color: "" }
    ), Bt = [{ label: "Default", value: "" }, ...Nn], se = C(""), ut = C(null);
    function $e(n) {
      B(), x.entry = n, x.name = n.name, x.icon = n.meta?.icon || "", x.color = n.meta?.color || "", se.value = "", x.open = !0, Fe(() => {
        const e = ut.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])');
        e?.focus(), e?.select();
      });
    }
    async function Ut() {
      if (x.entry) {
        se.value = "";
        try {
          await l.update(x.entry.id, { name: x.name.trim() || x.entry.name, icon: x.icon, color: x.color }), x.open = !1, I(r.value);
        } catch (n) {
          se.value = n instanceof Error ? n.message : "failed to save";
        }
      }
    }
    function Ht() {
      J.value = J.value === "list" ? "grid" : "list", localStorage.setItem("ws-view", J.value);
    }
    const Z = C(null), Kt = O(() => {
      const n = Z.value;
      return n ? JSON.stringify({
        resource_id: n.id,
        title: n.name,
        access_url: `/api/v1/component-access/grants/${n.id}`,
        share_url: `/api/v1/component-access/share/${n.id}`
      }) : "";
    }), Ee = C(parseInt(localStorage.getItem("ws-panel-w") || "440", 10)), Ie = C(!1);
    let oe = null;
    function qt(n) {
      n.preventDefault(), oe = { pointerId: n.pointerId, x: n.clientX, width: Ee.value }, Ie.value = !0, n.currentTarget.setPointerCapture(n.pointerId);
    }
    function Gt(n) {
      if (!oe || n.pointerId !== oe.pointerId) return;
      const e = oe.width + oe.x - n.clientX;
      Ee.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), e));
    }
    function We() {
      oe && (oe = null, Ie.value = !1, localStorage.setItem("ws-panel-w", String(Ee.value)));
    }
    function dt(n) {
      n.key === "Escape" && (B(), q.value ? (q.value = null, ne.value = null) : N.value ? N.value = !1 : z.value ? z.value = null : Z.value ? Z.value = null : U.value ? U.value = null : x.open ? x.open = !1 : P.value && be());
    }
    return Te(async () => {
      window.addEventListener("keydown", dt), await l.loadTypes(), l.error.value && (S.value = l.error.value), await Qe();
    }), ln(() => window.removeEventListener("keydown", dt)), (n, e) => (a(), v("div", {
      class: "ws",
      onClick: B
    }, [
      s("div", po, [
        s("button", {
          class: G(["ws-home", { "ws-crumb--drop": Y.value && W.value === "" }]),
          title: "Workspace root",
          "aria-label": "Workspace root",
          onClick: e[0] || (e[0] = (t) => u(m)("navigate", "")),
          onDragover: e[1] || (e[1] = M((t) => W.value = "", ["prevent"])),
          onDragleave: e[2] || (e[2] = (t) => W.value = null),
          onDrop: e[3] || (e[3] = (t) => Pe(null))
        }, [
          p(u(T), { icon: "tabler:home" })
        ], 34),
        s("div", mo, [
          (a(!0), v(j, null, ee(y.value, (t) => (a(), v(j, {
            key: t.id
          }, [
            e[53] || (e[53] = s("span", { class: "ws-sep" }, "/", -1)),
            s("button", {
              class: G(["ws-crumb", { "ws-crumb--drop": Y.value && W.value === t.id }]),
              title: t.name,
              onClick: (d) => u(m)("navigate", t.id),
              onDragover: M((d) => W.value = t.id, ["prevent"]),
              onDragleave: e[4] || (e[4] = (d) => W.value = null),
              onDrop: (d) => Pe(t.id)
            }, E(t.name), 43, yo)
          ], 64))), 128))
        ]),
        e[55] || (e[55] = s("span", { class: "ws-spacer" }, null, -1)),
        p(u(gn), {
          modelValue: D.value,
          "onUpdate:modelValue": e[5] || (e[5] = (t) => D.value = t),
          placeholder: "Filter this folder",
          class: "ws-filter"
        }, null, 8, ["modelValue"]),
        p(u(F), {
          icon: J.value === "list" ? "tabler:layout-grid" : "tabler:list",
          label: J.value === "list" ? "Grid view" : "List view",
          size: "sm",
          onClick: Ht
        }, null, 8, ["icon", "label"]),
        p(u(F), {
          icon: "tabler:upload",
          label: "Upload files",
          size: "sm",
          spin: Le.value,
          disabled: !Ae.value,
          onClick: e[6] || (e[6] = (t) => qe.value?.click())
        }, null, 8, ["spin", "disabled"]),
        p(u(H), {
          icon: "tabler:plus",
          small: "",
          onClick: e[7] || (e[7] = (t) => N.value = !0)
        }, {
          default: L(() => [...e[54] || (e[54] = [
            _("New", -1)
          ])]),
          _: 1
        }),
        s("input", {
          ref_key: "fileInput",
          ref: qe,
          type: "file",
          multiple: "",
          hidden: "",
          onChange: jt
        }, null, 544)
      ]),
      S.value ? (a(), R(u(pe), {
        key: 0,
        tone: "error",
        onDismiss: e[9] || (e[9] = (t) => S.value = "")
      }, {
        default: L(() => [
          _(E(S.value) + " ", 1),
          p(u(H), {
            variant: "ghost",
            small: "",
            onClick: e[8] || (e[8] = (t) => I(r.value))
          }, {
            default: L(() => [...e[56] || (e[56] = [
              _("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : h("", !0),
      de.value ? (a(), R(u(pe), {
        key: 1,
        onDismiss: e[10] || (e[10] = (t) => de.value = "")
      }, {
        default: L(() => [
          _(E(de.value), 1)
        ]),
        _: 1
      })) : h("", !0),
      s("div", wo, [
        s("div", {
          class: G(["ws-list-pane", { "ws-list-pane--aside": w.value, "ws-list-pane--drop": le.value }]),
          onDragover: e[15] || (e[15] = M((t) => le.value = !Y.value, ["prevent"])),
          onDragleave: e[16] || (e[16] = (t) => le.value = !1),
          onDrop: Ot
        }, [
          le.value ? (a(), v("div", go, [
            p(u(T), { icon: "tabler:upload" }),
            e[57] || (e[57] = _(" Drop to upload", -1))
          ])) : h("", !0),
          K.value ? (a(), R(u(pt), {
            key: 1,
            label: "Loading…"
          })) : ye.value.length && J.value === "list" ? (a(), v("div", bo, [
            (a(!0), v(j, null, ee(ye.value, (t) => (a(), v("div", {
              key: t.id,
              class: G(["ws-row", {
                "ws-row--sel": w.value?.id === t.id,
                "ws-row--drop": W.value === t.id,
                "ws-row--drag": Y.value === t.id
              }]),
              draggable: c(t, i.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (d) => ot(d, t),
              onDragend: lt,
              onDragover: (d) => it(d, t),
              onDragleave: e[11] || (e[11] = (d) => W.value = null),
              onDrop: (d) => st(d, t),
              onClick: (d) => te(t),
              onDblclick: (d) => b(t) ? u(m)("navigate", t.id) : ge(t),
              onKeydown: [
                fe((d) => te(t), ["enter"]),
                fe(M((d) => te(t), ["prevent"]), ["space"]),
                (d) => rt(d, t)
              ],
              onContextmenu: (d) => ke(t, d)
            }, [
              e[58] || (e[58] = s("span", { class: "ws-edge" }, null, -1)),
              p(u(T), {
                icon: ae(t),
                class: "ws-row-ico",
                style: Q({ color: re(t) })
              }, null, 8, ["icon", "style"]),
              s("span", ho, E(t.name), 1),
              p(Et, {
                state: t,
                onRetry: (d) => Ce(t)
              }, null, 8, ["state", "onRetry"]),
              p(u(ft), { tone: "muted" }, {
                default: L(() => [
                  _(E(Me(t)), 1)
                ]),
                _: 2
              }, 1024),
              s("span", Co, E(Rt(t.updated_at)), 1),
              s("button", {
                class: "ws-row-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: M((d) => ke(t, d), ["stop"])
              }, [
                p(u(T), { icon: "tabler:dots" })
              ], 8, $o)
            ], 42, ko))), 128))
          ])) : ye.value.length ? (a(), v("div", Eo, [
            (a(!0), v(j, null, ee(ye.value, (t) => (a(), v("div", {
              key: t.id,
              class: G(["ws-tile", {
                "ws-tile--sel": w.value?.id === t.id,
                "ws-row--drop": W.value === t.id
              }]),
              draggable: c(t, i.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (d) => ot(d, t),
              onDragend: lt,
              onDragover: (d) => it(d, t),
              onDragleave: e[12] || (e[12] = (d) => W.value = null),
              onDrop: (d) => st(d, t),
              onClick: (d) => te(t),
              onDblclick: (d) => b(t) ? u(m)("navigate", t.id) : ge(t),
              onKeydown: [
                fe((d) => te(t), ["enter"]),
                fe(M((d) => te(t), ["prevent"]), ["space"]),
                (d) => rt(d, t)
              ],
              onContextmenu: (d) => ke(t, d)
            }, [
              s("button", {
                class: "ws-row-menu ws-tile-menu",
                title: "Actions",
                "aria-label": `Actions for ${t.name}`,
                onClick: M((d) => ke(t, d), ["stop"])
              }, [
                p(u(T), { icon: "tabler:dots" })
              ], 8, xo),
              p(u(T), {
                icon: ae(t),
                class: "ws-tile-ico",
                style: Q({ color: re(t) })
              }, null, 8, ["icon", "style"]),
              s("span", {
                class: "ws-tile-name",
                title: t.name
              }, E(t.name), 9, _o),
              p(Et, {
                state: t,
                onRetry: (d) => Ce(t)
              }, null, 8, ["state", "onRetry"])
            ], 42, Do))), 128))
          ])) : k.value.length ? (a(), R(u(Ve), {
            key: 4,
            icon: "tabler:search-off",
            title: "No matches",
            hint: `Nothing here matches “${D.value}”.`,
            cta: "Clear filter",
            "cta-icon": "tabler:x",
            onCta: e[13] || (e[13] = (t) => D.value = "")
          }, null, 8, ["hint"])) : Ae.value ? (a(), R(u(Ve), {
            key: 5,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Create a folder or entry, or upload files.",
            cta: "New entry",
            "cta-icon": "tabler:plus",
            onCta: e[14] || (e[14] = (t) => N.value = !0)
          })) : (a(), R(u(Ve), {
            key: 6,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Nothing has been shared into this folder yet."
          }))
        ], 34),
        w.value ? (a(), v(j, { key: 0 }, [
          s("div", {
            class: G(["ws-divider", { resizing: Ie.value }]),
            onPointerdown: qt,
            onPointermove: Gt,
            onPointerup: We,
            onPointercancel: We,
            onLostpointercapture: We
          }, null, 34),
          s("aside", {
            class: "ws-preview",
            style: Q({ "--ws-preview-width": Ee.value + "px" })
          }, [
            s("div", So, [
              p(u(T), {
                icon: ae(w.value),
                style: Q({ color: re(w.value) })
              }, null, 8, ["icon", "style"]),
              s("span", To, E(w.value.name), 1),
              e[59] || (e[59] = s("span", { class: "ws-spacer" }, null, -1)),
              w.value.type !== "folder" ? (a(), R(u(F), {
                key: 0,
                icon: "tabler:maximize",
                label: "Open",
                size: "sm",
                onClick: e[17] || (e[17] = (t) => ge(w.value))
              })) : h("", !0),
              c(w.value, i.ADMIN) ? (a(), R(u(F), {
                key: 1,
                icon: "tabler:share-3",
                label: "Share",
                size: "sm",
                onClick: e[18] || (e[18] = (t) => Z.value = w.value)
              })) : h("", !0),
              p(u(F), {
                icon: "tabler:adjustments",
                label: "Properties",
                size: "sm",
                onClick: e[19] || (e[19] = (t) => $e(w.value))
              }),
              p(u(F), {
                icon: "tabler:x",
                label: "Close",
                size: "sm",
                onClick: e[20] || (e[20] = (t) => w.value = null)
              })
            ]),
            we(w.value) ? (a(), R(De, {
              key: 0,
              tag: we(w.value),
              attrs: Ye(w.value, "preview"),
              class: "ws-renderer"
            }, null, 8, ["tag", "attrs"])) : (a(), R($t, {
              key: 1,
              entry: w.value,
              mode: "preview",
              class: "ws-renderer"
            }, null, 8, ["entry"]))
          ], 4)
        ], 64)) : h("", !0)
      ]),
      A.entry ? (a(), R(Fn, {
        key: 2,
        x: A.x,
        y: A.y,
        onClose: B
      }, {
        default: L(() => [
          b(A.entry) ? (a(), v("button", {
            key: 0,
            class: "ws-menu-item",
            onClick: e[21] || (e[21] = (t) => {
              u(m)("navigate", A.entry.id), B();
            })
          }, [
            p(u(T), { icon: "tabler:folder-open" }),
            e[60] || (e[60] = _(" Open", -1))
          ])) : (a(), v(j, { key: 1 }, [
            s("button", {
              class: "ws-menu-item",
              onClick: e[22] || (e[22] = (t) => {
                te(A.entry), B();
              })
            }, [
              p(u(T), { icon: "tabler:eye" }),
              e[61] || (e[61] = _(" Preview", -1))
            ]),
            s("button", {
              class: "ws-menu-item",
              onClick: e[23] || (e[23] = (t) => ge(A.entry))
            }, [
              p(u(T), { icon: "tabler:maximize" }),
              e[62] || (e[62] = _(" Open", -1))
            ])
          ], 64)),
          c(A.entry, i.WRITE) ? (a(), v("button", {
            key: 2,
            class: "ws-menu-item",
            onClick: e[24] || (e[24] = (t) => $e(A.entry))
          }, [
            p(u(T), { icon: "tabler:cursor-text" }),
            e[63] || (e[63] = _(" Rename…", -1))
          ])) : h("", !0),
          c(A.entry, i.WRITE) ? (a(), v("button", {
            key: 3,
            class: "ws-menu-item",
            onClick: e[25] || (e[25] = (t) => zt(A.entry))
          }, [
            p(u(T), { icon: "tabler:folder-symlink" }),
            e[64] || (e[64] = _(" Move to…", -1))
          ])) : h("", !0),
          c(A.entry, i.ADMIN) ? (a(), v("button", {
            key: 4,
            class: "ws-menu-item",
            onClick: e[26] || (e[26] = (t) => {
              Z.value = A.entry, B();
            })
          }, [
            p(u(T), { icon: "tabler:user-plus" }),
            e[65] || (e[65] = _(" Share…", -1))
          ])) : h("", !0),
          s("button", {
            class: "ws-menu-item",
            onClick: e[27] || (e[27] = (t) => Wt(A.entry))
          }, [
            p(u(T), { icon: "tabler:package-export" }),
            e[66] || (e[66] = _(" Export", -1))
          ]),
          c(A.entry, i.DELETE) ? (a(), v("div", Ro)) : h("", !0),
          c(A.entry, i.DELETE) ? (a(), v("button", {
            key: 6,
            class: "ws-menu-item ws-menu-danger",
            onClick: e[28] || (e[28] = (t) => Ce(A.entry))
          }, [
            p(u(T), { icon: "tabler:trash" }),
            e[67] || (e[67] = _(" Delete", -1))
          ])) : h("", !0)
        ]),
        _: 1
      }, 8, ["x", "y"])) : h("", !0),
      N.value ? (a(), v("div", {
        key: 3,
        class: "ws-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "ws-new-heading",
        onClick: e[30] || (e[30] = M((t) => N.value = !1, ["self"]))
      }, [
        s("div", Lo, [
          s("div", Ao, [
            e[68] || (e[68] = _("New entry", -1)),
            e[69] || (e[69] = s("span", { class: "ws-spacer" }, null, -1)),
            p(u(F), {
              icon: "tabler:x",
              label: "Close new entry",
              size: "sm",
              onClick: e[29] || (e[29] = (t) => N.value = !1)
            })
          ]),
          s("div", Mo, [
            (a(!0), v(j, null, ee(Tt.value, (t) => (a(), v("button", {
              key: t.value,
              type: "button",
              class: "ws-type-btn",
              title: t.description || t.label,
              onClick: (d) => At(t)
            }, [
              p(u(T), {
                icon: t.icon,
                style: Q({ color: t.color })
              }, null, 8, ["icon", "style"]),
              s("span", null, E(t.label), 1)
            ], 8, Po))), 128))
          ])
        ])
      ])) : h("", !0),
      z.value?.create?.view && Lt.value ? (a(), v("div", {
        key: 4,
        class: "ws-modal",
        onCreated: et,
        onClose: e[31] || (e[31] = (t) => z.value = null),
        onClick: e[32] || (e[32] = M((t) => z.value = null, ["self"]))
      }, [
        p(De, {
          tag: z.value.create.view,
          attrs: Ze.value
        }, null, 8, ["tag", "attrs"])
      ], 32)) : z.value?.create?.view ? (a(), v("div", {
        key: 5,
        class: "ws-modal",
        onCreated: et,
        onClose: e[33] || (e[33] = (t) => z.value = null),
        onClick: e[34] || (e[34] = M((t) => z.value = null, ["self"]))
      }, [
        s("div", jo, [
          p(De, {
            tag: z.value.create.view,
            attrs: Ze.value,
            fill: !1,
            class: "ws-create-mount"
          }, null, 8, ["tag", "attrs"])
        ])
      ], 32)) : h("", !0),
      q.value ? (a(), v("div", {
        key: 6,
        class: "ws-modal",
        onClick: e[36] || (e[36] = M((t) => {
          q.value = null, ne.value = null;
        }, ["self"]))
      }, [
        s("div", Oo, [
          s("div", No, "Delete " + E(b(q.value) ? "folder" : "entry"), 1),
          b(q.value) ? (a(), v("div", zo, " Deletes this folder and " + E(ne.value ?? "…") + " entries. Uploaded files stay in Files. ", 1)) : q.value.type === "file" ? (a(), v("div", Io, "Removes it from the workspace. The file stays in Files.")) : (a(), v("div", Wo, "Deletes this entry from the workspace.")),
          s("div", Vo, [
            p(u(H), {
              variant: "ghost",
              onClick: e[35] || (e[35] = (t) => {
                q.value = null, ne.value = null;
              })
            }, {
              default: L(() => [...e[70] || (e[70] = [
                _("Cancel", -1)
              ])]),
              _: 1
            }),
            p(u(H), {
              icon: "tabler:trash",
              onClick: Vt
            }, {
              default: L(() => [...e[71] || (e[71] = [
                _("Delete", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])) : h("", !0),
      x.open && x.entry ? (a(), v("div", {
        key: 7,
        class: "ws-modal",
        onClick: e[42] || (e[42] = M((t) => x.open = !1, ["self"]))
      }, [
        s("div", {
          ref_key: "propsDialogEl",
          ref: ut,
          class: "ws-dialog"
        }, [
          s("div", Fo, [
            e[72] || (e[72] = _("Properties", -1)),
            e[73] || (e[73] = s("span", { class: "ws-spacer" }, null, -1)),
            p(u(F), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[37] || (e[37] = (t) => x.open = !1)
            })
          ]),
          se.value ? (a(), R(u(pe), {
            key: 0,
            tone: "error",
            onDismiss: e[38] || (e[38] = (t) => se.value = "")
          }, {
            default: L(() => [
              _(E(se.value), 1)
            ]),
            _: 1
          })) : h("", !0),
          p(u(vt), { label: "Name" }, {
            default: L(() => [
              s("div", Bo, [
                p(u(un), {
                  modelValue: x.icon,
                  "onUpdate:modelValue": e[39] || (e[39] = (t) => x.icon = t),
                  fallback: ie.value[x.entry.type]?.icon
                }, null, 8, ["modelValue", "fallback"]),
                p(u(dn), {
                  modelValue: x.name,
                  "onUpdate:modelValue": e[40] || (e[40] = (t) => x.name = t)
                }, null, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          p(u(vt), { label: "Color" }, {
            default: L(() => [
              s("div", Uo, [
                (a(), v(j, null, ee(Bt, (t) => s("button", {
                  key: t.value,
                  type: "button",
                  class: G(["ws-swatch", { on: x.color === t.value }]),
                  title: t.label,
                  "aria-label": `Use color ${t.label}`,
                  style: Q({ background: t.value || "transparent" }),
                  onClick: (d) => x.color = t.value
                }, [
                  t.value ? h("", !0) : (a(), R(u(T), {
                    key: 0,
                    icon: "tabler:ban"
                  }))
                ], 14, Ho)), 64))
              ])
            ]),
            _: 1
          }),
          s("div", Ko, [
            s("div", null, [
              e[74] || (e[74] = s("span", null, "Type", -1)),
              s("span", null, E(Me(x.entry)), 1)
            ]),
            s("div", null, [
              e[75] || (e[75] = s("span", null, "Status", -1)),
              s("code", null, E(x.entry.status), 1)
            ]),
            s("div", null, [
              e[76] || (e[76] = s("span", null, "Access", -1)),
              s("code", null, E($(x.entry.access_level)), 1)
            ]),
            s("div", null, [
              e[77] || (e[77] = s("span", null, "Created", -1)),
              s("code", null, E(Xe(x.entry.created_at)), 1)
            ]),
            s("div", null, [
              e[78] || (e[78] = s("span", null, "Updated", -1)),
              s("code", null, E(Xe(x.entry.updated_at)), 1)
            ])
          ]),
          s("div", qo, [
            p(u(H), {
              variant: "ghost",
              onClick: e[41] || (e[41] = (t) => x.open = !1)
            }, {
              default: L(() => [...e[79] || (e[79] = [
                _("Close", -1)
              ])]),
              _: 1
            }),
            c(x.entry, i.WRITE) ? (a(), R(u(H), {
              key: 0,
              icon: "tabler:device-floppy",
              onClick: Ut
            }, {
              default: L(() => [...e[80] || (e[80] = [
                _("Save", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ])
        ], 512)
      ])) : h("", !0),
      U.value ? (a(), v("div", {
        key: 8,
        class: "ws-modal",
        onClick: e[46] || (e[46] = M((t) => U.value = null, ["self"]))
      }, [
        s("div", Go, [
          s("div", Xo, [
            _("Move “" + E(U.value.name) + "”", 1),
            e[81] || (e[81] = s("span", { class: "ws-spacer" }, null, -1)),
            p(u(F), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: e[43] || (e[43] = (t) => U.value = null)
            })
          ]),
          s("div", Yo, [
            s("button", {
              class: "ws-crumb",
              onClick: e[44] || (e[44] = (t) => he(null))
            }, [
              p(u(T), { icon: "tabler:home" })
            ]),
            (a(!0), v(j, null, ee(Oe.value, (t) => (a(), v(j, {
              key: t.id
            }, [
              e[82] || (e[82] = s("span", { class: "ws-sep" }, "/", -1)),
              s("button", {
                class: "ws-crumb",
                onClick: (d) => he(t.id)
              }, E(t.name), 9, Jo)
            ], 64))), 128))
          ]),
          s("div", Qo, [
            ze.value ? (a(), R(u(pt), {
              key: 0,
              label: "Loading…"
            })) : (a(), v(j, { key: 1 }, [
              (a(!0), v(j, null, ee(Ne.value, (t) => (a(), v("button", {
                key: t.id,
                class: "ws-move-folder",
                onClick: (d) => he(t.id)
              }, [
                p(u(T), {
                  icon: ae(t),
                  style: Q({ color: re(t) })
                }, null, 8, ["icon", "style"]),
                s("span", null, E(t.name), 1),
                p(u(T), {
                  icon: "tabler:chevron-right",
                  class: "ws-move-into"
                })
              ], 8, Zo))), 128)),
              Ne.value.length ? h("", !0) : (a(), v("p", el, "No folders here."))
            ], 64))
          ]),
          s("div", tl, [
            p(u(H), {
              variant: "ghost",
              onClick: e[45] || (e[45] = (t) => U.value = null)
            }, {
              default: L(() => [...e[83] || (e[83] = [
                _("Cancel", -1)
              ])]),
              _: 1
            }),
            p(u(H), {
              icon: "tabler:folder-symlink",
              disabled: je.value === (U.value.parent_id ?? null),
              onClick: It
            }, {
              default: L(() => [...e[84] || (e[84] = [
                _("Move here", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ])) : h("", !0),
      P.value ? (a(), v("div", nl, [
        s("div", ol, [
          p(u(F), {
            icon: "tabler:arrow-left",
            label: "Back",
            size: "sm",
            onClick: e[47] || (e[47] = (t) => be())
          }),
          p(u(T), {
            icon: ae(P.value),
            style: Q({ color: re(P.value) })
          }, null, 8, ["icon", "style"]),
          s("span", ll, E(P.value.name), 1),
          p(u(ft), { tone: "muted" }, {
            default: L(() => [
              _(E(Me(P.value)), 1)
            ]),
            _: 1
          }),
          e[85] || (e[85] = s("span", { class: "ws-spacer" }, null, -1)),
          c(P.value, i.ADMIN) ? (a(), R(u(F), {
            key: 0,
            icon: "tabler:share-3",
            label: "Share",
            size: "sm",
            onClick: e[48] || (e[48] = (t) => Z.value = P.value)
          })) : h("", !0),
          p(u(F), {
            icon: "tabler:adjustments",
            label: "Properties",
            size: "sm",
            onClick: e[49] || (e[49] = (t) => $e(P.value))
          }),
          p(u(F), {
            icon: "tabler:x",
            label: "Close",
            size: "sm",
            onClick: e[50] || (e[50] = (t) => be())
          })
        ]),
        we(P.value) ? (a(), R(De, {
          key: 0,
          tag: we(P.value),
          attrs: Ye(P.value, "full"),
          class: "ws-manage-body"
        }, null, 8, ["tag", "attrs"])) : (a(), R($t, {
          key: 1,
          entry: P.value,
          mode: "full",
          class: "ws-manage-body"
        }, null, 8, ["entry"]))
      ])) : h("", !0),
      Z.value ? (a(), R(Kn, {
        key: 10,
        config: Kt.value,
        onClose: e[51] || (e[51] = (t) => Z.value = null),
        onChanged: e[52] || (e[52] = (t) => I(r.value))
      }, null, 8, ["config"])) : h("", !0)
    ]));
  }
}), gl = {
  rootComponent: il,
  plugins: [On]
};
export {
  gl as mountConfig
};
//# sourceMappingURL=lazy-mount-7Ngh6sAC.js.map
