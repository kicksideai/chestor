import { s as ge, B as be, b as Pe, z as et, e as Ne, R as de, T as pe, c as gt, f as tt, d as ue, F as Ue, k as He, M as ye, J as bt, v as je, g as Ce, h as yt, p as le, i as we, j as kt, m as Ge, n as We, u as It, a as xt, P as wt } from "./wc-runtime-DgMRDxeK.js";
import { openBlock as c, createElementBlock as p, mergeProps as B, createElementVNode as l, renderSlot as K, resolveComponent as ie, Fragment as j, renderList as ee, createCommentVNode as C, createVNode as T, resolveDirective as St, withCtx as se, normalizeClass as re, createBlock as E, normalizeProps as Ct, toDisplayString as $, createSlots as $t, createTextVNode as N, withDirectives as W, defineComponent as oe, ref as _, watch as ne, unref as O, vModelText as te, createStaticVNode as Ot, vModelCheckbox as _t, computed as J, onUnmounted as nt, normalizeStyle as Lt, toHandlers as ke, resolveDynamicComponent as Ie, withModifiers as Dt, vShow as xe, nextTick as Oe } from "vue";
import { host as fe, loadByTagName as Mt, config as Bt, on as At } from "@wippy-fe/proxy";
import { s as Re, a as zt } from "./index-Db2E5nsu.js";
import { s as Tt, a as Ft, u as Ee, _ as it, b as _e, c as Vt, d as ce, e as Pt, f as qe, p as Rt, g as Et, h as Kt } from "./accounts.vue_vue_type_script_setup_true_lang-DBO9rQIp.js";
import { Icon as H } from "@iconify/vue";
import { _ as Le } from "./page-head.vue_vue_type_script_setup_true_lang-CFR2RYpf.js";
import { a as Q, e as X, u as st, b as Nt, s as Se, r as ot, p as Ut, c as Ke, d as Ht } from "./presentation-Bq-Cf4TV.js";
var at = {
  name: "BlankIcon",
  extends: ge
};
function jt(t) {
  return Zt(t) || qt(t) || Wt(t) || Gt();
}
function Gt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Wt(t, e) {
  if (t) {
    if (typeof t == "string") return De(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? De(t, e) : void 0;
  }
}
function qt(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Zt(t) {
  if (Array.isArray(t)) return De(t);
}
function De(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function Jt(t, e, n, i, o, s) {
  return c(), p("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), jt(e[0] || (e[0] = [l("rect", {
    width: "1",
    height: "1",
    fill: "currentColor",
    "fill-opacity": "0"
  }, null, -1)])), 16);
}
at.render = Jt;
var rt = {
  name: "CheckIcon",
  extends: ge
};
function Yt(t) {
  return tn(t) || en(t) || Xt(t) || Qt();
}
function Qt() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xt(t, e) {
  if (t) {
    if (typeof t == "string") return Me(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Me(t, e) : void 0;
  }
}
function en(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function tn(t) {
  if (Array.isArray(t)) return Me(t);
}
function Me(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function nn(t, e, n, i, o, s) {
  return c(), p("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Yt(e[0] || (e[0] = [l("path", {
    d: "M4.86199 11.5948C4.78717 11.5923 4.71366 11.5745 4.64596 11.5426C4.57826 11.5107 4.51779 11.4652 4.46827 11.4091L0.753985 7.69483C0.683167 7.64891 0.623706 7.58751 0.580092 7.51525C0.536478 7.44299 0.509851 7.36177 0.502221 7.27771C0.49459 7.19366 0.506156 7.10897 0.536046 7.03004C0.565935 6.95111 0.613367 6.88 0.674759 6.82208C0.736151 6.76416 0.8099 6.72095 0.890436 6.69571C0.970973 6.67046 1.05619 6.66385 1.13966 6.67635C1.22313 6.68886 1.30266 6.72017 1.37226 6.76792C1.44186 6.81567 1.4997 6.8786 1.54141 6.95197L4.86199 10.2503L12.6397 2.49483C12.7444 2.42694 12.8689 2.39617 12.9932 2.40745C13.1174 2.41873 13.2343 2.47141 13.3251 2.55705C13.4159 2.64268 13.4753 2.75632 13.4938 2.87973C13.5123 3.00315 13.4888 3.1292 13.4271 3.23768L5.2557 11.4091C5.20618 11.4652 5.14571 11.5107 5.07801 11.5426C5.01031 11.5745 4.9368 11.5923 4.86199 11.5948Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
rt.render = nn;
var lt = {
  name: "SearchIcon",
  extends: ge
};
function sn(t) {
  return ln(t) || rn(t) || an(t) || on();
}
function on() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function an(t, e) {
  if (t) {
    if (typeof t == "string") return Be(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Be(t, e) : void 0;
  }
}
function rn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ln(t) {
  if (Array.isArray(t)) return Be(t);
}
function Be(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function un(t, e, n, i, o, s) {
  return c(), p("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), sn(e[0] || (e[0] = [l("path", {
    "fill-rule": "evenodd",
    "clip-rule": "evenodd",
    d: "M2.67602 11.0265C3.6661 11.688 4.83011 12.0411 6.02086 12.0411C6.81149 12.0411 7.59438 11.8854 8.32483 11.5828C8.87005 11.357 9.37808 11.0526 9.83317 10.6803L12.9769 13.8241C13.0323 13.8801 13.0983 13.9245 13.171 13.9548C13.2438 13.985 13.3219 14.0003 13.4007 14C13.4795 14.0003 13.5575 13.985 13.6303 13.9548C13.7031 13.9245 13.7691 13.8801 13.8244 13.8241C13.9367 13.7116 13.9998 13.5592 13.9998 13.4003C13.9998 13.2414 13.9367 13.089 13.8244 12.9765L10.6807 9.8328C11.053 9.37773 11.3573 8.86972 11.5831 8.32452C11.8857 7.59408 12.0414 6.81119 12.0414 6.02056C12.0414 4.8298 11.6883 3.66579 11.0268 2.67572C10.3652 1.68564 9.42494 0.913972 8.32483 0.45829C7.22472 0.00260857 6.01418 -0.116618 4.84631 0.115686C3.67844 0.34799 2.60568 0.921393 1.76369 1.76338C0.921698 2.60537 0.348296 3.67813 0.115991 4.84601C-0.116313 6.01388 0.00291375 7.22441 0.458595 8.32452C0.914277 9.42464 1.68595 10.3649 2.67602 11.0265ZM3.35565 2.0158C4.14456 1.48867 5.07206 1.20731 6.02086 1.20731C7.29317 1.20731 8.51338 1.71274 9.41304 2.6124C10.3127 3.51206 10.8181 4.73226 10.8181 6.00457C10.8181 6.95337 10.5368 7.88088 10.0096 8.66978C9.48251 9.45868 8.73328 10.0736 7.85669 10.4367C6.98011 10.7997 6.01554 10.8947 5.08496 10.7096C4.15439 10.5245 3.2996 10.0676 2.62869 9.39674C1.95778 8.72583 1.50089 7.87104 1.31579 6.94046C1.13068 6.00989 1.22568 5.04532 1.58878 4.16874C1.95187 3.29215 2.56675 2.54292 3.35565 2.0158Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
lt.render = un;
var cn = `
    .p-iconfield {
        position: relative;
        display: block;
    }

    .p-inputicon {
        position: absolute;
        top: 50%;
        margin-top: calc(-1 * (dt('icon.size') / 2));
        color: dt('iconfield.icon.color');
        line-height: 1;
        z-index: 1;
    }

    .p-iconfield .p-inputicon:first-child {
        inset-inline-start: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputicon:last-child {
        inset-inline-end: dt('form.field.padding.x');
    }

    .p-iconfield .p-inputtext:not(:first-child),
    .p-iconfield .p-inputwrapper:not(:first-child) .p-inputtext {
        padding-inline-start: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield .p-inputtext:not(:last-child) {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-iconfield:has(.p-inputfield-sm) .p-inputicon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
        margin-top: calc(-1 * (dt('form.field.sm.font.size') / 2));
    }

    .p-iconfield:has(.p-inputfield-lg) .p-inputicon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
        margin-top: calc(-1 * (dt('form.field.lg.font.size') / 2));
    }
`, dn = {
  root: "p-iconfield"
}, pn = be.extend({
  name: "iconfield",
  style: cn,
  classes: dn
}), hn = {
  name: "BaseIconField",
  extends: Pe,
  style: pn,
  provide: function() {
    return {
      $pcIconField: this,
      $parentInstance: this
    };
  }
}, ut = {
  name: "IconField",
  extends: hn,
  inheritAttrs: !1
};
function fn(t, e, n, i, o, s) {
  return c(), p("div", B({
    class: t.cx("root")
  }, t.ptmi("root")), [K(t.$slots, "default")], 16);
}
ut.render = fn;
var mn = {
  root: "p-inputicon"
}, vn = be.extend({
  name: "inputicon",
  classes: mn
}), gn = {
  name: "BaseInputIcon",
  extends: Pe,
  style: vn,
  props: {
    class: null
  },
  provide: function() {
    return {
      $pcInputIcon: this,
      $parentInstance: this
    };
  }
}, ct = {
  name: "InputIcon",
  extends: gn,
  inheritAttrs: !1,
  computed: {
    containerClass: function() {
      return [this.cx("root"), this.class];
    }
  }
};
function bn(t, e, n, i, o, s) {
  return c(), p("span", B({
    class: s.containerClass
  }, t.ptmi("root"), {
    "aria-hidden": "true"
  }), [K(t.$slots, "default")], 16);
}
ct.render = bn;
var yn = `
    .p-virtualscroller-loader {
        background: dt('virtualscroller.loader.mask.background');
        color: dt('virtualscroller.loader.mask.color');
    }

    .p-virtualscroller-loading-icon {
        font-size: dt('virtualscroller.loader.icon.size');
        width: dt('virtualscroller.loader.icon.size');
        height: dt('virtualscroller.loader.icon.size');
    }
`, kn = `
.p-virtualscroller {
    position: relative;
    overflow: auto;
    contain: strict;
    transform: translateZ(0);
    will-change: scroll-position;
    outline: 0 none;
}

.p-virtualscroller-content {
    position: absolute;
    top: 0;
    left: 0;
    min-height: 100%;
    min-width: 100%;
    will-change: transform;
}

.p-virtualscroller-spacer {
    position: absolute;
    top: 0;
    left: 0;
    height: 1px;
    width: 1px;
    transform-origin: 0 0;
    pointer-events: none;
}

.p-virtualscroller-loader {
    position: sticky;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.p-virtualscroller-loader-mask {
    display: flex;
    align-items: center;
    justify-content: center;
}

.p-virtualscroller-horizontal > .p-virtualscroller-content {
    display: flex;
}

.p-virtualscroller-inline .p-virtualscroller-content {
    position: static;
}

.p-virtualscroller .p-virtualscroller-loading {
    transform: none !important;
    min-height: 0;
    position: sticky;
    inset-block-start: 0;
    inset-inline-start: 0;
}
`, Ze = be.extend({
  name: "virtualscroller",
  css: kn,
  style: yn
}), In = {
  name: "BaseVirtualScroller",
  extends: Pe,
  props: {
    id: {
      type: String,
      default: null
    },
    style: null,
    class: null,
    items: {
      type: Array,
      default: null
    },
    itemSize: {
      type: [Number, Array],
      default: 0
    },
    scrollHeight: null,
    scrollWidth: null,
    orientation: {
      type: String,
      default: "vertical"
    },
    numToleratedItems: {
      type: Number,
      default: null
    },
    delay: {
      type: Number,
      default: 0
    },
    resizeDelay: {
      type: Number,
      default: 10
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    loaderDisabled: {
      type: Boolean,
      default: !1
    },
    columns: {
      type: Array,
      default: null
    },
    loading: {
      type: Boolean,
      default: !1
    },
    showSpacer: {
      type: Boolean,
      default: !0
    },
    showLoader: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    inline: {
      type: Boolean,
      default: !1
    },
    step: {
      type: Number,
      default: 0
    },
    appendOnly: {
      type: Boolean,
      default: !1
    },
    autoSize: {
      type: Boolean,
      default: !1
    }
  },
  style: Ze,
  provide: function() {
    return {
      $pcVirtualScroller: this,
      $parentInstance: this
    };
  },
  beforeMount: function() {
    var e;
    Ze.loadCSS({
      nonce: (e = this.$primevueConfig) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce
    });
  }
};
function me(t) {
  "@babel/helpers - typeof";
  return me = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, me(t);
}
function Je(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function he(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Je(Object(n), !0).forEach(function(i) {
      dt(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Je(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function dt(t, e, n) {
  return (e = xn(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function xn(t) {
  var e = wn(t, "string");
  return me(e) == "symbol" ? e : e + "";
}
function wn(t, e) {
  if (me(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(t, e);
    if (me(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var pt = {
  name: "VirtualScroller",
  extends: In,
  inheritAttrs: !1,
  emits: ["update:numToleratedItems", "scroll", "scroll-index-change", "lazy-load"],
  data: function() {
    var e = this.isBoth();
    return {
      first: e ? {
        rows: 0,
        cols: 0
      } : 0,
      last: e ? {
        rows: 0,
        cols: 0
      } : 0,
      page: e ? {
        rows: 0,
        cols: 0
      } : 0,
      numItemsInViewport: e ? {
        rows: 0,
        cols: 0
      } : 0,
      lastScrollPos: e ? {
        top: 0,
        left: 0
      } : 0,
      d_numToleratedItems: this.numToleratedItems,
      d_loading: this.loading,
      loaderArr: [],
      spacerStyle: {},
      contentStyle: {}
    };
  },
  element: null,
  content: null,
  lastScrollPos: null,
  scrollTimeout: null,
  resizeTimeout: null,
  defaultWidth: 0,
  defaultHeight: 0,
  defaultContentWidth: 0,
  defaultContentHeight: 0,
  isRangeChanged: !1,
  lazyLoadState: {},
  resizeListener: null,
  resizeObserver: null,
  initialized: !1,
  watch: {
    numToleratedItems: function(e) {
      this.d_numToleratedItems = e;
    },
    loading: function(e, n) {
      this.lazy && e !== n && e !== this.d_loading && (this.d_loading = e);
    },
    items: {
      handler: function(e, n) {
        (!n || n.length !== (e || []).length) && (this.init(), this.calculateAutoSize());
      },
      deep: !0
    },
    itemSize: function() {
      this.init(), this.calculateAutoSize();
    },
    orientation: function() {
      this.lastScrollPos = this.isBoth() ? {
        top: 0,
        left: 0
      } : 0;
    },
    scrollHeight: function() {
      this.init(), this.calculateAutoSize();
    },
    scrollWidth: function() {
      this.init(), this.calculateAutoSize();
    }
  },
  mounted: function() {
    this.viewInit(), this.lastScrollPos = this.isBoth() ? {
      top: 0,
      left: 0
    } : 0, this.lazyLoadState = this.lazyLoadState || {};
  },
  updated: function() {
    !this.initialized && this.viewInit();
  },
  unmounted: function() {
    this.unbindResizeListener(), this.initialized = !1;
  },
  methods: {
    viewInit: function() {
      Ne(this.element) && (this.setContentEl(this.content), this.init(), this.calculateAutoSize(), this.defaultWidth = de(this.element), this.defaultHeight = pe(this.element), this.defaultContentWidth = de(this.content), this.defaultContentHeight = pe(this.content), this.initialized = !0), this.element && this.bindResizeListener();
    },
    init: function() {
      this.disabled || (this.setSize(), this.calculateOptions(), this.setSpacerSize());
    },
    isVertical: function() {
      return this.orientation === "vertical";
    },
    isHorizontal: function() {
      return this.orientation === "horizontal";
    },
    isBoth: function() {
      return this.orientation === "both";
    },
    scrollTo: function(e) {
      this.element && this.element.scrollTo(e);
    },
    scrollToIndex: function(e) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "auto", o = this.isBoth(), s = this.isHorizontal(), a = o ? e.every(function(y) {
        return y > -1;
      }) : e > -1;
      if (a) {
        var u = this.first, h = this.element, v = h.scrollTop, g = v === void 0 ? 0 : v, I = h.scrollLeft, k = I === void 0 ? 0 : I, d = this.calculateNumItems(), r = d.numToleratedItems, b = this.getContentPosition(), w = this.itemSize, S = function() {
          var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, U = arguments.length > 1 ? arguments[1] : void 0;
          return z <= U ? 0 : z;
        }, x = function(z, U, Z) {
          return z * U + Z;
        }, V = function() {
          var z = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, U = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.scrollTo({
            left: z,
            top: U,
            behavior: i
          });
        }, A = o ? {
          rows: 0,
          cols: 0
        } : 0, m = !1, f = !1;
        o ? (A = {
          rows: S(e[0], r[0]),
          cols: S(e[1], r[1])
        }, V(x(A.cols, w[1], b.left), x(A.rows, w[0], b.top)), f = this.lastScrollPos.top !== g || this.lastScrollPos.left !== k, m = A.rows !== u.rows || A.cols !== u.cols) : (A = S(e, r), s ? V(x(A, w, b.left), g) : V(k, x(A, w, b.top)), f = this.lastScrollPos !== (s ? k : g), m = A !== u), this.isRangeChanged = m, f && (this.first = A);
      }
    },
    scrollInView: function(e, n) {
      var i = this, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "auto";
      if (n) {
        var s = this.isBoth(), a = this.isHorizontal(), u = s ? e.every(function(w) {
          return w > -1;
        }) : e > -1;
        if (u) {
          var h = this.getRenderedRange(), v = h.first, g = h.viewport, I = function() {
            var S = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
            return i.scrollTo({
              left: S,
              top: x,
              behavior: o
            });
          }, k = n === "to-start", d = n === "to-end";
          if (k) {
            if (s)
              g.first.rows - v.rows > e[0] ? I(g.first.cols * this.itemSize[1], (g.first.rows - 1) * this.itemSize[0]) : g.first.cols - v.cols > e[1] && I((g.first.cols - 1) * this.itemSize[1], g.first.rows * this.itemSize[0]);
            else if (g.first - v > e) {
              var r = (g.first - 1) * this.itemSize;
              a ? I(r, 0) : I(0, r);
            }
          } else if (d) {
            if (s)
              g.last.rows - v.rows <= e[0] + 1 ? I(g.first.cols * this.itemSize[1], (g.first.rows + 1) * this.itemSize[0]) : g.last.cols - v.cols <= e[1] + 1 && I((g.first.cols + 1) * this.itemSize[1], g.first.rows * this.itemSize[0]);
            else if (g.last - v <= e + 1) {
              var b = (g.first + 1) * this.itemSize;
              a ? I(b, 0) : I(0, b);
            }
          }
        }
      } else
        this.scrollToIndex(e, o);
    },
    getRenderedRange: function() {
      var e = function(I, k) {
        return Math.floor(I / (k || I));
      }, n = this.first, i = 0;
      if (this.element) {
        var o = this.isBoth(), s = this.isHorizontal(), a = this.element, u = a.scrollTop, h = a.scrollLeft;
        if (o)
          n = {
            rows: e(u, this.itemSize[0]),
            cols: e(h, this.itemSize[1])
          }, i = {
            rows: n.rows + this.numItemsInViewport.rows,
            cols: n.cols + this.numItemsInViewport.cols
          };
        else {
          var v = s ? h : u;
          n = e(v, this.itemSize), i = n + this.numItemsInViewport;
        }
      }
      return {
        first: this.first,
        last: this.last,
        viewport: {
          first: n,
          last: i
        }
      };
    },
    calculateNumItems: function() {
      var e = this.isBoth(), n = this.isHorizontal(), i = this.itemSize, o = this.getContentPosition(), s = this.element ? this.element.offsetWidth - o.left : 0, a = this.element ? this.element.offsetHeight - o.top : 0, u = function(k, d) {
        return Math.ceil(k / (d || k));
      }, h = function(k) {
        return Math.ceil(k / 2);
      }, v = e ? {
        rows: u(a, i[0]),
        cols: u(s, i[1])
      } : u(n ? s : a, i), g = this.d_numToleratedItems || (e ? [h(v.rows), h(v.cols)] : h(v));
      return {
        numItemsInViewport: v,
        numToleratedItems: g
      };
    },
    calculateOptions: function() {
      var e = this, n = this.isBoth(), i = this.first, o = this.calculateNumItems(), s = o.numItemsInViewport, a = o.numToleratedItems, u = function(g, I, k) {
        var d = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !1;
        return e.getLast(g + I + (g < k ? 2 : 3) * k, d);
      }, h = n ? {
        rows: u(i.rows, s.rows, a[0]),
        cols: u(i.cols, s.cols, a[1], !0)
      } : u(i, s, a);
      this.last = h, this.numItemsInViewport = s, this.d_numToleratedItems = a, this.$emit("update:numToleratedItems", this.d_numToleratedItems), this.showLoader && (this.loaderArr = n ? Array.from({
        length: s.rows
      }).map(function() {
        return Array.from({
          length: s.cols
        });
      }) : Array.from({
        length: s
      })), this.lazy && Promise.resolve().then(function() {
        var v;
        e.lazyLoadState = {
          first: e.step ? n ? {
            rows: 0,
            cols: i.cols
          } : 0 : i,
          last: Math.min(e.step ? e.step : h, ((v = e.items) === null || v === void 0 ? void 0 : v.length) || 0)
        }, e.$emit("lazy-load", e.lazyLoadState);
      });
    },
    calculateAutoSize: function() {
      var e = this;
      this.autoSize && !this.d_loading && Promise.resolve().then(function() {
        if (e.content) {
          var n = e.isBoth(), i = e.isHorizontal(), o = e.isVertical();
          e.content.style.minHeight = e.content.style.minWidth = "auto", e.content.style.position = "relative", e.element.style.contain = "none";
          var s = [de(e.element), pe(e.element)], a = s[0], u = s[1];
          (n || i) && (e.element.style.width = a < e.defaultWidth ? a + "px" : e.scrollWidth || e.defaultWidth + "px"), (n || o) && (e.element.style.height = u < e.defaultHeight ? u + "px" : e.scrollHeight || e.defaultHeight + "px"), e.content.style.minHeight = e.content.style.minWidth = "", e.content.style.position = "", e.element.style.contain = "";
        }
      });
    },
    getLast: function() {
      var e, n, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, o = arguments.length > 1 ? arguments[1] : void 0;
      return this.items ? Math.min(o ? ((e = this.columns || this.items[0]) === null || e === void 0 ? void 0 : e.length) || 0 : ((n = this.items) === null || n === void 0 ? void 0 : n.length) || 0, i) : 0;
    },
    getContentPosition: function() {
      if (this.content) {
        var e = getComputedStyle(this.content), n = parseFloat(e.paddingLeft) + Math.max(parseFloat(e.left) || 0, 0), i = parseFloat(e.paddingRight) + Math.max(parseFloat(e.right) || 0, 0), o = parseFloat(e.paddingTop) + Math.max(parseFloat(e.top) || 0, 0), s = parseFloat(e.paddingBottom) + Math.max(parseFloat(e.bottom) || 0, 0);
        return {
          left: n,
          right: i,
          top: o,
          bottom: s,
          x: n + i,
          y: o + s
        };
      }
      return {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        x: 0,
        y: 0
      };
    },
    setSize: function() {
      var e = this;
      if (this.element) {
        var n = this.isBoth(), i = this.isHorizontal(), o = this.element.parentElement, s = this.scrollWidth || "".concat(this.element.offsetWidth || o.offsetWidth, "px"), a = this.scrollHeight || "".concat(this.element.offsetHeight || o.offsetHeight, "px"), u = function(v, g) {
          return e.element.style[v] = g;
        };
        n || i ? (u("height", a), u("width", s)) : u("height", a);
      }
    },
    setSpacerSize: function() {
      var e = this, n = this.items;
      if (n) {
        var i = this.isBoth(), o = this.isHorizontal(), s = this.getContentPosition(), a = function(h, v, g) {
          var I = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : 0;
          return e.spacerStyle = he(he({}, e.spacerStyle), dt({}, "".concat(h), (v || []).length * g + I + "px"));
        };
        i ? (a("height", n, this.itemSize[0], s.y), a("width", this.columns || n[1], this.itemSize[1], s.x)) : o ? a("width", this.columns || n, this.itemSize, s.x) : a("height", n, this.itemSize, s.y);
      }
    },
    setContentPosition: function(e) {
      var n = this;
      if (this.content && !this.appendOnly) {
        var i = this.isBoth(), o = this.isHorizontal(), s = e ? e.first : this.first, a = function(g, I) {
          return g * I;
        }, u = function() {
          var g = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0, I = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : 0;
          return n.contentStyle = he(he({}, n.contentStyle), {
            transform: "translate3d(".concat(g, "px, ").concat(I, "px, 0)")
          });
        };
        if (i)
          u(a(s.cols, this.itemSize[1]), a(s.rows, this.itemSize[0]));
        else {
          var h = a(s, this.itemSize);
          o ? u(h, 0) : u(0, h);
        }
      }
    },
    onScrollPositionChange: function(e) {
      var n = this, i = e.target, o = this.isBoth(), s = this.isHorizontal(), a = this.getContentPosition(), u = function(D, P) {
        return D ? D > P ? D - P : D : 0;
      }, h = function(D, P) {
        return Math.floor(D / (P || D));
      }, v = function(D, P, R, ae, Y, q) {
        return D <= Y ? Y : q ? R - ae - Y : P + Y - 1;
      }, g = function(D, P, R, ae, Y, q, M, F) {
        if (D <= q) return 0;
        var L = Math.max(0, M ? D < P ? R : D - q : D > P ? R : D - 2 * q), G = n.getLast(L, F);
        return L > G ? G - Y : L;
      }, I = function(D, P, R, ae, Y, q) {
        var M = P + ae + 2 * Y;
        return D >= Y && (M += Y + 1), n.getLast(M, q);
      }, k = u(i.scrollTop, a.top), d = u(i.scrollLeft, a.left), r = o ? {
        rows: 0,
        cols: 0
      } : 0, b = this.last, w = !1, S = this.lastScrollPos;
      if (o) {
        var x = this.lastScrollPos.top <= k, V = this.lastScrollPos.left <= d;
        if (!this.appendOnly || this.appendOnly && (x || V)) {
          var A = {
            rows: h(k, this.itemSize[0]),
            cols: h(d, this.itemSize[1])
          }, m = {
            rows: v(A.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], x),
            cols: v(A.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], V)
          };
          r = {
            rows: g(A.rows, m.rows, this.first.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0], x),
            cols: g(A.cols, m.cols, this.first.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], V, !0)
          }, b = {
            rows: I(A.rows, r.rows, this.last.rows, this.numItemsInViewport.rows, this.d_numToleratedItems[0]),
            cols: I(A.cols, r.cols, this.last.cols, this.numItemsInViewport.cols, this.d_numToleratedItems[1], !0)
          }, w = r.rows !== this.first.rows || b.rows !== this.last.rows || r.cols !== this.first.cols || b.cols !== this.last.cols || this.isRangeChanged, S = {
            top: k,
            left: d
          };
        }
      } else {
        var f = s ? d : k, y = this.lastScrollPos <= f;
        if (!this.appendOnly || this.appendOnly && y) {
          var z = h(f, this.itemSize), U = v(z, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, y);
          r = g(z, U, this.first, this.last, this.numItemsInViewport, this.d_numToleratedItems, y), b = I(z, r, this.last, this.numItemsInViewport, this.d_numToleratedItems), w = r !== this.first || b !== this.last || this.isRangeChanged, S = f;
        }
      }
      return {
        first: r,
        last: b,
        isRangeChanged: w,
        scrollPos: S
      };
    },
    onScrollChange: function(e) {
      var n = this.onScrollPositionChange(e), i = n.first, o = n.last, s = n.isRangeChanged, a = n.scrollPos;
      if (s) {
        var u = {
          first: i,
          last: o
        };
        if (this.setContentPosition(u), this.first = i, this.last = o, this.lastScrollPos = a, this.$emit("scroll-index-change", u), this.lazy && this.isPageChanged(i)) {
          var h, v, g = {
            first: this.step ? Math.min(this.getPageByFirst(i) * this.step, (((h = this.items) === null || h === void 0 ? void 0 : h.length) || 0) - this.step) : i,
            last: Math.min(this.step ? (this.getPageByFirst(i) + 1) * this.step : o, ((v = this.items) === null || v === void 0 ? void 0 : v.length) || 0)
          }, I = this.lazyLoadState.first !== g.first || this.lazyLoadState.last !== g.last;
          I && this.$emit("lazy-load", g), this.lazyLoadState = g;
        }
      }
    },
    onScroll: function(e) {
      var n = this;
      if (this.$emit("scroll", e), this.delay) {
        if (this.scrollTimeout && clearTimeout(this.scrollTimeout), this.isPageChanged()) {
          if (!this.d_loading && this.showLoader) {
            var i = this.onScrollPositionChange(e), o = i.isRangeChanged, s = o || (this.step ? this.isPageChanged() : !1);
            s && (this.d_loading = !0);
          }
          this.scrollTimeout = setTimeout(function() {
            n.onScrollChange(e), n.d_loading && n.showLoader && (!n.lazy || n.loading === void 0) && (n.d_loading = !1, n.page = n.getPageByFirst());
          }, this.delay);
        }
      } else
        this.onScrollChange(e);
    },
    onResize: function() {
      var e = this;
      this.resizeTimeout && clearTimeout(this.resizeTimeout), this.resizeTimeout = setTimeout(function() {
        if (Ne(e.element)) {
          var n = e.isBoth(), i = e.isVertical(), o = e.isHorizontal(), s = [de(e.element), pe(e.element)], a = s[0], u = s[1], h = a !== e.defaultWidth, v = u !== e.defaultHeight, g = n ? h || v : o ? h : i ? v : !1;
          g && (e.d_numToleratedItems = e.numToleratedItems, e.defaultWidth = a, e.defaultHeight = u, e.defaultContentWidth = de(e.content), e.defaultContentHeight = pe(e.content), e.init());
        }
      }, this.resizeDelay);
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = this.onResize.bind(this), window.addEventListener("resize", this.resizeListener), window.addEventListener("orientationchange", this.resizeListener), this.resizeObserver = new ResizeObserver(function() {
        e.onResize();
      }), this.resizeObserver.observe(this.element));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), window.removeEventListener("orientationchange", this.resizeListener), this.resizeListener = null), this.resizeObserver && (this.resizeObserver.disconnect(), this.resizeObserver = null);
    },
    getOptions: function(e) {
      var n = (this.items || []).length, i = this.isBoth() ? this.first.rows + e : this.first + e;
      return {
        index: i,
        count: n,
        first: i === 0,
        last: i === n - 1,
        even: i % 2 === 0,
        odd: i % 2 !== 0
      };
    },
    getLoaderOptions: function(e, n) {
      var i = this.loaderArr.length;
      return he({
        index: e,
        count: i,
        first: e === 0,
        last: e === i - 1,
        even: e % 2 === 0,
        odd: e % 2 !== 0
      }, n);
    },
    getPageByFirst: function(e) {
      return Math.floor(((e ?? this.first) + this.d_numToleratedItems * 4) / (this.step || 1));
    },
    isPageChanged: function(e) {
      return this.step && !this.lazy ? this.page !== this.getPageByFirst(e ?? this.first) : !0;
    },
    setContentEl: function(e) {
      this.content = e || this.content || et(this.element, '[data-pc-section="content"]');
    },
    elementRef: function(e) {
      this.element = e;
    },
    contentRef: function(e) {
      this.content = e;
    }
  },
  computed: {
    containerClass: function() {
      return ["p-virtualscroller", this.class, {
        "p-virtualscroller-inline": this.inline,
        "p-virtualscroller-both p-both-scroll": this.isBoth(),
        "p-virtualscroller-horizontal p-horizontal-scroll": this.isHorizontal()
      }];
    },
    contentClass: function() {
      return ["p-virtualscroller-content", {
        "p-virtualscroller-loading": this.d_loading
      }];
    },
    loaderClass: function() {
      return ["p-virtualscroller-loader", {
        "p-virtualscroller-loader-mask": !this.$slots.loader
      }];
    },
    loadedItems: function() {
      var e = this;
      return this.items && !this.d_loading ? this.isBoth() ? this.items.slice(this.appendOnly ? 0 : this.first.rows, this.last.rows).map(function(n) {
        return e.columns ? n : n.slice(e.appendOnly ? 0 : e.first.cols, e.last.cols);
      }) : this.isHorizontal() && this.columns ? this.items : this.items.slice(this.appendOnly ? 0 : this.first, this.last) : [];
    },
    loadedRows: function() {
      return this.d_loading ? this.loaderDisabled ? this.loaderArr : [] : this.loadedItems;
    },
    loadedColumns: function() {
      if (this.columns) {
        var e = this.isBoth(), n = this.isHorizontal();
        if (e || n)
          return this.d_loading && this.loaderDisabled ? e ? this.loaderArr[0] : this.loaderArr : this.columns.slice(e ? this.first.cols : this.first, e ? this.last.cols : this.last);
      }
      return this.columns;
    }
  },
  components: {
    SpinnerIcon: Tt
  }
}, Sn = ["tabindex"];
function Cn(t, e, n, i, o, s) {
  var a = ie("SpinnerIcon");
  return t.disabled ? (c(), p(j, {
    key: 1
  }, [K(t.$slots, "default"), K(t.$slots, "content", {
    items: t.items,
    rows: t.items,
    columns: s.loadedColumns
  })], 64)) : (c(), p("div", B({
    key: 0,
    ref: s.elementRef,
    class: s.containerClass,
    tabindex: t.tabindex,
    style: t.style,
    onScroll: e[0] || (e[0] = function() {
      return s.onScroll && s.onScroll.apply(s, arguments);
    })
  }, t.ptmi("root")), [K(t.$slots, "content", {
    styleClass: s.contentClass,
    items: s.loadedItems,
    getItemOptions: s.getOptions,
    loading: o.d_loading,
    getLoaderOptions: s.getLoaderOptions,
    itemSize: t.itemSize,
    rows: s.loadedRows,
    columns: s.loadedColumns,
    contentRef: s.contentRef,
    spacerStyle: o.spacerStyle,
    contentStyle: o.contentStyle,
    vertical: s.isVertical(),
    horizontal: s.isHorizontal(),
    both: s.isBoth()
  }, function() {
    return [l("div", B({
      ref: s.contentRef,
      class: s.contentClass,
      style: o.contentStyle
    }, t.ptm("content")), [(c(!0), p(j, null, ee(s.loadedItems, function(u, h) {
      return K(t.$slots, "item", {
        key: h,
        item: u,
        options: s.getOptions(h)
      });
    }), 128))], 16)];
  }), t.showSpacer ? (c(), p("div", B({
    key: 0,
    class: "p-virtualscroller-spacer",
    style: o.spacerStyle
  }, t.ptm("spacer")), null, 16)) : C("", !0), !t.loaderDisabled && t.showLoader && o.d_loading ? (c(), p("div", B({
    key: 1,
    class: s.loaderClass
  }, t.ptm("loader")), [t.$slots && t.$slots.loader ? (c(!0), p(j, {
    key: 0
  }, ee(o.loaderArr, function(u, h) {
    return K(t.$slots, "loader", {
      key: h,
      options: s.getLoaderOptions(h, s.isBoth() && {
        numCols: t.d_numItemsInViewport.cols
      })
    });
  }), 128)) : C("", !0), K(t.$slots, "loadingicon", {}, function() {
    return [T(a, B({
      spin: "",
      class: "p-virtualscroller-loading-icon"
    }, t.ptm("loadingIcon")), null, 16)];
  })], 16)) : C("", !0)], 16, Sn));
}
pt.render = Cn;
var $n = `
    .p-listbox {
        display: block;
        background: dt('listbox.background');
        color: dt('listbox.color');
        border: 1px solid dt('listbox.border.color');
        border-radius: dt('listbox.border.radius');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
        outline-color: transparent;
        box-shadow: dt('listbox.shadow');
    }

    .p-listbox.p-disabled {
        opacity: 1;
        background: dt('listbox.disabled.background');
        color: dt('listbox.disabled.color');
    }

    .p-listbox.p-disabled .p-listbox-option {
        color: dt('listbox.disabled.color');
    }

    .p-listbox.p-invalid {
        border-color: dt('listbox.invalid.border.color');
    }

    .p-listbox-header {
        padding: dt('listbox.list.header.padding');
    }

    .p-listbox-filter {
        width: 100%;
    }

    .p-listbox-list-container {
        overflow: auto;
    }

    .p-listbox-list {
        list-style-type: none;
        margin: 0;
        padding: dt('listbox.list.padding');
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('listbox.list.gap');
    }

    .p-listbox-option {
        display: flex;
        align-items: center;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        padding: dt('listbox.option.padding');
        border: 0 none;
        border-radius: dt('listbox.option.border.radius');
        color: dt('listbox.option.color');
        transition:
            background dt('listbox.transition.duration'),
            color dt('listbox.transition.duration'),
            border-color dt('listbox.transition.duration'),
            box-shadow dt('listbox.transition.duration'),
            outline-color dt('listbox.transition.duration');
    }

    .p-listbox-striped li:nth-child(even of .p-listbox-option) {
        background: dt('listbox.option.striped.background');
    }

    .p-listbox .p-listbox-list .p-listbox-option.p-listbox-option-selected {
        background: dt('listbox.option.selected.background');
        color: dt('listbox.option.selected.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option.p-listbox-option-selected.p-focus {
        background: dt('listbox.option.selected.focus.background');
        color: dt('listbox.option.selected.focus.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option:not(.p-listbox-option-selected):not(.p-disabled).p-focus {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .p-listbox:not(.p-disabled) .p-listbox-option:not(.p-listbox-option-selected):not(.p-disabled):hover {
        background: dt('listbox.option.focus.background');
        color: dt('listbox.option.focus.color');
    }

    .p-listbox-option-blank-icon {
        flex-shrink: 0;
    }

    .p-listbox-option-check-icon {
        position: relative;
        flex-shrink: 0;
        margin-inline-start: dt('listbox.checkmark.gutter.start');
        margin-inline-end: dt('listbox.checkmark.gutter.end');
        color: dt('listbox.checkmark.color');
    }

    .p-listbox-option-group {
        margin: 0;
        padding: dt('listbox.option.group.padding');
        color: dt('listbox.option.group.color');
        background: dt('listbox.option.group.background');
        font-weight: dt('listbox.option.group.font.weight');
    }

    .p-listbox-empty-message {
        padding: dt('listbox.empty.message.padding');
    }

    .p-listbox-fluid {
        width: 100%;
    }
`, On = {
  root: function(e) {
    var n = e.instance, i = e.props;
    return ["p-listbox p-component", {
      "p-listbox-striped": i.striped,
      "p-disabled": i.disabled,
      "p-listbox-fluid": i.fluid,
      "p-invalid": n.$invalid
    }];
  },
  header: "p-listbox-header",
  pcFilter: "p-listbox-filter",
  listContainer: "p-listbox-list-container",
  list: "p-listbox-list",
  optionGroup: "p-listbox-option-group",
  option: function(e) {
    var n = e.instance, i = e.props, o = e.option, s = e.index, a = e.getItemOptions;
    return ["p-listbox-option", {
      "p-listbox-option-selected": n.isSelected(o) && i.highlightOnSelect,
      "p-focus": n.focusedOptionIndex === n.getOptionIndex(s, a),
      "p-disabled": n.isOptionDisabled(o)
    }];
  },
  optionCheckIcon: "p-listbox-option-check-icon",
  optionBlankIcon: "p-listbox-option-blank-icon",
  emptyMessage: "p-listbox-empty-message"
}, _n = be.extend({
  name: "listbox",
  style: $n,
  classes: On
}), Ln = {
  name: "BaseListbox",
  extends: Ft,
  props: {
    options: Array,
    optionLabel: null,
    optionValue: null,
    optionDisabled: null,
    optionGroupLabel: null,
    optionGroupChildren: null,
    listStyle: null,
    scrollHeight: {
      type: String,
      default: "14rem"
    },
    dataKey: null,
    multiple: {
      type: Boolean,
      default: !1
    },
    metaKeySelection: {
      type: Boolean,
      default: !1
    },
    filter: Boolean,
    filterPlaceholder: String,
    filterLocale: String,
    filterMatchMode: {
      type: String,
      default: "contains"
    },
    filterFields: {
      type: Array,
      default: null
    },
    virtualScrollerOptions: {
      type: Object,
      default: null
    },
    autoOptionFocus: {
      type: Boolean,
      default: !0
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    focusOnHover: {
      type: Boolean,
      default: !0
    },
    highlightOnSelect: {
      type: Boolean,
      default: !0
    },
    checkmark: {
      type: Boolean,
      default: !1
    },
    filterMessage: {
      type: String,
      default: null
    },
    selectionMessage: {
      type: String,
      default: null
    },
    emptySelectionMessage: {
      type: String,
      default: null
    },
    emptyFilterMessage: {
      type: String,
      default: null
    },
    emptyMessage: {
      type: String,
      default: null
    },
    filterIcon: {
      type: String,
      default: void 0
    },
    striped: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    fluid: {
      type: Boolean,
      default: null
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: _n,
  provide: function() {
    return {
      $pcListbox: this,
      $parentInstance: this
    };
  }
};
function $e(t) {
  return An(t) || Bn(t) || Mn(t) || Dn();
}
function Dn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Mn(t, e) {
  if (t) {
    if (typeof t == "string") return Ae(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ae(t, e) : void 0;
  }
}
function Bn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function An(t) {
  if (Array.isArray(t)) return Ae(t);
}
function Ae(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
var ht = {
  name: "Listbox",
  extends: Ln,
  inheritAttrs: !1,
  emits: ["change", "focus", "blur", "filter", "item-dblclick", "option-dblclick"],
  list: null,
  virtualScroller: null,
  optionTouched: !1,
  startRangeIndex: -1,
  searchTimeout: null,
  searchValue: "",
  data: function() {
    return {
      filterValue: null,
      focused: !1,
      focusedOptionIndex: -1
    };
  },
  watch: {
    options: function() {
      this.autoUpdateModel();
    }
  },
  mounted: function() {
    this.autoUpdateModel();
  },
  methods: {
    getOptionIndex: function(e, n) {
      return this.virtualScrollerDisabled ? e : n && n(e).index;
    },
    getOptionLabel: function(e) {
      return this.optionLabel ? le(e, this.optionLabel) : typeof e == "string" || typeof e == "number" || typeof e == "boolean" ? e : null;
    },
    getOptionValue: function(e) {
      return this.optionValue ? le(e, this.optionValue) : e;
    },
    getOptionRenderKey: function(e, n) {
      return (this.dataKey ? le(e, this.dataKey) : this.getOptionLabel(e)) + "_" + n;
    },
    getPTOptions: function(e, n, i, o) {
      return this.ptm(o, {
        context: {
          selected: this.isSelected(e),
          focused: this.focusedOptionIndex === this.getOptionIndex(i, n),
          disabled: this.isOptionDisabled(e)
        }
      });
    },
    isOptionDisabled: function(e) {
      return this.optionDisabled ? le(e, this.optionDisabled) : !1;
    },
    isOptionGroup: function(e) {
      return this.optionGroupLabel && e.optionGroup && e.group;
    },
    getOptionGroupLabel: function(e) {
      return le(e, this.optionGroupLabel);
    },
    getOptionGroupChildren: function(e) {
      return le(e, this.optionGroupChildren);
    },
    getAriaPosInset: function(e) {
      var n = this;
      return (this.optionGroupLabel ? e - this.visibleOptions.slice(0, e).filter(function(i) {
        return n.isOptionGroup(i);
      }).length : e) + 1;
    },
    onFirstHiddenFocus: function() {
      Ce(this.list);
      var e = je(this.$el, ':not([data-p-hidden-focusable="true"])');
      this.$refs.lastHiddenFocusableElement.tabIndex = yt(e) ? void 0 : -1, this.$refs.firstHiddenFocusableElement.tabIndex = -1;
    },
    onLastHiddenFocus: function(e) {
      var n = e.relatedTarget;
      if (n === this.list) {
        var i = je(this.$el, ':not([data-p-hidden-focusable="true"])');
        Ce(i), this.$refs.firstHiddenFocusableElement.tabIndex = void 0;
      } else
        Ce(this.$refs.firstHiddenFocusableElement);
      this.$refs.lastHiddenFocusableElement.tabIndex = -1;
    },
    onFocusout: function(e) {
      !this.$el.contains(e.relatedTarget) && this.$refs.lastHiddenFocusableElement && this.$refs.firstHiddenFocusableElement && (this.$refs.lastHiddenFocusableElement.tabIndex = this.$refs.firstHiddenFocusableElement.tabIndex = void 0);
    },
    onListFocus: function(e) {
      this.focused = !0, this.focusedOptionIndex = this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : this.autoOptionFocus ? this.findFirstFocusedOptionIndex() : this.findSelectedOptionIndex(), this.autoUpdateModel(), this.scrollInView(this.focusedOptionIndex), this.$emit("focus", e);
    },
    onListBlur: function(e) {
      this.focused = !1, this.focusedOptionIndex = this.startRangeIndex = -1, this.searchValue = "", this.$emit("blur", e);
    },
    onListKeyDown: function(e) {
      var n = this, i = e.metaKey || e.ctrlKey;
      switch (e.code) {
        case "ArrowDown":
          this.onArrowDownKey(e);
          break;
        case "ArrowUp":
          this.onArrowUpKey(e);
          break;
        case "Home":
          this.onHomeKey(e);
          break;
        case "End":
          this.onEndKey(e);
          break;
        case "PageDown":
          this.onPageDownKey(e);
          break;
        case "PageUp":
          this.onPageUpKey(e);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onSpaceKey(e);
          break;
        case "Tab":
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.onShiftKey(e);
          break;
        default:
          if (this.multiple && e.code === "KeyA" && i) {
            var o = this.visibleOptions.filter(function(s) {
              return n.isValidOption(s);
            }).map(function(s) {
              return n.getOptionValue(s);
            });
            this.updateModel(e, o), e.preventDefault();
            break;
          }
          !i && bt(e.key) && (this.searchOptions(e, e.key), e.preventDefault());
          break;
      }
    },
    onOptionSelect: function(e, n) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      this.disabled || this.isOptionDisabled(n) || (this.multiple ? this.onOptionSelectMultiple(e, n) : this.onOptionSelectSingle(e, n), this.optionTouched = !1, i !== -1 && (this.focusedOptionIndex = i));
    },
    onOptionMouseDown: function(e, n) {
      this.changeFocusedOptionIndex(e, n);
    },
    onOptionMouseMove: function(e, n) {
      this.focusOnHover && this.focused && this.changeFocusedOptionIndex(e, n);
    },
    onOptionTouchEnd: function() {
      this.disabled || (this.optionTouched = !0);
    },
    onOptionDblClick: function(e, n) {
      this.$emit("item-dblclick", {
        originalEvent: e,
        value: n
      }), this.$emit("option-dblclick", {
        originalEvent: e,
        value: n
      });
    },
    onOptionSelectSingle: function(e, n) {
      var i = this.isSelected(n), o = !1, s = null, a = this.optionTouched ? !1 : this.metaKeySelection;
      if (a) {
        var u = e && (e.metaKey || e.ctrlKey);
        i ? u && (s = null, o = !0) : (s = this.getOptionValue(n), o = !0);
      } else
        s = i ? null : this.getOptionValue(n), o = !0;
      o && this.updateModel(e, s);
    },
    onOptionSelectMultiple: function(e, n) {
      var i = this.isSelected(n), o = null, s = this.optionTouched ? !1 : this.metaKeySelection;
      if (s) {
        var a = e.metaKey || e.ctrlKey;
        i ? o = a ? this.removeOption(n) : [this.getOptionValue(n)] : (o = a ? this.d_value || [] : [], o = [].concat($e(o), [this.getOptionValue(n)]));
      } else
        o = i ? this.removeOption(n) : [].concat($e(this.d_value || []), [this.getOptionValue(n)]);
      this.updateModel(e, o);
    },
    onOptionSelectRange: function(e) {
      var n = this, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : -1, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : -1;
      if (i === -1 && (i = this.findNearestSelectedOptionIndex(o, !0)), o === -1 && (o = this.findNearestSelectedOptionIndex(i)), i !== -1 && o !== -1) {
        var s = Math.min(i, o), a = Math.max(i, o), u = this.visibleOptions.slice(s, a + 1).filter(function(h) {
          return n.isValidOption(h);
        }).map(function(h) {
          return n.getOptionValue(h);
        });
        this.updateModel(e, u);
      }
    },
    onFilterChange: function(e) {
      this.$emit("filter", {
        originalEvent: e,
        value: e.target.value,
        filterValue: this.visibleOptions
      }), this.focusedOptionIndex = this.startRangeIndex = -1;
    },
    onFilterKeyDown: function(e) {
      switch (e.code) {
        case "ArrowDown":
          this.onArrowDownKey(e);
          break;
        case "ArrowUp":
          this.onArrowUpKey(e);
          break;
        case "ArrowLeft":
        case "ArrowRight":
          this.onArrowLeftKey(e, !0);
          break;
        case "Home":
          this.onHomeKey(e, !0);
          break;
        case "End":
          this.onEndKey(e, !0);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(e);
          break;
        case "ShiftLeft":
        case "ShiftRight":
          this.onShiftKey(e);
          break;
      }
    },
    onArrowDownKey: function(e) {
      var n = this.focusedOptionIndex !== -1 ? this.findNextOptionIndex(this.focusedOptionIndex) : this.findFirstFocusedOptionIndex();
      this.multiple && e.shiftKey && this.onOptionSelectRange(e, this.startRangeIndex, n), this.changeFocusedOptionIndex(e, n), e.preventDefault();
    },
    onArrowUpKey: function(e) {
      var n = this.focusedOptionIndex !== -1 ? this.findPrevOptionIndex(this.focusedOptionIndex) : this.findLastFocusedOptionIndex();
      this.multiple && e.shiftKey && this.onOptionSelectRange(e, n, this.startRangeIndex), this.changeFocusedOptionIndex(e, n), e.preventDefault();
    },
    onArrowLeftKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      n && (this.focusedOptionIndex = -1);
    },
    onHomeKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = e.currentTarget;
        e.shiftKey ? i.setSelectionRange(0, e.target.selectionStart) : (i.setSelectionRange(0, 0), this.focusedOptionIndex = -1);
      } else {
        var o = e.metaKey || e.ctrlKey, s = this.findFirstOptionIndex();
        this.multiple && e.shiftKey && o && this.onOptionSelectRange(e, s, this.startRangeIndex), this.changeFocusedOptionIndex(e, s);
      }
      e.preventDefault();
    },
    onEndKey: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1;
      if (n) {
        var i = e.currentTarget;
        if (e.shiftKey)
          i.setSelectionRange(e.target.selectionStart, i.value.length);
        else {
          var o = i.value.length;
          i.setSelectionRange(o, o), this.focusedOptionIndex = -1;
        }
      } else {
        var s = e.metaKey || e.ctrlKey, a = this.findLastOptionIndex();
        this.multiple && e.shiftKey && s && this.onOptionSelectRange(e, this.startRangeIndex, a), this.changeFocusedOptionIndex(e, a);
      }
      e.preventDefault();
    },
    onPageUpKey: function(e) {
      this.scrollInView(0), e.preventDefault();
    },
    onPageDownKey: function(e) {
      this.scrollInView(this.visibleOptions.length - 1), e.preventDefault();
    },
    onEnterKey: function(e) {
      this.focusedOptionIndex !== -1 && (this.multiple && e.shiftKey ? this.onOptionSelectRange(e, this.focusedOptionIndex) : this.onOptionSelect(e, this.visibleOptions[this.focusedOptionIndex]));
    },
    onSpaceKey: function(e) {
      e.preventDefault(), this.onEnterKey(e);
    },
    onShiftKey: function() {
      this.startRangeIndex = this.focusedOptionIndex;
    },
    isOptionMatched: function(e) {
      var n;
      return this.isValidOption(e) && typeof this.getOptionLabel(e) == "string" && ((n = this.getOptionLabel(e)) === null || n === void 0 ? void 0 : n.toLocaleLowerCase(this.filterLocale).startsWith(this.searchValue.toLocaleLowerCase(this.filterLocale)));
    },
    isValidOption: function(e) {
      return ue(e) && !(this.isOptionDisabled(e) || this.isOptionGroup(e));
    },
    isValidSelectedOption: function(e) {
      return this.isValidOption(e) && this.isSelected(e);
    },
    isEquals: function(e, n) {
      return He(e, n, this.equalityKey);
    },
    isSelected: function(e) {
      var n = this, i = this.getOptionValue(e);
      return this.multiple ? (this.d_value || []).some(function(o) {
        return n.isEquals(o, i);
      }) : this.isEquals(this.d_value, i);
    },
    findFirstOptionIndex: function() {
      var e = this;
      return this.visibleOptions.findIndex(function(n) {
        return e.isValidOption(n);
      });
    },
    findLastOptionIndex: function() {
      var e = this;
      return ye(this.visibleOptions, function(n) {
        return e.isValidOption(n);
      });
    },
    findNextOptionIndex: function(e) {
      var n = this, i = e < this.visibleOptions.length - 1 ? this.visibleOptions.slice(e + 1).findIndex(function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i + e + 1 : e;
    },
    findPrevOptionIndex: function(e) {
      var n = this, i = e > 0 ? ye(this.visibleOptions.slice(0, e), function(o) {
        return n.isValidOption(o);
      }) : -1;
      return i > -1 ? i : e;
    },
    findSelectedOptionIndex: function() {
      var e = this;
      if (this.$filled)
        if (this.multiple) {
          for (var n = function() {
            var a = e.d_value[o], u = e.visibleOptions.findIndex(function(h) {
              return e.isValidSelectedOption(h) && e.isEquals(a, e.getOptionValue(h));
            });
            if (u > -1) return {
              v: u
            };
          }, i, o = this.d_value.length - 1; o >= 0; o--)
            if (i = n(), i) return i.v;
        } else
          return this.visibleOptions.findIndex(function(s) {
            return e.isValidSelectedOption(s);
          });
      return -1;
    },
    findFirstSelectedOptionIndex: function() {
      var e = this;
      return this.$filled ? this.visibleOptions.findIndex(function(n) {
        return e.isValidSelectedOption(n);
      }) : -1;
    },
    findLastSelectedOptionIndex: function() {
      var e = this;
      return this.$filled ? ye(this.visibleOptions, function(n) {
        return e.isValidSelectedOption(n);
      }) : -1;
    },
    findNextSelectedOptionIndex: function(e) {
      var n = this, i = this.$filled && e < this.visibleOptions.length - 1 ? this.visibleOptions.slice(e + 1).findIndex(function(o) {
        return n.isValidSelectedOption(o);
      }) : -1;
      return i > -1 ? i + e + 1 : -1;
    },
    findPrevSelectedOptionIndex: function(e) {
      var n = this, i = this.$filled && e > 0 ? ye(this.visibleOptions.slice(0, e), function(o) {
        return n.isValidSelectedOption(o);
      }) : -1;
      return i > -1 ? i : -1;
    },
    findNearestSelectedOptionIndex: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, i = -1;
      return this.$filled && (n ? (i = this.findPrevSelectedOptionIndex(e), i = i === -1 ? this.findNextSelectedOptionIndex(e) : i) : (i = this.findNextSelectedOptionIndex(e), i = i === -1 ? this.findPrevSelectedOptionIndex(e) : i)), i > -1 ? i : e;
    },
    findFirstFocusedOptionIndex: function() {
      var e = this.findFirstSelectedOptionIndex();
      return e < 0 ? this.findFirstOptionIndex() : e;
    },
    findLastFocusedOptionIndex: function() {
      var e = this.findLastSelectedOptionIndex();
      return e < 0 ? this.findLastOptionIndex() : e;
    },
    searchOptions: function(e, n) {
      var i = this;
      this.searchValue = (this.searchValue || "") + n;
      var o = -1;
      ue(this.searchValue) && (this.focusedOptionIndex !== -1 ? (o = this.visibleOptions.slice(this.focusedOptionIndex).findIndex(function(s) {
        return i.isOptionMatched(s);
      }), o = o === -1 ? this.visibleOptions.slice(0, this.focusedOptionIndex).findIndex(function(s) {
        return i.isOptionMatched(s);
      }) : o + this.focusedOptionIndex) : o = this.visibleOptions.findIndex(function(s) {
        return i.isOptionMatched(s);
      }), o === -1 && this.focusedOptionIndex === -1 && (o = this.findFirstFocusedOptionIndex()), o !== -1 && this.changeFocusedOptionIndex(e, o)), this.searchTimeout && clearTimeout(this.searchTimeout), this.searchTimeout = setTimeout(function() {
        i.searchValue = "", i.searchTimeout = null;
      }, 500);
    },
    removeOption: function(e) {
      var n = this;
      return this.d_value.filter(function(i) {
        return !He(i, n.getOptionValue(e), n.equalityKey);
      });
    },
    changeFocusedOptionIndex: function(e, n) {
      this.focusedOptionIndex !== n && (this.focusedOptionIndex = n, this.scrollInView(), this.selectOnFocus && !this.multiple && this.onOptionSelect(e, this.visibleOptions[n]));
    },
    scrollInView: function() {
      var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : -1;
      this.$nextTick(function() {
        var i = n !== -1 ? "".concat(e.$id, "_").concat(n) : e.focusedOptionId, o = et(e.list, 'li[id="'.concat(i, '"]'));
        o ? o.scrollIntoView && o.scrollIntoView({
          block: "nearest",
          inline: "nearest",
          behavior: "smooth"
        }) : e.virtualScrollerDisabled || e.virtualScroller && e.virtualScroller.scrollToIndex(n !== -1 ? n : e.focusedOptionIndex);
      });
    },
    autoUpdateModel: function() {
      this.selectOnFocus && this.autoOptionFocus && !this.$filled && !this.multiple && this.focused && (this.focusedOptionIndex = this.findFirstFocusedOptionIndex(), this.onOptionSelect(null, this.visibleOptions[this.focusedOptionIndex]));
    },
    updateModel: function(e, n) {
      this.writeValue(n, e), this.$emit("change", {
        originalEvent: e,
        value: n
      });
    },
    listRef: function(e, n) {
      this.list = e, n && n(e);
    },
    virtualScrollerRef: function(e) {
      this.virtualScroller = e;
    }
  },
  computed: {
    optionsListFlat: function() {
      return this.filterValue ? Ue.filter(this.options, this.searchFields, this.filterValue, this.filterMatchMode, this.filterLocale) : this.options;
    },
    optionsListGroup: function() {
      var e = this, n = [];
      return (this.options || []).forEach(function(i) {
        var o = e.getOptionGroupChildren(i) || [], s = e.filterValue ? Ue.filter(o, e.searchFields, e.filterValue, e.filterMatchMode, e.filterLocale) : o;
        s != null && s.length && n.push.apply(n, [{
          optionGroup: i,
          group: !0
        }].concat($e(s)));
      }), n;
    },
    visibleOptions: function() {
      return this.optionGroupLabel ? this.optionsListGroup : this.optionsListFlat;
    },
    // @deprecated use $filled instead
    hasSelectedOption: function() {
      return ue(this.d_value);
    },
    equalityKey: function() {
      return this.optionValue ? null : this.dataKey;
    },
    searchFields: function() {
      return this.filterFields || [this.optionLabel];
    },
    filterResultMessageText: function() {
      return ue(this.visibleOptions) ? this.filterMessageText.replaceAll("{0}", this.visibleOptions.length) : this.emptyFilterMessageText;
    },
    filterMessageText: function() {
      return this.filterMessage || this.$primevue.config.locale.searchMessage || "";
    },
    emptyFilterMessageText: function() {
      return this.emptyFilterMessage || this.$primevue.config.locale.emptySearchMessage || this.$primevue.config.locale.emptyFilterMessage || "";
    },
    emptyMessageText: function() {
      return this.emptyMessage || this.$primevue.config.locale.emptyMessage || "";
    },
    selectionMessageText: function() {
      return this.selectionMessage || this.$primevue.config.locale.selectionMessage || "";
    },
    emptySelectionMessageText: function() {
      return this.emptySelectionMessage || this.$primevue.config.locale.emptySelectionMessage || "";
    },
    selectedMessageText: function() {
      return this.$filled ? this.selectionMessageText.replaceAll("{0}", this.multiple ? this.d_value.length : "1") : this.emptySelectionMessageText;
    },
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? "".concat(this.$id, "_").concat(this.focusedOptionIndex) : null;
    },
    ariaSetSize: function() {
      var e = this;
      return this.visibleOptions.filter(function(n) {
        return !e.isOptionGroup(n);
      }).length;
    },
    virtualScrollerDisabled: function() {
      return !this.virtualScrollerOptions;
    },
    containerDataP: function() {
      return tt({
        invalid: this.$invalid,
        disabled: this.disabled
      });
    }
  },
  directives: {
    ripple: gt
  },
  components: {
    InputText: Re,
    VirtualScroller: pt,
    InputIcon: ct,
    IconField: ut,
    SearchIcon: lt,
    CheckIcon: rt,
    BlankIcon: at
  }
}, zn = ["id", "data-p"], Tn = ["tabindex"], Fn = ["id", "aria-multiselectable", "aria-label", "aria-labelledby", "aria-activedescendant", "aria-disabled"], Vn = ["id"], Pn = ["id", "aria-label", "aria-selected", "aria-disabled", "aria-setsize", "aria-posinset", "onClick", "onMousedown", "onMousemove", "onDblclick", "data-p-selected", "data-p-focused", "data-p-disabled"], Rn = ["tabindex"];
function En(t, e, n, i, o, s) {
  var a = ie("InputText"), u = ie("SearchIcon"), h = ie("InputIcon"), v = ie("IconField"), g = ie("CheckIcon"), I = ie("BlankIcon"), k = ie("VirtualScroller"), d = St("ripple");
  return c(), p("div", B({
    id: t.$id,
    class: t.cx("root"),
    onFocusout: e[7] || (e[7] = function() {
      return s.onFocusout && s.onFocusout.apply(s, arguments);
    }),
    "data-p": s.containerDataP
  }, t.ptmi("root")), [l("span", B({
    ref: "firstHiddenFocusableElement",
    role: "presentation",
    "aria-hidden": "true",
    class: "p-hidden-accessible p-hidden-focusable",
    tabindex: t.disabled ? -1 : t.tabindex,
    onFocus: e[0] || (e[0] = function() {
      return s.onFirstHiddenFocus && s.onFirstHiddenFocus.apply(s, arguments);
    })
  }, t.ptm("hiddenFirstFocusableEl"), {
    "data-p-hidden-accessible": !0,
    "data-p-hidden-focusable": !0
  }), null, 16, Tn), t.$slots.header ? (c(), p("div", B({
    key: 0,
    class: t.cx("header")
  }, t.ptm("header")), [K(t.$slots, "header", {
    value: t.d_value,
    options: s.visibleOptions
  })], 16)) : C("", !0), t.filter ? (c(), p("div", B({
    key: 1,
    class: t.cx("header")
  }, t.ptm("header")), [T(v, {
    unstyled: t.unstyled,
    pt: t.ptm("pcFilterContainer")
  }, {
    default: se(function() {
      return [T(a, {
        modelValue: o.filterValue,
        "onUpdate:modelValue": e[1] || (e[1] = function(r) {
          return o.filterValue = r;
        }),
        type: "text",
        class: re(t.cx("pcFilter")),
        placeholder: t.filterPlaceholder,
        role: "searchbox",
        autocomplete: "off",
        disabled: t.disabled,
        unstyled: t.unstyled,
        "aria-owns": t.$id + "_list",
        "aria-activedescendant": s.focusedOptionId,
        tabindex: !t.disabled && !o.focused ? t.tabindex : -1,
        onInput: s.onFilterChange,
        onKeydown: s.onFilterKeyDown,
        pt: t.ptm("pcFilter")
      }, null, 8, ["modelValue", "class", "placeholder", "disabled", "unstyled", "aria-owns", "aria-activedescendant", "tabindex", "onInput", "onKeydown", "pt"]), T(h, {
        unstyled: t.unstyled,
        pt: t.ptm("pcFilterIconContainer")
      }, {
        default: se(function() {
          return [K(t.$slots, "filtericon", {}, function() {
            return [t.filterIcon ? (c(), p("span", B({
              key: 0,
              class: t.filterIcon
            }, t.ptm("filterIcon")), null, 16)) : (c(), E(u, Ct(B({
              key: 1
            }, t.ptm("filterIcon"))), null, 16))];
          })];
        }),
        _: 3
      }, 8, ["unstyled", "pt"])];
    }),
    _: 3
  }, 8, ["unstyled", "pt"]), l("span", B({
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, t.ptm("hiddenFilterResult"), {
    "data-p-hidden-accessible": !0
  }), $(s.filterResultMessageText), 17)], 16)) : C("", !0), l("div", B({
    class: t.cx("listContainer"),
    style: [{
      "max-height": s.virtualScrollerDisabled ? t.scrollHeight : ""
    }, t.listStyle]
  }, t.ptm("listContainer")), [T(k, B({
    ref: s.virtualScrollerRef
  }, t.virtualScrollerOptions, {
    items: s.visibleOptions,
    style: [{
      height: t.scrollHeight
    }, t.listStyle],
    tabindex: -1,
    disabled: s.virtualScrollerDisabled,
    pt: t.ptm("virtualScroller")
  }), $t({
    content: se(function(r) {
      var b = r.styleClass, w = r.contentRef, S = r.items, x = r.getItemOptions, V = r.contentStyle, A = r.itemSize;
      return [l("ul", B({
        ref: function(f) {
          return s.listRef(f, w);
        },
        id: t.$id + "_list",
        class: [t.cx("list"), b],
        style: V,
        tabindex: -1,
        role: "listbox",
        "aria-multiselectable": t.multiple,
        "aria-label": t.ariaLabel,
        "aria-labelledby": t.ariaLabelledby,
        "aria-activedescendant": o.focused ? s.focusedOptionId : void 0,
        "aria-disabled": t.disabled,
        onFocus: e[3] || (e[3] = function() {
          return s.onListFocus && s.onListFocus.apply(s, arguments);
        }),
        onBlur: e[4] || (e[4] = function() {
          return s.onListBlur && s.onListBlur.apply(s, arguments);
        }),
        onKeydown: e[5] || (e[5] = function() {
          return s.onListKeyDown && s.onListKeyDown.apply(s, arguments);
        })
      }, t.ptm("list")), [(c(!0), p(j, null, ee(S, function(m, f) {
        return c(), p(j, {
          key: s.getOptionRenderKey(m, s.getOptionIndex(f, x))
        }, [s.isOptionGroup(m) ? (c(), p("li", B({
          key: 0,
          id: t.$id + "_" + s.getOptionIndex(f, x),
          style: {
            height: A ? A + "px" : void 0
          },
          class: t.cx("optionGroup"),
          role: "option"
        }, {
          ref_for: !0
        }, t.ptm("optionGroup")), [K(t.$slots, "optiongroup", {
          option: m.optionGroup,
          index: s.getOptionIndex(f, x)
        }, function() {
          return [N($(s.getOptionGroupLabel(m.optionGroup)), 1)];
        })], 16, Vn)) : W((c(), p("li", B({
          key: 1,
          id: t.$id + "_" + s.getOptionIndex(f, x),
          style: {
            height: A ? A + "px" : void 0
          },
          class: t.cx("option", {
            option: m,
            index: f,
            getItemOptions: x
          }),
          role: "option",
          "aria-label": s.getOptionLabel(m),
          "aria-selected": s.isSelected(m),
          "aria-disabled": s.isOptionDisabled(m),
          "aria-setsize": s.ariaSetSize,
          "aria-posinset": s.getAriaPosInset(s.getOptionIndex(f, x)),
          onClick: function(z) {
            return s.onOptionSelect(z, m, s.getOptionIndex(f, x));
          },
          onMousedown: function(z) {
            return s.onOptionMouseDown(z, s.getOptionIndex(f, x));
          },
          onMousemove: function(z) {
            return s.onOptionMouseMove(z, s.getOptionIndex(f, x));
          },
          onTouchend: e[2] || (e[2] = function(y) {
            return s.onOptionTouchEnd();
          }),
          onDblclick: function(z) {
            return s.onOptionDblClick(z, m);
          }
        }, {
          ref_for: !0
        }, s.getPTOptions(m, x, f, "option"), {
          "data-p-selected": !t.checkmark && s.isSelected(m),
          "data-p-focused": o.focusedOptionIndex === s.getOptionIndex(f, x),
          "data-p-disabled": s.isOptionDisabled(m)
        }), [t.checkmark ? (c(), p(j, {
          key: 0
        }, [s.isSelected(m) ? (c(), E(g, B({
          key: 0,
          class: t.cx("optionCheckIcon")
        }, {
          ref_for: !0
        }, t.ptm("optionCheckIcon")), null, 16, ["class"])) : (c(), E(I, B({
          key: 1,
          class: t.cx("optionBlankIcon")
        }, {
          ref_for: !0
        }, t.ptm("optionBlankIcon")), null, 16, ["class"]))], 64)) : C("", !0), K(t.$slots, "option", {
          option: m,
          selected: s.isSelected(m),
          index: s.getOptionIndex(f, x)
        }, function() {
          return [N($(s.getOptionLabel(m)), 1)];
        })], 16, Pn)), [[d]])], 64);
      }), 128)), o.filterValue && (!S || S && S.length === 0) ? (c(), p("li", B({
        key: 0,
        class: t.cx("emptyMessage"),
        role: "option"
      }, t.ptm("emptyMessage")), [K(t.$slots, "emptyfilter", {}, function() {
        return [N($(s.emptyFilterMessageText), 1)];
      })], 16)) : !t.options || t.options && t.options.length === 0 ? (c(), p("li", B({
        key: 1,
        class: t.cx("emptyMessage"),
        role: "option"
      }, t.ptm("emptyMessage")), [K(t.$slots, "empty", {}, function() {
        return [N($(s.emptyMessageText), 1)];
      })], 16)) : C("", !0)], 16, Fn)];
    }),
    _: 2
  }, [t.$slots.loader ? {
    name: "loader",
    fn: se(function(r) {
      var b = r.options;
      return [K(t.$slots, "loader", {
        options: b
      })];
    }),
    key: "0"
  } : void 0]), 1040, ["items", "style", "disabled", "pt"])], 16), K(t.$slots, "footer", {
    value: t.d_value,
    options: s.visibleOptions
  }), !t.options || t.options && t.options.length === 0 ? (c(), p("span", B({
    key: 2,
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, t.ptm("hiddenEmptyMessage"), {
    "data-p-hidden-accessible": !0
  }), $(s.emptyMessageText), 17)) : C("", !0), l("span", B({
    role: "status",
    "aria-live": "polite",
    class: "p-hidden-accessible"
  }, t.ptm("hiddenSelectedMessage"), {
    "data-p-hidden-accessible": !0
  }), $(s.selectedMessageText), 17), l("span", B({
    ref: "lastHiddenFocusableElement",
    role: "presentation",
    "aria-hidden": "true",
    class: "p-hidden-accessible p-hidden-focusable",
    tabindex: t.disabled ? -1 : t.tabindex,
    onFocus: e[6] || (e[6] = function() {
      return s.onLastHiddenFocus && s.onLastHiddenFocus.apply(s, arguments);
    })
  }, t.ptm("hiddenLastFocusableEl"), {
    "data-p-hidden-accessible": !0,
    "data-p-hidden-focusable": !0
  }), null, 16, Rn)], 16, zn);
}
ht.render = En;
const Kn = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Nn = ["disabled"], Un = { class: "ac-card-head" }, Hn = { class: "ac-muted" }, jn = { class: "ac-field" }, Gn = { class: "ac-seg" }, Wn = {
  key: 0,
  class: "ac-field"
}, qn = {
  key: 1,
  class: "ac-muted"
}, Zn = { class: "ac-field" }, Jn = { class: "ac-field" }, Yn = { class: "ac-row-fields" }, Qn = { class: "ac-field" }, Xn = ["placeholder"], ei = { class: "ac-field" }, ti = ["placeholder"], ni = { class: "ac-field" }, ii = { class: "ac-row-fields" }, si = { class: "ac-field" }, oi = { class: "ac-field" }, ai = ["placeholder"], ri = {
  key: 2,
  class: "ac-field"
}, li = { class: "ac-checks" }, ui = ["value"], ci = { class: "ac-field" }, di = { class: "ac-dialog-foot" }, pi = ["disabled"], hi = {
  key: 3,
  class: "kx-err"
}, fi = /* @__PURE__ */ oe({
  __name: "image-form",
  props: {
    edit: {},
    capabilities: {}
  },
  emits: ["saved", "cancel", "busy"],
  setup(t, { emit: e }) {
    const n = t, i = e, o = Ee();
    function s(d = o.value.default_image.settings) {
      return d ? {
        ref: "",
        mode: "pull",
        dockerfile: "",
        label: "",
        home: o.value.default_image.home,
        ...d,
        extra_args: [...d.extra_args],
        allows: [...d.allows],
        extra: ""
      } : null;
    }
    const a = _(s()), u = _(!1);
    ne(() => a.value?.ref, (d) => {
      a.value && !n.edit && !u.value && d !== void 0 && (a.value.label = d);
    });
    const h = _(!1), v = _("");
    ne(() => n.edit, (d) => {
      if (v.value = "", u.value = !!d, !d) {
        a.value = s();
        return;
      }
      if (!d.settings) {
        a.value = null;
        return;
      }
      const r = d.settings;
      a.value = {
        ...r,
        ref: d.image.ref,
        label: d.image.label,
        home: d.image.home,
        mode: d.dockerfile ? "build" : "pull",
        dockerfile: d.dockerfile ?? "",
        extra: r.extra_args.join(`
`),
        allows: [...r.allows]
      };
    }, { immediate: !0 });
    function g() {
      const d = o.value.default_image;
      u.value = !0;
      const r = s();
      a.value = r ? { ...r, ref: d.ref, label: d.label, home: d.home, mode: "build", dockerfile: d.dockerfile } : null;
    }
    function I() {
      const d = a.value;
      if (!d) throw new Error("Image settings are unavailable.");
      return {
        label: d.label,
        home: d.home,
        memory: d.memory,
        cpus: d.cpus,
        pids_limit: Number(d.pids_limit) || 0,
        gpus: d.gpus,
        network: d.network,
        extra_args: d.extra.split(`
`).map((r) => r.trim()).filter(Boolean),
        allows: [...d.allows]
      };
    }
    async function k() {
      if (!(!a.value || h.value)) {
        v.value = "", h.value = !0, i("busy", !0);
        try {
          let d;
          if (n.edit) {
            const r = await Q.updateImage(n.edit.image.id, { ...I(), ref: a.value.ref, dockerfile: a.value.mode === "build" ? a.value.dockerfile : "" });
            r.build_error && (d = `Settings saved. Build preparation has not started: ${r.build_error.message}. Use Prepare image to retry.`);
          } else {
            const r = a.value, b = await Q.createImage({ ...I(), ref: r.ref, dockerfile: r.mode === "build" ? r.dockerfile : "" });
            b.build_error && (d = `Image created. Build preparation has not started: ${b.build_error.message}. Use Prepare image to retry.`), a.value = s();
          }
          i("saved", d);
        } catch (d) {
          v.value = X(d, "Could not save the image.");
        } finally {
          h.value = !1, i("busy", !1);
        }
      }
    }
    return (d, r) => a.value ? (c(), p("fieldset", {
      key: 1,
      class: "ac-form",
      disabled: h.value
    }, [
      l("div", Un, [
        l("span", Hn, $(t.edit ? "Container settings" : "Use an image reference or the default agent recipe."), 1),
        t.edit ? C("", !0) : (c(), p("button", {
          key: 0,
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: g
        }, [
          T(O(H), { icon: "tabler:sparkles" }),
          r[15] || (r[15] = N(" Default agent image", -1))
        ]))
      ]),
      l("label", jn, [
        r[16] || (r[16] = l("span", null, "Image reference", -1)),
        W(l("input", {
          "onUpdate:modelValue": r[0] || (r[0] = (b) => a.value.ref = b),
          class: "ac-mono kx-focus-halo",
          placeholder: "registry/name:tag"
        }, null, 512), [
          [te, a.value.ref]
        ])
      ]),
      l("div", Gn, [
        l("button", {
          type: "button",
          class: re(["kx-focus-outline", { active: a.value.mode === "pull" }]),
          onClick: r[1] || (r[1] = (b) => a.value.mode = "pull")
        }, "Use or pull existing", 2),
        l("button", {
          type: "button",
          class: re(["kx-focus-outline", { active: a.value.mode === "build" }]),
          onClick: r[2] || (r[2] = (b) => a.value.mode = "build")
        }, "Build from Dockerfile", 2)
      ]),
      a.value.mode === "build" ? (c(), p("label", Wn, [
        r[17] || (r[17] = l("span", null, "Dockerfile", -1)),
        W(l("textarea", {
          "onUpdate:modelValue": r[3] || (r[3] = (b) => a.value.dockerfile = b),
          rows: "9",
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [te, a.value.dockerfile]
        ]),
        r[18] || (r[18] = Ot('<small class="ac-hint">Include <code>sh</code>, <code>git</code>, <code>mkdir</code>, <code>dirname</code>, a <code>timeout</code> that supports <code>-k</code>, and the agent CLIs. The image user needs writable home and work directories.</small>', 1))
      ])) : C("", !0),
      t.edit ? (c(), p("p", qn, "Saving container settings prepares the image automatically.")) : C("", !0),
      l("label", Zn, [
        r[19] || (r[19] = l("span", null, "Label", -1)),
        W(l("input", {
          "onUpdate:modelValue": r[4] || (r[4] = (b) => a.value.label = b),
          class: "kx-focus-halo",
          onInput: r[5] || (r[5] = (b) => u.value = !0)
        }, null, 544), [
          [te, a.value.label]
        ])
      ]),
      l("label", Jn, [
        r[20] || (r[20] = l("span", null, "Home directory in the image", -1)),
        W(l("input", {
          "onUpdate:modelValue": r[6] || (r[6] = (b) => a.value.home = b),
          class: "ac-mono kx-focus-halo"
        }, null, 512), [
          [te, a.value.home]
        ])
      ]),
      l("div", Yn, [
        l("label", Qn, [
          r[21] || (r[21] = l("span", null, "Memory", -1)),
          W(l("input", {
            "onUpdate:modelValue": r[7] || (r[7] = (b) => a.value.memory = b),
            class: "ac-mono kx-focus-halo",
            placeholder: O(o).default_image.settings?.memory
          }, null, 8, Xn), [
            [te, a.value.memory]
          ])
        ]),
        l("label", ei, [
          r[22] || (r[22] = l("span", null, "CPUs", -1)),
          W(l("input", {
            "onUpdate:modelValue": r[8] || (r[8] = (b) => a.value.cpus = b),
            class: "ac-mono kx-focus-halo",
            placeholder: O(o).default_image.settings?.cpus
          }, null, 8, ti), [
            [te, a.value.cpus]
          ])
        ]),
        l("label", ni, [
          r[23] || (r[23] = l("span", null, "PIDs limit", -1)),
          W(l("input", {
            "onUpdate:modelValue": r[9] || (r[9] = (b) => a.value.pids_limit = b),
            type: "number",
            min: "0",
            class: "ac-mono kx-focus-halo"
          }, null, 512), [
            [
              te,
              a.value.pids_limit,
              void 0,
              { number: !0 }
            ]
          ])
        ])
      ]),
      l("div", ii, [
        l("label", si, [
          r[24] || (r[24] = l("span", null, "GPUs", -1)),
          W(l("input", {
            "onUpdate:modelValue": r[10] || (r[10] = (b) => a.value.gpus = b),
            class: "ac-mono kx-focus-halo",
            placeholder: "all, or device=0"
          }, null, 512), [
            [te, a.value.gpus]
          ])
        ]),
        l("label", oi, [
          r[25] || (r[25] = l("span", null, "Network", -1)),
          W(l("input", {
            "onUpdate:modelValue": r[11] || (r[11] = (b) => a.value.network = b),
            class: "ac-mono kx-focus-halo",
            placeholder: O(o).default_image.settings?.network
          }, null, 8, ai), [
            [te, a.value.network]
          ])
        ])
      ]),
      t.capabilities?.length ? (c(), p("div", ri, [
        r[26] || (r[26] = l("span", null, "Agents may", -1)),
        l("div", li, [
          (c(!0), p(j, null, ee(t.capabilities, (b) => (c(), p("label", {
            key: b,
            class: "ac-check ac-mono"
          }, [
            W(l("input", {
              "onUpdate:modelValue": r[12] || (r[12] = (w) => a.value.allows = w),
              type: "checkbox",
              class: "kx-focus-outline",
              value: b
            }, null, 8, ui), [
              [_t, a.value.allows]
            ]),
            N(" " + $(b), 1)
          ]))), 128))
        ])
      ])) : C("", !0),
      l("label", ci, [
        r[27] || (r[27] = l("span", null, "Extra Docker arguments", -1)),
        W(l("textarea", {
          "onUpdate:modelValue": r[13] || (r[13] = (b) => a.value.extra = b),
          rows: "3",
          class: "ac-mono kx-focus-halo",
          placeholder: `One argument per line, e.g.
--add-host
host.docker.internal:host-gateway`
        }, null, 512), [
          [te, a.value.extra]
        ])
      ]),
      r[28] || (r[28] = l("p", { class: "ac-hint" }, [
        l("a", {
          class: "ac-link kx-focus-outline",
          href: "https://github.com/kicksideai/chestor/blob/main/autocode/docs/docker-options.md#settings-limits-and-docker-warnings",
          target: "_blank",
          rel: "noopener noreferrer"
        }, "Container limits and isolation")
      ], -1)),
      l("footer", di, [
        l("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: r[14] || (r[14] = (b) => i("cancel"))
        }, "Cancel"),
        l("button", {
          type: "button",
          class: "ac-btn primary kx-focus-halo",
          disabled: h.value || !t.capabilities || !a.value.ref,
          onClick: k
        }, [
          T(O(H), { icon: "tabler:box" }),
          N(" " + $(h.value ? "Saving…" : t.edit ? "Save settings" : a.value.mode === "build" ? "Build image" : "Add image"), 1)
        ], 8, pi)
      ]),
      v.value ? (c(), p("p", hi, $(v.value), 1)) : C("", !0)
    ], 8, Nn)) : (c(), p("p", Kn, $(t.edit ? "Image settings are unavailable." : "Image defaults are unavailable.") + " Ask an administrator to update the image configuration.", 1));
  }
}), mi = { class: "ac-stack" }, vi = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, gi = {
  key: 1,
  class: "kx-loading"
}, bi = {
  key: 2,
  class: "kx-empty"
}, yi = { class: "kx-empty-ico" }, ki = {
  key: 3,
  class: "kx-empty"
}, Ii = { class: "ac-list ac-resource-list" }, xi = { class: "ac-resource-icon" }, wi = { class: "ac-account-main" }, Si = { class: "ac-row-title" }, Ci = {
  key: 0,
  class: "kx-tag-sm ac-tone ready"
}, $i = { class: "ac-muted ac-mono" }, Oi = { class: "ac-chips" }, _i = { class: "ac-muted" }, Li = {
  key: 0,
  class: "kx-err ac-small"
}, Di = { class: "ac-row-actions" }, Mi = ["disabled", "onClick"], Bi = ["onClick"], Ai = ["onClick"], zi = ["onClick"], Ti = { class: "ac-form" }, Fi = { class: "ac-mono" }, Vi = { class: "ac-pre ac-build-log" }, Pi = /* @__PURE__ */ oe({
  __name: "images",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const i = Ee(), o = t, s = n, a = _(!1), u = _(!1), h = _({});
    e({ open: Z });
    const v = _([]), g = _([]), I = _(""), k = _(null), d = _(null), r = J(() => [...new Set(i.value.agents.flatMap((M) => M.capabilities))].sort()), b = _(!1);
    let w = !0, S = 0, x = 0, V = 0;
    nt(() => {
      w = !1, S++, x++;
    });
    async function A(M) {
      const F = S, L = await Q.image(M);
      !w || F !== S || d.value?.id !== M || (d.value = { id: M, ref: L.image.ref, text: L.build_log || "(empty)" });
    }
    const m = Se(async () => {
      try {
        const M = await ot(Q.images, (F) => F.map((L) => L.id), g, () => w, (F) => {
          v.value = F, b.value = !0, I.value = "";
        }, () => {
          m();
        });
        if (!w) return;
        v.value = M, f(M, ++V), d.value && M.some((F) => F.id === d.value?.id) && await A(d.value.id), b.value = !0, I.value = "";
      } catch (M) {
        I.value = X(M, "Could not load images.");
      }
    });
    async function f(M, F) {
      try {
        const L = await Ut([...new Set(M.map((G) => G.owner_user_id))]);
        if (!w || F !== V) return;
        h.value = Object.fromEntries(M.map((G) => [G.id, `Owner: ${L[G.owner_user_id] || G.owner_user_id}`]));
      } catch (L) {
        w && F === V && (I.value = X(L, "Could not load image owners."));
      }
    }
    st(() => g.value, () => {
      m();
    }), we(m);
    async function y(M, F) {
      I.value = "";
      try {
        await M(), await m();
      } catch (L) {
        I.value = X(L, F);
      }
    }
    async function z(M) {
      const F = ++x;
      I.value = "";
      try {
        const L = await Q.image(M.id);
        w && F === x && (k.value = L);
      } catch (L) {
        w && F === x && (I.value = X(L, "Could not load the image settings."));
      }
    }
    function U() {
      x++, a.value = !1, k.value = null;
    }
    function Z() {
      U(), a.value = !0;
    }
    const D = (M) => y(() => Q.prepareImage(M.id), "Could not start the image preparation.");
    function P(M) {
      S++, d.value = { id: M.id, ref: M.ref, text: "Loading…" }, m();
    }
    function R() {
      S++, d.value = null;
    }
    async function ae(M) {
      U(), await m(), M && (I.value = M);
    }
    async function Y(M) {
      if (!await fe.confirm({
        header: "Delete image",
        message: `Delete image "${M.label}"? Tasks keep their history.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      })) return;
      const L = await fe.confirm({
        header: "Docker image",
        message: `Also remove ${M.ref} from Docker on the host? Keeping it lets a later image with the same reference reuse it.`,
        icon: "tabler:brand-docker",
        acceptLabel: "Remove from Docker",
        rejectLabel: "Keep in Docker",
        acceptClass: "p-button-danger"
      });
      x++, k.value?.image.id === M.id && U(), d.value?.id === M.id && R(), I.value = "";
      try {
        await Q.deleteImage(M.id, L), await m();
      } catch (G) {
        I.value = X(G, "Could not delete the image.");
      }
    }
    const q = J(() => v.value.filter((M) => [M.label, M.ref, ...M.agents].join(" ").toLowerCase().includes(o.query.toLowerCase())));
    return ne(v, (M) => s("count", M.length)), (M, F) => (c(), p("div", mi, [
      F[7] || (F[7] = l("p", { class: "ac-hint" }, "Ready means preparation finished. Usable means you can run tasks with the image. Share ready images to make them available to others.", -1)),
      I.value ? (c(), p("p", vi, [
        N($(I.value) + " ", 1),
        l("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: F[0] || (F[0] = //@ts-ignore
          (...L) => O(m) && O(m)(...L))
        }, "Retry")
      ])) : C("", !0),
      !b.value && !I.value ? (c(), p("div", gi, "Loading images…")) : C("", !0),
      b.value && !v.value.length ? (c(), p("div", bi, [
        l("div", yi, [
          T(O(H), { icon: "tabler:box" })
        ]),
        F[4] || (F[4] = l("div", { class: "kx-empty-title" }, "No images yet", -1)),
        F[5] || (F[5] = l("div", { class: "kx-empty-sub" }, "Start with the default agent recipe or use an existing image.", -1)),
        l("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: Z
        }, "Add image")
      ])) : b.value && !q.value.length ? (c(), p("div", ki, [...F[6] || (F[6] = [
        l("div", { class: "kx-empty-title" }, "No matches", -1),
        l("div", { class: "kx-empty-sub" }, "Try another image, reference or agent.", -1)
      ])])) : C("", !0),
      l("ul", Ii, [
        (c(!0), p(j, null, ee(q.value, (L) => (c(), p("li", {
          key: L.id,
          class: "ac-row ac-resource"
        }, [
          l("span", xi, [
            T(O(H), { icon: "tabler:box" })
          ]),
          l("div", wi, [
            l("div", Si, [
              N($(L.label), 1),
              l("span", {
                class: re(["kx-tag-sm ac-tone", L.status])
              }, $(L.status === "unprepared" ? "Needs preparation" : L.status.charAt(0).toUpperCase() + L.status.slice(1)), 3),
              L.usable ? (c(), p("span", Ci, "Usable")) : C("", !0)
            ]),
            l("div", $i, $(L.ref) + " · " + $(L.home), 1),
            l("div", Oi, [
              (c(!0), p(j, null, ee(L.agents, (G) => (c(), p("span", {
                key: G,
                class: "kx-tag-sm ac-tone"
              }, [
                T(O(H), {
                  icon: O(Nt)(G, O(i).agents)
                }, null, 8, ["icon"]),
                N($(G), 1)
              ]))), 128))
            ]),
            l("div", _i, $(h.value[L.id]), 1),
            L.last_error ? (c(), p("div", Li, $(L.last_error), 1)) : C("", !0)
          ]),
          l("div", Di, [
            L.shareable ? (c(), E(it, {
              key: 0,
              id: L.id,
              title: L.label
            }, null, 8, ["id", "title"])) : C("", !0),
            L.writable ? (c(), p("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Prepare image",
              "aria-label": "Prepare image",
              disabled: L.status === "preparing",
              onClick: (G) => D(L)
            }, [
              T(O(H), { icon: "tabler:refresh" })
            ], 8, Mi)) : C("", !0),
            l("button", {
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Build log",
              "aria-label": "Build log",
              onClick: (G) => P(L)
            }, [
              T(O(H), { icon: "tabler:file-text" })
            ], 8, Bi),
            L.writable ? (c(), p("button", {
              key: 2,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Edit settings",
              "aria-label": "Edit settings",
              onClick: (G) => z(L)
            }, [
              T(O(H), { icon: "tabler:pencil" })
            ], 8, Ai)) : C("", !0),
            L.deletable ? (c(), p("button", {
              key: 3,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete image",
              "aria-label": "Delete image",
              onClick: (G) => Y(L)
            }, [
              T(O(H), { icon: "tabler:trash" })
            ], 8, zi)) : C("", !0)
          ])
        ]))), 128))
      ]),
      a.value || k.value ? (c(), E(_e, {
        key: 4,
        title: k.value ? "Edit image" : "Add image",
        busy: u.value,
        wide: "",
        onClose: F[3] || (F[3] = (L) => U())
      }, {
        default: se(() => [
          T(fi, {
            onBusy: F[1] || (F[1] = (L) => u.value = L),
            edit: k.value,
            capabilities: r.value,
            onSaved: ae,
            onCancel: F[2] || (F[2] = (L) => U())
          }, null, 8, ["edit", "capabilities"])
        ]),
        _: 1
      }, 8, ["title", "busy"])) : C("", !0),
      d.value ? (c(), E(_e, {
        key: 5,
        title: "Build log",
        wide: "",
        onClose: R
      }, {
        default: se(() => [
          l("div", Ti, [
            l("strong", Fi, $(d.value.ref), 1),
            l("pre", Vi, $(d.value.text), 1)
          ])
        ]),
        _: 1
      })) : C("", !0)
    ]));
  }
}), Ri = { class: "ac-stack" }, Ei = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Ki = {
  key: 1,
  class: "kx-loading"
}, Ni = {
  key: 2,
  class: "ac-chips"
}, Ui = {
  key: 3,
  class: "kx-empty"
}, Hi = { class: "kx-empty-ico" }, ji = {
  key: 4,
  class: "kx-empty"
}, Gi = { class: "ac-list ac-resource-list" }, Wi = { class: "ac-resource-icon" }, qi = { class: "ac-account-main" }, Zi = { class: "ac-row-title" }, Ji = { class: "kx-tag-sm ac-tone" }, Yi = {
  key: 0,
  class: "ac-muted"
}, Qi = { class: "ac-mono" }, Xi = {
  key: 1,
  class: "ac-muted ac-mono"
}, es = { class: "ac-row-actions" }, ts = ["onClick"], ns = ["disabled"], is = {
  key: 0,
  class: "ac-muted"
}, ss = {
  key: 1,
  class: "ac-field"
}, os = { class: "ac-chips" }, as = ["onClick"], rs = { class: "ac-field" }, ls = { class: "ac-field" }, us = ["placeholder"], cs = {
  key: 2,
  class: "kx-err",
  role: "alert"
}, ds = { class: "ac-dialog-foot" }, ps = ["disabled"], hs = ["disabled"], fs = /* @__PURE__ */ oe({
  __name: "workspaces",
  props: {
    query: {}
  },
  emits: ["count"],
  setup(t, { expose: e, emit: n }) {
    const i = Ke(), o = _([]), s = t, a = n, u = _(!1);
    e({ open: () => {
      u.value = !0;
    } });
    const h = _([]), v = _([]), g = _(""), I = _(!1), k = _(""), d = _(!1), r = _(""), b = _(!1);
    function w(m) {
      return m.replace(/\/+$/, "") + "/";
    }
    ne([u, v], () => {
      u.value && !r.value && v.value.length && (r.value = w(v.value[0]));
    }), ne(r, (m) => {
      d.value || (k.value = m.trim().split("/").filter(Boolean).pop() ?? "");
    });
    const S = Se(async () => {
      try {
        await ot(Q.workspaces, (m) => m.workspaces.map((f) => f.id), o, i, (m) => {
          h.value = m.workspaces, v.value = m.roots ?? [], b.value = !0, g.value = "";
        }, () => {
          S();
        });
      } catch (m) {
        i() && (g.value = X(m, "Could not load workspaces."));
      }
    }, i);
    st(() => o.value, () => {
      S();
    }), we(S);
    async function x() {
      g.value = "", I.value = !0;
      try {
        if (await Q.createWorkspace({ name: k.value, host_path: r.value }), !i()) return;
        d.value = !1, k.value = "", r.value = "", u.value = !1, await S();
      } catch (m) {
        i() && (g.value = X(m, "Could not save the workspace."));
      } finally {
        i() && (I.value = !1);
      }
    }
    async function V(m) {
      const f = await fe.confirm({
        header: "Delete workspace",
        message: `Delete workspace "${m.name}"? The host directory stays untouched.`,
        icon: "tabler:trash",
        acceptLabel: "Delete",
        rejectLabel: "Cancel",
        acceptClass: "p-button-danger"
      });
      if (!(!i() || !f)) {
        g.value = "";
        try {
          await Q.deleteWorkspace(m.id), await S();
        } catch (y) {
          i() && (g.value = X(y, "Could not delete the workspace."));
        }
      }
    }
    const A = J(() => h.value.filter((m) => [m.name, m.host_path].join(" ").toLowerCase().includes(s.query.toLowerCase())));
    return ne(h, (m) => {
      a("count", m.length);
    }), (m, f) => (c(), p("div", Ri, [
      f[15] || (f[15] = l("p", { class: "ac-hint" }, "Tasks use shared workspaces with the access you grant.", -1)),
      g.value && !u.value ? (c(), p("p", Ei, [
        N($(g.value) + " ", 1),
        l("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          onClick: f[0] || (f[0] = //@ts-ignore
          (...y) => O(S) && O(S)(...y))
        }, "Retry")
      ])) : C("", !0),
      !b.value && !g.value ? (c(), p("div", Ki, "Loading workspaces…")) : C("", !0),
      v.value.length ? (c(), p("div", Ni, [
        f[7] || (f[7] = l("span", { class: "ac-muted" }, "Allowed roots", -1)),
        (c(!0), p(j, null, ee(v.value, (y) => (c(), p("span", {
          key: y,
          class: "ac-hint-chip ac-mono"
        }, $(y), 1))), 128))
      ])) : C("", !0),
      b.value && !h.value.length ? (c(), p("div", Ui, [
        l("div", Hi, [
          T(O(H), { icon: "tabler:folder" })
        ]),
        f[8] || (f[8] = l("div", { class: "kx-empty-title" }, "No workspaces yet", -1)),
        f[9] || (f[9] = l("div", { class: "kx-empty-sub" }, "Add a host directory, or let tasks use a scratch directory.", -1)),
        l("button", {
          class: "ac-btn primary kx-focus-halo",
          onClick: f[1] || (f[1] = (y) => u.value = !0)
        }, "Add workspace")
      ])) : b.value && !A.value.length ? (c(), p("div", ji, [...f[10] || (f[10] = [
        l("div", { class: "kx-empty-title" }, "No matches", -1),
        l("div", { class: "kx-empty-sub" }, "Try another workspace name or path.", -1)
      ])])) : C("", !0),
      l("ul", Gi, [
        (c(!0), p(j, null, ee(A.value, (y) => (c(), p("li", {
          key: y.id,
          class: "ac-row ac-resource"
        }, [
          l("span", Wi, [
            T(O(H), { icon: "tabler:folder" })
          ]),
          l("div", qi, [
            l("div", Zi, [
              N($(y.name), 1),
              l("span", Ji, $(y.writable ? "read-write" : "read-only"), 1)
            ]),
            y.unavailable_reason ? (c(), p("div", Yi, $(y.unavailable_reason), 1)) : C("", !0),
            (c(!0), p(j, null, ee(y.conflicts, (z) => (c(), p("div", {
              key: z.id,
              class: "ac-muted"
            }, [
              N("Conflicts with " + $(z.id) + ": ", 1),
              l("span", Qi, $(z.host_path), 1)
            ]))), 128)),
            y.host_path ? (c(), p("div", Xi, $(y.host_path), 1)) : C("", !0)
          ]),
          l("div", es, [
            y.shareable ? (c(), E(it, {
              key: 0,
              id: y.id,
              title: y.name
            }, null, 8, ["id", "title"])) : C("", !0),
            y.deletable ? (c(), p("button", {
              key: 1,
              type: "button",
              class: "ac-icon-btn kx-focus-outline",
              title: "Delete workspace",
              "aria-label": "Delete workspace",
              onClick: (z) => V(y)
            }, [
              T(O(H), { icon: "tabler:trash" })
            ], 8, ts)) : C("", !0)
          ])
        ]))), 128))
      ]),
      u.value ? (c(), E(_e, {
        key: 5,
        title: "Add workspace",
        busy: I.value,
        onClose: f[6] || (f[6] = (y) => u.value = !1)
      }, {
        default: se(() => [
          l("fieldset", {
            class: "ac-form",
            disabled: I.value
          }, [
            v.value.length ? (c(), p("div", ss, [
              f[11] || (f[11] = l("span", null, "Allowed roots", -1)),
              l("div", os, [
                (c(!0), p(j, null, ee(v.value, (y) => (c(), p("button", {
                  key: y,
                  type: "button",
                  class: "ac-chip ac-mono kx-focus-halo",
                  title: "Start from this root",
                  onClick: (z) => r.value = w(y)
                }, $(y), 9, as))), 128))
              ])
            ])) : (c(), p("p", is, "The host administrator configures allowed workspace roots.")),
            l("label", rs, [
              f[12] || (f[12] = l("span", null, "Name", -1)),
              W(l("input", {
                "onUpdate:modelValue": f[2] || (f[2] = (y) => k.value = y),
                onInput: f[3] || (f[3] = (y) => d.value = !0),
                autofocus: "",
                class: "kx-focus-halo",
                placeholder: "e.g. Kickside checkout"
              }, null, 544), [
                [te, k.value]
              ])
            ]),
            l("label", ls, [
              f[13] || (f[13] = l("span", null, "Host directory", -1)),
              W(l("input", {
                "onUpdate:modelValue": f[4] || (f[4] = (y) => r.value = y),
                class: "ac-mono kx-focus-halo",
                placeholder: (v.value[0] ?? "/srv/work") + "/project"
              }, null, 8, us), [
                [te, r.value]
              ]),
              f[14] || (f[14] = l("small", { class: "ac-hint" }, [
                N("An existing directory, mounted at "),
                l("code", null, "/workspace"),
                N(".")
              ], -1))
            ]),
            g.value ? (c(), p("p", cs, $(g.value), 1)) : C("", !0),
            l("footer", ds, [
              l("button", {
                type: "button",
                class: "ac-btn kx-focus-halo",
                disabled: I.value,
                onClick: f[5] || (f[5] = (y) => u.value = !1)
              }, "Cancel", 8, ps),
              l("button", {
                type: "button",
                class: "ac-btn primary kx-focus-halo",
                disabled: I.value || !k.value.trim() || !r.value.trim(),
                onClick: x
              }, [
                T(O(H), { icon: "tabler:folder-plus" }),
                N($(I.value ? "Saving…" : "Add workspace"), 1)
              ], 8, hs)
            ])
          ], 8, ns)
        ]),
        _: 1
      }, 8, ["busy"])) : C("", !0)
    ]));
  }
}), ms = { class: "ac-card ac-narrow" }, vs = { class: "ac-card-head" }, gs = { class: "ac-card-title" }, bs = ["disabled"], ys = { class: "ac-hint" }, ks = {
  key: 0,
  class: "kx-err"
}, Is = {
  key: 1,
  class: "ac-pre"
}, xs = /* @__PURE__ */ oe({
  __name: "maintenance",
  setup(t) {
    const e = Ee(), n = _(!1), i = _(""), o = _("");
    async function s() {
      if (await fe.confirm({
        header: "Clean up Docker",
        message: `Prune stopped Autocode containers, unused images and build cache older than ${e.value.build_cache_retention} across this Docker host? Other modules may use the shared image cache.`,
        icon: "tabler:trash-x",
        acceptLabel: "Clean up",
        rejectLabel: "Cancel"
      })) {
        o.value = "", n.value = !0;
        try {
          i.value = await Q.prune();
        } catch (u) {
          o.value = X(u, "Cleanup failed.");
        } finally {
          n.value = !1;
        }
      }
    }
    return (a, u) => (c(), p("section", ms, [
      l("div", vs, [
        l("h2", gs, [
          T(O(H), { icon: "tabler:brand-docker" }),
          u[0] || (u[0] = N("Docker cleanup", -1))
        ]),
        l("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          disabled: n.value,
          onClick: s
        }, [
          T(O(H), {
            icon: n.value ? "tabler:loader-2" : "tabler:trash-x",
            class: re({ spin: n.value })
          }, null, 8, ["icon", "class"]),
          N(" " + $(n.value ? "Cleaning…" : "Clean up Docker"), 1)
        ], 8, bs)
      ]),
      l("p", ys, "Remove stopped Autocode containers and dangling images. Cleanup keeps unused build cache younger than " + $(O(e).build_cache_retention) + ". Tagged images stay.", 1),
      o.value ? (c(), p("p", ks, $(o.value), 1)) : C("", !0),
      i.value ? (c(), p("pre", Is, $(i.value), 1)) : C("", !0)
    ]));
  }
});
var ft = {
  name: "AngleDownIcon",
  extends: ge
};
function ws(t) {
  return Os(t) || $s(t) || Cs(t) || Ss();
}
function Ss() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cs(t, e) {
  if (t) {
    if (typeof t == "string") return ze(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ze(t, e) : void 0;
  }
}
function $s(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Os(t) {
  if (Array.isArray(t)) return ze(t);
}
function ze(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function _s(t, e, n, i, o, s) {
  return c(), p("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ws(e[0] || (e[0] = [l("path", {
    d: "M3.58659 4.5007C3.68513 4.50023 3.78277 4.51945 3.87379 4.55723C3.9648 4.59501 4.04735 4.65058 4.11659 4.7207L7.11659 7.7207L10.1166 4.7207C10.2619 4.65055 10.4259 4.62911 10.5843 4.65956C10.7427 4.69002 10.8871 4.77074 10.996 4.88976C11.1049 5.00877 11.1726 5.15973 11.1889 5.32022C11.2052 5.48072 11.1693 5.6422 11.0866 5.7807L7.58659 9.2807C7.44597 9.42115 7.25534 9.50004 7.05659 9.50004C6.85784 9.50004 6.66722 9.42115 6.52659 9.2807L3.02659 5.7807C2.88614 5.64007 2.80725 5.44945 2.80725 5.2507C2.80725 5.05195 2.88614 4.86132 3.02659 4.7207C3.09932 4.64685 3.18675 4.58911 3.28322 4.55121C3.37969 4.51331 3.48305 4.4961 3.58659 4.5007Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
ft.render = _s;
var mt = {
  name: "AngleUpIcon",
  extends: ge
};
function Ls(t) {
  return As(t) || Bs(t) || Ms(t) || Ds();
}
function Ds() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ms(t, e) {
  if (t) {
    if (typeof t == "string") return Te(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Te(t, e) : void 0;
  }
}
function Bs(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function As(t) {
  if (Array.isArray(t)) return Te(t);
}
function Te(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
function zs(t, e, n, i, o, s) {
  return c(), p("svg", B({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), Ls(e[0] || (e[0] = [l("path", {
    d: "M10.4134 9.49931C10.3148 9.49977 10.2172 9.48055 10.1262 9.44278C10.0352 9.405 9.95263 9.34942 9.88338 9.27931L6.88338 6.27931L3.88338 9.27931C3.73811 9.34946 3.57409 9.3709 3.41567 9.34044C3.25724 9.30999 3.11286 9.22926 3.00395 9.11025C2.89504 8.99124 2.82741 8.84028 2.8111 8.67978C2.79478 8.51928 2.83065 8.35781 2.91338 8.21931L6.41338 4.71931C6.55401 4.57886 6.74463 4.49997 6.94338 4.49997C7.14213 4.49997 7.33276 4.57886 7.47338 4.71931L10.9734 8.21931C11.1138 8.35994 11.1927 8.55056 11.1927 8.74931C11.1927 8.94806 11.1138 9.13868 10.9734 9.27931C10.9007 9.35315 10.8132 9.41089 10.7168 9.44879C10.6203 9.48669 10.5169 9.5039 10.4134 9.49931Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
mt.render = zs;
var Ts = `
    .p-inputnumber {
        display: inline-flex;
        position: relative;
    }

    .p-inputnumber-button {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 0 0 auto;
        cursor: pointer;
        background: dt('inputnumber.button.background');
        color: dt('inputnumber.button.color');
        width: dt('inputnumber.button.width');
        transition:
            background dt('inputnumber.transition.duration'),
            color dt('inputnumber.transition.duration'),
            border-color dt('inputnumber.transition.duration'),
            outline-color dt('inputnumber.transition.duration');
    }

    .p-inputnumber-button:disabled {
        cursor: auto;
    }

    .p-inputnumber-button:not(:disabled):hover {
        background: dt('inputnumber.button.hover.background');
        color: dt('inputnumber.button.hover.color');
    }

    .p-inputnumber-button:not(:disabled):active {
        background: dt('inputnumber.button.active.background');
        color: dt('inputnumber.button.active.color');
    }

    .p-inputnumber-stacked .p-inputnumber-button {
        position: relative;
        flex: 1 1 auto;
        border: 0 none;
    }

    .p-inputnumber-stacked .p-inputnumber-button-group {
        display: flex;
        flex-direction: column;
        position: absolute;
        inset-block-start: 1px;
        inset-inline-end: 1px;
        height: calc(100% - 2px);
        z-index: 1;
    }

    .p-inputnumber-stacked .p-inputnumber-increment-button {
        padding: 0;
        border-start-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-decrement-button {
        padding: 0;
        border-end-end-radius: calc(dt('inputnumber.button.border.radius') - 1px);
    }

    .p-inputnumber-stacked .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-horizontal .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-horizontal .p-inputnumber-increment-button {
        order: 3;
        border-start-end-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        border-inline-start: 0 none;
    }

    .p-inputnumber-horizontal .p-inputnumber-input {
        order: 2;
        border-radius: 0;
    }

    .p-inputnumber-horizontal .p-inputnumber-decrement-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-inline-end: 0 none;
    }

    .p-floatlabel:has(.p-inputnumber-horizontal) label {
        margin-inline-start: dt('inputnumber.button.width');
    }

    .p-inputnumber-vertical {
        flex-direction: column;
    }

    .p-inputnumber-vertical .p-inputnumber-button {
        border: 1px solid dt('inputnumber.button.border.color');
        padding: dt('inputnumber.button.vertical.padding');
    }

    .p-inputnumber-vertical .p-inputnumber-button:hover {
        border-color: dt('inputnumber.button.hover.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-button:active {
        border-color: dt('inputnumber.button.active.border.color');
    }

    .p-inputnumber-vertical .p-inputnumber-increment-button {
        order: 1;
        border-start-start-radius: dt('inputnumber.button.border.radius');
        border-start-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-end: 0 none;
    }

    .p-inputnumber-vertical .p-inputnumber-input {
        order: 2;
        border-radius: 0;
        text-align: center;
    }

    .p-inputnumber-vertical .p-inputnumber-decrement-button {
        order: 3;
        border-end-start-radius: dt('inputnumber.button.border.radius');
        border-end-end-radius: dt('inputnumber.button.border.radius');
        width: 100%;
        border-block-start: 0 none;
    }

    .p-inputnumber-input {
        flex: 1 1 auto;
    }

    .p-inputnumber-fluid {
        width: 100%;
    }

    .p-inputnumber-fluid .p-inputnumber-input {
        width: 1%;
    }

    .p-inputnumber-fluid.p-inputnumber-vertical .p-inputnumber-input {
        width: 100%;
    }

    .p-inputnumber:has(.p-inputtext-sm) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.sm.font.size');
        width: dt('form.field.sm.font.size');
        height: dt('form.field.sm.font.size');
    }

    .p-inputnumber:has(.p-inputtext-lg) .p-inputnumber-button .p-icon {
        font-size: dt('form.field.lg.font.size');
        width: dt('form.field.lg.font.size');
        height: dt('form.field.lg.font.size');
    }

    .p-inputnumber-clear-icon {
        position: absolute;
        top: 50%;
        margin-top: -0.5rem;
        cursor: pointer;
        inset-inline-end: dt('form.field.padding.x');
        color: dt('form.field.icon.color');
    }

    .p-inputnumber:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc((dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-stacked .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }

    .p-inputnumber-stacked:has(.p-inputnumber-clear-icon) .p-inputnumber-input {
        padding-inline-end: calc(dt('inputnumber.button.width') + (dt('form.field.padding.x') * 2) + dt('icon.size'));
    }

    .p-inputnumber-horizontal .p-inputnumber-clear-icon {
        inset-inline-end: calc(dt('inputnumber.button.width') + dt('form.field.padding.x'));
    }
`, Fs = {
  root: function(e) {
    var n = e.instance, i = e.props;
    return ["p-inputnumber p-component p-inputwrapper", {
      "p-invalid": n.$invalid,
      "p-inputwrapper-filled": n.$filled || i.allowEmpty === !1,
      "p-inputwrapper-focus": n.focused,
      "p-inputnumber-stacked": i.showButtons && i.buttonLayout === "stacked",
      "p-inputnumber-horizontal": i.showButtons && i.buttonLayout === "horizontal",
      "p-inputnumber-vertical": i.showButtons && i.buttonLayout === "vertical",
      "p-inputnumber-fluid": n.$fluid
    }];
  },
  pcInputText: "p-inputnumber-input",
  clearIcon: "p-inputnumber-clear-icon",
  buttonGroup: "p-inputnumber-button-group",
  incrementButton: function(e) {
    var n = e.instance, i = e.props;
    return ["p-inputnumber-button p-inputnumber-increment-button", {
      "p-disabled": i.showButtons && i.max !== null && n.maxBoundry()
    }];
  },
  decrementButton: function(e) {
    var n = e.instance, i = e.props;
    return ["p-inputnumber-button p-inputnumber-decrement-button", {
      "p-disabled": i.showButtons && i.min !== null && n.minBoundry()
    }];
  }
}, Vs = be.extend({
  name: "inputnumber",
  style: Ts,
  classes: Fs
}), Ps = {
  name: "BaseInputNumber",
  extends: zt,
  props: {
    format: {
      type: Boolean,
      default: !0
    },
    showButtons: {
      type: Boolean,
      default: !1
    },
    buttonLayout: {
      type: String,
      default: "stacked"
    },
    incrementButtonClass: {
      type: String,
      default: null
    },
    decrementButtonClass: {
      type: String,
      default: null
    },
    incrementButtonIcon: {
      type: String,
      default: void 0
    },
    incrementIcon: {
      type: String,
      default: void 0
    },
    decrementButtonIcon: {
      type: String,
      default: void 0
    },
    decrementIcon: {
      type: String,
      default: void 0
    },
    locale: {
      type: String,
      default: void 0
    },
    localeMatcher: {
      type: String,
      default: void 0
    },
    mode: {
      type: String,
      default: "decimal"
    },
    prefix: {
      type: String,
      default: null
    },
    suffix: {
      type: String,
      default: null
    },
    currency: {
      type: String,
      default: void 0
    },
    currencyDisplay: {
      type: String,
      default: void 0
    },
    useGrouping: {
      type: Boolean,
      default: !0
    },
    minFractionDigits: {
      type: Number,
      default: void 0
    },
    maxFractionDigits: {
      type: Number,
      default: void 0
    },
    roundingMode: {
      type: String,
      default: "halfExpand",
      validator: function(e) {
        return ["ceil", "floor", "expand", "trunc", "halfCeil", "halfFloor", "halfExpand", "halfTrunc", "halfEven"].includes(e);
      }
    },
    min: {
      type: Number,
      default: null
    },
    max: {
      type: Number,
      default: null
    },
    step: {
      type: Number,
      default: 1
    },
    allowEmpty: {
      type: Boolean,
      default: !0
    },
    highlightOnFocus: {
      type: Boolean,
      default: !1
    },
    showClear: {
      type: Boolean,
      default: !1
    },
    readonly: {
      type: Boolean,
      default: !1
    },
    placeholder: {
      type: String,
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
    },
    required: {
      type: Boolean,
      default: !1
    }
  },
  style: Vs,
  provide: function() {
    return {
      $pcInputNumber: this,
      $parentInstance: this
    };
  }
};
function ve(t) {
  "@babel/helpers - typeof";
  return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ve(t);
}
function Ye(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var i = Object.getOwnPropertySymbols(t);
    e && (i = i.filter(function(o) {
      return Object.getOwnPropertyDescriptor(t, o).enumerable;
    })), n.push.apply(n, i);
  }
  return n;
}
function Qe(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Ye(Object(n), !0).forEach(function(i) {
      Fe(t, i, n[i]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Ye(Object(n)).forEach(function(i) {
      Object.defineProperty(t, i, Object.getOwnPropertyDescriptor(n, i));
    });
  }
  return t;
}
function Fe(t, e, n) {
  return (e = Rs(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Rs(t) {
  var e = Es(t, "string");
  return ve(e) == "symbol" ? e : e + "";
}
function Es(t, e) {
  if (ve(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var i = n.call(t, e);
    if (ve(i) != "object") return i;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Ks(t) {
  return js(t) || Hs(t) || Us(t) || Ns();
}
function Ns() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Us(t, e) {
  if (t) {
    if (typeof t == "string") return Ve(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ve(t, e) : void 0;
  }
}
function Hs(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function js(t) {
  if (Array.isArray(t)) return Ve(t);
}
function Ve(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, i = Array(e); n < e; n++) i[n] = t[n];
  return i;
}
var vt = {
  name: "InputNumber",
  extends: Ps,
  inheritAttrs: !1,
  emits: ["input", "focus", "blur"],
  inject: {
    $pcFluid: {
      default: null
    }
  },
  numberFormat: null,
  _numeral: null,
  _decimal: null,
  _group: null,
  _minusSign: null,
  _currency: null,
  _suffix: null,
  _prefix: null,
  _index: null,
  groupChar: "",
  isSpecialChar: null,
  prefixChar: null,
  suffixChar: null,
  timer: null,
  data: function() {
    return {
      // @deprecated
      d_modelValue: this.d_value,
      focused: !1
    };
  },
  watch: {
    d_value: {
      immediate: !0,
      handler: function(e) {
        var n;
        this.d_modelValue = e, (n = this.$refs.clearIcon) !== null && n !== void 0 && (n = n.$el) !== null && n !== void 0 && n.style && (this.$refs.clearIcon.$el.style.display = We(e) ? "none" : "block");
      }
    },
    locale: function(e, n) {
      this.updateConstructParser(e, n);
    },
    localeMatcher: function(e, n) {
      this.updateConstructParser(e, n);
    },
    mode: function(e, n) {
      this.updateConstructParser(e, n);
    },
    currency: function(e, n) {
      this.updateConstructParser(e, n);
    },
    currencyDisplay: function(e, n) {
      this.updateConstructParser(e, n);
    },
    useGrouping: function(e, n) {
      this.updateConstructParser(e, n);
    },
    minFractionDigits: function(e, n) {
      this.updateConstructParser(e, n);
    },
    maxFractionDigits: function(e, n) {
      this.updateConstructParser(e, n);
    },
    suffix: function(e, n) {
      this.updateConstructParser(e, n);
    },
    prefix: function(e, n) {
      this.updateConstructParser(e, n);
    }
  },
  created: function() {
    this.constructParser();
  },
  mounted: function() {
    var e;
    (e = this.$refs.clearIcon) !== null && e !== void 0 && (e = e.$el) !== null && e !== void 0 && e.style && (this.$refs.clearIcon.$el.style.display = this.$filled ? "block" : "none");
  },
  methods: {
    getOptions: function() {
      return {
        localeMatcher: this.localeMatcher,
        style: this.mode,
        currency: this.currency,
        currencyDisplay: this.currencyDisplay,
        useGrouping: this.useGrouping,
        minimumFractionDigits: this.minFractionDigits,
        maximumFractionDigits: this.maxFractionDigits,
        roundingMode: this.roundingMode
      };
    },
    constructParser: function() {
      this.numberFormat = new Intl.NumberFormat(this.locale, this.getOptions());
      var e = Ks(new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      }).format(9876543210)).reverse(), n = new Map(e.map(function(i, o) {
        return [i, o];
      }));
      this._numeral = new RegExp("[".concat(e.join(""), "]"), "g"), this._group = this.getGroupingExpression(), this._minusSign = this.getMinusSignExpression(), this._currency = this.getCurrencyExpression(), this._decimal = this.getDecimalExpression(), this._suffix = this.getSuffixExpression(), this._prefix = this.getPrefixExpression(), this._index = function(i) {
        return n.get(i);
      };
    },
    updateConstructParser: function(e, n) {
      e !== n && this.constructParser();
    },
    escapeRegExp: function(e) {
      return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    },
    getDecimalExpression: function() {
      var e = new Intl.NumberFormat(this.locale, Qe(Qe({}, this.getOptions()), {}, {
        useGrouping: !1
      })), n = e.format(1.1);
      return n === e.format(1) ? new RegExp("[]", "g") : new RegExp("[".concat(n.replace(this._currency, "").trim().replace(this._numeral, ""), "]"), "g");
    },
    getGroupingExpression: function() {
      var e = new Intl.NumberFormat(this.locale, {
        useGrouping: !0
      });
      return this.groupChar = e.format(1e6).trim().replace(this._numeral, "").charAt(0), new RegExp("[".concat(this.groupChar, "]"), "g");
    },
    getMinusSignExpression: function() {
      var e = new Intl.NumberFormat(this.locale, {
        useGrouping: !1
      });
      return new RegExp("[".concat(e.format(-1).trim().replace(this._numeral, ""), "]"), "g");
    },
    getCurrencyExpression: function() {
      if (this.currency) {
        var e = new Intl.NumberFormat(this.locale, {
          style: "currency",
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        return new RegExp("[".concat(e.format(1).replace(/\s/g, "").replace(this._numeral, "").replace(this._group, ""), "]"), "g");
      }
      return new RegExp("[]", "g");
    },
    getPrefixExpression: function() {
      if (this.prefix)
        this.prefixChar = this.prefix;
      else {
        var e = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay
        });
        this.prefixChar = e.format(1).split("1")[0];
      }
      return new RegExp("".concat(this.escapeRegExp(this.prefixChar || "")), "g");
    },
    getSuffixExpression: function() {
      if (this.suffix)
        this.suffixChar = this.suffix;
      else {
        var e = new Intl.NumberFormat(this.locale, {
          style: this.mode,
          currency: this.currency,
          currencyDisplay: this.currencyDisplay,
          minimumFractionDigits: 0,
          maximumFractionDigits: 0,
          roundingMode: this.roundingMode
        });
        this.suffixChar = e.format(1).split("1")[1];
      }
      return new RegExp("".concat(this.escapeRegExp(this.suffixChar || "")), "g");
    },
    formatValue: function(e) {
      if (e != null) {
        if (e === "-")
          return e;
        if (this.format) {
          var n = new Intl.NumberFormat(this.locale, this.getOptions()), i = n.format(e);
          return this.prefix && (i = this.prefix + i), this.suffix && (i = i + this.suffix), i;
        }
        return e.toString();
      }
      return "";
    },
    parseValue: function(e) {
      var n = e.replace(this._suffix, "").replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, "").replace(this._group, "").replace(this._minusSign, "-").replace(this._decimal, ".").replace(this._numeral, this._index);
      if (n) {
        if (n === "-")
          return n;
        var i = +n;
        return isNaN(i) ? null : i;
      }
      return null;
    },
    repeat: function(e, n, i) {
      var o = this;
      if (!this.readonly) {
        var s = n || 500;
        this.clearTimer(), this.timer = setTimeout(function() {
          o.repeat(e, 40, i);
        }, s), this.spin(e, i);
      }
    },
    addWithPrecision: function(e, n) {
      var i = e.toString(), o = n.toString(), s = i.includes(".") ? i.split(".")[1].length : 0, a = o.includes(".") ? o.split(".")[1].length : 0, u = Math.max(s, a), h = Math.pow(10, u);
      return Math.round((e + n) * h) / h;
    },
    spin: function(e, n) {
      if (this.$refs.input) {
        var i = this.step * n, o = this.parseValue(this.$refs.input.$el.value) || 0, s = this.validateValue(this.addWithPrecision(o, i));
        this.updateInput(s, null, "spin"), this.updateModel(e, s), this.handleOnInput(e, o, s);
      }
    },
    onUpButtonMouseDown: function(e) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(e, null, 1), e.preventDefault());
    },
    onUpButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onUpButtonKeyDown: function(e) {
      (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") && this.repeat(e, null, 1);
    },
    onDownButtonMouseDown: function(e) {
      this.disabled || (this.$refs.input.$el.focus(), this.repeat(e, null, -1), e.preventDefault());
    },
    onDownButtonMouseUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonMouseLeave: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyUp: function() {
      this.disabled || this.clearTimer();
    },
    onDownButtonKeyDown: function(e) {
      (e.code === "Space" || e.code === "Enter" || e.code === "NumpadEnter") && this.repeat(e, null, -1);
    },
    onUserInput: function() {
      this.isSpecialChar && (this.$refs.input.$el.value = this.lastValue), this.isSpecialChar = !1;
    },
    onInputKeyDown: function(e) {
      if (!this.readonly && !e.isComposing) {
        if (e.altKey || e.ctrlKey || e.metaKey) {
          this.isSpecialChar = !0, this.lastValue = this.$refs.input.$el.value;
          return;
        }
        this.lastValue = e.target.value;
        var n = e.target.selectionStart, i = e.target.selectionEnd, o = i - n, s = e.target.value, a = null, u = e.code || e.key;
        switch (u) {
          case "ArrowUp":
            this.spin(e, 1), e.preventDefault();
            break;
          case "ArrowDown":
            this.spin(e, -1), e.preventDefault();
            break;
          case "ArrowLeft":
            if (o > 1) {
              var h = this.isNumeralChar(s.charAt(n)) ? n + 1 : n + 2;
              this.$refs.input.$el.setSelectionRange(h, h);
            } else this.isNumeralChar(s.charAt(n - 1)) || e.preventDefault();
            break;
          case "ArrowRight":
            if (o > 1) {
              var v = i - 1;
              this.$refs.input.$el.setSelectionRange(v, v);
            } else this.isNumeralChar(s.charAt(n)) || e.preventDefault();
            break;
          case "Tab":
          case "Enter":
          case "NumpadEnter":
            a = this.validateValue(this.parseValue(s)), this.$refs.input.$el.value = this.formatValue(a), this.$refs.input.$el.setAttribute("aria-valuenow", a), this.updateModel(e, a);
            break;
          case "Backspace": {
            if (e.preventDefault(), n === i) {
              n >= s.length && this.suffixChar !== null && (n = s.length - this.suffixChar.length, this.$refs.input.$el.setSelectionRange(n, n));
              var g = s.charAt(n - 1), I = this.getDecimalCharIndexes(s), k = I.decimalCharIndex, d = I.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(g)) {
                var r = this.getDecimalLength(s);
                if (this._group.test(g))
                  this._group.lastIndex = 0, a = s.slice(0, n - 2) + s.slice(n - 1);
                else if (this._decimal.test(g))
                  this._decimal.lastIndex = 0, r ? this.$refs.input.$el.setSelectionRange(n - 1, n - 1) : a = s.slice(0, n - 1) + s.slice(n);
                else if (k > 0 && n > k) {
                  var b = this.isDecimalMode() && (this.minFractionDigits || 0) < r ? "" : "0";
                  a = s.slice(0, n - 1) + b + s.slice(n);
                } else d === 1 ? (a = s.slice(0, n - 1) + "0" + s.slice(n), a = this.parseValue(a) > 0 ? a : "") : a = s.slice(0, n - 1) + s.slice(n);
              }
              this.updateValue(e, a, null, "delete-single");
            } else
              a = this.deleteRange(s, n, i), this.updateValue(e, a, null, "delete-range");
            break;
          }
          case "Delete":
            if (e.preventDefault(), n === i) {
              var w = s.charAt(n), S = this.getDecimalCharIndexes(s), x = S.decimalCharIndex, V = S.decimalCharIndexWithoutPrefix;
              if (this.isNumeralChar(w)) {
                var A = this.getDecimalLength(s);
                if (this._group.test(w))
                  this._group.lastIndex = 0, a = s.slice(0, n) + s.slice(n + 2);
                else if (this._decimal.test(w))
                  this._decimal.lastIndex = 0, A ? this.$refs.input.$el.setSelectionRange(n + 1, n + 1) : a = s.slice(0, n) + s.slice(n + 1);
                else if (x > 0 && n > x) {
                  var m = this.isDecimalMode() && (this.minFractionDigits || 0) < A ? "" : "0";
                  a = s.slice(0, n) + m + s.slice(n + 1);
                } else V === 1 ? (a = s.slice(0, n) + "0" + s.slice(n + 1), a = this.parseValue(a) > 0 ? a : "") : a = s.slice(0, n) + s.slice(n + 1);
              }
              this.updateValue(e, a, null, "delete-back-single");
            } else
              a = this.deleteRange(s, n, i), this.updateValue(e, a, null, "delete-range");
            break;
          case "Home":
            e.preventDefault(), ue(this.min) && this.updateModel(e, this.min);
            break;
          case "End":
            e.preventDefault(), ue(this.max) && this.updateModel(e, this.max);
            break;
        }
      }
    },
    onInputKeyPress: function(e) {
      if (!this.readonly) {
        var n = e.key, i = this.isDecimalSign(n), o = this.isMinusSign(n);
        e.code !== "Enter" && e.preventDefault(), (Number(n) >= 0 && Number(n) <= 9 || o || i) && this.insert(e, n, {
          isDecimalSign: i,
          isMinusSign: o
        });
      }
    },
    onPaste: function(e) {
      if (!(this.readonly || this.disabled)) {
        e.preventDefault();
        var n = (e.clipboardData || window.clipboardData).getData("Text");
        if (!(this.inputId === "integeronly" && /[^\d-]/.test(n)) && n) {
          var i = this.parseValue(n);
          i != null && this.insert(e, i.toString());
        }
      }
    },
    onClearClick: function(e) {
      this.updateModel(e, null), this.$refs.input.$el.focus();
    },
    allowMinusSign: function() {
      return this.min === null || this.min < 0;
    },
    isMinusSign: function(e) {
      return this._minusSign.test(e) || e === "-" ? (this._minusSign.lastIndex = 0, !0) : !1;
    },
    isDecimalSign: function(e) {
      var n;
      return (n = this.locale) !== null && n !== void 0 && n.includes("fr") && [".", ","].includes(e) || this._decimal.test(e) ? (this._decimal.lastIndex = 0, !0) : !1;
    },
    isDecimalMode: function() {
      return this.mode === "decimal";
    },
    getDecimalCharIndexes: function(e) {
      var n = e.search(this._decimal);
      this._decimal.lastIndex = 0;
      var i = e.replace(this._prefix, "").trim().replace(/\s/g, "").replace(this._currency, ""), o = i.search(this._decimal);
      return this._decimal.lastIndex = 0, {
        decimalCharIndex: n,
        decimalCharIndexWithoutPrefix: o
      };
    },
    getCharIndexes: function(e) {
      var n = e.search(this._decimal);
      this._decimal.lastIndex = 0;
      var i = e.search(this._minusSign);
      this._minusSign.lastIndex = 0;
      var o = e.search(this._suffix);
      this._suffix.lastIndex = 0;
      var s = e.search(this._currency);
      return this._currency.lastIndex = 0, {
        decimalCharIndex: n,
        minusCharIndex: i,
        suffixCharIndex: o,
        currencyCharIndex: s
      };
    },
    insert: function(e, n) {
      var i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {
        isDecimalSign: !1,
        isMinusSign: !1
      }, o = n.search(this._minusSign);
      if (this._minusSign.lastIndex = 0, !(!this.allowMinusSign() && o !== -1)) {
        var s = this.$refs.input.$el.selectionStart, a = this.$refs.input.$el.selectionEnd, u = this.$refs.input.$el.value.trim(), h = this.getCharIndexes(u), v = h.decimalCharIndex, g = h.minusCharIndex, I = h.suffixCharIndex, k = h.currencyCharIndex, d;
        if (i.isMinusSign) {
          var r = g === -1;
          (s === 0 || s === k + 1) && (d = u, (r || a !== 0) && (d = this.insertText(u, n, 0, a)), this.updateValue(e, d, n, "insert"));
        } else if (i.isDecimalSign)
          v > 0 && s === v ? this.updateValue(e, u, n, "insert") : v > s && v < a ? (d = this.insertText(u, n, s, a), this.updateValue(e, d, n, "insert")) : v === -1 && this.maxFractionDigits && (d = this.insertText(u, n, s, a), this.updateValue(e, d, n, "insert"));
        else {
          var b = this.numberFormat.resolvedOptions().maximumFractionDigits, w = s !== a ? "range-insert" : "insert";
          if (v > 0 && s > v) {
            if (s + n.length - (v + 1) <= b) {
              var S = k >= s ? k - 1 : I >= s ? I : u.length;
              d = u.slice(0, s) + n + u.slice(s + n.length, S) + u.slice(S), this.updateValue(e, d, n, w);
            }
          } else
            d = this.insertText(u, n, s, a), this.updateValue(e, d, n, w);
        }
      }
    },
    insertText: function(e, n, i, o) {
      var s = n === "." ? n : n.split(".");
      if (s.length === 2) {
        var a = e.slice(i, o).search(this._decimal);
        return this._decimal.lastIndex = 0, a > 0 ? e.slice(0, i) + this.formatValue(n) + e.slice(o) : this.formatValue(n) || e;
      } else return o - i === e.length ? this.formatValue(n) : i === 0 ? n + e.slice(o) : o === e.length ? e.slice(0, i) + n : e.slice(0, i) + n + e.slice(o);
    },
    deleteRange: function(e, n, i) {
      var o;
      return i - n === e.length ? o = "" : n === 0 ? o = e.slice(i) : i === e.length ? o = e.slice(0, n) : o = e.slice(0, n) + e.slice(i), o;
    },
    initCursor: function() {
      var e = this.$refs.input.$el.selectionStart, n = this.$refs.input.$el.value, i = n.length, o = null, s = (this.prefixChar || "").length;
      n = n.replace(this._prefix, ""), e = e - s;
      var a = n.charAt(e);
      if (this.isNumeralChar(a))
        return e + s;
      for (var u = e - 1; u >= 0; )
        if (a = n.charAt(u), this.isNumeralChar(a)) {
          o = u + s;
          break;
        } else
          u--;
      if (o !== null)
        this.$refs.input.$el.setSelectionRange(o + 1, o + 1);
      else {
        for (u = e; u < i; )
          if (a = n.charAt(u), this.isNumeralChar(a)) {
            o = u + s;
            break;
          } else
            u++;
        o !== null && this.$refs.input.$el.setSelectionRange(o, o);
      }
      return o || 0;
    },
    onInputClick: function() {
      var e = this.$refs.input.$el.value;
      !this.readonly && e !== Ge() && this.initCursor();
    },
    isNumeralChar: function(e) {
      return e.length === 1 && (this._numeral.test(e) || this._decimal.test(e) || this._group.test(e) || this._minusSign.test(e)) ? (this.resetRegex(), !0) : !1;
    },
    resetRegex: function() {
      this._numeral.lastIndex = 0, this._decimal.lastIndex = 0, this._group.lastIndex = 0, this._minusSign.lastIndex = 0;
    },
    updateValue: function(e, n, i, o) {
      var s = this.$refs.input.$el.value, a = null;
      n != null && (a = this.parseValue(n), a = !a && !this.allowEmpty ? 0 : a, this.updateInput(a, i, o, n), this.handleOnInput(e, s, a));
    },
    handleOnInput: function(e, n, i) {
      if (this.isValueChanged(n, i)) {
        var o, s;
        this.$emit("input", {
          originalEvent: e,
          value: i,
          formattedValue: n
        }), (o = (s = this.formField).onInput) === null || o === void 0 || o.call(s, {
          originalEvent: e,
          value: i
        });
      }
    },
    isValueChanged: function(e, n) {
      if (n === null && e !== null)
        return !0;
      if (n != null) {
        var i = typeof e == "string" ? this.parseValue(e) : e;
        return n !== i;
      }
      return !1;
    },
    validateValue: function(e) {
      return e === "-" || e == null ? null : this.min != null && e < this.min ? this.min : this.max != null && e > this.max ? this.max : e;
    },
    updateInput: function(e, n, i, o) {
      var s;
      n = n || "";
      var a = this.$refs.input.$el.value, u = this.formatValue(e), h = a.length;
      if (u !== o && (u = this.concatValues(u, o)), h === 0) {
        this.$refs.input.$el.value = u, this.$refs.input.$el.setSelectionRange(0, 0);
        var v = this.initCursor(), g = v + n.length;
        this.$refs.input.$el.setSelectionRange(g, g);
      } else {
        var I = this.$refs.input.$el.selectionStart, k = this.$refs.input.$el.selectionEnd;
        this.$refs.input.$el.value = u;
        var d = u.length;
        if (i === "range-insert") {
          var r = this.parseValue((a || "").slice(0, I)), b = r !== null ? r.toString() : "", w = b.split("").join("(".concat(this.groupChar, ")?")), S = new RegExp(w, "g");
          S.test(u);
          var x = n.split("").join("(".concat(this.groupChar, ")?")), V = new RegExp(x, "g");
          V.test(u.slice(S.lastIndex)), k = S.lastIndex + V.lastIndex, this.$refs.input.$el.setSelectionRange(k, k);
        } else if (d === h)
          i === "insert" || i === "delete-back-single" ? this.$refs.input.$el.setSelectionRange(k + 1, k + 1) : i === "delete-single" ? this.$refs.input.$el.setSelectionRange(k - 1, k - 1) : (i === "delete-range" || i === "spin") && this.$refs.input.$el.setSelectionRange(k, k);
        else if (i === "delete-back-single") {
          var A = a.charAt(k - 1), m = a.charAt(k), f = h - d, y = this._group.test(m);
          y && f === 1 ? k += 1 : !y && this.isNumeralChar(A) && (k += -1 * f + 1), this._group.lastIndex = 0, this.$refs.input.$el.setSelectionRange(k, k);
        } else if (a === "-" && i === "insert") {
          this.$refs.input.$el.setSelectionRange(0, 0);
          var z = this.initCursor(), U = z + n.length + 1;
          this.$refs.input.$el.setSelectionRange(U, U);
        } else
          k = k + (d - h), this.$refs.input.$el.setSelectionRange(k, k);
      }
      this.$refs.input.$el.setAttribute("aria-valuenow", e), (s = this.$refs.clearIcon) !== null && s !== void 0 && (s = s.$el) !== null && s !== void 0 && s.style && (this.$refs.clearIcon.$el.style.display = We(u) ? "none" : "block");
    },
    concatValues: function(e, n) {
      if (e && n) {
        var i = n.search(this._decimal);
        return this._decimal.lastIndex = 0, this.suffixChar ? i !== -1 ? e.replace(this.suffixChar, "").split(this._decimal)[0] + n.replace(this.suffixChar, "").slice(i) + this.suffixChar : e : i !== -1 ? e.split(this._decimal)[0] + n.slice(i) : e;
      }
      return e;
    },
    getDecimalLength: function(e) {
      if (e) {
        var n = e.split(this._decimal);
        if (n.length === 2)
          return n[1].replace(this._suffix, "").trim().replace(/\s/g, "").replace(this._currency, "").length;
      }
      return 0;
    },
    updateModel: function(e, n) {
      this.writeValue(n, e);
    },
    onInputFocus: function(e) {
      this.focused = !0, !this.disabled && !this.readonly && this.$refs.input.$el.value !== Ge() && this.highlightOnFocus && e.target.select(), this.$emit("focus", e);
    },
    onInputBlur: function(e) {
      var n, i;
      this.focused = !1;
      var o = e.target, s = this.validateValue(this.parseValue(o.value));
      this.$emit("blur", {
        originalEvent: e,
        value: o.value
      }), (n = (i = this.formField).onBlur) === null || n === void 0 || n.call(i, e), o.value = this.formatValue(s), o.setAttribute("aria-valuenow", s), this.updateModel(e, s), !this.disabled && !this.readonly && this.highlightOnFocus && kt();
    },
    clearTimer: function() {
      this.timer && clearTimeout(this.timer);
    },
    maxBoundry: function() {
      return this.d_value >= this.max;
    },
    minBoundry: function() {
      return this.d_value <= this.min;
    }
  },
  computed: {
    upButtonListeners: function() {
      var e = this;
      return {
        mousedown: function(i) {
          return e.onUpButtonMouseDown(i);
        },
        mouseup: function(i) {
          return e.onUpButtonMouseUp(i);
        },
        mouseleave: function(i) {
          return e.onUpButtonMouseLeave(i);
        },
        keydown: function(i) {
          return e.onUpButtonKeyDown(i);
        },
        keyup: function(i) {
          return e.onUpButtonKeyUp(i);
        }
      };
    },
    downButtonListeners: function() {
      var e = this;
      return {
        mousedown: function(i) {
          return e.onDownButtonMouseDown(i);
        },
        mouseup: function(i) {
          return e.onDownButtonMouseUp(i);
        },
        mouseleave: function(i) {
          return e.onDownButtonMouseLeave(i);
        },
        keydown: function(i) {
          return e.onDownButtonKeyDown(i);
        },
        keyup: function(i) {
          return e.onDownButtonKeyUp(i);
        }
      };
    },
    formattedValue: function() {
      var e = !this.d_value && !this.allowEmpty ? 0 : this.d_value;
      return this.formatValue(e);
    },
    getFormatter: function() {
      return this.numberFormat;
    },
    dataP: function() {
      return tt(Fe(Fe({
        invalid: this.$invalid,
        fluid: this.$fluid,
        filled: this.$variant === "filled"
      }, this.size, this.size), this.buttonLayout, this.showButtons && this.buttonLayout));
    }
  },
  components: {
    InputText: Re,
    AngleUpIcon: mt,
    AngleDownIcon: ft,
    TimesIcon: Vt
  }
}, Gs = ["data-p"], Ws = ["data-p"], qs = ["disabled", "data-p"], Zs = ["disabled", "data-p"], Js = ["disabled", "data-p"], Ys = ["disabled", "data-p"];
function Qs(t, e, n, i, o, s) {
  var a = ie("InputText"), u = ie("TimesIcon");
  return c(), p("span", B({
    class: t.cx("root")
  }, t.ptmi("root"), {
    "data-p": s.dataP
  }), [T(a, {
    ref: "input",
    id: t.inputId,
    name: t.$formName,
    role: "spinbutton",
    class: re([t.cx("pcInputText"), t.inputClass]),
    style: Lt(t.inputStyle),
    defaultValue: s.formattedValue,
    "aria-valuemin": t.min,
    "aria-valuemax": t.max,
    "aria-valuenow": t.d_value,
    inputmode: t.mode === "decimal" && !t.minFractionDigits ? "numeric" : "decimal",
    disabled: t.disabled,
    readonly: t.readonly,
    placeholder: t.placeholder,
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel,
    required: t.required,
    size: t.size,
    invalid: t.invalid,
    variant: t.variant,
    onInput: s.onUserInput,
    onKeydown: s.onInputKeyDown,
    onKeypress: s.onInputKeyPress,
    onPaste: s.onPaste,
    onClick: s.onInputClick,
    onFocus: s.onInputFocus,
    onBlur: s.onInputBlur,
    pt: t.ptm("pcInputText"),
    unstyled: t.unstyled,
    "data-p": s.dataP
  }, null, 8, ["id", "name", "class", "style", "defaultValue", "aria-valuemin", "aria-valuemax", "aria-valuenow", "inputmode", "disabled", "readonly", "placeholder", "aria-labelledby", "aria-label", "required", "size", "invalid", "variant", "onInput", "onKeydown", "onKeypress", "onPaste", "onClick", "onFocus", "onBlur", "pt", "unstyled", "data-p"]), t.showClear && t.buttonLayout !== "vertical" ? K(t.$slots, "clearicon", {
    key: 0,
    class: re(t.cx("clearIcon")),
    clearCallback: s.onClearClick
  }, function() {
    return [T(u, B({
      ref: "clearIcon",
      class: [t.cx("clearIcon")],
      onClick: s.onClearClick
    }, t.ptm("clearIcon")), null, 16, ["class", "onClick"])];
  }) : C("", !0), t.showButtons && t.buttonLayout === "stacked" ? (c(), p("span", B({
    key: 1,
    class: t.cx("buttonGroup")
  }, t.ptm("buttonGroup"), {
    "data-p": s.dataP
  }), [K(t.$slots, "incrementbutton", {
    listeners: s.upButtonListeners
  }, function() {
    return [l("button", B({
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ke(s.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": s.dataP
    }), [K(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(c(), E(Ie(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), B({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, qs)];
  }), K(t.$slots, "decrementbutton", {
    listeners: s.downButtonListeners
  }, function() {
    return [l("button", B({
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ke(s.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": s.dataP
    }), [K(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(c(), E(Ie(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), B({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Zs)];
  })], 16, Ws)) : C("", !0), K(t.$slots, "incrementbutton", {
    listeners: s.upButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (c(), p("button", B({
      key: 0,
      class: [t.cx("incrementButton"), t.incrementButtonClass]
    }, ke(s.upButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("incrementButton"), {
      "data-p": s.dataP
    }), [K(t.$slots, t.$slots.incrementicon ? "incrementicon" : "incrementbuttonicon", {}, function() {
      return [(c(), E(Ie(t.incrementIcon || t.incrementButtonIcon ? "span" : "AngleUpIcon"), B({
        class: [t.incrementIcon, t.incrementButtonIcon]
      }, t.ptm("incrementIcon"), {
        "data-pc-section": "incrementicon"
      }), null, 16, ["class"]))];
    })], 16, Js)) : C("", !0)];
  }), K(t.$slots, "decrementbutton", {
    listeners: s.downButtonListeners
  }, function() {
    return [t.showButtons && t.buttonLayout !== "stacked" ? (c(), p("button", B({
      key: 0,
      class: [t.cx("decrementButton"), t.decrementButtonClass]
    }, ke(s.downButtonListeners, !0), {
      disabled: t.disabled,
      tabindex: -1,
      "aria-hidden": "true",
      type: "button"
    }, t.ptm("decrementButton"), {
      "data-p": s.dataP
    }), [K(t.$slots, t.$slots.decrementicon ? "decrementicon" : "decrementbuttonicon", {}, function() {
      return [(c(), E(Ie(t.decrementIcon || t.decrementButtonIcon ? "span" : "AngleDownIcon"), B({
        class: [t.decrementIcon, t.decrementButtonIcon]
      }, t.ptm("decrementIcon"), {
        "data-pc-section": "decrementicon"
      }), null, 16, ["class"]))];
    })], 16, Ys)) : C("", !0)];
  })], 16, Gs);
}
vt.render = Qs;
const Xs = {
  class: "ac-stack ac-limits",
  "aria-labelledby": "ac-limits-title"
}, eo = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, to = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, no = {
  key: 2,
  class: "ac-limit-status",
  role: "status"
}, io = { class: "ac-card-title" }, so = ["onSubmit"], oo = ["for"], ao = ["id"], ro = { class: "ac-limit-control" }, lo = { class: "ac-hint" }, uo = { class: "ac-limit-actions" }, co = {
  key: 0,
  class: "kx-err ac-limit-error",
  role: "alert"
}, po = /* @__PURE__ */ oe({
  __name: "limits",
  emits: ["saved"],
  setup(t, { emit: e }) {
    const n = e, i = Ke(), o = _([]), s = _({}), a = _({}), u = _(""), h = _(""), v = _(!1), g = _(""), I = J(() => {
      const r = /* @__PURE__ */ new Map();
      for (const b of [...o.value].sort((w, S) => w.order - S.order)) {
        const w = r.get(b.category) ?? [];
        w.push(b), r.set(b.category, w);
      }
      return r;
    }), k = Se(async () => {
      try {
        const r = await Q.limits();
        if (!i()) return;
        if (!r.length) throw new Error("No Autocode limits were found.");
        const b = new Map(o.value.map((w) => [w.key, w.value]));
        for (const w of r) {
          const S = s.value[w.key];
          (S === void 0 || S === b.get(w.key) || h.value === w.key) && (s.value[w.key] = w.value);
        }
        o.value = r, v.value = !0, u.value = "";
      } catch (r) {
        i() && (u.value = X(r, "Could not load limits."));
      }
    }, i);
    we(k);
    async function d(r, b = !1) {
      const w = b ? null : s.value[r.key];
      if (!(h.value || !b && (w == null || w === "" || w === r.value))) {
        h.value = r.key, g.value = "", a.value[r.key] = "";
        try {
          if (r.key === "run_retention" && !await fe.confirm({
            header: "Change run retention?",
            message: "Shorter retention can delete completed runs and their logs.",
            acceptLabel: "Change retention",
            rejectLabel: "Cancel"
          }) || !i() || (await Q.saveLimit(r.key, w ?? null), !i()) || (await k(), !i())) return;
          u.value || (g.value = b ? `${r.title} reset to default.` : `${r.title} saved.`), n("saved");
        } catch (S) {
          i() && (a.value[r.key] = X(S, "Could not save this limit."));
        } finally {
          i() && (h.value = "");
        }
      }
    }
    return (r, b) => (c(), p("section", Xs, [
      b[0] || (b[0] = l("div", null, [
        l("h2", {
          id: "ac-limits-title",
          class: "ac-card-title"
        }, "Limits"),
        l("p", { class: "ac-hint" }, "These defaults apply to Autocode tasks. Enter durations like 30m or 2h.")
      ], -1)),
      !v.value && !u.value ? (c(), p("p", eo, "Loading limits…")) : C("", !0),
      u.value ? (c(), p("div", to, [
        N($(u.value) + " ", 1),
        T(O(ce), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O(k)
        }, null, 8, ["onClick"])
      ])) : C("", !0),
      g.value ? (c(), p("p", no, $(g.value), 1)) : C("", !0),
      (c(!0), p(j, null, ee(I.value, ([w, S]) => (c(), p("section", {
        key: w,
        class: "ac-card ac-limit-group"
      }, [
        l("h3", io, $(w), 1),
        (c(!0), p(j, null, ee(S, (x) => (c(), p("form", {
          key: x.key,
          class: "ac-limit-row",
          onSubmit: Dt((V) => d(x), ["prevent"])
        }, [
          l("div", null, [
            l("label", {
              for: "ac-limit-" + x.key,
              class: "ac-strong"
            }, $(x.title), 9, oo),
            l("p", {
              id: "ac-limit-help-" + x.key,
              class: "ac-hint"
            }, $(x.description), 9, ao)
          ]),
          l("div", ro, [
            x.value_type === "int" ? (c(), E(O(vt), {
              key: 0,
              "input-id": "ac-limit-" + x.key,
              "model-value": typeof s.value[x.key] == "number" ? Number(s.value[x.key]) : null,
              "input-props": { "aria-describedby": "ac-limit-help-" + x.key },
              disabled: !!h.value,
              fluid: "",
              onInput: (V) => s.value[x.key] = typeof V.value == "number" ? V.value : null,
              "onUpdate:modelValue": (V) => s.value[x.key] = V
            }, null, 8, ["input-id", "model-value", "input-props", "disabled", "onInput", "onUpdate:modelValue"])) : (c(), E(O(Re), {
              key: 1,
              id: "ac-limit-" + x.key,
              "model-value": String(s.value[x.key] ?? ""),
              "aria-describedby": "ac-limit-help-" + x.key,
              disabled: !!h.value,
              fluid: "",
              "onUpdate:modelValue": (V) => s.value[x.key] = V ?? ""
            }, null, 8, ["id", "model-value", "aria-describedby", "disabled", "onUpdate:modelValue"])),
            l("p", lo, $(x.unit) + " · " + $(x.overridden ? `Override · default ${x.default}` : "Default"), 1)
          ]),
          l("div", uo, [
            s.value[x.key] !== x.value ? (c(), E(O(ce), {
              key: 0,
              type: "submit",
              label: "Save",
              size: "small",
              "aria-label": "Save " + x.title,
              disabled: !!h.value || s.value[x.key] == null || s.value[x.key] === ""
            }, null, 8, ["aria-label", "disabled"])) : C("", !0),
            x.overridden ? (c(), E(O(ce), {
              key: 1,
              type: "button",
              label: "Reset",
              size: "small",
              text: "",
              severity: "secondary",
              "aria-label": "Reset " + x.title + " to default",
              disabled: !!h.value,
              onClick: (V) => d(x, !0)
            }, null, 8, ["aria-label", "disabled", "onClick"])) : C("", !0)
          ]),
          a.value[x.key] ? (c(), p("p", co, $(a.value[x.key]), 1)) : C("", !0)
        ], 40, so))), 128))
      ]))), 128))
    ]));
  }
}), ho = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, fo = {
  key: 1,
  class: "kx-err",
  role: "alert"
}, mo = /* @__PURE__ */ oe({
  __name: "account-provider-mount",
  props: {
    tag: {},
    providerId: {}
  },
  emits: ["changed"],
  setup(t, { emit: e }) {
    const n = t, i = e, o = _(null), s = _(0), a = _(!1), u = _("");
    return ne([o, s], async ([h], v, g) => {
      if (!h) return;
      let I = !0;
      const k = (d) => {
        if (d instanceof CustomEvent && d.detail?.success === !1) {
          u.value = d.detail.error || "Could not complete account setup.";
          return;
        }
        u.value = "", i("changed");
      };
      g(() => {
        I = !1, h.replaceChildren();
      }), a.value = !0, u.value = "";
      try {
        if (await Mt(n.tag, { timeoutMs: 8e3 }), !I) return;
        const d = document.createElement(n.tag);
        d.setAttribute("provider-id", n.providerId), d.addEventListener("connection-saved", k), d.addEventListener("oauth-result", k), h.replaceChildren(d);
      } catch (d) {
        I && (u.value = X(d, "Could not load the provider’s account editor."));
      } finally {
        I && (a.value = !1);
      }
    }), (h, v) => (c(), p(j, null, [
      a.value ? (c(), p("p", ho, "Loading account editor…")) : C("", !0),
      u.value ? (c(), p("div", fo, [
        N($(u.value) + " ", 1),
        T(O(ce), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: v[0] || (v[0] = (g) => s.value++)
        })
      ])) : C("", !0),
      l("div", {
        ref_key: "container",
        ref: o
      }, null, 512)
    ], 64));
  }
}), vo = {
  class: "kx-card ac-provider-choice",
  type: "button"
}, go = { class: "kx-card-head" }, bo = { class: "ac-provider-icon" }, yo = { class: "kx-card-id" }, ko = { class: "kx-card-name" }, Io = { class: "kx-card-desc" }, xo = { class: "kx-card-meta" }, wo = {
  key: 0,
  class: "ac-muted"
}, Xe = /* @__PURE__ */ oe({
  __name: "provider-choice",
  props: {
    title: {},
    hint: {},
    icon: {},
    status: {},
    count: {},
    severity: {}
  },
  setup(t) {
    return (e, n) => (c(), p("button", vo, [
      l("span", go, [
        l("span", bo, [
          T(O(H), {
            icon: t.icon,
            "aria-hidden": "true"
          }, null, 8, ["icon"])
        ]),
        l("span", yo, [
          l("span", ko, $(t.title), 1),
          l("span", Io, $(t.hint), 1)
        ]),
        T(O(H), {
          icon: "tabler:chevron-right",
          class: "ac-provider-arrow",
          "aria-hidden": "true"
        })
      ]),
      l("span", xo, [
        T(O(Pt), {
          value: t.status,
          severity: t.severity
        }, null, 8, ["value", "severity"]),
        t.count ? (c(), p("small", wo, $(t.count), 1)) : C("", !0)
      ])
    ]));
  }
}), So = {
  class: "ac-stack ac-provider-page",
  "aria-label": "Accounts"
}, Co = {
  key: 0,
  class: "kx-loading",
  role: "status"
}, $o = {
  key: 1,
  class: "kx-err inline",
  role: "alert"
}, Oo = {
  key: 2,
  class: "ac-stack"
}, _o = { class: "ac-hint" }, Lo = {
  key: 3,
  class: "ac-stack"
}, Do = {
  key: 0,
  class: "ac-muted"
}, Mo = {
  key: 1,
  "aria-label": "Account providers",
  class: "ac-stack"
}, Bo = {
  key: 0,
  class: "ac-provider-grid"
}, Ao = ["open"], zo = { class: "kx-focus-outline" }, To = { class: "ac-muted" }, Fo = { class: "ac-provider-grid" }, Vo = /* @__PURE__ */ oe({
  __name: "account-management",
  props: {
    active: { type: Boolean, default: !0 }
  },
  emits: ["status"],
  setup(t, { emit: e }) {
    const n = t, i = e, o = _([]), s = _([]), a = _(""), u = _(!1), h = _(""), v = _();
    let g;
    const I = Ht(), k = Ke(), d = J(() => {
      const m = /* @__PURE__ */ new Map();
      for (const f of s.value) {
        const y = m.get(f.agent) ?? [];
        y.push(f), m.set(f.agent, y);
      }
      return m;
    }), r = J(() => {
      const m = new Set(o.value.map((f) => f.agent));
      return [...o.value, ...Array.from(d.value.keys()).filter((f) => !m.has(f)).map((f) => ({ agent: f, title: f, provider_id: f, icon: "tabler:terminal-off", create_ui_id: void 0 }))].map((f) => {
        const y = d.value.get(f.agent) ?? [], z = y.map((q) => qe(q, I.value)), U = z.filter((q) => q.state === "ready").length, Z = z.find((q) => q.state === "cooling"), D = Rt(f.agent, f.title), P = f.agent === "codex" ? 0 : f.agent === "claude" ? 1 : 2, R = m.has(f.agent), ae = R ? U ? "Ready" : Z ? Z.label : y.length ? "Needs attention" : "Not set up" : "Provider unavailable", Y = U ? "success" : Z ? "warn" : y.length ? "danger" : "secondary";
        return {
          ...f,
          ...D,
          rank: P,
          status: ae,
          ready: U,
          total: y.length,
          installed: R,
          severity: Y
        };
      }).sort((f, y) => +!!y.total - +!!f.total || f.rank - y.rank || f.name.localeCompare(y.name));
    }), b = J(() => r.value.filter((m) => m.total || m.rank < 2)), w = J(() => r.value.filter((m) => !m.total && m.rank === 2)), S = J(() => r.value.find((m) => m.provider_id === a.value));
    ne(() => n.active, (m) => {
      m || (a.value = "");
    }), ne(() => u.value ? s.value.length ? `${s.value.filter((f) => qe(f, I.value).state === "ready").length} of ${s.value.length} ready` : "No accounts" : void 0, (m) => {
      m !== void 0 && i("status", m);
    });
    async function x(m, f) {
      f.currentTarget instanceof HTMLElement && (g = f.currentTarget), a.value = m, await Oe(), v.value?.focus();
    }
    async function V() {
      a.value = "", await Oe(), g?.focus();
    }
    const A = Se(async () => {
      try {
        const m = await Q.managedAccounts();
        if (!k()) return;
        o.value = m.providers, s.value = m.accounts, u.value = !0, h.value = "";
      } catch (m) {
        k() && (h.value = X(m, "Could not load account providers."));
      }
    }, k);
    return we(A), (m, f) => (c(), p("section", So, [
      !u.value && !h.value ? (c(), p("p", Co, "Loading account providers…")) : C("", !0),
      h.value ? (c(), p("p", $o, [
        N($(h.value) + " ", 1),
        T(O(ce), {
          label: "Retry",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: O(A)
        }, null, 8, ["onClick"])
      ])) : C("", !0),
      S.value ? (c(), p("div", Oo, [
        l("div", null, [
          T(O(ce), {
            label: "All providers",
            text: "",
            severity: "secondary",
            size: "small",
            onClick: V
          }, {
            icon: se(() => [
              T(O(H), {
                icon: "tabler:arrow-left",
                "aria-hidden": "true"
              })
            ]),
            _: 1
          })
        ]),
        l("div", {
          ref_key: "detailHeading",
          ref: v,
          tabindex: "-1"
        }, [
          T(Le, {
            title: S.value.name,
            subtitle: S.value.hint,
            icon: S.value.icon || "tabler:key"
          }, null, 8, ["title", "subtitle", "icon"])
        ], 512),
        S.value.create_ui_id ? (c(), E(mo, {
          key: S.value.provider_id,
          tag: S.value.create_ui_id,
          "provider-id": S.value.provider_id,
          onChanged: O(A)
        }, null, 8, ["tag", "provider-id", "onChanged"])) : (c(), p(j, { key: 1 }, [
          l("p", _o, $(S.value.installed ? "This provider does not offer account setup." : "This provider is unavailable. You can still manage its existing accounts."), 1),
          S.value.total ? (c(), E(Et, {
            key: S.value.agent,
            query: "",
            "selected-agent": S.value.agent,
            management: "",
            "allow-setup": !1,
            onChanged: O(A)
          }, null, 8, ["selected-agent", "onChanged"])) : C("", !0)
        ], 64))
      ])) : C("", !0),
      u.value ? W((c(), p("div", Lo, [
        T(Le, {
          title: "Accounts",
          subtitle: "Connect a provider to run tasks, see usage, and manage access.",
          icon: "tabler:key"
        }),
        r.value.length ? (c(), p("nav", Mo, [
          b.value.length ? (c(), p("div", Bo, [
            (c(!0), p(j, null, ee(b.value, (y) => (c(), E(Xe, {
              key: y.provider_id,
              "data-account-provider": y.provider_id,
              title: y.name,
              hint: y.hint,
              icon: y.icon || "tabler:terminal-2",
              status: y.status,
              severity: y.severity,
              count: y.total ? `${y.ready} of ${y.total} ready` : void 0,
              onClick: (z) => x(y.provider_id, z)
            }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "count", "onClick"]))), 128))
          ])) : C("", !0),
          w.value.length ? (c(), p("details", {
            key: 1,
            class: "ac-more-providers",
            open: !b.value.length || void 0
          }, [
            l("summary", zo, [
              f[0] || (f[0] = N("More providers ", -1)),
              l("span", To, $(w.value.length), 1)
            ]),
            l("div", Fo, [
              (c(!0), p(j, null, ee(w.value, (y) => (c(), E(Xe, {
                key: y.provider_id,
                "data-account-provider": y.provider_id,
                title: y.name,
                hint: y.hint,
                icon: y.icon || "tabler:terminal-2",
                status: y.status,
                severity: y.severity,
                onClick: (z) => x(y.provider_id, z)
              }, null, 8, ["data-account-provider", "title", "hint", "icon", "status", "severity", "onClick"]))), 128))
            ])
          ], 8, Ao)) : C("", !0)
        ])) : (c(), p("p", Do, "No Autocode providers are installed."))
      ], 512)), [
        [xe, !S.value]
      ]) : C("", !0)
    ]));
  }
}), Po = { class: "ac ac-admin" }, Ro = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, Eo = {
  key: 1,
  class: "kx-loading",
  role: "status"
}, Ko = {
  key: 2,
  class: "ac-muted"
}, No = {
  key: 3,
  class: "kx-shell"
}, Uo = {
  class: "kx-rail",
  "aria-label": "Autocode sections"
}, Ho = { class: "kx-rail-body" }, jo = { class: "ac-section" }, Go = ["aria-label"], Wo = /* @__PURE__ */ oe({
  __name: "admin",
  setup(t) {
    const e = [
      { id: "images", label: "Images", icon: "tabler:box", permission: "can_images" },
      { id: "workspaces", label: "Workspaces", icon: "tabler:folder", permission: "can_workspaces" },
      { id: "docker", label: "Docker", icon: "tabler:brand-docker", permission: "can_prune" },
      { id: "limits", label: "Limits", icon: "tabler:adjustments", permission: "can_limits" },
      { id: "accounts", label: "Accounts", icon: "tabler:key", permission: "can_accounts" }
    ], n = It(), i = xt(), { catalog: o, error: s, load: a } = Kt(), u = J(() => o.value?.settings_path || "/system/autocode"), h = _(g(n.value.route?.includes("?") ? n.value.route : Bt.context?.route)), v = At("@history", ({ path: D }) => {
      D.split(/[?#]/, 1)[0] === u.value && (h.value = g(D));
    });
    nt(v), ne(() => n.value.route, (D) => {
      D?.includes("?") && (h.value = g(D));
    });
    function g(D) {
      const P = new URLSearchParams(D?.split("?")[1]?.split("#", 1)[0]).get("section");
      return e.find((R) => R.id === P)?.id;
    }
    async function I(D) {
      if (!D) {
        b.value = null, await Oe(), b.value = r.value ?? null;
        return;
      }
      D !== r.value && (h.value = D, i("navigate", { path: u.value + "?section=" + D }));
    }
    const k = J(() => e.filter((D) => o.value?.[D.permission])), d = J(() => k.value.find((D) => D.id === h.value) ?? k.value[0]), r = J(() => d.value?.id), b = _(null);
    ne(r, (D) => {
      b.value = D ?? null;
    }, { immediate: !0 });
    const w = _(""), S = _(), x = _(), V = _(), A = _(), m = _(null), f = _(null), y = J(() => ({
      images: U(S.value, "image", "images") ?? "Execution images",
      workspaces: U(x.value, "workspace", "workspaces") ?? "Host directories",
      docker: `${o.value?.build_cache_retention} cache retention`,
      limits: "Run and resource defaults",
      accounts: V.value ?? "Provider credentials"
    })), z = J(() => {
      if (r.value === "images") return { title: "Images", subtitle: "Manage the container images that run tasks.", icon: "tabler:box", action: S.value ? "Add image" : void 0 };
      if (r.value === "workspaces") return { title: "Workspaces", subtitle: "Manage the host directories that tasks can use.", icon: "tabler:folder", action: x.value ? "Add workspace" : void 0 };
    });
    ne(r, () => {
      w.value = "", A.value && (A.value.scrollTop = 0);
    });
    function U(D, P, R) {
      return D === void 0 ? void 0 : `${D} ${D === 1 ? P : R}`;
    }
    function Z() {
      r.value === "images" ? m.value?.open() : r.value === "workspaces" && f.value?.open();
    }
    return (D, P) => (c(), p("div", Po, [
      O(s) && !O(o) ? (c(), p("p", Ro, [
        N($(O(s)) + " ", 1),
        l("button", {
          class: "ac-link kx-focus-outline",
          type: "button",
          onClick: P[0] || (P[0] = //@ts-ignore
          (...R) => O(a) && O(a)(...R))
        }, "Retry")
      ])) : O(o) ? r.value ? (c(), p("div", No, [
        l("nav", Uo, [
          l("div", Ho, [
            T(O(ht), {
              "model-value": b.value,
              options: k.value,
              "option-label": "label",
              "option-value": "id",
              "aria-label": "Autocode settings",
              "scroll-height": "none",
              "select-on-focus": !1,
              "meta-key-selection": !0,
              "onUpdate:modelValue": I
            }, {
              option: se(({ option: R }) => [
                l("span", jo, [
                  T(O(H), {
                    icon: R.icon,
                    "aria-hidden": "true"
                  }, null, 8, ["icon"]),
                  l("span", null, [
                    N($(R.label), 1),
                    l("small", null, $(y.value[R.id]), 1)
                  ])
                ])
              ]),
              _: 1
            }, 8, ["model-value", "options"])
          ])
        ]),
        l("main", {
          class: "kx-main",
          "aria-label": d.value?.label
        }, [
          l("div", {
            ref_key: "content",
            ref: A,
            class: "kx-main-scroll"
          }, [
            z.value ? (c(), E(Le, B({ key: 0 }, z.value, {
              query: w.value,
              "onUpdate:query": P[1] || (P[1] = (R) => w.value = R),
              placeholder: `Search ${r.value}…`,
              onCreate: Z
            }), null, 16, ["query", "placeholder"])) : C("", !0),
            O(o).can_images ? W((c(), E(Pi, {
              key: 1,
              ref_key: "images",
              ref: m,
              query: r.value === "images" ? w.value : "",
              onCount: P[2] || (P[2] = (R) => S.value = R)
            }, null, 8, ["query"])), [
              [xe, r.value === "images"]
            ]) : C("", !0),
            O(o).can_workspaces ? W((c(), E(fs, {
              key: 2,
              ref_key: "workspaces",
              ref: f,
              query: r.value === "workspaces" ? w.value : "",
              onCount: P[3] || (P[3] = (R) => x.value = R)
            }, null, 8, ["query"])), [
              [xe, r.value === "workspaces"]
            ]) : C("", !0),
            r.value === "docker" ? (c(), E(xs, { key: 3 })) : C("", !0),
            r.value === "limits" ? (c(), E(po, {
              key: 4,
              onSaved: O(a)
            }, null, 8, ["onSaved"])) : C("", !0),
            O(o).can_accounts ? W((c(), E(Vo, {
              key: 5,
              active: r.value === "accounts",
              onStatus: P[4] || (P[4] = (R) => V.value = R)
            }, null, 8, ["active"])), [
              [xe, r.value === "accounts"]
            ]) : C("", !0)
          ], 512)
        ], 8, Go)
      ])) : (c(), p("p", Ko, "No management areas are available.")) : (c(), p("div", Eo, [
        T(O(H), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        P[5] || (P[5] = N(" Loading…", -1))
      ]))
    ]));
  }
}), na = {
  rootComponent: Wo,
  plugins: [wt]
};
export {
  na as mountConfig
};
