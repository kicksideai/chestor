import { s as Tt, B as G, R as Xt, a as Z, f as nt, b as Sn, c as Wn, d as Vn, Q as cn, z as Jn, u as Yn, e as Gn, P as Zn } from "./wc-runtime-BqkbuCPp.js";
import { openBlock as a, createElementBlock as u, mergeProps as m, createElementVNode as g, resolveComponent as bt, resolveDirective as tn, createBlock as h, Transition as Tn, withCtx as I, renderSlot as _, normalizeClass as D, resolveDynamicComponent as M, createCommentVNode as v, withDirectives as It, createTextVNode as U, toDisplayString as A, defineComponent as V, createVNode as T, unref as d, createSlots as Qn, useId as Xn, computed as P, Fragment as S, renderList as E, vShow as te, useModel as In, mergeModels as ne, ref as O, withKeys as ee, vModelText as oe, shallowRef as rt, watch as un, onMounted as _n, onBeforeUnmount as jn, isRef as pn } from "vue";
import { Icon as Y } from "@iconify/vue";
import { api as pt, on as re } from "@wippy-fe/proxy";
var zn = {
  name: "TimesIcon",
  extends: Tt
};
function ae(t) {
  return de(t) || le(t) || ie(t) || se();
}
function se() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function ie(t, n) {
  if (t) {
    if (typeof t == "string") return Kt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Kt(t, n) : void 0;
  }
}
function le(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function de(t) {
  if (Array.isArray(t)) return Kt(t);
}
function Kt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function ce(t, n, e, o, s, r) {
  return a(), u("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ae(n[0] || (n[0] = [g("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
zn.render = ce;
var ue = `
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
`, pe = {
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
}, be = G.extend({
  name: "message",
  style: ue,
  classes: pe
}), ge = {
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
  style: be,
  provide: function() {
    return {
      $pcMessage: this,
      $parentInstance: this
    };
  }
};
function kt(t) {
  "@babel/helpers - typeof";
  return kt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, kt(t);
}
function bn(t, n, e) {
  return (n = fe(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function fe(t) {
  var n = he(t, "string");
  return kt(n) == "symbol" ? n : n + "";
}
function he(t, n) {
  if (kt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (kt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Bt = {
  name: "Message",
  extends: ge,
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
      return nt(bn(bn({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: Xt
  },
  components: {
    TimesIcon: zn
  }
};
function wt(t) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, wt(t);
}
function gn(t, n) {
  var e = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    n && (o = o.filter(function(s) {
      return Object.getOwnPropertyDescriptor(t, s).enumerable;
    })), e.push.apply(e, o);
  }
  return e;
}
function fn(t) {
  for (var n = 1; n < arguments.length; n++) {
    var e = arguments[n] != null ? arguments[n] : {};
    n % 2 ? gn(Object(e), !0).forEach(function(o) {
      ve(t, o, e[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)) : gn(Object(e)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(e, o));
    });
  }
  return t;
}
function ve(t, n, e) {
  return (n = me(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function me(t) {
  var n = ye(t, "string");
  return wt(n) == "symbol" ? n : n + "";
}
function ye(t, n) {
  if (wt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (wt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var ke = ["data-p"], we = ["data-p"], $e = ["data-p"], Ae = ["aria-label", "data-p"], Ce = ["data-p"];
function Pe(t, n, e, o, s, r) {
  var i = bt("TimesIcon"), l = tn("ripple");
  return a(), h(Tn, m({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: I(function() {
      return [s.visible ? (a(), u("div", m({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": r.dataP
      }, t.ptm("root")), [g("div", m({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? _(t.$slots, "container", {
        key: 0,
        closeCallback: r.close
      }) : (a(), u("div", m({
        key: 1,
        class: t.cx("content"),
        "data-p": r.dataP
      }, t.ptm("content")), [_(t.$slots, "icon", {
        class: D(t.cx("icon"))
      }, function() {
        return [(a(), h(M(t.icon ? "span" : null), m({
          class: [t.cx("icon"), t.icon],
          "data-p": r.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (a(), u("div", m({
        key: 0,
        class: t.cx("text"),
        "data-p": r.dataP
      }, t.ptm("text")), [_(t.$slots, "default")], 16, $e)) : v("", !0), t.closable ? It((a(), u("button", m({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": r.closeAriaLabel,
        type: "button",
        onClick: n[0] || (n[0] = function(p) {
          return r.close(p);
        }),
        "data-p": r.dataP
      }, fn(fn({}, t.closeButtonProps), t.ptm("closeButton"))), [_(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (a(), u("i", m({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, Ce)) : (a(), h(i, m({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, Ae)), [[l]]) : v("", !0)], 16, we))], 16)], 16, ke)) : v("", !0)];
    }),
    _: 3
  }, 16);
}
Bt.render = Pe;
var On = {
  name: "SpinnerIcon",
  extends: Tt
};
function xe(t) {
  return _e(t) || Ie(t) || Te(t) || Se();
}
function Se() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Te(t, n) {
  if (t) {
    if (typeof t == "string") return Rt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Rt(t, n) : void 0;
  }
}
function Ie(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function _e(t) {
  if (Array.isArray(t)) return Rt(t);
}
function Rt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function je(t, n, e, o, s, r) {
  return a(), u("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), xe(n[0] || (n[0] = [g("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
On.render = je;
var ze = `
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
`, Oe = {
  root: function(n) {
    var e = n.props, o = n.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Wn(e.value) && String(e.value).length === 1,
      "p-badge-dot": Sn(e.value) && !o.$slots.default,
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
}, Be = G.extend({
  name: "badge",
  style: ze,
  classes: Oe
}), Le = {
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
  style: Be,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function $t(t) {
  "@babel/helpers - typeof";
  return $t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, $t(t);
}
function hn(t, n, e) {
  return (n = Ee(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ee(t) {
  var n = Me(t, "string");
  return $t(n) == "symbol" ? n : n + "";
}
function Me(t, n) {
  if ($t(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Bn = {
  name: "Badge",
  extends: Le,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return nt(hn(hn({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ne = ["data-p"];
function qe(t, n, e, o, s, r) {
  return a(), u("span", m({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [_(t.$slots, "default", {}, function() {
    return [U(A(t.value), 1)];
  })], 16, Ne);
}
Bn.render = qe;
var De = `
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
function At(t) {
  "@babel/helpers - typeof";
  return At = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, At(t);
}
function W(t, n, e) {
  return (n = Ue(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ue(t) {
  var n = Fe(t, "string");
  return At(n) == "symbol" ? n : n + "";
}
function Fe(t, n) {
  if (At(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (At(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var He = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-button p-component", W(W(W(W(W(W(W(W(W({
      "p-button-icon-only": e.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", e.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(n) {
    var e = n.props;
    return ["p-button-icon", W({}, "p-button-icon-".concat(e.iconPos), e.label)];
  },
  label: "p-button-label"
}, Ke = G.extend({
  name: "button",
  style: De,
  classes: He
}), Re = {
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
  style: Ke,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Ct(t) {
  "@babel/helpers - typeof";
  return Ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Ct(t);
}
function q(t, n, e) {
  return (n = We(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function We(t) {
  var n = Ve(t, "string");
  return Ct(n) == "symbol" ? n : n + "";
}
function Ve(t, n) {
  if (Ct(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (Ct(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var nn = {
  name: "Button",
  extends: Re,
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
      return Sn(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return nt(q(q(q(q(q(q(q(q(q(q({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return nt(q(q({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return nt(q(q({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: On,
    Badge: Bn
  },
  directives: {
    ripple: Xt
  }
}, Je = ["data-p"], Ye = ["data-p"];
function Ge(t, n, e, o, s, r) {
  var i = bt("SpinnerIcon"), l = bt("Badge"), p = tn("ripple");
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : It((a(), h(M(t.as), m({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: I(function() {
      return [_(t.$slots, "default", {}, function() {
        return [t.loading ? _(t.$slots, "loadingicon", m({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (a(), u("span", m({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (a(), h(i, m({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : _(t.$slots, "icon", m({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (a(), u("span", m({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Je)) : v("", !0)];
        }), t.label ? (a(), u("span", m({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), A(t.label), 17, Ye)) : v("", !0), t.badge ? (a(), h(l, {
          key: 3,
          value: t.badge,
          class: D(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : v("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[p]]);
}
nn.render = Ge;
const Ze = { class: "kx-empty" }, Qe = { class: "kx-empty-ico" }, Xe = { class: "kx-empty-title" }, to = {
  key: 0,
  class: "kx-empty-sub"
}, Lt = /* @__PURE__ */ V({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(t) {
    return (n, e) => (a(), u("div", Ze, [
      g("div", Qe, [
        T(d(Y), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      g("div", Xe, A(t.title), 1),
      t.hint || n.$slots.hint ? (a(), u("p", to, [
        _(n.$slots, "hint", {}, () => [
          U(A(t.hint), 1)
        ])
      ])) : v("", !0),
      t.cta ? (a(), h(d(nn), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, Qn({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: I(({ class: o }) => [
            T(d(Y), {
              icon: t.ctaIcon,
              class: D(o),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : v("", !0)
    ]));
  }
}), no = ["aria-labelledby"], eo = { class: "kx-railhead" }, oo = ["id"], ro = { key: 0 }, ao = { class: "kx-railhead-acts" }, so = { class: "kx-rail-body" }, io = /* @__PURE__ */ V({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(t) {
    const n = Xn();
    return (e, o) => (a(), u("aside", {
      class: D(["kx-rail", { "kx-settings-list-rail": t.settings }]),
      "aria-labelledby": d(n)
    }, [
      g("div", eo, [
        g("span", {
          id: d(n),
          class: "kx-railhead-title"
        }, [
          U(A(t.title), 1),
          t.count !== void 0 ? (a(), u("b", ro, A(t.count), 1)) : v("", !0)
        ], 8, oo),
        g("div", ao, [
          _(e.$slots, "actions")
        ])
      ]),
      _(e.$slots, "toolbar"),
      g("div", so, [
        _(e.$slots, "default")
      ])
    ], 10, no));
  }
});
var lo = `
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
`, co = {
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
}, uo = G.extend({
  name: "tag",
  style: lo,
  classes: co
}), po = {
  name: "BaseTag",
  extends: Z,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: uo,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Pt(t) {
  "@babel/helpers - typeof";
  return Pt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Pt(t);
}
function bo(t, n, e) {
  return (n = go(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function go(t) {
  var n = fo(t, "string");
  return Pt(n) == "symbol" ? n : n + "";
}
function fo(t, n) {
  if (Pt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (Pt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var st = {
  name: "Tag",
  extends: po,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return nt(bo({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, ho = ["data-p"];
function vo(t, n, e, o, s, r) {
  return a(), u("span", m({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (a(), h(M(t.$slots.icon), m({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (a(), u("span", m({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : v("", !0), t.value != null || t.$slots.default ? _(t.$slots, "default", {
    key: 2
  }, function() {
    return [g("span", m({
      class: t.cx("label")
    }, t.ptm("label")), A(t.value), 17)];
  }) : v("", !0)], 16, ho);
}
st.render = vo;
const mo = { class: "system-section-head" }, yo = { class: "system-section-head-text" }, ko = {
  key: 0,
  class: "kx-head-actions"
}, Wt = /* @__PURE__ */ V({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(t) {
    return (n, e) => (a(), u("header", mo, [
      g("div", yo, [
        g("h1", null, A(t.title), 1),
        g("p", null, A(t.description), 1)
      ]),
      n.$slots.actions ? (a(), u("div", ko, [
        _(n.$slots, "actions")
      ])) : v("", !0)
    ]));
  }
});
function xt(t, n) {
  if (!t) return "";
  const e = Math.max(0, Math.floor(n - t));
  return e < 60 ? "just now" : e < 3600 ? `${Math.floor(e / 60)}m ago` : e < 86400 ? `${Math.floor(e / 3600)}h ago` : `${Math.floor(e / 86400)}d ago`;
}
function Ln(t) {
  return t ? new Date(t * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
}
function wo(t, n) {
  const e = new Date(t * 1e3), o = new Date(n * 1e3), s = new Date(o.getFullYear(), o.getMonth(), o.getDate()).getTime() / 1e3;
  if (t >= s) return "Today";
  const r = new Date(o.getFullYear(), o.getMonth(), o.getDate() - 1).getTime() / 1e3;
  return t >= r ? "Yesterday" : e.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}
function En(t) {
  const n = t.replace(/^.*:/, "").replace(/[._-]+/g, " ").trim();
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
}
function yt(t) {
  return En(t) || "Note";
}
function at(t) {
  return En(t) || "Open";
}
function Vt(t) {
  const n = String(t || "").toLowerCase();
  return n === "blocked" ? "danger" : n === "in_progress" ? "info" : ["done", "closed", "completed", "resolved"].includes(n) ? "success" : "secondary";
}
function Et(t) {
  const n = t.replace(/^.*:/, "").toLowerCase();
  return n === "blocker" || n === "risk" ? "danger" : n === "question" || n === "handoff" ? "warn" : n === "decision" || n === "milestone" ? "success" : "secondary";
}
const $o = ["aria-current"], Ao = { class: "jr-row-main" }, Co = { class: "jr-row-line" }, Po = { class: "jr-row-title" }, xo = ["title"], So = {
  key: 0,
  class: "jr-row-line"
}, To = {
  key: 1,
  class: "jr-row-detail"
}, F = /* @__PURE__ */ V({
  __name: "ItemRow",
  props: {
    title: {},
    detail: {},
    at: {},
    now: {},
    tag: {},
    severity: {},
    active: { type: Boolean },
    fresh: { type: Boolean }
  },
  emits: ["open"],
  setup(t) {
    return (n, e) => (a(), u("button", {
      type: "button",
      class: D(["jr-row", { fresh: t.fresh }]),
      "aria-current": t.active ? "true" : void 0,
      onClick: e[0] || (e[0] = (o) => n.$emit("open"))
    }, [
      g("span", Ao, [
        g("span", Co, [
          g("span", Po, A(t.title), 1),
          t.at ? (a(), u("time", {
            key: 0,
            class: "jr-row-time",
            title: d(Ln)(t.at)
          }, A(d(xt)(t.at, t.now)), 9, xo)) : v("", !0)
        ]),
        t.detail || t.tag ? (a(), u("span", So, [
          t.tag ? (a(), h(d(st), {
            key: 0,
            value: t.tag,
            severity: t.severity || "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"])) : v("", !0),
          t.detail ? (a(), u("span", To, A(t.detail), 1)) : v("", !0)
        ])) : v("", !0)
      ])
    ], 10, $o));
  }
}), vn = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, mn = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function Io(t) {
  let n = 2166136261;
  for (let e = 0; e < t.length; e++)
    n ^= t.charCodeAt(e), n = Math.imul(n, 16777619) >>> 0;
  return mn[n % 26] + mn[(n >>> 8) % 26];
}
function _o(t) {
  const n = t.split(/\s+/).filter(Boolean);
  return n.length ? n.length === 1 ? n[0].slice(0, 2).toUpperCase() : (n[0][0] + n[1][0]).toUpperCase() : "??";
}
function gt(t) {
  const n = (t || "").trim(), e = (n.replace(/[^a-z0-9]/gi, "").slice(-6) || "unknown").toUpperCase(), o = n.replace(vn, " ").replace(/[-_.:/]+/g, " ").replace(/\s+/g, " ").trim(), s = !o || vn.test(n), r = o.length > 24 ? `${o.slice(0, 23)}…` : o, i = r ? r.charAt(0).toUpperCase() + r.slice(1) : "";
  return {
    label: i ? s ? `${i} ${e}` : i : `Agent ${e}`,
    initials: s ? Io(n || e) : _o(r)
  };
}
const jo = 3600, zo = 86400;
function Oo(t, n) {
  const e = n - t;
  return e <= jo ? "now" : e <= zo ? "today" : "older";
}
function Bo(t, n) {
  const e = (t || "").trim();
  if (e) return e;
  const o = (n || "").trim();
  return o ? `cursor:${o}` : "";
}
function Lo(t) {
  return t === "auto" ? "Position tracked while working" : "Recorded position";
}
function Eo(t) {
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
function Mo(t, n) {
  t.agentId = t.agentId || n.agentId, t.cursorId = t.cursorId || n.cursorId, t.origin = t.origin || n.origin, t.lastActivityAt = Math.max(t.lastActivityAt, n.lastActivityAt), t.lastSeenSeq = Math.max(t.lastSeenSeq, n.lastSeenSeq), t.factCount += n.factCount, t.openSpans += n.openSpans, t.purpose = t.purpose || n.purpose, t.headline = t.headline || n.headline, n.lastTouch && n.lastTouch.seq > (t.lastTouch?.seq || 0) && (t.lastTouch = n.lastTouch), n.spanTask && n.spanTask.at > (t.spanTask?.at ?? -1) && (t.spanTask = n.spanTask);
}
function No(t, n, e) {
  const o = /* @__PURE__ */ new Map(), s = /* @__PURE__ */ new Map();
  function r(l, p) {
    const c = [(l || "").trim(), p ? `cursor:${p.trim()}` : ""].filter(Boolean), k = Bo(l, p) || `cursor:${o.size}`, x = [...new Set(c.map((b) => s.get(b)).filter(Boolean))], j = x[0] || k, w = o.get(j) || Eo(j);
    o.set(j, w);
    for (const b of x.slice(1)) {
      const y = o.get(b);
      y && (Mo(w, y), o.delete(b));
      for (const [f, B] of s) B === b && s.set(f, j);
    }
    for (const b of c) s.set(b, j);
    w.agentId = w.agentId || (l || "").trim(), w.cursorId = w.cursorId || (p || "").trim(), w.id = w.agentId || (w.cursorId ? `cursor:${w.cursorId}` : j);
    const $ = gt(w.agentId || w.cursorId);
    return w.label = $.label, w.initials = $.initials, w;
  }
  for (const l of t) {
    const p = r(l.agent_id, l.cursor_id);
    p.origin = l.origin || p.origin, p.lastActivityAt = Math.max(p.lastActivityAt, l.updated_at), p.lastSeenSeq = Math.max(p.lastSeenSeq, l.last_seen_seq || 0), p.purpose = l.purpose || l.checkpoint?.headline || p.purpose, p.headline = l.last_touch?.title || p.headline, l.last_touch && l.last_touch.seq > (p.lastTouch?.seq || 0) && (p.lastTouch = l.last_touch);
  }
  for (const l of [...n].sort((p, c) => p.last_activity_at - c.last_activity_at)) {
    const p = r(l.agent_id, l.cursor_id);
    p.origin = l.origin || p.origin, p.lastActivityAt = Math.max(p.lastActivityAt, l.last_activity_at, l.ended_at || 0), p.lastSeenSeq = Math.max(p.lastSeenSeq, l.last_seq || 0), p.factCount += l.fact_count || 0, l.state === "open" && (p.openSpans += 1), p.purpose = l.working_on?.text || p.purpose, p.headline = l.last_fact?.title || p.headline;
    const c = l.working_on?.task_id || l.task_id || l.last_fact?.task_id;
    c && (p.spanTask = { id: c, at: l.last_activity_at });
  }
  const i = [...o.values()];
  for (const l of i)
    l.working = l.openSpans > 0, l.liveness = Oo(l.lastActivityAt, e), l.purpose = l.purpose || l.headline || Lo(l.origin);
  return i.sort((l, p) => p.lastActivityAt - l.lastActivityAt || l.label.localeCompare(p.label));
}
function qo(t) {
  const n = { now: [], today: [], older: [] };
  for (const e of t) n[e.liveness].push(e);
  return n;
}
function Do(t, n) {
  return t.spanTask?.id || n.get(t.lastTouch?.event_id || "") || "";
}
const Uo = {
  class: "jr-detail",
  "aria-live": "polite"
}, Fo = {
  key: 1,
  class: "kx-loading"
}, Ho = {
  key: 0,
  class: "jr-path",
  "aria-label": "Part of"
}, Ko = ["onClick"], Ro = { class: "jr-tags" }, Wo = {
  key: 1,
  class: "jr-body"
}, Vo = {
  key: 2,
  class: "jr-block"
}, Jo = {
  key: 3,
  class: "jr-block"
}, Yo = {
  key: 4,
  class: "jr-block"
}, Go = {
  key: 5,
  class: "jr-block"
}, Zo = { class: "kx-count" }, Qo = { class: "jr-block" }, Xo = { class: "kx-count" }, tr = {
  key: 0,
  class: "jr-list-empty"
}, nr = { class: "jr-tags" }, er = {
  key: 0,
  class: "jr-body"
}, or = {
  key: 1,
  class: "jr-block"
}, rr = /* @__PURE__ */ V({
  __name: "ItemDetail",
  props: {
    detail: {},
    loading: { type: Boolean },
    error: {},
    canBack: { type: Boolean },
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open", "back", "close"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = P(() => e.detail?.kind === "task" ? e.detail.branch : null), r = P(() => e.detail?.kind === "fact" ? e.detail.event : null), i = P(() => s.value?.task || null), l = P(() => (s.value?.deps?.incoming || []).filter((b) => b.kind === "blocks").map((b) => b.from_task_id)), p = P(() => (s.value?.deps?.outgoing || []).filter((b) => b.kind === "blocks").map((b) => b.to_task_id)), c = P(() => [
      ...(s.value?.deps?.outgoing || []).filter((b) => b.kind !== "blocks").map((b) => ({ id: b.to_task_id, kind: b.kind })),
      ...(s.value?.deps?.incoming || []).filter((b) => b.kind !== "blocks").map((b) => ({ id: b.from_task_id, kind: b.kind }))
    ]), k = P(() => i.value?.title || r.value?.title || r.value?.body?.slice(0, 120) || "Untitled"), x = P(() => i.value ? [at(i.value.status), `updated ${xt(i.value.updated_at, e.now)}`].join(" · ") : r.value ? `${yt(r.value.event_type)} by ${gt(r.value.actor_id || "").label} · ${Ln(r.value.ts)}` : ""), j = P(() => i.value?.description || i.value?.digest || ""), w = P(() => {
      const b = String(r.value?.effective_state || r.value?.lifecycle || "active").toLowerCase();
      return b === "active" ? "" : at(b);
    });
    function $(b) {
      o("open", b);
    }
    return (b, y) => (a(), u("article", Uo, [
      T(Wt, {
        title: t.loading && !t.detail ? "Opening…" : k.value,
        description: t.loading && !t.detail ? "" : x.value
      }, {
        actions: I(() => [
          t.canBack ? (a(), u("button", {
            key: 0,
            type: "button",
            class: "kx-iconbtn",
            "aria-label": "Back",
            title: "Back",
            onClick: y[0] || (y[0] = (f) => o("back"))
          }, [
            T(d(Y), {
              icon: "tabler:arrow-left",
              "aria-hidden": "true"
            })
          ])) : v("", !0),
          g("button", {
            type: "button",
            class: "kx-iconbtn",
            "aria-label": "Close",
            title: "Close",
            onClick: y[1] || (y[1] = (f) => o("close"))
          }, [
            T(d(Y), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      t.error ? (a(), h(Lt, {
        key: 0,
        icon: "tabler:alert-triangle",
        title: "This item could not be opened",
        hint: t.error
      }, null, 8, ["hint"])) : t.loading && !t.detail ? (a(), u("div", Fo, [
        T(d(Y), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        y[3] || (y[3] = U(" Loading…", -1))
      ])) : s.value && i.value ? (a(), u(S, { key: 2 }, [
        s.value.ancestors.length ? (a(), u("nav", Ho, [
          (a(!0), u(S, null, E(s.value.ancestors, (f, B) => (a(), u(S, {
            key: f.id
          }, [
            B ? (a(), h(d(Y), {
              key: 0,
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            })) : v("", !0),
            g("button", {
              type: "button",
              onClick: (H) => $({ kind: "task", id: f.id })
            }, A(f.title), 9, Ko)
          ], 64))), 128))
        ])) : v("", !0),
        g("div", Ro, [
          T(d(st), {
            value: d(at)(i.value.status),
            severity: d(Vt)(i.value.status),
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"]),
          i.value.work_kind ? (a(), h(d(st), {
            key: 0,
            value: d(at)(i.value.work_kind),
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"])) : v("", !0)
        ]),
        j.value ? (a(), u("p", Wo, A(j.value), 1)) : v("", !0),
        l.value.length ? (a(), u("section", Vo, [
          y[4] || (y[4] = g("h2", null, "Waiting on", -1)),
          (a(!0), u(S, null, E(l.value, (f) => (a(), h(F, {
            key: f,
            title: t.taskTitle(f) || "Untitled task",
            now: t.now,
            onOpen: (B) => $({ kind: "task", id: f })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : v("", !0),
        p.value.length ? (a(), u("section", Jo, [
          y[5] || (y[5] = g("h2", null, "Holds up", -1)),
          (a(!0), u(S, null, E(p.value, (f) => (a(), h(F, {
            key: f,
            title: t.taskTitle(f) || "Untitled task",
            now: t.now,
            onOpen: (B) => $({ kind: "task", id: f })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : v("", !0),
        c.value.length ? (a(), u("section", Yo, [
          y[6] || (y[6] = g("h2", null, "Related", -1)),
          (a(!0), u(S, null, E(c.value, (f) => (a(), h(F, {
            key: `${f.kind}:${f.id}`,
            title: t.taskTitle(f.id) || "Untitled task",
            tag: d(at)(f.kind),
            now: t.now,
            onOpen: (B) => $({ kind: "task", id: f.id })
          }, null, 8, ["title", "tag", "now", "onOpen"]))), 128))
        ])) : v("", !0),
        s.value.children.length ? (a(), u("section", Go, [
          g("h2", null, [
            y[7] || (y[7] = U("Parts ", -1)),
            g("span", Zo, A(s.value.children.length), 1)
          ]),
          (a(!0), u(S, null, E(s.value.children, (f) => (a(), h(F, {
            key: f.id,
            title: f.title,
            at: f.updated_at,
            now: t.now,
            tag: d(at)(f.status),
            severity: d(Vt)(f.status),
            detail: f.open_count ? `${f.open_count} open inside` : "",
            onOpen: (B) => $({ kind: "task", id: f.id })
          }, null, 8, ["title", "at", "now", "tag", "severity", "detail", "onOpen"]))), 128))
        ])) : v("", !0),
        g("section", Qo, [
          g("h2", null, [
            y[8] || (y[8] = U("History ", -1)),
            g("span", Xo, A(s.value.facts.length), 1)
          ]),
          s.value.facts.length ? v("", !0) : (a(), u("p", tr, "Nothing has been recorded on this task yet.")),
          (a(!0), u(S, null, E(s.value.facts, (f) => (a(), h(F, {
            key: f.id,
            title: f.title || f.body || "Untitled",
            detail: d(gt)(f.actor_id || "").label,
            at: f.ts,
            now: t.now,
            tag: d(yt)(f.event_type),
            severity: d(Et)(f.event_type),
            onOpen: (B) => $({ kind: "fact", id: f.id })
          }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "onOpen"]))), 128))
        ])
      ], 64)) : s.value ? (a(), h(Lt, {
        key: 3,
        icon: "tabler:file-unknown",
        title: "This task is no longer in the journal"
      })) : r.value ? (a(), u(S, { key: 4 }, [
        g("div", nr, [
          T(d(st), {
            value: d(yt)(r.value.event_type),
            severity: d(Et)(r.value.event_type),
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"]),
          w.value ? (a(), h(d(st), {
            key: 0,
            value: w.value,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"])) : v("", !0),
          (a(!0), u(S, null, E(r.value.tags || [], (f) => (a(), h(d(st), {
            key: f,
            value: f,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"]))), 128))
        ]),
        r.value.body && r.value.body !== r.value.title ? (a(), u("p", er, A(r.value.body), 1)) : v("", !0),
        r.value.task_id ? (a(), u("section", or, [
          y[9] || (y[9] = g("h2", null, "Task", -1)),
          T(F, {
            title: t.taskTitle(r.value.task_id) || "Untitled task",
            now: t.now,
            onOpen: y[2] || (y[2] = (f) => $({ kind: "task", id: r.value.task_id }))
          }, null, 8, ["title", "now"])
        ])) : v("", !0)
      ], 64)) : v("", !0)
    ]));
  }
});
var ar = `
    .p-avatar {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: dt('avatar.width');
        height: dt('avatar.height');
        font-size: dt('avatar.font.size');
        background: dt('avatar.background');
        color: dt('avatar.color');
        border-radius: dt('avatar.border.radius');
    }

    .p-avatar-image {
        background: transparent;
    }

    .p-avatar-circle {
        border-radius: 50%;
    }

    .p-avatar-circle img {
        border-radius: 50%;
    }

    .p-avatar-icon {
        font-size: dt('avatar.icon.size');
        width: dt('avatar.icon.size');
        height: dt('avatar.icon.size');
    }

    .p-avatar img {
        width: 100%;
        height: 100%;
    }

    .p-avatar-lg {
        width: dt('avatar.lg.width');
        height: dt('avatar.lg.width');
        font-size: dt('avatar.lg.font.size');
    }

    .p-avatar-lg .p-avatar-icon {
        font-size: dt('avatar.lg.icon.size');
        width: dt('avatar.lg.icon.size');
        height: dt('avatar.lg.icon.size');
    }

    .p-avatar-xl {
        width: dt('avatar.xl.width');
        height: dt('avatar.xl.width');
        font-size: dt('avatar.xl.font.size');
    }

    .p-avatar-xl .p-avatar-icon {
        font-size: dt('avatar.xl.icon.size');
        width: dt('avatar.xl.icon.size');
        height: dt('avatar.xl.icon.size');
    }

    .p-avatar-group {
        display: flex;
        align-items: center;
    }

    .p-avatar-group .p-avatar + .p-avatar {
        margin-inline-start: dt('avatar.group.offset');
    }

    .p-avatar-group .p-avatar {
        border: 2px solid dt('avatar.group.border.color');
    }

    .p-avatar-group .p-avatar-lg + .p-avatar-lg {
        margin-inline-start: dt('avatar.lg.group.offset');
    }

    .p-avatar-group .p-avatar-xl + .p-avatar-xl {
        margin-inline-start: dt('avatar.xl.group.offset');
    }
`, sr = {
  root: function(n) {
    var e = n.props;
    return ["p-avatar p-component", {
      "p-avatar-image": e.image != null,
      "p-avatar-circle": e.shape === "circle",
      "p-avatar-lg": e.size === "large",
      "p-avatar-xl": e.size === "xlarge"
    }];
  },
  label: "p-avatar-label",
  icon: "p-avatar-icon"
}, ir = G.extend({
  name: "avatar",
  style: ar,
  classes: sr
}), lr = {
  name: "BaseAvatar",
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
    image: {
      type: String,
      default: null
    },
    size: {
      type: String,
      default: "normal"
    },
    shape: {
      type: String,
      default: "square"
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
  style: ir,
  provide: function() {
    return {
      $pcAvatar: this,
      $parentInstance: this
    };
  }
};
function St(t) {
  "@babel/helpers - typeof";
  return St = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, St(t);
}
function yn(t, n, e) {
  return (n = dr(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function dr(t) {
  var n = cr(t, "string");
  return St(n) == "symbol" ? n : n + "";
}
function cr(t, n) {
  if (St(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (St(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Jt = {
  name: "Avatar",
  extends: lr,
  inheritAttrs: !1,
  emits: ["error"],
  methods: {
    onError: function(n) {
      this.$emit("error", n);
    }
  },
  computed: {
    dataP: function() {
      return nt(yn(yn({}, this.shape, this.shape), this.size, this.size));
    }
  }
}, ur = ["aria-labelledby", "aria-label", "data-p"], pr = ["data-p"], br = ["data-p"], gr = ["src", "alt", "data-p"];
function fr(t, n, e, o, s, r) {
  return a(), u("div", m({
    class: t.cx("root"),
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [_(t.$slots, "default", {}, function() {
    return [t.label ? (a(), u("span", m({
      key: 0,
      class: t.cx("label")
    }, t.ptm("label"), {
      "data-p": r.dataP
    }), A(t.label), 17, pr)) : t.$slots.icon ? (a(), h(M(t.$slots.icon), {
      key: 1,
      class: D(t.cx("icon"))
    }, null, 8, ["class"])) : t.icon ? (a(), u("span", m({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon"), {
      "data-p": r.dataP
    }), null, 16, br)) : t.image ? (a(), u("img", m({
      key: 3,
      src: t.image,
      alt: t.ariaLabel,
      onError: n[0] || (n[0] = function() {
        return r.onError && r.onError.apply(r, arguments);
      })
    }, t.ptm("image"), {
      "data-p": r.dataP
    }), null, 16, gr)) : v("", !0)];
  })], 16, ur);
}
Jt.render = fr;
var Mn = {
  name: "ChevronRightIcon",
  extends: Tt
};
function hr(t) {
  return kr(t) || yr(t) || mr(t) || vr();
}
function vr() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function mr(t, n) {
  if (t) {
    if (typeof t == "string") return Yt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Yt(t, n) : void 0;
  }
}
function yr(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function kr(t) {
  if (Array.isArray(t)) return Yt(t);
}
function Yt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function wr(t, n, e, o, s, r) {
  return a(), u("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), hr(n[0] || (n[0] = [g("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Mn.render = wr;
var en = {
  name: "ChevronUpIcon",
  extends: Tt
};
function $r(t) {
  return xr(t) || Pr(t) || Cr(t) || Ar();
}
function Ar() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cr(t, n) {
  if (t) {
    if (typeof t == "string") return Gt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Gt(t, n) : void 0;
  }
}
function Pr(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function xr(t) {
  if (Array.isArray(t)) return Gt(t);
}
function Gt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Sr(t, n, e, o, s, r) {
  return a(), u("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), $r(n[0] || (n[0] = [g("path", {
    d: "M12.2097 10.4113C12.1057 10.4118 12.0027 10.3915 11.9067 10.3516C11.8107 10.3118 11.7237 10.2532 11.6506 10.1792L6.93602 5.46461L2.22139 10.1476C2.07272 10.244 1.89599 10.2877 1.71953 10.2717C1.54307 10.2556 1.3771 10.1808 1.24822 10.0593C1.11933 9.93766 1.035 9.77633 1.00874 9.6011C0.982477 9.42587 1.0158 9.2469 1.10338 9.09287L6.37701 3.81923C6.52533 3.6711 6.72639 3.58789 6.93602 3.58789C7.14565 3.58789 7.3467 3.6711 7.49502 3.81923L12.7687 9.09287C12.9168 9.24119 13 9.44225 13 9.65187C13 9.8615 12.9168 10.0626 12.7687 10.2109C12.616 10.3487 12.4151 10.4207 12.2097 10.4113Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
en.render = Sr;
var Tr = {
  root: "p-accordioncontent",
  contentWrapper: "p-accordioncontent-wrapper",
  content: "p-accordioncontent-content"
}, Ir = G.extend({
  name: "accordioncontent",
  classes: Tr
}), _r = {
  name: "BaseAccordionContent",
  extends: Z,
  props: {
    as: {
      type: [String, Object],
      default: "DIV"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: Ir,
  provide: function() {
    return {
      $pcAccordionContent: this,
      $parentInstance: this
    };
  }
}, on = {
  name: "AccordionContent",
  extends: _r,
  inheritAttrs: !1,
  inject: ["$pcAccordion", "$pcAccordionPanel"],
  computed: {
    id: function() {
      return "".concat(this.$pcAccordion.$id, "_accordioncontent_").concat(this.$pcAccordionPanel.value);
    },
    ariaLabelledby: function() {
      return "".concat(this.$pcAccordion.$id, "_accordionheader_").concat(this.$pcAccordionPanel.value);
    },
    attrs: function() {
      return m(this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    a11yAttrs: function() {
      return {
        id: this.id,
        role: "region",
        "aria-labelledby": this.ariaLabelledby,
        "data-pc-name": "accordioncontent",
        "data-p-active": this.$pcAccordionPanel.active
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.$pcAccordionPanel.active
        }
      };
    }
  }
};
function jr(t, n, e, o, s, r) {
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs
  }) : (a(), h(Tn, m({
    key: 0,
    name: "p-collapsible"
  }, t.ptm("transition", r.ptParams)), {
    default: I(function() {
      return [!r.$pcAccordion.lazy || r.$pcAccordionPanel.active ? It((a(), h(M(t.as), m({
        key: 0,
        class: t.cx("root")
      }, r.attrs), {
        default: I(function() {
          return [g("div", m({
            class: t.cx("contentWrapper")
          }, t.ptm("contentWrapper", r.ptParams)), [g("div", m({
            class: t.cx("content")
          }, t.ptm("content", r.ptParams)), [_(t.$slots, "default")], 16)], 16)];
        }),
        _: 3
      }, 16, ["class"])), [[te, r.$pcAccordion.lazy ? !0 : r.$pcAccordionPanel.active]]) : v("", !0)];
    }),
    _: 3
  }, 16));
}
on.render = jr;
var Nn = {
  name: "ChevronDownIcon",
  extends: Tt
};
function zr(t) {
  return Er(t) || Lr(t) || Br(t) || Or();
}
function Or() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Br(t, n) {
  if (t) {
    if (typeof t == "string") return Zt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Zt(t, n) : void 0;
  }
}
function Lr(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Er(t) {
  if (Array.isArray(t)) return Zt(t);
}
function Zt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mr(t, n, e, o, s, r) {
  return a(), u("svg", m({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), zr(n[0] || (n[0] = [g("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Nn.render = Mr;
var Nr = {
  root: "p-accordionheader",
  toggleicon: "p-accordionheader-toggle-icon"
}, qr = G.extend({
  name: "accordionheader",
  classes: Nr
}), Dr = {
  name: "BaseAccordionHeader",
  extends: Z,
  props: {
    as: {
      type: [String, Object],
      default: "BUTTON"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: qr,
  provide: function() {
    return {
      $pcAccordionHeader: this,
      $parentInstance: this
    };
  }
}, rn = {
  name: "AccordionHeader",
  extends: Dr,
  inheritAttrs: !1,
  inject: ["$pcAccordion", "$pcAccordionPanel"],
  methods: {
    onFocus: function() {
      this.$pcAccordion.selectOnFocus && this.changeActiveValue();
    },
    onClick: function() {
      !this.$pcAccordion.selectOnFocus && this.changeActiveValue();
    },
    onKeydown: function(n) {
      switch (n.code) {
        case "ArrowDown":
          this.onArrowDownKey(n);
          break;
        case "ArrowUp":
          this.onArrowUpKey(n);
          break;
        case "Home":
          this.onHomeKey(n);
          break;
        case "End":
          this.onEndKey(n);
          break;
        case "Enter":
        case "NumpadEnter":
        case "Space":
          this.onEnterKey(n);
          break;
      }
    },
    onArrowDownKey: function(n) {
      var e = this.findNextPanel(this.findPanel(n.currentTarget));
      e ? this.changeFocusedPanel(n, e) : this.onHomeKey(n), n.preventDefault();
    },
    onArrowUpKey: function(n) {
      var e = this.findPrevPanel(this.findPanel(n.currentTarget));
      e ? this.changeFocusedPanel(n, e) : this.onEndKey(n), n.preventDefault();
    },
    onHomeKey: function(n) {
      var e = this.findFirstPanel();
      this.changeFocusedPanel(n, e), n.preventDefault();
    },
    onEndKey: function(n) {
      var e = this.findLastPanel();
      this.changeFocusedPanel(n, e), n.preventDefault();
    },
    onEnterKey: function(n) {
      this.changeActiveValue(), n.preventDefault();
    },
    findPanel: function(n) {
      return n?.closest('[data-pc-name="accordionpanel"]');
    },
    findHeader: function(n) {
      return Jn(n, '[data-pc-name="accordionheader"]');
    },
    findNextPanel: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.nextElementSibling;
      return o ? cn(o, "data-p-disabled") ? this.findNextPanel(o) : this.findHeader(o) : null;
    },
    findPrevPanel: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.previousElementSibling;
      return o ? cn(o, "data-p-disabled") ? this.findPrevPanel(o) : this.findHeader(o) : null;
    },
    findFirstPanel: function() {
      return this.findNextPanel(this.$pcAccordion.$el.firstElementChild, !0);
    },
    findLastPanel: function() {
      return this.findPrevPanel(this.$pcAccordion.$el.lastElementChild, !0);
    },
    changeActiveValue: function() {
      this.$pcAccordion.updateValue(this.$pcAccordionPanel.value);
    },
    changeFocusedPanel: function(n, e) {
      Vn(this.findHeader(e));
    }
  },
  computed: {
    id: function() {
      return "".concat(this.$pcAccordion.$id, "_accordionheader_").concat(this.$pcAccordionPanel.value);
    },
    ariaControls: function() {
      return "".concat(this.$pcAccordion.$id, "_accordioncontent_").concat(this.$pcAccordionPanel.value);
    },
    attrs: function() {
      return m(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    asAttrs: function() {
      return this.as === "BUTTON" ? {
        type: "button",
        disabled: this.$pcAccordionPanel.disabled
      } : void 0;
    },
    a11yAttrs: function() {
      return {
        id: this.id,
        tabindex: this.$pcAccordion.tabindex,
        "aria-expanded": this.$pcAccordionPanel.active,
        "aria-controls": this.ariaControls,
        "data-pc-name": "accordionheader",
        "data-p-disabled": this.$pcAccordionPanel.disabled,
        "data-p-active": this.$pcAccordionPanel.active,
        onFocus: this.onFocus,
        onKeydown: this.onKeydown
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.$pcAccordionPanel.active
        }
      };
    },
    dataP: function() {
      return nt({
        active: this.$pcAccordionPanel.active
      });
    }
  },
  components: {
    ChevronUpIcon: en,
    ChevronDownIcon: Nn
  },
  directives: {
    ripple: Xt
  }
};
function Ur(t, n, e, o, s, r) {
  var i = tn("ripple");
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : It((a(), h(M(t.as), m({
    key: 0,
    "data-p": r.dataP,
    class: t.cx("root"),
    onClick: r.onClick
  }, r.attrs), {
    default: I(function() {
      return [_(t.$slots, "default", {
        active: r.$pcAccordionPanel.active
      }), _(t.$slots, "toggleicon", {
        active: r.$pcAccordionPanel.active,
        class: D(t.cx("toggleicon"))
      }, function() {
        return [r.$pcAccordionPanel.active ? (a(), h(M(r.$pcAccordion.$slots.collapseicon ? r.$pcAccordion.$slots.collapseicon : r.$pcAccordion.collapseIcon ? "span" : "ChevronUpIcon"), m({
          key: 0,
          class: [r.$pcAccordion.collapseIcon, t.cx("toggleicon")],
          "aria-hidden": "true"
        }, t.ptm("toggleicon", r.ptParams)), null, 16, ["class"])) : (a(), h(M(r.$pcAccordion.$slots.expandicon ? r.$pcAccordion.$slots.expandicon : r.$pcAccordion.expandIcon ? "span" : "ChevronDownIcon"), m({
          key: 1,
          class: [r.$pcAccordion.expandIcon, t.cx("toggleicon")],
          "aria-hidden": "true"
        }, t.ptm("toggleicon", r.ptParams)), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["data-p", "class", "onClick"])), [[i]]);
}
rn.render = Ur;
var Fr = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-accordionpanel", {
      "p-accordionpanel-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, Hr = G.extend({
  name: "accordionpanel",
  classes: Fr
}), Kr = {
  name: "BaseAccordionPanel",
  extends: Z,
  props: {
    value: {
      type: [String, Number],
      default: void 0
    },
    disabled: {
      type: Boolean,
      default: !1
    },
    as: {
      type: [String, Object],
      default: "DIV"
    },
    asChild: {
      type: Boolean,
      default: !1
    }
  },
  style: Hr,
  provide: function() {
    return {
      $pcAccordionPanel: this,
      $parentInstance: this
    };
  }
}, an = {
  name: "AccordionPanel",
  extends: Kr,
  inheritAttrs: !1,
  inject: ["$pcAccordion"],
  computed: {
    active: function() {
      return this.$pcAccordion.isItemActive(this.value);
    },
    attrs: function() {
      return m(this.a11yAttrs, this.ptmi("root", this.ptParams));
    },
    a11yAttrs: function() {
      return {
        "data-pc-name": "accordionpanel",
        "data-p-disabled": this.disabled,
        "data-p-active": this.active
      };
    },
    ptParams: function() {
      return {
        context: {
          active: this.active
        }
      };
    }
  }
};
function Rr(t, n, e, o, s, r) {
  return t.asChild ? _(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs
  }) : (a(), h(M(t.as), m({
    key: 0,
    class: t.cx("root")
  }, r.attrs), {
    default: I(function() {
      return [_(t.$slots, "default")];
    }),
    _: 3
  }, 16, ["class"]));
}
an.render = Rr;
var Wr = `
    .p-accordionpanel {
        display: flex;
        flex-direction: column;
        border-style: solid;
        border-width: dt('accordion.panel.border.width');
        border-color: dt('accordion.panel.border.color');
    }

    .p-accordionheader {
        all: unset;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: dt('accordion.header.padding');
        color: dt('accordion.header.color');
        background: dt('accordion.header.background');
        border-style: solid;
        border-width: dt('accordion.header.border.width');
        border-color: dt('accordion.header.border.color');
        font-weight: dt('accordion.header.font.weight');
        border-radius: dt('accordion.header.border.radius');
        transition:
            background dt('accordion.transition.duration'),
            color dt('accordion.transition.duration'),
            outline-color dt('accordion.transition.duration'),
            box-shadow dt('accordion.transition.duration');
        outline-color: transparent;
    }

    .p-accordionpanel:first-child > .p-accordionheader {
        border-width: dt('accordion.header.first.border.width');
        border-start-start-radius: dt('accordion.header.first.top.border.radius');
        border-start-end-radius: dt('accordion.header.first.top.border.radius');
    }

    .p-accordionpanel:last-child > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.bottom.border.radius');
    }

    .p-accordionpanel:last-child.p-accordionpanel-active > .p-accordionheader {
        border-end-start-radius: dt('accordion.header.last.active.bottom.border.radius');
        border-end-end-radius: dt('accordion.header.last.active.bottom.border.radius');
    }

    .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.color');
    }

    .p-accordionpanel:not(.p-disabled) .p-accordionheader:focus-visible {
        box-shadow: dt('accordion.header.focus.ring.shadow');
        outline: dt('accordion.header.focus.ring.width') dt('accordion.header.focus.ring.style') dt('accordion.header.focus.ring.color');
        outline-offset: dt('accordion.header.focus.ring.offset');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) > .p-accordionheader:hover {
        background: dt('accordion.header.hover.background');
        color: dt('accordion.header.hover.color');
    }

    .p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader {
        background: dt('accordion.header.active.background');
        color: dt('accordion.header.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover {
        background: dt('accordion.header.active.hover.background');
        color: dt('accordion.header.active.hover.color');
    }

    .p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader:hover .p-accordionheader-toggle-icon {
        color: dt('accordion.header.toggle.icon.active.hover.color');
    }

    .p-accordioncontent {
        display: grid;
        grid-template-rows: 1fr;
    }

    .p-accordioncontent-wrapper {
        min-height: 0;
    }

    .p-accordioncontent-content {
        border-style: solid;
        border-width: dt('accordion.content.border.width');
        border-color: dt('accordion.content.border.color');
        background-color: dt('accordion.content.background');
        color: dt('accordion.content.color');
        padding: dt('accordion.content.padding');
    }
`, Vr = {
  root: "p-accordion p-component"
}, Jr = G.extend({
  name: "accordion",
  style: Wr,
  classes: Vr
}), Yr = {
  name: "BaseAccordion",
  extends: Z,
  props: {
    value: {
      type: [String, Number, Array],
      default: void 0
    },
    multiple: {
      type: Boolean,
      default: !1
    },
    lazy: {
      type: Boolean,
      default: !1
    },
    tabindex: {
      type: Number,
      default: 0
    },
    selectOnFocus: {
      type: Boolean,
      default: !1
    },
    expandIcon: {
      type: String,
      default: void 0
    },
    collapseIcon: {
      type: String,
      default: void 0
    },
    // @deprecated since v4.
    activeIndex: {
      type: [Number, Array],
      default: null
    }
  },
  style: Jr,
  provide: function() {
    return {
      $pcAccordion: this,
      $parentInstance: this
    };
  }
}, qn = {
  name: "Accordion",
  extends: Yr,
  inheritAttrs: !1,
  emits: ["update:value", "update:activeIndex", "tab-open", "tab-close", "tab-click"],
  data: function() {
    return {
      d_value: this.value
    };
  },
  watch: {
    value: function(n) {
      this.d_value = n;
    },
    activeIndex: {
      immediate: !0,
      handler: function(n) {
        this.hasAccordionTab && (this.d_value = this.multiple ? n?.map(String) : n?.toString());
      }
    }
  },
  methods: {
    isItemActive: function(n) {
      var e;
      return this.multiple ? (e = this.d_value) === null || e === void 0 ? void 0 : e.includes(n) : this.d_value === n;
    },
    updateValue: function(n) {
      var e, o = this.isItemActive(n);
      this.multiple ? o ? this.d_value = this.d_value.filter(function(s) {
        return s !== n;
      }) : this.d_value ? this.d_value.push(n) : this.d_value = [n] : this.d_value = o ? null : n, this.$emit("update:value", this.d_value), this.$emit("update:activeIndex", this.multiple ? (e = this.d_value) === null || e === void 0 ? void 0 : e.map(Number) : Number(this.d_value)), this.$emit(o ? "tab-close" : "tab-open", {
        originalEvent: void 0,
        index: Number(n)
      });
    },
    // @deprecated since v4. Use new structure instead.
    isAccordionTab: function(n) {
      return n.type.name === "AccordionTab";
    },
    getTabProp: function(n, e) {
      return n.props ? n.props[e] : void 0;
    },
    getKey: function(n, e) {
      return this.getTabProp(n, "header") || e;
    },
    getHeaderPT: function(n, e) {
      var o = this;
      return {
        root: m({
          onClick: function(r) {
            return o.onTabClick(r, e);
          }
        }, this.getTabProp(n, "headerProps"), this.getTabPT(n, "header", e)),
        toggleicon: m(this.getTabProp(n, "headeractionprops"), this.getTabPT(n, "headeraction", e))
      };
    },
    getContentPT: function(n, e) {
      return {
        root: m(this.getTabProp(n, "contentProps"), this.getTabPT(n, "toggleablecontent", e)),
        transition: this.getTabPT(n, "transition", e),
        content: this.getTabPT(n, "content", e)
      };
    },
    getTabPT: function(n, e, o) {
      var s = this.tabs.length, r = {
        props: n.props || {},
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: o,
          count: s,
          first: o === 0,
          last: o === s - 1,
          active: this.isItemActive("".concat(o))
        }
      };
      return m(this.ptm("accordiontab.".concat(e), r), this.ptmo(this.getTabProp(n, "pt"), e, r));
    },
    onTabClick: function(n, e) {
      this.$emit("tab-click", {
        originalEvent: n,
        index: e
      });
    }
  },
  computed: {
    // @deprecated since v4.
    tabs: function() {
      var n = this;
      return this.$slots.default().reduce(function(e, o) {
        return n.isAccordionTab(o) ? e.push(o) : o.children && o.children instanceof Array && o.children.forEach(function(s) {
          n.isAccordionTab(s) && e.push(s);
        }), e;
      }, []);
    },
    hasAccordionTab: function() {
      return this.tabs.length;
    }
  },
  components: {
    AccordionPanel: an,
    AccordionHeader: rn,
    AccordionContent: on,
    ChevronUpIcon: en,
    ChevronRightIcon: Mn
  }
};
function Gr(t, n, e, o, s, r) {
  var i = bt("AccordionHeader"), l = bt("AccordionContent"), p = bt("AccordionPanel");
  return a(), u("div", m({
    class: t.cx("root")
  }, t.ptmi("root")), [r.hasAccordionTab ? (a(!0), u(S, {
    key: 0
  }, E(r.tabs, function(c, k) {
    return a(), h(p, {
      key: r.getKey(c, k),
      value: "".concat(k),
      pt: {
        root: r.getTabPT(c, "root", k)
      },
      disabled: r.getTabProp(c, "disabled")
    }, {
      default: I(function() {
        return [T(i, {
          class: D(r.getTabProp(c, "headerClass")),
          pt: r.getHeaderPT(c, k)
        }, {
          toggleicon: I(function(x) {
            return [x.active ? (a(), h(M(t.$slots.collapseicon ? t.$slots.collapseicon : t.collapseIcon ? "span" : "ChevronDownIcon"), m({
              key: 0,
              class: [t.collapseIcon, x.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(c, "headericon", k)), null, 16, ["class"])) : (a(), h(M(t.$slots.expandicon ? t.$slots.expandicon : t.expandIcon ? "span" : "ChevronUpIcon"), m({
              key: 1,
              class: [t.expandIcon, x.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(c, "headericon", k)), null, 16, ["class"]))];
          }),
          default: I(function() {
            return [c.children && c.children.headericon ? (a(), h(M(c.children.headericon), {
              key: 0,
              isTabActive: r.isItemActive("".concat(k)),
              active: r.isItemActive("".concat(k)),
              index: k
            }, null, 8, ["isTabActive", "active", "index"])) : v("", !0), c.props && c.props.header ? (a(), u("span", m({
              key: 1,
              ref_for: !0
            }, r.getTabPT(c, "headertitle", k)), A(c.props.header), 17)) : v("", !0), c.children && c.children.header ? (a(), h(M(c.children.header), {
              key: 2
            })) : v("", !0)];
          }),
          _: 2
        }, 1032, ["class", "pt"]), T(l, {
          pt: r.getContentPT(c, k)
        }, {
          default: I(function() {
            return [(a(), h(M(c)))];
          }),
          _: 2
        }, 1032, ["pt"])];
      }),
      _: 2
    }, 1032, ["value", "pt", "disabled"]);
  }), 128)) : _(t.$slots, "default", {
    key: 1
  })], 16);
}
qn.render = Gr;
const kn = /* @__PURE__ */ V({
  __name: "Disclosure",
  props: /* @__PURE__ */ ne({
    label: {}
  }, {
    open: { type: Boolean, default: !1 },
    openModifiers: {}
  }),
  emits: ["update:open"],
  setup(t) {
    const n = In(t, "open");
    return (e, o) => (a(), h(d(qn), {
      class: "kx-disclosure",
      value: n.value ? "content" : void 0,
      "onUpdate:value": o[0] || (o[0] = (s) => n.value = s === "content")
    }, {
      default: I(() => [
        T(d(an), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: I(() => [
            T(d(rn), { class: "kx-disclosure-toggle" }, {
              default: I(() => [
                U(A(t.label), 1)
              ]),
              _: 1
            }),
            T(d(on), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: I(() => [
                _(e.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["value"]));
  }
}), Dn = 3 * 86400;
function Qt(t, n) {
  const e = Math.max(0, Math.floor(n - t)), o = e < 3600 ? "live" : e < Dn ? "recent" : "dormant";
  return { seconds: e, label: xt(t, n), tier: o };
}
const Zr = /* @__PURE__ */ new Set([
  "done",
  "closed",
  "completed",
  "resolved",
  "retired",
  "canceled",
  "cancelled",
  "folded",
  "failed",
  "abandoned",
  "inconclusive",
  "rejected",
  "superseded"
]);
function Mt(t) {
  return Zr.has(String(t || "").toLowerCase());
}
function Qr(t) {
  const n = new Set(t.map((o) => o.id)), e = /* @__PURE__ */ new Map();
  for (const o of t) {
    const s = o.parent_task_id && o.parent_task_id !== o.id && n.has(o.parent_task_id) ? o.parent_task_id : "", r = e.get(s) || [];
    r.push(o), e.set(s, r);
  }
  return e;
}
const wn = /* @__PURE__ */ new WeakMap();
function Xr(t) {
  const n = wn.get(t);
  if (n) return n;
  const e = Qr(t), o = { children: e, activity: na(t, e) };
  return wn.set(t, o), o;
}
function ta(t, n, e) {
  const o = [], s = [...n.get(t.id) || []];
  for (; s.length; ) {
    const r = s.shift();
    e.has(r.id) || (e.add(r.id), o.push(r), s.push(...n.get(r.id) || []));
  }
  return o;
}
function na(t, n) {
  const e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), s = [], r = (i) => {
    for (s.push({ task: i, opened: !1 }); s.length; ) {
      const l = s.pop(), p = l.task;
      if (l.opened) {
        let c = p.updated_at;
        for (const k of n.get(p.id) || [])
          c = Math.max(c, e.get(k.id) ?? k.updated_at);
        e.set(p.id, c);
        continue;
      }
      if (!o.has(p.id)) {
        o.add(p.id), s.push({ task: p, opened: !0 });
        for (const c of n.get(p.id) || []) s.push({ task: c, opened: !1 });
      }
    }
  };
  for (const i of n.get("") || []) r(i);
  for (const i of t) o.has(i.id) || r(i);
  return e;
}
function ea(t, n) {
  const { children: e, activity: o } = Xr(t), s = new Map(t.map((l) => [l.id, l])), r = (l) => Qt(o.get(l.id) ?? l.updated_at, n).tier === "dormant", i = [];
  for (const l of t) {
    if (!r(l)) continue;
    const p = l.parent_task_id && l.parent_task_id !== l.id ? s.get(l.parent_task_id) : void 0;
    if (p && r(p)) continue;
    const c = ta(l, e, /* @__PURE__ */ new Set([l.id])), k = o.get(l.id) ?? l.updated_at, x = {
      root: l,
      members: c,
      lastActivityAt: k,
      age: Qt(k, n),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const j of [l, ...c]) {
      const w = String(j.status || "").toLowerCase();
      Mt(w) ? x.doneCount += 1 : w === "blocked" ? x.blockedCount += 1 : x.openCount += 1;
    }
    i.push(x);
  }
  return i.sort((l, p) => l.lastActivityAt - p.lastActivityAt || l.root.title.localeCompare(p.root.title));
}
function oa(t, n) {
  const e = new Map(t.map((r) => [r.id, r])), o = (r) => {
    let i = r;
    const l = /* @__PURE__ */ new Set();
    for (; i.parent_task_id && e.has(i.parent_task_id) && !l.has(i.id); )
      l.add(i.id), i = e.get(i.parent_task_id);
    return i;
  }, s = /* @__PURE__ */ new Map();
  for (const r of ea(t, n)) {
    if (!r.openCount && !r.blockedCount) continue;
    const i = o(r.root), l = s.get(i.id) || { root: i, tasks: 0, open: 0, lastActivityAt: 0 };
    l.tasks += r.members.length + 1, l.open += r.openCount + r.blockedCount, l.lastActivityAt = Math.max(l.lastActivityAt, r.lastActivityAt), s.set(i.id, l);
  }
  return [...s.values()].sort((r, i) => r.lastActivityAt - i.lastActivityAt);
}
const ra = {
  class: "jr-section",
  "aria-labelledby": "jr-changes"
}, aa = { class: "kx-settings-rail-group" }, sa = {
  class: "jr-section",
  "aria-labelledby": "jr-agents"
}, ia = { class: "jr-row-main" }, la = { class: "jr-row-line" }, da = { class: "jr-row-title" }, ca = { class: "jr-row-time" }, ua = { class: "jr-row-line" }, pa = { class: "jr-row-detail" }, ba = { class: "jr-row-main" }, ga = { class: "jr-row-line" }, fa = { class: "jr-row-title" }, ha = { class: "jr-row-time" }, va = { class: "jr-row-line" }, ma = { class: "jr-row-detail" }, ya = {
  key: 0,
  class: "jr-section",
  "aria-label": "Gone quiet"
}, ka = { class: "jr-note" }, $n = 40, wa = /* @__PURE__ */ V({
  __name: "Overview",
  props: {
    days: {},
    fresh: {},
    visited: { type: Boolean },
    moreHistory: { type: Boolean },
    agents: {},
    agentTasks: {},
    quiet: {},
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open"],
  setup(t, { emit: n }) {
    const e = t, o = n, s = O($n), r = P(() => e.days.reduce((w, $) => w + $.events.length, 0)), i = P(() => {
      let w = s.value;
      return e.days.flatMap(($) => {
        const b = w;
        w -= $.events.length;
        const y = $.events.filter((f, B) => B < b || f.fresh);
        return y.length ? [{ day: $.day, events: y }] : [];
      });
    }), l = P(() => i.value.reduce((w, $) => w + $.events.length, 0) < r.value), p = Math.round(Dn / 86400), c = P(() => [...e.agents.now, ...e.agents.today]), k = P(() => r.value ? e.visited ? e.fresh ? `${e.fresh >= r.value && e.moreHistory ? `More than ${e.fresh}` : String(e.fresh)} new since your last visit.` : "Nothing new since your last visit." : "The latest facts recorded in this journal." : "Facts agents and people record appear here.");
    function x(w, $) {
      return [gt(w || "").label, e.taskTitle($)].filter(Boolean).join(" · ");
    }
    function j(w) {
      const $ = e.agentTasks.get(w);
      $ && o("open", { kind: "task", id: $ });
    }
    return (w, $) => (a(), u(S, null, [
      g("section", ra, [
        T(Wt, {
          id: "jr-changes",
          title: "What changed",
          description: k.value
        }, null, 8, ["description"]),
        r.value ? v("", !0) : (a(), h(Lt, {
          key: 0,
          icon: "tabler:notes",
          title: "No facts yet",
          hint: "When an agent or a person records a fact in this journal, it shows up here."
        })),
        (a(!0), u(S, null, E(i.value, (b) => (a(), u("div", {
          key: b.day,
          class: "jr-day"
        }, [
          g("div", aa, A(b.day), 1),
          (a(!0), u(S, null, E(b.events, (y) => (a(), h(F, {
            key: y.id,
            title: y.title || y.body || "Untitled",
            detail: x(y.actor_id, y.task_id),
            at: y.ts,
            now: t.now,
            tag: d(yt)(y.event_type),
            severity: d(Et)(y.event_type),
            fresh: y.fresh,
            onOpen: (f) => w.$emit("open", { kind: "fact", id: y.id })
          }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "fresh", "onOpen"]))), 128))
        ]))), 128)),
        l.value ? (a(), h(d(nn), {
          key: 1,
          class: "jr-more",
          label: "Show older",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: $[0] || ($[0] = (b) => s.value += $n)
        })) : v("", !0)
      ]),
      g("section", sa, [
        T(Wt, {
          id: "jr-agents",
          title: "Agents",
          description: c.value.length ? `${t.agents.now.length} working in the last hour, ${t.agents.today.length} earlier today.` : "No agent has written here today."
        }, null, 8, ["description"]),
        (a(!0), u(S, null, E(c.value, (b) => (a(), h(M(t.agentTasks.get(b.id) ? "button" : "div"), {
          key: b.id,
          type: t.agentTasks.get(b.id) ? "button" : void 0,
          class: "jr-row jr-agent",
          onClick: (y) => j(b.id)
        }, {
          default: I(() => [
            T(d(Jt), {
              label: b.initials,
              shape: "circle",
              class: D(["jr-avatar", { working: b.working }])
            }, null, 8, ["label", "class"]),
            g("span", ia, [
              g("span", la, [
                g("span", da, A(b.label), 1),
                g("time", ca, A(d(xt)(b.lastActivityAt, t.now)), 1)
              ]),
              g("span", ua, [
                g("span", pa, A(b.headline || b.purpose), 1)
              ])
            ])
          ]),
          _: 2
        }, 1032, ["type", "onClick"]))), 128)),
        t.agents.older.length ? (a(), h(kn, {
          key: 0,
          label: `Earlier (${t.agents.older.length})`
        }, {
          default: I(() => [
            (a(!0), u(S, null, E(t.agents.older, (b) => (a(), h(M(t.agentTasks.get(b.id) ? "button" : "div"), {
              key: b.id,
              type: t.agentTasks.get(b.id) ? "button" : void 0,
              class: "jr-row jr-agent",
              onClick: (y) => j(b.id)
            }, {
              default: I(() => [
                T(d(Jt), {
                  label: b.initials,
                  shape: "circle",
                  class: "jr-avatar"
                }, null, 8, ["label"]),
                g("span", ba, [
                  g("span", ga, [
                    g("span", fa, A(b.label), 1),
                    g("time", ha, A(d(xt)(b.lastActivityAt, t.now)), 1)
                  ]),
                  g("span", va, [
                    g("span", ma, A(b.purpose), 1)
                  ])
                ])
              ]),
              _: 2
            }, 1032, ["type", "onClick"]))), 128))
          ]),
          _: 1
        }, 8, ["label"])) : v("", !0)
      ]),
      t.quiet.length ? (a(), u("section", ya, [
        T(kn, {
          label: `Gone quiet (${t.quiet.length})`
        }, {
          default: I(() => [
            g("p", ka, "Open work nothing has touched for " + A(d(p)) + " days or more. Ask an agent to settle it after reading its history.", 1),
            (a(!0), u(S, null, E(t.quiet, (b) => (a(), h(F, {
              key: b.root.id,
              title: b.root.title,
              detail: `${b.open} open of ${b.tasks} tasks`,
              at: b.lastActivityAt,
              now: t.now,
              onOpen: (y) => w.$emit("open", { kind: "task", id: b.root.id })
            }, null, 8, ["title", "detail", "at", "now", "onOpen"]))), 128))
          ]),
          _: 1
        }, 8, ["label"])
      ])) : v("", !0)
    ], 64));
  }
}), $a = { class: "kx-search jr-search" }, An = /* @__PURE__ */ V({
  __name: "SearchBox",
  props: {
    modelValue: { required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t, { expose: n }) {
    const e = In(t, "modelValue"), o = O(null);
    return n({ focus: () => o.value?.focus() }), (s, r) => (a(), u("div", $a, [
      T(d(Y), {
        icon: "tabler:search",
        class: "kx-search-ico",
        "aria-hidden": "true"
      }),
      It(g("input", {
        ref_key: "input",
        ref: o,
        "onUpdate:modelValue": r[0] || (r[0] = (i) => e.value = i),
        class: "kx-search-input",
        type: "search",
        placeholder: "Find a task or fact",
        "aria-label": "Find a task or fact",
        onKeydown: r[1] || (r[1] = ee((i) => e.value = "", ["esc"]))
      }, null, 544), [
        [oe, e.value]
      ]),
      e.value ? (a(), u("button", {
        key: 0,
        type: "button",
        class: "kx-search-clear",
        "aria-label": "Clear search",
        onClick: r[2] || (r[2] = (i) => e.value = "")
      }, [
        T(d(Y), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : v("", !0)
    ]));
  }
}), Aa = { class: "jr-list" }, Ca = {
  key: 0,
  class: "jr-list-empty"
}, Pa = {
  key: 1,
  class: "jr-list-empty"
}, xa = {
  key: 2,
  class: "jr-list-empty"
}, Sa = {
  key: 3,
  class: "jr-list-empty"
}, Ta = { class: "kx-settings-rail-group" }, Ia = {
  key: 0,
  class: "kx-count"
}, _a = {
  key: 0,
  class: "jr-list-empty"
}, ja = { class: "kx-settings-rail-group" }, za = { class: "kx-count" }, Cn = /* @__PURE__ */ V({
  __name: "WorkList",
  props: {
    needs: {},
    working: {},
    query: {},
    matchedTasks: {},
    matchedFacts: {},
    searching: { type: Boolean },
    searchError: {},
    selected: {},
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open"],
  setup(t) {
    const n = t, e = {
      blocked: { label: "Blocked", severity: "danger" },
      blocker: { label: "Blocker", severity: "danger" },
      question: { label: "Question", severity: "warn" },
      stalled: { label: "Stopped", severity: "warn" }
    };
    function o(s) {
      return n.selected?.kind === s.kind && n.selected.id === s.id;
    }
    return (s, r) => (a(), u("div", Aa, [
      t.query.trim() ? (a(), u(S, { key: 0 }, [
        r[0] || (r[0] = g("div", { class: "kx-settings-rail-group" }, "Tasks", -1)),
        t.matchedTasks.length ? v("", !0) : (a(), u("p", Ca, "No task matches.")),
        (a(!0), u(S, null, E(t.matchedTasks, (i) => (a(), h(F, {
          key: `t:${i.id}`,
          title: i.title,
          detail: t.taskTitle(i.parent_task_id),
          at: i.updated_at,
          now: t.now,
          tag: d(at)(i.status),
          severity: d(Vt)(i.status),
          active: o({ kind: "task", id: i.id }),
          onOpen: (l) => s.$emit("open", { kind: "task", id: i.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        r[1] || (r[1] = g("div", { class: "kx-settings-rail-group" }, "Facts", -1)),
        t.searching ? (a(), u("p", Pa, "Searching…")) : t.searchError ? (a(), u("p", xa, A(t.searchError), 1)) : t.matchedFacts.length ? v("", !0) : (a(), u("p", Sa, "No fact matches.")),
        (a(!0), u(S, null, E(t.matchedFacts, (i) => (a(), h(F, {
          key: `f:${i.id}`,
          title: i.title || i.body || "Untitled",
          detail: t.taskTitle(i.task_id),
          at: i.ts,
          now: t.now,
          tag: d(yt)(i.event_type),
          severity: d(Et)(i.event_type),
          active: o({ kind: "fact", id: i.id }),
          onOpen: (l) => s.$emit("open", { kind: "fact", id: i.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128))
      ], 64)) : (a(), u(S, { key: 1 }, [
        g("div", Ta, [
          r[2] || (r[2] = U("Needs you ", -1)),
          t.needs.length ? (a(), u("span", Ia, A(t.needs.length), 1)) : v("", !0)
        ]),
        t.needs.length ? v("", !0) : (a(), u("p", _a, "Nothing needs you right now.")),
        (a(!0), u(S, null, E(t.needs, (i) => (a(), h(F, {
          key: `${i.ref.kind}:${i.ref.id}`,
          title: i.title,
          detail: i.detail,
          at: i.at,
          now: t.now,
          tag: e[i.reason].label,
          severity: e[i.reason].severity,
          active: o(i.ref),
          onOpen: (l) => s.$emit("open", i.ref)
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        t.working.length ? (a(), u(S, { key: 1 }, [
          g("div", ja, [
            r[3] || (r[3] = U("In progress ", -1)),
            g("span", za, A(t.working.length), 1)
          ]),
          (a(!0), u(S, null, E(t.working, (i) => (a(), h(F, {
            key: `${i.ref.kind}:${i.ref.id}`,
            title: i.title,
            detail: i.detail,
            at: i.at,
            now: t.now,
            active: o(i.ref),
            onOpen: (l) => s.$emit("open", i.ref)
          }, null, 8, ["title", "detail", "at", "now", "active", "onOpen"]))), 128))
        ], 64)) : v("", !0)
      ], 64))
    ]));
  }
});
function Ft(t) {
  const n = new URLSearchParams();
  for (const [o, s] of Object.entries(t)) s !== void 0 && s !== "" && n.set(o, String(s));
  const e = n.toString();
  return e ? `?${e}` : "";
}
function mt(t, n) {
  const e = t, o = e?.response?.data?.error ?? e?.data?.error;
  return typeof o == "string" && o ? o : typeof e?.message == "string" && e.message && !/status code|request failed/i.test(e.message) ? e.message : n;
}
const Oa = 200;
class Ba {
  constructor(n) {
    this.journalId = n;
  }
  base() {
    return `/api/v1/workspace/journals/${this.journalId}`;
  }
  /** Counts, the newest facts, agent positions, open spans and live editing sessions. */
  async state() {
    try {
      const n = Ft({ limit: Oa, cursor_limit: 200, span_limit: 200, task_limit: 1, graph_limit: 1, artifact_limit: 1 }), { data: e } = await pt.get(`${this.base()}${n}`);
      if (!e.success) throw new Error(e.error || "failed to read the journal");
      return e.journal;
    } catch (n) {
      throw new Error(mt(n, "Couldn’t read this journal."));
    }
  }
  /**
   * The whole task tree, flattened. The state read carries one page of tasks,
   * so counts and searches are taken over the tree read instead.
   */
  async tasks(n = 5e3, e = 6) {
    try {
      const { data: o } = await pt.get(`${this.base()}/tree${Ft({ depth: e, limit: n })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task tree");
      const s = [], r = (i, l) => {
        for (const p of i || []) {
          const { children: c, ...k } = p;
          s.push({ ...k, parent_task_id: k.parent_task_id || l }), c?.length && r(c, k.id);
        }
      };
      return r(o.tree?.children || []), { tasks: s, bounded: s.length >= n };
    } catch (o) {
      throw new Error(mt(o, "Couldn’t read this journal’s work."));
    }
  }
  /** One task with its parents, children, dependencies and the facts recorded on it. */
  async branch(n, e = 100) {
    try {
      const { data: o } = await pt.get(`${this.base()}/branch${Ft({ task_id: n, fact_limit: e })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task");
      return o.branch;
    } catch (o) {
      throw new Error(mt(o, "Couldn’t open this task."));
    }
  }
  async event(n) {
    try {
      const { data: e } = await pt.get(`${this.base()}/events/${encodeURIComponent(n)}`);
      if (!e.success) throw new Error(e.error || "failed to read the fact");
      return e.event;
    } catch (e) {
      throw new Error(mt(e, "Couldn’t open this fact."));
    }
  }
  /** Facts across the whole journal that match by text or, when available, by meaning. */
  async recall(n, e = 30) {
    try {
      const { data: o } = await pt.post(`${this.base()}/search`, { query: n, limit: e });
      if (!o.success) throw new Error(o.error || "search failed");
      return o.events || [];
    } catch (o) {
      throw new Error(mt(o, "Couldn’t search this journal."));
    }
  }
  async health() {
    try {
      const { data: n } = await pt.get(`${this.base()}/health`);
      return n.success ? n.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
const La = { blocker: "blocker", question: "question" }, Pn = { blocked: 0, blocker: 1, question: 2, stalled: 3 };
function Ea(t) {
  return t.event_type.replace(/^.*:/, "").toLowerCase();
}
function Ma(t, n) {
  return String(t.effective_state || t.lifecycle || "active").toLowerCase() === "active" && !t.superseded_by_event_id && !n.has(t.id);
}
function Na(t, n, e, o) {
  const s = new Map(t.map((c) => [c.id, c])), r = new Set(n.map((c) => c.supersedes_event_id || "").filter(Boolean)), i = [], l = /* @__PURE__ */ new Set(), p = (c) => {
    const k = c?.parent_task_id ? s.get(c.parent_task_id) : void 0;
    return k ? k.title : "";
  };
  for (const c of t)
    c.status === "blocked" && (l.add(c.id), i.push({ ref: { kind: "task", id: c.id }, reason: "blocked", title: c.title, detail: p(c), at: c.updated_at }));
  for (const c of n) {
    const k = La[Ea(c)];
    if (!k || !Ma(c, r)) continue;
    const x = c.task_id ? s.get(c.task_id) : void 0;
    x && Mt(x.status) || i.push({
      ref: { kind: "fact", id: c.id },
      reason: k,
      title: c.title || c.body || "Untitled",
      detail: x?.title || gt(c.actor_id || "").label,
      at: c.ts
    });
  }
  for (const c of e.resumable) {
    if (l.has(c.task_id)) continue;
    const k = c.task_updated_at || s.get(c.task_id)?.updated_at || 0;
    Qt(k, o).tier !== "live" && (l.add(c.task_id), i.push({ ref: { kind: "task", id: c.task_id }, reason: "stalled", title: c.task_title || s.get(c.task_id)?.title || "Untitled task", detail: p(s.get(c.task_id)), at: k }));
  }
  return i.sort((c, k) => Pn[c.reason] - Pn[k.reason] || k.at - c.at);
}
function qa(t, n) {
  const e = new Set(n.filter((s) => s.ref.kind === "task").map((s) => s.ref.id)), o = /* @__PURE__ */ new Map();
  for (const s of t.leases)
    e.has(s.task_id) || o.has(s.task_id) || o.set(s.task_id, {
      ref: { kind: "task", id: s.task_id },
      title: s.task_title || "Untitled task",
      detail: `${gt(s.agent_id).label} · ${s.capability === "WRITE" ? "editing" : "planning"}`,
      at: s.issued_at
    });
  return [...o.values()].sort((s, r) => r.at - s.at);
}
function Da(t, n, e) {
  const o = [];
  for (const s of [...t].sort((r, i) => i.ts - r.ts || i.seq - r.seq)) {
    const r = wo(s.ts, e);
    let i = o[o.length - 1];
    (!i || i.day !== r) && (i = { day: r, events: [] }, o.push(i)), i.events.push({ ...s, fresh: n !== null && s.seq > n });
  }
  return o;
}
function Ua(t, n) {
  return n === null ? 0 : t.filter((e) => e.seq > n).length;
}
function Fa(t, n, e = 20) {
  const o = n.toLowerCase().split(/\s+/).filter(Boolean);
  return o.length ? t.filter((s) => {
    const r = `${s.title} ${s.description || ""}`.toLowerCase();
    return o.every((i) => r.includes(i));
  }).sort((s, r) => Number(Mt(s.status)) - Number(Mt(r.status)) || r.updated_at - s.updated_at).slice(0, e) : [];
}
const xn = {
  now: 0,
  leases: [],
  resumable: [],
  counts: { active: 0, write: 0, planning: 0, resumable: 0 },
  limit: 100,
  has_more: !1
};
function Un(t) {
  return `chestor.journal.seen:${t}`;
}
function Ha(t) {
  try {
    const n = Number(localStorage.getItem(Un(t)));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
function Ka(t, n) {
  try {
    n > 0 && localStorage.setItem(Un(t), String(n));
  } catch {
  }
}
function Ht(t, n) {
  return t instanceof Error ? t.message : n;
}
function Ra(t) {
  const n = P(() => new Ba(t.value)), e = rt([]), o = O(!1), s = rt([]), r = O(!1), i = rt(xn), l = rt([]), p = rt([]), c = O({ status: "unknown" }), k = O(!0), x = O(!1), j = O(""), w = O(null), $ = O(Math.floor(Date.now() / 1e3)), b = O(""), y = rt([]), f = O(!1), B = O(""), H = O(null), K = O([]), L = rt(null), et = O(!1), Q = O("");
  let it, lt, X, dt = 0, ot = 0;
  const _t = [], jt = P(() => Na(e.value, s.value, i.value, $.value)), zt = P(() => qa(i.value, jt.value)), ct = P(() => Da(s.value, w.value, $.value)), Nt = P(() => Ua(s.value, w.value)), ft = P(() => No(l.value, p.value, $.value)), ht = P(() => qo(ft.value)), qt = P(() => {
    const C = new Map(s.value.map((z) => [z.id, z.task_id]));
    return new Map(ft.value.map((z) => [z.id, Do(z, C)]));
  }), ut = P(() => oa(e.value, $.value)), Ot = P(() => Fa(e.value, b.value)), R = P(() => new Map(e.value.map((C) => [C.id, C])));
  async function N() {
    const [C, z, J] = await Promise.all([n.value.state(), n.value.tasks(), n.value.health()]);
    e.value = z.tasks, o.value = z.bounded, s.value = C.events || [], r.value = C.event_page?.has_more === !0, i.value = C.work_control || xn, l.value = C.cursors?.items || [], p.value = C.spans?.items || [], c.value = J, x.value || (w.value = Ha(t.value)), Ka(t.value, C.stats?.last_seq || 0), x.value = !0;
  }
  async function tt() {
    if (!t.value) {
      j.value = "Journal entry id is required.", k.value = !1;
      return;
    }
    k.value = !0;
    try {
      await N(), j.value = "";
    } catch (C) {
      j.value = Ht(C, "Couldn’t read this journal.");
    } finally {
      k.value = !1;
    }
  }
  async function Dt() {
    if (!(!t.value || k.value))
      try {
        await N(), H.value?.kind === "task" && await Ut(H.value, !0);
      } catch {
      }
  }
  let sn = [];
  function Fn(C) {
    return sn.find((z) => z.id === C);
  }
  function ln() {
    sn = [...s.value, ...y.value, ...L.value?.kind === "task" ? L.value.branch.facts : []];
  }
  async function Ut(C, z = !1) {
    const J = ++ot;
    z || (et.value = !0, Q.value = "");
    try {
      let vt;
      if (C.kind === "task" ? vt = { kind: "task", branch: await n.value.branch(C.id) } : vt = { kind: "fact", event: Fn(C.id) || await n.value.event(C.id) }, J !== ot) return;
      L.value = vt, Q.value = "";
    } catch (vt) {
      J === ot && !z && (Q.value = Ht(vt, "Couldn’t open this item."));
    } finally {
      J === ot && (et.value = !1);
    }
  }
  function Hn(C, z = !1) {
    K.value = z && H.value ? [...K.value, H.value] : [], ln(), H.value = C, L.value = null, Ut(C);
  }
  function Kn() {
    const C = K.value[K.value.length - 1];
    C && (K.value = K.value.slice(0, -1), ln(), H.value = C, L.value = null, Ut(C));
  }
  function dn() {
    ot++, K.value = [], H.value = null, L.value = null, Q.value = "", et.value = !1;
  }
  async function Rn() {
    const C = b.value.trim(), z = ++dt;
    if (!C) {
      y.value = [], f.value = !1, B.value = "";
      return;
    }
    f.value = !0;
    try {
      const J = await n.value.recall(C);
      if (z !== dt) return;
      y.value = J, B.value = "";
    } catch (J) {
      z === dt && (y.value = [], B.value = Ht(J, "Search failed."));
    } finally {
      z === dt && (f.value = !1);
    }
  }
  return un(b, () => {
    clearTimeout(it), it = setTimeout(Rn, 300);
  }), un(t, () => {
    x.value = !1, dn(), tt();
  }), _n(() => {
    _t.push(re(`kickside.thread.${t.value}.projection.chestor.journal:state`, () => {
      Dt();
    })), X = setInterval(Dt, 15e3), lt = setInterval(() => {
      $.value = Math.floor(Date.now() / 1e3);
    }, 3e4);
  }), jn(() => {
    clearTimeout(it), X && clearInterval(X), lt && clearInterval(lt);
    for (const C of _t) C();
  }), {
    tasks: e,
    tasksBounded: o,
    events: s,
    eventsHasMore: r,
    health: c,
    loading: k,
    loaded: x,
    error: j,
    clock: $,
    seenSeq: w,
    needs: jt,
    working: zt,
    days: ct,
    fresh: Nt,
    agents: ht,
    agentTasks: qt,
    quiet: ut,
    taskById: R,
    query: b,
    matchedTasks: Ot,
    matchedFacts: y,
    searching: f,
    searchError: B,
    selected: H,
    trail: K,
    detail: L,
    detailLoading: et,
    detailError: Q,
    load: tt,
    refresh: Dt,
    open: Hn,
    back: Kn,
    close: dn
  };
}
const Wa = {
  key: 0,
  class: "kx-loading kx-loading-centered"
}, Va = { class: "kx-loading-inner" }, Ja = {
  key: 2,
  class: "kx-shell jr-shell"
}, Ya = { class: "jr-rail-search" }, Ga = { class: "kx-main" }, Za = { class: "kx-main-scroll" }, Qa = /* @__PURE__ */ V({
  __name: "JournalApp",
  setup(t) {
    const n = Yn(), e = P(() => n.value?.entryId || ""), o = P(() => (n.value?.mode || "preview") === "preview"), s = Ra(e), {
      loading: r,
      loaded: i,
      error: l,
      health: p,
      clock: c,
      seenSeq: k,
      eventsHasMore: x,
      tasksBounded: j,
      needs: w,
      working: $,
      days: b,
      fresh: y,
      agents: f,
      agentTasks: B,
      quiet: H,
      taskById: K,
      query: L,
      matchedTasks: et,
      matchedFacts: Q,
      searching: it,
      searchError: lt,
      selected: X,
      trail: dt,
      detail: ot,
      detailLoading: _t,
      detailError: jt,
      load: zt,
      open: ct,
      back: Nt,
      close: ft
    } = s;
    Gn(zt);
    const ht = O(null), qt = P(() => p.value.status === "degraded");
    function ut(R) {
      return R && K.value.get(R)?.title || "";
    }
    function Ot(R) {
      const N = R.composedPath()[0];
      N && ["INPUT", "TEXTAREA"].includes(N.tagName) || (R.key === "/" ? (R.preventDefault(), ht.value?.focus()) : R.key === "Escape" && X.value && ft());
    }
    return _n(() => window.addEventListener("keydown", Ot)), jn(() => window.removeEventListener("keydown", Ot)), (R, N) => (a(), u("div", {
      class: D(["jr", { compact: o.value }])
    }, [
      !d(i) && d(r) ? (a(), u("div", Wa, [
        g("div", Va, [
          T(d(Y), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          N[3] || (N[3] = U("Opening the journal…", -1))
        ])
      ])) : d(i) ? (a(), u("div", Ja, [
        o.value ? v("", !0) : (a(), h(io, {
          key: 0,
          title: "Journal"
        }, {
          toolbar: I(() => [
            g("div", Ya, [
              T(An, {
                ref_key: "searchBox",
                ref: ht,
                modelValue: d(L),
                "onUpdate:modelValue": N[0] || (N[0] = (tt) => pn(L) ? L.value = tt : null)
              }, null, 8, ["modelValue"])
            ])
          ]),
          default: I(() => [
            T(Cn, {
              needs: d(w),
              working: d($),
              query: d(L),
              "matched-tasks": d(et),
              "matched-facts": d(Q),
              searching: d(it),
              "search-error": d(lt),
              selected: d(X),
              "task-title": ut,
              now: d(c),
              onOpen: d(ct)
            }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "selected", "now", "onOpen"])
          ]),
          _: 1
        })),
        g("main", Ga, [
          g("div", Za, [
            d(l) ? (a(), h(d(Bt), {
              key: 0,
              severity: "error",
              closable: !1
            }, {
              default: I(() => [
                U(A(d(l)), 1)
              ]),
              _: 1
            })) : v("", !0),
            qt.value ? (a(), h(d(Bt), {
              key: 1,
              severity: "warn",
              closable: !1
            }, {
              default: I(() => [
                U(" This journal is behind on processing new facts" + A(d(p).reasons?.length ? `: ${d(p).reasons.join(", ")}` : "") + ". What you see may be out of date. ", 1)
              ]),
              _: 1
            })) : v("", !0),
            d(j) ? (a(), h(d(Bt), {
              key: 2,
              severity: "secondary",
              closable: !1
            }, {
              default: I(() => [
                U(" This journal holds more tasks than the page reads at once; search and counts cover the first " + A(d(K).size.toLocaleString()) + ". ", 1)
              ]),
              _: 1
            })) : v("", !0),
            d(X) ? (a(), h(rr, {
              key: 3,
              detail: d(ot),
              loading: d(_t),
              error: d(jt),
              "can-back": d(dt).length > 0,
              "task-title": ut,
              now: d(c),
              onOpen: N[1] || (N[1] = (tt) => d(ct)(tt, !0)),
              onBack: d(Nt),
              onClose: d(ft)
            }, null, 8, ["detail", "loading", "error", "can-back", "now", "onBack", "onClose"])) : (a(), u(S, { key: 4 }, [
              o.value ? (a(), u(S, { key: 0 }, [
                T(An, {
                  ref_key: "searchBox",
                  ref: ht,
                  modelValue: d(L),
                  "onUpdate:modelValue": N[2] || (N[2] = (tt) => pn(L) ? L.value = tt : null)
                }, null, 8, ["modelValue"]),
                T(Cn, {
                  needs: d(w),
                  working: d($),
                  query: d(L),
                  "matched-tasks": d(et),
                  "matched-facts": d(Q),
                  searching: d(it),
                  "search-error": d(lt),
                  selected: d(X),
                  "task-title": ut,
                  now: d(c),
                  onOpen: d(ct)
                }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "selected", "now", "onOpen"])
              ], 64)) : v("", !0),
              !o.value || !d(L).trim() ? (a(), h(wa, {
                key: 1,
                days: d(b),
                fresh: d(y),
                visited: d(k) !== null,
                "more-history": d(x),
                agents: d(f),
                "agent-tasks": d(B),
                quiet: d(H),
                "task-title": ut,
                now: d(c),
                onOpen: d(ct)
              }, null, 8, ["days", "fresh", "visited", "more-history", "agents", "agent-tasks", "quiet", "now", "onOpen"])) : v("", !0)
            ], 64))
          ])
        ])
      ])) : (a(), h(Lt, {
        key: 1,
        icon: "tabler:alert-triangle",
        title: "Journal is unavailable",
        hint: d(l),
        cta: "Try again",
        "cta-icon": "tabler:refresh",
        onCta: d(zt)
      }, null, 8, ["hint", "onCta"]))
    ], 2));
  }
}), os = {
  rootComponent: Qa,
  plugins: [Zn]
};
export {
  os as mountConfig
};
//# sourceMappingURL=lazy-mount-C1c8GtFr.js.map
