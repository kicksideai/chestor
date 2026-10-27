import { ref as St, computed as me, watch as Pt, defineComponent as kn, useId as In, openBlock as le, createElementBlock as de, createElementVNode as Ee, createTextVNode as Ct, toDisplayString as ge, createCommentVNode as Ce, withDirectives as jn, vModelText as Tn, Fragment as Me, renderList as Xt, unref as Fe } from "vue";
import { g as Cn, d as qn } from "./presentation-BDm-VNGA.js";
function An(e, a) {
  return e.agents.find((w) => a.some((f) => f.agent === w.id && f.usable && f.enabled))?.id ?? e.agents[0]?.id ?? "";
}
function er(e, a) {
  return e.filter((w) => w.usable && w.agents.includes(a));
}
function Jt(e) {
  return e.filter((a) => !a.profiles?.length || a.profiles.includes("batch"));
}
function qt(e) {
  return Object.fromEntries(Jt(e?.options ?? []).filter((a) => a.default !== void 0 && a.default !== null).map((a) => {
    const w = JSON.parse(JSON.stringify(a.default));
    return [a.name, w];
  }));
}
function tr(e, a, w) {
  const f = w ? e?.unattended : void 0;
  return Object.fromEntries(Jt(e?.options ?? []).filter((E) => Object.hasOwn(a, E.name) && !Object.hasOwn(f ?? {}, E.name)).map((E) => [E.name, a[E.name]]));
}
function ls(e, a, w) {
  const f = Cn(), E = St(0), o = me(() => a.catalog()?.agents ?? []), d = me(() => o.value.find((s) => s.id === e.value.agent)), c = me(() => a.accounts().filter((s) => s.agent === e.value.agent && s.usable && s.enabled)), h = me(() => c.value.filter((s) => qn(s, f.value) === "ready")), y = me(() => er(a.images(), e.value.agent ?? "")), g = me(() => !!e.value.agent && !d.value), N = me(() => !y.value.some((s) => s.id === e.value.image_id)), I = me(() => !!e.value.account_id && !c.value.some((s) => s.id === e.value.account_id)), O = me(() => !!e.value.workspace_id && !a.workspaces().some((s) => s.id === e.value.workspace_id));
  function R(s) {
    const p = o.value.find((n) => n.id === s.agent);
    if (!p) return s;
    const S = w === "saved" ? { ...qt(p), ...s.options } : s.options ?? {};
    return { ...s, options: tr(p, S, s.unattended !== !1) };
  }
  const P = me(() => R(e.value).options ?? {});
  function v(s) {
    E.value = 0;
    const p = er(a.images(), s), S = o.value.find((n) => n.id === s);
    return R({
      ...e.value,
      agent: s,
      account_id: "",
      options: qt(S),
      unattended: !!S?.unattended,
      image_id: p.find((n) => n.id === e.value.image_id)?.id ?? p[0]?.id ?? ""
    });
  }
  function _() {
    const s = a.catalog();
    return { ...v(s ? An(s, a.accounts()) : ""), workspace_id: "" };
  }
  return w === "live" && (Pt([y, c, a.workspaces], () => {
    N.value && (e.value.image_id = y.value[0]?.id ?? ""), I.value && (e.value.account_id = ""), O.value && (e.value.workspace_id = "");
  }, { immediate: !0 }), Pt(() => d.value?.id, () => {
    E.value = 0, e.value.unattended = !!d.value?.unattended, e.value.options = tr(d.value, qt(d.value), e.value.unattended);
  }, { immediate: !0 }), Pt([d, () => e.value.unattended], () => {
    e.value.options = R(e.value).options;
  })), {
    now: f,
    driver: d,
    agentAccounts: c,
    ready: h,
    agentImages: y,
    invalidAgent: g,
    invalidImage: N,
    invalidAccount: I,
    invalidWorkspace: O,
    invalidOptions: E,
    optionValues: P,
    normalizeConfig: R,
    selectAgent: v,
    initialSelection: _
  };
}
function gn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ze = { exports: {} }, At = {}, $e = {}, Re = {}, Dt = {}, Mt = {}, Ft = {}, rr;
function Rt() {
  return rr || (rr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class a {
    }
    e._CodeOrName = a, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class w extends a {
      constructor(s) {
        if (super(), !e.IDENTIFIER.test(s))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        return !1;
      }
      get names() {
        return { [this.str]: 1 };
      }
    }
    e.Name = w;
    class f extends a {
      constructor(s) {
        super(), this._items = typeof s == "string" ? [s] : s;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const s = this._items[0];
        return s === "" || s === '""';
      }
      get str() {
        var s;
        return (s = this._str) !== null && s !== void 0 ? s : this._str = this._items.reduce((p, S) => `${p}${S}`, "");
      }
      get names() {
        var s;
        return (s = this._names) !== null && s !== void 0 ? s : this._names = this._items.reduce((p, S) => (S instanceof w && (p[S.str] = (p[S.str] || 0) + 1), p), {});
      }
    }
    e._Code = f, e.nil = new f("");
    function E(_, ...s) {
      const p = [_[0]];
      let S = 0;
      for (; S < s.length; )
        c(p, s[S]), p.push(_[++S]);
      return new f(p);
    }
    e._ = E;
    const o = new f("+");
    function d(_, ...s) {
      const p = [O(_[0])];
      let S = 0;
      for (; S < s.length; )
        p.push(o), c(p, s[S]), p.push(o, O(_[++S]));
      return h(p), new f(p);
    }
    e.str = d;
    function c(_, s) {
      s instanceof f ? _.push(...s._items) : s instanceof w ? _.push(s) : _.push(N(s));
    }
    e.addCodeArg = c;
    function h(_) {
      let s = 1;
      for (; s < _.length - 1; ) {
        if (_[s] === o) {
          const p = y(_[s - 1], _[s + 1]);
          if (p !== void 0) {
            _.splice(s - 1, 3, p);
            continue;
          }
          _[s++] = "+";
        }
        s++;
      }
    }
    function y(_, s) {
      if (s === '""')
        return _;
      if (_ === '""')
        return s;
      if (typeof _ == "string")
        return s instanceof w || _[_.length - 1] !== '"' ? void 0 : typeof s != "string" ? `${_.slice(0, -1)}${s}"` : s[0] === '"' ? _.slice(0, -1) + s.slice(1) : void 0;
      if (typeof s == "string" && s[0] === '"' && !(_ instanceof w))
        return `"${_}${s.slice(1)}`;
    }
    function g(_, s) {
      return s.emptyStr() ? _ : _.emptyStr() ? s : d`${_}${s}`;
    }
    e.strConcat = g;
    function N(_) {
      return typeof _ == "number" || typeof _ == "boolean" || _ === null ? _ : O(Array.isArray(_) ? _.join(",") : _);
    }
    function I(_) {
      return new f(O(_));
    }
    e.stringify = I;
    function O(_) {
      return JSON.stringify(_).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = O;
    function R(_) {
      return typeof _ == "string" && e.IDENTIFIER.test(_) ? new f(`.${_}`) : E`[${_}]`;
    }
    e.getProperty = R;
    function P(_) {
      if (typeof _ == "string" && e.IDENTIFIER.test(_))
        return new f(`${_}`);
      throw new Error(`CodeGen: invalid export name: ${_}, use explicit $id name mapping`);
    }
    e.getEsmExportName = P;
    function v(_) {
      return new f(_.toString());
    }
    e.regexpCode = v;
  })(Ft)), Ft;
}
var zt = {}, nr;
function ar() {
  return nr || (nr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const a = /* @__PURE__ */ Rt();
    class w extends Error {
      constructor(y) {
        super(`CodeGen: "code" for ${y} not defined`), this.value = y.value;
      }
    }
    var f;
    (function(h) {
      h[h.Started = 0] = "Started", h[h.Completed = 1] = "Completed";
    })(f || (e.UsedValueState = f = {})), e.varKinds = {
      const: new a.Name("const"),
      let: new a.Name("let"),
      var: new a.Name("var")
    };
    class E {
      constructor({ prefixes: y, parent: g } = {}) {
        this._names = {}, this._prefixes = y, this._parent = g;
      }
      toName(y) {
        return y instanceof a.Name ? y : this.name(y);
      }
      name(y) {
        return new a.Name(this._newName(y));
      }
      _newName(y) {
        const g = this._names[y] || this._nameGroup(y);
        return `${y}${g.index++}`;
      }
      _nameGroup(y) {
        var g, N;
        if (!((N = (g = this._parent) === null || g === void 0 ? void 0 : g._prefixes) === null || N === void 0) && N.has(y) || this._prefixes && !this._prefixes.has(y))
          throw new Error(`CodeGen: prefix "${y}" is not allowed in this scope`);
        return this._names[y] = { prefix: y, index: 0 };
      }
    }
    e.Scope = E;
    class o extends a.Name {
      constructor(y, g) {
        super(g), this.prefix = y;
      }
      setValue(y, { property: g, itemIndex: N }) {
        this.value = y, this.scopePath = (0, a._)`.${new a.Name(g)}[${N}]`;
      }
    }
    e.ValueScopeName = o;
    const d = (0, a._)`\n`;
    class c extends E {
      constructor(y) {
        super(y), this._values = {}, this._scope = y.scope, this.opts = { ...y, _n: y.lines ? d : a.nil };
      }
      get() {
        return this._scope;
      }
      name(y) {
        return new o(y, this._newName(y));
      }
      value(y, g) {
        var N;
        if (g.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const I = this.toName(y), { prefix: O } = I, R = (N = g.key) !== null && N !== void 0 ? N : g.ref;
        let P = this._values[O];
        if (P) {
          const s = P.get(R);
          if (s)
            return s;
        } else
          P = this._values[O] = /* @__PURE__ */ new Map();
        P.set(R, I);
        const v = this._scope[O] || (this._scope[O] = []), _ = v.length;
        return v[_] = g.ref, I.setValue(g, { property: O, itemIndex: _ }), I;
      }
      getValue(y, g) {
        const N = this._values[y];
        if (N)
          return N.get(g);
      }
      scopeRefs(y, g = this._values) {
        return this._reduceValues(g, (N) => {
          if (N.scopePath === void 0)
            throw new Error(`CodeGen: name "${N}" has no value`);
          return (0, a._)`${y}${N.scopePath}`;
        });
      }
      scopeCode(y = this._values, g, N) {
        return this._reduceValues(y, (I) => {
          if (I.value === void 0)
            throw new Error(`CodeGen: name "${I}" has no value`);
          return I.value.code;
        }, g, N);
      }
      _reduceValues(y, g, N = {}, I) {
        let O = a.nil;
        for (const R in y) {
          const P = y[R];
          if (!P)
            continue;
          const v = N[R] = N[R] || /* @__PURE__ */ new Map();
          P.forEach((_) => {
            if (v.has(_))
              return;
            v.set(_, f.Started);
            let s = g(_);
            if (s) {
              const p = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              O = (0, a._)`${O}${p} ${_} = ${s};${this.opts._n}`;
            } else if (s = I?.(_))
              O = (0, a._)`${O}${s}${this.opts._n}`;
            else
              throw new w(_);
            v.set(_, f.Completed);
          });
        }
        return O;
      }
    }
    e.ValueScope = c;
  })(zt)), zt;
}
var sr;
function W() {
  return sr || (sr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const a = /* @__PURE__ */ Rt(), w = /* @__PURE__ */ ar();
    var f = /* @__PURE__ */ Rt();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return f._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return f.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return f.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return f.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return f.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return f.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return f.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return f.Name;
    } });
    var E = /* @__PURE__ */ ar();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return E.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return E.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return E.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return E.varKinds;
    } }), e.operators = {
      GT: new a._Code(">"),
      GTE: new a._Code(">="),
      LT: new a._Code("<"),
      LTE: new a._Code("<="),
      EQ: new a._Code("==="),
      NEQ: new a._Code("!=="),
      NOT: new a._Code("!"),
      OR: new a._Code("||"),
      AND: new a._Code("&&"),
      ADD: new a._Code("+")
    };
    class o {
      optimizeNodes() {
        return this;
      }
      optimizeNames(t, r) {
        return this;
      }
    }
    class d extends o {
      constructor(t, r, $) {
        super(), this.varKind = t, this.name = r, this.rhs = $;
      }
      render({ es5: t, _n: r }) {
        const $ = t ? w.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${$} ${this.name}${T};` + r;
      }
      optimizeNames(t, r) {
        if (t[this.name.str])
          return this.rhs && (this.rhs = x(this.rhs, t, r)), this;
      }
      get names() {
        return this.rhs instanceof a._CodeOrName ? this.rhs.names : {};
      }
    }
    class c extends o {
      constructor(t, r, $) {
        super(), this.lhs = t, this.rhs = r, this.sideEffects = $;
      }
      render({ _n: t }) {
        return `${this.lhs} = ${this.rhs};` + t;
      }
      optimizeNames(t, r) {
        if (!(this.lhs instanceof a.Name && !t[this.lhs.str] && !this.sideEffects))
          return this.rhs = x(this.rhs, t, r), this;
      }
      get names() {
        const t = this.lhs instanceof a.Name ? {} : { ...this.lhs.names };
        return H(t, this.rhs);
      }
    }
    class h extends c {
      constructor(t, r, $, T) {
        super(t, $, T), this.op = r;
      }
      render({ _n: t }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + t;
      }
    }
    class y extends o {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `${this.label}:` + t;
      }
    }
    class g extends o {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `break${this.label ? ` ${this.label}` : ""};` + t;
      }
    }
    class N extends o {
      constructor(t) {
        super(), this.error = t;
      }
      render({ _n: t }) {
        return `throw ${this.error};` + t;
      }
      get names() {
        return this.error.names;
      }
    }
    class I extends o {
      constructor(t) {
        super(), this.code = t;
      }
      render({ _n: t }) {
        return `${this.code};` + t;
      }
      optimizeNodes() {
        return `${this.code}` ? this : void 0;
      }
      optimizeNames(t, r) {
        return this.code = x(this.code, t, r), this;
      }
      get names() {
        return this.code instanceof a._CodeOrName ? this.code.names : {};
      }
    }
    class O extends o {
      constructor(t = []) {
        super(), this.nodes = t;
      }
      render(t) {
        return this.nodes.reduce((r, $) => r + $.render(t), "");
      }
      optimizeNodes() {
        const { nodes: t } = this;
        let r = t.length;
        for (; r--; ) {
          const $ = t[r].optimizeNodes();
          Array.isArray($) ? t.splice(r, 1, ...$) : $ ? t[r] = $ : t.splice(r, 1);
        }
        return t.length > 0 ? this : void 0;
      }
      optimizeNames(t, r) {
        const { nodes: $ } = this;
        let T = $.length;
        for (; T--; ) {
          const j = $[T];
          j.optimizeNames(t, r) || (Z(t, j.names), $.splice(T, 1));
        }
        return $.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((t, r) => L(t, r.names), {});
      }
    }
    class R extends O {
      render(t) {
        return "{" + t._n + super.render(t) + "}" + t._n;
      }
    }
    class P extends O {
    }
    class v extends R {
    }
    v.kind = "else";
    class _ extends R {
      constructor(t, r) {
        super(r), this.condition = t;
      }
      render(t) {
        let r = `if(${this.condition})` + super.render(t);
        return this.else && (r += "else " + this.else.render(t)), r;
      }
      optimizeNodes() {
        super.optimizeNodes();
        const t = this.condition;
        if (t === !0)
          return this.nodes;
        let r = this.else;
        if (r) {
          const $ = r.optimizeNodes();
          r = this.else = Array.isArray($) ? new v($) : $;
        }
        if (r)
          return t === !1 ? r instanceof _ ? r : r.nodes : this.nodes.length ? this : new _(ie(t), r instanceof _ ? [r] : r.nodes);
        if (!(t === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(t, r) {
        var $;
        if (this.else = ($ = this.else) === null || $ === void 0 ? void 0 : $.optimizeNames(t, r), !!(super.optimizeNames(t, r) || this.else))
          return this.condition = x(this.condition, t, r), this;
      }
      get names() {
        const t = super.names;
        return H(t, this.condition), this.else && L(t, this.else.names), t;
      }
    }
    _.kind = "if";
    class s extends R {
    }
    s.kind = "for";
    class p extends s {
      constructor(t) {
        super(), this.iteration = t;
      }
      render(t) {
        return `for(${this.iteration})` + super.render(t);
      }
      optimizeNames(t, r) {
        if (super.optimizeNames(t, r))
          return this.iteration = x(this.iteration, t, r), this;
      }
      get names() {
        return L(super.names, this.iteration.names);
      }
    }
    class S extends s {
      constructor(t, r, $, T) {
        super(), this.varKind = t, this.name = r, this.from = $, this.to = T;
      }
      render(t) {
        const r = t.es5 ? w.varKinds.var : this.varKind, { name: $, from: T, to: j } = this;
        return `for(${r} ${$}=${T}; ${$}<${j}; ${$}++)` + super.render(t);
      }
      get names() {
        const t = H(super.names, this.from);
        return H(t, this.to);
      }
    }
    class n extends s {
      constructor(t, r, $, T) {
        super(), this.loop = t, this.varKind = r, this.name = $, this.iterable = T;
      }
      render(t) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(t);
      }
      optimizeNames(t, r) {
        if (super.optimizeNames(t, r))
          return this.iterable = x(this.iterable, t, r), this;
      }
      get names() {
        return L(super.names, this.iterable.names);
      }
    }
    class i extends R {
      constructor(t, r, $) {
        super(), this.name = t, this.args = r, this.async = $;
      }
      render(t) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(t);
      }
    }
    i.kind = "func";
    class l extends O {
      render(t) {
        return "return " + super.render(t);
      }
    }
    l.kind = "return";
    class q extends R {
      render(t) {
        let r = "try" + super.render(t);
        return this.catch && (r += this.catch.render(t)), this.finally && (r += this.finally.render(t)), r;
      }
      optimizeNodes() {
        var t, r;
        return super.optimizeNodes(), (t = this.catch) === null || t === void 0 || t.optimizeNodes(), (r = this.finally) === null || r === void 0 || r.optimizeNodes(), this;
      }
      optimizeNames(t, r) {
        var $, T;
        return super.optimizeNames(t, r), ($ = this.catch) === null || $ === void 0 || $.optimizeNames(t, r), (T = this.finally) === null || T === void 0 || T.optimizeNames(t, r), this;
      }
      get names() {
        const t = super.names;
        return this.catch && L(t, this.catch.names), this.finally && L(t, this.finally.names), t;
      }
    }
    class M extends R {
      constructor(t) {
        super(), this.error = t;
      }
      render(t) {
        return `catch(${this.error})` + super.render(t);
      }
    }
    M.kind = "catch";
    class K extends R {
      render(t) {
        return "finally" + super.render(t);
      }
    }
    K.kind = "finally";
    class D {
      constructor(t, r = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...r, _n: r.lines ? `
` : "" }, this._extScope = t, this._scope = new w.Scope({ parent: t }), this._nodes = [new P()];
      }
      toString() {
        return this._root.render(this.opts);
      }
      // returns unique name in the internal scope
      name(t) {
        return this._scope.name(t);
      }
      // reserves unique name in the external scope
      scopeName(t) {
        return this._extScope.name(t);
      }
      // reserves unique name in the external scope and assigns value to it
      scopeValue(t, r) {
        const $ = this._extScope.value(t, r);
        return (this._values[$.prefix] || (this._values[$.prefix] = /* @__PURE__ */ new Set())).add($), $;
      }
      getScopeValue(t, r) {
        return this._extScope.getValue(t, r);
      }
      // return code that assigns values in the external scope to the names that are used internally
      // (same names that were returned by gen.scopeName or gen.scopeValue)
      scopeRefs(t) {
        return this._extScope.scopeRefs(t, this._values);
      }
      scopeCode() {
        return this._extScope.scopeCode(this._values);
      }
      _def(t, r, $, T) {
        const j = this._scope.toName(r);
        return $ !== void 0 && T && (this._constants[j.str] = $), this._leafNode(new d(t, j, $)), j;
      }
      // `const` declaration (`var` in es5 mode)
      const(t, r, $) {
        return this._def(w.varKinds.const, t, r, $);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(t, r, $) {
        return this._def(w.varKinds.let, t, r, $);
      }
      // `var` declaration with optional assignment
      var(t, r, $) {
        return this._def(w.varKinds.var, t, r, $);
      }
      // assignment code
      assign(t, r, $) {
        return this._leafNode(new c(t, r, $));
      }
      // `+=` code
      add(t, r) {
        return this._leafNode(new h(t, e.operators.ADD, r));
      }
      // appends passed SafeExpr to code or executes Block
      code(t) {
        return typeof t == "function" ? t() : t !== a.nil && this._leafNode(new I(t)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...t) {
        const r = ["{"];
        for (const [$, T] of t)
          r.length > 1 && r.push(","), r.push($), ($ !== T || this.opts.es5) && (r.push(":"), (0, a.addCodeArg)(r, T));
        return r.push("}"), new a._Code(r);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(t, r, $) {
        if (this._blockNode(new _(t)), r && $)
          this.code(r).else().code($).endIf();
        else if (r)
          this.code(r).endIf();
        else if ($)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(t) {
        return this._elseNode(new _(t));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new v());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(_, v);
      }
      _for(t, r) {
        return this._blockNode(t), r && this.code(r).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(t, r) {
        return this._for(new p(t), r);
      }
      // `for` statement for a range of values
      forRange(t, r, $, T, j = this.opts.es5 ? w.varKinds.var : w.varKinds.let) {
        const F = this._scope.toName(t);
        return this._for(new S(j, F, r, $), () => T(F));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(t, r, $, T = w.varKinds.const) {
        const j = this._scope.toName(t);
        if (this.opts.es5) {
          const F = r instanceof a.Name ? r : this.var("_arr", r);
          return this.forRange("_i", 0, (0, a._)`${F}.length`, (G) => {
            this.var(j, (0, a._)`${F}[${G}]`), $(j);
          });
        }
        return this._for(new n("of", T, j, r), () => $(j));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(t, r, $, T = this.opts.es5 ? w.varKinds.var : w.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(t, (0, a._)`Object.keys(${r})`, $);
        const j = this._scope.toName(t);
        return this._for(new n("in", T, j, r), () => $(j));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(s);
      }
      // `label` statement
      label(t) {
        return this._leafNode(new y(t));
      }
      // `break` statement
      break(t) {
        return this._leafNode(new g(t));
      }
      // `return` statement
      return(t) {
        const r = new l();
        if (this._blockNode(r), this.code(t), r.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(l);
      }
      // `try` statement
      try(t, r, $) {
        if (!r && !$)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const T = new q();
        if (this._blockNode(T), this.code(t), r) {
          const j = this.name("e");
          this._currNode = T.catch = new M(j), r(j);
        }
        return $ && (this._currNode = T.finally = new K(), this.code($)), this._endBlockNode(M, K);
      }
      // `throw` statement
      throw(t) {
        return this._leafNode(new N(t));
      }
      // start self-balancing block
      block(t, r) {
        return this._blockStarts.push(this._nodes.length), t && this.code(t).endBlock(r), this;
      }
      // end the current self-balancing block
      endBlock(t) {
        const r = this._blockStarts.pop();
        if (r === void 0)
          throw new Error("CodeGen: not in self-balancing block");
        const $ = this._nodes.length - r;
        if ($ < 0 || t !== void 0 && $ !== t)
          throw new Error(`CodeGen: wrong number of nodes: ${$} vs ${t} expected`);
        return this._nodes.length = r, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(t, r = a.nil, $, T) {
        return this._blockNode(new i(t, r, $)), T && this.code(T).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(i);
      }
      optimize(t = 1) {
        for (; t-- > 0; )
          this._root.optimizeNodes(), this._root.optimizeNames(this._root.names, this._constants);
      }
      _leafNode(t) {
        return this._currNode.nodes.push(t), this;
      }
      _blockNode(t) {
        this._currNode.nodes.push(t), this._nodes.push(t);
      }
      _endBlockNode(t, r) {
        const $ = this._currNode;
        if ($ instanceof t || r && $ instanceof r)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${r ? `${t.kind}/${r.kind}` : t.kind}"`);
      }
      _elseNode(t) {
        const r = this._currNode;
        if (!(r instanceof _))
          throw new Error('CodeGen: "else" without "if"');
        return this._currNode = r.else = t, this;
      }
      get _root() {
        return this._nodes[0];
      }
      get _currNode() {
        const t = this._nodes;
        return t[t.length - 1];
      }
      set _currNode(t) {
        const r = this._nodes;
        r[r.length - 1] = t;
      }
    }
    e.CodeGen = D;
    function L(m, t) {
      for (const r in t)
        m[r] = (m[r] || 0) + (t[r] || 0);
      return m;
    }
    function H(m, t) {
      return t instanceof a._CodeOrName ? L(m, t.names) : m;
    }
    function x(m, t, r) {
      if (m instanceof a.Name)
        return $(m);
      if (!T(m))
        return m;
      return new a._Code(m._items.reduce((j, F) => (F instanceof a.Name && (F = $(F)), F instanceof a._Code ? j.push(...F._items) : j.push(F), j), []));
      function $(j) {
        const F = r[j.str];
        return F === void 0 || t[j.str] !== 1 ? j : (delete t[j.str], F);
      }
      function T(j) {
        return j instanceof a._Code && j._items.some((F) => F instanceof a.Name && t[F.str] === 1 && r[F.str] !== void 0);
      }
    }
    function Z(m, t) {
      for (const r in t)
        m[r] = (m[r] || 0) - (t[r] || 0);
    }
    function ie(m) {
      return typeof m == "boolean" || typeof m == "number" || m === null ? !m : (0, a._)`!${b(m)}`;
    }
    e.not = ie;
    const oe = u(e.operators.AND);
    function Y(...m) {
      return m.reduce(oe);
    }
    e.and = Y;
    const ue = u(e.operators.OR);
    function z(...m) {
      return m.reduce(ue);
    }
    e.or = z;
    function u(m) {
      return (t, r) => t === a.nil ? r : r === a.nil ? t : (0, a._)`${b(t)} ${m} ${b(r)}`;
    }
    function b(m) {
      return m instanceof a.Name ? m : (0, a._)`(${m})`;
    }
  })(Mt)), Mt;
}
var B = {}, or;
function Q() {
  if (or) return B;
  or = 1, Object.defineProperty(B, "__esModule", { value: !0 }), B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Rt();
  function w(n) {
    const i = {};
    for (const l of n)
      i[l] = !0;
    return i;
  }
  B.toHash = w;
  function f(n, i) {
    return typeof i == "boolean" ? i : Object.keys(i).length === 0 ? !0 : (E(n, i), !o(i, n.self.RULES.all));
  }
  B.alwaysValidSchema = f;
  function E(n, i = n.schema) {
    const { opts: l, self: q } = n;
    if (!l.strictSchema || typeof i == "boolean")
      return;
    const M = q.RULES.keywords;
    for (const K in i)
      M[K] || S(n, `unknown keyword: "${K}"`);
  }
  B.checkUnknownRules = E;
  function o(n, i) {
    if (typeof n == "boolean")
      return !n;
    for (const l in n)
      if (i[l])
        return !0;
    return !1;
  }
  B.schemaHasRules = o;
  function d(n, i) {
    if (typeof n == "boolean")
      return !n;
    for (const l in n)
      if (l !== "$ref" && i.all[l])
        return !0;
    return !1;
  }
  B.schemaHasRulesButRef = d;
  function c({ topSchemaRef: n, schemaPath: i }, l, q, M) {
    if (!M) {
      if (typeof l == "number" || typeof l == "boolean")
        return l;
      if (typeof l == "string")
        return (0, e._)`${l}`;
    }
    return (0, e._)`${n}${i}${(0, e.getProperty)(q)}`;
  }
  B.schemaRefOrVal = c;
  function h(n) {
    return N(decodeURIComponent(n));
  }
  B.unescapeFragment = h;
  function y(n) {
    return encodeURIComponent(g(n));
  }
  B.escapeFragment = y;
  function g(n) {
    return typeof n == "number" ? `${n}` : n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  B.escapeJsonPointer = g;
  function N(n) {
    return n.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  B.unescapeJsonPointer = N;
  function I(n, i) {
    if (Array.isArray(n))
      for (const l of n)
        i(l);
    else
      i(n);
  }
  B.eachItem = I;
  function O({ mergeNames: n, mergeToName: i, mergeValues: l, resultToName: q }) {
    return (M, K, D, L) => {
      const H = D === void 0 ? K : D instanceof e.Name ? (K instanceof e.Name ? n(M, K, D) : i(M, K, D), D) : K instanceof e.Name ? (i(M, D, K), K) : l(K, D);
      return L === e.Name && !(H instanceof e.Name) ? q(M, H) : H;
    };
  }
  B.mergeEvaluated = {
    props: O({
      mergeNames: (n, i, l) => n.if((0, e._)`${l} !== true && ${i} !== undefined`, () => {
        n.if((0, e._)`${i} === true`, () => n.assign(l, !0), () => n.assign(l, (0, e._)`${l} || {}`).code((0, e._)`Object.assign(${l}, ${i})`));
      }),
      mergeToName: (n, i, l) => n.if((0, e._)`${l} !== true`, () => {
        i === !0 ? n.assign(l, !0) : (n.assign(l, (0, e._)`${l} || {}`), P(n, l, i));
      }),
      mergeValues: (n, i) => n === !0 ? !0 : { ...n, ...i },
      resultToName: R
    }),
    items: O({
      mergeNames: (n, i, l) => n.if((0, e._)`${l} !== true && ${i} !== undefined`, () => n.assign(l, (0, e._)`${i} === true ? true : ${l} > ${i} ? ${l} : ${i}`)),
      mergeToName: (n, i, l) => n.if((0, e._)`${l} !== true`, () => n.assign(l, i === !0 ? !0 : (0, e._)`${l} > ${i} ? ${l} : ${i}`)),
      mergeValues: (n, i) => n === !0 ? !0 : Math.max(n, i),
      resultToName: (n, i) => n.var("items", i)
    })
  };
  function R(n, i) {
    if (i === !0)
      return n.var("props", !0);
    const l = n.var("props", (0, e._)`{}`);
    return i !== void 0 && P(n, l, i), l;
  }
  B.evaluatedPropsToName = R;
  function P(n, i, l) {
    Object.keys(l).forEach((q) => n.assign((0, e._)`${i}${(0, e.getProperty)(q)}`, !0));
  }
  B.setEvaluated = P;
  const v = {};
  function _(n, i) {
    return n.scopeValue("func", {
      ref: i,
      code: v[i.code] || (v[i.code] = new a._Code(i.code))
    });
  }
  B.useFunc = _;
  var s;
  (function(n) {
    n[n.Num = 0] = "Num", n[n.Str = 1] = "Str";
  })(s || (B.Type = s = {}));
  function p(n, i, l) {
    if (n instanceof e.Name) {
      const q = i === s.Num;
      return l ? q ? (0, e._)`"[" + ${n} + "]"` : (0, e._)`"['" + ${n} + "']"` : q ? (0, e._)`"/" + ${n}` : (0, e._)`"/" + ${n}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return l ? (0, e.getProperty)(n).toString() : "/" + g(n);
  }
  B.getErrorPath = p;
  function S(n, i, l = n.opts.strictSchema) {
    if (l) {
      if (i = `strict mode: ${i}`, l === !0)
        throw new Error(i);
      n.self.logger.warn(i);
    }
  }
  return B.checkStrictMode = S, B;
}
var Ve = {}, ir;
function Pe() {
  if (ir) return Ve;
  ir = 1, Object.defineProperty(Ve, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = {
    // validation function arguments
    data: new e.Name("data"),
    // data passed to validation function
    // args passed from referencing schema
    valCxt: new e.Name("valCxt"),
    // validation/data context - should not be used directly, it is destructured to the names below
    instancePath: new e.Name("instancePath"),
    parentData: new e.Name("parentData"),
    parentDataProperty: new e.Name("parentDataProperty"),
    rootData: new e.Name("rootData"),
    // root data - same as the data passed to the first/top validation function
    dynamicAnchors: new e.Name("dynamicAnchors"),
    // used to support recursiveRef and dynamicRef
    // function scoped variables
    vErrors: new e.Name("vErrors"),
    // null or array of validation errors
    errors: new e.Name("errors"),
    // counter of validation errors
    this: new e.Name("this"),
    // "globals"
    self: new e.Name("self"),
    scope: new e.Name("scope"),
    // JTD serialize/parse name for JSON string and position
    json: new e.Name("json"),
    jsonPos: new e.Name("jsonPos"),
    jsonLen: new e.Name("jsonLen"),
    jsonPart: new e.Name("jsonPart")
  };
  return Ve.default = a, Ve;
}
var ur;
function Ot() {
  return ur || (ur = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), f = /* @__PURE__ */ Pe();
    e.keywordError = {
      message: ({ keyword: v }) => (0, a.str)`must pass "${v}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: v, schemaType: _ }) => _ ? (0, a.str)`"${v}" keyword must be ${_} ($data)` : (0, a.str)`"${v}" keyword is invalid ($data)`
    };
    function E(v, _ = e.keywordError, s, p) {
      const { it: S } = v, { gen: n, compositeRule: i, allErrors: l } = S, q = N(v, _, s);
      p ?? (i || l) ? h(n, q) : y(S, (0, a._)`[${q}]`);
    }
    e.reportError = E;
    function o(v, _ = e.keywordError, s) {
      const { it: p } = v, { gen: S, compositeRule: n, allErrors: i } = p, l = N(v, _, s);
      h(S, l), n || i || y(p, f.default.vErrors);
    }
    e.reportExtraError = o;
    function d(v, _) {
      v.assign(f.default.errors, _), v.if((0, a._)`${f.default.vErrors} !== null`, () => v.if(_, () => v.assign((0, a._)`${f.default.vErrors}.length`, _), () => v.assign(f.default.vErrors, null)));
    }
    e.resetErrorsCount = d;
    function c({ gen: v, keyword: _, schemaValue: s, data: p, errsCount: S, it: n }) {
      if (S === void 0)
        throw new Error("ajv implementation error");
      const i = v.name("err");
      v.forRange("i", S, f.default.errors, (l) => {
        v.const(i, (0, a._)`${f.default.vErrors}[${l}]`), v.if((0, a._)`${i}.instancePath === undefined`, () => v.assign((0, a._)`${i}.instancePath`, (0, a.strConcat)(f.default.instancePath, n.errorPath))), v.assign((0, a._)`${i}.schemaPath`, (0, a.str)`${n.errSchemaPath}/${_}`), n.opts.verbose && (v.assign((0, a._)`${i}.schema`, s), v.assign((0, a._)`${i}.data`, p));
      });
    }
    e.extendErrors = c;
    function h(v, _) {
      const s = v.const("err", _);
      v.if((0, a._)`${f.default.vErrors} === null`, () => v.assign(f.default.vErrors, (0, a._)`[${s}]`), (0, a._)`${f.default.vErrors}.push(${s})`), v.code((0, a._)`${f.default.errors}++`);
    }
    function y(v, _) {
      const { gen: s, validateName: p, schemaEnv: S } = v;
      S.$async ? s.throw((0, a._)`new ${v.ValidationError}(${_})`) : (s.assign((0, a._)`${p}.errors`, _), s.return(!1));
    }
    const g = {
      keyword: new a.Name("keyword"),
      schemaPath: new a.Name("schemaPath"),
      // also used in JTD errors
      params: new a.Name("params"),
      propertyName: new a.Name("propertyName"),
      message: new a.Name("message"),
      schema: new a.Name("schema"),
      parentSchema: new a.Name("parentSchema")
    };
    function N(v, _, s) {
      const { createErrors: p } = v.it;
      return p === !1 ? (0, a._)`{}` : I(v, _, s);
    }
    function I(v, _, s = {}) {
      const { gen: p, it: S } = v, n = [
        O(S, s),
        R(v, s)
      ];
      return P(v, _, n), p.object(...n);
    }
    function O({ errorPath: v }, { instancePath: _ }) {
      const s = _ ? (0, a.str)`${v}${(0, w.getErrorPath)(_, w.Type.Str)}` : v;
      return [f.default.instancePath, (0, a.strConcat)(f.default.instancePath, s)];
    }
    function R({ keyword: v, it: { errSchemaPath: _ } }, { schemaPath: s, parentSchema: p }) {
      let S = p ? _ : (0, a.str)`${_}/${v}`;
      return s && (S = (0, a.str)`${S}${(0, w.getErrorPath)(s, w.Type.Str)}`), [g.schemaPath, S];
    }
    function P(v, { params: _, message: s }, p) {
      const { keyword: S, data: n, schemaValue: i, it: l } = v, { opts: q, propertyName: M, topSchemaRef: K, schemaPath: D } = l;
      p.push([g.keyword, S], [g.params, typeof _ == "function" ? _(v) : _ || (0, a._)`{}`]), q.messages && p.push([g.message, typeof s == "function" ? s(v) : s]), q.verbose && p.push([g.schema, i], [g.parentSchema, (0, a._)`${K}${D}`], [f.default.data, n]), M && p.push([g.propertyName, M]);
    }
  })(Dt)), Dt;
}
var cr;
function Dn() {
  if (cr) return Re;
  cr = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.boolOrEmptySchema = Re.topBoolOrEmptySchema = void 0;
  const e = /* @__PURE__ */ Ot(), a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Pe(), f = {
    message: "boolean schema is false"
  };
  function E(c) {
    const { gen: h, schema: y, validateName: g } = c;
    y === !1 ? d(c, !1) : typeof y == "object" && y.$async === !0 ? h.return(w.default.data) : (h.assign((0, a._)`${g}.errors`, null), h.return(!0));
  }
  Re.topBoolOrEmptySchema = E;
  function o(c, h) {
    const { gen: y, schema: g } = c;
    g === !1 ? (y.var(h, !1), d(c)) : y.var(h, !0);
  }
  Re.boolOrEmptySchema = o;
  function d(c, h) {
    const { gen: y, data: g } = c, N = {
      gen: y,
      keyword: "false schema",
      data: g,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(N, f, void 0, h);
  }
  return Re;
}
var ce = {}, Ne = {}, lr;
function $n() {
  if (lr) return Ne;
  lr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.getRules = Ne.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], a = new Set(e);
  function w(E) {
    return typeof E == "string" && a.has(E);
  }
  Ne.isJSONType = w;
  function f() {
    const E = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...E, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, E.number, E.string, E.array, E.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Ne.getRules = f, Ne;
}
var we = {}, dr;
function wn() {
  if (dr) return we;
  dr = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.shouldUseRule = we.shouldUseGroup = we.schemaHasRulesForType = void 0;
  function e({ schema: f, self: E }, o) {
    const d = E.RULES.types[o];
    return d && d !== !0 && a(f, d);
  }
  we.schemaHasRulesForType = e;
  function a(f, E) {
    return E.rules.some((o) => w(f, o));
  }
  we.shouldUseGroup = a;
  function w(f, E) {
    var o;
    return f[E.keyword] !== void 0 || ((o = E.definition.implements) === null || o === void 0 ? void 0 : o.some((d) => f[d] !== void 0));
  }
  return we.shouldUseRule = w, we;
}
var fr;
function Nt() {
  if (fr) return ce;
  fr = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.reportTypeError = ce.checkDataTypes = ce.checkDataType = ce.coerceAndCheckDataType = ce.getJSONTypes = ce.getSchemaTypes = ce.DataType = void 0;
  const e = /* @__PURE__ */ $n(), a = /* @__PURE__ */ wn(), w = /* @__PURE__ */ Ot(), f = /* @__PURE__ */ W(), E = /* @__PURE__ */ Q();
  var o;
  (function(s) {
    s[s.Correct = 0] = "Correct", s[s.Wrong = 1] = "Wrong";
  })(o || (ce.DataType = o = {}));
  function d(s) {
    const p = c(s.type);
    if (p.includes("null")) {
      if (s.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!p.length && s.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      s.nullable === !0 && p.push("null");
    }
    return p;
  }
  ce.getSchemaTypes = d;
  function c(s) {
    const p = Array.isArray(s) ? s : s ? [s] : [];
    if (p.every(e.isJSONType))
      return p;
    throw new Error("type must be JSONType or JSONType[]: " + p.join(","));
  }
  ce.getJSONTypes = c;
  function h(s, p) {
    const { gen: S, data: n, opts: i } = s, l = g(p, i.coerceTypes), q = p.length > 0 && !(l.length === 0 && p.length === 1 && (0, a.schemaHasRulesForType)(s, p[0]));
    if (q) {
      const M = R(p, n, i.strictNumbers, o.Wrong);
      S.if(M, () => {
        l.length ? N(s, p, l) : v(s);
      });
    }
    return q;
  }
  ce.coerceAndCheckDataType = h;
  const y = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function g(s, p) {
    return p ? s.filter((S) => y.has(S) || p === "array" && S === "array") : [];
  }
  function N(s, p, S) {
    const { gen: n, data: i, opts: l } = s, q = n.let("dataType", (0, f._)`typeof ${i}`), M = n.let("coerced", (0, f._)`undefined`);
    l.coerceTypes === "array" && n.if((0, f._)`${q} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, f._)`${i}[0]`).assign(q, (0, f._)`typeof ${i}`).if(R(p, i, l.strictNumbers), () => n.assign(M, i))), n.if((0, f._)`${M} !== undefined`);
    for (const D of S)
      (y.has(D) || D === "array" && l.coerceTypes === "array") && K(D);
    n.else(), v(s), n.endIf(), n.if((0, f._)`${M} !== undefined`, () => {
      n.assign(i, M), I(s, M);
    });
    function K(D) {
      switch (D) {
        case "string":
          n.elseIf((0, f._)`${q} == "number" || ${q} == "boolean"`).assign(M, (0, f._)`"" + ${i}`).elseIf((0, f._)`${i} === null`).assign(M, (0, f._)`""`);
          return;
        case "number":
          n.elseIf((0, f._)`${q} == "boolean" || ${i} === null
              || (${q} == "string" && ${i} && ${i} == +${i})`).assign(M, (0, f._)`+${i}`);
          return;
        case "integer":
          n.elseIf((0, f._)`${q} === "boolean" || ${i} === null
              || (${q} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(M, (0, f._)`+${i}`);
          return;
        case "boolean":
          n.elseIf((0, f._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(M, !1).elseIf((0, f._)`${i} === "true" || ${i} === 1`).assign(M, !0);
          return;
        case "null":
          n.elseIf((0, f._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(M, null);
          return;
        case "array":
          n.elseIf((0, f._)`${q} === "string" || ${q} === "number"
              || ${q} === "boolean" || ${i} === null`).assign(M, (0, f._)`[${i}]`);
      }
    }
  }
  function I({ gen: s, parentData: p, parentDataProperty: S }, n) {
    s.if((0, f._)`${p} !== undefined`, () => s.assign((0, f._)`${p}[${S}]`, n));
  }
  function O(s, p, S, n = o.Correct) {
    const i = n === o.Correct ? f.operators.EQ : f.operators.NEQ;
    let l;
    switch (s) {
      case "null":
        return (0, f._)`${p} ${i} null`;
      case "array":
        l = (0, f._)`Array.isArray(${p})`;
        break;
      case "object":
        l = (0, f._)`${p} && typeof ${p} == "object" && !Array.isArray(${p})`;
        break;
      case "integer":
        l = q((0, f._)`!(${p} % 1) && !isNaN(${p})`);
        break;
      case "number":
        l = q();
        break;
      default:
        return (0, f._)`typeof ${p} ${i} ${s}`;
    }
    return n === o.Correct ? l : (0, f.not)(l);
    function q(M = f.nil) {
      return (0, f.and)((0, f._)`typeof ${p} == "number"`, M, S ? (0, f._)`isFinite(${p})` : f.nil);
    }
  }
  ce.checkDataType = O;
  function R(s, p, S, n) {
    if (s.length === 1)
      return O(s[0], p, S, n);
    let i;
    const l = (0, E.toHash)(s);
    if (l.array && l.object) {
      const q = (0, f._)`typeof ${p} != "object"`;
      i = l.null ? q : (0, f._)`!${p} || ${q}`, delete l.null, delete l.array, delete l.object;
    } else
      i = f.nil;
    l.number && delete l.integer;
    for (const q in l)
      i = (0, f.and)(i, O(q, p, S, n));
    return i;
  }
  ce.checkDataTypes = R;
  const P = {
    message: ({ schema: s }) => `must be ${s}`,
    params: ({ schema: s, schemaValue: p }) => typeof s == "string" ? (0, f._)`{type: ${s}}` : (0, f._)`{type: ${p}}`
  };
  function v(s) {
    const p = _(s);
    (0, w.reportError)(p, P);
  }
  ce.reportTypeError = v;
  function _(s) {
    const { gen: p, data: S, schema: n } = s, i = (0, E.schemaRefOrVal)(s, n, "type");
    return {
      gen: p,
      keyword: "type",
      data: S,
      schema: n.type,
      schemaCode: i,
      schemaValue: i,
      parentSchema: n,
      params: {},
      it: s
    };
  }
  return ce;
}
var qe = {}, hr;
function Mn() {
  if (hr) return qe;
  hr = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.assignDefaults = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q();
  function w(E, o) {
    const { properties: d, items: c } = E.schema;
    if (o === "object" && d)
      for (const h in d)
        f(E, h, d[h].default);
    else o === "array" && Array.isArray(c) && c.forEach((h, y) => f(E, y, h.default));
  }
  qe.assignDefaults = w;
  function f(E, o, d) {
    const { gen: c, compositeRule: h, data: y, opts: g } = E;
    if (d === void 0)
      return;
    const N = (0, e._)`${y}${(0, e.getProperty)(o)}`;
    if (h) {
      (0, a.checkStrictMode)(E, `default is ignored for: ${N}`);
      return;
    }
    let I = (0, e._)`${N} === undefined`;
    g.useDefaults === "empty" && (I = (0, e._)`${I} || ${N} === null || ${N} === ""`), c.if(I, (0, e._)`${N} = ${(0, e.stringify)(d)}`);
  }
  return qe;
}
var ve = {}, te = {}, mr;
function _e() {
  if (mr) return te;
  mr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Pe(), f = /* @__PURE__ */ Q();
  function E(s, p) {
    const { gen: S, data: n, it: i } = s;
    S.if(g(S, n, p, i.opts.ownProperties), () => {
      s.setParams({ missingProperty: (0, e._)`${p}` }, !0), s.error();
    });
  }
  te.checkReportMissingProp = E;
  function o({ gen: s, data: p, it: { opts: S } }, n, i) {
    return (0, e.or)(...n.map((l) => (0, e.and)(g(s, p, l, S.ownProperties), (0, e._)`${i} = ${l}`)));
  }
  te.checkMissingProp = o;
  function d(s, p) {
    s.setParams({ missingProperty: p }, !0), s.error();
  }
  te.reportMissingProp = d;
  function c(s) {
    return s.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  te.hasPropFunc = c;
  function h(s, p, S) {
    return (0, e._)`${c(s)}.call(${p}, ${S})`;
  }
  te.isOwnProperty = h;
  function y(s, p, S, n) {
    const i = (0, e._)`${p}${(0, e.getProperty)(S)} !== undefined`;
    return n ? (0, e._)`${i} && ${h(s, p, S)}` : i;
  }
  te.propertyInData = y;
  function g(s, p, S, n) {
    const i = (0, e._)`${p}${(0, e.getProperty)(S)} === undefined`;
    return n ? (0, e.or)(i, (0, e.not)(h(s, p, S))) : i;
  }
  te.noPropertyInData = g;
  function N(s) {
    return s ? Object.keys(s).filter((p) => p !== "__proto__") : [];
  }
  te.allSchemaProperties = N;
  function I(s, p) {
    return N(p).filter((S) => !(0, a.alwaysValidSchema)(s, p[S]));
  }
  te.schemaProperties = I;
  function O({ schemaCode: s, data: p, it: { gen: S, topSchemaRef: n, schemaPath: i, errorPath: l }, it: q }, M, K, D) {
    const L = D ? (0, e._)`${s}, ${p}, ${n}${i}` : p, H = [
      [w.default.instancePath, (0, e.strConcat)(w.default.instancePath, l)],
      [w.default.parentData, q.parentData],
      [w.default.parentDataProperty, q.parentDataProperty],
      [w.default.rootData, w.default.rootData]
    ];
    q.opts.dynamicRef && H.push([w.default.dynamicAnchors, w.default.dynamicAnchors]);
    const x = (0, e._)`${L}, ${S.object(...H)}`;
    return K !== e.nil ? (0, e._)`${M}.call(${K}, ${x})` : (0, e._)`${M}(${x})`;
  }
  te.callValidateCode = O;
  const R = (0, e._)`new RegExp`;
  function P({ gen: s, it: { opts: p } }, S) {
    const n = p.unicodeRegExp ? "u" : "", { regExp: i } = p.code, l = i(S, n);
    return s.scopeValue("pattern", {
      key: l.toString(),
      ref: l,
      code: (0, e._)`${i.code === "new RegExp" ? R : (0, f.useFunc)(s, i)}(${S}, ${n})`
    });
  }
  te.usePattern = P;
  function v(s) {
    const { gen: p, data: S, keyword: n, it: i } = s, l = p.name("valid");
    if (i.allErrors) {
      const M = p.let("valid", !0);
      return q(() => p.assign(M, !1)), M;
    }
    return p.var(l, !0), q(() => p.break()), l;
    function q(M) {
      const K = p.const("len", (0, e._)`${S}.length`);
      p.forRange("i", 0, K, (D) => {
        s.subschema({
          keyword: n,
          dataProp: D,
          dataPropType: a.Type.Num
        }, l), p.if((0, e.not)(l), M);
      });
    }
  }
  te.validateArray = v;
  function _(s) {
    const { gen: p, schema: S, keyword: n, it: i } = s;
    if (!Array.isArray(S))
      throw new Error("ajv implementation error");
    if (S.some((K) => (0, a.alwaysValidSchema)(i, K)) && !i.opts.unevaluated)
      return;
    const q = p.let("valid", !1), M = p.name("_valid");
    p.block(() => S.forEach((K, D) => {
      const L = s.subschema({
        keyword: n,
        schemaProp: D,
        compositeRule: !0
      }, M);
      p.assign(q, (0, e._)`${q} || ${M}`), s.mergeValidEvaluated(L, M) || p.if((0, e.not)(q));
    })), s.result(q, () => s.reset(), () => s.error(!0));
  }
  return te.validateUnion = _, te;
}
var pr;
function Fn() {
  if (pr) return ve;
  pr = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.validateKeywordUsage = ve.validSchemaType = ve.funcKeywordCode = ve.macroKeywordCode = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Pe(), w = /* @__PURE__ */ _e(), f = /* @__PURE__ */ Ot();
  function E(I, O) {
    const { gen: R, keyword: P, schema: v, parentSchema: _, it: s } = I, p = O.macro.call(s.self, v, _, s), S = y(R, P, p);
    s.opts.validateSchema !== !1 && s.self.validateSchema(p, !0);
    const n = R.name("valid");
    I.subschema({
      schema: p,
      schemaPath: e.nil,
      errSchemaPath: `${s.errSchemaPath}/${P}`,
      topSchemaRef: S,
      compositeRule: !0
    }, n), I.pass(n, () => I.error(!0));
  }
  ve.macroKeywordCode = E;
  function o(I, O) {
    var R;
    const { gen: P, keyword: v, schema: _, parentSchema: s, $data: p, it: S } = I;
    h(S, O);
    const n = !p && O.compile ? O.compile.call(S.self, _, s, S) : O.validate, i = y(P, v, n), l = P.let("valid");
    I.block$data(l, q), I.ok((R = O.valid) !== null && R !== void 0 ? R : l);
    function q() {
      if (O.errors === !1)
        D(), O.modifying && d(I), L(() => I.error());
      else {
        const H = O.async ? M() : K();
        O.modifying && d(I), L(() => c(I, H));
      }
    }
    function M() {
      const H = P.let("ruleErrs", null);
      return P.try(() => D((0, e._)`await `), (x) => P.assign(l, !1).if((0, e._)`${x} instanceof ${S.ValidationError}`, () => P.assign(H, (0, e._)`${x}.errors`), () => P.throw(x))), H;
    }
    function K() {
      const H = (0, e._)`${i}.errors`;
      return P.assign(H, null), D(e.nil), H;
    }
    function D(H = O.async ? (0, e._)`await ` : e.nil) {
      const x = S.opts.passContext ? a.default.this : a.default.self, Z = !("compile" in O && !p || O.schema === !1);
      P.assign(l, (0, e._)`${H}${(0, w.callValidateCode)(I, i, x, Z)}`, O.modifying);
    }
    function L(H) {
      var x;
      P.if((0, e.not)((x = O.valid) !== null && x !== void 0 ? x : l), H);
    }
  }
  ve.funcKeywordCode = o;
  function d(I) {
    const { gen: O, data: R, it: P } = I;
    O.if(P.parentData, () => O.assign(R, (0, e._)`${P.parentData}[${P.parentDataProperty}]`));
  }
  function c(I, O) {
    const { gen: R } = I;
    R.if((0, e._)`Array.isArray(${O})`, () => {
      R.assign(a.default.vErrors, (0, e._)`${a.default.vErrors} === null ? ${O} : ${a.default.vErrors}.concat(${O})`).assign(a.default.errors, (0, e._)`${a.default.vErrors}.length`), (0, f.extendErrors)(I);
    }, () => I.error());
  }
  function h({ schemaEnv: I }, O) {
    if (O.async && !I.$async)
      throw new Error("async keyword in sync schema");
  }
  function y(I, O, R) {
    if (R === void 0)
      throw new Error(`keyword "${O}" failed to compile`);
    return I.scopeValue("keyword", typeof R == "function" ? { ref: R } : { ref: R, code: (0, e.stringify)(R) });
  }
  function g(I, O, R = !1) {
    return !O.length || O.some((P) => P === "array" ? Array.isArray(I) : P === "object" ? I && typeof I == "object" && !Array.isArray(I) : typeof I == P || R && typeof I > "u");
  }
  ve.validSchemaType = g;
  function N({ schema: I, opts: O, self: R, errSchemaPath: P }, v, _) {
    if (Array.isArray(v.keyword) ? !v.keyword.includes(_) : v.keyword !== _)
      throw new Error("ajv implementation error");
    const s = v.dependencies;
    if (s?.some((p) => !Object.prototype.hasOwnProperty.call(I, p)))
      throw new Error(`parent schema must have dependencies of ${_}: ${s.join(",")}`);
    if (v.validateSchema && !v.validateSchema(I[_])) {
      const S = `keyword "${_}" value is invalid at path "${P}": ` + R.errorsText(v.validateSchema.errors);
      if (O.validateSchema === "log")
        R.logger.error(S);
      else
        throw new Error(S);
    }
  }
  return ve.validateKeywordUsage = N, ve;
}
var be = {}, yr;
function zn() {
  if (yr) return be;
  yr = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.extendSubschemaMode = be.extendSubschemaData = be.getSubschema = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q();
  function w(o, { keyword: d, schemaProp: c, schema: h, schemaPath: y, errSchemaPath: g, topSchemaRef: N }) {
    if (d !== void 0 && h !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (d !== void 0) {
      const I = o.schema[d];
      return c === void 0 ? {
        schema: I,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(d)}`,
        errSchemaPath: `${o.errSchemaPath}/${d}`
      } : {
        schema: I[c],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(d)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${o.errSchemaPath}/${d}/${(0, a.escapeFragment)(c)}`
      };
    }
    if (h !== void 0) {
      if (y === void 0 || g === void 0 || N === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: h,
        schemaPath: y,
        topSchemaRef: N,
        errSchemaPath: g
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  be.getSubschema = w;
  function f(o, d, { dataProp: c, dataPropType: h, data: y, dataTypes: g, propertyName: N }) {
    if (y !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: I } = d;
    if (c !== void 0) {
      const { errorPath: R, dataPathArr: P, opts: v } = d, _ = I.let("data", (0, e._)`${d.data}${(0, e.getProperty)(c)}`, !0);
      O(_), o.errorPath = (0, e.str)`${R}${(0, a.getErrorPath)(c, h, v.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${c}`, o.dataPathArr = [...P, o.parentDataProperty];
    }
    if (y !== void 0) {
      const R = y instanceof e.Name ? y : I.let("data", y, !0);
      O(R), N !== void 0 && (o.propertyName = N);
    }
    g && (o.dataTypes = g);
    function O(R) {
      o.data = R, o.dataLevel = d.dataLevel + 1, o.dataTypes = [], d.definedProperties = /* @__PURE__ */ new Set(), o.parentData = d.data, o.dataNames = [...d.dataNames, R];
    }
  }
  be.extendSubschemaData = f;
  function E(o, { jtdDiscriminator: d, jtdMetadata: c, compositeRule: h, createErrors: y, allErrors: g }) {
    h !== void 0 && (o.compositeRule = h), y !== void 0 && (o.createErrors = y), g !== void 0 && (o.allErrors = g), o.jtdDiscriminator = d, o.jtdMetadata = c;
  }
  return be.extendSubschemaMode = E, be;
}
var fe = {}, Vt, vr;
function bn() {
  return vr || (vr = 1, Vt = function e(a, w) {
    if (a === w) return !0;
    if (a && w && typeof a == "object" && typeof w == "object") {
      if (a.constructor !== w.constructor) return !1;
      var f, E, o;
      if (Array.isArray(a)) {
        if (f = a.length, f != w.length) return !1;
        for (E = f; E-- !== 0; )
          if (!e(a[E], w[E])) return !1;
        return !0;
      }
      if (a.constructor === RegExp) return a.source === w.source && a.flags === w.flags;
      if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === w.valueOf();
      if (a.toString !== Object.prototype.toString) return a.toString() === w.toString();
      if (o = Object.keys(a), f = o.length, f !== Object.keys(w).length) return !1;
      for (E = f; E-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(w, o[E])) return !1;
      for (E = f; E-- !== 0; ) {
        var d = o[E];
        if (!e(a[d], w[d])) return !1;
      }
      return !0;
    }
    return a !== a && w !== w;
  }), Vt;
}
var Ut = { exports: {} }, _r;
function Vn() {
  if (_r) return Ut.exports;
  _r = 1;
  var e = Ut.exports = function(f, E, o) {
    typeof E == "function" && (o = E, E = {}), o = E.cb || o;
    var d = typeof o == "function" ? o : o.pre || function() {
    }, c = o.post || function() {
    };
    a(E, d, c, f, "", f);
  };
  e.keywords = {
    additionalItems: !0,
    items: !0,
    contains: !0,
    additionalProperties: !0,
    propertyNames: !0,
    not: !0,
    if: !0,
    then: !0,
    else: !0
  }, e.arrayKeywords = {
    items: !0,
    allOf: !0,
    anyOf: !0,
    oneOf: !0
  }, e.propsKeywords = {
    $defs: !0,
    definitions: !0,
    properties: !0,
    patternProperties: !0,
    dependencies: !0
  }, e.skipKeywords = {
    default: !0,
    enum: !0,
    const: !0,
    required: !0,
    maximum: !0,
    minimum: !0,
    exclusiveMaximum: !0,
    exclusiveMinimum: !0,
    multipleOf: !0,
    maxLength: !0,
    minLength: !0,
    pattern: !0,
    format: !0,
    maxItems: !0,
    minItems: !0,
    uniqueItems: !0,
    maxProperties: !0,
    minProperties: !0
  };
  function a(f, E, o, d, c, h, y, g, N, I) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      E(d, c, h, y, g, N, I);
      for (var O in d) {
        var R = d[O];
        if (Array.isArray(R)) {
          if (O in e.arrayKeywords)
            for (var P = 0; P < R.length; P++)
              a(f, E, o, R[P], c + "/" + O + "/" + P, h, c, O, d, P);
        } else if (O in e.propsKeywords) {
          if (R && typeof R == "object")
            for (var v in R)
              a(f, E, o, R[v], c + "/" + O + "/" + w(v), h, c, O, d, v);
        } else (O in e.keywords || f.allKeys && !(O in e.skipKeywords)) && a(f, E, o, R, c + "/" + O, h, c, O, d);
      }
      o(d, c, h, y, g, N, I);
    }
  }
  function w(f) {
    return f.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ut.exports;
}
var gr;
function kt() {
  if (gr) return fe;
  gr = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.getSchemaRefs = fe.resolveUrl = fe.normalizeId = fe._getFullPath = fe.getFullPath = fe.inlineRef = void 0;
  const e = /* @__PURE__ */ Q(), a = bn(), w = Vn(), f = /* @__PURE__ */ new Set([
    "type",
    "format",
    "pattern",
    "maxLength",
    "minLength",
    "maxProperties",
    "minProperties",
    "maxItems",
    "minItems",
    "maximum",
    "minimum",
    "uniqueItems",
    "multipleOf",
    "required",
    "enum",
    "const"
  ]);
  function E(P, v = !0) {
    return typeof P == "boolean" ? !0 : v === !0 ? !d(P) : v ? c(P) <= v : !1;
  }
  fe.inlineRef = E;
  const o = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function d(P) {
    for (const v in P) {
      if (o.has(v))
        return !0;
      const _ = P[v];
      if (Array.isArray(_) && _.some(d) || typeof _ == "object" && d(_))
        return !0;
    }
    return !1;
  }
  function c(P) {
    let v = 0;
    for (const _ in P) {
      if (_ === "$ref")
        return 1 / 0;
      if (v++, !f.has(_) && (typeof P[_] == "object" && (0, e.eachItem)(P[_], (s) => v += c(s)), v === 1 / 0))
        return 1 / 0;
    }
    return v;
  }
  function h(P, v = "", _) {
    _ !== !1 && (v = N(v));
    const s = P.parse(v);
    return y(P, s);
  }
  fe.getFullPath = h;
  function y(P, v) {
    return P.serialize(v).split("#")[0] + "#";
  }
  fe._getFullPath = y;
  const g = /#\/?$/;
  function N(P) {
    return P ? P.replace(g, "") : "";
  }
  fe.normalizeId = N;
  function I(P, v, _) {
    return _ = N(_), P.resolve(v, _);
  }
  fe.resolveUrl = I;
  const O = /^[a-z_][-a-z0-9._]*$/i;
  function R(P, v) {
    if (typeof P == "boolean")
      return {};
    const { schemaId: _, uriResolver: s } = this.opts, p = N(P[_] || v), S = { "": p }, n = h(s, p, !1), i = {}, l = /* @__PURE__ */ new Set();
    return w(P, { allKeys: !0 }, (K, D, L, H) => {
      if (H === void 0)
        return;
      const x = n + D;
      let Z = S[H];
      typeof K[_] == "string" && (Z = ie.call(this, K[_])), oe.call(this, K.$anchor), oe.call(this, K.$dynamicAnchor), S[D] = Z;
      function ie(Y) {
        const ue = this.opts.uriResolver.resolve;
        if (Y = N(Z ? ue(Z, Y) : Y), l.has(Y))
          throw M(Y);
        l.add(Y);
        let z = this.refs[Y];
        return typeof z == "string" && (z = this.refs[z]), typeof z == "object" ? q(K, z.schema, Y) : Y !== N(x) && (Y[0] === "#" ? (q(K, i[Y], Y), i[Y] = K) : this.refs[Y] = x), Y;
      }
      function oe(Y) {
        if (typeof Y == "string") {
          if (!O.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          ie.call(this, `#${Y}`);
        }
      }
    }), i;
    function q(K, D, L) {
      if (D !== void 0 && !a(K, D))
        throw M(L);
    }
    function M(K) {
      return new Error(`reference "${K}" resolves to more than one schema`);
    }
  }
  return fe.getSchemaRefs = R, fe;
}
var $r;
function It() {
  if ($r) return $e;
  $r = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.getData = $e.KeywordCxt = $e.validateFunctionCode = void 0;
  const e = /* @__PURE__ */ Dn(), a = /* @__PURE__ */ Nt(), w = /* @__PURE__ */ wn(), f = /* @__PURE__ */ Nt(), E = /* @__PURE__ */ Mn(), o = /* @__PURE__ */ Fn(), d = /* @__PURE__ */ zn(), c = /* @__PURE__ */ W(), h = /* @__PURE__ */ Pe(), y = /* @__PURE__ */ kt(), g = /* @__PURE__ */ Q(), N = /* @__PURE__ */ Ot();
  function I(k) {
    if (n(k) && (l(k), S(k))) {
      v(k);
      return;
    }
    O(k, () => (0, e.topBoolOrEmptySchema)(k));
  }
  $e.validateFunctionCode = I;
  function O({ gen: k, validateName: C, schema: A, schemaEnv: V, opts: U }, J) {
    U.code.es5 ? k.func(C, (0, c._)`${h.default.data}, ${h.default.valCxt}`, V.$async, () => {
      k.code((0, c._)`"use strict"; ${s(A, U)}`), P(k, U), k.code(J);
    }) : k.func(C, (0, c._)`${h.default.data}, ${R(U)}`, V.$async, () => k.code(s(A, U)).code(J));
  }
  function R(k) {
    return (0, c._)`{${h.default.instancePath}="", ${h.default.parentData}, ${h.default.parentDataProperty}, ${h.default.rootData}=${h.default.data}${k.dynamicRef ? (0, c._)`, ${h.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function P(k, C) {
    k.if(h.default.valCxt, () => {
      k.var(h.default.instancePath, (0, c._)`${h.default.valCxt}.${h.default.instancePath}`), k.var(h.default.parentData, (0, c._)`${h.default.valCxt}.${h.default.parentData}`), k.var(h.default.parentDataProperty, (0, c._)`${h.default.valCxt}.${h.default.parentDataProperty}`), k.var(h.default.rootData, (0, c._)`${h.default.valCxt}.${h.default.rootData}`), C.dynamicRef && k.var(h.default.dynamicAnchors, (0, c._)`${h.default.valCxt}.${h.default.dynamicAnchors}`);
    }, () => {
      k.var(h.default.instancePath, (0, c._)`""`), k.var(h.default.parentData, (0, c._)`undefined`), k.var(h.default.parentDataProperty, (0, c._)`undefined`), k.var(h.default.rootData, h.default.data), C.dynamicRef && k.var(h.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function v(k) {
    const { schema: C, opts: A, gen: V } = k;
    O(k, () => {
      A.$comment && C.$comment && H(k), K(k), V.let(h.default.vErrors, null), V.let(h.default.errors, 0), A.unevaluated && _(k), q(k), x(k);
    });
  }
  function _(k) {
    const { gen: C, validateName: A } = k;
    k.evaluated = C.const("evaluated", (0, c._)`${A}.evaluated`), C.if((0, c._)`${k.evaluated}.dynamicProps`, () => C.assign((0, c._)`${k.evaluated}.props`, (0, c._)`undefined`)), C.if((0, c._)`${k.evaluated}.dynamicItems`, () => C.assign((0, c._)`${k.evaluated}.items`, (0, c._)`undefined`));
  }
  function s(k, C) {
    const A = typeof k == "object" && k[C.schemaId];
    return A && (C.code.source || C.code.process) ? (0, c._)`/*# sourceURL=${A} */` : c.nil;
  }
  function p(k, C) {
    if (n(k) && (l(k), S(k))) {
      i(k, C);
      return;
    }
    (0, e.boolOrEmptySchema)(k, C);
  }
  function S({ schema: k, self: C }) {
    if (typeof k == "boolean")
      return !k;
    for (const A in k)
      if (C.RULES.all[A])
        return !0;
    return !1;
  }
  function n(k) {
    return typeof k.schema != "boolean";
  }
  function i(k, C) {
    const { schema: A, gen: V, opts: U } = k;
    U.$comment && A.$comment && H(k), D(k), L(k);
    const J = V.const("_errs", h.default.errors);
    q(k, J), V.var(C, (0, c._)`${J} === ${h.default.errors}`);
  }
  function l(k) {
    (0, g.checkUnknownRules)(k), M(k);
  }
  function q(k, C) {
    if (k.opts.jtd)
      return ie(k, [], !1, C);
    const A = (0, a.getSchemaTypes)(k.schema), V = (0, a.coerceAndCheckDataType)(k, A);
    ie(k, A, !V, C);
  }
  function M(k) {
    const { schema: C, errSchemaPath: A, opts: V, self: U } = k;
    C.$ref && V.ignoreKeywordsWithRef && (0, g.schemaHasRulesButRef)(C, U.RULES) && U.logger.warn(`$ref: keywords ignored in schema at path "${A}"`);
  }
  function K(k) {
    const { schema: C, opts: A } = k;
    C.default !== void 0 && A.useDefaults && A.strictSchema && (0, g.checkStrictMode)(k, "default is ignored in the schema root");
  }
  function D(k) {
    const C = k.schema[k.opts.schemaId];
    C && (k.baseId = (0, y.resolveUrl)(k.opts.uriResolver, k.baseId, C));
  }
  function L(k) {
    if (k.schema.$async && !k.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function H({ gen: k, schemaEnv: C, schema: A, errSchemaPath: V, opts: U }) {
    const J = A.$comment;
    if (U.$comment === !0)
      k.code((0, c._)`${h.default.self}.logger.log(${J})`);
    else if (typeof U.$comment == "function") {
      const ne = (0, c.str)`${V}/$comment`, re = k.scopeValue("root", { ref: C.root });
      k.code((0, c._)`${h.default.self}.opts.$comment(${J}, ${ne}, ${re}.schema)`);
    }
  }
  function x(k) {
    const { gen: C, schemaEnv: A, validateName: V, ValidationError: U, opts: J } = k;
    A.$async ? C.if((0, c._)`${h.default.errors} === 0`, () => C.return(h.default.data), () => C.throw((0, c._)`new ${U}(${h.default.vErrors})`)) : (C.assign((0, c._)`${V}.errors`, h.default.vErrors), J.unevaluated && Z(k), C.return((0, c._)`${h.default.errors} === 0`));
  }
  function Z({ gen: k, evaluated: C, props: A, items: V }) {
    A instanceof c.Name && k.assign((0, c._)`${C}.props`, A), V instanceof c.Name && k.assign((0, c._)`${C}.items`, V);
  }
  function ie(k, C, A, V) {
    const { gen: U, schema: J, data: ne, allErrors: re, opts: ae, self: ee } = k, { RULES: X } = ee;
    if (J.$ref && (ae.ignoreKeywordsWithRef || !(0, g.schemaHasRulesButRef)(J, X))) {
      U.block(() => T(k, "$ref", X.all.$ref.definition));
      return;
    }
    ae.jtd || Y(k, C), U.block(() => {
      for (const se of X.rules)
        ye(se);
      ye(X.post);
    });
    function ye(se) {
      (0, w.shouldUseGroup)(J, se) && (se.type ? (U.if((0, f.checkDataType)(se.type, ne, ae.strictNumbers)), oe(k, se), C.length === 1 && C[0] === se.type && A && (U.else(), (0, f.reportTypeError)(k)), U.endIf()) : oe(k, se), re || U.if((0, c._)`${h.default.errors} === ${V || 0}`));
    }
  }
  function oe(k, C) {
    const { gen: A, schema: V, opts: { useDefaults: U } } = k;
    U && (0, E.assignDefaults)(k, C.type), A.block(() => {
      for (const J of C.rules)
        (0, w.shouldUseRule)(V, J) && T(k, J.keyword, J.definition, C.type);
    });
  }
  function Y(k, C) {
    k.schemaEnv.meta || !k.opts.strictTypes || (ue(k, C), k.opts.allowUnionTypes || z(k, C), u(k, k.dataTypes));
  }
  function ue(k, C) {
    if (C.length) {
      if (!k.dataTypes.length) {
        k.dataTypes = C;
        return;
      }
      C.forEach((A) => {
        m(k.dataTypes, A) || r(k, `type "${A}" not allowed by context "${k.dataTypes.join(",")}"`);
      }), t(k, C);
    }
  }
  function z(k, C) {
    C.length > 1 && !(C.length === 2 && C.includes("null")) && r(k, "use allowUnionTypes to allow union type keyword");
  }
  function u(k, C) {
    const A = k.self.RULES.all;
    for (const V in A) {
      const U = A[V];
      if (typeof U == "object" && (0, w.shouldUseRule)(k.schema, U)) {
        const { type: J } = U.definition;
        J.length && !J.some((ne) => b(C, ne)) && r(k, `missing type "${J.join(",")}" for keyword "${V}"`);
      }
    }
  }
  function b(k, C) {
    return k.includes(C) || C === "number" && k.includes("integer");
  }
  function m(k, C) {
    return k.includes(C) || C === "integer" && k.includes("number");
  }
  function t(k, C) {
    const A = [];
    for (const V of k.dataTypes)
      m(C, V) ? A.push(V) : C.includes("integer") && V === "number" && A.push("integer");
    k.dataTypes = A;
  }
  function r(k, C) {
    const A = k.schemaEnv.baseId + k.errSchemaPath;
    C += ` at "${A}" (strictTypes)`, (0, g.checkStrictMode)(k, C, k.opts.strictTypes);
  }
  class $ {
    constructor(C, A, V) {
      if ((0, o.validateKeywordUsage)(C, A, V), this.gen = C.gen, this.allErrors = C.allErrors, this.keyword = V, this.data = C.data, this.schema = C.schema[V], this.$data = A.$data && C.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, g.schemaRefOrVal)(C, this.schema, V, this.$data), this.schemaType = A.schemaType, this.parentSchema = C.schema, this.params = {}, this.it = C, this.def = A, this.$data)
        this.schemaCode = C.gen.const("vSchema", G(this.$data, C));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, A.schemaType, A.allowUndefined))
        throw new Error(`${V} value must be ${JSON.stringify(A.schemaType)}`);
      ("code" in A ? A.trackErrors : A.errors !== !1) && (this.errsCount = C.gen.const("_errs", h.default.errors));
    }
    result(C, A, V) {
      this.failResult((0, c.not)(C), A, V);
    }
    failResult(C, A, V) {
      this.gen.if(C), V ? V() : this.error(), A ? (this.gen.else(), A(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(C, A) {
      this.failResult((0, c.not)(C), void 0, A);
    }
    fail(C) {
      if (C === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(C), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(C) {
      if (!this.$data)
        return this.fail(C);
      const { schemaCode: A } = this;
      this.fail((0, c._)`${A} !== undefined && (${(0, c.or)(this.invalid$data(), C)})`);
    }
    error(C, A, V) {
      if (A) {
        this.setParams(A), this._error(C, V), this.setParams({});
        return;
      }
      this._error(C, V);
    }
    _error(C, A) {
      (C ? N.reportExtraError : N.reportError)(this, this.def.error, A);
    }
    $dataError() {
      (0, N.reportError)(this, this.def.$dataError || N.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, N.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(C) {
      this.allErrors || this.gen.if(C);
    }
    setParams(C, A) {
      A ? Object.assign(this.params, C) : this.params = C;
    }
    block$data(C, A, V = c.nil) {
      this.gen.block(() => {
        this.check$data(C, V), A();
      });
    }
    check$data(C = c.nil, A = c.nil) {
      if (!this.$data)
        return;
      const { gen: V, schemaCode: U, schemaType: J, def: ne } = this;
      V.if((0, c.or)((0, c._)`${U} === undefined`, A)), C !== c.nil && V.assign(C, !0), (J.length || ne.validateSchema) && (V.elseIf(this.invalid$data()), this.$dataError(), C !== c.nil && V.assign(C, !1)), V.else();
    }
    invalid$data() {
      const { gen: C, schemaCode: A, schemaType: V, def: U, it: J } = this;
      return (0, c.or)(ne(), re());
      function ne() {
        if (V.length) {
          if (!(A instanceof c.Name))
            throw new Error("ajv implementation error");
          const ae = Array.isArray(V) ? V : [V];
          return (0, c._)`${(0, f.checkDataTypes)(ae, A, J.opts.strictNumbers, f.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function re() {
        if (U.validateSchema) {
          const ae = C.scopeValue("validate$data", { ref: U.validateSchema });
          return (0, c._)`!${ae}(${A})`;
        }
        return c.nil;
      }
    }
    subschema(C, A) {
      const V = (0, d.getSubschema)(this.it, C);
      (0, d.extendSubschemaData)(V, this.it, C), (0, d.extendSubschemaMode)(V, C);
      const U = { ...this.it, ...V, items: void 0, props: void 0 };
      return p(U, A), U;
    }
    mergeEvaluated(C, A) {
      const { it: V, gen: U } = this;
      V.opts.unevaluated && (V.props !== !0 && C.props !== void 0 && (V.props = g.mergeEvaluated.props(U, C.props, V.props, A)), V.items !== !0 && C.items !== void 0 && (V.items = g.mergeEvaluated.items(U, C.items, V.items, A)));
    }
    mergeValidEvaluated(C, A) {
      const { it: V, gen: U } = this;
      if (V.opts.unevaluated && (V.props !== !0 || V.items !== !0))
        return U.if(A, () => this.mergeEvaluated(C, c.Name)), !0;
    }
  }
  $e.KeywordCxt = $;
  function T(k, C, A, V) {
    const U = new $(k, A, C);
    "code" in A ? A.code(U, V) : U.$data && A.validate ? (0, o.funcKeywordCode)(U, A) : "macro" in A ? (0, o.macroKeywordCode)(U, A) : (A.compile || A.validate) && (0, o.funcKeywordCode)(U, A);
  }
  const j = /^\/(?:[^~]|~0|~1)*$/, F = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function G(k, { dataLevel: C, dataNames: A, dataPathArr: V }) {
    let U, J;
    if (k === "")
      return h.default.rootData;
    if (k[0] === "/") {
      if (!j.test(k))
        throw new Error(`Invalid JSON-pointer: ${k}`);
      U = k, J = h.default.rootData;
    } else {
      const ee = F.exec(k);
      if (!ee)
        throw new Error(`Invalid JSON-pointer: ${k}`);
      const X = +ee[1];
      if (U = ee[2], U === "#") {
        if (X >= C)
          throw new Error(ae("property/index", X));
        return V[C - X];
      }
      if (X > C)
        throw new Error(ae("data", X));
      if (J = A[C - X], !U)
        return J;
    }
    let ne = J;
    const re = U.split("/");
    for (const ee of re)
      ee && (J = (0, c._)`${J}${(0, c.getProperty)((0, g.unescapeJsonPointer)(ee))}`, ne = (0, c._)`${ne} && ${J}`);
    return ne;
    function ae(ee, X) {
      return `Cannot access ${ee} ${X} levels up, current level is ${C}`;
    }
  }
  return $e.getData = G, $e;
}
var Ue = {}, wr;
function Bt() {
  if (wr) return Ue;
  wr = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  class e extends Error {
    constructor(w) {
      super("validation failed"), this.errors = w, this.ajv = this.validation = !0;
    }
  }
  return Ue.default = e, Ue;
}
var Le = {}, br;
function jt() {
  if (br) return Le;
  br = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ kt();
  class a extends Error {
    constructor(f, E, o, d) {
      super(d || `can't resolve reference ${o} from id ${E}`), this.missingRef = (0, e.resolveUrl)(f, E, o), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(f, this.missingRef));
    }
  }
  return Le.default = a, Le;
}
var he = {}, Er;
function Wt() {
  if (Er) return he;
  Er = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.resolveSchema = he.getCompilingSchema = he.resolveRef = he.compileSchema = he.SchemaEnv = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Bt(), w = /* @__PURE__ */ Pe(), f = /* @__PURE__ */ kt(), E = /* @__PURE__ */ Q(), o = /* @__PURE__ */ It();
  class d {
    constructor(_) {
      var s;
      this.refs = {}, this.dynamicAnchors = {};
      let p;
      typeof _.schema == "object" && (p = _.schema), this.schema = _.schema, this.schemaId = _.schemaId, this.root = _.root || this, this.baseId = (s = _.baseId) !== null && s !== void 0 ? s : (0, f.normalizeId)(p?.[_.schemaId || "$id"]), this.schemaPath = _.schemaPath, this.localRefs = _.localRefs, this.meta = _.meta, this.$async = p?.$async, this.refs = {};
    }
  }
  he.SchemaEnv = d;
  function c(v) {
    const _ = g.call(this, v);
    if (_)
      return _;
    const s = (0, f.getFullPath)(this.opts.uriResolver, v.root.baseId), { es5: p, lines: S } = this.opts.code, { ownProperties: n } = this.opts, i = new e.CodeGen(this.scope, { es5: p, lines: S, ownProperties: n });
    let l;
    v.$async && (l = i.scopeValue("Error", {
      ref: a.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const q = i.scopeName("validate");
    v.validateName = q;
    const M = {
      gen: i,
      allErrors: this.opts.allErrors,
      data: w.default.data,
      parentData: w.default.parentData,
      parentDataProperty: w.default.parentDataProperty,
      dataNames: [w.default.data],
      dataPathArr: [e.nil],
      // TODO can its length be used as dataLevel if nil is removed?
      dataLevel: 0,
      dataTypes: [],
      definedProperties: /* @__PURE__ */ new Set(),
      topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: v.schema, code: (0, e.stringify)(v.schema) } : { ref: v.schema }),
      validateName: q,
      ValidationError: l,
      schema: v.schema,
      schemaEnv: v,
      rootId: s,
      baseId: v.baseId || s,
      schemaPath: e.nil,
      errSchemaPath: v.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let K;
    try {
      this._compilations.add(v), (0, o.validateFunctionCode)(M), i.optimize(this.opts.code.optimize);
      const D = i.toString();
      K = `${i.scopeRefs(w.default.scope)}return ${D}`, this.opts.code.process && (K = this.opts.code.process(K, v));
      const H = new Function(`${w.default.self}`, `${w.default.scope}`, K)(this, this.scope.get());
      if (this.scope.value(q, { ref: H }), H.errors = null, H.schema = v.schema, H.schemaEnv = v, v.$async && (H.$async = !0), this.opts.code.source === !0 && (H.source = { validateName: q, validateCode: D, scopeValues: i._values }), this.opts.unevaluated) {
        const { props: x, items: Z } = M;
        H.evaluated = {
          props: x instanceof e.Name ? void 0 : x,
          items: Z instanceof e.Name ? void 0 : Z,
          dynamicProps: x instanceof e.Name,
          dynamicItems: Z instanceof e.Name
        }, H.source && (H.source.evaluated = (0, e.stringify)(H.evaluated));
      }
      return v.validate = H, v;
    } catch (D) {
      throw delete v.validate, delete v.validateName, K && this.logger.error("Error compiling schema, function code:", K), D;
    } finally {
      this._compilations.delete(v);
    }
  }
  he.compileSchema = c;
  function h(v, _, s) {
    var p;
    s = (0, f.resolveUrl)(this.opts.uriResolver, _, s);
    const S = v.refs[s];
    if (S)
      return S;
    let n = I.call(this, v, s);
    if (n === void 0) {
      const i = (p = v.localRefs) === null || p === void 0 ? void 0 : p[s], { schemaId: l } = this.opts;
      i && (n = new d({ schema: i, schemaId: l, root: v, baseId: _ }));
    }
    if (n !== void 0)
      return v.refs[s] = y.call(this, n);
  }
  he.resolveRef = h;
  function y(v) {
    return (0, f.inlineRef)(v.schema, this.opts.inlineRefs) ? v.schema : v.validate ? v : c.call(this, v);
  }
  function g(v) {
    for (const _ of this._compilations)
      if (N(_, v))
        return _;
  }
  he.getCompilingSchema = g;
  function N(v, _) {
    return v.schema === _.schema && v.root === _.root && v.baseId === _.baseId;
  }
  function I(v, _) {
    let s;
    for (; typeof (s = this.refs[_]) == "string"; )
      _ = s;
    return s || this.schemas[_] || O.call(this, v, _);
  }
  function O(v, _) {
    const s = this.opts.uriResolver.parse(_), p = (0, f._getFullPath)(this.opts.uriResolver, s);
    let S = (0, f.getFullPath)(this.opts.uriResolver, v.baseId, void 0);
    if (Object.keys(v.schema).length > 0 && p === S)
      return P.call(this, s, v);
    const n = (0, f.normalizeId)(p), i = this.refs[n] || this.schemas[n];
    if (typeof i == "string") {
      const l = O.call(this, v, i);
      return typeof l?.schema != "object" ? void 0 : P.call(this, s, l);
    }
    if (typeof i?.schema == "object") {
      if (i.validate || c.call(this, i), n === (0, f.normalizeId)(_)) {
        const { schema: l } = i, { schemaId: q } = this.opts, M = l[q];
        return M && (S = (0, f.resolveUrl)(this.opts.uriResolver, S, M)), new d({ schema: l, schemaId: q, root: v, baseId: S });
      }
      return P.call(this, s, i);
    }
  }
  he.resolveSchema = O;
  const R = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function P(v, { baseId: _, schema: s, root: p }) {
    var S;
    if (((S = v.fragment) === null || S === void 0 ? void 0 : S[0]) !== "/")
      return;
    for (const l of v.fragment.slice(1).split("/")) {
      if (typeof s == "boolean")
        return;
      const q = s[(0, E.unescapeFragment)(l)];
      if (q === void 0)
        return;
      s = q;
      const M = typeof s == "object" && s[this.opts.schemaId];
      !R.has(l) && M && (_ = (0, f.resolveUrl)(this.opts.uriResolver, _, M));
    }
    let n;
    if (typeof s != "boolean" && s.$ref && !(0, E.schemaHasRulesButRef)(s, this.RULES)) {
      const l = (0, f.resolveUrl)(this.opts.uriResolver, _, s.$ref);
      n = O.call(this, p, l);
    }
    const { schemaId: i } = this.opts;
    if (n = n || new d({ schema: s, schemaId: i, root: p, baseId: _ }), n.schema !== n.root.schema)
      return n;
  }
  return he;
}
const Un = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Ln = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Kn = "object", Hn = ["$data"], xn = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Gn = !1, Jn = {
  $id: Un,
  description: Ln,
  type: Kn,
  required: Hn,
  properties: xn,
  additionalProperties: Gn
};
var Ke = {}, Ae = { exports: {} }, Lt, Sr;
function En() {
  if (Sr) return Lt;
  Sr = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), a = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), w = RegExp.prototype.test.bind(/^\d*$/u), f = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), E = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), o = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u), d = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u), c = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u), h = new Array(256);
  {
    const u = "0123456789ABCDEF";
    for (let b = 0; b < 256; b++)
      h[b] = "%" + u[b >> 4] + u[b & 15];
  }
  function y(u) {
    return u < 2048 ? h[192 | u >> 6] + h[128 | u & 63] : u < 65536 ? h[224 | u >> 12] + h[128 | u >> 6 & 63] + h[128 | u & 63] : h[240 | u >> 18] + h[128 | u >> 12 & 63] + h[128 | u >> 6 & 63] + h[128 | u & 63];
  }
  function g(u) {
    let b = "", m = 0, t = 0;
    for (t = 0; t < u.length; t++)
      if (m = u[t].charCodeAt(0), m !== 48) {
        if (!(m >= 48 && m <= 57 || m >= 65 && m <= 70 || m >= 97 && m <= 102))
          return "";
        b += u[t];
        break;
      }
    for (t += 1; t < u.length; t++) {
      if (m = u[t].charCodeAt(0), !(m >= 48 && m <= 57 || m >= 65 && m <= 70 || m >= 97 && m <= 102))
        return "";
      b += u[t];
    }
    return b;
  }
  const N = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/), I = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/), O = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/), R = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function P(u) {
    if (u.length === 0) return !1;
    for (let b = 0; b < u.length; b++)
      if (!O(u[b])) {
        if (u[b] === "%" && b + 2 < u.length && f(u.slice(b + 1, b + 3))) {
          b += 2;
          continue;
        }
        return !1;
      }
    return !0;
  }
  function v(u) {
    let b = -1, m = 0, t = -1, r = 0;
    for (let j = 0; j < u.length; j++)
      u[j] === "0" ? (t === -1 && (t = j), r++, r > m && (m = r, b = t)) : (t = -1, r = 0);
    if (m < 2) return u.join(":");
    const $ = u.slice(0, b).join(":"), T = u.slice(b + m).join(":");
    return $ + "::" + T;
  }
  function _(u) {
    const b = u.indexOf("::");
    if (b !== -1 && u.indexOf("::", b + 1) !== -1) return;
    const m = b === -1 ? u.split(":") : u.slice(0, b).split(":"), t = b === -1 ? [] : u.slice(b + 2).split(":");
    b !== -1 && (m.length === 1 && m[0] === "" && (m.length = 0), t.length === 1 && t[0] === "" && (t.length = 0));
    const r = m.concat(t);
    let $ = 0;
    for (let j = 0; j < r.length; j++) {
      const F = r[j];
      if (F === "") return;
      if (F.indexOf(".") !== -1) {
        if (j !== r.length - 1 || b !== -1 && t.length === 0 || !a(F)) return;
        $ += 2;
        continue;
      }
      if (!N(F)) return;
      r[j] = parseInt(F, 16).toString(16), $++;
    }
    if (b === -1)
      return $ !== 8 ? void 0 : v(r);
    if ($ >= 8) return;
    const T = r.slice(0, m.length);
    for (let j = $; j < 8; j++) T.push("0");
    for (let j = m.length; j < r.length; j++) T.push(r[j]);
    return v(T);
  }
  function s(u) {
    const b = u[0] === "[" && u[u.length - 1] === "]";
    if ((u[0] === "[" || u[u.length - 1] === "]") && !b) return { host: u, isIPV6: !1, error: !0 };
    let t = b ? u.slice(1, -1) : u;
    if (b && I(t))
      return t = t.toLowerCase(), { host: `[${t}]`, escapedHost: t, isIPV6: !1, isIPVFuture: !0 };
    if (p(t, ":") < 2)
      return { host: u, isIPV6: !1, error: b };
    let r = "";
    const $ = t.indexOf("%");
    if ($ !== -1) {
      const j = t.slice($, $ + 3).toLowerCase() === "%25" ? 3 : 1;
      if (r = t.slice($ + j), !P(r)) return { host: u, isIPV6: !1, error: !0 };
      t = t.slice(0, $);
    }
    const T = _(t);
    return T === void 0 ? { host: u, isIPV6: !1, error: !0 } : {
      host: T + (r ? "%" + r : ""),
      escapedHost: T + (r ? "%25" + r : ""),
      isIPV6: !0
    };
  }
  function p(u, b) {
    let m = 0;
    for (let t = 0; t < u.length; t++)
      u[t] === b && m++;
    return m;
  }
  function S(u) {
    let b = u;
    const m = [];
    let t = -1, r = 0;
    for (; r = b.length; ) {
      if (r === 1) {
        if (b === ".")
          break;
        if (b === "/") {
          m.push("/");
          break;
        } else {
          m.push(b);
          break;
        }
      } else if (r === 2) {
        if (b[0] === ".") {
          if (b[1] === ".")
            break;
          if (b[1] === "/") {
            b = b.slice(2);
            continue;
          }
        } else if (b[0] === "/" && (b[1] === "." || b[1] === "/")) {
          m.push("/");
          break;
        }
      } else if (r === 3 && b === "/..") {
        m.length !== 0 && m.pop(), m.push("/");
        break;
      }
      if (b[0] === ".") {
        if (b[1] === ".") {
          if (b[2] === "/") {
            b = b.slice(3);
            continue;
          }
        } else if (b[1] === "/") {
          b = b.slice(2);
          continue;
        }
      } else if (b[0] === "/" && b[1] === ".") {
        if (b[2] === "/") {
          b = b.slice(2);
          continue;
        } else if (b[2] === "." && b[3] === "/") {
          b = b.slice(3), m.length !== 0 && m.pop();
          continue;
        }
      }
      if ((t = b.indexOf("/", 1)) === -1) {
        m.push(b);
        break;
      } else
        m.push(b.slice(0, t)), b = b.slice(t);
    }
    return m.join("");
  }
  function n(u) {
    if (u === "" || u[0] === "/")
      return S(u);
    const b = u.split("/"), m = b.length - 1, t = [];
    let r = !1;
    for (let $ = 0; $ <= m; $++) {
      const T = b[$];
      T === "." || T === ".." ? (T === ".." && (t.length !== 0 && t[t.length - 1] !== ".." ? t.pop() : t.push("..")), r = $ === m) : t.push(T);
    }
    return r && t[t.length - 1] !== ".." && t.push(""), (t.length === 0 || t[0] === "" || t[0].includes(":")) && t.unshift("."), t.join("/");
  }
  const i = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, l = /[@/?#:]/g, q = /[@/?#]/g;
  function M(u, b) {
    const m = b ? q : l;
    return m.lastIndex = 0, u.replace(m, (t) => i[t]);
  }
  function K(u, b = !1) {
    if (u.indexOf("%") === -1)
      return u;
    let m = "";
    for (let t = 0; t < u.length; t++) {
      if (u[t] === "%" && t + 2 < u.length) {
        const r = u.slice(t + 1, t + 3);
        if (f(r)) {
          const $ = r.toUpperCase(), T = String.fromCharCode(parseInt($, 16));
          b && E(T) ? m += T : m += "%" + $, t += 2;
          continue;
        }
      }
      m += u[t];
    }
    return m;
  }
  function D(u) {
    let b = "";
    for (let m = 0; m < u.length; m++) {
      const t = u[m];
      if (t === "%" && m + 2 < u.length) {
        const r = u.slice(m + 1, m + 3);
        if (f(r)) {
          const $ = r.toUpperCase(), T = String.fromCharCode(parseInt($, 16));
          T !== "." && E(T) ? b += T : b += "%" + $, m += 2;
          continue;
        }
      }
      if (o(t))
        b += t;
      else {
        const r = u.charCodeAt(m);
        if (r < 128)
          b += oe(r) ? t : h[r];
        else if (r < 55296 || r > 57343)
          b += y(r);
        else if (r <= 56319 && m + 1 < u.length) {
          const $ = u.charCodeAt(m + 1);
          $ >= 56320 && $ <= 57343 ? (b += y(65536 + (r - 55296 << 10) + ($ - 56320)), m++) : b += y(65533);
        } else
          b += y(65533);
      }
    }
    return b;
  }
  function L(u, b = !1) {
    let m = "", t = b && u[0] !== "/";
    for (let r = 0; r < u.length; r++) {
      const $ = u[r];
      if ($ === "%" && r + 2 < u.length) {
        const T = u.slice(r + 1, r + 3);
        if (f(T)) {
          m += "%" + T.toUpperCase(), r += 2;
          continue;
        }
      }
      if ($ === "/" && (t = !1), o($) && ($ !== ":" || !t))
        m += $;
      else {
        const T = u.charCodeAt(r);
        if (T < 128)
          m += h[T];
        else if (T < 55296 || T > 57343)
          m += y(T);
        else if (T <= 56319 && r + 1 < u.length) {
          const j = u.charCodeAt(r + 1);
          j >= 56320 && j <= 57343 ? (m += y(65536 + (T - 55296 << 10) + (j - 56320)), r++) : m += y(65533);
        } else
          m += y(65533);
      }
    }
    return m;
  }
  function H(u, b) {
    let m = "";
    for (let t = 0; t < u.length; t++) {
      const r = u[t];
      if (r === "%" && t + 2 < u.length) {
        const $ = u.slice(t + 1, t + 3);
        if (f($)) {
          m += "%" + $.toUpperCase(), t += 2;
          continue;
        }
      }
      if (b(r))
        m += r;
      else {
        const $ = u.charCodeAt(t);
        if ($ < 128)
          m += h[$];
        else if ($ < 55296 || $ > 57343)
          m += y($);
        else if ($ <= 56319 && t + 1 < u.length) {
          const T = u.charCodeAt(t + 1);
          T >= 56320 && T <= 57343 ? (m += y(65536 + ($ - 55296 << 10) + (T - 56320)), t++) : m += y(65533);
        } else
          m += y(65533);
      }
    }
    return m;
  }
  function x(u) {
    return H(u, c);
  }
  function Z(u) {
    return H(u, d);
  }
  function ie(u) {
    return H(u, d);
  }
  function oe(u) {
    return u >= 48 && u <= 57 || u >= 65 && u <= 90 || u >= 97 && u <= 122 || u === 42 || u === 43 || u === 45 || u === 46 || u === 47 || u === 64 || u === 95;
  }
  function Y(u) {
    let b = "";
    for (let m = 0; m < u.length; m++) {
      const t = u[m];
      if (t === "%" && m + 2 < u.length) {
        const r = u.slice(m + 1, m + 3);
        if (f(r)) {
          const $ = r.toUpperCase(), T = String.fromCharCode(parseInt($, 16));
          E(T) ? b += T : b += "%" + $, m += 2;
          continue;
        }
      }
      if (d(t))
        b += t;
      else {
        const r = u.charCodeAt(m);
        if (r < 128)
          b += oe(r) ? t : h[r];
        else if (r < 55296 || r > 57343)
          b += y(r);
        else if (r <= 56319 && m + 1 < u.length) {
          const $ = u.charCodeAt(m + 1);
          $ >= 56320 && $ <= 57343 ? (b += y(65536 + (r - 55296 << 10) + ($ - 56320)), m++) : b += y(65533);
        } else
          b += y(65533);
      }
    }
    return b;
  }
  function ue(u) {
    let b = "";
    for (let m = 0; m < u.length; m++) {
      if (u[m] === "%" && m + 2 < u.length) {
        const t = u.slice(m + 1, m + 3);
        if (f(t)) {
          b += "%" + t.toUpperCase(), m += 2;
          continue;
        }
      }
      b += escape(u[m]);
    }
    return b;
  }
  function z(u) {
    const b = [];
    if (u.userinfo !== void 0 && (b.push(x(u.userinfo)), b.push("@")), u.host !== void 0) {
      let m = u.host;
      if (!a(m)) {
        let t = s(m);
        t.isIPV6 !== !0 && t.isIPVFuture !== !0 && (m = K(m, !0), t = s(m)), t.isIPV6 === !0 || t.isIPVFuture === !0 ? m = `[${t.escapedHost}]` : m = M(m, !1);
      }
      b.push(m);
    }
    if (typeof u.port == "number" || typeof u.port == "string") {
      const m = String(u.port);
      if (!w(m))
        throw new TypeError("URI port is malformed.");
      b.push(":"), b.push(m);
    }
    return b.length ? b.join("") : void 0;
  }
  return Lt = {
    nonSimpleDomain: R,
    recomposeAuthority: z,
    reescapeHostDelimiters: M,
    normalizePercentEncoding: K,
    normalizePathEncoding: D,
    serializePathEncoding: L,
    normalizeQueryFragmentEncoding: Y,
    encodeUserinfo: x,
    encodeQuery: Z,
    encodeFragment: ie,
    escapePreservingEscapes: ue,
    removeDotSegments: S,
    removeDotSegmentsRelative: n,
    isIPv4: a,
    isUUID: e,
    normalizeIPv6: s,
    stringArrayToHexStripped: g
  }, Lt;
}
var Kt, Pr;
function Bn() {
  if (Pr) return Kt;
  Pr = 1;
  const { isUUID: e } = En(), a = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu, w = (
    /** @type {const} */
    [
      "http",
      "https",
      "ws",
      "wss",
      "urn",
      "urn:uuid"
    ]
  );
  function f(n) {
    return w.indexOf(
      /** @type {*} */
      n
    ) !== -1;
  }
  function E(n) {
    return n.secure === !0 ? !0 : n.secure === !1 ? !1 : n.scheme ? n.scheme.length === 3 && (n.scheme[0] === "w" || n.scheme[0] === "W") && (n.scheme[1] === "s" || n.scheme[1] === "S") && (n.scheme[2] === "s" || n.scheme[2] === "S") : !1;
  }
  function o(n) {
    return n.host || (n.error = n.error || "HTTP URIs must have a host."), n;
  }
  function d(n) {
    const i = String(n.scheme).toLowerCase() === "https";
    return (n.port === (i ? 443 : 80) || n.port === "") && (n.port = void 0), n.path || (n.path = "/"), n;
  }
  function c(n) {
    return n.secure = E(n), n.resourceName = (n.path || "/") + (n.query ? "?" + n.query : ""), n.path = void 0, n.query = void 0, n;
  }
  function h(n) {
    if ((n.port === (E(n) ? 443 : 80) || n.port === "") && (n.port = void 0), typeof n.secure == "boolean" && (n.scheme = n.secure ? "wss" : "ws", n.secure = void 0), n.resourceName) {
      const i = n.resourceName.indexOf("?"), l = i === -1 ? n.resourceName : n.resourceName.slice(0, i);
      n.path = l && l !== "/" ? l : void 0, n.query = i === -1 ? void 0 : n.resourceName.slice(i + 1), n.resourceName = void 0;
    }
    return n.fragment = void 0, n;
  }
  function y(n, i) {
    if (!n.path)
      return n.error = "URN can not be parsed", n;
    const l = n.path.match(a);
    if (l && l[0] === n.path) {
      const q = i.scheme || n.scheme || "urn";
      n.nid = l[1].toLowerCase(), n.nss = l[2];
      const M = `${q}:${i.nid || n.nid}`, K = S(M);
      n.path = void 0, K && (n = K.parse(n, i));
    } else
      n.error = n.error || "URN can not be parsed.";
    return n;
  }
  function g(n, i) {
    if (n.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const l = i.scheme || n.scheme || "urn", q = n.nid.toLowerCase(), M = `${l}:${i.nid || q}`, K = S(M);
    K && (n = K.serialize(n, i));
    const D = n, L = n.nss;
    return D.path = `${q || i.nid}:${L}`, i.skipEscape = !0, D;
  }
  function N(n, i) {
    const l = n;
    return l.uuid = l.nss, l.nss = void 0, !i.tolerant && (!l.uuid || !e(l.uuid)) && (l.error = l.error || "UUID is not valid."), l;
  }
  function I(n) {
    const i = n;
    return i.nss = (n.uuid || "").toLowerCase(), i;
  }
  const O = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: o,
      serialize: d
    }
  ), R = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: O.domainHost,
      parse: o,
      serialize: d
    }
  ), P = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: c,
      serialize: h
    }
  ), v = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: P.domainHost,
      parse: P.parse,
      serialize: P.serialize
    }
  ), p = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: O,
      https: R,
      ws: P,
      wss: v,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: y,
          serialize: g,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: N,
          serialize: I,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(p, null);
  function S(n) {
    return n && (p[
      /** @type {SchemeName} */
      n
    ] || p[
      /** @type {SchemeName} */
      n.toLowerCase()
    ]) || void 0;
  }
  return Kt = {
    wsIsSecure: E,
    SCHEMES: p,
    isValidSchemeName: f,
    getSchemeHandler: S
  }, Kt;
}
var Rr;
function Wn() {
  if (Rr) return Ae.exports;
  Rr = 1;
  const { normalizeIPv6: e, removeDotSegments: a, removeDotSegmentsRelative: w, recomposeAuthority: f, normalizePercentEncoding: E, normalizePathEncoding: o, serializePathEncoding: d, normalizeQueryFragmentEncoding: c, encodeQuery: h, encodeFragment: y, reescapeHostDelimiters: g, isIPv4: N, nonSimpleDomain: I } = En(), { SCHEMES: O, getSchemeHandler: R } = Bn(), P = /^[A-Za-z][A-Za-z0-9+.-]*$/u, v = "URI scheme is malformed.", _ = "URI host is malformed.", s = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
  function p(r) {
    const $ = String(r);
    if (!P.test($))
      throw new TypeError(v);
    return $;
  }
  function S(r, $) {
    return typeof r == "string" ? r = /** @type {T} */
    u(r, $) : typeof r == "object" && (r = /** @type {T} */
    z(q(r, $), $)), r;
  }
  function n(r, $, T) {
    const j = T ? Object.assign({ scheme: "null" }, T) : { scheme: "null" }, {
      parsed: F,
      malformedAuthorityOrPort: G,
      malformedPercentEncoding: k,
      malformedSchemeSpecific: C,
      malformedHost: A,
      malformedScheme: V
    } = ue(r, j), {
      parsed: U,
      malformedAuthorityOrPort: J,
      malformedPercentEncoding: ne,
      malformedSchemeSpecific: re,
      malformedHost: ae,
      malformedScheme: ee
    } = ue($, j);
    if (G || J || k || ne || C || re || A || ae || V || ee)
      throw new Error(F.error || U.error || "URI is malformed.");
    const X = i(F, U, j, !0), ye = R(T && T.scheme || X.scheme), se = X.host, pe = se !== void 0 && se !== "" && (N(se) || e(se).isIPV6);
    if (oe(X, T || {}, ye, pe))
      throw new Error(_);
    ie(X, T || {}, ye, pe);
    const je = se && se.indexOf("%") !== -1 && !/\P{ASCII}/u.test(se);
    if (X.error && !je)
      throw new Error(X.error);
    return j.skipEscape = !0, q(X, j);
  }
  function i(r, $, T, j) {
    const F = {};
    if (j || (r = z(q(r, T), T), $ = z(q($, T), T)), T = T || {}, !T.tolerant && $.scheme)
      F.scheme = $.scheme, F.userinfo = $.userinfo, F.host = $.host, F.port = $.port, F.path = a($.path || ""), F.query = $.query;
    else {
      if ($.userinfo !== void 0 || $.host !== void 0 || $.port !== void 0)
        F.userinfo = $.userinfo, F.host = $.host, F.port = $.port, F.path = a($.path || ""), F.query = $.query;
      else {
        if (!$.path)
          F.path = r.path, $.query !== void 0 ? F.query = $.query : F.query = r.query;
        else {
          if ($.path[0] === "/")
            F.path = a($.path);
          else {
            const G = r.userinfo !== void 0 || r.host !== void 0 || r.port !== void 0;
            G && !r.path ? F.path = "/" + $.path : r.path ? F.path = r.path.slice(0, r.path.lastIndexOf("/") + 1) + $.path : F.path = $.path, F.path = r.scheme === void 0 && !G && F.path[0] !== "/" ? w(F.path) : a(F.path);
          }
          F.query = $.query;
        }
        F.userinfo = r.userinfo, F.host = r.host, F.port = r.port;
      }
      F.scheme = r.scheme;
    }
    return F.fragment = $.fragment, F;
  }
  function l(r, $, T) {
    const j = m(r, T), F = m($, T);
    return j !== void 0 && F !== void 0 && j === F;
  }
  function q(r, $) {
    const T = {
      host: r.host,
      scheme: r.scheme,
      userinfo: r.userinfo,
      port: r.port,
      path: r.path,
      query: r.query,
      nid: r.nid,
      nss: r.nss,
      uuid: r.uuid,
      fragment: r.fragment,
      reference: r.reference,
      resourceName: r.resourceName,
      secure: r.secure,
      error: ""
    }, j = Object.assign({}, $), F = [];
    T.scheme && (T.scheme = p(T.scheme));
    const G = R(j.scheme || T.scheme);
    G && G.serialize && G.serialize(T, j);
    const k = T.userinfo !== void 0 || T.host !== void 0 || T.port !== void 0, C = (T.scheme === void 0 || j.reference === "suffix") && !k, A = !j.skipEscape && C;
    T.path !== void 0 && (j.skipEscape ? T.path = E(T.path) : T.path = d(T.path, A)), j.reference !== "suffix" && T.scheme && (T.scheme = p(T.scheme), F.push(T.scheme, ":"));
    const V = f(T);
    if (V !== void 0 && (j.reference !== "suffix" && F.push("//"), F.push(V), T.path && T.path[0] !== "/" && F.push("/")), T.path !== void 0) {
      let U = T.path;
      !j.absolutePath && (!G || !G.absolutePath) && (U = C && U[0] !== "/" ? w(U) : a(U)), C && (U = d(U, !0)), V === void 0 && U[0] === "/" && U[1] === "/" && (U = "/%2F" + U.slice(2)), F.push(U);
    }
    return T.query !== void 0 && F.push("?", h(T.query)), T.fragment !== void 0 && F.push("#", y(T.fragment)), F.join("");
  }
  const M = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u, K = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/, D = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
  function L(r, $) {
    if ($[2] !== void 0 && r.path && r.path[0] !== "/")
      return 'URI path must start with "/" when authority is present.';
    if (typeof r.port == "number" && (r.port < 0 || r.port > 65535))
      return "URI port is malformed.";
  }
  function H(r) {
    if (r === void 0) return !1;
    let $ = r.indexOf("%");
    for (; $ !== -1; ) {
      if ($ + 2 >= r.length || !/^[\da-f]{2}$/iu.test(r.slice($ + 1, $ + 3)))
        return !0;
      $ = r.indexOf("%", $ + 3);
    }
    return !1;
  }
  function x(r) {
    return r[0] === "[" && r[r.length - 1] === "]";
  }
  function Z(r) {
    const $ = r[4];
    return H(r[3]) || $ !== void 0 && !x($) && H($) || H(r[6]) || H(r[7]) || H(r[8]);
  }
  function ie(r, $, T, j) {
    if (oe(r, $, T, j))
      return r.error = r.error || _, !0;
    if (!$.unicodeSupport && (!T || !T.unicodeSupport) && r.host && !x(r.host) && ($.domainHost || T && T.domainHost) && j === !1 && I(r.host)) {
      let F;
      try {
        F = new URL("http://" + r.host);
      } catch (G) {
        return r.error = r.error || "Host's domain name can not be converted to ASCII: " + G, !0;
      }
      if (!Y(F))
        return r.error = r.error || _, !0;
      r.host = F.hostname;
    }
    return !1;
  }
  function oe(r, $, T, j) {
    return !!(r.host && j === !1 && !x(r.host) && ($.domainHost || T && T.domainHost) && s.test(r.host));
  }
  function Y(r) {
    return r.username === "" && r.password === "" && r.port === "" && r.pathname === "/" && r.search === "" && r.hash === "" && r.hostname !== "";
  }
  function ue(r, $) {
    const T = Object.assign({}, $), j = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let F = !1, G = !1, k = !1, C = !1, A = !1, V = !1, U = !1;
    T.reference === "suffix" && (T.scheme ? r = T.scheme + ":" + r : r = "//" + r);
    const J = r.match(K);
    J !== null && J[1].indexOf("\\") !== -1 && (j.error = "URI authority must not contain a literal backslash.", F = !0);
    const ne = r.match(D);
    if (ne !== null) {
      const ae = ne[1], ee = ae.replace(/[\t\n\r]/g, "");
      ee.length >= 2 && (ee.slice(0, 2) !== "//" ? (j.error = j.error || "URI authority must not contain a literal backslash.", F = !0) : ae.length !== ee.length && (j.error = j.error || "URI authority introducer must not contain whitespace.", F = !0));
    }
    const re = r.match(M);
    if (re) {
      j.scheme = re[1], j.userinfo = re[3], j.host = re[4], j.port = parseInt(re[5], 10), j.path = re[6] || "", j.query = re[7], j.fragment = re[8], j.scheme !== void 0 && (P.test(j.scheme) ? j.scheme = j.scheme.toLowerCase() : (j.error = j.error || v, V = !0)), G = Z(re), G && (j.error = j.error || "URI contains malformed percent-encoding."), isNaN(j.port) && (j.port = re[5]);
      const ae = L(j, re);
      if (ae !== void 0 && (j.error = j.error || ae, F = !0), j.host)
        if (N(j.host) === !1) {
          const ye = x(j.host), se = j.host.indexOf("[") !== -1 || j.host.indexOf("]") !== -1, pe = e(j.host);
          U = pe.isIPV6 || pe.isIPVFuture === !0, A = se && (!ye || pe.error === !0), j.host = U ? pe.host : pe.host.toLowerCase(), A && (j.error = j.error || _, F = !0);
        } else
          U = !0;
      j.scheme === void 0 && j.userinfo === void 0 && j.host === void 0 && j.port === void 0 && j.query === void 0 && !j.path ? j.reference = "same-document" : j.scheme === void 0 ? j.reference = "relative" : j.fragment === void 0 ? j.reference = "absolute" : j.reference = "uri", T.reference && T.reference !== "suffix" && T.reference !== j.reference && (j.error = j.error || "URI is not a " + T.reference + " reference.");
      const ee = R(T.scheme || j.scheme);
      if (A || (C = ie(j, T, ee, U)), r.indexOf("%") !== -1 && j.host !== void 0 && !A) {
        let X = U ? j.host : E(j.host, !0);
        U || (X = E(X.toLowerCase())), j.host = U || T.scheme !== "null" ? g(X, U) : X;
      }
      (!ee || ee && !ee.skipNormalize) && (j.path && (j.path = o(j.path)), j.query && (j.query = c(j.query)), j.fragment && (j.fragment = c(j.fragment))), ee && ee.parse && (ee.parse(j, T), ee === O.urn && j.nid === void 0 && (k = !0));
    } else
      j.error = j.error || "URI can not be parsed.";
    return { parsed: j, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: k, malformedHost: C, malformedScheme: V };
  }
  function z(r, $) {
    return ue(r, $).parsed;
  }
  function u(r, $) {
    return b(r, $).normalized;
  }
  function b(r, $) {
    const { parsed: T, malformedAuthorityOrPort: j, malformedPercentEncoding: F, malformedSchemeSpecific: G, malformedHost: k, malformedScheme: C } = ue(r, $);
    return {
      normalized: j || F || G || k || C ? r : q(T, $),
      malformedAuthorityOrPort: j,
      malformedPercentEncoding: F,
      malformedSchemeSpecific: G,
      malformedHost: k,
      malformedScheme: C
    };
  }
  function m(r, $) {
    if (typeof r != "string" && typeof r != "object")
      return;
    let T;
    try {
      T = typeof r == "string" ? r : q(r, $);
    } catch {
      return;
    }
    const { normalized: j, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: k, malformedHost: C, malformedScheme: A } = b(T, $);
    return F || G || k || C || A ? void 0 : j;
  }
  const t = {
    SCHEMES: O,
    normalize: S,
    resolve: n,
    resolveComponent: i,
    equal: l,
    serialize: q,
    parse: z
  };
  return Ae.exports = t, Ae.exports.default = t, Ae.exports.fastUri = t, Ae.exports;
}
var Nr;
function Zn() {
  if (Nr) return Ke;
  Nr = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const e = Wn();
  return e.code = 'require("ajv/dist/runtime/uri").default', Ke.default = e, Ke;
}
var Or;
function Qn() {
  return Or || (Or = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var a = /* @__PURE__ */ It();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return a.KeywordCxt;
    } });
    var w = /* @__PURE__ */ W();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return w._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return w.str;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return w.stringify;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return w.nil;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return w.Name;
    } }), Object.defineProperty(e, "CodeGen", { enumerable: !0, get: function() {
      return w.CodeGen;
    } });
    const f = /* @__PURE__ */ Bt(), E = /* @__PURE__ */ jt(), o = /* @__PURE__ */ $n(), d = /* @__PURE__ */ Wt(), c = /* @__PURE__ */ W(), h = /* @__PURE__ */ kt(), y = /* @__PURE__ */ Nt(), g = /* @__PURE__ */ Q(), N = Jn, I = /* @__PURE__ */ Zn(), O = (z, u) => new RegExp(z, u);
    O.code = "new RegExp";
    const R = ["removeAdditional", "useDefaults", "coerceTypes"], P = /* @__PURE__ */ new Set([
      "validate",
      "serialize",
      "parse",
      "wrapper",
      "root",
      "schema",
      "keyword",
      "pattern",
      "formats",
      "validate$data",
      "func",
      "obj",
      "Error"
    ]), v = {
      errorDataPath: "",
      format: "`validateFormats: false` can be used instead.",
      nullable: '"nullable" keyword is supported by default.',
      jsonPointers: "Deprecated jsPropertySyntax can be used instead.",
      extendRefs: "Deprecated ignoreKeywordsWithRef can be used instead.",
      missingRefs: "Pass empty schema with $id that should be ignored to ajv.addSchema.",
      processCode: "Use option `code: {process: (code, schemaEnv: object) => string}`",
      sourceCode: "Use option `code: {source: true}`",
      strictDefaults: "It is default now, see option `strict`.",
      strictKeywords: "It is default now, see option `strict`.",
      uniqueItems: '"uniqueItems" keyword is always validated.',
      unknownFormats: "Disable strict mode or pass `true` to `ajv.addFormat` (or `formats` option).",
      cache: "Map is used as cache, schema object as key.",
      serialize: "Map is used as cache, schema object as key.",
      ajvErrors: "It is default now."
    }, _ = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, s = 200;
    function p(z) {
      var u, b, m, t, r, $, T, j, F, G, k, C, A, V, U, J, ne, re, ae, ee, X, ye, se, pe, je;
      const Te = z.strict, Tt = (u = z.code) === null || u === void 0 ? void 0 : u.optimize, Qt = Tt === !0 || Tt === void 0 ? 1 : Tt || 0, Yt = (m = (b = z.code) === null || b === void 0 ? void 0 : b.regExp) !== null && m !== void 0 ? m : O, On = (t = z.uriResolver) !== null && t !== void 0 ? t : I.default;
      return {
        strictSchema: ($ = (r = z.strictSchema) !== null && r !== void 0 ? r : Te) !== null && $ !== void 0 ? $ : !0,
        strictNumbers: (j = (T = z.strictNumbers) !== null && T !== void 0 ? T : Te) !== null && j !== void 0 ? j : !0,
        strictTypes: (G = (F = z.strictTypes) !== null && F !== void 0 ? F : Te) !== null && G !== void 0 ? G : "log",
        strictTuples: (C = (k = z.strictTuples) !== null && k !== void 0 ? k : Te) !== null && C !== void 0 ? C : "log",
        strictRequired: (V = (A = z.strictRequired) !== null && A !== void 0 ? A : Te) !== null && V !== void 0 ? V : !1,
        code: z.code ? { ...z.code, optimize: Qt, regExp: Yt } : { optimize: Qt, regExp: Yt },
        loopRequired: (U = z.loopRequired) !== null && U !== void 0 ? U : s,
        loopEnum: (J = z.loopEnum) !== null && J !== void 0 ? J : s,
        meta: (ne = z.meta) !== null && ne !== void 0 ? ne : !0,
        messages: (re = z.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (ae = z.inlineRefs) !== null && ae !== void 0 ? ae : !0,
        schemaId: (ee = z.schemaId) !== null && ee !== void 0 ? ee : "$id",
        addUsedSchema: (X = z.addUsedSchema) !== null && X !== void 0 ? X : !0,
        validateSchema: (ye = z.validateSchema) !== null && ye !== void 0 ? ye : !0,
        validateFormats: (se = z.validateFormats) !== null && se !== void 0 ? se : !0,
        unicodeRegExp: (pe = z.unicodeRegExp) !== null && pe !== void 0 ? pe : !0,
        int32range: (je = z.int32range) !== null && je !== void 0 ? je : !0,
        uriResolver: On
      };
    }
    class S {
      constructor(u = {}) {
        this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), u = this.opts = { ...u, ...p(u) };
        const { es5: b, lines: m } = this.opts.code;
        this.scope = new c.ValueScope({ scope: {}, prefixes: P, es5: b, lines: m }), this.logger = L(u.logger);
        const t = u.validateFormats;
        u.validateFormats = !1, this.RULES = (0, o.getRules)(), n.call(this, v, u, "NOT SUPPORTED"), n.call(this, _, u, "DEPRECATED", "warn"), this._metaOpts = K.call(this), u.formats && q.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), u.keywords && M.call(this, u.keywords), typeof u.meta == "object" && this.addMetaSchema(u.meta), l.call(this), u.validateFormats = t;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: u, meta: b, schemaId: m } = this.opts;
        let t = N;
        m === "id" && (t = { ...N }, t.id = t.$id, delete t.$id), b && u && this.addMetaSchema(t, t[m], !1);
      }
      defaultMeta() {
        const { meta: u, schemaId: b } = this.opts;
        return this.opts.defaultMeta = typeof u == "object" ? u[b] || u : void 0;
      }
      validate(u, b) {
        let m;
        if (typeof u == "string") {
          if (m = this.getSchema(u), !m)
            throw new Error(`no schema with key or ref "${u}"`);
        } else
          m = this.compile(u);
        const t = m(b);
        return "$async" in m || (this.errors = m.errors), t;
      }
      compile(u, b) {
        const m = this._addSchema(u, b);
        return m.validate || this._compileSchemaEnv(m);
      }
      compileAsync(u, b) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: m } = this.opts;
        return t.call(this, u, b);
        async function t(G, k) {
          await r.call(this, G.$schema);
          const C = this._addSchema(G, k);
          return C.validate || $.call(this, C);
        }
        async function r(G) {
          G && !this.getSchema(G) && await t.call(this, { $ref: G }, !0);
        }
        async function $(G) {
          try {
            return this._compileSchemaEnv(G);
          } catch (k) {
            if (!(k instanceof E.default))
              throw k;
            return T.call(this, k), await j.call(this, k.missingSchema), $.call(this, G);
          }
        }
        function T({ missingSchema: G, missingRef: k }) {
          if (this.refs[G])
            throw new Error(`AnySchema ${G} is loaded but ${k} cannot be resolved`);
        }
        async function j(G) {
          const k = await F.call(this, G);
          this.refs[G] || await r.call(this, k.$schema), this.refs[G] || this.addSchema(k, G, b);
        }
        async function F(G) {
          const k = this._loading[G];
          if (k)
            return k;
          try {
            return await (this._loading[G] = m(G));
          } finally {
            delete this._loading[G];
          }
        }
      }
      // Adds schema to the instance
      addSchema(u, b, m, t = this.opts.validateSchema) {
        if (Array.isArray(u)) {
          for (const $ of u)
            this.addSchema($, void 0, m, t);
          return this;
        }
        let r;
        if (typeof u == "object") {
          const { schemaId: $ } = this.opts;
          if (r = u[$], r !== void 0 && typeof r != "string")
            throw new Error(`schema ${$} must be string`);
        }
        return b = (0, h.normalizeId)(b || r), this._checkUnique(b), this.schemas[b] = this._addSchema(u, m, b, t, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(u, b, m = this.opts.validateSchema) {
        return this.addSchema(u, b, !0, m), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(u, b) {
        if (typeof u == "boolean")
          return !0;
        let m;
        if (m = u.$schema, m !== void 0 && typeof m != "string")
          throw new Error("$schema must be a string");
        if (m = m || this.opts.defaultMeta || this.defaultMeta(), !m)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const t = this.validate(m, u);
        if (!t && b) {
          const r = "schema is invalid: " + this.errorsText();
          if (this.opts.validateSchema === "log")
            this.logger.error(r);
          else
            throw new Error(r);
        }
        return t;
      }
      // Get compiled schema by `key` or `ref`.
      // (`key` that was passed to `addSchema` or full schema reference - `schema.$id` or resolved id)
      getSchema(u) {
        let b;
        for (; typeof (b = i.call(this, u)) == "string"; )
          u = b;
        if (b === void 0) {
          const { schemaId: m } = this.opts, t = new d.SchemaEnv({ schema: {}, schemaId: m });
          if (b = d.resolveSchema.call(this, t, u), !b)
            return;
          this.refs[u] = b;
        }
        return b.validate || this._compileSchemaEnv(b);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(u) {
        if (u instanceof RegExp)
          return this._removeAllSchemas(this.schemas, u), this._removeAllSchemas(this.refs, u), this;
        switch (typeof u) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const b = i.call(this, u);
            return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[u], delete this.refs[u], this;
          }
          case "object": {
            const b = u;
            this._cache.delete(b);
            let m = u[this.opts.schemaId];
            return m && (m = (0, h.normalizeId)(m), delete this.schemas[m], delete this.refs[m]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(u) {
        for (const b of u)
          this.addKeyword(b);
        return this;
      }
      addKeyword(u, b) {
        let m;
        if (typeof u == "string")
          m = u, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = m);
        else if (typeof u == "object" && b === void 0) {
          if (b = u, m = b.keyword, Array.isArray(m) && !m.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (x.call(this, m, b), !b)
          return (0, g.eachItem)(m, (r) => Z.call(this, r)), this;
        oe.call(this, b);
        const t = {
          ...b,
          type: (0, y.getJSONTypes)(b.type),
          schemaType: (0, y.getJSONTypes)(b.schemaType)
        };
        return (0, g.eachItem)(m, t.type.length === 0 ? (r) => Z.call(this, r, t) : (r) => t.type.forEach(($) => Z.call(this, r, t, $))), this;
      }
      getKeyword(u) {
        const b = this.RULES.all[u];
        return typeof b == "object" ? b.definition : !!b;
      }
      // Remove keyword
      removeKeyword(u) {
        const { RULES: b } = this;
        delete b.keywords[u], delete b.all[u];
        for (const m of b.rules) {
          const t = m.rules.findIndex((r) => r.keyword === u);
          t >= 0 && m.rules.splice(t, 1);
        }
        return this;
      }
      // Add format
      addFormat(u, b) {
        return typeof b == "string" && (b = new RegExp(b)), this.formats[u] = b, this;
      }
      errorsText(u = this.errors, { separator: b = ", ", dataVar: m = "data" } = {}) {
        return !u || u.length === 0 ? "No errors" : u.map((t) => `${m}${t.instancePath} ${t.message}`).reduce((t, r) => t + b + r);
      }
      $dataMetaSchema(u, b) {
        const m = this.RULES.all;
        u = JSON.parse(JSON.stringify(u));
        for (const t of b) {
          const r = t.split("/").slice(1);
          let $ = u;
          for (const T of r)
            $ = $[T];
          for (const T in m) {
            const j = m[T];
            if (typeof j != "object")
              continue;
            const { $data: F } = j.definition, G = $[T];
            F && G && ($[T] = ue(G));
          }
        }
        return u;
      }
      _removeAllSchemas(u, b) {
        for (const m in u) {
          const t = u[m];
          (!b || b.test(m)) && (typeof t == "string" ? delete u[m] : t && !t.meta && (this._cache.delete(t.schema), delete u[m]));
        }
      }
      _addSchema(u, b, m, t = this.opts.validateSchema, r = this.opts.addUsedSchema) {
        let $;
        const { schemaId: T } = this.opts;
        if (typeof u == "object")
          $ = u[T];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof u != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let j = this._cache.get(u);
        if (j !== void 0)
          return j;
        m = (0, h.normalizeId)($ || m);
        const F = h.getSchemaRefs.call(this, u, m);
        return j = new d.SchemaEnv({ schema: u, schemaId: T, meta: b, baseId: m, localRefs: F }), this._cache.set(j.schema, j), r && !m.startsWith("#") && (m && this._checkUnique(m), this.refs[m] = j), t && this.validateSchema(u, !0), j;
      }
      _checkUnique(u) {
        if (this.schemas[u] || this.refs[u])
          throw new Error(`schema with key or id "${u}" already exists`);
      }
      _compileSchemaEnv(u) {
        if (u.meta ? this._compileMetaSchema(u) : d.compileSchema.call(this, u), !u.validate)
          throw new Error("ajv implementation error");
        return u.validate;
      }
      _compileMetaSchema(u) {
        const b = this.opts;
        this.opts = this._metaOpts;
        try {
          d.compileSchema.call(this, u);
        } finally {
          this.opts = b;
        }
      }
    }
    S.ValidationError = f.default, S.MissingRefError = E.default, e.default = S;
    function n(z, u, b, m = "error") {
      for (const t in z) {
        const r = t;
        r in u && this.logger[m](`${b}: option ${t}. ${z[r]}`);
      }
    }
    function i(z) {
      return z = (0, h.normalizeId)(z), this.schemas[z] || this.refs[z];
    }
    function l() {
      const z = this.opts.schemas;
      if (z)
        if (Array.isArray(z))
          this.addSchema(z);
        else
          for (const u in z)
            this.addSchema(z[u], u);
    }
    function q() {
      for (const z in this.opts.formats) {
        const u = this.opts.formats[z];
        u && this.addFormat(z, u);
      }
    }
    function M(z) {
      if (Array.isArray(z)) {
        this.addVocabulary(z);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const u in z) {
        const b = z[u];
        b.keyword || (b.keyword = u), this.addKeyword(b);
      }
    }
    function K() {
      const z = { ...this.opts };
      for (const u of R)
        delete z[u];
      return z;
    }
    const D = { log() {
    }, warn() {
    }, error() {
    } };
    function L(z) {
      if (z === !1)
        return D;
      if (z === void 0)
        return console;
      if (z.log && z.warn && z.error)
        return z;
      throw new Error("logger must implement log, warn and error methods");
    }
    const H = /^[a-z_$][a-z0-9_$:-]*$/i;
    function x(z, u) {
      const { RULES: b } = this;
      if ((0, g.eachItem)(z, (m) => {
        if (b.keywords[m])
          throw new Error(`Keyword ${m} is already defined`);
        if (!H.test(m))
          throw new Error(`Keyword ${m} has invalid name`);
      }), !!u && u.$data && !("code" in u || "validate" in u))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Z(z, u, b) {
      var m;
      const t = u?.post;
      if (b && t)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: r } = this;
      let $ = t ? r.post : r.rules.find(({ type: j }) => j === b);
      if ($ || ($ = { type: b, rules: [] }, r.rules.push($)), r.keywords[z] = !0, !u)
        return;
      const T = {
        keyword: z,
        definition: {
          ...u,
          type: (0, y.getJSONTypes)(u.type),
          schemaType: (0, y.getJSONTypes)(u.schemaType)
        }
      };
      u.before ? ie.call(this, $, T, u.before) : $.rules.push(T), r.all[z] = T, (m = u.implements) === null || m === void 0 || m.forEach((j) => this.addKeyword(j));
    }
    function ie(z, u, b) {
      const m = z.rules.findIndex((t) => t.keyword === b);
      m >= 0 ? z.rules.splice(m, 0, u) : (z.rules.push(u), this.logger.warn(`rule ${b} is not defined`));
    }
    function oe(z) {
      let { metaSchema: u } = z;
      u !== void 0 && (z.$data && this.opts.$data && (u = ue(u)), z.validateSchema = this.compile(u, !0));
    }
    const Y = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function ue(z) {
      return { anyOf: [z, Y] };
    }
  })(At)), At;
}
var He = {}, xe = {}, Ge = {}, kr;
function Yn() {
  if (kr) return Ge;
  kr = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Ge.default = e, Ge;
}
var Se = {}, Ir;
function Xn() {
  if (Ir) return Se;
  Ir = 1, Object.defineProperty(Se, "__esModule", { value: !0 }), Se.callRef = Se.getValidate = void 0;
  const e = /* @__PURE__ */ jt(), a = /* @__PURE__ */ _e(), w = /* @__PURE__ */ W(), f = /* @__PURE__ */ Pe(), E = /* @__PURE__ */ Wt(), o = /* @__PURE__ */ Q(), d = {
    keyword: "$ref",
    schemaType: "string",
    code(y) {
      const { gen: g, schema: N, it: I } = y, { baseId: O, schemaEnv: R, validateName: P, opts: v, self: _ } = I, { root: s } = R;
      if ((N === "#" || N === "#/") && O === s.baseId)
        return S();
      const p = E.resolveRef.call(_, s, O, N);
      if (p === void 0)
        throw new e.default(I.opts.uriResolver, O, N);
      if (p instanceof E.SchemaEnv)
        return n(p);
      return i(p);
      function S() {
        if (R === s)
          return h(y, P, R, R.$async);
        const l = g.scopeValue("root", { ref: s });
        return h(y, (0, w._)`${l}.validate`, s, s.$async);
      }
      function n(l) {
        const q = c(y, l);
        h(y, q, l, l.$async);
      }
      function i(l) {
        const q = g.scopeValue("schema", v.code.source === !0 ? { ref: l, code: (0, w.stringify)(l) } : { ref: l }), M = g.name("valid"), K = y.subschema({
          schema: l,
          dataTypes: [],
          schemaPath: w.nil,
          topSchemaRef: q,
          errSchemaPath: N
        }, M);
        y.mergeEvaluated(K), y.ok(M);
      }
    }
  };
  function c(y, g) {
    const { gen: N } = y;
    return g.validate ? N.scopeValue("validate", { ref: g.validate }) : (0, w._)`${N.scopeValue("wrapper", { ref: g })}.validate`;
  }
  Se.getValidate = c;
  function h(y, g, N, I) {
    const { gen: O, it: R } = y, { allErrors: P, schemaEnv: v, opts: _ } = R, s = _.passContext ? f.default.this : w.nil;
    I ? p() : S();
    function p() {
      if (!v.$async)
        throw new Error("async schema referenced by sync schema");
      const l = O.let("valid");
      O.try(() => {
        O.code((0, w._)`await ${(0, a.callValidateCode)(y, g, s)}`), i(g), P || O.assign(l, !0);
      }, (q) => {
        O.if((0, w._)`!(${q} instanceof ${R.ValidationError})`, () => O.throw(q)), n(q), P || O.assign(l, !1);
      }), y.ok(l);
    }
    function S() {
      y.result((0, a.callValidateCode)(y, g, s), () => i(g), () => n(g));
    }
    function n(l) {
      const q = (0, w._)`${l}.errors`;
      O.assign(f.default.vErrors, (0, w._)`${f.default.vErrors} === null ? ${q} : ${f.default.vErrors}.concat(${q})`), O.assign(f.default.errors, (0, w._)`${f.default.vErrors}.length`);
    }
    function i(l) {
      var q;
      if (!R.opts.unevaluated)
        return;
      const M = (q = N?.validate) === null || q === void 0 ? void 0 : q.evaluated;
      if (R.props !== !0)
        if (M && !M.dynamicProps)
          M.props !== void 0 && (R.props = o.mergeEvaluated.props(O, M.props, R.props));
        else {
          const K = O.var("props", (0, w._)`${l}.evaluated.props`);
          R.props = o.mergeEvaluated.props(O, K, R.props, w.Name);
        }
      if (R.items !== !0)
        if (M && !M.dynamicItems)
          M.items !== void 0 && (R.items = o.mergeEvaluated.items(O, M.items, R.items));
        else {
          const K = O.var("items", (0, w._)`${l}.evaluated.items`);
          R.items = o.mergeEvaluated.items(O, K, R.items, w.Name);
        }
    }
  }
  return Se.callRef = h, Se.default = d, Se;
}
var jr;
function ea() {
  if (jr) return xe;
  jr = 1, Object.defineProperty(xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Yn(), a = /* @__PURE__ */ Xn(), w = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    a.default
  ];
  return xe.default = w, xe;
}
var Je = {}, Be = {}, Tr;
function ta() {
  if (Tr) return Be;
  Tr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = e.operators, w = {
    maximum: { okStr: "<=", ok: a.LTE, fail: a.GT },
    minimum: { okStr: ">=", ok: a.GTE, fail: a.LT },
    exclusiveMaximum: { okStr: "<", ok: a.LT, fail: a.GTE },
    exclusiveMinimum: { okStr: ">", ok: a.GT, fail: a.LTE }
  }, f = {
    message: ({ keyword: o, schemaCode: d }) => (0, e.str)`must be ${w[o].okStr} ${d}`,
    params: ({ keyword: o, schemaCode: d }) => (0, e._)`{comparison: ${w[o].okStr}, limit: ${d}}`
  }, E = {
    keyword: Object.keys(w),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: f,
    code(o) {
      const { keyword: d, data: c, schemaCode: h } = o;
      o.fail$data((0, e._)`${c} ${w[d].fail} ${h} || isNaN(${c})`);
    }
  };
  return Be.default = E, Be;
}
var We = {}, Cr;
function ra() {
  if (Cr) return We;
  Cr = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: f }) => (0, e.str)`must be multiple of ${f}`,
      params: ({ schemaCode: f }) => (0, e._)`{multipleOf: ${f}}`
    },
    code(f) {
      const { gen: E, data: o, schemaCode: d, it: c } = f, h = c.opts.multipleOfPrecision, y = E.let("res"), g = h ? (0, e._)`Math.abs(Math.round(${y}) - ${y}) > 1e-${h}` : (0, e._)`${y} !== parseInt(${y})`;
      f.fail$data((0, e._)`(${d} === 0 || (${y} = ${o}/${d}, ${g}))`);
    }
  };
  return We.default = w, We;
}
var Ze = {}, Qe = {}, qr;
function na() {
  if (qr) return Qe;
  qr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  function e(a) {
    const w = a.length;
    let f = 0, E = 0, o;
    for (; E < w; )
      f++, o = a.charCodeAt(E++), o >= 55296 && o <= 56319 && E < w && (o = a.charCodeAt(E), (o & 64512) === 56320 && E++);
    return f;
  }
  return Qe.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Qe;
}
var Ar;
function aa() {
  if (Ar) return Ze;
  Ar = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ na(), E = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: o, schemaCode: d }) {
        const c = o === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${c} than ${d} characters`;
      },
      params: ({ schemaCode: o }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { keyword: d, data: c, schemaCode: h, it: y } = o, g = d === "maxLength" ? e.operators.GT : e.operators.LT, N = y.opts.unicode === !1 ? (0, e._)`${c}.length` : (0, e._)`${(0, a.useFunc)(o.gen, w.default)}(${c})`;
      o.fail$data((0, e._)`${N} ${g} ${h}`);
    }
  };
  return Ze.default = E, Ze;
}
var Ye = {}, Dr;
function sa() {
  if (Dr) return Ye;
  Dr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ W(), E = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: o }) => (0, w.str)`must match pattern "${o}"`,
      params: ({ schemaCode: o }) => (0, w._)`{pattern: ${o}}`
    },
    code(o) {
      const { gen: d, data: c, $data: h, schema: y, schemaCode: g, it: N } = o, I = N.opts.unicodeRegExp ? "u" : "";
      if (h) {
        const { regExp: O } = N.opts.code, R = O.code === "new RegExp" ? (0, w._)`new RegExp` : (0, a.useFunc)(d, O), P = d.let("valid");
        d.try(() => d.assign(P, (0, w._)`${R}(${g}, ${I}).test(${c})`), () => d.assign(P, !1)), o.fail$data((0, w._)`!${P}`);
      } else {
        const O = (0, e.usePattern)(o, y);
        o.fail$data((0, w._)`!${O}.test(${c})`);
      }
    }
  };
  return Ye.default = E, Ye;
}
var Xe = {}, Mr;
function oa() {
  if (Mr) return Xe;
  Mr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: f, schemaCode: E }) {
        const o = f === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${E} properties`;
      },
      params: ({ schemaCode: f }) => (0, e._)`{limit: ${f}}`
    },
    code(f) {
      const { keyword: E, data: o, schemaCode: d } = f, c = E === "maxProperties" ? e.operators.GT : e.operators.LT;
      f.fail$data((0, e._)`Object.keys(${o}).length ${c} ${d}`);
    }
  };
  return Xe.default = w, Xe;
}
var et = {}, Fr;
function ia() {
  if (Fr) return et;
  Fr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), E = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: o } }) => (0, a.str)`must have required property '${o}'`,
      params: ({ params: { missingProperty: o } }) => (0, a._)`{missingProperty: ${o}}`
    },
    code(o) {
      const { gen: d, schema: c, schemaCode: h, data: y, $data: g, it: N } = o, { opts: I } = N;
      if (!g && c.length === 0)
        return;
      const O = c.length >= I.loopRequired;
      if (N.allErrors ? R() : P(), I.strictRequired) {
        const s = o.parentSchema.properties, { definedProperties: p } = o.it;
        for (const S of c)
          if (s?.[S] === void 0 && !p.has(S)) {
            const n = N.schemaEnv.baseId + N.errSchemaPath, i = `required property "${S}" is not defined at "${n}" (strictRequired)`;
            (0, w.checkStrictMode)(N, i, N.opts.strictRequired);
          }
      }
      function R() {
        if (O || g)
          o.block$data(a.nil, v);
        else
          for (const s of c)
            (0, e.checkReportMissingProp)(o, s);
      }
      function P() {
        const s = d.let("missing");
        if (O || g) {
          const p = d.let("valid", !0);
          o.block$data(p, () => _(s, p)), o.ok(p);
        } else
          d.if((0, e.checkMissingProp)(o, c, s)), (0, e.reportMissingProp)(o, s), d.else();
      }
      function v() {
        d.forOf("prop", h, (s) => {
          o.setParams({ missingProperty: s }), d.if((0, e.noPropertyInData)(d, y, s, I.ownProperties), () => o.error());
        });
      }
      function _(s, p) {
        o.setParams({ missingProperty: s }), d.forOf(s, h, () => {
          d.assign(p, (0, e.propertyInData)(d, y, s, I.ownProperties)), d.if((0, a.not)(p), () => {
            o.error(), d.break();
          });
        }, a.nil);
      }
    }
  };
  return et.default = E, et;
}
var tt = {}, zr;
function ua() {
  if (zr) return tt;
  zr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: f, schemaCode: E }) {
        const o = f === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${E} items`;
      },
      params: ({ schemaCode: f }) => (0, e._)`{limit: ${f}}`
    },
    code(f) {
      const { keyword: E, data: o, schemaCode: d } = f, c = E === "maxItems" ? e.operators.GT : e.operators.LT;
      f.fail$data((0, e._)`${o}.length ${c} ${d}`);
    }
  };
  return tt.default = w, tt;
}
var rt = {}, nt = {}, Vr;
function Zt() {
  if (Vr) return nt;
  Vr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const e = bn();
  return e.code = 'require("ajv/dist/runtime/equal").default', nt.default = e, nt;
}
var Ur;
function ca() {
  if (Ur) return rt;
  Ur = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Nt(), a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), f = /* @__PURE__ */ Zt(), o = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: d, j: c } }) => (0, a.str)`must NOT have duplicate items (items ## ${c} and ${d} are identical)`,
      params: ({ params: { i: d, j: c } }) => (0, a._)`{i: ${d}, j: ${c}}`
    },
    code(d) {
      const { gen: c, data: h, $data: y, schema: g, parentSchema: N, schemaCode: I, it: O } = d;
      if (!y && !g)
        return;
      const R = c.let("valid"), P = N.items ? (0, e.getSchemaTypes)(N.items) : [];
      d.block$data(R, v, (0, a._)`${I} === false`), d.ok(R);
      function v() {
        const S = c.let("i", (0, a._)`${h}.length`), n = c.let("j");
        d.setParams({ i: S, j: n }), c.assign(R, !0), c.if((0, a._)`${S} > 1`, () => (_() ? s : p)(S, n));
      }
      function _() {
        return P.length > 0 && !P.some((S) => S === "object" || S === "array");
      }
      function s(S, n) {
        const i = c.name("item"), l = (0, e.checkDataTypes)(P, i, O.opts.strictNumbers, e.DataType.Wrong), q = c.const("indices", (0, a._)`{}`);
        c.for((0, a._)`;${S}--;`, () => {
          c.let(i, (0, a._)`${h}[${S}]`), c.if(l, (0, a._)`continue`), P.length > 1 && c.if((0, a._)`typeof ${i} == "string"`, (0, a._)`${i} += "_"`), c.if((0, a._)`typeof ${q}[${i}] == "number"`, () => {
            c.assign(n, (0, a._)`${q}[${i}]`), d.error(), c.assign(R, !1).break();
          }).code((0, a._)`${q}[${i}] = ${S}`);
        });
      }
      function p(S, n) {
        const i = (0, w.useFunc)(c, f.default), l = c.name("outer");
        c.label(l).for((0, a._)`;${S}--;`, () => c.for((0, a._)`${n} = ${S}; ${n}--;`, () => c.if((0, a._)`${i}(${h}[${S}], ${h}[${n}])`, () => {
          d.error(), c.assign(R, !1).break(l);
        })));
      }
    }
  };
  return rt.default = o, rt;
}
var at = {}, Lr;
function la() {
  if (Lr) return at;
  Lr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Zt(), E = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValue: ${o}}`
    },
    code(o) {
      const { gen: d, data: c, $data: h, schemaCode: y, schema: g } = o;
      h || g && typeof g == "object" ? o.fail$data((0, e._)`!${(0, a.useFunc)(d, w.default)}(${c}, ${y})`) : o.fail((0, e._)`${g} !== ${c}`);
    }
  };
  return at.default = E, at;
}
var st = {}, Kr;
function da() {
  if (Kr) return st;
  Kr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Zt(), E = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValues: ${o}}`
    },
    code(o) {
      const { gen: d, data: c, $data: h, schema: y, schemaCode: g, it: N } = o;
      if (!h && y.length === 0)
        throw new Error("enum must have non-empty array");
      const I = y.length >= N.opts.loopEnum;
      let O;
      const R = () => O ?? (O = (0, a.useFunc)(d, w.default));
      let P;
      if (I || h)
        P = d.let("valid"), o.block$data(P, v);
      else {
        if (!Array.isArray(y))
          throw new Error("ajv implementation error");
        const s = d.const("vSchema", g);
        P = (0, e.or)(...y.map((p, S) => _(s, S)));
      }
      o.pass(P);
      function v() {
        d.assign(P, !1), d.forOf("v", g, (s) => d.if((0, e._)`${R()}(${c}, ${s})`, () => d.assign(P, !0).break()));
      }
      function _(s, p) {
        const S = y[p];
        return typeof S == "object" && S !== null ? (0, e._)`${R()}(${c}, ${s}[${p}])` : (0, e._)`${c} === ${S}`;
      }
    }
  };
  return st.default = E, st;
}
var Hr;
function fa() {
  if (Hr) return Je;
  Hr = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ta(), a = /* @__PURE__ */ ra(), w = /* @__PURE__ */ aa(), f = /* @__PURE__ */ sa(), E = /* @__PURE__ */ oa(), o = /* @__PURE__ */ ia(), d = /* @__PURE__ */ ua(), c = /* @__PURE__ */ ca(), h = /* @__PURE__ */ la(), y = /* @__PURE__ */ da(), g = [
    // number
    e.default,
    a.default,
    // string
    w.default,
    f.default,
    // object
    E.default,
    o.default,
    // array
    d.default,
    c.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    h.default,
    y.default
  ];
  return Je.default = g, Je;
}
var ot = {}, ke = {}, xr;
function Sn() {
  if (xr) return ke;
  xr = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateAdditionalItems = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), f = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { parentSchema: d, it: c } = o, { items: h } = d;
      if (!Array.isArray(h)) {
        (0, a.checkStrictMode)(c, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      E(o, h);
    }
  };
  function E(o, d) {
    const { gen: c, schema: h, data: y, keyword: g, it: N } = o;
    N.items = !0;
    const I = c.const("len", (0, e._)`${y}.length`);
    if (h === !1)
      o.setParams({ len: d.length }), o.pass((0, e._)`${I} <= ${d.length}`);
    else if (typeof h == "object" && !(0, a.alwaysValidSchema)(N, h)) {
      const R = c.var("valid", (0, e._)`${I} <= ${d.length}`);
      c.if((0, e.not)(R), () => O(R)), o.ok(R);
    }
    function O(R) {
      c.forRange("i", d.length, I, (P) => {
        o.subschema({ keyword: g, dataProp: P, dataPropType: a.Type.Num }, R), N.allErrors || c.if((0, e.not)(R), () => c.break());
      });
    }
  }
  return ke.validateAdditionalItems = E, ke.default = f, ke;
}
var it = {}, Ie = {}, Gr;
function Pn() {
  if (Gr) return Ie;
  Gr = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.validateTuple = void 0;
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ _e(), f = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(o) {
      const { schema: d, it: c } = o;
      if (Array.isArray(d))
        return E(o, "additionalItems", d);
      c.items = !0, !(0, a.alwaysValidSchema)(c, d) && o.ok((0, w.validateArray)(o));
    }
  };
  function E(o, d, c = o.schema) {
    const { gen: h, parentSchema: y, data: g, keyword: N, it: I } = o;
    P(y), I.opts.unevaluated && c.length && I.items !== !0 && (I.items = a.mergeEvaluated.items(h, c.length, I.items));
    const O = h.name("valid"), R = h.const("len", (0, e._)`${g}.length`);
    c.forEach((v, _) => {
      (0, a.alwaysValidSchema)(I, v) || (h.if((0, e._)`${R} > ${_}`, () => o.subschema({
        keyword: N,
        schemaProp: _,
        dataProp: _
      }, O)), o.ok(O));
    });
    function P(v) {
      const { opts: _, errSchemaPath: s } = I, p = c.length, S = p === v.minItems && (p === v.maxItems || v[d] === !1);
      if (_.strictTuples && !S) {
        const n = `"${N}" is ${p}-tuple, but minItems or maxItems/${d} are not specified or different at path "${s}"`;
        (0, a.checkStrictMode)(I, n, _.strictTuples);
      }
    }
  }
  return Ie.validateTuple = E, Ie.default = f, Ie;
}
var Jr;
function ha() {
  if (Jr) return it;
  Jr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Pn(), a = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (w) => (0, e.validateTuple)(w, "items")
  };
  return it.default = a, it;
}
var ut = {}, Br;
function ma() {
  if (Br) return ut;
  Br = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), w = /* @__PURE__ */ _e(), f = /* @__PURE__ */ Sn(), o = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: d } }) => (0, e.str)`must NOT have more than ${d} items`,
      params: ({ params: { len: d } }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { schema: c, parentSchema: h, it: y } = d, { prefixItems: g } = h;
      y.items = !0, !(0, a.alwaysValidSchema)(y, c) && (g ? (0, f.validateAdditionalItems)(d, g) : d.ok((0, w.validateArray)(d)));
    }
  };
  return ut.default = o, ut;
}
var ct = {}, Wr;
function pa() {
  if (Wr) return ct;
  Wr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), f = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: E, max: o } }) => o === void 0 ? (0, e.str)`must contain at least ${E} valid item(s)` : (0, e.str)`must contain at least ${E} and no more than ${o} valid item(s)`,
      params: ({ params: { min: E, max: o } }) => o === void 0 ? (0, e._)`{minContains: ${E}}` : (0, e._)`{minContains: ${E}, maxContains: ${o}}`
    },
    code(E) {
      const { gen: o, schema: d, parentSchema: c, data: h, it: y } = E;
      let g, N;
      const { minContains: I, maxContains: O } = c;
      y.opts.next ? (g = I === void 0 ? 1 : I, N = O) : g = 1;
      const R = o.const("len", (0, e._)`${h}.length`);
      if (E.setParams({ min: g, max: N }), N === void 0 && g === 0) {
        (0, a.checkStrictMode)(y, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (N !== void 0 && g > N) {
        (0, a.checkStrictMode)(y, '"minContains" > "maxContains" is always invalid'), E.fail();
        return;
      }
      if ((0, a.alwaysValidSchema)(y, d)) {
        let p = (0, e._)`${R} >= ${g}`;
        N !== void 0 && (p = (0, e._)`${p} && ${R} <= ${N}`), E.pass(p);
        return;
      }
      y.items = !0;
      const P = o.name("valid");
      N === void 0 && g === 1 ? _(P, () => o.if(P, () => o.break())) : g === 0 ? (o.let(P, !0), N !== void 0 && o.if((0, e._)`${h}.length > 0`, v)) : (o.let(P, !1), v()), E.result(P, () => E.reset());
      function v() {
        const p = o.name("_valid"), S = o.let("count", 0);
        _(p, () => o.if(p, () => s(S)));
      }
      function _(p, S) {
        o.forRange("i", 0, R, (n) => {
          E.subschema({
            keyword: "contains",
            dataProp: n,
            dataPropType: a.Type.Num,
            compositeRule: !0
          }, p), S();
        });
      }
      function s(p) {
        o.code((0, e._)`${p}++`), N === void 0 ? o.if((0, e._)`${p} >= ${g}`, () => o.assign(P, !0).break()) : (o.if((0, e._)`${p} > ${N}`, () => o.assign(P, !1).break()), g === 1 ? o.assign(P, !0) : o.if((0, e._)`${p} >= ${g}`, () => o.assign(P, !0)));
      }
    }
  };
  return ct.default = f, ct;
}
var Ht = {}, Zr;
function ya() {
  return Zr || (Zr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), f = /* @__PURE__ */ _e();
    e.error = {
      message: ({ params: { property: h, depsCount: y, deps: g } }) => {
        const N = y === 1 ? "property" : "properties";
        return (0, a.str)`must have ${N} ${g} when property ${h} is present`;
      },
      params: ({ params: { property: h, depsCount: y, deps: g, missingProperty: N } }) => (0, a._)`{property: ${h},
    missingProperty: ${N},
    depsCount: ${y},
    deps: ${g}}`
      // TODO change to reference
    };
    const E = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(h) {
        const [y, g] = o(h);
        d(h, y), c(h, g);
      }
    };
    function o({ schema: h }) {
      const y = {}, g = {};
      for (const N in h) {
        if (N === "__proto__")
          continue;
        const I = Array.isArray(h[N]) ? y : g;
        I[N] = h[N];
      }
      return [y, g];
    }
    function d(h, y = h.schema) {
      const { gen: g, data: N, it: I } = h;
      if (Object.keys(y).length === 0)
        return;
      const O = g.let("missing");
      for (const R in y) {
        const P = y[R];
        if (P.length === 0)
          continue;
        const v = (0, f.propertyInData)(g, N, R, I.opts.ownProperties);
        h.setParams({
          property: R,
          depsCount: P.length,
          deps: P.join(", ")
        }), I.allErrors ? g.if(v, () => {
          for (const _ of P)
            (0, f.checkReportMissingProp)(h, _);
        }) : (g.if((0, a._)`${v} && (${(0, f.checkMissingProp)(h, P, O)})`), (0, f.reportMissingProp)(h, O), g.else());
      }
    }
    e.validatePropertyDeps = d;
    function c(h, y = h.schema) {
      const { gen: g, data: N, keyword: I, it: O } = h, R = g.name("valid");
      for (const P in y)
        (0, w.alwaysValidSchema)(O, y[P]) || (g.if(
          (0, f.propertyInData)(g, N, P, O.opts.ownProperties),
          () => {
            const v = h.subschema({ keyword: I, schemaProp: P }, R);
            h.mergeValidEvaluated(v, R);
          },
          () => g.var(R, !0)
          // TODO var
        ), h.ok(R));
    }
    e.validateSchemaDeps = c, e.default = E;
  })(Ht)), Ht;
}
var lt = {}, Qr;
function va() {
  if (Qr) return lt;
  Qr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), f = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: E }) => (0, e._)`{propertyName: ${E.propertyName}}`
    },
    code(E) {
      const { gen: o, schema: d, data: c, it: h } = E;
      if ((0, a.alwaysValidSchema)(h, d))
        return;
      const y = o.name("valid");
      o.forIn("key", c, (g) => {
        E.setParams({ propertyName: g }), E.subschema({
          keyword: "propertyNames",
          data: g,
          dataTypes: ["string"],
          propertyName: g,
          compositeRule: !0
        }, y), o.if((0, e.not)(y), () => {
          E.error(!0), h.allErrors || o.break();
        });
      }), E.ok(y);
    }
  };
  return lt.default = f, lt;
}
var dt = {}, Yr;
function Rn() {
  if (Yr) return dt;
  Yr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Pe(), f = /* @__PURE__ */ Q(), o = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: d }) => (0, a._)`{additionalProperty: ${d.additionalProperty}}`
    },
    code(d) {
      const { gen: c, schema: h, parentSchema: y, data: g, errsCount: N, it: I } = d;
      if (!N)
        throw new Error("ajv implementation error");
      const { allErrors: O, opts: R } = I;
      if (I.props = !0, R.removeAdditional !== "all" && (0, f.alwaysValidSchema)(I, h))
        return;
      const P = (0, e.allSchemaProperties)(y.properties), v = (0, e.allSchemaProperties)(y.patternProperties);
      _(), d.ok((0, a._)`${N} === ${w.default.errors}`);
      function _() {
        c.forIn("key", g, (i) => {
          !P.length && !v.length ? S(i) : c.if(s(i), () => S(i));
        });
      }
      function s(i) {
        let l;
        if (P.length > 8) {
          const q = (0, f.schemaRefOrVal)(I, y.properties, "properties");
          l = (0, e.isOwnProperty)(c, q, i);
        } else P.length ? l = (0, a.or)(...P.map((q) => (0, a._)`${i} === ${q}`)) : l = a.nil;
        return v.length && (l = (0, a.or)(l, ...v.map((q) => (0, a._)`${(0, e.usePattern)(d, q)}.test(${i})`))), (0, a.not)(l);
      }
      function p(i) {
        c.code((0, a._)`delete ${g}[${i}]`);
      }
      function S(i) {
        if (R.removeAdditional === "all" || R.removeAdditional && h === !1) {
          p(i);
          return;
        }
        if (h === !1) {
          d.setParams({ additionalProperty: i }), d.error(), O || c.break();
          return;
        }
        if (typeof h == "object" && !(0, f.alwaysValidSchema)(I, h)) {
          const l = c.name("valid");
          R.removeAdditional === "failing" ? (n(i, l, !1), c.if((0, a.not)(l), () => {
            d.reset(), p(i);
          })) : (n(i, l), O || c.if((0, a.not)(l), () => c.break()));
        }
      }
      function n(i, l, q) {
        const M = {
          keyword: "additionalProperties",
          dataProp: i,
          dataPropType: f.Type.Str
        };
        q === !1 && Object.assign(M, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), d.subschema(M, l);
      }
    }
  };
  return dt.default = o, dt;
}
var ft = {}, Xr;
function _a() {
  if (Xr) return ft;
  Xr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ It(), a = /* @__PURE__ */ _e(), w = /* @__PURE__ */ Q(), f = /* @__PURE__ */ Rn(), E = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: d, schema: c, parentSchema: h, data: y, it: g } = o;
      g.opts.removeAdditional === "all" && h.additionalProperties === void 0 && f.default.code(new e.KeywordCxt(g, f.default, "additionalProperties"));
      const N = (0, a.allSchemaProperties)(c);
      for (const v of N)
        g.definedProperties.add(v);
      g.opts.unevaluated && N.length && g.props !== !0 && (g.props = w.mergeEvaluated.props(d, (0, w.toHash)(N), g.props));
      const I = N.filter((v) => !(0, w.alwaysValidSchema)(g, c[v]));
      if (I.length === 0)
        return;
      const O = d.name("valid");
      for (const v of I)
        R(v) ? P(v) : (d.if((0, a.propertyInData)(d, y, v, g.opts.ownProperties)), P(v), g.allErrors || d.else().var(O, !0), d.endIf()), o.it.definedProperties.add(v), o.ok(O);
      function R(v) {
        return g.opts.useDefaults && !g.compositeRule && c[v].default !== void 0;
      }
      function P(v) {
        o.subschema({
          keyword: "properties",
          schemaProp: v,
          dataProp: v
        }, O);
      }
    }
  };
  return ft.default = E, ft;
}
var ht = {}, en;
function ga() {
  if (en) return ht;
  en = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), a = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), f = /* @__PURE__ */ Q(), E = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: d, schema: c, data: h, parentSchema: y, it: g } = o, { opts: N } = g, I = (0, e.allSchemaProperties)(c), O = I.filter((S) => (0, w.alwaysValidSchema)(g, c[S]));
      if (I.length === 0 || O.length === I.length && (!g.opts.unevaluated || g.props === !0))
        return;
      const R = N.strictSchema && !N.allowMatchingProperties && y.properties, P = d.name("valid");
      g.props !== !0 && !(g.props instanceof a.Name) && (g.props = (0, f.evaluatedPropsToName)(d, g.props));
      const { props: v } = g;
      _();
      function _() {
        for (const S of I)
          R && s(S), g.allErrors ? p(S) : (d.var(P, !0), p(S), d.if(P));
      }
      function s(S) {
        for (const n in R)
          new RegExp(S).test(n) && (0, w.checkStrictMode)(g, `property ${n} matches pattern ${S} (use allowMatchingProperties)`);
      }
      function p(S) {
        d.forIn("key", h, (n) => {
          d.if((0, a._)`${(0, e.usePattern)(o, S)}.test(${n})`, () => {
            const i = O.includes(S);
            i || o.subschema({
              keyword: "patternProperties",
              schemaProp: S,
              dataProp: n,
              dataPropType: f.Type.Str
            }, P), g.opts.unevaluated && v !== !0 ? d.assign((0, a._)`${v}[${n}]`, !0) : !i && !g.allErrors && d.if((0, a.not)(P), () => d.break());
          });
        });
      }
    }
  };
  return ht.default = E, ht;
}
var mt = {}, tn;
function $a() {
  if (tn) return mt;
  tn = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), a = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(w) {
      const { gen: f, schema: E, it: o } = w;
      if ((0, e.alwaysValidSchema)(o, E)) {
        w.fail();
        return;
      }
      const d = f.name("valid");
      w.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, d), w.failResult(d, () => w.reset(), () => w.error());
    },
    error: { message: "must NOT be valid" }
  };
  return mt.default = a, mt;
}
var pt = {}, rn;
function wa() {
  if (rn) return pt;
  rn = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const a = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: (/* @__PURE__ */ _e()).validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return pt.default = a, pt;
}
var yt = {}, nn;
function ba() {
  if (nn) return yt;
  nn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), f = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: E }) => (0, e._)`{passingSchemas: ${E.passing}}`
    },
    code(E) {
      const { gen: o, schema: d, parentSchema: c, it: h } = E;
      if (!Array.isArray(d))
        throw new Error("ajv implementation error");
      if (h.opts.discriminator && c.discriminator)
        return;
      const y = d, g = o.let("valid", !1), N = o.let("passing", null), I = o.name("_valid");
      E.setParams({ passing: N }), o.block(O), E.result(g, () => E.reset(), () => E.error(!0));
      function O() {
        y.forEach((R, P) => {
          let v;
          (0, a.alwaysValidSchema)(h, R) ? o.var(I, !0) : v = E.subschema({
            keyword: "oneOf",
            schemaProp: P,
            compositeRule: !0
          }, I), P > 0 && o.if((0, e._)`${I} && ${g}`).assign(g, !1).assign(N, (0, e._)`[${N}, ${P}]`).else(), o.if(I, () => {
            o.assign(g, !0), o.assign(N, P), v && E.mergeEvaluated(v, e.Name);
          });
        });
      }
    }
  };
  return yt.default = f, yt;
}
var vt = {}, an;
function Ea() {
  if (an) return vt;
  an = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), a = {
    keyword: "allOf",
    schemaType: "array",
    code(w) {
      const { gen: f, schema: E, it: o } = w;
      if (!Array.isArray(E))
        throw new Error("ajv implementation error");
      const d = f.name("valid");
      E.forEach((c, h) => {
        if ((0, e.alwaysValidSchema)(o, c))
          return;
        const y = w.subschema({ keyword: "allOf", schemaProp: h }, d);
        w.ok(d), w.mergeEvaluated(y);
      });
    }
  };
  return vt.default = a, vt;
}
var _t = {}, sn;
function Sa() {
  if (sn) return _t;
  sn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ Q(), f = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: o }) => (0, e.str)`must match "${o.ifClause}" schema`,
      params: ({ params: o }) => (0, e._)`{failingKeyword: ${o.ifClause}}`
    },
    code(o) {
      const { gen: d, parentSchema: c, it: h } = o;
      c.then === void 0 && c.else === void 0 && (0, a.checkStrictMode)(h, '"if" without "then" and "else" is ignored');
      const y = E(h, "then"), g = E(h, "else");
      if (!y && !g)
        return;
      const N = d.let("valid", !0), I = d.name("_valid");
      if (O(), o.reset(), y && g) {
        const P = d.let("ifClause");
        o.setParams({ ifClause: P }), d.if(I, R("then", P), R("else", P));
      } else y ? d.if(I, R("then")) : d.if((0, e.not)(I), R("else"));
      o.pass(N, () => o.error(!0));
      function O() {
        const P = o.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, I);
        o.mergeEvaluated(P);
      }
      function R(P, v) {
        return () => {
          const _ = o.subschema({ keyword: P }, I);
          d.assign(N, I), o.mergeValidEvaluated(_, N), v ? d.assign(v, (0, e._)`${P}`) : o.setParams({ ifClause: P });
        };
      }
    }
  };
  function E(o, d) {
    const c = o.schema[d];
    return c !== void 0 && !(0, a.alwaysValidSchema)(o, c);
  }
  return _t.default = f, _t;
}
var gt = {}, on;
function Pa() {
  if (on) return gt;
  on = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), a = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: w, parentSchema: f, it: E }) {
      f.if === void 0 && (0, e.checkStrictMode)(E, `"${w}" without "if" is ignored`);
    }
  };
  return gt.default = a, gt;
}
var un;
function Ra() {
  if (un) return ot;
  un = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Sn(), a = /* @__PURE__ */ ha(), w = /* @__PURE__ */ Pn(), f = /* @__PURE__ */ ma(), E = /* @__PURE__ */ pa(), o = /* @__PURE__ */ ya(), d = /* @__PURE__ */ va(), c = /* @__PURE__ */ Rn(), h = /* @__PURE__ */ _a(), y = /* @__PURE__ */ ga(), g = /* @__PURE__ */ $a(), N = /* @__PURE__ */ wa(), I = /* @__PURE__ */ ba(), O = /* @__PURE__ */ Ea(), R = /* @__PURE__ */ Sa(), P = /* @__PURE__ */ Pa();
  function v(_ = !1) {
    const s = [
      // any
      g.default,
      N.default,
      I.default,
      O.default,
      R.default,
      P.default,
      // object
      d.default,
      c.default,
      o.default,
      h.default,
      y.default
    ];
    return _ ? s.push(a.default, f.default) : s.push(e.default, w.default), s.push(E.default), s;
  }
  return ot.default = v, ot;
}
var $t = {}, wt = {}, cn;
function Na() {
  if (cn) return wt;
  cn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: f }) => (0, e.str)`must match format "${f}"`,
      params: ({ schemaCode: f }) => (0, e._)`{format: ${f}}`
    },
    code(f, E) {
      const { gen: o, data: d, $data: c, schema: h, schemaCode: y, it: g } = f, { opts: N, errSchemaPath: I, schemaEnv: O, self: R } = g;
      if (!N.validateFormats)
        return;
      c ? P() : v();
      function P() {
        const _ = o.scopeValue("formats", {
          ref: R.formats,
          code: N.code.formats
        }), s = o.const("fDef", (0, e._)`${_}[${y}]`), p = o.let("fType"), S = o.let("format");
        o.if((0, e._)`typeof ${s} == "object" && !(${s} instanceof RegExp)`, () => o.assign(p, (0, e._)`${s}.type || "string"`).assign(S, (0, e._)`${s}.validate`), () => o.assign(p, (0, e._)`"string"`).assign(S, s)), f.fail$data((0, e.or)(n(), i()));
        function n() {
          return N.strictSchema === !1 ? e.nil : (0, e._)`${y} && !${S}`;
        }
        function i() {
          const l = O.$async ? (0, e._)`(${s}.async ? await ${S}(${d}) : ${S}(${d}))` : (0, e._)`${S}(${d})`, q = (0, e._)`(typeof ${S} == "function" ? ${l} : ${S}.test(${d}))`;
          return (0, e._)`${S} && ${S} !== true && ${p} === ${E} && !${q}`;
        }
      }
      function v() {
        const _ = R.formats[h];
        if (!_) {
          n();
          return;
        }
        if (_ === !0)
          return;
        const [s, p, S] = i(_);
        s === E && f.pass(l());
        function n() {
          if (N.strictSchema === !1) {
            R.logger.warn(q());
            return;
          }
          throw new Error(q());
          function q() {
            return `unknown format "${h}" ignored in schema at path "${I}"`;
          }
        }
        function i(q) {
          const M = q instanceof RegExp ? (0, e.regexpCode)(q) : N.code.formats ? (0, e._)`${N.code.formats}${(0, e.getProperty)(h)}` : void 0, K = o.scopeValue("formats", { key: h, ref: q, code: M });
          return typeof q == "object" && !(q instanceof RegExp) ? [q.type || "string", q.validate, (0, e._)`${K}.validate`] : ["string", q, K];
        }
        function l() {
          if (typeof _ == "object" && !(_ instanceof RegExp) && _.async) {
            if (!O.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${S}(${d})`;
          }
          return typeof p == "function" ? (0, e._)`${S}(${d})` : (0, e._)`${S}.test(${d})`;
        }
      }
    }
  };
  return wt.default = w, wt;
}
var ln;
function Oa() {
  if (ln) return $t;
  ln = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const a = [(/* @__PURE__ */ Na()).default];
  return $t.default = a, $t;
}
var Oe = {}, dn;
function ka() {
  return dn || (dn = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.contentVocabulary = Oe.metadataVocabulary = void 0, Oe.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Oe.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Oe;
}
var fn;
function Ia() {
  if (fn) return He;
  fn = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ea(), a = /* @__PURE__ */ fa(), w = /* @__PURE__ */ Ra(), f = /* @__PURE__ */ Oa(), E = /* @__PURE__ */ ka(), o = [
    e.default,
    a.default,
    (0, w.default)(),
    f.default,
    E.metadataVocabulary,
    E.contentVocabulary
  ];
  return He.default = o, He;
}
var bt = {}, De = {}, hn;
function ja() {
  if (hn) return De;
  hn = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.DiscrError = void 0;
  var e;
  return (function(a) {
    a.Tag = "tag", a.Mapping = "mapping";
  })(e || (De.DiscrError = e = {})), De;
}
var mn;
function Ta() {
  if (mn) return bt;
  mn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), a = /* @__PURE__ */ ja(), w = /* @__PURE__ */ Wt(), f = /* @__PURE__ */ jt(), E = /* @__PURE__ */ Q(), d = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: c, tagName: h } }) => c === a.DiscrError.Tag ? `tag "${h}" must be string` : `value of tag "${h}" must be in oneOf`,
      params: ({ params: { discrError: c, tag: h, tagName: y } }) => (0, e._)`{error: ${c}, tag: ${y}, tagValue: ${h}}`
    },
    code(c) {
      const { gen: h, data: y, schema: g, parentSchema: N, it: I } = c, { oneOf: O } = N;
      if (!I.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const R = g.propertyName;
      if (typeof R != "string")
        throw new Error("discriminator: requires propertyName");
      if (g.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!O)
        throw new Error("discriminator: requires oneOf keyword");
      const P = h.let("valid", !1), v = h.const("tag", (0, e._)`${y}${(0, e.getProperty)(R)}`);
      h.if((0, e._)`typeof ${v} == "string"`, () => _(), () => c.error(!1, { discrError: a.DiscrError.Tag, tag: v, tagName: R })), c.ok(P);
      function _() {
        const S = p();
        h.if(!1);
        for (const n in S)
          h.elseIf((0, e._)`${v} === ${n}`), h.assign(P, s(S[n]));
        h.else(), c.error(!1, { discrError: a.DiscrError.Mapping, tag: v, tagName: R }), h.endIf();
      }
      function s(S) {
        const n = h.name("valid"), i = c.subschema({ keyword: "oneOf", schemaProp: S }, n);
        return c.mergeEvaluated(i, e.Name), n;
      }
      function p() {
        var S;
        const n = {}, i = q(N);
        let l = !0;
        for (let D = 0; D < O.length; D++) {
          let L = O[D];
          if (L?.$ref && !(0, E.schemaHasRulesButRef)(L, I.self.RULES)) {
            const x = L.$ref;
            if (L = w.resolveRef.call(I.self, I.schemaEnv.root, I.baseId, x), L instanceof w.SchemaEnv && (L = L.schema), L === void 0)
              throw new f.default(I.opts.uriResolver, I.baseId, x);
          }
          const H = (S = L?.properties) === null || S === void 0 ? void 0 : S[R];
          if (typeof H != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${R}"`);
          l = l && (i || q(L)), M(H, D);
        }
        if (!l)
          throw new Error(`discriminator: "${R}" must be required`);
        return n;
        function q({ required: D }) {
          return Array.isArray(D) && D.includes(R);
        }
        function M(D, L) {
          if (D.const)
            K(D.const, L);
          else if (D.enum)
            for (const H of D.enum)
              K(H, L);
          else
            throw new Error(`discriminator: "properties/${R}" must have "const" or "enum"`);
        }
        function K(D, L) {
          if (typeof D != "string" || D in n)
            throw new Error(`discriminator: "${R}" values must be unique strings`);
          n[D] = L;
        }
      }
    }
  };
  return bt.default = d, bt;
}
const Ca = "http://json-schema.org/draft-07/schema#", qa = "http://json-schema.org/draft-07/schema#", Aa = "Core schema meta-schema", Da = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Ma = ["object", "boolean"], Fa = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, za = {
  $schema: Ca,
  $id: qa,
  title: Aa,
  definitions: Da,
  type: Ma,
  properties: Fa,
  default: !0
};
var pn;
function Nn() {
  return pn || (pn = 1, (function(e, a) {
    Object.defineProperty(a, "__esModule", { value: !0 }), a.MissingRefError = a.ValidationError = a.CodeGen = a.Name = a.nil = a.stringify = a.str = a._ = a.KeywordCxt = a.Ajv = void 0;
    const w = /* @__PURE__ */ Qn(), f = /* @__PURE__ */ Ia(), E = /* @__PURE__ */ Ta(), o = za, d = ["/properties"], c = "http://json-schema.org/draft-07/schema";
    class h extends w.default {
      _addVocabularies() {
        super._addVocabularies(), f.default.forEach((R) => this.addVocabulary(R)), this.opts.discriminator && this.addKeyword(E.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const R = this.opts.$data ? this.$dataMetaSchema(o, d) : o;
        this.addMetaSchema(R, c, !1), this.refs["http://json-schema.org/schema"] = c;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
      }
    }
    a.Ajv = h, e.exports = a = h, e.exports.Ajv = h, Object.defineProperty(a, "__esModule", { value: !0 }), a.default = h;
    var y = /* @__PURE__ */ It();
    Object.defineProperty(a, "KeywordCxt", { enumerable: !0, get: function() {
      return y.KeywordCxt;
    } });
    var g = /* @__PURE__ */ W();
    Object.defineProperty(a, "_", { enumerable: !0, get: function() {
      return g._;
    } }), Object.defineProperty(a, "str", { enumerable: !0, get: function() {
      return g.str;
    } }), Object.defineProperty(a, "stringify", { enumerable: !0, get: function() {
      return g.stringify;
    } }), Object.defineProperty(a, "nil", { enumerable: !0, get: function() {
      return g.nil;
    } }), Object.defineProperty(a, "Name", { enumerable: !0, get: function() {
      return g.Name;
    } }), Object.defineProperty(a, "CodeGen", { enumerable: !0, get: function() {
      return g.CodeGen;
    } });
    var N = /* @__PURE__ */ Bt();
    Object.defineProperty(a, "ValidationError", { enumerable: !0, get: function() {
      return N.default;
    } });
    var I = /* @__PURE__ */ jt();
    Object.defineProperty(a, "MissingRefError", { enumerable: !0, get: function() {
      return I.default;
    } });
  })(ze, ze.exports)), ze.exports;
}
var Va = /* @__PURE__ */ Nn();
const Ua = /* @__PURE__ */ gn(Va);
var Et = { exports: {} }, xt = {}, yn;
function La() {
  return yn || (yn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function a(D, L) {
      return { validate: D, compare: L };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: a(o, d),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: a(h(!0), y),
      "date-time": a(I(!0), O),
      "iso-time": a(h(), g),
      "iso-date-time": a(I(), R),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: _,
      "uri-reference": /^(?:[a-z][a-z0-9+\-.]*:)?(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'"()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'"()*+,;=:@]|%[0-9a-f]{2})*)*)?(?:\?(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'"()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i,
      // uri-template: https://tools.ietf.org/html/rfc6570
      "uri-template": /^(?:(?:[^\x00-\x20"'<>%\\^`{|}]|%[0-9a-f]{2})|\{[+#./;?&=,!@|]?(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?(?:,(?:[a-z0-9_]|%[0-9a-f]{2})+(?::[1-9][0-9]{0,3}|\*)?)*\})*$/i,
      // For the source: https://gist.github.com/dperini/729294
      // For test cases: https://mathiasbynens.be/demo/url-regex
      url: /^(?:https?|ftp):\/\/(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)(?:\.(?:[a-z0-9\u{00a1}-\u{ffff}]+-)*[a-z0-9\u{00a1}-\u{ffff}]+)*(?:\.(?:[a-z\u{00a1}-\u{ffff}]{2,})))(?::\d{2,5})?(?:\/[^\s]*)?$/iu,
      email: /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
      hostname: /^(?=.{1,253}\.?$)[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[-0-9a-z]{0,61}[0-9a-z])?)*\.?$/i,
      // optimized https://www.safaribooksonline.com/library/view/regular-expressions-cookbook/9780596802837/ch07s16.html
      ipv4: /^(?:(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)$/,
      ipv6: /^((([0-9a-f]{1,4}:){7}([0-9a-f]{1,4}|:))|(([0-9a-f]{1,4}:){6}(:[0-9a-f]{1,4}|((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){5}(((:[0-9a-f]{1,4}){1,2})|:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3})|:))|(([0-9a-f]{1,4}:){4}(((:[0-9a-f]{1,4}){1,3})|((:[0-9a-f]{1,4})?:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){3}(((:[0-9a-f]{1,4}){1,4})|((:[0-9a-f]{1,4}){0,2}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){2}(((:[0-9a-f]{1,4}){1,5})|((:[0-9a-f]{1,4}){0,3}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(([0-9a-f]{1,4}:){1}(((:[0-9a-f]{1,4}){1,6})|((:[0-9a-f]{1,4}){0,4}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:))|(:(((:[0-9a-f]{1,4}){1,7})|((:[0-9a-f]{1,4}){0,5}:((25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}))|:)))$/i,
      regex: K,
      // uuid: http://tools.ietf.org/html/rfc4122
      uuid: /^(?:urn:uuid:)?[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}$/i,
      // JSON-pointer: https://tools.ietf.org/html/rfc6901
      // uri fragment: https://tools.ietf.org/html/rfc3986#appendix-A
      "json-pointer": /^(?:\/(?:[^~/]|~0|~1)*)*$/,
      "json-pointer-uri-fragment": /^#(?:\/(?:[a-z0-9_\-.!$&'()*+,;:=@]|%[0-9a-f]{2}|~0|~1)*)*$/i,
      // relative JSON-pointer: http://tools.ietf.org/html/draft-luff-relative-json-pointer-00
      "relative-json-pointer": /^(?:0|[1-9][0-9]*)(?:#|(?:\/(?:[^~/]|~0|~1)*)*)$/,
      // the following formats are used by the openapi specification: https://spec.openapis.org/oas/v3.0.0#data-types
      // byte: https://github.com/miguelmota/is-base64
      byte: p,
      // signed 32 bit integer
      int32: { type: "number", validate: i },
      // signed 64 bit integer
      int64: { type: "number", validate: l },
      // C-type float
      float: { type: "number", validate: q },
      // C-type double
      double: { type: "number", validate: q },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: a(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, d),
      time: a(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, y),
      "date-time": a(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, O),
      "iso-time": a(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, g),
      "iso-date-time": a(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, R),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function w(D) {
      return D % 4 === 0 && (D % 100 !== 0 || D % 400 === 0);
    }
    const f = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, E = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function o(D) {
      const L = f.exec(D);
      if (!L)
        return !1;
      const H = +L[1], x = +L[2], Z = +L[3];
      return x >= 1 && x <= 12 && Z >= 1 && Z <= (x === 2 && w(H) ? 29 : E[x]);
    }
    function d(D, L) {
      if (D && L)
        return D > L ? 1 : D < L ? -1 : 0;
    }
    const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function h(D) {
      return function(H) {
        const x = c.exec(H);
        if (!x)
          return !1;
        const Z = +x[1], ie = +x[2], oe = +x[3], Y = x[4], ue = x[5] === "-" ? -1 : 1, z = +(x[6] || 0), u = +(x[7] || 0);
        if (z > 23 || u > 59 || D && !Y)
          return !1;
        if (Z <= 23 && ie <= 59 && oe < 60)
          return !0;
        const b = ie - u * ue, m = Z - z * ue - (b < 0 ? 1 : 0);
        return (m === 23 || m === -1) && (b === 59 || b === -1) && oe < 61;
      };
    }
    function y(D, L) {
      if (!(D && L))
        return;
      const H = (/* @__PURE__ */ new Date("2020-01-01T" + D)).valueOf(), x = (/* @__PURE__ */ new Date("2020-01-01T" + L)).valueOf();
      if (H && x)
        return H - x;
    }
    function g(D, L) {
      if (!(D && L))
        return;
      const H = c.exec(D), x = c.exec(L);
      if (H && x)
        return D = H[1] + H[2] + H[3], L = x[1] + x[2] + x[3], D > L ? 1 : D < L ? -1 : 0;
    }
    const N = /t|\s/i;
    function I(D) {
      const L = h(D);
      return function(x) {
        const Z = x.split(N);
        return Z.length === 2 && o(Z[0]) && L(Z[1]);
      };
    }
    function O(D, L) {
      if (!(D && L))
        return;
      const H = new Date(D).valueOf(), x = new Date(L).valueOf();
      if (H && x)
        return H - x;
    }
    function R(D, L) {
      if (!(D && L))
        return;
      const [H, x] = D.split(N), [Z, ie] = L.split(N), oe = d(H, Z);
      if (oe !== void 0)
        return oe || y(x, ie);
    }
    const P = /\/|:/, v = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function _(D) {
      return P.test(D) && v.test(D);
    }
    const s = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function p(D) {
      return s.lastIndex = 0, s.test(D);
    }
    const S = -2147483648, n = 2 ** 31 - 1;
    function i(D) {
      return Number.isInteger(D) && D <= n && D >= S;
    }
    function l(D) {
      return Number.isInteger(D);
    }
    function q() {
      return !0;
    }
    const M = /[^\\]\\Z/;
    function K(D) {
      if (M.test(D))
        return !1;
      try {
        return new RegExp(D), !0;
      } catch {
        return !1;
      }
    }
  })(xt)), xt;
}
var Gt = {}, vn;
function Ka() {
  return vn || (vn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const a = /* @__PURE__ */ Nn(), w = /* @__PURE__ */ W(), f = w.operators, E = {
      formatMaximum: { okStr: "<=", ok: f.LTE, fail: f.GT },
      formatMinimum: { okStr: ">=", ok: f.GTE, fail: f.LT },
      formatExclusiveMaximum: { okStr: "<", ok: f.LT, fail: f.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: f.GT, fail: f.LTE }
    }, o = {
      message: ({ keyword: c, schemaCode: h }) => (0, w.str)`should be ${E[c].okStr} ${h}`,
      params: ({ keyword: c, schemaCode: h }) => (0, w._)`{comparison: ${E[c].okStr}, limit: ${h}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(E),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: o,
      code(c) {
        const { gen: h, data: y, schemaCode: g, keyword: N, it: I } = c, { opts: O, self: R } = I;
        if (!O.validateFormats)
          return;
        const P = new a.KeywordCxt(I, R.RULES.all.format.definition, "format");
        P.$data ? v() : _();
        function v() {
          const p = h.scopeValue("formats", {
            ref: R.formats,
            code: O.code.formats
          }), S = h.const("fmt", (0, w._)`${p}[${P.schemaCode}]`);
          c.fail$data((0, w.or)((0, w._)`typeof ${S} != "object"`, (0, w._)`${S} instanceof RegExp`, (0, w._)`typeof ${S}.compare != "function"`, s(S)));
        }
        function _() {
          const p = P.schema, S = R.formats[p];
          if (!S || S === !0)
            return;
          if (typeof S != "object" || S instanceof RegExp || typeof S.compare != "function")
            throw new Error(`"${N}": format "${p}" does not define "compare" function`);
          const n = h.scopeValue("formats", {
            key: p,
            ref: S,
            code: O.code.formats ? (0, w._)`${O.code.formats}${(0, w.getProperty)(p)}` : void 0
          });
          c.fail$data(s(n));
        }
        function s(p) {
          return (0, w._)`${p}.compare(${y}, ${g}) ${E[N].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const d = (c) => (c.addKeyword(e.formatLimitDefinition), c);
    e.default = d;
  })(Gt)), Gt;
}
var _n;
function Ha() {
  return _n || (_n = 1, (function(e, a) {
    Object.defineProperty(a, "__esModule", { value: !0 });
    const w = La(), f = Ka(), E = /* @__PURE__ */ W(), o = new E.Name("fullFormats"), d = new E.Name("fastFormats"), c = (y, g = { keywords: !0 }) => {
      if (Array.isArray(g))
        return h(y, g, w.fullFormats, o), y;
      const [N, I] = g.mode === "fast" ? [w.fastFormats, d] : [w.fullFormats, o], O = g.formats || w.formatNames;
      return h(y, O, N, I), g.keywords && (0, f.default)(y), y;
    };
    c.get = (y, g = "full") => {
      const I = (g === "fast" ? w.fastFormats : w.fullFormats)[y];
      if (!I)
        throw new Error(`Unknown format "${y}"`);
      return I;
    };
    function h(y, g, N, I) {
      var O, R;
      (O = (R = y.opts.code).formats) !== null && O !== void 0 || (R.formats = (0, E._)`require("ajv-formats/dist/formats").${I}`);
      for (const P of g)
        y.addFormat(P, N[P]);
    }
    e.exports = a = c, Object.defineProperty(a, "__esModule", { value: !0 }), a.default = c;
  })(Et, Et.exports)), Et.exports;
}
var xa = Ha();
const Ga = /* @__PURE__ */ gn(xa), Ja = { class: "ac-options" }, Ba = { class: "kx-focus-outline" }, Wa = {
  key: 0,
  class: "ac-muted"
}, Za = {
  key: 0,
  class: "ac-muted"
}, Qa = { class: "ac-option-head" }, Ya = { class: "ac-mono" }, Xa = { class: "ac-muted" }, es = {
  key: 1,
  class: "ac-muted ac-mono"
}, ts = ["aria-label", "aria-invalid", "aria-describedby", "value", "onChange"], rs = { value: "" }, ns = ["value"], as = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], ss = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], os = ["id"], is = {
  key: 0,
  class: "ac-muted"
}, ds = /* @__PURE__ */ kn({
  __name: "driver-options",
  props: {
    options: {},
    modelValue: {},
    locked: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(e, { emit: a }) {
    const w = e, f = a, E = St(""), o = St({}), d = St({}), c = In(), h = new Ua({ strict: !1, allErrors: !0 });
    Ga(h);
    const y = me(() => new Map(w.options.map((n) => {
      try {
        return [n.name, n.schema ? h.compile(n.schema) : void 0];
      } catch {
        return [n.name, "Invalid option schema"];
      }
    }))), g = me(() => {
      const n = E.value.trim().toLowerCase();
      return Jt(w.options).filter((i) => !n || [i.name, i.label, i.description, i.section, i.group].join(" ").toLowerCase().includes(n)).sort((i, l) => i.section.localeCompare(l.section) || i.group.localeCompare(l.group) || i.order - l.order || i.name.localeCompare(l.name));
    }), N = me(() => Object.keys(w.modelValue).length);
    Pt(() => Object.fromEntries(w.options.map((n) => [n.name, JSON.stringify([w.modelValue[n.name], w.locked?.[n.name], n])])), (n, i) => {
      for (const l of Object.keys(o.value))
        (n[l] !== i?.[l] || w.locked && l in w.locked || !(l in n)) && (delete o.value[l], delete d.value[l]);
      f("invalid", Object.keys(d.value).length);
    }, { immediate: !0 });
    function I(n, i) {
      const l = { ...w.modelValue };
      i === void 0 ? delete l[n] : l[n] = i, f("update:modelValue", l);
    }
    function O(n) {
      if (n.name in o.value) return o.value[n.name];
      const i = w.modelValue[n.name];
      return i === void 0 ? "" : n.type === "json" ? JSON.stringify(i) : n.type === "ids" && Array.isArray(i) && i.every((l) => typeof l == "string") ? i.join(", ") : String(i);
    }
    function R(n, i) {
      i ? d.value[n] = i : delete d.value[n], f("invalid", Object.keys(d.value).length);
    }
    function P(n, i) {
      const l = y.value.get(n.name);
      if (i !== void 0 && l) {
        if (typeof l == "string") {
          R(n.name, l);
          return;
        }
        if (!l(i)) {
          R(n.name, h.errorsText(l.errors));
          return;
        }
      }
      R(n.name), I(n.name, i);
    }
    function v(n, i) {
      o.value[n.name] = i;
      const l = i.trim();
      if (!l) {
        P(n, void 0);
        return;
      }
      if (n.type === "json") {
        let q;
        try {
          q = JSON.parse(l);
        } catch {
          R(n.name, "Not valid JSON");
          return;
        }
        P(n, q);
      } else if (n.type === "ids") P(n, l.split(",").map((q) => q.trim()).filter(Boolean));
      else if ([n.type, n.schema?.type].some((q) => q === "number" || q === "integer")) {
        const q = Number(l);
        if (!Number.isFinite(q)) {
          R(n.name, "Not a finite number");
          return;
        }
        if ((n.type === "integer" || n.schema?.type === "integer") && !Number.isInteger(q)) {
          R(n.name, "Not an integer");
          return;
        }
        P(n, q);
      } else P(n, l);
    }
    function _(n, i) {
      if (!(i.target instanceof HTMLSelectElement)) return;
      const l = i.target.value;
      if (!l) {
        P(n, void 0);
        return;
      }
      P(n, n.type === "boolean" ? l === "true" : (n.values ?? []).find((q) => String(q) === l) ?? l);
    }
    function s(n, i) {
      (i.target instanceof HTMLInputElement || i.target instanceof HTMLTextAreaElement) && v(n, i.target.value);
    }
    function p(n) {
      const i = w.modelValue[n.name];
      return i === void 0 ? "" : String(i);
    }
    function S(n) {
      return n.default === void 0 || n.default === null ? "CLI default" : `default: ${JSON.stringify(n.default)}`;
    }
    return (n, i) => (le(), de("details", Ja, [
      Ee("summary", Ba, [
        i[1] || (i[1] = Ct("Driver options", -1)),
        N.value ? (le(), de("span", Wa, " · " + ge(N.value) + " set", 1)) : Ce("", !0)
      ]),
      jn(Ee("input", {
        "onUpdate:modelValue": i[0] || (i[0] = (l) => E.value = l),
        class: "ac-mono ac-options-filter kx-focus-halo",
        placeholder: "Filter options",
        "aria-label": "Filter driver options"
      }, null, 512), [
        [Tn, E.value]
      ]),
      (le(!0), de(Me, null, Xt(g.value, (l, q) => (le(), de("div", {
        key: l.name,
        class: "ac-option"
      }, [
        q === 0 || l.section !== g.value[q - 1].section || l.group !== g.value[q - 1].group ? (le(), de("div", Za, ge([l.section, l.group].filter(Boolean).join(" · ")), 1)) : Ce("", !0),
        Ee("div", Qa, [
          Ee("span", Ya, ge(l.name), 1),
          Ee("small", Xa, [
            Ct(ge(l.label), 1),
            l.description && l.description !== l.label ? (le(), de(Me, { key: 0 }, [
              Ct(" — " + ge(l.description), 1)
            ], 64)) : Ce("", !0)
          ])
        ]),
        e.locked && l.name in e.locked ? (le(), de("small", es, ge(JSON.stringify(e.locked[l.name])) + " · set by unattended mode", 1)) : l.type === "boolean" || l.type === "enum" ? (le(), de("select", {
          key: 2,
          class: "kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!d.value[l.name],
          "aria-describedby": d.value[l.name] ? `${Fe(c)}-${l.name}-error` : void 0,
          value: p(l),
          onChange: (M) => _(l, M)
        }, [
          Ee("option", rs, ge(S(l)), 1),
          l.type === "boolean" ? (le(), de(Me, { key: 0 }, [
            i[2] || (i[2] = Ee("option", { value: "true" }, "on", -1)),
            i[3] || (i[3] = Ee("option", { value: "false" }, "off", -1))
          ], 64)) : (le(!0), de(Me, { key: 1 }, Xt(l.values ?? [], (M) => (le(), de("option", {
            key: String(M),
            value: String(M)
          }, ge(M), 9, ns))), 128))
        ], 40, ts)) : l.type === "json" ? (le(), de("textarea", {
          key: 3,
          rows: "2",
          class: "ac-mono kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!d.value[l.name],
          "aria-describedby": d.value[l.name] ? `${Fe(c)}-${l.name}-error` : void 0,
          value: O(l),
          placeholder: `JSON · ${S(l)}`,
          onInput: (M) => s(l, M)
        }, null, 40, as)) : (le(), de("input", {
          key: 4,
          class: "ac-mono kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!d.value[l.name],
          "aria-describedby": d.value[l.name] ? `${Fe(c)}-${l.name}-error` : void 0,
          value: O(l),
          placeholder: l.type === "ids" ? "comma separated" : S(l),
          onInput: (M) => s(l, M)
        }, null, 40, ss)),
        d.value[l.name] ? (le(), de("small", {
          key: 5,
          id: `${Fe(c)}-${l.name}-error`,
          class: "kx-err",
          role: "alert"
        }, ge(d.value[l.name]), 9, os)) : Ce("", !0)
      ]))), 128)),
      g.value.length ? Ce("", !0) : (le(), de("p", is, "No matching options."))
    ]));
  }
});
export {
  ds as _,
  An as d,
  ls as u
};
