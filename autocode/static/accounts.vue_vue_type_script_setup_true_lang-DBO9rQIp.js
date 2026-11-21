import { openBlock as a, createElementBlock as i, mergeProps as f, createElementVNode as p, ref as k, provide as bn, inject as gn, computed as _, renderSlot as x, createTextVNode as I, toDisplayString as d, resolveComponent as pt, resolveDirective as jt, withDirectives as bt, createBlock as P, resolveDynamicComponent as et, withCtx as R, createCommentVNode as c, normalizeClass as D, defineComponent as W, watch as ht, Fragment as j, createVNode as $, unref as b, onMounted as Et, nextTick as Lt, onBeforeUnmount as pn, renderList as Y, withKeys as ct, withModifiers as ut, vModelText as zt, Transition as hn, h as mn, onUnmounted as fn, createSlots as vn } from "vue";
import { b as Z, d as mt, s as Nt, i as Vt, B as J, n as _t, f as K, c as Rt, o as yn } from "./wc-runtime-DgMRDxeK.js";
import { c as Dt, s as Mt, a as U, e as tt, f as wt, b as Ut, d as Kt, g as It, h as kn, u as wn, l as $n, r as xn, p as Cn } from "./presentation-Bq-Cf4TV.js";
import { Icon as T } from "@iconify/vue";
import { loadByTagName as Ht, host as Sn } from "@wippy-fe/proxy";
import { a as Pn } from "./driver-account-types-CH0REEbr.js";
var An = {
  name: "BaseEditableHolder",
  extends: Z,
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
      var o, g;
      this.controlled && (this.d_value = n, this.$emit("update:modelValue", n)), this.$emit("value-change", n), (o = (g = this.formField).onChange) === null || o === void 0 || o.call(g, {
        originalEvent: e,
        value: n
      });
    },
    // @todo move to @primeuix/utils
    findNonEmpty: function() {
      for (var n = arguments.length, e = new Array(n), o = 0; o < n; o++)
        e[o] = arguments[o];
      return e.find(mt);
    }
  },
  computed: {
    $filled: function() {
      return mt(this.d_value);
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
}, Wt = {
  name: "SpinnerIcon",
  extends: Nt
};
function zn(t) {
  return On(t) || Tn(t) || Bn(t) || In();
}
function In() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Bn(t, n) {
  if (t) {
    if (typeof t == "string") return ft(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? ft(t, n) : void 0;
  }
}
function Tn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function On(t) {
  if (Array.isArray(t)) return ft(t);
}
function ft(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Fn(t, n, e, o, g, r) {
  return a(), i("svg", f({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), zn(n[0] || (n[0] = [p("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Wt.render = Fn;
function fa() {
  const t = Dt(), n = k(null), e = k(""), o = Mt(async () => {
    try {
      const g = await U.catalog();
      if (!t()) return;
      n.value = g, e.value = "";
    } catch (g) {
      if (!t()) return;
      e.value = tt(g, "Could not load the agent catalog.");
    }
  }, t);
  return bn("catalog", n), Vt(o), { catalog: n, error: e, load: o };
}
function jn() {
  const t = gn("catalog");
  if (!t) throw new Error("Autocode catalog provider is missing.");
  return _(() => {
    if (!t.value) throw new Error("Autocode catalog is not loaded.");
    return t.value;
  });
}
var En = `
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
`, Ln = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": mt(e.value) && String(e.value).length === 1,
      "p-badge-dot": _t(e.value) && !o.$slots.default,
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
}, Nn = J.extend({
  name: "badge",
  style: En,
  classes: Ln
}), Vn = {
  name: "BaseBadge",
  extends: Z,
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
  style: Nn,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function ot(t) {
  "@babel/helpers - typeof";
  return ot = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, ot(t);
}
function Bt(t, n, e) {
  return (n = _n(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function _n(t) {
  var n = Rn(t, "string");
  return ot(n) == "symbol" ? n : n + "";
}
function Rn(t, n) {
  if (ot(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (ot(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Gt = {
  name: "Badge",
  extends: Vn,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return K(Bt(Bt({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Dn = ["data-p"];
function Mn(t, n, e, o, g, r) {
  return a(), i("span", f({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [x(t.$slots, "default", {}, function() {
    return [I(d(t.value), 1)];
  })], 16, Dn);
}
Gt.render = Mn;
var Un = `
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
function at(t) {
  "@babel/helpers - typeof";
  return at = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, at(t);
}
function N(t, n, e) {
  return (n = Kn(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Kn(t) {
  var n = Hn(t, "string");
  return at(n) == "symbol" ? n : n + "";
}
function Hn(t, n) {
  if (at(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (at(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Wn = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", N(N(N(N(N(N(N(N(N({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", N({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, Gn = J.extend({
  name: "button",
  style: Un,
  classes: Wn
}), qn = {
  name: "BaseButton",
  extends: Z,
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
  style: Gn,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function rt(t) {
  "@babel/helpers - typeof";
  return rt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, rt(t);
}
function z(t, n, e) {
  return (n = Xn(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Xn(t) {
  var n = Yn(t, "string");
  return rt(n) == "symbol" ? n : n + "";
}
function Yn(t, n) {
  if (rt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (rt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var nt = {
  name: "Button",
  extends: qn,
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
      return f(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return _t(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return K(z(z(z(z(z(z(z(z(z(z({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return K(z(z({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return K(z(z({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Wt,
    Badge: Gt
  },
  directives: {
    ripple: Rt
  }
}, Zn = ["data-p"], Jn = ["data-p"];
function Qn(t, n, e, o, g, r) {
  var C = pt("SpinnerIcon"), m = pt("Badge"), u = jt("ripple");
  return t.asChild ? x(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : bt((a(), P(et(t.as), f({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: R(function() {
      return [x(t.$slots, "default", {}, function() {
        return [t.loading ? x(t.$slots, "loadingicon", f({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), i("span", f({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), P(C, f({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : x(t.$slots, "icon", f({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), i("span", f({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Zn)) : c("", !0)];
        }), t.label ? (a(), i("span", f({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), d(t.label), 17, Jn)) : c("", !0), t.badge ? (a(), P(m, {
          key: 3,
          value: t.badge,
          class: D(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : c("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[u]]);
}
nt.render = Qn;
const te = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ne = /* @__PURE__ */ W({
  __name: "share-control",
  props: {
    id: {},
    title: {},
    hideButton: { type: Boolean }
  },
  setup(t, { expose: n }) {
    const e = t, o = k(!1), g = k(null), r = k("");
    function C() {
      o.value = !1;
    }
    return n({ show: () => {
      o.value = !0;
    } }), ht(g, async (m) => {
      if (m) {
        r.value = "";
        try {
          if (customElements.get("kickside-share") || await Ht("kickside-share", { timeoutMs: 8e3 }), g.value !== m) return;
          const u = document.createElement("kickside-share");
          u.setAttribute("config", JSON.stringify({
            resource_id: e.id,
            title: e.title,
            access_url: `/api/v1/component-access/grants/${encodeURIComponent(e.id)}`,
            share_url: `/api/v1/component-access/share/${encodeURIComponent(e.id)}`
          })), u.style.display = "block", u.addEventListener("close", C), m.appendChild(u);
        } catch (u) {
          r.value = tt(u, "Could not open sharing.");
        }
      }
    }), (m, u) => (a(), i(j, null, [
      t.hideButton ? c("", !0) : (a(), i("button", {
        key: 0,
        type: "button",
        class: "ac-icon-btn kx-focus-outline",
        title: "Share",
        "aria-label": "Share",
        onClick: u[0] || (u[0] = (A) => o.value = !0)
      }, [
        $(b(T), { icon: "tabler:share" })
      ])),
      o.value ? (a(), i("div", {
        key: 1,
        ref_key: "shareHost",
        ref: g
      }, null, 512)) : c("", !0),
      r.value ? (a(), i("span", te, d(r.value), 1)) : c("", !0)
    ], 64));
  }
}), ee = ["aria-label", "aria-busy"], oe = { class: "ac-dialog-header" }, ae = {
  key: 0,
  class: "kx-modal-head-icon"
}, re = ["disabled"], ie = { class: "ac-dialog-content" }, se = /* @__PURE__ */ W({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean },
    busy: { type: Boolean },
    icon: {}
  },
  emits: ["close"],
  setup(t, { emit: n }) {
    const e = t, o = n, g = k(null);
    function r(m) {
      m.preventDefault(), e.busy || o("close");
    }
    function C(m) {
      const u = g.value;
      if (!u || m.target !== u) return;
      const A = u.getBoundingClientRect();
      (m.clientX < A.left || m.clientX > A.right || m.clientY < A.top || m.clientY > A.bottom) && r(m);
    }
    return Et(async () => {
      await Lt(), g.value && !g.value.open && g.value.showModal();
    }), pn(() => {
      g.value?.open && g.value.close();
    }), (m, u) => (a(), i("dialog", {
      ref_key: "dialog",
      ref: g,
      class: D(["ac-dialog", { "ac-dialog-wide": t.wide }]),
      "aria-label": t.title,
      "aria-modal": "true",
      "aria-busy": t.busy || void 0,
      onCancel: r,
      onClose: u[1] || (u[1] = (A) => !t.busy && o("close")),
      onClick: C
    }, [
      p("header", oe, [
        t.icon ? (a(), i("span", ae, [
          $(b(T), {
            icon: t.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ])) : c("", !0),
        p("h2", {
          class: D({ "kx-modal-head-title": t.icon })
        }, d(t.title), 3),
        p("button", {
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          "aria-label": "Close dialog",
          disabled: t.busy,
          onClick: u[0] || (u[0] = (A) => o("close"))
        }, "×", 8, re)
      ]),
      p("div", ie, [
        x(m.$slots, "default")
      ])
    ], 42, ee));
  }
});
var qt = {
  name: "TimesIcon",
  extends: Nt
};
function le(t) {
  return be(t) || ue(t) || ce(t) || de();
}
function de() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ce(t, n) {
  if (t) {
    if (typeof t == "string") return vt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? vt(t, n) : void 0;
  }
}
function ue(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function be(t) {
  if (Array.isArray(t)) return vt(t);
}
function vt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function ge(t, n, e, o, g, r) {
  return a(), i("svg", f({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), le(n[0] || (n[0] = [p("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
qt.render = ge;
const pe = new Intl.DateTimeFormat(void 0, { weekday: "short", hour: "numeric", minute: "2-digit" }), he = {
  five_hour: "5-hour limit",
  seven_day: "Weekly limit",
  seven_day_sonnet: "Weekly Sonnet limit",
  seven_day_opus: "Weekly Opus limit"
}, yt = (t) => he[t] ?? "Usage limit", kt = (t) => pe.format(t);
function me(t, n) {
  const e = wt(t, n);
  if (e === "disabled") return { state: e, label: "Disabled", help: "Enable this account to run tasks with it." };
  if (e === "unavailable")
    return { state: e, label: "Needs attention", help: "Check that the provider is installed and that you have access to this account." };
  const o = t.rate_limits?.windows.find((r) => r.status === "rejected" && r.resets_at && r.resets_at * 1e3 > n);
  if (o?.resets_at) return { state: "cooling", label: `${yt(o.window)} reached, resets ${kt(o.resets_at * 1e3)}`, help: "Use another account or wait for the reset." };
  if (e === "cooling") {
    const r = Date.parse(t.cooldown_until);
    return { state: e, label: `Limited until ${kt(r)}`, help: "Use another account or wait for the reset." };
  }
  const g = t.last_error.match(/^([a-z][a-z0-9_]+)(?=:|$)/)?.[1];
  return g === "rate_limit" ? { state: e, label: "Ready", help: "The last task hit a rate limit. Try again or use another account.", code: g } : t.last_error ? { state: "failed", label: "Needs attention", help: "The last task reported an account error. Check the credential and reconnect if needed.", code: g } : { state: e, label: "Ready", help: "" };
}
const fe = {
  codex: { name: "Codex", hint: "ChatGPT sign-in or an OpenAI API key" },
  claude: { name: "Claude Code", hint: "Claude subscription token" },
  agy: { name: "Antigravity", hint: "Google Antigravity login or Gemini API key" },
  grok: { name: "Grok", hint: "xAI API key" },
  muse: { name: "Muse", hint: "Meta API key or Muse login file" },
  opencode: { name: "OpenCode", hint: "API key or an OpenCode login file" },
  pi: { name: "Pi", hint: "API key or a Pi login file" }
};
function ve(t, n) {
  return fe[t] ?? { name: n, hint: "Provider credential" };
}
const ye = {
  key: 0,
  class: "ac-chips",
  role: "group",
  "aria-label": "Agent"
}, ke = ["disabled", "aria-pressed", "onClick"], we = ["disabled", "value"], $e = ["value"], xe = /* @__PURE__ */ W({
  __name: "agent-picker",
  props: {
    agents: {},
    modelValue: {},
    disabled: { type: Boolean }
  },
  emits: ["update:modelValue"],
  setup(t) {
    return (n, e) => t.agents.length <= 6 ? (a(), i("div", ye, [
      (a(!0), i(j, null, Y(t.agents, (o) => (a(), i("button", {
        key: o.id,
        disabled: t.disabled,
        type: "button",
        class: D(["ac-chip kx-focus-halo", { active: t.modelValue === o.id }]),
        "aria-pressed": t.modelValue === o.id,
        onClick: (g) => n.$emit("update:modelValue", o.id)
      }, [
        $(b(T), {
          icon: b(Ut)(o.id, t.agents),
          "aria-hidden": "true"
        }, null, 8, ["icon"]),
        I(d(o.title), 1)
      ], 10, ke))), 128))
    ])) : (a(), i("select", {
      key: 1,
      disabled: t.disabled,
      class: "kx-focus-halo",
      "aria-label": "Agent",
      value: t.modelValue,
      onChange: e[0] || (e[0] = (o) => n.$emit("update:modelValue", o.target.value))
    }, [
      (a(!0), i(j, null, Y(t.agents, (o) => (a(), i("option", {
        key: o.id,
        value: o.id
      }, d(o.title), 9, $e))), 128))
    ], 40, we));
  }
});
var Ce = `
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
`, Se = {
  root: {
    position: "relative"
  }
}, Pe = {
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
}, Ae = J.extend({
  name: "toggleswitch",
  style: Ce,
  classes: Pe,
  inlineStyles: Se
}), ze = {
  name: "BaseToggleSwitch",
  extends: An,
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
  style: Ae,
  provide: function() {
    return {
      $pcToggleSwitch: this,
      $parentInstance: this
    };
  }
}, Xt = {
  name: "ToggleSwitch",
  extends: ze,
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
      return K({
        checked: this.checked,
        disabled: this.disabled,
        invalid: this.$invalid
      });
    }
  }
}, Ie = ["data-p-checked", "data-p-disabled", "data-p"], Be = ["id", "checked", "tabindex", "disabled", "readonly", "aria-checked", "aria-labelledby", "aria-label", "aria-invalid"], Te = ["data-p"], Oe = ["data-p"];
function Fe(t, n, e, o, g, r) {
  return a(), i("div", f({
    class: t.cx("root"),
    style: t.sx("root")
  }, r.getPTOptions("root"), {
    "data-p-checked": r.checked,
    "data-p-disabled": t.disabled,
    "data-p": r.dataP
  }), [p("input", f({
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
  }, r.getPTOptions("input")), null, 16, Be), p("div", f({
    class: t.cx("slider")
  }, r.getPTOptions("slider"), {
    "data-p": r.dataP
  }), [p("div", f({
    class: t.cx("handle")
  }, r.getPTOptions("handle"), {
    "data-p": r.dataP
  }), [x(t.$slots, "handle", {
    checked: r.checked
  })], 16, Oe)], 16, Te)], 16, Ie);
}
Xt.render = Fe;
var je = `
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
`, Ee = {
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
}, Le = J.extend({
  name: "tag",
  style: je,
  classes: Ee
}), Ne = {
  name: "BaseTag",
  extends: Z,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: Le,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function it(t) {
  "@babel/helpers - typeof";
  return it = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, it(t);
}
function Ve(t, n, e) {
  return (n = _e(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function _e(t) {
  var n = Re(t, "string");
  return it(n) == "symbol" ? n : n + "";
}
function Re(t, n) {
  if (it(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (it(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Yt = {
  name: "Tag",
  extends: Ne,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return K(Ve({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, De = ["data-p"];
function Me(t, n, e, o, g, r) {
  return a(), i("span", f({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), P(et(t.$slots.icon), f({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), i("span", f({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : c("", !0), t.value != null || t.$slots.default ? x(t.$slots, "default", {
    key: 2
  }, function() {
    return [p("span", f({
      class: t.cx("label")
    }, t.ptm("label")), d(t.value), 17)];
  }) : c("", !0)], 16, De);
}
Yt.render = Me;
var Ue = `
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
`, Ke = {
  root: function(n) {
    var e = n.instance;
    return ["p-progressbar p-component", {
      "p-progressbar-determinate": e.determinate,
      "p-progressbar-indeterminate": e.indeterminate
    }];
  },
  value: "p-progressbar-value",
  label: "p-progressbar-label"
}, He = J.extend({
  name: "progressbar",
  style: Ue,
  classes: Ke
}), We = {
  name: "BaseProgressBar",
  extends: Z,
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
  style: He,
  provide: function() {
    return {
      $pcProgressBar: this,
      $parentInstance: this
    };
  }
}, Zt = {
  name: "ProgressBar",
  extends: We,
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
      return K({
        determinate: this.determinate,
        indeterminate: this.indeterminate
      });
    }
  }
}, Ge = ["aria-valuenow", "data-p"], qe = ["data-p"], Xe = ["data-p"], Ye = ["data-p"];
function Ze(t, n, e, o, g, r) {
  return a(), i("div", f({
    role: "progressbar",
    class: t.cx("root"),
    "aria-valuemin": "0",
    "aria-valuenow": t.value,
    "aria-valuemax": "100",
    "data-p": r.dataP
  }, t.ptmi("root")), [r.determinate ? (a(), i("div", f({
    key: 0,
    class: t.cx("value"),
    style: r.progressStyle,
    "data-p": r.dataP
  }, t.ptm("value")), [t.value != null && t.value !== 0 && t.showValue ? (a(), i("div", f({
    key: 0,
    class: t.cx("label"),
    "data-p": r.dataP
  }, t.ptm("label")), [x(t.$slots, "default", {}, function() {
    return [I(d(t.value + "%"), 1)];
  })], 16, Xe)) : c("", !0)], 16, qe)) : r.indeterminate ? (a(), i("div", f({
    key: 1,
    class: t.cx("value"),
    "data-p": r.dataP
  }, t.ptm("value")), null, 16, Ye)) : c("", !0)], 16, Ge);
}
Zt.render = Ze;
const Je = {
  key: 0,
  class: "ac-usage-list"
}, Qe = { class: "ac-usage-label" }, to = {
  key: 0,
  class: "ac-muted"
}, no = {
  key: 1,
  class: "ac-muted"
}, eo = /* @__PURE__ */ W({
  __name: "account-usage",
  props: {
    account: {}
  },
  setup(t) {
    return (n, e) => t.account.rate_limits?.windows.length ? (a(), i("div", Je, [
      (a(!0), i(j, null, Y(t.account.rate_limits.windows, (o) => (a(), i("div", {
        key: o.window,
        class: "ac-usage-window"
      }, [
        p("div", Qe, [
          p("span", null, d(b(yt)(o.window)), 1),
          o.resets_at ? (a(), i("span", to, "Resets " + d(b(kt)(o.resets_at * 1e3)), 1)) : c("", !0)
        ]),
        o.utilization !== void 0 || o.status === "rejected" ? (a(), P(b(Zt), {
          key: 0,
          value: o.utilization === void 0 ? 100 : Math.max(0, Math.min(100, Math.round(o.utilization * 100))),
          "show-value": !1,
          "aria-label": b(yt)(o.window),
          class: D(["ac-usage-meter", { "ac-usage-limited": o.status !== "allowed" }])
        }, null, 8, ["value", "aria-label", "class"])) : (a(), i("small", no, d(o.status === "warning" ? "Approaching the limit." : "Within the limit."), 1))
      ]))), 128))
    ])) : c("", !0);
  }
}), oo = {
  key: 0,
  class: "ac-row ac-account ac-managed-account"
}, ao = { class: "ac-account-main" }, ro = { class: "ac-row-title" }, io = ["onKeydown"], so = {
  key: 1,
  class: "ac-row-name"
}, lo = { class: "ac-account-summary" }, co = { class: "ac-muted" }, uo = {
  key: 0,
  class: "ac-hint"
}, bo = {
  key: 1,
  class: "ac-hint"
}, go = { class: "ac-muted" }, po = {
  key: 2,
  class: "ac-account-details"
}, ho = {
  key: 0,
  class: "ac-account-menu"
}, mo = { class: "ac-account-main" }, fo = { class: "ac-row-title" }, vo = ["onKeydown"], yo = {
  key: 1,
  class: "ac-row-name"
}, ko = {
  key: 2,
  class: "kx-tag-sm ac-tone"
}, wo = { class: "ac-muted" }, $o = ["title"], xo = { key: 1 }, Co = {
  key: 0,
  class: "ac-muted"
}, So = {
  key: 1,
  class: "ac-muted ac-strong"
}, Po = {
  key: 2,
  class: "ac-muted"
}, Ao = {
  key: 3,
  class: "ac-muted ac-mono"
}, zo = {
  key: 4,
  class: "ac-muted"
}, Io = {
  key: 5,
  class: "ac-muted"
}, Bo = {
  key: 6,
  class: "kx-err ac-small"
}, To = { class: "ac-row-actions" }, Oo = /* @__PURE__ */ W({
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
    const e = t, o = n, g = { ready: "ready", cooling: "cooling down", disabled: "disabled", unavailable: "unavailable" }, r = Kt(), C = _(() => wt(e.account, r.value)), m = _(() => me(e.account, r.value)), u = _(() => ({ ready: "success", cooling: "warn", disabled: "secondary", unavailable: "warn", failed: "danger" })[m.value.state]), A = k(), dt = k(), O = _(() => [
      ...e.account.writable ? [
        { label: "Rename", icon: "tabler:pencil", command: M },
        ...e.editCredentials ? [{ label: e.nativeReconnect ? "Reconnect" : "Edit credential", icon: "tabler:key", command: () => o("edit") }] : [],
        { label: e.account.enabled ? "Disable" : "Enable", icon: "tabler:power", command: () => o("toggle") }
      ] : [],
      ...e.account.shareable ? [{ label: "Share", icon: "tabler:share", command: () => dt.value?.show() }] : [],
      ...e.account.deletable ? [{ label: "Delete", icon: "tabler:trash", command: () => o("remove") }] : []
    ]), G = _(() => e.account.mine ? "" : e.management ? `Owned by ${e.ownerLabel}` : `Shared with you by ${e.ownerLabel}`), S = k(!1), E = k(""), B = k(null);
    function M() {
      E.value = e.account.label, S.value = !0, Lt(() => B.value?.select());
    }
    function L() {
      if (!S.value) return;
      S.value = !1;
      const F = E.value.trim();
      F && F !== e.account.label && o("rename", F);
    }
    return (F, w) => t.management ? (a(), i("li", oo, [
      p("div", ao, [
        p("div", ro, [
          S.value ? bt((a(), i("input", {
            key: 0,
            ref_key: "input",
            ref: B,
            "onUpdate:modelValue": w[0] || (w[0] = (y) => E.value = y),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              ct(ut(L, ["prevent"]), ["enter"]),
              w[1] || (w[1] = ct(ut((y) => S.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: L
          }, null, 40, io)), [
            [zt, E.value]
          ]) : (a(), i("span", so, d(t.account.label), 1))
        ]),
        p("div", lo, [
          $(b(Yt), {
            severity: u.value,
            value: m.value.label
          }, null, 8, ["severity", "value"]),
          p("span", co, [
            I(d(t.kindLabel), 1),
            G.value ? (a(), i(j, { key: 0 }, [
              I(" · " + d(G.value), 1)
            ], 64)) : c("", !0)
          ])
        ]),
        m.value.help ? (a(), i("p", uo, d(m.value.help), 1)) : c("", !0),
        t.account.subscription ? (a(), i("p", bo, "A subscription login runs tasks for its owner.")) : c("", !0),
        x(F.$slots, "usage", { account: t.account }, () => [
          $(eo, { account: t.account }, null, 8, ["account"])
        ]),
        p("span", go, [
          I(d(t.account.runs_day) + " " + d(t.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours", 1),
          t.account.failures_day ? (a(), i(j, { key: 0 }, [
            I(" · " + d(t.account.failures_day) + " failed", 1)
          ], 64)) : c("", !0)
        ]),
        m.value.code ? (a(), i("details", po, [
          w[8] || (w[8] = p("summary", { class: "kx-focus-outline" }, "Technical details", -1)),
          p("code", null, d(m.value.code), 1)
        ])) : c("", !0)
      ]),
      O.value.length ? (a(), i("div", ho, [
        $(b(nt), {
          type: "button",
          text: "",
          rounded: "",
          severity: "secondary",
          size: "small",
          "aria-label": `Actions for ${t.account.label}`,
          "aria-haspopup": "menu",
          onClick: w[2] || (w[2] = (y) => A.value?.toggle(y))
        }, {
          icon: R(() => [
            $(b(T), {
              icon: "tabler:dots",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["aria-label"]),
        $(b(yn), {
          ref_key: "actions",
          ref: A,
          model: O.value,
          popup: "",
          "append-to": "self",
          "aria-label": `Actions for ${t.account.label}`
        }, {
          itemicon: R(({ item: y }) => [
            y.icon ? (a(), P(b(T), {
              key: 0,
              icon: y.icon,
              "aria-hidden": "true"
            }, null, 8, ["icon"])) : c("", !0)
          ]),
          _: 1
        }, 8, ["model", "aria-label"]),
        t.account.shareable ? (a(), P(ne, {
          key: 0,
          ref_key: "share",
          ref: dt,
          id: t.account.id,
          title: t.account.label,
          "hide-button": ""
        }, null, 8, ["id", "title"])) : c("", !0)
      ])) : c("", !0)
    ])) : (a(), i("li", {
      key: 1,
      class: D(["ac-row ac-account ac-hover-actions", { off: !t.account.enabled || !t.account.usable }])
    }, [
      p("div", mo, [
        p("div", fo, [
          p("span", {
            class: D(["kx-tag-sm ac-tone", C.value])
          }, d(g[C.value]), 3),
          S.value ? bt((a(), i("input", {
            key: 0,
            ref_key: "input",
            ref: B,
            "onUpdate:modelValue": w[3] || (w[3] = (y) => E.value = y),
            class: "ac-rename kx-focus-halo",
            "aria-label": "Account label",
            onKeydown: [
              ct(ut(L, ["prevent"]), ["enter"]),
              w[4] || (w[4] = ct(ut((y) => S.value = !1, ["prevent"]), ["escape"]))
            ],
            onBlur: L
          }, null, 40, vo)), [
            [zt, E.value]
          ]) : (a(), i("span", yo, d(t.account.label), 1)),
          t.account.subscription ? (a(), i("span", ko, "personal")) : c("", !0)
        ]),
        p("div", wo, [
          I(d(t.kindLabel) + " · " + d(t.account.runs_day) + " " + d(t.account.runs_day === 1 ? "task" : "tasks") + " in the last 24 hours · " + d(t.account.failures_day) + " " + d(t.account.failures_day === 1 ? "failure" : "failures") + " · ", 1),
          t.account.last_used_at ? (a(), i("span", {
            key: 0,
            title: b(It)(t.account.last_used_at)
          }, "last used " + d(b(kn)(t.account.last_used_at, b(r))), 9, $o)) : (a(), i("span", xo, "never used"))
        ]),
        G.value ? (a(), i("div", Co, d(G.value), 1)) : c("", !0),
        t.account.usable ? t.account.subscription ? (a(), i("div", Po, "Subscription login: personal use only")) : c("", !0) : (a(), i("div", So, [
          $(b(T), { icon: "tabler:lock" }),
          I(" " + d(t.account.unavailable_reason || "Account unavailable for tasks"), 1)
        ])),
        t.account.endpoint ? (a(), i("div", Ao, d(t.account.endpoint.protocol) + " · " + d(t.account.endpoint.base_url) + d(t.account.endpoint.model ? " · " + t.account.endpoint.model : ""), 1)) : c("", !0),
        C.value === "cooling" && t.account.cooldown_until ? (a(), i("div", zo, "Available at " + d(b(It)(t.account.cooldown_until)), 1)) : c("", !0),
        (a(!0), i(j, null, Y(t.account.rate_limits?.windows ?? [], (y) => (a(), i("div", {
          key: y.window,
          class: "ac-muted"
        }, [
          I(d(y.window.replace("seven_day", "7-day").replace("five_hour", "5-hour").replaceAll("_", " ")) + ": " + d(y.utilization === void 0 ? y.status : `${Math.round(y.utilization * 100)}% used`), 1),
          y.resets_at ? (a(), i(j, { key: 0 }, [
            I(", resets " + d(new Date(y.resets_at * 1e3).toLocaleString(void 0, { weekday: "short", hour: "2-digit", minute: "2-digit" })), 1)
          ], 64)) : c("", !0)
        ]))), 128)),
        t.account.rate_limits?.overage_status ? (a(), i("div", Io, "Overage: " + d(t.account.rate_limits.overage_status) + d(t.account.rate_limits.overage_disabled_reason ? " · " + t.account.rate_limits.overage_disabled_reason : ""), 1)) : c("", !0),
        t.account.last_error ? (a(), i("div", Bo, d(t.account.last_error), 1)) : c("", !0)
      ]),
      p("div", To, [
        t.account.writable ? (a(), P(b(Xt), {
          key: 0,
          "model-value": t.account.enabled,
          "aria-label": t.account.enabled ? "Disable account" : "Enable account",
          onChange: w[5] || (w[5] = (y) => o("toggle"))
        }, null, 8, ["model-value", "aria-label"])) : c("", !0),
        t.account.writable ? (a(), i("button", {
          key: 1,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Rename",
          "aria-label": "Rename account",
          onClick: M
        }, [
          $(b(T), { icon: "tabler:pencil" })
        ])) : c("", !0),
        t.account.writable && t.editCredentials ? (a(), i("button", {
          key: 2,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Edit credential and endpoint",
          "aria-label": "Edit account",
          onClick: w[6] || (w[6] = (y) => o("edit"))
        }, [
          $(b(T), { icon: "tabler:key" })
        ])) : c("", !0),
        t.account.deletable ? (a(), i("button", {
          key: 3,
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          title: "Delete",
          "aria-label": "Delete account",
          onClick: w[7] || (w[7] = (y) => o("remove"))
        }, [
          $(b(T), { icon: "tabler:trash" })
        ])) : c("", !0)
      ])
    ], 2));
  }
});
var Fo = `
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
`, jo = {
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
}, Eo = J.extend({
  name: "message",
  style: Fo,
  classes: jo
}), Lo = {
  name: "BaseMessage",
  extends: Z,
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
  style: Eo,
  provide: function() {
    return {
      $pcMessage: this,
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
function Tt(t, n, e) {
  return (n = No(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function No(t) {
  var n = Vo(t, "string");
  return st(n) == "symbol" ? n : n + "";
}
function Vo(t, n) {
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
  name: "Message",
  extends: Lo,
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
      return K(Tt(Tt({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: Rt
  },
  components: {
    TimesIcon: qt
  }
};
function lt(t) {
  "@babel/helpers - typeof";
  return lt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, lt(t);
}
function Ot(t, n) {
  var e = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    n && (o = o.filter(function(g) {
      return Object.getOwnPropertyDescriptor(t, g).enumerable;
    })), e.push.apply(e, o);
  }
  return e;
}
function Ft(t) {
  for (var n = 1; n < arguments.length; n++) {
    var e = arguments[n] != null ? arguments[n] : {};
    n % 2 ? Ot(Object(e), !0).forEach(function(o) {
      _o(t, o, e[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)) : Ot(Object(e)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(e, o));
    });
  }
  return t;
}
function _o(t, n, e) {
  return (n = Ro(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ro(t) {
  var n = Do(t, "string");
  return lt(n) == "symbol" ? n : n + "";
}
function Do(t, n) {
  if (lt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (lt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Mo = ["data-p"], Uo = ["data-p"], Ko = ["data-p"], Ho = ["aria-label", "data-p"], Wo = ["data-p"];
function Go(t, n, e, o, g, r) {
  var C = pt("TimesIcon"), m = jt("ripple");
  return a(), P(hn, f({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: R(function() {
      return [g.visible ? (a(), i("div", f({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": r.dataP
      }, t.ptm("root")), [p("div", f({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? x(t.$slots, "container", {
        key: 0,
        closeCallback: r.close
      }) : (a(), i("div", f({
        key: 1,
        class: t.cx("content"),
        "data-p": r.dataP
      }, t.ptm("content")), [x(t.$slots, "icon", {
        class: D(t.cx("icon"))
      }, function() {
        return [(a(), P(et(t.icon ? "span" : null), f({
          class: [t.cx("icon"), t.icon],
          "data-p": r.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (a(), i("div", f({
        key: 0,
        class: t.cx("text"),
        "data-p": r.dataP
      }, t.ptm("text")), [x(t.$slots, "default")], 16, Ko)) : c("", !0), t.closable ? bt((a(), i("button", f({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": r.closeAriaLabel,
        type: "button",
        onClick: n[0] || (n[0] = function(u) {
          return r.close(u);
        }),
        "data-p": r.dataP
      }, Ft(Ft({}, t.closeButtonProps), t.ptm("closeButton"))), [x(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (a(), i("i", f({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, Wo)) : (a(), P(C, f({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, Ho)), [[m]]) : c("", !0)], 16, Uo))], 16)], 16, Mo)) : c("", !0)];
    }),
    _: 3
  }, 16);
}
Jt.render = Go;
const qo = { class: "ac-stack" }, Xo = {
  key: 0,
  class: "kx-err inline"
}, Yo = {
  key: 1,
  class: "kx-err inline",
  role: "status"
}, Zo = {
  key: 2,
  class: "kx-loading"
}, Jo = {
  key: 3,
  class: "ac-card-head ac-provider-actions"
}, Qo = { class: "ac-hint" }, ta = {
  key: 4,
  class: "kx-empty"
}, na = { class: "kx-empty-ico" }, ea = {
  key: 5,
  class: "kx-empty"
}, oa = {
  key: 0,
  class: "ac-card-head"
}, aa = { class: "ac-card-title" }, ra = { class: "ac-muted" }, ia = { class: "ac-account-grid" }, sa = { class: "ac-form" }, la = { class: "ac-setup-actions" }, da = {
  key: 1,
  class: "ac-hint"
}, ca = {
  key: 3,
  class: "kx-err",
  role: "alert"
}, va = /* @__PURE__ */ W({
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
    const o = Dt(), g = k([]), r = t, C = e, m = k(!1), u = k(null);
    function A() {
      u.value = null, q.value = "", y.value = "", m.value = !0;
    }
    function dt(s) {
      u.value = s, y.value = "", H.value = s.agent, q.value = "", m.value = !0;
    }
    n({ open: A });
    const O = jn(), G = Kt(), S = k([]), E = k({}), B = k(""), M = k(""), L = k(!1), F = k(!1), w = k(!1), y = k(""), q = k(""), $t = k(0), H = k(r.selectedAgent || O.value.agents[0]?.id || "");
    ht(() => r.selectedAgent, (s) => {
      s && (H.value = s);
    });
    const Q = _(() => {
      const s = O.value.agents.find((l) => l.id === H.value);
      return !s || !r.management ? s : { ...s, title: ve(s.id, s.title).name, credentials: s.credentials.map((l) => ({
        ...l,
        ...Ct(l)
      })) };
    }), Qt = _(() => JSON.stringify({ driver: Q.value, busy: F.value, error: q.value, saved: $t.value, guided: r.management, initialKind: r.provider === "claude" ? "env:CLAUDE_CODE_OAUTH_TOKEN" : void 0, account: u.value ? { id: u.value.id, label: u.value.label, credential_kind: u.value.credential_kind, endpoint: u.value.endpoint } : void 0, limits: O.value.account_limits })), xt = _(() => [...O.value.agents, ...[...new Set(S.value.map((s) => s.agent))].filter((s) => !O.value.agents.some((l) => l.id === s)).map((s) => ({ id: s, title: `Unavailable agent: ${s}`, icon: "tabler:terminal-2" }))].map((s) => ({ agent: s, accounts: S.value.filter((l) => l.agent === s.id && [l.label, s.title, l.credential_kind].join(" ").toLowerCase().includes(r.query.toLowerCase())) })).filter((s) => s.accounts.length)), tn = {
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
    function Ct(s) {
      if (!r.management) return { label: s.label, hint: s.hint };
      if (s.file) return { label: "CLI login file", hint: s.hint };
      if (s.subscription) return { label: "Subscription token", hint: "Paste the subscription token from the provider." };
      const l = s.id.match(/^env:([A-Z]+)_API_KEY$/)?.[1], h = l && tn[l];
      return { label: h ? `${h} API key` : s.label, hint: "Paste the key generated in the provider dashboard." };
    }
    function nn(s) {
      const l = O.value.agents.find((h) => h.id === s.agent)?.credentials.find((h) => h.id === s.credential_kind);
      return l ? Ct(l).label : r.management ? "Saved credential" : s.credential_kind;
    }
    const St = (s) => r.provider === "codex" && s.mine && s.credential_kind === "file:.codex/auth.json", gt = W({
      name: "CredentialEditor",
      setup: () => () => mn("chestor-autocode-driver-account", { config: Qt.value, onSubmit: ln })
    });
    function en(s) {
      w.value = s;
    }
    async function on() {
      y.value = "The Codex account is ready to run tasks.", await V(), o() && C("changed");
    }
    async function an(s) {
      const l = [...new Set(s.filter((v) => !v.mine).map((v) => v.owner_user_id))].filter((v) => !(v in E.value)), h = await Cn(l);
      o() && (E.value = { ...E.value, ...h });
    }
    async function rn() {
      if (!r.management) return U.accounts();
      const s = r.providerId ? { provider_id: r.providerId } : { agent: r.selectedAgent }, l = await U.managedAccounts(s);
      return o() && l.agent && (H.value = l.agent), l.accounts;
    }
    const V = Mt(async () => {
      try {
        const s = await xn(rn, (l) => l.map((h) => h.id), g, o, (l) => {
          S.value = l, L.value = !0, B.value = "";
        }, () => {
          V();
        });
        if (!o() || (await an(s), !o())) return;
        L.value = !0, B.value = "";
      } catch (s) {
        o() && (B.value = tt(s, "Could not load accounts."));
      }
    }, o);
    wn(() => g.value, () => {
      V();
    });
    const sn = $n.runs(() => {
      V();
    });
    fn(sn), Vt(V);
    async function Pt(s, l) {
      B.value = "", M.value = "";
      try {
        if (await s(), !o()) return;
        await V(), o() && C("changed");
      } catch (h) {
        o() && (B.value = tt(h, l));
      }
    }
    async function ln(s) {
      if (!(s instanceof CustomEvent)) return;
      const l = Pn.safeParse(s.detail);
      if (F.value) return;
      if (!l.success || l.data.agent !== H.value || u.value && (!u.value.writable || l.data.credential_kind !== u.value.credential_kind)) {
        q.value = "Invalid account submission.";
        return;
      }
      const h = l.data;
      q.value = "", F.value = !0;
      try {
        if (u.value) {
          const v = await U.updateAccount(u.value.id, {
            label: h.label,
            endpoint: h.endpoint ?? { base_url: "" },
            ...h.secret ? { secret: h.secret } : {}
          });
          if (!o()) return;
          M.value = v.health_error ? `Account saved, but its health could not be refreshed: ${v.health_error.message}` : "";
        } else if (r.management) {
          const v = await U.connectAccount(h);
          o() && (y.value = v.checked ? "The provider accepted the credential. Your account is ready to run tasks." : "Credential saved. Run a task to confirm this account can connect to the provider.");
        } else await U.createAccount(h);
        if (!o()) return;
        $t.value++, (!r.management || u.value) && (m.value = !1), await V(), o() && C("changed");
      } catch (v) {
        o() && (q.value = tt(v, "Could not save the account."));
      } finally {
        o() && (F.value = !1);
      }
    }
    ht(S, (s) => C("count", s.length));
    const At = (s, l, h) => Pt(async () => {
      const v = await U.updateAccount(s.id, l);
      o() && v.health_error && (M.value = `Account saved, but its health could not be refreshed: ${v.health_error.message}`);
    }, h), dn = (s) => At(s, { enabled: !s.enabled }, "Could not update the account."), cn = (s, l) => At(s, { label: l }, "Could not rename the account.");
    async function un(s) {
      const l = await Sn.confirm({
        header: "Delete account",
        message: `Delete account "${s.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      o() && l && await Pt(() => U.deleteAccount(s.id), "Could not delete the account.");
    }
    return Et(() => {
      r.allowSetup && Ht("chestor-autocode-driver-account", { timeoutMs: 8e3 }).catch(() => {
        o() && (B.value = "The driver account card could not load.");
      });
    }), (s, l) => (a(), i("div", qo, [
      B.value ? (a(), i("p", Xo, [
        I(d(B.value) + " ", 1),
        p("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: l[0] || (l[0] = //@ts-ignore
          (...h) => b(V) && b(V)(...h))
        }, "Retry")
      ])) : c("", !0),
      M.value ? (a(), i("p", Yo, d(M.value), 1)) : c("", !0),
      !L.value && !B.value ? (a(), i("div", Zo, "Loading accounts…")) : c("", !0),
      t.management && L.value && t.allowSetup ? (a(), i("div", Jo, [
        p("p", Qo, d(S.value.length ? `${S.value.length} ${S.value.length === 1 ? "account" : "accounts"}` : "No accounts yet"), 1),
        $(b(nt), {
          label: "Add account",
          disabled: !Q.value,
          onClick: A
        }, {
          icon: R(() => [
            $(b(T), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["disabled"])
      ])) : c("", !0),
      !t.management && L.value && !S.value.length ? (a(), i("div", ta, [
        p("div", na, [
          $(b(T), { icon: "tabler:key" })
        ]),
        l[4] || (l[4] = p("div", { class: "kx-empty-title" }, "No accounts yet", -1)),
        l[5] || (l[5] = p("div", { class: "kx-empty-sub" }, "Add an API key, your own endpoint or a personal subscription login.", -1)),
        $(b(nt), {
          label: "Add account",
          onClick: A
        }, {
          icon: R(() => [
            $(b(T), { icon: "tabler:plus" })
          ]),
          _: 1
        })
      ])) : !t.management && L.value && !xt.value.length ? (a(), i("div", ea, [...l[6] || (l[6] = [
        p("div", { class: "kx-empty-title" }, "No matches", -1),
        p("div", { class: "kx-empty-sub" }, "Try another account or agent.", -1)
      ])])) : c("", !0),
      (a(!0), i(j, null, Y(xt.value, (h) => (a(), i("section", {
        key: h.agent.id,
        class: "ac-stack"
      }, [
        t.management ? c("", !0) : (a(), i("div", oa, [
          p("h2", aa, [
            $(b(T), {
              icon: b(Ut)(h.agent.id, b(O).agents)
            }, null, 8, ["icon"]),
            I(d(h.agent.title), 1)
          ]),
          p("span", ra, d(h.accounts.filter((v) => v.usable && b(wt)(v, b(G)) === "ready").length) + " of " + d(h.accounts.length) + " ready", 1)
        ])),
        p("ul", ia, [
          (a(!0), i(j, null, Y(h.accounts, (v) => (a(), P(Oo, {
            key: v.id,
            account: v,
            "kind-label": nn(v),
            "owner-label": E.value[v.owner_user_id] || v.owner_user_id,
            management: t.management,
            "edit-credentials": t.allowSetup,
            "native-reconnect": St(v),
            onEdit: (X) => dt(v),
            onToggle: (X) => dn(v),
            onRename: (X) => cn(v, X),
            onRemove: (X) => un(v)
          }, vn({ _: 2 }, [
            s.$slots.usage ? {
              name: "usage",
              fn: R((X) => [
                x(s.$slots, "usage", f({ ref_for: !0 }, X))
              ]),
              key: "0"
            } : void 0
          ]), 1032, ["account", "kind-label", "owner-label", "management", "edit-credentials", "native-reconnect", "onEdit", "onToggle", "onRename", "onRemove"]))), 128))
        ])
      ]))), 128)),
      m.value ? (a(), P(se, {
        key: 6,
        title: u.value ? "Edit account" : "Add account",
        busy: F.value || w.value,
        icon: t.management ? Q.value?.icon : void 0,
        onClose: l[3] || (l[3] = (h) => m.value = !1)
      }, {
        default: R(() => [
          p("div", sa, [
            y.value ? (a(), i(j, { key: 0 }, [
              $(b(Jt), {
                severity: "success",
                closable: !1,
                role: "status"
              }, {
                default: R(() => [
                  I(d(y.value), 1)
                ]),
                _: 1
              }),
              p("div", la, [
                $(b(nt), {
                  label: "Done",
                  onClick: l[1] || (l[1] = (h) => m.value = !1)
                })
              ])
            ], 64)) : t.management && (!u.value || St(u.value)) ? x(s.$slots, "setup", {
              account: u.value ?? void 0,
              labelBytes: b(O).account_limits?.label_bytes,
              busy: en,
              saved: on,
              credential: b(gt)
            }, () => [
              x(s.$slots, "guide", {}, () => [
                l[7] || (l[7] = p("p", { class: "ac-hint" }, "Add a credential from the provider dashboard or from the CLI on a machine that is already signed in.", -1))
              ]),
              Q.value ? (a(), P(et(b(gt)), { key: 0 })) : c("", !0)
            ], void 0, 1) : (a(), i(j, { key: 2 }, [
              !u.value && !t.management ? (a(), P(xe, {
                key: 0,
                disabled: F.value,
                modelValue: H.value,
                "onUpdate:modelValue": l[2] || (l[2] = (h) => H.value = h),
                agents: b(O).agents
              }, null, 8, ["disabled", "modelValue", "agents"])) : c("", !0),
              !u.value && !t.management ? (a(), i("p", da, "Tasks balance across your ready accounts automatically.")) : c("", !0),
              Q.value ? (a(), P(et(b(gt)), { key: 2 })) : (a(), i("p", ca, "This account’s agent is unavailable."))
            ], 64))
          ])
        ]),
        _: 3
      }, 8, ["title", "busy", "icon"])) : c("", !0)
    ]));
  }
});
export {
  ne as _,
  An as a,
  se as b,
  qt as c,
  nt as d,
  Yt as e,
  me as f,
  va as g,
  fa as h,
  eo as i,
  Jt as j,
  xe as k,
  ve as p,
  Wt as s,
  jn as u
};
