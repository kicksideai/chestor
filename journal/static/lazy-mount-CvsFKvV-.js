import { s as It, B as Y, R as Qt, a as Z, f as nt, b as Sn, c as Wn, d as Vn, Q as dn, z as Jn, u as Gn, e as Yn, P as Zn } from "./wc-runtime-BqkbuCPp.js";
import { openBlock as s, createElementBlock as u, mergeProps as y, createElementVNode as b, resolveComponent as pt, resolveDirective as Xt, createBlock as m, Transition as Tn, withCtx as _, renderSlot as I, normalizeClass as D, resolveDynamicComponent as U, createCommentVNode as h, withDirectives as _t, createTextVNode as q, toDisplayString as w, defineComponent as V, createVNode as T, unref as l, createSlots as Qn, useId as Xn, computed as x, Fragment as S, renderList as B, vShow as te, useModel as In, mergeModels as ne, ref as O, withKeys as ee, vModelText as oe, shallowRef as rt, watch as cn, onMounted as _n, onBeforeUnmount as jn, isRef as un } from "vue";
import { Icon as G } from "@iconify/vue";
import { api as ut, on as re } from "@wippy-fe/proxy";
var zn = {
  name: "TimesIcon",
  extends: It
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
function ce(t, n, e, o, a, r) {
  return s(), u("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), ae(n[0] || (n[0] = [b("path", {
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
}, be = Y.extend({
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
function wt(t) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, wt(t);
}
function pn(t, n, e) {
  return (n = fe(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function fe(t) {
  var n = he(t, "string");
  return wt(n) == "symbol" ? n : n + "";
}
function he(t, n) {
  if (wt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (wt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ot = {
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
      return nt(pn(pn({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: Qt
  },
  components: {
    TimesIcon: zn
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
function bn(t, n) {
  var e = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    n && (o = o.filter(function(a) {
      return Object.getOwnPropertyDescriptor(t, a).enumerable;
    })), e.push.apply(e, o);
  }
  return e;
}
function gn(t) {
  for (var n = 1; n < arguments.length; n++) {
    var e = arguments[n] != null ? arguments[n] : {};
    n % 2 ? bn(Object(e), !0).forEach(function(o) {
      ve(t, o, e[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(e)) : bn(Object(e)).forEach(function(o) {
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
  return $t(n) == "symbol" ? n : n + "";
}
function ye(t, n) {
  if ($t(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var ke = ["data-p"], we = ["data-p"], $e = ["data-p"], Ae = ["aria-label", "data-p"], Ce = ["data-p"];
function Pe(t, n, e, o, a, r) {
  var i = pt("TimesIcon"), c = Xt("ripple");
  return s(), m(Tn, y({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: _(function() {
      return [a.visible ? (s(), u("div", y({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": r.dataP
      }, t.ptm("root")), [b("div", y({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? I(t.$slots, "container", {
        key: 0,
        closeCallback: r.close
      }) : (s(), u("div", y({
        key: 1,
        class: t.cx("content"),
        "data-p": r.dataP
      }, t.ptm("content")), [I(t.$slots, "icon", {
        class: D(t.cx("icon"))
      }, function() {
        return [(s(), m(U(t.icon ? "span" : null), y({
          class: [t.cx("icon"), t.icon],
          "data-p": r.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (s(), u("div", y({
        key: 0,
        class: t.cx("text"),
        "data-p": r.dataP
      }, t.ptm("text")), [I(t.$slots, "default")], 16, $e)) : h("", !0), t.closable ? _t((s(), u("button", y({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": r.closeAriaLabel,
        type: "button",
        onClick: n[0] || (n[0] = function(p) {
          return r.close(p);
        }),
        "data-p": r.dataP
      }, gn(gn({}, t.closeButtonProps), t.ptm("closeButton"))), [I(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (s(), u("i", y({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, Ce)) : (s(), m(i, y({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, Ae)), [[c]]) : h("", !0)], 16, we))], 16)], 16, ke)) : h("", !0)];
    }),
    _: 3
  }, 16);
}
Ot.render = Pe;
var On = {
  name: "SpinnerIcon",
  extends: It
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
    if (typeof t == "string") return Ht(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Ht(t, n) : void 0;
  }
}
function Ie(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function _e(t) {
  if (Array.isArray(t)) return Ht(t);
}
function Ht(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function je(t, n, e, o, a, r) {
  return s(), u("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), xe(n[0] || (n[0] = [b("path", {
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
}, Be = Y.extend({
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
function At(t) {
  "@babel/helpers - typeof";
  return At = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, At(t);
}
function fn(t, n, e) {
  return (n = Ee(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function Ee(t) {
  var n = Me(t, "string");
  return At(n) == "symbol" ? n : n + "";
}
function Me(t, n) {
  if (At(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (At(o) != "object") return o;
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
      return nt(fn(fn({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ne = ["data-p"];
function Ue(t, n, e, o, a, r) {
  return s(), u("span", y({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [I(t.$slots, "default", {}, function() {
    return [q(w(t.value), 1)];
  })], 16, Ne);
}
Bn.render = Ue;
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
function Ct(t) {
  "@babel/helpers - typeof";
  return Ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Ct(t);
}
function W(t, n, e) {
  return (n = qe(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function qe(t) {
  var n = Fe(t, "string");
  return Ct(n) == "symbol" ? n : n + "";
}
function Fe(t, n) {
  if (Ct(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (Ct(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Ke = {
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
}, He = Y.extend({
  name: "button",
  style: De,
  classes: Ke
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
  style: He,
  provide: function() {
    return {
      $pcButton: this,
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
function N(t, n, e) {
  return (n = We(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function We(t) {
  var n = Ve(t, "string");
  return Pt(n) == "symbol" ? n : n + "";
}
function Ve(t, n) {
  if (Pt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (Pt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var tn = {
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
      return y(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return nt(N(N(N(N(N(N(N(N(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return nt(N(N({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return nt(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: On,
    Badge: Bn
  },
  directives: {
    ripple: Qt
  }
}, Je = ["data-p"], Ge = ["data-p"];
function Ye(t, n, e, o, a, r) {
  var i = pt("SpinnerIcon"), c = pt("Badge"), p = Xt("ripple");
  return t.asChild ? I(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : _t((s(), m(U(t.as), y({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: _(function() {
      return [I(t.$slots, "default", {}, function() {
        return [t.loading ? I(t.$slots, "loadingicon", y({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (s(), u("span", y({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (s(), m(i, y({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : I(t.$slots, "icon", y({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (s(), u("span", y({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Je)) : h("", !0)];
        }), t.label ? (s(), u("span", y({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), w(t.label), 17, Ge)) : h("", !0), t.badge ? (s(), m(c, {
          key: 3,
          value: t.badge,
          class: D(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : h("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[p]]);
}
tn.render = Ye;
const Ze = { class: "kx-empty" }, Qe = { class: "kx-empty-ico" }, Xe = { class: "kx-empty-title" }, to = {
  key: 0,
  class: "kx-empty-sub"
}, Bt = /* @__PURE__ */ V({
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
    return (n, e) => (s(), u("div", Ze, [
      b("div", Qe, [
        T(l(G), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      b("div", Xe, w(t.title), 1),
      t.hint || n.$slots.hint ? (s(), u("p", to, [
        I(n.$slots, "hint", {}, () => [
          q(w(t.hint), 1)
        ])
      ])) : h("", !0),
      t.cta ? (s(), m(l(tn), {
        key: 1,
        label: t.cta,
        onClick: e[0] || (e[0] = (o) => n.$emit("cta"))
      }, Qn({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: _(({ class: o }) => [
            T(l(G), {
              icon: t.ctaIcon,
              class: D(o),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : h("", !0)
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
    return (e, o) => (s(), u("aside", {
      class: D(["kx-rail", { "kx-settings-list-rail": t.settings }]),
      "aria-labelledby": l(n)
    }, [
      b("div", eo, [
        b("span", {
          id: l(n),
          class: "kx-railhead-title"
        }, [
          q(w(t.title), 1),
          t.count !== void 0 ? (s(), u("b", ro, w(t.count), 1)) : h("", !0)
        ], 8, oo),
        b("div", ao, [
          I(e.$slots, "actions")
        ])
      ]),
      I(e.$slots, "toolbar"),
      b("div", so, [
        I(e.$slots, "default")
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
}, uo = Y.extend({
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
function xt(t) {
  "@babel/helpers - typeof";
  return xt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, xt(t);
}
function bo(t, n, e) {
  return (n = go(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function go(t) {
  var n = fo(t, "string");
  return xt(n) == "symbol" ? n : n + "";
}
function fo(t, n) {
  if (xt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (xt(o) != "object") return o;
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
function vo(t, n, e, o, a, r) {
  return s(), u("span", y({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (s(), m(U(t.$slots.icon), y({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (s(), u("span", y({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : h("", !0), t.value != null || t.$slots.default ? I(t.$slots, "default", {
    key: 2
  }, function() {
    return [b("span", y({
      class: t.cx("label")
    }, t.ptm("label")), w(t.value), 17)];
  }) : h("", !0)], 16, ho);
}
st.render = vo;
const mo = { class: "system-section-head" }, yo = { class: "system-section-head-text" }, ko = {
  key: 0,
  class: "kx-head-actions"
}, Rt = /* @__PURE__ */ V({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(t) {
    return (n, e) => (s(), u("header", mo, [
      b("div", yo, [
        b("h1", null, w(t.title), 1),
        b("p", null, w(t.description), 1)
      ]),
      n.$slots.actions ? (s(), u("div", ko, [
        I(n.$slots, "actions")
      ])) : h("", !0)
    ]));
  }
});
function St(t, n) {
  if (!t) return "";
  const e = Math.max(0, Math.floor(n - t));
  return e < 60 ? "just now" : e < 3600 ? `${Math.floor(e / 60)}m ago` : e < 86400 ? `${Math.floor(e / 3600)}h ago` : `${Math.floor(e / 86400)}d ago`;
}
function Ln(t) {
  return t ? new Date(t * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
}
function wo(t, n) {
  const e = new Date(t * 1e3), o = new Date(n * 1e3), a = new Date(o.getFullYear(), o.getMonth(), o.getDate()).getTime() / 1e3;
  return t >= a ? "Today" : t >= a - 86400 ? "Yesterday" : e.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}
function En(t) {
  const n = t.replace(/^.*:/, "").replace(/[._-]+/g, " ").trim();
  return n ? n.charAt(0).toUpperCase() + n.slice(1) : "";
}
function kt(t) {
  return En(t) || "Note";
}
function at(t) {
  return En(t) || "Open";
}
function Wt(t) {
  const n = String(t || "").toLowerCase();
  return n === "blocked" ? "danger" : n === "in_progress" ? "info" : ["done", "closed", "completed", "resolved"].includes(n) ? "success" : "secondary";
}
function Lt(t) {
  const n = t.replace(/^.*:/, "").toLowerCase();
  return n === "blocker" || n === "risk" ? "danger" : n === "question" || n === "handoff" ? "warn" : n === "decision" || n === "milestone" ? "success" : "secondary";
}
const $o = ["aria-current"], Ao = { class: "jr-row-main" }, Co = { class: "jr-row-line" }, Po = { class: "jr-row-title" }, xo = ["title"], So = {
  key: 0,
  class: "jr-row-line"
}, To = {
  key: 1,
  class: "jr-row-detail"
}, K = /* @__PURE__ */ V({
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
    return (n, e) => (s(), u("button", {
      type: "button",
      class: D(["jr-row", { fresh: t.fresh }]),
      "aria-current": t.active ? "true" : void 0,
      onClick: e[0] || (e[0] = (o) => n.$emit("open"))
    }, [
      b("span", Ao, [
        b("span", Co, [
          b("span", Po, w(t.title), 1),
          t.at ? (s(), u("time", {
            key: 0,
            class: "jr-row-time",
            title: l(Ln)(t.at)
          }, w(l(St)(t.at, t.now)), 9, xo)) : h("", !0)
        ]),
        t.detail || t.tag ? (s(), u("span", So, [
          t.tag ? (s(), m(l(st), {
            key: 0,
            value: t.tag,
            severity: t.severity || "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"])) : h("", !0),
          t.detail ? (s(), u("span", To, w(t.detail), 1)) : h("", !0)
        ])) : h("", !0)
      ])
    ], 10, $o));
  }
}), hn = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, vn = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function Io(t) {
  let n = 2166136261;
  for (let e = 0; e < t.length; e++)
    n ^= t.charCodeAt(e), n = Math.imul(n, 16777619) >>> 0;
  return vn[n % 26] + vn[(n >>> 8) % 26];
}
function _o(t) {
  const n = t.split(/\s+/).filter(Boolean);
  return n.length ? n.length === 1 ? n[0].slice(0, 2).toUpperCase() : (n[0][0] + n[1][0]).toUpperCase() : "??";
}
function bt(t) {
  const n = (t || "").trim(), e = (n.replace(/[^a-z0-9]/gi, "").slice(-6) || "unknown").toUpperCase(), o = n.replace(hn, " ").replace(/[-_.:/]+/g, " ").replace(/\s+/g, " ").trim(), a = !o || hn.test(n), r = o.length > 24 ? `${o.slice(0, 23)}…` : o, i = r ? r.charAt(0).toUpperCase() + r.slice(1) : "";
  return {
    label: i ? a ? `${i} ${e}` : i : `Agent ${e}`,
    initials: a ? Io(n || e) : _o(r)
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
  t.agentId = t.agentId || n.agentId, t.cursorId = t.cursorId || n.cursorId, t.origin = t.origin || n.origin, t.lastActivityAt = Math.max(t.lastActivityAt, n.lastActivityAt), t.lastSeenSeq = Math.max(t.lastSeenSeq, n.lastSeenSeq), t.factCount += n.factCount, t.openSpans += n.openSpans, t.purpose = t.purpose || n.purpose, t.headline = t.headline || n.headline;
}
function No(t, n, e) {
  const o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  function r(c, p) {
    const d = [(c || "").trim(), p ? `cursor:${p.trim()}` : ""].filter(Boolean), f = Bo(c, p) || `cursor:${o.size}`, g = [...new Set(d.map((k) => a.get(k)).filter(Boolean))], $ = g[0] || f, P = o.get($) || Eo($);
    o.set($, P);
    for (const k of g.slice(1)) {
      const C = o.get(k);
      C && (Mo(P, C), o.delete(k));
      for (const [v, E] of a) E === k && a.set(v, $);
    }
    for (const k of d) a.set(k, $);
    P.agentId = P.agentId || (c || "").trim(), P.cursorId = P.cursorId || (p || "").trim(), P.id = P.agentId || (P.cursorId ? `cursor:${P.cursorId}` : $);
    const j = bt(P.agentId || P.cursorId);
    return P.label = j.label, P.initials = j.initials, P;
  }
  for (const c of t) {
    const p = r(c.agent_id, c.cursor_id);
    p.origin = c.origin || p.origin, p.lastActivityAt = Math.max(p.lastActivityAt, c.updated_at), p.lastSeenSeq = Math.max(p.lastSeenSeq, c.last_seen_seq || 0), p.purpose = c.purpose || c.checkpoint?.headline || p.purpose, p.headline = c.last_touch?.title || p.headline;
  }
  for (const c of [...n].sort((p, d) => p.last_activity_at - d.last_activity_at)) {
    const p = r(c.agent_id, c.cursor_id);
    p.origin = c.origin || p.origin, p.lastActivityAt = Math.max(p.lastActivityAt, c.last_activity_at, c.ended_at || 0), p.lastSeenSeq = Math.max(p.lastSeenSeq, c.last_seq || 0), p.factCount += c.fact_count || 0, c.state === "open" && (p.openSpans += 1), p.purpose = c.working_on?.text || p.purpose, p.headline = c.last_fact?.title || p.headline;
  }
  const i = [...o.values()];
  for (const c of i)
    c.working = c.openSpans > 0, c.liveness = Oo(c.lastActivityAt, e), c.purpose = c.purpose || c.headline || Lo(c.origin);
  return i.sort((c, p) => p.lastActivityAt - c.lastActivityAt || c.label.localeCompare(p.label));
}
function Uo(t) {
  const n = { now: [], today: [], older: [] };
  for (const e of t) n[e.liveness].push(e);
  return n;
}
function mn(t) {
  return t.task_id || t.working_on?.kind === "task" && t.working_on.text || "";
}
function Do(t, n) {
  const e = new Set([t.agentId, t.cursorId].filter(Boolean)), o = [...n].sort((a, r) => r.last_activity_at - a.last_activity_at).find((a) => (e.has(a.agent_id || "") || e.has(a.cursor_id || "")) && mn(a));
  return o ? mn(o) : "";
}
const qo = {
  class: "jr-detail",
  "aria-live": "polite"
}, Fo = {
  key: 1,
  class: "kx-loading"
}, Ko = {
  key: 0,
  class: "jr-path",
  "aria-label": "Part of"
}, Ho = ["onClick"], Ro = { class: "jr-tags" }, Wo = {
  key: 1,
  class: "jr-body"
}, Vo = {
  key: 2,
  class: "jr-block"
}, Jo = {
  key: 3,
  class: "jr-block"
}, Go = {
  key: 4,
  class: "jr-block"
}, Yo = {
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
    const e = t, o = n, a = x(() => e.detail?.kind === "task" ? e.detail.branch : null), r = x(() => e.detail?.kind === "fact" ? e.detail.event : null), i = x(() => a.value?.task || null), c = x(() => (a.value?.deps?.incoming || []).filter((k) => k.kind === "blocks").map((k) => k.from_task_id)), p = x(() => (a.value?.deps?.outgoing || []).filter((k) => k.kind === "blocks").map((k) => k.to_task_id)), d = x(() => [
      ...(a.value?.deps?.outgoing || []).filter((k) => k.kind !== "blocks").map((k) => ({ id: k.to_task_id, kind: k.kind })),
      ...(a.value?.deps?.incoming || []).filter((k) => k.kind !== "blocks").map((k) => ({ id: k.from_task_id, kind: k.kind }))
    ]), f = x(() => i.value?.title || r.value?.title || r.value?.body?.slice(0, 120) || "Untitled"), g = x(() => i.value ? [at(i.value.status), `updated ${St(i.value.updated_at, e.now)}`].join(" · ") : r.value ? `${kt(r.value.event_type)} by ${bt(r.value.actor_id || "").label} · ${Ln(r.value.ts)}` : ""), $ = x(() => i.value?.description || i.value?.digest || ""), P = x(() => {
      const k = String(r.value?.effective_state || r.value?.lifecycle || "active").toLowerCase();
      return k === "active" ? "" : at(k);
    });
    function j(k) {
      o("open", k);
    }
    return (k, C) => (s(), u("article", qo, [
      T(Rt, {
        title: t.loading && !t.detail ? "Opening…" : f.value,
        description: t.loading && !t.detail ? "" : g.value
      }, {
        actions: _(() => [
          t.canBack ? (s(), u("button", {
            key: 0,
            type: "button",
            class: "kx-iconbtn",
            "aria-label": "Back",
            title: "Back",
            onClick: C[0] || (C[0] = (v) => o("back"))
          }, [
            T(l(G), {
              icon: "tabler:arrow-left",
              "aria-hidden": "true"
            })
          ])) : h("", !0),
          b("button", {
            type: "button",
            class: "kx-iconbtn",
            "aria-label": "Close",
            title: "Close",
            onClick: C[1] || (C[1] = (v) => o("close"))
          }, [
            T(l(G), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ]),
        _: 1
      }, 8, ["title", "description"]),
      t.error ? (s(), m(Bt, {
        key: 0,
        icon: "tabler:alert-triangle",
        title: "This item could not be opened",
        hint: t.error
      }, null, 8, ["hint"])) : t.loading && !t.detail ? (s(), u("div", Fo, [
        T(l(G), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        C[3] || (C[3] = q(" Loading…", -1))
      ])) : a.value && i.value ? (s(), u(S, { key: 2 }, [
        a.value.ancestors.length ? (s(), u("nav", Ko, [
          (s(!0), u(S, null, B(a.value.ancestors, (v, E) => (s(), u(S, {
            key: v.id
          }, [
            E ? (s(), m(l(G), {
              key: 0,
              icon: "tabler:chevron-right",
              "aria-hidden": "true"
            })) : h("", !0),
            b("button", {
              type: "button",
              onClick: (F) => j({ kind: "task", id: v.id })
            }, w(v.title), 9, Ho)
          ], 64))), 128))
        ])) : h("", !0),
        b("div", Ro, [
          T(l(st), {
            value: l(at)(i.value.status),
            severity: l(Wt)(i.value.status),
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"]),
          i.value.work_kind ? (s(), m(l(st), {
            key: 0,
            value: l(at)(i.value.work_kind),
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"])) : h("", !0)
        ]),
        $.value ? (s(), u("p", Wo, w($.value), 1)) : h("", !0),
        c.value.length ? (s(), u("section", Vo, [
          C[4] || (C[4] = b("h2", null, "Waiting on", -1)),
          (s(!0), u(S, null, B(c.value, (v) => (s(), m(K, {
            key: v,
            title: t.taskTitle(v) || "Untitled task",
            now: t.now,
            onOpen: (E) => j({ kind: "task", id: v })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : h("", !0),
        p.value.length ? (s(), u("section", Jo, [
          C[5] || (C[5] = b("h2", null, "Holds up", -1)),
          (s(!0), u(S, null, B(p.value, (v) => (s(), m(K, {
            key: v,
            title: t.taskTitle(v) || "Untitled task",
            now: t.now,
            onOpen: (E) => j({ kind: "task", id: v })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : h("", !0),
        d.value.length ? (s(), u("section", Go, [
          C[6] || (C[6] = b("h2", null, "Related", -1)),
          (s(!0), u(S, null, B(d.value, (v) => (s(), m(K, {
            key: `${v.kind}:${v.id}`,
            title: t.taskTitle(v.id) || "Untitled task",
            tag: l(at)(v.kind),
            now: t.now,
            onOpen: (E) => j({ kind: "task", id: v.id })
          }, null, 8, ["title", "tag", "now", "onOpen"]))), 128))
        ])) : h("", !0),
        a.value.children.length ? (s(), u("section", Yo, [
          b("h2", null, [
            C[7] || (C[7] = q("Parts ", -1)),
            b("span", Zo, w(a.value.children.length), 1)
          ]),
          (s(!0), u(S, null, B(a.value.children, (v) => (s(), m(K, {
            key: v.id,
            title: v.title,
            at: v.updated_at,
            now: t.now,
            tag: l(at)(v.status),
            severity: l(Wt)(v.status),
            detail: v.open_count ? `${v.open_count} open inside` : "",
            onOpen: (E) => j({ kind: "task", id: v.id })
          }, null, 8, ["title", "at", "now", "tag", "severity", "detail", "onOpen"]))), 128))
        ])) : h("", !0),
        b("section", Qo, [
          b("h2", null, [
            C[8] || (C[8] = q("History ", -1)),
            b("span", Xo, w(a.value.facts.length), 1)
          ]),
          a.value.facts.length ? h("", !0) : (s(), u("p", tr, "Nothing has been recorded on this task yet.")),
          (s(!0), u(S, null, B(a.value.facts, (v) => (s(), m(K, {
            key: v.id,
            title: v.title || v.body || "Untitled",
            detail: l(bt)(v.actor_id || "").label,
            at: v.ts,
            now: t.now,
            tag: l(kt)(v.event_type),
            severity: l(Lt)(v.event_type),
            onOpen: (E) => j({ kind: "fact", id: v.id })
          }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "onOpen"]))), 128))
        ])
      ], 64)) : a.value ? (s(), m(Bt, {
        key: 3,
        icon: "tabler:file-unknown",
        title: "This task is no longer in the journal"
      })) : r.value ? (s(), u(S, { key: 4 }, [
        b("div", nr, [
          T(l(st), {
            value: l(kt)(r.value.event_type),
            severity: l(Lt)(r.value.event_type),
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"]),
          P.value ? (s(), m(l(st), {
            key: 0,
            value: P.value,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"])) : h("", !0),
          (s(!0), u(S, null, B(r.value.tags || [], (v) => (s(), m(l(st), {
            key: v,
            value: v,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"]))), 128))
        ]),
        r.value.body && r.value.body !== r.value.title ? (s(), u("p", er, w(r.value.body), 1)) : h("", !0),
        r.value.task_id ? (s(), u("section", or, [
          C[9] || (C[9] = b("h2", null, "Task", -1)),
          T(K, {
            title: t.taskTitle(r.value.task_id) || "Untitled task",
            now: t.now,
            onOpen: C[2] || (C[2] = (v) => j({ kind: "task", id: r.value.task_id }))
          }, null, 8, ["title", "now"])
        ])) : h("", !0)
      ], 64)) : h("", !0)
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
}, ir = Y.extend({
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
function Tt(t) {
  "@babel/helpers - typeof";
  return Tt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(n) {
    return typeof n;
  } : function(n) {
    return n && typeof Symbol == "function" && n.constructor === Symbol && n !== Symbol.prototype ? "symbol" : typeof n;
  }, Tt(t);
}
function yn(t, n, e) {
  return (n = dr(n)) in t ? Object.defineProperty(t, n, { value: e, enumerable: !0, configurable: !0, writable: !0 }) : t[n] = e, t;
}
function dr(t) {
  var n = cr(t, "string");
  return Tt(n) == "symbol" ? n : n + "";
}
function cr(t, n) {
  if (Tt(t) != "object" || !t) return t;
  var e = t[Symbol.toPrimitive];
  if (e !== void 0) {
    var o = e.call(t, n);
    if (Tt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (n === "string" ? String : Number)(t);
}
var Vt = {
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
function fr(t, n, e, o, a, r) {
  return s(), u("div", y({
    class: t.cx("root"),
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [I(t.$slots, "default", {}, function() {
    return [t.label ? (s(), u("span", y({
      key: 0,
      class: t.cx("label")
    }, t.ptm("label"), {
      "data-p": r.dataP
    }), w(t.label), 17, pr)) : t.$slots.icon ? (s(), m(U(t.$slots.icon), {
      key: 1,
      class: D(t.cx("icon"))
    }, null, 8, ["class"])) : t.icon ? (s(), u("span", y({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon"), {
      "data-p": r.dataP
    }), null, 16, br)) : t.image ? (s(), u("img", y({
      key: 3,
      src: t.image,
      alt: t.ariaLabel,
      onError: n[0] || (n[0] = function() {
        return r.onError && r.onError.apply(r, arguments);
      })
    }, t.ptm("image"), {
      "data-p": r.dataP
    }), null, 16, gr)) : h("", !0)];
  })], 16, ur);
}
Vt.render = fr;
var Mn = {
  name: "ChevronRightIcon",
  extends: It
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
    if (typeof t == "string") return Jt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Jt(t, n) : void 0;
  }
}
function yr(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function kr(t) {
  if (Array.isArray(t)) return Jt(t);
}
function Jt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function wr(t, n, e, o, a, r) {
  return s(), u("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), hr(n[0] || (n[0] = [b("path", {
    d: "M4.38708 13C4.28408 13.0005 4.18203 12.9804 4.08691 12.9409C3.99178 12.9014 3.9055 12.8433 3.83313 12.7701C3.68634 12.6231 3.60388 12.4238 3.60388 12.2161C3.60388 12.0084 3.68634 11.8091 3.83313 11.6622L8.50507 6.99022L3.83313 2.31827C3.69467 2.16968 3.61928 1.97313 3.62287 1.77005C3.62645 1.56698 3.70872 1.37322 3.85234 1.22959C3.99596 1.08597 4.18972 1.00371 4.3928 1.00012C4.59588 0.996539 4.79242 1.07192 4.94102 1.21039L10.1669 6.43628C10.3137 6.58325 10.3962 6.78249 10.3962 6.99022C10.3962 7.19795 10.3137 7.39718 10.1669 7.54416L4.94102 12.7701C4.86865 12.8433 4.78237 12.9014 4.68724 12.9409C4.59212 12.9804 4.49007 13.0005 4.38708 13Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Mn.render = wr;
var nn = {
  name: "ChevronUpIcon",
  extends: It
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
function Sr(t, n, e, o, a, r) {
  return s(), u("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), $r(n[0] || (n[0] = [b("path", {
    d: "M12.2097 10.4113C12.1057 10.4118 12.0027 10.3915 11.9067 10.3516C11.8107 10.3118 11.7237 10.2532 11.6506 10.1792L6.93602 5.46461L2.22139 10.1476C2.07272 10.244 1.89599 10.2877 1.71953 10.2717C1.54307 10.2556 1.3771 10.1808 1.24822 10.0593C1.11933 9.93766 1.035 9.77633 1.00874 9.6011C0.982477 9.42587 1.0158 9.2469 1.10338 9.09287L6.37701 3.81923C6.52533 3.6711 6.72639 3.58789 6.93602 3.58789C7.14565 3.58789 7.3467 3.6711 7.49502 3.81923L12.7687 9.09287C12.9168 9.24119 13 9.44225 13 9.65187C13 9.8615 12.9168 10.0626 12.7687 10.2109C12.616 10.3487 12.4151 10.4207 12.2097 10.4113Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
nn.render = Sr;
var Tr = {
  root: "p-accordioncontent",
  contentWrapper: "p-accordioncontent-wrapper",
  content: "p-accordioncontent-content"
}, Ir = Y.extend({
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
}, en = {
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
      return y(this.a11yAttrs, this.ptmi("root", this.ptParams));
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
function jr(t, n, e, o, a, r) {
  return t.asChild ? I(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs
  }) : (s(), m(Tn, y({
    key: 0,
    name: "p-collapsible"
  }, t.ptm("transition", r.ptParams)), {
    default: _(function() {
      return [!r.$pcAccordion.lazy || r.$pcAccordionPanel.active ? _t((s(), m(U(t.as), y({
        key: 0,
        class: t.cx("root")
      }, r.attrs), {
        default: _(function() {
          return [b("div", y({
            class: t.cx("contentWrapper")
          }, t.ptm("contentWrapper", r.ptParams)), [b("div", y({
            class: t.cx("content")
          }, t.ptm("content", r.ptParams)), [I(t.$slots, "default")], 16)], 16)];
        }),
        _: 3
      }, 16, ["class"])), [[te, r.$pcAccordion.lazy ? !0 : r.$pcAccordionPanel.active]]) : h("", !0)];
    }),
    _: 3
  }, 16));
}
en.render = jr;
var Nn = {
  name: "ChevronDownIcon",
  extends: It
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
    if (typeof t == "string") return Yt(t, n);
    var e = {}.toString.call(t).slice(8, -1);
    return e === "Object" && t.constructor && (e = t.constructor.name), e === "Map" || e === "Set" ? Array.from(t) : e === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(e) ? Yt(t, n) : void 0;
  }
}
function Lr(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Er(t) {
  if (Array.isArray(t)) return Yt(t);
}
function Yt(t, n) {
  (n == null || n > t.length) && (n = t.length);
  for (var e = 0, o = Array(n); e < n; e++) o[e] = t[e];
  return o;
}
function Mr(t, n, e, o, a, r) {
  return s(), u("svg", y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), zr(n[0] || (n[0] = [b("path", {
    d: "M7.01744 10.398C6.91269 10.3985 6.8089 10.378 6.71215 10.3379C6.61541 10.2977 6.52766 10.2386 6.45405 10.1641L1.13907 4.84913C1.03306 4.69404 0.985221 4.5065 1.00399 4.31958C1.02276 4.13266 1.10693 3.95838 1.24166 3.82747C1.37639 3.69655 1.55301 3.61742 1.74039 3.60402C1.92777 3.59062 2.11386 3.64382 2.26584 3.75424L7.01744 8.47394L11.769 3.75424C11.9189 3.65709 12.097 3.61306 12.2748 3.62921C12.4527 3.64535 12.6199 3.72073 12.7498 3.84328C12.8797 3.96582 12.9647 4.12842 12.9912 4.30502C13.0177 4.48162 12.9841 4.662 12.8958 4.81724L7.58083 10.1322C7.50996 10.2125 7.42344 10.2775 7.32656 10.3232C7.22968 10.3689 7.12449 10.3944 7.01744 10.398Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Nn.render = Mr;
var Nr = {
  root: "p-accordionheader",
  toggleicon: "p-accordionheader-toggle-icon"
}, Ur = Y.extend({
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
  style: Ur,
  provide: function() {
    return {
      $pcAccordionHeader: this,
      $parentInstance: this
    };
  }
}, on = {
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
      return o ? dn(o, "data-p-disabled") ? this.findNextPanel(o) : this.findHeader(o) : null;
    },
    findPrevPanel: function(n) {
      var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, o = e ? n : n.previousElementSibling;
      return o ? dn(o, "data-p-disabled") ? this.findPrevPanel(o) : this.findHeader(o) : null;
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
      return y(this.asAttrs, this.a11yAttrs, this.ptmi("root", this.ptParams));
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
    ChevronUpIcon: nn,
    ChevronDownIcon: Nn
  },
  directives: {
    ripple: Qt
  }
};
function qr(t, n, e, o, a, r) {
  var i = Xt("ripple");
  return t.asChild ? I(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.$pcAccordionPanel.active,
    a11yAttrs: r.a11yAttrs,
    onClick: r.onClick
  }) : _t((s(), m(U(t.as), y({
    key: 0,
    "data-p": r.dataP,
    class: t.cx("root"),
    onClick: r.onClick
  }, r.attrs), {
    default: _(function() {
      return [I(t.$slots, "default", {
        active: r.$pcAccordionPanel.active
      }), I(t.$slots, "toggleicon", {
        active: r.$pcAccordionPanel.active,
        class: D(t.cx("toggleicon"))
      }, function() {
        return [r.$pcAccordionPanel.active ? (s(), m(U(r.$pcAccordion.$slots.collapseicon ? r.$pcAccordion.$slots.collapseicon : r.$pcAccordion.collapseIcon ? "span" : "ChevronUpIcon"), y({
          key: 0,
          class: [r.$pcAccordion.collapseIcon, t.cx("toggleicon")],
          "aria-hidden": "true"
        }, t.ptm("toggleicon", r.ptParams)), null, 16, ["class"])) : (s(), m(U(r.$pcAccordion.$slots.expandicon ? r.$pcAccordion.$slots.expandicon : r.$pcAccordion.expandIcon ? "span" : "ChevronDownIcon"), y({
          key: 1,
          class: [r.$pcAccordion.expandIcon, t.cx("toggleicon")],
          "aria-hidden": "true"
        }, t.ptm("toggleicon", r.ptParams)), null, 16, ["class"]))];
      })];
    }),
    _: 3
  }, 16, ["data-p", "class", "onClick"])), [[i]]);
}
on.render = qr;
var Fr = {
  root: function(n) {
    var e = n.instance, o = n.props;
    return ["p-accordionpanel", {
      "p-accordionpanel-active": e.active,
      "p-disabled": o.disabled
    }];
  }
}, Kr = Y.extend({
  name: "accordionpanel",
  classes: Fr
}), Hr = {
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
  style: Kr,
  provide: function() {
    return {
      $pcAccordionPanel: this,
      $parentInstance: this
    };
  }
}, rn = {
  name: "AccordionPanel",
  extends: Hr,
  inheritAttrs: !1,
  inject: ["$pcAccordion"],
  computed: {
    active: function() {
      return this.$pcAccordion.isItemActive(this.value);
    },
    attrs: function() {
      return y(this.a11yAttrs, this.ptmi("root", this.ptParams));
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
function Rr(t, n, e, o, a, r) {
  return t.asChild ? I(t.$slots, "default", {
    key: 1,
    class: D(t.cx("root")),
    active: r.active,
    a11yAttrs: r.a11yAttrs
  }) : (s(), m(U(t.as), y({
    key: 0,
    class: t.cx("root")
  }, r.attrs), {
    default: _(function() {
      return [I(t.$slots, "default")];
    }),
    _: 3
  }, 16, ["class"]));
}
rn.render = Rr;
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
}, Jr = Y.extend({
  name: "accordion",
  style: Wr,
  classes: Vr
}), Gr = {
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
}, Un = {
  name: "Accordion",
  extends: Gr,
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
      this.multiple ? o ? this.d_value = this.d_value.filter(function(a) {
        return a !== n;
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
        root: y({
          onClick: function(r) {
            return o.onTabClick(r, e);
          }
        }, this.getTabProp(n, "headerProps"), this.getTabPT(n, "header", e)),
        toggleicon: y(this.getTabProp(n, "headeractionprops"), this.getTabPT(n, "headeraction", e))
      };
    },
    getContentPT: function(n, e) {
      return {
        root: y(this.getTabProp(n, "contentProps"), this.getTabPT(n, "toggleablecontent", e)),
        transition: this.getTabPT(n, "transition", e),
        content: this.getTabPT(n, "content", e)
      };
    },
    getTabPT: function(n, e, o) {
      var a = this.tabs.length, r = {
        props: n.props || {},
        parent: {
          instance: this,
          props: this.$props,
          state: this.$data
        },
        context: {
          index: o,
          count: a,
          first: o === 0,
          last: o === a - 1,
          active: this.isItemActive("".concat(o))
        }
      };
      return y(this.ptm("accordiontab.".concat(e), r), this.ptmo(this.getTabProp(n, "pt"), e, r));
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
        return n.isAccordionTab(o) ? e.push(o) : o.children && o.children instanceof Array && o.children.forEach(function(a) {
          n.isAccordionTab(a) && e.push(a);
        }), e;
      }, []);
    },
    hasAccordionTab: function() {
      return this.tabs.length;
    }
  },
  components: {
    AccordionPanel: rn,
    AccordionHeader: on,
    AccordionContent: en,
    ChevronUpIcon: nn,
    ChevronRightIcon: Mn
  }
};
function Yr(t, n, e, o, a, r) {
  var i = pt("AccordionHeader"), c = pt("AccordionContent"), p = pt("AccordionPanel");
  return s(), u("div", y({
    class: t.cx("root")
  }, t.ptmi("root")), [r.hasAccordionTab ? (s(!0), u(S, {
    key: 0
  }, B(r.tabs, function(d, f) {
    return s(), m(p, {
      key: r.getKey(d, f),
      value: "".concat(f),
      pt: {
        root: r.getTabPT(d, "root", f)
      },
      disabled: r.getTabProp(d, "disabled")
    }, {
      default: _(function() {
        return [T(i, {
          class: D(r.getTabProp(d, "headerClass")),
          pt: r.getHeaderPT(d, f)
        }, {
          toggleicon: _(function(g) {
            return [g.active ? (s(), m(U(t.$slots.collapseicon ? t.$slots.collapseicon : t.collapseIcon ? "span" : "ChevronDownIcon"), y({
              key: 0,
              class: [t.collapseIcon, g.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(d, "headericon", f)), null, 16, ["class"])) : (s(), m(U(t.$slots.expandicon ? t.$slots.expandicon : t.expandIcon ? "span" : "ChevronUpIcon"), y({
              key: 1,
              class: [t.expandIcon, g.class],
              "aria-hidden": "true"
            }, {
              ref_for: !0
            }, r.getTabPT(d, "headericon", f)), null, 16, ["class"]))];
          }),
          default: _(function() {
            return [d.children && d.children.headericon ? (s(), m(U(d.children.headericon), {
              key: 0,
              isTabActive: r.isItemActive("".concat(f)),
              active: r.isItemActive("".concat(f)),
              index: f
            }, null, 8, ["isTabActive", "active", "index"])) : h("", !0), d.props && d.props.header ? (s(), u("span", y({
              key: 1,
              ref_for: !0
            }, r.getTabPT(d, "headertitle", f)), w(d.props.header), 17)) : h("", !0), d.children && d.children.header ? (s(), m(U(d.children.header), {
              key: 2
            })) : h("", !0)];
          }),
          _: 2
        }, 1032, ["class", "pt"]), T(c, {
          pt: r.getContentPT(d, f)
        }, {
          default: _(function() {
            return [(s(), m(U(d)))];
          }),
          _: 2
        }, 1032, ["pt"])];
      }),
      _: 2
    }, 1032, ["value", "pt", "disabled"]);
  }), 128)) : I(t.$slots, "default", {
    key: 1
  })], 16);
}
Un.render = Yr;
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
    return (e, o) => (s(), m(l(Un), {
      class: "kx-disclosure",
      value: n.value ? "content" : void 0,
      "onUpdate:value": o[0] || (o[0] = (a) => n.value = a === "content")
    }, {
      default: _(() => [
        T(l(rn), {
          class: "kx-disclosure-panel",
          value: "content"
        }, {
          default: _(() => [
            T(l(on), { class: "kx-disclosure-toggle" }, {
              default: _(() => [
                q(w(t.label), 1)
              ]),
              _: 1
            }),
            T(l(en), { pt: {
              transition: { name: "kx-disclosure-motion" },
              contentWrapper: { class: "kx-disclosure-content" }
            } }, {
              default: _(() => [
                I(e.$slots, "default")
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
function Zt(t, n) {
  const e = Math.max(0, Math.floor(n - t)), o = e < 3600 ? "live" : e < Dn ? "recent" : "dormant";
  return { seconds: e, label: St(t, n), tier: o };
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
function Et(t) {
  return Zr.has(String(t || "").toLowerCase());
}
function Qr(t) {
  const n = new Set(t.map((o) => o.id)), e = /* @__PURE__ */ new Map();
  for (const o of t) {
    const a = o.parent_task_id && o.parent_task_id !== o.id && n.has(o.parent_task_id) ? o.parent_task_id : "", r = e.get(a) || [];
    r.push(o), e.set(a, r);
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
  const o = [], a = [...n.get(t.id) || []];
  for (; a.length; ) {
    const r = a.shift();
    e.has(r.id) || (e.add(r.id), o.push(r), a.push(...n.get(r.id) || []));
  }
  return o;
}
function na(t, n) {
  const e = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), a = [], r = (i) => {
    for (a.push({ task: i, opened: !1 }); a.length; ) {
      const c = a.pop(), p = c.task;
      if (c.opened) {
        let d = p.updated_at;
        for (const f of n.get(p.id) || [])
          d = Math.max(d, e.get(f.id) ?? f.updated_at);
        e.set(p.id, d);
        continue;
      }
      if (!o.has(p.id)) {
        o.add(p.id), a.push({ task: p, opened: !0 });
        for (const d of n.get(p.id) || []) a.push({ task: d, opened: !1 });
      }
    }
  };
  for (const i of n.get("") || []) r(i);
  for (const i of t) o.has(i.id) || r(i);
  return e;
}
function ea(t, n) {
  const { children: e, activity: o } = Xr(t), a = new Map(t.map((c) => [c.id, c])), r = (c) => Zt(o.get(c.id) ?? c.updated_at, n).tier === "dormant", i = [];
  for (const c of t) {
    if (!r(c)) continue;
    const p = c.parent_task_id && c.parent_task_id !== c.id ? a.get(c.parent_task_id) : void 0;
    if (p && r(p)) continue;
    const d = ta(c, e, /* @__PURE__ */ new Set([c.id])), f = o.get(c.id) ?? c.updated_at, g = {
      root: c,
      members: d,
      lastActivityAt: f,
      age: Zt(f, n),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const $ of [c, ...d]) {
      const P = String($.status || "").toLowerCase();
      Et(P) ? g.doneCount += 1 : P === "blocked" ? g.blockedCount += 1 : g.openCount += 1;
    }
    i.push(g);
  }
  return i.sort((c, p) => c.lastActivityAt - p.lastActivityAt || c.root.title.localeCompare(p.root.title));
}
function oa(t, n) {
  const e = new Map(t.map((r) => [r.id, r])), o = (r) => {
    let i = r;
    const c = /* @__PURE__ */ new Set();
    for (; i.parent_task_id && e.has(i.parent_task_id) && !c.has(i.id); )
      c.add(i.id), i = e.get(i.parent_task_id);
    return i;
  }, a = /* @__PURE__ */ new Map();
  for (const r of ea(t, n)) {
    if (!r.openCount && !r.blockedCount) continue;
    const i = o(r.root), c = a.get(i.id) || { root: i, tasks: 0, open: 0, lastActivityAt: 0 };
    c.tasks += r.members.length + 1, c.open += r.openCount + r.blockedCount, c.lastActivityAt = Math.max(c.lastActivityAt, r.lastActivityAt), a.set(i.id, c);
  }
  return [...a.values()].sort((r, i) => r.lastActivityAt - i.lastActivityAt);
}
const ra = {
  class: "jr-section",
  "aria-labelledby": "jr-changes"
}, aa = { class: "kx-settings-rail-group" }, sa = {
  class: "jr-section",
  "aria-labelledby": "jr-agents"
}, ia = ["onClick"], la = { class: "jr-row-main" }, da = { class: "jr-row-line" }, ca = { class: "jr-row-title" }, ua = { class: "jr-row-time" }, pa = { class: "jr-row-line" }, ba = { class: "jr-row-detail" }, ga = ["onClick"], fa = { class: "jr-row-main" }, ha = { class: "jr-row-line" }, va = { class: "jr-row-title" }, ma = { class: "jr-row-time" }, ya = { class: "jr-row-line" }, ka = { class: "jr-row-detail" }, wa = {
  key: 0,
  class: "jr-section",
  "aria-label": "Gone quiet"
}, $a = { class: "jr-note" }, $n = 40, Aa = /* @__PURE__ */ V({
  __name: "Overview",
  props: {
    days: {},
    fresh: {},
    visited: { type: Boolean },
    moreHistory: { type: Boolean },
    agents: {},
    quiet: {},
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open", "agent"],
  setup(t) {
    const n = t, e = O($n), o = x(() => n.days.reduce((d, f) => d + f.events.length, 0)), a = x(() => {
      let d = Math.max(e.value, n.fresh);
      const f = [];
      for (const g of n.days) {
        if (d <= 0) break;
        f.push({ day: g.day, events: g.events.slice(0, d) }), d -= g.events.length;
      }
      return f;
    }), r = Math.round(Dn / 86400), i = x(() => [...n.agents.now, ...n.agents.today]), c = x(() => o.value ? n.visited ? n.fresh ? `${n.fresh >= o.value && n.moreHistory ? `More than ${n.fresh}` : String(n.fresh)} new since your last visit.` : "Nothing new since your last visit." : "The latest facts recorded in this journal." : "Facts agents and people record appear here.");
    function p(d, f) {
      return [bt(d || "").label, n.taskTitle(f)].filter(Boolean).join(" · ");
    }
    return (d, f) => (s(), u(S, null, [
      b("section", ra, [
        T(Rt, {
          id: "jr-changes",
          title: "What changed",
          description: c.value
        }, null, 8, ["description"]),
        o.value ? h("", !0) : (s(), m(Bt, {
          key: 0,
          icon: "tabler:notes",
          title: "No facts yet",
          hint: "When an agent or a person records a fact in this journal, it shows up here."
        })),
        (s(!0), u(S, null, B(a.value, (g) => (s(), u("div", {
          key: g.day,
          class: "jr-day"
        }, [
          b("div", aa, w(g.day), 1),
          (s(!0), u(S, null, B(g.events, ($) => (s(), m(K, {
            key: $.id,
            title: $.title || $.body || "Untitled",
            detail: p($.actor_id, $.task_id),
            at: $.ts,
            now: t.now,
            tag: l(kt)($.event_type),
            severity: l(Lt)($.event_type),
            fresh: $.fresh,
            onOpen: (P) => d.$emit("open", { kind: "fact", id: $.id })
          }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "fresh", "onOpen"]))), 128))
        ]))), 128)),
        o.value > e.value && o.value > t.fresh ? (s(), m(l(tn), {
          key: 1,
          class: "jr-more",
          label: "Show older",
          severity: "secondary",
          text: "",
          size: "small",
          onClick: f[0] || (f[0] = (g) => e.value += $n)
        })) : h("", !0)
      ]),
      b("section", sa, [
        T(Rt, {
          id: "jr-agents",
          title: "Agents",
          description: i.value.length ? `${t.agents.now.length} working in the last hour, ${t.agents.today.length} earlier today.` : "No agent has written here today."
        }, null, 8, ["description"]),
        (s(!0), u(S, null, B(i.value, (g) => (s(), u("button", {
          key: g.id,
          type: "button",
          class: "jr-row jr-agent",
          onClick: ($) => d.$emit("agent", g)
        }, [
          T(l(Vt), {
            label: g.initials,
            shape: "circle",
            class: D(["jr-avatar", { working: g.working }])
          }, null, 8, ["label", "class"]),
          b("span", la, [
            b("span", da, [
              b("span", ca, w(g.label), 1),
              b("time", ua, w(l(St)(g.lastActivityAt, t.now)), 1)
            ]),
            b("span", pa, [
              b("span", ba, w(g.headline || g.purpose), 1)
            ])
          ])
        ], 8, ia))), 128)),
        t.agents.older.length ? (s(), m(kn, {
          key: 0,
          label: `Earlier (${t.agents.older.length})`
        }, {
          default: _(() => [
            (s(!0), u(S, null, B(t.agents.older, (g) => (s(), u("button", {
              key: g.id,
              type: "button",
              class: "jr-row jr-agent",
              onClick: ($) => d.$emit("agent", g)
            }, [
              T(l(Vt), {
                label: g.initials,
                shape: "circle",
                class: "jr-avatar"
              }, null, 8, ["label"]),
              b("span", fa, [
                b("span", ha, [
                  b("span", va, w(g.label), 1),
                  b("time", ma, w(l(St)(g.lastActivityAt, t.now)), 1)
                ]),
                b("span", ya, [
                  b("span", ka, w(g.purpose), 1)
                ])
              ])
            ], 8, ga))), 128))
          ]),
          _: 1
        }, 8, ["label"])) : h("", !0)
      ]),
      t.quiet.length ? (s(), u("section", wa, [
        T(kn, {
          label: `Gone quiet (${t.quiet.length})`
        }, {
          default: _(() => [
            b("p", $a, "Open work nothing has touched for " + w(l(r)) + " days or more. Ask an agent to settle it after reading its history.", 1),
            (s(!0), u(S, null, B(t.quiet, (g) => (s(), m(K, {
              key: g.root.id,
              title: g.root.title,
              detail: `${g.open} open of ${g.tasks} tasks`,
              at: g.lastActivityAt,
              now: t.now,
              onOpen: ($) => d.$emit("open", { kind: "task", id: g.root.id })
            }, null, 8, ["title", "detail", "at", "now", "onOpen"]))), 128))
          ]),
          _: 1
        }, 8, ["label"])
      ])) : h("", !0)
    ], 64));
  }
}), Ca = { class: "kx-search jr-search" }, An = /* @__PURE__ */ V({
  __name: "SearchBox",
  props: {
    modelValue: { required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t, { expose: n }) {
    const e = In(t, "modelValue"), o = O(null);
    return n({ focus: () => o.value?.focus() }), (a, r) => (s(), u("div", Ca, [
      T(l(G), {
        icon: "tabler:search",
        class: "kx-search-ico",
        "aria-hidden": "true"
      }),
      _t(b("input", {
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
      e.value ? (s(), u("button", {
        key: 0,
        type: "button",
        class: "kx-search-clear",
        "aria-label": "Clear search",
        onClick: r[2] || (r[2] = (i) => e.value = "")
      }, [
        T(l(G), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : h("", !0)
    ]));
  }
}), Pa = { class: "jr-list" }, xa = {
  key: 0,
  class: "jr-list-empty"
}, Sa = {
  key: 1,
  class: "jr-list-empty"
}, Ta = {
  key: 2,
  class: "jr-list-empty"
}, Ia = {
  key: 3,
  class: "jr-list-empty"
}, _a = { class: "kx-settings-rail-group" }, ja = {
  key: 0,
  class: "kx-count"
}, za = {
  key: 0,
  class: "jr-list-empty"
}, Oa = { class: "kx-settings-rail-group" }, Ba = { class: "kx-count" }, Cn = /* @__PURE__ */ V({
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
    function o(a) {
      return n.selected?.kind === a.kind && n.selected.id === a.id;
    }
    return (a, r) => (s(), u("div", Pa, [
      t.query.trim() ? (s(), u(S, { key: 0 }, [
        r[0] || (r[0] = b("div", { class: "kx-settings-rail-group" }, "Tasks", -1)),
        t.matchedTasks.length ? h("", !0) : (s(), u("p", xa, "No task matches.")),
        (s(!0), u(S, null, B(t.matchedTasks, (i) => (s(), m(K, {
          key: `t:${i.id}`,
          title: i.title,
          detail: t.taskTitle(i.parent_task_id),
          at: i.updated_at,
          now: t.now,
          tag: l(at)(i.status),
          severity: l(Wt)(i.status),
          active: o({ kind: "task", id: i.id }),
          onOpen: (c) => a.$emit("open", { kind: "task", id: i.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        r[1] || (r[1] = b("div", { class: "kx-settings-rail-group" }, "Facts", -1)),
        t.searching ? (s(), u("p", Sa, "Searching…")) : t.searchError ? (s(), u("p", Ta, w(t.searchError), 1)) : t.matchedFacts.length ? h("", !0) : (s(), u("p", Ia, "No fact matches.")),
        (s(!0), u(S, null, B(t.matchedFacts, (i) => (s(), m(K, {
          key: `f:${i.id}`,
          title: i.title || i.body || "Untitled",
          detail: t.taskTitle(i.task_id),
          at: i.ts,
          now: t.now,
          tag: l(kt)(i.event_type),
          severity: l(Lt)(i.event_type),
          active: o({ kind: "fact", id: i.id }),
          onOpen: (c) => a.$emit("open", { kind: "fact", id: i.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128))
      ], 64)) : (s(), u(S, { key: 1 }, [
        b("div", _a, [
          r[2] || (r[2] = q("Needs you ", -1)),
          t.needs.length ? (s(), u("span", ja, w(t.needs.length), 1)) : h("", !0)
        ]),
        t.needs.length ? h("", !0) : (s(), u("p", za, "Nothing needs you right now.")),
        (s(!0), u(S, null, B(t.needs, (i) => (s(), m(K, {
          key: `${i.ref.kind}:${i.ref.id}`,
          title: i.title,
          detail: i.detail,
          at: i.at,
          now: t.now,
          tag: e[i.reason].label,
          severity: e[i.reason].severity,
          active: o(i.ref),
          onOpen: (c) => a.$emit("open", i.ref)
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        t.working.length ? (s(), u(S, { key: 1 }, [
          b("div", Oa, [
            r[3] || (r[3] = q("In progress ", -1)),
            b("span", Ba, w(t.working.length), 1)
          ]),
          (s(!0), u(S, null, B(t.working, (i) => (s(), m(K, {
            key: `${i.ref.kind}:${i.ref.id}`,
            title: i.title,
            detail: i.detail,
            at: i.at,
            now: t.now,
            active: o(i.ref),
            onOpen: (c) => a.$emit("open", i.ref)
          }, null, 8, ["title", "detail", "at", "now", "active", "onOpen"]))), 128))
        ], 64)) : h("", !0)
      ], 64))
    ]));
  }
});
function qt(t) {
  const n = new URLSearchParams();
  for (const [o, a] of Object.entries(t)) a !== void 0 && a !== "" && n.set(o, String(a));
  const e = n.toString();
  return e ? `?${e}` : "";
}
function yt(t, n) {
  const e = t, o = e?.response?.data?.error ?? e?.data?.error;
  return typeof o == "string" && o ? o : typeof e?.message == "string" && e.message && !/status code|request failed/i.test(e.message) ? e.message : n;
}
const La = 200;
class Ea {
  constructor(n) {
    this.journalId = n;
  }
  base() {
    return `/api/v1/workspace/journals/${this.journalId}`;
  }
  /** Counts, the newest facts, agent positions, open spans and live editing sessions. */
  async state() {
    try {
      const n = qt({ limit: La, cursor_limit: 200, span_limit: 200, task_limit: 1, graph_limit: 1, artifact_limit: 1 }), { data: e } = await ut.get(`${this.base()}${n}`);
      if (!e.success) throw new Error(e.error || "failed to read the journal");
      return e.journal;
    } catch (n) {
      throw new Error(yt(n, "Couldn’t read this journal."));
    }
  }
  /**
   * The whole task tree, flattened. The state read carries one page of tasks,
   * so counts and searches are taken over the tree read instead.
   */
  async tasks(n = 5e3, e = 6) {
    try {
      const { data: o } = await ut.get(`${this.base()}/tree${qt({ depth: e, limit: n })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task tree");
      const a = [], r = (i, c) => {
        for (const p of i || []) {
          const { children: d, ...f } = p;
          a.push({ ...f, parent_task_id: f.parent_task_id || c }), d?.length && r(d, f.id);
        }
      };
      return r(o.tree?.children || []), { tasks: a, bounded: a.length >= n };
    } catch (o) {
      throw new Error(yt(o, "Couldn’t read this journal’s work."));
    }
  }
  /** One task with its parents, children, dependencies and the facts recorded on it. */
  async branch(n, e = 100) {
    try {
      const { data: o } = await ut.get(`${this.base()}/branch${qt({ task_id: n, fact_limit: e })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task");
      return o.branch;
    } catch (o) {
      throw new Error(yt(o, "Couldn’t open this task."));
    }
  }
  async event(n) {
    try {
      const { data: e } = await ut.get(`${this.base()}/events/${encodeURIComponent(n)}`);
      if (!e.success) throw new Error(e.error || "failed to read the fact");
      return e.event;
    } catch (e) {
      throw new Error(yt(e, "Couldn’t open this fact."));
    }
  }
  /** Facts across the whole journal that match by text or, when available, by meaning. */
  async recall(n, e = 30) {
    try {
      const { data: o } = await ut.post(`${this.base()}/search`, { query: n, limit: e });
      if (!o.success) throw new Error(o.error || "search failed");
      return o.events || [];
    } catch (o) {
      throw new Error(yt(o, "Couldn’t search this journal."));
    }
  }
  async health() {
    try {
      const { data: n } = await ut.get(`${this.base()}/health`);
      return n.success ? n.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
const Ma = { blocker: "blocker", question: "question" }, Pn = { blocked: 0, blocker: 1, question: 2, stalled: 3 };
function Na(t) {
  return t.event_type.replace(/^.*:/, "").toLowerCase();
}
function Ua(t, n) {
  return String(t.effective_state || t.lifecycle || "active").toLowerCase() === "active" && !t.superseded_by_event_id && !n.has(t.id);
}
function Da(t, n, e, o) {
  const a = new Map(t.map((d) => [d.id, d])), r = new Set(n.map((d) => d.supersedes_event_id || "").filter(Boolean)), i = [], c = /* @__PURE__ */ new Set(), p = (d) => {
    const f = d?.parent_task_id ? a.get(d.parent_task_id) : void 0;
    return f ? f.title : "";
  };
  for (const d of t)
    d.status === "blocked" && (c.add(d.id), i.push({ ref: { kind: "task", id: d.id }, reason: "blocked", title: d.title, detail: p(d), at: d.updated_at }));
  for (const d of n) {
    const f = Ma[Na(d)];
    if (!f || !Ua(d, r)) continue;
    const g = d.task_id ? a.get(d.task_id) : void 0;
    g && Et(g.status) || i.push({
      ref: { kind: "fact", id: d.id },
      reason: f,
      title: d.title || d.body || "Untitled",
      detail: g?.title || bt(d.actor_id || "").label,
      at: d.ts
    });
  }
  for (const d of e.resumable) {
    if (c.has(d.task_id)) continue;
    const f = d.task_updated_at || a.get(d.task_id)?.updated_at || 0;
    Zt(f, o).tier !== "live" && (c.add(d.task_id), i.push({ ref: { kind: "task", id: d.task_id }, reason: "stalled", title: d.task_title || a.get(d.task_id)?.title || "Untitled task", detail: p(a.get(d.task_id)), at: f }));
  }
  return i.sort((d, f) => Pn[d.reason] - Pn[f.reason] || f.at - d.at);
}
function qa(t, n) {
  const e = new Set(n.filter((a) => a.ref.kind === "task").map((a) => a.ref.id)), o = /* @__PURE__ */ new Map();
  for (const a of t.leases)
    e.has(a.task_id) || o.has(a.task_id) || o.set(a.task_id, {
      ref: { kind: "task", id: a.task_id },
      title: a.task_title || "Untitled task",
      detail: `${bt(a.agent_id).label} · ${a.capability === "WRITE" ? "editing" : "planning"}`,
      at: a.issued_at
    });
  return [...o.values()].sort((a, r) => r.at - a.at);
}
function Fa(t, n, e) {
  const o = [];
  for (const a of [...t].sort((r, i) => i.seq - r.seq)) {
    const r = wo(a.ts, e);
    let i = o[o.length - 1];
    (!i || i.day !== r) && (i = { day: r, events: [] }, o.push(i)), i.events.push({ ...a, fresh: n !== null && a.seq > n });
  }
  return o;
}
function Ka(t, n) {
  return n === null ? 0 : t.filter((e) => e.seq > n).length;
}
function Ha(t, n, e = 20) {
  const o = n.toLowerCase().split(/\s+/).filter(Boolean);
  return o.length ? t.filter((a) => {
    const r = `${a.title} ${a.description || ""}`.toLowerCase();
    return o.every((i) => r.includes(i));
  }).sort((a, r) => Number(Et(a.status)) - Number(Et(r.status)) || r.updated_at - a.updated_at).slice(0, e) : [];
}
const xn = {
  now: 0,
  leases: [],
  resumable: [],
  counts: { active: 0, write: 0, planning: 0, resumable: 0 },
  limit: 100,
  has_more: !1
};
function qn(t) {
  return `chestor.journal.seen:${t}`;
}
function Ra(t) {
  try {
    const n = Number(localStorage.getItem(qn(t)));
    return Number.isFinite(n) && n > 0 ? n : null;
  } catch {
    return null;
  }
}
function Wa(t, n) {
  try {
    n > 0 && localStorage.setItem(qn(t), String(n));
  } catch {
  }
}
function Ft(t, n) {
  return t instanceof Error ? t.message : n;
}
function Va(t) {
  const n = x(() => new Ea(t.value)), e = rt([]), o = O(!1), a = rt([]), r = O(!1), i = rt(xn), c = rt([]), p = rt([]), d = O({ status: "unknown" }), f = O(!0), g = O(!1), $ = O(""), P = O(null), j = O(Math.floor(Date.now() / 1e3)), k = O(""), C = rt([]), v = O(!1), E = O(""), F = O(null), z = O([]), R = rt(null), et = O(!1), Q = O("");
  let it, X, gt, lt = 0, ot = 0;
  const jt = [], ft = x(() => Da(e.value, a.value, i.value, j.value)), dt = x(() => qa(i.value, ft.value)), Mt = x(() => Fa(a.value, P.value, j.value)), zt = x(() => Ka(a.value, P.value)), Nt = x(() => Uo(No(c.value, p.value, j.value))), ht = x(() => oa(e.value, j.value)), Ut = x(() => Ha(e.value, k.value)), ct = x(() => new Map(e.value.map((A) => [A.id, A])));
  async function vt() {
    const [A, L, J] = await Promise.all([n.value.state(), n.value.tasks(), n.value.health()]);
    e.value = L.tasks, o.value = L.bounded, a.value = A.events || [], r.value = A.event_page?.has_more === !0, i.value = A.work_control || xn, c.value = A.cursors?.items || [], p.value = A.spans?.items || [], d.value = J, g.value || (P.value = Ra(t.value)), Wa(t.value, A.stats?.last_seq || 0), g.value = !0;
  }
  async function H() {
    if (!t.value) {
      $.value = "Journal entry id is required.", f.value = !1;
      return;
    }
    f.value = !0;
    try {
      await vt(), $.value = "";
    } catch (A) {
      $.value = Ft(A, "Couldn’t read this journal.");
    } finally {
      f.value = !1;
    }
  }
  async function M() {
    if (!(!t.value || f.value))
      try {
        await vt(), F.value?.kind === "task" && await Dt(F.value, !0);
      } catch {
      }
  }
  let tt = [];
  function Fn(A) {
    return tt.find((L) => L.id === A);
  }
  function an() {
    tt = [...a.value, ...C.value, ...R.value?.kind === "task" ? R.value.branch.facts : []];
  }
  async function Dt(A, L = !1) {
    const J = ++ot;
    L || (et.value = !0, Q.value = "");
    try {
      let mt;
      if (A.kind === "task" ? mt = { kind: "task", branch: await n.value.branch(A.id) } : mt = { kind: "fact", event: Fn(A.id) || await n.value.event(A.id) }, J !== ot) return;
      R.value = mt, Q.value = "";
    } catch (mt) {
      J === ot && !L && (Q.value = Ft(mt, "Couldn’t open this item."));
    } finally {
      J === ot && (et.value = !1);
    }
  }
  function sn(A, L = !1) {
    z.value = L && F.value ? [...z.value, F.value] : [], an(), F.value = A, R.value = null, Dt(A);
  }
  function Kn() {
    const A = z.value[z.value.length - 1];
    A && (z.value = z.value.slice(0, -1), an(), F.value = A, R.value = null, Dt(A));
  }
  function ln() {
    ot++, z.value = [], F.value = null, R.value = null, Q.value = "", et.value = !1;
  }
  function Hn(A) {
    const L = Do(A, p.value);
    L && sn({ kind: "task", id: L });
  }
  async function Rn() {
    const A = k.value.trim(), L = ++lt;
    if (!A) {
      C.value = [], v.value = !1, E.value = "";
      return;
    }
    v.value = !0;
    try {
      const J = await n.value.recall(A);
      if (L !== lt) return;
      C.value = J, E.value = "";
    } catch (J) {
      L === lt && (C.value = [], E.value = Ft(J, "Search failed."));
    } finally {
      L === lt && (v.value = !1);
    }
  }
  return cn(k, () => {
    clearTimeout(it), it = setTimeout(Rn, 300);
  }), cn(t, () => {
    g.value = !1, ln(), H();
  }), _n(() => {
    jt.push(re(`kickside.thread.${t.value}.projection.chestor.journal:state`, () => {
      M();
    })), gt = setInterval(M, 15e3), X = setInterval(() => {
      j.value = Math.floor(Date.now() / 1e3);
    }, 3e4);
  }), jn(() => {
    clearTimeout(it), gt && clearInterval(gt), X && clearInterval(X);
    for (const A of jt) A();
  }), {
    tasks: e,
    tasksBounded: o,
    events: a,
    eventsHasMore: r,
    health: d,
    loading: f,
    loaded: g,
    error: $,
    clock: j,
    seenSeq: P,
    needs: ft,
    working: dt,
    days: Mt,
    fresh: zt,
    agents: Nt,
    quiet: ht,
    taskById: ct,
    query: k,
    matchedTasks: Ut,
    matchedFacts: C,
    searching: v,
    searchError: E,
    selected: F,
    trail: z,
    detail: R,
    detailLoading: et,
    detailError: Q,
    load: H,
    refresh: M,
    open: sn,
    back: Kn,
    close: ln,
    openAgent: Hn
  };
}
const Ja = {
  key: 0,
  class: "kx-loading kx-loading-centered"
}, Ga = { class: "kx-loading-inner" }, Ya = {
  key: 2,
  class: "kx-shell jr-shell"
}, Za = { class: "jr-rail-search" }, Qa = { class: "kx-main" }, Xa = { class: "kx-main-scroll" }, ts = /* @__PURE__ */ V({
  __name: "JournalApp",
  setup(t) {
    const n = Gn(), e = x(() => n.value?.entryId || ""), o = x(() => (n.value?.mode || "preview") === "preview"), a = Va(e), {
      loading: r,
      loaded: i,
      error: c,
      health: p,
      clock: d,
      seenSeq: f,
      eventsHasMore: g,
      tasksBounded: $,
      needs: P,
      working: j,
      days: k,
      fresh: C,
      agents: v,
      quiet: E,
      taskById: F,
      query: z,
      matchedTasks: R,
      matchedFacts: et,
      searching: Q,
      searchError: it,
      selected: X,
      trail: gt,
      detail: lt,
      detailLoading: ot,
      detailError: jt,
      load: ft,
      open: dt,
      back: Mt,
      close: zt,
      openAgent: Nt
    } = a;
    Yn(ft);
    const ht = O(null), Ut = x(() => p.value.status === "degraded");
    function ct(H) {
      return H && F.value.get(H)?.title || "";
    }
    function vt(H) {
      const M = H.composedPath()[0];
      M && ["INPUT", "TEXTAREA"].includes(M.tagName) || (H.key === "/" ? (H.preventDefault(), ht.value?.focus()) : H.key === "Escape" && X.value && zt());
    }
    return _n(() => window.addEventListener("keydown", vt)), jn(() => window.removeEventListener("keydown", vt)), (H, M) => (s(), u("div", {
      class: D(["jr", { compact: o.value }])
    }, [
      !l(i) && l(r) ? (s(), u("div", Ja, [
        b("div", Ga, [
          T(l(G), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          M[3] || (M[3] = q("Opening the journal…", -1))
        ])
      ])) : l(i) ? (s(), u("div", Ya, [
        o.value ? h("", !0) : (s(), m(io, {
          key: 0,
          title: "Journal"
        }, {
          toolbar: _(() => [
            b("div", Za, [
              T(An, {
                ref_key: "searchBox",
                ref: ht,
                modelValue: l(z),
                "onUpdate:modelValue": M[0] || (M[0] = (tt) => un(z) ? z.value = tt : null)
              }, null, 8, ["modelValue"])
            ])
          ]),
          default: _(() => [
            T(Cn, {
              needs: l(P),
              working: l(j),
              query: l(z),
              "matched-tasks": l(R),
              "matched-facts": l(et),
              searching: l(Q),
              "search-error": l(it),
              selected: l(X),
              "task-title": ct,
              now: l(d),
              onOpen: l(dt)
            }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "selected", "now", "onOpen"])
          ]),
          _: 1
        })),
        b("main", Qa, [
          b("div", Xa, [
            l(c) ? (s(), m(l(Ot), {
              key: 0,
              severity: "error",
              closable: !1
            }, {
              default: _(() => [
                q(w(l(c)), 1)
              ]),
              _: 1
            })) : h("", !0),
            Ut.value ? (s(), m(l(Ot), {
              key: 1,
              severity: "warn",
              closable: !1
            }, {
              default: _(() => [
                q(" This journal is behind on processing new facts" + w(l(p).reasons?.length ? `: ${l(p).reasons.join(", ")}` : "") + ". What you see may be out of date. ", 1)
              ]),
              _: 1
            })) : h("", !0),
            l($) ? (s(), m(l(Ot), {
              key: 2,
              severity: "secondary",
              closable: !1
            }, {
              default: _(() => [
                q(" This journal holds more tasks than the page reads at once; search and counts cover the first " + w(l(F).size.toLocaleString()) + ". ", 1)
              ]),
              _: 1
            })) : h("", !0),
            l(X) ? (s(), m(rr, {
              key: 3,
              detail: l(lt),
              loading: l(ot),
              error: l(jt),
              "can-back": l(gt).length > 0,
              "task-title": ct,
              now: l(d),
              onOpen: M[1] || (M[1] = (tt) => l(dt)(tt, !0)),
              onBack: l(Mt),
              onClose: l(zt)
            }, null, 8, ["detail", "loading", "error", "can-back", "now", "onBack", "onClose"])) : (s(), u(S, { key: 4 }, [
              o.value ? (s(), u(S, { key: 0 }, [
                T(An, {
                  ref_key: "searchBox",
                  ref: ht,
                  modelValue: l(z),
                  "onUpdate:modelValue": M[2] || (M[2] = (tt) => un(z) ? z.value = tt : null)
                }, null, 8, ["modelValue"]),
                T(Cn, {
                  needs: l(P),
                  working: l(j),
                  query: l(z),
                  "matched-tasks": l(R),
                  "matched-facts": l(et),
                  searching: l(Q),
                  "search-error": l(it),
                  selected: l(X),
                  "task-title": ct,
                  now: l(d),
                  onOpen: l(dt)
                }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "selected", "now", "onOpen"])
              ], 64)) : h("", !0),
              !o.value || !l(z).trim() ? (s(), m(Aa, {
                key: 1,
                days: l(k),
                fresh: l(C),
                visited: l(f) !== null,
                "more-history": l(g),
                agents: l(v),
                quiet: l(E),
                "task-title": ct,
                now: l(d),
                onOpen: l(dt),
                onAgent: l(Nt)
              }, null, 8, ["days", "fresh", "visited", "more-history", "agents", "quiet", "now", "onOpen", "onAgent"])) : h("", !0)
            ], 64))
          ])
        ])
      ])) : (s(), m(Bt, {
        key: 1,
        icon: "tabler:alert-triangle",
        title: "Journal is unavailable",
        hint: l(c),
        cta: "Try again",
        "cta-icon": "tabler:refresh",
        onCta: l(ft)
      }, null, 8, ["hint", "onCta"]))
    ], 2));
  }
}), as = {
  rootComponent: ts,
  plugins: [Zn]
};
export {
  as as mountConfig
};
//# sourceMappingURL=lazy-mount-CvsFKvV-.js.map
