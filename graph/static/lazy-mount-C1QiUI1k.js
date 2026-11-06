import { defineComponent as xe, createPropsRestProxy as Zd, toRef as Te, ref as fe, computed as ne, onMounted as ot, openBlock as A, createElementBlock as G, normalizeClass as Me, unref as oe, renderSlot as Be, getCurrentScope as fu, inject as xt, effectScope as hu, watch as Ee, provide as St, getCurrentInstance as wn, useSlots as pu, onUnmounted as jd, createVNode as ze, withCtx as ct, reactive as Jd, onScopeDispose as Mo, nextTick as We, onBeforeMount as Qd, shallowRef as bt, createElementVNode as I, Fragment as ye, renderList as Se, normalizeStyle as Oe, onBeforeUnmount as to, isMemoSame as ef, createBlock as Ie, createCommentVNode as de, toDisplayString as he, toValue as Ne, isRef as wa, toRefs as tf, customRef as nf, resolveComponent as gu, h as De, useAttrs as _a, mergeProps as Ho, resolveDynamicComponent as Lt, createTextVNode as Pt, markRaw as qt, readonly as of, watchEffect as rf, normalizeProps as af, withDirectives as sn, withModifiers as Ue, vModelText as ln, withKeys as Ze, createStaticVNode as sf } from "vue";
import { Icon as nn } from "@iconify/vue";
import { a as lf } from "./wc-runtime-CNDpK4lj.js";
import { api as To, loadByTagName as uf, on as cf } from "@wippy-fe/proxy";
function Hn(e) {
  return fu() ? (Mo(e), !0) : !1;
}
function _t(e) {
  return typeof e == "function" ? e() : oe(e);
}
const df = typeof window < "u" && typeof document < "u", ff = (e) => typeof e < "u", hf = Object.prototype.toString, pf = (e) => hf.call(e) === "[object Object]", gf = () => {
};
function vf(e, t) {
  function n(...o) {
    return new Promise((i, a) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(a);
    });
  }
  return n;
}
const vu = (e) => e();
function mf(e = vu) {
  const t = fe(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const i = (...a) => {
    t.value && e(...a);
  };
  return { isActive: of(t), pause: n, resume: o, eventFilter: i };
}
function os(e, t = !1, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e);
  });
}
function yf(e, t, n = {}) {
  const {
    eventFilter: o = vu,
    ...i
  } = n;
  return Ee(
    e,
    vf(
      o,
      t
    ),
    i
  );
}
function on(e, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: a, pause: r, resume: s, isActive: u } = mf(o);
  return { stop: yf(
    e,
    t,
    {
      ...i,
      eventFilter: a
    }
  ), pause: r, resume: s, isActive: u };
}
function wf(e, t = {}) {
  if (!wa(e))
    return tf(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = nf(() => ({
      get() {
        return e.value[o];
      },
      set(i) {
        var a;
        if ((a = _t(t.replaceRef)) != null ? a : !0)
          if (Array.isArray(e.value)) {
            const s = [...e.value];
            s[o] = i, e.value = s;
          } else {
            const s = { ...e.value, [o]: i };
            Object.setPrototypeOf(s, Object.getPrototypeOf(e.value)), e.value = s;
          }
        else
          e.value[o] = i;
      }
    }));
  return n;
}
function Gr(e, t = !1) {
  function n(d, { flush: f = "sync", deep: h = !1, timeout: w, throwOnTimeout: _ } = {}) {
    let m = null;
    const v = [new Promise((g) => {
      m = Ee(
        e,
        (b) => {
          d(b) !== t && (m?.(), g(b));
        },
        {
          flush: f,
          deep: h,
          immediate: !0
        }
      );
    })];
    return w != null && v.push(
      os(w, _).then(() => _t(e)).finally(() => m?.())
    ), Promise.race(v);
  }
  function o(d, f) {
    if (!wa(d))
      return n((b) => b === d, f);
    const { flush: h = "sync", deep: w = !1, timeout: _, throwOnTimeout: m } = f ?? {};
    let p = null;
    const g = [new Promise((b) => {
      p = Ee(
        [e, d],
        ([O, F]) => {
          t !== (O === F) && (p?.(), b(O));
        },
        {
          flush: h,
          deep: w,
          immediate: !0
        }
      );
    })];
    return _ != null && g.push(
      os(_, m).then(() => _t(e)).finally(() => (p?.(), _t(e)))
    ), Promise.race(g);
  }
  function i(d) {
    return n((f) => !!f, d);
  }
  function a(d) {
    return o(null, d);
  }
  function r(d) {
    return o(void 0, d);
  }
  function s(d) {
    return n(Number.isNaN, d);
  }
  function u(d, f) {
    return n((h) => {
      const w = Array.from(h);
      return w.includes(d) || w.includes(_t(d));
    }, f);
  }
  function c(d) {
    return l(1, d);
  }
  function l(d = 1, f) {
    let h = -1;
    return n(() => (h += 1, h >= d), f);
  }
  return Array.isArray(_t(e)) ? {
    toMatch: n,
    toContains: u,
    changed: c,
    changedTimes: l,
    get not() {
      return Gr(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: a,
    toBeNaN: s,
    toBeUndefined: r,
    changed: c,
    changedTimes: l,
    get not() {
      return Gr(e, !t);
    }
  };
}
function Yr(e) {
  return Gr(e);
}
function _f(e) {
  var t;
  const n = _t(e);
  return (t = n?.$el) != null ? t : n;
}
const mu = df ? window : void 0;
function yu(...e) {
  let t, n, o, i;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, i] = e, t = mu) : [t, n, o, i] = e, !t)
    return gf;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const a = [], r = () => {
    a.forEach((l) => l()), a.length = 0;
  }, s = (l, d, f, h) => (l.addEventListener(d, f, h), () => l.removeEventListener(d, f, h)), u = Ee(
    () => [_f(t), _t(i)],
    ([l, d]) => {
      if (r(), !l)
        return;
      const f = pf(d) ? { ...d } : d;
      a.push(
        ...n.flatMap((h) => o.map((w) => s(l, h, w, f)))
      );
    },
    { immediate: !0, flush: "post" }
  ), c = () => {
    u(), r();
  };
  return Hn(c), c;
}
function bf(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function is(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: i = mu,
    eventName: a = "keydown",
    passive: r = !1,
    dedupe: s = !1
  } = o, u = bf(t);
  return yu(i, a, (l) => {
    l.repeat && _t(s) || u(l) && n(l);
  }, r);
}
function kf(e) {
  return JSON.parse(JSON.stringify(e));
}
function Oi(e, t, n, o = {}) {
  var i, a, r;
  const {
    clone: s = !1,
    passive: u = !1,
    eventName: c,
    deep: l = !1,
    defaultValue: d,
    shouldEmit: f
  } = o, h = wn(), w = n || h?.emit || ((i = h?.$emit) == null ? void 0 : i.bind(h)) || ((r = (a = h?.proxy) == null ? void 0 : a.$emit) == null ? void 0 : r.bind(h?.proxy));
  let _ = c;
  t || (t = "modelValue"), _ = _ || `update:${t.toString()}`;
  const m = (g) => s ? typeof s == "function" ? s(g) : kf(g) : g, p = () => ff(e[t]) ? m(e[t]) : d, v = (g) => {
    f ? f(g) && w(_, g) : w(_, g);
  };
  if (u) {
    const g = p(), b = fe(g);
    let O = !1;
    return Ee(
      () => e[t],
      (F) => {
        O || (O = !0, b.value = m(F), We(() => O = !1));
      }
    ), Ee(
      b,
      (F) => {
        !O && (F !== e[t] || l) && v(F);
      },
      { deep: l }
    ), b;
  } else
    return ne({
      get() {
        return p();
      },
      set(g) {
        v(g);
      }
    });
}
var Ef = { value: () => {
} };
function si() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Io(n);
}
function Io(e) {
  this._ = e;
}
function $f(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Io.prototype = si.prototype = {
  constructor: Io,
  on: function(e, t) {
    var n = this._, o = $f(e + "", n), i, a = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++a < r; )
        if ((i = (e = o[a]).type) && (i = xf(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++a < r; )
      if (i = (e = o[a]).type)
        n[i] = rs(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = rs(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Io(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, a; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (a = this._[e], o = 0, i = a.length; o < i; ++o)
      a[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, a = o.length; i < a; ++i)
      o[i].value.apply(t, n);
  }
};
function xf(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function rs(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = Ef, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var Ur = "http://www.w3.org/1999/xhtml";
const as = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: Ur,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function li(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), as.hasOwnProperty(t) ? { space: as[t], local: e } : e;
}
function Sf(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === Ur && t.documentElement.namespaceURI === Ur ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Nf(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function wu(e) {
  var t = li(e);
  return (t.local ? Nf : Sf)(t);
}
function Cf() {
}
function ba(e) {
  return e == null ? Cf : function() {
    return this.querySelector(e);
  };
}
function Mf(e) {
  typeof e != "function" && (e = ba(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = new Array(r), u, c, l = 0; l < r; ++l)
      (u = a[l]) && (c = e.call(u, u.__data__, l, a)) && ("__data__" in u && (c.__data__ = u.__data__), s[l] = c);
  return new je(o, this._parents);
}
function Tf(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function If() {
  return [];
}
function _u(e) {
  return e == null ? If : function() {
    return this.querySelectorAll(e);
  };
}
function Df(e) {
  return function() {
    return Tf(e.apply(this, arguments));
  };
}
function Af(e) {
  typeof e == "function" ? e = Df(e) : e = _u(e);
  for (var t = this._groups, n = t.length, o = [], i = [], a = 0; a < n; ++a)
    for (var r = t[a], s = r.length, u, c = 0; c < s; ++c)
      (u = r[c]) && (o.push(e.call(u, u.__data__, c, r)), i.push(u));
  return new je(o, i);
}
function bu(e) {
  return function() {
    return this.matches(e);
  };
}
function ku(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Of = Array.prototype.find;
function Pf(e) {
  return function() {
    return Of.call(this.children, e);
  };
}
function Rf() {
  return this.firstElementChild;
}
function zf(e) {
  return this.select(e == null ? Rf : Pf(typeof e == "function" ? e : ku(e)));
}
var Bf = Array.prototype.filter;
function Lf() {
  return Array.from(this.children);
}
function Vf(e) {
  return function() {
    return Bf.call(this.children, e);
  };
}
function Hf(e) {
  return this.selectAll(e == null ? Lf : Vf(typeof e == "function" ? e : ku(e)));
}
function Ff(e) {
  typeof e != "function" && (e = bu(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = [], u, c = 0; c < r; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new je(o, this._parents);
}
function Eu(e) {
  return new Array(e.length);
}
function Gf() {
  return new je(this._enter || this._groups.map(Eu), this._parents);
}
function Fo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Fo.prototype = {
  constructor: Fo,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function Yf(e) {
  return function() {
    return e;
  };
}
function Uf(e, t, n, o, i, a) {
  for (var r = 0, s, u = t.length, c = a.length; r < c; ++r)
    (s = t[r]) ? (s.__data__ = a[r], o[r] = s) : n[r] = new Fo(e, a[r]);
  for (; r < u; ++r)
    (s = t[r]) && (i[r] = s);
}
function qf(e, t, n, o, i, a, r) {
  var s, u, c = /* @__PURE__ */ new Map(), l = t.length, d = a.length, f = new Array(l), h;
  for (s = 0; s < l; ++s)
    (u = t[s]) && (f[s] = h = r.call(u, u.__data__, s, t) + "", c.has(h) ? i[s] = u : c.set(h, u));
  for (s = 0; s < d; ++s)
    h = r.call(e, a[s], s, a) + "", (u = c.get(h)) ? (o[s] = u, u.__data__ = a[s], c.delete(h)) : n[s] = new Fo(e, a[s]);
  for (s = 0; s < l; ++s)
    (u = t[s]) && c.get(f[s]) === u && (i[s] = u);
}
function Xf(e) {
  return e.__data__;
}
function Wf(e, t) {
  if (!arguments.length)
    return Array.from(this, Xf);
  var n = t ? qf : Uf, o = this._parents, i = this._groups;
  typeof e != "function" && (e = Yf(e));
  for (var a = i.length, r = new Array(a), s = new Array(a), u = new Array(a), c = 0; c < a; ++c) {
    var l = o[c], d = i[c], f = d.length, h = Kf(e.call(l, l && l.__data__, c, o)), w = h.length, _ = s[c] = new Array(w), m = r[c] = new Array(w), p = u[c] = new Array(f);
    n(l, d, _, m, p, h, t);
    for (var v = 0, g = 0, b, O; v < w; ++v)
      if (b = _[v]) {
        for (v >= g && (g = v + 1); !(O = m[g]) && ++g < w; )
          ;
        b._next = O || null;
      }
  }
  return r = new je(r, o), r._enter = s, r._exit = u, r;
}
function Kf(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Zf() {
  return new je(this._exit || this._groups.map(Eu), this._parents);
}
function jf(e, t, n) {
  var o = this.enter(), i = this, a = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? a.remove() : n(a), o && i ? o.merge(i).order() : i;
}
function Jf(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, a = o.length, r = Math.min(i, a), s = new Array(i), u = 0; u < r; ++u)
    for (var c = n[u], l = o[u], d = c.length, f = s[u] = new Array(d), h, w = 0; w < d; ++w)
      (h = c[w] || l[w]) && (f[w] = h);
  for (; u < i; ++u)
    s[u] = n[u];
  return new je(s, this._parents);
}
function Qf() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, a = o[i], r; --i >= 0; )
      (r = o[i]) && (a && r.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(r, a), a = r);
  return this;
}
function eh(e) {
  e || (e = th);
  function t(d, f) {
    return d && f ? e(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), a = 0; a < o; ++a) {
    for (var r = n[a], s = r.length, u = i[a] = new Array(s), c, l = 0; l < s; ++l)
      (c = r[l]) && (u[l] = c);
    u.sort(t);
  }
  return new je(i, this._parents).order();
}
function th(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function nh() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function oh() {
  return Array.from(this);
}
function ih() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, a = o.length; i < a; ++i) {
      var r = o[i];
      if (r)
        return r;
    }
  return null;
}
function rh() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function ah() {
  return !this.node();
}
function sh(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], a = 0, r = i.length, s; a < r; ++a)
      (s = i[a]) && e.call(s, s.__data__, a, i);
  return this;
}
function lh(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function uh(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ch(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function dh(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function fh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function hh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function ph(e, t) {
  var n = li(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? uh : lh : typeof t == "function" ? n.local ? hh : fh : n.local ? dh : ch)(n, t));
}
function $u(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function gh(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function vh(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function mh(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function yh(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? gh : typeof t == "function" ? mh : vh)(e, t, n ?? "")) : hn(this.node(), e);
}
function hn(e, t) {
  return e.style.getPropertyValue(t) || $u(e).getComputedStyle(e, null).getPropertyValue(t);
}
function wh(e) {
  return function() {
    delete this[e];
  };
}
function _h(e, t) {
  return function() {
    this[e] = t;
  };
}
function bh(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function kh(e, t) {
  return arguments.length > 1 ? this.each((t == null ? wh : typeof t == "function" ? bh : _h)(e, t)) : this.node()[e];
}
function xu(e) {
  return e.trim().split(/^|\s+/);
}
function ka(e) {
  return e.classList || new Su(e);
}
function Su(e) {
  this._node = e, this._names = xu(e.getAttribute("class") || "");
}
Su.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Nu(e, t) {
  for (var n = ka(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function Cu(e, t) {
  for (var n = ka(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function Eh(e) {
  return function() {
    Nu(this, e);
  };
}
function $h(e) {
  return function() {
    Cu(this, e);
  };
}
function xh(e, t) {
  return function() {
    (t.apply(this, arguments) ? Nu : Cu)(this, e);
  };
}
function Sh(e, t) {
  var n = xu(e + "");
  if (arguments.length < 2) {
    for (var o = ka(this.node()), i = -1, a = n.length; ++i < a; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? xh : t ? Eh : $h)(n, t));
}
function Nh() {
  this.textContent = "";
}
function Ch(e) {
  return function() {
    this.textContent = e;
  };
}
function Mh(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Th(e) {
  return arguments.length ? this.each(e == null ? Nh : (typeof e == "function" ? Mh : Ch)(e)) : this.node().textContent;
}
function Ih() {
  this.innerHTML = "";
}
function Dh(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Ah(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Oh(e) {
  return arguments.length ? this.each(e == null ? Ih : (typeof e == "function" ? Ah : Dh)(e)) : this.node().innerHTML;
}
function Ph() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Rh() {
  return this.each(Ph);
}
function zh() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function Bh() {
  return this.each(zh);
}
function Lh(e) {
  var t = typeof e == "function" ? e : wu(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Vh() {
  return null;
}
function Hh(e, t) {
  var n = typeof e == "function" ? e : wu(e), o = t == null ? Vh : typeof t == "function" ? t : ba(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Fh() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Gh() {
  return this.each(Fh);
}
function Yh() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Uh() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function qh(e) {
  return this.select(e ? Uh : Yh);
}
function Xh(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Wh(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Kh(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Zh(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, a; n < i; ++n)
        a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++o] = a;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function jh(e, t, n) {
  return function() {
    var o = this.__on, i, a = Wh(t);
    if (o) {
      for (var r = 0, s = o.length; r < s; ++r)
        if ((i = o[r]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, a, n), i = { type: e.type, name: e.name, value: t, listener: a, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Jh(e, t, n) {
  var o = Kh(e + ""), i, a = o.length, r;
  if (arguments.length < 2) {
    var s = this.node().__on;
    if (s) {
      for (var u = 0, c = s.length, l; u < c; ++u)
        for (i = 0, l = s[u]; i < a; ++i)
          if ((r = o[i]).type === l.type && r.name === l.name)
            return l.value;
    }
    return;
  }
  for (s = t ? jh : Zh, i = 0; i < a; ++i)
    this.each(s(o[i], t, n));
  return this;
}
function Mu(e, t, n) {
  var o = $u(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Qh(e, t) {
  return function() {
    return Mu(this, e, t);
  };
}
function ep(e, t) {
  return function() {
    return Mu(this, e, t.apply(this, arguments));
  };
}
function tp(e, t) {
  return this.each((typeof t == "function" ? ep : Qh)(e, t));
}
function* np() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, a = o.length, r; i < a; ++i)
      (r = o[i]) && (yield r);
}
var Tu = [null];
function je(e, t) {
  this._groups = e, this._parents = t;
}
function no() {
  return new je([[document.documentElement]], Tu);
}
function op() {
  return this;
}
je.prototype = no.prototype = {
  constructor: je,
  select: Mf,
  selectAll: Af,
  selectChild: zf,
  selectChildren: Hf,
  filter: Ff,
  data: Wf,
  enter: Gf,
  exit: Zf,
  join: jf,
  merge: Jf,
  selection: op,
  order: Qf,
  sort: eh,
  call: nh,
  nodes: oh,
  node: ih,
  size: rh,
  empty: ah,
  each: sh,
  attr: ph,
  style: yh,
  property: kh,
  classed: Sh,
  text: Th,
  html: Oh,
  raise: Rh,
  lower: Bh,
  append: Lh,
  insert: Hh,
  remove: Gh,
  clone: qh,
  datum: Xh,
  on: Jh,
  dispatch: tp,
  [Symbol.iterator]: np
};
function Qe(e) {
  return typeof e == "string" ? new je([[document.querySelector(e)]], [document.documentElement]) : new je([[e]], Tu);
}
function ip(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function lt(e, t) {
  if (e = ip(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const rp = { passive: !1 }, Fn = { capture: !0, passive: !1 };
function Pi(e) {
  e.stopImmediatePropagation();
}
function un(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Iu(e) {
  var t = e.document.documentElement, n = Qe(e).on("dragstart.drag", un, Fn);
  "onselectstart" in t ? n.on("selectstart.drag", un, Fn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Du(e, t) {
  var n = e.document.documentElement, o = Qe(e).on("dragstart.drag", null);
  t && (o.on("click.drag", un, Fn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const ho = (e) => () => e;
function qr(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: a,
  x: r,
  y: s,
  dx: u,
  dy: c,
  dispatch: l
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: a, enumerable: !0, configurable: !0 },
    x: { value: r, enumerable: !0, configurable: !0 },
    y: { value: s, enumerable: !0, configurable: !0 },
    dx: { value: u, enumerable: !0, configurable: !0 },
    dy: { value: c, enumerable: !0, configurable: !0 },
    _: { value: l }
  });
}
qr.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function ap(e) {
  return !e.ctrlKey && !e.button;
}
function sp() {
  return this.parentNode;
}
function lp(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function up() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function cp() {
  var e = ap, t = sp, n = lp, o = up, i = {}, a = si("start", "drag", "end"), r = 0, s, u, c, l, d = 0;
  function f(b) {
    b.on("mousedown.drag", h).filter(o).on("touchstart.drag", m).on("touchmove.drag", p, rp).on("touchend.drag touchcancel.drag", v).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function h(b, O) {
    if (!(l || !e.call(this, b, O))) {
      var F = g(this, t.call(this, b, O), b, O, "mouse");
      F && (Qe(b.view).on("mousemove.drag", w, Fn).on("mouseup.drag", _, Fn), Iu(b.view), Pi(b), c = !1, s = b.clientX, u = b.clientY, F("start", b));
    }
  }
  function w(b) {
    if (un(b), !c) {
      var O = b.clientX - s, F = b.clientY - u;
      c = O * O + F * F > d;
    }
    i.mouse("drag", b);
  }
  function _(b) {
    Qe(b.view).on("mousemove.drag mouseup.drag", null), Du(b.view, c), un(b), i.mouse("end", b);
  }
  function m(b, O) {
    if (e.call(this, b, O)) {
      var F = b.changedTouches, K = t.call(this, b, O), N = F.length, C, M;
      for (C = 0; C < N; ++C)
        (M = g(this, K, b, O, F[C].identifier, F[C])) && (Pi(b), M("start", b, F[C]));
    }
  }
  function p(b) {
    var O = b.changedTouches, F = O.length, K, N;
    for (K = 0; K < F; ++K)
      (N = i[O[K].identifier]) && (un(b), N("drag", b, O[K]));
  }
  function v(b) {
    var O = b.changedTouches, F = O.length, K, N;
    for (l && clearTimeout(l), l = setTimeout(function() {
      l = null;
    }, 500), K = 0; K < F; ++K)
      (N = i[O[K].identifier]) && (Pi(b), N("end", b, O[K]));
  }
  function g(b, O, F, K, N, C) {
    var M = a.copy(), B = lt(C || F, O), S, Q, y;
    if ((y = n.call(b, new qr("beforestart", {
      sourceEvent: F,
      target: f,
      identifier: N,
      active: r,
      x: B[0],
      y: B[1],
      dx: 0,
      dy: 0,
      dispatch: M
    }), K)) != null)
      return S = y.x - B[0] || 0, Q = y.y - B[1] || 0, function P($, X, U) {
        var z = B, E;
        switch ($) {
          case "start":
            i[N] = P, E = r++;
            break;
          case "end":
            delete i[N], --r;
          case "drag":
            B = lt(U || X, O), E = r;
            break;
        }
        M.call(
          $,
          b,
          new qr($, {
            sourceEvent: X,
            subject: y,
            target: f,
            identifier: N,
            active: E,
            x: B[0] + S,
            y: B[1] + Q,
            dx: B[0] - z[0],
            dy: B[1] - z[1],
            dispatch: M
          }),
          K
        );
      };
  }
  return f.filter = function(b) {
    return arguments.length ? (e = typeof b == "function" ? b : ho(!!b), f) : e;
  }, f.container = function(b) {
    return arguments.length ? (t = typeof b == "function" ? b : ho(b), f) : t;
  }, f.subject = function(b) {
    return arguments.length ? (n = typeof b == "function" ? b : ho(b), f) : n;
  }, f.touchable = function(b) {
    return arguments.length ? (o = typeof b == "function" ? b : ho(!!b), f) : o;
  }, f.on = function() {
    var b = a.on.apply(a, arguments);
    return b === a ? f : b;
  }, f.clickDistance = function(b) {
    return arguments.length ? (d = (b = +b) * b, f) : Math.sqrt(d);
  }, f;
}
function Ea(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Au(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function oo() {
}
var Gn = 0.7, Go = 1 / Gn, cn = "\\s*([+-]?\\d+)\\s*", Yn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ht = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", dp = /^#([0-9a-f]{3,8})$/, fp = new RegExp(`^rgb\\(${cn},${cn},${cn}\\)$`), hp = new RegExp(`^rgb\\(${ht},${ht},${ht}\\)$`), pp = new RegExp(`^rgba\\(${cn},${cn},${cn},${Yn}\\)$`), gp = new RegExp(`^rgba\\(${ht},${ht},${ht},${Yn}\\)$`), vp = new RegExp(`^hsl\\(${Yn},${ht},${ht}\\)$`), mp = new RegExp(`^hsla\\(${Yn},${ht},${ht},${Yn}\\)$`), ss = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Ea(oo, Zt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ls,
  // Deprecated! Use color.formatHex.
  formatHex: ls,
  formatHex8: yp,
  formatHsl: wp,
  formatRgb: us,
  toString: us
});
function ls() {
  return this.rgb().formatHex();
}
function yp() {
  return this.rgb().formatHex8();
}
function wp() {
  return Ou(this).formatHsl();
}
function us() {
  return this.rgb().formatRgb();
}
function Zt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = dp.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? cs(t) : n === 3 ? new qe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? po(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? po(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = fp.exec(e)) ? new qe(t[1], t[2], t[3], 1) : (t = hp.exec(e)) ? new qe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = pp.exec(e)) ? po(t[1], t[2], t[3], t[4]) : (t = gp.exec(e)) ? po(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = vp.exec(e)) ? hs(t[1], t[2] / 100, t[3] / 100, 1) : (t = mp.exec(e)) ? hs(t[1], t[2] / 100, t[3] / 100, t[4]) : ss.hasOwnProperty(e) ? cs(ss[e]) : e === "transparent" ? new qe(NaN, NaN, NaN, 0) : null;
}
function cs(e) {
  return new qe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function po(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new qe(e, t, n, o);
}
function _p(e) {
  return e instanceof oo || (e = Zt(e)), e ? (e = e.rgb(), new qe(e.r, e.g, e.b, e.opacity)) : new qe();
}
function Xr(e, t, n, o) {
  return arguments.length === 1 ? _p(e) : new qe(e, t, n, o ?? 1);
}
function qe(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Ea(qe, Xr, Au(oo, {
  brighter(e) {
    return e = e == null ? Go : Math.pow(Go, e), new qe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gn : Math.pow(Gn, e), new qe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new qe(Xt(this.r), Xt(this.g), Xt(this.b), Yo(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ds,
  // Deprecated! Use color.formatHex.
  formatHex: ds,
  formatHex8: bp,
  formatRgb: fs,
  toString: fs
}));
function ds() {
  return `#${Gt(this.r)}${Gt(this.g)}${Gt(this.b)}`;
}
function bp() {
  return `#${Gt(this.r)}${Gt(this.g)}${Gt(this.b)}${Gt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function fs() {
  const e = Yo(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Xt(this.r)}, ${Xt(this.g)}, ${Xt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function Yo(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Xt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Gt(e) {
  return e = Xt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function hs(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new et(e, t, n, o);
}
function Ou(e) {
  if (e instanceof et)
    return new et(e.h, e.s, e.l, e.opacity);
  if (e instanceof oo || (e = Zt(e)), !e)
    return new et();
  if (e instanceof et)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), a = Math.max(t, n, o), r = NaN, s = a - i, u = (a + i) / 2;
  return s ? (t === a ? r = (n - o) / s + (n < o) * 6 : n === a ? r = (o - t) / s + 2 : r = (t - n) / s + 4, s /= u < 0.5 ? a + i : 2 - a - i, r *= 60) : s = u > 0 && u < 1 ? 0 : r, new et(r, s, u, e.opacity);
}
function kp(e, t, n, o) {
  return arguments.length === 1 ? Ou(e) : new et(e, t, n, o ?? 1);
}
function et(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Ea(et, kp, Au(oo, {
  brighter(e) {
    return e = e == null ? Go : Math.pow(Go, e), new et(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? Gn : Math.pow(Gn, e), new et(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new qe(
      Ri(e >= 240 ? e - 240 : e + 120, i, o),
      Ri(e, i, o),
      Ri(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new et(ps(this.h), go(this.s), go(this.l), Yo(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = Yo(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${ps(this.h)}, ${go(this.s) * 100}%, ${go(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function ps(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function go(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ri(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const $a = (e) => () => e;
function Ep(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function $p(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function xp(e) {
  return (e = +e) == 1 ? Pu : function(t, n) {
    return n - t ? $p(t, n, e) : $a(isNaN(t) ? n : t);
  };
}
function Pu(e, t) {
  var n = t - e;
  return n ? Ep(e, n) : $a(isNaN(e) ? t : e);
}
const Uo = (function e(t) {
  var n = xp(t);
  function o(i, a) {
    var r = n((i = Xr(i)).r, (a = Xr(a)).r), s = n(i.g, a.g), u = n(i.b, a.b), c = Pu(i.opacity, a.opacity);
    return function(l) {
      return i.r = r(l), i.g = s(l), i.b = u(l), i.opacity = c(l), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function Sp(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), i;
  return function(a) {
    for (i = 0; i < n; ++i)
      o[i] = e[i] * (1 - a) + t[i] * a;
    return o;
  };
}
function Np(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Cp(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, i = new Array(o), a = new Array(n), r;
  for (r = 0; r < o; ++r)
    i[r] = Rn(e[r], t[r]);
  for (; r < n; ++r)
    a[r] = t[r];
  return function(s) {
    for (r = 0; r < o; ++r)
      a[r] = i[r](s);
    return a;
  };
}
function Mp(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function ut(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Tp(e, t) {
  var n = {}, o = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = Rn(e[i], t[i]) : o[i] = t[i];
  return function(a) {
    for (i in n)
      o[i] = n[i](a);
    return o;
  };
}
var Wr = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, zi = new RegExp(Wr.source, "g");
function Ip(e) {
  return function() {
    return e;
  };
}
function Dp(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Ru(e, t) {
  var n = Wr.lastIndex = zi.lastIndex = 0, o, i, a, r = -1, s = [], u = [];
  for (e = e + "", t = t + ""; (o = Wr.exec(e)) && (i = zi.exec(t)); )
    (a = i.index) > n && (a = t.slice(n, a), s[r] ? s[r] += a : s[++r] = a), (o = o[0]) === (i = i[0]) ? s[r] ? s[r] += i : s[++r] = i : (s[++r] = null, u.push({ i: r, x: ut(o, i) })), n = zi.lastIndex;
  return n < t.length && (a = t.slice(n), s[r] ? s[r] += a : s[++r] = a), s.length < 2 ? u[0] ? Dp(u[0].x) : Ip(t) : (t = u.length, function(c) {
    for (var l = 0, d; l < t; ++l)
      s[(d = u[l]).i] = d.x(c);
    return s.join("");
  });
}
function Rn(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? $a(t) : (n === "number" ? ut : n === "string" ? (o = Zt(t)) ? (t = o, Uo) : Ru : t instanceof Zt ? Uo : t instanceof Date ? Mp : Np(t) ? Sp : Array.isArray(t) ? Cp : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Tp : ut)(e, t);
}
var gs = 180 / Math.PI, Kr = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function zu(e, t, n, o, i, a) {
  var r, s, u;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (u = e * n + t * o) && (n -= e * u, o -= t * u), (s = Math.sqrt(n * n + o * o)) && (n /= s, o /= s, u /= s), e * o < t * n && (e = -e, t = -t, u = -u, r = -r), {
    translateX: i,
    translateY: a,
    rotate: Math.atan2(t, e) * gs,
    skewX: Math.atan(u) * gs,
    scaleX: r,
    scaleY: s
  };
}
var vo;
function Ap(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? Kr : zu(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Op(e) {
  return e == null || (vo || (vo = document.createElementNS("http://www.w3.org/2000/svg", "g")), vo.setAttribute("transform", e), !(e = vo.transform.baseVal.consolidate())) ? Kr : (e = e.matrix, zu(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Bu(e, t, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function a(c, l, d, f, h, w) {
    if (c !== d || l !== f) {
      var _ = h.push("translate(", null, t, null, n);
      w.push({ i: _ - 4, x: ut(c, d) }, { i: _ - 2, x: ut(l, f) });
    } else (d || f) && h.push("translate(" + d + t + f + n);
  }
  function r(c, l, d, f) {
    c !== l ? (c - l > 180 ? l += 360 : l - c > 180 && (c += 360), f.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: ut(c, l) })) : l && d.push(i(d) + "rotate(" + l + o);
  }
  function s(c, l, d, f) {
    c !== l ? f.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: ut(c, l) }) : l && d.push(i(d) + "skewX(" + l + o);
  }
  function u(c, l, d, f, h, w) {
    if (c !== d || l !== f) {
      var _ = h.push(i(h) + "scale(", null, ",", null, ")");
      w.push({ i: _ - 4, x: ut(c, d) }, { i: _ - 2, x: ut(l, f) });
    } else (d !== 1 || f !== 1) && h.push(i(h) + "scale(" + d + "," + f + ")");
  }
  return function(c, l) {
    var d = [], f = [];
    return c = e(c), l = e(l), a(c.translateX, c.translateY, l.translateX, l.translateY, d, f), r(c.rotate, l.rotate, d, f), s(c.skewX, l.skewX, d, f), u(c.scaleX, c.scaleY, l.scaleX, l.scaleY, d, f), c = l = null, function(h) {
      for (var w = -1, _ = f.length, m; ++w < _; )
        d[(m = f[w]).i] = m.x(h);
      return d.join("");
    };
  };
}
var Pp = Bu(Ap, "px, ", "px)", "deg)"), Rp = Bu(Op, ", ", ")", ")"), zp = 1e-12;
function vs(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function Bp(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Lp(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Do = (function e(t, n, o) {
  function i(a, r) {
    var s = a[0], u = a[1], c = a[2], l = r[0], d = r[1], f = r[2], h = l - s, w = d - u, _ = h * h + w * w, m, p;
    if (_ < zp)
      p = Math.log(f / c) / t, m = function(K) {
        return [
          s + K * h,
          u + K * w,
          c * Math.exp(t * K * p)
        ];
      };
    else {
      var v = Math.sqrt(_), g = (f * f - c * c + o * _) / (2 * c * n * v), b = (f * f - c * c - o * _) / (2 * f * n * v), O = Math.log(Math.sqrt(g * g + 1) - g), F = Math.log(Math.sqrt(b * b + 1) - b);
      p = (F - O) / t, m = function(K) {
        var N = K * p, C = vs(O), M = c / (n * v) * (C * Lp(t * N + O) - Bp(O));
        return [
          s + M * h,
          u + M * w,
          c * C / vs(t * N + O)
        ];
      };
    }
    return m.duration = p * 1e3 * t / Math.SQRT2, m;
  }
  return i.rho = function(a) {
    var r = Math.max(1e-3, +a), s = r * r, u = s * s;
    return e(r, s, u);
  }, i;
})(Math.SQRT2, 2, 4);
var pn = 0, Tn = 0, Sn = 0, Lu = 1e3, qo, In, Xo = 0, jt = 0, ui = 0, Un = typeof performance == "object" && performance.now ? performance : Date, Vu = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function xa() {
  return jt || (Vu(Vp), jt = Un.now() + ui);
}
function Vp() {
  jt = 0;
}
function Wo() {
  this._call = this._time = this._next = null;
}
Wo.prototype = Hu.prototype = {
  constructor: Wo,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? xa() : +n) + (t == null ? 0 : +t), !this._next && In !== this && (In ? In._next = this : qo = this, In = this), this._call = e, this._time = n, Zr();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Zr());
  }
};
function Hu(e, t, n) {
  var o = new Wo();
  return o.restart(e, t, n), o;
}
function Hp() {
  xa(), ++pn;
  for (var e = qo, t; e; )
    (t = jt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --pn;
}
function ms() {
  jt = (Xo = Un.now()) + ui, pn = Tn = 0;
  try {
    Hp();
  } finally {
    pn = 0, Gp(), jt = 0;
  }
}
function Fp() {
  var e = Un.now(), t = e - Xo;
  t > Lu && (ui -= t, Xo = e);
}
function Gp() {
  for (var e, t = qo, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : qo = n);
  In = e, Zr(o);
}
function Zr(e) {
  if (!pn) {
    Tn && (Tn = clearTimeout(Tn));
    var t = e - jt;
    t > 24 ? (e < 1 / 0 && (Tn = setTimeout(ms, e - Un.now() - ui)), Sn && (Sn = clearInterval(Sn))) : (Sn || (Xo = Un.now(), Sn = setInterval(Fp, Lu)), pn = 1, Vu(ms));
  }
}
function ys(e, t, n) {
  var o = new Wo();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Yp = si("start", "end", "cancel", "interrupt"), Up = [], Fu = 0, ws = 1, jr = 2, Ao = 3, _s = 4, Jr = 5, Oo = 6;
function ci(e, t, n, o, i, a) {
  var r = e.__transition;
  if (!r)
    e.__transition = {};
  else if (n in r)
    return;
  qp(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Yp,
    tween: Up,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: Fu
  });
}
function Sa(e, t) {
  var n = it(e, t);
  if (n.state > Fu)
    throw new Error("too late; already scheduled");
  return n;
}
function gt(e, t) {
  var n = it(e, t);
  if (n.state > Ao)
    throw new Error("too late; already running");
  return n;
}
function it(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function qp(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Hu(a, 0, n.time);
  function a(c) {
    n.state = ws, n.timer.restart(r, n.delay, n.time), n.delay <= c && r(c - n.delay);
  }
  function r(c) {
    var l, d, f, h;
    if (n.state !== ws)
      return u();
    for (l in o)
      if (h = o[l], h.name === n.name) {
        if (h.state === Ao)
          return ys(r);
        h.state === _s ? (h.state = Oo, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[l]) : +l < t && (h.state = Oo, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[l]);
      }
    if (ys(function() {
      n.state === Ao && (n.state = _s, n.timer.restart(s, n.delay, n.time), s(c));
    }), n.state = jr, n.on.call("start", e, e.__data__, n.index, n.group), n.state === jr) {
      for (n.state = Ao, i = new Array(f = n.tween.length), l = 0, d = -1; l < f; ++l)
        (h = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = h);
      i.length = d + 1;
    }
  }
  function s(c) {
    for (var l = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = Jr, 1), d = -1, f = i.length; ++d < f; )
      i[d].call(e, l);
    n.state === Jr && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Oo, n.timer.stop(), delete o[t];
    for (var c in o)
      return;
    delete e.__transition;
  }
}
function Po(e, t) {
  var n = e.__transition, o, i, a = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        a = !1;
        continue;
      }
      i = o.state > jr && o.state < Jr, o.state = Oo, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    a && delete e.__transition;
  }
}
function Xp(e) {
  return this.each(function() {
    Po(this, e);
  });
}
function Wp(e, t) {
  var n, o;
  return function() {
    var i = gt(this, e), a = i.tween;
    if (a !== n) {
      o = n = a;
      for (var r = 0, s = o.length; r < s; ++r)
        if (o[r].name === t) {
          o = o.slice(), o.splice(r, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Kp(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var a = gt(this, e), r = a.tween;
    if (r !== o) {
      i = (o = r).slice();
      for (var s = { name: t, value: n }, u = 0, c = i.length; u < c; ++u)
        if (i[u].name === t) {
          i[u] = s;
          break;
        }
      u === c && i.push(s);
    }
    a.tween = i;
  };
}
function Zp(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = it(this.node(), n).tween, i = 0, a = o.length, r; i < a; ++i)
      if ((r = o[i]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? Wp : Kp)(n, e, t));
}
function Na(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = gt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return it(i, o).value[t];
  };
}
function Gu(e, t) {
  var n;
  return (typeof t == "number" ? ut : t instanceof Zt ? Uo : (n = Zt(t)) ? (t = n, Uo) : Ru)(e, t);
}
function jp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Jp(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function Qp(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = this.getAttribute(e);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function eg(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function tg(e, t, n) {
  var o, i, a;
  return function() {
    var r, s = n(this), u;
    return s == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), u = s + "", r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s)));
  };
}
function ng(e, t, n) {
  var o, i, a;
  return function() {
    var r, s = n(this), u;
    return s == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), u = s + "", r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s)));
  };
}
function og(e, t) {
  var n = li(e), o = n === "transform" ? Rp : Gu;
  return this.attrTween(e, typeof t == "function" ? (n.local ? ng : tg)(n, o, Na(this, "attr." + e, t)) : t == null ? (n.local ? Jp : jp)(n) : (n.local ? eg : Qp)(n, o, t));
}
function ig(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function rg(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function ag(e, t) {
  var n, o;
  function i() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && rg(e, a)), n;
  }
  return i._value = t, i;
}
function sg(e, t) {
  var n, o;
  function i() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && ig(e, a)), n;
  }
  return i._value = t, i;
}
function lg(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = li(e);
  return this.tween(n, (o.local ? ag : sg)(o, t));
}
function ug(e, t) {
  return function() {
    Sa(this, e).delay = +t.apply(this, arguments);
  };
}
function cg(e, t) {
  return t = +t, function() {
    Sa(this, e).delay = t;
  };
}
function dg(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? ug : cg)(t, e)) : it(this.node(), t).delay;
}
function fg(e, t) {
  return function() {
    gt(this, e).duration = +t.apply(this, arguments);
  };
}
function hg(e, t) {
  return t = +t, function() {
    gt(this, e).duration = t;
  };
}
function pg(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? fg : hg)(t, e)) : it(this.node(), t).duration;
}
function gg(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    gt(this, e).ease = t;
  };
}
function vg(e) {
  var t = this._id;
  return arguments.length ? this.each(gg(t, e)) : it(this.node(), t).ease;
}
function mg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    gt(this, e).ease = n;
  };
}
function yg(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(mg(this._id, e));
}
function wg(e) {
  typeof e != "function" && (e = bu(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = [], u, c = 0; c < r; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Nt(o, this._parents, this._name, this._id);
}
function _g(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, a = Math.min(o, i), r = new Array(o), s = 0; s < a; ++s)
    for (var u = t[s], c = n[s], l = u.length, d = r[s] = new Array(l), f, h = 0; h < l; ++h)
      (f = u[h] || c[h]) && (d[h] = f);
  for (; s < o; ++s)
    r[s] = t[s];
  return new Nt(r, this._parents, this._name, this._id);
}
function bg(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function kg(e, t, n) {
  var o, i, a = bg(t) ? Sa : gt;
  return function() {
    var r = a(this, e), s = r.on;
    s !== o && (i = (o = s).copy()).on(t, n), r.on = i;
  };
}
function Eg(e, t) {
  var n = this._id;
  return arguments.length < 2 ? it(this.node(), n).on.on(e) : this.each(kg(n, e, t));
}
function $g(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function xg() {
  return this.on("end.remove", $g(this._id));
}
function Sg(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ba(e));
  for (var o = this._groups, i = o.length, a = new Array(i), r = 0; r < i; ++r)
    for (var s = o[r], u = s.length, c = a[r] = new Array(u), l, d, f = 0; f < u; ++f)
      (l = s[f]) && (d = e.call(l, l.__data__, f, s)) && ("__data__" in l && (d.__data__ = l.__data__), c[f] = d, ci(c[f], t, n, f, c, it(l, n)));
  return new Nt(a, this._parents, t, n);
}
function Ng(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = _u(e));
  for (var o = this._groups, i = o.length, a = [], r = [], s = 0; s < i; ++s)
    for (var u = o[s], c = u.length, l, d = 0; d < c; ++d)
      if (l = u[d]) {
        for (var f = e.call(l, l.__data__, d, u), h, w = it(l, n), _ = 0, m = f.length; _ < m; ++_)
          (h = f[_]) && ci(h, t, n, _, f, w);
        a.push(f), r.push(l);
      }
  return new Nt(a, r, t, n);
}
var Cg = no.prototype.constructor;
function Mg() {
  return new Cg(this._groups, this._parents);
}
function Tg(e, t) {
  var n, o, i;
  return function() {
    var a = hn(this, e), r = (this.style.removeProperty(e), hn(this, e));
    return a === r ? null : a === n && r === o ? i : i = t(n = a, o = r);
  };
}
function Yu(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Ig(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = hn(this, e);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function Dg(e, t, n) {
  var o, i, a;
  return function() {
    var r = hn(this, e), s = n(this), u = s + "";
    return s == null && (u = s = (this.style.removeProperty(e), hn(this, e))), r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s));
  };
}
function Ag(e, t) {
  var n, o, i, a = "style." + t, r = "end." + a, s;
  return function() {
    var u = gt(this, e), c = u.on, l = u.value[a] == null ? s || (s = Yu(t)) : void 0;
    (c !== n || i !== l) && (o = (n = c).copy()).on(r, i = l), u.on = o;
  };
}
function Og(e, t, n) {
  var o = (e += "") == "transform" ? Pp : Gu;
  return t == null ? this.styleTween(e, Tg(e, o)).on("end.style." + e, Yu(e)) : typeof t == "function" ? this.styleTween(e, Dg(e, o, Na(this, "style." + e, t))).each(Ag(this._id, e)) : this.styleTween(e, Ig(e, o, t), n).on("end.style." + e, null);
}
function Pg(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Rg(e, t, n) {
  var o, i;
  function a() {
    var r = t.apply(this, arguments);
    return r !== i && (o = (i = r) && Pg(e, r, n)), o;
  }
  return a._value = t, a;
}
function zg(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Rg(e, t, n ?? ""));
}
function Bg(e) {
  return function() {
    this.textContent = e;
  };
}
function Lg(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Vg(e) {
  return this.tween("text", typeof e == "function" ? Lg(Na(this, "text", e)) : Bg(e == null ? "" : e + ""));
}
function Hg(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Fg(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && Hg(i)), t;
  }
  return o._value = e, o;
}
function Gg(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Fg(e));
}
function Yg() {
  for (var e = this._name, t = this._id, n = Uu(), o = this._groups, i = o.length, a = 0; a < i; ++a)
    for (var r = o[a], s = r.length, u, c = 0; c < s; ++c)
      if (u = r[c]) {
        var l = it(u, t);
        ci(u, e, n, c, r, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new Nt(o, this._parents, e, n);
}
function Ug() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(a, r) {
    var s = { value: r }, u = { value: function() {
      --i === 0 && a();
    } };
    n.each(function() {
      var c = gt(this, o), l = c.on;
      l !== e && (t = (e = l).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(u)), c.on = t;
    }), i === 0 && a();
  });
}
var qg = 0;
function Nt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function Uu() {
  return ++qg;
}
var yt = no.prototype;
Nt.prototype = {
  constructor: Nt,
  select: Sg,
  selectAll: Ng,
  selectChild: yt.selectChild,
  selectChildren: yt.selectChildren,
  filter: wg,
  merge: _g,
  selection: Mg,
  transition: Yg,
  call: yt.call,
  nodes: yt.nodes,
  node: yt.node,
  size: yt.size,
  empty: yt.empty,
  each: yt.each,
  on: Eg,
  attr: og,
  attrTween: lg,
  style: Og,
  styleTween: zg,
  text: Vg,
  textTween: Gg,
  remove: xg,
  tween: Zp,
  delay: dg,
  duration: pg,
  ease: vg,
  easeVarying: yg,
  end: Ug,
  [Symbol.iterator]: yt[Symbol.iterator]
};
function Xg(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Wg = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Xg
};
function Kg(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Zg(e) {
  var t, n;
  e instanceof Nt ? (t = e._id, e = e._name) : (t = Uu(), (n = Wg).time = xa(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, a = 0; a < i; ++a)
    for (var r = o[a], s = r.length, u, c = 0; c < s; ++c)
      (u = r[c]) && ci(u, e, t, c, r, n || Kg(u, t));
  return new Nt(o, this._parents, e, t);
}
no.prototype.interrupt = Xp;
no.prototype.transition = Zg;
const mo = (e) => () => e;
function jg(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function kt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
kt.prototype = {
  constructor: kt,
  scale: function(e) {
    return e === 1 ? this : new kt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new kt(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var gn = new kt(1, 0, 0);
kt.prototype;
function Bi(e) {
  e.stopImmediatePropagation();
}
function Nn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Jg(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function Qg() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function bs() {
  return this.__zoom || gn;
}
function ev(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function tv() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function nv(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    r > a ? (a + r) / 2 : Math.min(0, a) || Math.max(0, r)
  );
}
function ov() {
  var e = Jg, t = Qg, n = nv, o = ev, i = tv, a = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], s = 250, u = Do, c = si("start", "zoom", "end"), l, d, f, h = 500, w = 150, _ = 0, m = 10;
  function p(y) {
    y.property("__zoom", bs).on("wheel.zoom", N, { passive: !1 }).on("mousedown.zoom", C).on("dblclick.zoom", M).filter(i).on("touchstart.zoom", B).on("touchmove.zoom", S).on("touchend.zoom touchcancel.zoom", Q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  p.transform = function(y, P, $, X) {
    var U = y.selection ? y.selection() : y;
    U.property("__zoom", bs), y !== U ? O(y, P, $, X) : U.interrupt().each(function() {
      F(this, arguments).event(X).start().zoom(null, typeof P == "function" ? P.apply(this, arguments) : P).end();
    });
  }, p.scaleBy = function(y, P, $, X) {
    p.scaleTo(y, function() {
      var U = this.__zoom.k, z = typeof P == "function" ? P.apply(this, arguments) : P;
      return U * z;
    }, $, X);
  }, p.scaleTo = function(y, P, $, X) {
    p.transform(y, function() {
      var U = t.apply(this, arguments), z = this.__zoom, E = $ == null ? b(U) : typeof $ == "function" ? $.apply(this, arguments) : $, L = z.invert(E), te = typeof P == "function" ? P.apply(this, arguments) : P;
      return n(g(v(z, te), E, L), U, r);
    }, $, X);
  }, p.translateBy = function(y, P, $, X) {
    p.transform(y, function() {
      return n(this.__zoom.translate(
        typeof P == "function" ? P.apply(this, arguments) : P,
        typeof $ == "function" ? $.apply(this, arguments) : $
      ), t.apply(this, arguments), r);
    }, null, X);
  }, p.translateTo = function(y, P, $, X, U) {
    p.transform(y, function() {
      var z = t.apply(this, arguments), E = this.__zoom, L = X == null ? b(z) : typeof X == "function" ? X.apply(this, arguments) : X;
      return n(gn.translate(L[0], L[1]).scale(E.k).translate(
        typeof P == "function" ? -P.apply(this, arguments) : -P,
        typeof $ == "function" ? -$.apply(this, arguments) : -$
      ), z, r);
    }, X, U);
  };
  function v(y, P) {
    return P = Math.max(a[0], Math.min(a[1], P)), P === y.k ? y : new kt(P, y.x, y.y);
  }
  function g(y, P, $) {
    var X = P[0] - $[0] * y.k, U = P[1] - $[1] * y.k;
    return X === y.x && U === y.y ? y : new kt(y.k, X, U);
  }
  function b(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function O(y, P, $, X) {
    y.on("start.zoom", function() {
      F(this, arguments).event(X).start();
    }).on("interrupt.zoom end.zoom", function() {
      F(this, arguments).event(X).end();
    }).tween("zoom", function() {
      var U = this, z = arguments, E = F(U, z).event(X), L = t.apply(U, z), te = $ == null ? b(L) : typeof $ == "function" ? $.apply(U, z) : $, H = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), q = U.__zoom, Y = typeof P == "function" ? P.apply(U, z) : P, j = u(q.invert(te).concat(H / q.k), Y.invert(te).concat(H / Y.k));
      return function(ee) {
        if (ee === 1)
          ee = Y;
        else {
          var ae = j(ee), me = H / ae[2];
          ee = new kt(me, te[0] - ae[0] * me, te[1] - ae[1] * me);
        }
        E.zoom(null, ee);
      };
    });
  }
  function F(y, P, $) {
    return !$ && y.__zooming || new K(y, P);
  }
  function K(y, P) {
    this.that = y, this.args = P, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, P), this.taps = 0;
  }
  K.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, P) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = P.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = P.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = P.invert(this.touch1[0])), this.that.__zoom = P, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var P = Qe(this.that).datum();
      c.call(
        y,
        this.that,
        new jg(y, {
          sourceEvent: this.sourceEvent,
          target: p,
          transform: this.that.__zoom,
          dispatch: c
        }),
        P
      );
    }
  };
  function N(y, ...P) {
    if (!e.apply(this, arguments))
      return;
    var $ = F(this, P).event(y), X = this.__zoom, U = Math.max(a[0], Math.min(a[1], X.k * Math.pow(2, o.apply(this, arguments)))), z = lt(y);
    if ($.wheel)
      ($.mouse[0][0] !== z[0] || $.mouse[0][1] !== z[1]) && ($.mouse[1] = X.invert($.mouse[0] = z)), clearTimeout($.wheel);
    else {
      if (X.k === U)
        return;
      $.mouse = [z, X.invert(z)], Po(this), $.start();
    }
    Nn(y), $.wheel = setTimeout(E, w), $.zoom("mouse", n(g(v(X, U), $.mouse[0], $.mouse[1]), $.extent, r));
    function E() {
      $.wheel = null, $.end();
    }
  }
  function C(y, ...P) {
    if (f || !e.apply(this, arguments))
      return;
    var $ = y.currentTarget, X = F(this, P, !0).event(y), U = Qe(y.view).on("mousemove.zoom", te, !0).on("mouseup.zoom", H, !0), z = lt(y, $), E = y.clientX, L = y.clientY;
    Iu(y.view), Bi(y), X.mouse = [z, this.__zoom.invert(z)], Po(this), X.start();
    function te(q) {
      if (Nn(q), !X.moved) {
        var Y = q.clientX - E, j = q.clientY - L;
        X.moved = Y * Y + j * j > _;
      }
      X.event(q).zoom("mouse", n(g(X.that.__zoom, X.mouse[0] = lt(q, $), X.mouse[1]), X.extent, r));
    }
    function H(q) {
      U.on("mousemove.zoom mouseup.zoom", null), Du(q.view, X.moved), Nn(q), X.event(q).end();
    }
  }
  function M(y, ...P) {
    if (e.apply(this, arguments)) {
      var $ = this.__zoom, X = lt(y.changedTouches ? y.changedTouches[0] : y, this), U = $.invert(X), z = $.k * (y.shiftKey ? 0.5 : 2), E = n(g(v($, z), X, U), t.apply(this, P), r);
      Nn(y), s > 0 ? Qe(this).transition().duration(s).call(O, E, X, y) : Qe(this).call(p.transform, E, X, y);
    }
  }
  function B(y, ...P) {
    if (e.apply(this, arguments)) {
      var $ = y.touches, X = $.length, U = F(this, P, y.changedTouches.length === X).event(y), z, E, L, te;
      for (Bi(y), E = 0; E < X; ++E)
        L = $[E], te = lt(L, this), te = [te, this.__zoom.invert(te), L.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== te[2] && (U.touch1 = te, U.taps = 0) : (U.touch0 = te, z = !0, U.taps = 1 + !!l);
      l && (l = clearTimeout(l)), z && (U.taps < 2 && (d = te[0], l = setTimeout(function() {
        l = null;
      }, h)), Po(this), U.start());
    }
  }
  function S(y, ...P) {
    if (this.__zooming) {
      var $ = F(this, P).event(y), X = y.changedTouches, U = X.length, z, E, L, te;
      for (Nn(y), z = 0; z < U; ++z)
        E = X[z], L = lt(E, this), $.touch0 && $.touch0[2] === E.identifier ? $.touch0[0] = L : $.touch1 && $.touch1[2] === E.identifier && ($.touch1[0] = L);
      if (E = $.that.__zoom, $.touch1) {
        var H = $.touch0[0], q = $.touch0[1], Y = $.touch1[0], j = $.touch1[1], ee = (ee = Y[0] - H[0]) * ee + (ee = Y[1] - H[1]) * ee, ae = (ae = j[0] - q[0]) * ae + (ae = j[1] - q[1]) * ae;
        E = v(E, Math.sqrt(ee / ae)), L = [(H[0] + Y[0]) / 2, (H[1] + Y[1]) / 2], te = [(q[0] + j[0]) / 2, (q[1] + j[1]) / 2];
      } else if ($.touch0)
        L = $.touch0[0], te = $.touch0[1];
      else
        return;
      $.zoom("touch", n(g(E, L, te), $.extent, r));
    }
  }
  function Q(y, ...P) {
    if (this.__zooming) {
      var $ = F(this, P).event(y), X = y.changedTouches, U = X.length, z, E;
      for (Bi(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), z = 0; z < U; ++z)
        E = X[z], $.touch0 && $.touch0[2] === E.identifier ? delete $.touch0 : $.touch1 && $.touch1[2] === E.identifier && delete $.touch1;
      if ($.touch1 && !$.touch0 && ($.touch0 = $.touch1, delete $.touch1), $.touch0)
        $.touch0[1] = this.__zoom.invert($.touch0[0]);
      else if ($.end(), $.taps === 2 && (E = lt(E, this), Math.hypot(d[0] - E[0], d[1] - E[1]) < m)) {
        var L = Qe(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return p.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : mo(+y), p) : o;
  }, p.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : mo(!!y), p) : e;
  }, p.touchable = function(y) {
    return arguments.length ? (i = typeof y == "function" ? y : mo(!!y), p) : i;
  }, p.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : mo([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), p) : t;
  }, p.scaleExtent = function(y) {
    return arguments.length ? (a[0] = +y[0], a[1] = +y[1], p) : [a[0], a[1]];
  }, p.translateExtent = function(y) {
    return arguments.length ? (r[0][0] = +y[0][0], r[1][0] = +y[1][0], r[0][1] = +y[0][1], r[1][1] = +y[1][1], p) : [[r[0][0], r[0][1]], [r[1][0], r[1][1]]];
  }, p.constrain = function(y) {
    return arguments.length ? (n = y, p) : n;
  }, p.duration = function(y) {
    return arguments.length ? (s = +y, p) : s;
  }, p.interpolate = function(y) {
    return arguments.length ? (u = y, p) : u;
  }, p.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? p : y;
  }, p.clickDistance = function(y) {
    return arguments.length ? (_ = (y = +y) * y, p) : Math.sqrt(_);
  }, p.tapDistance = function(y) {
    return arguments.length ? (m = +y, p) : m;
  }, p;
}
var ue = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(ue || {}), Ca = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Ca || {}), Vt = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Vt || {}), Rt = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(Rt || {}), qn = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(qn || {}), zn = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(zn || {}), qu = /* @__PURE__ */ ((e) => (e.TopLeft = "top-left", e.TopCenter = "top-center", e.TopRight = "top-right", e.BottomLeft = "bottom-left", e.BottomCenter = "bottom-center", e.BottomRight = "bottom-right", e))(qu || {});
const iv = ["INPUT", "SELECT", "TEXTAREA"], rv = typeof document < "u" ? document : null;
function Qr(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, i = typeof o?.hasAttribute == "function" ? o.hasAttribute("contenteditable") : !1, a = typeof o?.closest == "function" ? o.closest(".nokey") : null;
  return iv.includes(o?.nodeName) || i || !!a;
}
function av(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function ks(e, t, n, o) {
  const i = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((r) => r.trim().toLowerCase());
  if (i.length === 1)
    return e.toLowerCase() === t.toLowerCase();
  o || n.add(e.toLowerCase());
  const a = i.every(
    (r, s) => n.has(r) && Array.from(n.values())[s] === i[s]
  );
  return o && n.delete(e.toLowerCase()), a;
}
function sv(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = lv(n.code, e);
    return Array.isArray(e) ? e.some((i) => ks(n[o], i, t, n.type === "keyup")) : ks(n[o], e, t, n.type === "keyup");
  };
}
function lv(e, t) {
  return t.includes(e) ? "code" : "key";
}
function Bn(e, t) {
  const n = ne(() => Ne(t?.target) ?? rv), o = bt(Ne(e) === !0);
  let i = !1;
  const a = /* @__PURE__ */ new Set();
  let r = u(Ne(e));
  Ee(
    () => Ne(e),
    (c, l) => {
      typeof l == "boolean" && typeof c != "boolean" && s(), r = u(c);
    },
    {
      immediate: !0
    }
  ), yu(["blur", "contextmenu"], s), is(
    (...c) => r(...c),
    (c) => {
      var l, d;
      const f = Ne(t?.actInsideInputWithModifier) ?? !0, h = Ne(t?.preventDefault) ?? !1;
      if (i = av(c), (!i || i && !f) && Qr(c))
        return;
      const _ = ((d = (l = c.composedPath) == null ? void 0 : l.call(c)) == null ? void 0 : d[0]) || c.target, m = _?.nodeName === "BUTTON" || _?.nodeName === "A";
      !h && (i || !m) && c.preventDefault(), o.value = !0;
    },
    { eventName: "keydown", target: n }
  ), is(
    (...c) => r(...c),
    (c) => {
      const l = Ne(t?.actInsideInputWithModifier) ?? !0;
      if (o.value) {
        if ((!i || i && !l) && Qr(c))
          return;
        i = !1, o.value = !1;
      }
    },
    { eventName: "keyup", target: n }
  );
  function s() {
    i = !1, a.clear(), o.value = Ne(e) === !0;
  }
  function u(c) {
    return c === null ? (s(), () => !1) : typeof c == "boolean" ? (s(), o.value = c, () => !1) : Array.isArray(c) || typeof c == "string" ? sv(c, a) : c;
  }
  return o;
}
const Xu = "vue-flow__node-desc", Wu = "vue-flow__edge-desc", uv = "vue-flow__aria-live", Ku = ["Enter", " ", "Escape"], dn = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function Ko(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function Zo(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function di(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Jt(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function Zu(e, t) {
  return {
    x: Jt(e.x, t[0][0], t[1][0]),
    y: Jt(e.y, t[0][1], t[1][1])
  };
}
function Es(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function zt(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function Wt(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !zt(e);
}
function Dn(e) {
  return Wt(e) && "computedPosition" in e;
}
function yo(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function cv(e) {
  return yo(e.width) && yo(e.height) && yo(e.x) && yo(e.y);
}
function dv(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: qt({
      width: 0,
      height: 0
    }),
    computedPosition: qt({
      z: 0,
      ...e.position
    }),
    // todo: shouldn't be defined initially, as we want to use handleBounds to check if a node was actually initialized or not
    handleBounds: {
      source: [],
      target: []
    },
    draggable: void 0,
    selectable: void 0,
    connectable: void 0,
    focusable: void 0,
    selected: !1,
    dragging: !1,
    resizing: !1,
    initialized: !1,
    isParent: !1,
    position: {
      x: 0,
      y: 0
    },
    data: Ve(e.data) ? e.data : {},
    events: qt(Ve(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function ju(e, t, n) {
  var o, i;
  const a = {
    id: e.id.toString(),
    type: e.type ?? t?.type ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e.targetHandle) == null ? void 0 : i.toString(),
    updatable: e.updatable ?? n?.updatable,
    selectable: e.selectable ?? n?.selectable,
    focusable: e.focusable ?? n?.focusable,
    data: Ve(e.data) ? e.data : {},
    events: qt(Ve(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? n?.interactionWidth,
    ...n ?? {}
  };
  return Object.assign(t ?? a, e, { id: e.id.toString() });
}
function Ju(e, t, n, o) {
  const i = typeof e == "string" ? e : e.id, a = /* @__PURE__ */ new Set(), r = o === "source" ? "target" : "source";
  for (const s of n)
    s[r] === i && a.add(s[o]);
  return t.filter((s) => a.has(s.id));
}
function fv(...e) {
  if (e.length === 3) {
    const [a, r, s] = e;
    return Ju(a, r, s, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((a) => zt(a) && a.source === o).map((a) => n.find((r) => Wt(r) && r.id === a.target));
}
function hv(...e) {
  if (e.length === 3) {
    const [a, r, s] = e;
    return Ju(a, r, s, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((a) => zt(a) && a.target === o).map((a) => n.find((r) => Wt(r) && r.id === a.source));
}
function Qu({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function pv(e, t) {
  return t.some(
    (n) => zt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function Xn({ x: e, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e * i + n,
    y: t * i + o
  };
}
function Wn({ x: e, y: t }, { x: n, y: o, zoom: i }, a = !1, r = [1, 1]) {
  const s = {
    x: (e - n) / i,
    y: (t - o) / i
  };
  return a ? fi(s, r) : s;
}
function ec(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function jo({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function tc({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function gv(e, t) {
  return tc(ec(jo(e), jo(t)));
}
function Ma(e) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    t = ec(
      t,
      jo({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return tc(t);
}
function nc(e, t, n = { x: 0, y: 0, zoom: 1 }, o = !1, i = !1) {
  const a = {
    ...Wn(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, r = [];
  for (const s of e) {
    const { dimensions: u, selectable: c = !0, hidden: l = !1 } = s, d = u.width ?? s.width ?? null, f = u.height ?? s.height ?? null;
    if (i && !c || l)
      continue;
    const h = Zo(a, Ko(s)), w = d === null || f === null, _ = o && h > 0, m = (d ?? 0) * (f ?? 0);
    (w || _ || h >= m || s.dragging) && r.push(s);
  }
  return r;
}
function Ht(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function rn(e, t) {
  if (typeof e == "number")
    return Math.floor((t - t / (1 + e)) * 0.5);
  if (typeof e == "string" && e.endsWith("px")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(n);
  }
  if (typeof e == "string" && e.endsWith("%")) {
    const n = Number.parseFloat(e);
    if (!Number.isNaN(n))
      return Math.floor(t * n * 0.01);
  }
  return io(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function vv(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = rn(e, n), i = rn(e, t);
    return {
      top: o,
      right: i,
      bottom: o,
      left: i,
      x: i * 2,
      y: o * 2
    };
  }
  if (typeof e == "object") {
    const o = rn(e.top ?? e.y ?? 0, n), i = rn(e.bottom ?? e.y ?? 0, n), a = rn(e.left ?? e.x ?? 0, t), r = rn(e.right ?? e.x ?? 0, t);
    return { top: o, right: r, bottom: i, left: a, x: a + r, y: o + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function mv(e, t, n, o, i, a) {
  const { x: r, y: s } = Xn(e, { x: t, y: n, zoom: o }), { x: u, y: c } = Xn(
    { x: e.x + e.width, y: e.y + e.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), l = i - u, d = a - c;
  return {
    left: Math.floor(r),
    top: Math.floor(s),
    right: Math.floor(l),
    bottom: Math.floor(d)
  };
}
function $s(e, t, n, o, i, a = 0.1) {
  const r = vv(a, t, n), s = (t - r.x) / e.width, u = (n - r.y) / e.height, c = Math.min(s, u), l = Jt(c, o, i), d = e.x + e.width / 2, f = e.y + e.height / 2, h = t / 2 - d * l, w = n / 2 - f * l, _ = mv(e, h, w, l, t, n), m = {
    left: Math.min(_.left - r.left, 0),
    top: Math.min(_.top - r.top, 0),
    right: Math.min(_.right - r.right, 0),
    bottom: Math.min(_.bottom - r.bottom, 0)
  };
  return {
    x: h - m.left + m.right,
    y: w - m.top + m.bottom,
    zoom: l
  };
}
function yv(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function oc(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t.get(e.parentNode);
  return n ? n.selected ? !0 : oc(n, t) : !1;
}
function Kn(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function ea(e) {
  const t = e.ctrlKey && Zn() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
}
function xs(e, t, n) {
  return e < t ? Jt(Math.abs(e - t), 1, t) / t : e > n ? -Jt(Math.abs(e - n), 1, t) / t : 0;
}
function ic(e, t, n = 15, o = 40) {
  const i = xs(e.x, o, t.width - o) * n, a = xs(e.y, o, t.height - o) * n;
  return [i, a];
}
function Li(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const a = Number(i.width.replace("px", ""));
          i.width = `${a + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const a = Number(i.height.replace("px", ""));
          i.height = `${a + o}px`;
        } else
          i.height += o;
      if (e.position.x < 0) {
        const a = Math.abs(e.position.x);
        if (t.position.x = t.position.x - a, typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + a}px`;
        } else
          i.width += a;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const a = Math.abs(e.position.y);
        if (t.position.y = t.position.y - a, typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + a}px`;
        } else
          i.height += a;
        e.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (a) => {
        const r = t.style;
        return {
          ...r(a),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function Ss(e, t) {
  var n, o;
  const i = e.filter((r) => r.type === "add" || r.type === "remove");
  for (const r of i)
    if (r.type === "add")
      t.findIndex((u) => u.id === r.item.id) === -1 && t.push(r.item);
    else if (r.type === "remove") {
      const s = t.findIndex((u) => u.id === r.id);
      s !== -1 && t.splice(s, 1);
    }
  const a = t.map((r) => r.id);
  for (const r of t)
    for (const s of e)
      if (s.id === r.id)
        switch (s.type) {
          case "select":
            r.selected = s.selected;
            break;
          case "position":
            if (Dn(r) && (typeof s.position < "u" && (r.position = s.position), typeof s.dragging < "u" && (r.dragging = s.dragging), r.expandParent && r.parentNode)) {
              const u = t[a.indexOf(r.parentNode)];
              u && Dn(u) && Li(r, u);
            }
            break;
          case "dimensions":
            if (Dn(r) && (typeof s.dimensions < "u" && (r.dimensions = s.dimensions), typeof s.updateStyle < "u" && s.updateStyle && (r.style = {
              ...r.style || {},
              width: `${(n = s.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = s.dimensions) == null ? void 0 : o.height}px`
            }), typeof s.resizing < "u" && (r.resizing = s.resizing), r.expandParent && r.parentNode)) {
              const u = t[a.indexOf(r.parentNode)];
              u && Dn(u) && (!!u.dimensions.width && !!u.dimensions.height ? Li(r, u) : We(() => {
                Li(r, u);
              }));
            }
            break;
        }
  return t;
}
function Tt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Ns(e) {
  return {
    item: e,
    type: "add"
  };
}
function Cs(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Ms(e, t, n, o, i) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function Dt(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [i, a] of e) {
    const r = t.has(i);
    !(a.selected === void 0 && !r) && a.selected !== r && (n && (a.selected = r), o.push(Tt(a.id, r)));
  }
  return o;
}
const Ts = () => {
};
function ce(e) {
  const t = /* @__PURE__ */ new Set();
  let n = Ts, o = () => !1;
  const i = () => t.size > 0 || o(), a = (f) => {
    n = f;
  }, r = () => {
    n = Ts;
  }, s = (f) => {
    o = f;
  }, u = () => {
    o = () => !1;
  }, c = (f) => {
    t.delete(f);
  };
  return {
    on: (f) => {
      t.add(f);
      const h = () => c(f);
      return Hn(h), { off: h };
    },
    off: c,
    trigger: (f) => {
      const h = [n];
      return i() ? h.push(...t) : e && h.push(e), Promise.allSettled(h.map((w) => w(f)));
    },
    hasListeners: i,
    listeners: t,
    setEmitter: a,
    removeEmitter: r,
    setHasEmitListeners: s,
    removeHasEmitListeners: u
  };
}
function Is(e, t, n) {
  let o = e;
  do {
    if (o && o.matches(t))
      return !0;
    if (o === n)
      return !1;
    o = o.parentElement;
  } while (o);
  return !1;
}
function wv(e, t, n, o) {
  var i, a;
  const r = /* @__PURE__ */ new Map();
  for (const [s, u] of e)
    (u.selected || u.id === o) && (!u.parentNode || !oc(u, e)) && (u.draggable || t && typeof u.draggable > "u") && e.get(s) && r.set(s, {
      id: u.id,
      position: u.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((i = u.computedPosition) == null ? void 0 : i.x) || 0,
        y: n.y - ((a = u.computedPosition) == null ? void 0 : a.y) || 0
      },
      from: { x: u.computedPosition.x, y: u.computedPosition.y },
      extent: u.extent,
      parentNode: u.parentNode,
      dimensions: { ...u.dimensions },
      expandParent: u.expandParent
    });
  return Array.from(r.values());
}
function Vi({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const i of t) {
    const a = n(i.id);
    a && o.push(a);
  }
  return [e ? o.find((i) => i.id === e) : o[0], o];
}
function rc(e) {
  if (Array.isArray(e))
    switch (e.length) {
      case 1:
        return [e[0], e[0], e[0], e[0]];
      case 2:
        return [e[0], e[1], e[0], e[1]];
      case 3:
        return [e[0], e[1], e[2], e[1]];
      case 4:
        return e;
      default:
        return [0, 0, 0, 0];
    }
  return [e, e, e, e];
}
function _v(e, t, n) {
  const [o, i, a, r] = typeof e != "string" ? rc(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + r, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - a
    ]
  ] : !1;
}
function bv(e, t, n, o) {
  let i = e.extent || n;
  if ((i === "parent" || !Array.isArray(i) && i?.range === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const a = _v(i, e, o);
      a && (i = a);
    } else
      t(new Ge(He.NODE_EXTENT_INVALID, e.id)), i = n;
  else if (Array.isArray(i)) {
    const a = o?.computedPosition.x || 0, r = o?.computedPosition.y || 0;
    i = [
      [i[0][0] + a, i[0][1] + r],
      [i[1][0] + a, i[1][1] + r]
    ];
  } else if (i !== "parent" && i?.range && Array.isArray(i.range)) {
    const [a, r, s, u] = rc(i.padding), c = o?.computedPosition.x || 0, l = o?.computedPosition.y || 0;
    i = [
      [i.range[0][0] + c + u, i.range[0][1] + l + a],
      [i.range[1][0] + c - r, i.range[1][1] + l - s]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function kv({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function Ta(e, t, n, o, i) {
  const a = kv(e.dimensions, bv(e, n, o, i)), r = Zu(t, a);
  return {
    position: {
      x: r.x - (i?.computedPosition.x || 0),
      y: r.y - (i?.computedPosition.y || 0)
    },
    computedPosition: r
  };
}
function vn(e, t, n = ue.Left, o = !1) {
  const i = (t?.x ?? 0) + e.computedPosition.x, a = (t?.y ?? 0) + e.computedPosition.y, { width: r, height: s } = t ?? Sv(e);
  if (o)
    return { x: i + r / 2, y: a + s / 2 };
  switch (t?.position ?? n) {
    case ue.Top:
      return { x: i + r / 2, y: a };
    case ue.Right:
      return { x: i + r, y: a + s / 2 };
    case ue.Bottom:
      return { x: i + r / 2, y: a + s };
    case ue.Left:
      return { x: i, y: a + s / 2 };
  }
}
function Ds(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Ev({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: a,
  width: r,
  height: s,
  viewport: u
}) {
  const c = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + i),
    y2: Math.max(e.y + o, t.y + a)
  };
  c.x === c.x2 && (c.x2 += 1), c.y === c.y2 && (c.y2 += 1);
  const l = jo({
    x: (0 - u.x) / u.zoom,
    y: (0 - u.y) / u.zoom,
    width: r / u.zoom,
    height: s / u.zoom
  }), d = Math.max(0, Math.min(l.x2, c.x2) - Math.max(l.x, c.x)), f = Math.max(0, Math.min(l.y2, c.y2) - Math.max(l.y, c.y));
  return Math.ceil(d * f) > 0;
}
function $v(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let i = o ? e.zIndex : 0;
  const a = t(e.source), r = t(e.target);
  return !a || !r ? 0 : (n && (i = o ? e.zIndex : Math.max(a.computedPosition.z || 0, r.computedPosition.z || 0)), i);
}
var He = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(He || {});
const As = {
  MISSING_STYLES: () => "It seems that you haven't loaded the necessary styles. Please import '@vue-flow/core/dist/style.css' to ensure that the graph is rendered correctly",
  MISSING_VIEWPORT_DIMENSIONS: () => "The Vue Flow parent container needs a width and a height to render the graph",
  NODE_INVALID: (e) => `Node is invalid
Node: ${e}`,
  NODE_NOT_FOUND: (e) => `Node not found
Node: ${e}`,
  NODE_MISSING_PARENT: (e, t) => `Node is missing a parent
Node: ${e}
Parent: ${t}`,
  NODE_TYPE_MISSING: (e) => `Node type is missing
Type: ${e}`,
  NODE_EXTENT_INVALID: (e) => `Only child nodes can use a parent extent
Node: ${e}`,
  EDGE_INVALID: (e) => `An edge needs a source and a target
Edge: ${e}`,
  EDGE_SOURCE_MISSING: (e, t) => `Edge source is missing
Edge: ${e} 
Source: ${t}`,
  EDGE_TARGET_MISSING: (e, t) => `Edge target is missing
Edge: ${e} 
Target: ${t}`,
  EDGE_TYPE_MISSING: (e) => `Edge type is missing
Type: ${e}`,
  EDGE_SOURCE_TARGET_SAME: (e, t, n) => `Edge source and target are the same
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_SOURCE_TARGET_MISSING: (e, t, n) => `Edge source or target is missing
Edge: ${e} 
Source: ${t} 
Target: ${n}`,
  EDGE_ORPHANED: (e) => `Edge was orphaned (suddenly missing source or target) and has been removed
Edge: ${e}`,
  EDGE_NOT_FOUND: (e) => `Edge not found
Edge: ${e}`,
  // deprecation errors
  USEVUEFLOW_OPTIONS: () => "The options parameter is deprecated and will be removed in the next major version. Please use the id parameter instead"
};
class Ge extends Error {
  constructor(t, ...n) {
    var o;
    super((o = As[t]) == null ? void 0 : o.call(As, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function Ia(e) {
  return "clientX" in e;
}
function xv(e) {
  return "sourceEvent" in e;
}
function dt(e, t) {
  const n = Ia(e);
  let o, i;
  return n ? (o = e.clientX, i = e.clientY) : "touches" in e && e.touches.length > 0 ? (o = e.touches[0].clientX, i = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (o = e.changedTouches[0].clientX, i = e.changedTouches[0].clientY) : (o = 0, i = 0), {
    x: o - (t?.left ?? 0),
    y: i - (t?.top ?? 0)
  };
}
const Zn = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator?.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Sv(e) {
  var t, n;
  return {
    width: ((t = e.dimensions) == null ? void 0 : t.width) ?? e.width ?? 0,
    height: ((n = e.dimensions) == null ? void 0 : n.height) ?? e.height ?? 0
  };
}
function fi(e, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e.x / t[0]),
    y: t[1] * Math.round(e.y / t[1])
  };
}
const Nv = () => !0;
function Hi(e) {
  e?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function Cv(e, t, n) {
  const o = [], i = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const a of t.values())
    Zo(i, Ko(a)) > 0 && o.push(a);
  return o;
}
const Mv = 250;
function Tv(e, t, n, o) {
  var i, a;
  let r = [], s = Number.POSITIVE_INFINITY;
  const u = Cv(e, n, t + Mv);
  for (const c of u) {
    const l = [...((i = c.handleBounds) == null ? void 0 : i.source) ?? [], ...((a = c.handleBounds) == null ? void 0 : a.target) ?? []];
    for (const d of l) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: f, y: h } = vn(c, d, d.position, !0), w = Math.sqrt((f - e.x) ** 2 + (h - e.y) ** 2);
      w > t || (w < s ? (r = [{ ...d, x: f, y: h }], s = w) : w === s && r.push({ ...d, x: f, y: h }));
    }
  }
  if (!r.length)
    return null;
  if (r.length > 1) {
    const c = o.type === "source" ? "target" : "source";
    return r.find((l) => l.type === c) ?? r[0];
  }
  return r[0];
}
function Os(e, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: i,
  fromType: a,
  doc: r,
  lib: s,
  flowId: u,
  isValidConnection: c = Nv
}, l, d, f, h) {
  const w = a === "target", _ = t ? r.querySelector(`.${s}-flow__handle[data-id="${u}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: m, y: p } = dt(e), v = r.elementFromPoint(m, p), g = v?.classList.contains(`${s}-flow__handle`) ? v : _, b = {
    handleDomNode: g,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (g) {
    const O = ac(void 0, g), F = g.getAttribute("data-nodeid"), K = g.getAttribute("data-handleid"), N = g.classList.contains("connectable"), C = g.classList.contains("connectableend");
    if (!F || !O)
      return b;
    const M = {
      source: w ? F : o,
      sourceHandle: w ? K : i,
      target: w ? o : F,
      targetHandle: w ? i : K
    };
    b.connection = M;
    const S = N && C && (n === Rt.Strict ? w && O === "source" || !w && O === "target" : F !== o || K !== i);
    b.isValid = S && c(M, {
      nodes: d,
      edges: l,
      sourceNode: f(M.source),
      targetNode: f(M.target)
    }), b.toHandle = sc(F, O, K, h, n, !0);
  }
  return b;
}
function ac(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Iv(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Dv(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
function sc(e, t, n, o, i, a = !1) {
  var r, s, u;
  const c = o.get(e);
  if (!c)
    return null;
  const l = i === Rt.Strict ? (r = c.handleBounds) == null ? void 0 : r[t] : [...((s = c.handleBounds) == null ? void 0 : s.source) ?? [], ...((u = c.handleBounds) == null ? void 0 : u.target) ?? []], d = (n ? l?.find((f) => f.id === n) : l?.[0]) ?? null;
  return d && a ? { ...d, ...vn(c, d, d.position, !0) } : d;
}
const ta = {
  [ue.Left]: ue.Right,
  [ue.Right]: ue.Left,
  [ue.Top]: ue.Bottom,
  [ue.Bottom]: ue.Top
}, Av = ["production", "prod"];
function io(e, ...t) {
  lc() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function lc() {
  return !Av.includes("production");
}
function Ps(e, t, n, o, i) {
  const a = t.querySelectorAll(`.vue-flow__handle.${e}`);
  return a?.length ? Array.from(a).map((r) => {
    const s = r.getBoundingClientRect();
    return {
      id: r.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: r.getAttribute("data-handlepos"),
      x: (s.left - n.left) / o,
      y: (s.top - n.top) / o,
      ...di(r)
    };
  }) : null;
}
function na(e, t, n, o, i, a = !1, r) {
  i.value = !1, e.selected ? (a || e.selected && t) && (o([e]), We(() => {
    r.blur();
  })) : n([e]);
}
function Ve(e) {
  return typeof oe(e) < "u";
}
function Ov(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Ge(He.EDGE_INVALID, e?.id ?? "[ID UNKNOWN]")), !1;
  let i;
  return zt(e) ? i = e : i = {
    ...e,
    id: Qu(e)
  }, i = ju(i, void 0, o), pv(i, t) ? !1 : i;
}
function Pv(e, t, n, o, i) {
  if (!t.source || !t.target)
    return i(new Ge(He.EDGE_INVALID, e.id)), !1;
  if (!n)
    return i(new Ge(He.EDGE_NOT_FOUND, e.id)), !1;
  const { id: a, ...r } = e;
  return {
    ...r,
    id: o ? Qu(t) : a,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function Rs(e, t, n) {
  const o = {}, i = [];
  for (let a = 0; a < e.length; ++a) {
    const r = e[a];
    if (!Wt(r)) {
      n(
        new Ge(He.NODE_INVALID, r?.id) || `[ID UNKNOWN|INDEX ${a}]`
      );
      continue;
    }
    const s = dv(r, t(r.id), r.parentNode);
    r.parentNode && (o[r.parentNode] = !0), i[a] = s;
  }
  for (const a of i) {
    const r = t(a.parentNode) || i.find((s) => s.id === a.parentNode);
    a.parentNode && !r && n(new Ge(He.NODE_MISSING_PARENT, a.id, a.parentNode)), (a.parentNode || o[a.id]) && (o[a.id] && (a.isParent = !0), r && (r.isParent = !0));
  }
  return i;
}
function zs(e, t, n, o, i, a) {
  let r = i;
  const s = o.get(r) || /* @__PURE__ */ new Map();
  o.set(r, s.set(n, t)), r = `${i}-${e}`;
  const u = o.get(r) || /* @__PURE__ */ new Map();
  if (o.set(r, u.set(n, t)), a) {
    r = `${i}-${e}-${a}`;
    const c = o.get(r) || /* @__PURE__ */ new Map();
    o.set(r, c.set(n, t));
  }
}
function Fi(e, t, n) {
  e.clear();
  for (const o of n) {
    const { source: i, target: a, sourceHandle: r = null, targetHandle: s = null } = o, u = { edgeId: o.id, source: i, target: a, sourceHandle: r, targetHandle: s }, c = `${i}-${r}--${a}-${s}`, l = `${a}-${s}--${i}-${r}`;
    zs("source", u, l, e, i, r), zs("target", u, c, e, a, s);
  }
}
function Bs(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Gi(e, t, n, o, i, a, r, s) {
  const u = [];
  for (const c of e) {
    const l = zt(c) ? c : Ov(c, s, i, a);
    if (!l)
      continue;
    const d = n(l.source), f = n(l.target);
    if (!d || !f) {
      i(new Ge(He.EDGE_SOURCE_TARGET_MISSING, l.id, l.source, l.target));
      continue;
    }
    if (!d) {
      i(new Ge(He.EDGE_SOURCE_MISSING, l.id, l.source));
      continue;
    }
    if (!f) {
      i(new Ge(He.EDGE_TARGET_MISSING, l.id, l.target));
      continue;
    }
    if (t && !t(l, {
      edges: s,
      nodes: r,
      sourceNode: d,
      targetNode: f
    })) {
      i(new Ge(He.EDGE_INVALID, l.id));
      continue;
    }
    const h = o(l.id);
    u.push({
      ...ju(l, h, a),
      sourceNode: d,
      targetNode: f
    });
  }
  return u;
}
const Ls = Symbol("vueFlow"), uc = Symbol("nodeId"), cc = Symbol("nodeRef"), Rv = Symbol("edgeId"), zv = Symbol("edgeRef"), hi = Symbol("slots");
function dc(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodeLookup: a,
    nodeExtent: r,
    nodeDragThreshold: s,
    viewport: u,
    autoPanOnNodeDrag: c,
    autoPanSpeed: l,
    nodesDraggable: d,
    panBy: f,
    findNode: h,
    multiSelectionActive: w,
    nodesSelectionActive: _,
    selectNodesOnDrag: m,
    removeSelectedElements: p,
    addSelectedNodes: v,
    updateNodePositions: g,
    emits: b
  } = Pe(), { onStart: O, onDrag: F, onStop: K, onClick: N, el: C, disabled: M, id: B, selectable: S, dragHandle: Q } = e, y = bt(!1);
  let P = [], $, X = null, U = { x: void 0, y: void 0 }, z = { x: 0, y: 0 }, E = null, L = !1, te = !1, H = 0, q = !1;
  const Y = Vv(), j = ({ x: ie, y: se }) => {
    U = { x: ie, y: se };
    let D = !1;
    if (P = P.map((T) => {
      const R = { x: ie - T.distance.x, y: se - T.distance.y }, { computedPosition: Z } = Ta(
        T,
        n.value ? fi(R, o.value) : R,
        b.error,
        r.value,
        T.parentNode ? h(T.parentNode) : void 0
      );
      return D = D || T.position.x !== Z.x || T.position.y !== Z.y, T.position = Z, T;
    }), te = te || D, !!D && (g(P, !0, !0), y.value = !0, E)) {
      const [T, R] = Vi({
        id: B,
        dragItems: P,
        findNode: h
      });
      F({ event: E, node: T, nodes: R });
    }
  }, ee = () => {
    if (!X)
      return;
    const [ie, se] = ic(z, X, l.value);
    if (ie !== 0 || se !== 0) {
      const D = {
        x: (U.x ?? 0) - ie / u.value.zoom,
        y: (U.y ?? 0) - se / u.value.zoom
      };
      f({ x: ie, y: se }) && j(D);
    }
    H = requestAnimationFrame(ee);
  }, ae = (ie, se) => {
    L = !0;
    const D = h(B);
    !m.value && !w.value && D && (D.selected || p()), D && Ne(S) && m.value && na(
      D,
      w.value,
      v,
      p,
      _,
      !1,
      se
    );
    const T = Y(ie.sourceEvent);
    if (U = T, P = wv(a.value, d.value, T, B), P.length) {
      const [R, Z] = Vi({
        id: B,
        dragItems: P,
        findNode: h
      });
      O({ event: ie.sourceEvent, node: R, nodes: Z });
    }
  }, me = (ie, se) => {
    var D;
    ie.sourceEvent.type === "touchmove" && ie.sourceEvent.touches.length > 1 || (te = !1, s.value === 0 && ae(ie, se), U = Y(ie.sourceEvent), X = ((D = t.value) == null ? void 0 : D.getBoundingClientRect()) || null, z = dt(ie.sourceEvent, X));
  }, ge = (ie, se) => {
    const D = Y(ie.sourceEvent);
    if (!q && L && c.value && (q = !0, ee()), !L) {
      const T = D.xSnapped - (U.x ?? 0), R = D.ySnapped - (U.y ?? 0);
      Math.sqrt(T * T + R * R) > s.value && ae(ie, se);
    }
    (U.x !== D.xSnapped || U.y !== D.ySnapped) && P.length && L && (E = ie.sourceEvent, z = dt(ie.sourceEvent, X), j(D));
  }, be = (ie) => {
    let se = !1;
    if (!L && !y.value && !w.value) {
      const D = ie.sourceEvent, T = Y(D), R = T.xSnapped - (U.x ?? 0), Z = T.ySnapped - (U.y ?? 0), W = Math.sqrt(R * R + Z * Z);
      W !== 0 && W <= s.value && (N?.(D), se = !0);
    }
    if (P.length && !se) {
      te && (g(P, !1, !1), te = !1);
      const [D, T] = Vi({
        id: B,
        dragItems: P,
        findNode: h
      });
      K({ event: ie.sourceEvent, node: D, nodes: T });
    }
    P = [], y.value = !1, q = !1, L = !1, U = { x: void 0, y: void 0 }, cancelAnimationFrame(H);
  };
  return Ee([() => Ne(M), C], ([ie, se], D, T) => {
    if (se) {
      const R = Qe(se);
      ie || ($ = cp().on("start", (Z) => me(Z, se)).on("drag", (Z) => ge(Z, se)).on("end", (Z) => be(Z)).filter((Z) => {
        const W = Z.target, re = Ne(Q);
        return !Z.button && (!i.value || !Is(W, `.${i.value}`, se) && (!re || Is(W, re, se)));
      }), R.call($)), T(() => {
        R.on(".drag", null), $ && ($.on("start", null), $.on("drag", null), $.on("end", null));
      });
    }
  }), y;
}
function Bv() {
  return {
    doubleClick: ce(),
    click: ce(),
    mouseEnter: ce(),
    mouseMove: ce(),
    mouseLeave: ce(),
    contextMenu: ce(),
    updateStart: ce(),
    update: ce(),
    updateEnd: ce()
  };
}
function Lv(e, t) {
  const n = Bv();
  return n.doubleClick.on((o) => {
    var i, a;
    t.edgeDoubleClick(o), (a = (i = e.events) == null ? void 0 : i.doubleClick) == null || a.call(i, o);
  }), n.click.on((o) => {
    var i, a;
    t.edgeClick(o), (a = (i = e.events) == null ? void 0 : i.click) == null || a.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, a;
    t.edgeMouseEnter(o), (a = (i = e.events) == null ? void 0 : i.mouseEnter) == null || a.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, a;
    t.edgeMouseMove(o), (a = (i = e.events) == null ? void 0 : i.mouseMove) == null || a.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, a;
    t.edgeMouseLeave(o), (a = (i = e.events) == null ? void 0 : i.mouseLeave) == null || a.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, a;
    t.edgeContextMenu(o), (a = (i = e.events) == null ? void 0 : i.contextMenu) == null || a.call(i, o);
  }), n.updateStart.on((o) => {
    var i, a;
    t.edgeUpdateStart(o), (a = (i = e.events) == null ? void 0 : i.updateStart) == null || a.call(i, o);
  }), n.update.on((o) => {
    var i, a;
    t.edgeUpdate(o), (a = (i = e.events) == null ? void 0 : i.update) == null || a.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, a;
    t.edgeUpdateEnd(o), (a = (i = e.events) == null ? void 0 : i.updateEnd) == null || a.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, a]) => (o.emit[i] = a.trigger, o.on[i] = a.on, o),
    { emit: {}, on: {} }
  );
}
function Vv() {
  const { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: o } = Pe();
  return (i) => {
    var a;
    const r = ((a = o.value) == null ? void 0 : a.getBoundingClientRect()) ?? { left: 0, top: 0 }, s = xv(i) ? i.sourceEvent : i, { x: u, y: c } = dt(s, r), l = Wn({ x: u, y: c }, e.value), { x: d, y: f } = n.value ? fi(l, t.value) : l;
    return {
      xSnapped: d,
      ySnapped: f,
      ...l
    };
  };
}
function wo() {
  return !0;
}
function fc({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: a,
  onEdgeUpdateEnd: r
}) {
  const {
    id: s,
    vueFlowRef: u,
    connectionMode: c,
    connectionRadius: l,
    connectOnClick: d,
    connectionClickStartHandle: f,
    nodesConnectable: h,
    autoPanOnConnect: w,
    autoPanSpeed: _,
    findNode: m,
    panBy: p,
    startConnection: v,
    updateConnection: g,
    endConnection: b,
    emits: O,
    viewport: F,
    edges: K,
    nodes: N,
    isValidConnection: C,
    nodeLookup: M
  } = Pe();
  let B = null, S = !1, Q = null;
  function y($) {
    var X;
    const U = Ne(n) === "target", z = Ia($), E = Es($.target), L = $.currentTarget;
    if (L && (z && $.button === 0 || !z)) {
      let te = function(pe) {
        D = dt(pe, be), j = Tv(
          Wn(D, F.value, !1, [1, 1]),
          l.value,
          M.value,
          Z
        ), T || (R(), T = !0);
        const we = Os(
          pe,
          {
            handle: j,
            connectionMode: c.value,
            fromNodeId: Ne(t),
            fromHandleId: Ne(e),
            fromType: U ? "target" : "source",
            isValidConnection: Y,
            doc: E,
            lib: "vue",
            flowId: s,
            nodeLookup: M.value
          },
          K.value,
          N.value,
          m,
          M.value
        );
        Q = we.handleDomNode, B = we.connection, S = Dv(!!j, we.isValid);
        const $e = {
          // from stays the same
          ...ve,
          isValid: S,
          to: we.toHandle && S ? Xn({ x: we.toHandle.x, y: we.toHandle.y }, F.value) : D,
          toHandle: we.toHandle,
          toPosition: S && we.toHandle ? we.toHandle.position : ta[Z.position],
          toNode: we.toHandle ? M.value.get(we.toHandle.nodeId) : null
        };
        if (S && j && ve?.toHandle && $e.toHandle && ve.toHandle.type === $e.toHandle.type && ve.toHandle.nodeId === $e.toHandle.nodeId && ve.toHandle.id === $e.toHandle.id && ve.to.x === $e.to.x && ve.to.y === $e.to.y)
          return;
        const Ce = j ?? we.toHandle;
        if (g(
          Ce && S ? Xn(
            {
              x: Ce.x,
              y: Ce.y
            },
            F.value
          ) : D,
          Ce,
          Iv(!!Ce, S)
        ), ve = $e, !j && !S && !Q)
          return Hi(se);
        B && B.source !== B.target && Q && (Hi(se), se = Q, Q.classList.add("connecting", "vue-flow__handle-connecting"), Q.classList.toggle("valid", !!S), Q.classList.toggle("vue-flow__handle-valid", !!S));
      }, H = function(pe) {
        "touches" in pe && pe.touches.length > 0 || ((j || Q) && B && S && (a ? a(pe, B) : O.connect(B)), O.connectEnd(pe), i && r?.(pe), Hi(se), cancelAnimationFrame(ee), b(pe), T = !1, S = !1, B = null, Q = null, E.removeEventListener("mousemove", te), E.removeEventListener("mouseup", H), E.removeEventListener("touchmove", te), E.removeEventListener("touchend", H));
      };
      const q = m(Ne(t));
      let Y = Ne(o) || C.value || wo;
      !Y && q && (Y = (U ? q.isValidSourcePos : q.isValidTargetPos) || wo);
      let j, ee = 0;
      const { x: ae, y: me } = dt($), ge = ac(Ne(i), L), be = (X = u.value) == null ? void 0 : X.getBoundingClientRect();
      if (!be || !ge)
        return;
      const ie = sc(Ne(t), ge, Ne(e), M.value, c.value);
      if (!ie)
        return;
      let se, D = dt($, be), T = !1;
      const R = () => {
        if (!w.value)
          return;
        const [pe, we] = ic(D, be, _.value);
        p({ x: pe, y: we }), ee = requestAnimationFrame(R);
      }, Z = {
        ...ie,
        nodeId: Ne(t),
        type: ge,
        position: ie.position
      }, W = M.value.get(Ne(t)), le = {
        inProgress: !0,
        isValid: null,
        from: vn(W, Z, ue.Left, !0),
        fromHandle: Z,
        fromPosition: Z.position,
        fromNode: W,
        to: D,
        toHandle: null,
        toPosition: ta[Z.position],
        toNode: null
      };
      v(
        {
          nodeId: Ne(t),
          id: Ne(e),
          type: ge,
          position: L?.getAttribute("data-handlepos") || ue.Top,
          ...D
        },
        {
          x: ae - be.left,
          y: me - be.top
        }
      ), O.connectStart({ event: $, nodeId: Ne(t), handleId: Ne(e), handleType: ge });
      let ve = le;
      E.addEventListener("mousemove", te), E.addEventListener("mouseup", H), E.addEventListener("touchmove", te), E.addEventListener("touchend", H);
    }
  }
  function P($) {
    var X, U;
    if (!d.value)
      return;
    const z = Ne(n) === "target";
    if (!f.value) {
      O.clickConnectStart({ event: $, nodeId: Ne(t), handleId: Ne(e) }), v(
        {
          nodeId: Ne(t),
          type: Ne(n),
          id: Ne(e),
          position: ue.Top,
          ...dt($)
        },
        void 0,
        !0
      );
      return;
    }
    let E = Ne(o) || C.value || wo;
    const L = m(Ne(t));
    if (!E && L && (E = (z ? L.isValidSourcePos : L.isValidTargetPos) || wo), L && (typeof L.connectable > "u" ? h.value : L.connectable) === !1)
      return;
    const te = Es($.target), H = Os(
      $,
      {
        handle: {
          nodeId: Ne(t),
          id: Ne(e),
          type: Ne(n),
          position: ue.Top,
          ...dt($)
        },
        connectionMode: c.value,
        fromNodeId: f.value.nodeId,
        fromHandleId: f.value.id ?? null,
        fromType: f.value.type,
        isValidConnection: E,
        doc: te,
        lib: "vue",
        flowId: s,
        nodeLookup: M.value
      },
      K.value,
      N.value,
      m,
      M.value
    ), q = ((X = H.connection) == null ? void 0 : X.source) === ((U = H.connection) == null ? void 0 : U.target);
    H.isValid && H.connection && !q && O.connect(H.connection), O.clickConnectEnd($), b($, !0);
  }
  return {
    handlePointerDown: y,
    handleClick: P
  };
}
function Hv() {
  return xt(uc, "");
}
function hc(e) {
  const t = e ?? Hv() ?? "", n = xt(cc, fe(null)), { findNode: o, edges: i, emits: a } = Pe(), r = o(t);
  return r || a.error(new Ge(He.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: r,
    parentNode: ne(() => o(r.parentNode)),
    connectedEdges: ne(() => Ht([r], i.value))
  };
}
function Fv() {
  return {
    doubleClick: ce(),
    click: ce(),
    mouseEnter: ce(),
    mouseMove: ce(),
    mouseLeave: ce(),
    contextMenu: ce(),
    dragStart: ce(),
    drag: ce(),
    dragStop: ce()
  };
}
function Gv(e, t) {
  const n = Fv();
  return n.doubleClick.on((o) => {
    var i, a;
    t.nodeDoubleClick(o), (a = (i = e.events) == null ? void 0 : i.doubleClick) == null || a.call(i, o);
  }), n.click.on((o) => {
    var i, a;
    t.nodeClick(o), (a = (i = e.events) == null ? void 0 : i.click) == null || a.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, a;
    t.nodeMouseEnter(o), (a = (i = e.events) == null ? void 0 : i.mouseEnter) == null || a.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, a;
    t.nodeMouseMove(o), (a = (i = e.events) == null ? void 0 : i.mouseMove) == null || a.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, a;
    t.nodeMouseLeave(o), (a = (i = e.events) == null ? void 0 : i.mouseLeave) == null || a.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, a;
    t.nodeContextMenu(o), (a = (i = e.events) == null ? void 0 : i.contextMenu) == null || a.call(i, o);
  }), n.dragStart.on((o) => {
    var i, a;
    t.nodeDragStart(o), (a = (i = e.events) == null ? void 0 : i.dragStart) == null || a.call(i, o);
  }), n.drag.on((o) => {
    var i, a;
    t.nodeDrag(o), (a = (i = e.events) == null ? void 0 : i.drag) == null || a.call(i, o);
  }), n.dragStop.on((o) => {
    var i, a;
    t.nodeDragStop(o), (a = (i = e.events) == null ? void 0 : i.dragStop) == null || a.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, a]) => (o.emit[i] = a.trigger, o.on[i] = a.on, o),
    { emit: {}, on: {} }
  );
}
function pc() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: a, nodesDraggable: r, emits: s } = Pe();
  return (u, c = !1) => {
    const l = a.value ? i.value[0] : 5, d = a.value ? i.value[1] : 5, f = c ? 4 : 1, h = u.x * l * f, w = u.y * d * f, _ = [];
    for (const m of e.value)
      if (m.draggable || r && typeof m.draggable > "u") {
        const p = { x: m.computedPosition.x + h, y: m.computedPosition.y + w }, { position: v } = Ta(
          m,
          p,
          s.error,
          t.value,
          m.parentNode ? o(m.parentNode) : void 0
        );
        _.push({
          id: m.id,
          position: v,
          from: m.position,
          distance: { x: u.x, y: u.y },
          dimensions: m.dimensions
        });
      }
    n(_, !0, !1);
  };
}
const _o = 0.1, Yv = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function Mt() {
  return io("Viewport not initialized yet."), Promise.resolve(!1);
}
const Uv = {
  zoomIn: Mt,
  zoomOut: Mt,
  zoomTo: Mt,
  fitView: Mt,
  setCenter: Mt,
  fitBounds: Mt,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: Mt,
  setTransform: Mt,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function qv(e) {
  function t(o, i) {
    return new Promise((a) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(i?.interpolate === "linear" ? Rn : Do).scaleBy(
        Yi(e.d3Selection, i?.duration, i?.ease, () => {
          a(!0);
        }),
        o
      ) : a(!1);
    });
  }
  function n(o, i, a, r) {
    return new Promise((s) => {
      var u;
      const { x: c, y: l } = Zu({ x: -o, y: -i }, e.translateExtent), d = gn.translate(-c, -l).scale(a);
      e.d3Selection && e.d3Zoom ? (u = e.d3Zoom) == null || u.interpolate(r?.interpolate === "linear" ? Rn : Do).transform(
        Yi(e.d3Selection, r?.duration, r?.ease, () => {
          s(!0);
        }),
        d
      ) : s(!1);
    });
  }
  return ne(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i),
    zoomOut: (i) => t(1 / 1.2, i),
    zoomTo: (i, a) => new Promise((r) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(a?.interpolate === "linear" ? Rn : Do).scaleTo(
        Yi(e.d3Selection, a?.duration, a?.ease, () => {
          r(!0);
        }),
        i
      ) : r(!1);
    }),
    setViewport: (i, a) => n(i.x, i.y, i.zoom, a),
    setTransform: (i, a) => n(i.x, i.y, i.zoom, a),
    getViewport: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    getTransform: () => ({
      x: e.viewport.x,
      y: e.viewport.y,
      zoom: e.viewport.zoom
    }),
    fitView: (i = {
      padding: _o,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var a, r;
      const s = [];
      for (const f of e.nodes)
        f.dimensions.width && f.dimensions.height && (i?.includeHiddenNodes || !f.hidden) && (!((a = i.nodes) != null && a.length) || (r = i.nodes) != null && r.length && i.nodes.includes(f.id)) && s.push(f);
      if (!s.length)
        return Promise.resolve(!1);
      const u = Ma(s), { x: c, y: l, zoom: d } = $s(
        u,
        e.dimensions.width,
        e.dimensions.height,
        i.minZoom ?? e.minZoom,
        i.maxZoom ?? e.maxZoom,
        i.padding ?? _o
      );
      return n(c, l, d, i);
    },
    setCenter: (i, a, r) => {
      const s = typeof r?.zoom < "u" ? r.zoom : e.maxZoom, u = e.dimensions.width / 2 - i * s, c = e.dimensions.height / 2 - a * s;
      return n(u, c, s, r);
    },
    fitBounds: (i, a = { padding: _o }) => {
      const { x: r, y: s, zoom: u } = $s(
        i,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        a.padding ?? _o
      );
      return n(r, s, u, a);
    },
    project: (i) => Wn(i, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: a, y: r } = e.vueFlowRef.getBoundingClientRect(), s = {
          x: i.x - a,
          y: i.y - r
        };
        return Wn(s, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: a, y: r } = e.vueFlowRef.getBoundingClientRect(), s = {
          x: i.x + a,
          y: i.y + r
        };
        return Xn(s, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : Uv);
}
function Yi(e, t = 0, n = Yv, o = () => {
}) {
  const i = typeof t == "number" && t > 0;
  return i || o(), i ? e.transition().duration(t).ease(n).on("end", o) : e;
}
function Xv(e, t, n) {
  const o = hu(!0);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let _, m, p = !!(n.nodes.value.length || n.edges.value.length);
        _ = on([e.modelValue, () => {
          var v, g;
          return (g = (v = e.modelValue) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setElements(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = on(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([v, g]) => {
            var b;
            (b = e.modelValue) != null && b.value && Array.isArray(e.modelValue.value) && (_?.pause(), e.modelValue.value = [...v, ...g], We(() => {
              _?.resume();
            }));
          },
          { immediate: p }
        ), Mo(() => {
          _?.stop(), m?.stop();
        });
      });
    }, a = () => {
      o.run(() => {
        let _, m, p = !!n.nodes.value.length;
        _ = on([e.nodes, () => {
          var v, g;
          return (g = (v = e.nodes) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setNodes(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = on(
          [n.nodes, () => n.nodes.value.length],
          ([v]) => {
            var g;
            (g = e.nodes) != null && g.value && Array.isArray(e.nodes.value) && (_?.pause(), e.nodes.value = [...v], We(() => {
              _?.resume();
            }));
          },
          { immediate: p }
        ), Mo(() => {
          _?.stop(), m?.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let _, m, p = !!n.edges.value.length;
        _ = on([e.edges, () => {
          var v, g;
          return (g = (v = e.edges) == null ? void 0 : v.value) == null ? void 0 : g.length;
        }], ([v]) => {
          v && Array.isArray(v) && (m?.pause(), n.setEdges(v), !m && !p && v.length ? p = !0 : m?.resume());
        }), m = on(
          [n.edges, () => n.edges.value.length],
          ([v]) => {
            var g;
            (g = e.edges) != null && g.value && Array.isArray(e.edges.value) && (_?.pause(), e.edges.value = [...v], We(() => {
              _?.resume();
            }));
          },
          { immediate: p }
        ), Mo(() => {
          _?.stop(), m?.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        Ee(
          () => t.maxZoom,
          () => {
            t.maxZoom && Ve(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, u = () => {
      o.run(() => {
        Ee(
          () => t.minZoom,
          () => {
            t.minZoom && Ve(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, c = () => {
      o.run(() => {
        Ee(
          () => t.translateExtent,
          () => {
            t.translateExtent && Ve(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, l = () => {
      o.run(() => {
        Ee(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && Ve(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        Ee(
          () => t.applyDefault,
          () => {
            Ve(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, f = () => {
      o.run(() => {
        const _ = async (m) => {
          let p = m;
          typeof t.autoConnect == "function" && (p = await t.autoConnect(m)), p !== !1 && n.addEdges([p]);
        };
        Ee(
          () => t.autoConnect,
          () => {
            Ve(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), Ee(
          n.autoConnect,
          (m, p, v) => {
            m ? n.onConnect(_) : n.hooks.value.connect.off(_), v(() => {
              n.hooks.value.connect.off(_);
            });
          },
          { immediate: !0 }
        );
      });
    }, h = () => {
      const _ = [
        "id",
        "modelValue",
        "translateExtent",
        "nodeExtent",
        "edges",
        "nodes",
        "maxZoom",
        "minZoom",
        "applyDefault",
        "autoConnect"
      ];
      for (const m of Object.keys(t)) {
        const p = m;
        if (!_.includes(p)) {
          const v = Te(() => t[p]), g = n[p];
          wa(g) && o.run(() => {
            Ee(
              v,
              (b) => {
                Ve(b) && (g.value = b);
              },
              { immediate: !0 }
            );
          });
        }
      }
    };
    (() => {
      i(), a(), r(), u(), s(), c(), l(), d(), f(), h();
    })();
  }), () => o.stop();
}
function Wv() {
  return {
    edgesChange: ce(),
    nodesChange: ce(),
    nodeDoubleClick: ce(),
    nodeClick: ce(),
    nodeMouseEnter: ce(),
    nodeMouseMove: ce(),
    nodeMouseLeave: ce(),
    nodeContextMenu: ce(),
    nodeDragStart: ce(),
    nodeDrag: ce(),
    nodeDragStop: ce(),
    nodesInitialized: ce(),
    miniMapNodeClick: ce(),
    miniMapNodeDoubleClick: ce(),
    miniMapNodeMouseEnter: ce(),
    miniMapNodeMouseMove: ce(),
    miniMapNodeMouseLeave: ce(),
    connect: ce(),
    connectStart: ce(),
    connectEnd: ce(),
    clickConnectStart: ce(),
    clickConnectEnd: ce(),
    paneReady: ce(),
    init: ce(),
    move: ce(),
    moveStart: ce(),
    moveEnd: ce(),
    selectionDragStart: ce(),
    selectionDrag: ce(),
    selectionDragStop: ce(),
    selectionContextMenu: ce(),
    selectionStart: ce(),
    selectionEnd: ce(),
    viewportChangeStart: ce(),
    viewportChange: ce(),
    viewportChangeEnd: ce(),
    paneScroll: ce(),
    paneClick: ce(),
    paneContextMenu: ce(),
    paneMouseEnter: ce(),
    paneMouseMove: ce(),
    paneMouseLeave: ce(),
    edgeContextMenu: ce(),
    edgeMouseEnter: ce(),
    edgeMouseMove: ce(),
    edgeMouseLeave: ce(),
    edgeDoubleClick: ce(),
    edgeClick: ce(),
    edgeUpdateStart: ce(),
    edgeUpdate: ce(),
    edgeUpdateEnd: ce(),
    updateNodeInternals: ce(),
    error: ce((e) => io(e.message))
  };
}
function Kv(e, t) {
  const n = wn();
  Qd(() => {
    for (const [i, a] of Object.entries(t.value)) {
      const r = (s) => {
        e(i, s);
      };
      a.setEmitter(r), Hn(a.removeEmitter), a.setHasEmitListeners(() => o(i)), Hn(a.removeHasEmitListeners);
    }
  });
  function o(i) {
    var a;
    const r = Zv(i);
    return !!((a = n?.vnode.props) == null ? void 0 : a[r]);
  }
}
function Zv(e) {
  const [t, ...n] = e.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (i, a) => a.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function gc() {
  return {
    vueFlowRef: null,
    viewportRef: null,
    nodes: [],
    edges: [],
    connectionLookup: /* @__PURE__ */ new Map(),
    nodeTypes: {},
    edgeTypes: {},
    initialized: !1,
    dimensions: {
      width: 0,
      height: 0
    },
    viewport: { x: 0, y: 0, zoom: 1 },
    d3Zoom: null,
    d3Selection: null,
    d3ZoomHandler: null,
    minZoom: 0.5,
    maxZoom: 2,
    translateExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    nodeExtent: [
      [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
      [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
    ],
    selectionMode: Ca.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: zn.Free,
    paneClickDistance: 0,
    panOnDrag: !0,
    edgeUpdaterRadius: 10,
    onlyRenderVisibleElements: !1,
    defaultViewport: { x: 0, y: 0, zoom: 1 },
    nodesSelectionActive: !1,
    userSelectionActive: !1,
    userSelectionRect: null,
    defaultMarkerColor: "#b1b1b7",
    connectionLineStyle: {},
    connectionLineType: null,
    connectionLineOptions: {
      type: Vt.Bezier,
      style: {}
    },
    connectionMode: Rt.Loose,
    connectionStartHandle: null,
    connectionEndHandle: null,
    connectionClickStartHandle: null,
    connectionPosition: { x: Number.NaN, y: Number.NaN },
    connectionRadius: 20,
    connectOnClick: !0,
    connectionStatus: null,
    isValidConnection: null,
    snapGrid: [15, 15],
    snapToGrid: !1,
    edgesUpdatable: !1,
    edgesFocusable: !0,
    nodesFocusable: !0,
    nodesConnectable: !0,
    nodesDraggable: !0,
    nodeDragThreshold: 1,
    elementsSelectable: !0,
    selectNodesOnDrag: !0,
    multiSelectionActive: !1,
    selectionKeyCode: "Shift",
    multiSelectionKeyCode: Zn() ? "Meta" : "Control",
    zoomActivationKeyCode: Zn() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: Wv(),
    applyDefault: !0,
    autoConnect: !1,
    fitViewOnInit: !1,
    fitViewOnInitDone: !1,
    noDragClassName: "nodrag",
    noWheelClassName: "nowheel",
    noPanClassName: "nopan",
    defaultEdgeOptions: void 0,
    elevateEdgesOnSelect: !1,
    elevateNodesOnSelect: !0,
    autoPanOnNodeDrag: !0,
    autoPanOnConnect: !0,
    autoPanSpeed: 15,
    disableKeyboardA11y: !1,
    ariaLiveMessage: ""
  };
}
const jv = [
  "id",
  "vueFlowRef",
  "viewportRef",
  "initialized",
  "modelValue",
  "nodes",
  "edges",
  "maxZoom",
  "minZoom",
  "translateExtent",
  "hooks",
  "defaultEdgeOptions"
];
function Jv(e, t, n) {
  const o = qv(e), i = (D) => {
    const T = D ?? [];
    e.hooks.updateNodeInternals.trigger(T);
  }, a = (D) => hv(D, e.nodes, e.edges), r = (D) => fv(D, e.nodes, e.edges), s = (D) => Ht(D, e.edges), u = ({ id: D, type: T, nodeId: R }) => {
    var Z;
    const W = D ? `-${T}-${D}` : `-${T}`;
    return Array.from(((Z = e.connectionLookup.get(`${R}${W}`)) == null ? void 0 : Z.values()) ?? []);
  }, c = (D) => {
    if (D)
      return t.value.get(D);
  }, l = (D) => {
    if (D)
      return n.value.get(D);
  }, d = (D, T, R) => {
    var Z, W;
    const re = [];
    for (const le of D) {
      const ve = {
        id: le.id,
        type: "position",
        dragging: R,
        from: le.from
      };
      if (T && (ve.position = le.position, le.parentNode)) {
        const pe = c(le.parentNode);
        ve.position = {
          x: ve.position.x - (((Z = pe?.computedPosition) == null ? void 0 : Z.x) ?? 0),
          y: ve.position.y - (((W = pe?.computedPosition) == null ? void 0 : W.y) ?? 0)
        };
      }
      re.push(ve);
    }
    re?.length && e.hooks.nodesChange.trigger(re);
  }, f = (D) => {
    if (!e.vueFlowRef)
      return;
    const T = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!T)
      return;
    const R = window.getComputedStyle(T), { m22: Z } = new window.DOMMatrixReadOnly(R.transform), W = [];
    for (const re of D) {
      const le = re, ve = c(le.id);
      if (ve) {
        const pe = di(le.nodeElement);
        if (!!(pe.width && pe.height && (ve.dimensions.width !== pe.width || ve.dimensions.height !== pe.height || le.forceUpdate))) {
          const $e = le.nodeElement.getBoundingClientRect();
          ve.dimensions = pe, ve.handleBounds.source = Ps("source", le.nodeElement, $e, Z, ve.id), ve.handleBounds.target = Ps("target", le.nodeElement, $e, Z, ve.id), W.push({
            id: ve.id,
            type: "dimensions",
            dimensions: pe
          });
        }
      }
    }
    !e.fitViewOnInitDone && e.fitViewOnInit && o.value.fitView().then(() => {
      e.fitViewOnInitDone = !0;
    }), W.length && e.hooks.nodesChange.trigger(W);
  }, h = (D, T) => {
    const R = /* @__PURE__ */ new Set(), Z = /* @__PURE__ */ new Set();
    for (const le of D)
      Wt(le) ? R.add(le.id) : zt(le) && Z.add(le.id);
    const W = Dt(t.value, R, !0), re = Dt(n.value, Z);
    if (e.multiSelectionActive) {
      for (const le of R)
        W.push(Tt(le, T));
      for (const le of Z)
        re.push(Tt(le, T));
    }
    W.length && e.hooks.nodesChange.trigger(W), re.length && e.hooks.edgesChange.trigger(re);
  }, w = (D) => {
    if (e.multiSelectionActive) {
      const T = D.map((R) => Tt(R.id, !0));
      e.hooks.nodesChange.trigger(T);
      return;
    }
    e.hooks.nodesChange.trigger(Dt(t.value, new Set(D.map((T) => T.id)), !0)), e.hooks.edgesChange.trigger(Dt(n.value));
  }, _ = (D) => {
    if (e.multiSelectionActive) {
      const T = D.map((R) => Tt(R.id, !0));
      e.hooks.edgesChange.trigger(T);
      return;
    }
    e.hooks.edgesChange.trigger(Dt(n.value, new Set(D.map((T) => T.id)))), e.hooks.nodesChange.trigger(Dt(t.value, /* @__PURE__ */ new Set(), !0));
  }, m = (D) => {
    h(D, !0);
  }, p = (D) => {
    const R = (D || e.nodes).map((Z) => (Z.selected = !1, Tt(Z.id, !1)));
    e.hooks.nodesChange.trigger(R);
  }, v = (D) => {
    const R = (D || e.edges).map((Z) => (Z.selected = !1, Tt(Z.id, !1)));
    e.hooks.edgesChange.trigger(R);
  }, g = (D) => {
    if (!D || !D.length)
      return h([], !1);
    const T = D.reduce(
      (R, Z) => {
        const W = Tt(Z.id, !1);
        return Wt(Z) ? R.nodes.push(W) : R.edges.push(W), R;
      },
      { nodes: [], edges: [] }
    );
    T.nodes.length && e.hooks.nodesChange.trigger(T.nodes), T.edges.length && e.hooks.edgesChange.trigger(T.edges);
  }, b = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.scaleExtent([D, e.maxZoom]), e.minZoom = D;
  }, O = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.scaleExtent([e.minZoom, D]), e.maxZoom = D;
  }, F = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.translateExtent(D), e.translateExtent = D;
  }, K = (D) => {
    e.nodeExtent = D, i();
  }, N = (D) => {
    var T;
    (T = e.d3Zoom) == null || T.clickDistance(D);
  }, C = (D) => {
    e.nodesDraggable = D, e.nodesConnectable = D, e.elementsSelectable = D;
  }, M = (D) => {
    const T = D instanceof Function ? D(e.nodes) : D;
    !e.initialized && !T.length || (e.nodes = Rs(T, c, e.hooks.error.trigger));
  }, B = (D) => {
    const T = D instanceof Function ? D(e.edges) : D;
    if (!e.initialized && !T.length)
      return;
    const R = Gi(
      T,
      e.isValidConnection,
      c,
      l,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    );
    Fi(e.connectionLookup, n.value, R), e.edges = R;
  }, S = (D) => {
    const T = D instanceof Function ? D([...e.nodes, ...e.edges]) : D;
    !e.initialized && !T.length || (M(T.filter(Wt)), B(T.filter(zt)));
  }, Q = (D) => {
    let T = D instanceof Function ? D(e.nodes) : D;
    T = Array.isArray(T) ? T : [T];
    const R = Rs(T, c, e.hooks.error.trigger), Z = [];
    for (const W of R)
      Z.push(Ns(W));
    Z.length && e.hooks.nodesChange.trigger(Z);
  }, y = (D) => {
    let T = D instanceof Function ? D(e.edges) : D;
    T = Array.isArray(T) ? T : [T];
    const R = Gi(
      T,
      e.isValidConnection,
      c,
      l,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    ), Z = [];
    for (const W of R)
      Z.push(Ns(W));
    Z.length && e.hooks.edgesChange.trigger(Z);
  }, P = (D, T = !0, R = !1) => {
    const Z = D instanceof Function ? D(e.nodes) : D, W = Array.isArray(Z) ? Z : [Z], re = [], le = [];
    function ve(we) {
      const $e = s(we);
      for (const Ce of $e)
        (!Ve(Ce.deletable) || Ce.deletable) && le.push(Ms(Ce.id, Ce.source, Ce.target, Ce.sourceHandle, Ce.targetHandle));
    }
    function pe(we) {
      const $e = [];
      for (const Ce of e.nodes)
        Ce.parentNode === we && $e.push(Ce);
      if ($e.length) {
        for (const Ce of $e)
          re.push(Cs(Ce.id));
        T && ve($e);
        for (const Ce of $e)
          pe(Ce.id);
      }
    }
    for (const we of W) {
      const $e = typeof we == "string" ? c(we) : we;
      $e && (Ve($e.deletable) && !$e.deletable || (re.push(Cs($e.id)), T && ve([$e]), R && pe($e.id)));
    }
    le.length && e.hooks.edgesChange.trigger(le), re.length && e.hooks.nodesChange.trigger(re);
  }, $ = (D) => {
    const T = D instanceof Function ? D(e.edges) : D, R = Array.isArray(T) ? T : [T], Z = [];
    for (const W of R) {
      const re = typeof W == "string" ? l(W) : W;
      re && (Ve(re.deletable) && !re.deletable || Z.push(
        Ms(
          typeof W == "string" ? W : W.id,
          re.source,
          re.target,
          re.sourceHandle,
          re.targetHandle
        )
      ));
    }
    e.hooks.edgesChange.trigger(Z);
  }, X = (D, T, R = !0) => {
    const Z = l(D.id);
    if (!Z)
      return !1;
    const W = e.edges.indexOf(Z), re = Pv(D, T, Z, R, e.hooks.error.trigger);
    if (re) {
      const [le] = Gi(
        [re],
        e.isValidConnection,
        c,
        l,
        e.hooks.error.trigger,
        e.defaultEdgeOptions,
        e.nodes,
        e.edges
      );
      return e.edges = e.edges.map((ve, pe) => pe === W ? le : ve), Fi(e.connectionLookup, n.value, [le]), le;
    }
    return !1;
  }, U = (D, T, R = { replace: !1 }) => {
    const Z = l(D);
    if (!Z)
      return;
    const W = typeof T == "function" ? T(Z) : T;
    Z.data = R.replace ? W : { ...Z.data, ...W };
  }, z = (D) => Ss(D, e.nodes), E = (D) => {
    const T = Ss(D, e.edges);
    return Fi(e.connectionLookup, n.value, T), T;
  }, L = (D, T, R = { replace: !1 }) => {
    const Z = c(D);
    if (!Z)
      return;
    const W = typeof T == "function" ? T(Z) : T;
    R.replace ? e.nodes.splice(e.nodes.indexOf(Z), 1, W) : Object.assign(Z, W);
  }, te = (D, T, R = { replace: !1 }) => {
    const Z = c(D);
    if (!Z)
      return;
    const W = typeof T == "function" ? T(Z) : T;
    Z.data = R.replace ? W : { ...Z.data, ...W };
  }, H = (D, T, R = !1) => {
    R ? e.connectionClickStartHandle = D : e.connectionStartHandle = D, e.connectionEndHandle = null, e.connectionStatus = null, T && (e.connectionPosition = T);
  }, q = (D, T = null, R = null) => {
    e.connectionStartHandle && (e.connectionPosition = D, e.connectionEndHandle = T, e.connectionStatus = R);
  }, Y = (D, T) => {
    e.connectionPosition = { x: Number.NaN, y: Number.NaN }, e.connectionEndHandle = null, e.connectionStatus = null, T ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, j = (D) => {
    const T = cv(D), R = T ? null : Dn(D) ? D : c(D.id);
    return !T && !R ? [null, null, T] : [T ? D : Ko(R), R, T];
  }, ee = (D, T = !0, R = e.nodes) => {
    const [Z, W, re] = j(D);
    if (!Z)
      return [];
    const le = [];
    for (const ve of R || e.nodes) {
      if (!re && (ve.id === W.id || !ve.computedPosition))
        continue;
      const pe = Ko(ve), we = Zo(pe, Z);
      (T && we > 0 || we >= pe.width * pe.height || we >= Number(Z.width) * Number(Z.height)) && le.push(ve);
    }
    return le;
  }, ae = (D, T, R = !0) => {
    const [Z] = j(D);
    if (!Z)
      return !1;
    const W = Zo(Z, T);
    return R && W > 0 || W >= Number(Z.width) * Number(Z.height);
  }, me = (D) => {
    const { viewport: T, dimensions: R, d3Zoom: Z, d3Selection: W, translateExtent: re } = e;
    if (!Z || !W || !D.x && !D.y)
      return !1;
    const le = gn.translate(T.x + D.x, T.y + D.y).scale(T.zoom), ve = [
      [0, 0],
      [R.width, R.height]
    ], pe = Z.constrain()(le, ve, re), we = e.viewport.x !== pe.x || e.viewport.y !== pe.y || e.viewport.zoom !== pe.k;
    return Z.transform(W, pe), we;
  }, ge = (D) => {
    const T = D instanceof Function ? D(e) : D, R = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    Ve(T.defaultEdgeOptions) && (e.defaultEdgeOptions = T.defaultEdgeOptions);
    const Z = T.modelValue || T.nodes || T.edges ? [] : void 0;
    Z && (T.modelValue && Z.push(...T.modelValue), T.nodes && Z.push(...T.nodes), T.edges && Z.push(...T.edges), S(Z));
    const W = () => {
      Ve(T.maxZoom) && O(T.maxZoom), Ve(T.minZoom) && b(T.minZoom), Ve(T.translateExtent) && F(T.translateExtent);
    };
    for (const re of Object.keys(T)) {
      const le = re, ve = T[le];
      ![...jv, ...R].includes(le) && Ve(ve) && (e[le] = ve);
    }
    Yr(() => e.d3Zoom).not.toBeNull().then(W), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: f,
    setElements: S,
    setNodes: M,
    setEdges: B,
    addNodes: Q,
    addEdges: y,
    removeNodes: P,
    removeEdges: $,
    findNode: c,
    findEdge: l,
    updateEdge: X,
    updateEdgeData: U,
    updateNode: L,
    updateNodeData: te,
    applyEdgeChanges: E,
    applyNodeChanges: z,
    addSelectedElements: m,
    addSelectedNodes: w,
    addSelectedEdges: _,
    setMinZoom: b,
    setMaxZoom: O,
    setTranslateExtent: F,
    setNodeExtent: K,
    setPaneClickDistance: N,
    removeSelectedElements: g,
    removeSelectedNodes: p,
    removeSelectedEdges: v,
    startConnection: H,
    updateConnection: q,
    endConnection: Y,
    setInteractive: C,
    setState: ge,
    getIntersectingNodes: ee,
    getIncomers: a,
    getOutgoers: r,
    getConnectedEdges: s,
    getHandleConnections: u,
    isNodeIntersecting: ae,
    panBy: me,
    fitView: (D) => o.value.fitView(D),
    zoomIn: (D) => o.value.zoomIn(D),
    zoomOut: (D) => o.value.zoomOut(D),
    zoomTo: (D, T) => o.value.zoomTo(D, T),
    setViewport: (D, T) => o.value.setViewport(D, T),
    setTransform: (D, T) => o.value.setTransform(D, T),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (D, T, R) => o.value.setCenter(D, T, R),
    fitBounds: (D, T) => o.value.fitBounds(D, T),
    project: (D) => o.value.project(D),
    screenToFlowCoordinate: (D) => o.value.screenToFlowCoordinate(D),
    flowToScreenCoordinate: (D) => o.value.flowToScreenCoordinate(D),
    toObject: () => {
      const D = [], T = [];
      for (const R of e.nodes) {
        const {
          computedPosition: Z,
          handleBounds: W,
          selected: re,
          dimensions: le,
          isParent: ve,
          resizing: pe,
          dragging: we,
          events: $e,
          ...Ce
        } = R;
        D.push(Ce);
      }
      for (const R of e.edges) {
        const { selected: Z, sourceNode: W, targetNode: re, events: le, ...ve } = R;
        T.push(ve);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: D,
          edges: T,
          position: [e.viewport.x, e.viewport.y],
          zoom: e.viewport.zoom,
          viewport: e.viewport
        })
      );
    },
    fromObject: (D) => new Promise((T) => {
      const { nodes: R, edges: Z, position: W, zoom: re, viewport: le } = D;
      R && M(R), Z && B(Z);
      const [ve, pe] = le?.x && le?.y ? [le.x, le.y] : W ?? [null, null];
      if (ve && pe) {
        const we = le?.zoom || re || e.viewport.zoom;
        return Yr(() => o.value.viewportInitialized).toBe(!0).then(() => {
          o.value.setViewport({
            x: ve,
            y: pe,
            zoom: we
          }).then(() => {
            T(!0);
          });
        });
      } else
        T(!0);
    }),
    updateNodeInternals: i,
    viewportHelper: o,
    $reset: () => {
      const D = gc();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const T = gn.translate(D.defaultViewport.x ?? 0, D.defaultViewport.y ?? 0).scale(Jt(D.defaultViewport.zoom ?? 1, D.minZoom, D.maxZoom)), R = e.viewportRef.getBoundingClientRect(), Z = [
          [0, 0],
          [R.width, R.height]
        ], W = e.d3Zoom.constrain()(T, Z, D.translateExtent);
        e.d3Zoom.transform(e.d3Selection, W);
      }
      ge(D);
    },
    $destroy: () => {
    }
  };
}
const Qv = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], em = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, ft = /* @__PURE__ */ xe({
  ...em,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => ue.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = Zd(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = Te(() => n.type ?? "source"), i = Te(() => n.isValidConnection ?? null), {
      id: a,
      connectionStartHandle: r,
      connectionClickStartHandle: s,
      connectionEndHandle: u,
      vueFlowRef: c,
      nodesConnectable: l,
      noDragClassName: d,
      noPanClassName: f
    } = Pe(), { id: h, node: w, nodeEl: _, connectedEdges: m } = hc(), p = fe(), v = Te(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), g = Te(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), b = Te(
      () => {
        var B, S, Q, y, P, $;
        return ((B = r.value) == null ? void 0 : B.nodeId) === h && ((S = r.value) == null ? void 0 : S.id) === e.id && ((Q = r.value) == null ? void 0 : Q.type) === o.value || ((y = u.value) == null ? void 0 : y.nodeId) === h && ((P = u.value) == null ? void 0 : P.id) === e.id && (($ = u.value) == null ? void 0 : $.type) === o.value;
      }
    ), O = Te(
      () => {
        var B, S, Q;
        return ((B = s.value) == null ? void 0 : B.nodeId) === h && ((S = s.value) == null ? void 0 : S.id) === e.id && ((Q = s.value) == null ? void 0 : Q.type) === o.value;
      }
    ), { handlePointerDown: F, handleClick: K } = fc({
      nodeId: h,
      handleId: e.id,
      isValidConnection: i,
      type: o
    }), N = ne(() => typeof e.connectable == "string" && e.connectable === "single" ? !m.value.some((B) => {
      const S = B[`${o.value}Handle`];
      return B[o.value] !== h ? !1 : S ? S === e.id : !0;
    }) : typeof e.connectable == "number" ? m.value.filter((B) => {
      const S = B[`${o.value}Handle`];
      return B[o.value] !== h ? !1 : S ? S === e.id : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(w, m.value) : Ve(e.connectable) ? e.connectable : l.value);
    ot(() => {
      var B;
      if (!w.dimensions.width || !w.dimensions.height)
        return;
      const S = (B = w.handleBounds[o.value]) == null ? void 0 : B.find((z) => z.id === e.id);
      if (!c.value || S)
        return;
      const Q = c.value.querySelector(".vue-flow__transformationpane");
      if (!_.value || !p.value || !Q || !e.id)
        return;
      const y = _.value.getBoundingClientRect(), P = p.value.getBoundingClientRect(), $ = window.getComputedStyle(Q), { m22: X } = new window.DOMMatrixReadOnly($.transform), U = {
        id: e.id,
        position: e.position,
        x: (P.left - y.left) / X,
        y: (P.top - y.top) / X,
        type: o.value,
        nodeId: h,
        ...di(p.value)
      };
      w.handleBounds[o.value] = [...w.handleBounds[o.value] ?? [], U];
    });
    function C(B) {
      const S = Ia(B);
      N.value && v.value && (S && B.button === 0 || !S) && F(B);
    }
    function M(B) {
      !h || !s.value && !v.value || N.value && K(B);
    }
    return t({
      handleClick: K,
      handlePointerDown: F,
      onClick: M,
      onPointerDown: C
    }), (B, S) => (A(), G("div", {
      ref_key: "handle",
      ref: p,
      "data-id": `${oe(a)}-${oe(h)}-${e.id}-${o.value}`,
      "data-handleid": e.id,
      "data-nodeid": oe(h),
      "data-handlepos": B.position,
      class: Me(["vue-flow__handle", [
        `vue-flow__handle-${B.position}`,
        `vue-flow__handle-${e.id}`,
        oe(d),
        oe(f),
        o.value,
        {
          connectable: N.value,
          connecting: O.value,
          connectablestart: v.value,
          connectableend: g.value,
          connectionindicator: N.value && (v.value && !b.value || g.value && b.value)
        }
      ]]),
      onMousedown: C,
      onTouchstartPassive: C,
      onClick: M
    }, [
      Be(B.$slots, "default", { id: B.id })
    ], 42, Qv));
  }
}), pi = function({
  sourcePosition: e = ue.Bottom,
  targetPosition: t = ue.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: i,
  isValidSourcePos: a,
  data: r
}) {
  const s = r.label ?? n;
  return [
    De(ft, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof s != "string" && s ? De(s) : De(ye, [s]),
    De(ft, { type: "source", position: e, connectable: o, isValidConnection: a })
  ];
};
pi.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
pi.inheritAttrs = !1;
pi.compatConfig = { MODE: 3 };
const tm = pi, gi = function({
  targetPosition: e = ue.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: i
}) {
  const a = i.label ?? t;
  return [
    De(ft, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof a != "string" && a ? De(a) : De(ye, [a])
  ];
};
gi.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
gi.inheritAttrs = !1;
gi.compatConfig = { MODE: 3 };
const nm = gi, vi = function({
  sourcePosition: e = ue.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: i
}) {
  const a = i.label ?? t;
  return [
    typeof a != "string" && a ? De(a) : De(ye, [a]),
    De(ft, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
vi.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
vi.inheritAttrs = !1;
vi.compatConfig = { MODE: 3 };
const om = vi, im = ["transform"], rm = ["width", "height", "x", "y", "rx", "ry"], am = ["y"], sm = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, lm = /* @__PURE__ */ xe({
  ...sm,
  props: {
    x: {},
    y: {},
    label: {},
    labelStyle: { default: () => ({}) },
    labelShowBg: { type: Boolean, default: !0 },
    labelBgStyle: { default: () => ({}) },
    labelBgPadding: { default: () => [2, 4] },
    labelBgBorderRadius: { default: 2 }
  },
  setup(e) {
    const t = fe({ x: 0, y: 0, width: 0, height: 0 }), n = fe(null), o = ne(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    ot(i), Ee([() => e.x, () => e.y, n, () => e.label], i);
    function i() {
      if (!n.value)
        return;
      const a = n.value.getBBox();
      (a.width !== t.value.width || a.height !== t.value.height) && (t.value = a);
    }
    return (a, r) => (A(), G("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      a.labelShowBg ? (A(), G("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * a.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * a.labelBgPadding[1]}px`,
        x: -a.labelBgPadding[0],
        y: -a.labelBgPadding[1],
        style: Oe(a.labelBgStyle),
        rx: a.labelBgBorderRadius,
        ry: a.labelBgBorderRadius
      }, null, 12, rm)) : de("", !0),
      I("text", Ho(a.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: a.labelStyle
      }), [
        Be(a.$slots, "default", {}, () => [
          typeof a.label != "string" ? (A(), Ie(Lt(a.label), { key: 0 })) : (A(), G(ye, { key: 1 }, [
            Pt(he(a.label), 1)
          ], 64))
        ])
      ], 16, am)
    ], 8, im));
  }
}), um = ["id", "d", "marker-end", "marker-start"], cm = ["d", "stroke-width"], dm = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, mi = /* @__PURE__ */ xe({
  ...dm,
  props: {
    id: {},
    labelX: {},
    labelY: {},
    path: {},
    label: {},
    markerStart: {},
    markerEnd: {},
    interactionWidth: { default: 20 },
    labelStyle: {},
    labelShowBg: { type: Boolean },
    labelBgStyle: {},
    labelBgPadding: {},
    labelBgBorderRadius: {}
  },
  setup(e, { expose: t }) {
    const n = fe(null), o = fe(null), i = fe(null), a = _a();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: i
    }), (r, s) => (A(), G(ye, null, [
      I("path", Ho(oe(a), {
        id: r.id,
        ref_key: "pathEl",
        ref: n,
        d: r.path,
        class: "vue-flow__edge-path",
        "marker-end": r.markerEnd,
        "marker-start": r.markerStart
      }), null, 16, um),
      r.interactionWidth ? (A(), G("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: r.path,
        "stroke-width": r.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, cm)) : de("", !0),
      r.label && r.labelX && r.labelY ? (A(), Ie(lm, {
        key: 1,
        ref_key: "labelEl",
        ref: i,
        x: r.labelX,
        y: r.labelY,
        label: r.label,
        "label-show-bg": r.labelShowBg,
        "label-bg-style": r.labelBgStyle,
        "label-bg-padding": r.labelBgPadding,
        "label-bg-border-radius": r.labelBgBorderRadius,
        "label-style": r.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : de("", !0)
    ], 64));
  }
});
function vc({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e) / 2, a = n < e ? n + i : n - i, r = Math.abs(o - t) / 2, s = o < t ? o + r : o - r;
  return [a, s, i, r];
}
function mc({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: a,
  targetControlX: r,
  targetControlY: s
}) {
  const u = e * 0.125 + i * 0.375 + r * 0.375 + n * 0.125, c = t * 0.125 + a * 0.375 + s * 0.375 + o * 0.125, l = Math.abs(u - e), d = Math.abs(c - t);
  return [u, c, l, d];
}
function bo(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function Vs({ pos: e, x1: t, y1: n, x2: o, y2: i, c: a }) {
  let r, s;
  switch (e) {
    case ue.Left:
      r = t - bo(t - o, a), s = n;
      break;
    case ue.Right:
      r = t + bo(o - t, a), s = n;
      break;
    case ue.Top:
      r = t, s = n - bo(n - i, a);
      break;
    case ue.Bottom:
      r = t, s = n + bo(i - n, a);
      break;
  }
  return [r, s];
}
function yc(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ue.Bottom,
    targetX: i,
    targetY: a,
    targetPosition: r = ue.Top,
    curvature: s = 0.25
  } = e, [u, c] = Vs({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: a,
    c: s
  }), [l, d] = Vs({
    pos: r,
    x1: i,
    y1: a,
    x2: t,
    y2: n,
    c: s
  }), [f, h, w, _] = mc({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: a,
    sourceControlX: u,
    sourceControlY: c,
    targetControlX: l,
    targetControlY: d
  });
  return [
    `M${t},${n} C${u},${c} ${l},${d} ${i},${a}`,
    f,
    h,
    w,
    _
  ];
}
function Hs({ pos: e, x1: t, y1: n, x2: o, y2: i }) {
  let a, r;
  switch (e) {
    case ue.Left:
    case ue.Right:
      a = 0.5 * (t + o), r = n;
      break;
    case ue.Top:
    case ue.Bottom:
      a = t, r = 0.5 * (n + i);
      break;
  }
  return [a, r];
}
function wc(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ue.Bottom,
    targetX: i,
    targetY: a,
    targetPosition: r = ue.Top
  } = e, [s, u] = Hs({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: a
  }), [c, l] = Hs({
    pos: r,
    x1: i,
    y1: a,
    x2: t,
    y2: n
  }), [d, f, h, w] = mc({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: a,
    sourceControlX: s,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: l
  });
  return [
    `M${t},${n} C${s},${u} ${c},${l} ${i},${a}`,
    d,
    f,
    h,
    w
  ];
}
const Fs = {
  [ue.Left]: { x: -1, y: 0 },
  [ue.Right]: { x: 1, y: 0 },
  [ue.Top]: { x: 0, y: -1 },
  [ue.Bottom]: { x: 0, y: 1 }
};
function fm({
  source: e,
  sourcePosition: t = ue.Bottom,
  target: n
}) {
  return t === ue.Left || t === ue.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Gs(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function hm({
  source: e,
  sourcePosition: t = ue.Bottom,
  target: n,
  targetPosition: o = ue.Top,
  center: i,
  offset: a
}) {
  const r = Fs[t], s = Fs[o], u = { x: e.x + r.x * a, y: e.y + r.y * a }, c = { x: n.x + s.x * a, y: n.y + s.y * a }, l = fm({
    source: u,
    sourcePosition: t,
    target: c
  }), d = l.x !== 0 ? "x" : "y", f = l[d];
  let h, w, _;
  const m = { x: 0, y: 0 }, p = { x: 0, y: 0 }, [v, g, b, O] = vc({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (r[d] * s[d] === -1) {
    w = i.x ?? v, _ = i.y ?? g;
    const K = [
      { x: w, y: u.y },
      { x: w, y: c.y }
    ], N = [
      { x: u.x, y: _ },
      { x: c.x, y: _ }
    ];
    r[d] === f ? h = d === "x" ? K : N : h = d === "x" ? N : K;
  } else {
    const K = [{ x: u.x, y: c.y }], N = [{ x: c.x, y: u.y }];
    if (d === "x" ? h = r.x === f ? N : K : h = r.y === f ? K : N, t === o) {
      const Q = Math.abs(e[d] - n[d]);
      if (Q <= a) {
        const y = Math.min(a - 1, a - Q);
        r[d] === f ? m[d] = (u[d] > e[d] ? -1 : 1) * y : p[d] = (c[d] > n[d] ? -1 : 1) * y;
      }
    }
    if (t !== o) {
      const Q = d === "x" ? "y" : "x", y = r[d] === s[Q], P = u[Q] > c[Q], $ = u[Q] < c[Q];
      (r[d] === 1 && (!y && P || y && $) || r[d] !== 1 && (!y && $ || y && P)) && (h = d === "x" ? K : N);
    }
    const C = { x: u.x + m.x, y: u.y + m.y }, M = { x: c.x + p.x, y: c.y + p.y }, B = Math.max(Math.abs(C.x - h[0].x), Math.abs(M.x - h[0].x)), S = Math.max(Math.abs(C.y - h[0].y), Math.abs(M.y - h[0].y));
    B >= S ? (w = (C.x + M.x) / 2, _ = h[0].y) : (w = h[0].x, _ = (C.y + M.y) / 2);
  }
  return [[
    e,
    { x: u.x + m.x, y: u.y + m.y },
    ...h,
    { x: c.x + p.x, y: c.y + p.y },
    n
  ], w, _, b, O];
}
function pm(e, t, n, o) {
  const i = Math.min(Gs(e, t) / 2, Gs(t, n) / 2, o), { x: a, y: r } = t;
  if (e.x === a && a === n.x || e.y === r && r === n.y)
    return `L${a} ${r}`;
  if (e.y === r) {
    const c = e.x < n.x ? -1 : 1, l = e.y < n.y ? 1 : -1;
    return `L ${a + i * c},${r}Q ${a},${r} ${a},${r + i * l}`;
  }
  const s = e.x < n.x ? 1 : -1, u = e.y < n.y ? -1 : 1;
  return `L ${a},${r + i * u}Q ${a},${r} ${a + i * s},${r}`;
}
function oa(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ue.Bottom,
    targetX: i,
    targetY: a,
    targetPosition: r = ue.Top,
    borderRadius: s = 5,
    centerX: u,
    centerY: c,
    offset: l = 20
  } = e, [d, f, h, w, _] = hm({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: i, y: a },
    targetPosition: r,
    center: { x: u, y: c },
    offset: l
  });
  return [d.reduce((p, v, g) => {
    let b;
    return g > 0 && g < d.length - 1 ? b = pm(d[g - 1], v, d[g + 1], s) : b = `${g === 0 ? "M" : "L"}${v.x} ${v.y}`, p += b, p;
  }, ""), f, h, w, _];
}
function gm(e) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: i } = e, [a, r, s, u] = vc({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: i
  });
  return [`M ${t},${n}L ${o},${i}`, a, r, s, u];
}
const vm = xe({
  name: "StraightEdge",
  props: [
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = gm(e);
      return De(mi, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), mm = vm, ym = xe({
  name: "SmoothStepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "borderRadius",
    "markerEnd",
    "markerStart",
    "interactionWidth",
    "offset"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = oa({
        ...e,
        sourcePosition: e.sourcePosition ?? ue.Bottom,
        targetPosition: e.targetPosition ?? ue.Top
      });
      return De(mi, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), _c = ym, wm = xe({
  name: "StepEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  setup(e, { attrs: t }) {
    return () => De(_c, { ...e, ...t, borderRadius: 0 });
  }
}), _m = wm, bm = xe({
  name: "BezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "curvature",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = yc({
        ...e,
        sourcePosition: e.sourcePosition ?? ue.Bottom,
        targetPosition: e.targetPosition ?? ue.Top
      });
      return De(mi, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), km = bm, Em = xe({
  name: "SimpleBezierEdge",
  props: [
    "sourcePosition",
    "targetPosition",
    "label",
    "labelStyle",
    "labelShowBg",
    "labelBgStyle",
    "labelBgPadding",
    "labelBgBorderRadius",
    "sourceY",
    "sourceX",
    "targetX",
    "targetY",
    "markerEnd",
    "markerStart",
    "interactionWidth"
  ],
  compatConfig: { MODE: 3 },
  setup(e, { attrs: t }) {
    return () => {
      const [n, o, i] = wc({
        ...e,
        sourcePosition: e.sourcePosition ?? ue.Bottom,
        targetPosition: e.targetPosition ?? ue.Top
      });
      return De(mi, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), $m = Em, xm = {
  input: om,
  default: tm,
  output: nm
}, Sm = {
  default: km,
  straight: mm,
  step: _m,
  smoothstep: _c,
  simplebezier: $m
};
function Nm(e, t, n) {
  const o = ne(() => (_) => t.value.get(_)), i = ne(() => (_) => n.value.get(_)), a = ne(() => {
    const _ = {
      ...Sm,
      ...e.edgeTypes
    }, m = Object.keys(_);
    for (const p of e.edges)
      p.type && !m.includes(p.type) && (_[p.type] = p.type);
    return _;
  }), r = ne(() => {
    const _ = {
      ...xm,
      ...e.nodeTypes
    }, m = Object.keys(_);
    for (const p of e.nodes)
      p.type && !m.includes(p.type) && (_[p.type] = p.type);
    return _;
  }), s = ne(() => e.onlyRenderVisibleElements ? nc(
    e.nodes,
    {
      x: 0,
      y: 0,
      width: e.dimensions.width,
      height: e.dimensions.height
    },
    e.viewport,
    !0
  ) : e.nodes), u = ne(() => {
    if (e.onlyRenderVisibleElements) {
      const _ = [];
      for (const m of e.edges) {
        const p = t.value.get(m.source), v = t.value.get(m.target);
        Ev({
          sourcePos: p.computedPosition || { x: 0, y: 0 },
          targetPos: v.computedPosition || { x: 0, y: 0 },
          sourceWidth: p.dimensions.width,
          sourceHeight: p.dimensions.height,
          targetWidth: v.dimensions.width,
          targetHeight: v.dimensions.height,
          width: e.dimensions.width,
          height: e.dimensions.height,
          viewport: e.viewport
        }) && _.push(m);
      }
      return _;
    }
    return e.edges;
  }), c = ne(() => [...s.value, ...u.value]), l = ne(() => {
    const _ = [];
    for (const m of e.nodes)
      m.selected && _.push(m);
    return _;
  }), d = ne(() => {
    const _ = [];
    for (const m of e.edges)
      m.selected && _.push(m);
    return _;
  }), f = ne(() => [
    ...l.value,
    ...d.value
  ]), h = ne(() => {
    const _ = [];
    for (const m of e.nodes)
      m.dimensions.width && m.dimensions.height && m.handleBounds !== void 0 && _.push(m);
    return _;
  }), w = ne(
    () => s.value.length > 0 && h.value.length === s.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: c,
    getEdgeTypes: a,
    getNodeTypes: r,
    getEdges: u,
    getNodes: s,
    getSelectedElements: f,
    getSelectedNodes: l,
    getSelectedEdges: d,
    getNodesInitialized: h,
    areNodesInitialized: w
  };
}
class Ft {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = wn()) == null ? void 0 : t.appContext.app, o = n?.config.globalProperties.$vueFlowStorage ?? Ft.instance;
    return Ft.instance = o ?? new Ft(), n && (n.config.globalProperties.$vueFlowStorage = Ft.instance), Ft.instance;
  }
  set(t, n) {
    return this.flows.set(t, n);
  }
  get(t) {
    return this.flows.get(t);
  }
  remove(t) {
    return this.flows.delete(t);
  }
  create(t, n) {
    const o = gc(), i = Jd(o), a = {};
    for (const [f, h] of Object.entries(i.hooks)) {
      const w = `on${f.charAt(0).toUpperCase() + f.slice(1)}`;
      a[w] = h.on;
    }
    const r = {};
    for (const [f, h] of Object.entries(i.hooks))
      r[f] = h.trigger;
    const s = ne(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of i.nodes)
        f.set(h.id, h);
      return f;
    }), u = ne(() => {
      const f = /* @__PURE__ */ new Map();
      for (const h of i.edges)
        f.set(h.id, h);
      return f;
    }), c = Nm(i, s, u), l = Jv(i, s, u);
    l.setState({ ...i, ...n });
    const d = {
      ...a,
      ...c,
      ...l,
      ...wf(i),
      nodeLookup: s,
      edgeLookup: u,
      emits: r,
      id: t,
      vueFlowVersion: "1.48.2",
      $destroy: () => {
        this.remove(t);
      }
    };
    return this.set(t, d), d;
  }
  getId() {
    return `vue-flow-${this.currentId++}`;
  }
}
function Pe(e) {
  const t = Ft.getInstance(), n = fu(), o = typeof e == "object", i = o ? e : { id: e }, a = i.id, r = a ?? n?.vueFlowId;
  let s;
  if (n) {
    const u = xt(Ls, null);
    typeof u < "u" && u !== null && (!r || u.id === r) && (s = u);
  }
  if (s || r && (s = t.get(r)), !s || r && s.id !== r) {
    const u = a ?? t.getId(), c = t.create(u, i);
    s = c, (n ?? hu(!0)).run(() => {
      Ee(
        c.applyDefault,
        (d, f, h) => {
          const w = (m) => {
            c.applyNodeChanges(m);
          }, _ = (m) => {
            c.applyEdgeChanges(m);
          };
          d ? (c.onNodesChange(w), c.onEdgesChange(_)) : (c.hooks.value.nodesChange.off(w), c.hooks.value.edgesChange.off(_)), h(() => {
            c.hooks.value.nodesChange.off(w), c.hooks.value.edgesChange.off(_);
          });
        },
        { immediate: !0 }
      ), Hn(() => {
        if (s) {
          const d = t.get(s.id);
          d ? d.$destroy() : io(`No store instance found for id ${s.id} in storage.`);
        }
      });
    });
  } else
    o && s.setState(i);
  if (n && (St(Ls, s), n.vueFlowId = s.id), o) {
    const u = wn();
    u?.type.name !== "VueFlow" && s.emits.error(new Ge(He.USEVUEFLOW_OPTIONS));
  }
  return s;
}
function Cm(e) {
  const { emits: t, dimensions: n } = Pe();
  let o;
  ot(() => {
    const i = () => {
      var a, r;
      if (!e.value || !(((r = (a = e.value).checkVisibility) == null ? void 0 : r.call(a)) ?? !0))
        return;
      const s = di(e.value);
      (s.width === 0 || s.height === 0) && t.error(new Ge(He.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: s.width || 500, height: s.height || 500 };
    };
    i(), window.addEventListener("resize", i), e.value && (o = new ResizeObserver(() => i()), o.observe(e.value)), to(() => {
      window.removeEventListener("resize", i), o && e.value && o.unobserve(e.value);
    });
  });
}
const Mm = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, Tm = /* @__PURE__ */ xe({
  ...Mm,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (A(), G("div", {
      class: "vue-flow__selection vue-flow__container",
      style: Oe({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), Im = ["tabIndex"], Dm = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, Am = /* @__PURE__ */ xe({
  ...Dm,
  setup(e) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: i, disableKeyboardA11y: a, userSelectionActive: r } = Pe(), s = pc(), u = fe(null), c = dc({
      el: u,
      onStart(w) {
        t.selectionDragStart(w), t.nodeDragStart(w);
      },
      onDrag(w) {
        t.selectionDrag(w), t.nodeDrag(w);
      },
      onStop(w) {
        t.selectionDragStop(w), t.nodeDragStop(w);
      }
    });
    ot(() => {
      var w;
      a.value || (w = u.value) == null || w.focus({ preventScroll: !0 });
    });
    const l = ne(() => Ma(o.value)), d = ne(() => ({
      width: `${l.value.width}px`,
      height: `${l.value.height}px`,
      top: `${l.value.y}px`,
      left: `${l.value.x}px`
    }));
    function f(w) {
      t.selectionContextMenu({ event: w, nodes: o.value });
    }
    function h(w) {
      a.value || dn[w.key] && (w.preventDefault(), s(
        {
          x: dn[w.key].x,
          y: dn[w.key].y
        },
        w.shiftKey
      ));
    }
    return (w, _) => !oe(r) && l.value.width && l.value.height ? (A(), G("div", {
      key: 0,
      class: Me(["vue-flow__nodesselection vue-flow__container", oe(i)]),
      style: Oe({ transform: `translate(${oe(n).x}px,${oe(n).y}px) scale(${oe(n).zoom})` })
    }, [
      I("div", {
        ref_key: "el",
        ref: u,
        class: Me([{ dragging: oe(c) }, "vue-flow__nodesselection-rect"]),
        style: Oe(d.value),
        tabIndex: oe(a) ? void 0 : -1,
        onContextmenu: f,
        onKeydown: h
      }, null, 46, Im)
    ], 6)) : de("", !0);
  }
});
function Om(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const Pm = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, Rm = /* @__PURE__ */ xe({
  ...Pm,
  props: {
    isSelecting: { type: Boolean },
    selectionKeyPressed: { type: Boolean }
  },
  setup(e) {
    const {
      vueFlowRef: t,
      nodes: n,
      viewport: o,
      emits: i,
      userSelectionActive: a,
      removeSelectedElements: r,
      userSelectionRect: s,
      elementsSelectable: u,
      nodesSelectionActive: c,
      getSelectedEdges: l,
      getSelectedNodes: d,
      removeNodes: f,
      removeEdges: h,
      selectionMode: w,
      deleteKeyCode: _,
      multiSelectionKeyCode: m,
      multiSelectionActive: p,
      edgeLookup: v,
      nodeLookup: g,
      connectionLookup: b,
      defaultEdgeOptions: O,
      connectionStartHandle: F,
      panOnDrag: K
    } = Pe(), N = bt(null), C = bt(/* @__PURE__ */ new Set()), M = bt(/* @__PURE__ */ new Set()), B = bt(null), S = Te(() => u.value && (e.isSelecting || a.value)), Q = Te(() => F.value !== null);
    let y = !1, P = !1;
    const $ = Bn(_, { actInsideInputWithModifier: !1 }), X = Bn(m);
    Ee($, (Y) => {
      Y && (f(d.value), h(l.value), c.value = !1);
    }), Ee(X, (Y) => {
      p.value = Y;
    });
    function U(Y, j) {
      return (ee) => {
        ee.target === j && Y?.(ee);
      };
    }
    function z(Y) {
      if (y || Q.value) {
        y = !1;
        return;
      }
      i.paneClick(Y), r(), c.value = !1;
    }
    function E(Y) {
      var j;
      if (Array.isArray(K.value) && ((j = K.value) != null && j.includes(2))) {
        Y.preventDefault();
        return;
      }
      i.paneContextMenu(Y);
    }
    function L(Y) {
      i.paneScroll(Y);
    }
    function te(Y) {
      var j, ee, ae;
      if (B.value = ((j = t.value) == null ? void 0 : j.getBoundingClientRect()) ?? null, !u.value || !e.isSelecting || Y.button !== 0 || Y.target !== N.value || !B.value)
        return;
      (ae = (ee = Y.target) == null ? void 0 : ee.setPointerCapture) == null || ae.call(ee, Y.pointerId);
      const { x: me, y: ge } = Om(Y, B.value);
      P = !0, y = !1, r(), s.value = {
        width: 0,
        height: 0,
        startX: me,
        startY: ge,
        x: me,
        y: ge
      }, i.selectionStart(Y);
    }
    function H(Y) {
      var j;
      if (!B.value || !s.value)
        return;
      y = !0;
      const { x: ee, y: ae } = dt(Y, B.value), { startX: me = 0, startY: ge = 0 } = s.value, be = {
        startX: me,
        startY: ge,
        x: ee < me ? ee : me,
        y: ae < ge ? ae : ge,
        width: Math.abs(ee - me),
        height: Math.abs(ae - ge)
      }, ie = C.value, se = M.value;
      C.value = new Set(
        nc(n.value, be, o.value, w.value === Ca.Partial, !0).map(
          (T) => T.id
        )
      ), M.value = /* @__PURE__ */ new Set();
      const D = ((j = O.value) == null ? void 0 : j.selectable) ?? !0;
      for (const T of C.value) {
        const R = b.value.get(T);
        if (R)
          for (const { edgeId: Z } of R.values()) {
            const W = v.value.get(Z);
            W && (W.selectable ?? D) && M.value.add(Z);
          }
      }
      if (!Bs(ie, C.value)) {
        const T = Dt(g.value, C.value, !0);
        i.nodesChange(T);
      }
      if (!Bs(se, M.value)) {
        const T = Dt(v.value, M.value);
        i.edgesChange(T);
      }
      s.value = be, a.value = !0, c.value = !1;
    }
    function q(Y) {
      var j;
      Y.button !== 0 || !P || ((j = Y.target) == null || j.releasePointerCapture(Y.pointerId), !a.value && s.value && Y.target === N.value && z(Y), a.value = !1, s.value = null, c.value = C.value.size > 0, i.selectionEnd(Y), e.selectionKeyPressed && (y = !1), P = !1);
    }
    return (Y, j) => (A(), G("div", {
      ref_key: "container",
      ref: N,
      class: Me(["vue-flow__pane vue-flow__container", { selection: Y.isSelecting }]),
      onClick: j[0] || (j[0] = (ee) => S.value ? void 0 : U(z, N.value)(ee)),
      onContextmenu: j[1] || (j[1] = (ee) => U(E, N.value)(ee)),
      onWheelPassive: j[2] || (j[2] = (ee) => U(L, N.value)(ee)),
      onPointerenter: j[3] || (j[3] = (ee) => S.value ? void 0 : oe(i).paneMouseEnter(ee)),
      onPointerdown: j[4] || (j[4] = (ee) => S.value ? te(ee) : oe(i).paneMouseMove(ee)),
      onPointermove: j[5] || (j[5] = (ee) => S.value ? H(ee) : oe(i).paneMouseMove(ee)),
      onPointerup: j[6] || (j[6] = (ee) => S.value ? q(ee) : void 0),
      onPointerleave: j[7] || (j[7] = (ee) => oe(i).paneMouseLeave(ee))
    }, [
      Be(Y.$slots, "default"),
      oe(a) && oe(s) ? (A(), Ie(Tm, {
        key: 0,
        "user-selection-rect": oe(s)
      }, null, 8, ["user-selection-rect"])) : de("", !0),
      oe(c) && oe(d).length ? (A(), Ie(Am, { key: 1 })) : de("", !0)
    ], 34));
  }
}), zm = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Bm = /* @__PURE__ */ xe({
  ...zm,
  setup(e) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = Pe(), i = ne(() => n.value ? !o.value : !1), a = ne(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (r, s) => (A(), G("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: Oe({ transform: a.value, opacity: i.value ? 0 : void 0 })
    }, [
      Be(r.$slots, "default")
    ], 4));
  }
}), Lm = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, Vm = /* @__PURE__ */ xe({
  ...Lm,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: a,
      selectionKeyCode: r,
      panActivationKeyCode: s,
      panOnScroll: u,
      panOnScrollMode: c,
      panOnScrollSpeed: l,
      panOnDrag: d,
      zoomOnDoubleClick: f,
      zoomOnPinch: h,
      zoomOnScroll: w,
      preventScrolling: _,
      noWheelClassName: m,
      noPanClassName: p,
      emits: v,
      connectionStartHandle: g,
      userSelectionActive: b,
      paneDragging: O,
      d3Zoom: F,
      d3Selection: K,
      d3ZoomHandler: N,
      viewport: C,
      viewportRef: M,
      paneClickDistance: B
    } = Pe();
    Cm(M);
    const S = bt(!1), Q = bt(!1);
    let y = null, P = !1, $ = 0, X = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const U = Bn(s), z = Bn(r), E = Bn(a), L = Te(
      () => (!z.value || z.value && r.value === !0) && (U.value || d.value)
    ), te = Te(() => U.value || u.value), H = Te(() => r.value === !0 && L.value !== !0), q = Te(
      () => z.value && r.value !== !0 || b.value || H.value
    ), Y = Te(() => g.value !== null);
    ot(() => {
      if (!M.value) {
        io("Viewport element is missing");
        return;
      }
      const ge = M.value, be = ge.getBoundingClientRect(), ie = ov().clickDistance(B.value).scaleExtent([t.value, n.value]).translateExtent(i.value), se = Qe(ge).call(ie), D = se.on("wheel.zoom"), T = gn.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Jt(o.value.zoom ?? 1, t.value, n.value)), R = [
        [0, 0],
        [be.width, be.height]
      ], Z = ie.constrain()(T, R, i.value);
      ie.transform(se, Z), ie.wheelDelta(ea), F.value = ie, K.value = se, N.value = D, C.value = { x: Z.x, y: Z.y, zoom: Z.k }, ie.on("start", (W) => {
        var re;
        if (!W.sourceEvent)
          return null;
        $ = W.sourceEvent.button, S.value = !0;
        const le = ae(W.transform);
        ((re = W.sourceEvent) == null ? void 0 : re.type) === "mousedown" && (O.value = !0), X = le, v.viewportChangeStart(le), v.moveStart({ event: W, flowTransform: le });
      }), ie.on("end", (W) => {
        if (!W.sourceEvent)
          return null;
        if (S.value = !1, O.value = !1, j(L.value, $ ?? 0) && !P && v.paneContextMenu(W.sourceEvent), P = !1, ee(X, W.transform)) {
          const re = ae(W.transform);
          X = re, v.viewportChangeEnd(re), v.moveEnd({ event: W, flowTransform: re });
        }
      }), ie.filter((W) => {
        var re;
        const le = E.value || w.value, ve = h.value && W.ctrlKey, pe = W.button, we = W.type === "wheel";
        if (pe === 1 && W.type === "mousedown" && (me(W, "vue-flow__node") || me(W, "vue-flow__edge")))
          return !0;
        if (!L.value && !le && !te.value && !f.value && !h.value || b.value || Y.value && !we || !f.value && W.type === "dblclick" || me(W, m.value) && we || me(W, p.value) && (!we || te.value && we && !E.value) || !h.value && W.ctrlKey && we || !le && !te.value && !ve && we)
          return !1;
        if (!h && W.type === "touchstart" && ((re = W.touches) == null ? void 0 : re.length) > 1)
          return W.preventDefault(), !1;
        if (!L.value && (W.type === "mousedown" || W.type === "touchstart") || H.value && Array.isArray(d.value) && d.value.includes(0) && pe === 0 || Array.isArray(d.value) && !d.value.includes(pe) && (W.type === "mousedown" || W.type === "touchstart"))
          return !1;
        const $e = Array.isArray(d.value) && d.value.includes(pe) || r.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !pe || pe <= 1;
        return (!W.ctrlKey || U.value || we) && $e;
      }), Ee(
        [b, L],
        () => {
          b.value && !S.value ? ie.on("zoom", null) : b.value || ie.on("zoom", (W) => {
            C.value = { x: W.transform.x, y: W.transform.y, zoom: W.transform.k };
            const re = ae(W.transform);
            P = j(L.value, $ ?? 0), v.viewportChange(re), v.move({ event: W, flowTransform: re });
          });
        },
        { immediate: !0 }
      ), Ee(
        [b, te, c, E, h, _, m],
        () => {
          te.value && !E.value && !b.value ? se.on(
            "wheel.zoom",
            (W) => {
              if (me(W, m.value))
                return !1;
              const re = E.value || w.value, le = h.value && W.ctrlKey;
              if (!(!_.value || te.value || re || le))
                return !1;
              W.preventDefault(), W.stopImmediatePropagation();
              const pe = se.property("__zoom").k || 1, we = Zn();
              if (!U.value && W.ctrlKey && h.value && we) {
                const _n = lt(W), bi = ea(W), en = pe * 2 ** bi;
                ie.scaleTo(se, en, _n, W);
                return;
              }
              const $e = W.deltaMode === 1 ? 20 : 1;
              let Ce = c.value === zn.Vertical ? 0 : W.deltaX * $e, at = c.value === zn.Horizontal ? 0 : W.deltaY * $e;
              !we && W.shiftKey && c.value !== zn.Vertical && !Ce && at && (Ce = at, at = 0), ie.translateBy(
                se,
                -(Ce / pe) * l.value,
                -(at / pe) * l.value
              );
              const Ye = ae(se.property("__zoom"));
              y && clearTimeout(y), Q.value ? (v.move({ event: W, flowTransform: Ye }), v.viewportChange(Ye), y = setTimeout(() => {
                v.moveEnd({ event: W, flowTransform: Ye }), v.viewportChangeEnd(Ye), Q.value = !1;
              }, 150)) : (Q.value = !0, v.moveStart({ event: W, flowTransform: Ye }), v.viewportChangeStart(Ye));
            },
            { passive: !1 }
          ) : typeof D < "u" && se.on(
            "wheel.zoom",
            function(W, re) {
              const le = !_.value && W.type === "wheel" && !W.ctrlKey, ve = E.value || w.value, pe = h.value && W.ctrlKey;
              if (!ve && !u.value && !pe && W.type === "wheel" || le || me(W, m.value))
                return null;
              W.preventDefault(), D.call(this, W, re);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function j(ge, be) {
      return be === 2 && Array.isArray(ge) && ge.includes(2);
    }
    function ee(ge, be) {
      return ge.x !== be.x && !Number.isNaN(be.x) || ge.y !== be.y && !Number.isNaN(be.y) || ge.zoom !== be.k && !Number.isNaN(be.k);
    }
    function ae(ge) {
      return {
        x: ge.x,
        y: ge.y,
        zoom: ge.k
      };
    }
    function me(ge, be) {
      return ge.target.closest(`.${be}`);
    }
    return (ge, be) => (A(), G("div", {
      ref_key: "viewportRef",
      ref: M,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      ze(Rm, {
        "is-selecting": q.value,
        "selection-key-pressed": oe(z),
        class: Me({
          connecting: Y.value,
          dragging: oe(O),
          draggable: oe(d) === !0 || Array.isArray(oe(d)) && oe(d).includes(0)
        })
      }, {
        default: ct(() => [
          ze(Bm, null, {
            default: ct(() => [
              Be(ge.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), Hm = ["id"], Fm = ["id"], Gm = ["id"], Ym = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, Um = /* @__PURE__ */ xe({
  ...Ym,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Pe();
    return (i, a) => (A(), G(ye, null, [
      I("div", {
        id: `${oe(Xu)}-${oe(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + he(oe(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, Hm),
      I("div", {
        id: `${oe(Wu)}-${oe(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, Fm),
      oe(n) ? de("", !0) : (A(), G("div", {
        key: 0,
        id: `${oe(uv)}-${oe(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, he(oe(o)), 9, Gm))
    ], 64));
  }
});
function qm() {
  const e = Pe();
  Ee(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function Xm(e, t, n) {
  return n === ue.Left ? e - t : n === ue.Right ? e + t : e;
}
function Wm(e, t, n) {
  return n === ue.Top ? e - t : n === ue.Bottom ? e + t : e;
}
const Da = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = ue.Top,
  type: i
}) {
  return De("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: Xm(t, e, o),
    cy: Wm(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
Da.props = ["radius", "centerX", "centerY", "position", "type"];
Da.compatConfig = { MODE: 3 };
const Ys = Da, Km = xe({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: a,
      nodesSelectionActive: r,
      noPanClassName: s,
      getEdgeTypes: u,
      removeSelectedEdges: c,
      findEdge: l,
      findNode: d,
      isValidConnection: f,
      multiSelectionActive: h,
      disableKeyboardA11y: w,
      elementsSelectable: _,
      edgesUpdatable: m,
      edgesFocusable: p,
      hooks: v
    } = Pe(), g = ne(() => l(e.id)), { emit: b, on: O } = Lv(g.value, a), F = xt(hi), K = wn(), N = fe(!1), C = fe(!1), M = fe(""), B = fe(null), S = fe("source"), Q = fe(null), y = Te(
      () => typeof g.value.selectable > "u" ? _.value : g.value.selectable
    ), P = Te(() => typeof g.value.updatable > "u" ? m.value : g.value.updatable), $ = Te(() => typeof g.value.focusable > "u" ? p.value : g.value.focusable);
    St(Rv, e.id), St(zv, Q);
    const X = ne(() => g.value.class instanceof Function ? g.value.class(g.value) : g.value.class), U = ne(() => g.value.style instanceof Function ? g.value.style(g.value) : g.value.style), z = ne(() => {
      const T = g.value.type || "default", R = F?.[`edge-${T}`];
      if (R)
        return R;
      let Z = g.value.template ?? u.value[T];
      if (typeof Z == "string" && K) {
        const W = Object.keys(K.appContext.components);
        W && W.includes(T) && (Z = gu(T, !1));
      }
      return Z && typeof Z != "string" ? Z : (a.error(new Ge(He.EDGE_TYPE_MISSING, Z)), !1);
    }), { handlePointerDown: E } = fc({
      nodeId: M,
      handleId: B,
      type: S,
      isValidConnection: f,
      edgeUpdaterType: S,
      onEdgeUpdate: H,
      onEdgeUpdateEnd: q
    });
    return () => {
      const T = d(g.value.source), R = d(g.value.target), Z = "pathOptions" in g.value ? g.value.pathOptions : {};
      if (!T && !R)
        return a.error(new Ge(He.EDGE_SOURCE_TARGET_MISSING, g.value.id, g.value.source, g.value.target)), null;
      if (!T)
        return a.error(new Ge(He.EDGE_SOURCE_MISSING, g.value.id, g.value.source)), null;
      if (!R)
        return a.error(new Ge(He.EDGE_TARGET_MISSING, g.value.id, g.value.target)), null;
      if (!g.value || g.value.hidden || T.hidden || R.hidden)
        return null;
      let W;
      o.value === Rt.Strict ? W = T.handleBounds.source : W = [...T.handleBounds.source || [], ...T.handleBounds.target || []];
      const re = Ds(W, g.value.sourceHandle);
      let le;
      o.value === Rt.Strict ? le = R.handleBounds.target : le = [...R.handleBounds.target || [], ...R.handleBounds.source || []];
      const ve = Ds(le, g.value.targetHandle), pe = re?.position || ue.Bottom, we = ve?.position || ue.Top, { x: $e, y: Ce } = vn(T, re, pe), { x: at, y: Ye } = vn(R, ve, we);
      return g.value.sourceX = $e, g.value.sourceY = Ce, g.value.targetX = at, g.value.targetY = Ye, De(
        "g",
        {
          ref: Q,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${z.value === !1 ? "default" : g.value.type || "default"}`,
            s.value,
            X.value,
            {
              updating: N.value,
              selected: g.value.selected,
              animated: g.value.animated,
              inactive: !y.value && !v.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: $.value ? 0 : void 0,
          "aria-label": g.value.ariaLabel === null ? void 0 : g.value.ariaLabel ?? `Edge from ${g.value.source} to ${g.value.target}`,
          "aria-describedby": $.value ? `${Wu}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: $.value ? "group" : "img",
          ...g.value.domAttributes,
          onClick: j,
          onContextmenu: ee,
          onDblclick: ae,
          onMouseenter: me,
          onMousemove: ge,
          onMouseleave: be,
          onKeyDown: $.value ? D : void 0
        },
        [
          C.value ? null : De(z.value === !1 ? u.value.default : z.value, {
            id: e.id,
            sourceNode: T,
            targetNode: R,
            source: g.value.source,
            target: g.value.target,
            type: g.value.type,
            updatable: P.value,
            selected: g.value.selected,
            animated: g.value.animated,
            label: g.value.label,
            labelStyle: g.value.labelStyle,
            labelShowBg: g.value.labelShowBg,
            labelBgStyle: g.value.labelBgStyle,
            labelBgPadding: g.value.labelBgPadding,
            labelBgBorderRadius: g.value.labelBgBorderRadius,
            data: g.value.data,
            events: { ...g.value.events, ...O },
            style: U.value,
            markerStart: `url('#${Kn(g.value.markerStart, t)}')`,
            markerEnd: `url('#${Kn(g.value.markerEnd, t)}')`,
            sourcePosition: pe,
            targetPosition: we,
            sourceX: $e,
            sourceY: Ce,
            targetX: at,
            targetY: Ye,
            sourceHandleId: g.value.sourceHandle,
            targetHandleId: g.value.targetHandle,
            interactionWidth: g.value.interactionWidth,
            ...Z
          }),
          [
            P.value === "source" || P.value === !0 ? [
              De(
                "g",
                {
                  onMousedown: ie,
                  onMouseenter: L,
                  onMouseout: te
                },
                De(Ys, {
                  position: pe,
                  centerX: $e,
                  centerY: Ce,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            P.value === "target" || P.value === !0 ? [
              De(
                "g",
                {
                  onMousedown: se,
                  onMouseenter: L,
                  onMouseout: te
                },
                De(Ys, {
                  position: we,
                  centerX: at,
                  centerY: Ye,
                  radius: i.value,
                  type: "target",
                  "data-type": "target"
                })
              )
            ] : null
          ]
        ]
      );
    };
    function L() {
      N.value = !0;
    }
    function te() {
      N.value = !1;
    }
    function H(T, R) {
      b.update({ event: T, edge: g.value, connection: R });
    }
    function q(T) {
      b.updateEnd({ event: T, edge: g.value }), C.value = !1;
    }
    function Y(T, R) {
      T.button === 0 && (C.value = !0, M.value = R ? g.value.target : g.value.source, B.value = (R ? g.value.targetHandle : g.value.sourceHandle) ?? null, S.value = R ? "target" : "source", b.updateStart({ event: T, edge: g.value }), E(T));
    }
    function j(T) {
      var R;
      const Z = { event: T, edge: g.value };
      y.value && (r.value = !1, g.value.selected && h.value ? (c([g.value]), (R = Q.value) == null || R.blur()) : n([g.value])), b.click(Z);
    }
    function ee(T) {
      b.contextMenu({ event: T, edge: g.value });
    }
    function ae(T) {
      b.doubleClick({ event: T, edge: g.value });
    }
    function me(T) {
      b.mouseEnter({ event: T, edge: g.value });
    }
    function ge(T) {
      b.mouseMove({ event: T, edge: g.value });
    }
    function be(T) {
      b.mouseLeave({ event: T, edge: g.value });
    }
    function ie(T) {
      Y(T, !0);
    }
    function se(T) {
      Y(T, !1);
    }
    function D(T) {
      var R;
      !w.value && Ku.includes(T.key) && y.value && (T.key === "Escape" ? ((R = Q.value) == null || R.blur(), c([l(e.id)])) : n([l(e.id)]));
    }
  }
}), Zm = Km, jm = xe({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: a,
      connectionLineType: r,
      connectionLineStyle: s,
      connectionLineOptions: u,
      connectionStatus: c,
      viewport: l,
      findNode: d
    } = Pe(), f = (e = xt(hi)) == null ? void 0 : e["connection-line"], h = ne(() => {
      var v;
      return d((v = o.value) == null ? void 0 : v.nodeId);
    }), w = ne(() => {
      var v;
      return d((v = i.value) == null ? void 0 : v.nodeId) ?? null;
    }), _ = ne(() => ({
      x: (a.value.x - l.value.x) / l.value.zoom,
      y: (a.value.y - l.value.y) / l.value.zoom
    })), m = ne(
      () => u.value.markerStart ? `url(#${Kn(u.value.markerStart, t)})` : ""
    ), p = ne(
      () => u.value.markerEnd ? `url(#${Kn(u.value.markerEnd, t)})` : ""
    );
    return () => {
      var v, g, b;
      if (!h.value || !o.value)
        return null;
      const O = o.value.id, F = o.value.type, K = h.value.handleBounds;
      let N = K?.[F] ?? [];
      if (n.value === Rt.Loose) {
        const U = K?.[F === "source" ? "target" : "source"] ?? [];
        N = [...N, ...U];
      }
      if (!N)
        return null;
      const C = (O ? N.find((U) => U.id === O) : N[0]) ?? null, M = C?.position ?? ue.Top, { x: B, y: S } = vn(h.value, C, M);
      let Q = null;
      w.value && (n.value === Rt.Strict ? Q = ((v = w.value.handleBounds[F === "source" ? "target" : "source"]) == null ? void 0 : v.find(
        (U) => {
          var z;
          return U.id === ((z = i.value) == null ? void 0 : z.id);
        }
      )) || null : Q = ((g = [...w.value.handleBounds.source ?? [], ...w.value.handleBounds.target ?? []]) == null ? void 0 : g.find(
        (U) => {
          var z;
          return U.id === ((z = i.value) == null ? void 0 : z.id);
        }
      )) || null);
      const y = ((b = i.value) == null ? void 0 : b.position) ?? (M ? ta[M] : null);
      if (!M || !y)
        return null;
      const P = r.value ?? u.value.type ?? Vt.Bezier;
      let $ = "";
      const X = {
        sourceX: B,
        sourceY: S,
        sourcePosition: M,
        targetX: _.value.x,
        targetY: _.value.y,
        targetPosition: y
      };
      return P === Vt.Bezier ? [$] = yc(X) : P === Vt.Step ? [$] = oa({
        ...X,
        borderRadius: 0
      }) : P === Vt.SmoothStep ? [$] = oa(X) : P === Vt.SimpleBezier ? [$] = wc(X) : $ = `M${B},${S} ${_.value.x},${_.value.y}`, De(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        De(
          "g",
          { class: "vue-flow__connection" },
          f ? De(f, {
            sourceX: B,
            sourceY: S,
            sourcePosition: M,
            targetX: _.value.x,
            targetY: _.value.y,
            targetPosition: y,
            sourceNode: h.value,
            sourceHandle: C,
            targetNode: w.value,
            targetHandle: Q,
            markerEnd: p.value,
            markerStart: m.value,
            connectionStatus: c.value
          }) : De("path", {
            d: $,
            class: [u.value.class, c.value, "vue-flow__connection-path"],
            style: {
              ...s.value,
              ...u.value.style
            },
            "marker-end": p.value,
            "marker-start": m.value
          })
        )
      );
    };
  }
}), Jm = jm, Qm = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], ey = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, ty = /* @__PURE__ */ xe({
  ...ey,
  props: {
    id: {},
    type: {},
    color: { default: "none" },
    width: { default: 12.5 },
    height: { default: 12.5 },
    markerUnits: { default: "strokeWidth" },
    orient: { default: "auto-start-reverse" },
    strokeWidth: { default: 1 }
  },
  setup(e) {
    return (t, n) => (A(), G("marker", {
      id: t.id,
      class: "vue-flow__arrowhead",
      viewBox: "-10 -10 20 20",
      refX: "0",
      refY: "0",
      markerWidth: `${t.width}`,
      markerHeight: `${t.height}`,
      markerUnits: t.markerUnits,
      orient: t.orient
    }, [
      t.type === oe(qn).ArrowClosed ? (A(), G("polyline", {
        key: 0,
        style: Oe({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : de("", !0),
      t.type === oe(qn).Arrow ? (A(), G("polyline", {
        key: 1,
        style: Oe({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : de("", !0)
    ], 8, Qm));
  }
}), ny = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, oy = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, iy = /* @__PURE__ */ xe({
  ...oy,
  setup(e) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: i } = Pe(), a = ne(() => {
      const r = /* @__PURE__ */ new Set(), s = [], u = (c) => {
        if (c) {
          const l = Kn(c, t);
          r.has(l) || (typeof c == "object" ? s.push({ ...c, id: l, color: c.color || i.value }) : s.push({ id: l, color: i.value, type: c }), r.add(l));
        }
      };
      for (const c of [o.value.markerEnd, o.value.markerStart])
        u(c);
      for (const c of n.value)
        for (const l of [c.markerStart, c.markerEnd])
          u(l);
      return s.sort((c, l) => c.id.localeCompare(l.id));
    });
    return (r, s) => (A(), G("svg", ny, [
      I("defs", null, [
        (A(!0), G(ye, null, Se(a.value, (u) => (A(), Ie(ty, {
          id: u.id,
          key: u.id,
          type: u.type,
          color: u.color,
          width: u.width,
          height: u.height,
          markerUnits: u.markerUnits,
          "stroke-width": u.strokeWidth,
          orient: u.orient
        }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
      ])
    ]));
  }
}), ry = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, ay = /* @__PURE__ */ xe({
  ...ry,
  setup(e) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = Pe();
    return (i, a) => (A(), G(ye, null, [
      ze(iy),
      (A(!0), G(ye, null, Se(oe(n), (r) => (A(), G("svg", {
        key: r.id,
        class: "vue-flow__edges vue-flow__container",
        style: Oe({ zIndex: oe($v)(r, oe(t), oe(o)) })
      }, [
        ze(oe(Zm), {
          id: r.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      ze(oe(Jm))
    ], 64));
  }
}), sy = xe({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: a,
      emits: r,
      removeSelectedNodes: s,
      addSelectedNodes: u,
      updateNodeDimensions: c,
      onUpdateNodeInternals: l,
      getNodeTypes: d,
      nodeExtent: f,
      elevateNodesOnSelect: h,
      disableKeyboardA11y: w,
      ariaLiveMessage: _,
      snapToGrid: m,
      snapGrid: p,
      nodeDragThreshold: v,
      nodesDraggable: g,
      elementsSelectable: b,
      nodesConnectable: O,
      nodesFocusable: F,
      hooks: K
    } = Pe(), N = fe(null);
    St(cc, N), St(uc, e.id);
    const C = xt(hi), M = wn(), B = pc(), { node: S, parentNode: Q } = hc(e.id), { emit: y, on: P } = Gv(S, r), $ = Te(() => typeof S.draggable > "u" ? g.value : S.draggable), X = Te(() => typeof S.selectable > "u" ? b.value : S.selectable), U = Te(() => typeof S.connectable > "u" ? O.value : S.connectable), z = Te(() => typeof S.focusable > "u" ? F.value : S.focusable), E = ne(
      () => X.value || $.value || K.value.nodeClick.hasListeners() || K.value.nodeDoubleClick.hasListeners() || K.value.nodeMouseEnter.hasListeners() || K.value.nodeMouseMove.hasListeners() || K.value.nodeMouseLeave.hasListeners()
    ), L = Te(() => !!S.dimensions.width && !!S.dimensions.height), te = ne(() => {
      const R = S.type || "default", Z = C?.[`node-${R}`];
      if (Z)
        return Z;
      let W = S.template || d.value[R];
      if (typeof W == "string" && M) {
        const re = Object.keys(M.appContext.components);
        re && re.includes(R) && (W = gu(R, !1));
      }
      return W && typeof W != "string" ? W : (r.error(new Ge(He.NODE_TYPE_MISSING, W)), !1);
    }), H = dc({
      id: e.id,
      el: N,
      disabled: () => !$.value,
      selectable: X,
      dragHandle: () => S.dragHandle,
      onStart(R) {
        y.dragStart(R);
      },
      onDrag(R) {
        y.drag(R);
      },
      onStop(R) {
        y.dragStop(R);
      },
      onClick(R) {
        D(R);
      }
    }), q = ne(() => S.class instanceof Function ? S.class(S) : S.class), Y = ne(() => {
      const R = (S.style instanceof Function ? S.style(S) : S.style) || {}, Z = S.width instanceof Function ? S.width(S) : S.width, W = S.height instanceof Function ? S.height(S) : S.height;
      return !R.width && Z && (R.width = typeof Z == "string" ? Z : `${Z}px`), !R.height && W && (R.height = typeof W == "string" ? W : `${W}px`), R;
    }), j = Te(() => Number(S.zIndex ?? Y.value.zIndex ?? 0));
    return l((R) => {
      (R.includes(e.id) || !R.length) && ae();
    }), ot(() => {
      Ee(
        () => S.hidden,
        (R = !1, Z, W) => {
          !R && N.value && (e.resizeObserver.observe(N.value), W(() => {
            N.value && e.resizeObserver.unobserve(N.value);
          }));
        },
        { immediate: !0, flush: "post" }
      );
    }), Ee([() => S.type, () => S.sourcePosition, () => S.targetPosition], () => {
      We(() => {
        c([{ id: e.id, nodeElement: N.value, forceUpdate: !0 }]);
      });
    }), Ee(
      [
        () => S.position.x,
        () => S.position.y,
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.x;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.y;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.computedPosition.z;
        },
        j,
        () => S.selected,
        () => S.dimensions.height,
        () => S.dimensions.width,
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.dimensions.height;
        },
        () => {
          var R;
          return (R = Q.value) == null ? void 0 : R.dimensions.width;
        }
      ],
      ([R, Z, W, re, le, ve]) => {
        const pe = {
          x: R,
          y: Z,
          z: ve + (h.value && S.selected ? 1e3 : 0)
        };
        typeof W < "u" && typeof re < "u" ? S.computedPosition = yv({ x: W, y: re, z: le }, pe) : S.computedPosition = pe;
      },
      { flush: "post", immediate: !0 }
    ), Ee([() => S.extent, f], ([R, Z], [W, re]) => {
      (R !== W || Z !== re) && ee();
    }), S.extent === "parent" || typeof S.extent == "object" && "range" in S.extent && S.extent.range === "parent" ? Yr(() => L).toBe(!0).then(ee) : ee(), () => S.hidden ? null : De(
      "div",
      {
        ref: N,
        "data-id": S.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${te.value === !1 ? "default" : S.type || "default"}`,
          {
            [n.value]: $.value,
            dragging: H?.value,
            draggable: $.value,
            selected: S.selected,
            selectable: X.value,
            parent: S.isParent
          },
          q.value
        ],
        style: {
          visibility: L.value ? "visible" : "hidden",
          zIndex: S.computedPosition.z ?? j.value,
          transform: `translate(${S.computedPosition.x}px,${S.computedPosition.y}px)`,
          pointerEvents: E.value ? "all" : "none",
          ...Y.value
        },
        tabIndex: z.value ? 0 : void 0,
        role: z.value ? "group" : void 0,
        "aria-describedby": w.value ? void 0 : `${Xu}-${t}`,
        "aria-label": S.ariaLabel,
        "aria-roledescription": "node",
        ...S.domAttributes,
        onMouseenter: me,
        onMousemove: ge,
        onMouseleave: be,
        onContextmenu: ie,
        onClick: D,
        onDblclick: se,
        onKeydown: T
      },
      [
        De(te.value === !1 ? d.value.default : te.value, {
          id: S.id,
          type: S.type,
          data: S.data,
          events: { ...S.events, ...P },
          selected: S.selected,
          resizing: S.resizing,
          dragging: H.value,
          connectable: U.value,
          position: S.computedPosition,
          dimensions: S.dimensions,
          isValidTargetPos: S.isValidTargetPos,
          isValidSourcePos: S.isValidSourcePos,
          parent: S.parentNode,
          parentNodeId: S.parentNode,
          zIndex: S.computedPosition.z ?? j.value,
          targetPosition: S.targetPosition,
          sourcePosition: S.sourcePosition,
          label: S.label,
          dragHandle: S.dragHandle,
          onUpdateNodeInternals: ae
        })
      ]
    );
    function ee() {
      const R = S.computedPosition, { computedPosition: Z, position: W } = Ta(
        S,
        m.value ? fi(R, p.value) : R,
        r.error,
        f.value,
        Q.value
      );
      (S.computedPosition.x !== Z.x || S.computedPosition.y !== Z.y) && (S.computedPosition = { ...S.computedPosition, ...Z }), (S.position.x !== W.x || S.position.y !== W.y) && (S.position = W);
    }
    function ae() {
      N.value && c([{ id: e.id, nodeElement: N.value, forceUpdate: !0 }]);
    }
    function me(R) {
      H?.value || y.mouseEnter({ event: R, node: S });
    }
    function ge(R) {
      H?.value || y.mouseMove({ event: R, node: S });
    }
    function be(R) {
      H?.value || y.mouseLeave({ event: R, node: S });
    }
    function ie(R) {
      return y.contextMenu({ event: R, node: S });
    }
    function se(R) {
      return y.doubleClick({ event: R, node: S });
    }
    function D(R) {
      X.value && (!o.value || !$.value || v.value > 0) && na(
        S,
        a.value,
        u,
        s,
        i,
        !1,
        N.value
      ), y.click({ event: R, node: S });
    }
    function T(R) {
      if (!(Qr(R) || w.value))
        if (Ku.includes(R.key) && X.value) {
          const Z = R.key === "Escape";
          na(
            S,
            a.value,
            u,
            s,
            i,
            Z,
            N.value
          );
        } else $.value && S.selected && dn[R.key] && (R.preventDefault(), _.value = `Moved selected node ${R.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~S.position.x}, y: ${~~S.position.y}`, B(
          {
            x: dn[R.key].x,
            y: dn[R.key].y
          },
          R.shiftKey
        ));
    }
  }
}), ly = sy;
function uy(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Pe();
  return ne(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return !1;
    return !0;
  });
}
const cy = { class: "vue-flow__nodes vue-flow__container" }, dy = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, fy = /* @__PURE__ */ xe({
  ...dy,
  setup(e) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = Pe(), i = uy(), a = fe();
    return Ee(
      i,
      (r) => {
        r && We(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), ot(() => {
      a.value = new ResizeObserver((r) => {
        const s = r.map((u) => ({
          id: u.target.getAttribute("data-id"),
          nodeElement: u.target,
          forceUpdate: !0
        }));
        We(() => n(s));
      });
    }), to(() => {
      var r;
      return (r = a.value) == null ? void 0 : r.disconnect();
    }), (r, s) => (A(), G("div", cy, [
      a.value ? (A(!0), G(ye, { key: 0 }, Se(oe(t), (u, c, l, d) => {
        const f = [u.id];
        if (d && d.key === u.id && ef(d, f))
          return d;
        const h = (A(), Ie(oe(ly), {
          id: u.id,
          key: u.id,
          "resize-observer": a.value
        }, null, 8, ["id", "resize-observer"]));
        return h.memo = f, h;
      }, s, 0), 128)) : de("", !0)
    ]));
  }
});
function hy() {
  const { emits: e } = Pe();
  ot(() => {
    if (lc()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e.error(new Ge(He.MISSING_STYLES));
    }
  });
}
const py = /* @__PURE__ */ I("div", { class: "vue-flow__edge-labels" }, null, -1), gy = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, vy = /* @__PURE__ */ xe({
  ...gy,
  props: {
    id: {},
    modelValue: {},
    nodes: {},
    edges: {},
    edgeTypes: {},
    nodeTypes: {},
    connectionMode: {},
    connectionLineType: {},
    connectionLineStyle: { default: void 0 },
    connectionLineOptions: { default: void 0 },
    connectionRadius: {},
    isValidConnection: { type: [Function, null], default: void 0 },
    deleteKeyCode: { default: void 0 },
    selectionKeyCode: { type: [Boolean, null], default: void 0 },
    multiSelectionKeyCode: { default: void 0 },
    zoomActivationKeyCode: { default: void 0 },
    panActivationKeyCode: { default: void 0 },
    snapToGrid: { type: Boolean, default: void 0 },
    snapGrid: {},
    onlyRenderVisibleElements: { type: Boolean, default: void 0 },
    edgesUpdatable: { type: [Boolean, String], default: void 0 },
    nodesDraggable: { type: Boolean, default: void 0 },
    nodesConnectable: { type: Boolean, default: void 0 },
    nodeDragThreshold: {},
    elementsSelectable: { type: Boolean, default: void 0 },
    selectNodesOnDrag: { type: Boolean, default: void 0 },
    panOnDrag: { type: [Boolean, Array], default: void 0 },
    minZoom: {},
    maxZoom: {},
    defaultViewport: {},
    translateExtent: {},
    nodeExtent: {},
    defaultMarkerColor: {},
    zoomOnScroll: { type: Boolean, default: void 0 },
    zoomOnPinch: { type: Boolean, default: void 0 },
    panOnScroll: { type: Boolean, default: void 0 },
    panOnScrollSpeed: {},
    panOnScrollMode: {},
    paneClickDistance: {},
    zoomOnDoubleClick: { type: Boolean, default: void 0 },
    preventScrolling: { type: Boolean, default: void 0 },
    selectionMode: {},
    edgeUpdaterRadius: {},
    fitViewOnInit: { type: Boolean, default: void 0 },
    connectOnClick: { type: Boolean, default: void 0 },
    applyDefault: { type: Boolean, default: void 0 },
    autoConnect: { type: [Boolean, Function], default: void 0 },
    noDragClassName: {},
    noWheelClassName: {},
    noPanClassName: {},
    defaultEdgeOptions: {},
    elevateEdgesOnSelect: { type: Boolean, default: void 0 },
    elevateNodesOnSelect: { type: Boolean, default: void 0 },
    disableKeyboardA11y: { type: Boolean, default: void 0 },
    edgesFocusable: { type: Boolean, default: void 0 },
    nodesFocusable: { type: Boolean, default: void 0 },
    autoPanOnConnect: { type: Boolean, default: void 0 },
    autoPanOnNodeDrag: { type: Boolean, default: void 0 },
    autoPanSpeed: {}
  },
  emits: ["nodesChange", "edgesChange", "nodesInitialized", "paneReady", "init", "updateNodeInternals", "error", "connect", "connectStart", "connectEnd", "clickConnectStart", "clickConnectEnd", "moveStart", "move", "moveEnd", "selectionDragStart", "selectionDrag", "selectionDragStop", "selectionContextMenu", "selectionStart", "selectionEnd", "viewportChangeStart", "viewportChange", "viewportChangeEnd", "paneScroll", "paneClick", "paneContextMenu", "paneMouseEnter", "paneMouseMove", "paneMouseLeave", "edgeUpdate", "edgeContextMenu", "edgeMouseEnter", "edgeMouseMove", "edgeMouseLeave", "edgeDoubleClick", "edgeClick", "edgeUpdateStart", "edgeUpdateEnd", "nodeContextMenu", "nodeMouseEnter", "nodeMouseMove", "nodeMouseLeave", "nodeDoubleClick", "nodeClick", "nodeDragStart", "nodeDrag", "nodeDragStop", "miniMapNodeClick", "miniMapNodeDoubleClick", "miniMapNodeMouseEnter", "miniMapNodeMouseMove", "miniMapNodeMouseLeave", "update:modelValue", "update:nodes", "update:edges"],
  setup(e, { expose: t, emit: n }) {
    const o = e, i = pu(), a = Oi(o, "modelValue", n), r = Oi(o, "nodes", n), s = Oi(o, "edges", n), u = Pe(o), c = Xv({ modelValue: a, nodes: r, edges: s }, o, u);
    return Kv(n, u.hooks), qm(), hy(), St(hi, i), jd(c), t(u), (l, d) => (A(), G("div", {
      ref: oe(u).vueFlowRef,
      class: "vue-flow"
    }, [
      ze(Vm, null, {
        default: ct(() => [
          ze(ay),
          py,
          ze(fy),
          Be(l.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      Be(l.$slots, "default"),
      ze(Um)
    ], 512));
  }
}), my = {
  name: "Panel",
  compatConfig: { MODE: 3 }
}, bc = /* @__PURE__ */ xe({
  ...my,
  props: {
    position: {}
  },
  setup(e) {
    const t = e, { userSelectionActive: n } = Pe(), o = ne(() => `${t.position}`.split("-"));
    return (i, a) => (A(), G("div", {
      class: Me(["vue-flow__panel", o.value]),
      style: Oe({ pointerEvents: oe(n) ? "none" : "all" })
    }, [
      Be(i.$slots, "default")
    ], 6));
  }
});
var Et = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))(Et || {});
const kc = function({ dimensions: e, size: t, color: n }) {
  return De("path", {
    stroke: n,
    "stroke-width": t,
    d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
  });
}, Ec = function({ radius: e, color: t }) {
  return De("circle", { cx: e, cy: e, r: e, fill: t });
};
Et.Lines + "", Et.Dots + "";
const yy = {
  [Et.Dots]: "#81818a",
  [Et.Lines]: "#eee"
}, wy = ["id", "x", "y", "width", "height", "patternTransform"], _y = {
  key: 2,
  height: "100",
  width: "100"
}, by = ["fill"], ky = ["x", "y", "fill"], Ey = {
  name: "Background",
  compatConfig: { MODE: 3 }
}, $y = /* @__PURE__ */ xe({
  ...Ey,
  props: {
    id: {},
    variant: { default: () => Et.Dots },
    gap: { default: 20 },
    size: { default: 1 },
    lineWidth: { default: 1 },
    patternColor: {},
    color: {},
    bgColor: {},
    height: { default: 100 },
    width: { default: 100 },
    x: { default: 0 },
    y: { default: 0 },
    offset: { default: 0 }
  },
  setup(e) {
    const { id: t, viewport: n } = Pe(), o = ne(() => {
      const r = n.value.zoom, [s, u] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], c = [s * r || 1, u * r || 1], l = e.size * r, [d, f] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset], h = [d * r || 1 + c[0] / 2, f * r || 1 + c[1] / 2];
      return {
        scaledGap: c,
        offset: h,
        size: l
      };
    }), i = Te(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), a = Te(() => e.color || e.patternColor || yy[e.variant || Et.Dots]);
    return (r, s) => (A(), G("svg", {
      class: "vue-flow__background vue-flow__container",
      style: Oe({
        height: `${r.height > 100 ? 100 : r.height}%`,
        width: `${r.width > 100 ? 100 : r.width}%`
      })
    }, [
      Be(r.$slots, "pattern-container", { id: i.value }, () => [
        I("pattern", {
          id: i.value,
          x: oe(n).x % o.value.scaledGap[0],
          y: oe(n).y % o.value.scaledGap[1],
          width: o.value.scaledGap[0],
          height: o.value.scaledGap[1],
          patternTransform: `translate(-${o.value.offset[0]},-${o.value.offset[1]})`,
          patternUnits: "userSpaceOnUse"
        }, [
          Be(r.$slots, "pattern", {}, () => [
            r.variant === oe(Et).Lines ? (A(), Ie(oe(kc), {
              key: 0,
              size: r.lineWidth,
              color: a.value,
              dimensions: o.value.scaledGap
            }, null, 8, ["size", "color", "dimensions"])) : r.variant === oe(Et).Dots ? (A(), Ie(oe(Ec), {
              key: 1,
              color: a.value,
              radius: o.value.size / 2
            }, null, 8, ["color", "radius"])) : de("", !0),
            r.bgColor ? (A(), G("svg", _y, [
              I("rect", {
                width: "100%",
                height: "100%",
                fill: r.bgColor
              }, null, 8, by)
            ])) : de("", !0)
          ])
        ], 8, wy)
      ]),
      I("rect", {
        x: r.x,
        y: r.y,
        width: "100%",
        height: "100%",
        fill: `url(#${i.value})`
      }, null, 8, ky),
      Be(r.$slots, "default", { id: i.value })
    ], 4));
  }
}), xy = {
  name: "ControlButton",
  compatConfig: { MODE: 3 }
}, Sy = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, Ny = {
  type: "button",
  class: "vue-flow__controls-button"
};
function Cy(e, t, n, o, i, a) {
  return A(), G("button", Ny, [
    Be(e.$slots, "default")
  ]);
}
const ko = /* @__PURE__ */ Sy(xy, [["render", Cy]]), My = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, Ty = /* @__PURE__ */ I("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }, null, -1), Iy = [
  Ty
];
function Dy(e, t) {
  return A(), G("svg", My, Iy);
}
const Ay = { render: Dy }, Oy = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 5"
}, Py = /* @__PURE__ */ I("path", { d: "M0 0h32v4.2H0z" }, null, -1), Ry = [
  Py
];
function zy(e, t) {
  return A(), G("svg", Oy, Ry);
}
const By = { render: zy }, Ly = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 30"
}, Vy = /* @__PURE__ */ I("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }, null, -1), Hy = [
  Vy
];
function Fy(e, t) {
  return A(), G("svg", Ly, Hy);
}
const Gy = { render: Fy }, Yy = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, Uy = /* @__PURE__ */ I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }, null, -1), qy = [
  Uy
];
function Xy(e, t) {
  return A(), G("svg", Yy, qy);
}
const Wy = { render: Xy }, Ky = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, Zy = /* @__PURE__ */ I("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z" }, null, -1), jy = [
  Zy
];
function Jy(e, t) {
  return A(), G("svg", Ky, jy);
}
const Qy = { render: Jy }, e0 = {
  name: "Controls",
  compatConfig: { MODE: 3 }
}, t0 = /* @__PURE__ */ xe({
  ...e0,
  props: {
    showZoom: { type: Boolean, default: !0 },
    showFitView: { type: Boolean, default: !0 },
    showInteractive: { type: Boolean, default: !0 },
    fitViewParams: {},
    position: { default: () => qu.BottomLeft }
  },
  emits: ["zoomIn", "zoomOut", "fitView", "interactionChange"],
  setup(e, { emit: t }) {
    const {
      nodesDraggable: n,
      nodesConnectable: o,
      elementsSelectable: i,
      setInteractive: a,
      zoomIn: r,
      zoomOut: s,
      fitView: u,
      viewport: c,
      minZoom: l,
      maxZoom: d
    } = Pe(), f = Te(() => n.value || o.value || i.value), h = Te(() => c.value.zoom <= l.value), w = Te(() => c.value.zoom >= d.value);
    function _() {
      r(), t("zoomIn");
    }
    function m() {
      s(), t("zoomOut");
    }
    function p() {
      u(e.fitViewParams), t("fitView");
    }
    function v() {
      a(!f.value), t("interactionChange", !f.value);
    }
    return (g, b) => (A(), Ie(oe(bc), {
      class: "vue-flow__controls",
      position: g.position
    }, {
      default: ct(() => [
        Be(g.$slots, "top"),
        g.showZoom ? (A(), G(ye, { key: 0 }, [
          Be(g.$slots, "control-zoom-in", {}, () => [
            ze(ko, {
              class: "vue-flow__controls-zoomin",
              disabled: w.value,
              onClick: _
            }, {
              default: ct(() => [
                Be(g.$slots, "icon-zoom-in", {}, () => [
                  (A(), Ie(Lt(oe(Ay))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ]),
          Be(g.$slots, "control-zoom-out", {}, () => [
            ze(ko, {
              class: "vue-flow__controls-zoomout",
              disabled: h.value,
              onClick: m
            }, {
              default: ct(() => [
                Be(g.$slots, "icon-zoom-out", {}, () => [
                  (A(), Ie(Lt(oe(By))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ])
        ], 64)) : de("", !0),
        g.showFitView ? Be(g.$slots, "control-fit-view", { key: 1 }, () => [
          ze(ko, {
            class: "vue-flow__controls-fitview",
            onClick: p
          }, {
            default: ct(() => [
              Be(g.$slots, "icon-fit-view", {}, () => [
                (A(), Ie(Lt(oe(Gy))))
              ])
            ]),
            _: 3
          })
        ]) : de("", !0),
        g.showInteractive ? Be(g.$slots, "control-interactive", { key: 2 }, () => [
          g.showInteractive ? (A(), Ie(ko, {
            key: 0,
            class: "vue-flow__controls-interactive",
            onClick: v
          }, {
            default: ct(() => [
              f.value ? Be(g.$slots, "icon-unlock", { key: 0 }, () => [
                (A(), Ie(Lt(oe(Qy))))
              ]) : de("", !0),
              f.value ? de("", !0) : Be(g.$slots, "icon-lock", { key: 1 }, () => [
                (A(), Ie(Lt(oe(Wy))))
              ])
            ]),
            _: 3
          })) : de("", !0)
        ]) : de("", !0),
        Be(g.$slots, "default")
      ]),
      _: 3
    }, 8, ["position"]));
  }
});
var n0 = { value: () => {
} };
function Aa() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Ro(n);
}
function Ro(e) {
  this._ = e;
}
function o0(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Ro.prototype = Aa.prototype = {
  constructor: Ro,
  on: function(e, t) {
    var n = this._, o = o0(e + "", n), i, a = -1, r = o.length;
    if (arguments.length < 2) {
      for (; ++a < r; ) if ((i = (e = o[a]).type) && (i = i0(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++a < r; )
      if (i = (e = o[a]).type) n[i] = Us(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = Us(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new Ro(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), o = 0, i, a; o < i; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (a = this._[e], o = 0, i = a.length; o < i; ++o) a[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, a = o.length; i < a; ++i) o[i].value.apply(t, n);
  }
};
function i0(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function Us(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = n0, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var ia = "http://www.w3.org/1999/xhtml";
const qs = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: ia,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function yi(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), qs.hasOwnProperty(t) ? { space: qs[t], local: e } : e;
}
function r0(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === ia && t.documentElement.namespaceURI === ia ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function a0(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function $c(e) {
  var t = yi(e);
  return (t.local ? a0 : r0)(t);
}
function s0() {
}
function Oa(e) {
  return e == null ? s0 : function() {
    return this.querySelector(e);
  };
}
function l0(e) {
  typeof e != "function" && (e = Oa(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = new Array(r), u, c, l = 0; l < r; ++l)
      (u = a[l]) && (c = e.call(u, u.__data__, l, a)) && ("__data__" in u && (c.__data__ = u.__data__), s[l] = c);
  return new Je(o, this._parents);
}
function u0(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function c0() {
  return [];
}
function xc(e) {
  return e == null ? c0 : function() {
    return this.querySelectorAll(e);
  };
}
function d0(e) {
  return function() {
    return u0(e.apply(this, arguments));
  };
}
function f0(e) {
  typeof e == "function" ? e = d0(e) : e = xc(e);
  for (var t = this._groups, n = t.length, o = [], i = [], a = 0; a < n; ++a)
    for (var r = t[a], s = r.length, u, c = 0; c < s; ++c)
      (u = r[c]) && (o.push(e.call(u, u.__data__, c, r)), i.push(u));
  return new Je(o, i);
}
function Sc(e) {
  return function() {
    return this.matches(e);
  };
}
function Nc(e) {
  return function(t) {
    return t.matches(e);
  };
}
var h0 = Array.prototype.find;
function p0(e) {
  return function() {
    return h0.call(this.children, e);
  };
}
function g0() {
  return this.firstElementChild;
}
function v0(e) {
  return this.select(e == null ? g0 : p0(typeof e == "function" ? e : Nc(e)));
}
var m0 = Array.prototype.filter;
function y0() {
  return Array.from(this.children);
}
function w0(e) {
  return function() {
    return m0.call(this.children, e);
  };
}
function _0(e) {
  return this.selectAll(e == null ? y0 : w0(typeof e == "function" ? e : Nc(e)));
}
function b0(e) {
  typeof e != "function" && (e = Sc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = [], u, c = 0; c < r; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Je(o, this._parents);
}
function Cc(e) {
  return new Array(e.length);
}
function k0() {
  return new Je(this._enter || this._groups.map(Cc), this._parents);
}
function Jo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
Jo.prototype = {
  constructor: Jo,
  appendChild: function(e) {
    return this._parent.insertBefore(e, this._next);
  },
  insertBefore: function(e, t) {
    return this._parent.insertBefore(e, t);
  },
  querySelector: function(e) {
    return this._parent.querySelector(e);
  },
  querySelectorAll: function(e) {
    return this._parent.querySelectorAll(e);
  }
};
function E0(e) {
  return function() {
    return e;
  };
}
function $0(e, t, n, o, i, a) {
  for (var r = 0, s, u = t.length, c = a.length; r < c; ++r)
    (s = t[r]) ? (s.__data__ = a[r], o[r] = s) : n[r] = new Jo(e, a[r]);
  for (; r < u; ++r)
    (s = t[r]) && (i[r] = s);
}
function x0(e, t, n, o, i, a, r) {
  var s, u, c = /* @__PURE__ */ new Map(), l = t.length, d = a.length, f = new Array(l), h;
  for (s = 0; s < l; ++s)
    (u = t[s]) && (f[s] = h = r.call(u, u.__data__, s, t) + "", c.has(h) ? i[s] = u : c.set(h, u));
  for (s = 0; s < d; ++s)
    h = r.call(e, a[s], s, a) + "", (u = c.get(h)) ? (o[s] = u, u.__data__ = a[s], c.delete(h)) : n[s] = new Jo(e, a[s]);
  for (s = 0; s < l; ++s)
    (u = t[s]) && c.get(f[s]) === u && (i[s] = u);
}
function S0(e) {
  return e.__data__;
}
function N0(e, t) {
  if (!arguments.length) return Array.from(this, S0);
  var n = t ? x0 : $0, o = this._parents, i = this._groups;
  typeof e != "function" && (e = E0(e));
  for (var a = i.length, r = new Array(a), s = new Array(a), u = new Array(a), c = 0; c < a; ++c) {
    var l = o[c], d = i[c], f = d.length, h = C0(e.call(l, l && l.__data__, c, o)), w = h.length, _ = s[c] = new Array(w), m = r[c] = new Array(w), p = u[c] = new Array(f);
    n(l, d, _, m, p, h, t);
    for (var v = 0, g = 0, b, O; v < w; ++v)
      if (b = _[v]) {
        for (v >= g && (g = v + 1); !(O = m[g]) && ++g < w; ) ;
        b._next = O || null;
      }
  }
  return r = new Je(r, o), r._enter = s, r._exit = u, r;
}
function C0(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function M0() {
  return new Je(this._exit || this._groups.map(Cc), this._parents);
}
function T0(e, t, n) {
  var o = this.enter(), i = this, a = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? a.remove() : n(a), o && i ? o.merge(i).order() : i;
}
function I0(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, a = o.length, r = Math.min(i, a), s = new Array(i), u = 0; u < r; ++u)
    for (var c = n[u], l = o[u], d = c.length, f = s[u] = new Array(d), h, w = 0; w < d; ++w)
      (h = c[w] || l[w]) && (f[w] = h);
  for (; u < i; ++u)
    s[u] = n[u];
  return new Je(s, this._parents);
}
function D0() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, a = o[i], r; --i >= 0; )
      (r = o[i]) && (a && r.compareDocumentPosition(a) ^ 4 && a.parentNode.insertBefore(r, a), a = r);
  return this;
}
function A0(e) {
  e || (e = O0);
  function t(d, f) {
    return d && f ? e(d.__data__, f.__data__) : !d - !f;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), a = 0; a < o; ++a) {
    for (var r = n[a], s = r.length, u = i[a] = new Array(s), c, l = 0; l < s; ++l)
      (c = r[l]) && (u[l] = c);
    u.sort(t);
  }
  return new Je(i, this._parents).order();
}
function O0(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function P0() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function R0() {
  return Array.from(this);
}
function z0() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, a = o.length; i < a; ++i) {
      var r = o[i];
      if (r) return r;
    }
  return null;
}
function B0() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function L0() {
  return !this.node();
}
function V0(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], a = 0, r = i.length, s; a < r; ++a)
      (s = i[a]) && e.call(s, s.__data__, a, i);
  return this;
}
function H0(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function F0(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function G0(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function Y0(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function U0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function q0(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function X0(e, t) {
  var n = yi(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? F0 : H0 : typeof t == "function" ? n.local ? q0 : U0 : n.local ? Y0 : G0)(n, t));
}
function Mc(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function W0(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function K0(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Z0(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function j0(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? W0 : typeof t == "function" ? Z0 : K0)(e, t, n ?? "")) : mn(this.node(), e);
}
function mn(e, t) {
  return e.style.getPropertyValue(t) || Mc(e).getComputedStyle(e, null).getPropertyValue(t);
}
function J0(e) {
  return function() {
    delete this[e];
  };
}
function Q0(e, t) {
  return function() {
    this[e] = t;
  };
}
function e1(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function t1(e, t) {
  return arguments.length > 1 ? this.each((t == null ? J0 : typeof t == "function" ? e1 : Q0)(e, t)) : this.node()[e];
}
function Tc(e) {
  return e.trim().split(/^|\s+/);
}
function Pa(e) {
  return e.classList || new Ic(e);
}
function Ic(e) {
  this._node = e, this._names = Tc(e.getAttribute("class") || "");
}
Ic.prototype = {
  add: function(e) {
    var t = this._names.indexOf(e);
    t < 0 && (this._names.push(e), this._node.setAttribute("class", this._names.join(" ")));
  },
  remove: function(e) {
    var t = this._names.indexOf(e);
    t >= 0 && (this._names.splice(t, 1), this._node.setAttribute("class", this._names.join(" ")));
  },
  contains: function(e) {
    return this._names.indexOf(e) >= 0;
  }
};
function Dc(e, t) {
  for (var n = Pa(e), o = -1, i = t.length; ++o < i; ) n.add(t[o]);
}
function Ac(e, t) {
  for (var n = Pa(e), o = -1, i = t.length; ++o < i; ) n.remove(t[o]);
}
function n1(e) {
  return function() {
    Dc(this, e);
  };
}
function o1(e) {
  return function() {
    Ac(this, e);
  };
}
function i1(e, t) {
  return function() {
    (t.apply(this, arguments) ? Dc : Ac)(this, e);
  };
}
function r1(e, t) {
  var n = Tc(e + "");
  if (arguments.length < 2) {
    for (var o = Pa(this.node()), i = -1, a = n.length; ++i < a; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? i1 : t ? n1 : o1)(n, t));
}
function a1() {
  this.textContent = "";
}
function s1(e) {
  return function() {
    this.textContent = e;
  };
}
function l1(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function u1(e) {
  return arguments.length ? this.each(e == null ? a1 : (typeof e == "function" ? l1 : s1)(e)) : this.node().textContent;
}
function c1() {
  this.innerHTML = "";
}
function d1(e) {
  return function() {
    this.innerHTML = e;
  };
}
function f1(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function h1(e) {
  return arguments.length ? this.each(e == null ? c1 : (typeof e == "function" ? f1 : d1)(e)) : this.node().innerHTML;
}
function p1() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function g1() {
  return this.each(p1);
}
function v1() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function m1() {
  return this.each(v1);
}
function y1(e) {
  var t = typeof e == "function" ? e : $c(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function w1() {
  return null;
}
function _1(e, t) {
  var n = typeof e == "function" ? e : $c(e), o = t == null ? w1 : typeof t == "function" ? t : Oa(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function b1() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function k1() {
  return this.each(b1);
}
function E1() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function $1() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function x1(e) {
  return this.select(e ? $1 : E1);
}
function S1(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function N1(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function C1(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function M1(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, a; n < i; ++n)
        a = t[n], (!e.type || a.type === e.type) && a.name === e.name ? this.removeEventListener(a.type, a.listener, a.options) : t[++o] = a;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function T1(e, t, n) {
  return function() {
    var o = this.__on, i, a = N1(t);
    if (o) {
      for (var r = 0, s = o.length; r < s; ++r)
        if ((i = o[r]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = a, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, a, n), i = { type: e.type, name: e.name, value: t, listener: a, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function I1(e, t, n) {
  var o = C1(e + ""), i, a = o.length, r;
  if (arguments.length < 2) {
    var s = this.node().__on;
    if (s) {
      for (var u = 0, c = s.length, l; u < c; ++u)
        for (i = 0, l = s[u]; i < a; ++i)
          if ((r = o[i]).type === l.type && r.name === l.name)
            return l.value;
    }
    return;
  }
  for (s = t ? T1 : M1, i = 0; i < a; ++i) this.each(s(o[i], t, n));
  return this;
}
function Oc(e, t, n) {
  var o = Mc(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function D1(e, t) {
  return function() {
    return Oc(this, e, t);
  };
}
function A1(e, t) {
  return function() {
    return Oc(this, e, t.apply(this, arguments));
  };
}
function O1(e, t) {
  return this.each((typeof t == "function" ? A1 : D1)(e, t));
}
function* P1() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, a = o.length, r; i < a; ++i)
      (r = o[i]) && (yield r);
}
var Pc = [null];
function Je(e, t) {
  this._groups = e, this._parents = t;
}
function ro() {
  return new Je([[document.documentElement]], Pc);
}
function R1() {
  return this;
}
Je.prototype = ro.prototype = {
  constructor: Je,
  select: l0,
  selectAll: f0,
  selectChild: v0,
  selectChildren: _0,
  filter: b0,
  data: N0,
  enter: k0,
  exit: M0,
  join: T0,
  merge: I0,
  selection: R1,
  order: D0,
  sort: A0,
  call: P0,
  nodes: R0,
  node: z0,
  size: B0,
  empty: L0,
  each: V0,
  attr: X0,
  style: j0,
  property: t1,
  classed: r1,
  text: u1,
  html: h1,
  raise: g1,
  lower: m1,
  append: y1,
  insert: _1,
  remove: k1,
  clone: x1,
  datum: S1,
  on: I1,
  dispatch: O1,
  [Symbol.iterator]: P1
};
function Ot(e) {
  return typeof e == "string" ? new Je([[document.querySelector(e)]], [document.documentElement]) : new Je([[e]], Pc);
}
function z1(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function It(e, t) {
  if (e = z1(e), t === void 0 && (t = e.currentTarget), t) {
    var n = t.ownerSVGElement || t;
    if (n.createSVGPoint) {
      var o = n.createSVGPoint();
      return o.x = e.clientX, o.y = e.clientY, o = o.matrixTransform(t.getScreenCTM().inverse()), [o.x, o.y];
    }
    if (t.getBoundingClientRect) {
      var i = t.getBoundingClientRect();
      return [e.clientX - i.left - t.clientLeft, e.clientY - i.top - t.clientTop];
    }
  }
  return [e.pageX, e.pageY];
}
const ra = { capture: !0, passive: !1 };
function aa(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function B1(e) {
  var t = e.document.documentElement, n = Ot(e).on("dragstart.drag", aa, ra);
  "onselectstart" in t ? n.on("selectstart.drag", aa, ra) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function L1(e, t) {
  var n = e.document.documentElement, o = Ot(e).on("dragstart.drag", null);
  t && (o.on("click.drag", aa, ra), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Ra(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Rc(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function ao() {
}
var jn = 0.7, Qo = 1 / jn, fn = "\\s*([+-]?\\d+)\\s*", Jn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", pt = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", V1 = /^#([0-9a-f]{3,8})$/, H1 = new RegExp(`^rgb\\(${fn},${fn},${fn}\\)$`), F1 = new RegExp(`^rgb\\(${pt},${pt},${pt}\\)$`), G1 = new RegExp(`^rgba\\(${fn},${fn},${fn},${Jn}\\)$`), Y1 = new RegExp(`^rgba\\(${pt},${pt},${pt},${Jn}\\)$`), U1 = new RegExp(`^hsl\\(${Jn},${pt},${pt}\\)$`), q1 = new RegExp(`^hsla\\(${Jn},${pt},${pt},${Jn}\\)$`), Xs = {
  aliceblue: 15792383,
  antiquewhite: 16444375,
  aqua: 65535,
  aquamarine: 8388564,
  azure: 15794175,
  beige: 16119260,
  bisque: 16770244,
  black: 0,
  blanchedalmond: 16772045,
  blue: 255,
  blueviolet: 9055202,
  brown: 10824234,
  burlywood: 14596231,
  cadetblue: 6266528,
  chartreuse: 8388352,
  chocolate: 13789470,
  coral: 16744272,
  cornflowerblue: 6591981,
  cornsilk: 16775388,
  crimson: 14423100,
  cyan: 65535,
  darkblue: 139,
  darkcyan: 35723,
  darkgoldenrod: 12092939,
  darkgray: 11119017,
  darkgreen: 25600,
  darkgrey: 11119017,
  darkkhaki: 12433259,
  darkmagenta: 9109643,
  darkolivegreen: 5597999,
  darkorange: 16747520,
  darkorchid: 10040012,
  darkred: 9109504,
  darksalmon: 15308410,
  darkseagreen: 9419919,
  darkslateblue: 4734347,
  darkslategray: 3100495,
  darkslategrey: 3100495,
  darkturquoise: 52945,
  darkviolet: 9699539,
  deeppink: 16716947,
  deepskyblue: 49151,
  dimgray: 6908265,
  dimgrey: 6908265,
  dodgerblue: 2003199,
  firebrick: 11674146,
  floralwhite: 16775920,
  forestgreen: 2263842,
  fuchsia: 16711935,
  gainsboro: 14474460,
  ghostwhite: 16316671,
  gold: 16766720,
  goldenrod: 14329120,
  gray: 8421504,
  green: 32768,
  greenyellow: 11403055,
  grey: 8421504,
  honeydew: 15794160,
  hotpink: 16738740,
  indianred: 13458524,
  indigo: 4915330,
  ivory: 16777200,
  khaki: 15787660,
  lavender: 15132410,
  lavenderblush: 16773365,
  lawngreen: 8190976,
  lemonchiffon: 16775885,
  lightblue: 11393254,
  lightcoral: 15761536,
  lightcyan: 14745599,
  lightgoldenrodyellow: 16448210,
  lightgray: 13882323,
  lightgreen: 9498256,
  lightgrey: 13882323,
  lightpink: 16758465,
  lightsalmon: 16752762,
  lightseagreen: 2142890,
  lightskyblue: 8900346,
  lightslategray: 7833753,
  lightslategrey: 7833753,
  lightsteelblue: 11584734,
  lightyellow: 16777184,
  lime: 65280,
  limegreen: 3329330,
  linen: 16445670,
  magenta: 16711935,
  maroon: 8388608,
  mediumaquamarine: 6737322,
  mediumblue: 205,
  mediumorchid: 12211667,
  mediumpurple: 9662683,
  mediumseagreen: 3978097,
  mediumslateblue: 8087790,
  mediumspringgreen: 64154,
  mediumturquoise: 4772300,
  mediumvioletred: 13047173,
  midnightblue: 1644912,
  mintcream: 16121850,
  mistyrose: 16770273,
  moccasin: 16770229,
  navajowhite: 16768685,
  navy: 128,
  oldlace: 16643558,
  olive: 8421376,
  olivedrab: 7048739,
  orange: 16753920,
  orangered: 16729344,
  orchid: 14315734,
  palegoldenrod: 15657130,
  palegreen: 10025880,
  paleturquoise: 11529966,
  palevioletred: 14381203,
  papayawhip: 16773077,
  peachpuff: 16767673,
  peru: 13468991,
  pink: 16761035,
  plum: 14524637,
  powderblue: 11591910,
  purple: 8388736,
  rebeccapurple: 6697881,
  red: 16711680,
  rosybrown: 12357519,
  royalblue: 4286945,
  saddlebrown: 9127187,
  salmon: 16416882,
  sandybrown: 16032864,
  seagreen: 3050327,
  seashell: 16774638,
  sienna: 10506797,
  silver: 12632256,
  skyblue: 8900331,
  slateblue: 6970061,
  slategray: 7372944,
  slategrey: 7372944,
  snow: 16775930,
  springgreen: 65407,
  steelblue: 4620980,
  tan: 13808780,
  teal: 32896,
  thistle: 14204888,
  tomato: 16737095,
  turquoise: 4251856,
  violet: 15631086,
  wheat: 16113331,
  white: 16777215,
  whitesmoke: 16119285,
  yellow: 16776960,
  yellowgreen: 10145074
};
Ra(ao, Qn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ws,
  // Deprecated! Use color.formatHex.
  formatHex: Ws,
  formatHex8: X1,
  formatHsl: W1,
  formatRgb: Ks,
  toString: Ks
});
function Ws() {
  return this.rgb().formatHex();
}
function X1() {
  return this.rgb().formatHex8();
}
function W1() {
  return zc(this).formatHsl();
}
function Ks() {
  return this.rgb().formatRgb();
}
function Qn(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = V1.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Zs(t) : n === 3 ? new Xe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Eo(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Eo(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = H1.exec(e)) ? new Xe(t[1], t[2], t[3], 1) : (t = F1.exec(e)) ? new Xe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = G1.exec(e)) ? Eo(t[1], t[2], t[3], t[4]) : (t = Y1.exec(e)) ? Eo(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = U1.exec(e)) ? Qs(t[1], t[2] / 100, t[3] / 100, 1) : (t = q1.exec(e)) ? Qs(t[1], t[2] / 100, t[3] / 100, t[4]) : Xs.hasOwnProperty(e) ? Zs(Xs[e]) : e === "transparent" ? new Xe(NaN, NaN, NaN, 0) : null;
}
function Zs(e) {
  return new Xe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Eo(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Xe(e, t, n, o);
}
function K1(e) {
  return e instanceof ao || (e = Qn(e)), e ? (e = e.rgb(), new Xe(e.r, e.g, e.b, e.opacity)) : new Xe();
}
function sa(e, t, n, o) {
  return arguments.length === 1 ? K1(e) : new Xe(e, t, n, o ?? 1);
}
function Xe(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Ra(Xe, sa, Rc(ao, {
  brighter(e) {
    return e = e == null ? Qo : Math.pow(Qo, e), new Xe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? jn : Math.pow(jn, e), new Xe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Xe(Kt(this.r), Kt(this.g), Kt(this.b), ei(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: js,
  // Deprecated! Use color.formatHex.
  formatHex: js,
  formatHex8: Z1,
  formatRgb: Js,
  toString: Js
}));
function js() {
  return `#${Yt(this.r)}${Yt(this.g)}${Yt(this.b)}`;
}
function Z1() {
  return `#${Yt(this.r)}${Yt(this.g)}${Yt(this.b)}${Yt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function Js() {
  const e = ei(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Kt(this.r)}, ${Kt(this.g)}, ${Kt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function ei(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Kt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Yt(e) {
  return e = Kt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Qs(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new tt(e, t, n, o);
}
function zc(e) {
  if (e instanceof tt) return new tt(e.h, e.s, e.l, e.opacity);
  if (e instanceof ao || (e = Qn(e)), !e) return new tt();
  if (e instanceof tt) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), a = Math.max(t, n, o), r = NaN, s = a - i, u = (a + i) / 2;
  return s ? (t === a ? r = (n - o) / s + (n < o) * 6 : n === a ? r = (o - t) / s + 2 : r = (t - n) / s + 4, s /= u < 0.5 ? a + i : 2 - a - i, r *= 60) : s = u > 0 && u < 1 ? 0 : r, new tt(r, s, u, e.opacity);
}
function j1(e, t, n, o) {
  return arguments.length === 1 ? zc(e) : new tt(e, t, n, o ?? 1);
}
function tt(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Ra(tt, j1, Rc(ao, {
  brighter(e) {
    return e = e == null ? Qo : Math.pow(Qo, e), new tt(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? jn : Math.pow(jn, e), new tt(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new Xe(
      Ui(e >= 240 ? e - 240 : e + 120, i, o),
      Ui(e, i, o),
      Ui(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new tt(el(this.h), $o(this.s), $o(this.l), ei(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = ei(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${el(this.h)}, ${$o(this.s) * 100}%, ${$o(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function el(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function $o(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Ui(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Bc = (e) => () => e;
function J1(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Q1(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function ew(e) {
  return (e = +e) == 1 ? Lc : function(t, n) {
    return n - t ? Q1(t, n, e) : Bc(isNaN(t) ? n : t);
  };
}
function Lc(e, t) {
  var n = t - e;
  return n ? J1(e, n) : Bc(isNaN(e) ? t : e);
}
const tl = (function e(t) {
  var n = ew(t);
  function o(i, a) {
    var r = n((i = sa(i)).r, (a = sa(a)).r), s = n(i.g, a.g), u = n(i.b, a.b), c = Lc(i.opacity, a.opacity);
    return function(l) {
      return i.r = r(l), i.g = s(l), i.b = u(l), i.opacity = c(l), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function At(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var la = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, qi = new RegExp(la.source, "g");
function tw(e) {
  return function() {
    return e;
  };
}
function nw(e) {
  return function(t) {
    return e(t) + "";
  };
}
function ow(e, t) {
  var n = la.lastIndex = qi.lastIndex = 0, o, i, a, r = -1, s = [], u = [];
  for (e = e + "", t = t + ""; (o = la.exec(e)) && (i = qi.exec(t)); )
    (a = i.index) > n && (a = t.slice(n, a), s[r] ? s[r] += a : s[++r] = a), (o = o[0]) === (i = i[0]) ? s[r] ? s[r] += i : s[++r] = i : (s[++r] = null, u.push({ i: r, x: At(o, i) })), n = qi.lastIndex;
  return n < t.length && (a = t.slice(n), s[r] ? s[r] += a : s[++r] = a), s.length < 2 ? u[0] ? nw(u[0].x) : tw(t) : (t = u.length, function(c) {
    for (var l = 0, d; l < t; ++l) s[(d = u[l]).i] = d.x(c);
    return s.join("");
  });
}
var nl = 180 / Math.PI, ua = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function Vc(e, t, n, o, i, a) {
  var r, s, u;
  return (r = Math.sqrt(e * e + t * t)) && (e /= r, t /= r), (u = e * n + t * o) && (n -= e * u, o -= t * u), (s = Math.sqrt(n * n + o * o)) && (n /= s, o /= s, u /= s), e * o < t * n && (e = -e, t = -t, u = -u, r = -r), {
    translateX: i,
    translateY: a,
    rotate: Math.atan2(t, e) * nl,
    skewX: Math.atan(u) * nl,
    scaleX: r,
    scaleY: s
  };
}
var xo;
function iw(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ua : Vc(t.a, t.b, t.c, t.d, t.e, t.f);
}
function rw(e) {
  return e == null || (xo || (xo = document.createElementNS("http://www.w3.org/2000/svg", "g")), xo.setAttribute("transform", e), !(e = xo.transform.baseVal.consolidate())) ? ua : (e = e.matrix, Vc(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Hc(e, t, n, o) {
  function i(c) {
    return c.length ? c.pop() + " " : "";
  }
  function a(c, l, d, f, h, w) {
    if (c !== d || l !== f) {
      var _ = h.push("translate(", null, t, null, n);
      w.push({ i: _ - 4, x: At(c, d) }, { i: _ - 2, x: At(l, f) });
    } else (d || f) && h.push("translate(" + d + t + f + n);
  }
  function r(c, l, d, f) {
    c !== l ? (c - l > 180 ? l += 360 : l - c > 180 && (c += 360), f.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: At(c, l) })) : l && d.push(i(d) + "rotate(" + l + o);
  }
  function s(c, l, d, f) {
    c !== l ? f.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: At(c, l) }) : l && d.push(i(d) + "skewX(" + l + o);
  }
  function u(c, l, d, f, h, w) {
    if (c !== d || l !== f) {
      var _ = h.push(i(h) + "scale(", null, ",", null, ")");
      w.push({ i: _ - 4, x: At(c, d) }, { i: _ - 2, x: At(l, f) });
    } else (d !== 1 || f !== 1) && h.push(i(h) + "scale(" + d + "," + f + ")");
  }
  return function(c, l) {
    var d = [], f = [];
    return c = e(c), l = e(l), a(c.translateX, c.translateY, l.translateX, l.translateY, d, f), r(c.rotate, l.rotate, d, f), s(c.skewX, l.skewX, d, f), u(c.scaleX, c.scaleY, l.scaleX, l.scaleY, d, f), c = l = null, function(h) {
      for (var w = -1, _ = f.length, m; ++w < _; ) d[(m = f[w]).i] = m.x(h);
      return d.join("");
    };
  };
}
var aw = Hc(iw, "px, ", "px)", "deg)"), sw = Hc(rw, ", ", ")", ")"), lw = 1e-12;
function ol(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function uw(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function cw(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const dw = (function e(t, n, o) {
  function i(a, r) {
    var s = a[0], u = a[1], c = a[2], l = r[0], d = r[1], f = r[2], h = l - s, w = d - u, _ = h * h + w * w, m, p;
    if (_ < lw)
      p = Math.log(f / c) / t, m = function(K) {
        return [
          s + K * h,
          u + K * w,
          c * Math.exp(t * K * p)
        ];
      };
    else {
      var v = Math.sqrt(_), g = (f * f - c * c + o * _) / (2 * c * n * v), b = (f * f - c * c - o * _) / (2 * f * n * v), O = Math.log(Math.sqrt(g * g + 1) - g), F = Math.log(Math.sqrt(b * b + 1) - b);
      p = (F - O) / t, m = function(K) {
        var N = K * p, C = ol(O), M = c / (n * v) * (C * cw(t * N + O) - uw(O));
        return [
          s + M * h,
          u + M * w,
          c * C / ol(t * N + O)
        ];
      };
    }
    return m.duration = p * 1e3 * t / Math.SQRT2, m;
  }
  return i.rho = function(a) {
    var r = Math.max(1e-3, +a), s = r * r, u = s * s;
    return e(r, s, u);
  }, i;
})(Math.SQRT2, 2, 4);
var yn = 0, An = 0, Cn = 0, Fc = 1e3, ti, On, ni = 0, Qt = 0, wi = 0, eo = typeof performance == "object" && performance.now ? performance : Date, Gc = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function za() {
  return Qt || (Gc(fw), Qt = eo.now() + wi);
}
function fw() {
  Qt = 0;
}
function oi() {
  this._call = this._time = this._next = null;
}
oi.prototype = Yc.prototype = {
  constructor: oi,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? za() : +n) + (t == null ? 0 : +t), !this._next && On !== this && (On ? On._next = this : ti = this, On = this), this._call = e, this._time = n, ca();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, ca());
  }
};
function Yc(e, t, n) {
  var o = new oi();
  return o.restart(e, t, n), o;
}
function hw() {
  za(), ++yn;
  for (var e = ti, t; e; )
    (t = Qt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --yn;
}
function il() {
  Qt = (ni = eo.now()) + wi, yn = An = 0;
  try {
    hw();
  } finally {
    yn = 0, gw(), Qt = 0;
  }
}
function pw() {
  var e = eo.now(), t = e - ni;
  t > Fc && (wi -= t, ni = e);
}
function gw() {
  for (var e, t = ti, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : ti = n);
  On = e, ca(o);
}
function ca(e) {
  if (!yn) {
    An && (An = clearTimeout(An));
    var t = e - Qt;
    t > 24 ? (e < 1 / 0 && (An = setTimeout(il, e - eo.now() - wi)), Cn && (Cn = clearInterval(Cn))) : (Cn || (ni = eo.now(), Cn = setInterval(pw, Fc)), yn = 1, Gc(il));
  }
}
function rl(e, t, n) {
  var o = new oi();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var vw = Aa("start", "end", "cancel", "interrupt"), mw = [], Uc = 0, al = 1, da = 2, zo = 3, sl = 4, fa = 5, Bo = 6;
function _i(e, t, n, o, i, a) {
  var r = e.__transition;
  if (!r) e.__transition = {};
  else if (n in r) return;
  yw(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: vw,
    tween: mw,
    time: a.time,
    delay: a.delay,
    duration: a.duration,
    ease: a.ease,
    timer: null,
    state: Uc
  });
}
function Ba(e, t) {
  var n = rt(e, t);
  if (n.state > Uc) throw new Error("too late; already scheduled");
  return n;
}
function vt(e, t) {
  var n = rt(e, t);
  if (n.state > zo) throw new Error("too late; already running");
  return n;
}
function rt(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function yw(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Yc(a, 0, n.time);
  function a(c) {
    n.state = al, n.timer.restart(r, n.delay, n.time), n.delay <= c && r(c - n.delay);
  }
  function r(c) {
    var l, d, f, h;
    if (n.state !== al) return u();
    for (l in o)
      if (h = o[l], h.name === n.name) {
        if (h.state === zo) return rl(r);
        h.state === sl ? (h.state = Bo, h.timer.stop(), h.on.call("interrupt", e, e.__data__, h.index, h.group), delete o[l]) : +l < t && (h.state = Bo, h.timer.stop(), h.on.call("cancel", e, e.__data__, h.index, h.group), delete o[l]);
      }
    if (rl(function() {
      n.state === zo && (n.state = sl, n.timer.restart(s, n.delay, n.time), s(c));
    }), n.state = da, n.on.call("start", e, e.__data__, n.index, n.group), n.state === da) {
      for (n.state = zo, i = new Array(f = n.tween.length), l = 0, d = -1; l < f; ++l)
        (h = n.tween[l].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = h);
      i.length = d + 1;
    }
  }
  function s(c) {
    for (var l = c < n.duration ? n.ease.call(null, c / n.duration) : (n.timer.restart(u), n.state = fa, 1), d = -1, f = i.length; ++d < f; )
      i[d].call(e, l);
    n.state === fa && (n.on.call("end", e, e.__data__, n.index, n.group), u());
  }
  function u() {
    n.state = Bo, n.timer.stop(), delete o[t];
    for (var c in o) return;
    delete e.__transition;
  }
}
function Lo(e, t) {
  var n = e.__transition, o, i, a = !0, r;
  if (n) {
    t = t == null ? null : t + "";
    for (r in n) {
      if ((o = n[r]).name !== t) {
        a = !1;
        continue;
      }
      i = o.state > da && o.state < fa, o.state = Bo, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[r];
    }
    a && delete e.__transition;
  }
}
function ww(e) {
  return this.each(function() {
    Lo(this, e);
  });
}
function _w(e, t) {
  var n, o;
  return function() {
    var i = vt(this, e), a = i.tween;
    if (a !== n) {
      o = n = a;
      for (var r = 0, s = o.length; r < s; ++r)
        if (o[r].name === t) {
          o = o.slice(), o.splice(r, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function bw(e, t, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var a = vt(this, e), r = a.tween;
    if (r !== o) {
      i = (o = r).slice();
      for (var s = { name: t, value: n }, u = 0, c = i.length; u < c; ++u)
        if (i[u].name === t) {
          i[u] = s;
          break;
        }
      u === c && i.push(s);
    }
    a.tween = i;
  };
}
function kw(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = rt(this.node(), n).tween, i = 0, a = o.length, r; i < a; ++i)
      if ((r = o[i]).name === e)
        return r.value;
    return null;
  }
  return this.each((t == null ? _w : bw)(n, e, t));
}
function La(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = vt(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return rt(i, o).value[t];
  };
}
function qc(e, t) {
  var n;
  return (typeof t == "number" ? At : t instanceof Qn ? tl : (n = Qn(t)) ? (t = n, tl) : ow)(e, t);
}
function Ew(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function $w(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function xw(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = this.getAttribute(e);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function Sw(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = this.getAttributeNS(e.space, e.local);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function Nw(e, t, n) {
  var o, i, a;
  return function() {
    var r, s = n(this), u;
    return s == null ? void this.removeAttribute(e) : (r = this.getAttribute(e), u = s + "", r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s)));
  };
}
function Cw(e, t, n) {
  var o, i, a;
  return function() {
    var r, s = n(this), u;
    return s == null ? void this.removeAttributeNS(e.space, e.local) : (r = this.getAttributeNS(e.space, e.local), u = s + "", r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s)));
  };
}
function Mw(e, t) {
  var n = yi(e), o = n === "transform" ? sw : qc;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Cw : Nw)(n, o, La(this, "attr." + e, t)) : t == null ? (n.local ? $w : Ew)(n) : (n.local ? Sw : xw)(n, o, t));
}
function Tw(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Iw(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Dw(e, t) {
  var n, o;
  function i() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && Iw(e, a)), n;
  }
  return i._value = t, i;
}
function Aw(e, t) {
  var n, o;
  function i() {
    var a = t.apply(this, arguments);
    return a !== o && (n = (o = a) && Tw(e, a)), n;
  }
  return i._value = t, i;
}
function Ow(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = yi(e);
  return this.tween(n, (o.local ? Dw : Aw)(o, t));
}
function Pw(e, t) {
  return function() {
    Ba(this, e).delay = +t.apply(this, arguments);
  };
}
function Rw(e, t) {
  return t = +t, function() {
    Ba(this, e).delay = t;
  };
}
function zw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Pw : Rw)(t, e)) : rt(this.node(), t).delay;
}
function Bw(e, t) {
  return function() {
    vt(this, e).duration = +t.apply(this, arguments);
  };
}
function Lw(e, t) {
  return t = +t, function() {
    vt(this, e).duration = t;
  };
}
function Vw(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Bw : Lw)(t, e)) : rt(this.node(), t).duration;
}
function Hw(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    vt(this, e).ease = t;
  };
}
function Fw(e) {
  var t = this._id;
  return arguments.length ? this.each(Hw(t, e)) : rt(this.node(), t).ease;
}
function Gw(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    vt(this, e).ease = n;
  };
}
function Yw(e) {
  if (typeof e != "function") throw new Error();
  return this.each(Gw(this._id, e));
}
function Uw(e) {
  typeof e != "function" && (e = Sc(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var a = t[i], r = a.length, s = o[i] = [], u, c = 0; c < r; ++c)
      (u = a[c]) && e.call(u, u.__data__, c, a) && s.push(u);
  return new Ct(o, this._parents, this._name, this._id);
}
function qw(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, a = Math.min(o, i), r = new Array(o), s = 0; s < a; ++s)
    for (var u = t[s], c = n[s], l = u.length, d = r[s] = new Array(l), f, h = 0; h < l; ++h)
      (f = u[h] || c[h]) && (d[h] = f);
  for (; s < o; ++s)
    r[s] = t[s];
  return new Ct(r, this._parents, this._name, this._id);
}
function Xw(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Ww(e, t, n) {
  var o, i, a = Xw(t) ? Ba : vt;
  return function() {
    var r = a(this, e), s = r.on;
    s !== o && (i = (o = s).copy()).on(t, n), r.on = i;
  };
}
function Kw(e, t) {
  var n = this._id;
  return arguments.length < 2 ? rt(this.node(), n).on.on(e) : this.each(Ww(n, e, t));
}
function Zw(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function jw() {
  return this.on("end.remove", Zw(this._id));
}
function Jw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Oa(e));
  for (var o = this._groups, i = o.length, a = new Array(i), r = 0; r < i; ++r)
    for (var s = o[r], u = s.length, c = a[r] = new Array(u), l, d, f = 0; f < u; ++f)
      (l = s[f]) && (d = e.call(l, l.__data__, f, s)) && ("__data__" in l && (d.__data__ = l.__data__), c[f] = d, _i(c[f], t, n, f, c, rt(l, n)));
  return new Ct(a, this._parents, t, n);
}
function Qw(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = xc(e));
  for (var o = this._groups, i = o.length, a = [], r = [], s = 0; s < i; ++s)
    for (var u = o[s], c = u.length, l, d = 0; d < c; ++d)
      if (l = u[d]) {
        for (var f = e.call(l, l.__data__, d, u), h, w = rt(l, n), _ = 0, m = f.length; _ < m; ++_)
          (h = f[_]) && _i(h, t, n, _, f, w);
        a.push(f), r.push(l);
      }
  return new Ct(a, r, t, n);
}
var e_ = ro.prototype.constructor;
function t_() {
  return new e_(this._groups, this._parents);
}
function n_(e, t) {
  var n, o, i;
  return function() {
    var a = mn(this, e), r = (this.style.removeProperty(e), mn(this, e));
    return a === r ? null : a === n && r === o ? i : i = t(n = a, o = r);
  };
}
function Xc(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function o_(e, t, n) {
  var o, i = n + "", a;
  return function() {
    var r = mn(this, e);
    return r === i ? null : r === o ? a : a = t(o = r, n);
  };
}
function i_(e, t, n) {
  var o, i, a;
  return function() {
    var r = mn(this, e), s = n(this), u = s + "";
    return s == null && (u = s = (this.style.removeProperty(e), mn(this, e))), r === u ? null : r === o && u === i ? a : (i = u, a = t(o = r, s));
  };
}
function r_(e, t) {
  var n, o, i, a = "style." + t, r = "end." + a, s;
  return function() {
    var u = vt(this, e), c = u.on, l = u.value[a] == null ? s || (s = Xc(t)) : void 0;
    (c !== n || i !== l) && (o = (n = c).copy()).on(r, i = l), u.on = o;
  };
}
function a_(e, t, n) {
  var o = (e += "") == "transform" ? aw : qc;
  return t == null ? this.styleTween(e, n_(e, o)).on("end.style." + e, Xc(e)) : typeof t == "function" ? this.styleTween(e, i_(e, o, La(this, "style." + e, t))).each(r_(this._id, e)) : this.styleTween(e, o_(e, o, t), n).on("end.style." + e, null);
}
function s_(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function l_(e, t, n) {
  var o, i;
  function a() {
    var r = t.apply(this, arguments);
    return r !== i && (o = (i = r) && s_(e, r, n)), o;
  }
  return a._value = t, a;
}
function u_(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, l_(e, t, n ?? ""));
}
function c_(e) {
  return function() {
    this.textContent = e;
  };
}
function d_(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function f_(e) {
  return this.tween("text", typeof e == "function" ? d_(La(this, "text", e)) : c_(e == null ? "" : e + ""));
}
function h_(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function p_(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && h_(i)), t;
  }
  return o._value = e, o;
}
function g_(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, p_(e));
}
function v_() {
  for (var e = this._name, t = this._id, n = Wc(), o = this._groups, i = o.length, a = 0; a < i; ++a)
    for (var r = o[a], s = r.length, u, c = 0; c < s; ++c)
      if (u = r[c]) {
        var l = rt(u, t);
        _i(u, e, n, c, r, {
          time: l.time + l.delay + l.duration,
          delay: 0,
          duration: l.duration,
          ease: l.ease
        });
      }
  return new Ct(o, this._parents, e, n);
}
function m_() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(a, r) {
    var s = { value: r }, u = { value: function() {
      --i === 0 && a();
    } };
    n.each(function() {
      var c = vt(this, o), l = c.on;
      l !== e && (t = (e = l).copy(), t._.cancel.push(s), t._.interrupt.push(s), t._.end.push(u)), c.on = t;
    }), i === 0 && a();
  });
}
var y_ = 0;
function Ct(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function Wc() {
  return ++y_;
}
var wt = ro.prototype;
Ct.prototype = {
  constructor: Ct,
  select: Jw,
  selectAll: Qw,
  selectChild: wt.selectChild,
  selectChildren: wt.selectChildren,
  filter: Uw,
  merge: qw,
  selection: t_,
  transition: v_,
  call: wt.call,
  nodes: wt.nodes,
  node: wt.node,
  size: wt.size,
  empty: wt.empty,
  each: wt.each,
  on: Kw,
  attr: Mw,
  attrTween: Ow,
  style: a_,
  styleTween: u_,
  text: f_,
  textTween: g_,
  remove: jw,
  tween: kw,
  delay: zw,
  duration: Vw,
  ease: Fw,
  easeVarying: Yw,
  end: m_,
  [Symbol.iterator]: wt[Symbol.iterator]
};
function w_(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var __ = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: w_
};
function b_(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function k_(e) {
  var t, n;
  e instanceof Ct ? (t = e._id, e = e._name) : (t = Wc(), (n = __).time = za(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, a = 0; a < i; ++a)
    for (var r = o[a], s = r.length, u, c = 0; c < s; ++c)
      (u = r[c]) && _i(u, e, t, c, r, n || b_(u, t));
  return new Ct(o, this._parents, e, t);
}
ro.prototype.interrupt = ww;
ro.prototype.transition = k_;
const So = (e) => () => e;
function E_(e, {
  sourceEvent: t,
  target: n,
  transform: o,
  dispatch: i
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    target: { value: n, enumerable: !0, configurable: !0 },
    transform: { value: o, enumerable: !0, configurable: !0 },
    _: { value: i }
  });
}
function $t(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
$t.prototype = {
  constructor: $t,
  scale: function(e) {
    return e === 1 ? this : new $t(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new $t(this.k, this.x + this.k * e, this.y + this.k * t);
  },
  apply: function(e) {
    return [e[0] * this.k + this.x, e[1] * this.k + this.y];
  },
  applyX: function(e) {
    return e * this.k + this.x;
  },
  applyY: function(e) {
    return e * this.k + this.y;
  },
  invert: function(e) {
    return [(e[0] - this.x) / this.k, (e[1] - this.y) / this.k];
  },
  invertX: function(e) {
    return (e - this.x) / this.k;
  },
  invertY: function(e) {
    return (e - this.y) / this.k;
  },
  rescaleX: function(e) {
    return e.copy().domain(e.range().map(this.invertX, this).map(e.invert, e));
  },
  rescaleY: function(e) {
    return e.copy().domain(e.range().map(this.invertY, this).map(e.invert, e));
  },
  toString: function() {
    return "translate(" + this.x + "," + this.y + ") scale(" + this.k + ")";
  }
};
var Va = new $t(1, 0, 0);
$t.prototype;
function Xi(e) {
  e.stopImmediatePropagation();
}
function Mn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function $_(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function x_() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function ll() {
  return this.__zoom || Va;
}
function S_(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function N_() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function C_(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], a = e.invertY(t[0][1]) - n[0][1], r = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    r > a ? (a + r) / 2 : Math.min(0, a) || Math.max(0, r)
  );
}
function M_() {
  var e = $_, t = x_, n = C_, o = S_, i = N_, a = [0, 1 / 0], r = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], s = 250, u = dw, c = Aa("start", "zoom", "end"), l, d, f, h = 500, w = 150, _ = 0, m = 10;
  function p(y) {
    y.property("__zoom", ll).on("wheel.zoom", N, { passive: !1 }).on("mousedown.zoom", C).on("dblclick.zoom", M).filter(i).on("touchstart.zoom", B).on("touchmove.zoom", S).on("touchend.zoom touchcancel.zoom", Q).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  p.transform = function(y, P, $, X) {
    var U = y.selection ? y.selection() : y;
    U.property("__zoom", ll), y !== U ? O(y, P, $, X) : U.interrupt().each(function() {
      F(this, arguments).event(X).start().zoom(null, typeof P == "function" ? P.apply(this, arguments) : P).end();
    });
  }, p.scaleBy = function(y, P, $, X) {
    p.scaleTo(y, function() {
      var U = this.__zoom.k, z = typeof P == "function" ? P.apply(this, arguments) : P;
      return U * z;
    }, $, X);
  }, p.scaleTo = function(y, P, $, X) {
    p.transform(y, function() {
      var U = t.apply(this, arguments), z = this.__zoom, E = $ == null ? b(U) : typeof $ == "function" ? $.apply(this, arguments) : $, L = z.invert(E), te = typeof P == "function" ? P.apply(this, arguments) : P;
      return n(g(v(z, te), E, L), U, r);
    }, $, X);
  }, p.translateBy = function(y, P, $, X) {
    p.transform(y, function() {
      return n(this.__zoom.translate(
        typeof P == "function" ? P.apply(this, arguments) : P,
        typeof $ == "function" ? $.apply(this, arguments) : $
      ), t.apply(this, arguments), r);
    }, null, X);
  }, p.translateTo = function(y, P, $, X, U) {
    p.transform(y, function() {
      var z = t.apply(this, arguments), E = this.__zoom, L = X == null ? b(z) : typeof X == "function" ? X.apply(this, arguments) : X;
      return n(Va.translate(L[0], L[1]).scale(E.k).translate(
        typeof P == "function" ? -P.apply(this, arguments) : -P,
        typeof $ == "function" ? -$.apply(this, arguments) : -$
      ), z, r);
    }, X, U);
  };
  function v(y, P) {
    return P = Math.max(a[0], Math.min(a[1], P)), P === y.k ? y : new $t(P, y.x, y.y);
  }
  function g(y, P, $) {
    var X = P[0] - $[0] * y.k, U = P[1] - $[1] * y.k;
    return X === y.x && U === y.y ? y : new $t(y.k, X, U);
  }
  function b(y) {
    return [(+y[0][0] + +y[1][0]) / 2, (+y[0][1] + +y[1][1]) / 2];
  }
  function O(y, P, $, X) {
    y.on("start.zoom", function() {
      F(this, arguments).event(X).start();
    }).on("interrupt.zoom end.zoom", function() {
      F(this, arguments).event(X).end();
    }).tween("zoom", function() {
      var U = this, z = arguments, E = F(U, z).event(X), L = t.apply(U, z), te = $ == null ? b(L) : typeof $ == "function" ? $.apply(U, z) : $, H = Math.max(L[1][0] - L[0][0], L[1][1] - L[0][1]), q = U.__zoom, Y = typeof P == "function" ? P.apply(U, z) : P, j = u(q.invert(te).concat(H / q.k), Y.invert(te).concat(H / Y.k));
      return function(ee) {
        if (ee === 1) ee = Y;
        else {
          var ae = j(ee), me = H / ae[2];
          ee = new $t(me, te[0] - ae[0] * me, te[1] - ae[1] * me);
        }
        E.zoom(null, ee);
      };
    });
  }
  function F(y, P, $) {
    return !$ && y.__zooming || new K(y, P);
  }
  function K(y, P) {
    this.that = y, this.args = P, this.active = 0, this.sourceEvent = null, this.extent = t.apply(y, P), this.taps = 0;
  }
  K.prototype = {
    event: function(y) {
      return y && (this.sourceEvent = y), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(y, P) {
      return this.mouse && y !== "mouse" && (this.mouse[1] = P.invert(this.mouse[0])), this.touch0 && y !== "touch" && (this.touch0[1] = P.invert(this.touch0[0])), this.touch1 && y !== "touch" && (this.touch1[1] = P.invert(this.touch1[0])), this.that.__zoom = P, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(y) {
      var P = Ot(this.that).datum();
      c.call(
        y,
        this.that,
        new E_(y, {
          sourceEvent: this.sourceEvent,
          target: p,
          transform: this.that.__zoom,
          dispatch: c
        }),
        P
      );
    }
  };
  function N(y, ...P) {
    if (!e.apply(this, arguments)) return;
    var $ = F(this, P).event(y), X = this.__zoom, U = Math.max(a[0], Math.min(a[1], X.k * Math.pow(2, o.apply(this, arguments)))), z = It(y);
    if ($.wheel)
      ($.mouse[0][0] !== z[0] || $.mouse[0][1] !== z[1]) && ($.mouse[1] = X.invert($.mouse[0] = z)), clearTimeout($.wheel);
    else {
      if (X.k === U) return;
      $.mouse = [z, X.invert(z)], Lo(this), $.start();
    }
    Mn(y), $.wheel = setTimeout(E, w), $.zoom("mouse", n(g(v(X, U), $.mouse[0], $.mouse[1]), $.extent, r));
    function E() {
      $.wheel = null, $.end();
    }
  }
  function C(y, ...P) {
    if (f || !e.apply(this, arguments)) return;
    var $ = y.currentTarget, X = F(this, P, !0).event(y), U = Ot(y.view).on("mousemove.zoom", te, !0).on("mouseup.zoom", H, !0), z = It(y, $), E = y.clientX, L = y.clientY;
    B1(y.view), Xi(y), X.mouse = [z, this.__zoom.invert(z)], Lo(this), X.start();
    function te(q) {
      if (Mn(q), !X.moved) {
        var Y = q.clientX - E, j = q.clientY - L;
        X.moved = Y * Y + j * j > _;
      }
      X.event(q).zoom("mouse", n(g(X.that.__zoom, X.mouse[0] = It(q, $), X.mouse[1]), X.extent, r));
    }
    function H(q) {
      U.on("mousemove.zoom mouseup.zoom", null), L1(q.view, X.moved), Mn(q), X.event(q).end();
    }
  }
  function M(y, ...P) {
    if (e.apply(this, arguments)) {
      var $ = this.__zoom, X = It(y.changedTouches ? y.changedTouches[0] : y, this), U = $.invert(X), z = $.k * (y.shiftKey ? 0.5 : 2), E = n(g(v($, z), X, U), t.apply(this, P), r);
      Mn(y), s > 0 ? Ot(this).transition().duration(s).call(O, E, X, y) : Ot(this).call(p.transform, E, X, y);
    }
  }
  function B(y, ...P) {
    if (e.apply(this, arguments)) {
      var $ = y.touches, X = $.length, U = F(this, P, y.changedTouches.length === X).event(y), z, E, L, te;
      for (Xi(y), E = 0; E < X; ++E)
        L = $[E], te = It(L, this), te = [te, this.__zoom.invert(te), L.identifier], U.touch0 ? !U.touch1 && U.touch0[2] !== te[2] && (U.touch1 = te, U.taps = 0) : (U.touch0 = te, z = !0, U.taps = 1 + !!l);
      l && (l = clearTimeout(l)), z && (U.taps < 2 && (d = te[0], l = setTimeout(function() {
        l = null;
      }, h)), Lo(this), U.start());
    }
  }
  function S(y, ...P) {
    if (this.__zooming) {
      var $ = F(this, P).event(y), X = y.changedTouches, U = X.length, z, E, L, te;
      for (Mn(y), z = 0; z < U; ++z)
        E = X[z], L = It(E, this), $.touch0 && $.touch0[2] === E.identifier ? $.touch0[0] = L : $.touch1 && $.touch1[2] === E.identifier && ($.touch1[0] = L);
      if (E = $.that.__zoom, $.touch1) {
        var H = $.touch0[0], q = $.touch0[1], Y = $.touch1[0], j = $.touch1[1], ee = (ee = Y[0] - H[0]) * ee + (ee = Y[1] - H[1]) * ee, ae = (ae = j[0] - q[0]) * ae + (ae = j[1] - q[1]) * ae;
        E = v(E, Math.sqrt(ee / ae)), L = [(H[0] + Y[0]) / 2, (H[1] + Y[1]) / 2], te = [(q[0] + j[0]) / 2, (q[1] + j[1]) / 2];
      } else if ($.touch0) L = $.touch0[0], te = $.touch0[1];
      else return;
      $.zoom("touch", n(g(E, L, te), $.extent, r));
    }
  }
  function Q(y, ...P) {
    if (this.__zooming) {
      var $ = F(this, P).event(y), X = y.changedTouches, U = X.length, z, E;
      for (Xi(y), f && clearTimeout(f), f = setTimeout(function() {
        f = null;
      }, h), z = 0; z < U; ++z)
        E = X[z], $.touch0 && $.touch0[2] === E.identifier ? delete $.touch0 : $.touch1 && $.touch1[2] === E.identifier && delete $.touch1;
      if ($.touch1 && !$.touch0 && ($.touch0 = $.touch1, delete $.touch1), $.touch0) $.touch0[1] = this.__zoom.invert($.touch0[0]);
      else if ($.end(), $.taps === 2 && (E = It(E, this), Math.hypot(d[0] - E[0], d[1] - E[1]) < m)) {
        var L = Ot(this).on("dblclick.zoom");
        L && L.apply(this, arguments);
      }
    }
  }
  return p.wheelDelta = function(y) {
    return arguments.length ? (o = typeof y == "function" ? y : So(+y), p) : o;
  }, p.filter = function(y) {
    return arguments.length ? (e = typeof y == "function" ? y : So(!!y), p) : e;
  }, p.touchable = function(y) {
    return arguments.length ? (i = typeof y == "function" ? y : So(!!y), p) : i;
  }, p.extent = function(y) {
    return arguments.length ? (t = typeof y == "function" ? y : So([[+y[0][0], +y[0][1]], [+y[1][0], +y[1][1]]]), p) : t;
  }, p.scaleExtent = function(y) {
    return arguments.length ? (a[0] = +y[0], a[1] = +y[1], p) : [a[0], a[1]];
  }, p.translateExtent = function(y) {
    return arguments.length ? (r[0][0] = +y[0][0], r[1][0] = +y[1][0], r[0][1] = +y[0][1], r[1][1] = +y[1][1], p) : [[r[0][0], r[0][1]], [r[1][0], r[1][1]]];
  }, p.constrain = function(y) {
    return arguments.length ? (n = y, p) : n;
  }, p.duration = function(y) {
    return arguments.length ? (s = +y, p) : s;
  }, p.interpolate = function(y) {
    return arguments.length ? (u = y, p) : u;
  }, p.on = function() {
    var y = c.on.apply(c, arguments);
    return y === c ? p : y;
  }, p.clickDistance = function(y) {
    return arguments.length ? (_ = (y = +y) * y, p) : Math.sqrt(_);
  }, p.tapDistance = function(y) {
    return arguments.length ? (m = +y, p) : m;
  }, p;
}
const Kc = Symbol("MiniMapSlots"), T_ = ["id", "x", "y", "rx", "ry", "width", "height", "fill", "stroke", "stroke-width", "shape-rendering"], I_ = {
  name: "MiniMapNode",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, D_ = /* @__PURE__ */ xe({
  ...I_,
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    dragging: { type: Boolean },
    position: {},
    dimensions: {},
    borderRadius: {},
    color: {},
    shapeRendering: {},
    strokeColor: {},
    strokeWidth: {},
    hidden: { type: Boolean }
  },
  emits: ["click", "dblclick", "mouseenter", "mousemove", "mouseleave"],
  setup(e, { emit: t }) {
    const n = e, o = xt(Kc), i = _a(), a = Te(() => i.style ?? {});
    function r(d) {
      t("click", d);
    }
    function s(d) {
      t("dblclick", d);
    }
    function u(d) {
      t("mouseenter", d);
    }
    function c(d) {
      t("mousemove", d);
    }
    function l(d) {
      t("mouseleave", d);
    }
    return (d, f) => !d.hidden && d.dimensions.width !== 0 && d.dimensions.height !== 0 ? (A(), G(ye, { key: 0 }, [
      oe(o)[`node-${n.type}`] ? (A(), Ie(Lt(oe(o)[`node-${n.type}`]), af(Ho({ key: 0 }, { ...n, ...d.$attrs })), null, 16)) : (A(), G("rect", Ho({
        key: 1,
        id: d.id
      }, d.$attrs, {
        class: ["vue-flow__minimap-node", { selected: d.selected, dragging: d.dragging }],
        x: d.position.x,
        y: d.position.y,
        rx: d.borderRadius,
        ry: d.borderRadius,
        width: d.dimensions.width,
        height: d.dimensions.height,
        fill: d.color || a.value.background || a.value.backgroundColor,
        stroke: d.strokeColor,
        "stroke-width": d.strokeWidth,
        "shape-rendering": d.shapeRendering,
        onClick: r,
        onDblclick: s,
        onMouseenter: u,
        onMousemove: c,
        onMouseleave: l
      }), null, 16, T_))
    ], 64)) : de("", !0);
  }
}), A_ = ["width", "height", "viewBox", "aria-labelledby"], O_ = ["id"], P_ = ["d", "fill", "stroke", "stroke-width"], R_ = {
  name: "MiniMap",
  compatConfig: { MODE: 3 }
}, z_ = /* @__PURE__ */ xe({
  ...R_,
  props: {
    nodeColor: { type: [String, Function], default: "#e2e2e2" },
    nodeStrokeColor: { type: [String, Function], default: "transparent" },
    nodeClassName: { type: [String, Function] },
    nodeBorderRadius: { default: 5 },
    nodeStrokeWidth: { default: 2 },
    maskColor: { default: "rgb(240, 240, 240, 0.6)" },
    maskStrokeColor: { default: "none" },
    maskStrokeWidth: { default: 1 },
    position: { default: "bottom-right" },
    pannable: { type: Boolean, default: !1 },
    zoomable: { type: Boolean, default: !1 },
    width: {},
    height: {},
    ariaLabel: { default: "Vue Flow mini map" },
    inversePan: { type: Boolean, default: !1 },
    zoomStep: { default: 1 },
    offsetScale: { default: 5 },
    maskBorderRadius: { default: 0 }
  },
  emits: ["click", "nodeClick", "nodeDblclick", "nodeMouseenter", "nodeMousemove", "nodeMouseleave"],
  setup(e, { emit: t }) {
    const n = pu(), o = _a(), i = 200, a = 150, { id: r, edges: s, viewport: u, translateExtent: c, dimensions: l, emits: d, d3Selection: f, d3Zoom: h, getNodesInitialized: w } = Pe(), _ = fe();
    St(Kc, n);
    const m = Te(() => {
      var U;
      return e.width ?? ((U = o.style) == null ? void 0 : U.width) ?? i;
    }), p = Te(() => {
      var U;
      return e.height ?? ((U = o.style) == null ? void 0 : U.height) ?? a;
    }), v = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision", g = ne(() => typeof e.nodeColor == "string" ? () => e.nodeColor : e.nodeColor), b = ne(
      () => typeof e.nodeStrokeColor == "string" ? () => e.nodeStrokeColor : e.nodeStrokeColor
    ), O = ne(
      () => typeof e.nodeClassName == "string" ? () => e.nodeClassName : typeof e.nodeClassName == "function" ? e.nodeClassName : () => ""
    ), F = ne(() => Ma(w.value.filter((U) => !U.hidden))), K = ne(() => ({
      x: -u.value.x / u.value.zoom,
      y: -u.value.y / u.value.zoom,
      width: l.value.width / u.value.zoom,
      height: l.value.height / u.value.zoom
    })), N = ne(
      () => w.value && w.value.length ? gv(F.value, K.value) : K.value
    ), C = ne(() => {
      const U = N.value.width / m.value, z = N.value.height / p.value;
      return Math.max(U, z);
    }), M = ne(() => {
      const U = C.value * m.value, z = C.value * p.value, E = e.offsetScale * C.value;
      return {
        offset: E,
        x: N.value.x - (U - N.value.width) / 2 - E,
        y: N.value.y - (z - N.value.height) / 2 - E,
        width: U + E * 2,
        height: z + E * 2
      };
    }), B = ne(() => !M.value.x || !M.value.y ? "" : `
    M${M.value.x - M.value.offset},${M.value.y - M.value.offset}
    h${M.value.width + M.value.offset * 2}
    v${M.value.height + M.value.offset * 2}
    h${-M.value.width - M.value.offset * 2}z
    M${K.value.x + e.maskBorderRadius},${K.value.y}
    h${K.value.width - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${K.value.height - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(K.value.width - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(K.value.height - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);
    rf(
      (U) => {
        if (_.value) {
          const z = Ot(_.value), E = (H) => {
            if (H.sourceEvent.type !== "wheel" || !f.value || !h.value)
              return;
            const q = H.sourceEvent.ctrlKey && Zn() ? 10 : 1, Y = -H.sourceEvent.deltaY * (H.sourceEvent.deltaMode === 1 ? 0.05 : H.sourceEvent.deltaMode ? 1 : 2e-3) * e.zoomStep, j = u.value.zoom * 2 ** (Y * q);
            h.value.scaleTo(f.value, j);
          }, L = (H) => {
            if (H.sourceEvent.type !== "mousemove" || !f.value || !h.value)
              return;
            const q = C.value * Math.max(1, u.value.zoom) * (e.inversePan ? -1 : 1), Y = {
              x: u.value.x - H.sourceEvent.movementX * q,
              y: u.value.y - H.sourceEvent.movementY * q
            }, j = [
              [0, 0],
              [l.value.width, l.value.height]
            ], ee = Va.translate(Y.x, Y.y).scale(u.value.zoom), ae = h.value.constrain()(ee, j, c.value);
            h.value.transform(f.value, ae);
          }, te = M_().wheelDelta((H) => ea(H) * (e.zoomStep / 10)).on("zoom", e.pannable ? L : () => {
          }).on("zoom.wheel", e.zoomable ? E : () => {
          });
          z.call(te), U(() => {
            z.on("zoom", null);
          });
        }
      },
      { flush: "post" }
    );
    function S(U) {
      const [z, E] = It(U);
      t("click", { event: U, position: { x: z, y: E } });
    }
    function Q(U, z) {
      const E = { event: U, node: z, connectedEdges: Ht([z], s.value) };
      d.miniMapNodeClick(E), t("nodeClick", E);
    }
    function y(U, z) {
      const E = { event: U, node: z, connectedEdges: Ht([z], s.value) };
      d.miniMapNodeDoubleClick(E), t("nodeDblclick", E);
    }
    function P(U, z) {
      const E = { event: U, node: z, connectedEdges: Ht([z], s.value) };
      d.miniMapNodeMouseEnter(E), t("nodeMouseenter", E);
    }
    function $(U, z) {
      const E = { event: U, node: z, connectedEdges: Ht([z], s.value) };
      d.miniMapNodeMouseMove(E), t("nodeMousemove", E);
    }
    function X(U, z) {
      const E = { event: U, node: z, connectedEdges: Ht([z], s.value) };
      d.miniMapNodeMouseLeave(E), t("nodeMouseleave", E);
    }
    return (U, z) => (A(), Ie(oe(bc), {
      position: U.position,
      class: Me(["vue-flow__minimap", { pannable: U.pannable, zoomable: U.zoomable }])
    }, {
      default: ct(() => [
        (A(), G("svg", {
          ref_key: "el",
          ref: _,
          width: m.value,
          height: p.value,
          viewBox: [M.value.x, M.value.y, M.value.width, M.value.height].join(" "),
          role: "img",
          "aria-labelledby": `vue-flow__minimap-${oe(r)}`,
          onClick: S
        }, [
          U.ariaLabel ? (A(), G("title", {
            key: 0,
            id: `vue-flow__minimap-${oe(r)}`
          }, he(U.ariaLabel), 9, O_)) : de("", !0),
          (A(!0), G(ye, null, Se(oe(w), (E) => (A(), Ie(D_, {
            id: E.id,
            key: E.id,
            f: "",
            position: E.computedPosition,
            dimensions: E.dimensions,
            selected: E.selected,
            dragging: E.dragging,
            style: Oe(E.style),
            class: Me(O.value(E)),
            color: g.value(E),
            "border-radius": U.nodeBorderRadius,
            "stroke-color": b.value(E),
            "stroke-width": U.nodeStrokeWidth,
            "shape-rendering": oe(v),
            type: E.type,
            hidden: E.hidden,
            onClick: (L) => Q(L, E),
            onDblclick: (L) => y(L, E),
            onMouseenter: (L) => P(L, E),
            onMousemove: (L) => $(L, E),
            onMouseleave: (L) => X(L, E)
          }, null, 8, ["id", "position", "dimensions", "selected", "dragging", "style", "class", "color", "border-radius", "stroke-color", "stroke-width", "shape-rendering", "type", "hidden", "onClick", "onDblclick", "onMouseenter", "onMousemove", "onMouseleave"]))), 128)),
          I("path", {
            class: "vue-flow__minimap-mask",
            d: B.value,
            fill: U.maskColor,
            stroke: U.maskStrokeColor,
            "stroke-width": U.maskStrokeWidth,
            "fill-rule": "evenodd"
          }, null, 8, P_)
        ], 8, A_))
      ]),
      _: 1
    }, 8, ["position", "class"]));
  }
});
function ha(e) {
  return e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
function Wi(e) {
  let t = ha(e);
  return t = t.replace(/`([^`]+)`/g, (n, o) => `<code>${o}</code>`), t = t.replace(/\*\*([^*]+)\*\*/g, (n, o) => `<strong>${o}</strong>`), t = t.replace(/(^|[^*])\*([^*\n]+)\*/g, (n, o, i) => `${o}<em>${i}</em>`), t = t.replace(/(^|[^_])_([^_\n]+)_/g, (n, o, i) => `${o}<em>${i}</em>`), t = t.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+)\)/g,
    (n, o, i) => `<a href="${i}" target="_blank" rel="noopener noreferrer">${o}</a>`
  ), t;
}
function pa(e) {
  if (!e) return "";
  const t = String(e).replace(/\r\n/g, `
`).split(`
`), n = [];
  let o = null, i = !1;
  const a = [];
  function r() {
    o && (n.push(`</${o}>`), o = null);
  }
  for (const s of t) {
    if (s.trim().startsWith("```")) {
      i ? (n.push(`<pre><code>${ha(a.join(`
`))}</code></pre>`), a.length = 0, i = !1) : (r(), i = !0);
      continue;
    }
    if (i) {
      a.push(s);
      continue;
    }
    const c = /^(#{1,6})\s+(.*)$/.exec(s);
    if (c) {
      r();
      const f = c[1].length;
      n.push(`<h${f}>${Wi(c[2])}</h${f}>`);
      continue;
    }
    const l = /^\s*\d+\.\s+(.*)$/.exec(s), d = /^\s*[-*]\s+(.*)$/.exec(s);
    if (l || d) {
      const f = l ? "ol" : "ul";
      o && o !== f && r(), o || (o = f, n.push(`<${f}>`)), n.push(`<li>${Wi(l ? l[1] : d[1])}</li>`);
      continue;
    }
    if (s.trim() === "") {
      r();
      continue;
    }
    r(), n.push(`<p>${Wi(s)}</p>`);
  }
  return i && n.push(`<pre><code>${ha(a.join(`
`))}</code></pre>`), r(), n.join("");
}
const Zc = Symbol("kg-resize-node"), jc = Symbol("kg-node-edit"), B_ = { class: "g-node-top" }, L_ = { class: "g-type" }, V_ = ["title"], H_ = ["title"], F_ = {
  key: 2,
  class: "g-count",
  title: "Children"
}, G_ = {
  key: 1,
  class: "g-name"
}, Y_ = ["innerHTML"], U_ = {
  key: 3,
  class: "g-badges"
}, q_ = {
  key: 4,
  class: "g-tags"
}, ul = 150, cl = 640, X_ = /* @__PURE__ */ xe({
  __name: "GraphNode",
  props: {
    id: {},
    data: {},
    selected: { type: Boolean }
  },
  setup(e) {
    const t = e, n = {
      top: ue.Top,
      bottom: ue.Bottom,
      left: ue.Left,
      right: ue.Right
    }, o = xt(Zc, () => {
    }), i = xt(jc, () => ({ state: bt(null), commit: () => {
    }, close: () => {
    } }), !0), { viewport: a } = Pe(), r = fe(null), s = fe(""), u = ne(() => i.state.value?.id === t.id);
    Ee(u, (p) => {
      if (!p) return;
      const v = i.state.value?.seed;
      s.value = v ?? t.data.label, We(() => {
        const g = r.value;
        g && (g.focus(), v == null ? g.select() : g.setSelectionRange(g.value.length, g.value.length));
      });
    });
    function c() {
      u.value && i.commit(t.id, s.value);
    }
    function l(p) {
      p.stopPropagation(), p.key === "Enter" ? (p.preventDefault(), c()) : p.key === "Escape" && (p.preventDefault(), i.close());
    }
    const d = fe(null);
    Ee(() => t.data.width, () => {
      d.value = null;
    });
    const f = ne(() => Math.max(ul, Math.min(cl, Number(d.value ?? t.data.width ?? 210)))), h = ne(() => Math.max(0, Math.min(30, Number(t.data.radius ?? 6)))), w = ne(() => pa(t.data.description));
    function _(p) {
      const v = p.clientX, g = f.value, b = p.target;
      b.setPointerCapture(p.pointerId);
      const O = (K) => {
        const N = a.value.zoom || 1;
        d.value = Math.max(ul, Math.min(cl, Math.round(g + (K.clientX - v) / N)));
      }, F = () => {
        b.removeEventListener("pointermove", O), b.removeEventListener("pointerup", F), d.value !== null && d.value !== t.data.width && o(t.id, d.value);
      };
      b.addEventListener("pointermove", O), b.addEventListener("pointerup", F);
    }
    const m = ne(() => {
      const p = {};
      t.data.handles.forEach((g, b) => {
        (p[g.side] ||= []).push(b);
      });
      const v = {};
      for (const [g, b] of Object.entries(p))
        b.forEach((O, F) => {
          if (b.length <= 1) {
            v[O] = {};
            return;
          }
          const K = (F + 1) / (b.length + 1) * 100;
          v[O] = g === "top" || g === "bottom" ? { left: `${K}%` } : { top: `${K}%` };
        });
      return v;
    });
    return (p, v) => (A(), G("div", {
      class: Me(["g-node", [{ "g-node--selected": e.selected }, e.data.animation ? "g-anim-" + e.data.animation : ""]]),
      style: Oe({ "--node-color": e.data.color, "--node-bg": e.data.bg, "--node-border": e.data.border, width: f.value + "px", borderRadius: h.value + "px", borderStyle: e.data.borderStyle || "solid" })
    }, [
      (A(!0), G(ye, null, Se(e.data.handles, (g, b) => (A(), Ie(oe(ft), {
        key: g.id,
        id: g.id,
        type: g.type,
        position: n[g.side],
        style: Oe(m.value[b]),
        class: "g-port"
      }, null, 8, ["id", "type", "position", "style"]))), 128)),
      I("div", B_, [
        v[5] || (v[5] = I("span", { class: "g-dot" }, null, -1)),
        I("span", L_, he(e.data.typeLabel), 1),
        e.data.status && e.data.status !== "active" ? (A(), G("span", {
          key: 0,
          class: "g-status",
          title: "status: " + e.data.status
        }, he(e.data.status), 9, V_)) : de("", !0),
        e.data.materialCount ? (A(), G("span", {
          key: 1,
          class: "g-clip",
          title: e.data.materialCount + " material(s) — open panel"
        }, [
          v[4] || (v[4] = I("svg", {
            width: "9",
            height: "9",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            "stroke-width": "2.2",
            "stroke-linecap": "round",
            "stroke-linejoin": "round"
          }, [
            I("path", { d: "M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48" })
          ], -1)),
          Pt(" " + he(e.data.materialCount), 1)
        ], 8, H_)) : de("", !0),
        e.data.childCount ? (A(), G("span", F_, he(e.data.childCount), 1)) : de("", !0)
      ]),
      u.value ? sn((A(), G("input", {
        key: 0,
        ref_key: "nameInput",
        ref: r,
        "onUpdate:modelValue": v[0] || (v[0] = (g) => s.value = g),
        class: "g-name-input nodrag",
        spellcheck: "false",
        onKeydown: l,
        onBlur: c,
        onPointerdown: v[1] || (v[1] = Ue(() => {
        }, ["stop"])),
        onClick: v[2] || (v[2] = Ue(() => {
        }, ["stop"])),
        onDblclick: v[3] || (v[3] = Ue(() => {
        }, ["stop"]))
      }, null, 544)), [
        [ln, s.value]
      ]) : (A(), G("div", G_, he(e.data.label), 1)),
      w.value ? (A(), G("div", {
        key: 2,
        class: "g-desc",
        innerHTML: w.value
      }, null, 8, Y_)) : de("", !0),
      e.data.badges.length ? (A(), G("div", U_, [
        (A(!0), G(ye, null, Se(e.data.badges, (g, b) => (A(), G("span", {
          key: b,
          class: "g-badge",
          style: Oe({ "--badge-color": g.color })
        }, he(g.text), 5))), 128))
      ])) : de("", !0),
      e.data.tags.length ? (A(), G("div", q_, [
        (A(!0), G(ye, null, Se(e.data.tags, (g) => (A(), G("span", {
          key: g,
          class: "g-tag"
        }, he(g), 1))), 128))
      ])) : de("", !0),
      e.selected ? (A(), G("div", {
        key: 5,
        class: "g-resize nodrag",
        title: "Drag to resize",
        onPointerdown: Ue(_, ["stop", "prevent"])
      }, null, 32)) : de("", !0)
    ], 6));
  }
}), W_ = { class: "g-boundary-title" }, K_ = /* @__PURE__ */ xe({
  __name: "BoundaryNode",
  props: {
    data: {},
    selected: { type: Boolean }
  },
  setup(e) {
    return (t, n) => (A(), G("div", {
      class: Me(["g-boundary", { "g-boundary--selected": e.selected }]),
      style: Oe({ "--node-color": e.data.color })
    }, [
      ze(oe(ft), {
        id: "top",
        type: "target",
        position: oe(ue).Top,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(ft), {
        id: "left",
        type: "target",
        position: oe(ue).Left,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(ft), {
        id: "bottom",
        type: "source",
        position: oe(ue).Bottom,
        class: "g-port"
      }, null, 8, ["position"]),
      ze(oe(ft), {
        id: "right",
        type: "source",
        position: oe(ue).Right,
        class: "g-port"
      }, null, 8, ["position"]),
      I("div", W_, he(e.data.label), 1)
    ], 6));
  }
}), Z_ = ["title"], j_ = { class: "g-portal-chip-body" }, J_ = { class: "g-portal-chip-name" }, Q_ = {
  key: 0,
  class: "g-portal-chip-ctx"
}, eb = /* @__PURE__ */ xe({
  __name: "PortalNode",
  props: {
    id: {},
    data: {}
  },
  setup(e) {
    const t = {
      top: ue.Top,
      bottom: ue.Bottom,
      left: ue.Left,
      right: ue.Right
    };
    return (n, o) => (A(), G("div", {
      class: "g-portal-chip",
      style: Oe({ "--node-color": e.data.color }),
      title: "Reference — lives " + (e.data.contextLabel ? "in " + e.data.contextLabel : "outside this view") + ". Click to open the real node."
    }, [
      (A(!0), G(ye, null, Se(e.data.handles, (i) => (A(), Ie(oe(ft), {
        key: i.id,
        id: i.id,
        type: i.type,
        position: t[i.side],
        class: "g-portal-port"
      }, null, 8, ["id", "type", "position"]))), 128)),
      o[0] || (o[0] = I("span", { class: "g-portal-glyph" }, "⤢", -1)),
      I("span", j_, [
        I("span", J_, he(e.data.label), 1),
        e.data.contextLabel ? (A(), G("span", Q_, "in " + he(e.data.contextLabel), 1)) : de("", !0)
      ])
    ], 12, Z_));
  }
}), ii = [
  { label: "Accent", value: "var(--p-primary-color)" },
  { label: "Muted", value: "var(--p-text-muted-color)" },
  { label: "Soft accent", value: "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))" },
  { label: "Medium accent", value: "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))" },
  { label: "Strong accent", value: "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))" }
];
function tb(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ki, dl;
function Ha() {
  if (dl) return Ki;
  dl = 1;
  var e = "\0", t = "\0", n = "";
  class o {
    _isDirected = !0;
    _isMultigraph = !1;
    _isCompound = !1;
    // Label for the graph itself
    _label;
    // Defaults to be set when creating a new node
    _defaultNodeLabelFn = () => {
    };
    // Defaults to be set when creating a new edge
    _defaultEdgeLabelFn = () => {
    };
    // v -> label
    _nodes = {};
    // v -> edgeObj
    _in = {};
    // u -> v -> Number
    _preds = {};
    // v -> edgeObj
    _out = {};
    // v -> w -> Number
    _sucs = {};
    // e -> edgeObj
    _edgeObjs = {};
    // e -> label
    _edgeLabels = {};
    /* Number of nodes in the graph. Should only be changed by the implementation. */
    _nodeCount = 0;
    /* Number of edges in the graph. Should only be changed by the implementation. */
    _edgeCount = 0;
    _parent;
    _children;
    constructor(l) {
      l && (this._isDirected = Object.hasOwn(l, "directed") ? l.directed : !0, this._isMultigraph = Object.hasOwn(l, "multigraph") ? l.multigraph : !1, this._isCompound = Object.hasOwn(l, "compound") ? l.compound : !1), this._isCompound && (this._parent = {}, this._children = {}, this._children[t] = {});
    }
    /* === Graph functions ========= */
    /**
     * Whether graph was created with 'directed' flag set to true or not.
     */
    isDirected() {
      return this._isDirected;
    }
    /**
     * Whether graph was created with 'multigraph' flag set to true or not.
     */
    isMultigraph() {
      return this._isMultigraph;
    }
    /**
     * Whether graph was created with 'compound' flag set to true or not.
     */
    isCompound() {
      return this._isCompound;
    }
    /**
     * Sets the label of the graph.
     */
    setGraph(l) {
      return this._label = l, this;
    }
    /**
     * Gets the graph label.
     */
    graph() {
      return this._label;
    }
    /* === Node functions ========== */
    /**
     * Sets the default node label. If newDefault is a function, it will be
     * invoked ach time when setting a label for a node. Otherwise, this label
     * will be assigned as default label in case if no label was specified while
     * setting a node.
     * Complexity: O(1).
     */
    setDefaultNodeLabel(l) {
      return this._defaultNodeLabelFn = l, typeof l != "function" && (this._defaultNodeLabelFn = () => l), this;
    }
    /**
     * Gets the number of nodes in the graph.
     * Complexity: O(1).
     */
    nodeCount() {
      return this._nodeCount;
    }
    /**
     * Gets all nodes of the graph. Note, the in case of compound graph subnodes are
     * not included in list.
     * Complexity: O(1).
     */
    nodes() {
      return Object.keys(this._nodes);
    }
    /**
     * Gets list of nodes without in-edges.
     * Complexity: O(|V|).
     */
    sources() {
      var l = this;
      return this.nodes().filter((d) => Object.keys(l._in[d]).length === 0);
    }
    /**
     * Gets list of nodes without out-edges.
     * Complexity: O(|V|).
     */
    sinks() {
      var l = this;
      return this.nodes().filter((d) => Object.keys(l._out[d]).length === 0);
    }
    /**
     * Invokes setNode method for each node in names list.
     * Complexity: O(|names|).
     */
    setNodes(l, d) {
      var f = arguments, h = this;
      return l.forEach(function(w) {
        f.length > 1 ? h.setNode(w, d) : h.setNode(w);
      }), this;
    }
    /**
     * Creates or updates the value for the node v in the graph. If label is supplied
     * it is set as the value for the node. If label is not supplied and the node was
     * created by this call then the default node label will be assigned.
     * Complexity: O(1).
     */
    setNode(l, d) {
      return Object.hasOwn(this._nodes, l) ? (arguments.length > 1 && (this._nodes[l] = d), this) : (this._nodes[l] = arguments.length > 1 ? d : this._defaultNodeLabelFn(l), this._isCompound && (this._parent[l] = t, this._children[l] = {}, this._children[t][l] = !0), this._in[l] = {}, this._preds[l] = {}, this._out[l] = {}, this._sucs[l] = {}, ++this._nodeCount, this);
    }
    /**
     * Gets the label of node with specified name.
     * Complexity: O(|V|).
     */
    node(l) {
      return this._nodes[l];
    }
    /**
     * Detects whether graph has a node with specified name or not.
     */
    hasNode(l) {
      return Object.hasOwn(this._nodes, l);
    }
    /**
     * Remove the node with the name from the graph or do nothing if the node is not in
     * the graph. If the node was removed this function also removes any incident
     * edges.
     * Complexity: O(1).
     */
    removeNode(l) {
      var d = this;
      if (Object.hasOwn(this._nodes, l)) {
        var f = (h) => d.removeEdge(d._edgeObjs[h]);
        delete this._nodes[l], this._isCompound && (this._removeFromParentsChildList(l), delete this._parent[l], this.children(l).forEach(function(h) {
          d.setParent(h);
        }), delete this._children[l]), Object.keys(this._in[l]).forEach(f), delete this._in[l], delete this._preds[l], Object.keys(this._out[l]).forEach(f), delete this._out[l], delete this._sucs[l], --this._nodeCount;
      }
      return this;
    }
    /**
     * Sets node p as a parent for node v if it is defined, or removes the
     * parent for v if p is undefined. Method throws an exception in case of
     * invoking it in context of noncompound graph.
     * Average-case complexity: O(1).
     */
    setParent(l, d) {
      if (!this._isCompound)
        throw new Error("Cannot set parent in a non-compound graph");
      if (d === void 0)
        d = t;
      else {
        d += "";
        for (var f = d; f !== void 0; f = this.parent(f))
          if (f === l)
            throw new Error("Setting " + d + " as parent of " + l + " would create a cycle");
        this.setNode(d);
      }
      return this.setNode(l), this._removeFromParentsChildList(l), this._parent[l] = d, this._children[d][l] = !0, this;
    }
    _removeFromParentsChildList(l) {
      delete this._children[this._parent[l]][l];
    }
    /**
     * Gets parent node for node v.
     * Complexity: O(1).
     */
    parent(l) {
      if (this._isCompound) {
        var d = this._parent[l];
        if (d !== t)
          return d;
      }
    }
    /**
     * Gets list of direct children of node v.
     * Complexity: O(1).
     */
    children(l = t) {
      if (this._isCompound) {
        var d = this._children[l];
        if (d)
          return Object.keys(d);
      } else {
        if (l === t)
          return this.nodes();
        if (this.hasNode(l))
          return [];
      }
    }
    /**
     * Return all nodes that are predecessors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
    predecessors(l) {
      var d = this._preds[l];
      if (d)
        return Object.keys(d);
    }
    /**
     * Return all nodes that are successors of the specified node or undefined if node v is not in
     * the graph. Behavior is undefined for undirected graphs - use neighbors instead.
     * Complexity: O(|V|).
     */
    successors(l) {
      var d = this._sucs[l];
      if (d)
        return Object.keys(d);
    }
    /**
     * Return all nodes that are predecessors or successors of the specified node or undefined if
     * node v is not in the graph.
     * Complexity: O(|V|).
     */
    neighbors(l) {
      var d = this.predecessors(l);
      if (d) {
        const h = new Set(d);
        for (var f of this.successors(l))
          h.add(f);
        return Array.from(h.values());
      }
    }
    isLeaf(l) {
      var d;
      return this.isDirected() ? d = this.successors(l) : d = this.neighbors(l), d.length === 0;
    }
    /**
     * Creates new graph with nodes filtered via filter. Edges incident to rejected node
     * are also removed. In case of compound graph, if parent is rejected by filter,
     * than all its children are rejected too.
     * Average-case complexity: O(|E|+|V|).
     */
    filterNodes(l) {
      var d = new this.constructor({
        directed: this._isDirected,
        multigraph: this._isMultigraph,
        compound: this._isCompound
      });
      d.setGraph(this.graph());
      var f = this;
      Object.entries(this._nodes).forEach(function([_, m]) {
        l(_) && d.setNode(_, m);
      }), Object.values(this._edgeObjs).forEach(function(_) {
        d.hasNode(_.v) && d.hasNode(_.w) && d.setEdge(_, f.edge(_));
      });
      var h = {};
      function w(_) {
        var m = f.parent(_);
        return m === void 0 || d.hasNode(m) ? (h[_] = m, m) : m in h ? h[m] : w(m);
      }
      return this._isCompound && d.nodes().forEach((_) => d.setParent(_, w(_))), d;
    }
    /* === Edge functions ========== */
    /**
     * Sets the default edge label or factory function. This label will be
     * assigned as default label in case if no label was specified while setting
     * an edge or this function will be invoked each time when setting an edge
     * with no label specified and returned value * will be used as a label for edge.
     * Complexity: O(1).
     */
    setDefaultEdgeLabel(l) {
      return this._defaultEdgeLabelFn = l, typeof l != "function" && (this._defaultEdgeLabelFn = () => l), this;
    }
    /**
     * Gets the number of edges in the graph.
     * Complexity: O(1).
     */
    edgeCount() {
      return this._edgeCount;
    }
    /**
     * Gets edges of the graph. In case of compound graph subgraphs are not considered.
     * Complexity: O(|E|).
     */
    edges() {
      return Object.values(this._edgeObjs);
    }
    /**
     * Establish an edges path over the nodes in nodes list. If some edge is already
     * exists, it will update its label, otherwise it will create an edge between pair
     * of nodes with label provided or default label if no label provided.
     * Complexity: O(|nodes|).
     */
    setPath(l, d) {
      var f = this, h = arguments;
      return l.reduce(function(w, _) {
        return h.length > 1 ? f.setEdge(w, _, d) : f.setEdge(w, _), _;
      }), this;
    }
    /**
     * Creates or updates the label for the edge (v, w) with the optionally supplied
     * name. If label is supplied it is set as the value for the edge. If label is not
     * supplied and the edge was created by this call then the default edge label will
     * be assigned. The name parameter is only useful with multigraphs.
     */
    setEdge() {
      var l, d, f, h, w = !1, _ = arguments[0];
      typeof _ == "object" && _ !== null && "v" in _ ? (l = _.v, d = _.w, f = _.name, arguments.length === 2 && (h = arguments[1], w = !0)) : (l = _, d = arguments[1], f = arguments[3], arguments.length > 2 && (h = arguments[2], w = !0)), l = "" + l, d = "" + d, f !== void 0 && (f = "" + f);
      var m = r(this._isDirected, l, d, f);
      if (Object.hasOwn(this._edgeLabels, m))
        return w && (this._edgeLabels[m] = h), this;
      if (f !== void 0 && !this._isMultigraph)
        throw new Error("Cannot set a named edge when isMultigraph = false");
      this.setNode(l), this.setNode(d), this._edgeLabels[m] = w ? h : this._defaultEdgeLabelFn(l, d, f);
      var p = s(this._isDirected, l, d, f);
      return l = p.v, d = p.w, Object.freeze(p), this._edgeObjs[m] = p, i(this._preds[d], l), i(this._sucs[l], d), this._in[d][m] = p, this._out[l][m] = p, this._edgeCount++, this;
    }
    /**
     * Gets the label for the specified edge.
     * Complexity: O(1).
     */
    edge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : r(this._isDirected, l, d, f);
      return this._edgeLabels[h];
    }
    /**
     * Gets the label for the specified edge and converts it to an object.
     * Complexity: O(1)
     */
    edgeAsObj() {
      const l = this.edge(...arguments);
      return typeof l != "object" ? { label: l } : l;
    }
    /**
     * Detects whether the graph contains specified edge or not. No subgraphs are considered.
     * Complexity: O(1).
     */
    hasEdge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : r(this._isDirected, l, d, f);
      return Object.hasOwn(this._edgeLabels, h);
    }
    /**
     * Removes the specified edge from the graph. No subgraphs are considered.
     * Complexity: O(1).
     */
    removeEdge(l, d, f) {
      var h = arguments.length === 1 ? u(this._isDirected, arguments[0]) : r(this._isDirected, l, d, f), w = this._edgeObjs[h];
      return w && (l = w.v, d = w.w, delete this._edgeLabels[h], delete this._edgeObjs[h], a(this._preds[d], l), a(this._sucs[l], d), delete this._in[d][h], delete this._out[l][h], this._edgeCount--), this;
    }
    /**
     * Return all edges that point to the node v. Optionally filters those edges down to just those
     * coming from node u. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
    inEdges(l, d) {
      var f = this._in[l];
      if (f) {
        var h = Object.values(f);
        return d ? h.filter((w) => w.v === d) : h;
      }
    }
    /**
     * Return all edges that are pointed at by node v. Optionally filters those edges down to just
     * those point to w. Behavior is undefined for undirected graphs - use nodeEdges instead.
     * Complexity: O(|E|).
     */
    outEdges(l, d) {
      var f = this._out[l];
      if (f) {
        var h = Object.values(f);
        return d ? h.filter((w) => w.w === d) : h;
      }
    }
    /**
     * Returns all edges to or from node v regardless of direction. Optionally filters those edges
     * down to just those between nodes v and w regardless of direction.
     * Complexity: O(|E|).
     */
    nodeEdges(l, d) {
      var f = this.inEdges(l, d);
      if (f)
        return f.concat(this.outEdges(l, d));
    }
  }
  function i(c, l) {
    c[l] ? c[l]++ : c[l] = 1;
  }
  function a(c, l) {
    --c[l] || delete c[l];
  }
  function r(c, l, d, f) {
    var h = "" + l, w = "" + d;
    if (!c && h > w) {
      var _ = h;
      h = w, w = _;
    }
    return h + n + w + n + (f === void 0 ? e : f);
  }
  function s(c, l, d, f) {
    var h = "" + l, w = "" + d;
    if (!c && h > w) {
      var _ = h;
      h = w, w = _;
    }
    var m = { v: h, w };
    return f && (m.name = f), m;
  }
  function u(c, l) {
    return r(c, l.v, l.w, l.name);
  }
  return Ki = o, Ki;
}
var Zi, fl;
function nb() {
  return fl || (fl = 1, Zi = "2.2.4"), Zi;
}
var ji, hl;
function ob() {
  return hl || (hl = 1, ji = {
    Graph: Ha(),
    version: nb()
  }), ji;
}
var Ji, pl;
function ib() {
  if (pl) return Ji;
  pl = 1;
  var e = Ha();
  Ji = {
    write: t,
    read: i
  };
  function t(a) {
    var r = {
      options: {
        directed: a.isDirected(),
        multigraph: a.isMultigraph(),
        compound: a.isCompound()
      },
      nodes: n(a),
      edges: o(a)
    };
    return a.graph() !== void 0 && (r.value = structuredClone(a.graph())), r;
  }
  function n(a) {
    return a.nodes().map(function(r) {
      var s = a.node(r), u = a.parent(r), c = { v: r };
      return s !== void 0 && (c.value = s), u !== void 0 && (c.parent = u), c;
    });
  }
  function o(a) {
    return a.edges().map(function(r) {
      var s = a.edge(r), u = { v: r.v, w: r.w };
      return r.name !== void 0 && (u.name = r.name), s !== void 0 && (u.value = s), u;
    });
  }
  function i(a) {
    var r = new e(a.options).setGraph(a.value);
    return a.nodes.forEach(function(s) {
      r.setNode(s.v, s.value), s.parent && r.setParent(s.v, s.parent);
    }), a.edges.forEach(function(s) {
      r.setEdge({ v: s.v, w: s.w, name: s.name }, s.value);
    }), r;
  }
  return Ji;
}
var Qi, gl;
function rb() {
  if (gl) return Qi;
  gl = 1, Qi = e;
  function e(t) {
    var n = {}, o = [], i;
    function a(r) {
      Object.hasOwn(n, r) || (n[r] = !0, i.push(r), t.successors(r).forEach(a), t.predecessors(r).forEach(a));
    }
    return t.nodes().forEach(function(r) {
      i = [], a(r), i.length && o.push(i);
    }), o;
  }
  return Qi;
}
var er, vl;
function Jc() {
  if (vl) return er;
  vl = 1;
  class e {
    _arr = [];
    _keyIndices = {};
    /**
     * Returns the number of elements in the queue. Takes `O(1)` time.
     */
    size() {
      return this._arr.length;
    }
    /**
     * Returns the keys that are in the queue. Takes `O(n)` time.
     */
    keys() {
      return this._arr.map(function(n) {
        return n.key;
      });
    }
    /**
     * Returns `true` if **key** is in the queue and `false` if not.
     */
    has(n) {
      return Object.hasOwn(this._keyIndices, n);
    }
    /**
     * Returns the priority for **key**. If **key** is not present in the queue
     * then this function returns `undefined`. Takes `O(1)` time.
     *
     * @param {Object} key
     */
    priority(n) {
      var o = this._keyIndices[n];
      if (o !== void 0)
        return this._arr[o].priority;
    }
    /**
     * Returns the key for the minimum element in this queue. If the queue is
     * empty this function throws an Error. Takes `O(1)` time.
     */
    min() {
      if (this.size() === 0)
        throw new Error("Queue underflow");
      return this._arr[0].key;
    }
    /**
     * Inserts a new key into the priority queue. If the key already exists in
     * the queue this function returns `false`; otherwise it will return `true`.
     * Takes `O(n)` time.
     *
     * @param {Object} key the key to add
     * @param {Number} priority the initial priority for the key
     */
    add(n, o) {
      var i = this._keyIndices;
      if (n = String(n), !Object.hasOwn(i, n)) {
        var a = this._arr, r = a.length;
        return i[n] = r, a.push({ key: n, priority: o }), this._decrease(r), !0;
      }
      return !1;
    }
    /**
     * Removes and returns the smallest key in the queue. Takes `O(log n)` time.
     */
    removeMin() {
      this._swap(0, this._arr.length - 1);
      var n = this._arr.pop();
      return delete this._keyIndices[n.key], this._heapify(0), n.key;
    }
    /**
     * Decreases the priority for **key** to **priority**. If the new priority is
     * greater than the previous priority, this function will throw an Error.
     *
     * @param {Object} key the key for which to raise priority
     * @param {Number} priority the new priority for the key
     */
    decrease(n, o) {
      var i = this._keyIndices[n];
      if (o > this._arr[i].priority)
        throw new Error("New priority is greater than current priority. Key: " + n + " Old: " + this._arr[i].priority + " New: " + o);
      this._arr[i].priority = o, this._decrease(i);
    }
    _heapify(n) {
      var o = this._arr, i = 2 * n, a = i + 1, r = n;
      i < o.length && (r = o[i].priority < o[r].priority ? i : r, a < o.length && (r = o[a].priority < o[r].priority ? a : r), r !== n && (this._swap(n, r), this._heapify(r)));
    }
    _decrease(n) {
      for (var o = this._arr, i = o[n].priority, a; n !== 0 && (a = n >> 1, !(o[a].priority < i)); )
        this._swap(n, a), n = a;
    }
    _swap(n, o) {
      var i = this._arr, a = this._keyIndices, r = i[n], s = i[o];
      i[n] = s, i[o] = r, a[s.key] = n, a[r.key] = o;
    }
  }
  return er = e, er;
}
var tr, ml;
function Qc() {
  if (ml) return tr;
  ml = 1;
  var e = Jc();
  tr = n;
  var t = () => 1;
  function n(i, a, r, s) {
    return o(
      i,
      String(a),
      r || t,
      s || function(u) {
        return i.outEdges(u);
      }
    );
  }
  function o(i, a, r, s) {
    var u = {}, c = new e(), l, d, f = function(h) {
      var w = h.v !== l ? h.v : h.w, _ = u[w], m = r(h), p = d.distance + m;
      if (m < 0)
        throw new Error("dijkstra does not allow negative edge weights. Bad edge: " + h + " Weight: " + m);
      p < _.distance && (_.distance = p, _.predecessor = l, c.decrease(w, p));
    };
    for (i.nodes().forEach(function(h) {
      var w = h === a ? 0 : Number.POSITIVE_INFINITY;
      u[h] = { distance: w }, c.add(h, w);
    }); c.size() > 0 && (l = c.removeMin(), d = u[l], d.distance !== Number.POSITIVE_INFINITY); )
      s(l).forEach(f);
    return u;
  }
  return tr;
}
var nr, yl;
function ab() {
  if (yl) return nr;
  yl = 1;
  var e = Qc();
  nr = t;
  function t(n, o, i) {
    return n.nodes().reduce(function(a, r) {
      return a[r] = e(n, r, o, i), a;
    }, {});
  }
  return nr;
}
var or, wl;
function ed() {
  if (wl) return or;
  wl = 1, or = e;
  function e(t) {
    var n = 0, o = [], i = {}, a = [];
    function r(s) {
      var u = i[s] = {
        onStack: !0,
        lowlink: n,
        index: n++
      };
      if (o.push(s), t.successors(s).forEach(function(d) {
        Object.hasOwn(i, d) ? i[d].onStack && (u.lowlink = Math.min(u.lowlink, i[d].index)) : (r(d), u.lowlink = Math.min(u.lowlink, i[d].lowlink));
      }), u.lowlink === u.index) {
        var c = [], l;
        do
          l = o.pop(), i[l].onStack = !1, c.push(l);
        while (s !== l);
        a.push(c);
      }
    }
    return t.nodes().forEach(function(s) {
      Object.hasOwn(i, s) || r(s);
    }), a;
  }
  return or;
}
var ir, _l;
function sb() {
  if (_l) return ir;
  _l = 1;
  var e = ed();
  ir = t;
  function t(n) {
    return e(n).filter(function(o) {
      return o.length > 1 || o.length === 1 && n.hasEdge(o[0], o[0]);
    });
  }
  return ir;
}
var rr, bl;
function lb() {
  if (bl) return rr;
  bl = 1, rr = t;
  var e = () => 1;
  function t(o, i, a) {
    return n(
      o,
      i || e,
      a || function(r) {
        return o.outEdges(r);
      }
    );
  }
  function n(o, i, a) {
    var r = {}, s = o.nodes();
    return s.forEach(function(u) {
      r[u] = {}, r[u][u] = { distance: 0 }, s.forEach(function(c) {
        u !== c && (r[u][c] = { distance: Number.POSITIVE_INFINITY });
      }), a(u).forEach(function(c) {
        var l = c.v === u ? c.w : c.v, d = i(c);
        r[u][l] = { distance: d, predecessor: u };
      });
    }), s.forEach(function(u) {
      var c = r[u];
      s.forEach(function(l) {
        var d = r[l];
        s.forEach(function(f) {
          var h = d[u], w = c[f], _ = d[f], m = h.distance + w.distance;
          m < _.distance && (_.distance = m, _.predecessor = w.predecessor);
        });
      });
    }), r;
  }
  return rr;
}
var ar, kl;
function td() {
  if (kl) return ar;
  kl = 1;
  function e(n) {
    var o = {}, i = {}, a = [];
    function r(s) {
      if (Object.hasOwn(i, s))
        throw new t();
      Object.hasOwn(o, s) || (i[s] = !0, o[s] = !0, n.predecessors(s).forEach(r), delete i[s], a.push(s));
    }
    if (n.sinks().forEach(r), Object.keys(o).length !== n.nodeCount())
      throw new t();
    return a;
  }
  class t extends Error {
    constructor() {
      super(...arguments);
    }
  }
  return ar = e, e.CycleException = t, ar;
}
var sr, El;
function ub() {
  if (El) return sr;
  El = 1;
  var e = td();
  sr = t;
  function t(n) {
    try {
      e(n);
    } catch (o) {
      if (o instanceof e.CycleException)
        return !1;
      throw o;
    }
    return !0;
  }
  return sr;
}
var lr, $l;
function nd() {
  if ($l) return lr;
  $l = 1, lr = e;
  function e(i, a, r) {
    Array.isArray(a) || (a = [a]);
    var s = i.isDirected() ? (d) => i.successors(d) : (d) => i.neighbors(d), u = r === "post" ? t : n, c = [], l = {};
    return a.forEach((d) => {
      if (!i.hasNode(d))
        throw new Error("Graph does not have node: " + d);
      u(d, s, l, c);
    }), c;
  }
  function t(i, a, r, s) {
    for (var u = [[i, !1]]; u.length > 0; ) {
      var c = u.pop();
      c[1] ? s.push(c[0]) : Object.hasOwn(r, c[0]) || (r[c[0]] = !0, u.push([c[0], !0]), o(a(c[0]), (l) => u.push([l, !1])));
    }
  }
  function n(i, a, r, s) {
    for (var u = [i]; u.length > 0; ) {
      var c = u.pop();
      Object.hasOwn(r, c) || (r[c] = !0, s.push(c), o(a(c), (l) => u.push(l)));
    }
  }
  function o(i, a) {
    for (var r = i.length; r--; )
      a(i[r], r, i);
    return i;
  }
  return lr;
}
var ur, xl;
function cb() {
  if (xl) return ur;
  xl = 1;
  var e = nd();
  ur = t;
  function t(n, o) {
    return e(n, o, "post");
  }
  return ur;
}
var cr, Sl;
function db() {
  if (Sl) return cr;
  Sl = 1;
  var e = nd();
  cr = t;
  function t(n, o) {
    return e(n, o, "pre");
  }
  return cr;
}
var dr, Nl;
function fb() {
  if (Nl) return dr;
  Nl = 1;
  var e = Ha(), t = Jc();
  dr = n;
  function n(o, i) {
    var a = new e(), r = {}, s = new t(), u;
    function c(d) {
      var f = d.v === u ? d.w : d.v, h = s.priority(f);
      if (h !== void 0) {
        var w = i(d);
        w < h && (r[f] = u, s.decrease(f, w));
      }
    }
    if (o.nodeCount() === 0)
      return a;
    o.nodes().forEach(function(d) {
      s.add(d, Number.POSITIVE_INFINITY), a.setNode(d);
    }), s.decrease(o.nodes()[0], 0);
    for (var l = !1; s.size() > 0; ) {
      if (u = s.removeMin(), Object.hasOwn(r, u))
        a.setEdge(u, r[u]);
      else {
        if (l)
          throw new Error("Input graph is not connected: " + o);
        l = !0;
      }
      o.nodeEdges(u).forEach(c);
    }
    return a;
  }
  return dr;
}
var fr, Cl;
function hb() {
  return Cl || (Cl = 1, fr = {
    components: rb(),
    dijkstra: Qc(),
    dijkstraAll: ab(),
    findCycles: sb(),
    floydWarshall: lb(),
    isAcyclic: ub(),
    postorder: cb(),
    preorder: db(),
    prim: fb(),
    tarjan: ed(),
    topsort: td()
  }), fr;
}
var hr, Ml;
function nt() {
  if (Ml) return hr;
  Ml = 1;
  var e = ob();
  return hr = {
    Graph: e.Graph,
    json: ib(),
    alg: hb(),
    version: e.version
  }, hr;
}
var pr, Tl;
function pb() {
  if (Tl) return pr;
  Tl = 1;
  class e {
    constructor() {
      let i = {};
      i._next = i._prev = i, this._sentinel = i;
    }
    dequeue() {
      let i = this._sentinel, a = i._prev;
      if (a !== i)
        return t(a), a;
    }
    enqueue(i) {
      let a = this._sentinel;
      i._prev && i._next && t(i), i._next = a._next, a._next._prev = i, a._next = i, i._prev = a;
    }
    toString() {
      let i = [], a = this._sentinel, r = a._prev;
      for (; r !== a; )
        i.push(JSON.stringify(r, n)), r = r._prev;
      return "[" + i.join(", ") + "]";
    }
  }
  function t(o) {
    o._prev._next = o._next, o._next._prev = o._prev, delete o._next, delete o._prev;
  }
  function n(o, i) {
    if (o !== "_next" && o !== "_prev")
      return i;
  }
  return pr = e, pr;
}
var gr, Il;
function gb() {
  if (Il) return gr;
  Il = 1;
  let e = nt().Graph, t = pb();
  gr = o;
  let n = () => 1;
  function o(c, l) {
    if (c.nodeCount() <= 1)
      return [];
    let d = r(c, l || n);
    return i(d.graph, d.buckets, d.zeroIdx).flatMap((h) => c.outEdges(h.v, h.w));
  }
  function i(c, l, d) {
    let f = [], h = l[l.length - 1], w = l[0], _;
    for (; c.nodeCount(); ) {
      for (; _ = w.dequeue(); )
        a(c, l, d, _);
      for (; _ = h.dequeue(); )
        a(c, l, d, _);
      if (c.nodeCount()) {
        for (let m = l.length - 2; m > 0; --m)
          if (_ = l[m].dequeue(), _) {
            f = f.concat(a(c, l, d, _, !0));
            break;
          }
      }
    }
    return f;
  }
  function a(c, l, d, f, h) {
    let w = h ? [] : void 0;
    return c.inEdges(f.v).forEach((_) => {
      let m = c.edge(_), p = c.node(_.v);
      h && w.push({ v: _.v, w: _.w }), p.out -= m, s(l, d, p);
    }), c.outEdges(f.v).forEach((_) => {
      let m = c.edge(_), p = _.w, v = c.node(p);
      v.in -= m, s(l, d, v);
    }), c.removeNode(f.v), w;
  }
  function r(c, l) {
    let d = new e(), f = 0, h = 0;
    c.nodes().forEach((m) => {
      d.setNode(m, { v: m, in: 0, out: 0 });
    }), c.edges().forEach((m) => {
      let p = d.edge(m.v, m.w) || 0, v = l(m), g = p + v;
      d.setEdge(m.v, m.w, g), h = Math.max(h, d.node(m.v).out += v), f = Math.max(f, d.node(m.w).in += v);
    });
    let w = u(h + f + 3).map(() => new t()), _ = f + 1;
    return d.nodes().forEach((m) => {
      s(w, _, d.node(m));
    }), { graph: d, buckets: w, zeroIdx: _ };
  }
  function s(c, l, d) {
    d.out ? d.in ? c[d.out - d.in + l].enqueue(d) : c[c.length - 1].enqueue(d) : c[0].enqueue(d);
  }
  function u(c) {
    const l = [];
    for (let d = 0; d < c; d++)
      l.push(d);
    return l;
  }
  return gr;
}
var vr, Dl;
function Fe() {
  if (Dl) return vr;
  Dl = 1;
  let e = nt().Graph;
  vr = {
    addBorderNode: l,
    addDummyNode: t,
    applyWithChunking: h,
    asNonCompoundGraph: o,
    buildLayerMatrix: s,
    intersectRect: r,
    mapValues: F,
    maxRank: w,
    normalizeRanks: u,
    notime: p,
    partition: _,
    pick: O,
    predecessorWeights: a,
    range: b,
    removeEmptyRanks: c,
    simplify: n,
    successorWeights: i,
    time: m,
    uniqueId: g,
    zipObject: K
  };
  function t(N, C, M, B) {
    for (var S = B; N.hasNode(S); )
      S = g(B);
    return M.dummy = C, N.setNode(S, M), S;
  }
  function n(N) {
    let C = new e().setGraph(N.graph());
    return N.nodes().forEach((M) => C.setNode(M, N.node(M))), N.edges().forEach((M) => {
      let B = C.edge(M.v, M.w) || { weight: 0, minlen: 1 }, S = N.edge(M);
      C.setEdge(M.v, M.w, {
        weight: B.weight + S.weight,
        minlen: Math.max(B.minlen, S.minlen)
      });
    }), C;
  }
  function o(N) {
    let C = new e({ multigraph: N.isMultigraph() }).setGraph(N.graph());
    return N.nodes().forEach((M) => {
      N.children(M).length || C.setNode(M, N.node(M));
    }), N.edges().forEach((M) => {
      C.setEdge(M, N.edge(M));
    }), C;
  }
  function i(N) {
    let C = N.nodes().map((M) => {
      let B = {};
      return N.outEdges(M).forEach((S) => {
        B[S.w] = (B[S.w] || 0) + N.edge(S).weight;
      }), B;
    });
    return K(N.nodes(), C);
  }
  function a(N) {
    let C = N.nodes().map((M) => {
      let B = {};
      return N.inEdges(M).forEach((S) => {
        B[S.v] = (B[S.v] || 0) + N.edge(S).weight;
      }), B;
    });
    return K(N.nodes(), C);
  }
  function r(N, C) {
    let M = N.x, B = N.y, S = C.x - M, Q = C.y - B, y = N.width / 2, P = N.height / 2;
    if (!S && !Q)
      throw new Error("Not possible to find intersection inside of the rectangle");
    let $, X;
    return Math.abs(Q) * y > Math.abs(S) * P ? (Q < 0 && (P = -P), $ = P * S / Q, X = P) : (S < 0 && (y = -y), $ = y, X = y * Q / S), { x: M + $, y: B + X };
  }
  function s(N) {
    let C = b(w(N) + 1).map(() => []);
    return N.nodes().forEach((M) => {
      let B = N.node(M), S = B.rank;
      S !== void 0 && (C[S][B.order] = M);
    }), C;
  }
  function u(N) {
    let C = N.nodes().map((B) => {
      let S = N.node(B).rank;
      return S === void 0 ? Number.MAX_VALUE : S;
    }), M = h(Math.min, C);
    N.nodes().forEach((B) => {
      let S = N.node(B);
      Object.hasOwn(S, "rank") && (S.rank -= M);
    });
  }
  function c(N) {
    let C = N.nodes().map((y) => N.node(y).rank), M = h(Math.min, C), B = [];
    N.nodes().forEach((y) => {
      let P = N.node(y).rank - M;
      B[P] || (B[P] = []), B[P].push(y);
    });
    let S = 0, Q = N.graph().nodeRankFactor;
    Array.from(B).forEach((y, P) => {
      y === void 0 && P % Q !== 0 ? --S : y !== void 0 && S && y.forEach(($) => N.node($).rank += S);
    });
  }
  function l(N, C, M, B) {
    let S = {
      width: 0,
      height: 0
    };
    return arguments.length >= 4 && (S.rank = M, S.order = B), t(N, "border", S, C);
  }
  function d(N, C = f) {
    const M = [];
    for (let B = 0; B < N.length; B += C) {
      const S = N.slice(B, B + C);
      M.push(S);
    }
    return M;
  }
  const f = 65535;
  function h(N, C) {
    if (C.length > f) {
      const M = d(C);
      return N.apply(null, M.map((B) => N.apply(null, B)));
    } else
      return N.apply(null, C);
  }
  function w(N) {
    const M = N.nodes().map((B) => {
      let S = N.node(B).rank;
      return S === void 0 ? Number.MIN_VALUE : S;
    });
    return h(Math.max, M);
  }
  function _(N, C) {
    let M = { lhs: [], rhs: [] };
    return N.forEach((B) => {
      C(B) ? M.lhs.push(B) : M.rhs.push(B);
    }), M;
  }
  function m(N, C) {
    let M = Date.now();
    try {
      return C();
    } finally {
      console.log(N + " time: " + (Date.now() - M) + "ms");
    }
  }
  function p(N, C) {
    return C();
  }
  let v = 0;
  function g(N) {
    var C = ++v;
    return N + ("" + C);
  }
  function b(N, C, M = 1) {
    C == null && (C = N, N = 0);
    let B = (Q) => Q < C;
    M < 0 && (B = (Q) => C < Q);
    const S = [];
    for (let Q = N; B(Q); Q += M)
      S.push(Q);
    return S;
  }
  function O(N, C) {
    const M = {};
    for (const B of C)
      N[B] !== void 0 && (M[B] = N[B]);
    return M;
  }
  function F(N, C) {
    let M = C;
    return typeof C == "string" && (M = (B) => B[C]), Object.entries(N).reduce((B, [S, Q]) => (B[S] = M(Q, S), B), {});
  }
  function K(N, C) {
    return N.reduce((M, B, S) => (M[B] = C[S], M), {});
  }
  return vr;
}
var mr, Al;
function vb() {
  if (Al) return mr;
  Al = 1;
  let e = gb(), t = Fe().uniqueId;
  mr = {
    run: n,
    undo: i
  };
  function n(a) {
    (a.graph().acyclicer === "greedy" ? e(a, s(a)) : o(a)).forEach((u) => {
      let c = a.edge(u);
      a.removeEdge(u), c.forwardName = u.name, c.reversed = !0, a.setEdge(u.w, u.v, c, t("rev"));
    });
    function s(u) {
      return (c) => u.edge(c).weight;
    }
  }
  function o(a) {
    let r = [], s = {}, u = {};
    function c(l) {
      Object.hasOwn(u, l) || (u[l] = !0, s[l] = !0, a.outEdges(l).forEach((d) => {
        Object.hasOwn(s, d.w) ? r.push(d) : c(d.w);
      }), delete s[l]);
    }
    return a.nodes().forEach(c), r;
  }
  function i(a) {
    a.edges().forEach((r) => {
      let s = a.edge(r);
      if (s.reversed) {
        a.removeEdge(r);
        let u = s.forwardName;
        delete s.reversed, delete s.forwardName, a.setEdge(r.w, r.v, s, u);
      }
    });
  }
  return mr;
}
var yr, Ol;
function mb() {
  if (Ol) return yr;
  Ol = 1;
  let e = Fe();
  yr = {
    run: t,
    undo: o
  };
  function t(i) {
    i.graph().dummyChains = [], i.edges().forEach((a) => n(i, a));
  }
  function n(i, a) {
    let r = a.v, s = i.node(r).rank, u = a.w, c = i.node(u).rank, l = a.name, d = i.edge(a), f = d.labelRank;
    if (c === s + 1) return;
    i.removeEdge(a);
    let h, w, _;
    for (_ = 0, ++s; s < c; ++_, ++s)
      d.points = [], w = {
        width: 0,
        height: 0,
        edgeLabel: d,
        edgeObj: a,
        rank: s
      }, h = e.addDummyNode(i, "edge", w, "_d"), s === f && (w.width = d.width, w.height = d.height, w.dummy = "edge-label", w.labelpos = d.labelpos), i.setEdge(r, h, { weight: d.weight }, l), _ === 0 && i.graph().dummyChains.push(h), r = h;
    i.setEdge(r, u, { weight: d.weight }, l);
  }
  function o(i) {
    i.graph().dummyChains.forEach((a) => {
      let r = i.node(a), s = r.edgeLabel, u;
      for (i.setEdge(r.edgeObj, s); r.dummy; )
        u = i.successors(a)[0], i.removeNode(a), s.points.push({ x: r.x, y: r.y }), r.dummy === "edge-label" && (s.x = r.x, s.y = r.y, s.width = r.width, s.height = r.height), a = u, r = i.node(a);
    });
  }
  return yr;
}
var wr, Pl;
function ri() {
  if (Pl) return wr;
  Pl = 1;
  const { applyWithChunking: e } = Fe();
  wr = {
    longestPath: t,
    slack: n
  };
  function t(o) {
    var i = {};
    function a(r) {
      var s = o.node(r);
      if (Object.hasOwn(i, r))
        return s.rank;
      i[r] = !0;
      let u = o.outEdges(r).map((l) => l == null ? Number.POSITIVE_INFINITY : a(l.w) - o.edge(l).minlen);
      var c = e(Math.min, u);
      return c === Number.POSITIVE_INFINITY && (c = 0), s.rank = c;
    }
    o.sources().forEach(a);
  }
  function n(o, i) {
    return o.node(i.w).rank - o.node(i.v).rank - o.edge(i).minlen;
  }
  return wr;
}
var _r, Rl;
function od() {
  if (Rl) return _r;
  Rl = 1;
  var e = nt().Graph, t = ri().slack;
  _r = n;
  function n(r) {
    var s = new e({ directed: !1 }), u = r.nodes()[0], c = r.nodeCount();
    s.setNode(u, {});
    for (var l, d; o(s, r) < c; )
      l = i(s, r), d = s.hasNode(l.v) ? t(r, l) : -t(r, l), a(s, r, d);
    return s;
  }
  function o(r, s) {
    function u(c) {
      s.nodeEdges(c).forEach((l) => {
        var d = l.v, f = c === d ? l.w : d;
        !r.hasNode(f) && !t(s, l) && (r.setNode(f, {}), r.setEdge(c, f, {}), u(f));
      });
    }
    return r.nodes().forEach(u), r.nodeCount();
  }
  function i(r, s) {
    return s.edges().reduce((c, l) => {
      let d = Number.POSITIVE_INFINITY;
      return r.hasNode(l.v) !== r.hasNode(l.w) && (d = t(s, l)), d < c[0] ? [d, l] : c;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function a(r, s, u) {
    r.nodes().forEach((c) => s.node(c).rank += u);
  }
  return _r;
}
var br, zl;
function yb() {
  if (zl) return br;
  zl = 1;
  var e = od(), t = ri().slack, n = ri().longestPath, o = nt().alg.preorder, i = nt().alg.postorder, a = Fe().simplify;
  br = r, r.initLowLimValues = l, r.initCutValues = s, r.calcCutValue = c, r.leaveEdge = f, r.enterEdge = h, r.exchangeEdges = w;
  function r(v) {
    v = a(v), n(v);
    var g = e(v);
    l(g), s(g, v);
    for (var b, O; b = f(g); )
      O = h(g, v, b), w(g, v, b, O);
  }
  function s(v, g) {
    var b = i(v, v.nodes());
    b = b.slice(0, b.length - 1), b.forEach((O) => u(v, g, O));
  }
  function u(v, g, b) {
    var O = v.node(b), F = O.parent;
    v.edge(b, F).cutvalue = c(v, g, b);
  }
  function c(v, g, b) {
    var O = v.node(b), F = O.parent, K = !0, N = g.edge(b, F), C = 0;
    return N || (K = !1, N = g.edge(F, b)), C = N.weight, g.nodeEdges(b).forEach((M) => {
      var B = M.v === b, S = B ? M.w : M.v;
      if (S !== F) {
        var Q = B === K, y = g.edge(M).weight;
        if (C += Q ? y : -y, m(v, b, S)) {
          var P = v.edge(b, S).cutvalue;
          C += Q ? -P : P;
        }
      }
    }), C;
  }
  function l(v, g) {
    arguments.length < 2 && (g = v.nodes()[0]), d(v, {}, 1, g);
  }
  function d(v, g, b, O, F) {
    var K = b, N = v.node(O);
    return g[O] = !0, v.neighbors(O).forEach((C) => {
      Object.hasOwn(g, C) || (b = d(v, g, b, C, O));
    }), N.low = K, N.lim = b++, F ? N.parent = F : delete N.parent, b;
  }
  function f(v) {
    return v.edges().find((g) => v.edge(g).cutvalue < 0);
  }
  function h(v, g, b) {
    var O = b.v, F = b.w;
    g.hasEdge(O, F) || (O = b.w, F = b.v);
    var K = v.node(O), N = v.node(F), C = K, M = !1;
    K.lim > N.lim && (C = N, M = !0);
    var B = g.edges().filter((S) => M === p(v, v.node(S.v), C) && M !== p(v, v.node(S.w), C));
    return B.reduce((S, Q) => t(g, Q) < t(g, S) ? Q : S);
  }
  function w(v, g, b, O) {
    var F = b.v, K = b.w;
    v.removeEdge(F, K), v.setEdge(O.v, O.w, {}), l(v), s(v, g), _(v, g);
  }
  function _(v, g) {
    var b = v.nodes().find((F) => !g.node(F).parent), O = o(v, b);
    O = O.slice(1), O.forEach((F) => {
      var K = v.node(F).parent, N = g.edge(F, K), C = !1;
      N || (N = g.edge(K, F), C = !0), g.node(F).rank = g.node(K).rank + (C ? N.minlen : -N.minlen);
    });
  }
  function m(v, g, b) {
    return v.hasEdge(g, b);
  }
  function p(v, g, b) {
    return b.low <= g.lim && g.lim <= b.lim;
  }
  return br;
}
var kr, Bl;
function wb() {
  if (Bl) return kr;
  Bl = 1;
  var e = ri(), t = e.longestPath, n = od(), o = yb();
  kr = i;
  function i(u) {
    var c = u.graph().ranker;
    if (c instanceof Function)
      return c(u);
    switch (u.graph().ranker) {
      case "network-simplex":
        s(u);
        break;
      case "tight-tree":
        r(u);
        break;
      case "longest-path":
        a(u);
        break;
      case "none":
        break;
      default:
        s(u);
    }
  }
  var a = t;
  function r(u) {
    t(u), n(u);
  }
  function s(u) {
    o(u);
  }
  return kr;
}
var Er, Ll;
function _b() {
  if (Ll) return Er;
  Ll = 1, Er = e;
  function e(o) {
    let i = n(o);
    o.graph().dummyChains.forEach((a) => {
      let r = o.node(a), s = r.edgeObj, u = t(o, i, s.v, s.w), c = u.path, l = u.lca, d = 0, f = c[d], h = !0;
      for (; a !== s.w; ) {
        if (r = o.node(a), h) {
          for (; (f = c[d]) !== l && o.node(f).maxRank < r.rank; )
            d++;
          f === l && (h = !1);
        }
        if (!h) {
          for (; d < c.length - 1 && o.node(f = c[d + 1]).minRank <= r.rank; )
            d++;
          f = c[d];
        }
        o.setParent(a, f), a = o.successors(a)[0];
      }
    });
  }
  function t(o, i, a, r) {
    let s = [], u = [], c = Math.min(i[a].low, i[r].low), l = Math.max(i[a].lim, i[r].lim), d, f;
    d = a;
    do
      d = o.parent(d), s.push(d);
    while (d && (i[d].low > c || l > i[d].lim));
    for (f = d, d = r; (d = o.parent(d)) !== f; )
      u.push(d);
    return { path: s.concat(u.reverse()), lca: f };
  }
  function n(o) {
    let i = {}, a = 0;
    function r(s) {
      let u = a;
      o.children(s).forEach(r), i[s] = { low: u, lim: a++ };
    }
    return o.children().forEach(r), i;
  }
  return Er;
}
var $r, Vl;
function bb() {
  if (Vl) return $r;
  Vl = 1;
  let e = Fe();
  $r = {
    run: t,
    cleanup: a
  };
  function t(r) {
    let s = e.addDummyNode(r, "root", {}, "_root"), u = o(r), c = Object.values(u), l = e.applyWithChunking(Math.max, c) - 1, d = 2 * l + 1;
    r.graph().nestingRoot = s, r.edges().forEach((h) => r.edge(h).minlen *= d);
    let f = i(r) + 1;
    r.children().forEach((h) => n(r, s, d, f, l, u, h)), r.graph().nodeRankFactor = d;
  }
  function n(r, s, u, c, l, d, f) {
    let h = r.children(f);
    if (!h.length) {
      f !== s && r.setEdge(s, f, { weight: 0, minlen: u });
      return;
    }
    let w = e.addBorderNode(r, "_bt"), _ = e.addBorderNode(r, "_bb"), m = r.node(f);
    r.setParent(w, f), m.borderTop = w, r.setParent(_, f), m.borderBottom = _, h.forEach((p) => {
      n(r, s, u, c, l, d, p);
      let v = r.node(p), g = v.borderTop ? v.borderTop : p, b = v.borderBottom ? v.borderBottom : p, O = v.borderTop ? c : 2 * c, F = g !== b ? 1 : l - d[f] + 1;
      r.setEdge(w, g, {
        weight: O,
        minlen: F,
        nestingEdge: !0
      }), r.setEdge(b, _, {
        weight: O,
        minlen: F,
        nestingEdge: !0
      });
    }), r.parent(f) || r.setEdge(s, w, { weight: 0, minlen: l + d[f] });
  }
  function o(r) {
    var s = {};
    function u(c, l) {
      var d = r.children(c);
      d && d.length && d.forEach((f) => u(f, l + 1)), s[c] = l;
    }
    return r.children().forEach((c) => u(c, 1)), s;
  }
  function i(r) {
    return r.edges().reduce((s, u) => s + r.edge(u).weight, 0);
  }
  function a(r) {
    var s = r.graph();
    r.removeNode(s.nestingRoot), delete s.nestingRoot, r.edges().forEach((u) => {
      var c = r.edge(u);
      c.nestingEdge && r.removeEdge(u);
    });
  }
  return $r;
}
var xr, Hl;
function kb() {
  if (Hl) return xr;
  Hl = 1;
  let e = Fe();
  xr = t;
  function t(o) {
    function i(a) {
      let r = o.children(a), s = o.node(a);
      if (r.length && r.forEach(i), Object.hasOwn(s, "minRank")) {
        s.borderLeft = [], s.borderRight = [];
        for (let u = s.minRank, c = s.maxRank + 1; u < c; ++u)
          n(o, "borderLeft", "_bl", a, s, u), n(o, "borderRight", "_br", a, s, u);
      }
    }
    o.children().forEach(i);
  }
  function n(o, i, a, r, s, u) {
    let c = { width: 0, height: 0, rank: u, borderType: i }, l = s[i][u - 1], d = e.addDummyNode(o, "border", c, a);
    s[i][u] = d, o.setParent(d, r), l && o.setEdge(l, d, { weight: 1 });
  }
  return xr;
}
var Sr, Fl;
function Eb() {
  if (Fl) return Sr;
  Fl = 1, Sr = {
    adjust: e,
    undo: t
  };
  function e(u) {
    let c = u.graph().rankdir.toLowerCase();
    (c === "lr" || c === "rl") && n(u);
  }
  function t(u) {
    let c = u.graph().rankdir.toLowerCase();
    (c === "bt" || c === "rl") && i(u), (c === "lr" || c === "rl") && (r(u), n(u));
  }
  function n(u) {
    u.nodes().forEach((c) => o(u.node(c))), u.edges().forEach((c) => o(u.edge(c)));
  }
  function o(u) {
    let c = u.width;
    u.width = u.height, u.height = c;
  }
  function i(u) {
    u.nodes().forEach((c) => a(u.node(c))), u.edges().forEach((c) => {
      let l = u.edge(c);
      l.points.forEach(a), Object.hasOwn(l, "y") && a(l);
    });
  }
  function a(u) {
    u.y = -u.y;
  }
  function r(u) {
    u.nodes().forEach((c) => s(u.node(c))), u.edges().forEach((c) => {
      let l = u.edge(c);
      l.points.forEach(s), Object.hasOwn(l, "x") && s(l);
    });
  }
  function s(u) {
    let c = u.x;
    u.x = u.y, u.y = c;
  }
  return Sr;
}
var Nr, Gl;
function $b() {
  if (Gl) return Nr;
  Gl = 1;
  let e = Fe();
  Nr = t;
  function t(n) {
    let o = {}, i = n.nodes().filter((l) => !n.children(l).length), a = i.map((l) => n.node(l).rank), r = e.applyWithChunking(Math.max, a), s = e.range(r + 1).map(() => []);
    function u(l) {
      if (o[l]) return;
      o[l] = !0;
      let d = n.node(l);
      s[d.rank].push(l), n.successors(l).forEach(u);
    }
    return i.sort((l, d) => n.node(l).rank - n.node(d).rank).forEach(u), s;
  }
  return Nr;
}
var Cr, Yl;
function xb() {
  if (Yl) return Cr;
  Yl = 1;
  let e = Fe().zipObject;
  Cr = t;
  function t(o, i) {
    let a = 0;
    for (let r = 1; r < i.length; ++r)
      a += n(o, i[r - 1], i[r]);
    return a;
  }
  function n(o, i, a) {
    let r = e(a, a.map((f, h) => h)), s = i.flatMap((f) => o.outEdges(f).map((h) => ({ pos: r[h.w], weight: o.edge(h).weight })).sort((h, w) => h.pos - w.pos)), u = 1;
    for (; u < a.length; ) u <<= 1;
    let c = 2 * u - 1;
    u -= 1;
    let l = new Array(c).fill(0), d = 0;
    return s.forEach((f) => {
      let h = f.pos + u;
      l[h] += f.weight;
      let w = 0;
      for (; h > 0; )
        h % 2 && (w += l[h + 1]), h = h - 1 >> 1, l[h] += f.weight;
      d += f.weight * w;
    }), d;
  }
  return Cr;
}
var Mr, Ul;
function Sb() {
  if (Ul) return Mr;
  Ul = 1, Mr = e;
  function e(t, n = []) {
    return n.map((o) => {
      let i = t.inEdges(o);
      if (i.length) {
        let a = i.reduce((r, s) => {
          let u = t.edge(s), c = t.node(s.v);
          return {
            sum: r.sum + u.weight * c.order,
            weight: r.weight + u.weight
          };
        }, { sum: 0, weight: 0 });
        return {
          v: o,
          barycenter: a.sum / a.weight,
          weight: a.weight
        };
      } else
        return { v: o };
    });
  }
  return Mr;
}
var Tr, ql;
function Nb() {
  if (ql) return Tr;
  ql = 1;
  let e = Fe();
  Tr = t;
  function t(i, a) {
    let r = {};
    i.forEach((u, c) => {
      let l = r[u.v] = {
        indegree: 0,
        in: [],
        out: [],
        vs: [u.v],
        i: c
      };
      u.barycenter !== void 0 && (l.barycenter = u.barycenter, l.weight = u.weight);
    }), a.edges().forEach((u) => {
      let c = r[u.v], l = r[u.w];
      c !== void 0 && l !== void 0 && (l.indegree++, c.out.push(r[u.w]));
    });
    let s = Object.values(r).filter((u) => !u.indegree);
    return n(s);
  }
  function n(i) {
    let a = [];
    function r(u) {
      return (c) => {
        c.merged || (c.barycenter === void 0 || u.barycenter === void 0 || c.barycenter >= u.barycenter) && o(u, c);
      };
    }
    function s(u) {
      return (c) => {
        c.in.push(u), --c.indegree === 0 && i.push(c);
      };
    }
    for (; i.length; ) {
      let u = i.pop();
      a.push(u), u.in.reverse().forEach(r(u)), u.out.forEach(s(u));
    }
    return a.filter((u) => !u.merged).map((u) => e.pick(u, ["vs", "i", "barycenter", "weight"]));
  }
  function o(i, a) {
    let r = 0, s = 0;
    i.weight && (r += i.barycenter * i.weight, s += i.weight), a.weight && (r += a.barycenter * a.weight, s += a.weight), i.vs = a.vs.concat(i.vs), i.barycenter = r / s, i.weight = s, i.i = Math.min(a.i, i.i), a.merged = !0;
  }
  return Tr;
}
var Ir, Xl;
function Cb() {
  if (Xl) return Ir;
  Xl = 1;
  let e = Fe();
  Ir = t;
  function t(i, a) {
    let r = e.partition(i, (w) => Object.hasOwn(w, "barycenter")), s = r.lhs, u = r.rhs.sort((w, _) => _.i - w.i), c = [], l = 0, d = 0, f = 0;
    s.sort(o(!!a)), f = n(c, u, f), s.forEach((w) => {
      f += w.vs.length, c.push(w.vs), l += w.barycenter * w.weight, d += w.weight, f = n(c, u, f);
    });
    let h = { vs: c.flat(!0) };
    return d && (h.barycenter = l / d, h.weight = d), h;
  }
  function n(i, a, r) {
    let s;
    for (; a.length && (s = a[a.length - 1]).i <= r; )
      a.pop(), i.push(s.vs), r++;
    return r;
  }
  function o(i) {
    return (a, r) => a.barycenter < r.barycenter ? -1 : a.barycenter > r.barycenter ? 1 : i ? r.i - a.i : a.i - r.i;
  }
  return Ir;
}
var Dr, Wl;
function Mb() {
  if (Wl) return Dr;
  Wl = 1;
  let e = Sb(), t = Nb(), n = Cb();
  Dr = o;
  function o(r, s, u, c) {
    let l = r.children(s), d = r.node(s), f = d ? d.borderLeft : void 0, h = d ? d.borderRight : void 0, w = {};
    f && (l = l.filter((v) => v !== f && v !== h));
    let _ = e(r, l);
    _.forEach((v) => {
      if (r.children(v.v).length) {
        let g = o(r, v.v, u, c);
        w[v.v] = g, Object.hasOwn(g, "barycenter") && a(v, g);
      }
    });
    let m = t(_, u);
    i(m, w);
    let p = n(m, c);
    if (f && (p.vs = [f, p.vs, h].flat(!0), r.predecessors(f).length)) {
      let v = r.node(r.predecessors(f)[0]), g = r.node(r.predecessors(h)[0]);
      Object.hasOwn(p, "barycenter") || (p.barycenter = 0, p.weight = 0), p.barycenter = (p.barycenter * p.weight + v.order + g.order) / (p.weight + 2), p.weight += 2;
    }
    return p;
  }
  function i(r, s) {
    r.forEach((u) => {
      u.vs = u.vs.flatMap((c) => s[c] ? s[c].vs : c);
    });
  }
  function a(r, s) {
    r.barycenter !== void 0 ? (r.barycenter = (r.barycenter * r.weight + s.barycenter * s.weight) / (r.weight + s.weight), r.weight += s.weight) : (r.barycenter = s.barycenter, r.weight = s.weight);
  }
  return Dr;
}
var Ar, Kl;
function Tb() {
  if (Kl) return Ar;
  Kl = 1;
  let e = nt().Graph, t = Fe();
  Ar = n;
  function n(i, a, r, s) {
    s || (s = i.nodes());
    let u = o(i), c = new e({ compound: !0 }).setGraph({ root: u }).setDefaultNodeLabel((l) => i.node(l));
    return s.forEach((l) => {
      let d = i.node(l), f = i.parent(l);
      (d.rank === a || d.minRank <= a && a <= d.maxRank) && (c.setNode(l), c.setParent(l, f || u), i[r](l).forEach((h) => {
        let w = h.v === l ? h.w : h.v, _ = c.edge(w, l), m = _ !== void 0 ? _.weight : 0;
        c.setEdge(w, l, { weight: i.edge(h).weight + m });
      }), Object.hasOwn(d, "minRank") && c.setNode(l, {
        borderLeft: d.borderLeft[a],
        borderRight: d.borderRight[a]
      }));
    }), c;
  }
  function o(i) {
    for (var a; i.hasNode(a = t.uniqueId("_root")); ) ;
    return a;
  }
  return Ar;
}
var Or, Zl;
function Ib() {
  if (Zl) return Or;
  Zl = 1, Or = e;
  function e(t, n, o) {
    let i = {}, a;
    o.forEach((r) => {
      let s = t.parent(r), u, c;
      for (; s; ) {
        if (u = t.parent(s), u ? (c = i[u], i[u] = s) : (c = a, a = s), c && c !== s) {
          n.setEdge(c, s);
          return;
        }
        s = u;
      }
    });
  }
  return Or;
}
var Pr, jl;
function Db() {
  if (jl) return Pr;
  jl = 1;
  let e = $b(), t = xb(), n = Mb(), o = Tb(), i = Ib(), a = nt().Graph, r = Fe();
  Pr = s;
  function s(d, f) {
    if (f && typeof f.customOrder == "function") {
      f.customOrder(d, s);
      return;
    }
    let h = r.maxRank(d), w = u(d, r.range(1, h + 1), "inEdges"), _ = u(d, r.range(h - 1, -1, -1), "outEdges"), m = e(d);
    if (l(d, m), f && f.disableOptimalOrderHeuristic)
      return;
    let p = Number.POSITIVE_INFINITY, v;
    for (let g = 0, b = 0; b < 4; ++g, ++b) {
      c(g % 2 ? w : _, g % 4 >= 2), m = r.buildLayerMatrix(d);
      let O = t(d, m);
      O < p && (b = 0, v = Object.assign({}, m), p = O);
    }
    l(d, v);
  }
  function u(d, f, h) {
    const w = /* @__PURE__ */ new Map(), _ = (m, p) => {
      w.has(m) || w.set(m, []), w.get(m).push(p);
    };
    for (const m of d.nodes()) {
      const p = d.node(m);
      if (typeof p.rank == "number" && _(p.rank, m), typeof p.minRank == "number" && typeof p.maxRank == "number")
        for (let v = p.minRank; v <= p.maxRank; v++)
          v !== p.rank && _(v, m);
    }
    return f.map(function(m) {
      return o(d, m, h, w.get(m) || []);
    });
  }
  function c(d, f) {
    let h = new a();
    d.forEach(function(w) {
      let _ = w.graph().root, m = n(w, _, h, f);
      m.vs.forEach((p, v) => w.node(p).order = v), i(w, h, m.vs);
    });
  }
  function l(d, f) {
    Object.values(f).forEach((h) => h.forEach((w, _) => d.node(w).order = _));
  }
  return Pr;
}
var Rr, Jl;
function Ab() {
  if (Jl) return Rr;
  Jl = 1;
  let e = nt().Graph, t = Fe();
  Rr = {
    positionX: h,
    findType1Conflicts: n,
    findType2Conflicts: o,
    addConflict: a,
    hasConflict: r,
    verticalAlignment: s,
    horizontalCompaction: u,
    alignCoordinates: d,
    findSmallestWidthAlignment: l,
    balance: f
  };
  function n(m, p) {
    let v = {};
    function g(b, O) {
      let F = 0, K = 0, N = b.length, C = O[O.length - 1];
      return O.forEach((M, B) => {
        let S = i(m, M), Q = S ? m.node(S).order : N;
        (S || M === C) && (O.slice(K, B + 1).forEach((y) => {
          m.predecessors(y).forEach((P) => {
            let $ = m.node(P), X = $.order;
            (X < F || Q < X) && !($.dummy && m.node(y).dummy) && a(v, P, y);
          });
        }), K = B + 1, F = Q);
      }), O;
    }
    return p.length && p.reduce(g), v;
  }
  function o(m, p) {
    let v = {};
    function g(O, F, K, N, C) {
      let M;
      t.range(F, K).forEach((B) => {
        M = O[B], m.node(M).dummy && m.predecessors(M).forEach((S) => {
          let Q = m.node(S);
          Q.dummy && (Q.order < N || Q.order > C) && a(v, S, M);
        });
      });
    }
    function b(O, F) {
      let K = -1, N, C = 0;
      return F.forEach((M, B) => {
        if (m.node(M).dummy === "border") {
          let S = m.predecessors(M);
          S.length && (N = m.node(S[0]).order, g(F, C, B, K, N), C = B, K = N);
        }
        g(F, C, F.length, N, O.length);
      }), F;
    }
    return p.length && p.reduce(b), v;
  }
  function i(m, p) {
    if (m.node(p).dummy)
      return m.predecessors(p).find((v) => m.node(v).dummy);
  }
  function a(m, p, v) {
    if (p > v) {
      let b = p;
      p = v, v = b;
    }
    let g = m[p];
    g || (m[p] = g = {}), g[v] = !0;
  }
  function r(m, p, v) {
    if (p > v) {
      let g = p;
      p = v, v = g;
    }
    return !!m[p] && Object.hasOwn(m[p], v);
  }
  function s(m, p, v, g) {
    let b = {}, O = {}, F = {};
    return p.forEach((K) => {
      K.forEach((N, C) => {
        b[N] = N, O[N] = N, F[N] = C;
      });
    }), p.forEach((K) => {
      let N = -1;
      K.forEach((C) => {
        let M = g(C);
        if (M.length) {
          M = M.sort((S, Q) => F[S] - F[Q]);
          let B = (M.length - 1) / 2;
          for (let S = Math.floor(B), Q = Math.ceil(B); S <= Q; ++S) {
            let y = M[S];
            O[C] === C && N < F[y] && !r(v, C, y) && (O[y] = C, O[C] = b[C] = b[y], N = F[y]);
          }
        }
      });
    }), { root: b, align: O };
  }
  function u(m, p, v, g, b) {
    let O = {}, F = c(m, p, v, b), K = b ? "borderLeft" : "borderRight";
    function N(B, S) {
      let Q = F.nodes(), y = Q.pop(), P = {};
      for (; y; )
        P[y] ? B(y) : (P[y] = !0, Q.push(y), Q = Q.concat(S(y))), y = Q.pop();
    }
    function C(B) {
      O[B] = F.inEdges(B).reduce((S, Q) => Math.max(S, O[Q.v] + F.edge(Q)), 0);
    }
    function M(B) {
      let S = F.outEdges(B).reduce((y, P) => Math.min(y, O[P.w] - F.edge(P)), Number.POSITIVE_INFINITY), Q = m.node(B);
      S !== Number.POSITIVE_INFINITY && Q.borderType !== K && (O[B] = Math.max(O[B], S));
    }
    return N(C, F.predecessors.bind(F)), N(M, F.successors.bind(F)), Object.keys(g).forEach((B) => O[B] = O[v[B]]), O;
  }
  function c(m, p, v, g) {
    let b = new e(), O = m.graph(), F = w(O.nodesep, O.edgesep, g);
    return p.forEach((K) => {
      let N;
      K.forEach((C) => {
        let M = v[C];
        if (b.setNode(M), N) {
          var B = v[N], S = b.edge(B, M);
          b.setEdge(B, M, Math.max(F(m, C, N), S || 0));
        }
        N = C;
      });
    }), b;
  }
  function l(m, p) {
    return Object.values(p).reduce((v, g) => {
      let b = Number.NEGATIVE_INFINITY, O = Number.POSITIVE_INFINITY;
      Object.entries(g).forEach(([K, N]) => {
        let C = _(m, K) / 2;
        b = Math.max(N + C, b), O = Math.min(N - C, O);
      });
      const F = b - O;
      return F < v[0] && (v = [F, g]), v;
    }, [Number.POSITIVE_INFINITY, null])[1];
  }
  function d(m, p) {
    let v = Object.values(p), g = t.applyWithChunking(Math.min, v), b = t.applyWithChunking(Math.max, v);
    ["u", "d"].forEach((O) => {
      ["l", "r"].forEach((F) => {
        let K = O + F, N = m[K];
        if (N === p) return;
        let C = Object.values(N), M = g - t.applyWithChunking(Math.min, C);
        F !== "l" && (M = b - t.applyWithChunking(Math.max, C)), M && (m[K] = t.mapValues(N, (B) => B + M));
      });
    });
  }
  function f(m, p) {
    return t.mapValues(m.ul, (v, g) => {
      if (p)
        return m[p.toLowerCase()][g];
      {
        let b = Object.values(m).map((O) => O[g]).sort((O, F) => O - F);
        return (b[1] + b[2]) / 2;
      }
    });
  }
  function h(m) {
    let p = t.buildLayerMatrix(m), v = Object.assign(
      n(m, p),
      o(m, p)
    ), g = {}, b;
    ["u", "d"].forEach((F) => {
      b = F === "u" ? p : Object.values(p).reverse(), ["l", "r"].forEach((K) => {
        K === "r" && (b = b.map((B) => Object.values(B).reverse()));
        let N = (F === "u" ? m.predecessors : m.successors).bind(m), C = s(m, b, v, N), M = u(
          m,
          b,
          C.root,
          C.align,
          K === "r"
        );
        K === "r" && (M = t.mapValues(M, (B) => -B)), g[F + K] = M;
      });
    });
    let O = l(m, g);
    return d(g, O), f(g, m.graph().align);
  }
  function w(m, p, v) {
    return (g, b, O) => {
      let F = g.node(b), K = g.node(O), N = 0, C;
      if (N += F.width / 2, Object.hasOwn(F, "labelpos"))
        switch (F.labelpos.toLowerCase()) {
          case "l":
            C = -F.width / 2;
            break;
          case "r":
            C = F.width / 2;
            break;
        }
      if (C && (N += v ? C : -C), C = 0, N += (F.dummy ? p : m) / 2, N += (K.dummy ? p : m) / 2, N += K.width / 2, Object.hasOwn(K, "labelpos"))
        switch (K.labelpos.toLowerCase()) {
          case "l":
            C = K.width / 2;
            break;
          case "r":
            C = -K.width / 2;
            break;
        }
      return C && (N += v ? C : -C), C = 0, N;
    };
  }
  function _(m, p) {
    return m.node(p).width;
  }
  return Rr;
}
var zr, Ql;
function Ob() {
  if (Ql) return zr;
  Ql = 1;
  let e = Fe(), t = Ab().positionX;
  zr = n;
  function n(i) {
    i = e.asNonCompoundGraph(i), o(i), Object.entries(t(i)).forEach(([a, r]) => i.node(a).x = r);
  }
  function o(i) {
    let a = e.buildLayerMatrix(i), r = i.graph().ranksep, s = 0;
    a.forEach((u) => {
      const c = u.reduce((l, d) => {
        const f = i.node(d).height;
        return l > f ? l : f;
      }, 0);
      u.forEach((l) => i.node(l).y = s + c / 2), s += c + r;
    });
  }
  return zr;
}
var Br, eu;
function Pb() {
  if (eu) return Br;
  eu = 1;
  let e = vb(), t = mb(), n = wb(), o = Fe().normalizeRanks, i = _b(), a = Fe().removeEmptyRanks, r = bb(), s = kb(), u = Eb(), c = Db(), l = Ob(), d = Fe(), f = nt().Graph;
  Br = h;
  function h(H, q) {
    let Y = q && q.debugTiming ? d.time : d.notime;
    Y("layout", () => {
      let j = Y("  buildLayoutGraph", () => N(H));
      Y("  runLayout", () => w(j, Y, q)), Y("  updateInputGraph", () => _(H, j));
    });
  }
  function w(H, q, Y) {
    q("    makeSpaceForEdgeLabels", () => C(H)), q("    removeSelfEdges", () => U(H)), q("    acyclic", () => e.run(H)), q("    nestingGraph.run", () => r.run(H)), q("    rank", () => n(d.asNonCompoundGraph(H))), q("    injectEdgeLabelProxies", () => M(H)), q("    removeEmptyRanks", () => a(H)), q("    nestingGraph.cleanup", () => r.cleanup(H)), q("    normalizeRanks", () => o(H)), q("    assignRankMinMax", () => B(H)), q("    removeEdgeLabelProxies", () => S(H)), q("    normalize.run", () => t.run(H)), q("    parentDummyChains", () => i(H)), q("    addBorderSegments", () => s(H)), q("    order", () => c(H, Y)), q("    insertSelfEdges", () => z(H)), q("    adjustCoordinateSystem", () => u.adjust(H)), q("    position", () => l(H)), q("    positionSelfEdges", () => E(H)), q("    removeBorderNodes", () => X(H)), q("    normalize.undo", () => t.undo(H)), q("    fixupEdgeLabelCoords", () => P(H)), q("    undoCoordinateSystem", () => u.undo(H)), q("    translateGraph", () => Q(H)), q("    assignNodeIntersects", () => y(H)), q("    reversePoints", () => $(H)), q("    acyclic.undo", () => e.undo(H));
  }
  function _(H, q) {
    H.nodes().forEach((Y) => {
      let j = H.node(Y), ee = q.node(Y);
      j && (j.x = ee.x, j.y = ee.y, j.rank = ee.rank, q.children(Y).length && (j.width = ee.width, j.height = ee.height));
    }), H.edges().forEach((Y) => {
      let j = H.edge(Y), ee = q.edge(Y);
      j.points = ee.points, Object.hasOwn(ee, "x") && (j.x = ee.x, j.y = ee.y);
    }), H.graph().width = q.graph().width, H.graph().height = q.graph().height;
  }
  let m = ["nodesep", "edgesep", "ranksep", "marginx", "marginy"], p = { ranksep: 50, edgesep: 20, nodesep: 50, rankdir: "tb" }, v = ["acyclicer", "ranker", "rankdir", "align"], g = ["width", "height", "rank"], b = { width: 0, height: 0 }, O = ["minlen", "weight", "width", "height", "labeloffset"], F = {
    minlen: 1,
    weight: 1,
    width: 0,
    height: 0,
    labeloffset: 10,
    labelpos: "r"
  }, K = ["labelpos"];
  function N(H) {
    let q = new f({ multigraph: !0, compound: !0 }), Y = te(H.graph());
    return q.setGraph(Object.assign(
      {},
      p,
      L(Y, m),
      d.pick(Y, v)
    )), H.nodes().forEach((j) => {
      let ee = te(H.node(j));
      const ae = L(ee, g);
      Object.keys(b).forEach((me) => {
        ae[me] === void 0 && (ae[me] = b[me]);
      }), q.setNode(j, ae), q.setParent(j, H.parent(j));
    }), H.edges().forEach((j) => {
      let ee = te(H.edge(j));
      q.setEdge(j, Object.assign(
        {},
        F,
        L(ee, O),
        d.pick(ee, K)
      ));
    }), q;
  }
  function C(H) {
    let q = H.graph();
    q.ranksep /= 2, H.edges().forEach((Y) => {
      let j = H.edge(Y);
      j.minlen *= 2, j.labelpos.toLowerCase() !== "c" && (q.rankdir === "TB" || q.rankdir === "BT" ? j.width += j.labeloffset : j.height += j.labeloffset);
    });
  }
  function M(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      if (Y.width && Y.height) {
        let j = H.node(q.v), ae = { rank: (H.node(q.w).rank - j.rank) / 2 + j.rank, e: q };
        d.addDummyNode(H, "edge-proxy", ae, "_ep");
      }
    });
  }
  function B(H) {
    let q = 0;
    H.nodes().forEach((Y) => {
      let j = H.node(Y);
      j.borderTop && (j.minRank = H.node(j.borderTop).rank, j.maxRank = H.node(j.borderBottom).rank, q = Math.max(q, j.maxRank));
    }), H.graph().maxRank = q;
  }
  function S(H) {
    H.nodes().forEach((q) => {
      let Y = H.node(q);
      Y.dummy === "edge-proxy" && (H.edge(Y.e).labelRank = Y.rank, H.removeNode(q));
    });
  }
  function Q(H) {
    let q = Number.POSITIVE_INFINITY, Y = 0, j = Number.POSITIVE_INFINITY, ee = 0, ae = H.graph(), me = ae.marginx || 0, ge = ae.marginy || 0;
    function be(ie) {
      let se = ie.x, D = ie.y, T = ie.width, R = ie.height;
      q = Math.min(q, se - T / 2), Y = Math.max(Y, se + T / 2), j = Math.min(j, D - R / 2), ee = Math.max(ee, D + R / 2);
    }
    H.nodes().forEach((ie) => be(H.node(ie))), H.edges().forEach((ie) => {
      let se = H.edge(ie);
      Object.hasOwn(se, "x") && be(se);
    }), q -= me, j -= ge, H.nodes().forEach((ie) => {
      let se = H.node(ie);
      se.x -= q, se.y -= j;
    }), H.edges().forEach((ie) => {
      let se = H.edge(ie);
      se.points.forEach((D) => {
        D.x -= q, D.y -= j;
      }), Object.hasOwn(se, "x") && (se.x -= q), Object.hasOwn(se, "y") && (se.y -= j);
    }), ae.width = Y - q + me, ae.height = ee - j + ge;
  }
  function y(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q), j = H.node(q.v), ee = H.node(q.w), ae, me;
      Y.points ? (ae = Y.points[0], me = Y.points[Y.points.length - 1]) : (Y.points = [], ae = ee, me = j), Y.points.unshift(d.intersectRect(j, ae)), Y.points.push(d.intersectRect(ee, me));
    });
  }
  function P(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      if (Object.hasOwn(Y, "x"))
        switch ((Y.labelpos === "l" || Y.labelpos === "r") && (Y.width -= Y.labeloffset), Y.labelpos) {
          case "l":
            Y.x -= Y.width / 2 + Y.labeloffset;
            break;
          case "r":
            Y.x += Y.width / 2 + Y.labeloffset;
            break;
        }
    });
  }
  function $(H) {
    H.edges().forEach((q) => {
      let Y = H.edge(q);
      Y.reversed && Y.points.reverse();
    });
  }
  function X(H) {
    H.nodes().forEach((q) => {
      if (H.children(q).length) {
        let Y = H.node(q), j = H.node(Y.borderTop), ee = H.node(Y.borderBottom), ae = H.node(Y.borderLeft[Y.borderLeft.length - 1]), me = H.node(Y.borderRight[Y.borderRight.length - 1]);
        Y.width = Math.abs(me.x - ae.x), Y.height = Math.abs(ee.y - j.y), Y.x = ae.x + Y.width / 2, Y.y = j.y + Y.height / 2;
      }
    }), H.nodes().forEach((q) => {
      H.node(q).dummy === "border" && H.removeNode(q);
    });
  }
  function U(H) {
    H.edges().forEach((q) => {
      if (q.v === q.w) {
        var Y = H.node(q.v);
        Y.selfEdges || (Y.selfEdges = []), Y.selfEdges.push({ e: q, label: H.edge(q) }), H.removeEdge(q);
      }
    });
  }
  function z(H) {
    var q = d.buildLayerMatrix(H);
    q.forEach((Y) => {
      var j = 0;
      Y.forEach((ee, ae) => {
        var me = H.node(ee);
        me.order = ae + j, (me.selfEdges || []).forEach((ge) => {
          d.addDummyNode(H, "selfedge", {
            width: ge.label.width,
            height: ge.label.height,
            rank: me.rank,
            order: ae + ++j,
            e: ge.e,
            label: ge.label
          }, "_se");
        }), delete me.selfEdges;
      });
    });
  }
  function E(H) {
    H.nodes().forEach((q) => {
      var Y = H.node(q);
      if (Y.dummy === "selfedge") {
        var j = H.node(Y.e.v), ee = j.x + j.width / 2, ae = j.y, me = Y.x - ee, ge = j.height / 2;
        H.setEdge(Y.e, Y.label), H.removeNode(q), Y.label.points = [
          { x: ee + 2 * me / 3, y: ae - ge },
          { x: ee + 5 * me / 6, y: ae - ge },
          { x: ee + me, y: ae },
          { x: ee + 5 * me / 6, y: ae + ge },
          { x: ee + 2 * me / 3, y: ae + ge }
        ], Y.label.x = Y.x, Y.label.y = Y.y;
      }
    });
  }
  function L(H, q) {
    return d.mapValues(d.pick(H, q), Number);
  }
  function te(H) {
    var q = {};
    return H && Object.entries(H).forEach(([Y, j]) => {
      typeof Y == "string" && (Y = Y.toLowerCase()), q[Y] = j;
    }), q;
  }
  return Br;
}
var Lr, tu;
function Rb() {
  if (tu) return Lr;
  tu = 1;
  let e = Fe(), t = nt().Graph;
  Lr = {
    debugOrdering: n
  };
  function n(o) {
    let i = e.buildLayerMatrix(o), a = new t({ compound: !0, multigraph: !0 }).setGraph({});
    return o.nodes().forEach((r) => {
      a.setNode(r, { label: r }), a.setParent(r, "layer" + o.node(r).rank);
    }), o.edges().forEach((r) => a.setEdge(r.v, r.w, {}, r.name)), i.forEach((r, s) => {
      let u = "layer" + s;
      a.setNode(u, { rank: "same" }), r.reduce((c, l) => (a.setEdge(c, l, { style: "invis" }), l));
    }), a;
  }
  return Lr;
}
var Vr, nu;
function zb() {
  return nu || (nu = 1, Vr = "1.1.8"), Vr;
}
var Hr, ou;
function Bb() {
  return ou || (ou = 1, Hr = {
    graphlib: nt(),
    layout: Pb(),
    debug: Rb(),
    util: {
      time: Fe().time,
      notime: Fe().notime
    },
    version: zb()
  }), Hr;
}
var Lb = Bb();
const iu = /* @__PURE__ */ tb(Lb), Vb = "var(--p-primary-color)", Hb = "var(--p-text-muted-color)", Fa = 210, Fb = 104, Ln = 30, id = 42, ga = 20, rd = 20, va = 108, ad = [
  { id: "top", type: "target", side: "top" },
  { id: "bottom", type: "source", side: "bottom" },
  { id: "left", type: "target", side: "left" },
  { id: "right", type: "source", side: "right" }
], Vo = ["default", "smoothstep", "step", "straight"], sd = "portal:";
function Gb(e) {
  return e.startsWith(sd);
}
function Ga(e) {
  const t = [], n = /* @__PURE__ */ new Map(), o = /* @__PURE__ */ new Map();
  function i(a, r = "") {
    for (const s of a || []) {
      const u = { ...s, parent_id: s.parent_id || r || void 0 };
      t.push(u), n.set(u.id, u);
      const c = u.parent_id || "";
      o.has(c) || o.set(c, []), o.get(c).push(u), s.children?.length && i(s.children, s.id);
    }
  }
  return i(e || []), { nodes: t, nodeById: n, childrenByParent: o };
}
function Vn(e) {
  return new Map((e || []).map((t) => [t.id, t]));
}
function Yb(e, t, n = Vb) {
  const o = e.get(t);
  return String(o?.color || o?.stroke || n);
}
function Ub(e, t) {
  return String(e.get(t)?.title || t || "Node");
}
function Ya(e, t) {
  return String(e.properties?.accent || e.properties?.color || Yb(t, e.type));
}
function qb(e) {
  return `color-mix(in srgb, ${e} 8%, var(--kg-panel))`;
}
function Xb(e) {
  return `color-mix(in srgb, ${e} 38%, var(--kg-line))`;
}
function ld(e) {
  if (Array.isArray(e)) return e;
  if (typeof e == "string" && e)
    try {
      const t = JSON.parse(e);
      if (Array.isArray(t)) return t;
    } catch (t) {
      throw new Error("Node ports are unavailable.", { cause: t });
    }
  return ad;
}
function ud(e, t) {
  const n = t.get(e.kind);
  return String(n?.display || "panel");
}
function Wb(e, t) {
  const n = [];
  for (const o of e || []) {
    const i = ud(o, t);
    if (i !== "badge" && i !== "both") continue;
    const a = t.get(o.kind);
    n.push({ kind: o.kind, text: o.title || a?.title || o.kind, color: String(a?.color || "var(--p-text-muted-color)") });
  }
  return n;
}
function Kb(e, t) {
  let n = 0;
  for (const o of e || []) {
    const i = ud(o, t);
    (i === "panel" || i === "both") && (n += 1);
  }
  return n;
}
function Zb(e, t, n) {
  const o = e.layout?.positions?.[t.id] || t.layout;
  return o && typeof o.x == "number" && typeof o.y == "number" ? o : { x: 40 + n % 4 * 280, y: 40 + Math.floor(n / 4) * 180 };
}
function ai(e) {
  return Number(e.properties?.width || e.layout?.width || Fa);
}
function cd(e, t, n, o) {
  const i = Ya(e, n), a = e.materials || [];
  return {
    label: e.name,
    description: e.description || "",
    nodeType: e.type,
    typeLabel: Ub(n, e.type),
    color: i,
    bg: qb(i),
    border: Xb(i),
    tags: e.tags || [],
    status: e.status || "",
    hasChildren: t.length > 0,
    childCount: t.length,
    materialCount: Kb(a, o),
    badges: Wb(a, o),
    width: ai(e),
    radius: Number(e.properties?.radius ?? 6),
    borderStyle: String(e.properties?.style || "solid"),
    animation: String(e.properties?.animation || ""),
    handles: ld(e.properties?.handles)
  };
}
function jb(e, t, n, o, i, a) {
  const r = e.layout?.positions || {}, s = Ya(t, i), u = Math.max(1, Math.min(n.length, 3)), c = [];
  let l = 0;
  for (const m of n)
    if (r[m.id]) c.push(r[m.id]);
    else {
      const p = l % u, v = Math.floor(l / u);
      c.push({ x: Ln + p * (Fa + ga), y: id + v * (va + rd) }), l++;
    }
  let d = 0, f = 0;
  n.forEach((m, p) => {
    d = Math.max(d, c[p].x + ai(m)), f = Math.max(f, c[p].y + va);
  });
  const h = Math.max(300, d + Ln), w = Math.max(200, f + Ln), _ = [{
    id: t.id,
    type: "boundary",
    position: { x: o.x, y: o.y },
    data: { label: t.name, color: s, width: h, height: w },
    style: { width: `${h}px`, height: `${w}px` }
  }];
  return n.forEach((m, p) => {
    _.push({
      id: m.id,
      type: "graphNode",
      parentNode: t.id,
      extent: "parent",
      expandParent: !0,
      position: { x: c[p].x, y: c[p].y },
      data: cd(m, [], i, a)
    });
  }), _;
}
function ru(e, t) {
  const n = t.get(e.type), o = e.properties || {}, i = String(o.stroke || n?.stroke || n?.color || Hb), a = Number(o.strokeWidth || o.stroke_width || n?.stroke_width || n?.strokeWidth || 1.6), r = String(o.routing || n?.render?.routing || "default"), s = o.animated === !0 || o.animated === "true" || n?.animated === !0, u = String(o.dash || n?.dash || n?.dash_array || ""), c = String(o.direction || n?.direction || "directed"), l = o.bidirectional === !0 || c === "bidirectional", d = {
    id: e.id,
    source: e.source_id,
    target: e.target_id,
    type: r,
    label: e.label || "",
    animated: s,
    style: { stroke: i, strokeWidth: a, strokeDasharray: u },
    labelStyle: { fill: "var(--kg-muted)", fontSize: "10px" },
    labelBgStyle: { fill: "var(--kg-bg)", fillOpacity: 0.9 },
    markerEnd: { type: qn.ArrowClosed, color: i, width: 16, height: 12 }
  };
  return l && (d.markerStart = { type: qn.ArrowClosed, color: i, width: 16, height: 12 }), o.sourceHandle && (d.sourceHandle = String(o.sourceHandle)), o.targetHandle && (d.targetHandle = String(o.targetHandle)), d;
}
function Jb(e, t, n) {
  const o = Ga(e.nodes || []), i = Vn(e.schema?.node_types || []), a = Vn(e.schema?.edge_types || []), r = Vn(e.schema?.material_types || []), s = [], u = [];
  (o.childrenByParent.get(n || "") || []).forEach((p, v) => {
    const g = o.childrenByParent.get(p.id) || [], b = Zb(e, p, v);
    g.length && t.has(p.id) ? s.push(...jb(e, p, g, b, i, r)) : s.push({ id: p.id, type: "graphNode", position: { x: b.x, y: b.y }, data: cd(p, g, i, r) });
  });
  const l = new Set(s.map((p) => p.id));
  function d(p) {
    let v = p;
    for (; v; ) {
      if (l.has(v)) return v;
      v = o.nodeById.get(v)?.parent_id;
    }
  }
  function f(p) {
    return o.nodeById.get(p)?.name || p;
  }
  function h(p) {
    let v = p, g = o.nodeById.get(p);
    for (; v; ) {
      const b = o.nodeById.get(v)?.parent_id;
      if (!b) break;
      v = b, g = o.nodeById.get(v);
    }
    return g?.name || "";
  }
  const w = /* @__PURE__ */ new Map();
  function _(p) {
    const v = `${sd}${p}`;
    if (!w.has(v)) {
      const b = o.nodeById.get(p) || { type: "", name: p };
      w.set(v, {
        id: v,
        type: "portalNode",
        position: { x: 0, y: 0 },
        draggable: !1,
        selectable: !1,
        connectable: !1,
        data: {
          label: b.name,
          color: Ya(b, i),
          portal: !0,
          portalTarget: p,
          contextLabel: h(p),
          handles: ad
        }
      });
    }
    return v;
  }
  const m = /* @__PURE__ */ new Map();
  for (const p of e.edges || []) {
    let v = d(p.source_id), g = d(p.target_id), b = !1;
    if (v && !g ? (g = _(p.target_id), b = !0) : !v && g && (v = _(p.source_id), b = !0), !v || !g || v === g) continue;
    if (!b && v === p.source_id && g === p.target_id) {
      u.push(ru(p, a));
      continue;
    }
    const F = `${p.type}|${v}|${g}`;
    let K = m.get(F);
    K || (K = { s: v, t: g, sample: p, portal: b, members: [] }, m.set(F, K)), K.members.push({ id: p.id, type: p.type, label: p.label || "", source: f(p.source_id), target: f(p.target_id), sourceId: p.source_id, targetId: p.target_id });
  }
  for (const p of m.values()) {
    const v = {
      ...p.sample,
      id: `agg:${p.sample.type}:${p.s}:${p.t}`,
      source_id: p.s,
      target_id: p.t,
      properties: { ...p.sample.properties || {}, sourceHandle: void 0, targetHandle: void 0 }
    }, g = ru(v, a);
    g.data = { ...g.data || {}, aggregated: !0, portal: p.portal, count: p.members.length, members: p.members }, p.members.length > 1 && (g.label = p.sample.label ? `${p.sample.label} ×${p.members.length}` : `×${p.members.length}`), u.push(g);
  }
  if (w.size) {
    let p = 0, v = Number.POSITIVE_INFINITY;
    for (const O of s)
      p = Math.max(p, O.position.x + Number(O.data?.width || Fa)), v = Math.min(v, O.position.y);
    Number.isFinite(v) || (v = 40);
    const g = 52;
    let b = 0;
    for (const O of w.values())
      O.position = { x: p + 120, y: v + b * g }, b += 1, s.push(O);
  }
  return { flowNodes: s, flowEdges: u, flat: o };
}
function Qb(e, t, n) {
  const o = Ga(e.nodes || []), i = o.childrenByParent.get(n || "") || [];
  if (!i.length) return {};
  const a = new Set(i.map((l) => l.id)), r = new iu.graphlib.Graph();
  r.setGraph({ rankdir: t, nodesep: 46, ranksep: 70, marginx: 30, marginy: 30 }), r.setDefaultEdgeLabel(() => ({}));
  for (const l of i) {
    const d = o.childrenByParent.get(l.id) || [];
    let f = ai(l), h = Fb;
    if (d.length) {
      const w = Math.max(1, Math.min(d.length, 3)), _ = Math.ceil(d.length / 3), m = Math.max(...d.map((p) => ai(p)));
      f = Math.max(300, w * (m + ga) - ga + Ln * 2), h = _ * va + (_ - 1) * rd + id + Ln;
    }
    r.setNode(l.id, { width: f, height: h });
  }
  function s(l) {
    let d = l;
    for (; d; ) {
      if (a.has(d)) return d;
      d = o.nodeById.get(d)?.parent_id;
    }
  }
  const u = /* @__PURE__ */ new Set();
  for (const l of e.edges || []) {
    const d = s(l.source_id), f = s(l.target_id);
    if (!d || !f || d === f) continue;
    const h = `${d}->${f}`;
    u.has(h) || (u.add(h), r.setEdge(d, f));
  }
  iu.layout(r);
  const c = {};
  for (const l of i) {
    const d = r.node(l.id);
    d && (c[l.id] = { x: Math.round(d.x - d.width / 2), y: Math.round(d.y - d.height / 2) });
  }
  return c;
}
const ma = "/api/v1/workspace/entries";
function ek(e) {
  return e ? `${ma}?parent_id=${encodeURIComponent(e)}` : ma;
}
function tk(e) {
  return `${ma}/${encodeURIComponent(e)}`;
}
function au(e) {
  return e.container === !0 || Number(e.children_count || 0) > 0;
}
const nk = { class: "kg-component-picker" }, ok = { class: "kg-component-path" }, ik = ["onClick"], rk = {
  key: 0,
  role: "status"
}, ak = {
  key: 1,
  role: "alert"
}, sk = ["aria-label"], lk = /* @__PURE__ */ xe({
  __name: "ComponentPicker",
  props: {
    modelValue: {}
  },
  emits: ["update:modelValue"],
  setup(e, { emit: t }) {
    const n = e, o = t, i = fe(null), a = fe([]), r = fe(null), s = fe(!1), u = fe(""), c = ne(() => ek(a.value.at(-1)?.id || null));
    let l = null, d = 0, f = 0;
    async function h(v) {
      const g = ++f;
      if (r.value = null, !!v)
        try {
          const { data: b } = await To.get(tk(v));
          if (!b.success || !b.entry) throw new Error(b.error || "Could not load the selected component.");
          g === f && (r.value = b.entry);
        } catch (b) {
          g === f && (u.value = b instanceof Error ? b.message : "Could not load the selected component.");
        }
    }
    function w(v) {
      const g = v.detail;
      if (typeof g?.thread_id != "string") {
        u.value = "Component picker returns an invalid selection.";
        return;
      }
      o("update:modelValue", g.thread_id), h(g.thread_id);
    }
    function _(v) {
      u.value = v.detail?.message || "Component picker is unavailable.";
    }
    async function m() {
      const v = ++d;
      s.value = !0, u.value = "";
      try {
        if (await uf("wc-component-picker", { timeoutMs: 8e3 }), v !== d || !i.value) return;
        l?.removeEventListener("change", w), l?.removeEventListener("error", _), l = document.createElement("wc-component-picker"), l.setAttribute("source", c.value), l.setAttribute("placeholder", "Select a component…"), l.setAttribute("value", JSON.stringify({ thread_id: n.modelValue || "" })), l.addEventListener("change", w), l.addEventListener("error", _), i.value.replaceChildren(l);
      } catch (g) {
        v === d && (u.value = g instanceof Error ? g.message : "Component picker is unavailable.");
      } finally {
        v === d && (s.value = !1);
      }
    }
    function p() {
      r.value && au(r.value) && (a.value = [...a.value, r.value]);
    }
    return Ee(c, (v) => l?.setAttribute("source", v)), Ee(() => n.modelValue || "", (v) => {
      l?.setAttribute("value", JSON.stringify({ thread_id: v })), h(v);
    }), ot(() => {
      m(), h(n.modelValue || "");
    }), to(() => {
      d += 1, f += 1, l?.removeEventListener("change", w), l?.removeEventListener("error", _), l = null;
    }), (v, g) => (A(), G("div", nk, [
      I("div", ok, [
        I("button", {
          class: Me(["kg-mini kg-mini--wide", { active: !a.value.length }]),
          onClick: g[0] || (g[0] = (b) => a.value = [])
        }, "Root", 2),
        (A(!0), G(ye, null, Se(a.value, (b, O) => (A(), G("button", {
          key: b.id,
          class: "kg-mini kg-mini--wide",
          onClick: (F) => a.value = a.value.slice(0, O + 1)
        }, he(b.name || "Untitled folder"), 9, ik))), 128))
      ]),
      I("div", {
        ref_key: "host",
        ref: i
      }, null, 512),
      s.value ? (A(), G("span", rk, "Loading component picker…")) : de("", !0),
      u.value ? (A(), G("div", ak, [
        Pt(he(u.value) + " ", 1),
        I("button", {
          class: "kg-mini kg-mini--wide",
          onClick: m
        }, "Retry")
      ])) : de("", !0),
      r.value && oe(au)(r.value) ? (A(), G("button", {
        key: 2,
        class: "kg-mini kg-mini--wide",
        "aria-label": `Browse ${r.value.name || "folder"}`,
        onClick: p
      }, "Browse " + he(r.value.name || "folder"), 9, sk)) : de("", !0)
    ]));
  }
}), uk = { class: "kg-source" }, ck = ["value"], dk = ["value"], fk = {
  key: 1,
  class: "kg-url"
}, hk = ["value"], pk = ["href"], gk = ["value"], vk = /* @__PURE__ */ xe({
  __name: "MaterialSourceEditor",
  props: {
    material: {}
  },
  emits: ["update"],
  setup(e, { emit: t }) {
    const n = e, o = t, i = ne(() => String(n.material.source?.type || "inline"));
    function a(s) {
      o("update", { source: { ...n.material.source || {}, type: s } });
    }
    function r(s, u) {
      o("update", { source: { ...n.material.source || {}, [s]: u } });
    }
    return (s, u) => (A(), G("div", uk, [
      I("select", {
        class: "kg-input kg-small",
        value: i.value,
        onChange: u[0] || (u[0] = (c) => a(c.target.value))
      }, [...u[5] || (u[5] = [
        I("option", { value: "inline" }, "inline", -1),
        I("option", { value: "url" }, "url", -1),
        I("option", { value: "upload" }, "upload", -1),
        I("option", { value: "component" }, "component", -1)
      ])], 40, ck),
      i.value === "inline" ? (A(), G("textarea", {
        key: 0,
        class: "kg-textarea kg-small",
        rows: "2",
        value: String(e.material.source?.text || ""),
        placeholder: "inline text",
        onChange: u[1] || (u[1] = (c) => r("text", c.target.value))
      }, null, 40, dk)) : i.value === "url" ? (A(), G("div", fk, [
        I("input", {
          class: "kg-input kg-small",
          value: String(e.material.source?.url || ""),
          placeholder: "https://...",
          onChange: u[2] || (u[2] = (c) => r("url", c.target.value))
        }, null, 40, hk),
        e.material.source?.url ? (A(), G("a", {
          key: 0,
          class: "kg-url-go",
          href: String(e.material.source?.url),
          target: "_blank",
          rel: "noopener",
          title: "Open"
        }, "↗", 8, pk)) : de("", !0)
      ])) : i.value === "upload" ? (A(), G("input", {
        key: 2,
        class: "kg-input kg-small",
        value: String(e.material.source?.upload_id || ""),
        placeholder: "upload id",
        onChange: u[3] || (u[3] = (c) => r("upload_id", c.target.value))
      }, null, 40, gk)) : i.value === "component" ? (A(), Ie(lk, {
        key: 3,
        "model-value": String(e.material.source?.component_id || ""),
        "onUpdate:modelValue": u[4] || (u[4] = (c) => r("component_id", c))
      }, null, 8, ["model-value"])) : de("", !0)
    ]));
  }
}), mk = { class: "kg-mat-kind" }, yk = { class: "kg-mat-title" }, wk = ["aria-label"], _k = ["value"], bk = ["value"], kk = ["value", "placeholder", "onChange"], Ek = ["value", "onChange"], $k = { value: "" }, xk = ["value"], Sk = ["type", "value", "placeholder", "onChange"], Ua = /* @__PURE__ */ xe({
  __name: "MaterialCard",
  props: {
    material: {},
    materialTypes: {},
    expanded: { type: Boolean }
  },
  emits: ["toggle", "update", "remove"],
  setup(e, { emit: t }) {
    const n = e, o = t, i = ne(() => n.materialTypes.find((c) => c.id === n.material.kind)), a = ne(() => String(i.value?.title || n.material.kind)), r = ne(() => {
      const c = i.value?.fields;
      return Array.isArray(c) ? c : c && typeof c == "object" ? Object.entries(c).map(([l, d]) => ({ key: l, ...d || {} })) : [];
    }), s = ne(() => {
      if (n.material.title) return n.material.title;
      const c = n.material.source;
      if (c?.type === "component") return "component reference";
      if (c?.type === "url" && c.url)
        try {
          return new URL(String(c.url)).host;
        } catch {
          return String(c.url);
        }
      if (c?.type === "upload") return "upload";
      const l = String(c?.text || n.material.summary || "");
      return l ? l.slice(0, 60) : "empty";
    });
    function u(c, l) {
      o("update", { meta: { ...n.material.meta || {}, [c]: l } });
    }
    return (c, l) => (A(), G("div", {
      class: Me(["kg-material", { "kg-material--open": e.expanded }])
    }, [
      I("div", {
        class: "kg-material-head",
        role: "button",
        tabindex: "0",
        onClick: l[1] || (l[1] = (d) => o("toggle")),
        onKeydown: [
          l[2] || (l[2] = Ze((d) => o("toggle"), ["enter"])),
          l[3] || (l[3] = Ze(Ue((d) => o("toggle"), ["prevent"]), ["space"]))
        ]
      }, [
        I("span", mk, he(a.value), 1),
        I("span", yk, he(s.value), 1),
        I("span", {
          class: Me(["kg-mat-chevron", { open: e.expanded }])
        }, "›", 2),
        I("button", {
          class: "kg-mini kg-danger",
          "aria-label": `Remove ${a.value} material`,
          onClick: l[0] || (l[0] = Ue((d) => o("remove"), ["stop"]))
        }, "×", 8, wk)
      ], 32),
      e.expanded ? (A(), G(ye, { key: 0 }, [
        I("input", {
          class: "kg-input kg-small",
          value: e.material.title || "",
          placeholder: "title",
          onChange: l[4] || (l[4] = (d) => o("update", { title: d.target.value }))
        }, null, 40, _k),
        I("textarea", {
          class: "kg-textarea kg-small",
          rows: "2",
          value: e.material.summary || "",
          placeholder: "summary",
          onChange: l[5] || (l[5] = (d) => o("update", { summary: d.target.value }))
        }, null, 40, bk),
        (A(!0), G(ye, null, Se(r.value, (d) => (A(), G(ye, {
          key: d.key
        }, [
          d.type === "textarea" || d.key === "body" ? (A(), G("textarea", {
            key: 0,
            class: "kg-textarea kg-small",
            rows: "2",
            value: String(e.material.meta?.[d.key] ?? ""),
            placeholder: d.label || d.key,
            onChange: (f) => u(d.key, f.target.value)
          }, null, 40, kk)) : d.type === "select" ? (A(), G("select", {
            key: 1,
            class: "kg-input kg-small",
            value: String(e.material.meta?.[d.key] ?? ""),
            onChange: (f) => u(d.key, f.target.value)
          }, [
            I("option", $k, he(d.label || d.key), 1),
            (A(!0), G(ye, null, Se(d.options || [], (f) => (A(), G("option", {
              key: f,
              value: f
            }, he(f), 9, xk))), 128))
          ], 40, Ek)) : (A(), G("input", {
            key: 2,
            class: "kg-input kg-small",
            type: d.type === "number" ? "number" : "text",
            value: String(e.material.meta?.[d.key] ?? ""),
            placeholder: d.label || d.key,
            onChange: (f) => u(d.key, f.target.value)
          }, null, 40, Sk))
        ], 64))), 128)),
        ze(vk, {
          material: e.material,
          onUpdate: l[6] || (l[6] = (d) => o("update", d))
        }, null, 8, ["material"])
      ], 64)) : de("", !0)
    ], 2));
  }
}), Nk = { class: "kg-panel-inner" }, Ck = {
  key: 0,
  class: "kg-hdr"
}, Mk = { class: "kg-hdr-top" }, Tk = { class: "kg-editable-title" }, Ik = ["innerHTML"], Dk = { class: "kg-hdr-top" }, Ak = ["value"], Ok = ["value"], Pk = {
  key: 0,
  value: "note"
}, Rk = {
  key: 0,
  class: "kg-editrow"
}, zk = {
  key: 2,
  class: "kg-editrow"
}, Bk = ["innerHTML"], Lk = {
  key: 0,
  class: "kg-row"
}, Vk = { class: "kg-disclosure-meta" }, Hk = {
  key: 1,
  class: "kg-disclosure-body"
}, Fk = { class: "kg-colorrow" }, Gk = ["aria-label", "onClick"], Yk = { class: "kg-inline-field" }, Uk = { class: "kg-inline-field kg-wrap" }, qk = ["onClick"], Xk = { class: "kg-slider-row" }, Wk = ["value"], Kk = { class: "kg-slider-val" }, Zk = ["value"], jk = { class: "kg-slider-val" }, Jk = { class: "kg-inline-field" }, Qk = { class: "kg-ports" }, eE = ["aria-label", "onClick"], tE = { class: "kg-port-n" }, nE = ["aria-label", "onClick"], oE = { class: "kg-port-lbl" }, iE = { class: "kg-tags-edit" }, rE = ["aria-label", "onClick"], aE = { class: "kg-section-head" }, sE = { class: "kg-add-wrap" }, lE = ["title"], uE = {
  key: 0,
  class: "kg-add-menu"
}, cE = ["onClick"], dE = {
  key: 0,
  class: "kg-add-empty"
}, fE = { class: "kg-materials" }, hE = {
  key: 0,
  class: "kg-empty-line"
}, pE = /* @__PURE__ */ xe({
  __name: "NodePanel",
  props: {
    readOnly: { type: Boolean },
    node: {},
    nodeTypes: {},
    materialTypes: {},
    materials: {},
    hasChildren: { type: Boolean },
    expanded: { type: Boolean }
  },
  emits: ["update", "delete", "material-add", "component-ref-add", "material-update", "material-remove", "drill", "toggle-expand", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = e, o = t, i = fe(null), a = fe(""), r = fe(""), s = fe(!1), u = fe(!1), c = fe(/* @__PURE__ */ new Set());
    Ee(() => n.materials.length, (z, E) => {
      if (z > (E ?? 0)) {
        const L = n.materials[n.materials.length - 1];
        L && (c.value = /* @__PURE__ */ new Set([...c.value, L.id]));
      }
    }), Ee(() => n.node.id, () => {
      c.value = /* @__PURE__ */ new Set(), u.value = !1, i.value = null;
    });
    const l = ne(() => n.node.properties || {}), d = ne(() => String(l.value.accent || l.value.color || v(n.node.type))), f = ne(() => String(l.value.style || "solid")), h = ne(() => String(l.value.animation || "")), w = ne(() => Number(l.value.width || 210)), _ = ne(() => Number(l.value.radius ?? 6)), m = ne(() => [...n.nodeTypes].sort((z, E) => (z.title || z.id).localeCompare(E.title || E.id))), p = ne(() => n.materialTypes.filter((z) => !z.targets || z.targets.includes("node")));
    function v(z) {
      return String(n.nodeTypes.find((E) => E.id === z)?.color || "var(--p-primary-color)");
    }
    function g(z, E) {
      i.value = z, a.value = E;
    }
    function b(z) {
      i.value = null;
      const E = z === "name" ? n.node.name : n.node.description || "";
      a.value !== E && o("update", { [z]: a.value });
    }
    function O(z) {
      z !== n.node.type && o("update", { type: z });
    }
    function F(z, E) {
      o("update", { properties: { ...l.value, [z]: E } });
    }
    function K() {
      const z = r.value.trim();
      if (!z) return;
      const E = n.node.tags || [];
      E.includes(z) || o("update", { tags: [...E, z] }), r.value = "";
    }
    function N(z) {
      o("update", { tags: (n.node.tags || []).filter((E) => E !== z) });
    }
    function C() {
      return ld(l.value.handles);
    }
    function M(z) {
      return C().filter((E) => E.side === z).length;
    }
    function B(z) {
      const E = l.value[`_port_${z}`];
      return typeof E == "number" ? E : M(z);
    }
    function S(z) {
      const E = [...C()], L = B(z), te = z === "top" || z === "left" ? "target" : "source";
      E.push({ id: `${z}-${L}`, type: te, side: z }), o("update", { properties: { ...l.value, handles: JSON.stringify(E), [`_port_${z}`]: L + 1 } });
    }
    function Q(z) {
      const E = [...C()], L = E.filter((q) => q.side === z);
      if (!L.length) return;
      const te = L[L.length - 1], H = E.findIndex((q) => q.id === te.id);
      H >= 0 && E.splice(H, 1), o("update", { properties: { ...l.value, handles: JSON.stringify(E), [`_port_${z}`]: B(z) } });
    }
    function y(z) {
      s.value = !1, o("material-add", z);
    }
    function P() {
      return p.value.find((z) => z.id === "reference")?.id || p.value.find((z) => z.id === "component")?.id || p.value[0]?.id || "reference";
    }
    function $(z) {
      const E = new Set(c.value);
      E.has(z) ? E.delete(z) : E.add(z), c.value = E;
    }
    const X = ["", "pulse", "glow", "blink", "breathe", "shake"], U = [
      { k: "top", l: "T" },
      { k: "left", l: "L" },
      { k: "right", l: "R" },
      { k: "bottom", l: "B" }
    ];
    return (z, E) => (A(), G("div", Nk, [
      e.readOnly ? (A(), G("div", Ck, [
        I("div", Mk, [
          E[26] || (E[26] = I("span", { class: "kg-kicker" }, "Node", -1)),
          I("button", {
            class: "kg-x",
            "aria-label": "Close node inspector",
            onClick: E[0] || (E[0] = (L) => o("close"))
          }, "×")
        ]),
        I("h3", Tk, he(e.node.name), 1),
        I("div", {
          class: "kg-desc-preview",
          innerHTML: oe(pa)(e.node.description || e.node.name)
        }, null, 8, Ik),
        E[27] || (E[27] = I("p", { class: "kg-muted" }, "Read only", -1))
      ])) : (A(), G(ye, { key: 1 }, [
        I("div", {
          class: "kg-hdr",
          style: Oe({ borderLeftColor: d.value })
        }, [
          I("div", Dk, [
            I("span", {
              class: "kg-hdr-dot",
              style: Oe({ background: d.value })
            }, null, 4),
            I("select", {
              class: "kg-type-sel",
              value: e.node.type,
              onChange: E[1] || (E[1] = (L) => O(L.target.value))
            }, [
              (A(!0), G(ye, null, Se(m.value, (L) => (A(), G("option", {
                key: L.id,
                value: L.id
              }, he(L.title || L.id), 9, Ok))), 128)),
              m.value.length ? de("", !0) : (A(), G("option", Pk, "note"))
            ], 40, Ak),
            I("button", {
              class: "kg-x kg-x--chev",
              title: "Hide inspector",
              "aria-label": "Hide inspector",
              onClick: E[2] || (E[2] = (L) => o("collapse"))
            }, "»"),
            I("button", {
              class: "kg-x",
              title: "Close",
              "aria-label": "Close node inspector",
              onClick: E[3] || (E[3] = (L) => o("close"))
            }, "×")
          ]),
          i.value === "name" ? (A(), G("div", Rk, [
            sn(I("input", {
              class: "kg-input kg-title-input",
              "onUpdate:modelValue": E[4] || (E[4] = (L) => a.value = L),
              onKeyup: E[5] || (E[5] = Ze((L) => b("name"), ["enter"])),
              onBlur: E[6] || (E[6] = (L) => b("name")),
              autofocus: ""
            }, null, 544), [
              [ln, a.value]
            ])
          ])) : (A(), G("div", {
            key: 1,
            class: "kg-editable-title",
            role: "button",
            tabindex: "0",
            onClick: E[7] || (E[7] = (L) => g("name", e.node.name)),
            onKeydown: [
              E[8] || (E[8] = Ze((L) => g("name", e.node.name), ["enter"])),
              E[9] || (E[9] = Ze(Ue((L) => g("name", e.node.name), ["prevent"]), ["space"]))
            ]
          }, he(e.node.name), 33)),
          i.value === "description" ? (A(), G("div", zk, [
            sn(I("textarea", {
              class: "kg-textarea",
              rows: "4",
              "onUpdate:modelValue": E[10] || (E[10] = (L) => a.value = L),
              onBlur: E[11] || (E[11] = (L) => b("description")),
              autofocus: ""
            }, null, 544), [
              [ln, a.value]
            ])
          ])) : (A(), G("div", {
            key: 3,
            class: "kg-desc-preview",
            role: "button",
            tabindex: "0",
            onClick: E[12] || (E[12] = (L) => g("description", e.node.description || "")),
            onKeydown: [
              E[13] || (E[13] = Ze((L) => g("description", e.node.description || ""), ["enter"])),
              E[14] || (E[14] = Ze(Ue((L) => g("description", e.node.description || ""), ["prevent"]), ["space"]))
            ],
            innerHTML: e.node.description ? oe(pa)(e.node.description) : "<em>add description…</em>"
          }, null, 40, Bk))
        ], 4),
        e.hasChildren ? (A(), G("div", Lk, [
          I("button", {
            class: "kg-btn kg-btn--ghost",
            onClick: E[15] || (E[15] = (L) => o("toggle-expand"))
          }, he(e.expanded ? "Collapse" : "Expand"), 1),
          I("button", {
            class: "kg-btn kg-btn--ghost",
            onClick: E[16] || (E[16] = (L) => o("drill"))
          }, "Open ›")
        ])) : de("", !0),
        I("button", {
          class: Me(["kg-disclosure", { open: u.value }]),
          onClick: E[17] || (E[17] = (L) => u.value = !u.value)
        }, [
          E[28] || (E[28] = I("span", null, "Style", -1)),
          I("span", Vk, [
            I("span", {
              class: "kg-swatch kg-swatch--peek",
              style: Oe({ background: d.value })
            }, null, 4)
          ]),
          E[29] || (E[29] = I("span", { class: "kg-disclosure-chevron" }, "›", -1))
        ], 2),
        u.value ? (A(), G("div", Hk, [
          I("div", Fk, [
            (A(!0), G(ye, null, Se(oe(ii), (L) => (A(), G("button", {
              key: L.value,
              class: Me(["kg-swatch", { active: d.value === L.value }]),
              style: Oe({ background: L.value }),
              "aria-label": `Use node color ${L.label}`,
              onClick: (te) => F("accent", L.value)
            }, null, 14, Gk))), 128))
          ]),
          I("div", Yk, [
            E[30] || (E[30] = I("span", { class: "kg-mini-label" }, "Border", -1)),
            I("button", {
              class: Me(["kg-chip", { active: f.value === "solid" }]),
              onClick: E[18] || (E[18] = (L) => F("style", "solid"))
            }, "solid", 2),
            I("button", {
              class: Me(["kg-chip", { active: f.value === "dashed" }]),
              onClick: E[19] || (E[19] = (L) => F("style", "dashed"))
            }, "dashed", 2)
          ]),
          I("div", Uk, [
            E[31] || (E[31] = I("span", { class: "kg-mini-label" }, "Animate", -1)),
            (A(), G(ye, null, Se(X, (L) => I("button", {
              key: L,
              class: Me(["kg-chip", { active: h.value === L }]),
              onClick: (te) => F("animation", L)
            }, he(L || "none"), 11, qk)), 64))
          ]),
          I("div", Xk, [
            E[32] || (E[32] = I("span", { class: "kg-mini-label" }, "W", -1)),
            I("input", {
              type: "range",
              min: "150",
              max: "640",
              step: "10",
              value: w.value,
              onInput: E[20] || (E[20] = (L) => F("width", Number(L.target.value)))
            }, null, 40, Wk),
            I("span", Kk, he(w.value), 1),
            E[33] || (E[33] = I("span", { class: "kg-mini-label" }, "R", -1)),
            I("input", {
              type: "range",
              min: "0",
              max: "30",
              step: "2",
              value: _.value,
              onInput: E[21] || (E[21] = (L) => F("radius", Number(L.target.value)))
            }, null, 40, Zk),
            I("span", jk, he(_.value), 1)
          ])
        ])) : de("", !0),
        I("div", Jk, [
          E[34] || (E[34] = I("span", { class: "kg-mini-label" }, "Ports", -1)),
          I("div", Qk, [
            (A(), G(ye, null, Se(U, (L) => I("div", {
              key: L.k,
              class: "kg-port-cell"
            }, [
              I("button", {
                class: "kg-mini",
                "aria-label": `Remove ${L.k} port`,
                onClick: (te) => Q(L.k)
              }, "−", 8, eE),
              I("span", tE, he(M(L.k)), 1),
              I("button", {
                class: "kg-mini",
                "aria-label": `Add ${L.k} port`,
                onClick: (te) => S(L.k)
              }, "+", 8, nE),
              I("span", oE, he(L.l), 1)
            ])), 64))
          ])
        ]),
        E[36] || (E[36] = I("label", { class: "kg-label" }, "Tags", -1)),
        I("div", iE, [
          (A(!0), G(ye, null, Se(e.node.tags || [], (L) => (A(), G("span", {
            key: L,
            class: "kg-tagchip"
          }, [
            Pt(he(L), 1),
            I("button", {
              class: "kg-tagx",
              "aria-label": `Remove tag ${L}`,
              onClick: (te) => N(L)
            }, "×", 8, rE)
          ]))), 128))
        ]),
        sn(I("input", {
          class: "kg-input kg-small",
          "onUpdate:modelValue": E[22] || (E[22] = (L) => r.value = L),
          placeholder: "add tag + Enter",
          onKeyup: Ze(K, ["enter"])
        }, null, 544), [
          [ln, r.value]
        ]),
        I("div", aE, [
          E[35] || (E[35] = I("span", null, "Materials", -1)),
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Attach a workspace component reference",
            onClick: E[23] || (E[23] = (L) => o("component-ref-add", P()))
          }, "+ Component ref"),
          I("div", sE, [
            I("button", {
              class: "kg-mini",
              title: p.value.length ? "Attach material" : "No material types — open Types",
              "aria-label": "Attach material",
              onClick: E[24] || (E[24] = (L) => s.value = !s.value)
            }, "+", 8, lE),
            s.value ? (A(), G("div", uE, [
              (A(!0), G(ye, null, Se(p.value, (L) => (A(), G("button", {
                key: L.id,
                class: "kg-add-item",
                onClick: (te) => y(L.id)
              }, he(L.title || L.id), 9, cE))), 128)),
              p.value.length ? de("", !0) : (A(), G("div", dE, "no material types"))
            ])) : de("", !0)
          ])
        ]),
        I("div", fE, [
          (A(!0), G(ye, null, Se(e.materials, (L) => (A(), Ie(Ua, {
            key: L.id,
            material: L,
            "material-types": e.materialTypes,
            expanded: c.value.has(L.id),
            onToggle: (te) => $(L.id),
            onUpdate: (te) => o("material-update", { id: L.id, patch: te }),
            onRemove: (te) => o("material-remove", L.id)
          }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
          e.materials.length ? de("", !0) : (A(), G("div", hE, "no materials yet"))
        ]),
        I("button", {
          class: "kg-btn kg-danger kg-block",
          onClick: E[25] || (E[25] = (L) => o("delete"))
        }, "Delete node")
      ], 64))
    ]));
  }
}), gE = { class: "kg-panel-inner" }, vE = {
  key: 0,
  class: "kg-hdr"
}, mE = { class: "kg-hdr-top" }, yE = { class: "kg-hdr-top" }, wE = ["onKeydown"], _E = { class: "kg-edge-dir" }, bE = { class: "kg-edge-node" }, kE = { class: "kg-edge-arrow" }, EE = { class: "kg-edge-node" }, $E = { class: "kg-chiprow" }, xE = ["onClick"], SE = {
  key: 0,
  class: "kg-chip active"
}, NE = { class: "kg-chiprow" }, CE = { class: "kg-disclosure-meta" }, ME = {
  key: 0,
  class: "kg-disclosure-body"
}, TE = { class: "kg-colorrow" }, IE = ["aria-label", "onClick"], DE = ["value"], AE = { class: "kg-inline-field" }, OE = { class: "kg-inline-field kg-wrap" }, PE = ["onClick"], RE = { class: "kg-section-head" }, zE = { class: "kg-add-wrap" }, BE = ["title"], LE = {
  key: 0,
  class: "kg-add-menu"
}, VE = ["onClick"], HE = {
  key: 0,
  class: "kg-add-empty"
}, FE = { class: "kg-materials" }, GE = {
  key: 0,
  class: "kg-empty-line"
}, YE = /* @__PURE__ */ xe({
  __name: "EdgePanel",
  props: {
    readOnly: { type: Boolean },
    edge: {},
    edgeTypes: {},
    materialTypes: {},
    materials: {},
    sourceName: {},
    targetName: {}
  },
  emits: ["update", "reverse", "delete", "material-add", "component-ref-add", "material-update", "material-remove", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = e, o = t, i = fe(!1), a = fe(""), r = fe(!1), s = fe(!1), u = fe(/* @__PURE__ */ new Set());
    Ee(() => n.materials.length, (N, C) => {
      if (N > (C ?? 0)) {
        const M = n.materials[n.materials.length - 1];
        M && (u.value = /* @__PURE__ */ new Set([...u.value, M.id]));
      }
    }), Ee(() => n.edge.id, () => {
      u.value = /* @__PURE__ */ new Set(), s.value = !1, i.value = !1;
    });
    const c = ne(() => n.edge.properties || {}), l = ne(() => c.value.animated === !0 || c.value.animated === "true"), d = ne(() => c.value.bidirectional === !0 || c.value.direction === "bidirectional"), f = ne(() => String(c.value.stroke || "")), h = ne(() => Number(c.value.strokeWidth || 0)), w = ne(() => String(c.value.routing || "default")), _ = ne(() => n.materialTypes.filter((N) => !N.targets || N.targets.includes("edge")));
    function m() {
      i.value = !0, a.value = n.edge.label || "";
    }
    function p() {
      i.value = !1, a.value !== (n.edge.label || "") && o("update", { label: a.value });
    }
    function v(N) {
      N !== n.edge.type && o("update", { type: N });
    }
    function g(N, C) {
      o("update", { properties: { ...c.value, [N]: C } });
    }
    function b(N) {
      g("direction", N ? "bidirectional" : "directed");
    }
    function O(N) {
      r.value = !1, o("material-add", N);
    }
    function F() {
      return _.value.find((N) => N.id === "reference")?.id || _.value.find((N) => N.id === "component")?.id || _.value[0]?.id || "reference";
    }
    function K(N) {
      const C = new Set(u.value);
      C.has(N) ? C.delete(N) : C.add(N), u.value = C;
    }
    return (N, C) => (A(), G("div", gE, [
      e.readOnly ? (A(), G("div", vE, [
        I("div", mE, [
          C[12] || (C[12] = I("span", { class: "kg-kicker" }, "Relation", -1)),
          I("button", {
            class: "kg-x",
            "aria-label": "Close edge inspector",
            onClick: C[0] || (C[0] = (M) => o("close"))
          }, "×")
        ]),
        I("h3", null, he(e.edge.label || "Relation"), 1),
        I("p", null, he(e.sourceName || "Source node") + " → " + he(e.targetName || "Target node"), 1),
        C[13] || (C[13] = I("p", { class: "kg-muted" }, "Read only", -1))
      ])) : (A(), G(ye, { key: 1 }, [
        I("div", {
          class: "kg-hdr",
          style: Oe({ borderLeftColor: f.value || "var(--kg-line)" })
        }, [
          I("div", yE, [
            C[14] || (C[14] = I("span", { class: "kg-kicker" }, "Edge", -1)),
            I("button", {
              class: "kg-x kg-x--chev",
              title: "Hide inspector",
              "aria-label": "Hide inspector",
              onClick: C[1] || (C[1] = (M) => o("collapse"))
            }, "»"),
            I("button", {
              class: "kg-x",
              title: "Close",
              "aria-label": "Close edge inspector",
              onClick: C[2] || (C[2] = (M) => o("close"))
            }, "×")
          ]),
          i.value ? sn((A(), G("input", {
            key: 0,
            class: "kg-input kg-title-input",
            "onUpdate:modelValue": C[3] || (C[3] = (M) => a.value = M),
            onKeyup: Ze(p, ["enter"]),
            onBlur: p,
            autofocus: ""
          }, null, 544)), [
            [ln, a.value]
          ]) : (A(), G("div", {
            key: 1,
            class: "kg-editable-title",
            role: "button",
            tabindex: "0",
            onClick: m,
            onKeydown: [
              Ze(m, ["enter"]),
              Ze(Ue(m, ["prevent"]), ["space"])
            ]
          }, he(e.edge.label || "set label…"), 41, wE)),
          I("div", _E, [
            I("span", bE, he(e.sourceName || "Source node"), 1),
            I("span", kE, he(d.value ? "↔" : "→"), 1),
            I("span", EE, he(e.targetName || "Target node"), 1)
          ])
        ], 4),
        C[21] || (C[21] = I("label", { class: "kg-label" }, "Type", -1)),
        I("div", $E, [
          (A(!0), G(ye, null, Se(e.edgeTypes, (M) => (A(), G("button", {
            key: M.id,
            class: Me(["kg-chip", { active: e.edge.type === M.id }]),
            onClick: (B) => v(M.id)
          }, he(M.title || M.id), 11, xE))), 128)),
          e.edgeTypes.length ? de("", !0) : (A(), G("button", SE, he(e.edge.type), 1))
        ]),
        C[22] || (C[22] = I("label", { class: "kg-label" }, "Direction", -1)),
        I("div", NE, [
          I("button", {
            class: "kg-chip",
            title: "Swap source and target",
            onClick: C[4] || (C[4] = (M) => o("reverse"))
          }, "reverse"),
          I("button", {
            class: Me(["kg-chip", { active: d.value }]),
            title: "Render arrows in both directions",
            onClick: C[5] || (C[5] = (M) => b(!d.value))
          }, "bidirectional", 2)
        ]),
        I("button", {
          class: Me(["kg-disclosure", { open: s.value }]),
          onClick: C[6] || (C[6] = (M) => s.value = !s.value)
        }, [
          C[15] || (C[15] = I("span", null, "Style", -1)),
          I("span", CE, [
            I("span", {
              class: "kg-swatch kg-swatch--peek",
              style: Oe({ background: f.value || "var(--p-text-muted-color)" })
            }, null, 4)
          ]),
          C[16] || (C[16] = I("span", { class: "kg-disclosure-chevron" }, "›", -1))
        ], 2),
        s.value ? (A(), G("div", ME, [
          I("div", TE, [
            (A(!0), G(ye, null, Se(oe(ii), (M) => (A(), G("button", {
              key: M.value,
              class: Me(["kg-swatch", { active: f.value === M.value }]),
              style: Oe({ background: M.value }),
              "aria-label": `Use edge color ${M.label}`,
              onClick: (B) => g("stroke", M.value)
            }, null, 14, IE))), 128)),
            I("select", {
              class: "kg-input kg-small kg-wsel",
              value: h.value || "",
              onChange: C[7] || (C[7] = (M) => g("strokeWidth", Number(M.target.value)))
            }, [...C[17] || (C[17] = [
              sf('<option value="">width</option><option value="1">1px</option><option value="2">2px</option><option value="3">3px</option><option value="4">4px</option>', 5)
            ])], 40, DE)
          ]),
          I("div", AE, [
            C[18] || (C[18] = I("span", { class: "kg-mini-label" }, "Effect", -1)),
            I("button", {
              class: Me(["kg-chip", { active: l.value }]),
              onClick: C[8] || (C[8] = (M) => g("animated", !l.value))
            }, "animated", 2)
          ]),
          I("div", OE, [
            C[19] || (C[19] = I("span", { class: "kg-mini-label" }, "Routing", -1)),
            (A(!0), G(ye, null, Se(oe(Vo), (M) => (A(), G("button", {
              key: M,
              class: Me(["kg-chip", { active: w.value === M }]),
              onClick: (B) => g("routing", M)
            }, he(M), 11, PE))), 128))
          ])
        ])) : de("", !0),
        I("div", RE, [
          C[20] || (C[20] = I("span", null, "Materials", -1)),
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Attach a workspace component reference",
            onClick: C[9] || (C[9] = (M) => o("component-ref-add", F()))
          }, "+ Component ref"),
          I("div", zE, [
            I("button", {
              class: "kg-mini",
              title: _.value.length ? "Attach material" : "No material types — open Types",
              "aria-label": "Attach material",
              onClick: C[10] || (C[10] = (M) => r.value = !r.value)
            }, "+", 8, BE),
            r.value ? (A(), G("div", LE, [
              (A(!0), G(ye, null, Se(_.value, (M) => (A(), G("button", {
                key: M.id,
                class: "kg-add-item",
                onClick: (B) => O(M.id)
              }, he(M.title || M.id), 9, VE))), 128)),
              _.value.length ? de("", !0) : (A(), G("div", HE, "no material types"))
            ])) : de("", !0)
          ])
        ]),
        I("div", FE, [
          (A(!0), G(ye, null, Se(e.materials, (M) => (A(), Ie(Ua, {
            key: M.id,
            material: M,
            "material-types": e.materialTypes,
            expanded: u.value.has(M.id),
            onToggle: (B) => K(M.id),
            onUpdate: (B) => o("material-update", { id: M.id, patch: B }),
            onRemove: (B) => o("material-remove", M.id)
          }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
          e.materials.length ? de("", !0) : (A(), G("div", GE, "none"))
        ]),
        I("button", {
          class: "kg-btn kg-danger kg-block",
          onClick: C[11] || (C[11] = (M) => o("delete"))
        }, "Delete edge")
      ], 64))
    ]));
  }
}), UE = { class: "kg-panel-inner" }, qE = { class: "kg-panel-head" }, XE = { class: "kg-head-actions" }, WE = { class: "kg-type-group" }, KE = { class: "kg-section-head" }, ZE = ["value", "onChange"], jE = ["aria-label", "value", "onChange"], JE = ["value"], QE = ["aria-label", "onClick"], e$ = { class: "kg-type-group" }, t$ = { class: "kg-section-head" }, n$ = ["value", "onChange"], o$ = ["aria-label", "value", "onChange"], i$ = ["value"], r$ = { class: "kg-anim-lbl" }, a$ = ["checked", "onChange"], s$ = ["aria-label", "onClick"], l$ = { class: "kg-type-group" }, u$ = { class: "kg-section-head" }, c$ = { class: "kg-type-row" }, d$ = ["value", "onChange"], f$ = ["value", "onChange"], h$ = ["value"], p$ = ["aria-label", "onClick"], g$ = { class: "kg-targets" }, v$ = ["checked", "onChange"], m$ = /* @__PURE__ */ xe({
  __name: "SchemaPanel",
  props: {
    nodeTypes: {},
    edgeTypes: {},
    materialTypes: {}
  },
  emits: ["type-add", "type-update", "type-remove", "seed", "collapse", "close"],
  setup(e, { emit: t }) {
    const n = t, o = ["panel", "badge", "both"], i = ["graph", "node", "edge"];
    function a(u, c, l) {
      n("type-update", { kind: u, id: c, patch: l });
    }
    function r(u, c) {
      const l = Array.isArray(u.targets) ? u.targets : [], d = l.includes(c) ? l.filter((f) => f !== c) : [...l, c];
      a("material", u.id, { targets: d });
    }
    function s(u, c) {
      return !u.targets || Array.isArray(u.targets) && u.targets.includes(c);
    }
    return (u, c) => (A(), G("div", UE, [
      I("div", qE, [
        c[6] || (c[6] = I("span", { class: "kg-panel-title" }, "Types", -1)),
        I("div", XE, [
          I("button", {
            class: "kg-mini kg-mini--wide",
            title: "Seed default types",
            onClick: c[0] || (c[0] = (l) => n("seed"))
          }, "Seed"),
          I("button", {
            class: "kg-x kg-x--chev",
            title: "Hide inspector",
            "aria-label": "Hide inspector",
            onClick: c[1] || (c[1] = (l) => n("collapse"))
          }, "»"),
          I("button", {
            class: "kg-x",
            title: "Close",
            "aria-label": "Close schema editor",
            onClick: c[2] || (c[2] = (l) => n("close"))
          }, "×")
        ])
      ]),
      I("div", WE, [
        I("div", KE, [
          c[7] || (c[7] = I("span", null, "Node types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add node type",
            onClick: c[3] || (c[3] = (l) => n("type-add", "node"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.nodeTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row"
        }, [
          I("input", {
            class: "kg-input kg-small",
            value: l.title || l.id,
            onChange: (d) => a("node", l.id, { title: d.target.value })
          }, null, 40, ZE),
          I("select", {
            class: "kg-input kg-small kg-theme-select",
            "aria-label": `${l.title || l.id} color`,
            value: String(l.color || "var(--p-primary-color)"),
            onChange: (d) => a("node", l.id, { color: d.target.value })
          }, [
            (A(!0), G(ye, null, Se(oe(ii), (d) => (A(), G("option", {
              key: d.value,
              value: d.value
            }, he(d.label), 9, JE))), 128))
          ], 40, jE),
          I("button", {
            class: "kg-mini kg-danger",
            "aria-label": `Remove node type ${l.title || l.id}`,
            onClick: (d) => n("type-remove", { kind: "node", id: l.id })
          }, "×", 8, QE)
        ]))), 128))
      ]),
      I("div", e$, [
        I("div", t$, [
          c[8] || (c[8] = I("span", null, "Edge types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add edge type",
            onClick: c[4] || (c[4] = (l) => n("type-add", "edge"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.edgeTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row"
        }, [
          I("input", {
            class: "kg-input kg-small",
            value: l.title || l.id,
            onChange: (d) => a("edge", l.id, { title: d.target.value })
          }, null, 40, n$),
          I("select", {
            class: "kg-input kg-small kg-theme-select",
            "aria-label": `${l.title || l.id} color`,
            value: String(l.color || l.stroke || "var(--p-text-muted-color)"),
            onChange: (d) => a("edge", l.id, { color: d.target.value, stroke: d.target.value })
          }, [
            (A(!0), G(ye, null, Se(oe(ii), (d) => (A(), G("option", {
              key: d.value,
              value: d.value
            }, he(d.label), 9, i$))), 128))
          ], 40, o$),
          I("label", r$, [
            I("input", {
              type: "checkbox",
              checked: l.animated === !0,
              onChange: (d) => a("edge", l.id, { animated: d.target.checked })
            }, null, 40, a$),
            c[9] || (c[9] = Pt("anim", -1))
          ]),
          I("button", {
            class: "kg-mini kg-danger",
            "aria-label": `Remove edge type ${l.title || l.id}`,
            onClick: (d) => n("type-remove", { kind: "edge", id: l.id })
          }, "×", 8, s$)
        ]))), 128))
      ]),
      I("div", l$, [
        I("div", u$, [
          c[10] || (c[10] = I("span", null, "Material types", -1)),
          I("button", {
            class: "kg-mini",
            "aria-label": "Add material type",
            onClick: c[5] || (c[5] = (l) => n("type-add", "material"))
          }, "+")
        ]),
        (A(!0), G(ye, null, Se(e.materialTypes, (l) => (A(), G("div", {
          key: l.id,
          class: "kg-type-row kg-type-row--mat"
        }, [
          I("div", c$, [
            I("input", {
              class: "kg-input kg-small",
              value: l.title || l.id,
              onChange: (d) => a("material", l.id, { title: d.target.value })
            }, null, 40, d$),
            I("select", {
              class: "kg-input kg-small",
              value: String(l.display || "panel"),
              onChange: (d) => a("material", l.id, { display: d.target.value })
            }, [
              (A(), G(ye, null, Se(o, (d) => I("option", {
                key: d,
                value: d
              }, he(d), 9, h$)), 64))
            ], 40, f$),
            I("button", {
              class: "kg-mini kg-danger",
              "aria-label": `Remove material type ${l.title || l.id}`,
              onClick: (d) => n("type-remove", { kind: "material", id: l.id })
            }, "×", 8, p$)
          ]),
          I("div", g$, [
            (A(), G(ye, null, Se(i, (d) => I("label", {
              key: d,
              class: "kg-anim-lbl"
            }, [
              I("input", {
                type: "checkbox",
                checked: s(l, d),
                onChange: (f) => r(l, d)
              }, null, 40, v$),
              Pt(he(d), 1)
            ])), 64))
          ])
        ]))), 128))
      ])
    ]));
  }
}), y$ = 12;
function Pn(e) {
  return e.trim().toLowerCase();
}
function w$(e, t, n) {
  const o = Pn(e.name || "");
  return o.startsWith(t) ? 0 : o.split(/\s+/).some((i) => i.startsWith(t)) ? 1 : o.includes(t) ? 2 : (e.tags || []).some((i) => Pn(i).includes(t)) ? 3 : Pn(n).includes(t) || Pn(e.type || "").includes(t) ? 4 : null;
}
function _$(e, t, n) {
  const o = Pn(t);
  if (!o) return [];
  const i = [];
  for (const a of e) {
    const r = String(n.get(a.type)?.title || a.type || ""), s = w$(a, o, r);
    s !== null && i.push({ node: a, score: s });
  }
  return i.sort((a, r) => a.score - r.score || (a.node.name || "").localeCompare(r.node.name || "")), i.slice(0, y$);
}
function dd(e, t) {
  const n = [];
  let o = e.get(t)?.parent_id;
  const i = /* @__PURE__ */ new Set();
  for (; o && !i.has(o); )
    i.add(o), n.unshift(o), o = e.get(o)?.parent_id;
  return n;
}
function b$(e, t) {
  return dd(e, t).map((n) => e.get(n)?.name || n).join(" / ");
}
const k$ = { class: "kg-search" }, E$ = {
  key: 0,
  class: "kg-search-menu"
}, $$ = ["onMousedown", "onMousemove"], x$ = { class: "kg-search-name" }, S$ = {
  key: 0,
  class: "kg-search-crumb"
}, N$ = {
  key: 0,
  class: "kg-search-none"
}, C$ = /* @__PURE__ */ xe({
  __name: "GraphSearch",
  props: {
    nodes: {},
    nodeById: {},
    typeDefs: {}
  },
  emits: ["pick"],
  setup(e, { expose: t, emit: n }) {
    const o = e, i = n, a = fe(null), r = fe(""), s = fe(!1), u = fe(0), c = ne(() => _$(o.nodes, r.value, o.typeDefs)), l = ne(() => s.value && r.value.trim().length > 0);
    function d(m) {
      return String(m.properties?.accent || o.typeDefs.get(m.type)?.color || "var(--p-primary-color)");
    }
    function f(m) {
      return b$(o.nodeById, m.id);
    }
    function h(m) {
      i("pick", m), r.value = "", a.value?.blur();
    }
    function w(m) {
      if (m.key === "ArrowDown")
        m.preventDefault(), u.value = Math.min(u.value + 1, c.value.length - 1);
      else if (m.key === "ArrowUp")
        m.preventDefault(), u.value = Math.max(u.value - 1, 0);
      else if (m.key === "Enter") {
        m.preventDefault();
        const p = c.value[u.value];
        p && h(p.node.id);
      } else m.key === "Escape" ? (m.stopPropagation(), r.value = "", a.value?.blur()) : u.value = 0;
    }
    function _(m = "") {
      r.value = m, u.value = 0, We(() => {
        a.value?.focus(), a.value?.setSelectionRange(m.length, m.length);
      });
    }
    return t({ focus: _ }), (m, p) => (A(), G("div", k$, [
      sn(I("input", {
        ref_key: "input",
        ref: a,
        "onUpdate:modelValue": p[0] || (p[0] = (v) => r.value = v),
        class: "kg-search-input",
        type: "text",
        placeholder: "Find node…  /",
        spellcheck: "false",
        onFocus: p[1] || (p[1] = (v) => s.value = !0),
        onBlur: p[2] || (p[2] = (v) => s.value = !1),
        onKeydown: w
      }, null, 544), [
        [ln, r.value]
      ]),
      l.value ? (A(), G("div", E$, [
        (A(!0), G(ye, null, Se(c.value, (v, g) => (A(), G("button", {
          key: v.node.id,
          class: Me(["kg-search-item", { active: g === u.value }]),
          onMousedown: Ue((b) => h(v.node.id), ["prevent"]),
          onMousemove: (b) => u.value = g
        }, [
          I("span", {
            class: "kg-tree-dot",
            style: Oe({ background: d(v.node) })
          }, null, 4),
          I("span", x$, he(v.node.name), 1),
          f(v.node) ? (A(), G("span", S$, he(f(v.node)), 1)) : de("", !0)
        ], 42, $$))), 128)),
        c.value.length ? de("", !0) : (A(), G("div", N$, "No matches"))
      ])) : de("", !0)
    ]));
  }
}), M$ = ["onClick"], T$ = /* @__PURE__ */ xe({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = fe(null), i = fe(null), a = fe({ left: "0px", top: "0px", visibility: "hidden" });
    function r() {
      const c = o.value?.getBoundingClientRect(), l = i.value?.getBoundingClientRect();
      if (!c || !l) return;
      const d = Math.max(0, Math.min(n.x - c.left, c.width - l.width)), f = Math.max(0, Math.min(n.y - c.top, c.height - l.height));
      a.value = { left: `${d}px`, top: `${f}px`, visibility: "visible" };
    }
    Ee(() => [n.x, n.y], () => {
      We(r);
    }), ot(() => {
      We(r), window.addEventListener("resize", r);
    }), to(() => window.removeEventListener("resize", r));
    const s = t;
    function u(c) {
      c.action(), s("close");
    }
    return (c, l) => (A(), G("div", {
      ref_key: "layer",
      ref: o,
      class: "kg-ctx-overlay",
      onClick: l[2] || (l[2] = (d) => s("close")),
      onContextmenu: l[3] || (l[3] = Ue((d) => s("close"), ["prevent"]))
    }, [
      I("div", {
        ref_key: "panel",
        ref: i,
        class: "kg-ctx",
        style: Oe(a.value),
        onClick: l[0] || (l[0] = Ue(() => {
        }, ["stop"])),
        onContextmenu: l[1] || (l[1] = Ue(() => {
        }, ["prevent", "stop"]))
      }, [
        (A(!0), G(ye, null, Se(e.items, (d, f) => (A(), G("button", {
          key: f,
          class: Me(["kg-ctx-item", { "kg-ctx-danger": d.danger }]),
          onClick: (h) => u(d)
        }, he(d.label), 11, M$))), 128))
      ], 36)
    ], 544));
  }
});
function I$(e) {
  const t = [];
  if (e.viewRoot && t.push({ label: "← Go up", action: e.navigateUp }), e.nodeTypes.length)
    for (const n of e.nodeTypes) t.push({ label: `Add ${n.title || n.id}`, action: () => e.addNode(n.id) });
  else
    t.push({ label: "Add node", action: () => e.addNode() });
  return t;
}
function D$(e) {
  const t = [];
  if (e.nodeTypes.length)
    for (const n of e.nodeTypes) t.push({ label: `Add ${n.title || n.id}`, action: () => e.addConnected(n.id) });
  else
    t.push({ label: "Add node", action: () => e.addConnected() });
  return t;
}
function A$(e, t, n) {
  for (let o = n.length - 1; o >= 0; o--) {
    const i = n[o];
    if (i.id !== e && !(!i.width || !i.height) && t.x >= i.x && t.x <= i.x + i.width && t.y >= i.y && t.y <= i.y + i.height)
      return i.id;
  }
  return null;
}
function su(e) {
  return [e.x, e.x + e.width / 2, e.x + e.width];
}
function lu(e) {
  return [e.y, e.y + e.height / 2, e.y + e.height];
}
function uu(e, t) {
  return e === 1 == (t === 1);
}
function cu(e, t, n = 6) {
  let o = null, i = null;
  for (const u of t) {
    if (u.id === e.id || !u.width || !u.height) continue;
    const c = su(u), l = su(e);
    for (let h = 0; h < c.length; h++)
      for (let w = 0; w < l.length; w++) {
        if (!uu(h, w)) continue;
        const _ = c[h] - l[w];
        Math.abs(_) <= n && (!o || Math.abs(_) < Math.abs(o.delta)) && (o = { delta: _, at: c[h], other: u });
      }
    const d = lu(u), f = lu(e);
    for (let h = 0; h < d.length; h++)
      for (let w = 0; w < f.length; w++) {
        if (!uu(h, w)) continue;
        const _ = d[h] - f[w];
        Math.abs(_) <= n && (!i || Math.abs(_) < Math.abs(i.delta)) && (i = { delta: _, at: d[h], other: u });
      }
  }
  const a = e.x + (o ? o.delta : 0), r = e.y + (i ? i.delta : 0), s = [];
  return o && s.push({
    axis: "x",
    at: o.at,
    from: Math.min(r, o.other.y),
    to: Math.max(r + e.height, o.other.y + o.other.height)
  }), i && s.push({
    axis: "y",
    at: i.at,
    from: Math.min(a, i.other.x),
    to: Math.max(a + e.width, i.other.x + i.other.width)
  }), { x: a, y: r, guides: s };
}
function O$(e, t) {
  if (e.length < 2) return [];
  const n = Math.min(...e.map((u) => u.x)), o = Math.max(...e.map((u) => u.x + u.width)), i = Math.min(...e.map((u) => u.y)), a = Math.max(...e.map((u) => u.y + u.height)), r = (n + o) / 2, s = (i + a) / 2;
  return e.map((u) => {
    let c = u.x, l = u.y;
    return t === "left" ? c = n : t === "right" ? c = o - u.width : t === "center-h" ? c = Math.round(r - u.width / 2) : t === "top" ? l = i : t === "bottom" ? l = a - u.height : t === "center-v" && (l = Math.round(s - u.height / 2)), { id: u.id, x: c, y: l };
  });
}
function P$(e, t) {
  if (e.length < 3) return [];
  const n = [...e].sort((l, d) => t === "h" ? l.x - d.x : l.y - d.y), o = n[0], i = n[n.length - 1], a = n.reduce((l, d) => l + (t === "h" ? d.width : d.height), 0), s = ((t === "h" ? i.x + i.width - o.x : i.y + i.height - o.y) - a) / (n.length - 1), u = [];
  let c = t === "h" ? o.x : o.y;
  for (const l of n)
    u.push({ id: l.id, x: t === "h" ? Math.round(c) : l.x, y: t === "v" ? Math.round(c) : l.y }), c += (t === "h" ? l.width : l.height) + s;
  return u;
}
function R$(e, t, n = { x: 32, y: 32 }) {
  const o = /* @__PURE__ */ new Map(), i = e.nodes.map((r) => {
    const s = t();
    return o.set(r.id, s), { ...r, id: s, x: r.x + n.x, y: r.y + n.y };
  }), a = e.edges.filter((r) => o.has(r.source_id) && o.has(r.target_id)).map((r) => ({ ...r, source_id: o.get(r.source_id), target_id: o.get(r.target_id) }));
  return { nodes: i, edges: a };
}
const Le = {
  NODE_ADDED: "chestor.graph.events:node.added",
  NODE_UPDATED: "chestor.graph.events:node.updated",
  NODE_REMOVED: "chestor.graph.events:node.removed",
  EDGE_ADDED: "chestor.graph.events:edge.added",
  EDGE_UPDATED: "chestor.graph.events:edge.updated",
  EDGE_REMOVED: "chestor.graph.events:edge.removed",
  MATERIAL_ATTACHED: "chestor.graph.events:material.attached",
  MATERIAL_UPDATED: "chestor.graph.events:material.updated",
  MATERIAL_DETACHED: "chestor.graph.events:material.detached",
  NODE_TYPE_REGISTERED: "chestor.graph.events:node-type.registered",
  NODE_TYPE_UPDATED: "chestor.graph.events:node-type.updated",
  NODE_TYPE_REMOVED: "chestor.graph.events:node-type.removed",
  EDGE_TYPE_REGISTERED: "chestor.graph.events:edge-type.registered",
  EDGE_TYPE_UPDATED: "chestor.graph.events:edge-type.updated",
  EDGE_TYPE_REMOVED: "chestor.graph.events:edge-type.removed",
  MATERIAL_TYPE_REGISTERED: "chestor.graph.events:material-type.registered",
  MATERIAL_TYPE_UPDATED: "chestor.graph.events:material-type.updated",
  MATERIAL_TYPE_REMOVED: "chestor.graph.events:material-type.removed",
  LAYOUT_POSITION_SET: "chestor.graph.events:layout.position-set"
}, z$ = "chestor.graph:state";
function B$(e, t) {
  return `kickside.thread.${e}.projection.${t}`;
}
function L$(e, t, n) {
  for (const o of t) {
    if (o.type !== Le.LAYOUT_POSITION_SET) continue;
    const i = String(o.body.node_id || ""), a = Number(o.body.x), r = Number(o.body.y);
    !i || !Number.isFinite(a) || !Number.isFinite(r) || e.set(i, {
      revision: n,
      position: {
        x: a,
        y: r,
        ...Number.isFinite(Number(o.body.width)) ? { width: Number(o.body.width) } : {},
        ...Number.isFinite(Number(o.body.height)) ? { height: Number(o.body.height) } : {}
      }
    });
  }
}
function V$(e, t) {
  for (const [n, o] of e)
    o.revision === t && e.delete(n);
}
function fd(e, t = /* @__PURE__ */ new Set()) {
  for (const n of e || [])
    t.add(n.id), fd(n.children || [], t);
  return t;
}
function H$(e, t) {
  return e?.x === t.x && e?.y === t.y;
}
function F$(e, t, n) {
  if (!t.size) return e;
  const o = fd(e.nodes || []), i = { ...e.layout?.positions || {} };
  for (const [a, r] of t) {
    if (!o.has(a)) {
      t.delete(a), delete i[a];
      continue;
    }
    if (n && H$(i[a], r.position)) {
      t.delete(a);
      continue;
    }
    i[a] = r.position;
  }
  return { ...e, layout: { ...e.layout || {}, positions: i } };
}
function Ut() {
  const e = globalThis.crypto;
  return e && typeof e.randomUUID == "function" ? e.randomUUID() : `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function No(e) {
  const t = { id: e.id || Ut(), type: e.type, name: e.name };
  return e.parentId && (t.parent_id = e.parentId), e.properties && (t.properties = e.properties), e.tags && (t.tags = e.tags), { type: Le.NODE_ADDED, body: t };
}
function Fr(e, t) {
  return { type: Le.NODE_UPDATED, body: { id: e, ...t } };
}
function G$(e, t) {
  return { type: Le.NODE_UPDATED, body: { id: e, parent_id: t || "" } };
}
function Y$(e) {
  return { type: Le.NODE_REMOVED, body: { id: e } };
}
function an(e) {
  const t = { id: e.id || Ut(), type: e.type, source_id: e.sourceId, target_id: e.targetId };
  return e.label && (t.label = e.label), e.properties && (t.properties = e.properties), { type: Le.EDGE_ADDED, body: t };
}
function ya(e, t) {
  return { type: Le.EDGE_UPDATED, body: { id: e, ...t } };
}
function U$(e) {
  const t = { ...e.properties || {} }, n = t.sourceHandle, o = t.targetHandle;
  return o !== void 0 ? t.sourceHandle = o : delete t.sourceHandle, n !== void 0 ? t.targetHandle = n : delete t.targetHandle, ya(e.id, { source_id: e.target_id, target_id: e.source_id, properties: t });
}
function q$(e) {
  return { type: Le.EDGE_REMOVED, body: { id: e } };
}
function Bt(e, t, n, o, i) {
  const a = { node_id: e, x: Math.round(t), y: Math.round(n) };
  return Number.isFinite(o) && o && (a.width = Math.round(o)), Number.isFinite(i) && i && (a.height = Math.round(i)), { type: Le.LAYOUT_POSITION_SET, body: a };
}
function du(e) {
  return {
    type: Le.MATERIAL_ATTACHED,
    body: {
      id: e.id || Ut(),
      target_type: e.targetType,
      target_id: e.targetId,
      kind: e.kind,
      title: e.title ?? "Material",
      source: e.source || { type: "inline" },
      meta: e.meta || {}
    }
  };
}
function X$(e, t) {
  return { type: Le.MATERIAL_UPDATED, body: { id: e, ...t } };
}
function W$(e) {
  return { type: Le.MATERIAL_DETACHED, body: { id: e } };
}
const K$ = {
  node: Le.NODE_TYPE_REGISTERED,
  edge: Le.EDGE_TYPE_REGISTERED,
  material: Le.MATERIAL_TYPE_REGISTERED
}, Z$ = {
  node: Le.NODE_TYPE_UPDATED,
  edge: Le.EDGE_TYPE_UPDATED,
  material: Le.MATERIAL_TYPE_UPDATED
}, j$ = {
  node: Le.NODE_TYPE_REMOVED,
  edge: Le.EDGE_TYPE_REMOVED,
  material: Le.MATERIAL_TYPE_REMOVED
};
function Co(e, t) {
  return { type: K$[e], body: t };
}
function J$(e, t, n) {
  return { type: Z$[e], body: { id: t, ...n } };
}
function Q$(e, t) {
  return { type: j$[e], body: { id: t } };
}
function ex(e, t) {
  const n = new Set(e);
  if (!n.size) return [];
  const o = /* @__PURE__ */ new Map();
  for (const s of t)
    if (n.has(s.source_id)) {
      const u = o.get(s.source_id) || [];
      u.push(s), o.set(s.source_id, u);
    }
  const i = new Set(t.map((s) => `${s.source_id}→${s.target_id}`)), a = [], r = /* @__PURE__ */ new Set();
  for (const s of t) {
    if (n.has(s.source_id) || !n.has(s.target_id)) continue;
    const u = /* @__PURE__ */ new Set([s.target_id]), c = [s.target_id];
    for (; c.length; ) {
      const l = c.shift();
      for (const d of o.get(l) || []) {
        if (n.has(d.target_id)) {
          u.has(d.target_id) || (u.add(d.target_id), c.push(d.target_id));
          continue;
        }
        const f = `${s.source_id}→${d.target_id}`;
        s.source_id !== d.target_id && (i.has(f) || r.has(f) || (r.add(f), a.push({ source_id: s.source_id, target_id: d.target_id, type: d.type })));
      }
    }
  }
  return a;
}
const tx = /* @__PURE__ */ new Set(["INPUT", "TEXTAREA", "SELECT"]);
function qa(e) {
  const t = e?.tagName;
  return typeof t == "string" && tx.has(t.toUpperCase());
}
function nx(e) {
  if (qa(e.target)) return null;
  const t = !!(e.ctrlKey || e.metaKey);
  return t && (e.key === "z" || e.key === "Z") ? e.shiftKey ? "redo" : "undo" : t && (e.key === "y" || e.key === "Y") ? "redo" : t && (e.key === "d" || e.key === "D") ? "duplicate" : t && (e.key === "c" || e.key === "C") ? "copy" : t && (e.key === "v" || e.key === "V") ? "paste" : e.shiftKey && !t && e.key === "!" ? "fit" : e.shiftKey && !t && e.key === "@" ? "zoom-selection" : e.shiftKey && !t && e.key === "1" ? "fit" : e.shiftKey && !t && e.key === "2" ? "zoom-selection" : e.key === "Delete" || e.key === "Backspace" ? "delete" : e.key === "Escape" ? "escape" : null;
}
function ox(e, t) {
  return qa(e.target) || e.ctrlKey || e.metaKey || e.altKey ? null : e.key === "/" ? "search" : e.key.length === 1 && e.key !== " " ? t ? "rename" : "search" : (e.key === "Enter" || e.key === "F2") && t ? "rename" : null;
}
const ix = { class: "kg-top" }, rx = { class: "kg-breadcrumbs" }, ax = ["title", "aria-label"], sx = ["onClick"], lx = {
  key: 0,
  class: "kg-actions"
}, ux = ["value"], cx = ["disabled"], dx = ["disabled"], fx = ["title", "aria-label"], hx = { class: "kg-count" }, px = {
  key: 0,
  class: "kg-error"
}, gx = { class: "kg-body" }, vx = {
  key: 0,
  class: "kg-tree"
}, mx = { class: "kg-tree-head" }, yx = { class: "kg-muted" }, wx = { class: "kg-tree-list" }, _x = ["onClick", "onKeydown", "onDblclick"], bx = ["aria-label", "onClick"], kx = {
  key: 1,
  class: "kg-twist",
  "aria-hidden": "true"
}, Ex = { class: "kg-tree-name" }, $x = {
  key: 2,
  class: "kg-tree-count"
}, xx = {
  key: 0,
  class: "kg-tree-empty"
}, Sx = { class: "kg-canvas" }, Nx = {
  key: 0,
  class: "kg-guides",
  "aria-hidden": "true"
}, Cx = {
  key: 1,
  class: "kg-empty"
}, Mx = { class: "kg-empty-inner" }, Tx = { class: "kg-empty-text" }, Ix = {
  key: 2,
  class: "kg-hint"
}, Dx = {
  key: 2,
  class: "kg-panel"
}, Ax = {
  key: 2,
  class: "kg-panel-inner"
}, Ox = { class: "kg-panel-head" }, Px = { class: "kg-agg-note" }, Rx = { class: "kg-agg-list" }, zx = ["title", "onClick"], Bx = { class: "kg-agg-ends" }, Lx = { class: "kg-agg-type" }, Vx = {
  key: 4,
  class: "kg-panel-inner"
}, Hx = { class: "kg-panel-head" }, Fx = { class: "kg-stats" }, Gx = { class: "kg-section-head" }, Yx = {
  key: 0,
  class: "kg-materials"
}, Ux = {
  key: 0,
  class: "kg-empty-line"
}, qx = /* @__PURE__ */ xe({
  __name: "GraphApp",
  setup(e) {
    const t = lf(), n = ne(() => t.value?.entryId || ""), o = ne(() => (t.value?.mode || "preview") === "full"), i = ne(() => o.value && !t.value?.readOnly && a.value !== null), a = fe(null), r = fe(Ga([])), s = fe([]), u = fe([]), c = fe(!0), l = fe(""), d = fe(null), f = fe(null), h = fe(null), w = fe(/* @__PURE__ */ new Set()), _ = fe(/* @__PURE__ */ new Set()), m = fe(!0), p = fe(!0), v = fe(!1), g = fe([]), b = fe("TB"), O = fe(null), F = fe(!1), K = fe(null), N = fe(null), C = fe(!1);
    let M;
    function B() {
      m.value = !m.value, C.value && m.value && (p.value = !1);
    }
    Ee([d, f, v], () => {
      C.value && (d.value || f.value || v.value) && (m.value = !1);
    });
    const S = /* @__PURE__ */ new Map();
    let Q = 0, y = 0, P = Promise.resolve();
    const $ = fe(null);
    function X(k, x) {
      i.value && s.value.find((V) => V.id === k)?.type === "graphNode" && ($.value = { id: k, seed: x });
    }
    function U() {
      $.value = null, N.value?.focus();
    }
    St(jc, {
      state: $,
      commit: (k, x) => {
        const V = x.trim(), J = r.value.nodeById.get(k)?.name;
        V && V !== J && Ae([Fr(k, { name: V })]), U();
      },
      close: U
    }), Ee(d, (k) => {
      $.value && $.value.id !== k && ($.value = null);
    });
    const z = { graphNode: qt(X_), boundary: qt(K_), portalNode: qt(eb) }, E = `graph-${n.value || "entry"}-${t.value?.mode || "preview"}`, { fitView: L, getSelectedNodes: te, setCenter: H, viewport: q, screenToFlowCoordinate: Y, getNodes: j, onNodesInitialized: ee } = Pe(E), ae = () => `/api/v1/workspace/graphs/${n.value}`;
    function me(k) {
      const x = k, V = x?.response?.data?.error ?? x?.data?.error;
      return typeof V == "string" && V ? V : k instanceof Error && k.message && !/^request failed/i.test(k.message) && !/status code/i.test(k.message) ? k.message : "";
    }
    function ge(k, x) {
      const V = me(k);
      return V ? /nothing to undo/i.test(V) ? "Nothing to undo." : /nothing to redo/i.test(V) ? "Nothing to redo." : V : x;
    }
    const be = ne(() => g.value.length ? g.value[g.value.length - 1] : void 0), ie = ne(() => d.value && r.value.nodeById.get(d.value) || null), se = ne(() => f.value && (a.value?.edges || []).find((k) => k.id === f.value) || null), D = ne(() => a.value?.schema.node_types || []), T = ne(() => a.value?.schema.edge_types || []), R = ne(() => a.value?.schema.material_types || []), Z = ne(() => Vn(D.value));
    ne(() => Vn(T.value));
    const W = ne(() => [...D.value].sort((k, x) => (k.title || k.id).localeCompare(x.title || x.id))), re = ne(() => a.value?.materials || []), le = fe(/* @__PURE__ */ new Set());
    Ee(() => re.value.length, (k, x) => {
      if (k > (x ?? 0)) {
        const V = re.value[re.value.length - 1];
        V && (le.value = /* @__PURE__ */ new Set([...le.value, V.id]));
      }
    });
    function ve(k) {
      const x = new Set(le.value);
      x.has(k) ? x.delete(k) : x.add(k), le.value = x;
    }
    const pe = ne(() => ({
      nodes: s.value.filter((k) => k.type === "graphNode").length,
      edges: u.value.length
    })), we = ne(() => !!(ie.value && (r.value.childrenByParent.get(ie.value.id) || []).length)), $e = ne(() => {
      const k = [];
      function x(V, J) {
        for (const _e of r.value.childrenByParent.get(V) || []) {
          const ke = r.value.childrenByParent.get(_e.id) || [], Re = _.value.has(_e.id);
          k.push({ node: _e, depth: J, childCount: ke.length, expanded: Re }), Re && x(_e.id, J + 1);
        }
      }
      return x("", 0), k;
    }), Ce = ne(() => g.value.map((k) => ({ id: k, name: r.value.nodeById.get(k)?.name || k })));
    function at(k) {
      return String(Z.value.get(k)?.color || "var(--p-primary-color)");
    }
    function Ye() {
      return D.value[0]?.id || "note";
    }
    function _n() {
      return T.value[0]?.id || "relates-to";
    }
    function bi(k) {
      return R.value.find((x) => !x.targets || x.targets.includes(k))?.id || "note";
    }
    let en = !1;
    ee(() => {
      en && (en = !1, fo());
    });
    function bn(k = !1) {
      if (!a.value) return;
      const x = Jb(a.value, w.value, be.value);
      r.value = x.flat, s.value = x.flowNodes, u.value = x.flowEdges, k && (en = !0, s.value.length || (en = !1));
    }
    function ki(k, x = !1, V = {}) {
      const J = F$(k, S, V.committed === !0);
      a.value = {
        ...J,
        nodes: J.nodes || [],
        edges: J.edges || [],
        materials: J.materials || [],
        schema: {
          node_types: J.schema?.node_types || [],
          edge_types: J.schema?.edge_types || [],
          material_types: J.schema?.material_types || []
        },
        layout: { positions: J.layout?.positions || {}, viewport: J.layout?.viewport },
        settings: J.settings || {},
        can_undo: J.can_undo === !0,
        can_redo: J.can_redo === !0
      }, V.preserveCanvas || bn(x);
    }
    async function Ei(k = !1, x = !1) {
      if (!n.value) {
        l.value = "entry id required", c.value = !1;
        return;
      }
      const V = ++y;
      try {
        const { data: J } = await To.get(ae());
        if (!J.success) throw new Error(J.error || "failed to load graph");
        if (V !== y) return;
        ki(J.graph, k, { committed: x }), l.value = "";
      } catch (J) {
        if (V !== y) return;
        l.value = ge(J, "Couldn’t load the graph.");
      } finally {
        V === y && (c.value = !1);
      }
    }
    function Xa(k) {
      const x = P.then(k);
      return P = x.catch((V) => {
        l.value = ge(V, "Couldn’t save the change.");
      }), x;
    }
    async function hd(k, x = !1, V = {}) {
      if (k.length)
        try {
          const { data: J } = await To.post(`${ae()}/apply`, { commands: k });
          if (!J.success) throw new Error(J.error || "apply failed");
          ki(J.graph, x, { preserveCanvas: V.preserveCanvas }), l.value = "";
        } catch (J) {
          V.layoutRevision !== void 0 && (V$(S, V.layoutRevision), await Ei(!1)), l.value = ge(J, "Couldn’t save the change.");
        }
    }
    function Ae(k, x = !1, V = {}) {
      return !i.value || !k.length ? Promise.resolve() : Xa(() => hd(k, x, V));
    }
    async function pd(k) {
      if (a.value && !(k === "undo" && !a.value.can_undo) && !(k === "redo" && !a.value.can_redo))
        try {
          S.clear();
          const { data: x } = await To.post(`${ae()}/${k}`, {});
          if (!x.success) throw new Error(x.error || `${k} failed`);
          ki(x.graph), l.value = "";
        } catch (x) {
          l.value = ge(x, k === "undo" ? "Nothing to undo." : "Nothing to redo.");
        }
    }
    function so(k) {
      return i.value ? Xa(() => pd(k)) : Promise.resolve();
    }
    function gd(k) {
      ie.value && Ae([Fr(ie.value.id, k)]);
    }
    function vd(k) {
      se.value && Ae([ya(se.value.id, k)]);
    }
    function md() {
      se.value && Ae([U$(se.value)]);
    }
    function kn(k = Ye(), x = be.value, V) {
      const J = Ut(), _e = [No({ id: J, type: k, name: "New node", parentId: x })];
      return V && _e.push(Bt(J, Math.round(V.x), Math.round(V.y))), Ae(_e), d.value = J, f.value = null, v.value = !1, p.value = !0, J;
    }
    const Wa = fe(null);
    function yd() {
      const k = te.value.length ? te.value : d.value ? j.value.filter((_e) => _e.id === d.value) : [];
      if (!k.length) return;
      const x = new Set(k.map((_e) => String(_e.id))), V = k.flatMap((_e) => {
        const ke = r.value.nodeById.get(String(_e.id));
        return ke ? [{ id: ke.id, type: ke.type, name: ke.name, properties: ke.properties, tags: ke.tags, x: _e.position.x, y: _e.position.y }] : [];
      }), J = (a.value?.edges || []).filter((_e) => x.has(_e.source_id) && x.has(_e.target_id)).map((_e) => ({ type: _e.type, source_id: _e.source_id, target_id: _e.target_id, label: _e.label, properties: _e.properties }));
      Wa.value = { nodes: V, edges: J };
    }
    function wd() {
      const k = Wa.value;
      if (!k || !k.nodes.length) return;
      const x = R$(k, Ut), V = [];
      for (const J of x.nodes)
        V.push(No({ id: J.id, type: J.type, name: J.name, parentId: be.value, properties: J.properties, tags: J.tags })), V.push(Bt(J.id, Math.round(J.x), Math.round(J.y)));
      for (const J of x.edges) V.push(an({ type: J.type, sourceId: J.source_id, targetId: J.target_id, label: J.label, properties: J.properties }));
      Ae(V), x.nodes.length === 1 && (d.value = x.nodes[0].id);
    }
    function _d(k) {
      const x = te.value.filter((J) => J.dimensions?.width).map(En), V = O$(x, k);
      V.length && Ae(V.map((J) => Bt(J.id, J.x, J.y)));
    }
    function Ka(k) {
      const x = te.value.filter((J) => J.dimensions?.width).map(En), V = P$(x, k);
      V.length && Ae(V.map((J) => Bt(J.id, J.x, J.y)));
    }
    function bd() {
      const k = d.value ? r.value.nodeById.get(d.value) : null;
      if (!k) return;
      const x = Ut(), V = j.value.find((ke) => ke.id === k.id), J = V ? V.position : { x: 0, y: 0 }, _e = [
        No({ id: x, type: k.type, name: k.name, parentId: k.parent_id ?? void 0, properties: k.properties, tags: k.tags }),
        Bt(x, Math.round(J.x + 32), Math.round(J.y + 32))
      ];
      for (const ke of a.value?.edges || [])
        ke.target_id === k.id && _e.push(an({ type: ke.type, sourceId: ke.source_id, targetId: x, label: ke.label, properties: ke.properties }));
      Ae(_e), d.value = x;
    }
    function kd(k) {
      const x = Ut();
      Ae([No({ id: x, type: Ye(), name: "New child", parentId: k })]);
    }
    function lo(k) {
      if (k = k.filter((J) => !Gb(J)), !k.length) return;
      const x = a.value?.edges || [], V = ex(k, x.map((J) => ({ id: String(J.id), type: String(J.type), source_id: String(J.source_id), target_id: String(J.target_id) })));
      Ae([
        ...V.map((J) => an({ type: J.type, sourceId: J.source_id, targetId: J.target_id })),
        ...k.map((J) => Y$(J))
      ]);
    }
    function $i() {
      const k = te.value;
      if (k.length > 1) {
        d.value = null, lo(k.map((x) => String(x.id)));
        return;
      }
      if (se.value) {
        const x = se.value.id;
        f.value = null, Ae([q$(x)]);
      } else if (ie.value) {
        const x = ie.value.id;
        d.value = null, lo([x]);
      }
    }
    function uo(k, x) {
      Ae(k.map((V) => G$(V, x)));
    }
    let xi = null, Si = !1;
    function Ed(k) {
      i.value && (F.value = !0, Si = !1, xi = k?.nodeId ?? null);
    }
    function $d(k) {
      if (!i.value || !k.source || !k.target || k.source === k.target) return;
      Si = !0;
      const x = {};
      k.sourceHandle && (x.sourceHandle = k.sourceHandle), k.targetHandle && (x.targetHandle = k.targetHandle), Ae([an({ type: _n(), sourceId: k.source, targetId: k.target, properties: x })]);
    }
    function xd(k) {
      F.value = !1;
      const x = xi;
      if (xi = null, Si || !x || !(k instanceof MouseEvent)) return;
      const V = Y({ x: k.clientX, y: k.clientY }), J = j.value.map((Re) => ({
        id: Re.id,
        x: Re.computedPosition?.x ?? Re.position.x,
        y: Re.computedPosition?.y ?? Re.position.y,
        width: Re.dimensions?.width ?? 0,
        height: Re.dimensions?.height ?? 0
      })), _e = A$(x, V, J);
      if (_e) {
        Ae([an({ type: _n(), sourceId: x, targetId: _e, properties: {} })]);
        return;
      }
      const ke = D$({
        nodeTypes: W.value,
        addConnected: (Re) => {
          const mt = kn(Re ?? Ye(), be.value, V);
          Ae([an({ type: _n(), sourceId: x, targetId: mt, properties: {} })]);
        }
      });
      Qa = Date.now() + 300, O.value = { x: k.clientX, y: k.clientY, items: ke };
    }
    function Sd(k, x) {
      const V = r.value.nodeById.get(k);
      V && Ae([Fr(k, { properties: { ...V.properties || {}, width: x } })]);
    }
    St(Zc, Sd);
    const co = fe([]);
    function En(k) {
      return { id: String(k.id), x: k.position.x, y: k.position.y, width: Number(k.dimensions?.width || 0), height: Number(k.dimensions?.height || 0) };
    }
    function Za(k) {
      return j.value.filter((x) => x.id !== k && x.dimensions?.width).map(En);
    }
    function Nd(k) {
      const x = !(k.nodes?.length > 1), V = k.event;
      if (!x || V?.ctrlKey) {
        co.value = [];
        return;
      }
      co.value = cu(En(k.node), Za(String(k.node.id)), 6).guides;
    }
    function Cd(k) {
      if (!i.value) return;
      co.value = [];
      const x = k.nodes?.length ? k.nodes : [k.node], V = k.event;
      if (x.length === 1 && x[0] && !V?.ctrlKey) {
        const ke = cu(En(x[0]), Za(String(x[0].id)), 6);
        x[0].position = { x: ke.x, y: ke.y };
      }
      const J = x.filter(Boolean).map((ke) => Bt(
        String(ke.id),
        ke.position.x,
        ke.position.y,
        Number(ke.dimensions?.width || 0) || void 0,
        Number(ke.dimensions?.height || 0) || void 0
      )), _e = ++Q;
      L$(S, J, _e), Ae(J, !1, { layoutRevision: _e, preserveCanvas: !0 });
    }
    function Ni(k, x, V) {
      Ae([du({ targetType: k, targetId: V, kind: x })]);
    }
    function ja(k, x, V) {
      Ae([du({ targetType: k, targetId: V, kind: x, title: "Component ref", source: { type: "component" } })]);
    }
    function Ci(k) {
      Ae([X$(k.id, k.patch)]);
    }
    function Mi(k) {
      Ae([W$(k)]);
    }
    function Md(k) {
      const V = { id: `${k}-${Math.floor(Math.random() * 1e4)}`, title: k === "node" ? "Node" : k === "edge" ? "Relation" : "Note" };
      k === "node" && (V.color = "var(--p-primary-color)"), k === "edge" && (V.color = "var(--p-text-muted-color)", V.stroke = "var(--p-text-muted-color)"), k === "material" && (V.targets = ["graph", "node", "edge"], V.display = "panel"), Ae([Co(k, V)]);
    }
    function Td(k) {
      Ae([J$(k.kind, k.id, k.patch)]);
    }
    function Id(k) {
      Ae([Q$(k.kind, k.id)]);
    }
    function Dd() {
      const k = [], x = [
        ["note", "Note", "var(--p-text-muted-color)"],
        ["idea", "Idea", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))"],
        ["topic", "Topic", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))"],
        ["task", "Task", "var(--p-primary-color)"],
        ["question", "Question", "color-mix(in srgb, var(--p-primary-color) 40%, var(--p-text-color))"],
        ["decision", "Decision", "color-mix(in srgb, var(--p-primary-color) 45%, var(--p-text-color))"],
        ["person", "Person", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))"],
        ["resource", "Resource", "color-mix(in srgb, var(--p-primary-color) 65%, var(--p-text-color))"],
        ["goal", "Goal", "color-mix(in srgb, var(--p-primary-color) 90%, var(--p-text-color))"]
      ];
      for (const [_e, ke, Re] of x) k.push(Co("node", { id: _e, title: ke, color: Re }));
      const V = [
        ["relates-to", "Relates To", "var(--p-text-muted-color)", !1],
        ["leads-to", "Leads To", "color-mix(in srgb, var(--p-primary-color) 70%, var(--p-text-color))", !1],
        ["depends-on", "Depends On", "color-mix(in srgb, var(--p-primary-color) 85%, var(--p-text-color))", !1],
        ["supports", "Supports", "var(--p-primary-color)", !1],
        ["blocks", "Blocks", "color-mix(in srgb, var(--p-primary-color) 60%, var(--p-text-color))", !1],
        ["part-of", "Part Of", "color-mix(in srgb, var(--p-primary-color) 55%, var(--p-text-color))", !1]
      ];
      for (const [_e, ke, Re, mt] of V) k.push(Co("edge", { id: _e, title: ke, color: Re, stroke: Re, animated: mt }));
      const J = [
        ["note", "Note", "panel"],
        ["reference", "Reference", "badge"],
        ["constraint", "Constraint", "badge"],
        ["metric", "Metric", "badge"]
      ];
      for (const [_e, ke, Re] of J) k.push(Co("material", { id: _e, title: ke, display: Re, targets: ["graph", "node", "edge"] }));
      Ae(k);
    }
    function Ad(k) {
      const x = k.node.data?.portalTarget;
      if (x) {
        tn(x);
        return;
      }
      d.value = k.node.id, f.value = null, h.value = null, v.value = !1, p.value = !0;
    }
    function Od(k) {
      const x = k.edge.data;
      if (x?.aggregated) {
        h.value = { label: k.edge.label || "", count: x.count || (x.members?.length ?? 0), members: x.members || [] }, f.value = null, d.value = null, v.value = !1, p.value = !0;
        return;
      }
      h.value = null, f.value = k.edge.id, d.value = null, v.value = !1, p.value = !0;
    }
    const Ja = ne(() => {
      const k = q.value;
      return co.value.map((x) => x.axis === "x" ? { key: `x${x.at}`, left: x.at * k.zoom + k.x, top: x.from * k.zoom + k.y, length: (x.to - x.from) * k.zoom, vertical: !0 } : { key: `y${x.at}`, left: x.from * k.zoom + k.x, top: x.at * k.zoom + k.y, length: (x.to - x.from) * k.zoom, vertical: !1 });
    });
    let Qa = 0;
    function Pd() {
      d.value = null, f.value = null, h.value = null, Date.now() >= Qa && (O.value = null);
    }
    function Rd(k) {
      const x = k.node.data?.portalTarget;
      if (x) {
        tn(x);
        return;
      }
      (r.value.childrenByParent.get(k.node.id) || []).length ? $n(k.node.id) : X(k.node.id, null);
    }
    function zd(k) {
      if (k.edge.data?.aggregated) {
        const _e = [k.edge.source, k.edge.target].find((Re) => String(Re).startsWith("portal:"));
        if (_e) {
          tn(String(_e).slice(7));
          return;
        }
        const ke = [k.edge.source, k.edge.target].find((Re) => (r.value.childrenByParent.get(String(Re)) || []).length);
        ke && $n(String(ke));
        return;
      }
      const x = (a.value?.edges || []).find((_e) => _e.id === k.edge.id);
      if (!x) return;
      const V = String(x.properties?.routing || "default"), J = Vo[(Vo.indexOf(V) + 1) % Vo.length];
      Ae([ya(x.id, { properties: { ...x.properties || {}, routing: J } })]);
    }
    function es(k) {
      const x = new Set(w.value);
      x.has(k) ? x.delete(k) : x.add(k), w.value = x, bn();
    }
    function Bd(k) {
      const x = new Set(_.value);
      x.has(k) ? x.delete(k) : x.add(k), _.value = x;
    }
    function $n(k) {
      const x = g.value.indexOf(k);
      g.value = x >= 0 ? g.value.slice(0, x + 1) : [...g.value, k], w.value = /* @__PURE__ */ new Set(), d.value = null, f.value = null, h.value = null, bn(!0);
    }
    function Ti(k) {
      g.value = k < 0 ? [] : g.value.slice(0, k + 1), w.value = /* @__PURE__ */ new Set(), d.value = null, f.value = null, h.value = null, bn(!0);
    }
    function ts() {
      g.value.length && Ti(g.value.length - 2);
    }
    function tn(k) {
      const x = dd(r.value.nodeById, k);
      !s.value.some((J) => J.id === k) && JSON.stringify(x) !== JSON.stringify(g.value) && (g.value = x, w.value = /* @__PURE__ */ new Set(), bn()), d.value = k, f.value = null, v.value = !1, p.value = !0, We(async () => {
        const J = s.value.find((mt) => mt.id === k);
        if (!J) return;
        const _e = Number(J.dimensions?.width || J.data?.width || 210), ke = Number(J.dimensions?.height || 104), Re = Math.max(q.value.zoom || 1, 0.85);
        try {
          await H(J.position.x + _e / 2, J.position.y + ke / 2, { zoom: Re, duration: 250 });
        } catch (mt) {
          l.value = ge(mt, "Couldn’t center this node. Try Fit view.");
        }
      });
    }
    function Ii(k) {
      const x = k instanceof MouseEvent ? k : k.touches[0];
      return { x: x.clientX, y: x.clientY };
    }
    function Ld(k) {
      if (!i.value || (k.event.preventDefault(), !a.value)) return;
      const x = k.node.id, V = k.node.data?.portalTarget;
      if (V) {
        const { x: st, y: Ai } = Ii(k.event);
        O.value = { x: st, y: Ai, items: [{ label: "Open real node", action: () => tn(V) }] };
        return;
      }
      const J = [], _e = te.value, ke = _e.length > 1 ? _e.map((st) => String(st.id)) : null;
      if (ke) {
        const st = [
          ["Align left", "left"],
          ["Align centers", "center-h"],
          ["Align right", "right"],
          ["Align top", "top"],
          ["Align middles", "center-v"],
          ["Align bottom", "bottom"]
        ];
        for (const [xn, Kd] of st) J.push({ label: xn, action: () => _d(Kd) });
        ke.length > 2 && (J.push({ label: "Distribute horizontally", action: () => Ka("h") }), J.push({ label: "Distribute vertically", action: () => Ka("v") }));
        for (const xn of r.value.childrenByParent.get(be.value || "") || [])
          ke.includes(xn.id) || J.push({ label: `Move into "${xn.name}"`, action: () => uo(ke, xn.id) });
        be.value && J.push({ label: "Move to root", action: () => uo(ke, null) }), J.push({ label: `Delete ${ke.length} nodes`, danger: !0, action: () => {
          d.value = null, lo(ke);
        } });
        const { x: Ai, y: Wd } = Ii(k.event);
        O.value = { x: Ai, y: Wd, items: J };
        return;
      }
      (r.value.childrenByParent.get(x) || []).length > 0 && (J.push({ label: "Drill into", action: () => $n(x) }), J.push({ label: w.value.has(x) ? "Collapse" : "Expand as boundary", action: () => es(x) })), J.push({ label: "Add child", action: () => kd(x) });
      const mt = (r.value.childrenByParent.get(be.value || "") || []).filter((st) => st.id !== x);
      for (const st of mt.slice(0, 8)) J.push({ label: `Move into "${st.name}"`, action: () => uo([x], st.id) });
      r.value.nodeById.get(x)?.parent_id && J.push({ label: "Move to root", action: () => uo([x], null) }), J.push({ label: "Delete", danger: !0, action: () => {
        d.value = null, lo([x]);
      } });
      const { x: qd, y: Xd } = Ii(k.event);
      O.value = { x: qd, y: Xd, items: J };
    }
    function Vd(k) {
      if (!a.value || !i.value) return;
      const x = Y({ x: k.clientX, y: k.clientY }), V = kn(Ye(), be.value, x);
      X(V, null);
    }
    function Hd(k) {
      if (!i.value || (k.preventDefault(), !a.value)) return;
      const x = Y({ x: k.clientX, y: k.clientY }), V = I$({
        viewRoot: be.value,
        nodeTypes: W.value,
        navigateUp: () => ts(),
        addNode: (J) => kn(J ?? Ye(), be.value, x)
      });
      O.value = { x: k.clientX, y: k.clientY, items: V };
    }
    async function ns() {
      if (!i.value || !a.value) return;
      const k = Qb(a.value, b.value, be.value), x = Object.entries(k).map(([V, J]) => Bt(V, J.x, J.y));
      x.length && await Ae(x, !0);
    }
    function Fd() {
      b.value = b.value === "TB" ? "LR" : "TB", ns();
    }
    async function fo(k = { padding: 0.16, duration: 200 }) {
      try {
        await L(k);
      } catch (x) {
        l.value = ge(x, "Couldn’t fit the graph. Try Fit view again.");
      }
    }
    function Ke(k) {
      k.preventDefault(), k.stopPropagation();
    }
    function Gd(k) {
      if (!o.value) return;
      if (qa(k.target)) {
        if (k.key === "Escape") {
          const J = k.target;
          typeof J.blur == "function" && J.blur(), Ke(k);
        }
        return;
      }
      const x = ox({ key: k.key, ctrlKey: k.ctrlKey, metaKey: k.metaKey, altKey: k.altKey, target: k.target }, !!d.value);
      if (x === "rename" && i.value && d.value) {
        Ke(k), X(d.value, k.key.length === 1 ? k.key : null);
        return;
      }
      if (x === "search") {
        Ke(k), K.value?.focus(k.key === "/" ? "" : k.key);
        return;
      }
      const V = nx({ key: k.key, ctrlKey: k.ctrlKey, metaKey: k.metaKey, shiftKey: k.shiftKey, target: k.target });
      !i.value && ["delete", "undo", "redo", "duplicate", "paste"].includes(V || "") || (V === "delete" ? (Ke(k), $i()) : V === "undo" ? (Ke(k), so("undo")) : V === "redo" ? (Ke(k), so("redo")) : V === "duplicate" ? (Ke(k), bd()) : V === "copy" ? yd() : V === "paste" ? (Ke(k), wd()) : V === "fit" ? (Ke(k), fo()) : V === "zoom-selection" ? d.value && (Ke(k), fo({ nodes: [d.value], padding: 0.4, duration: 200, maxZoom: 1.2 })) : V === "escape" && (O.value ? (Ke(k), O.value = null) : d.value || f.value ? (Ke(k), d.value = null, f.value = null) : be.value && (Ke(k), ts())));
    }
    function Yd(k) {
      const x = k.target.value;
      x && (kn(x), k.target.value = "");
    }
    function Ud() {
      v.value = !v.value, v.value && (p.value = !0);
    }
    let Di = [];
    return ot(async () => {
      M = new ResizeObserver(([x]) => {
        if (!x) return;
        const V = x.contentRect.width <= 900;
        V && !C.value && (m.value = !1, p.value = !1), C.value = V;
      }), N.value && M.observe(N.value), await Ei(!0);
      const k = a.value?.thread_id;
      if (k)
        try {
          Di.push(cf(B$(k, z$), () => {
            Ei(!1, !0);
          }));
        } catch {
          l.value = "Live updates are unavailable. Reload to read the latest graph.";
        }
    }), to(() => {
      M?.disconnect();
      const k = [];
      for (const x of Di)
        try {
          x();
        } catch (V) {
          k.push(V);
        }
      if (Di = [], k.length) throw new AggregateError(k, "Couldn’t close live updates.");
    }), (k, x) => (A(), G("div", {
      ref_key: "rootEl",
      ref: N,
      class: Me(["kg", { "kg--preview": !o.value, "kg-connecting": F.value }]),
      tabindex: "0",
      onKeydown: Gd
    }, [
      I("div", ix, [
        I("div", rx, [
          o.value ? (A(), G("button", {
            key: 0,
            class: "kg-icon-btn",
            title: m.value ? "Hide structure" : "Show structure",
            "aria-label": m.value ? "Hide structure" : "Show structure",
            onClick: B
          }, [
            ze(oe(nn), {
              icon: "tabler:layout-sidebar",
              "aria-hidden": "true"
            })
          ], 8, ax)) : de("", !0),
          I("button", {
            class: Me(["kg-crumb", { active: !Ce.value.length }]),
            onClick: x[0] || (x[0] = (V) => Ti(-1))
          }, "Graph", 2),
          (A(!0), G(ye, null, Se(Ce.value, (V, J) => (A(), G(ye, {
            key: V.id
          }, [
            x[26] || (x[26] = I("span", { class: "kg-sep" }, "/", -1)),
            I("button", {
              class: Me(["kg-crumb", { active: J === Ce.value.length - 1 }]),
              onClick: (_e) => Ti(J)
            }, he(V.name), 11, sx)
          ], 64))), 128))
        ]),
        o.value ? (A(), G("div", lx, [
          ze(C$, {
            ref_key: "searchRef",
            ref: K,
            nodes: r.value.nodes,
            "node-by-id": r.value.nodeById,
            "type-defs": Z.value,
            onPick: tn
          }, null, 8, ["nodes", "node-by-id", "type-defs"]),
          x[28] || (x[28] = I("span", { class: "kg-vsep" }, null, -1)),
          i.value ? (A(), G("select", {
            key: 0,
            class: "kg-sel",
            onChange: Yd
          }, [
            x[27] || (x[27] = I("option", {
              value: "",
              disabled: "",
              selected: ""
            }, "+ Node", -1)),
            (A(!0), G(ye, null, Se(W.value, (V) => (A(), G("option", {
              key: V.id,
              value: V.id
            }, he(V.title || V.id), 9, ux))), 128))
          ], 32)) : de("", !0),
          x[29] || (x[29] = I("span", { class: "kg-vsep" }, null, -1)),
          i.value ? (A(), G("button", {
            key: 1,
            class: "kg-icon-btn",
            disabled: !a.value?.can_undo,
            title: "Undo",
            "aria-label": "Undo",
            onClick: x[1] || (x[1] = (V) => so("undo"))
          }, [
            ze(oe(nn), {
              icon: "tabler:arrow-back-up",
              "aria-hidden": "true"
            })
          ], 8, cx)) : de("", !0),
          i.value ? (A(), G("button", {
            key: 2,
            class: "kg-icon-btn",
            disabled: !a.value?.can_redo,
            title: "Redo",
            "aria-label": "Redo",
            onClick: x[2] || (x[2] = (V) => so("redo"))
          }, [
            ze(oe(nn), {
              icon: "tabler:arrow-forward-up",
              "aria-hidden": "true"
            })
          ], 8, dx)) : de("", !0),
          x[30] || (x[30] = I("span", { class: "kg-vsep" }, null, -1)),
          I("button", {
            class: "kg-icon-btn",
            title: "Fit view",
            "aria-label": "Fit view",
            onClick: x[3] || (x[3] = (V) => fo())
          }, [
            ze(oe(nn), {
              icon: "tabler:arrows-maximize",
              "aria-hidden": "true"
            })
          ]),
          i.value ? (A(), G("button", {
            key: 3,
            class: "kg-icon-btn",
            title: "Arrange nodes",
            "aria-label": "Auto layout",
            onClick: ns
          }, [
            ze(oe(nn), {
              icon: "tabler:layout-distribute-horizontal",
              "aria-hidden": "true"
            })
          ])) : de("", !0),
          i.value ? (A(), G("button", {
            key: 4,
            class: "kg-icon-btn",
            title: b.value === "TB" ? "Top→Bottom" : "Left→Right",
            "aria-label": b.value === "TB" ? "Use left-to-right layout" : "Use top-to-bottom layout",
            onClick: Fd
          }, [
            ze(oe(nn), {
              icon: b.value === "TB" ? "tabler:arrows-vertical" : "tabler:arrows-horizontal",
              "aria-hidden": "true"
            }, null, 8, ["icon"])
          ], 8, fx)) : de("", !0),
          x[31] || (x[31] = I("span", { class: "kg-vsep" }, null, -1)),
          i.value ? (A(), G("button", {
            key: 5,
            class: Me(["kg-btn kg-btn--ghost", { active: v.value }]),
            onClick: Ud
          }, "Types", 2)) : de("", !0),
          I("span", hx, he(pe.value.nodes) + " nodes · " + he(pe.value.edges) + " edges", 1)
        ])) : de("", !0)
      ]),
      l.value ? (A(), G("div", px, [
        I("span", null, he(l.value), 1),
        I("button", {
          class: "kg-error-x",
          title: "Dismiss",
          "aria-label": "Dismiss error",
          onClick: x[4] || (x[4] = (V) => l.value = "")
        }, "×")
      ])) : de("", !0),
      I("div", gx, [
        o.value && m.value ? (A(), G("aside", vx, [
          I("div", mx, [
            x[32] || (x[32] = I("span", null, "Structure", -1)),
            I("span", yx, he(r.value.nodes.length), 1)
          ]),
          I("div", wx, [
            (A(!0), G(ye, null, Se($e.value, (V) => (A(), G("div", {
              key: V.node.id,
              class: Me(["kg-tree-row", { active: d.value === V.node.id }]),
              role: "button",
              tabindex: "0",
              style: Oe({ paddingLeft: `${8 + V.depth * 12}px` }),
              onClick: (J) => {
                d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
              },
              onKeydown: [
                Ze((J) => {
                  d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
                }, ["enter"]),
                Ze(Ue((J) => {
                  d.value = V.node.id, f.value = null, v.value = !1, p.value = !0;
                }, ["prevent"]), ["space"])
              ],
              onDblclick: (J) => $n(V.node.id)
            }, [
              V.childCount ? (A(), G("button", {
                key: 0,
                class: "kg-twist",
                "aria-label": V.expanded ? `Collapse ${V.node.name}` : `Expand ${V.node.name}`,
                onClick: Ue((J) => Bd(V.node.id), ["stop"])
              }, he(V.expanded ? "▾" : "▸"), 9, bx)) : (A(), G("span", kx)),
              I("span", {
                class: "kg-tree-dot",
                style: Oe({ background: at(V.node.type) })
              }, null, 4),
              I("span", Ex, he(V.node.name), 1),
              V.childCount ? (A(), G("span", $x, he(V.childCount), 1)) : de("", !0)
            ], 46, _x))), 128)),
            $e.value.length ? de("", !0) : (A(), G("div", xx, "No nodes"))
          ])
        ])) : de("", !0),
        I("main", Sx, [
          ze(oe(vy), {
            id: E,
            nodes: s.value,
            "onUpdate:nodes": x[5] || (x[5] = (V) => s.value = V),
            edges: u.value,
            "onUpdate:edges": x[6] || (x[6] = (V) => u.value = V),
            "node-types": z,
            "nodes-draggable": i.value,
            "nodes-connectable": i.value,
            "elements-selectable": o.value,
            "selection-key-code": "Shift",
            "multi-selection-key-code": "Shift",
            "delete-key-code": null,
            "zoom-on-double-click": !1,
            "snap-to-grid": !0,
            "snap-grid": [10, 10],
            "min-zoom": 0.1,
            "max-zoom": 2.5,
            "connection-radius": 40,
            class: Me(["kg-flow", { "kg-connect-live": F.value }]),
            onPaneDoubleClick: Vd,
            onConnectStart: Ed,
            onConnectEnd: xd,
            onNodeClick: Ad,
            onNodeDoubleClick: Rd,
            onEdgeClick: Od,
            onEdgeDoubleClick: zd,
            onPaneClick: Pd,
            onConnect: $d,
            onNodeDrag: Nd,
            onNodeDragStop: Cd,
            onNodeContextMenu: Ld,
            onPaneContextMenu: Hd
          }, {
            default: ct(() => [
              ze(oe($y), {
                pattern: "dots",
                gap: 22,
                size: 1,
                "pattern-color": "color-mix(in srgb, var(--kg-muted) 30%, transparent)"
              }),
              o.value ? (A(), Ie(oe(t0), {
                key: 0,
                position: "bottom-left",
                "show-interactive": !1
              })) : de("", !0),
              o.value ? (A(), Ie(oe(z_), {
                key: 1,
                position: "bottom-right",
                pannable: !0,
                zoomable: !0
              })) : de("", !0)
            ]),
            _: 1
          }, 8, ["nodes", "edges", "nodes-draggable", "nodes-connectable", "elements-selectable", "class"]),
          Ja.value.length ? (A(), G("div", Nx, [
            (A(!0), G(ye, null, Se(Ja.value, (V) => (A(), G("div", {
              key: V.key,
              class: Me(["kg-guide", { vertical: V.vertical }]),
              style: Oe(V.vertical ? { left: V.left + "px", top: V.top + "px", height: V.length + "px" } : { left: V.left + "px", top: V.top + "px", width: V.length + "px" })
            }, null, 6))), 128))
          ])) : de("", !0),
          a.value && !c.value && !l.value && !s.value.length ? (A(), G("div", Cx, [
            I("div", Mx, [
              I("p", Tx, he(be.value ? "No children here" : "Empty graph"), 1),
              i.value ? (A(), G("button", {
                key: 0,
                class: "kg-btn",
                onClick: x[7] || (x[7] = (V) => kn())
              }, "Add a node")) : de("", !0)
            ])
          ])) : de("", !0),
          i.value ? (A(), G("span", Ix, "Drag a port to connect · / to find")) : de("", !0)
        ]),
        o.value && !p.value ? (A(), G("button", {
          key: 1,
          class: "kg-panel-rail",
          title: "Show inspector",
          "aria-label": "Show inspector",
          onClick: x[8] || (x[8] = (V) => p.value = !0)
        }, "‹")) : o.value ? (A(), G("aside", Dx, [
          v.value ? (A(), Ie(m$, {
            key: 0,
            "node-types": D.value,
            "edge-types": T.value,
            "material-types": R.value,
            onTypeAdd: Md,
            onTypeUpdate: Td,
            onTypeRemove: Id,
            onSeed: Dd,
            onCollapse: x[9] || (x[9] = (V) => p.value = !1),
            onClose: x[10] || (x[10] = (V) => v.value = !1)
          }, null, 8, ["node-types", "edge-types", "material-types"])) : ie.value ? (A(), Ie(pE, {
            key: 1,
            "read-only": !i.value,
            node: ie.value,
            "node-types": D.value,
            "material-types": R.value,
            materials: ie.value.materials || [],
            "has-children": we.value,
            expanded: w.value.has(ie.value.id),
            onUpdate: gd,
            onDelete: $i,
            onMaterialAdd: x[11] || (x[11] = (V) => ie.value && Ni("node", V, ie.value.id)),
            onComponentRefAdd: x[12] || (x[12] = (V) => ie.value && ja("node", V, ie.value.id)),
            onMaterialUpdate: Ci,
            onMaterialRemove: Mi,
            onDrill: x[13] || (x[13] = () => ie.value && $n(ie.value.id)),
            onToggleExpand: x[14] || (x[14] = () => ie.value && es(ie.value.id)),
            onCollapse: x[15] || (x[15] = (V) => p.value = !1),
            onClose: x[16] || (x[16] = (V) => d.value = null)
          }, null, 8, ["read-only", "node", "node-types", "material-types", "materials", "has-children", "expanded"])) : h.value ? (A(), G("div", Ax, [
            I("div", Ox, [
              x[33] || (x[33] = I("span", { class: "kg-kicker" }, "Virtual edge", -1)),
              I("button", {
                class: "kg-x kg-x--chev",
                title: "Hide inspector",
                "aria-label": "Hide inspector",
                onClick: x[17] || (x[17] = (V) => p.value = !1)
              }, "»"),
              I("button", {
                class: "kg-x",
                title: "Close",
                "aria-label": "Close",
                onClick: x[18] || (x[18] = (V) => h.value = null)
              }, "×")
            ]),
            I("div", Px, "Summarizes " + he(h.value.count) + " relation" + he(h.value.count === 1 ? "" : "s") + " hidden by the current layer. Double-click the edge to jump to where they live.", 1),
            x[35] || (x[35] = I("div", { class: "kg-section-head" }, [
              I("span", null, "Underlying relations")
            ], -1)),
            I("div", Rx, [
              (A(!0), G(ye, null, Se(h.value.members, (V) => (A(), G("button", {
                key: V.id,
                class: "kg-agg-row",
                title: "Jump to " + V.source,
                onClick: (J) => tn(V.sourceId)
              }, [
                I("span", Bx, [
                  Pt(he(V.source) + " ", 1),
                  x[34] || (x[34] = I("span", { class: "kg-agg-arrow" }, "→", -1)),
                  Pt(" " + he(V.target), 1)
                ]),
                I("span", Lx, he(V.label || V.type), 1)
              ], 8, zx))), 128))
            ])
          ])) : se.value ? (A(), Ie(YE, {
            key: 3,
            "read-only": !i.value,
            edge: se.value,
            "edge-types": T.value,
            "material-types": R.value,
            materials: se.value.materials || [],
            "source-name": r.value.nodeById.get(se.value.source_id)?.name,
            "target-name": r.value.nodeById.get(se.value.target_id)?.name,
            onUpdate: vd,
            onReverse: md,
            onDelete: $i,
            onMaterialAdd: x[19] || (x[19] = (V) => se.value && Ni("edge", V, se.value.id)),
            onComponentRefAdd: x[20] || (x[20] = (V) => se.value && ja("edge", V, se.value.id)),
            onMaterialUpdate: Ci,
            onMaterialRemove: Mi,
            onCollapse: x[21] || (x[21] = (V) => p.value = !1),
            onClose: x[22] || (x[22] = (V) => f.value = null)
          }, null, 8, ["read-only", "edge", "edge-types", "material-types", "materials", "source-name", "target-name"])) : (A(), G("div", Vx, [
            I("div", Hx, [
              x[36] || (x[36] = I("span", { class: "kg-panel-title" }, "Graph", -1)),
              I("button", {
                class: "kg-x kg-x--chev",
                title: "Hide inspector",
                "aria-label": "Hide inspector",
                onClick: x[23] || (x[23] = (V) => p.value = !1)
              }, "»")
            ]),
            I("div", Fx, [
              I("span", null, he(pe.value.nodes) + " nodes", 1),
              I("span", null, he(pe.value.edges) + " edges", 1),
              I("span", null, he(re.value.length) + " materials", 1)
            ]),
            I("div", Gx, [
              x[37] || (x[37] = I("span", null, "Graph materials", -1)),
              i.value ? (A(), G("button", {
                key: 0,
                class: "kg-mini",
                "aria-label": "Add graph material",
                onClick: x[24] || (x[24] = (V) => Ni("graph", bi("graph")))
              }, "+")) : de("", !0)
            ]),
            i.value ? (A(), G("div", Yx, [
              (A(!0), G(ye, null, Se(re.value, (V) => (A(), Ie(Ua, {
                key: V.id,
                material: V,
                "material-types": R.value,
                expanded: le.value.has(V.id),
                onToggle: (J) => ve(V.id),
                onUpdate: (J) => Ci({ id: V.id, patch: J }),
                onRemove: (J) => Mi(V.id)
              }, null, 8, ["material", "material-types", "expanded", "onToggle", "onUpdate", "onRemove"]))), 128)),
              re.value.length ? de("", !0) : (A(), G("div", Ux, "no graph materials"))
            ])) : de("", !0)
          ]))
        ])) : de("", !0)
      ]),
      O.value ? (A(), Ie(T$, {
        key: 1,
        x: O.value.x,
        y: O.value.y,
        items: O.value.items,
        onClose: x[25] || (x[25] = (V) => O.value = null)
      }, null, 8, ["x", "y", "items"])) : de("", !0)
    ], 34));
  }
}), jx = {
  rootComponent: qx
};
export {
  jx as mountConfig
};
//# sourceMappingURL=lazy-mount-C1QiUI1k.js.map
