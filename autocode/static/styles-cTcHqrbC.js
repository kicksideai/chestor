import j from "primevue/config";
import V from "primevue/menu";
import q from "primevue/portal";
import { renderSlot as d, createCommentVNode as v, h as F, Teleport as H, ref as h, provide as B, defineComponent as O, openBlock as l, createElementBlock as C, createElementVNode as c, createVNode as g, unref as p, toDisplayString as m, createBlock as R, withCtx as b, watch as I, onUnmounted as E, normalizeClass as Y, createSlots as U } from "vue";
import { u as W } from "./index-DaHAsq8-.js";
import { b as X, a as G, e as J, l as K } from "./api-xHIs_Oef.js";
import { Icon as f } from "@iconify/vue";
import Q from "primevue/button";
import Z from "primevue/dialog";
const rr = "data-wippy-overlay-layer";
function _() {
  return typeof window < "u" && typeof window.document < "u";
}
function N() {
  return _() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ar() {
  return N() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("top", "anchor(--a bottom)");
}
const or = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let er = 0;
const u = /* @__PURE__ */ new WeakMap();
function T(r, a) {
  const o = r.style;
  o.setProperty("position", "fixed", "important"), o.setProperty("inset", "auto", "important"), o.setProperty("margin", "0", "important"), o.setProperty("position-anchor", a), o.setProperty("top", `anchor(${a} bottom)`, "important"), o.setProperty("left", `anchor(${a} left)`, "important"), o.setProperty("position-try-fallbacks", "flip-block");
}
function tr(r, a) {
  if (!or.test(r.className))
    return;
  const o = r.style.cssText;
  T(r, a), r.getAttribute("popover") !== "manual" && r.setAttribute("popover", "manual");
  try {
    r.matches(":popover-open") || r.showPopover();
  } catch {
  }
  if (!r.matches(":popover-open")) {
    r.removeAttribute("popover"), r.style.cssText = o;
    return;
  }
  if (!u.has(r)) {
    const e = new MutationObserver(() => {
      r.style.getPropertyPriority("top") !== "important" && T(r, a);
    });
    e.observe(r, { attributes: !0, attributeFilter: ["style"] }), u.set(r, e);
  }
}
function k(r) {
  const a = u.get(r);
  a && (a.disconnect(), u.delete(r));
}
function ir(r) {
  const a = r && typeof r.getRootNode == "function" ? r.getRootNode() : null;
  return a instanceof ShadowRoot ? a : null;
}
function y(r) {
  r.style.top = "0px", r.style.left = "0px";
  const a = r.getBoundingClientRect();
  r.style.top = `${-window.scrollY - a.top}px`, r.style.left = `${-window.scrollX - a.left}px`;
}
const x = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new WeakMap();
let $ = !1, w = !1;
function cr() {
  w = !1;
  for (const r of x) {
    if (!r.isConnected) {
      for (const a of Array.from(r.children))
        a instanceof HTMLElement && k(a);
      x.delete(r), z.get(r)?.disconnect();
      continue;
    }
    r.childElementCount > 0 && y(r);
  }
}
function L() {
  w || (w = !0, requestAnimationFrame(cr));
}
function nr(r) {
  const a = document.createElement("div");
  a.setAttribute(rr, "");
  const o = N();
  if (a.style.cssText = o ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", o && a.setAttribute("popover", "manual"), r.appendChild(a), o) {
    try {
      a.showPopover();
    } catch {
    }
    a.matches(":popover-open") || (a.removeAttribute("popover"), a.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  y(a);
  const e = new MutationObserver((i) => {
    const t = a.__wippyAnchorName;
    for (const s of i) {
      if (t)
        for (const n of Array.from(s.addedNodes))
          n instanceof HTMLElement && tr(n, t);
      for (const n of Array.from(s.removedNodes))
        n instanceof HTMLElement && k(n);
    }
    a.isConnected && a.childElementCount > 0 && y(a);
  });
  return e.observe(a, { childList: !0 }), z.set(a, e), x.add(a), $ || ($ = !0, window.addEventListener("scroll", L, { capture: !0, passive: !0 }), window.addEventListener("resize", L, { passive: !0 })), a;
}
function M(r) {
  if (!(!r.hostRoot || r.layer) && (r.layer = nr(r.hostRoot), ar())) {
    const a = r.$el ? r.$el.parentElement : null;
    a && (r.anchorName = `--wippy-a-${++er}`, r.anchorTrigger = a, a.style.setProperty("anchor-name", r.anchorName), r.layer.__wippyAnchorName = r.anchorName);
  }
}
function S(r) {
  if (r.anchorTrigger && (r.anchorTrigger.style.removeProperty("anchor-name"), r.anchorTrigger = null), r.anchorName = null, r.layer) {
    for (const a of Array.from(r.layer.children))
      a instanceof HTMLElement && k(a);
    x.delete(r.layer), z.get(r.layer)?.disconnect(), r.layer.remove(), r.layer = null;
  }
}
let A = !1;
function pr() {
  if (A)
    return;
  const r = V;
  !r.methods || typeof r.methods.bindOutsideClickListener != "function" || (r.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (a) => {
      const o = a.composedPath(), e = this.container && !o.includes(this.container), i = !(this.target && o.includes(this.target));
      this.overlayVisible && e && i ? this.hide() : !this.popup && e && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, A = !0);
}
let P = !1;
function sr() {
  if (P)
    return;
  P = !0;
  const r = q;
  r.computed = r.computed || {}, r.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, r.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, r.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, r.mounted = function() {
    _() && (this.hostRoot = ir(this.$el), this.mounted = !0, this.hostRoot && (this.inline || M(this), this.$watch("inline", (a) => {
      a ? S(this) : M(this);
    })));
  }, r.render = function() {
    return this.inline ? d(this.$slots, "default", { key: 0 }) : this.mounted ? F(H, { key: 1, to: this.resolvedTarget || document.body }, [
      d(this.$slots, "default")
    ]) : v("", !0);
  }, r.unmounted = function() {
    S(this);
  };
}
const Mr = {
  install: (r) => {
    pr(), sr(), r.use(j, { theme: "none" });
  }
};
function Sr() {
  const r = h(null), a = h(""), o = X(async () => {
    try {
      r.value = await G.catalog(), a.value = "";
    } catch (e) {
      a.value = J(e, "Could not load the agent catalog.");
    }
  });
  return B("catalog", r), W(o), { catalog: r, error: a, load: o };
}
const lr = { class: "kx-head" }, dr = { class: "kx-head-icon" }, ur = { class: "kx-head-text" }, xr = { class: "kx-title" }, gr = { class: "kx-head-sub" }, mr = { class: "kx-head-actions" }, fr = {
  key: 0,
  class: "kx-count"
}, vr = { class: "kx-search" }, hr = ["value", "placeholder", "aria-label"], Ar = /* @__PURE__ */ O({
  __name: "page-head",
  props: {
    title: {},
    subtitle: {},
    count: {},
    action: {},
    query: {},
    placeholder: {}
  },
  emits: ["update:query", "create"],
  setup(r) {
    return (a, o) => (l(), C("header", lr, [
      c("div", dr, [
        g(p(f), {
          icon: "tabler:robot",
          "aria-hidden": "true"
        })
      ]),
      c("div", ur, [
        c("h1", xr, m(r.title), 1),
        c("p", gr, m(r.subtitle), 1)
      ]),
      c("div", mr, [
        r.count ? (l(), C("span", fr, m(r.count), 1)) : v("", !0),
        c("div", vr, [
          g(p(f), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          c("input", {
            value: r.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: r.placeholder,
            "aria-label": r.placeholder,
            onInput: o[0] || (o[0] = (e) => a.$emit("update:query", e.target.value))
          }, null, 40, hr)
        ]),
        r.action ? (l(), R(p(Q), {
          key: 1,
          label: r.action,
          onClick: o[1] || (o[1] = (e) => a.$emit("create"))
        }, {
          icon: b(() => [
            g(p(f), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : v("", !0)
      ])
    ]));
  }
});
function Pr(r, a) {
  const o = /* @__PURE__ */ new Map();
  I(r, (e) => {
    const i = new Set(e);
    for (const [t, s] of o)
      i.has(t) || (s(), o.delete(t));
    for (const t of i)
      o.has(t) || o.set(t, K.component(t, a));
  }, { immediate: !0 }), E(() => {
    for (const e of o.values()) e();
    o.clear();
  });
}
const Or = /* @__PURE__ */ O({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean }
  },
  emits: ["close"],
  setup(r) {
    return (a, o) => (l(), R(p(Z), {
      visible: !0,
      modal: "",
      "block-scroll": "",
      "dismissable-mask": "",
      draggable: !1,
      header: r.title,
      class: Y(["ac-dialog", { "ac-dialog-wide": r.wide }]),
      "onUpdate:visible": o[0] || (o[0] = (e) => !e && a.$emit("close"))
    }, U({
      default: b(() => [
        d(a.$slots, "default")
      ]),
      _: 2
    }, [
      a.$slots.footer ? {
        name: "footer",
        fn: b(() => [
          d(a.$slots, "footer")
        ]),
        key: "0"
      } : void 0
    ]), 1032, ["header", "class"]));
  }
});
function Rr() {
  const r = h(Date.now()), a = window.setInterval(() => {
    r.value = Date.now();
  }, 1e3);
  return E(() => window.clearInterval(a)), r;
}
function Er(r) {
  return { claude: "simple-icons:claude", codex: "simple-icons:openai", agy: "simple-icons:googlegemini", muse: "tabler:sparkles" }[r] ?? "tabler:terminal-2";
}
function _r(r, a = Date.now()) {
  const o = Math.max(0, Math.floor((a - Date.parse(r)) / 1e3));
  return Number.isFinite(o) ? o < 60 ? "just now" : o < 3600 ? `${Math.floor(o / 60)}m ago` : o < 86400 ? `${Math.floor(o / 3600)}h ago` : `${Math.floor(o / 86400)}d ago` : "";
}
function D(r) {
  if (!Number.isFinite(r) || r < 0) return "—";
  const a = Math.round(r / 1e3);
  if (a < 60) return `${a}s`;
  const o = Math.floor(a / 60);
  return o < 60 ? `${o}m ${String(a % 60).padStart(2, "0")}s` : `${Math.floor(o / 60)}h ${String(o % 60).padStart(2, "0")}m`;
}
function Nr(r, a = Date.now()) {
  if (!r.started_at) return "—";
  const e = r.status === "running" || r.status === "queued" ? a - Date.parse(r.started_at) : typeof r.usage?.duration_ms == "number" ? r.usage.duration_ms : Date.parse(r.finished_at) - Date.parse(r.started_at);
  return D(e);
}
function Dr(r) {
  return `${D(r).replace(/ 00[ms]$/, "")} timeout`;
}
const jr = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}.ac-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.ac-muted{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-error{color:var(--p-danger-color);margin:0;overflow-wrap:anywhere}.ac-options{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);padding:8px 12px}.ac-options summary{cursor:pointer;font-size:13px}.ac-options-filter{width:100%;margin:8px 0}.ac-option{display:grid;gap:4px;padding:6px 0;border-top:1px solid var(--p-content-border-color)}.ac-option-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]{accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.ac{font-family:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);height:100%;display:flex;flex-direction:column;overflow:hidden}.ac-bar{flex:none;display:flex;padding:0 24px 20px}.ac-body{padding:0 24px 24px;min-height:0;flex:1;overflow:auto;scrollbar-gutter:stable}.ac-card{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}.ac-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.ac-card-title{font-size:14px;font-weight:700;margin:0;display:flex;align-items:center;gap:8px}.ac-field{display:flex;flex-direction:column;gap:4px;min-width:0}.ac-field>span{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.ac-row-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}.ac-hint{color:var(--p-text-muted-color);font-size:12px;line-height:1.4}.ac-hint code,.ac-muted code{font-size:11px}.ac-check{display:flex;align-items:center;gap:8px;font-size:13px}.ac-check input{width:auto;flex:none}.ac-checks{display:flex;flex-wrap:wrap;gap:4px 16px}.ac-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:7px 14px;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color);background:transparent;color:var(--p-text-color);white-space:nowrap}.ac-btn:hover{border-color:var(--p-primary-color)}.ac-btn.primary{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color);font-weight:600}.ac-btn.danger{color:var(--p-danger-color);border-color:color-mix(in srgb,var(--p-danger-color) 50%,transparent)}.ac-btn:disabled{opacity:.5;cursor:default}.ac-link{font:inherit;cursor:pointer;color:var(--p-primary-color);background:transparent;border:none;padding:0}.ac-link:hover{text-decoration:underline}.ac-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.ac-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color)}.ac-row-title{font-weight:600;display:flex;align-items:center;gap:6px;min-width:0}.ac-row-actions{display:flex;gap:2px;flex:none}.ac-tone{background:var(--kx-overlay-hover);color:var(--p-text-muted-color)}.ac-tone.ready,.ac-tone.succeeded{background:var(--kx-wash-success);color:var(--p-success-color)}.ac-tone.running,.ac-tone.preparing,.ac-tone.queued{background:var(--kx-wash-primary);color:var(--p-primary-color)}.ac-tone.cooling{background:var(--kx-wash-warn);color:var(--p-warn-color)}.ac-tone.failed{background:var(--kx-wash-danger);color:var(--p-danger-color)}.ac-pre{margin:0;padding:10px 12px;border-radius:var(--kx-radius-8);white-space:pre-wrap;overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;max-height:360px;overflow:auto;background:var(--kx-overlay-subtle)}.ac-prompt{max-height:none;overflow:hidden;font-family:inherit;line-height:1.6}.ac-prompt>span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}.ac-prompt.expanded>span{display:block;-webkit-line-clamp:unset}.ac-stream{display:flex;flex-direction:column;gap:10px;max-height:360px;overflow-y:auto;overflow-x:hidden;padding:12px;overscroll-behavior:contain;overflow-anchor:none;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color)}.ac-detail .ac-stream .ac-event{display:grid;flex:none;min-width:0;grid-template-columns:84px minmax(0,1fr);gap:8px;align-items:start}.ac-event-kind{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:var(--p-text-muted-color);line-height:1.6;align-self:start;padding-top:0;overflow-wrap:anywhere}.ac-event-text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.45;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;min-width:0}.ac-event.assistant .ac-event-kind,.ac-event.result .ac-event-kind,.ac-event.tool .ac-event-text{color:var(--p-primary-color)}.ac-event.tool_result .ac-event-text,.ac-event.log .ac-event-text,.ac-event.reasoning .ac-event-text{color:var(--p-text-muted-color)}.ac-event.tool_error .ac-event-kind,.ac-event.error .ac-event-kind,.ac-event.error .ac-event-text{color:var(--p-danger-color)}.ac-result{display:flex;flex-direction:column;gap:6px}.ac-pulse{animation:ac-pulse 1.4s ease-in-out infinite;padding:4px 0 0 92px}@keyframes ac-pulse{50%{opacity:.4}}.ac-stack{display:flex;flex-direction:column;gap:16px;min-width:0}.ac-small{font-size:12px}.ac-account.off .ac-account-main{opacity:.6}.ac-account-main{display:flex;flex-direction:column;gap:7px;min-width:0}.ac-row-name{min-width:0;overflow-wrap:anywhere}.ac-rename{padding:3px 7px;font-weight:600}.ac-strong{display:inline-flex;align-items:center;gap:4px;color:var(--p-text-color)}.ac-narrow{max-width:760px}.ac-switch{position:relative;display:inline-flex;align-items:center;width:34px;height:20px;margin:4px 6px 0 0;cursor:pointer;flex:none}.ac-switch input{position:absolute;opacity:0;width:0;height:0}.ac-switch span{position:absolute;inset:0;border-radius:999px;transition:background .15s;background:var(--kx-surface-4)}.ac-switch span:after{content:"";position:absolute;top:2px;left:2px;width:16px;height:16px;border-radius:50%;background:var(--p-content-background);transition:transform .15s}.ac-switch input:checked+span{background:var(--p-primary-color)}.ac-switch input:checked+span:after{transform:translate(14px)}.ac-switch input:focus-visible+span{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset)}.kx-head{flex:none}.kx-head-sub{max-width:440px}.kx-count{color:var(--p-text-muted-color);font-size:12px;white-space:nowrap}.kx-search{position:relative;display:flex;align-items:center}.kx-search>svg{position:absolute;left:10px;color:var(--p-text-muted-color)}.kx-search .kx-search-input{padding-left:30px;width:205px}.ac-form{display:flex;flex-direction:column;gap:16px}.ac-dialog{width:min(620px,calc(100vw - 40px));max-height:calc(100dvh - 48px);display:flex;flex-direction:column;overflow:hidden;font-family:var(--kx-font-body);font-size:13px;color:var(--p-text-color)}.ac-dialog-wide{width:min(880px,calc(100vw - 40px))}.ac-dialog .p-dialog-header,.ac-dialog .p-dialog-footer{flex:none}.ac-dialog .p-dialog-content{min-height:0;overflow:auto;overscroll-behavior:contain}.ac-dialog .p-dialog-title{font-size:17px}.ac-dialog-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:16px;border-top:1px solid var(--p-content-border-color)}.ac-picker-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.ac-composer textarea{min-height:200px}.ac-run-list{list-style:none;padding:0;margin:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.ac-run:first-child{border-radius:var(--kx-radius-14) var(--kx-radius-14) 0 0}.ac-run:last-child{border-radius:0 0 var(--kx-radius-14) var(--kx-radius-14)}.ac-run:only-child{border-radius:var(--kx-radius-14)}.ac-run+.ac-run{border-top:1px solid var(--p-content-border-color)}.ac-run-main{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:inherit;padding:8px 16px;min-height:56px;font:inherit;color:inherit;background:transparent;text-align:left;cursor:pointer}.ac-run-main:hover{background:var(--kx-overlay-subtle)}.ac-run-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}.ac-run-title-row{display:flex;align-items:baseline;gap:8px;min-width:0;line-height:18px}.ac-run-title-row .kx-tag-sm{flex:none}.ac-run-title{font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ac-run-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;color:var(--p-text-muted-color);font-size:12px;line-height:18px}.ac-run-meta>span{display:inline-flex;align-items:center;gap:5px}.ac-run-meta>span+span:before{content:"·";margin-right:3px}.ac-run-main .ac-run-meta{flex-wrap:nowrap;overflow:hidden;white-space:nowrap}.ac-run-main .ac-run-meta>span{flex:none}.ac-run-chevron{flex:none;align-self:center}.ac-account-grid{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(440px,100%),1fr));gap:12px}.ac-account{border-radius:var(--kx-radius-14);padding:16px;flex-wrap:wrap;gap:12px}.ac-account-main{flex:1}.ac-hover-actions .ac-row-actions{opacity:0;transition:opacity .15s}.ac-hover-actions:hover .ac-row-actions,.ac-hover-actions:focus-within .ac-row-actions{opacity:1}@media(hover:none){.ac-hover-actions .ac-row-actions{opacity:1}}.ac-resource-list{gap:12px}.ac-resource{align-items:center;gap:16px;padding:18px;border-radius:var(--kx-radius-14)}.ac-resource-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;flex:none;border-radius:var(--kx-radius-10);background:var(--kx-overlay-subtle);color:var(--p-text-muted-color);font-size:20px}p.ac-hint{margin:0}.ac-detail{min-width:0;gap:20px}.ac-detail-head{display:flex;flex-direction:column;gap:8px}.ac-detail-title{margin:0;font-size:17px;line-height:1.4;font-weight:600;overflow-wrap:anywhere}.ac-detail-meta{row-gap:4px}.ac-detail-section{min-width:0;display:flex;flex-direction:column;gap:8px}.ac-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:24px}.ac-section-head h3{margin:0;font-size:13px;font-weight:600}.ac-section-head .ac-row-actions{align-items:center;gap:12px}.ac-detail .ac-stream{max-height:min(360px,45dvh);background:var(--kx-overlay-subtle)}.ac-result-text{max-height:220px;line-height:1.6;overscroll-behavior:contain}.ac-result-text.expanded{max-height:min(640px,65dvh)}.ac-build-log{max-height:65vh;min-height:160px}@media(max-width:700px){.ac-picker-row{grid-template-columns:1fr}.ac-run-main{padding:8px 12px}.ac-detail .ac-stream .ac-event{grid-template-columns:64px minmax(0,1fr)}.ac-resource{flex-wrap:wrap}.ac-hover-actions .ac-row-actions{opacity:1}}';
export {
  Mr as P,
  Or as _,
  Er as a,
  Sr as b,
  Ar as c,
  Rr as d,
  Nr as e,
  _r as r,
  jr as s,
  Dr as t,
  Pr as u
};
//# sourceMappingURL=styles-cTcHqrbC.js.map
