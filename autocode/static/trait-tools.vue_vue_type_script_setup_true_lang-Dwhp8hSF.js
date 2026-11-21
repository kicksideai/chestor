import { ref as $e, computed as de, watch as ze, defineComponent as wn, useId as Tn, openBlock as ne, createElementBlock as ae, createElementVNode as me, createTextVNode as kt, toDisplayString as pe, createCommentVNode as Pe, withDirectives as Cn, vModelText as qn, Fragment as je, renderList as Jt, unref as Ve, onBeforeUnmount as An, onMounted as Dn } from "vue";
import { d as Mn, f as Fn, a as Xt, A as er, e as tr } from "./presentation-Bq-Cf4TV.js";
import { loadByTagName as zn } from "@wippy-fe/proxy";
import { o as Vn, r as qt, u as rr, d as Un, s as Ln } from "./dto-CHThMR8e.js";
function Kn(e, n) {
  return e.agents.find((w) => n.some((m) => m.agent === w.id && m.usable && m.enabled))?.id ?? e.agents[0]?.id ?? "";
}
function nr(e, n) {
  return e.filter((w) => w.usable && w.agents.includes(n));
}
function xn(e) {
  return e.filter((n) => !n.profiles?.length || n.profiles.includes("batch"));
}
function Ns(e, n) {
  return n ? {
    tools: n.tools,
    agent: n.agent,
    account_id: n.account_id,
    account_pool: n.account_pool,
    endpoint: n.endpoint,
    image_id: n.image_id,
    workspace_id: n.workspace_id,
    repo_url: n.repo_url,
    repo_ref: n.repo_ref,
    run_timeout: n.run_timeout,
    unattended: n.unattended,
    ...Object.fromEntries(Object.entries(e).filter(([, w]) => w !== void 0))
  } : e;
}
function Is(e, n, w, m = () => !1) {
  const S = Mn(), s = $e(0), d = de(() => n.catalog()?.agents ?? []), u = de(() => d.value.find((a) => a.id === e.value.agent)), f = de(() => n.accounts().filter((a) => a.agent === e.value.agent && a.usable && a.enabled)), $ = de(() => f.value.filter((a) => Fn(a, S.value) === "ready")), v = de(() => nr(n.images(), e.value.agent ?? "")), O = de(() => !!e.value.agent && !u.value), I = de(() => !v.value.some((a) => a.id === e.value.image_id)), R = de(() => !!e.value.account_id && !f.value.some((a) => a.id === e.value.account_id)), N = de(() => !!e.value.workspace_id && !n.workspaces().some((a) => a.id === e.value.workspace_id)), k = de(() => e.value.options ?? {});
  function y(a) {
    s.value = 0;
    const _ = nr(n.images(), a), P = d.value.find((i) => i.id === a);
    return {
      ...e.value,
      agent: a,
      account_id: "",
      options: {},
      unattended: !!P?.unattended,
      image_id: _.find((i) => i.id === e.value.image_id)?.id ?? _[0]?.id ?? ""
    };
  }
  function g() {
    const a = n.catalog();
    return { ...y(a ? Kn(a, n.accounts()) : ""), workspace_id: "" };
  }
  return w === "live" && (ze([v, f, n.workspaces], () => {
    m() || (I.value && (e.value.image_id = v.value[0]?.id ?? ""), R.value && (e.value.account_id = ""), N.value && (e.value.workspace_id = ""));
  }, { immediate: !0 }), ze(() => u.value?.id, () => {
    s.value = 0;
  })), {
    now: S,
    driver: u,
    agentAccounts: f,
    ready: $,
    agentImages: v,
    invalidAgent: O,
    invalidImage: I,
    invalidAccount: R,
    invalidWorkspace: N,
    invalidOptions: s,
    optionValues: k,
    selectAgent: y,
    initialSelection: g
  };
}
function bn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Ue = { exports: {} }, At = {}, be = {}, Re = {}, Dt = {}, Mt = {}, Ft = {}, ar;
function Ot() {
  return ar || (ar = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class n {
    }
    e._CodeOrName = n, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class w extends n {
      constructor(a) {
        if (super(), !e.IDENTIFIER.test(a))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = a;
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
    class m extends n {
      constructor(a) {
        super(), this._items = typeof a == "string" ? [a] : a;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const a = this._items[0];
        return a === "" || a === '""';
      }
      get str() {
        var a;
        return (a = this._str) !== null && a !== void 0 ? a : this._str = this._items.reduce((_, P) => `${_}${P}`, "");
      }
      get names() {
        var a;
        return (a = this._names) !== null && a !== void 0 ? a : this._names = this._items.reduce((_, P) => (P instanceof w && (_[P.str] = (_[P.str] || 0) + 1), _), {});
      }
    }
    e._Code = m, e.nil = new m("");
    function S(g, ...a) {
      const _ = [g[0]];
      let P = 0;
      for (; P < a.length; )
        u(_, a[P]), _.push(g[++P]);
      return new m(_);
    }
    e._ = S;
    const s = new m("+");
    function d(g, ...a) {
      const _ = [R(g[0])];
      let P = 0;
      for (; P < a.length; )
        _.push(s), u(_, a[P]), _.push(s, R(g[++P]));
      return f(_), new m(_);
    }
    e.str = d;
    function u(g, a) {
      a instanceof m ? g.push(...a._items) : a instanceof w ? g.push(a) : g.push(O(a));
    }
    e.addCodeArg = u;
    function f(g) {
      let a = 1;
      for (; a < g.length - 1; ) {
        if (g[a] === s) {
          const _ = $(g[a - 1], g[a + 1]);
          if (_ !== void 0) {
            g.splice(a - 1, 3, _);
            continue;
          }
          g[a++] = "+";
        }
        a++;
      }
    }
    function $(g, a) {
      if (a === '""')
        return g;
      if (g === '""')
        return a;
      if (typeof g == "string")
        return a instanceof w || g[g.length - 1] !== '"' ? void 0 : typeof a != "string" ? `${g.slice(0, -1)}${a}"` : a[0] === '"' ? g.slice(0, -1) + a.slice(1) : void 0;
      if (typeof a == "string" && a[0] === '"' && !(g instanceof w))
        return `"${g}${a.slice(1)}`;
    }
    function v(g, a) {
      return a.emptyStr() ? g : g.emptyStr() ? a : d`${g}${a}`;
    }
    e.strConcat = v;
    function O(g) {
      return typeof g == "number" || typeof g == "boolean" || g === null ? g : R(Array.isArray(g) ? g.join(",") : g);
    }
    function I(g) {
      return new m(R(g));
    }
    e.stringify = I;
    function R(g) {
      return JSON.stringify(g).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = R;
    function N(g) {
      return typeof g == "string" && e.IDENTIFIER.test(g) ? new m(`.${g}`) : S`[${g}]`;
    }
    e.getProperty = N;
    function k(g) {
      if (typeof g == "string" && e.IDENTIFIER.test(g))
        return new m(`${g}`);
      throw new Error(`CodeGen: invalid export name: ${g}, use explicit $id name mapping`);
    }
    e.getEsmExportName = k;
    function y(g) {
      return new m(g.toString());
    }
    e.regexpCode = y;
  })(Ft)), Ft;
}
var zt = {}, sr;
function or() {
  return sr || (sr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const n = /* @__PURE__ */ Ot();
    class w extends Error {
      constructor($) {
        super(`CodeGen: "code" for ${$} not defined`), this.value = $.value;
      }
    }
    var m;
    (function(f) {
      f[f.Started = 0] = "Started", f[f.Completed = 1] = "Completed";
    })(m || (e.UsedValueState = m = {})), e.varKinds = {
      const: new n.Name("const"),
      let: new n.Name("let"),
      var: new n.Name("var")
    };
    class S {
      constructor({ prefixes: $, parent: v } = {}) {
        this._names = {}, this._prefixes = $, this._parent = v;
      }
      toName($) {
        return $ instanceof n.Name ? $ : this.name($);
      }
      name($) {
        return new n.Name(this._newName($));
      }
      _newName($) {
        const v = this._names[$] || this._nameGroup($);
        return `${$}${v.index++}`;
      }
      _nameGroup($) {
        var v, O;
        if (!((O = (v = this._parent) === null || v === void 0 ? void 0 : v._prefixes) === null || O === void 0) && O.has($) || this._prefixes && !this._prefixes.has($))
          throw new Error(`CodeGen: prefix "${$}" is not allowed in this scope`);
        return this._names[$] = { prefix: $, index: 0 };
      }
    }
    e.Scope = S;
    class s extends n.Name {
      constructor($, v) {
        super(v), this.prefix = $;
      }
      setValue($, { property: v, itemIndex: O }) {
        this.value = $, this.scopePath = (0, n._)`.${new n.Name(v)}[${O}]`;
      }
    }
    e.ValueScopeName = s;
    const d = (0, n._)`\n`;
    class u extends S {
      constructor($) {
        super($), this._values = {}, this._scope = $.scope, this.opts = { ...$, _n: $.lines ? d : n.nil };
      }
      get() {
        return this._scope;
      }
      name($) {
        return new s($, this._newName($));
      }
      value($, v) {
        var O;
        if (v.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const I = this.toName($), { prefix: R } = I, N = (O = v.key) !== null && O !== void 0 ? O : v.ref;
        let k = this._values[R];
        if (k) {
          const a = k.get(N);
          if (a)
            return a;
        } else
          k = this._values[R] = /* @__PURE__ */ new Map();
        k.set(N, I);
        const y = this._scope[R] || (this._scope[R] = []), g = y.length;
        return y[g] = v.ref, I.setValue(v, { property: R, itemIndex: g }), I;
      }
      getValue($, v) {
        const O = this._values[$];
        if (O)
          return O.get(v);
      }
      scopeRefs($, v = this._values) {
        return this._reduceValues(v, (O) => {
          if (O.scopePath === void 0)
            throw new Error(`CodeGen: name "${O}" has no value`);
          return (0, n._)`${$}${O.scopePath}`;
        });
      }
      scopeCode($ = this._values, v, O) {
        return this._reduceValues($, (I) => {
          if (I.value === void 0)
            throw new Error(`CodeGen: name "${I}" has no value`);
          return I.value.code;
        }, v, O);
      }
      _reduceValues($, v, O = {}, I) {
        let R = n.nil;
        for (const N in $) {
          const k = $[N];
          if (!k)
            continue;
          const y = O[N] = O[N] || /* @__PURE__ */ new Map();
          k.forEach((g) => {
            if (y.has(g))
              return;
            y.set(g, m.Started);
            let a = v(g);
            if (a) {
              const _ = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              R = (0, n._)`${R}${_} ${g} = ${a};${this.opts._n}`;
            } else if (a = I?.(g))
              R = (0, n._)`${R}${a}${this.opts._n}`;
            else
              throw new w(g);
            y.set(g, m.Completed);
          });
        }
        return R;
      }
    }
    e.ValueScope = u;
  })(zt)), zt;
}
var ir;
function W() {
  return ir || (ir = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const n = /* @__PURE__ */ Ot(), w = /* @__PURE__ */ or();
    var m = /* @__PURE__ */ Ot();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return m._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return m.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return m.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return m.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return m.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return m.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return m.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return m.Name;
    } });
    var S = /* @__PURE__ */ or();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return S.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return S.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return S.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return S.varKinds;
    } }), e.operators = {
      GT: new n._Code(">"),
      GTE: new n._Code(">="),
      LT: new n._Code("<"),
      LTE: new n._Code("<="),
      EQ: new n._Code("==="),
      NEQ: new n._Code("!=="),
      NOT: new n._Code("!"),
      OR: new n._Code("||"),
      AND: new n._Code("&&"),
      ADD: new n._Code("+")
    };
    class s {
      optimizeNodes() {
        return this;
      }
      optimizeNames(t, r) {
        return this;
      }
    }
    class d extends s {
      constructor(t, r, b) {
        super(), this.varKind = t, this.name = r, this.rhs = b;
      }
      render({ es5: t, _n: r }) {
        const b = t ? w.varKinds.var : this.varKind, C = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${b} ${this.name}${C};` + r;
      }
      optimizeNames(t, r) {
        if (t[this.name.str])
          return this.rhs && (this.rhs = H(this.rhs, t, r)), this;
      }
      get names() {
        return this.rhs instanceof n._CodeOrName ? this.rhs.names : {};
      }
    }
    class u extends s {
      constructor(t, r, b) {
        super(), this.lhs = t, this.rhs = r, this.sideEffects = b;
      }
      render({ _n: t }) {
        return `${this.lhs} = ${this.rhs};` + t;
      }
      optimizeNames(t, r) {
        if (!(this.lhs instanceof n.Name && !t[this.lhs.str] && !this.sideEffects))
          return this.rhs = H(this.rhs, t, r), this;
      }
      get names() {
        const t = this.lhs instanceof n.Name ? {} : { ...this.lhs.names };
        return L(t, this.rhs);
      }
    }
    class f extends u {
      constructor(t, r, b, C) {
        super(t, b, C), this.op = r;
      }
      render({ _n: t }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + t;
      }
    }
    class $ extends s {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `${this.label}:` + t;
      }
    }
    class v extends s {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `break${this.label ? ` ${this.label}` : ""};` + t;
      }
    }
    class O extends s {
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
    class I extends s {
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
        return this.code = H(this.code, t, r), this;
      }
      get names() {
        return this.code instanceof n._CodeOrName ? this.code.names : {};
      }
    }
    class R extends s {
      constructor(t = []) {
        super(), this.nodes = t;
      }
      render(t) {
        return this.nodes.reduce((r, b) => r + b.render(t), "");
      }
      optimizeNodes() {
        const { nodes: t } = this;
        let r = t.length;
        for (; r--; ) {
          const b = t[r].optimizeNodes();
          Array.isArray(b) ? t.splice(r, 1, ...b) : b ? t[r] = b : t.splice(r, 1);
        }
        return t.length > 0 ? this : void 0;
      }
      optimizeNames(t, r) {
        const { nodes: b } = this;
        let C = b.length;
        for (; C--; ) {
          const T = b[C];
          T.optimizeNames(t, r) || (Z(t, T.names), b.splice(C, 1));
        }
        return b.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((t, r) => K(t, r.names), {});
      }
    }
    class N extends R {
      render(t) {
        return "{" + t._n + super.render(t) + "}" + t._n;
      }
    }
    class k extends R {
    }
    class y extends N {
    }
    y.kind = "else";
    class g extends N {
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
          const b = r.optimizeNodes();
          r = this.else = Array.isArray(b) ? new y(b) : b;
        }
        if (r)
          return t === !1 ? r instanceof g ? r : r.nodes : this.nodes.length ? this : new g(ce(t), r instanceof g ? [r] : r.nodes);
        if (!(t === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(t, r) {
        var b;
        if (this.else = (b = this.else) === null || b === void 0 ? void 0 : b.optimizeNames(t, r), !!(super.optimizeNames(t, r) || this.else))
          return this.condition = H(this.condition, t, r), this;
      }
      get names() {
        const t = super.names;
        return L(t, this.condition), this.else && K(t, this.else.names), t;
      }
    }
    g.kind = "if";
    class a extends N {
    }
    a.kind = "for";
    class _ extends a {
      constructor(t) {
        super(), this.iteration = t;
      }
      render(t) {
        return `for(${this.iteration})` + super.render(t);
      }
      optimizeNames(t, r) {
        if (super.optimizeNames(t, r))
          return this.iteration = H(this.iteration, t, r), this;
      }
      get names() {
        return K(super.names, this.iteration.names);
      }
    }
    class P extends a {
      constructor(t, r, b, C) {
        super(), this.varKind = t, this.name = r, this.from = b, this.to = C;
      }
      render(t) {
        const r = t.es5 ? w.varKinds.var : this.varKind, { name: b, from: C, to: T } = this;
        return `for(${r} ${b}=${C}; ${b}<${T}; ${b}++)` + super.render(t);
      }
      get names() {
        const t = L(super.names, this.from);
        return L(t, this.to);
      }
    }
    class i extends a {
      constructor(t, r, b, C) {
        super(), this.loop = t, this.varKind = r, this.name = b, this.iterable = C;
      }
      render(t) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(t);
      }
      optimizeNames(t, r) {
        if (super.optimizeNames(t, r))
          return this.iterable = H(this.iterable, t, r), this;
      }
      get names() {
        return K(super.names, this.iterable.names);
      }
    }
    class o extends N {
      constructor(t, r, b) {
        super(), this.name = t, this.args = r, this.async = b;
      }
      render(t) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(t);
      }
    }
    o.kind = "func";
    class l extends R {
      render(t) {
        return "return " + super.render(t);
      }
    }
    l.kind = "return";
    class p extends N {
      render(t) {
        let r = "try" + super.render(t);
        return this.catch && (r += this.catch.render(t)), this.finally && (r += this.finally.render(t)), r;
      }
      optimizeNodes() {
        var t, r;
        return super.optimizeNodes(), (t = this.catch) === null || t === void 0 || t.optimizeNodes(), (r = this.finally) === null || r === void 0 || r.optimizeNodes(), this;
      }
      optimizeNames(t, r) {
        var b, C;
        return super.optimizeNames(t, r), (b = this.catch) === null || b === void 0 || b.optimizeNames(t, r), (C = this.finally) === null || C === void 0 || C.optimizeNames(t, r), this;
      }
      get names() {
        const t = super.names;
        return this.catch && K(t, this.catch.names), this.finally && K(t, this.finally.names), t;
      }
    }
    class A extends N {
      constructor(t) {
        super(), this.error = t;
      }
      render(t) {
        return `catch(${this.error})` + super.render(t);
      }
    }
    A.kind = "catch";
    class F extends N {
      render(t) {
        return "finally" + super.render(t);
      }
    }
    F.kind = "finally";
    class D {
      constructor(t, r = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...r, _n: r.lines ? `
` : "" }, this._extScope = t, this._scope = new w.Scope({ parent: t }), this._nodes = [new k()];
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
        const b = this._extScope.value(t, r);
        return (this._values[b.prefix] || (this._values[b.prefix] = /* @__PURE__ */ new Set())).add(b), b;
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
      _def(t, r, b, C) {
        const T = this._scope.toName(r);
        return b !== void 0 && C && (this._constants[T.str] = b), this._leafNode(new d(t, T, b)), T;
      }
      // `const` declaration (`var` in es5 mode)
      const(t, r, b) {
        return this._def(w.varKinds.const, t, r, b);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(t, r, b) {
        return this._def(w.varKinds.let, t, r, b);
      }
      // `var` declaration with optional assignment
      var(t, r, b) {
        return this._def(w.varKinds.var, t, r, b);
      }
      // assignment code
      assign(t, r, b) {
        return this._leafNode(new u(t, r, b));
      }
      // `+=` code
      add(t, r) {
        return this._leafNode(new f(t, e.operators.ADD, r));
      }
      // appends passed SafeExpr to code or executes Block
      code(t) {
        return typeof t == "function" ? t() : t !== n.nil && this._leafNode(new I(t)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...t) {
        const r = ["{"];
        for (const [b, C] of t)
          r.length > 1 && r.push(","), r.push(b), (b !== C || this.opts.es5) && (r.push(":"), (0, n.addCodeArg)(r, C));
        return r.push("}"), new n._Code(r);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(t, r, b) {
        if (this._blockNode(new g(t)), r && b)
          this.code(r).else().code(b).endIf();
        else if (r)
          this.code(r).endIf();
        else if (b)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(t) {
        return this._elseNode(new g(t));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new y());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(g, y);
      }
      _for(t, r) {
        return this._blockNode(t), r && this.code(r).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(t, r) {
        return this._for(new _(t), r);
      }
      // `for` statement for a range of values
      forRange(t, r, b, C, T = this.opts.es5 ? w.varKinds.var : w.varKinds.let) {
        const z = this._scope.toName(t);
        return this._for(new P(T, z, r, b), () => C(z));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(t, r, b, C = w.varKinds.const) {
        const T = this._scope.toName(t);
        if (this.opts.es5) {
          const z = r instanceof n.Name ? r : this.var("_arr", r);
          return this.forRange("_i", 0, (0, n._)`${z}.length`, (G) => {
            this.var(T, (0, n._)`${z}[${G}]`), b(T);
          });
        }
        return this._for(new i("of", C, T, r), () => b(T));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(t, r, b, C = this.opts.es5 ? w.varKinds.var : w.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(t, (0, n._)`Object.keys(${r})`, b);
        const T = this._scope.toName(t);
        return this._for(new i("in", C, T, r), () => b(T));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(a);
      }
      // `label` statement
      label(t) {
        return this._leafNode(new $(t));
      }
      // `break` statement
      break(t) {
        return this._leafNode(new v(t));
      }
      // `return` statement
      return(t) {
        const r = new l();
        if (this._blockNode(r), this.code(t), r.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(l);
      }
      // `try` statement
      try(t, r, b) {
        if (!r && !b)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const C = new p();
        if (this._blockNode(C), this.code(t), r) {
          const T = this.name("e");
          this._currNode = C.catch = new A(T), r(T);
        }
        return b && (this._currNode = C.finally = new F(), this.code(b)), this._endBlockNode(A, F);
      }
      // `throw` statement
      throw(t) {
        return this._leafNode(new O(t));
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
        const b = this._nodes.length - r;
        if (b < 0 || t !== void 0 && b !== t)
          throw new Error(`CodeGen: wrong number of nodes: ${b} vs ${t} expected`);
        return this._nodes.length = r, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(t, r = n.nil, b, C) {
        return this._blockNode(new o(t, r, b)), C && this.code(C).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(o);
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
        const b = this._currNode;
        if (b instanceof t || r && b instanceof r)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${r ? `${t.kind}/${r.kind}` : t.kind}"`);
      }
      _elseNode(t) {
        const r = this._currNode;
        if (!(r instanceof g))
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
    function K(h, t) {
      for (const r in t)
        h[r] = (h[r] || 0) + (t[r] || 0);
      return h;
    }
    function L(h, t) {
      return t instanceof n._CodeOrName ? K(h, t.names) : h;
    }
    function H(h, t, r) {
      if (h instanceof n.Name)
        return b(h);
      if (!C(h))
        return h;
      return new n._Code(h._items.reduce((T, z) => (z instanceof n.Name && (z = b(z)), z instanceof n._Code ? T.push(...z._items) : T.push(z), T), []));
      function b(T) {
        const z = r[T.str];
        return z === void 0 || t[T.str] !== 1 ? T : (delete t[T.str], z);
      }
      function C(T) {
        return T instanceof n._Code && T._items.some((z) => z instanceof n.Name && t[z.str] === 1 && r[z.str] !== void 0);
      }
    }
    function Z(h, t) {
      for (const r in t)
        h[r] = (h[r] || 0) - (t[r] || 0);
    }
    function ce(h) {
      return typeof h == "boolean" || typeof h == "number" || h === null ? !h : (0, n._)`!${E(h)}`;
    }
    e.not = ce;
    const ue = c(e.operators.AND);
    function Y(...h) {
      return h.reduce(ue);
    }
    e.and = Y;
    const le = c(e.operators.OR);
    function V(...h) {
      return h.reduce(le);
    }
    e.or = V;
    function c(h) {
      return (t, r) => t === n.nil ? r : r === n.nil ? t : (0, n._)`${E(t)} ${h} ${E(r)}`;
    }
    function E(h) {
      return h instanceof n.Name ? h : (0, n._)`(${h})`;
    }
  })(Mt)), Mt;
}
var B = {}, ur;
function Q() {
  if (ur) return B;
  ur = 1, Object.defineProperty(B, "__esModule", { value: !0 }), B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Ot();
  function w(i) {
    const o = {};
    for (const l of i)
      o[l] = !0;
    return o;
  }
  B.toHash = w;
  function m(i, o) {
    return typeof o == "boolean" ? o : Object.keys(o).length === 0 ? !0 : (S(i, o), !s(o, i.self.RULES.all));
  }
  B.alwaysValidSchema = m;
  function S(i, o = i.schema) {
    const { opts: l, self: p } = i;
    if (!l.strictSchema || typeof o == "boolean")
      return;
    const A = p.RULES.keywords;
    for (const F in o)
      A[F] || P(i, `unknown keyword: "${F}"`);
  }
  B.checkUnknownRules = S;
  function s(i, o) {
    if (typeof i == "boolean")
      return !i;
    for (const l in i)
      if (o[l])
        return !0;
    return !1;
  }
  B.schemaHasRules = s;
  function d(i, o) {
    if (typeof i == "boolean")
      return !i;
    for (const l in i)
      if (l !== "$ref" && o.all[l])
        return !0;
    return !1;
  }
  B.schemaHasRulesButRef = d;
  function u({ topSchemaRef: i, schemaPath: o }, l, p, A) {
    if (!A) {
      if (typeof l == "number" || typeof l == "boolean")
        return l;
      if (typeof l == "string")
        return (0, e._)`${l}`;
    }
    return (0, e._)`${i}${o}${(0, e.getProperty)(p)}`;
  }
  B.schemaRefOrVal = u;
  function f(i) {
    return O(decodeURIComponent(i));
  }
  B.unescapeFragment = f;
  function $(i) {
    return encodeURIComponent(v(i));
  }
  B.escapeFragment = $;
  function v(i) {
    return typeof i == "number" ? `${i}` : i.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  B.escapeJsonPointer = v;
  function O(i) {
    return i.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  B.unescapeJsonPointer = O;
  function I(i, o) {
    if (Array.isArray(i))
      for (const l of i)
        o(l);
    else
      o(i);
  }
  B.eachItem = I;
  function R({ mergeNames: i, mergeToName: o, mergeValues: l, resultToName: p }) {
    return (A, F, D, K) => {
      const L = D === void 0 ? F : D instanceof e.Name ? (F instanceof e.Name ? i(A, F, D) : o(A, F, D), D) : F instanceof e.Name ? (o(A, D, F), F) : l(F, D);
      return K === e.Name && !(L instanceof e.Name) ? p(A, L) : L;
    };
  }
  B.mergeEvaluated = {
    props: R({
      mergeNames: (i, o, l) => i.if((0, e._)`${l} !== true && ${o} !== undefined`, () => {
        i.if((0, e._)`${o} === true`, () => i.assign(l, !0), () => i.assign(l, (0, e._)`${l} || {}`).code((0, e._)`Object.assign(${l}, ${o})`));
      }),
      mergeToName: (i, o, l) => i.if((0, e._)`${l} !== true`, () => {
        o === !0 ? i.assign(l, !0) : (i.assign(l, (0, e._)`${l} || {}`), k(i, l, o));
      }),
      mergeValues: (i, o) => i === !0 ? !0 : { ...i, ...o },
      resultToName: N
    }),
    items: R({
      mergeNames: (i, o, l) => i.if((0, e._)`${l} !== true && ${o} !== undefined`, () => i.assign(l, (0, e._)`${o} === true ? true : ${l} > ${o} ? ${l} : ${o}`)),
      mergeToName: (i, o, l) => i.if((0, e._)`${l} !== true`, () => i.assign(l, o === !0 ? !0 : (0, e._)`${l} > ${o} ? ${l} : ${o}`)),
      mergeValues: (i, o) => i === !0 ? !0 : Math.max(i, o),
      resultToName: (i, o) => i.var("items", o)
    })
  };
  function N(i, o) {
    if (o === !0)
      return i.var("props", !0);
    const l = i.var("props", (0, e._)`{}`);
    return o !== void 0 && k(i, l, o), l;
  }
  B.evaluatedPropsToName = N;
  function k(i, o, l) {
    Object.keys(l).forEach((p) => i.assign((0, e._)`${o}${(0, e.getProperty)(p)}`, !0));
  }
  B.setEvaluated = k;
  const y = {};
  function g(i, o) {
    return i.scopeValue("func", {
      ref: o,
      code: y[o.code] || (y[o.code] = new n._Code(o.code))
    });
  }
  B.useFunc = g;
  var a;
  (function(i) {
    i[i.Num = 0] = "Num", i[i.Str = 1] = "Str";
  })(a || (B.Type = a = {}));
  function _(i, o, l) {
    if (i instanceof e.Name) {
      const p = o === a.Num;
      return l ? p ? (0, e._)`"[" + ${i} + "]"` : (0, e._)`"['" + ${i} + "']"` : p ? (0, e._)`"/" + ${i}` : (0, e._)`"/" + ${i}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return l ? (0, e.getProperty)(i).toString() : "/" + v(i);
  }
  B.getErrorPath = _;
  function P(i, o, l = i.opts.strictSchema) {
    if (l) {
      if (o = `strict mode: ${o}`, l === !0)
        throw new Error(o);
      i.self.logger.warn(o);
    }
  }
  return B.checkStrictMode = P, B;
}
var Le = {}, cr;
function Oe() {
  if (cr) return Le;
  cr = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = {
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
  return Le.default = n, Le;
}
var lr;
function Nt() {
  return lr || (lr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), m = /* @__PURE__ */ Oe();
    e.keywordError = {
      message: ({ keyword: y }) => (0, n.str)`must pass "${y}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: y, schemaType: g }) => g ? (0, n.str)`"${y}" keyword must be ${g} ($data)` : (0, n.str)`"${y}" keyword is invalid ($data)`
    };
    function S(y, g = e.keywordError, a, _) {
      const { it: P } = y, { gen: i, compositeRule: o, allErrors: l } = P, p = O(y, g, a);
      _ ?? (o || l) ? f(i, p) : $(P, (0, n._)`[${p}]`);
    }
    e.reportError = S;
    function s(y, g = e.keywordError, a) {
      const { it: _ } = y, { gen: P, compositeRule: i, allErrors: o } = _, l = O(y, g, a);
      f(P, l), i || o || $(_, m.default.vErrors);
    }
    e.reportExtraError = s;
    function d(y, g) {
      y.assign(m.default.errors, g), y.if((0, n._)`${m.default.vErrors} !== null`, () => y.if(g, () => y.assign((0, n._)`${m.default.vErrors}.length`, g), () => y.assign(m.default.vErrors, null)));
    }
    e.resetErrorsCount = d;
    function u({ gen: y, keyword: g, schemaValue: a, data: _, errsCount: P, it: i }) {
      if (P === void 0)
        throw new Error("ajv implementation error");
      const o = y.name("err");
      y.forRange("i", P, m.default.errors, (l) => {
        y.const(o, (0, n._)`${m.default.vErrors}[${l}]`), y.if((0, n._)`${o}.instancePath === undefined`, () => y.assign((0, n._)`${o}.instancePath`, (0, n.strConcat)(m.default.instancePath, i.errorPath))), y.assign((0, n._)`${o}.schemaPath`, (0, n.str)`${i.errSchemaPath}/${g}`), i.opts.verbose && (y.assign((0, n._)`${o}.schema`, a), y.assign((0, n._)`${o}.data`, _));
      });
    }
    e.extendErrors = u;
    function f(y, g) {
      const a = y.const("err", g);
      y.if((0, n._)`${m.default.vErrors} === null`, () => y.assign(m.default.vErrors, (0, n._)`[${a}]`), (0, n._)`${m.default.vErrors}.push(${a})`), y.code((0, n._)`${m.default.errors}++`);
    }
    function $(y, g) {
      const { gen: a, validateName: _, schemaEnv: P } = y;
      P.$async ? a.throw((0, n._)`new ${y.ValidationError}(${g})`) : (a.assign((0, n._)`${_}.errors`, g), a.return(!1));
    }
    const v = {
      keyword: new n.Name("keyword"),
      schemaPath: new n.Name("schemaPath"),
      // also used in JTD errors
      params: new n.Name("params"),
      propertyName: new n.Name("propertyName"),
      message: new n.Name("message"),
      schema: new n.Name("schema"),
      parentSchema: new n.Name("parentSchema")
    };
    function O(y, g, a) {
      const { createErrors: _ } = y.it;
      return _ === !1 ? (0, n._)`{}` : I(y, g, a);
    }
    function I(y, g, a = {}) {
      const { gen: _, it: P } = y, i = [
        R(P, a),
        N(y, a)
      ];
      return k(y, g, i), _.object(...i);
    }
    function R({ errorPath: y }, { instancePath: g }) {
      const a = g ? (0, n.str)`${y}${(0, w.getErrorPath)(g, w.Type.Str)}` : y;
      return [m.default.instancePath, (0, n.strConcat)(m.default.instancePath, a)];
    }
    function N({ keyword: y, it: { errSchemaPath: g } }, { schemaPath: a, parentSchema: _ }) {
      let P = _ ? g : (0, n.str)`${g}/${y}`;
      return a && (P = (0, n.str)`${P}${(0, w.getErrorPath)(a, w.Type.Str)}`), [v.schemaPath, P];
    }
    function k(y, { params: g, message: a }, _) {
      const { keyword: P, data: i, schemaValue: o, it: l } = y, { opts: p, propertyName: A, topSchemaRef: F, schemaPath: D } = l;
      _.push([v.keyword, P], [v.params, typeof g == "function" ? g(y) : g || (0, n._)`{}`]), p.messages && _.push([v.message, typeof a == "function" ? a(y) : a]), p.verbose && _.push([v.schema, o], [v.parentSchema, (0, n._)`${F}${D}`], [m.default.data, i]), A && _.push([v.propertyName, A]);
    }
  })(Dt)), Dt;
}
var dr;
function Hn() {
  if (dr) return Re;
  dr = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.boolOrEmptySchema = Re.topBoolOrEmptySchema = void 0;
  const e = /* @__PURE__ */ Nt(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Oe(), m = {
    message: "boolean schema is false"
  };
  function S(u) {
    const { gen: f, schema: $, validateName: v } = u;
    $ === !1 ? d(u, !1) : typeof $ == "object" && $.$async === !0 ? f.return(w.default.data) : (f.assign((0, n._)`${v}.errors`, null), f.return(!0));
  }
  Re.topBoolOrEmptySchema = S;
  function s(u, f) {
    const { gen: $, schema: v } = u;
    v === !1 ? ($.var(f, !1), d(u)) : $.var(f, !0);
  }
  Re.boolOrEmptySchema = s;
  function d(u, f) {
    const { gen: $, data: v } = u, O = {
      gen: $,
      keyword: "false schema",
      data: v,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: u
    };
    (0, e.reportError)(O, m, void 0, f);
  }
  return Re;
}
var fe = {}, Ne = {}, fr;
function En() {
  if (fr) return Ne;
  fr = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.getRules = Ne.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], n = new Set(e);
  function w(S) {
    return typeof S == "string" && n.has(S);
  }
  Ne.isJSONType = w;
  function m() {
    const S = {
      number: { type: "number", rules: [] },
      string: { type: "string", rules: [] },
      array: { type: "array", rules: [] },
      object: { type: "object", rules: [] }
    };
    return {
      types: { ...S, integer: !0, boolean: !0, null: !0 },
      rules: [{ rules: [] }, S.number, S.string, S.array, S.object],
      post: { rules: [] },
      all: {},
      keywords: {}
    };
  }
  return Ne.getRules = m, Ne;
}
var Ee = {}, mr;
function Sn() {
  if (mr) return Ee;
  mr = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.shouldUseRule = Ee.shouldUseGroup = Ee.schemaHasRulesForType = void 0;
  function e({ schema: m, self: S }, s) {
    const d = S.RULES.types[s];
    return d && d !== !0 && n(m, d);
  }
  Ee.schemaHasRulesForType = e;
  function n(m, S) {
    return S.rules.some((s) => w(m, s));
  }
  Ee.shouldUseGroup = n;
  function w(m, S) {
    var s;
    return m[S.keyword] !== void 0 || ((s = S.definition.implements) === null || s === void 0 ? void 0 : s.some((d) => m[d] !== void 0));
  }
  return Ee.shouldUseRule = w, Ee;
}
var hr;
function Rt() {
  if (hr) return fe;
  hr = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.reportTypeError = fe.checkDataTypes = fe.checkDataType = fe.coerceAndCheckDataType = fe.getJSONTypes = fe.getSchemaTypes = fe.DataType = void 0;
  const e = /* @__PURE__ */ En(), n = /* @__PURE__ */ Sn(), w = /* @__PURE__ */ Nt(), m = /* @__PURE__ */ W(), S = /* @__PURE__ */ Q();
  var s;
  (function(a) {
    a[a.Correct = 0] = "Correct", a[a.Wrong = 1] = "Wrong";
  })(s || (fe.DataType = s = {}));
  function d(a) {
    const _ = u(a.type);
    if (_.includes("null")) {
      if (a.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!_.length && a.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      a.nullable === !0 && _.push("null");
    }
    return _;
  }
  fe.getSchemaTypes = d;
  function u(a) {
    const _ = Array.isArray(a) ? a : a ? [a] : [];
    if (_.every(e.isJSONType))
      return _;
    throw new Error("type must be JSONType or JSONType[]: " + _.join(","));
  }
  fe.getJSONTypes = u;
  function f(a, _) {
    const { gen: P, data: i, opts: o } = a, l = v(_, o.coerceTypes), p = _.length > 0 && !(l.length === 0 && _.length === 1 && (0, n.schemaHasRulesForType)(a, _[0]));
    if (p) {
      const A = N(_, i, o.strictNumbers, s.Wrong);
      P.if(A, () => {
        l.length ? O(a, _, l) : y(a);
      });
    }
    return p;
  }
  fe.coerceAndCheckDataType = f;
  const $ = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function v(a, _) {
    return _ ? a.filter((P) => $.has(P) || _ === "array" && P === "array") : [];
  }
  function O(a, _, P) {
    const { gen: i, data: o, opts: l } = a, p = i.let("dataType", (0, m._)`typeof ${o}`), A = i.let("coerced", (0, m._)`undefined`);
    l.coerceTypes === "array" && i.if((0, m._)`${p} == 'object' && Array.isArray(${o}) && ${o}.length == 1`, () => i.assign(o, (0, m._)`${o}[0]`).assign(p, (0, m._)`typeof ${o}`).if(N(_, o, l.strictNumbers), () => i.assign(A, o))), i.if((0, m._)`${A} !== undefined`);
    for (const D of P)
      ($.has(D) || D === "array" && l.coerceTypes === "array") && F(D);
    i.else(), y(a), i.endIf(), i.if((0, m._)`${A} !== undefined`, () => {
      i.assign(o, A), I(a, A);
    });
    function F(D) {
      switch (D) {
        case "string":
          i.elseIf((0, m._)`${p} == "number" || ${p} == "boolean"`).assign(A, (0, m._)`"" + ${o}`).elseIf((0, m._)`${o} === null`).assign(A, (0, m._)`""`);
          return;
        case "number":
          i.elseIf((0, m._)`${p} == "boolean" || ${o} === null
              || (${p} == "string" && ${o} && ${o} == +${o})`).assign(A, (0, m._)`+${o}`);
          return;
        case "integer":
          i.elseIf((0, m._)`${p} === "boolean" || ${o} === null
              || (${p} === "string" && ${o} && ${o} == +${o} && !(${o} % 1))`).assign(A, (0, m._)`+${o}`);
          return;
        case "boolean":
          i.elseIf((0, m._)`${o} === "false" || ${o} === 0 || ${o} === null`).assign(A, !1).elseIf((0, m._)`${o} === "true" || ${o} === 1`).assign(A, !0);
          return;
        case "null":
          i.elseIf((0, m._)`${o} === "" || ${o} === 0 || ${o} === false`), i.assign(A, null);
          return;
        case "array":
          i.elseIf((0, m._)`${p} === "string" || ${p} === "number"
              || ${p} === "boolean" || ${o} === null`).assign(A, (0, m._)`[${o}]`);
      }
    }
  }
  function I({ gen: a, parentData: _, parentDataProperty: P }, i) {
    a.if((0, m._)`${_} !== undefined`, () => a.assign((0, m._)`${_}[${P}]`, i));
  }
  function R(a, _, P, i = s.Correct) {
    const o = i === s.Correct ? m.operators.EQ : m.operators.NEQ;
    let l;
    switch (a) {
      case "null":
        return (0, m._)`${_} ${o} null`;
      case "array":
        l = (0, m._)`Array.isArray(${_})`;
        break;
      case "object":
        l = (0, m._)`${_} && typeof ${_} == "object" && !Array.isArray(${_})`;
        break;
      case "integer":
        l = p((0, m._)`!(${_} % 1) && !isNaN(${_})`);
        break;
      case "number":
        l = p();
        break;
      default:
        return (0, m._)`typeof ${_} ${o} ${a}`;
    }
    return i === s.Correct ? l : (0, m.not)(l);
    function p(A = m.nil) {
      return (0, m.and)((0, m._)`typeof ${_} == "number"`, A, P ? (0, m._)`isFinite(${_})` : m.nil);
    }
  }
  fe.checkDataType = R;
  function N(a, _, P, i) {
    if (a.length === 1)
      return R(a[0], _, P, i);
    let o;
    const l = (0, S.toHash)(a);
    if (l.array && l.object) {
      const p = (0, m._)`typeof ${_} != "object"`;
      o = l.null ? p : (0, m._)`!${_} || ${p}`, delete l.null, delete l.array, delete l.object;
    } else
      o = m.nil;
    l.number && delete l.integer;
    for (const p in l)
      o = (0, m.and)(o, R(p, _, P, i));
    return o;
  }
  fe.checkDataTypes = N;
  const k = {
    message: ({ schema: a }) => `must be ${a}`,
    params: ({ schema: a, schemaValue: _ }) => typeof a == "string" ? (0, m._)`{type: ${a}}` : (0, m._)`{type: ${_}}`
  };
  function y(a) {
    const _ = g(a);
    (0, w.reportError)(_, k);
  }
  fe.reportTypeError = y;
  function g(a) {
    const { gen: _, data: P, schema: i } = a, o = (0, S.schemaRefOrVal)(a, i, "type");
    return {
      gen: _,
      keyword: "type",
      data: P,
      schema: i.type,
      schemaCode: o,
      schemaValue: o,
      parentSchema: i,
      params: {},
      it: a
    };
  }
  return fe;
}
var De = {}, pr;
function Gn() {
  if (pr) return De;
  pr = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.assignDefaults = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q();
  function w(S, s) {
    const { properties: d, items: u } = S.schema;
    if (s === "object" && d)
      for (const f in d)
        m(S, f, d[f].default);
    else s === "array" && Array.isArray(u) && u.forEach((f, $) => m(S, $, f.default));
  }
  De.assignDefaults = w;
  function m(S, s, d) {
    const { gen: u, compositeRule: f, data: $, opts: v } = S;
    if (d === void 0)
      return;
    const O = (0, e._)`${$}${(0, e.getProperty)(s)}`;
    if (f) {
      (0, n.checkStrictMode)(S, `default is ignored for: ${O}`);
      return;
    }
    let I = (0, e._)`${O} === undefined`;
    v.useDefaults === "empty" && (I = (0, e._)`${I} || ${O} === null || ${O} === ""`), u.if(I, (0, e._)`${O} = ${(0, e.stringify)(d)}`);
  }
  return De;
}
var ge = {}, te = {}, yr;
function we() {
  if (yr) return te;
  yr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Oe(), m = /* @__PURE__ */ Q();
  function S(a, _) {
    const { gen: P, data: i, it: o } = a;
    P.if(v(P, i, _, o.opts.ownProperties), () => {
      a.setParams({ missingProperty: (0, e._)`${_}` }, !0), a.error();
    });
  }
  te.checkReportMissingProp = S;
  function s({ gen: a, data: _, it: { opts: P } }, i, o) {
    return (0, e.or)(...i.map((l) => (0, e.and)(v(a, _, l, P.ownProperties), (0, e._)`${o} = ${l}`)));
  }
  te.checkMissingProp = s;
  function d(a, _) {
    a.setParams({ missingProperty: _ }, !0), a.error();
  }
  te.reportMissingProp = d;
  function u(a) {
    return a.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  te.hasPropFunc = u;
  function f(a, _, P) {
    return (0, e._)`${u(a)}.call(${_}, ${P})`;
  }
  te.isOwnProperty = f;
  function $(a, _, P, i) {
    const o = (0, e._)`${_}${(0, e.getProperty)(P)} !== undefined`;
    return i ? (0, e._)`${o} && ${f(a, _, P)}` : o;
  }
  te.propertyInData = $;
  function v(a, _, P, i) {
    const o = (0, e._)`${_}${(0, e.getProperty)(P)} === undefined`;
    return i ? (0, e.or)(o, (0, e.not)(f(a, _, P))) : o;
  }
  te.noPropertyInData = v;
  function O(a) {
    return a ? Object.keys(a).filter((_) => _ !== "__proto__") : [];
  }
  te.allSchemaProperties = O;
  function I(a, _) {
    return O(_).filter((P) => !(0, n.alwaysValidSchema)(a, _[P]));
  }
  te.schemaProperties = I;
  function R({ schemaCode: a, data: _, it: { gen: P, topSchemaRef: i, schemaPath: o, errorPath: l }, it: p }, A, F, D) {
    const K = D ? (0, e._)`${a}, ${_}, ${i}${o}` : _, L = [
      [w.default.instancePath, (0, e.strConcat)(w.default.instancePath, l)],
      [w.default.parentData, p.parentData],
      [w.default.parentDataProperty, p.parentDataProperty],
      [w.default.rootData, w.default.rootData]
    ];
    p.opts.dynamicRef && L.push([w.default.dynamicAnchors, w.default.dynamicAnchors]);
    const H = (0, e._)`${K}, ${P.object(...L)}`;
    return F !== e.nil ? (0, e._)`${A}.call(${F}, ${H})` : (0, e._)`${A}(${H})`;
  }
  te.callValidateCode = R;
  const N = (0, e._)`new RegExp`;
  function k({ gen: a, it: { opts: _ } }, P) {
    const i = _.unicodeRegExp ? "u" : "", { regExp: o } = _.code, l = o(P, i);
    return a.scopeValue("pattern", {
      key: l.toString(),
      ref: l,
      code: (0, e._)`${o.code === "new RegExp" ? N : (0, m.useFunc)(a, o)}(${P}, ${i})`
    });
  }
  te.usePattern = k;
  function y(a) {
    const { gen: _, data: P, keyword: i, it: o } = a, l = _.name("valid");
    if (o.allErrors) {
      const A = _.let("valid", !0);
      return p(() => _.assign(A, !1)), A;
    }
    return _.var(l, !0), p(() => _.break()), l;
    function p(A) {
      const F = _.const("len", (0, e._)`${P}.length`);
      _.forRange("i", 0, F, (D) => {
        a.subschema({
          keyword: i,
          dataProp: D,
          dataPropType: n.Type.Num
        }, l), _.if((0, e.not)(l), A);
      });
    }
  }
  te.validateArray = y;
  function g(a) {
    const { gen: _, schema: P, keyword: i, it: o } = a;
    if (!Array.isArray(P))
      throw new Error("ajv implementation error");
    if (P.some((F) => (0, n.alwaysValidSchema)(o, F)) && !o.opts.unevaluated)
      return;
    const p = _.let("valid", !1), A = _.name("_valid");
    _.block(() => P.forEach((F, D) => {
      const K = a.subschema({
        keyword: i,
        schemaProp: D,
        compositeRule: !0
      }, A);
      _.assign(p, (0, e._)`${p} || ${A}`), a.mergeValidEvaluated(K, A) || _.if((0, e.not)(p));
    })), a.result(p, () => a.reset(), () => a.error(!0));
  }
  return te.validateUnion = g, te;
}
var vr;
function Jn() {
  if (vr) return ge;
  vr = 1, Object.defineProperty(ge, "__esModule", { value: !0 }), ge.validateKeywordUsage = ge.validSchemaType = ge.funcKeywordCode = ge.macroKeywordCode = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Oe(), w = /* @__PURE__ */ we(), m = /* @__PURE__ */ Nt();
  function S(I, R) {
    const { gen: N, keyword: k, schema: y, parentSchema: g, it: a } = I, _ = R.macro.call(a.self, y, g, a), P = $(N, k, _);
    a.opts.validateSchema !== !1 && a.self.validateSchema(_, !0);
    const i = N.name("valid");
    I.subschema({
      schema: _,
      schemaPath: e.nil,
      errSchemaPath: `${a.errSchemaPath}/${k}`,
      topSchemaRef: P,
      compositeRule: !0
    }, i), I.pass(i, () => I.error(!0));
  }
  ge.macroKeywordCode = S;
  function s(I, R) {
    var N;
    const { gen: k, keyword: y, schema: g, parentSchema: a, $data: _, it: P } = I;
    f(P, R);
    const i = !_ && R.compile ? R.compile.call(P.self, g, a, P) : R.validate, o = $(k, y, i), l = k.let("valid");
    I.block$data(l, p), I.ok((N = R.valid) !== null && N !== void 0 ? N : l);
    function p() {
      if (R.errors === !1)
        D(), R.modifying && d(I), K(() => I.error());
      else {
        const L = R.async ? A() : F();
        R.modifying && d(I), K(() => u(I, L));
      }
    }
    function A() {
      const L = k.let("ruleErrs", null);
      return k.try(() => D((0, e._)`await `), (H) => k.assign(l, !1).if((0, e._)`${H} instanceof ${P.ValidationError}`, () => k.assign(L, (0, e._)`${H}.errors`), () => k.throw(H))), L;
    }
    function F() {
      const L = (0, e._)`${o}.errors`;
      return k.assign(L, null), D(e.nil), L;
    }
    function D(L = R.async ? (0, e._)`await ` : e.nil) {
      const H = P.opts.passContext ? n.default.this : n.default.self, Z = !("compile" in R && !_ || R.schema === !1);
      k.assign(l, (0, e._)`${L}${(0, w.callValidateCode)(I, o, H, Z)}`, R.modifying);
    }
    function K(L) {
      var H;
      k.if((0, e.not)((H = R.valid) !== null && H !== void 0 ? H : l), L);
    }
  }
  ge.funcKeywordCode = s;
  function d(I) {
    const { gen: R, data: N, it: k } = I;
    R.if(k.parentData, () => R.assign(N, (0, e._)`${k.parentData}[${k.parentDataProperty}]`));
  }
  function u(I, R) {
    const { gen: N } = I;
    N.if((0, e._)`Array.isArray(${R})`, () => {
      N.assign(n.default.vErrors, (0, e._)`${n.default.vErrors} === null ? ${R} : ${n.default.vErrors}.concat(${R})`).assign(n.default.errors, (0, e._)`${n.default.vErrors}.length`), (0, m.extendErrors)(I);
    }, () => I.error());
  }
  function f({ schemaEnv: I }, R) {
    if (R.async && !I.$async)
      throw new Error("async keyword in sync schema");
  }
  function $(I, R, N) {
    if (N === void 0)
      throw new Error(`keyword "${R}" failed to compile`);
    return I.scopeValue("keyword", typeof N == "function" ? { ref: N } : { ref: N, code: (0, e.stringify)(N) });
  }
  function v(I, R, N = !1) {
    return !R.length || R.some((k) => k === "array" ? Array.isArray(I) : k === "object" ? I && typeof I == "object" && !Array.isArray(I) : typeof I == k || N && typeof I > "u");
  }
  ge.validSchemaType = v;
  function O({ schema: I, opts: R, self: N, errSchemaPath: k }, y, g) {
    if (Array.isArray(y.keyword) ? !y.keyword.includes(g) : y.keyword !== g)
      throw new Error("ajv implementation error");
    const a = y.dependencies;
    if (a?.some((_) => !Object.prototype.hasOwnProperty.call(I, _)))
      throw new Error(`parent schema must have dependencies of ${g}: ${a.join(",")}`);
    if (y.validateSchema && !y.validateSchema(I[g])) {
      const P = `keyword "${g}" value is invalid at path "${k}": ` + N.errorsText(y.validateSchema.errors);
      if (R.validateSchema === "log")
        N.logger.error(P);
      else
        throw new Error(P);
    }
  }
  return ge.validateKeywordUsage = O, ge;
}
var Se = {}, _r;
function Bn() {
  if (_r) return Se;
  _r = 1, Object.defineProperty(Se, "__esModule", { value: !0 }), Se.extendSubschemaMode = Se.extendSubschemaData = Se.getSubschema = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q();
  function w(s, { keyword: d, schemaProp: u, schema: f, schemaPath: $, errSchemaPath: v, topSchemaRef: O }) {
    if (d !== void 0 && f !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (d !== void 0) {
      const I = s.schema[d];
      return u === void 0 ? {
        schema: I,
        schemaPath: (0, e._)`${s.schemaPath}${(0, e.getProperty)(d)}`,
        errSchemaPath: `${s.errSchemaPath}/${d}`
      } : {
        schema: I[u],
        schemaPath: (0, e._)`${s.schemaPath}${(0, e.getProperty)(d)}${(0, e.getProperty)(u)}`,
        errSchemaPath: `${s.errSchemaPath}/${d}/${(0, n.escapeFragment)(u)}`
      };
    }
    if (f !== void 0) {
      if ($ === void 0 || v === void 0 || O === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: f,
        schemaPath: $,
        topSchemaRef: O,
        errSchemaPath: v
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  Se.getSubschema = w;
  function m(s, d, { dataProp: u, dataPropType: f, data: $, dataTypes: v, propertyName: O }) {
    if ($ !== void 0 && u !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: I } = d;
    if (u !== void 0) {
      const { errorPath: N, dataPathArr: k, opts: y } = d, g = I.let("data", (0, e._)`${d.data}${(0, e.getProperty)(u)}`, !0);
      R(g), s.errorPath = (0, e.str)`${N}${(0, n.getErrorPath)(u, f, y.jsPropertySyntax)}`, s.parentDataProperty = (0, e._)`${u}`, s.dataPathArr = [...k, s.parentDataProperty];
    }
    if ($ !== void 0) {
      const N = $ instanceof e.Name ? $ : I.let("data", $, !0);
      R(N), O !== void 0 && (s.propertyName = O);
    }
    v && (s.dataTypes = v);
    function R(N) {
      s.data = N, s.dataLevel = d.dataLevel + 1, s.dataTypes = [], d.definedProperties = /* @__PURE__ */ new Set(), s.parentData = d.data, s.dataNames = [...d.dataNames, N];
    }
  }
  Se.extendSubschemaData = m;
  function S(s, { jtdDiscriminator: d, jtdMetadata: u, compositeRule: f, createErrors: $, allErrors: v }) {
    f !== void 0 && (s.compositeRule = f), $ !== void 0 && (s.createErrors = $), v !== void 0 && (s.allErrors = v), s.jtdDiscriminator = d, s.jtdMetadata = u;
  }
  return Se.extendSubschemaMode = S, Se;
}
var he = {}, Vt, gr;
function Pn() {
  return gr || (gr = 1, Vt = function e(n, w) {
    if (n === w) return !0;
    if (n && w && typeof n == "object" && typeof w == "object") {
      if (n.constructor !== w.constructor) return !1;
      var m, S, s;
      if (Array.isArray(n)) {
        if (m = n.length, m != w.length) return !1;
        for (S = m; S-- !== 0; )
          if (!e(n[S], w[S])) return !1;
        return !0;
      }
      if (n.constructor === RegExp) return n.source === w.source && n.flags === w.flags;
      if (n.valueOf !== Object.prototype.valueOf) return n.valueOf() === w.valueOf();
      if (n.toString !== Object.prototype.toString) return n.toString() === w.toString();
      if (s = Object.keys(n), m = s.length, m !== Object.keys(w).length) return !1;
      for (S = m; S-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(w, s[S])) return !1;
      for (S = m; S-- !== 0; ) {
        var d = s[S];
        if (!e(n[d], w[d])) return !1;
      }
      return !0;
    }
    return n !== n && w !== w;
  }), Vt;
}
var Ut = { exports: {} }, $r;
function Wn() {
  if ($r) return Ut.exports;
  $r = 1;
  var e = Ut.exports = function(m, S, s) {
    typeof S == "function" && (s = S, S = {}), s = S.cb || s;
    var d = typeof s == "function" ? s : s.pre || function() {
    }, u = s.post || function() {
    };
    n(S, d, u, m, "", m);
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
  function n(m, S, s, d, u, f, $, v, O, I) {
    if (d && typeof d == "object" && !Array.isArray(d)) {
      S(d, u, f, $, v, O, I);
      for (var R in d) {
        var N = d[R];
        if (Array.isArray(N)) {
          if (R in e.arrayKeywords)
            for (var k = 0; k < N.length; k++)
              n(m, S, s, N[k], u + "/" + R + "/" + k, f, u, R, d, k);
        } else if (R in e.propsKeywords) {
          if (N && typeof N == "object")
            for (var y in N)
              n(m, S, s, N[y], u + "/" + R + "/" + w(y), f, u, R, d, y);
        } else (R in e.keywords || m.allKeys && !(R in e.skipKeywords)) && n(m, S, s, N, u + "/" + R, f, u, R, d);
      }
      s(d, u, f, $, v, O, I);
    }
  }
  function w(m) {
    return m.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ut.exports;
}
var wr;
function It() {
  if (wr) return he;
  wr = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.getSchemaRefs = he.resolveUrl = he.normalizeId = he._getFullPath = he.getFullPath = he.inlineRef = void 0;
  const e = /* @__PURE__ */ Q(), n = Pn(), w = Wn(), m = /* @__PURE__ */ new Set([
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
  function S(k, y = !0) {
    return typeof k == "boolean" ? !0 : y === !0 ? !d(k) : y ? u(k) <= y : !1;
  }
  he.inlineRef = S;
  const s = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function d(k) {
    for (const y in k) {
      if (s.has(y))
        return !0;
      const g = k[y];
      if (Array.isArray(g) && g.some(d) || typeof g == "object" && d(g))
        return !0;
    }
    return !1;
  }
  function u(k) {
    let y = 0;
    for (const g in k) {
      if (g === "$ref")
        return 1 / 0;
      if (y++, !m.has(g) && (typeof k[g] == "object" && (0, e.eachItem)(k[g], (a) => y += u(a)), y === 1 / 0))
        return 1 / 0;
    }
    return y;
  }
  function f(k, y = "", g) {
    g !== !1 && (y = O(y));
    const a = k.parse(y);
    return $(k, a);
  }
  he.getFullPath = f;
  function $(k, y) {
    return k.serialize(y).split("#")[0] + "#";
  }
  he._getFullPath = $;
  const v = /#\/?$/;
  function O(k) {
    return k ? k.replace(v, "") : "";
  }
  he.normalizeId = O;
  function I(k, y, g) {
    return g = O(g), k.resolve(y, g);
  }
  he.resolveUrl = I;
  const R = /^[a-z_][-a-z0-9._]*$/i;
  function N(k, y) {
    if (typeof k == "boolean")
      return {};
    const { schemaId: g, uriResolver: a } = this.opts, _ = O(k[g] || y), P = { "": _ }, i = f(a, _, !1), o = {}, l = /* @__PURE__ */ new Set();
    return w(k, { allKeys: !0 }, (F, D, K, L) => {
      if (L === void 0)
        return;
      const H = i + D;
      let Z = P[L];
      typeof F[g] == "string" && (Z = ce.call(this, F[g])), ue.call(this, F.$anchor), ue.call(this, F.$dynamicAnchor), P[D] = Z;
      function ce(Y) {
        const le = this.opts.uriResolver.resolve;
        if (Y = O(Z ? le(Z, Y) : Y), l.has(Y))
          throw A(Y);
        l.add(Y);
        let V = this.refs[Y];
        return typeof V == "string" && (V = this.refs[V]), typeof V == "object" ? p(F, V.schema, Y) : Y !== O(H) && (Y[0] === "#" ? (p(F, o[Y], Y), o[Y] = F) : this.refs[Y] = H), Y;
      }
      function ue(Y) {
        if (typeof Y == "string") {
          if (!R.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          ce.call(this, `#${Y}`);
        }
      }
    }), o;
    function p(F, D, K) {
      if (D !== void 0 && !n(F, D))
        throw A(K);
    }
    function A(F) {
      return new Error(`reference "${F}" resolves to more than one schema`);
    }
  }
  return he.getSchemaRefs = N, he;
}
var br;
function jt() {
  if (br) return be;
  br = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.getData = be.KeywordCxt = be.validateFunctionCode = void 0;
  const e = /* @__PURE__ */ Hn(), n = /* @__PURE__ */ Rt(), w = /* @__PURE__ */ Sn(), m = /* @__PURE__ */ Rt(), S = /* @__PURE__ */ Gn(), s = /* @__PURE__ */ Jn(), d = /* @__PURE__ */ Bn(), u = /* @__PURE__ */ W(), f = /* @__PURE__ */ Oe(), $ = /* @__PURE__ */ It(), v = /* @__PURE__ */ Q(), O = /* @__PURE__ */ Nt();
  function I(j) {
    if (i(j) && (l(j), P(j))) {
      y(j);
      return;
    }
    R(j, () => (0, e.topBoolOrEmptySchema)(j));
  }
  be.validateFunctionCode = I;
  function R({ gen: j, validateName: q, schema: M, schemaEnv: U, opts: x }, J) {
    x.code.es5 ? j.func(q, (0, u._)`${f.default.data}, ${f.default.valCxt}`, U.$async, () => {
      j.code((0, u._)`"use strict"; ${a(M, x)}`), k(j, x), j.code(J);
    }) : j.func(q, (0, u._)`${f.default.data}, ${N(x)}`, U.$async, () => j.code(a(M, x)).code(J));
  }
  function N(j) {
    return (0, u._)`{${f.default.instancePath}="", ${f.default.parentData}, ${f.default.parentDataProperty}, ${f.default.rootData}=${f.default.data}${j.dynamicRef ? (0, u._)`, ${f.default.dynamicAnchors}={}` : u.nil}}={}`;
  }
  function k(j, q) {
    j.if(f.default.valCxt, () => {
      j.var(f.default.instancePath, (0, u._)`${f.default.valCxt}.${f.default.instancePath}`), j.var(f.default.parentData, (0, u._)`${f.default.valCxt}.${f.default.parentData}`), j.var(f.default.parentDataProperty, (0, u._)`${f.default.valCxt}.${f.default.parentDataProperty}`), j.var(f.default.rootData, (0, u._)`${f.default.valCxt}.${f.default.rootData}`), q.dynamicRef && j.var(f.default.dynamicAnchors, (0, u._)`${f.default.valCxt}.${f.default.dynamicAnchors}`);
    }, () => {
      j.var(f.default.instancePath, (0, u._)`""`), j.var(f.default.parentData, (0, u._)`undefined`), j.var(f.default.parentDataProperty, (0, u._)`undefined`), j.var(f.default.rootData, f.default.data), q.dynamicRef && j.var(f.default.dynamicAnchors, (0, u._)`{}`);
    });
  }
  function y(j) {
    const { schema: q, opts: M, gen: U } = j;
    R(j, () => {
      M.$comment && q.$comment && L(j), F(j), U.let(f.default.vErrors, null), U.let(f.default.errors, 0), M.unevaluated && g(j), p(j), H(j);
    });
  }
  function g(j) {
    const { gen: q, validateName: M } = j;
    j.evaluated = q.const("evaluated", (0, u._)`${M}.evaluated`), q.if((0, u._)`${j.evaluated}.dynamicProps`, () => q.assign((0, u._)`${j.evaluated}.props`, (0, u._)`undefined`)), q.if((0, u._)`${j.evaluated}.dynamicItems`, () => q.assign((0, u._)`${j.evaluated}.items`, (0, u._)`undefined`));
  }
  function a(j, q) {
    const M = typeof j == "object" && j[q.schemaId];
    return M && (q.code.source || q.code.process) ? (0, u._)`/*# sourceURL=${M} */` : u.nil;
  }
  function _(j, q) {
    if (i(j) && (l(j), P(j))) {
      o(j, q);
      return;
    }
    (0, e.boolOrEmptySchema)(j, q);
  }
  function P({ schema: j, self: q }) {
    if (typeof j == "boolean")
      return !j;
    for (const M in j)
      if (q.RULES.all[M])
        return !0;
    return !1;
  }
  function i(j) {
    return typeof j.schema != "boolean";
  }
  function o(j, q) {
    const { schema: M, gen: U, opts: x } = j;
    x.$comment && M.$comment && L(j), D(j), K(j);
    const J = U.const("_errs", f.default.errors);
    p(j, J), U.var(q, (0, u._)`${J} === ${f.default.errors}`);
  }
  function l(j) {
    (0, v.checkUnknownRules)(j), A(j);
  }
  function p(j, q) {
    if (j.opts.jtd)
      return ce(j, [], !1, q);
    const M = (0, n.getSchemaTypes)(j.schema), U = (0, n.coerceAndCheckDataType)(j, M);
    ce(j, M, !U, q);
  }
  function A(j) {
    const { schema: q, errSchemaPath: M, opts: U, self: x } = j;
    q.$ref && U.ignoreKeywordsWithRef && (0, v.schemaHasRulesButRef)(q, x.RULES) && x.logger.warn(`$ref: keywords ignored in schema at path "${M}"`);
  }
  function F(j) {
    const { schema: q, opts: M } = j;
    q.default !== void 0 && M.useDefaults && M.strictSchema && (0, v.checkStrictMode)(j, "default is ignored in the schema root");
  }
  function D(j) {
    const q = j.schema[j.opts.schemaId];
    q && (j.baseId = (0, $.resolveUrl)(j.opts.uriResolver, j.baseId, q));
  }
  function K(j) {
    if (j.schema.$async && !j.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function L({ gen: j, schemaEnv: q, schema: M, errSchemaPath: U, opts: x }) {
    const J = M.$comment;
    if (x.$comment === !0)
      j.code((0, u._)`${f.default.self}.logger.log(${J})`);
    else if (typeof x.$comment == "function") {
      const se = (0, u.str)`${U}/$comment`, re = j.scopeValue("root", { ref: q.root });
      j.code((0, u._)`${f.default.self}.opts.$comment(${J}, ${se}, ${re}.schema)`);
    }
  }
  function H(j) {
    const { gen: q, schemaEnv: M, validateName: U, ValidationError: x, opts: J } = j;
    M.$async ? q.if((0, u._)`${f.default.errors} === 0`, () => q.return(f.default.data), () => q.throw((0, u._)`new ${x}(${f.default.vErrors})`)) : (q.assign((0, u._)`${U}.errors`, f.default.vErrors), J.unevaluated && Z(j), q.return((0, u._)`${f.default.errors} === 0`));
  }
  function Z({ gen: j, evaluated: q, props: M, items: U }) {
    M instanceof u.Name && j.assign((0, u._)`${q}.props`, M), U instanceof u.Name && j.assign((0, u._)`${q}.items`, U);
  }
  function ce(j, q, M, U) {
    const { gen: x, schema: J, data: se, allErrors: re, opts: oe, self: ee } = j, { RULES: X } = ee;
    if (J.$ref && (oe.ignoreKeywordsWithRef || !(0, v.schemaHasRulesButRef)(J, X))) {
      x.block(() => C(j, "$ref", X.all.$ref.definition));
      return;
    }
    oe.jtd || Y(j, q), x.block(() => {
      for (const ie of X.rules)
        _e(ie);
      _e(X.post);
    });
    function _e(ie) {
      (0, w.shouldUseGroup)(J, ie) && (ie.type ? (x.if((0, m.checkDataType)(ie.type, se, oe.strictNumbers)), ue(j, ie), q.length === 1 && q[0] === ie.type && M && (x.else(), (0, m.reportTypeError)(j)), x.endIf()) : ue(j, ie), re || x.if((0, u._)`${f.default.errors} === ${U || 0}`));
    }
  }
  function ue(j, q) {
    const { gen: M, schema: U, opts: { useDefaults: x } } = j;
    x && (0, S.assignDefaults)(j, q.type), M.block(() => {
      for (const J of q.rules)
        (0, w.shouldUseRule)(U, J) && C(j, J.keyword, J.definition, q.type);
    });
  }
  function Y(j, q) {
    j.schemaEnv.meta || !j.opts.strictTypes || (le(j, q), j.opts.allowUnionTypes || V(j, q), c(j, j.dataTypes));
  }
  function le(j, q) {
    if (q.length) {
      if (!j.dataTypes.length) {
        j.dataTypes = q;
        return;
      }
      q.forEach((M) => {
        h(j.dataTypes, M) || r(j, `type "${M}" not allowed by context "${j.dataTypes.join(",")}"`);
      }), t(j, q);
    }
  }
  function V(j, q) {
    q.length > 1 && !(q.length === 2 && q.includes("null")) && r(j, "use allowUnionTypes to allow union type keyword");
  }
  function c(j, q) {
    const M = j.self.RULES.all;
    for (const U in M) {
      const x = M[U];
      if (typeof x == "object" && (0, w.shouldUseRule)(j.schema, x)) {
        const { type: J } = x.definition;
        J.length && !J.some((se) => E(q, se)) && r(j, `missing type "${J.join(",")}" for keyword "${U}"`);
      }
    }
  }
  function E(j, q) {
    return j.includes(q) || q === "number" && j.includes("integer");
  }
  function h(j, q) {
    return j.includes(q) || q === "integer" && j.includes("number");
  }
  function t(j, q) {
    const M = [];
    for (const U of j.dataTypes)
      h(q, U) ? M.push(U) : q.includes("integer") && U === "number" && M.push("integer");
    j.dataTypes = M;
  }
  function r(j, q) {
    const M = j.schemaEnv.baseId + j.errSchemaPath;
    q += ` at "${M}" (strictTypes)`, (0, v.checkStrictMode)(j, q, j.opts.strictTypes);
  }
  class b {
    constructor(q, M, U) {
      if ((0, s.validateKeywordUsage)(q, M, U), this.gen = q.gen, this.allErrors = q.allErrors, this.keyword = U, this.data = q.data, this.schema = q.schema[U], this.$data = M.$data && q.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, v.schemaRefOrVal)(q, this.schema, U, this.$data), this.schemaType = M.schemaType, this.parentSchema = q.schema, this.params = {}, this.it = q, this.def = M, this.$data)
        this.schemaCode = q.gen.const("vSchema", G(this.$data, q));
      else if (this.schemaCode = this.schemaValue, !(0, s.validSchemaType)(this.schema, M.schemaType, M.allowUndefined))
        throw new Error(`${U} value must be ${JSON.stringify(M.schemaType)}`);
      ("code" in M ? M.trackErrors : M.errors !== !1) && (this.errsCount = q.gen.const("_errs", f.default.errors));
    }
    result(q, M, U) {
      this.failResult((0, u.not)(q), M, U);
    }
    failResult(q, M, U) {
      this.gen.if(q), U ? U() : this.error(), M ? (this.gen.else(), M(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(q, M) {
      this.failResult((0, u.not)(q), void 0, M);
    }
    fail(q) {
      if (q === void 0) {
        this.error(), this.allErrors || this.gen.if(!1);
        return;
      }
      this.gen.if(q), this.error(), this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    fail$data(q) {
      if (!this.$data)
        return this.fail(q);
      const { schemaCode: M } = this;
      this.fail((0, u._)`${M} !== undefined && (${(0, u.or)(this.invalid$data(), q)})`);
    }
    error(q, M, U) {
      if (M) {
        this.setParams(M), this._error(q, U), this.setParams({});
        return;
      }
      this._error(q, U);
    }
    _error(q, M) {
      (q ? O.reportExtraError : O.reportError)(this, this.def.error, M);
    }
    $dataError() {
      (0, O.reportError)(this, this.def.$dataError || O.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, O.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(q) {
      this.allErrors || this.gen.if(q);
    }
    setParams(q, M) {
      M ? Object.assign(this.params, q) : this.params = q;
    }
    block$data(q, M, U = u.nil) {
      this.gen.block(() => {
        this.check$data(q, U), M();
      });
    }
    check$data(q = u.nil, M = u.nil) {
      if (!this.$data)
        return;
      const { gen: U, schemaCode: x, schemaType: J, def: se } = this;
      U.if((0, u.or)((0, u._)`${x} === undefined`, M)), q !== u.nil && U.assign(q, !0), (J.length || se.validateSchema) && (U.elseIf(this.invalid$data()), this.$dataError(), q !== u.nil && U.assign(q, !1)), U.else();
    }
    invalid$data() {
      const { gen: q, schemaCode: M, schemaType: U, def: x, it: J } = this;
      return (0, u.or)(se(), re());
      function se() {
        if (U.length) {
          if (!(M instanceof u.Name))
            throw new Error("ajv implementation error");
          const oe = Array.isArray(U) ? U : [U];
          return (0, u._)`${(0, m.checkDataTypes)(oe, M, J.opts.strictNumbers, m.DataType.Wrong)}`;
        }
        return u.nil;
      }
      function re() {
        if (x.validateSchema) {
          const oe = q.scopeValue("validate$data", { ref: x.validateSchema });
          return (0, u._)`!${oe}(${M})`;
        }
        return u.nil;
      }
    }
    subschema(q, M) {
      const U = (0, d.getSubschema)(this.it, q);
      (0, d.extendSubschemaData)(U, this.it, q), (0, d.extendSubschemaMode)(U, q);
      const x = { ...this.it, ...U, items: void 0, props: void 0 };
      return _(x, M), x;
    }
    mergeEvaluated(q, M) {
      const { it: U, gen: x } = this;
      U.opts.unevaluated && (U.props !== !0 && q.props !== void 0 && (U.props = v.mergeEvaluated.props(x, q.props, U.props, M)), U.items !== !0 && q.items !== void 0 && (U.items = v.mergeEvaluated.items(x, q.items, U.items, M)));
    }
    mergeValidEvaluated(q, M) {
      const { it: U, gen: x } = this;
      if (U.opts.unevaluated && (U.props !== !0 || U.items !== !0))
        return x.if(M, () => this.mergeEvaluated(q, u.Name)), !0;
    }
  }
  be.KeywordCxt = b;
  function C(j, q, M, U) {
    const x = new b(j, M, q);
    "code" in M ? M.code(x, U) : x.$data && M.validate ? (0, s.funcKeywordCode)(x, M) : "macro" in M ? (0, s.macroKeywordCode)(x, M) : (M.compile || M.validate) && (0, s.funcKeywordCode)(x, M);
  }
  const T = /^\/(?:[^~]|~0|~1)*$/, z = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function G(j, { dataLevel: q, dataNames: M, dataPathArr: U }) {
    let x, J;
    if (j === "")
      return f.default.rootData;
    if (j[0] === "/") {
      if (!T.test(j))
        throw new Error(`Invalid JSON-pointer: ${j}`);
      x = j, J = f.default.rootData;
    } else {
      const ee = z.exec(j);
      if (!ee)
        throw new Error(`Invalid JSON-pointer: ${j}`);
      const X = +ee[1];
      if (x = ee[2], x === "#") {
        if (X >= q)
          throw new Error(oe("property/index", X));
        return U[q - X];
      }
      if (X > q)
        throw new Error(oe("data", X));
      if (J = M[q - X], !x)
        return J;
    }
    let se = J;
    const re = x.split("/");
    for (const ee of re)
      ee && (J = (0, u._)`${J}${(0, u.getProperty)((0, v.unescapeJsonPointer)(ee))}`, se = (0, u._)`${se} && ${J}`);
    return se;
    function oe(ee, X) {
      return `Cannot access ${ee} ${X} levels up, current level is ${q}`;
    }
  }
  return be.getData = G, be;
}
var Ke = {}, Er;
function Bt() {
  if (Er) return Ke;
  Er = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  class e extends Error {
    constructor(w) {
      super("validation failed"), this.errors = w, this.ajv = this.validation = !0;
    }
  }
  return Ke.default = e, Ke;
}
var xe = {}, Sr;
function Tt() {
  if (Sr) return xe;
  Sr = 1, Object.defineProperty(xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ It();
  class n extends Error {
    constructor(m, S, s, d) {
      super(d || `can't resolve reference ${s} from id ${S}`), this.missingRef = (0, e.resolveUrl)(m, S, s), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(m, this.missingRef));
    }
  }
  return xe.default = n, xe;
}
var ye = {}, Pr;
function Wt() {
  if (Pr) return ye;
  Pr = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.resolveSchema = ye.getCompilingSchema = ye.resolveRef = ye.compileSchema = ye.SchemaEnv = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Bt(), w = /* @__PURE__ */ Oe(), m = /* @__PURE__ */ It(), S = /* @__PURE__ */ Q(), s = /* @__PURE__ */ jt();
  class d {
    constructor(g) {
      var a;
      this.refs = {}, this.dynamicAnchors = {};
      let _;
      typeof g.schema == "object" && (_ = g.schema), this.schema = g.schema, this.schemaId = g.schemaId, this.root = g.root || this, this.baseId = (a = g.baseId) !== null && a !== void 0 ? a : (0, m.normalizeId)(_?.[g.schemaId || "$id"]), this.schemaPath = g.schemaPath, this.localRefs = g.localRefs, this.meta = g.meta, this.$async = _?.$async, this.refs = {};
    }
  }
  ye.SchemaEnv = d;
  function u(y) {
    const g = v.call(this, y);
    if (g)
      return g;
    const a = (0, m.getFullPath)(this.opts.uriResolver, y.root.baseId), { es5: _, lines: P } = this.opts.code, { ownProperties: i } = this.opts, o = new e.CodeGen(this.scope, { es5: _, lines: P, ownProperties: i });
    let l;
    y.$async && (l = o.scopeValue("Error", {
      ref: n.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const p = o.scopeName("validate");
    y.validateName = p;
    const A = {
      gen: o,
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
      topSchemaRef: o.scopeValue("schema", this.opts.code.source === !0 ? { ref: y.schema, code: (0, e.stringify)(y.schema) } : { ref: y.schema }),
      validateName: p,
      ValidationError: l,
      schema: y.schema,
      schemaEnv: y,
      rootId: a,
      baseId: y.baseId || a,
      schemaPath: e.nil,
      errSchemaPath: y.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let F;
    try {
      this._compilations.add(y), (0, s.validateFunctionCode)(A), o.optimize(this.opts.code.optimize);
      const D = o.toString();
      F = `${o.scopeRefs(w.default.scope)}return ${D}`, this.opts.code.process && (F = this.opts.code.process(F, y));
      const L = new Function(`${w.default.self}`, `${w.default.scope}`, F)(this, this.scope.get());
      if (this.scope.value(p, { ref: L }), L.errors = null, L.schema = y.schema, L.schemaEnv = y, y.$async && (L.$async = !0), this.opts.code.source === !0 && (L.source = { validateName: p, validateCode: D, scopeValues: o._values }), this.opts.unevaluated) {
        const { props: H, items: Z } = A;
        L.evaluated = {
          props: H instanceof e.Name ? void 0 : H,
          items: Z instanceof e.Name ? void 0 : Z,
          dynamicProps: H instanceof e.Name,
          dynamicItems: Z instanceof e.Name
        }, L.source && (L.source.evaluated = (0, e.stringify)(L.evaluated));
      }
      return y.validate = L, y;
    } catch (D) {
      throw delete y.validate, delete y.validateName, F && this.logger.error("Error compiling schema, function code:", F), D;
    } finally {
      this._compilations.delete(y);
    }
  }
  ye.compileSchema = u;
  function f(y, g, a) {
    var _;
    a = (0, m.resolveUrl)(this.opts.uriResolver, g, a);
    const P = y.refs[a];
    if (P)
      return P;
    let i = I.call(this, y, a);
    if (i === void 0) {
      const o = (_ = y.localRefs) === null || _ === void 0 ? void 0 : _[a], { schemaId: l } = this.opts;
      o && (i = new d({ schema: o, schemaId: l, root: y, baseId: g }));
    }
    if (i !== void 0)
      return y.refs[a] = $.call(this, i);
  }
  ye.resolveRef = f;
  function $(y) {
    return (0, m.inlineRef)(y.schema, this.opts.inlineRefs) ? y.schema : y.validate ? y : u.call(this, y);
  }
  function v(y) {
    for (const g of this._compilations)
      if (O(g, y))
        return g;
  }
  ye.getCompilingSchema = v;
  function O(y, g) {
    return y.schema === g.schema && y.root === g.root && y.baseId === g.baseId;
  }
  function I(y, g) {
    let a;
    for (; typeof (a = this.refs[g]) == "string"; )
      g = a;
    return a || this.schemas[g] || R.call(this, y, g);
  }
  function R(y, g) {
    const a = this.opts.uriResolver.parse(g), _ = (0, m._getFullPath)(this.opts.uriResolver, a);
    let P = (0, m.getFullPath)(this.opts.uriResolver, y.baseId, void 0);
    if (Object.keys(y.schema).length > 0 && _ === P)
      return k.call(this, a, y);
    const i = (0, m.normalizeId)(_), o = this.refs[i] || this.schemas[i];
    if (typeof o == "string") {
      const l = R.call(this, y, o);
      return typeof l?.schema != "object" ? void 0 : k.call(this, a, l);
    }
    if (typeof o?.schema == "object") {
      if (o.validate || u.call(this, o), i === (0, m.normalizeId)(g)) {
        const { schema: l } = o, { schemaId: p } = this.opts, A = l[p];
        return A && (P = (0, m.resolveUrl)(this.opts.uriResolver, P, A)), new d({ schema: l, schemaId: p, root: y, baseId: P });
      }
      return k.call(this, a, o);
    }
  }
  ye.resolveSchema = R;
  const N = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function k(y, { baseId: g, schema: a, root: _ }) {
    var P;
    if (((P = y.fragment) === null || P === void 0 ? void 0 : P[0]) !== "/")
      return;
    for (const l of y.fragment.slice(1).split("/")) {
      if (typeof a == "boolean")
        return;
      const p = a[(0, S.unescapeFragment)(l)];
      if (p === void 0)
        return;
      a = p;
      const A = typeof a == "object" && a[this.opts.schemaId];
      !N.has(l) && A && (g = (0, m.resolveUrl)(this.opts.uriResolver, g, A));
    }
    let i;
    if (typeof a != "boolean" && a.$ref && !(0, S.schemaHasRulesButRef)(a, this.RULES)) {
      const l = (0, m.resolveUrl)(this.opts.uriResolver, g, a.$ref);
      i = R.call(this, _, l);
    }
    const { schemaId: o } = this.opts;
    if (i = i || new d({ schema: a, schemaId: o, root: _, baseId: g }), i.schema !== i.root.schema)
      return i;
  }
  return ye;
}
const Zn = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Qn = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Yn = "object", Xn = ["$data"], ea = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, ta = !1, ra = {
  $id: Zn,
  description: Qn,
  type: Yn,
  required: Xn,
  properties: ea,
  additionalProperties: ta
};
var He = {}, Me = { exports: {} }, Lt, kr;
function kn() {
  if (kr) return Lt;
  kr = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), n = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), w = RegExp.prototype.test.bind(/^\d*$/u), m = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), S = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), s = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u), d = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u), u = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u), f = new Array(256);
  {
    const c = "0123456789ABCDEF";
    for (let E = 0; E < 256; E++)
      f[E] = "%" + c[E >> 4] + c[E & 15];
  }
  function $(c) {
    return c < 2048 ? f[192 | c >> 6] + f[128 | c & 63] : c < 65536 ? f[224 | c >> 12] + f[128 | c >> 6 & 63] + f[128 | c & 63] : f[240 | c >> 18] + f[128 | c >> 12 & 63] + f[128 | c >> 6 & 63] + f[128 | c & 63];
  }
  function v(c) {
    let E = "", h = 0, t = 0;
    for (t = 0; t < c.length; t++)
      if (h = c[t].charCodeAt(0), h !== 48) {
        if (!(h >= 48 && h <= 57 || h >= 65 && h <= 70 || h >= 97 && h <= 102))
          return "";
        E += c[t];
        break;
      }
    for (t += 1; t < c.length; t++) {
      if (h = c[t].charCodeAt(0), !(h >= 48 && h <= 57 || h >= 65 && h <= 70 || h >= 97 && h <= 102))
        return "";
      E += c[t];
    }
    return E;
  }
  const O = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/), I = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/), R = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/), N = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function k(c) {
    if (c.length === 0) return !1;
    for (let E = 0; E < c.length; E++)
      if (!R(c[E])) {
        if (c[E] === "%" && E + 2 < c.length && m(c.slice(E + 1, E + 3))) {
          E += 2;
          continue;
        }
        return !1;
      }
    return !0;
  }
  function y(c) {
    let E = -1, h = 0, t = -1, r = 0;
    for (let T = 0; T < c.length; T++)
      c[T] === "0" ? (t === -1 && (t = T), r++, r > h && (h = r, E = t)) : (t = -1, r = 0);
    if (h < 2) return c.join(":");
    const b = c.slice(0, E).join(":"), C = c.slice(E + h).join(":");
    return b + "::" + C;
  }
  function g(c) {
    const E = c.indexOf("::");
    if (E !== -1 && c.indexOf("::", E + 1) !== -1) return;
    const h = E === -1 ? c.split(":") : c.slice(0, E).split(":"), t = E === -1 ? [] : c.slice(E + 2).split(":");
    E !== -1 && (h.length === 1 && h[0] === "" && (h.length = 0), t.length === 1 && t[0] === "" && (t.length = 0));
    const r = h.concat(t);
    let b = 0;
    for (let T = 0; T < r.length; T++) {
      const z = r[T];
      if (z === "") return;
      if (z.indexOf(".") !== -1) {
        if (T !== r.length - 1 || E !== -1 && t.length === 0 || !n(z)) return;
        b += 2;
        continue;
      }
      if (!O(z)) return;
      r[T] = parseInt(z, 16).toString(16), b++;
    }
    if (E === -1)
      return b !== 8 ? void 0 : y(r);
    if (b >= 8) return;
    const C = r.slice(0, h.length);
    for (let T = b; T < 8; T++) C.push("0");
    for (let T = h.length; T < r.length; T++) C.push(r[T]);
    return y(C);
  }
  function a(c) {
    const E = c[0] === "[" && c[c.length - 1] === "]";
    if ((c[0] === "[" || c[c.length - 1] === "]") && !E) return { host: c, isIPV6: !1, error: !0 };
    let t = E ? c.slice(1, -1) : c;
    if (E && I(t))
      return t = t.toLowerCase(), { host: `[${t}]`, escapedHost: t, isIPV6: !1, isIPVFuture: !0 };
    if (_(t, ":") < 2)
      return { host: c, isIPV6: !1, error: E };
    let r = "";
    const b = t.indexOf("%");
    if (b !== -1) {
      const T = t.slice(b, b + 3).toLowerCase() === "%25" ? 3 : 1;
      if (r = t.slice(b + T), !k(r)) return { host: c, isIPV6: !1, error: !0 };
      t = t.slice(0, b);
    }
    const C = g(t);
    return C === void 0 ? { host: c, isIPV6: !1, error: !0 } : {
      host: C + (r ? "%" + r : ""),
      escapedHost: C + (r ? "%25" + r : ""),
      isIPV6: !0
    };
  }
  function _(c, E) {
    let h = 0;
    for (let t = 0; t < c.length; t++)
      c[t] === E && h++;
    return h;
  }
  function P(c) {
    let E = c;
    const h = [];
    let t = -1, r = 0;
    for (; r = E.length; ) {
      if (r === 1) {
        if (E === ".")
          break;
        if (E === "/") {
          h.push("/");
          break;
        } else {
          h.push(E);
          break;
        }
      } else if (r === 2) {
        if (E[0] === ".") {
          if (E[1] === ".")
            break;
          if (E[1] === "/") {
            E = E.slice(2);
            continue;
          }
        } else if (E[0] === "/" && (E[1] === "." || E[1] === "/")) {
          h.push("/");
          break;
        }
      } else if (r === 3 && E === "/..") {
        h.length !== 0 && h.pop(), h.push("/");
        break;
      }
      if (E[0] === ".") {
        if (E[1] === ".") {
          if (E[2] === "/") {
            E = E.slice(3);
            continue;
          }
        } else if (E[1] === "/") {
          E = E.slice(2);
          continue;
        }
      } else if (E[0] === "/" && E[1] === ".") {
        if (E[2] === "/") {
          E = E.slice(2);
          continue;
        } else if (E[2] === "." && E[3] === "/") {
          E = E.slice(3), h.length !== 0 && h.pop();
          continue;
        }
      }
      if ((t = E.indexOf("/", 1)) === -1) {
        h.push(E);
        break;
      } else
        h.push(E.slice(0, t)), E = E.slice(t);
    }
    return h.join("");
  }
  function i(c) {
    if (c === "" || c[0] === "/")
      return P(c);
    const E = c.split("/"), h = E.length - 1, t = [];
    let r = !1;
    for (let b = 0; b <= h; b++) {
      const C = E[b];
      C === "." || C === ".." ? (C === ".." && (t.length !== 0 && t[t.length - 1] !== ".." ? t.pop() : t.push("..")), r = b === h) : t.push(C);
    }
    return r && t[t.length - 1] !== ".." && t.push(""), (t.length === 0 || t[0] === "" || t[0].includes(":")) && t.unshift("."), t.join("/");
  }
  const o = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, l = /[@/?#:]/g, p = /[@/?#]/g;
  function A(c, E) {
    const h = E ? p : l;
    return h.lastIndex = 0, c.replace(h, (t) => o[t]);
  }
  function F(c, E = !1) {
    if (c.indexOf("%") === -1)
      return c;
    let h = "";
    for (let t = 0; t < c.length; t++) {
      if (c[t] === "%" && t + 2 < c.length) {
        const r = c.slice(t + 1, t + 3);
        if (m(r)) {
          const b = r.toUpperCase(), C = String.fromCharCode(parseInt(b, 16));
          E && S(C) ? h += C : h += "%" + b, t += 2;
          continue;
        }
      }
      h += c[t];
    }
    return h;
  }
  function D(c) {
    let E = "";
    for (let h = 0; h < c.length; h++) {
      const t = c[h];
      if (t === "%" && h + 2 < c.length) {
        const r = c.slice(h + 1, h + 3);
        if (m(r)) {
          const b = r.toUpperCase(), C = String.fromCharCode(parseInt(b, 16));
          C !== "." && S(C) ? E += C : E += "%" + b, h += 2;
          continue;
        }
      }
      if (s(t))
        E += t;
      else {
        const r = c.charCodeAt(h);
        if (r < 128)
          E += ue(r) ? t : f[r];
        else if (r < 55296 || r > 57343)
          E += $(r);
        else if (r <= 56319 && h + 1 < c.length) {
          const b = c.charCodeAt(h + 1);
          b >= 56320 && b <= 57343 ? (E += $(65536 + (r - 55296 << 10) + (b - 56320)), h++) : E += $(65533);
        } else
          E += $(65533);
      }
    }
    return E;
  }
  function K(c, E = !1) {
    let h = "", t = E && c[0] !== "/";
    for (let r = 0; r < c.length; r++) {
      const b = c[r];
      if (b === "%" && r + 2 < c.length) {
        const C = c.slice(r + 1, r + 3);
        if (m(C)) {
          h += "%" + C.toUpperCase(), r += 2;
          continue;
        }
      }
      if (b === "/" && (t = !1), s(b) && (b !== ":" || !t))
        h += b;
      else {
        const C = c.charCodeAt(r);
        if (C < 128)
          h += f[C];
        else if (C < 55296 || C > 57343)
          h += $(C);
        else if (C <= 56319 && r + 1 < c.length) {
          const T = c.charCodeAt(r + 1);
          T >= 56320 && T <= 57343 ? (h += $(65536 + (C - 55296 << 10) + (T - 56320)), r++) : h += $(65533);
        } else
          h += $(65533);
      }
    }
    return h;
  }
  function L(c, E) {
    let h = "";
    for (let t = 0; t < c.length; t++) {
      const r = c[t];
      if (r === "%" && t + 2 < c.length) {
        const b = c.slice(t + 1, t + 3);
        if (m(b)) {
          h += "%" + b.toUpperCase(), t += 2;
          continue;
        }
      }
      if (E(r))
        h += r;
      else {
        const b = c.charCodeAt(t);
        if (b < 128)
          h += f[b];
        else if (b < 55296 || b > 57343)
          h += $(b);
        else if (b <= 56319 && t + 1 < c.length) {
          const C = c.charCodeAt(t + 1);
          C >= 56320 && C <= 57343 ? (h += $(65536 + (b - 55296 << 10) + (C - 56320)), t++) : h += $(65533);
        } else
          h += $(65533);
      }
    }
    return h;
  }
  function H(c) {
    return L(c, u);
  }
  function Z(c) {
    return L(c, d);
  }
  function ce(c) {
    return L(c, d);
  }
  function ue(c) {
    return c >= 48 && c <= 57 || c >= 65 && c <= 90 || c >= 97 && c <= 122 || c === 42 || c === 43 || c === 45 || c === 46 || c === 47 || c === 64 || c === 95;
  }
  function Y(c) {
    let E = "";
    for (let h = 0; h < c.length; h++) {
      const t = c[h];
      if (t === "%" && h + 2 < c.length) {
        const r = c.slice(h + 1, h + 3);
        if (m(r)) {
          const b = r.toUpperCase(), C = String.fromCharCode(parseInt(b, 16));
          S(C) ? E += C : E += "%" + b, h += 2;
          continue;
        }
      }
      if (d(t))
        E += t;
      else {
        const r = c.charCodeAt(h);
        if (r < 128)
          E += ue(r) ? t : f[r];
        else if (r < 55296 || r > 57343)
          E += $(r);
        else if (r <= 56319 && h + 1 < c.length) {
          const b = c.charCodeAt(h + 1);
          b >= 56320 && b <= 57343 ? (E += $(65536 + (r - 55296 << 10) + (b - 56320)), h++) : E += $(65533);
        } else
          E += $(65533);
      }
    }
    return E;
  }
  function le(c) {
    let E = "";
    for (let h = 0; h < c.length; h++) {
      if (c[h] === "%" && h + 2 < c.length) {
        const t = c.slice(h + 1, h + 3);
        if (m(t)) {
          E += "%" + t.toUpperCase(), h += 2;
          continue;
        }
      }
      E += escape(c[h]);
    }
    return E;
  }
  function V(c) {
    const E = [];
    if (c.userinfo !== void 0 && (E.push(H(c.userinfo)), E.push("@")), c.host !== void 0) {
      let h = c.host;
      if (!n(h)) {
        let t = a(h);
        t.isIPV6 !== !0 && t.isIPVFuture !== !0 && (h = F(h, !0), t = a(h)), t.isIPV6 === !0 || t.isIPVFuture === !0 ? h = `[${t.escapedHost}]` : h = A(h, !1);
      }
      E.push(h);
    }
    if (typeof c.port == "number" || typeof c.port == "string") {
      const h = String(c.port);
      if (!w(h))
        throw new TypeError("URI port is malformed.");
      E.push(":"), E.push(h);
    }
    return E.length ? E.join("") : void 0;
  }
  return Lt = {
    nonSimpleDomain: N,
    recomposeAuthority: V,
    reescapeHostDelimiters: A,
    normalizePercentEncoding: F,
    normalizePathEncoding: D,
    serializePathEncoding: K,
    normalizeQueryFragmentEncoding: Y,
    encodeUserinfo: H,
    encodeQuery: Z,
    encodeFragment: ce,
    escapePreservingEscapes: le,
    removeDotSegments: P,
    removeDotSegmentsRelative: i,
    isIPv4: n,
    isUUID: e,
    normalizeIPv6: a,
    stringArrayToHexStripped: v
  }, Lt;
}
var Kt, Or;
function na() {
  if (Or) return Kt;
  Or = 1;
  const { isUUID: e } = kn(), n = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu, w = (
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
  function m(i) {
    return w.indexOf(
      /** @type {*} */
      i
    ) !== -1;
  }
  function S(i) {
    return i.secure === !0 ? !0 : i.secure === !1 ? !1 : i.scheme ? i.scheme.length === 3 && (i.scheme[0] === "w" || i.scheme[0] === "W") && (i.scheme[1] === "s" || i.scheme[1] === "S") && (i.scheme[2] === "s" || i.scheme[2] === "S") : !1;
  }
  function s(i) {
    return i.host || (i.error = i.error || "HTTP URIs must have a host."), i;
  }
  function d(i) {
    const o = String(i.scheme).toLowerCase() === "https";
    return (i.port === (o ? 443 : 80) || i.port === "") && (i.port = void 0), i.path || (i.path = "/"), i;
  }
  function u(i) {
    return i.secure = S(i), i.resourceName = (i.path || "/") + (i.query ? "?" + i.query : ""), i.path = void 0, i.query = void 0, i;
  }
  function f(i) {
    if ((i.port === (S(i) ? 443 : 80) || i.port === "") && (i.port = void 0), typeof i.secure == "boolean" && (i.scheme = i.secure ? "wss" : "ws", i.secure = void 0), i.resourceName) {
      const o = i.resourceName.indexOf("?"), l = o === -1 ? i.resourceName : i.resourceName.slice(0, o);
      i.path = l && l !== "/" ? l : void 0, i.query = o === -1 ? void 0 : i.resourceName.slice(o + 1), i.resourceName = void 0;
    }
    return i.fragment = void 0, i;
  }
  function $(i, o) {
    if (!i.path)
      return i.error = "URN can not be parsed", i;
    const l = i.path.match(n);
    if (l && l[0] === i.path) {
      const p = o.scheme || i.scheme || "urn";
      i.nid = l[1].toLowerCase(), i.nss = l[2];
      const A = `${p}:${o.nid || i.nid}`, F = P(A);
      i.path = void 0, F && (i = F.parse(i, o));
    } else
      i.error = i.error || "URN can not be parsed.";
    return i;
  }
  function v(i, o) {
    if (i.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const l = o.scheme || i.scheme || "urn", p = i.nid.toLowerCase(), A = `${l}:${o.nid || p}`, F = P(A);
    F && (i = F.serialize(i, o));
    const D = i, K = i.nss;
    return D.path = `${p || o.nid}:${K}`, o.skipEscape = !0, D;
  }
  function O(i, o) {
    const l = i;
    return l.uuid = l.nss, l.nss = void 0, !o.tolerant && (!l.uuid || !e(l.uuid)) && (l.error = l.error || "UUID is not valid."), l;
  }
  function I(i) {
    const o = i;
    return o.nss = (i.uuid || "").toLowerCase(), o;
  }
  const R = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: s,
      serialize: d
    }
  ), N = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: R.domainHost,
      parse: s,
      serialize: d
    }
  ), k = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: u,
      serialize: f
    }
  ), y = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: k.domainHost,
      parse: k.parse,
      serialize: k.serialize
    }
  ), _ = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: R,
      https: N,
      ws: k,
      wss: y,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: $,
          serialize: v,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: O,
          serialize: I,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(_, null);
  function P(i) {
    return i && (_[
      /** @type {SchemeName} */
      i
    ] || _[
      /** @type {SchemeName} */
      i.toLowerCase()
    ]) || void 0;
  }
  return Kt = {
    wsIsSecure: S,
    SCHEMES: _,
    isValidSchemeName: m,
    getSchemeHandler: P
  }, Kt;
}
var Rr;
function aa() {
  if (Rr) return Me.exports;
  Rr = 1;
  const { normalizeIPv6: e, removeDotSegments: n, removeDotSegmentsRelative: w, recomposeAuthority: m, normalizePercentEncoding: S, normalizePathEncoding: s, serializePathEncoding: d, normalizeQueryFragmentEncoding: u, encodeQuery: f, encodeFragment: $, reescapeHostDelimiters: v, isIPv4: O, nonSimpleDomain: I } = kn(), { SCHEMES: R, getSchemeHandler: N } = na(), k = /^[A-Za-z][A-Za-z0-9+.-]*$/u, y = "URI scheme is malformed.", g = "URI host is malformed.", a = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
  function _(r) {
    const b = String(r);
    if (!k.test(b))
      throw new TypeError(y);
    return b;
  }
  function P(r, b) {
    return typeof r == "string" ? r = /** @type {T} */
    c(r, b) : typeof r == "object" && (r = /** @type {T} */
    V(p(r, b), b)), r;
  }
  function i(r, b, C) {
    const T = C ? Object.assign({ scheme: "null" }, C) : { scheme: "null" }, {
      parsed: z,
      malformedAuthorityOrPort: G,
      malformedPercentEncoding: j,
      malformedSchemeSpecific: q,
      malformedHost: M,
      malformedScheme: U
    } = le(r, T), {
      parsed: x,
      malformedAuthorityOrPort: J,
      malformedPercentEncoding: se,
      malformedSchemeSpecific: re,
      malformedHost: oe,
      malformedScheme: ee
    } = le(b, T);
    if (G || J || j || se || q || re || M || oe || U || ee)
      throw new Error(z.error || x.error || "URI is malformed.");
    const X = o(z, x, T, !0), _e = N(C && C.scheme || X.scheme), ie = X.host, ve = ie !== void 0 && ie !== "" && (O(ie) || e(ie).isIPV6);
    if (ue(X, C || {}, _e, ve))
      throw new Error(g);
    ce(X, C || {}, _e, ve);
    const qe = ie && ie.indexOf("%") !== -1 && !/\P{ASCII}/u.test(ie);
    if (X.error && !qe)
      throw new Error(X.error);
    return T.skipEscape = !0, p(X, T);
  }
  function o(r, b, C, T) {
    const z = {};
    if (T || (r = V(p(r, C), C), b = V(p(b, C), C)), C = C || {}, !C.tolerant && b.scheme)
      z.scheme = b.scheme, z.userinfo = b.userinfo, z.host = b.host, z.port = b.port, z.path = n(b.path || ""), z.query = b.query;
    else {
      if (b.userinfo !== void 0 || b.host !== void 0 || b.port !== void 0)
        z.userinfo = b.userinfo, z.host = b.host, z.port = b.port, z.path = n(b.path || ""), z.query = b.query;
      else {
        if (!b.path)
          z.path = r.path, b.query !== void 0 ? z.query = b.query : z.query = r.query;
        else {
          if (b.path[0] === "/")
            z.path = n(b.path);
          else {
            const G = r.userinfo !== void 0 || r.host !== void 0 || r.port !== void 0;
            G && !r.path ? z.path = "/" + b.path : r.path ? z.path = r.path.slice(0, r.path.lastIndexOf("/") + 1) + b.path : z.path = b.path, z.path = r.scheme === void 0 && !G && z.path[0] !== "/" ? w(z.path) : n(z.path);
          }
          z.query = b.query;
        }
        z.userinfo = r.userinfo, z.host = r.host, z.port = r.port;
      }
      z.scheme = r.scheme;
    }
    return z.fragment = b.fragment, z;
  }
  function l(r, b, C) {
    const T = h(r, C), z = h(b, C);
    return T !== void 0 && z !== void 0 && T === z;
  }
  function p(r, b) {
    const C = {
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
    }, T = Object.assign({}, b), z = [];
    C.scheme && (C.scheme = _(C.scheme));
    const G = N(T.scheme || C.scheme);
    G && G.serialize && G.serialize(C, T);
    const j = C.userinfo !== void 0 || C.host !== void 0 || C.port !== void 0, q = (C.scheme === void 0 || T.reference === "suffix") && !j, M = !T.skipEscape && q;
    C.path !== void 0 && (T.skipEscape ? C.path = S(C.path) : C.path = d(C.path, M)), T.reference !== "suffix" && C.scheme && (C.scheme = _(C.scheme), z.push(C.scheme, ":"));
    const U = m(C);
    if (U !== void 0 && (T.reference !== "suffix" && z.push("//"), z.push(U), C.path && C.path[0] !== "/" && z.push("/")), C.path !== void 0) {
      let x = C.path;
      !T.absolutePath && (!G || !G.absolutePath) && (x = q && x[0] !== "/" ? w(x) : n(x)), q && (x = d(x, !0)), U === void 0 && x[0] === "/" && x[1] === "/" && (x = "/%2F" + x.slice(2)), z.push(x);
    }
    return C.query !== void 0 && z.push("?", f(C.query)), C.fragment !== void 0 && z.push("#", $(C.fragment)), z.join("");
  }
  const A = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u, F = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/, D = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
  function K(r, b) {
    if (b[2] !== void 0 && r.path && r.path[0] !== "/")
      return 'URI path must start with "/" when authority is present.';
    if (typeof r.port == "number" && (r.port < 0 || r.port > 65535))
      return "URI port is malformed.";
  }
  function L(r) {
    if (r === void 0) return !1;
    let b = r.indexOf("%");
    for (; b !== -1; ) {
      if (b + 2 >= r.length || !/^[\da-f]{2}$/iu.test(r.slice(b + 1, b + 3)))
        return !0;
      b = r.indexOf("%", b + 3);
    }
    return !1;
  }
  function H(r) {
    return r[0] === "[" && r[r.length - 1] === "]";
  }
  function Z(r) {
    const b = r[4];
    return L(r[3]) || b !== void 0 && !H(b) && L(b) || L(r[6]) || L(r[7]) || L(r[8]);
  }
  function ce(r, b, C, T) {
    if (ue(r, b, C, T))
      return r.error = r.error || g, !0;
    if (!b.unicodeSupport && (!C || !C.unicodeSupport) && r.host && !H(r.host) && (b.domainHost || C && C.domainHost) && T === !1 && I(r.host)) {
      let z;
      try {
        z = new URL("http://" + r.host);
      } catch (G) {
        return r.error = r.error || "Host's domain name can not be converted to ASCII: " + G, !0;
      }
      if (!Y(z))
        return r.error = r.error || g, !0;
      r.host = z.hostname;
    }
    return !1;
  }
  function ue(r, b, C, T) {
    return !!(r.host && T === !1 && !H(r.host) && (b.domainHost || C && C.domainHost) && a.test(r.host));
  }
  function Y(r) {
    return r.username === "" && r.password === "" && r.port === "" && r.pathname === "/" && r.search === "" && r.hash === "" && r.hostname !== "";
  }
  function le(r, b) {
    const C = Object.assign({}, b), T = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let z = !1, G = !1, j = !1, q = !1, M = !1, U = !1, x = !1;
    C.reference === "suffix" && (C.scheme ? r = C.scheme + ":" + r : r = "//" + r);
    const J = r.match(F);
    J !== null && J[1].indexOf("\\") !== -1 && (T.error = "URI authority must not contain a literal backslash.", z = !0);
    const se = r.match(D);
    if (se !== null) {
      const oe = se[1], ee = oe.replace(/[\t\n\r]/g, "");
      ee.length >= 2 && (ee.slice(0, 2) !== "//" ? (T.error = T.error || "URI authority must not contain a literal backslash.", z = !0) : oe.length !== ee.length && (T.error = T.error || "URI authority introducer must not contain whitespace.", z = !0));
    }
    const re = r.match(A);
    if (re) {
      T.scheme = re[1], T.userinfo = re[3], T.host = re[4], T.port = parseInt(re[5], 10), T.path = re[6] || "", T.query = re[7], T.fragment = re[8], T.scheme !== void 0 && (k.test(T.scheme) ? T.scheme = T.scheme.toLowerCase() : (T.error = T.error || y, U = !0)), G = Z(re), G && (T.error = T.error || "URI contains malformed percent-encoding."), isNaN(T.port) && (T.port = re[5]);
      const oe = K(T, re);
      if (oe !== void 0 && (T.error = T.error || oe, z = !0), T.host)
        if (O(T.host) === !1) {
          const _e = H(T.host), ie = T.host.indexOf("[") !== -1 || T.host.indexOf("]") !== -1, ve = e(T.host);
          x = ve.isIPV6 || ve.isIPVFuture === !0, M = ie && (!_e || ve.error === !0), T.host = x ? ve.host : ve.host.toLowerCase(), M && (T.error = T.error || g, z = !0);
        } else
          x = !0;
      T.scheme === void 0 && T.userinfo === void 0 && T.host === void 0 && T.port === void 0 && T.query === void 0 && !T.path ? T.reference = "same-document" : T.scheme === void 0 ? T.reference = "relative" : T.fragment === void 0 ? T.reference = "absolute" : T.reference = "uri", C.reference && C.reference !== "suffix" && C.reference !== T.reference && (T.error = T.error || "URI is not a " + C.reference + " reference.");
      const ee = N(C.scheme || T.scheme);
      if (M || (q = ce(T, C, ee, x)), r.indexOf("%") !== -1 && T.host !== void 0 && !M) {
        let X = x ? T.host : S(T.host, !0);
        x || (X = S(X.toLowerCase())), T.host = x || C.scheme !== "null" ? v(X, x) : X;
      }
      (!ee || ee && !ee.skipNormalize) && (T.path && (T.path = s(T.path)), T.query && (T.query = u(T.query)), T.fragment && (T.fragment = u(T.fragment))), ee && ee.parse && (ee.parse(T, C), ee === R.urn && T.nid === void 0 && (j = !0));
    } else
      T.error = T.error || "URI can not be parsed.";
    return { parsed: T, malformedAuthorityOrPort: z, malformedPercentEncoding: G, malformedSchemeSpecific: j, malformedHost: q, malformedScheme: U };
  }
  function V(r, b) {
    return le(r, b).parsed;
  }
  function c(r, b) {
    return E(r, b).normalized;
  }
  function E(r, b) {
    const { parsed: C, malformedAuthorityOrPort: T, malformedPercentEncoding: z, malformedSchemeSpecific: G, malformedHost: j, malformedScheme: q } = le(r, b);
    return {
      normalized: T || z || G || j || q ? r : p(C, b),
      malformedAuthorityOrPort: T,
      malformedPercentEncoding: z,
      malformedSchemeSpecific: G,
      malformedHost: j,
      malformedScheme: q
    };
  }
  function h(r, b) {
    if (typeof r != "string" && typeof r != "object")
      return;
    let C;
    try {
      C = typeof r == "string" ? r : p(r, b);
    } catch {
      return;
    }
    const { normalized: T, malformedAuthorityOrPort: z, malformedPercentEncoding: G, malformedSchemeSpecific: j, malformedHost: q, malformedScheme: M } = E(C, b);
    return z || G || j || q || M ? void 0 : T;
  }
  const t = {
    SCHEMES: R,
    normalize: P,
    resolve: i,
    resolveComponent: o,
    equal: l,
    serialize: p,
    parse: V
  };
  return Me.exports = t, Me.exports.default = t, Me.exports.fastUri = t, Me.exports;
}
var Nr;
function sa() {
  if (Nr) return He;
  Nr = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const e = aa();
  return e.code = 'require("ajv/dist/runtime/uri").default', He.default = e, He;
}
var Ir;
function oa() {
  return Ir || (Ir = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var n = /* @__PURE__ */ jt();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return n.KeywordCxt;
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
    const m = /* @__PURE__ */ Bt(), S = /* @__PURE__ */ Tt(), s = /* @__PURE__ */ En(), d = /* @__PURE__ */ Wt(), u = /* @__PURE__ */ W(), f = /* @__PURE__ */ It(), $ = /* @__PURE__ */ Rt(), v = /* @__PURE__ */ Q(), O = ra, I = /* @__PURE__ */ sa(), R = (V, c) => new RegExp(V, c);
    R.code = "new RegExp";
    const N = ["removeAdditional", "useDefaults", "coerceTypes"], k = /* @__PURE__ */ new Set([
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
    ]), y = {
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
    }, g = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, a = 200;
    function _(V) {
      var c, E, h, t, r, b, C, T, z, G, j, q, M, U, x, J, se, re, oe, ee, X, _e, ie, ve, qe;
      const Ae = V.strict, Ct = (c = V.code) === null || c === void 0 ? void 0 : c.optimize, Qt = Ct === !0 || Ct === void 0 ? 1 : Ct || 0, Yt = (h = (E = V.code) === null || E === void 0 ? void 0 : E.regExp) !== null && h !== void 0 ? h : R, jn = (t = V.uriResolver) !== null && t !== void 0 ? t : I.default;
      return {
        strictSchema: (b = (r = V.strictSchema) !== null && r !== void 0 ? r : Ae) !== null && b !== void 0 ? b : !0,
        strictNumbers: (T = (C = V.strictNumbers) !== null && C !== void 0 ? C : Ae) !== null && T !== void 0 ? T : !0,
        strictTypes: (G = (z = V.strictTypes) !== null && z !== void 0 ? z : Ae) !== null && G !== void 0 ? G : "log",
        strictTuples: (q = (j = V.strictTuples) !== null && j !== void 0 ? j : Ae) !== null && q !== void 0 ? q : "log",
        strictRequired: (U = (M = V.strictRequired) !== null && M !== void 0 ? M : Ae) !== null && U !== void 0 ? U : !1,
        code: V.code ? { ...V.code, optimize: Qt, regExp: Yt } : { optimize: Qt, regExp: Yt },
        loopRequired: (x = V.loopRequired) !== null && x !== void 0 ? x : a,
        loopEnum: (J = V.loopEnum) !== null && J !== void 0 ? J : a,
        meta: (se = V.meta) !== null && se !== void 0 ? se : !0,
        messages: (re = V.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (oe = V.inlineRefs) !== null && oe !== void 0 ? oe : !0,
        schemaId: (ee = V.schemaId) !== null && ee !== void 0 ? ee : "$id",
        addUsedSchema: (X = V.addUsedSchema) !== null && X !== void 0 ? X : !0,
        validateSchema: (_e = V.validateSchema) !== null && _e !== void 0 ? _e : !0,
        validateFormats: (ie = V.validateFormats) !== null && ie !== void 0 ? ie : !0,
        unicodeRegExp: (ve = V.unicodeRegExp) !== null && ve !== void 0 ? ve : !0,
        int32range: (qe = V.int32range) !== null && qe !== void 0 ? qe : !0,
        uriResolver: jn
      };
    }
    class P {
      constructor(c = {}) {
        this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), c = this.opts = { ...c, ..._(c) };
        const { es5: E, lines: h } = this.opts.code;
        this.scope = new u.ValueScope({ scope: {}, prefixes: k, es5: E, lines: h }), this.logger = K(c.logger);
        const t = c.validateFormats;
        c.validateFormats = !1, this.RULES = (0, s.getRules)(), i.call(this, y, c, "NOT SUPPORTED"), i.call(this, g, c, "DEPRECATED", "warn"), this._metaOpts = F.call(this), c.formats && p.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), c.keywords && A.call(this, c.keywords), typeof c.meta == "object" && this.addMetaSchema(c.meta), l.call(this), c.validateFormats = t;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: c, meta: E, schemaId: h } = this.opts;
        let t = O;
        h === "id" && (t = { ...O }, t.id = t.$id, delete t.$id), E && c && this.addMetaSchema(t, t[h], !1);
      }
      defaultMeta() {
        const { meta: c, schemaId: E } = this.opts;
        return this.opts.defaultMeta = typeof c == "object" ? c[E] || c : void 0;
      }
      validate(c, E) {
        let h;
        if (typeof c == "string") {
          if (h = this.getSchema(c), !h)
            throw new Error(`no schema with key or ref "${c}"`);
        } else
          h = this.compile(c);
        const t = h(E);
        return "$async" in h || (this.errors = h.errors), t;
      }
      compile(c, E) {
        const h = this._addSchema(c, E);
        return h.validate || this._compileSchemaEnv(h);
      }
      compileAsync(c, E) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: h } = this.opts;
        return t.call(this, c, E);
        async function t(G, j) {
          await r.call(this, G.$schema);
          const q = this._addSchema(G, j);
          return q.validate || b.call(this, q);
        }
        async function r(G) {
          G && !this.getSchema(G) && await t.call(this, { $ref: G }, !0);
        }
        async function b(G) {
          try {
            return this._compileSchemaEnv(G);
          } catch (j) {
            if (!(j instanceof S.default))
              throw j;
            return C.call(this, j), await T.call(this, j.missingSchema), b.call(this, G);
          }
        }
        function C({ missingSchema: G, missingRef: j }) {
          if (this.refs[G])
            throw new Error(`AnySchema ${G} is loaded but ${j} cannot be resolved`);
        }
        async function T(G) {
          const j = await z.call(this, G);
          this.refs[G] || await r.call(this, j.$schema), this.refs[G] || this.addSchema(j, G, E);
        }
        async function z(G) {
          const j = this._loading[G];
          if (j)
            return j;
          try {
            return await (this._loading[G] = h(G));
          } finally {
            delete this._loading[G];
          }
        }
      }
      // Adds schema to the instance
      addSchema(c, E, h, t = this.opts.validateSchema) {
        if (Array.isArray(c)) {
          for (const b of c)
            this.addSchema(b, void 0, h, t);
          return this;
        }
        let r;
        if (typeof c == "object") {
          const { schemaId: b } = this.opts;
          if (r = c[b], r !== void 0 && typeof r != "string")
            throw new Error(`schema ${b} must be string`);
        }
        return E = (0, f.normalizeId)(E || r), this._checkUnique(E), this.schemas[E] = this._addSchema(c, h, E, t, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(c, E, h = this.opts.validateSchema) {
        return this.addSchema(c, E, !0, h), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(c, E) {
        if (typeof c == "boolean")
          return !0;
        let h;
        if (h = c.$schema, h !== void 0 && typeof h != "string")
          throw new Error("$schema must be a string");
        if (h = h || this.opts.defaultMeta || this.defaultMeta(), !h)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const t = this.validate(h, c);
        if (!t && E) {
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
      getSchema(c) {
        let E;
        for (; typeof (E = o.call(this, c)) == "string"; )
          c = E;
        if (E === void 0) {
          const { schemaId: h } = this.opts, t = new d.SchemaEnv({ schema: {}, schemaId: h });
          if (E = d.resolveSchema.call(this, t, c), !E)
            return;
          this.refs[c] = E;
        }
        return E.validate || this._compileSchemaEnv(E);
      }
      // Remove cached schema(s).
      // If no parameter is passed all schemas but meta-schemas are removed.
      // If RegExp is passed all schemas with key/id matching pattern but meta-schemas are removed.
      // Even if schema is referenced by other schemas it still can be removed as other schemas have local references.
      removeSchema(c) {
        if (c instanceof RegExp)
          return this._removeAllSchemas(this.schemas, c), this._removeAllSchemas(this.refs, c), this;
        switch (typeof c) {
          case "undefined":
            return this._removeAllSchemas(this.schemas), this._removeAllSchemas(this.refs), this._cache.clear(), this;
          case "string": {
            const E = o.call(this, c);
            return typeof E == "object" && this._cache.delete(E.schema), delete this.schemas[c], delete this.refs[c], this;
          }
          case "object": {
            const E = c;
            this._cache.delete(E);
            let h = c[this.opts.schemaId];
            return h && (h = (0, f.normalizeId)(h), delete this.schemas[h], delete this.refs[h]), this;
          }
          default:
            throw new Error("ajv.removeSchema: invalid parameter");
        }
      }
      // add "vocabulary" - a collection of keywords
      addVocabulary(c) {
        for (const E of c)
          this.addKeyword(E);
        return this;
      }
      addKeyword(c, E) {
        let h;
        if (typeof c == "string")
          h = c, typeof E == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), E.keyword = h);
        else if (typeof c == "object" && E === void 0) {
          if (E = c, h = E.keyword, Array.isArray(h) && !h.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (H.call(this, h, E), !E)
          return (0, v.eachItem)(h, (r) => Z.call(this, r)), this;
        ue.call(this, E);
        const t = {
          ...E,
          type: (0, $.getJSONTypes)(E.type),
          schemaType: (0, $.getJSONTypes)(E.schemaType)
        };
        return (0, v.eachItem)(h, t.type.length === 0 ? (r) => Z.call(this, r, t) : (r) => t.type.forEach((b) => Z.call(this, r, t, b))), this;
      }
      getKeyword(c) {
        const E = this.RULES.all[c];
        return typeof E == "object" ? E.definition : !!E;
      }
      // Remove keyword
      removeKeyword(c) {
        const { RULES: E } = this;
        delete E.keywords[c], delete E.all[c];
        for (const h of E.rules) {
          const t = h.rules.findIndex((r) => r.keyword === c);
          t >= 0 && h.rules.splice(t, 1);
        }
        return this;
      }
      // Add format
      addFormat(c, E) {
        return typeof E == "string" && (E = new RegExp(E)), this.formats[c] = E, this;
      }
      errorsText(c = this.errors, { separator: E = ", ", dataVar: h = "data" } = {}) {
        return !c || c.length === 0 ? "No errors" : c.map((t) => `${h}${t.instancePath} ${t.message}`).reduce((t, r) => t + E + r);
      }
      $dataMetaSchema(c, E) {
        const h = this.RULES.all;
        c = JSON.parse(JSON.stringify(c));
        for (const t of E) {
          const r = t.split("/").slice(1);
          let b = c;
          for (const C of r)
            b = b[C];
          for (const C in h) {
            const T = h[C];
            if (typeof T != "object")
              continue;
            const { $data: z } = T.definition, G = b[C];
            z && G && (b[C] = le(G));
          }
        }
        return c;
      }
      _removeAllSchemas(c, E) {
        for (const h in c) {
          const t = c[h];
          (!E || E.test(h)) && (typeof t == "string" ? delete c[h] : t && !t.meta && (this._cache.delete(t.schema), delete c[h]));
        }
      }
      _addSchema(c, E, h, t = this.opts.validateSchema, r = this.opts.addUsedSchema) {
        let b;
        const { schemaId: C } = this.opts;
        if (typeof c == "object")
          b = c[C];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof c != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let T = this._cache.get(c);
        if (T !== void 0)
          return T;
        h = (0, f.normalizeId)(b || h);
        const z = f.getSchemaRefs.call(this, c, h);
        return T = new d.SchemaEnv({ schema: c, schemaId: C, meta: E, baseId: h, localRefs: z }), this._cache.set(T.schema, T), r && !h.startsWith("#") && (h && this._checkUnique(h), this.refs[h] = T), t && this.validateSchema(c, !0), T;
      }
      _checkUnique(c) {
        if (this.schemas[c] || this.refs[c])
          throw new Error(`schema with key or id "${c}" already exists`);
      }
      _compileSchemaEnv(c) {
        if (c.meta ? this._compileMetaSchema(c) : d.compileSchema.call(this, c), !c.validate)
          throw new Error("ajv implementation error");
        return c.validate;
      }
      _compileMetaSchema(c) {
        const E = this.opts;
        this.opts = this._metaOpts;
        try {
          d.compileSchema.call(this, c);
        } finally {
          this.opts = E;
        }
      }
    }
    P.ValidationError = m.default, P.MissingRefError = S.default, e.default = P;
    function i(V, c, E, h = "error") {
      for (const t in V) {
        const r = t;
        r in c && this.logger[h](`${E}: option ${t}. ${V[r]}`);
      }
    }
    function o(V) {
      return V = (0, f.normalizeId)(V), this.schemas[V] || this.refs[V];
    }
    function l() {
      const V = this.opts.schemas;
      if (V)
        if (Array.isArray(V))
          this.addSchema(V);
        else
          for (const c in V)
            this.addSchema(V[c], c);
    }
    function p() {
      for (const V in this.opts.formats) {
        const c = this.opts.formats[V];
        c && this.addFormat(V, c);
      }
    }
    function A(V) {
      if (Array.isArray(V)) {
        this.addVocabulary(V);
        return;
      }
      this.logger.warn("keywords option as map is deprecated, pass array");
      for (const c in V) {
        const E = V[c];
        E.keyword || (E.keyword = c), this.addKeyword(E);
      }
    }
    function F() {
      const V = { ...this.opts };
      for (const c of N)
        delete V[c];
      return V;
    }
    const D = { log() {
    }, warn() {
    }, error() {
    } };
    function K(V) {
      if (V === !1)
        return D;
      if (V === void 0)
        return console;
      if (V.log && V.warn && V.error)
        return V;
      throw new Error("logger must implement log, warn and error methods");
    }
    const L = /^[a-z_$][a-z0-9_$:-]*$/i;
    function H(V, c) {
      const { RULES: E } = this;
      if ((0, v.eachItem)(V, (h) => {
        if (E.keywords[h])
          throw new Error(`Keyword ${h} is already defined`);
        if (!L.test(h))
          throw new Error(`Keyword ${h} has invalid name`);
      }), !!c && c.$data && !("code" in c || "validate" in c))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Z(V, c, E) {
      var h;
      const t = c?.post;
      if (E && t)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: r } = this;
      let b = t ? r.post : r.rules.find(({ type: T }) => T === E);
      if (b || (b = { type: E, rules: [] }, r.rules.push(b)), r.keywords[V] = !0, !c)
        return;
      const C = {
        keyword: V,
        definition: {
          ...c,
          type: (0, $.getJSONTypes)(c.type),
          schemaType: (0, $.getJSONTypes)(c.schemaType)
        }
      };
      c.before ? ce.call(this, b, C, c.before) : b.rules.push(C), r.all[V] = C, (h = c.implements) === null || h === void 0 || h.forEach((T) => this.addKeyword(T));
    }
    function ce(V, c, E) {
      const h = V.rules.findIndex((t) => t.keyword === E);
      h >= 0 ? V.rules.splice(h, 0, c) : (V.rules.push(c), this.logger.warn(`rule ${E} is not defined`));
    }
    function ue(V) {
      let { metaSchema: c } = V;
      c !== void 0 && (V.$data && this.opts.$data && (c = le(c)), V.validateSchema = this.compile(c, !0));
    }
    const Y = {
      $ref: "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#"
    };
    function le(V) {
      return { anyOf: [V, Y] };
    }
  })(At)), At;
}
var Ge = {}, Je = {}, Be = {}, jr;
function ia() {
  if (jr) return Be;
  jr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Be.default = e, Be;
}
var ke = {}, Tr;
function ua() {
  if (Tr) return ke;
  Tr = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.callRef = ke.getValidate = void 0;
  const e = /* @__PURE__ */ Tt(), n = /* @__PURE__ */ we(), w = /* @__PURE__ */ W(), m = /* @__PURE__ */ Oe(), S = /* @__PURE__ */ Wt(), s = /* @__PURE__ */ Q(), d = {
    keyword: "$ref",
    schemaType: "string",
    code($) {
      const { gen: v, schema: O, it: I } = $, { baseId: R, schemaEnv: N, validateName: k, opts: y, self: g } = I, { root: a } = N;
      if ((O === "#" || O === "#/") && R === a.baseId)
        return P();
      const _ = S.resolveRef.call(g, a, R, O);
      if (_ === void 0)
        throw new e.default(I.opts.uriResolver, R, O);
      if (_ instanceof S.SchemaEnv)
        return i(_);
      return o(_);
      function P() {
        if (N === a)
          return f($, k, N, N.$async);
        const l = v.scopeValue("root", { ref: a });
        return f($, (0, w._)`${l}.validate`, a, a.$async);
      }
      function i(l) {
        const p = u($, l);
        f($, p, l, l.$async);
      }
      function o(l) {
        const p = v.scopeValue("schema", y.code.source === !0 ? { ref: l, code: (0, w.stringify)(l) } : { ref: l }), A = v.name("valid"), F = $.subschema({
          schema: l,
          dataTypes: [],
          schemaPath: w.nil,
          topSchemaRef: p,
          errSchemaPath: O
        }, A);
        $.mergeEvaluated(F), $.ok(A);
      }
    }
  };
  function u($, v) {
    const { gen: O } = $;
    return v.validate ? O.scopeValue("validate", { ref: v.validate }) : (0, w._)`${O.scopeValue("wrapper", { ref: v })}.validate`;
  }
  ke.getValidate = u;
  function f($, v, O, I) {
    const { gen: R, it: N } = $, { allErrors: k, schemaEnv: y, opts: g } = N, a = g.passContext ? m.default.this : w.nil;
    I ? _() : P();
    function _() {
      if (!y.$async)
        throw new Error("async schema referenced by sync schema");
      const l = R.let("valid");
      R.try(() => {
        R.code((0, w._)`await ${(0, n.callValidateCode)($, v, a)}`), o(v), k || R.assign(l, !0);
      }, (p) => {
        R.if((0, w._)`!(${p} instanceof ${N.ValidationError})`, () => R.throw(p)), i(p), k || R.assign(l, !1);
      }), $.ok(l);
    }
    function P() {
      $.result((0, n.callValidateCode)($, v, a), () => o(v), () => i(v));
    }
    function i(l) {
      const p = (0, w._)`${l}.errors`;
      R.assign(m.default.vErrors, (0, w._)`${m.default.vErrors} === null ? ${p} : ${m.default.vErrors}.concat(${p})`), R.assign(m.default.errors, (0, w._)`${m.default.vErrors}.length`);
    }
    function o(l) {
      var p;
      if (!N.opts.unevaluated)
        return;
      const A = (p = O?.validate) === null || p === void 0 ? void 0 : p.evaluated;
      if (N.props !== !0)
        if (A && !A.dynamicProps)
          A.props !== void 0 && (N.props = s.mergeEvaluated.props(R, A.props, N.props));
        else {
          const F = R.var("props", (0, w._)`${l}.evaluated.props`);
          N.props = s.mergeEvaluated.props(R, F, N.props, w.Name);
        }
      if (N.items !== !0)
        if (A && !A.dynamicItems)
          A.items !== void 0 && (N.items = s.mergeEvaluated.items(R, A.items, N.items));
        else {
          const F = R.var("items", (0, w._)`${l}.evaluated.items`);
          N.items = s.mergeEvaluated.items(R, F, N.items, w.Name);
        }
    }
  }
  return ke.callRef = f, ke.default = d, ke;
}
var Cr;
function ca() {
  if (Cr) return Je;
  Cr = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ia(), n = /* @__PURE__ */ ua(), w = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    n.default
  ];
  return Je.default = w, Je;
}
var We = {}, Ze = {}, qr;
function la() {
  if (qr) return Ze;
  qr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = e.operators, w = {
    maximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    minimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    exclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    exclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, m = {
    message: ({ keyword: s, schemaCode: d }) => (0, e.str)`must be ${w[s].okStr} ${d}`,
    params: ({ keyword: s, schemaCode: d }) => (0, e._)`{comparison: ${w[s].okStr}, limit: ${d}}`
  }, S = {
    keyword: Object.keys(w),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: m,
    code(s) {
      const { keyword: d, data: u, schemaCode: f } = s;
      s.fail$data((0, e._)`${u} ${w[d].fail} ${f} || isNaN(${u})`);
    }
  };
  return Ze.default = S, Ze;
}
var Qe = {}, Ar;
function da() {
  if (Ar) return Qe;
  Ar = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: m }) => (0, e.str)`must be multiple of ${m}`,
      params: ({ schemaCode: m }) => (0, e._)`{multipleOf: ${m}}`
    },
    code(m) {
      const { gen: S, data: s, schemaCode: d, it: u } = m, f = u.opts.multipleOfPrecision, $ = S.let("res"), v = f ? (0, e._)`Math.abs(Math.round(${$}) - ${$}) > 1e-${f}` : (0, e._)`${$} !== parseInt(${$})`;
      m.fail$data((0, e._)`(${d} === 0 || (${$} = ${s}/${d}, ${v}))`);
    }
  };
  return Qe.default = w, Qe;
}
var Ye = {}, Xe = {}, Dr;
function fa() {
  if (Dr) return Xe;
  Dr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  function e(n) {
    const w = n.length;
    let m = 0, S = 0, s;
    for (; S < w; )
      m++, s = n.charCodeAt(S++), s >= 55296 && s <= 56319 && S < w && (s = n.charCodeAt(S), (s & 64512) === 56320 && S++);
    return m;
  }
  return Xe.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Xe;
}
var Mr;
function ma() {
  if (Mr) return Ye;
  Mr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ fa(), S = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: s, schemaCode: d }) {
        const u = s === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${u} than ${d} characters`;
      },
      params: ({ schemaCode: s }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { keyword: d, data: u, schemaCode: f, it: $ } = s, v = d === "maxLength" ? e.operators.GT : e.operators.LT, O = $.opts.unicode === !1 ? (0, e._)`${u}.length` : (0, e._)`${(0, n.useFunc)(s.gen, w.default)}(${u})`;
      s.fail$data((0, e._)`${O} ${v} ${f}`);
    }
  };
  return Ye.default = S, Ye;
}
var et = {}, Fr;
function ha() {
  if (Fr) return et;
  Fr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ we(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ W(), S = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: s }) => (0, w.str)`must match pattern "${s}"`,
      params: ({ schemaCode: s }) => (0, w._)`{pattern: ${s}}`
    },
    code(s) {
      const { gen: d, data: u, $data: f, schema: $, schemaCode: v, it: O } = s, I = O.opts.unicodeRegExp ? "u" : "";
      if (f) {
        const { regExp: R } = O.opts.code, N = R.code === "new RegExp" ? (0, w._)`new RegExp` : (0, n.useFunc)(d, R), k = d.let("valid");
        d.try(() => d.assign(k, (0, w._)`${N}(${v}, ${I}).test(${u})`), () => d.assign(k, !1)), s.fail$data((0, w._)`!${k}`);
      } else {
        const R = (0, e.usePattern)(s, $);
        s.fail$data((0, w._)`!${R}.test(${u})`);
      }
    }
  };
  return et.default = S, et;
}
var tt = {}, zr;
function pa() {
  if (zr) return tt;
  zr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: m, schemaCode: S }) {
        const s = m === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${s} than ${S} properties`;
      },
      params: ({ schemaCode: m }) => (0, e._)`{limit: ${m}}`
    },
    code(m) {
      const { keyword: S, data: s, schemaCode: d } = m, u = S === "maxProperties" ? e.operators.GT : e.operators.LT;
      m.fail$data((0, e._)`Object.keys(${s}).length ${u} ${d}`);
    }
  };
  return tt.default = w, tt;
}
var rt = {}, Vr;
function ya() {
  if (Vr) return rt;
  Vr = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ we(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), S = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: s } }) => (0, n.str)`must have required property '${s}'`,
      params: ({ params: { missingProperty: s } }) => (0, n._)`{missingProperty: ${s}}`
    },
    code(s) {
      const { gen: d, schema: u, schemaCode: f, data: $, $data: v, it: O } = s, { opts: I } = O;
      if (!v && u.length === 0)
        return;
      const R = u.length >= I.loopRequired;
      if (O.allErrors ? N() : k(), I.strictRequired) {
        const a = s.parentSchema.properties, { definedProperties: _ } = s.it;
        for (const P of u)
          if (a?.[P] === void 0 && !_.has(P)) {
            const i = O.schemaEnv.baseId + O.errSchemaPath, o = `required property "${P}" is not defined at "${i}" (strictRequired)`;
            (0, w.checkStrictMode)(O, o, O.opts.strictRequired);
          }
      }
      function N() {
        if (R || v)
          s.block$data(n.nil, y);
        else
          for (const a of u)
            (0, e.checkReportMissingProp)(s, a);
      }
      function k() {
        const a = d.let("missing");
        if (R || v) {
          const _ = d.let("valid", !0);
          s.block$data(_, () => g(a, _)), s.ok(_);
        } else
          d.if((0, e.checkMissingProp)(s, u, a)), (0, e.reportMissingProp)(s, a), d.else();
      }
      function y() {
        d.forOf("prop", f, (a) => {
          s.setParams({ missingProperty: a }), d.if((0, e.noPropertyInData)(d, $, a, I.ownProperties), () => s.error());
        });
      }
      function g(a, _) {
        s.setParams({ missingProperty: a }), d.forOf(a, f, () => {
          d.assign(_, (0, e.propertyInData)(d, $, a, I.ownProperties)), d.if((0, n.not)(_), () => {
            s.error(), d.break();
          });
        }, n.nil);
      }
    }
  };
  return rt.default = S, rt;
}
var nt = {}, Ur;
function va() {
  if (Ur) return nt;
  Ur = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: m, schemaCode: S }) {
        const s = m === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${s} than ${S} items`;
      },
      params: ({ schemaCode: m }) => (0, e._)`{limit: ${m}}`
    },
    code(m) {
      const { keyword: S, data: s, schemaCode: d } = m, u = S === "maxItems" ? e.operators.GT : e.operators.LT;
      m.fail$data((0, e._)`${s}.length ${u} ${d}`);
    }
  };
  return nt.default = w, nt;
}
var at = {}, st = {}, Lr;
function Zt() {
  if (Lr) return st;
  Lr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const e = Pn();
  return e.code = 'require("ajv/dist/runtime/equal").default', st.default = e, st;
}
var Kr;
function _a() {
  if (Kr) return at;
  Kr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Rt(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), m = /* @__PURE__ */ Zt(), s = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: d, j: u } }) => (0, n.str)`must NOT have duplicate items (items ## ${u} and ${d} are identical)`,
      params: ({ params: { i: d, j: u } }) => (0, n._)`{i: ${d}, j: ${u}}`
    },
    code(d) {
      const { gen: u, data: f, $data: $, schema: v, parentSchema: O, schemaCode: I, it: R } = d;
      if (!$ && !v)
        return;
      const N = u.let("valid"), k = O.items ? (0, e.getSchemaTypes)(O.items) : [];
      d.block$data(N, y, (0, n._)`${I} === false`), d.ok(N);
      function y() {
        const P = u.let("i", (0, n._)`${f}.length`), i = u.let("j");
        d.setParams({ i: P, j: i }), u.assign(N, !0), u.if((0, n._)`${P} > 1`, () => (g() ? a : _)(P, i));
      }
      function g() {
        return k.length > 0 && !k.some((P) => P === "object" || P === "array");
      }
      function a(P, i) {
        const o = u.name("item"), l = (0, e.checkDataTypes)(k, o, R.opts.strictNumbers, e.DataType.Wrong), p = u.const("indices", (0, n._)`{}`);
        u.for((0, n._)`;${P}--;`, () => {
          u.let(o, (0, n._)`${f}[${P}]`), u.if(l, (0, n._)`continue`), k.length > 1 && u.if((0, n._)`typeof ${o} == "string"`, (0, n._)`${o} += "_"`), u.if((0, n._)`typeof ${p}[${o}] == "number"`, () => {
            u.assign(i, (0, n._)`${p}[${o}]`), d.error(), u.assign(N, !1).break();
          }).code((0, n._)`${p}[${o}] = ${P}`);
        });
      }
      function _(P, i) {
        const o = (0, w.useFunc)(u, m.default), l = u.name("outer");
        u.label(l).for((0, n._)`;${P}--;`, () => u.for((0, n._)`${i} = ${P}; ${i}--;`, () => u.if((0, n._)`${o}(${f}[${P}], ${f}[${i}])`, () => {
          d.error(), u.assign(N, !1).break(l);
        })));
      }
    }
  };
  return at.default = s, at;
}
var ot = {}, xr;
function ga() {
  if (xr) return ot;
  xr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Zt(), S = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: s }) => (0, e._)`{allowedValue: ${s}}`
    },
    code(s) {
      const { gen: d, data: u, $data: f, schemaCode: $, schema: v } = s;
      f || v && typeof v == "object" ? s.fail$data((0, e._)`!${(0, n.useFunc)(d, w.default)}(${u}, ${$})`) : s.fail((0, e._)`${v} !== ${u}`);
    }
  };
  return ot.default = S, ot;
}
var it = {}, Hr;
function $a() {
  if (Hr) return it;
  Hr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Zt(), S = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: s }) => (0, e._)`{allowedValues: ${s}}`
    },
    code(s) {
      const { gen: d, data: u, $data: f, schema: $, schemaCode: v, it: O } = s;
      if (!f && $.length === 0)
        throw new Error("enum must have non-empty array");
      const I = $.length >= O.opts.loopEnum;
      let R;
      const N = () => R ?? (R = (0, n.useFunc)(d, w.default));
      let k;
      if (I || f)
        k = d.let("valid"), s.block$data(k, y);
      else {
        if (!Array.isArray($))
          throw new Error("ajv implementation error");
        const a = d.const("vSchema", v);
        k = (0, e.or)(...$.map((_, P) => g(a, P)));
      }
      s.pass(k);
      function y() {
        d.assign(k, !1), d.forOf("v", v, (a) => d.if((0, e._)`${N()}(${u}, ${a})`, () => d.assign(k, !0).break()));
      }
      function g(a, _) {
        const P = $[_];
        return typeof P == "object" && P !== null ? (0, e._)`${N()}(${u}, ${a}[${_}])` : (0, e._)`${u} === ${P}`;
      }
    }
  };
  return it.default = S, it;
}
var Gr;
function wa() {
  if (Gr) return We;
  Gr = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ la(), n = /* @__PURE__ */ da(), w = /* @__PURE__ */ ma(), m = /* @__PURE__ */ ha(), S = /* @__PURE__ */ pa(), s = /* @__PURE__ */ ya(), d = /* @__PURE__ */ va(), u = /* @__PURE__ */ _a(), f = /* @__PURE__ */ ga(), $ = /* @__PURE__ */ $a(), v = [
    // number
    e.default,
    n.default,
    // string
    w.default,
    m.default,
    // object
    S.default,
    s.default,
    // array
    d.default,
    u.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    f.default,
    $.default
  ];
  return We.default = v, We;
}
var ut = {}, Te = {}, Jr;
function On() {
  if (Jr) return Te;
  Jr = 1, Object.defineProperty(Te, "__esModule", { value: !0 }), Te.validateAdditionalItems = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), m = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: s } }) => (0, e.str)`must NOT have more than ${s} items`,
      params: ({ params: { len: s } }) => (0, e._)`{limit: ${s}}`
    },
    code(s) {
      const { parentSchema: d, it: u } = s, { items: f } = d;
      if (!Array.isArray(f)) {
        (0, n.checkStrictMode)(u, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      S(s, f);
    }
  };
  function S(s, d) {
    const { gen: u, schema: f, data: $, keyword: v, it: O } = s;
    O.items = !0;
    const I = u.const("len", (0, e._)`${$}.length`);
    if (f === !1)
      s.setParams({ len: d.length }), s.pass((0, e._)`${I} <= ${d.length}`);
    else if (typeof f == "object" && !(0, n.alwaysValidSchema)(O, f)) {
      const N = u.var("valid", (0, e._)`${I} <= ${d.length}`);
      u.if((0, e.not)(N), () => R(N)), s.ok(N);
    }
    function R(N) {
      u.forRange("i", d.length, I, (k) => {
        s.subschema({ keyword: v, dataProp: k, dataPropType: n.Type.Num }, N), O.allErrors || u.if((0, e.not)(N), () => u.break());
      });
    }
  }
  return Te.validateAdditionalItems = S, Te.default = m, Te;
}
var ct = {}, Ce = {}, Br;
function Rn() {
  if (Br) return Ce;
  Br = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.validateTuple = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ we(), m = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(s) {
      const { schema: d, it: u } = s;
      if (Array.isArray(d))
        return S(s, "additionalItems", d);
      u.items = !0, !(0, n.alwaysValidSchema)(u, d) && s.ok((0, w.validateArray)(s));
    }
  };
  function S(s, d, u = s.schema) {
    const { gen: f, parentSchema: $, data: v, keyword: O, it: I } = s;
    k($), I.opts.unevaluated && u.length && I.items !== !0 && (I.items = n.mergeEvaluated.items(f, u.length, I.items));
    const R = f.name("valid"), N = f.const("len", (0, e._)`${v}.length`);
    u.forEach((y, g) => {
      (0, n.alwaysValidSchema)(I, y) || (f.if((0, e._)`${N} > ${g}`, () => s.subschema({
        keyword: O,
        schemaProp: g,
        dataProp: g
      }, R)), s.ok(R));
    });
    function k(y) {
      const { opts: g, errSchemaPath: a } = I, _ = u.length, P = _ === y.minItems && (_ === y.maxItems || y[d] === !1);
      if (g.strictTuples && !P) {
        const i = `"${O}" is ${_}-tuple, but minItems or maxItems/${d} are not specified or different at path "${a}"`;
        (0, n.checkStrictMode)(I, i, g.strictTuples);
      }
    }
  }
  return Ce.validateTuple = S, Ce.default = m, Ce;
}
var Wr;
function ba() {
  if (Wr) return ct;
  Wr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Rn(), n = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (w) => (0, e.validateTuple)(w, "items")
  };
  return ct.default = n, ct;
}
var lt = {}, Zr;
function Ea() {
  if (Zr) return lt;
  Zr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ we(), m = /* @__PURE__ */ On(), s = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: d } }) => (0, e.str)`must NOT have more than ${d} items`,
      params: ({ params: { len: d } }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { schema: u, parentSchema: f, it: $ } = d, { prefixItems: v } = f;
      $.items = !0, !(0, n.alwaysValidSchema)($, u) && (v ? (0, m.validateAdditionalItems)(d, v) : d.ok((0, w.validateArray)(d)));
    }
  };
  return lt.default = s, lt;
}
var dt = {}, Qr;
function Sa() {
  if (Qr) return dt;
  Qr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), m = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: S, max: s } }) => s === void 0 ? (0, e.str)`must contain at least ${S} valid item(s)` : (0, e.str)`must contain at least ${S} and no more than ${s} valid item(s)`,
      params: ({ params: { min: S, max: s } }) => s === void 0 ? (0, e._)`{minContains: ${S}}` : (0, e._)`{minContains: ${S}, maxContains: ${s}}`
    },
    code(S) {
      const { gen: s, schema: d, parentSchema: u, data: f, it: $ } = S;
      let v, O;
      const { minContains: I, maxContains: R } = u;
      $.opts.next ? (v = I === void 0 ? 1 : I, O = R) : v = 1;
      const N = s.const("len", (0, e._)`${f}.length`);
      if (S.setParams({ min: v, max: O }), O === void 0 && v === 0) {
        (0, n.checkStrictMode)($, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (O !== void 0 && v > O) {
        (0, n.checkStrictMode)($, '"minContains" > "maxContains" is always invalid'), S.fail();
        return;
      }
      if ((0, n.alwaysValidSchema)($, d)) {
        let _ = (0, e._)`${N} >= ${v}`;
        O !== void 0 && (_ = (0, e._)`${_} && ${N} <= ${O}`), S.pass(_);
        return;
      }
      $.items = !0;
      const k = s.name("valid");
      O === void 0 && v === 1 ? g(k, () => s.if(k, () => s.break())) : v === 0 ? (s.let(k, !0), O !== void 0 && s.if((0, e._)`${f}.length > 0`, y)) : (s.let(k, !1), y()), S.result(k, () => S.reset());
      function y() {
        const _ = s.name("_valid"), P = s.let("count", 0);
        g(_, () => s.if(_, () => a(P)));
      }
      function g(_, P) {
        s.forRange("i", 0, N, (i) => {
          S.subschema({
            keyword: "contains",
            dataProp: i,
            dataPropType: n.Type.Num,
            compositeRule: !0
          }, _), P();
        });
      }
      function a(_) {
        s.code((0, e._)`${_}++`), O === void 0 ? s.if((0, e._)`${_} >= ${v}`, () => s.assign(k, !0).break()) : (s.if((0, e._)`${_} > ${O}`, () => s.assign(k, !1).break()), v === 1 ? s.assign(k, !0) : s.if((0, e._)`${_} >= ${v}`, () => s.assign(k, !0)));
      }
    }
  };
  return dt.default = m, dt;
}
var xt = {}, Yr;
function Pa() {
  return Yr || (Yr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), m = /* @__PURE__ */ we();
    e.error = {
      message: ({ params: { property: f, depsCount: $, deps: v } }) => {
        const O = $ === 1 ? "property" : "properties";
        return (0, n.str)`must have ${O} ${v} when property ${f} is present`;
      },
      params: ({ params: { property: f, depsCount: $, deps: v, missingProperty: O } }) => (0, n._)`{property: ${f},
    missingProperty: ${O},
    depsCount: ${$},
    deps: ${v}}`
      // TODO change to reference
    };
    const S = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(f) {
        const [$, v] = s(f);
        d(f, $), u(f, v);
      }
    };
    function s({ schema: f }) {
      const $ = {}, v = {};
      for (const O in f) {
        if (O === "__proto__")
          continue;
        const I = Array.isArray(f[O]) ? $ : v;
        I[O] = f[O];
      }
      return [$, v];
    }
    function d(f, $ = f.schema) {
      const { gen: v, data: O, it: I } = f;
      if (Object.keys($).length === 0)
        return;
      const R = v.let("missing");
      for (const N in $) {
        const k = $[N];
        if (k.length === 0)
          continue;
        const y = (0, m.propertyInData)(v, O, N, I.opts.ownProperties);
        f.setParams({
          property: N,
          depsCount: k.length,
          deps: k.join(", ")
        }), I.allErrors ? v.if(y, () => {
          for (const g of k)
            (0, m.checkReportMissingProp)(f, g);
        }) : (v.if((0, n._)`${y} && (${(0, m.checkMissingProp)(f, k, R)})`), (0, m.reportMissingProp)(f, R), v.else());
      }
    }
    e.validatePropertyDeps = d;
    function u(f, $ = f.schema) {
      const { gen: v, data: O, keyword: I, it: R } = f, N = v.name("valid");
      for (const k in $)
        (0, w.alwaysValidSchema)(R, $[k]) || (v.if(
          (0, m.propertyInData)(v, O, k, R.opts.ownProperties),
          () => {
            const y = f.subschema({ keyword: I, schemaProp: k }, N);
            f.mergeValidEvaluated(y, N);
          },
          () => v.var(N, !0)
          // TODO var
        ), f.ok(N));
    }
    e.validateSchemaDeps = u, e.default = S;
  })(xt)), xt;
}
var ft = {}, Xr;
function ka() {
  if (Xr) return ft;
  Xr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), m = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: S }) => (0, e._)`{propertyName: ${S.propertyName}}`
    },
    code(S) {
      const { gen: s, schema: d, data: u, it: f } = S;
      if ((0, n.alwaysValidSchema)(f, d))
        return;
      const $ = s.name("valid");
      s.forIn("key", u, (v) => {
        S.setParams({ propertyName: v }), S.subschema({
          keyword: "propertyNames",
          data: v,
          dataTypes: ["string"],
          propertyName: v,
          compositeRule: !0
        }, $), s.if((0, e.not)($), () => {
          S.error(!0), f.allErrors || s.break();
        });
      }), S.ok($);
    }
  };
  return ft.default = m, ft;
}
var mt = {}, en;
function Nn() {
  if (en) return mt;
  en = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ we(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Oe(), m = /* @__PURE__ */ Q(), s = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: d }) => (0, n._)`{additionalProperty: ${d.additionalProperty}}`
    },
    code(d) {
      const { gen: u, schema: f, parentSchema: $, data: v, errsCount: O, it: I } = d;
      if (!O)
        throw new Error("ajv implementation error");
      const { allErrors: R, opts: N } = I;
      if (I.props = !0, N.removeAdditional !== "all" && (0, m.alwaysValidSchema)(I, f))
        return;
      const k = (0, e.allSchemaProperties)($.properties), y = (0, e.allSchemaProperties)($.patternProperties);
      g(), d.ok((0, n._)`${O} === ${w.default.errors}`);
      function g() {
        u.forIn("key", v, (o) => {
          !k.length && !y.length ? P(o) : u.if(a(o), () => P(o));
        });
      }
      function a(o) {
        let l;
        if (k.length > 8) {
          const p = (0, m.schemaRefOrVal)(I, $.properties, "properties");
          l = (0, e.isOwnProperty)(u, p, o);
        } else k.length ? l = (0, n.or)(...k.map((p) => (0, n._)`${o} === ${p}`)) : l = n.nil;
        return y.length && (l = (0, n.or)(l, ...y.map((p) => (0, n._)`${(0, e.usePattern)(d, p)}.test(${o})`))), (0, n.not)(l);
      }
      function _(o) {
        u.code((0, n._)`delete ${v}[${o}]`);
      }
      function P(o) {
        if (N.removeAdditional === "all" || N.removeAdditional && f === !1) {
          _(o);
          return;
        }
        if (f === !1) {
          d.setParams({ additionalProperty: o }), d.error(), R || u.break();
          return;
        }
        if (typeof f == "object" && !(0, m.alwaysValidSchema)(I, f)) {
          const l = u.name("valid");
          N.removeAdditional === "failing" ? (i(o, l, !1), u.if((0, n.not)(l), () => {
            d.reset(), _(o);
          })) : (i(o, l), R || u.if((0, n.not)(l), () => u.break()));
        }
      }
      function i(o, l, p) {
        const A = {
          keyword: "additionalProperties",
          dataProp: o,
          dataPropType: m.Type.Str
        };
        p === !1 && Object.assign(A, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), d.subschema(A, l);
      }
    }
  };
  return mt.default = s, mt;
}
var ht = {}, tn;
function Oa() {
  if (tn) return ht;
  tn = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ jt(), n = /* @__PURE__ */ we(), w = /* @__PURE__ */ Q(), m = /* @__PURE__ */ Nn(), S = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(s) {
      const { gen: d, schema: u, parentSchema: f, data: $, it: v } = s;
      v.opts.removeAdditional === "all" && f.additionalProperties === void 0 && m.default.code(new e.KeywordCxt(v, m.default, "additionalProperties"));
      const O = (0, n.allSchemaProperties)(u);
      for (const y of O)
        v.definedProperties.add(y);
      v.opts.unevaluated && O.length && v.props !== !0 && (v.props = w.mergeEvaluated.props(d, (0, w.toHash)(O), v.props));
      const I = O.filter((y) => !(0, w.alwaysValidSchema)(v, u[y]));
      if (I.length === 0)
        return;
      const R = d.name("valid");
      for (const y of I)
        N(y) ? k(y) : (d.if((0, n.propertyInData)(d, $, y, v.opts.ownProperties)), k(y), v.allErrors || d.else().var(R, !0), d.endIf()), s.it.definedProperties.add(y), s.ok(R);
      function N(y) {
        return v.opts.useDefaults && !v.compositeRule && u[y].default !== void 0;
      }
      function k(y) {
        s.subschema({
          keyword: "properties",
          schemaProp: y,
          dataProp: y
        }, R);
      }
    }
  };
  return ht.default = S, ht;
}
var pt = {}, rn;
function Ra() {
  if (rn) return pt;
  rn = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ we(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), m = /* @__PURE__ */ Q(), S = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(s) {
      const { gen: d, schema: u, data: f, parentSchema: $, it: v } = s, { opts: O } = v, I = (0, e.allSchemaProperties)(u), R = I.filter((P) => (0, w.alwaysValidSchema)(v, u[P]));
      if (I.length === 0 || R.length === I.length && (!v.opts.unevaluated || v.props === !0))
        return;
      const N = O.strictSchema && !O.allowMatchingProperties && $.properties, k = d.name("valid");
      v.props !== !0 && !(v.props instanceof n.Name) && (v.props = (0, m.evaluatedPropsToName)(d, v.props));
      const { props: y } = v;
      g();
      function g() {
        for (const P of I)
          N && a(P), v.allErrors ? _(P) : (d.var(k, !0), _(P), d.if(k));
      }
      function a(P) {
        for (const i in N)
          new RegExp(P).test(i) && (0, w.checkStrictMode)(v, `property ${i} matches pattern ${P} (use allowMatchingProperties)`);
      }
      function _(P) {
        d.forIn("key", f, (i) => {
          d.if((0, n._)`${(0, e.usePattern)(s, P)}.test(${i})`, () => {
            const o = R.includes(P);
            o || s.subschema({
              keyword: "patternProperties",
              schemaProp: P,
              dataProp: i,
              dataPropType: m.Type.Str
            }, k), v.opts.unevaluated && y !== !0 ? d.assign((0, n._)`${y}[${i}]`, !0) : !o && !v.allErrors && d.if((0, n.not)(k), () => d.break());
          });
        });
      }
    }
  };
  return pt.default = S, pt;
}
var yt = {}, nn;
function Na() {
  if (nn) return yt;
  nn = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(w) {
      const { gen: m, schema: S, it: s } = w;
      if ((0, e.alwaysValidSchema)(s, S)) {
        w.fail();
        return;
      }
      const d = m.name("valid");
      w.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, d), w.failResult(d, () => w.reset(), () => w.error());
    },
    error: { message: "must NOT be valid" }
  };
  return yt.default = n, yt;
}
var vt = {}, an;
function Ia() {
  if (an) return vt;
  an = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const n = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: (/* @__PURE__ */ we()).validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return vt.default = n, vt;
}
var _t = {}, sn;
function ja() {
  if (sn) return _t;
  sn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), m = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: S }) => (0, e._)`{passingSchemas: ${S.passing}}`
    },
    code(S) {
      const { gen: s, schema: d, parentSchema: u, it: f } = S;
      if (!Array.isArray(d))
        throw new Error("ajv implementation error");
      if (f.opts.discriminator && u.discriminator)
        return;
      const $ = d, v = s.let("valid", !1), O = s.let("passing", null), I = s.name("_valid");
      S.setParams({ passing: O }), s.block(R), S.result(v, () => S.reset(), () => S.error(!0));
      function R() {
        $.forEach((N, k) => {
          let y;
          (0, n.alwaysValidSchema)(f, N) ? s.var(I, !0) : y = S.subschema({
            keyword: "oneOf",
            schemaProp: k,
            compositeRule: !0
          }, I), k > 0 && s.if((0, e._)`${I} && ${v}`).assign(v, !1).assign(O, (0, e._)`[${O}, ${k}]`).else(), s.if(I, () => {
            s.assign(v, !0), s.assign(O, k), y && S.mergeEvaluated(y, e.Name);
          });
        });
      }
    }
  };
  return _t.default = m, _t;
}
var gt = {}, on;
function Ta() {
  if (on) return gt;
  on = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: "allOf",
    schemaType: "array",
    code(w) {
      const { gen: m, schema: S, it: s } = w;
      if (!Array.isArray(S))
        throw new Error("ajv implementation error");
      const d = m.name("valid");
      S.forEach((u, f) => {
        if ((0, e.alwaysValidSchema)(s, u))
          return;
        const $ = w.subschema({ keyword: "allOf", schemaProp: f }, d);
        w.ok(d), w.mergeEvaluated($);
      });
    }
  };
  return gt.default = n, gt;
}
var $t = {}, un;
function Ca() {
  if (un) return $t;
  un = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), m = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: s }) => (0, e.str)`must match "${s.ifClause}" schema`,
      params: ({ params: s }) => (0, e._)`{failingKeyword: ${s.ifClause}}`
    },
    code(s) {
      const { gen: d, parentSchema: u, it: f } = s;
      u.then === void 0 && u.else === void 0 && (0, n.checkStrictMode)(f, '"if" without "then" and "else" is ignored');
      const $ = S(f, "then"), v = S(f, "else");
      if (!$ && !v)
        return;
      const O = d.let("valid", !0), I = d.name("_valid");
      if (R(), s.reset(), $ && v) {
        const k = d.let("ifClause");
        s.setParams({ ifClause: k }), d.if(I, N("then", k), N("else", k));
      } else $ ? d.if(I, N("then")) : d.if((0, e.not)(I), N("else"));
      s.pass(O, () => s.error(!0));
      function R() {
        const k = s.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, I);
        s.mergeEvaluated(k);
      }
      function N(k, y) {
        return () => {
          const g = s.subschema({ keyword: k }, I);
          d.assign(O, I), s.mergeValidEvaluated(g, O), y ? d.assign(y, (0, e._)`${k}`) : s.setParams({ ifClause: k });
        };
      }
    }
  };
  function S(s, d) {
    const u = s.schema[d];
    return u !== void 0 && !(0, n.alwaysValidSchema)(s, u);
  }
  return $t.default = m, $t;
}
var wt = {}, cn;
function qa() {
  if (cn) return wt;
  cn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: w, parentSchema: m, it: S }) {
      m.if === void 0 && (0, e.checkStrictMode)(S, `"${w}" without "if" is ignored`);
    }
  };
  return wt.default = n, wt;
}
var ln;
function Aa() {
  if (ln) return ut;
  ln = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ On(), n = /* @__PURE__ */ ba(), w = /* @__PURE__ */ Rn(), m = /* @__PURE__ */ Ea(), S = /* @__PURE__ */ Sa(), s = /* @__PURE__ */ Pa(), d = /* @__PURE__ */ ka(), u = /* @__PURE__ */ Nn(), f = /* @__PURE__ */ Oa(), $ = /* @__PURE__ */ Ra(), v = /* @__PURE__ */ Na(), O = /* @__PURE__ */ Ia(), I = /* @__PURE__ */ ja(), R = /* @__PURE__ */ Ta(), N = /* @__PURE__ */ Ca(), k = /* @__PURE__ */ qa();
  function y(g = !1) {
    const a = [
      // any
      v.default,
      O.default,
      I.default,
      R.default,
      N.default,
      k.default,
      // object
      d.default,
      u.default,
      s.default,
      f.default,
      $.default
    ];
    return g ? a.push(n.default, m.default) : a.push(e.default, w.default), a.push(S.default), a;
  }
  return ut.default = y, ut;
}
var bt = {}, Et = {}, dn;
function Da() {
  if (dn) return Et;
  dn = 1, Object.defineProperty(Et, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: m }) => (0, e.str)`must match format "${m}"`,
      params: ({ schemaCode: m }) => (0, e._)`{format: ${m}}`
    },
    code(m, S) {
      const { gen: s, data: d, $data: u, schema: f, schemaCode: $, it: v } = m, { opts: O, errSchemaPath: I, schemaEnv: R, self: N } = v;
      if (!O.validateFormats)
        return;
      u ? k() : y();
      function k() {
        const g = s.scopeValue("formats", {
          ref: N.formats,
          code: O.code.formats
        }), a = s.const("fDef", (0, e._)`${g}[${$}]`), _ = s.let("fType"), P = s.let("format");
        s.if((0, e._)`typeof ${a} == "object" && !(${a} instanceof RegExp)`, () => s.assign(_, (0, e._)`${a}.type || "string"`).assign(P, (0, e._)`${a}.validate`), () => s.assign(_, (0, e._)`"string"`).assign(P, a)), m.fail$data((0, e.or)(i(), o()));
        function i() {
          return O.strictSchema === !1 ? e.nil : (0, e._)`${$} && !${P}`;
        }
        function o() {
          const l = R.$async ? (0, e._)`(${a}.async ? await ${P}(${d}) : ${P}(${d}))` : (0, e._)`${P}(${d})`, p = (0, e._)`(typeof ${P} == "function" ? ${l} : ${P}.test(${d}))`;
          return (0, e._)`${P} && ${P} !== true && ${_} === ${S} && !${p}`;
        }
      }
      function y() {
        const g = N.formats[f];
        if (!g) {
          i();
          return;
        }
        if (g === !0)
          return;
        const [a, _, P] = o(g);
        a === S && m.pass(l());
        function i() {
          if (O.strictSchema === !1) {
            N.logger.warn(p());
            return;
          }
          throw new Error(p());
          function p() {
            return `unknown format "${f}" ignored in schema at path "${I}"`;
          }
        }
        function o(p) {
          const A = p instanceof RegExp ? (0, e.regexpCode)(p) : O.code.formats ? (0, e._)`${O.code.formats}${(0, e.getProperty)(f)}` : void 0, F = s.scopeValue("formats", { key: f, ref: p, code: A });
          return typeof p == "object" && !(p instanceof RegExp) ? [p.type || "string", p.validate, (0, e._)`${F}.validate`] : ["string", p, F];
        }
        function l() {
          if (typeof g == "object" && !(g instanceof RegExp) && g.async) {
            if (!R.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${P}(${d})`;
          }
          return typeof _ == "function" ? (0, e._)`${P}(${d})` : (0, e._)`${P}.test(${d})`;
        }
      }
    }
  };
  return Et.default = w, Et;
}
var fn;
function Ma() {
  if (fn) return bt;
  fn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const n = [(/* @__PURE__ */ Da()).default];
  return bt.default = n, bt;
}
var Ie = {}, mn;
function Fa() {
  return mn || (mn = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.contentVocabulary = Ie.metadataVocabulary = void 0, Ie.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ie.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ie;
}
var hn;
function za() {
  if (hn) return Ge;
  hn = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ca(), n = /* @__PURE__ */ wa(), w = /* @__PURE__ */ Aa(), m = /* @__PURE__ */ Ma(), S = /* @__PURE__ */ Fa(), s = [
    e.default,
    n.default,
    (0, w.default)(),
    m.default,
    S.metadataVocabulary,
    S.contentVocabulary
  ];
  return Ge.default = s, Ge;
}
var St = {}, Fe = {}, pn;
function Va() {
  if (pn) return Fe;
  pn = 1, Object.defineProperty(Fe, "__esModule", { value: !0 }), Fe.DiscrError = void 0;
  var e;
  return (function(n) {
    n.Tag = "tag", n.Mapping = "mapping";
  })(e || (Fe.DiscrError = e = {})), Fe;
}
var yn;
function Ua() {
  if (yn) return St;
  yn = 1, Object.defineProperty(St, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Va(), w = /* @__PURE__ */ Wt(), m = /* @__PURE__ */ Tt(), S = /* @__PURE__ */ Q(), d = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: u, tagName: f } }) => u === n.DiscrError.Tag ? `tag "${f}" must be string` : `value of tag "${f}" must be in oneOf`,
      params: ({ params: { discrError: u, tag: f, tagName: $ } }) => (0, e._)`{error: ${u}, tag: ${$}, tagValue: ${f}}`
    },
    code(u) {
      const { gen: f, data: $, schema: v, parentSchema: O, it: I } = u, { oneOf: R } = O;
      if (!I.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const N = v.propertyName;
      if (typeof N != "string")
        throw new Error("discriminator: requires propertyName");
      if (v.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!R)
        throw new Error("discriminator: requires oneOf keyword");
      const k = f.let("valid", !1), y = f.const("tag", (0, e._)`${$}${(0, e.getProperty)(N)}`);
      f.if((0, e._)`typeof ${y} == "string"`, () => g(), () => u.error(!1, { discrError: n.DiscrError.Tag, tag: y, tagName: N })), u.ok(k);
      function g() {
        const P = _();
        f.if(!1);
        for (const i in P)
          f.elseIf((0, e._)`${y} === ${i}`), f.assign(k, a(P[i]));
        f.else(), u.error(!1, { discrError: n.DiscrError.Mapping, tag: y, tagName: N }), f.endIf();
      }
      function a(P) {
        const i = f.name("valid"), o = u.subschema({ keyword: "oneOf", schemaProp: P }, i);
        return u.mergeEvaluated(o, e.Name), i;
      }
      function _() {
        var P;
        const i = {}, o = p(O);
        let l = !0;
        for (let D = 0; D < R.length; D++) {
          let K = R[D];
          if (K?.$ref && !(0, S.schemaHasRulesButRef)(K, I.self.RULES)) {
            const H = K.$ref;
            if (K = w.resolveRef.call(I.self, I.schemaEnv.root, I.baseId, H), K instanceof w.SchemaEnv && (K = K.schema), K === void 0)
              throw new m.default(I.opts.uriResolver, I.baseId, H);
          }
          const L = (P = K?.properties) === null || P === void 0 ? void 0 : P[N];
          if (typeof L != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${N}"`);
          l = l && (o || p(K)), A(L, D);
        }
        if (!l)
          throw new Error(`discriminator: "${N}" must be required`);
        return i;
        function p({ required: D }) {
          return Array.isArray(D) && D.includes(N);
        }
        function A(D, K) {
          if (D.const)
            F(D.const, K);
          else if (D.enum)
            for (const L of D.enum)
              F(L, K);
          else
            throw new Error(`discriminator: "properties/${N}" must have "const" or "enum"`);
        }
        function F(D, K) {
          if (typeof D != "string" || D in i)
            throw new Error(`discriminator: "${N}" values must be unique strings`);
          i[D] = K;
        }
      }
    }
  };
  return St.default = d, St;
}
const La = "http://json-schema.org/draft-07/schema#", Ka = "http://json-schema.org/draft-07/schema#", xa = "Core schema meta-schema", Ha = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Ga = ["object", "boolean"], Ja = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Ba = {
  $schema: La,
  $id: Ka,
  title: xa,
  definitions: Ha,
  type: Ga,
  properties: Ja,
  default: !0
};
var vn;
function In() {
  return vn || (vn = 1, (function(e, n) {
    Object.defineProperty(n, "__esModule", { value: !0 }), n.MissingRefError = n.ValidationError = n.CodeGen = n.Name = n.nil = n.stringify = n.str = n._ = n.KeywordCxt = n.Ajv = void 0;
    const w = /* @__PURE__ */ oa(), m = /* @__PURE__ */ za(), S = /* @__PURE__ */ Ua(), s = Ba, d = ["/properties"], u = "http://json-schema.org/draft-07/schema";
    class f extends w.default {
      _addVocabularies() {
        super._addVocabularies(), m.default.forEach((N) => this.addVocabulary(N)), this.opts.discriminator && this.addKeyword(S.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const N = this.opts.$data ? this.$dataMetaSchema(s, d) : s;
        this.addMetaSchema(N, u, !1), this.refs["http://json-schema.org/schema"] = u;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(u) ? u : void 0);
      }
    }
    n.Ajv = f, e.exports = n = f, e.exports.Ajv = f, Object.defineProperty(n, "__esModule", { value: !0 }), n.default = f;
    var $ = /* @__PURE__ */ jt();
    Object.defineProperty(n, "KeywordCxt", { enumerable: !0, get: function() {
      return $.KeywordCxt;
    } });
    var v = /* @__PURE__ */ W();
    Object.defineProperty(n, "_", { enumerable: !0, get: function() {
      return v._;
    } }), Object.defineProperty(n, "str", { enumerable: !0, get: function() {
      return v.str;
    } }), Object.defineProperty(n, "stringify", { enumerable: !0, get: function() {
      return v.stringify;
    } }), Object.defineProperty(n, "nil", { enumerable: !0, get: function() {
      return v.nil;
    } }), Object.defineProperty(n, "Name", { enumerable: !0, get: function() {
      return v.Name;
    } }), Object.defineProperty(n, "CodeGen", { enumerable: !0, get: function() {
      return v.CodeGen;
    } });
    var O = /* @__PURE__ */ Bt();
    Object.defineProperty(n, "ValidationError", { enumerable: !0, get: function() {
      return O.default;
    } });
    var I = /* @__PURE__ */ Tt();
    Object.defineProperty(n, "MissingRefError", { enumerable: !0, get: function() {
      return I.default;
    } });
  })(Ue, Ue.exports)), Ue.exports;
}
var Wa = /* @__PURE__ */ In();
const Za = /* @__PURE__ */ bn(Wa);
var Pt = { exports: {} }, Ht = {}, _n;
function Qa() {
  return _n || (_n = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function n(D, K) {
      return { validate: D, compare: K };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: n(s, d),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: n(f(!0), $),
      "date-time": n(I(!0), R),
      "iso-time": n(f(), v),
      "iso-date-time": n(I(), N),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: g,
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
      regex: F,
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
      byte: _,
      // signed 32 bit integer
      int32: { type: "number", validate: o },
      // signed 64 bit integer
      int64: { type: "number", validate: l },
      // C-type float
      float: { type: "number", validate: p },
      // C-type double
      double: { type: "number", validate: p },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: n(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, d),
      time: n(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
      "date-time": n(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, R),
      "iso-time": n(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
      "iso-date-time": n(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, N),
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
    const m = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, S = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function s(D) {
      const K = m.exec(D);
      if (!K)
        return !1;
      const L = +K[1], H = +K[2], Z = +K[3];
      return H >= 1 && H <= 12 && Z >= 1 && Z <= (H === 2 && w(L) ? 29 : S[H]);
    }
    function d(D, K) {
      if (D && K)
        return D > K ? 1 : D < K ? -1 : 0;
    }
    const u = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function f(D) {
      return function(L) {
        const H = u.exec(L);
        if (!H)
          return !1;
        const Z = +H[1], ce = +H[2], ue = +H[3], Y = H[4], le = H[5] === "-" ? -1 : 1, V = +(H[6] || 0), c = +(H[7] || 0);
        if (V > 23 || c > 59 || D && !Y)
          return !1;
        if (Z <= 23 && ce <= 59 && ue < 60)
          return !0;
        const E = ce - c * le, h = Z - V * le - (E < 0 ? 1 : 0);
        return (h === 23 || h === -1) && (E === 59 || E === -1) && ue < 61;
      };
    }
    function $(D, K) {
      if (!(D && K))
        return;
      const L = (/* @__PURE__ */ new Date("2020-01-01T" + D)).valueOf(), H = (/* @__PURE__ */ new Date("2020-01-01T" + K)).valueOf();
      if (L && H)
        return L - H;
    }
    function v(D, K) {
      if (!(D && K))
        return;
      const L = u.exec(D), H = u.exec(K);
      if (L && H)
        return D = L[1] + L[2] + L[3], K = H[1] + H[2] + H[3], D > K ? 1 : D < K ? -1 : 0;
    }
    const O = /t|\s/i;
    function I(D) {
      const K = f(D);
      return function(H) {
        const Z = H.split(O);
        return Z.length === 2 && s(Z[0]) && K(Z[1]);
      };
    }
    function R(D, K) {
      if (!(D && K))
        return;
      const L = new Date(D).valueOf(), H = new Date(K).valueOf();
      if (L && H)
        return L - H;
    }
    function N(D, K) {
      if (!(D && K))
        return;
      const [L, H] = D.split(O), [Z, ce] = K.split(O), ue = d(L, Z);
      if (ue !== void 0)
        return ue || $(H, ce);
    }
    const k = /\/|:/, y = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function g(D) {
      return k.test(D) && y.test(D);
    }
    const a = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function _(D) {
      return a.lastIndex = 0, a.test(D);
    }
    const P = -2147483648, i = 2 ** 31 - 1;
    function o(D) {
      return Number.isInteger(D) && D <= i && D >= P;
    }
    function l(D) {
      return Number.isInteger(D);
    }
    function p() {
      return !0;
    }
    const A = /[^\\]\\Z/;
    function F(D) {
      if (A.test(D))
        return !1;
      try {
        return new RegExp(D), !0;
      } catch {
        return !1;
      }
    }
  })(Ht)), Ht;
}
var Gt = {}, gn;
function Ya() {
  return gn || (gn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const n = /* @__PURE__ */ In(), w = /* @__PURE__ */ W(), m = w.operators, S = {
      formatMaximum: { okStr: "<=", ok: m.LTE, fail: m.GT },
      formatMinimum: { okStr: ">=", ok: m.GTE, fail: m.LT },
      formatExclusiveMaximum: { okStr: "<", ok: m.LT, fail: m.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: m.GT, fail: m.LTE }
    }, s = {
      message: ({ keyword: u, schemaCode: f }) => (0, w.str)`should be ${S[u].okStr} ${f}`,
      params: ({ keyword: u, schemaCode: f }) => (0, w._)`{comparison: ${S[u].okStr}, limit: ${f}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(S),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: s,
      code(u) {
        const { gen: f, data: $, schemaCode: v, keyword: O, it: I } = u, { opts: R, self: N } = I;
        if (!R.validateFormats)
          return;
        const k = new n.KeywordCxt(I, N.RULES.all.format.definition, "format");
        k.$data ? y() : g();
        function y() {
          const _ = f.scopeValue("formats", {
            ref: N.formats,
            code: R.code.formats
          }), P = f.const("fmt", (0, w._)`${_}[${k.schemaCode}]`);
          u.fail$data((0, w.or)((0, w._)`typeof ${P} != "object"`, (0, w._)`${P} instanceof RegExp`, (0, w._)`typeof ${P}.compare != "function"`, a(P)));
        }
        function g() {
          const _ = k.schema, P = N.formats[_];
          if (!P || P === !0)
            return;
          if (typeof P != "object" || P instanceof RegExp || typeof P.compare != "function")
            throw new Error(`"${O}": format "${_}" does not define "compare" function`);
          const i = f.scopeValue("formats", {
            key: _,
            ref: P,
            code: R.code.formats ? (0, w._)`${R.code.formats}${(0, w.getProperty)(_)}` : void 0
          });
          u.fail$data(a(i));
        }
        function a(_) {
          return (0, w._)`${_}.compare(${$}, ${v}) ${S[O].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const d = (u) => (u.addKeyword(e.formatLimitDefinition), u);
    e.default = d;
  })(Gt)), Gt;
}
var $n;
function Xa() {
  return $n || ($n = 1, (function(e, n) {
    Object.defineProperty(n, "__esModule", { value: !0 });
    const w = Qa(), m = Ya(), S = /* @__PURE__ */ W(), s = new S.Name("fullFormats"), d = new S.Name("fastFormats"), u = ($, v = { keywords: !0 }) => {
      if (Array.isArray(v))
        return f($, v, w.fullFormats, s), $;
      const [O, I] = v.mode === "fast" ? [w.fastFormats, d] : [w.fullFormats, s], R = v.formats || w.formatNames;
      return f($, R, O, I), v.keywords && (0, m.default)($), $;
    };
    u.get = ($, v = "full") => {
      const I = (v === "fast" ? w.fastFormats : w.fullFormats)[$];
      if (!I)
        throw new Error(`Unknown format "${$}"`);
      return I;
    };
    function f($, v, O, I) {
      var R, N;
      (R = (N = $.opts.code).formats) !== null && R !== void 0 || (N.formats = (0, S._)`require("ajv-formats/dist/formats").${I}`);
      for (const k of v)
        $.addFormat(k, O[k]);
    }
    e.exports = n = u, Object.defineProperty(n, "__esModule", { value: !0 }), n.default = u;
  })(Pt, Pt.exports)), Pt.exports;
}
var es = Xa();
const ts = /* @__PURE__ */ bn(es), rs = { class: "ac-options" }, ns = { class: "kx-focus-outline" }, as = {
  key: 0,
  class: "ac-muted"
}, ss = {
  key: 0,
  class: "ac-muted"
}, os = { class: "ac-option-head" }, is = { class: "ac-muted" }, us = ["aria-label", "aria-invalid", "aria-describedby", "value", "onChange"], cs = { value: "" }, ls = ["value"], ds = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], fs = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], ms = ["aria-label", "onClick"], hs = ["id"], ps = {
  key: 0,
  class: "ac-muted"
}, js = /* @__PURE__ */ wn({
  __name: "driver-options",
  props: {
    options: {},
    modelValue: {},
    defaults: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(e, { emit: n }) {
    const w = e, m = n, S = $e(""), s = $e({}), d = $e({}), u = Tn(), f = new Za({ strict: !1, allErrors: !0 });
    ts(f);
    const $ = de(() => new Map(w.options.map((o) => {
      try {
        return [o.name, o.schema ? f.compile(o.schema) : void 0];
      } catch {
        return [o.name, "Invalid option schema"];
      }
    }))), v = de(() => {
      const o = S.value.trim().toLowerCase();
      return xn(w.options).filter((l) => !o || [l.name, l.label, l.description, l.section, l.group].join(" ").toLowerCase().includes(o)).sort((l, p) => +(p.section === "basic") - +(l.section === "basic") || l.section.localeCompare(p.section) || l.group.localeCompare(p.group) || l.order - p.order || l.name.localeCompare(p.name));
    }), O = de(() => Object.keys(w.modelValue).length);
    ze(() => Object.fromEntries(w.options.map((o) => [o.name, JSON.stringify([w.modelValue[o.name], o])])), (o, l) => {
      for (const p of Object.keys(s.value))
        (o[p] !== l?.[p] || !(p in o)) && (delete s.value[p], delete d.value[p]);
      m("invalid", Object.keys(d.value).length);
    }, { immediate: !0 });
    function I(o, l) {
      const p = { ...w.modelValue };
      l === void 0 ? delete p[o] : p[o] = l, m("update:modelValue", p);
    }
    function R(o) {
      delete s.value[o.name], y(o, void 0);
    }
    function N(o) {
      if (o.name in s.value) return s.value[o.name];
      const l = w.modelValue[o.name];
      return l === void 0 ? "" : o.type === "json" ? JSON.stringify(l) : o.type === "ids" && Array.isArray(l) && l.every((p) => typeof p == "string") ? l.join(", ") : String(l);
    }
    function k(o, l) {
      l ? d.value[o] = l : delete d.value[o], m("invalid", Object.keys(d.value).length);
    }
    function y(o, l) {
      const p = $.value.get(o.name);
      if (l !== void 0 && p) {
        if (typeof p == "string") {
          k(o.name, p);
          return;
        }
        if (!p(l)) {
          k(o.name, f.errorsText(p.errors));
          return;
        }
      }
      k(o.name), I(o.name, l);
    }
    function g(o, l) {
      s.value[o.name] = l;
      const p = l.trim();
      if (!p) {
        y(o, o.type === "ids" ? [] : o.type === "text" || o.type === "string" ? "" : void 0);
        return;
      }
      if (o.type === "json") {
        let A;
        try {
          A = JSON.parse(p);
        } catch {
          k(o.name, "Not valid JSON");
          return;
        }
        y(o, A);
      } else if (o.type === "ids") y(o, p.split(",").map((A) => A.trim()).filter(Boolean));
      else if ([o.type, o.schema?.type].some((A) => A === "number" || A === "integer")) {
        const A = Number(p);
        if (!Number.isFinite(A)) {
          k(o.name, "Not a finite number");
          return;
        }
        if ((o.type === "integer" || o.schema?.type === "integer") && !Number.isInteger(A)) {
          k(o.name, "Not an integer");
          return;
        }
        y(o, A);
      } else y(o, p);
    }
    function a(o, l) {
      if (!(l.target instanceof HTMLSelectElement)) return;
      const p = l.target.value;
      if (!p) {
        y(o, void 0);
        return;
      }
      y(o, o.type === "boolean" ? p === "true" : (o.values ?? []).find((A) => String(A) === p) ?? p);
    }
    function _(o, l) {
      (l.target instanceof HTMLInputElement || l.target instanceof HTMLTextAreaElement) && g(o, l.target.value);
    }
    function P(o) {
      const l = w.modelValue[o.name];
      return l === void 0 ? "" : String(l);
    }
    function i(o) {
      const l = w.defaults?.[o.name] ?? o.default;
      return l == null ? "CLI default" : `default: ${JSON.stringify(l)}`;
    }
    return (o, l) => (ne(), ae("details", rs, [
      me("summary", ns, [
        l[1] || (l[1] = kt("Driver options", -1)),
        O.value ? (ne(), ae("span", as, " · " + pe(O.value) + " set", 1)) : Pe("", !0)
      ]),
      Cn(me("input", {
        "onUpdate:modelValue": l[0] || (l[0] = (p) => S.value = p),
        class: "ac-mono ac-options-filter kx-focus-halo",
        placeholder: "Filter options",
        "aria-label": "Filter driver options"
      }, null, 512), [
        [qn, S.value]
      ]),
      (ne(!0), ae(je, null, Jt(v.value, (p, A) => (ne(), ae("div", {
        key: p.name,
        class: "ac-option"
      }, [
        A === 0 || p.section !== v.value[A - 1].section || p.group !== v.value[A - 1].group ? (ne(), ae("div", ss, pe([p.section, p.group].filter(Boolean).join(" · ")), 1)) : Pe("", !0),
        me("div", os, [
          me("span", null, pe(p.label || p.name), 1),
          me("small", is, [
            me("code", null, pe(p.name), 1),
            p.description && p.description !== p.label ? (ne(), ae(je, { key: 0 }, [
              kt(" — " + pe(p.description), 1)
            ], 64)) : Pe("", !0)
          ])
        ]),
        p.type === "boolean" || p.type === "enum" ? (ne(), ae("select", {
          key: 1,
          class: "kx-focus-halo",
          "aria-label": p.label || p.name,
          "aria-invalid": !!d.value[p.name],
          "aria-describedby": d.value[p.name] ? `${Ve(u)}-${p.name}-error` : void 0,
          value: P(p),
          onChange: (F) => a(p, F)
        }, [
          me("option", cs, pe(i(p)), 1),
          p.type === "boolean" ? (ne(), ae(je, { key: 0 }, [
            l[2] || (l[2] = me("option", { value: "true" }, "on", -1)),
            l[3] || (l[3] = me("option", { value: "false" }, "off", -1))
          ], 64)) : (ne(!0), ae(je, { key: 1 }, Jt(p.values ?? [], (F) => (ne(), ae("option", {
            key: String(F),
            value: String(F)
          }, pe(F), 9, ls))), 128))
        ], 40, us)) : p.type === "json" ? (ne(), ae("textarea", {
          key: 2,
          rows: "2",
          class: "ac-mono kx-focus-halo",
          "aria-label": p.label || p.name,
          "aria-invalid": !!d.value[p.name],
          "aria-describedby": d.value[p.name] ? `${Ve(u)}-${p.name}-error` : void 0,
          value: N(p),
          placeholder: `JSON · ${i(p)}`,
          onInput: (F) => _(p, F)
        }, null, 40, ds)) : (ne(), ae("input", {
          key: 3,
          class: "ac-mono kx-focus-halo",
          "aria-label": p.label || p.name,
          "aria-invalid": !!d.value[p.name],
          "aria-describedby": d.value[p.name] ? `${Ve(u)}-${p.name}-error` : void 0,
          value: N(p),
          placeholder: w.modelValue[p.name] !== void 0 && !N(p) ? "Empty override" : p.type === "ids" ? "comma separated" : i(p),
          onInput: (F) => _(p, F)
        }, null, 40, fs)),
        me("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          "aria-label": `Use default for ${p.label || p.name}`,
          onClick: (F) => R(p)
        }, "Use default", 8, ms),
        d.value[p.name] ? (ne(), ae("small", {
          key: 4,
          id: `${Ve(u)}-${p.name}-error`,
          class: "kx-err",
          role: "alert"
        }, pe(d.value[p.name]), 9, hs)) : Pe("", !0)
      ]))), 128)),
      v.value.length ? Pe("", !0) : (ne(), ae("p", ps, "No matching options."))
    ]));
  }
}), ys = {
  class: "ac-trait-tools",
  "aria-label": "Agent traits"
}, vs = {
  key: 0,
  class: "kx-err",
  role: "alert"
}, _s = ["value"], gs = ["aria-label", "onClick"], $s = ["schema", "config"], ws = {
  key: 2,
  class: "ac-muted",
  role: "status"
}, bs = {
  key: 3,
  class: "ac-muted",
  role: "status"
}, Es = {
  key: 4,
  class: "ac-muted",
  role: "status"
}, Ss = {
  key: 5,
  class: "kx-err",
  role: "alert"
}, Ts = /* @__PURE__ */ wn({
  __name: "trait-tools",
  props: {
    modelValue: {},
    agent: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(e, { emit: n }) {
    const w = e, m = n, S = $e([]), s = $e(!1), d = $e(""), u = $e(""), f = $e(), $ = $e(), v = $e(!1);
    let O = !0, I = 0;
    An(() => {
      O = !1, I++;
    });
    const R = de(() => w.modelValue?.traits ?? []), N = de(() => R.value.filter((l) => !S.value.some((p) => p.id === l))), k = de(() => w.modelValue?.context ?? {}), y = de(() => JSON.stringify({ traits: R.value, trait_contexts: Object.fromEntries(R.value.map((l) => {
      const p = S.value.find((A) => A.id === l)?.context_schema;
      return [l, Object.fromEntries(Object.keys(p?.properties ?? {}).filter((A) => A in k.value).map((A) => [A, k.value[A]]))];
    })) })), g = de(() => {
      const l = {}, p = /* @__PURE__ */ new Set();
      for (const A of S.value.filter((F) => R.value.includes(F.id) && !F.web_component)) {
        for (const [F, D] of Object.entries(A.context_schema?.properties ?? {}))
          l[F] = { ...D, ...!D.picker && (F === "board_id" || F === "catalog_id") ? { picker: "wc-component-picker", class: F === "board_id" ? "work.board" : "pim.catalog" } : {} };
        for (const F of A.context_schema?.required ?? []) p.add(F);
      }
      return { type: "object", properties: l, required: [...p] };
    }), a = Vn({ traits: Un(Ln()), trait_contexts: qt(qt(rr())) });
    function _(l) {
      if (l.target !== l.currentTarget) return;
      const p = a.safeParse(l.detail);
      if (!p.success) return;
      const A = p.data, F = new Set(A.traits.flatMap((L) => Object.keys(S.value.find((H) => H.id === L)?.context_schema?.properties ?? {}))), D = Object.fromEntries(Object.entries(k.value).filter(([L]) => F.has(L))), K = JSON.parse(y.value);
      for (const L of A.traits) {
        for (const [H, Z] of Object.entries(A.trait_contexts[L] ?? {}))
          F.has(H) && JSON.stringify(Z) !== JSON.stringify(K.trait_contexts[L]?.[H]) && (D[H] = Z);
        for (const H of Object.keys(K.trait_contexts[L] ?? {}))
          H in (A.trait_contexts[L] ?? {}) || delete D[H];
      }
      m("update:modelValue", { traits: A.traits, context: D });
    }
    function P(l) {
      const p = R.value.filter((F) => F !== l), A = new Set(p.flatMap((F) => Object.keys(S.value.find((D) => D.id === F)?.context_schema?.properties ?? {})));
      m("update:modelValue", { traits: p, context: Object.fromEntries(Object.entries(k.value).filter(([F]) => A.has(F))) });
    }
    function i(l) {
      if (l.target !== l.currentTarget) return;
      const p = qt(rr()).safeParse(l.detail);
      if (!p.success) return;
      const A = { ...k.value };
      for (const F of Object.keys(g.value.properties)) delete A[F];
      Object.assign(A, p.data), m("update:modelValue", { traits: [...R.value], context: A });
    }
    async function o() {
      s.value = !1, d.value = "";
      try {
        const [l] = await Promise.all([Xt.traits(), ...["wc-agent-trait-picker", "wc-schema-form"].map((p) => customElements.get(p) ? Promise.resolve() : zn(p, { timeoutMs: 8e3 }))]);
        if (!O) return;
        S.value = l, s.value = !0;
      } catch (l) {
        O && (d.value = tr(l, "Could not load agent traits."));
      }
    }
    return Dn(o), ze(() => [w.agent, w.modelValue], async () => {
      const l = ++I;
      if (u.value = "", f.value = void 0, $.value = void 0, w.modelValue === void 0) {
        v.value = !1;
        return;
      }
      v.value = !0;
      try {
        const p = await Xt.toolSurface(w.agent, w.modelValue);
        if (!O || l !== I) return;
        f.value = p.count, $.value = p.limit;
      } catch (p) {
        if (!O || l !== I) return;
        u.value = p instanceof er ? `${p.code ?? p.kind}: ${p.message}` : tr(p, "Could not resolve trait tools."), p instanceof er && p.code === "autocode.tool_limit_exceeded" && (f.value = typeof p.details?.count == "number" ? p.details.count : void 0, $.value = typeof p.details?.limit == "number" ? p.details.limit : void 0);
      } finally {
        O && l === I && (v.value = !1);
      }
    }, { deep: !0, immediate: !0, flush: "sync" }), ze([v, u, d, s], () => m("invalid", v.value || !!u.value || !!w.modelValue && (!s.value || !!d.value)), { immediate: !0, flush: "sync" }), (l, p) => (ne(), ae("div", ys, [
      p[1] || (p[1] = me("p", { class: "ac-muted" }, "Agent tools come from selected traits. Context applies to every selected trait that declares the field.", -1)),
      d.value ? (ne(), ae("p", vs, [
        kt(pe(d.value) + " ", 1),
        me("button", {
          type: "button",
          class: "ac-btn kx-focus-halo",
          onClick: o
        }, "Retry traits")
      ])) : Pe("", !0),
      s.value ? (ne(), ae(je, { key: 1 }, [
        me("wc-agent-trait-picker", {
          value: y.value,
          "keep-menu-open-on-add": !0,
          onChange: _
        }, null, 40, _s),
        (ne(!0), ae(je, null, Jt(N.value, (A) => (ne(), ae("p", {
          key: A,
          class: "ac-muted"
        }, [
          kt("Unavailable trait: " + pe(A) + " ", 1),
          me("button", {
            type: "button",
            class: "ac-link kx-focus-outline",
            "aria-label": `Remove unavailable trait ${A}`,
            onClick: (F) => P(A)
          }, "Remove", 8, gs)
        ]))), 128)),
        Object.keys(g.value.properties).length ? (ne(), ae(je, { key: 0 }, [
          p[0] || (p[0] = me("p", { class: "ac-muted" }, "Trait context", -1)),
          me("wc-schema-form", {
            schema: JSON.stringify(g.value),
            config: JSON.stringify(k.value),
            onConfigChanged: i
          }, null, 40, $s)
        ], 64)) : Pe("", !0)
      ], 64)) : d.value ? Pe("", !0) : (ne(), ae("p", ws, "Loading agent traits…")),
      f.value !== void 0 ? (ne(), ae("p", bs, pe(f.value) + " / " + pe($.value) + " tools", 1)) : (ne(), ae("p", Es, pe(v.value ? "Resolving trait tools…" : "No trait tools selected."), 1)),
      u.value ? (ne(), ae("p", Ss, pe(u.value), 1)) : Pe("", !0)
    ]));
  }
});
export {
  Ts as _,
  js as a,
  Kn as d,
  Ns as e,
  Is as u
};
