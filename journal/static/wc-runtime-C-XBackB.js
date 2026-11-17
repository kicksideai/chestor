import { hasInjectionContext as Y, inject as T, effectScope as q, ref as w, markRaw as J, createApp as G, onMounted as Q, onUnmounted as X, watch as Z } from "vue";
import { addCollection as tt } from "@iconify/vue";
import { config as z, addIcons as et, on as st, applyThemeMode as V, host as it, hostCss as nt, loadCss as rt } from "@wippy-fe/proxy";
var I = "data-wippy-visible";
function x(t) {
  const e = t.getAttribute(I);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var ot = Object.defineProperty, U = (t) => {
  throw TypeError(t);
}, at = (t, e, s) => e in t ? ot(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, h = (t, e, s) => at(t, typeof e != "symbol" ? e + "" : e, s), $ = (t, e, s) => e.has(t) || U("Cannot " + s), lt = (t, e, s) => ($(t, e, "read from private field"), s ? s.call(t) : e.get(t)), ct = (t, e, s) => e.has(t) ? U("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, s), ut = (t, e, s, i) => ($(t, e, "write to private field"), e.set(t, s), s), ht = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], pt = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function k(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function dt(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const s of t)
    if (s)
      for (const [i, n] of Object.entries(s)) {
        if ((i === "@light" || i === "@dark") && n && typeof n == "object") {
          for (const [a, o] of Object.entries(n)) {
            const c = typeof o == "string" ? k(a) : null;
            c && e.add(c);
          }
          continue;
        }
        const r = typeof n == "string" ? k(i) : null;
        r && e.add(r);
      }
  return [...e].sort();
}
function ft(t) {
  if (t.length === 0)
    return "";
  const e = t.map((s) => `  ${s}: inherit;`).join(`
`);
  return `${pt} {
${e}
}`;
}
function _t(t, e) {
  const s = ft(e);
  s && D(t, s, "@wippy-fe/css-variables-bridge");
}
function mt(t, e) {
  const i = (e ?? ht).map(async (n) => {
    const r = nt[n];
    if (!r)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${n}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await rt(r);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${n}" (${r}):`, a), null;
    }
  });
  return Promise.all(i).then((n) => {
    for (const r of n) {
      if (!r)
        continue;
      const a = document.createElement("style");
      a.textContent = r, a.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(a);
    }
  });
}
function bt(t, e) {
  const s = document.createElement("style");
  s.textContent = e, t.appendChild(s);
}
function D(t, e, s) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const n = new CSSStyleSheet();
    n.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, n];
    return;
  }
  const i = document.createElement("style");
  i.setAttribute("role", s), i.textContent = e, t.appendChild(i);
}
function yt(t, e) {
  D(t, e, "@wippy-fe/custom-css");
}
function W(t) {
  return t.__wippyHost ?? null;
}
function vt(t) {
  return t.replace(/-([a-z])/g, (e, s) => s.toUpperCase());
}
function gt(t, e, s) {
  switch (s.type) {
    case "string":
      return { value: e };
    case "number": {
      const i = Number.parseFloat(e);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${t}: expected a number` } : { value: i };
    }
    case "integer": {
      const i = Number.parseInt(e, 10);
      return Number.isNaN(i) ? { value: void 0, error: `Invalid ${t}: expected an integer` } : { value: i };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const i = JSON.parse(e);
        return s.type === "array" && !Array.isArray(i) ? { value: void 0, error: `Invalid ${t}: expected a JSON array` } : { value: i };
      } catch {
        return { value: void 0, error: `Invalid ${t}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function L(t, e) {
  const s = {}, i = [];
  for (const [n, r] of Object.entries(e.properties)) {
    const a = t.getAttribute(n), o = vt(n);
    if (a === null) {
      r.default !== void 0 && (s[o] = r.default);
      continue;
    }
    const c = gt(n, a, r);
    c.error ? i.push(c.error) : s[o] = c.value;
  }
  return { props: s, errors: i };
}
var Ct = class {
  constructor(t, e) {
    h(this, "_props"), h(this, "_errors"), h(this, "_content"), h(this, "_hostVisibility"), h(this, "_propsListeners", /* @__PURE__ */ new Set()), h(this, "_contentListeners", /* @__PURE__ */ new Set()), h(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), h(this, "_disposed", !1), h(this, "_emitToDom"), h(this, "props"), h(this, "events"), h(this, "content"), h(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
    const s = this;
    this.props = {
      get value() {
        return s._props;
      },
      get errors() {
        return s._errors;
      },
      subscribe(i, n) {
        return s._subscribeProps(i, n);
      }
    }, this.events = {
      emit(i, n) {
        s._disposed || s._emitToDom(i, n);
      }
    }, this.content = t.hasContent ? {
      get value() {
        return s._content;
      },
      subscribe(i, n) {
        return s._subscribeContent(i, n);
      }
    } : null, this.hostVisibility = {
      get value() {
        return s._hostVisibility;
      },
      subscribe(i, n) {
        return s._subscribeHostVisibility(i, n);
      }
    };
  }
  /** @internal */
  notifyProps(t, e) {
    if (!this._disposed) {
      this._props = t, this._errors = e;
      for (const s of this._propsListeners)
        s(t, e);
    }
  }
  /** @internal */
  notifyContent(t) {
    if (!this._disposed) {
      this._content = t;
      for (const e of this._contentListeners)
        e(t);
    }
  }
  /** @internal */
  notifyHostVisibility(t, e) {
    if (!(this._disposed || t === e)) {
      this._hostVisibility = t;
      for (const s of this._hostVisibilityListeners)
        s(t, e);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(t), e?.immediate && t(this._props, this._errors);
    const s = () => {
      this._propsListeners.delete(t), e?.signal?.removeEventListener("abort", s);
    };
    return e?.signal?.addEventListener("abort", s, { once: !0 }), s;
  }
  _subscribeContent(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(t), e?.immediate && t(this._content);
    const s = () => {
      this._contentListeners.delete(t), e?.signal?.removeEventListener("abort", s);
    };
    return e?.signal?.addEventListener("abort", s, { once: !0 }), s;
  }
  _subscribeHostVisibility(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(t), e?.immediate && t(this._hostVisibility, this._hostVisibility);
    const s = () => {
      this._hostVisibilityListeners.delete(t), e?.signal?.removeEventListener("abort", s);
    };
    return e?.signal?.addEventListener("abort", s, { once: !0 }), s;
  }
}, R, St = class extends HTMLElement {
  constructor() {
    super(), h(this, "_internals"), h(this, "_contentObserver", null), h(this, "_initialized", !1), h(this, "_container", null), ct(this, R, null), h(this, "_attachment", 0), h(this, "_reactive", null), h(this, "_lastProps", null), h(this, "_lastErrors", []), h(this, "_lastContent", null), h(this, "_themeUnsub", null), h(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = x(this);
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
    const t = this.wippyConfig, e = Object.keys(t.propsSchema.properties), s = t.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...s, I])];
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
    return W(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(t, e) {
    this.dispatchEvent(new CustomEvent(t, {
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
      const t = this.constructor.wippyConfig, e = !!t.contentTemplate;
      let s, i;
      if (this._lastProps !== null)
        s = this._lastProps, i = this._lastErrors;
      else {
        const r = L(this, t.propsSchema);
        t.validateProps && r.errors.push(...t.validateProps(r.props)), s = r.props, i = r.errors, this._lastProps = s, this._lastErrors = i;
      }
      const n = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = n), this._reactive = new Ct(
        { props: s, errors: i, content: n, hasContent: e, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    const t = ++this._attachment;
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, s = this._initialized, i = lt(this, R) ?? ut(this, R, this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" }));
      let n;
      if (this._container)
        n = this._container;
      else {
        if (this.onInit(i), t !== this._attachment)
          return;
        e.inlineCss && bt(i, e.inlineCss);
        try {
          const _ = z?.theming, l = dt(
            _?.global?.cssVariables,
            _?.children?.cssVariables
          );
          _t(i, l);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const _ = z?.theming, l = [_?.global?.customCSS, _?.children?.customCSS].filter(Boolean).join(`
`);
            l && yt(i, l);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && mt(i, e.hostCssKeys), n = document.createElement("div"), n.setAttribute("data-wippy-theme-root", "");
        const p = e.containerClasses ?? [];
        p.length > 0 && n.classList.add(...p), i.appendChild(n), this._container = n, et(tt);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = st("@theme", (p) => this._applyTheme(p)));
      const { props: r, errors: a } = L(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(r));
      const o = r;
      this._lastProps = o, this._lastErrors = a;
      let c = null;
      if (e.contentTemplate && (c = this._extractContent(e.contentTemplate), this._lastContent = c, this._contentObserver = new MutationObserver(() => {
        const p = this._extractContent(e.contentTemplate);
        this._lastContent = p, this._reactive?.notifyContent(p), this.onContentChanged(p);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(i, n, o, a, c, s), t !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), s || (this._initialized = !0), this.onReady(), t === this._attachment && this.emitEvent("load");
    } catch (e) {
      if (t !== this._attachment || (this.onError(e), t !== this._attachment))
        return;
      this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
        message: e instanceof Error ? e.message : String(e),
        error: e
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
  _applyTheme(t = it.getThemeMode?.()) {
    V(t, this), this._container && V(t, this._container);
  }
  disconnectedCallback() {
    const t = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), V("auto", this), this._container && V("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), t === this._attachment && (this.emitEvent("unload"), t === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(t, e, s) {
    if (e === s)
      return;
    if (t === I) {
      const o = this._hostVisible, c = x(this);
      if (c === o)
        return;
      this._hostVisible = c, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(c, o), this.onHostVisibilityChanged(c, o));
      return;
    }
    const i = this.constructor.wippyConfig, { props: n, errors: r } = L(this, i.propsSchema);
    i.validateProps && r.push(...i.validateProps(n));
    const a = n;
    this._lastProps = a, this._lastErrors = r, this._reactive?.notifyProps(a, r), this.onPropsChanged(a, r);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(t) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(t) {
    console.error(`${this.constructor.name} initialization failed:`, t);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(t, e) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(t, e) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   *
   * A template keeps its children in one of two places. Parsed HTML (page
   * markup, `innerHTML`) puts them in `template.content`, a DocumentFragment.
   * DOM APIs add them as the template element's own child nodes and leave
   * `template.content` empty: that is how a Vue SFC sets
   * `<template data-type="...">{{ text }}</template>`. The content fragment is
   * read first, then the element's own children. Only text is returned, never
   * markup, in both cases.
   */
  _extractContent(t) {
    const e = this.querySelector(`template[data-type="${t}"]`);
    return e ? e.content.textContent?.trim() || e.textContent?.trim() || "" : null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(t) {
  }
};
R = /* @__PURE__ */ new WeakMap();
function wt(t) {
  return t.__wippyHostBus ?? null;
}
function Et(t) {
  return t.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let B;
const M = (t) => B = t, Vt = () => Y() && T(F) || B, F = (
  /* istanbul ignore next */
  Symbol()
);
function Pt() {
  const t = q(!0), e = t.run(() => w({}));
  let s = [], i = [];
  const n = J({
    install(r) {
      M(n), n._a = r, r.provide(F, n), r.config.globalProperties.$pinia = n, i.forEach((a) => s.push(a)), i = [];
    },
    use(r) {
      return this._a ? s.push(r) : i.push(r), this;
    },
    _p: s,
    _a: null,
    _e: t,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return n;
}
var Rt = Object.defineProperty, At = (t, e, s) => e in t ? Rt(t, e, { enumerable: !0, configurable: !0, writable: !0, value: s }) : t[e] = s, b = (t, e, s) => At(t, typeof e != "symbol" ? e + "" : e, s);
function $t(t, e) {
  return { lazyConfig: t, mountLifecycle: !0, lazyUi: e };
}
function H(t, e, s) {
  const i = t.createElement("div"), n = s ? e.failed : e.loading;
  i.dataset.lazyState = s ? "failed" : "loading", i.setAttribute("role", s ? "alert" : "status"), i.setAttribute("aria-label", n), i.style.cssText = "display:grid;place-items:center;text-align:center;";
  const r = e.surface === "page";
  if (i.style.cssText += r ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", s)
    i.style.color = "var(--p-danger-500, currentColor)", i.textContent = !r && e.iconOnly ? "⚠" : n, !r && e.iconOnly && (i.title = n);
  else {
    const a = t.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const o = t.createElement("span");
    o.dataset.wippySpinner = "", o.setAttribute("aria-hidden", "true"), o.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", o.style.fontSize = r ? "2rem" : "1em", i.append(a, o);
  }
  return i;
}
var Lt = /* @__PURE__ */ Symbol("wippy:emit"), j = /* @__PURE__ */ Symbol("wippy:props"), It = /* @__PURE__ */ Symbol("wippy:props_error"), Tt = /* @__PURE__ */ Symbol("wippy:content"), Ot = /* @__PURE__ */ Symbol("wippy:panel-id"), zt = /* @__PURE__ */ Symbol("wippy:layout-bus"), xt = /* @__PURE__ */ Symbol("wippy:host"), K = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Dt() {
  const t = T(j);
  if (!t)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return t;
}
function kt() {
  const t = T(K);
  if (!t)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return t;
}
function Wt(t) {
  const e = kt();
  let s = !1, i = null, n = !1;
  function r() {
    if (i)
      return n = !0, i;
    let a;
    try {
      a = Promise.resolve(t());
    } catch (c) {
      a = Promise.reject(c);
    }
    const o = a.finally(() => {
      if (i === o && (i = null, s && n))
        return n = !1, r();
    });
    return i = o, o;
  }
  return Q(() => (s = !0, r())), X(() => {
    s = !1, n = !1;
  }), Z(e, (a, o) => {
    if (s && o === !1 && a === !0)
      return r();
  }), e;
}
var P = /* @__PURE__ */ new WeakMap();
function N(t, e) {
  const s = P.get(t);
  if (s)
    return s;
  const i = Promise.resolve().then(e);
  return P.set(t, i), i.catch(() => {
    P.get(t) === i && P.delete(t);
  }), i;
}
var Bt = class extends St {
  constructor() {
    super(...arguments), b(this, "_vueApp", null), b(this, "_mountingApp", !1), b(this, "_mountState", "idle"), b(this, "_feedback", null), b(this, "_propsRef", w({})), b(this, "_errorsRef", w([])), b(this, "_contentRef", w(null)), b(this, "_hostVisibilityRef", w(null)), b(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  /** Prepare the implementation without creating a Vue or Pinia instance. */
  static async preloadImplementation() {
    const t = this.vueConfig;
    t.mountLifecycle && !t.rootComponent && t.lazyConfig && await N(this, t.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(t, e, s, i, n, r) {
    const a = this.constructor, o = a.vueConfig, c = new AbortController();
    this._bridgeAbort = c;
    const p = () => !c.signal.aborted && this._bridgeAbort === c;
    this._mountState = "mounting", this._propsRef.value = s, this._errorsRef.value = i, this._contentRef.value = n ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const l of i)
      if (this.emitEvent("invalid", { message: l }), !p())
        return;
    this.reactive.props.subscribe((l, d) => {
      this._propsRef.value = l, this._errorsRef.value = [...d];
      for (const u of d)
        this.emitEvent("invalid", { message: u });
    }, { signal: c.signal }), this.reactive.content && this.reactive.content.subscribe((l) => {
      this._contentRef.value = l;
    }, { signal: c.signal }), this.reactive.hostVisibility.subscribe((l) => {
      this._hostVisibilityRef.value = l;
    }, { signal: c.signal });
    const _ = (l) => {
      if (!p())
        return;
      const d = Vt(), u = G(l.rootComponent);
      let v = !1, y = !1, g, C;
      this._mountingApp = !0;
      try {
        const S = Pt();
        if (l.piniaPlugins)
          for (const m of l.piniaPlugins)
            S.use(m);
        u.use(S);
        for (const m of l.plugins ?? [])
          u.use(m);
        if (u.provide(j, this._propsRef), u.provide(It, this._errorsRef), u.provide(Lt, this.emitEvent.bind(this)), u.provide(Tt, this._contentRef), u.provide(K, this._hostVisibilityRef), u.provide(Ot, Et(this)), u.provide(zt, wt(this)), u.provide(xt, W(this)), l.providers?.(u, this), !p())
          return;
        if (C = u.config.errorHandler, o.mountLifecycle && (u.config.errorHandler = (m, O, f) => {
          y || (g = m), y = !0, C?.(m, O, f);
        }), u.mount(e), v = !0, y)
          throw g;
        p() && (this._vueApp = u);
      } finally {
        o.mountLifecycle && v && (u.config.errorHandler = C);
        try {
          v && (y || !p()) && u.unmount();
        } finally {
          M(d), this._mountingApp = !1;
        }
      }
      o.mountLifecycle && queueMicrotask(() => {
        p() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (o.rootComponent) {
      if (this._mountingApp && o.mountLifecycle) {
        queueMicrotask(() => {
          try {
            _(o);
          } catch (l) {
            p() && (this._mountState = "failed", this.emitEvent("error", { message: l instanceof Error ? l.message : String(l), error: l }));
          }
        });
        return;
      }
      try {
        _(o);
      } catch (l) {
        if (p())
          throw this._mountState = "failed", l;
      }
    } else if (o.lazyConfig) {
      const l = e.ownerDocument, d = o.lazyUi;
      d?.surface === "page" && (e.style.blockSize = "100%", e.style.minBlockSize = "0");
      let u = !1, v, y;
      const g = () => {
        clearTimeout(v), clearTimeout(y), this._feedback?.remove(), this._feedback = null;
      };
      c.signal.addEventListener("abort", g, { once: !0 });
      const C = () => {
        if (!p() || u)
          return;
        const f = d ? H(l, d, !1) : l.createElement("wippy-loading");
        f.setAttribute("no-bg", ""), this._feedback = f, e.appendChild(f);
      }, S = (f) => {
        if (!p())
          return;
        u = !0, g(), this._mountState = "failed";
        const A = d?.failed ?? (f instanceof Error ? f.message : String(f)), E = d ? H(l, d, !0) : l.createElement("wippy-error");
        d || (E.setAttribute("title", "Failed to load"), E.setAttribute("message", A)), this._feedback = E, e.appendChild(E), this.emitEvent("error", d ? { message: A, error: f } : { message: A });
      }, m = d?.delay ?? (d?.surface === "compact" ? 200 : 0);
      m > 0 ? v = setTimeout(C, m) : C(), d && (y = setTimeout(() => S(new Error("The component did not load in time.")), d.timeout ?? 3e4)), (o.mountLifecycle ? N(a, o.lazyConfig) : o.lazyConfig()).then((f) => {
        !p() || u || (u = !0, g(), _(f));
      }, (f) => {
        u || S(f);
      }).catch(S);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const t = this._vueApp;
    this._vueApp = null, t?.unmount();
  }
};
export {
  Bt as W,
  Wt as a,
  $t as l,
  Dt as u
};
//# sourceMappingURL=wc-runtime-C-XBackB.js.map
