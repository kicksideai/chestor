import { ref as k, provide as fn, inject as vn, computed as j, openBlock as a, createElementBlock as i, mergeProps as m, createElementVNode as p, renderSlot as A, createTextVNode as z, toDisplayString as c, resolveComponent as ft, resolveDirective as _t, withDirectives as ht, createBlock as P, resolveDynamicComponent as it, withCtx as L, createCommentVNode as d, normalizeClass as R, defineComponent as q, watch as vt, Fragment as F, createVNode as x, unref as u, onMounted as Rt, nextTick as Dt, onBeforeUnmount as yn, renderList as nt, withKeys as gt, withModifiers as pt, vModelText as Ft, Transition as kn, h as wn, onUnmounted as $n, createSlots as xn } from "vue";
import { b as Mt, s as Ut, B as et, c as Kt, d as yt, e as ot, f as U, R as Ht, g as Cn } from "./wc-runtime-CvWl7e3g.js";
import { c as Wt, s as Gt, a as M, e as rt, f as Ct, b as qt, d as Xt, _ as Sn, g as Et, h as Pn, u as An, l as zn, r as In, p as Bn } from "./Disclosure.vue_vue_type_script_setup_true_lang-CrWwplXA.js";
import { Icon as T } from "@iconify/vue";
import { loadByTagName as Yt, host as Tn } from "@wippy-fe/proxy";
import { a as On } from "./driver-account-types-CH0REEbr.js";
function xa() {
  const t = Wt(), n = k(null), e = k(""), o = Gt(async () => {
    try {
      const b = await M.catalog();
      if (!t()) return;
      n.value = b, e.value = "";
    } catch (b) {
      if (!t()) return;
      e.value = rt(b, "Could not load the agent catalog.");
    }
  }, t);
  return fn("catalog", n), Mt(o), { catalog: n, error: e, load: o };
}
function Fn() {
  const t = vn("catalog");
  if (!t) throw new Error("Autocode catalog provider is missing.");
  return j(() => {
    if (!t.value) throw new Error("Autocode catalog is not loaded.");
    return t.value;
  });
}
var Zt = {
  name: "SpinnerIcon",
  extends: Ut
};
function En(t) {
  return Vn(t) || Nn(t) || Ln(t) || jn();
}
function jn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ln(t, n) {
  if (t) {
    if (typeof t == "string") return kt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? kt(t, n) : void 0;
  }
}
function Nn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Vn(t) {
  if (Array.isArray(t)) return kt(t);
}
function kt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function _n(t, n, e, o, b, r) {
  return a(), i("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), En(n[0] || (n[0] = [p("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Zt.render = _n;
var Rn = `
    .p-badge {
        display: inline-flex;
        border-radius: dt('badge.border.radius');
        align-items: center;
        justify-content: center;
        padding: dt('badge.padding');
        background: dt('badge.primary.background');
        color: dt('badge.primary.color');
        font-size: dt('badge.font.size');
        font-weight: dt('badge.font.weight');
        min-width: dt('badge.min.width');
        height: dt('badge.height');
    }

    .p-badge-dot {
        width: dt('badge.dot.size');
        min-width: dt('badge.dot.size');
        height: dt('badge.dot.size');
        border-radius: 50%;
        padding: 0;
    }

    .p-badge-circle {
        padding: 0;
        border-radius: 50%;
    }

    .p-badge-secondary {
        background: dt('badge.secondary.background');
        color: dt('badge.secondary.color');
    }

    .p-badge-success {
        background: dt('badge.success.background');
        color: dt('badge.success.color');
    }

    .p-badge-info {
        background: dt('badge.info.background');
        color: dt('badge.info.color');
    }

    .p-badge-warn {
        background: dt('badge.warn.background');
        color: dt('badge.warn.color');
    }

    .p-badge-danger {
        background: dt('badge.danger.background');
        color: dt('badge.danger.color');
    }

    .p-badge-contrast {
        background: dt('badge.contrast.background');
        color: dt('badge.contrast.color');
    }

    .p-badge-sm {
        font-size: dt('badge.sm.font.size');
        min-width: dt('badge.sm.min.width');
        height: dt('badge.sm.height');
    }

    .p-badge-lg {
        font-size: dt('badge.lg.font.size');
        min-width: dt('badge.lg.min.width');
        height: dt('badge.lg.height');
    }

    .p-badge-xl {
        font-size: dt('badge.xl.font.size');
        min-width: dt('badge.xl.min.width');
        height: dt('badge.xl.height');
    }
`, Dn = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": yt(e.value) && String(e.value).length === 1,
      "p-badge-dot": Kt(e.value) && !o.$slots.default,
      "p-badge-sm": e.size === "small",
      "p-badge-lg": e.size === "large",
      "p-badge-xl": e.size === "xlarge",
      "p-badge-info": e.severity === "info",
      "p-badge-success": e.severity === "success",
      "p-badge-warn": e.severity === "warn",
      "p-badge-danger": e.severity === "danger",
      "p-badge-secondary": e.severity === "secondary",
      "p-badge-contrast": e.severity === "contrast"
    }];
  }
}, Mn = et.extend({
  name: "badge",
  style: Rn,
  classes: Dn
}), Un = {
  name: "BaseBadge",
  extends: ot,
  props: {
    value: {
      type: [String, Number],
      default: null
    },
    severity: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: null
    }
  },
  style: Mn,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function st(t) {
  "@babel/helpers - typeof";
  return st = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, st(t);
}
function jt(t, n, e) {
  return (n = Kn(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Kn(t) {
  var n = Hn(t, "string");
  return st(n) == "symbol" ? n : n + "";
}
function Hn(t, n) {
  if (st(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (st(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Jt = {
  name: "Badge",
  extends: Un,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return U(jt(jt({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Wn = ["data-p"];
function Gn(t, n, e, o, b, r) {
  return a(), i("span", m({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [A(t.$slots, "default", {}, function() {
    return [z(c(t.value), 1)];
  })], 16, Wn);
}
Jt.render = Gn;
var qn = `
    .p-button {
        display: inline-flex;
        cursor: pointer;
        user-select: none;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        position: relative;
        color: dt('button.primary.color');
        background: dt('button.primary.background');
        border: 1px solid dt('button.primary.border.color');
        padding: dt('button.padding.y') dt('button.padding.x');
        font-size: 1rem;
        font-family: inherit;
        font-feature-settings: inherit;
        transition:
            background dt('button.transition.duration'),
            color dt('button.transition.duration'),
            border-color dt('button.transition.duration'),
            outline-color dt('button.transition.duration'),
            box-shadow dt('button.transition.duration');
        border-radius: dt('button.border.radius');
        outline-color: transparent;
        gap: dt('button.gap');
    }

    .p-button:disabled {
        cursor: default;
    }

    .p-button-icon-right {
        order: 1;
    }

    .p-button-icon-right:dir(rtl) {
        order: -1;
    }

    .p-button:not(.p-button-vertical) .p-button-icon:not(.p-button-icon-right):dir(rtl) {
        order: 1;
    }

    .p-button-icon-bottom {
        order: 2;
    }

    .p-button-icon-only {
        width: dt('button.icon.only.width');
        padding-inline-start: 0;
        padding-inline-end: 0;
        gap: 0;
    }

    .p-button-icon-only.p-button-rounded {
        border-radius: 50%;
        height: dt('button.icon.only.width');
    }

    .p-button-icon-only .p-button-label {
        visibility: hidden;
        width: 0;
    }

    .p-button-icon-only::after {
        content: " ";
        visibility: hidden;
        width: 0;
    }

    .p-button-sm {
        font-size: dt('button.sm.font.size');
        padding: dt('button.sm.padding.y') dt('button.sm.padding.x');
    }

    .p-button-sm .p-button-icon {
        font-size: dt('button.sm.font.size');
    }

    .p-button-sm.p-button-icon-only {
        width: dt('button.sm.icon.only.width');
    }

    .p-button-sm.p-button-icon-only.p-button-rounded {
        height: dt('button.sm.icon.only.width');
    }

    .p-button-lg {
        font-size: dt('button.lg.font.size');
        padding: dt('button.lg.padding.y') dt('button.lg.padding.x');
    }

    .p-button-lg .p-button-icon {
        font-size: dt('button.lg.font.size');
    }

    .p-button-lg.p-button-icon-only {
        width: dt('button.lg.icon.only.width');
    }

    .p-button-lg.p-button-icon-only.p-button-rounded {
        height: dt('button.lg.icon.only.width');
    }

    .p-button-vertical {
        flex-direction: column;
    }

    .p-button-label {
        font-weight: dt('button.label.font.weight');
    }

    .p-button-fluid {
        width: 100%;
    }

    .p-button-fluid.p-button-icon-only {
        width: dt('button.icon.only.width');
    }

    .p-button:not(:disabled):hover {
        background: dt('button.primary.hover.background');
        border: 1px solid dt('button.primary.hover.border.color');
        color: dt('button.primary.hover.color');
    }

    .p-button:not(:disabled):active {
        background: dt('button.primary.active.background');
        border: 1px solid dt('button.primary.active.border.color');
        color: dt('button.primary.active.color');
    }

    .p-button:focus-visible {
        box-shadow: dt('button.primary.focus.ring.shadow');
        outline: dt('button.focus.ring.width') dt('button.focus.ring.style') dt('button.primary.focus.ring.color');
        outline-offset: dt('button.focus.ring.offset');
    }

    .p-button .p-badge {
        min-width: dt('button.badge.size');
        height: dt('button.badge.size');
        line-height: dt('button.badge.size');
    }

    .p-button-raised {
        box-shadow: dt('button.raised.shadow');
    }

    .p-button-rounded {
        border-radius: dt('button.rounded.border.radius');
    }

    .p-button-secondary {
        background: dt('button.secondary.background');
        border: 1px solid dt('button.secondary.border.color');
        color: dt('button.secondary.color');
    }

    .p-button-secondary:not(:disabled):hover {
        background: dt('button.secondary.hover.background');
        border: 1px solid dt('button.secondary.hover.border.color');
        color: dt('button.secondary.hover.color');
    }

    .p-button-secondary:not(:disabled):active {
        background: dt('button.secondary.active.background');
        border: 1px solid dt('button.secondary.active.border.color');
        color: dt('button.secondary.active.color');
    }

    .p-button-secondary:focus-visible {
        outline-color: dt('button.secondary.focus.ring.color');
        box-shadow: dt('button.secondary.focus.ring.shadow');
    }

    .p-button-success {
        background: dt('button.success.background');
        border: 1px solid dt('button.success.border.color');
        color: dt('button.success.color');
    }

    .p-button-success:not(:disabled):hover {
        background: dt('button.success.hover.background');
        border: 1px solid dt('button.success.hover.border.color');
        color: dt('button.success.hover.color');
    }

    .p-button-success:not(:disabled):active {
        background: dt('button.success.active.background');
        border: 1px solid dt('button.success.active.border.color');
        color: dt('button.success.active.color');
    }

    .p-button-success:focus-visible {
        outline-color: dt('button.success.focus.ring.color');
        box-shadow: dt('button.success.focus.ring.shadow');
    }

    .p-button-info {
        background: dt('button.info.background');
        border: 1px solid dt('button.info.border.color');
        color: dt('button.info.color');
    }

    .p-button-info:not(:disabled):hover {
        background: dt('button.info.hover.background');
        border: 1px solid dt('button.info.hover.border.color');
        color: dt('button.info.hover.color');
    }

    .p-button-info:not(:disabled):active {
        background: dt('button.info.active.background');
        border: 1px solid dt('button.info.active.border.color');
        color: dt('button.info.active.color');
    }

    .p-button-info:focus-visible {
        outline-color: dt('button.info.focus.ring.color');
        box-shadow: dt('button.info.focus.ring.shadow');
    }

    .p-button-warn {
        background: dt('button.warn.background');
        border: 1px solid dt('button.warn.border.color');
        color: dt('button.warn.color');
    }

    .p-button-warn:not(:disabled):hover {
        background: dt('button.warn.hover.background');
        border: 1px solid dt('button.warn.hover.border.color');
        color: dt('button.warn.hover.color');
    }

    .p-button-warn:not(:disabled):active {
        background: dt('button.warn.active.background');
        border: 1px solid dt('button.warn.active.border.color');
        color: dt('button.warn.active.color');
    }

    .p-button-warn:focus-visible {
        outline-color: dt('button.warn.focus.ring.color');
        box-shadow: dt('button.warn.focus.ring.shadow');
    }

    .p-button-help {
        background: dt('button.help.background');
        border: 1px solid dt('button.help.border.color');
        color: dt('button.help.color');
    }

    .p-button-help:not(:disabled):hover {
        background: dt('button.help.hover.background');
        border: 1px solid dt('button.help.hover.border.color');
        color: dt('button.help.hover.color');
    }

    .p-button-help:not(:disabled):active {
        background: dt('button.help.active.background');
        border: 1px solid dt('button.help.active.border.color');
        color: dt('button.help.active.color');
    }

    .p-button-help:focus-visible {
        outline-color: dt('button.help.focus.ring.color');
        box-shadow: dt('button.help.focus.ring.shadow');
    }

    .p-button-danger {
        background: dt('button.danger.background');
        border: 1px solid dt('button.danger.border.color');
        color: dt('button.danger.color');
    }

    .p-button-danger:not(:disabled):hover {
        background: dt('button.danger.hover.background');
        border: 1px solid dt('button.danger.hover.border.color');
        color: dt('button.danger.hover.color');
    }

    .p-button-danger:not(:disabled):active {
        background: dt('button.danger.active.background');
        border: 1px solid dt('button.danger.active.border.color');
        color: dt('button.danger.active.color');
    }

    .p-button-danger:focus-visible {
        outline-color: dt('button.danger.focus.ring.color');
        box-shadow: dt('button.danger.focus.ring.shadow');
    }

    .p-button-contrast {
        background: dt('button.contrast.background');
        border: 1px solid dt('button.contrast.border.color');
        color: dt('button.contrast.color');
    }

    .p-button-contrast:not(:disabled):hover {
        background: dt('button.contrast.hover.background');
        border: 1px solid dt('button.contrast.hover.border.color');
        color: dt('button.contrast.hover.color');
    }

    .p-button-contrast:not(:disabled):active {
        background: dt('button.contrast.active.background');
        border: 1px solid dt('button.contrast.active.border.color');
        color: dt('button.contrast.active.color');
    }

    .p-button-contrast:focus-visible {
        outline-color: dt('button.contrast.focus.ring.color');
        box-shadow: dt('button.contrast.focus.ring.shadow');
    }

    .p-button-outlined {
        background: transparent;
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):hover {
        background: dt('button.outlined.primary.hover.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined:not(:disabled):active {
        background: dt('button.outlined.primary.active.background');
        border-color: dt('button.outlined.primary.border.color');
        color: dt('button.outlined.primary.color');
    }

    .p-button-outlined.p-button-secondary {
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):hover {
        background: dt('button.outlined.secondary.hover.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-secondary:not(:disabled):active {
        background: dt('button.outlined.secondary.active.background');
        border-color: dt('button.outlined.secondary.border.color');
        color: dt('button.outlined.secondary.color');
    }

    .p-button-outlined.p-button-success {
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):hover {
        background: dt('button.outlined.success.hover.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-success:not(:disabled):active {
        background: dt('button.outlined.success.active.background');
        border-color: dt('button.outlined.success.border.color');
        color: dt('button.outlined.success.color');
    }

    .p-button-outlined.p-button-info {
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):hover {
        background: dt('button.outlined.info.hover.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-info:not(:disabled):active {
        background: dt('button.outlined.info.active.background');
        border-color: dt('button.outlined.info.border.color');
        color: dt('button.outlined.info.color');
    }

    .p-button-outlined.p-button-warn {
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):hover {
        background: dt('button.outlined.warn.hover.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-warn:not(:disabled):active {
        background: dt('button.outlined.warn.active.background');
        border-color: dt('button.outlined.warn.border.color');
        color: dt('button.outlined.warn.color');
    }

    .p-button-outlined.p-button-help {
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):hover {
        background: dt('button.outlined.help.hover.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-help:not(:disabled):active {
        background: dt('button.outlined.help.active.background');
        border-color: dt('button.outlined.help.border.color');
        color: dt('button.outlined.help.color');
    }

    .p-button-outlined.p-button-danger {
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):hover {
        background: dt('button.outlined.danger.hover.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-danger:not(:disabled):active {
        background: dt('button.outlined.danger.active.background');
        border-color: dt('button.outlined.danger.border.color');
        color: dt('button.outlined.danger.color');
    }

    .p-button-outlined.p-button-contrast {
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):hover {
        background: dt('button.outlined.contrast.hover.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-contrast:not(:disabled):active {
        background: dt('button.outlined.contrast.active.background');
        border-color: dt('button.outlined.contrast.border.color');
        color: dt('button.outlined.contrast.color');
    }

    .p-button-outlined.p-button-plain {
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):hover {
        background: dt('button.outlined.plain.hover.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-outlined.p-button-plain:not(:disabled):active {
        background: dt('button.outlined.plain.active.background');
        border-color: dt('button.outlined.plain.border.color');
        color: dt('button.outlined.plain.color');
    }

    .p-button-text {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):hover {
        background: dt('button.text.primary.hover.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text:not(:disabled):active {
        background: dt('button.text.primary.active.background');
        border-color: transparent;
        color: dt('button.text.primary.color');
    }

    .p-button-text.p-button-secondary {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):hover {
        background: dt('button.text.secondary.hover.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-secondary:not(:disabled):active {
        background: dt('button.text.secondary.active.background');
        border-color: transparent;
        color: dt('button.text.secondary.color');
    }

    .p-button-text.p-button-success {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):hover {
        background: dt('button.text.success.hover.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-success:not(:disabled):active {
        background: dt('button.text.success.active.background');
        border-color: transparent;
        color: dt('button.text.success.color');
    }

    .p-button-text.p-button-info {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):hover {
        background: dt('button.text.info.hover.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-info:not(:disabled):active {
        background: dt('button.text.info.active.background');
        border-color: transparent;
        color: dt('button.text.info.color');
    }

    .p-button-text.p-button-warn {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):hover {
        background: dt('button.text.warn.hover.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-warn:not(:disabled):active {
        background: dt('button.text.warn.active.background');
        border-color: transparent;
        color: dt('button.text.warn.color');
    }

    .p-button-text.p-button-help {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):hover {
        background: dt('button.text.help.hover.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-help:not(:disabled):active {
        background: dt('button.text.help.active.background');
        border-color: transparent;
        color: dt('button.text.help.color');
    }

    .p-button-text.p-button-danger {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):hover {
        background: dt('button.text.danger.hover.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-danger:not(:disabled):active {
        background: dt('button.text.danger.active.background');
        border-color: transparent;
        color: dt('button.text.danger.color');
    }

    .p-button-text.p-button-contrast {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):hover {
        background: dt('button.text.contrast.hover.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-contrast:not(:disabled):active {
        background: dt('button.text.contrast.active.background');
        border-color: transparent;
        color: dt('button.text.contrast.color');
    }

    .p-button-text.p-button-plain {
        background: transparent;
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):hover {
        background: dt('button.text.plain.hover.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-text.p-button-plain:not(:disabled):active {
        background: dt('button.text.plain.active.background');
        border-color: transparent;
        color: dt('button.text.plain.color');
    }

    .p-button-link {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.color');
    }

    .p-button-link:not(:disabled):hover {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.hover.color');
    }

    .p-button-link:not(:disabled):hover .p-button-label {
        text-decoration: underline;
    }

    .p-button-link:not(:disabled):active {
        background: transparent;
        border-color: transparent;
        color: dt('button.link.active.color');
    }
`;
function lt(t) {
  "@babel/helpers - typeof";
  return lt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, lt(t);
}
function V(t, n, e) {
  return (n = Xn(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Xn(t) {
  var n = Yn(t, "string");
  return lt(n) == "symbol" ? n : n + "";
}
function Yn(t, n) {
  if (lt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (lt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Zn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", V(V(V(V(V(V(V(V(V({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", V({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, Jn = et.extend({
  name: "button",
  style: qn,
  classes: Zn
}), Qn = {
  name: "BaseButton",
  extends: ot,
  props: {
    label: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: null
    },
    iconPos: {
      type: String,
      default: "left"
    },
    iconClass: {
      type: [String, Object],
      default: null
    },
    badge: {
      type: String,
      default: null
    },
    badgeClass: {
      type: [String, Object],
      default: null
    },
    badgeSeverity: {
      type: String,
      default: "secondary"
    },
    loading: {
      type: Boolean,
      default: !1
    },
    loadingIcon: {
      type: String,
      default: void 0
    },
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    },
    link: {
      type: Boolean,
      default: !1
    },
    severity: {
      type: String,
      default: null
    },
    raised: {
      type: Boolean,
      default: !1
    },
    rounded: {
      type: Boolean,
      default: !1
    },
    text: {
      type: Boolean,
      default: !1
    },
    outlined: {
      type: Boolean,
      default: !1
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    },
    plain: {
      type: Boolean,
      default: !1
    },
    fluid: {
      type: Boolean,
      default: null
    }
  },
  style: Jn,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function dt(t) {
  "@babel/helpers - typeof";
  return dt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, dt(t);
}
function B(t, n, e) {
  return (n = te(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function te(t) {
  var n = ne(t, "string");
  return dt(n) == "symbol" ? n : n + "";
}
function ne(t, n) {
  if (dt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (dt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var G = {
  name: "Button",
  extends: Qn,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(n) {
      var e = n === "root" ? this.ptmi : this.ptm;
      return e(n, {
        context: {
          disabled: this.disabled
        }
      });
    }
  },
  computed: {
    disabled: function() {
      return this.$attrs.disabled || this.$attrs.disabled === "" || this.loading;
    },
    defaultAriaLabel: function() {
      return this.label ? this.label + (this.badge ? " " + this.badge : "") : this.$attrs.ariaLabel;
    },
    hasIcon: function() {
      return this.icon || this.$slots.icon;
    },
    attrs: function() {
      return m(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        "aria-label": this.defaultAriaLabel,
        "data-pc-name": "button",
        "data-p-disabled": this.disabled,
        "data-p-severity": this.severity
      };
    },
    hasFluid: function() {
      return Kt(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return U(B(B(B(B(B(B(B(B(B(B({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return U(B(B({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return U(B(B({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Zt,
    Badge: Jt
  },
  directives: {
    ripple: Ht
  }
}, ee = ["data-p"], oe = ["data-p"];
function ae(t, n, e, o, b, r) {
  var C = ft("SpinnerIcon"), w = ft("Badge"), g = _t("ripple");
  return t.asChild ? A(t.$slots, "default", {
    key: 1,
    class: R(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : ht((a(), P(it(t.as), m({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: L(function() {
      return [A(t.$slots, "default", {}, function() {
        return [t.loading ? A(t.$slots, "loadingicon", m({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), i("span", m({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), P(C, m({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : A(t.$slots, "icon", m({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), i("span", m({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, ee)) : d("", !0)];
        }), t.label ? (a(), i("span", m({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), c(t.label), 17, oe)) : d("", !0), t.badge ? (a(), P(w, {
          key: 3,
          value: t.badge,
          class: R(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : d("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[g]]);
}
G.render = ae;
const re = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ie = /* @__PURE__ */ q({
  __name: "share-control",
  props: {
    id: {},
    title: {},
    hideButton: { type: Boolean }
  },
  setup(t, { expose: n }) {
    const e = t, o = k(!1), b = k(null), r = k("");
    function C() {
      o.value = !1;
    }
    return n({ show: () => {
      o.value = !0;
    } }), vt(b, async (w) => {
      if (w) {
        r.value = "";
        try {
          if (customElements.get("kickside-share") || await Yt("kickside-share", { timeoutMs: 8e3 }), b.value !== w) return;
          const g = document.createElement("kickside-share");
          g.setAttribute("config", JSON.stringify({
            resource_id: e.id,
            title: e.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(e.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(e.id)}`
          })), g.style.display = "block", g.addEventListener("close", C), w.appendChild(g);
        } catch (g) {
          r.value = rt(g, "Could not open sharing.");
        }
      }
    }), (w, g) => (a(), i(F, null, [
      t.hideButton ? d("", !0) : (a(), i("button", {
        key: 0,
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: g[0] || (g[0] = (I) => o.value = !0)
      }, [
        x(u(T), { icon: "tabler:share" })
      ])),
      o.value ? (a(), i("div", {
        key: 1,
        ref_key: "shareHost",
        ref: b
      }, null, 512)) : d("", !0),
      r.value ? (a(), i("span", re, c(r.value), 1)) : d("", !0)
    ], 64));
  }
}), se = ["aria-label", "aria-busy"], le = { class: "ac-dialog-header" }, de = {
  key: 0,
  class: "kx-modal-head-icon"
}, ce = { class: "ac-dialog-content" }, ue = /* @__PURE__ */ q({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean },
    busy: { type: Boolean },
    icon: {}
  },
  emits: ["close"],
  setup(t, { emit: n }) {
    const e = t, o = n, b = k(null);
    let r = null;
    function C(g) {
      g.preventDefault(), e.busy || o("close");
    }
    function w(g) {
      const I = b.value;
      if (!I || g.target !== I) return;
      const f = I.getBoundingClientRect();
      (g.clientX < f.left || g.clientX > f.right || g.clientY < f.top || g.clientY > f.bottom) && C(g);
    }
    return Rt(async () => {
      await Dt();
      const g = b.value;
      !g || g.open || (r = g.getRootNode().activeElement, g.showModal());
    }), yn(() => {
      b.value?.open && b.value.close(), r?.isConnected && r.focus();
    }), (g, I) => (a(), i("dialog", {
      ref_key: "dialog",
      ref: b,
      class: R(["ac-dialog", { "ac-dialog-wide": t.wide }]),
      "aria-label": t.title,
      "aria-modal": "true",
      "aria-busy": t.busy || void 0,
      onCancel: C,
      onClose: I[1] || (I[1] = (f) => !t.busy && o("close")),
      onClick: w
    }, [
      p("header", le, [
        t.icon ? (a(), i("span", de, [
          x(u(T), {
            icon: t.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ])) : d("", !0),
        p("h2", {
          class: R({ "kx-modal-head-title": t.icon })
        }, c(t.title), 3),
        x(u(G), {
          type: "button",
          text: "",
          rounded: "",
          severity: "secondary",
          "aria-label": "Close dialog",
          disabled: t.busy,
          onClick: I[0] || (I[0] = (f) => o("close"))
        }, {
          default: L(() => [
            x(u(T), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ]),
      p("div", ce, [
        A(g.$slots, "default")
      ])
    ], 42, se));
  }
});
var Qt = {
  name: "TimesIcon",
  extends: Ut
};
function be(t) {
  return me(t) || he(t) || pe(t) || ge();
}
function ge() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pe(t, n) {
  if (t) {
    if (typeof t == "string") return wt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? wt(t, n) : void 0;
  }
}
function he(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function me(t) {
  if (Array.isArray(t)) return wt(t);
}
function wt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function fe(t, n, e, o, b, r) {
  return a(), i("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), be(n[0] || (n[0] = [p("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Qt.render = fe;
var ve = {
  name: "BaseEditableHolder",
  extends: ot,
  emits: ["update:modelValue", "value-change"],
  props: {
    modelValue: {
      type: null,
      default: void 0
    },
    defaultValue: {
      type: null,
      default: void 0
    },
    name: {
      type: String,
      default: void 0
    },
    invalid: {
      type: Boolean,
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    formControl: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    },
    $pcForm: {
      default: void 0
    },
    $pcFormField: {
      default: void 0
    }
  },
  data: function() {
    return {
      d_value: this.defaultValue !== void 0 ? this.defaultValue : this.modelValue
    };
  },
  watch: {
    modelValue: {
      deep: !0,
      handler: function(n) {
        this.d_value = n;
      }
    },
    defaultValue: function(n) {
      this.d_value = n;
    },
    $formName: {
      immediate: !0,
      handler: function(n) {
        var e, o;
        this.formField = ((e = this.$pcForm) === null || e === void 0 || (o = e.register) === null || o === void 0 ? void 0 : o.call(e, n, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(n) {
        var e, o;
        this.formField = ((e = this.$pcForm) === null || e === void 0 || (o = e.register) === null || o === void 0 ? void 0 : o.call(e, this.$formName, n)) || {};
      }
    },
    $formDefaultValue: {
      immediate: !0,
      handler: function(n) {
        this.d_value !== n && (this.d_value = n);
      }
    },
    $formValue: {
      immediate: !1,
      handler: function(n) {
        var e;
        (e = this.$pcForm) !== null && e !== void 0 && e.getFieldState(this.$formName) && n !== this.d_value && (this.d_value = n);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(n, e) {
      var o, b;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (b = this.formField).onChange) === null || o === void 0 || o.call(b, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(yt);
    }
  },
  computed: {
    $filled: function() {
      return yt(this.d_value);
    },
    $invalid: function() {
      var n, e;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.invalid, (e = this.$pcForm) === null || e === void 0 || (e = e.getFieldState(this.$formName)) === null || e === void 0 ? void 0 : e.invalid);
    },
    $formName: function() {
      var n;
      return this.$formNovalidate ? void 0 : this.name || ((n = this.$formControl) === null || n === void 0 ? void 0 : n.name);
    },
    $formControl: function() {
      var n;
      return this.formControl || ((n = this.$pcFormField) === null || n === void 0 ? void 0 : n.formControl);
    },
    $formNovalidate: function() {
      var n;
      return (n = this.$formControl) === null || n === void 0 ? void 0 : n.novalidate;
    },
    $formDefaultValue: function() {
      var n, e;
      return this.findNonEmpty(this.d_value, (n = this.$pcFormField) === null || n === void 0 ? void 0 : n.initialValue, (e = this.$pcForm) === null || e === void 0 || (e = e.initialValues) === null || e === void 0 ? void 0 : e[this.$formName]);
    },
    $formValue: function() {
      var n, e;
      return this.findNonEmpty((n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.value, (e = this.$pcForm) === null || e === void 0 || (e = e.getFieldState(this.$formName)) === null || e === void 0 ? void 0 : e.value);
    },
    controlled: function() {
      return this.$inProps.hasOwnProperty("modelValue") || !this.$inProps.hasOwnProperty("modelValue") && !this.$inProps.hasOwnProperty("defaultValue");
    },
    // @deprecated use $filled instead
    filled: function() {
      return this.$filled;
    }
  }
};
const ye = new Intl.DateTimeFormat(void 0, { weekday: "short", hour: "numeric", minute: "2-digit" }), ke = {
  five_hour: "5-hour limit",
  seven_day: "Weekly limit",
  seven_day_sonnet: "Weekly Sonnet limit",
  seven_day_opus: "Weekly Opus limit"
}, $t = (t) => ke[t] ?? "Usage limit", xt = (t) => ye.format(t);
function we(t, n) {
  const e = Ct(t, n);
  if (e === "disabled") return { state: e, label: "Disabled", help: "Enable this account to run tasks with it." };
  if (e === "unavailable")
    return { state: e, label: "Needs attention", help: "Check that the provider is installed and that you have access to this account." };
  const o = t.rate_limits?.windows.find((r) => r.status === "rejected" && r.resets_at && r.resets_at * 1e3 > n);
  if (o?.resets_at) return { state: "cooling", label: `${$t(o.window)} reached, resets ${xt(o.resets_at * 1e3)}`, help: "Use another account or wait for the reset." };
  if (e === "cooling") {
    const r = Date.parse(t.cooldown_until);
    return { state: e, label: `Limited until ${xt(r)}`, help: "Use another account or wait for the reset." };
  }
  const b = t.last_error.match(/^([a-z][a-z0-9_]+)(?=:|$)/)?.[1];
  return b === "rate_limit" ? { state: e, label: "Ready", help: "The last task hit a rate limit. Try again or use another account.", code: b } : t.last_error ? { state: "failed", label: "Needs attention", help: "The last task reported an account error. Check the credential and reconnect if needed.", code: b } : { state: e, label: "Ready", help: "" };
}
const $e = {
  codex: { name: "Codex", hint: "ChatGPT sign-in or an OpenAI API key" },
  claude: { name: "Claude Code", hint: "Claude subscription token" },
  agy: { name: "Antigravity", hint: "Google Antigravity login or Gemini API key" },
  grok: { name: "Grok", hint: "xAI API key" },
  muse: { name: "Muse", hint: "Meta API key or Muse login file" },
  opencode: { name: "OpenCode", hint: "API key or an OpenCode login file" },
  pi: { name: "Pi", hint: "API key or a Pi login file" }
};
function xe(t, n) {
  return $e[t] ?? { name: n, hint: "Provider credential" };
}
const Ce = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, Se = ["disabled", "aria-pressed", "onClick"], Pe = ["disabled", "value"], Ae = ["value"], ze = /* @__PURE__ */ q({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (n, e) => t.agents.length <= 6 ? (a(), i("div", Ce, [
      (a(!0), i(F, null, nt(t.agents, (o) => (a(), i("button", {
        key: o.id,
        disabled: t.disabled,
        type: "button",
        class: R(["ac-chip kx-focus-halo", { active: t.modelValue === o.id }]),
        "aria-pressed": t.modelValue === o.id,
        onClick: (b) => n.$emit("update:modelValue", o.id)
      }, [
        x(u(T), {
          icon: u(qt)(o.id, t.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        z(c(o.title), 1)
      ], 10, Se))), 128))
    ])) : (a(), i("select", {
      key: 1,
      disabled: t.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: t.modelValue,
      onChange: e[0] || (e[0] = (o) => n.$emit("update:modelValue", o.target.value))
    }, [
      (a(!0), i(F, null, nt(t.agents, (o) => (a(), i("option", {
        key: o.id,
        value: o.id
      }, c(o.title), 9, Ae))), 128))
    ], 40, Pe));
  }
});
var Ie = `
    .p-toggleswitch {
        display: inline-block;
        width: dt('toggleswitch.width');
        height: dt('toggleswitch.height');
    }

    .p-toggleswitch-input {
        cursor: pointer;
        appearance: none;
        position: absolute;
        top: 0;
        inset-inline-start: 0;
        width: 100%;
        height: 100%;
        padding: 0;
        margin: 0;
        opacity: 0;
        z-index: 1;
        outline: 0 none;
        border-radius: dt('toggleswitch.border.radius');
    }

    .p-toggleswitch-slider {
        cursor: pointer;
        width: 100%;
        height: 100%;
        border-width: dt('toggleswitch.border.width');
        border-style: solid;
        border-color: dt('toggleswitch.border.color');
        background: dt('toggleswitch.background');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            border-color dt('toggleswitch.transition.duration'),
            outline-color dt('toggleswitch.transition.duration'),
            box-shadow dt('toggleswitch.transition.duration');
        border-radius: dt('toggleswitch.border.radius');
        outline-color: transparent;
        box-shadow: dt('toggleswitch.shadow');
    }

    .p-toggleswitch-handle {
        position: absolute;
        top: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
        background: dt('toggleswitch.handle.background');
        color: dt('toggleswitch.handle.color');
        width: dt('toggleswitch.handle.size');
        height: dt('toggleswitch.handle.size');
        inset-inline-start: dt('toggleswitch.gap');
        margin-block-start: calc(-1 * calc(dt('toggleswitch.handle.size') / 2));
        border-radius: dt('toggleswitch.handle.border.radius');
        transition:
            background dt('toggleswitch.transition.duration'),
            color dt('toggleswitch.transition.duration'),
            inset-inline-start dt('toggleswitch.slide.duration'),
            box-shadow dt('toggleswitch.slide.duration');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.background');
        border-color: dt('toggleswitch.checked.border.color');
    }

    .p-toggleswitch.p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.background');
        color: dt('toggleswitch.handle.checked.color');
        inset-inline-start: calc(dt('toggleswitch.width') - calc(dt('toggleswitch.handle.size') + dt('toggleswitch.gap')));
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-slider {
        background: dt('toggleswitch.hover.background');
        border-color: dt('toggleswitch.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover) .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.hover.background');
        color: dt('toggleswitch.handle.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-slider {
        background: dt('toggleswitch.checked.hover.background');
        border-color: dt('toggleswitch.checked.hover.border.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:hover).p-toggleswitch-checked .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.checked.hover.background');
        color: dt('toggleswitch.handle.checked.hover.color');
    }

    .p-toggleswitch:not(.p-disabled):has(.p-toggleswitch-input:focus-visible) .p-toggleswitch-slider {
        box-shadow: dt('toggleswitch.focus.ring.shadow');
        outline: dt('toggleswitch.focus.ring.width') dt('toggleswitch.focus.ring.style') dt('toggleswitch.focus.ring.color');
        outline-offset: dt('toggleswitch.focus.ring.offset');
    }

    .p-toggleswitch.p-invalid > .p-toggleswitch-slider {
        border-color: dt('toggleswitch.invalid.border.color');
    }

    .p-toggleswitch.p-disabled {
        opacity: 1;
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-slider {
        background: dt('toggleswitch.disabled.background');
    }

    .p-toggleswitch.p-disabled .p-toggleswitch-handle {
        background: dt('toggleswitch.handle.disabled.background');
    }
`, Be = {
  root: {
    position: "relative"
  }
}, Te = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": e.checked,
      "p-disabled": o.disabled,
      "p-invalid": e.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, Oe = et.extend({
  name: "toggleswitch",
  style: Ie,
  classes: Te,
  inlineStyles: Be
}), Fe = {
  name: "BaseToggleSwitch",
  extends: ve,
  props: {
    trueValue: {
      type: null,
      default: !0
    },
    falseValue: {
      type: null,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: null
    },
    inputId: {
      type: String,
      default: null
    },
    inputClass: {
      type: [String, Object],
      default: null
    },
    inputStyle: {
      type: Object,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },
  style: Oe,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, tn = {
  name: "ToggleSwitch",
  extends: Fe,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(n) {
      var e = n === "root" ? this.ptmi : this.ptm;
      return e(n, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(n) {
      if (!this.disabled && !this.readonly) {
        var e = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(e, n), this.$emit("change", n);
      }
    },
    onFocus: function(n) {
      this.$emit("focus", n);
    },
    onBlur: function(n) {
      var e, o;
      this.$emit("blur", n), (e = (o = this.formField).onBlur) === null || e === void 0 || e.call(o, n);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return U({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, Ee = ["data-p-checked", "data-p-disabled", "data-p"], je = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], Le = ["data-p"], Ne = ["data-p"];
function Ve(t, n, e, o, b, r) {
  return a(), i("div", m({
    class: t.cx("root"),
    style: t.sx("root")
  }, r.getPTOptions("root"), {
    "data-p-checked": r.checked,
    "data-p-disabled": t.disabled,
    "data-p": r.dataP
  }), [p("input", m({
    id: t.inputId,
    type: "checkbox",
    role: "switch",
    class: [t.cx("input"), t.inputClass],
    style: t.inputStyle,
    checked: r.checked,
    tabindex: t.tabindex,
    disabled: t.disabled,
    readonly: t.readonly,
    "aria-checked": r.checked,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    "aria-invalid": t.invalid || void 0,
    onFocus: n[0] || (n[0] = function() {
      return r.onFocus && r.onFocus.apply(r, arguments);
    }),
    onBlur: n[1] || (n[1] = function() {
      return r.onBlur && r.onBlur.apply(r, arguments);
    }),
    onChange: n[2] || (n[2] = function() {
      return r.onChange && r.onChange.apply(r, arguments);
    })
  }, r.getPTOptions("input")), null, 16, je), p("div", m({
    class: t.cx("slider")
  }, r.getPTOptions("slider"), {
    "data-p": r.dataP
  }), [p("div", m({
    class: t.cx("handle")
  }, r.getPTOptions("handle"), {
    "data-p": r.dataP
  }), [A(t.$slots, "handle", {
    checked: r.checked
  })], 16, Ne)], 16, Le)], 16, Ee);
}
tn.render = Ve;
var _e = `
    .p-tag {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        background: dt('tag.primary.background');
        color: dt('tag.primary.color');
        font-size: dt('tag.font.size');
        font-weight: dt('tag.font.weight');
        padding: dt('tag.padding');
        border-radius: dt('tag.border.radius');
        gap: dt('tag.gap');
    }

    .p-tag-icon {
        font-size: dt('tag.icon.size');
        width: dt('tag.icon.size');
        height: dt('tag.icon.size');
    }

    .p-tag-rounded {
        border-radius: dt('tag.rounded.border.radius');
    }

    .p-tag-success {
        background: dt('tag.success.background');
        color: dt('tag.success.color');
    }

    .p-tag-info {
        background: dt('tag.info.background');
        color: dt('tag.info.color');
    }

    .p-tag-warn {
        background: dt('tag.warn.background');
        color: dt('tag.warn.color');
    }

    .p-tag-danger {
        background: dt('tag.danger.background');
        color: dt('tag.danger.color');
    }

    .p-tag-secondary {
        background: dt('tag.secondary.background');
        color: dt('tag.secondary.color');
    }

    .p-tag-contrast {
        background: dt('tag.contrast.background');
        color: dt('tag.contrast.color');
    }
`, Re = {
  root: function(n) {
    var e = n.props;
    return ["p-tag p-component", {
      "p-tag-info": e.severity === "info",
      "p-tag-success": e.severity === "success",
      "p-tag-warn": e.severity === "warn",
      "p-tag-danger": e.severity === "danger",
      "p-tag-secondary": e.severity === "secondary",
      "p-tag-contrast": e.severity === "contrast",
      "p-tag-rounded": e.rounded
    }];
  },
  icon: "p-tag-icon",
  label: "p-tag-label"
}, De = et.extend({
  name: "tag",
  style: _e,
  classes: Re
}), Me = {
  name: "BaseTag",
  extends: ot,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: De,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function ct(t) {
  "@babel/helpers - typeof";
  return ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ct(t);
}
function Ue(t, n, e) {
  return (n = Ke(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ke(t) {
  var n = He(t, "string");
  return ct(n) == "symbol" ? n : n + "";
}
function He(t, n) {
  if (ct(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ct(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var nn = {
  name: "Tag",
  extends: Me,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return U(Ue({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, We = ["data-p"];
function Ge(t, n, e, o, b, r) {
  return a(), i("span", m({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), P(it(t.$slots.icon), m({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), i("span", m({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : d("", !0), t.value != null || t.$slots.default ? A(t.$slots, "default", {
    key: 2
  }, function() {
    return [p("span", m({
      class: t.cx("label")
    }, t.ptm("label")), c(t.value), 17)];
  }) : d("", !0)], 16, We);
}
nn.render = Ge;
var qe = `
    .p-progressbar {
        display: block;
        position: relative;
        overflow: hidden;
        height: dt('progressbar.height');
        background: dt('progressbar.background');
        border-radius: dt('progressbar.border.radius');
    }

    .p-progressbar-value {
        margin: 0;
        background: dt('progressbar.value.background');
    }

    .p-progressbar-label {
        color: dt('progressbar.label.color');
        font-size: dt('progressbar.label.font.size');
        font-weight: dt('progressbar.label.font.weight');
    }

    .p-progressbar-determinate .p-progressbar-value {
        height: 100%;
        width: 0%;
        position: absolute;
        display: none;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        transition: width 1s ease-in-out;
    }

    .p-progressbar-determinate .p-progressbar-label {
        display: inline-flex;
    }

    .p-progressbar-indeterminate .p-progressbar-value::before {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim 2.1s cubic-bezier(0.65, 0.815, 0.735, 0.395) infinite;
    }

    .p-progressbar-indeterminate .p-progressbar-value::after {
        content: '';
        position: absolute;
        background: inherit;
        inset-block-start: 0;
        inset-inline-start: 0;
        inset-block-end: 0;
        will-change: inset-inline-start, inset-inline-end;
        animation: p-progressbar-indeterminate-anim-short 2.1s cubic-bezier(0.165, 0.84, 0.44, 1) infinite;
        animation-delay: 1.15s;
    }

    @keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim {
        0% {
            inset-inline-start: -35%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
        100% {
            inset-inline-start: 100%;
            inset-inline-end: -90%;
        }
    }

    @keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
    @-webkit-keyframes p-progressbar-indeterminate-anim-short {
        0% {
            inset-inline-start: -200%;
            inset-inline-end: 100%;
        }
        60% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
        100% {
            inset-inline-start: 107%;
            inset-inline-end: -8%;
        }
    }
`, Xe = {
  root: function(n) {
    var e = n.instance;
    return ["p-progressbar p-component", {
      "p-progressbar-determinate": e.determinate,
      "p-progressbar-indeterminate": e.indeterminate
    }];
  },
  value: "p-progressbar-value",
  label: "p-progressbar-label"
}, Ye = et.extend({
  name: "progressbar",
  style: qe,
  classes: Xe
}), Ze = {
  name: "BaseProgressBar",
  extends: ot,
  props: {
    value: {
      type: Number,
      default: null
    },
    mode: {
      type: String,
      default: "determinate"
    },
    showValue: {
      type: Boolean,
      default: !0
    }
  },
  style: Ye,
  provide: function() {
    return {
      $pcProgressBar: this,
      $parentInstance: this
    };
  }
}, en = {
  name: "ProgressBar",
  extends: Ze,
  inheritAttrs: !1,
  computed: {
    progressStyle: function() {
      return {
        width: this.value + "%",
        display: "flex"
      };
    },
    indeterminate: function() {
      return this.mode === "indeterminate";
    },
    determinate: function() {
      return this.mode === "determinate";
    },
    dataP: function() {
      return U({
        determinate: this.determinate,
        indeterminate: this.indeterminate
      });
    }
  }
}, Je = ["aria-valuenow", "data-p"], Qe = ["data-p"], to = ["data-p"], no = ["data-p"];
function eo(t, n, e, o, b, r) {
  return a(), i("div", m({
    role: "progressbar",
    class: t.cx("root"),
    "aria-valuemin": "0",
    "aria-valuenow": t.value,
    "aria-valuemax": "100",
    "data-p": r.dataP
  }, t.ptmi("root")), [r.determinate ? (a(), i("div", m({
    key: 0,
    class: t.cx("value"),
    style: r.progressStyle,
    "data-p": r.dataP
  }, t.ptm("value")), [t.value != null && t.value !== 0 && t.showValue ? (a(), i("div", m({
    key: 0,
    class: t.cx("label"),
    "data-p": r.dataP
  }, t.ptm("label")), [A(t.$slots, "default", {}, function() {
    return [z(c(t.value + "%"), 1)];
  })], 16, to)) : d("", !0)], 16, Qe)) : r.indeterminate ? (a(), i("div", m({
    key: 1,
    class: t.cx("value"),
    "data-p": r.dataP
  }, t.ptm("value")), null, 16, no)) : d("", !0)], 16, Je);
}
en.render = eo;
const oo = {
  key: 0,
  class: "ac-usage-list"
}, ao = { class: "ac-usage-label" }, ro = {
  key: 0,
  class: "ac-muted"
}, io = {
  key: 1,
  class: "ac-muted"
}, so = /* @__PURE__ */ q({
  __name: "account-usage",
  props: {
    account: {}
  },
  setup(t) {
    return (n, e) => t.account.rate_limits?.windows.length ? (a(), i("div", oo, [
      (a(!0), i(F, null, nt(t.account.rate_limits.windows, (o) => (a(), i("div", {
        key: o.window,
        class: "ac-usage-window"
      }, [
        p("div", ao, [
          p("span", null, c(u($t)(o.window)), 1),
          o.resets_at ? (a(), i("span", ro, "Resets " + c(u(xt)(o.resets_at * 1e3)), 1)) : d("", !0)
        ]),
        o.utilization !== void 0 || o.status === "rejected" ? (a(), P(u(en), {
          key: 0,
          value: o.utilization === void 0 ? 100 : Math.max(0, Math.min(100, Math.round(o.utilization * 100))),
          "show-value": !1,
          "aria-label": u($t)(o.window),
          class: R(["ac-usage-meter", { "ac-usage-limited": o.status !== "allowed" }])
        }, null, 8, ["value", "aria-label", "class"])) : (a(), i("small", io, c(o.status === "warning" ? "Approaching the limit." : "Within the limit."), 1))
      ]))), 128))
    ])) : d("", !0);
  }
}), lo = {
  key: 0,
  class: "ac-row ac-account ac-managed-account"
}, co = { class: "ac-account-main" }, uo = { class: "ac-row-title" }, bo = ["onKeydown"], go = {
  key: 1,
  class: "ac-row-name"
}, po = { class: "ac-account-summary" }, ho = { class: "ac-muted" }, mo = {
  key: 0,
  class: "ac-hint"
}, fo = {
  key: 1,
  class: "ac-hint"
}, vo = { class: "ac-muted" }, yo = {
  key: 0,
  class: "ac-account-menu"
}, ko = { class: "ac-account-main" }, wo = { class: "ac-row-title" }, $o = ["onKeydown"], xo = {
  key: 1,
  class: "ac-row-name"
}, Co = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, So = { class: "ac-muted" }, Po = ["title"], Ao = { key: 1 }, zo = {
  key: 0,
  class: "ac-muted"
}, Io = {
  key: 1,
  class: "ac-muted ac-strong"
}, Bo = {
  key: 2,
  class: "ac-muted"
}, To = {
  key: 3,
  class: "ac-muted ac-mono"
}, Oo = {
  key: 4,
  class: "ac-muted"
}, Fo = {
  key: 5,
  class: "ac-muted"
}, Eo = {
  key: 6,
  class: "kx-err ac-small"
}, jo = { class: "ac-row-actions" }, Lo = /* @__PURE__ */ q({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {},
    management: { type: Boolean },
    editCredentials: { type: Boolean, default: !0 },
    nativeReconnect: { type: Boolean }
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(t, { emit: n }) {
    const e = t, o = n, b = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, r = Xt(), C = j(() => Ct(e.account, r.value)), w = j(() => we(e.account, r.value)), g = j(() => ({ ready: "success", cooling: "warn", disabled: "secondary", unavailable: "warn", failed: "danger" })[w.value.state]), I = k(), f = k(), X = j(() => [
      ...e.account.writable ? [
        { label: "Rename", icon: "tabler:pencil", command: K },
        ...e.editCredentials ? [{ label: e.nativeReconnect ? "Reconnect" : "Edit credential", icon: "tabler:key", command: () => o("edit") }] : [],
        { label: e.account.enabled ? "Disable" : "Enable", icon: "tabler:power", command: () => o("toggle") }
      ] : [],
      ...e.account.shareable ? [{ label: "Share", icon: "tabler:share", command: () => f.value?.show() }] : [],
      ...e.account.deletable ? [{ label: "Delete", icon: "tabler:trash", command: () => o("remove") }] : []
    ]), Y = j(() => e.account.mine ? "" : e.management ? `Owned by ${e.ownerLabel}` : `Shared with you by ${e.ownerLabel}`), S = k(!1), D = k(""), N = k(null);
    function K() {
      D.value = e.account.label, S.value = !0, Dt(() => N.value?.select());
    }
    function O() {
      if (!S.value) return;
      S.value = !1;
      const E = D.value.trim();
      E && E !== e.account.label && o("rename", E);
    }
    return (E, $) => t.management ? (a(), i("li", lo, [
      p("div", co, [
        p("div", uo, [
          S.value ? ht((a(), i("input", {
            key: 0,
            ref_key: "input",
            ref: N,
            "onUpdate:modelValue": $[0] || ($[0] = (y) => D.value = y),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              gt(pt(O, ["prevent"]), ["enter"]),
              $[1] || ($[1] = gt(pt((y) => S.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: O
          }, null, 40, bo)), [
            [Ft, D.value]
          ]) : (a(), i("span", go, c(t.account.label), 1))
        ]),
        p("div", po, [
          x(u(nn), {
            severity: g.value,
            value: w.value.label
          }, null, 8, ["severity", "value"]),
          p("span", ho, [
            z(c(t.kindLabel), 1),
            Y.value ? (a(), i(F, { key: 0 }, [
              z(" · " + c(Y.value), 1)
            ], 64)) : d("", !0)
          ])
        ]),
        w.value.help ? (a(), i("p", mo, c(w.value.help), 1)) : d("", !0),
        t.account.subscription ? (a(), i("p", fo, "A subscription login runs tasks for its owner.")) : d("", !0),
        A(E.$slots, "usage", { account: t.account }, () => [
          x(so, { account: t.account }, null, 8, ["account"])
        ]),
        p("span", vo, [
          z(c(t.account.runs_day) + " " + c(t.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours", 1),
          t.account.failures_day ? (a(), i(F, { key: 0 }, [
            z(" · " + c(t.account.failures_day) + " failed", 1)
          ], 64)) : d("", !0)
        ]),
        w.value.code ? (a(), P(Sn, {
          key: 2,
          class: "ac-account-details",
          label: "Technical details"
        }, {
          default: L(() => [
            p("code", null, c(w.value.code), 1)
          ]),
          _: 1
        })) : d("", !0)
      ]),
      X.value.length ? (a(), i("div", yo, [
        x(u(G), {
          type: "button",
          text: "",
          rounded: "",
          severity: "secondary",
          size: "small",
          "aria-label": `Actions for ${t.account.label}`,
          "aria-haspopup": "menu",
          onClick: $[2] || ($[2] = (y) => I.value?.toggle(y))
        }, {
          icon: L(() => [
            x(u(T), {
              icon: "tabler:dots",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["aria-label"]),
        x(u(Cn), {
          ref_key: "actions",
          ref: I,
          model: X.value,
          popup: "",
          "append-to": "self",
          "aria-label": `Actions for ${t.account.label}`
        }, {
          itemicon: L(({ item: y }) => [
            y.icon ? (a(), P(u(T), {
              key: 0,
              icon: y.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : d("", !0)
          ]),
          _: 1
        }, 8, ["model", "aria-label"]),
        t.account.shareable ? (a(), P(ie, {
          key: 0,
          ref_key: "share",
          ref: f,
          id: t.account.id,
          title: t.account.label,
          "hide-button": ""
        }, null, 8, ["id", "title"])) : d("", !0)
      ])) : d("", !0)
    ])) : (a(), i("li", {
      key: 1,
      class: R(["ac-row ac-account ac-hover-actions", { off: !t.account.enabled || !t.account.usable }])
    }, [
      p("div", ko, [
        p("div", wo, [
          p("span", {
            class: R(["kx-tag-sm ac-tone", C.value])
          }, c(b[C.value]), 3),
          S.value ? ht((a(), i("input", {
            key: 0,
            ref_key: "input",
            ref: N,
            "onUpdate:modelValue": $[3] || ($[3] = (y) => D.value = y),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              gt(pt(O, ["prevent"]), ["enter"]),
              $[4] || ($[4] = gt(pt((y) => S.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: O
          }, null, 40, $o)), [
            [Ft, D.value]
          ]) : (a(), i("span", xo, c(t.account.label), 1)),
          t.account.subscription ? (a(), i("span", Co, "personal")) : d("", !0)
        ]),
        p("div", So, [
          z(c(t.kindLabel) + " · " + c(t.account.runs_day) + " " + c(t.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + c(t.account.failures_day) + " " + c(t.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          t.account.last_used_at ? (a(), i("span", {
            key: 0,
            title: u(Et)(t.account.last_used_at)
          }, "last used " + c(u(Pn)(t.account.last_used_at, u(r))), 9, Po)) : (a(), i("span", Ao, "never used"))
        ]),
        Y.value ? (a(), i("div", zo, c(Y.value), 1)) : d("", !0),
        t.account.usable ? t.account.subscription ? (a(), i("div", Bo, "Subscription login: personal use only")) : d("", !0) : (a(), i("div", Io, [
          x(u(T), { icon: "tabler:lock" }),
          z(" " + c(t.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        t.account.endpoint ? (a(), i("div", To, c(t.account.endpoint.protocol) + " · " + c(t.account.endpoint.base_url) + c(t.account.endpoint.model ? " · " + t.account.endpoint.model : ""), 1)) : d("", !0),
        C.value === "cooling" && t.account.cooldown_until ? (a(), i("div", Oo, "Available at " + c(u(Et)(t.account.cooldown_until)), 1)) : d("", !0),
        (a(!0), i(F, null, nt(t.account.rate_limits?.windows ?? [], (y) => (a(), i("div", {
          key: y.window,
          class: "ac-muted"
        }, [
          z(c(y.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + c(y.utilization === void 0 ? y.status : `${Math.round(y.utilization * 100)}% used`), 1),
          y.resets_at ? (a(), i(F, { key: 0 }, [
            z(", resets " + c(new Date(y.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : d("", !0)
        ]))), 128)),
        t.account.rate_limits?.overage_status ? (a(), i("div", Fo, "Overage: " + c(t.account.rate_limits.overage_status) + c(t.account.rate_limits.overage_disabled_reason ? " · " + t.account.rate_limits.overage_disabled_reason : ""), 1)) : d("", !0),
        t.account.last_error ? (a(), i("div", Eo, c(t.account.last_error), 1)) : d("", !0)
      ]),
      p("div", jo, [
        t.account.writable ? (a(), P(u(tn), {
          key: 0,
          "model-value": t.account.enabled,
          "aria-label": t.account.enabled ? "Disable account" : "Enable account",
          onChange: $[5] || ($[5] = (y) => o("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : d("", !0),
        t.account.writable ? (a(), i("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: K
        }, [
          x(u(T), { icon: "tabler:pencil" })
        ])) : d("", !0),
        t.account.writable && t.editCredentials ? (a(), i("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: $[6] || ($[6] = (y) => o("edit"))
        }, [
          x(u(T), { icon: "tabler:key" })
        ])) : d("", !0),
        t.account.deletable ? (a(), i("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: $[7] || ($[7] = (y) => o("remove"))
        }, [
          x(u(T), { icon: "tabler:trash" })
        ])) : d("", !0)
      ])
    ], 2));
  }
});
var No = `
    .p-message {
        display: grid;
        grid-template-rows: 1fr;
        border-radius: dt('message.border.radius');
        outline-width: dt('message.border.width');
        outline-style: solid;
    }

    .p-message-content-wrapper {
        min-height: 0;
    }

    .p-message-content {
        display: flex;
        align-items: center;
        padding: dt('message.content.padding');
        gap: dt('message.content.gap');
    }

    .p-message-icon {
        flex-shrink: 0;
    }

    .p-message-close-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;
        margin-inline-start: auto;
        overflow: hidden;
        position: relative;
        width: dt('message.close.button.width');
        height: dt('message.close.button.height');
        border-radius: dt('message.close.button.border.radius');
        background: transparent;
        transition:
            background dt('message.transition.duration'),
            color dt('message.transition.duration'),
            outline-color dt('message.transition.duration'),
            box-shadow dt('message.transition.duration'),
            opacity 0.3s;
        outline-color: transparent;
        color: inherit;
        padding: 0;
        border: none;
        cursor: pointer;
        user-select: none;
    }

    .p-message-close-icon {
        font-size: dt('message.close.icon.size');
        width: dt('message.close.icon.size');
        height: dt('message.close.icon.size');
    }

    .p-message-close-button:focus-visible {
        outline-width: dt('message.close.button.focus.ring.width');
        outline-style: dt('message.close.button.focus.ring.style');
        outline-offset: dt('message.close.button.focus.ring.offset');
    }

    .p-message-info {
        background: dt('message.info.background');
        outline-color: dt('message.info.border.color');
        color: dt('message.info.color');
        box-shadow: dt('message.info.shadow');
    }

    .p-message-info .p-message-close-button:focus-visible {
        outline-color: dt('message.info.close.button.focus.ring.color');
        box-shadow: dt('message.info.close.button.focus.ring.shadow');
    }

    .p-message-info .p-message-close-button:hover {
        background: dt('message.info.close.button.hover.background');
    }

    .p-message-info.p-message-outlined {
        color: dt('message.info.outlined.color');
        outline-color: dt('message.info.outlined.border.color');
    }

    .p-message-info.p-message-simple {
        color: dt('message.info.simple.color');
    }

    .p-message-success {
        background: dt('message.success.background');
        outline-color: dt('message.success.border.color');
        color: dt('message.success.color');
        box-shadow: dt('message.success.shadow');
    }

    .p-message-success .p-message-close-button:focus-visible {
        outline-color: dt('message.success.close.button.focus.ring.color');
        box-shadow: dt('message.success.close.button.focus.ring.shadow');
    }

    .p-message-success .p-message-close-button:hover {
        background: dt('message.success.close.button.hover.background');
    }

    .p-message-success.p-message-outlined {
        color: dt('message.success.outlined.color');
        outline-color: dt('message.success.outlined.border.color');
    }

    .p-message-success.p-message-simple {
        color: dt('message.success.simple.color');
    }

    .p-message-warn {
        background: dt('message.warn.background');
        outline-color: dt('message.warn.border.color');
        color: dt('message.warn.color');
        box-shadow: dt('message.warn.shadow');
    }

    .p-message-warn .p-message-close-button:focus-visible {
        outline-color: dt('message.warn.close.button.focus.ring.color');
        box-shadow: dt('message.warn.close.button.focus.ring.shadow');
    }

    .p-message-warn .p-message-close-button:hover {
        background: dt('message.warn.close.button.hover.background');
    }

    .p-message-warn.p-message-outlined {
        color: dt('message.warn.outlined.color');
        outline-color: dt('message.warn.outlined.border.color');
    }

    .p-message-warn.p-message-simple {
        color: dt('message.warn.simple.color');
    }

    .p-message-error {
        background: dt('message.error.background');
        outline-color: dt('message.error.border.color');
        color: dt('message.error.color');
        box-shadow: dt('message.error.shadow');
    }

    .p-message-error .p-message-close-button:focus-visible {
        outline-color: dt('message.error.close.button.focus.ring.color');
        box-shadow: dt('message.error.close.button.focus.ring.shadow');
    }

    .p-message-error .p-message-close-button:hover {
        background: dt('message.error.close.button.hover.background');
    }

    .p-message-error.p-message-outlined {
        color: dt('message.error.outlined.color');
        outline-color: dt('message.error.outlined.border.color');
    }

    .p-message-error.p-message-simple {
        color: dt('message.error.simple.color');
    }

    .p-message-secondary {
        background: dt('message.secondary.background');
        outline-color: dt('message.secondary.border.color');
        color: dt('message.secondary.color');
        box-shadow: dt('message.secondary.shadow');
    }

    .p-message-secondary .p-message-close-button:focus-visible {
        outline-color: dt('message.secondary.close.button.focus.ring.color');
        box-shadow: dt('message.secondary.close.button.focus.ring.shadow');
    }

    .p-message-secondary .p-message-close-button:hover {
        background: dt('message.secondary.close.button.hover.background');
    }

    .p-message-secondary.p-message-outlined {
        color: dt('message.secondary.outlined.color');
        outline-color: dt('message.secondary.outlined.border.color');
    }

    .p-message-secondary.p-message-simple {
        color: dt('message.secondary.simple.color');
    }

    .p-message-contrast {
        background: dt('message.contrast.background');
        outline-color: dt('message.contrast.border.color');
        color: dt('message.contrast.color');
        box-shadow: dt('message.contrast.shadow');
    }

    .p-message-contrast .p-message-close-button:focus-visible {
        outline-color: dt('message.contrast.close.button.focus.ring.color');
        box-shadow: dt('message.contrast.close.button.focus.ring.shadow');
    }

    .p-message-contrast .p-message-close-button:hover {
        background: dt('message.contrast.close.button.hover.background');
    }

    .p-message-contrast.p-message-outlined {
        color: dt('message.contrast.outlined.color');
        outline-color: dt('message.contrast.outlined.border.color');
    }

    .p-message-contrast.p-message-simple {
        color: dt('message.contrast.simple.color');
    }

    .p-message-text {
        font-size: dt('message.text.font.size');
        font-weight: dt('message.text.font.weight');
    }

    .p-message-icon {
        font-size: dt('message.icon.size');
        width: dt('message.icon.size');
        height: dt('message.icon.size');
    }

    .p-message-sm .p-message-content {
        padding: dt('message.content.sm.padding');
    }

    .p-message-sm .p-message-text {
        font-size: dt('message.text.sm.font.size');
    }

    .p-message-sm .p-message-icon {
        font-size: dt('message.icon.sm.size');
        width: dt('message.icon.sm.size');
        height: dt('message.icon.sm.size');
    }

    .p-message-sm .p-message-close-icon {
        font-size: dt('message.close.icon.sm.size');
        width: dt('message.close.icon.sm.size');
        height: dt('message.close.icon.sm.size');
    }

    .p-message-lg .p-message-content {
        padding: dt('message.content.lg.padding');
    }

    .p-message-lg .p-message-text {
        font-size: dt('message.text.lg.font.size');
    }

    .p-message-lg .p-message-icon {
        font-size: dt('message.icon.lg.size');
        width: dt('message.icon.lg.size');
        height: dt('message.icon.lg.size');
    }

    .p-message-lg .p-message-close-icon {
        font-size: dt('message.close.icon.lg.size');
        width: dt('message.close.icon.lg.size');
        height: dt('message.close.icon.lg.size');
    }

    .p-message-outlined {
        background: transparent;
        outline-width: dt('message.outlined.border.width');
    }

    .p-message-simple {
        background: transparent;
        outline-color: transparent;
        box-shadow: none;
    }

    .p-message-simple .p-message-content {
        padding: dt('message.simple.content.padding');
    }

    .p-message-outlined .p-message-close-button:hover,
    .p-message-simple .p-message-close-button:hover {
        background: transparent;
    }

    .p-message-enter-active {
        animation: p-animate-message-enter 0.3s ease-out forwards;
        overflow: hidden;
    }

    .p-message-leave-active {
        animation: p-animate-message-leave 0.15s ease-in forwards;
        overflow: hidden;
    }

    @keyframes p-animate-message-enter {
        from {
            opacity: 0;
            grid-template-rows: 0fr;
        }
        to {
            opacity: 1;
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-message-leave {
        from {
            opacity: 1;
            grid-template-rows: 1fr;
        }
        to {
            opacity: 0;
            margin: 0;
            grid-template-rows: 0fr;
        }
    }
`, Vo = {
  root: function(n) {
    var e = n.props;
    return ["p-message p-component p-message-" + e.severity, {
      "p-message-outlined": e.variant === "outlined",
      "p-message-simple": e.variant === "simple",
      "p-message-sm": e.size === "small",
      "p-message-lg": e.size === "large"
    }];
  },
  contentWrapper: "p-message-content-wrapper",
  content: "p-message-content",
  icon: "p-message-icon",
  text: "p-message-text",
  closeButton: "p-message-close-button",
  closeIcon: "p-message-close-icon"
}, _o = et.extend({
  name: "message",
  style: No,
  classes: Vo
}), Ro = {
  name: "BaseMessage",
  extends: ot,
  props: {
    severity: {
      type: String,
      default: "info"
    },
    closable: {
      type: Boolean,
      default: !1
    },
    life: {
      type: Number,
      default: null
    },
    icon: {
      type: String,
      default: void 0
    },
    closeIcon: {
      type: String,
      default: void 0
    },
    closeButtonProps: {
      type: null,
      default: null
    },
    size: {
      type: String,
      default: null
    },
    variant: {
      type: String,
      default: null
    }
  },
  style: _o,
  provide: function() {
    return {
      $pcMessage: this,
      $parentInstance: this
    };
  }
};
function ut(t) {
  "@babel/helpers - typeof";
  return ut = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ut(t);
}
function Lt(t, n, e) {
  return (n = Do(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Do(t) {
  var n = Mo(t, "string");
  return ut(n) == "symbol" ? n : n + "";
}
function Mo(t, n) {
  if (ut(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ut(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var on = {
  name: "Message",
  extends: Ro,
  inheritAttrs: !1,
  emits: ["close", "life-end"],
  timeout: null,
  data: function() {
    return {
      visible: !0
    };
  },
  mounted: function() {
    var n = this;
    this.life && setTimeout(function() {
      n.visible = !1, n.$emit("life-end");
    }, this.life);
  },
  methods: {
    close: function(n) {
      this.visible = !1, this.$emit("close", n);
    }
  },
  computed: {
    closeAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    dataP: function() {
      return U(Lt(Lt({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: Ht
  },
  components: {
    TimesIcon: Qt
  }
};
function bt(t) {
  "@babel/helpers - typeof";
  return bt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, bt(t);
}
function Nt(t, n) {
  var e = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    n && (o = o.filter(function(b) {
      return Object.getOwnPropertyDescriptor(t, b).enumerable;
    })), e.push.apply(e, o);
  }
  return e;
}
function Vt(t) {
  for (var n = 1; n < arguments.length; n++) {
    var e = arguments[n] != null ? arguments[n] : {};
    n % 2 ? Nt(Object(e), !0).forEach(function(o) {
      Uo(t, o, e[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)) : Nt(Object(e)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(e, o));
    });
  }
  return t;
}
function Uo(t, n, e) {
  return (n = Ko(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ko(t) {
  var n = Ho(t, "string");
  return bt(n) == "symbol" ? n : n + "";
}
function Ho(t, n) {
  if (bt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (bt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Wo = ["data-p"], Go = ["data-p"], qo = ["data-p"], Xo = ["aria-label", "data-p"], Yo = ["data-p"];
function Zo(t, n, e, o, b, r) {
  var C = ft("TimesIcon"), w = _t("ripple");
  return a(), P(kn, m({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: L(function() {
      return [b.visible ? (a(), i("div", m({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": r.dataP
      }, t.ptm("root")), [p("div", m({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? A(t.$slots, "container", {
        key: 0,
        closeCallback: r.close
      }) : (a(), i("div", m({
        key: 1,
        class: t.cx("content"),
        "data-p": r.dataP
      }, t.ptm("content")), [A(t.$slots, "icon", {
        class: R(t.cx("icon"))
      }, function() {
        return [(a(), P(it(t.icon ? "span" : null), m({
          class: [t.cx("icon"), t.icon],
          "data-p": r.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (a(), i("div", m({
        key: 0,
        class: t.cx("text"),
        "data-p": r.dataP
      }, t.ptm("text")), [A(t.$slots, "default")], 16, qo)) : d("", !0), t.closable ? ht((a(), i("button", m({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": r.closeAriaLabel,
        type: "button",
        onClick: n[0] || (n[0] = function(g) {
          return r.close(g);
        }),
        "data-p": r.dataP
      }, Vt(Vt({}, t.closeButtonProps), t.ptm("closeButton"))), [A(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (a(), i("i", m({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, Yo)) : (a(), P(C, m({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, Xo)), [[w]]) : d("", !0)], 16, Go))], 16)], 16, Wo)) : d("", !0)];
    }),
    _: 3
  }, 16);
}
on.render = Zo;
const Jo = { class: "ac-stack" }, Qo = {
  key: 0,
  class: "kx-err inline"
}, ta = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, na = {
  key: 2,
  class: "kx-loading"
}, ea = {
  key: 3,
  class: "ac-card-head ac-provider-actions"
}, oa = {
  key: 0,
  class: "ac-hint"
}, aa = {
  key: 4,
  class: "kx-empty"
}, ra = { class: "kx-empty-ico" }, ia = {
  key: 5,
  class: "kx-empty"
}, sa = {
  key: 0,
  class: "ac-card-head"
}, la = { class: "ac-card-title" }, da = { class: "ac-muted" }, ca = { class: "ac-account-grid" }, ua = { class: "ac-form" }, ba = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, ga = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, pa = { class: "ac-setup-actions" }, ha = {
  key: 1,
  class: "ac-hint"
}, ma = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Ca = /* @__PURE__ */ q({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {},
    management: { type: Boolean },
    providerId: {},
    allowSetup: { type: Boolean, default: !0 },
    provider: {}
  },
  emits: ["count", "changed"],
  setup(t, { expose: n, emit: e }) {
    const o = Wt(), b = k([]), r = t, C = e, w = k(!1), g = j(() => W.value?.title), I = j(() => r.management && g.value ? f.value ? `Edit ${g.value} account` : `Add ${g.value} account` : f.value ? "Edit account" : "Add account"), f = k(null);
    function X() {
      f.value = null, Q.value = "", J.value = "", w.value = !0;
    }
    function Y(s) {
      f.value = s, J.value = "", H.value = s.agent, Q.value = "", w.value = !0;
    }
    n({ open: X });
    const S = Fn(), D = Xt(), N = k([]), K = k({}), O = k(""), E = k(""), $ = k(!1), y = k(""), at = k(!1), Z = k(!1), St = k(!1), J = k(""), Q = k(""), Pt = k(0), H = k(r.selectedAgent || S.value.agents[0]?.id || "");
    vt(() => r.selectedAgent, (s) => {
      s && (H.value = s);
    });
    const W = j(() => {
      const s = S.value.agents.find((l) => l.id === H.value);
      return !s || !r.management ? s : { ...s, title: xe(s.id, s.title).name, credentials: s.credentials.map((l) => ({
        ...l,
        ...zt(l)
      })) };
    }), an = j(() => JSON.stringify({ driver: W.value, busy: Z.value, error: Q.value, saved: Pt.value, guided: r.management, initialKind: r.provider === "claude" ? "env:CLAUDE_CODE_OAUTH_TOKEN" : void 0, account: f.value ? { id: f.value.id, label: f.value.label, credential_kind: f.value.credential_kind, endpoint: f.value.endpoint } : void 0, limits: S.value.account_limits })), At = j(() => [...S.value.agents, ...[...new Set(N.value.map((s) => s.agent))].filter((s) => !S.value.agents.some((l) => l.id === s)).map((s) => ({ id: s, title: `Unavailable agent: ${s}`, icon: "tabler:terminal-2" }))].map((s) => ({ agent: s, accounts: N.value.filter((l) => l.agent === s.id && [l.label, s.title, l.credential_kind].join(" ").toLowerCase().includes(r.query.toLowerCase())) })).filter((s) => s.accounts.length)), rn = {
      ANTHROPIC: "Anthropic",
      CODEX: "OpenAI",
      DEEPSEEK: "DeepSeek",
      GEMINI: "Gemini",
      GROQ: "Groq",
      META: "Meta",
      MISTRAL: "Mistral",
      OPENAI: "OpenAI",
      OPENROUTER: "OpenRouter",
      XAI: "xAI"
    };
    function zt(s) {
      if (!r.management) return { label: s.label, hint: s.hint };
      if (s.file) return { label: "CLI login file", hint: s.hint };
      if (s.subscription) return { label: "Subscription token", hint: "Paste the subscription token from the provider." };
      const l = s.id.match(/^env:([A-Z]+)_API_KEY$/)?.[1], h = l && rn[l];
      return { label: h ? `${h} API key` : s.label, hint: "Paste the key generated in the provider dashboard." };
    }
    function sn(s) {
      const l = S.value.agents.find((h) => h.id === s.agent)?.credentials.find((h) => h.id === s.credential_kind);
      return l ? zt(l).label : r.management ? "Saved credential" : s.credential_kind;
    }
    const It = (s) => r.provider === "codex" && s.mine && s.credential_kind === "file:.codex/auth.json", mt = q({
      name: "CredentialEditor",
      setup: () => () => wn("chestor-autocode-driver-account", { config: an.value, onSubmit: gn })
    });
    function ln(s) {
      St.value = s;
    }
    async function dn() {
      J.value = "The Codex account is ready to run tasks.", await _(), o() && C("changed");
    }
    async function cn(s) {
      const l = [...new Set(s.filter((v) => !v.mine).map((v) => v.owner_user_id))].filter((v) => !(v in K.value)), h = await Bn(l);
      o() && (K.value = { ...K.value, ...h });
    }
    async function un() {
      if (!r.management) return M.accounts();
      const s = r.providerId ? { provider_id: r.providerId } : { agent: r.selectedAgent }, l = await M.managedAccounts(s);
      return o() && l.agent && (H.value = l.agent), l.accounts;
    }
    const _ = Gt(async () => {
      try {
        const s = await In(un, (l) => l.map((h) => h.id), b, o, (l) => {
          N.value = l, $.value = !0, O.value = "";
        }, () => {
          _();
        });
        if (!o() || (await cn(s), !o())) return;
        $.value = !0, O.value = "";
      } catch (s) {
        o() && (O.value = rt(s, "Could not load accounts."));
      }
    }, o);
    An(() => b.value, () => {
      _();
    });
    const bn = zn.runs(() => {
      _();
    });
    $n(bn), Mt(_);
    async function Bt(s, l) {
      O.value = "", E.value = "";
      try {
        if (await s(), !o()) return;
        await _(), o() && C("changed");
      } catch (h) {
        o() && (O.value = rt(h, l));
      }
    }
    async function gn(s) {
      if (!(s instanceof CustomEvent)) return;
      const l = On.safeParse(s.detail);
      if (Z.value) return;
      if (!l.success || l.data.agent !== H.value || f.value && (!f.value.writable || l.data.credential_kind !== f.value.credential_kind)) {
        Q.value = "Invalid account submission.";
        return;
      }
      const h = l.data;
      Q.value = "", Z.value = !0;
      try {
        if (f.value) {
          const v = await M.updateAccount(f.value.id, {
            label: h.label,
            endpoint: h.endpoint ?? { base_url: "" },
            ...h.secret ? { secret: h.secret } : {}
          });
          if (!o()) return;
          E.value = v.health_error ? `Account saved, but its health could not be refreshed: ${v.health_error.message}` : "";
        } else if (r.management) {
          const v = await M.connectAccount(h);
          o() && (J.value = v.checked ? "The provider accepted the credential. Your account is ready to run tasks." : "Credential saved. Run a task to confirm this account can connect to the provider.");
        } else await M.createAccount(h);
        if (!o()) return;
        Pt.value++, (!r.management || f.value) && (w.value = !1), await _(), o() && C("changed");
      } catch (v) {
        o() && (Q.value = rt(v, "Could not save the account."));
      } finally {
        o() && (Z.value = !1);
      }
    }
    vt(N, (s) => C("count", s.length));
    const Tt = (s, l, h) => Bt(async () => {
      const v = await M.updateAccount(s.id, l);
      o() && v.health_error && (E.value = `Account saved, but its health could not be refreshed: ${v.health_error.message}`);
    }, h), pn = (s) => Tt(s, { enabled: !s.enabled }, "Could not update the account."), hn = (s, l) => Tt(s, { label: l }, "Could not rename the account.");
    async function mn(s) {
      const l = await Tn.confirm({
        header: "Delete account",
        message: `Delete account "${s.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      o() && l && await Bt(() => M.deleteAccount(s.id), "Could not delete the account.");
    }
    async function Ot() {
      if (r.allowSetup) {
        at.value = !0, y.value = "";
        try {
          await Yt("chestor-autocode-driver-account", { timeoutMs: 8e3 });
        } catch {
          o() && (y.value = "The credential form could not load.");
        } finally {
          o() && (at.value = !1);
        }
      }
    }
    return Rt(Ot), (s, l) => (a(), i("div", Jo, [
      O.value ? (a(), i("p", Qo, [
        z(c(O.value) + " ", 1),
        p("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: l[0] || (l[0] = //@ts-ignore
          (...h) => u(_) && u(_)(...h))
        }, "Retry")
      ])) : d("", !0),
      E.value ? (a(), i("p", ta, c(E.value), 1)) : d("", !0),
      !$.value && !O.value ? (a(), i("div", na, "Loading accounts…")) : d("", !0),
      t.management && $.value && t.allowSetup ? (a(), i("div", ea, [
        N.value.length ? d("", !0) : (a(), i("p", oa, "Add an account to let tasks use this provider.")),
        x(u(G), {
          label: "Add account",
          disabled: !W.value,
          onClick: X
        }, {
          icon: L(() => [
            x(u(T), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ])) : d("", !0),
      !t.management && $.value && !N.value.length ? (a(), i("div", aa, [
        p("div", ra, [
          x(u(T), { icon: "tabler:key" })
        ]),
        l[4] || (l[4] = p("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        l[5] || (l[5] = p("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        x(u(G), {
          label: "Add account",
          onClick: X
        }, {
          icon: L(() => [
            x(u(T), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : !t.management && $.value && !At.value.length ? (a(), i("div", ia, [...l[6] || (l[6] = [
        p("div", { class: "kx-empty-title" }, "No matches", -1),
        p("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : d("", !0),
      (a(!0), i(F, null, nt(At.value, (h) => (a(), i("section", {
        key: h.agent.id,
        class: "ac-stack"
      }, [
        t.management ? d("", !0) : (a(), i("div", sa, [
          p("h2", la, [
            x(u(T), {
              icon: u(qt)(h.agent.id, u(S).agents)
            }, null, 8, ["icon"]),
            z(c(h.agent.title), 1)
          ]),
          p("span", da, c(h.accounts.filter((v) => v.usable && u(Ct)(v, u(D)) === "ready").length) + " of " + c(h.accounts.length) + " ready", 1)
        ])),
        p("ul", ca, [
          (a(!0), i(F, null, nt(h.accounts, (v) => (a(), P(Lo, {
            key: v.id,
            account: v,
            "kind-label": sn(v),
            "owner-label": K.value[v.owner_user_id] || v.owner_user_id,
            management: t.management,
            "edit-credentials": t.allowSetup,
            "native-reconnect": It(v),
            onEdit: (tt) => Y(v),
            onToggle: (tt) => pn(v),
            onRename: (tt) => hn(v, tt),
            onRemove: (tt) => mn(v)
          }, xn({ _: 2 }, [
            s.$slots.usage ? {
              name: "usage",
              fn: L((tt) => [
                A(s.$slots, "usage", m({ ref_for: !0 }, tt))
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["account", "kind-label", "owner-label", "management", "edit-credentials", "native-reconnect", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      w.value ? (a(), P(ue, {
        key: 6,
        title: I.value,
        busy: Z.value || St.value,
        icon: t.management ? W.value?.icon : void 0,
        onClose: l[3] || (l[3] = (h) => w.value = !1)
      }, {
        default: L(() => [
          p("div", ua, [
            at.value ? (a(), i("p", ba, "Loading the credential form…")) : y.value ? (a(), i("p", ga, [
              z(c(y.value) + " ", 1),
              x(u(G), {
                label: "Retry",
                severity: "secondary",
                text: "",
                size: "small",
                onClick: Ot
              })
            ])) : d("", !0),
            J.value ? (a(), i(F, { key: 2 }, [
              x(u(on), {
                severity: "success",
                closable: !1,
                role: "status"
              }, {
                default: L(() => [
                  z(c(J.value), 1)
                ]),
                _: 1
              }),
              p("div", pa, [
                x(u(G), {
                  label: "Done",
                  onClick: l[1] || (l[1] = (h) => w.value = !1)
                })
              ])
            ], 64)) : t.management && (!f.value || It(f.value)) ? A(s.$slots, "setup", {
              account: f.value ?? void 0,
              labelBytes: u(S).account_limits?.label_bytes,
              busy: ln,
              saved: dn,
              credential: u(mt)
            }, () => [
              A(s.$slots, "guide", {}, () => [
                l[7] || (l[7] = p("p", { class: "ac-hint" }, "Add a credential from the provider dashboard or from the CLI on a machine that is already signed in.", -1))
              ]),
              W.value && !y.value && !at.value ? (a(), P(it(u(mt)), { key: 0 })) : d("", !0)
            ], void 0, 3) : (a(), i(F, { key: 4 }, [
              !f.value && !t.management ? (a(), P(ze, {
                key: 0,
                disabled: Z.value,
                modelValue: H.value,
                "onUpdate:modelValue": l[2] || (l[2] = (h) => H.value = h),
                agents: u(S).agents
              }, null, 8, ["disabled", "modelValue", "agents"])) : d("", !0),
              !f.value && !t.management ? (a(), i("p", ha, "Tasks balance across your ready accounts automatically.")) : d("", !0),
              W.value && !y.value && !at.value ? (a(), P(it(u(mt)), { key: 2 })) : W.value ? d("", !0) : (a(), i("p", ma, "Install this account’s agent to edit its credential."))
            ], 64))
          ])
        ]),
        _: 3
      }, 8, ["title", "busy", "icon"])) : d("", !0)
    ]));
  }
});
export {
  ie as _,
  ue as a,
  Qt as b,
  nn as c,
  we as d,
  Ca as e,
  xa as f,
  so as g,
  on as h,
  ve as i,
  ze as j,
  xe as p,
  G as s,
  Fn as u
};
