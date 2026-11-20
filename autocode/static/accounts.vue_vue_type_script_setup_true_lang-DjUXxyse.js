import { ref as y, provide as Rt, inject as Dt, computed as D, openBlock as r, createElementBlock as l, mergeProps as C, createElementVNode as m, renderSlot as I, createTextVNode as V, toDisplayString as c, resolveComponent as st, resolveDirective as _t, withDirectives as vt, createBlock as T, resolveDynamicComponent as Ut, withCtx as M, createCommentVNode as p, normalizeClass as _, defineComponent as W, watch as ot, Fragment as L, createVNode as S, unref as h, onMounted as ft, nextTick as mt, onBeforeUnmount as Mt, renderList as q, withKeys as bt, withModifiers as gt, vModelText as Kt, onUnmounted as Ht, createSlots as qt } from "vue";
import { b as yt, s as Jt, B as at, c as kt, d as et, e as lt, f as K, R as Xt } from "./wc-runtime-DbdXH-lj.js";
import { c as wt, s as $t, a as E, e as H, b as xt, d as Ct, f as St, g as pt, h as Yt, u as Wt, l as Zt, r as Gt, p as Qt } from "./presentation-JHHKyan-.js";
import { Icon as B } from "@iconify/vue";
import { loadByTagName as Pt, host as tn } from "@wippy-fe/proxy";
import { a as nn } from "./driver-account-types-BP_E6MTO.js";
function Ro() {
  const t = wt(), n = y(null), o = y(""), e = $t(async () => {
    try {
      const b = await E.catalog();
      if (!t()) return;
      n.value = b, o.value = "";
    } catch (b) {
      if (!t()) return;
      o.value = H(b, "Could not load the agent catalog.");
    }
  }, t);
  return Rt("catalog", n), yt(e), { catalog: n, error: o, load: e };
}
function on() {
  const t = Dt("catalog");
  if (!t) throw new Error("Autocode catalog provider is missing.");
  return D(() => {
    if (!t.value) throw new Error("Autocode catalog is not loaded.");
    return t.value;
  });
}
var Ft = {
  name: "SpinnerIcon",
  extends: Jt
};
function en(t) {
  return dn(t) || ln(t) || an(t) || rn();
}
function rn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function an(t, n) {
  if (t) {
    if (typeof t == "string") return rt(t, n);
    var o = {}.toString.call(t).slice(8, -1);
    return o === "Object" && t.constructor && (o = t.constructor.name), o === "Map" || o === "Set" ? Array.from(t) : o === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o) ? rt(t, n) : void 0;
  }
}
function ln(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function dn(t) {
  if (Array.isArray(t)) return rt(t);
}
function rt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var o = 0, e = Array(n); o < n; o++) e[o] = t[o];
  return e;
}
function un(t, n, o, e, b, d) {
  return r(), l("svg", C({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), en(n[0] || (n[0] = [m("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ft.render = un;
var cn = `
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
`, sn = {
  root: function(n) {
    var o = n.props, e = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": et(o.value) && String(o.value).length === 1,
      "p-badge-dot": kt(o.value) && !e.$slots.default,
      "p-badge-sm": o.size === "small",
      "p-badge-lg": o.size === "large",
      "p-badge-xl": o.size === "xlarge",
      "p-badge-info": o.severity === "info",
      "p-badge-success": o.severity === "success",
      "p-badge-warn": o.severity === "warn",
      "p-badge-danger": o.severity === "danger",
      "p-badge-secondary": o.severity === "secondary",
      "p-badge-contrast": o.severity === "contrast"
    }];
  }
}, bn = at.extend({
  name: "badge",
  style: cn,
  classes: sn
}), gn = {
  name: "BaseBadge",
  extends: lt,
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
  style: bn,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function J(t) {
  "@babel/helpers - typeof";
  return J = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, J(t);
}
function ht(t, n, o) {
  return (n = pn(n)) in t ? Object.defineProperty(t, n, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = o, t;
}
function pn(t) {
  var n = hn(t, "string");
  return J(n) == "symbol" ? n : n + "";
}
function hn(t, n) {
  if (J(t) != "object" || !t) return t;
  var o = t[Symbol.toPrimitive];
  if (o !== void 0) {
    var e = o.call(t, n);
    if (J(e) != "object") return e;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var At = {
  name: "Badge",
  extends: gn,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return K(ht(ht({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, vn = ["data-p"];
function fn(t, n, o, e, b, d) {
  return r(), l("span", C({
    class: t.cx("root"),
    "data-p": d.dataP
  }, t.ptmi("root")), [I(t.$slots, "default", {}, function() {
    return [V(c(t.value), 1)];
  })], 16, vn);
}
At.render = fn;
var mn = `
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
function X(t) {
  "@babel/helpers - typeof";
  return X = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, X(t);
}
function A(t, n, o) {
  return (n = yn(n)) in t ? Object.defineProperty(t, n, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = o, t;
}
function yn(t) {
  var n = kn(t, "string");
  return X(n) == "symbol" ? n : n + "";
}
function kn(t, n) {
  if (X(t) != "object" || !t) return t;
  var o = t[Symbol.toPrimitive];
  if (o !== void 0) {
    var e = o.call(t, n);
    if (X(e) != "object") return e;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var wn = {
  root: function(n) {
    var o = n.instance, e = n.props;
    return ["p-button p-component", A(A(A(A(A(A(A(A(A({
      "p-button-icon-only": o.hasIcon && !e.label && !e.badge,
      "p-button-vertical": (e.iconPos === "top" || e.iconPos === "bottom") && e.label,
      "p-button-loading": e.loading,
      "p-button-link": e.link || e.variant === "link"
    }, "p-button-".concat(e.severity), e.severity), "p-button-raised", e.raised), "p-button-rounded", e.rounded), "p-button-text", e.text || e.variant === "text"), "p-button-outlined", e.outlined || e.variant === "outlined"), "p-button-sm", e.size === "small"), "p-button-lg", e.size === "large"), "p-button-plain", e.plain), "p-button-fluid", o.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var o = n.props;
    return ["p-button-icon", A({}, "p-button-icon-".concat(o.iconPos), o.label)];
  },
  label: "p-button-label"
}, $n = at.extend({
  name: "button",
  style: mn,
  classes: wn
}), xn = {
  name: "BaseButton",
  extends: lt,
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
  style: $n,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Y(t) {
  "@babel/helpers - typeof";
  return Y = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Y(t);
}
function x(t, n, o) {
  return (n = Cn(n)) in t ? Object.defineProperty(t, n, { value: o, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = o, t;
}
function Cn(t) {
  var n = Sn(t, "string");
  return Y(n) == "symbol" ? n : n + "";
}
function Sn(t, n) {
  if (Y(t) != "object" || !t) return t;
  var o = t[Symbol.toPrimitive];
  if (o !== void 0) {
    var e = o.call(t, n);
    if (Y(e) != "object") return e;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var tt = {
  name: "Button",
  extends: xn,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(n) {
      var o = n === "root" ? this.ptmi : this.ptm;
      return o(n, {
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
      return C(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return kt(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return K(x(x(x(x(x(x(x(x(x(x({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return K(x(x({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return K(x(x({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Ft,
    Badge: At
  },
  directives: {
    ripple: Xt
  }
}, Pn = ["data-p"], Fn = ["data-p"];
function An(t, n, o, e, b, d) {
  var w = st("SpinnerIcon"), s = st("Badge"), u = _t("ripple");
  return t.asChild ? I(t.$slots, "default", {
    key: 1,
    class: _(t.cx("root")),
    a11yAttrs: d.a11yAttrs
  }) : vt((r(), T(Ut(t.as), C({
    key: 0,
    class: t.cx("root"),
    "data-p": d.dataP
  }, d.attrs), {
    default: M(function() {
      return [I(t.$slots, "default", {}, function() {
        return [t.loading ? I(t.$slots, "loadingicon", C({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (r(), l("span", C({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (r(), T(w, C({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : I(t.$slots, "icon", C({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (r(), l("span", C({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": d.dataIconP
          }, t.ptm("icon")), null, 16, Pn)) : p("", !0)];
        }), t.label ? (r(), l("span", C({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": d.dataLabelP
        }), c(t.label), 17, Fn)) : p("", !0), t.badge ? (r(), T(s, {
          key: 3,
          value: t.badge,
          class: _(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : p("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[u]]);
}
tt.render = An;
const Bn = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, zn = /* @__PURE__ */ W({
  __name: "share-control",
  props: {
    id: {},
    title: {}
  },
  setup(t) {
    const n = t, o = y(!1), e = y(null), b = y("");
    function d() {
      o.value = !1;
    }
    return ot(e, async (w) => {
      if (w) {
        b.value = "";
        try {
          if (customElements.get("kickside-share") || await Pt("kickside-share", { timeoutMs: 8e3 }), e.value !== w) return;
          const s = document.createElement("kickside-share");
          s.setAttribute("config", JSON.stringify({
            resource_id: n.id,
            title: n.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(n.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(n.id)}`
          })), s.style.display = "block", s.addEventListener("close", d), w.appendChild(s);
        } catch (s) {
          b.value = H(s, "Could not open sharing.");
        }
      }
    }), (w, s) => (r(), l(L, null, [
      m("button", {
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: s[0] || (s[0] = (u) => o.value = !0)
      }, [
        S(h(B), { icon: "tabler:share" })
      ]),
      o.value ? (r(), l("div", {
        key: 0,
        ref_key: "shareHost",
        ref: e
      }, null, 512)) : p("", !0),
      b.value ? (r(), l("span", Bn, c(b.value), 1)) : p("", !0)
    ], 64));
  }
}), In = ["aria-label", "aria-busy"], Vn = { class: "ac-dialog-header" }, Tn = ["disabled"], Nn = { class: "ac-dialog-content" }, En = /* @__PURE__ */ W({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(t, { emit: n }) {
    const o = t, e = n, b = y(null);
    function d(s) {
      s.preventDefault(), o.busy || e("close");
    }
    function w(s) {
      const u = b.value;
      if (!u || s.target !== u) return;
      const $ = u.getBoundingClientRect();
      (s.clientX < $.left || s.clientX > $.right || s.clientY < $.top || s.clientY > $.bottom) && d(s);
    }
    return ft(async () => {
      await mt(), b.value && !b.value.open && b.value.showModal();
    }), Mt(() => {
      b.value?.open && b.value.close();
    }), (s, u) => (r(), l("dialog", {
      ref_key: "dialog",
      ref: b,
      class: _(["ac-dialog", { "ac-dialog-wide": t.wide }]),
      "aria-label": t.title,
      "aria-modal": "true",
      "aria-busy": t.busy || void 0,
      onCancel: d,
      onClose: u[1] || (u[1] = ($) => !t.busy && e("close")),
      onClick: w
    }, [
      m("header", Vn, [
        m("h2", null, c(t.title), 1),
        m("button", {
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          "aria-label": "Close dialog",
          disabled: t.busy,
          onClick: u[0] || (u[0] = ($) => e("close"))
        }, "×", 8, Tn)
      ]),
      m("div", Nn, [
        I(s.$slots, "default")
      ])
    ], 42, In));
  }
});
var Ln = {
  name: "BaseEditableHolder",
  extends: lt,
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
        var o, e;
        this.formField = ((o = this.$pcForm) === null || o === void 0 || (e = o.register) === null || e === void 0 ? void 0 : e.call(o, n, this.$formControl)) || {};
      }
    },
    $formControl: {
      immediate: !0,
      handler: function(n) {
        var o, e;
        this.formField = ((o = this.$pcForm) === null || o === void 0 || (e = o.register) === null || e === void 0 ? void 0 : e.call(o, this.$formName, n)) || {};
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
        var o;
        (o = this.$pcForm) !== null && o !== void 0 && o.getFieldState(this.$formName) && n !== this.d_value && (this.d_value = n);
      }
    }
  },
  formField: {},
  methods: {
    writeValue: function(n, o) {
      var e, b;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (e = (b = this.formField).onChange) === null || e === void 0 || e.call(b, {
        originalEvent: o,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, o = new Array(n), e = 0; e < n; e++)
        o[e] = arguments[e];
      return o.find(et);
    }
  },
  computed: {
    $filled: function() {
      return et(this.d_value);
    },
    $invalid: function() {
      var n, o;
      return !this.$formNovalidate && this.findNonEmpty(this.invalid, (n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.invalid, (o = this.$pcForm) === null || o === void 0 || (o = o.getFieldState(this.$formName)) === null || o === void 0 ? void 0 : o.invalid);
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
      var n, o;
      return this.findNonEmpty(this.d_value, (n = this.$pcFormField) === null || n === void 0 ? void 0 : n.initialValue, (o = this.$pcForm) === null || o === void 0 || (o = o.initialValues) === null || o === void 0 ? void 0 : o[this.$formName]);
    },
    $formValue: function() {
      var n, o;
      return this.findNonEmpty((n = this.$pcFormField) === null || n === void 0 || (n = n.$field) === null || n === void 0 ? void 0 : n.value, (o = this.$pcForm) === null || o === void 0 || (o = o.getFieldState(this.$formName)) === null || o === void 0 ? void 0 : o.value);
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
const On = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, jn = ["disabled", "aria-pressed", "onClick"], Rn = ["disabled", "value"], Dn = ["value"], _n = /* @__PURE__ */ W({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (n, o) => t.agents.length <= 6 ? (r(), l("div", On, [
      (r(!0), l(L, null, q(t.agents, (e) => (r(), l("button", {
        key: e.id,
        disabled: t.disabled,
        type: "button",
        class: _(["ac-chip kx-focus-halo", { active: t.modelValue === e.id }]),
        "aria-pressed": t.modelValue === e.id,
        onClick: (b) => n.$emit("update:modelValue", e.id)
      }, [
        S(h(B), {
          icon: h(xt)(e.id, t.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        V(c(e.title), 1)
      ], 10, jn))), 128))
    ])) : (r(), l("select", {
      key: 1,
      disabled: t.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: t.modelValue,
      onChange: o[0] || (o[0] = (e) => n.$emit("update:modelValue", e.target.value))
    }, [
      (r(!0), l(L, null, q(t.agents, (e) => (r(), l("option", {
        key: e.id,
        value: e.id
      }, c(e.title), 9, Dn))), 128))
    ], 40, Rn));
  }
});
var Un = `
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
`, Mn = {
  root: {
    position: "relative"
  }
}, Kn = {
  root: function(n) {
    var o = n.instance, e = n.props;
    return ["p-toggleswitch p-component", {
      "p-toggleswitch-checked": o.checked,
      "p-disabled": e.disabled,
      "p-invalid": o.$invalid
    }];
  },
  input: "p-toggleswitch-input",
  slider: "p-toggleswitch-slider",
  handle: "p-toggleswitch-handle"
}, Hn = at.extend({
  name: "toggleswitch",
  style: Un,
  classes: Kn,
  inlineStyles: Mn
}), qn = {
  name: "BaseToggleSwitch",
  extends: Ln,
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
  style: Hn,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, Bt = {
  name: "ToggleSwitch",
  extends: qn,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur"],
  methods: {
    getPTOptions: function(n) {
      var o = n === "root" ? this.ptmi : this.ptm;
      return o(n, {
        context: {
          checked: this.checked,
          disabled: this.disabled
        }
      });
    },
    onChange: function(n) {
      if (!this.disabled && !this.readonly) {
        var o = this.checked ? this.falseValue : this.trueValue;
        this.writeValue(o, n), this.$emit("change", n);
      }
    },
    onFocus: function(n) {
      this.$emit("focus", n);
    },
    onBlur: function(n) {
      var o, e;
      this.$emit("blur", n), (o = (e = this.formField).onBlur) === null || o === void 0 || o.call(e, n);
    }
  },
  computed: {
    checked: function() {
      return this.d_value === this.trueValue;
    },
    dataP: function() {
      return K({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, Jn = ["data-p-checked", "data-p-disabled", "data-p"], Xn = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], Yn = ["data-p"], Wn = ["data-p"];
function Zn(t, n, o, e, b, d) {
  return r(), l("div", C({
    class: t.cx("root"),
    style: t.sx("root")
  }, d.getPTOptions("root"), {
    "data-p-checked": d.checked,
    "data-p-disabled": t.disabled,
    "data-p": d.dataP
  }), [m("input", C({
    id: t.inputId,
    type: "checkbox",
    role: "switch",
    class: [t.cx("input"), t.inputClass],
    style: t.inputStyle,
    checked: d.checked,
    tabindex: t.tabindex,
    disabled: t.disabled,
    readonly: t.readonly,
    "aria-checked": d.checked,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    "aria-invalid": t.invalid || void 0,
    onFocus: n[0] || (n[0] = function() {
      return d.onFocus && d.onFocus.apply(d, arguments);
    }),
    onBlur: n[1] || (n[1] = function() {
      return d.onBlur && d.onBlur.apply(d, arguments);
    }),
    onChange: n[2] || (n[2] = function() {
      return d.onChange && d.onChange.apply(d, arguments);
    })
  }, d.getPTOptions("input")), null, 16, Xn), m("div", C({
    class: t.cx("slider")
  }, d.getPTOptions("slider"), {
    "data-p": d.dataP
  }), [m("div", C({
    class: t.cx("handle")
  }, d.getPTOptions("handle"), {
    "data-p": d.dataP
  }), [I(t.$slots, "handle", {
    checked: d.checked
  })], 16, Wn)], 16, Yn)], 16, Jn);
}
Bt.render = Zn;
const Gn = { class: "ac-account-main" }, Qn = { class: "ac-row-title" }, to = ["onKeydown"], no = {
  key: 1,
  class: "ac-row-name"
}, oo = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, eo = { class: "ac-muted" }, ro = ["title"], ao = { key: 1 }, lo = {
  key: 0,
  class: "ac-muted"
}, io = {
  key: 1,
  class: "ac-muted ac-strong"
}, uo = {
  key: 2,
  class: "ac-muted"
}, co = {
  key: 3,
  class: "ac-muted ac-mono"
}, so = {
  key: 4,
  class: "ac-muted"
}, bo = {
  key: 5,
  class: "ac-muted"
}, go = {
  key: 6,
  class: "kx-err ac-small"
}, po = { class: "ac-row-actions" }, ho = /* @__PURE__ */ W({
  __name: "account-row",
  props: {
    account: {},
    kindLabel: {},
    ownerLabel: {},
    management: { type: Boolean },
    editCredentials: { type: Boolean, default: !0 }
  },
  emits: ["toggle", "rename", "remove", "edit"],
  setup(t, { emit: n }) {
    const o = t, e = n, b = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, d = Ct(), w = D(() => St(o.account, d.value)), s = D(() => o.account.mine ? "" : o.management ? `Owned by ${o.ownerLabel}` : `Shared with you by ${o.ownerLabel}`), u = y(!1), $ = y(""), Z = y(null);
    function F() {
      $.value = o.account.label, u.value = !0, mt(() => Z.value?.select());
    }
    function G() {
      if (!u.value) return;
      u.value = !1;
      const P = $.value.trim();
      P && P !== o.account.label && e("rename", P);
    }
    return (P, k) => (r(), l("li", {
      class: _(["ac-row ac-account", { "ac-hover-actions": !t.management, off: !t.account.enabled || !t.account.usable }])
    }, [
      m("div", Gn, [
        m("div", Qn, [
          m("span", {
            class: _(["kx-tag-sm ac-tone", w.value])
          }, c(b[w.value]), 3),
          u.value ? vt((r(), l("input", {
            key: 0,
            ref_key: "input",
            ref: Z,
            "onUpdate:modelValue": k[0] || (k[0] = (f) => $.value = f),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              bt(gt(G, ["prevent"]), ["enter"]),
              k[1] || (k[1] = bt(gt((f) => u.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: G
          }, null, 40, to)), [
            [Kt, $.value]
          ]) : (r(), l("span", no, c(t.account.label), 1)),
          t.account.subscription ? (r(), l("span", oo, c(t.management ? "subscription" : "personal"), 1)) : p("", !0)
        ]),
        m("div", eo, [
          V(c(t.kindLabel) + " · " + c(t.account.runs_day) + " " + c(t.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + c(t.account.failures_day) + " " + c(t.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          t.account.last_used_at ? (r(), l("span", {
            key: 0,
            title: h(pt)(t.account.last_used_at)
          }, "last used " + c(h(Yt)(t.account.last_used_at, h(d))), 9, ro)) : (r(), l("span", ao, "never used"))
        ]),
        s.value ? (r(), l("div", lo, c(s.value), 1)) : p("", !0),
        t.account.usable ? t.account.subscription && !t.management ? (r(), l("div", uo, "Subscription login: personal use only")) : p("", !0) : (r(), l("div", io, [
          S(h(B), { icon: "tabler:lock" }),
          V(" " + c(t.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        t.account.endpoint ? (r(), l("div", co, c(t.account.endpoint.protocol) + " · " + c(t.account.endpoint.base_url) + c(t.account.endpoint.model ? " · " + t.account.endpoint.model : ""), 1)) : p("", !0),
        w.value === "cooling" && t.account.cooldown_until ? (r(), l("div", so, "Available at " + c(h(pt)(t.account.cooldown_until)), 1)) : p("", !0),
        (r(!0), l(L, null, q(t.account.rate_limits?.windows ?? [], (f) => (r(), l("div", {
          key: f.window,
          class: "ac-muted"
        }, [
          V(c(f.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + c(f.utilization === void 0 ? f.status : `${Math.round(f.utilization * 100)}% used`), 1),
          f.resets_at ? (r(), l(L, { key: 0 }, [
            V(", resets " + c(new Date(f.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : p("", !0)
        ]))), 128)),
        t.account.rate_limits?.overage_status ? (r(), l("div", bo, "Overage: " + c(t.account.rate_limits.overage_status) + c(t.account.rate_limits.overage_disabled_reason ? " · " + t.account.rate_limits.overage_disabled_reason : ""), 1)) : p("", !0),
        t.account.last_error ? (r(), l("div", go, c(t.account.last_error), 1)) : p("", !0)
      ]),
      m("div", po, [
        t.management && t.account.writable ? (r(), T(h(tt), {
          key: 0,
          type: "button",
          text: "",
          size: "small",
          severity: "secondary",
          label: t.account.enabled ? "Disable" : "Enable",
          "aria-label": t.account.enabled ? "Disable account" : "Enable account",
          onClick: k[2] || (k[2] = (f) => e("toggle"))
        }, null, 8, ["label", "aria-label"])) : t.account.writable ? (r(), T(h(Bt), {
          key: 1,
          "model-value": t.account.enabled,
          "aria-label": t.account.enabled ? "Disable account" : "Enable account",
          onChange: k[3] || (k[3] = (f) => e("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : p("", !0),
        t.account.writable ? (r(), l("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: F
        }, [
          S(h(B), { icon: "tabler:pencil" })
        ])) : p("", !0),
        t.account.writable && t.editCredentials ? (r(), l("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: k[4] || (k[4] = (f) => e("edit"))
        }, [
          S(h(B), { icon: "tabler:key" })
        ])) : p("", !0),
        I(P.$slots, "actions"),
        t.account.deletable ? (r(), l("button", {
          key: 4,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: k[5] || (k[5] = (f) => e("remove"))
        }, [
          S(h(B), { icon: "tabler:trash" })
        ])) : p("", !0)
      ])
    ], 2));
  }
}), vo = { class: "ac-stack" }, fo = {
  key: 0,
  class: "kx-err inline"
}, mo = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, yo = {
  key: 2,
  class: "kx-loading"
}, ko = {
  key: 3,
  class: "ac-card-head ac-provider-actions"
}, wo = {
  key: 0,
  class: "ac-hint"
}, $o = {
  key: 4,
  class: "kx-empty"
}, xo = { class: "kx-empty-ico" }, Co = {
  key: 5,
  class: "kx-empty"
}, So = {
  key: 0,
  class: "ac-card-head"
}, Po = { class: "ac-card-title" }, Fo = { class: "ac-muted" }, Ao = { class: "ac-account-grid" }, Bo = { class: "ac-form" }, zo = {
  key: 1,
  class: "ac-hint"
}, Io = ["^config"], Vo = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, Do = /* @__PURE__ */ W({
  __name: "accounts",
  props: {
    query: {},
    selectedAgent: {},
    management: { type: Boolean },
    providerId: {},
    allowSetup: { type: Boolean, default: !0 }
  },
  emits: ["count", "changed"],
  setup(t, { expose: n, emit: o }) {
    const e = wt(), b = y([]), d = t, w = o, s = y(!1), u = y(null);
    function $() {
      u.value = null, R.value = "", s.value = !0;
    }
    function Z(a) {
      u.value = a, N.value = a.agent, R.value = "", s.value = !0;
    }
    n({ open: $ });
    const F = on(), G = Ct(), P = y([]), k = y({}), f = y(""), U = y(""), O = y(!1), j = y(!1), R = y(""), dt = y(0), N = y(d.selectedAgent || F.value.agents[0]?.id || "");
    ot(() => d.selectedAgent, (a) => {
      a && (N.value = a);
    });
    const nt = D(() => F.value.agents.find((a) => a.id === N.value)), zt = D(() => JSON.stringify({ driver: nt.value, busy: j.value, error: R.value, saved: dt.value, account: u.value ? { id: u.value.id, label: u.value.label, credential_kind: u.value.credential_kind, endpoint: u.value.endpoint } : void 0, limits: F.value.account_limits })), it = D(() => [...F.value.agents, ...[...new Set(P.value.map((a) => a.agent))].filter((a) => !F.value.agents.some((i) => i.id === a)).map((a) => ({ id: a, title: `Unavailable agent: ${a}`, icon: "tabler:terminal-2" }))].map((a) => ({ agent: a, accounts: P.value.filter((i) => i.agent === a.id && [i.label, a.title, i.credential_kind].join(" ").toLowerCase().includes(d.query.toLowerCase())) })).filter((a) => a.accounts.length));
    function It(a) {
      return F.value.agents.find((i) => i.id === a.agent)?.credentials.find((i) => i.id === a.credential_kind)?.label ?? a.credential_kind;
    }
    async function Vt(a) {
      const i = [...new Set(a.filter((g) => !g.mine).map((g) => g.owner_user_id))].filter((g) => !(g in k.value)), v = await Qt(i);
      e() && (k.value = { ...k.value, ...v });
    }
    async function Tt() {
      if (!d.management) return E.accounts();
      const a = d.providerId ? { provider_id: d.providerId } : { agent: d.selectedAgent }, i = await E.managedAccounts(a);
      return e() && i.agent && (N.value = i.agent), i.accounts;
    }
    const z = $t(async () => {
      try {
        const a = await Gt(Tt, (i) => i.map((v) => v.id), b, e, (i) => {
          P.value = i, O.value = !0, f.value = "";
        }, () => {
          z();
        });
        if (!e() || (await Vt(a), !e())) return;
        O.value = !0, f.value = "";
      } catch (a) {
        e() && (f.value = H(a, "Could not load accounts."));
      }
    }, e);
    Wt(() => b.value, () => {
      z();
    });
    const Nt = Zt.runs(() => {
      z();
    });
    Ht(Nt), yt(z);
    async function ut(a, i) {
      f.value = "", U.value = "";
      try {
        if (await a(), !e()) return;
        await z(), e() && w("changed");
      } catch (v) {
        e() && (f.value = H(v, i));
      }
    }
    async function Et(a) {
      if (!(a instanceof CustomEvent)) return;
      const i = nn.safeParse(a.detail);
      if (j.value) return;
      if (!i.success || i.data.agent !== N.value || u.value && (!u.value.writable || i.data.credential_kind !== u.value.credential_kind)) {
        R.value = "Invalid account submission.";
        return;
      }
      const v = i.data;
      R.value = "", j.value = !0;
      try {
        if (u.value) {
          const g = await E.updateAccount(u.value.id, {
            label: v.label,
            endpoint: v.endpoint ?? { base_url: "" },
            ...v.secret ? { secret: v.secret } : {}
          });
          if (!e()) return;
          U.value = g.health_error ? `Account saved, but its health could not be refreshed: ${g.health_error.message}` : "";
        } else await E.createAccount(v);
        if (!e()) return;
        dt.value++, s.value = !1, await z(), e() && w("changed");
      } catch (g) {
        e() && (R.value = H(g, "Could not save the account."));
      } finally {
        e() && (j.value = !1);
      }
    }
    ot(P, (a) => w("count", a.length));
    const ct = (a, i, v) => ut(async () => {
      const g = await E.updateAccount(a.id, i);
      e() && g.health_error && (U.value = `Account saved, but its health could not be refreshed: ${g.health_error.message}`);
    }, v), Lt = (a) => ct(a, { enabled: !a.enabled }, "Could not update the account."), Ot = (a, i) => ct(a, { label: i }, "Could not rename the account.");
    async function jt(a) {
      const i = await tn.confirm({
        header: "Delete account",
        message: `Delete account "${a.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      e() && i && await ut(() => E.deleteAccount(a.id), "Could not delete the account.");
    }
    return ft(() => {
      d.allowSetup && Pt("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        e() && (f.value = "The driver account card could not load.");
      });
    }), (a, i) => (r(), l("div", vo, [
      f.value ? (r(), l("p", fo, [
        V(c(f.value) + " ", 1),
        m("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: i[0] || (i[0] = //@ts-ignore
          (...v) => h(z) && h(z)(...v))
        }, "Retry")
      ])) : p("", !0),
      U.value ? (r(), l("p", mo, c(U.value), 1)) : p("", !0),
      !O.value && !f.value ? (r(), l("div", yo, "Loading accounts…")) : p("", !0),
      t.management && O.value && t.allowSetup ? (r(), l("div", ko, [
        P.value.length ? p("", !0) : (r(), l("p", wo, "No accounts configured.")),
        S(h(tt), {
          label: "Add account",
          disabled: !nt.value,
          onClick: $
        }, {
          icon: M(() => [
            S(h(B), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ])) : p("", !0),
      !t.management && O.value && !P.value.length ? (r(), l("div", $o, [
        m("div", xo, [
          S(h(B), { icon: "tabler:key" })
        ]),
        i[3] || (i[3] = m("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        i[4] || (i[4] = m("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        S(h(tt), {
          label: "Add account",
          onClick: $
        }, {
          icon: M(() => [
            S(h(B), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : !t.management && O.value && !it.value.length ? (r(), l("div", Co, [...i[5] || (i[5] = [
        m("div", { class: "kx-empty-title" }, "No matches", -1),
        m("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : p("", !0),
      (r(!0), l(L, null, q(it.value, (v) => (r(), l("section", {
        key: v.agent.id,
        class: "ac-stack"
      }, [
        t.management ? p("", !0) : (r(), l("div", So, [
          m("h2", Po, [
            S(h(B), {
              icon: h(xt)(v.agent.id, h(F).agents)
            }, null, 8, ["icon"]),
            V(c(v.agent.title), 1)
          ]),
          m("span", Fo, c(v.accounts.filter((g) => g.usable && h(St)(g, h(G)) === "ready").length) + " of " + c(v.accounts.length) + " ready", 1)
        ])),
        m("ul", Ao, [
          (r(!0), l(L, null, q(v.accounts, (g) => (r(), T(ho, {
            key: g.id,
            account: g,
            "kind-label": It(g),
            "owner-label": k.value[g.owner_user_id] || g.owner_user_id,
            management: t.management,
            "edit-credentials": t.allowSetup,
            onEdit: (Q) => Z(g),
            onToggle: (Q) => Lt(g),
            onRename: (Q) => Ot(g, Q),
            onRemove: (Q) => jt(g)
          }, qt({ _: 2 }, [
            t.management && g.shareable ? {
              name: "actions",
              fn: M(() => [
                S(zn, {
                  id: g.id,
                  title: g.label
                }, null, 8, ["id", "title"])
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["account", "kind-label", "owner-label", "management", "edit-credentials", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      s.value ? (r(), T(En, {
        key: 6,
        title: u.value ? "Edit account" : "Add account",
        busy: j.value,
        onClose: i[2] || (i[2] = (v) => s.value = !1)
      }, {
        default: M(() => [
          m("div", Bo, [
            !u.value && !t.management ? (r(), T(_n, {
              key: 0,
              disabled: j.value,
              modelValue: N.value,
              "onUpdate:modelValue": i[1] || (i[1] = (v) => N.value = v),
              agents: h(F).agents
            }, null, 8, ["disabled", "modelValue", "agents"])) : p("", !0),
            !u.value && !t.management ? (r(), l("p", zo, "Tasks balance across your ready accounts automatically.")) : p("", !0),
            nt.value ? (r(), l("chestor-autocode-driver-account", {
              key: 2,
              "^config": zt.value,
              onSubmit: Et
            }, null, 40, Io)) : (r(), l("p", Vo, "This account’s agent is unavailable."))
          ])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : p("", !0)
    ]));
  }
});
export {
  zn as _,
  En as a,
  tt as b,
  Do as c,
  Ro as d,
  _n as e,
  Ln as s,
  on as u
};
