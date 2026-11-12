import { ref as Q, onMounted as et, onUnmounted as tt, watch as st, createApp as rt, inject as be } from "vue";
import { addCollection as nt } from "@iconify/vue";
import { config as Se, addIcons as it, on as at, applyThemeMode as X, host as ot, hostCss as ct, loadCss as lt } from "@wippy-fe/proxy";
import { getActivePinia as dt, createPinia as ut, setActivePinia as ht } from "pinia";
var ue = "data-wippy-visible";
function Te(s) {
  const e = s.getAttribute(ue);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var ft = Object.defineProperty, pt = (s, e, t) => e in s ? ft(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, w = (s, e, t) => pt(s, typeof e != "symbol" ? e + "" : e, t), mt = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], _t = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function Oe(s) {
  const e = s.startsWith("--") ? s : `--${s}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function yt(...s) {
  const e = /* @__PURE__ */ new Set();
  for (const t of s)
    if (t)
      for (const [r, n] of Object.entries(t)) {
        if ((r === "@light" || r === "@dark") && n && typeof n == "object") {
          for (const [a, o] of Object.entries(n)) {
            const d = typeof o == "string" ? Oe(a) : null;
            d && e.add(d);
          }
          continue;
        }
        const i = typeof n == "string" ? Oe(r) : null;
        i && e.add(i);
      }
  return [...e].sort();
}
function gt(s) {
  if (s.length === 0)
    return "";
  const e = s.map((t) => `  ${t}: inherit;`).join(`
`);
  return `${_t} {
${e}
}`;
}
function vt(s, e) {
  const t = gt(e);
  t && Ue(s, t, "@wippy-fe/css-variables-bridge");
}
function bt(s, e) {
  const r = (e ?? mt).map(async (n) => {
    const i = ct[n];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${n}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await lt(i);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${n}" (${i}):`, a), null;
    }
  });
  return Promise.all(r).then((n) => {
    for (const i of n) {
      if (!i)
        continue;
      const a = document.createElement("style");
      a.textContent = i, a.setAttribute("role", "@wippy-fe/host-css"), s.appendChild(a);
    }
  });
}
function xt(s, e) {
  const t = document.createElement("style");
  t.textContent = e, s.appendChild(t);
}
function Ue(s, e, t) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const n = new CSSStyleSheet();
    n.replaceSync(e), s.adoptedStyleSheets = [...s.adoptedStyleSheets, n];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", t), r.textContent = e, s.appendChild(r);
}
function kt(s, e) {
  Ue(s, e, "@wippy-fe/custom-css");
}
function Be(s) {
  return s.__wippyHost ?? null;
}
function wt(s) {
  return s.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function Ct(s, e, t) {
  switch (t.type) {
    case "string":
      return { value: e };
    case "number": {
      const r = Number.parseFloat(e);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${s}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(e, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${s}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(e);
        return t.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${s}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${s}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function le(s, e) {
  const t = {}, r = [];
  for (const [n, i] of Object.entries(e.properties)) {
    const a = s.getAttribute(n), o = wt(n);
    if (a === null) {
      i.default !== void 0 && (t[o] = i.default);
      continue;
    }
    const d = Ct(n, a, i);
    d.error ? r.push(d.error) : t[o] = d.value;
  }
  return { props: t, errors: r };
}
var St = class {
  constructor(s, e) {
    w(this, "_props"), w(this, "_errors"), w(this, "_content"), w(this, "_hostVisibility"), w(this, "_propsListeners", /* @__PURE__ */ new Set()), w(this, "_contentListeners", /* @__PURE__ */ new Set()), w(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), w(this, "_disposed", !1), w(this, "_emitToDom"), w(this, "props"), w(this, "events"), w(this, "content"), w(this, "hostVisibility"), this._props = s.props, this._errors = s.errors, this._content = s.content, this._hostVisibility = s.hostVisibility, this._emitToDom = e;
    const t = this;
    this.props = {
      get value() {
        return t._props;
      },
      get errors() {
        return t._errors;
      },
      subscribe(r, n) {
        return t._subscribeProps(r, n);
      }
    }, this.events = {
      emit(r, n) {
        t._disposed || t._emitToDom(r, n);
      }
    }, this.content = s.hasContent ? {
      get value() {
        return t._content;
      },
      subscribe(r, n) {
        return t._subscribeContent(r, n);
      }
    } : null, this.hostVisibility = {
      get value() {
        return t._hostVisibility;
      },
      subscribe(r, n) {
        return t._subscribeHostVisibility(r, n);
      }
    };
  }
  /** @internal */
  notifyProps(s, e) {
    if (!this._disposed) {
      this._props = s, this._errors = e;
      for (const t of this._propsListeners)
        t(s, e);
    }
  }
  /** @internal */
  notifyContent(s) {
    if (!this._disposed) {
      this._content = s;
      for (const e of this._contentListeners)
        e(s);
    }
  }
  /** @internal */
  notifyHostVisibility(s, e) {
    if (!(this._disposed || s === e)) {
      this._hostVisibility = s;
      for (const t of this._hostVisibilityListeners)
        t(s, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(s, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(s), e?.immediate && s(this._props, this._errors);
    const t = () => {
      this._propsListeners.delete(s), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
  _subscribeContent(s, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(s), e?.immediate && s(this._content);
    const t = () => {
      this._contentListeners.delete(s), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
  _subscribeHostVisibility(s, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(s), e?.immediate && s(this._hostVisibility, this._hostVisibility);
    const t = () => {
      this._hostVisibilityListeners.delete(s), e?.signal?.removeEventListener("abort", t);
    };
    return e?.signal?.addEventListener("abort", t, { once: !0 }), t;
  }
}, Tt = class extends HTMLElement {
  constructor() {
    super(), w(this, "_internals"), w(this, "_contentObserver", null), w(this, "_initialized", !1), w(this, "_container", null), w(this, "_reactive", null), w(this, "_lastProps", null), w(this, "_lastErrors", []), w(this, "_lastContent", null), w(this, "_themeUnsub", null), w(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = Te(this);
  }
  /**
   * Override to provide the component's configuration.
   * Must be static because `observedAttributes` reads it before construction.
   *
   * Specify the generic to get typed `validateProps`:
   * ```ts
   * static get wippyConfig(): WippyElementConfig<MyProps> { ... }
   * ```
   */
  static get wippyConfig() {
    return { propsSchema: { properties: {} } };
  }
  /**
   * Derived from the props schema + any `extraObservedAttributes`.
   */
  static get observedAttributes() {
    const s = this.wippyConfig, e = Object.keys(s.propsSchema.properties), t = s.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...t, ue])];
  }
  /**
   * Host-owned logical activity. `null` means no host manages this element.
   * It is not CSS visibility or viewport intersection.
   */
  get hostVisible() {
    return this._hostVisible;
  }
  /**
   * Panel-scoped `host` wrapper attached by the managed-layout shell's
   * content resolvers (`ComponentResolver` / `WebComponentPackageLoader`).
   *
   * Inside a managed-layout panel, this is a wrapper around the universal
   * `host` API where context-aware calls (`layout.broadcast / send / on`)
   * are routed through the panel-bound bus — so `sourcePanelId` is
   * attributed correctly without postMessage indirection. Layout
   * mutations and other host methods pass through unchanged.
   *
   * `null` outside a managed-layout context (compat shell, chat sidebar,
   * standalone playground). Subclass code that needs a host in those
   * cases can fall back to `import { host } from '@wippy-fe/proxy'`.
   */
  get host() {
    return Be(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(s, e) {
    this.dispatchEvent(new CustomEvent(s, {
      bubbles: !0,
      composed: !0,
      detail: e
    }));
  }
  /**
   * Opt-in reactive adapter — framework-agnostic. Subscribe to prop
   * changes, content changes, or emit typed events from a non-Vue
   * consumer without re-rolling reactivity.
   *
   * ```ts
   * class MyEl extends WippyElement<{ count: number }, { tick: { n: number } }> {
   *   protected onMount() {
   *     const ctrl = new AbortController()
   *     this.reactive.props.subscribe(({ count }) => {
   *       this.shadowRoot!.querySelector('.n')!.textContent = String(count)
   *     }, { signal: ctrl.signal, immediate: true })
   *   }
   *   tick(n: number) { this.reactive.events.emit('tick', { n }) }
   * }
   * ```
   *
   * Allocation cost is zero unless this getter is touched. Disposed on
   * `disconnectedCallback`; a fresh adapter is allocated on the next
   * access after reconnect.
   */
  get reactive() {
    if (!this._reactive) {
      const s = this.constructor.wippyConfig, e = !!s.contentTemplate;
      let t, r;
      if (this._lastProps !== null)
        t = this._lastProps, r = this._lastErrors;
      else {
        const i = le(this, s.propsSchema);
        s.validateProps && i.errors.push(...s.validateProps(i.props)), t = i.props, r = i.errors, this._lastProps = t, this._lastErrors = r;
      }
      const n = e ? this._lastContent ?? this._extractContent(s.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = n), this._reactive = new St(
        { props: t, errors: r, content: n, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const s = this.constructor.wippyConfig, e = this._initialized, t = this.shadowRoot ?? this.attachShadow({ mode: s.shadowMode ?? "open" });
      let r;
      if (e)
        r = this._container;
      else {
        this.onInit(t), s.inlineCss && xt(t, s.inlineCss);
        try {
          const l = Se?.theming, m = yt(
            l?.global?.cssVariables,
            l?.children?.cssVariables
          );
          vt(t, m);
        } catch {
        }
        if (s.customCss !== !1)
          try {
            const l = Se?.theming, m = [l?.global?.customCSS, l?.children?.customCSS].filter(Boolean).join(`
`);
            m && kt(t, m);
          } catch {
          }
        (s.hostCssKeys === void 0 || s.hostCssKeys.length > 0) && bt(t, s.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const d = s.containerClasses ?? [];
        d.length > 0 && r.classList.add(...d), t.appendChild(r), this._container = r, it(nt);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = at("@theme", (d) => this._applyTheme(d)));
      const { props: n, errors: i } = le(this, s.propsSchema);
      s.validateProps && i.push(...s.validateProps(n));
      const a = n;
      this._lastProps = a, this._lastErrors = i;
      let o = null;
      s.contentTemplate && (o = this._extractContent(s.contentTemplate), this._lastContent = o, this._contentObserver = new MutationObserver(() => {
        const d = this._extractContent(s.contentTemplate);
        this._lastContent = d, this._reactive?.notifyContent(d), this.onContentChanged(d);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(t, r, a, i, o, e), this._internals.states.delete("loading"), this._internals.states.add("ready"), e || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (s) {
      this.onError(s), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: s instanceof Error ? s.message : String(s),
        error: s
      });
    }
  }
  /**
   * Applies a forced theme mode to this host element AND the shadow container.
   * The container class drives in-shadow selectors (Tailwind `dark:` utilities,
   * `.w-theme-dark &`); the host-element class drives `:host(.w-theme-*)`
   * selectors. On `@theme` broadcasts the resolved `mode` is passed in directly
   * (don't re-read `getThemeMode()` — the proxy's config-vs-emit order isn't a
   * contract); on the initial connect it defaults to the host's current mode.
   * No-op for an older proxy without `getThemeMode` — `applyThemeMode` clamps
   * `undefined` to 'auto'.
   */
  _applyTheme(s = ot.getThemeMode?.()) {
    X(s, this), this._container && X(s, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), X("auto", this), this._container && X("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(s, e, t) {
    if (e === t)
      return;
    if (s === ue) {
      const o = this._hostVisible, d = Te(this);
      if (d === o)
        return;
      this._hostVisible = d, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(d, o), this.onHostVisibilityChanged(d, o));
      return;
    }
    const r = this.constructor.wippyConfig, { props: n, errors: i } = le(this, r.propsSchema);
    r.validateProps && i.push(...r.validateProps(n));
    const a = n;
    this._lastProps = a, this._lastErrors = i, this._reactive?.notifyProps(a, i), this.onPropsChanged(a, i);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(s) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(s) {
    console.error(`${this.constructor.name} initialization failed:`, s);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(s, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(s, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(s) {
    return this.querySelector(`template[data-type="${s}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(s) {
  }
};
function Ot(s) {
  return s.__wippyHostBus ?? null;
}
function Et(s) {
  return s.dataset.wippyPanelId ?? null;
}
var Rt = Object.defineProperty, At = (s, e, t) => e in s ? Rt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, M = (s, e, t) => At(s, typeof e != "symbol" ? e + "" : e, t), We = /* @__PURE__ */ Symbol("wippy:emit"), Fe = /* @__PURE__ */ Symbol("wippy:props"), Nt = /* @__PURE__ */ Symbol("wippy:props_error"), It = /* @__PURE__ */ Symbol("wippy:content"), Vt = /* @__PURE__ */ Symbol("wippy:panel-id"), Zt = /* @__PURE__ */ Symbol("wippy:layout-bus"), jt = /* @__PURE__ */ Symbol("wippy:host"), He = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ws() {
  const s = be(Fe);
  if (!s)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return s;
}
function Cs() {
  const s = be(We);
  if (!s)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return s;
}
function Pt() {
  const s = be(He);
  if (!s)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return s;
}
function Ss(s) {
  const e = Pt();
  let t = !1, r = null, n = !1;
  function i() {
    if (r)
      return n = !0, r;
    let a;
    try {
      a = Promise.resolve(s());
    } catch (d) {
      a = Promise.reject(d);
    }
    const o = a.finally(() => {
      if (r === o && (r = null, t && n))
        return n = !1, i();
    });
    return r = o, o;
  }
  return et(() => (t = !0, i())), tt(() => {
    t = !1, n = !1;
  }), st(e, (a, o) => {
    if (t && o === !1 && a === !0)
      return i();
  }), e;
}
var Ts = class extends Tt {
  constructor() {
    super(...arguments), M(this, "_vueApp", null), M(this, "_propsRef", Q({})), M(this, "_errorsRef", Q([])), M(this, "_contentRef", Q(null)), M(this, "_hostVisibilityRef", Q(null)), M(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(s, e, t, r, n, i) {
    const a = this.constructor.vueConfig;
    this._propsRef.value = t, this._errorsRef.value = r, this._contentRef.value = n ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const l of r)
      this.emitEvent("invalid", { message: l });
    const o = new AbortController();
    this._bridgeAbort = o, this.reactive.props.subscribe((l, m) => {
      this._propsRef.value = l, this._errorsRef.value = [...m];
      for (const k of m)
        this.emitEvent("invalid", { message: k });
    }, { signal: o.signal }), this.reactive.content && this.reactive.content.subscribe((l) => {
      this._contentRef.value = l;
    }, { signal: o.signal }), this.reactive.hostVisibility.subscribe((l) => {
      this._hostVisibilityRef.value = l;
    }, { signal: o.signal });
    const d = (l) => {
      if (o.signal.aborted)
        return;
      const m = dt(), k = rt(l.rootComponent);
      this._vueApp = k;
      const Z = ut();
      if (l.piniaPlugins)
        for (const ce of l.piniaPlugins)
          Z.use(ce);
      if (k.use(Z), l.plugins)
        for (const ce of l.plugins)
          k.use(ce);
      k.provide(Fe, this._propsRef), k.provide(Nt, this._errorsRef), k.provide(We, this.emitEvent.bind(this)), k.provide(It, this._contentRef), k.provide(He, this._hostVisibilityRef), k.provide(Vt, Et(this)), k.provide(Zt, Ot(this)), k.provide(jt, Be(this)), l.providers && l.providers(k, this), k.mount(e), m && ht(m);
    };
    if (a.rootComponent)
      d(a);
    else if (a.lazyConfig) {
      const l = document.createElement("wippy-loading");
      l.setAttribute("no-bg", ""), e.appendChild(l), a.lazyConfig().then((m) => {
        o.signal.aborted || (l.remove(), d(m));
      }).catch((m) => {
        if (o.signal.aborted)
          return;
        const k = m instanceof Error ? m.message : String(m), Z = document.createElement("wippy-error");
        Z.setAttribute("title", "Failed to load"), Z.setAttribute("message", k), l.replaceWith(Z), this.emitEvent("error", { message: k });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, b;
(function(s) {
  s.assertEqual = (n) => {
  };
  function e(n) {
  }
  s.assertIs = e;
  function t(n) {
    throw new Error();
  }
  s.assertNever = t, s.arrayToEnum = (n) => {
    const i = {};
    for (const a of n)
      i[a] = a;
    return i;
  }, s.getValidEnumValues = (n) => {
    const i = s.objectKeys(n).filter((o) => typeof n[n[o]] != "number"), a = {};
    for (const o of i)
      a[o] = n[o];
    return s.objectValues(a);
  }, s.objectValues = (n) => s.objectKeys(n).map(function(i) {
    return n[i];
  }), s.objectKeys = typeof Object.keys == "function" ? (n) => Object.keys(n) : (n) => {
    const i = [];
    for (const a in n)
      Object.prototype.hasOwnProperty.call(n, a) && i.push(a);
    return i;
  }, s.find = (n, i) => {
    for (const a of n)
      if (i(a))
        return a;
  }, s.isInteger = typeof Number.isInteger == "function" ? (n) => Number.isInteger(n) : (n) => typeof n == "number" && Number.isFinite(n) && Math.floor(n) === n;
  function r(n, i = " | ") {
    return n.map((a) => typeof a == "string" ? `'${a}'` : a).join(i);
  }
  s.joinValues = r, s.jsonStringifyReplacer = (n, i) => typeof i == "bigint" ? i.toString() : i;
})(b || (b = {}));
var Ee;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Ee || (Ee = {}));
const f = b.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]), j = (s) => {
  switch (typeof s) {
    case "undefined":
      return f.undefined;
    case "string":
      return f.string;
    case "number":
      return Number.isNaN(s) ? f.nan : f.number;
    case "boolean":
      return f.boolean;
    case "function":
      return f.function;
    case "bigint":
      return f.bigint;
    case "symbol":
      return f.symbol;
    case "object":
      return Array.isArray(s) ? f.array : s === null ? f.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? f.promise : typeof Map < "u" && s instanceof Map ? f.map : typeof Set < "u" && s instanceof Set ? f.set : typeof Date < "u" && s instanceof Date ? f.date : f.object;
    default:
      return f.unknown;
  }
}, c = b.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
class V extends Error {
  get errors() {
    return this.issues;
  }
  constructor(e) {
    super(), this.issues = [], this.addIssue = (r) => {
      this.issues = [...this.issues, r];
    }, this.addIssues = (r = []) => {
      this.issues = [...this.issues, ...r];
    };
    const t = new.target.prototype;
    Object.setPrototypeOf ? Object.setPrototypeOf(this, t) : this.__proto__ = t, this.name = "ZodError", this.issues = e;
  }
  format(e) {
    const t = e || function(i) {
      return i.message;
    }, r = { _errors: [] }, n = (i) => {
      for (const a of i.issues)
        if (a.code === "invalid_union")
          a.unionErrors.map(n);
        else if (a.code === "invalid_return_type")
          n(a.returnTypeError);
        else if (a.code === "invalid_arguments")
          n(a.argumentsError);
        else if (a.path.length === 0)
          r._errors.push(t(a));
        else {
          let o = r, d = 0;
          for (; d < a.path.length; ) {
            const l = a.path[d];
            d === a.path.length - 1 ? (o[l] = o[l] || { _errors: [] }, o[l]._errors.push(t(a))) : o[l] = o[l] || { _errors: [] }, o = o[l], d++;
          }
        }
    };
    return n(this), r;
  }
  static assert(e) {
    if (!(e instanceof V))
      throw new Error(`Not a ZodError: ${e}`);
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, b.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(e = (t) => t.message) {
    const t = {}, r = [];
    for (const n of this.issues)
      if (n.path.length > 0) {
        const i = n.path[0];
        t[i] = t[i] || [], t[i].push(e(n));
      } else
        r.push(e(n));
    return { formErrors: r, fieldErrors: t };
  }
  get formErrors() {
    return this.flatten();
  }
}
V.create = (s) => new V(s);
const he = (s, e) => {
  let t;
  switch (s.code) {
    case c.invalid_type:
      s.received === f.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
      break;
    case c.invalid_literal:
      t = `Invalid literal value, expected ${JSON.stringify(s.expected, b.jsonStringifyReplacer)}`;
      break;
    case c.unrecognized_keys:
      t = `Unrecognized key(s) in object: ${b.joinValues(s.keys, ", ")}`;
      break;
    case c.invalid_union:
      t = "Invalid input";
      break;
    case c.invalid_union_discriminator:
      t = `Invalid discriminator value. Expected ${b.joinValues(s.options)}`;
      break;
    case c.invalid_enum_value:
      t = `Invalid enum value. Expected ${b.joinValues(s.options)}, received '${s.received}'`;
      break;
    case c.invalid_arguments:
      t = "Invalid function arguments";
      break;
    case c.invalid_return_type:
      t = "Invalid function return type";
      break;
    case c.invalid_date:
      t = "Invalid date";
      break;
    case c.invalid_string:
      typeof s.validation == "object" ? "includes" in s.validation ? (t = `Invalid input: must include "${s.validation.includes}"`, typeof s.validation.position == "number" && (t = `${t} at one or more positions greater than or equal to ${s.validation.position}`)) : "startsWith" in s.validation ? t = `Invalid input: must start with "${s.validation.startsWith}"` : "endsWith" in s.validation ? t = `Invalid input: must end with "${s.validation.endsWith}"` : b.assertNever(s.validation) : s.validation !== "regex" ? t = `Invalid ${s.validation}` : t = "Invalid";
      break;
    case c.too_small:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "more than"} ${s.minimum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at least" : "over"} ${s.minimum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "bigint" ? t = `Number must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${s.minimum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly equal to " : s.inclusive ? "greater than or equal to " : "greater than "}${new Date(Number(s.minimum))}` : t = "Invalid input";
      break;
    case c.too_big:
      s.type === "array" ? t = `Array must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "less than"} ${s.maximum} element(s)` : s.type === "string" ? t = `String must contain ${s.exact ? "exactly" : s.inclusive ? "at most" : "under"} ${s.maximum} character(s)` : s.type === "number" ? t = `Number must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "bigint" ? t = `BigInt must be ${s.exact ? "exactly" : s.inclusive ? "less than or equal to" : "less than"} ${s.maximum}` : s.type === "date" ? t = `Date must be ${s.exact ? "exactly" : s.inclusive ? "smaller than or equal to" : "smaller than"} ${new Date(Number(s.maximum))}` : t = "Invalid input";
      break;
    case c.custom:
      t = "Invalid input";
      break;
    case c.invalid_intersection_types:
      t = "Intersection results could not be merged";
      break;
    case c.not_multiple_of:
      t = `Number must be a multiple of ${s.multipleOf}`;
      break;
    case c.not_finite:
      t = "Number must be finite";
      break;
    default:
      t = e.defaultError, b.assertNever(s);
  }
  return { message: t };
};
let $t = he;
function Lt() {
  return $t;
}
const zt = (s) => {
  const { data: e, path: t, errorMaps: r, issueData: n } = s, i = [...t, ...n.path || []], a = {
    ...n,
    path: i
  };
  if (n.message !== void 0)
    return {
      ...n,
      path: i,
      message: n.message
    };
  let o = "";
  const d = r.filter((l) => !!l).slice().reverse();
  for (const l of d)
    o = l(a, { data: e, defaultError: o }).message;
  return {
    ...n,
    path: i,
    message: o
  };
};
function h(s, e) {
  const t = Lt(), r = zt({
    issueData: e,
    data: s.data,
    path: s.path,
    errorMaps: [
      s.common.contextualErrorMap,
      // contextual error map is first priority
      s.schemaErrorMap,
      // then schema-bound map if available
      t,
      // then global override map
      t === he ? void 0 : he
      // then global default map
    ].filter((n) => !!n)
  });
  s.common.issues.push(r);
}
class O {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    this.value === "valid" && (this.value = "dirty");
  }
  abort() {
    this.value !== "aborted" && (this.value = "aborted");
  }
  static mergeArray(e, t) {
    const r = [];
    for (const n of t) {
      if (n.status === "aborted")
        return y;
      n.status === "dirty" && e.dirty(), r.push(n.value);
    }
    return { status: e.value, value: r };
  }
  static async mergeObjectAsync(e, t) {
    const r = [];
    for (const n of t) {
      const i = await n.key, a = await n.value;
      r.push({
        key: i,
        value: a
      });
    }
    return O.mergeObjectSync(e, r);
  }
  static mergeObjectSync(e, t) {
    const r = {};
    for (const n of t) {
      const { key: i, value: a } = n;
      if (i.status === "aborted" || a.status === "aborted")
        return y;
      i.status === "dirty" && e.dirty(), a.status === "dirty" && e.dirty(), i.value !== "__proto__" && (typeof a.value < "u" || n.alwaysSet) && (r[i.value] = a.value);
    }
    return { status: e.value, value: r };
  }
}
const y = Object.freeze({
  status: "aborted"
}), Y = (s) => ({ status: "dirty", value: s }), E = (s) => ({ status: "valid", value: s }), Re = (s) => s.status === "aborted", Ae = (s) => s.status === "dirty", B = (s) => s.status === "valid", ee = (s) => typeof Promise < "u" && s instanceof Promise;
var p;
(function(s) {
  s.errToObj = (e) => typeof e == "string" ? { message: e } : e || {}, s.toString = (e) => typeof e == "string" ? e : e?.message;
})(p || (p = {}));
class A {
  constructor(e, t, r, n) {
    this._cachedPath = [], this.parent = e, this.data = t, this._path = r, this._key = n;
  }
  get path() {
    return this._cachedPath.length || (Array.isArray(this._key) ? this._cachedPath.push(...this._path, ...this._key) : this._cachedPath.push(...this._path, this._key)), this._cachedPath;
  }
}
const Ne = (s, e) => {
  if (B(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new V(s.common.issues);
      return this._error = t, this._error;
    }
  };
};
function g(s) {
  if (!s)
    return {};
  const { errorMap: e, invalid_type_error: t, required_error: r, description: n } = s;
  if (e && (t || r))
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  return e ? { errorMap: e, description: n } : { errorMap: (a, o) => {
    const { message: d } = s;
    return a.code === "invalid_enum_value" ? { message: d ?? o.defaultError } : typeof o.data > "u" ? { message: d ?? r ?? o.defaultError } : a.code !== "invalid_type" ? { message: o.defaultError } : { message: d ?? t ?? o.defaultError };
  }, description: n };
}
class v {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return j(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: j(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new O(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: j(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (ee(t))
      throw new Error("Synchronous parse encountered promise.");
    return t;
  }
  _parseAsync(e) {
    const t = this._parse(e);
    return Promise.resolve(t);
  }
  parse(e, t) {
    const r = this.safeParse(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  safeParse(e, t) {
    const r = {
      common: {
        issues: [],
        async: t?.async ?? !1,
        contextualErrorMap: t?.errorMap
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: j(e)
    }, n = this._parseSync({ data: e, path: r.path, parent: r });
    return Ne(r, n);
  }
  "~validate"(e) {
    const t = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: j(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return B(r) ? {
          value: r.value
        } : {
          issues: t.common.issues
        };
      } catch (r) {
        r?.message?.toLowerCase()?.includes("encountered") && (this["~standard"].async = !0), t.common = {
          issues: [],
          async: !0
        };
      }
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => B(r) ? {
      value: r.value
    } : {
      issues: t.common.issues
    });
  }
  async parseAsync(e, t) {
    const r = await this.safeParseAsync(e, t);
    if (r.success)
      return r.data;
    throw r.error;
  }
  async safeParseAsync(e, t) {
    const r = {
      common: {
        issues: [],
        contextualErrorMap: t?.errorMap,
        async: !0
      },
      path: t?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data: e,
      parsedType: j(e)
    }, n = this._parse({ data: e, path: r.path, parent: r }), i = await (ee(n) ? n : Promise.resolve(n));
    return Ne(r, i);
  }
  refine(e, t) {
    const r = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, i) => {
      const a = e(n), o = () => i.addIssue({
        code: c.custom,
        ...r(n)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((d) => d ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((r, n) => e(r) ? !0 : (n.addIssue(typeof t == "function" ? t(r, n) : t), !1));
  }
  _refinement(e) {
    return new H({
      schema: this,
      typeName: _.ZodEffects,
      effect: { type: "refinement", refinement: e }
    });
  }
  superRefine(e) {
    return this._refinement(e);
  }
  constructor(e) {
    this.spa = this.safeParseAsync, this._def = e, this.parse = this.parse.bind(this), this.safeParse = this.safeParse.bind(this), this.parseAsync = this.parseAsync.bind(this), this.safeParseAsync = this.safeParseAsync.bind(this), this.spa = this.spa.bind(this), this.refine = this.refine.bind(this), this.refinement = this.refinement.bind(this), this.superRefine = this.superRefine.bind(this), this.optional = this.optional.bind(this), this.nullable = this.nullable.bind(this), this.nullish = this.nullish.bind(this), this.array = this.array.bind(this), this.promise = this.promise.bind(this), this.or = this.or.bind(this), this.and = this.and.bind(this), this.transform = this.transform.bind(this), this.brand = this.brand.bind(this), this.default = this.default.bind(this), this.catch = this.catch.bind(this), this.describe = this.describe.bind(this), this.pipe = this.pipe.bind(this), this.readonly = this.readonly.bind(this), this.isNullable = this.isNullable.bind(this), this.isOptional = this.isOptional.bind(this), this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (t) => this["~validate"](t)
    };
  }
  optional() {
    return P.create(this, this._def);
  }
  nullable() {
    return q.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return R.create(this);
  }
  promise() {
    return ie.create(this, this._def);
  }
  or(e) {
    return se.create([this, e], this._def);
  }
  and(e) {
    return re.create(this, e, this._def);
  }
  transform(e) {
    return new H({
      ...g(this._def),
      schema: this,
      typeName: _.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ye({
      ...g(this._def),
      innerType: this,
      defaultValue: t,
      typeName: _.ZodDefault
    });
  }
  brand() {
    return new cs({
      typeName: _.ZodBranded,
      type: this,
      ...g(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new ge({
      ...g(this._def),
      innerType: this,
      catchValue: t,
      typeName: _.ZodCatch
    });
  }
  describe(e) {
    const t = this.constructor;
    return new t({
      ...this._def,
      description: e
    });
  }
  pipe(e) {
    return xe.create(this, e);
  }
  readonly() {
    return ve.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const Mt = /^c[^\s-]{8,}$/i, Dt = /^[0-9a-z]+$/, Ut = /^[0-9A-HJKMNP-TV-Z]{26}$/i, Bt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Wt = /^[a-z0-9_-]{21}$/i, Ft = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Ht = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, qt = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, Jt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let de;
const Yt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Kt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Gt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Qt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Xt = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, es = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, qe = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", ts = new RegExp(`^${qe}$`);
function Je(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function ss(s) {
  return new RegExp(`^${Je(s)}$`);
}
function rs(s) {
  let e = `${qe}T${Je(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function ns(s, e) {
  return !!((e === "v4" || !e) && Yt.test(s) || (e === "v6" || !e) && Gt.test(s));
}
function is(s, e) {
  if (!Ft.test(s))
    return !1;
  try {
    const [t] = s.split(".");
    if (!t)
      return !1;
    const r = t.replace(/-/g, "+").replace(/_/g, "/").padEnd(t.length + (4 - t.length % 4) % 4, "="), n = JSON.parse(atob(r));
    return !(typeof n != "object" || n === null || "typ" in n && n?.typ !== "JWT" || !n.alg || e && n.alg !== e);
  } catch {
    return !1;
  }
}
function as(s, e) {
  return !!((e === "v4" || !e) && Kt.test(s) || (e === "v6" || !e) && Qt.test(s));
}
class I extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== f.string) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: c.invalid_type,
        expected: f.string,
        received: i.parsedType
      }), y;
    }
    const r = new O();
    let n;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (n = this._getOrReturnCtx(e, n), h(n, {
          code: c.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (n = this._getOrReturnCtx(e, n), h(n, {
          code: c.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "length") {
        const a = e.data.length > i.value, o = e.data.length < i.value;
        (a || o) && (n = this._getOrReturnCtx(e, n), a ? h(n, {
          code: c.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : o && h(n, {
          code: c.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), r.dirty());
      } else if (i.kind === "email")
        qt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "email",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "emoji")
        de || (de = new RegExp(Jt, "u")), de.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "emoji",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "uuid")
        Bt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "uuid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "nanoid")
        Wt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "nanoid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid")
        Mt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid2")
        Dt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "cuid2",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "ulid")
        Ut.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
          validation: "ulid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), h(n, {
            validation: "url",
            code: c.invalid_string,
            message: i.message
          }), r.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "regex",
        code: c.invalid_string,
        message: i.message
      }), r.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), r.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "datetime" ? rs(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: "datetime",
        message: i.message
      }), r.dirty()) : i.kind === "date" ? ts.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: "date",
        message: i.message
      }), r.dirty()) : i.kind === "time" ? ss(i).test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.invalid_string,
        validation: "time",
        message: i.message
      }), r.dirty()) : i.kind === "duration" ? Ht.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "duration",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "ip" ? ns(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "ip",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "jwt" ? is(e.data, i.alg) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "jwt",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "cidr" ? as(e.data, i.version) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "cidr",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64" ? Xt.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "base64",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64url" ? es.test(e.data) || (n = this._getOrReturnCtx(e, n), h(n, {
        validation: "base64url",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : b.assertNever(i);
    return { status: r.value, value: e.data };
  }
  _regex(e, t, r) {
    return this.refinement((n) => e.test(n), {
      validation: t,
      code: c.invalid_string,
      ...p.errToObj(r)
    });
  }
  _addCheck(e) {
    return new I({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  email(e) {
    return this._addCheck({ kind: "email", ...p.errToObj(e) });
  }
  url(e) {
    return this._addCheck({ kind: "url", ...p.errToObj(e) });
  }
  emoji(e) {
    return this._addCheck({ kind: "emoji", ...p.errToObj(e) });
  }
  uuid(e) {
    return this._addCheck({ kind: "uuid", ...p.errToObj(e) });
  }
  nanoid(e) {
    return this._addCheck({ kind: "nanoid", ...p.errToObj(e) });
  }
  cuid(e) {
    return this._addCheck({ kind: "cuid", ...p.errToObj(e) });
  }
  cuid2(e) {
    return this._addCheck({ kind: "cuid2", ...p.errToObj(e) });
  }
  ulid(e) {
    return this._addCheck({ kind: "ulid", ...p.errToObj(e) });
  }
  base64(e) {
    return this._addCheck({ kind: "base64", ...p.errToObj(e) });
  }
  base64url(e) {
    return this._addCheck({
      kind: "base64url",
      ...p.errToObj(e)
    });
  }
  jwt(e) {
    return this._addCheck({ kind: "jwt", ...p.errToObj(e) });
  }
  ip(e) {
    return this._addCheck({ kind: "ip", ...p.errToObj(e) });
  }
  cidr(e) {
    return this._addCheck({ kind: "cidr", ...p.errToObj(e) });
  }
  datetime(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "datetime",
      precision: null,
      offset: !1,
      local: !1,
      message: e
    }) : this._addCheck({
      kind: "datetime",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      offset: e?.offset ?? !1,
      local: e?.local ?? !1,
      ...p.errToObj(e?.message)
    });
  }
  date(e) {
    return this._addCheck({ kind: "date", message: e });
  }
  time(e) {
    return typeof e == "string" ? this._addCheck({
      kind: "time",
      precision: null,
      message: e
    }) : this._addCheck({
      kind: "time",
      precision: typeof e?.precision > "u" ? null : e?.precision,
      ...p.errToObj(e?.message)
    });
  }
  duration(e) {
    return this._addCheck({ kind: "duration", ...p.errToObj(e) });
  }
  regex(e, t) {
    return this._addCheck({
      kind: "regex",
      regex: e,
      ...p.errToObj(t)
    });
  }
  includes(e, t) {
    return this._addCheck({
      kind: "includes",
      value: e,
      position: t?.position,
      ...p.errToObj(t?.message)
    });
  }
  startsWith(e, t) {
    return this._addCheck({
      kind: "startsWith",
      value: e,
      ...p.errToObj(t)
    });
  }
  endsWith(e, t) {
    return this._addCheck({
      kind: "endsWith",
      value: e,
      ...p.errToObj(t)
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e,
      ...p.errToObj(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e,
      ...p.errToObj(t)
    });
  }
  length(e, t) {
    return this._addCheck({
      kind: "length",
      value: e,
      ...p.errToObj(t)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(e) {
    return this.min(1, p.errToObj(e));
  }
  trim() {
    return new I({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new I({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new I({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((e) => e.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((e) => e.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((e) => e.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((e) => e.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((e) => e.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((e) => e.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((e) => e.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((e) => e.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((e) => e.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((e) => e.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((e) => e.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((e) => e.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((e) => e.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((e) => e.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((e) => e.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((e) => e.kind === "base64url");
  }
  get minLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxLength() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
I.create = (s) => new I({
  checks: [],
  typeName: _.ZodString,
  coerce: s?.coerce ?? !1,
  ...g(s)
});
function os(s, e) {
  const t = (s.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, n = t > r ? t : r, i = Number.parseInt(s.toFixed(n).replace(".", "")), a = Number.parseInt(e.toFixed(n).replace(".", ""));
  return i % a / 10 ** n;
}
class W extends v {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== f.number) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: c.invalid_type,
        expected: f.number,
        received: i.parsedType
      }), y;
    }
    let r;
    const n = new O();
    for (const i of this._def.checks)
      i.kind === "int" ? b.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), n.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? os(e.data, i.value) !== 0 && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.not_finite,
        message: i.message
      }), n.dirty()) : b.assertNever(i);
    return { status: n.value, value: e.data };
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, r, n) {
    return new W({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: p.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new W({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  int(e) {
    return this._addCheck({
      kind: "int",
      message: p.toString(e)
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
    });
  }
  finite(e) {
    return this._addCheck({
      kind: "finite",
      message: p.toString(e)
    });
  }
  safe(e) {
    return this._addCheck({
      kind: "min",
      inclusive: !0,
      value: Number.MIN_SAFE_INTEGER,
      message: p.toString(e)
    })._addCheck({
      kind: "max",
      inclusive: !0,
      value: Number.MAX_SAFE_INTEGER,
      message: p.toString(e)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
  get isInt() {
    return !!this._def.checks.find((e) => e.kind === "int" || e.kind === "multipleOf" && b.isInteger(e.value));
  }
  get isFinite() {
    let e = null, t = null;
    for (const r of this._def.checks) {
      if (r.kind === "finite" || r.kind === "int" || r.kind === "multipleOf")
        return !0;
      r.kind === "min" ? (t === null || r.value > t) && (t = r.value) : r.kind === "max" && (e === null || r.value < e) && (e = r.value);
    }
    return Number.isFinite(t) && Number.isFinite(e);
  }
}
W.create = (s) => new W({
  checks: [],
  typeName: _.ZodNumber,
  coerce: s?.coerce || !1,
  ...g(s)
});
class K extends v {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte;
  }
  _parse(e) {
    if (this._def.coerce)
      try {
        e.data = BigInt(e.data);
      } catch {
        return this._getInvalidInput(e);
      }
    if (this._getType(e) !== f.bigint)
      return this._getInvalidInput(e);
    let r;
    const n = new O();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), h(r, {
        code: c.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : b.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: c.invalid_type,
      expected: f.bigint,
      received: t.parsedType
    }), y;
  }
  gte(e, t) {
    return this.setLimit("min", e, !0, p.toString(t));
  }
  gt(e, t) {
    return this.setLimit("min", e, !1, p.toString(t));
  }
  lte(e, t) {
    return this.setLimit("max", e, !0, p.toString(t));
  }
  lt(e, t) {
    return this.setLimit("max", e, !1, p.toString(t));
  }
  setLimit(e, t, r, n) {
    return new K({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind: e,
          value: t,
          inclusive: r,
          message: p.toString(n)
        }
      ]
    });
  }
  _addCheck(e) {
    return new K({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  positive(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  negative(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !1,
      message: p.toString(e)
    });
  }
  nonpositive(e) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  nonnegative(e) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: !0,
      message: p.toString(e)
    });
  }
  multipleOf(e, t) {
    return this._addCheck({
      kind: "multipleOf",
      value: e,
      message: p.toString(t)
    });
  }
  get minValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e;
  }
  get maxValue() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e;
  }
}
K.create = (s) => new K({
  checks: [],
  typeName: _.ZodBigInt,
  coerce: s?.coerce ?? !1,
  ...g(s)
});
class fe extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== f.boolean) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.boolean,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
fe.create = (s) => new fe({
  typeName: _.ZodBoolean,
  coerce: s?.coerce || !1,
  ...g(s)
});
class te extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== f.date) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: c.invalid_type,
        expected: f.date,
        received: i.parsedType
      }), y;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return h(i, {
        code: c.invalid_date
      }), y;
    }
    const r = new O();
    let n;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), r.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (n = this._getOrReturnCtx(e, n), h(n, {
        code: c.too_big,
        message: i.message,
        inclusive: !0,
        exact: !1,
        maximum: i.value,
        type: "date"
      }), r.dirty()) : b.assertNever(i);
    return {
      status: r.value,
      value: new Date(e.data.getTime())
    };
  }
  _addCheck(e) {
    return new te({
      ...this._def,
      checks: [...this._def.checks, e]
    });
  }
  min(e, t) {
    return this._addCheck({
      kind: "min",
      value: e.getTime(),
      message: p.toString(t)
    });
  }
  max(e, t) {
    return this._addCheck({
      kind: "max",
      value: e.getTime(),
      message: p.toString(t)
    });
  }
  get minDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "min" && (e === null || t.value > e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
  get maxDate() {
    let e = null;
    for (const t of this._def.checks)
      t.kind === "max" && (e === null || t.value < e) && (e = t.value);
    return e != null ? new Date(e) : null;
  }
}
te.create = (s) => new te({
  checks: [],
  coerce: s?.coerce || !1,
  typeName: _.ZodDate,
  ...g(s)
});
class Ie extends v {
  _parse(e) {
    if (this._getType(e) !== f.symbol) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.symbol,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ie.create = (s) => new Ie({
  typeName: _.ZodSymbol,
  ...g(s)
});
class Ve extends v {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.undefined,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ve.create = (s) => new Ve({
  typeName: _.ZodUndefined,
  ...g(s)
});
class Ze extends v {
  _parse(e) {
    if (this._getType(e) !== f.null) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.null,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ze.create = (s) => new Ze({
  typeName: _.ZodNull,
  ...g(s)
});
class je extends v {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return E(e.data);
  }
}
je.create = (s) => new je({
  typeName: _.ZodAny,
  ...g(s)
});
class pe extends v {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return E(e.data);
  }
}
pe.create = (s) => new pe({
  typeName: _.ZodUnknown,
  ...g(s)
});
class $ extends v {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return h(t, {
      code: c.invalid_type,
      expected: f.never,
      received: t.parsedType
    }), y;
  }
}
$.create = (s) => new $({
  typeName: _.ZodNever,
  ...g(s)
});
class Pe extends v {
  _parse(e) {
    if (this._getType(e) !== f.undefined) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.void,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Pe.create = (s) => new Pe({
  typeName: _.ZodVoid,
  ...g(s)
});
class R extends v {
  _parse(e) {
    const { ctx: t, status: r } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== f.array)
      return h(t, {
        code: c.invalid_type,
        expected: f.array,
        received: t.parsedType
      }), y;
    if (n.exactLength !== null) {
      const a = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (a || o) && (h(t, {
        code: a ? c.too_big : c.too_small,
        minimum: o ? n.exactLength.value : void 0,
        maximum: a ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), r.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (h(t, {
      code: c.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), r.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (h(t, {
      code: c.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), r.dirty()), t.common.async)
      return Promise.all([...t.data].map((a, o) => n.type._parseAsync(new A(t, a, t.path, o)))).then((a) => O.mergeArray(r, a));
    const i = [...t.data].map((a, o) => n.type._parseSync(new A(t, a, t.path, o)));
    return O.mergeArray(r, i);
  }
  get element() {
    return this._def.type;
  }
  min(e, t) {
    return new R({
      ...this._def,
      minLength: { value: e, message: p.toString(t) }
    });
  }
  max(e, t) {
    return new R({
      ...this._def,
      maxLength: { value: e, message: p.toString(t) }
    });
  }
  length(e, t) {
    return new R({
      ...this._def,
      exactLength: { value: e, message: p.toString(t) }
    });
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
R.create = (s, e) => new R({
  type: s,
  minLength: null,
  maxLength: null,
  exactLength: null,
  typeName: _.ZodArray,
  ...g(e)
});
function D(s) {
  if (s instanceof C) {
    const e = {};
    for (const t in s.shape) {
      const r = s.shape[t];
      e[t] = P.create(D(r));
    }
    return new C({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof R ? new R({
    ...s._def,
    type: D(s.element)
  }) : s instanceof P ? P.create(D(s.unwrap())) : s instanceof q ? q.create(D(s.unwrap())) : s instanceof L ? L.create(s.items.map((e) => D(e))) : s;
}
class C extends v {
  constructor() {
    super(...arguments), this._cached = null, this.nonstrict = this.passthrough, this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const e = this._def.shape(), t = b.objectKeys(e);
    return this._cached = { shape: e, keys: t }, this._cached;
  }
  _parse(e) {
    if (this._getType(e) !== f.object) {
      const l = this._getOrReturnCtx(e);
      return h(l, {
        code: c.invalid_type,
        expected: f.object,
        received: l.parsedType
      }), y;
    }
    const { status: r, ctx: n } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof $ && this._def.unknownKeys === "strip"))
      for (const l in n.data)
        a.includes(l) || o.push(l);
    const d = [];
    for (const l of a) {
      const m = i[l], k = n.data[l];
      d.push({
        key: { status: "valid", value: l },
        value: m._parse(new A(n, k, n.path, l)),
        alwaysSet: l in n.data
      });
    }
    if (this._def.catchall instanceof $) {
      const l = this._def.unknownKeys;
      if (l === "passthrough")
        for (const m of o)
          d.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: n.data[m] }
          });
      else if (l === "strict")
        o.length > 0 && (h(n, {
          code: c.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (l !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const l = this._def.catchall;
      for (const m of o) {
        const k = n.data[m];
        d.push({
          key: { status: "valid", value: m },
          value: l._parse(
            new A(n, k, n.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const l = [];
      for (const m of d) {
        const k = await m.key, Z = await m.value;
        l.push({
          key: k,
          value: Z,
          alwaysSet: m.alwaysSet
        });
      }
      return l;
    }).then((l) => O.mergeObjectSync(r, l)) : O.mergeObjectSync(r, d);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return p.errToObj, new C({
      ...this._def,
      unknownKeys: "strict",
      ...e !== void 0 ? {
        errorMap: (t, r) => {
          const n = this._def.errorMap?.(t, r).message ?? r.defaultError;
          return t.code === "unrecognized_keys" ? {
            message: p.errToObj(e).message ?? n
          } : {
            message: n
          };
        }
      } : {}
    });
  }
  strip() {
    return new C({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new C({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(e) {
    return new C({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...e
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(e) {
    return new C({
      unknownKeys: e._def.unknownKeys,
      catchall: e._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...e._def.shape()
      }),
      typeName: _.ZodObject
    });
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(e, t) {
    return this.augment({ [e]: t });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(e) {
    return new C({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const r of b.objectKeys(e))
      e[r] && this.shape[r] && (t[r] = this.shape[r]);
    return new C({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const r of b.objectKeys(this.shape))
      e[r] || (t[r] = this.shape[r]);
    return new C({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return D(this);
  }
  partial(e) {
    const t = {};
    for (const r of b.objectKeys(this.shape)) {
      const n = this.shape[r];
      e && !e[r] ? t[r] = n : t[r] = n.optional();
    }
    return new C({
      ...this._def,
      shape: () => t
    });
  }
  required(e) {
    const t = {};
    for (const r of b.objectKeys(this.shape))
      if (e && !e[r])
        t[r] = this.shape[r];
      else {
        let i = this.shape[r];
        for (; i instanceof P; )
          i = i._def.innerType;
        t[r] = i;
      }
    return new C({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return Ye(b.objectKeys(this.shape));
  }
}
C.create = (s, e) => new C({
  shape: () => s,
  unknownKeys: "strip",
  catchall: $.create(),
  typeName: _.ZodObject,
  ...g(e)
});
C.strictCreate = (s, e) => new C({
  shape: () => s,
  unknownKeys: "strict",
  catchall: $.create(),
  typeName: _.ZodObject,
  ...g(e)
});
C.lazycreate = (s, e) => new C({
  shape: s,
  unknownKeys: "strip",
  catchall: $.create(),
  typeName: _.ZodObject,
  ...g(e)
});
class se extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = this._def.options;
    function n(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new V(o.ctx.common.issues));
      return h(t, {
        code: c.invalid_union,
        unionErrors: a
      }), y;
    }
    if (t.common.async)
      return Promise.all(r.map(async (i) => {
        const a = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await i._parseAsync({
            data: t.data,
            path: t.path,
            parent: a
          }),
          ctx: a
        };
      })).then(n);
    {
      let i;
      const a = [];
      for (const d of r) {
        const l = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, m = d._parseSync({
          data: t.data,
          path: t.path,
          parent: l
        });
        if (m.status === "valid")
          return m;
        m.status === "dirty" && !i && (i = { result: m, ctx: l }), l.common.issues.length && a.push(l.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((d) => new V(d));
      return h(t, {
        code: c.invalid_union,
        unionErrors: o
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
se.create = (s, e) => new se({
  options: s,
  typeName: _.ZodUnion,
  ...g(e)
});
function me(s, e) {
  const t = j(s), r = j(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === f.object && r === f.object) {
    const n = b.objectKeys(e), i = b.objectKeys(s).filter((o) => n.indexOf(o) !== -1), a = { ...s, ...e };
    for (const o of i) {
      const d = me(s[o], e[o]);
      if (!d.valid)
        return { valid: !1 };
      a[o] = d.data;
    }
    return { valid: !0, data: a };
  } else if (t === f.array && r === f.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let i = 0; i < s.length; i++) {
      const a = s[i], o = e[i], d = me(a, o);
      if (!d.valid)
        return { valid: !1 };
      n.push(d.data);
    }
    return { valid: !0, data: n };
  } else return t === f.date && r === f.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class re extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), n = (i, a) => {
      if (Re(i) || Re(a))
        return y;
      const o = me(i.value, a.value);
      return o.valid ? ((Ae(i) || Ae(a)) && t.dirty(), { status: t.value, value: o.data }) : (h(r, {
        code: c.invalid_intersection_types
      }), y);
    };
    return r.common.async ? Promise.all([
      this._def.left._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      }),
      this._def.right._parseAsync({
        data: r.data,
        path: r.path,
        parent: r
      })
    ]).then(([i, a]) => n(i, a)) : n(this._def.left._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }), this._def.right._parseSync({
      data: r.data,
      path: r.path,
      parent: r
    }));
  }
}
re.create = (s, e, t) => new re({
  left: s,
  right: e,
  typeName: _.ZodIntersection,
  ...g(t)
});
class L extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== f.array)
      return h(r, {
        code: c.invalid_type,
        expected: f.array,
        received: r.parsedType
      }), y;
    if (r.data.length < this._def.items.length)
      return h(r, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && r.data.length > this._def.items.length && (h(r, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...r.data].map((a, o) => {
      const d = this._def.items[o] || this._def.rest;
      return d ? d._parse(new A(r, a, r.path, o)) : null;
    }).filter((a) => !!a);
    return r.common.async ? Promise.all(i).then((a) => O.mergeArray(t, a)) : O.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new L({
      ...this._def,
      rest: e
    });
  }
}
L.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new L({
    items: s,
    typeName: _.ZodTuple,
    rest: null,
    ...g(e)
  });
};
class ne extends v {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== f.object)
      return h(r, {
        code: c.invalid_type,
        expected: f.object,
        received: r.parsedType
      }), y;
    const n = [], i = this._def.keyType, a = this._def.valueType;
    for (const o in r.data)
      n.push({
        key: i._parse(new A(r, o, r.path, o)),
        value: a._parse(new A(r, r.data[o], r.path, o)),
        alwaysSet: o in r.data
      });
    return r.common.async ? O.mergeObjectAsync(t, n) : O.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, r) {
    return t instanceof v ? new ne({
      keyType: e,
      valueType: t,
      typeName: _.ZodRecord,
      ...g(r)
    }) : new ne({
      keyType: I.create(),
      valueType: e,
      typeName: _.ZodRecord,
      ...g(t)
    });
  }
}
class $e extends v {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== f.map)
      return h(r, {
        code: c.invalid_type,
        expected: f.map,
        received: r.parsedType
      }), y;
    const n = this._def.keyType, i = this._def.valueType, a = [...r.data.entries()].map(([o, d], l) => ({
      key: n._parse(new A(r, o, r.path, [l, "key"])),
      value: i._parse(new A(r, d, r.path, [l, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const d of a) {
          const l = await d.key, m = await d.value;
          if (l.status === "aborted" || m.status === "aborted")
            return y;
          (l.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(l.value, m.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const d of a) {
        const l = d.key, m = d.value;
        if (l.status === "aborted" || m.status === "aborted")
          return y;
        (l.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(l.value, m.value);
      }
      return { status: t.value, value: o };
    }
  }
}
$e.create = (s, e, t) => new $e({
  valueType: e,
  keyType: s,
  typeName: _.ZodMap,
  ...g(t)
});
class G extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== f.set)
      return h(r, {
        code: c.invalid_type,
        expected: f.set,
        received: r.parsedType
      }), y;
    const n = this._def;
    n.minSize !== null && r.data.size < n.minSize.value && (h(r, {
      code: c.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && r.data.size > n.maxSize.value && (h(r, {
      code: c.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const i = this._def.valueType;
    function a(d) {
      const l = /* @__PURE__ */ new Set();
      for (const m of d) {
        if (m.status === "aborted")
          return y;
        m.status === "dirty" && t.dirty(), l.add(m.value);
      }
      return { status: t.value, value: l };
    }
    const o = [...r.data.values()].map((d, l) => i._parse(new A(r, d, r.path, l)));
    return r.common.async ? Promise.all(o).then((d) => a(d)) : a(o);
  }
  min(e, t) {
    return new G({
      ...this._def,
      minSize: { value: e, message: p.toString(t) }
    });
  }
  max(e, t) {
    return new G({
      ...this._def,
      maxSize: { value: e, message: p.toString(t) }
    });
  }
  size(e, t) {
    return this.min(e, t).max(e, t);
  }
  nonempty(e) {
    return this.min(1, e);
  }
}
G.create = (s, e) => new G({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: _.ZodSet,
  ...g(e)
});
class Le extends v {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Le.create = (s, e) => new Le({
  getter: s,
  typeName: _.ZodLazy,
  ...g(e)
});
class _e extends v {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return h(t, {
        received: t.data,
        code: c.invalid_literal,
        expected: this._def.value
      }), y;
    }
    return { status: "valid", value: e.data };
  }
  get value() {
    return this._def.value;
  }
}
_e.create = (s, e) => new _e({
  value: s,
  typeName: _.ZodLiteral,
  ...g(e)
});
function Ye(s, e) {
  return new F({
    values: s,
    typeName: _.ZodEnum,
    ...g(e)
  });
}
class F extends v {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return h(t, {
        expected: b.joinValues(r),
        received: t.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return h(t, {
        received: t.data,
        code: c.invalid_enum_value,
        options: r
      }), y;
    }
    return E(e.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Values() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  get Enum() {
    const e = {};
    for (const t of this._def.values)
      e[t] = t;
    return e;
  }
  extract(e, t = this._def) {
    return F.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return F.create(this.options.filter((r) => !e.includes(r)), {
      ...this._def,
      ...t
    });
  }
}
F.create = Ye;
class ze extends v {
  _parse(e) {
    const t = b.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== f.string && r.parsedType !== f.number) {
      const n = b.objectValues(t);
      return h(r, {
        expected: b.joinValues(n),
        received: r.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._cache || (this._cache = new Set(b.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const n = b.objectValues(t);
      return h(r, {
        received: r.data,
        code: c.invalid_enum_value,
        options: n
      }), y;
    }
    return E(e.data);
  }
  get enum() {
    return this._def.values;
  }
}
ze.create = (s, e) => new ze({
  values: s,
  typeName: _.ZodNativeEnum,
  ...g(e)
});
class ie extends v {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== f.promise && t.common.async === !1)
      return h(t, {
        code: c.invalid_type,
        expected: f.promise,
        received: t.parsedType
      }), y;
    const r = t.parsedType === f.promise ? t.data : Promise.resolve(t.data);
    return E(r.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
ie.create = (s, e) => new ie({
  type: s,
  typeName: _.ZodPromise,
  ...g(e)
});
class H extends v {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === _.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), n = this._def.effect || null, i = {
      addIssue: (a) => {
        h(r, a), a.fatal ? t.abort() : t.dirty();
      },
      get path() {
        return r.path;
      }
    };
    if (i.addIssue = i.addIssue.bind(i), n.type === "preprocess") {
      const a = n.transform(r.data, i);
      if (r.common.async)
        return Promise.resolve(a).then(async (o) => {
          if (t.value === "aborted")
            return y;
          const d = await this._def.schema._parseAsync({
            data: o,
            path: r.path,
            parent: r
          });
          return d.status === "aborted" ? y : d.status === "dirty" || t.value === "dirty" ? Y(d.value) : d;
        });
      {
        if (t.value === "aborted")
          return y;
        const o = this._def.schema._parseSync({
          data: a,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? y : o.status === "dirty" || t.value === "dirty" ? Y(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const a = (o) => {
        const d = n.refinement(o, i);
        if (r.common.async)
          return Promise.resolve(d);
        if (d instanceof Promise)
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        return o;
      };
      if (r.common.async === !1) {
        const o = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), a(o.value), { status: t.value, value: o.value });
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((o) => o.status === "aborted" ? y : (o.status === "dirty" && t.dirty(), a(o.value).then(() => ({ status: t.value, value: o.value }))));
    }
    if (n.type === "transform")
      if (r.common.async === !1) {
        const a = this._def.schema._parseSync({
          data: r.data,
          path: r.path,
          parent: r
        });
        if (!B(a))
          return y;
        const o = n.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((a) => B(a) ? Promise.resolve(n.transform(a.value, i)).then((o) => ({
          status: t.value,
          value: o
        })) : y);
    b.assertNever(n);
  }
}
H.create = (s, e, t) => new H({
  schema: s,
  typeName: _.ZodEffects,
  effect: e,
  ...g(t)
});
H.createWithPreprocess = (s, e, t) => new H({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: _.ZodEffects,
  ...g(t)
});
class P extends v {
  _parse(e) {
    return this._getType(e) === f.undefined ? E(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
P.create = (s, e) => new P({
  innerType: s,
  typeName: _.ZodOptional,
  ...g(e)
});
class q extends v {
  _parse(e) {
    return this._getType(e) === f.null ? E(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
q.create = (s, e) => new q({
  innerType: s,
  typeName: _.ZodNullable,
  ...g(e)
});
class ye extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let r = t.data;
    return t.parsedType === f.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ye.create = (s, e) => new ye({
  innerType: s,
  typeName: _.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...g(e)
});
class ge extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = {
      ...t,
      common: {
        ...t.common,
        issues: []
      }
    }, n = this._def.innerType._parse({
      data: r.data,
      path: r.path,
      parent: {
        ...r
      }
    });
    return ee(n) ? n.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new V(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new V(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ge.create = (s, e) => new ge({
  innerType: s,
  typeName: _.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...g(e)
});
class Me extends v {
  _parse(e) {
    if (this._getType(e) !== f.nan) {
      const r = this._getOrReturnCtx(e);
      return h(r, {
        code: c.invalid_type,
        expected: f.nan,
        received: r.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
Me.create = (s) => new Me({
  typeName: _.ZodNaN,
  ...g(s)
});
class cs extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = t.data;
    return this._def.type._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  unwrap() {
    return this._def.type;
  }
}
class xe extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return i.status === "aborted" ? y : i.status === "dirty" ? (t.dirty(), Y(i.value)) : this._def.out._parseAsync({
          data: i.value,
          path: r.path,
          parent: r
        });
      })();
    {
      const n = this._def.in._parseSync({
        data: r.data,
        path: r.path,
        parent: r
      });
      return n.status === "aborted" ? y : n.status === "dirty" ? (t.dirty(), {
        status: "dirty",
        value: n.value
      }) : this._def.out._parseSync({
        data: n.value,
        path: r.path,
        parent: r
      });
    }
  }
  static create(e, t) {
    return new xe({
      in: e,
      out: t,
      typeName: _.ZodPipeline
    });
  }
}
class ve extends v {
  _parse(e) {
    const t = this._def.innerType._parse(e), r = (n) => (B(n) && (n.value = Object.freeze(n.value)), n);
    return ee(t) ? t.then((n) => r(n)) : r(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ve.create = (s, e) => new ve({
  innerType: s,
  typeName: _.ZodReadonly,
  ...g(e)
});
var _;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(_ || (_ = {}));
const u = I.create, T = W.create, x = fe.create, ae = pe.create;
$.create;
const N = R.create, S = C.create, Os = se.create;
re.create;
L.create;
const ke = ne.create, Es = _e.create, z = F.create;
ie.create;
P.create;
q.create;
const U = u().max(64), we = ke(ae()), oe = S({ protocol: u().max(64), base_url: u().max(512), model: u().max(200).optional() }).strict();
oe.partial({ protocol: !0 });
const ls = S({
  traits: N(u().min(1).max(200)).max(32).optional(),
  tools: N(u().min(1).max(200)).max(128).optional(),
  context: we.optional()
}).strict(), ds = S({ id: u(), label: u(), hint: u(), file: u().optional(), subscription: x(), format: z(["json_object", "single_line", "text"]) }).strict(), De = S({
  input_tokens: T().nonnegative().optional(),
  output_tokens: T().nonnegative().optional(),
  cached_tokens: T().nonnegative().optional(),
  cache_write_tokens: T().nonnegative().optional(),
  reasoning_tokens: T().nonnegative().optional(),
  cost_usd: T().nonnegative().optional(),
  cost_decimal: u().optional(),
  currency: u().optional()
}).strict(), Ke = De.extend({ models: ke(De).optional() }), Ge = S({
  title: u().min(1).max(200),
  agent: U.min(1),
  image_id: U.min(1),
  account_id: U.optional(),
  account_pool: N(U.min(1)).max(200).optional(),
  endpoint: oe.optional(),
  tools: ls.optional(),
  isolation: z(["shared", "worktree"]).optional(),
  workspace_id: U.optional(),
  repo_url: u().max(2e3).optional(),
  repo_ref: u().max(200).optional(),
  run_timeout: u().max(64).optional(),
  unattended: x().optional(),
  options: we.optional()
}).strict();
Ge.partial().extend({ id: U.min(1) });
const Rs = Ge.extend({ id: u(), options: we, owner: u(), writable: x(), deletable: x() }), J = N(u()), Ce = ke(ae()), us = S({ name: u(), label: u(), description: u(), section: u(), group: u(), order: T(), type: u(), values: N(ae()).optional(), schema: Ce.optional(), default: ae().optional(), profiles: J.optional() }), hs = S({ id: u(), title: u(), icon: u(), credentials: N(ds), endpoints: J, capabilities: J, unattended: Ce.optional(), options: N(us) }), Qe = S({ memory: u(), cpus: u(), pids_limit: T().int(), gpus: u(), network: u(), extra_args: J, allows: J }), fs = S({ ref: u(), label: u(), home: u(), dockerfile: u(), settings: Qe.optional() }), ps = S({ label_bytes: T().int().positive(), secret_bytes: T().int().positive(), endpoint_url_bytes: T().int().positive(), endpoint_model_bytes: T().int().positive() }), As = S({ agents: N(hs), default_image: fs, can_images: x(), can_workspaces: x(), can_prune: x(), build_cache_retention: u(), settings_path: u().optional(), account_limits: ps.optional() }), ms = S({ windows: N(S({ window: u(), utilization: T().optional(), status: z(["allowed", "warning", "rejected"]), resets_at: T().int().optional() })), overage_status: u().optional(), overage_disabled_reason: u().optional(), is_using_overage: x().optional() }), Ns = S({
  id: u(),
  agent: u(),
  label: u(),
  credential_kind: u(),
  subscription: x(),
  enabled: x(),
  rate_limits: ms.optional(),
  endpoint: oe.optional(),
  owner: u(),
  mine: x(),
  usable: x(),
  unavailable_reason: u().optional(),
  writable: x(),
  deletable: x(),
  last_used_at: u(),
  cooldown_until: u(),
  last_error: u(),
  runs_day: T().int(),
  failures_day: T().int()
}), _s = S({ id: u(), ref: u(), label: u(), home: u(), status: u(), usable: x(), agents: J, last_error: u(), owner: u(), writable: x(), deletable: x(), shareable: x() }), Is = S({ image: _s, build_log: u(), dockerfile: u().optional(), settings: Qe.optional() }), Vs = S({ isolation: z(["shared", "worktree"]).optional(), id: u(), name: u(), writable: x(), deletable: x(), shareable: x(), host_path: u().optional() }), ys = z(["queued", "running", "succeeded", "failed", "cancelled"]), Xe = S({
  endpoint: oe.optional(),
  id: u(),
  agent: u(),
  account_id: u(),
  image_id: u(),
  workspace_id: u().optional(),
  isolation: z(["shared", "worktree"]).optional(),
  options: Ce,
  unattended: x(),
  repo_url: u(),
  prompt: u(),
  status: ys,
  result: u(),
  error: u(),
  usage: Ke,
  cancel_requested: x(),
  timeout_ms: T(),
  workflow: x(),
  created_at: u(),
  started_at: u(),
  finished_at: u()
}), Zs = Xe.pick({ id: !0, agent: !0, account_id: !0, image_id: !0, workspace_id: !0, status: !0, workflow: !0, cancel_requested: !0, created_at: !0, started_at: !0, finished_at: !0 }).extend({ prompt_summary: u(), usage: Ke.optional() }), gs = S({ seq: T().int(), kind: z(["assistant", "reasoning", "tool", "tool_call", "hook", "tool_result", "tool_error", "system", "error", "log"]), text: u(), created_at: u() }), js = S({ run: Xe, events: N(gs), more: x(), next_seq: T().int().nonnegative() });
export {
  Ts as W,
  ws as a,
  Cs as b,
  hs as c,
  ps as d,
  oe as e,
  x as f,
  ae as g,
  N as h,
  z as i,
  Os as j,
  Zs as k,
  Es as l,
  _s as m,
  T as n,
  S as o,
  Ns as p,
  Rs as q,
  ke as r,
  u as s,
  ls as t,
  Ss as u,
  js as v,
  Vs as w,
  Is as x,
  As as y
};
