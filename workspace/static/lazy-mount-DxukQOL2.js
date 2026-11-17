import { u as Qn, a as te, s as ne, B as Xt, b as Cn, c as ee, d as Jt, f as Tt, R as oe, P as re } from "./wc-runtime-B0OetHdg.js";
import { defineComponent as Z, openBlock as a, createElementBlock as v, normalizeClass as H, createBlock as j, unref as c, createVNode as f, createElementVNode as l, createCommentVNode as h, renderSlot as it, toDisplayString as C, withCtx as _, createTextVNode as S, ref as $, onMounted as It, watch as $t, onBeforeUnmount as Rt, withDirectives as Sn, vShow as le, nextTick as qt, withModifiers as I, normalizeStyle as nt, Fragment as B, withKeys as mt, computed as M, renderList as ot, mergeProps as q, resolveComponent as gn, resolveDirective as ae, resolveDynamicComponent as ie, reactive as mn, onUnmounted as se } from "vue";
import { Icon as P } from "@iconify/vue";
import { d as J, c as yt, u as ue, _ as yn, a as de, b as ce } from "./Notice.vue_vue_type_script_setup_true_lang-Cz2etgDv.js";
import { loadByTagName as Dn, on as be } from "@wippy-fe/proxy";
const pe = ["aria-label", "title", "disabled"], ve = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, K = /* @__PURE__ */ Z({
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
  setup(n, { emit: r }) {
    const i = r;
    return (d, p) => (a(), v("button", {
      class: H(["km-iconbtn", [n.variant !== "plain" && n.variant, n.size !== "md" && n.size, n.active && "on", n.tone && `tone-${n.tone}`]]),
      "aria-label": n.label,
      title: n.label,
      disabled: n.disabled,
      onClick: p[0] || (p[0] = (s) => i("click"))
    }, [
      n.spin ? (a(), v("span", ve)) : (a(), j(c(P), {
        key: 1,
        icon: n.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"]))
    ], 10, pe));
  }
}), fe = { class: "km-search" }, ge = ["value", "placeholder"], me = /* @__PURE__ */ Z({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(n, { emit: r }) {
    const i = r;
    return (d, p) => (a(), v("div", fe, [
      f(c(P), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      l("input", {
        class: "km-search-input",
        value: n.modelValue,
        placeholder: n.placeholder || "Search",
        onInput: p[0] || (p[0] = (s) => i("update:modelValue", s.target.value))
      }, null, 40, ge),
      n.modelValue ? (a(), v("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: p[1] || (p[1] = (s) => i("update:modelValue", ""))
      }, [
        f(c(P), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : h("", !0)
    ]));
  }
}), ye = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, kn = /* @__PURE__ */ Z({
  __name: "Pill",
  props: {
    tone: { default: "muted" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(n) {
    return (r, i) => (a(), v("span", {
      class: H(["km-pill", `t-${n.tone}`])
    }, [
      n.dot ? (a(), v("span", ye)) : n.icon ? (a(), j(c(P), {
        key: 1,
        icon: n.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : h("", !0),
      it(r.$slots, "default")
    ], 2));
  }
}), ke = { class: "km-loading" }, we = { key: 0 }, wn = /* @__PURE__ */ Z({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(n) {
    return (r, i) => (a(), v("div", ke, [
      i[0] || (i[0] = l("span", {
        class: "km-spin lg",
        "aria-hidden": "true"
      }, null, -1)),
      n.label ? (a(), v("span", we, C(n.label), 1)) : h("", !0)
    ]));
  }
}), he = { class: "km-empty" }, $e = { class: "km-empty-title" }, xe = {
  key: 0,
  class: "km-empty-hint"
}, Ht = /* @__PURE__ */ Z({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(n, { emit: r }) {
    const i = r;
    return (d, p) => (a(), v("div", he, [
      f(c(P), {
        icon: n.icon,
        class: "km-empty-ico",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      l("div", $e, C(n.title), 1),
      n.hint ? (a(), v("p", xe, C(n.hint), 1)) : h("", !0),
      n.cta ? (a(), j(J, {
        key: 1,
        icon: n.ctaIcon,
        onClick: p[0] || (p[0] = (s) => i("cta"))
      }, {
        default: _(() => [
          S(C(n.cta), 1)
        ]),
        _: 1
      }, 8, ["icon"])) : h("", !0)
    ]));
  }
}), Ce = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function Se(n, r) {
  return {
    "entry-id": n.id,
    route: n.id,
    mode: r,
    "read-only": String(n.access_level != null && (n.access_level & 2) !== 2)
  };
}
const De = () => Qn(), Ee = () => te(), ze = {
  key: 0,
  class: "ws-renderer-fail"
}, At = /* @__PURE__ */ Z({
  __name: "EntryRenderer",
  props: {
    tag: {},
    attrs: {},
    fill: { type: Boolean, default: !0 }
  },
  setup(n) {
    const r = n, i = $(null), d = $(!1);
    let p = null, s = 0;
    async function x(w) {
      if (!customElements.get(w) && (await Dn(w, { timeoutMs: 8e3 }), !customElements.get(w)))
        throw new Error("Content is unavailable.");
    }
    async function z() {
      const w = ++s, k = i.value, g = r.tag, u = { ...r.attrs }, y = r.fill;
      if (d.value = !1, p?.remove(), p = null, !!k) {
        k.replaceChildren();
        try {
          if (await x(g), w !== s || i.value !== k) return;
          const m = customElements.get(g);
          Promise.resolve().then(() => m.preloadImplementation?.()).catch(() => {
          });
          const T = k.ownerDocument.createElement(g);
          for (const [E, W] of Object.entries(u))
            W != null && W !== "" && T.setAttribute(E, String(W));
          T.style.display = "block", T.style.width = "100%", y === !1 || (T.style.height = "100%"), T.style.minHeight = "0", p = T, k.replaceChildren(T);
        } catch {
          w === s && i.value === k && (d.value = !0);
        }
      }
    }
    return It(z), $t(() => [r.tag, JSON.stringify(r.attrs), r.fill], z), Rt(() => {
      s++, p?.remove(), p = null;
    }), (w, k) => (a(), v("div", {
      class: H(["ws-renderer-host", { "ws-renderer-flow": n.fill === !1 }])
    }, [
      d.value ? (a(), v("div", ze, [
        f(c(yt), { tone: "error" }, {
          default: _(() => [
            k[1] || (k[1] = S("Content is unavailable. ", -1)),
            f(c(J), { onClick: z }, {
              default: _(() => [...k[0] || (k[0] = [
                S("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : h("", !0),
      Sn(l("div", {
        ref_key: "host",
        ref: i,
        class: "ws-renderer-mount"
      }, null, 512), [
        [le, !d.value]
      ])
    ], 2));
  }
}), Pe = /* @__PURE__ */ Z({
  __name: "MenuLayer",
  props: {
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(n, { emit: r }) {
    const i = n, d = $(null), p = $(null), s = $({ left: "0px", top: "0px", visibility: "hidden" });
    function x() {
      const w = d.value?.getBoundingClientRect(), k = p.value?.getBoundingClientRect();
      if (!w || !k) return;
      const g = Math.max(0, Math.min(i.x - w.left, w.width - k.width)), u = Math.max(0, Math.min(i.y - w.top, w.height - k.height));
      s.value = { left: `${g}px`, top: `${u}px`, visibility: "visible" };
    }
    $t(() => [i.x, i.y], () => {
      qt(x);
    }), It(() => {
      qt(x), window.addEventListener("resize", x);
    }), Rt(() => window.removeEventListener("resize", x));
    const z = r;
    return (w, k) => (a(), v("div", {
      ref_key: "layer",
      ref: d,
      class: "ws-menu-layer",
      onClick: k[1] || (k[1] = (g) => z("close")),
      onContextmenu: k[2] || (k[2] = I((g) => z("close"), ["prevent"]))
    }, [
      l("div", {
        ref_key: "panel",
        ref: p,
        class: "ws-menu",
        style: nt(s.value),
        onClick: k[0] || (k[0] = I(() => {
        }, ["stop"]))
      }, [
        it(w.$slots, "default")
      ], 4)
    ], 544));
  }
}), je = ["onKeydown"], _e = {
  class: "ws-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "Sharing"
}, Ae = { class: "ws-dialog-foot" }, Te = /* @__PURE__ */ Z({
  __name: "ShareHost",
  props: {
    config: {}
  },
  emits: ["close", "changed"],
  setup(n, { emit: r }) {
    const i = n, d = r, p = $(null);
    let s = null;
    const x = $(!1);
    function z() {
      d("close");
    }
    function w(g) {
      d("changed", g.detail);
    }
    async function k() {
      if (x.value = !1, !!p.value)
        try {
          if (await Dn("kickside-share", { timeoutMs: 8e3 }), !customElements.get("kickside-share")) throw new Error("Sharing is unavailable.");
          s = document.createElement("kickside-share"), i.config && s.setAttribute("config", i.config), s.addEventListener("close", z), s.addEventListener("changed", w), p.value.appendChild(s);
        } catch {
          x.value = !0;
        }
    }
    return It(k), $t(() => i.config, (g) => {
      s && g && s.setAttribute("config", g);
    }), Rt(() => {
      s && (s.removeEventListener("close", z), s.removeEventListener("changed", w), s.remove(), s = null);
    }), (g, u) => (a(), v(B, null, [
      l("div", {
        ref_key: "host",
        ref: p,
        class: "ws-share-host"
      }, null, 512),
      x.value ? (a(), v("div", {
        key: 0,
        class: "ws-modal",
        onKeydown: mt(I(z, ["stop"]), ["esc"]),
        onClick: I(z, ["self"])
      }, [
        l("section", _e, [
          f(c(yt), {
            tone: "error",
            onDismiss: z
          }, {
            default: _(() => [...u[0] || (u[0] = [
              S("Sharing is unavailable.", -1)
            ])]),
            _: 1
          }),
          l("div", Ae, [
            f(c(J), {
              "aria-label": "Retry sharing",
              onClick: k
            }, {
              default: _(() => [...u[1] || (u[1] = [
                S("Retry", -1)
              ])]),
              _: 1
            }),
            f(c(J), {
              variant: "ghost",
              onClick: z
            }, {
              default: _(() => [...u[2] || (u[2] = [
                S("Close", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ], 40, je)) : h("", !0)
    ], 64));
  }
}), Ie = { class: "ws-cv-section" }, Re = { class: "ws-cv-row" }, Be = { class: "ws-cv-v" }, Me = { class: "ws-cv-row" }, Le = { class: "ws-cv-v" }, Ne = { class: "ws-cv-row" }, Oe = { class: "ws-cv-v" }, We = {
  key: 0,
  class: "ws-cv-section"
}, Fe = {
  key: 0,
  class: "ws-cv-row"
}, Ve = { class: "ws-cv-v" }, Ue = {
  key: 1,
  class: "ws-cv-row"
}, Ke = { class: "ws-cv-v" }, He = {
  key: 1,
  class: "ws-cv-section"
}, qe = { class: "ws-cv-k" }, Ge = { class: "ws-cv-v" }, hn = /* @__PURE__ */ Z({
  __name: "ComponentView",
  props: {
    entry: {},
    mode: {}
  },
  setup(n) {
    const r = n, i = /* @__PURE__ */ new Set(["title", "name", "icon", "type", "status", "color", "renderer"]);
    function d(g) {
      if (g == null || g === "") return null;
      if (typeof g == "number") return new Date(g < 2e10 ? g * 1e3 : g);
      const u = new Date(String(g));
      return isNaN(u.getTime()) ? null : u;
    }
    function p(g) {
      const u = d(g);
      return u ? u.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    }
    const s = M(() => ((r.entry.type || "item").split(".").pop() || "item").replace(/[_-]/g, " ").toUpperCase()), x = M(() => p(r.entry.created_at)), z = M(() => p(r.entry.updated_at)), w = M(() => {
      const g = r.entry.access_level;
      if (g == null) return "Full (owner)";
      const u = [];
      return g & 1 && u.push("Read"), g & 2 && u.push("Write"), g & 4 && u.push("Delete"), g & 8 && u.push("Admin"), u.length ? u.join(" · ") : "None";
    }), k = M(() => {
      const g = r.entry.meta || {}, u = [];
      for (const [y, m] of Object.entries(g)) {
        if (i.has(y) || m == null || typeof m == "object") continue;
        const T = String(m);
        T !== "" && u.push({ k: y.replace(/[_-]/g, " "), v: T });
      }
      return u;
    });
    return (g, u) => (a(), v("div", {
      class: H(["ws-cv", `ws-cv--${n.mode || "preview"}`])
    }, [
      l("div", Ie, [
        l("div", Re, [
          u[0] || (u[0] = l("span", { class: "ws-cv-k" }, "Type", -1)),
          l("span", Be, C(s.value), 1)
        ]),
        l("div", Me, [
          u[1] || (u[1] = l("span", { class: "ws-cv-k" }, "Status", -1)),
          l("span", Le, C(n.entry.status || "active"), 1)
        ]),
        l("div", Ne, [
          u[2] || (u[2] = l("span", { class: "ws-cv-k" }, "Access", -1)),
          l("span", Oe, C(w.value), 1)
        ])
      ]),
      x.value || z.value ? (a(), v("div", We, [
        x.value ? (a(), v("div", Fe, [
          u[3] || (u[3] = l("span", { class: "ws-cv-k" }, "Created", -1)),
          l("span", Ve, C(x.value), 1)
        ])) : h("", !0),
        z.value ? (a(), v("div", Ue, [
          u[4] || (u[4] = l("span", { class: "ws-cv-k" }, "Updated", -1)),
          l("span", Ke, C(z.value), 1)
        ])) : h("", !0)
      ])) : h("", !0),
      k.value.length ? (a(), v("div", He, [
        u[5] || (u[5] = l("div", { class: "ws-cv-sec-title" }, "Metadata", -1)),
        (a(!0), v(B, null, ot(k.value, (y) => (a(), v("div", {
          key: y.k,
          class: "ws-cv-row"
        }, [
          l("span", qe, C(y.k), 1),
          l("span", Ge, C(y.v), 1)
        ]))), 128))
      ])) : h("", !0)
    ], 2));
  }
});
var En = {
  name: "SpinnerIcon",
  extends: ne
};
function Xe(n) {
  return Qe(n) || Ze(n) || Ye(n) || Je();
}
function Je() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ye(n, r) {
  if (n) {
    if (typeof n == "string") return Gt(n, r);
    var i = {}.toString.call(n).slice(8, -1);
    return i === "Object" && n.constructor && (i = n.constructor.name), i === "Map" || i === "Set" ? Array.from(n) : i === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(i) ? Gt(n, r) : void 0;
  }
}
function Ze(n) {
  if (typeof Symbol < "u" && n[Symbol.iterator] != null || n["@@iterator"] != null) return Array.from(n);
}
function Qe(n) {
  if (Array.isArray(n)) return Gt(n);
}
function Gt(n, r) {
  (r == null || r > n.length) && (r = n.length);
  for (var i = 0, d = Array(r); i < r; i++) d[i] = n[i];
  return d;
}
function to(n, r, i, d, p, s) {
  return a(), v("svg", q({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, n.pti()), Xe(r[0] || (r[0] = [l("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
En.render = to;
var no = `
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
`, eo = {
  root: function(r) {
    var i = r.props, d = r.instance;
    return ["p-badge p-component", {
      "p-badge-circle": ee(i.value) && String(i.value).length === 1,
      "p-badge-dot": Cn(i.value) && !d.$slots.default,
      "p-badge-sm": i.size === "small",
      "p-badge-lg": i.size === "large",
      "p-badge-xl": i.size === "xlarge",
      "p-badge-info": i.severity === "info",
      "p-badge-success": i.severity === "success",
      "p-badge-warn": i.severity === "warn",
      "p-badge-danger": i.severity === "danger",
      "p-badge-secondary": i.severity === "secondary",
      "p-badge-contrast": i.severity === "contrast"
    }];
  }
}, oo = Xt.extend({
  name: "badge",
  style: no,
  classes: eo
}), ro = {
  name: "BaseBadge",
  extends: Jt,
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
  style: oo,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function kt(n) {
  "@babel/helpers - typeof";
  return kt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, kt(n);
}
function $n(n, r, i) {
  return (r = lo(r)) in n ? Object.defineProperty(n, r, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : n[r] = i, n;
}
function lo(n) {
  var r = ao(n, "string");
  return kt(r) == "symbol" ? r : r + "";
}
function ao(n, r) {
  if (kt(n) != "object" || !n) return n;
  var i = n[Symbol.toPrimitive];
  if (i !== void 0) {
    var d = i.call(n, r);
    if (kt(d) != "object") return d;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
var zn = {
  name: "Badge",
  extends: ro,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return Tt($n($n({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, io = ["data-p"];
function so(n, r, i, d, p, s) {
  return a(), v("span", q({
    class: n.cx("root"),
    "data-p": s.dataP
  }, n.ptmi("root")), [it(n.$slots, "default", {}, function() {
    return [S(C(n.value), 1)];
  })], 16, io);
}
zn.render = so;
var uo = `
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
function wt(n) {
  "@babel/helpers - typeof";
  return wt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, wt(n);
}
function tt(n, r, i) {
  return (r = co(r)) in n ? Object.defineProperty(n, r, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : n[r] = i, n;
}
function co(n) {
  var r = bo(n, "string");
  return wt(r) == "symbol" ? r : r + "";
}
function bo(n, r) {
  if (wt(n) != "object" || !n) return n;
  var i = n[Symbol.toPrimitive];
  if (i !== void 0) {
    var d = i.call(n, r);
    if (wt(d) != "object") return d;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
var po = {
  root: function(r) {
    var i = r.instance, d = r.props;
    return ["p-button p-component", tt(tt(tt(tt(tt(tt(tt(tt(tt({
      "p-button-icon-only": i.hasIcon && !d.label && !d.badge,
      "p-button-vertical": (d.iconPos === "top" || d.iconPos === "bottom") && d.label,
      "p-button-loading": d.loading,
      "p-button-link": d.link || d.variant === "link"
    }, "p-button-".concat(d.severity), d.severity), "p-button-raised", d.raised), "p-button-rounded", d.rounded), "p-button-text", d.text || d.variant === "text"), "p-button-outlined", d.outlined || d.variant === "outlined"), "p-button-sm", d.size === "small"), "p-button-lg", d.size === "large"), "p-button-plain", d.plain), "p-button-fluid", i.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(r) {
    var i = r.props;
    return ["p-button-icon", tt({}, "p-button-icon-".concat(i.iconPos), i.label)];
  },
  label: "p-button-label"
}, vo = Xt.extend({
  name: "button",
  style: uo,
  classes: po
}), fo = {
  name: "BaseButton",
  extends: Jt,
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
  style: vo,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function ht(n) {
  "@babel/helpers - typeof";
  return ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(r) {
    return typeof r;
  } : function(r) {
    return r && typeof Symbol == "function" && r.constructor === Symbol && r !== Symbol.prototype ? "symbol" : typeof r;
  }, ht(n);
}
function O(n, r, i) {
  return (r = go(r)) in n ? Object.defineProperty(n, r, { value: i, enumerable: !0, configurable: !0, writable: !0 }) : n[r] = i, n;
}
function go(n) {
  var r = mo(n, "string");
  return ht(r) == "symbol" ? r : r + "";
}
function mo(n, r) {
  if (ht(n) != "object" || !n) return n;
  var i = n[Symbol.toPrimitive];
  if (i !== void 0) {
    var d = i.call(n, r);
    if (ht(d) != "object") return d;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (r === "string" ? String : Number)(n);
}
var Pn = {
  name: "Button",
  extends: fo,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(r) {
      var i = r === "root" ? this.ptmi : this.ptm;
      return i(r, {
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
      return q(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Cn(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return Tt(O(O(O(O(O(O(O(O(O(O({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return Tt(O(O({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return Tt(O(O({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: En,
    Badge: zn
  },
  directives: {
    ripple: oe
  }
}, yo = ["data-p"], ko = ["data-p"];
function wo(n, r, i, d, p, s) {
  var x = gn("SpinnerIcon"), z = gn("Badge"), w = ae("ripple");
  return n.asChild ? it(n.$slots, "default", {
    key: 1,
    class: H(n.cx("root")),
    a11yAttrs: s.a11yAttrs
  }) : Sn((a(), j(ie(n.as), q({
    key: 0,
    class: n.cx("root"),
    "data-p": s.dataP
  }, s.attrs), {
    default: _(function() {
      return [it(n.$slots, "default", {}, function() {
        return [n.loading ? it(n.$slots, "loadingicon", q({
          key: 0,
          class: [n.cx("loadingIcon"), n.cx("icon")]
        }, n.ptm("loadingIcon")), function() {
          return [n.loadingIcon ? (a(), v("span", q({
            key: 0,
            class: [n.cx("loadingIcon"), n.cx("icon"), n.loadingIcon]
          }, n.ptm("loadingIcon")), null, 16)) : (a(), j(x, q({
            key: 1,
            class: [n.cx("loadingIcon"), n.cx("icon")],
            spin: ""
          }, n.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : it(n.$slots, "icon", q({
          key: 1,
          class: [n.cx("icon")]
        }, n.ptm("icon")), function() {
          return [n.icon ? (a(), v("span", q({
            key: 0,
            class: [n.cx("icon"), n.icon, n.iconClass],
            "data-p": s.dataIconP
          }, n.ptm("icon")), null, 16, yo)) : h("", !0)];
        }), n.label ? (a(), v("span", q({
          key: 2,
          class: n.cx("label")
        }, n.ptm("label"), {
          "data-p": s.dataLabelP
        }), C(n.label), 17, ko)) : h("", !0), n.badge ? (a(), j(z, {
          key: 3,
          value: n.badge,
          class: H(n.badgeClass),
          severity: n.badgeSeverity,
          unstyled: n.unstyled,
          pt: n.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : h("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[w]]);
}
Pn.render = wo;
var ho = `
    .p-progressspinner {
        position: relative;
        margin: 0 auto;
        width: 100px;
        height: 100px;
        display: inline-block;
    }

    .p-progressspinner::before {
        content: '';
        display: block;
        padding-top: 100%;
    }

    .p-progressspinner-spin {
        height: 100%;
        transform-origin: center center;
        width: 100%;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        margin: auto;
        animation: p-progressspinner-rotate 2s linear infinite;
    }

    .p-progressspinner-circle {
        stroke-dasharray: 89, 200;
        stroke-dashoffset: 0;
        stroke: dt('progressspinner.colorOne');
        animation:
            p-progressspinner-dash 1.5s ease-in-out infinite,
            p-progressspinner-color 6s ease-in-out infinite;
        stroke-linecap: round;
    }

    @keyframes p-progressspinner-rotate {
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes p-progressspinner-dash {
        0% {
            stroke-dasharray: 1, 200;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -35px;
        }
        100% {
            stroke-dasharray: 89, 200;
            stroke-dashoffset: -124px;
        }
    }
    @keyframes p-progressspinner-color {
        100%,
        0% {
            stroke: dt('progressspinner.color.one');
        }
        40% {
            stroke: dt('progressspinner.color.two');
        }
        66% {
            stroke: dt('progressspinner.color.three');
        }
        80%,
        90% {
            stroke: dt('progressspinner.color.four');
        }
    }
`, $o = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, xo = Xt.extend({
  name: "progressspinner",
  style: ho,
  classes: $o
}), Co = {
  name: "BaseProgressSpinner",
  extends: Jt,
  props: {
    strokeWidth: {
      type: String,
      default: "2"
    },
    fill: {
      type: String,
      default: "none"
    },
    animationDuration: {
      type: String,
      default: "2s"
    }
  },
  style: xo,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, jn = {
  name: "ProgressSpinner",
  extends: Co,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, So = ["fill", "stroke-width"];
function Do(n, r, i, d, p, s) {
  return a(), v("div", q({
    class: n.cx("root"),
    role: "progressbar"
  }, n.ptmi("root")), [(a(), v("svg", q({
    class: n.cx("spin"),
    viewBox: "25 25 50 50",
    style: s.svgStyle
  }, n.ptm("spin")), [l("circle", q({
    class: n.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: n.fill,
    "stroke-width": n.strokeWidth,
    strokeMiterlimit: "10"
  }, n.ptm("circle")), null, 16, So)], 16))], 16);
}
jn.render = Do;
const Eo = { key: 0 }, xn = /* @__PURE__ */ Z({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(n) {
    const r = n, i = M(() => r.state.deletion_job === null || ["dead", "cancelled"].includes(r.state.deletion_job?.status || ""));
    return (d, p) => n.state.deleting_at ? (a(), v("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: p[1] || (p[1] = I(() => {
      }, ["stop"])),
      onKeydown: p[2] || (p[2] = I(() => {
      }, ["stop"]))
    }, [
      i.value ? (a(), v(B, { key: 0 }, [
        l("span", null, [
          p[3] || (p[3] = S("Deletion failed", -1)),
          n.state.deletion_job?.last_error ? (a(), v("span", Eo, ": " + C(n.state.deletion_job.last_error), 1)) : h("", !0)
        ]),
        f(c(Pn), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: p[0] || (p[0] = I((s) => d.$emit("retry"), ["stop"]))
        })
      ], 64)) : (a(), v(B, { key: 1 }, [
        f(c(jn), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        p[4] || (p[4] = l("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : h("", !0);
  }
});
function gt(n) {
  return !!n && typeof n == "object" && !Array.isArray(n);
}
function zo(n, r) {
  return n;
}
function Po(n, r, i) {
  const d = gt(n) ? n : {}, p = [
    d,
    gt(d.data) ? d.data : null,
    gt(d.payload) ? d.payload : null,
    gt(d.detail) ? d.detail : null
  ].filter(Boolean);
  for (const s of p) {
    if (s.event !== "component.meta.changed" && s.event !== "component.deleting" && s.event !== "component.deleted") continue;
    const x = String(s.component_id || ""), z = String(d.topic || s.topic || "");
    if (!x && (!z.startsWith("component.") || z === "component.")) continue;
    const w = x || r || z.slice(10);
    return s.event === "component.deleting" && typeof s.deletion_job_id == "string" && s.deletion_job_id ? { event: s.event, component_id: w, deletion_job_id: s.deletion_job_id } : s.event !== "component.meta.changed" ? { event: s.event, component_id: w } : {
      event: "component.meta.changed",
      component_id: w,
      meta: zo(gt(s.meta) ? s.meta : {}),
      deleted: Array.isArray(s.deleted) ? s.deleted.map(String) : []
    };
  }
  return null;
}
function jo(n, r) {
  const i = Po(n, r);
  return i && i.event !== "component.meta.changed" ? i : null;
}
function _o(n, r, i, d) {
  const p = /* @__PURE__ */ new Set(), s = /* @__PURE__ */ new Map();
  function x(k, g) {
    const u = n.value.find((L) => r(L) === k), y = s.get(k), m = g?.job_id || y?.state.deletion_job_id || u?.deletion_job_id, T = y ? y.state.deletion_job_id : u?.deleting_at ? u.deletion_job_id : void 0;
    if ((y || u?.deleting_at) && m === T || m && y?.superseded.has(m)) return;
    const E = {
      deleting_at: y?.state.deleting_at || u?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: m
    }, W = new Set(y?.superseded);
    for (const L of [y?.state.deletion_job_id, u?.deletion_job_id])
      L && L !== m && W.add(L);
    s.set(k, { state: E, superseded: W }), u && (Object.assign(u, E), u.deletion_job = void 0);
  }
  const z = $t(() => n.value, (k, g = []) => {
    const u = k.filter((y) => !p.has(r(y)));
    for (const y of g)
      p.has(r(y)) || u.some((m) => r(m) === r(y)) || (i?.(r(y)), y.deleting_at && d?.(r(y)));
    if (u.length !== k.length) {
      n.value = u;
      return;
    }
    for (const y of k) {
      y.deleting_at && y.deletion_job === void 0 && !g.includes(y) && (y.deletion_job = null);
      const m = s.get(r(y));
      if (m) {
        const E = y.deletion_job_id;
        y.deleting_at && E && E !== m.state.deletion_job_id && !m.superseded.has(E) && (m.state.deletion_job_id && m.superseded.add(m.state.deletion_job_id), m.state.deletion_job_id = E), E !== m.state.deletion_job_id && (y.deletion_job = void 0), Object.assign(y, m.state);
      }
      const T = g.find((E) => r(E) === r(y));
      y.deletion_job === void 0 && T?.deletion_job_id === y.deletion_job_id && (y.deletion_job = T?.deletion_job);
    }
  }, { immediate: !0 }), w = be("@message", (k) => {
    const g = jo(k);
    if (!g) return;
    const u = n.value.find((y) => r(y) === g.component_id);
    g.event === "component.deleted" ? (u && !p.has(g.component_id) && (i?.(g.component_id), d?.(g.component_id)), p.add(g.component_id), s.delete(g.component_id), n.value = n.value.filter((y) => r(y) !== g.component_id)) : u && x(g.component_id, { job_id: g.deletion_job_id });
  });
  return Rt(() => {
    z(), typeof w == "function" && w();
  }), { acceptDeletion: x };
}
const Ao = { class: "ws-strip" }, To = { class: "ws-crumbs" }, Io = ["title", "onClick", "onDragover", "onDrop"], Ro = { class: "ws-body" }, Bo = {
  key: 0,
  class: "ws-drop-hint"
}, Mo = {
  key: 2,
  class: "ws-list"
}, Lo = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], No = { class: "ws-row-name" }, Oo = { class: "ws-age" }, Wo = ["aria-label", "onClick"], Fo = {
  key: 3,
  class: "ws-grid"
}, Vo = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], Uo = ["aria-label", "onClick"], Ko = ["title"], Ho = { class: "ws-preview-head" }, qo = { class: "ws-preview-title" }, Go = {
  key: 5,
  class: "ws-menu-div"
}, Xo = { class: "ws-dialog" }, Jo = {
  class: "ws-dialog-head",
  id: "ws-new-heading"
}, Yo = { class: "ws-type-grid" }, Zo = ["title", "onClick"], Qo = { class: "ws-create-panel" }, tr = { class: "ws-dialog" }, nr = { class: "ws-dialog-head" }, er = {
  key: 0,
  class: "ws-confirm-body"
}, or = {
  key: 1,
  class: "ws-confirm-body"
}, rr = {
  key: 2,
  class: "ws-confirm-body"
}, lr = { class: "ws-dialog-foot" }, ar = { class: "ws-dialog-head" }, ir = { class: "ws-name-row" }, sr = { class: "ws-swatches" }, ur = ["title", "aria-label", "onClick"], dr = { class: "ws-meta-grid" }, cr = { class: "ws-dialog-foot" }, br = { class: "ws-dialog" }, pr = { class: "ws-dialog-head" }, vr = { class: "ws-move-crumbs" }, fr = ["onClick"], gr = { class: "ws-move-list" }, mr = ["onClick"], yr = {
  key: 0,
  class: "ws-move-none"
}, kr = { class: "ws-dialog-foot" }, wr = {
  key: 9,
  class: "ws-manage"
}, hr = { class: "ws-manage-head" }, $r = { class: "ws-manage-title" }, xr = "wc-entry-create", Cr = /* @__PURE__ */ Z({
  __name: "Workspace",
  setup(n) {
    const r = ue(), i = De(), d = Ee(), p = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };
    function s(o, t) {
      const e = o?.access_level;
      return e == null || (Number(e) & t) === t;
    }
    function x(o) {
      return !!o && (o.type === "folder" || !!o.container);
    }
    function z(o) {
      if (o == null) return "Full";
      const t = Number(o), b = [[p.READ, "Read"], [p.WRITE, "Write"], [p.DELETE, "Delete"], [p.ADMIN, "Admin"]].filter(([U]) => (t & U) === U).map(([, U]) => U);
      return b.length ? b.join(" · ") : "None";
    }
    const w = $([]), k = $(""), g = $([]), u = $(null), y = $(null), m = $(null), T = $(!1), E = $(""), W = $(localStorage.getItem("ws-view") || "list"), L = $(!1), N = $(null), Yt = $(null), Bt = $(!1), st = $(!1), dt = M(() => {
      const o = {};
      for (const t of r.types.value) o[t.value] = t;
      return o;
    }), _n = M(() => {
      const o = /* @__PURE__ */ new Set(), t = /* @__PURE__ */ new Set();
      for (const e of r.types.value) (o.has(e.value) ? t : o).add(e.value);
      return t;
    }), An = M(() => r.types.value.filter((o) => o.creatable && !o.picker_excluded && o.create?.view).sort((o, t) => o.value === "folder" ? -1 : t.value === "folder" ? 1 : (o.label || "").localeCompare(t.label || ""))), Mt = M(() => s(y.value, p.WRITE)), xt = M(() => {
      const o = k.value.trim().toLowerCase();
      return (o ? w.value.filter((e) => (e.name || "").toLowerCase().includes(o)) : [...w.value]).sort((e, b) => {
        const U = x(e) ? 0 : 1, ft = x(b) ? 0 : 1;
        return U !== ft ? U - ft : (e.name || "").localeCompare(b.name || "", void 0, { sensitivity: "base" });
      });
    });
    function ct(o) {
      return o.icon || o.meta?.icon || dt.value[o.type]?.icon || "tabler:file";
    }
    function bt(o) {
      return o.meta?.color || dt.value[o.type]?.color || "var(--km-muted)";
    }
    function Lt(o) {
      const t = _n.value.has(o.type) ? "" : dt.value[o.type]?.label;
      return t ? t.toUpperCase() : ((o.type || "item").split(".").pop() || "item").replace(/[_-]+/g, " ").toUpperCase();
    }
    function Zt(o) {
      if (o == null || o === "") return null;
      if (typeof o == "number") return new Date(o < 2e10 ? o * 1e3 : o);
      const t = new Date(String(o));
      return isNaN(t.getTime()) ? null : t;
    }
    function Tn(o) {
      const t = Zt(o);
      if (!t) return "";
      const e = Math.floor((Date.now() - t.getTime()) / 1e3);
      return e < 60 ? "now" : e < 3600 ? Math.floor(e / 60) + "m" : e < 86400 ? Math.floor(e / 3600) + "h" : Math.floor(e / 86400) + "d";
    }
    function Qt(o) {
      const t = Zt(o);
      return t ? t.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function Ct(o) {
      const t = o.renderer || dt.value[o.type]?.renderer;
      return t ? t.startsWith("/c/") ? t.slice(3) : t : "";
    }
    function tn(o, t) {
      const e = Se(o, t), b = o.meta?.upload_id;
      return b && (e["source-url"] = `/api/v1/uploads/${b}/raw`, e["content-type"] = o.meta?.content_type || "", e.filename = o.name), e;
    }
    const R = $(null), nn = M(() => String(i.value.route || "").replace(/^\/+|\/+$/g, "").split("/")[0] || "");
    function St(o) {
      G(), d("navigate", o.id);
    }
    function Dt() {
      d("navigate", u.value || "");
    }
    async function en() {
      const o = nn.value;
      if (!o) {
        R.value = null, (u.value !== null || w.value.length === 0) && await F(null);
        return;
      }
      let t = w.value.find((b) => b.id === o) || null;
      if (!t)
        try {
          t = await r.get(o);
        } catch (b) {
          E.value = b instanceof Error ? b.message : "failed to open entry";
          return;
        }
      if (!t) {
        E.value = "entry not found";
        return;
      }
      if (x(t)) {
        R.value = null, u.value !== o && await F(o);
        return;
      }
      const e = t.parent_id ?? null;
      (u.value !== e || w.value.length === 0) && await F(e), R.value = t;
    }
    $t(nn, en);
    let pt = 0;
    async function F(o) {
      const t = o === u.value && w.value.length > 0;
      u.value = o, t || (m.value = null, k.value = "", T.value = !0), G(), E.value = "";
      const e = ++pt;
      try {
        const b = await r.list(o);
        if (e !== pt) return;
        w.value = b;
        const U = m.value;
        if (U && !b.some((ft) => ft.id === U.id) && (m.value = null), g.value = o ? await r.breadcrumbs(o) : [], y.value = o ? await r.get(o) : null, e !== pt) return;
      } catch (b) {
        if (e !== pt) return;
        E.value = b instanceof Error ? b.message : "failed to load", t || (w.value = []);
      } finally {
        e === pt && (T.value = !1);
      }
    }
    function rt(o) {
      if (x(o)) {
        d("navigate", o.id);
        return;
      }
      m.value = m.value?.id === o.id ? null : o;
    }
    const on = M(() => ({
      type: N.value?.value || "",
      "parent-id": u.value || "",
      mode: "create"
    })), In = M(() => N.value?.create?.view === xr);
    function Rn(o) {
      L.value = !1, N.value = o;
    }
    function rn() {
      N.value = null, F(u.value);
    }
    function Bn() {
      F(u.value);
      for (const o of [900, 2200, 4500]) setTimeout(() => F(u.value), o);
    }
    async function ln(o, t) {
      Bt.value = !0, E.value = "";
      try {
        for (const e of o) await r.uploadFile(e, t);
        Bn();
      } catch (e) {
        E.value = e instanceof Error ? e.message : "upload failed";
      } finally {
        Bt.value = !1;
      }
    }
    async function an(o, t) {
      await ln(o, t);
    }
    function Mn(o) {
      ln(Array.from(o), u.value);
    }
    function Ln(o) {
      const t = o.target;
      t.files?.length && Mn(t.files), t.value = "";
    }
    function Nn(o) {
      if (o.preventDefault(), st.value = !1, Q.value || !Mt.value) return;
      const t = o.dataTransfer?.files;
      t?.length && an(Array.from(t), u.value);
    }
    const Q = $(null), V = $(null);
    function sn(o, t) {
      if (!s(t, p.WRITE)) {
        o.preventDefault();
        return;
      }
      Q.value = t.id, o.dataTransfer?.setData("text/plain", t.id);
    }
    function un() {
      Q.value = null, V.value = null;
    }
    async function Nt(o, t) {
      const e = Q.value;
      if (Q.value = null, V.value = null, !(!e || e === o) && !(t && !s(t, p.WRITE)))
        try {
          await r.move(e, o), F(u.value);
        } catch (b) {
          E.value = b instanceof Error ? b.message : "move failed";
        }
    }
    function dn(o, t) {
      if (o.preventDefault(), o.stopPropagation(), st.value = !1, !x(t)) return;
      if (Q.value) {
        Nt(t.id, t);
        return;
      }
      const e = o.dataTransfer?.files;
      e?.length && s(t, p.WRITE) && an(Array.from(e), t.id);
    }
    function cn(o, t) {
      x(t) && (o.preventDefault(), V.value = t.id);
    }
    const A = mn({ entry: null, x: 0, y: 0 });
    function Et(o, t) {
      t.preventDefault(), t.stopPropagation(), A.entry = o, A.x = t.clientX, A.y = t.clientY;
    }
    function G() {
      A.entry = null;
    }
    const vt = $("");
    let bn;
    function On(o) {
      vt.value = o, clearTimeout(bn), bn = setTimeout(() => {
        vt.value = "";
      }, 1800);
    }
    const X = $(null), Ot = $(null), Wt = $([]), Ft = $([]), Vt = $(!1);
    async function zt(o) {
      Vt.value = !0;
      try {
        Ot.value = o;
        const t = await r.list(o);
        Ft.value = t.filter((e) => x(e) && e.id !== X.value?.id && s(e, p.WRITE)), Wt.value = o ? await r.breadcrumbs(o) : [];
      } catch (t) {
        E.value = t instanceof Error ? t.message : "failed to browse";
      } finally {
        Vt.value = !1;
      }
    }
    function Wn(o) {
      G(), X.value = o, zt(u.value);
    }
    async function Fn() {
      const o = X.value;
      if (!o) return;
      const t = Ot.value;
      if (X.value = null, t !== (o.parent_id ?? null))
        try {
          await r.move(o.id, t), On(`Moved to ${Wt.value.at(-1)?.name || "root"}`), F(u.value);
        } catch (e) {
          E.value = e instanceof Error ? e.message : "move failed";
        }
    }
    async function Vn(o) {
      G();
      try {
        const t = await r.exportEntry(o.id), e = URL.createObjectURL(t), b = document.createElement("a");
        b.href = e, b.download = `${o.name || "entry"}.kxb`, b.click(), setTimeout(() => URL.revokeObjectURL(e), 1e3);
      } catch (t) {
        E.value = t instanceof Error ? t.message : "export failed";
      }
    }
    function pn(o, t) {
      if (o.key === "ArrowDown" || o.key === "ArrowUp") {
        o.preventDefault();
        const e = o.currentTarget, b = [...e.parentElement?.children || []].filter((Zn) => Zn.matches?.(".ws-row, .ws-tile")), U = b.indexOf(e);
        b[o.key === "ArrowDown" ? U + 1 : U - 1]?.focus();
      } else o.key === "F2" && s(t, p.WRITE) ? (o.preventDefault(), jt(t)) : o.key === "Delete" && s(t, p.DELETE) && (o.preventDefault(), Pt(t));
    }
    const Y = $(null), lt = $(null);
    async function Pt(o) {
      if (G(), Y.value = o, lt.value = null, x(o))
        try {
          lt.value = await r.countDescendants(o.id);
        } catch (t) {
          E.value = t instanceof Error ? t.message : "failed to inspect folder";
        }
    }
    async function Un() {
      const o = Y.value;
      if (Y.value = null, lt.value = null, !!o)
        try {
          const t = await r.remove(o.id);
          t.in_progress && Kn(o.id, t), m.value?.id === o.id && (m.value = null), R.value?.id === o.id && Dt(), F(u.value);
        } catch (t) {
          E.value = t instanceof Error ? t.message : "failed to delete";
        }
    }
    const { acceptDeletion: Kn } = _o(
      w,
      (o) => o.id,
      (o) => {
        m.value?.id === o && (m.value = null);
      },
      () => F(u.value)
    ), D = mn(
      { open: !1, entry: null, name: "", icon: "", color: "" }
    ), Hn = [{ label: "Default", value: "" }, ...Ce], ut = $(""), vn = $(null);
    function jt(o) {
      G(), D.entry = o, D.name = o.name, D.icon = o.meta?.icon || "", D.color = o.meta?.color || "", ut.value = "", D.open = !0, qt(() => {
        const t = vn.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])');
        t?.focus(), t?.select();
      });
    }
    async function qn() {
      if (D.entry) {
        ut.value = "";
        try {
          await r.update(D.entry.id, { name: D.name.trim() || D.entry.name, icon: D.icon, color: D.color }), D.open = !1, F(u.value);
        } catch (o) {
          ut.value = o instanceof Error ? o.message : "failed to save";
        }
      }
    }
    function Gn() {
      W.value = W.value === "list" ? "grid" : "list", localStorage.setItem("ws-view", W.value);
    }
    const et = $(null), Xn = M(() => {
      const o = et.value;
      return o ? JSON.stringify({
        resource_id: o.id,
        title: o.name,
        access_url: `/api/v1/component-access/grants/${o.id}`,
        share_url: `/api/v1/component-access/share/${o.id}`
      }) : "";
    }), _t = $(parseInt(localStorage.getItem("ws-panel-w") || "440", 10)), Ut = $(!1);
    let at = null;
    function Jn(o) {
      o.preventDefault(), at = { pointerId: o.pointerId, x: o.clientX, width: _t.value }, Ut.value = !0, o.currentTarget.setPointerCapture(o.pointerId);
    }
    function Yn(o) {
      if (!at || o.pointerId !== at.pointerId) return;
      const t = at.width + at.x - o.clientX;
      _t.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), t));
    }
    function Kt() {
      at && (at = null, Ut.value = !1, localStorage.setItem("ws-panel-w", String(_t.value)));
    }
    function fn(o) {
      o.key === "Escape" && (G(), Y.value ? (Y.value = null, lt.value = null) : L.value ? L.value = !1 : N.value ? N.value = null : et.value ? et.value = null : X.value ? X.value = null : D.open ? D.open = !1 : R.value && Dt());
    }
    return It(async () => {
      window.addEventListener("keydown", fn), await r.loadTypes(), r.error.value && (E.value = r.error.value), await en();
    }), se(() => window.removeEventListener("keydown", fn)), (o, t) => (a(), v("div", {
      class: "ws",
      onClick: G
    }, [
      l("div", Ao, [
        l("button", {
          class: H(["ws-home", { "ws-crumb--drop": Q.value && V.value === "" }]),
          title: "Workspace root",
          "aria-label": "Workspace root",
          onClick: t[0] || (t[0] = (e) => c(d)("navigate", "")),
          onDragover: t[1] || (t[1] = I((e) => V.value = "", ["prevent"])),
          onDragleave: t[2] || (t[2] = (e) => V.value = null),
          onDrop: t[3] || (t[3] = (e) => Nt(null))
        }, [
          f(c(P), { icon: "tabler:home" })
        ], 34),
        l("div", To, [
          (a(!0), v(B, null, ot(g.value, (e) => (a(), v(B, {
            key: e.id
          }, [
            t[53] || (t[53] = l("span", { class: "ws-sep" }, "/", -1)),
            l("button", {
              class: H(["ws-crumb", { "ws-crumb--drop": Q.value && V.value === e.id }]),
              title: e.name,
              onClick: (b) => c(d)("navigate", e.id),
              onDragover: I((b) => V.value = e.id, ["prevent"]),
              onDragleave: t[4] || (t[4] = (b) => V.value = null),
              onDrop: (b) => Nt(e.id)
            }, C(e.name), 43, Io)
          ], 64))), 128))
        ]),
        t[55] || (t[55] = l("span", { class: "ws-spacer" }, null, -1)),
        f(c(me), {
          modelValue: k.value,
          "onUpdate:modelValue": t[5] || (t[5] = (e) => k.value = e),
          placeholder: "Filter this folder",
          class: "ws-filter"
        }, null, 8, ["modelValue"]),
        f(c(K), {
          icon: W.value === "list" ? "tabler:layout-grid" : "tabler:list",
          label: W.value === "list" ? "Grid view" : "List view",
          size: "sm",
          onClick: Gn
        }, null, 8, ["icon", "label"]),
        f(c(K), {
          icon: "tabler:upload",
          label: "Upload files",
          size: "sm",
          spin: Bt.value,
          disabled: !Mt.value,
          onClick: t[6] || (t[6] = (e) => Yt.value?.click())
        }, null, 8, ["spin", "disabled"]),
        f(c(J), {
          icon: "tabler:plus",
          small: "",
          onClick: t[7] || (t[7] = (e) => L.value = !0)
        }, {
          default: _(() => [...t[54] || (t[54] = [
            S("New", -1)
          ])]),
          _: 1
        }),
        l("input", {
          ref_key: "fileInput",
          ref: Yt,
          type: "file",
          multiple: "",
          hidden: "",
          onChange: Ln
        }, null, 544)
      ]),
      E.value ? (a(), j(c(yt), {
        key: 0,
        tone: "error",
        onDismiss: t[9] || (t[9] = (e) => E.value = "")
      }, {
        default: _(() => [
          S(C(E.value) + " ", 1),
          f(c(J), {
            variant: "ghost",
            small: "",
            onClick: t[8] || (t[8] = (e) => F(u.value))
          }, {
            default: _(() => [...t[56] || (t[56] = [
              S("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : h("", !0),
      vt.value ? (a(), j(c(yt), {
        key: 1,
        onDismiss: t[10] || (t[10] = (e) => vt.value = "")
      }, {
        default: _(() => [
          S(C(vt.value), 1)
        ]),
        _: 1
      })) : h("", !0),
      l("div", Ro, [
        l("div", {
          class: H(["ws-list-pane", { "ws-list-pane--aside": m.value, "ws-list-pane--drop": st.value }]),
          onDragover: t[15] || (t[15] = I((e) => st.value = !Q.value, ["prevent"])),
          onDragleave: t[16] || (t[16] = (e) => st.value = !1),
          onDrop: Nn
        }, [
          st.value ? (a(), v("div", Bo, [
            f(c(P), { icon: "tabler:upload" }),
            t[57] || (t[57] = S(" Drop to upload", -1))
          ])) : h("", !0),
          T.value ? (a(), j(c(wn), {
            key: 1,
            label: "Loading…"
          })) : xt.value.length && W.value === "list" ? (a(), v("div", Mo, [
            (a(!0), v(B, null, ot(xt.value, (e) => (a(), v("div", {
              key: e.id,
              class: H(["ws-row", {
                "ws-row--sel": m.value?.id === e.id,
                "ws-row--drop": V.value === e.id,
                "ws-row--drag": Q.value === e.id
              }]),
              draggable: s(e, p.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (b) => sn(b, e),
              onDragend: un,
              onDragover: (b) => cn(b, e),
              onDragleave: t[11] || (t[11] = (b) => V.value = null),
              onDrop: (b) => dn(b, e),
              onClick: (b) => rt(e),
              onDblclick: (b) => x(e) ? c(d)("navigate", e.id) : St(e),
              onKeydown: [
                mt((b) => rt(e), ["enter"]),
                mt(I((b) => rt(e), ["prevent"]), ["space"]),
                (b) => pn(b, e)
              ],
              onContextmenu: (b) => Et(e, b)
            }, [
              t[58] || (t[58] = l("span", { class: "ws-edge" }, null, -1)),
              f(c(P), {
                icon: ct(e),
                class: "ws-row-ico",
                style: nt({ color: bt(e) })
              }, null, 8, ["icon", "style"]),
              l("span", No, C(e.name), 1),
              f(xn, {
                state: e,
                onRetry: (b) => Pt(e)
              }, null, 8, ["state", "onRetry"]),
              f(c(kn), { tone: "muted" }, {
                default: _(() => [
                  S(C(Lt(e)), 1)
                ]),
                _: 2
              }, 1024),
              l("span", Oo, C(Tn(e.updated_at)), 1),
              l("button", {
                class: "ws-row-menu",
                title: "Actions",
                "aria-label": `Actions for ${e.name}`,
                onClick: I((b) => Et(e, b), ["stop"])
              }, [
                f(c(P), { icon: "tabler:dots" })
              ], 8, Wo)
            ], 42, Lo))), 128))
          ])) : xt.value.length ? (a(), v("div", Fo, [
            (a(!0), v(B, null, ot(xt.value, (e) => (a(), v("div", {
              key: e.id,
              class: H(["ws-tile", {
                "ws-tile--sel": m.value?.id === e.id,
                "ws-row--drop": V.value === e.id
              }]),
              draggable: s(e, p.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: (b) => sn(b, e),
              onDragend: un,
              onDragover: (b) => cn(b, e),
              onDragleave: t[12] || (t[12] = (b) => V.value = null),
              onDrop: (b) => dn(b, e),
              onClick: (b) => rt(e),
              onDblclick: (b) => x(e) ? c(d)("navigate", e.id) : St(e),
              onKeydown: [
                mt((b) => rt(e), ["enter"]),
                mt(I((b) => rt(e), ["prevent"]), ["space"]),
                (b) => pn(b, e)
              ],
              onContextmenu: (b) => Et(e, b)
            }, [
              l("button", {
                class: "ws-row-menu ws-tile-menu",
                title: "Actions",
                "aria-label": `Actions for ${e.name}`,
                onClick: I((b) => Et(e, b), ["stop"])
              }, [
                f(c(P), { icon: "tabler:dots" })
              ], 8, Uo),
              f(c(P), {
                icon: ct(e),
                class: "ws-tile-ico",
                style: nt({ color: bt(e) })
              }, null, 8, ["icon", "style"]),
              l("span", {
                class: "ws-tile-name",
                title: e.name
              }, C(e.name), 9, Ko),
              f(xn, {
                state: e,
                onRetry: (b) => Pt(e)
              }, null, 8, ["state", "onRetry"])
            ], 42, Vo))), 128))
          ])) : w.value.length ? (a(), j(c(Ht), {
            key: 4,
            icon: "tabler:search-off",
            title: "No matches",
            hint: `Nothing here matches “${k.value}”.`,
            cta: "Clear filter",
            "cta-icon": "tabler:x",
            onCta: t[13] || (t[13] = (e) => k.value = "")
          }, null, 8, ["hint"])) : Mt.value ? (a(), j(c(Ht), {
            key: 5,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Create a folder or entry, or upload files.",
            cta: "New entry",
            "cta-icon": "tabler:plus",
            onCta: t[14] || (t[14] = (e) => L.value = !0)
          })) : (a(), j(c(Ht), {
            key: 6,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Nothing has been shared into this folder yet."
          }))
        ], 34),
        m.value ? (a(), v(B, { key: 0 }, [
          l("div", {
            class: H(["ws-divider", { resizing: Ut.value }]),
            onPointerdown: Jn,
            onPointermove: Yn,
            onPointerup: Kt,
            onPointercancel: Kt,
            onLostpointercapture: Kt
          }, null, 34),
          l("aside", {
            class: "ws-preview",
            style: nt({ "--ws-preview-width": _t.value + "px" })
          }, [
            l("div", Ho, [
              f(c(P), {
                icon: ct(m.value),
                style: nt({ color: bt(m.value) })
              }, null, 8, ["icon", "style"]),
              l("span", qo, C(m.value.name), 1),
              t[59] || (t[59] = l("span", { class: "ws-spacer" }, null, -1)),
              m.value.type !== "folder" ? (a(), j(c(K), {
                key: 0,
                icon: "tabler:maximize",
                label: "Open",
                size: "sm",
                onClick: t[17] || (t[17] = (e) => St(m.value))
              })) : h("", !0),
              s(m.value, p.ADMIN) ? (a(), j(c(K), {
                key: 1,
                icon: "tabler:share-3",
                label: "Share",
                size: "sm",
                onClick: t[18] || (t[18] = (e) => et.value = m.value)
              })) : h("", !0),
              f(c(K), {
                icon: "tabler:adjustments",
                label: "Properties",
                size: "sm",
                onClick: t[19] || (t[19] = (e) => jt(m.value))
              }),
              f(c(K), {
                icon: "tabler:x",
                label: "Close",
                size: "sm",
                onClick: t[20] || (t[20] = (e) => m.value = null)
              })
            ]),
            Ct(m.value) ? (a(), j(At, {
              key: 0,
              tag: Ct(m.value),
              attrs: tn(m.value, "preview"),
              class: "ws-renderer"
            }, null, 8, ["tag", "attrs"])) : (a(), j(hn, {
              key: 1,
              entry: m.value,
              mode: "preview",
              class: "ws-renderer"
            }, null, 8, ["entry"]))
          ], 4)
        ], 64)) : h("", !0)
      ]),
      A.entry ? (a(), j(Pe, {
        key: 2,
        x: A.x,
        y: A.y,
        onClose: G
      }, {
        default: _(() => [
          x(A.entry) ? (a(), v("button", {
            key: 0,
            class: "ws-menu-item",
            onClick: t[21] || (t[21] = (e) => {
              c(d)("navigate", A.entry.id), G();
            })
          }, [
            f(c(P), { icon: "tabler:folder-open" }),
            t[60] || (t[60] = S(" Open", -1))
          ])) : (a(), v(B, { key: 1 }, [
            l("button", {
              class: "ws-menu-item",
              onClick: t[22] || (t[22] = (e) => {
                rt(A.entry), G();
              })
            }, [
              f(c(P), { icon: "tabler:eye" }),
              t[61] || (t[61] = S(" Preview", -1))
            ]),
            l("button", {
              class: "ws-menu-item",
              onClick: t[23] || (t[23] = (e) => St(A.entry))
            }, [
              f(c(P), { icon: "tabler:maximize" }),
              t[62] || (t[62] = S(" Open", -1))
            ])
          ], 64)),
          s(A.entry, p.WRITE) ? (a(), v("button", {
            key: 2,
            class: "ws-menu-item",
            onClick: t[24] || (t[24] = (e) => jt(A.entry))
          }, [
            f(c(P), { icon: "tabler:cursor-text" }),
            t[63] || (t[63] = S(" Rename…", -1))
          ])) : h("", !0),
          s(A.entry, p.WRITE) ? (a(), v("button", {
            key: 3,
            class: "ws-menu-item",
            onClick: t[25] || (t[25] = (e) => Wn(A.entry))
          }, [
            f(c(P), { icon: "tabler:folder-symlink" }),
            t[64] || (t[64] = S(" Move to…", -1))
          ])) : h("", !0),
          s(A.entry, p.ADMIN) ? (a(), v("button", {
            key: 4,
            class: "ws-menu-item",
            onClick: t[26] || (t[26] = (e) => {
              et.value = A.entry, G();
            })
          }, [
            f(c(P), { icon: "tabler:user-plus" }),
            t[65] || (t[65] = S(" Share…", -1))
          ])) : h("", !0),
          l("button", {
            class: "ws-menu-item",
            onClick: t[27] || (t[27] = (e) => Vn(A.entry))
          }, [
            f(c(P), { icon: "tabler:package-export" }),
            t[66] || (t[66] = S(" Export", -1))
          ]),
          s(A.entry, p.DELETE) ? (a(), v("div", Go)) : h("", !0),
          s(A.entry, p.DELETE) ? (a(), v("button", {
            key: 6,
            class: "ws-menu-item ws-menu-danger",
            onClick: t[28] || (t[28] = (e) => Pt(A.entry))
          }, [
            f(c(P), { icon: "tabler:trash" }),
            t[67] || (t[67] = S(" Delete", -1))
          ])) : h("", !0)
        ]),
        _: 1
      }, 8, ["x", "y"])) : h("", !0),
      L.value ? (a(), v("div", {
        key: 3,
        class: "ws-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "ws-new-heading",
        onClick: t[30] || (t[30] = I((e) => L.value = !1, ["self"]))
      }, [
        l("div", Xo, [
          l("div", Jo, [
            t[68] || (t[68] = S("New entry", -1)),
            t[69] || (t[69] = l("span", { class: "ws-spacer" }, null, -1)),
            f(c(K), {
              icon: "tabler:x",
              label: "Close new entry",
              size: "sm",
              onClick: t[29] || (t[29] = (e) => L.value = !1)
            })
          ]),
          l("div", Yo, [
            (a(!0), v(B, null, ot(An.value, (e) => (a(), v("button", {
              key: e.value,
              type: "button",
              class: "ws-type-btn",
              title: e.description || e.label,
              onClick: (b) => Rn(e)
            }, [
              f(c(P), {
                icon: e.icon,
                style: nt({ color: e.color })
              }, null, 8, ["icon", "style"]),
              l("span", null, C(e.label), 1)
            ], 8, Zo))), 128))
          ])
        ])
      ])) : h("", !0),
      N.value?.create?.view && In.value ? (a(), v("div", {
        key: 4,
        class: "ws-modal",
        onCreated: rn,
        onClose: t[31] || (t[31] = (e) => N.value = null),
        onClick: t[32] || (t[32] = I((e) => N.value = null, ["self"]))
      }, [
        f(At, {
          tag: N.value.create.view,
          attrs: on.value
        }, null, 8, ["tag", "attrs"])
      ], 32)) : N.value?.create?.view ? (a(), v("div", {
        key: 5,
        class: "ws-modal",
        onCreated: rn,
        onClose: t[33] || (t[33] = (e) => N.value = null),
        onClick: t[34] || (t[34] = I((e) => N.value = null, ["self"]))
      }, [
        l("div", Qo, [
          f(At, {
            tag: N.value.create.view,
            attrs: on.value,
            fill: !1,
            class: "ws-create-mount"
          }, null, 8, ["tag", "attrs"])
        ])
      ], 32)) : h("", !0),
      Y.value ? (a(), v("div", {
        key: 6,
        class: "ws-modal",
        onClick: t[36] || (t[36] = I((e) => {
          Y.value = null, lt.value = null;
        }, ["self"]))
      }, [
        l("div", tr, [
          l("div", nr, "Delete " + C(x(Y.value) ? "folder" : "entry"), 1),
          x(Y.value) ? (a(), v("div", er, " Deletes this folder and " + C(lt.value ?? "…") + " entries. Uploaded files stay in Files. ", 1)) : Y.value.type === "file" ? (a(), v("div", or, "Removes it from the workspace. The file stays in Files.")) : (a(), v("div", rr, "Deletes this entry from the workspace.")),
          l("div", lr, [
            f(c(J), {
              variant: "ghost",
              onClick: t[35] || (t[35] = (e) => {
                Y.value = null, lt.value = null;
              })
            }, {
              default: _(() => [...t[70] || (t[70] = [
                S("Cancel", -1)
              ])]),
              _: 1
            }),
            f(c(J), {
              icon: "tabler:trash",
              onClick: Un
            }, {
              default: _(() => [...t[71] || (t[71] = [
                S("Delete", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])) : h("", !0),
      D.open && D.entry ? (a(), v("div", {
        key: 7,
        class: "ws-modal",
        onClick: t[42] || (t[42] = I((e) => D.open = !1, ["self"]))
      }, [
        l("div", {
          ref_key: "propsDialogEl",
          ref: vn,
          class: "ws-dialog"
        }, [
          l("div", ar, [
            t[72] || (t[72] = S("Properties", -1)),
            t[73] || (t[73] = l("span", { class: "ws-spacer" }, null, -1)),
            f(c(K), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: t[37] || (t[37] = (e) => D.open = !1)
            })
          ]),
          ut.value ? (a(), j(c(yt), {
            key: 0,
            tone: "error",
            onDismiss: t[38] || (t[38] = (e) => ut.value = "")
          }, {
            default: _(() => [
              S(C(ut.value), 1)
            ]),
            _: 1
          })) : h("", !0),
          f(c(yn), { label: "Name" }, {
            default: _(() => [
              l("div", ir, [
                f(c(de), {
                  modelValue: D.icon,
                  "onUpdate:modelValue": t[39] || (t[39] = (e) => D.icon = e),
                  fallback: dt.value[D.entry.type]?.icon
                }, null, 8, ["modelValue", "fallback"]),
                f(c(ce), {
                  modelValue: D.name,
                  "onUpdate:modelValue": t[40] || (t[40] = (e) => D.name = e)
                }, null, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          f(c(yn), { label: "Color" }, {
            default: _(() => [
              l("div", sr, [
                (a(), v(B, null, ot(Hn, (e) => l("button", {
                  key: e.value,
                  type: "button",
                  class: H(["ws-swatch", { on: D.color === e.value }]),
                  title: e.label,
                  "aria-label": `Use color ${e.label}`,
                  style: nt({ background: e.value || "transparent" }),
                  onClick: (b) => D.color = e.value
                }, [
                  e.value ? h("", !0) : (a(), j(c(P), {
                    key: 0,
                    icon: "tabler:ban"
                  }))
                ], 14, ur)), 64))
              ])
            ]),
            _: 1
          }),
          l("div", dr, [
            l("div", null, [
              t[74] || (t[74] = l("span", null, "Type", -1)),
              l("span", null, C(Lt(D.entry)), 1)
            ]),
            l("div", null, [
              t[75] || (t[75] = l("span", null, "Status", -1)),
              l("code", null, C(D.entry.status), 1)
            ]),
            l("div", null, [
              t[76] || (t[76] = l("span", null, "Access", -1)),
              l("code", null, C(z(D.entry.access_level)), 1)
            ]),
            l("div", null, [
              t[77] || (t[77] = l("span", null, "Created", -1)),
              l("code", null, C(Qt(D.entry.created_at)), 1)
            ]),
            l("div", null, [
              t[78] || (t[78] = l("span", null, "Updated", -1)),
              l("code", null, C(Qt(D.entry.updated_at)), 1)
            ])
          ]),
          l("div", cr, [
            f(c(J), {
              variant: "ghost",
              onClick: t[41] || (t[41] = (e) => D.open = !1)
            }, {
              default: _(() => [...t[79] || (t[79] = [
                S("Close", -1)
              ])]),
              _: 1
            }),
            s(D.entry, p.WRITE) ? (a(), j(c(J), {
              key: 0,
              icon: "tabler:device-floppy",
              onClick: qn
            }, {
              default: _(() => [...t[80] || (t[80] = [
                S("Save", -1)
              ])]),
              _: 1
            })) : h("", !0)
          ])
        ], 512)
      ])) : h("", !0),
      X.value ? (a(), v("div", {
        key: 8,
        class: "ws-modal",
        onClick: t[46] || (t[46] = I((e) => X.value = null, ["self"]))
      }, [
        l("div", br, [
          l("div", pr, [
            S("Move “" + C(X.value.name) + "”", 1),
            t[81] || (t[81] = l("span", { class: "ws-spacer" }, null, -1)),
            f(c(K), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: t[43] || (t[43] = (e) => X.value = null)
            })
          ]),
          l("div", vr, [
            l("button", {
              class: "ws-crumb",
              onClick: t[44] || (t[44] = (e) => zt(null))
            }, [
              f(c(P), { icon: "tabler:home" })
            ]),
            (a(!0), v(B, null, ot(Wt.value, (e) => (a(), v(B, {
              key: e.id
            }, [
              t[82] || (t[82] = l("span", { class: "ws-sep" }, "/", -1)),
              l("button", {
                class: "ws-crumb",
                onClick: (b) => zt(e.id)
              }, C(e.name), 9, fr)
            ], 64))), 128))
          ]),
          l("div", gr, [
            Vt.value ? (a(), j(c(wn), {
              key: 0,
              label: "Loading…"
            })) : (a(), v(B, { key: 1 }, [
              (a(!0), v(B, null, ot(Ft.value, (e) => (a(), v("button", {
                key: e.id,
                class: "ws-move-folder",
                onClick: (b) => zt(e.id)
              }, [
                f(c(P), {
                  icon: ct(e),
                  style: nt({ color: bt(e) })
                }, null, 8, ["icon", "style"]),
                l("span", null, C(e.name), 1),
                f(c(P), {
                  icon: "tabler:chevron-right",
                  class: "ws-move-into"
                })
              ], 8, mr))), 128)),
              Ft.value.length ? h("", !0) : (a(), v("p", yr, "No folders here."))
            ], 64))
          ]),
          l("div", kr, [
            f(c(J), {
              variant: "ghost",
              onClick: t[45] || (t[45] = (e) => X.value = null)
            }, {
              default: _(() => [...t[83] || (t[83] = [
                S("Cancel", -1)
              ])]),
              _: 1
            }),
            f(c(J), {
              icon: "tabler:folder-symlink",
              disabled: Ot.value === (X.value.parent_id ?? null),
              onClick: Fn
            }, {
              default: _(() => [...t[84] || (t[84] = [
                S("Move here", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ])) : h("", !0),
      R.value ? (a(), v("div", wr, [
        l("div", hr, [
          f(c(K), {
            icon: "tabler:arrow-left",
            label: "Back",
            size: "sm",
            onClick: t[47] || (t[47] = (e) => Dt())
          }),
          f(c(P), {
            icon: ct(R.value),
            style: nt({ color: bt(R.value) })
          }, null, 8, ["icon", "style"]),
          l("span", $r, C(R.value.name), 1),
          f(c(kn), { tone: "muted" }, {
            default: _(() => [
              S(C(Lt(R.value)), 1)
            ]),
            _: 1
          }),
          t[85] || (t[85] = l("span", { class: "ws-spacer" }, null, -1)),
          s(R.value, p.ADMIN) ? (a(), j(c(K), {
            key: 0,
            icon: "tabler:share-3",
            label: "Share",
            size: "sm",
            onClick: t[48] || (t[48] = (e) => et.value = R.value)
          })) : h("", !0),
          f(c(K), {
            icon: "tabler:adjustments",
            label: "Properties",
            size: "sm",
            onClick: t[49] || (t[49] = (e) => jt(R.value))
          }),
          f(c(K), {
            icon: "tabler:x",
            label: "Close",
            size: "sm",
            onClick: t[50] || (t[50] = (e) => Dt())
          })
        ]),
        Ct(R.value) ? (a(), j(At, {
          key: 0,
          tag: Ct(R.value),
          attrs: tn(R.value, "full"),
          class: "ws-manage-body"
        }, null, 8, ["tag", "attrs"])) : (a(), j(hn, {
          key: 1,
          entry: R.value,
          mode: "full",
          class: "ws-manage-body"
        }, null, 8, ["entry"]))
      ])) : h("", !0),
      et.value ? (a(), j(Te, {
        key: 10,
        config: Xn.value,
        onClose: t[51] || (t[51] = (e) => et.value = null),
        onChanged: t[52] || (t[52] = (e) => F(u.value))
      }, null, 8, ["config"])) : h("", !0)
    ]));
  }
}), jr = {
  rootComponent: Cr,
  plugins: [re]
};
export {
  jr as mountConfig
};
//# sourceMappingURL=lazy-mount-DxukQOL2.js.map
