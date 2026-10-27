import { defineComponent as Pn, ref as It, useId as Rn, computed as jt, watch as Nn, openBlock as le, createElementBlock as de, createElementVNode as be, createTextVNode as Tt, toDisplayString as ge, createCommentVNode as Te, withDirectives as On, vModelText as kn, Fragment as De, renderList as Zt, unref as Me } from "vue";
function na(e, s) {
  return e.agents.find((w) => s.some((d) => d.agent === w.id && d.usable && d.enabled))?.id ?? e.agents[0]?.id ?? "";
}
function sa(e, s) {
  return e.filter((w) => w.status === "ready" && w.agents.includes(s));
}
function mn(e) {
  return e.filter((s) => !s.profiles?.length || s.profiles.includes("batch"));
}
function aa(e) {
  return Object.fromEntries(mn(e?.options ?? []).filter((s) => s.default !== void 0 && s.default !== null).map((s) => {
    const w = JSON.parse(JSON.stringify(s.default));
    return [s.name, w];
  }));
}
function pn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var Fe = { exports: {} }, Ct = {}, _e = {}, Pe = {}, qt = {}, At = {}, Dt = {}, Qt;
function Et() {
  return Qt || (Qt = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.regexpCode = e.getEsmExportName = e.getProperty = e.safeStringify = e.stringify = e.strConcat = e.addCodeArg = e.str = e._ = e.nil = e._Code = e.Name = e.IDENTIFIER = e._CodeOrName = void 0;
    class s {
    }
    e._CodeOrName = s, e.IDENTIFIER = /^[a-z$_][a-z$_0-9]*$/i;
    class w extends s {
      constructor(o) {
        if (super(), !e.IDENTIFIER.test(o))
          throw new Error("CodeGen: name must be a valid identifier");
        this.str = o;
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
    class d extends s {
      constructor(o) {
        super(), this._items = typeof o == "string" ? [o] : o;
      }
      toString() {
        return this.str;
      }
      emptyStr() {
        if (this._items.length > 1)
          return !1;
        const o = this._items[0];
        return o === "" || o === '""';
      }
      get str() {
        var o;
        return (o = this._str) !== null && o !== void 0 ? o : this._str = this._items.reduce((p, E) => `${p}${E}`, "");
      }
      get names() {
        var o;
        return (o = this._names) !== null && o !== void 0 ? o : this._names = this._items.reduce((p, E) => (E instanceof w && (p[E.str] = (p[E.str] || 0) + 1), p), {});
      }
    }
    e._Code = d, e.nil = new d("");
    function S(y, ...o) {
      const p = [y[0]];
      let E = 0;
      for (; E < o.length; )
        c(p, o[E]), p.push(y[++E]);
      return new d(p);
    }
    e._ = S;
    const a = new d("+");
    function f(y, ...o) {
      const p = [N(y[0])];
      let E = 0;
      for (; E < o.length; )
        p.push(a), c(p, o[E]), p.push(a, N(y[++E]));
      return h(p), new d(p);
    }
    e.str = f;
    function c(y, o) {
      o instanceof d ? y.push(...o._items) : o instanceof w ? y.push(o) : y.push(R(o));
    }
    e.addCodeArg = c;
    function h(y) {
      let o = 1;
      for (; o < y.length - 1; ) {
        if (y[o] === a) {
          const p = $(y[o - 1], y[o + 1]);
          if (p !== void 0) {
            y.splice(o - 1, 3, p);
            continue;
          }
          y[o++] = "+";
        }
        o++;
      }
    }
    function $(y, o) {
      if (o === '""')
        return y;
      if (y === '""')
        return o;
      if (typeof y == "string")
        return o instanceof w || y[y.length - 1] !== '"' ? void 0 : typeof o != "string" ? `${y.slice(0, -1)}${o}"` : o[0] === '"' ? y.slice(0, -1) + o.slice(1) : void 0;
      if (typeof o == "string" && o[0] === '"' && !(y instanceof w))
        return `"${y}${o.slice(1)}`;
    }
    function g(y, o) {
      return o.emptyStr() ? y : y.emptyStr() ? o : f`${y}${o}`;
    }
    e.strConcat = g;
    function R(y) {
      return typeof y == "number" || typeof y == "boolean" || y === null ? y : N(Array.isArray(y) ? y.join(",") : y);
    }
    function j(y) {
      return new d(N(y));
    }
    e.stringify = j;
    function N(y) {
      return JSON.stringify(y).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = N;
    function O(y) {
      return typeof y == "string" && e.IDENTIFIER.test(y) ? new d(`.${y}`) : S`[${y}]`;
    }
    e.getProperty = O;
    function P(y) {
      if (typeof y == "string" && e.IDENTIFIER.test(y))
        return new d(`${y}`);
      throw new Error(`CodeGen: invalid export name: ${y}, use explicit $id name mapping`);
    }
    e.getEsmExportName = P;
    function _(y) {
      return new d(y.toString());
    }
    e.regexpCode = _;
  })(Dt)), Dt;
}
var Mt = {}, Yt;
function Xt() {
  return Yt || (Yt = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const s = /* @__PURE__ */ Et();
    class w extends Error {
      constructor($) {
        super(`CodeGen: "code" for ${$} not defined`), this.value = $.value;
      }
    }
    var d;
    (function(h) {
      h[h.Started = 0] = "Started", h[h.Completed = 1] = "Completed";
    })(d || (e.UsedValueState = d = {})), e.varKinds = {
      const: new s.Name("const"),
      let: new s.Name("let"),
      var: new s.Name("var")
    };
    class S {
      constructor({ prefixes: $, parent: g } = {}) {
        this._names = {}, this._prefixes = $, this._parent = g;
      }
      toName($) {
        return $ instanceof s.Name ? $ : this.name($);
      }
      name($) {
        return new s.Name(this._newName($));
      }
      _newName($) {
        const g = this._names[$] || this._nameGroup($);
        return `${$}${g.index++}`;
      }
      _nameGroup($) {
        var g, R;
        if (!((R = (g = this._parent) === null || g === void 0 ? void 0 : g._prefixes) === null || R === void 0) && R.has($) || this._prefixes && !this._prefixes.has($))
          throw new Error(`CodeGen: prefix "${$}" is not allowed in this scope`);
        return this._names[$] = { prefix: $, index: 0 };
      }
    }
    e.Scope = S;
    class a extends s.Name {
      constructor($, g) {
        super(g), this.prefix = $;
      }
      setValue($, { property: g, itemIndex: R }) {
        this.value = $, this.scopePath = (0, s._)`.${new s.Name(g)}[${R}]`;
      }
    }
    e.ValueScopeName = a;
    const f = (0, s._)`\n`;
    class c extends S {
      constructor($) {
        super($), this._values = {}, this._scope = $.scope, this.opts = { ...$, _n: $.lines ? f : s.nil };
      }
      get() {
        return this._scope;
      }
      name($) {
        return new a($, this._newName($));
      }
      value($, g) {
        var R;
        if (g.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const j = this.toName($), { prefix: N } = j, O = (R = g.key) !== null && R !== void 0 ? R : g.ref;
        let P = this._values[N];
        if (P) {
          const o = P.get(O);
          if (o)
            return o;
        } else
          P = this._values[N] = /* @__PURE__ */ new Map();
        P.set(O, j);
        const _ = this._scope[N] || (this._scope[N] = []), y = _.length;
        return _[y] = g.ref, j.setValue(g, { property: N, itemIndex: y }), j;
      }
      getValue($, g) {
        const R = this._values[$];
        if (R)
          return R.get(g);
      }
      scopeRefs($, g = this._values) {
        return this._reduceValues(g, (R) => {
          if (R.scopePath === void 0)
            throw new Error(`CodeGen: name "${R}" has no value`);
          return (0, s._)`${$}${R.scopePath}`;
        });
      }
      scopeCode($ = this._values, g, R) {
        return this._reduceValues($, (j) => {
          if (j.value === void 0)
            throw new Error(`CodeGen: name "${j}" has no value`);
          return j.value.code;
        }, g, R);
      }
      _reduceValues($, g, R = {}, j) {
        let N = s.nil;
        for (const O in $) {
          const P = $[O];
          if (!P)
            continue;
          const _ = R[O] = R[O] || /* @__PURE__ */ new Map();
          P.forEach((y) => {
            if (_.has(y))
              return;
            _.set(y, d.Started);
            let o = g(y);
            if (o) {
              const p = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              N = (0, s._)`${N}${p} ${y} = ${o};${this.opts._n}`;
            } else if (o = j?.(y))
              N = (0, s._)`${N}${o}${this.opts._n}`;
            else
              throw new w(y);
            _.set(y, d.Completed);
          });
        }
        return N;
      }
    }
    e.ValueScope = c;
  })(Mt)), Mt;
}
var er;
function W() {
  return er || (er = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const s = /* @__PURE__ */ Et(), w = /* @__PURE__ */ Xt();
    var d = /* @__PURE__ */ Et();
    Object.defineProperty(e, "_", { enumerable: !0, get: function() {
      return d._;
    } }), Object.defineProperty(e, "str", { enumerable: !0, get: function() {
      return d.str;
    } }), Object.defineProperty(e, "strConcat", { enumerable: !0, get: function() {
      return d.strConcat;
    } }), Object.defineProperty(e, "nil", { enumerable: !0, get: function() {
      return d.nil;
    } }), Object.defineProperty(e, "getProperty", { enumerable: !0, get: function() {
      return d.getProperty;
    } }), Object.defineProperty(e, "stringify", { enumerable: !0, get: function() {
      return d.stringify;
    } }), Object.defineProperty(e, "regexpCode", { enumerable: !0, get: function() {
      return d.regexpCode;
    } }), Object.defineProperty(e, "Name", { enumerable: !0, get: function() {
      return d.Name;
    } });
    var S = /* @__PURE__ */ Xt();
    Object.defineProperty(e, "Scope", { enumerable: !0, get: function() {
      return S.Scope;
    } }), Object.defineProperty(e, "ValueScope", { enumerable: !0, get: function() {
      return S.ValueScope;
    } }), Object.defineProperty(e, "ValueScopeName", { enumerable: !0, get: function() {
      return S.ValueScopeName;
    } }), Object.defineProperty(e, "varKinds", { enumerable: !0, get: function() {
      return S.varKinds;
    } }), e.operators = {
      GT: new s._Code(">"),
      GTE: new s._Code(">="),
      LT: new s._Code("<"),
      LTE: new s._Code("<="),
      EQ: new s._Code("==="),
      NEQ: new s._Code("!=="),
      NOT: new s._Code("!"),
      OR: new s._Code("||"),
      AND: new s._Code("&&"),
      ADD: new s._Code("+")
    };
    class a {
      optimizeNodes() {
        return this;
      }
      optimizeNames(t, r) {
        return this;
      }
    }
    class f extends a {
      constructor(t, r, v) {
        super(), this.varKind = t, this.name = r, this.rhs = v;
      }
      render({ es5: t, _n: r }) {
        const v = t ? w.varKinds.var : this.varKind, T = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${v} ${this.name}${T};` + r;
      }
      optimizeNames(t, r) {
        if (t[this.name.str])
          return this.rhs && (this.rhs = x(this.rhs, t, r)), this;
      }
      get names() {
        return this.rhs instanceof s._CodeOrName ? this.rhs.names : {};
      }
    }
    class c extends a {
      constructor(t, r, v) {
        super(), this.lhs = t, this.rhs = r, this.sideEffects = v;
      }
      render({ _n: t }) {
        return `${this.lhs} = ${this.rhs};` + t;
      }
      optimizeNames(t, r) {
        if (!(this.lhs instanceof s.Name && !t[this.lhs.str] && !this.sideEffects))
          return this.rhs = x(this.rhs, t, r), this;
      }
      get names() {
        const t = this.lhs instanceof s.Name ? {} : { ...this.lhs.names };
        return H(t, this.rhs);
      }
    }
    class h extends c {
      constructor(t, r, v, T) {
        super(t, v, T), this.op = r;
      }
      render({ _n: t }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + t;
      }
    }
    class $ extends a {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `${this.label}:` + t;
      }
    }
    class g extends a {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `break${this.label ? ` ${this.label}` : ""};` + t;
      }
    }
    class R extends a {
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
    class j extends a {
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
        return this.code instanceof s._CodeOrName ? this.code.names : {};
      }
    }
    class N extends a {
      constructor(t = []) {
        super(), this.nodes = t;
      }
      render(t) {
        return this.nodes.reduce((r, v) => r + v.render(t), "");
      }
      optimizeNodes() {
        const { nodes: t } = this;
        let r = t.length;
        for (; r--; ) {
          const v = t[r].optimizeNodes();
          Array.isArray(v) ? t.splice(r, 1, ...v) : v ? t[r] = v : t.splice(r, 1);
        }
        return t.length > 0 ? this : void 0;
      }
      optimizeNames(t, r) {
        const { nodes: v } = this;
        let T = v.length;
        for (; T--; ) {
          const I = v[T];
          I.optimizeNames(t, r) || (Z(t, I.names), v.splice(T, 1));
        }
        return v.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((t, r) => L(t, r.names), {});
      }
    }
    class O extends N {
      render(t) {
        return "{" + t._n + super.render(t) + "}" + t._n;
      }
    }
    class P extends N {
    }
    class _ extends O {
    }
    _.kind = "else";
    class y extends O {
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
          const v = r.optimizeNodes();
          r = this.else = Array.isArray(v) ? new _(v) : v;
        }
        if (r)
          return t === !1 ? r instanceof y ? r : r.nodes : this.nodes.length ? this : new y(ie(t), r instanceof y ? [r] : r.nodes);
        if (!(t === !1 || !this.nodes.length))
          return this;
      }
      optimizeNames(t, r) {
        var v;
        if (this.else = (v = this.else) === null || v === void 0 ? void 0 : v.optimizeNames(t, r), !!(super.optimizeNames(t, r) || this.else))
          return this.condition = x(this.condition, t, r), this;
      }
      get names() {
        const t = super.names;
        return H(t, this.condition), this.else && L(t, this.else.names), t;
      }
    }
    y.kind = "if";
    class o extends O {
    }
    o.kind = "for";
    class p extends o {
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
    class E extends o {
      constructor(t, r, v, T) {
        super(), this.varKind = t, this.name = r, this.from = v, this.to = T;
      }
      render(t) {
        const r = t.es5 ? w.varKinds.var : this.varKind, { name: v, from: T, to: I } = this;
        return `for(${r} ${v}=${T}; ${v}<${I}; ${v}++)` + super.render(t);
      }
      get names() {
        const t = H(super.names, this.from);
        return H(t, this.to);
      }
    }
    class n extends o {
      constructor(t, r, v, T) {
        super(), this.loop = t, this.varKind = r, this.name = v, this.iterable = T;
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
    class i extends O {
      constructor(t, r, v) {
        super(), this.name = t, this.args = r, this.async = v;
      }
      render(t) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(t);
      }
    }
    i.kind = "func";
    class l extends N {
      render(t) {
        return "return " + super.render(t);
      }
    }
    l.kind = "return";
    class q extends O {
      render(t) {
        let r = "try" + super.render(t);
        return this.catch && (r += this.catch.render(t)), this.finally && (r += this.finally.render(t)), r;
      }
      optimizeNodes() {
        var t, r;
        return super.optimizeNodes(), (t = this.catch) === null || t === void 0 || t.optimizeNodes(), (r = this.finally) === null || r === void 0 || r.optimizeNodes(), this;
      }
      optimizeNames(t, r) {
        var v, T;
        return super.optimizeNames(t, r), (v = this.catch) === null || v === void 0 || v.optimizeNames(t, r), (T = this.finally) === null || T === void 0 || T.optimizeNames(t, r), this;
      }
      get names() {
        const t = super.names;
        return this.catch && L(t, this.catch.names), this.finally && L(t, this.finally.names), t;
      }
    }
    class M extends O {
      constructor(t) {
        super(), this.error = t;
      }
      render(t) {
        return `catch(${this.error})` + super.render(t);
      }
    }
    M.kind = "catch";
    class K extends O {
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
        const v = this._extScope.value(t, r);
        return (this._values[v.prefix] || (this._values[v.prefix] = /* @__PURE__ */ new Set())).add(v), v;
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
      _def(t, r, v, T) {
        const I = this._scope.toName(r);
        return v !== void 0 && T && (this._constants[I.str] = v), this._leafNode(new f(t, I, v)), I;
      }
      // `const` declaration (`var` in es5 mode)
      const(t, r, v) {
        return this._def(w.varKinds.const, t, r, v);
      }
      // `let` declaration with optional assignment (`var` in es5 mode)
      let(t, r, v) {
        return this._def(w.varKinds.let, t, r, v);
      }
      // `var` declaration with optional assignment
      var(t, r, v) {
        return this._def(w.varKinds.var, t, r, v);
      }
      // assignment code
      assign(t, r, v) {
        return this._leafNode(new c(t, r, v));
      }
      // `+=` code
      add(t, r) {
        return this._leafNode(new h(t, e.operators.ADD, r));
      }
      // appends passed SafeExpr to code or executes Block
      code(t) {
        return typeof t == "function" ? t() : t !== s.nil && this._leafNode(new j(t)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...t) {
        const r = ["{"];
        for (const [v, T] of t)
          r.length > 1 && r.push(","), r.push(v), (v !== T || this.opts.es5) && (r.push(":"), (0, s.addCodeArg)(r, T));
        return r.push("}"), new s._Code(r);
      }
      // `if` clause (or statement if `thenBody` and, optionally, `elseBody` are passed)
      if(t, r, v) {
        if (this._blockNode(new y(t)), r && v)
          this.code(r).else().code(v).endIf();
        else if (r)
          this.code(r).endIf();
        else if (v)
          throw new Error('CodeGen: "else" body without "then" body');
        return this;
      }
      // `else if` clause - invalid without `if` or after `else` clauses
      elseIf(t) {
        return this._elseNode(new y(t));
      }
      // `else` clause - only valid after `if` or `else if` clauses
      else() {
        return this._elseNode(new _());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(y, _);
      }
      _for(t, r) {
        return this._blockNode(t), r && this.code(r).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(t, r) {
        return this._for(new p(t), r);
      }
      // `for` statement for a range of values
      forRange(t, r, v, T, I = this.opts.es5 ? w.varKinds.var : w.varKinds.let) {
        const F = this._scope.toName(t);
        return this._for(new E(I, F, r, v), () => T(F));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(t, r, v, T = w.varKinds.const) {
        const I = this._scope.toName(t);
        if (this.opts.es5) {
          const F = r instanceof s.Name ? r : this.var("_arr", r);
          return this.forRange("_i", 0, (0, s._)`${F}.length`, (G) => {
            this.var(I, (0, s._)`${F}[${G}]`), v(I);
          });
        }
        return this._for(new n("of", T, I, r), () => v(I));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(t, r, v, T = this.opts.es5 ? w.varKinds.var : w.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(t, (0, s._)`Object.keys(${r})`, v);
        const I = this._scope.toName(t);
        return this._for(new n("in", T, I, r), () => v(I));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(o);
      }
      // `label` statement
      label(t) {
        return this._leafNode(new $(t));
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
      try(t, r, v) {
        if (!r && !v)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const T = new q();
        if (this._blockNode(T), this.code(t), r) {
          const I = this.name("e");
          this._currNode = T.catch = new M(I), r(I);
        }
        return v && (this._currNode = T.finally = new K(), this.code(v)), this._endBlockNode(M, K);
      }
      // `throw` statement
      throw(t) {
        return this._leafNode(new R(t));
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
        const v = this._nodes.length - r;
        if (v < 0 || t !== void 0 && v !== t)
          throw new Error(`CodeGen: wrong number of nodes: ${v} vs ${t} expected`);
        return this._nodes.length = r, this;
      }
      // `function` heading (or definition if funcBody is passed)
      func(t, r = s.nil, v, T) {
        return this._blockNode(new i(t, r, v)), T && this.code(T).endFunc(), this;
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
        const v = this._currNode;
        if (v instanceof t || r && v instanceof r)
          return this._nodes.pop(), this;
        throw new Error(`CodeGen: not in block "${r ? `${t.kind}/${r.kind}` : t.kind}"`);
      }
      _elseNode(t) {
        const r = this._currNode;
        if (!(r instanceof y))
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
      return t instanceof s._CodeOrName ? L(m, t.names) : m;
    }
    function x(m, t, r) {
      if (m instanceof s.Name)
        return v(m);
      if (!T(m))
        return m;
      return new s._Code(m._items.reduce((I, F) => (F instanceof s.Name && (F = v(F)), F instanceof s._Code ? I.push(...F._items) : I.push(F), I), []));
      function v(I) {
        const F = r[I.str];
        return F === void 0 || t[I.str] !== 1 ? I : (delete t[I.str], F);
      }
      function T(I) {
        return I instanceof s._Code && I._items.some((F) => F instanceof s.Name && t[F.str] === 1 && r[F.str] !== void 0);
      }
    }
    function Z(m, t) {
      for (const r in t)
        m[r] = (m[r] || 0) - (t[r] || 0);
    }
    function ie(m) {
      return typeof m == "boolean" || typeof m == "number" || m === null ? !m : (0, s._)`!${b(m)}`;
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
      return (t, r) => t === s.nil ? r : r === s.nil ? t : (0, s._)`${b(t)} ${m} ${b(r)}`;
    }
    function b(m) {
      return m instanceof s.Name ? m : (0, s._)`(${m})`;
    }
  })(At)), At;
}
var B = {}, tr;
function Q() {
  if (tr) return B;
  tr = 1, Object.defineProperty(B, "__esModule", { value: !0 }), B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Et();
  function w(n) {
    const i = {};
    for (const l of n)
      i[l] = !0;
    return i;
  }
  B.toHash = w;
  function d(n, i) {
    return typeof i == "boolean" ? i : Object.keys(i).length === 0 ? !0 : (S(n, i), !a(i, n.self.RULES.all));
  }
  B.alwaysValidSchema = d;
  function S(n, i = n.schema) {
    const { opts: l, self: q } = n;
    if (!l.strictSchema || typeof i == "boolean")
      return;
    const M = q.RULES.keywords;
    for (const K in i)
      M[K] || E(n, `unknown keyword: "${K}"`);
  }
  B.checkUnknownRules = S;
  function a(n, i) {
    if (typeof n == "boolean")
      return !n;
    for (const l in n)
      if (i[l])
        return !0;
    return !1;
  }
  B.schemaHasRules = a;
  function f(n, i) {
    if (typeof n == "boolean")
      return !n;
    for (const l in n)
      if (l !== "$ref" && i.all[l])
        return !0;
    return !1;
  }
  B.schemaHasRulesButRef = f;
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
    return R(decodeURIComponent(n));
  }
  B.unescapeFragment = h;
  function $(n) {
    return encodeURIComponent(g(n));
  }
  B.escapeFragment = $;
  function g(n) {
    return typeof n == "number" ? `${n}` : n.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  B.escapeJsonPointer = g;
  function R(n) {
    return n.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  B.unescapeJsonPointer = R;
  function j(n, i) {
    if (Array.isArray(n))
      for (const l of n)
        i(l);
    else
      i(n);
  }
  B.eachItem = j;
  function N({ mergeNames: n, mergeToName: i, mergeValues: l, resultToName: q }) {
    return (M, K, D, L) => {
      const H = D === void 0 ? K : D instanceof e.Name ? (K instanceof e.Name ? n(M, K, D) : i(M, K, D), D) : K instanceof e.Name ? (i(M, D, K), K) : l(K, D);
      return L === e.Name && !(H instanceof e.Name) ? q(M, H) : H;
    };
  }
  B.mergeEvaluated = {
    props: N({
      mergeNames: (n, i, l) => n.if((0, e._)`${l} !== true && ${i} !== undefined`, () => {
        n.if((0, e._)`${i} === true`, () => n.assign(l, !0), () => n.assign(l, (0, e._)`${l} || {}`).code((0, e._)`Object.assign(${l}, ${i})`));
      }),
      mergeToName: (n, i, l) => n.if((0, e._)`${l} !== true`, () => {
        i === !0 ? n.assign(l, !0) : (n.assign(l, (0, e._)`${l} || {}`), P(n, l, i));
      }),
      mergeValues: (n, i) => n === !0 ? !0 : { ...n, ...i },
      resultToName: O
    }),
    items: N({
      mergeNames: (n, i, l) => n.if((0, e._)`${l} !== true && ${i} !== undefined`, () => n.assign(l, (0, e._)`${i} === true ? true : ${l} > ${i} ? ${l} : ${i}`)),
      mergeToName: (n, i, l) => n.if((0, e._)`${l} !== true`, () => n.assign(l, i === !0 ? !0 : (0, e._)`${l} > ${i} ? ${l} : ${i}`)),
      mergeValues: (n, i) => n === !0 ? !0 : Math.max(n, i),
      resultToName: (n, i) => n.var("items", i)
    })
  };
  function O(n, i) {
    if (i === !0)
      return n.var("props", !0);
    const l = n.var("props", (0, e._)`{}`);
    return i !== void 0 && P(n, l, i), l;
  }
  B.evaluatedPropsToName = O;
  function P(n, i, l) {
    Object.keys(l).forEach((q) => n.assign((0, e._)`${i}${(0, e.getProperty)(q)}`, !0));
  }
  B.setEvaluated = P;
  const _ = {};
  function y(n, i) {
    return n.scopeValue("func", {
      ref: i,
      code: _[i.code] || (_[i.code] = new s._Code(i.code))
    });
  }
  B.useFunc = y;
  var o;
  (function(n) {
    n[n.Num = 0] = "Num", n[n.Str = 1] = "Str";
  })(o || (B.Type = o = {}));
  function p(n, i, l) {
    if (n instanceof e.Name) {
      const q = i === o.Num;
      return l ? q ? (0, e._)`"[" + ${n} + "]"` : (0, e._)`"['" + ${n} + "']"` : q ? (0, e._)`"/" + ${n}` : (0, e._)`"/" + ${n}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return l ? (0, e.getProperty)(n).toString() : "/" + g(n);
  }
  B.getErrorPath = p;
  function E(n, i, l = n.opts.strictSchema) {
    if (l) {
      if (i = `strict mode: ${i}`, l === !0)
        throw new Error(i);
      n.self.logger.warn(i);
    }
  }
  return B.checkStrictMode = E, B;
}
var ze = {}, rr;
function Se() {
  if (rr) return ze;
  rr = 1, Object.defineProperty(ze, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = {
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
  return ze.default = s, ze;
}
var nr;
function Pt() {
  return nr || (nr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Se();
    e.keywordError = {
      message: ({ keyword: _ }) => (0, s.str)`must pass "${_}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: _, schemaType: y }) => y ? (0, s.str)`"${_}" keyword must be ${y} ($data)` : (0, s.str)`"${_}" keyword is invalid ($data)`
    };
    function S(_, y = e.keywordError, o, p) {
      const { it: E } = _, { gen: n, compositeRule: i, allErrors: l } = E, q = R(_, y, o);
      p ?? (i || l) ? h(n, q) : $(E, (0, s._)`[${q}]`);
    }
    e.reportError = S;
    function a(_, y = e.keywordError, o) {
      const { it: p } = _, { gen: E, compositeRule: n, allErrors: i } = p, l = R(_, y, o);
      h(E, l), n || i || $(p, d.default.vErrors);
    }
    e.reportExtraError = a;
    function f(_, y) {
      _.assign(d.default.errors, y), _.if((0, s._)`${d.default.vErrors} !== null`, () => _.if(y, () => _.assign((0, s._)`${d.default.vErrors}.length`, y), () => _.assign(d.default.vErrors, null)));
    }
    e.resetErrorsCount = f;
    function c({ gen: _, keyword: y, schemaValue: o, data: p, errsCount: E, it: n }) {
      if (E === void 0)
        throw new Error("ajv implementation error");
      const i = _.name("err");
      _.forRange("i", E, d.default.errors, (l) => {
        _.const(i, (0, s._)`${d.default.vErrors}[${l}]`), _.if((0, s._)`${i}.instancePath === undefined`, () => _.assign((0, s._)`${i}.instancePath`, (0, s.strConcat)(d.default.instancePath, n.errorPath))), _.assign((0, s._)`${i}.schemaPath`, (0, s.str)`${n.errSchemaPath}/${y}`), n.opts.verbose && (_.assign((0, s._)`${i}.schema`, o), _.assign((0, s._)`${i}.data`, p));
      });
    }
    e.extendErrors = c;
    function h(_, y) {
      const o = _.const("err", y);
      _.if((0, s._)`${d.default.vErrors} === null`, () => _.assign(d.default.vErrors, (0, s._)`[${o}]`), (0, s._)`${d.default.vErrors}.push(${o})`), _.code((0, s._)`${d.default.errors}++`);
    }
    function $(_, y) {
      const { gen: o, validateName: p, schemaEnv: E } = _;
      E.$async ? o.throw((0, s._)`new ${_.ValidationError}(${y})`) : (o.assign((0, s._)`${p}.errors`, y), o.return(!1));
    }
    const g = {
      keyword: new s.Name("keyword"),
      schemaPath: new s.Name("schemaPath"),
      // also used in JTD errors
      params: new s.Name("params"),
      propertyName: new s.Name("propertyName"),
      message: new s.Name("message"),
      schema: new s.Name("schema"),
      parentSchema: new s.Name("parentSchema")
    };
    function R(_, y, o) {
      const { createErrors: p } = _.it;
      return p === !1 ? (0, s._)`{}` : j(_, y, o);
    }
    function j(_, y, o = {}) {
      const { gen: p, it: E } = _, n = [
        N(E, o),
        O(_, o)
      ];
      return P(_, y, n), p.object(...n);
    }
    function N({ errorPath: _ }, { instancePath: y }) {
      const o = y ? (0, s.str)`${_}${(0, w.getErrorPath)(y, w.Type.Str)}` : _;
      return [d.default.instancePath, (0, s.strConcat)(d.default.instancePath, o)];
    }
    function O({ keyword: _, it: { errSchemaPath: y } }, { schemaPath: o, parentSchema: p }) {
      let E = p ? y : (0, s.str)`${y}/${_}`;
      return o && (E = (0, s.str)`${E}${(0, w.getErrorPath)(o, w.Type.Str)}`), [g.schemaPath, E];
    }
    function P(_, { params: y, message: o }, p) {
      const { keyword: E, data: n, schemaValue: i, it: l } = _, { opts: q, propertyName: M, topSchemaRef: K, schemaPath: D } = l;
      p.push([g.keyword, E], [g.params, typeof y == "function" ? y(_) : y || (0, s._)`{}`]), q.messages && p.push([g.message, typeof o == "function" ? o(_) : o]), q.verbose && p.push([g.schema, i], [g.parentSchema, (0, s._)`${K}${D}`], [d.default.data, n]), M && p.push([g.propertyName, M]);
    }
  })(qt)), qt;
}
var sr;
function In() {
  if (sr) return Pe;
  sr = 1, Object.defineProperty(Pe, "__esModule", { value: !0 }), Pe.boolOrEmptySchema = Pe.topBoolOrEmptySchema = void 0;
  const e = /* @__PURE__ */ Pt(), s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Se(), d = {
    message: "boolean schema is false"
  };
  function S(c) {
    const { gen: h, schema: $, validateName: g } = c;
    $ === !1 ? f(c, !1) : typeof $ == "object" && $.$async === !0 ? h.return(w.default.data) : (h.assign((0, s._)`${g}.errors`, null), h.return(!0));
  }
  Pe.topBoolOrEmptySchema = S;
  function a(c, h) {
    const { gen: $, schema: g } = c;
    g === !1 ? ($.var(h, !1), f(c)) : $.var(h, !0);
  }
  Pe.boolOrEmptySchema = a;
  function f(c, h) {
    const { gen: $, data: g } = c, R = {
      gen: $,
      keyword: "false schema",
      data: g,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(R, d, void 0, h);
  }
  return Pe;
}
var ce = {}, Re = {}, ar;
function yn() {
  if (ar) return Re;
  ar = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.getRules = Re.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], s = new Set(e);
  function w(S) {
    return typeof S == "string" && s.has(S);
  }
  Re.isJSONType = w;
  function d() {
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
  return Re.getRules = d, Re;
}
var $e = {}, or;
function vn() {
  if (or) return $e;
  or = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.shouldUseRule = $e.shouldUseGroup = $e.schemaHasRulesForType = void 0;
  function e({ schema: d, self: S }, a) {
    const f = S.RULES.types[a];
    return f && f !== !0 && s(d, f);
  }
  $e.schemaHasRulesForType = e;
  function s(d, S) {
    return S.rules.some((a) => w(d, a));
  }
  $e.shouldUseGroup = s;
  function w(d, S) {
    var a;
    return d[S.keyword] !== void 0 || ((a = S.definition.implements) === null || a === void 0 ? void 0 : a.some((f) => d[f] !== void 0));
  }
  return $e.shouldUseRule = w, $e;
}
var ir;
function St() {
  if (ir) return ce;
  ir = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.reportTypeError = ce.checkDataTypes = ce.checkDataType = ce.coerceAndCheckDataType = ce.getJSONTypes = ce.getSchemaTypes = ce.DataType = void 0;
  const e = /* @__PURE__ */ yn(), s = /* @__PURE__ */ vn(), w = /* @__PURE__ */ Pt(), d = /* @__PURE__ */ W(), S = /* @__PURE__ */ Q();
  var a;
  (function(o) {
    o[o.Correct = 0] = "Correct", o[o.Wrong = 1] = "Wrong";
  })(a || (ce.DataType = a = {}));
  function f(o) {
    const p = c(o.type);
    if (p.includes("null")) {
      if (o.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!p.length && o.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      o.nullable === !0 && p.push("null");
    }
    return p;
  }
  ce.getSchemaTypes = f;
  function c(o) {
    const p = Array.isArray(o) ? o : o ? [o] : [];
    if (p.every(e.isJSONType))
      return p;
    throw new Error("type must be JSONType or JSONType[]: " + p.join(","));
  }
  ce.getJSONTypes = c;
  function h(o, p) {
    const { gen: E, data: n, opts: i } = o, l = g(p, i.coerceTypes), q = p.length > 0 && !(l.length === 0 && p.length === 1 && (0, s.schemaHasRulesForType)(o, p[0]));
    if (q) {
      const M = O(p, n, i.strictNumbers, a.Wrong);
      E.if(M, () => {
        l.length ? R(o, p, l) : _(o);
      });
    }
    return q;
  }
  ce.coerceAndCheckDataType = h;
  const $ = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function g(o, p) {
    return p ? o.filter((E) => $.has(E) || p === "array" && E === "array") : [];
  }
  function R(o, p, E) {
    const { gen: n, data: i, opts: l } = o, q = n.let("dataType", (0, d._)`typeof ${i}`), M = n.let("coerced", (0, d._)`undefined`);
    l.coerceTypes === "array" && n.if((0, d._)`${q} == 'object' && Array.isArray(${i}) && ${i}.length == 1`, () => n.assign(i, (0, d._)`${i}[0]`).assign(q, (0, d._)`typeof ${i}`).if(O(p, i, l.strictNumbers), () => n.assign(M, i))), n.if((0, d._)`${M} !== undefined`);
    for (const D of E)
      ($.has(D) || D === "array" && l.coerceTypes === "array") && K(D);
    n.else(), _(o), n.endIf(), n.if((0, d._)`${M} !== undefined`, () => {
      n.assign(i, M), j(o, M);
    });
    function K(D) {
      switch (D) {
        case "string":
          n.elseIf((0, d._)`${q} == "number" || ${q} == "boolean"`).assign(M, (0, d._)`"" + ${i}`).elseIf((0, d._)`${i} === null`).assign(M, (0, d._)`""`);
          return;
        case "number":
          n.elseIf((0, d._)`${q} == "boolean" || ${i} === null
              || (${q} == "string" && ${i} && ${i} == +${i})`).assign(M, (0, d._)`+${i}`);
          return;
        case "integer":
          n.elseIf((0, d._)`${q} === "boolean" || ${i} === null
              || (${q} === "string" && ${i} && ${i} == +${i} && !(${i} % 1))`).assign(M, (0, d._)`+${i}`);
          return;
        case "boolean":
          n.elseIf((0, d._)`${i} === "false" || ${i} === 0 || ${i} === null`).assign(M, !1).elseIf((0, d._)`${i} === "true" || ${i} === 1`).assign(M, !0);
          return;
        case "null":
          n.elseIf((0, d._)`${i} === "" || ${i} === 0 || ${i} === false`), n.assign(M, null);
          return;
        case "array":
          n.elseIf((0, d._)`${q} === "string" || ${q} === "number"
              || ${q} === "boolean" || ${i} === null`).assign(M, (0, d._)`[${i}]`);
      }
    }
  }
  function j({ gen: o, parentData: p, parentDataProperty: E }, n) {
    o.if((0, d._)`${p} !== undefined`, () => o.assign((0, d._)`${p}[${E}]`, n));
  }
  function N(o, p, E, n = a.Correct) {
    const i = n === a.Correct ? d.operators.EQ : d.operators.NEQ;
    let l;
    switch (o) {
      case "null":
        return (0, d._)`${p} ${i} null`;
      case "array":
        l = (0, d._)`Array.isArray(${p})`;
        break;
      case "object":
        l = (0, d._)`${p} && typeof ${p} == "object" && !Array.isArray(${p})`;
        break;
      case "integer":
        l = q((0, d._)`!(${p} % 1) && !isNaN(${p})`);
        break;
      case "number":
        l = q();
        break;
      default:
        return (0, d._)`typeof ${p} ${i} ${o}`;
    }
    return n === a.Correct ? l : (0, d.not)(l);
    function q(M = d.nil) {
      return (0, d.and)((0, d._)`typeof ${p} == "number"`, M, E ? (0, d._)`isFinite(${p})` : d.nil);
    }
  }
  ce.checkDataType = N;
  function O(o, p, E, n) {
    if (o.length === 1)
      return N(o[0], p, E, n);
    let i;
    const l = (0, S.toHash)(o);
    if (l.array && l.object) {
      const q = (0, d._)`typeof ${p} != "object"`;
      i = l.null ? q : (0, d._)`!${p} || ${q}`, delete l.null, delete l.array, delete l.object;
    } else
      i = d.nil;
    l.number && delete l.integer;
    for (const q in l)
      i = (0, d.and)(i, N(q, p, E, n));
    return i;
  }
  ce.checkDataTypes = O;
  const P = {
    message: ({ schema: o }) => `must be ${o}`,
    params: ({ schema: o, schemaValue: p }) => typeof o == "string" ? (0, d._)`{type: ${o}}` : (0, d._)`{type: ${p}}`
  };
  function _(o) {
    const p = y(o);
    (0, w.reportError)(p, P);
  }
  ce.reportTypeError = _;
  function y(o) {
    const { gen: p, data: E, schema: n } = o, i = (0, S.schemaRefOrVal)(o, n, "type");
    return {
      gen: p,
      keyword: "type",
      data: E,
      schema: n.type,
      schemaCode: i,
      schemaValue: i,
      parentSchema: n,
      params: {},
      it: o
    };
  }
  return ce;
}
var Ce = {}, ur;
function jn() {
  if (ur) return Ce;
  ur = 1, Object.defineProperty(Ce, "__esModule", { value: !0 }), Ce.assignDefaults = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q();
  function w(S, a) {
    const { properties: f, items: c } = S.schema;
    if (a === "object" && f)
      for (const h in f)
        d(S, h, f[h].default);
    else a === "array" && Array.isArray(c) && c.forEach((h, $) => d(S, $, h.default));
  }
  Ce.assignDefaults = w;
  function d(S, a, f) {
    const { gen: c, compositeRule: h, data: $, opts: g } = S;
    if (f === void 0)
      return;
    const R = (0, e._)`${$}${(0, e.getProperty)(a)}`;
    if (h) {
      (0, s.checkStrictMode)(S, `default is ignored for: ${R}`);
      return;
    }
    let j = (0, e._)`${R} === undefined`;
    g.useDefaults === "empty" && (j = (0, e._)`${j} || ${R} === null || ${R} === ""`), c.if(j, (0, e._)`${R} = ${(0, e.stringify)(f)}`);
  }
  return Ce;
}
var ye = {}, te = {}, cr;
function ve() {
  if (cr) return te;
  cr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Se(), d = /* @__PURE__ */ Q();
  function S(o, p) {
    const { gen: E, data: n, it: i } = o;
    E.if(g(E, n, p, i.opts.ownProperties), () => {
      o.setParams({ missingProperty: (0, e._)`${p}` }, !0), o.error();
    });
  }
  te.checkReportMissingProp = S;
  function a({ gen: o, data: p, it: { opts: E } }, n, i) {
    return (0, e.or)(...n.map((l) => (0, e.and)(g(o, p, l, E.ownProperties), (0, e._)`${i} = ${l}`)));
  }
  te.checkMissingProp = a;
  function f(o, p) {
    o.setParams({ missingProperty: p }, !0), o.error();
  }
  te.reportMissingProp = f;
  function c(o) {
    return o.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  te.hasPropFunc = c;
  function h(o, p, E) {
    return (0, e._)`${c(o)}.call(${p}, ${E})`;
  }
  te.isOwnProperty = h;
  function $(o, p, E, n) {
    const i = (0, e._)`${p}${(0, e.getProperty)(E)} !== undefined`;
    return n ? (0, e._)`${i} && ${h(o, p, E)}` : i;
  }
  te.propertyInData = $;
  function g(o, p, E, n) {
    const i = (0, e._)`${p}${(0, e.getProperty)(E)} === undefined`;
    return n ? (0, e.or)(i, (0, e.not)(h(o, p, E))) : i;
  }
  te.noPropertyInData = g;
  function R(o) {
    return o ? Object.keys(o).filter((p) => p !== "__proto__") : [];
  }
  te.allSchemaProperties = R;
  function j(o, p) {
    return R(p).filter((E) => !(0, s.alwaysValidSchema)(o, p[E]));
  }
  te.schemaProperties = j;
  function N({ schemaCode: o, data: p, it: { gen: E, topSchemaRef: n, schemaPath: i, errorPath: l }, it: q }, M, K, D) {
    const L = D ? (0, e._)`${o}, ${p}, ${n}${i}` : p, H = [
      [w.default.instancePath, (0, e.strConcat)(w.default.instancePath, l)],
      [w.default.parentData, q.parentData],
      [w.default.parentDataProperty, q.parentDataProperty],
      [w.default.rootData, w.default.rootData]
    ];
    q.opts.dynamicRef && H.push([w.default.dynamicAnchors, w.default.dynamicAnchors]);
    const x = (0, e._)`${L}, ${E.object(...H)}`;
    return K !== e.nil ? (0, e._)`${M}.call(${K}, ${x})` : (0, e._)`${M}(${x})`;
  }
  te.callValidateCode = N;
  const O = (0, e._)`new RegExp`;
  function P({ gen: o, it: { opts: p } }, E) {
    const n = p.unicodeRegExp ? "u" : "", { regExp: i } = p.code, l = i(E, n);
    return o.scopeValue("pattern", {
      key: l.toString(),
      ref: l,
      code: (0, e._)`${i.code === "new RegExp" ? O : (0, d.useFunc)(o, i)}(${E}, ${n})`
    });
  }
  te.usePattern = P;
  function _(o) {
    const { gen: p, data: E, keyword: n, it: i } = o, l = p.name("valid");
    if (i.allErrors) {
      const M = p.let("valid", !0);
      return q(() => p.assign(M, !1)), M;
    }
    return p.var(l, !0), q(() => p.break()), l;
    function q(M) {
      const K = p.const("len", (0, e._)`${E}.length`);
      p.forRange("i", 0, K, (D) => {
        o.subschema({
          keyword: n,
          dataProp: D,
          dataPropType: s.Type.Num
        }, l), p.if((0, e.not)(l), M);
      });
    }
  }
  te.validateArray = _;
  function y(o) {
    const { gen: p, schema: E, keyword: n, it: i } = o;
    if (!Array.isArray(E))
      throw new Error("ajv implementation error");
    if (E.some((K) => (0, s.alwaysValidSchema)(i, K)) && !i.opts.unevaluated)
      return;
    const q = p.let("valid", !1), M = p.name("_valid");
    p.block(() => E.forEach((K, D) => {
      const L = o.subschema({
        keyword: n,
        schemaProp: D,
        compositeRule: !0
      }, M);
      p.assign(q, (0, e._)`${q} || ${M}`), o.mergeValidEvaluated(L, M) || p.if((0, e.not)(q));
    })), o.result(q, () => o.reset(), () => o.error(!0));
  }
  return te.validateUnion = y, te;
}
var lr;
function Tn() {
  if (lr) return ye;
  lr = 1, Object.defineProperty(ye, "__esModule", { value: !0 }), ye.validateKeywordUsage = ye.validSchemaType = ye.funcKeywordCode = ye.macroKeywordCode = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Se(), w = /* @__PURE__ */ ve(), d = /* @__PURE__ */ Pt();
  function S(j, N) {
    const { gen: O, keyword: P, schema: _, parentSchema: y, it: o } = j, p = N.macro.call(o.self, _, y, o), E = $(O, P, p);
    o.opts.validateSchema !== !1 && o.self.validateSchema(p, !0);
    const n = O.name("valid");
    j.subschema({
      schema: p,
      schemaPath: e.nil,
      errSchemaPath: `${o.errSchemaPath}/${P}`,
      topSchemaRef: E,
      compositeRule: !0
    }, n), j.pass(n, () => j.error(!0));
  }
  ye.macroKeywordCode = S;
  function a(j, N) {
    var O;
    const { gen: P, keyword: _, schema: y, parentSchema: o, $data: p, it: E } = j;
    h(E, N);
    const n = !p && N.compile ? N.compile.call(E.self, y, o, E) : N.validate, i = $(P, _, n), l = P.let("valid");
    j.block$data(l, q), j.ok((O = N.valid) !== null && O !== void 0 ? O : l);
    function q() {
      if (N.errors === !1)
        D(), N.modifying && f(j), L(() => j.error());
      else {
        const H = N.async ? M() : K();
        N.modifying && f(j), L(() => c(j, H));
      }
    }
    function M() {
      const H = P.let("ruleErrs", null);
      return P.try(() => D((0, e._)`await `), (x) => P.assign(l, !1).if((0, e._)`${x} instanceof ${E.ValidationError}`, () => P.assign(H, (0, e._)`${x}.errors`), () => P.throw(x))), H;
    }
    function K() {
      const H = (0, e._)`${i}.errors`;
      return P.assign(H, null), D(e.nil), H;
    }
    function D(H = N.async ? (0, e._)`await ` : e.nil) {
      const x = E.opts.passContext ? s.default.this : s.default.self, Z = !("compile" in N && !p || N.schema === !1);
      P.assign(l, (0, e._)`${H}${(0, w.callValidateCode)(j, i, x, Z)}`, N.modifying);
    }
    function L(H) {
      var x;
      P.if((0, e.not)((x = N.valid) !== null && x !== void 0 ? x : l), H);
    }
  }
  ye.funcKeywordCode = a;
  function f(j) {
    const { gen: N, data: O, it: P } = j;
    N.if(P.parentData, () => N.assign(O, (0, e._)`${P.parentData}[${P.parentDataProperty}]`));
  }
  function c(j, N) {
    const { gen: O } = j;
    O.if((0, e._)`Array.isArray(${N})`, () => {
      O.assign(s.default.vErrors, (0, e._)`${s.default.vErrors} === null ? ${N} : ${s.default.vErrors}.concat(${N})`).assign(s.default.errors, (0, e._)`${s.default.vErrors}.length`), (0, d.extendErrors)(j);
    }, () => j.error());
  }
  function h({ schemaEnv: j }, N) {
    if (N.async && !j.$async)
      throw new Error("async keyword in sync schema");
  }
  function $(j, N, O) {
    if (O === void 0)
      throw new Error(`keyword "${N}" failed to compile`);
    return j.scopeValue("keyword", typeof O == "function" ? { ref: O } : { ref: O, code: (0, e.stringify)(O) });
  }
  function g(j, N, O = !1) {
    return !N.length || N.some((P) => P === "array" ? Array.isArray(j) : P === "object" ? j && typeof j == "object" && !Array.isArray(j) : typeof j == P || O && typeof j > "u");
  }
  ye.validSchemaType = g;
  function R({ schema: j, opts: N, self: O, errSchemaPath: P }, _, y) {
    if (Array.isArray(_.keyword) ? !_.keyword.includes(y) : _.keyword !== y)
      throw new Error("ajv implementation error");
    const o = _.dependencies;
    if (o?.some((p) => !Object.prototype.hasOwnProperty.call(j, p)))
      throw new Error(`parent schema must have dependencies of ${y}: ${o.join(",")}`);
    if (_.validateSchema && !_.validateSchema(j[y])) {
      const E = `keyword "${y}" value is invalid at path "${P}": ` + O.errorsText(_.validateSchema.errors);
      if (N.validateSchema === "log")
        O.logger.error(E);
      else
        throw new Error(E);
    }
  }
  return ye.validateKeywordUsage = R, ye;
}
var we = {}, dr;
function Cn() {
  if (dr) return we;
  dr = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.extendSubschemaMode = we.extendSubschemaData = we.getSubschema = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q();
  function w(a, { keyword: f, schemaProp: c, schema: h, schemaPath: $, errSchemaPath: g, topSchemaRef: R }) {
    if (f !== void 0 && h !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (f !== void 0) {
      const j = a.schema[f];
      return c === void 0 ? {
        schema: j,
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(f)}`,
        errSchemaPath: `${a.errSchemaPath}/${f}`
      } : {
        schema: j[c],
        schemaPath: (0, e._)`${a.schemaPath}${(0, e.getProperty)(f)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${a.errSchemaPath}/${f}/${(0, s.escapeFragment)(c)}`
      };
    }
    if (h !== void 0) {
      if ($ === void 0 || g === void 0 || R === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: h,
        schemaPath: $,
        topSchemaRef: R,
        errSchemaPath: g
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  we.getSubschema = w;
  function d(a, f, { dataProp: c, dataPropType: h, data: $, dataTypes: g, propertyName: R }) {
    if ($ !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: j } = f;
    if (c !== void 0) {
      const { errorPath: O, dataPathArr: P, opts: _ } = f, y = j.let("data", (0, e._)`${f.data}${(0, e.getProperty)(c)}`, !0);
      N(y), a.errorPath = (0, e.str)`${O}${(0, s.getErrorPath)(c, h, _.jsPropertySyntax)}`, a.parentDataProperty = (0, e._)`${c}`, a.dataPathArr = [...P, a.parentDataProperty];
    }
    if ($ !== void 0) {
      const O = $ instanceof e.Name ? $ : j.let("data", $, !0);
      N(O), R !== void 0 && (a.propertyName = R);
    }
    g && (a.dataTypes = g);
    function N(O) {
      a.data = O, a.dataLevel = f.dataLevel + 1, a.dataTypes = [], f.definedProperties = /* @__PURE__ */ new Set(), a.parentData = f.data, a.dataNames = [...f.dataNames, O];
    }
  }
  we.extendSubschemaData = d;
  function S(a, { jtdDiscriminator: f, jtdMetadata: c, compositeRule: h, createErrors: $, allErrors: g }) {
    h !== void 0 && (a.compositeRule = h), $ !== void 0 && (a.createErrors = $), g !== void 0 && (a.allErrors = g), a.jtdDiscriminator = f, a.jtdMetadata = c;
  }
  return we.extendSubschemaMode = S, we;
}
var fe = {}, Ft, fr;
function gn() {
  return fr || (fr = 1, Ft = function e(s, w) {
    if (s === w) return !0;
    if (s && w && typeof s == "object" && typeof w == "object") {
      if (s.constructor !== w.constructor) return !1;
      var d, S, a;
      if (Array.isArray(s)) {
        if (d = s.length, d != w.length) return !1;
        for (S = d; S-- !== 0; )
          if (!e(s[S], w[S])) return !1;
        return !0;
      }
      if (s.constructor === RegExp) return s.source === w.source && s.flags === w.flags;
      if (s.valueOf !== Object.prototype.valueOf) return s.valueOf() === w.valueOf();
      if (s.toString !== Object.prototype.toString) return s.toString() === w.toString();
      if (a = Object.keys(s), d = a.length, d !== Object.keys(w).length) return !1;
      for (S = d; S-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(w, a[S])) return !1;
      for (S = d; S-- !== 0; ) {
        var f = a[S];
        if (!e(s[f], w[f])) return !1;
      }
      return !0;
    }
    return s !== s && w !== w;
  }), Ft;
}
var zt = { exports: {} }, hr;
function qn() {
  if (hr) return zt.exports;
  hr = 1;
  var e = zt.exports = function(d, S, a) {
    typeof S == "function" && (a = S, S = {}), a = S.cb || a;
    var f = typeof a == "function" ? a : a.pre || function() {
    }, c = a.post || function() {
    };
    s(S, f, c, d, "", d);
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
  function s(d, S, a, f, c, h, $, g, R, j) {
    if (f && typeof f == "object" && !Array.isArray(f)) {
      S(f, c, h, $, g, R, j);
      for (var N in f) {
        var O = f[N];
        if (Array.isArray(O)) {
          if (N in e.arrayKeywords)
            for (var P = 0; P < O.length; P++)
              s(d, S, a, O[P], c + "/" + N + "/" + P, h, c, N, f, P);
        } else if (N in e.propsKeywords) {
          if (O && typeof O == "object")
            for (var _ in O)
              s(d, S, a, O[_], c + "/" + N + "/" + w(_), h, c, N, f, _);
        } else (N in e.keywords || d.allKeys && !(N in e.skipKeywords)) && s(d, S, a, O, c + "/" + N, h, c, N, f);
      }
      a(f, c, h, $, g, R, j);
    }
  }
  function w(d) {
    return d.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return zt.exports;
}
var mr;
function Rt() {
  if (mr) return fe;
  mr = 1, Object.defineProperty(fe, "__esModule", { value: !0 }), fe.getSchemaRefs = fe.resolveUrl = fe.normalizeId = fe._getFullPath = fe.getFullPath = fe.inlineRef = void 0;
  const e = /* @__PURE__ */ Q(), s = gn(), w = qn(), d = /* @__PURE__ */ new Set([
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
  function S(P, _ = !0) {
    return typeof P == "boolean" ? !0 : _ === !0 ? !f(P) : _ ? c(P) <= _ : !1;
  }
  fe.inlineRef = S;
  const a = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function f(P) {
    for (const _ in P) {
      if (a.has(_))
        return !0;
      const y = P[_];
      if (Array.isArray(y) && y.some(f) || typeof y == "object" && f(y))
        return !0;
    }
    return !1;
  }
  function c(P) {
    let _ = 0;
    for (const y in P) {
      if (y === "$ref")
        return 1 / 0;
      if (_++, !d.has(y) && (typeof P[y] == "object" && (0, e.eachItem)(P[y], (o) => _ += c(o)), _ === 1 / 0))
        return 1 / 0;
    }
    return _;
  }
  function h(P, _ = "", y) {
    y !== !1 && (_ = R(_));
    const o = P.parse(_);
    return $(P, o);
  }
  fe.getFullPath = h;
  function $(P, _) {
    return P.serialize(_).split("#")[0] + "#";
  }
  fe._getFullPath = $;
  const g = /#\/?$/;
  function R(P) {
    return P ? P.replace(g, "") : "";
  }
  fe.normalizeId = R;
  function j(P, _, y) {
    return y = R(y), P.resolve(_, y);
  }
  fe.resolveUrl = j;
  const N = /^[a-z_][-a-z0-9._]*$/i;
  function O(P, _) {
    if (typeof P == "boolean")
      return {};
    const { schemaId: y, uriResolver: o } = this.opts, p = R(P[y] || _), E = { "": p }, n = h(o, p, !1), i = {}, l = /* @__PURE__ */ new Set();
    return w(P, { allKeys: !0 }, (K, D, L, H) => {
      if (H === void 0)
        return;
      const x = n + D;
      let Z = E[H];
      typeof K[y] == "string" && (Z = ie.call(this, K[y])), oe.call(this, K.$anchor), oe.call(this, K.$dynamicAnchor), E[D] = Z;
      function ie(Y) {
        const ue = this.opts.uriResolver.resolve;
        if (Y = R(Z ? ue(Z, Y) : Y), l.has(Y))
          throw M(Y);
        l.add(Y);
        let z = this.refs[Y];
        return typeof z == "string" && (z = this.refs[z]), typeof z == "object" ? q(K, z.schema, Y) : Y !== R(x) && (Y[0] === "#" ? (q(K, i[Y], Y), i[Y] = K) : this.refs[Y] = x), Y;
      }
      function oe(Y) {
        if (typeof Y == "string") {
          if (!N.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          ie.call(this, `#${Y}`);
        }
      }
    }), i;
    function q(K, D, L) {
      if (D !== void 0 && !s(K, D))
        throw M(L);
    }
    function M(K) {
      return new Error(`reference "${K}" resolves to more than one schema`);
    }
  }
  return fe.getSchemaRefs = O, fe;
}
var pr;
function Nt() {
  if (pr) return _e;
  pr = 1, Object.defineProperty(_e, "__esModule", { value: !0 }), _e.getData = _e.KeywordCxt = _e.validateFunctionCode = void 0;
  const e = /* @__PURE__ */ In(), s = /* @__PURE__ */ St(), w = /* @__PURE__ */ vn(), d = /* @__PURE__ */ St(), S = /* @__PURE__ */ jn(), a = /* @__PURE__ */ Tn(), f = /* @__PURE__ */ Cn(), c = /* @__PURE__ */ W(), h = /* @__PURE__ */ Se(), $ = /* @__PURE__ */ Rt(), g = /* @__PURE__ */ Q(), R = /* @__PURE__ */ Pt();
  function j(k) {
    if (n(k) && (l(k), E(k))) {
      _(k);
      return;
    }
    N(k, () => (0, e.topBoolOrEmptySchema)(k));
  }
  _e.validateFunctionCode = j;
  function N({ gen: k, validateName: C, schema: A, schemaEnv: V, opts: U }, J) {
    U.code.es5 ? k.func(C, (0, c._)`${h.default.data}, ${h.default.valCxt}`, V.$async, () => {
      k.code((0, c._)`"use strict"; ${o(A, U)}`), P(k, U), k.code(J);
    }) : k.func(C, (0, c._)`${h.default.data}, ${O(U)}`, V.$async, () => k.code(o(A, U)).code(J));
  }
  function O(k) {
    return (0, c._)`{${h.default.instancePath}="", ${h.default.parentData}, ${h.default.parentDataProperty}, ${h.default.rootData}=${h.default.data}${k.dynamicRef ? (0, c._)`, ${h.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function P(k, C) {
    k.if(h.default.valCxt, () => {
      k.var(h.default.instancePath, (0, c._)`${h.default.valCxt}.${h.default.instancePath}`), k.var(h.default.parentData, (0, c._)`${h.default.valCxt}.${h.default.parentData}`), k.var(h.default.parentDataProperty, (0, c._)`${h.default.valCxt}.${h.default.parentDataProperty}`), k.var(h.default.rootData, (0, c._)`${h.default.valCxt}.${h.default.rootData}`), C.dynamicRef && k.var(h.default.dynamicAnchors, (0, c._)`${h.default.valCxt}.${h.default.dynamicAnchors}`);
    }, () => {
      k.var(h.default.instancePath, (0, c._)`""`), k.var(h.default.parentData, (0, c._)`undefined`), k.var(h.default.parentDataProperty, (0, c._)`undefined`), k.var(h.default.rootData, h.default.data), C.dynamicRef && k.var(h.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function _(k) {
    const { schema: C, opts: A, gen: V } = k;
    N(k, () => {
      A.$comment && C.$comment && H(k), K(k), V.let(h.default.vErrors, null), V.let(h.default.errors, 0), A.unevaluated && y(k), q(k), x(k);
    });
  }
  function y(k) {
    const { gen: C, validateName: A } = k;
    k.evaluated = C.const("evaluated", (0, c._)`${A}.evaluated`), C.if((0, c._)`${k.evaluated}.dynamicProps`, () => C.assign((0, c._)`${k.evaluated}.props`, (0, c._)`undefined`)), C.if((0, c._)`${k.evaluated}.dynamicItems`, () => C.assign((0, c._)`${k.evaluated}.items`, (0, c._)`undefined`));
  }
  function o(k, C) {
    const A = typeof k == "object" && k[C.schemaId];
    return A && (C.code.source || C.code.process) ? (0, c._)`/*# sourceURL=${A} */` : c.nil;
  }
  function p(k, C) {
    if (n(k) && (l(k), E(k))) {
      i(k, C);
      return;
    }
    (0, e.boolOrEmptySchema)(k, C);
  }
  function E({ schema: k, self: C }) {
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
    const A = (0, s.getSchemaTypes)(k.schema), V = (0, s.coerceAndCheckDataType)(k, A);
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
    C && (k.baseId = (0, $.resolveUrl)(k.opts.uriResolver, k.baseId, C));
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
    const { gen: U, schema: J, data: ne, allErrors: re, opts: se, self: ee } = k, { RULES: X } = ee;
    if (J.$ref && (se.ignoreKeywordsWithRef || !(0, g.schemaHasRulesButRef)(J, X))) {
      U.block(() => T(k, "$ref", X.all.$ref.definition));
      return;
    }
    se.jtd || Y(k, C), U.block(() => {
      for (const ae of X.rules)
        pe(ae);
      pe(X.post);
    });
    function pe(ae) {
      (0, w.shouldUseGroup)(J, ae) && (ae.type ? (U.if((0, d.checkDataType)(ae.type, ne, se.strictNumbers)), oe(k, ae), C.length === 1 && C[0] === ae.type && A && (U.else(), (0, d.reportTypeError)(k)), U.endIf()) : oe(k, ae), re || U.if((0, c._)`${h.default.errors} === ${V || 0}`));
    }
  }
  function oe(k, C) {
    const { gen: A, schema: V, opts: { useDefaults: U } } = k;
    U && (0, S.assignDefaults)(k, C.type), A.block(() => {
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
  class v {
    constructor(C, A, V) {
      if ((0, a.validateKeywordUsage)(C, A, V), this.gen = C.gen, this.allErrors = C.allErrors, this.keyword = V, this.data = C.data, this.schema = C.schema[V], this.$data = A.$data && C.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, g.schemaRefOrVal)(C, this.schema, V, this.$data), this.schemaType = A.schemaType, this.parentSchema = C.schema, this.params = {}, this.it = C, this.def = A, this.$data)
        this.schemaCode = C.gen.const("vSchema", G(this.$data, C));
      else if (this.schemaCode = this.schemaValue, !(0, a.validSchemaType)(this.schema, A.schemaType, A.allowUndefined))
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
      (C ? R.reportExtraError : R.reportError)(this, this.def.error, A);
    }
    $dataError() {
      (0, R.reportError)(this, this.def.$dataError || R.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, R.resetErrorsCount)(this.gen, this.errsCount);
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
          const se = Array.isArray(V) ? V : [V];
          return (0, c._)`${(0, d.checkDataTypes)(se, A, J.opts.strictNumbers, d.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function re() {
        if (U.validateSchema) {
          const se = C.scopeValue("validate$data", { ref: U.validateSchema });
          return (0, c._)`!${se}(${A})`;
        }
        return c.nil;
      }
    }
    subschema(C, A) {
      const V = (0, f.getSubschema)(this.it, C);
      (0, f.extendSubschemaData)(V, this.it, C), (0, f.extendSubschemaMode)(V, C);
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
  _e.KeywordCxt = v;
  function T(k, C, A, V) {
    const U = new v(k, A, C);
    "code" in A ? A.code(U, V) : U.$data && A.validate ? (0, a.funcKeywordCode)(U, A) : "macro" in A ? (0, a.macroKeywordCode)(U, A) : (A.compile || A.validate) && (0, a.funcKeywordCode)(U, A);
  }
  const I = /^\/(?:[^~]|~0|~1)*$/, F = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function G(k, { dataLevel: C, dataNames: A, dataPathArr: V }) {
    let U, J;
    if (k === "")
      return h.default.rootData;
    if (k[0] === "/") {
      if (!I.test(k))
        throw new Error(`Invalid JSON-pointer: ${k}`);
      U = k, J = h.default.rootData;
    } else {
      const ee = F.exec(k);
      if (!ee)
        throw new Error(`Invalid JSON-pointer: ${k}`);
      const X = +ee[1];
      if (U = ee[2], U === "#") {
        if (X >= C)
          throw new Error(se("property/index", X));
        return V[C - X];
      }
      if (X > C)
        throw new Error(se("data", X));
      if (J = A[C - X], !U)
        return J;
    }
    let ne = J;
    const re = U.split("/");
    for (const ee of re)
      ee && (J = (0, c._)`${J}${(0, c.getProperty)((0, g.unescapeJsonPointer)(ee))}`, ne = (0, c._)`${ne} && ${J}`);
    return ne;
    function se(ee, X) {
      return `Cannot access ${ee} ${X} levels up, current level is ${C}`;
    }
  }
  return _e.getData = G, _e;
}
var Ve = {}, yr;
function xt() {
  if (yr) return Ve;
  yr = 1, Object.defineProperty(Ve, "__esModule", { value: !0 });
  class e extends Error {
    constructor(w) {
      super("validation failed"), this.errors = w, this.ajv = this.validation = !0;
    }
  }
  return Ve.default = e, Ve;
}
var Ue = {}, vr;
function Ot() {
  if (vr) return Ue;
  vr = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Rt();
  class s extends Error {
    constructor(d, S, a, f) {
      super(f || `can't resolve reference ${a} from id ${S}`), this.missingRef = (0, e.resolveUrl)(d, S, a), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(d, this.missingRef));
    }
  }
  return Ue.default = s, Ue;
}
var he = {}, gr;
function Gt() {
  if (gr) return he;
  gr = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.resolveSchema = he.getCompilingSchema = he.resolveRef = he.compileSchema = he.SchemaEnv = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ xt(), w = /* @__PURE__ */ Se(), d = /* @__PURE__ */ Rt(), S = /* @__PURE__ */ Q(), a = /* @__PURE__ */ Nt();
  class f {
    constructor(y) {
      var o;
      this.refs = {}, this.dynamicAnchors = {};
      let p;
      typeof y.schema == "object" && (p = y.schema), this.schema = y.schema, this.schemaId = y.schemaId, this.root = y.root || this, this.baseId = (o = y.baseId) !== null && o !== void 0 ? o : (0, d.normalizeId)(p?.[y.schemaId || "$id"]), this.schemaPath = y.schemaPath, this.localRefs = y.localRefs, this.meta = y.meta, this.$async = p?.$async, this.refs = {};
    }
  }
  he.SchemaEnv = f;
  function c(_) {
    const y = g.call(this, _);
    if (y)
      return y;
    const o = (0, d.getFullPath)(this.opts.uriResolver, _.root.baseId), { es5: p, lines: E } = this.opts.code, { ownProperties: n } = this.opts, i = new e.CodeGen(this.scope, { es5: p, lines: E, ownProperties: n });
    let l;
    _.$async && (l = i.scopeValue("Error", {
      ref: s.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const q = i.scopeName("validate");
    _.validateName = q;
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
      topSchemaRef: i.scopeValue("schema", this.opts.code.source === !0 ? { ref: _.schema, code: (0, e.stringify)(_.schema) } : { ref: _.schema }),
      validateName: q,
      ValidationError: l,
      schema: _.schema,
      schemaEnv: _,
      rootId: o,
      baseId: _.baseId || o,
      schemaPath: e.nil,
      errSchemaPath: _.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let K;
    try {
      this._compilations.add(_), (0, a.validateFunctionCode)(M), i.optimize(this.opts.code.optimize);
      const D = i.toString();
      K = `${i.scopeRefs(w.default.scope)}return ${D}`, this.opts.code.process && (K = this.opts.code.process(K, _));
      const H = new Function(`${w.default.self}`, `${w.default.scope}`, K)(this, this.scope.get());
      if (this.scope.value(q, { ref: H }), H.errors = null, H.schema = _.schema, H.schemaEnv = _, _.$async && (H.$async = !0), this.opts.code.source === !0 && (H.source = { validateName: q, validateCode: D, scopeValues: i._values }), this.opts.unevaluated) {
        const { props: x, items: Z } = M;
        H.evaluated = {
          props: x instanceof e.Name ? void 0 : x,
          items: Z instanceof e.Name ? void 0 : Z,
          dynamicProps: x instanceof e.Name,
          dynamicItems: Z instanceof e.Name
        }, H.source && (H.source.evaluated = (0, e.stringify)(H.evaluated));
      }
      return _.validate = H, _;
    } catch (D) {
      throw delete _.validate, delete _.validateName, K && this.logger.error("Error compiling schema, function code:", K), D;
    } finally {
      this._compilations.delete(_);
    }
  }
  he.compileSchema = c;
  function h(_, y, o) {
    var p;
    o = (0, d.resolveUrl)(this.opts.uriResolver, y, o);
    const E = _.refs[o];
    if (E)
      return E;
    let n = j.call(this, _, o);
    if (n === void 0) {
      const i = (p = _.localRefs) === null || p === void 0 ? void 0 : p[o], { schemaId: l } = this.opts;
      i && (n = new f({ schema: i, schemaId: l, root: _, baseId: y }));
    }
    if (n !== void 0)
      return _.refs[o] = $.call(this, n);
  }
  he.resolveRef = h;
  function $(_) {
    return (0, d.inlineRef)(_.schema, this.opts.inlineRefs) ? _.schema : _.validate ? _ : c.call(this, _);
  }
  function g(_) {
    for (const y of this._compilations)
      if (R(y, _))
        return y;
  }
  he.getCompilingSchema = g;
  function R(_, y) {
    return _.schema === y.schema && _.root === y.root && _.baseId === y.baseId;
  }
  function j(_, y) {
    let o;
    for (; typeof (o = this.refs[y]) == "string"; )
      y = o;
    return o || this.schemas[y] || N.call(this, _, y);
  }
  function N(_, y) {
    const o = this.opts.uriResolver.parse(y), p = (0, d._getFullPath)(this.opts.uriResolver, o);
    let E = (0, d.getFullPath)(this.opts.uriResolver, _.baseId, void 0);
    if (Object.keys(_.schema).length > 0 && p === E)
      return P.call(this, o, _);
    const n = (0, d.normalizeId)(p), i = this.refs[n] || this.schemas[n];
    if (typeof i == "string") {
      const l = N.call(this, _, i);
      return typeof l?.schema != "object" ? void 0 : P.call(this, o, l);
    }
    if (typeof i?.schema == "object") {
      if (i.validate || c.call(this, i), n === (0, d.normalizeId)(y)) {
        const { schema: l } = i, { schemaId: q } = this.opts, M = l[q];
        return M && (E = (0, d.resolveUrl)(this.opts.uriResolver, E, M)), new f({ schema: l, schemaId: q, root: _, baseId: E });
      }
      return P.call(this, o, i);
    }
  }
  he.resolveSchema = N;
  const O = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function P(_, { baseId: y, schema: o, root: p }) {
    var E;
    if (((E = _.fragment) === null || E === void 0 ? void 0 : E[0]) !== "/")
      return;
    for (const l of _.fragment.slice(1).split("/")) {
      if (typeof o == "boolean")
        return;
      const q = o[(0, S.unescapeFragment)(l)];
      if (q === void 0)
        return;
      o = q;
      const M = typeof o == "object" && o[this.opts.schemaId];
      !O.has(l) && M && (y = (0, d.resolveUrl)(this.opts.uriResolver, y, M));
    }
    let n;
    if (typeof o != "boolean" && o.$ref && !(0, S.schemaHasRulesButRef)(o, this.RULES)) {
      const l = (0, d.resolveUrl)(this.opts.uriResolver, y, o.$ref);
      n = N.call(this, p, l);
    }
    const { schemaId: i } = this.opts;
    if (n = n || new f({ schema: o, schemaId: i, root: p, baseId: y }), n.schema !== n.root.schema)
      return n;
  }
  return he;
}
const An = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Dn = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Mn = "object", Fn = ["$data"], zn = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Vn = !1, Un = {
  $id: An,
  description: Dn,
  type: Mn,
  required: Fn,
  properties: zn,
  additionalProperties: Vn
};
var Le = {}, qe = { exports: {} }, Vt, _r;
function _n() {
  if (_r) return Vt;
  _r = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), s = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), w = RegExp.prototype.test.bind(/^\d*$/u), d = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), S = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), a = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u), f = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u), c = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u), h = new Array(256);
  {
    const u = "0123456789ABCDEF";
    for (let b = 0; b < 256; b++)
      h[b] = "%" + u[b >> 4] + u[b & 15];
  }
  function $(u) {
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
  const R = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/), j = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/), N = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/), O = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function P(u) {
    if (u.length === 0) return !1;
    for (let b = 0; b < u.length; b++)
      if (!N(u[b])) {
        if (u[b] === "%" && b + 2 < u.length && d(u.slice(b + 1, b + 3))) {
          b += 2;
          continue;
        }
        return !1;
      }
    return !0;
  }
  function _(u) {
    let b = -1, m = 0, t = -1, r = 0;
    for (let I = 0; I < u.length; I++)
      u[I] === "0" ? (t === -1 && (t = I), r++, r > m && (m = r, b = t)) : (t = -1, r = 0);
    if (m < 2) return u.join(":");
    const v = u.slice(0, b).join(":"), T = u.slice(b + m).join(":");
    return v + "::" + T;
  }
  function y(u) {
    const b = u.indexOf("::");
    if (b !== -1 && u.indexOf("::", b + 1) !== -1) return;
    const m = b === -1 ? u.split(":") : u.slice(0, b).split(":"), t = b === -1 ? [] : u.slice(b + 2).split(":");
    b !== -1 && (m.length === 1 && m[0] === "" && (m.length = 0), t.length === 1 && t[0] === "" && (t.length = 0));
    const r = m.concat(t);
    let v = 0;
    for (let I = 0; I < r.length; I++) {
      const F = r[I];
      if (F === "") return;
      if (F.indexOf(".") !== -1) {
        if (I !== r.length - 1 || b !== -1 && t.length === 0 || !s(F)) return;
        v += 2;
        continue;
      }
      if (!R(F)) return;
      r[I] = parseInt(F, 16).toString(16), v++;
    }
    if (b === -1)
      return v !== 8 ? void 0 : _(r);
    if (v >= 8) return;
    const T = r.slice(0, m.length);
    for (let I = v; I < 8; I++) T.push("0");
    for (let I = m.length; I < r.length; I++) T.push(r[I]);
    return _(T);
  }
  function o(u) {
    const b = u[0] === "[" && u[u.length - 1] === "]";
    if ((u[0] === "[" || u[u.length - 1] === "]") && !b) return { host: u, isIPV6: !1, error: !0 };
    let t = b ? u.slice(1, -1) : u;
    if (b && j(t))
      return t = t.toLowerCase(), { host: `[${t}]`, escapedHost: t, isIPV6: !1, isIPVFuture: !0 };
    if (p(t, ":") < 2)
      return { host: u, isIPV6: !1, error: b };
    let r = "";
    const v = t.indexOf("%");
    if (v !== -1) {
      const I = t.slice(v, v + 3).toLowerCase() === "%25" ? 3 : 1;
      if (r = t.slice(v + I), !P(r)) return { host: u, isIPV6: !1, error: !0 };
      t = t.slice(0, v);
    }
    const T = y(t);
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
  function E(u) {
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
      return E(u);
    const b = u.split("/"), m = b.length - 1, t = [];
    let r = !1;
    for (let v = 0; v <= m; v++) {
      const T = b[v];
      T === "." || T === ".." ? (T === ".." && (t.length !== 0 && t[t.length - 1] !== ".." ? t.pop() : t.push("..")), r = v === m) : t.push(T);
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
        if (d(r)) {
          const v = r.toUpperCase(), T = String.fromCharCode(parseInt(v, 16));
          b && S(T) ? m += T : m += "%" + v, t += 2;
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
        if (d(r)) {
          const v = r.toUpperCase(), T = String.fromCharCode(parseInt(v, 16));
          T !== "." && S(T) ? b += T : b += "%" + v, m += 2;
          continue;
        }
      }
      if (a(t))
        b += t;
      else {
        const r = u.charCodeAt(m);
        if (r < 128)
          b += oe(r) ? t : h[r];
        else if (r < 55296 || r > 57343)
          b += $(r);
        else if (r <= 56319 && m + 1 < u.length) {
          const v = u.charCodeAt(m + 1);
          v >= 56320 && v <= 57343 ? (b += $(65536 + (r - 55296 << 10) + (v - 56320)), m++) : b += $(65533);
        } else
          b += $(65533);
      }
    }
    return b;
  }
  function L(u, b = !1) {
    let m = "", t = b && u[0] !== "/";
    for (let r = 0; r < u.length; r++) {
      const v = u[r];
      if (v === "%" && r + 2 < u.length) {
        const T = u.slice(r + 1, r + 3);
        if (d(T)) {
          m += "%" + T.toUpperCase(), r += 2;
          continue;
        }
      }
      if (v === "/" && (t = !1), a(v) && (v !== ":" || !t))
        m += v;
      else {
        const T = u.charCodeAt(r);
        if (T < 128)
          m += h[T];
        else if (T < 55296 || T > 57343)
          m += $(T);
        else if (T <= 56319 && r + 1 < u.length) {
          const I = u.charCodeAt(r + 1);
          I >= 56320 && I <= 57343 ? (m += $(65536 + (T - 55296 << 10) + (I - 56320)), r++) : m += $(65533);
        } else
          m += $(65533);
      }
    }
    return m;
  }
  function H(u, b) {
    let m = "";
    for (let t = 0; t < u.length; t++) {
      const r = u[t];
      if (r === "%" && t + 2 < u.length) {
        const v = u.slice(t + 1, t + 3);
        if (d(v)) {
          m += "%" + v.toUpperCase(), t += 2;
          continue;
        }
      }
      if (b(r))
        m += r;
      else {
        const v = u.charCodeAt(t);
        if (v < 128)
          m += h[v];
        else if (v < 55296 || v > 57343)
          m += $(v);
        else if (v <= 56319 && t + 1 < u.length) {
          const T = u.charCodeAt(t + 1);
          T >= 56320 && T <= 57343 ? (m += $(65536 + (v - 55296 << 10) + (T - 56320)), t++) : m += $(65533);
        } else
          m += $(65533);
      }
    }
    return m;
  }
  function x(u) {
    return H(u, c);
  }
  function Z(u) {
    return H(u, f);
  }
  function ie(u) {
    return H(u, f);
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
        if (d(r)) {
          const v = r.toUpperCase(), T = String.fromCharCode(parseInt(v, 16));
          S(T) ? b += T : b += "%" + v, m += 2;
          continue;
        }
      }
      if (f(t))
        b += t;
      else {
        const r = u.charCodeAt(m);
        if (r < 128)
          b += oe(r) ? t : h[r];
        else if (r < 55296 || r > 57343)
          b += $(r);
        else if (r <= 56319 && m + 1 < u.length) {
          const v = u.charCodeAt(m + 1);
          v >= 56320 && v <= 57343 ? (b += $(65536 + (r - 55296 << 10) + (v - 56320)), m++) : b += $(65533);
        } else
          b += $(65533);
      }
    }
    return b;
  }
  function ue(u) {
    let b = "";
    for (let m = 0; m < u.length; m++) {
      if (u[m] === "%" && m + 2 < u.length) {
        const t = u.slice(m + 1, m + 3);
        if (d(t)) {
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
      if (!s(m)) {
        let t = o(m);
        t.isIPV6 !== !0 && t.isIPVFuture !== !0 && (m = K(m, !0), t = o(m)), t.isIPV6 === !0 || t.isIPVFuture === !0 ? m = `[${t.escapedHost}]` : m = M(m, !1);
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
  return Vt = {
    nonSimpleDomain: O,
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
    removeDotSegments: E,
    removeDotSegmentsRelative: n,
    isIPv4: s,
    isUUID: e,
    normalizeIPv6: o,
    stringArrayToHexStripped: g
  }, Vt;
}
var Ut, $r;
function Ln() {
  if ($r) return Ut;
  $r = 1;
  const { isUUID: e } = _n(), s = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu, w = (
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
  function d(n) {
    return w.indexOf(
      /** @type {*} */
      n
    ) !== -1;
  }
  function S(n) {
    return n.secure === !0 ? !0 : n.secure === !1 ? !1 : n.scheme ? n.scheme.length === 3 && (n.scheme[0] === "w" || n.scheme[0] === "W") && (n.scheme[1] === "s" || n.scheme[1] === "S") && (n.scheme[2] === "s" || n.scheme[2] === "S") : !1;
  }
  function a(n) {
    return n.host || (n.error = n.error || "HTTP URIs must have a host."), n;
  }
  function f(n) {
    const i = String(n.scheme).toLowerCase() === "https";
    return (n.port === (i ? 443 : 80) || n.port === "") && (n.port = void 0), n.path || (n.path = "/"), n;
  }
  function c(n) {
    return n.secure = S(n), n.resourceName = (n.path || "/") + (n.query ? "?" + n.query : ""), n.path = void 0, n.query = void 0, n;
  }
  function h(n) {
    if ((n.port === (S(n) ? 443 : 80) || n.port === "") && (n.port = void 0), typeof n.secure == "boolean" && (n.scheme = n.secure ? "wss" : "ws", n.secure = void 0), n.resourceName) {
      const i = n.resourceName.indexOf("?"), l = i === -1 ? n.resourceName : n.resourceName.slice(0, i);
      n.path = l && l !== "/" ? l : void 0, n.query = i === -1 ? void 0 : n.resourceName.slice(i + 1), n.resourceName = void 0;
    }
    return n.fragment = void 0, n;
  }
  function $(n, i) {
    if (!n.path)
      return n.error = "URN can not be parsed", n;
    const l = n.path.match(s);
    if (l && l[0] === n.path) {
      const q = i.scheme || n.scheme || "urn";
      n.nid = l[1].toLowerCase(), n.nss = l[2];
      const M = `${q}:${i.nid || n.nid}`, K = E(M);
      n.path = void 0, K && (n = K.parse(n, i));
    } else
      n.error = n.error || "URN can not be parsed.";
    return n;
  }
  function g(n, i) {
    if (n.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const l = i.scheme || n.scheme || "urn", q = n.nid.toLowerCase(), M = `${l}:${i.nid || q}`, K = E(M);
    K && (n = K.serialize(n, i));
    const D = n, L = n.nss;
    return D.path = `${q || i.nid}:${L}`, i.skipEscape = !0, D;
  }
  function R(n, i) {
    const l = n;
    return l.uuid = l.nss, l.nss = void 0, !i.tolerant && (!l.uuid || !e(l.uuid)) && (l.error = l.error || "UUID is not valid."), l;
  }
  function j(n) {
    const i = n;
    return i.nss = (n.uuid || "").toLowerCase(), i;
  }
  const N = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: a,
      serialize: f
    }
  ), O = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: N.domainHost,
      parse: a,
      serialize: f
    }
  ), P = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: c,
      serialize: h
    }
  ), _ = (
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
      http: N,
      https: O,
      ws: P,
      wss: _,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: $,
          serialize: g,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: R,
          serialize: j,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(p, null);
  function E(n) {
    return n && (p[
      /** @type {SchemeName} */
      n
    ] || p[
      /** @type {SchemeName} */
      n.toLowerCase()
    ]) || void 0;
  }
  return Ut = {
    wsIsSecure: S,
    SCHEMES: p,
    isValidSchemeName: d,
    getSchemeHandler: E
  }, Ut;
}
var wr;
function Kn() {
  if (wr) return qe.exports;
  wr = 1;
  const { normalizeIPv6: e, removeDotSegments: s, removeDotSegmentsRelative: w, recomposeAuthority: d, normalizePercentEncoding: S, normalizePathEncoding: a, serializePathEncoding: f, normalizeQueryFragmentEncoding: c, encodeQuery: h, encodeFragment: $, reescapeHostDelimiters: g, isIPv4: R, nonSimpleDomain: j } = _n(), { SCHEMES: N, getSchemeHandler: O } = Ln(), P = /^[A-Za-z][A-Za-z0-9+.-]*$/u, _ = "URI scheme is malformed.", y = "URI host is malformed.", o = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
  function p(r) {
    const v = String(r);
    if (!P.test(v))
      throw new TypeError(_);
    return v;
  }
  function E(r, v) {
    return typeof r == "string" ? r = /** @type {T} */
    u(r, v) : typeof r == "object" && (r = /** @type {T} */
    z(q(r, v), v)), r;
  }
  function n(r, v, T) {
    const I = T ? Object.assign({ scheme: "null" }, T) : { scheme: "null" }, {
      parsed: F,
      malformedAuthorityOrPort: G,
      malformedPercentEncoding: k,
      malformedSchemeSpecific: C,
      malformedHost: A,
      malformedScheme: V
    } = ue(r, I), {
      parsed: U,
      malformedAuthorityOrPort: J,
      malformedPercentEncoding: ne,
      malformedSchemeSpecific: re,
      malformedHost: se,
      malformedScheme: ee
    } = ue(v, I);
    if (G || J || k || ne || C || re || A || se || V || ee)
      throw new Error(F.error || U.error || "URI is malformed.");
    const X = i(F, U, I, !0), pe = O(T && T.scheme || X.scheme), ae = X.host, me = ae !== void 0 && ae !== "" && (R(ae) || e(ae).isIPV6);
    if (oe(X, T || {}, pe, me))
      throw new Error(y);
    ie(X, T || {}, pe, me);
    const Ie = ae && ae.indexOf("%") !== -1 && !/\P{ASCII}/u.test(ae);
    if (X.error && !Ie)
      throw new Error(X.error);
    return I.skipEscape = !0, q(X, I);
  }
  function i(r, v, T, I) {
    const F = {};
    if (I || (r = z(q(r, T), T), v = z(q(v, T), T)), T = T || {}, !T.tolerant && v.scheme)
      F.scheme = v.scheme, F.userinfo = v.userinfo, F.host = v.host, F.port = v.port, F.path = s(v.path || ""), F.query = v.query;
    else {
      if (v.userinfo !== void 0 || v.host !== void 0 || v.port !== void 0)
        F.userinfo = v.userinfo, F.host = v.host, F.port = v.port, F.path = s(v.path || ""), F.query = v.query;
      else {
        if (!v.path)
          F.path = r.path, v.query !== void 0 ? F.query = v.query : F.query = r.query;
        else {
          if (v.path[0] === "/")
            F.path = s(v.path);
          else {
            const G = r.userinfo !== void 0 || r.host !== void 0 || r.port !== void 0;
            G && !r.path ? F.path = "/" + v.path : r.path ? F.path = r.path.slice(0, r.path.lastIndexOf("/") + 1) + v.path : F.path = v.path, F.path = r.scheme === void 0 && !G && F.path[0] !== "/" ? w(F.path) : s(F.path);
          }
          F.query = v.query;
        }
        F.userinfo = r.userinfo, F.host = r.host, F.port = r.port;
      }
      F.scheme = r.scheme;
    }
    return F.fragment = v.fragment, F;
  }
  function l(r, v, T) {
    const I = m(r, T), F = m(v, T);
    return I !== void 0 && F !== void 0 && I === F;
  }
  function q(r, v) {
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
    }, I = Object.assign({}, v), F = [];
    T.scheme && (T.scheme = p(T.scheme));
    const G = O(I.scheme || T.scheme);
    G && G.serialize && G.serialize(T, I);
    const k = T.userinfo !== void 0 || T.host !== void 0 || T.port !== void 0, C = (T.scheme === void 0 || I.reference === "suffix") && !k, A = !I.skipEscape && C;
    T.path !== void 0 && (I.skipEscape ? T.path = S(T.path) : T.path = f(T.path, A)), I.reference !== "suffix" && T.scheme && (T.scheme = p(T.scheme), F.push(T.scheme, ":"));
    const V = d(T);
    if (V !== void 0 && (I.reference !== "suffix" && F.push("//"), F.push(V), T.path && T.path[0] !== "/" && F.push("/")), T.path !== void 0) {
      let U = T.path;
      !I.absolutePath && (!G || !G.absolutePath) && (U = C && U[0] !== "/" ? w(U) : s(U)), C && (U = f(U, !0)), V === void 0 && U[0] === "/" && U[1] === "/" && (U = "/%2F" + U.slice(2)), F.push(U);
    }
    return T.query !== void 0 && F.push("?", h(T.query)), T.fragment !== void 0 && F.push("#", $(T.fragment)), F.join("");
  }
  const M = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u, K = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/, D = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
  function L(r, v) {
    if (v[2] !== void 0 && r.path && r.path[0] !== "/")
      return 'URI path must start with "/" when authority is present.';
    if (typeof r.port == "number" && (r.port < 0 || r.port > 65535))
      return "URI port is malformed.";
  }
  function H(r) {
    if (r === void 0) return !1;
    let v = r.indexOf("%");
    for (; v !== -1; ) {
      if (v + 2 >= r.length || !/^[\da-f]{2}$/iu.test(r.slice(v + 1, v + 3)))
        return !0;
      v = r.indexOf("%", v + 3);
    }
    return !1;
  }
  function x(r) {
    return r[0] === "[" && r[r.length - 1] === "]";
  }
  function Z(r) {
    const v = r[4];
    return H(r[3]) || v !== void 0 && !x(v) && H(v) || H(r[6]) || H(r[7]) || H(r[8]);
  }
  function ie(r, v, T, I) {
    if (oe(r, v, T, I))
      return r.error = r.error || y, !0;
    if (!v.unicodeSupport && (!T || !T.unicodeSupport) && r.host && !x(r.host) && (v.domainHost || T && T.domainHost) && I === !1 && j(r.host)) {
      let F;
      try {
        F = new URL("http://" + r.host);
      } catch (G) {
        return r.error = r.error || "Host's domain name can not be converted to ASCII: " + G, !0;
      }
      if (!Y(F))
        return r.error = r.error || y, !0;
      r.host = F.hostname;
    }
    return !1;
  }
  function oe(r, v, T, I) {
    return !!(r.host && I === !1 && !x(r.host) && (v.domainHost || T && T.domainHost) && o.test(r.host));
  }
  function Y(r) {
    return r.username === "" && r.password === "" && r.port === "" && r.pathname === "/" && r.search === "" && r.hash === "" && r.hostname !== "";
  }
  function ue(r, v) {
    const T = Object.assign({}, v), I = {
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
    J !== null && J[1].indexOf("\\") !== -1 && (I.error = "URI authority must not contain a literal backslash.", F = !0);
    const ne = r.match(D);
    if (ne !== null) {
      const se = ne[1], ee = se.replace(/[\t\n\r]/g, "");
      ee.length >= 2 && (ee.slice(0, 2) !== "//" ? (I.error = I.error || "URI authority must not contain a literal backslash.", F = !0) : se.length !== ee.length && (I.error = I.error || "URI authority introducer must not contain whitespace.", F = !0));
    }
    const re = r.match(M);
    if (re) {
      I.scheme = re[1], I.userinfo = re[3], I.host = re[4], I.port = parseInt(re[5], 10), I.path = re[6] || "", I.query = re[7], I.fragment = re[8], I.scheme !== void 0 && (P.test(I.scheme) ? I.scheme = I.scheme.toLowerCase() : (I.error = I.error || _, V = !0)), G = Z(re), G && (I.error = I.error || "URI contains malformed percent-encoding."), isNaN(I.port) && (I.port = re[5]);
      const se = L(I, re);
      if (se !== void 0 && (I.error = I.error || se, F = !0), I.host)
        if (R(I.host) === !1) {
          const pe = x(I.host), ae = I.host.indexOf("[") !== -1 || I.host.indexOf("]") !== -1, me = e(I.host);
          U = me.isIPV6 || me.isIPVFuture === !0, A = ae && (!pe || me.error === !0), I.host = U ? me.host : me.host.toLowerCase(), A && (I.error = I.error || y, F = !0);
        } else
          U = !0;
      I.scheme === void 0 && I.userinfo === void 0 && I.host === void 0 && I.port === void 0 && I.query === void 0 && !I.path ? I.reference = "same-document" : I.scheme === void 0 ? I.reference = "relative" : I.fragment === void 0 ? I.reference = "absolute" : I.reference = "uri", T.reference && T.reference !== "suffix" && T.reference !== I.reference && (I.error = I.error || "URI is not a " + T.reference + " reference.");
      const ee = O(T.scheme || I.scheme);
      if (A || (C = ie(I, T, ee, U)), r.indexOf("%") !== -1 && I.host !== void 0 && !A) {
        let X = U ? I.host : S(I.host, !0);
        U || (X = S(X.toLowerCase())), I.host = U || T.scheme !== "null" ? g(X, U) : X;
      }
      (!ee || ee && !ee.skipNormalize) && (I.path && (I.path = a(I.path)), I.query && (I.query = c(I.query)), I.fragment && (I.fragment = c(I.fragment))), ee && ee.parse && (ee.parse(I, T), ee === N.urn && I.nid === void 0 && (k = !0));
    } else
      I.error = I.error || "URI can not be parsed.";
    return { parsed: I, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: k, malformedHost: C, malformedScheme: V };
  }
  function z(r, v) {
    return ue(r, v).parsed;
  }
  function u(r, v) {
    return b(r, v).normalized;
  }
  function b(r, v) {
    const { parsed: T, malformedAuthorityOrPort: I, malformedPercentEncoding: F, malformedSchemeSpecific: G, malformedHost: k, malformedScheme: C } = ue(r, v);
    return {
      normalized: I || F || G || k || C ? r : q(T, v),
      malformedAuthorityOrPort: I,
      malformedPercentEncoding: F,
      malformedSchemeSpecific: G,
      malformedHost: k,
      malformedScheme: C
    };
  }
  function m(r, v) {
    if (typeof r != "string" && typeof r != "object")
      return;
    let T;
    try {
      T = typeof r == "string" ? r : q(r, v);
    } catch {
      return;
    }
    const { normalized: I, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: k, malformedHost: C, malformedScheme: A } = b(T, v);
    return F || G || k || C || A ? void 0 : I;
  }
  const t = {
    SCHEMES: N,
    normalize: E,
    resolve: n,
    resolveComponent: i,
    equal: l,
    serialize: q,
    parse: z
  };
  return qe.exports = t, qe.exports.default = t, qe.exports.fastUri = t, qe.exports;
}
var br;
function Hn() {
  if (br) return Le;
  br = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const e = Kn();
  return e.code = 'require("ajv/dist/runtime/uri").default', Le.default = e, Le;
}
var Er;
function xn() {
  return Er || (Er = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var s = /* @__PURE__ */ Nt();
    Object.defineProperty(e, "KeywordCxt", { enumerable: !0, get: function() {
      return s.KeywordCxt;
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
    const d = /* @__PURE__ */ xt(), S = /* @__PURE__ */ Ot(), a = /* @__PURE__ */ yn(), f = /* @__PURE__ */ Gt(), c = /* @__PURE__ */ W(), h = /* @__PURE__ */ Rt(), $ = /* @__PURE__ */ St(), g = /* @__PURE__ */ Q(), R = Un, j = /* @__PURE__ */ Hn(), N = (z, u) => new RegExp(z, u);
    N.code = "new RegExp";
    const O = ["removeAdditional", "useDefaults", "coerceTypes"], P = /* @__PURE__ */ new Set([
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
    ]), _ = {
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
    }, y = {
      ignoreKeywordsWithRef: "",
      jsPropertySyntax: "",
      unicode: '"minLength"/"maxLength" account for unicode characters by default.'
    }, o = 200;
    function p(z) {
      var u, b, m, t, r, v, T, I, F, G, k, C, A, V, U, J, ne, re, se, ee, X, pe, ae, me, Ie;
      const je = z.strict, kt = (u = z.code) === null || u === void 0 ? void 0 : u.optimize, Bt = kt === !0 || kt === void 0 ? 1 : kt || 0, Wt = (m = (b = z.code) === null || b === void 0 ? void 0 : b.regExp) !== null && m !== void 0 ? m : N, Sn = (t = z.uriResolver) !== null && t !== void 0 ? t : j.default;
      return {
        strictSchema: (v = (r = z.strictSchema) !== null && r !== void 0 ? r : je) !== null && v !== void 0 ? v : !0,
        strictNumbers: (I = (T = z.strictNumbers) !== null && T !== void 0 ? T : je) !== null && I !== void 0 ? I : !0,
        strictTypes: (G = (F = z.strictTypes) !== null && F !== void 0 ? F : je) !== null && G !== void 0 ? G : "log",
        strictTuples: (C = (k = z.strictTuples) !== null && k !== void 0 ? k : je) !== null && C !== void 0 ? C : "log",
        strictRequired: (V = (A = z.strictRequired) !== null && A !== void 0 ? A : je) !== null && V !== void 0 ? V : !1,
        code: z.code ? { ...z.code, optimize: Bt, regExp: Wt } : { optimize: Bt, regExp: Wt },
        loopRequired: (U = z.loopRequired) !== null && U !== void 0 ? U : o,
        loopEnum: (J = z.loopEnum) !== null && J !== void 0 ? J : o,
        meta: (ne = z.meta) !== null && ne !== void 0 ? ne : !0,
        messages: (re = z.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (se = z.inlineRefs) !== null && se !== void 0 ? se : !0,
        schemaId: (ee = z.schemaId) !== null && ee !== void 0 ? ee : "$id",
        addUsedSchema: (X = z.addUsedSchema) !== null && X !== void 0 ? X : !0,
        validateSchema: (pe = z.validateSchema) !== null && pe !== void 0 ? pe : !0,
        validateFormats: (ae = z.validateFormats) !== null && ae !== void 0 ? ae : !0,
        unicodeRegExp: (me = z.unicodeRegExp) !== null && me !== void 0 ? me : !0,
        int32range: (Ie = z.int32range) !== null && Ie !== void 0 ? Ie : !0,
        uriResolver: Sn
      };
    }
    class E {
      constructor(u = {}) {
        this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), u = this.opts = { ...u, ...p(u) };
        const { es5: b, lines: m } = this.opts.code;
        this.scope = new c.ValueScope({ scope: {}, prefixes: P, es5: b, lines: m }), this.logger = L(u.logger);
        const t = u.validateFormats;
        u.validateFormats = !1, this.RULES = (0, a.getRules)(), n.call(this, _, u, "NOT SUPPORTED"), n.call(this, y, u, "DEPRECATED", "warn"), this._metaOpts = K.call(this), u.formats && q.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), u.keywords && M.call(this, u.keywords), typeof u.meta == "object" && this.addMetaSchema(u.meta), l.call(this), u.validateFormats = t;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: u, meta: b, schemaId: m } = this.opts;
        let t = R;
        m === "id" && (t = { ...R }, t.id = t.$id, delete t.$id), b && u && this.addMetaSchema(t, t[m], !1);
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
          return C.validate || v.call(this, C);
        }
        async function r(G) {
          G && !this.getSchema(G) && await t.call(this, { $ref: G }, !0);
        }
        async function v(G) {
          try {
            return this._compileSchemaEnv(G);
          } catch (k) {
            if (!(k instanceof S.default))
              throw k;
            return T.call(this, k), await I.call(this, k.missingSchema), v.call(this, G);
          }
        }
        function T({ missingSchema: G, missingRef: k }) {
          if (this.refs[G])
            throw new Error(`AnySchema ${G} is loaded but ${k} cannot be resolved`);
        }
        async function I(G) {
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
          for (const v of u)
            this.addSchema(v, void 0, m, t);
          return this;
        }
        let r;
        if (typeof u == "object") {
          const { schemaId: v } = this.opts;
          if (r = u[v], r !== void 0 && typeof r != "string")
            throw new Error(`schema ${v} must be string`);
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
          const { schemaId: m } = this.opts, t = new f.SchemaEnv({ schema: {}, schemaId: m });
          if (b = f.resolveSchema.call(this, t, u), !b)
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
          type: (0, $.getJSONTypes)(b.type),
          schemaType: (0, $.getJSONTypes)(b.schemaType)
        };
        return (0, g.eachItem)(m, t.type.length === 0 ? (r) => Z.call(this, r, t) : (r) => t.type.forEach((v) => Z.call(this, r, t, v))), this;
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
          let v = u;
          for (const T of r)
            v = v[T];
          for (const T in m) {
            const I = m[T];
            if (typeof I != "object")
              continue;
            const { $data: F } = I.definition, G = v[T];
            F && G && (v[T] = ue(G));
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
        let v;
        const { schemaId: T } = this.opts;
        if (typeof u == "object")
          v = u[T];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof u != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let I = this._cache.get(u);
        if (I !== void 0)
          return I;
        m = (0, h.normalizeId)(v || m);
        const F = h.getSchemaRefs.call(this, u, m);
        return I = new f.SchemaEnv({ schema: u, schemaId: T, meta: b, baseId: m, localRefs: F }), this._cache.set(I.schema, I), r && !m.startsWith("#") && (m && this._checkUnique(m), this.refs[m] = I), t && this.validateSchema(u, !0), I;
      }
      _checkUnique(u) {
        if (this.schemas[u] || this.refs[u])
          throw new Error(`schema with key or id "${u}" already exists`);
      }
      _compileSchemaEnv(u) {
        if (u.meta ? this._compileMetaSchema(u) : f.compileSchema.call(this, u), !u.validate)
          throw new Error("ajv implementation error");
        return u.validate;
      }
      _compileMetaSchema(u) {
        const b = this.opts;
        this.opts = this._metaOpts;
        try {
          f.compileSchema.call(this, u);
        } finally {
          this.opts = b;
        }
      }
    }
    E.ValidationError = d.default, E.MissingRefError = S.default, e.default = E;
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
      for (const u of O)
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
      let v = t ? r.post : r.rules.find(({ type: I }) => I === b);
      if (v || (v = { type: b, rules: [] }, r.rules.push(v)), r.keywords[z] = !0, !u)
        return;
      const T = {
        keyword: z,
        definition: {
          ...u,
          type: (0, $.getJSONTypes)(u.type),
          schemaType: (0, $.getJSONTypes)(u.schemaType)
        }
      };
      u.before ? ie.call(this, v, T, u.before) : v.rules.push(T), r.all[z] = T, (m = u.implements) === null || m === void 0 || m.forEach((I) => this.addKeyword(I));
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
  })(Ct)), Ct;
}
var Ke = {}, He = {}, xe = {}, Sr;
function Gn() {
  if (Sr) return xe;
  Sr = 1, Object.defineProperty(xe, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return xe.default = e, xe;
}
var Ee = {}, Pr;
function Jn() {
  if (Pr) return Ee;
  Pr = 1, Object.defineProperty(Ee, "__esModule", { value: !0 }), Ee.callRef = Ee.getValidate = void 0;
  const e = /* @__PURE__ */ Ot(), s = /* @__PURE__ */ ve(), w = /* @__PURE__ */ W(), d = /* @__PURE__ */ Se(), S = /* @__PURE__ */ Gt(), a = /* @__PURE__ */ Q(), f = {
    keyword: "$ref",
    schemaType: "string",
    code($) {
      const { gen: g, schema: R, it: j } = $, { baseId: N, schemaEnv: O, validateName: P, opts: _, self: y } = j, { root: o } = O;
      if ((R === "#" || R === "#/") && N === o.baseId)
        return E();
      const p = S.resolveRef.call(y, o, N, R);
      if (p === void 0)
        throw new e.default(j.opts.uriResolver, N, R);
      if (p instanceof S.SchemaEnv)
        return n(p);
      return i(p);
      function E() {
        if (O === o)
          return h($, P, O, O.$async);
        const l = g.scopeValue("root", { ref: o });
        return h($, (0, w._)`${l}.validate`, o, o.$async);
      }
      function n(l) {
        const q = c($, l);
        h($, q, l, l.$async);
      }
      function i(l) {
        const q = g.scopeValue("schema", _.code.source === !0 ? { ref: l, code: (0, w.stringify)(l) } : { ref: l }), M = g.name("valid"), K = $.subschema({
          schema: l,
          dataTypes: [],
          schemaPath: w.nil,
          topSchemaRef: q,
          errSchemaPath: R
        }, M);
        $.mergeEvaluated(K), $.ok(M);
      }
    }
  };
  function c($, g) {
    const { gen: R } = $;
    return g.validate ? R.scopeValue("validate", { ref: g.validate }) : (0, w._)`${R.scopeValue("wrapper", { ref: g })}.validate`;
  }
  Ee.getValidate = c;
  function h($, g, R, j) {
    const { gen: N, it: O } = $, { allErrors: P, schemaEnv: _, opts: y } = O, o = y.passContext ? d.default.this : w.nil;
    j ? p() : E();
    function p() {
      if (!_.$async)
        throw new Error("async schema referenced by sync schema");
      const l = N.let("valid");
      N.try(() => {
        N.code((0, w._)`await ${(0, s.callValidateCode)($, g, o)}`), i(g), P || N.assign(l, !0);
      }, (q) => {
        N.if((0, w._)`!(${q} instanceof ${O.ValidationError})`, () => N.throw(q)), n(q), P || N.assign(l, !1);
      }), $.ok(l);
    }
    function E() {
      $.result((0, s.callValidateCode)($, g, o), () => i(g), () => n(g));
    }
    function n(l) {
      const q = (0, w._)`${l}.errors`;
      N.assign(d.default.vErrors, (0, w._)`${d.default.vErrors} === null ? ${q} : ${d.default.vErrors}.concat(${q})`), N.assign(d.default.errors, (0, w._)`${d.default.vErrors}.length`);
    }
    function i(l) {
      var q;
      if (!O.opts.unevaluated)
        return;
      const M = (q = R?.validate) === null || q === void 0 ? void 0 : q.evaluated;
      if (O.props !== !0)
        if (M && !M.dynamicProps)
          M.props !== void 0 && (O.props = a.mergeEvaluated.props(N, M.props, O.props));
        else {
          const K = N.var("props", (0, w._)`${l}.evaluated.props`);
          O.props = a.mergeEvaluated.props(N, K, O.props, w.Name);
        }
      if (O.items !== !0)
        if (M && !M.dynamicItems)
          M.items !== void 0 && (O.items = a.mergeEvaluated.items(N, M.items, O.items));
        else {
          const K = N.var("items", (0, w._)`${l}.evaluated.items`);
          O.items = a.mergeEvaluated.items(N, K, O.items, w.Name);
        }
    }
  }
  return Ee.callRef = h, Ee.default = f, Ee;
}
var Rr;
function Bn() {
  if (Rr) return He;
  Rr = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Gn(), s = /* @__PURE__ */ Jn(), w = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    s.default
  ];
  return He.default = w, He;
}
var Ge = {}, Je = {}, Nr;
function Wn() {
  if (Nr) return Je;
  Nr = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = e.operators, w = {
    maximum: { okStr: "<=", ok: s.LTE, fail: s.GT },
    minimum: { okStr: ">=", ok: s.GTE, fail: s.LT },
    exclusiveMaximum: { okStr: "<", ok: s.LT, fail: s.GTE },
    exclusiveMinimum: { okStr: ">", ok: s.GT, fail: s.LTE }
  }, d = {
    message: ({ keyword: a, schemaCode: f }) => (0, e.str)`must be ${w[a].okStr} ${f}`,
    params: ({ keyword: a, schemaCode: f }) => (0, e._)`{comparison: ${w[a].okStr}, limit: ${f}}`
  }, S = {
    keyword: Object.keys(w),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: d,
    code(a) {
      const { keyword: f, data: c, schemaCode: h } = a;
      a.fail$data((0, e._)`${c} ${w[f].fail} ${h} || isNaN(${c})`);
    }
  };
  return Je.default = S, Je;
}
var Be = {}, Or;
function Zn() {
  if (Or) return Be;
  Or = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "multipleOf",
    type: "number",
    schemaType: "number",
    $data: !0,
    error: {
      message: ({ schemaCode: d }) => (0, e.str)`must be multiple of ${d}`,
      params: ({ schemaCode: d }) => (0, e._)`{multipleOf: ${d}}`
    },
    code(d) {
      const { gen: S, data: a, schemaCode: f, it: c } = d, h = c.opts.multipleOfPrecision, $ = S.let("res"), g = h ? (0, e._)`Math.abs(Math.round(${$}) - ${$}) > 1e-${h}` : (0, e._)`${$} !== parseInt(${$})`;
      d.fail$data((0, e._)`(${f} === 0 || (${$} = ${a}/${f}, ${g}))`);
    }
  };
  return Be.default = w, Be;
}
var We = {}, Ze = {}, kr;
function Qn() {
  if (kr) return Ze;
  kr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  function e(s) {
    const w = s.length;
    let d = 0, S = 0, a;
    for (; S < w; )
      d++, a = s.charCodeAt(S++), a >= 55296 && a <= 56319 && S < w && (a = s.charCodeAt(S), (a & 64512) === 56320 && S++);
    return d;
  }
  return Ze.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Ze;
}
var Ir;
function Yn() {
  if (Ir) return We;
  Ir = 1, Object.defineProperty(We, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Qn(), S = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: a, schemaCode: f }) {
        const c = a === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${c} than ${f} characters`;
      },
      params: ({ schemaCode: a }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { keyword: f, data: c, schemaCode: h, it: $ } = a, g = f === "maxLength" ? e.operators.GT : e.operators.LT, R = $.opts.unicode === !1 ? (0, e._)`${c}.length` : (0, e._)`${(0, s.useFunc)(a.gen, w.default)}(${c})`;
      a.fail$data((0, e._)`${R} ${g} ${h}`);
    }
  };
  return We.default = S, We;
}
var Qe = {}, jr;
function Xn() {
  if (jr) return Qe;
  jr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ve(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ W(), S = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: a }) => (0, w.str)`must match pattern "${a}"`,
      params: ({ schemaCode: a }) => (0, w._)`{pattern: ${a}}`
    },
    code(a) {
      const { gen: f, data: c, $data: h, schema: $, schemaCode: g, it: R } = a, j = R.opts.unicodeRegExp ? "u" : "";
      if (h) {
        const { regExp: N } = R.opts.code, O = N.code === "new RegExp" ? (0, w._)`new RegExp` : (0, s.useFunc)(f, N), P = f.let("valid");
        f.try(() => f.assign(P, (0, w._)`${O}(${g}, ${j}).test(${c})`), () => f.assign(P, !1)), a.fail$data((0, w._)`!${P}`);
      } else {
        const N = (0, e.usePattern)(a, $);
        a.fail$data((0, w._)`!${N}.test(${c})`);
      }
    }
  };
  return Qe.default = S, Qe;
}
var Ye = {}, Tr;
function es() {
  if (Tr) return Ye;
  Tr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: d, schemaCode: S }) {
        const a = d === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${S} properties`;
      },
      params: ({ schemaCode: d }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { keyword: S, data: a, schemaCode: f } = d, c = S === "maxProperties" ? e.operators.GT : e.operators.LT;
      d.fail$data((0, e._)`Object.keys(${a}).length ${c} ${f}`);
    }
  };
  return Ye.default = w, Ye;
}
var Xe = {}, Cr;
function ts() {
  if (Cr) return Xe;
  Cr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ve(), s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), S = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: a } }) => (0, s.str)`must have required property '${a}'`,
      params: ({ params: { missingProperty: a } }) => (0, s._)`{missingProperty: ${a}}`
    },
    code(a) {
      const { gen: f, schema: c, schemaCode: h, data: $, $data: g, it: R } = a, { opts: j } = R;
      if (!g && c.length === 0)
        return;
      const N = c.length >= j.loopRequired;
      if (R.allErrors ? O() : P(), j.strictRequired) {
        const o = a.parentSchema.properties, { definedProperties: p } = a.it;
        for (const E of c)
          if (o?.[E] === void 0 && !p.has(E)) {
            const n = R.schemaEnv.baseId + R.errSchemaPath, i = `required property "${E}" is not defined at "${n}" (strictRequired)`;
            (0, w.checkStrictMode)(R, i, R.opts.strictRequired);
          }
      }
      function O() {
        if (N || g)
          a.block$data(s.nil, _);
        else
          for (const o of c)
            (0, e.checkReportMissingProp)(a, o);
      }
      function P() {
        const o = f.let("missing");
        if (N || g) {
          const p = f.let("valid", !0);
          a.block$data(p, () => y(o, p)), a.ok(p);
        } else
          f.if((0, e.checkMissingProp)(a, c, o)), (0, e.reportMissingProp)(a, o), f.else();
      }
      function _() {
        f.forOf("prop", h, (o) => {
          a.setParams({ missingProperty: o }), f.if((0, e.noPropertyInData)(f, $, o, j.ownProperties), () => a.error());
        });
      }
      function y(o, p) {
        a.setParams({ missingProperty: o }), f.forOf(o, h, () => {
          f.assign(p, (0, e.propertyInData)(f, $, o, j.ownProperties)), f.if((0, s.not)(p), () => {
            a.error(), f.break();
          });
        }, s.nil);
      }
    }
  };
  return Xe.default = S, Xe;
}
var et = {}, qr;
function rs() {
  if (qr) return et;
  qr = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: d, schemaCode: S }) {
        const a = d === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${a} than ${S} items`;
      },
      params: ({ schemaCode: d }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { keyword: S, data: a, schemaCode: f } = d, c = S === "maxItems" ? e.operators.GT : e.operators.LT;
      d.fail$data((0, e._)`${a}.length ${c} ${f}`);
    }
  };
  return et.default = w, et;
}
var tt = {}, rt = {}, Ar;
function Jt() {
  if (Ar) return rt;
  Ar = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const e = gn();
  return e.code = 'require("ajv/dist/runtime/equal").default', rt.default = e, rt;
}
var Dr;
function ns() {
  if (Dr) return tt;
  Dr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ St(), s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Jt(), a = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: f, j: c } }) => (0, s.str)`must NOT have duplicate items (items ## ${c} and ${f} are identical)`,
      params: ({ params: { i: f, j: c } }) => (0, s._)`{i: ${f}, j: ${c}}`
    },
    code(f) {
      const { gen: c, data: h, $data: $, schema: g, parentSchema: R, schemaCode: j, it: N } = f;
      if (!$ && !g)
        return;
      const O = c.let("valid"), P = R.items ? (0, e.getSchemaTypes)(R.items) : [];
      f.block$data(O, _, (0, s._)`${j} === false`), f.ok(O);
      function _() {
        const E = c.let("i", (0, s._)`${h}.length`), n = c.let("j");
        f.setParams({ i: E, j: n }), c.assign(O, !0), c.if((0, s._)`${E} > 1`, () => (y() ? o : p)(E, n));
      }
      function y() {
        return P.length > 0 && !P.some((E) => E === "object" || E === "array");
      }
      function o(E, n) {
        const i = c.name("item"), l = (0, e.checkDataTypes)(P, i, N.opts.strictNumbers, e.DataType.Wrong), q = c.const("indices", (0, s._)`{}`);
        c.for((0, s._)`;${E}--;`, () => {
          c.let(i, (0, s._)`${h}[${E}]`), c.if(l, (0, s._)`continue`), P.length > 1 && c.if((0, s._)`typeof ${i} == "string"`, (0, s._)`${i} += "_"`), c.if((0, s._)`typeof ${q}[${i}] == "number"`, () => {
            c.assign(n, (0, s._)`${q}[${i}]`), f.error(), c.assign(O, !1).break();
          }).code((0, s._)`${q}[${i}] = ${E}`);
        });
      }
      function p(E, n) {
        const i = (0, w.useFunc)(c, d.default), l = c.name("outer");
        c.label(l).for((0, s._)`;${E}--;`, () => c.for((0, s._)`${n} = ${E}; ${n}--;`, () => c.if((0, s._)`${i}(${h}[${E}], ${h}[${n}])`, () => {
          f.error(), c.assign(O, !1).break(l);
        })));
      }
    }
  };
  return tt.default = a, tt;
}
var nt = {}, Mr;
function ss() {
  if (Mr) return nt;
  Mr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Jt(), S = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: a }) => (0, e._)`{allowedValue: ${a}}`
    },
    code(a) {
      const { gen: f, data: c, $data: h, schemaCode: $, schema: g } = a;
      h || g && typeof g == "object" ? a.fail$data((0, e._)`!${(0, s.useFunc)(f, w.default)}(${c}, ${$})`) : a.fail((0, e._)`${g} !== ${c}`);
    }
  };
  return nt.default = S, nt;
}
var st = {}, Fr;
function as() {
  if (Fr) return st;
  Fr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Jt(), S = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: a }) => (0, e._)`{allowedValues: ${a}}`
    },
    code(a) {
      const { gen: f, data: c, $data: h, schema: $, schemaCode: g, it: R } = a;
      if (!h && $.length === 0)
        throw new Error("enum must have non-empty array");
      const j = $.length >= R.opts.loopEnum;
      let N;
      const O = () => N ?? (N = (0, s.useFunc)(f, w.default));
      let P;
      if (j || h)
        P = f.let("valid"), a.block$data(P, _);
      else {
        if (!Array.isArray($))
          throw new Error("ajv implementation error");
        const o = f.const("vSchema", g);
        P = (0, e.or)(...$.map((p, E) => y(o, E)));
      }
      a.pass(P);
      function _() {
        f.assign(P, !1), f.forOf("v", g, (o) => f.if((0, e._)`${O()}(${c}, ${o})`, () => f.assign(P, !0).break()));
      }
      function y(o, p) {
        const E = $[p];
        return typeof E == "object" && E !== null ? (0, e._)`${O()}(${c}, ${o}[${p}])` : (0, e._)`${c} === ${E}`;
      }
    }
  };
  return st.default = S, st;
}
var zr;
function os() {
  if (zr) return Ge;
  zr = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Wn(), s = /* @__PURE__ */ Zn(), w = /* @__PURE__ */ Yn(), d = /* @__PURE__ */ Xn(), S = /* @__PURE__ */ es(), a = /* @__PURE__ */ ts(), f = /* @__PURE__ */ rs(), c = /* @__PURE__ */ ns(), h = /* @__PURE__ */ ss(), $ = /* @__PURE__ */ as(), g = [
    // number
    e.default,
    s.default,
    // string
    w.default,
    d.default,
    // object
    S.default,
    a.default,
    // array
    f.default,
    c.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    h.default,
    $.default
  ];
  return Ge.default = g, Ge;
}
var at = {}, Oe = {}, Vr;
function $n() {
  if (Vr) return Oe;
  Vr = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.validateAdditionalItems = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), d = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: a } }) => (0, e.str)`must NOT have more than ${a} items`,
      params: ({ params: { len: a } }) => (0, e._)`{limit: ${a}}`
    },
    code(a) {
      const { parentSchema: f, it: c } = a, { items: h } = f;
      if (!Array.isArray(h)) {
        (0, s.checkStrictMode)(c, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      S(a, h);
    }
  };
  function S(a, f) {
    const { gen: c, schema: h, data: $, keyword: g, it: R } = a;
    R.items = !0;
    const j = c.const("len", (0, e._)`${$}.length`);
    if (h === !1)
      a.setParams({ len: f.length }), a.pass((0, e._)`${j} <= ${f.length}`);
    else if (typeof h == "object" && !(0, s.alwaysValidSchema)(R, h)) {
      const O = c.var("valid", (0, e._)`${j} <= ${f.length}`);
      c.if((0, e.not)(O), () => N(O)), a.ok(O);
    }
    function N(O) {
      c.forRange("i", f.length, j, (P) => {
        a.subschema({ keyword: g, dataProp: P, dataPropType: s.Type.Num }, O), R.allErrors || c.if((0, e.not)(O), () => c.break());
      });
    }
  }
  return Oe.validateAdditionalItems = S, Oe.default = d, Oe;
}
var ot = {}, ke = {}, Ur;
function wn() {
  if (Ur) return ke;
  Ur = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateTuple = void 0;
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ ve(), d = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(a) {
      const { schema: f, it: c } = a;
      if (Array.isArray(f))
        return S(a, "additionalItems", f);
      c.items = !0, !(0, s.alwaysValidSchema)(c, f) && a.ok((0, w.validateArray)(a));
    }
  };
  function S(a, f, c = a.schema) {
    const { gen: h, parentSchema: $, data: g, keyword: R, it: j } = a;
    P($), j.opts.unevaluated && c.length && j.items !== !0 && (j.items = s.mergeEvaluated.items(h, c.length, j.items));
    const N = h.name("valid"), O = h.const("len", (0, e._)`${g}.length`);
    c.forEach((_, y) => {
      (0, s.alwaysValidSchema)(j, _) || (h.if((0, e._)`${O} > ${y}`, () => a.subschema({
        keyword: R,
        schemaProp: y,
        dataProp: y
      }, N)), a.ok(N));
    });
    function P(_) {
      const { opts: y, errSchemaPath: o } = j, p = c.length, E = p === _.minItems && (p === _.maxItems || _[f] === !1);
      if (y.strictTuples && !E) {
        const n = `"${R}" is ${p}-tuple, but minItems or maxItems/${f} are not specified or different at path "${o}"`;
        (0, s.checkStrictMode)(j, n, y.strictTuples);
      }
    }
  }
  return ke.validateTuple = S, ke.default = d, ke;
}
var Lr;
function is() {
  if (Lr) return ot;
  Lr = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ wn(), s = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (w) => (0, e.validateTuple)(w, "items")
  };
  return ot.default = s, ot;
}
var it = {}, Kr;
function us() {
  if (Kr) return it;
  Kr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), w = /* @__PURE__ */ ve(), d = /* @__PURE__ */ $n(), a = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: f } }) => (0, e.str)`must NOT have more than ${f} items`,
      params: ({ params: { len: f } }) => (0, e._)`{limit: ${f}}`
    },
    code(f) {
      const { schema: c, parentSchema: h, it: $ } = f, { prefixItems: g } = h;
      $.items = !0, !(0, s.alwaysValidSchema)($, c) && (g ? (0, d.validateAdditionalItems)(f, g) : f.ok((0, w.validateArray)(f)));
    }
  };
  return it.default = a, it;
}
var ut = {}, Hr;
function cs() {
  if (Hr) return ut;
  Hr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), d = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: S, max: a } }) => a === void 0 ? (0, e.str)`must contain at least ${S} valid item(s)` : (0, e.str)`must contain at least ${S} and no more than ${a} valid item(s)`,
      params: ({ params: { min: S, max: a } }) => a === void 0 ? (0, e._)`{minContains: ${S}}` : (0, e._)`{minContains: ${S}, maxContains: ${a}}`
    },
    code(S) {
      const { gen: a, schema: f, parentSchema: c, data: h, it: $ } = S;
      let g, R;
      const { minContains: j, maxContains: N } = c;
      $.opts.next ? (g = j === void 0 ? 1 : j, R = N) : g = 1;
      const O = a.const("len", (0, e._)`${h}.length`);
      if (S.setParams({ min: g, max: R }), R === void 0 && g === 0) {
        (0, s.checkStrictMode)($, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (R !== void 0 && g > R) {
        (0, s.checkStrictMode)($, '"minContains" > "maxContains" is always invalid'), S.fail();
        return;
      }
      if ((0, s.alwaysValidSchema)($, f)) {
        let p = (0, e._)`${O} >= ${g}`;
        R !== void 0 && (p = (0, e._)`${p} && ${O} <= ${R}`), S.pass(p);
        return;
      }
      $.items = !0;
      const P = a.name("valid");
      R === void 0 && g === 1 ? y(P, () => a.if(P, () => a.break())) : g === 0 ? (a.let(P, !0), R !== void 0 && a.if((0, e._)`${h}.length > 0`, _)) : (a.let(P, !1), _()), S.result(P, () => S.reset());
      function _() {
        const p = a.name("_valid"), E = a.let("count", 0);
        y(p, () => a.if(p, () => o(E)));
      }
      function y(p, E) {
        a.forRange("i", 0, O, (n) => {
          S.subschema({
            keyword: "contains",
            dataProp: n,
            dataPropType: s.Type.Num,
            compositeRule: !0
          }, p), E();
        });
      }
      function o(p) {
        a.code((0, e._)`${p}++`), R === void 0 ? a.if((0, e._)`${p} >= ${g}`, () => a.assign(P, !0).break()) : (a.if((0, e._)`${p} > ${R}`, () => a.assign(P, !1).break()), g === 1 ? a.assign(P, !0) : a.if((0, e._)`${p} >= ${g}`, () => a.assign(P, !0)));
      }
    }
  };
  return ut.default = d, ut;
}
var Lt = {}, xr;
function ls() {
  return xr || (xr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ ve();
    e.error = {
      message: ({ params: { property: h, depsCount: $, deps: g } }) => {
        const R = $ === 1 ? "property" : "properties";
        return (0, s.str)`must have ${R} ${g} when property ${h} is present`;
      },
      params: ({ params: { property: h, depsCount: $, deps: g, missingProperty: R } }) => (0, s._)`{property: ${h},
    missingProperty: ${R},
    depsCount: ${$},
    deps: ${g}}`
      // TODO change to reference
    };
    const S = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(h) {
        const [$, g] = a(h);
        f(h, $), c(h, g);
      }
    };
    function a({ schema: h }) {
      const $ = {}, g = {};
      for (const R in h) {
        if (R === "__proto__")
          continue;
        const j = Array.isArray(h[R]) ? $ : g;
        j[R] = h[R];
      }
      return [$, g];
    }
    function f(h, $ = h.schema) {
      const { gen: g, data: R, it: j } = h;
      if (Object.keys($).length === 0)
        return;
      const N = g.let("missing");
      for (const O in $) {
        const P = $[O];
        if (P.length === 0)
          continue;
        const _ = (0, d.propertyInData)(g, R, O, j.opts.ownProperties);
        h.setParams({
          property: O,
          depsCount: P.length,
          deps: P.join(", ")
        }), j.allErrors ? g.if(_, () => {
          for (const y of P)
            (0, d.checkReportMissingProp)(h, y);
        }) : (g.if((0, s._)`${_} && (${(0, d.checkMissingProp)(h, P, N)})`), (0, d.reportMissingProp)(h, N), g.else());
      }
    }
    e.validatePropertyDeps = f;
    function c(h, $ = h.schema) {
      const { gen: g, data: R, keyword: j, it: N } = h, O = g.name("valid");
      for (const P in $)
        (0, w.alwaysValidSchema)(N, $[P]) || (g.if(
          (0, d.propertyInData)(g, R, P, N.opts.ownProperties),
          () => {
            const _ = h.subschema({ keyword: j, schemaProp: P }, O);
            h.mergeValidEvaluated(_, O);
          },
          () => g.var(O, !0)
          // TODO var
        ), h.ok(O));
    }
    e.validateSchemaDeps = c, e.default = S;
  })(Lt)), Lt;
}
var ct = {}, Gr;
function ds() {
  if (Gr) return ct;
  Gr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), d = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: S }) => (0, e._)`{propertyName: ${S.propertyName}}`
    },
    code(S) {
      const { gen: a, schema: f, data: c, it: h } = S;
      if ((0, s.alwaysValidSchema)(h, f))
        return;
      const $ = a.name("valid");
      a.forIn("key", c, (g) => {
        S.setParams({ propertyName: g }), S.subschema({
          keyword: "propertyNames",
          data: g,
          dataTypes: ["string"],
          propertyName: g,
          compositeRule: !0
        }, $), a.if((0, e.not)($), () => {
          S.error(!0), h.allErrors || a.break();
        });
      }), S.ok($);
    }
  };
  return ct.default = d, ct;
}
var lt = {}, Jr;
function bn() {
  if (Jr) return lt;
  Jr = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ve(), s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Se(), d = /* @__PURE__ */ Q(), a = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: f }) => (0, s._)`{additionalProperty: ${f.additionalProperty}}`
    },
    code(f) {
      const { gen: c, schema: h, parentSchema: $, data: g, errsCount: R, it: j } = f;
      if (!R)
        throw new Error("ajv implementation error");
      const { allErrors: N, opts: O } = j;
      if (j.props = !0, O.removeAdditional !== "all" && (0, d.alwaysValidSchema)(j, h))
        return;
      const P = (0, e.allSchemaProperties)($.properties), _ = (0, e.allSchemaProperties)($.patternProperties);
      y(), f.ok((0, s._)`${R} === ${w.default.errors}`);
      function y() {
        c.forIn("key", g, (i) => {
          !P.length && !_.length ? E(i) : c.if(o(i), () => E(i));
        });
      }
      function o(i) {
        let l;
        if (P.length > 8) {
          const q = (0, d.schemaRefOrVal)(j, $.properties, "properties");
          l = (0, e.isOwnProperty)(c, q, i);
        } else P.length ? l = (0, s.or)(...P.map((q) => (0, s._)`${i} === ${q}`)) : l = s.nil;
        return _.length && (l = (0, s.or)(l, ..._.map((q) => (0, s._)`${(0, e.usePattern)(f, q)}.test(${i})`))), (0, s.not)(l);
      }
      function p(i) {
        c.code((0, s._)`delete ${g}[${i}]`);
      }
      function E(i) {
        if (O.removeAdditional === "all" || O.removeAdditional && h === !1) {
          p(i);
          return;
        }
        if (h === !1) {
          f.setParams({ additionalProperty: i }), f.error(), N || c.break();
          return;
        }
        if (typeof h == "object" && !(0, d.alwaysValidSchema)(j, h)) {
          const l = c.name("valid");
          O.removeAdditional === "failing" ? (n(i, l, !1), c.if((0, s.not)(l), () => {
            f.reset(), p(i);
          })) : (n(i, l), N || c.if((0, s.not)(l), () => c.break()));
        }
      }
      function n(i, l, q) {
        const M = {
          keyword: "additionalProperties",
          dataProp: i,
          dataPropType: d.Type.Str
        };
        q === !1 && Object.assign(M, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), f.subschema(M, l);
      }
    }
  };
  return lt.default = a, lt;
}
var dt = {}, Br;
function fs() {
  if (Br) return dt;
  Br = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Nt(), s = /* @__PURE__ */ ve(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ bn(), S = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: f, schema: c, parentSchema: h, data: $, it: g } = a;
      g.opts.removeAdditional === "all" && h.additionalProperties === void 0 && d.default.code(new e.KeywordCxt(g, d.default, "additionalProperties"));
      const R = (0, s.allSchemaProperties)(c);
      for (const _ of R)
        g.definedProperties.add(_);
      g.opts.unevaluated && R.length && g.props !== !0 && (g.props = w.mergeEvaluated.props(f, (0, w.toHash)(R), g.props));
      const j = R.filter((_) => !(0, w.alwaysValidSchema)(g, c[_]));
      if (j.length === 0)
        return;
      const N = f.name("valid");
      for (const _ of j)
        O(_) ? P(_) : (f.if((0, s.propertyInData)(f, $, _, g.opts.ownProperties)), P(_), g.allErrors || f.else().var(N, !0), f.endIf()), a.it.definedProperties.add(_), a.ok(N);
      function O(_) {
        return g.opts.useDefaults && !g.compositeRule && c[_].default !== void 0;
      }
      function P(_) {
        a.subschema({
          keyword: "properties",
          schemaProp: _,
          dataProp: _
        }, N);
      }
    }
  };
  return dt.default = S, dt;
}
var ft = {}, Wr;
function hs() {
  if (Wr) return ft;
  Wr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ ve(), s = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Q(), S = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(a) {
      const { gen: f, schema: c, data: h, parentSchema: $, it: g } = a, { opts: R } = g, j = (0, e.allSchemaProperties)(c), N = j.filter((E) => (0, w.alwaysValidSchema)(g, c[E]));
      if (j.length === 0 || N.length === j.length && (!g.opts.unevaluated || g.props === !0))
        return;
      const O = R.strictSchema && !R.allowMatchingProperties && $.properties, P = f.name("valid");
      g.props !== !0 && !(g.props instanceof s.Name) && (g.props = (0, d.evaluatedPropsToName)(f, g.props));
      const { props: _ } = g;
      y();
      function y() {
        for (const E of j)
          O && o(E), g.allErrors ? p(E) : (f.var(P, !0), p(E), f.if(P));
      }
      function o(E) {
        for (const n in O)
          new RegExp(E).test(n) && (0, w.checkStrictMode)(g, `property ${n} matches pattern ${E} (use allowMatchingProperties)`);
      }
      function p(E) {
        f.forIn("key", h, (n) => {
          f.if((0, s._)`${(0, e.usePattern)(a, E)}.test(${n})`, () => {
            const i = N.includes(E);
            i || a.subschema({
              keyword: "patternProperties",
              schemaProp: E,
              dataProp: n,
              dataPropType: d.Type.Str
            }, P), g.opts.unevaluated && _ !== !0 ? f.assign((0, s._)`${_}[${n}]`, !0) : !i && !g.allErrors && f.if((0, s.not)(P), () => f.break());
          });
        });
      }
    }
  };
  return ft.default = S, ft;
}
var ht = {}, Zr;
function ms() {
  if (Zr) return ht;
  Zr = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), s = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(w) {
      const { gen: d, schema: S, it: a } = w;
      if ((0, e.alwaysValidSchema)(a, S)) {
        w.fail();
        return;
      }
      const f = d.name("valid");
      w.subschema({
        keyword: "not",
        compositeRule: !0,
        createErrors: !1,
        allErrors: !1
      }, f), w.failResult(f, () => w.reset(), () => w.error());
    },
    error: { message: "must NOT be valid" }
  };
  return ht.default = s, ht;
}
var mt = {}, Qr;
function ps() {
  if (Qr) return mt;
  Qr = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const s = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: (/* @__PURE__ */ ve()).validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return mt.default = s, mt;
}
var pt = {}, Yr;
function ys() {
  if (Yr) return pt;
  Yr = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), d = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: S }) => (0, e._)`{passingSchemas: ${S.passing}}`
    },
    code(S) {
      const { gen: a, schema: f, parentSchema: c, it: h } = S;
      if (!Array.isArray(f))
        throw new Error("ajv implementation error");
      if (h.opts.discriminator && c.discriminator)
        return;
      const $ = f, g = a.let("valid", !1), R = a.let("passing", null), j = a.name("_valid");
      S.setParams({ passing: R }), a.block(N), S.result(g, () => S.reset(), () => S.error(!0));
      function N() {
        $.forEach((O, P) => {
          let _;
          (0, s.alwaysValidSchema)(h, O) ? a.var(j, !0) : _ = S.subschema({
            keyword: "oneOf",
            schemaProp: P,
            compositeRule: !0
          }, j), P > 0 && a.if((0, e._)`${j} && ${g}`).assign(g, !1).assign(R, (0, e._)`[${R}, ${P}]`).else(), a.if(j, () => {
            a.assign(g, !0), a.assign(R, P), _ && S.mergeEvaluated(_, e.Name);
          });
        });
      }
    }
  };
  return pt.default = d, pt;
}
var yt = {}, Xr;
function vs() {
  if (Xr) return yt;
  Xr = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), s = {
    keyword: "allOf",
    schemaType: "array",
    code(w) {
      const { gen: d, schema: S, it: a } = w;
      if (!Array.isArray(S))
        throw new Error("ajv implementation error");
      const f = d.name("valid");
      S.forEach((c, h) => {
        if ((0, e.alwaysValidSchema)(a, c))
          return;
        const $ = w.subschema({ keyword: "allOf", schemaProp: h }, f);
        w.ok(f), w.mergeEvaluated($);
      });
    }
  };
  return yt.default = s, yt;
}
var vt = {}, en;
function gs() {
  if (en) return vt;
  en = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Q(), d = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: a }) => (0, e.str)`must match "${a.ifClause}" schema`,
      params: ({ params: a }) => (0, e._)`{failingKeyword: ${a.ifClause}}`
    },
    code(a) {
      const { gen: f, parentSchema: c, it: h } = a;
      c.then === void 0 && c.else === void 0 && (0, s.checkStrictMode)(h, '"if" without "then" and "else" is ignored');
      const $ = S(h, "then"), g = S(h, "else");
      if (!$ && !g)
        return;
      const R = f.let("valid", !0), j = f.name("_valid");
      if (N(), a.reset(), $ && g) {
        const P = f.let("ifClause");
        a.setParams({ ifClause: P }), f.if(j, O("then", P), O("else", P));
      } else $ ? f.if(j, O("then")) : f.if((0, e.not)(j), O("else"));
      a.pass(R, () => a.error(!0));
      function N() {
        const P = a.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, j);
        a.mergeEvaluated(P);
      }
      function O(P, _) {
        return () => {
          const y = a.subschema({ keyword: P }, j);
          f.assign(R, j), a.mergeValidEvaluated(y, R), _ ? f.assign(_, (0, e._)`${P}`) : a.setParams({ ifClause: P });
        };
      }
    }
  };
  function S(a, f) {
    const c = a.schema[f];
    return c !== void 0 && !(0, s.alwaysValidSchema)(a, c);
  }
  return vt.default = d, vt;
}
var gt = {}, tn;
function _s() {
  if (tn) return gt;
  tn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), s = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: w, parentSchema: d, it: S }) {
      d.if === void 0 && (0, e.checkStrictMode)(S, `"${w}" without "if" is ignored`);
    }
  };
  return gt.default = s, gt;
}
var rn;
function $s() {
  if (rn) return at;
  rn = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ $n(), s = /* @__PURE__ */ is(), w = /* @__PURE__ */ wn(), d = /* @__PURE__ */ us(), S = /* @__PURE__ */ cs(), a = /* @__PURE__ */ ls(), f = /* @__PURE__ */ ds(), c = /* @__PURE__ */ bn(), h = /* @__PURE__ */ fs(), $ = /* @__PURE__ */ hs(), g = /* @__PURE__ */ ms(), R = /* @__PURE__ */ ps(), j = /* @__PURE__ */ ys(), N = /* @__PURE__ */ vs(), O = /* @__PURE__ */ gs(), P = /* @__PURE__ */ _s();
  function _(y = !1) {
    const o = [
      // any
      g.default,
      R.default,
      j.default,
      N.default,
      O.default,
      P.default,
      // object
      f.default,
      c.default,
      a.default,
      h.default,
      $.default
    ];
    return y ? o.push(s.default, d.default) : o.push(e.default, w.default), o.push(S.default), o;
  }
  return at.default = _, at;
}
var _t = {}, $t = {}, nn;
function ws() {
  if (nn) return $t;
  nn = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: "format",
    type: ["number", "string"],
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: d }) => (0, e.str)`must match format "${d}"`,
      params: ({ schemaCode: d }) => (0, e._)`{format: ${d}}`
    },
    code(d, S) {
      const { gen: a, data: f, $data: c, schema: h, schemaCode: $, it: g } = d, { opts: R, errSchemaPath: j, schemaEnv: N, self: O } = g;
      if (!R.validateFormats)
        return;
      c ? P() : _();
      function P() {
        const y = a.scopeValue("formats", {
          ref: O.formats,
          code: R.code.formats
        }), o = a.const("fDef", (0, e._)`${y}[${$}]`), p = a.let("fType"), E = a.let("format");
        a.if((0, e._)`typeof ${o} == "object" && !(${o} instanceof RegExp)`, () => a.assign(p, (0, e._)`${o}.type || "string"`).assign(E, (0, e._)`${o}.validate`), () => a.assign(p, (0, e._)`"string"`).assign(E, o)), d.fail$data((0, e.or)(n(), i()));
        function n() {
          return R.strictSchema === !1 ? e.nil : (0, e._)`${$} && !${E}`;
        }
        function i() {
          const l = N.$async ? (0, e._)`(${o}.async ? await ${E}(${f}) : ${E}(${f}))` : (0, e._)`${E}(${f})`, q = (0, e._)`(typeof ${E} == "function" ? ${l} : ${E}.test(${f}))`;
          return (0, e._)`${E} && ${E} !== true && ${p} === ${S} && !${q}`;
        }
      }
      function _() {
        const y = O.formats[h];
        if (!y) {
          n();
          return;
        }
        if (y === !0)
          return;
        const [o, p, E] = i(y);
        o === S && d.pass(l());
        function n() {
          if (R.strictSchema === !1) {
            O.logger.warn(q());
            return;
          }
          throw new Error(q());
          function q() {
            return `unknown format "${h}" ignored in schema at path "${j}"`;
          }
        }
        function i(q) {
          const M = q instanceof RegExp ? (0, e.regexpCode)(q) : R.code.formats ? (0, e._)`${R.code.formats}${(0, e.getProperty)(h)}` : void 0, K = a.scopeValue("formats", { key: h, ref: q, code: M });
          return typeof q == "object" && !(q instanceof RegExp) ? [q.type || "string", q.validate, (0, e._)`${K}.validate`] : ["string", q, K];
        }
        function l() {
          if (typeof y == "object" && !(y instanceof RegExp) && y.async) {
            if (!N.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${E}(${f})`;
          }
          return typeof p == "function" ? (0, e._)`${E}(${f})` : (0, e._)`${E}.test(${f})`;
        }
      }
    }
  };
  return $t.default = w, $t;
}
var sn;
function bs() {
  if (sn) return _t;
  sn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const s = [(/* @__PURE__ */ ws()).default];
  return _t.default = s, _t;
}
var Ne = {}, an;
function Es() {
  return an || (an = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.contentVocabulary = Ne.metadataVocabulary = void 0, Ne.metadataVocabulary = [
    "title",
    "description",
    "default",
    "deprecated",
    "readOnly",
    "writeOnly",
    "examples"
  ], Ne.contentVocabulary = [
    "contentMediaType",
    "contentEncoding",
    "contentSchema"
  ]), Ne;
}
var on;
function Ss() {
  if (on) return Ke;
  on = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Bn(), s = /* @__PURE__ */ os(), w = /* @__PURE__ */ $s(), d = /* @__PURE__ */ bs(), S = /* @__PURE__ */ Es(), a = [
    e.default,
    s.default,
    (0, w.default)(),
    d.default,
    S.metadataVocabulary,
    S.contentVocabulary
  ];
  return Ke.default = a, Ke;
}
var wt = {}, Ae = {}, un;
function Ps() {
  if (un) return Ae;
  un = 1, Object.defineProperty(Ae, "__esModule", { value: !0 }), Ae.DiscrError = void 0;
  var e;
  return (function(s) {
    s.Tag = "tag", s.Mapping = "mapping";
  })(e || (Ae.DiscrError = e = {})), Ae;
}
var cn;
function Rs() {
  if (cn) return wt;
  cn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), s = /* @__PURE__ */ Ps(), w = /* @__PURE__ */ Gt(), d = /* @__PURE__ */ Ot(), S = /* @__PURE__ */ Q(), f = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: c, tagName: h } }) => c === s.DiscrError.Tag ? `tag "${h}" must be string` : `value of tag "${h}" must be in oneOf`,
      params: ({ params: { discrError: c, tag: h, tagName: $ } }) => (0, e._)`{error: ${c}, tag: ${$}, tagValue: ${h}}`
    },
    code(c) {
      const { gen: h, data: $, schema: g, parentSchema: R, it: j } = c, { oneOf: N } = R;
      if (!j.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const O = g.propertyName;
      if (typeof O != "string")
        throw new Error("discriminator: requires propertyName");
      if (g.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!N)
        throw new Error("discriminator: requires oneOf keyword");
      const P = h.let("valid", !1), _ = h.const("tag", (0, e._)`${$}${(0, e.getProperty)(O)}`);
      h.if((0, e._)`typeof ${_} == "string"`, () => y(), () => c.error(!1, { discrError: s.DiscrError.Tag, tag: _, tagName: O })), c.ok(P);
      function y() {
        const E = p();
        h.if(!1);
        for (const n in E)
          h.elseIf((0, e._)`${_} === ${n}`), h.assign(P, o(E[n]));
        h.else(), c.error(!1, { discrError: s.DiscrError.Mapping, tag: _, tagName: O }), h.endIf();
      }
      function o(E) {
        const n = h.name("valid"), i = c.subschema({ keyword: "oneOf", schemaProp: E }, n);
        return c.mergeEvaluated(i, e.Name), n;
      }
      function p() {
        var E;
        const n = {}, i = q(R);
        let l = !0;
        for (let D = 0; D < N.length; D++) {
          let L = N[D];
          if (L?.$ref && !(0, S.schemaHasRulesButRef)(L, j.self.RULES)) {
            const x = L.$ref;
            if (L = w.resolveRef.call(j.self, j.schemaEnv.root, j.baseId, x), L instanceof w.SchemaEnv && (L = L.schema), L === void 0)
              throw new d.default(j.opts.uriResolver, j.baseId, x);
          }
          const H = (E = L?.properties) === null || E === void 0 ? void 0 : E[O];
          if (typeof H != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${O}"`);
          l = l && (i || q(L)), M(H, D);
        }
        if (!l)
          throw new Error(`discriminator: "${O}" must be required`);
        return n;
        function q({ required: D }) {
          return Array.isArray(D) && D.includes(O);
        }
        function M(D, L) {
          if (D.const)
            K(D.const, L);
          else if (D.enum)
            for (const H of D.enum)
              K(H, L);
          else
            throw new Error(`discriminator: "properties/${O}" must have "const" or "enum"`);
        }
        function K(D, L) {
          if (typeof D != "string" || D in n)
            throw new Error(`discriminator: "${O}" values must be unique strings`);
          n[D] = L;
        }
      }
    }
  };
  return wt.default = f, wt;
}
const Ns = "http://json-schema.org/draft-07/schema#", Os = "http://json-schema.org/draft-07/schema#", ks = "Core schema meta-schema", Is = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, js = ["object", "boolean"], Ts = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Cs = {
  $schema: Ns,
  $id: Os,
  title: ks,
  definitions: Is,
  type: js,
  properties: Ts,
  default: !0
};
var ln;
function En() {
  return ln || (ln = 1, (function(e, s) {
    Object.defineProperty(s, "__esModule", { value: !0 }), s.MissingRefError = s.ValidationError = s.CodeGen = s.Name = s.nil = s.stringify = s.str = s._ = s.KeywordCxt = s.Ajv = void 0;
    const w = /* @__PURE__ */ xn(), d = /* @__PURE__ */ Ss(), S = /* @__PURE__ */ Rs(), a = Cs, f = ["/properties"], c = "http://json-schema.org/draft-07/schema";
    class h extends w.default {
      _addVocabularies() {
        super._addVocabularies(), d.default.forEach((O) => this.addVocabulary(O)), this.opts.discriminator && this.addKeyword(S.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const O = this.opts.$data ? this.$dataMetaSchema(a, f) : a;
        this.addMetaSchema(O, c, !1), this.refs["http://json-schema.org/schema"] = c;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
      }
    }
    s.Ajv = h, e.exports = s = h, e.exports.Ajv = h, Object.defineProperty(s, "__esModule", { value: !0 }), s.default = h;
    var $ = /* @__PURE__ */ Nt();
    Object.defineProperty(s, "KeywordCxt", { enumerable: !0, get: function() {
      return $.KeywordCxt;
    } });
    var g = /* @__PURE__ */ W();
    Object.defineProperty(s, "_", { enumerable: !0, get: function() {
      return g._;
    } }), Object.defineProperty(s, "str", { enumerable: !0, get: function() {
      return g.str;
    } }), Object.defineProperty(s, "stringify", { enumerable: !0, get: function() {
      return g.stringify;
    } }), Object.defineProperty(s, "nil", { enumerable: !0, get: function() {
      return g.nil;
    } }), Object.defineProperty(s, "Name", { enumerable: !0, get: function() {
      return g.Name;
    } }), Object.defineProperty(s, "CodeGen", { enumerable: !0, get: function() {
      return g.CodeGen;
    } });
    var R = /* @__PURE__ */ xt();
    Object.defineProperty(s, "ValidationError", { enumerable: !0, get: function() {
      return R.default;
    } });
    var j = /* @__PURE__ */ Ot();
    Object.defineProperty(s, "MissingRefError", { enumerable: !0, get: function() {
      return j.default;
    } });
  })(Fe, Fe.exports)), Fe.exports;
}
var qs = /* @__PURE__ */ En();
const As = /* @__PURE__ */ pn(qs);
var bt = { exports: {} }, Kt = {}, dn;
function Ds() {
  return dn || (dn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function s(D, L) {
      return { validate: D, compare: L };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: s(a, f),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: s(h(!0), $),
      "date-time": s(j(!0), N),
      "iso-time": s(h(), g),
      "iso-date-time": s(j(), O),
      // duration: https://tools.ietf.org/html/rfc3339#appendix-A
      duration: /^P(?!$)((\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+S)?)?|(\d+W)?)$/,
      uri: y,
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
      date: s(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, f),
      time: s(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, $),
      "date-time": s(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, N),
      "iso-time": s(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, g),
      "iso-date-time": s(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, O),
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
    const d = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, S = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function a(D) {
      const L = d.exec(D);
      if (!L)
        return !1;
      const H = +L[1], x = +L[2], Z = +L[3];
      return x >= 1 && x <= 12 && Z >= 1 && Z <= (x === 2 && w(H) ? 29 : S[x]);
    }
    function f(D, L) {
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
    function $(D, L) {
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
    const R = /t|\s/i;
    function j(D) {
      const L = h(D);
      return function(x) {
        const Z = x.split(R);
        return Z.length === 2 && a(Z[0]) && L(Z[1]);
      };
    }
    function N(D, L) {
      if (!(D && L))
        return;
      const H = new Date(D).valueOf(), x = new Date(L).valueOf();
      if (H && x)
        return H - x;
    }
    function O(D, L) {
      if (!(D && L))
        return;
      const [H, x] = D.split(R), [Z, ie] = L.split(R), oe = f(H, Z);
      if (oe !== void 0)
        return oe || $(x, ie);
    }
    const P = /\/|:/, _ = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function y(D) {
      return P.test(D) && _.test(D);
    }
    const o = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function p(D) {
      return o.lastIndex = 0, o.test(D);
    }
    const E = -2147483648, n = 2 ** 31 - 1;
    function i(D) {
      return Number.isInteger(D) && D <= n && D >= E;
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
  })(Kt)), Kt;
}
var Ht = {}, fn;
function Ms() {
  return fn || (fn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const s = /* @__PURE__ */ En(), w = /* @__PURE__ */ W(), d = w.operators, S = {
      formatMaximum: { okStr: "<=", ok: d.LTE, fail: d.GT },
      formatMinimum: { okStr: ">=", ok: d.GTE, fail: d.LT },
      formatExclusiveMaximum: { okStr: "<", ok: d.LT, fail: d.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: d.GT, fail: d.LTE }
    }, a = {
      message: ({ keyword: c, schemaCode: h }) => (0, w.str)`should be ${S[c].okStr} ${h}`,
      params: ({ keyword: c, schemaCode: h }) => (0, w._)`{comparison: ${S[c].okStr}, limit: ${h}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(S),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: a,
      code(c) {
        const { gen: h, data: $, schemaCode: g, keyword: R, it: j } = c, { opts: N, self: O } = j;
        if (!N.validateFormats)
          return;
        const P = new s.KeywordCxt(j, O.RULES.all.format.definition, "format");
        P.$data ? _() : y();
        function _() {
          const p = h.scopeValue("formats", {
            ref: O.formats,
            code: N.code.formats
          }), E = h.const("fmt", (0, w._)`${p}[${P.schemaCode}]`);
          c.fail$data((0, w.or)((0, w._)`typeof ${E} != "object"`, (0, w._)`${E} instanceof RegExp`, (0, w._)`typeof ${E}.compare != "function"`, o(E)));
        }
        function y() {
          const p = P.schema, E = O.formats[p];
          if (!E || E === !0)
            return;
          if (typeof E != "object" || E instanceof RegExp || typeof E.compare != "function")
            throw new Error(`"${R}": format "${p}" does not define "compare" function`);
          const n = h.scopeValue("formats", {
            key: p,
            ref: E,
            code: N.code.formats ? (0, w._)`${N.code.formats}${(0, w.getProperty)(p)}` : void 0
          });
          c.fail$data(o(n));
        }
        function o(p) {
          return (0, w._)`${p}.compare(${$}, ${g}) ${S[R].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const f = (c) => (c.addKeyword(e.formatLimitDefinition), c);
    e.default = f;
  })(Ht)), Ht;
}
var hn;
function Fs() {
  return hn || (hn = 1, (function(e, s) {
    Object.defineProperty(s, "__esModule", { value: !0 });
    const w = Ds(), d = Ms(), S = /* @__PURE__ */ W(), a = new S.Name("fullFormats"), f = new S.Name("fastFormats"), c = ($, g = { keywords: !0 }) => {
      if (Array.isArray(g))
        return h($, g, w.fullFormats, a), $;
      const [R, j] = g.mode === "fast" ? [w.fastFormats, f] : [w.fullFormats, a], N = g.formats || w.formatNames;
      return h($, N, R, j), g.keywords && (0, d.default)($), $;
    };
    c.get = ($, g = "full") => {
      const j = (g === "fast" ? w.fastFormats : w.fullFormats)[$];
      if (!j)
        throw new Error(`Unknown format "${$}"`);
      return j;
    };
    function h($, g, R, j) {
      var N, O;
      (N = (O = $.opts.code).formats) !== null && N !== void 0 || (O.formats = (0, S._)`require("ajv-formats/dist/formats").${j}`);
      for (const P of g)
        $.addFormat(P, R[P]);
    }
    e.exports = s = c, Object.defineProperty(s, "__esModule", { value: !0 }), s.default = c;
  })(bt, bt.exports)), bt.exports;
}
var zs = Fs();
const Vs = /* @__PURE__ */ pn(zs), Us = { class: "ac-options" }, Ls = { class: "kx-focus-outline" }, Ks = {
  key: 0,
  class: "ac-muted"
}, Hs = {
  key: 0,
  class: "ac-muted"
}, xs = { class: "ac-option-head" }, Gs = { class: "ac-mono" }, Js = { class: "ac-muted" }, Bs = {
  key: 1,
  class: "ac-muted ac-mono"
}, Ws = ["aria-label", "aria-invalid", "aria-describedby", "value", "onChange"], Zs = { value: "" }, Qs = ["value"], Ys = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], Xs = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], ea = ["id"], ta = {
  key: 0,
  class: "ac-muted"
}, oa = /* @__PURE__ */ Pn({
  __name: "driver-options",
  props: {
    options: {},
    modelValue: {},
    locked: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(e, { emit: s }) {
    const w = e, d = s, S = It(""), a = It({}), f = It({}), c = Rn(), h = new As({ strict: !1, allErrors: !0 });
    Vs(h);
    const $ = jt(() => new Map(w.options.map((n) => {
      try {
        return [n.name, n.schema ? h.compile(n.schema) : void 0];
      } catch {
        return [n.name, "Invalid option schema"];
      }
    }))), g = jt(() => {
      const n = S.value.trim().toLowerCase();
      return mn(w.options).filter((i) => !n || [i.name, i.label, i.description, i.section, i.group].join(" ").toLowerCase().includes(n)).sort((i, l) => i.section.localeCompare(l.section) || i.group.localeCompare(l.group) || i.order - l.order || i.name.localeCompare(l.name));
    }), R = jt(() => Object.keys(w.modelValue).length);
    Nn(() => Object.fromEntries(w.options.map((n) => [n.name, JSON.stringify([w.modelValue[n.name], w.locked?.[n.name], n])])), (n, i) => {
      for (const l of Object.keys(a.value))
        (n[l] !== i?.[l] || w.locked && l in w.locked || !(l in n)) && (delete a.value[l], delete f.value[l]);
      d("invalid", Object.keys(f.value).length);
    }, { immediate: !0 });
    function j(n, i) {
      const l = { ...w.modelValue };
      i === void 0 ? delete l[n] : l[n] = i, d("update:modelValue", l);
    }
    function N(n) {
      if (n.name in a.value) return a.value[n.name];
      const i = w.modelValue[n.name];
      return i === void 0 ? "" : n.type === "json" ? JSON.stringify(i) : n.type === "ids" && Array.isArray(i) && i.every((l) => typeof l == "string") ? i.join(", ") : String(i);
    }
    function O(n, i) {
      i ? f.value[n] = i : delete f.value[n], d("invalid", Object.keys(f.value).length);
    }
    function P(n, i) {
      const l = $.value.get(n.name);
      if (i !== void 0 && l) {
        if (typeof l == "string") {
          O(n.name, l);
          return;
        }
        if (!l(i)) {
          O(n.name, h.errorsText(l.errors));
          return;
        }
      }
      O(n.name), j(n.name, i);
    }
    function _(n, i) {
      a.value[n.name] = i;
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
          O(n.name, "Not valid JSON");
          return;
        }
        P(n, q);
      } else n.type === "ids" ? P(n, l.split(",").map((q) => q.trim()).filter(Boolean)) : P(n, l);
    }
    function y(n, i) {
      if (!(i.target instanceof HTMLSelectElement)) return;
      const l = i.target.value;
      if (!l) {
        P(n, void 0);
        return;
      }
      P(n, n.type === "boolean" ? l === "true" : (n.values ?? []).find((q) => String(q) === l) ?? l);
    }
    function o(n, i) {
      (i.target instanceof HTMLInputElement || i.target instanceof HTMLTextAreaElement) && _(n, i.target.value);
    }
    function p(n) {
      const i = w.modelValue[n.name];
      return i === void 0 ? "" : String(i);
    }
    function E(n) {
      return n.default === void 0 || n.default === null ? "CLI default" : `default: ${JSON.stringify(n.default)}`;
    }
    return (n, i) => (le(), de("details", Us, [
      be("summary", Ls, [
        i[1] || (i[1] = Tt("Driver options", -1)),
        R.value ? (le(), de("span", Ks, " · " + ge(R.value) + " set", 1)) : Te("", !0)
      ]),
      On(be("input", {
        "onUpdate:modelValue": i[0] || (i[0] = (l) => S.value = l),
        class: "ac-mono ac-options-filter kx-focus-halo",
        placeholder: "Filter options",
        "aria-label": "Filter driver options"
      }, null, 512), [
        [kn, S.value]
      ]),
      (le(!0), de(De, null, Zt(g.value, (l, q) => (le(), de("div", {
        key: l.name,
        class: "ac-option"
      }, [
        q === 0 || l.section !== g.value[q - 1].section || l.group !== g.value[q - 1].group ? (le(), de("div", Hs, ge([l.section, l.group].filter(Boolean).join(" · ")), 1)) : Te("", !0),
        be("div", xs, [
          be("span", Gs, ge(l.name), 1),
          be("small", Js, [
            Tt(ge(l.label), 1),
            l.description && l.description !== l.label ? (le(), de(De, { key: 0 }, [
              Tt(" — " + ge(l.description), 1)
            ], 64)) : Te("", !0)
          ])
        ]),
        e.locked && l.name in e.locked ? (le(), de("small", Bs, ge(JSON.stringify(e.locked[l.name])) + " · set by unattended mode", 1)) : l.type === "boolean" || l.type === "enum" ? (le(), de("select", {
          key: 2,
          class: "kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!f.value[l.name],
          "aria-describedby": f.value[l.name] ? `${Me(c)}-${l.name}-error` : void 0,
          value: p(l),
          onChange: (M) => y(l, M)
        }, [
          be("option", Zs, ge(E(l)), 1),
          l.type === "boolean" ? (le(), de(De, { key: 0 }, [
            i[2] || (i[2] = be("option", { value: "true" }, "on", -1)),
            i[3] || (i[3] = be("option", { value: "false" }, "off", -1))
          ], 64)) : (le(!0), de(De, { key: 1 }, Zt(l.values ?? [], (M) => (le(), de("option", {
            key: String(M),
            value: String(M)
          }, ge(M), 9, Qs))), 128))
        ], 40, Ws)) : l.type === "json" ? (le(), de("textarea", {
          key: 3,
          rows: "2",
          class: "ac-mono kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!f.value[l.name],
          "aria-describedby": f.value[l.name] ? `${Me(c)}-${l.name}-error` : void 0,
          value: N(l),
          placeholder: `JSON · ${E(l)}`,
          onInput: (M) => o(l, M)
        }, null, 40, Ys)) : (le(), de("input", {
          key: 4,
          class: "ac-mono kx-focus-halo",
          "aria-label": l.label || l.name,
          "aria-invalid": !!f.value[l.name],
          "aria-describedby": f.value[l.name] ? `${Me(c)}-${l.name}-error` : void 0,
          value: N(l),
          placeholder: l.type === "ids" ? "comma separated" : E(l),
          onInput: (M) => o(l, M)
        }, null, 40, Xs)),
        f.value[l.name] ? (le(), de("small", {
          key: 5,
          id: `${Me(c)}-${l.name}-error`,
          class: "kx-err",
          role: "alert"
        }, ge(f.value[l.name]), 9, ea)) : Te("", !0)
      ]))), 128)),
      g.value.length ? Te("", !0) : (le(), de("p", ta, "No matching options."))
    ]));
  }
});
export {
  oa as _,
  aa as a,
  na as d,
  sa as m
};
