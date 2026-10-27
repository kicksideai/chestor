import { ref as le, readonly as zn, getCurrentInstance as pt, onMounted as Kt, nextTick as qt, watch as xe, reactive as Dn, renderSlot as V, openBlock as A, createBlock as we, Teleport as Yt, createCommentVNode as H, useId as Rn, mergeProps as N, h as Vn, provide as Bn, inject as Un, computed as Wn, createElementBlock as B, createElementVNode as D, createTextVNode as Fn, toDisplayString as he, resolveComponent as mt, resolveDirective as Hn, withDirectives as Kn, resolveDynamicComponent as qn, withCtx as Gt, normalizeClass as Ze, defineComponent as Qt, createVNode as De, unref as ve, onBeforeUnmount as Yn } from "vue";
import { u as Gn } from "./dto-CcYNmUR0.js";
import { c as Qn, s as Zn, a as Jn, e as Xn } from "./presentation-BDm-VNGA.js";
import { Icon as Re } from "@iconify/vue";
var er = Object.defineProperty, ft = Object.getOwnPropertySymbols, tr = Object.prototype.hasOwnProperty, nr = Object.prototype.propertyIsEnumerable, gt = (e, t, n) => t in e ? er(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, rr = (e, t) => {
  for (var n in t || (t = {})) tr.call(t, n) && gt(e, n, t[n]);
  if (ft) for (var n of ft(t)) nr.call(t, n) && gt(e, n, t[n]);
  return e;
};
function de(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function at(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function P(e) {
  return !de(e);
}
function K(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Zt(e = {}, t = {}) {
  let n = rr({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    K(t[o]) && o in e && K(e[o]) ? n[o] = Zt(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function or(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : Zt(t, n), {});
}
function I(e, ...t) {
  return at(e) ? e(...t) : e;
}
function E(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function F(e) {
  return E(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function it(e, t = "", n = {}) {
  let r = F(t).split("."), o = r.shift();
  if (o) {
    if (K(e)) {
      let l = Object.keys(e).find((s) => F(s) === o) || "";
      return it(I(e[l], n), r.join("."), n);
    }
    return;
  }
  return I(e, n);
}
function Jt(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function ar(e) {
  return P(e) && !isNaN(e);
}
function se(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function ir(...e) {
  return or(...e);
}
function Se(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function lr(e) {
  return E(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Xt(e) {
  return E(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function en() {
  let e = /* @__PURE__ */ new Map();
  return { on(t, n) {
    let r = e.get(t);
    return r ? r.push(n) : r = [n], e.set(t, r), this;
  }, off(t, n) {
    let r = e.get(t);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(t, n) {
    let r = e.get(t);
    r && r.forEach((o) => {
      o(n);
    });
  }, clear() {
    e.clear();
  } };
}
function $e(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") t.push(r);
      else if (o === "object") {
        let l = Array.isArray(r) ? [$e(...r)] : Object.entries(r).map(([s, i]) => i ? s : void 0);
        t = l.length ? t.concat(l.filter((s) => !!s)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function sr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function cr(e, t) {
  if (e && t) {
    let n = (r) => {
      sr(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Ye(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function bt(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function dr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function ur(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function pr(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && ur(e));
}
function Me(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Fe(e, t = {}) {
  if (Me(e)) {
    let n = (r, o) => {
      var l, s;
      let i = (l = e?.$attrs) != null && l[r] ? [(s = e?.$attrs) == null ? void 0 : s[r]] : [];
      return [o].flat().reduce((a, c) => {
        if (c != null) {
          let d = typeof c;
          if (d === "string" || d === "number") a.push(c);
          else if (d === "object") {
            let u = Array.isArray(c) ? n(r, c) : Object.entries(c).map(([p, m]) => r === "style" && (m || m === 0) ? `${p.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${m}` : m ? p : void 0);
            a = u.length ? a.concat(u.filter((p) => !!p)) : a;
          }
        }
        return a;
      }, i);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let l = r.match(/^on(.+)/);
        l ? e.addEventListener(l[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Fe(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function mr(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return Fe(r, t), r.append(...n), r;
  }
}
function fr(e, t) {
  return Me(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function gr(e, t) {
  if (Me(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function ht(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function br(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || bt(document.documentElement) || bt(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function hr(e, t) {
  return e ? e.offsetHeight : 0;
}
function vt(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function tn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function vr(e, t = "", n) {
  Me(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Ve = {};
function yr(e = "pui_id_") {
  return Object.hasOwn(Ve, e) || (Ve[e] = 0), Ve[e]++, `${e}${Ve[e]}`;
}
var xr = Object.defineProperty, kr = Object.defineProperties, wr = Object.getOwnPropertyDescriptors, He = Object.getOwnPropertySymbols, nn = Object.prototype.hasOwnProperty, rn = Object.prototype.propertyIsEnumerable, yt = (e, t, n) => t in e ? xr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, R = (e, t) => {
  for (var n in t || (t = {})) nn.call(t, n) && yt(e, n, t[n]);
  if (He) for (var n of He(t)) rn.call(t, n) && yt(e, n, t[n]);
  return e;
}, Ge = (e, t) => kr(e, wr(t)), Y = (e, t) => {
  var n = {};
  for (var r in e) nn.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && He) for (var r of He(e)) t.indexOf(r) < 0 && rn.call(e, r) && (n[r] = e[r]);
  return n;
}, Sr = en(), C = Sr, _e = /{([^}]*)}/g, on = /(\d+\s+[\+\-\*\/]\s+\d+)/g, an = /var\([^)]+\)/g;
function xt(e) {
  return E(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function $r(e) {
  return K(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function _r(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function Je(e = "", t = "") {
  return _r(`${E(e, !1) && E(t, !1) ? `${e}-` : e}${t}`);
}
function ln(e = "", t = "") {
  return `--${Je(e, t)}`;
}
function Pr(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function sn(e, t = "", n = "", r = [], o) {
  if (E(e)) {
    let l = e.trim();
    if (Pr(l)) return;
    if (se(l, _e)) {
      let s = l.replaceAll(_e, (i) => {
        let a = i.replace(/{|}/g, "").split(".").filter((c) => !r.some((d) => se(c, d)));
        return `var(${ln(n, Xt(a.join("-")))}${P(o) ? `, ${o}` : ""})`;
      });
      return se(s.replace(an, "0"), on) ? `calc(${s})` : s;
    }
    return l;
  } else if (ar(e)) return e;
}
function Tr(e, t, n) {
  E(t, !1) && e.push(`${t}:${n};`);
}
function ge(e, t) {
  return e ? `${e}{${t}}` : "";
}
function cn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(s, i) {
    let a = [], c = 0, d = "", u = null, p = 0;
    for (; c <= s.length; ) {
      let m = s[c];
      if ((m === '"' || m === "'" || m === "`") && s[c - 1] !== "\\" && (u = u === m ? null : m), !u && (m === "(" && p++, m === ")" && p--, (m === "," || c === s.length) && p === 0)) {
        let g = d.trim();
        g.startsWith("dt(") ? a.push(cn(g, i)) : a.push(r(g)), d = "", c++;
        continue;
      }
      m !== void 0 && (d += m), c++;
    }
    return a;
  }
  function r(s) {
    let i = s[0];
    if ((i === '"' || i === "'" || i === "`") && s[s.length - 1] === i) return s.slice(1, -1);
    let a = Number(s);
    return isNaN(a) ? s : a;
  }
  let o = [], l = [];
  for (let s = 0; s < e.length; s++) if (e[s] === "d" && e.slice(s, s + 3) === "dt(") l.push(s), s += 2;
  else if (e[s] === ")" && l.length > 0) {
    let i = l.pop();
    l.length === 0 && o.push([i, s]);
  }
  if (!o.length) return e;
  for (let s = o.length - 1; s >= 0; s--) {
    let [i, a] = o[s], c = e.slice(i + 3, a), d = n(c, t), u = t(...d);
    e = e.slice(0, i) + u + e.slice(a + 1);
  }
  return e;
}
var ce = (...e) => Or($.getTheme(), ...e), Or = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: l } = $.defaults || {}, { prefix: s, transform: i } = e?.options || l || {}, a = se(t, _e) ? t : `{${t}}`;
    return r === "value" || de(r) && i === "strict" ? $.getTokenValue(t) : sn(a, void 0, s, [o.excludedKeyRegex], n);
  }
  return "";
};
function Be(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, l) => {
      var s;
      return r + o + ((s = I(t[l], { dt: ce })) != null ? s : "");
    }, "");
    return cn(n, ce);
  }
  return I(e, { dt: ce });
}
function Cr(e, t = {}) {
  let n = $.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: l = n.excludedKeyRegex } = t, s = [], i = [], a = [{ node: e, path: r }];
  for (; a.length; ) {
    let { node: d, path: u } = a.pop();
    for (let p in d) {
      let m = d[p], g = $r(m), h = se(p, l) ? Je(u) : Je(u, Xt(p));
      if (K(g)) a.push({ node: g, path: h });
      else {
        let b = ln(h), v = sn(g, h, r, [l]);
        Tr(i, b, v);
        let w = h;
        r && w.startsWith(r + "-") && (w = w.slice(r.length + 1)), s.push(w.replace(/-/g, "."));
      }
    }
  }
  let c = i.join("");
  return { value: i, tokens: s, declarations: c, css: ge(o, c) };
}
var z = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
    var r;
    return (r = t.map((o) => o.resolve(n)).find((o) => o.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(e, t) {
  return Cr(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, s, i, a, c, d, u;
  let { preset: p, options: m } = t, g, h, b, v, w, _, f;
  if (P(p) && m.transform !== "strict") {
    let { primitive: x, semantic: O, extend: M } = p, G = O || {}, { colorScheme: Q } = G, te = Y(G, ["colorScheme"]), Z = M || {}, { colorScheme: ne } = Z, re = Y(Z, ["colorScheme"]), J = Q || {}, { dark: oe } = J, ue = Y(J, ["dark"]), ae = ne || {}, { dark: pe } = ae, me = Y(ae, ["dark"]), q = P(x) ? this._toVariables({ primitive: x }, m) : {}, U = P(te) ? this._toVariables({ semantic: te }, m) : {}, ie = P(ue) ? this._toVariables({ light: ue }, m) : {}, ze = P(oe) ? this._toVariables({ dark: oe }, m) : {}, fe = P(re) ? this._toVariables({ semantic: re }, m) : {}, dt = P(me) ? this._toVariables({ light: me }, m) : {}, ut = P(pe) ? this._toVariables({ dark: pe }, m) : {}, [yn, xn] = [(l = q.declarations) != null ? l : "", q.tokens], [kn, wn] = [(s = U.declarations) != null ? s : "", U.tokens || []], [Sn, $n] = [(i = ie.declarations) != null ? i : "", ie.tokens || []], [_n, Pn] = [(a = ze.declarations) != null ? a : "", ze.tokens || []], [Tn, On] = [(c = fe.declarations) != null ? c : "", fe.tokens || []], [Cn, jn] = [(d = dt.declarations) != null ? d : "", dt.tokens || []], [An, Ln] = [(u = ut.declarations) != null ? u : "", ut.tokens || []];
    g = this.transformCSS(e, yn, "light", "variable", m, r, o), h = xn;
    let Nn = this.transformCSS(e, `${kn}${Sn}`, "light", "variable", m, r, o), En = this.transformCSS(e, `${_n}`, "dark", "variable", m, r, o);
    b = `${Nn}${En}`, v = [.../* @__PURE__ */ new Set([...wn, ...$n, ...Pn])];
    let In = this.transformCSS(e, `${Tn}${Cn}color-scheme:light`, "light", "variable", m, r, o), Mn = this.transformCSS(e, `${An}color-scheme:dark`, "dark", "variable", m, r, o);
    w = `${In}${Mn}`, _ = [.../* @__PURE__ */ new Set([...On, ...jn, ...Ln])], f = I(p.css, { dt: ce });
  }
  return { primitive: { css: g, tokens: h }, semantic: { css: b, tokens: v }, global: { css: w, tokens: _ }, style: f };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: l, selector: s }) {
  var i, a, c;
  let d, u, p;
  if (P(t) && n.transform !== "strict") {
    let m = e.replace("-directive", ""), g = t, { colorScheme: h, extend: b, css: v } = g, w = Y(g, ["colorScheme", "extend", "css"]), _ = b || {}, { colorScheme: f } = _, x = Y(_, ["colorScheme"]), O = h || {}, { dark: M } = O, G = Y(O, ["dark"]), Q = f || {}, { dark: te } = Q, Z = Y(Q, ["dark"]), ne = P(w) ? this._toVariables({ [m]: R(R({}, w), x) }, n) : {}, re = P(G) ? this._toVariables({ [m]: R(R({}, G), Z) }, n) : {}, J = P(M) ? this._toVariables({ [m]: R(R({}, M), te) }, n) : {}, [oe, ue] = [(i = ne.declarations) != null ? i : "", ne.tokens || []], [ae, pe] = [(a = re.declarations) != null ? a : "", re.tokens || []], [me, q] = [(c = J.declarations) != null ? c : "", J.tokens || []], U = this.transformCSS(m, `${oe}${ae}`, "light", "variable", n, o, l, s), ie = this.transformCSS(m, me, "dark", "variable", n, o, l, s);
    d = `${U}${ie}`, u = [.../* @__PURE__ */ new Set([...ue, ...pe, ...q])], p = I(v, { dt: ce });
  }
  return { css: d, tokens: u, style: p };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l;
  let { preset: s, options: i } = t, a = (l = s?.components) == null ? void 0 : l[e];
  return this.getPreset({ name: e, preset: a, options: i, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var l, s;
  let i = e.replace("-directive", ""), { preset: a, options: c } = t, d = ((l = a?.components) == null ? void 0 : l[i]) || ((s = a?.directives) == null ? void 0 : s[i]);
  return this.getPreset({ name: i, preset: d, options: c, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${I(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  let s = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: l }), i = Object.entries(r).reduce((a, [c, d]) => a.push(`${c}="${d}"`) && a, []).join(" ");
  return Object.entries(s || {}).reduce((a, [c, d]) => {
    if (K(d) && Object.hasOwn(d, "css")) {
      let u = Se(d.css), p = `${c}-variables`;
      a.push(`<style type="text/css" data-primevue-style-id="${p}" ${i}>${u}</style>`);
    }
    return a;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: l }) {
  var s;
  let i = { name: e, theme: t, params: n, set: o, defaults: l }, a = (s = e.includes("-directive") ? this.getPresetD(i) : this.getPresetC(i)) == null ? void 0 : s.css, c = Object.entries(r).reduce((d, [u, p]) => d.push(`${u}="${p}"`) && d, []).join(" ");
  return a ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${c}>${Se(a)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let l = function(i, a = {}, c = []) {
    if (c.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: i, path: this.path, paths: a, value: void 0 };
    c.push(this.path), a.name = this.path, a.binding || (a.binding = {});
    let d = this.value;
    if (typeof this.value == "string" && _e.test(this.value)) {
      let u = this.value.trim().replace(_e, (p) => {
        var m;
        let g = p.slice(1, -1), h = this.tokens[g];
        if (!h) return console.warn(`Token not found for path: ${g}`), "__UNRESOLVED__";
        let b = h.computed(i, a, c);
        return Array.isArray(b) && b.length === 2 ? `light-dark(${b[0].value},${b[1].value})` : (m = b?.value) != null ? m : "__UNRESOLVED__";
      });
      d = on.test(u.replace(an, "0")) ? `calc(${u})` : u;
    }
    return de(a.binding) && delete a.binding, c.pop(), { colorScheme: i, path: this.path, paths: a, value: d.includes("__UNRESOLVED__") ? void 0 : d };
  }, s = (i, a, c) => {
    Object.entries(i).forEach(([d, u]) => {
      let p = se(d, t.variable.excludedKeyRegex) ? a : a ? `${a}.${xt(d)}` : xt(d), m = c ? `${c}.${d}` : d;
      K(u) ? s(u, p, m) : (o[p] || (o[p] = { paths: [], computed: (g, h = {}, b = []) => {
        if (o[p].paths.length === 1) return o[p].paths[0].computed(o[p].paths[0].scheme, h.binding, b);
        if (g && g !== "none") for (let v = 0; v < o[p].paths.length; v++) {
          let w = o[p].paths[v];
          if (w.scheme === g) return w.computed(g, h.binding, b);
        }
        return o[p].paths.map((v) => v.computed(v.scheme, h[v.scheme], b));
      } }), o[p].paths.push({ path: m, value: u, scheme: m.includes("colorScheme.light") ? "light" : m.includes("colorScheme.dark") ? "dark" : "none", computed: l, tokens: o }));
    });
  };
  return s(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((i) => i.split(".").filter((a) => !se(a.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), l = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, s = [(r = e[o]) == null ? void 0 : r.computed(l)].flat().filter((i) => i);
  return s.length === 1 ? s[0].value : s.reduce((i = {}, a) => {
    let c = a, { colorScheme: d } = c, u = Y(c, ["colorScheme"]);
    return i[d] = u, i;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? ge(P(t) ? `${e}${t},${e} ${t}` : e, r) : ge(e, ge(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, l, s, i) {
  if (P(t)) {
    let { cssLayer: a } = o;
    if (r !== "style") {
      let c = this.getColorSchemeOption(o, s);
      t = n === "dark" ? c.reduce((d, { type: u, selector: p }) => (P(p) && (d += p.includes("[CSS]") ? p.replace("[CSS]", t) : this.getSelectorRule(p, i, u, t)), d), "") : ge(i ?? ":root,:host", t);
    }
    if (a) {
      let c = { name: "primeui" };
      K(a) && (c.name = I(a.name, { name: e, type: r })), P(c.name) && (t = ge(`@layer ${c.name}`, t), l?.layerNames(c.name));
    }
    return t;
  }
  return "";
} }, $ = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = Ge(R({}, t), { options: R(R({}, this.defaults.options), t.options) }), this._tokens = z.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), C.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = Ge(R({}, this.theme), { preset: e }), this._tokens = z.createTokens(e, this.defaults), this.clearLoadedStyleNames(), C.emit("preset:change", e), C.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = Ge(R({}, this.theme), { options: e }), this.clearLoadedStyleNames(), C.emit("options:change", e), C.emit("theme:change", this.theme);
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
  return z.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return z.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return z.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return z.getPresetD(n);
}, getCustomPreset(e = "", t, n, r) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return z.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return z.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", r) {
  return z.transformCSS(e, t, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return z.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return z.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), C.emit(`theme:${t}:load`, e), !this._loadingStyles.size && C.emit("theme:load"));
} }, j = {
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
}, jr = `
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
function Pe(e) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Pe(e);
}
function kt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function wt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? kt(Object(n), !0).forEach(function(r) {
      Ar(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : kt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ar(e, t, n) {
  return (t = Lr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Lr(e) {
  var t = Nr(e, "string");
  return Pe(t) == "symbol" ? t : t + "";
}
function Nr(e, t) {
  if (Pe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Pe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Er(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  pt() && pt().components ? Kt(e) : t ? e() : qt(e);
}
var Ir = 0;
function Mr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = le(!1), r = le(e), o = le(null), l = tn() ? window.document : void 0, s = t.document, i = s === void 0 ? l : s, a = t.immediate, c = a === void 0 ? !0 : a, d = t.manual, u = d === void 0 ? !1 : d, p = t.name, m = p === void 0 ? "style_".concat(++Ir) : p, g = t.id, h = g === void 0 ? void 0 : g, b = t.media, v = b === void 0 ? void 0 : b, w = t.nonce, _ = w === void 0 ? void 0 : w, f = t.first, x = f === void 0 ? !1 : f, O = t.onMounted, M = O === void 0 ? void 0 : O, G = t.onUpdated, Q = G === void 0 ? void 0 : G, te = t.onLoad, Z = te === void 0 ? void 0 : te, ne = t.props, re = ne === void 0 ? {} : ne, J = function() {
  }, oe = function(pe) {
    var me = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (i) {
      var q = wt(wt({}, re), me), U = q.name || m, ie = q.id || h, ze = q.nonce || _;
      o.value = i.querySelector('style[data-primevue-style-id="'.concat(U, '"]')) || i.getElementById(ie) || i.createElement("style"), o.value.isConnected || (r.value = pe || e, Fe(o.value, {
        type: "text/css",
        id: ie,
        media: v,
        nonce: ze
      }), x ? i.head.prepend(o.value) : i.head.appendChild(o.value), vr(o.value, "data-primevue-style-id", U), Fe(o.value, q), o.value.onload = function(fe) {
        return Z?.(fe, {
          name: U
        });
      }, M?.(U)), !n.value && (J = xe(r, function(fe) {
        o.value.textContent = fe, Q?.(U);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, ue = function() {
    !i || !n.value || (J(), pr(o.value) && i.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return c && !u && Er(oe), {
    id: h,
    name: m,
    el: o,
    css: r,
    unload: ue,
    load: oe,
    isLoaded: zn(n)
  };
}
function Te(e) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Te(e);
}
var St, $t, _t, Pt;
function Tt(e, t) {
  return Vr(e) || Rr(e, t) || Dr(e, t) || zr();
}
function zr() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Dr(e, t) {
  if (e) {
    if (typeof e == "string") return Ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Ot(e, t) : void 0;
  }
}
function Ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Rr(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, i = [], a = !0, c = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(a = (r = l.call(n)).done) && (i.push(r.value), i.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function Vr(e) {
  if (Array.isArray(e)) return e;
}
function Ct(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Qe(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ct(Object(n), !0).forEach(function(r) {
      Br(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Br(e, t, n) {
  return (t = Ur(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Ur(e) {
  var t = Wr(e, "string");
  return Te(t) == "symbol" ? t : t + "";
}
function Wr(e, t) {
  if (Te(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Ue(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var Fr = function(t) {
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
}, Hr = {}, Kr = {}, T = {
  name: "base",
  css: Fr,
  style: jr,
  classes: Hr,
  inlineStyles: Kr,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(l) {
      return l;
    }, o = r(Be(St || (St = Ue(["", ""])), t));
    return P(o) ? Mr(Se(o), Qe({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, t);
  },
  loadStyle: function() {
    var t = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return $.transformCSS(n.name || t.name, "".concat(o).concat(Be($t || ($t = Ue(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return $.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return $.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return $.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return $.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return $.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = I(this.css, {
        dt: ce
      }) || "", o = Se(Be(_t || (_t = Ue(["", "", ""])), r, t)), l = Object.entries(n).reduce(function(s, i) {
        var a = Tt(i, 2), c = a[0], d = a[1];
        return s.push("".concat(c, '="').concat(d, '"')) && s;
      }, []).join(" ");
      return P(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(l, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return $.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [$.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), l = Be(Pt || (Pt = Ue(["", ""])), I(this.style, {
        dt: ce
      })), s = Se($.transformCSS(o, l)), i = Object.entries(n).reduce(function(a, c) {
        var d = Tt(c, 2), u = d[0], p = d[1];
        return a.push("".concat(u, '="').concat(p, '"')) && a;
      }, []).join(" ");
      P(s) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(i, ">").concat(s, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return Qe(Qe({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, ee = en();
function Oe(e) {
  "@babel/helpers - typeof";
  return Oe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Oe(e);
}
function jt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function We(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? jt(Object(n), !0).forEach(function(r) {
      qr(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : jt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function qr(e, t, n) {
  return (t = Yr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Yr(e) {
  var t = Gr(e, "string");
  return Oe(t) == "symbol" ? t : t + "";
}
function Gr(e, t) {
  if (Oe(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Oe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Qr = {
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
    text: [j.STARTS_WITH, j.CONTAINS, j.NOT_CONTAINS, j.ENDS_WITH, j.EQUALS, j.NOT_EQUALS],
    numeric: [j.EQUALS, j.NOT_EQUALS, j.LESS_THAN, j.LESS_THAN_OR_EQUAL_TO, j.GREATER_THAN, j.GREATER_THAN_OR_EQUAL_TO],
    date: [j.DATE_IS, j.DATE_IS_NOT, j.DATE_BEFORE, j.DATE_AFTER]
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
}, Zr = Symbol();
function Jr(e, t) {
  var n = {
    config: Dn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(Zr, n), Xr(), eo(e, n), n;
}
var be = [];
function Xr() {
  C.clear(), be.forEach(function(e) {
    return e?.();
  }), be = [];
}
function eo(e, t) {
  var n = le(!1), r = function() {
    var c;
    if (((c = t.config) === null || c === void 0 ? void 0 : c.theme) !== "none" && !$.isStyleNameLoaded("common")) {
      var d, u, p = ((d = T.getCommonTheme) === null || d === void 0 ? void 0 : d.call(T)) || {}, m = p.primitive, g = p.semantic, h = p.global, b = p.style, v = {
        nonce: (u = t.config) === null || u === void 0 || (u = u.csp) === null || u === void 0 ? void 0 : u.nonce
      };
      T.load(m?.css, We({
        name: "primitive-variables"
      }, v)), T.load(g?.css, We({
        name: "semantic-variables"
      }, v)), T.load(h?.css, We({
        name: "global-variables"
      }, v)), T.loadStyle(We({
        name: "global-style"
      }, v), b), $.setLoadedStyleName("common");
    }
  };
  C.on("theme:change", function(a) {
    n.value || (e.config.globalProperties.$primevue.config.theme = a, n.value = !0);
  });
  var o = xe(t.config, function(a, c) {
    ee.emit("config:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = xe(function() {
    return t.config.ripple;
  }, function(a, c) {
    ee.emit("config:ripple:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  }), s = xe(function() {
    return t.config.theme;
  }, function(a, c) {
    n.value || $.setTheme(a), t.config.unstyled || r(), n.value = !1, ee.emit("config:theme:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !1
  }), i = xe(function() {
    return t.config.unstyled;
  }, function(a, c) {
    !a && t.config.theme && r(), ee.emit("config:unstyled:change", {
      newValue: a,
      oldValue: c
    });
  }, {
    immediate: !0,
    deep: !0
  });
  be.push(o), be.push(l), be.push(s), be.push(i);
}
var to = {
  install: function(t, n) {
    var r = ir(Qr, n);
    Jr(t, r);
  }
}, dn = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = tn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function no(e, t, n, r, o, l) {
  return l.inline ? V(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (A(), we(Yt, {
    key: 1,
    to: n.appendTo
  }, [V(e.$slots, "default")], 8, ["to"])) : H("", !0);
}
dn.render = no;
var X = {
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
function ro() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = Rn();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var At = T.extend({
  name: "common"
});
function Ce(e) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ce(e);
}
function oo(e) {
  return mn(e) || ao(e) || pn(e) || un();
}
function ao(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ye(e, t) {
  return mn(e) || io(e, t) || pn(e, t) || un();
}
function un() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function pn(e, t) {
  if (e) {
    if (typeof e == "string") return Xe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Xe(e, t) : void 0;
  }
}
function Xe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function io(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, i = [], a = !0, c = !1;
    try {
      if (l = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        a = !1;
      } else for (; !(a = (r = l.call(n)).done) && (i.push(r.value), i.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function mn(e) {
  if (Array.isArray(e)) return e;
}
function Lt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function k(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Lt(Object(n), !0).forEach(function(r) {
      ke(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Lt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function ke(e, t, n) {
  return (t = lo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function lo(e) {
  var t = so(e, "string");
  return Ce(t) == "symbol" ? t : t + "";
}
function so(e, t) {
  if (Ce(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ce(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var lt = {
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
        C.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        C.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(t);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var t, n, r, o, l, s, i, a, c, d, u, p = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, m = p ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, g = p ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = g || m) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (l = o.onBeforeCreate) === null || l === void 0 || l.call(o);
    var h = (s = this.$primevueConfig) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s._usept, b = h ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.originalValue : void 0, v = h ? (a = this.$primevue) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a.value : (c = this.$primevue) === null || c === void 0 || (c = c.config) === null || c === void 0 ? void 0 : c.pt;
    (d = v || b) === null || d === void 0 || (d = d[this.$.type.name]) === null || d === void 0 || (d = d.hooks) === null || d === void 0 || (u = d.onBeforeCreate) === null || u === void 0 || u.call(d), this.$attrSelector = ro(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = fr(Me(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = k({
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
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(t)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(t));
        n?.(), r?.();
      }
    },
    _mergeProps: function(t) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return at(t) ? t.apply(void 0, r) : N.apply(void 0, r);
    },
    _load: function() {
      X.isStyleNameLoaded("base") || (T.loadCSS(this.$styleOptions), this._loadGlobalStyles(), X.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !X.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (At.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), X.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      P(t) && T.load(t, k({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!$.isStyleNameLoaded("common")) {
          var r, o, l = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, s = l.primitive, i = l.semantic, a = l.global, c = l.style;
          T.load(s?.css, k({
            name: "primitive-variables"
          }, this.$styleOptions)), T.load(i?.css, k({
            name: "semantic-variables"
          }, this.$styleOptions)), T.load(a?.css, k({
            name: "global-variables"
          }, this.$styleOptions)), T.loadStyle(k({
            name: "global-style"
          }, this.$styleOptions), c), $.setLoadedStyleName("common");
        }
        if (!$.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var d, u, p, m, g = ((d = this.$style) === null || d === void 0 || (u = d.getComponentTheme) === null || u === void 0 ? void 0 : u.call(d)) || {}, h = g.css, b = g.style;
          (p = this.$style) === null || p === void 0 || p.load(h, k({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (m = this.$style) === null || m === void 0 || m.loadStyle(k({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), b), $.setLoadedStyleName(this.$style.name);
        }
        if (!$.isStyleNameLoaded("layer-order")) {
          var v, w, _ = (v = this.$style) === null || v === void 0 || (w = v.getLayerOrderThemeCSS) === null || w === void 0 ? void 0 : w.call(v);
          T.load(_, k({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), $.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, l = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, s = l.css, i = (o = this.$style) === null || o === void 0 ? void 0 : o.load(s, k({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = i.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      X.clearLoadedStyleNames(), C.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      C.off("theme:change", this._loadCoreStyles), C.off("theme:change", this._load), C.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(t) {
      return t ? this.$options.hostName ? t.$.type.name === this.$options.hostName ? t : this._getHostInstance(t.$parentInstance) : t.$parentInstance : void 0;
    },
    _getPropValue: function(t) {
      var n;
      return this[t] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[t]);
    },
    _getOptionValue: function(t) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return it(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, s = /./g.test(r) && !!o[r.split(".")[0]], i = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, a = i.mergeSections, c = a === void 0 ? !0 : a, d = i.mergeProps, u = d === void 0 ? !1 : d, p = l ? s ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, m = s ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, k(k({}, o), {}, {
        global: p || {}
      })), g = this._getPTDatasets(r);
      return c || !c && m ? u ? this._mergeProps(u, p, m, g) : k(k(k({}, p), m), g) : k(k({}, m), g);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return N(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", l = r === "root" && P((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && k(k({}, r === "root" && k(k(ke({}, "".concat(o, "name"), F(l ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), l && ke({}, "".concat(o, "extend"), F(this.$.type.name))), {}, ke({}, "".concat(this.$attrSelector), ""))), {}, ke({}, "".concat(o, "section"), F(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return E(t) || Jt(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, l = function(i) {
        var a, c = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, d = o ? o(i) : i, u = F(r), p = F(n.$name);
        return (a = c ? u !== p ? d?.[u] : void 0 : d?.[u]) !== null && a !== void 0 ? a : d;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: l(t.originalValue),
        value: l(t.value)
      } : l(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var l = function(h) {
        return n(h, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var s, i = t._usept || ((s = this.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, a = i.mergeSections, c = a === void 0 ? !0 : a, d = i.mergeProps, u = d === void 0 ? !1 : d, p = l(t.originalValue), m = l(t.value);
        return p === void 0 && m === void 0 ? void 0 : E(m) ? m : E(p) ? p : c || !c && m ? u ? this._mergeProps(u, p, m) : k(k({}, p), m) : m;
      }
      return l(t);
    },
    _useGlobalPT: function(t, n, r) {
      return this._usePT(this.globalPT, t, n, r);
    },
    _useDefaultPT: function(t, n, r) {
      return this._usePT(this.defaultPT, t, n, r);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, k(k({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = N(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, k({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, k(k({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, k(k({}, this.$params), r)), l = this._getOptionValue(At.inlineStyles, t, k(k({}, this.$params), r));
        return [l, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return I(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, k({}, n.$params)) || I(r, k({}, n.$params));
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
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var o = ye(r, 1), l = o[0];
        return n?.includes(l);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return k(k({
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
        var n = ye(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = ye(n, 2), o = r[0], l = r[1], s = o.split(":"), i = oo(s), a = Xe(i).slice(1);
        return a?.reduce(function(c, d, u, p) {
          return !c[d] && (c[d] = u === p.length - 1 ? l : {}), c[d];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = ye(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = ye(n, 2), o = r[0], l = r[1];
        return t[o] = l, t;
      }, {});
    }
  }
};
function je(e) {
  "@babel/helpers - typeof";
  return je = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, je(e);
}
function Nt(e, t) {
  return mo(e) || po(e, t) || uo(e, t) || co();
}
function co() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function uo(e, t) {
  if (e) {
    if (typeof e == "string") return Et(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Et(e, t) : void 0;
  }
}
function Et(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function po(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, l, s, i = [], a = !0, c = !1;
    try {
      if (l = (n = n.call(e)).next, t !== 0) for (; !(a = (r = l.call(n)).done) && (i.push(r.value), i.length !== t); a = !0) ;
    } catch (d) {
      c = !0, o = d;
    } finally {
      try {
        if (!a && n.return != null && (s = n.return(), Object(s) !== s)) return;
      } finally {
        if (c) throw o;
      }
    }
    return i;
  }
}
function mo(e) {
  if (Array.isArray(e)) return e;
}
function It(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function S(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? It(Object(n), !0).forEach(function(r) {
      et(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : It(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function et(e, t, n) {
  return (t = fo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function fo(e) {
  var t = go(e, "string");
  return je(t) == "symbol" ? t : t + "";
}
function go(e, t) {
  if (je(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (je(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var y = {
  _getMeta: function() {
    return [K(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], I(K(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, l;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (l = n.ctx) === null || l === void 0 || (l = l.appContext) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.globalProperties) === null || l === void 0 ? void 0 : l.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: it,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, l = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", s = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, i = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, a = function() {
      var w = y._getOptionValue.apply(y, arguments);
      return E(w) || Jt(w) ? {
        class: w
      } : w;
    }, c = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, d = c.mergeSections, u = d === void 0 ? !0 : d, p = c.mergeProps, m = p === void 0 ? !1 : p, g = i ? y._useDefaultPT(r, r.defaultPT(), a, l, s) : void 0, h = y._usePT(r, y._getPT(o, r.$name), a, l, S(S({}, s), {}, {
      global: g || {}
    })), b = y._getPTDatasets(r, l);
    return u || !u && h ? m ? y._mergeProps(r, m, g, h, b) : S(S(S({}, g), h), b) : S(S({}, h), b);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return S(S({}, n === "root" && et({}, "".concat(r, "name"), F(t.$name))), {}, et({}, "".concat(r, "section"), F(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(s) {
      var i, a = r ? r(s) : s, c = F(n);
      return (i = a?.[c]) !== null && i !== void 0 ? i : a;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0, s = function(b) {
      return r(b, o, l);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var i, a = n._usept || ((i = t.$primevueConfig) === null || i === void 0 ? void 0 : i.ptOptions) || {}, c = a.mergeSections, d = c === void 0 ? !0 : c, u = a.mergeProps, p = u === void 0 ? !1 : u, m = s(n.originalValue), g = s(n.value);
      return m === void 0 && g === void 0 ? void 0 : E(g) ? g : E(m) ? m : d || !d && g ? p ? y._mergeProps(t, p, m, g) : S(S({}, m), g) : g;
    }
    return s(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, l = arguments.length > 4 ? arguments[4] : void 0;
    return y._usePT(t, n, r, o, l);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, l = y._getConfig(r, o), s = {
      nonce: l == null || (t = l.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    y._loadCoreStyles(n, s), y._loadThemeStyles(n, s), y._loadScopedThemeStyles(n, s), y._removeThemeListeners(n), n.$loadStyles = function() {
      return y._loadThemeStyles(n, s);
    }, y._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!X.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var l;
      T.loadCSS(o), (l = r.$style) === null || l === void 0 || l.loadCSS(o), X.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, l = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!$.isStyleNameLoaded("common")) {
        var s, i, a = ((s = o.$style) === null || s === void 0 || (i = s.getCommonTheme) === null || i === void 0 ? void 0 : i.call(s)) || {}, c = a.primitive, d = a.semantic, u = a.global, p = a.style;
        T.load(c?.css, S({
          name: "primitive-variables"
        }, l)), T.load(d?.css, S({
          name: "semantic-variables"
        }, l)), T.load(u?.css, S({
          name: "global-variables"
        }, l)), T.loadStyle(S({
          name: "global-style"
        }, l), p), $.setLoadedStyleName("common");
      }
      if (!$.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var m, g, h, b, v = ((m = o.$style) === null || m === void 0 || (g = m.getDirectiveTheme) === null || g === void 0 ? void 0 : g.call(m)) || {}, w = v.css, _ = v.style;
        (h = o.$style) === null || h === void 0 || h.load(w, S({
          name: "".concat(o.$style.name, "-variables")
        }, l)), (b = o.$style) === null || b === void 0 || b.loadStyle(S({
          name: "".concat(o.$style.name, "-style")
        }, l), _), $.setLoadedStyleName(o.$style.name);
      }
      if (!$.isStyleNameLoaded("layer-order")) {
        var f, x, O = (f = o.$style) === null || f === void 0 || (x = f.getLayerOrderThemeCSS) === null || x === void 0 ? void 0 : x.call(f);
        T.load(O, S({
          name: "layer-order",
          first: !0
        }, l)), $.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, l, s, i = ((o = t.$style) === null || o === void 0 || (l = o.getPresetTheme) === null || l === void 0 ? void 0 : l.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, a = i.css, c = (s = t.$style) === null || s === void 0 ? void 0 : s.load(a, S({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = c.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    X.clearLoadedStyleNames(), C.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    C.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, l, s) {
    var i, a, c = "on".concat(lr(n)), d = y._getConfig(o, l), u = r?.$instance, p = y._usePT(u, y._getPT(o == null || (i = o.value) === null || i === void 0 ? void 0 : i.pt, t), y._getOptionValue, "hooks.".concat(c)), m = y._useDefaultPT(u, d == null || (a = d.pt) === null || a === void 0 || (a = a.directives) === null || a === void 0 ? void 0 : a[t], y._getOptionValue, "hooks.".concat(c)), g = {
      el: r,
      binding: o,
      vnode: l,
      prevVnode: s
    };
    p?.(u, g), m?.(u, g);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return at(t) ? t.apply(void 0, r) : N.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(i, a, c, d, u) {
      var p, m, g, h;
      a._$instances = a._$instances || {};
      var b = y._getConfig(c, d), v = a._$instances[t] || {}, w = de(v) ? S(S({}, n), n?.methods) : {};
      a._$instances[t] = S(S({}, v), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: a,
        $binding: c,
        $modifiers: c?.modifiers,
        $value: c?.value,
        $el: v.$el || a || void 0,
        $style: S({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: b,
        $attrSelector: (p = a.$pd) === null || p === void 0 || (p = p[t]) === null || p === void 0 ? void 0 : p.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return y._getPT(b?.pt, void 0, function(f) {
            var x;
            return f == null || (x = f.directives) === null || x === void 0 ? void 0 : x[t];
          });
        },
        isUnstyled: function() {
          var f, x;
          return ((f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.unstyled) !== void 0 ? (x = a._$instances[t]) === null || x === void 0 || (x = x.$binding) === null || x === void 0 || (x = x.value) === null || x === void 0 ? void 0 : x.unstyled : b?.unstyled;
        },
        theme: function() {
          var f;
          return (f = a._$instances[t]) === null || f === void 0 || (f = f.$primevueConfig) === null || f === void 0 ? void 0 : f.theme;
        },
        preset: function() {
          var f;
          return (f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.dt;
        },
        /* instance's methods */
        ptm: function() {
          var f, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", O = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return y._getPTValue(a._$instances[t], (f = a._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.pt, x, S({}, O));
        },
        ptmo: function() {
          var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, x = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", O = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return y._getPTValue(a._$instances[t], f, x, O, !1);
        },
        cx: function() {
          var f, x, O = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", M = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (f = a._$instances[t]) !== null && f !== void 0 && f.isUnstyled() ? void 0 : y._getOptionValue((x = a._$instances[t]) === null || x === void 0 || (x = x.$style) === null || x === void 0 ? void 0 : x.classes, O, S({}, M));
        },
        sx: function() {
          var f, x = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", O = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, M = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return O ? y._getOptionValue((f = a._$instances[t]) === null || f === void 0 || (f = f.$style) === null || f === void 0 ? void 0 : f.inlineStyles, x, S({}, M)) : void 0;
        }
      }, w), a.$instance = a._$instances[t], (m = (g = a.$instance)[i]) === null || m === void 0 || m.call(g, a, c, d, u), a["$".concat(t)] = a.$instance, y._hook(t, i, a, c, d, u), a.$pd || (a.$pd = {}), a.$pd[t] = S(S({}, (h = a.$pd) === null || h === void 0 ? void 0 : h[t]), {}, {
        name: t,
        instance: a._$instances[t]
      });
    }, o = function(i) {
      var a, c, d, u = i._$instances[t], p = u?.watch, m = function(b) {
        var v, w = b.newValue, _ = b.oldValue;
        return p == null || (v = p.config) === null || v === void 0 ? void 0 : v.call(u, w, _);
      }, g = function(b) {
        var v, w = b.newValue, _ = b.oldValue;
        return p == null || (v = p["config.ripple"]) === null || v === void 0 ? void 0 : v.call(u, w, _);
      };
      u.$watchersCallback = {
        config: m,
        "config.ripple": g
      }, p == null || (a = p.config) === null || a === void 0 || a.call(u, u?.$primevueConfig), ee.on("config:change", m), p == null || (c = p["config.ripple"]) === null || c === void 0 || c.call(u, u == null || (d = u.$primevueConfig) === null || d === void 0 ? void 0 : d.ripple), ee.on("config:ripple:change", g);
    }, l = function(i) {
      var a = i._$instances[t].$watchersCallback;
      a && (ee.off("config:change", a.config), ee.off("config:ripple:change", a["config.ripple"]), i._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(i, a, c, d) {
        i.$pd || (i.$pd = {}), i.$pd[t] = {
          name: t,
          attrSelector: yr("pd")
        }, r("created", i, a, c, d);
      },
      beforeMount: function(i, a, c, d) {
        var u;
        y._loadStyles((u = i.$pd[t]) === null || u === void 0 ? void 0 : u.instance, a, c), r("beforeMount", i, a, c, d), o(i);
      },
      mounted: function(i, a, c, d) {
        var u;
        y._loadStyles((u = i.$pd[t]) === null || u === void 0 ? void 0 : u.instance, a, c), r("mounted", i, a, c, d);
      },
      beforeUpdate: function(i, a, c, d) {
        r("beforeUpdate", i, a, c, d);
      },
      updated: function(i, a, c, d) {
        var u;
        y._loadStyles((u = i.$pd[t]) === null || u === void 0 ? void 0 : u.instance, a, c), r("updated", i, a, c, d);
      },
      beforeUnmount: function(i, a, c, d) {
        var u;
        l(i), y._removeThemeListeners((u = i.$pd[t]) === null || u === void 0 ? void 0 : u.instance), r("beforeUnmount", i, a, c, d);
      },
      unmounted: function(i, a, c, d) {
        var u;
        (u = i.$pd[t]) === null || u === void 0 || (u = u.instance) === null || u === void 0 || (u = u.scopedStyleEl) === null || u === void 0 || (u = u.value) === null || u === void 0 || u.remove(), r("unmounted", i, a, c, d);
      }
    };
  },
  extend: function() {
    var t = y._getMeta.apply(y, arguments), n = Nt(t, 2), r = n[0], o = n[1];
    return S({
      extend: function() {
        var s = y._getMeta.apply(y, arguments), i = Nt(s, 2), a = i[0], c = i[1];
        return y.extend(a, S(S(S({}, o), o?.methods), c));
      }
    }, y._extend(r, o));
  }
}, bo = `
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
`, ho = {
  root: "p-ink"
}, vo = T.extend({
  name: "ripple-directive",
  style: bo,
  classes: ho
}), yo = y.extend({
  style: vo
});
function Ae(e) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ae(e);
}
function xo(e) {
  return $o(e) || So(e) || wo(e) || ko();
}
function ko() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function wo(e, t) {
  if (e) {
    if (typeof e == "string") return tt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? tt(e, t) : void 0;
  }
}
function So(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function $o(e) {
  if (Array.isArray(e)) return tt(e);
}
function tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Mt(e, t, n) {
  return (t = _o(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function _o(e) {
  var t = Po(e, "string");
  return Ae(t) == "symbol" ? t : t + "";
}
function Po(e, t) {
  if (Ae(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ae(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var To = yo.extend("ripple", {
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
      n || (n = mr("span", Mt(Mt({
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
      var n = this, r = t.currentTarget, o = this.getInk(r);
      if (!(!o || getComputedStyle(o, null).display === "none")) {
        if (!this.isUnstyled() && Ye(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !ht(o) && !vt(o)) {
          var l = Math.max(dr(r), hr(r));
          o.style.height = l + "px", o.style.width = l + "px";
        }
        var s = br(r), i = t.pageX - s.left + document.body.scrollTop - vt(o) / 2, a = t.pageY - s.top + document.body.scrollLeft - ht(o) / 2;
        o.style.top = a + "px", o.style.left = i + "px", !this.isUnstyled() && cr(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && Ye(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Ye(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? xo(t.children).find(function(n) {
        return gr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
const Oo = "data-wippy-overlay-layer";
function fn() {
  return typeof window < "u" && typeof window.document < "u";
}
function gn() {
  return fn() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function Co() {
  return gn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("top", "anchor(--a bottom)");
}
const jo = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let Ao = 0;
const Ke = /* @__PURE__ */ new WeakMap();
function zt(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("top", `anchor(${t} bottom)`, "important"), n.setProperty("left", `anchor(${t} left)`, "important"), n.setProperty("position-try-fallbacks", "flip-block");
}
function Lo(e, t) {
  if (!jo.test(e.className))
    return;
  const n = e.style.cssText;
  zt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Ke.has(e)) {
    const r = new MutationObserver(() => {
      e.style.getPropertyPriority("top") !== "important" && zt(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ke.set(e, r);
  }
}
function st(e) {
  const t = Ke.get(e);
  t && (t.disconnect(), Ke.delete(e));
}
function No(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function nt(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const qe = /* @__PURE__ */ new Set(), ct = /* @__PURE__ */ new WeakMap();
let Dt = !1, rt = !1;
function Eo() {
  rt = !1;
  for (const e of qe) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && st(t);
      qe.delete(e), ct.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && nt(e);
  }
}
function Rt() {
  rt || (rt = !0, requestAnimationFrame(Eo));
}
function Io(e) {
  const t = document.createElement("div");
  t.setAttribute(Oo, "");
  const n = gn();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  nt(t);
  const r = new MutationObserver((o) => {
    const l = t.__wippyAnchorName;
    for (const s of o) {
      if (l)
        for (const i of Array.from(s.addedNodes))
          i instanceof HTMLElement && Lo(i, l);
      for (const i of Array.from(s.removedNodes))
        i instanceof HTMLElement && st(i);
    }
    t.isConnected && t.childElementCount > 0 && nt(t);
  });
  return r.observe(t, { childList: !0 }), ct.set(t, r), qe.add(t), Dt || (Dt = !0, window.addEventListener("scroll", Rt, { capture: !0, passive: !0 }), window.addEventListener("resize", Rt, { passive: !0 })), t;
}
function Vt(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = Io(e.hostRoot), Co())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++Ao}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function Bt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && st(t);
    qe.delete(e.layer), ct.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let Ut = !1;
function Mo() {
  if (Ut)
    return;
  Ut = !0;
  const e = dn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    fn() && (this.hostRoot = No(this.$el), this.mounted = !0, this.hostRoot && (this.inline || Vt(this), this.$watch("inline", (t) => {
      t ? Bt(this) : Vt(this);
    })));
  }, e.render = function() {
    return this.inline ? V(this.$slots, "default", { key: 0 }) : this.mounted ? Vn(Yt, { key: 1, to: this.resolvedTarget || document.body }, [
      V(this.$slots, "default")
    ]) : H("", !0);
  }, e.unmounted = function() {
    Bt(this);
  };
}
const La = {
  install: (e) => {
    Mo(), e.use(to, { theme: "none" });
  }
};
function Na() {
  const e = Qn(), t = le(null), n = le(""), r = Zn(async () => {
    try {
      const o = await Jn.catalog();
      if (!e()) return;
      t.value = o, n.value = "";
    } catch (o) {
      if (!e()) return;
      n.value = Xn(o, "Could not load the agent catalog.");
    }
  }, e);
  return Bn("catalog", t), Gn(r), { catalog: t, error: n, load: r };
}
function Ea() {
  const e = Un("catalog");
  if (!e) throw new Error("Autocode catalog provider is missing.");
  return Wn(() => {
    if (!e.value) throw new Error("Autocode catalog is not loaded.");
    return e.value;
  });
}
var zo = `
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
`, Do = T.extend({
  name: "baseicon",
  css: zo
});
function Le(e) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Le(e);
}
function Wt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Ft(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Wt(Object(n), !0).forEach(function(r) {
      Ro(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Wt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function Ro(e, t, n) {
  return (t = Vo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Vo(e) {
  var t = Bo(e, "string");
  return Le(t) == "symbol" ? t : t + "";
}
function Bo(e, t) {
  if (Le(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var Uo = {
  name: "BaseIcon",
  extends: lt,
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
  style: Do,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = de(this.label);
      return Ft(Ft({}, !this.isUnstyled && {
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
}, bn = {
  name: "SpinnerIcon",
  extends: Uo
};
function Wo(e) {
  return qo(e) || Ko(e) || Ho(e) || Fo();
}
function Fo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Ho(e, t) {
  if (e) {
    if (typeof e == "string") return ot(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ot(e, t) : void 0;
  }
}
function Ko(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function qo(e) {
  if (Array.isArray(e)) return ot(e);
}
function ot(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Yo(e, t, n, r, o, l) {
  return A(), B("svg", N({
    width: "14",
    height: "14",
    viewBox: "0 0 14 14",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg"
  }, e.pti()), Wo(t[0] || (t[0] = [D("path", {
    d: "M6.99701 14C5.85441 13.999 4.72939 13.7186 3.72012 13.1832C2.71084 12.6478 1.84795 11.8737 1.20673 10.9284C0.565504 9.98305 0.165424 8.89526 0.041387 7.75989C-0.0826496 6.62453 0.073125 5.47607 0.495122 4.4147C0.917119 3.35333 1.59252 2.4113 2.46241 1.67077C3.33229 0.930247 4.37024 0.413729 5.4857 0.166275C6.60117 -0.0811796 7.76026 -0.0520535 8.86188 0.251112C9.9635 0.554278 10.9742 1.12227 11.8057 1.90555C11.915 2.01493 11.9764 2.16319 11.9764 2.31778C11.9764 2.47236 11.915 2.62062 11.8057 2.73C11.7521 2.78503 11.688 2.82877 11.6171 2.85864C11.5463 2.8885 11.4702 2.90389 11.3933 2.90389C11.3165 2.90389 11.2404 2.8885 11.1695 2.85864C11.0987 2.82877 11.0346 2.78503 10.9809 2.73C9.9998 1.81273 8.73246 1.26138 7.39226 1.16876C6.05206 1.07615 4.72086 1.44794 3.62279 2.22152C2.52471 2.99511 1.72683 4.12325 1.36345 5.41602C1.00008 6.70879 1.09342 8.08723 1.62775 9.31926C2.16209 10.5513 3.10478 11.5617 4.29713 12.1803C5.48947 12.7989 6.85865 12.988 8.17414 12.7157C9.48963 12.4435 10.6711 11.7264 11.5196 10.6854C12.3681 9.64432 12.8319 8.34282 12.8328 7C12.8328 6.84529 12.8943 6.69692 13.0038 6.58752C13.1132 6.47812 13.2616 6.41667 13.4164 6.41667C13.5712 6.41667 13.7196 6.47812 13.8291 6.58752C13.9385 6.69692 14 6.84529 14 7C14 8.85651 13.2622 10.637 11.9489 11.9497C10.6356 13.2625 8.85432 14 6.99701 14Z",
    fill: "currentColor"
  }, null, -1)])), 16);
}
bn.render = Yo;
var Go = `
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
`, Qo = {
  root: function(t) {
    var n = t.props, r = t.instance;
    return ["p-badge p-component", {
      "p-badge-circle": P(n.value) && String(n.value).length === 1,
      "p-badge-dot": de(n.value) && !r.$slots.default,
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
}, Zo = T.extend({
  name: "badge",
  style: Go,
  classes: Qo
}), Jo = {
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
  style: Zo,
  provide: function() {
    return {
      $pcBadge: this,
      $parentInstance: this
    };
  }
};
function Ne(e) {
  "@babel/helpers - typeof";
  return Ne = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ne(e);
}
function Ht(e, t, n) {
  return (t = Xo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Xo(e) {
  var t = ea(e, "string");
  return Ne(t) == "symbol" ? t : t + "";
}
function ea(e, t) {
  if (Ne(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ne(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var hn = {
  name: "Badge",
  extends: Jo,
  inheritAttrs: !1,
  computed: {
    dataP: function() {
      return $e(Ht(Ht({
        circle: this.value != null && String(this.value).length === 1,
        empty: this.value == null && !this.$slots.default
      }, this.severity, this.severity), this.size, this.size));
    }
  }
}, ta = ["data-p"];
function na(e, t, n, r, o, l) {
  return A(), B("span", N({
    class: e.cx("root"),
    "data-p": l.dataP
  }, e.ptmi("root")), [V(e.$slots, "default", {}, function() {
    return [Fn(he(e.value), 1)];
  })], 16, ta);
}
hn.render = na;
var ra = `
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
function Ee(e) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ee(e);
}
function W(e, t, n) {
  return (t = oa(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function oa(e) {
  var t = aa(e, "string");
  return Ee(t) == "symbol" ? t : t + "";
}
function aa(e, t) {
  if (Ee(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ee(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ia = {
  root: function(t) {
    var n = t.instance, r = t.props;
    return ["p-button p-component", W(W(W(W(W(W(W(W(W({
      "p-button-icon-only": n.hasIcon && !r.label && !r.badge,
      "p-button-vertical": (r.iconPos === "top" || r.iconPos === "bottom") && r.label,
      "p-button-loading": r.loading,
      "p-button-link": r.link || r.variant === "link"
    }, "p-button-".concat(r.severity), r.severity), "p-button-raised", r.raised), "p-button-rounded", r.rounded), "p-button-text", r.text || r.variant === "text"), "p-button-outlined", r.outlined || r.variant === "outlined"), "p-button-sm", r.size === "small"), "p-button-lg", r.size === "large"), "p-button-plain", r.plain), "p-button-fluid", n.hasFluid)];
  },
  loadingIcon: "p-button-loading-icon",
  icon: function(t) {
    var n = t.props;
    return ["p-button-icon", W({}, "p-button-icon-".concat(n.iconPos), n.label)];
  },
  label: "p-button-label"
}, la = T.extend({
  name: "button",
  style: ra,
  classes: ia
}), sa = {
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
  style: la,
  provide: function() {
    return {
      $pcButton: this,
      $parentInstance: this
    };
  }
};
function Ie(e) {
  "@babel/helpers - typeof";
  return Ie = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Ie(e);
}
function L(e, t, n) {
  return (t = ca(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function ca(e) {
  var t = da(e, "string");
  return Ie(t) == "symbol" ? t : t + "";
}
function da(e, t) {
  if (Ie(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Ie(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var vn = {
  name: "Button",
  extends: sa,
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
      return N(this.asAttrs, this.a11yAttrs, this.getPTOptions("root"));
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
      return de(this.fluid) ? !!this.$pcFluid : this.fluid;
    },
    dataP: function() {
      return $e(L(L(L(L(L(L(L(L(L(L({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge), "loading", this.loading), "fluid", this.hasFluid), "rounded", this.rounded), "raised", this.raised), "outlined", this.outlined || this.variant === "outlined"), "text", this.text || this.variant === "text"), "link", this.link || this.variant === "link"), "vertical", (this.iconPos === "top" || this.iconPos === "bottom") && this.label));
    },
    dataIconP: function() {
      return $e(L(L({}, this.iconPos, this.iconPos), this.size, this.size));
    },
    dataLabelP: function() {
      return $e(L(L({}, this.size, this.size), "icon-only", this.hasIcon && !this.label && !this.badge));
    }
  },
  components: {
    SpinnerIcon: bn,
    Badge: hn
  },
  directives: {
    ripple: To
  }
}, ua = ["data-p"], pa = ["data-p"];
function ma(e, t, n, r, o, l) {
  var s = mt("SpinnerIcon"), i = mt("Badge"), a = Hn("ripple");
  return e.asChild ? V(e.$slots, "default", {
    key: 1,
    class: Ze(e.cx("root")),
    a11yAttrs: l.a11yAttrs
  }) : Kn((A(), we(qn(e.as), N({
    key: 0,
    class: e.cx("root"),
    "data-p": l.dataP
  }, l.attrs), {
    default: Gt(function() {
      return [V(e.$slots, "default", {}, function() {
        return [e.loading ? V(e.$slots, "loadingicon", N({
          key: 0,
          class: [e.cx("loadingIcon"), e.cx("icon")]
        }, e.ptm("loadingIcon")), function() {
          return [e.loadingIcon ? (A(), B("span", N({
            key: 0,
            class: [e.cx("loadingIcon"), e.cx("icon"), e.loadingIcon]
          }, e.ptm("loadingIcon")), null, 16)) : (A(), we(s, N({
            key: 1,
            class: [e.cx("loadingIcon"), e.cx("icon")],
            spin: ""
          }, e.ptm("loadingIcon")), null, 16, ["class"]))];
        }) : V(e.$slots, "icon", N({
          key: 1,
          class: [e.cx("icon")]
        }, e.ptm("icon")), function() {
          return [e.icon ? (A(), B("span", N({
            key: 0,
            class: [e.cx("icon"), e.icon, e.iconClass],
            "data-p": l.dataIconP
          }, e.ptm("icon")), null, 16, ua)) : H("", !0)];
        }), e.label ? (A(), B("span", N({
          key: 2,
          class: e.cx("label")
        }, e.ptm("label"), {
          "data-p": l.dataLabelP
        }), he(e.label), 17, pa)) : H("", !0), e.badge ? (A(), we(i, {
          key: 3,
          value: e.badge,
          class: Ze(e.badgeClass),
          severity: e.badgeSeverity,
          unstyled: e.unstyled,
          pt: e.ptm("pcBadge")
        }, null, 8, ["value", "class", "severity", "unstyled", "pt"])) : H("", !0)];
      })];
    }),
    _: 3
  }, 16, ["class", "data-p"])), [[a]]);
}
vn.render = ma;
const fa = { class: "kx-head" }, ga = { class: "kx-head-icon" }, ba = { class: "kx-head-text" }, ha = { class: "kx-title" }, va = { class: "kx-head-sub" }, ya = { class: "kx-head-actions" }, xa = {
  key: 0,
  class: "kx-count"
}, ka = {
  key: 1,
  class: "kx-search",
  role: "search"
}, wa = ["value", "placeholder", "aria-label"], Ia = /* @__PURE__ */ Qt({
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
  setup(e) {
    return (t, n) => (A(), B("header", fa, [
      D("div", ga, [
        De(ve(Re), {
          icon: "tabler:robot",
          "aria-hidden": "true"
        })
      ]),
      D("div", ba, [
        D("h1", ha, he(e.title), 1),
        D("p", va, he(e.subtitle), 1)
      ]),
      D("div", ya, [
        e.count ? (A(), B("span", xa, he(e.count), 1)) : H("", !0),
        e.placeholder ? (A(), B("div", ka, [
          De(ve(Re), {
            icon: "tabler:search",
            "aria-hidden": "true"
          }),
          D("input", {
            type: "search",
            value: e.query,
            class: "kx-search-input kx-focus-halo",
            placeholder: e.placeholder,
            "aria-label": e.placeholder,
            onInput: n[0] || (n[0] = (r) => t.$emit("update:query", r.target.value))
          }, null, 40, wa),
          e.query ? (A(), B("button", {
            key: 0,
            type: "button",
            class: "kx-search-clear kx-focus-outline",
            "aria-label": "Clear search",
            onClick: n[1] || (n[1] = (r) => t.$emit("update:query", ""))
          }, [
            De(ve(Re), {
              icon: "tabler:x",
              "aria-hidden": "true"
            })
          ])) : H("", !0)
        ])) : H("", !0),
        e.action ? (A(), we(ve(vn), {
          key: 2,
          label: e.action,
          onClick: n[2] || (n[2] = (r) => t.$emit("create"))
        }, {
          icon: Gt(() => [
            De(ve(Re), {
              icon: "tabler:plus",
              "aria-hidden": "true"
            })
          ]),
          _: 1
        }, 8, ["label"])) : H("", !0)
      ])
    ]));
  }
}), Sa = ["aria-label", "aria-busy"], $a = { class: "ac-dialog-header" }, _a = ["disabled"], Pa = { class: "ac-dialog-content" }, Ta = {
  key: 0,
  class: "ac-dialog-footer"
}, Ma = /* @__PURE__ */ Qt({
  __name: "app-dialog",
  props: {
    title: {},
    wide: { type: Boolean },
    busy: { type: Boolean }
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, r = t, o = le(null);
    function l(i) {
      i.preventDefault(), n.busy || r("close");
    }
    function s(i) {
      const a = o.value;
      if (!a || i.target !== a) return;
      const c = a.getBoundingClientRect();
      (i.clientX < c.left || i.clientX > c.right || i.clientY < c.top || i.clientY > c.bottom) && l(i);
    }
    return Kt(async () => {
      await qt(), o.value && !o.value.open && o.value.showModal();
    }), Yn(() => {
      o.value?.open && o.value.close();
    }), (i, a) => (A(), B("dialog", {
      ref_key: "dialog",
      ref: o,
      class: Ze(["ac-dialog", { "ac-dialog-wide": e.wide }]),
      "aria-label": e.title,
      "aria-modal": "true",
      "aria-busy": e.busy || void 0,
      onCancel: l,
      onClose: a[1] || (a[1] = (c) => !e.busy && r("close")),
      onClick: s
    }, [
      D("header", $a, [
        D("h2", null, he(e.title), 1),
        D("button", {
          type: "button",
          class: "ac-icon-btn kx-focus-outline",
          "aria-label": "Close dialog",
          disabled: e.busy,
          onClick: a[0] || (a[0] = (c) => r("close"))
        }, "×", 8, _a)
      ]),
      D("div", Pa, [
        V(i.$slots, "default")
      ]),
      i.$slots.footer ? (A(), B("footer", Ta, [
        V(i.$slots, "footer")
      ])) : H("", !0)
    ], 42, Sa));
  }
}), za = ':root{--p-form-field-padding-x: .75rem;--p-form-field-padding-y: .5rem;--p-form-field-sm-padding-x: .625rem;--p-form-field-sm-padding-y: .375rem;--p-form-field-lg-padding-x: .875rem;--p-form-field-lg-padding-y: .625rem;--p-form-field-border-radius: .375rem;--p-form-field-transition-duration: .2s;--p-form-field-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), 0 1px 2px 0 rgba(18, 18, 23, .05);--p-focus-ring-width: 1px;--p-focus-ring-style: solid;--p-focus-ring-color: color-mix(in srgb, var(--p-primary-color) 100%, transparent);--p-focus-ring-offset: 2px;--p-toggleswitch-width: 2.5rem;--p-toggleswitch-height: 1.5rem;--p-toggleswitch-border-radius: 30px;--p-toggleswitch-gap: .25rem;--p-toggleswitch-border-width: 1px;--p-toggleswitch-transition-duration: .2s;--p-toggleswitch-slide-duration: .2s;--p-toggleswitch-handle-size: 1rem;--p-toggleswitch-handle-border-radius: 9999px}:root{color-scheme:light dark;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-secondary: #6f7385;--p-secondary-50: color-mix(in srgb, var(--p-secondary) 5%, white);--p-secondary-100: color-mix(in srgb, var(--p-secondary) 10%, white);--p-secondary-200: color-mix(in srgb, var(--p-secondary) 20%, white);--p-secondary-300: color-mix(in srgb, var(--p-secondary) 35%, white);--p-secondary-400: color-mix(in srgb, var(--p-secondary) 65%, white);--p-secondary-500: var(--p-secondary);--p-secondary-600: color-mix(in srgb, var(--p-secondary) 80%, black);--p-secondary-700: color-mix(in srgb, var(--p-secondary) 65%, black);--p-secondary-800: color-mix(in srgb, var(--p-secondary) 55%, black);--p-secondary-900: color-mix(in srgb, var(--p-secondary) 50%, black);--p-secondary-950: color-mix(in srgb, var(--p-secondary) 30%, black);--p-danger: rgb(239, 68, 68);--p-danger-50: color-mix(in srgb, var(--p-danger) 5%, white);--p-danger-100: color-mix(in srgb, var(--p-danger) 10%, white);--p-danger-200: color-mix(in srgb, var(--p-danger) 20%, white);--p-danger-300: color-mix(in srgb, var(--p-danger) 30%, white);--p-danger-400: color-mix(in srgb, var(--p-danger) 40%, white);--p-danger-500: var(--p-danger);--p-danger-600: color-mix(in srgb, var(--p-danger) 80%, black);--p-danger-700: color-mix(in srgb, var(--p-danger) 70%, black);--p-danger-800: color-mix(in srgb, var(--p-danger) 60%, black);--p-danger-900: color-mix(in srgb, var(--p-danger) 50%, black);--p-danger-950: color-mix(in srgb, var(--p-danger) 40%, black);--p-success: rgb(34, 197, 94);--p-success-50: color-mix(in srgb, var(--p-success) 5%, white);--p-success-100: color-mix(in srgb, var(--p-success) 10%, white);--p-success-200: color-mix(in srgb, var(--p-success) 20%, white);--p-success-300: color-mix(in srgb, var(--p-success) 30%, white);--p-success-400: color-mix(in srgb, var(--p-success) 40%, white);--p-success-500: var(--p-success);--p-success-600: color-mix(in srgb, var(--p-success) 80%, black);--p-success-700: color-mix(in srgb, var(--p-success) 70%, black);--p-success-800: color-mix(in srgb, var(--p-success) 60%, black);--p-success-900: color-mix(in srgb, var(--p-success) 50%, black);--p-success-950: color-mix(in srgb, var(--p-success) 40%, black);--p-warn: rgb(249, 115, 22);--p-warn-50: color-mix(in srgb, var(--p-warn) 5%, white);--p-warn-100: color-mix(in srgb, var(--p-warn) 10%, white);--p-warn-200: color-mix(in srgb, var(--p-warn) 20%, white);--p-warn-300: color-mix(in srgb, var(--p-warn) 30%, white);--p-warn-400: color-mix(in srgb, var(--p-warn) 40%, white);--p-warn-500: var(--p-warn);--p-warn-600: color-mix(in srgb, var(--p-warn) 80%, black);--p-warn-700: color-mix(in srgb, var(--p-warn) 70%, black);--p-warn-800: color-mix(in srgb, var(--p-warn) 60%, black);--p-warn-900: color-mix(in srgb, var(--p-warn) 50%, black);--p-warn-950: color-mix(in srgb, var(--p-warn) 40%, black);--p-info: rgb(14, 165, 233);--p-info-50: color-mix(in srgb, var(--p-info) 5%, white);--p-info-100: color-mix(in srgb, var(--p-info) 10%, white);--p-info-200: color-mix(in srgb, var(--p-info) 20%, white);--p-info-300: color-mix(in srgb, var(--p-info) 30%, white);--p-info-400: color-mix(in srgb, var(--p-info) 40%, white);--p-info-500: var(--p-info);--p-info-600: color-mix(in srgb, var(--p-info) 80%, black);--p-info-700: color-mix(in srgb, var(--p-info) 70%, black);--p-info-800: color-mix(in srgb, var(--p-info) 60%, black);--p-info-900: color-mix(in srgb, var(--p-info) 50%, black);--p-info-950: color-mix(in srgb, var(--p-info) 40%, black);--p-help: rgb(168, 85, 247);--p-help-50: color-mix(in srgb, var(--p-help) 5%, white);--p-help-100: color-mix(in srgb, var(--p-help) 10%, white);--p-help-200: color-mix(in srgb, var(--p-help) 20%, white);--p-help-300: color-mix(in srgb, var(--p-help) 30%, white);--p-help-400: color-mix(in srgb, var(--p-help) 40%, white);--p-help-500: var(--p-help);--p-help-600: color-mix(in srgb, var(--p-help) 80%, black);--p-help-700: color-mix(in srgb, var(--p-help) 70%, black);--p-help-800: color-mix(in srgb, var(--p-help) 60%, black);--p-help-900: color-mix(in srgb, var(--p-help) 50%, black);--p-help-950: color-mix(in srgb, var(--p-help) 40%, black);--p-accent: rgb(20, 184, 166);--p-accent-50: color-mix(in srgb, var(--p-accent) 5%, white);--p-accent-100: color-mix(in srgb, var(--p-accent) 10%, white);--p-accent-200: color-mix(in srgb, var(--p-accent) 20%, white);--p-accent-300: color-mix(in srgb, var(--p-accent) 30%, white);--p-accent-400: color-mix(in srgb, var(--p-accent) 40%, white);--p-accent-500: var(--p-accent);--p-accent-600: color-mix(in srgb, var(--p-accent) 80%, black);--p-accent-700: color-mix(in srgb, var(--p-accent) 70%, black);--p-accent-800: color-mix(in srgb, var(--p-accent) 60%, black);--p-accent-900: color-mix(in srgb, var(--p-accent) 50%, black);--p-accent-950: color-mix(in srgb, var(--p-accent) 40%, black);--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-content-border-radius: 6px;--p-font-heading-family: var(--v-font-family-head, Arial);--p-font-heading-scale: 1;--p-font-heading-line-height: 1.5;--p-font-heading-letter-spacing: normal;--p-font-heading-stretch: normal;--p-font-heading-variation-settings: normal;--p-font-body-scale: 1;--p-font-body-line-height: 1.5;--p-font-body-letter-spacing: normal;--p-font-body-stretch: normal;--p-font-body-variation-settings: normal;--p-font-mono-family: ui-monospace}:root{--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}@media(prefers-color-scheme:dark){:root:not(.w-theme-light){--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}}:root.w-theme-dark,.w-theme-dark{color-scheme:dark;--p-surface-D: #fff;--p-surface-0: #fff;--p-surface-50: #fafafa;--p-surface-100: #f4f4f5;--p-surface-200: #e4e4e7;--p-surface-300: #d4d4d8;--p-surface-400: #a1a1aa;--p-surface-500: #71717a;--p-surface-600: #545250;--p-surface-700: #403e3c;--p-surface-800: #2b2927;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #1c1a19;--p-surface-950: #0f0e0d;--p-primary: rgb(0, 125, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-400);--p-primary-contrast-color: var(--p-surface-900);--p-primary-hover-color: var(--p-primary-300);--p-primary-active-color: var(--p-primary-200);--p-secondary-color: var(--p-secondary-400);--p-secondary-contrast-color: var(--p-surface-900);--p-secondary-hover-color: var(--p-secondary-300);--p-secondary-active-color: var(--p-secondary-200);--p-danger-color: var(--p-danger-400);--p-danger-contrast-color: var(--p-surface-900);--p-danger-hover-color: var(--p-danger-300);--p-danger-active-color: var(--p-danger-200);--p-success-color: var(--p-success-400);--p-success-contrast-color: var(--p-surface-900);--p-success-hover-color: var(--p-success-300);--p-success-active-color: var(--p-success-200);--p-warn-color: var(--p-warn-400);--p-warn-contrast-color: var(--p-surface-900);--p-warn-hover-color: var(--p-warn-300);--p-warn-active-color: var(--p-warn-200);--p-info-color: var(--p-info-400);--p-info-contrast-color: var(--p-surface-900);--p-info-hover-color: var(--p-info-300);--p-info-active-color: var(--p-info-200);--p-help-color: var(--p-help-400);--p-help-contrast-color: var(--p-surface-900);--p-help-hover-color: var(--p-help-300);--p-help-active-color: var(--p-help-200);--p-accent-color: var(--p-accent-400);--p-accent-contrast-color: var(--p-surface-900);--p-accent-hover-color: var(--p-accent-300);--p-accent-active-color: var(--p-accent-200);--p-content-border-color: var(--p-surface-700);--p-content-hover-background: var(--p-surface-800);--p-content-hover-color: var(--p-surface-0);--p-highlight-background: color-mix(in srgb, var(--p-primary-400), transparent 84%);--p-highlight-color: rgba(255, 255, 255, 87%);--p-highlight-focus-background: color-mix(in srgb, var(--p-primary-400), transparent 76%);--p-highlight-focus-color: rgba(255, 255, 255, 87%);--p-content-background: var(--p-surface-900);--p-text-color: var(--p-surface-0);--p-text-hover-color: var(--p-surface-0);--p-text-muted-color: var(--p-surface-400);--p-text-hover-muted-color: var(--p-surface-300)}:root.w-theme-light,.w-theme-light{color-scheme:light;--p-surface-0: #ffffff;--p-surface-50: #fafafa;--p-surface-100: #f5f5f5;--p-surface-200: #e5e5e5;--p-surface-300: #d4d4d4;--p-surface-400: #a3a3a3;--p-surface-500: #737373;--p-surface-600: #525252;--p-surface-700: #404040;--p-surface-800: #262626;--p-surface-850: color-mix(in srgb, var(--p-surface-800) 50%, var(--p-surface-900));--p-surface-900: #171717;--p-surface-950: #0a0a0a;--p-primary: rgb(0, 95, 178);--p-primary-50: color-mix(in srgb, var(--p-primary) 5%, white);--p-primary-100: color-mix(in srgb, var(--p-primary) 10%, white);--p-primary-200: color-mix(in srgb, var(--p-primary) 20%, white);--p-primary-300: color-mix(in srgb, var(--p-primary) 30%, white);--p-primary-400: color-mix(in srgb, var(--p-primary) 40%, white);--p-primary-500: var(--p-primary);--p-primary-600: color-mix(in srgb, var(--p-primary) 80%, black);--p-primary-700: color-mix(in srgb, var(--p-primary) 70%, black);--p-primary-800: color-mix(in srgb, var(--p-primary) 60%, black);--p-primary-900: color-mix(in srgb, var(--p-primary) 50%, black);--p-primary-950: color-mix(in srgb, var(--p-primary) 40%, black);--p-primary-color: var(--p-primary-500);--p-primary-contrast-color: var(--p-surface-0);--p-primary-hover-color: var(--p-primary-600);--p-primary-active-color: var(--p-primary-700);--p-secondary-color: var(--p-secondary-500);--p-secondary-contrast-color: var(--p-surface-0);--p-secondary-hover-color: var(--p-secondary-600);--p-secondary-active-color: var(--p-secondary-700);--p-danger-color: var(--p-danger-500);--p-danger-contrast-color: var(--p-surface-0);--p-danger-hover-color: var(--p-danger-600);--p-danger-active-color: var(--p-danger-700);--p-success-color: var(--p-success-500);--p-success-contrast-color: var(--p-surface-0);--p-success-hover-color: var(--p-success-600);--p-success-active-color: var(--p-success-700);--p-warn-color: var(--p-warn-500);--p-warn-contrast-color: var(--p-surface-0);--p-warn-hover-color: var(--p-warn-600);--p-warn-active-color: var(--p-warn-700);--p-info-color: var(--p-info-500);--p-info-contrast-color: var(--p-surface-0);--p-info-hover-color: var(--p-info-600);--p-info-active-color: var(--p-info-700);--p-help-color: var(--p-help-500);--p-help-contrast-color: var(--p-surface-0);--p-help-hover-color: var(--p-help-600);--p-help-active-color: var(--p-help-700);--p-accent-color: var(--p-accent-500);--p-accent-contrast-color: var(--p-surface-0);--p-accent-hover-color: var(--p-accent-600);--p-accent-active-color: var(--p-accent-700);--p-content-border-color: var(--p-surface-200);--p-content-hover-background: var(--p-surface-100);--p-content-hover-color: var(--p-surface-800);--p-highlight-background: var(--p-primary-50);--p-highlight-color: var(--p-primary-700);--p-highlight-focus-background: var(--p-primary-100);--p-highlight-focus-color: var(--p-primary-800);--p-content-background: var(--p-surface-0);--p-text-color: var(--p-surface-700);--p-text-hover-color: var(--p-surface-800);--p-text-muted-color: var(--p-surface-500);--p-text-hover-muted-color: var(--p-surface-600)}:host,:root{--kx-surface-1: color-mix(in srgb, var(--p-content-background) 96%, var(--p-text-color) 4%);--kx-surface-2: color-mix(in srgb, var(--p-content-background) 92%, var(--p-text-color) 8%);--kx-surface-3: color-mix(in srgb, var(--p-content-background) 86%, var(--p-text-color) 14%);--kx-surface-4: color-mix(in srgb, var(--p-content-background) 78%, var(--p-text-color) 22%);--kx-border-strong: color-mix(in srgb, var(--p-content-border-color) 60%, var(--p-text-color) 40%);--kx-border-stronger: color-mix(in srgb, var(--p-content-border-color) 30%, var(--p-text-color) 70%);--kx-text-faint: color-mix(in srgb, var(--p-text-muted-color) 70%, var(--p-content-background) 30%);--kx-text-fainter: color-mix(in srgb, var(--p-text-muted-color) 45%, var(--p-content-background) 55%);--kx-wash-primary: color-mix(in srgb, var(--p-primary-color) 12%, var(--p-content-background) 88%);--kx-wash-success: color-mix(in srgb, var(--p-success-500) 12%, var(--p-content-background) 88%);--kx-wash-info: color-mix(in srgb, var(--p-info-500) 12%, var(--p-content-background) 88%);--kx-wash-warn: color-mix(in srgb, var(--p-warn-500) 12%, var(--p-content-background) 88%);--kx-wash-danger: color-mix(in srgb, var(--p-danger-500) 12%, var(--p-content-background) 88%);--kx-wash-help: color-mix(in srgb, var(--p-help-500) 12%, var(--p-content-background) 88%);--kx-font-heading: "Outfit", system-ui, sans-serif;--kx-font-body: "Inter", system-ui, sans-serif;--kx-radius-4: 4px;--kx-radius-6: 6px;--kx-radius-8: 8px;--kx-radius-10: 10px;--kx-radius-14: 14px;--kx-radius-16: 16px;--kx-radius-tag: var(--p-content-border-radius, 6px);--kx-control-height: 34px;--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .08);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .12);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .18);--kx-overlay-hover: color-mix(in srgb, var(--p-text-color) 7%, transparent);--kx-overlay-subtle: color-mix(in srgb, var(--p-text-color) 4%, transparent)}@media(prefers-color-scheme:dark){:host(:not(.w-theme-light)),:root:not(.w-theme-light){--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}}:host(.w-theme-dark),:root.w-theme-dark{--kx-shadow-sm: 0 1px 2px rgba(0, 0, 0, .35);--kx-shadow-md: 0 4px 24px rgba(0, 0, 0, .45);--kx-shadow-lg: 0 16px 60px rgba(0, 0, 0, .6)}.kx-focus-halo:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-focus-outline:focus-visible{outline:var(--p-focus-ring-width) var(--p-focus-ring-style) var(--p-focus-ring-color);outline-offset:var(--p-focus-ring-offset);box-shadow:none}.kx-head{display:flex;align-items:center;gap:12px;padding:20px 24px 14px;flex-wrap:wrap}.kx-head-icon{width:40px;height:40px;border-radius:11px;flex:none;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 14%,transparent);color:var(--p-primary-color)}.kx-head-icon svg{width:22px;height:22px}.kx-head-text{min-width:0}.kx-title{font-size:17px;font-weight:700;color:var(--p-text-color);margin:0}.kx-head-sub{font-size:13px;color:var(--p-text-muted-color);margin:2px 0 0}.kx-head-actions{display:flex;align-items:center;gap:8px;flex-wrap:wrap;margin-left:auto}.kx-card{position:relative;display:flex;flex-direction:column;gap:9px;padding:13px;cursor:pointer;border:1px solid var(--p-content-border-color);border-radius:14px;background:var(--p-content-background);transition:border-color .15s,box-shadow .15s,transform .15s}.kx-card:hover{border-color:color-mix(in srgb,var(--p-primary-color) 40%,var(--p-content-border-color));box-shadow:0 6px 20px color-mix(in srgb,var(--p-text-color) 8%,transparent);transform:translateY(-1px)}.kx-card-head{display:flex;align-items:center;gap:10px;min-width:0}.kx-card-id{display:flex;flex-direction:column;gap:3px;min-width:0;flex:1}.kx-card-name{font-size:14px;font-weight:700;letter-spacing:-.01em;color:var(--p-text-color);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.kx-card-meta{display:flex;gap:6px}.kx-card-desc{font-size:12px;color:var(--p-text-muted-color);line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;min-height:17px}.kx-card-actions{position:absolute;top:9px;right:9px;display:flex;gap:3px;opacity:0;transition:opacity .12s;background:var(--p-content-background);border-radius:8px}.kx-card:hover .kx-card-actions,.kx-card:focus-within .kx-card-actions{opacity:1}.kx-card .p-button:not(:disabled):hover{transform:none}.kx-card:focus-visible{border-color:var(--p-focus-ring-color);outline:none;box-shadow:var(--p-focus-ring-shadow)}.kx-empty{text-align:center;padding:44px 24px;display:flex;flex-direction:column;align-items:center;gap:8px}.kx-empty-ico{width:56px;height:56px;border-radius:14px;display:flex;align-items:center;justify-content:center;background:color-mix(in srgb,var(--p-primary-color) 12%,transparent);color:var(--p-primary-color);margin-bottom:4px}.kx-empty-ico svg{width:28px;height:28px}.kx-empty-title{font-size:15px;font-weight:700;color:var(--p-text-color);margin:0}.kx-empty-sub{font-size:13px;color:var(--p-text-muted-color);max-width:380px;margin:0}.kx-empty>.p-button{margin-top:6px}.kx-empty-actions{display:flex;gap:8px;margin-top:6px}.kx-loading{display:flex;align-items:center;gap:8px;color:var(--p-text-muted-color);font-size:13px;padding:24px}.kx-err{margin:0 20px 8px;padding:9px 12px;border-radius:10px;font-size:13px;background:color-mix(in srgb,var(--p-danger-500) 12%,transparent);color:var(--p-danger-600, var(--p-danger-500))}.kx-err.inline{margin:12px 0 0}.kx-tag-sm,.kx-tag-sm.kx-tag-sm{display:inline-flex;align-items:center;gap:4px;padding:1px 7px;border-radius:var(--kx-radius-tag, 6px);font-size:10.5px;font-weight:600;line-height:1.5;white-space:nowrap}.kx-tag-sm svg,.kx-tag-sm.kx-tag-sm svg{width:12px;height:12px}.kx-tag-caps,.kx-tag-caps.kx-tag-caps{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:var(--kx-radius-tag, 6px);font-size:9px;font-weight:700;line-height:1.5;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap}.kx-tag-caps svg,.kx-tag-caps.kx-tag-caps svg{width:11px;height:11px}.spin{animation:kx-spin 1s linear infinite}@keyframes kx-spin{to{transform:rotate(360deg)}}@media(prefers-reduced-motion:reduce){.spin{animation:none}}.ac-mono{font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px}.ac-muted{color:var(--p-text-muted-color);font-size:12px;overflow-wrap:anywhere}.ac-options{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-8);padding:8px 12px}.ac-options summary{cursor:pointer;font-size:13px}.ac-options-filter{width:100%;margin:8px 0}.ac-option{display:grid;gap:4px;padding:6px 0;border-top:1px solid var(--p-content-border-color)}.ac-option-head{display:flex;flex-wrap:wrap;gap:8px;align-items:baseline}input:not([type=checkbox]),select,textarea{font:inherit;color:var(--p-text-color);background-color:var(--p-content-background);border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:8px 10px;width:100%;min-width:0}select{appearance:none;padding-right:32px;cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,var(--p-text-muted-color) 50%),linear-gradient(135deg,var(--p-text-muted-color) 50%,transparent 50%);background-repeat:no-repeat;background-size:5px 5px,5px 5px;background-position:calc(100% - 15px) center,calc(100% - 10px) center}textarea{resize:vertical;line-height:1.6}input[type=checkbox]:not([role=switch]){accent-color:var(--p-primary-color);width:auto}.ac-tabs,.ac-seg{display:inline-flex;gap:4px;padding:3px;border-radius:var(--kx-radius-8);background:var(--kx-overlay-subtle)}.ac-tab,.ac-seg button{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:6px 12px;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-seg button{flex:1}.ac-tab:hover,.ac-seg button:hover{color:var(--p-text-color)}.ac-tab.active,.ac-seg button.active{background:var(--p-content-background);color:var(--p-primary-color);font-weight:600;box-shadow:var(--kx-shadow-sm)}.ac-chips{display:flex;gap:6px;flex-wrap:wrap;align-items:center}.ac-chip,.ac-hint-chip{display:inline-flex;align-items:center;gap:6px;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-6);padding:6px 9px;font:inherit;color:var(--p-text-muted-color);background:var(--p-content-background)}.ac-chip{cursor:pointer}.ac-chip.active{color:var(--p-primary-color);border-color:var(--p-primary-color);background:var(--kx-wash-primary)}.ac-chip:hover{border-color:var(--p-primary-color)}.ac-hint-chip{font-size:11px;background:var(--kx-overlay-subtle);overflow-wrap:anywhere}.ac-icon-btn{display:inline-flex;align-items:center;justify-content:center;width:30px;height:30px;cursor:pointer;border-radius:var(--kx-radius-6);border:none;background:transparent;color:var(--p-text-muted-color)}.ac-icon-btn:hover{color:var(--p-text-color);background:var(--kx-overlay-hover)}.ac-icon-btn:disabled{opacity:.5;cursor:default}.ac-advanced{border-top:1px solid var(--p-content-border-color);padding-top:12px}.ac-advanced>summary{color:var(--p-text-muted-color);cursor:pointer;font-size:12px;padding:4px 0}.ac-advanced[open]>summary{margin-bottom:12px}:host{display:block;height:100%;min-height:0}:host>div{height:100%;min-height:0}*,*:before,*:after{box-sizing:border-box}.ac{font-family:inherit;font-size:13px;color:var(--p-text-color);background:var(--p-content-background);height:100%;display:flex;flex-direction:column;overflow:auto;scrollbar-gutter:stable}.ac-bar{flex:none;display:flex;padding:0 24px 20px}.ac-body{padding:0 24px 24px;flex:1 0 auto}.ac-card{border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14);padding:16px;display:flex;flex-direction:column;gap:12px;min-width:0}.ac-card-head{display:flex;align-items:flex-start;justify-content:space-between;gap:8px}.ac-card-title{font-size:14px;font-weight:700;margin:0;display:flex;align-items:center;gap:8px}.ac-field{display:flex;flex-direction:column;gap:4px;min-width:0}.ac-field>span{font-size:12px;font-weight:600;color:var(--p-text-muted-color)}.ac-row-fields{display:grid;grid-template-columns:repeat(auto-fit,minmax(90px,1fr));gap:8px}.ac-hint{color:var(--p-text-muted-color);font-size:12px;line-height:1.4}.ac-hint code,.ac-muted code{font-size:11px}.ac-check{display:flex;align-items:center;gap:8px;font-size:13px}.ac-check input{width:auto;flex:none}.ac-checks{display:flex;flex-wrap:wrap;gap:4px 16px}.ac-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;font:inherit;cursor:pointer;padding:7px 14px;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color);background:transparent;color:var(--p-text-color);white-space:nowrap}.ac-btn:hover{border-color:var(--p-primary-color)}.ac-btn.primary{background:var(--p-primary-color);border-color:var(--p-primary-color);color:var(--p-primary-contrast-color);font-weight:600}.ac-btn.danger{color:var(--p-danger-color);border-color:color-mix(in srgb,var(--p-danger-color) 50%,transparent)}.ac-btn:disabled{opacity:.5;cursor:default}.ac-link{font:inherit;cursor:pointer;color:var(--p-primary-color);background:transparent;border:none;padding:0}.ac-link:hover{text-decoration:underline}.ac-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:6px}.ac-row{display:flex;align-items:flex-start;justify-content:space-between;gap:8px;padding:10px 12px;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color)}.ac-row-title{font-weight:600;display:flex;align-items:center;gap:6px;min-width:0}.ac-row-actions{display:flex;gap:2px;flex:none}.ac-tone{background:var(--kx-overlay-hover);color:var(--p-text-muted-color)}.ac-tone.ready,.ac-tone.succeeded{background:var(--kx-wash-success);color:var(--p-success-color)}.ac-tone.running,.ac-tone.preparing,.ac-tone.queued{background:var(--kx-wash-primary);color:var(--p-primary-color)}.ac-tone.cooling{background:var(--kx-wash-warn);color:var(--p-warn-color)}.ac-tone.failed{background:var(--kx-wash-danger);color:var(--p-danger-color)}.ac-pre{margin:0;padding:10px 12px;border-radius:var(--kx-radius-8);white-space:pre-wrap;overflow-wrap:anywhere;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;font-size:12px;max-width:100%;background:var(--kx-overlay-subtle)}.ac-prompt{max-height:none;overflow:hidden;font-family:inherit;line-height:1.6}.ac-prompt>span{display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:4;overflow:hidden}.ac-prompt.expanded>span{display:block;-webkit-line-clamp:unset}.ac-stream{display:flex;flex-direction:column;gap:10px;min-width:0;padding:12px;overscroll-behavior:contain;overflow-anchor:none;border-radius:var(--kx-radius-8);border:1px solid var(--p-content-border-color)}.ac-detail .ac-stream .ac-event{display:grid;flex:none;min-width:0;grid-template-columns:84px minmax(0,1fr);gap:8px;align-items:start}.ac-event-kind{font-size:11px;font-weight:600;text-transform:uppercase;letter-spacing:.03em;color:var(--p-text-muted-color);line-height:1.6;align-self:start;padding-top:0;overflow-wrap:anywhere}.ac-event-text{margin:0;white-space:pre-wrap;overflow-wrap:anywhere;font-size:12px;line-height:1.45;font-family:ui-monospace,SFMono-Regular,Menlo,monospace;min-width:0}.ac-event.assistant .ac-event-kind,.ac-event.tool .ac-event-text{color:var(--p-primary-color)}.ac-event.tool_result .ac-event-text,.ac-event.log .ac-event-text,.ac-event.reasoning .ac-event-text{color:var(--p-text-muted-color)}.ac-event.tool_error .ac-event-kind,.ac-event.error .ac-event-kind,.ac-event.error .ac-event-text{color:var(--p-danger-color)}.ac-result{display:flex;flex-direction:column;gap:6px}.ac-pulse{animation:ac-pulse 1.4s ease-in-out infinite;padding:4px 0 0 92px}@keyframes ac-pulse{50%{opacity:.4}}.ac-stack{display:flex;flex-direction:column;gap:16px;min-width:0}.ac-small{font-size:12px}.ac-account.off .ac-account-main{opacity:.6}.ac-account-main{display:flex;flex-direction:column;gap:7px;min-width:0}.ac-row-name{min-width:0;overflow-wrap:anywhere}.ac-rename{padding:3px 7px;font-weight:600}.ac-strong{display:inline-flex;align-items:center;gap:4px;color:var(--p-text-color)}.ac-narrow{max-width:760px}.kx-head{flex:none}.kx-head-sub{max-width:440px}.kx-count{color:var(--p-text-muted-color);font-size:12px;white-space:nowrap}.kx-search{position:relative;display:flex;align-items:center}.kx-search>svg{pointer-events:none;position:absolute;left:10px;color:var(--p-text-muted-color)}.kx-search .kx-search-input{padding-left:30px;padding-right:30px;width:205px}fieldset.ac-form{border:0;margin:0;padding:0;min-width:0}.ac-form{display:flex;flex-direction:column;gap:16px}.ac-dialog{width:min(620px,calc(100vw - 40px));max-height:calc(100dvh - 48px);padding:0;border:1px solid var(--p-content-border-color);border-radius:var(--p-border-radius-lg);background:var(--p-content-background);font-family:var(--kx-font-body);font-size:13px;color:var(--p-text-color)}.ac-dialog[open]{display:flex;flex-direction:column;overflow:hidden}.ac-dialog::backdrop{background:var(--p-mask-background)}.ac-dialog-wide{width:min(880px,calc(100vw - 40px))}.ac-dialog-header,.ac-dialog-footer{flex:none;padding:20px}.ac-dialog-header{display:flex;align-items:center;justify-content:space-between;gap:16px}.ac-dialog-header h2{margin:0;font-size:17px}.ac-dialog-content{padding:0 20px 20px;min-height:0;overflow:auto;overscroll-behavior:contain}.ac-dialog-foot{display:flex;align-items:center;justify-content:flex-end;gap:8px;padding-top:16px;border-top:1px solid var(--p-content-border-color)}.ac-picker-row{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.ac-composer textarea{min-height:200px}.ac-run-list{list-style:none;padding:0;margin:0;border:1px solid var(--p-content-border-color);border-radius:var(--kx-radius-14)}.ac-run:first-child{border-radius:var(--kx-radius-14) var(--kx-radius-14) 0 0}.ac-run:last-child{border-radius:0 0 var(--kx-radius-14) var(--kx-radius-14)}.ac-run:only-child{border-radius:var(--kx-radius-14)}.ac-run+.ac-run{border-top:1px solid var(--p-content-border-color)}.ac-run-main{display:flex;align-items:center;gap:12px;width:100%;border:0;border-radius:inherit;padding:8px 16px;min-height:56px;font:inherit;color:inherit;background:transparent;text-align:left;cursor:pointer}.ac-run-main:hover{background:var(--kx-overlay-subtle)}.ac-run-copy{min-width:0;flex:1;display:flex;flex-direction:column;gap:3px}.ac-run-title-row{display:flex;align-items:baseline;gap:8px;min-width:0;line-height:18px}.ac-run-title-row .kx-tag-sm{flex:none}.ac-run-title{font-weight:600;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}.ac-run-meta{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;color:var(--p-text-muted-color);font-size:12px;line-height:18px}.ac-run-meta>span{display:inline-flex;align-items:center;gap:5px}.ac-run-meta>span+span:before{content:"·";margin-right:3px}.ac-run-main .ac-run-meta{flex-wrap:nowrap;overflow:hidden;white-space:nowrap}.ac-run-main .ac-run-meta>span{flex:none}.ac-run-chevron{flex:none;align-self:center}.ac-account-grid{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(min(440px,100%),1fr));gap:12px}.ac-account{border-radius:var(--kx-radius-14);padding:16px;flex-wrap:wrap;gap:12px}.ac-account-main{flex:1}.ac-hover-actions .ac-row-actions{opacity:0;transition:opacity .15s}.ac-hover-actions:hover .ac-row-actions,.ac-hover-actions:focus-within .ac-row-actions{opacity:1}@media(hover:none){.ac-hover-actions .ac-row-actions{opacity:1}}.ac-resource-list{gap:12px}.ac-resource{align-items:center;gap:16px;padding:18px;border-radius:var(--kx-radius-14)}.ac-resource-icon{display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;flex:none;border-radius:var(--kx-radius-10);background:var(--kx-overlay-subtle);color:var(--p-text-muted-color);font-size:20px}p.ac-hint{margin:0}.ac-detail-page{padding-top:24px}.ac-detail-back{margin-bottom:20px}.ac-detail{min-width:0;gap:20px}.ac-detail-head{display:flex;flex-direction:column;gap:8px}.ac-detail-title{margin:0;font-size:17px;line-height:1.4;font-weight:600;overflow-wrap:anywhere}.ac-detail-meta{row-gap:4px}.ac-detail-section{min-width:0;display:flex;flex-direction:column;gap:8px}.ac-section-head{display:flex;align-items:center;justify-content:space-between;gap:12px;min-height:24px}.ac-section-head h3{margin:0;font-size:13px;font-weight:600}.ac-section-head .ac-row-actions{align-items:center;gap:12px}.ac-detail .ac-stream{background:var(--kx-overlay-subtle)}.ac-result-text{max-height:220px;overflow:hidden;line-height:1.6;overscroll-behavior:contain}.ac-result-text.expanded{max-height:none}.ac-build-log{min-height:160px}@media(max-width:700px){.ac-picker-row{grid-template-columns:1fr}.ac-run-main{padding:8px 12px}.ac-detail .ac-stream .ac-event{grid-template-columns:64px minmax(0,1fr)}.ac-resource{flex-wrap:wrap}.ac-hover-actions .ac-row-actions{opacity:1}}.kx-search-clear{position:absolute;right:8px;display:inline-flex;border:0;padding:2px;background:transparent;color:var(--p-text-muted-color);cursor:pointer}.ac-load-more{display:flex;justify-content:center;padding-top:16px}@media(prefers-reduced-motion:reduce){.ac-pulse,.spin{animation:none}.ac-hover-actions .ac-row-actions{transition:none}}';
export {
  T as B,
  La as P,
  Ma as _,
  Na as a,
  Ia as b,
  vn as c,
  lt as d,
  P as e,
  $e as f,
  za as s,
  Ea as u
};
