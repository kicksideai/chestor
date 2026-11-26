import { s as $e, B as Tt, R as xe, a as _t, f as lt, b as Se, c as Ue, u as Ve, d as We, P as He } from "./wc-runtime-2ob_4l37.js";
import { openBlock as s, createElementBlock as p, mergeProps as S, createElementVNode as g, resolveComponent as Yt, resolveDirective as Ce, createBlock as y, Transition as Ke, withCtx as Q, renderSlot as q, normalizeClass as H, resolveDynamicComponent as At, createCommentVNode as f, withDirectives as te, createTextVNode as D, toDisplayString as v, defineComponent as K, createVNode as I, unref as d, createSlots as Ye, useId as Je, ref as A, Fragment as j, renderList as E, computed as $, useModel as Ge, withKeys as Qe, vModelText as Ze, shallowRef as it, watch as Vt, onMounted as je, onBeforeUnmount as Te, isRef as le, nextTick as Xe } from "vue";
import { Icon as R } from "@iconify/vue";
import { api as bt, on as tn } from "@wippy-fe/proxy";
var _e = {
  name: "TimesIcon",
  extends: $e
};
function en(t) {
  return an(t) || rn(t) || on(t) || nn();
}
function nn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function on(t, e) {
  if (t) {
    if (typeof t == "string") return Jt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Jt(t, e) : void 0;
  }
}
function rn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function an(t) {
  if (Array.isArray(t)) return Jt(t);
}
function Jt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function sn(t, e, n, o, a, r) {
  return s(), p("svg", S({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), en(e[0] || (e[0] = [g("path", {
    d: "M8.01186 7.00933L12.27 2.75116C12.341 2.68501 12.398 2.60524 12.4375 2.51661C12.4769 2.42798 12.4982 2.3323 12.4999 2.23529C12.5016 2.13827 12.4838 2.0419 12.4474 1.95194C12.4111 1.86197 12.357 1.78024 12.2884 1.71163C12.2198 1.64302 12.138 1.58893 12.0481 1.55259C11.9581 1.51625 11.8617 1.4984 11.7647 1.50011C11.6677 1.50182 11.572 1.52306 11.4834 1.56255C11.3948 1.60204 11.315 1.65898 11.2488 1.72997L6.99067 5.98814L2.7325 1.72997C2.59553 1.60234 2.41437 1.53286 2.22718 1.53616C2.03999 1.53946 1.8614 1.61529 1.72901 1.74767C1.59663 1.88006 1.5208 2.05865 1.5175 2.24584C1.5142 2.43303 1.58368 2.61419 1.71131 2.75116L5.96948 7.00933L1.71131 11.2675C1.576 11.403 1.5 11.5866 1.5 11.7781C1.5 11.9696 1.576 12.1532 1.71131 12.2887C1.84679 12.424 2.03043 12.5 2.2219 12.5C2.41338 12.5 2.59702 12.424 2.7325 12.2887L6.99067 8.03052L11.2488 12.2887C11.3843 12.424 11.568 12.5 11.7594 12.5C11.9509 12.5 12.1346 12.424 12.27 12.2887C12.4053 12.1532 12.4813 11.9696 12.4813 11.7781C12.4813 11.5866 12.4053 11.403 12.27 11.2675L8.01186 7.00933Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
_e.render = sn;
var ln = `
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
`, dn = {
  root: function(e) {
    var n = e.props;
    return ["p-message p-component p-message-" + n.severity, {
      "p-message-outlined": n.variant === "outlined",
      "p-message-simple": n.variant === "simple",
      "p-message-sm": n.size === "small",
      "p-message-lg": n.size === "large"
    }];
  },
  contentWrapper: "p-message-content-wrapper",
  content: "p-message-content",
  icon: "p-message-icon",
  text: "p-message-text",
  closeButton: "p-message-close-button",
  closeIcon: "p-message-close-icon"
}, un = Tt.extend({
  name: "message",
  style: ln,
  classes: dn
}), cn = {
  name: "BaseMessage",
  extends: _t,
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
  style: un,
  provide: function() {
    return {
      $pcMessage: this,
      $parentInstance: this
    };
  }
};
function kt(t) {
  "@babel/helpers - typeof";
  return kt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, kt(t);
}
function de(t, e, n) {
  return (e = bn(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function bn(t) {
  var e = pn(t, "string");
  return kt(e) == "symbol" ? e : e + "";
}
function pn(t, e) {
  if (kt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (kt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Bt = {
  name: "Message",
  extends: cn,
  inheritAttrs: !1,
  emits: ["close", "life-end"],
  timeout: null,
  data: function() {
    return {
      visible: !0
    };
  },
  mounted: function() {
    var e = this;
    this.life && setTimeout(function() {
      e.visible = !1, e.$emit("life-end");
    }, this.life);
  },
  methods: {
    close: function(e) {
      this.visible = !1, this.$emit("close", e);
    }
  },
  computed: {
    closeAriaLabel: function() {
      return this.$primevue.config.locale.aria ? this.$primevue.config.locale.aria.close : void 0;
    },
    dataP: function() {
      return lt(de(de({
        outlined: this.variant === "outlined",
        simple: this.variant === "simple"
      }, this.severity, this.severity), this.size, this.size));
    }
  },
  directives: {
    ripple: xe
  },
  components: {
    TimesIcon: _e
  }
};
function wt(t) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, wt(t);
}
function ue(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(t);
    e && (o = o.filter(function(a) {
      return Object.getOwnPropertyDescriptor(t, a).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function ce(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ue(Object(n), !0).forEach(function(o) {
      gn(t, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ue(Object(n)).forEach(function(o) {
      Object.defineProperty(t, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return t;
}
function gn(t, e, n) {
  return (e = fn(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function fn(t) {
  var e = hn(t, "string");
  return wt(e) == "symbol" ? e : e + "";
}
function hn(t, e) {
  if (wt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (wt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var vn = ["data-p"], mn = ["data-p"], yn = ["data-p"], kn = ["aria-label", "data-p"], wn = ["data-p"];
function $n(t, e, n, o, a, r) {
  var u = Yt("TimesIcon"), i = Ce("ripple");
  return s(), y(Ke, S({
    name: "p-message",
    appear: ""
  }, t.ptmi("transition")), {
    default: Q(function() {
      return [a.visible ? (s(), p("div", S({
        key: 0,
        class: t.cx("root"),
        role: "alert",
        "aria-live": "assertive",
        "aria-atomic": "true",
        "data-p": r.dataP
      }, t.ptm("root")), [g("div", S({
        class: t.cx("contentWrapper")
      }, t.ptm("contentWrapper")), [t.$slots.container ? q(t.$slots, "container", {
        key: 0,
        closeCallback: r.close
      }) : (s(), p("div", S({
        key: 1,
        class: t.cx("content"),
        "data-p": r.dataP
      }, t.ptm("content")), [q(t.$slots, "icon", {
        class: H(t.cx("icon"))
      }, function() {
        return [(s(), y(At(t.icon ? "span" : null), S({
          class: [t.cx("icon"), t.icon],
          "data-p": r.dataP
        }, t.ptm("icon")), null, 16, ["class", "data-p"]))];
      }), t.$slots.default ? (s(), p("div", S({
        key: 0,
        class: t.cx("text"),
        "data-p": r.dataP
      }, t.ptm("text")), [q(t.$slots, "default")], 16, yn)) : f("", !0), t.closable ? te((s(), p("button", S({
        key: 1,
        class: t.cx("closeButton"),
        "aria-label": r.closeAriaLabel,
        type: "button",
        onClick: e[0] || (e[0] = function(l) {
          return r.close(l);
        }),
        "data-p": r.dataP
      }, ce(ce({}, t.closeButtonProps), t.ptm("closeButton"))), [q(t.$slots, "closeicon", {}, function() {
        return [t.closeIcon ? (s(), p("i", S({
          key: 0,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, wn)) : (s(), y(u, S({
          key: 1,
          class: [t.cx("closeIcon"), t.closeIcon],
          "data-p": r.dataP
        }, t.ptm("closeIcon")), null, 16, ["class", "data-p"]))];
      })], 16, kn)), [[i]]) : f("", !0)], 16, mn))], 16)], 16, vn)) : f("", !0)];
    }),
    _: 3
  }, 16);
}
Bt.render = $n;
var Ae = {
  name: "SpinnerIcon",
  extends: $e
};
function xn(t) {
  return Tn(t) || jn(t) || Cn(t) || Sn();
}
function Sn() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Cn(t, e) {
  if (t) {
    if (typeof t == "string") return Gt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Gt(t, e) : void 0;
  }
}
function jn(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Tn(t) {
  if (Array.isArray(t)) return Gt(t);
}
function Gt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, o = Array(e); n < e; n++) o[n] = t[n];
  return o;
}
function _n(t, e, n, o, a, r) {
  return s(), p("svg", S({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, t.pti()), xn(e[0] || (e[0] = [g("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
Ae.render = _n;
var An = `
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
`, Pn = {
  root: function(e) {
    var n = e.props, o = e.instance;
    return ["p-badge p-component", {
      "p-badge-circle": Ue(n.value) && String(n.value).length === 1,
      "p-badge-dot": Se(n.value) && !o.$slots.default,
      "p-badge-sm": n.size === "small",
      "p-badge-lg": n.size === "large",
      "p-badge-xl": n.size === "xlarge",
      "p-badge-info": n.severity === "info",
      "p-badge-success": n.severity === "success",
      "p-badge-warn": n.severity === "warn",
      "p-badge-danger": n.severity === "danger",
      "p-badge-secondary": n.severity === "secondary",
      "p-badge-contrast": n.severity === "contrast"
    }];
  }
}, In = Tt.extend({
  name: "badge",
  style: An,
  classes: Pn
}), zn = {
  name: "BaseBadge",
  extends: _t,
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
  style: In,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function $t(t) {
  "@babel/helpers - typeof";
  return $t = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, $t(t);
}
function be(t, e, n) {
  return (e = On(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function On(t) {
  var e = Bn(t, "string");
  return $t(e) == "symbol" ? e : e + "";
}
function Bn(t, e) {
  if ($t(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if ($t(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Pe = {
  name: "Badge",
  extends: zn,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return lt(be(be({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, qn = ["data-p"];
function Mn(t, e, n, o, a, r) {
  return s(), p("span", S({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [q(t.$slots, "default", {}, function() {
    return [D(v(t.value), 1)];
  })], 16, qn);
}
Pe.render = Mn;
var Ln = `
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
function xt(t) {
  "@babel/helpers - typeof";
  return xt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, xt(t);
}
function G(t, e, n) {
  return (e = En(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function En(t) {
  var e = Nn(t, "string");
  return xt(e) == "symbol" ? e : e + "";
}
function Nn(t, e) {
  if (xt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (xt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Dn = {
  root: function(e) {
    var n = e.instance, o = e.props;
    return ["p-button p-component", G(G(G(G(G(G(G(G(G({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(e) {
    var n = e.props;
    return ["p-button-icon", G({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, Fn = Tt.extend({
  name: "button",
  style: Ln,
  classes: Dn
}), Rn = {
  name: "BaseButton",
  extends: _t,
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
  style: Fn,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function St(t) {
  "@babel/helpers - typeof";
  return St = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, St(t);
}
function N(t, e, n) {
  return (e = Un(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Un(t) {
  var e = Vn(t, "string");
  return St(e) == "symbol" ? e : e + "";
}
function Vn(t, e) {
  if (St(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (St(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ee = {
  name: "Button",
  extends: Rn,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(e) {
      var n = e === "root" ? this.ptmi : this.ptm;
      return n(e, {
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
      return S(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Se(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return lt(N(N(N(N(N(N(N(N(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return lt(N(N({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return lt(N(N({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: Ae,
    Badge: Pe
  },
  directives: {
    ripple: xe
  }
}, Wn = ["data-p"], Hn = ["data-p"];
function Kn(t, e, n, o, a, r) {
  var u = Yt("SpinnerIcon"), i = Yt("Badge"), l = Ce("ripple");
  return t.asChild ? q(t.$slots, "default", {
    key: 1,
    class: H(t.cx("root")),
    a11yAttrs: r.a11yAttrs
  }) : te((s(), y(At(t.as), S({
    key: 0,
    class: t.cx("root"),
    "data-p": r.dataP
  }, r.attrs), {
    default: Q(function() {
      return [q(t.$slots, "default", {}, function() {
        return [t.loading ? q(t.$slots, "loadingicon", S({
          key: 0,
          class: [t.cx("loadingIcon"), t.cx("icon")]
        }, t.ptm("loadingIcon")), function() {
          return [t.loadingIcon ? (s(), p("span", S({
            key: 0,
            class: [t.cx("loadingIcon"), t.cx("icon"), t.loadingIcon]
          }, t.ptm("loadingIcon")), null, 16)) : (s(), y(u, S({
            key: 1,
            class: [t.cx("loadingIcon"), t.cx("icon")],
            spin: ""
          }, t.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : q(t.$slots, "icon", S({
          key: 1,
          class: [t.cx("icon")]
        }, t.ptm("icon")), function() {
          return [t.icon ? (s(), p("span", S({
            key: 0,
            class: [t.cx("icon"), t.icon, t.iconClass],
            "data-p": r.dataIconP
          }, t.ptm("icon")), null, 16, Wn)) : f("", !0)];
        }), t.label ? (s(), p("span", S({
          key: 2,
          class: t.cx("label")
        }, t.ptm("label"), {
          "data-p": r.dataLabelP
        }), v(t.label), 17, Hn)) : f("", !0), t.badge ? (s(), y(i, {
          key: 3,
          value: t.badge,
          class: H(t.badgeClass),
          severity: t.badgeSeverity,
          unstyled: t.unstyled,
          pt: t.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : f("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[l]]);
}
ee.render = Kn;
const Yn = { class: "kx-empty" }, Jn = { class: "kx-empty-ico" }, Gn = { class: "kx-empty-title" }, Qn = {
  key: 0,
  class: "kx-empty-sub"
}, qt = /* @__PURE__ */ K({
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
    return (e, n) => (s(), p("div", Yn, [
      g("div", Jn, [
        I(d(R), {
          icon: t.icon,
          "aria-hidden": "true"
        }, null, 8, ["icon"])
      ]),
      g("div", Gn, v(t.title), 1),
      t.hint || e.$slots.hint ? (s(), p("p", Qn, [
        q(e.$slots, "hint", {}, () => [
          D(v(t.hint), 1)
        ])
      ])) : f("", !0),
      t.cta ? (s(), y(d(ee), {
        key: 1,
        label: t.cta,
        onClick: n[0] || (n[0] = (o) => e.$emit("cta"))
      }, Ye({ _: 2 }, [
        t.ctaIcon ? {
          name: "icon",
          fn: Q(({ class: o }) => [
            I(d(R), {
              icon: t.ctaIcon,
              class: H(o),
              "aria-hidden": "true"
            }, null, 8, ["icon", "class"])
          ]),
          key: "0"
        } : void 0
      ]), 1032, ["label"])) : f("", !0)
    ]));
  }
}), Zn = ["aria-labelledby"], Xn = { class: "kx-railhead" }, to = ["id"], eo = { key: 0 }, no = { class: "kx-railhead-acts" }, oo = { class: "kx-rail-body" }, ro = /* @__PURE__ */ K({
  __name: "ListRail",
  props: {
    title: {},
    count: {},
    settings: { type: Boolean }
  },
  setup(t) {
    const e = Je();
    return (n, o) => (s(), p("aside", {
      class: H(["kx-rail", { "kx-settings-list-rail": t.settings }]),
      "aria-labelledby": d(e)
    }, [
      g("div", Xn, [
        g("span", {
          id: d(e),
          class: "kx-railhead-title"
        }, [
          D(v(t.title), 1),
          t.count !== void 0 ? (s(), p("b", eo, v(t.count), 1)) : f("", !0)
        ], 8, to),
        g("div", no, [
          q(n.$slots, "actions")
        ])
      ]),
      q(n.$slots, "toolbar"),
      g("div", oo, [
        q(n.$slots, "default")
      ])
    ], 10, Zn));
  }
}), ao = { class: "system-section-head" }, so = { class: "system-section-head-text" }, io = {
  key: 0,
  class: "kx-head-actions"
}, Ie = /* @__PURE__ */ K({
  __name: "SettingsSectionHead",
  props: {
    title: {},
    description: {}
  },
  setup(t) {
    return (e, n) => (s(), p("header", ao, [
      g("div", so, [
        g("h1", null, v(t.title), 1),
        g("p", null, v(t.description), 1)
      ]),
      e.$slots.actions ? (s(), p("div", io, [
        q(e.$slots, "actions")
      ])) : f("", !0)
    ]));
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
`, uo = {
  root: function(e) {
    var n = e.props;
    return ["p-tag p-component", {
      "p-tag-info": n.severity === "info",
      "p-tag-success": n.severity === "success",
      "p-tag-warn": n.severity === "warn",
      "p-tag-danger": n.severity === "danger",
      "p-tag-secondary": n.severity === "secondary",
      "p-tag-contrast": n.severity === "contrast",
      "p-tag-rounded": n.rounded
    }];
  },
  icon: "p-tag-icon",
  label: "p-tag-label"
}, co = Tt.extend({
  name: "tag",
  style: lo,
  classes: uo
}), bo = {
  name: "BaseTag",
  extends: _t,
  props: {
    value: null,
    severity: null,
    rounded: Boolean,
    icon: String
  },
  style: co,
  provide: function() {
    return {
      $pcTag: this,
      $parentInstance: this
    };
  }
};
function Ct(t) {
  "@babel/helpers - typeof";
  return Ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ct(t);
}
function po(t, e, n) {
  return (e = go(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function go(t) {
  var e = fo(t, "string");
  return Ct(e) == "symbol" ? e : e + "";
}
function fo(t, e) {
  if (Ct(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (Ct(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var pt = {
  name: "Tag",
  extends: bo,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return lt(po({
        rounded: this.rounded
      }, this.severity, this.severity));
    }
  }
}, ho = ["data-p"];
function vo(t, e, n, o, a, r) {
  return s(), p("span", S({
    class: t.cx("root"),
    "data-p": r.dataP
  }, t.ptmi("root")), [t.$slots.icon ? (s(), y(At(t.$slots.icon), S({
    key: 0,
    class: t.cx("icon")
  }, t.ptm("icon")), null, 16, ["class"])) : t.icon ? (s(), p("span", S({
    key: 1,
    class: [t.cx("icon"), t.icon]
  }, t.ptm("icon")), null, 16)) : f("", !0), t.value != null || t.$slots.default ? q(t.$slots, "default", {
    key: 2
  }, function() {
    return [g("span", S({
      class: t.cx("label")
    }, t.ptm("label")), v(t.value), 17)];
  }) : f("", !0)], 16, ho);
}
pt.render = vo;
const ne = "Task not loaded";
function gt(t, e) {
  if (!t) return "";
  const n = Math.max(0, Math.floor(e - t));
  return n < 60 ? "just now" : n < 3600 ? `${Math.floor(n / 60)}m ago` : n < 86400 ? `${Math.floor(n / 3600)}h ago` : `${Math.floor(n / 86400)}d ago`;
}
function oe(t) {
  return t ? new Date(t * 1e3).toLocaleString([], { dateStyle: "medium", timeStyle: "short" }) : "";
}
function mo(t, e) {
  const n = new Date(t * 1e3), o = new Date(e * 1e3), a = new Date(o.getFullYear(), o.getMonth(), o.getDate()).getTime() / 1e3;
  if (t >= a) return "Today";
  const r = new Date(o.getFullYear(), o.getMonth(), o.getDate() - 1).getTime() / 1e3;
  return t >= r ? "Yesterday" : n.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" });
}
function ze(t) {
  const e = t.replace(/^.*:/, "").replace(/[._-]+/g, " ").trim();
  return e ? e.charAt(0).toUpperCase() + e.slice(1) : "";
}
function Lt(t) {
  return ze(t) || "Note";
}
function yt(t) {
  return ze(t) || "Open";
}
function Qt(t) {
  const e = String(t || "").toLowerCase();
  return e === "blocked" ? "danger" : e === "in_progress" ? "info" : ["done", "closed", "completed", "resolved"].includes(e) ? "success" : "secondary";
}
function re(t) {
  const e = t.replace(/^.*:/, "").toLowerCase();
  return e === "blocker" || e === "risk" ? "danger" : e === "question" || e === "handoff" ? "warn" : e === "decision" || e === "milestone" ? "success" : "secondary";
}
const yo = ["aria-current"], ko = { class: "jr-row-main" }, wo = { class: "jr-row-line" }, $o = { class: "jr-row-title" }, xo = ["title"], So = {
  key: 0,
  class: "jr-row-line"
}, Co = {
  key: 1,
  class: "jr-row-detail"
}, Z = /* @__PURE__ */ K({
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
    return (e, n) => (s(), p("button", {
      type: "button",
      class: H(["jr-row", { fresh: t.fresh }]),
      "aria-current": t.active ? "true" : void 0,
      onClick: n[0] || (n[0] = (o) => e.$emit("open"))
    }, [
      g("span", ko, [
        g("span", wo, [
          g("span", $o, v(t.title), 1),
          t.at ? (s(), p("time", {
            key: 0,
            class: "jr-row-time",
            title: d(oe)(t.at)
          }, v(d(gt)(t.at, t.now)), 9, xo)) : f("", !0)
        ]),
        t.detail || t.tag ? (s(), p("span", So, [
          t.tag ? (s(), y(d(pt), {
            key: 0,
            value: t.tag,
            severity: t.severity || "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value", "severity"])) : f("", !0),
          t.detail ? (s(), p("span", Co, v(t.detail), 1)) : f("", !0)
        ])) : f("", !0)
      ])
    ], 10, yo));
  }
}), pe = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i, ge = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
function jo(t) {
  let e = 2166136261;
  for (let n = 0; n < t.length; n++)
    e ^= t.charCodeAt(n), e = Math.imul(e, 16777619) >>> 0;
  return ge[e % 26] + ge[(e >>> 8) % 26];
}
function To(t) {
  const e = t.split(/\s+/).filter(Boolean);
  return e.length ? e.length === 1 ? e[0].slice(0, 2).toUpperCase() : (e[0][0] + e[1][0]).toUpperCase() : "??";
}
function Et(t) {
  const e = (t || "").trim(), n = (e.replace(/[^a-z0-9]/gi, "").slice(-6) || "unknown").toUpperCase(), o = e.replace(pe, " ").replace(/[-_.:/]+/g, " ").replace(/\s+/g, " ").trim(), a = !o || pe.test(e), r = o.length > 24 ? `${o.slice(0, 23)}…` : o, u = r ? r.charAt(0).toUpperCase() + r.slice(1) : "";
  return {
    label: u ? a ? `${u} ${n}` : u : `Agent ${n}`,
    initials: a ? jo(e || n) : To(r)
  };
}
const _o = 3600, Ao = 86400;
function Po(t, e) {
  const n = e - t;
  return n <= _o ? "now" : n <= Ao ? "today" : "older";
}
function Io(t, e) {
  const n = (t || "").trim();
  if (n) return n;
  const o = (e || "").trim();
  return o ? `cursor:${o}` : "";
}
function zo(t) {
  return t === "auto" ? "Position tracked while working" : "Recorded position";
}
function Oo(t) {
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
function Bo(t, e) {
  t.agentId = t.agentId || e.agentId, t.cursorId = t.cursorId || e.cursorId, t.origin = t.origin || e.origin, t.lastActivityAt = Math.max(t.lastActivityAt, e.lastActivityAt), t.lastSeenSeq = Math.max(t.lastSeenSeq, e.lastSeenSeq), t.factCount += e.factCount, t.openSpans += e.openSpans, t.purpose = t.purpose || e.purpose, t.headline = t.headline || e.headline, e.lastTouch && e.lastTouch.seq > (t.lastTouch?.seq || 0) && (t.lastTouch = e.lastTouch), e.spanTask && e.spanTask.at > (t.spanTask?.at ?? -1) && (t.spanTask = e.spanTask);
}
function qo(t, e, n) {
  const o = /* @__PURE__ */ new Map(), a = /* @__PURE__ */ new Map();
  function r(i, l) {
    const c = [(i || "").trim(), l ? `cursor:${l.trim()}` : ""].filter(Boolean), b = Io(i, l) || `cursor:${o.size}`, w = [...new Set(c.map((P) => a.get(P)).filter(Boolean))], _ = w[0] || b, C = o.get(_) || Oo(_);
    o.set(_, C);
    for (const P of w.slice(1)) {
      const z = o.get(P);
      z && (Bo(C, z), o.delete(P));
      for (const [W, m] of a) m === P && a.set(W, _);
    }
    for (const P of c) a.set(P, _);
    C.agentId = C.agentId || (i || "").trim(), C.cursorId = C.cursorId || (l || "").trim(), C.id = C.agentId || (C.cursorId ? `cursor:${C.cursorId}` : _);
    const M = Et(C.agentId || C.cursorId);
    return C.label = M.label, C.initials = M.initials, C;
  }
  for (const i of t) {
    const l = r(i.agent_id, i.cursor_id);
    l.origin = i.origin || l.origin, l.lastActivityAt = Math.max(l.lastActivityAt, i.updated_at), l.lastSeenSeq = Math.max(l.lastSeenSeq, i.last_seen_seq || 0), l.purpose = i.purpose || i.checkpoint?.headline || l.purpose, l.headline = i.last_touch?.title || l.headline, i.last_touch && i.last_touch.seq > (l.lastTouch?.seq || 0) && (l.lastTouch = i.last_touch);
  }
  for (const i of [...e].sort((l, c) => l.last_activity_at - c.last_activity_at)) {
    const l = r(i.agent_id, i.cursor_id);
    l.origin = i.origin || l.origin, l.lastActivityAt = Math.max(l.lastActivityAt, i.last_activity_at, i.ended_at || 0), l.lastSeenSeq = Math.max(l.lastSeenSeq, i.last_seq || 0), l.factCount += i.fact_count || 0, i.state === "open" && (l.openSpans += 1), l.purpose = i.working_on?.text || l.purpose, l.headline = i.last_fact?.title || l.headline;
    const c = i.working_on?.task_id || i.task_id || i.last_fact?.task_id;
    c && (l.spanTask = { id: c, at: i.last_activity_at });
  }
  const u = [...o.values()];
  for (const i of u)
    i.working = i.openSpans > 0, i.liveness = Po(i.lastActivityAt, n), i.purpose = i.purpose || i.headline || zo(i.origin);
  return u.sort((i, l) => l.lastActivityAt - i.lastActivityAt || i.label.localeCompare(l.label));
}
function Mo(t) {
  const e = { now: [], today: [], older: [] };
  for (const n of t) e[n.liveness].push(n);
  return e;
}
function Lo(t, e) {
  return t.spanTask?.id || e.get(t.lastTouch?.event_id || "") || "";
}
const Oe = {
  "task.updated": "Updated",
  "task.closed": "Closed",
  "task.focused": "Made the current focus",
  "task.transitioned": "Status changed",
  "verification.requested": "Verification requested",
  "verification.receipt": "Verification recorded",
  "digest.updated": "Summary refreshed",
  checkpoint: "Checkpoint saved",
  "audit.coverage": "Audit coverage recorded",
  integration: "Integration recorded",
  artifact: "File attached",
  "cursor.updated": "Agent position moved",
  "graph.operations.requested": "Map updated",
  "graph.configuration.requested": "Map settings changed",
  health: "Processing fell behind"
};
function Nt(t) {
  return t.event_type.replace(/^.*:/, "").toLowerCase();
}
function Dt(t) {
  return t === "task.linked" || t === "task.unlinked";
}
function ae(t) {
  const e = Nt(t);
  return !(e in Oe) && !Dt(e) && !!(t.title || t.body || "").trim();
}
function Eo(t) {
  return t.task_id || Dt(Nt(t)) && t.linked_task_ids?.[0] || "";
}
function No(t) {
  return t.replace(/[._-]+/g, " ").trim().toLowerCase() || "relates to";
}
function Be(t, e) {
  const n = Nt(t);
  if (Dt(n)) {
    const [o, a] = t.linked_task_ids || [], r = No(String(t.metadata?.relation || "")), u = e(o), i = e(a);
    return !u || !i ? n === "task.linked" ? "Two tasks were linked" : "Two tasks were unlinked" : n === "task.linked" ? `${u} now ${r} ${i}` : `${u} no longer ${r} ${i}`;
  }
  return Oe[n] || Lt(t.event_type);
}
function se(t, e) {
  return ae(t) ? (t.title || t.body || "").trim().split(`
`)[0] : Be(t, e);
}
function fe(t) {
  const e = /* @__PURE__ */ new Map();
  let n = !1;
  for (const a of t) {
    const r = Nt(a);
    if (r === "task.closed") {
      n = !0;
      continue;
    }
    const u = Dt(r) ? "link" : r === "task.updated" || r === "task.transitioned" ? "update" : "other change";
    e.set(u, (e.get(u) || 0) + 1);
  }
  const o = ["update", "link", "other change"].filter((a) => e.get(a)).map((a) => `${e.get(a)} ${a}${e.get(a) === 1 ? "" : "s"}`);
  return n && o.push("closed"), o.join(", ");
}
function Zt(t) {
  return t.actor_id ? Et(t.actor_id).label : "";
}
function qe(t, e) {
  const n = [], o = /* @__PURE__ */ new Map();
  for (const a of t) {
    const r = a.fresh === !0;
    if (ae(a)) {
      n.push({ kind: "fact", key: a.id, event: a, fresh: r, at: a.ts });
      continue;
    }
    const u = Eo(a), i = o.get(u);
    if (i) {
      i.events.push(a), i.fresh = i.fresh || r, i.at = Math.max(i.at, a.ts);
      continue;
    }
    const l = { kind: "changes", key: `${e}:${u}`, taskId: u, events: [a], fresh: r, at: a.ts };
    o.set(u, l), n.push(l);
  }
  return n;
}
const Do = ["aria-expanded", "onClick"], Fo = { class: "jr-row-main" }, Ro = { class: "jr-row-line" }, Uo = { class: "jr-row-detail" }, Vo = { class: "jr-fold-task" }, Wo = ["title"], Ho = {
  key: 0,
  class: "jr-fold-list"
}, Ko = { key: 0 }, Yo = ["onClick"], Me = /* @__PURE__ */ K({
  __name: "ChangeList",
  props: {
    entries: {},
    taskTitle: { type: Function },
    showTask: { type: Boolean },
    now: {}
  },
  emits: ["open"],
  setup(t) {
    const e = t, n = A(/* @__PURE__ */ new Set());
    function o(u) {
      const i = new Set(n.value);
      i.has(u) ? i.delete(u) : i.add(u), n.value = i;
    }
    function a(u) {
      return [Zt(u.event), e.showTask ? e.taskTitle(u.event.task_id) : ""].filter(Boolean).join(" · ");
    }
    function r(u) {
      return e.showTask ? e.taskTitle(u.taskId) || "Other updates" : fe(u.events);
    }
    return (u, i) => (s(!0), p(j, null, E(t.entries, (l) => (s(), p(j, {
      key: l.key
    }, [
      l.kind === "fact" ? (s(), y(Z, {
        key: 0,
        title: d(se)(l.event, t.taskTitle),
        detail: a(l),
        at: l.at,
        now: t.now,
        tag: d(Lt)(l.event.event_type),
        severity: d(re)(l.event.event_type),
        fresh: l.fresh,
        onOpen: (c) => u.$emit("open", { kind: "fact", id: l.event.id })
      }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "fresh", "onOpen"])) : (s(), p("div", {
        key: 1,
        class: H(["jr-fold", { open: n.value.has(l.key) }])
      }, [
        g("button", {
          type: "button",
          class: H(["jr-row jr-fold-head", { fresh: l.fresh }]),
          "aria-expanded": n.value.has(l.key),
          onClick: (c) => o(l.key)
        }, [
          I(d(R), {
            icon: "tabler:chevron-right",
            class: "jr-fold-chev",
            "aria-hidden": "true"
          }),
          g("span", Fo, [
            g("span", Ro, [
              g("span", Uo, [
                t.showTask ? (s(), p(j, { key: 0 }, [
                  g("span", Vo, v(r(l)), 1),
                  D(" · " + v(d(fe)(l.events)), 1)
                ], 64)) : (s(), p(j, { key: 1 }, [
                  D(v(r(l)), 1)
                ], 64))
              ]),
              g("time", {
                class: "jr-row-time",
                title: d(oe)(l.at)
              }, v(d(gt)(l.at, t.now)), 9, Wo)
            ])
          ])
        ], 10, Do),
        n.value.has(l.key) ? (s(), p("ul", Ho, [
          (s(!0), p(j, null, E(l.events, (c) => (s(), p("li", {
            key: c.id
          }, [
            g("span", null, v(d(Be)(c, t.taskTitle)), 1),
            g("small", null, v([d(Zt)(c), d(gt)(c.ts, t.now)].filter(Boolean).join(" · ")), 1)
          ]))), 128)),
          t.showTask && l.taskId && t.taskTitle(l.taskId) ? (s(), p("li", Ko, [
            g("button", {
              type: "button",
              class: "jr-link",
              onClick: (c) => u.$emit("open", { kind: "task", id: l.taskId })
            }, "Open " + v(t.taskTitle(l.taskId)), 9, Yo)
          ])) : f("", !0)
        ])) : f("", !0)
      ], 2))
    ], 64))), 128));
  }
}), Jo = {
  class: "jr-section",
  "aria-labelledby": "jr-changes"
}, he = 40, Go = /* @__PURE__ */ K({
  __name: "Changes",
  props: {
    days: {},
    fresh: {},
    visited: { type: Boolean },
    moreHistory: { type: Boolean },
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open"],
  setup(t) {
    const e = t, n = A(he), o = $(() => e.days.reduce((i, l) => i + l.entries.length, 0)), a = $(() => {
      let i = n.value;
      return e.days.flatMap((l) => {
        const c = i;
        i -= l.entries.length;
        const b = l.entries.filter((w, _) => _ < c || w.fresh);
        return b.length ? [{ day: l.day, entries: b }] : [];
      });
    }), r = $(() => a.value.reduce((i, l) => i + l.entries.length, 0) < o.value), u = $(() => o.value ? e.visited ? e.fresh ? `${e.fresh >= o.value && e.moreHistory ? `More than ${e.fresh}` : String(e.fresh)} new since your last visit.` : "Nothing new since your last visit." : "The latest facts recorded in this journal." : "Facts agents and people record appear here.");
    return (i, l) => (s(), p("section", Jo, [
      I(Ie, {
        id: "jr-changes",
        title: "What changed",
        description: u.value
      }, null, 8, ["description"]),
      o.value ? f("", !0) : (s(), y(qt, {
        key: 0,
        icon: "tabler:notes",
        title: "No facts yet",
        hint: "When an agent or a person records a fact in this journal, it shows up here."
      })),
      (s(!0), p(j, null, E(a.value, (c) => (s(), p("div", {
        key: c.day,
        class: "jr-block"
      }, [
        g("h2", null, v(c.day), 1),
        I(Me, {
          entries: c.entries,
          "task-title": t.taskTitle,
          "show-task": "",
          now: t.now,
          onOpen: l[0] || (l[0] = (b) => i.$emit("open", b))
        }, null, 8, ["entries", "task-title", "now"])
      ]))), 128)),
      r.value ? (s(), y(d(ee), {
        key: 1,
        class: "jr-more",
        label: "Show older",
        severity: "secondary",
        text: "",
        size: "small",
        onClick: l[1] || (l[1] = (c) => n.value += he)
      })) : f("", !0)
    ]));
  }
}), Qo = {
  class: "jr-detail",
  "aria-live": "polite"
}, Zo = { class: "jr-detail-head" }, Xo = { class: "jr-detail-titles" }, tr = {
  key: 0,
  class: "jr-path",
  "aria-label": "Part of"
}, er = ["onClick"], nr = {
  key: 1,
  class: "jr-path",
  "aria-label": "Task"
}, or = { class: "jr-title-line" }, rr = {
  key: 2,
  class: "jr-meta"
}, ar = {
  key: 3,
  class: "jr-meta"
}, sr = {
  key: 1,
  class: "kx-loading"
}, ir = {
  key: 0,
  class: "jr-body"
}, lr = {
  key: 1,
  class: "jr-block"
}, dr = {
  key: 2,
  class: "jr-block"
}, ur = {
  key: 3,
  class: "jr-block"
}, cr = {
  key: 4,
  class: "jr-block"
}, br = { class: "jr-count" }, pr = { class: "jr-block" }, gr = {
  key: 0,
  class: "jr-list-empty"
}, fr = {
  key: 0,
  class: "jr-tags"
}, hr = {
  key: 1,
  class: "jr-body"
}, vr = /* @__PURE__ */ K({
  __name: "ItemDetail",
  props: {
    detail: {},
    loading: { type: Boolean },
    error: {},
    canBack: { type: Boolean },
    compact: { type: Boolean },
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open", "back", "close"],
  setup(t, { emit: e }) {
    const n = t, o = e, a = $(() => n.detail?.kind === "task" ? n.detail.branch : null), r = $(() => n.detail?.kind === "fact" ? n.detail.event : null), u = $(() => a.value?.task || null), i = $(() => (a.value?.deps?.incoming || []).filter((m) => m.kind === "blocks").map((m) => m.from_task_id)), l = $(() => (a.value?.deps?.outgoing || []).filter((m) => m.kind === "blocks").map((m) => m.to_task_id)), c = $(() => [
      ...(a.value?.deps?.outgoing || []).filter((m) => m.kind !== "blocks").map((m) => ({ id: m.to_task_id, kind: m.kind })),
      ...(a.value?.deps?.incoming || []).filter((m) => m.kind !== "blocks").map((m) => ({ id: m.from_task_id, kind: m.kind }))
    ]), b = $(() => qe(a.value?.facts || [], "history")), w = $(() => u.value?.title || (r.value ? se(r.value, n.taskTitle) : "")), _ = $(() => u.value?.description || u.value?.digest || ""), C = $(() => {
      const m = (r.value?.body || "").trim();
      return m && m !== w.value ? m : "";
    }), M = $(() => {
      const m = String(r.value?.effective_state || r.value?.lifecycle || "active").toLowerCase();
      return m === "active" ? "" : yt(m);
    });
    function P(m) {
      return n.taskTitle(m) || ne;
    }
    function z(m) {
      o("open", m);
    }
    function W() {
      n.canBack ? o("back") : o("close");
    }
    return (m, x) => (s(), p("article", Qo, [
      g("header", Zo, [
        t.compact || t.canBack ? (s(), p("button", {
          key: 0,
          type: "button",
          class: "kx-iconbtn",
          "aria-label": "Back",
          title: "Back",
          onClick: W
        }, [
          I(d(R), {
            icon: "tabler:arrow-left",
            "aria-hidden": "true"
          })
        ])) : f("", !0),
        g("div", Xo, [
          a.value && a.value.ancestors.length ? (s(), p("nav", tr, [
            (s(!0), p(j, null, E(a.value.ancestors, (h, O) => (s(), p(j, {
              key: h.id
            }, [
              O ? (s(), y(d(R), {
                key: 0,
                icon: "tabler:chevron-right",
                "aria-hidden": "true"
              })) : f("", !0),
              g("button", {
                type: "button",
                onClick: (nt) => z({ kind: "task", id: h.id })
              }, v(h.title), 9, er)
            ], 64))), 128))
          ])) : r.value?.task_id ? (s(), p("nav", nr, [
            g("button", {
              type: "button",
              onClick: x[0] || (x[0] = (h) => z({ kind: "task", id: r.value.task_id }))
            }, v(P(r.value.task_id)), 1)
          ])) : f("", !0),
          g("div", or, [
            g("h1", null, v(t.loading && !t.detail ? "Opening…" : w.value), 1),
            u.value ? (s(), y(d(pt), {
              key: 0,
              value: d(yt)(u.value.status),
              severity: d(Qt)(u.value.status),
              class: "kx-tag-sm"
            }, null, 8, ["value", "severity"])) : r.value ? (s(), y(d(pt), {
              key: 1,
              value: d(Lt)(r.value.event_type),
              severity: d(re)(r.value.event_type),
              class: "kx-tag-sm"
            }, null, 8, ["value", "severity"])) : f("", !0)
          ]),
          r.value ? (s(), p("p", rr, v([d(Zt)(r.value), d(oe)(r.value.ts)].filter(Boolean).join(" · ")), 1)) : u.value ? (s(), p("p", ar, "Updated " + v(d(gt)(u.value.updated_at, t.now)), 1)) : f("", !0)
        ]),
        t.compact ? f("", !0) : (s(), p("button", {
          key: 1,
          type: "button",
          class: "kx-iconbtn",
          "aria-label": "Close",
          title: "Close",
          onClick: x[1] || (x[1] = (h) => o("close"))
        }, [
          I(d(R), {
            icon: "tabler:x",
            "aria-hidden": "true"
          })
        ]))
      ]),
      t.error ? (s(), y(qt, {
        key: 0,
        icon: "tabler:alert-triangle",
        title: "This item could not be opened",
        hint: t.error
      }, null, 8, ["hint"])) : t.loading && !t.detail ? (s(), p("div", sr, [
        I(d(R), {
          icon: "tabler:loader-2",
          class: "spin",
          "aria-hidden": "true"
        }),
        x[2] || (x[2] = D(" Loading…", -1))
      ])) : a.value && u.value ? (s(), p(j, { key: 2 }, [
        _.value ? (s(), p("p", ir, v(_.value), 1)) : f("", !0),
        i.value.length ? (s(), p("section", lr, [
          x[3] || (x[3] = g("h2", null, "Waiting on", -1)),
          (s(!0), p(j, null, E(i.value, (h) => (s(), y(Z, {
            key: h,
            title: P(h),
            now: t.now,
            onOpen: (O) => z({ kind: "task", id: h })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : f("", !0),
        l.value.length ? (s(), p("section", dr, [
          x[4] || (x[4] = g("h2", null, "Holds up", -1)),
          (s(!0), p(j, null, E(l.value, (h) => (s(), y(Z, {
            key: h,
            title: P(h),
            now: t.now,
            onOpen: (O) => z({ kind: "task", id: h })
          }, null, 8, ["title", "now", "onOpen"]))), 128))
        ])) : f("", !0),
        c.value.length ? (s(), p("section", ur, [
          x[5] || (x[5] = g("h2", null, "Related", -1)),
          (s(!0), p(j, null, E(c.value, (h) => (s(), y(Z, {
            key: `${h.kind}:${h.id}`,
            title: P(h.id),
            tag: d(yt)(h.kind),
            now: t.now,
            onOpen: (O) => z({ kind: "task", id: h.id })
          }, null, 8, ["title", "tag", "now", "onOpen"]))), 128))
        ])) : f("", !0),
        a.value.children.length ? (s(), p("section", cr, [
          g("h2", null, [
            x[6] || (x[6] = D("Parts ", -1)),
            g("span", br, v(a.value.children.length), 1)
          ]),
          (s(!0), p(j, null, E(a.value.children, (h) => (s(), y(Z, {
            key: h.id,
            title: h.title,
            at: h.updated_at,
            now: t.now,
            tag: d(yt)(h.status),
            severity: d(Qt)(h.status),
            detail: h.open_count ? `${h.open_count} open inside` : "",
            onOpen: (O) => z({ kind: "task", id: h.id })
          }, null, 8, ["title", "at", "now", "tag", "severity", "detail", "onOpen"]))), 128))
        ])) : f("", !0),
        g("section", pr, [
          x[7] || (x[7] = g("h2", null, "History", -1)),
          b.value.length ? f("", !0) : (s(), p("p", gr, "Nothing has been recorded on this task yet.")),
          I(Me, {
            entries: b.value,
            "task-title": t.taskTitle,
            "show-task": !1,
            now: t.now,
            onOpen: z
          }, null, 8, ["entries", "task-title", "now"])
        ])
      ], 64)) : a.value ? (s(), y(qt, {
        key: 3,
        icon: "tabler:file-unknown",
        title: "This task is no longer in the journal"
      })) : r.value ? (s(), p(j, { key: 4 }, [
        M.value || r.value.tags?.length ? (s(), p("div", fr, [
          M.value ? (s(), y(d(pt), {
            key: 0,
            value: M.value,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"])) : f("", !0),
          (s(!0), p(j, null, E(r.value.tags || [], (h) => (s(), y(d(pt), {
            key: h,
            value: h,
            severity: "secondary",
            class: "kx-tag-sm"
          }, null, 8, ["value"]))), 128))
        ])) : f("", !0),
        C.value ? (s(), p("p", hr, v(C.value), 1)) : f("", !0)
      ], 64)) : f("", !0)
    ]));
  }
}), Le = 3 * 86400;
function Xt(t, e) {
  const n = Math.max(0, Math.floor(e - t)), o = n < 3600 ? "live" : n < Le ? "recent" : "dormant";
  return { seconds: n, label: gt(t, e), tier: o };
}
const mr = /* @__PURE__ */ new Set([
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
  return mr.has(String(t || "").toLowerCase());
}
function yr(t) {
  const e = new Set(t.map((o) => o.id)), n = /* @__PURE__ */ new Map();
  for (const o of t) {
    const a = o.parent_task_id && o.parent_task_id !== o.id && e.has(o.parent_task_id) ? o.parent_task_id : "", r = n.get(a) || [];
    r.push(o), n.set(a, r);
  }
  return n;
}
const ve = /* @__PURE__ */ new WeakMap();
function kr(t) {
  const e = ve.get(t);
  if (e) return e;
  const n = yr(t), o = { children: n, activity: $r(t, n) };
  return ve.set(t, o), o;
}
function wr(t, e, n) {
  const o = [], a = [...e.get(t.id) || []];
  for (; a.length; ) {
    const r = a.shift();
    n.has(r.id) || (n.add(r.id), o.push(r), a.push(...e.get(r.id) || []));
  }
  return o;
}
function $r(t, e) {
  const n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Set(), a = [], r = (u) => {
    for (a.push({ task: u, opened: !1 }); a.length; ) {
      const i = a.pop(), l = i.task;
      if (i.opened) {
        let c = l.updated_at;
        for (const b of e.get(l.id) || [])
          c = Math.max(c, n.get(b.id) ?? b.updated_at);
        n.set(l.id, c);
        continue;
      }
      if (!o.has(l.id)) {
        o.add(l.id), a.push({ task: l, opened: !0 });
        for (const c of e.get(l.id) || []) a.push({ task: c, opened: !1 });
      }
    }
  };
  for (const u of e.get("") || []) r(u);
  for (const u of t) o.has(u.id) || r(u);
  return n;
}
function xr(t, e) {
  const { children: n, activity: o } = kr(t), a = new Map(t.map((i) => [i.id, i])), r = (i) => Xt(o.get(i.id) ?? i.updated_at, e).tier === "dormant", u = [];
  for (const i of t) {
    if (!r(i)) continue;
    const l = i.parent_task_id && i.parent_task_id !== i.id ? a.get(i.parent_task_id) : void 0;
    if (l && r(l)) continue;
    const c = wr(i, n, /* @__PURE__ */ new Set([i.id])), b = o.get(i.id) ?? i.updated_at, w = {
      root: i,
      members: c,
      lastActivityAt: b,
      age: Xt(b, e),
      openCount: 0,
      blockedCount: 0,
      doneCount: 0
    };
    for (const _ of [i, ...c]) {
      const C = String(_.status || "").toLowerCase();
      Mt(C) ? w.doneCount += 1 : C === "blocked" ? w.blockedCount += 1 : w.openCount += 1;
    }
    u.push(w);
  }
  return u.sort((i, l) => i.lastActivityAt - l.lastActivityAt || i.root.title.localeCompare(l.root.title));
}
function Sr(t, e) {
  const n = new Map(t.map((r) => [r.id, r])), o = (r) => {
    let u = r;
    const i = /* @__PURE__ */ new Set();
    for (; u.parent_task_id && n.has(u.parent_task_id) && !i.has(u.id); )
      i.add(u.id), u = n.get(u.parent_task_id);
    return u;
  }, a = /* @__PURE__ */ new Map();
  for (const r of xr(t, e)) {
    if (!r.openCount && !r.blockedCount) continue;
    const u = o(r.root), i = a.get(u.id) || { root: u, tasks: 0, open: 0, lastActivityAt: 0 };
    i.tasks += r.members.length + 1, i.open += r.openCount + r.blockedCount, i.lastActivityAt = Math.max(i.lastActivityAt, r.lastActivityAt), a.set(u.id, i);
  }
  return [...a.values()].sort((r, u) => r.lastActivityAt - u.lastActivityAt);
}
const Cr = {
  class: "jr-section",
  "aria-labelledby": "jr-quiet"
}, jr = /* @__PURE__ */ K({
  __name: "QuietList",
  props: {
    quiet: {},
    now: {}
  },
  emits: ["open", "close"],
  setup(t) {
    const e = Math.round(Le / 86400);
    return (n, o) => (s(), p("section", Cr, [
      I(Ie, {
        id: "jr-quiet",
        title: "Gone quiet",
        description: `Open work nothing has touched for ${d(e)} days or more. Ask an agent to settle it after reading its history.`
      }, {
        actions: Q(() => [
          g("button", {
            type: "button",
            class: "kx-iconbtn",
            "aria-label": "Close",
            title: "Close",
            onClick: o[0] || (o[0] = (a) => n.$emit("close"))
          }, [
            I(d(R), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])
        ]),
        _: 1
      }, 8, ["description"]),
      (s(!0), p(j, null, E(t.quiet, (a) => (s(), y(Z, {
        key: a.root.id,
        title: a.root.title,
        detail: `${a.open} open of ${a.tasks} tasks`,
        at: a.lastActivityAt,
        now: t.now,
        onOpen: (r) => n.$emit("open", { kind: "task", id: a.root.id })
      }, null, 8, ["title", "detail", "at", "now", "onOpen"]))), 128))
    ]));
  }
}), Tr = { class: "kx-search jr-search" }, me = /* @__PURE__ */ K({
  __name: "SearchBox",
  props: {
    modelValue: { required: !0 },
    modelModifiers: {}
  },
  emits: ["update:modelValue"],
  setup(t, { expose: e }) {
    const n = Ge(t, "modelValue"), o = A(null);
    return e({ focus: () => o.value?.focus() }), (a, r) => (s(), p("div", Tr, [
      I(d(R), {
        icon: "tabler:search",
        class: "kx-search-ico",
        "aria-hidden": "true"
      }),
      te(g("input", {
        ref_key: "input",
        ref: o,
        "onUpdate:modelValue": r[0] || (r[0] = (u) => n.value = u),
        class: "kx-search-input",
        type: "search",
        placeholder: "Find a task or fact",
        "aria-label": "Find a task or fact",
        onKeydown: r[1] || (r[1] = Qe((u) => n.value = "", ["esc"]))
      }, null, 544), [
        [Ze, n.value]
      ]),
      n.value ? (s(), p("button", {
        key: 0,
        type: "button",
        class: "kx-search-clear",
        "aria-label": "Clear search",
        onClick: r[2] || (r[2] = (u) => n.value = "")
      }, [
        I(d(R), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : f("", !0)
    ]));
  }
});
var _r = `
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
`, Ar = {
  root: function(e) {
    var n = e.props;
    return ["p-avatar p-component", {
      "p-avatar-image": n.image != null,
      "p-avatar-circle": n.shape === "circle",
      "p-avatar-lg": n.size === "large",
      "p-avatar-xl": n.size === "xlarge"
    }];
  },
  label: "p-avatar-label",
  icon: "p-avatar-icon"
}, Pr = Tt.extend({
  name: "avatar",
  style: _r,
  classes: Ar
}), Ir = {
  name: "BaseAvatar",
  extends: _t,
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
  style: Pr,
  provide: function() {
    return {
      $pcAvatar: this,
      $parentInstance: this
    };
  }
};
function jt(t) {
  "@babel/helpers - typeof";
  return jt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, jt(t);
}
function ye(t, e, n) {
  return (e = zr(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function zr(t) {
  var e = Or(t, "string");
  return jt(e) == "symbol" ? e : e + "";
}
function Or(t, e) {
  if (jt(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(t, e);
    if (jt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var Ee = {
  name: "Avatar",
  extends: Ir,
  inheritAttrs: !1,
  emits: ["error"],
  methods: {
    onError: function(e) {
      this.$emit("error", e);
    }
  },
  computed: {
    dataP: function() {
      return lt(ye(ye({}, this.shape, this.shape), this.size, this.size));
    }
  }
}, Br = ["aria-labelledby", "aria-label", "data-p"], qr = ["data-p"], Mr = ["data-p"], Lr = ["src", "alt", "data-p"];
function Er(t, e, n, o, a, r) {
  return s(), p("div", S({
    class: t.cx("root"),
    "aria-labelledby": t.ariaLabelledby,
    "aria-label": t.ariaLabel
  }, t.ptmi("root"), {
    "data-p": r.dataP
  }), [q(t.$slots, "default", {}, function() {
    return [t.label ? (s(), p("span", S({
      key: 0,
      class: t.cx("label")
    }, t.ptm("label"), {
      "data-p": r.dataP
    }), v(t.label), 17, qr)) : t.$slots.icon ? (s(), y(At(t.$slots.icon), {
      key: 1,
      class: H(t.cx("icon"))
    }, null, 8, ["class"])) : t.icon ? (s(), p("span", S({
      key: 2,
      class: [t.cx("icon"), t.icon]
    }, t.ptm("icon"), {
      "data-p": r.dataP
    }), null, 16, Mr)) : t.image ? (s(), p("img", S({
      key: 3,
      src: t.image,
      alt: t.ariaLabel,
      onError: e[0] || (e[0] = function() {
        return r.onError && r.onError.apply(r, arguments);
      })
    }, t.ptm("image"), {
      "data-p": r.dataP
    }), null, 16, Lr)) : f("", !0)];
  })], 16, Br);
}
Ee.render = Er;
const Nr = { class: "jr-list" }, Dr = {
  key: 0,
  class: "jr-list-empty"
}, Fr = {
  key: 1,
  class: "jr-list-empty"
}, Rr = {
  key: 2,
  class: "jr-list-empty"
}, Ur = {
  key: 3,
  class: "jr-list-empty"
}, Vr = { class: "kx-settings-rail-group" }, Wr = {
  key: 0,
  class: "kx-count"
}, Hr = {
  key: 0,
  class: "jr-list-empty"
}, Kr = { class: "kx-settings-rail-group" }, Yr = { class: "kx-count" }, Jr = { class: "kx-settings-rail-group" }, Gr = { class: "kx-count" }, Qr = { class: "jr-row-main" }, Zr = { class: "jr-row-line" }, Xr = { class: "jr-row-title" }, ta = { class: "jr-row-time" }, ea = { class: "jr-row-line" }, na = { class: "jr-row-detail" }, oa = ["aria-current"], ra = { class: "jr-row-title" }, ke = /* @__PURE__ */ K({
  __name: "WorkList",
  props: {
    needs: {},
    working: {},
    query: {},
    matchedTasks: {},
    matchedFacts: {},
    searching: { type: Boolean },
    searchError: {},
    agents: {},
    agentTasks: {},
    quietCount: {},
    quietOpen: { type: Boolean },
    selected: {},
    taskTitle: { type: Function },
    now: {}
  },
  emits: ["open", "quiet"],
  setup(t, { emit: e }) {
    const n = t, o = e;
    function a(l) {
      return n.agentTasks.get(l.id) || "";
    }
    function r(l) {
      const c = a(l);
      c && o("open", { kind: "task", id: c });
    }
    const u = {
      blocked: { label: "Blocked", severity: "danger" },
      blocker: { label: "Blocker", severity: "danger" },
      question: { label: "Question", severity: "warn" },
      stalled: { label: "Stopped", severity: "warn" }
    };
    function i(l) {
      return n.selected?.kind === l.kind && n.selected.id === l.id;
    }
    return (l, c) => (s(), p("div", Nr, [
      t.query.trim() ? (s(), p(j, { key: 0 }, [
        c[1] || (c[1] = g("div", { class: "kx-settings-rail-group" }, "Tasks", -1)),
        t.matchedTasks.length ? f("", !0) : (s(), p("p", Dr, "No task matches.")),
        (s(!0), p(j, null, E(t.matchedTasks, (b) => (s(), y(Z, {
          key: `t:${b.id}`,
          title: b.title,
          detail: t.taskTitle(b.parent_task_id),
          at: b.updated_at,
          now: t.now,
          tag: d(yt)(b.status),
          severity: d(Qt)(b.status),
          active: i({ kind: "task", id: b.id }),
          onOpen: (w) => l.$emit("open", { kind: "task", id: b.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        c[2] || (c[2] = g("div", { class: "kx-settings-rail-group" }, "Facts", -1)),
        t.searching ? (s(), p("p", Fr, "Searching…")) : t.searchError ? (s(), p("p", Rr, v(t.searchError), 1)) : t.matchedFacts.length ? f("", !0) : (s(), p("p", Ur, "No fact matches.")),
        (s(!0), p(j, null, E(t.matchedFacts, (b) => (s(), y(Z, {
          key: `f:${b.id}`,
          title: d(se)(b, t.taskTitle),
          detail: t.taskTitle(b.task_id),
          at: b.ts,
          now: t.now,
          tag: d(Lt)(b.event_type),
          severity: d(re)(b.event_type),
          active: i({ kind: "fact", id: b.id }),
          onOpen: (w) => l.$emit("open", { kind: "fact", id: b.id })
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128))
      ], 64)) : (s(), p(j, { key: 1 }, [
        g("div", Vr, [
          c[3] || (c[3] = D("Needs you ", -1)),
          t.needs.length ? (s(), p("span", Wr, v(t.needs.length), 1)) : f("", !0)
        ]),
        t.needs.length ? f("", !0) : (s(), p("p", Hr, "Nothing needs you right now.")),
        (s(!0), p(j, null, E(t.needs, (b) => (s(), y(Z, {
          key: `${b.ref.kind}:${b.ref.id}`,
          title: b.title,
          detail: b.detail,
          at: b.at,
          now: t.now,
          tag: u[b.reason].label,
          severity: u[b.reason].severity,
          active: i(b.ref),
          onOpen: (w) => l.$emit("open", b.ref)
        }, null, 8, ["title", "detail", "at", "now", "tag", "severity", "active", "onOpen"]))), 128)),
        t.working.length ? (s(), p(j, { key: 1 }, [
          g("div", Kr, [
            c[4] || (c[4] = D("In progress ", -1)),
            g("span", Yr, v(t.working.length), 1)
          ]),
          (s(!0), p(j, null, E(t.working, (b) => (s(), y(Z, {
            key: `${b.ref.kind}:${b.ref.id}`,
            title: b.title,
            detail: b.detail,
            at: b.at,
            now: t.now,
            active: i(b.ref),
            onOpen: (w) => l.$emit("open", b.ref)
          }, null, 8, ["title", "detail", "at", "now", "active", "onOpen"]))), 128))
        ], 64)) : f("", !0),
        t.agents.length ? (s(), p(j, { key: 2 }, [
          g("div", Jr, [
            c[5] || (c[5] = D("Agents now ", -1)),
            g("span", Gr, v(t.agents.length), 1)
          ]),
          (s(!0), p(j, null, E(t.agents, (b) => (s(), y(At(a(b) ? "button" : "div"), {
            key: b.id,
            type: a(b) ? "button" : void 0,
            class: "jr-row jr-agent",
            onClick: (w) => r(b)
          }, {
            default: Q(() => [
              I(d(Ee), {
                label: b.initials,
                shape: "circle",
                class: H(["jr-avatar", { working: b.working }])
              }, null, 8, ["label", "class"]),
              g("span", Qr, [
                g("span", Zr, [
                  g("span", Xr, v(b.label), 1),
                  g("time", ta, v(d(gt)(b.lastActivityAt, t.now)), 1)
                ]),
                g("span", ea, [
                  g("span", na, v(t.taskTitle(a(b)) || b.headline || b.purpose), 1)
                ])
              ])
            ]),
            _: 2
          }, 1032, ["type", "onClick"]))), 128))
        ], 64)) : f("", !0),
        t.quietCount ? (s(), p("button", {
          key: 3,
          type: "button",
          class: "jr-row jr-quiet",
          "aria-current": t.quietOpen ? "true" : void 0,
          onClick: c[0] || (c[0] = (b) => l.$emit("quiet"))
        }, [
          I(d(R), {
            icon: "tabler:moon",
            "aria-hidden": "true"
          }),
          g("span", ra, v(t.quietCount) + " gone quiet", 1),
          I(d(R), {
            icon: "tabler:chevron-right",
            "aria-hidden": "true"
          })
        ], 8, oa)) : f("", !0)
      ], 64))
    ]));
  }
});
function Wt(t) {
  const e = new URLSearchParams();
  for (const [o, a] of Object.entries(t)) a !== void 0 && a !== "" && e.set(o, String(a));
  const n = e.toString();
  return n ? `?${n}` : "";
}
function mt(t, e) {
  const n = t, o = n?.response?.data?.error ?? n?.data?.error;
  return typeof o == "string" && o ? o : typeof n?.message == "string" && n.message && !/status code|request failed/i.test(n.message) ? n.message : e;
}
const aa = 200;
class sa {
  constructor(e) {
    this.journalId = e;
  }
  base() {
    return `/api/v1/workspace/journals/${this.journalId}`;
  }
  /** Counts, the newest facts, agent positions, open spans and live editing sessions. */
  async state() {
    try {
      const e = Wt({ limit: aa, cursor_limit: 200, span_limit: 200, task_limit: 1, graph_limit: 1, artifact_limit: 1 }), { data: n } = await bt.get(`${this.base()}${e}`);
      if (!n.success) throw new Error(n.error || "failed to read the journal");
      return n.journal;
    } catch (e) {
      throw new Error(mt(e, "Couldn’t read this journal."));
    }
  }
  /**
   * The whole task tree, flattened. The state read carries one page of tasks,
   * so counts and searches are taken over the tree read instead.
   */
  async tasks(e = 5e3, n = 6) {
    try {
      const { data: o } = await bt.get(`${this.base()}/tree${Wt({ depth: n, limit: e })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task tree");
      const a = [], r = (u, i) => {
        for (const l of u || []) {
          const { children: c, ...b } = l;
          a.push({ ...b, parent_task_id: b.parent_task_id || i }), c?.length && r(c, b.id);
        }
      };
      return r(o.tree?.children || []), { tasks: a, bounded: a.length >= e };
    } catch (o) {
      throw new Error(mt(o, "Couldn’t read this journal’s work."));
    }
  }
  /** One task with its parents, children, dependencies and the facts recorded on it. */
  async branch(e, n = 100) {
    try {
      const { data: o } = await bt.get(`${this.base()}/branch${Wt({ task_id: e, fact_limit: n })}`);
      if (!o.success) throw new Error(o.error || "failed to read the task");
      return o.branch;
    } catch (o) {
      throw new Error(mt(o, "Couldn’t open this task."));
    }
  }
  async event(e) {
    try {
      const { data: n } = await bt.get(`${this.base()}/events/${encodeURIComponent(e)}`);
      if (!n.success) throw new Error(n.error || "failed to read the fact");
      return n.event;
    } catch (n) {
      throw new Error(mt(n, "Couldn’t open this fact."));
    }
  }
  /** Facts across the whole journal that match by text or, when available, by meaning. */
  async recall(e, n = 30) {
    try {
      const { data: o } = await bt.post(`${this.base()}/search`, { query: e, limit: n });
      if (!o.success) throw new Error(o.error || "search failed");
      return o.events || [];
    } catch (o) {
      throw new Error(mt(o, "Couldn’t search this journal."));
    }
  }
  async health() {
    try {
      const { data: e } = await bt.get(`${this.base()}/health`);
      return e.success ? e.health || {} : { status: "unknown" };
    } catch {
      return { status: "unknown" };
    }
  }
}
const ia = { blocker: "blocker", question: "question" }, we = { blocked: 0, blocker: 1, question: 2, stalled: 3 };
function la(t) {
  return t.event_type.replace(/^.*:/, "").toLowerCase();
}
function da(t, e) {
  return String(t.effective_state || t.lifecycle || "active").toLowerCase() === "active" && !t.superseded_by_event_id && !e.has(t.id);
}
function ua(t, e, n, o) {
  const a = new Map(t.map((c) => [c.id, c])), r = new Set(e.map((c) => c.supersedes_event_id || "").filter(Boolean)), u = [], i = /* @__PURE__ */ new Set(), l = (c) => {
    const b = c?.parent_task_id ? a.get(c.parent_task_id) : void 0;
    return b ? b.title : "";
  };
  for (const c of t)
    c.status === "blocked" && (i.add(c.id), u.push({ ref: { kind: "task", id: c.id }, reason: "blocked", title: c.title, detail: l(c), at: c.updated_at }));
  for (const c of e) {
    const b = ia[la(c)], w = (c.title || c.body || "").trim();
    if (!b || !w || !da(c, r)) continue;
    const _ = c.task_id ? a.get(c.task_id) : void 0;
    _ && Mt(_.status) || u.push({
      ref: { kind: "fact", id: c.id },
      reason: b,
      title: w.split(`
`)[0],
      detail: _?.title || Et(c.actor_id || "").label,
      at: c.ts
    });
  }
  for (const c of n.resumable) {
    if (i.has(c.task_id)) continue;
    const b = c.task_updated_at || a.get(c.task_id)?.updated_at || 0;
    Xt(b, o).tier !== "live" && (i.add(c.task_id), u.push({ ref: { kind: "task", id: c.task_id }, reason: "stalled", title: c.task_title || a.get(c.task_id)?.title || ne, detail: l(a.get(c.task_id)), at: b }));
  }
  return u.sort((c, b) => we[c.reason] - we[b.reason] || b.at - c.at);
}
function ca(t, e, n) {
  const o = new Set(e.filter((r) => r.ref.kind === "task").map((r) => r.ref.id)), a = /* @__PURE__ */ new Map();
  for (const r of t.leases)
    o.has(r.task_id) || a.has(r.task_id) || a.set(r.task_id, {
      ref: { kind: "task", id: r.task_id },
      title: r.task_title || n(r.task_id) || ne,
      detail: `${Et(r.agent_id).label} · ${r.capability === "WRITE" ? "editing" : "planning"}`,
      at: r.issued_at
    });
  return [...a.values()].sort((r, u) => u.at - r.at);
}
function ba(t, e, n) {
  const o = /* @__PURE__ */ new Map();
  for (const a of [...t].sort((r, u) => u.ts - r.ts || u.seq - r.seq)) {
    const r = mo(a.ts, n), u = o.get(r) || [];
    u.push({ ...a, fresh: e !== null && a.seq > e }), o.set(r, u);
  }
  return [...o.entries()].map(([a, r]) => ({ day: a, entries: qe(r, a) }));
}
function pa(t) {
  return t.reduce((e, n) => e + n.entries.filter((o) => o.fresh).length, 0);
}
function ga(t, e, n = 20) {
  const o = e.toLowerCase().split(/\s+/).filter(Boolean);
  return o.length ? t.filter((a) => {
    const r = `${a.title} ${a.description || ""}`.toLowerCase();
    return o.every((u) => r.includes(u));
  }).sort((a, r) => Number(Mt(a.status)) - Number(Mt(r.status)) || r.updated_at - a.updated_at).slice(0, n) : [];
}
const Ht = {
  now: 0,
  leases: [],
  resumable: [],
  counts: { active: 0, write: 0, planning: 0, resumable: 0 },
  limit: 100,
  has_more: !1
};
function Ne(t) {
  return `chestor.journal.seen:${t}`;
}
function fa(t) {
  try {
    const e = Number(localStorage.getItem(Ne(t)));
    return Number.isFinite(e) && e > 0 ? e : null;
  } catch {
    return null;
  }
}
function ha(t, e) {
  try {
    e > 0 && localStorage.setItem(Ne(t), String(e));
  } catch {
  }
}
function Kt(t, e) {
  return t instanceof Error ? t.message : e;
}
function va(t) {
  const e = $(() => new sa(t.value)), n = it([]), o = A(!1), a = it([]), r = A(!1), u = it(Ht), i = it([]), l = it([]), c = A({ status: "unknown" }), b = A(!0), w = A(!1), _ = A(""), C = A(null), M = A(Math.floor(Date.now() / 1e3)), P = A(""), z = it([]), W = A(!1), m = A(""), x = A(null), h = A([]), O = it(null), nt = A(!1), Y = A("");
  let F, dt, ut, J = 0, X = 0, B = 0;
  const Pt = $(() => ua(n.value, a.value, u.value, M.value)), It = $(() => new Map(n.value.map((k) => [k.id, k])));
  function zt(k) {
    return k && It.value.get(k)?.title || "";
  }
  const Ft = $(() => ca(u.value, Pt.value, zt)), ft = $(() => ba(a.value, C.value, M.value)), ot = $(() => pa(ft.value)), Ot = $(() => qo(i.value, l.value, M.value)), ct = $(() => Mo(Ot.value)), rt = $(() => {
    const k = new Map(a.value.map((T) => [T.id, T.task_id]));
    return new Map(Ot.value.map((T) => [T.id, Lo(T, k)]));
  }), Rt = $(() => Sr(n.value, M.value)), tt = $(() => ga(n.value, P.value));
  async function ht(k) {
    const [T, V, st] = await Promise.all([e.value.state(), e.value.tasks(), e.value.health()]);
    k === B && (n.value = V.tasks, o.value = V.bounded, a.value = T.events || [], r.value = T.event_page?.has_more === !0, u.value = T.work_control || Ht, i.value = T.cursors?.items || [], l.value = T.spans?.items || [], c.value = st, w.value || (C.value = fa(t.value)), ha(t.value, T.stats?.last_seq || 0), w.value = !0);
  }
  async function vt() {
    const k = ++B;
    if (!t.value) {
      _.value = "Journal entry id is required.", b.value = !1;
      return;
    }
    b.value = !0;
    try {
      await ht(k), k === B && (_.value = "");
    } catch (T) {
      k === B && (_.value = Kt(T, "Couldn’t read this journal."));
    } finally {
      k === B && (b.value = !1);
    }
  }
  async function at() {
    if (!t.value || b.value) return;
    const k = ++B;
    try {
      await ht(k), k === B && x.value?.kind === "task" && await Ut(x.value, !0);
    } catch {
    }
  }
  let U = [];
  function L(k) {
    return U.find((T) => T.id === k);
  }
  function et() {
    U = [...a.value, ...z.value, ...O.value?.kind === "task" ? O.value.branch.facts : []];
  }
  async function Ut(k, T = !1) {
    const V = ++X;
    T || (nt.value = !0, Y.value = "");
    try {
      let st;
      if (k.kind === "task" ? st = { kind: "task", branch: await e.value.branch(k.id) } : st = { kind: "fact", event: L(k.id) || await e.value.event(k.id) }, V !== X) return;
      O.value = st, Y.value = "";
    } catch (st) {
      V === X && !T && (Y.value = Kt(st, "Couldn’t open this item."));
    } finally {
      V === X && (nt.value = !1);
    }
  }
  function De(k, T = !1) {
    h.value = T && x.value ? [...h.value, x.value] : [], et(), x.value = k, O.value = null, Ut(k);
  }
  function Fe() {
    const k = h.value[h.value.length - 1];
    k && (h.value = h.value.slice(0, -1), et(), x.value = k, O.value = null, Ut(k));
  }
  function ie() {
    X++, h.value = [], x.value = null, O.value = null, Y.value = "", nt.value = !1;
  }
  async function Re() {
    const k = P.value.trim(), T = ++J;
    if (!k) {
      z.value = [], W.value = !1, m.value = "";
      return;
    }
    W.value = !0;
    try {
      const V = await e.value.recall(k);
      if (T !== J) return;
      z.value = V.filter(ae), m.value = "";
    } catch (V) {
      T === J && (z.value = [], m.value = Kt(V, "Search failed."));
    } finally {
      T === J && (W.value = !1);
    }
  }
  return Vt(P, () => {
    J++, clearTimeout(F), F = setTimeout(Re, 300);
  }), Vt(t, () => {
    w.value = !1, n.value = [], a.value = [], u.value = Ht, l.value = [], i.value = [], z.value = [], U = [], J++, P.value = "", m.value = "", W.value = !1, ie(), vt();
  }), je(() => {
    Vt(t, (k, T, V) => {
      k && V(tn(`kickside.thread.${k}.projection.chestor.journal:state`, () => {
        at();
      }));
    }, { immediate: !0 }), ut = setInterval(at, 15e3), dt = setInterval(() => {
      M.value = Math.floor(Date.now() / 1e3);
    }, 3e4);
  }), Te(() => {
    clearTimeout(F), ut && clearInterval(ut), dt && clearInterval(dt), B++, J++, X++;
  }), {
    tasks: n,
    tasksBounded: o,
    events: a,
    eventsHasMore: r,
    health: c,
    loading: b,
    loaded: w,
    error: _,
    clock: M,
    seenSeq: C,
    needs: Pt,
    working: Ft,
    days: ft,
    fresh: ot,
    agents: ct,
    agentTasks: rt,
    quiet: Rt,
    taskById: It,
    taskTitle: zt,
    query: P,
    matchedTasks: tt,
    matchedFacts: z,
    searching: W,
    searchError: m,
    selected: x,
    trail: h,
    detail: O,
    detailLoading: nt,
    detailError: Y,
    load: vt,
    refresh: at,
    open: De,
    back: Fe,
    close: ie
  };
}
const ma = {
  key: 0,
  class: "kx-loading kx-loading-centered"
}, ya = { class: "kx-loading-inner" }, ka = {
  key: 2,
  class: "kx-shell jr-shell"
}, wa = { class: "jr-rail-search" }, $a = { class: "kx-main" }, xa = { class: "kx-main-scroll" }, Sa = { class: "jr-reader" }, Ca = 760, ja = /* @__PURE__ */ K({
  __name: "JournalApp",
  setup(t) {
    const e = Ve(), n = $(() => e.value?.entryId || ""), o = A(null), a = A(Number.POSITIVE_INFINITY), r = $(() => (e.value?.mode || "preview") === "preview" || a.value < Ca), u = va(n), {
      loading: i,
      loaded: l,
      error: c,
      health: b,
      clock: w,
      seenSeq: _,
      eventsHasMore: C,
      tasksBounded: M,
      needs: P,
      working: z,
      days: W,
      fresh: m,
      agents: x,
      agentTasks: h,
      quiet: O,
      taskById: nt,
      taskTitle: Y,
      query: F,
      matchedTasks: dt,
      matchedFacts: ut,
      searching: J,
      searchError: X,
      selected: B,
      trail: Pt,
      detail: It,
      detailLoading: zt,
      detailError: Ft,
      load: ft,
      open: ot,
      back: Ot,
      close: ct
    } = u;
    We(ft);
    const rt = A(null), Rt = $(() => b.value.status === "degraded"), tt = A(!1);
    function ht() {
      tt.value = B.value ? !0 : !tt.value, ct();
    }
    function vt(U) {
      const L = U.composedPath()[0];
      L && ["INPUT", "TEXTAREA"].includes(L.tagName) || (U.key === "/" ? rt.value ? (U.preventDefault(), rt.value.focus()) : r.value && (B.value || tt.value) && (U.preventDefault(), ct(), tt.value = !1, Xe(() => rt.value?.focus())) : U.key === "Escape" && B.value && ct());
    }
    let at;
    return je(() => {
      window.addEventListener("keydown", vt), !(typeof ResizeObserver > "u" || !o.value) && (at = new ResizeObserver((U) => {
        a.value = U[0]?.contentRect.width || a.value;
      }), at.observe(o.value));
    }), Te(() => {
      window.removeEventListener("keydown", vt), at?.disconnect();
    }), (U, L) => (s(), p("div", {
      ref_key: "root",
      ref: o,
      class: H(["jr", { compact: r.value }])
    }, [
      !d(l) && d(i) ? (s(), p("div", ma, [
        g("div", ya, [
          I(d(R), {
            icon: "tabler:loader-2",
            class: "spin",
            "aria-hidden": "true"
          }),
          L[4] || (L[4] = D("Opening the journal…", -1))
        ])
      ])) : d(l) ? (s(), p("div", ka, [
        r.value ? f("", !0) : (s(), y(ro, {
          key: 0,
          title: "Journal"
        }, {
          toolbar: Q(() => [
            g("div", wa, [
              I(me, {
                ref_key: "searchBox",
                ref: rt,
                modelValue: d(F),
                "onUpdate:modelValue": L[0] || (L[0] = (et) => le(F) ? F.value = et : null)
              }, null, 8, ["modelValue"])
            ])
          ]),
          default: Q(() => [
            I(ke, {
              needs: d(P),
              working: d(z),
              query: d(F),
              "matched-tasks": d(dt),
              "matched-facts": d(ut),
              searching: d(J),
              "search-error": d(X),
              agents: d(x).now,
              "agent-tasks": d(h),
              "quiet-count": d(O).length,
              "quiet-open": tt.value && !d(B),
              selected: d(B),
              "task-title": d(Y),
              now: d(w),
              onOpen: d(ot),
              onQuiet: ht
            }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "agents", "agent-tasks", "quiet-count", "quiet-open", "selected", "task-title", "now", "onOpen"])
          ]),
          _: 1
        })),
        g("main", $a, [
          g("div", xa, [
            g("div", Sa, [
              d(c) ? (s(), y(d(Bt), {
                key: 0,
                severity: "error",
                closable: !1
              }, {
                default: Q(() => [
                  D(v(d(c)), 1)
                ]),
                _: 1
              })) : f("", !0),
              Rt.value ? (s(), y(d(Bt), {
                key: 1,
                severity: "warn",
                closable: !1
              }, {
                default: Q(() => [
                  D(" This journal is behind on processing new facts" + v(d(b).reasons?.length ? `: ${d(b).reasons.join(", ")}` : "") + ". What you see may be out of date. ", 1)
                ]),
                _: 1
              })) : f("", !0),
              d(M) ? (s(), y(d(Bt), {
                key: 2,
                severity: "secondary",
                closable: !1
              }, {
                default: Q(() => [
                  D(" This journal holds more tasks than the page reads at once; search and counts cover the first " + v(d(nt).size.toLocaleString()) + ". ", 1)
                ]),
                _: 1
              })) : f("", !0),
              d(B) ? (s(), y(vr, {
                key: 3,
                detail: d(It),
                loading: d(zt),
                error: d(Ft),
                "can-back": d(Pt).length > 0,
                compact: r.value,
                "task-title": d(Y),
                now: d(w),
                onOpen: L[1] || (L[1] = (et) => d(ot)(et, !0)),
                onBack: d(Ot),
                onClose: d(ct)
              }, null, 8, ["detail", "loading", "error", "can-back", "compact", "task-title", "now", "onBack", "onClose"])) : tt.value ? (s(), y(jr, {
                key: 4,
                quiet: d(O),
                now: d(w),
                onOpen: d(ot),
                onClose: L[2] || (L[2] = (et) => tt.value = !1)
              }, null, 8, ["quiet", "now", "onOpen"])) : (s(), p(j, { key: 5 }, [
                r.value ? (s(), p(j, { key: 0 }, [
                  I(me, {
                    ref_key: "searchBox",
                    ref: rt,
                    modelValue: d(F),
                    "onUpdate:modelValue": L[3] || (L[3] = (et) => le(F) ? F.value = et : null)
                  }, null, 8, ["modelValue"]),
                  I(ke, {
                    needs: d(P),
                    working: d(z),
                    query: d(F),
                    "matched-tasks": d(dt),
                    "matched-facts": d(ut),
                    searching: d(J),
                    "search-error": d(X),
                    agents: d(x).now,
                    "agent-tasks": d(h),
                    "quiet-count": d(O).length,
                    "quiet-open": !1,
                    selected: d(B),
                    "task-title": d(Y),
                    now: d(w),
                    onOpen: d(ot),
                    onQuiet: ht
                  }, null, 8, ["needs", "working", "query", "matched-tasks", "matched-facts", "searching", "search-error", "agents", "agent-tasks", "quiet-count", "selected", "task-title", "now", "onOpen"])
                ], 64)) : f("", !0),
                !r.value || !d(F).trim() ? (s(), y(Go, {
                  key: 1,
                  days: d(W),
                  fresh: d(m),
                  visited: d(_) !== null,
                  "more-history": d(C),
                  "task-title": d(Y),
                  now: d(w),
                  onOpen: d(ot)
                }, null, 8, ["days", "fresh", "visited", "more-history", "task-title", "now", "onOpen"])) : f("", !0)
              ], 64))
            ])
          ])
        ])
      ])) : (s(), y(qt, {
        key: 1,
        icon: "tabler:alert-triangle",
        title: "Journal is unavailable",
        hint: d(c),
        cta: "Try again",
        "cta-icon": "tabler:refresh",
        onCta: d(ft)
      }, null, 8, ["hint", "onCta"]))
    ], 2));
  }
}), Ia = {
  rootComponent: ja,
  plugins: [He]
};
export {
  Ia as mountConfig
};
//# sourceMappingURL=lazy-mount-Ce0GdQSs.js.map
