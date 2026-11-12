import { getCurrentScope as ls, inject as Vt, effectScope as us, watch as Ne, provide as Ot, getCurrentInstance as en, defineComponent as Se, createPropsRestProxy as ul, toRef as Ee, ref as be, computed as ce, onMounted as rt, openBlock as L, createElementBlock as te, normalizeClass as Be, unref as K, renderSlot as Te, useSlots as cs, onUnmounted as cl, createVNode as ze, withCtx as et, reactive as dl, onScopeDispose as Zn, nextTick as Ye, onBeforeMount as fl, shallowRef as $t, createElementVNode as W, Fragment as Ae, renderList as nt, normalizeStyle as Re, onBeforeUnmount as Eo, isMemoSame as hl, createBlock as De, createCommentVNode as me, toDisplayString as ke, isRef as ki, toRefs as vl, customRef as pl, toValue as we, resolveComponent as ds, h as xe, useAttrs as Mi, mergeProps as io, resolveDynamicComponent as Nt, createTextVNode as qn, markRaw as dn, readonly as gl, watchEffect as ml, normalizeProps as yl, withModifiers as Fo } from "vue";
import { a as _l } from "./wc-runtime-CNDpK4lj.js";
import { on as wl, api as Ji } from "@wippy-fe/proxy";
function pn(e) {
  return ls() ? (Zn(e), !0) : !1;
}
function ct(e) {
  return typeof e == "function" ? e() : K(e);
}
const bl = typeof window < "u" && typeof document < "u", $l = (e) => typeof e < "u", El = Object.prototype.toString, xl = (e) => El.call(e) === "[object Object]", Sl = () => {
};
function Nl(e, t) {
  function n(...o) {
    return new Promise((i, r) => {
      Promise.resolve(e(() => t.apply(this, o), { fn: t, thisArg: this, args: o })).then(i).catch(r);
    });
  }
  return n;
}
const fs = (e) => e();
function Cl(e = fs) {
  const t = be(!0);
  function n() {
    t.value = !1;
  }
  function o() {
    t.value = !0;
  }
  const i = (...r) => {
    t.value && e(...r);
  };
  return { isActive: gl(t), pause: n, resume: o, eventFilter: i };
}
function ji(e, t = !1, n = "Timeout") {
  return new Promise((o, i) => {
    setTimeout(t ? () => i(n) : o, e);
  });
}
function kl(e, t, n = {}) {
  const {
    eventFilter: o = fs,
    ...i
  } = n;
  return Ne(
    e,
    Nl(
      o,
      t
    ),
    i
  );
}
function Ht(e, t, n = {}) {
  const {
    eventFilter: o,
    ...i
  } = n, { eventFilter: r, pause: s, resume: a, isActive: l } = Cl(o);
  return { stop: kl(
    e,
    t,
    {
      ...i,
      eventFilter: r
    }
  ), pause: s, resume: a, isActive: l };
}
function Ml(e, t = {}) {
  if (!ki(e))
    return vl(e);
  const n = Array.isArray(e.value) ? Array.from({ length: e.value.length }) : {};
  for (const o in e.value)
    n[o] = pl(() => ({
      get() {
        return e.value[o];
      },
      set(i) {
        var r;
        if ((r = ct(t.replaceRef)) != null ? r : !0)
          if (Array.isArray(e.value)) {
            const a = [...e.value];
            a[o] = i, e.value = a;
          } else {
            const a = { ...e.value, [o]: i };
            Object.setPrototypeOf(a, Object.getPrototypeOf(e.value)), e.value = a;
          }
        else
          e.value[o] = i;
      }
    }));
  return n;
}
function ii(e, t = !1) {
  function n(d, { flush: h = "sync", deep: v = !1, timeout: E, throwOnTimeout: b } = {}) {
    let S = null;
    const P = [new Promise((y) => {
      S = Ne(
        e,
        (x) => {
          d(x) !== t && (S?.(), y(x));
        },
        {
          flush: h,
          deep: v,
          immediate: !0
        }
      );
    })];
    return E != null && P.push(
      ji(E, b).then(() => ct(e)).finally(() => S?.())
    ), Promise.race(P);
  }
  function o(d, h) {
    if (!ki(d))
      return n((x) => x === d, h);
    const { flush: v = "sync", deep: E = !1, timeout: b, throwOnTimeout: S } = h ?? {};
    let _ = null;
    const y = [new Promise((x) => {
      _ = Ne(
        [e, d],
        ([R, Y]) => {
          t !== (R === Y) && (_?.(), x(R));
        },
        {
          flush: v,
          deep: E,
          immediate: !0
        }
      );
    })];
    return b != null && y.push(
      ji(b, S).then(() => ct(e)).finally(() => (_?.(), ct(e)))
    ), Promise.race(y);
  }
  function i(d) {
    return n((h) => !!h, d);
  }
  function r(d) {
    return o(null, d);
  }
  function s(d) {
    return o(void 0, d);
  }
  function a(d) {
    return n(Number.isNaN, d);
  }
  function l(d, h) {
    return n((v) => {
      const E = Array.from(v);
      return E.includes(d) || E.includes(ct(d));
    }, h);
  }
  function u(d) {
    return c(1, d);
  }
  function c(d = 1, h) {
    let v = -1;
    return n(() => (v += 1, v >= d), h);
  }
  return Array.isArray(ct(e)) ? {
    toMatch: n,
    toContains: l,
    changed: u,
    changedTimes: c,
    get not() {
      return ii(e, !t);
    }
  } : {
    toMatch: n,
    toBe: o,
    toBeTruthy: i,
    toBeNull: r,
    toBeNaN: a,
    toBeUndefined: s,
    changed: u,
    changedTimes: c,
    get not() {
      return ii(e, !t);
    }
  };
}
function ri(e) {
  return ii(e);
}
function Tl(e) {
  var t;
  const n = ct(e);
  return (t = n?.$el) != null ? t : n;
}
const hs = bl ? window : void 0;
function vs(...e) {
  let t, n, o, i;
  if (typeof e[0] == "string" || Array.isArray(e[0]) ? ([n, o, i] = e, t = hs) : [t, n, o, i] = e, !t)
    return Sl;
  Array.isArray(n) || (n = [n]), Array.isArray(o) || (o = [o]);
  const r = [], s = () => {
    r.forEach((c) => c()), r.length = 0;
  }, a = (c, d, h, v) => (c.addEventListener(d, h, v), () => c.removeEventListener(d, h, v)), l = Ne(
    () => [Tl(t), ct(i)],
    ([c, d]) => {
      if (s(), !c)
        return;
      const h = xl(d) ? { ...d } : d;
      r.push(
        ...n.flatMap((v) => o.map((E) => a(c, v, E, h)))
      );
    },
    { immediate: !0, flush: "post" }
  ), u = () => {
    l(), s();
  };
  return pn(u), u;
}
function Dl(e) {
  return typeof e == "function" ? e : typeof e == "string" ? (t) => t.key === e : Array.isArray(e) ? (t) => e.includes(t.key) : () => !0;
}
function er(...e) {
  let t, n, o = {};
  e.length === 3 ? (t = e[0], n = e[1], o = e[2]) : e.length === 2 ? typeof e[1] == "object" ? (t = !0, n = e[0], o = e[1]) : (t = e[0], n = e[1]) : (t = !0, n = e[0]);
  const {
    target: i = hs,
    eventName: r = "keydown",
    passive: s = !1,
    dedupe: a = !1
  } = o, l = Dl(t);
  return vs(i, r, (c) => {
    c.repeat && ct(a) || l(c) && n(c);
  }, s);
}
function Il(e) {
  return JSON.parse(JSON.stringify(e));
}
function Yo(e, t, n, o = {}) {
  var i, r, s;
  const {
    clone: a = !1,
    passive: l = !1,
    eventName: u,
    deep: c = !1,
    defaultValue: d,
    shouldEmit: h
  } = o, v = en(), E = n || v?.emit || ((i = v?.$emit) == null ? void 0 : i.bind(v)) || ((s = (r = v?.proxy) == null ? void 0 : r.$emit) == null ? void 0 : s.bind(v?.proxy));
  let b = u;
  t || (t = "modelValue"), b = b || `update:${t.toString()}`;
  const S = (y) => a ? typeof a == "function" ? a(y) : Il(y) : y, _ = () => $l(e[t]) ? S(e[t]) : d, P = (y) => {
    h ? h(y) && E(b, y) : E(b, y);
  };
  if (l) {
    const y = _(), x = be(y);
    let R = !1;
    return Ne(
      () => e[t],
      (Y) => {
        R || (R = !0, x.value = S(Y), Ye(() => R = !1));
      }
    ), Ne(
      x,
      (Y) => {
        !R && (Y !== e[t] || c) && P(Y);
      },
      { deep: c }
    ), x;
  } else
    return ce({
      get() {
        return _();
      },
      set(y) {
        P(y);
      }
    });
}
var Al = { value: () => {
} };
function xo() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o))
      throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new Wn(n);
}
function Wn(e) {
  this._ = e;
}
function Pl(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n))
      throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
Wn.prototype = xo.prototype = {
  constructor: Wn,
  on: function(e, t) {
    var n = this._, o = Pl(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; )
        if ((i = (e = o[r]).type) && (i = Ol(n[i], e.name)))
          return i;
      return;
    }
    if (t != null && typeof t != "function")
      throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type)
        n[i] = tr(n[i], e.name, t);
      else if (t == null)
        for (i in n)
          n[i] = tr(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t)
      e[n] = t[n].slice();
    return new Wn(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0)
      for (var n = new Array(i), o = 0, i, r; o < i; ++o)
        n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o)
      r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e))
      throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i)
      o[i].value.apply(t, n);
  }
};
function Ol(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function tr(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = Al, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var si = "http://www.w3.org/1999/xhtml";
const nr = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: si,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function So(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), nr.hasOwnProperty(t) ? { space: nr[t], local: e } : e;
}
function zl(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === si && t.documentElement.namespaceURI === si ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function Rl(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function ps(e) {
  var t = So(e);
  return (t.local ? Rl : zl)(t);
}
function Bl() {
}
function Ti(e) {
  return e == null ? Bl : function() {
    return this.querySelector(e);
  };
}
function Ll(e) {
  typeof e != "function" && (e = Ti(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = new Array(s), l, u, c = 0; c < s; ++c)
      (l = r[c]) && (u = e.call(l, l.__data__, c, r)) && ("__data__" in l && (u.__data__ = l.__data__), a[c] = u);
  return new Ue(o, this._parents);
}
function Vl(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function Hl() {
  return [];
}
function gs(e) {
  return e == null ? Hl : function() {
    return this.querySelectorAll(e);
  };
}
function Fl(e) {
  return function() {
    return Vl(e.apply(this, arguments));
  };
}
function Yl(e) {
  typeof e == "function" ? e = Fl(e) : e = gs(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && (o.push(e.call(l, l.__data__, u, s)), i.push(l));
  return new Ue(o, i);
}
function ms(e) {
  return function() {
    return this.matches(e);
  };
}
function ys(e) {
  return function(t) {
    return t.matches(e);
  };
}
var Ul = Array.prototype.find;
function Xl(e) {
  return function() {
    return Ul.call(this.children, e);
  };
}
function Gl() {
  return this.firstElementChild;
}
function Zl(e) {
  return this.select(e == null ? Gl : Xl(typeof e == "function" ? e : ys(e)));
}
var ql = Array.prototype.filter;
function Wl() {
  return Array.from(this.children);
}
function Kl(e) {
  return function() {
    return ql.call(this.children, e);
  };
}
function Ql(e) {
  return this.selectAll(e == null ? Wl : Kl(typeof e == "function" ? e : ys(e)));
}
function Jl(e) {
  typeof e != "function" && (e = ms(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new Ue(o, this._parents);
}
function _s(e) {
  return new Array(e.length);
}
function jl() {
  return new Ue(this._enter || this._groups.map(_s), this._parents);
}
function ro(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
ro.prototype = {
  constructor: ro,
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
function eu(e) {
  return function() {
    return e;
  };
}
function tu(e, t, n, o, i, r) {
  for (var s = 0, a, l = t.length, u = r.length; s < u; ++s)
    (a = t[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new ro(e, r[s]);
  for (; s < l; ++s)
    (a = t[s]) && (i[s] = a);
}
function nu(e, t, n, o, i, r, s) {
  var a, l, u = /* @__PURE__ */ new Map(), c = t.length, d = r.length, h = new Array(c), v;
  for (a = 0; a < c; ++a)
    (l = t[a]) && (h[a] = v = s.call(l, l.__data__, a, t) + "", u.has(v) ? i[a] = l : u.set(v, l));
  for (a = 0; a < d; ++a)
    v = s.call(e, r[a], a, r) + "", (l = u.get(v)) ? (o[a] = l, l.__data__ = r[a], u.delete(v)) : n[a] = new ro(e, r[a]);
  for (a = 0; a < c; ++a)
    (l = t[a]) && u.get(h[a]) === l && (i[a] = l);
}
function ou(e) {
  return e.__data__;
}
function iu(e, t) {
  if (!arguments.length)
    return Array.from(this, ou);
  var n = t ? nu : tu, o = this._parents, i = this._groups;
  typeof e != "function" && (e = eu(e));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], d = i[u], h = d.length, v = ru(e.call(c, c && c.__data__, u, o)), E = v.length, b = a[u] = new Array(E), S = s[u] = new Array(E), _ = l[u] = new Array(h);
    n(c, d, b, S, _, v, t);
    for (var P = 0, y = 0, x, R; P < E; ++P)
      if (x = b[P]) {
        for (P >= y && (y = P + 1); !(R = S[y]) && ++y < E; )
          ;
        x._next = R || null;
      }
  }
  return s = new Ue(s, o), s._enter = a, s._exit = l, s;
}
function ru(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function su() {
  return new Ue(this._exit || this._groups.map(_s), this._parents);
}
function au(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function lu(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var u = n[l], c = o[l], d = u.length, h = a[l] = new Array(d), v, E = 0; E < d; ++E)
      (v = u[E] || c[E]) && (h[E] = v);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Ue(a, this._parents);
}
function uu() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function cu(e) {
  e || (e = du);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), u, c = 0; c < a; ++c)
      (u = s[c]) && (l[c] = u);
    l.sort(t);
  }
  return new Ue(i, this._parents).order();
}
function du(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function fu() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function hu() {
  return Array.from(this);
}
function vu() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s)
        return s;
    }
  return null;
}
function pu() {
  let e = 0;
  for (const t of this)
    ++e;
  return e;
}
function gu() {
  return !this.node();
}
function mu(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && e.call(a, a.__data__, r, i);
  return this;
}
function yu(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function _u(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function wu(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function bu(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function $u(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function Eu(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function xu(e, t) {
  var n = So(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? _u : yu : typeof t == "function" ? n.local ? Eu : $u : n.local ? bu : wu)(n, t));
}
function ws(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function Su(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Nu(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function Cu(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function ku(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? Su : typeof t == "function" ? Cu : Nu)(e, t, n ?? "")) : Zt(this.node(), e);
}
function Zt(e, t) {
  return e.style.getPropertyValue(t) || ws(e).getComputedStyle(e, null).getPropertyValue(t);
}
function Mu(e) {
  return function() {
    delete this[e];
  };
}
function Tu(e, t) {
  return function() {
    this[e] = t;
  };
}
function Du(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function Iu(e, t) {
  return arguments.length > 1 ? this.each((t == null ? Mu : typeof t == "function" ? Du : Tu)(e, t)) : this.node()[e];
}
function bs(e) {
  return e.trim().split(/^|\s+/);
}
function Di(e) {
  return e.classList || new $s(e);
}
function $s(e) {
  this._node = e, this._names = bs(e.getAttribute("class") || "");
}
$s.prototype = {
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
function Es(e, t) {
  for (var n = Di(e), o = -1, i = t.length; ++o < i; )
    n.add(t[o]);
}
function xs(e, t) {
  for (var n = Di(e), o = -1, i = t.length; ++o < i; )
    n.remove(t[o]);
}
function Au(e) {
  return function() {
    Es(this, e);
  };
}
function Pu(e) {
  return function() {
    xs(this, e);
  };
}
function Ou(e, t) {
  return function() {
    (t.apply(this, arguments) ? Es : xs)(this, e);
  };
}
function zu(e, t) {
  var n = bs(e + "");
  if (arguments.length < 2) {
    for (var o = Di(this.node()), i = -1, r = n.length; ++i < r; )
      if (!o.contains(n[i]))
        return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? Ou : t ? Au : Pu)(n, t));
}
function Ru() {
  this.textContent = "";
}
function Bu(e) {
  return function() {
    this.textContent = e;
  };
}
function Lu(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function Vu(e) {
  return arguments.length ? this.each(e == null ? Ru : (typeof e == "function" ? Lu : Bu)(e)) : this.node().textContent;
}
function Hu() {
  this.innerHTML = "";
}
function Fu(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Yu(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function Uu(e) {
  return arguments.length ? this.each(e == null ? Hu : (typeof e == "function" ? Yu : Fu)(e)) : this.node().innerHTML;
}
function Xu() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Gu() {
  return this.each(Xu);
}
function Zu() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function qu() {
  return this.each(Zu);
}
function Wu(e) {
  var t = typeof e == "function" ? e : ps(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Ku() {
  return null;
}
function Qu(e, t) {
  var n = typeof e == "function" ? e : ps(e), o = t == null ? Ku : typeof t == "function" ? t : Ti(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Ju() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function ju() {
  return this.each(Ju);
}
function ec() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function tc() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function nc(e) {
  return this.select(e ? tc : ec);
}
function oc(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function ic(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function rc(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function sc(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function ac(e, t, n) {
  return function() {
    var o = this.__on, i, r = ic(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function lc(e, t, n) {
  var o = rc(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, u = a.length, c; l < u; ++l)
        for (i = 0, c = a[l]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = t ? ac : sc, i = 0; i < r; ++i)
    this.each(a(o[i], t, n));
  return this;
}
function Ss(e, t, n) {
  var o = ws(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function uc(e, t) {
  return function() {
    return Ss(this, e, t);
  };
}
function cc(e, t) {
  return function() {
    return Ss(this, e, t.apply(this, arguments));
  };
}
function dc(e, t) {
  return this.each((typeof t == "function" ? cc : uc)(e, t));
}
function* fc() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Ns = [null];
function Ue(e, t) {
  this._groups = e, this._parents = t;
}
function kn() {
  return new Ue([[document.documentElement]], Ns);
}
function hc() {
  return this;
}
Ue.prototype = kn.prototype = {
  constructor: Ue,
  select: Ll,
  selectAll: Yl,
  selectChild: Zl,
  selectChildren: Ql,
  filter: Jl,
  data: iu,
  enter: jl,
  exit: su,
  join: au,
  merge: lu,
  selection: hc,
  order: uu,
  sort: cu,
  call: fu,
  nodes: hu,
  node: vu,
  size: pu,
  empty: gu,
  each: mu,
  attr: xu,
  style: ku,
  property: Iu,
  classed: zu,
  text: Vu,
  html: Uu,
  raise: Gu,
  lower: qu,
  append: Wu,
  insert: Qu,
  remove: ju,
  clone: nc,
  datum: oc,
  on: lc,
  dispatch: dc,
  [Symbol.iterator]: fc
};
function Ze(e) {
  return typeof e == "string" ? new Ue([[document.querySelector(e)]], [document.documentElement]) : new Ue([[e]], Ns);
}
function vc(e) {
  let t;
  for (; t = e.sourceEvent; )
    e = t;
  return e;
}
function Je(e, t) {
  if (e = vc(e), t === void 0 && (t = e.currentTarget), t) {
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
const pc = { passive: !1 }, gn = { capture: !0, passive: !1 };
function Uo(e) {
  e.stopImmediatePropagation();
}
function Yt(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Cs(e) {
  var t = e.document.documentElement, n = Ze(e).on("dragstart.drag", Yt, gn);
  "onselectstart" in t ? n.on("selectstart.drag", Yt, gn) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function ks(e, t) {
  var n = e.document.documentElement, o = Ze(e).on("dragstart.drag", null);
  t && (o.on("click.drag", Yt, gn), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
const An = (e) => () => e;
function ai(e, {
  sourceEvent: t,
  subject: n,
  target: o,
  identifier: i,
  active: r,
  x: s,
  y: a,
  dx: l,
  dy: u,
  dispatch: c
}) {
  Object.defineProperties(this, {
    type: { value: e, enumerable: !0, configurable: !0 },
    sourceEvent: { value: t, enumerable: !0, configurable: !0 },
    subject: { value: n, enumerable: !0, configurable: !0 },
    target: { value: o, enumerable: !0, configurable: !0 },
    identifier: { value: i, enumerable: !0, configurable: !0 },
    active: { value: r, enumerable: !0, configurable: !0 },
    x: { value: s, enumerable: !0, configurable: !0 },
    y: { value: a, enumerable: !0, configurable: !0 },
    dx: { value: l, enumerable: !0, configurable: !0 },
    dy: { value: u, enumerable: !0, configurable: !0 },
    _: { value: c }
  });
}
ai.prototype.on = function() {
  var e = this._.on.apply(this._, arguments);
  return e === this._ ? this : e;
};
function gc(e) {
  return !e.ctrlKey && !e.button;
}
function mc() {
  return this.parentNode;
}
function yc(e, t) {
  return t ?? { x: e.x, y: e.y };
}
function _c() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function wc() {
  var e = gc, t = mc, n = yc, o = _c, i = {}, r = xo("start", "drag", "end"), s = 0, a, l, u, c, d = 0;
  function h(x) {
    x.on("mousedown.drag", v).filter(o).on("touchstart.drag", S).on("touchmove.drag", _, pc).on("touchend.drag touchcancel.drag", P).style("touch-action", "none").style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  function v(x, R) {
    if (!(c || !e.call(this, x, R))) {
      var Y = y(this, t.call(this, x, R), x, R, "mouse");
      Y && (Ze(x.view).on("mousemove.drag", E, gn).on("mouseup.drag", b, gn), Cs(x.view), Uo(x), u = !1, a = x.clientX, l = x.clientY, Y("start", x));
    }
  }
  function E(x) {
    if (Yt(x), !u) {
      var R = x.clientX - a, Y = x.clientY - l;
      u = R * R + Y * Y > d;
    }
    i.mouse("drag", x);
  }
  function b(x) {
    Ze(x.view).on("mousemove.drag mouseup.drag", null), ks(x.view, u), Yt(x), i.mouse("end", x);
  }
  function S(x, R) {
    if (e.call(this, x, R)) {
      var Y = x.changedTouches, V = t.call(this, x, R), U = Y.length, ie, H;
      for (ie = 0; ie < U; ++ie)
        (H = y(this, V, x, R, Y[ie].identifier, Y[ie])) && (Uo(x), H("start", x, Y[ie]));
    }
  }
  function _(x) {
    var R = x.changedTouches, Y = R.length, V, U;
    for (V = 0; V < Y; ++V)
      (U = i[R[V].identifier]) && (Yt(x), U("drag", x, R[V]));
  }
  function P(x) {
    var R = x.changedTouches, Y = R.length, V, U;
    for (c && clearTimeout(c), c = setTimeout(function() {
      c = null;
    }, 500), V = 0; V < Y; ++V)
      (U = i[R[V].identifier]) && (Uo(x), U("end", x, R[V]));
  }
  function y(x, R, Y, V, U, ie) {
    var H = r.copy(), X = Je(ie || Y, R), k, oe, f;
    if ((f = n.call(x, new ai("beforestart", {
      sourceEvent: Y,
      target: h,
      identifier: U,
      active: s,
      x: X[0],
      y: X[1],
      dx: 0,
      dy: 0,
      dispatch: H
    }), V)) != null)
      return k = f.x - X[0] || 0, oe = f.y - X[1] || 0, function N(p, D, C) {
        var O = X, T;
        switch (p) {
          case "start":
            i[U] = N, T = s++;
            break;
          case "end":
            delete i[U], --s;
          case "drag":
            X = Je(C || D, R), T = s;
            break;
        }
        H.call(
          p,
          x,
          new ai(p, {
            sourceEvent: D,
            subject: f,
            target: h,
            identifier: U,
            active: T,
            x: X[0] + k,
            y: X[1] + oe,
            dx: X[0] - O[0],
            dy: X[1] - O[1],
            dispatch: H
          }),
          V
        );
      };
  }
  return h.filter = function(x) {
    return arguments.length ? (e = typeof x == "function" ? x : An(!!x), h) : e;
  }, h.container = function(x) {
    return arguments.length ? (t = typeof x == "function" ? x : An(x), h) : t;
  }, h.subject = function(x) {
    return arguments.length ? (n = typeof x == "function" ? x : An(x), h) : n;
  }, h.touchable = function(x) {
    return arguments.length ? (o = typeof x == "function" ? x : An(!!x), h) : o;
  }, h.on = function() {
    var x = r.on.apply(r, arguments);
    return x === r ? h : x;
  }, h.clickDistance = function(x) {
    return arguments.length ? (d = (x = +x) * x, h) : Math.sqrt(d);
  }, h;
}
function Ii(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ms(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t)
    n[o] = t[o];
  return n;
}
function Mn() {
}
var mn = 0.7, so = 1 / mn, Ut = "\\s*([+-]?\\d+)\\s*", yn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", ot = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", bc = /^#([0-9a-f]{3,8})$/, $c = new RegExp(`^rgb\\(${Ut},${Ut},${Ut}\\)$`), Ec = new RegExp(`^rgb\\(${ot},${ot},${ot}\\)$`), xc = new RegExp(`^rgba\\(${Ut},${Ut},${Ut},${yn}\\)$`), Sc = new RegExp(`^rgba\\(${ot},${ot},${ot},${yn}\\)$`), Nc = new RegExp(`^hsl\\(${yn},${ot},${ot}\\)$`), Cc = new RegExp(`^hsla\\(${yn},${ot},${ot},${yn}\\)$`), or = {
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
Ii(Mn, zt, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: ir,
  // Deprecated! Use color.formatHex.
  formatHex: ir,
  formatHex8: kc,
  formatHsl: Mc,
  formatRgb: rr,
  toString: rr
});
function ir() {
  return this.rgb().formatHex();
}
function kc() {
  return this.rgb().formatHex8();
}
function Mc() {
  return Ts(this).formatHsl();
}
function rr() {
  return this.rgb().formatRgb();
}
function zt(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = bc.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? sr(t) : n === 3 ? new He(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Pn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Pn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = $c.exec(e)) ? new He(t[1], t[2], t[3], 1) : (t = Ec.exec(e)) ? new He(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = xc.exec(e)) ? Pn(t[1], t[2], t[3], t[4]) : (t = Sc.exec(e)) ? Pn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = Nc.exec(e)) ? ur(t[1], t[2] / 100, t[3] / 100, 1) : (t = Cc.exec(e)) ? ur(t[1], t[2] / 100, t[3] / 100, t[4]) : or.hasOwnProperty(e) ? sr(or[e]) : e === "transparent" ? new He(NaN, NaN, NaN, 0) : null;
}
function sr(e) {
  return new He(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Pn(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new He(e, t, n, o);
}
function Tc(e) {
  return e instanceof Mn || (e = zt(e)), e ? (e = e.rgb(), new He(e.r, e.g, e.b, e.opacity)) : new He();
}
function li(e, t, n, o) {
  return arguments.length === 1 ? Tc(e) : new He(e, t, n, o ?? 1);
}
function He(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Ii(He, li, Ms(Mn, {
  brighter(e) {
    return e = e == null ? so : Math.pow(so, e), new He(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? mn : Math.pow(mn, e), new He(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new He(It(this.r), It(this.g), It(this.b), ao(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: ar,
  // Deprecated! Use color.formatHex.
  formatHex: ar,
  formatHex8: Dc,
  formatRgb: lr,
  toString: lr
}));
function ar() {
  return `#${Tt(this.r)}${Tt(this.g)}${Tt(this.b)}`;
}
function Dc() {
  return `#${Tt(this.r)}${Tt(this.g)}${Tt(this.b)}${Tt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function lr() {
  const e = ao(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${It(this.r)}, ${It(this.g)}, ${It(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function ao(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function It(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Tt(e) {
  return e = It(e), (e < 16 ? "0" : "") + e.toString(16);
}
function ur(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new qe(e, t, n, o);
}
function Ts(e) {
  if (e instanceof qe)
    return new qe(e.h, e.s, e.l, e.opacity);
  if (e instanceof Mn || (e = zt(e)), !e)
    return new qe();
  if (e instanceof qe)
    return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (t === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new qe(s, a, l, e.opacity);
}
function Ic(e, t, n, o) {
  return arguments.length === 1 ? Ts(e) : new qe(e, t, n, o ?? 1);
}
function qe(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Ii(qe, Ic, Ms(Mn, {
  brighter(e) {
    return e = e == null ? so : Math.pow(so, e), new qe(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? mn : Math.pow(mn, e), new qe(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new He(
      Xo(e >= 240 ? e - 240 : e + 120, i, o),
      Xo(e, i, o),
      Xo(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new qe(cr(this.h), On(this.s), On(this.l), ao(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = ao(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${cr(this.h)}, ${On(this.s) * 100}%, ${On(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function cr(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function On(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function Xo(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Ai = (e) => () => e;
function Ac(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function Pc(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function Oc(e) {
  return (e = +e) == 1 ? Ds : function(t, n) {
    return n - t ? Pc(t, n, e) : Ai(isNaN(t) ? n : t);
  };
}
function Ds(e, t) {
  var n = t - e;
  return n ? Ac(e, n) : Ai(isNaN(e) ? t : e);
}
const lo = (function e(t) {
  var n = Oc(t);
  function o(i, r) {
    var s = n((i = li(i)).r, (r = li(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), u = Ds(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = a(c), i.b = l(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function zc(e, t) {
  t || (t = []);
  var n = e ? Math.min(t.length, e.length) : 0, o = t.slice(), i;
  return function(r) {
    for (i = 0; i < n; ++i)
      o[i] = e[i] * (1 - r) + t[i] * r;
    return o;
  };
}
function Rc(e) {
  return ArrayBuffer.isView(e) && !(e instanceof DataView);
}
function Bc(e, t) {
  var n = t ? t.length : 0, o = e ? Math.min(n, e.length) : 0, i = new Array(o), r = new Array(n), s;
  for (s = 0; s < o; ++s)
    i[s] = fn(e[s], t[s]);
  for (; s < n; ++s)
    r[s] = t[s];
  return function(a) {
    for (s = 0; s < o; ++s)
      r[s] = i[s](a);
    return r;
  };
}
function Lc(e, t) {
  var n = /* @__PURE__ */ new Date();
  return e = +e, t = +t, function(o) {
    return n.setTime(e * (1 - o) + t * o), n;
  };
}
function je(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
function Vc(e, t) {
  var n = {}, o = {}, i;
  (e === null || typeof e != "object") && (e = {}), (t === null || typeof t != "object") && (t = {});
  for (i in t)
    i in e ? n[i] = fn(e[i], t[i]) : o[i] = t[i];
  return function(r) {
    for (i in n)
      o[i] = n[i](r);
    return o;
  };
}
var ui = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, Go = new RegExp(ui.source, "g");
function Hc(e) {
  return function() {
    return e;
  };
}
function Fc(e) {
  return function(t) {
    return e(t) + "";
  };
}
function Is(e, t) {
  var n = ui.lastIndex = Go.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (o = ui.exec(e)) && (i = Go.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: je(o, i) })), n = Go.lastIndex;
  return n < t.length && (r = t.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? Fc(l[0].x) : Hc(t) : (t = l.length, function(u) {
    for (var c = 0, d; c < t; ++c)
      a[(d = l[c]).i] = d.x(u);
    return a.join("");
  });
}
function fn(e, t) {
  var n = typeof t, o;
  return t == null || n === "boolean" ? Ai(t) : (n === "number" ? je : n === "string" ? (o = zt(t)) ? (t = o, lo) : Is : t instanceof zt ? lo : t instanceof Date ? Lc : Rc(t) ? zc : Array.isArray(t) ? Bc : typeof t.valueOf != "function" && typeof t.toString != "function" || isNaN(t) ? Vc : je)(e, t);
}
var dr = 180 / Math.PI, ci = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function As(e, t, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * dr,
    skewX: Math.atan(l) * dr,
    scaleX: s,
    scaleY: a
  };
}
var zn;
function Yc(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? ci : As(t.a, t.b, t.c, t.d, t.e, t.f);
}
function Uc(e) {
  return e == null || (zn || (zn = document.createElementNS("http://www.w3.org/2000/svg", "g")), zn.setAttribute("transform", e), !(e = zn.transform.baseVal.consolidate())) ? ci : (e = e.matrix, As(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ps(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, d, h, v, E) {
    if (u !== d || c !== h) {
      var b = v.push("translate(", null, t, null, n);
      E.push({ i: b - 4, x: je(u, d) }, { i: b - 2, x: je(c, h) });
    } else (d || h) && v.push("translate(" + d + t + h + n);
  }
  function s(u, c, d, h) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), h.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: je(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function a(u, c, d, h) {
    u !== c ? h.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: je(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function l(u, c, d, h, v, E) {
    if (u !== d || c !== h) {
      var b = v.push(i(v) + "scale(", null, ",", null, ")");
      E.push({ i: b - 4, x: je(u, d) }, { i: b - 2, x: je(c, h) });
    } else (d !== 1 || h !== 1) && v.push(i(v) + "scale(" + d + "," + h + ")");
  }
  return function(u, c) {
    var d = [], h = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, d, h), s(u.rotate, c.rotate, d, h), a(u.skewX, c.skewX, d, h), l(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, h), u = c = null, function(v) {
      for (var E = -1, b = h.length, S; ++E < b; )
        d[(S = h[E]).i] = S.x(v);
      return d.join("");
    };
  };
}
var Xc = Ps(Yc, "px, ", "px)", "deg)"), Gc = Ps(Uc, ", ", ")", ")"), Zc = 1e-12;
function fr(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function qc(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function Wc(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const Kn = (function e(t, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], u = r[2], c = s[0], d = s[1], h = s[2], v = c - a, E = d - l, b = v * v + E * E, S, _;
    if (b < Zc)
      _ = Math.log(h / u) / t, S = function(V) {
        return [
          a + V * v,
          l + V * E,
          u * Math.exp(t * V * _)
        ];
      };
    else {
      var P = Math.sqrt(b), y = (h * h - u * u + o * b) / (2 * u * n * P), x = (h * h - u * u - o * b) / (2 * h * n * P), R = Math.log(Math.sqrt(y * y + 1) - y), Y = Math.log(Math.sqrt(x * x + 1) - x);
      _ = (Y - R) / t, S = function(V) {
        var U = V * _, ie = fr(R), H = u / (n * P) * (ie * Wc(t * U + R) - qc(R));
        return [
          a + H * v,
          l + H * E,
          u * ie / fr(t * U + R)
        ];
      };
    }
    return S.duration = _ * 1e3 * t / Math.SQRT2, S;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return e(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var qt = 0, sn = 0, tn = 0, Os = 1e3, uo, an, co = 0, Rt = 0, No = 0, _n = typeof performance == "object" && performance.now ? performance : Date, zs = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Pi() {
  return Rt || (zs(Kc), Rt = _n.now() + No);
}
function Kc() {
  Rt = 0;
}
function fo() {
  this._call = this._time = this._next = null;
}
fo.prototype = Rs.prototype = {
  constructor: fo,
  restart: function(e, t, n) {
    if (typeof e != "function")
      throw new TypeError("callback is not a function");
    n = (n == null ? Pi() : +n) + (t == null ? 0 : +t), !this._next && an !== this && (an ? an._next = this : uo = this, an = this), this._call = e, this._time = n, di();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, di());
  }
};
function Rs(e, t, n) {
  var o = new fo();
  return o.restart(e, t, n), o;
}
function Qc() {
  Pi(), ++qt;
  for (var e = uo, t; e; )
    (t = Rt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --qt;
}
function hr() {
  Rt = (co = _n.now()) + No, qt = sn = 0;
  try {
    Qc();
  } finally {
    qt = 0, jc(), Rt = 0;
  }
}
function Jc() {
  var e = _n.now(), t = e - co;
  t > Os && (No -= t, co = e);
}
function jc() {
  for (var e, t = uo, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : uo = n);
  an = e, di(o);
}
function di(e) {
  if (!qt) {
    sn && (sn = clearTimeout(sn));
    var t = e - Rt;
    t > 24 ? (e < 1 / 0 && (sn = setTimeout(hr, e - _n.now() - No)), tn && (tn = clearInterval(tn))) : (tn || (co = _n.now(), tn = setInterval(Jc, Os)), qt = 1, zs(hr));
  }
}
function vr(e, t, n) {
  var o = new fo();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var ed = xo("start", "end", "cancel", "interrupt"), td = [], Bs = 0, pr = 1, fi = 2, Qn = 3, gr = 4, hi = 5, Jn = 6;
function Co(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s)
    e.__transition = {};
  else if (n in s)
    return;
  nd(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: ed,
    tween: td,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Bs
  });
}
function Oi(e, t) {
  var n = Ke(e, t);
  if (n.state > Bs)
    throw new Error("too late; already scheduled");
  return n;
}
function st(e, t) {
  var n = Ke(e, t);
  if (n.state > Qn)
    throw new Error("too late; already running");
  return n;
}
function Ke(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t]))
    throw new Error("transition not found");
  return n;
}
function nd(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Rs(r, 0, n.time);
  function r(u) {
    n.state = pr, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, d, h, v;
    if (n.state !== pr)
      return l();
    for (c in o)
      if (v = o[c], v.name === n.name) {
        if (v.state === Qn)
          return vr(s);
        v.state === gr ? (v.state = Jn, v.timer.stop(), v.on.call("interrupt", e, e.__data__, v.index, v.group), delete o[c]) : +c < t && (v.state = Jn, v.timer.stop(), v.on.call("cancel", e, e.__data__, v.index, v.group), delete o[c]);
      }
    if (vr(function() {
      n.state === Qn && (n.state = gr, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = fi, n.on.call("start", e, e.__data__, n.index, n.group), n.state === fi) {
      for (n.state = Qn, i = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (v = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = v);
      i.length = d + 1;
    }
  }
  function a(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(l), n.state = hi, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(e, c);
    n.state === hi && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = Jn, n.timer.stop(), delete o[t];
    for (var u in o)
      return;
    delete e.__transition;
  }
}
function jn(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > fi && o.state < hi, o.state = Jn, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function od(e) {
  return this.each(function() {
    jn(this, e);
  });
}
function id(e, t) {
  var n, o;
  return function() {
    var i = st(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function rd(e, t, n) {
  var o, i;
  if (typeof n != "function")
    throw new Error();
  return function() {
    var r = st(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: t, value: n }, l = 0, u = i.length; l < u; ++l)
        if (i[l].name === t) {
          i[l] = a;
          break;
        }
      l === u && i.push(a);
    }
    r.tween = i;
  };
}
function sd(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = Ke(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? id : rd)(n, e, t));
}
function zi(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = st(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Ke(i, o).value[t];
  };
}
function Ls(e, t) {
  var n;
  return (typeof t == "number" ? je : t instanceof zt ? lo : (n = zt(t)) ? (t = n, lo) : Is)(e, t);
}
function ad(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function ld(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function ud(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function cd(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function dd(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function fd(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function hd(e, t) {
  var n = So(e), o = n === "transform" ? Gc : Ls;
  return this.attrTween(e, typeof t == "function" ? (n.local ? fd : dd)(n, o, zi(this, "attr." + e, t)) : t == null ? (n.local ? ld : ad)(n) : (n.local ? cd : ud)(n, o, t));
}
function vd(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function pd(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function gd(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && pd(e, r)), n;
  }
  return i._value = t, i;
}
function md(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && vd(e, r)), n;
  }
  return i._value = t, i;
}
function yd(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2)
    return (n = this.tween(n)) && n._value;
  if (t == null)
    return this.tween(n, null);
  if (typeof t != "function")
    throw new Error();
  var o = So(e);
  return this.tween(n, (o.local ? gd : md)(o, t));
}
function _d(e, t) {
  return function() {
    Oi(this, e).delay = +t.apply(this, arguments);
  };
}
function wd(e, t) {
  return t = +t, function() {
    Oi(this, e).delay = t;
  };
}
function bd(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? _d : wd)(t, e)) : Ke(this.node(), t).delay;
}
function $d(e, t) {
  return function() {
    st(this, e).duration = +t.apply(this, arguments);
  };
}
function Ed(e, t) {
  return t = +t, function() {
    st(this, e).duration = t;
  };
}
function xd(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? $d : Ed)(t, e)) : Ke(this.node(), t).duration;
}
function Sd(e, t) {
  if (typeof t != "function")
    throw new Error();
  return function() {
    st(this, e).ease = t;
  };
}
function Nd(e) {
  var t = this._id;
  return arguments.length ? this.each(Sd(t, e)) : Ke(this.node(), t).ease;
}
function Cd(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function")
      throw new Error();
    st(this, e).ease = n;
  };
}
function kd(e) {
  if (typeof e != "function")
    throw new Error();
  return this.each(Cd(this._id, e));
}
function Md(e) {
  typeof e != "function" && (e = ms(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new vt(o, this._parents, this._name, this._id);
}
function Td(e) {
  if (e._id !== this._id)
    throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = t[a], u = n[a], c = l.length, d = s[a] = new Array(c), h, v = 0; v < c; ++v)
      (h = l[v] || u[v]) && (d[v] = h);
  for (; a < o; ++a)
    s[a] = t[a];
  return new vt(s, this._parents, this._name, this._id);
}
function Dd(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function Id(e, t, n) {
  var o, i, r = Dd(t) ? Oi : st;
  return function() {
    var s = r(this, e), a = s.on;
    a !== o && (i = (o = a).copy()).on(t, n), s.on = i;
  };
}
function Ad(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Ke(this.node(), n).on.on(e) : this.each(Id(n, e, t));
}
function Pd(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition)
      if (+n !== e)
        return;
    t && t.removeChild(this);
  };
}
function Od() {
  return this.on("end.remove", Pd(this._id));
}
function zd(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Ti(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, u = r[s] = new Array(l), c, d, h = 0; h < l; ++h)
      (c = a[h]) && (d = e.call(c, c.__data__, h, a)) && ("__data__" in c && (d.__data__ = c.__data__), u[h] = d, Co(u[h], t, n, h, u, Ke(c, n)));
  return new vt(r, this._parents, t, n);
}
function Rd(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = gs(e));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], u = l.length, c, d = 0; d < u; ++d)
      if (c = l[d]) {
        for (var h = e.call(c, c.__data__, d, l), v, E = Ke(c, n), b = 0, S = h.length; b < S; ++b)
          (v = h[b]) && Co(v, t, n, b, h, E);
        r.push(h), s.push(c);
      }
  return new vt(r, s, t, n);
}
var Bd = kn.prototype.constructor;
function Ld() {
  return new Bd(this._groups, this._parents);
}
function Vd(e, t) {
  var n, o, i;
  return function() {
    var r = Zt(this, e), s = (this.style.removeProperty(e), Zt(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function Vs(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function Hd(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = Zt(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Fd(e, t, n) {
  var o, i, r;
  return function() {
    var s = Zt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Zt(this, e))), s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a));
  };
}
function Yd(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, a;
  return function() {
    var l = st(this, e), u = l.on, c = l.value[r] == null ? a || (a = Vs(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), l.on = o;
  };
}
function Ud(e, t, n) {
  var o = (e += "") == "transform" ? Xc : Ls;
  return t == null ? this.styleTween(e, Vd(e, o)).on("end.style." + e, Vs(e)) : typeof t == "function" ? this.styleTween(e, Fd(e, o, zi(this, "style." + e, t))).each(Yd(this._id, e)) : this.styleTween(e, Hd(e, o, t), n).on("end.style." + e, null);
}
function Xd(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function Gd(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && Xd(e, s, n)), o;
  }
  return r._value = t, r;
}
function Zd(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2)
    return (o = this.tween(o)) && o._value;
  if (t == null)
    return this.tween(o, null);
  if (typeof t != "function")
    throw new Error();
  return this.tween(o, Gd(e, t, n ?? ""));
}
function qd(e) {
  return function() {
    this.textContent = e;
  };
}
function Wd(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Kd(e) {
  return this.tween("text", typeof e == "function" ? Wd(zi(this, "text", e)) : qd(e == null ? "" : e + ""));
}
function Qd(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Jd(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && Qd(i)), t;
  }
  return o._value = e, o;
}
function jd(e) {
  var t = "text";
  if (arguments.length < 1)
    return (t = this.tween(t)) && t._value;
  if (e == null)
    return this.tween(t, null);
  if (typeof e != "function")
    throw new Error();
  return this.tween(t, Jd(e));
}
function ef() {
  for (var e = this._name, t = this._id, n = Hs(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      if (l = s[u]) {
        var c = Ke(l, t);
        Co(l, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new vt(o, this._parents, e, n);
}
function tf() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = st(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), u.on = t;
    }), i === 0 && r();
  });
}
var nf = 0;
function vt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function Hs() {
  return ++nf;
}
var lt = kn.prototype;
vt.prototype = {
  constructor: vt,
  select: zd,
  selectAll: Rd,
  selectChild: lt.selectChild,
  selectChildren: lt.selectChildren,
  filter: Md,
  merge: Td,
  selection: Ld,
  transition: ef,
  call: lt.call,
  nodes: lt.nodes,
  node: lt.node,
  size: lt.size,
  empty: lt.empty,
  each: lt.each,
  on: Ad,
  attr: hd,
  attrTween: yd,
  style: Ud,
  styleTween: Zd,
  text: Kd,
  textTween: jd,
  remove: Od,
  tween: sd,
  delay: bd,
  duration: xd,
  ease: Nd,
  easeVarying: kd,
  end: tf,
  [Symbol.iterator]: lt[Symbol.iterator]
};
function of(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var rf = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: of
};
function sf(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function af(e) {
  var t, n;
  e instanceof vt ? (t = e._id, e = e._name) : (t = Hs(), (n = rf).time = Pi(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && Co(l, e, t, u, s, n || sf(l, t));
  return new vt(o, this._parents, e, t);
}
kn.prototype.interrupt = od;
kn.prototype.transition = af;
const Rn = (e) => () => e;
function lf(e, {
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
function dt(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
dt.prototype = {
  constructor: dt,
  scale: function(e) {
    return e === 1 ? this : new dt(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new dt(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Wt = new dt(1, 0, 0);
dt.prototype;
function Zo(e) {
  e.stopImmediatePropagation();
}
function nn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function uf(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function cf() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function mr() {
  return this.__zoom || Wt;
}
function df(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function ff() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function hf(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function vf() {
  var e = uf, t = cf, n = hf, o = df, i = ff, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = Kn, u = xo("start", "zoom", "end"), c, d, h, v = 500, E = 150, b = 0, S = 10;
  function _(f) {
    f.property("__zoom", mr).on("wheel.zoom", U, { passive: !1 }).on("mousedown.zoom", ie).on("dblclick.zoom", H).filter(i).on("touchstart.zoom", X).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(f, N, p, D) {
    var C = f.selection ? f.selection() : f;
    C.property("__zoom", mr), f !== C ? R(f, N, p, D) : C.interrupt().each(function() {
      Y(this, arguments).event(D).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, _.scaleBy = function(f, N, p, D) {
    _.scaleTo(f, function() {
      var C = this.__zoom.k, O = typeof N == "function" ? N.apply(this, arguments) : N;
      return C * O;
    }, p, D);
  }, _.scaleTo = function(f, N, p, D) {
    _.transform(f, function() {
      var C = t.apply(this, arguments), O = this.__zoom, T = p == null ? x(C) : typeof p == "function" ? p.apply(this, arguments) : p, B = O.invert(T), Z = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(y(P(O, Z), T, B), C, s);
    }, p, D);
  }, _.translateBy = function(f, N, p, D) {
    _.transform(f, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof p == "function" ? p.apply(this, arguments) : p
      ), t.apply(this, arguments), s);
    }, null, D);
  }, _.translateTo = function(f, N, p, D, C) {
    _.transform(f, function() {
      var O = t.apply(this, arguments), T = this.__zoom, B = D == null ? x(O) : typeof D == "function" ? D.apply(this, arguments) : D;
      return n(Wt.translate(B[0], B[1]).scale(T.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof p == "function" ? -p.apply(this, arguments) : -p
      ), O, s);
    }, D, C);
  };
  function P(f, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === f.k ? f : new dt(N, f.x, f.y);
  }
  function y(f, N, p) {
    var D = N[0] - p[0] * f.k, C = N[1] - p[1] * f.k;
    return D === f.x && C === f.y ? f : new dt(f.k, D, C);
  }
  function x(f) {
    return [(+f[0][0] + +f[1][0]) / 2, (+f[0][1] + +f[1][1]) / 2];
  }
  function R(f, N, p, D) {
    f.on("start.zoom", function() {
      Y(this, arguments).event(D).start();
    }).on("interrupt.zoom end.zoom", function() {
      Y(this, arguments).event(D).end();
    }).tween("zoom", function() {
      var C = this, O = arguments, T = Y(C, O).event(D), B = t.apply(C, O), Z = p == null ? x(B) : typeof p == "function" ? p.apply(C, O) : p, j = Math.max(B[1][0] - B[0][0], B[1][1] - B[0][1]), re = C.__zoom, G = typeof N == "function" ? N.apply(C, O) : N, F = l(re.invert(Z).concat(j / re.k), G.invert(Z).concat(j / G.k));
      return function(ee) {
        if (ee === 1)
          ee = G;
        else {
          var he = F(ee), pe = j / he[2];
          ee = new dt(pe, Z[0] - he[0] * pe, Z[1] - he[1] * pe);
        }
        T.zoom(null, ee);
      };
    });
  }
  function Y(f, N, p) {
    return !p && f.__zooming || new V(f, N);
  }
  function V(f, N) {
    this.that = f, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(f, N), this.taps = 0;
  }
  V.prototype = {
    event: function(f) {
      return f && (this.sourceEvent = f), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(f, N) {
      return this.mouse && f !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && f !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && f !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(f) {
      var N = Ze(this.that).datum();
      u.call(
        f,
        this.that,
        new lf(f, {
          sourceEvent: this.sourceEvent,
          target: _,
          transform: this.that.__zoom,
          dispatch: u
        }),
        N
      );
    }
  };
  function U(f, ...N) {
    if (!e.apply(this, arguments))
      return;
    var p = Y(this, N).event(f), D = this.__zoom, C = Math.max(r[0], Math.min(r[1], D.k * Math.pow(2, o.apply(this, arguments)))), O = Je(f);
    if (p.wheel)
      (p.mouse[0][0] !== O[0] || p.mouse[0][1] !== O[1]) && (p.mouse[1] = D.invert(p.mouse[0] = O)), clearTimeout(p.wheel);
    else {
      if (D.k === C)
        return;
      p.mouse = [O, D.invert(O)], jn(this), p.start();
    }
    nn(f), p.wheel = setTimeout(T, E), p.zoom("mouse", n(y(P(D, C), p.mouse[0], p.mouse[1]), p.extent, s));
    function T() {
      p.wheel = null, p.end();
    }
  }
  function ie(f, ...N) {
    if (h || !e.apply(this, arguments))
      return;
    var p = f.currentTarget, D = Y(this, N, !0).event(f), C = Ze(f.view).on("mousemove.zoom", Z, !0).on("mouseup.zoom", j, !0), O = Je(f, p), T = f.clientX, B = f.clientY;
    Cs(f.view), Zo(f), D.mouse = [O, this.__zoom.invert(O)], jn(this), D.start();
    function Z(re) {
      if (nn(re), !D.moved) {
        var G = re.clientX - T, F = re.clientY - B;
        D.moved = G * G + F * F > b;
      }
      D.event(re).zoom("mouse", n(y(D.that.__zoom, D.mouse[0] = Je(re, p), D.mouse[1]), D.extent, s));
    }
    function j(re) {
      C.on("mousemove.zoom mouseup.zoom", null), ks(re.view, D.moved), nn(re), D.event(re).end();
    }
  }
  function H(f, ...N) {
    if (e.apply(this, arguments)) {
      var p = this.__zoom, D = Je(f.changedTouches ? f.changedTouches[0] : f, this), C = p.invert(D), O = p.k * (f.shiftKey ? 0.5 : 2), T = n(y(P(p, O), D, C), t.apply(this, N), s);
      nn(f), a > 0 ? Ze(this).transition().duration(a).call(R, T, D, f) : Ze(this).call(_.transform, T, D, f);
    }
  }
  function X(f, ...N) {
    if (e.apply(this, arguments)) {
      var p = f.touches, D = p.length, C = Y(this, N, f.changedTouches.length === D).event(f), O, T, B, Z;
      for (Zo(f), T = 0; T < D; ++T)
        B = p[T], Z = Je(B, this), Z = [Z, this.__zoom.invert(Z), B.identifier], C.touch0 ? !C.touch1 && C.touch0[2] !== Z[2] && (C.touch1 = Z, C.taps = 0) : (C.touch0 = Z, O = !0, C.taps = 1 + !!c);
      c && (c = clearTimeout(c)), O && (C.taps < 2 && (d = Z[0], c = setTimeout(function() {
        c = null;
      }, v)), jn(this), C.start());
    }
  }
  function k(f, ...N) {
    if (this.__zooming) {
      var p = Y(this, N).event(f), D = f.changedTouches, C = D.length, O, T, B, Z;
      for (nn(f), O = 0; O < C; ++O)
        T = D[O], B = Je(T, this), p.touch0 && p.touch0[2] === T.identifier ? p.touch0[0] = B : p.touch1 && p.touch1[2] === T.identifier && (p.touch1[0] = B);
      if (T = p.that.__zoom, p.touch1) {
        var j = p.touch0[0], re = p.touch0[1], G = p.touch1[0], F = p.touch1[1], ee = (ee = G[0] - j[0]) * ee + (ee = G[1] - j[1]) * ee, he = (he = F[0] - re[0]) * he + (he = F[1] - re[1]) * he;
        T = P(T, Math.sqrt(ee / he)), B = [(j[0] + G[0]) / 2, (j[1] + G[1]) / 2], Z = [(re[0] + F[0]) / 2, (re[1] + F[1]) / 2];
      } else if (p.touch0)
        B = p.touch0[0], Z = p.touch0[1];
      else
        return;
      p.zoom("touch", n(y(T, B, Z), p.extent, s));
    }
  }
  function oe(f, ...N) {
    if (this.__zooming) {
      var p = Y(this, N).event(f), D = f.changedTouches, C = D.length, O, T;
      for (Zo(f), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, v), O = 0; O < C; ++O)
        T = D[O], p.touch0 && p.touch0[2] === T.identifier ? delete p.touch0 : p.touch1 && p.touch1[2] === T.identifier && delete p.touch1;
      if (p.touch1 && !p.touch0 && (p.touch0 = p.touch1, delete p.touch1), p.touch0)
        p.touch0[1] = this.__zoom.invert(p.touch0[0]);
      else if (p.end(), p.taps === 2 && (T = Je(T, this), Math.hypot(d[0] - T[0], d[1] - T[1]) < S)) {
        var B = Ze(this).on("dblclick.zoom");
        B && B.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(f) {
    return arguments.length ? (o = typeof f == "function" ? f : Rn(+f), _) : o;
  }, _.filter = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : Rn(!!f), _) : e;
  }, _.touchable = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : Rn(!!f), _) : i;
  }, _.extent = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : Rn([[+f[0][0], +f[0][1]], [+f[1][0], +f[1][1]]]), _) : t;
  }, _.scaleExtent = function(f) {
    return arguments.length ? (r[0] = +f[0], r[1] = +f[1], _) : [r[0], r[1]];
  }, _.translateExtent = function(f) {
    return arguments.length ? (s[0][0] = +f[0][0], s[1][0] = +f[1][0], s[0][1] = +f[0][1], s[1][1] = +f[1][1], _) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, _.constrain = function(f) {
    return arguments.length ? (n = f, _) : n;
  }, _.duration = function(f) {
    return arguments.length ? (a = +f, _) : a;
  }, _.interpolate = function(f) {
    return arguments.length ? (l = f, _) : l;
  }, _.on = function() {
    var f = u.on.apply(u, arguments);
    return f === u ? _ : f;
  }, _.clickDistance = function(f) {
    return arguments.length ? (b = (f = +f) * f, _) : Math.sqrt(b);
  }, _.tapDistance = function(f) {
    return arguments.length ? (S = +f, _) : S;
  }, _;
}
var ae = /* @__PURE__ */ ((e) => (e.Left = "left", e.Top = "top", e.Right = "right", e.Bottom = "bottom", e))(ae || {}), Ri = /* @__PURE__ */ ((e) => (e.Partial = "partial", e.Full = "full", e))(Ri || {}), Ct = /* @__PURE__ */ ((e) => (e.Bezier = "default", e.SimpleBezier = "simple-bezier", e.Straight = "straight", e.Step = "step", e.SmoothStep = "smoothstep", e))(Ct || {}), Et = /* @__PURE__ */ ((e) => (e.Strict = "strict", e.Loose = "loose", e))(Et || {}), ho = /* @__PURE__ */ ((e) => (e.Arrow = "arrow", e.ArrowClosed = "arrowclosed", e))(ho || {}), hn = /* @__PURE__ */ ((e) => (e.Free = "free", e.Vertical = "vertical", e.Horizontal = "horizontal", e))(hn || {}), Fs = /* @__PURE__ */ ((e) => (e.TopLeft = "top-left", e.TopCenter = "top-center", e.TopRight = "top-right", e.BottomLeft = "bottom-left", e.BottomCenter = "bottom-center", e.BottomRight = "bottom-right", e))(Fs || {});
const pf = ["INPUT", "SELECT", "TEXTAREA"], gf = typeof document < "u" ? document : null;
function vi(e) {
  var t, n;
  const o = ((n = (t = e.composedPath) == null ? void 0 : t.call(e)) == null ? void 0 : n[0]) || e.target, i = typeof o?.hasAttribute == "function" ? o.hasAttribute("contenteditable") : !1, r = typeof o?.closest == "function" ? o.closest(".nokey") : null;
  return pf.includes(o?.nodeName) || i || !!r;
}
function mf(e) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey;
}
function yr(e, t, n, o) {
  const i = t.replace("+", `
`).replace(`

`, `
+`).split(`
`).map((s) => s.trim().toLowerCase());
  if (i.length === 1)
    return e.toLowerCase() === t.toLowerCase();
  o || n.add(e.toLowerCase());
  const r = i.every(
    (s, a) => n.has(s) && Array.from(n.values())[a] === i[a]
  );
  return o && n.delete(e.toLowerCase()), r;
}
function yf(e, t) {
  return (n) => {
    if (!n.code && !n.key)
      return !1;
    const o = _f(n.code, e);
    return Array.isArray(e) ? e.some((i) => yr(n[o], i, t, n.type === "keyup")) : yr(n[o], e, t, n.type === "keyup");
  };
}
function _f(e, t) {
  return t.includes(e) ? "code" : "key";
}
function vn(e, t) {
  const n = ce(() => we(t?.target) ?? gf), o = $t(we(e) === !0);
  let i = !1;
  const r = /* @__PURE__ */ new Set();
  let s = l(we(e));
  Ne(
    () => we(e),
    (u, c) => {
      typeof c == "boolean" && typeof u != "boolean" && a(), s = l(u);
    },
    {
      immediate: !0
    }
  ), vs(["blur", "contextmenu"], a), er(
    (...u) => s(...u),
    (u) => {
      var c, d;
      const h = we(t?.actInsideInputWithModifier) ?? !0, v = we(t?.preventDefault) ?? !1;
      if (i = mf(u), (!i || i && !h) && vi(u))
        return;
      const b = ((d = (c = u.composedPath) == null ? void 0 : c.call(u)) == null ? void 0 : d[0]) || u.target, S = b?.nodeName === "BUTTON" || b?.nodeName === "A";
      !v && (i || !S) && u.preventDefault(), o.value = !0;
    },
    { eventName: "keydown", target: n }
  ), er(
    (...u) => s(...u),
    (u) => {
      const c = we(t?.actInsideInputWithModifier) ?? !0;
      if (o.value) {
        if ((!i || i && !c) && vi(u))
          return;
        i = !1, o.value = !1;
      }
    },
    { eventName: "keyup", target: n }
  );
  function a() {
    i = !1, r.clear(), o.value = we(e) === !0;
  }
  function l(u) {
    return u === null ? (a(), () => !1) : typeof u == "boolean" ? (a(), o.value = u, () => !1) : Array.isArray(u) || typeof u == "string" ? yf(u, r) : u;
  }
  return o;
}
const Ys = "vue-flow__node-desc", Us = "vue-flow__edge-desc", wf = "vue-flow__aria-live", Xs = ["Enter", " ", "Escape"], Xt = {
  ArrowUp: { x: 0, y: -1 },
  ArrowDown: { x: 0, y: 1 },
  ArrowLeft: { x: -1, y: 0 },
  ArrowRight: { x: 1, y: 0 }
};
function vo(e) {
  return {
    ...e.computedPosition || { x: 0, y: 0 },
    width: e.dimensions.width || 0,
    height: e.dimensions.height || 0
  };
}
function po(e, t) {
  const n = Math.max(0, Math.min(e.x + e.width, t.x + t.width) - Math.max(e.x, t.x)), o = Math.max(0, Math.min(e.y + e.height, t.y + t.height) - Math.max(e.y, t.y));
  return Math.ceil(n * o);
}
function ko(e) {
  return {
    width: e.offsetWidth,
    height: e.offsetHeight
  };
}
function Bt(e, t = 0, n = 1) {
  return Math.min(Math.max(e, t), n);
}
function Gs(e, t) {
  return {
    x: Bt(e.x, t[0][0], t[1][0]),
    y: Bt(e.y, t[0][1], t[1][1])
  };
}
function _r(e) {
  const t = e.getRootNode();
  return "elementFromPoint" in t ? t : window.document;
}
function xt(e) {
  return e && typeof e == "object" && "id" in e && "source" in e && "target" in e;
}
function At(e) {
  return e && typeof e == "object" && "id" in e && "position" in e && !xt(e);
}
function ln(e) {
  return At(e) && "computedPosition" in e;
}
function Bn(e) {
  return !Number.isNaN(e) && Number.isFinite(e);
}
function bf(e) {
  return Bn(e.width) && Bn(e.height) && Bn(e.x) && Bn(e.y);
}
function $f(e, t, n) {
  const o = {
    id: e.id.toString(),
    type: e.type ?? "default",
    dimensions: dn({
      width: 0,
      height: 0
    }),
    computedPosition: dn({
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
    data: Ie(e.data) ? e.data : {},
    events: dn(Ie(e.events) ? e.events : {})
  };
  return Object.assign(t ?? o, e, { id: e.id.toString(), parentNode: n });
}
function Zs(e, t, n) {
  var o, i;
  const r = {
    id: e.id.toString(),
    type: e.type ?? t?.type ?? "default",
    source: e.source.toString(),
    target: e.target.toString(),
    sourceHandle: (o = e.sourceHandle) == null ? void 0 : o.toString(),
    targetHandle: (i = e.targetHandle) == null ? void 0 : i.toString(),
    updatable: e.updatable ?? n?.updatable,
    selectable: e.selectable ?? n?.selectable,
    focusable: e.focusable ?? n?.focusable,
    data: Ie(e.data) ? e.data : {},
    events: dn(Ie(e.events) ? e.events : {}),
    label: e.label ?? "",
    interactionWidth: e.interactionWidth ?? n?.interactionWidth,
    ...n ?? {}
  };
  return Object.assign(t ?? r, e, { id: e.id.toString() });
}
function qs(e, t, n, o) {
  const i = typeof e == "string" ? e : e.id, r = /* @__PURE__ */ new Set(), s = o === "source" ? "target" : "source";
  for (const a of n)
    a[s] === i && r.add(a[o]);
  return t.filter((a) => r.has(a.id));
}
function Ef(...e) {
  if (e.length === 3) {
    const [r, s, a] = e;
    return qs(r, s, a, "target");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => xt(r) && r.source === o).map((r) => n.find((s) => At(s) && s.id === r.target));
}
function xf(...e) {
  if (e.length === 3) {
    const [r, s, a] = e;
    return qs(r, s, a, "source");
  }
  const [t, n] = e, o = typeof t == "string" ? t : t.id;
  return n.filter((r) => xt(r) && r.target === o).map((r) => n.find((s) => At(s) && s.id === r.source));
}
function Ws({ source: e, sourceHandle: t, target: n, targetHandle: o }) {
  return `vueflow__edge-${e}${t ?? ""}-${n}${o ?? ""}`;
}
function Sf(e, t) {
  return t.some(
    (n) => xt(n) && n.source === e.source && n.target === e.target && (n.sourceHandle === e.sourceHandle || !n.sourceHandle && !e.sourceHandle) && (n.targetHandle === e.targetHandle || !n.targetHandle && !e.targetHandle)
  );
}
function wn({ x: e, y: t }, { x: n, y: o, zoom: i }) {
  return {
    x: e * i + n,
    y: t * i + o
  };
}
function bn({ x: e, y: t }, { x: n, y: o, zoom: i }, r = !1, s = [1, 1]) {
  const a = {
    x: (e - n) / i,
    y: (t - o) / i
  };
  return r ? Mo(a, s) : a;
}
function Ks(e, t) {
  return {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x2, t.x2),
    y2: Math.max(e.y2, t.y2)
  };
}
function go({ x: e, y: t, width: n, height: o }) {
  return {
    x: e,
    y: t,
    x2: e + n,
    y2: t + o
  };
}
function Qs({ x: e, y: t, x2: n, y2: o }) {
  return {
    x: e,
    y: t,
    width: n - e,
    height: o - t
  };
}
function Nf(e, t) {
  return Qs(Ks(go(e), go(t)));
}
function Bi(e) {
  let t = {
    x: Number.POSITIVE_INFINITY,
    y: Number.POSITIVE_INFINITY,
    x2: Number.NEGATIVE_INFINITY,
    y2: Number.NEGATIVE_INFINITY
  };
  for (let n = 0; n < e.length; n++) {
    const o = e[n];
    t = Ks(
      t,
      go({
        ...o.computedPosition,
        ...o.dimensions
      })
    );
  }
  return Qs(t);
}
function Js(e, t, n = { x: 0, y: 0, zoom: 1 }, o = !1, i = !1) {
  const r = {
    ...bn(t, n),
    width: t.width / n.zoom,
    height: t.height / n.zoom
  }, s = [];
  for (const a of e) {
    const { dimensions: l, selectable: u = !0, hidden: c = !1 } = a, d = l.width ?? a.width ?? null, h = l.height ?? a.height ?? null;
    if (i && !u || c)
      continue;
    const v = po(r, vo(a)), E = d === null || h === null, b = o && v > 0, S = (d ?? 0) * (h ?? 0);
    (E || b || v >= S || a.dragging) && s.push(a);
  }
  return s;
}
function kt(e, t) {
  const n = /* @__PURE__ */ new Set();
  if (typeof e == "string")
    n.add(e);
  else if (e.length >= 1)
    for (const o of e)
      n.add(o.id);
  return t.filter((o) => n.has(o.source) || n.has(o.target));
}
function Ft(e, t) {
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
  return Tn(`The padding value "${e}" is invalid. Please provide a number or a string with a valid unit (px or %).`), 0;
}
function Cf(e, t, n) {
  if (typeof e == "string" || typeof e == "number") {
    const o = Ft(e, n), i = Ft(e, t);
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
    const o = Ft(e.top ?? e.y ?? 0, n), i = Ft(e.bottom ?? e.y ?? 0, n), r = Ft(e.left ?? e.x ?? 0, t), s = Ft(e.right ?? e.x ?? 0, t);
    return { top: o, right: s, bottom: i, left: r, x: r + s, y: o + i };
  }
  return { top: 0, right: 0, bottom: 0, left: 0, x: 0, y: 0 };
}
function kf(e, t, n, o, i, r) {
  const { x: s, y: a } = wn(e, { x: t, y: n, zoom: o }), { x: l, y: u } = wn(
    { x: e.x + e.width, y: e.y + e.height },
    {
      x: t,
      y: n,
      zoom: o
    }
  ), c = i - l, d = r - u;
  return {
    left: Math.floor(s),
    top: Math.floor(a),
    right: Math.floor(c),
    bottom: Math.floor(d)
  };
}
function wr(e, t, n, o, i, r = 0.1) {
  const s = Cf(r, t, n), a = (t - s.x) / e.width, l = (n - s.y) / e.height, u = Math.min(a, l), c = Bt(u, o, i), d = e.x + e.width / 2, h = e.y + e.height / 2, v = t / 2 - d * c, E = n / 2 - h * c, b = kf(e, v, E, c, t, n), S = {
    left: Math.min(b.left - s.left, 0),
    top: Math.min(b.top - s.top, 0),
    right: Math.min(b.right - s.right, 0),
    bottom: Math.min(b.bottom - s.bottom, 0)
  };
  return {
    x: v - S.left + S.right,
    y: E - S.top + S.bottom,
    zoom: c
  };
}
function Mf(e, t) {
  return {
    x: t.x + e.x,
    y: t.y + e.y,
    z: (e.z > t.z ? e.z : t.z) + 1
  };
}
function js(e, t) {
  if (!e.parentNode)
    return !1;
  const n = t.get(e.parentNode);
  return n ? n.selected ? !0 : js(n, t) : !1;
}
function $n(e, t) {
  return typeof e > "u" ? "" : typeof e == "string" ? e : `${t ? `${t}__` : ""}${Object.keys(e).sort().map((o) => `${o}=${e[o]}`).join("&")}`;
}
function pi(e) {
  const t = e.ctrlKey && En() ? 10 : 1;
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * t;
}
function br(e, t, n) {
  return e < t ? Bt(Math.abs(e - t), 1, t) / t : e > n ? -Bt(Math.abs(e - n), 1, t) / t : 0;
}
function ea(e, t, n = 15, o = 40) {
  const i = br(e.x, o, t.width - o) * n, r = br(e.y, o, t.height - o) * n;
  return [i, r];
}
function qo(e, t) {
  if (t) {
    const n = e.position.x + e.dimensions.width - t.dimensions.width, o = e.position.y + e.dimensions.height - t.dimensions.height;
    if (n > 0 || o > 0 || e.position.x < 0 || e.position.y < 0) {
      let i = {};
      if (typeof t.style == "function" ? i = { ...t.style(t) } : t.style && (i = { ...t.style }), i.width = i.width ?? `${t.dimensions.width}px`, i.height = i.height ?? `${t.dimensions.height}px`, n > 0)
        if (typeof i.width == "string") {
          const r = Number(i.width.replace("px", ""));
          i.width = `${r + n}px`;
        } else
          i.width += n;
      if (o > 0)
        if (typeof i.height == "string") {
          const r = Number(i.height.replace("px", ""));
          i.height = `${r + o}px`;
        } else
          i.height += o;
      if (e.position.x < 0) {
        const r = Math.abs(e.position.x);
        if (t.position.x = t.position.x - r, typeof i.width == "string") {
          const s = Number(i.width.replace("px", ""));
          i.width = `${s + r}px`;
        } else
          i.width += r;
        e.position.x = 0;
      }
      if (e.position.y < 0) {
        const r = Math.abs(e.position.y);
        if (t.position.y = t.position.y - r, typeof i.height == "string") {
          const s = Number(i.height.replace("px", ""));
          i.height = `${s + r}px`;
        } else
          i.height += r;
        e.position.y = 0;
      }
      t.dimensions.width = Number(i.width.toString().replace("px", "")), t.dimensions.height = Number(i.height.toString().replace("px", "")), typeof t.style == "function" ? t.style = (r) => {
        const s = t.style;
        return {
          ...s(r),
          ...i
        };
      } : t.style = {
        ...t.style,
        ...i
      };
    }
  }
}
function $r(e, t) {
  var n, o;
  const i = e.filter((s) => s.type === "add" || s.type === "remove");
  for (const s of i)
    if (s.type === "add")
      t.findIndex((l) => l.id === s.item.id) === -1 && t.push(s.item);
    else if (s.type === "remove") {
      const a = t.findIndex((l) => l.id === s.id);
      a !== -1 && t.splice(a, 1);
    }
  const r = t.map((s) => s.id);
  for (const s of t)
    for (const a of e)
      if (a.id === s.id)
        switch (a.type) {
          case "select":
            s.selected = a.selected;
            break;
          case "position":
            if (ln(s) && (typeof a.position < "u" && (s.position = a.position), typeof a.dragging < "u" && (s.dragging = a.dragging), s.expandParent && s.parentNode)) {
              const l = t[r.indexOf(s.parentNode)];
              l && ln(l) && qo(s, l);
            }
            break;
          case "dimensions":
            if (ln(s) && (typeof a.dimensions < "u" && (s.dimensions = a.dimensions), typeof a.updateStyle < "u" && a.updateStyle && (s.style = {
              ...s.style || {},
              width: `${(n = a.dimensions) == null ? void 0 : n.width}px`,
              height: `${(o = a.dimensions) == null ? void 0 : o.height}px`
            }), typeof a.resizing < "u" && (s.resizing = a.resizing), s.expandParent && s.parentNode)) {
              const l = t[r.indexOf(s.parentNode)];
              l && ln(l) && (!!l.dimensions.width && !!l.dimensions.height ? qo(s, l) : Ye(() => {
                qo(s, l);
              }));
            }
            break;
        }
  return t;
}
function mt(e, t) {
  return {
    id: e,
    type: "select",
    selected: t
  };
}
function Er(e) {
  return {
    item: e,
    type: "add"
  };
}
function xr(e) {
  return {
    id: e,
    type: "remove"
  };
}
function Sr(e, t, n, o, i) {
  return {
    id: e,
    source: t,
    target: n,
    sourceHandle: o || null,
    targetHandle: i || null,
    type: "remove"
  };
}
function _t(e, t = /* @__PURE__ */ new Set(), n = !1) {
  const o = [];
  for (const [i, r] of e) {
    const s = t.has(i);
    !(r.selected === void 0 && !s) && r.selected !== s && (n && (r.selected = s), o.push(mt(r.id, s)));
  }
  return o;
}
const Nr = () => {
};
function ne(e) {
  const t = /* @__PURE__ */ new Set();
  let n = Nr, o = () => !1;
  const i = () => t.size > 0 || o(), r = (h) => {
    n = h;
  }, s = () => {
    n = Nr;
  }, a = (h) => {
    o = h;
  }, l = () => {
    o = () => !1;
  }, u = (h) => {
    t.delete(h);
  };
  return {
    on: (h) => {
      t.add(h);
      const v = () => u(h);
      return pn(v), { off: v };
    },
    off: u,
    trigger: (h) => {
      const v = [n];
      return i() ? v.push(...t) : e && v.push(e), Promise.allSettled(v.map((E) => E(h)));
    },
    hasListeners: i,
    listeners: t,
    setEmitter: r,
    removeEmitter: s,
    setHasEmitListeners: a,
    removeHasEmitListeners: l
  };
}
function Cr(e, t, n) {
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
function Tf(e, t, n, o) {
  var i, r;
  const s = /* @__PURE__ */ new Map();
  for (const [a, l] of e)
    (l.selected || l.id === o) && (!l.parentNode || !js(l, e)) && (l.draggable || t && typeof l.draggable > "u") && e.get(a) && s.set(a, {
      id: l.id,
      position: l.position || { x: 0, y: 0 },
      distance: {
        x: n.x - ((i = l.computedPosition) == null ? void 0 : i.x) || 0,
        y: n.y - ((r = l.computedPosition) == null ? void 0 : r.y) || 0
      },
      from: { x: l.computedPosition.x, y: l.computedPosition.y },
      extent: l.extent,
      parentNode: l.parentNode,
      dimensions: { ...l.dimensions },
      expandParent: l.expandParent
    });
  return Array.from(s.values());
}
function Wo({
  id: e,
  dragItems: t,
  findNode: n
}) {
  const o = [];
  for (const i of t) {
    const r = n(i.id);
    r && o.push(r);
  }
  return [e ? o.find((i) => i.id === e) : o[0], o];
}
function ta(e) {
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
function Df(e, t, n) {
  const [o, i, r, s] = typeof e != "string" ? ta(e.padding) : [0, 0, 0, 0];
  return n && typeof n.computedPosition.x < "u" && typeof n.computedPosition.y < "u" && typeof n.dimensions.width < "u" && typeof n.dimensions.height < "u" ? [
    [n.computedPosition.x + s, n.computedPosition.y + o],
    [
      n.computedPosition.x + n.dimensions.width - i,
      n.computedPosition.y + n.dimensions.height - r
    ]
  ] : !1;
}
function If(e, t, n, o) {
  let i = e.extent || n;
  if ((i === "parent" || !Array.isArray(i) && i?.range === "parent") && !e.expandParent)
    if (e.parentNode && o && e.dimensions.width && e.dimensions.height) {
      const r = Df(i, e, o);
      r && (i = r);
    } else
      t(new Oe(Pe.NODE_EXTENT_INVALID, e.id)), i = n;
  else if (Array.isArray(i)) {
    const r = o?.computedPosition.x || 0, s = o?.computedPosition.y || 0;
    i = [
      [i[0][0] + r, i[0][1] + s],
      [i[1][0] + r, i[1][1] + s]
    ];
  } else if (i !== "parent" && i?.range && Array.isArray(i.range)) {
    const [r, s, a, l] = ta(i.padding), u = o?.computedPosition.x || 0, c = o?.computedPosition.y || 0;
    i = [
      [i.range[0][0] + u + l, i.range[0][1] + c + r],
      [i.range[1][0] + u - s, i.range[1][1] + c - a]
    ];
  }
  return i === "parent" ? [
    [Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY],
    [Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY]
  ] : i;
}
function Af({ width: e, height: t }, n) {
  return [n[0], [n[1][0] - (e || 0), n[1][1] - (t || 0)]];
}
function Li(e, t, n, o, i) {
  const r = Af(e.dimensions, If(e, n, o, i)), s = Gs(t, r);
  return {
    position: {
      x: s.x - (i?.computedPosition.x || 0),
      y: s.y - (i?.computedPosition.y || 0)
    },
    computedPosition: s
  };
}
function Kt(e, t, n = ae.Left, o = !1) {
  const i = (t?.x ?? 0) + e.computedPosition.x, r = (t?.y ?? 0) + e.computedPosition.y, { width: s, height: a } = t ?? Rf(e);
  if (o)
    return { x: i + s / 2, y: r + a / 2 };
  switch (t?.position ?? n) {
    case ae.Top:
      return { x: i + s / 2, y: r };
    case ae.Right:
      return { x: i + s, y: r + a / 2 };
    case ae.Bottom:
      return { x: i + s / 2, y: r + a };
    case ae.Left:
      return { x: i, y: r + a / 2 };
  }
}
function kr(e, t) {
  return e && (t ? e.find((n) => n.id === t) : e[0]) || null;
}
function Pf({
  sourcePos: e,
  targetPos: t,
  sourceWidth: n,
  sourceHeight: o,
  targetWidth: i,
  targetHeight: r,
  width: s,
  height: a,
  viewport: l
}) {
  const u = {
    x: Math.min(e.x, t.x),
    y: Math.min(e.y, t.y),
    x2: Math.max(e.x + n, t.x + i),
    y2: Math.max(e.y + o, t.y + r)
  };
  u.x === u.x2 && (u.x2 += 1), u.y === u.y2 && (u.y2 += 1);
  const c = go({
    x: (0 - l.x) / l.zoom,
    y: (0 - l.y) / l.zoom,
    width: s / l.zoom,
    height: a / l.zoom
  }), d = Math.max(0, Math.min(c.x2, u.x2) - Math.max(c.x, u.x)), h = Math.max(0, Math.min(c.y2, u.y2) - Math.max(c.y, u.y));
  return Math.ceil(d * h) > 0;
}
function Of(e, t, n = !1) {
  const o = typeof e.zIndex == "number";
  let i = o ? e.zIndex : 0;
  const r = t(e.source), s = t(e.target);
  return !r || !s ? 0 : (n && (i = o ? e.zIndex : Math.max(r.computedPosition.z || 0, s.computedPosition.z || 0)), i);
}
var Pe = /* @__PURE__ */ ((e) => (e.MISSING_STYLES = "MISSING_STYLES", e.MISSING_VIEWPORT_DIMENSIONS = "MISSING_VIEWPORT_DIMENSIONS", e.NODE_INVALID = "NODE_INVALID", e.NODE_NOT_FOUND = "NODE_NOT_FOUND", e.NODE_MISSING_PARENT = "NODE_MISSING_PARENT", e.NODE_TYPE_MISSING = "NODE_TYPE_MISSING", e.NODE_EXTENT_INVALID = "NODE_EXTENT_INVALID", e.EDGE_INVALID = "EDGE_INVALID", e.EDGE_NOT_FOUND = "EDGE_NOT_FOUND", e.EDGE_SOURCE_MISSING = "EDGE_SOURCE_MISSING", e.EDGE_TARGET_MISSING = "EDGE_TARGET_MISSING", e.EDGE_TYPE_MISSING = "EDGE_TYPE_MISSING", e.EDGE_SOURCE_TARGET_SAME = "EDGE_SOURCE_TARGET_SAME", e.EDGE_SOURCE_TARGET_MISSING = "EDGE_SOURCE_TARGET_MISSING", e.EDGE_ORPHANED = "EDGE_ORPHANED", e.USEVUEFLOW_OPTIONS = "USEVUEFLOW_OPTIONS", e))(Pe || {});
const Mr = {
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
class Oe extends Error {
  constructor(t, ...n) {
    var o;
    super((o = Mr[t]) == null ? void 0 : o.call(Mr, ...n)), this.name = "VueFlowError", this.code = t, this.args = n;
  }
}
function Vi(e) {
  return "clientX" in e;
}
function zf(e) {
  return "sourceEvent" in e;
}
function tt(e, t) {
  const n = Vi(e);
  let o, i;
  return n ? (o = e.clientX, i = e.clientY) : "touches" in e && e.touches.length > 0 ? (o = e.touches[0].clientX, i = e.touches[0].clientY) : "changedTouches" in e && e.changedTouches.length > 0 ? (o = e.changedTouches[0].clientX, i = e.changedTouches[0].clientY) : (o = 0, i = 0), {
    x: o - (t?.left ?? 0),
    y: i - (t?.top ?? 0)
  };
}
const En = () => {
  var e;
  return typeof navigator < "u" && ((e = navigator?.userAgent) == null ? void 0 : e.indexOf("Mac")) >= 0;
};
function Rf(e) {
  var t, n;
  return {
    width: ((t = e.dimensions) == null ? void 0 : t.width) ?? e.width ?? 0,
    height: ((n = e.dimensions) == null ? void 0 : n.height) ?? e.height ?? 0
  };
}
function Mo(e, t = [1, 1]) {
  return {
    x: t[0] * Math.round(e.x / t[0]),
    y: t[1] * Math.round(e.y / t[1])
  };
}
const Bf = () => !0;
function Ko(e) {
  e?.classList.remove("valid", "connecting", "vue-flow__handle-valid", "vue-flow__handle-connecting");
}
function Lf(e, t, n) {
  const o = [], i = {
    x: e.x - n,
    y: e.y - n,
    width: n * 2,
    height: n * 2
  };
  for (const r of t.values())
    po(i, vo(r)) > 0 && o.push(r);
  return o;
}
const Vf = 250;
function Hf(e, t, n, o) {
  var i, r;
  let s = [], a = Number.POSITIVE_INFINITY;
  const l = Lf(e, n, t + Vf);
  for (const u of l) {
    const c = [...((i = u.handleBounds) == null ? void 0 : i.source) ?? [], ...((r = u.handleBounds) == null ? void 0 : r.target) ?? []];
    for (const d of c) {
      if (o.nodeId === d.nodeId && o.type === d.type && o.id === d.id)
        continue;
      const { x: h, y: v } = Kt(u, d, d.position, !0), E = Math.sqrt((h - e.x) ** 2 + (v - e.y) ** 2);
      E > t || (E < a ? (s = [{ ...d, x: h, y: v }], a = E) : E === a && s.push({ ...d, x: h, y: v }));
    }
  }
  if (!s.length)
    return null;
  if (s.length > 1) {
    const u = o.type === "source" ? "target" : "source";
    return s.find((c) => c.type === u) ?? s[0];
  }
  return s[0];
}
function Tr(e, {
  handle: t,
  connectionMode: n,
  fromNodeId: o,
  fromHandleId: i,
  fromType: r,
  doc: s,
  lib: a,
  flowId: l,
  isValidConnection: u = Bf
}, c, d, h, v) {
  const E = r === "target", b = t ? s.querySelector(`.${a}-flow__handle[data-id="${l}-${t?.nodeId}-${t?.id}-${t?.type}"]`) : null, { x: S, y: _ } = tt(e), P = s.elementFromPoint(S, _), y = P?.classList.contains(`${a}-flow__handle`) ? P : b, x = {
    handleDomNode: y,
    isValid: !1,
    connection: null,
    toHandle: null
  };
  if (y) {
    const R = na(void 0, y), Y = y.getAttribute("data-nodeid"), V = y.getAttribute("data-handleid"), U = y.classList.contains("connectable"), ie = y.classList.contains("connectableend");
    if (!Y || !R)
      return x;
    const H = {
      source: E ? Y : o,
      sourceHandle: E ? V : i,
      target: E ? o : Y,
      targetHandle: E ? i : V
    };
    x.connection = H;
    const k = U && ie && (n === Et.Strict ? E && R === "source" || !E && R === "target" : Y !== o || V !== i);
    x.isValid = k && u(H, {
      nodes: d,
      edges: c,
      sourceNode: h(H.source),
      targetNode: h(H.target)
    }), x.toHandle = oa(Y, R, V, v, n, !0);
  }
  return x;
}
function na(e, t) {
  return e || (t?.classList.contains("target") ? "target" : t?.classList.contains("source") ? "source" : null);
}
function Ff(e, t) {
  let n = null;
  return t ? n = "valid" : e && !t && (n = "invalid"), n;
}
function Yf(e, t) {
  let n = null;
  return t ? n = !0 : e && !t && (n = !1), n;
}
function oa(e, t, n, o, i, r = !1) {
  var s, a, l;
  const u = o.get(e);
  if (!u)
    return null;
  const c = i === Et.Strict ? (s = u.handleBounds) == null ? void 0 : s[t] : [...((a = u.handleBounds) == null ? void 0 : a.source) ?? [], ...((l = u.handleBounds) == null ? void 0 : l.target) ?? []], d = (n ? c?.find((h) => h.id === n) : c?.[0]) ?? null;
  return d && r ? { ...d, ...Kt(u, d, d.position, !0) } : d;
}
const gi = {
  [ae.Left]: ae.Right,
  [ae.Right]: ae.Left,
  [ae.Top]: ae.Bottom,
  [ae.Bottom]: ae.Top
}, Uf = ["production", "prod"];
function Tn(e, ...t) {
  ia() && console.warn(`[Vue Flow]: ${e}`, ...t);
}
function ia() {
  return !Uf.includes("production");
}
function Dr(e, t, n, o, i) {
  const r = t.querySelectorAll(`.vue-flow__handle.${e}`);
  return r?.length ? Array.from(r).map((s) => {
    const a = s.getBoundingClientRect();
    return {
      id: s.getAttribute("data-handleid"),
      type: e,
      nodeId: i,
      position: s.getAttribute("data-handlepos"),
      x: (a.left - n.left) / o,
      y: (a.top - n.top) / o,
      ...ko(s)
    };
  }) : null;
}
function mi(e, t, n, o, i, r = !1, s) {
  i.value = !1, e.selected ? (r || e.selected && t) && (o([e]), Ye(() => {
    s.blur();
  })) : n([e]);
}
function Ie(e) {
  return typeof K(e) < "u";
}
function Xf(e, t, n, o) {
  if (!e || !e.source || !e.target)
    return n(new Oe(Pe.EDGE_INVALID, e?.id ?? "[ID UNKNOWN]")), !1;
  let i;
  return xt(e) ? i = e : i = {
    ...e,
    id: Ws(e)
  }, i = Zs(i, void 0, o), Sf(i, t) ? !1 : i;
}
function Gf(e, t, n, o, i) {
  if (!t.source || !t.target)
    return i(new Oe(Pe.EDGE_INVALID, e.id)), !1;
  if (!n)
    return i(new Oe(Pe.EDGE_NOT_FOUND, e.id)), !1;
  const { id: r, ...s } = e;
  return {
    ...s,
    id: o ? Ws(t) : r,
    source: t.source,
    target: t.target,
    sourceHandle: t.sourceHandle,
    targetHandle: t.targetHandle
  };
}
function Ir(e, t, n) {
  const o = {}, i = [];
  for (let r = 0; r < e.length; ++r) {
    const s = e[r];
    if (!At(s)) {
      n(
        new Oe(Pe.NODE_INVALID, s?.id) || `[ID UNKNOWN|INDEX ${r}]`
      );
      continue;
    }
    const a = $f(s, t(s.id), s.parentNode);
    s.parentNode && (o[s.parentNode] = !0), i[r] = a;
  }
  for (const r of i) {
    const s = t(r.parentNode) || i.find((a) => a.id === r.parentNode);
    r.parentNode && !s && n(new Oe(Pe.NODE_MISSING_PARENT, r.id, r.parentNode)), (r.parentNode || o[r.id]) && (o[r.id] && (r.isParent = !0), s && (s.isParent = !0));
  }
  return i;
}
function Ar(e, t, n, o, i, r) {
  let s = i;
  const a = o.get(s) || /* @__PURE__ */ new Map();
  o.set(s, a.set(n, t)), s = `${i}-${e}`;
  const l = o.get(s) || /* @__PURE__ */ new Map();
  if (o.set(s, l.set(n, t)), r) {
    s = `${i}-${e}-${r}`;
    const u = o.get(s) || /* @__PURE__ */ new Map();
    o.set(s, u.set(n, t));
  }
}
function Qo(e, t, n) {
  e.clear();
  for (const o of n) {
    const { source: i, target: r, sourceHandle: s = null, targetHandle: a = null } = o, l = { edgeId: o.id, source: i, target: r, sourceHandle: s, targetHandle: a }, u = `${i}-${s}--${r}-${a}`, c = `${r}-${a}--${i}-${s}`;
    Ar("source", l, c, e, i, s), Ar("target", l, u, e, r, a);
  }
}
function Pr(e, t) {
  if (e.size !== t.size)
    return !1;
  for (const n of e)
    if (!t.has(n))
      return !1;
  return !0;
}
function Jo(e, t, n, o, i, r, s, a) {
  const l = [];
  for (const u of e) {
    const c = xt(u) ? u : Xf(u, a, i, r);
    if (!c)
      continue;
    const d = n(c.source), h = n(c.target);
    if (!d || !h) {
      i(new Oe(Pe.EDGE_SOURCE_TARGET_MISSING, c.id, c.source, c.target));
      continue;
    }
    if (!d) {
      i(new Oe(Pe.EDGE_SOURCE_MISSING, c.id, c.source));
      continue;
    }
    if (!h) {
      i(new Oe(Pe.EDGE_TARGET_MISSING, c.id, c.target));
      continue;
    }
    if (t && !t(c, {
      edges: a,
      nodes: s,
      sourceNode: d,
      targetNode: h
    })) {
      i(new Oe(Pe.EDGE_INVALID, c.id));
      continue;
    }
    const v = o(c.id);
    l.push({
      ...Zs(c, v, r),
      sourceNode: d,
      targetNode: h
    });
  }
  return l;
}
const Or = Symbol("vueFlow"), ra = Symbol("nodeId"), sa = Symbol("nodeRef"), Zf = Symbol("edgeId"), qf = Symbol("edgeRef"), To = Symbol("slots");
function aa(e) {
  const {
    vueFlowRef: t,
    snapToGrid: n,
    snapGrid: o,
    noDragClassName: i,
    nodeLookup: r,
    nodeExtent: s,
    nodeDragThreshold: a,
    viewport: l,
    autoPanOnNodeDrag: u,
    autoPanSpeed: c,
    nodesDraggable: d,
    panBy: h,
    findNode: v,
    multiSelectionActive: E,
    nodesSelectionActive: b,
    selectNodesOnDrag: S,
    removeSelectedElements: _,
    addSelectedNodes: P,
    updateNodePositions: y,
    emits: x
  } = Me(), { onStart: R, onDrag: Y, onStop: V, onClick: U, el: ie, disabled: H, id: X, selectable: k, dragHandle: oe } = e, f = $t(!1);
  let N = [], p, D = null, C = { x: void 0, y: void 0 }, O = { x: 0, y: 0 }, T = null, B = !1, Z = !1, j = 0, re = !1;
  const G = Qf(), F = ({ x: ue, y: ve }) => {
    C = { x: ue, y: ve };
    let m = !1;
    if (N = N.map((g) => {
      const w = { x: ue - g.distance.x, y: ve - g.distance.y }, { computedPosition: I } = Li(
        g,
        n.value ? Mo(w, o.value) : w,
        x.error,
        s.value,
        g.parentNode ? v(g.parentNode) : void 0
      );
      return m = m || g.position.x !== I.x || g.position.y !== I.y, g.position = I, g;
    }), Z = Z || m, !!m && (y(N, !0, !0), f.value = !0, T)) {
      const [g, w] = Wo({
        id: X,
        dragItems: N,
        findNode: v
      });
      Y({ event: T, node: g, nodes: w });
    }
  }, ee = () => {
    if (!D)
      return;
    const [ue, ve] = ea(O, D, c.value);
    if (ue !== 0 || ve !== 0) {
      const m = {
        x: (C.x ?? 0) - ue / l.value.zoom,
        y: (C.y ?? 0) - ve / l.value.zoom
      };
      h({ x: ue, y: ve }) && F(m);
    }
    j = requestAnimationFrame(ee);
  }, he = (ue, ve) => {
    B = !0;
    const m = v(X);
    !S.value && !E.value && m && (m.selected || _()), m && we(k) && S.value && mi(
      m,
      E.value,
      P,
      _,
      b,
      !1,
      ve
    );
    const g = G(ue.sourceEvent);
    if (C = g, N = Tf(r.value, d.value, g, X), N.length) {
      const [w, I] = Wo({
        id: X,
        dragItems: N,
        findNode: v
      });
      R({ event: ue.sourceEvent, node: w, nodes: I });
    }
  }, pe = (ue, ve) => {
    var m;
    ue.sourceEvent.type === "touchmove" && ue.sourceEvent.touches.length > 1 || (Z = !1, a.value === 0 && he(ue, ve), C = G(ue.sourceEvent), D = ((m = t.value) == null ? void 0 : m.getBoundingClientRect()) || null, O = tt(ue.sourceEvent, D));
  }, de = (ue, ve) => {
    const m = G(ue.sourceEvent);
    if (!re && B && u.value && (re = !0, ee()), !B) {
      const g = m.xSnapped - (C.x ?? 0), w = m.ySnapped - (C.y ?? 0);
      Math.sqrt(g * g + w * w) > a.value && he(ue, ve);
    }
    (C.x !== m.xSnapped || C.y !== m.ySnapped) && N.length && B && (T = ue.sourceEvent, O = tt(ue.sourceEvent, D), F(m));
  }, _e = (ue) => {
    let ve = !1;
    if (!B && !f.value && !E.value) {
      const m = ue.sourceEvent, g = G(m), w = g.xSnapped - (C.x ?? 0), I = g.ySnapped - (C.y ?? 0), M = Math.sqrt(w * w + I * I);
      M !== 0 && M <= a.value && (U?.(m), ve = !0);
    }
    if (N.length && !ve) {
      Z && (y(N, !1, !1), Z = !1);
      const [m, g] = Wo({
        id: X,
        dragItems: N,
        findNode: v
      });
      V({ event: ue.sourceEvent, node: m, nodes: g });
    }
    N = [], f.value = !1, re = !1, B = !1, C = { x: void 0, y: void 0 }, cancelAnimationFrame(j);
  };
  return Ne([() => we(H), ie], ([ue, ve], m, g) => {
    if (ve) {
      const w = Ze(ve);
      ue || (p = wc().on("start", (I) => pe(I, ve)).on("drag", (I) => de(I, ve)).on("end", (I) => _e(I)).filter((I) => {
        const M = I.target, Q = we(oe);
        return !I.button && (!i.value || !Cr(M, `.${i.value}`, ve) && (!Q || Cr(M, Q, ve)));
      }), w.call(p)), g(() => {
        w.on(".drag", null), p && (p.on("start", null), p.on("drag", null), p.on("end", null));
      });
    }
  }), f;
}
function Wf() {
  return {
    doubleClick: ne(),
    click: ne(),
    mouseEnter: ne(),
    mouseMove: ne(),
    mouseLeave: ne(),
    contextMenu: ne(),
    updateStart: ne(),
    update: ne(),
    updateEnd: ne()
  };
}
function Kf(e, t) {
  const n = Wf();
  return n.doubleClick.on((o) => {
    var i, r;
    t.edgeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.edgeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.edgeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.edgeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.edgeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.edgeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.updateStart.on((o) => {
    var i, r;
    t.edgeUpdateStart(o), (r = (i = e.events) == null ? void 0 : i.updateStart) == null || r.call(i, o);
  }), n.update.on((o) => {
    var i, r;
    t.edgeUpdate(o), (r = (i = e.events) == null ? void 0 : i.update) == null || r.call(i, o);
  }), n.updateEnd.on((o) => {
    var i, r;
    t.edgeUpdateEnd(o), (r = (i = e.events) == null ? void 0 : i.updateEnd) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function Qf() {
  const { viewport: e, snapGrid: t, snapToGrid: n, vueFlowRef: o } = Me();
  return (i) => {
    var r;
    const s = ((r = o.value) == null ? void 0 : r.getBoundingClientRect()) ?? { left: 0, top: 0 }, a = zf(i) ? i.sourceEvent : i, { x: l, y: u } = tt(a, s), c = bn({ x: l, y: u }, e.value), { x: d, y: h } = n.value ? Mo(c, t.value) : c;
    return {
      xSnapped: d,
      ySnapped: h,
      ...c
    };
  };
}
function Ln() {
  return !0;
}
function la({
  handleId: e,
  nodeId: t,
  type: n,
  isValidConnection: o,
  edgeUpdaterType: i,
  onEdgeUpdate: r,
  onEdgeUpdateEnd: s
}) {
  const {
    id: a,
    vueFlowRef: l,
    connectionMode: u,
    connectionRadius: c,
    connectOnClick: d,
    connectionClickStartHandle: h,
    nodesConnectable: v,
    autoPanOnConnect: E,
    autoPanSpeed: b,
    findNode: S,
    panBy: _,
    startConnection: P,
    updateConnection: y,
    endConnection: x,
    emits: R,
    viewport: Y,
    edges: V,
    nodes: U,
    isValidConnection: ie,
    nodeLookup: H
  } = Me();
  let X = null, k = !1, oe = null;
  function f(p) {
    var D;
    const C = we(n) === "target", O = Vi(p), T = _r(p.target), B = p.currentTarget;
    if (B && (O && p.button === 0 || !O)) {
      let Z = function(se) {
        m = tt(se, _e), F = Hf(
          bn(m, Y.value, !1, [1, 1]),
          c.value,
          H.value,
          I
        ), g || (w(), g = !0);
        const fe = Tr(
          se,
          {
            handle: F,
            connectionMode: u.value,
            fromNodeId: we(t),
            fromHandleId: we(e),
            fromType: C ? "target" : "source",
            isValidConnection: G,
            doc: T,
            lib: "vue",
            flowId: a,
            nodeLookup: H.value
          },
          V.value,
          U.value,
          S,
          H.value
        );
        oe = fe.handleDomNode, X = fe.connection, k = Yf(!!F, fe.isValid);
        const ye = {
          // from stays the same
          ...le,
          isValid: k,
          to: fe.toHandle && k ? wn({ x: fe.toHandle.x, y: fe.toHandle.y }, Y.value) : m,
          toHandle: fe.toHandle,
          toPosition: k && fe.toHandle ? fe.toHandle.position : gi[I.position],
          toNode: fe.toHandle ? H.value.get(fe.toHandle.nodeId) : null
        };
        if (k && F && le?.toHandle && ye.toHandle && le.toHandle.type === ye.toHandle.type && le.toHandle.nodeId === ye.toHandle.nodeId && le.toHandle.id === ye.toHandle.id && le.to.x === ye.to.x && le.to.y === ye.to.y)
          return;
        const $e = F ?? fe.toHandle;
        if (y(
          $e && k ? wn(
            {
              x: $e.x,
              y: $e.y
            },
            Y.value
          ) : m,
          $e,
          Ff(!!$e, k)
        ), le = ye, !F && !k && !oe)
          return Ko(ve);
        X && X.source !== X.target && oe && (Ko(ve), ve = oe, oe.classList.add("connecting", "vue-flow__handle-connecting"), oe.classList.toggle("valid", !!k), oe.classList.toggle("vue-flow__handle-valid", !!k));
      }, j = function(se) {
        "touches" in se && se.touches.length > 0 || ((F || oe) && X && k && (r ? r(se, X) : R.connect(X)), R.connectEnd(se), i && s?.(se), Ko(ve), cancelAnimationFrame(ee), x(se), g = !1, k = !1, X = null, oe = null, T.removeEventListener("mousemove", Z), T.removeEventListener("mouseup", j), T.removeEventListener("touchmove", Z), T.removeEventListener("touchend", j));
      };
      const re = S(we(t));
      let G = we(o) || ie.value || Ln;
      !G && re && (G = (C ? re.isValidSourcePos : re.isValidTargetPos) || Ln);
      let F, ee = 0;
      const { x: he, y: pe } = tt(p), de = na(we(i), B), _e = (D = l.value) == null ? void 0 : D.getBoundingClientRect();
      if (!_e || !de)
        return;
      const ue = oa(we(t), de, we(e), H.value, u.value);
      if (!ue)
        return;
      let ve, m = tt(p, _e), g = !1;
      const w = () => {
        if (!E.value)
          return;
        const [se, fe] = ea(m, _e, b.value);
        _({ x: se, y: fe }), ee = requestAnimationFrame(w);
      }, I = {
        ...ue,
        nodeId: we(t),
        type: de,
        position: ue.position
      }, M = H.value.get(we(t)), J = {
        inProgress: !0,
        isValid: null,
        from: Kt(M, I, ae.Left, !0),
        fromHandle: I,
        fromPosition: I.position,
        fromNode: M,
        to: m,
        toHandle: null,
        toPosition: gi[I.position],
        toNode: null
      };
      P(
        {
          nodeId: we(t),
          id: we(e),
          type: de,
          position: B?.getAttribute("data-handlepos") || ae.Top,
          ...m
        },
        {
          x: he - _e.left,
          y: pe - _e.top
        }
      ), R.connectStart({ event: p, nodeId: we(t), handleId: we(e), handleType: de });
      let le = J;
      T.addEventListener("mousemove", Z), T.addEventListener("mouseup", j), T.addEventListener("touchmove", Z), T.addEventListener("touchend", j);
    }
  }
  function N(p) {
    var D, C;
    if (!d.value)
      return;
    const O = we(n) === "target";
    if (!h.value) {
      R.clickConnectStart({ event: p, nodeId: we(t), handleId: we(e) }), P(
        {
          nodeId: we(t),
          type: we(n),
          id: we(e),
          position: ae.Top,
          ...tt(p)
        },
        void 0,
        !0
      );
      return;
    }
    let T = we(o) || ie.value || Ln;
    const B = S(we(t));
    if (!T && B && (T = (O ? B.isValidSourcePos : B.isValidTargetPos) || Ln), B && (typeof B.connectable > "u" ? v.value : B.connectable) === !1)
      return;
    const Z = _r(p.target), j = Tr(
      p,
      {
        handle: {
          nodeId: we(t),
          id: we(e),
          type: we(n),
          position: ae.Top,
          ...tt(p)
        },
        connectionMode: u.value,
        fromNodeId: h.value.nodeId,
        fromHandleId: h.value.id ?? null,
        fromType: h.value.type,
        isValidConnection: T,
        doc: Z,
        lib: "vue",
        flowId: a,
        nodeLookup: H.value
      },
      V.value,
      U.value,
      S,
      H.value
    ), re = ((D = j.connection) == null ? void 0 : D.source) === ((C = j.connection) == null ? void 0 : C.target);
    j.isValid && j.connection && !re && R.connect(j.connection), R.clickConnectEnd(p), x(p, !0);
  }
  return {
    handlePointerDown: f,
    handleClick: N
  };
}
function Jf() {
  return Vt(ra, "");
}
function ua(e) {
  const t = e ?? Jf() ?? "", n = Vt(sa, be(null)), { findNode: o, edges: i, emits: r } = Me(), s = o(t);
  return s || r.error(new Oe(Pe.NODE_NOT_FOUND, t)), {
    id: t,
    nodeEl: n,
    node: s,
    parentNode: ce(() => o(s.parentNode)),
    connectedEdges: ce(() => kt([s], i.value))
  };
}
function jf() {
  return {
    doubleClick: ne(),
    click: ne(),
    mouseEnter: ne(),
    mouseMove: ne(),
    mouseLeave: ne(),
    contextMenu: ne(),
    dragStart: ne(),
    drag: ne(),
    dragStop: ne()
  };
}
function eh(e, t) {
  const n = jf();
  return n.doubleClick.on((o) => {
    var i, r;
    t.nodeDoubleClick(o), (r = (i = e.events) == null ? void 0 : i.doubleClick) == null || r.call(i, o);
  }), n.click.on((o) => {
    var i, r;
    t.nodeClick(o), (r = (i = e.events) == null ? void 0 : i.click) == null || r.call(i, o);
  }), n.mouseEnter.on((o) => {
    var i, r;
    t.nodeMouseEnter(o), (r = (i = e.events) == null ? void 0 : i.mouseEnter) == null || r.call(i, o);
  }), n.mouseMove.on((o) => {
    var i, r;
    t.nodeMouseMove(o), (r = (i = e.events) == null ? void 0 : i.mouseMove) == null || r.call(i, o);
  }), n.mouseLeave.on((o) => {
    var i, r;
    t.nodeMouseLeave(o), (r = (i = e.events) == null ? void 0 : i.mouseLeave) == null || r.call(i, o);
  }), n.contextMenu.on((o) => {
    var i, r;
    t.nodeContextMenu(o), (r = (i = e.events) == null ? void 0 : i.contextMenu) == null || r.call(i, o);
  }), n.dragStart.on((o) => {
    var i, r;
    t.nodeDragStart(o), (r = (i = e.events) == null ? void 0 : i.dragStart) == null || r.call(i, o);
  }), n.drag.on((o) => {
    var i, r;
    t.nodeDrag(o), (r = (i = e.events) == null ? void 0 : i.drag) == null || r.call(i, o);
  }), n.dragStop.on((o) => {
    var i, r;
    t.nodeDragStop(o), (r = (i = e.events) == null ? void 0 : i.dragStop) == null || r.call(i, o);
  }), Object.entries(n).reduce(
    (o, [i, r]) => (o.emit[i] = r.trigger, o.on[i] = r.on, o),
    { emit: {}, on: {} }
  );
}
function ca() {
  const { getSelectedNodes: e, nodeExtent: t, updateNodePositions: n, findNode: o, snapGrid: i, snapToGrid: r, nodesDraggable: s, emits: a } = Me();
  return (l, u = !1) => {
    const c = r.value ? i.value[0] : 5, d = r.value ? i.value[1] : 5, h = u ? 4 : 1, v = l.x * c * h, E = l.y * d * h, b = [];
    for (const S of e.value)
      if (S.draggable || s && typeof S.draggable > "u") {
        const _ = { x: S.computedPosition.x + v, y: S.computedPosition.y + E }, { position: P } = Li(
          S,
          _,
          a.error,
          t.value,
          S.parentNode ? o(S.parentNode) : void 0
        );
        b.push({
          id: S.id,
          position: P,
          from: S.position,
          distance: { x: l.x, y: l.y },
          dimensions: S.dimensions
        });
      }
    n(b, !0, !1);
  };
}
const Vn = 0.1, th = (e) => ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
function gt() {
  return Tn("Viewport not initialized yet."), Promise.resolve(!1);
}
const nh = {
  zoomIn: gt,
  zoomOut: gt,
  zoomTo: gt,
  fitView: gt,
  setCenter: gt,
  fitBounds: gt,
  project: (e) => e,
  screenToFlowCoordinate: (e) => e,
  flowToScreenCoordinate: (e) => e,
  setViewport: gt,
  setTransform: gt,
  getViewport: () => ({ x: 0, y: 0, zoom: 1 }),
  getTransform: () => ({ x: 0, y: 0, zoom: 1 }),
  viewportInitialized: !1
};
function oh(e) {
  function t(o, i) {
    return new Promise((r) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(i?.interpolate === "linear" ? fn : Kn).scaleBy(
        jo(e.d3Selection, i?.duration, i?.ease, () => {
          r(!0);
        }),
        o
      ) : r(!1);
    });
  }
  function n(o, i, r, s) {
    return new Promise((a) => {
      var l;
      const { x: u, y: c } = Gs({ x: -o, y: -i }, e.translateExtent), d = Wt.translate(-u, -c).scale(r);
      e.d3Selection && e.d3Zoom ? (l = e.d3Zoom) == null || l.interpolate(s?.interpolate === "linear" ? fn : Kn).transform(
        jo(e.d3Selection, s?.duration, s?.ease, () => {
          a(!0);
        }),
        d
      ) : a(!1);
    });
  }
  return ce(() => e.d3Zoom && e.d3Selection && e.dimensions.width && e.dimensions.height ? {
    viewportInitialized: !0,
    // todo: allow passing scale as option
    zoomIn: (i) => t(1.2, i),
    zoomOut: (i) => t(1 / 1.2, i),
    zoomTo: (i, r) => new Promise((s) => {
      e.d3Selection && e.d3Zoom ? e.d3Zoom.interpolate(r?.interpolate === "linear" ? fn : Kn).scaleTo(
        jo(e.d3Selection, r?.duration, r?.ease, () => {
          s(!0);
        }),
        i
      ) : s(!1);
    }),
    setViewport: (i, r) => n(i.x, i.y, i.zoom, r),
    setTransform: (i, r) => n(i.x, i.y, i.zoom, r),
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
      padding: Vn,
      includeHiddenNodes: !1,
      duration: 0
    }) => {
      var r, s;
      const a = [];
      for (const h of e.nodes)
        h.dimensions.width && h.dimensions.height && (i?.includeHiddenNodes || !h.hidden) && (!((r = i.nodes) != null && r.length) || (s = i.nodes) != null && s.length && i.nodes.includes(h.id)) && a.push(h);
      if (!a.length)
        return Promise.resolve(!1);
      const l = Bi(a), { x: u, y: c, zoom: d } = wr(
        l,
        e.dimensions.width,
        e.dimensions.height,
        i.minZoom ?? e.minZoom,
        i.maxZoom ?? e.maxZoom,
        i.padding ?? Vn
      );
      return n(u, c, d, i);
    },
    setCenter: (i, r, s) => {
      const a = typeof s?.zoom < "u" ? s.zoom : e.maxZoom, l = e.dimensions.width / 2 - i * a, u = e.dimensions.height / 2 - r * a;
      return n(l, u, a, s);
    },
    fitBounds: (i, r = { padding: Vn }) => {
      const { x: s, y: a, zoom: l } = wr(
        i,
        e.dimensions.width,
        e.dimensions.height,
        e.minZoom,
        e.maxZoom,
        r.padding ?? Vn
      );
      return n(s, a, l, r);
    },
    project: (i) => bn(i, e.viewport, e.snapToGrid, e.snapGrid),
    screenToFlowCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x - r,
          y: i.y - s
        };
        return bn(a, e.viewport, e.snapToGrid, e.snapGrid);
      }
      return { x: 0, y: 0 };
    },
    flowToScreenCoordinate: (i) => {
      if (e.vueFlowRef) {
        const { x: r, y: s } = e.vueFlowRef.getBoundingClientRect(), a = {
          x: i.x + r,
          y: i.y + s
        };
        return wn(a, e.viewport);
      }
      return { x: 0, y: 0 };
    }
  } : nh);
}
function jo(e, t = 0, n = th, o = () => {
}) {
  const i = typeof t == "number" && t > 0;
  return i || o(), i ? e.transition().duration(t).ease(n).on("end", o) : e;
}
function ih(e, t, n) {
  const o = us(!0);
  return o.run(() => {
    const i = () => {
      o.run(() => {
        let b, S, _ = !!(n.nodes.value.length || n.edges.value.length);
        b = Ht([e.modelValue, () => {
          var P, y;
          return (y = (P = e.modelValue) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setElements(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ht(
          [n.nodes, n.edges, () => n.edges.value.length, () => n.nodes.value.length],
          ([P, y]) => {
            var x;
            (x = e.modelValue) != null && x.value && Array.isArray(e.modelValue.value) && (b?.pause(), e.modelValue.value = [...P, ...y], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Zn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, r = () => {
      o.run(() => {
        let b, S, _ = !!n.nodes.value.length;
        b = Ht([e.nodes, () => {
          var P, y;
          return (y = (P = e.nodes) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setNodes(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ht(
          [n.nodes, () => n.nodes.value.length],
          ([P]) => {
            var y;
            (y = e.nodes) != null && y.value && Array.isArray(e.nodes.value) && (b?.pause(), e.nodes.value = [...P], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Zn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, s = () => {
      o.run(() => {
        let b, S, _ = !!n.edges.value.length;
        b = Ht([e.edges, () => {
          var P, y;
          return (y = (P = e.edges) == null ? void 0 : P.value) == null ? void 0 : y.length;
        }], ([P]) => {
          P && Array.isArray(P) && (S?.pause(), n.setEdges(P), !S && !_ && P.length ? _ = !0 : S?.resume());
        }), S = Ht(
          [n.edges, () => n.edges.value.length],
          ([P]) => {
            var y;
            (y = e.edges) != null && y.value && Array.isArray(e.edges.value) && (b?.pause(), e.edges.value = [...P], Ye(() => {
              b?.resume();
            }));
          },
          { immediate: _ }
        ), Zn(() => {
          b?.stop(), S?.stop();
        });
      });
    }, a = () => {
      o.run(() => {
        Ne(
          () => t.maxZoom,
          () => {
            t.maxZoom && Ie(t.maxZoom) && n.setMaxZoom(t.maxZoom);
          },
          {
            immediate: !0
          }
        );
      });
    }, l = () => {
      o.run(() => {
        Ne(
          () => t.minZoom,
          () => {
            t.minZoom && Ie(t.minZoom) && n.setMinZoom(t.minZoom);
          },
          { immediate: !0 }
        );
      });
    }, u = () => {
      o.run(() => {
        Ne(
          () => t.translateExtent,
          () => {
            t.translateExtent && Ie(t.translateExtent) && n.setTranslateExtent(t.translateExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, c = () => {
      o.run(() => {
        Ne(
          () => t.nodeExtent,
          () => {
            t.nodeExtent && Ie(t.nodeExtent) && n.setNodeExtent(t.nodeExtent);
          },
          {
            immediate: !0
          }
        );
      });
    }, d = () => {
      o.run(() => {
        Ne(
          () => t.applyDefault,
          () => {
            Ie(t.applyDefault) && (n.applyDefault.value = t.applyDefault);
          },
          {
            immediate: !0
          }
        );
      });
    }, h = () => {
      o.run(() => {
        const b = async (S) => {
          let _ = S;
          typeof t.autoConnect == "function" && (_ = await t.autoConnect(S)), _ !== !1 && n.addEdges([_]);
        };
        Ne(
          () => t.autoConnect,
          () => {
            Ie(t.autoConnect) && (n.autoConnect.value = t.autoConnect);
          },
          { immediate: !0 }
        ), Ne(
          n.autoConnect,
          (S, _, P) => {
            S ? n.onConnect(b) : n.hooks.value.connect.off(b), P(() => {
              n.hooks.value.connect.off(b);
            });
          },
          { immediate: !0 }
        );
      });
    }, v = () => {
      const b = [
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
      for (const S of Object.keys(t)) {
        const _ = S;
        if (!b.includes(_)) {
          const P = Ee(() => t[_]), y = n[_];
          ki(y) && o.run(() => {
            Ne(
              P,
              (x) => {
                Ie(x) && (y.value = x);
              },
              { immediate: !0 }
            );
          });
        }
      }
    };
    (() => {
      i(), r(), s(), l(), a(), u(), c(), d(), h(), v();
    })();
  }), () => o.stop();
}
function rh() {
  return {
    edgesChange: ne(),
    nodesChange: ne(),
    nodeDoubleClick: ne(),
    nodeClick: ne(),
    nodeMouseEnter: ne(),
    nodeMouseMove: ne(),
    nodeMouseLeave: ne(),
    nodeContextMenu: ne(),
    nodeDragStart: ne(),
    nodeDrag: ne(),
    nodeDragStop: ne(),
    nodesInitialized: ne(),
    miniMapNodeClick: ne(),
    miniMapNodeDoubleClick: ne(),
    miniMapNodeMouseEnter: ne(),
    miniMapNodeMouseMove: ne(),
    miniMapNodeMouseLeave: ne(),
    connect: ne(),
    connectStart: ne(),
    connectEnd: ne(),
    clickConnectStart: ne(),
    clickConnectEnd: ne(),
    paneReady: ne(),
    init: ne(),
    move: ne(),
    moveStart: ne(),
    moveEnd: ne(),
    selectionDragStart: ne(),
    selectionDrag: ne(),
    selectionDragStop: ne(),
    selectionContextMenu: ne(),
    selectionStart: ne(),
    selectionEnd: ne(),
    viewportChangeStart: ne(),
    viewportChange: ne(),
    viewportChangeEnd: ne(),
    paneScroll: ne(),
    paneClick: ne(),
    paneContextMenu: ne(),
    paneMouseEnter: ne(),
    paneMouseMove: ne(),
    paneMouseLeave: ne(),
    edgeContextMenu: ne(),
    edgeMouseEnter: ne(),
    edgeMouseMove: ne(),
    edgeMouseLeave: ne(),
    edgeDoubleClick: ne(),
    edgeClick: ne(),
    edgeUpdateStart: ne(),
    edgeUpdate: ne(),
    edgeUpdateEnd: ne(),
    updateNodeInternals: ne(),
    error: ne((e) => Tn(e.message))
  };
}
function sh(e, t) {
  const n = en();
  fl(() => {
    for (const [i, r] of Object.entries(t.value)) {
      const s = (a) => {
        e(i, a);
      };
      r.setEmitter(s), pn(r.removeEmitter), r.setHasEmitListeners(() => o(i)), pn(r.removeHasEmitListeners);
    }
  });
  function o(i) {
    var r;
    const s = ah(i);
    return !!((r = n?.vnode.props) == null ? void 0 : r[s]);
  }
}
function ah(e) {
  const [t, ...n] = e.split(":");
  return `on${t.replace(/(?:^|-)(\w)/g, (i, r) => r.toUpperCase())}${n.length ? `:${n.join(":")}` : ""}`;
}
function da() {
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
    selectionMode: Ri.Full,
    paneDragging: !1,
    preventScrolling: !0,
    zoomOnScroll: !0,
    zoomOnPinch: !0,
    zoomOnDoubleClick: !0,
    panOnScroll: !1,
    panOnScrollSpeed: 0.5,
    panOnScrollMode: hn.Free,
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
      type: Ct.Bezier,
      style: {}
    },
    connectionMode: Et.Loose,
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
    multiSelectionKeyCode: En() ? "Meta" : "Control",
    zoomActivationKeyCode: En() ? "Meta" : "Control",
    deleteKeyCode: "Backspace",
    panActivationKeyCode: "Space",
    hooks: rh(),
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
const lh = [
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
function uh(e, t, n) {
  const o = oh(e), i = (m) => {
    const g = m ?? [];
    e.hooks.updateNodeInternals.trigger(g);
  }, r = (m) => xf(m, e.nodes, e.edges), s = (m) => Ef(m, e.nodes, e.edges), a = (m) => kt(m, e.edges), l = ({ id: m, type: g, nodeId: w }) => {
    var I;
    const M = m ? `-${g}-${m}` : `-${g}`;
    return Array.from(((I = e.connectionLookup.get(`${w}${M}`)) == null ? void 0 : I.values()) ?? []);
  }, u = (m) => {
    if (m)
      return t.value.get(m);
  }, c = (m) => {
    if (m)
      return n.value.get(m);
  }, d = (m, g, w) => {
    var I, M;
    const Q = [];
    for (const J of m) {
      const le = {
        id: J.id,
        type: "position",
        dragging: w,
        from: J.from
      };
      if (g && (le.position = J.position, J.parentNode)) {
        const se = u(J.parentNode);
        le.position = {
          x: le.position.x - (((I = se?.computedPosition) == null ? void 0 : I.x) ?? 0),
          y: le.position.y - (((M = se?.computedPosition) == null ? void 0 : M.y) ?? 0)
        };
      }
      Q.push(le);
    }
    Q?.length && e.hooks.nodesChange.trigger(Q);
  }, h = (m) => {
    if (!e.vueFlowRef)
      return;
    const g = e.vueFlowRef.querySelector(".vue-flow__transformationpane");
    if (!g)
      return;
    const w = window.getComputedStyle(g), { m22: I } = new window.DOMMatrixReadOnly(w.transform), M = [];
    for (const Q of m) {
      const J = Q, le = u(J.id);
      if (le) {
        const se = ko(J.nodeElement);
        if (!!(se.width && se.height && (le.dimensions.width !== se.width || le.dimensions.height !== se.height || J.forceUpdate))) {
          const ye = J.nodeElement.getBoundingClientRect();
          le.dimensions = se, le.handleBounds.source = Dr("source", J.nodeElement, ye, I, le.id), le.handleBounds.target = Dr("target", J.nodeElement, ye, I, le.id), M.push({
            id: le.id,
            type: "dimensions",
            dimensions: se
          });
        }
      }
    }
    !e.fitViewOnInitDone && e.fitViewOnInit && o.value.fitView().then(() => {
      e.fitViewOnInitDone = !0;
    }), M.length && e.hooks.nodesChange.trigger(M);
  }, v = (m, g) => {
    const w = /* @__PURE__ */ new Set(), I = /* @__PURE__ */ new Set();
    for (const J of m)
      At(J) ? w.add(J.id) : xt(J) && I.add(J.id);
    const M = _t(t.value, w, !0), Q = _t(n.value, I);
    if (e.multiSelectionActive) {
      for (const J of w)
        M.push(mt(J, g));
      for (const J of I)
        Q.push(mt(J, g));
    }
    M.length && e.hooks.nodesChange.trigger(M), Q.length && e.hooks.edgesChange.trigger(Q);
  }, E = (m) => {
    if (e.multiSelectionActive) {
      const g = m.map((w) => mt(w.id, !0));
      e.hooks.nodesChange.trigger(g);
      return;
    }
    e.hooks.nodesChange.trigger(_t(t.value, new Set(m.map((g) => g.id)), !0)), e.hooks.edgesChange.trigger(_t(n.value));
  }, b = (m) => {
    if (e.multiSelectionActive) {
      const g = m.map((w) => mt(w.id, !0));
      e.hooks.edgesChange.trigger(g);
      return;
    }
    e.hooks.edgesChange.trigger(_t(n.value, new Set(m.map((g) => g.id)))), e.hooks.nodesChange.trigger(_t(t.value, /* @__PURE__ */ new Set(), !0));
  }, S = (m) => {
    v(m, !0);
  }, _ = (m) => {
    const w = (m || e.nodes).map((I) => (I.selected = !1, mt(I.id, !1)));
    e.hooks.nodesChange.trigger(w);
  }, P = (m) => {
    const w = (m || e.edges).map((I) => (I.selected = !1, mt(I.id, !1)));
    e.hooks.edgesChange.trigger(w);
  }, y = (m) => {
    if (!m || !m.length)
      return v([], !1);
    const g = m.reduce(
      (w, I) => {
        const M = mt(I.id, !1);
        return At(I) ? w.nodes.push(M) : w.edges.push(M), w;
      },
      { nodes: [], edges: [] }
    );
    g.nodes.length && e.hooks.nodesChange.trigger(g.nodes), g.edges.length && e.hooks.edgesChange.trigger(g.edges);
  }, x = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([m, e.maxZoom]), e.minZoom = m;
  }, R = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.scaleExtent([e.minZoom, m]), e.maxZoom = m;
  }, Y = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.translateExtent(m), e.translateExtent = m;
  }, V = (m) => {
    e.nodeExtent = m, i();
  }, U = (m) => {
    var g;
    (g = e.d3Zoom) == null || g.clickDistance(m);
  }, ie = (m) => {
    e.nodesDraggable = m, e.nodesConnectable = m, e.elementsSelectable = m;
  }, H = (m) => {
    const g = m instanceof Function ? m(e.nodes) : m;
    !e.initialized && !g.length || (e.nodes = Ir(g, u, e.hooks.error.trigger));
  }, X = (m) => {
    const g = m instanceof Function ? m(e.edges) : m;
    if (!e.initialized && !g.length)
      return;
    const w = Jo(
      g,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    );
    Qo(e.connectionLookup, n.value, w), e.edges = w;
  }, k = (m) => {
    const g = m instanceof Function ? m([...e.nodes, ...e.edges]) : m;
    !e.initialized && !g.length || (H(g.filter(At)), X(g.filter(xt)));
  }, oe = (m) => {
    let g = m instanceof Function ? m(e.nodes) : m;
    g = Array.isArray(g) ? g : [g];
    const w = Ir(g, u, e.hooks.error.trigger), I = [];
    for (const M of w)
      I.push(Er(M));
    I.length && e.hooks.nodesChange.trigger(I);
  }, f = (m) => {
    let g = m instanceof Function ? m(e.edges) : m;
    g = Array.isArray(g) ? g : [g];
    const w = Jo(
      g,
      e.isValidConnection,
      u,
      c,
      e.hooks.error.trigger,
      e.defaultEdgeOptions,
      e.nodes,
      e.edges
    ), I = [];
    for (const M of w)
      I.push(Er(M));
    I.length && e.hooks.edgesChange.trigger(I);
  }, N = (m, g = !0, w = !1) => {
    const I = m instanceof Function ? m(e.nodes) : m, M = Array.isArray(I) ? I : [I], Q = [], J = [];
    function le(fe) {
      const ye = a(fe);
      for (const $e of ye)
        (!Ie($e.deletable) || $e.deletable) && J.push(Sr($e.id, $e.source, $e.target, $e.sourceHandle, $e.targetHandle));
    }
    function se(fe) {
      const ye = [];
      for (const $e of e.nodes)
        $e.parentNode === fe && ye.push($e);
      if (ye.length) {
        for (const $e of ye)
          Q.push(xr($e.id));
        g && le(ye);
        for (const $e of ye)
          se($e.id);
      }
    }
    for (const fe of M) {
      const ye = typeof fe == "string" ? u(fe) : fe;
      ye && (Ie(ye.deletable) && !ye.deletable || (Q.push(xr(ye.id)), g && le([ye]), w && se(ye.id)));
    }
    J.length && e.hooks.edgesChange.trigger(J), Q.length && e.hooks.nodesChange.trigger(Q);
  }, p = (m) => {
    const g = m instanceof Function ? m(e.edges) : m, w = Array.isArray(g) ? g : [g], I = [];
    for (const M of w) {
      const Q = typeof M == "string" ? c(M) : M;
      Q && (Ie(Q.deletable) && !Q.deletable || I.push(
        Sr(
          typeof M == "string" ? M : M.id,
          Q.source,
          Q.target,
          Q.sourceHandle,
          Q.targetHandle
        )
      ));
    }
    e.hooks.edgesChange.trigger(I);
  }, D = (m, g, w = !0) => {
    const I = c(m.id);
    if (!I)
      return !1;
    const M = e.edges.indexOf(I), Q = Gf(m, g, I, w, e.hooks.error.trigger);
    if (Q) {
      const [J] = Jo(
        [Q],
        e.isValidConnection,
        u,
        c,
        e.hooks.error.trigger,
        e.defaultEdgeOptions,
        e.nodes,
        e.edges
      );
      return e.edges = e.edges.map((le, se) => se === M ? J : le), Qo(e.connectionLookup, n.value, [J]), J;
    }
    return !1;
  }, C = (m, g, w = { replace: !1 }) => {
    const I = c(m);
    if (!I)
      return;
    const M = typeof g == "function" ? g(I) : g;
    I.data = w.replace ? M : { ...I.data, ...M };
  }, O = (m) => $r(m, e.nodes), T = (m) => {
    const g = $r(m, e.edges);
    return Qo(e.connectionLookup, n.value, g), g;
  }, B = (m, g, w = { replace: !1 }) => {
    const I = u(m);
    if (!I)
      return;
    const M = typeof g == "function" ? g(I) : g;
    w.replace ? e.nodes.splice(e.nodes.indexOf(I), 1, M) : Object.assign(I, M);
  }, Z = (m, g, w = { replace: !1 }) => {
    const I = u(m);
    if (!I)
      return;
    const M = typeof g == "function" ? g(I) : g;
    I.data = w.replace ? M : { ...I.data, ...M };
  }, j = (m, g, w = !1) => {
    w ? e.connectionClickStartHandle = m : e.connectionStartHandle = m, e.connectionEndHandle = null, e.connectionStatus = null, g && (e.connectionPosition = g);
  }, re = (m, g = null, w = null) => {
    e.connectionStartHandle && (e.connectionPosition = m, e.connectionEndHandle = g, e.connectionStatus = w);
  }, G = (m, g) => {
    e.connectionPosition = { x: Number.NaN, y: Number.NaN }, e.connectionEndHandle = null, e.connectionStatus = null, g ? e.connectionClickStartHandle = null : e.connectionStartHandle = null;
  }, F = (m) => {
    const g = bf(m), w = g ? null : ln(m) ? m : u(m.id);
    return !g && !w ? [null, null, g] : [g ? m : vo(w), w, g];
  }, ee = (m, g = !0, w = e.nodes) => {
    const [I, M, Q] = F(m);
    if (!I)
      return [];
    const J = [];
    for (const le of w || e.nodes) {
      if (!Q && (le.id === M.id || !le.computedPosition))
        continue;
      const se = vo(le), fe = po(se, I);
      (g && fe > 0 || fe >= se.width * se.height || fe >= Number(I.width) * Number(I.height)) && J.push(le);
    }
    return J;
  }, he = (m, g, w = !0) => {
    const [I] = F(m);
    if (!I)
      return !1;
    const M = po(I, g);
    return w && M > 0 || M >= Number(I.width) * Number(I.height);
  }, pe = (m) => {
    const { viewport: g, dimensions: w, d3Zoom: I, d3Selection: M, translateExtent: Q } = e;
    if (!I || !M || !m.x && !m.y)
      return !1;
    const J = Wt.translate(g.x + m.x, g.y + m.y).scale(g.zoom), le = [
      [0, 0],
      [w.width, w.height]
    ], se = I.constrain()(J, le, Q), fe = e.viewport.x !== se.x || e.viewport.y !== se.y || e.viewport.zoom !== se.k;
    return I.transform(M, se), fe;
  }, de = (m) => {
    const g = m instanceof Function ? m(e) : m, w = [
      "d3Zoom",
      "d3Selection",
      "d3ZoomHandler",
      "viewportRef",
      "vueFlowRef",
      "dimensions",
      "hooks"
    ];
    Ie(g.defaultEdgeOptions) && (e.defaultEdgeOptions = g.defaultEdgeOptions);
    const I = g.modelValue || g.nodes || g.edges ? [] : void 0;
    I && (g.modelValue && I.push(...g.modelValue), g.nodes && I.push(...g.nodes), g.edges && I.push(...g.edges), k(I));
    const M = () => {
      Ie(g.maxZoom) && R(g.maxZoom), Ie(g.minZoom) && x(g.minZoom), Ie(g.translateExtent) && Y(g.translateExtent);
    };
    for (const Q of Object.keys(g)) {
      const J = Q, le = g[J];
      ![...lh, ...w].includes(J) && Ie(le) && (e[J] = le);
    }
    ri(() => e.d3Zoom).not.toBeNull().then(M), e.initialized || (e.initialized = !0);
  };
  return {
    updateNodePositions: d,
    updateNodeDimensions: h,
    setElements: k,
    setNodes: H,
    setEdges: X,
    addNodes: oe,
    addEdges: f,
    removeNodes: N,
    removeEdges: p,
    findNode: u,
    findEdge: c,
    updateEdge: D,
    updateEdgeData: C,
    updateNode: B,
    updateNodeData: Z,
    applyEdgeChanges: T,
    applyNodeChanges: O,
    addSelectedElements: S,
    addSelectedNodes: E,
    addSelectedEdges: b,
    setMinZoom: x,
    setMaxZoom: R,
    setTranslateExtent: Y,
    setNodeExtent: V,
    setPaneClickDistance: U,
    removeSelectedElements: y,
    removeSelectedNodes: _,
    removeSelectedEdges: P,
    startConnection: j,
    updateConnection: re,
    endConnection: G,
    setInteractive: ie,
    setState: de,
    getIntersectingNodes: ee,
    getIncomers: r,
    getOutgoers: s,
    getConnectedEdges: a,
    getHandleConnections: l,
    isNodeIntersecting: he,
    panBy: pe,
    fitView: (m) => o.value.fitView(m),
    zoomIn: (m) => o.value.zoomIn(m),
    zoomOut: (m) => o.value.zoomOut(m),
    zoomTo: (m, g) => o.value.zoomTo(m, g),
    setViewport: (m, g) => o.value.setViewport(m, g),
    setTransform: (m, g) => o.value.setTransform(m, g),
    getViewport: () => o.value.getViewport(),
    getTransform: () => o.value.getTransform(),
    setCenter: (m, g, w) => o.value.setCenter(m, g, w),
    fitBounds: (m, g) => o.value.fitBounds(m, g),
    project: (m) => o.value.project(m),
    screenToFlowCoordinate: (m) => o.value.screenToFlowCoordinate(m),
    flowToScreenCoordinate: (m) => o.value.flowToScreenCoordinate(m),
    toObject: () => {
      const m = [], g = [];
      for (const w of e.nodes) {
        const {
          computedPosition: I,
          handleBounds: M,
          selected: Q,
          dimensions: J,
          isParent: le,
          resizing: se,
          dragging: fe,
          events: ye,
          ...$e
        } = w;
        m.push($e);
      }
      for (const w of e.edges) {
        const { selected: I, sourceNode: M, targetNode: Q, events: J, ...le } = w;
        g.push(le);
      }
      return JSON.parse(
        JSON.stringify({
          nodes: m,
          edges: g,
          position: [e.viewport.x, e.viewport.y],
          zoom: e.viewport.zoom,
          viewport: e.viewport
        })
      );
    },
    fromObject: (m) => new Promise((g) => {
      const { nodes: w, edges: I, position: M, zoom: Q, viewport: J } = m;
      w && H(w), I && X(I);
      const [le, se] = J?.x && J?.y ? [J.x, J.y] : M ?? [null, null];
      if (le && se) {
        const fe = J?.zoom || Q || e.viewport.zoom;
        return ri(() => o.value.viewportInitialized).toBe(!0).then(() => {
          o.value.setViewport({
            x: le,
            y: se,
            zoom: fe
          }).then(() => {
            g(!0);
          });
        });
      } else
        g(!0);
    }),
    updateNodeInternals: i,
    viewportHelper: o,
    $reset: () => {
      const m = da();
      if (e.edges = [], e.nodes = [], e.d3Zoom && e.d3Selection) {
        const g = Wt.translate(m.defaultViewport.x ?? 0, m.defaultViewport.y ?? 0).scale(Bt(m.defaultViewport.zoom ?? 1, m.minZoom, m.maxZoom)), w = e.viewportRef.getBoundingClientRect(), I = [
          [0, 0],
          [w.width, w.height]
        ], M = e.d3Zoom.constrain()(g, I, m.translateExtent);
        e.d3Zoom.transform(e.d3Selection, M);
      }
      de(m);
    },
    $destroy: () => {
    }
  };
}
const ch = ["data-id", "data-handleid", "data-nodeid", "data-handlepos"], dh = {
  name: "Handle",
  compatConfig: { MODE: 3 }
}, Qt = /* @__PURE__ */ Se({
  ...dh,
  props: {
    id: { default: null },
    type: {},
    position: { default: () => ae.Top },
    isValidConnection: { type: Function },
    connectable: { type: [Boolean, Number, String, Function], default: void 0 },
    connectableStart: { type: Boolean, default: !0 },
    connectableEnd: { type: Boolean, default: !0 }
  },
  setup(e, { expose: t }) {
    const n = ul(e, ["position", "connectable", "connectableStart", "connectableEnd", "id"]), o = Ee(() => n.type ?? "source"), i = Ee(() => n.isValidConnection ?? null), {
      id: r,
      connectionStartHandle: s,
      connectionClickStartHandle: a,
      connectionEndHandle: l,
      vueFlowRef: u,
      nodesConnectable: c,
      noDragClassName: d,
      noPanClassName: h
    } = Me(), { id: v, node: E, nodeEl: b, connectedEdges: S } = ua(), _ = be(), P = Ee(() => typeof e.connectableStart < "u" ? e.connectableStart : !0), y = Ee(() => typeof e.connectableEnd < "u" ? e.connectableEnd : !0), x = Ee(
      () => {
        var X, k, oe, f, N, p;
        return ((X = s.value) == null ? void 0 : X.nodeId) === v && ((k = s.value) == null ? void 0 : k.id) === e.id && ((oe = s.value) == null ? void 0 : oe.type) === o.value || ((f = l.value) == null ? void 0 : f.nodeId) === v && ((N = l.value) == null ? void 0 : N.id) === e.id && ((p = l.value) == null ? void 0 : p.type) === o.value;
      }
    ), R = Ee(
      () => {
        var X, k, oe;
        return ((X = a.value) == null ? void 0 : X.nodeId) === v && ((k = a.value) == null ? void 0 : k.id) === e.id && ((oe = a.value) == null ? void 0 : oe.type) === o.value;
      }
    ), { handlePointerDown: Y, handleClick: V } = la({
      nodeId: v,
      handleId: e.id,
      isValidConnection: i,
      type: o
    }), U = ce(() => typeof e.connectable == "string" && e.connectable === "single" ? !S.value.some((X) => {
      const k = X[`${o.value}Handle`];
      return X[o.value] !== v ? !1 : k ? k === e.id : !0;
    }) : typeof e.connectable == "number" ? S.value.filter((X) => {
      const k = X[`${o.value}Handle`];
      return X[o.value] !== v ? !1 : k ? k === e.id : !0;
    }).length < e.connectable : typeof e.connectable == "function" ? e.connectable(E, S.value) : Ie(e.connectable) ? e.connectable : c.value);
    rt(() => {
      var X;
      if (!E.dimensions.width || !E.dimensions.height)
        return;
      const k = (X = E.handleBounds[o.value]) == null ? void 0 : X.find((O) => O.id === e.id);
      if (!u.value || k)
        return;
      const oe = u.value.querySelector(".vue-flow__transformationpane");
      if (!b.value || !_.value || !oe || !e.id)
        return;
      const f = b.value.getBoundingClientRect(), N = _.value.getBoundingClientRect(), p = window.getComputedStyle(oe), { m22: D } = new window.DOMMatrixReadOnly(p.transform), C = {
        id: e.id,
        position: e.position,
        x: (N.left - f.left) / D,
        y: (N.top - f.top) / D,
        type: o.value,
        nodeId: v,
        ...ko(_.value)
      };
      E.handleBounds[o.value] = [...E.handleBounds[o.value] ?? [], C];
    });
    function ie(X) {
      const k = Vi(X);
      U.value && P.value && (k && X.button === 0 || !k) && Y(X);
    }
    function H(X) {
      !v || !a.value && !P.value || U.value && V(X);
    }
    return t({
      handleClick: V,
      handlePointerDown: Y,
      onClick: H,
      onPointerDown: ie
    }), (X, k) => (L(), te("div", {
      ref_key: "handle",
      ref: _,
      "data-id": `${K(r)}-${K(v)}-${e.id}-${o.value}`,
      "data-handleid": e.id,
      "data-nodeid": K(v),
      "data-handlepos": X.position,
      class: Be(["vue-flow__handle", [
        `vue-flow__handle-${X.position}`,
        `vue-flow__handle-${e.id}`,
        K(d),
        K(h),
        o.value,
        {
          connectable: U.value,
          connecting: R.value,
          connectablestart: P.value,
          connectableend: y.value,
          connectionindicator: U.value && (P.value && !x.value || y.value && x.value)
        }
      ]]),
      onMousedown: ie,
      onTouchstartPassive: ie,
      onClick: H
    }, [
      Te(X.$slots, "default", { id: X.id })
    ], 42, ch));
  }
}), Do = function({
  sourcePosition: e = ae.Bottom,
  targetPosition: t = ae.Top,
  label: n,
  connectable: o = !0,
  isValidTargetPos: i,
  isValidSourcePos: r,
  data: s
}) {
  const a = s.label ?? n;
  return [
    xe(Qt, { type: "target", position: t, connectable: o, isValidConnection: i }),
    typeof a != "string" && a ? xe(a) : xe(Ae, [a]),
    xe(Qt, { type: "source", position: e, connectable: o, isValidConnection: r })
  ];
};
Do.props = ["sourcePosition", "targetPosition", "label", "isValidTargetPos", "isValidSourcePos", "connectable", "data"];
Do.inheritAttrs = !1;
Do.compatConfig = { MODE: 3 };
const fh = Do, Io = function({
  targetPosition: e = ae.Top,
  label: t,
  connectable: n = !0,
  isValidTargetPos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    xe(Qt, { type: "target", position: e, connectable: n, isValidConnection: o }),
    typeof r != "string" && r ? xe(r) : xe(Ae, [r])
  ];
};
Io.props = ["targetPosition", "label", "isValidTargetPos", "connectable", "data"];
Io.inheritAttrs = !1;
Io.compatConfig = { MODE: 3 };
const hh = Io, Ao = function({
  sourcePosition: e = ae.Bottom,
  label: t,
  connectable: n = !0,
  isValidSourcePos: o,
  data: i
}) {
  const r = i.label ?? t;
  return [
    typeof r != "string" && r ? xe(r) : xe(Ae, [r]),
    xe(Qt, { type: "source", position: e, connectable: n, isValidConnection: o })
  ];
};
Ao.props = ["sourcePosition", "label", "isValidSourcePos", "connectable", "data"];
Ao.inheritAttrs = !1;
Ao.compatConfig = { MODE: 3 };
const vh = Ao, ph = ["transform"], gh = ["width", "height", "x", "y", "rx", "ry"], mh = ["y"], yh = {
  name: "EdgeText",
  compatConfig: { MODE: 3 }
}, _h = /* @__PURE__ */ Se({
  ...yh,
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
    const t = be({ x: 0, y: 0, width: 0, height: 0 }), n = be(null), o = ce(() => `translate(${e.x - t.value.width / 2} ${e.y - t.value.height / 2})`);
    rt(i), Ne([() => e.x, () => e.y, n, () => e.label], i);
    function i() {
      if (!n.value)
        return;
      const r = n.value.getBBox();
      (r.width !== t.value.width || r.height !== t.value.height) && (t.value = r);
    }
    return (r, s) => (L(), te("g", {
      transform: o.value,
      class: "vue-flow__edge-textwrapper"
    }, [
      r.labelShowBg ? (L(), te("rect", {
        key: 0,
        class: "vue-flow__edge-textbg",
        width: `${t.value.width + 2 * r.labelBgPadding[0]}px`,
        height: `${t.value.height + 2 * r.labelBgPadding[1]}px`,
        x: -r.labelBgPadding[0],
        y: -r.labelBgPadding[1],
        style: Re(r.labelBgStyle),
        rx: r.labelBgBorderRadius,
        ry: r.labelBgBorderRadius
      }, null, 12, gh)) : me("", !0),
      W("text", io(r.$attrs, {
        ref_key: "el",
        ref: n,
        class: "vue-flow__edge-text",
        y: t.value.height / 2,
        dy: "0.3em",
        style: r.labelStyle
      }), [
        Te(r.$slots, "default", {}, () => [
          typeof r.label != "string" ? (L(), De(Nt(r.label), { key: 0 })) : (L(), te(Ae, { key: 1 }, [
            qn(ke(r.label), 1)
          ], 64))
        ])
      ], 16, mh)
    ], 8, ph));
  }
}), wh = ["id", "d", "marker-end", "marker-start"], bh = ["d", "stroke-width"], $h = {
  name: "BaseEdge",
  inheritAttrs: !1,
  compatConfig: { MODE: 3 }
}, Po = /* @__PURE__ */ Se({
  ...$h,
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
    const n = be(null), o = be(null), i = be(null), r = Mi();
    return t({
      pathEl: n,
      interactionEl: o,
      labelEl: i
    }), (s, a) => (L(), te(Ae, null, [
      W("path", io(K(r), {
        id: s.id,
        ref_key: "pathEl",
        ref: n,
        d: s.path,
        class: "vue-flow__edge-path",
        "marker-end": s.markerEnd,
        "marker-start": s.markerStart
      }), null, 16, wh),
      s.interactionWidth ? (L(), te("path", {
        key: 0,
        ref_key: "interactionEl",
        ref: o,
        fill: "none",
        d: s.path,
        "stroke-width": s.interactionWidth,
        "stroke-opacity": 0,
        class: "vue-flow__edge-interaction"
      }, null, 8, bh)) : me("", !0),
      s.label && s.labelX && s.labelY ? (L(), De(_h, {
        key: 1,
        ref_key: "labelEl",
        ref: i,
        x: s.labelX,
        y: s.labelY,
        label: s.label,
        "label-show-bg": s.labelShowBg,
        "label-bg-style": s.labelBgStyle,
        "label-bg-padding": s.labelBgPadding,
        "label-bg-border-radius": s.labelBgBorderRadius,
        "label-style": s.labelStyle
      }, null, 8, ["x", "y", "label", "label-show-bg", "label-bg-style", "label-bg-padding", "label-bg-border-radius", "label-style"])) : me("", !0)
    ], 64));
  }
});
function fa({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o
}) {
  const i = Math.abs(n - e) / 2, r = n < e ? n + i : n - i, s = Math.abs(o - t) / 2, a = o < t ? o + s : o - s;
  return [r, a, i, s];
}
function ha({
  sourceX: e,
  sourceY: t,
  targetX: n,
  targetY: o,
  sourceControlX: i,
  sourceControlY: r,
  targetControlX: s,
  targetControlY: a
}) {
  const l = e * 0.125 + i * 0.375 + s * 0.375 + n * 0.125, u = t * 0.125 + r * 0.375 + a * 0.375 + o * 0.125, c = Math.abs(l - e), d = Math.abs(u - t);
  return [l, u, c, d];
}
function Hn(e, t) {
  return e >= 0 ? 0.5 * e : t * 25 * Math.sqrt(-e);
}
function zr({ pos: e, x1: t, y1: n, x2: o, y2: i, c: r }) {
  let s, a;
  switch (e) {
    case ae.Left:
      s = t - Hn(t - o, r), a = n;
      break;
    case ae.Right:
      s = t + Hn(o - t, r), a = n;
      break;
    case ae.Top:
      s = t, a = n - Hn(n - i, r);
      break;
    case ae.Bottom:
      s = t, a = n + Hn(i - n, r);
      break;
  }
  return [s, a];
}
function va(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top,
    curvature: a = 0.25
  } = e, [l, u] = zr({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r,
    c: a
  }), [c, d] = zr({
    pos: s,
    x1: i,
    y1: r,
    x2: t,
    y2: n,
    c: a
  }), [h, v, E, b] = ha({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: l,
    sourceControlY: u,
    targetControlX: c,
    targetControlY: d
  });
  return [
    `M${t},${n} C${l},${u} ${c},${d} ${i},${r}`,
    h,
    v,
    E,
    b
  ];
}
function Rr({ pos: e, x1: t, y1: n, x2: o, y2: i }) {
  let r, s;
  switch (e) {
    case ae.Left:
    case ae.Right:
      r = 0.5 * (t + o), s = n;
      break;
    case ae.Top:
    case ae.Bottom:
      r = t, s = 0.5 * (n + i);
      break;
  }
  return [r, s];
}
function pa(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top
  } = e, [a, l] = Rr({
    pos: o,
    x1: t,
    y1: n,
    x2: i,
    y2: r
  }), [u, c] = Rr({
    pos: s,
    x1: i,
    y1: r,
    x2: t,
    y2: n
  }), [d, h, v, E] = ha({
    sourceX: t,
    sourceY: n,
    targetX: i,
    targetY: r,
    sourceControlX: a,
    sourceControlY: l,
    targetControlX: u,
    targetControlY: c
  });
  return [
    `M${t},${n} C${a},${l} ${u},${c} ${i},${r}`,
    d,
    h,
    v,
    E
  ];
}
const Br = {
  [ae.Left]: { x: -1, y: 0 },
  [ae.Right]: { x: 1, y: 0 },
  [ae.Top]: { x: 0, y: -1 },
  [ae.Bottom]: { x: 0, y: 1 }
};
function Eh({
  source: e,
  sourcePosition: t = ae.Bottom,
  target: n
}) {
  return t === ae.Left || t === ae.Right ? e.x < n.x ? { x: 1, y: 0 } : { x: -1, y: 0 } : e.y < n.y ? { x: 0, y: 1 } : { x: 0, y: -1 };
}
function Lr(e, t) {
  return Math.sqrt((t.x - e.x) ** 2 + (t.y - e.y) ** 2);
}
function xh({
  source: e,
  sourcePosition: t = ae.Bottom,
  target: n,
  targetPosition: o = ae.Top,
  center: i,
  offset: r
}) {
  const s = Br[t], a = Br[o], l = { x: e.x + s.x * r, y: e.y + s.y * r }, u = { x: n.x + a.x * r, y: n.y + a.y * r }, c = Eh({
    source: l,
    sourcePosition: t,
    target: u
  }), d = c.x !== 0 ? "x" : "y", h = c[d];
  let v, E, b;
  const S = { x: 0, y: 0 }, _ = { x: 0, y: 0 }, [P, y, x, R] = fa({
    sourceX: e.x,
    sourceY: e.y,
    targetX: n.x,
    targetY: n.y
  });
  if (s[d] * a[d] === -1) {
    E = i.x ?? P, b = i.y ?? y;
    const V = [
      { x: E, y: l.y },
      { x: E, y: u.y }
    ], U = [
      { x: l.x, y: b },
      { x: u.x, y: b }
    ];
    s[d] === h ? v = d === "x" ? V : U : v = d === "x" ? U : V;
  } else {
    const V = [{ x: l.x, y: u.y }], U = [{ x: u.x, y: l.y }];
    if (d === "x" ? v = s.x === h ? U : V : v = s.y === h ? V : U, t === o) {
      const oe = Math.abs(e[d] - n[d]);
      if (oe <= r) {
        const f = Math.min(r - 1, r - oe);
        s[d] === h ? S[d] = (l[d] > e[d] ? -1 : 1) * f : _[d] = (u[d] > n[d] ? -1 : 1) * f;
      }
    }
    if (t !== o) {
      const oe = d === "x" ? "y" : "x", f = s[d] === a[oe], N = l[oe] > u[oe], p = l[oe] < u[oe];
      (s[d] === 1 && (!f && N || f && p) || s[d] !== 1 && (!f && p || f && N)) && (v = d === "x" ? V : U);
    }
    const ie = { x: l.x + S.x, y: l.y + S.y }, H = { x: u.x + _.x, y: u.y + _.y }, X = Math.max(Math.abs(ie.x - v[0].x), Math.abs(H.x - v[0].x)), k = Math.max(Math.abs(ie.y - v[0].y), Math.abs(H.y - v[0].y));
    X >= k ? (E = (ie.x + H.x) / 2, b = v[0].y) : (E = v[0].x, b = (ie.y + H.y) / 2);
  }
  return [[
    e,
    { x: l.x + S.x, y: l.y + S.y },
    ...v,
    { x: u.x + _.x, y: u.y + _.y },
    n
  ], E, b, x, R];
}
function Sh(e, t, n, o) {
  const i = Math.min(Lr(e, t) / 2, Lr(t, n) / 2, o), { x: r, y: s } = t;
  if (e.x === r && r === n.x || e.y === s && s === n.y)
    return `L${r} ${s}`;
  if (e.y === s) {
    const u = e.x < n.x ? -1 : 1, c = e.y < n.y ? 1 : -1;
    return `L ${r + i * u},${s}Q ${r},${s} ${r},${s + i * c}`;
  }
  const a = e.x < n.x ? 1 : -1, l = e.y < n.y ? -1 : 1;
  return `L ${r},${s + i * l}Q ${r},${s} ${r + i * a},${s}`;
}
function yi(e) {
  const {
    sourceX: t,
    sourceY: n,
    sourcePosition: o = ae.Bottom,
    targetX: i,
    targetY: r,
    targetPosition: s = ae.Top,
    borderRadius: a = 5,
    centerX: l,
    centerY: u,
    offset: c = 20
  } = e, [d, h, v, E, b] = xh({
    source: { x: t, y: n },
    sourcePosition: o,
    target: { x: i, y: r },
    targetPosition: s,
    center: { x: l, y: u },
    offset: c
  });
  return [d.reduce((_, P, y) => {
    let x;
    return y > 0 && y < d.length - 1 ? x = Sh(d[y - 1], P, d[y + 1], a) : x = `${y === 0 ? "M" : "L"}${P.x} ${P.y}`, _ += x, _;
  }, ""), h, v, E, b];
}
function Nh(e) {
  const { sourceX: t, sourceY: n, targetX: o, targetY: i } = e, [r, s, a, l] = fa({
    sourceX: t,
    sourceY: n,
    targetX: o,
    targetY: i
  });
  return [`M ${t},${n}L ${o},${i}`, r, s, a, l];
}
const Ch = Se({
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
      const [n, o, i] = Nh(e);
      return xe(Po, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), kh = Ch, Mh = Se({
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
      const [n, o, i] = yi({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return xe(Po, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), ga = Mh, Th = Se({
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
    return () => xe(ga, { ...e, ...t, borderRadius: 0 });
  }
}), Dh = Th, Ih = Se({
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
      const [n, o, i] = va({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return xe(Po, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Ah = Ih, Ph = Se({
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
      const [n, o, i] = pa({
        ...e,
        sourcePosition: e.sourcePosition ?? ae.Bottom,
        targetPosition: e.targetPosition ?? ae.Top
      });
      return xe(Po, {
        path: n,
        labelX: o,
        labelY: i,
        ...t,
        ...e
      });
    };
  }
}), Oh = Ph, zh = {
  input: vh,
  default: fh,
  output: hh
}, Rh = {
  default: Ah,
  straight: kh,
  step: Dh,
  smoothstep: ga,
  simplebezier: Oh
};
function Bh(e, t, n) {
  const o = ce(() => (b) => t.value.get(b)), i = ce(() => (b) => n.value.get(b)), r = ce(() => {
    const b = {
      ...Rh,
      ...e.edgeTypes
    }, S = Object.keys(b);
    for (const _ of e.edges)
      _.type && !S.includes(_.type) && (b[_.type] = _.type);
    return b;
  }), s = ce(() => {
    const b = {
      ...zh,
      ...e.nodeTypes
    }, S = Object.keys(b);
    for (const _ of e.nodes)
      _.type && !S.includes(_.type) && (b[_.type] = _.type);
    return b;
  }), a = ce(() => e.onlyRenderVisibleElements ? Js(
    e.nodes,
    {
      x: 0,
      y: 0,
      width: e.dimensions.width,
      height: e.dimensions.height
    },
    e.viewport,
    !0
  ) : e.nodes), l = ce(() => {
    if (e.onlyRenderVisibleElements) {
      const b = [];
      for (const S of e.edges) {
        const _ = t.value.get(S.source), P = t.value.get(S.target);
        Pf({
          sourcePos: _.computedPosition || { x: 0, y: 0 },
          targetPos: P.computedPosition || { x: 0, y: 0 },
          sourceWidth: _.dimensions.width,
          sourceHeight: _.dimensions.height,
          targetWidth: P.dimensions.width,
          targetHeight: P.dimensions.height,
          width: e.dimensions.width,
          height: e.dimensions.height,
          viewport: e.viewport
        }) && b.push(S);
      }
      return b;
    }
    return e.edges;
  }), u = ce(() => [...a.value, ...l.value]), c = ce(() => {
    const b = [];
    for (const S of e.nodes)
      S.selected && b.push(S);
    return b;
  }), d = ce(() => {
    const b = [];
    for (const S of e.edges)
      S.selected && b.push(S);
    return b;
  }), h = ce(() => [
    ...c.value,
    ...d.value
  ]), v = ce(() => {
    const b = [];
    for (const S of e.nodes)
      S.dimensions.width && S.dimensions.height && S.handleBounds !== void 0 && b.push(S);
    return b;
  }), E = ce(
    () => a.value.length > 0 && v.value.length === a.value.length
  );
  return {
    getNode: o,
    getEdge: i,
    getElements: u,
    getEdgeTypes: r,
    getNodeTypes: s,
    getEdges: l,
    getNodes: a,
    getSelectedElements: h,
    getSelectedNodes: c,
    getSelectedEdges: d,
    getNodesInitialized: v,
    areNodesInitialized: E
  };
}
class Mt {
  constructor() {
    this.currentId = 0, this.flows = /* @__PURE__ */ new Map();
  }
  static getInstance() {
    var t;
    const n = (t = en()) == null ? void 0 : t.appContext.app, o = n?.config.globalProperties.$vueFlowStorage ?? Mt.instance;
    return Mt.instance = o ?? new Mt(), n && (n.config.globalProperties.$vueFlowStorage = Mt.instance), Mt.instance;
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
    const o = da(), i = dl(o), r = {};
    for (const [h, v] of Object.entries(i.hooks)) {
      const E = `on${h.charAt(0).toUpperCase() + h.slice(1)}`;
      r[E] = v.on;
    }
    const s = {};
    for (const [h, v] of Object.entries(i.hooks))
      s[h] = v.trigger;
    const a = ce(() => {
      const h = /* @__PURE__ */ new Map();
      for (const v of i.nodes)
        h.set(v.id, v);
      return h;
    }), l = ce(() => {
      const h = /* @__PURE__ */ new Map();
      for (const v of i.edges)
        h.set(v.id, v);
      return h;
    }), u = Bh(i, a, l), c = uh(i, a, l);
    c.setState({ ...i, ...n });
    const d = {
      ...r,
      ...u,
      ...c,
      ...Ml(i),
      nodeLookup: a,
      edgeLookup: l,
      emits: s,
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
function Me(e) {
  const t = Mt.getInstance(), n = ls(), o = typeof e == "object", i = o ? e : { id: e }, r = i.id, s = r ?? n?.vueFlowId;
  let a;
  if (n) {
    const l = Vt(Or, null);
    typeof l < "u" && l !== null && (!s || l.id === s) && (a = l);
  }
  if (a || s && (a = t.get(s)), !a || s && a.id !== s) {
    const l = r ?? t.getId(), u = t.create(l, i);
    a = u, (n ?? us(!0)).run(() => {
      Ne(
        u.applyDefault,
        (d, h, v) => {
          const E = (S) => {
            u.applyNodeChanges(S);
          }, b = (S) => {
            u.applyEdgeChanges(S);
          };
          d ? (u.onNodesChange(E), u.onEdgesChange(b)) : (u.hooks.value.nodesChange.off(E), u.hooks.value.edgesChange.off(b)), v(() => {
            u.hooks.value.nodesChange.off(E), u.hooks.value.edgesChange.off(b);
          });
        },
        { immediate: !0 }
      ), pn(() => {
        if (a) {
          const d = t.get(a.id);
          d ? d.$destroy() : Tn(`No store instance found for id ${a.id} in storage.`);
        }
      });
    });
  } else
    o && a.setState(i);
  if (n && (Ot(Or, a), n.vueFlowId = a.id), o) {
    const l = en();
    l?.type.name !== "VueFlow" && a.emits.error(new Oe(Pe.USEVUEFLOW_OPTIONS));
  }
  return a;
}
function Lh(e) {
  const { emits: t, dimensions: n } = Me();
  let o;
  rt(() => {
    const i = () => {
      var r, s;
      if (!e.value || !(((s = (r = e.value).checkVisibility) == null ? void 0 : s.call(r)) ?? !0))
        return;
      const a = ko(e.value);
      (a.width === 0 || a.height === 0) && t.error(new Oe(Pe.MISSING_VIEWPORT_DIMENSIONS)), n.value = { width: a.width || 500, height: a.height || 500 };
    };
    i(), window.addEventListener("resize", i), e.value && (o = new ResizeObserver(() => i()), o.observe(e.value)), Eo(() => {
      window.removeEventListener("resize", i), o && e.value && o.unobserve(e.value);
    });
  });
}
const Vh = {
  name: "UserSelection",
  compatConfig: { MODE: 3 }
}, Hh = /* @__PURE__ */ Se({
  ...Vh,
  props: {
    userSelectionRect: {}
  },
  setup(e) {
    return (t, n) => (L(), te("div", {
      class: "vue-flow__selection vue-flow__container",
      style: Re({
        width: `${t.userSelectionRect.width}px`,
        height: `${t.userSelectionRect.height}px`,
        transform: `translate(${t.userSelectionRect.x}px, ${t.userSelectionRect.y}px)`
      })
    }, null, 4));
  }
}), Fh = ["tabIndex"], Yh = {
  name: "NodesSelection",
  compatConfig: { MODE: 3 }
}, Uh = /* @__PURE__ */ Se({
  ...Yh,
  setup(e) {
    const { emits: t, viewport: n, getSelectedNodes: o, noPanClassName: i, disableKeyboardA11y: r, userSelectionActive: s } = Me(), a = ca(), l = be(null), u = aa({
      el: l,
      onStart(E) {
        t.selectionDragStart(E), t.nodeDragStart(E);
      },
      onDrag(E) {
        t.selectionDrag(E), t.nodeDrag(E);
      },
      onStop(E) {
        t.selectionDragStop(E), t.nodeDragStop(E);
      }
    });
    rt(() => {
      var E;
      r.value || (E = l.value) == null || E.focus({ preventScroll: !0 });
    });
    const c = ce(() => Bi(o.value)), d = ce(() => ({
      width: `${c.value.width}px`,
      height: `${c.value.height}px`,
      top: `${c.value.y}px`,
      left: `${c.value.x}px`
    }));
    function h(E) {
      t.selectionContextMenu({ event: E, nodes: o.value });
    }
    function v(E) {
      r.value || Xt[E.key] && (E.preventDefault(), a(
        {
          x: Xt[E.key].x,
          y: Xt[E.key].y
        },
        E.shiftKey
      ));
    }
    return (E, b) => !K(s) && c.value.width && c.value.height ? (L(), te("div", {
      key: 0,
      class: Be(["vue-flow__nodesselection vue-flow__container", K(i)]),
      style: Re({ transform: `translate(${K(n).x}px,${K(n).y}px) scale(${K(n).zoom})` })
    }, [
      W("div", {
        ref_key: "el",
        ref: l,
        class: Be([{ dragging: K(u) }, "vue-flow__nodesselection-rect"]),
        style: Re(d.value),
        tabIndex: K(r) ? void 0 : -1,
        onContextmenu: h,
        onKeydown: v
      }, null, 46, Fh)
    ], 6)) : me("", !0);
  }
});
function Xh(e, t) {
  return {
    x: e.clientX - t.left,
    y: e.clientY - t.top
  };
}
const Gh = {
  name: "Pane",
  compatConfig: { MODE: 3 }
}, Zh = /* @__PURE__ */ Se({
  ...Gh,
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
      userSelectionActive: r,
      removeSelectedElements: s,
      userSelectionRect: a,
      elementsSelectable: l,
      nodesSelectionActive: u,
      getSelectedEdges: c,
      getSelectedNodes: d,
      removeNodes: h,
      removeEdges: v,
      selectionMode: E,
      deleteKeyCode: b,
      multiSelectionKeyCode: S,
      multiSelectionActive: _,
      edgeLookup: P,
      nodeLookup: y,
      connectionLookup: x,
      defaultEdgeOptions: R,
      connectionStartHandle: Y,
      panOnDrag: V
    } = Me(), U = $t(null), ie = $t(/* @__PURE__ */ new Set()), H = $t(/* @__PURE__ */ new Set()), X = $t(null), k = Ee(() => l.value && (e.isSelecting || r.value)), oe = Ee(() => Y.value !== null);
    let f = !1, N = !1;
    const p = vn(b, { actInsideInputWithModifier: !1 }), D = vn(S);
    Ne(p, (G) => {
      G && (h(d.value), v(c.value), u.value = !1);
    }), Ne(D, (G) => {
      _.value = G;
    });
    function C(G, F) {
      return (ee) => {
        ee.target === F && G?.(ee);
      };
    }
    function O(G) {
      if (f || oe.value) {
        f = !1;
        return;
      }
      i.paneClick(G), s(), u.value = !1;
    }
    function T(G) {
      var F;
      if (Array.isArray(V.value) && ((F = V.value) != null && F.includes(2))) {
        G.preventDefault();
        return;
      }
      i.paneContextMenu(G);
    }
    function B(G) {
      i.paneScroll(G);
    }
    function Z(G) {
      var F, ee, he;
      if (X.value = ((F = t.value) == null ? void 0 : F.getBoundingClientRect()) ?? null, !l.value || !e.isSelecting || G.button !== 0 || G.target !== U.value || !X.value)
        return;
      (he = (ee = G.target) == null ? void 0 : ee.setPointerCapture) == null || he.call(ee, G.pointerId);
      const { x: pe, y: de } = Xh(G, X.value);
      N = !0, f = !1, s(), a.value = {
        width: 0,
        height: 0,
        startX: pe,
        startY: de,
        x: pe,
        y: de
      }, i.selectionStart(G);
    }
    function j(G) {
      var F;
      if (!X.value || !a.value)
        return;
      f = !0;
      const { x: ee, y: he } = tt(G, X.value), { startX: pe = 0, startY: de = 0 } = a.value, _e = {
        startX: pe,
        startY: de,
        x: ee < pe ? ee : pe,
        y: he < de ? he : de,
        width: Math.abs(ee - pe),
        height: Math.abs(he - de)
      }, ue = ie.value, ve = H.value;
      ie.value = new Set(
        Js(n.value, _e, o.value, E.value === Ri.Partial, !0).map(
          (g) => g.id
        )
      ), H.value = /* @__PURE__ */ new Set();
      const m = ((F = R.value) == null ? void 0 : F.selectable) ?? !0;
      for (const g of ie.value) {
        const w = x.value.get(g);
        if (w)
          for (const { edgeId: I } of w.values()) {
            const M = P.value.get(I);
            M && (M.selectable ?? m) && H.value.add(I);
          }
      }
      if (!Pr(ue, ie.value)) {
        const g = _t(y.value, ie.value, !0);
        i.nodesChange(g);
      }
      if (!Pr(ve, H.value)) {
        const g = _t(P.value, H.value);
        i.edgesChange(g);
      }
      a.value = _e, r.value = !0, u.value = !1;
    }
    function re(G) {
      var F;
      G.button !== 0 || !N || ((F = G.target) == null || F.releasePointerCapture(G.pointerId), !r.value && a.value && G.target === U.value && O(G), r.value = !1, a.value = null, u.value = ie.value.size > 0, i.selectionEnd(G), e.selectionKeyPressed && (f = !1), N = !1);
    }
    return (G, F) => (L(), te("div", {
      ref_key: "container",
      ref: U,
      class: Be(["vue-flow__pane vue-flow__container", { selection: G.isSelecting }]),
      onClick: F[0] || (F[0] = (ee) => k.value ? void 0 : C(O, U.value)(ee)),
      onContextmenu: F[1] || (F[1] = (ee) => C(T, U.value)(ee)),
      onWheelPassive: F[2] || (F[2] = (ee) => C(B, U.value)(ee)),
      onPointerenter: F[3] || (F[3] = (ee) => k.value ? void 0 : K(i).paneMouseEnter(ee)),
      onPointerdown: F[4] || (F[4] = (ee) => k.value ? Z(ee) : K(i).paneMouseMove(ee)),
      onPointermove: F[5] || (F[5] = (ee) => k.value ? j(ee) : K(i).paneMouseMove(ee)),
      onPointerup: F[6] || (F[6] = (ee) => k.value ? re(ee) : void 0),
      onPointerleave: F[7] || (F[7] = (ee) => K(i).paneMouseLeave(ee))
    }, [
      Te(G.$slots, "default"),
      K(r) && K(a) ? (L(), De(Hh, {
        key: 0,
        "user-selection-rect": K(a)
      }, null, 8, ["user-selection-rect"])) : me("", !0),
      K(u) && K(d).length ? (L(), De(Uh, { key: 1 })) : me("", !0)
    ], 34));
  }
}), qh = {
  name: "Transform",
  compatConfig: { MODE: 3 }
}, Wh = /* @__PURE__ */ Se({
  ...qh,
  setup(e) {
    const { viewport: t, fitViewOnInit: n, fitViewOnInitDone: o } = Me(), i = ce(() => n.value ? !o.value : !1), r = ce(() => `translate(${t.value.x}px,${t.value.y}px) scale(${t.value.zoom})`);
    return (s, a) => (L(), te("div", {
      class: "vue-flow__transformationpane vue-flow__container",
      style: Re({ transform: r.value, opacity: i.value ? 0 : void 0 })
    }, [
      Te(s.$slots, "default")
    ], 4));
  }
}), Kh = {
  name: "Viewport",
  compatConfig: { MODE: 3 }
}, Qh = /* @__PURE__ */ Se({
  ...Kh,
  setup(e) {
    const {
      minZoom: t,
      maxZoom: n,
      defaultViewport: o,
      translateExtent: i,
      zoomActivationKeyCode: r,
      selectionKeyCode: s,
      panActivationKeyCode: a,
      panOnScroll: l,
      panOnScrollMode: u,
      panOnScrollSpeed: c,
      panOnDrag: d,
      zoomOnDoubleClick: h,
      zoomOnPinch: v,
      zoomOnScroll: E,
      preventScrolling: b,
      noWheelClassName: S,
      noPanClassName: _,
      emits: P,
      connectionStartHandle: y,
      userSelectionActive: x,
      paneDragging: R,
      d3Zoom: Y,
      d3Selection: V,
      d3ZoomHandler: U,
      viewport: ie,
      viewportRef: H,
      paneClickDistance: X
    } = Me();
    Lh(H);
    const k = $t(!1), oe = $t(!1);
    let f = null, N = !1, p = 0, D = {
      x: 0,
      y: 0,
      zoom: 0
    };
    const C = vn(a), O = vn(s), T = vn(r), B = Ee(
      () => (!O.value || O.value && s.value === !0) && (C.value || d.value)
    ), Z = Ee(() => C.value || l.value), j = Ee(() => s.value === !0 && B.value !== !0), re = Ee(
      () => O.value && s.value !== !0 || x.value || j.value
    ), G = Ee(() => y.value !== null);
    rt(() => {
      if (!H.value) {
        Tn("Viewport element is missing");
        return;
      }
      const de = H.value, _e = de.getBoundingClientRect(), ue = vf().clickDistance(X.value).scaleExtent([t.value, n.value]).translateExtent(i.value), ve = Ze(de).call(ue), m = ve.on("wheel.zoom"), g = Wt.translate(o.value.x ?? 0, o.value.y ?? 0).scale(Bt(o.value.zoom ?? 1, t.value, n.value)), w = [
        [0, 0],
        [_e.width, _e.height]
      ], I = ue.constrain()(g, w, i.value);
      ue.transform(ve, I), ue.wheelDelta(pi), Y.value = ue, V.value = ve, U.value = m, ie.value = { x: I.x, y: I.y, zoom: I.k }, ue.on("start", (M) => {
        var Q;
        if (!M.sourceEvent)
          return null;
        p = M.sourceEvent.button, k.value = !0;
        const J = he(M.transform);
        ((Q = M.sourceEvent) == null ? void 0 : Q.type) === "mousedown" && (R.value = !0), D = J, P.viewportChangeStart(J), P.moveStart({ event: M, flowTransform: J });
      }), ue.on("end", (M) => {
        if (!M.sourceEvent)
          return null;
        if (k.value = !1, R.value = !1, F(B.value, p ?? 0) && !N && P.paneContextMenu(M.sourceEvent), N = !1, ee(D, M.transform)) {
          const Q = he(M.transform);
          D = Q, P.viewportChangeEnd(Q), P.moveEnd({ event: M, flowTransform: Q });
        }
      }), ue.filter((M) => {
        var Q;
        const J = T.value || E.value, le = v.value && M.ctrlKey, se = M.button, fe = M.type === "wheel";
        if (se === 1 && M.type === "mousedown" && (pe(M, "vue-flow__node") || pe(M, "vue-flow__edge")))
          return !0;
        if (!B.value && !J && !Z.value && !h.value && !v.value || x.value || G.value && !fe || !h.value && M.type === "dblclick" || pe(M, S.value) && fe || pe(M, _.value) && (!fe || Z.value && fe && !T.value) || !v.value && M.ctrlKey && fe || !J && !Z.value && !le && fe)
          return !1;
        if (!v && M.type === "touchstart" && ((Q = M.touches) == null ? void 0 : Q.length) > 1)
          return M.preventDefault(), !1;
        if (!B.value && (M.type === "mousedown" || M.type === "touchstart") || j.value && Array.isArray(d.value) && d.value.includes(0) && se === 0 || Array.isArray(d.value) && !d.value.includes(se) && (M.type === "mousedown" || M.type === "touchstart"))
          return !1;
        const ye = Array.isArray(d.value) && d.value.includes(se) || s.value === !0 && Array.isArray(d.value) && !d.value.includes(0) || !se || se <= 1;
        return (!M.ctrlKey || C.value || fe) && ye;
      }), Ne(
        [x, B],
        () => {
          x.value && !k.value ? ue.on("zoom", null) : x.value || ue.on("zoom", (M) => {
            ie.value = { x: M.transform.x, y: M.transform.y, zoom: M.transform.k };
            const Q = he(M.transform);
            N = F(B.value, p ?? 0), P.viewportChange(Q), P.move({ event: M, flowTransform: Q });
          });
        },
        { immediate: !0 }
      ), Ne(
        [x, Z, u, T, v, b, S],
        () => {
          Z.value && !T.value && !x.value ? ve.on(
            "wheel.zoom",
            (M) => {
              if (pe(M, S.value))
                return !1;
              const Q = T.value || E.value, J = v.value && M.ctrlKey;
              if (!(!b.value || Z.value || Q || J))
                return !1;
              M.preventDefault(), M.stopImmediatePropagation();
              const se = ve.property("__zoom").k || 1, fe = En();
              if (!C.value && M.ctrlKey && v.value && fe) {
                const Bo = Je(M), Lo = pi(M), Vo = se * 2 ** Lo;
                ue.scaleTo(ve, Vo, Bo, M);
                return;
              }
              const ye = M.deltaMode === 1 ? 20 : 1;
              let $e = u.value === hn.Vertical ? 0 : M.deltaX * ye, Ge = u.value === hn.Horizontal ? 0 : M.deltaY * ye;
              !fe && M.shiftKey && u.value !== hn.Vertical && !$e && Ge && ($e = Ge, Ge = 0), ue.translateBy(
                ve,
                -($e / se) * c.value,
                -(Ge / se) * c.value
              );
              const Le = he(ve.property("__zoom"));
              f && clearTimeout(f), oe.value ? (P.move({ event: M, flowTransform: Le }), P.viewportChange(Le), f = setTimeout(() => {
                P.moveEnd({ event: M, flowTransform: Le }), P.viewportChangeEnd(Le), oe.value = !1;
              }, 150)) : (oe.value = !0, P.moveStart({ event: M, flowTransform: Le }), P.viewportChangeStart(Le));
            },
            { passive: !1 }
          ) : typeof m < "u" && ve.on(
            "wheel.zoom",
            function(M, Q) {
              const J = !b.value && M.type === "wheel" && !M.ctrlKey, le = T.value || E.value, se = v.value && M.ctrlKey;
              if (!le && !l.value && !se && M.type === "wheel" || J || pe(M, S.value))
                return null;
              M.preventDefault(), m.call(this, M, Q);
            },
            { passive: !1 }
          );
        },
        { immediate: !0 }
      );
    });
    function F(de, _e) {
      return _e === 2 && Array.isArray(de) && de.includes(2);
    }
    function ee(de, _e) {
      return de.x !== _e.x && !Number.isNaN(_e.x) || de.y !== _e.y && !Number.isNaN(_e.y) || de.zoom !== _e.k && !Number.isNaN(_e.k);
    }
    function he(de) {
      return {
        x: de.x,
        y: de.y,
        zoom: de.k
      };
    }
    function pe(de, _e) {
      return de.target.closest(`.${_e}`);
    }
    return (de, _e) => (L(), te("div", {
      ref_key: "viewportRef",
      ref: H,
      class: "vue-flow__viewport vue-flow__container"
    }, [
      ze(Zh, {
        "is-selecting": re.value,
        "selection-key-pressed": K(O),
        class: Be({
          connecting: G.value,
          dragging: K(R),
          draggable: K(d) === !0 || Array.isArray(K(d)) && K(d).includes(0)
        })
      }, {
        default: et(() => [
          ze(Wh, null, {
            default: et(() => [
              Te(de.$slots, "default")
            ]),
            _: 3
          })
        ]),
        _: 3
      }, 8, ["is-selecting", "selection-key-pressed", "class"])
    ], 512));
  }
}), Jh = ["id"], jh = ["id"], ev = ["id"], tv = {
  name: "A11yDescriptions",
  compatConfig: { MODE: 3 }
}, nv = /* @__PURE__ */ Se({
  ...tv,
  setup(e) {
    const { id: t, disableKeyboardA11y: n, ariaLiveMessage: o } = Me();
    return (i, r) => (L(), te(Ae, null, [
      W("div", {
        id: `${K(Ys)}-${K(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select a node. " + ke(K(n) ? "" : "You can then use the arrow keys to move the node around.") + " You can then use the arrow keys to move the node around, press delete to remove it and press escape to cancel. ", 9, Jh),
      W("div", {
        id: `${K(Us)}-${K(t)}`,
        style: { display: "none" }
      }, " Press enter or space to select an edge. You can then press delete to remove it or press escape to cancel. ", 8, jh),
      K(n) ? me("", !0) : (L(), te("div", {
        key: 0,
        id: `${K(wf)}-${K(t)}`,
        "aria-live": "assertive",
        "aria-atomic": "true",
        style: { position: "absolute", width: "1px", height: "1px", margin: "-1px", border: "0", padding: "0", overflow: "hidden", clip: "rect(0px, 0px, 0px, 0px)", "clip-path": "inset(100%)" }
      }, ke(K(o)), 9, ev))
    ], 64));
  }
});
function ov() {
  const e = Me();
  Ne(
    () => e.viewportHelper.value.viewportInitialized,
    (t) => {
      t && setTimeout(() => {
        e.emits.init(e), e.emits.paneReady(e);
      }, 1);
    }
  );
}
function iv(e, t, n) {
  return n === ae.Left ? e - t : n === ae.Right ? e + t : e;
}
function rv(e, t, n) {
  return n === ae.Top ? e - t : n === ae.Bottom ? e + t : e;
}
const Hi = function({
  radius: e = 10,
  centerX: t = 0,
  centerY: n = 0,
  position: o = ae.Top,
  type: i
}) {
  return xe("circle", {
    class: `vue-flow__edgeupdater vue-flow__edgeupdater-${i}`,
    cx: iv(t, e, o),
    cy: rv(n, e, o),
    r: e,
    stroke: "transparent",
    fill: "transparent"
  });
};
Hi.props = ["radius", "centerX", "centerY", "position", "type"];
Hi.compatConfig = { MODE: 3 };
const Vr = Hi, sv = Se({
  name: "Edge",
  compatConfig: { MODE: 3 },
  props: ["id"],
  setup(e) {
    const {
      id: t,
      addSelectedEdges: n,
      connectionMode: o,
      edgeUpdaterRadius: i,
      emits: r,
      nodesSelectionActive: s,
      noPanClassName: a,
      getEdgeTypes: l,
      removeSelectedEdges: u,
      findEdge: c,
      findNode: d,
      isValidConnection: h,
      multiSelectionActive: v,
      disableKeyboardA11y: E,
      elementsSelectable: b,
      edgesUpdatable: S,
      edgesFocusable: _,
      hooks: P
    } = Me(), y = ce(() => c(e.id)), { emit: x, on: R } = Kf(y.value, r), Y = Vt(To), V = en(), U = be(!1), ie = be(!1), H = be(""), X = be(null), k = be("source"), oe = be(null), f = Ee(
      () => typeof y.value.selectable > "u" ? b.value : y.value.selectable
    ), N = Ee(() => typeof y.value.updatable > "u" ? S.value : y.value.updatable), p = Ee(() => typeof y.value.focusable > "u" ? _.value : y.value.focusable);
    Ot(Zf, e.id), Ot(qf, oe);
    const D = ce(() => y.value.class instanceof Function ? y.value.class(y.value) : y.value.class), C = ce(() => y.value.style instanceof Function ? y.value.style(y.value) : y.value.style), O = ce(() => {
      const g = y.value.type || "default", w = Y?.[`edge-${g}`];
      if (w)
        return w;
      let I = y.value.template ?? l.value[g];
      if (typeof I == "string" && V) {
        const M = Object.keys(V.appContext.components);
        M && M.includes(g) && (I = ds(g, !1));
      }
      return I && typeof I != "string" ? I : (r.error(new Oe(Pe.EDGE_TYPE_MISSING, I)), !1);
    }), { handlePointerDown: T } = la({
      nodeId: H,
      handleId: X,
      type: k,
      isValidConnection: h,
      edgeUpdaterType: k,
      onEdgeUpdate: j,
      onEdgeUpdateEnd: re
    });
    return () => {
      const g = d(y.value.source), w = d(y.value.target), I = "pathOptions" in y.value ? y.value.pathOptions : {};
      if (!g && !w)
        return r.error(new Oe(Pe.EDGE_SOURCE_TARGET_MISSING, y.value.id, y.value.source, y.value.target)), null;
      if (!g)
        return r.error(new Oe(Pe.EDGE_SOURCE_MISSING, y.value.id, y.value.source)), null;
      if (!w)
        return r.error(new Oe(Pe.EDGE_TARGET_MISSING, y.value.id, y.value.target)), null;
      if (!y.value || y.value.hidden || g.hidden || w.hidden)
        return null;
      let M;
      o.value === Et.Strict ? M = g.handleBounds.source : M = [...g.handleBounds.source || [], ...g.handleBounds.target || []];
      const Q = kr(M, y.value.sourceHandle);
      let J;
      o.value === Et.Strict ? J = w.handleBounds.target : J = [...w.handleBounds.target || [], ...w.handleBounds.source || []];
      const le = kr(J, y.value.targetHandle), se = Q?.position || ae.Bottom, fe = le?.position || ae.Top, { x: ye, y: $e } = Kt(g, Q, se), { x: Ge, y: Le } = Kt(w, le, fe);
      return y.value.sourceX = ye, y.value.sourceY = $e, y.value.targetX = Ge, y.value.targetY = Le, xe(
        "g",
        {
          ref: oe,
          key: e.id,
          "data-id": e.id,
          class: [
            "vue-flow__edge",
            `vue-flow__edge-${O.value === !1 ? "default" : y.value.type || "default"}`,
            a.value,
            D.value,
            {
              updating: U.value,
              selected: y.value.selected,
              animated: y.value.animated,
              inactive: !f.value && !P.value.edgeClick.hasListeners()
            }
          ],
          tabIndex: p.value ? 0 : void 0,
          "aria-label": y.value.ariaLabel === null ? void 0 : y.value.ariaLabel ?? `Edge from ${y.value.source} to ${y.value.target}`,
          "aria-describedby": p.value ? `${Us}-${t}` : void 0,
          "aria-roledescription": "edge",
          role: p.value ? "group" : "img",
          ...y.value.domAttributes,
          onClick: F,
          onContextmenu: ee,
          onDblclick: he,
          onMouseenter: pe,
          onMousemove: de,
          onMouseleave: _e,
          onKeyDown: p.value ? m : void 0
        },
        [
          ie.value ? null : xe(O.value === !1 ? l.value.default : O.value, {
            id: e.id,
            sourceNode: g,
            targetNode: w,
            source: y.value.source,
            target: y.value.target,
            type: y.value.type,
            updatable: N.value,
            selected: y.value.selected,
            animated: y.value.animated,
            label: y.value.label,
            labelStyle: y.value.labelStyle,
            labelShowBg: y.value.labelShowBg,
            labelBgStyle: y.value.labelBgStyle,
            labelBgPadding: y.value.labelBgPadding,
            labelBgBorderRadius: y.value.labelBgBorderRadius,
            data: y.value.data,
            events: { ...y.value.events, ...R },
            style: C.value,
            markerStart: `url('#${$n(y.value.markerStart, t)}')`,
            markerEnd: `url('#${$n(y.value.markerEnd, t)}')`,
            sourcePosition: se,
            targetPosition: fe,
            sourceX: ye,
            sourceY: $e,
            targetX: Ge,
            targetY: Le,
            sourceHandleId: y.value.sourceHandle,
            targetHandleId: y.value.targetHandle,
            interactionWidth: y.value.interactionWidth,
            ...I
          }),
          [
            N.value === "source" || N.value === !0 ? [
              xe(
                "g",
                {
                  onMousedown: ue,
                  onMouseenter: B,
                  onMouseout: Z
                },
                xe(Vr, {
                  position: se,
                  centerX: ye,
                  centerY: $e,
                  radius: i.value,
                  type: "source",
                  "data-type": "source"
                })
              )
            ] : null,
            N.value === "target" || N.value === !0 ? [
              xe(
                "g",
                {
                  onMousedown: ve,
                  onMouseenter: B,
                  onMouseout: Z
                },
                xe(Vr, {
                  position: fe,
                  centerX: Ge,
                  centerY: Le,
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
    function B() {
      U.value = !0;
    }
    function Z() {
      U.value = !1;
    }
    function j(g, w) {
      x.update({ event: g, edge: y.value, connection: w });
    }
    function re(g) {
      x.updateEnd({ event: g, edge: y.value }), ie.value = !1;
    }
    function G(g, w) {
      g.button === 0 && (ie.value = !0, H.value = w ? y.value.target : y.value.source, X.value = (w ? y.value.targetHandle : y.value.sourceHandle) ?? null, k.value = w ? "target" : "source", x.updateStart({ event: g, edge: y.value }), T(g));
    }
    function F(g) {
      var w;
      const I = { event: g, edge: y.value };
      f.value && (s.value = !1, y.value.selected && v.value ? (u([y.value]), (w = oe.value) == null || w.blur()) : n([y.value])), x.click(I);
    }
    function ee(g) {
      x.contextMenu({ event: g, edge: y.value });
    }
    function he(g) {
      x.doubleClick({ event: g, edge: y.value });
    }
    function pe(g) {
      x.mouseEnter({ event: g, edge: y.value });
    }
    function de(g) {
      x.mouseMove({ event: g, edge: y.value });
    }
    function _e(g) {
      x.mouseLeave({ event: g, edge: y.value });
    }
    function ue(g) {
      G(g, !0);
    }
    function ve(g) {
      G(g, !1);
    }
    function m(g) {
      var w;
      !E.value && Xs.includes(g.key) && f.value && (g.key === "Escape" ? ((w = oe.value) == null || w.blur(), u([c(e.id)])) : n([c(e.id)]));
    }
  }
}), av = sv, lv = Se({
  name: "ConnectionLine",
  compatConfig: { MODE: 3 },
  setup() {
    var e;
    const {
      id: t,
      connectionMode: n,
      connectionStartHandle: o,
      connectionEndHandle: i,
      connectionPosition: r,
      connectionLineType: s,
      connectionLineStyle: a,
      connectionLineOptions: l,
      connectionStatus: u,
      viewport: c,
      findNode: d
    } = Me(), h = (e = Vt(To)) == null ? void 0 : e["connection-line"], v = ce(() => {
      var P;
      return d((P = o.value) == null ? void 0 : P.nodeId);
    }), E = ce(() => {
      var P;
      return d((P = i.value) == null ? void 0 : P.nodeId) ?? null;
    }), b = ce(() => ({
      x: (r.value.x - c.value.x) / c.value.zoom,
      y: (r.value.y - c.value.y) / c.value.zoom
    })), S = ce(
      () => l.value.markerStart ? `url(#${$n(l.value.markerStart, t)})` : ""
    ), _ = ce(
      () => l.value.markerEnd ? `url(#${$n(l.value.markerEnd, t)})` : ""
    );
    return () => {
      var P, y, x;
      if (!v.value || !o.value)
        return null;
      const R = o.value.id, Y = o.value.type, V = v.value.handleBounds;
      let U = V?.[Y] ?? [];
      if (n.value === Et.Loose) {
        const C = V?.[Y === "source" ? "target" : "source"] ?? [];
        U = [...U, ...C];
      }
      if (!U)
        return null;
      const ie = (R ? U.find((C) => C.id === R) : U[0]) ?? null, H = ie?.position ?? ae.Top, { x: X, y: k } = Kt(v.value, ie, H);
      let oe = null;
      E.value && (n.value === Et.Strict ? oe = ((P = E.value.handleBounds[Y === "source" ? "target" : "source"]) == null ? void 0 : P.find(
        (C) => {
          var O;
          return C.id === ((O = i.value) == null ? void 0 : O.id);
        }
      )) || null : oe = ((y = [...E.value.handleBounds.source ?? [], ...E.value.handleBounds.target ?? []]) == null ? void 0 : y.find(
        (C) => {
          var O;
          return C.id === ((O = i.value) == null ? void 0 : O.id);
        }
      )) || null);
      const f = ((x = i.value) == null ? void 0 : x.position) ?? (H ? gi[H] : null);
      if (!H || !f)
        return null;
      const N = s.value ?? l.value.type ?? Ct.Bezier;
      let p = "";
      const D = {
        sourceX: X,
        sourceY: k,
        sourcePosition: H,
        targetX: b.value.x,
        targetY: b.value.y,
        targetPosition: f
      };
      return N === Ct.Bezier ? [p] = va(D) : N === Ct.Step ? [p] = yi({
        ...D,
        borderRadius: 0
      }) : N === Ct.SmoothStep ? [p] = yi(D) : N === Ct.SimpleBezier ? [p] = pa(D) : p = `M${X},${k} ${b.value.x},${b.value.y}`, xe(
        "svg",
        { class: "vue-flow__edges vue-flow__connectionline vue-flow__container" },
        xe(
          "g",
          { class: "vue-flow__connection" },
          h ? xe(h, {
            sourceX: X,
            sourceY: k,
            sourcePosition: H,
            targetX: b.value.x,
            targetY: b.value.y,
            targetPosition: f,
            sourceNode: v.value,
            sourceHandle: ie,
            targetNode: E.value,
            targetHandle: oe,
            markerEnd: _.value,
            markerStart: S.value,
            connectionStatus: u.value
          }) : xe("path", {
            d: p,
            class: [l.value.class, u.value, "vue-flow__connection-path"],
            style: {
              ...a.value,
              ...l.value.style
            },
            "marker-end": _.value,
            "marker-start": S.value
          })
        )
      );
    };
  }
}), uv = lv, cv = ["id", "markerWidth", "markerHeight", "markerUnits", "orient"], dv = {
  name: "MarkerType",
  compatConfig: { MODE: 3 }
}, fv = /* @__PURE__ */ Se({
  ...dv,
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
    return (t, n) => (L(), te("marker", {
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
      t.type === K(ho).ArrowClosed ? (L(), te("polyline", {
        key: 0,
        style: Re({
          stroke: t.color,
          fill: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        points: "-5,-4 0,0 -5,4 -5,-4"
      }, null, 4)) : me("", !0),
      t.type === K(ho).Arrow ? (L(), te("polyline", {
        key: 1,
        style: Re({
          stroke: t.color,
          strokeWidth: t.strokeWidth
        }),
        "stroke-linecap": "round",
        "stroke-linejoin": "round",
        fill: "none",
        points: "-5,-4 0,0 -5,4"
      }, null, 4)) : me("", !0)
    ], 8, cv));
  }
}), hv = {
  class: "vue-flow__marker vue-flow__container",
  "aria-hidden": "true"
}, vv = {
  name: "MarkerDefinitions",
  compatConfig: { MODE: 3 }
}, pv = /* @__PURE__ */ Se({
  ...vv,
  setup(e) {
    const { id: t, edges: n, connectionLineOptions: o, defaultMarkerColor: i } = Me(), r = ce(() => {
      const s = /* @__PURE__ */ new Set(), a = [], l = (u) => {
        if (u) {
          const c = $n(u, t);
          s.has(c) || (typeof u == "object" ? a.push({ ...u, id: c, color: u.color || i.value }) : a.push({ id: c, color: i.value, type: u }), s.add(c));
        }
      };
      for (const u of [o.value.markerEnd, o.value.markerStart])
        l(u);
      for (const u of n.value)
        for (const c of [u.markerStart, u.markerEnd])
          l(c);
      return a.sort((u, c) => u.id.localeCompare(c.id));
    });
    return (s, a) => (L(), te("svg", hv, [
      W("defs", null, [
        (L(!0), te(Ae, null, nt(r.value, (l) => (L(), De(fv, {
          id: l.id,
          key: l.id,
          type: l.type,
          color: l.color,
          width: l.width,
          height: l.height,
          markerUnits: l.markerUnits,
          "stroke-width": l.strokeWidth,
          orient: l.orient
        }, null, 8, ["id", "type", "color", "width", "height", "markerUnits", "stroke-width", "orient"]))), 128))
      ])
    ]));
  }
}), gv = {
  name: "Edges",
  compatConfig: { MODE: 3 }
}, mv = /* @__PURE__ */ Se({
  ...gv,
  setup(e) {
    const { findNode: t, getEdges: n, elevateEdgesOnSelect: o } = Me();
    return (i, r) => (L(), te(Ae, null, [
      ze(pv),
      (L(!0), te(Ae, null, nt(K(n), (s) => (L(), te("svg", {
        key: s.id,
        class: "vue-flow__edges vue-flow__container",
        style: Re({ zIndex: K(Of)(s, K(t), K(o)) })
      }, [
        ze(K(av), {
          id: s.id
        }, null, 8, ["id"])
      ], 4))), 128)),
      ze(K(uv))
    ], 64));
  }
}), yv = Se({
  name: "Node",
  compatConfig: { MODE: 3 },
  props: ["id", "resizeObserver"],
  setup(e) {
    const {
      id: t,
      noPanClassName: n,
      selectNodesOnDrag: o,
      nodesSelectionActive: i,
      multiSelectionActive: r,
      emits: s,
      removeSelectedNodes: a,
      addSelectedNodes: l,
      updateNodeDimensions: u,
      onUpdateNodeInternals: c,
      getNodeTypes: d,
      nodeExtent: h,
      elevateNodesOnSelect: v,
      disableKeyboardA11y: E,
      ariaLiveMessage: b,
      snapToGrid: S,
      snapGrid: _,
      nodeDragThreshold: P,
      nodesDraggable: y,
      elementsSelectable: x,
      nodesConnectable: R,
      nodesFocusable: Y,
      hooks: V
    } = Me(), U = be(null);
    Ot(sa, U), Ot(ra, e.id);
    const ie = Vt(To), H = en(), X = ca(), { node: k, parentNode: oe } = ua(e.id), { emit: f, on: N } = eh(k, s), p = Ee(() => typeof k.draggable > "u" ? y.value : k.draggable), D = Ee(() => typeof k.selectable > "u" ? x.value : k.selectable), C = Ee(() => typeof k.connectable > "u" ? R.value : k.connectable), O = Ee(() => typeof k.focusable > "u" ? Y.value : k.focusable), T = ce(
      () => D.value || p.value || V.value.nodeClick.hasListeners() || V.value.nodeDoubleClick.hasListeners() || V.value.nodeMouseEnter.hasListeners() || V.value.nodeMouseMove.hasListeners() || V.value.nodeMouseLeave.hasListeners()
    ), B = Ee(() => !!k.dimensions.width && !!k.dimensions.height), Z = ce(() => {
      const w = k.type || "default", I = ie?.[`node-${w}`];
      if (I)
        return I;
      let M = k.template || d.value[w];
      if (typeof M == "string" && H) {
        const Q = Object.keys(H.appContext.components);
        Q && Q.includes(w) && (M = ds(w, !1));
      }
      return M && typeof M != "string" ? M : (s.error(new Oe(Pe.NODE_TYPE_MISSING, M)), !1);
    }), j = aa({
      id: e.id,
      el: U,
      disabled: () => !p.value,
      selectable: D,
      dragHandle: () => k.dragHandle,
      onStart(w) {
        f.dragStart(w);
      },
      onDrag(w) {
        f.drag(w);
      },
      onStop(w) {
        f.dragStop(w);
      },
      onClick(w) {
        m(w);
      }
    }), re = ce(() => k.class instanceof Function ? k.class(k) : k.class), G = ce(() => {
      const w = (k.style instanceof Function ? k.style(k) : k.style) || {}, I = k.width instanceof Function ? k.width(k) : k.width, M = k.height instanceof Function ? k.height(k) : k.height;
      return !w.width && I && (w.width = typeof I == "string" ? I : `${I}px`), !w.height && M && (w.height = typeof M == "string" ? M : `${M}px`), w;
    }), F = Ee(() => Number(k.zIndex ?? G.value.zIndex ?? 0));
    return c((w) => {
      (w.includes(e.id) || !w.length) && he();
    }), rt(() => {
      Ne(
        () => k.hidden,
        (w = !1, I, M) => {
          !w && U.value && (e.resizeObserver.observe(U.value), M(() => {
            U.value && e.resizeObserver.unobserve(U.value);
          }));
        },
        { immediate: !0, flush: "post" }
      );
    }), Ne([() => k.type, () => k.sourcePosition, () => k.targetPosition], () => {
      Ye(() => {
        u([{ id: e.id, nodeElement: U.value, forceUpdate: !0 }]);
      });
    }), Ne(
      [
        () => k.position.x,
        () => k.position.y,
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.x;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.y;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.computedPosition.z;
        },
        F,
        () => k.selected,
        () => k.dimensions.height,
        () => k.dimensions.width,
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.dimensions.height;
        },
        () => {
          var w;
          return (w = oe.value) == null ? void 0 : w.dimensions.width;
        }
      ],
      ([w, I, M, Q, J, le]) => {
        const se = {
          x: w,
          y: I,
          z: le + (v.value && k.selected ? 1e3 : 0)
        };
        typeof M < "u" && typeof Q < "u" ? k.computedPosition = Mf({ x: M, y: Q, z: J }, se) : k.computedPosition = se;
      },
      { flush: "post", immediate: !0 }
    ), Ne([() => k.extent, h], ([w, I], [M, Q]) => {
      (w !== M || I !== Q) && ee();
    }), k.extent === "parent" || typeof k.extent == "object" && "range" in k.extent && k.extent.range === "parent" ? ri(() => B).toBe(!0).then(ee) : ee(), () => k.hidden ? null : xe(
      "div",
      {
        ref: U,
        "data-id": k.id,
        class: [
          "vue-flow__node",
          `vue-flow__node-${Z.value === !1 ? "default" : k.type || "default"}`,
          {
            [n.value]: p.value,
            dragging: j?.value,
            draggable: p.value,
            selected: k.selected,
            selectable: D.value,
            parent: k.isParent
          },
          re.value
        ],
        style: {
          visibility: B.value ? "visible" : "hidden",
          zIndex: k.computedPosition.z ?? F.value,
          transform: `translate(${k.computedPosition.x}px,${k.computedPosition.y}px)`,
          pointerEvents: T.value ? "all" : "none",
          ...G.value
        },
        tabIndex: O.value ? 0 : void 0,
        role: O.value ? "group" : void 0,
        "aria-describedby": E.value ? void 0 : `${Ys}-${t}`,
        "aria-label": k.ariaLabel,
        "aria-roledescription": "node",
        ...k.domAttributes,
        onMouseenter: pe,
        onMousemove: de,
        onMouseleave: _e,
        onContextmenu: ue,
        onClick: m,
        onDblclick: ve,
        onKeydown: g
      },
      [
        xe(Z.value === !1 ? d.value.default : Z.value, {
          id: k.id,
          type: k.type,
          data: k.data,
          events: { ...k.events, ...N },
          selected: k.selected,
          resizing: k.resizing,
          dragging: j.value,
          connectable: C.value,
          position: k.computedPosition,
          dimensions: k.dimensions,
          isValidTargetPos: k.isValidTargetPos,
          isValidSourcePos: k.isValidSourcePos,
          parent: k.parentNode,
          parentNodeId: k.parentNode,
          zIndex: k.computedPosition.z ?? F.value,
          targetPosition: k.targetPosition,
          sourcePosition: k.sourcePosition,
          label: k.label,
          dragHandle: k.dragHandle,
          onUpdateNodeInternals: he
        })
      ]
    );
    function ee() {
      const w = k.computedPosition, { computedPosition: I, position: M } = Li(
        k,
        S.value ? Mo(w, _.value) : w,
        s.error,
        h.value,
        oe.value
      );
      (k.computedPosition.x !== I.x || k.computedPosition.y !== I.y) && (k.computedPosition = { ...k.computedPosition, ...I }), (k.position.x !== M.x || k.position.y !== M.y) && (k.position = M);
    }
    function he() {
      U.value && u([{ id: e.id, nodeElement: U.value, forceUpdate: !0 }]);
    }
    function pe(w) {
      j?.value || f.mouseEnter({ event: w, node: k });
    }
    function de(w) {
      j?.value || f.mouseMove({ event: w, node: k });
    }
    function _e(w) {
      j?.value || f.mouseLeave({ event: w, node: k });
    }
    function ue(w) {
      return f.contextMenu({ event: w, node: k });
    }
    function ve(w) {
      return f.doubleClick({ event: w, node: k });
    }
    function m(w) {
      D.value && (!o.value || !p.value || P.value > 0) && mi(
        k,
        r.value,
        l,
        a,
        i,
        !1,
        U.value
      ), f.click({ event: w, node: k });
    }
    function g(w) {
      if (!(vi(w) || E.value))
        if (Xs.includes(w.key) && D.value) {
          const I = w.key === "Escape";
          mi(
            k,
            r.value,
            l,
            a,
            i,
            I,
            U.value
          );
        } else p.value && k.selected && Xt[w.key] && (w.preventDefault(), b.value = `Moved selected node ${w.key.replace("Arrow", "").toLowerCase()}. New position, x: ${~~k.position.x}, y: ${~~k.position.y}`, X(
          {
            x: Xt[w.key].x,
            y: Xt[w.key].y
          },
          w.shiftKey
        ));
    }
  }
}), _v = yv;
function wv(e = { includeHiddenNodes: !1 }) {
  const { nodes: t } = Me();
  return ce(() => {
    if (t.value.length === 0)
      return !1;
    for (const n of t.value)
      if ((e.includeHiddenNodes || !n.hidden) && (n?.handleBounds === void 0 || n.dimensions.width === 0 || n.dimensions.height === 0))
        return !1;
    return !0;
  });
}
const bv = { class: "vue-flow__nodes vue-flow__container" }, $v = {
  name: "Nodes",
  compatConfig: { MODE: 3 }
}, Ev = /* @__PURE__ */ Se({
  ...$v,
  setup(e) {
    const { getNodes: t, updateNodeDimensions: n, emits: o } = Me(), i = wv(), r = be();
    return Ne(
      i,
      (s) => {
        s && Ye(() => {
          o.nodesInitialized(t.value);
        });
      },
      { immediate: !0 }
    ), rt(() => {
      r.value = new ResizeObserver((s) => {
        const a = s.map((l) => ({
          id: l.target.getAttribute("data-id"),
          nodeElement: l.target,
          forceUpdate: !0
        }));
        Ye(() => n(a));
      });
    }), Eo(() => {
      var s;
      return (s = r.value) == null ? void 0 : s.disconnect();
    }), (s, a) => (L(), te("div", bv, [
      r.value ? (L(!0), te(Ae, { key: 0 }, nt(K(t), (l, u, c, d) => {
        const h = [l.id];
        if (d && d.key === l.id && hl(d, h))
          return d;
        const v = (L(), De(K(_v), {
          id: l.id,
          key: l.id,
          "resize-observer": r.value
        }, null, 8, ["id", "resize-observer"]));
        return v.memo = h, v;
      }, a, 0), 128)) : me("", !0)
    ]));
  }
});
function xv() {
  const { emits: e } = Me();
  rt(() => {
    if (ia()) {
      const t = document.querySelector(".vue-flow__pane");
      t && window.getComputedStyle(t).zIndex !== "1" && e.error(new Oe(Pe.MISSING_STYLES));
    }
  });
}
const Sv = /* @__PURE__ */ W("div", { class: "vue-flow__edge-labels" }, null, -1), Nv = {
  name: "VueFlow",
  compatConfig: { MODE: 3 }
}, Cv = /* @__PURE__ */ Se({
  ...Nv,
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
    const o = e, i = cs(), r = Yo(o, "modelValue", n), s = Yo(o, "nodes", n), a = Yo(o, "edges", n), l = Me(o), u = ih({ modelValue: r, nodes: s, edges: a }, o, l);
    return sh(n, l.hooks), ov(), xv(), Ot(To, i), cl(u), t(l), (c, d) => (L(), te("div", {
      ref: K(l).vueFlowRef,
      class: "vue-flow"
    }, [
      ze(Qh, null, {
        default: et(() => [
          ze(mv),
          Sv,
          ze(Ev),
          Te(c.$slots, "zoom-pane")
        ]),
        _: 3
      }),
      Te(c.$slots, "default"),
      ze(nv)
    ], 512));
  }
}), kv = {
  name: "Panel",
  compatConfig: { MODE: 3 }
}, ma = /* @__PURE__ */ Se({
  ...kv,
  props: {
    position: {}
  },
  setup(e) {
    const t = e, { userSelectionActive: n } = Me(), o = ce(() => `${t.position}`.split("-"));
    return (i, r) => (L(), te("div", {
      class: Be(["vue-flow__panel", o.value]),
      style: Re({ pointerEvents: K(n) ? "none" : "all" })
    }, [
      Te(i.$slots, "default")
    ], 6));
  }
});
var ft = /* @__PURE__ */ ((e) => (e.Lines = "lines", e.Dots = "dots", e))(ft || {});
const ya = function({ dimensions: e, size: t, color: n }) {
  return xe("path", {
    stroke: n,
    "stroke-width": t,
    d: `M${e[0] / 2} 0 V${e[1]} M0 ${e[1] / 2} H${e[0]}`
  });
}, _a = function({ radius: e, color: t }) {
  return xe("circle", { cx: e, cy: e, r: e, fill: t });
};
ft.Lines + "", ft.Dots + "";
const Mv = {
  [ft.Dots]: "#81818a",
  [ft.Lines]: "#eee"
}, Tv = ["id", "x", "y", "width", "height", "patternTransform"], Dv = {
  key: 2,
  height: "100",
  width: "100"
}, Iv = ["fill"], Av = ["x", "y", "fill"], Pv = {
  name: "Background",
  compatConfig: { MODE: 3 }
}, Ov = /* @__PURE__ */ Se({
  ...Pv,
  props: {
    id: {},
    variant: { default: () => ft.Dots },
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
    const { id: t, viewport: n } = Me(), o = ce(() => {
      const s = n.value.zoom, [a, l] = Array.isArray(e.gap) ? e.gap : [e.gap, e.gap], u = [a * s || 1, l * s || 1], c = e.size * s, [d, h] = Array.isArray(e.offset) ? e.offset : [e.offset, e.offset], v = [d * s || 1 + u[0] / 2, h * s || 1 + u[1] / 2];
      return {
        scaledGap: u,
        offset: v,
        size: c
      };
    }), i = Ee(() => `pattern-${t}${e.id ? `-${e.id}` : ""}`), r = Ee(() => e.color || e.patternColor || Mv[e.variant || ft.Dots]);
    return (s, a) => (L(), te("svg", {
      class: "vue-flow__background vue-flow__container",
      style: Re({
        height: `${s.height > 100 ? 100 : s.height}%`,
        width: `${s.width > 100 ? 100 : s.width}%`
      })
    }, [
      Te(s.$slots, "pattern-container", { id: i.value }, () => [
        W("pattern", {
          id: i.value,
          x: K(n).x % o.value.scaledGap[0],
          y: K(n).y % o.value.scaledGap[1],
          width: o.value.scaledGap[0],
          height: o.value.scaledGap[1],
          patternTransform: `translate(-${o.value.offset[0]},-${o.value.offset[1]})`,
          patternUnits: "userSpaceOnUse"
        }, [
          Te(s.$slots, "pattern", {}, () => [
            s.variant === K(ft).Lines ? (L(), De(K(ya), {
              key: 0,
              size: s.lineWidth,
              color: r.value,
              dimensions: o.value.scaledGap
            }, null, 8, ["size", "color", "dimensions"])) : s.variant === K(ft).Dots ? (L(), De(K(_a), {
              key: 1,
              color: r.value,
              radius: o.value.size / 2
            }, null, 8, ["color", "radius"])) : me("", !0),
            s.bgColor ? (L(), te("svg", Dv, [
              W("rect", {
                width: "100%",
                height: "100%",
                fill: s.bgColor
              }, null, 8, Iv)
            ])) : me("", !0)
          ])
        ], 8, Tv)
      ]),
      W("rect", {
        x: s.x,
        y: s.y,
        width: "100%",
        height: "100%",
        fill: `url(#${i.value})`
      }, null, 8, Av),
      Te(s.$slots, "default", { id: i.value })
    ], 4));
  }
}), zv = {
  name: "ControlButton",
  compatConfig: { MODE: 3 }
}, Rv = (e, t) => {
  const n = e.__vccOpts || e;
  for (const [o, i] of t)
    n[o] = i;
  return n;
}, Bv = {
  type: "button",
  class: "vue-flow__controls-button"
};
function Lv(e, t, n, o, i, r) {
  return L(), te("button", Bv, [
    Te(e.$slots, "default")
  ]);
}
const Fn = /* @__PURE__ */ Rv(zv, [["render", Lv]]), Vv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 32"
}, Hv = /* @__PURE__ */ W("path", { d: "M32 18.133H18.133V32h-4.266V18.133H0v-4.266h13.867V0h4.266v13.867H32z" }, null, -1), Fv = [
  Hv
];
function Yv(e, t) {
  return L(), te("svg", Vv, Fv);
}
const Uv = { render: Yv }, Xv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 5"
}, Gv = /* @__PURE__ */ W("path", { d: "M0 0h32v4.2H0z" }, null, -1), Zv = [
  Gv
];
function qv(e, t) {
  return L(), te("svg", Xv, Zv);
}
const Wv = { render: qv }, Kv = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 32 30"
}, Qv = /* @__PURE__ */ W("path", { d: "M3.692 4.63c0-.53.4-.938.939-.938h5.215V0H4.708C2.13 0 0 2.054 0 4.63v5.216h3.692V4.631zM27.354 0h-5.2v3.692h5.17c.53 0 .984.4.984.939v5.215H32V4.631A4.624 4.624 0 0 0 27.354 0zm.954 24.83c0 .532-.4.94-.939.94h-5.215v3.768h5.215c2.577 0 4.631-2.13 4.631-4.707v-5.139h-3.692v5.139zm-23.677.94a.919.919 0 0 1-.939-.94v-5.138H0v5.139c0 2.577 2.13 4.707 4.708 4.707h5.138V25.77H4.631z" }, null, -1), Jv = [
  Qv
];
function jv(e, t) {
  return L(), te("svg", Kv, Jv);
}
const ep = { render: jv }, tp = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, np = /* @__PURE__ */ W("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0 8 0 4.571 3.429 4.571 7.619v3.048H3.048A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047zm4.724-13.866H7.467V7.619c0-2.59 2.133-4.724 4.723-4.724 2.591 0 4.724 2.133 4.724 4.724v3.048z" }, null, -1), op = [
  np
];
function ip(e, t) {
  return L(), te("svg", tp, op);
}
const rp = { render: ip }, sp = {
  xmlns: "http://www.w3.org/2000/svg",
  viewBox: "0 0 25 32"
}, ap = /* @__PURE__ */ W("path", { d: "M21.333 10.667H19.81V7.619C19.81 3.429 16.38 0 12.19 0c-4.114 1.828-1.37 2.133.305 2.438 1.676.305 4.42 2.59 4.42 5.181v3.048H3.047A3.056 3.056 0 0 0 0 13.714v15.238A3.056 3.056 0 0 0 3.048 32h18.285a3.056 3.056 0 0 0 3.048-3.048V13.714a3.056 3.056 0 0 0-3.048-3.047zM12.19 24.533a3.056 3.056 0 0 1-3.047-3.047 3.056 3.056 0 0 1 3.047-3.048 3.056 3.056 0 0 1 3.048 3.048 3.056 3.056 0 0 1-3.048 3.047z" }, null, -1), lp = [
  ap
];
function up(e, t) {
  return L(), te("svg", sp, lp);
}
const cp = { render: up }, dp = {
  name: "Controls",
  compatConfig: { MODE: 3 }
}, fp = /* @__PURE__ */ Se({
  ...dp,
  props: {
    showZoom: { type: Boolean, default: !0 },
    showFitView: { type: Boolean, default: !0 },
    showInteractive: { type: Boolean, default: !0 },
    fitViewParams: {},
    position: { default: () => Fs.BottomLeft }
  },
  emits: ["zoomIn", "zoomOut", "fitView", "interactionChange"],
  setup(e, { emit: t }) {
    const {
      nodesDraggable: n,
      nodesConnectable: o,
      elementsSelectable: i,
      setInteractive: r,
      zoomIn: s,
      zoomOut: a,
      fitView: l,
      viewport: u,
      minZoom: c,
      maxZoom: d
    } = Me(), h = Ee(() => n.value || o.value || i.value), v = Ee(() => u.value.zoom <= c.value), E = Ee(() => u.value.zoom >= d.value);
    function b() {
      s(), t("zoomIn");
    }
    function S() {
      a(), t("zoomOut");
    }
    function _() {
      l(e.fitViewParams), t("fitView");
    }
    function P() {
      r(!h.value), t("interactionChange", !h.value);
    }
    return (y, x) => (L(), De(K(ma), {
      class: "vue-flow__controls",
      position: y.position
    }, {
      default: et(() => [
        Te(y.$slots, "top"),
        y.showZoom ? (L(), te(Ae, { key: 0 }, [
          Te(y.$slots, "control-zoom-in", {}, () => [
            ze(Fn, {
              class: "vue-flow__controls-zoomin",
              disabled: E.value,
              onClick: b
            }, {
              default: et(() => [
                Te(y.$slots, "icon-zoom-in", {}, () => [
                  (L(), De(Nt(K(Uv))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ]),
          Te(y.$slots, "control-zoom-out", {}, () => [
            ze(Fn, {
              class: "vue-flow__controls-zoomout",
              disabled: v.value,
              onClick: S
            }, {
              default: et(() => [
                Te(y.$slots, "icon-zoom-out", {}, () => [
                  (L(), De(Nt(K(Wv))))
                ])
              ]),
              _: 3
            }, 8, ["disabled"])
          ])
        ], 64)) : me("", !0),
        y.showFitView ? Te(y.$slots, "control-fit-view", { key: 1 }, () => [
          ze(Fn, {
            class: "vue-flow__controls-fitview",
            onClick: _
          }, {
            default: et(() => [
              Te(y.$slots, "icon-fit-view", {}, () => [
                (L(), De(Nt(K(ep))))
              ])
            ]),
            _: 3
          })
        ]) : me("", !0),
        y.showInteractive ? Te(y.$slots, "control-interactive", { key: 2 }, () => [
          y.showInteractive ? (L(), De(Fn, {
            key: 0,
            class: "vue-flow__controls-interactive",
            onClick: P
          }, {
            default: et(() => [
              h.value ? Te(y.$slots, "icon-unlock", { key: 0 }, () => [
                (L(), De(Nt(K(cp))))
              ]) : me("", !0),
              h.value ? me("", !0) : Te(y.$slots, "icon-lock", { key: 1 }, () => [
                (L(), De(Nt(K(rp))))
              ])
            ]),
            _: 3
          })) : me("", !0)
        ]) : me("", !0),
        Te(y.$slots, "default")
      ]),
      _: 3
    }, 8, ["position"]));
  }
});
var hp = { value: () => {
} };
function Fi() {
  for (var e = 0, t = arguments.length, n = {}, o; e < t; ++e) {
    if (!(o = arguments[e] + "") || o in n || /[\s.]/.test(o)) throw new Error("illegal type: " + o);
    n[o] = [];
  }
  return new eo(n);
}
function eo(e) {
  this._ = e;
}
function vp(e, t) {
  return e.trim().split(/^|\s+/).map(function(n) {
    var o = "", i = n.indexOf(".");
    if (i >= 0 && (o = n.slice(i + 1), n = n.slice(0, i)), n && !t.hasOwnProperty(n)) throw new Error("unknown type: " + n);
    return { type: n, name: o };
  });
}
eo.prototype = Fi.prototype = {
  constructor: eo,
  on: function(e, t) {
    var n = this._, o = vp(e + "", n), i, r = -1, s = o.length;
    if (arguments.length < 2) {
      for (; ++r < s; ) if ((i = (e = o[r]).type) && (i = pp(n[i], e.name))) return i;
      return;
    }
    if (t != null && typeof t != "function") throw new Error("invalid callback: " + t);
    for (; ++r < s; )
      if (i = (e = o[r]).type) n[i] = Hr(n[i], e.name, t);
      else if (t == null) for (i in n) n[i] = Hr(n[i], e.name, null);
    return this;
  },
  copy: function() {
    var e = {}, t = this._;
    for (var n in t) e[n] = t[n].slice();
    return new eo(e);
  },
  call: function(e, t) {
    if ((i = arguments.length - 2) > 0) for (var n = new Array(i), o = 0, i, r; o < i; ++o) n[o] = arguments[o + 2];
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (r = this._[e], o = 0, i = r.length; o < i; ++o) r[o].value.apply(t, n);
  },
  apply: function(e, t, n) {
    if (!this._.hasOwnProperty(e)) throw new Error("unknown type: " + e);
    for (var o = this._[e], i = 0, r = o.length; i < r; ++i) o[i].value.apply(t, n);
  }
};
function pp(e, t) {
  for (var n = 0, o = e.length, i; n < o; ++n)
    if ((i = e[n]).name === t)
      return i.value;
}
function Hr(e, t, n) {
  for (var o = 0, i = e.length; o < i; ++o)
    if (e[o].name === t) {
      e[o] = hp, e = e.slice(0, o).concat(e.slice(o + 1));
      break;
    }
  return n != null && e.push({ name: t, value: n }), e;
}
var _i = "http://www.w3.org/1999/xhtml";
const Fr = {
  svg: "http://www.w3.org/2000/svg",
  xhtml: _i,
  xlink: "http://www.w3.org/1999/xlink",
  xml: "http://www.w3.org/XML/1998/namespace",
  xmlns: "http://www.w3.org/2000/xmlns/"
};
function Oo(e) {
  var t = e += "", n = t.indexOf(":");
  return n >= 0 && (t = e.slice(0, n)) !== "xmlns" && (e = e.slice(n + 1)), Fr.hasOwnProperty(t) ? { space: Fr[t], local: e } : e;
}
function gp(e) {
  return function() {
    var t = this.ownerDocument, n = this.namespaceURI;
    return n === _i && t.documentElement.namespaceURI === _i ? t.createElement(e) : t.createElementNS(n, e);
  };
}
function mp(e) {
  return function() {
    return this.ownerDocument.createElementNS(e.space, e.local);
  };
}
function wa(e) {
  var t = Oo(e);
  return (t.local ? mp : gp)(t);
}
function yp() {
}
function Yi(e) {
  return e == null ? yp : function() {
    return this.querySelector(e);
  };
}
function _p(e) {
  typeof e != "function" && (e = Yi(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = new Array(s), l, u, c = 0; c < s; ++c)
      (l = r[c]) && (u = e.call(l, l.__data__, c, r)) && ("__data__" in l && (u.__data__ = l.__data__), a[c] = u);
  return new Xe(o, this._parents);
}
function wp(e) {
  return e == null ? [] : Array.isArray(e) ? e : Array.from(e);
}
function bp() {
  return [];
}
function ba(e) {
  return e == null ? bp : function() {
    return this.querySelectorAll(e);
  };
}
function $p(e) {
  return function() {
    return wp(e.apply(this, arguments));
  };
}
function Ep(e) {
  typeof e == "function" ? e = $p(e) : e = ba(e);
  for (var t = this._groups, n = t.length, o = [], i = [], r = 0; r < n; ++r)
    for (var s = t[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && (o.push(e.call(l, l.__data__, u, s)), i.push(l));
  return new Xe(o, i);
}
function $a(e) {
  return function() {
    return this.matches(e);
  };
}
function Ea(e) {
  return function(t) {
    return t.matches(e);
  };
}
var xp = Array.prototype.find;
function Sp(e) {
  return function() {
    return xp.call(this.children, e);
  };
}
function Np() {
  return this.firstElementChild;
}
function Cp(e) {
  return this.select(e == null ? Np : Sp(typeof e == "function" ? e : Ea(e)));
}
var kp = Array.prototype.filter;
function Mp() {
  return Array.from(this.children);
}
function Tp(e) {
  return function() {
    return kp.call(this.children, e);
  };
}
function Dp(e) {
  return this.selectAll(e == null ? Mp : Tp(typeof e == "function" ? e : Ea(e)));
}
function Ip(e) {
  typeof e != "function" && (e = $a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new Xe(o, this._parents);
}
function xa(e) {
  return new Array(e.length);
}
function Ap() {
  return new Xe(this._enter || this._groups.map(xa), this._parents);
}
function mo(e, t) {
  this.ownerDocument = e.ownerDocument, this.namespaceURI = e.namespaceURI, this._next = null, this._parent = e, this.__data__ = t;
}
mo.prototype = {
  constructor: mo,
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
function Pp(e) {
  return function() {
    return e;
  };
}
function Op(e, t, n, o, i, r) {
  for (var s = 0, a, l = t.length, u = r.length; s < u; ++s)
    (a = t[s]) ? (a.__data__ = r[s], o[s] = a) : n[s] = new mo(e, r[s]);
  for (; s < l; ++s)
    (a = t[s]) && (i[s] = a);
}
function zp(e, t, n, o, i, r, s) {
  var a, l, u = /* @__PURE__ */ new Map(), c = t.length, d = r.length, h = new Array(c), v;
  for (a = 0; a < c; ++a)
    (l = t[a]) && (h[a] = v = s.call(l, l.__data__, a, t) + "", u.has(v) ? i[a] = l : u.set(v, l));
  for (a = 0; a < d; ++a)
    v = s.call(e, r[a], a, r) + "", (l = u.get(v)) ? (o[a] = l, l.__data__ = r[a], u.delete(v)) : n[a] = new mo(e, r[a]);
  for (a = 0; a < c; ++a)
    (l = t[a]) && u.get(h[a]) === l && (i[a] = l);
}
function Rp(e) {
  return e.__data__;
}
function Bp(e, t) {
  if (!arguments.length) return Array.from(this, Rp);
  var n = t ? zp : Op, o = this._parents, i = this._groups;
  typeof e != "function" && (e = Pp(e));
  for (var r = i.length, s = new Array(r), a = new Array(r), l = new Array(r), u = 0; u < r; ++u) {
    var c = o[u], d = i[u], h = d.length, v = Lp(e.call(c, c && c.__data__, u, o)), E = v.length, b = a[u] = new Array(E), S = s[u] = new Array(E), _ = l[u] = new Array(h);
    n(c, d, b, S, _, v, t);
    for (var P = 0, y = 0, x, R; P < E; ++P)
      if (x = b[P]) {
        for (P >= y && (y = P + 1); !(R = S[y]) && ++y < E; ) ;
        x._next = R || null;
      }
  }
  return s = new Xe(s, o), s._enter = a, s._exit = l, s;
}
function Lp(e) {
  return typeof e == "object" && "length" in e ? e : Array.from(e);
}
function Vp() {
  return new Xe(this._exit || this._groups.map(xa), this._parents);
}
function Hp(e, t, n) {
  var o = this.enter(), i = this, r = this.exit();
  return typeof e == "function" ? (o = e(o), o && (o = o.selection())) : o = o.append(e + ""), t != null && (i = t(i), i && (i = i.selection())), n == null ? r.remove() : n(r), o && i ? o.merge(i).order() : i;
}
function Fp(e) {
  for (var t = e.selection ? e.selection() : e, n = this._groups, o = t._groups, i = n.length, r = o.length, s = Math.min(i, r), a = new Array(i), l = 0; l < s; ++l)
    for (var u = n[l], c = o[l], d = u.length, h = a[l] = new Array(d), v, E = 0; E < d; ++E)
      (v = u[E] || c[E]) && (h[E] = v);
  for (; l < i; ++l)
    a[l] = n[l];
  return new Xe(a, this._parents);
}
function Yp() {
  for (var e = this._groups, t = -1, n = e.length; ++t < n; )
    for (var o = e[t], i = o.length - 1, r = o[i], s; --i >= 0; )
      (s = o[i]) && (r && s.compareDocumentPosition(r) ^ 4 && r.parentNode.insertBefore(s, r), r = s);
  return this;
}
function Up(e) {
  e || (e = Xp);
  function t(d, h) {
    return d && h ? e(d.__data__, h.__data__) : !d - !h;
  }
  for (var n = this._groups, o = n.length, i = new Array(o), r = 0; r < o; ++r) {
    for (var s = n[r], a = s.length, l = i[r] = new Array(a), u, c = 0; c < a; ++c)
      (u = s[c]) && (l[c] = u);
    l.sort(t);
  }
  return new Xe(i, this._parents).order();
}
function Xp(e, t) {
  return e < t ? -1 : e > t ? 1 : e >= t ? 0 : NaN;
}
function Gp() {
  var e = arguments[0];
  return arguments[0] = this, e.apply(null, arguments), this;
}
function Zp() {
  return Array.from(this);
}
function qp() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length; i < r; ++i) {
      var s = o[i];
      if (s) return s;
    }
  return null;
}
function Wp() {
  let e = 0;
  for (const t of this) ++e;
  return e;
}
function Kp() {
  return !this.node();
}
function Qp(e) {
  for (var t = this._groups, n = 0, o = t.length; n < o; ++n)
    for (var i = t[n], r = 0, s = i.length, a; r < s; ++r)
      (a = i[r]) && e.call(a, a.__data__, r, i);
  return this;
}
function Jp(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function jp(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function eg(e, t) {
  return function() {
    this.setAttribute(e, t);
  };
}
function tg(e, t) {
  return function() {
    this.setAttributeNS(e.space, e.local, t);
  };
}
function ng(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttribute(e) : this.setAttribute(e, n);
  };
}
function og(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? this.removeAttributeNS(e.space, e.local) : this.setAttributeNS(e.space, e.local, n);
  };
}
function ig(e, t) {
  var n = Oo(e);
  if (arguments.length < 2) {
    var o = this.node();
    return n.local ? o.getAttributeNS(n.space, n.local) : o.getAttribute(n);
  }
  return this.each((t == null ? n.local ? jp : Jp : typeof t == "function" ? n.local ? og : ng : n.local ? tg : eg)(n, t));
}
function Sa(e) {
  return e.ownerDocument && e.ownerDocument.defaultView || e.document && e || e.defaultView;
}
function rg(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function sg(e, t, n) {
  return function() {
    this.style.setProperty(e, t, n);
  };
}
function ag(e, t, n) {
  return function() {
    var o = t.apply(this, arguments);
    o == null ? this.style.removeProperty(e) : this.style.setProperty(e, o, n);
  };
}
function lg(e, t, n) {
  return arguments.length > 1 ? this.each((t == null ? rg : typeof t == "function" ? ag : sg)(e, t, n ?? "")) : Jt(this.node(), e);
}
function Jt(e, t) {
  return e.style.getPropertyValue(t) || Sa(e).getComputedStyle(e, null).getPropertyValue(t);
}
function ug(e) {
  return function() {
    delete this[e];
  };
}
function cg(e, t) {
  return function() {
    this[e] = t;
  };
}
function dg(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    n == null ? delete this[e] : this[e] = n;
  };
}
function fg(e, t) {
  return arguments.length > 1 ? this.each((t == null ? ug : typeof t == "function" ? dg : cg)(e, t)) : this.node()[e];
}
function Na(e) {
  return e.trim().split(/^|\s+/);
}
function Ui(e) {
  return e.classList || new Ca(e);
}
function Ca(e) {
  this._node = e, this._names = Na(e.getAttribute("class") || "");
}
Ca.prototype = {
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
function ka(e, t) {
  for (var n = Ui(e), o = -1, i = t.length; ++o < i; ) n.add(t[o]);
}
function Ma(e, t) {
  for (var n = Ui(e), o = -1, i = t.length; ++o < i; ) n.remove(t[o]);
}
function hg(e) {
  return function() {
    ka(this, e);
  };
}
function vg(e) {
  return function() {
    Ma(this, e);
  };
}
function pg(e, t) {
  return function() {
    (t.apply(this, arguments) ? ka : Ma)(this, e);
  };
}
function gg(e, t) {
  var n = Na(e + "");
  if (arguments.length < 2) {
    for (var o = Ui(this.node()), i = -1, r = n.length; ++i < r; ) if (!o.contains(n[i])) return !1;
    return !0;
  }
  return this.each((typeof t == "function" ? pg : t ? hg : vg)(n, t));
}
function mg() {
  this.textContent = "";
}
function yg(e) {
  return function() {
    this.textContent = e;
  };
}
function _g(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.textContent = t ?? "";
  };
}
function wg(e) {
  return arguments.length ? this.each(e == null ? mg : (typeof e == "function" ? _g : yg)(e)) : this.node().textContent;
}
function bg() {
  this.innerHTML = "";
}
function $g(e) {
  return function() {
    this.innerHTML = e;
  };
}
function Eg(e) {
  return function() {
    var t = e.apply(this, arguments);
    this.innerHTML = t ?? "";
  };
}
function xg(e) {
  return arguments.length ? this.each(e == null ? bg : (typeof e == "function" ? Eg : $g)(e)) : this.node().innerHTML;
}
function Sg() {
  this.nextSibling && this.parentNode.appendChild(this);
}
function Ng() {
  return this.each(Sg);
}
function Cg() {
  this.previousSibling && this.parentNode.insertBefore(this, this.parentNode.firstChild);
}
function kg() {
  return this.each(Cg);
}
function Mg(e) {
  var t = typeof e == "function" ? e : wa(e);
  return this.select(function() {
    return this.appendChild(t.apply(this, arguments));
  });
}
function Tg() {
  return null;
}
function Dg(e, t) {
  var n = typeof e == "function" ? e : wa(e), o = t == null ? Tg : typeof t == "function" ? t : Yi(t);
  return this.select(function() {
    return this.insertBefore(n.apply(this, arguments), o.apply(this, arguments) || null);
  });
}
function Ig() {
  var e = this.parentNode;
  e && e.removeChild(this);
}
function Ag() {
  return this.each(Ig);
}
function Pg() {
  var e = this.cloneNode(!1), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function Og() {
  var e = this.cloneNode(!0), t = this.parentNode;
  return t ? t.insertBefore(e, this.nextSibling) : e;
}
function zg(e) {
  return this.select(e ? Og : Pg);
}
function Rg(e) {
  return arguments.length ? this.property("__data__", e) : this.node().__data__;
}
function Bg(e) {
  return function(t) {
    e.call(this, t, this.__data__);
  };
}
function Lg(e) {
  return e.trim().split(/^|\s+/).map(function(t) {
    var n = "", o = t.indexOf(".");
    return o >= 0 && (n = t.slice(o + 1), t = t.slice(0, o)), { type: t, name: n };
  });
}
function Vg(e) {
  return function() {
    var t = this.__on;
    if (t) {
      for (var n = 0, o = -1, i = t.length, r; n < i; ++n)
        r = t[n], (!e.type || r.type === e.type) && r.name === e.name ? this.removeEventListener(r.type, r.listener, r.options) : t[++o] = r;
      ++o ? t.length = o : delete this.__on;
    }
  };
}
function Hg(e, t, n) {
  return function() {
    var o = this.__on, i, r = Bg(t);
    if (o) {
      for (var s = 0, a = o.length; s < a; ++s)
        if ((i = o[s]).type === e.type && i.name === e.name) {
          this.removeEventListener(i.type, i.listener, i.options), this.addEventListener(i.type, i.listener = r, i.options = n), i.value = t;
          return;
        }
    }
    this.addEventListener(e.type, r, n), i = { type: e.type, name: e.name, value: t, listener: r, options: n }, o ? o.push(i) : this.__on = [i];
  };
}
function Fg(e, t, n) {
  var o = Lg(e + ""), i, r = o.length, s;
  if (arguments.length < 2) {
    var a = this.node().__on;
    if (a) {
      for (var l = 0, u = a.length, c; l < u; ++l)
        for (i = 0, c = a[l]; i < r; ++i)
          if ((s = o[i]).type === c.type && s.name === c.name)
            return c.value;
    }
    return;
  }
  for (a = t ? Hg : Vg, i = 0; i < r; ++i) this.each(a(o[i], t, n));
  return this;
}
function Ta(e, t, n) {
  var o = Sa(e), i = o.CustomEvent;
  typeof i == "function" ? i = new i(t, n) : (i = o.document.createEvent("Event"), n ? (i.initEvent(t, n.bubbles, n.cancelable), i.detail = n.detail) : i.initEvent(t, !1, !1)), e.dispatchEvent(i);
}
function Yg(e, t) {
  return function() {
    return Ta(this, e, t);
  };
}
function Ug(e, t) {
  return function() {
    return Ta(this, e, t.apply(this, arguments));
  };
}
function Xg(e, t) {
  return this.each((typeof t == "function" ? Ug : Yg)(e, t));
}
function* Gg() {
  for (var e = this._groups, t = 0, n = e.length; t < n; ++t)
    for (var o = e[t], i = 0, r = o.length, s; i < r; ++i)
      (s = o[i]) && (yield s);
}
var Da = [null];
function Xe(e, t) {
  this._groups = e, this._parents = t;
}
function Dn() {
  return new Xe([[document.documentElement]], Da);
}
function Zg() {
  return this;
}
Xe.prototype = Dn.prototype = {
  constructor: Xe,
  select: _p,
  selectAll: Ep,
  selectChild: Cp,
  selectChildren: Dp,
  filter: Ip,
  data: Bp,
  enter: Ap,
  exit: Vp,
  join: Hp,
  merge: Fp,
  selection: Zg,
  order: Yp,
  sort: Up,
  call: Gp,
  nodes: Zp,
  node: qp,
  size: Wp,
  empty: Kp,
  each: Qp,
  attr: ig,
  style: lg,
  property: fg,
  classed: gg,
  text: wg,
  html: xg,
  raise: Ng,
  lower: kg,
  append: Mg,
  insert: Dg,
  remove: Ag,
  clone: zg,
  datum: Rg,
  on: Fg,
  dispatch: Xg,
  [Symbol.iterator]: Gg
};
function bt(e) {
  return typeof e == "string" ? new Xe([[document.querySelector(e)]], [document.documentElement]) : new Xe([[e]], Da);
}
function qg(e) {
  let t;
  for (; t = e.sourceEvent; ) e = t;
  return e;
}
function yt(e, t) {
  if (e = qg(e), t === void 0 && (t = e.currentTarget), t) {
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
const wi = { capture: !0, passive: !1 };
function bi(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Wg(e) {
  var t = e.document.documentElement, n = bt(e).on("dragstart.drag", bi, wi);
  "onselectstart" in t ? n.on("selectstart.drag", bi, wi) : (t.__noselect = t.style.MozUserSelect, t.style.MozUserSelect = "none");
}
function Kg(e, t) {
  var n = e.document.documentElement, o = bt(e).on("dragstart.drag", null);
  t && (o.on("click.drag", bi, wi), setTimeout(function() {
    o.on("click.drag", null);
  }, 0)), "onselectstart" in n ? o.on("selectstart.drag", null) : (n.style.MozUserSelect = n.__noselect, delete n.__noselect);
}
function Xi(e, t, n) {
  e.prototype = t.prototype = n, n.constructor = e;
}
function Ia(e, t) {
  var n = Object.create(e.prototype);
  for (var o in t) n[o] = t[o];
  return n;
}
function In() {
}
var xn = 0.7, yo = 1 / xn, Gt = "\\s*([+-]?\\d+)\\s*", Sn = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)\\s*", it = "\\s*([+-]?(?:\\d*\\.)?\\d+(?:[eE][+-]?\\d+)?)%\\s*", Qg = /^#([0-9a-f]{3,8})$/, Jg = new RegExp(`^rgb\\(${Gt},${Gt},${Gt}\\)$`), jg = new RegExp(`^rgb\\(${it},${it},${it}\\)$`), em = new RegExp(`^rgba\\(${Gt},${Gt},${Gt},${Sn}\\)$`), tm = new RegExp(`^rgba\\(${it},${it},${it},${Sn}\\)$`), nm = new RegExp(`^hsl\\(${Sn},${it},${it}\\)$`), om = new RegExp(`^hsla\\(${Sn},${it},${it},${Sn}\\)$`), Yr = {
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
Xi(In, Nn, {
  copy(e) {
    return Object.assign(new this.constructor(), this, e);
  },
  displayable() {
    return this.rgb().displayable();
  },
  hex: Ur,
  // Deprecated! Use color.formatHex.
  formatHex: Ur,
  formatHex8: im,
  formatHsl: rm,
  formatRgb: Xr,
  toString: Xr
});
function Ur() {
  return this.rgb().formatHex();
}
function im() {
  return this.rgb().formatHex8();
}
function rm() {
  return Aa(this).formatHsl();
}
function Xr() {
  return this.rgb().formatRgb();
}
function Nn(e) {
  var t, n;
  return e = (e + "").trim().toLowerCase(), (t = Qg.exec(e)) ? (n = t[1].length, t = parseInt(t[1], 16), n === 6 ? Gr(t) : n === 3 ? new Fe(t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, (t & 15) << 4 | t & 15, 1) : n === 8 ? Yn(t >> 24 & 255, t >> 16 & 255, t >> 8 & 255, (t & 255) / 255) : n === 4 ? Yn(t >> 12 & 15 | t >> 8 & 240, t >> 8 & 15 | t >> 4 & 240, t >> 4 & 15 | t & 240, ((t & 15) << 4 | t & 15) / 255) : null) : (t = Jg.exec(e)) ? new Fe(t[1], t[2], t[3], 1) : (t = jg.exec(e)) ? new Fe(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, 1) : (t = em.exec(e)) ? Yn(t[1], t[2], t[3], t[4]) : (t = tm.exec(e)) ? Yn(t[1] * 255 / 100, t[2] * 255 / 100, t[3] * 255 / 100, t[4]) : (t = nm.exec(e)) ? Wr(t[1], t[2] / 100, t[3] / 100, 1) : (t = om.exec(e)) ? Wr(t[1], t[2] / 100, t[3] / 100, t[4]) : Yr.hasOwnProperty(e) ? Gr(Yr[e]) : e === "transparent" ? new Fe(NaN, NaN, NaN, 0) : null;
}
function Gr(e) {
  return new Fe(e >> 16 & 255, e >> 8 & 255, e & 255, 1);
}
function Yn(e, t, n, o) {
  return o <= 0 && (e = t = n = NaN), new Fe(e, t, n, o);
}
function sm(e) {
  return e instanceof In || (e = Nn(e)), e ? (e = e.rgb(), new Fe(e.r, e.g, e.b, e.opacity)) : new Fe();
}
function $i(e, t, n, o) {
  return arguments.length === 1 ? sm(e) : new Fe(e, t, n, o ?? 1);
}
function Fe(e, t, n, o) {
  this.r = +e, this.g = +t, this.b = +n, this.opacity = +o;
}
Xi(Fe, $i, Ia(In, {
  brighter(e) {
    return e = e == null ? yo : Math.pow(yo, e), new Fe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xn : Math.pow(xn, e), new Fe(this.r * e, this.g * e, this.b * e, this.opacity);
  },
  rgb() {
    return this;
  },
  clamp() {
    return new Fe(Pt(this.r), Pt(this.g), Pt(this.b), _o(this.opacity));
  },
  displayable() {
    return -0.5 <= this.r && this.r < 255.5 && -0.5 <= this.g && this.g < 255.5 && -0.5 <= this.b && this.b < 255.5 && 0 <= this.opacity && this.opacity <= 1;
  },
  hex: Zr,
  // Deprecated! Use color.formatHex.
  formatHex: Zr,
  formatHex8: am,
  formatRgb: qr,
  toString: qr
}));
function Zr() {
  return `#${Dt(this.r)}${Dt(this.g)}${Dt(this.b)}`;
}
function am() {
  return `#${Dt(this.r)}${Dt(this.g)}${Dt(this.b)}${Dt((isNaN(this.opacity) ? 1 : this.opacity) * 255)}`;
}
function qr() {
  const e = _o(this.opacity);
  return `${e === 1 ? "rgb(" : "rgba("}${Pt(this.r)}, ${Pt(this.g)}, ${Pt(this.b)}${e === 1 ? ")" : `, ${e})`}`;
}
function _o(e) {
  return isNaN(e) ? 1 : Math.max(0, Math.min(1, e));
}
function Pt(e) {
  return Math.max(0, Math.min(255, Math.round(e) || 0));
}
function Dt(e) {
  return e = Pt(e), (e < 16 ? "0" : "") + e.toString(16);
}
function Wr(e, t, n, o) {
  return o <= 0 ? e = t = n = NaN : n <= 0 || n >= 1 ? e = t = NaN : t <= 0 && (e = NaN), new We(e, t, n, o);
}
function Aa(e) {
  if (e instanceof We) return new We(e.h, e.s, e.l, e.opacity);
  if (e instanceof In || (e = Nn(e)), !e) return new We();
  if (e instanceof We) return e;
  e = e.rgb();
  var t = e.r / 255, n = e.g / 255, o = e.b / 255, i = Math.min(t, n, o), r = Math.max(t, n, o), s = NaN, a = r - i, l = (r + i) / 2;
  return a ? (t === r ? s = (n - o) / a + (n < o) * 6 : n === r ? s = (o - t) / a + 2 : s = (t - n) / a + 4, a /= l < 0.5 ? r + i : 2 - r - i, s *= 60) : a = l > 0 && l < 1 ? 0 : s, new We(s, a, l, e.opacity);
}
function lm(e, t, n, o) {
  return arguments.length === 1 ? Aa(e) : new We(e, t, n, o ?? 1);
}
function We(e, t, n, o) {
  this.h = +e, this.s = +t, this.l = +n, this.opacity = +o;
}
Xi(We, lm, Ia(In, {
  brighter(e) {
    return e = e == null ? yo : Math.pow(yo, e), new We(this.h, this.s, this.l * e, this.opacity);
  },
  darker(e) {
    return e = e == null ? xn : Math.pow(xn, e), new We(this.h, this.s, this.l * e, this.opacity);
  },
  rgb() {
    var e = this.h % 360 + (this.h < 0) * 360, t = isNaN(e) || isNaN(this.s) ? 0 : this.s, n = this.l, o = n + (n < 0.5 ? n : 1 - n) * t, i = 2 * n - o;
    return new Fe(
      ei(e >= 240 ? e - 240 : e + 120, i, o),
      ei(e, i, o),
      ei(e < 120 ? e + 240 : e - 120, i, o),
      this.opacity
    );
  },
  clamp() {
    return new We(Kr(this.h), Un(this.s), Un(this.l), _o(this.opacity));
  },
  displayable() {
    return (0 <= this.s && this.s <= 1 || isNaN(this.s)) && 0 <= this.l && this.l <= 1 && 0 <= this.opacity && this.opacity <= 1;
  },
  formatHsl() {
    const e = _o(this.opacity);
    return `${e === 1 ? "hsl(" : "hsla("}${Kr(this.h)}, ${Un(this.s) * 100}%, ${Un(this.l) * 100}%${e === 1 ? ")" : `, ${e})`}`;
  }
}));
function Kr(e) {
  return e = (e || 0) % 360, e < 0 ? e + 360 : e;
}
function Un(e) {
  return Math.max(0, Math.min(1, e || 0));
}
function ei(e, t, n) {
  return (e < 60 ? t + (n - t) * e / 60 : e < 180 ? n : e < 240 ? t + (n - t) * (240 - e) / 60 : t) * 255;
}
const Pa = (e) => () => e;
function um(e, t) {
  return function(n) {
    return e + n * t;
  };
}
function cm(e, t, n) {
  return e = Math.pow(e, n), t = Math.pow(t, n) - e, n = 1 / n, function(o) {
    return Math.pow(e + o * t, n);
  };
}
function dm(e) {
  return (e = +e) == 1 ? Oa : function(t, n) {
    return n - t ? cm(t, n, e) : Pa(isNaN(t) ? n : t);
  };
}
function Oa(e, t) {
  var n = t - e;
  return n ? um(e, n) : Pa(isNaN(e) ? t : e);
}
const Qr = (function e(t) {
  var n = dm(t);
  function o(i, r) {
    var s = n((i = $i(i)).r, (r = $i(r)).r), a = n(i.g, r.g), l = n(i.b, r.b), u = Oa(i.opacity, r.opacity);
    return function(c) {
      return i.r = s(c), i.g = a(c), i.b = l(c), i.opacity = u(c), i + "";
    };
  }
  return o.gamma = e, o;
})(1);
function wt(e, t) {
  return e = +e, t = +t, function(n) {
    return e * (1 - n) + t * n;
  };
}
var Ei = /[-+]?(?:\d+\.?\d*|\.?\d+)(?:[eE][-+]?\d+)?/g, ti = new RegExp(Ei.source, "g");
function fm(e) {
  return function() {
    return e;
  };
}
function hm(e) {
  return function(t) {
    return e(t) + "";
  };
}
function vm(e, t) {
  var n = Ei.lastIndex = ti.lastIndex = 0, o, i, r, s = -1, a = [], l = [];
  for (e = e + "", t = t + ""; (o = Ei.exec(e)) && (i = ti.exec(t)); )
    (r = i.index) > n && (r = t.slice(n, r), a[s] ? a[s] += r : a[++s] = r), (o = o[0]) === (i = i[0]) ? a[s] ? a[s] += i : a[++s] = i : (a[++s] = null, l.push({ i: s, x: wt(o, i) })), n = ti.lastIndex;
  return n < t.length && (r = t.slice(n), a[s] ? a[s] += r : a[++s] = r), a.length < 2 ? l[0] ? hm(l[0].x) : fm(t) : (t = l.length, function(u) {
    for (var c = 0, d; c < t; ++c) a[(d = l[c]).i] = d.x(u);
    return a.join("");
  });
}
var Jr = 180 / Math.PI, xi = {
  translateX: 0,
  translateY: 0,
  rotate: 0,
  skewX: 0,
  scaleX: 1,
  scaleY: 1
};
function za(e, t, n, o, i, r) {
  var s, a, l;
  return (s = Math.sqrt(e * e + t * t)) && (e /= s, t /= s), (l = e * n + t * o) && (n -= e * l, o -= t * l), (a = Math.sqrt(n * n + o * o)) && (n /= a, o /= a, l /= a), e * o < t * n && (e = -e, t = -t, l = -l, s = -s), {
    translateX: i,
    translateY: r,
    rotate: Math.atan2(t, e) * Jr,
    skewX: Math.atan(l) * Jr,
    scaleX: s,
    scaleY: a
  };
}
var Xn;
function pm(e) {
  const t = new (typeof DOMMatrix == "function" ? DOMMatrix : WebKitCSSMatrix)(e + "");
  return t.isIdentity ? xi : za(t.a, t.b, t.c, t.d, t.e, t.f);
}
function gm(e) {
  return e == null || (Xn || (Xn = document.createElementNS("http://www.w3.org/2000/svg", "g")), Xn.setAttribute("transform", e), !(e = Xn.transform.baseVal.consolidate())) ? xi : (e = e.matrix, za(e.a, e.b, e.c, e.d, e.e, e.f));
}
function Ra(e, t, n, o) {
  function i(u) {
    return u.length ? u.pop() + " " : "";
  }
  function r(u, c, d, h, v, E) {
    if (u !== d || c !== h) {
      var b = v.push("translate(", null, t, null, n);
      E.push({ i: b - 4, x: wt(u, d) }, { i: b - 2, x: wt(c, h) });
    } else (d || h) && v.push("translate(" + d + t + h + n);
  }
  function s(u, c, d, h) {
    u !== c ? (u - c > 180 ? c += 360 : c - u > 180 && (u += 360), h.push({ i: d.push(i(d) + "rotate(", null, o) - 2, x: wt(u, c) })) : c && d.push(i(d) + "rotate(" + c + o);
  }
  function a(u, c, d, h) {
    u !== c ? h.push({ i: d.push(i(d) + "skewX(", null, o) - 2, x: wt(u, c) }) : c && d.push(i(d) + "skewX(" + c + o);
  }
  function l(u, c, d, h, v, E) {
    if (u !== d || c !== h) {
      var b = v.push(i(v) + "scale(", null, ",", null, ")");
      E.push({ i: b - 4, x: wt(u, d) }, { i: b - 2, x: wt(c, h) });
    } else (d !== 1 || h !== 1) && v.push(i(v) + "scale(" + d + "," + h + ")");
  }
  return function(u, c) {
    var d = [], h = [];
    return u = e(u), c = e(c), r(u.translateX, u.translateY, c.translateX, c.translateY, d, h), s(u.rotate, c.rotate, d, h), a(u.skewX, c.skewX, d, h), l(u.scaleX, u.scaleY, c.scaleX, c.scaleY, d, h), u = c = null, function(v) {
      for (var E = -1, b = h.length, S; ++E < b; ) d[(S = h[E]).i] = S.x(v);
      return d.join("");
    };
  };
}
var mm = Ra(pm, "px, ", "px)", "deg)"), ym = Ra(gm, ", ", ")", ")"), _m = 1e-12;
function jr(e) {
  return ((e = Math.exp(e)) + 1 / e) / 2;
}
function wm(e) {
  return ((e = Math.exp(e)) - 1 / e) / 2;
}
function bm(e) {
  return ((e = Math.exp(2 * e)) - 1) / (e + 1);
}
const $m = (function e(t, n, o) {
  function i(r, s) {
    var a = r[0], l = r[1], u = r[2], c = s[0], d = s[1], h = s[2], v = c - a, E = d - l, b = v * v + E * E, S, _;
    if (b < _m)
      _ = Math.log(h / u) / t, S = function(V) {
        return [
          a + V * v,
          l + V * E,
          u * Math.exp(t * V * _)
        ];
      };
    else {
      var P = Math.sqrt(b), y = (h * h - u * u + o * b) / (2 * u * n * P), x = (h * h - u * u - o * b) / (2 * h * n * P), R = Math.log(Math.sqrt(y * y + 1) - y), Y = Math.log(Math.sqrt(x * x + 1) - x);
      _ = (Y - R) / t, S = function(V) {
        var U = V * _, ie = jr(R), H = u / (n * P) * (ie * bm(t * U + R) - wm(R));
        return [
          a + H * v,
          l + H * E,
          u * ie / jr(t * U + R)
        ];
      };
    }
    return S.duration = _ * 1e3 * t / Math.SQRT2, S;
  }
  return i.rho = function(r) {
    var s = Math.max(1e-3, +r), a = s * s, l = a * a;
    return e(s, a, l);
  }, i;
})(Math.SQRT2, 2, 4);
var jt = 0, un = 0, on = 0, Ba = 1e3, wo, cn, bo = 0, Lt = 0, zo = 0, Cn = typeof performance == "object" && performance.now ? performance : Date, La = typeof window == "object" && window.requestAnimationFrame ? window.requestAnimationFrame.bind(window) : function(e) {
  setTimeout(e, 17);
};
function Gi() {
  return Lt || (La(Em), Lt = Cn.now() + zo);
}
function Em() {
  Lt = 0;
}
function $o() {
  this._call = this._time = this._next = null;
}
$o.prototype = Va.prototype = {
  constructor: $o,
  restart: function(e, t, n) {
    if (typeof e != "function") throw new TypeError("callback is not a function");
    n = (n == null ? Gi() : +n) + (t == null ? 0 : +t), !this._next && cn !== this && (cn ? cn._next = this : wo = this, cn = this), this._call = e, this._time = n, Si();
  },
  stop: function() {
    this._call && (this._call = null, this._time = 1 / 0, Si());
  }
};
function Va(e, t, n) {
  var o = new $o();
  return o.restart(e, t, n), o;
}
function xm() {
  Gi(), ++jt;
  for (var e = wo, t; e; )
    (t = Lt - e._time) >= 0 && e._call.call(void 0, t), e = e._next;
  --jt;
}
function es() {
  Lt = (bo = Cn.now()) + zo, jt = un = 0;
  try {
    xm();
  } finally {
    jt = 0, Nm(), Lt = 0;
  }
}
function Sm() {
  var e = Cn.now(), t = e - bo;
  t > Ba && (zo -= t, bo = e);
}
function Nm() {
  for (var e, t = wo, n, o = 1 / 0; t; )
    t._call ? (o > t._time && (o = t._time), e = t, t = t._next) : (n = t._next, t._next = null, t = e ? e._next = n : wo = n);
  cn = e, Si(o);
}
function Si(e) {
  if (!jt) {
    un && (un = clearTimeout(un));
    var t = e - Lt;
    t > 24 ? (e < 1 / 0 && (un = setTimeout(es, e - Cn.now() - zo)), on && (on = clearInterval(on))) : (on || (bo = Cn.now(), on = setInterval(Sm, Ba)), jt = 1, La(es));
  }
}
function ts(e, t, n) {
  var o = new $o();
  return t = t == null ? 0 : +t, o.restart((i) => {
    o.stop(), e(i + t);
  }, t, n), o;
}
var Cm = Fi("start", "end", "cancel", "interrupt"), km = [], Ha = 0, ns = 1, Ni = 2, to = 3, os = 4, Ci = 5, no = 6;
function Ro(e, t, n, o, i, r) {
  var s = e.__transition;
  if (!s) e.__transition = {};
  else if (n in s) return;
  Mm(e, n, {
    name: t,
    index: o,
    // For context during callback.
    group: i,
    // For context during callback.
    on: Cm,
    tween: km,
    time: r.time,
    delay: r.delay,
    duration: r.duration,
    ease: r.ease,
    timer: null,
    state: Ha
  });
}
function Zi(e, t) {
  var n = Qe(e, t);
  if (n.state > Ha) throw new Error("too late; already scheduled");
  return n;
}
function at(e, t) {
  var n = Qe(e, t);
  if (n.state > to) throw new Error("too late; already running");
  return n;
}
function Qe(e, t) {
  var n = e.__transition;
  if (!n || !(n = n[t])) throw new Error("transition not found");
  return n;
}
function Mm(e, t, n) {
  var o = e.__transition, i;
  o[t] = n, n.timer = Va(r, 0, n.time);
  function r(u) {
    n.state = ns, n.timer.restart(s, n.delay, n.time), n.delay <= u && s(u - n.delay);
  }
  function s(u) {
    var c, d, h, v;
    if (n.state !== ns) return l();
    for (c in o)
      if (v = o[c], v.name === n.name) {
        if (v.state === to) return ts(s);
        v.state === os ? (v.state = no, v.timer.stop(), v.on.call("interrupt", e, e.__data__, v.index, v.group), delete o[c]) : +c < t && (v.state = no, v.timer.stop(), v.on.call("cancel", e, e.__data__, v.index, v.group), delete o[c]);
      }
    if (ts(function() {
      n.state === to && (n.state = os, n.timer.restart(a, n.delay, n.time), a(u));
    }), n.state = Ni, n.on.call("start", e, e.__data__, n.index, n.group), n.state === Ni) {
      for (n.state = to, i = new Array(h = n.tween.length), c = 0, d = -1; c < h; ++c)
        (v = n.tween[c].value.call(e, e.__data__, n.index, n.group)) && (i[++d] = v);
      i.length = d + 1;
    }
  }
  function a(u) {
    for (var c = u < n.duration ? n.ease.call(null, u / n.duration) : (n.timer.restart(l), n.state = Ci, 1), d = -1, h = i.length; ++d < h; )
      i[d].call(e, c);
    n.state === Ci && (n.on.call("end", e, e.__data__, n.index, n.group), l());
  }
  function l() {
    n.state = no, n.timer.stop(), delete o[t];
    for (var u in o) return;
    delete e.__transition;
  }
}
function oo(e, t) {
  var n = e.__transition, o, i, r = !0, s;
  if (n) {
    t = t == null ? null : t + "";
    for (s in n) {
      if ((o = n[s]).name !== t) {
        r = !1;
        continue;
      }
      i = o.state > Ni && o.state < Ci, o.state = no, o.timer.stop(), o.on.call(i ? "interrupt" : "cancel", e, e.__data__, o.index, o.group), delete n[s];
    }
    r && delete e.__transition;
  }
}
function Tm(e) {
  return this.each(function() {
    oo(this, e);
  });
}
function Dm(e, t) {
  var n, o;
  return function() {
    var i = at(this, e), r = i.tween;
    if (r !== n) {
      o = n = r;
      for (var s = 0, a = o.length; s < a; ++s)
        if (o[s].name === t) {
          o = o.slice(), o.splice(s, 1);
          break;
        }
    }
    i.tween = o;
  };
}
function Im(e, t, n) {
  var o, i;
  if (typeof n != "function") throw new Error();
  return function() {
    var r = at(this, e), s = r.tween;
    if (s !== o) {
      i = (o = s).slice();
      for (var a = { name: t, value: n }, l = 0, u = i.length; l < u; ++l)
        if (i[l].name === t) {
          i[l] = a;
          break;
        }
      l === u && i.push(a);
    }
    r.tween = i;
  };
}
function Am(e, t) {
  var n = this._id;
  if (e += "", arguments.length < 2) {
    for (var o = Qe(this.node(), n).tween, i = 0, r = o.length, s; i < r; ++i)
      if ((s = o[i]).name === e)
        return s.value;
    return null;
  }
  return this.each((t == null ? Dm : Im)(n, e, t));
}
function qi(e, t, n) {
  var o = e._id;
  return e.each(function() {
    var i = at(this, o);
    (i.value || (i.value = {}))[t] = n.apply(this, arguments);
  }), function(i) {
    return Qe(i, o).value[t];
  };
}
function Fa(e, t) {
  var n;
  return (typeof t == "number" ? wt : t instanceof Nn ? Qr : (n = Nn(t)) ? (t = n, Qr) : vm)(e, t);
}
function Pm(e) {
  return function() {
    this.removeAttribute(e);
  };
}
function Om(e) {
  return function() {
    this.removeAttributeNS(e.space, e.local);
  };
}
function zm(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttribute(e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Rm(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = this.getAttributeNS(e.space, e.local);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function Bm(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttribute(e) : (s = this.getAttribute(e), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function Lm(e, t, n) {
  var o, i, r;
  return function() {
    var s, a = n(this), l;
    return a == null ? void this.removeAttributeNS(e.space, e.local) : (s = this.getAttributeNS(e.space, e.local), l = a + "", s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a)));
  };
}
function Vm(e, t) {
  var n = Oo(e), o = n === "transform" ? ym : Fa;
  return this.attrTween(e, typeof t == "function" ? (n.local ? Lm : Bm)(n, o, qi(this, "attr." + e, t)) : t == null ? (n.local ? Om : Pm)(n) : (n.local ? Rm : zm)(n, o, t));
}
function Hm(e, t) {
  return function(n) {
    this.setAttribute(e, t.call(this, n));
  };
}
function Fm(e, t) {
  return function(n) {
    this.setAttributeNS(e.space, e.local, t.call(this, n));
  };
}
function Ym(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Fm(e, r)), n;
  }
  return i._value = t, i;
}
function Um(e, t) {
  var n, o;
  function i() {
    var r = t.apply(this, arguments);
    return r !== o && (n = (o = r) && Hm(e, r)), n;
  }
  return i._value = t, i;
}
function Xm(e, t) {
  var n = "attr." + e;
  if (arguments.length < 2) return (n = this.tween(n)) && n._value;
  if (t == null) return this.tween(n, null);
  if (typeof t != "function") throw new Error();
  var o = Oo(e);
  return this.tween(n, (o.local ? Ym : Um)(o, t));
}
function Gm(e, t) {
  return function() {
    Zi(this, e).delay = +t.apply(this, arguments);
  };
}
function Zm(e, t) {
  return t = +t, function() {
    Zi(this, e).delay = t;
  };
}
function qm(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Gm : Zm)(t, e)) : Qe(this.node(), t).delay;
}
function Wm(e, t) {
  return function() {
    at(this, e).duration = +t.apply(this, arguments);
  };
}
function Km(e, t) {
  return t = +t, function() {
    at(this, e).duration = t;
  };
}
function Qm(e) {
  var t = this._id;
  return arguments.length ? this.each((typeof e == "function" ? Wm : Km)(t, e)) : Qe(this.node(), t).duration;
}
function Jm(e, t) {
  if (typeof t != "function") throw new Error();
  return function() {
    at(this, e).ease = t;
  };
}
function jm(e) {
  var t = this._id;
  return arguments.length ? this.each(Jm(t, e)) : Qe(this.node(), t).ease;
}
function ey(e, t) {
  return function() {
    var n = t.apply(this, arguments);
    if (typeof n != "function") throw new Error();
    at(this, e).ease = n;
  };
}
function ty(e) {
  if (typeof e != "function") throw new Error();
  return this.each(ey(this._id, e));
}
function ny(e) {
  typeof e != "function" && (e = $a(e));
  for (var t = this._groups, n = t.length, o = new Array(n), i = 0; i < n; ++i)
    for (var r = t[i], s = r.length, a = o[i] = [], l, u = 0; u < s; ++u)
      (l = r[u]) && e.call(l, l.__data__, u, r) && a.push(l);
  return new pt(o, this._parents, this._name, this._id);
}
function oy(e) {
  if (e._id !== this._id) throw new Error();
  for (var t = this._groups, n = e._groups, o = t.length, i = n.length, r = Math.min(o, i), s = new Array(o), a = 0; a < r; ++a)
    for (var l = t[a], u = n[a], c = l.length, d = s[a] = new Array(c), h, v = 0; v < c; ++v)
      (h = l[v] || u[v]) && (d[v] = h);
  for (; a < o; ++a)
    s[a] = t[a];
  return new pt(s, this._parents, this._name, this._id);
}
function iy(e) {
  return (e + "").trim().split(/^|\s+/).every(function(t) {
    var n = t.indexOf(".");
    return n >= 0 && (t = t.slice(0, n)), !t || t === "start";
  });
}
function ry(e, t, n) {
  var o, i, r = iy(t) ? Zi : at;
  return function() {
    var s = r(this, e), a = s.on;
    a !== o && (i = (o = a).copy()).on(t, n), s.on = i;
  };
}
function sy(e, t) {
  var n = this._id;
  return arguments.length < 2 ? Qe(this.node(), n).on.on(e) : this.each(ry(n, e, t));
}
function ay(e) {
  return function() {
    var t = this.parentNode;
    for (var n in this.__transition) if (+n !== e) return;
    t && t.removeChild(this);
  };
}
function ly() {
  return this.on("end.remove", ay(this._id));
}
function uy(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = Yi(e));
  for (var o = this._groups, i = o.length, r = new Array(i), s = 0; s < i; ++s)
    for (var a = o[s], l = a.length, u = r[s] = new Array(l), c, d, h = 0; h < l; ++h)
      (c = a[h]) && (d = e.call(c, c.__data__, h, a)) && ("__data__" in c && (d.__data__ = c.__data__), u[h] = d, Ro(u[h], t, n, h, u, Qe(c, n)));
  return new pt(r, this._parents, t, n);
}
function cy(e) {
  var t = this._name, n = this._id;
  typeof e != "function" && (e = ba(e));
  for (var o = this._groups, i = o.length, r = [], s = [], a = 0; a < i; ++a)
    for (var l = o[a], u = l.length, c, d = 0; d < u; ++d)
      if (c = l[d]) {
        for (var h = e.call(c, c.__data__, d, l), v, E = Qe(c, n), b = 0, S = h.length; b < S; ++b)
          (v = h[b]) && Ro(v, t, n, b, h, E);
        r.push(h), s.push(c);
      }
  return new pt(r, s, t, n);
}
var dy = Dn.prototype.constructor;
function fy() {
  return new dy(this._groups, this._parents);
}
function hy(e, t) {
  var n, o, i;
  return function() {
    var r = Jt(this, e), s = (this.style.removeProperty(e), Jt(this, e));
    return r === s ? null : r === n && s === o ? i : i = t(n = r, o = s);
  };
}
function Ya(e) {
  return function() {
    this.style.removeProperty(e);
  };
}
function vy(e, t, n) {
  var o, i = n + "", r;
  return function() {
    var s = Jt(this, e);
    return s === i ? null : s === o ? r : r = t(o = s, n);
  };
}
function py(e, t, n) {
  var o, i, r;
  return function() {
    var s = Jt(this, e), a = n(this), l = a + "";
    return a == null && (l = a = (this.style.removeProperty(e), Jt(this, e))), s === l ? null : s === o && l === i ? r : (i = l, r = t(o = s, a));
  };
}
function gy(e, t) {
  var n, o, i, r = "style." + t, s = "end." + r, a;
  return function() {
    var l = at(this, e), u = l.on, c = l.value[r] == null ? a || (a = Ya(t)) : void 0;
    (u !== n || i !== c) && (o = (n = u).copy()).on(s, i = c), l.on = o;
  };
}
function my(e, t, n) {
  var o = (e += "") == "transform" ? mm : Fa;
  return t == null ? this.styleTween(e, hy(e, o)).on("end.style." + e, Ya(e)) : typeof t == "function" ? this.styleTween(e, py(e, o, qi(this, "style." + e, t))).each(gy(this._id, e)) : this.styleTween(e, vy(e, o, t), n).on("end.style." + e, null);
}
function yy(e, t, n) {
  return function(o) {
    this.style.setProperty(e, t.call(this, o), n);
  };
}
function _y(e, t, n) {
  var o, i;
  function r() {
    var s = t.apply(this, arguments);
    return s !== i && (o = (i = s) && yy(e, s, n)), o;
  }
  return r._value = t, r;
}
function wy(e, t, n) {
  var o = "style." + (e += "");
  if (arguments.length < 2) return (o = this.tween(o)) && o._value;
  if (t == null) return this.tween(o, null);
  if (typeof t != "function") throw new Error();
  return this.tween(o, _y(e, t, n ?? ""));
}
function by(e) {
  return function() {
    this.textContent = e;
  };
}
function $y(e) {
  return function() {
    var t = e(this);
    this.textContent = t ?? "";
  };
}
function Ey(e) {
  return this.tween("text", typeof e == "function" ? $y(qi(this, "text", e)) : by(e == null ? "" : e + ""));
}
function xy(e) {
  return function(t) {
    this.textContent = e.call(this, t);
  };
}
function Sy(e) {
  var t, n;
  function o() {
    var i = e.apply(this, arguments);
    return i !== n && (t = (n = i) && xy(i)), t;
  }
  return o._value = e, o;
}
function Ny(e) {
  var t = "text";
  if (arguments.length < 1) return (t = this.tween(t)) && t._value;
  if (e == null) return this.tween(t, null);
  if (typeof e != "function") throw new Error();
  return this.tween(t, Sy(e));
}
function Cy() {
  for (var e = this._name, t = this._id, n = Ua(), o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      if (l = s[u]) {
        var c = Qe(l, t);
        Ro(l, e, n, u, s, {
          time: c.time + c.delay + c.duration,
          delay: 0,
          duration: c.duration,
          ease: c.ease
        });
      }
  return new pt(o, this._parents, e, n);
}
function ky() {
  var e, t, n = this, o = n._id, i = n.size();
  return new Promise(function(r, s) {
    var a = { value: s }, l = { value: function() {
      --i === 0 && r();
    } };
    n.each(function() {
      var u = at(this, o), c = u.on;
      c !== e && (t = (e = c).copy(), t._.cancel.push(a), t._.interrupt.push(a), t._.end.push(l)), u.on = t;
    }), i === 0 && r();
  });
}
var My = 0;
function pt(e, t, n, o) {
  this._groups = e, this._parents = t, this._name = n, this._id = o;
}
function Ua() {
  return ++My;
}
var ut = Dn.prototype;
pt.prototype = {
  constructor: pt,
  select: uy,
  selectAll: cy,
  selectChild: ut.selectChild,
  selectChildren: ut.selectChildren,
  filter: ny,
  merge: oy,
  selection: fy,
  transition: Cy,
  call: ut.call,
  nodes: ut.nodes,
  node: ut.node,
  size: ut.size,
  empty: ut.empty,
  each: ut.each,
  on: sy,
  attr: Vm,
  attrTween: Xm,
  style: my,
  styleTween: wy,
  text: Ey,
  textTween: Ny,
  remove: ly,
  tween: Am,
  delay: qm,
  duration: Qm,
  ease: jm,
  easeVarying: ty,
  end: ky,
  [Symbol.iterator]: ut[Symbol.iterator]
};
function Ty(e) {
  return ((e *= 2) <= 1 ? e * e * e : (e -= 2) * e * e + 2) / 2;
}
var Dy = {
  time: null,
  // Set on use.
  delay: 0,
  duration: 250,
  ease: Ty
};
function Iy(e, t) {
  for (var n; !(n = e.__transition) || !(n = n[t]); )
    if (!(e = e.parentNode))
      throw new Error(`transition ${t} not found`);
  return n;
}
function Ay(e) {
  var t, n;
  e instanceof pt ? (t = e._id, e = e._name) : (t = Ua(), (n = Dy).time = Gi(), e = e == null ? null : e + "");
  for (var o = this._groups, i = o.length, r = 0; r < i; ++r)
    for (var s = o[r], a = s.length, l, u = 0; u < a; ++u)
      (l = s[u]) && Ro(l, e, t, u, s, n || Iy(l, t));
  return new pt(o, this._parents, e, t);
}
Dn.prototype.interrupt = Tm;
Dn.prototype.transition = Ay;
const Gn = (e) => () => e;
function Py(e, {
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
function ht(e, t, n) {
  this.k = e, this.x = t, this.y = n;
}
ht.prototype = {
  constructor: ht,
  scale: function(e) {
    return e === 1 ? this : new ht(this.k * e, this.x, this.y);
  },
  translate: function(e, t) {
    return e === 0 & t === 0 ? this : new ht(this.k, this.x + this.k * e, this.y + this.k * t);
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
var Wi = new ht(1, 0, 0);
ht.prototype;
function ni(e) {
  e.stopImmediatePropagation();
}
function rn(e) {
  e.preventDefault(), e.stopImmediatePropagation();
}
function Oy(e) {
  return (!e.ctrlKey || e.type === "wheel") && !e.button;
}
function zy() {
  var e = this;
  return e instanceof SVGElement ? (e = e.ownerSVGElement || e, e.hasAttribute("viewBox") ? (e = e.viewBox.baseVal, [[e.x, e.y], [e.x + e.width, e.y + e.height]]) : [[0, 0], [e.width.baseVal.value, e.height.baseVal.value]]) : [[0, 0], [e.clientWidth, e.clientHeight]];
}
function is() {
  return this.__zoom || Wi;
}
function Ry(e) {
  return -e.deltaY * (e.deltaMode === 1 ? 0.05 : e.deltaMode ? 1 : 2e-3) * (e.ctrlKey ? 10 : 1);
}
function By() {
  return navigator.maxTouchPoints || "ontouchstart" in this;
}
function Ly(e, t, n) {
  var o = e.invertX(t[0][0]) - n[0][0], i = e.invertX(t[1][0]) - n[1][0], r = e.invertY(t[0][1]) - n[0][1], s = e.invertY(t[1][1]) - n[1][1];
  return e.translate(
    i > o ? (o + i) / 2 : Math.min(0, o) || Math.max(0, i),
    s > r ? (r + s) / 2 : Math.min(0, r) || Math.max(0, s)
  );
}
function Vy() {
  var e = Oy, t = zy, n = Ly, o = Ry, i = By, r = [0, 1 / 0], s = [[-1 / 0, -1 / 0], [1 / 0, 1 / 0]], a = 250, l = $m, u = Fi("start", "zoom", "end"), c, d, h, v = 500, E = 150, b = 0, S = 10;
  function _(f) {
    f.property("__zoom", is).on("wheel.zoom", U, { passive: !1 }).on("mousedown.zoom", ie).on("dblclick.zoom", H).filter(i).on("touchstart.zoom", X).on("touchmove.zoom", k).on("touchend.zoom touchcancel.zoom", oe).style("-webkit-tap-highlight-color", "rgba(0,0,0,0)");
  }
  _.transform = function(f, N, p, D) {
    var C = f.selection ? f.selection() : f;
    C.property("__zoom", is), f !== C ? R(f, N, p, D) : C.interrupt().each(function() {
      Y(this, arguments).event(D).start().zoom(null, typeof N == "function" ? N.apply(this, arguments) : N).end();
    });
  }, _.scaleBy = function(f, N, p, D) {
    _.scaleTo(f, function() {
      var C = this.__zoom.k, O = typeof N == "function" ? N.apply(this, arguments) : N;
      return C * O;
    }, p, D);
  }, _.scaleTo = function(f, N, p, D) {
    _.transform(f, function() {
      var C = t.apply(this, arguments), O = this.__zoom, T = p == null ? x(C) : typeof p == "function" ? p.apply(this, arguments) : p, B = O.invert(T), Z = typeof N == "function" ? N.apply(this, arguments) : N;
      return n(y(P(O, Z), T, B), C, s);
    }, p, D);
  }, _.translateBy = function(f, N, p, D) {
    _.transform(f, function() {
      return n(this.__zoom.translate(
        typeof N == "function" ? N.apply(this, arguments) : N,
        typeof p == "function" ? p.apply(this, arguments) : p
      ), t.apply(this, arguments), s);
    }, null, D);
  }, _.translateTo = function(f, N, p, D, C) {
    _.transform(f, function() {
      var O = t.apply(this, arguments), T = this.__zoom, B = D == null ? x(O) : typeof D == "function" ? D.apply(this, arguments) : D;
      return n(Wi.translate(B[0], B[1]).scale(T.k).translate(
        typeof N == "function" ? -N.apply(this, arguments) : -N,
        typeof p == "function" ? -p.apply(this, arguments) : -p
      ), O, s);
    }, D, C);
  };
  function P(f, N) {
    return N = Math.max(r[0], Math.min(r[1], N)), N === f.k ? f : new ht(N, f.x, f.y);
  }
  function y(f, N, p) {
    var D = N[0] - p[0] * f.k, C = N[1] - p[1] * f.k;
    return D === f.x && C === f.y ? f : new ht(f.k, D, C);
  }
  function x(f) {
    return [(+f[0][0] + +f[1][0]) / 2, (+f[0][1] + +f[1][1]) / 2];
  }
  function R(f, N, p, D) {
    f.on("start.zoom", function() {
      Y(this, arguments).event(D).start();
    }).on("interrupt.zoom end.zoom", function() {
      Y(this, arguments).event(D).end();
    }).tween("zoom", function() {
      var C = this, O = arguments, T = Y(C, O).event(D), B = t.apply(C, O), Z = p == null ? x(B) : typeof p == "function" ? p.apply(C, O) : p, j = Math.max(B[1][0] - B[0][0], B[1][1] - B[0][1]), re = C.__zoom, G = typeof N == "function" ? N.apply(C, O) : N, F = l(re.invert(Z).concat(j / re.k), G.invert(Z).concat(j / G.k));
      return function(ee) {
        if (ee === 1) ee = G;
        else {
          var he = F(ee), pe = j / he[2];
          ee = new ht(pe, Z[0] - he[0] * pe, Z[1] - he[1] * pe);
        }
        T.zoom(null, ee);
      };
    });
  }
  function Y(f, N, p) {
    return !p && f.__zooming || new V(f, N);
  }
  function V(f, N) {
    this.that = f, this.args = N, this.active = 0, this.sourceEvent = null, this.extent = t.apply(f, N), this.taps = 0;
  }
  V.prototype = {
    event: function(f) {
      return f && (this.sourceEvent = f), this;
    },
    start: function() {
      return ++this.active === 1 && (this.that.__zooming = this, this.emit("start")), this;
    },
    zoom: function(f, N) {
      return this.mouse && f !== "mouse" && (this.mouse[1] = N.invert(this.mouse[0])), this.touch0 && f !== "touch" && (this.touch0[1] = N.invert(this.touch0[0])), this.touch1 && f !== "touch" && (this.touch1[1] = N.invert(this.touch1[0])), this.that.__zoom = N, this.emit("zoom"), this;
    },
    end: function() {
      return --this.active === 0 && (delete this.that.__zooming, this.emit("end")), this;
    },
    emit: function(f) {
      var N = bt(this.that).datum();
      u.call(
        f,
        this.that,
        new Py(f, {
          sourceEvent: this.sourceEvent,
          target: _,
          transform: this.that.__zoom,
          dispatch: u
        }),
        N
      );
    }
  };
  function U(f, ...N) {
    if (!e.apply(this, arguments)) return;
    var p = Y(this, N).event(f), D = this.__zoom, C = Math.max(r[0], Math.min(r[1], D.k * Math.pow(2, o.apply(this, arguments)))), O = yt(f);
    if (p.wheel)
      (p.mouse[0][0] !== O[0] || p.mouse[0][1] !== O[1]) && (p.mouse[1] = D.invert(p.mouse[0] = O)), clearTimeout(p.wheel);
    else {
      if (D.k === C) return;
      p.mouse = [O, D.invert(O)], oo(this), p.start();
    }
    rn(f), p.wheel = setTimeout(T, E), p.zoom("mouse", n(y(P(D, C), p.mouse[0], p.mouse[1]), p.extent, s));
    function T() {
      p.wheel = null, p.end();
    }
  }
  function ie(f, ...N) {
    if (h || !e.apply(this, arguments)) return;
    var p = f.currentTarget, D = Y(this, N, !0).event(f), C = bt(f.view).on("mousemove.zoom", Z, !0).on("mouseup.zoom", j, !0), O = yt(f, p), T = f.clientX, B = f.clientY;
    Wg(f.view), ni(f), D.mouse = [O, this.__zoom.invert(O)], oo(this), D.start();
    function Z(re) {
      if (rn(re), !D.moved) {
        var G = re.clientX - T, F = re.clientY - B;
        D.moved = G * G + F * F > b;
      }
      D.event(re).zoom("mouse", n(y(D.that.__zoom, D.mouse[0] = yt(re, p), D.mouse[1]), D.extent, s));
    }
    function j(re) {
      C.on("mousemove.zoom mouseup.zoom", null), Kg(re.view, D.moved), rn(re), D.event(re).end();
    }
  }
  function H(f, ...N) {
    if (e.apply(this, arguments)) {
      var p = this.__zoom, D = yt(f.changedTouches ? f.changedTouches[0] : f, this), C = p.invert(D), O = p.k * (f.shiftKey ? 0.5 : 2), T = n(y(P(p, O), D, C), t.apply(this, N), s);
      rn(f), a > 0 ? bt(this).transition().duration(a).call(R, T, D, f) : bt(this).call(_.transform, T, D, f);
    }
  }
  function X(f, ...N) {
    if (e.apply(this, arguments)) {
      var p = f.touches, D = p.length, C = Y(this, N, f.changedTouches.length === D).event(f), O, T, B, Z;
      for (ni(f), T = 0; T < D; ++T)
        B = p[T], Z = yt(B, this), Z = [Z, this.__zoom.invert(Z), B.identifier], C.touch0 ? !C.touch1 && C.touch0[2] !== Z[2] && (C.touch1 = Z, C.taps = 0) : (C.touch0 = Z, O = !0, C.taps = 1 + !!c);
      c && (c = clearTimeout(c)), O && (C.taps < 2 && (d = Z[0], c = setTimeout(function() {
        c = null;
      }, v)), oo(this), C.start());
    }
  }
  function k(f, ...N) {
    if (this.__zooming) {
      var p = Y(this, N).event(f), D = f.changedTouches, C = D.length, O, T, B, Z;
      for (rn(f), O = 0; O < C; ++O)
        T = D[O], B = yt(T, this), p.touch0 && p.touch0[2] === T.identifier ? p.touch0[0] = B : p.touch1 && p.touch1[2] === T.identifier && (p.touch1[0] = B);
      if (T = p.that.__zoom, p.touch1) {
        var j = p.touch0[0], re = p.touch0[1], G = p.touch1[0], F = p.touch1[1], ee = (ee = G[0] - j[0]) * ee + (ee = G[1] - j[1]) * ee, he = (he = F[0] - re[0]) * he + (he = F[1] - re[1]) * he;
        T = P(T, Math.sqrt(ee / he)), B = [(j[0] + G[0]) / 2, (j[1] + G[1]) / 2], Z = [(re[0] + F[0]) / 2, (re[1] + F[1]) / 2];
      } else if (p.touch0) B = p.touch0[0], Z = p.touch0[1];
      else return;
      p.zoom("touch", n(y(T, B, Z), p.extent, s));
    }
  }
  function oe(f, ...N) {
    if (this.__zooming) {
      var p = Y(this, N).event(f), D = f.changedTouches, C = D.length, O, T;
      for (ni(f), h && clearTimeout(h), h = setTimeout(function() {
        h = null;
      }, v), O = 0; O < C; ++O)
        T = D[O], p.touch0 && p.touch0[2] === T.identifier ? delete p.touch0 : p.touch1 && p.touch1[2] === T.identifier && delete p.touch1;
      if (p.touch1 && !p.touch0 && (p.touch0 = p.touch1, delete p.touch1), p.touch0) p.touch0[1] = this.__zoom.invert(p.touch0[0]);
      else if (p.end(), p.taps === 2 && (T = yt(T, this), Math.hypot(d[0] - T[0], d[1] - T[1]) < S)) {
        var B = bt(this).on("dblclick.zoom");
        B && B.apply(this, arguments);
      }
    }
  }
  return _.wheelDelta = function(f) {
    return arguments.length ? (o = typeof f == "function" ? f : Gn(+f), _) : o;
  }, _.filter = function(f) {
    return arguments.length ? (e = typeof f == "function" ? f : Gn(!!f), _) : e;
  }, _.touchable = function(f) {
    return arguments.length ? (i = typeof f == "function" ? f : Gn(!!f), _) : i;
  }, _.extent = function(f) {
    return arguments.length ? (t = typeof f == "function" ? f : Gn([[+f[0][0], +f[0][1]], [+f[1][0], +f[1][1]]]), _) : t;
  }, _.scaleExtent = function(f) {
    return arguments.length ? (r[0] = +f[0], r[1] = +f[1], _) : [r[0], r[1]];
  }, _.translateExtent = function(f) {
    return arguments.length ? (s[0][0] = +f[0][0], s[1][0] = +f[1][0], s[0][1] = +f[0][1], s[1][1] = +f[1][1], _) : [[s[0][0], s[0][1]], [s[1][0], s[1][1]]];
  }, _.constrain = function(f) {
    return arguments.length ? (n = f, _) : n;
  }, _.duration = function(f) {
    return arguments.length ? (a = +f, _) : a;
  }, _.interpolate = function(f) {
    return arguments.length ? (l = f, _) : l;
  }, _.on = function() {
    var f = u.on.apply(u, arguments);
    return f === u ? _ : f;
  }, _.clickDistance = function(f) {
    return arguments.length ? (b = (f = +f) * f, _) : Math.sqrt(b);
  }, _.tapDistance = function(f) {
    return arguments.length ? (S = +f, _) : S;
  }, _;
}
const Xa = Symbol("MiniMapSlots"), Hy = ["id", "x", "y", "rx", "ry", "width", "height", "fill", "stroke", "stroke-width", "shape-rendering"], Fy = {
  name: "MiniMapNode",
  compatConfig: { MODE: 3 },
  inheritAttrs: !1
}, Yy = /* @__PURE__ */ Se({
  ...Fy,
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
    const n = e, o = Vt(Xa), i = Mi(), r = Ee(() => i.style ?? {});
    function s(d) {
      t("click", d);
    }
    function a(d) {
      t("dblclick", d);
    }
    function l(d) {
      t("mouseenter", d);
    }
    function u(d) {
      t("mousemove", d);
    }
    function c(d) {
      t("mouseleave", d);
    }
    return (d, h) => !d.hidden && d.dimensions.width !== 0 && d.dimensions.height !== 0 ? (L(), te(Ae, { key: 0 }, [
      K(o)[`node-${n.type}`] ? (L(), De(Nt(K(o)[`node-${n.type}`]), yl(io({ key: 0 }, { ...n, ...d.$attrs })), null, 16)) : (L(), te("rect", io({
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
        fill: d.color || r.value.background || r.value.backgroundColor,
        stroke: d.strokeColor,
        "stroke-width": d.strokeWidth,
        "shape-rendering": d.shapeRendering,
        onClick: s,
        onDblclick: a,
        onMouseenter: l,
        onMousemove: u,
        onMouseleave: c
      }), null, 16, Hy))
    ], 64)) : me("", !0);
  }
}), Uy = ["width", "height", "viewBox", "aria-labelledby"], Xy = ["id"], Gy = ["d", "fill", "stroke", "stroke-width"], Zy = {
  name: "MiniMap",
  compatConfig: { MODE: 3 }
}, qy = /* @__PURE__ */ Se({
  ...Zy,
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
    const n = cs(), o = Mi(), i = 200, r = 150, { id: s, edges: a, viewport: l, translateExtent: u, dimensions: c, emits: d, d3Selection: h, d3Zoom: v, getNodesInitialized: E } = Me(), b = be();
    Ot(Xa, n);
    const S = Ee(() => {
      var C;
      return e.width ?? ((C = o.style) == null ? void 0 : C.width) ?? i;
    }), _ = Ee(() => {
      var C;
      return e.height ?? ((C = o.style) == null ? void 0 : C.height) ?? r;
    }), P = typeof window > "u" || window.chrome ? "crispEdges" : "geometricPrecision", y = ce(() => typeof e.nodeColor == "string" ? () => e.nodeColor : e.nodeColor), x = ce(
      () => typeof e.nodeStrokeColor == "string" ? () => e.nodeStrokeColor : e.nodeStrokeColor
    ), R = ce(
      () => typeof e.nodeClassName == "string" ? () => e.nodeClassName : typeof e.nodeClassName == "function" ? e.nodeClassName : () => ""
    ), Y = ce(() => Bi(E.value.filter((C) => !C.hidden))), V = ce(() => ({
      x: -l.value.x / l.value.zoom,
      y: -l.value.y / l.value.zoom,
      width: c.value.width / l.value.zoom,
      height: c.value.height / l.value.zoom
    })), U = ce(
      () => E.value && E.value.length ? Nf(Y.value, V.value) : V.value
    ), ie = ce(() => {
      const C = U.value.width / S.value, O = U.value.height / _.value;
      return Math.max(C, O);
    }), H = ce(() => {
      const C = ie.value * S.value, O = ie.value * _.value, T = e.offsetScale * ie.value;
      return {
        offset: T,
        x: U.value.x - (C - U.value.width) / 2 - T,
        y: U.value.y - (O - U.value.height) / 2 - T,
        width: C + T * 2,
        height: O + T * 2
      };
    }), X = ce(() => !H.value.x || !H.value.y ? "" : `
    M${H.value.x - H.value.offset},${H.value.y - H.value.offset}
    h${H.value.width + H.value.offset * 2}
    v${H.value.height + H.value.offset * 2}
    h${-H.value.width - H.value.offset * 2}z
    M${V.value.x + e.maskBorderRadius},${V.value.y}
    h${V.value.width - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},${e.maskBorderRadius}
    v${V.value.height - 2 * e.maskBorderRadius}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},${e.maskBorderRadius}
    h${-(V.value.width - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 -${e.maskBorderRadius},-${e.maskBorderRadius}
    v${-(V.value.height - 2 * e.maskBorderRadius)}
    a${e.maskBorderRadius},${e.maskBorderRadius} 0 0 1 ${e.maskBorderRadius},-${e.maskBorderRadius}z`);
    ml(
      (C) => {
        if (b.value) {
          const O = bt(b.value), T = (j) => {
            if (j.sourceEvent.type !== "wheel" || !h.value || !v.value)
              return;
            const re = j.sourceEvent.ctrlKey && En() ? 10 : 1, G = -j.sourceEvent.deltaY * (j.sourceEvent.deltaMode === 1 ? 0.05 : j.sourceEvent.deltaMode ? 1 : 2e-3) * e.zoomStep, F = l.value.zoom * 2 ** (G * re);
            v.value.scaleTo(h.value, F);
          }, B = (j) => {
            if (j.sourceEvent.type !== "mousemove" || !h.value || !v.value)
              return;
            const re = ie.value * Math.max(1, l.value.zoom) * (e.inversePan ? -1 : 1), G = {
              x: l.value.x - j.sourceEvent.movementX * re,
              y: l.value.y - j.sourceEvent.movementY * re
            }, F = [
              [0, 0],
              [c.value.width, c.value.height]
            ], ee = Wi.translate(G.x, G.y).scale(l.value.zoom), he = v.value.constrain()(ee, F, u.value);
            v.value.transform(h.value, he);
          }, Z = Vy().wheelDelta((j) => pi(j) * (e.zoomStep / 10)).on("zoom", e.pannable ? B : () => {
          }).on("zoom.wheel", e.zoomable ? T : () => {
          });
          O.call(Z), C(() => {
            O.on("zoom", null);
          });
        }
      },
      { flush: "post" }
    );
    function k(C) {
      const [O, T] = yt(C);
      t("click", { event: C, position: { x: O, y: T } });
    }
    function oe(C, O) {
      const T = { event: C, node: O, connectedEdges: kt([O], a.value) };
      d.miniMapNodeClick(T), t("nodeClick", T);
    }
    function f(C, O) {
      const T = { event: C, node: O, connectedEdges: kt([O], a.value) };
      d.miniMapNodeDoubleClick(T), t("nodeDblclick", T);
    }
    function N(C, O) {
      const T = { event: C, node: O, connectedEdges: kt([O], a.value) };
      d.miniMapNodeMouseEnter(T), t("nodeMouseenter", T);
    }
    function p(C, O) {
      const T = { event: C, node: O, connectedEdges: kt([O], a.value) };
      d.miniMapNodeMouseMove(T), t("nodeMousemove", T);
    }
    function D(C, O) {
      const T = { event: C, node: O, connectedEdges: kt([O], a.value) };
      d.miniMapNodeMouseLeave(T), t("nodeMouseleave", T);
    }
    return (C, O) => (L(), De(K(ma), {
      position: C.position,
      class: Be(["vue-flow__minimap", { pannable: C.pannable, zoomable: C.zoomable }])
    }, {
      default: et(() => [
        (L(), te("svg", {
          ref_key: "el",
          ref: b,
          width: S.value,
          height: _.value,
          viewBox: [H.value.x, H.value.y, H.value.width, H.value.height].join(" "),
          role: "img",
          "aria-labelledby": `vue-flow__minimap-${K(s)}`,
          onClick: k
        }, [
          C.ariaLabel ? (L(), te("title", {
            key: 0,
            id: `vue-flow__minimap-${K(s)}`
          }, ke(C.ariaLabel), 9, Xy)) : me("", !0),
          (L(!0), te(Ae, null, nt(K(E), (T) => (L(), De(Yy, {
            id: T.id,
            key: T.id,
            f: "",
            position: T.computedPosition,
            dimensions: T.dimensions,
            selected: T.selected,
            dragging: T.dragging,
            style: Re(T.style),
            class: Be(R.value(T)),
            color: y.value(T),
            "border-radius": C.nodeBorderRadius,
            "stroke-color": x.value(T),
            "stroke-width": C.nodeStrokeWidth,
            "shape-rendering": K(P),
            type: T.type,
            hidden: T.hidden,
            onClick: (B) => oe(B, T),
            onDblclick: (B) => f(B, T),
            onMouseenter: (B) => N(B, T),
            onMousemove: (B) => p(B, T),
            onMouseleave: (B) => D(B, T)
          }, null, 8, ["id", "position", "dimensions", "selected", "dragging", "style", "class", "color", "border-radius", "stroke-color", "stroke-width", "shape-rendering", "type", "hidden", "onClick", "onDblclick", "onMouseenter", "onMousemove", "onMouseleave"]))), 128)),
          W("path", {
            class: "vue-flow__minimap-mask",
            d: X.value,
            fill: C.maskColor,
            stroke: C.maskStrokeColor,
            "stroke-width": C.maskStrokeWidth,
            "fill-rule": "evenodd"
          }, null, 8, Gy)
        ], 8, Uy))
      ]),
      _: 1
    }, 8, ["position", "class"]));
  }
}), Wy = { class: "schema-node__header" }, Ky = ["title"], Qy = { class: "schema-node__header-count" }, Jy = { class: "schema-node__columns" }, jy = ["title"], e0 = {
  key: 0,
  class: "schema-node__badge schema-node__badge--pk"
}, t0 = {
  key: 1,
  class: "schema-node__badge schema-node__badge--uq"
}, n0 = {
  key: 2,
  class: "schema-node__badge schema-node__badge--nn"
}, o0 = { class: "schema-node__col-type" }, i0 = {
  key: 0,
  class: "schema-node__empty"
}, r0 = /* @__PURE__ */ Se({
  __name: "SchemaNode",
  props: {
    id: {},
    type: {},
    selected: { type: Boolean },
    connectable: { type: [Boolean, Number, String, Function] },
    position: {},
    dimensions: {},
    label: {},
    isValidTargetPos: { type: Function },
    isValidSourcePos: { type: Function },
    parent: {},
    parentNodeId: {},
    dragging: { type: Boolean },
    resizing: { type: Boolean },
    zIndex: {},
    targetPosition: {},
    sourcePosition: {},
    dragHandle: {},
    data: {},
    events: {}
  },
  setup(e) {
    const t = {
      TEXT: "text",
      INTEGER: "int",
      BIGINT: "bigint",
      BOOLEAN: "bool",
      NUMERIC: "num",
      TIMESTAMP: "ts",
      UUID: "uuid",
      JSONB: "json"
    }, n = (s) => s.primary_key === !0 || s.primary_key === 1, o = (s) => s.unique_col === !0 || s.unique_col === 1, i = (s) => !(s.nullable === !0 || s.nullable === 1) && !n(s), r = (s) => t[s || ""] || (s || "").toLowerCase();
    return (s, a) => (L(), te("div", {
      class: Be(["schema-node", { "schema-node--selected": e.selected }])
    }, [
      W("div", Wy, [
        W("span", {
          class: "schema-node__header-name",
          title: e.data.label
        }, ke(e.data.label), 9, Ky),
        W("span", Qy, ke(e.data.columnCount), 1)
      ]),
      W("div", Jy, [
        (L(!0), te(Ae, null, nt(e.data.columns, (l) => (L(), te("div", {
          key: l.id,
          class: "schema-node__col"
        }, [
          ze(K(Qt), {
            type: "target",
            position: K(ae).Left,
            id: "target-" + l.id,
            class: "schema-node__handle schema-node__handle--target",
            style: { top: "auto" }
          }, null, 8, ["position", "id"]),
          W("span", {
            class: "schema-node__col-name",
            title: l.name
          }, ke(l.name), 9, jy),
          n(l) ? (L(), te("span", e0, "PK")) : me("", !0),
          o(l) ? (L(), te("span", t0, "UQ")) : me("", !0),
          i(l) ? (L(), te("span", n0, "NN")) : me("", !0),
          W("span", o0, ke(r(l.col_type)), 1),
          ze(K(Qt), {
            type: "source",
            position: K(ae).Right,
            id: "source-" + l.id,
            class: "schema-node__handle schema-node__handle--source",
            style: { top: "auto" }
          }, null, 8, ["position", "id"])
        ]))), 128)),
        e.data.columns.length ? me("", !0) : (L(), te("div", i0, "No columns"))
      ])
    ], 2));
  }
}), s0 = ["onClick"], a0 = /* @__PURE__ */ Se({
  __name: "ContextMenu",
  props: {
    x: {},
    y: {},
    items: {}
  },
  emits: ["close"],
  setup(e, { emit: t }) {
    const n = e, o = be(null), i = be(null), r = be({ left: "0px", top: "0px", visibility: "hidden" });
    function s() {
      const u = o.value?.getBoundingClientRect(), c = i.value?.getBoundingClientRect();
      if (!u || !c) return;
      const d = Math.max(0, Math.min(n.x - u.left, u.width - c.width)), h = Math.max(0, Math.min(n.y - u.top, u.height - c.height));
      r.value = { left: `${d}px`, top: `${h}px`, visibility: "visible" };
    }
    Ne(() => [n.x, n.y], () => {
      Ye(s);
    }), rt(() => {
      Ye(s), window.addEventListener("resize", s);
    }), Eo(() => window.removeEventListener("resize", s));
    const a = t;
    function l(u) {
      u.action(), a("close");
    }
    return (u, c) => (L(), te("div", {
      ref_key: "layer",
      ref: o,
      class: "de-ctx-overlay",
      onClick: c[2] || (c[2] = (d) => a("close")),
      onContextmenu: c[3] || (c[3] = Fo((d) => a("close"), ["prevent"]))
    }, [
      W("div", {
        ref_key: "panel",
        ref: i,
        class: "de-ctx",
        style: Re(r.value),
        onClick: c[0] || (c[0] = Fo(() => {
        }, ["stop"])),
        onContextmenu: c[1] || (c[1] = Fo(() => {
        }, ["prevent", "stop"]))
      }, [
        (L(!0), te(Ae, null, nt(e.items, (d, h) => (L(), te("button", {
          key: h,
          class: Be(["de-ctx-item", { "de-ctx-danger": d.danger }]),
          onClick: (v) => l(d)
        }, ke(d.label), 11, s0))), 128))
      ], 36)
    ], 544));
  }
}), ge = {
  TABLE_ADDED: "chestor.db_schema.events:table.added",
  TABLE_UPDATED: "chestor.db_schema.events:table.updated",
  TABLE_REMOVED: "chestor.db_schema.events:table.removed",
  COLUMN_ADDED: "chestor.db_schema.events:column.added",
  COLUMN_UPDATED: "chestor.db_schema.events:column.updated",
  COLUMN_REMOVED: "chestor.db_schema.events:column.removed",
  RELATION_ADDED: "chestor.db_schema.events:relation.added",
  RELATION_UPDATED: "chestor.db_schema.events:relation.updated",
  RELATION_REMOVED: "chestor.db_schema.events:relation.removed",
  LAYOUT_POSITION_SET: "chestor.db_schema.events:layout.position-set"
};
function oi(e, t) {
  return e.tables.find((n) => n.id === t);
}
function rs(e, t) {
  for (const n of e.tables) {
    const o = (n.columns || []).find((i) => i.id === t);
    if (o) return o;
  }
}
function ss(e) {
  return { type: ge.COLUMN_ADDED, body: { id: e.id, table_id: e.table_id, name: e.name, col_type: e.col_type, primary_key: e.primary_key, nullable: e.nullable, unique_col: e.unique_col } };
}
function as(e) {
  return { type: ge.RELATION_ADDED, body: { id: e.id, from_table_id: e.from_table_id, to_table_id: e.to_table_id, from_column_id: e.from_column_id, to_column_id: e.to_column_id, relation_type: e.relation_type, name: e.name } };
}
function l0(e, t) {
  const n = e.body;
  switch (e.type) {
    case ge.TABLE_ADDED:
      return [{ type: ge.TABLE_REMOVED, body: { id: n.id } }];
    case ge.TABLE_REMOVED: {
      const o = oi(t, n.id);
      if (!o) return [];
      const i = [{ type: ge.TABLE_ADDED, body: { id: o.id, name: o.name, description: o.description } }];
      o.layout && typeof o.layout.x == "number" && i.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: o.id, x: o.layout.x, y: o.layout.y } });
      for (const r of o.columns || []) i.push(ss(r));
      for (const r of t.relations)
        (r.from_table_id === o.id || r.to_table_id === o.id) && i.push(as(r));
      return i;
    }
    case ge.TABLE_UPDATED: {
      const o = oi(t, n.id);
      if (!o) return [];
      const i = { id: o.id };
      return "name" in n && (i.name = o.name), "description" in n && (i.description = o.description ?? ""), [{ type: ge.TABLE_UPDATED, body: i }];
    }
    case ge.COLUMN_ADDED:
      return [{ type: ge.COLUMN_REMOVED, body: { id: n.id } }];
    case ge.COLUMN_REMOVED: {
      const o = rs(t, n.id);
      return o ? [ss(o)] : [];
    }
    case ge.COLUMN_UPDATED: {
      const o = rs(t, n.id);
      if (!o) return [];
      const i = { id: o.id };
      for (const r of ["name", "col_type", "primary_key", "nullable", "unique_col"])
        r in n && (i[r] = o[r]);
      return [{ type: ge.COLUMN_UPDATED, body: i }];
    }
    case ge.RELATION_ADDED:
      return [{ type: ge.RELATION_REMOVED, body: { id: n.id } }];
    case ge.RELATION_REMOVED: {
      const o = t.relations.find((i) => i.id === n.id);
      return o ? [as(o)] : [];
    }
    case ge.RELATION_UPDATED: {
      const o = t.relations.find((r) => r.id === n.id);
      if (!o) return [];
      const i = { id: o.id };
      return "relation_type" in n && (i.relation_type = o.relation_type), "name" in n && (i.name = o.name ?? ""), [{ type: ge.RELATION_UPDATED, body: i }];
    }
    case ge.LAYOUT_POSITION_SET: {
      const o = oi(t, n.table_id);
      return !o?.layout || typeof o.layout.x != "number" ? [] : [{ type: ge.LAYOUT_POSITION_SET, body: { table_id: o.id, x: o.layout.x, y: o.layout.y } }];
    }
    default:
      return null;
  }
}
function u0(e, t) {
  const n = [];
  for (const o of [...e].reverse()) {
    const i = l0(o, t);
    if (i === null) return null;
    n.push(...i);
  }
  return n;
}
const c0 = { one_to_many: "1:N", many_to_one: "N:1", one_to_one: "1:1", many_to_many: "N:N" }, d0 = { one_to_many: "<", many_to_one: ">", one_to_one: "-", many_to_many: "<>" };
function Ga(e) {
  const t = /* @__PURE__ */ new Map();
  for (const n of e) for (const o of n.columns || []) t.set(o.id, o);
  return t;
}
function f0(e, t) {
  const n = new Map(e.map((r) => [r.id, r])), o = Ga(e), i = ["-- Schema export", ""];
  for (const r of e) {
    const s = (r.columns || []).map((a) => {
      const l = [`  ${a.name} ${a.col_type || "TEXT"}`];
      return a.primary_key ? l.push("PRIMARY KEY") : a.nullable === !1 && l.push("NOT NULL"), a.unique_col && !a.primary_key && l.push("UNIQUE"), l.join(" ");
    });
    if (!s.length) {
      i.push(`-- ${r.name}: no columns yet`, "");
      continue;
    }
    i.push(`CREATE TABLE ${r.name} (`, s.join(`,
`), ");", "");
  }
  for (const r of t) {
    const s = n.get(r.from_table_id), a = n.get(r.to_table_id);
    if (!s || !a) continue;
    const l = r.from_column_id ? o.get(r.from_column_id) : void 0, u = r.to_column_id ? o.get(r.to_column_id) : void 0;
    if (l && u) {
      const c = r.name || `fk_${s.name}_${l.name}`;
      i.push(`ALTER TABLE ${s.name} ADD CONSTRAINT ${c} FOREIGN KEY (${l.name}) REFERENCES ${a.name} (${u.name});`);
    } else
      i.push(`-- FK ${s.name} -> ${a.name} (${c0[r.relation_type] || r.relation_type})`);
  }
  return i.join(`
`);
}
function St(e) {
  return /^[A-Za-z_][A-Za-z0-9_]*$/.test(e) ? e : `"${e.replace(/"/g, "")}"`;
}
function h0(e, t) {
  const n = new Map(e.map((r) => [r.id, r])), o = Ga(e), i = [];
  for (const r of e) {
    i.push(`Table ${St(r.name)} {`);
    for (const s of r.columns || []) {
      const a = [];
      s.primary_key && a.push("pk"), s.unique_col && !s.primary_key && a.push("unique"), s.nullable === !1 && !s.primary_key && a.push("not null");
      const l = a.length ? ` [${a.join(", ")}]` : "";
      i.push(`  ${St(s.name)} ${(s.col_type || "TEXT").toLowerCase()}${l}`);
    }
    r.description && i.push(`  Note: '${r.description.replace(/'/g, "\\'")}'`), i.push("}", "");
  }
  for (const r of t) {
    const s = n.get(r.from_table_id), a = n.get(r.to_table_id);
    if (!s || !a) continue;
    const l = r.from_column_id ? o.get(r.from_column_id) : void 0, u = r.to_column_id ? o.get(r.to_column_id) : void 0, c = d0[r.relation_type] || ">";
    if (l && u) {
      const d = r.name ? `${St(r.name)}: ` : "";
      i.push(`Ref ${d}${St(s.name)}.${St(l.name)} ${c} ${St(a.name)}.${St(u.name)}`);
    } else
      i.push(`// Ref ${s.name} ${c} ${a.name} (column ends not set)`);
  }
  return i.join(`
`);
}
const v0 = {
  key: 0,
  class: "de-error"
}, p0 = ["disabled"], g0 = {
  key: 1,
  class: "de-toolbar"
}, m0 = { class: "de-muted de-sm" }, y0 = { class: "de-flow-wrap" }, _0 = {
  key: 0,
  class: "de-empty",
  role: "status"
}, w0 = {
  key: 1,
  class: "de-empty"
}, b0 = {
  key: 3,
  class: "de-panel"
}, $0 = { class: "de-panel-head" }, E0 = { class: "de-panel-name" }, x0 = {
  key: 0,
  class: "de-read-description"
}, S0 = { class: "de-panel-label" }, N0 = { class: "de-muted" }, C0 = { class: "de-read-columns" }, k0 = { key: 0 }, M0 = { key: 1 }, T0 = { key: 2 }, D0 = {
  key: 4,
  class: "de-panel"
}, I0 = { class: "de-panel-head" }, A0 = ["value"], P0 = ["value"], O0 = { class: "de-panel-label" }, z0 = { class: "de-muted de-sm" }, R0 = { class: "de-panel-cols" }, B0 = ["onClick"], L0 = ["value", "onChange"], V0 = ["value", "onChange"], H0 = ["value"], F0 = ["onClick"], Y0 = ["onClick"], U0 = ["onClick"], X0 = {
  key: 0,
  class: "de-muted de-sm"
}, G0 = { class: "de-panel-foot" }, Z0 = {
  key: 5,
  class: "de-panel de-rel-panel"
}, q0 = { class: "de-panel-head" }, W0 = { class: "de-rel-ends" }, K0 = { class: "de-rel-end" }, Q0 = { class: "de-rel-tbl" }, J0 = {
  key: 0,
  class: "de-rel-col"
}, j0 = { class: "de-rel-end" }, e_ = { class: "de-rel-tbl" }, t_ = {
  key: 0,
  class: "de-rel-col"
}, n_ = { class: "de-rel-section" }, o_ = { class: "de-rel-types" }, i_ = ["onClick"], r_ = { class: "de-rel-section" }, s_ = ["value"], a_ = { class: "de-panel-foot" }, l_ = "chestor.db_schema:state", u_ = /* @__PURE__ */ Se({
  __name: "DbSchema",
  setup(e) {
    const t = _l(), n = ce(() => t.value?.entryId || ""), o = ce(() => (t.value?.mode || "preview") === "full"), i = ce(() => o.value && !t.value?.readOnly), r = be([]), s = be([]), a = be([]), l = be([]), u = be(""), c = be(!0), d = be(""), h = be(null), v = be(null), E = ["TEXT", "INTEGER", "BIGINT", "BOOLEAN", "NUMERIC", "TIMESTAMP", "UUID", "JSONB"], b = [
      { value: "one_to_one", label: "1:1" },
      { value: "one_to_many", label: "1:N" },
      { value: "many_to_one", label: "N:1" },
      { value: "many_to_many", label: "N:N" }
    ], S = { one_to_many: "1:N", many_to_one: "N:1", one_to_one: "1:1", many_to_many: "N:N" }, _ = {
      one_to_one: "var(--de-rel-one-to-one)",
      one_to_many: "var(--de-accent)",
      many_to_one: "var(--de-rel-many-to-one)",
      many_to_many: "var(--de-rel-many-to-many)"
    };
    function P($, A) {
      const z = $, q = z?.response?.data?.error;
      return typeof q == "string" && q ? q : typeof z?.message == "string" && z.message && !/request failed|status code/i.test(z.message) ? z.message : A;
    }
    const y = () => `/api/v1/workspace/db-schema/${n.value}`, x = () => r.value.find(($) => $.id === h.value) || null, R = () => s.value.find(($) => $.id === v.value) || null, Y = ($) => r.value.find((A) => A.id === $)?.name || "?", V = ($) => {
      for (const A of r.value) {
        const z = (A.columns || []).find((q) => q.id === $);
        if (z) return z.name;
      }
      return null;
    }, U = () => r.value.reduce(($, A) => $ + (A.columns || []).length, 0), ie = `dbflow-${n.value || "x"}-${t.value?.mode || "preview"}`, { fitView: H, screenToFlowCoordinate: X, onNodesInitialized: k } = Me(ie), oe = be(null);
    function f($, A) {
      $.preventDefault?.(), oe.value = { x: $.clientX, y: $.clientY, items: A };
    }
    function N() {
      oe.value = null;
    }
    const p = /* @__PURE__ */ new Map();
    let D = !1;
    function C($, A) {
      const z = p.get($.id);
      return z && Date.now() - z.ts < 5e3 ? { x: z.x, y: z.y } : $.layout && typeof $.layout.x == "number" ? { x: $.layout.x, y: $.layout.y } : { x: 60 + A % 4 * 320, y: 60 + Math.floor(A / 4) * 300 };
    }
    const O = { schemaTable: dn(r0) };
    function T() {
      const $ = r.value.map((q, Ce) => ({
        id: q.id,
        type: "schemaTable",
        position: C(q, Ce),
        data: { label: q.name, tableId: q.id, columns: q.columns || [], columnCount: (q.columns || []).length }
      }));
      a.value = $;
      const A = new Set(r.value.map((q) => q.id)), z = s.value.filter((q) => A.has(q.from_table_id) && A.has(q.to_table_id)).map((q) => {
        const Ce = _[q.relation_type] || "var(--de-accent)";
        return {
          id: q.id,
          source: q.from_table_id,
          target: q.to_table_id,
          sourceHandle: q.from_column_id ? "source-" + q.from_column_id : void 0,
          targetHandle: q.to_column_id ? "target-" + q.to_column_id : void 0,
          type: "smoothstep",
          class: "rel-edge",
          label: q.name || S[q.relation_type] || q.relation_type,
          data: { relation_type: q.relation_type },
          style: { stroke: Ce, strokeWidth: 1.8 },
          markerEnd: { type: ho.ArrowClosed, width: 14, height: 11, color: Ce }
        };
      });
      l.value = z;
    }
    function B($) {
      r.value = $?.tables ?? [], s.value = $?.relations ?? [], $?.thread_id && (u.value = $.thread_id), T();
    }
    async function Z($ = !1) {
      $ || (c.value = !0);
      try {
        const { data: A } = await Ji.get(y());
        if (!A.success) throw new Error(A.error || "Couldn’t load the schema.");
        B(A.schema), d.value = "";
      } catch (A) {
        d.value = P(A, "Couldn’t load the schema.");
      } finally {
        $ || (c.value = !1);
      }
    }
    const j = [], re = [];
    function G() {
      return JSON.parse(JSON.stringify({ tables: r.value, relations: s.value }));
    }
    async function F($, A = !0) {
      if (i.value) {
        if (d.value = "", A) {
          const z = u0($, G());
          z && (j.push({ undo: z, redo: $ }), j.length > 100 && j.shift(), re.length = 0);
        }
        try {
          const { data: z } = await Ji.post(`${y()}/apply`, { commands: $ });
          if (!z.success) {
            d.value = z.error || "apply failed";
            return;
          }
          B(z.schema), d.value = "";
        } catch (z) {
          d.value = P(z, "Couldn’t save the schema.");
        }
      }
    }
    async function ee() {
      if (!i.value) return;
      const $ = j.pop();
      $ && (re.push($), await F($.undo, !1));
    }
    async function he() {
      if (!i.value) return;
      const $ = re.pop();
      $ && (j.push($), await F($.redo, !1));
    }
    const pe = ($, A) => F([{ type: $, body: A }]), de = () => crypto?.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
    async function _e() {
      try {
        await H({ padding: 0.2, maxZoom: 1 });
      } catch ($) {
        d.value = P($, "Couldn’t fit the schema. Try Fit again.");
      }
    }
    function ue($, A) {
      if (!A.includes($)) return $;
      let z = 2;
      for (; A.includes(`${$}_${z}`); ) z++;
      return `${$}_${z}`;
    }
    function ve() {
      Ye(() => {
        const A = (document.activeElement?.getRootNode?.() ?? document).querySelector?.(".de-panel-name") ?? document.querySelector(".de-panel-name");
        A?.focus(), A?.select();
      });
    }
    function m($) {
      const A = de(), z = ue("new_table", r.value.map((Ce) => Ce.name)), q = [
        { type: ge.TABLE_ADDED, body: { id: A, name: z } },
        { type: ge.COLUMN_ADDED, body: { id: de(), table_id: A, name: "id", col_type: "UUID", primary_key: !0 } }
      ];
      return $ && q.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A, x: Math.round($.x), y: Math.round($.y) } }), F(q).then(() => {
        v.value = null, h.value = A, ve();
      }), A;
    }
    function g($) {
      const A = de(), z = ue($.name, r.value.map((Ve) => Ve.name)), q = [{ type: ge.TABLE_ADDED, body: { id: A, name: z, description: $.description } }];
      for (const Ve of $.columns || [])
        q.push({ type: ge.COLUMN_ADDED, body: { id: de(), table_id: A, name: Ve.name, col_type: Ve.col_type, primary_key: Ve.primary_key, nullable: Ve.nullable, unique_col: Ve.unique_col } });
      const Ce = $.layout && typeof $.layout.x == "number" ? { x: $.layout.x + 40, y: $.layout.y + 40 } : void 0;
      Ce && q.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A, x: Math.round(Ce.x), y: Math.round(Ce.y) } }), F(q).then(() => {
        v.value = null, h.value = A;
      });
    }
    function w($, A) {
      A && A !== $.name && pe(ge.TABLE_UPDATED, { id: $.id, name: A });
    }
    function I($, A) {
      pe(ge.TABLE_UPDATED, { id: $.id, description: A });
    }
    function M($) {
      pe(ge.TABLE_REMOVED, { id: $.id }), h.value === $.id && (h.value = null);
    }
    function Q($) {
      const A = ue("column", ($.columns || []).map((z) => z.name));
      pe(ge.COLUMN_ADDED, { id: de(), table_id: $.id, name: A, col_type: "TEXT" });
    }
    function J($, A) {
      pe(ge.COLUMN_UPDATED, { id: $.id, ...A });
    }
    function le($) {
      pe(ge.COLUMN_REMOVED, { id: $.id });
    }
    function se($, A) {
      A !== $.relation_type && pe(ge.RELATION_UPDATED, { id: $.id, relation_type: A });
    }
    function fe($, A) {
      A !== ($.name || "") && pe(ge.RELATION_UPDATED, { id: $.id, name: A });
    }
    function ye($) {
      pe(ge.RELATION_REMOVED, { id: $.id }), v.value === $.id && (v.value = null);
    }
    k(() => {
      !D && a.value.length && (D = !0, _e());
    });
    function $e({ nodes: $ }) {
      const A = [];
      for (const z of $ || []) {
        const q = Math.round(z.position.x), Ce = Math.round(z.position.y);
        p.set(z.id, { x: q, y: Ce, ts: Date.now() }), A.push({ type: ge.LAYOUT_POSITION_SET, body: { table_id: z.id, x: q, y: Ce } });
      }
      A.length && F(A);
    }
    let Ge = null, Le = !1;
    function Bo($) {
      Le = !1, Ge = $?.nodeId && $?.handleType === "source" ? { table: $.nodeId, column: ($.handleId || "").replace("source-", "") || void 0 } : null;
    }
    function Lo($) {
      if (Le = !0, !i.value || !$.source || !$.target) return;
      const A = ($.sourceHandle || "").replace("source-", "") || void 0, z = ($.targetHandle || "").replace("target-", "") || void 0;
      s.value.some((Ce) => Ce.from_table_id === $.source && Ce.to_table_id === $.target && (Ce.from_column_id || void 0) === A && (Ce.to_column_id || void 0) === z) || pe(ge.RELATION_ADDED, {
        id: de(),
        from_table_id: $.source,
        to_table_id: $.target,
        from_column_id: A,
        to_column_id: z,
        relation_type: "one_to_many"
      });
    }
    function Vo($) {
      const A = Ge;
      if (Ge = null, Le || !A || !i.value || !($ instanceof MouseEvent)) return;
      const z = $.target;
      if (!z || !z.classList.contains("vue-flow__pane")) return;
      const q = X({ x: $.clientX, y: $.clientY }), Ce = de(), Ve = de(), al = ue("new_table", r.value.map((ll) => ll.name));
      F([
        { type: ge.TABLE_ADDED, body: { id: Ce, name: al } },
        { type: ge.COLUMN_ADDED, body: { id: Ve, table_id: Ce, name: "id", col_type: "UUID", primary_key: !0 } },
        { type: ge.LAYOUT_POSITION_SET, body: { table_id: Ce, x: Math.round(q.x), y: Math.round(q.y) } },
        { type: ge.RELATION_ADDED, body: { id: de(), from_table_id: A.table, to_table_id: Ce, from_column_id: A.column, to_column_id: Ve, relation_type: "one_to_many" } }
      ]).then(() => {
        v.value = null, h.value = Ce, ve();
      });
    }
    function Ki($) {
      const A = /* @__PURE__ */ new Set(), z = /* @__PURE__ */ new Set();
      if ($) {
        A.add($);
        for (const q of s.value)
          (q.from_table_id === $ || q.to_table_id === $) && (z.add(q.id), A.add(q.from_table_id), A.add(q.to_table_id));
      }
      for (const q of a.value) q.class = $ && !A.has(q.id) ? "de-dim" : "";
      for (const q of l.value) q.class = $ ? z.has(q.id) ? "rel-edge de-edge-hot" : "rel-edge de-dim" : "rel-edge";
    }
    function Za({ node: $ }) {
      $?.id && Ki($.id);
    }
    function qa() {
      Ki(null);
    }
    function Wa({ node: $ }) {
      o.value && (v.value = null, h.value = $.id);
    }
    function Ka({ edge: $ }) {
      o.value && $?.id && (h.value = null, v.value = $.id);
    }
    function Qa() {
      h.value = null, v.value = null, N();
    }
    function Ja({ event: $, node: A }) {
      if (!i.value) return;
      const z = r.value.find((q) => q.id === A.id);
      z && f($, [
        { label: "Edit table", action: () => {
          v.value = null, h.value = z.id;
        } },
        { label: "Add column", action: () => Q(z) },
        { label: "Duplicate table", action: () => g(z) },
        { label: "Delete table", danger: !0, action: () => M(z) }
      ]);
    }
    function ja({ event: $, edge: A }) {
      if (!i.value) return;
      const z = s.value.find((q) => q.id === A.id);
      z && f($, [
        { label: "Edit relation", action: () => {
          h.value = null, v.value = z.id;
        } },
        { label: "Delete relation", danger: !0, action: () => ye(z) }
      ]);
    }
    function el($) {
      if (!i.value) return;
      const A = $?.event || $;
      A.preventDefault?.(), f(A, [{ label: "Add table here", action: () => tl(A) }]);
    }
    function tl($) {
      let A;
      try {
        const z = X({ x: $.clientX, y: $.clientY });
        A = { x: z.x, y: z.y };
      } catch (z) {
        d.value = P(z, "Couldn’t place this table. Try again.");
        return;
      }
      m(A);
    }
    function nl() {
      const $ = r.value.map((A, z) => ({ type: ge.LAYOUT_POSITION_SET, body: { table_id: A.id, x: 60 + z % 4 * 340, y: 60 + Math.floor(z / 4) * 320 } }));
      p.clear(), $.length && F($).then(() => Ye(_e));
    }
    function Qi($, A, z) {
      const q = new Blob([$], { type: z }), Ce = URL.createObjectURL(q), Ve = document.createElement("a");
      Ve.href = Ce, Ve.download = A, Ve.click(), setTimeout(() => URL.revokeObjectURL(Ce), 1e3);
    }
    function ol($) {
      f($, [
        { label: "SQL (.sql)", action: () => Qi(f0(r.value, s.value), "schema.sql", "text/sql") },
        { label: "DBML (.dbml)", action: () => Qi(h0(r.value, s.value), "schema.dbml", "text/plain") }
      ]);
    }
    const il = be(null);
    function rl($) {
      const A = $;
      return !!A && (A.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(A.tagName || ""));
    }
    function sl($) {
      if (!i.value) return;
      if (rl($.composedPath()[0] ?? $.target)) {
        $.key === "Escape" && $.composedPath()[0]?.blur?.();
        return;
      }
      const A = $.ctrlKey || $.metaKey;
      if (A && ($.key === "z" || $.key === "Z"))
        $.preventDefault(), $.shiftKey ? he() : ee();
      else if (A && ($.key === "y" || $.key === "Y"))
        $.preventDefault(), he();
      else if (A && ($.key === "d" || $.key === "D")) {
        $.preventDefault();
        const z = x();
        z && g(z);
      } else if (A && $.key === "Enter")
        if ($.preventDefault(), $.shiftKey) m();
        else {
          const z = x();
          z && Q(z);
        }
      else if ($.key === "Delete" || $.key === "Backspace") {
        $.preventDefault();
        const z = R(), q = x();
        z ? ye(z) : q && M(q);
      } else $.key === "Escape" ? oe.value ? N() : (h.value = null, v.value = null) : $.shiftKey && ($.key === "1" || $.key === "!") && ($.preventDefault(), _e());
    }
    let Ho = [];
    return rt(async () => {
      await Z();
      const $ = u.value;
      if ($)
        for (const A of [`kickside.thread.${$}.projection.${l_}`, `kickside.thread.${$}`])
          try {
            Ho.push(wl(A, () => {
              Z(!0);
            }));
          } catch {
            d.value = "Live updates are unavailable. Reload to read the latest schema.";
          }
    }), Eo(() => {
      const $ = [];
      for (const A of Ho)
        try {
          A();
        } catch (z) {
          $.push(z);
        }
      if (Ho = [], $.length) throw new AggregateError($, "Couldn’t close live updates.");
    }), ($, A) => (L(), te("div", {
      ref_key: "rootEl",
      ref: il,
      class: Be(["de", o.value ? "de--full" : "de--preview"]),
      tabindex: "0",
      onKeydown: sl
    }, [
      d.value ? (L(), te("div", v0, [
        W("span", null, ke(d.value), 1),
        W("button", {
          class: "de-btn",
          disabled: c.value,
          "aria-label": "Retry schema loading",
          onClick: A[0] || (A[0] = (z) => Z())
        }, "Retry", 8, p0),
        W("button", {
          class: "de-x de-x-sm",
          type: "button",
          "aria-label": "Dismiss error",
          title: "Dismiss",
          onClick: A[1] || (A[1] = (z) => d.value = "")
        }, "×")
      ])) : me("", !0),
      o.value ? (L(), te("div", g0, [
        i.value ? (L(), te("button", {
          key: 0,
          class: "de-btn",
          onClick: m
        }, "+ Table")) : me("", !0),
        W("button", {
          class: "de-btn de-ghost",
          title: "Fit to view",
          onClick: _e
        }, "Fit"),
        i.value ? (L(), te("button", {
          key: 1,
          class: "de-btn de-ghost",
          title: "Auto layout",
          onClick: nl
        }, "Arrange")) : me("", !0),
        W("button", {
          class: "de-btn de-ghost",
          title: "Export schema",
          onClick: A[2] || (A[2] = (z) => ol(z))
        }, "Export"),
        A[14] || (A[14] = W("span", { class: "de-spacer" }, null, -1)),
        W("span", m0, ke(r.value.length) + " tables · " + ke(U()) + " cols · " + ke(s.value.length) + " rel · live", 1)
      ])) : me("", !0),
      W("div", y0, [
        ze(K(Cv), {
          id: ie,
          nodes: a.value,
          "onUpdate:nodes": A[3] || (A[3] = (z) => a.value = z),
          edges: l.value,
          "onUpdate:edges": A[4] || (A[4] = (z) => l.value = z),
          "node-types": O,
          class: "de-flow schema-canvas",
          "nodes-draggable": i.value,
          "nodes-connectable": i.value,
          "elements-selectable": o.value,
          "connection-line-style": { stroke: "var(--de-accent)", strokeWidth: 2, strokeDasharray: "5 4" },
          "connection-radius": 40,
          "min-zoom": 0.15,
          "max-zoom": 2,
          "default-viewport": { x: 0, y: 0, zoom: 1 },
          onNodeDragStop: $e,
          onNodeClick: Wa,
          onEdgeClick: Ka,
          onPaneClick: Qa,
          onConnectStart: Bo,
          onConnect: Lo,
          onConnectEnd: Vo,
          onNodeContextMenu: Ja,
          onEdgeContextMenu: ja,
          onPaneContextMenu: el,
          onNodeMouseEnter: Za,
          onNodeMouseLeave: qa
        }, {
          default: et(() => [
            ze(K(Ov), {
              pattern: "dots",
              gap: 20,
              size: 1,
              "pattern-color": "color-mix(in srgb, var(--p-text-color) 22%, transparent)"
            }),
            o.value ? (L(), De(K(fp), {
              key: 0,
              position: "bottom-left",
              "show-interactive": !1
            })) : me("", !0),
            o.value ? (L(), De(K(qy), {
              key: 1,
              position: "bottom-right",
              pannable: !0,
              zoomable: !0
            })) : me("", !0)
          ]),
          _: 1
        }, 8, ["nodes", "edges", "nodes-draggable", "nodes-connectable", "elements-selectable"]),
        c.value ? (L(), te("div", _0, "Loading schema…")) : me("", !0),
        !r.value.length && !c.value && !d.value ? (L(), te("div", w0, ke(i.value ? "No tables — add one to start designing." : "No tables in this schema."), 1)) : me("", !0),
        oe.value ? (L(), De(a0, {
          key: 2,
          x: oe.value.x,
          y: oe.value.y,
          items: oe.value.items,
          onClose: N
        }, null, 8, ["x", "y", "items"])) : me("", !0),
        o.value && !i.value && x() ? (L(), te("aside", b0, [
          W("div", $0, [
            W("h3", E0, ke(x().name), 1),
            W("button", {
              class: "de-x",
              "aria-label": "Close table inspector",
              onClick: A[5] || (A[5] = (z) => h.value = null)
            }, "×")
          ]),
          x().description ? (L(), te("p", x0, ke(x().description), 1)) : me("", !0),
          W("div", S0, [
            A[15] || (A[15] = qn("Columns ", -1)),
            W("span", N0, ke(x().columns.length), 1)
          ]),
          W("dl", C0, [
            (L(!0), te(Ae, null, nt(x().columns, (z) => (L(), te(Ae, {
              key: z.id
            }, [
              W("dt", null, ke(z.name), 1),
              W("dd", null, [
                qn(ke(z.col_type), 1),
                z.primary_key ? (L(), te("span", k0, " · Primary key")) : me("", !0),
                z.unique_col ? (L(), te("span", M0, " · Unique")) : me("", !0),
                z.nullable === !1 ? (L(), te("span", T0, " · Required")) : me("", !0)
              ])
            ], 64))), 128))
          ]),
          A[16] || (A[16] = W("p", { class: "de-read-description de-muted" }, "Read only", -1))
        ])) : me("", !0),
        i.value && x() ? (L(), te("aside", D0, [
          W("div", I0, [
            A[17] || (A[17] = W("span", { class: "de-panel-kind" }, "TABLE", -1)),
            W("input", {
              class: "de-panel-name",
              value: x().name,
              onChange: A[6] || (A[6] = (z) => w(x(), z.target.value))
            }, null, 40, A0),
            W("button", {
              class: "de-x",
              type: "button",
              "aria-label": "Close table editor",
              title: "Close",
              onClick: A[7] || (A[7] = (z) => h.value = null)
            }, "×")
          ]),
          W("input", {
            class: "de-panel-desc",
            value: x().description || "",
            placeholder: "Add a description…",
            onChange: A[8] || (A[8] = (z) => I(x(), z.target.value))
          }, null, 40, P0),
          W("div", O0, [
            A[18] || (A[18] = qn("Columns ", -1)),
            W("span", z0, ke(x().columns.length), 1)
          ]),
          W("div", R0, [
            (L(!0), te(Ae, null, nt(x().columns, (z) => (L(), te("div", {
              key: z.id,
              class: "de-panel-col"
            }, [
              W("button", {
                class: Be(["de-flag de-pk", { on: z.primary_key }]),
                title: "Primary key",
                onClick: (q) => J(z, { primary_key: !z.primary_key })
              }, "PK", 10, B0),
              W("input", {
                class: "de-col-name",
                value: z.name,
                onChange: (q) => J(z, { name: q.target.value })
              }, null, 40, L0),
              W("select", {
                class: "de-col-type",
                value: z.col_type,
                onChange: (q) => J(z, { col_type: q.target.value })
              }, [
                (L(), te(Ae, null, nt(E, (q) => W("option", {
                  key: q,
                  value: q
                }, ke(q), 9, H0)), 64))
              ], 40, V0),
              W("button", {
                class: Be(["de-flag de-uq", { on: z.unique_col }]),
                title: "Unique",
                onClick: (q) => J(z, { unique_col: !z.unique_col })
              }, "UQ", 10, F0),
              W("button", {
                class: Be(["de-flag de-nn", { on: z.nullable === !1 }]),
                title: "Not null",
                onClick: (q) => J(z, { nullable: z.nullable !== !1 })
              }, "NN", 10, Y0),
              W("button", {
                class: "de-x de-x-sm",
                type: "button",
                "aria-label": "Remove column",
                title: "Remove column",
                onClick: (q) => le(z)
              }, "×", 8, U0)
            ]))), 128)),
            x().columns.length ? me("", !0) : (L(), te("p", X0, "No columns yet."))
          ]),
          W("div", G0, [
            W("button", {
              class: "de-btn",
              onClick: A[9] || (A[9] = (z) => Q(x()))
            }, "+ Column"),
            W("button", {
              class: "de-btn de-danger",
              onClick: A[10] || (A[10] = (z) => M(x()))
            }, "Delete table")
          ])
        ])) : me("", !0),
        i.value && R() ? (L(), te("aside", Z0, [
          W("div", q0, [
            W("span", {
              class: "de-panel-kind",
              style: Re({ color: _[R().relation_type] })
            }, "RELATION", 4),
            W("span", {
              class: "de-rel-badge",
              style: Re({ background: "color-mix(in srgb, " + _[R().relation_type] + " 18%, transparent)", color: _[R().relation_type] })
            }, ke(S[R().relation_type] || R().relation_type), 5),
            A[19] || (A[19] = W("span", { class: "de-spacer" }, null, -1)),
            W("button", {
              class: "de-x",
              type: "button",
              "aria-label": "Close relation editor",
              title: "Close",
              onClick: A[11] || (A[11] = (z) => v.value = null)
            }, "×")
          ]),
          W("div", W0, [
            W("div", K0, [
              W("span", Q0, ke(Y(R().from_table_id)), 1),
              V(R().from_column_id) ? (L(), te("span", J0, ke(V(R().from_column_id)), 1)) : me("", !0)
            ]),
            W("span", {
              class: "de-rel-arrow",
              style: Re({ color: _[R().relation_type] })
            }, "→", 4),
            W("div", j0, [
              W("span", e_, ke(Y(R().to_table_id)), 1),
              V(R().to_column_id) ? (L(), te("span", t_, ke(V(R().to_column_id)), 1)) : me("", !0)
            ])
          ]),
          W("div", n_, [
            A[20] || (A[20] = W("label", { class: "de-panel-label" }, "Type", -1)),
            W("div", o_, [
              (L(), te(Ae, null, nt(b, (z) => W("button", {
                key: z.value,
                class: Be(["de-rel-type", { on: R().relation_type === z.value }]),
                style: Re(R().relation_type === z.value ? { borderColor: _[z.value], color: _[z.value] } : {}),
                onClick: (q) => se(R(), z.value)
              }, ke(z.label), 15, i_)), 64))
            ])
          ]),
          W("div", r_, [
            A[21] || (A[21] = W("label", { class: "de-panel-label" }, "Name", -1)),
            W("input", {
              class: "de-col-name",
              value: R().name || "",
              placeholder: "fk_name (optional)",
              onChange: A[12] || (A[12] = (z) => fe(R(), z.target.value))
            }, null, 40, s_)
          ]),
          W("div", a_, [
            W("button", {
              class: "de-btn de-danger",
              onClick: A[13] || (A[13] = (z) => ye(R()))
            }, "Delete relation")
          ])
        ])) : me("", !0)
      ])
    ], 34));
  }
}), h_ = {
  rootComponent: u_
};
export {
  h_ as mountConfig
};
//# sourceMappingURL=lazy-mount-Dfmr6iP3.js.map
