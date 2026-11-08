import { f as ke, u as Zo, a as Jo, e as it, b as Xo, _ as Tn, c as er, d as tr, W as nr, s as or } from "./styles-BIQv_A4K.js";
import { defineComponent as Oe, openBlock as y, createElementBlock as C, normalizeClass as de, createBlock as B, unref as S, createVNode as P, createElementVNode as g, createCommentVNode as j, renderSlot as Pe, toDisplayString as N, withCtx as G, createTextVNode as R, ref as E, readonly as rr, getCurrentInstance as Pn, onMounted as wt, nextTick as zt, watch as Le, reactive as dn, Teleport as fo, useId as ar, mergeProps as Y, h as ir, onBeforeUnmount as Ht, withDirectives as mo, vShow as lr, withModifiers as q, normalizeStyle as Ve, Fragment as X, withKeys as rt, computed as ne, renderList as Be, resolveComponent as On, resolveDirective as sr, resolveDynamicComponent as ur, onUnmounted as dr } from "vue";
import { Icon as z } from "@iconify/vue";
import { loadByTagName as vo, on as cr, api as pr, host as fr, define as mr } from "@wippy-fe/proxy";
const vr = ["aria-label", "title", "disabled"], br = {
  key: 0,
  class: "km-spin",
  "aria-hidden": "true"
}, ue = /* @__PURE__ */ Oe({
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
  setup(e, { emit: t }) {
    const n = t;
    return (o, r) => (y(), C("button", {
      class: de(["km-iconbtn", [e.variant !== "plain" && e.variant, e.size !== "md" && e.size, e.active && "on", e.tone && `tone-${e.tone}`]]),
      "aria-label": e.label,
      title: e.label,
      disabled: e.disabled,
      onClick: r[0] || (r[0] = (l) => n("click"))
    }, [
      e.spin ? (y(), C("span", br)) : (y(), B(S(z), {
        key: 1,
        icon: e.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"]))
    ], 10, vr));
  }
}), gr = { class: "km-search" }, hr = ["value", "placeholder"], yr = /* @__PURE__ */ Oe({
  __name: "SearchField",
  props: {
    modelValue: {},
    placeholder: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = t;
    return (o, r) => (y(), C("div", gr, [
      P(S(z), {
        icon: "tabler:search",
        class: "km-search-ico",
        "aria-hidden": "true"
      }),
      g("input", {
        class: "km-search-input",
        value: e.modelValue,
        placeholder: e.placeholder || "Search",
        onInput: r[0] || (r[0] = (l) => n("update:modelValue", l.target.value))
      }, null, 40, hr),
      e.modelValue ? (y(), C("button", {
        key: 0,
        class: "km-search-clear",
        "aria-label": "Clear search",
        onClick: r[1] || (r[1] = (l) => n("update:modelValue", ""))
      }, [
        P(S(z), {
          icon: "tabler:x",
          "aria-hidden": "true"
        })
      ])) : j("", !0)
    ]));
  }
}), wr = {
  key: 0,
  class: "km-pill-dot",
  "aria-hidden": "true"
}, xn = /* @__PURE__ */ Oe({
  __name: "Pill",
  props: {
    tone: { default: "muted" },
    dot: { type: Boolean },
    icon: {}
  },
  setup(e) {
    return (t, n) => (y(), C("span", {
      class: de(["km-pill", `t-${e.tone}`])
    }, [
      e.dot ? (y(), C("span", wr)) : e.icon ? (y(), B(S(z), {
        key: 1,
        icon: e.icon,
        "aria-hidden": "true"
      }, null, 8, ["icon"])) : j("", !0),
      Pe(t.$slots, "default")
    ], 2));
  }
}), kr = { class: "km-loading" }, Sr = { key: 0 }, jn = /* @__PURE__ */ Oe({
  __name: "Spinner",
  props: {
    label: {}
  },
  setup(e) {
    return (t, n) => (y(), C("div", kr, [
      n[0] || (n[0] = g("span", {
        class: "km-spin lg",
        "aria-hidden": "true"
      }, null, -1)),
      e.label ? (y(), C("span", Sr, N(e.label), 1)) : j("", !0)
    ]));
  }
}), $r = { class: "km-empty" }, _r = { class: "km-empty-title" }, Cr = {
  key: 0,
  class: "km-empty-hint"
}, an = /* @__PURE__ */ Oe({
  __name: "EmptyState",
  props: {
    icon: {},
    title: {},
    hint: {},
    cta: {},
    ctaIcon: {}
  },
  emits: ["cta"],
  setup(e, { emit: t }) {
    const n = t;
    return (o, r) => (y(), C("div", $r, [
      P(S(z), {
        icon: e.icon,
        class: "km-empty-ico",
        "aria-hidden": "true"
      }, null, 8, ["icon"]),
      g("div", _r, N(e.title), 1),
      e.hint ? (y(), C("p", Cr, N(e.hint), 1)) : j("", !0),
      e.cta ? (y(), B(ke, {
        key: 1,
        icon: e.ctaIcon,
        onClick: r[0] || (r[0] = (l) => n("cta"))
      }, {
        default: G(() => [
          R(N(e.cta), 1)
        ]),
        _: 1
      }, 8, ["icon"])) : j("", !0)
    ]));
  }
});
var Tr = Object.defineProperty, En = Object.getOwnPropertySymbols, Pr = Object.prototype.hasOwnProperty, Or = Object.prototype.propertyIsEnumerable, An = (e, t, n) => t in e ? Tr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, xr = (e, t) => {
  for (var n in t || (t = {})) Pr.call(t, n) && An(e, n, t[n]);
  if (En) for (var n of En(t)) Or.call(t, n) && An(e, n, t[n]);
  return e;
};
function Ye(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function hn(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function F(e) {
  return !Ye(e);
}
function Ne(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function bo(e = {}, t = {}) {
  let n = xr({}, e);
  return Object.keys(t).forEach((o) => {
    let r = o;
    Ne(t[r]) && r in e && Ne(e[r]) ? n[r] = bo(e[r], t[r]) : n[r] = t[r];
  }), n;
}
function jr(...e) {
  return e.reduce((t, n, o) => o === 0 ? n : bo(t, n), {});
}
function ce(e, ...t) {
  return hn(e) ? e(...t) : e;
}
function ie(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function Ae(e) {
  return ie(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function yn(e, t = "", n = {}) {
  let o = Ae(t).split("."), r = o.shift();
  if (r) {
    if (Ne(e)) {
      let l = Object.keys(e).find((u) => Ae(u) === r) || "";
      return yn(ce(e[l], n), o.join("."), n);
    }
    return;
  }
  return ce(e, n);
}
function go(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function Er(e) {
  return F(e) && !isNaN(e);
}
function Ge(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function Ar(...e) {
  return jr(...e);
}
function lt(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Lr(e) {
  return ie(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function ho(e) {
  return ie(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function yo() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let o = e.get(t);
    return o ? o.push(n) : o = [n], e.set(t, o), this;
  }, off(t, n) {
    let o = e.get(t);
    return o && o.splice(o.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let o = e.get(t);
    o && o.forEach((r) => {
      r(n);
    });
  }, clear() {
    e.clear();
  } };
}
function st(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let o = e[n];
      if (!o) continue;
      let r = typeof o;
      if (r === "string" || r === "number") t.push(o);
      else if (r === "object") {
        let l = Array.isArray(o) ? [st(...o)] : Object.entries(o).map(([u, s]) => s ? u : void 0);
        t = l.length ? t.concat(l.filter((u) => !!u)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function Nr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Dr(e, t) {
  if (e && t) {
    let n = (o) => {
      Nr(e, o) || (e.classList ? e.classList.add(o) : e.className += " " + o);
    };
    [t].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function ln(e, t) {
  if (e && t) {
    let n = (o) => {
      e.classList ? e.classList.remove(o) : e.className = e.className.replace(new RegExp("(^|\\b)" + o.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((o) => o.split(" ").forEach(n));
  }
}
function Ln(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function Rr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function Mr(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Ir(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && Mr(e));
}
function kt(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Bt(e, t = {}) {
  if (kt(e)) {
    let n = (o, r) => {
      var l, u;
      let s = (l = e?.$attrs) != null && l[o] ? [(u = e?.$attrs) == null ? void 0 : u[o]] : [];
      return [r].flat().reduce((i, p) => {
        if (p != null) {
          let m = typeof p;
          if (m === "string" || m === "number") i.push(p);
          else if (m === "object") {
            let c = Array.isArray(p) ? n(o, p) : Object.entries(p).map(([b, v]) => o === "style" && (v || v === 0) ? `${b.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${v}` : v ? b : void 0);
            i = c.length ? i.concat(c.filter((b) => !!b)) : i;
          }
        }
        return i;
      }, s);
    };
    Object.entries(t).forEach(([o, r]) => {
      if (r != null) {
        let l = o.match(/^on(.+)/);
        l ? e.addEventListener(l[1].toLowerCase(), r) : o === "p-bind" || o === "pBind" ? Bt(e, r) : (r = o === "class" ? [...new Set(n("class", r))].join(" ").trim() : o === "style" ? n("style", r).join(";").trim() : r, (e.$attrs = e.$attrs || {}) && (e.$attrs[o] = r), e.setAttribute(o, r));
      }
    });
  }
}
function Vr(e, t = {}, ...n) {
  {
    let o = document.createElement(e);
    return Bt(o, t), o.append(...n), o;
  }
}
function zr(e, t) {
  return kt(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function Br(e, t) {
  if (kt(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Nn(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Ur(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || Ln(document.documentElement) || Ln(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Wr(e, t) {
  return e ? e.offsetHeight : 0;
}
function Dn(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function wo() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Fr(e, t = "", n) {
  kt(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Dt = {};
function Hr(e = "pui_id_") {
  return Object.hasOwn(Dt, e) || (Dt[e] = 0), Dt[e]++, `${e}${Dt[e]}`;
}
var Kr = Object.defineProperty, Gr = Object.defineProperties, qr = Object.getOwnPropertyDescriptors, Ut = Object.getOwnPropertySymbols, ko = Object.prototype.hasOwnProperty, So = Object.prototype.propertyIsEnumerable, Rn = (e, t, n) => t in e ? Kr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, Te = (e, t) => {
  for (var n in t || (t = {})) ko.call(t, n) && Rn(e, n, t[n]);
  if (Ut) for (var n of Ut(t)) So.call(t, n) && Rn(e, n, t[n]);
  return e;
}, sn = (e, t) => Gr(e, qr(t)), Ie = (e, t) => {
  var n = {};
  for (var o in e) ko.call(e, o) && t.indexOf(o) < 0 && (n[o] = e[o]);
  if (e != null && Ut) for (var o of Ut(e)) t.indexOf(o) < 0 && So.call(e, o) && (n[o] = e[o]);
  return n;
}, Yr = yo(), Q = Yr, ut = /{([^}]*)}/g, $o = /(\d+\s+[\+\-\*\/]\s+\d+)/g, _o = /var\([^)]+\)/g;
function Mn(e) {
  return ie(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Qr(e) {
  return Ne(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Zr(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function cn(e = "", t = "") {
  return Zr(`${ie(e, !1) && ie(t, !1) ? `${e}-` : e}${t}`);
}
function Co(e = "", t = "") {
  return `--${cn(e, t)}`;
}
function Jr(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function To(e, t = "", n = "", o = [], r) {
  if (ie(e)) {
    let l = e.trim();
    if (Jr(l)) return;
    if (Ge(l, ut)) {
      let u = l.replaceAll(ut, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((p) => !o.some((m) => Ge(p, m)));
        return `var(${Co(n, ho(i.join("-")))}${F(r) ? `, ${r}` : ""})`;
      });
      return Ge(u.replace(_o, "0"), $o) ? `calc(${u})` : u;
    }
    return l;
  } else if (Er(e)) return e;
}
function Xr(e, t, n) {
  ie(t, !1) && e.push(`${t}:${n};`);
}
function Ze(e, t) {
  return e ? `${e}{${t}}` : "";
}
function Po(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(u, s) {
    let i = [], p = 0, m = "", c = null, b = 0;
    for (; p <= u.length; ) {
      let v = u[p];
      if ((v === '"' || v === "'" || v === "`") && u[p - 1] !== "\\" && (c = c === v ? null : v), !c && (v === "(" && b++, v === ")" && b--, (v === "," || p === u.length) && b === 0)) {
        let w = m.trim();
        w.startsWith("dt(") ? i.push(Po(w, s)) : i.push(o(w)), m = "", p++;
        continue;
      }
      v !== void 0 && (m += v), p++;
    }
    return i;
  }
  function o(u) {
    let s = u[0];
    if ((s === '"' || s === "'" || s === "`") && u[u.length - 1] === s) return u.slice(1, -1);
    let i = Number(u);
    return isNaN(i) ? u : i;
  }
  let r = [], l = [];
  for (let u = 0; u < e.length; u++) if (e[u] === "d" && e.slice(u, u + 3) === "dt(") l.push(u), u += 2;
  else if (e[u] === ")" && l.length > 0) {
    let s = l.pop();
    l.length === 0 && r.push([s, u]);
  }
  if (!r.length) return e;
  for (let u = r.length - 1; u >= 0; u--) {
    let [s, i] = r[u], p = e.slice(s + 3, i), m = n(p, t), c = t(...m);
    e = e.slice(0, s) + c + e.slice(i + 1);
  }
  return e;
}
var qe = (...e) => ea(V.getTheme(), ...e), ea = (e = {}, t, n, o) => {
  if (t) {
    let { variable: r, options: l } = V.defaults || {}, { prefix: u, transform: s } = e?.options || l || {}, i = Ge(t, ut) ? t : `{${t}}`;
    return o === "value" || Ye(o) && s === "strict" ? V.getTokenValue(t) : To(i, void 0, u, [r.excludedKeyRegex], n);
  }
  return "";
};
function Rt(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((o, r, l) => {
      var u;
      return o + r + ((u = ce(t[l], { dt: qe })) != null ? u : "");
    }, "");
    return Po(n, qe);
  }
  return ce(e, { dt: qe });
}
function ta(e, t = {}) {
  let n = V.defaults.variable, { prefix: o = n.prefix, selector: r = n.selector, excludedKeyRegex: l = n.excludedKeyRegex } = t, u = [], s = [], i = [{ node: e, path: o }];
  for (; i.length; ) {
    let { node: m, path: c } = i.pop();
    for (let b in m) {
      let v = m[b], w = Qr(v), h = Ge(b, l) ? cn(c) : cn(c, ho(b));
      if (Ne(w)) i.push({ node: w, path: h });
      else {
        let k = Co(h), T = To(w, h, o, [l]);
        Xr(s, k, T);
        let O = h;
        o && O.startsWith(o + "-") && (O = O.slice(o.length + 1)), u.push(O.replace(/-/g, "."));
      }
    }
  }
  let p = s.join("");
  return { value: s, tokens: u, declarations: p, css: Ze(r, p) };
}
var Ce = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
  return { type: "class", selector: e, matched: this.pattern.test(e.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(e) {
  return { type: "attr", selector: `:root${e},:host${e}`, matched: this.pattern.test(e.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(e) {
  return { type: "media", selector: e, matched: this.pattern.test(e.trim()) };
} }, system: { pattern: /^system$/, resolve(e) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(e.trim()) };
} }, custom: { resolve(e) {
  return { type: "custom", selector: e, matched: !0 };
} } }, resolve(e) {
  let t = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [e].flat().map((n) => {
    var o;
    return (o = t.map((r) => r.resolve(n)).find((r) => r.matched)) != null ? o : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return ta(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var l, u, s, i, p, m, c;
  let { preset: b, options: v } = t, w, h, k, T, O, I, _;
  if (F(b) && v.transform !== "strict") {
    let { primitive: x, semantic: H, extend: oe } = b, xe = H || {}, { colorScheme: pe } = xe, fe = Ie(xe, ["colorScheme"]), re = oe || {}, { colorScheme: le } = re, Se = Ie(re, ["colorScheme"]), $e = pe || {}, { dark: De } = $e, Re = Ie($e, ["dark"]), me = le || {}, { dark: Me } = me, W = Ie(me, ["dark"]), ve = F(x) ? this._toVariables({ primitive: x }, v) : {}, ee = F(fe) ? this._toVariables({ semantic: fe }, v) : {}, be = F(Re) ? this._toVariables({ light: Re }, v) : {}, Fe = F(De) ? this._toVariables({ dark: De }, v) : {}, ge = F(Se) ? this._toVariables({ semantic: Se }, v) : {}, Z = F(W) ? this._toVariables({ light: W }, v) : {}, je = F(Me) ? this._toVariables({ dark: Me }, v) : {}, [St, Gt] = [(l = ve.declarations) != null ? l : "", ve.tokens], [qt, $t] = [(u = ee.declarations) != null ? u : "", ee.tokens || []], [Yt, _t] = [(s = be.declarations) != null ? s : "", be.tokens || []], [Ct, Qt] = [(i = Fe.declarations) != null ? i : "", Fe.tokens || []], [Zt, Jt] = [(p = ge.declarations) != null ? p : "", ge.tokens || []], [he, te] = [(m = Z.declarations) != null ? m : "", Z.tokens || []], [Tt, Pt] = [(c = je.declarations) != null ? c : "", je.tokens || []];
    w = this.transformCSS(e, St, "light", "variable", v, o, r), h = Gt;
    let Xe = this.transformCSS(e, `${qt}${Yt}`, "light", "variable", v, o, r), Ot = this.transformCSS(e, `${Ct}`, "dark", "variable", v, o, r);
    k = `${Xe}${Ot}`, T = [.../* @__PURE__ */ new Set([...$t, ..._t, ...Qt])];
    let xt = this.transformCSS(e, `${Zt}${he}color-scheme:light`, "light", "variable", v, o, r), K = this.transformCSS(e, `${Tt}color-scheme:dark`, "dark", "variable", v, o, r);
    O = `${xt}${K}`, I = [.../* @__PURE__ */ new Set([...Jt, ...te, ...Pt])], _ = ce(b.css, { dt: qe });
  }
  return { primitive: { css: w, tokens: h }, semantic: { css: k, tokens: T }, global: { css: O, tokens: I }, style: _ };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: o, set: r, defaults: l, selector: u }) {
  var s, i, p;
  let m, c, b;
  if (F(t) && n.transform !== "strict") {
    let v = e.replace("-directive", ""), w = t, { colorScheme: h, extend: k, css: T } = w, O = Ie(w, ["colorScheme", "extend", "css"]), I = k || {}, { colorScheme: _ } = I, x = Ie(I, ["colorScheme"]), H = h || {}, { dark: oe } = H, xe = Ie(H, ["dark"]), pe = _ || {}, { dark: fe } = pe, re = Ie(pe, ["dark"]), le = F(O) ? this._toVariables({ [v]: Te(Te({}, O), x) }, n) : {}, Se = F(xe) ? this._toVariables({ [v]: Te(Te({}, xe), re) }, n) : {}, $e = F(oe) ? this._toVariables({ [v]: Te(Te({}, oe), fe) }, n) : {}, [De, Re] = [(s = le.declarations) != null ? s : "", le.tokens || []], [me, Me] = [(i = Se.declarations) != null ? i : "", Se.tokens || []], [W, ve] = [(p = $e.declarations) != null ? p : "", $e.tokens || []], ee = this.transformCSS(v, `${De}${me}`, "light", "variable", n, r, l, u), be = this.transformCSS(v, W, "dark", "variable", n, r, l, u);
    m = `${ee}${be}`, c = [.../* @__PURE__ */ new Set([...Re, ...Me, ...ve])], b = ce(T, { dt: qe });
  }
  return { css: m, tokens: c, style: b };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var l;
  let { preset: u, options: s } = t, i = (l = u?.components) == null ? void 0 : l[e];
  return this.getPreset({ name: e, preset: i, options: s, params: n, set: o, defaults: r });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: o, defaults: r }) {
  var l, u;
  let s = e.replace("-directive", ""), { preset: i, options: p } = t, m = ((l = i?.components) == null ? void 0 : l[s]) || ((u = i?.directives) == null ? void 0 : u[s]);
  return this.getPreset({ name: s, preset: m, options: p, params: n, set: o, defaults: r });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, o) {
  let { cssLayer: r } = t;
  return r ? `@layer ${ce(r.order || r.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: o = {}, set: r, defaults: l }) {
  let u = this.getCommon({ name: e, theme: t, params: n, set: r, defaults: l }), s = Object.entries(o).reduce((i, [p, m]) => i.push(`${p}="${m}"`) && i, []).join(" ");
  return Object.entries(u || {}).reduce((i, [p, m]) => {
    if (Ne(m) && Object.hasOwn(m, "css")) {
      let c = lt(m.css), b = `${p}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${b}" ${s}>${c}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: o = {}, set: r, defaults: l }) {
  var u;
  let s = { name: e, theme: t, params: n, set: r, defaults: l }, i = (u = e.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : u.css, p = Object.entries(o).reduce((m, [c, b]) => m.push(`${c}="${b}"`) && m, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${p}>${lt(i)}</style>` : "";
}, createTokens(e = {}, t, n = "", o = "", r = {}) {
  let l = function(s, i = {}, p = []) {
    if (p.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    p.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let m = this.value;
    if (typeof this.value == "string" && ut.test(this.value)) {
      let c = this.value.trim().replace(ut, (b) => {
        var v;
        let w = b.slice(1, -1), h = this.tokens[w];
        if (!h) return console.warn(`Token not found for path: ${w}`), "__UNRESOLVED__";
        let k = h.computed(s, i, p);
        return Array.isArray(k) && k.length === 2 ? `light-dark(${k[0].value},${k[1].value})` : (v = k?.value) != null ? v : "__UNRESOLVED__";
      });
      m = $o.test(c.replace(_o, "0")) ? `calc(${c})` : c;
    }
    return Ye(i.binding) && delete i.binding, p.pop(), { colorScheme: s, path: this.path, paths: i, value: m.includes("__UNRESOLVED__") ? void 0 : m };
  }, u = (s, i, p) => {
    Object.entries(s).forEach(([m, c]) => {
      let b = Ge(m, t.variable.excludedKeyRegex) ? i : i ? `${i}.${Mn(m)}` : Mn(m), v = p ? `${p}.${m}` : m;
      Ne(c) ? u(c, b, v) : (r[b] || (r[b] = { paths: [], computed: (w, h = {}, k = []) => {
        if (r[b].paths.length === 1) return r[b].paths[0].computed(r[b].paths[0].scheme, h.binding, k);
        if (w && w !== "none") for (let T = 0; T < r[b].paths.length; T++) {
          let O = r[b].paths[T];
          if (O.scheme === w) return O.computed(w, h.binding, k);
        }
        return r[b].paths.map((T) => T.computed(T.scheme, h[T.scheme], k));
      } }), r[b].paths.push({ path: v, value: c, scheme: v.includes("colorScheme.light") ? "light" : v.includes("colorScheme.dark") ? "dark" : "none", computed: l, tokens: r }));
    });
  };
  return u(e, n, o), r;
}, getTokenValue(e, t, n) {
  var o;
  let r = ((s) => s.split(".").filter((i) => !Ge(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), l = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, u = [(o = e[r]) == null ? void 0 : o.computed(l)].flat().filter((s) => s);
  return u.length === 1 ? u[0].value : u.reduce((s = {}, i) => {
    let p = i, { colorScheme: m } = p, c = Ie(p, ["colorScheme"]);
    return s[m] = c, s;
  }, void 0);
}, getSelectorRule(e, t, n, o) {
  return n === "class" || n === "attr" ? Ze(F(t) ? `${e}${t},${e} ${t}` : e, o) : Ze(e, Ze(t ?? ":root,:host", o));
}, transformCSS(e, t, n, o, r = {}, l, u, s) {
  if (F(t)) {
    let { cssLayer: i } = r;
    if (o !== "style") {
      let p = this.getColorSchemeOption(r, u);
      t = n === "dark" ? p.reduce((m, { type: c, selector: b }) => (F(b) && (m += b.includes("[CSS]") ? b.replace("[CSS]", t) : this.getSelectorRule(b, s, c, t)), m), "") : Ze(s ?? ":root,:host", t);
    }
    if (i) {
      let p = { name: "primeui" };
      Ne(i) && (p.name = ce(i.name, { name: e, type: o })), F(p.name) && (t = Ze(`@layer ${p.name}`, t), l?.layerNames(p.name));
    }
    return t;
  }
  return "";
} }, V = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = sn(Te({}, t), { options: Te(Te({}, this.defaults.options), t.options) }), this._tokens = Ce.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.preset) || {};
}, get options() {
  var e;
  return ((e = this.theme) == null ? void 0 : e.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(e) {
  this.update({ theme: e }), Q.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = sn(Te({}, this.theme), { preset: e }), this._tokens = Ce.createTokens(e, this.defaults), this.clearLoadedStyleNames(), Q.emit("preset:change", e), Q.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = sn(Te({}, this.theme), { options: e }), this.clearLoadedStyleNames(), Q.emit("options:change", e), Q.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(e) {
  this._layerNames.add(e);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(e) {
  return this._loadedStyleNames.has(e);
}, setLoadedStyleName(e) {
  this._loadedStyleNames.add(e);
}, deleteLoadedStyleName(e) {
  this._loadedStyleNames.delete(e);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(e) {
  return Ce.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return Ce.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return Ce.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return Ce.getPresetD(n);
}, getCustomPreset(e = "", t, n, o) {
  let r = { name: e, preset: t, options: this.options, selector: n, params: o, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return Ce.getPreset(r);
}, getLayerOrderCSS(e = "") {
  return Ce.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", o) {
  return Ce.transformCSS(e, t, o, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return Ce.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return Ce.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), Q.emit(`theme:${t}:load`, e), !this._loadingStyles.size && Q.emit("theme:load"));
} }, J = {
  STARTS_WITH: "startsWith",
  CONTAINS: "contains",
  NOT_CONTAINS: "notContains",
  ENDS_WITH: "endsWith",
  EQUALS: "equals",
  NOT_EQUALS: "notEquals",
  LESS_THAN: "lt",
  LESS_THAN_OR_EQUAL_TO: "lte",
  GREATER_THAN: "gt",
  GREATER_THAN_OR_EQUAL_TO: "gte",
  DATE_IS: "dateIs",
  DATE_IS_NOT: "dateIsNot",
  DATE_BEFORE: "dateBefore",
  DATE_AFTER: "dateAfter"
}, na = `
    *,
    ::before,
    ::after {
        box-sizing: border-box;
    }

    .p-collapsible-enter-active {
        animation: p-animate-collapsible-expand 0.2s ease-out;
        overflow: hidden;
    }

    .p-collapsible-leave-active {
        animation: p-animate-collapsible-collapse 0.2s ease-out;
        overflow: hidden;
    }

    @keyframes p-animate-collapsible-expand {
        from {
            grid-template-rows: 0fr;
        }
        to {
            grid-template-rows: 1fr;
        }
    }

    @keyframes p-animate-collapsible-collapse {
        from {
            grid-template-rows: 1fr;
        }
        to {
            grid-template-rows: 0fr;
        }
    }

    .p-disabled,
    .p-disabled * {
        cursor: default;
        pointer-events: none;
        user-select: none;
    }

    .p-disabled,
    .p-component:disabled {
        opacity: dt('disabled.opacity');
    }

    .pi {
        font-size: dt('icon.size');
    }

    .p-icon {
        width: dt('icon.size');
        height: dt('icon.size');
    }

    .p-overlay-mask {
        background: var(--px-mask-background, dt('mask.background'));
        color: dt('mask.color');
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

    .p-overlay-mask-enter-active {
        animation: p-animate-overlay-mask-enter dt('mask.transition.duration') forwards;
    }

    .p-overlay-mask-leave-active {
        animation: p-animate-overlay-mask-leave dt('mask.transition.duration') forwards;
    }

    @keyframes p-animate-overlay-mask-enter {
        from {
            background: transparent;
        }
        to {
            background: var(--px-mask-background, dt('mask.background'));
        }
    }
    @keyframes p-animate-overlay-mask-leave {
        from {
            background: var(--px-mask-background, dt('mask.background'));
        }
        to {
            background: transparent;
        }
    }

    .p-anchored-overlay-enter-active {
        animation: p-animate-anchored-overlay-enter 300ms cubic-bezier(.19,1,.22,1);
    }

    .p-anchored-overlay-leave-active {
        animation: p-animate-anchored-overlay-leave 300ms cubic-bezier(.19,1,.22,1);
    }

    @keyframes p-animate-anchored-overlay-enter {
        from {
            opacity: 0;
            transform: scale(0.93);
        }
    }

    @keyframes p-animate-anchored-overlay-leave {
        to {
            opacity: 0;
            transform: scale(0.93);
        }
    }
`;
function dt(e) {
  "@babel/helpers - typeof";
  return dt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, dt(e);
}
function In(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Vn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? In(Object(n), !0).forEach(function(o) {
      oa(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : In(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function oa(e, t, n) {
  return (t = ra(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ra(e) {
  var t = aa(e, "string");
  return dt(t) == "symbol" ? t : t + "";
}
function aa(e, t) {
  if (dt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (dt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function ia(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Pn() && Pn().components ? wt(e) : t ? e() : zt(e);
}
var la = 0;
function sa(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = E(!1), o = E(e), r = E(null), l = wo() ? window.document : void 0, u = t.document, s = u === void 0 ? l : u, i = t.immediate, p = i === void 0 ? !0 : i, m = t.manual, c = m === void 0 ? !1 : m, b = t.name, v = b === void 0 ? "style_".concat(++la) : b, w = t.id, h = w === void 0 ? void 0 : w, k = t.media, T = k === void 0 ? void 0 : k, O = t.nonce, I = O === void 0 ? void 0 : O, _ = t.first, x = _ === void 0 ? !1 : _, H = t.onMounted, oe = H === void 0 ? void 0 : H, xe = t.onUpdated, pe = xe === void 0 ? void 0 : xe, fe = t.onLoad, re = fe === void 0 ? void 0 : fe, le = t.props, Se = le === void 0 ? {} : le, $e = function() {
  }, De = function(Me) {
    var W = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var ve = Vn(Vn({}, Se), W), ee = ve.name || v, be = ve.id || h, Fe = ve.nonce || I;
      r.value = s.querySelector('style[data-primevue-style-id="'.concat(ee, '"]')) || s.getElementById(be) || s.createElement("style"), r.value.isConnected || (o.value = Me || e, Bt(r.value, {
        type: "text/css",
        id: be,
        media: T,
        nonce: Fe
      }), x ? s.head.prepend(r.value) : s.head.appendChild(r.value), Fr(r.value, "data-primevue-style-id", ee), Bt(r.value, ve), r.value.onload = function(ge) {
        return re?.(ge, {
          name: ee
        });
      }, oe?.(ee)), !n.value && ($e = Le(o, function(ge) {
        r.value.textContent = ge, pe?.(ee);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, Re = function() {
    !s || !n.value || ($e(), Ir(r.value) && s.head.removeChild(r.value), n.value = !1, r.value = null);
  };
  return p && !c && ia(De), {
    id: h,
    name: v,
    el: r,
    css: o,
    unload: Re,
    load: De,
    isLoaded: rr(n)
  };
}
function ct(e) {
  "@babel/helpers - typeof";
  return ct = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ct(e);
}
var zn, Bn, Un, Wn;
function Fn(e, t) {
  return pa(e) || ca(e, t) || da(e, t) || ua();
}
function ua() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function da(e, t) {
  if (e) {
    if (typeof e == "string") return Hn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Hn(e, t) : void 0;
  }
}
function Hn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function ca(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, l, u, s = [], i = !0, p = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (o = l.call(n)).done) && (s.push(o.value), s.length !== t); i = !0) ;
    } catch (m) {
      p = !0, r = m;
    } finally {
      try {
        if (!i && n.return != null && (u = n.return(), Object(u) !== u)) return;
      } finally {
        if (p) throw r;
      }
    }
    return s;
  }
}
function pa(e) {
  if (Array.isArray(e)) return e;
}
function Kn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function un(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Kn(Object(n), !0).forEach(function(o) {
      fa(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Kn(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function fa(e, t, n) {
  return (t = ma(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ma(e) {
  var t = va(e, "string");
  return ct(t) == "symbol" ? t : t + "";
}
function va(e, t) {
  if (ct(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (ct(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Mt(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var ba = function(t) {
  var n = t.dt;
  return `
.p-hidden-accessible {
    border: 0;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    opacity: 0;
    overflow: hidden;
    padding: 0;
    pointer-events: none;
    position: absolute;
    white-space: nowrap;
    width: 1px;
}

.p-overflow-hidden {
    overflow: hidden;
    padding-right: `.concat(n("scrollbar.width"), `;
}
`);
}, ga = {}, ha = {}, U = {
  name: "base",
  css: ba,
  style: na,
  classes: ga,
  inlineStyles: ha,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(l) {
      return l;
    }, r = o(Rt(zn || (zn = Mt(["", ""])), t));
    return F(r) ? sa(lt(r), un({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return V.transformCSS(n.name || t.name, "".concat(r).concat(Rt(Bn || (Bn = Mt(["", ""])), o)));
    });
  },
  getCommonTheme: function(t) {
    return V.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return V.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return V.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, o) {
    return V.getCustomPreset(this.name, t, n, o);
  },
  getLayerOrderThemeCSS: function() {
    return V.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var o = ce(this.css, {
        dt: qe
      }) || "", r = lt(Rt(Un || (Un = Mt(["", "", ""])), o, t)), l = Object.entries(n).reduce(function(u, s) {
        var i = Fn(s, 2), p = i[0], m = i[1];
        return u.push("".concat(p, '="').concat(m, '"')) && u;
      }, []).join(" ");
      return F(r) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(l, ">").concat(r, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return V.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = [V.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var r = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), l = Rt(Wn || (Wn = Mt(["", ""])), ce(this.style, {
        dt: qe
      })), u = lt(V.transformCSS(r, l)), s = Object.entries(n).reduce(function(i, p) {
        var m = Fn(p, 2), c = m[0], b = m[1];
        return i.push("".concat(c, '="').concat(b, '"')) && i;
      }, []).join(" ");
      F(u) && o.push('<style type="text/css" data-primevue-style-id="'.concat(r, '" ').concat(s, ">").concat(u, "</style>"));
    }
    return o.join("");
  },
  extend: function(t) {
    return un(un({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, We = yo();
function pt(e) {
  "@babel/helpers - typeof";
  return pt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, pt(e);
}
function Gn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function It(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Gn(Object(n), !0).forEach(function(o) {
      ya(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Gn(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function ya(e, t, n) {
  return (t = wa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function wa(e) {
  var t = ka(e, "string");
  return pt(t) == "symbol" ? t : t + "";
}
function ka(e, t) {
  if (pt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (pt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Sa = {
  ripple: !1,
  inputStyle: null,
  inputVariant: null,
  locale: {
    startsWith: "Starts with",
    contains: "Contains",
    notContains: "Not contains",
    endsWith: "Ends with",
    equals: "Equals",
    notEquals: "Not equals",
    noFilter: "No Filter",
    lt: "Less than",
    lte: "Less than or equal to",
    gt: "Greater than",
    gte: "Greater than or equal to",
    dateIs: "Date is",
    dateIsNot: "Date is not",
    dateBefore: "Date is before",
    dateAfter: "Date is after",
    clear: "Clear",
    apply: "Apply",
    matchAll: "Match All",
    matchAny: "Match Any",
    addRule: "Add Rule",
    removeRule: "Remove Rule",
    accept: "Yes",
    reject: "No",
    choose: "Choose",
    upload: "Upload",
    cancel: "Cancel",
    completed: "Completed",
    pending: "Pending",
    fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
    dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    chooseYear: "Choose Year",
    chooseMonth: "Choose Month",
    chooseDate: "Choose Date",
    prevDecade: "Previous Decade",
    nextDecade: "Next Decade",
    prevYear: "Previous Year",
    nextYear: "Next Year",
    prevMonth: "Previous Month",
    nextMonth: "Next Month",
    prevHour: "Previous Hour",
    nextHour: "Next Hour",
    prevMinute: "Previous Minute",
    nextMinute: "Next Minute",
    prevSecond: "Previous Second",
    nextSecond: "Next Second",
    am: "am",
    pm: "pm",
    today: "Today",
    weekHeader: "Wk",
    firstDayOfWeek: 0,
    showMonthAfterYear: !1,
    dateFormat: "mm/dd/yy",
    weak: "Weak",
    medium: "Medium",
    strong: "Strong",
    passwordPrompt: "Enter a password",
    emptyFilterMessage: "No results found",
    searchMessage: "{0} results are available",
    selectionMessage: "{0} items selected",
    emptySelectionMessage: "No selected item",
    emptySearchMessage: "No results found",
    fileChosenMessage: "{0} files",
    noFileChosenMessage: "No file chosen",
    emptyMessage: "No available options",
    aria: {
      trueLabel: "True",
      falseLabel: "False",
      nullLabel: "Not Selected",
      star: "1 star",
      stars: "{star} stars",
      selectAll: "All items selected",
      unselectAll: "All items unselected",
      close: "Close",
      previous: "Previous",
      next: "Next",
      navigation: "Navigation",
      scrollTop: "Scroll Top",
      moveTop: "Move Top",
      moveUp: "Move Up",
      moveDown: "Move Down",
      moveBottom: "Move Bottom",
      moveToTarget: "Move to Target",
      moveToSource: "Move to Source",
      moveAllToTarget: "Move All to Target",
      moveAllToSource: "Move All to Source",
      pageLabel: "Page {page}",
      firstPageLabel: "First Page",
      lastPageLabel: "Last Page",
      nextPageLabel: "Next Page",
      prevPageLabel: "Previous Page",
      rowsPerPageLabel: "Rows per page",
      jumpToPageDropdownLabel: "Jump to Page Dropdown",
      jumpToPageInputLabel: "Jump to Page Input",
      selectRow: "Row Selected",
      unselectRow: "Row Unselected",
      expandRow: "Row Expanded",
      collapseRow: "Row Collapsed",
      showFilterMenu: "Show Filter Menu",
      hideFilterMenu: "Hide Filter Menu",
      filterOperator: "Filter Operator",
      filterConstraint: "Filter Constraint",
      editRow: "Row Edit",
      saveEdit: "Save Edit",
      cancelEdit: "Cancel Edit",
      listView: "List View",
      gridView: "Grid View",
      slide: "Slide",
      slideNumber: "{slideNumber}",
      zoomImage: "Zoom Image",
      zoomIn: "Zoom In",
      zoomOut: "Zoom Out",
      rotateRight: "Rotate Right",
      rotateLeft: "Rotate Left",
      listLabel: "Option List"
    }
  },
  filterMatchModeOptions: {
    text: [J.STARTS_WITH, J.CONTAINS, J.NOT_CONTAINS, J.ENDS_WITH, J.EQUALS, J.NOT_EQUALS],
    numeric: [J.EQUALS, J.NOT_EQUALS, J.LESS_THAN, J.LESS_THAN_OR_EQUAL_TO, J.GREATER_THAN, J.GREATER_THAN_OR_EQUAL_TO],
    date: [J.DATE_IS, J.DATE_IS_NOT, J.DATE_BEFORE, J.DATE_AFTER]
  },
  zIndex: {
    modal: 1100,
    overlay: 1e3,
    menu: 1e3,
    tooltip: 1100
  },
  theme: void 0,
  unstyled: !1,
  pt: void 0,
  ptOptions: {
    mergeSections: !0,
    mergeProps: !1
  },
  csp: {
    nonce: void 0
  }
}, $a = Symbol();
function _a(e, t) {
  var n = {
    config: dn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide($a, n), Ca(), Ta(e, n), n;
}
var Je = [];
function Ca() {
  Q.clear(), Je.forEach(function(e) {
    return e?.();
  }), Je = [];
}
function Ta(e, t) {
  var n = E(!1), o = function() {
    var p;
    if (((p = t.config) === null || p === void 0 ? void 0 : p.theme) !== "none" && !V.isStyleNameLoaded("common")) {
      var m, c, b = ((m = U.getCommonTheme) === null || m === void 0 ? void 0 : m.call(U)) || {}, v = b.primitive, w = b.semantic, h = b.global, k = b.style, T = {
        nonce: (c = t.config) === null || c === void 0 || (c = c.csp) === null || c === void 0 ? void 0 : c.nonce
      };
      U.load(v?.css, It({
        name: "primitive-variables"
      }, T)), U.load(w?.css, It({
        name: "semantic-variables"
      }, T)), U.load(h?.css, It({
        name: "global-variables"
      }, T)), U.loadStyle(It({
        name: "global-style"
      }, T), k), V.setLoadedStyleName("common");
    }
  };
  Q.on("theme:change", function(i) {
    n.value || (e.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var r = Le(t.config, function(i, p) {
    We.emit("config:change", {
      newValue: i,
      oldValue: p
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = Le(function() {
    return t.config.ripple;
  }, function(i, p) {
    We.emit("config:ripple:change", {
      newValue: i,
      oldValue: p
    });
  }, {
    immediate: !0,
    deep: !0
  }), u = Le(function() {
    return t.config.theme;
  }, function(i, p) {
    n.value || V.setTheme(i), t.config.unstyled || o(), n.value = !1, We.emit("config:theme:change", {
      newValue: i,
      oldValue: p
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = Le(function() {
    return t.config.unstyled;
  }, function(i, p) {
    !i && t.config.theme && o(), We.emit("config:unstyled:change", {
      newValue: i,
      oldValue: p
    });
  }, {
    immediate: !0,
    deep: !0
  });
  Je.push(r), Je.push(l), Je.push(u), Je.push(s);
}
var Pa = {
  install: function(t, n) {
    var o = Ar(Sa, n);
    _a(t, o);
  }
}, Oo = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = wo();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function Oa(e, t, n, o, r, l) {
  return l.inline ? Pe(e.$slots, "default", {
    key: 0
  }) : r.mounted ? (y(), B(fo, {
    key: 1,
    to: n.appendTo
  }, [Pe(e.$slots, "default")], 8, ["to"])) : j("", !0);
}
Oo.render = Oa;
var Ue = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(t) {
    return this._loadedStyleNames.has(t);
  },
  setLoadedStyleName: function(t) {
    this._loadedStyleNames.add(t);
  },
  deleteLoadedStyleName: function(t) {
    this._loadedStyleNames.delete(t);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function xa() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = ar();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var qn = U.extend({
  name: "common"
});
function ft(e) {
  "@babel/helpers - typeof";
  return ft = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ft(e);
}
function ja(e) {
  return Eo(e) || Ea(e) || jo(e) || xo();
}
function Ea(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function nt(e, t) {
  return Eo(e) || Aa(e, t) || jo(e, t) || xo();
}
function xo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function jo(e, t) {
  if (e) {
    if (typeof e == "string") return pn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? pn(e, t) : void 0;
  }
}
function pn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Aa(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, l, u, s = [], i = !0, p = !1;
    try {
      if (l = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (o = l.call(n)).done) && (s.push(o.value), s.length !== t); i = !0) ;
    } catch (m) {
      p = !0, r = m;
    } finally {
      try {
        if (!i && n.return != null && (u = n.return(), Object(u) !== u)) return;
      } finally {
        if (p) throw r;
      }
    }
    return s;
  }
}
function Eo(e) {
  if (Array.isArray(e)) return e;
}
function Yn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function L(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Yn(Object(n), !0).forEach(function(o) {
      at(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Yn(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function at(e, t, n) {
  return (t = La(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function La(e) {
  var t = Na(e, "string");
  return ft(t) == "symbol" ? t : t + "";
}
function Na(e, t) {
  if (ft(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (ft(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Kt = {
  name: "BaseComponent",
  props: {
    pt: {
      type: Object,
      default: void 0
    },
    ptOptions: {
      type: Object,
      default: void 0
    },
    unstyled: {
      type: Boolean,
      default: void 0
    },
    dt: {
      type: Object,
      default: void 0
    }
  },
  inject: {
    $parentInstance: {
      default: void 0
    }
  },
  watch: {
    isUnstyled: {
      immediate: !0,
      handler: function(t) {
        Q.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var o = this;
        Q.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return o._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, o, r, l, u, s, i, p, m, c, b = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, v = b ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, w = b ? (o = this.pt) === null || o === void 0 || (o = o.value) === null || o === void 0 ? void 0 : o[this.$.type.name] : this.pt;
    (r = w || v) === null || r === void 0 || (r = r.hooks) === null || r === void 0 || (l = r.onBeforeCreate) === null || l === void 0 || l.call(r);
    var h = (u = this.$primevueConfig) === null || u === void 0 || (u = u.pt) === null || u === void 0 ? void 0 : u._usept, k = h ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, T = h ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (p = this.$primevue) === null || p === void 0 || (p = p.config) === null || p === void 0 ? void 0 : p.pt;
    (m = T || k) === null || m === void 0 || (m = m[this.$.type.name]) === null || m === void 0 || (m = m.hooks) === null || m === void 0 || (c = m.onBeforeCreate) === null || c === void 0 || c.call(m), this.$attrSelector = xa(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = zr(kt(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = L({
      name: this.$.type.name,
      attrSelector: this.$attrSelector
    }, this.$params)), this._loadStyles(), this._hook("onBeforeMount");
  },
  mounted: function() {
    this._hook("onMounted");
  },
  beforeUpdate: function() {
    this._hook("onBeforeUpdate");
  },
  updated: function() {
    this._hook("onUpdated");
  },
  beforeUnmount: function() {
    this._hook("onBeforeUnmount");
  },
  unmounted: function() {
    this._removeThemeListeners(), this._unloadScopedThemeStyles(), this._hook("onUnmounted");
  },
  methods: {
    _hook: function(t) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), o = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), o?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return hn(t) ? t.apply(void 0, o) : Y.apply(void 0, o);
    },
    _load: function() {
      Ue.isStyleNameLoaded("base") || (U.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Ue.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Ue.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (qn.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Ue.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      F(t) && U.load(t, L({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!V.isStyleNameLoaded("common")) {
          var o, r, l = ((o = this.$style) === null || o === void 0 || (r = o.getCommonTheme) === null || r === void 0 ? void 0 : r.call(o)) || {}, u = l.primitive, s = l.semantic, i = l.global, p = l.style;
          U.load(u?.css, L({
            name: "primitive-variables"
          }, this.$styleOptions)), U.load(s?.css, L({
            name: "semantic-variables"
          }, this.$styleOptions)), U.load(i?.css, L({
            name: "global-variables"
          }, this.$styleOptions)), U.loadStyle(L({
            name: "global-style"
          }, this.$styleOptions), p), V.setLoadedStyleName("common");
        }
        if (!V.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var m, c, b, v, w = ((m = this.$style) === null || m === void 0 || (c = m.getComponentTheme) === null || c === void 0 ? void 0 : c.call(m)) || {}, h = w.css, k = w.style;
          (b = this.$style) === null || b === void 0 || b.load(h, L({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (v = this.$style) === null || v === void 0 || v.loadStyle(L({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), k), V.setLoadedStyleName(this.$style.name);
        }
        if (!V.isStyleNameLoaded("layer-order")) {
          var T, O, I = (T = this.$style) === null || T === void 0 || (O = T.getLayerOrderThemeCSS) === null || O === void 0 ? void 0 : O.call(T);
          U.load(I, L({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), V.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, o, r, l = ((n = this.$style) === null || n === void 0 || (o = n.getPresetTheme) === null || o === void 0 ? void 0 : o.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, u = l.css, s = (r = this.$style) === null || r === void 0 ? void 0 : r.load(u, L({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = s.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      Ue.clearLoadedStyleNames(), Q.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      Q.off("theme:change", this._loadCoreStyles), Q.off("theme:change", this._load), Q.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return yn(t, n, o);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, u = /./g.test(o) && !!r[o.split(".")[0]], s = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = s.mergeSections, p = i === void 0 ? !0 : i, m = s.mergeProps, c = m === void 0 ? !1 : m, b = l ? u ? this._useGlobalPT(this._getPTClassValue, o, r) : this._useDefaultPT(this._getPTClassValue, o, r) : void 0, v = u ? void 0 : this._getPTSelf(n, this._getPTClassValue, o, L(L({}, r), {}, {
        global: b || {}
      })), w = this._getPTDatasets(o);
      return p || !p && v ? c ? this._mergeProps(c, b, v, w) : L(L(L({}, b), v), w) : L(L({}, v), w);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, o = new Array(n > 1 ? n - 1 : 0), r = 1; r < n; r++)
        o[r - 1] = arguments[r];
      return Y(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(o)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(o))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = "data-pc-", l = o === "root" && F((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return o !== "transition" && L(L({}, o === "root" && L(L(at({}, "".concat(r, "name"), Ae(l ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), l && at({}, "".concat(r, "extend"), Ae(this.$.type.name))), {}, at({}, "".concat(this.$attrSelector), ""))), {}, at({}, "".concat(r, "section"), Ae(o)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return ie(t) || go(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, l = function(s) {
        var i, p = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, m = r ? r(s) : s, c = Ae(o), b = Ae(n.$name);
        return (i = p ? c !== b ? m?.[c] : void 0 : m?.[c]) !== null && i !== void 0 ? i : m;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: l(t.originalValue),
        value: l(t.value)
      } : l(t, !0);
    },
    _usePT: function(t, n, o, r) {
      var l = function(h) {
        return n(h, o, r);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var u, s = t._usept || ((u = this.$primevueConfig) === null || u === void 0 ? void 0 : u.ptOptions) || {}, i = s.mergeSections, p = i === void 0 ? !0 : i, m = s.mergeProps, c = m === void 0 ? !1 : m, b = l(t.originalValue), v = l(t.value);
        return b === void 0 && v === void 0 ? void 0 : ie(v) ? v : ie(b) ? b : p || !p && v ? c ? this._mergeProps(c, b, v) : L(L({}, b), v) : v;
      }
      return l(t);
    },
    _useGlobalPT: function(t, n, o) {
      return this._usePT(this.globalPT, t, n, o);
    },
    _useDefaultPT: function(t, n, o) {
      return this._usePT(this.defaultPT, t, n, o);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, L(L({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = Y(this.$_attrsWithoutPT, this.ptm(n, o));
      return r?.hasOwnProperty("id") && ((t = r.id) !== null && t !== void 0 || (r.id = this.$id)), r;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, L({
        instance: this
      }, o), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, L(L({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var r = this._getOptionValue(this.$style.inlineStyles, t, L(L({}, this.$params), o)), l = this._getOptionValue(qn.inlineStyles, t, L(L({}, this.$params), o));
        return [l, r];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(o) {
        return ce(o, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(o) {
        return n._getOptionValue(o, n.$name, L({}, n.$params)) || ce(o, L({}, n.$params));
      });
    },
    isUnstyled: function() {
      var t;
      return this.unstyled !== void 0 ? this.unstyled : (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var t, n = Object.keys(((t = this.$.vnode) === null || t === void 0 ? void 0 : t.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(o) {
        var r = nt(o, 1), l = r[0];
        return n?.includes(l);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return L(L({
        classes: void 0,
        inlineStyles: void 0,
        load: function() {
        },
        loadCSS: function() {
        },
        loadStyle: function() {
        }
      }, (this._getHostInstance(this) || {}).$style), this.$options.style);
    },
    $styleOptions: function() {
      var t;
      return {
        nonce: (t = this.$primevueConfig) === null || t === void 0 || (t = t.csp) === null || t === void 0 ? void 0 : t.nonce
      };
    },
    $primevueConfig: function() {
      var t;
      return (t = this.$primevue) === null || t === void 0 ? void 0 : t.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var t = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: t,
          props: t?.$props,
          state: t?.$data,
          attrs: t?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = nt(t, 1), o = n[0];
        return o?.startsWith("pt:");
      }).reduce(function(t, n) {
        var o = nt(n, 2), r = o[0], l = o[1], u = r.split(":"), s = ja(u), i = pn(s).slice(1);
        return i?.reduce(function(p, m, c, b) {
          return !p[m] && (p[m] = c === b.length - 1 ? l : {}), p[m];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = nt(t, 1), o = n[0];
        return !(o != null && o.startsWith("pt:"));
      }).reduce(function(t, n) {
        var o = nt(n, 2), r = o[0], l = o[1];
        return t[r] = l, t;
      }, {});
    }
  }
}, Da = `
.p-icon {
    display: inline-block;
    vertical-align: baseline;
    flex-shrink: 0;
}

.p-icon-spin {
    -webkit-animation: p-icon-spin 2s infinite linear;
    animation: p-icon-spin 2s infinite linear;
}

@-webkit-keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}

@keyframes p-icon-spin {
    0% {
        -webkit-transform: rotate(0deg);
        transform: rotate(0deg);
    }
    100% {
        -webkit-transform: rotate(359deg);
        transform: rotate(359deg);
    }
}
`, Ra = U.extend({
  name: "baseicon",
  css: Da
});
function mt(e) {
  "@babel/helpers - typeof";
  return mt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, mt(e);
}
function Qn(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function Zn(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Qn(Object(n), !0).forEach(function(o) {
      Ma(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Qn(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function Ma(e, t, n) {
  return (t = Ia(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ia(e) {
  var t = Va(e, "string");
  return mt(t) == "symbol" ? t : t + "";
}
function Va(e, t) {
  if (mt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (mt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var za = {
  name: "BaseIcon",
  extends: Kt,
  props: {
    label: {
      type: String,
      default: void 0
    },
    spin: {
      type: Boolean,
      default: !1
    }
  },
  style: Ra,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = Ye(this.label);
      return Zn(Zn({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: t ? void 0 : "img",
        "aria-label": t ? void 0 : this.label,
        "aria-hidden": t
      });
    }
  }
};
function vt(e) {
  "@babel/helpers - typeof";
  return vt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, vt(e);
}
function Jn(e, t) {
  return Fa(e) || Wa(e, t) || Ua(e, t) || Ba();
}
function Ba() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ua(e, t) {
  if (e) {
    if (typeof e == "string") return Xn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Xn(e, t) : void 0;
  }
}
function Xn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Wa(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var o, r, l, u, s = [], i = !0, p = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(i = (o = l.call(n)).done) && (s.push(o.value), s.length !== t); i = !0) ;
    } catch (m) {
      p = !0, r = m;
    } finally {
      try {
        if (!i && n.return != null && (u = n.return(), Object(u) !== u)) return;
      } finally {
        if (p) throw r;
      }
    }
    return s;
  }
}
function Fa(e) {
  if (Array.isArray(e)) return e;
}
function eo(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var o = Object.getOwnPropertySymbols(e);
    t && (o = o.filter(function(r) {
      return Object.getOwnPropertyDescriptor(e, r).enumerable;
    })), n.push.apply(n, o);
  }
  return n;
}
function D(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? eo(Object(n), !0).forEach(function(o) {
      fn(e, o, n[o]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : eo(Object(n)).forEach(function(o) {
      Object.defineProperty(e, o, Object.getOwnPropertyDescriptor(n, o));
    });
  }
  return e;
}
function fn(e, t, n) {
  return (t = Ha(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ha(e) {
  var t = Ka(e, "string");
  return vt(t) == "symbol" ? t : t + "";
}
function Ka(e, t) {
  if (vt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (vt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var A = {
  _getMeta: function() {
    return [Ne(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], ce(Ne(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var o, r, l;
    return (o = (t == null || (r = t.instance) === null || r === void 0 ? void 0 : r.$primevue) || (n == null || (l = n.ctx) === null || l === void 0 || (l = l.appContext) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.globalProperties) === null || l === void 0 ? void 0 : l.$primevue)) === null || o === void 0 ? void 0 : o.config;
  },
  _getOptionValue: yn,
  _getPTValue: function() {
    var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", u = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var O = A._getOptionValue.apply(A, arguments);
      return ie(O) || go(O) ? {
        class: O
      } : O;
    }, p = ((t = o.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = o.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, m = p.mergeSections, c = m === void 0 ? !0 : m, b = p.mergeProps, v = b === void 0 ? !1 : b, w = s ? A._useDefaultPT(o, o.defaultPT(), i, l, u) : void 0, h = A._usePT(o, A._getPT(r, o.$name), i, l, D(D({}, u), {}, {
      global: w || {}
    })), k = A._getPTDatasets(o, l);
    return c || !c && h ? v ? A._mergeProps(o, v, w, h, k) : D(D(D({}, w), h), k) : D(D({}, h), k);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = "data-pc-";
    return D(D({}, n === "root" && fn({}, "".concat(o, "name"), Ae(t.$name))), {}, fn({}, "".concat(o, "section"), Ae(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, r = function(u) {
      var s, i = o ? o(u) : u, p = Ae(n);
      return (s = i?.[p]) !== null && s !== void 0 ? s : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: r(t.originalValue),
      value: r(t.value)
    } : r(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0, u = function(k) {
      return o(k, r, l);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, i = n._usept || ((s = t.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, p = i.mergeSections, m = p === void 0 ? !0 : p, c = i.mergeProps, b = c === void 0 ? !1 : c, v = u(n.originalValue), w = u(n.value);
      return v === void 0 && w === void 0 ? void 0 : ie(w) ? w : ie(v) ? v : m || !m && w ? b ? A._mergeProps(t, b, v, w) : D(D({}, v), w) : w;
    }
    return u(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 ? arguments[2] : void 0, r = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0;
    return A._usePT(t, n, o, r, l);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, l = A._getConfig(o, r), u = {
      nonce: l == null || (t = l.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    A._loadCoreStyles(n, u), A._loadThemeStyles(n, u), A._loadScopedThemeStyles(n, u), A._removeThemeListeners(n), n.$loadStyles = function() {
      return A._loadThemeStyles(n, u);
    }, A._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0;
    if (!Ue.isStyleNameLoaded((t = o.$style) === null || t === void 0 ? void 0 : t.name) && (n = o.$style) !== null && n !== void 0 && n.name) {
      var l;
      U.loadCSS(r), (l = o.$style) === null || l === void 0 || l.loadCSS(r), Ue.setLoadedStyleName(o.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, o, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, l = arguments.length > 1 ? arguments[1] : void 0;
    if (!(r != null && r.isUnstyled() || (r == null || (t = r.theme) === null || t === void 0 ? void 0 : t.call(r)) === "none")) {
      if (!V.isStyleNameLoaded("common")) {
        var u, s, i = ((u = r.$style) === null || u === void 0 || (s = u.getCommonTheme) === null || s === void 0 ? void 0 : s.call(u)) || {}, p = i.primitive, m = i.semantic, c = i.global, b = i.style;
        U.load(p?.css, D({
          name: "primitive-variables"
        }, l)), U.load(m?.css, D({
          name: "semantic-variables"
        }, l)), U.load(c?.css, D({
          name: "global-variables"
        }, l)), U.loadStyle(D({
          name: "global-style"
        }, l), b), V.setLoadedStyleName("common");
      }
      if (!V.isStyleNameLoaded((n = r.$style) === null || n === void 0 ? void 0 : n.name) && (o = r.$style) !== null && o !== void 0 && o.name) {
        var v, w, h, k, T = ((v = r.$style) === null || v === void 0 || (w = v.getDirectiveTheme) === null || w === void 0 ? void 0 : w.call(v)) || {}, O = T.css, I = T.style;
        (h = r.$style) === null || h === void 0 || h.load(O, D({
          name: "".concat(r.$style.name, "-variables")
        }, l)), (k = r.$style) === null || k === void 0 || k.loadStyle(D({
          name: "".concat(r.$style.name, "-style")
        }, l), I), V.setLoadedStyleName(r.$style.name);
      }
      if (!V.isStyleNameLoaded("layer-order")) {
        var _, x, H = (_ = r.$style) === null || _ === void 0 || (x = _.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(_);
        U.load(H, D({
          name: "layer-order",
          first: !0
        }, l)), V.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, o = t.preset();
    if (o && t.$attrSelector) {
      var r, l, u, s = ((r = t.$style) === null || r === void 0 || (l = r.getPresetTheme) === null || l === void 0 ? void 0 : l.call(r, o, "[".concat(t.$attrSelector, "]"))) || {}, i = s.css, p = (u = t.$style) === null || u === void 0 ? void 0 : u.load(i, D({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = p.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Ue.clearLoadedStyleNames(), Q.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    Q.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, o, r, l, u) {
    var s, i, p = "on".concat(Lr(n)), m = A._getConfig(r, l), c = o?.$instance, b = A._usePT(c, A._getPT(r == null || (s = r.value) === null || s === void 0 ? void 0 : s.pt, t), A._getOptionValue, "hooks.".concat(p)), v = A._useDefaultPT(c, m == null || (i = m.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], A._getOptionValue, "hooks.".concat(p)), w = {
      el: o,
      binding: r,
      vnode: l,
      prevVnode: u
    };
    b?.(c, w), v?.(c, w);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, o = new Array(n > 2 ? n - 2 : 0), r = 2; r < n; r++)
      o[r - 2] = arguments[r];
    return hn(t) ? t.apply(void 0, o) : Y.apply(void 0, o);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = function(s, i, p, m, c) {
      var b, v, w, h;
      i._$instances = i._$instances || {};
      var k = A._getConfig(p, m), T = i._$instances[t] || {}, O = Ye(T) ? D(D({}, n), n?.methods) : {};
      i._$instances[t] = D(D({}, T), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: p,
        $modifiers: p?.modifiers,
        $value: p?.value,
        $el: T.$el || i || void 0,
        $style: D({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: k,
        $attrSelector: (b = i.$pd) === null || b === void 0 || (b = b[t]) === null || b === void 0 ? void 0 : b.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return A._getPT(k?.pt, void 0, function(_) {
            var x;
            return _ == null || (x = _.directives) === null || x === void 0 ? void 0 : x[t];
          });
        },
        isUnstyled: function() {
          var _, x;
          return ((_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$binding) === null || _ === void 0 || (_ = _.value) === null || _ === void 0 ? void 0 : _.unstyled) !== void 0 ? (x = i._$instances[t]) === null || x === void 0 || (x = x.$binding) === null || x === void 0 || (x = x.value) === null || x === void 0 ? void 0 : x.unstyled : k?.unstyled;
        },
        theme: function() {
          var _;
          return (_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$primevueConfig) === null || _ === void 0 ? void 0 : _.theme;
        },
        preset: function() {
          var _;
          return (_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$binding) === null || _ === void 0 || (_ = _.value) === null || _ === void 0 ? void 0 : _.dt;
        },
        /* instance's methods */
        ptm: function() {
          var _, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", H = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return A._getPTValue(i._$instances[t], (_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$binding) === null || _ === void 0 || (_ = _.value) === null || _ === void 0 ? void 0 : _.pt, x, D({}, H));
        },
        ptmo: function() {
          var _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", H = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return A._getPTValue(i._$instances[t], _, x, H, !1);
        },
        cx: function() {
          var _, x, H = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", oe = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (_ = i._$instances[t]) !== null && _ !== void 0 && _.isUnstyled() ? void 0 : A._getOptionValue((x = i._$instances[t]) === null || x === void 0 || (x = x.$style) === null || x === void 0 ? void 0 : x.classes, H, D({}, oe));
        },
        sx: function() {
          var _, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", H = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, oe = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return H ? A._getOptionValue((_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$style) === null || _ === void 0 ? void 0 : _.inlineStyles, x, D({}, oe)) : void 0;
        }
      }, O), i.$instance = i._$instances[t], (v = (w = i.$instance)[s]) === null || v === void 0 || v.call(w, i, p, m, c), i["$".concat(t)] = i.$instance, A._hook(t, s, i, p, m, c), i.$pd || (i.$pd = {}), i.$pd[t] = D(D({}, (h = i.$pd) === null || h === void 0 ? void 0 : h[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, r = function(s) {
      var i, p, m, c = s._$instances[t], b = c?.watch, v = function(k) {
        var T, O = k.newValue, I = k.oldValue;
        return b == null || (T = b.config) === null || T === void 0 ? void 0 : T.call(c, O, I);
      }, w = function(k) {
        var T, O = k.newValue, I = k.oldValue;
        return b == null || (T = b["config.ripple"]) === null || T === void 0 ? void 0 : T.call(c, O, I);
      };
      c.$watchersCallback = {
        config: v,
        "config.ripple": w
      }, b == null || (i = b.config) === null || i === void 0 || i.call(c, c?.$primevueConfig), We.on("config:change", v), b == null || (p = b["config.ripple"]) === null || p === void 0 || p.call(c, c == null || (m = c.$primevueConfig) === null || m === void 0 ? void 0 : m.ripple), We.on("config:ripple:change", w);
    }, l = function(s) {
      var i = s._$instances[t].$watchersCallback;
      i && (We.off("config:change", i.config), We.off("config:ripple:change", i["config.ripple"]), s._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, p, m) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: Hr("pd")
        }, o("created", s, i, p, m);
      },
      beforeMount: function(s, i, p, m) {
        var c;
        A._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, p), o("beforeMount", s, i, p, m), r(s);
      },
      mounted: function(s, i, p, m) {
        var c;
        A._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, p), o("mounted", s, i, p, m);
      },
      beforeUpdate: function(s, i, p, m) {
        o("beforeUpdate", s, i, p, m);
      },
      updated: function(s, i, p, m) {
        var c;
        A._loadStyles((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance, i, p), o("updated", s, i, p, m);
      },
      beforeUnmount: function(s, i, p, m) {
        var c;
        l(s), A._removeThemeListeners((c = s.$pd[t]) === null || c === void 0 ? void 0 : c.instance), o("beforeUnmount", s, i, p, m);
      },
      unmounted: function(s, i, p, m) {
        var c;
        (c = s.$pd[t]) === null || c === void 0 || (c = c.instance) === null || c === void 0 || (c = c.scopedStyleEl) === null || c === void 0 || (c = c.value) === null || c === void 0 || c.remove(), o("unmounted", s, i, p, m);
      }
    };
  },
  extend: function() {
    var t = A._getMeta.apply(A, arguments), n = Jn(t, 2), o = n[0], r = n[1];
    return D({
      extend: function() {
        var u = A._getMeta.apply(A, arguments), s = Jn(u, 2), i = s[0], p = s[1];
        return A.extend(i, D(D(D({}, r), r?.methods), p));
      }
    }, A._extend(o, r));
  }
}, Ga = `
    .p-ink {
        display: block;
        position: absolute;
        background: dt('ripple.background');
        border-radius: 100%;
        transform: scale(0);
        pointer-events: none;
    }

    .p-ink-active {
        animation: ripple 0.4s linear;
    }

    @keyframes ripple {
        100% {
            opacity: 0;
            transform: scale(2.5);
        }
    }
`, qa = {
  root: "p-ink"
}, Ya = U.extend({
  name: "ripple-directive",
  style: Ga,
  classes: qa
}), Qa = A.extend({
  style: Ya
});
function bt(e) {
  "@babel/helpers - typeof";
  return bt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, bt(e);
}
function Za(e) {
  return ti(e) || ei(e) || Xa(e) || Ja();
}
function Ja() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Xa(e, t) {
  if (e) {
    if (typeof e == "string") return mn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? mn(e, t) : void 0;
  }
}
function ei(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ti(e) {
  if (Array.isArray(e)) return mn(e);
}
function mn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function to(e, t, n) {
  return (t = ni(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ni(e) {
  var t = oi(e, "string");
  return bt(t) == "symbol" ? t : t + "";
}
function oi(e, t) {
  if (bt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (bt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ri = Qa.extend("ripple", {
  watch: {
    "config.ripple": function(t) {
      t ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(t) {
    this.remove(t);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(t) {
      t.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(t) {
      t.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(t) {
      var n = this.getInk(t);
      n || (n = Vr("span", to(to({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), t.appendChild(n), this.$el = n);
    },
    remove: function(t) {
      var n = this.getInk(t);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(t), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(t) {
      var n = this, o = t.currentTarget, r = this.getInk(o);
      if (!(!r || getComputedStyle(r, null).display === "none")) {
        if (!this.isUnstyled() && ln(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"), !Nn(r) && !Dn(r)) {
          var l = Math.max(Rr(o), Wr(o));
          r.style.height = l + "px", r.style.width = l + "px";
        }
        var u = Ur(o), s = t.pageX - u.left + document.body.scrollTop - Dn(r) / 2, i = t.pageY - u.top + document.body.scrollLeft - Nn(r) / 2;
        r.style.top = i + "px", r.style.left = s + "px", !this.isUnstyled() && Dr(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          r && (!n.isUnstyled() && ln(r, "p-ink-active"), r.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && ln(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Za(t.children).find(function(n) {
        return Br(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const ai = "data-wippy-overlay-layer";
function Ao() {
  return typeof window < "u" && typeof window.document < "u";
}
function Lo() {
  return Ao() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ii() {
  return Lo() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const li = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let si = 0;
const Wt = /* @__PURE__ */ new WeakMap();
function no(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function ui(e, t) {
  if (!li.test(e.className))
    return;
  const n = e.style.cssText;
  no(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Wt.has(e)) {
    const o = new MutationObserver(() => {
      const r = e.style;
      (r.top !== "auto" || r.left !== "auto" || r.margin !== "0px" || r.getPropertyPriority("top") !== "important" || r.getPropertyPriority("left") !== "important" || r.getPropertyPriority("margin") !== "important" || r.getPropertyPriority("min-width") !== "important" || r.maxWidth !== "stretch" || r.getPropertyPriority("max-width") !== "important") && no(e, t);
    });
    o.observe(e, { attributes: !0, attributeFilter: ["style"] }), Wt.set(e, o);
  }
}
function wn(e) {
  const t = Wt.get(e);
  t && (t.disconnect(), Wt.delete(e));
}
function di(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function vn(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Ft = /* @__PURE__ */ new Set(), kn = /* @__PURE__ */ new WeakMap();
let oo = !1, bn = !1;
function ci() {
  bn = !1;
  for (const e of Ft) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && wn(t);
      Ft.delete(e), kn.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && vn(e);
  }
}
function ro() {
  bn || (bn = !0, requestAnimationFrame(ci));
}
function pi(e) {
  const t = document.createElement("div");
  t.setAttribute(ai, "");
  const n = Lo();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  vn(t);
  const o = new MutationObserver((r) => {
    const l = t.__wippyAnchorName;
    for (const u of r) {
      if (l)
        for (const s of Array.from(u.addedNodes))
          s instanceof HTMLElement && ui(s, l);
      for (const s of Array.from(u.removedNodes))
        s instanceof HTMLElement && wn(s);
    }
    t.isConnected && t.childElementCount > 0 && vn(t);
  });
  return o.observe(t, { childList: !0 }), kn.set(t, o), Ft.add(t), oo || (oo = !0, window.addEventListener("scroll", ro, { capture: !0, passive: !0 }), window.addEventListener("resize", ro, { passive: !0 })), t;
}
function ao(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = pi(e.hostRoot), ii())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++si}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function io(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && wn(t);
    Ft.delete(e.layer), kn.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let lo = !1;
function fi() {
  if (lo)
    return;
  lo = !0;
  const e = Oo;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    Ao() && (this.hostRoot = di(this.$el), this.mounted = !0, this.hostRoot && (this.inline || ao(this), this.$watch("inline", (t) => {
      t ? io(this) : ao(this);
    })));
  }, e.render = function() {
    return this.inline ? Pe(this.$slots, "default", { key: 0 }) : this.mounted ? ir(fo, { key: 1, to: this.resolvedTarget || document.body }, [
      Pe(this.$slots, "default")
    ]) : j("", !0);
  }, e.unmounted = function() {
    io(this);
  };
}
const mi = {
  install: (e) => {
    fi(), e.use(Pa, { theme: "none" });
  }
}, vi = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function bi(e, t) {
  return {
    "entry-id": e.id,
    route: e.id,
    mode: t,
    "read-only": String(e.access_level != null && (e.access_level & 2) !== 2)
  };
}
const gi = () => Zo(), hi = () => Jo(), yi = {
  key: 0,
  class: "ws-renderer-fail"
}, Vt = /* @__PURE__ */ Oe({
  __name: "EntryRenderer",
  props: {
    tag: {},
    attrs: {},
    fill: { type: Boolean, default: !0 }
  },
  setup(e) {
    const t = e, n = E(null), o = E(!1);
    let r = null;
    async function l(s) {
      if (!customElements.get(s) && (await vo(s, { timeoutMs: 8e3 }), !customElements.get(s)))
        throw new Error("Content is unavailable.");
    }
    async function u() {
      if (o.value = !1, !!n.value) {
        n.value.innerHTML = "", r = null;
        try {
          await l(t.tag), r = document.createElement(t.tag);
          for (const [s, i] of Object.entries(t.attrs || {}))
            i != null && i !== "" && r.setAttribute(s, String(i));
          t.fill === !1 ? (r.style.display = "block", r.style.width = "100%") : (r.style.position = "absolute", r.style.inset = "0"), n.value.appendChild(r), o.value = !customElements.get(t.tag);
        } catch {
          o.value = !0;
        }
      }
    }
    return wt(u), Le(() => [t.tag, JSON.stringify(t.attrs)], u), Ht(() => {
      r = null;
    }), (s, i) => (y(), C("div", {
      class: de(["ws-renderer-host", { "ws-renderer-flow": e.fill === !1 }])
    }, [
      o.value ? (y(), C("div", yi, [
        P(S(it), { tone: "error" }, {
          default: G(() => [
            i[1] || (i[1] = R("Content is unavailable. ", -1)),
            P(S(ke), { onClick: u }, {
              default: G(() => [...i[0] || (i[0] = [
                R("Retry", -1)
              ])]),
              _: 1
            })
          ]),
          _: 1
        })
      ])) : j("", !0),
      mo(g("div", {
        ref_key: "host",
        ref: n,
        class: "ws-renderer-mount"
      }, null, 512), [
        [lr, !o.value]
      ])
    ], 2));
  }
}), wi = /* @__PURE__ */ Oe({
  __name: "MenuLayer",
  props: {
    x: {},
    y: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = E(null), r = E(null), l = E({ left: "0px", top: "0px", visibility: "hidden" });
    function u() {
      const i = o.value?.getBoundingClientRect(), p = r.value?.getBoundingClientRect();
      if (!i || !p) return;
      const m = Math.max(0, Math.min(n.x - i.left, i.width - p.width)), c = Math.max(0, Math.min(n.y - i.top, i.height - p.height));
      l.value = { left: `${m}px`, top: `${c}px`, visibility: "visible" };
    }
    Le(() => [n.x, n.y], () => {
      zt(u);
    }), wt(() => {
      zt(u), window.addEventListener("resize", u);
    }), Ht(() => window.removeEventListener("resize", u));
    const s = t;
    return (i, p) => (y(), C("div", {
      ref_key: "layer",
      ref: o,
      class: "ws-menu-layer",
      onClick: p[1] || (p[1] = (m) => s("close")),
      onContextmenu: p[2] || (p[2] = q((m) => s("close"), ["prevent"]))
    }, [
      g("div", {
        ref_key: "panel",
        ref: r,
        class: "ws-menu",
        style: Ve(l.value),
        onClick: p[0] || (p[0] = q(() => {
        }, ["stop"]))
      }, [
        Pe(i.$slots, "default")
      ], 4)
    ], 544));
  }
}), ki = ["onKeydown"], Si = {
  class: "ws-dialog",
  role: "dialog",
  "aria-modal": "true",
  "aria-label": "Sharing"
}, $i = { class: "ws-dialog-foot" }, _i = /* @__PURE__ */ Oe({
  __name: "ShareHost",
  props: {
    config: {}
  },
  emits: ["close", "changed"],
  setup(e, { emit: t }) {
    const n = e, o = t, r = E(null);
    let l = null;
    const u = E(!1);
    function s() {
      o("close");
    }
    function i(m) {
      o("changed", m.detail);
    }
    async function p() {
      if (u.value = !1, !!r.value)
        try {
          if (await vo("kickside-share", { timeoutMs: 8e3 }), !customElements.get("kickside-share")) throw new Error("Sharing is unavailable.");
          l = document.createElement("kickside-share"), n.config && l.setAttribute("config", n.config), l.addEventListener("close", s), l.addEventListener("changed", i), r.value.appendChild(l);
        } catch {
          u.value = !0;
        }
    }
    return wt(p), Le(() => n.config, (m) => {
      l && m && l.setAttribute("config", m);
    }), Ht(() => {
      l && (l.removeEventListener("close", s), l.removeEventListener("changed", i), l.remove(), l = null);
    }), (m, c) => (y(), C(X, null, [
      g("div", {
        ref_key: "host",
        ref: r,
        class: "ws-share-host"
      }, null, 512),
      u.value ? (y(), C("div", {
        key: 0,
        class: "ws-modal",
        onKeydown: rt(q(s, ["stop"]), ["esc"]),
        onClick: q(s, ["self"])
      }, [
        g("section", Si, [
          P(S(it), {
            tone: "error",
            onDismiss: s
          }, {
            default: G(() => [...c[0] || (c[0] = [
              R("Sharing is unavailable.", -1)
            ])]),
            _: 1
          }),
          g("div", $i, [
            P(S(ke), {
              "aria-label": "Retry sharing",
              onClick: p
            }, {
              default: G(() => [...c[1] || (c[1] = [
                R("Retry", -1)
              ])]),
              _: 1
            }),
            P(S(ke), {
              variant: "ghost",
              onClick: s
            }, {
              default: G(() => [...c[2] || (c[2] = [
                R("Close", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ], 40, ki)) : j("", !0)
    ], 64));
  }
}), Ci = { class: "ws-cv-section" }, Ti = { class: "ws-cv-row" }, Pi = { class: "ws-cv-v" }, Oi = { class: "ws-cv-row" }, xi = { class: "ws-cv-v" }, ji = { class: "ws-cv-row" }, Ei = { class: "ws-cv-v" }, Ai = {
  key: 0,
  class: "ws-cv-section"
}, Li = {
  key: 0,
  class: "ws-cv-row"
}, Ni = { class: "ws-cv-v" }, Di = {
  key: 1,
  class: "ws-cv-row"
}, Ri = { class: "ws-cv-v" }, Mi = {
  key: 1,
  class: "ws-cv-section"
}, Ii = { class: "ws-cv-k" }, Vi = { class: "ws-cv-v" }, so = /* @__PURE__ */ Oe({
  __name: "ComponentView",
  props: {
    entry: {},
    mode: {}
  },
  setup(e) {
    const t = e, n = /* @__PURE__ */ new Set(["title", "name", "icon", "type", "status", "color", "renderer"]);
    function o(m) {
      if (m == null || m === "") return null;
      if (typeof m == "number") return new Date(m < 2e10 ? m * 1e3 : m);
      const c = new Date(String(m));
      return isNaN(c.getTime()) ? null : c;
    }
    function r(m) {
      const c = o(m);
      return c ? c.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "";
    }
    const l = ne(() => ((t.entry.type || "item").split(".").pop() || "item").replace(/[_-]/g, " ").toUpperCase()), u = ne(() => r(t.entry.created_at)), s = ne(() => r(t.entry.updated_at)), i = ne(() => {
      const m = t.entry.access_level;
      if (m == null) return "Full (owner)";
      const c = [];
      return m & 1 && c.push("Read"), m & 2 && c.push("Write"), m & 4 && c.push("Delete"), m & 8 && c.push("Admin"), c.length ? c.join(" · ") : "None";
    }), p = ne(() => {
      const m = t.entry.meta || {}, c = [];
      for (const [b, v] of Object.entries(m)) {
        if (n.has(b) || v == null || typeof v == "object") continue;
        const w = String(v);
        w !== "" && c.push({ k: b.replace(/[_-]/g, " "), v: w });
      }
      return c;
    });
    return (m, c) => (y(), C("div", {
      class: de(["ws-cv", `ws-cv--${e.mode || "preview"}`])
    }, [
      g("div", Ci, [
        g("div", Ti, [
          c[0] || (c[0] = g("span", { class: "ws-cv-k" }, "Type", -1)),
          g("span", Pi, N(l.value), 1)
        ]),
        g("div", Oi, [
          c[1] || (c[1] = g("span", { class: "ws-cv-k" }, "Status", -1)),
          g("span", xi, N(e.entry.status || "active"), 1)
        ]),
        g("div", ji, [
          c[2] || (c[2] = g("span", { class: "ws-cv-k" }, "Access", -1)),
          g("span", Ei, N(i.value), 1)
        ])
      ]),
      u.value || s.value ? (y(), C("div", Ai, [
        u.value ? (y(), C("div", Li, [
          c[3] || (c[3] = g("span", { class: "ws-cv-k" }, "Created", -1)),
          g("span", Ni, N(u.value), 1)
        ])) : j("", !0),
        s.value ? (y(), C("div", Di, [
          c[4] || (c[4] = g("span", { class: "ws-cv-k" }, "Updated", -1)),
          g("span", Ri, N(s.value), 1)
        ])) : j("", !0)
      ])) : j("", !0),
      p.value.length ? (y(), C("div", Mi, [
        c[5] || (c[5] = g("div", { class: "ws-cv-sec-title" }, "Metadata", -1)),
        (y(!0), C(X, null, Be(p.value, (b) => (y(), C("div", {
          key: b.k,
          class: "ws-cv-row"
        }, [
          g("span", Ii, N(b.k), 1),
          g("span", Vi, N(b.v), 1)
        ]))), 128))
      ])) : j("", !0)
    ], 2));
  }
});
var No = {
  name: "SpinnerIcon",
  extends: za
};
function zi(e) {
  return Fi(e) || Wi(e) || Ui(e) || Bi();
}
function Bi() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ui(e, t) {
  if (e) {
    if (typeof e == "string") return gn(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? gn(e, t) : void 0;
  }
}
function Wi(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Fi(e) {
  if (Array.isArray(e)) return gn(e);
}
function gn(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, o = Array(t); n < t; n++) o[n] = e[n];
  return o;
}
function Hi(e, t, n, o, r, l) {
  return y(), C("svg", Y({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), zi(t[0] || (t[0] = [g("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
No.render = Hi;
var Ki = `
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
`, Gi = {
  root: function(t) {
    var n = t.props, o = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": F(n.value) && String(n.value).length === 1,
      "p-badge-dot": Ye(n.value) && !o.$slots.default,
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
}, qi = U.extend({
  name: "badge",
  style: Ki,
  classes: Gi
}), Yi = {
  name: "BaseBadge",
  extends: Kt,
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
  style: qi,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function gt(e) {
  "@babel/helpers - typeof";
  return gt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, gt(e);
}
function uo(e, t, n) {
  return (t = Qi(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Qi(e) {
  var t = Zi(e, "string");
  return gt(t) == "symbol" ? t : t + "";
}
function Zi(e, t) {
  if (gt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (gt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Do = {
  name: "Badge",
  extends: Yi,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return st(uo(uo({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, Ji = ["data-p"];
function Xi(e, t, n, o, r, l) {
  return y(), C("span", Y({
    class: e.cx("root"),
    "data-p": l.dataP
  }, e.ptmi("root")), [Pe(e.$slots, "default", {}, function() {
    return [R(N(e.value), 1)];
  })], 16, Ji);
}
Do.render = Xi;
var el = `
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
function ht(e) {
  "@babel/helpers - typeof";
  return ht = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ht(e);
}
function Ee(e, t, n) {
  return (t = tl(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function tl(e) {
  var t = nl(e, "string");
  return ht(t) == "symbol" ? t : t + "";
}
function nl(e, t) {
  if (ht(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (ht(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ol = {
  root: function(t) {
    var n = t.instance, o = t.props;
    return ["p-button p-component", Ee(Ee(Ee(Ee(Ee(Ee(Ee(Ee(Ee({
      "p-button-icon-only": n.hasIcon && !o.label && !o.badge,
      "p-button-vertical": (o.iconPos === "top" || o.iconPos === "bottom") && o.label,
      "p-button-loading": o.loading,
      "p-button-link": o.link || o.variant === "link"
    }, "p-button-".concat(o.severity), o.severity), "p-button-raised", o.raised), "p-button-rounded", o.rounded), "p-button-text", o.text || o.variant === "text"), "p-button-outlined", o.outlined || o.variant === "outlined"), "p-button-sm", o.size === "small"), "p-button-lg", o.size === "large"), "p-button-plain", o.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", Ee({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, rl = U.extend({
  name: "button",
  style: el,
  classes: ol
}), al = {
  name: "BaseButton",
  extends: Kt,
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
  style: rl,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function yt(e) {
  "@babel/helpers - typeof";
  return yt = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, yt(e);
}
function ae(e, t, n) {
  return (t = il(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function il(e) {
  var t = ll(e, "string");
  return yt(t) == "symbol" ? t : t + "";
}
function ll(e, t) {
  if (yt(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var o = n.call(e, t);
    if (yt(o) != "object") return o;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Ro = {
  name: "Button",
  extends: al,
  inheritAttrs: !1,
  inject: {
    $pcFluid: {
      default: null
    }
  },
  methods: {
    getPTOptions: function(t) {
      var n = t === "root" ? this.ptmi : this.ptm;
      return n(t, {
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
      return Y(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return Ye(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return st(ae(ae(ae(ae(ae(ae(ae(ae(ae(ae({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return st(ae(ae({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return st(ae(ae({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: No,
    Badge: Do
  },
  directives: {
    ripple: ri
  }
}, sl = ["data-p"], ul = ["data-p"];
function dl(e, t, n, o, r, l) {
  var u = On("SpinnerIcon"), s = On("Badge"), i = sr("ripple");
  return e.asChild ? Pe(e.$slots, "default", {
    key: 1,
    class: de(e.cx("root")),
    a11yAttrs: l.a11yAttrs
  }) : mo((y(), B(ur(e.as), Y({
    key: 0,
    class: e.cx("root"),
    "data-p": l.dataP
  }, l.attrs), {
    default: G(function() {
      return [Pe(e.$slots, "default", {}, function() {
        return [e.loading ? Pe(e.$slots, "loadingicon", Y({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (y(), C("span", Y({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (y(), B(u, Y({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : Pe(e.$slots, "icon", Y({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (y(), C("span", Y({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": l.dataIconP
          }, e.ptm("icon")), null, 16, sl)) : j("", !0)];
        }), e.label ? (y(), C("span", Y({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": l.dataLabelP
        }), N(e.label), 17, ul)) : j("", !0), e.badge ? (y(), B(s, {
          key: 3,
          value: e.badge,
          class: de(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : j("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[i]]);
}
Ro.render = dl;
var cl = `
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
`, pl = {
  root: "p-progressspinner",
  spin: "p-progressspinner-spin",
  circle: "p-progressspinner-circle"
}, fl = U.extend({
  name: "progressspinner",
  style: cl,
  classes: pl
}), ml = {
  name: "BaseProgressSpinner",
  extends: Kt,
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
  style: fl,
  provide: function() {
    return {
      $pcProgressSpinner: this,
      $parentInstance: this
    };
  }
}, Mo = {
  name: "ProgressSpinner",
  extends: ml,
  inheritAttrs: !1,
  computed: {
    svgStyle: function() {
      return {
        "animation-duration": this.animationDuration
      };
    }
  }
}, vl = ["fill", "stroke-width"];
function bl(e, t, n, o, r, l) {
  return y(), C("div", Y({
    class: e.cx("root"),
    role: "progressbar"
  }, e.ptmi("root")), [(y(), C("svg", Y({
    class: e.cx("spin"),
    viewBox: "25 25 50 50",
    style: l.svgStyle
  }, e.ptm("spin")), [g("circle", Y({
    class: e.cx("circle"),
    cx: "50",
    cy: "50",
    r: "20",
    fill: e.fill,
    "stroke-width": e.strokeWidth,
    strokeMiterlimit: "10"
  }, e.ptm("circle")), null, 16, vl)], 16))], 16);
}
Mo.render = bl;
const gl = { key: 0 }, co = /* @__PURE__ */ Oe({
  __name: "ComponentDeletion",
  props: {
    state: {}
  },
  emits: ["retry"],
  setup(e) {
    const t = e, n = ne(() => t.state.deletion_job === null || ["dead", "cancelled"].includes(t.state.deletion_job?.status || ""));
    return (o, r) => e.state.deleting_at ? (y(), C("span", {
      key: 0,
      class: "component-deletion",
      role: "status",
      onClick: r[1] || (r[1] = q(() => {
      }, ["stop"])),
      onKeydown: r[2] || (r[2] = q(() => {
      }, ["stop"]))
    }, [
      n.value ? (y(), C(X, { key: 0 }, [
        g("span", null, [
          r[3] || (r[3] = R("Deletion failed", -1)),
          e.state.deletion_job?.last_error ? (y(), C("span", gl, ": " + N(e.state.deletion_job.last_error), 1)) : j("", !0)
        ]),
        P(S(Ro), {
          label: "Retry deletion",
          severity: "secondary",
          size: "small",
          outlined: "",
          onClick: r[0] || (r[0] = q((l) => o.$emit("retry"), ["stop"]))
        })
      ], 64)) : (y(), C(X, { key: 1 }, [
        P(S(Mo), {
          class: "component-deletion-spinner",
          "aria-label": "Deletion in progress"
        }),
        r[4] || (r[4] = g("span", null, "Deleting…", -1))
      ], 64))
    ], 32)) : j("", !0);
  }
});
function ot(e) {
  return !!e && typeof e == "object" && !Array.isArray(e);
}
function hl(e, t) {
  return e;
}
function yl(e, t, n) {
  const o = ot(e) ? e : {}, r = [
    o,
    ot(o.data) ? o.data : null,
    ot(o.payload) ? o.payload : null,
    ot(o.detail) ? o.detail : null
  ].filter(Boolean);
  for (const l of r) {
    if (l.event !== "component.meta.changed" && l.event !== "component.deleting" && l.event !== "component.deleted") continue;
    const u = String(l.component_id || ""), s = String(o.topic || l.topic || "");
    if (!u && (!s.startsWith("component.") || s === "component.")) continue;
    const i = u || t || s.slice(10);
    return l.event === "component.deleting" && typeof l.deletion_job_id == "string" && l.deletion_job_id ? { event: l.event, component_id: i, deletion_job_id: l.deletion_job_id } : l.event !== "component.meta.changed" ? { event: l.event, component_id: i } : {
      event: "component.meta.changed",
      component_id: i,
      meta: hl(ot(l.meta) ? l.meta : {}),
      deleted: Array.isArray(l.deleted) ? l.deleted.map(String) : []
    };
  }
  return null;
}
function wl(e, t) {
  const n = yl(e, t);
  return n && n.event !== "component.meta.changed" ? n : null;
}
function po(e, t) {
  if (e && typeof e == "object") {
    const n = e, o = n.response?.data?.error;
    if (typeof o == "string") return o;
    if (o && typeof o == "object" && typeof o.message == "string")
      return o.message;
    if (typeof n.message == "string" && n.message) return n.message;
  }
  return t;
}
function kl(e, t, n, o) {
  let r = !0;
  const l = /* @__PURE__ */ new Set(), u = /* @__PURE__ */ new Map();
  function s(b, v) {
    const w = e.value.find((I) => t(I) === b), h = u.get(b), k = v?.job_id || h?.deletion_job_id || w?.deletion_job_id, T = h ? h.deletion_job_id : w?.deleting_at ? w.deletion_job_id : void 0;
    if ((h || w?.deleting_at) && k === T) return;
    const O = {
      deleting_at: h?.deleting_at || w?.deleting_at || (/* @__PURE__ */ new Date()).toISOString(),
      deletion_job_id: k
    };
    u.set(b, O), w && (Object.assign(w, O), w.deletion_job = void 0);
  }
  async function i(b) {
    const v = t(b), w = u.get(v), h = () => r && e.value.includes(b) && u.get(v) === w;
    try {
      const { data: k } = await pr.get(`/api/v1/components/${encodeURIComponent(v)}`);
      if (!k?.success) throw new Error(po(k, "Could not read deletion progress"));
      h() && (b.deleting_at = w?.deleting_at || k.deleting_at, b.deletion_job_id = k.deletion_job_id, w && (w.deletion_job_id = b.deletion_job_id), b.deletion_job = k.deletion_job ?? null);
    } catch (k) {
      h() && fr.handleError("other", { message: po(k, "Could not read deletion progress") });
    }
  }
  let p = [];
  const m = Le(() => e.value, (b, v = []) => {
    const w = b.filter((h) => !l.has(t(h)));
    for (const h of v)
      l.has(t(h)) || w.some((k) => t(k) === t(h)) || (n?.(t(h)), h.deleting_at && o?.(t(h)));
    if (w.length !== b.length) {
      e.value = w;
      return;
    }
    for (const h of b) {
      const k = u.get(t(h));
      k && (h.deletion_job_id !== k.deletion_job_id && (h.deletion_job = void 0), Object.assign(h, k));
      const T = v.find((O) => t(O) === t(h));
      h.deletion_job === void 0 && T?.deletion_job_id === h.deletion_job_id && (h.deletion_job = T?.deletion_job), h.deleting_at && !p.includes(h) && i(h);
    }
    p = b;
  }, { immediate: !0 }), c = cr("@message", (b) => {
    const v = wl(b);
    if (!v) return;
    const w = e.value.find((h) => t(h) === v.component_id);
    v.event === "component.deleted" ? (w && !l.has(v.component_id) && (n?.(v.component_id), o?.(v.component_id)), l.add(v.component_id), u.delete(v.component_id), e.value = e.value.filter((h) => t(h) !== v.component_id)) : w && s(v.component_id, { job_id: v.deletion_job_id });
  });
  return Ht(() => {
    r = !1, m(), typeof c == "function" && c();
  }), { acceptDeletion: s };
}
const Sl = { class: "ws-strip" }, $l = { class: "ws-crumbs" }, _l = ["title", "onClick", "onDragover", "onDrop"], Cl = { class: "ws-body" }, Tl = {
  key: 0,
  class: "ws-drop-hint"
}, Pl = {
  key: 2,
  class: "ws-list"
}, Ol = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], xl = { class: "ws-row-name" }, jl = { class: "ws-age" }, El = ["aria-label", "onClick"], Al = {
  key: 3,
  class: "ws-grid"
}, Ll = ["draggable", "onDragstart", "onDragover", "onDrop", "onClick", "onDblclick", "onKeydown", "onContextmenu"], Nl = ["aria-label", "onClick"], Dl = ["title"], Rl = { class: "ws-preview-head" }, Ml = { class: "ws-preview-title" }, Il = {
  key: 5,
  class: "ws-menu-div"
}, Vl = { class: "ws-dialog" }, zl = {
  class: "ws-dialog-head",
  id: "ws-new-heading"
}, Bl = { class: "ws-type-grid" }, Ul = ["title", "onClick"], Wl = { class: "ws-create-panel" }, Fl = { class: "ws-dialog" }, Hl = { class: "ws-dialog-head" }, Kl = {
  key: 0,
  class: "ws-confirm-body"
}, Gl = {
  key: 1,
  class: "ws-confirm-body"
}, ql = {
  key: 2,
  class: "ws-confirm-body"
}, Yl = { class: "ws-dialog-foot" }, Ql = { class: "ws-dialog-head" }, Zl = { class: "ws-name-row" }, Jl = { class: "ws-swatches" }, Xl = ["title", "aria-label", "onClick"], es = { class: "ws-meta-grid" }, ts = { class: "ws-dialog-foot" }, ns = { class: "ws-dialog" }, os = { class: "ws-dialog-head" }, rs = { class: "ws-move-crumbs" }, as = ["onClick"], is = { class: "ws-move-list" }, ls = ["onClick"], ss = {
  key: 0,
  class: "ws-move-none"
}, us = { class: "ws-dialog-foot" }, ds = {
  key: 9,
  class: "ws-manage"
}, cs = { class: "ws-manage-head" }, ps = { class: "ws-manage-title" }, fs = "wc-entry-create", ms = /* @__PURE__ */ Oe({
  __name: "Workspace",
  setup(e) {
    const t = Xo(), n = gi(), o = hi(), r = { READ: 1, WRITE: 2, DELETE: 4, ADMIN: 8 };
    function l(f, a) {
      const d = f?.access_level;
      return d == null || (Number(d) & a) === a;
    }
    function u(f) {
      return !!f && (f.type === "folder" || !!f.container);
    }
    function s(f) {
      if (f == null) return "Full";
      const a = Number(f), $ = [[r.READ, "Read"], [r.WRITE, "Write"], [r.DELETE, "Delete"], [r.ADMIN, "Admin"]].filter(([se]) => (a & se) === se).map(([, se]) => se);
      return $.length ? $.join(" · ") : "None";
    }
    const i = E([]), p = E(""), m = E([]), c = E(null), b = E(null), v = E(null), w = E(!1), h = E(""), k = E(localStorage.getItem("ws-view") || "list"), T = E(!1), O = E(null), I = E(null), _ = E(!1), x = E(!1), H = ne(() => {
      const f = {};
      for (const a of t.types.value) f[a.value] = a;
      return f;
    }), oe = ne(() => {
      const f = /* @__PURE__ */ new Set(), a = /* @__PURE__ */ new Set();
      for (const d of t.types.value) (f.has(d.value) ? a : f).add(d.value);
      return a;
    }), xe = ne(() => t.types.value.filter((f) => f.creatable && !f.picker_excluded && f.create?.view).sort((f, a) => f.value === "folder" ? -1 : a.value === "folder" ? 1 : (f.label || "").localeCompare(a.label || ""))), pe = ne(() => l(b.value, r.WRITE)), fe = ne(() => {
      const f = p.value.trim().toLowerCase();
      return (f ? i.value.filter((d) => (d.name || "").toLowerCase().includes(f)) : [...i.value]).sort((d, $) => {
        const se = u(d) ? 0 : 1, tt = u($) ? 0 : 1;
        return se !== tt ? se - tt : (d.name || "").localeCompare($.name || "", void 0, { sensitivity: "base" });
      });
    });
    function re(f) {
      return f.icon || f.meta?.icon || H.value[f.type]?.icon || "tabler:file";
    }
    function le(f) {
      return f.meta?.color || H.value[f.type]?.color || "var(--km-muted)";
    }
    function Se(f) {
      const a = oe.value.has(f.type) ? "" : H.value[f.type]?.label;
      return a ? a.toUpperCase() : ((f.type || "item").split(".").pop() || "item").replace(/[_-]+/g, " ").toUpperCase();
    }
    function $e(f) {
      if (f == null || f === "") return null;
      if (typeof f == "number") return new Date(f < 2e10 ? f * 1e3 : f);
      const a = new Date(String(f));
      return isNaN(a.getTime()) ? null : a;
    }
    function De(f) {
      const a = $e(f);
      if (!a) return "";
      const d = Math.floor((Date.now() - a.getTime()) / 1e3);
      return d < 60 ? "now" : d < 3600 ? Math.floor(d / 60) + "m" : d < 86400 ? Math.floor(d / 3600) + "h" : Math.floor(d / 86400) + "d";
    }
    function Re(f) {
      const a = $e(f);
      return a ? a.toLocaleString(void 0, { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—";
    }
    function me(f) {
      const a = f.renderer || H.value[f.type]?.renderer;
      return a ? a.startsWith("/c/") ? a.slice(3) : a : "";
    }
    function Me(f, a) {
      const d = bi(f, a), $ = f.meta?.upload_id;
      return $ && (d["source-url"] = `/api/v1/uploads/${$}/raw`, d["content-type"] = f.meta?.content_type || "", d.filename = f.name), d;
    }
    const W = E(null), ve = ne(() => String(n.value.route || "").replace(/^\/+|\/+$/g, "").split("/")[0] || "");
    function ee(f) {
      ye(), o("navigate", f.id);
    }
    function be() {
      o("navigate", c.value || "");
    }
    async function Fe() {
      const f = ve.value;
      if (!f) {
        W.value = null, (c.value !== null || i.value.length === 0) && await Z(null);
        return;
      }
      let a = i.value.find(($) => $.id === f) || null;
      if (!a)
        try {
          a = await t.get(f);
        } catch ($) {
          h.value = $ instanceof Error ? $.message : "failed to open entry";
          return;
        }
      if (!a) {
        h.value = "entry not found";
        return;
      }
      if (u(a)) {
        W.value = null, c.value !== f && await Z(f);
        return;
      }
      const d = a.parent_id ?? null;
      (c.value !== d || i.value.length === 0) && await Z(d), W.value = a;
    }
    Le(ve, Fe);
    let ge = 0;
    async function Z(f) {
      const a = f === c.value && i.value.length > 0;
      c.value = f, a || (v.value = null, p.value = "", w.value = !0), ye(), h.value = "";
      const d = ++ge;
      try {
        const $ = await t.list(f);
        if (d !== ge) return;
        i.value = $;
        const se = v.value;
        if (se && !$.some((tt) => tt.id === se.id) && (v.value = null), m.value = f ? await t.breadcrumbs(f) : [], b.value = f ? await t.get(f) : null, d !== ge) return;
      } catch ($) {
        if (d !== ge) return;
        h.value = $ instanceof Error ? $.message : "failed to load", a || (i.value = []);
      } finally {
        d === ge && (w.value = !1);
      }
    }
    function je(f) {
      if (u(f)) {
        o("navigate", f.id);
        return;
      }
      v.value = v.value?.id === f.id ? null : f;
    }
    const St = ne(() => ({
      type: O.value?.value || "",
      "parent-id": c.value || "",
      mode: "create"
    })), Gt = ne(() => O.value?.create?.view === fs);
    function qt(f) {
      T.value = !1, O.value = f;
    }
    function $t() {
      O.value = null, Z(c.value);
    }
    function Yt() {
      Z(c.value);
      for (const f of [900, 2200, 4500]) setTimeout(() => Z(c.value), f);
    }
    async function _t(f, a) {
      _.value = !0, h.value = "";
      try {
        for (const d of f) await t.uploadFile(d, a);
        Yt();
      } catch (d) {
        h.value = d instanceof Error ? d.message : "upload failed";
      } finally {
        _.value = !1;
      }
    }
    async function Ct(f, a) {
      await _t(f, a);
    }
    function Qt(f) {
      _t(Array.from(f), c.value);
    }
    function Zt(f) {
      const a = f.target;
      a.files?.length && Qt(a.files), a.value = "";
    }
    function Jt(f) {
      if (f.preventDefault(), x.value = !1, he.value || !pe.value) return;
      const a = f.dataTransfer?.files;
      a?.length && Ct(Array.from(a), c.value);
    }
    const he = E(null), te = E(null);
    function Tt(f, a) {
      if (!l(a, r.WRITE)) {
        f.preventDefault();
        return;
      }
      he.value = a.id, f.dataTransfer?.setData("text/plain", a.id);
    }
    function Pt() {
      he.value = null, te.value = null;
    }
    async function Xe(f, a) {
      const d = he.value;
      if (he.value = null, te.value = null, !(!d || d === f) && !(a && !l(a, r.WRITE)))
        try {
          await t.move(d, f), Z(c.value);
        } catch ($) {
          h.value = $ instanceof Error ? $.message : "move failed";
        }
    }
    function Ot(f, a) {
      if (f.preventDefault(), f.stopPropagation(), x.value = !1, !u(a)) return;
      if (he.value) {
        Xe(a.id, a);
        return;
      }
      const d = f.dataTransfer?.files;
      d?.length && l(a, r.WRITE) && Ct(Array.from(d), a.id);
    }
    function xt(f, a) {
      u(a) && (f.preventDefault(), te.value = a.id);
    }
    const K = dn({ entry: null, x: 0, y: 0 });
    function jt(f, a) {
      a.preventDefault(), a.stopPropagation(), K.entry = f, K.x = a.clientX, K.y = a.clientY;
    }
    function ye() {
      K.entry = null;
    }
    const et = E("");
    let Sn;
    function Io(f) {
      et.value = f, clearTimeout(Sn), Sn = setTimeout(() => {
        et.value = "";
      }, 1800);
    }
    const we = E(null), Xt = E(null), en = E([]), tn = E([]), nn = E(!1);
    async function Et(f) {
      nn.value = !0;
      try {
        Xt.value = f;
        const a = await t.list(f);
        tn.value = a.filter((d) => u(d) && d.id !== we.value?.id && l(d, r.WRITE)), en.value = f ? await t.breadcrumbs(f) : [];
      } catch (a) {
        h.value = a instanceof Error ? a.message : "failed to browse";
      } finally {
        nn.value = !1;
      }
    }
    function Vo(f) {
      ye(), we.value = f, Et(c.value);
    }
    async function zo() {
      const f = we.value;
      if (!f) return;
      const a = Xt.value;
      if (we.value = null, a !== (f.parent_id ?? null))
        try {
          await t.move(f.id, a), Io(`Moved to ${en.value.at(-1)?.name || "root"}`), Z(c.value);
        } catch (d) {
          h.value = d instanceof Error ? d.message : "move failed";
        }
    }
    async function Bo(f) {
      ye();
      try {
        const a = await t.exportEntry(f.id), d = URL.createObjectURL(a), $ = document.createElement("a");
        $.href = d, $.download = `${f.name || "entry"}.kxb`, $.click(), setTimeout(() => URL.revokeObjectURL(d), 1e3);
      } catch (a) {
        h.value = a instanceof Error ? a.message : "export failed";
      }
    }
    function $n(f, a) {
      if (f.key === "ArrowDown" || f.key === "ArrowUp") {
        f.preventDefault();
        const d = f.currentTarget, $ = [...d.parentElement?.children || []].filter((Qo) => Qo.matches?.(".ws-row, .ws-tile")), se = $.indexOf(d);
        $[f.key === "ArrowDown" ? se + 1 : se - 1]?.focus();
      } else f.key === "F2" && l(a, r.WRITE) ? (f.preventDefault(), Lt(a)) : f.key === "Delete" && l(a, r.DELETE) && (f.preventDefault(), At(a));
    }
    const _e = E(null), He = E(null);
    async function At(f) {
      if (ye(), _e.value = f, He.value = null, u(f))
        try {
          He.value = await t.countDescendants(f.id);
        } catch (a) {
          h.value = a instanceof Error ? a.message : "failed to inspect folder";
        }
    }
    async function Uo() {
      const f = _e.value;
      if (_e.value = null, He.value = null, !!f)
        try {
          const a = await t.remove(f.id);
          a.in_progress && Wo(f.id, a), v.value?.id === f.id && (v.value = null), W.value?.id === f.id && be(), Z(c.value);
        } catch (a) {
          h.value = a instanceof Error ? a.message : "failed to delete";
        }
    }
    const { acceptDeletion: Wo } = kl(
      i,
      (f) => f.id,
      (f) => {
        v.value?.id === f && (v.value = null);
      },
      () => Z(c.value)
    ), M = dn(
      { open: !1, entry: null, name: "", icon: "", color: "" }
    ), Fo = [{ label: "Default", value: "" }, ...vi], Qe = E(""), _n = E(null);
    function Lt(f) {
      ye(), M.entry = f, M.name = f.name, M.icon = f.meta?.icon || "", M.color = f.meta?.color || "", Qe.value = "", M.open = !0, zt(() => {
        const a = _n.value?.querySelector('.ws-name-row input[type="text"], .ws-name-row input:not([type])');
        a?.focus(), a?.select();
      });
    }
    async function Ho() {
      if (M.entry) {
        Qe.value = "";
        try {
          await t.update(M.entry.id, { name: M.name.trim() || M.entry.name, icon: M.icon, color: M.color }), M.open = !1, Z(c.value);
        } catch (f) {
          Qe.value = f instanceof Error ? f.message : "failed to save";
        }
      }
    }
    function Ko() {
      k.value = k.value === "list" ? "grid" : "list", localStorage.setItem("ws-view", k.value);
    }
    const ze = E(null), Go = ne(() => {
      const f = ze.value;
      return f ? JSON.stringify({
        resource_id: f.id,
        title: f.name,
        access_url: `/api/v1/component-access/grants/${f.id}`,
        share_url: `/api/v1/component-access/share/${f.id}`
      }) : "";
    }), Nt = E(parseInt(localStorage.getItem("ws-panel-w") || "440", 10)), on = E(!1);
    let Ke = null;
    function qo(f) {
      f.preventDefault(), Ke = { pointerId: f.pointerId, x: f.clientX, width: Nt.value }, on.value = !0, f.currentTarget.setPointerCapture(f.pointerId);
    }
    function Yo(f) {
      if (!Ke || f.pointerId !== Ke.pointerId) return;
      const a = Ke.width + Ke.x - f.clientX;
      Nt.value = Math.max(280, Math.min(Math.floor(window.innerWidth * 0.92), a));
    }
    function rn() {
      Ke && (Ke = null, on.value = !1, localStorage.setItem("ws-panel-w", String(Nt.value)));
    }
    function Cn(f) {
      f.key === "Escape" && (ye(), _e.value ? (_e.value = null, He.value = null) : T.value ? T.value = !1 : O.value ? O.value = null : ze.value ? ze.value = null : we.value ? we.value = null : M.open ? M.open = !1 : W.value && be());
    }
    return wt(async () => {
      window.addEventListener("keydown", Cn), await t.loadTypes(), t.error.value && (h.value = t.error.value), await Fe();
    }), dr(() => window.removeEventListener("keydown", Cn)), (f, a) => (y(), C("div", {
      class: "ws",
      onClick: ye
    }, [
      g("div", Sl, [
        g("button", {
          class: de(["ws-home", { "ws-crumb--drop": he.value && te.value === "" }]),
          title: "Workspace root",
          "aria-label": "Workspace root",
          onClick: a[0] || (a[0] = (d) => S(o)("navigate", "")),
          onDragover: a[1] || (a[1] = q((d) => te.value = "", ["prevent"])),
          onDragleave: a[2] || (a[2] = (d) => te.value = null),
          onDrop: a[3] || (a[3] = (d) => Xe(null))
        }, [
          P(S(z), { icon: "tabler:home" })
        ], 34),
        g("div", $l, [
          (y(!0), C(X, null, Be(m.value, (d) => (y(), C(X, {
            key: d.id
          }, [
            a[53] || (a[53] = g("span", { class: "ws-sep" }, "/", -1)),
            g("button", {
              class: de(["ws-crumb", { "ws-crumb--drop": he.value && te.value === d.id }]),
              title: d.name,
              onClick: ($) => S(o)("navigate", d.id),
              onDragover: q(($) => te.value = d.id, ["prevent"]),
              onDragleave: a[4] || (a[4] = ($) => te.value = null),
              onDrop: ($) => Xe(d.id)
            }, N(d.name), 43, _l)
          ], 64))), 128))
        ]),
        a[55] || (a[55] = g("span", { class: "ws-spacer" }, null, -1)),
        P(S(yr), {
          modelValue: p.value,
          "onUpdate:modelValue": a[5] || (a[5] = (d) => p.value = d),
          placeholder: "Filter this folder",
          class: "ws-filter"
        }, null, 8, ["modelValue"]),
        P(S(ue), {
          icon: k.value === "list" ? "tabler:layout-grid" : "tabler:list",
          label: k.value === "list" ? "Grid view" : "List view",
          size: "sm",
          onClick: Ko
        }, null, 8, ["icon", "label"]),
        P(S(ue), {
          icon: "tabler:upload",
          label: "Upload files",
          size: "sm",
          spin: _.value,
          disabled: !pe.value,
          onClick: a[6] || (a[6] = (d) => I.value?.click())
        }, null, 8, ["spin", "disabled"]),
        P(S(ke), {
          icon: "tabler:plus",
          small: "",
          onClick: a[7] || (a[7] = (d) => T.value = !0)
        }, {
          default: G(() => [...a[54] || (a[54] = [
            R("New", -1)
          ])]),
          _: 1
        }),
        g("input", {
          ref_key: "fileInput",
          ref: I,
          type: "file",
          multiple: "",
          hidden: "",
          onChange: Zt
        }, null, 544)
      ]),
      h.value ? (y(), B(S(it), {
        key: 0,
        tone: "error",
        onDismiss: a[9] || (a[9] = (d) => h.value = "")
      }, {
        default: G(() => [
          R(N(h.value) + " ", 1),
          P(S(ke), {
            variant: "ghost",
            small: "",
            onClick: a[8] || (a[8] = (d) => Z(c.value))
          }, {
            default: G(() => [...a[56] || (a[56] = [
              R("Retry", -1)
            ])]),
            _: 1
          })
        ]),
        _: 1
      })) : j("", !0),
      et.value ? (y(), B(S(it), {
        key: 1,
        onDismiss: a[10] || (a[10] = (d) => et.value = "")
      }, {
        default: G(() => [
          R(N(et.value), 1)
        ]),
        _: 1
      })) : j("", !0),
      g("div", Cl, [
        g("div", {
          class: de(["ws-list-pane", { "ws-list-pane--aside": v.value, "ws-list-pane--drop": x.value }]),
          onDragover: a[15] || (a[15] = q((d) => x.value = !he.value, ["prevent"])),
          onDragleave: a[16] || (a[16] = (d) => x.value = !1),
          onDrop: Jt
        }, [
          x.value ? (y(), C("div", Tl, [
            P(S(z), { icon: "tabler:upload" }),
            a[57] || (a[57] = R(" Drop to upload", -1))
          ])) : j("", !0),
          w.value ? (y(), B(S(jn), {
            key: 1,
            label: "Loading…"
          })) : fe.value.length && k.value === "list" ? (y(), C("div", Pl, [
            (y(!0), C(X, null, Be(fe.value, (d) => (y(), C("div", {
              key: d.id,
              class: de(["ws-row", {
                "ws-row--sel": v.value?.id === d.id,
                "ws-row--drop": te.value === d.id,
                "ws-row--drag": he.value === d.id
              }]),
              draggable: l(d, r.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: ($) => Tt($, d),
              onDragend: Pt,
              onDragover: ($) => xt($, d),
              onDragleave: a[11] || (a[11] = ($) => te.value = null),
              onDrop: ($) => Ot($, d),
              onClick: ($) => je(d),
              onDblclick: ($) => u(d) ? S(o)("navigate", d.id) : ee(d),
              onKeydown: [
                rt(($) => je(d), ["enter"]),
                rt(q(($) => je(d), ["prevent"]), ["space"]),
                ($) => $n($, d)
              ],
              onContextmenu: ($) => jt(d, $)
            }, [
              a[58] || (a[58] = g("span", { class: "ws-edge" }, null, -1)),
              P(S(z), {
                icon: re(d),
                class: "ws-row-ico",
                style: Ve({ color: le(d) })
              }, null, 8, ["icon", "style"]),
              g("span", xl, N(d.name), 1),
              P(co, {
                state: d,
                onRetry: ($) => At(d)
              }, null, 8, ["state", "onRetry"]),
              P(S(xn), { tone: "muted" }, {
                default: G(() => [
                  R(N(Se(d)), 1)
                ]),
                _: 2
              }, 1024),
              g("span", jl, N(De(d.updated_at)), 1),
              g("button", {
                class: "ws-row-menu",
                title: "Actions",
                "aria-label": `Actions for ${d.name}`,
                onClick: q(($) => jt(d, $), ["stop"])
              }, [
                P(S(z), { icon: "tabler:dots" })
              ], 8, El)
            ], 42, Ol))), 128))
          ])) : fe.value.length ? (y(), C("div", Al, [
            (y(!0), C(X, null, Be(fe.value, (d) => (y(), C("div", {
              key: d.id,
              class: de(["ws-tile", {
                "ws-tile--sel": v.value?.id === d.id,
                "ws-row--drop": te.value === d.id
              }]),
              draggable: l(d, r.WRITE),
              role: "button",
              tabindex: "0",
              onDragstart: ($) => Tt($, d),
              onDragend: Pt,
              onDragover: ($) => xt($, d),
              onDragleave: a[12] || (a[12] = ($) => te.value = null),
              onDrop: ($) => Ot($, d),
              onClick: ($) => je(d),
              onDblclick: ($) => u(d) ? S(o)("navigate", d.id) : ee(d),
              onKeydown: [
                rt(($) => je(d), ["enter"]),
                rt(q(($) => je(d), ["prevent"]), ["space"]),
                ($) => $n($, d)
              ],
              onContextmenu: ($) => jt(d, $)
            }, [
              g("button", {
                class: "ws-row-menu ws-tile-menu",
                title: "Actions",
                "aria-label": `Actions for ${d.name}`,
                onClick: q(($) => jt(d, $), ["stop"])
              }, [
                P(S(z), { icon: "tabler:dots" })
              ], 8, Nl),
              P(S(z), {
                icon: re(d),
                class: "ws-tile-ico",
                style: Ve({ color: le(d) })
              }, null, 8, ["icon", "style"]),
              g("span", {
                class: "ws-tile-name",
                title: d.name
              }, N(d.name), 9, Dl),
              P(co, {
                state: d,
                onRetry: ($) => At(d)
              }, null, 8, ["state", "onRetry"])
            ], 42, Ll))), 128))
          ])) : i.value.length ? (y(), B(S(an), {
            key: 4,
            icon: "tabler:search-off",
            title: "No matches",
            hint: `Nothing here matches “${p.value}”.`,
            cta: "Clear filter",
            "cta-icon": "tabler:x",
            onCta: a[13] || (a[13] = (d) => p.value = "")
          }, null, 8, ["hint"])) : pe.value ? (y(), B(S(an), {
            key: 5,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Create a folder or entry, or upload files.",
            cta: "New entry",
            "cta-icon": "tabler:plus",
            onCta: a[14] || (a[14] = (d) => T.value = !0)
          })) : (y(), B(S(an), {
            key: 6,
            icon: "tabler:folder-open",
            title: "Empty",
            hint: "Nothing has been shared into this folder yet."
          }))
        ], 34),
        v.value ? (y(), C(X, { key: 0 }, [
          g("div", {
            class: de(["ws-divider", { resizing: on.value }]),
            onPointerdown: qo,
            onPointermove: Yo,
            onPointerup: rn,
            onPointercancel: rn,
            onLostpointercapture: rn
          }, null, 34),
          g("aside", {
            class: "ws-preview",
            style: Ve({ "--ws-preview-width": Nt.value + "px" })
          }, [
            g("div", Rl, [
              P(S(z), {
                icon: re(v.value),
                style: Ve({ color: le(v.value) })
              }, null, 8, ["icon", "style"]),
              g("span", Ml, N(v.value.name), 1),
              a[59] || (a[59] = g("span", { class: "ws-spacer" }, null, -1)),
              v.value.type !== "folder" ? (y(), B(S(ue), {
                key: 0,
                icon: "tabler:maximize",
                label: "Open",
                size: "sm",
                onClick: a[17] || (a[17] = (d) => ee(v.value))
              })) : j("", !0),
              l(v.value, r.ADMIN) ? (y(), B(S(ue), {
                key: 1,
                icon: "tabler:share-3",
                label: "Share",
                size: "sm",
                onClick: a[18] || (a[18] = (d) => ze.value = v.value)
              })) : j("", !0),
              P(S(ue), {
                icon: "tabler:adjustments",
                label: "Properties",
                size: "sm",
                onClick: a[19] || (a[19] = (d) => Lt(v.value))
              }),
              P(S(ue), {
                icon: "tabler:x",
                label: "Close",
                size: "sm",
                onClick: a[20] || (a[20] = (d) => v.value = null)
              })
            ]),
            me(v.value) ? (y(), B(Vt, {
              key: 0,
              tag: me(v.value),
              attrs: Me(v.value, "preview"),
              class: "ws-renderer"
            }, null, 8, ["tag", "attrs"])) : (y(), B(so, {
              key: 1,
              entry: v.value,
              mode: "preview",
              class: "ws-renderer"
            }, null, 8, ["entry"]))
          ], 4)
        ], 64)) : j("", !0)
      ]),
      K.entry ? (y(), B(wi, {
        key: 2,
        x: K.x,
        y: K.y,
        onClose: ye
      }, {
        default: G(() => [
          u(K.entry) ? (y(), C("button", {
            key: 0,
            class: "ws-menu-item",
            onClick: a[21] || (a[21] = (d) => {
              S(o)("navigate", K.entry.id), ye();
            })
          }, [
            P(S(z), { icon: "tabler:folder-open" }),
            a[60] || (a[60] = R(" Open", -1))
          ])) : (y(), C(X, { key: 1 }, [
            g("button", {
              class: "ws-menu-item",
              onClick: a[22] || (a[22] = (d) => {
                je(K.entry), ye();
              })
            }, [
              P(S(z), { icon: "tabler:eye" }),
              a[61] || (a[61] = R(" Preview", -1))
            ]),
            g("button", {
              class: "ws-menu-item",
              onClick: a[23] || (a[23] = (d) => ee(K.entry))
            }, [
              P(S(z), { icon: "tabler:maximize" }),
              a[62] || (a[62] = R(" Open", -1))
            ])
          ], 64)),
          l(K.entry, r.WRITE) ? (y(), C("button", {
            key: 2,
            class: "ws-menu-item",
            onClick: a[24] || (a[24] = (d) => Lt(K.entry))
          }, [
            P(S(z), { icon: "tabler:cursor-text" }),
            a[63] || (a[63] = R(" Rename…", -1))
          ])) : j("", !0),
          l(K.entry, r.WRITE) ? (y(), C("button", {
            key: 3,
            class: "ws-menu-item",
            onClick: a[25] || (a[25] = (d) => Vo(K.entry))
          }, [
            P(S(z), { icon: "tabler:folder-symlink" }),
            a[64] || (a[64] = R(" Move to…", -1))
          ])) : j("", !0),
          l(K.entry, r.ADMIN) ? (y(), C("button", {
            key: 4,
            class: "ws-menu-item",
            onClick: a[26] || (a[26] = (d) => {
              ze.value = K.entry, ye();
            })
          }, [
            P(S(z), { icon: "tabler:user-plus" }),
            a[65] || (a[65] = R(" Share…", -1))
          ])) : j("", !0),
          g("button", {
            class: "ws-menu-item",
            onClick: a[27] || (a[27] = (d) => Bo(K.entry))
          }, [
            P(S(z), { icon: "tabler:package-export" }),
            a[66] || (a[66] = R(" Export", -1))
          ]),
          l(K.entry, r.DELETE) ? (y(), C("div", Il)) : j("", !0),
          l(K.entry, r.DELETE) ? (y(), C("button", {
            key: 6,
            class: "ws-menu-item ws-menu-danger",
            onClick: a[28] || (a[28] = (d) => At(K.entry))
          }, [
            P(S(z), { icon: "tabler:trash" }),
            a[67] || (a[67] = R(" Delete", -1))
          ])) : j("", !0)
        ]),
        _: 1
      }, 8, ["x", "y"])) : j("", !0),
      T.value ? (y(), C("div", {
        key: 3,
        class: "ws-modal",
        role: "dialog",
        "aria-modal": "true",
        "aria-labelledby": "ws-new-heading",
        onClick: a[30] || (a[30] = q((d) => T.value = !1, ["self"]))
      }, [
        g("div", Vl, [
          g("div", zl, [
            a[68] || (a[68] = R("New entry", -1)),
            a[69] || (a[69] = g("span", { class: "ws-spacer" }, null, -1)),
            P(S(ue), {
              icon: "tabler:x",
              label: "Close new entry",
              size: "sm",
              onClick: a[29] || (a[29] = (d) => T.value = !1)
            })
          ]),
          g("div", Bl, [
            (y(!0), C(X, null, Be(xe.value, (d) => (y(), C("button", {
              key: d.value,
              type: "button",
              class: "ws-type-btn",
              title: d.description || d.label,
              onClick: ($) => qt(d)
            }, [
              P(S(z), {
                icon: d.icon,
                style: Ve({ color: d.color })
              }, null, 8, ["icon", "style"]),
              g("span", null, N(d.label), 1)
            ], 8, Ul))), 128))
          ])
        ])
      ])) : j("", !0),
      O.value?.create?.view && Gt.value ? (y(), C("div", {
        key: 4,
        class: "ws-modal",
        onCreated: $t,
        onClose: a[31] || (a[31] = (d) => O.value = null),
        onClick: a[32] || (a[32] = q((d) => O.value = null, ["self"]))
      }, [
        P(Vt, {
          tag: O.value.create.view,
          attrs: St.value
        }, null, 8, ["tag", "attrs"])
      ], 32)) : O.value?.create?.view ? (y(), C("div", {
        key: 5,
        class: "ws-modal",
        onCreated: $t,
        onClose: a[33] || (a[33] = (d) => O.value = null),
        onClick: a[34] || (a[34] = q((d) => O.value = null, ["self"]))
      }, [
        g("div", Wl, [
          P(Vt, {
            tag: O.value.create.view,
            attrs: St.value,
            fill: !1,
            class: "ws-create-mount"
          }, null, 8, ["tag", "attrs"])
        ])
      ], 32)) : j("", !0),
      _e.value ? (y(), C("div", {
        key: 6,
        class: "ws-modal",
        onClick: a[36] || (a[36] = q((d) => {
          _e.value = null, He.value = null;
        }, ["self"]))
      }, [
        g("div", Fl, [
          g("div", Hl, "Delete " + N(u(_e.value) ? "folder" : "entry"), 1),
          u(_e.value) ? (y(), C("div", Kl, " Deletes this folder and " + N(He.value ?? "…") + " entries. Uploaded files stay in Files. ", 1)) : _e.value.type === "file" ? (y(), C("div", Gl, "Removes it from the workspace. The file stays in Files.")) : (y(), C("div", ql, "Deletes this entry from the workspace.")),
          g("div", Yl, [
            P(S(ke), {
              variant: "ghost",
              onClick: a[35] || (a[35] = (d) => {
                _e.value = null, He.value = null;
              })
            }, {
              default: G(() => [...a[70] || (a[70] = [
                R("Cancel", -1)
              ])]),
              _: 1
            }),
            P(S(ke), {
              icon: "tabler:trash",
              onClick: Uo
            }, {
              default: G(() => [...a[71] || (a[71] = [
                R("Delete", -1)
              ])]),
              _: 1
            })
          ])
        ])
      ])) : j("", !0),
      M.open && M.entry ? (y(), C("div", {
        key: 7,
        class: "ws-modal",
        onClick: a[42] || (a[42] = q((d) => M.open = !1, ["self"]))
      }, [
        g("div", {
          ref_key: "propsDialogEl",
          ref: _n,
          class: "ws-dialog"
        }, [
          g("div", Ql, [
            a[72] || (a[72] = R("Properties", -1)),
            a[73] || (a[73] = g("span", { class: "ws-spacer" }, null, -1)),
            P(S(ue), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: a[37] || (a[37] = (d) => M.open = !1)
            })
          ]),
          Qe.value ? (y(), B(S(it), {
            key: 0,
            tone: "error",
            onDismiss: a[38] || (a[38] = (d) => Qe.value = "")
          }, {
            default: G(() => [
              R(N(Qe.value), 1)
            ]),
            _: 1
          })) : j("", !0),
          P(S(Tn), { label: "Name" }, {
            default: G(() => [
              g("div", Zl, [
                P(S(er), {
                  modelValue: M.icon,
                  "onUpdate:modelValue": a[39] || (a[39] = (d) => M.icon = d),
                  fallback: H.value[M.entry.type]?.icon
                }, null, 8, ["modelValue", "fallback"]),
                P(S(tr), {
                  modelValue: M.name,
                  "onUpdate:modelValue": a[40] || (a[40] = (d) => M.name = d)
                }, null, 8, ["modelValue"])
              ])
            ]),
            _: 1
          }),
          P(S(Tn), { label: "Color" }, {
            default: G(() => [
              g("div", Jl, [
                (y(), C(X, null, Be(Fo, (d) => g("button", {
                  key: d.value,
                  type: "button",
                  class: de(["ws-swatch", { on: M.color === d.value }]),
                  title: d.label,
                  "aria-label": `Use color ${d.label}`,
                  style: Ve({ background: d.value || "transparent" }),
                  onClick: ($) => M.color = d.value
                }, [
                  d.value ? j("", !0) : (y(), B(S(z), {
                    key: 0,
                    icon: "tabler:ban"
                  }))
                ], 14, Xl)), 64))
              ])
            ]),
            _: 1
          }),
          g("div", es, [
            g("div", null, [
              a[74] || (a[74] = g("span", null, "Type", -1)),
              g("span", null, N(Se(M.entry)), 1)
            ]),
            g("div", null, [
              a[75] || (a[75] = g("span", null, "Status", -1)),
              g("code", null, N(M.entry.status), 1)
            ]),
            g("div", null, [
              a[76] || (a[76] = g("span", null, "Access", -1)),
              g("code", null, N(s(M.entry.access_level)), 1)
            ]),
            g("div", null, [
              a[77] || (a[77] = g("span", null, "Created", -1)),
              g("code", null, N(Re(M.entry.created_at)), 1)
            ]),
            g("div", null, [
              a[78] || (a[78] = g("span", null, "Updated", -1)),
              g("code", null, N(Re(M.entry.updated_at)), 1)
            ])
          ]),
          g("div", ts, [
            P(S(ke), {
              variant: "ghost",
              onClick: a[41] || (a[41] = (d) => M.open = !1)
            }, {
              default: G(() => [...a[79] || (a[79] = [
                R("Close", -1)
              ])]),
              _: 1
            }),
            l(M.entry, r.WRITE) ? (y(), B(S(ke), {
              key: 0,
              icon: "tabler:device-floppy",
              onClick: Ho
            }, {
              default: G(() => [...a[80] || (a[80] = [
                R("Save", -1)
              ])]),
              _: 1
            })) : j("", !0)
          ])
        ], 512)
      ])) : j("", !0),
      we.value ? (y(), C("div", {
        key: 8,
        class: "ws-modal",
        onClick: a[46] || (a[46] = q((d) => we.value = null, ["self"]))
      }, [
        g("div", ns, [
          g("div", os, [
            R("Move “" + N(we.value.name) + "”", 1),
            a[81] || (a[81] = g("span", { class: "ws-spacer" }, null, -1)),
            P(S(ue), {
              icon: "tabler:x",
              label: "Close",
              size: "sm",
              onClick: a[43] || (a[43] = (d) => we.value = null)
            })
          ]),
          g("div", rs, [
            g("button", {
              class: "ws-crumb",
              onClick: a[44] || (a[44] = (d) => Et(null))
            }, [
              P(S(z), { icon: "tabler:home" })
            ]),
            (y(!0), C(X, null, Be(en.value, (d) => (y(), C(X, {
              key: d.id
            }, [
              a[82] || (a[82] = g("span", { class: "ws-sep" }, "/", -1)),
              g("button", {
                class: "ws-crumb",
                onClick: ($) => Et(d.id)
              }, N(d.name), 9, as)
            ], 64))), 128))
          ]),
          g("div", is, [
            nn.value ? (y(), B(S(jn), {
              key: 0,
              label: "Loading…"
            })) : (y(), C(X, { key: 1 }, [
              (y(!0), C(X, null, Be(tn.value, (d) => (y(), C("button", {
                key: d.id,
                class: "ws-move-folder",
                onClick: ($) => Et(d.id)
              }, [
                P(S(z), {
                  icon: re(d),
                  style: Ve({ color: le(d) })
                }, null, 8, ["icon", "style"]),
                g("span", null, N(d.name), 1),
                P(S(z), {
                  icon: "tabler:chevron-right",
                  class: "ws-move-into"
                })
              ], 8, ls))), 128)),
              tn.value.length ? j("", !0) : (y(), C("p", ss, "No folders here."))
            ], 64))
          ]),
          g("div", us, [
            P(S(ke), {
              variant: "ghost",
              onClick: a[45] || (a[45] = (d) => we.value = null)
            }, {
              default: G(() => [...a[83] || (a[83] = [
                R("Cancel", -1)
              ])]),
              _: 1
            }),
            P(S(ke), {
              icon: "tabler:folder-symlink",
              disabled: Xt.value === (we.value.parent_id ?? null),
              onClick: zo
            }, {
              default: G(() => [...a[84] || (a[84] = [
                R("Move here", -1)
              ])]),
              _: 1
            }, 8, ["disabled"])
          ])
        ])
      ])) : j("", !0),
      W.value ? (y(), C("div", ds, [
        g("div", cs, [
          P(S(ue), {
            icon: "tabler:arrow-left",
            label: "Back",
            size: "sm",
            onClick: a[47] || (a[47] = (d) => be())
          }),
          P(S(z), {
            icon: re(W.value),
            style: Ve({ color: le(W.value) })
          }, null, 8, ["icon", "style"]),
          g("span", ps, N(W.value.name), 1),
          P(S(xn), { tone: "muted" }, {
            default: G(() => [
              R(N(Se(W.value)), 1)
            ]),
            _: 1
          }),
          a[85] || (a[85] = g("span", { class: "ws-spacer" }, null, -1)),
          l(W.value, r.ADMIN) ? (y(), B(S(ue), {
            key: 0,
            icon: "tabler:share-3",
            label: "Share",
            size: "sm",
            onClick: a[48] || (a[48] = (d) => ze.value = W.value)
          })) : j("", !0),
          P(S(ue), {
            icon: "tabler:adjustments",
            label: "Properties",
            size: "sm",
            onClick: a[49] || (a[49] = (d) => Lt(W.value))
          }),
          P(S(ue), {
            icon: "tabler:x",
            label: "Close",
            size: "sm",
            onClick: a[50] || (a[50] = (d) => be())
          })
        ]),
        me(W.value) ? (y(), B(Vt, {
          key: 0,
          tag: me(W.value),
          attrs: Me(W.value, "full"),
          class: "ws-manage-body"
        }, null, 8, ["tag", "attrs"])) : (y(), B(so, {
          key: 1,
          entry: W.value,
          mode: "full",
          class: "ws-manage-body"
        }, null, 8, ["entry"]))
      ])) : j("", !0),
      ze.value ? (y(), B(_i, {
        key: 10,
        config: Go.value,
        onClose: a[51] || (a[51] = (d) => ze.value = null),
        onChanged: a[52] || (a[52] = (d) => Z(c.value))
      }, null, 8, ["config"])) : j("", !0)
    ]));
  }
});
class vs extends nr {
  static get wippyConfig() {
    return {
      propsSchema: { type: "object", properties: { route: { type: "string" } } },
      hostCssKeys: ["themeConfigUrl", "primeVueCssUrl", "iframeCssUrl"],
      inlineCss: or
    };
  }
  static get vueConfig() {
    return { rootComponent: ms, plugins: [mi] };
  }
}
mr(import.meta.url, vs);
//# sourceMappingURL=index.js.map
