import { ref as St, computed as me, watch as Ht, defineComponent as Rn, useId as Nn, openBlock as de, createElementBlock as fe, createElementVNode as ge, createTextVNode as Zt, toDisplayString as Ee, createCommentVNode as Ce, withDirectives as On, vModelText as kn, Fragment as Me, renderList as Qt, unref as Fe } from "vue";
import { g as In, d as jn } from "./presentation-C75LgO9q.js";
function Tn(e, n) {
  return e.agents.find((w) => n.some((d) => d.agent === w.id && d.usable && d.enabled))?.id ?? e.agents[0]?.id ?? "";
}
function Yt(e, n) {
  return e.filter((w) => w.usable && w.agents.includes(n));
}
function Cn(e) {
  return e.filter((n) => !n.profiles?.length || n.profiles.includes("batch"));
}
function is(e, n) {
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
function us(e, n, w, d = () => !1) {
  const S = In(), o = St(0), f = me(() => n.catalog()?.agents ?? []), c = me(() => f.value.find((a) => a.id === e.value.agent)), l = me(() => n.accounts().filter((a) => a.agent === e.value.agent && a.usable && a.enabled)), g = me(() => l.value.filter((a) => jn(a, S.value) === "ready")), v = me(() => Yt(n.images(), e.value.agent ?? "")), N = me(() => !!e.value.agent && !c.value), j = me(() => !v.value.some((a) => a.id === e.value.image_id)), O = me(() => !!e.value.account_id && !l.value.some((a) => a.id === e.value.account_id)), k = me(() => !!e.value.workspace_id && !n.workspaces().some((a) => a.id === e.value.workspace_id)), R = me(() => e.value.options ?? {});
  function p(a) {
    o.value = 0;
    const y = Yt(n.images(), a), P = f.value.find((i) => i.id === a);
    return {
      ...e.value,
      agent: a,
      account_id: "",
      options: {},
      unattended: !!P?.unattended,
      image_id: y.find((i) => i.id === e.value.image_id)?.id ?? y[0]?.id ?? ""
    };
  }
  function _() {
    const a = n.catalog();
    return { ...p(a ? Tn(a, n.accounts()) : ""), workspace_id: "" };
  }
  return w === "live" && (Ht([v, l, n.workspaces], () => {
    d() || (j.value && (e.value.image_id = v.value[0]?.id ?? ""), O.value && (e.value.account_id = ""), k.value && (e.value.workspace_id = ""));
  }, { immediate: !0 }), Ht(() => c.value?.id, () => {
    o.value = 0;
  })), {
    now: S,
    driver: c,
    agentAccounts: l,
    ready: g,
    agentImages: v,
    invalidAgent: N,
    invalidImage: j,
    invalidAccount: O,
    invalidWorkspace: k,
    invalidOptions: o,
    optionValues: R,
    selectAgent: p,
    initialSelection: _
  };
}
function yn(e) {
  return e && e.__esModule && Object.prototype.hasOwnProperty.call(e, "default") ? e.default : e;
}
var ze = { exports: {} }, Tt = {}, $e = {}, Re = {}, Ct = {}, qt = {}, At = {}, Xt;
function Pt() {
  return Xt || (Xt = 1, (function(e) {
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
    class d extends n {
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
        return (a = this._str) !== null && a !== void 0 ? a : this._str = this._items.reduce((y, P) => `${y}${P}`, "");
      }
      get names() {
        var a;
        return (a = this._names) !== null && a !== void 0 ? a : this._names = this._items.reduce((y, P) => (P instanceof w && (y[P.str] = (y[P.str] || 0) + 1), y), {});
      }
    }
    e._Code = d, e.nil = new d("");
    function S(_, ...a) {
      const y = [_[0]];
      let P = 0;
      for (; P < a.length; )
        c(y, a[P]), y.push(_[++P]);
      return new d(y);
    }
    e._ = S;
    const o = new d("+");
    function f(_, ...a) {
      const y = [O(_[0])];
      let P = 0;
      for (; P < a.length; )
        y.push(o), c(y, a[P]), y.push(o, O(_[++P]));
      return l(y), new d(y);
    }
    e.str = f;
    function c(_, a) {
      a instanceof d ? _.push(...a._items) : a instanceof w ? _.push(a) : _.push(N(a));
    }
    e.addCodeArg = c;
    function l(_) {
      let a = 1;
      for (; a < _.length - 1; ) {
        if (_[a] === o) {
          const y = g(_[a - 1], _[a + 1]);
          if (y !== void 0) {
            _.splice(a - 1, 3, y);
            continue;
          }
          _[a++] = "+";
        }
        a++;
      }
    }
    function g(_, a) {
      if (a === '""')
        return _;
      if (_ === '""')
        return a;
      if (typeof _ == "string")
        return a instanceof w || _[_.length - 1] !== '"' ? void 0 : typeof a != "string" ? `${_.slice(0, -1)}${a}"` : a[0] === '"' ? _.slice(0, -1) + a.slice(1) : void 0;
      if (typeof a == "string" && a[0] === '"' && !(_ instanceof w))
        return `"${_}${a.slice(1)}`;
    }
    function v(_, a) {
      return a.emptyStr() ? _ : _.emptyStr() ? a : f`${_}${a}`;
    }
    e.strConcat = v;
    function N(_) {
      return typeof _ == "number" || typeof _ == "boolean" || _ === null ? _ : O(Array.isArray(_) ? _.join(",") : _);
    }
    function j(_) {
      return new d(O(_));
    }
    e.stringify = j;
    function O(_) {
      return JSON.stringify(_).replace(/\u2028/g, "\\u2028").replace(/\u2029/g, "\\u2029");
    }
    e.safeStringify = O;
    function k(_) {
      return typeof _ == "string" && e.IDENTIFIER.test(_) ? new d(`.${_}`) : S`[${_}]`;
    }
    e.getProperty = k;
    function R(_) {
      if (typeof _ == "string" && e.IDENTIFIER.test(_))
        return new d(`${_}`);
      throw new Error(`CodeGen: invalid export name: ${_}, use explicit $id name mapping`);
    }
    e.getEsmExportName = R;
    function p(_) {
      return new d(_.toString());
    }
    e.regexpCode = p;
  })(At)), At;
}
var Dt = {}, er;
function tr() {
  return er || (er = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.ValueScope = e.ValueScopeName = e.Scope = e.varKinds = e.UsedValueState = void 0;
    const n = /* @__PURE__ */ Pt();
    class w extends Error {
      constructor(g) {
        super(`CodeGen: "code" for ${g} not defined`), this.value = g.value;
      }
    }
    var d;
    (function(l) {
      l[l.Started = 0] = "Started", l[l.Completed = 1] = "Completed";
    })(d || (e.UsedValueState = d = {})), e.varKinds = {
      const: new n.Name("const"),
      let: new n.Name("let"),
      var: new n.Name("var")
    };
    class S {
      constructor({ prefixes: g, parent: v } = {}) {
        this._names = {}, this._prefixes = g, this._parent = v;
      }
      toName(g) {
        return g instanceof n.Name ? g : this.name(g);
      }
      name(g) {
        return new n.Name(this._newName(g));
      }
      _newName(g) {
        const v = this._names[g] || this._nameGroup(g);
        return `${g}${v.index++}`;
      }
      _nameGroup(g) {
        var v, N;
        if (!((N = (v = this._parent) === null || v === void 0 ? void 0 : v._prefixes) === null || N === void 0) && N.has(g) || this._prefixes && !this._prefixes.has(g))
          throw new Error(`CodeGen: prefix "${g}" is not allowed in this scope`);
        return this._names[g] = { prefix: g, index: 0 };
      }
    }
    e.Scope = S;
    class o extends n.Name {
      constructor(g, v) {
        super(v), this.prefix = g;
      }
      setValue(g, { property: v, itemIndex: N }) {
        this.value = g, this.scopePath = (0, n._)`.${new n.Name(v)}[${N}]`;
      }
    }
    e.ValueScopeName = o;
    const f = (0, n._)`\n`;
    class c extends S {
      constructor(g) {
        super(g), this._values = {}, this._scope = g.scope, this.opts = { ...g, _n: g.lines ? f : n.nil };
      }
      get() {
        return this._scope;
      }
      name(g) {
        return new o(g, this._newName(g));
      }
      value(g, v) {
        var N;
        if (v.ref === void 0)
          throw new Error("CodeGen: ref must be passed in value");
        const j = this.toName(g), { prefix: O } = j, k = (N = v.key) !== null && N !== void 0 ? N : v.ref;
        let R = this._values[O];
        if (R) {
          const a = R.get(k);
          if (a)
            return a;
        } else
          R = this._values[O] = /* @__PURE__ */ new Map();
        R.set(k, j);
        const p = this._scope[O] || (this._scope[O] = []), _ = p.length;
        return p[_] = v.ref, j.setValue(v, { property: O, itemIndex: _ }), j;
      }
      getValue(g, v) {
        const N = this._values[g];
        if (N)
          return N.get(v);
      }
      scopeRefs(g, v = this._values) {
        return this._reduceValues(v, (N) => {
          if (N.scopePath === void 0)
            throw new Error(`CodeGen: name "${N}" has no value`);
          return (0, n._)`${g}${N.scopePath}`;
        });
      }
      scopeCode(g = this._values, v, N) {
        return this._reduceValues(g, (j) => {
          if (j.value === void 0)
            throw new Error(`CodeGen: name "${j}" has no value`);
          return j.value.code;
        }, v, N);
      }
      _reduceValues(g, v, N = {}, j) {
        let O = n.nil;
        for (const k in g) {
          const R = g[k];
          if (!R)
            continue;
          const p = N[k] = N[k] || /* @__PURE__ */ new Map();
          R.forEach((_) => {
            if (p.has(_))
              return;
            p.set(_, d.Started);
            let a = v(_);
            if (a) {
              const y = this.opts.es5 ? e.varKinds.var : e.varKinds.const;
              O = (0, n._)`${O}${y} ${_} = ${a};${this.opts._n}`;
            } else if (a = j?.(_))
              O = (0, n._)`${O}${a}${this.opts._n}`;
            else
              throw new w(_);
            p.set(_, d.Completed);
          });
        }
        return O;
      }
    }
    e.ValueScope = c;
  })(Dt)), Dt;
}
var rr;
function W() {
  return rr || (rr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.or = e.and = e.not = e.CodeGen = e.operators = e.varKinds = e.ValueScopeName = e.ValueScope = e.Scope = e.Name = e.regexpCode = e.stringify = e.getProperty = e.nil = e.strConcat = e.str = e._ = void 0;
    const n = /* @__PURE__ */ Pt(), w = /* @__PURE__ */ tr();
    var d = /* @__PURE__ */ Pt();
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
    var S = /* @__PURE__ */ tr();
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
    class o {
      optimizeNodes() {
        return this;
      }
      optimizeNames(t, r) {
        return this;
      }
    }
    class f extends o {
      constructor(t, r, $) {
        super(), this.varKind = t, this.name = r, this.rhs = $;
      }
      render({ es5: t, _n: r }) {
        const $ = t ? w.varKinds.var : this.varKind, C = this.rhs === void 0 ? "" : ` = ${this.rhs}`;
        return `${$} ${this.name}${C};` + r;
      }
      optimizeNames(t, r) {
        if (t[this.name.str])
          return this.rhs && (this.rhs = x(this.rhs, t, r)), this;
      }
      get names() {
        return this.rhs instanceof n._CodeOrName ? this.rhs.names : {};
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
        if (!(this.lhs instanceof n.Name && !t[this.lhs.str] && !this.sideEffects))
          return this.rhs = x(this.rhs, t, r), this;
      }
      get names() {
        const t = this.lhs instanceof n.Name ? {} : { ...this.lhs.names };
        return H(t, this.rhs);
      }
    }
    class l extends c {
      constructor(t, r, $, C) {
        super(t, $, C), this.op = r;
      }
      render({ _n: t }) {
        return `${this.lhs} ${this.op}= ${this.rhs};` + t;
      }
    }
    class g extends o {
      constructor(t) {
        super(), this.label = t, this.names = {};
      }
      render({ _n: t }) {
        return `${this.label}:` + t;
      }
    }
    class v extends o {
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
    class j extends o {
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
        return this.code instanceof n._CodeOrName ? this.code.names : {};
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
        let C = $.length;
        for (; C--; ) {
          const T = $[C];
          T.optimizeNames(t, r) || (Z(t, T.names), $.splice(C, 1));
        }
        return $.length > 0 ? this : void 0;
      }
      get names() {
        return this.nodes.reduce((t, r) => K(t, r.names), {});
      }
    }
    class k extends O {
      render(t) {
        return "{" + t._n + super.render(t) + "}" + t._n;
      }
    }
    class R extends O {
    }
    class p extends k {
    }
    p.kind = "else";
    class _ extends k {
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
          r = this.else = Array.isArray($) ? new p($) : $;
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
        return H(t, this.condition), this.else && K(t, this.else.names), t;
      }
    }
    _.kind = "if";
    class a extends k {
    }
    a.kind = "for";
    class y extends a {
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
        return K(super.names, this.iteration.names);
      }
    }
    class P extends a {
      constructor(t, r, $, C) {
        super(), this.varKind = t, this.name = r, this.from = $, this.to = C;
      }
      render(t) {
        const r = t.es5 ? w.varKinds.var : this.varKind, { name: $, from: C, to: T } = this;
        return `for(${r} ${$}=${C}; ${$}<${T}; ${$}++)` + super.render(t);
      }
      get names() {
        const t = H(super.names, this.from);
        return H(t, this.to);
      }
    }
    class i extends a {
      constructor(t, r, $, C) {
        super(), this.loop = t, this.varKind = r, this.name = $, this.iterable = C;
      }
      render(t) {
        return `for(${this.varKind} ${this.name} ${this.loop} ${this.iterable})` + super.render(t);
      }
      optimizeNames(t, r) {
        if (super.optimizeNames(t, r))
          return this.iterable = x(this.iterable, t, r), this;
      }
      get names() {
        return K(super.names, this.iterable.names);
      }
    }
    class s extends k {
      constructor(t, r, $) {
        super(), this.name = t, this.args = r, this.async = $;
      }
      render(t) {
        return `${this.async ? "async " : ""}function ${this.name}(${this.args})` + super.render(t);
      }
    }
    s.kind = "func";
    class m extends O {
      render(t) {
        return "return " + super.render(t);
      }
    }
    m.kind = "return";
    class E extends k {
      render(t) {
        let r = "try" + super.render(t);
        return this.catch && (r += this.catch.render(t)), this.finally && (r += this.finally.render(t)), r;
      }
      optimizeNodes() {
        var t, r;
        return super.optimizeNodes(), (t = this.catch) === null || t === void 0 || t.optimizeNodes(), (r = this.finally) === null || r === void 0 || r.optimizeNodes(), this;
      }
      optimizeNames(t, r) {
        var $, C;
        return super.optimizeNames(t, r), ($ = this.catch) === null || $ === void 0 || $.optimizeNames(t, r), (C = this.finally) === null || C === void 0 || C.optimizeNames(t, r), this;
      }
      get names() {
        const t = super.names;
        return this.catch && K(t, this.catch.names), this.finally && K(t, this.finally.names), t;
      }
    }
    class D extends k {
      constructor(t) {
        super(), this.error = t;
      }
      render(t) {
        return `catch(${this.error})` + super.render(t);
      }
    }
    D.kind = "catch";
    class U extends k {
      render(t) {
        return "finally" + super.render(t);
      }
    }
    U.kind = "finally";
    class M {
      constructor(t, r = {}) {
        this._values = {}, this._blockStarts = [], this._constants = {}, this.opts = { ...r, _n: r.lines ? `
` : "" }, this._extScope = t, this._scope = new w.Scope({ parent: t }), this._nodes = [new R()];
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
      _def(t, r, $, C) {
        const T = this._scope.toName(r);
        return $ !== void 0 && C && (this._constants[T.str] = $), this._leafNode(new f(t, T, $)), T;
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
        return this._leafNode(new l(t, e.operators.ADD, r));
      }
      // appends passed SafeExpr to code or executes Block
      code(t) {
        return typeof t == "function" ? t() : t !== n.nil && this._leafNode(new j(t)), this;
      }
      // returns code for object literal for the passed argument list of key-value pairs
      object(...t) {
        const r = ["{"];
        for (const [$, C] of t)
          r.length > 1 && r.push(","), r.push($), ($ !== C || this.opts.es5) && (r.push(":"), (0, n.addCodeArg)(r, C));
        return r.push("}"), new n._Code(r);
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
        return this._elseNode(new p());
      }
      // end `if` statement (needed if gen.if was used only with condition)
      endIf() {
        return this._endBlockNode(_, p);
      }
      _for(t, r) {
        return this._blockNode(t), r && this.code(r).endFor(), this;
      }
      // a generic `for` clause (or statement if `forBody` is passed)
      for(t, r) {
        return this._for(new y(t), r);
      }
      // `for` statement for a range of values
      forRange(t, r, $, C, T = this.opts.es5 ? w.varKinds.var : w.varKinds.let) {
        const F = this._scope.toName(t);
        return this._for(new P(T, F, r, $), () => C(F));
      }
      // `for-of` statement (in es5 mode replace with a normal for loop)
      forOf(t, r, $, C = w.varKinds.const) {
        const T = this._scope.toName(t);
        if (this.opts.es5) {
          const F = r instanceof n.Name ? r : this.var("_arr", r);
          return this.forRange("_i", 0, (0, n._)`${F}.length`, (G) => {
            this.var(T, (0, n._)`${F}[${G}]`), $(T);
          });
        }
        return this._for(new i("of", C, T, r), () => $(T));
      }
      // `for-in` statement.
      // With option `ownProperties` replaced with a `for-of` loop for object keys
      forIn(t, r, $, C = this.opts.es5 ? w.varKinds.var : w.varKinds.const) {
        if (this.opts.ownProperties)
          return this.forOf(t, (0, n._)`Object.keys(${r})`, $);
        const T = this._scope.toName(t);
        return this._for(new i("in", C, T, r), () => $(T));
      }
      // end `for` loop
      endFor() {
        return this._endBlockNode(a);
      }
      // `label` statement
      label(t) {
        return this._leafNode(new g(t));
      }
      // `break` statement
      break(t) {
        return this._leafNode(new v(t));
      }
      // `return` statement
      return(t) {
        const r = new m();
        if (this._blockNode(r), this.code(t), r.nodes.length !== 1)
          throw new Error('CodeGen: "return" should have one node');
        return this._endBlockNode(m);
      }
      // `try` statement
      try(t, r, $) {
        if (!r && !$)
          throw new Error('CodeGen: "try" without "catch" and "finally"');
        const C = new E();
        if (this._blockNode(C), this.code(t), r) {
          const T = this.name("e");
          this._currNode = C.catch = new D(T), r(T);
        }
        return $ && (this._currNode = C.finally = new U(), this.code($)), this._endBlockNode(D, U);
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
      func(t, r = n.nil, $, C) {
        return this._blockNode(new s(t, r, $)), C && this.code(C).endFunc(), this;
      }
      // end function definition
      endFunc() {
        return this._endBlockNode(s);
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
    e.CodeGen = M;
    function K(h, t) {
      for (const r in t)
        h[r] = (h[r] || 0) + (t[r] || 0);
      return h;
    }
    function H(h, t) {
      return t instanceof n._CodeOrName ? K(h, t.names) : h;
    }
    function x(h, t, r) {
      if (h instanceof n.Name)
        return $(h);
      if (!C(h))
        return h;
      return new n._Code(h._items.reduce((T, F) => (F instanceof n.Name && (F = $(F)), F instanceof n._Code ? T.push(...F._items) : T.push(F), T), []));
      function $(T) {
        const F = r[T.str];
        return F === void 0 || t[T.str] !== 1 ? T : (delete t[T.str], F);
      }
      function C(T) {
        return T instanceof n._Code && T._items.some((F) => F instanceof n.Name && t[F.str] === 1 && r[F.str] !== void 0);
      }
    }
    function Z(h, t) {
      for (const r in t)
        h[r] = (h[r] || 0) - (t[r] || 0);
    }
    function ie(h) {
      return typeof h == "boolean" || typeof h == "number" || h === null ? !h : (0, n._)`!${b(h)}`;
    }
    e.not = ie;
    const oe = u(e.operators.AND);
    function Y(...h) {
      return h.reduce(oe);
    }
    e.and = Y;
    const ue = u(e.operators.OR);
    function z(...h) {
      return h.reduce(ue);
    }
    e.or = z;
    function u(h) {
      return (t, r) => t === n.nil ? r : r === n.nil ? t : (0, n._)`${b(t)} ${h} ${b(r)}`;
    }
    function b(h) {
      return h instanceof n.Name ? h : (0, n._)`(${h})`;
    }
  })(qt)), qt;
}
var B = {}, nr;
function Q() {
  if (nr) return B;
  nr = 1, Object.defineProperty(B, "__esModule", { value: !0 }), B.checkStrictMode = B.getErrorPath = B.Type = B.useFunc = B.setEvaluated = B.evaluatedPropsToName = B.mergeEvaluated = B.eachItem = B.unescapeJsonPointer = B.escapeJsonPointer = B.escapeFragment = B.unescapeFragment = B.schemaRefOrVal = B.schemaHasRulesButRef = B.schemaHasRules = B.checkUnknownRules = B.alwaysValidSchema = B.toHash = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Pt();
  function w(i) {
    const s = {};
    for (const m of i)
      s[m] = !0;
    return s;
  }
  B.toHash = w;
  function d(i, s) {
    return typeof s == "boolean" ? s : Object.keys(s).length === 0 ? !0 : (S(i, s), !o(s, i.self.RULES.all));
  }
  B.alwaysValidSchema = d;
  function S(i, s = i.schema) {
    const { opts: m, self: E } = i;
    if (!m.strictSchema || typeof s == "boolean")
      return;
    const D = E.RULES.keywords;
    for (const U in s)
      D[U] || P(i, `unknown keyword: "${U}"`);
  }
  B.checkUnknownRules = S;
  function o(i, s) {
    if (typeof i == "boolean")
      return !i;
    for (const m in i)
      if (s[m])
        return !0;
    return !1;
  }
  B.schemaHasRules = o;
  function f(i, s) {
    if (typeof i == "boolean")
      return !i;
    for (const m in i)
      if (m !== "$ref" && s.all[m])
        return !0;
    return !1;
  }
  B.schemaHasRulesButRef = f;
  function c({ topSchemaRef: i, schemaPath: s }, m, E, D) {
    if (!D) {
      if (typeof m == "number" || typeof m == "boolean")
        return m;
      if (typeof m == "string")
        return (0, e._)`${m}`;
    }
    return (0, e._)`${i}${s}${(0, e.getProperty)(E)}`;
  }
  B.schemaRefOrVal = c;
  function l(i) {
    return N(decodeURIComponent(i));
  }
  B.unescapeFragment = l;
  function g(i) {
    return encodeURIComponent(v(i));
  }
  B.escapeFragment = g;
  function v(i) {
    return typeof i == "number" ? `${i}` : i.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  B.escapeJsonPointer = v;
  function N(i) {
    return i.replace(/~1/g, "/").replace(/~0/g, "~");
  }
  B.unescapeJsonPointer = N;
  function j(i, s) {
    if (Array.isArray(i))
      for (const m of i)
        s(m);
    else
      s(i);
  }
  B.eachItem = j;
  function O({ mergeNames: i, mergeToName: s, mergeValues: m, resultToName: E }) {
    return (D, U, M, K) => {
      const H = M === void 0 ? U : M instanceof e.Name ? (U instanceof e.Name ? i(D, U, M) : s(D, U, M), M) : U instanceof e.Name ? (s(D, M, U), U) : m(U, M);
      return K === e.Name && !(H instanceof e.Name) ? E(D, H) : H;
    };
  }
  B.mergeEvaluated = {
    props: O({
      mergeNames: (i, s, m) => i.if((0, e._)`${m} !== true && ${s} !== undefined`, () => {
        i.if((0, e._)`${s} === true`, () => i.assign(m, !0), () => i.assign(m, (0, e._)`${m} || {}`).code((0, e._)`Object.assign(${m}, ${s})`));
      }),
      mergeToName: (i, s, m) => i.if((0, e._)`${m} !== true`, () => {
        s === !0 ? i.assign(m, !0) : (i.assign(m, (0, e._)`${m} || {}`), R(i, m, s));
      }),
      mergeValues: (i, s) => i === !0 ? !0 : { ...i, ...s },
      resultToName: k
    }),
    items: O({
      mergeNames: (i, s, m) => i.if((0, e._)`${m} !== true && ${s} !== undefined`, () => i.assign(m, (0, e._)`${s} === true ? true : ${m} > ${s} ? ${m} : ${s}`)),
      mergeToName: (i, s, m) => i.if((0, e._)`${m} !== true`, () => i.assign(m, s === !0 ? !0 : (0, e._)`${m} > ${s} ? ${m} : ${s}`)),
      mergeValues: (i, s) => i === !0 ? !0 : Math.max(i, s),
      resultToName: (i, s) => i.var("items", s)
    })
  };
  function k(i, s) {
    if (s === !0)
      return i.var("props", !0);
    const m = i.var("props", (0, e._)`{}`);
    return s !== void 0 && R(i, m, s), m;
  }
  B.evaluatedPropsToName = k;
  function R(i, s, m) {
    Object.keys(m).forEach((E) => i.assign((0, e._)`${s}${(0, e.getProperty)(E)}`, !0));
  }
  B.setEvaluated = R;
  const p = {};
  function _(i, s) {
    return i.scopeValue("func", {
      ref: s,
      code: p[s.code] || (p[s.code] = new n._Code(s.code))
    });
  }
  B.useFunc = _;
  var a;
  (function(i) {
    i[i.Num = 0] = "Num", i[i.Str = 1] = "Str";
  })(a || (B.Type = a = {}));
  function y(i, s, m) {
    if (i instanceof e.Name) {
      const E = s === a.Num;
      return m ? E ? (0, e._)`"[" + ${i} + "]"` : (0, e._)`"['" + ${i} + "']"` : E ? (0, e._)`"/" + ${i}` : (0, e._)`"/" + ${i}.replace(/~/g, "~0").replace(/\\//g, "~1")`;
    }
    return m ? (0, e.getProperty)(i).toString() : "/" + v(i);
  }
  B.getErrorPath = y;
  function P(i, s, m = i.opts.strictSchema) {
    if (m) {
      if (s = `strict mode: ${s}`, m === !0)
        throw new Error(s);
      i.self.logger.warn(s);
    }
  }
  return B.checkStrictMode = P, B;
}
var Ve = {}, ar;
function Pe() {
  if (ar) return Ve;
  ar = 1, Object.defineProperty(Ve, "__esModule", { value: !0 });
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
  return Ve.default = n, Ve;
}
var sr;
function Nt() {
  return sr || (sr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.extendErrors = e.resetErrorsCount = e.reportExtraError = e.reportError = e.keyword$DataError = e.keywordError = void 0;
    const n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Pe();
    e.keywordError = {
      message: ({ keyword: p }) => (0, n.str)`must pass "${p}" keyword validation`
    }, e.keyword$DataError = {
      message: ({ keyword: p, schemaType: _ }) => _ ? (0, n.str)`"${p}" keyword must be ${_} ($data)` : (0, n.str)`"${p}" keyword is invalid ($data)`
    };
    function S(p, _ = e.keywordError, a, y) {
      const { it: P } = p, { gen: i, compositeRule: s, allErrors: m } = P, E = N(p, _, a);
      y ?? (s || m) ? l(i, E) : g(P, (0, n._)`[${E}]`);
    }
    e.reportError = S;
    function o(p, _ = e.keywordError, a) {
      const { it: y } = p, { gen: P, compositeRule: i, allErrors: s } = y, m = N(p, _, a);
      l(P, m), i || s || g(y, d.default.vErrors);
    }
    e.reportExtraError = o;
    function f(p, _) {
      p.assign(d.default.errors, _), p.if((0, n._)`${d.default.vErrors} !== null`, () => p.if(_, () => p.assign((0, n._)`${d.default.vErrors}.length`, _), () => p.assign(d.default.vErrors, null)));
    }
    e.resetErrorsCount = f;
    function c({ gen: p, keyword: _, schemaValue: a, data: y, errsCount: P, it: i }) {
      if (P === void 0)
        throw new Error("ajv implementation error");
      const s = p.name("err");
      p.forRange("i", P, d.default.errors, (m) => {
        p.const(s, (0, n._)`${d.default.vErrors}[${m}]`), p.if((0, n._)`${s}.instancePath === undefined`, () => p.assign((0, n._)`${s}.instancePath`, (0, n.strConcat)(d.default.instancePath, i.errorPath))), p.assign((0, n._)`${s}.schemaPath`, (0, n.str)`${i.errSchemaPath}/${_}`), i.opts.verbose && (p.assign((0, n._)`${s}.schema`, a), p.assign((0, n._)`${s}.data`, y));
      });
    }
    e.extendErrors = c;
    function l(p, _) {
      const a = p.const("err", _);
      p.if((0, n._)`${d.default.vErrors} === null`, () => p.assign(d.default.vErrors, (0, n._)`[${a}]`), (0, n._)`${d.default.vErrors}.push(${a})`), p.code((0, n._)`${d.default.errors}++`);
    }
    function g(p, _) {
      const { gen: a, validateName: y, schemaEnv: P } = p;
      P.$async ? a.throw((0, n._)`new ${p.ValidationError}(${_})`) : (a.assign((0, n._)`${y}.errors`, _), a.return(!1));
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
    function N(p, _, a) {
      const { createErrors: y } = p.it;
      return y === !1 ? (0, n._)`{}` : j(p, _, a);
    }
    function j(p, _, a = {}) {
      const { gen: y, it: P } = p, i = [
        O(P, a),
        k(p, a)
      ];
      return R(p, _, i), y.object(...i);
    }
    function O({ errorPath: p }, { instancePath: _ }) {
      const a = _ ? (0, n.str)`${p}${(0, w.getErrorPath)(_, w.Type.Str)}` : p;
      return [d.default.instancePath, (0, n.strConcat)(d.default.instancePath, a)];
    }
    function k({ keyword: p, it: { errSchemaPath: _ } }, { schemaPath: a, parentSchema: y }) {
      let P = y ? _ : (0, n.str)`${_}/${p}`;
      return a && (P = (0, n.str)`${P}${(0, w.getErrorPath)(a, w.Type.Str)}`), [v.schemaPath, P];
    }
    function R(p, { params: _, message: a }, y) {
      const { keyword: P, data: i, schemaValue: s, it: m } = p, { opts: E, propertyName: D, topSchemaRef: U, schemaPath: M } = m;
      y.push([v.keyword, P], [v.params, typeof _ == "function" ? _(p) : _ || (0, n._)`{}`]), E.messages && y.push([v.message, typeof a == "function" ? a(p) : a]), E.verbose && y.push([v.schema, s], [v.parentSchema, (0, n._)`${U}${M}`], [d.default.data, i]), D && y.push([v.propertyName, D]);
    }
  })(Ct)), Ct;
}
var or;
function qn() {
  if (or) return Re;
  or = 1, Object.defineProperty(Re, "__esModule", { value: !0 }), Re.boolOrEmptySchema = Re.topBoolOrEmptySchema = void 0;
  const e = /* @__PURE__ */ Nt(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Pe(), d = {
    message: "boolean schema is false"
  };
  function S(c) {
    const { gen: l, schema: g, validateName: v } = c;
    g === !1 ? f(c, !1) : typeof g == "object" && g.$async === !0 ? l.return(w.default.data) : (l.assign((0, n._)`${v}.errors`, null), l.return(!0));
  }
  Re.topBoolOrEmptySchema = S;
  function o(c, l) {
    const { gen: g, schema: v } = c;
    v === !1 ? (g.var(l, !1), f(c)) : g.var(l, !0);
  }
  Re.boolOrEmptySchema = o;
  function f(c, l) {
    const { gen: g, data: v } = c, N = {
      gen: g,
      keyword: "false schema",
      data: v,
      schema: !1,
      schemaCode: !1,
      schemaValue: !1,
      params: {},
      it: c
    };
    (0, e.reportError)(N, d, void 0, l);
  }
  return Re;
}
var ce = {}, Ne = {}, ir;
function vn() {
  if (ir) return Ne;
  ir = 1, Object.defineProperty(Ne, "__esModule", { value: !0 }), Ne.getRules = Ne.isJSONType = void 0;
  const e = ["string", "number", "integer", "boolean", "null", "object", "array"], n = new Set(e);
  function w(S) {
    return typeof S == "string" && n.has(S);
  }
  Ne.isJSONType = w;
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
  return Ne.getRules = d, Ne;
}
var we = {}, ur;
function _n() {
  if (ur) return we;
  ur = 1, Object.defineProperty(we, "__esModule", { value: !0 }), we.shouldUseRule = we.shouldUseGroup = we.schemaHasRulesForType = void 0;
  function e({ schema: d, self: S }, o) {
    const f = S.RULES.types[o];
    return f && f !== !0 && n(d, f);
  }
  we.schemaHasRulesForType = e;
  function n(d, S) {
    return S.rules.some((o) => w(d, o));
  }
  we.shouldUseGroup = n;
  function w(d, S) {
    var o;
    return d[S.keyword] !== void 0 || ((o = S.definition.implements) === null || o === void 0 ? void 0 : o.some((f) => d[f] !== void 0));
  }
  return we.shouldUseRule = w, we;
}
var cr;
function Rt() {
  if (cr) return ce;
  cr = 1, Object.defineProperty(ce, "__esModule", { value: !0 }), ce.reportTypeError = ce.checkDataTypes = ce.checkDataType = ce.coerceAndCheckDataType = ce.getJSONTypes = ce.getSchemaTypes = ce.DataType = void 0;
  const e = /* @__PURE__ */ vn(), n = /* @__PURE__ */ _n(), w = /* @__PURE__ */ Nt(), d = /* @__PURE__ */ W(), S = /* @__PURE__ */ Q();
  var o;
  (function(a) {
    a[a.Correct = 0] = "Correct", a[a.Wrong = 1] = "Wrong";
  })(o || (ce.DataType = o = {}));
  function f(a) {
    const y = c(a.type);
    if (y.includes("null")) {
      if (a.nullable === !1)
        throw new Error("type: null contradicts nullable: false");
    } else {
      if (!y.length && a.nullable !== void 0)
        throw new Error('"nullable" cannot be used without "type"');
      a.nullable === !0 && y.push("null");
    }
    return y;
  }
  ce.getSchemaTypes = f;
  function c(a) {
    const y = Array.isArray(a) ? a : a ? [a] : [];
    if (y.every(e.isJSONType))
      return y;
    throw new Error("type must be JSONType or JSONType[]: " + y.join(","));
  }
  ce.getJSONTypes = c;
  function l(a, y) {
    const { gen: P, data: i, opts: s } = a, m = v(y, s.coerceTypes), E = y.length > 0 && !(m.length === 0 && y.length === 1 && (0, n.schemaHasRulesForType)(a, y[0]));
    if (E) {
      const D = k(y, i, s.strictNumbers, o.Wrong);
      P.if(D, () => {
        m.length ? N(a, y, m) : p(a);
      });
    }
    return E;
  }
  ce.coerceAndCheckDataType = l;
  const g = /* @__PURE__ */ new Set(["string", "number", "integer", "boolean", "null"]);
  function v(a, y) {
    return y ? a.filter((P) => g.has(P) || y === "array" && P === "array") : [];
  }
  function N(a, y, P) {
    const { gen: i, data: s, opts: m } = a, E = i.let("dataType", (0, d._)`typeof ${s}`), D = i.let("coerced", (0, d._)`undefined`);
    m.coerceTypes === "array" && i.if((0, d._)`${E} == 'object' && Array.isArray(${s}) && ${s}.length == 1`, () => i.assign(s, (0, d._)`${s}[0]`).assign(E, (0, d._)`typeof ${s}`).if(k(y, s, m.strictNumbers), () => i.assign(D, s))), i.if((0, d._)`${D} !== undefined`);
    for (const M of P)
      (g.has(M) || M === "array" && m.coerceTypes === "array") && U(M);
    i.else(), p(a), i.endIf(), i.if((0, d._)`${D} !== undefined`, () => {
      i.assign(s, D), j(a, D);
    });
    function U(M) {
      switch (M) {
        case "string":
          i.elseIf((0, d._)`${E} == "number" || ${E} == "boolean"`).assign(D, (0, d._)`"" + ${s}`).elseIf((0, d._)`${s} === null`).assign(D, (0, d._)`""`);
          return;
        case "number":
          i.elseIf((0, d._)`${E} == "boolean" || ${s} === null
              || (${E} == "string" && ${s} && ${s} == +${s})`).assign(D, (0, d._)`+${s}`);
          return;
        case "integer":
          i.elseIf((0, d._)`${E} === "boolean" || ${s} === null
              || (${E} === "string" && ${s} && ${s} == +${s} && !(${s} % 1))`).assign(D, (0, d._)`+${s}`);
          return;
        case "boolean":
          i.elseIf((0, d._)`${s} === "false" || ${s} === 0 || ${s} === null`).assign(D, !1).elseIf((0, d._)`${s} === "true" || ${s} === 1`).assign(D, !0);
          return;
        case "null":
          i.elseIf((0, d._)`${s} === "" || ${s} === 0 || ${s} === false`), i.assign(D, null);
          return;
        case "array":
          i.elseIf((0, d._)`${E} === "string" || ${E} === "number"
              || ${E} === "boolean" || ${s} === null`).assign(D, (0, d._)`[${s}]`);
      }
    }
  }
  function j({ gen: a, parentData: y, parentDataProperty: P }, i) {
    a.if((0, d._)`${y} !== undefined`, () => a.assign((0, d._)`${y}[${P}]`, i));
  }
  function O(a, y, P, i = o.Correct) {
    const s = i === o.Correct ? d.operators.EQ : d.operators.NEQ;
    let m;
    switch (a) {
      case "null":
        return (0, d._)`${y} ${s} null`;
      case "array":
        m = (0, d._)`Array.isArray(${y})`;
        break;
      case "object":
        m = (0, d._)`${y} && typeof ${y} == "object" && !Array.isArray(${y})`;
        break;
      case "integer":
        m = E((0, d._)`!(${y} % 1) && !isNaN(${y})`);
        break;
      case "number":
        m = E();
        break;
      default:
        return (0, d._)`typeof ${y} ${s} ${a}`;
    }
    return i === o.Correct ? m : (0, d.not)(m);
    function E(D = d.nil) {
      return (0, d.and)((0, d._)`typeof ${y} == "number"`, D, P ? (0, d._)`isFinite(${y})` : d.nil);
    }
  }
  ce.checkDataType = O;
  function k(a, y, P, i) {
    if (a.length === 1)
      return O(a[0], y, P, i);
    let s;
    const m = (0, S.toHash)(a);
    if (m.array && m.object) {
      const E = (0, d._)`typeof ${y} != "object"`;
      s = m.null ? E : (0, d._)`!${y} || ${E}`, delete m.null, delete m.array, delete m.object;
    } else
      s = d.nil;
    m.number && delete m.integer;
    for (const E in m)
      s = (0, d.and)(s, O(E, y, P, i));
    return s;
  }
  ce.checkDataTypes = k;
  const R = {
    message: ({ schema: a }) => `must be ${a}`,
    params: ({ schema: a, schemaValue: y }) => typeof a == "string" ? (0, d._)`{type: ${a}}` : (0, d._)`{type: ${y}}`
  };
  function p(a) {
    const y = _(a);
    (0, w.reportError)(y, R);
  }
  ce.reportTypeError = p;
  function _(a) {
    const { gen: y, data: P, schema: i } = a, s = (0, S.schemaRefOrVal)(a, i, "type");
    return {
      gen: y,
      keyword: "type",
      data: P,
      schema: i.type,
      schemaCode: s,
      schemaValue: s,
      parentSchema: i,
      params: {},
      it: a
    };
  }
  return ce;
}
var qe = {}, lr;
function An() {
  if (lr) return qe;
  lr = 1, Object.defineProperty(qe, "__esModule", { value: !0 }), qe.assignDefaults = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q();
  function w(S, o) {
    const { properties: f, items: c } = S.schema;
    if (o === "object" && f)
      for (const l in f)
        d(S, l, f[l].default);
    else o === "array" && Array.isArray(c) && c.forEach((l, g) => d(S, g, l.default));
  }
  qe.assignDefaults = w;
  function d(S, o, f) {
    const { gen: c, compositeRule: l, data: g, opts: v } = S;
    if (f === void 0)
      return;
    const N = (0, e._)`${g}${(0, e.getProperty)(o)}`;
    if (l) {
      (0, n.checkStrictMode)(S, `default is ignored for: ${N}`);
      return;
    }
    let j = (0, e._)`${N} === undefined`;
    v.useDefaults === "empty" && (j = (0, e._)`${j} || ${N} === null || ${N} === ""`), c.if(j, (0, e._)`${N} = ${(0, e.stringify)(f)}`);
  }
  return qe;
}
var ve = {}, te = {}, dr;
function _e() {
  if (dr) return te;
  dr = 1, Object.defineProperty(te, "__esModule", { value: !0 }), te.validateUnion = te.validateArray = te.usePattern = te.callValidateCode = te.schemaProperties = te.allSchemaProperties = te.noPropertyInData = te.propertyInData = te.isOwnProperty = te.hasPropFunc = te.reportMissingProp = te.checkMissingProp = te.checkReportMissingProp = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Pe(), d = /* @__PURE__ */ Q();
  function S(a, y) {
    const { gen: P, data: i, it: s } = a;
    P.if(v(P, i, y, s.opts.ownProperties), () => {
      a.setParams({ missingProperty: (0, e._)`${y}` }, !0), a.error();
    });
  }
  te.checkReportMissingProp = S;
  function o({ gen: a, data: y, it: { opts: P } }, i, s) {
    return (0, e.or)(...i.map((m) => (0, e.and)(v(a, y, m, P.ownProperties), (0, e._)`${s} = ${m}`)));
  }
  te.checkMissingProp = o;
  function f(a, y) {
    a.setParams({ missingProperty: y }, !0), a.error();
  }
  te.reportMissingProp = f;
  function c(a) {
    return a.scopeValue("func", {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      ref: Object.prototype.hasOwnProperty,
      code: (0, e._)`Object.prototype.hasOwnProperty`
    });
  }
  te.hasPropFunc = c;
  function l(a, y, P) {
    return (0, e._)`${c(a)}.call(${y}, ${P})`;
  }
  te.isOwnProperty = l;
  function g(a, y, P, i) {
    const s = (0, e._)`${y}${(0, e.getProperty)(P)} !== undefined`;
    return i ? (0, e._)`${s} && ${l(a, y, P)}` : s;
  }
  te.propertyInData = g;
  function v(a, y, P, i) {
    const s = (0, e._)`${y}${(0, e.getProperty)(P)} === undefined`;
    return i ? (0, e.or)(s, (0, e.not)(l(a, y, P))) : s;
  }
  te.noPropertyInData = v;
  function N(a) {
    return a ? Object.keys(a).filter((y) => y !== "__proto__") : [];
  }
  te.allSchemaProperties = N;
  function j(a, y) {
    return N(y).filter((P) => !(0, n.alwaysValidSchema)(a, y[P]));
  }
  te.schemaProperties = j;
  function O({ schemaCode: a, data: y, it: { gen: P, topSchemaRef: i, schemaPath: s, errorPath: m }, it: E }, D, U, M) {
    const K = M ? (0, e._)`${a}, ${y}, ${i}${s}` : y, H = [
      [w.default.instancePath, (0, e.strConcat)(w.default.instancePath, m)],
      [w.default.parentData, E.parentData],
      [w.default.parentDataProperty, E.parentDataProperty],
      [w.default.rootData, w.default.rootData]
    ];
    E.opts.dynamicRef && H.push([w.default.dynamicAnchors, w.default.dynamicAnchors]);
    const x = (0, e._)`${K}, ${P.object(...H)}`;
    return U !== e.nil ? (0, e._)`${D}.call(${U}, ${x})` : (0, e._)`${D}(${x})`;
  }
  te.callValidateCode = O;
  const k = (0, e._)`new RegExp`;
  function R({ gen: a, it: { opts: y } }, P) {
    const i = y.unicodeRegExp ? "u" : "", { regExp: s } = y.code, m = s(P, i);
    return a.scopeValue("pattern", {
      key: m.toString(),
      ref: m,
      code: (0, e._)`${s.code === "new RegExp" ? k : (0, d.useFunc)(a, s)}(${P}, ${i})`
    });
  }
  te.usePattern = R;
  function p(a) {
    const { gen: y, data: P, keyword: i, it: s } = a, m = y.name("valid");
    if (s.allErrors) {
      const D = y.let("valid", !0);
      return E(() => y.assign(D, !1)), D;
    }
    return y.var(m, !0), E(() => y.break()), m;
    function E(D) {
      const U = y.const("len", (0, e._)`${P}.length`);
      y.forRange("i", 0, U, (M) => {
        a.subschema({
          keyword: i,
          dataProp: M,
          dataPropType: n.Type.Num
        }, m), y.if((0, e.not)(m), D);
      });
    }
  }
  te.validateArray = p;
  function _(a) {
    const { gen: y, schema: P, keyword: i, it: s } = a;
    if (!Array.isArray(P))
      throw new Error("ajv implementation error");
    if (P.some((U) => (0, n.alwaysValidSchema)(s, U)) && !s.opts.unevaluated)
      return;
    const E = y.let("valid", !1), D = y.name("_valid");
    y.block(() => P.forEach((U, M) => {
      const K = a.subschema({
        keyword: i,
        schemaProp: M,
        compositeRule: !0
      }, D);
      y.assign(E, (0, e._)`${E} || ${D}`), a.mergeValidEvaluated(K, D) || y.if((0, e.not)(E));
    })), a.result(E, () => a.reset(), () => a.error(!0));
  }
  return te.validateUnion = _, te;
}
var fr;
function Dn() {
  if (fr) return ve;
  fr = 1, Object.defineProperty(ve, "__esModule", { value: !0 }), ve.validateKeywordUsage = ve.validSchemaType = ve.funcKeywordCode = ve.macroKeywordCode = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Pe(), w = /* @__PURE__ */ _e(), d = /* @__PURE__ */ Nt();
  function S(j, O) {
    const { gen: k, keyword: R, schema: p, parentSchema: _, it: a } = j, y = O.macro.call(a.self, p, _, a), P = g(k, R, y);
    a.opts.validateSchema !== !1 && a.self.validateSchema(y, !0);
    const i = k.name("valid");
    j.subschema({
      schema: y,
      schemaPath: e.nil,
      errSchemaPath: `${a.errSchemaPath}/${R}`,
      topSchemaRef: P,
      compositeRule: !0
    }, i), j.pass(i, () => j.error(!0));
  }
  ve.macroKeywordCode = S;
  function o(j, O) {
    var k;
    const { gen: R, keyword: p, schema: _, parentSchema: a, $data: y, it: P } = j;
    l(P, O);
    const i = !y && O.compile ? O.compile.call(P.self, _, a, P) : O.validate, s = g(R, p, i), m = R.let("valid");
    j.block$data(m, E), j.ok((k = O.valid) !== null && k !== void 0 ? k : m);
    function E() {
      if (O.errors === !1)
        M(), O.modifying && f(j), K(() => j.error());
      else {
        const H = O.async ? D() : U();
        O.modifying && f(j), K(() => c(j, H));
      }
    }
    function D() {
      const H = R.let("ruleErrs", null);
      return R.try(() => M((0, e._)`await `), (x) => R.assign(m, !1).if((0, e._)`${x} instanceof ${P.ValidationError}`, () => R.assign(H, (0, e._)`${x}.errors`), () => R.throw(x))), H;
    }
    function U() {
      const H = (0, e._)`${s}.errors`;
      return R.assign(H, null), M(e.nil), H;
    }
    function M(H = O.async ? (0, e._)`await ` : e.nil) {
      const x = P.opts.passContext ? n.default.this : n.default.self, Z = !("compile" in O && !y || O.schema === !1);
      R.assign(m, (0, e._)`${H}${(0, w.callValidateCode)(j, s, x, Z)}`, O.modifying);
    }
    function K(H) {
      var x;
      R.if((0, e.not)((x = O.valid) !== null && x !== void 0 ? x : m), H);
    }
  }
  ve.funcKeywordCode = o;
  function f(j) {
    const { gen: O, data: k, it: R } = j;
    O.if(R.parentData, () => O.assign(k, (0, e._)`${R.parentData}[${R.parentDataProperty}]`));
  }
  function c(j, O) {
    const { gen: k } = j;
    k.if((0, e._)`Array.isArray(${O})`, () => {
      k.assign(n.default.vErrors, (0, e._)`${n.default.vErrors} === null ? ${O} : ${n.default.vErrors}.concat(${O})`).assign(n.default.errors, (0, e._)`${n.default.vErrors}.length`), (0, d.extendErrors)(j);
    }, () => j.error());
  }
  function l({ schemaEnv: j }, O) {
    if (O.async && !j.$async)
      throw new Error("async keyword in sync schema");
  }
  function g(j, O, k) {
    if (k === void 0)
      throw new Error(`keyword "${O}" failed to compile`);
    return j.scopeValue("keyword", typeof k == "function" ? { ref: k } : { ref: k, code: (0, e.stringify)(k) });
  }
  function v(j, O, k = !1) {
    return !O.length || O.some((R) => R === "array" ? Array.isArray(j) : R === "object" ? j && typeof j == "object" && !Array.isArray(j) : typeof j == R || k && typeof j > "u");
  }
  ve.validSchemaType = v;
  function N({ schema: j, opts: O, self: k, errSchemaPath: R }, p, _) {
    if (Array.isArray(p.keyword) ? !p.keyword.includes(_) : p.keyword !== _)
      throw new Error("ajv implementation error");
    const a = p.dependencies;
    if (a?.some((y) => !Object.prototype.hasOwnProperty.call(j, y)))
      throw new Error(`parent schema must have dependencies of ${_}: ${a.join(",")}`);
    if (p.validateSchema && !p.validateSchema(j[_])) {
      const P = `keyword "${_}" value is invalid at path "${R}": ` + k.errorsText(p.validateSchema.errors);
      if (O.validateSchema === "log")
        k.logger.error(P);
      else
        throw new Error(P);
    }
  }
  return ve.validateKeywordUsage = N, ve;
}
var be = {}, hr;
function Mn() {
  if (hr) return be;
  hr = 1, Object.defineProperty(be, "__esModule", { value: !0 }), be.extendSubschemaMode = be.extendSubschemaData = be.getSubschema = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q();
  function w(o, { keyword: f, schemaProp: c, schema: l, schemaPath: g, errSchemaPath: v, topSchemaRef: N }) {
    if (f !== void 0 && l !== void 0)
      throw new Error('both "keyword" and "schema" passed, only one allowed');
    if (f !== void 0) {
      const j = o.schema[f];
      return c === void 0 ? {
        schema: j,
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(f)}`,
        errSchemaPath: `${o.errSchemaPath}/${f}`
      } : {
        schema: j[c],
        schemaPath: (0, e._)`${o.schemaPath}${(0, e.getProperty)(f)}${(0, e.getProperty)(c)}`,
        errSchemaPath: `${o.errSchemaPath}/${f}/${(0, n.escapeFragment)(c)}`
      };
    }
    if (l !== void 0) {
      if (g === void 0 || v === void 0 || N === void 0)
        throw new Error('"schemaPath", "errSchemaPath" and "topSchemaRef" are required with "schema"');
      return {
        schema: l,
        schemaPath: g,
        topSchemaRef: N,
        errSchemaPath: v
      };
    }
    throw new Error('either "keyword" or "schema" must be passed');
  }
  be.getSubschema = w;
  function d(o, f, { dataProp: c, dataPropType: l, data: g, dataTypes: v, propertyName: N }) {
    if (g !== void 0 && c !== void 0)
      throw new Error('both "data" and "dataProp" passed, only one allowed');
    const { gen: j } = f;
    if (c !== void 0) {
      const { errorPath: k, dataPathArr: R, opts: p } = f, _ = j.let("data", (0, e._)`${f.data}${(0, e.getProperty)(c)}`, !0);
      O(_), o.errorPath = (0, e.str)`${k}${(0, n.getErrorPath)(c, l, p.jsPropertySyntax)}`, o.parentDataProperty = (0, e._)`${c}`, o.dataPathArr = [...R, o.parentDataProperty];
    }
    if (g !== void 0) {
      const k = g instanceof e.Name ? g : j.let("data", g, !0);
      O(k), N !== void 0 && (o.propertyName = N);
    }
    v && (o.dataTypes = v);
    function O(k) {
      o.data = k, o.dataLevel = f.dataLevel + 1, o.dataTypes = [], f.definedProperties = /* @__PURE__ */ new Set(), o.parentData = f.data, o.dataNames = [...f.dataNames, k];
    }
  }
  be.extendSubschemaData = d;
  function S(o, { jtdDiscriminator: f, jtdMetadata: c, compositeRule: l, createErrors: g, allErrors: v }) {
    l !== void 0 && (o.compositeRule = l), g !== void 0 && (o.createErrors = g), v !== void 0 && (o.allErrors = v), o.jtdDiscriminator = f, o.jtdMetadata = c;
  }
  return be.extendSubschemaMode = S, be;
}
var le = {}, Mt, mr;
function gn() {
  return mr || (mr = 1, Mt = function e(n, w) {
    if (n === w) return !0;
    if (n && w && typeof n == "object" && typeof w == "object") {
      if (n.constructor !== w.constructor) return !1;
      var d, S, o;
      if (Array.isArray(n)) {
        if (d = n.length, d != w.length) return !1;
        for (S = d; S-- !== 0; )
          if (!e(n[S], w[S])) return !1;
        return !0;
      }
      if (n.constructor === RegExp) return n.source === w.source && n.flags === w.flags;
      if (n.valueOf !== Object.prototype.valueOf) return n.valueOf() === w.valueOf();
      if (n.toString !== Object.prototype.toString) return n.toString() === w.toString();
      if (o = Object.keys(n), d = o.length, d !== Object.keys(w).length) return !1;
      for (S = d; S-- !== 0; )
        if (!Object.prototype.hasOwnProperty.call(w, o[S])) return !1;
      for (S = d; S-- !== 0; ) {
        var f = o[S];
        if (!e(n[f], w[f])) return !1;
      }
      return !0;
    }
    return n !== n && w !== w;
  }), Mt;
}
var Ft = { exports: {} }, pr;
function Fn() {
  if (pr) return Ft.exports;
  pr = 1;
  var e = Ft.exports = function(d, S, o) {
    typeof S == "function" && (o = S, S = {}), o = S.cb || o;
    var f = typeof o == "function" ? o : o.pre || function() {
    }, c = o.post || function() {
    };
    n(S, f, c, d, "", d);
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
  function n(d, S, o, f, c, l, g, v, N, j) {
    if (f && typeof f == "object" && !Array.isArray(f)) {
      S(f, c, l, g, v, N, j);
      for (var O in f) {
        var k = f[O];
        if (Array.isArray(k)) {
          if (O in e.arrayKeywords)
            for (var R = 0; R < k.length; R++)
              n(d, S, o, k[R], c + "/" + O + "/" + R, l, c, O, f, R);
        } else if (O in e.propsKeywords) {
          if (k && typeof k == "object")
            for (var p in k)
              n(d, S, o, k[p], c + "/" + O + "/" + w(p), l, c, O, f, p);
        } else (O in e.keywords || d.allKeys && !(O in e.skipKeywords)) && n(d, S, o, k, c + "/" + O, l, c, O, f);
      }
      o(f, c, l, g, v, N, j);
    }
  }
  function w(d) {
    return d.replace(/~/g, "~0").replace(/\//g, "~1");
  }
  return Ft.exports;
}
var yr;
function Ot() {
  if (yr) return le;
  yr = 1, Object.defineProperty(le, "__esModule", { value: !0 }), le.getSchemaRefs = le.resolveUrl = le.normalizeId = le._getFullPath = le.getFullPath = le.inlineRef = void 0;
  const e = /* @__PURE__ */ Q(), n = gn(), w = Fn(), d = /* @__PURE__ */ new Set([
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
  function S(R, p = !0) {
    return typeof R == "boolean" ? !0 : p === !0 ? !f(R) : p ? c(R) <= p : !1;
  }
  le.inlineRef = S;
  const o = /* @__PURE__ */ new Set([
    "$ref",
    "$recursiveRef",
    "$recursiveAnchor",
    "$dynamicRef",
    "$dynamicAnchor"
  ]);
  function f(R) {
    for (const p in R) {
      if (o.has(p))
        return !0;
      const _ = R[p];
      if (Array.isArray(_) && _.some(f) || typeof _ == "object" && f(_))
        return !0;
    }
    return !1;
  }
  function c(R) {
    let p = 0;
    for (const _ in R) {
      if (_ === "$ref")
        return 1 / 0;
      if (p++, !d.has(_) && (typeof R[_] == "object" && (0, e.eachItem)(R[_], (a) => p += c(a)), p === 1 / 0))
        return 1 / 0;
    }
    return p;
  }
  function l(R, p = "", _) {
    _ !== !1 && (p = N(p));
    const a = R.parse(p);
    return g(R, a);
  }
  le.getFullPath = l;
  function g(R, p) {
    return R.serialize(p).split("#")[0] + "#";
  }
  le._getFullPath = g;
  const v = /#\/?$/;
  function N(R) {
    return R ? R.replace(v, "") : "";
  }
  le.normalizeId = N;
  function j(R, p, _) {
    return _ = N(_), R.resolve(p, _);
  }
  le.resolveUrl = j;
  const O = /^[a-z_][-a-z0-9._]*$/i;
  function k(R, p) {
    if (typeof R == "boolean")
      return {};
    const { schemaId: _, uriResolver: a } = this.opts, y = N(R[_] || p), P = { "": y }, i = l(a, y, !1), s = {}, m = /* @__PURE__ */ new Set();
    return w(R, { allKeys: !0 }, (U, M, K, H) => {
      if (H === void 0)
        return;
      const x = i + M;
      let Z = P[H];
      typeof U[_] == "string" && (Z = ie.call(this, U[_])), oe.call(this, U.$anchor), oe.call(this, U.$dynamicAnchor), P[M] = Z;
      function ie(Y) {
        const ue = this.opts.uriResolver.resolve;
        if (Y = N(Z ? ue(Z, Y) : Y), m.has(Y))
          throw D(Y);
        m.add(Y);
        let z = this.refs[Y];
        return typeof z == "string" && (z = this.refs[z]), typeof z == "object" ? E(U, z.schema, Y) : Y !== N(x) && (Y[0] === "#" ? (E(U, s[Y], Y), s[Y] = U) : this.refs[Y] = x), Y;
      }
      function oe(Y) {
        if (typeof Y == "string") {
          if (!O.test(Y))
            throw new Error(`invalid anchor "${Y}"`);
          ie.call(this, `#${Y}`);
        }
      }
    }), s;
    function E(U, M, K) {
      if (M !== void 0 && !n(U, M))
        throw D(K);
    }
    function D(U) {
      return new Error(`reference "${U}" resolves to more than one schema`);
    }
  }
  return le.getSchemaRefs = k, le;
}
var vr;
function kt() {
  if (vr) return $e;
  vr = 1, Object.defineProperty($e, "__esModule", { value: !0 }), $e.getData = $e.KeywordCxt = $e.validateFunctionCode = void 0;
  const e = /* @__PURE__ */ qn(), n = /* @__PURE__ */ Rt(), w = /* @__PURE__ */ _n(), d = /* @__PURE__ */ Rt(), S = /* @__PURE__ */ An(), o = /* @__PURE__ */ Dn(), f = /* @__PURE__ */ Mn(), c = /* @__PURE__ */ W(), l = /* @__PURE__ */ Pe(), g = /* @__PURE__ */ Ot(), v = /* @__PURE__ */ Q(), N = /* @__PURE__ */ Nt();
  function j(I) {
    if (i(I) && (m(I), P(I))) {
      p(I);
      return;
    }
    O(I, () => (0, e.topBoolOrEmptySchema)(I));
  }
  $e.validateFunctionCode = j;
  function O({ gen: I, validateName: q, schema: A, schemaEnv: V, opts: L }, J) {
    L.code.es5 ? I.func(q, (0, c._)`${l.default.data}, ${l.default.valCxt}`, V.$async, () => {
      I.code((0, c._)`"use strict"; ${a(A, L)}`), R(I, L), I.code(J);
    }) : I.func(q, (0, c._)`${l.default.data}, ${k(L)}`, V.$async, () => I.code(a(A, L)).code(J));
  }
  function k(I) {
    return (0, c._)`{${l.default.instancePath}="", ${l.default.parentData}, ${l.default.parentDataProperty}, ${l.default.rootData}=${l.default.data}${I.dynamicRef ? (0, c._)`, ${l.default.dynamicAnchors}={}` : c.nil}}={}`;
  }
  function R(I, q) {
    I.if(l.default.valCxt, () => {
      I.var(l.default.instancePath, (0, c._)`${l.default.valCxt}.${l.default.instancePath}`), I.var(l.default.parentData, (0, c._)`${l.default.valCxt}.${l.default.parentData}`), I.var(l.default.parentDataProperty, (0, c._)`${l.default.valCxt}.${l.default.parentDataProperty}`), I.var(l.default.rootData, (0, c._)`${l.default.valCxt}.${l.default.rootData}`), q.dynamicRef && I.var(l.default.dynamicAnchors, (0, c._)`${l.default.valCxt}.${l.default.dynamicAnchors}`);
    }, () => {
      I.var(l.default.instancePath, (0, c._)`""`), I.var(l.default.parentData, (0, c._)`undefined`), I.var(l.default.parentDataProperty, (0, c._)`undefined`), I.var(l.default.rootData, l.default.data), q.dynamicRef && I.var(l.default.dynamicAnchors, (0, c._)`{}`);
    });
  }
  function p(I) {
    const { schema: q, opts: A, gen: V } = I;
    O(I, () => {
      A.$comment && q.$comment && H(I), U(I), V.let(l.default.vErrors, null), V.let(l.default.errors, 0), A.unevaluated && _(I), E(I), x(I);
    });
  }
  function _(I) {
    const { gen: q, validateName: A } = I;
    I.evaluated = q.const("evaluated", (0, c._)`${A}.evaluated`), q.if((0, c._)`${I.evaluated}.dynamicProps`, () => q.assign((0, c._)`${I.evaluated}.props`, (0, c._)`undefined`)), q.if((0, c._)`${I.evaluated}.dynamicItems`, () => q.assign((0, c._)`${I.evaluated}.items`, (0, c._)`undefined`));
  }
  function a(I, q) {
    const A = typeof I == "object" && I[q.schemaId];
    return A && (q.code.source || q.code.process) ? (0, c._)`/*# sourceURL=${A} */` : c.nil;
  }
  function y(I, q) {
    if (i(I) && (m(I), P(I))) {
      s(I, q);
      return;
    }
    (0, e.boolOrEmptySchema)(I, q);
  }
  function P({ schema: I, self: q }) {
    if (typeof I == "boolean")
      return !I;
    for (const A in I)
      if (q.RULES.all[A])
        return !0;
    return !1;
  }
  function i(I) {
    return typeof I.schema != "boolean";
  }
  function s(I, q) {
    const { schema: A, gen: V, opts: L } = I;
    L.$comment && A.$comment && H(I), M(I), K(I);
    const J = V.const("_errs", l.default.errors);
    E(I, J), V.var(q, (0, c._)`${J} === ${l.default.errors}`);
  }
  function m(I) {
    (0, v.checkUnknownRules)(I), D(I);
  }
  function E(I, q) {
    if (I.opts.jtd)
      return ie(I, [], !1, q);
    const A = (0, n.getSchemaTypes)(I.schema), V = (0, n.coerceAndCheckDataType)(I, A);
    ie(I, A, !V, q);
  }
  function D(I) {
    const { schema: q, errSchemaPath: A, opts: V, self: L } = I;
    q.$ref && V.ignoreKeywordsWithRef && (0, v.schemaHasRulesButRef)(q, L.RULES) && L.logger.warn(`$ref: keywords ignored in schema at path "${A}"`);
  }
  function U(I) {
    const { schema: q, opts: A } = I;
    q.default !== void 0 && A.useDefaults && A.strictSchema && (0, v.checkStrictMode)(I, "default is ignored in the schema root");
  }
  function M(I) {
    const q = I.schema[I.opts.schemaId];
    q && (I.baseId = (0, g.resolveUrl)(I.opts.uriResolver, I.baseId, q));
  }
  function K(I) {
    if (I.schema.$async && !I.schemaEnv.$async)
      throw new Error("async schema in sync schema");
  }
  function H({ gen: I, schemaEnv: q, schema: A, errSchemaPath: V, opts: L }) {
    const J = A.$comment;
    if (L.$comment === !0)
      I.code((0, c._)`${l.default.self}.logger.log(${J})`);
    else if (typeof L.$comment == "function") {
      const ne = (0, c.str)`${V}/$comment`, re = I.scopeValue("root", { ref: q.root });
      I.code((0, c._)`${l.default.self}.opts.$comment(${J}, ${ne}, ${re}.schema)`);
    }
  }
  function x(I) {
    const { gen: q, schemaEnv: A, validateName: V, ValidationError: L, opts: J } = I;
    A.$async ? q.if((0, c._)`${l.default.errors} === 0`, () => q.return(l.default.data), () => q.throw((0, c._)`new ${L}(${l.default.vErrors})`)) : (q.assign((0, c._)`${V}.errors`, l.default.vErrors), J.unevaluated && Z(I), q.return((0, c._)`${l.default.errors} === 0`));
  }
  function Z({ gen: I, evaluated: q, props: A, items: V }) {
    A instanceof c.Name && I.assign((0, c._)`${q}.props`, A), V instanceof c.Name && I.assign((0, c._)`${q}.items`, V);
  }
  function ie(I, q, A, V) {
    const { gen: L, schema: J, data: ne, allErrors: re, opts: ae, self: ee } = I, { RULES: X } = ee;
    if (J.$ref && (ae.ignoreKeywordsWithRef || !(0, v.schemaHasRulesButRef)(J, X))) {
      L.block(() => C(I, "$ref", X.all.$ref.definition));
      return;
    }
    ae.jtd || Y(I, q), L.block(() => {
      for (const se of X.rules)
        ye(se);
      ye(X.post);
    });
    function ye(se) {
      (0, w.shouldUseGroup)(J, se) && (se.type ? (L.if((0, d.checkDataType)(se.type, ne, ae.strictNumbers)), oe(I, se), q.length === 1 && q[0] === se.type && A && (L.else(), (0, d.reportTypeError)(I)), L.endIf()) : oe(I, se), re || L.if((0, c._)`${l.default.errors} === ${V || 0}`));
    }
  }
  function oe(I, q) {
    const { gen: A, schema: V, opts: { useDefaults: L } } = I;
    L && (0, S.assignDefaults)(I, q.type), A.block(() => {
      for (const J of q.rules)
        (0, w.shouldUseRule)(V, J) && C(I, J.keyword, J.definition, q.type);
    });
  }
  function Y(I, q) {
    I.schemaEnv.meta || !I.opts.strictTypes || (ue(I, q), I.opts.allowUnionTypes || z(I, q), u(I, I.dataTypes));
  }
  function ue(I, q) {
    if (q.length) {
      if (!I.dataTypes.length) {
        I.dataTypes = q;
        return;
      }
      q.forEach((A) => {
        h(I.dataTypes, A) || r(I, `type "${A}" not allowed by context "${I.dataTypes.join(",")}"`);
      }), t(I, q);
    }
  }
  function z(I, q) {
    q.length > 1 && !(q.length === 2 && q.includes("null")) && r(I, "use allowUnionTypes to allow union type keyword");
  }
  function u(I, q) {
    const A = I.self.RULES.all;
    for (const V in A) {
      const L = A[V];
      if (typeof L == "object" && (0, w.shouldUseRule)(I.schema, L)) {
        const { type: J } = L.definition;
        J.length && !J.some((ne) => b(q, ne)) && r(I, `missing type "${J.join(",")}" for keyword "${V}"`);
      }
    }
  }
  function b(I, q) {
    return I.includes(q) || q === "number" && I.includes("integer");
  }
  function h(I, q) {
    return I.includes(q) || q === "integer" && I.includes("number");
  }
  function t(I, q) {
    const A = [];
    for (const V of I.dataTypes)
      h(q, V) ? A.push(V) : q.includes("integer") && V === "number" && A.push("integer");
    I.dataTypes = A;
  }
  function r(I, q) {
    const A = I.schemaEnv.baseId + I.errSchemaPath;
    q += ` at "${A}" (strictTypes)`, (0, v.checkStrictMode)(I, q, I.opts.strictTypes);
  }
  class $ {
    constructor(q, A, V) {
      if ((0, o.validateKeywordUsage)(q, A, V), this.gen = q.gen, this.allErrors = q.allErrors, this.keyword = V, this.data = q.data, this.schema = q.schema[V], this.$data = A.$data && q.opts.$data && this.schema && this.schema.$data, this.schemaValue = (0, v.schemaRefOrVal)(q, this.schema, V, this.$data), this.schemaType = A.schemaType, this.parentSchema = q.schema, this.params = {}, this.it = q, this.def = A, this.$data)
        this.schemaCode = q.gen.const("vSchema", G(this.$data, q));
      else if (this.schemaCode = this.schemaValue, !(0, o.validSchemaType)(this.schema, A.schemaType, A.allowUndefined))
        throw new Error(`${V} value must be ${JSON.stringify(A.schemaType)}`);
      ("code" in A ? A.trackErrors : A.errors !== !1) && (this.errsCount = q.gen.const("_errs", l.default.errors));
    }
    result(q, A, V) {
      this.failResult((0, c.not)(q), A, V);
    }
    failResult(q, A, V) {
      this.gen.if(q), V ? V() : this.error(), A ? (this.gen.else(), A(), this.allErrors && this.gen.endIf()) : this.allErrors ? this.gen.endIf() : this.gen.else();
    }
    pass(q, A) {
      this.failResult((0, c.not)(q), void 0, A);
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
      const { schemaCode: A } = this;
      this.fail((0, c._)`${A} !== undefined && (${(0, c.or)(this.invalid$data(), q)})`);
    }
    error(q, A, V) {
      if (A) {
        this.setParams(A), this._error(q, V), this.setParams({});
        return;
      }
      this._error(q, V);
    }
    _error(q, A) {
      (q ? N.reportExtraError : N.reportError)(this, this.def.error, A);
    }
    $dataError() {
      (0, N.reportError)(this, this.def.$dataError || N.keyword$DataError);
    }
    reset() {
      if (this.errsCount === void 0)
        throw new Error('add "trackErrors" to keyword definition');
      (0, N.resetErrorsCount)(this.gen, this.errsCount);
    }
    ok(q) {
      this.allErrors || this.gen.if(q);
    }
    setParams(q, A) {
      A ? Object.assign(this.params, q) : this.params = q;
    }
    block$data(q, A, V = c.nil) {
      this.gen.block(() => {
        this.check$data(q, V), A();
      });
    }
    check$data(q = c.nil, A = c.nil) {
      if (!this.$data)
        return;
      const { gen: V, schemaCode: L, schemaType: J, def: ne } = this;
      V.if((0, c.or)((0, c._)`${L} === undefined`, A)), q !== c.nil && V.assign(q, !0), (J.length || ne.validateSchema) && (V.elseIf(this.invalid$data()), this.$dataError(), q !== c.nil && V.assign(q, !1)), V.else();
    }
    invalid$data() {
      const { gen: q, schemaCode: A, schemaType: V, def: L, it: J } = this;
      return (0, c.or)(ne(), re());
      function ne() {
        if (V.length) {
          if (!(A instanceof c.Name))
            throw new Error("ajv implementation error");
          const ae = Array.isArray(V) ? V : [V];
          return (0, c._)`${(0, d.checkDataTypes)(ae, A, J.opts.strictNumbers, d.DataType.Wrong)}`;
        }
        return c.nil;
      }
      function re() {
        if (L.validateSchema) {
          const ae = q.scopeValue("validate$data", { ref: L.validateSchema });
          return (0, c._)`!${ae}(${A})`;
        }
        return c.nil;
      }
    }
    subschema(q, A) {
      const V = (0, f.getSubschema)(this.it, q);
      (0, f.extendSubschemaData)(V, this.it, q), (0, f.extendSubschemaMode)(V, q);
      const L = { ...this.it, ...V, items: void 0, props: void 0 };
      return y(L, A), L;
    }
    mergeEvaluated(q, A) {
      const { it: V, gen: L } = this;
      V.opts.unevaluated && (V.props !== !0 && q.props !== void 0 && (V.props = v.mergeEvaluated.props(L, q.props, V.props, A)), V.items !== !0 && q.items !== void 0 && (V.items = v.mergeEvaluated.items(L, q.items, V.items, A)));
    }
    mergeValidEvaluated(q, A) {
      const { it: V, gen: L } = this;
      if (V.opts.unevaluated && (V.props !== !0 || V.items !== !0))
        return L.if(A, () => this.mergeEvaluated(q, c.Name)), !0;
    }
  }
  $e.KeywordCxt = $;
  function C(I, q, A, V) {
    const L = new $(I, A, q);
    "code" in A ? A.code(L, V) : L.$data && A.validate ? (0, o.funcKeywordCode)(L, A) : "macro" in A ? (0, o.macroKeywordCode)(L, A) : (A.compile || A.validate) && (0, o.funcKeywordCode)(L, A);
  }
  const T = /^\/(?:[^~]|~0|~1)*$/, F = /^([0-9]+)(#|\/(?:[^~]|~0|~1)*)?$/;
  function G(I, { dataLevel: q, dataNames: A, dataPathArr: V }) {
    let L, J;
    if (I === "")
      return l.default.rootData;
    if (I[0] === "/") {
      if (!T.test(I))
        throw new Error(`Invalid JSON-pointer: ${I}`);
      L = I, J = l.default.rootData;
    } else {
      const ee = F.exec(I);
      if (!ee)
        throw new Error(`Invalid JSON-pointer: ${I}`);
      const X = +ee[1];
      if (L = ee[2], L === "#") {
        if (X >= q)
          throw new Error(ae("property/index", X));
        return V[q - X];
      }
      if (X > q)
        throw new Error(ae("data", X));
      if (J = A[q - X], !L)
        return J;
    }
    let ne = J;
    const re = L.split("/");
    for (const ee of re)
      ee && (J = (0, c._)`${J}${(0, c.getProperty)((0, v.unescapeJsonPointer)(ee))}`, ne = (0, c._)`${ne} && ${J}`);
    return ne;
    function ae(ee, X) {
      return `Cannot access ${ee} ${X} levels up, current level is ${q}`;
    }
  }
  return $e.getData = G, $e;
}
var Ue = {}, _r;
function xt() {
  if (_r) return Ue;
  _r = 1, Object.defineProperty(Ue, "__esModule", { value: !0 });
  class e extends Error {
    constructor(w) {
      super("validation failed"), this.errors = w, this.ajv = this.validation = !0;
    }
  }
  return Ue.default = e, Ue;
}
var Le = {}, gr;
function It() {
  if (gr) return Le;
  gr = 1, Object.defineProperty(Le, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Ot();
  class n extends Error {
    constructor(d, S, o, f) {
      super(f || `can't resolve reference ${o} from id ${S}`), this.missingRef = (0, e.resolveUrl)(d, S, o), this.missingSchema = (0, e.normalizeId)((0, e.getFullPath)(d, this.missingRef));
    }
  }
  return Le.default = n, Le;
}
var he = {}, $r;
function Gt() {
  if ($r) return he;
  $r = 1, Object.defineProperty(he, "__esModule", { value: !0 }), he.resolveSchema = he.getCompilingSchema = he.resolveRef = he.compileSchema = he.SchemaEnv = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ xt(), w = /* @__PURE__ */ Pe(), d = /* @__PURE__ */ Ot(), S = /* @__PURE__ */ Q(), o = /* @__PURE__ */ kt();
  class f {
    constructor(_) {
      var a;
      this.refs = {}, this.dynamicAnchors = {};
      let y;
      typeof _.schema == "object" && (y = _.schema), this.schema = _.schema, this.schemaId = _.schemaId, this.root = _.root || this, this.baseId = (a = _.baseId) !== null && a !== void 0 ? a : (0, d.normalizeId)(y?.[_.schemaId || "$id"]), this.schemaPath = _.schemaPath, this.localRefs = _.localRefs, this.meta = _.meta, this.$async = y?.$async, this.refs = {};
    }
  }
  he.SchemaEnv = f;
  function c(p) {
    const _ = v.call(this, p);
    if (_)
      return _;
    const a = (0, d.getFullPath)(this.opts.uriResolver, p.root.baseId), { es5: y, lines: P } = this.opts.code, { ownProperties: i } = this.opts, s = new e.CodeGen(this.scope, { es5: y, lines: P, ownProperties: i });
    let m;
    p.$async && (m = s.scopeValue("Error", {
      ref: n.default,
      code: (0, e._)`require("ajv/dist/runtime/validation_error").default`
    }));
    const E = s.scopeName("validate");
    p.validateName = E;
    const D = {
      gen: s,
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
      topSchemaRef: s.scopeValue("schema", this.opts.code.source === !0 ? { ref: p.schema, code: (0, e.stringify)(p.schema) } : { ref: p.schema }),
      validateName: E,
      ValidationError: m,
      schema: p.schema,
      schemaEnv: p,
      rootId: a,
      baseId: p.baseId || a,
      schemaPath: e.nil,
      errSchemaPath: p.schemaPath || (this.opts.jtd ? "" : "#"),
      errorPath: (0, e._)`""`,
      opts: this.opts,
      self: this
    };
    let U;
    try {
      this._compilations.add(p), (0, o.validateFunctionCode)(D), s.optimize(this.opts.code.optimize);
      const M = s.toString();
      U = `${s.scopeRefs(w.default.scope)}return ${M}`, this.opts.code.process && (U = this.opts.code.process(U, p));
      const H = new Function(`${w.default.self}`, `${w.default.scope}`, U)(this, this.scope.get());
      if (this.scope.value(E, { ref: H }), H.errors = null, H.schema = p.schema, H.schemaEnv = p, p.$async && (H.$async = !0), this.opts.code.source === !0 && (H.source = { validateName: E, validateCode: M, scopeValues: s._values }), this.opts.unevaluated) {
        const { props: x, items: Z } = D;
        H.evaluated = {
          props: x instanceof e.Name ? void 0 : x,
          items: Z instanceof e.Name ? void 0 : Z,
          dynamicProps: x instanceof e.Name,
          dynamicItems: Z instanceof e.Name
        }, H.source && (H.source.evaluated = (0, e.stringify)(H.evaluated));
      }
      return p.validate = H, p;
    } catch (M) {
      throw delete p.validate, delete p.validateName, U && this.logger.error("Error compiling schema, function code:", U), M;
    } finally {
      this._compilations.delete(p);
    }
  }
  he.compileSchema = c;
  function l(p, _, a) {
    var y;
    a = (0, d.resolveUrl)(this.opts.uriResolver, _, a);
    const P = p.refs[a];
    if (P)
      return P;
    let i = j.call(this, p, a);
    if (i === void 0) {
      const s = (y = p.localRefs) === null || y === void 0 ? void 0 : y[a], { schemaId: m } = this.opts;
      s && (i = new f({ schema: s, schemaId: m, root: p, baseId: _ }));
    }
    if (i !== void 0)
      return p.refs[a] = g.call(this, i);
  }
  he.resolveRef = l;
  function g(p) {
    return (0, d.inlineRef)(p.schema, this.opts.inlineRefs) ? p.schema : p.validate ? p : c.call(this, p);
  }
  function v(p) {
    for (const _ of this._compilations)
      if (N(_, p))
        return _;
  }
  he.getCompilingSchema = v;
  function N(p, _) {
    return p.schema === _.schema && p.root === _.root && p.baseId === _.baseId;
  }
  function j(p, _) {
    let a;
    for (; typeof (a = this.refs[_]) == "string"; )
      _ = a;
    return a || this.schemas[_] || O.call(this, p, _);
  }
  function O(p, _) {
    const a = this.opts.uriResolver.parse(_), y = (0, d._getFullPath)(this.opts.uriResolver, a);
    let P = (0, d.getFullPath)(this.opts.uriResolver, p.baseId, void 0);
    if (Object.keys(p.schema).length > 0 && y === P)
      return R.call(this, a, p);
    const i = (0, d.normalizeId)(y), s = this.refs[i] || this.schemas[i];
    if (typeof s == "string") {
      const m = O.call(this, p, s);
      return typeof m?.schema != "object" ? void 0 : R.call(this, a, m);
    }
    if (typeof s?.schema == "object") {
      if (s.validate || c.call(this, s), i === (0, d.normalizeId)(_)) {
        const { schema: m } = s, { schemaId: E } = this.opts, D = m[E];
        return D && (P = (0, d.resolveUrl)(this.opts.uriResolver, P, D)), new f({ schema: m, schemaId: E, root: p, baseId: P });
      }
      return R.call(this, a, s);
    }
  }
  he.resolveSchema = O;
  const k = /* @__PURE__ */ new Set([
    "properties",
    "patternProperties",
    "enum",
    "dependencies",
    "definitions"
  ]);
  function R(p, { baseId: _, schema: a, root: y }) {
    var P;
    if (((P = p.fragment) === null || P === void 0 ? void 0 : P[0]) !== "/")
      return;
    for (const m of p.fragment.slice(1).split("/")) {
      if (typeof a == "boolean")
        return;
      const E = a[(0, S.unescapeFragment)(m)];
      if (E === void 0)
        return;
      a = E;
      const D = typeof a == "object" && a[this.opts.schemaId];
      !k.has(m) && D && (_ = (0, d.resolveUrl)(this.opts.uriResolver, _, D));
    }
    let i;
    if (typeof a != "boolean" && a.$ref && !(0, S.schemaHasRulesButRef)(a, this.RULES)) {
      const m = (0, d.resolveUrl)(this.opts.uriResolver, _, a.$ref);
      i = O.call(this, y, m);
    }
    const { schemaId: s } = this.opts;
    if (i = i || new f({ schema: a, schemaId: s, root: y, baseId: _ }), i.schema !== i.root.schema)
      return i;
  }
  return he;
}
const zn = "https://raw.githubusercontent.com/ajv-validator/ajv/master/lib/refs/data.json#", Vn = "Meta-schema for $data reference (JSON AnySchema extension proposal)", Un = "object", Ln = ["$data"], Kn = { $data: { type: "string", anyOf: [{ format: "relative-json-pointer" }, { format: "json-pointer" }] } }, Hn = !1, xn = {
  $id: zn,
  description: Vn,
  type: Un,
  required: Ln,
  properties: Kn,
  additionalProperties: Hn
};
var Ke = {}, Ae = { exports: {} }, zt, wr;
function $n() {
  if (wr) return zt;
  wr = 1;
  const e = RegExp.prototype.test.bind(/^[\da-f]{8}-[\da-f]{4}-[\da-f]{4}-[\da-f]{4}-[\da-f]{12}$/iu), n = RegExp.prototype.test.bind(/^(?:(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)\.){3}(?:25[0-5]|2[0-4]\d|1\d{2}|[1-9]\d|\d)$/u), w = RegExp.prototype.test.bind(/^\d*$/u), d = RegExp.prototype.test.bind(/^[\da-f]{2}$/iu), S = RegExp.prototype.test.bind(/^[\da-z\-._~]$/iu), o = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/]$/u), f = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:@/?]$/u), c = RegExp.prototype.test.bind(/^[A-Za-z0-9\-._~!$&'()*+,;=:]$/u), l = new Array(256);
  {
    const u = "0123456789ABCDEF";
    for (let b = 0; b < 256; b++)
      l[b] = "%" + u[b >> 4] + u[b & 15];
  }
  function g(u) {
    return u < 2048 ? l[192 | u >> 6] + l[128 | u & 63] : u < 65536 ? l[224 | u >> 12] + l[128 | u >> 6 & 63] + l[128 | u & 63] : l[240 | u >> 18] + l[128 | u >> 12 & 63] + l[128 | u >> 6 & 63] + l[128 | u & 63];
  }
  function v(u) {
    let b = "", h = 0, t = 0;
    for (t = 0; t < u.length; t++)
      if (h = u[t].charCodeAt(0), h !== 48) {
        if (!(h >= 48 && h <= 57 || h >= 65 && h <= 70 || h >= 97 && h <= 102))
          return "";
        b += u[t];
        break;
      }
    for (t += 1; t < u.length; t++) {
      if (h = u[t].charCodeAt(0), !(h >= 48 && h <= 57 || h >= 65 && h <= 70 || h >= 97 && h <= 102))
        return "";
      b += u[t];
    }
    return b;
  }
  const N = RegExp.prototype.test.bind(/^[\dA-Fa-f]{1,4}$/), j = RegExp.prototype.test.bind(/^[vV][\dA-Fa-f]+\.[A-Za-z\d\-._~!$&'()*+,;=:]+$/), O = RegExp.prototype.test.bind(/^[A-Za-z\d\-._~]$/), k = RegExp.prototype.test.bind(/[^!"$&'()*+,\-.;=_`a-z{}~]/u);
  function R(u) {
    if (u.length === 0) return !1;
    for (let b = 0; b < u.length; b++)
      if (!O(u[b])) {
        if (u[b] === "%" && b + 2 < u.length && d(u.slice(b + 1, b + 3))) {
          b += 2;
          continue;
        }
        return !1;
      }
    return !0;
  }
  function p(u) {
    let b = -1, h = 0, t = -1, r = 0;
    for (let T = 0; T < u.length; T++)
      u[T] === "0" ? (t === -1 && (t = T), r++, r > h && (h = r, b = t)) : (t = -1, r = 0);
    if (h < 2) return u.join(":");
    const $ = u.slice(0, b).join(":"), C = u.slice(b + h).join(":");
    return $ + "::" + C;
  }
  function _(u) {
    const b = u.indexOf("::");
    if (b !== -1 && u.indexOf("::", b + 1) !== -1) return;
    const h = b === -1 ? u.split(":") : u.slice(0, b).split(":"), t = b === -1 ? [] : u.slice(b + 2).split(":");
    b !== -1 && (h.length === 1 && h[0] === "" && (h.length = 0), t.length === 1 && t[0] === "" && (t.length = 0));
    const r = h.concat(t);
    let $ = 0;
    for (let T = 0; T < r.length; T++) {
      const F = r[T];
      if (F === "") return;
      if (F.indexOf(".") !== -1) {
        if (T !== r.length - 1 || b !== -1 && t.length === 0 || !n(F)) return;
        $ += 2;
        continue;
      }
      if (!N(F)) return;
      r[T] = parseInt(F, 16).toString(16), $++;
    }
    if (b === -1)
      return $ !== 8 ? void 0 : p(r);
    if ($ >= 8) return;
    const C = r.slice(0, h.length);
    for (let T = $; T < 8; T++) C.push("0");
    for (let T = h.length; T < r.length; T++) C.push(r[T]);
    return p(C);
  }
  function a(u) {
    const b = u[0] === "[" && u[u.length - 1] === "]";
    if ((u[0] === "[" || u[u.length - 1] === "]") && !b) return { host: u, isIPV6: !1, error: !0 };
    let t = b ? u.slice(1, -1) : u;
    if (b && j(t))
      return t = t.toLowerCase(), { host: `[${t}]`, escapedHost: t, isIPV6: !1, isIPVFuture: !0 };
    if (y(t, ":") < 2)
      return { host: u, isIPV6: !1, error: b };
    let r = "";
    const $ = t.indexOf("%");
    if ($ !== -1) {
      const T = t.slice($, $ + 3).toLowerCase() === "%25" ? 3 : 1;
      if (r = t.slice($ + T), !R(r)) return { host: u, isIPV6: !1, error: !0 };
      t = t.slice(0, $);
    }
    const C = _(t);
    return C === void 0 ? { host: u, isIPV6: !1, error: !0 } : {
      host: C + (r ? "%" + r : ""),
      escapedHost: C + (r ? "%25" + r : ""),
      isIPV6: !0
    };
  }
  function y(u, b) {
    let h = 0;
    for (let t = 0; t < u.length; t++)
      u[t] === b && h++;
    return h;
  }
  function P(u) {
    let b = u;
    const h = [];
    let t = -1, r = 0;
    for (; r = b.length; ) {
      if (r === 1) {
        if (b === ".")
          break;
        if (b === "/") {
          h.push("/");
          break;
        } else {
          h.push(b);
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
          h.push("/");
          break;
        }
      } else if (r === 3 && b === "/..") {
        h.length !== 0 && h.pop(), h.push("/");
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
          b = b.slice(3), h.length !== 0 && h.pop();
          continue;
        }
      }
      if ((t = b.indexOf("/", 1)) === -1) {
        h.push(b);
        break;
      } else
        h.push(b.slice(0, t)), b = b.slice(t);
    }
    return h.join("");
  }
  function i(u) {
    if (u === "" || u[0] === "/")
      return P(u);
    const b = u.split("/"), h = b.length - 1, t = [];
    let r = !1;
    for (let $ = 0; $ <= h; $++) {
      const C = b[$];
      C === "." || C === ".." ? (C === ".." && (t.length !== 0 && t[t.length - 1] !== ".." ? t.pop() : t.push("..")), r = $ === h) : t.push(C);
    }
    return r && t[t.length - 1] !== ".." && t.push(""), (t.length === 0 || t[0] === "" || t[0].includes(":")) && t.unshift("."), t.join("/");
  }
  const s = { "@": "%40", "/": "%2F", "?": "%3F", "#": "%23", ":": "%3A" }, m = /[@/?#:]/g, E = /[@/?#]/g;
  function D(u, b) {
    const h = b ? E : m;
    return h.lastIndex = 0, u.replace(h, (t) => s[t]);
  }
  function U(u, b = !1) {
    if (u.indexOf("%") === -1)
      return u;
    let h = "";
    for (let t = 0; t < u.length; t++) {
      if (u[t] === "%" && t + 2 < u.length) {
        const r = u.slice(t + 1, t + 3);
        if (d(r)) {
          const $ = r.toUpperCase(), C = String.fromCharCode(parseInt($, 16));
          b && S(C) ? h += C : h += "%" + $, t += 2;
          continue;
        }
      }
      h += u[t];
    }
    return h;
  }
  function M(u) {
    let b = "";
    for (let h = 0; h < u.length; h++) {
      const t = u[h];
      if (t === "%" && h + 2 < u.length) {
        const r = u.slice(h + 1, h + 3);
        if (d(r)) {
          const $ = r.toUpperCase(), C = String.fromCharCode(parseInt($, 16));
          C !== "." && S(C) ? b += C : b += "%" + $, h += 2;
          continue;
        }
      }
      if (o(t))
        b += t;
      else {
        const r = u.charCodeAt(h);
        if (r < 128)
          b += oe(r) ? t : l[r];
        else if (r < 55296 || r > 57343)
          b += g(r);
        else if (r <= 56319 && h + 1 < u.length) {
          const $ = u.charCodeAt(h + 1);
          $ >= 56320 && $ <= 57343 ? (b += g(65536 + (r - 55296 << 10) + ($ - 56320)), h++) : b += g(65533);
        } else
          b += g(65533);
      }
    }
    return b;
  }
  function K(u, b = !1) {
    let h = "", t = b && u[0] !== "/";
    for (let r = 0; r < u.length; r++) {
      const $ = u[r];
      if ($ === "%" && r + 2 < u.length) {
        const C = u.slice(r + 1, r + 3);
        if (d(C)) {
          h += "%" + C.toUpperCase(), r += 2;
          continue;
        }
      }
      if ($ === "/" && (t = !1), o($) && ($ !== ":" || !t))
        h += $;
      else {
        const C = u.charCodeAt(r);
        if (C < 128)
          h += l[C];
        else if (C < 55296 || C > 57343)
          h += g(C);
        else if (C <= 56319 && r + 1 < u.length) {
          const T = u.charCodeAt(r + 1);
          T >= 56320 && T <= 57343 ? (h += g(65536 + (C - 55296 << 10) + (T - 56320)), r++) : h += g(65533);
        } else
          h += g(65533);
      }
    }
    return h;
  }
  function H(u, b) {
    let h = "";
    for (let t = 0; t < u.length; t++) {
      const r = u[t];
      if (r === "%" && t + 2 < u.length) {
        const $ = u.slice(t + 1, t + 3);
        if (d($)) {
          h += "%" + $.toUpperCase(), t += 2;
          continue;
        }
      }
      if (b(r))
        h += r;
      else {
        const $ = u.charCodeAt(t);
        if ($ < 128)
          h += l[$];
        else if ($ < 55296 || $ > 57343)
          h += g($);
        else if ($ <= 56319 && t + 1 < u.length) {
          const C = u.charCodeAt(t + 1);
          C >= 56320 && C <= 57343 ? (h += g(65536 + ($ - 55296 << 10) + (C - 56320)), t++) : h += g(65533);
        } else
          h += g(65533);
      }
    }
    return h;
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
    for (let h = 0; h < u.length; h++) {
      const t = u[h];
      if (t === "%" && h + 2 < u.length) {
        const r = u.slice(h + 1, h + 3);
        if (d(r)) {
          const $ = r.toUpperCase(), C = String.fromCharCode(parseInt($, 16));
          S(C) ? b += C : b += "%" + $, h += 2;
          continue;
        }
      }
      if (f(t))
        b += t;
      else {
        const r = u.charCodeAt(h);
        if (r < 128)
          b += oe(r) ? t : l[r];
        else if (r < 55296 || r > 57343)
          b += g(r);
        else if (r <= 56319 && h + 1 < u.length) {
          const $ = u.charCodeAt(h + 1);
          $ >= 56320 && $ <= 57343 ? (b += g(65536 + (r - 55296 << 10) + ($ - 56320)), h++) : b += g(65533);
        } else
          b += g(65533);
      }
    }
    return b;
  }
  function ue(u) {
    let b = "";
    for (let h = 0; h < u.length; h++) {
      if (u[h] === "%" && h + 2 < u.length) {
        const t = u.slice(h + 1, h + 3);
        if (d(t)) {
          b += "%" + t.toUpperCase(), h += 2;
          continue;
        }
      }
      b += escape(u[h]);
    }
    return b;
  }
  function z(u) {
    const b = [];
    if (u.userinfo !== void 0 && (b.push(x(u.userinfo)), b.push("@")), u.host !== void 0) {
      let h = u.host;
      if (!n(h)) {
        let t = a(h);
        t.isIPV6 !== !0 && t.isIPVFuture !== !0 && (h = U(h, !0), t = a(h)), t.isIPV6 === !0 || t.isIPVFuture === !0 ? h = `[${t.escapedHost}]` : h = D(h, !1);
      }
      b.push(h);
    }
    if (typeof u.port == "number" || typeof u.port == "string") {
      const h = String(u.port);
      if (!w(h))
        throw new TypeError("URI port is malformed.");
      b.push(":"), b.push(h);
    }
    return b.length ? b.join("") : void 0;
  }
  return zt = {
    nonSimpleDomain: k,
    recomposeAuthority: z,
    reescapeHostDelimiters: D,
    normalizePercentEncoding: U,
    normalizePathEncoding: M,
    serializePathEncoding: K,
    normalizeQueryFragmentEncoding: Y,
    encodeUserinfo: x,
    encodeQuery: Z,
    encodeFragment: ie,
    escapePreservingEscapes: ue,
    removeDotSegments: P,
    removeDotSegmentsRelative: i,
    isIPv4: n,
    isUUID: e,
    normalizeIPv6: a,
    stringArrayToHexStripped: v
  }, zt;
}
var Vt, br;
function Gn() {
  if (br) return Vt;
  br = 1;
  const { isUUID: e } = $n(), n = /^([\da-z][\d\-a-z]{0,31}):((?:[\w!$'()*+,\-./:;=@]|%[\da-f]{2})+)$/iu, w = (
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
  function d(i) {
    return w.indexOf(
      /** @type {*} */
      i
    ) !== -1;
  }
  function S(i) {
    return i.secure === !0 ? !0 : i.secure === !1 ? !1 : i.scheme ? i.scheme.length === 3 && (i.scheme[0] === "w" || i.scheme[0] === "W") && (i.scheme[1] === "s" || i.scheme[1] === "S") && (i.scheme[2] === "s" || i.scheme[2] === "S") : !1;
  }
  function o(i) {
    return i.host || (i.error = i.error || "HTTP URIs must have a host."), i;
  }
  function f(i) {
    const s = String(i.scheme).toLowerCase() === "https";
    return (i.port === (s ? 443 : 80) || i.port === "") && (i.port = void 0), i.path || (i.path = "/"), i;
  }
  function c(i) {
    return i.secure = S(i), i.resourceName = (i.path || "/") + (i.query ? "?" + i.query : ""), i.path = void 0, i.query = void 0, i;
  }
  function l(i) {
    if ((i.port === (S(i) ? 443 : 80) || i.port === "") && (i.port = void 0), typeof i.secure == "boolean" && (i.scheme = i.secure ? "wss" : "ws", i.secure = void 0), i.resourceName) {
      const s = i.resourceName.indexOf("?"), m = s === -1 ? i.resourceName : i.resourceName.slice(0, s);
      i.path = m && m !== "/" ? m : void 0, i.query = s === -1 ? void 0 : i.resourceName.slice(s + 1), i.resourceName = void 0;
    }
    return i.fragment = void 0, i;
  }
  function g(i, s) {
    if (!i.path)
      return i.error = "URN can not be parsed", i;
    const m = i.path.match(n);
    if (m && m[0] === i.path) {
      const E = s.scheme || i.scheme || "urn";
      i.nid = m[1].toLowerCase(), i.nss = m[2];
      const D = `${E}:${s.nid || i.nid}`, U = P(D);
      i.path = void 0, U && (i = U.parse(i, s));
    } else
      i.error = i.error || "URN can not be parsed.";
    return i;
  }
  function v(i, s) {
    if (i.nid === void 0)
      throw new Error("URN without nid cannot be serialized");
    const m = s.scheme || i.scheme || "urn", E = i.nid.toLowerCase(), D = `${m}:${s.nid || E}`, U = P(D);
    U && (i = U.serialize(i, s));
    const M = i, K = i.nss;
    return M.path = `${E || s.nid}:${K}`, s.skipEscape = !0, M;
  }
  function N(i, s) {
    const m = i;
    return m.uuid = m.nss, m.nss = void 0, !s.tolerant && (!m.uuid || !e(m.uuid)) && (m.error = m.error || "UUID is not valid."), m;
  }
  function j(i) {
    const s = i;
    return s.nss = (i.uuid || "").toLowerCase(), s;
  }
  const O = (
    /** @type {SchemeHandler} */
    {
      scheme: "http",
      domainHost: !0,
      parse: o,
      serialize: f
    }
  ), k = (
    /** @type {SchemeHandler} */
    {
      scheme: "https",
      domainHost: O.domainHost,
      parse: o,
      serialize: f
    }
  ), R = (
    /** @type {SchemeHandler} */
    {
      scheme: "ws",
      domainHost: !0,
      parse: c,
      serialize: l
    }
  ), p = (
    /** @type {SchemeHandler} */
    {
      scheme: "wss",
      domainHost: R.domainHost,
      parse: R.parse,
      serialize: R.serialize
    }
  ), y = (
    /** @type {Record<SchemeName, SchemeHandler>} */
    {
      http: O,
      https: k,
      ws: R,
      wss: p,
      urn: (
        /** @type {SchemeHandler} */
        {
          scheme: "urn",
          parse: g,
          serialize: v,
          skipNormalize: !0
        }
      ),
      "urn:uuid": (
        /** @type {SchemeHandler} */
        {
          scheme: "urn:uuid",
          parse: N,
          serialize: j,
          skipNormalize: !0
        }
      )
    }
  );
  Object.setPrototypeOf(y, null);
  function P(i) {
    return i && (y[
      /** @type {SchemeName} */
      i
    ] || y[
      /** @type {SchemeName} */
      i.toLowerCase()
    ]) || void 0;
  }
  return Vt = {
    wsIsSecure: S,
    SCHEMES: y,
    isValidSchemeName: d,
    getSchemeHandler: P
  }, Vt;
}
var Er;
function Jn() {
  if (Er) return Ae.exports;
  Er = 1;
  const { normalizeIPv6: e, removeDotSegments: n, removeDotSegmentsRelative: w, recomposeAuthority: d, normalizePercentEncoding: S, normalizePathEncoding: o, serializePathEncoding: f, normalizeQueryFragmentEncoding: c, encodeQuery: l, encodeFragment: g, reescapeHostDelimiters: v, isIPv4: N, nonSimpleDomain: j } = $n(), { SCHEMES: O, getSchemeHandler: k } = Gn(), R = /^[A-Za-z][A-Za-z0-9+.-]*$/u, p = "URI scheme is malformed.", _ = "URI host is malformed.", a = /[\0-\x20"#/:<>?@[\\\]^`{|}\x7F]/u;
  function y(r) {
    const $ = String(r);
    if (!R.test($))
      throw new TypeError(p);
    return $;
  }
  function P(r, $) {
    return typeof r == "string" ? r = /** @type {T} */
    u(r, $) : typeof r == "object" && (r = /** @type {T} */
    z(E(r, $), $)), r;
  }
  function i(r, $, C) {
    const T = C ? Object.assign({ scheme: "null" }, C) : { scheme: "null" }, {
      parsed: F,
      malformedAuthorityOrPort: G,
      malformedPercentEncoding: I,
      malformedSchemeSpecific: q,
      malformedHost: A,
      malformedScheme: V
    } = ue(r, T), {
      parsed: L,
      malformedAuthorityOrPort: J,
      malformedPercentEncoding: ne,
      malformedSchemeSpecific: re,
      malformedHost: ae,
      malformedScheme: ee
    } = ue($, T);
    if (G || J || I || ne || q || re || A || ae || V || ee)
      throw new Error(F.error || L.error || "URI is malformed.");
    const X = s(F, L, T, !0), ye = k(C && C.scheme || X.scheme), se = X.host, pe = se !== void 0 && se !== "" && (N(se) || e(se).isIPV6);
    if (oe(X, C || {}, ye, pe))
      throw new Error(_);
    ie(X, C || {}, ye, pe);
    const je = se && se.indexOf("%") !== -1 && !/\P{ASCII}/u.test(se);
    if (X.error && !je)
      throw new Error(X.error);
    return T.skipEscape = !0, E(X, T);
  }
  function s(r, $, C, T) {
    const F = {};
    if (T || (r = z(E(r, C), C), $ = z(E($, C), C)), C = C || {}, !C.tolerant && $.scheme)
      F.scheme = $.scheme, F.userinfo = $.userinfo, F.host = $.host, F.port = $.port, F.path = n($.path || ""), F.query = $.query;
    else {
      if ($.userinfo !== void 0 || $.host !== void 0 || $.port !== void 0)
        F.userinfo = $.userinfo, F.host = $.host, F.port = $.port, F.path = n($.path || ""), F.query = $.query;
      else {
        if (!$.path)
          F.path = r.path, $.query !== void 0 ? F.query = $.query : F.query = r.query;
        else {
          if ($.path[0] === "/")
            F.path = n($.path);
          else {
            const G = r.userinfo !== void 0 || r.host !== void 0 || r.port !== void 0;
            G && !r.path ? F.path = "/" + $.path : r.path ? F.path = r.path.slice(0, r.path.lastIndexOf("/") + 1) + $.path : F.path = $.path, F.path = r.scheme === void 0 && !G && F.path[0] !== "/" ? w(F.path) : n(F.path);
          }
          F.query = $.query;
        }
        F.userinfo = r.userinfo, F.host = r.host, F.port = r.port;
      }
      F.scheme = r.scheme;
    }
    return F.fragment = $.fragment, F;
  }
  function m(r, $, C) {
    const T = h(r, C), F = h($, C);
    return T !== void 0 && F !== void 0 && T === F;
  }
  function E(r, $) {
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
    }, T = Object.assign({}, $), F = [];
    C.scheme && (C.scheme = y(C.scheme));
    const G = k(T.scheme || C.scheme);
    G && G.serialize && G.serialize(C, T);
    const I = C.userinfo !== void 0 || C.host !== void 0 || C.port !== void 0, q = (C.scheme === void 0 || T.reference === "suffix") && !I, A = !T.skipEscape && q;
    C.path !== void 0 && (T.skipEscape ? C.path = S(C.path) : C.path = f(C.path, A)), T.reference !== "suffix" && C.scheme && (C.scheme = y(C.scheme), F.push(C.scheme, ":"));
    const V = d(C);
    if (V !== void 0 && (T.reference !== "suffix" && F.push("//"), F.push(V), C.path && C.path[0] !== "/" && F.push("/")), C.path !== void 0) {
      let L = C.path;
      !T.absolutePath && (!G || !G.absolutePath) && (L = q && L[0] !== "/" ? w(L) : n(L)), q && (L = f(L, !0)), V === void 0 && L[0] === "/" && L[1] === "/" && (L = "/%2F" + L.slice(2)), F.push(L);
    }
    return C.query !== void 0 && F.push("?", l(C.query)), C.fragment !== void 0 && F.push("#", g(C.fragment)), F.join("");
  }
  const D = /^(?:([^#/:?]+):)?(?:\/\/((?:([^#/?@]*)@)?(\[[^#/?\]]+\]|[^#/:?]*)(?::(\d*))?))?([^#?]*)(?:\?([^#]*))?(?:#((?:.|[\n\r])*))?/u, U = /^(?:[^#/:?]+:)?\/\/([^/?#]*)/, M = /^(?:[^#/:?]+:)?([/\\\t\n\r]*)/;
  function K(r, $) {
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
  function ie(r, $, C, T) {
    if (oe(r, $, C, T))
      return r.error = r.error || _, !0;
    if (!$.unicodeSupport && (!C || !C.unicodeSupport) && r.host && !x(r.host) && ($.domainHost || C && C.domainHost) && T === !1 && j(r.host)) {
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
  function oe(r, $, C, T) {
    return !!(r.host && T === !1 && !x(r.host) && ($.domainHost || C && C.domainHost) && a.test(r.host));
  }
  function Y(r) {
    return r.username === "" && r.password === "" && r.port === "" && r.pathname === "/" && r.search === "" && r.hash === "" && r.hostname !== "";
  }
  function ue(r, $) {
    const C = Object.assign({}, $), T = {
      scheme: void 0,
      userinfo: void 0,
      host: "",
      port: void 0,
      path: "",
      query: void 0,
      fragment: void 0
    };
    let F = !1, G = !1, I = !1, q = !1, A = !1, V = !1, L = !1;
    C.reference === "suffix" && (C.scheme ? r = C.scheme + ":" + r : r = "//" + r);
    const J = r.match(U);
    J !== null && J[1].indexOf("\\") !== -1 && (T.error = "URI authority must not contain a literal backslash.", F = !0);
    const ne = r.match(M);
    if (ne !== null) {
      const ae = ne[1], ee = ae.replace(/[\t\n\r]/g, "");
      ee.length >= 2 && (ee.slice(0, 2) !== "//" ? (T.error = T.error || "URI authority must not contain a literal backslash.", F = !0) : ae.length !== ee.length && (T.error = T.error || "URI authority introducer must not contain whitespace.", F = !0));
    }
    const re = r.match(D);
    if (re) {
      T.scheme = re[1], T.userinfo = re[3], T.host = re[4], T.port = parseInt(re[5], 10), T.path = re[6] || "", T.query = re[7], T.fragment = re[8], T.scheme !== void 0 && (R.test(T.scheme) ? T.scheme = T.scheme.toLowerCase() : (T.error = T.error || p, V = !0)), G = Z(re), G && (T.error = T.error || "URI contains malformed percent-encoding."), isNaN(T.port) && (T.port = re[5]);
      const ae = K(T, re);
      if (ae !== void 0 && (T.error = T.error || ae, F = !0), T.host)
        if (N(T.host) === !1) {
          const ye = x(T.host), se = T.host.indexOf("[") !== -1 || T.host.indexOf("]") !== -1, pe = e(T.host);
          L = pe.isIPV6 || pe.isIPVFuture === !0, A = se && (!ye || pe.error === !0), T.host = L ? pe.host : pe.host.toLowerCase(), A && (T.error = T.error || _, F = !0);
        } else
          L = !0;
      T.scheme === void 0 && T.userinfo === void 0 && T.host === void 0 && T.port === void 0 && T.query === void 0 && !T.path ? T.reference = "same-document" : T.scheme === void 0 ? T.reference = "relative" : T.fragment === void 0 ? T.reference = "absolute" : T.reference = "uri", C.reference && C.reference !== "suffix" && C.reference !== T.reference && (T.error = T.error || "URI is not a " + C.reference + " reference.");
      const ee = k(C.scheme || T.scheme);
      if (A || (q = ie(T, C, ee, L)), r.indexOf("%") !== -1 && T.host !== void 0 && !A) {
        let X = L ? T.host : S(T.host, !0);
        L || (X = S(X.toLowerCase())), T.host = L || C.scheme !== "null" ? v(X, L) : X;
      }
      (!ee || ee && !ee.skipNormalize) && (T.path && (T.path = o(T.path)), T.query && (T.query = c(T.query)), T.fragment && (T.fragment = c(T.fragment))), ee && ee.parse && (ee.parse(T, C), ee === O.urn && T.nid === void 0 && (I = !0));
    } else
      T.error = T.error || "URI can not be parsed.";
    return { parsed: T, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: I, malformedHost: q, malformedScheme: V };
  }
  function z(r, $) {
    return ue(r, $).parsed;
  }
  function u(r, $) {
    return b(r, $).normalized;
  }
  function b(r, $) {
    const { parsed: C, malformedAuthorityOrPort: T, malformedPercentEncoding: F, malformedSchemeSpecific: G, malformedHost: I, malformedScheme: q } = ue(r, $);
    return {
      normalized: T || F || G || I || q ? r : E(C, $),
      malformedAuthorityOrPort: T,
      malformedPercentEncoding: F,
      malformedSchemeSpecific: G,
      malformedHost: I,
      malformedScheme: q
    };
  }
  function h(r, $) {
    if (typeof r != "string" && typeof r != "object")
      return;
    let C;
    try {
      C = typeof r == "string" ? r : E(r, $);
    } catch {
      return;
    }
    const { normalized: T, malformedAuthorityOrPort: F, malformedPercentEncoding: G, malformedSchemeSpecific: I, malformedHost: q, malformedScheme: A } = b(C, $);
    return F || G || I || q || A ? void 0 : T;
  }
  const t = {
    SCHEMES: O,
    normalize: P,
    resolve: i,
    resolveComponent: s,
    equal: m,
    serialize: E,
    parse: z
  };
  return Ae.exports = t, Ae.exports.default = t, Ae.exports.fastUri = t, Ae.exports;
}
var Sr;
function Bn() {
  if (Sr) return Ke;
  Sr = 1, Object.defineProperty(Ke, "__esModule", { value: !0 });
  const e = Jn();
  return e.code = 'require("ajv/dist/runtime/uri").default', Ke.default = e, Ke;
}
var Pr;
function Wn() {
  return Pr || (Pr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.CodeGen = e.Name = e.nil = e.stringify = e.str = e._ = e.KeywordCxt = void 0;
    var n = /* @__PURE__ */ kt();
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
    const d = /* @__PURE__ */ xt(), S = /* @__PURE__ */ It(), o = /* @__PURE__ */ vn(), f = /* @__PURE__ */ Gt(), c = /* @__PURE__ */ W(), l = /* @__PURE__ */ Ot(), g = /* @__PURE__ */ Rt(), v = /* @__PURE__ */ Q(), N = xn, j = /* @__PURE__ */ Bn(), O = (z, u) => new RegExp(z, u);
    O.code = "new RegExp";
    const k = ["removeAdditional", "useDefaults", "coerceTypes"], R = /* @__PURE__ */ new Set([
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
    ]), p = {
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
    }, a = 200;
    function y(z) {
      var u, b, h, t, r, $, C, T, F, G, I, q, A, V, L, J, ne, re, ae, ee, X, ye, se, pe, je;
      const Te = z.strict, jt = (u = z.code) === null || u === void 0 ? void 0 : u.optimize, Bt = jt === !0 || jt === void 0 ? 1 : jt || 0, Wt = (h = (b = z.code) === null || b === void 0 ? void 0 : b.regExp) !== null && h !== void 0 ? h : O, Pn = (t = z.uriResolver) !== null && t !== void 0 ? t : j.default;
      return {
        strictSchema: ($ = (r = z.strictSchema) !== null && r !== void 0 ? r : Te) !== null && $ !== void 0 ? $ : !0,
        strictNumbers: (T = (C = z.strictNumbers) !== null && C !== void 0 ? C : Te) !== null && T !== void 0 ? T : !0,
        strictTypes: (G = (F = z.strictTypes) !== null && F !== void 0 ? F : Te) !== null && G !== void 0 ? G : "log",
        strictTuples: (q = (I = z.strictTuples) !== null && I !== void 0 ? I : Te) !== null && q !== void 0 ? q : "log",
        strictRequired: (V = (A = z.strictRequired) !== null && A !== void 0 ? A : Te) !== null && V !== void 0 ? V : !1,
        code: z.code ? { ...z.code, optimize: Bt, regExp: Wt } : { optimize: Bt, regExp: Wt },
        loopRequired: (L = z.loopRequired) !== null && L !== void 0 ? L : a,
        loopEnum: (J = z.loopEnum) !== null && J !== void 0 ? J : a,
        meta: (ne = z.meta) !== null && ne !== void 0 ? ne : !0,
        messages: (re = z.messages) !== null && re !== void 0 ? re : !0,
        inlineRefs: (ae = z.inlineRefs) !== null && ae !== void 0 ? ae : !0,
        schemaId: (ee = z.schemaId) !== null && ee !== void 0 ? ee : "$id",
        addUsedSchema: (X = z.addUsedSchema) !== null && X !== void 0 ? X : !0,
        validateSchema: (ye = z.validateSchema) !== null && ye !== void 0 ? ye : !0,
        validateFormats: (se = z.validateFormats) !== null && se !== void 0 ? se : !0,
        unicodeRegExp: (pe = z.unicodeRegExp) !== null && pe !== void 0 ? pe : !0,
        int32range: (je = z.int32range) !== null && je !== void 0 ? je : !0,
        uriResolver: Pn
      };
    }
    class P {
      constructor(u = {}) {
        this.schemas = {}, this.refs = {}, this.formats = /* @__PURE__ */ Object.create(null), this._compilations = /* @__PURE__ */ new Set(), this._loading = {}, this._cache = /* @__PURE__ */ new Map(), u = this.opts = { ...u, ...y(u) };
        const { es5: b, lines: h } = this.opts.code;
        this.scope = new c.ValueScope({ scope: {}, prefixes: R, es5: b, lines: h }), this.logger = K(u.logger);
        const t = u.validateFormats;
        u.validateFormats = !1, this.RULES = (0, o.getRules)(), i.call(this, p, u, "NOT SUPPORTED"), i.call(this, _, u, "DEPRECATED", "warn"), this._metaOpts = U.call(this), u.formats && E.call(this), this._addVocabularies(), this._addDefaultMetaSchema(), u.keywords && D.call(this, u.keywords), typeof u.meta == "object" && this.addMetaSchema(u.meta), m.call(this), u.validateFormats = t;
      }
      _addVocabularies() {
        this.addKeyword("$async");
      }
      _addDefaultMetaSchema() {
        const { $data: u, meta: b, schemaId: h } = this.opts;
        let t = N;
        h === "id" && (t = { ...N }, t.id = t.$id, delete t.$id), b && u && this.addMetaSchema(t, t[h], !1);
      }
      defaultMeta() {
        const { meta: u, schemaId: b } = this.opts;
        return this.opts.defaultMeta = typeof u == "object" ? u[b] || u : void 0;
      }
      validate(u, b) {
        let h;
        if (typeof u == "string") {
          if (h = this.getSchema(u), !h)
            throw new Error(`no schema with key or ref "${u}"`);
        } else
          h = this.compile(u);
        const t = h(b);
        return "$async" in h || (this.errors = h.errors), t;
      }
      compile(u, b) {
        const h = this._addSchema(u, b);
        return h.validate || this._compileSchemaEnv(h);
      }
      compileAsync(u, b) {
        if (typeof this.opts.loadSchema != "function")
          throw new Error("options.loadSchema should be a function");
        const { loadSchema: h } = this.opts;
        return t.call(this, u, b);
        async function t(G, I) {
          await r.call(this, G.$schema);
          const q = this._addSchema(G, I);
          return q.validate || $.call(this, q);
        }
        async function r(G) {
          G && !this.getSchema(G) && await t.call(this, { $ref: G }, !0);
        }
        async function $(G) {
          try {
            return this._compileSchemaEnv(G);
          } catch (I) {
            if (!(I instanceof S.default))
              throw I;
            return C.call(this, I), await T.call(this, I.missingSchema), $.call(this, G);
          }
        }
        function C({ missingSchema: G, missingRef: I }) {
          if (this.refs[G])
            throw new Error(`AnySchema ${G} is loaded but ${I} cannot be resolved`);
        }
        async function T(G) {
          const I = await F.call(this, G);
          this.refs[G] || await r.call(this, I.$schema), this.refs[G] || this.addSchema(I, G, b);
        }
        async function F(G) {
          const I = this._loading[G];
          if (I)
            return I;
          try {
            return await (this._loading[G] = h(G));
          } finally {
            delete this._loading[G];
          }
        }
      }
      // Adds schema to the instance
      addSchema(u, b, h, t = this.opts.validateSchema) {
        if (Array.isArray(u)) {
          for (const $ of u)
            this.addSchema($, void 0, h, t);
          return this;
        }
        let r;
        if (typeof u == "object") {
          const { schemaId: $ } = this.opts;
          if (r = u[$], r !== void 0 && typeof r != "string")
            throw new Error(`schema ${$} must be string`);
        }
        return b = (0, l.normalizeId)(b || r), this._checkUnique(b), this.schemas[b] = this._addSchema(u, h, b, t, !0), this;
      }
      // Add schema that will be used to validate other schemas
      // options in META_IGNORE_OPTIONS are alway set to false
      addMetaSchema(u, b, h = this.opts.validateSchema) {
        return this.addSchema(u, b, !0, h), this;
      }
      //  Validate schema against its meta-schema
      validateSchema(u, b) {
        if (typeof u == "boolean")
          return !0;
        let h;
        if (h = u.$schema, h !== void 0 && typeof h != "string")
          throw new Error("$schema must be a string");
        if (h = h || this.opts.defaultMeta || this.defaultMeta(), !h)
          return this.logger.warn("meta-schema not available"), this.errors = null, !0;
        const t = this.validate(h, u);
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
        for (; typeof (b = s.call(this, u)) == "string"; )
          u = b;
        if (b === void 0) {
          const { schemaId: h } = this.opts, t = new f.SchemaEnv({ schema: {}, schemaId: h });
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
            const b = s.call(this, u);
            return typeof b == "object" && this._cache.delete(b.schema), delete this.schemas[u], delete this.refs[u], this;
          }
          case "object": {
            const b = u;
            this._cache.delete(b);
            let h = u[this.opts.schemaId];
            return h && (h = (0, l.normalizeId)(h), delete this.schemas[h], delete this.refs[h]), this;
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
        let h;
        if (typeof u == "string")
          h = u, typeof b == "object" && (this.logger.warn("these parameters are deprecated, see docs for addKeyword"), b.keyword = h);
        else if (typeof u == "object" && b === void 0) {
          if (b = u, h = b.keyword, Array.isArray(h) && !h.length)
            throw new Error("addKeywords: keyword must be string or non-empty array");
        } else
          throw new Error("invalid addKeywords parameters");
        if (x.call(this, h, b), !b)
          return (0, v.eachItem)(h, (r) => Z.call(this, r)), this;
        oe.call(this, b);
        const t = {
          ...b,
          type: (0, g.getJSONTypes)(b.type),
          schemaType: (0, g.getJSONTypes)(b.schemaType)
        };
        return (0, v.eachItem)(h, t.type.length === 0 ? (r) => Z.call(this, r, t) : (r) => t.type.forEach(($) => Z.call(this, r, t, $))), this;
      }
      getKeyword(u) {
        const b = this.RULES.all[u];
        return typeof b == "object" ? b.definition : !!b;
      }
      // Remove keyword
      removeKeyword(u) {
        const { RULES: b } = this;
        delete b.keywords[u], delete b.all[u];
        for (const h of b.rules) {
          const t = h.rules.findIndex((r) => r.keyword === u);
          t >= 0 && h.rules.splice(t, 1);
        }
        return this;
      }
      // Add format
      addFormat(u, b) {
        return typeof b == "string" && (b = new RegExp(b)), this.formats[u] = b, this;
      }
      errorsText(u = this.errors, { separator: b = ", ", dataVar: h = "data" } = {}) {
        return !u || u.length === 0 ? "No errors" : u.map((t) => `${h}${t.instancePath} ${t.message}`).reduce((t, r) => t + b + r);
      }
      $dataMetaSchema(u, b) {
        const h = this.RULES.all;
        u = JSON.parse(JSON.stringify(u));
        for (const t of b) {
          const r = t.split("/").slice(1);
          let $ = u;
          for (const C of r)
            $ = $[C];
          for (const C in h) {
            const T = h[C];
            if (typeof T != "object")
              continue;
            const { $data: F } = T.definition, G = $[C];
            F && G && ($[C] = ue(G));
          }
        }
        return u;
      }
      _removeAllSchemas(u, b) {
        for (const h in u) {
          const t = u[h];
          (!b || b.test(h)) && (typeof t == "string" ? delete u[h] : t && !t.meta && (this._cache.delete(t.schema), delete u[h]));
        }
      }
      _addSchema(u, b, h, t = this.opts.validateSchema, r = this.opts.addUsedSchema) {
        let $;
        const { schemaId: C } = this.opts;
        if (typeof u == "object")
          $ = u[C];
        else {
          if (this.opts.jtd)
            throw new Error("schema must be object");
          if (typeof u != "boolean")
            throw new Error("schema must be object or boolean");
        }
        let T = this._cache.get(u);
        if (T !== void 0)
          return T;
        h = (0, l.normalizeId)($ || h);
        const F = l.getSchemaRefs.call(this, u, h);
        return T = new f.SchemaEnv({ schema: u, schemaId: C, meta: b, baseId: h, localRefs: F }), this._cache.set(T.schema, T), r && !h.startsWith("#") && (h && this._checkUnique(h), this.refs[h] = T), t && this.validateSchema(u, !0), T;
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
    P.ValidationError = d.default, P.MissingRefError = S.default, e.default = P;
    function i(z, u, b, h = "error") {
      for (const t in z) {
        const r = t;
        r in u && this.logger[h](`${b}: option ${t}. ${z[r]}`);
      }
    }
    function s(z) {
      return z = (0, l.normalizeId)(z), this.schemas[z] || this.refs[z];
    }
    function m() {
      const z = this.opts.schemas;
      if (z)
        if (Array.isArray(z))
          this.addSchema(z);
        else
          for (const u in z)
            this.addSchema(z[u], u);
    }
    function E() {
      for (const z in this.opts.formats) {
        const u = this.opts.formats[z];
        u && this.addFormat(z, u);
      }
    }
    function D(z) {
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
    function U() {
      const z = { ...this.opts };
      for (const u of k)
        delete z[u];
      return z;
    }
    const M = { log() {
    }, warn() {
    }, error() {
    } };
    function K(z) {
      if (z === !1)
        return M;
      if (z === void 0)
        return console;
      if (z.log && z.warn && z.error)
        return z;
      throw new Error("logger must implement log, warn and error methods");
    }
    const H = /^[a-z_$][a-z0-9_$:-]*$/i;
    function x(z, u) {
      const { RULES: b } = this;
      if ((0, v.eachItem)(z, (h) => {
        if (b.keywords[h])
          throw new Error(`Keyword ${h} is already defined`);
        if (!H.test(h))
          throw new Error(`Keyword ${h} has invalid name`);
      }), !!u && u.$data && !("code" in u || "validate" in u))
        throw new Error('$data keyword must have "code" or "validate" function');
    }
    function Z(z, u, b) {
      var h;
      const t = u?.post;
      if (b && t)
        throw new Error('keyword with "post" flag cannot have "type"');
      const { RULES: r } = this;
      let $ = t ? r.post : r.rules.find(({ type: T }) => T === b);
      if ($ || ($ = { type: b, rules: [] }, r.rules.push($)), r.keywords[z] = !0, !u)
        return;
      const C = {
        keyword: z,
        definition: {
          ...u,
          type: (0, g.getJSONTypes)(u.type),
          schemaType: (0, g.getJSONTypes)(u.schemaType)
        }
      };
      u.before ? ie.call(this, $, C, u.before) : $.rules.push(C), r.all[z] = C, (h = u.implements) === null || h === void 0 || h.forEach((T) => this.addKeyword(T));
    }
    function ie(z, u, b) {
      const h = z.rules.findIndex((t) => t.keyword === b);
      h >= 0 ? z.rules.splice(h, 0, u) : (z.rules.push(u), this.logger.warn(`rule ${b} is not defined`));
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
  })(Tt)), Tt;
}
var He = {}, xe = {}, Ge = {}, Rr;
function Zn() {
  if (Rr) return Ge;
  Rr = 1, Object.defineProperty(Ge, "__esModule", { value: !0 });
  const e = {
    keyword: "id",
    code() {
      throw new Error('NOT SUPPORTED: keyword "id", use "$id" for schema ID');
    }
  };
  return Ge.default = e, Ge;
}
var Se = {}, Nr;
function Qn() {
  if (Nr) return Se;
  Nr = 1, Object.defineProperty(Se, "__esModule", { value: !0 }), Se.callRef = Se.getValidate = void 0;
  const e = /* @__PURE__ */ It(), n = /* @__PURE__ */ _e(), w = /* @__PURE__ */ W(), d = /* @__PURE__ */ Pe(), S = /* @__PURE__ */ Gt(), o = /* @__PURE__ */ Q(), f = {
    keyword: "$ref",
    schemaType: "string",
    code(g) {
      const { gen: v, schema: N, it: j } = g, { baseId: O, schemaEnv: k, validateName: R, opts: p, self: _ } = j, { root: a } = k;
      if ((N === "#" || N === "#/") && O === a.baseId)
        return P();
      const y = S.resolveRef.call(_, a, O, N);
      if (y === void 0)
        throw new e.default(j.opts.uriResolver, O, N);
      if (y instanceof S.SchemaEnv)
        return i(y);
      return s(y);
      function P() {
        if (k === a)
          return l(g, R, k, k.$async);
        const m = v.scopeValue("root", { ref: a });
        return l(g, (0, w._)`${m}.validate`, a, a.$async);
      }
      function i(m) {
        const E = c(g, m);
        l(g, E, m, m.$async);
      }
      function s(m) {
        const E = v.scopeValue("schema", p.code.source === !0 ? { ref: m, code: (0, w.stringify)(m) } : { ref: m }), D = v.name("valid"), U = g.subschema({
          schema: m,
          dataTypes: [],
          schemaPath: w.nil,
          topSchemaRef: E,
          errSchemaPath: N
        }, D);
        g.mergeEvaluated(U), g.ok(D);
      }
    }
  };
  function c(g, v) {
    const { gen: N } = g;
    return v.validate ? N.scopeValue("validate", { ref: v.validate }) : (0, w._)`${N.scopeValue("wrapper", { ref: v })}.validate`;
  }
  Se.getValidate = c;
  function l(g, v, N, j) {
    const { gen: O, it: k } = g, { allErrors: R, schemaEnv: p, opts: _ } = k, a = _.passContext ? d.default.this : w.nil;
    j ? y() : P();
    function y() {
      if (!p.$async)
        throw new Error("async schema referenced by sync schema");
      const m = O.let("valid");
      O.try(() => {
        O.code((0, w._)`await ${(0, n.callValidateCode)(g, v, a)}`), s(v), R || O.assign(m, !0);
      }, (E) => {
        O.if((0, w._)`!(${E} instanceof ${k.ValidationError})`, () => O.throw(E)), i(E), R || O.assign(m, !1);
      }), g.ok(m);
    }
    function P() {
      g.result((0, n.callValidateCode)(g, v, a), () => s(v), () => i(v));
    }
    function i(m) {
      const E = (0, w._)`${m}.errors`;
      O.assign(d.default.vErrors, (0, w._)`${d.default.vErrors} === null ? ${E} : ${d.default.vErrors}.concat(${E})`), O.assign(d.default.errors, (0, w._)`${d.default.vErrors}.length`);
    }
    function s(m) {
      var E;
      if (!k.opts.unevaluated)
        return;
      const D = (E = N?.validate) === null || E === void 0 ? void 0 : E.evaluated;
      if (k.props !== !0)
        if (D && !D.dynamicProps)
          D.props !== void 0 && (k.props = o.mergeEvaluated.props(O, D.props, k.props));
        else {
          const U = O.var("props", (0, w._)`${m}.evaluated.props`);
          k.props = o.mergeEvaluated.props(O, U, k.props, w.Name);
        }
      if (k.items !== !0)
        if (D && !D.dynamicItems)
          D.items !== void 0 && (k.items = o.mergeEvaluated.items(O, D.items, k.items));
        else {
          const U = O.var("items", (0, w._)`${m}.evaluated.items`);
          k.items = o.mergeEvaluated.items(O, U, k.items, w.Name);
        }
    }
  }
  return Se.callRef = l, Se.default = f, Se;
}
var Or;
function Yn() {
  if (Or) return xe;
  Or = 1, Object.defineProperty(xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Zn(), n = /* @__PURE__ */ Qn(), w = [
    "$schema",
    "$id",
    "$defs",
    "$vocabulary",
    { keyword: "$comment" },
    "definitions",
    e.default,
    n.default
  ];
  return xe.default = w, xe;
}
var Je = {}, Be = {}, kr;
function Xn() {
  if (kr) return Be;
  kr = 1, Object.defineProperty(Be, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = e.operators, w = {
    maximum: { okStr: "<=", ok: n.LTE, fail: n.GT },
    minimum: { okStr: ">=", ok: n.GTE, fail: n.LT },
    exclusiveMaximum: { okStr: "<", ok: n.LT, fail: n.GTE },
    exclusiveMinimum: { okStr: ">", ok: n.GT, fail: n.LTE }
  }, d = {
    message: ({ keyword: o, schemaCode: f }) => (0, e.str)`must be ${w[o].okStr} ${f}`,
    params: ({ keyword: o, schemaCode: f }) => (0, e._)`{comparison: ${w[o].okStr}, limit: ${f}}`
  }, S = {
    keyword: Object.keys(w),
    type: "number",
    schemaType: "number",
    $data: !0,
    error: d,
    code(o) {
      const { keyword: f, data: c, schemaCode: l } = o;
      o.fail$data((0, e._)`${c} ${w[f].fail} ${l} || isNaN(${c})`);
    }
  };
  return Be.default = S, Be;
}
var We = {}, Ir;
function ea() {
  if (Ir) return We;
  Ir = 1, Object.defineProperty(We, "__esModule", { value: !0 });
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
      const { gen: S, data: o, schemaCode: f, it: c } = d, l = c.opts.multipleOfPrecision, g = S.let("res"), v = l ? (0, e._)`Math.abs(Math.round(${g}) - ${g}) > 1e-${l}` : (0, e._)`${g} !== parseInt(${g})`;
      d.fail$data((0, e._)`(${f} === 0 || (${g} = ${o}/${f}, ${v}))`);
    }
  };
  return We.default = w, We;
}
var Ze = {}, Qe = {}, jr;
function ta() {
  if (jr) return Qe;
  jr = 1, Object.defineProperty(Qe, "__esModule", { value: !0 });
  function e(n) {
    const w = n.length;
    let d = 0, S = 0, o;
    for (; S < w; )
      d++, o = n.charCodeAt(S++), o >= 55296 && o <= 56319 && S < w && (o = n.charCodeAt(S), (o & 64512) === 56320 && S++);
    return d;
  }
  return Qe.default = e, e.code = 'require("ajv/dist/runtime/ucs2length").default', Qe;
}
var Tr;
function ra() {
  if (Tr) return Ze;
  Tr = 1, Object.defineProperty(Ze, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ ta(), S = {
    keyword: ["maxLength", "minLength"],
    type: "string",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: o, schemaCode: f }) {
        const c = o === "maxLength" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${c} than ${f} characters`;
      },
      params: ({ schemaCode: o }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { keyword: f, data: c, schemaCode: l, it: g } = o, v = f === "maxLength" ? e.operators.GT : e.operators.LT, N = g.opts.unicode === !1 ? (0, e._)`${c}.length` : (0, e._)`${(0, n.useFunc)(o.gen, w.default)}(${c})`;
      o.fail$data((0, e._)`${N} ${v} ${l}`);
    }
  };
  return Ze.default = S, Ze;
}
var Ye = {}, Cr;
function na() {
  if (Cr) return Ye;
  Cr = 1, Object.defineProperty(Ye, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ W(), S = {
    keyword: "pattern",
    type: "string",
    schemaType: "string",
    $data: !0,
    error: {
      message: ({ schemaCode: o }) => (0, w.str)`must match pattern "${o}"`,
      params: ({ schemaCode: o }) => (0, w._)`{pattern: ${o}}`
    },
    code(o) {
      const { gen: f, data: c, $data: l, schema: g, schemaCode: v, it: N } = o, j = N.opts.unicodeRegExp ? "u" : "";
      if (l) {
        const { regExp: O } = N.opts.code, k = O.code === "new RegExp" ? (0, w._)`new RegExp` : (0, n.useFunc)(f, O), R = f.let("valid");
        f.try(() => f.assign(R, (0, w._)`${k}(${v}, ${j}).test(${c})`), () => f.assign(R, !1)), o.fail$data((0, w._)`!${R}`);
      } else {
        const O = (0, e.usePattern)(o, g);
        o.fail$data((0, w._)`!${O}.test(${c})`);
      }
    }
  };
  return Ye.default = S, Ye;
}
var Xe = {}, qr;
function aa() {
  if (qr) return Xe;
  qr = 1, Object.defineProperty(Xe, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxProperties", "minProperties"],
    type: "object",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: d, schemaCode: S }) {
        const o = d === "maxProperties" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${S} properties`;
      },
      params: ({ schemaCode: d }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { keyword: S, data: o, schemaCode: f } = d, c = S === "maxProperties" ? e.operators.GT : e.operators.LT;
      d.fail$data((0, e._)`Object.keys(${o}).length ${c} ${f}`);
    }
  };
  return Xe.default = w, Xe;
}
var et = {}, Ar;
function sa() {
  if (Ar) return et;
  Ar = 1, Object.defineProperty(et, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), S = {
    keyword: "required",
    type: "object",
    schemaType: "array",
    $data: !0,
    error: {
      message: ({ params: { missingProperty: o } }) => (0, n.str)`must have required property '${o}'`,
      params: ({ params: { missingProperty: o } }) => (0, n._)`{missingProperty: ${o}}`
    },
    code(o) {
      const { gen: f, schema: c, schemaCode: l, data: g, $data: v, it: N } = o, { opts: j } = N;
      if (!v && c.length === 0)
        return;
      const O = c.length >= j.loopRequired;
      if (N.allErrors ? k() : R(), j.strictRequired) {
        const a = o.parentSchema.properties, { definedProperties: y } = o.it;
        for (const P of c)
          if (a?.[P] === void 0 && !y.has(P)) {
            const i = N.schemaEnv.baseId + N.errSchemaPath, s = `required property "${P}" is not defined at "${i}" (strictRequired)`;
            (0, w.checkStrictMode)(N, s, N.opts.strictRequired);
          }
      }
      function k() {
        if (O || v)
          o.block$data(n.nil, p);
        else
          for (const a of c)
            (0, e.checkReportMissingProp)(o, a);
      }
      function R() {
        const a = f.let("missing");
        if (O || v) {
          const y = f.let("valid", !0);
          o.block$data(y, () => _(a, y)), o.ok(y);
        } else
          f.if((0, e.checkMissingProp)(o, c, a)), (0, e.reportMissingProp)(o, a), f.else();
      }
      function p() {
        f.forOf("prop", l, (a) => {
          o.setParams({ missingProperty: a }), f.if((0, e.noPropertyInData)(f, g, a, j.ownProperties), () => o.error());
        });
      }
      function _(a, y) {
        o.setParams({ missingProperty: a }), f.forOf(a, l, () => {
          f.assign(y, (0, e.propertyInData)(f, g, a, j.ownProperties)), f.if((0, n.not)(y), () => {
            o.error(), f.break();
          });
        }, n.nil);
      }
    }
  };
  return et.default = S, et;
}
var tt = {}, Dr;
function oa() {
  if (Dr) return tt;
  Dr = 1, Object.defineProperty(tt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), w = {
    keyword: ["maxItems", "minItems"],
    type: "array",
    schemaType: "number",
    $data: !0,
    error: {
      message({ keyword: d, schemaCode: S }) {
        const o = d === "maxItems" ? "more" : "fewer";
        return (0, e.str)`must NOT have ${o} than ${S} items`;
      },
      params: ({ schemaCode: d }) => (0, e._)`{limit: ${d}}`
    },
    code(d) {
      const { keyword: S, data: o, schemaCode: f } = d, c = S === "maxItems" ? e.operators.GT : e.operators.LT;
      d.fail$data((0, e._)`${o}.length ${c} ${f}`);
    }
  };
  return tt.default = w, tt;
}
var rt = {}, nt = {}, Mr;
function Jt() {
  if (Mr) return nt;
  Mr = 1, Object.defineProperty(nt, "__esModule", { value: !0 });
  const e = gn();
  return e.code = 'require("ajv/dist/runtime/equal").default', nt.default = e, nt;
}
var Fr;
function ia() {
  if (Fr) return rt;
  Fr = 1, Object.defineProperty(rt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Rt(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Jt(), o = {
    keyword: "uniqueItems",
    type: "array",
    schemaType: "boolean",
    $data: !0,
    error: {
      message: ({ params: { i: f, j: c } }) => (0, n.str)`must NOT have duplicate items (items ## ${c} and ${f} are identical)`,
      params: ({ params: { i: f, j: c } }) => (0, n._)`{i: ${f}, j: ${c}}`
    },
    code(f) {
      const { gen: c, data: l, $data: g, schema: v, parentSchema: N, schemaCode: j, it: O } = f;
      if (!g && !v)
        return;
      const k = c.let("valid"), R = N.items ? (0, e.getSchemaTypes)(N.items) : [];
      f.block$data(k, p, (0, n._)`${j} === false`), f.ok(k);
      function p() {
        const P = c.let("i", (0, n._)`${l}.length`), i = c.let("j");
        f.setParams({ i: P, j: i }), c.assign(k, !0), c.if((0, n._)`${P} > 1`, () => (_() ? a : y)(P, i));
      }
      function _() {
        return R.length > 0 && !R.some((P) => P === "object" || P === "array");
      }
      function a(P, i) {
        const s = c.name("item"), m = (0, e.checkDataTypes)(R, s, O.opts.strictNumbers, e.DataType.Wrong), E = c.const("indices", (0, n._)`{}`);
        c.for((0, n._)`;${P}--;`, () => {
          c.let(s, (0, n._)`${l}[${P}]`), c.if(m, (0, n._)`continue`), R.length > 1 && c.if((0, n._)`typeof ${s} == "string"`, (0, n._)`${s} += "_"`), c.if((0, n._)`typeof ${E}[${s}] == "number"`, () => {
            c.assign(i, (0, n._)`${E}[${s}]`), f.error(), c.assign(k, !1).break();
          }).code((0, n._)`${E}[${s}] = ${P}`);
        });
      }
      function y(P, i) {
        const s = (0, w.useFunc)(c, d.default), m = c.name("outer");
        c.label(m).for((0, n._)`;${P}--;`, () => c.for((0, n._)`${i} = ${P}; ${i}--;`, () => c.if((0, n._)`${s}(${l}[${P}], ${l}[${i}])`, () => {
          f.error(), c.assign(k, !1).break(m);
        })));
      }
    }
  };
  return rt.default = o, rt;
}
var at = {}, zr;
function ua() {
  if (zr) return at;
  zr = 1, Object.defineProperty(at, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Jt(), S = {
    keyword: "const",
    $data: !0,
    error: {
      message: "must be equal to constant",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValue: ${o}}`
    },
    code(o) {
      const { gen: f, data: c, $data: l, schemaCode: g, schema: v } = o;
      l || v && typeof v == "object" ? o.fail$data((0, e._)`!${(0, n.useFunc)(f, w.default)}(${c}, ${g})`) : o.fail((0, e._)`${v} !== ${c}`);
    }
  };
  return at.default = S, at;
}
var st = {}, Vr;
function ca() {
  if (Vr) return st;
  Vr = 1, Object.defineProperty(st, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ Jt(), S = {
    keyword: "enum",
    schemaType: "array",
    $data: !0,
    error: {
      message: "must be equal to one of the allowed values",
      params: ({ schemaCode: o }) => (0, e._)`{allowedValues: ${o}}`
    },
    code(o) {
      const { gen: f, data: c, $data: l, schema: g, schemaCode: v, it: N } = o;
      if (!l && g.length === 0)
        throw new Error("enum must have non-empty array");
      const j = g.length >= N.opts.loopEnum;
      let O;
      const k = () => O ?? (O = (0, n.useFunc)(f, w.default));
      let R;
      if (j || l)
        R = f.let("valid"), o.block$data(R, p);
      else {
        if (!Array.isArray(g))
          throw new Error("ajv implementation error");
        const a = f.const("vSchema", v);
        R = (0, e.or)(...g.map((y, P) => _(a, P)));
      }
      o.pass(R);
      function p() {
        f.assign(R, !1), f.forOf("v", v, (a) => f.if((0, e._)`${k()}(${c}, ${a})`, () => f.assign(R, !0).break()));
      }
      function _(a, y) {
        const P = g[y];
        return typeof P == "object" && P !== null ? (0, e._)`${k()}(${c}, ${a}[${y}])` : (0, e._)`${c} === ${P}`;
      }
    }
  };
  return st.default = S, st;
}
var Ur;
function la() {
  if (Ur) return Je;
  Ur = 1, Object.defineProperty(Je, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Xn(), n = /* @__PURE__ */ ea(), w = /* @__PURE__ */ ra(), d = /* @__PURE__ */ na(), S = /* @__PURE__ */ aa(), o = /* @__PURE__ */ sa(), f = /* @__PURE__ */ oa(), c = /* @__PURE__ */ ia(), l = /* @__PURE__ */ ua(), g = /* @__PURE__ */ ca(), v = [
    // number
    e.default,
    n.default,
    // string
    w.default,
    d.default,
    // object
    S.default,
    o.default,
    // array
    f.default,
    c.default,
    // any
    { keyword: "type", schemaType: ["string", "array"] },
    { keyword: "nullable", schemaType: "boolean" },
    l.default,
    g.default
  ];
  return Je.default = v, Je;
}
var ot = {}, ke = {}, Lr;
function wn() {
  if (Lr) return ke;
  Lr = 1, Object.defineProperty(ke, "__esModule", { value: !0 }), ke.validateAdditionalItems = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), d = {
    keyword: "additionalItems",
    type: "array",
    schemaType: ["boolean", "object"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: o } }) => (0, e.str)`must NOT have more than ${o} items`,
      params: ({ params: { len: o } }) => (0, e._)`{limit: ${o}}`
    },
    code(o) {
      const { parentSchema: f, it: c } = o, { items: l } = f;
      if (!Array.isArray(l)) {
        (0, n.checkStrictMode)(c, '"additionalItems" is ignored when "items" is not an array of schemas');
        return;
      }
      S(o, l);
    }
  };
  function S(o, f) {
    const { gen: c, schema: l, data: g, keyword: v, it: N } = o;
    N.items = !0;
    const j = c.const("len", (0, e._)`${g}.length`);
    if (l === !1)
      o.setParams({ len: f.length }), o.pass((0, e._)`${j} <= ${f.length}`);
    else if (typeof l == "object" && !(0, n.alwaysValidSchema)(N, l)) {
      const k = c.var("valid", (0, e._)`${j} <= ${f.length}`);
      c.if((0, e.not)(k), () => O(k)), o.ok(k);
    }
    function O(k) {
      c.forRange("i", f.length, j, (R) => {
        o.subschema({ keyword: v, dataProp: R, dataPropType: n.Type.Num }, k), N.allErrors || c.if((0, e.not)(k), () => c.break());
      });
    }
  }
  return ke.validateAdditionalItems = S, ke.default = d, ke;
}
var it = {}, Ie = {}, Kr;
function bn() {
  if (Kr) return Ie;
  Kr = 1, Object.defineProperty(Ie, "__esModule", { value: !0 }), Ie.validateTuple = void 0;
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ _e(), d = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "array", "boolean"],
    before: "uniqueItems",
    code(o) {
      const { schema: f, it: c } = o;
      if (Array.isArray(f))
        return S(o, "additionalItems", f);
      c.items = !0, !(0, n.alwaysValidSchema)(c, f) && o.ok((0, w.validateArray)(o));
    }
  };
  function S(o, f, c = o.schema) {
    const { gen: l, parentSchema: g, data: v, keyword: N, it: j } = o;
    R(g), j.opts.unevaluated && c.length && j.items !== !0 && (j.items = n.mergeEvaluated.items(l, c.length, j.items));
    const O = l.name("valid"), k = l.const("len", (0, e._)`${v}.length`);
    c.forEach((p, _) => {
      (0, n.alwaysValidSchema)(j, p) || (l.if((0, e._)`${k} > ${_}`, () => o.subschema({
        keyword: N,
        schemaProp: _,
        dataProp: _
      }, O)), o.ok(O));
    });
    function R(p) {
      const { opts: _, errSchemaPath: a } = j, y = c.length, P = y === p.minItems && (y === p.maxItems || p[f] === !1);
      if (_.strictTuples && !P) {
        const i = `"${N}" is ${y}-tuple, but minItems or maxItems/${f} are not specified or different at path "${a}"`;
        (0, n.checkStrictMode)(j, i, _.strictTuples);
      }
    }
  }
  return Ie.validateTuple = S, Ie.default = d, Ie;
}
var Hr;
function da() {
  if (Hr) return it;
  Hr = 1, Object.defineProperty(it, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ bn(), n = {
    keyword: "prefixItems",
    type: "array",
    schemaType: ["array"],
    before: "uniqueItems",
    code: (w) => (0, e.validateTuple)(w, "items")
  };
  return it.default = n, it;
}
var ut = {}, xr;
function fa() {
  if (xr) return ut;
  xr = 1, Object.defineProperty(ut, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), w = /* @__PURE__ */ _e(), d = /* @__PURE__ */ wn(), o = {
    keyword: "items",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    error: {
      message: ({ params: { len: f } }) => (0, e.str)`must NOT have more than ${f} items`,
      params: ({ params: { len: f } }) => (0, e._)`{limit: ${f}}`
    },
    code(f) {
      const { schema: c, parentSchema: l, it: g } = f, { prefixItems: v } = l;
      g.items = !0, !(0, n.alwaysValidSchema)(g, c) && (v ? (0, d.validateAdditionalItems)(f, v) : f.ok((0, w.validateArray)(f)));
    }
  };
  return ut.default = o, ut;
}
var ct = {}, Gr;
function ha() {
  if (Gr) return ct;
  Gr = 1, Object.defineProperty(ct, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), d = {
    keyword: "contains",
    type: "array",
    schemaType: ["object", "boolean"],
    before: "uniqueItems",
    trackErrors: !0,
    error: {
      message: ({ params: { min: S, max: o } }) => o === void 0 ? (0, e.str)`must contain at least ${S} valid item(s)` : (0, e.str)`must contain at least ${S} and no more than ${o} valid item(s)`,
      params: ({ params: { min: S, max: o } }) => o === void 0 ? (0, e._)`{minContains: ${S}}` : (0, e._)`{minContains: ${S}, maxContains: ${o}}`
    },
    code(S) {
      const { gen: o, schema: f, parentSchema: c, data: l, it: g } = S;
      let v, N;
      const { minContains: j, maxContains: O } = c;
      g.opts.next ? (v = j === void 0 ? 1 : j, N = O) : v = 1;
      const k = o.const("len", (0, e._)`${l}.length`);
      if (S.setParams({ min: v, max: N }), N === void 0 && v === 0) {
        (0, n.checkStrictMode)(g, '"minContains" == 0 without "maxContains": "contains" keyword ignored');
        return;
      }
      if (N !== void 0 && v > N) {
        (0, n.checkStrictMode)(g, '"minContains" > "maxContains" is always invalid'), S.fail();
        return;
      }
      if ((0, n.alwaysValidSchema)(g, f)) {
        let y = (0, e._)`${k} >= ${v}`;
        N !== void 0 && (y = (0, e._)`${y} && ${k} <= ${N}`), S.pass(y);
        return;
      }
      g.items = !0;
      const R = o.name("valid");
      N === void 0 && v === 1 ? _(R, () => o.if(R, () => o.break())) : v === 0 ? (o.let(R, !0), N !== void 0 && o.if((0, e._)`${l}.length > 0`, p)) : (o.let(R, !1), p()), S.result(R, () => S.reset());
      function p() {
        const y = o.name("_valid"), P = o.let("count", 0);
        _(y, () => o.if(y, () => a(P)));
      }
      function _(y, P) {
        o.forRange("i", 0, k, (i) => {
          S.subschema({
            keyword: "contains",
            dataProp: i,
            dataPropType: n.Type.Num,
            compositeRule: !0
          }, y), P();
        });
      }
      function a(y) {
        o.code((0, e._)`${y}++`), N === void 0 ? o.if((0, e._)`${y} >= ${v}`, () => o.assign(R, !0).break()) : (o.if((0, e._)`${y} > ${N}`, () => o.assign(R, !1).break()), v === 1 ? o.assign(R, !0) : o.if((0, e._)`${y} >= ${v}`, () => o.assign(R, !0)));
      }
    }
  };
  return ct.default = d, ct;
}
var Ut = {}, Jr;
function ma() {
  return Jr || (Jr = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.validateSchemaDeps = e.validatePropertyDeps = e.error = void 0;
    const n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ _e();
    e.error = {
      message: ({ params: { property: l, depsCount: g, deps: v } }) => {
        const N = g === 1 ? "property" : "properties";
        return (0, n.str)`must have ${N} ${v} when property ${l} is present`;
      },
      params: ({ params: { property: l, depsCount: g, deps: v, missingProperty: N } }) => (0, n._)`{property: ${l},
    missingProperty: ${N},
    depsCount: ${g},
    deps: ${v}}`
      // TODO change to reference
    };
    const S = {
      keyword: "dependencies",
      type: "object",
      schemaType: "object",
      error: e.error,
      code(l) {
        const [g, v] = o(l);
        f(l, g), c(l, v);
      }
    };
    function o({ schema: l }) {
      const g = {}, v = {};
      for (const N in l) {
        if (N === "__proto__")
          continue;
        const j = Array.isArray(l[N]) ? g : v;
        j[N] = l[N];
      }
      return [g, v];
    }
    function f(l, g = l.schema) {
      const { gen: v, data: N, it: j } = l;
      if (Object.keys(g).length === 0)
        return;
      const O = v.let("missing");
      for (const k in g) {
        const R = g[k];
        if (R.length === 0)
          continue;
        const p = (0, d.propertyInData)(v, N, k, j.opts.ownProperties);
        l.setParams({
          property: k,
          depsCount: R.length,
          deps: R.join(", ")
        }), j.allErrors ? v.if(p, () => {
          for (const _ of R)
            (0, d.checkReportMissingProp)(l, _);
        }) : (v.if((0, n._)`${p} && (${(0, d.checkMissingProp)(l, R, O)})`), (0, d.reportMissingProp)(l, O), v.else());
      }
    }
    e.validatePropertyDeps = f;
    function c(l, g = l.schema) {
      const { gen: v, data: N, keyword: j, it: O } = l, k = v.name("valid");
      for (const R in g)
        (0, w.alwaysValidSchema)(O, g[R]) || (v.if(
          (0, d.propertyInData)(v, N, R, O.opts.ownProperties),
          () => {
            const p = l.subschema({ keyword: j, schemaProp: R }, k);
            l.mergeValidEvaluated(p, k);
          },
          () => v.var(k, !0)
          // TODO var
        ), l.ok(k));
    }
    e.validateSchemaDeps = c, e.default = S;
  })(Ut)), Ut;
}
var lt = {}, Br;
function pa() {
  if (Br) return lt;
  Br = 1, Object.defineProperty(lt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), d = {
    keyword: "propertyNames",
    type: "object",
    schemaType: ["object", "boolean"],
    error: {
      message: "property name must be valid",
      params: ({ params: S }) => (0, e._)`{propertyName: ${S.propertyName}}`
    },
    code(S) {
      const { gen: o, schema: f, data: c, it: l } = S;
      if ((0, n.alwaysValidSchema)(l, f))
        return;
      const g = o.name("valid");
      o.forIn("key", c, (v) => {
        S.setParams({ propertyName: v }), S.subschema({
          keyword: "propertyNames",
          data: v,
          dataTypes: ["string"],
          propertyName: v,
          compositeRule: !0
        }, g), o.if((0, e.not)(g), () => {
          S.error(!0), l.allErrors || o.break();
        });
      }), S.ok(g);
    }
  };
  return lt.default = d, lt;
}
var dt = {}, Wr;
function En() {
  if (Wr) return dt;
  Wr = 1, Object.defineProperty(dt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Pe(), d = /* @__PURE__ */ Q(), o = {
    keyword: "additionalProperties",
    type: ["object"],
    schemaType: ["boolean", "object"],
    allowUndefined: !0,
    trackErrors: !0,
    error: {
      message: "must NOT have additional properties",
      params: ({ params: f }) => (0, n._)`{additionalProperty: ${f.additionalProperty}}`
    },
    code(f) {
      const { gen: c, schema: l, parentSchema: g, data: v, errsCount: N, it: j } = f;
      if (!N)
        throw new Error("ajv implementation error");
      const { allErrors: O, opts: k } = j;
      if (j.props = !0, k.removeAdditional !== "all" && (0, d.alwaysValidSchema)(j, l))
        return;
      const R = (0, e.allSchemaProperties)(g.properties), p = (0, e.allSchemaProperties)(g.patternProperties);
      _(), f.ok((0, n._)`${N} === ${w.default.errors}`);
      function _() {
        c.forIn("key", v, (s) => {
          !R.length && !p.length ? P(s) : c.if(a(s), () => P(s));
        });
      }
      function a(s) {
        let m;
        if (R.length > 8) {
          const E = (0, d.schemaRefOrVal)(j, g.properties, "properties");
          m = (0, e.isOwnProperty)(c, E, s);
        } else R.length ? m = (0, n.or)(...R.map((E) => (0, n._)`${s} === ${E}`)) : m = n.nil;
        return p.length && (m = (0, n.or)(m, ...p.map((E) => (0, n._)`${(0, e.usePattern)(f, E)}.test(${s})`))), (0, n.not)(m);
      }
      function y(s) {
        c.code((0, n._)`delete ${v}[${s}]`);
      }
      function P(s) {
        if (k.removeAdditional === "all" || k.removeAdditional && l === !1) {
          y(s);
          return;
        }
        if (l === !1) {
          f.setParams({ additionalProperty: s }), f.error(), O || c.break();
          return;
        }
        if (typeof l == "object" && !(0, d.alwaysValidSchema)(j, l)) {
          const m = c.name("valid");
          k.removeAdditional === "failing" ? (i(s, m, !1), c.if((0, n.not)(m), () => {
            f.reset(), y(s);
          })) : (i(s, m), O || c.if((0, n.not)(m), () => c.break()));
        }
      }
      function i(s, m, E) {
        const D = {
          keyword: "additionalProperties",
          dataProp: s,
          dataPropType: d.Type.Str
        };
        E === !1 && Object.assign(D, {
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }), f.subschema(D, m);
      }
    }
  };
  return dt.default = o, dt;
}
var ft = {}, Zr;
function ya() {
  if (Zr) return ft;
  Zr = 1, Object.defineProperty(ft, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ kt(), n = /* @__PURE__ */ _e(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ En(), S = {
    keyword: "properties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: f, schema: c, parentSchema: l, data: g, it: v } = o;
      v.opts.removeAdditional === "all" && l.additionalProperties === void 0 && d.default.code(new e.KeywordCxt(v, d.default, "additionalProperties"));
      const N = (0, n.allSchemaProperties)(c);
      for (const p of N)
        v.definedProperties.add(p);
      v.opts.unevaluated && N.length && v.props !== !0 && (v.props = w.mergeEvaluated.props(f, (0, w.toHash)(N), v.props));
      const j = N.filter((p) => !(0, w.alwaysValidSchema)(v, c[p]));
      if (j.length === 0)
        return;
      const O = f.name("valid");
      for (const p of j)
        k(p) ? R(p) : (f.if((0, n.propertyInData)(f, g, p, v.opts.ownProperties)), R(p), v.allErrors || f.else().var(O, !0), f.endIf()), o.it.definedProperties.add(p), o.ok(O);
      function k(p) {
        return v.opts.useDefaults && !v.compositeRule && c[p].default !== void 0;
      }
      function R(p) {
        o.subschema({
          keyword: "properties",
          schemaProp: p,
          dataProp: p
        }, O);
      }
    }
  };
  return ft.default = S, ft;
}
var ht = {}, Qr;
function va() {
  if (Qr) return ht;
  Qr = 1, Object.defineProperty(ht, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ _e(), n = /* @__PURE__ */ W(), w = /* @__PURE__ */ Q(), d = /* @__PURE__ */ Q(), S = {
    keyword: "patternProperties",
    type: "object",
    schemaType: "object",
    code(o) {
      const { gen: f, schema: c, data: l, parentSchema: g, it: v } = o, { opts: N } = v, j = (0, e.allSchemaProperties)(c), O = j.filter((P) => (0, w.alwaysValidSchema)(v, c[P]));
      if (j.length === 0 || O.length === j.length && (!v.opts.unevaluated || v.props === !0))
        return;
      const k = N.strictSchema && !N.allowMatchingProperties && g.properties, R = f.name("valid");
      v.props !== !0 && !(v.props instanceof n.Name) && (v.props = (0, d.evaluatedPropsToName)(f, v.props));
      const { props: p } = v;
      _();
      function _() {
        for (const P of j)
          k && a(P), v.allErrors ? y(P) : (f.var(R, !0), y(P), f.if(R));
      }
      function a(P) {
        for (const i in k)
          new RegExp(P).test(i) && (0, w.checkStrictMode)(v, `property ${i} matches pattern ${P} (use allowMatchingProperties)`);
      }
      function y(P) {
        f.forIn("key", l, (i) => {
          f.if((0, n._)`${(0, e.usePattern)(o, P)}.test(${i})`, () => {
            const s = O.includes(P);
            s || o.subschema({
              keyword: "patternProperties",
              schemaProp: P,
              dataProp: i,
              dataPropType: d.Type.Str
            }, R), v.opts.unevaluated && p !== !0 ? f.assign((0, n._)`${p}[${i}]`, !0) : !s && !v.allErrors && f.if((0, n.not)(R), () => f.break());
          });
        });
      }
    }
  };
  return ht.default = S, ht;
}
var mt = {}, Yr;
function _a() {
  if (Yr) return mt;
  Yr = 1, Object.defineProperty(mt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: "not",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    code(w) {
      const { gen: d, schema: S, it: o } = w;
      if ((0, e.alwaysValidSchema)(o, S)) {
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
  return mt.default = n, mt;
}
var pt = {}, Xr;
function ga() {
  if (Xr) return pt;
  Xr = 1, Object.defineProperty(pt, "__esModule", { value: !0 });
  const n = {
    keyword: "anyOf",
    schemaType: "array",
    trackErrors: !0,
    code: (/* @__PURE__ */ _e()).validateUnion,
    error: { message: "must match a schema in anyOf" }
  };
  return pt.default = n, pt;
}
var yt = {}, en;
function $a() {
  if (en) return yt;
  en = 1, Object.defineProperty(yt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), d = {
    keyword: "oneOf",
    schemaType: "array",
    trackErrors: !0,
    error: {
      message: "must match exactly one schema in oneOf",
      params: ({ params: S }) => (0, e._)`{passingSchemas: ${S.passing}}`
    },
    code(S) {
      const { gen: o, schema: f, parentSchema: c, it: l } = S;
      if (!Array.isArray(f))
        throw new Error("ajv implementation error");
      if (l.opts.discriminator && c.discriminator)
        return;
      const g = f, v = o.let("valid", !1), N = o.let("passing", null), j = o.name("_valid");
      S.setParams({ passing: N }), o.block(O), S.result(v, () => S.reset(), () => S.error(!0));
      function O() {
        g.forEach((k, R) => {
          let p;
          (0, n.alwaysValidSchema)(l, k) ? o.var(j, !0) : p = S.subschema({
            keyword: "oneOf",
            schemaProp: R,
            compositeRule: !0
          }, j), R > 0 && o.if((0, e._)`${j} && ${v}`).assign(v, !1).assign(N, (0, e._)`[${N}, ${R}]`).else(), o.if(j, () => {
            o.assign(v, !0), o.assign(N, R), p && S.mergeEvaluated(p, e.Name);
          });
        });
      }
    }
  };
  return yt.default = d, yt;
}
var vt = {}, tn;
function wa() {
  if (tn) return vt;
  tn = 1, Object.defineProperty(vt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: "allOf",
    schemaType: "array",
    code(w) {
      const { gen: d, schema: S, it: o } = w;
      if (!Array.isArray(S))
        throw new Error("ajv implementation error");
      const f = d.name("valid");
      S.forEach((c, l) => {
        if ((0, e.alwaysValidSchema)(o, c))
          return;
        const g = w.subschema({ keyword: "allOf", schemaProp: l }, f);
        w.ok(f), w.mergeEvaluated(g);
      });
    }
  };
  return vt.default = n, vt;
}
var _t = {}, rn;
function ba() {
  if (rn) return _t;
  rn = 1, Object.defineProperty(_t, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ Q(), d = {
    keyword: "if",
    schemaType: ["object", "boolean"],
    trackErrors: !0,
    error: {
      message: ({ params: o }) => (0, e.str)`must match "${o.ifClause}" schema`,
      params: ({ params: o }) => (0, e._)`{failingKeyword: ${o.ifClause}}`
    },
    code(o) {
      const { gen: f, parentSchema: c, it: l } = o;
      c.then === void 0 && c.else === void 0 && (0, n.checkStrictMode)(l, '"if" without "then" and "else" is ignored');
      const g = S(l, "then"), v = S(l, "else");
      if (!g && !v)
        return;
      const N = f.let("valid", !0), j = f.name("_valid");
      if (O(), o.reset(), g && v) {
        const R = f.let("ifClause");
        o.setParams({ ifClause: R }), f.if(j, k("then", R), k("else", R));
      } else g ? f.if(j, k("then")) : f.if((0, e.not)(j), k("else"));
      o.pass(N, () => o.error(!0));
      function O() {
        const R = o.subschema({
          keyword: "if",
          compositeRule: !0,
          createErrors: !1,
          allErrors: !1
        }, j);
        o.mergeEvaluated(R);
      }
      function k(R, p) {
        return () => {
          const _ = o.subschema({ keyword: R }, j);
          f.assign(N, j), o.mergeValidEvaluated(_, N), p ? f.assign(p, (0, e._)`${R}`) : o.setParams({ ifClause: R });
        };
      }
    }
  };
  function S(o, f) {
    const c = o.schema[f];
    return c !== void 0 && !(0, n.alwaysValidSchema)(o, c);
  }
  return _t.default = d, _t;
}
var gt = {}, nn;
function Ea() {
  if (nn) return gt;
  nn = 1, Object.defineProperty(gt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Q(), n = {
    keyword: ["then", "else"],
    schemaType: ["object", "boolean"],
    code({ keyword: w, parentSchema: d, it: S }) {
      d.if === void 0 && (0, e.checkStrictMode)(S, `"${w}" without "if" is ignored`);
    }
  };
  return gt.default = n, gt;
}
var an;
function Sa() {
  if (an) return ot;
  an = 1, Object.defineProperty(ot, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ wn(), n = /* @__PURE__ */ da(), w = /* @__PURE__ */ bn(), d = /* @__PURE__ */ fa(), S = /* @__PURE__ */ ha(), o = /* @__PURE__ */ ma(), f = /* @__PURE__ */ pa(), c = /* @__PURE__ */ En(), l = /* @__PURE__ */ ya(), g = /* @__PURE__ */ va(), v = /* @__PURE__ */ _a(), N = /* @__PURE__ */ ga(), j = /* @__PURE__ */ $a(), O = /* @__PURE__ */ wa(), k = /* @__PURE__ */ ba(), R = /* @__PURE__ */ Ea();
  function p(_ = !1) {
    const a = [
      // any
      v.default,
      N.default,
      j.default,
      O.default,
      k.default,
      R.default,
      // object
      f.default,
      c.default,
      o.default,
      l.default,
      g.default
    ];
    return _ ? a.push(n.default, d.default) : a.push(e.default, w.default), a.push(S.default), a;
  }
  return ot.default = p, ot;
}
var $t = {}, wt = {}, sn;
function Pa() {
  if (sn) return wt;
  sn = 1, Object.defineProperty(wt, "__esModule", { value: !0 });
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
      const { gen: o, data: f, $data: c, schema: l, schemaCode: g, it: v } = d, { opts: N, errSchemaPath: j, schemaEnv: O, self: k } = v;
      if (!N.validateFormats)
        return;
      c ? R() : p();
      function R() {
        const _ = o.scopeValue("formats", {
          ref: k.formats,
          code: N.code.formats
        }), a = o.const("fDef", (0, e._)`${_}[${g}]`), y = o.let("fType"), P = o.let("format");
        o.if((0, e._)`typeof ${a} == "object" && !(${a} instanceof RegExp)`, () => o.assign(y, (0, e._)`${a}.type || "string"`).assign(P, (0, e._)`${a}.validate`), () => o.assign(y, (0, e._)`"string"`).assign(P, a)), d.fail$data((0, e.or)(i(), s()));
        function i() {
          return N.strictSchema === !1 ? e.nil : (0, e._)`${g} && !${P}`;
        }
        function s() {
          const m = O.$async ? (0, e._)`(${a}.async ? await ${P}(${f}) : ${P}(${f}))` : (0, e._)`${P}(${f})`, E = (0, e._)`(typeof ${P} == "function" ? ${m} : ${P}.test(${f}))`;
          return (0, e._)`${P} && ${P} !== true && ${y} === ${S} && !${E}`;
        }
      }
      function p() {
        const _ = k.formats[l];
        if (!_) {
          i();
          return;
        }
        if (_ === !0)
          return;
        const [a, y, P] = s(_);
        a === S && d.pass(m());
        function i() {
          if (N.strictSchema === !1) {
            k.logger.warn(E());
            return;
          }
          throw new Error(E());
          function E() {
            return `unknown format "${l}" ignored in schema at path "${j}"`;
          }
        }
        function s(E) {
          const D = E instanceof RegExp ? (0, e.regexpCode)(E) : N.code.formats ? (0, e._)`${N.code.formats}${(0, e.getProperty)(l)}` : void 0, U = o.scopeValue("formats", { key: l, ref: E, code: D });
          return typeof E == "object" && !(E instanceof RegExp) ? [E.type || "string", E.validate, (0, e._)`${U}.validate`] : ["string", E, U];
        }
        function m() {
          if (typeof _ == "object" && !(_ instanceof RegExp) && _.async) {
            if (!O.$async)
              throw new Error("async format in sync schema");
            return (0, e._)`await ${P}(${f})`;
          }
          return typeof y == "function" ? (0, e._)`${P}(${f})` : (0, e._)`${P}.test(${f})`;
        }
      }
    }
  };
  return wt.default = w, wt;
}
var on;
function Ra() {
  if (on) return $t;
  on = 1, Object.defineProperty($t, "__esModule", { value: !0 });
  const n = [(/* @__PURE__ */ Pa()).default];
  return $t.default = n, $t;
}
var Oe = {}, un;
function Na() {
  return un || (un = 1, Object.defineProperty(Oe, "__esModule", { value: !0 }), Oe.contentVocabulary = Oe.metadataVocabulary = void 0, Oe.metadataVocabulary = [
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
var cn;
function Oa() {
  if (cn) return He;
  cn = 1, Object.defineProperty(He, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ Yn(), n = /* @__PURE__ */ la(), w = /* @__PURE__ */ Sa(), d = /* @__PURE__ */ Ra(), S = /* @__PURE__ */ Na(), o = [
    e.default,
    n.default,
    (0, w.default)(),
    d.default,
    S.metadataVocabulary,
    S.contentVocabulary
  ];
  return He.default = o, He;
}
var bt = {}, De = {}, ln;
function ka() {
  if (ln) return De;
  ln = 1, Object.defineProperty(De, "__esModule", { value: !0 }), De.DiscrError = void 0;
  var e;
  return (function(n) {
    n.Tag = "tag", n.Mapping = "mapping";
  })(e || (De.DiscrError = e = {})), De;
}
var dn;
function Ia() {
  if (dn) return bt;
  dn = 1, Object.defineProperty(bt, "__esModule", { value: !0 });
  const e = /* @__PURE__ */ W(), n = /* @__PURE__ */ ka(), w = /* @__PURE__ */ Gt(), d = /* @__PURE__ */ It(), S = /* @__PURE__ */ Q(), f = {
    keyword: "discriminator",
    type: "object",
    schemaType: "object",
    error: {
      message: ({ params: { discrError: c, tagName: l } }) => c === n.DiscrError.Tag ? `tag "${l}" must be string` : `value of tag "${l}" must be in oneOf`,
      params: ({ params: { discrError: c, tag: l, tagName: g } }) => (0, e._)`{error: ${c}, tag: ${g}, tagValue: ${l}}`
    },
    code(c) {
      const { gen: l, data: g, schema: v, parentSchema: N, it: j } = c, { oneOf: O } = N;
      if (!j.opts.discriminator)
        throw new Error("discriminator: requires discriminator option");
      const k = v.propertyName;
      if (typeof k != "string")
        throw new Error("discriminator: requires propertyName");
      if (v.mapping)
        throw new Error("discriminator: mapping is not supported");
      if (!O)
        throw new Error("discriminator: requires oneOf keyword");
      const R = l.let("valid", !1), p = l.const("tag", (0, e._)`${g}${(0, e.getProperty)(k)}`);
      l.if((0, e._)`typeof ${p} == "string"`, () => _(), () => c.error(!1, { discrError: n.DiscrError.Tag, tag: p, tagName: k })), c.ok(R);
      function _() {
        const P = y();
        l.if(!1);
        for (const i in P)
          l.elseIf((0, e._)`${p} === ${i}`), l.assign(R, a(P[i]));
        l.else(), c.error(!1, { discrError: n.DiscrError.Mapping, tag: p, tagName: k }), l.endIf();
      }
      function a(P) {
        const i = l.name("valid"), s = c.subschema({ keyword: "oneOf", schemaProp: P }, i);
        return c.mergeEvaluated(s, e.Name), i;
      }
      function y() {
        var P;
        const i = {}, s = E(N);
        let m = !0;
        for (let M = 0; M < O.length; M++) {
          let K = O[M];
          if (K?.$ref && !(0, S.schemaHasRulesButRef)(K, j.self.RULES)) {
            const x = K.$ref;
            if (K = w.resolveRef.call(j.self, j.schemaEnv.root, j.baseId, x), K instanceof w.SchemaEnv && (K = K.schema), K === void 0)
              throw new d.default(j.opts.uriResolver, j.baseId, x);
          }
          const H = (P = K?.properties) === null || P === void 0 ? void 0 : P[k];
          if (typeof H != "object")
            throw new Error(`discriminator: oneOf subschemas (or referenced schemas) must have "properties/${k}"`);
          m = m && (s || E(K)), D(H, M);
        }
        if (!m)
          throw new Error(`discriminator: "${k}" must be required`);
        return i;
        function E({ required: M }) {
          return Array.isArray(M) && M.includes(k);
        }
        function D(M, K) {
          if (M.const)
            U(M.const, K);
          else if (M.enum)
            for (const H of M.enum)
              U(H, K);
          else
            throw new Error(`discriminator: "properties/${k}" must have "const" or "enum"`);
        }
        function U(M, K) {
          if (typeof M != "string" || M in i)
            throw new Error(`discriminator: "${k}" values must be unique strings`);
          i[M] = K;
        }
      }
    }
  };
  return bt.default = f, bt;
}
const ja = "http://json-schema.org/draft-07/schema#", Ta = "http://json-schema.org/draft-07/schema#", Ca = "Core schema meta-schema", qa = { schemaArray: { type: "array", minItems: 1, items: { $ref: "#" } }, nonNegativeInteger: { type: "integer", minimum: 0 }, nonNegativeIntegerDefault0: { allOf: [{ $ref: "#/definitions/nonNegativeInteger" }, { default: 0 }] }, simpleTypes: { enum: ["array", "boolean", "integer", "null", "number", "object", "string"] }, stringArray: { type: "array", items: { type: "string" }, uniqueItems: !0, default: [] } }, Aa = ["object", "boolean"], Da = { $id: { type: "string", format: "uri-reference" }, $schema: { type: "string", format: "uri" }, $ref: { type: "string", format: "uri-reference" }, $comment: { type: "string" }, title: { type: "string" }, description: { type: "string" }, default: !0, readOnly: { type: "boolean", default: !1 }, examples: { type: "array", items: !0 }, multipleOf: { type: "number", exclusiveMinimum: 0 }, maximum: { type: "number" }, exclusiveMaximum: { type: "number" }, minimum: { type: "number" }, exclusiveMinimum: { type: "number" }, maxLength: { $ref: "#/definitions/nonNegativeInteger" }, minLength: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, pattern: { type: "string", format: "regex" }, additionalItems: { $ref: "#" }, items: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/schemaArray" }], default: !0 }, maxItems: { $ref: "#/definitions/nonNegativeInteger" }, minItems: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, uniqueItems: { type: "boolean", default: !1 }, contains: { $ref: "#" }, maxProperties: { $ref: "#/definitions/nonNegativeInteger" }, minProperties: { $ref: "#/definitions/nonNegativeIntegerDefault0" }, required: { $ref: "#/definitions/stringArray" }, additionalProperties: { $ref: "#" }, definitions: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, properties: { type: "object", additionalProperties: { $ref: "#" }, default: {} }, patternProperties: { type: "object", additionalProperties: { $ref: "#" }, propertyNames: { format: "regex" }, default: {} }, dependencies: { type: "object", additionalProperties: { anyOf: [{ $ref: "#" }, { $ref: "#/definitions/stringArray" }] } }, propertyNames: { $ref: "#" }, const: !0, enum: { type: "array", items: !0, minItems: 1, uniqueItems: !0 }, type: { anyOf: [{ $ref: "#/definitions/simpleTypes" }, { type: "array", items: { $ref: "#/definitions/simpleTypes" }, minItems: 1, uniqueItems: !0 }] }, format: { type: "string" }, contentMediaType: { type: "string" }, contentEncoding: { type: "string" }, if: { $ref: "#" }, then: { $ref: "#" }, else: { $ref: "#" }, allOf: { $ref: "#/definitions/schemaArray" }, anyOf: { $ref: "#/definitions/schemaArray" }, oneOf: { $ref: "#/definitions/schemaArray" }, not: { $ref: "#" } }, Ma = {
  $schema: ja,
  $id: Ta,
  title: Ca,
  definitions: qa,
  type: Aa,
  properties: Da,
  default: !0
};
var fn;
function Sn() {
  return fn || (fn = 1, (function(e, n) {
    Object.defineProperty(n, "__esModule", { value: !0 }), n.MissingRefError = n.ValidationError = n.CodeGen = n.Name = n.nil = n.stringify = n.str = n._ = n.KeywordCxt = n.Ajv = void 0;
    const w = /* @__PURE__ */ Wn(), d = /* @__PURE__ */ Oa(), S = /* @__PURE__ */ Ia(), o = Ma, f = ["/properties"], c = "http://json-schema.org/draft-07/schema";
    class l extends w.default {
      _addVocabularies() {
        super._addVocabularies(), d.default.forEach((k) => this.addVocabulary(k)), this.opts.discriminator && this.addKeyword(S.default);
      }
      _addDefaultMetaSchema() {
        if (super._addDefaultMetaSchema(), !this.opts.meta)
          return;
        const k = this.opts.$data ? this.$dataMetaSchema(o, f) : o;
        this.addMetaSchema(k, c, !1), this.refs["http://json-schema.org/schema"] = c;
      }
      defaultMeta() {
        return this.opts.defaultMeta = super.defaultMeta() || (this.getSchema(c) ? c : void 0);
      }
    }
    n.Ajv = l, e.exports = n = l, e.exports.Ajv = l, Object.defineProperty(n, "__esModule", { value: !0 }), n.default = l;
    var g = /* @__PURE__ */ kt();
    Object.defineProperty(n, "KeywordCxt", { enumerable: !0, get: function() {
      return g.KeywordCxt;
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
    var N = /* @__PURE__ */ xt();
    Object.defineProperty(n, "ValidationError", { enumerable: !0, get: function() {
      return N.default;
    } });
    var j = /* @__PURE__ */ It();
    Object.defineProperty(n, "MissingRefError", { enumerable: !0, get: function() {
      return j.default;
    } });
  })(ze, ze.exports)), ze.exports;
}
var Fa = /* @__PURE__ */ Sn();
const za = /* @__PURE__ */ yn(Fa);
var Et = { exports: {} }, Lt = {}, hn;
function Va() {
  return hn || (hn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatNames = e.fastFormats = e.fullFormats = void 0;
    function n(M, K) {
      return { validate: M, compare: K };
    }
    e.fullFormats = {
      // date: http://tools.ietf.org/html/rfc3339#section-5.6
      date: n(o, f),
      // date-time: http://tools.ietf.org/html/rfc3339#section-5.6
      time: n(l(!0), g),
      "date-time": n(j(!0), O),
      "iso-time": n(l(), v),
      "iso-date-time": n(j(), k),
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
      regex: U,
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
      byte: y,
      // signed 32 bit integer
      int32: { type: "number", validate: s },
      // signed 64 bit integer
      int64: { type: "number", validate: m },
      // C-type float
      float: { type: "number", validate: E },
      // C-type double
      double: { type: "number", validate: E },
      // hint to the UI to hide input strings
      password: !0,
      // unchecked string payload
      binary: !0
    }, e.fastFormats = {
      ...e.fullFormats,
      date: n(/^\d\d\d\d-[0-1]\d-[0-3]\d$/, f),
      time: n(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, g),
      "date-time": n(/^\d\d\d\d-[0-1]\d-[0-3]\dt(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)$/i, O),
      "iso-time": n(/^(?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, v),
      "iso-date-time": n(/^\d\d\d\d-[0-1]\d-[0-3]\d[t\s](?:[0-2]\d:[0-5]\d:[0-5]\d|23:59:60)(?:\.\d+)?(?:z|[+-]\d\d(?::?\d\d)?)?$/i, k),
      // uri: https://github.com/mafintosh/is-my-json-valid/blob/master/formats.js
      uri: /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/)?[^\s]*$/i,
      "uri-reference": /^(?:(?:[a-z][a-z0-9+\-.]*:)?\/?\/)?(?:[^\\\s#][^\s#]*)?(?:#[^\\\s]*)?$/i,
      // email (sources from jsen validator):
      // http://stackoverflow.com/questions/201323/using-a-regular-expression-to-validate-an-email-address#answer-8829363
      // http://www.w3.org/TR/html5/forms.html#valid-e-mail-address (search for 'wilful violation')
      email: /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i
    }, e.formatNames = Object.keys(e.fullFormats);
    function w(M) {
      return M % 4 === 0 && (M % 100 !== 0 || M % 400 === 0);
    }
    const d = /^(\d\d\d\d)-(\d\d)-(\d\d)$/, S = [0, 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    function o(M) {
      const K = d.exec(M);
      if (!K)
        return !1;
      const H = +K[1], x = +K[2], Z = +K[3];
      return x >= 1 && x <= 12 && Z >= 1 && Z <= (x === 2 && w(H) ? 29 : S[x]);
    }
    function f(M, K) {
      if (M && K)
        return M > K ? 1 : M < K ? -1 : 0;
    }
    const c = /^(\d\d):(\d\d):(\d\d(?:\.\d+)?)(z|([+-])(\d\d)(?::?(\d\d))?)?$/i;
    function l(M) {
      return function(H) {
        const x = c.exec(H);
        if (!x)
          return !1;
        const Z = +x[1], ie = +x[2], oe = +x[3], Y = x[4], ue = x[5] === "-" ? -1 : 1, z = +(x[6] || 0), u = +(x[7] || 0);
        if (z > 23 || u > 59 || M && !Y)
          return !1;
        if (Z <= 23 && ie <= 59 && oe < 60)
          return !0;
        const b = ie - u * ue, h = Z - z * ue - (b < 0 ? 1 : 0);
        return (h === 23 || h === -1) && (b === 59 || b === -1) && oe < 61;
      };
    }
    function g(M, K) {
      if (!(M && K))
        return;
      const H = (/* @__PURE__ */ new Date("2020-01-01T" + M)).valueOf(), x = (/* @__PURE__ */ new Date("2020-01-01T" + K)).valueOf();
      if (H && x)
        return H - x;
    }
    function v(M, K) {
      if (!(M && K))
        return;
      const H = c.exec(M), x = c.exec(K);
      if (H && x)
        return M = H[1] + H[2] + H[3], K = x[1] + x[2] + x[3], M > K ? 1 : M < K ? -1 : 0;
    }
    const N = /t|\s/i;
    function j(M) {
      const K = l(M);
      return function(x) {
        const Z = x.split(N);
        return Z.length === 2 && o(Z[0]) && K(Z[1]);
      };
    }
    function O(M, K) {
      if (!(M && K))
        return;
      const H = new Date(M).valueOf(), x = new Date(K).valueOf();
      if (H && x)
        return H - x;
    }
    function k(M, K) {
      if (!(M && K))
        return;
      const [H, x] = M.split(N), [Z, ie] = K.split(N), oe = f(H, Z);
      if (oe !== void 0)
        return oe || g(x, ie);
    }
    const R = /\/|:/, p = /^(?:[a-z][a-z0-9+\-.]*:)(?:\/?\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:]|%[0-9a-f]{2})*@)?(?:\[(?:(?:(?:(?:[0-9a-f]{1,4}:){6}|::(?:[0-9a-f]{1,4}:){5}|(?:[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){4}|(?:(?:[0-9a-f]{1,4}:){0,1}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){3}|(?:(?:[0-9a-f]{1,4}:){0,2}[0-9a-f]{1,4})?::(?:[0-9a-f]{1,4}:){2}|(?:(?:[0-9a-f]{1,4}:){0,3}[0-9a-f]{1,4})?::[0-9a-f]{1,4}:|(?:(?:[0-9a-f]{1,4}:){0,4}[0-9a-f]{1,4})?::)(?:[0-9a-f]{1,4}:[0-9a-f]{1,4}|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?))|(?:(?:[0-9a-f]{1,4}:){0,5}[0-9a-f]{1,4})?::[0-9a-f]{1,4}|(?:(?:[0-9a-f]{1,4}:){0,6}[0-9a-f]{1,4})?::)|[Vv][0-9a-f]+\.[a-z0-9\-._~!$&'()*+,;=:]+)\]|(?:(?:25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(?:25[0-5]|2[0-4]\d|[01]?\d\d?)|(?:[a-z0-9\-._~!$&'()*+,;=]|%[0-9a-f]{2})*)(?::\d*)?(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*|\/(?:(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)?|(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})+(?:\/(?:[a-z0-9\-._~!$&'()*+,;=:@]|%[0-9a-f]{2})*)*)(?:\?(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?(?:#(?:[a-z0-9\-._~!$&'()*+,;=:@/?]|%[0-9a-f]{2})*)?$/i;
    function _(M) {
      return R.test(M) && p.test(M);
    }
    const a = /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/gm;
    function y(M) {
      return a.lastIndex = 0, a.test(M);
    }
    const P = -2147483648, i = 2 ** 31 - 1;
    function s(M) {
      return Number.isInteger(M) && M <= i && M >= P;
    }
    function m(M) {
      return Number.isInteger(M);
    }
    function E() {
      return !0;
    }
    const D = /[^\\]\\Z/;
    function U(M) {
      if (D.test(M))
        return !1;
      try {
        return new RegExp(M), !0;
      } catch {
        return !1;
      }
    }
  })(Lt)), Lt;
}
var Kt = {}, mn;
function Ua() {
  return mn || (mn = 1, (function(e) {
    Object.defineProperty(e, "__esModule", { value: !0 }), e.formatLimitDefinition = void 0;
    const n = /* @__PURE__ */ Sn(), w = /* @__PURE__ */ W(), d = w.operators, S = {
      formatMaximum: { okStr: "<=", ok: d.LTE, fail: d.GT },
      formatMinimum: { okStr: ">=", ok: d.GTE, fail: d.LT },
      formatExclusiveMaximum: { okStr: "<", ok: d.LT, fail: d.GTE },
      formatExclusiveMinimum: { okStr: ">", ok: d.GT, fail: d.LTE }
    }, o = {
      message: ({ keyword: c, schemaCode: l }) => (0, w.str)`should be ${S[c].okStr} ${l}`,
      params: ({ keyword: c, schemaCode: l }) => (0, w._)`{comparison: ${S[c].okStr}, limit: ${l}}`
    };
    e.formatLimitDefinition = {
      keyword: Object.keys(S),
      type: "string",
      schemaType: "string",
      $data: !0,
      error: o,
      code(c) {
        const { gen: l, data: g, schemaCode: v, keyword: N, it: j } = c, { opts: O, self: k } = j;
        if (!O.validateFormats)
          return;
        const R = new n.KeywordCxt(j, k.RULES.all.format.definition, "format");
        R.$data ? p() : _();
        function p() {
          const y = l.scopeValue("formats", {
            ref: k.formats,
            code: O.code.formats
          }), P = l.const("fmt", (0, w._)`${y}[${R.schemaCode}]`);
          c.fail$data((0, w.or)((0, w._)`typeof ${P} != "object"`, (0, w._)`${P} instanceof RegExp`, (0, w._)`typeof ${P}.compare != "function"`, a(P)));
        }
        function _() {
          const y = R.schema, P = k.formats[y];
          if (!P || P === !0)
            return;
          if (typeof P != "object" || P instanceof RegExp || typeof P.compare != "function")
            throw new Error(`"${N}": format "${y}" does not define "compare" function`);
          const i = l.scopeValue("formats", {
            key: y,
            ref: P,
            code: O.code.formats ? (0, w._)`${O.code.formats}${(0, w.getProperty)(y)}` : void 0
          });
          c.fail$data(a(i));
        }
        function a(y) {
          return (0, w._)`${y}.compare(${g}, ${v}) ${S[N].fail} 0`;
        }
      },
      dependencies: ["format"]
    };
    const f = (c) => (c.addKeyword(e.formatLimitDefinition), c);
    e.default = f;
  })(Kt)), Kt;
}
var pn;
function La() {
  return pn || (pn = 1, (function(e, n) {
    Object.defineProperty(n, "__esModule", { value: !0 });
    const w = Va(), d = Ua(), S = /* @__PURE__ */ W(), o = new S.Name("fullFormats"), f = new S.Name("fastFormats"), c = (g, v = { keywords: !0 }) => {
      if (Array.isArray(v))
        return l(g, v, w.fullFormats, o), g;
      const [N, j] = v.mode === "fast" ? [w.fastFormats, f] : [w.fullFormats, o], O = v.formats || w.formatNames;
      return l(g, O, N, j), v.keywords && (0, d.default)(g), g;
    };
    c.get = (g, v = "full") => {
      const j = (v === "fast" ? w.fastFormats : w.fullFormats)[g];
      if (!j)
        throw new Error(`Unknown format "${g}"`);
      return j;
    };
    function l(g, v, N, j) {
      var O, k;
      (O = (k = g.opts.code).formats) !== null && O !== void 0 || (k.formats = (0, S._)`require("ajv-formats/dist/formats").${j}`);
      for (const R of v)
        g.addFormat(R, N[R]);
    }
    e.exports = n = c, Object.defineProperty(n, "__esModule", { value: !0 }), n.default = c;
  })(Et, Et.exports)), Et.exports;
}
var Ka = La();
const Ha = /* @__PURE__ */ yn(Ka), xa = { class: "ac-options" }, Ga = { class: "kx-focus-outline" }, Ja = {
  key: 0,
  class: "ac-muted"
}, Ba = {
  key: 0,
  class: "ac-muted"
}, Wa = { class: "ac-option-head" }, Za = { class: "ac-muted" }, Qa = ["aria-label", "aria-invalid", "aria-describedby", "value", "onChange"], Ya = { value: "" }, Xa = ["value"], es = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], ts = ["aria-label", "aria-invalid", "aria-describedby", "value", "placeholder", "onInput"], rs = ["aria-label", "onClick"], ns = ["id"], as = {
  key: 0,
  class: "ac-muted"
}, cs = /* @__PURE__ */ Rn({
  __name: "driver-options",
  props: {
    options: {},
    modelValue: {},
    defaults: {}
  },
  emits: ["update:modelValue", "invalid"],
  setup(e, { emit: n }) {
    const w = e, d = n, S = St(""), o = St({}), f = St({}), c = Nn(), l = new za({ strict: !1, allErrors: !0 });
    Ha(l);
    const g = me(() => new Map(w.options.map((s) => {
      try {
        return [s.name, s.schema ? l.compile(s.schema) : void 0];
      } catch {
        return [s.name, "Invalid option schema"];
      }
    }))), v = me(() => {
      const s = S.value.trim().toLowerCase();
      return Cn(w.options).filter((m) => !s || [m.name, m.label, m.description, m.section, m.group].join(" ").toLowerCase().includes(s)).sort((m, E) => +(E.section === "basic") - +(m.section === "basic") || m.section.localeCompare(E.section) || m.group.localeCompare(E.group) || m.order - E.order || m.name.localeCompare(E.name));
    }), N = me(() => Object.keys(w.modelValue).length);
    Ht(() => Object.fromEntries(w.options.map((s) => [s.name, JSON.stringify([w.modelValue[s.name], s])])), (s, m) => {
      for (const E of Object.keys(o.value))
        (s[E] !== m?.[E] || !(E in s)) && (delete o.value[E], delete f.value[E]);
      d("invalid", Object.keys(f.value).length);
    }, { immediate: !0 });
    function j(s, m) {
      const E = { ...w.modelValue };
      m === void 0 ? delete E[s] : E[s] = m, d("update:modelValue", E);
    }
    function O(s) {
      delete o.value[s.name], p(s, void 0);
    }
    function k(s) {
      if (s.name in o.value) return o.value[s.name];
      const m = w.modelValue[s.name];
      return m === void 0 ? "" : s.type === "json" ? JSON.stringify(m) : s.type === "ids" && Array.isArray(m) && m.every((E) => typeof E == "string") ? m.join(", ") : String(m);
    }
    function R(s, m) {
      m ? f.value[s] = m : delete f.value[s], d("invalid", Object.keys(f.value).length);
    }
    function p(s, m) {
      const E = g.value.get(s.name);
      if (m !== void 0 && E) {
        if (typeof E == "string") {
          R(s.name, E);
          return;
        }
        if (!E(m)) {
          R(s.name, l.errorsText(E.errors));
          return;
        }
      }
      R(s.name), j(s.name, m);
    }
    function _(s, m) {
      o.value[s.name] = m;
      const E = m.trim();
      if (!E) {
        p(s, s.type === "ids" ? [] : s.type === "text" || s.type === "string" ? "" : void 0);
        return;
      }
      if (s.type === "json") {
        let D;
        try {
          D = JSON.parse(E);
        } catch {
          R(s.name, "Not valid JSON");
          return;
        }
        p(s, D);
      } else if (s.type === "ids") p(s, E.split(",").map((D) => D.trim()).filter(Boolean));
      else if ([s.type, s.schema?.type].some((D) => D === "number" || D === "integer")) {
        const D = Number(E);
        if (!Number.isFinite(D)) {
          R(s.name, "Not a finite number");
          return;
        }
        if ((s.type === "integer" || s.schema?.type === "integer") && !Number.isInteger(D)) {
          R(s.name, "Not an integer");
          return;
        }
        p(s, D);
      } else p(s, E);
    }
    function a(s, m) {
      if (!(m.target instanceof HTMLSelectElement)) return;
      const E = m.target.value;
      if (!E) {
        p(s, void 0);
        return;
      }
      p(s, s.type === "boolean" ? E === "true" : (s.values ?? []).find((D) => String(D) === E) ?? E);
    }
    function y(s, m) {
      (m.target instanceof HTMLInputElement || m.target instanceof HTMLTextAreaElement) && _(s, m.target.value);
    }
    function P(s) {
      const m = w.modelValue[s.name];
      return m === void 0 ? "" : String(m);
    }
    function i(s) {
      const m = w.defaults?.[s.name] ?? s.default;
      return m == null ? "CLI default" : `default: ${JSON.stringify(m)}`;
    }
    return (s, m) => (de(), fe("details", xa, [
      ge("summary", Ga, [
        m[1] || (m[1] = Zt("Driver options", -1)),
        N.value ? (de(), fe("span", Ja, " · " + Ee(N.value) + " set", 1)) : Ce("", !0)
      ]),
      On(ge("input", {
        "onUpdate:modelValue": m[0] || (m[0] = (E) => S.value = E),
        class: "ac-mono ac-options-filter kx-focus-halo",
        placeholder: "Filter options",
        "aria-label": "Filter driver options"
      }, null, 512), [
        [kn, S.value]
      ]),
      (de(!0), fe(Me, null, Qt(v.value, (E, D) => (de(), fe("div", {
        key: E.name,
        class: "ac-option"
      }, [
        D === 0 || E.section !== v.value[D - 1].section || E.group !== v.value[D - 1].group ? (de(), fe("div", Ba, Ee([E.section, E.group].filter(Boolean).join(" · ")), 1)) : Ce("", !0),
        ge("div", Wa, [
          ge("span", null, Ee(E.label || E.name), 1),
          ge("small", Za, [
            ge("code", null, Ee(E.name), 1),
            E.description && E.description !== E.label ? (de(), fe(Me, { key: 0 }, [
              Zt(" — " + Ee(E.description), 1)
            ], 64)) : Ce("", !0)
          ])
        ]),
        E.type === "boolean" || E.type === "enum" ? (de(), fe("select", {
          key: 1,
          class: "kx-focus-halo",
          "aria-label": E.label || E.name,
          "aria-invalid": !!f.value[E.name],
          "aria-describedby": f.value[E.name] ? `${Fe(c)}-${E.name}-error` : void 0,
          value: P(E),
          onChange: (U) => a(E, U)
        }, [
          ge("option", Ya, Ee(i(E)), 1),
          E.type === "boolean" ? (de(), fe(Me, { key: 0 }, [
            m[2] || (m[2] = ge("option", { value: "true" }, "on", -1)),
            m[3] || (m[3] = ge("option", { value: "false" }, "off", -1))
          ], 64)) : (de(!0), fe(Me, { key: 1 }, Qt(E.values ?? [], (U) => (de(), fe("option", {
            key: String(U),
            value: String(U)
          }, Ee(U), 9, Xa))), 128))
        ], 40, Qa)) : E.type === "json" ? (de(), fe("textarea", {
          key: 2,
          rows: "2",
          class: "ac-mono kx-focus-halo",
          "aria-label": E.label || E.name,
          "aria-invalid": !!f.value[E.name],
          "aria-describedby": f.value[E.name] ? `${Fe(c)}-${E.name}-error` : void 0,
          value: k(E),
          placeholder: `JSON · ${i(E)}`,
          onInput: (U) => y(E, U)
        }, null, 40, es)) : (de(), fe("input", {
          key: 3,
          class: "ac-mono kx-focus-halo",
          "aria-label": E.label || E.name,
          "aria-invalid": !!f.value[E.name],
          "aria-describedby": f.value[E.name] ? `${Fe(c)}-${E.name}-error` : void 0,
          value: k(E),
          placeholder: w.modelValue[E.name] !== void 0 && !k(E) ? "Empty override" : E.type === "ids" ? "comma separated" : i(E),
          onInput: (U) => y(E, U)
        }, null, 40, ts)),
        ge("button", {
          type: "button",
          class: "ac-link kx-focus-outline",
          "aria-label": `Use default for ${E.label || E.name}`,
          onClick: (U) => O(E)
        }, "Use default", 8, rs),
        f.value[E.name] ? (de(), fe("small", {
          key: 4,
          id: `${Fe(c)}-${E.name}-error`,
          class: "kx-err",
          role: "alert"
        }, Ee(f.value[E.name]), 9, ns)) : Ce("", !0)
      ]))), 128)),
      v.value.length ? Ce("", !0) : (de(), fe("p", as, "No matching options."))
    ]));
  }
});
export {
  cs as _,
  Tn as d,
  is as e,
  us as u
};
