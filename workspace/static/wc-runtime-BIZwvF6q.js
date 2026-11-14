import { hasInjectionContext as Cn, inject as Ye, effectScope as xn, ref as B, markRaw as kn, createApp as En, readonly as Ln, getCurrentInstance as et, onMounted as An, nextTick as jn, watch as de, reactive as Nn, renderSlot as Le, openBlock as Rn, createBlock as Vn, Teleport as Rt, createCommentVNode as Vt, useId as In, mergeProps as Ee, h as Dn } from "vue";
import { addCollection as Mn } from "@iconify/vue";
import { config as tt, addIcons as Un, on as Wn, applyThemeMode as Oe, host as Bn, hostCss as Hn, loadCss as Fn } from "@wippy-fe/proxy";
var Ue = "data-wippy-visible";
function nt(e) {
  const t = e.getAttribute(Ue);
  return t === "true" ? !0 : t === "false" ? !1 : null;
}
var zn = Object.defineProperty, Kn = (e, t, n) => t in e ? zn(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, x = (e, t, n) => Kn(e, typeof t != "symbol" ? t + "" : t, n), Yn = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Gn = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function rt(e) {
  const t = e.startsWith("--") ? e : `--${e}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(t) ? t : null;
}
function qn(...e) {
  const t = /* @__PURE__ */ new Set();
  for (const n of e)
    if (n)
      for (const [r, o] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && o && typeof o == "object") {
          for (const [l, s] of Object.entries(o)) {
            const i = typeof s == "string" ? rt(l) : null;
            i && t.add(i);
          }
          continue;
        }
        const a = typeof o == "string" ? rt(r) : null;
        a && t.add(a);
      }
  return [...t].sort();
}
function Qn(e) {
  if (e.length === 0)
    return "";
  const t = e.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Gn} {
${t}
}`;
}
function Jn(e, t) {
  const n = Qn(t);
  n && It(e, n, "@wippy-fe/css-variables-bridge");
}
function Zn(e, t) {
  const r = (t ?? Yn).map(async (o) => {
    const a = Hn[o];
    if (!a)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${o}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Fn(a);
    } catch (l) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${o}" (${a}):`, l), null;
    }
  });
  return Promise.all(r).then((o) => {
    for (const a of o) {
      if (!a)
        continue;
      const l = document.createElement("style");
      l.textContent = a, l.setAttribute("role", "@wippy-fe/host-css"), e.appendChild(l);
    }
  });
}
function Xn(e, t) {
  const n = document.createElement("style");
  n.textContent = t, e.appendChild(n);
}
function It(e, t, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const o = new CSSStyleSheet();
    o.replaceSync(t), e.adoptedStyleSheets = [...e.adoptedStyleSheets, o];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = t, e.appendChild(r);
}
function er(e, t) {
  It(e, t, "@wippy-fe/custom-css");
}
function Dt(e) {
  return e.__wippyHost ?? null;
}
function tr(e) {
  return e.replace(/-([a-z])/g, (t, n) => n.toUpperCase());
}
function nr(e, t, n) {
  switch (n.type) {
    case "string":
      return { value: t };
    case "number": {
      const r = Number.parseFloat(t);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(t, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${e}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: t !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(t);
        return n.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${e}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${e}: must be valid JSON` };
      }
    default:
      return { value: t };
  }
}
function Ve(e, t) {
  const n = {}, r = [];
  for (const [o, a] of Object.entries(t.properties)) {
    const l = e.getAttribute(o), s = tr(o);
    if (l === null) {
      a.default !== void 0 && (n[s] = a.default);
      continue;
    }
    const i = nr(o, l, a);
    i.error ? r.push(i.error) : n[s] = i.value;
  }
  return { props: n, errors: r };
}
var rr = class {
  constructor(e, t) {
    x(this, "_props"), x(this, "_errors"), x(this, "_content"), x(this, "_hostVisibility"), x(this, "_propsListeners", /* @__PURE__ */ new Set()), x(this, "_contentListeners", /* @__PURE__ */ new Set()), x(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), x(this, "_disposed", !1), x(this, "_emitToDom"), x(this, "props"), x(this, "events"), x(this, "content"), x(this, "hostVisibility"), this._props = e.props, this._errors = e.errors, this._content = e.content, this._hostVisibility = e.hostVisibility, this._emitToDom = t;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(r, o) {
        return n._subscribeProps(r, o);
      }
    }, this.events = {
      emit(r, o) {
        n._disposed || n._emitToDom(r, o);
      }
    }, this.content = e.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(r, o) {
        return n._subscribeContent(r, o);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(r, o) {
        return n._subscribeHostVisibility(r, o);
      }
    };
  }
  /** @internal */
  notifyProps(e, t) {
    if (!this._disposed) {
      this._props = e, this._errors = t;
      for (const n of this._propsListeners)
        n(e, t);
    }
  }
  /** @internal */
  notifyContent(e) {
    if (!this._disposed) {
      this._content = e;
      for (const t of this._contentListeners)
        t(e);
    }
  }
  /** @internal */
  notifyHostVisibility(e, t) {
    if (!(this._disposed || e === t)) {
      this._hostVisibility = e;
      for (const n of this._hostVisibilityListeners)
        n(e, t);
    }
  }
  /** @internal */
  dispose() {
    this._disposed || (this._disposed = !0, this._propsListeners.clear(), this._contentListeners.clear(), this._hostVisibilityListeners.clear());
  }
  _subscribeProps(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._propsListeners.add(e), t?.immediate && e(this._props, this._errors);
    const n = () => {
      this._propsListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(e), t?.immediate && e(this._content);
    const n = () => {
      this._contentListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(e, t) {
    if (this._disposed || t?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(e), t?.immediate && e(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(e), t?.signal?.removeEventListener("abort", n);
    };
    return t?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, or = class extends HTMLElement {
  constructor() {
    super(), x(this, "_internals"), x(this, "_contentObserver", null), x(this, "_initialized", !1), x(this, "_container", null), x(this, "_reactive", null), x(this, "_lastProps", null), x(this, "_lastErrors", []), x(this, "_lastContent", null), x(this, "_themeUnsub", null), x(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = nt(this);
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
    const e = this.wippyConfig, t = Object.keys(e.propsSchema.properties), n = e.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...t, ...n, Ue])];
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
    return Dt(this);
  }
  /**
   * Emit a CustomEvent that bubbles and crosses shadow DOM boundaries.
   */
  emitEvent(e, t) {
    this.dispatchEvent(new CustomEvent(e, {
      bubbles: !0,
      composed: !0,
      detail: t
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
      const e = this.constructor.wippyConfig, t = !!e.contentTemplate;
      let n, r;
      if (this._lastProps !== null)
        n = this._lastProps, r = this._lastErrors;
      else {
        const a = Ve(this, e.propsSchema);
        e.validateProps && a.errors.push(...e.validateProps(a.props)), n = a.props, r = a.errors, this._lastProps = n, this._lastErrors = r;
      }
      const o = t ? this._lastContent ?? this._extractContent(e.contentTemplate) : null;
      t && this._lastContent === null && (this._lastContent = o), this._reactive = new rr(
        { props: n, errors: r, content: o, hasContent: t, hostVisibility: this._hostVisible },
        this.emitEvent.bind(this)
      );
    }
    return this._reactive;
  }
  // ── Lifecycle ──────────────────────────────────────────────
  connectedCallback() {
    this._internals.states.add("loading");
    try {
      const e = this.constructor.wippyConfig, t = this._initialized, n = this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" });
      let r;
      if (t)
        r = this._container;
      else {
        this.onInit(n), e.inlineCss && Xn(n, e.inlineCss);
        try {
          const u = tt?.theming, c = qn(
            u?.global?.cssVariables,
            u?.children?.cssVariables
          );
          Jn(n, c);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const u = tt?.theming, c = [u?.global?.customCSS, u?.children?.customCSS].filter(Boolean).join(`
`);
            c && er(n, c);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Zn(n, e.hostCssKeys), r = document.createElement("div"), r.setAttribute("data-wippy-theme-root", "");
        const i = e.containerClasses ?? [];
        i.length > 0 && r.classList.add(...i), n.appendChild(r), this._container = r, Un(Mn);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Wn("@theme", (i) => this._applyTheme(i)));
      const { props: o, errors: a } = Ve(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(o));
      const l = o;
      this._lastProps = l, this._lastErrors = a;
      let s = null;
      e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const i = this._extractContent(e.contentTemplate);
        this._lastContent = i, this._reactive?.notifyContent(i), this.onContentChanged(i);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(n, r, l, a, s, t), this._internals.states.delete("loading"), this._internals.states.add("ready"), t || (this._initialized = !0), this.onReady(), this.emitEvent("load");
    } catch (e) {
      this.onError(e), this._internals.states.delete("loading"), this._internals.states.add("error"), this.emitEvent("error", {
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
  _applyTheme(e = Bn.getThemeMode?.()) {
    Oe(e, this), this._container && Oe(e, this._container);
  }
  disconnectedCallback() {
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Oe("auto", this), this._container && Oe("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), this.emitEvent("unload"), this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus;
  }
  attributeChangedCallback(e, t, n) {
    if (t === n)
      return;
    if (e === Ue) {
      const s = this._hostVisible, i = nt(this);
      if (i === s)
        return;
      this._hostVisible = i, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(i, s), this.onHostVisibilityChanged(i, s));
      return;
    }
    const r = this.constructor.wippyConfig, { props: o, errors: a } = Ve(this, r.propsSchema);
    r.validateProps && a.push(...r.validateProps(o));
    const l = o;
    this._lastProps = l, this._lastErrors = a, this._reactive?.notifyProps(l, a), this.onPropsChanged(l, a);
  }
  // ── Hooks ──────────────────────────────────────────────────
  /** Called right after shadow DOM is attached, before CSS or container. */
  onInit(e) {
  }
  /** Called after internals state is set to ready, before the `load` event. */
  onReady() {
  }
  /** Called when connectedCallback throws. Default logs to console. */
  onError(e) {
    console.error(`${this.constructor.name} initialization failed:`, e);
  }
  /** Called when observed attributes change. Override to update framework state. */
  onPropsChanged(e, t) {
  }
  /**
   * Called when the host changes logical activity. `null` means unmanaged.
   * This does not imply a DOM remount or a CSS/viewport visibility change.
   */
  onHostVisibilityChanged(e, t) {
  }
  /**
   * Extract text from a child `<template data-type="...">` element.
   * Uses `.content.textContent` since `<template>` stores content in a DocumentFragment.
   */
  _extractContent(e) {
    return this.querySelector(`template[data-type="${e}"]`)?.content.textContent?.trim() ?? null;
  }
  /** Called when child `<template>` content changes. Override to update framework state. */
  onContentChanged(e) {
  }
};
function ir(e) {
  return e.__wippyHostBus ?? null;
}
function sr(e) {
  return e.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v4.0.3
 * (c) 2026 Eduardo San Martin Morote
 * @license MIT
 */
let Mt;
const Ut = (e) => Mt = e, ar = () => Cn() && Ye(Wt) || Mt, Wt = (
  /* istanbul ignore next */
  Symbol()
);
function lr() {
  const e = xn(!0), t = e.run(() => B({}));
  let n = [], r = [];
  const o = kn({
    install(a) {
      Ut(o), o._a = a, a.provide(Wt, o), a.config.globalProperties.$pinia = o, r.forEach((l) => n.push(l)), r = [];
    },
    use(a) {
      return this._a ? n.push(a) : r.push(a), this;
    },
    _p: n,
    _a: null,
    _e: e,
    _s: /* @__PURE__ */ new Map(),
    state: t
  });
  return o;
}
var ur = Object.defineProperty, cr = (e, t, n) => t in e ? ur(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, ae = (e, t, n) => cr(e, typeof t != "symbol" ? t + "" : t, n), Bt = /* @__PURE__ */ Symbol("wippy:emit"), Ht = /* @__PURE__ */ Symbol("wippy:props"), dr = /* @__PURE__ */ Symbol("wippy:props_error"), mr = /* @__PURE__ */ Symbol("wippy:content"), pr = /* @__PURE__ */ Symbol("wippy:panel-id"), fr = /* @__PURE__ */ Symbol("wippy:layout-bus"), hr = /* @__PURE__ */ Symbol("wippy:host"), vr = /* @__PURE__ */ Symbol("wippy:host-visibility");
function pi() {
  const e = Ye(Ht);
  if (!e)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return e;
}
function fi() {
  const e = Ye(Bt);
  if (!e)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return e;
}
var hi = class extends or {
  constructor() {
    super(...arguments), ae(this, "_vueApp", null), ae(this, "_propsRef", B({})), ae(this, "_errorsRef", B([])), ae(this, "_contentRef", B(null)), ae(this, "_hostVisibilityRef", B(null)), ae(this, "_bridgeAbort", null);
  }
  /**
   * Override to provide Vue-specific configuration.
   */
  static get vueConfig() {
    throw new Error("WippyVueElement subclass must override static get vueConfig()");
  }
  onMount(e, t, n, r, o, a) {
    const l = this.constructor.vueConfig;
    this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = o ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const u of r)
      this.emitEvent("invalid", { message: u });
    const s = new AbortController();
    this._bridgeAbort = s, this.reactive.props.subscribe((u, c) => {
      this._propsRef.value = u, this._errorsRef.value = [...c];
      for (const d of c)
        this.emitEvent("invalid", { message: d });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((u) => {
      this._contentRef.value = u;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((u) => {
      this._hostVisibilityRef.value = u;
    }, { signal: s.signal });
    const i = (u) => {
      if (s.signal.aborted)
        return;
      const c = ar(), d = En(u.rootComponent);
      this._vueApp = d;
      const m = lr();
      if (u.piniaPlugins)
        for (const p of u.piniaPlugins)
          m.use(p);
      if (d.use(m), u.plugins)
        for (const p of u.plugins)
          d.use(p);
      d.provide(Ht, this._propsRef), d.provide(dr, this._errorsRef), d.provide(Bt, this.emitEvent.bind(this)), d.provide(mr, this._contentRef), d.provide(vr, this._hostVisibilityRef), d.provide(pr, sr(this)), d.provide(fr, ir(this)), d.provide(hr, Dt(this)), u.providers && u.providers(d, this), d.mount(t), c && Ut(c);
    };
    if (l.rootComponent)
      i(l);
    else if (l.lazyConfig) {
      const u = document.createElement("wippy-loading");
      u.setAttribute("no-bg", ""), t.appendChild(u), l.lazyConfig().then((c) => {
        s.signal.aborted || (u.remove(), i(c));
      }).catch((c) => {
        if (s.signal.aborted)
          return;
        const d = c instanceof Error ? c.message : String(c), m = document.createElement("wippy-error");
        m.setAttribute("title", "Failed to load"), m.setAttribute("message", d), u.replaceWith(m), this.emitEvent("error", { message: d });
      });
    } else
      throw new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._vueApp && (this._vueApp.unmount(), this._vueApp = null);
  }
}, gr = Object.defineProperty, ot = Object.getOwnPropertySymbols, yr = Object.prototype.hasOwnProperty, br = Object.prototype.propertyIsEnumerable, it = (e, t, n) => t in e ? gr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, _r = (e, t) => {
  for (var n in t || (t = {})) yr.call(t, n) && it(e, n, t[n]);
  if (ot) for (var n of ot(t)) br.call(t, n) && it(e, n, t[n]);
  return e;
};
function $e(e) {
  return e == null || e === "" || Array.isArray(e) && e.length === 0 || !(e instanceof Date) && typeof e == "object" && Object.keys(e).length === 0;
}
function Ge(e) {
  return typeof e == "function" && "call" in e && "apply" in e;
}
function C(e) {
  return !$e(e);
}
function M(e, t = !0) {
  return e instanceof Object && e.constructor === Object && (t || Object.keys(e).length !== 0);
}
function Ft(e = {}, t = {}) {
  let n = _r({}, e);
  return Object.keys(t).forEach((r) => {
    let o = r;
    M(t[o]) && o in e && M(e[o]) ? n[o] = Ft(e[o], t[o]) : n[o] = t[o];
  }), n;
}
function Sr(...e) {
  return e.reduce((t, n, r) => r === 0 ? n : Ft(t, n), {});
}
function j(e, ...t) {
  return Ge(e) ? e(...t) : e;
}
function A(e, t = !0) {
  return typeof e == "string" && (t || e !== "");
}
function D(e) {
  return A(e) ? e.replace(/(-|_)/g, "").toLowerCase() : e;
}
function qe(e, t = "", n = {}) {
  let r = D(t).split("."), o = r.shift();
  if (o) {
    if (M(e)) {
      let a = Object.keys(e).find((l) => D(l) === o) || "";
      return qe(j(e[a], n), r.join("."), n);
    }
    return;
  }
  return j(e, n);
}
function zt(e, t = !0) {
  return Array.isArray(e) && (t || e.length !== 0);
}
function $r(e) {
  return C(e) && !isNaN(e);
}
function te(e, t) {
  if (t) {
    let n = t.test(e);
    return t.lastIndex = 0, n;
  }
  return !1;
}
function wr(...e) {
  return Sr(...e);
}
function pe(e) {
  return e && e.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function Pr(e) {
  return A(e, !1) ? e[0].toUpperCase() + e.slice(1) : e;
}
function Kt(e) {
  return A(e) ? e.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : e;
}
function Yt() {
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
function Or(...e) {
  if (e) {
    let t = [];
    for (let n = 0; n < e.length; n++) {
      let r = e[n];
      if (!r) continue;
      let o = typeof r;
      if (o === "string" || o === "number") t.push(r);
      else if (o === "object") {
        let a = Array.isArray(r) ? [Or(...r)] : Object.entries(r).map(([l, s]) => s ? l : void 0);
        t = a.length ? t.concat(a.filter((l) => !!l)) : t;
      }
    }
    return t.join(" ").trim();
  }
}
function Tr(e, t) {
  return e ? e.classList ? e.classList.contains(t) : new RegExp("(^| )" + t + "( |$)", "gi").test(e.className) : !1;
}
function Cr(e, t) {
  if (e && t) {
    let n = (r) => {
      Tr(e, r) || (e.classList ? e.classList.add(r) : e.className += " " + r);
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Ie(e, t) {
  if (e && t) {
    let n = (r) => {
      e.classList ? e.classList.remove(r) : e.className = e.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [t].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function st(e) {
  return e ? Math.abs(e.scrollLeft) : 0;
}
function xr(e, t) {
  return e instanceof HTMLElement ? e.offsetWidth : 0;
}
function kr(e) {
  if (e) {
    let t = e.parentNode;
    return t && t instanceof ShadowRoot && t.host && (t = t.host), t;
  }
  return null;
}
function Er(e) {
  return !!(e !== null && typeof e < "u" && e.nodeName && kr(e));
}
function we(e) {
  return typeof Element < "u" ? e instanceof Element : e !== null && typeof e == "object" && e.nodeType === 1 && typeof e.nodeName == "string";
}
function Ae(e, t = {}) {
  if (we(e)) {
    let n = (r, o) => {
      var a, l;
      let s = (a = e?.$attrs) != null && a[r] ? [(l = e?.$attrs) == null ? void 0 : l[r]] : [];
      return [o].flat().reduce((i, u) => {
        if (u != null) {
          let c = typeof u;
          if (c === "string" || c === "number") i.push(u);
          else if (c === "object") {
            let d = Array.isArray(u) ? n(r, u) : Object.entries(u).map(([m, p]) => r === "style" && (p || p === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${p}` : p ? m : void 0);
            i = d.length ? i.concat(d.filter((m) => !!m)) : i;
          }
        }
        return i;
      }, s);
    };
    Object.entries(t).forEach(([r, o]) => {
      if (o != null) {
        let a = r.match(/^on(.+)/);
        a ? e.addEventListener(a[1].toLowerCase(), o) : r === "p-bind" || r === "pBind" ? Ae(e, o) : (o = r === "class" ? [...new Set(n("class", o))].join(" ").trim() : r === "style" ? n("style", o).join(";").trim() : o, (e.$attrs = e.$attrs || {}) && (e.$attrs[r] = o), e.setAttribute(r, o));
      }
    });
  }
}
function Lr(e, t = {}, ...n) {
  {
    let r = document.createElement(e);
    return Ae(r, t), r.append(...n), r;
  }
}
function Ar(e, t) {
  return we(e) ? e.matches(t) ? e : e.querySelector(t) : null;
}
function jr(e, t) {
  if (we(e)) {
    let n = e.getAttribute(t);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function at(e) {
  if (e) {
    let t = e.offsetHeight, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), t;
  }
  return 0;
}
function Nr(e) {
  if (e) {
    let t = e.getBoundingClientRect();
    return { top: t.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: t.left + (window.pageXOffset || st(document.documentElement) || st(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Rr(e, t) {
  return e ? e.offsetHeight : 0;
}
function lt(e) {
  if (e) {
    let t = e.offsetWidth, n = getComputedStyle(e);
    return t -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), t;
  }
  return 0;
}
function Gt() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function Vr(e, t = "", n) {
  we(e) && n !== null && n !== void 0 && e.setAttribute(t, n);
}
var Te = {};
function Ir(e = "pui_id_") {
  return Object.hasOwn(Te, e) || (Te[e] = 0), Te[e]++, `${e}${Te[e]}`;
}
var Dr = Object.defineProperty, Mr = Object.defineProperties, Ur = Object.getOwnPropertyDescriptors, je = Object.getOwnPropertySymbols, qt = Object.prototype.hasOwnProperty, Qt = Object.prototype.propertyIsEnumerable, ut = (e, t, n) => t in e ? Dr(e, t, { enumerable: !0, configurable: !0, writable: !0, value: n }) : e[t] = n, V = (e, t) => {
  for (var n in t || (t = {})) qt.call(t, n) && ut(e, n, t[n]);
  if (je) for (var n of je(t)) Qt.call(t, n) && ut(e, n, t[n]);
  return e;
}, De = (e, t) => Mr(e, Ur(t)), W = (e, t) => {
  var n = {};
  for (var r in e) qt.call(e, r) && t.indexOf(r) < 0 && (n[r] = e[r]);
  if (e != null && je) for (var r of je(e)) t.indexOf(r) < 0 && Qt.call(e, r) && (n[r] = e[r]);
  return n;
}, Wr = Yt(), E = Wr, fe = /{([^}]*)}/g, Jt = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Zt = /var\([^)]+\)/g;
function ct(e) {
  return A(e) ? e.replace(/[A-Z]/g, (t, n) => n === 0 ? t : "." + t.toLowerCase()).toLowerCase() : e;
}
function Br(e) {
  return M(e) && e.hasOwnProperty("$value") && e.hasOwnProperty("$type") ? e.$value : e;
}
function Hr(e) {
  return e.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function We(e = "", t = "") {
  return Hr(`${A(e, !1) && A(t, !1) ? `${e}-` : e}${t}`);
}
function Xt(e = "", t = "") {
  return `--${We(e, t)}`;
}
function Fr(e = "") {
  let t = (e.match(/{/g) || []).length, n = (e.match(/}/g) || []).length;
  return (t + n) % 2 !== 0;
}
function en(e, t = "", n = "", r = [], o) {
  if (A(e)) {
    let a = e.trim();
    if (Fr(a)) return;
    if (te(a, fe)) {
      let l = a.replaceAll(fe, (s) => {
        let i = s.replace(/{|}/g, "").split(".").filter((u) => !r.some((c) => te(u, c)));
        return `var(${Xt(n, Kt(i.join("-")))}${C(o) ? `, ${o}` : ""})`;
      });
      return te(l.replace(Zt, "0"), Jt) ? `calc(${l})` : l;
    }
    return a;
  } else if ($r(e)) return e;
}
function zr(e, t, n) {
  A(t, !1) && e.push(`${t}:${n};`);
}
function le(e, t) {
  return e ? `${e}{${t}}` : "";
}
function tn(e, t) {
  if (e.indexOf("dt(") === -1) return e;
  function n(l, s) {
    let i = [], u = 0, c = "", d = null, m = 0;
    for (; u <= l.length; ) {
      let p = l[u];
      if ((p === '"' || p === "'" || p === "`") && l[u - 1] !== "\\" && (d = d === p ? null : p), !d && (p === "(" && m++, p === ")" && m--, (p === "," || u === l.length) && m === 0)) {
        let h = c.trim();
        h.startsWith("dt(") ? i.push(tn(h, s)) : i.push(r(h)), c = "", u++;
        continue;
      }
      p !== void 0 && (c += p), u++;
    }
    return i;
  }
  function r(l) {
    let s = l[0];
    if ((s === '"' || s === "'" || s === "`") && l[l.length - 1] === s) return l.slice(1, -1);
    let i = Number(l);
    return isNaN(i) ? l : i;
  }
  let o = [], a = [];
  for (let l = 0; l < e.length; l++) if (e[l] === "d" && e.slice(l, l + 3) === "dt(") a.push(l), l += 2;
  else if (e[l] === ")" && a.length > 0) {
    let s = a.pop();
    a.length === 0 && o.push([s, l]);
  }
  if (!o.length) return e;
  for (let l = o.length - 1; l >= 0; l--) {
    let [s, i] = o[l], u = e.slice(s + 3, i), c = n(u, t), d = t(...c);
    e = e.slice(0, s) + d + e.slice(i + 1);
  }
  return e;
}
var ne = (...e) => Kr(P.getTheme(), ...e), Kr = (e = {}, t, n, r) => {
  if (t) {
    let { variable: o, options: a } = P.defaults || {}, { prefix: l, transform: s } = e?.options || a || {}, i = te(t, fe) ? t : `{${t}}`;
    return r === "value" || $e(r) && s === "strict" ? P.getTokenValue(t) : en(i, void 0, l, [o.excludedKeyRegex], n);
  }
  return "";
};
function Ce(e, ...t) {
  if (e instanceof Array) {
    let n = e.reduce((r, o, a) => {
      var l;
      return r + o + ((l = j(t[a], { dt: ne })) != null ? l : "");
    }, "");
    return tn(n, ne);
  }
  return j(e, { dt: ne });
}
function Yr(e, t = {}) {
  let n = P.defaults.variable, { prefix: r = n.prefix, selector: o = n.selector, excludedKeyRegex: a = n.excludedKeyRegex } = t, l = [], s = [], i = [{ node: e, path: r }];
  for (; i.length; ) {
    let { node: c, path: d } = i.pop();
    for (let m in c) {
      let p = c[m], h = Br(p), g = te(m, a) ? We(d) : We(d, Kt(m));
      if (M(h)) i.push({ node: h, path: g });
      else {
        let v = Xt(g), y = en(h, g, r, [a]);
        zr(s, v, y);
        let $ = g;
        r && $.startsWith(r + "-") && ($ = $.slice(r.length + 1)), l.push($.replace(/-/g, "."));
      }
    }
  }
  let u = s.join("");
  return { value: s, tokens: l, declarations: u, css: le(o, u) };
}
var R = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(e) {
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
  return Yr(e, { prefix: t?.prefix });
}, getCommon({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a, l, s, i, u, c, d;
  let { preset: m, options: p } = t, h, g, v, y, $, O, f;
  if (C(m) && p.transform !== "strict") {
    let { primitive: _, semantic: k, extend: N } = m, H = k || {}, { colorScheme: F } = H, q = W(H, ["colorScheme"]), z = N || {}, { colorScheme: Q } = z, J = W(z, ["colorScheme"]), K = F || {}, { dark: Z } = K, re = W(K, ["dark"]), X = Q || {}, { dark: oe } = X, ie = W(X, ["dark"]), U = C(_) ? this._toVariables({ primitive: _ }, p) : {}, I = C(q) ? this._toVariables({ semantic: q }, p) : {}, ee = C(re) ? this._toVariables({ light: re }, p) : {}, Pe = C(Z) ? this._toVariables({ dark: Z }, p) : {}, se = C(J) ? this._toVariables({ semantic: J }, p) : {}, Ze = C(ie) ? this._toVariables({ light: ie }, p) : {}, Xe = C(oe) ? this._toVariables({ dark: oe }, p) : {}, [un, cn] = [(a = U.declarations) != null ? a : "", U.tokens], [dn, mn] = [(l = I.declarations) != null ? l : "", I.tokens || []], [pn, fn] = [(s = ee.declarations) != null ? s : "", ee.tokens || []], [hn, vn] = [(i = Pe.declarations) != null ? i : "", Pe.tokens || []], [gn, yn] = [(u = se.declarations) != null ? u : "", se.tokens || []], [bn, _n] = [(c = Ze.declarations) != null ? c : "", Ze.tokens || []], [Sn, $n] = [(d = Xe.declarations) != null ? d : "", Xe.tokens || []];
    h = this.transformCSS(e, un, "light", "variable", p, r, o), g = cn;
    let wn = this.transformCSS(e, `${dn}${pn}`, "light", "variable", p, r, o), Pn = this.transformCSS(e, `${hn}`, "dark", "variable", p, r, o);
    v = `${wn}${Pn}`, y = [.../* @__PURE__ */ new Set([...mn, ...fn, ...vn])];
    let On = this.transformCSS(e, `${gn}${bn}color-scheme:light`, "light", "variable", p, r, o), Tn = this.transformCSS(e, `${Sn}color-scheme:dark`, "dark", "variable", p, r, o);
    $ = `${On}${Tn}`, O = [.../* @__PURE__ */ new Set([...yn, ..._n, ...$n])], f = j(m.css, { dt: ne });
  }
  return { primitive: { css: h, tokens: g }, semantic: { css: v, tokens: y }, global: { css: $, tokens: O }, style: f };
}, getPreset({ name: e = "", preset: t = {}, options: n, params: r, set: o, defaults: a, selector: l }) {
  var s, i, u;
  let c, d, m;
  if (C(t) && n.transform !== "strict") {
    let p = e.replace("-directive", ""), h = t, { colorScheme: g, extend: v, css: y } = h, $ = W(h, ["colorScheme", "extend", "css"]), O = v || {}, { colorScheme: f } = O, _ = W(O, ["colorScheme"]), k = g || {}, { dark: N } = k, H = W(k, ["dark"]), F = f || {}, { dark: q } = F, z = W(F, ["dark"]), Q = C($) ? this._toVariables({ [p]: V(V({}, $), _) }, n) : {}, J = C(H) ? this._toVariables({ [p]: V(V({}, H), z) }, n) : {}, K = C(N) ? this._toVariables({ [p]: V(V({}, N), q) }, n) : {}, [Z, re] = [(s = Q.declarations) != null ? s : "", Q.tokens || []], [X, oe] = [(i = J.declarations) != null ? i : "", J.tokens || []], [ie, U] = [(u = K.declarations) != null ? u : "", K.tokens || []], I = this.transformCSS(p, `${Z}${X}`, "light", "variable", n, o, a, l), ee = this.transformCSS(p, ie, "dark", "variable", n, o, a, l);
    c = `${I}${ee}`, d = [.../* @__PURE__ */ new Set([...re, ...oe, ...U])], m = j(y, { dt: ne });
  }
  return { css: c, tokens: d, style: m };
}, getPresetC({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a;
  let { preset: l, options: s } = t, i = (a = l?.components) == null ? void 0 : a[e];
  return this.getPreset({ name: e, preset: i, options: s, params: n, set: r, defaults: o });
}, getPresetD({ name: e = "", theme: t = {}, params: n, set: r, defaults: o }) {
  var a, l;
  let s = e.replace("-directive", ""), { preset: i, options: u } = t, c = ((a = i?.components) == null ? void 0 : a[s]) || ((l = i?.directives) == null ? void 0 : l[s]);
  return this.getPreset({ name: s, preset: c, options: u, params: n, set: r, defaults: o });
}, applyDarkColorScheme(e) {
  return !(e.darkModeSelector === "none" || e.darkModeSelector === !1);
}, getColorSchemeOption(e, t) {
  var n;
  return this.applyDarkColorScheme(e) ? this.regex.resolve(e.darkModeSelector === !0 ? t.options.darkModeSelector : (n = e.darkModeSelector) != null ? n : t.options.darkModeSelector) : [];
}, getLayerOrder(e, t = {}, n, r) {
  let { cssLayer: o } = t;
  return o ? `@layer ${j(o.order || o.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: a }) {
  let l = this.getCommon({ name: e, theme: t, params: n, set: o, defaults: a }), s = Object.entries(r).reduce((i, [u, c]) => i.push(`${u}="${c}"`) && i, []).join(" ");
  return Object.entries(l || {}).reduce((i, [u, c]) => {
    if (M(c) && Object.hasOwn(c, "css")) {
      let d = pe(c.css), m = `${u}-variables`;
      i.push(`<style type="text/css" data-primevue-style-id="${m}" ${s}>${d}</style>`);
    }
    return i;
  }, []).join("");
}, getStyleSheet({ name: e = "", theme: t = {}, params: n, props: r = {}, set: o, defaults: a }) {
  var l;
  let s = { name: e, theme: t, params: n, set: o, defaults: a }, i = (l = e.includes("-directive") ? this.getPresetD(s) : this.getPresetC(s)) == null ? void 0 : l.css, u = Object.entries(r).reduce((c, [d, m]) => c.push(`${d}="${m}"`) && c, []).join(" ");
  return i ? `<style type="text/css" data-primevue-style-id="${e}-variables" ${u}>${pe(i)}</style>` : "";
}, createTokens(e = {}, t, n = "", r = "", o = {}) {
  let a = function(s, i = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: s, path: this.path, paths: i, value: void 0 };
    u.push(this.path), i.name = this.path, i.binding || (i.binding = {});
    let c = this.value;
    if (typeof this.value == "string" && fe.test(this.value)) {
      let d = this.value.trim().replace(fe, (m) => {
        var p;
        let h = m.slice(1, -1), g = this.tokens[h];
        if (!g) return console.warn(`Token not found for path: ${h}`), "__UNRESOLVED__";
        let v = g.computed(s, i, u);
        return Array.isArray(v) && v.length === 2 ? `light-dark(${v[0].value},${v[1].value})` : (p = v?.value) != null ? p : "__UNRESOLVED__";
      });
      c = Jt.test(d.replace(Zt, "0")) ? `calc(${d})` : d;
    }
    return $e(i.binding) && delete i.binding, u.pop(), { colorScheme: s, path: this.path, paths: i, value: c.includes("__UNRESOLVED__") ? void 0 : c };
  }, l = (s, i, u) => {
    Object.entries(s).forEach(([c, d]) => {
      let m = te(c, t.variable.excludedKeyRegex) ? i : i ? `${i}.${ct(c)}` : ct(c), p = u ? `${u}.${c}` : c;
      M(d) ? l(d, m, p) : (o[m] || (o[m] = { paths: [], computed: (h, g = {}, v = []) => {
        if (o[m].paths.length === 1) return o[m].paths[0].computed(o[m].paths[0].scheme, g.binding, v);
        if (h && h !== "none") for (let y = 0; y < o[m].paths.length; y++) {
          let $ = o[m].paths[y];
          if ($.scheme === h) return $.computed(h, g.binding, v);
        }
        return o[m].paths.map((y) => y.computed(y.scheme, g[y.scheme], v));
      } }), o[m].paths.push({ path: p, value: d, scheme: p.includes("colorScheme.light") ? "light" : p.includes("colorScheme.dark") ? "dark" : "none", computed: a, tokens: o }));
    });
  };
  return l(e, n, r), o;
}, getTokenValue(e, t, n) {
  var r;
  let o = ((s) => s.split(".").filter((i) => !te(i.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(t), a = t.includes("colorScheme.light") ? "light" : t.includes("colorScheme.dark") ? "dark" : void 0, l = [(r = e[o]) == null ? void 0 : r.computed(a)].flat().filter((s) => s);
  return l.length === 1 ? l[0].value : l.reduce((s = {}, i) => {
    let u = i, { colorScheme: c } = u, d = W(u, ["colorScheme"]);
    return s[c] = d, s;
  }, void 0);
}, getSelectorRule(e, t, n, r) {
  return n === "class" || n === "attr" ? le(C(t) ? `${e}${t},${e} ${t}` : e, r) : le(e, le(t ?? ":root,:host", r));
}, transformCSS(e, t, n, r, o = {}, a, l, s) {
  if (C(t)) {
    let { cssLayer: i } = o;
    if (r !== "style") {
      let u = this.getColorSchemeOption(o, l);
      t = n === "dark" ? u.reduce((c, { type: d, selector: m }) => (C(m) && (c += m.includes("[CSS]") ? m.replace("[CSS]", t) : this.getSelectorRule(m, s, d, t)), c), "") : le(s ?? ":root,:host", t);
    }
    if (i) {
      let u = { name: "primeui" };
      M(i) && (u.name = j(i.name, { name: e, type: r })), C(u.name) && (t = le(`@layer ${u.name}`, t), a?.layerNames(u.name));
    }
    return t;
  }
  return "";
} }, P = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(e = {}) {
  let { theme: t } = e;
  t && (this._theme = De(V({}, t), { options: V(V({}, this.defaults.options), t.options) }), this._tokens = R.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
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
  this.update({ theme: e }), E.emit("theme:change", e);
}, getPreset() {
  return this.preset;
}, setPreset(e) {
  this._theme = De(V({}, this.theme), { preset: e }), this._tokens = R.createTokens(e, this.defaults), this.clearLoadedStyleNames(), E.emit("preset:change", e), E.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(e) {
  this._theme = De(V({}, this.theme), { options: e }), this.clearLoadedStyleNames(), E.emit("options:change", e), E.emit("theme:change", this.theme);
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
  return R.getTokenValue(this.tokens, e, this.defaults);
}, getCommon(e = "", t) {
  return R.getCommon({ name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetC(n);
}, getDirective(e = "", t) {
  let n = { name: e, theme: this.theme, params: t, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPresetD(n);
}, getCustomPreset(e = "", t, n, r) {
  let o = { name: e, preset: t, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return R.getPreset(o);
}, getLayerOrderCSS(e = "") {
  return R.getLayerOrder(e, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(e = "", t, n = "style", r) {
  return R.transformCSS(e, t, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(e = "", t, n = {}) {
  return R.getCommonStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(e, t, n = {}) {
  return R.getStyleSheet({ name: e, theme: this.theme, params: t, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(e) {
  this._loadingStyles.add(e);
}, onStyleUpdated(e) {
  this._loadingStyles.add(e);
}, onStyleLoaded(e, { name: t }) {
  this._loadingStyles.size && (this._loadingStyles.delete(t), E.emit(`theme:${t}:load`, e), !this._loadingStyles.size && E.emit("theme:load"));
} }, L = {
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
}, Gr = `
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
function he(e) {
  "@babel/helpers - typeof";
  return he = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, he(e);
}
function dt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function mt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? dt(Object(n), !0).forEach(function(r) {
      qr(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : dt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function qr(e, t, n) {
  return (t = Qr(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Qr(e) {
  var t = Jr(e, "string");
  return he(t) == "symbol" ? t : t + "";
}
function Jr(e, t) {
  if (he(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (he(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function Zr(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  et() && et().components ? An(e) : t ? e() : jn(e);
}
var Xr = 0;
function eo(e) {
  var t = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = B(!1), r = B(e), o = B(null), a = Gt() ? window.document : void 0, l = t.document, s = l === void 0 ? a : l, i = t.immediate, u = i === void 0 ? !0 : i, c = t.manual, d = c === void 0 ? !1 : c, m = t.name, p = m === void 0 ? "style_".concat(++Xr) : m, h = t.id, g = h === void 0 ? void 0 : h, v = t.media, y = v === void 0 ? void 0 : v, $ = t.nonce, O = $ === void 0 ? void 0 : $, f = t.first, _ = f === void 0 ? !1 : f, k = t.onMounted, N = k === void 0 ? void 0 : k, H = t.onUpdated, F = H === void 0 ? void 0 : H, q = t.onLoad, z = q === void 0 ? void 0 : q, Q = t.props, J = Q === void 0 ? {} : Q, K = function() {
  }, Z = function(oe) {
    var ie = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (s) {
      var U = mt(mt({}, J), ie), I = U.name || p, ee = U.id || g, Pe = U.nonce || O;
      o.value = s.querySelector('style[data-primevue-style-id="'.concat(I, '"]')) || s.getElementById(ee) || s.createElement("style"), o.value.isConnected || (r.value = oe || e, Ae(o.value, {
        type: "text/css",
        id: ee,
        media: y,
        nonce: Pe
      }), _ ? s.head.prepend(o.value) : s.head.appendChild(o.value), Vr(o.value, "data-primevue-style-id", I), Ae(o.value, U), o.value.onload = function(se) {
        return z?.(se, {
          name: I
        });
      }, N?.(I)), !n.value && (K = de(r, function(se) {
        o.value.textContent = se, F?.(I);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, re = function() {
    !s || !n.value || (K(), Er(o.value) && s.head.removeChild(o.value), n.value = !1, o.value = null);
  };
  return u && !d && Zr(Z), {
    id: g,
    name: p,
    el: o,
    css: r,
    unload: re,
    load: Z,
    isLoaded: Ln(n)
  };
}
function ve(e) {
  "@babel/helpers - typeof";
  return ve = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ve(e);
}
var pt, ft, ht, vt;
function gt(e, t) {
  return oo(e) || ro(e, t) || no(e, t) || to();
}
function to() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function no(e, t) {
  if (e) {
    if (typeof e == "string") return yt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? yt(e, t) : void 0;
  }
}
function yt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function ro(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(e)).next, t !== 0) for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function oo(e) {
  if (Array.isArray(e)) return e;
}
function bt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Me(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? bt(Object(n), !0).forEach(function(r) {
      io(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : bt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function io(e, t, n) {
  return (t = so(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function so(e) {
  var t = ao(e, "string");
  return ve(t) == "symbol" ? t : t + "";
}
function ao(e, t) {
  if (ve(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ve(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
function xe(e, t) {
  return t || (t = e.slice(0)), Object.freeze(Object.defineProperties(e, { raw: { value: Object.freeze(t) } }));
}
var lo = function(t) {
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
}, uo = {}, co = {}, T = {
  name: "base",
  css: lo,
  style: Gr,
  classes: uo,
  inlineStyles: co,
  load: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(a) {
      return a;
    }, o = r(Ce(pt || (pt = xe(["", ""])), t));
    return C(o) ? eo(pe(o), Me({
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
      return P.transformCSS(n.name || t.name, "".concat(o).concat(Ce(ft || (ft = xe(["", ""])), r)));
    });
  },
  getCommonTheme: function(t) {
    return P.getCommon(this.name, t);
  },
  getComponentTheme: function(t) {
    return P.getComponent(this.name, t);
  },
  getDirectiveTheme: function(t) {
    return P.getDirective(this.name, t);
  },
  getPresetTheme: function(t, n, r) {
    return P.getCustomPreset(this.name, t, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return P.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = j(this.css, {
        dt: ne
      }) || "", o = pe(Ce(ht || (ht = xe(["", "", ""])), r, t)), a = Object.entries(n).reduce(function(l, s) {
        var i = gt(s, 2), u = i[0], c = i[1];
        return l.push("".concat(u, '="').concat(c, '"')) && l;
      }, []).join(" ");
      return C(o) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(a, ">").concat(o, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return P.getCommonStyleSheet(this.name, t, n);
  },
  getThemeStyleSheet: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [P.getStyleSheet(this.name, t, n)];
    if (this.style) {
      var o = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), a = Ce(vt || (vt = xe(["", ""])), j(this.style, {
        dt: ne
      })), l = pe(P.transformCSS(o, a)), s = Object.entries(n).reduce(function(i, u) {
        var c = gt(u, 2), d = c[0], m = c[1];
        return i.push("".concat(d, '="').concat(m, '"')) && i;
      }, []).join(" ");
      C(l) && r.push('<style type="text/css" data-primevue-style-id="'.concat(o, '" ').concat(s, ">").concat(l, "</style>"));
    }
    return r.join("");
  },
  extend: function(t) {
    return Me(Me({}, this), {}, {
      css: void 0,
      style: void 0
    }, t);
  }
}, G = Yt();
function ge(e) {
  "@babel/helpers - typeof";
  return ge = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ge(e);
}
function _t(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function ke(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? _t(Object(n), !0).forEach(function(r) {
      mo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : _t(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function mo(e, t, n) {
  return (t = po(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function po(e) {
  var t = fo(e, "string");
  return ge(t) == "symbol" ? t : t + "";
}
function fo(e, t) {
  if (ge(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ge(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var ho = {
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
    text: [L.STARTS_WITH, L.CONTAINS, L.NOT_CONTAINS, L.ENDS_WITH, L.EQUALS, L.NOT_EQUALS],
    numeric: [L.EQUALS, L.NOT_EQUALS, L.LESS_THAN, L.LESS_THAN_OR_EQUAL_TO, L.GREATER_THAN, L.GREATER_THAN_OR_EQUAL_TO],
    date: [L.DATE_IS, L.DATE_IS_NOT, L.DATE_BEFORE, L.DATE_AFTER]
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
}, vo = Symbol();
function go(e, t) {
  var n = {
    config: Nn(t)
  };
  return e.config.globalProperties.$primevue = n, e.provide(vo, n), yo(), bo(e, n), n;
}
var ue = [];
function yo() {
  E.clear(), ue.forEach(function(e) {
    return e?.();
  }), ue = [];
}
function bo(e, t) {
  var n = B(!1), r = function() {
    var u;
    if (((u = t.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !P.isStyleNameLoaded("common")) {
      var c, d, m = ((c = T.getCommonTheme) === null || c === void 0 ? void 0 : c.call(T)) || {}, p = m.primitive, h = m.semantic, g = m.global, v = m.style, y = {
        nonce: (d = t.config) === null || d === void 0 || (d = d.csp) === null || d === void 0 ? void 0 : d.nonce
      };
      T.load(p?.css, ke({
        name: "primitive-variables"
      }, y)), T.load(h?.css, ke({
        name: "semantic-variables"
      }, y)), T.load(g?.css, ke({
        name: "global-variables"
      }, y)), T.loadStyle(ke({
        name: "global-style"
      }, y), v), P.setLoadedStyleName("common");
    }
  };
  E.on("theme:change", function(i) {
    n.value || (e.config.globalProperties.$primevue.config.theme = i, n.value = !0);
  });
  var o = de(t.config, function(i, u) {
    G.emit("config:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = de(function() {
    return t.config.ripple;
  }, function(i, u) {
    G.emit("config:ripple:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), l = de(function() {
    return t.config.theme;
  }, function(i, u) {
    n.value || P.setTheme(i), t.config.unstyled || r(), n.value = !1, G.emit("config:theme:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), s = de(function() {
    return t.config.unstyled;
  }, function(i, u) {
    !i && t.config.theme && r(), G.emit("config:unstyled:change", {
      newValue: i,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ue.push(o), ue.push(a), ue.push(l), ue.push(s);
}
var _o = {
  install: function(t, n) {
    var r = wr(ho, n);
    go(t, r);
  }
}, nn = {
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = Gt();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function So(e, t, n, r, o, a) {
  return a.inline ? Le(e.$slots, "default", {
    key: 0
  }) : o.mounted ? (Rn(), Vn(Rt, {
    key: 1,
    to: n.appendTo
  }, [Le(e.$slots, "default")], 8, ["to"])) : Vt("", !0);
}
nn.render = So;
var Y = {
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
function $o() {
  var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", t = In();
  return "".concat(e).concat(t.replace("v-", "").replaceAll("-", "_"));
}
var St = T.extend({
  name: "common"
});
function ye(e) {
  "@babel/helpers - typeof";
  return ye = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, ye(e);
}
function wo(e) {
  return sn(e) || Po(e) || on(e) || rn();
}
function Po(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function ce(e, t) {
  return sn(e) || Oo(e, t) || on(e, t) || rn();
}
function rn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function on(e, t) {
  if (e) {
    if (typeof e == "string") return Be(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Be(e, t) : void 0;
  }
}
function Be(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Oo(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(e)).next, t === 0) {
        if (Object(n) !== n) return;
        i = !1;
      } else for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function sn(e) {
  if (Array.isArray(e)) return e;
}
function $t(e, t) {
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
    t % 2 ? $t(Object(n), !0).forEach(function(r) {
      me(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : $t(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function me(e, t, n) {
  return (t = To(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function To(e) {
  var t = Co(e, "string");
  return ye(t) == "symbol" ? t : t + "";
}
function Co(e, t) {
  if (ye(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (ye(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var xo = {
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
        E.off("theme:change", this._loadCoreStyles), t || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(t, n) {
        var r = this;
        E.off("theme:change", this._themeScopedListener), t ? (this._loadScopedThemeStyles(t), this._themeScopedListener = function() {
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
    var t, n, r, o, a, l, s, i, u, c, d, m = (t = this.pt) === null || t === void 0 ? void 0 : t._usept, p = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, h = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (o = h || p) === null || o === void 0 || (o = o.hooks) === null || o === void 0 || (a = o.onBeforeCreate) === null || a === void 0 || a.call(o);
    var g = (l = this.$primevueConfig) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l._usept, v = g ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.originalValue : void 0, y = g ? (i = this.$primevue) === null || i === void 0 || (i = i.config) === null || i === void 0 || (i = i.pt) === null || i === void 0 ? void 0 : i.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (c = y || v) === null || c === void 0 || (c = c[this.$.type.name]) === null || c === void 0 || (c = c.hooks) === null || c === void 0 || (d = c.onBeforeCreate) === null || d === void 0 || d.call(c), this.$attrSelector = $o(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var t;
    this.rootEl = Ar(we(this.$el) ? this.$el : (t = this.$el) === null || t === void 0 ? void 0 : t.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = S({
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
      return Ge(t) ? t.apply(void 0, r) : Ee.apply(void 0, r);
    },
    _load: function() {
      Y.isStyleNameLoaded("base") || (T.loadCSS(this.$styleOptions), this._loadGlobalStyles(), Y.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var t, n;
      !Y.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name && (St.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), Y.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var t = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      C(t) && T.load(t, S({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var t, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!P.isStyleNameLoaded("common")) {
          var r, o, a = ((r = this.$style) === null || r === void 0 || (o = r.getCommonTheme) === null || o === void 0 ? void 0 : o.call(r)) || {}, l = a.primitive, s = a.semantic, i = a.global, u = a.style;
          T.load(l?.css, S({
            name: "primitive-variables"
          }, this.$styleOptions)), T.load(s?.css, S({
            name: "semantic-variables"
          }, this.$styleOptions)), T.load(i?.css, S({
            name: "global-variables"
          }, this.$styleOptions)), T.loadStyle(S({
            name: "global-style"
          }, this.$styleOptions), u), P.setLoadedStyleName("common");
        }
        if (!P.isStyleNameLoaded((t = this.$style) === null || t === void 0 ? void 0 : t.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var c, d, m, p, h = ((c = this.$style) === null || c === void 0 || (d = c.getComponentTheme) === null || d === void 0 ? void 0 : d.call(c)) || {}, g = h.css, v = h.style;
          (m = this.$style) === null || m === void 0 || m.load(g, S({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (p = this.$style) === null || p === void 0 || p.loadStyle(S({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), v), P.setLoadedStyleName(this.$style.name);
        }
        if (!P.isStyleNameLoaded("layer-order")) {
          var y, $, O = (y = this.$style) === null || y === void 0 || ($ = y.getLayerOrderThemeCSS) === null || $ === void 0 ? void 0 : $.call(y);
          T.load(O, S({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), P.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(t) {
      var n, r, o, a = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, t, "[".concat(this.$attrSelector, "]"))) || {}, l = a.css, s = (o = this.$style) === null || o === void 0 ? void 0 : o.load(l, S({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = s.el;
    },
    _unloadScopedThemeStyles: function() {
      var t;
      (t = this.scopedStyleEl) === null || t === void 0 || (t = t.value) === null || t === void 0 || t.remove();
    },
    _themeChangeListener: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      Y.clearLoadedStyleNames(), E.on("theme:change", t);
    },
    _removeThemeListeners: function() {
      E.off("theme:change", this._loadCoreStyles), E.off("theme:change", this._load), E.off("theme:change", this._themeScopedListener);
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
      return qe(t, n, r);
    },
    _getPTValue: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, l = /./g.test(r) && !!o[r.split(".")[0]], s = this._getPropValue("ptOptions") || ((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, c = s.mergeProps, d = c === void 0 ? !1 : c, m = a ? l ? this._useGlobalPT(this._getPTClassValue, r, o) : this._useDefaultPT(this._getPTClassValue, r, o) : void 0, p = l ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, S(S({}, o), {}, {
        global: m || {}
      })), h = this._getPTDatasets(r);
      return u || !u && p ? d ? this._mergeProps(d, m, p, h) : S(S(S({}, m), p), h) : S(S({}, p), h);
    },
    _getPTSelf: function() {
      for (var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), o = 1; o < n; o++)
        r[o - 1] = arguments[o];
      return Ee(
        this._usePT.apply(this, [this._getPT(t, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", o = "data-pc-", a = r === "root" && C((t = this.pt) === null || t === void 0 ? void 0 : t["data-pc-section"]);
      return r !== "transition" && S(S({}, r === "root" && S(S(me({}, "".concat(o, "name"), D(a ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), a && me({}, "".concat(o, "extend"), D(this.$.type.name))), {}, me({}, "".concat(this.$attrSelector), ""))), {}, me({}, "".concat(o, "section"), D(r)));
    },
    _getPTClassValue: function() {
      var t = this._getOptionValue.apply(this, arguments);
      return A(t) || zt(t) ? {
        class: t
      } : t;
    },
    _getPT: function(t) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", o = arguments.length > 2 ? arguments[2] : void 0, a = function(s) {
        var i, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, c = o ? o(s) : s, d = D(r), m = D(n.$name);
        return (i = u ? d !== m ? c?.[d] : void 0 : c?.[d]) !== null && i !== void 0 ? i : c;
      };
      return t != null && t.hasOwnProperty("_usept") ? {
        _usept: t._usept,
        originalValue: a(t.originalValue),
        value: a(t.value)
      } : a(t, !0);
    },
    _usePT: function(t, n, r, o) {
      var a = function(g) {
        return n(g, r, o);
      };
      if (t != null && t.hasOwnProperty("_usept")) {
        var l, s = t._usept || ((l = this.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, i = s.mergeSections, u = i === void 0 ? !0 : i, c = s.mergeProps, d = c === void 0 ? !1 : c, m = a(t.originalValue), p = a(t.value);
        return m === void 0 && p === void 0 ? void 0 : A(p) ? p : A(m) ? m : u || !u && p ? d ? this._mergeProps(d, m, p) : S(S({}, m), p) : p;
      }
      return a(t);
    },
    _useGlobalPT: function(t, n, r) {
      return this._usePT(this.globalPT, t, n, r);
    },
    _useDefaultPT: function(t, n, r) {
      return this._usePT(this.defaultPT, t, n, r);
    },
    ptm: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, t, S(S({}, this.$params), n));
    },
    ptmi: function() {
      var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = Ee(this.$_attrsWithoutPT, this.ptm(n, r));
      return o?.hasOwnProperty("id") && ((t = o.id) !== null && t !== void 0 || (o.id = this.$id)), o;
    },
    ptmo: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(t, n, S({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, t, S(S({}, this.$params), n));
    },
    sx: function() {
      var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var o = this._getOptionValue(this.$style.inlineStyles, t, S(S({}, this.$params), r)), a = this._getOptionValue(St.inlineStyles, t, S(S({}, this.$params), r));
        return [a, o];
      }
    }
  },
  computed: {
    globalPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return j(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var t, n = this;
      return this._getPT((t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, S({}, n.$params)) || j(r, S({}, n.$params));
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
        var o = ce(r, 1), a = o[0];
        return n?.includes(a);
      }));
    },
    $theme: function() {
      var t;
      return (t = this.$primevueConfig) === null || t === void 0 ? void 0 : t.theme;
    },
    $style: function() {
      return S(S({
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
        var n = ce(t, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(t, n) {
        var r = ce(n, 2), o = r[0], a = r[1], l = o.split(":"), s = wo(l), i = Be(s).slice(1);
        return i?.reduce(function(u, c, d, m) {
          return !u[c] && (u[c] = d === m.length - 1 ? a : {}), u[c];
        }, t), t;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(t) {
        var n = ce(t, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(t, n) {
        var r = ce(n, 2), o = r[0], a = r[1];
        return t[o] = a, t;
      }, {});
    }
  }
}, ko = `
    .p-contextmenu {
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
        min-width: 12.5rem;
    }

    .p-contextmenu-root-list,
    .p-contextmenu-submenu {
        margin: 0;
        padding: dt('contextmenu.list.padding');
        list-style: none;
        outline: 0 none;
        display: flex;
        flex-direction: column;
        gap: dt('contextmenu.list.gap');
    }

    .p-contextmenu-submenu {
        position: absolute;
        display: flex;
        flex-direction: column;
        min-width: 100%;
        z-index: 1;
        background: dt('contextmenu.background');
        color: dt('contextmenu.color');
        border: 1px solid dt('contextmenu.border.color');
        border-radius: dt('contextmenu.border.radius');
        box-shadow: dt('contextmenu.shadow');
    }

    .p-contextmenu-item {
        position: relative;
    }

    .p-contextmenu-item-content {
        transition:
            background dt('contextmenu.transition.duration'),
            color dt('contextmenu.transition.duration');
        border-radius: dt('contextmenu.item.border.radius');
        color: dt('contextmenu.item.color');
    }

    .p-contextmenu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('contextmenu.item.padding');
        gap: dt('contextmenu.item.gap');
        user-select: none;
    }

    .p-contextmenu-item-label {
        line-height: 1;
    }

    .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.color');
    }

    .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.color');
        margin-left: auto;
        font-size: dt('contextmenu.submenu.icon.size');
        width: dt('contextmenu.submenu.icon.size');
        height: dt('contextmenu.submenu.icon.size');
    }

    .p-contextmenu-submenu-icon:dir(rtl) {
        margin-left: 0;
        margin-right: auto;
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item.p-focus > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover {
        color: dt('contextmenu.item.focus.color');
        background: dt('contextmenu.item.focus.background');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.focus.color');
    }

    .p-contextmenu-item:not(.p-disabled) > .p-contextmenu-item-content:hover .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.focus.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content {
        color: dt('contextmenu.item.active.color');
        background: dt('contextmenu.item.active.background');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-item-icon {
        color: dt('contextmenu.item.icon.active.color');
    }

    .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        color: dt('contextmenu.submenu.icon.active.color');
    }

    .p-contextmenu-separator {
        border-block-start: 1px solid dt('contextmenu.separator.border.color');
    }

    .p-contextmenu-mobile .p-contextmenu-submenu {
        position: static;
        box-shadow: none;
        border: 0 none;
        padding-inline-start: dt('tieredmenu.submenu.mobile.indent');
        padding-inline-end: 0;
    }

    .p-contextmenu-mobile .p-contextmenu-submenu-icon {
        transition: transform 0.2s;
        transform: rotate(90deg);
    }

    .p-contextmenu-mobile .p-contextmenu-item-active > .p-contextmenu-item-content .p-contextmenu-submenu-icon {
        transform: rotate(-90deg);
    }
`, Eo = {
  root: function(t) {
    var n = t.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(t) {
    var n = t.instance, r = t.processedItem;
    return ["p-contextmenu-item", {
      "p-contextmenu-item-active": n.isItemActive(r),
      "p-focus": n.isItemFocused(r),
      "p-disabled": n.isItemDisabled(r)
    }];
  },
  itemContent: "p-contextmenu-item-content",
  itemLink: "p-contextmenu-item-link",
  itemIcon: "p-contextmenu-item-icon",
  itemLabel: "p-contextmenu-item-label",
  submenuIcon: "p-contextmenu-submenu-icon",
  submenu: "p-contextmenu-submenu",
  separator: "p-contextmenu-separator"
};
T.extend({
  name: "contextmenu",
  style: ko,
  classes: Eo
});
var Lo = `
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
`, Ao = T.extend({
  name: "baseicon",
  css: Lo
});
function be(e) {
  "@babel/helpers - typeof";
  return be = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, be(e);
}
function wt(e, t) {
  var n = Object.keys(e);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(e);
    t && (r = r.filter(function(o) {
      return Object.getOwnPropertyDescriptor(e, o).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Pt(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? wt(Object(n), !0).forEach(function(r) {
      jo(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : wt(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function jo(e, t, n) {
  return (t = No(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function No(e) {
  var t = Ro(e, "string");
  return be(t) == "symbol" ? t : t + "";
}
function Ro(e, t) {
  if (be(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (be(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var vi = {
  name: "BaseIcon",
  extends: xo,
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
  style: Ao,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var t = $e(this.label);
      return Pt(Pt({}, !this.isUnstyled && {
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
};
function _e(e) {
  "@babel/helpers - typeof";
  return _e = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, _e(e);
}
function Ot(e, t) {
  return Mo(e) || Do(e, t) || Io(e, t) || Vo();
}
function Vo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Io(e, t) {
  if (e) {
    if (typeof e == "string") return Tt(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Tt(e, t) : void 0;
  }
}
function Tt(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function Do(e, t) {
  var n = e == null ? null : typeof Symbol < "u" && e[Symbol.iterator] || e["@@iterator"];
  if (n != null) {
    var r, o, a, l, s = [], i = !0, u = !1;
    try {
      if (a = (n = n.call(e)).next, t !== 0) for (; !(i = (r = a.call(n)).done) && (s.push(r.value), s.length !== t); i = !0) ;
    } catch (c) {
      u = !0, o = c;
    } finally {
      try {
        if (!i && n.return != null && (l = n.return(), Object(l) !== l)) return;
      } finally {
        if (u) throw o;
      }
    }
    return s;
  }
}
function Mo(e) {
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
function w(e) {
  for (var t = 1; t < arguments.length; t++) {
    var n = arguments[t] != null ? arguments[t] : {};
    t % 2 ? Ct(Object(n), !0).forEach(function(r) {
      He(e, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(n)) : Ct(Object(n)).forEach(function(r) {
      Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return e;
}
function He(e, t, n) {
  return (t = Uo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Uo(e) {
  var t = Wo(e, "string");
  return _e(t) == "symbol" ? t : t + "";
}
function Wo(e, t) {
  if (_e(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (_e(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var b = {
  _getMeta: function() {
    return [M(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], j(M(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(t, n) {
    var r, o, a;
    return (r = (t == null || (o = t.instance) === null || o === void 0 ? void 0 : o.$primevue) || (n == null || (a = n.ctx) === null || a === void 0 || (a = a.appContext) === null || a === void 0 || (a = a.config) === null || a === void 0 || (a = a.globalProperties) === null || a === void 0 ? void 0 : a.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: qe,
  _getPTValue: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, a = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", l = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, s = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, i = function() {
      var $ = b._getOptionValue.apply(b, arguments);
      return A($) || zt($) ? {
        class: $
      } : $;
    }, u = ((t = r.binding) === null || t === void 0 || (t = t.value) === null || t === void 0 ? void 0 : t.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, c = u.mergeSections, d = c === void 0 ? !0 : c, m = u.mergeProps, p = m === void 0 ? !1 : m, h = s ? b._useDefaultPT(r, r.defaultPT(), i, a, l) : void 0, g = b._usePT(r, b._getPT(o, r.$name), i, a, w(w({}, l), {}, {
      global: h || {}
    })), v = b._getPTDatasets(r, a);
    return d || !d && g ? p ? b._mergeProps(r, p, h, g, v) : w(w(w({}, h), g), v) : w(w({}, g), v);
  },
  _getPTDatasets: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return w(w({}, n === "root" && He({}, "".concat(r, "name"), D(t.$name))), {}, He({}, "".concat(r, "section"), D(n)));
  },
  _getPT: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, o = function(l) {
      var s, i = r ? r(l) : l, u = D(n);
      return (s = i?.[u]) !== null && s !== void 0 ? s : i;
    };
    return t && Object.hasOwn(t, "_usept") ? {
      _usept: t._usept,
      originalValue: o(t.originalValue),
      value: o(t.value)
    } : o(t);
  },
  _usePT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0, l = function(v) {
      return r(v, o, a);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var s, i = n._usept || ((s = t.$primevueConfig) === null || s === void 0 ? void 0 : s.ptOptions) || {}, u = i.mergeSections, c = u === void 0 ? !0 : u, d = i.mergeProps, m = d === void 0 ? !1 : d, p = l(n.originalValue), h = l(n.value);
      return p === void 0 && h === void 0 ? void 0 : A(h) ? h : A(p) ? p : c || !c && h ? m ? b._mergeProps(t, m, p, h) : w(w({}, p), h) : h;
    }
    return l(n);
  },
  _useDefaultPT: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, o = arguments.length > 3 ? arguments[3] : void 0, a = arguments.length > 4 ? arguments[4] : void 0;
    return b._usePT(t, n, r, o, a);
  },
  _loadStyles: function() {
    var t, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, o = arguments.length > 2 ? arguments[2] : void 0, a = b._getConfig(r, o), l = {
      nonce: a == null || (t = a.csp) === null || t === void 0 ? void 0 : t.nonce
    };
    b._loadCoreStyles(n, l), b._loadThemeStyles(n, l), b._loadScopedThemeStyles(n, l), b._removeThemeListeners(n), n.$loadStyles = function() {
      return b._loadThemeStyles(n, l);
    }, b._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var t, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!Y.isStyleNameLoaded((t = r.$style) === null || t === void 0 ? void 0 : t.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var a;
      T.loadCSS(o), (a = r.$style) === null || a === void 0 || a.loadCSS(o), Y.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var t, n, r, o = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, a = arguments.length > 1 ? arguments[1] : void 0;
    if (!(o != null && o.isUnstyled() || (o == null || (t = o.theme) === null || t === void 0 ? void 0 : t.call(o)) === "none")) {
      if (!P.isStyleNameLoaded("common")) {
        var l, s, i = ((l = o.$style) === null || l === void 0 || (s = l.getCommonTheme) === null || s === void 0 ? void 0 : s.call(l)) || {}, u = i.primitive, c = i.semantic, d = i.global, m = i.style;
        T.load(u?.css, w({
          name: "primitive-variables"
        }, a)), T.load(c?.css, w({
          name: "semantic-variables"
        }, a)), T.load(d?.css, w({
          name: "global-variables"
        }, a)), T.loadStyle(w({
          name: "global-style"
        }, a), m), P.setLoadedStyleName("common");
      }
      if (!P.isStyleNameLoaded((n = o.$style) === null || n === void 0 ? void 0 : n.name) && (r = o.$style) !== null && r !== void 0 && r.name) {
        var p, h, g, v, y = ((p = o.$style) === null || p === void 0 || (h = p.getDirectiveTheme) === null || h === void 0 ? void 0 : h.call(p)) || {}, $ = y.css, O = y.style;
        (g = o.$style) === null || g === void 0 || g.load($, w({
          name: "".concat(o.$style.name, "-variables")
        }, a)), (v = o.$style) === null || v === void 0 || v.loadStyle(w({
          name: "".concat(o.$style.name, "-style")
        }, a), O), P.setLoadedStyleName(o.$style.name);
      }
      if (!P.isStyleNameLoaded("layer-order")) {
        var f, _, k = (f = o.$style) === null || f === void 0 || (_ = f.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(f);
        T.load(k, w({
          name: "layer-order",
          first: !0
        }, a)), P.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = t.preset();
    if (r && t.$attrSelector) {
      var o, a, l, s = ((o = t.$style) === null || o === void 0 || (a = o.getPresetTheme) === null || a === void 0 ? void 0 : a.call(o, r, "[".concat(t.$attrSelector, "]"))) || {}, i = s.css, u = (l = t.$style) === null || l === void 0 ? void 0 : l.load(i, w({
        name: "".concat(t.$attrSelector, "-").concat(t.$style.name)
      }, n));
      t.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    Y.clearLoadedStyleNames(), E.on("theme:change", t);
  },
  _removeThemeListeners: function() {
    var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    E.off("theme:change", t.$loadStyles), t.$loadStyles = void 0;
  },
  _hook: function(t, n, r, o, a, l) {
    var s, i, u = "on".concat(Pr(n)), c = b._getConfig(o, a), d = r?.$instance, m = b._usePT(d, b._getPT(o == null || (s = o.value) === null || s === void 0 ? void 0 : s.pt, t), b._getOptionValue, "hooks.".concat(u)), p = b._useDefaultPT(d, c == null || (i = c.pt) === null || i === void 0 || (i = i.directives) === null || i === void 0 ? void 0 : i[t], b._getOptionValue, "hooks.".concat(u)), h = {
      el: r,
      binding: o,
      vnode: a,
      prevVnode: l
    };
    m?.(d, h), p?.(d, h);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var t = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), o = 2; o < n; o++)
      r[o - 2] = arguments[o];
    return Ge(t) ? t.apply(void 0, r) : Ee.apply(void 0, r);
  },
  _extend: function(t) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(s, i, u, c, d) {
      var m, p, h, g;
      i._$instances = i._$instances || {};
      var v = b._getConfig(u, c), y = i._$instances[t] || {}, $ = $e(y) ? w(w({}, n), n?.methods) : {};
      i._$instances[t] = w(w({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: t,
        $host: i,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || i || void 0,
        $style: w({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: v,
        $attrSelector: (m = i.$pd) === null || m === void 0 || (m = m[t]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return b._getPT(v?.pt, void 0, function(f) {
            var _;
            return f == null || (_ = f.directives) === null || _ === void 0 ? void 0 : _[t];
          });
        },
        isUnstyled: function() {
          var f, _;
          return ((f = i._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.unstyled) !== void 0 ? (_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$binding) === null || _ === void 0 || (_ = _.value) === null || _ === void 0 ? void 0 : _.unstyled : v?.unstyled;
        },
        theme: function() {
          var f;
          return (f = i._$instances[t]) === null || f === void 0 || (f = f.$primevueConfig) === null || f === void 0 ? void 0 : f.theme;
        },
        preset: function() {
          var f;
          return (f = i._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.dt;
        },
        /* instance's methods */
        ptm: function() {
          var f, _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return b._getPTValue(i._$instances[t], (f = i._$instances[t]) === null || f === void 0 || (f = f.$binding) === null || f === void 0 || (f = f.value) === null || f === void 0 ? void 0 : f.pt, _, w({}, k));
        },
        ptmo: function() {
          var f = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, _ = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return b._getPTValue(i._$instances[t], f, _, k, !1);
        },
        cx: function() {
          var f, _, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", N = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (f = i._$instances[t]) !== null && f !== void 0 && f.isUnstyled() ? void 0 : b._getOptionValue((_ = i._$instances[t]) === null || _ === void 0 || (_ = _.$style) === null || _ === void 0 ? void 0 : _.classes, k, w({}, N));
        },
        sx: function() {
          var f, _ = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, N = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? b._getOptionValue((f = i._$instances[t]) === null || f === void 0 || (f = f.$style) === null || f === void 0 ? void 0 : f.inlineStyles, _, w({}, N)) : void 0;
        }
      }, $), i.$instance = i._$instances[t], (p = (h = i.$instance)[s]) === null || p === void 0 || p.call(h, i, u, c, d), i["$".concat(t)] = i.$instance, b._hook(t, s, i, u, c, d), i.$pd || (i.$pd = {}), i.$pd[t] = w(w({}, (g = i.$pd) === null || g === void 0 ? void 0 : g[t]), {}, {
        name: t,
        instance: i._$instances[t]
      });
    }, o = function(s) {
      var i, u, c, d = s._$instances[t], m = d?.watch, p = function(v) {
        var y, $ = v.newValue, O = v.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(d, $, O);
      }, h = function(v) {
        var y, $ = v.newValue, O = v.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(d, $, O);
      };
      d.$watchersCallback = {
        config: p,
        "config.ripple": h
      }, m == null || (i = m.config) === null || i === void 0 || i.call(d, d?.$primevueConfig), G.on("config:change", p), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(d, d == null || (c = d.$primevueConfig) === null || c === void 0 ? void 0 : c.ripple), G.on("config:ripple:change", h);
    }, a = function(s) {
      var i = s._$instances[t].$watchersCallback;
      i && (G.off("config:change", i.config), G.off("config:ripple:change", i["config.ripple"]), s._$instances[t].$watchersCallback = void 0);
    };
    return {
      created: function(s, i, u, c) {
        s.$pd || (s.$pd = {}), s.$pd[t] = {
          name: t,
          attrSelector: Ir("pd")
        }, r("created", s, i, u, c);
      },
      beforeMount: function(s, i, u, c) {
        var d;
        b._loadStyles((d = s.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("beforeMount", s, i, u, c), o(s);
      },
      mounted: function(s, i, u, c) {
        var d;
        b._loadStyles((d = s.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("mounted", s, i, u, c);
      },
      beforeUpdate: function(s, i, u, c) {
        r("beforeUpdate", s, i, u, c);
      },
      updated: function(s, i, u, c) {
        var d;
        b._loadStyles((d = s.$pd[t]) === null || d === void 0 ? void 0 : d.instance, i, u), r("updated", s, i, u, c);
      },
      beforeUnmount: function(s, i, u, c) {
        var d;
        a(s), b._removeThemeListeners((d = s.$pd[t]) === null || d === void 0 ? void 0 : d.instance), r("beforeUnmount", s, i, u, c);
      },
      unmounted: function(s, i, u, c) {
        var d;
        (d = s.$pd[t]) === null || d === void 0 || (d = d.instance) === null || d === void 0 || (d = d.scopedStyleEl) === null || d === void 0 || (d = d.value) === null || d === void 0 || d.remove(), r("unmounted", s, i, u, c);
      }
    };
  },
  extend: function() {
    var t = b._getMeta.apply(b, arguments), n = Ot(t, 2), r = n[0], o = n[1];
    return w({
      extend: function() {
        var l = b._getMeta.apply(b, arguments), s = Ot(l, 2), i = s[0], u = s[1];
        return b.extend(i, w(w(w({}, o), o?.methods), u));
      }
    }, b._extend(r, o));
  }
}, Bo = `
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
`, Ho = {
  root: "p-ink"
}, Fo = T.extend({
  name: "ripple-directive",
  style: Bo,
  classes: Ho
}), zo = b.extend({
  style: Fo
});
function Se(e) {
  "@babel/helpers - typeof";
  return Se = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(t) {
    return typeof t;
  } : function(t) {
    return t && typeof Symbol == "function" && t.constructor === Symbol && t !== Symbol.prototype ? "symbol" : typeof t;
  }, Se(e);
}
function Ko(e) {
  return Qo(e) || qo(e) || Go(e) || Yo();
}
function Yo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Go(e, t) {
  if (e) {
    if (typeof e == "string") return Fe(e, t);
    var n = {}.toString.call(e).slice(8, -1);
    return n === "Object" && e.constructor && (n = e.constructor.name), n === "Map" || n === "Set" ? Array.from(e) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Fe(e, t) : void 0;
  }
}
function qo(e) {
  if (typeof Symbol < "u" && e[Symbol.iterator] != null || e["@@iterator"] != null) return Array.from(e);
}
function Qo(e) {
  if (Array.isArray(e)) return Fe(e);
}
function Fe(e, t) {
  (t == null || t > e.length) && (t = e.length);
  for (var n = 0, r = Array(t); n < t; n++) r[n] = e[n];
  return r;
}
function xt(e, t, n) {
  return (t = Jo(t)) in e ? Object.defineProperty(e, t, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : e[t] = n, e;
}
function Jo(e) {
  var t = Zo(e, "string");
  return Se(t) == "symbol" ? t : t + "";
}
function Zo(e, t) {
  if (Se(e) != "object" || !e) return e;
  var n = e[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(e, t);
    if (Se(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (t === "string" ? String : Number)(e);
}
var gi = zo.extend("ripple", {
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
      n || (n = Lr("span", xt(xt({
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
        if (!this.isUnstyled() && Ie(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"), !at(o) && !lt(o)) {
          var a = Math.max(xr(r), Rr(r));
          o.style.height = a + "px", o.style.width = a + "px";
        }
        var l = Nr(r), s = t.pageX - l.left + document.body.scrollTop - lt(o) / 2, i = t.pageY - l.top + document.body.scrollLeft - at(o) / 2;
        o.style.top = i + "px", o.style.left = s + "px", !this.isUnstyled() && Cr(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          o && (!n.isUnstyled() && Ie(o, "p-ink-active"), o.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(t) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Ie(t.currentTarget, "p-ink-active"), t.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(t) {
      return t && t.children ? Ko(t.children).find(function(n) {
        return jr(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
}), Xo = `
    .p-menu {
        background: dt('menu.background');
        color: dt('menu.color');
        border: 1px solid dt('menu.border.color');
        border-radius: dt('menu.border.radius');
        min-width: 12.5rem;
    }

    .p-menu-list {
        margin: 0;
        padding: dt('menu.list.padding');
        outline: 0 none;
        list-style: none;
        display: flex;
        flex-direction: column;
        gap: dt('menu.list.gap');
    }

    .p-menu-item-content {
        transition:
            background dt('menu.transition.duration'),
            color dt('menu.transition.duration');
        border-radius: dt('menu.item.border.radius');
        color: dt('menu.item.color');
        overflow: hidden;
    }

    .p-menu-item-link {
        cursor: pointer;
        display: flex;
        align-items: center;
        text-decoration: none;
        overflow: hidden;
        position: relative;
        color: inherit;
        padding: dt('menu.item.padding');
        gap: dt('menu.item.gap');
        user-select: none;
        outline: 0 none;
    }

    .p-menu-item-label {
        line-height: 1;
    }

    .p-menu-item-icon {
        color: dt('menu.item.icon.color');
    }

    .p-menu-item.p-focus .p-menu-item-content {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item.p-focus .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover {
        color: dt('menu.item.focus.color');
        background: dt('menu.item.focus.background');
    }

    .p-menu-item:not(.p-disabled) .p-menu-item-content:hover .p-menu-item-icon {
        color: dt('menu.item.icon.focus.color');
    }

    .p-menu-overlay {
        box-shadow: dt('menu.shadow');
    }

    .p-menu-submenu-label {
        background: dt('menu.submenu.label.background');
        padding: dt('menu.submenu.label.padding');
        color: dt('menu.submenu.label.color');
        font-weight: dt('menu.submenu.label.font.weight');
    }

    .p-menu-separator {
        border-block-start: 1px solid dt('menu.separator.border.color');
    }
`, ei = {
  root: function(t) {
    var n = t.props;
    return ["p-menu p-component", {
      "p-menu-overlay": n.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(t) {
    var n = t.instance;
    return ["p-menu-item", {
      "p-focus": n.id === n.focusedOptionId,
      "p-disabled": n.disabled()
    }];
  },
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: "p-menu-item-icon",
  itemLabel: "p-menu-item-label"
};
T.extend({
  name: "menu",
  style: Xo,
  classes: ei
});
const ti = "data-wippy-overlay-layer";
function an() {
  return typeof window < "u" && typeof window.document < "u";
}
function ln() {
  return an() && typeof HTMLElement < "u" && Object.hasOwn(HTMLElement.prototype, "popover");
}
function ni() {
  return ln() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const ri = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let oi = 0;
const Ne = /* @__PURE__ */ new WeakMap();
function kt(e, t) {
  const n = e.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", t), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function ii(e, t) {
  if (!ri.test(e.className))
    return;
  const n = e.style.cssText;
  kt(e, t), e.getAttribute("popover") !== "manual" && e.setAttribute("popover", "manual");
  try {
    e.matches(":popover-open") || e.showPopover();
  } catch {
  }
  if (!e.matches(":popover-open")) {
    e.removeAttribute("popover"), e.style.cssText = n;
    return;
  }
  if (!Ne.has(e)) {
    const r = new MutationObserver(() => {
      const o = e.style;
      (o.top !== "auto" || o.left !== "auto" || o.margin !== "0px" || o.getPropertyPriority("top") !== "important" || o.getPropertyPriority("left") !== "important" || o.getPropertyPriority("margin") !== "important" || o.getPropertyPriority("min-width") !== "important" || o.maxWidth !== "stretch" || o.getPropertyPriority("max-width") !== "important") && kt(e, t);
    });
    r.observe(e, { attributes: !0, attributeFilter: ["style"] }), Ne.set(e, r);
  }
}
function Qe(e) {
  const t = Ne.get(e);
  t && (t.disconnect(), Ne.delete(e));
}
function si(e) {
  const t = e && typeof e.getRootNode == "function" ? e.getRootNode() : null;
  return t instanceof ShadowRoot ? t : null;
}
function ze(e) {
  e.style.top = "0px", e.style.left = "0px";
  const t = e.getBoundingClientRect();
  e.style.top = `${-window.scrollY - t.top}px`, e.style.left = `${-window.scrollX - t.left}px`;
}
const Re = /* @__PURE__ */ new Set(), Je = /* @__PURE__ */ new WeakMap();
let Et = !1, Ke = !1;
function ai() {
  Ke = !1;
  for (const e of Re) {
    if (!e.isConnected) {
      for (const t of Array.from(e.children))
        t instanceof HTMLElement && Qe(t);
      Re.delete(e), Je.get(e)?.disconnect();
      continue;
    }
    e.childElementCount > 0 && ze(e);
  }
}
function Lt() {
  Ke || (Ke = !0, requestAnimationFrame(ai));
}
function li(e) {
  const t = document.createElement("div");
  t.setAttribute(ti, "");
  const n = ln();
  if (t.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && t.setAttribute("popover", "manual"), e.appendChild(t), n) {
    try {
      t.showPopover();
    } catch {
    }
    t.matches(":popover-open") || (t.removeAttribute("popover"), t.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  ze(t);
  const r = new MutationObserver((o) => {
    const a = t.__wippyAnchorName;
    for (const l of o) {
      if (a)
        for (const s of Array.from(l.addedNodes))
          s instanceof HTMLElement && ii(s, a);
      for (const s of Array.from(l.removedNodes))
        s instanceof HTMLElement && Qe(s);
    }
    t.isConnected && t.childElementCount > 0 && ze(t);
  });
  return r.observe(t, { childList: !0 }), Je.set(t, r), Re.add(t), Et || (Et = !0, window.addEventListener("scroll", Lt, { capture: !0, passive: !0 }), window.addEventListener("resize", Lt, { passive: !0 })), t;
}
function At(e) {
  if (!(!e.hostRoot || e.layer) && (e.layer = li(e.hostRoot), ni())) {
    const t = e.$el ? e.$el.parentElement : null;
    t && (e.anchorName = `--wippy-a-${++oi}`, e.anchorTrigger = t, t.style.setProperty("anchor-name", e.anchorName), e.layer.__wippyAnchorName = e.anchorName);
  }
}
function jt(e) {
  if (e.anchorTrigger && (e.anchorTrigger.style.removeProperty("anchor-name"), e.anchorTrigger = null), e.anchorName = null, e.layer) {
    for (const t of Array.from(e.layer.children))
      t instanceof HTMLElement && Qe(t);
    Re.delete(e.layer), Je.get(e.layer)?.disconnect(), e.layer.remove(), e.layer = null;
  }
}
let Nt = !1;
function ui() {
  if (Nt)
    return;
  Nt = !0;
  const e = nn;
  e.computed = e.computed || {}, e.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, e.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, e.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, e.mounted = function() {
    an() && (this.hostRoot = si(this.$el), this.mounted = !0, this.hostRoot && (this.inline || At(this), this.$watch("inline", (t) => {
      t ? jt(this) : At(this);
    })));
  }, e.render = function() {
    return this.inline ? Le(this.$slots, "default", { key: 0 }) : this.mounted ? Dn(Rt, { key: 1, to: this.resolvedTarget || document.body }, [
      Le(this.$slots, "default")
    ]) : Vt("", !0);
  }, e.unmounted = function() {
    jt(this);
  };
}
const yi = {
  install: (e) => {
    ui(), e.use(_o, { theme: "none" });
  }
};
export {
  T as B,
  yi as P,
  gi as R,
  hi as W,
  pi as a,
  C as b,
  xo as c,
  Or as f,
  $e as l,
  vi as s,
  fi as u
};
//# sourceMappingURL=wc-runtime-BIZwvF6q.js.map
