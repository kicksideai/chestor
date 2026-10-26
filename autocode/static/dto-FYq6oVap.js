import { ref as K, onMounted as He, onUnmounted as qe, watch as Je, createApp as Ye, inject as ye } from "vue";
import { addCollection as Ke } from "@iconify/vue";
import { config as xe, addIcons as Ge, on as Qe, applyThemeMode as G, host as Xe, hostCss as et, loadCss as tt } from "@wippy-fe/proxy";
import { getActivePinia as st, createPinia as rt, setActivePinia as nt } from "pinia";
var oe = "data-wippy-visible";
function ke(s) {
  const e = s.getAttribute(oe);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var it = Object.defineProperty, at = (s, e, t) => e in s ? it(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, k = (s, e, t) => at(s, typeof e != "symbol" ? e + "" : e, t), ot = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], ct = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function we(s) {
  const e = s.startsWith("--") ? s : `--${s}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function dt(...s) {
  const e = /* @__PURE__ */ new Set();
  for (const t of s)
    if (t)
      for (const [r, n] of Object.entries(t)) {
        if ((r === "@light" || r === "@dark") && n && typeof n == "object") {
          for (const [a, o] of Object.entries(n)) {
            const l = typeof o == "string" ? we(a) : null;
            l && e.add(l);
          }
          continue;
        }
        const i = typeof n == "string" ? we(r) : null;
        i && e.add(i);
      }
  return [...e].sort();
}
function lt(s) {
  if (s.length === 0)
    return "";
  const e = s.map((t) => `  ${t}: inherit;`).join(`
`);
  return `${ct} {
${e}
}`;
}
function ut(s, e) {
  const t = lt(e);
  t && $e(s, t, "@wippy-fe/css-variables-bridge");
}
function ht(s, e) {
  const r = (e ?? ot).map(async (n) => {
    const i = et[n];
    if (!i)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${n}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await tt(i);
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
function ft(s, e) {
  const t = document.createElement("style");
  t.textContent = e, s.appendChild(t);
}
function $e(s, e, t) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const n = new CSSStyleSheet();
    n.replaceSync(e), s.adoptedStyleSheets = [...s.adoptedStyleSheets, n];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", t), r.textContent = e, s.appendChild(r);
}
function pt(s, e) {
  $e(s, e, "@wippy-fe/custom-css");
}
function Le(s) {
  return s.__wippyHost ?? null;
}
function mt(s) {
  return s.replace(/-([a-z])/g, (e, t) => t.toUpperCase());
}
function _t(s, e, t) {
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
function ie(s, e) {
  const t = {}, r = [];
  for (const [n, i] of Object.entries(e.properties)) {
    const a = s.getAttribute(n), o = mt(n);
    if (a === null) {
      i.default !== void 0 && (t[o] = i.default);
      continue;
    }
    const l = _t(n, a, i);
    l.error ? r.push(l.error) : t[o] = l.value;
  }
  return { props: t, errors: r };
}
var yt = class {
  constructor(s, e) {
    k(this, "_props"), k(this, "_errors"), k(this, "_content"), k(this, "_hostVisibility"), k(this, "_propsListeners", /* @__PURE__ */ new Set()), k(this, "_contentListeners", /* @__PURE__ */ new Set()), k(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), k(this, "_disposed", !1), k(this, "_emitToDom"), k(this, "props"), k(this, "events"), k(this, "content"), k(this, "hostVisibility"), this._props = s.props, this._errors = s.errors, this._content = s.content, this._hostVisibility = s.hostVisibility, this._emitToDom = e;
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
}, gt = class extends HTMLElement {
  constructor() {
    super(), k(this, "_internals"), k(this, "_contentObserver", null), k(this, "_initialized", !1), k(this, "_container", null), k(this, "_reactive", null), k(this, "_lastProps", null), k(this, "_lastErrors", []), k(this, "_lastContent", null), k(this, "_themeUnsub", null), k(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = ke(this);
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
    return [.../* @__PURE__ */ new Set([...e, ...t, oe])];
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
    return Le(this);
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
        const i = ie(this, s.propsSchema);
        s.validateProps && i.errors.push(...s.validateProps(i.props)), t = i.props, r = i.errors, this._lastProps = t, this._lastErrors = r;
      }
      const n = e ? this._lastContent ?? this._extractContent(s.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = n), this._reactive = new yt(
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
        this.onInit(t), s.inlineCss && ft(t, s.inlineCss);
        try {
          const d = xe?.theming, m = dt(
            d?.global?.cssVariables,
            d?.children?.cssVariables
          );
          ut(t, m);
        } catch {
        }
        if (s.customCss !== !1)
          try {
            const d = xe?.theming, m = [d?.global?.customCSS, d?.children?.customCSS].filter(Boolean).join(`
`);
            m && pt(t, m);
          } catch {
          }
        (s.hostCssKeys === void 0 || s.hostCssKeys.length > 0) && ht(t, s.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const l = s.containerClasses ?? [];
        l.length > 0 && r.classList.add(...l), t.appendChild(r), this._container = r, Ge(Ke);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Qe("@theme", (l) => this._applyTheme(l)));
      const { props: n, errors: i } = ie(this, s.propsSchema);
      s.validateProps && i.push(...s.validateProps(n));
      const a = n;
      this._lastProps = a, this._lastErrors = i;
      let o = null;
      s.contentTemplate && (o = this._extractContent(s.contentTemplate), this._lastContent = o, this._contentObserver = new MutationObserver(() => {
        const l = this._extractContent(s.contentTemplate);
        this._lastContent = l, this._reactive?.notifyContent(l), this.onContentChanged(l);
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
  _applyTheme(s = Xe.getThemeMode?.()) {
    G(s, this), this._container && G(s, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), G("auto", this), this._container && G("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(s, e, t) {
    if (e === t)
      return;
    if (s === oe) {
      const o = this._hostVisible, l = ke(this);
      if (l === o)
        return;
      this._hostVisible = l, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(l, o), this.onHostVisibilityChanged(l, o));
      return;
    }
    const r = this.constructor.wippyConfig, { props: n, errors: i } = ie(this, r.propsSchema);
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
function vt(s) {
  return s.__wippyHostBus ?? null;
}
function bt(s) {
  return s.dataset.wippyPanelId ?? null;
}
var xt = Object.defineProperty, kt = (s, e, t) => e in s ? xt(s, e, { enumerable: !0, configurable: !0, writable: !0, value: t }) : s[e] = t, L = (s, e, t) => kt(s, typeof e != "symbol" ? e + "" : e, t), Me = /* @__PURE__ */ Symbol("wippy:emit"), ze = /* @__PURE__ */ Symbol("wippy:props"), wt = /* @__PURE__ */ Symbol("wippy:props_error"), Ct = /* @__PURE__ */ Symbol("wippy:content"), St = /* @__PURE__ */ Symbol("wippy:panel-id"), Tt = /* @__PURE__ */ Symbol("wippy:layout-bus"), Ot = /* @__PURE__ */ Symbol("wippy:host"), De = /* @__PURE__ */ Symbol("wippy:host-visibility");
function ms() {
  const s = ye(ze);
  if (!s)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return s;
}
function _s() {
  const s = ye(Me);
  if (!s)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return s;
}
function Et() {
  const s = ye(De);
  if (!s)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return s;
}
function ys(s) {
  const e = Et();
  let t = !1, r = null, n = !1;
  function i() {
    if (r)
      return n = !0, r;
    let a;
    try {
      a = Promise.resolve(s());
    } catch (l) {
      a = Promise.reject(l);
    }
    const o = a.finally(() => {
      if (r === o && (r = null, t && n))
        return n = !1, i();
    });
    return r = o, o;
  }
  return He(() => (t = !0, i())), qe(() => {
    t = !1, n = !1;
  }), Je(e, (a, o) => {
    if (t && o === !1 && a === !0)
      return i();
  }), e;
}
var gs = class extends gt {
  constructor() {
    super(...arguments), L(this, "_vueApp", null), L(this, "_propsRef", K({})), L(this, "_errorsRef", K([])), L(this, "_contentRef", K(null)), L(this, "_hostVisibilityRef", K(null)), L(this, "_bridgeAbort", null);
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
    for (const d of r)
      this.emitEvent("invalid", { message: d });
    const o = new AbortController();
    this._bridgeAbort = o, this.reactive.props.subscribe((d, m) => {
      this._propsRef.value = d, this._errorsRef.value = [...m];
      for (const x of m)
        this.emitEvent("invalid", { message: x });
    }, { signal: o.signal }), this.reactive.content && this.reactive.content.subscribe((d) => {
      this._contentRef.value = d;
    }, { signal: o.signal }), this.reactive.hostVisibility.subscribe((d) => {
      this._hostVisibilityRef.value = d;
    }, { signal: o.signal });
    const l = (d) => {
      if (o.signal.aborted)
        return;
      const m = st(), x = Ye(d.rootComponent);
      this._vueApp = x;
      const V = rt();
      if (d.piniaPlugins)
        for (const ne of d.piniaPlugins)
          V.use(ne);
      if (x.use(V), d.plugins)
        for (const ne of d.plugins)
          x.use(ne);
      x.provide(ze, this._propsRef), x.provide(wt, this._errorsRef), x.provide(Me, this.emitEvent.bind(this)), x.provide(Ct, this._contentRef), x.provide(De, this._hostVisibilityRef), x.provide(St, bt(this)), x.provide(Tt, vt(this)), x.provide(Ot, Le(this)), d.providers && d.providers(x, this), x.mount(e), m && nt(m);
    };
    if (a.rootComponent)
      l(a);
    else if (a.lazyConfig) {
      const d = document.createElement("wippy-loading");
      d.setAttribute("no-bg", ""), e.appendChild(d), a.lazyConfig().then((m) => {
        o.signal.aborted || (d.remove(), l(m));
      }).catch((m) => {
        if (o.signal.aborted)
          return;
        const x = m instanceof Error ? m.message : String(m), V = document.createElement("wippy-error");
        V.setAttribute("title", "Failed to load"), V.setAttribute("message", x), d.replaceWith(V), this.emitEvent("error", { message: x });
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
var Ce;
(function(s) {
  s.mergeShapes = (e, t) => ({
    ...e,
    ...t
    // second overwrites first
  });
})(Ce || (Ce = {}));
const h = b.arrayToEnum([
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
]), Z = (s) => {
  switch (typeof s) {
    case "undefined":
      return h.undefined;
    case "string":
      return h.string;
    case "number":
      return Number.isNaN(s) ? h.nan : h.number;
    case "boolean":
      return h.boolean;
    case "function":
      return h.function;
    case "bigint":
      return h.bigint;
    case "symbol":
      return h.symbol;
    case "object":
      return Array.isArray(s) ? h.array : s === null ? h.null : s.then && typeof s.then == "function" && s.catch && typeof s.catch == "function" ? h.promise : typeof Map < "u" && s instanceof Map ? h.map : typeof Set < "u" && s instanceof Set ? h.set : typeof Date < "u" && s instanceof Date ? h.date : h.object;
    default:
      return h.unknown;
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
class I extends Error {
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
          let o = r, l = 0;
          for (; l < a.path.length; ) {
            const d = a.path[l];
            l === a.path.length - 1 ? (o[d] = o[d] || { _errors: [] }, o[d]._errors.push(t(a))) : o[d] = o[d] || { _errors: [] }, o = o[d], l++;
          }
        }
    };
    return n(this), r;
  }
  static assert(e) {
    if (!(e instanceof I))
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
I.create = (s) => new I(s);
const ce = (s, e) => {
  let t;
  switch (s.code) {
    case c.invalid_type:
      s.received === h.undefined ? t = "Required" : t = `Expected ${s.expected}, received ${s.received}`;
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
let Rt = ce;
function At() {
  return Rt;
}
const Nt = (s) => {
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
  const l = r.filter((d) => !!d).slice().reverse();
  for (const d of l)
    o = d(a, { data: e, defaultError: o }).message;
  return {
    ...n,
    path: i,
    message: o
  };
};
function u(s, e) {
  const t = At(), r = Nt({
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
      t === ce ? void 0 : ce
      // then global default map
    ].filter((n) => !!n)
  });
  s.common.issues.push(r);
}
class T {
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
    return T.mergeObjectSync(e, r);
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
}), H = (s) => ({ status: "dirty", value: s }), E = (s) => ({ status: "valid", value: s }), Se = (s) => s.status === "aborted", Te = (s) => s.status === "dirty", z = (s) => s.status === "valid", Q = (s) => typeof Promise < "u" && s instanceof Promise;
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
const Oe = (s, e) => {
  if (z(e))
    return { success: !0, data: e.value };
  if (!s.common.issues.length)
    throw new Error("Validation failed but no issues detected.");
  return {
    success: !1,
    get error() {
      if (this._error)
        return this._error;
      const t = new I(s.common.issues);
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
    const { message: l } = s;
    return a.code === "invalid_enum_value" ? { message: l ?? o.defaultError } : typeof o.data > "u" ? { message: l ?? r ?? o.defaultError } : a.code !== "invalid_type" ? { message: o.defaultError } : { message: l ?? t ?? o.defaultError };
  }, description: n };
}
class v {
  get description() {
    return this._def.description;
  }
  _getType(e) {
    return Z(e.data);
  }
  _getOrReturnCtx(e, t) {
    return t || {
      common: e.parent.common,
      data: e.data,
      parsedType: Z(e.data),
      schemaErrorMap: this._def.errorMap,
      path: e.path,
      parent: e.parent
    };
  }
  _processInputParams(e) {
    return {
      status: new T(),
      ctx: {
        common: e.parent.common,
        data: e.data,
        parsedType: Z(e.data),
        schemaErrorMap: this._def.errorMap,
        path: e.path,
        parent: e.parent
      }
    };
  }
  _parseSync(e) {
    const t = this._parse(e);
    if (Q(t))
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
      parsedType: Z(e)
    }, n = this._parseSync({ data: e, path: r.path, parent: r });
    return Oe(r, n);
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
      parsedType: Z(e)
    };
    if (!this["~standard"].async)
      try {
        const r = this._parseSync({ data: e, path: [], parent: t });
        return z(r) ? {
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
    return this._parseAsync({ data: e, path: [], parent: t }).then((r) => z(r) ? {
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
      parsedType: Z(e)
    }, n = this._parse({ data: e, path: r.path, parent: r }), i = await (Q(n) ? n : Promise.resolve(n));
    return Oe(r, i);
  }
  refine(e, t) {
    const r = (n) => typeof t == "string" || typeof t > "u" ? { message: t } : typeof t == "function" ? t(n) : t;
    return this._refinement((n, i) => {
      const a = e(n), o = () => i.addIssue({
        code: c.custom,
        ...r(n)
      });
      return typeof Promise < "u" && a instanceof Promise ? a.then((l) => l ? !0 : (o(), !1)) : a ? !0 : (o(), !1);
    });
  }
  refinement(e, t) {
    return this._refinement((r, n) => e(r) ? !0 : (n.addIssue(typeof t == "function" ? t(r, n) : t), !1));
  }
  _refinement(e) {
    return new B({
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
    return j.create(this, this._def);
  }
  nullable() {
    return W.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return R.create(this);
  }
  promise() {
    return re.create(this, this._def);
  }
  or(e) {
    return ee.create([this, e], this._def);
  }
  and(e) {
    return te.create(this, e, this._def);
  }
  transform(e) {
    return new B({
      ...g(this._def),
      schema: this,
      typeName: _.ZodEffects,
      effect: { type: "transform", transform: e }
    });
  }
  default(e) {
    const t = typeof e == "function" ? e : () => e;
    return new fe({
      ...g(this._def),
      innerType: this,
      defaultValue: t,
      typeName: _.ZodDefault
    });
  }
  brand() {
    return new es({
      typeName: _.ZodBranded,
      type: this,
      ...g(this._def)
    });
  }
  catch(e) {
    const t = typeof e == "function" ? e : () => e;
    return new pe({
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
    return ge.create(this, e);
  }
  readonly() {
    return me.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
const It = /^c[^\s-]{8,}$/i, Vt = /^[0-9a-z]+$/, Zt = /^[0-9A-HJKMNP-TV-Z]{26}$/i, jt = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i, Pt = /^[a-z0-9_-]{21}$/i, $t = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/, Lt = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/, Mt = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i, zt = "^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$";
let ae;
const Dt = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/, Ut = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/, Bt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/, Wt = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/, Ft = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/, Ht = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/, Ue = "((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))", qt = new RegExp(`^${Ue}$`);
function Be(s) {
  let e = "[0-5]\\d";
  s.precision ? e = `${e}\\.\\d{${s.precision}}` : s.precision == null && (e = `${e}(\\.\\d+)?`);
  const t = s.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${e})${t}`;
}
function Jt(s) {
  return new RegExp(`^${Be(s)}$`);
}
function Yt(s) {
  let e = `${Ue}T${Be(s)}`;
  const t = [];
  return t.push(s.local ? "Z?" : "Z"), s.offset && t.push("([+-]\\d{2}:?\\d{2})"), e = `${e}(${t.join("|")})`, new RegExp(`^${e}$`);
}
function Kt(s, e) {
  return !!((e === "v4" || !e) && Dt.test(s) || (e === "v6" || !e) && Bt.test(s));
}
function Gt(s, e) {
  if (!$t.test(s))
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
function Qt(s, e) {
  return !!((e === "v4" || !e) && Ut.test(s) || (e === "v6" || !e) && Wt.test(s));
}
class N extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = String(e.data)), this._getType(e) !== h.string) {
      const i = this._getOrReturnCtx(e);
      return u(i, {
        code: c.invalid_type,
        expected: h.string,
        received: i.parsedType
      }), y;
    }
    const r = new T();
    let n;
    for (const i of this._def.checks)
      if (i.kind === "min")
        e.data.length < i.value && (n = this._getOrReturnCtx(e, n), u(n, {
          code: c.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "max")
        e.data.length > i.value && (n = this._getOrReturnCtx(e, n), u(n, {
          code: c.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !1,
          message: i.message
        }), r.dirty());
      else if (i.kind === "length") {
        const a = e.data.length > i.value, o = e.data.length < i.value;
        (a || o) && (n = this._getOrReturnCtx(e, n), a ? u(n, {
          code: c.too_big,
          maximum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }) : o && u(n, {
          code: c.too_small,
          minimum: i.value,
          type: "string",
          inclusive: !0,
          exact: !0,
          message: i.message
        }), r.dirty());
      } else if (i.kind === "email")
        Mt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "email",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "emoji")
        ae || (ae = new RegExp(zt, "u")), ae.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "emoji",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "uuid")
        jt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "uuid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "nanoid")
        Pt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "nanoid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid")
        It.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "cuid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "cuid2")
        Vt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "cuid2",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "ulid")
        Zt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
          validation: "ulid",
          code: c.invalid_string,
          message: i.message
        }), r.dirty());
      else if (i.kind === "url")
        try {
          new URL(e.data);
        } catch {
          n = this._getOrReturnCtx(e, n), u(n, {
            validation: "url",
            code: c.invalid_string,
            message: i.message
          }), r.dirty();
        }
      else i.kind === "regex" ? (i.regex.lastIndex = 0, i.regex.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "regex",
        code: c.invalid_string,
        message: i.message
      }), r.dirty())) : i.kind === "trim" ? e.data = e.data.trim() : i.kind === "includes" ? e.data.includes(i.value, i.position) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { includes: i.value, position: i.position },
        message: i.message
      }), r.dirty()) : i.kind === "toLowerCase" ? e.data = e.data.toLowerCase() : i.kind === "toUpperCase" ? e.data = e.data.toUpperCase() : i.kind === "startsWith" ? e.data.startsWith(i.value) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { startsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "endsWith" ? e.data.endsWith(i.value) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: { endsWith: i.value },
        message: i.message
      }), r.dirty()) : i.kind === "datetime" ? Yt(i).test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "datetime",
        message: i.message
      }), r.dirty()) : i.kind === "date" ? qt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "date",
        message: i.message
      }), r.dirty()) : i.kind === "time" ? Jt(i).test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.invalid_string,
        validation: "time",
        message: i.message
      }), r.dirty()) : i.kind === "duration" ? Lt.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "duration",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "ip" ? Kt(e.data, i.version) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "ip",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "jwt" ? Gt(e.data, i.alg) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "jwt",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "cidr" ? Qt(e.data, i.version) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "cidr",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64" ? Ft.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
        validation: "base64",
        code: c.invalid_string,
        message: i.message
      }), r.dirty()) : i.kind === "base64url" ? Ht.test(e.data) || (n = this._getOrReturnCtx(e, n), u(n, {
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
    return new N({
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
    return new N({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new N({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new N({
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
N.create = (s) => new N({
  checks: [],
  typeName: _.ZodString,
  coerce: s?.coerce ?? !1,
  ...g(s)
});
function Xt(s, e) {
  const t = (s.toString().split(".")[1] || "").length, r = (e.toString().split(".")[1] || "").length, n = t > r ? t : r, i = Number.parseInt(s.toFixed(n).replace(".", "")), a = Number.parseInt(e.toFixed(n).replace(".", ""));
  return i % a / 10 ** n;
}
class D extends v {
  constructor() {
    super(...arguments), this.min = this.gte, this.max = this.lte, this.step = this.multipleOf;
  }
  _parse(e) {
    if (this._def.coerce && (e.data = Number(e.data)), this._getType(e) !== h.number) {
      const i = this._getOrReturnCtx(e);
      return u(i, {
        code: c.invalid_type,
        expected: h.number,
        received: i.parsedType
      }), y;
    }
    let r;
    const n = new T();
    for (const i of this._def.checks)
      i.kind === "int" ? b.isInteger(e.data) || (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.invalid_type,
        expected: "integer",
        received: "float",
        message: i.message
      }), n.dirty()) : i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.too_small,
        minimum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.too_big,
        maximum: i.value,
        type: "number",
        inclusive: i.inclusive,
        exact: !1,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? Xt(e.data, i.value) !== 0 && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : i.kind === "finite" ? Number.isFinite(e.data) || (r = this._getOrReturnCtx(e, r), u(r, {
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
    return new D({
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
    return new D({
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
D.create = (s) => new D({
  checks: [],
  typeName: _.ZodNumber,
  coerce: s?.coerce || !1,
  ...g(s)
});
class q extends v {
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
    if (this._getType(e) !== h.bigint)
      return this._getInvalidInput(e);
    let r;
    const n = new T();
    for (const i of this._def.checks)
      i.kind === "min" ? (i.inclusive ? e.data < i.value : e.data <= i.value) && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.too_small,
        type: "bigint",
        minimum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "max" ? (i.inclusive ? e.data > i.value : e.data >= i.value) && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.too_big,
        type: "bigint",
        maximum: i.value,
        inclusive: i.inclusive,
        message: i.message
      }), n.dirty()) : i.kind === "multipleOf" ? e.data % i.value !== BigInt(0) && (r = this._getOrReturnCtx(e, r), u(r, {
        code: c.not_multiple_of,
        multipleOf: i.value,
        message: i.message
      }), n.dirty()) : b.assertNever(i);
    return { status: n.value, value: e.data };
  }
  _getInvalidInput(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.bigint,
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
    return new q({
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
    return new q({
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
q.create = (s) => new q({
  checks: [],
  typeName: _.ZodBigInt,
  coerce: s?.coerce ?? !1,
  ...g(s)
});
class de extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = !!e.data), this._getType(e) !== h.boolean) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.boolean,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
de.create = (s) => new de({
  typeName: _.ZodBoolean,
  coerce: s?.coerce || !1,
  ...g(s)
});
class X extends v {
  _parse(e) {
    if (this._def.coerce && (e.data = new Date(e.data)), this._getType(e) !== h.date) {
      const i = this._getOrReturnCtx(e);
      return u(i, {
        code: c.invalid_type,
        expected: h.date,
        received: i.parsedType
      }), y;
    }
    if (Number.isNaN(e.data.getTime())) {
      const i = this._getOrReturnCtx(e);
      return u(i, {
        code: c.invalid_date
      }), y;
    }
    const r = new T();
    let n;
    for (const i of this._def.checks)
      i.kind === "min" ? e.data.getTime() < i.value && (n = this._getOrReturnCtx(e, n), u(n, {
        code: c.too_small,
        message: i.message,
        inclusive: !0,
        exact: !1,
        minimum: i.value,
        type: "date"
      }), r.dirty()) : i.kind === "max" ? e.data.getTime() > i.value && (n = this._getOrReturnCtx(e, n), u(n, {
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
    return new X({
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
X.create = (s) => new X({
  checks: [],
  coerce: s?.coerce || !1,
  typeName: _.ZodDate,
  ...g(s)
});
class Ee extends v {
  _parse(e) {
    if (this._getType(e) !== h.symbol) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.symbol,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ee.create = (s) => new Ee({
  typeName: _.ZodSymbol,
  ...g(s)
});
class Re extends v {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.undefined,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Re.create = (s) => new Re({
  typeName: _.ZodUndefined,
  ...g(s)
});
class Ae extends v {
  _parse(e) {
    if (this._getType(e) !== h.null) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.null,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ae.create = (s) => new Ae({
  typeName: _.ZodNull,
  ...g(s)
});
class Ne extends v {
  constructor() {
    super(...arguments), this._any = !0;
  }
  _parse(e) {
    return E(e.data);
  }
}
Ne.create = (s) => new Ne({
  typeName: _.ZodAny,
  ...g(s)
});
class le extends v {
  constructor() {
    super(...arguments), this._unknown = !0;
  }
  _parse(e) {
    return E(e.data);
  }
}
le.create = (s) => new le({
  typeName: _.ZodUnknown,
  ...g(s)
});
class P extends v {
  _parse(e) {
    const t = this._getOrReturnCtx(e);
    return u(t, {
      code: c.invalid_type,
      expected: h.never,
      received: t.parsedType
    }), y;
  }
}
P.create = (s) => new P({
  typeName: _.ZodNever,
  ...g(s)
});
class Ie extends v {
  _parse(e) {
    if (this._getType(e) !== h.undefined) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.void,
        received: r.parsedType
      }), y;
    }
    return E(e.data);
  }
}
Ie.create = (s) => new Ie({
  typeName: _.ZodVoid,
  ...g(s)
});
class R extends v {
  _parse(e) {
    const { ctx: t, status: r } = this._processInputParams(e), n = this._def;
    if (t.parsedType !== h.array)
      return u(t, {
        code: c.invalid_type,
        expected: h.array,
        received: t.parsedType
      }), y;
    if (n.exactLength !== null) {
      const a = t.data.length > n.exactLength.value, o = t.data.length < n.exactLength.value;
      (a || o) && (u(t, {
        code: a ? c.too_big : c.too_small,
        minimum: o ? n.exactLength.value : void 0,
        maximum: a ? n.exactLength.value : void 0,
        type: "array",
        inclusive: !0,
        exact: !0,
        message: n.exactLength.message
      }), r.dirty());
    }
    if (n.minLength !== null && t.data.length < n.minLength.value && (u(t, {
      code: c.too_small,
      minimum: n.minLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.minLength.message
    }), r.dirty()), n.maxLength !== null && t.data.length > n.maxLength.value && (u(t, {
      code: c.too_big,
      maximum: n.maxLength.value,
      type: "array",
      inclusive: !0,
      exact: !1,
      message: n.maxLength.message
    }), r.dirty()), t.common.async)
      return Promise.all([...t.data].map((a, o) => n.type._parseAsync(new A(t, a, t.path, o)))).then((a) => T.mergeArray(r, a));
    const i = [...t.data].map((a, o) => n.type._parseSync(new A(t, a, t.path, o)));
    return T.mergeArray(r, i);
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
function M(s) {
  if (s instanceof w) {
    const e = {};
    for (const t in s.shape) {
      const r = s.shape[t];
      e[t] = j.create(M(r));
    }
    return new w({
      ...s._def,
      shape: () => e
    });
  } else return s instanceof R ? new R({
    ...s._def,
    type: M(s.element)
  }) : s instanceof j ? j.create(M(s.unwrap())) : s instanceof W ? W.create(M(s.unwrap())) : s instanceof $ ? $.create(s.items.map((e) => M(e))) : s;
}
class w extends v {
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
    if (this._getType(e) !== h.object) {
      const d = this._getOrReturnCtx(e);
      return u(d, {
        code: c.invalid_type,
        expected: h.object,
        received: d.parsedType
      }), y;
    }
    const { status: r, ctx: n } = this._processInputParams(e), { shape: i, keys: a } = this._getCached(), o = [];
    if (!(this._def.catchall instanceof P && this._def.unknownKeys === "strip"))
      for (const d in n.data)
        a.includes(d) || o.push(d);
    const l = [];
    for (const d of a) {
      const m = i[d], x = n.data[d];
      l.push({
        key: { status: "valid", value: d },
        value: m._parse(new A(n, x, n.path, d)),
        alwaysSet: d in n.data
      });
    }
    if (this._def.catchall instanceof P) {
      const d = this._def.unknownKeys;
      if (d === "passthrough")
        for (const m of o)
          l.push({
            key: { status: "valid", value: m },
            value: { status: "valid", value: n.data[m] }
          });
      else if (d === "strict")
        o.length > 0 && (u(n, {
          code: c.unrecognized_keys,
          keys: o
        }), r.dirty());
      else if (d !== "strip") throw new Error("Internal ZodObject error: invalid unknownKeys value.");
    } else {
      const d = this._def.catchall;
      for (const m of o) {
        const x = n.data[m];
        l.push({
          key: { status: "valid", value: m },
          value: d._parse(
            new A(n, x, n.path, m)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: m in n.data
        });
      }
    }
    return n.common.async ? Promise.resolve().then(async () => {
      const d = [];
      for (const m of l) {
        const x = await m.key, V = await m.value;
        d.push({
          key: x,
          value: V,
          alwaysSet: m.alwaysSet
        });
      }
      return d;
    }).then((d) => T.mergeObjectSync(r, d)) : T.mergeObjectSync(r, l);
  }
  get shape() {
    return this._def.shape();
  }
  strict(e) {
    return p.errToObj, new w({
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
    return new w({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new w({
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
    return new w({
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
    return new w({
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
    return new w({
      ...this._def,
      catchall: e
    });
  }
  pick(e) {
    const t = {};
    for (const r of b.objectKeys(e))
      e[r] && this.shape[r] && (t[r] = this.shape[r]);
    return new w({
      ...this._def,
      shape: () => t
    });
  }
  omit(e) {
    const t = {};
    for (const r of b.objectKeys(this.shape))
      e[r] || (t[r] = this.shape[r]);
    return new w({
      ...this._def,
      shape: () => t
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return M(this);
  }
  partial(e) {
    const t = {};
    for (const r of b.objectKeys(this.shape)) {
      const n = this.shape[r];
      e && !e[r] ? t[r] = n : t[r] = n.optional();
    }
    return new w({
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
        for (; i instanceof j; )
          i = i._def.innerType;
        t[r] = i;
      }
    return new w({
      ...this._def,
      shape: () => t
    });
  }
  keyof() {
    return We(b.objectKeys(this.shape));
  }
}
w.create = (s, e) => new w({
  shape: () => s,
  unknownKeys: "strip",
  catchall: P.create(),
  typeName: _.ZodObject,
  ...g(e)
});
w.strictCreate = (s, e) => new w({
  shape: () => s,
  unknownKeys: "strict",
  catchall: P.create(),
  typeName: _.ZodObject,
  ...g(e)
});
w.lazycreate = (s, e) => new w({
  shape: s,
  unknownKeys: "strip",
  catchall: P.create(),
  typeName: _.ZodObject,
  ...g(e)
});
class ee extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e), r = this._def.options;
    function n(i) {
      for (const o of i)
        if (o.result.status === "valid")
          return o.result;
      for (const o of i)
        if (o.result.status === "dirty")
          return t.common.issues.push(...o.ctx.common.issues), o.result;
      const a = i.map((o) => new I(o.ctx.common.issues));
      return u(t, {
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
      for (const l of r) {
        const d = {
          ...t,
          common: {
            ...t.common,
            issues: []
          },
          parent: null
        }, m = l._parseSync({
          data: t.data,
          path: t.path,
          parent: d
        });
        if (m.status === "valid")
          return m;
        m.status === "dirty" && !i && (i = { result: m, ctx: d }), d.common.issues.length && a.push(d.common.issues);
      }
      if (i)
        return t.common.issues.push(...i.ctx.common.issues), i.result;
      const o = a.map((l) => new I(l));
      return u(t, {
        code: c.invalid_union,
        unionErrors: o
      }), y;
    }
  }
  get options() {
    return this._def.options;
  }
}
ee.create = (s, e) => new ee({
  options: s,
  typeName: _.ZodUnion,
  ...g(e)
});
function ue(s, e) {
  const t = Z(s), r = Z(e);
  if (s === e)
    return { valid: !0, data: s };
  if (t === h.object && r === h.object) {
    const n = b.objectKeys(e), i = b.objectKeys(s).filter((o) => n.indexOf(o) !== -1), a = { ...s, ...e };
    for (const o of i) {
      const l = ue(s[o], e[o]);
      if (!l.valid)
        return { valid: !1 };
      a[o] = l.data;
    }
    return { valid: !0, data: a };
  } else if (t === h.array && r === h.array) {
    if (s.length !== e.length)
      return { valid: !1 };
    const n = [];
    for (let i = 0; i < s.length; i++) {
      const a = s[i], o = e[i], l = ue(a, o);
      if (!l.valid)
        return { valid: !1 };
      n.push(l.data);
    }
    return { valid: !0, data: n };
  } else return t === h.date && r === h.date && +s == +e ? { valid: !0, data: s } : { valid: !1 };
}
class te extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), n = (i, a) => {
      if (Se(i) || Se(a))
        return y;
      const o = ue(i.value, a.value);
      return o.valid ? ((Te(i) || Te(a)) && t.dirty(), { status: t.value, value: o.data }) : (u(r, {
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
te.create = (s, e, t) => new te({
  left: s,
  right: e,
  typeName: _.ZodIntersection,
  ...g(t)
});
class $ extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.array)
      return u(r, {
        code: c.invalid_type,
        expected: h.array,
        received: r.parsedType
      }), y;
    if (r.data.length < this._def.items.length)
      return u(r, {
        code: c.too_small,
        minimum: this._def.items.length,
        inclusive: !0,
        exact: !1,
        type: "array"
      }), y;
    !this._def.rest && r.data.length > this._def.items.length && (u(r, {
      code: c.too_big,
      maximum: this._def.items.length,
      inclusive: !0,
      exact: !1,
      type: "array"
    }), t.dirty());
    const i = [...r.data].map((a, o) => {
      const l = this._def.items[o] || this._def.rest;
      return l ? l._parse(new A(r, a, r.path, o)) : null;
    }).filter((a) => !!a);
    return r.common.async ? Promise.all(i).then((a) => T.mergeArray(t, a)) : T.mergeArray(t, i);
  }
  get items() {
    return this._def.items;
  }
  rest(e) {
    return new $({
      ...this._def,
      rest: e
    });
  }
}
$.create = (s, e) => {
  if (!Array.isArray(s))
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  return new $({
    items: s,
    typeName: _.ZodTuple,
    rest: null,
    ...g(e)
  });
};
class se extends v {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.object)
      return u(r, {
        code: c.invalid_type,
        expected: h.object,
        received: r.parsedType
      }), y;
    const n = [], i = this._def.keyType, a = this._def.valueType;
    for (const o in r.data)
      n.push({
        key: i._parse(new A(r, o, r.path, o)),
        value: a._parse(new A(r, r.data[o], r.path, o)),
        alwaysSet: o in r.data
      });
    return r.common.async ? T.mergeObjectAsync(t, n) : T.mergeObjectSync(t, n);
  }
  get element() {
    return this._def.valueType;
  }
  static create(e, t, r) {
    return t instanceof v ? new se({
      keyType: e,
      valueType: t,
      typeName: _.ZodRecord,
      ...g(r)
    }) : new se({
      keyType: N.create(),
      valueType: e,
      typeName: _.ZodRecord,
      ...g(t)
    });
  }
}
class Ve extends v {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.map)
      return u(r, {
        code: c.invalid_type,
        expected: h.map,
        received: r.parsedType
      }), y;
    const n = this._def.keyType, i = this._def.valueType, a = [...r.data.entries()].map(([o, l], d) => ({
      key: n._parse(new A(r, o, r.path, [d, "key"])),
      value: i._parse(new A(r, l, r.path, [d, "value"]))
    }));
    if (r.common.async) {
      const o = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const l of a) {
          const d = await l.key, m = await l.value;
          if (d.status === "aborted" || m.status === "aborted")
            return y;
          (d.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(d.value, m.value);
        }
        return { status: t.value, value: o };
      });
    } else {
      const o = /* @__PURE__ */ new Map();
      for (const l of a) {
        const d = l.key, m = l.value;
        if (d.status === "aborted" || m.status === "aborted")
          return y;
        (d.status === "dirty" || m.status === "dirty") && t.dirty(), o.set(d.value, m.value);
      }
      return { status: t.value, value: o };
    }
  }
}
Ve.create = (s, e, t) => new Ve({
  valueType: e,
  keyType: s,
  typeName: _.ZodMap,
  ...g(t)
});
class J extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.parsedType !== h.set)
      return u(r, {
        code: c.invalid_type,
        expected: h.set,
        received: r.parsedType
      }), y;
    const n = this._def;
    n.minSize !== null && r.data.size < n.minSize.value && (u(r, {
      code: c.too_small,
      minimum: n.minSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.minSize.message
    }), t.dirty()), n.maxSize !== null && r.data.size > n.maxSize.value && (u(r, {
      code: c.too_big,
      maximum: n.maxSize.value,
      type: "set",
      inclusive: !0,
      exact: !1,
      message: n.maxSize.message
    }), t.dirty());
    const i = this._def.valueType;
    function a(l) {
      const d = /* @__PURE__ */ new Set();
      for (const m of l) {
        if (m.status === "aborted")
          return y;
        m.status === "dirty" && t.dirty(), d.add(m.value);
      }
      return { status: t.value, value: d };
    }
    const o = [...r.data.values()].map((l, d) => i._parse(new A(r, l, r.path, d)));
    return r.common.async ? Promise.all(o).then((l) => a(l)) : a(o);
  }
  min(e, t) {
    return new J({
      ...this._def,
      minSize: { value: e, message: p.toString(t) }
    });
  }
  max(e, t) {
    return new J({
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
J.create = (s, e) => new J({
  valueType: s,
  minSize: null,
  maxSize: null,
  typeName: _.ZodSet,
  ...g(e)
});
class Ze extends v {
  get schema() {
    return this._def.getter();
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    return this._def.getter()._parse({ data: t.data, path: t.path, parent: t });
  }
}
Ze.create = (s, e) => new Ze({
  getter: s,
  typeName: _.ZodLazy,
  ...g(e)
});
class he extends v {
  _parse(e) {
    if (e.data !== this._def.value) {
      const t = this._getOrReturnCtx(e);
      return u(t, {
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
he.create = (s, e) => new he({
  value: s,
  typeName: _.ZodLiteral,
  ...g(e)
});
function We(s, e) {
  return new U({
    values: s,
    typeName: _.ZodEnum,
    ...g(e)
  });
}
class U extends v {
  _parse(e) {
    if (typeof e.data != "string") {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return u(t, {
        expected: b.joinValues(r),
        received: t.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._cache || (this._cache = new Set(this._def.values)), !this._cache.has(e.data)) {
      const t = this._getOrReturnCtx(e), r = this._def.values;
      return u(t, {
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
    return U.create(e, {
      ...this._def,
      ...t
    });
  }
  exclude(e, t = this._def) {
    return U.create(this.options.filter((r) => !e.includes(r)), {
      ...this._def,
      ...t
    });
  }
}
U.create = We;
class je extends v {
  _parse(e) {
    const t = b.getValidEnumValues(this._def.values), r = this._getOrReturnCtx(e);
    if (r.parsedType !== h.string && r.parsedType !== h.number) {
      const n = b.objectValues(t);
      return u(r, {
        expected: b.joinValues(n),
        received: r.parsedType,
        code: c.invalid_type
      }), y;
    }
    if (this._cache || (this._cache = new Set(b.getValidEnumValues(this._def.values))), !this._cache.has(e.data)) {
      const n = b.objectValues(t);
      return u(r, {
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
je.create = (s, e) => new je({
  values: s,
  typeName: _.ZodNativeEnum,
  ...g(e)
});
class re extends v {
  unwrap() {
    return this._def.type;
  }
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    if (t.parsedType !== h.promise && t.common.async === !1)
      return u(t, {
        code: c.invalid_type,
        expected: h.promise,
        received: t.parsedType
      }), y;
    const r = t.parsedType === h.promise ? t.data : Promise.resolve(t.data);
    return E(r.then((n) => this._def.type.parseAsync(n, {
      path: t.path,
      errorMap: t.common.contextualErrorMap
    })));
  }
}
re.create = (s, e) => new re({
  type: s,
  typeName: _.ZodPromise,
  ...g(e)
});
class B extends v {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === _.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e), n = this._def.effect || null, i = {
      addIssue: (a) => {
        u(r, a), a.fatal ? t.abort() : t.dirty();
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
          const l = await this._def.schema._parseAsync({
            data: o,
            path: r.path,
            parent: r
          });
          return l.status === "aborted" ? y : l.status === "dirty" || t.value === "dirty" ? H(l.value) : l;
        });
      {
        if (t.value === "aborted")
          return y;
        const o = this._def.schema._parseSync({
          data: a,
          path: r.path,
          parent: r
        });
        return o.status === "aborted" ? y : o.status === "dirty" || t.value === "dirty" ? H(o.value) : o;
      }
    }
    if (n.type === "refinement") {
      const a = (o) => {
        const l = n.refinement(o, i);
        if (r.common.async)
          return Promise.resolve(l);
        if (l instanceof Promise)
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
        if (!z(a))
          return y;
        const o = n.transform(a.value, i);
        if (o instanceof Promise)
          throw new Error("Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.");
        return { status: t.value, value: o };
      } else
        return this._def.schema._parseAsync({ data: r.data, path: r.path, parent: r }).then((a) => z(a) ? Promise.resolve(n.transform(a.value, i)).then((o) => ({
          status: t.value,
          value: o
        })) : y);
    b.assertNever(n);
  }
}
B.create = (s, e, t) => new B({
  schema: s,
  typeName: _.ZodEffects,
  effect: e,
  ...g(t)
});
B.createWithPreprocess = (s, e, t) => new B({
  schema: e,
  effect: { type: "preprocess", transform: s },
  typeName: _.ZodEffects,
  ...g(t)
});
class j extends v {
  _parse(e) {
    return this._getType(e) === h.undefined ? E(void 0) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
j.create = (s, e) => new j({
  innerType: s,
  typeName: _.ZodOptional,
  ...g(e)
});
class W extends v {
  _parse(e) {
    return this._getType(e) === h.null ? E(null) : this._def.innerType._parse(e);
  }
  unwrap() {
    return this._def.innerType;
  }
}
W.create = (s, e) => new W({
  innerType: s,
  typeName: _.ZodNullable,
  ...g(e)
});
class fe extends v {
  _parse(e) {
    const { ctx: t } = this._processInputParams(e);
    let r = t.data;
    return t.parsedType === h.undefined && (r = this._def.defaultValue()), this._def.innerType._parse({
      data: r,
      path: t.path,
      parent: t
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
fe.create = (s, e) => new fe({
  innerType: s,
  typeName: _.ZodDefault,
  defaultValue: typeof e.default == "function" ? e.default : () => e.default,
  ...g(e)
});
class pe extends v {
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
    return Q(n) ? n.then((i) => ({
      status: "valid",
      value: i.status === "valid" ? i.value : this._def.catchValue({
        get error() {
          return new I(r.common.issues);
        },
        input: r.data
      })
    })) : {
      status: "valid",
      value: n.status === "valid" ? n.value : this._def.catchValue({
        get error() {
          return new I(r.common.issues);
        },
        input: r.data
      })
    };
  }
  removeCatch() {
    return this._def.innerType;
  }
}
pe.create = (s, e) => new pe({
  innerType: s,
  typeName: _.ZodCatch,
  catchValue: typeof e.catch == "function" ? e.catch : () => e.catch,
  ...g(e)
});
class Pe extends v {
  _parse(e) {
    if (this._getType(e) !== h.nan) {
      const r = this._getOrReturnCtx(e);
      return u(r, {
        code: c.invalid_type,
        expected: h.nan,
        received: r.parsedType
      }), y;
    }
    return { status: "valid", value: e.data };
  }
}
Pe.create = (s) => new Pe({
  typeName: _.ZodNaN,
  ...g(s)
});
class es extends v {
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
class ge extends v {
  _parse(e) {
    const { status: t, ctx: r } = this._processInputParams(e);
    if (r.common.async)
      return (async () => {
        const i = await this._def.in._parseAsync({
          data: r.data,
          path: r.path,
          parent: r
        });
        return i.status === "aborted" ? y : i.status === "dirty" ? (t.dirty(), H(i.value)) : this._def.out._parseAsync({
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
    return new ge({
      in: e,
      out: t,
      typeName: _.ZodPipeline
    });
  }
}
class me extends v {
  _parse(e) {
    const t = this._def.innerType._parse(e), r = (n) => (z(n) && (n.value = Object.freeze(n.value)), n);
    return Q(t) ? t.then((n) => r(n)) : r(t);
  }
  unwrap() {
    return this._def.innerType;
  }
}
me.create = (s, e) => new me({
  innerType: s,
  typeName: _.ZodReadonly,
  ...g(e)
});
var _;
(function(s) {
  s.ZodString = "ZodString", s.ZodNumber = "ZodNumber", s.ZodNaN = "ZodNaN", s.ZodBigInt = "ZodBigInt", s.ZodBoolean = "ZodBoolean", s.ZodDate = "ZodDate", s.ZodSymbol = "ZodSymbol", s.ZodUndefined = "ZodUndefined", s.ZodNull = "ZodNull", s.ZodAny = "ZodAny", s.ZodUnknown = "ZodUnknown", s.ZodNever = "ZodNever", s.ZodVoid = "ZodVoid", s.ZodArray = "ZodArray", s.ZodObject = "ZodObject", s.ZodUnion = "ZodUnion", s.ZodDiscriminatedUnion = "ZodDiscriminatedUnion", s.ZodIntersection = "ZodIntersection", s.ZodTuple = "ZodTuple", s.ZodRecord = "ZodRecord", s.ZodMap = "ZodMap", s.ZodSet = "ZodSet", s.ZodFunction = "ZodFunction", s.ZodLazy = "ZodLazy", s.ZodLiteral = "ZodLiteral", s.ZodEnum = "ZodEnum", s.ZodEffects = "ZodEffects", s.ZodNativeEnum = "ZodNativeEnum", s.ZodOptional = "ZodOptional", s.ZodNullable = "ZodNullable", s.ZodDefault = "ZodDefault", s.ZodCatch = "ZodCatch", s.ZodPromise = "ZodPromise", s.ZodBranded = "ZodBranded", s.ZodPipeline = "ZodPipeline", s.ZodReadonly = "ZodReadonly";
})(_ || (_ = {}));
const f = N.create, O = D.create, S = de.create, _e = le.create;
P.create;
const Y = R.create, C = w.create, vs = ee.create;
te.create;
$.create;
const ts = se.create, bs = he.create, ve = U.create;
re.create;
j.create;
W.create;
const F = Y(f()), be = ts(_e()), ss = C({ id: f(), label: f(), hint: f(), file: f().optional(), subscription: S(), format: ve(["json_object", "single_line", "text"]).optional() }), rs = C({ id: f(), title: f(), icon: f().optional(), credentials: Y(ss), endpoints: F }), ns = C({ protocol: f(), base_url: f(), model: f().optional() }), Fe = C({ memory: f(), cpus: f(), pids_limit: O().int(), gpus: f(), network: f(), extra_args: F, allows: F }), is = C({ ref: f(), label: f(), home: f(), dockerfile: f(), settings: Fe.optional() }), as = C({ label_bytes: O().int().positive(), secret_bytes: O().int().positive(), endpoint_url_bytes: O().int().positive(), endpoint_model_bytes: O().int().positive() }), xs = C({ agents: Y(rs), default_image: is, manage: S(), settings_path: f().optional(), account_limits: as.optional() }), ks = C({
  id: f(),
  agent: f(),
  label: f(),
  credential_kind: f(),
  subscription: S(),
  enabled: S(),
  endpoint: ns.optional(),
  owner: f(),
  mine: S(),
  usable: S(),
  unavailable_reason: f().optional(),
  writable: S(),
  deletable: S(),
  last_used_at: f(),
  cooldown_until: f(),
  last_error: f(),
  runs_day: O().int(),
  failures_day: O().int()
}), os = C({ id: f(), ref: f(), label: f(), home: f(), status: f(), agents: F, last_error: f(), owner: f(), writable: S(), deletable: S() }), ws = C({ image: os, build_log: f(), dockerfile: f().optional(), settings: Fe.optional() }), Cs = C({ id: f(), name: f(), writable: S(), deletable: S(), host_path: f().optional() }), cs = C({ name: f(), label: f(), description: f(), section: f(), group: f(), order: O(), type: f(), values: Y(_e()).optional(), schema: be.optional(), default: _e().optional(), profiles: F.optional() }), Ss = C({ id: f(), title: f(), icon: f(), capabilities: F, unattended: be.optional(), options: Y(cs) }), ds = C({ input_tokens: O().optional(), output_tokens: O().optional(), cached_tokens: O().optional() }), ls = ve(["queued", "running", "succeeded", "failed", "cancelled"]), Ts = C({
  id: f(),
  agent: f(),
  account_id: f(),
  image_id: f(),
  workspace_id: f().optional(),
  options: be,
  unattended: S(),
  repo_url: f(),
  prompt: f(),
  status: ls,
  result: f(),
  error: f(),
  usage: ds,
  cancel_requested: S(),
  timeout_ms: O(),
  workflow: S(),
  created_at: f(),
  started_at: f(),
  finished_at: f()
}), Os = C({ seq: O().int(), kind: ve(["assistant", "reasoning", "tool", "tool_result", "tool_error", "system", "error", "log"]), text: f(), created_at: f() });
export {
  gs as W,
  ms as a,
  _s as b,
  rs as c,
  as as d,
  S as e,
  ns as f,
  _e as g,
  vs as h,
  Ts as i,
  Y as j,
  Os as k,
  bs as l,
  Ss as m,
  O as n,
  C as o,
  os as p,
  ks as q,
  ts as r,
  f as s,
  ws as t,
  ys as u,
  xs as v,
  Cs as w
};
