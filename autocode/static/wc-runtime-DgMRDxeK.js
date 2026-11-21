import { hasInjectionContext as vr, inject as Ze, effectScope as yr, ref as q, markRaw as br, createApp as _r, onMounted as bn, onUnmounted as Sr, watch as he, readonly as wr, getCurrentInstance as Ct, nextTick as $r, reactive as Or, renderSlot as ae, openBlock as L, createBlock as ve, Teleport as _n, createCommentVNode as B, useId as Cr, mergeProps as E, resolveDirective as Tr, createElementBlock as N, createElementVNode as rt, withDirectives as Pr, resolveDynamicComponent as Tt, normalizeClass as xr, toDisplayString as Sn, resolveComponent as Pt, withCtx as xt, createVNode as kr, Transition as Lr, Fragment as be, renderList as kt, createTextVNode as Er, h as Ar } from "vue";
import { addCollection as Ir } from "@iconify/vue";
import { config as Lt, addIcons as jr, on as Nr, applyThemeMode as Ne, host as Rr, hostCss as Vr, loadCss as Dr } from "@wippy-fe/proxy";
var it = "data-wippy-visible";
function Et(t) {
  const e = t.getAttribute(it);
  return e === "true" ? !0 : e === "false" ? !1 : null;
}
var Mr = Object.defineProperty, wn = (t) => {
  throw TypeError(t);
}, Fr = (t, e, n) => e in t ? Mr(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, P = (t, e, n) => Fr(t, typeof e != "symbol" ? e + "" : e, n), $n = (t, e, n) => e.has(t) || wn("Cannot " + n), Hr = (t, e, n) => ($n(t, e, "read from private field"), n ? n.call(t) : e.get(t)), Br = (t, e, n) => e.has(t) ? wn("Cannot add the same private member more than once") : e instanceof WeakSet ? e.add(t) : e.set(t, n), Ur = (t, e, n, r) => ($n(t, e, "write to private field"), e.set(t, n), n), zr = [
  "themeConfigUrl",
  "primeVueCssUrl",
  "markdownCssUrl",
  "iframeCssUrl"
], Wr = [
  ":where([data-wippy-theme-root]).w-theme-light",
  ":where([data-wippy-theme-root]).w-theme-dark"
].join(`,
`);
function At(t) {
  const e = t.startsWith("--") ? t : `--${t}`;
  return /^--[-\w\u0080-\uFFFF]+$/.test(e) ? e : null;
}
function Kr(...t) {
  const e = /* @__PURE__ */ new Set();
  for (const n of t)
    if (n)
      for (const [r, i] of Object.entries(n)) {
        if ((r === "@light" || r === "@dark") && i && typeof i == "object") {
          for (const [a, l] of Object.entries(i)) {
            const s = typeof l == "string" ? At(a) : null;
            s && e.add(s);
          }
          continue;
        }
        const o = typeof i == "string" ? At(r) : null;
        o && e.add(o);
      }
  return [...e].sort();
}
function Yr(t) {
  if (t.length === 0)
    return "";
  const e = t.map((n) => `  ${n}: inherit;`).join(`
`);
  return `${Wr} {
${e}
}`;
}
function qr(t, e) {
  const n = Yr(e);
  n && On(t, n, "@wippy-fe/css-variables-bridge");
}
function Gr(t, e) {
  const r = (e ?? zr).map(async (i) => {
    const o = Vr[i];
    if (!o)
      return console.warn(`[wippy-fe/webcomponent-core] hostCss key "${i}" is undefined — skipping. Remove it from hostCssKeys if the CSS was removed.`), null;
    try {
      return await Dr(o);
    } catch (a) {
      return console.warn(`[wippy-fe/webcomponent-core] Failed to load hostCss "${i}" (${o}):`, a), null;
    }
  });
  return Promise.all(r).then((i) => {
    for (const o of i) {
      if (!o)
        continue;
      const a = document.createElement("style");
      a.textContent = o, a.setAttribute("role", "@wippy-fe/host-css"), t.appendChild(a);
    }
  });
}
function Zr(t, e) {
  const n = document.createElement("style");
  n.textContent = e, t.appendChild(n);
}
function On(t, e, n) {
  if (typeof CSSStyleSheet < "u" && "replaceSync" in CSSStyleSheet.prototype) {
    const i = new CSSStyleSheet();
    i.replaceSync(e), t.adoptedStyleSheets = [...t.adoptedStyleSheets, i];
    return;
  }
  const r = document.createElement("style");
  r.setAttribute("role", n), r.textContent = e, t.appendChild(r);
}
function Jr(t, e) {
  On(t, e, "@wippy-fe/custom-css");
}
function Cn(t) {
  return t.__wippyHost ?? null;
}
function Qr(t) {
  return t.replace(/-([a-z])/g, (e, n) => n.toUpperCase());
}
function Xr(t, e, n) {
  switch (n.type) {
    case "string":
      return { value: e };
    case "number": {
      const r = Number.parseFloat(e);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected a number` } : { value: r };
    }
    case "integer": {
      const r = Number.parseInt(e, 10);
      return Number.isNaN(r) ? { value: void 0, error: `Invalid ${t}: expected an integer` } : { value: r };
    }
    case "boolean":
      return { value: e !== "false" };
    case "array":
    case "object":
      try {
        const r = JSON.parse(e);
        return n.type === "array" && !Array.isArray(r) ? { value: void 0, error: `Invalid ${t}: expected a JSON array` } : { value: r };
      } catch {
        return { value: void 0, error: `Invalid ${t}: must be valid JSON` };
      }
    default:
      return { value: e };
  }
}
function Qe(t, e) {
  const n = {}, r = [];
  for (const [i, o] of Object.entries(e.properties)) {
    const a = t.getAttribute(i), l = Qr(i);
    if (a === null) {
      o.default !== void 0 && (n[l] = o.default);
      continue;
    }
    const s = Xr(i, a, o);
    s.error ? r.push(s.error) : n[l] = s.value;
  }
  return { props: n, errors: r };
}
var ei = class {
  constructor(t, e) {
    P(this, "_props"), P(this, "_errors"), P(this, "_content"), P(this, "_hostVisibility"), P(this, "_propsListeners", /* @__PURE__ */ new Set()), P(this, "_contentListeners", /* @__PURE__ */ new Set()), P(this, "_hostVisibilityListeners", /* @__PURE__ */ new Set()), P(this, "_disposed", !1), P(this, "_emitToDom"), P(this, "props"), P(this, "events"), P(this, "content"), P(this, "hostVisibility"), this._props = t.props, this._errors = t.errors, this._content = t.content, this._hostVisibility = t.hostVisibility, this._emitToDom = e;
    const n = this;
    this.props = {
      get value() {
        return n._props;
      },
      get errors() {
        return n._errors;
      },
      subscribe(r, i) {
        return n._subscribeProps(r, i);
      }
    }, this.events = {
      emit(r, i) {
        n._disposed || n._emitToDom(r, i);
      }
    }, this.content = t.hasContent ? {
      get value() {
        return n._content;
      },
      subscribe(r, i) {
        return n._subscribeContent(r, i);
      }
    } : null, this.hostVisibility = {
      get value() {
        return n._hostVisibility;
      },
      subscribe(r, i) {
        return n._subscribeHostVisibility(r, i);
      }
    };
  }
  /** @internal */
  notifyProps(t, e) {
    if (!this._disposed) {
      this._props = t, this._errors = e;
      for (const n of this._propsListeners)
        n(t, e);
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
      for (const n of this._hostVisibilityListeners)
        n(t, e);
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
    const n = () => {
      this._propsListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeContent(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._contentListeners.add(t), e?.immediate && t(this._content);
    const n = () => {
      this._contentListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
  _subscribeHostVisibility(t, e) {
    if (this._disposed || e?.signal?.aborted)
      return () => {
      };
    this._hostVisibilityListeners.add(t), e?.immediate && t(this._hostVisibility, this._hostVisibility);
    const n = () => {
      this._hostVisibilityListeners.delete(t), e?.signal?.removeEventListener("abort", n);
    };
    return e?.signal?.addEventListener("abort", n, { once: !0 }), n;
  }
}, Ue, ti = class extends HTMLElement {
  constructor() {
    super(), P(this, "_internals"), P(this, "_contentObserver", null), P(this, "_initialized", !1), P(this, "_container", null), Br(this, Ue, null), P(this, "_attachment", 0), P(this, "_reactive", null), P(this, "_lastProps", null), P(this, "_lastErrors", []), P(this, "_lastContent", null), P(this, "_themeUnsub", null), P(this, "_hostVisible", null), this._internals = this.attachInternals(), this._hostVisible = Et(this);
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
    const t = this.wippyConfig, e = Object.keys(t.propsSchema.properties), n = t.extraObservedAttributes ?? [];
    return [.../* @__PURE__ */ new Set([...e, ...n, it])];
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
    return Cn(this);
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
      let n, r;
      if (this._lastProps !== null)
        n = this._lastProps, r = this._lastErrors;
      else {
        const o = Qe(this, t.propsSchema);
        t.validateProps && o.errors.push(...t.validateProps(o.props)), n = o.props, r = o.errors, this._lastProps = n, this._lastErrors = r;
      }
      const i = e ? this._lastContent ?? this._extractContent(t.contentTemplate) : null;
      e && this._lastContent === null && (this._lastContent = i), this._reactive = new ei(
        { props: n, errors: r, content: i, hasContent: e, hostVisibility: this._hostVisible },
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
      const e = this.constructor.wippyConfig, n = this._initialized, r = Hr(this, Ue) ?? Ur(this, Ue, this.shadowRoot ?? this.attachShadow({ mode: e.shadowMode ?? "open" }));
      let i;
      if (this._container)
        i = this._container;
      else {
        if (this.onInit(r), t !== this._attachment)
          return;
        e.inlineCss && Zr(r, e.inlineCss);
        try {
          const c = Lt?.theming, d = Kr(
            c?.global?.cssVariables,
            c?.children?.cssVariables
          );
          qr(r, d);
        } catch {
        }
        if (e.customCss !== !1)
          try {
            const c = Lt?.theming, d = [c?.global?.customCSS, c?.children?.customCSS].filter(Boolean).join(`
`);
            d && Jr(r, d);
          } catch {
          }
        (e.hostCssKeys === void 0 || e.hostCssKeys.length > 0) && Gr(r, e.hostCssKeys), i = document.createElement("div"), i.setAttribute("data-wippy-theme-root", "");
        const u = e.containerClasses ?? [];
        u.length > 0 && i.classList.add(...u), r.appendChild(i), this._container = i, jr(Ir);
      }
      this._applyTheme(), this._themeUnsub || (this._themeUnsub = Nr("@theme", (u) => this._applyTheme(u)));
      const { props: o, errors: a } = Qe(this, e.propsSchema);
      e.validateProps && a.push(...e.validateProps(o));
      const l = o;
      this._lastProps = l, this._lastErrors = a;
      let s = null;
      if (e.contentTemplate && (s = this._extractContent(e.contentTemplate), this._lastContent = s, this._contentObserver = new MutationObserver(() => {
        const u = this._extractContent(e.contentTemplate);
        this._lastContent = u, this._reactive?.notifyContent(u), this.onContentChanged(u);
      }), this._contentObserver.observe(this, {
        childList: !0,
        characterData: !0,
        subtree: !0
      })), this.onMount(r, i, l, a, s, n), t !== this._attachment)
        return;
      this._internals.states.delete("loading"), this._internals.states.add("ready"), n || (this._initialized = !0), this.onReady(), t === this._attachment && this.emitEvent("load");
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
  _applyTheme(t = Rr.getThemeMode?.()) {
    Ne(t, this), this._container && Ne(t, this._container);
  }
  disconnectedCallback() {
    const t = ++this._attachment;
    this._themeUnsub && (this._themeUnsub(), this._themeUnsub = null), Ne("auto", this), this._container && Ne("auto", this._container), this._contentObserver && (this._contentObserver.disconnect(), this._contentObserver = null), this.onUnmount(), t === this._attachment && (this.emitEvent("unload"), t === this._attachment && (this._internals.states.clear(), this._reactive?.dispose(), this._reactive = null, this._lastProps = null, this._lastErrors = [], this._lastContent = null, delete this.__wippyHost, delete this.__wippyHostBus));
  }
  attributeChangedCallback(t, e, n) {
    if (e === n)
      return;
    if (t === it) {
      const l = this._hostVisible, s = Et(this);
      if (s === l)
        return;
      this._hostVisible = s, this.isConnected && this._initialized && (this._reactive?.notifyHostVisibility(s, l), this.onHostVisibilityChanged(s, l));
      return;
    }
    const r = this.constructor.wippyConfig, { props: i, errors: o } = Qe(this, r.propsSchema);
    r.validateProps && o.push(...r.validateProps(i));
    const a = i;
    this._lastProps = a, this._lastErrors = o, this._reactive?.notifyProps(a, o), this.onPropsChanged(a, o);
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
Ue = /* @__PURE__ */ new WeakMap();
function ni(t) {
  return t.__wippyHostBus ?? null;
}
function ri(t) {
  return t.dataset.wippyPanelId ?? null;
}
/*!
 * pinia v2.3.1
 * (c) 2025 Eduardo San Martin Morote
 * @license MIT
 */
let Tn;
const Pn = (t) => Tn = t, ii = () => vr() && Ze(xn) || Tn, xn = (
  /* istanbul ignore next */
  Symbol()
);
var It;
(function(t) {
  t.direct = "direct", t.patchObject = "patch object", t.patchFunction = "patch function";
})(It || (It = {}));
function oi() {
  const t = yr(!0), e = t.run(() => q({}));
  let n = [], r = [];
  const i = br({
    install(o) {
      Pn(i), i._a = o, o.provide(xn, i), o.config.globalProperties.$pinia = i, r.forEach((a) => n.push(a)), r = [];
    },
    use(o) {
      return this._a ? n.push(o) : r.push(o), this;
    },
    _p: n,
    // it's actually undefined here
    // @ts-expect-error
    _a: null,
    _e: t,
    _s: /* @__PURE__ */ new Map(),
    state: e
  });
  return i;
}
var si = Object.defineProperty, ai = (t, e, n) => e in t ? si(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, K = (t, e, n) => ai(t, typeof e != "symbol" ? e + "" : e, n);
function Ks(t, e) {
  return { lazyConfig: t, mountLifecycle: !0, lazyUi: e };
}
function jt(t, e, n) {
  const r = t.createElement("div"), i = n ? e.failed : e.loading;
  r.dataset.lazyState = n ? "failed" : "loading", r.setAttribute("role", n ? "alert" : "status"), r.setAttribute("aria-label", i), r.style.cssText = "display:grid;place-items:center;text-align:center;";
  const o = e.surface === "page";
  if (r.style.cssText += o ? "block-size:100%;min-block-size:0;" : "min-block-size:2rem;font-size:.875rem;", n)
    r.style.color = "var(--p-danger-500, currentColor)", r.textContent = !o && e.iconOnly ? "⚠" : i, !o && e.iconOnly && (r.title = i);
  else {
    const a = t.createElement("style");
    a.textContent = '@media (prefers-reduced-motion: no-preference) { [data-lazy-state="loading"] > [data-wippy-spinner] { animation: wippy-lazy-spin 1s linear infinite; } } @keyframes wippy-lazy-spin { to { transform: rotate(1turn); } }';
    const l = t.createElement("span");
    l.dataset.wippySpinner = "", l.setAttribute("aria-hidden", "true"), l.style.cssText = "display:block;box-sizing:border-box;inline-size:1em;block-size:1em;border:2px solid var(--p-surface-300, currentColor);border-top-color:var(--p-primary-color, currentColor);border-radius:50%;", l.style.fontSize = o ? "2rem" : "1em", r.append(a, l);
  }
  return r;
}
var kn = /* @__PURE__ */ Symbol("wippy:emit"), Ln = /* @__PURE__ */ Symbol("wippy:props"), li = /* @__PURE__ */ Symbol("wippy:props_error"), ui = /* @__PURE__ */ Symbol("wippy:content"), di = /* @__PURE__ */ Symbol("wippy:panel-id"), ci = /* @__PURE__ */ Symbol("wippy:layout-bus"), mi = /* @__PURE__ */ Symbol("wippy:host"), En = /* @__PURE__ */ Symbol("wippy:host-visibility");
function Ys() {
  const t = Ze(Ln);
  if (!t)
    throw new Error("useProps() must be called inside a WippyVueElement");
  return t;
}
function qs() {
  const t = Ze(kn);
  if (!t)
    throw new Error("useEvents() must be called inside a WippyVueElement");
  return t;
}
function fi() {
  const t = Ze(En);
  if (!t)
    throw new Error("useHostVisibility() must be called inside a WippyVueElement");
  return t;
}
function Gs(t) {
  const e = fi();
  let n = !1, r = null, i = !1;
  function o() {
    if (r)
      return i = !0, r;
    let a;
    try {
      a = Promise.resolve(t());
    } catch (s) {
      a = Promise.reject(s);
    }
    const l = a.finally(() => {
      if (r === l && (r = null, n && i))
        return i = !1, o();
    });
    return r = l, l;
  }
  return bn(() => (n = !0, o())), Sr(() => {
    n = !1, i = !1;
  }), he(e, (a, l) => {
    if (n && l === !1 && a === !0)
      return o();
  }), e;
}
var Re = /* @__PURE__ */ new WeakMap();
function Nt(t, e) {
  const n = Re.get(t);
  if (n)
    return n;
  const r = Promise.resolve().then(e);
  return Re.set(t, r), r.catch(() => {
    Re.get(t) === r && Re.delete(t);
  }), r;
}
var Zs = class extends ti {
  constructor() {
    super(...arguments), K(this, "_vueApp", null), K(this, "_mountingApp", !1), K(this, "_mountState", "idle"), K(this, "_feedback", null), K(this, "_propsRef", q({})), K(this, "_errorsRef", q([])), K(this, "_contentRef", q(null)), K(this, "_hostVisibilityRef", q(null)), K(this, "_bridgeAbort", null);
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
    t.mountLifecycle && !t.rootComponent && t.lazyConfig && await Nt(this, t.lazyConfig);
  }
  /** Undefined on configurations that use only the legacy load event. */
  get wippyMountState() {
    return this.constructor.vueConfig.mountLifecycle ? this._mountState : void 0;
  }
  onMount(t, e, n, r, i, o) {
    const a = this.constructor, l = a.vueConfig, s = new AbortController();
    this._bridgeAbort = s;
    const u = () => !s.signal.aborted && this._bridgeAbort === s;
    this._mountState = "mounting", this._propsRef.value = n, this._errorsRef.value = r, this._contentRef.value = i ?? null, this._hostVisibilityRef.value = this.hostVisible;
    for (const d of r)
      if (this.emitEvent("invalid", { message: d }), !u())
        return;
    this.reactive.props.subscribe((d, m) => {
      this._propsRef.value = d, this._errorsRef.value = [...m];
      for (const f of m)
        this.emitEvent("invalid", { message: f });
    }, { signal: s.signal }), this.reactive.content && this.reactive.content.subscribe((d) => {
      this._contentRef.value = d;
    }, { signal: s.signal }), this.reactive.hostVisibility.subscribe((d) => {
      this._hostVisibilityRef.value = d;
    }, { signal: s.signal });
    const c = (d) => {
      if (!u())
        return;
      const m = ii(), f = _r(d.rootComponent);
      let p = !1, v = !1, g, y;
      this._mountingApp = !0;
      try {
        const _ = oi();
        if (d.piniaPlugins)
          for (const w of d.piniaPlugins)
            _.use(w);
        f.use(_);
        for (const w of d.plugins ?? [])
          f.use(w);
        if (f.provide(Ln, this._propsRef), f.provide(li, this._errorsRef), f.provide(kn, this.emitEvent.bind(this)), f.provide(ui, this._contentRef), f.provide(En, this._hostVisibilityRef), f.provide(di, ri(this)), f.provide(ci, ni(this)), f.provide(mi, Cn(this)), d.providers?.(f, this), !u())
          return;
        if (y = f.config.errorHandler, l.mountLifecycle && (f.config.errorHandler = (w, h, b) => {
          v || (g = w), v = !0, y?.(w, h, b);
        }), f.mount(e), p = !0, v)
          throw g;
        u() && (this._vueApp = f);
      } finally {
        l.mountLifecycle && p && (f.config.errorHandler = y);
        try {
          p && (v || !u()) && f.unmount();
        } finally {
          Pn(m), this._mountingApp = !1;
        }
      }
      l.mountLifecycle && queueMicrotask(() => {
        u() && this.isConnected && (this._mountState = "mounted", this.dispatchEvent(new Event("wippy-mounted")));
      });
    };
    if (l.rootComponent) {
      if (this._mountingApp && l.mountLifecycle) {
        queueMicrotask(() => {
          try {
            c(l);
          } catch (d) {
            u() && (this._mountState = "failed", this.emitEvent("error", { message: d instanceof Error ? d.message : String(d), error: d }));
          }
        });
        return;
      }
      try {
        c(l);
      } catch (d) {
        if (u())
          throw this._mountState = "failed", d;
      }
    } else if (l.lazyConfig) {
      const d = e.ownerDocument, m = l.lazyUi;
      m?.surface === "page" && (e.style.blockSize = "100%", e.style.minBlockSize = "0");
      let f = !1, p, v;
      const g = () => {
        clearTimeout(p), clearTimeout(v), this._feedback?.remove(), this._feedback = null;
      };
      s.signal.addEventListener("abort", g, { once: !0 });
      const y = () => {
        if (!u() || f)
          return;
        const b = m ? jt(d, m, !1) : d.createElement("wippy-loading");
        b.setAttribute("no-bg", ""), this._feedback = b, e.appendChild(b);
      }, _ = (b) => {
        if (!u())
          return;
        f = !0, g(), this._mountState = "failed";
        const k = m?.failed ?? (b instanceof Error ? b.message : String(b)), A = m ? jt(d, m, !0) : d.createElement("wippy-error");
        m || (A.setAttribute("title", "Failed to load"), A.setAttribute("message", k)), this._feedback = A, e.appendChild(A), this.emitEvent("error", m ? { message: k, error: b } : { message: k });
      }, w = m?.delay ?? (m?.surface === "compact" ? 200 : 0);
      w > 0 ? p = setTimeout(y, w) : y(), m && (v = setTimeout(() => _(new Error("The component did not load in time.")), m.timeout ?? 3e4)), (l.mountLifecycle ? Nt(a, l.lazyConfig) : l.lazyConfig()).then((b) => {
        !u() || f || (f = !0, g(), c(b));
      }, (b) => {
        f || _(b);
      }).catch(_);
    } else
      throw this._mountState = "failed", new Error("WippyVueElement vueConfig must provide rootComponent or lazyConfig");
  }
  onUnmount() {
    this._bridgeAbort?.abort(), this._bridgeAbort = null, this._mountState = "idle", this._feedback?.remove(), this._feedback = null;
    const t = this._vueApp;
    this._vueApp = null, t?.unmount();
  }
}, pi = Object.defineProperty, Rt = Object.getOwnPropertySymbols, hi = Object.prototype.hasOwnProperty, gi = Object.prototype.propertyIsEnumerable, Vt = (t, e, n) => e in t ? pi(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, vi = (t, e) => {
  for (var n in e || (e = {})) hi.call(e, n) && Vt(t, n, e[n]);
  if (Rt) for (var n of Rt(e)) gi.call(e, n) && Vt(t, n, e[n]);
  return t;
};
function Ie(t) {
  return t == null || t === "" || Array.isArray(t) && t.length === 0 || !(t instanceof Date) && typeof t == "object" && Object.keys(t).length === 0;
}
function ot(t, e, n = /* @__PURE__ */ new WeakSet()) {
  if (t === e) return !0;
  if (!t || !e || typeof t != "object" || typeof e != "object" || n.has(t) || n.has(e)) return !1;
  n.add(t).add(e);
  let r = Array.isArray(t), i = Array.isArray(e), o, a, l;
  if (r && i) {
    if (a = t.length, a != e.length) return !1;
    for (o = a; o-- !== 0; ) if (!ot(t[o], e[o], n)) return !1;
    return !0;
  }
  if (r != i) return !1;
  let s = t instanceof Date, u = e instanceof Date;
  if (s != u) return !1;
  if (s && u) return t.getTime() == e.getTime();
  let c = t instanceof RegExp, d = e instanceof RegExp;
  if (c != d) return !1;
  if (c && d) return t.toString() == e.toString();
  let m = Object.keys(t);
  if (a = m.length, a !== Object.keys(e).length) return !1;
  for (o = a; o-- !== 0; ) if (!Object.prototype.hasOwnProperty.call(e, m[o])) return !1;
  for (o = a; o-- !== 0; ) if (l = m[o], !ot(t[l], e[l], n)) return !1;
  return !0;
}
function yi(t, e) {
  return ot(t, e);
}
function Je(t) {
  return typeof t == "function" && "call" in t && "apply" in t;
}
function T(t) {
  return !Ie(t);
}
function st(t, e) {
  if (!t || !e) return null;
  try {
    let n = t[e];
    if (T(n)) return n;
  } catch {
  }
  if (Object.keys(t).length) {
    if (Je(e)) return e(t);
    if (e.indexOf(".") === -1) return t[e];
    {
      let n = e.split("."), r = t;
      for (let i = 0, o = n.length; i < o; ++i) {
        if (r == null) return null;
        r = r[n[i]];
      }
      return r;
    }
  }
  return null;
}
function bi(t, e, n) {
  return n ? st(t, n) === st(e, n) : yi(t, e);
}
function z(t, e = !0) {
  return t instanceof Object && t.constructor === Object && (e || Object.keys(t).length !== 0);
}
function An(t = {}, e = {}) {
  let n = vi({}, t);
  return Object.keys(e).forEach((r) => {
    let i = r;
    z(e[i]) && i in t && z(t[i]) ? n[i] = An(t[i], e[i]) : n[i] = e[i];
  }), n;
}
function _i(...t) {
  return t.reduce((e, n, r) => r === 0 ? n : An(e, n), {});
}
function Js(t, e) {
  let n = -1;
  if (T(t)) try {
    n = t.findLastIndex(e);
  } catch {
    n = t.lastIndexOf([...t].reverse().find(e));
  }
  return n;
}
function R(t, ...e) {
  return Je(t) ? t(...e) : t;
}
function V(t, e = !0) {
  return typeof t == "string" && (e || t !== "");
}
function U(t) {
  return V(t) ? t.replace(/(-|_)/g, "").toLowerCase() : t;
}
function gt(t, e = "", n = {}) {
  let r = U(e).split("."), i = r.shift();
  if (i) {
    if (z(t)) {
      let o = Object.keys(t).find((a) => U(a) === i) || "";
      return gt(R(t[o], n), r.join("."), n);
    }
    return;
  }
  return R(t, n);
}
function In(t, e = !0) {
  return Array.isArray(t) && (e || t.length !== 0);
}
function Si(t) {
  return T(t) && !isNaN(t);
}
function Qs(t = "") {
  return T(t) && t.length === 1 && !!t.match(/\S| /);
}
function le(t, e) {
  if (e) {
    let n = e.test(t);
    return e.lastIndex = 0, n;
  }
  return !1;
}
function wi(...t) {
  return _i(...t);
}
function $e(t) {
  return t && t.replace(/\/\*(?:(?!\*\/)[\s\S])*\*\/|[\r\n\t]+/g, "").replace(/ {2,}/g, " ").replace(/ ([{:}]) /g, "$1").replace(/([;,]) /g, "$1").replace(/ !/g, "!").replace(/: /g, ":").trim();
}
function D(t) {
  if (t && /[\xC0-\xFF\u0100-\u017E]/.test(t)) {
    let e = { A: /[\xC0-\xC5\u0100\u0102\u0104]/g, AE: /[\xC6]/g, C: /[\xC7\u0106\u0108\u010A\u010C]/g, D: /[\xD0\u010E\u0110]/g, E: /[\xC8-\xCB\u0112\u0114\u0116\u0118\u011A]/g, G: /[\u011C\u011E\u0120\u0122]/g, H: /[\u0124\u0126]/g, I: /[\xCC-\xCF\u0128\u012A\u012C\u012E\u0130]/g, IJ: /[\u0132]/g, J: /[\u0134]/g, K: /[\u0136]/g, L: /[\u0139\u013B\u013D\u013F\u0141]/g, N: /[\xD1\u0143\u0145\u0147\u014A]/g, O: /[\xD2-\xD6\xD8\u014C\u014E\u0150]/g, OE: /[\u0152]/g, R: /[\u0154\u0156\u0158]/g, S: /[\u015A\u015C\u015E\u0160]/g, T: /[\u0162\u0164\u0166]/g, U: /[\xD9-\xDC\u0168\u016A\u016C\u016E\u0170\u0172]/g, W: /[\u0174]/g, Y: /[\xDD\u0176\u0178]/g, Z: /[\u0179\u017B\u017D]/g, a: /[\xE0-\xE5\u0101\u0103\u0105]/g, ae: /[\xE6]/g, c: /[\xE7\u0107\u0109\u010B\u010D]/g, d: /[\u010F\u0111]/g, e: /[\xE8-\xEB\u0113\u0115\u0117\u0119\u011B]/g, g: /[\u011D\u011F\u0121\u0123]/g, i: /[\xEC-\xEF\u0129\u012B\u012D\u012F\u0131]/g, ij: /[\u0133]/g, j: /[\u0135]/g, k: /[\u0137,\u0138]/g, l: /[\u013A\u013C\u013E\u0140\u0142]/g, n: /[\xF1\u0144\u0146\u0148\u014B]/g, p: /[\xFE]/g, o: /[\xF2-\xF6\xF8\u014D\u014F\u0151]/g, oe: /[\u0153]/g, r: /[\u0155\u0157\u0159]/g, s: /[\u015B\u015D\u015F\u0161]/g, t: /[\u0163\u0165\u0167]/g, u: /[\xF9-\xFC\u0169\u016B\u016D\u016F\u0171\u0173]/g, w: /[\u0175]/g, y: /[\xFD\xFF\u0177]/g, z: /[\u017A\u017C\u017E]/g };
    for (let n in e) t = t.replace(e[n], n);
  }
  return t;
}
function $i(t) {
  return V(t, !1) ? t[0].toUpperCase() + t.slice(1) : t;
}
function jn(t) {
  return V(t) ? t.replace(/(_)/g, "-").replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() : t;
}
function vt() {
  let t = /* @__PURE__ */ new Map();
  return { on(e, n) {
    let r = t.get(e);
    return r ? r.push(n) : r = [n], t.set(e, r), this;
  }, off(e, n) {
    let r = t.get(e);
    return r && r.splice(r.indexOf(n) >>> 0, 1), this;
  }, emit(e, n) {
    let r = t.get(e);
    r && r.forEach((i) => {
      i(n);
    });
  }, clear() {
    t.clear();
  } };
}
function yt(...t) {
  if (t) {
    let e = [];
    for (let n = 0; n < t.length; n++) {
      let r = t[n];
      if (!r) continue;
      let i = typeof r;
      if (i === "string" || i === "number") e.push(r);
      else if (i === "object") {
        let o = Array.isArray(r) ? [yt(...r)] : Object.entries(r).map(([a, l]) => l ? a : void 0);
        e = o.length ? e.concat(o.filter((a) => !!a)) : e;
      }
    }
    return e.join(" ").trim();
  }
}
function Oi(t, e) {
  return t ? t.classList ? t.classList.contains(e) : new RegExp("(^| )" + e + "( |$)", "gi").test(t.className) : !1;
}
function Ci(t, e) {
  if (t && e) {
    let n = (r) => {
      Oi(t, r) || (t.classList ? t.classList.add(r) : t.className += " " + r);
    };
    [e].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Xe(t, e) {
  if (t && e) {
    let n = (r) => {
      t.classList ? t.classList.remove(r) : t.className = t.className.replace(new RegExp("(^|\\b)" + r.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };
    [e].flat().filter(Boolean).forEach((r) => r.split(" ").forEach(n));
  }
}
function Dt(t) {
  for (let e of document?.styleSheets) try {
    for (let n of e?.cssRules) for (let r of n?.style) if (t.test(r)) return { name: r, value: n.style.getPropertyValue(r).trim() };
  } catch {
  }
  return null;
}
function Ti(t) {
  let e = { width: 0, height: 0 };
  if (t) {
    let [n, r] = [t.style.visibility, t.style.display], i = t.getBoundingClientRect();
    t.style.visibility = "hidden", t.style.display = "block", e.width = i.width || t.offsetWidth, e.height = i.height || t.offsetHeight, t.style.display = r, t.style.visibility = n;
  }
  return e;
}
function Pi() {
  let t = window, e = document, n = e.documentElement, r = e.getElementsByTagName("body")[0], i = t.innerWidth || n.clientWidth || r.clientWidth, o = t.innerHeight || n.clientHeight || r.clientHeight;
  return { width: i, height: o };
}
function at(t) {
  return t ? Math.abs(t.scrollLeft) : 0;
}
function xi() {
  let t = document.documentElement;
  return (window.pageXOffset || at(t)) - (t.clientLeft || 0);
}
function ki() {
  let t = document.documentElement;
  return (window.pageYOffset || t.scrollTop) - (t.clientTop || 0);
}
function Li(t) {
  return t ? getComputedStyle(t).direction === "rtl" : !1;
}
function Ei(t, e, n = !0) {
  var r, i, o, a;
  if (t) {
    let l = t.offsetParent ? { width: t.offsetWidth, height: t.offsetHeight } : Ti(t), s = l.height, u = l.width, c = e.offsetHeight, d = e.offsetWidth, m = e.getBoundingClientRect(), f = ki(), p = xi(), v = Pi(), g, y, _ = "top";
    m.top + c + s > v.height ? (g = m.top + f - s, _ = "bottom", g < 0 && (g = f)) : g = c + m.top + f, m.left + u > v.width ? y = Math.max(0, m.left + p + d - u) : y = m.left + p, Li(t) ? t.style.insetInlineEnd = y + "px" : t.style.insetInlineStart = y + "px", t.style.top = g + "px", t.style.transformOrigin = _, n && (t.style.marginTop = _ === "bottom" ? `calc(${(i = (r = Dt(/-anchor-gutter$/)) == null ? void 0 : r.value) != null ? i : "2px"} * -1)` : (a = (o = Dt(/-anchor-gutter$/)) == null ? void 0 : o.value) != null ? a : "");
  }
}
function Ai(t, e) {
  t && (typeof e == "string" ? t.style.cssText = e : Object.entries(e || {}).forEach(([n, r]) => t.style[n] = r));
}
function ze(t, e) {
  return t instanceof HTMLElement ? t.offsetWidth : 0;
}
function Nn(t) {
  if (t) {
    let e = t.parentNode;
    return e && e instanceof ShadowRoot && e.host && (e = e.host), e;
  }
  return null;
}
function Ii(t) {
  return !!(t !== null && typeof t < "u" && t.nodeName && Nn(t));
}
function ye(t) {
  return typeof Element < "u" ? t instanceof Element : t !== null && typeof t == "object" && t.nodeType === 1 && typeof t.nodeName == "string";
}
function Xs() {
  if (window.getSelection) {
    let t = window.getSelection() || {};
    t.empty ? t.empty() : t.removeAllRanges && t.rangeCount > 0 && t.getRangeAt(0).getClientRects().length > 0 && t.removeAllRanges();
  }
}
function We(t, e = {}) {
  if (ye(t)) {
    let n = (r, i) => {
      var o, a;
      let l = (o = t?.$attrs) != null && o[r] ? [(a = t?.$attrs) == null ? void 0 : a[r]] : [];
      return [i].flat().reduce((s, u) => {
        if (u != null) {
          let c = typeof u;
          if (c === "string" || c === "number") s.push(u);
          else if (c === "object") {
            let d = Array.isArray(u) ? n(r, u) : Object.entries(u).map(([m, f]) => r === "style" && (f || f === 0) ? `${m.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()}:${f}` : f ? m : void 0);
            s = d.length ? s.concat(d.filter((m) => !!m)) : s;
          }
        }
        return s;
      }, l);
    };
    Object.entries(e).forEach(([r, i]) => {
      if (i != null) {
        let o = r.match(/^on(.+)/);
        o ? t.addEventListener(o[1].toLowerCase(), i) : r === "p-bind" || r === "pBind" ? We(t, i) : (i = r === "class" ? [...new Set(n("class", i))].join(" ").trim() : r === "style" ? n("style", i).join(";").trim() : i, (t.$attrs = t.$attrs || {}) && (t.$attrs[r] = i), t.setAttribute(r, i));
      }
    });
  }
}
function ji(t, e = {}, ...n) {
  {
    let r = document.createElement(t);
    return We(r, e), r.append(...n), r;
  }
}
function Se(t, e) {
  return ye(t) ? Array.from(t.querySelectorAll(e)) : [];
}
function Ke(t, e) {
  return ye(t) ? t.matches(e) ? t : t.querySelector(e) : null;
}
function Ve(t, e) {
  t && document.activeElement !== t && t.focus(e);
}
function Ni(t, e) {
  if (ye(t)) {
    let n = t.getAttribute(e);
    return isNaN(n) ? n === "true" || n === "false" ? n === "true" : n : +n;
  }
}
function Ri(t, e = "") {
  let n = Se(t, `button:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [href]:not([tabindex = "-1"]):not([style*="display:none"]):not([hidden])${e},
            input:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            select:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            textarea:not([tabindex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [tabIndex]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e},
            [contenteditable]:not([tabIndex = "-1"]):not([disabled]):not([style*="display:none"]):not([hidden])${e}`), r = [];
  for (let i of n) getComputedStyle(i).display != "none" && getComputedStyle(i).visibility != "hidden" && r.push(i);
  return r;
}
function ea(t, e) {
  let n = Ri(t, e);
  return n.length > 0 ? n[0] : null;
}
function Mt(t) {
  if (t) {
    let e = t.offsetHeight, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingTop) + parseFloat(n.paddingBottom) + parseFloat(n.borderTopWidth) + parseFloat(n.borderBottomWidth), e;
  }
  return 0;
}
function Vi(t) {
  if (t) {
    let e = t.getBoundingClientRect();
    return { top: e.top + (window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0), left: e.left + (window.pageXOffset || at(document.documentElement) || at(document.body) || 0) };
  }
  return { top: "auto", left: "auto" };
}
function Di(t, e) {
  return t ? t.offsetHeight : 0;
}
function Rn(t, e = []) {
  let n = Nn(t);
  return n === null ? e : Rn(n, e.concat([n]));
}
function Mi(t) {
  let e = [];
  if (t) {
    let n = Rn(t), r = /(auto|scroll)/, i = (o) => {
      try {
        let a = window.getComputedStyle(o, null);
        return r.test(a.getPropertyValue("overflow")) || r.test(a.getPropertyValue("overflowX")) || r.test(a.getPropertyValue("overflowY"));
      } catch {
        return !1;
      }
    };
    for (let o of n) {
      let a = o.nodeType === 1 && o.dataset.scrollselectors;
      if (a) {
        let l = a.split(",");
        for (let s of l) {
          let u = Ke(o, s);
          u && i(u) && e.push(u);
        }
      }
      o.nodeType !== 9 && i(o) && e.push(o);
    }
  }
  return e;
}
function ta() {
  if (window.getSelection) return window.getSelection().toString();
  if (document.getSelection) return document.getSelection().toString();
}
function Ft(t) {
  if (t) {
    let e = t.offsetWidth, n = getComputedStyle(t);
    return e -= parseFloat(n.paddingLeft) + parseFloat(n.paddingRight) + parseFloat(n.borderLeftWidth) + parseFloat(n.borderRightWidth), e;
  }
  return 0;
}
function Vn() {
  return !!(typeof window < "u" && window.document && window.document.createElement);
}
function na(t) {
  return !!(t && t.offsetParent != null);
}
function Fi() {
  return "ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
}
function Hi(t, e = "", n) {
  ye(t) && n !== null && n !== void 0 && t.setAttribute(e, n);
}
var De = {};
function Bi(t = "pui_id_") {
  return Object.hasOwn(De, t) || (De[t] = 0), De[t]++, `${t}${De[t]}`;
}
function Ui() {
  let t = [], e = (a, l, s = 999) => {
    let u = i(a, l, s), c = u.value + (u.key === a ? 0 : s) + 1;
    return t.push({ key: a, value: c }), c;
  }, n = (a) => {
    t = t.filter((l) => l.value !== a);
  }, r = (a, l) => i(a).value, i = (a, l, s = 0) => [...t].reverse().find((u) => !0) || { key: a, value: s }, o = (a) => a && parseInt(a.style.zIndex, 10) || 0;
  return { get: o, set: (a, l, s) => {
    l && (l.style.zIndex = String(e(a, !0, s)));
  }, clear: (a) => {
    a && (n(o(a)), a.style.zIndex = "");
  }, getCurrent: (a) => r(a) };
}
var et = Ui(), zi = Object.defineProperty, Wi = Object.defineProperties, Ki = Object.getOwnPropertyDescriptors, Ye = Object.getOwnPropertySymbols, Dn = Object.prototype.hasOwnProperty, Mn = Object.prototype.propertyIsEnumerable, Ht = (t, e, n) => e in t ? zi(t, e, { enumerable: !0, configurable: !0, writable: !0, value: n }) : t[e] = n, F = (t, e) => {
  for (var n in e || (e = {})) Dn.call(e, n) && Ht(t, n, e[n]);
  if (Ye) for (var n of Ye(e)) Mn.call(e, n) && Ht(t, n, e[n]);
  return t;
}, tt = (t, e) => Wi(t, Ki(e)), Y = (t, e) => {
  var n = {};
  for (var r in t) Dn.call(t, r) && e.indexOf(r) < 0 && (n[r] = t[r]);
  if (t != null && Ye) for (var r of Ye(t)) e.indexOf(r) < 0 && Mn.call(t, r) && (n[r] = t[r]);
  return n;
}, Yi = vt(), I = Yi, Oe = /{([^}]*)}/g, Fn = /(\d+\s+[\+\-\*\/]\s+\d+)/g, Hn = /var\([^)]+\)/g;
function Bt(t) {
  return V(t) ? t.replace(/[A-Z]/g, (e, n) => n === 0 ? e : "." + e.toLowerCase()).toLowerCase() : t;
}
function qi(t) {
  return z(t) && t.hasOwnProperty("$value") && t.hasOwnProperty("$type") ? t.$value : t;
}
function Gi(t) {
  return t.replaceAll(/ /g, "").replace(/[^\w]/g, "-");
}
function lt(t = "", e = "") {
  return Gi(`${V(t, !1) && V(e, !1) ? `${t}-` : t}${e}`);
}
function Bn(t = "", e = "") {
  return `--${lt(t, e)}`;
}
function Zi(t = "") {
  let e = (t.match(/{/g) || []).length, n = (t.match(/}/g) || []).length;
  return (e + n) % 2 !== 0;
}
function Un(t, e = "", n = "", r = [], i) {
  if (V(t)) {
    let o = t.trim();
    if (Zi(o)) return;
    if (le(o, Oe)) {
      let a = o.replaceAll(Oe, (l) => {
        let s = l.replace(/{|}/g, "").split(".").filter((u) => !r.some((c) => le(u, c)));
        return `var(${Bn(n, jn(s.join("-")))}${T(i) ? `, ${i}` : ""})`;
      });
      return le(a.replace(Hn, "0"), Fn) ? `calc(${a})` : a;
    }
    return o;
  } else if (Si(t)) return t;
}
function Ji(t, e, n) {
  V(e, !1) && t.push(`${e}:${n};`);
}
function pe(t, e) {
  return t ? `${t}{${e}}` : "";
}
function zn(t, e) {
  if (t.indexOf("dt(") === -1) return t;
  function n(a, l) {
    let s = [], u = 0, c = "", d = null, m = 0;
    for (; u <= a.length; ) {
      let f = a[u];
      if ((f === '"' || f === "'" || f === "`") && a[u - 1] !== "\\" && (d = d === f ? null : f), !d && (f === "(" && m++, f === ")" && m--, (f === "," || u === a.length) && m === 0)) {
        let p = c.trim();
        p.startsWith("dt(") ? s.push(zn(p, l)) : s.push(r(p)), c = "", u++;
        continue;
      }
      f !== void 0 && (c += f), u++;
    }
    return s;
  }
  function r(a) {
    let l = a[0];
    if ((l === '"' || l === "'" || l === "`") && a[a.length - 1] === l) return a.slice(1, -1);
    let s = Number(a);
    return isNaN(s) ? a : s;
  }
  let i = [], o = [];
  for (let a = 0; a < t.length; a++) if (t[a] === "d" && t.slice(a, a + 3) === "dt(") o.push(a), a += 2;
  else if (t[a] === ")" && o.length > 0) {
    let l = o.pop();
    o.length === 0 && i.push([l, a]);
  }
  if (!i.length) return t;
  for (let a = i.length - 1; a >= 0; a--) {
    let [l, s] = i[a], u = t.slice(l + 3, s), c = n(u, e), d = e(...c);
    t = t.slice(0, l) + d + t.slice(s + 1);
  }
  return t;
}
var ue = (...t) => Qi(C.getTheme(), ...t), Qi = (t = {}, e, n, r) => {
  if (e) {
    let { variable: i, options: o } = C.defaults || {}, { prefix: a, transform: l } = t?.options || o || {}, s = le(e, Oe) ? e : `{${e}}`;
    return r === "value" || Ie(r) && l === "strict" ? C.getTokenValue(e) : Un(s, void 0, a, [i.excludedKeyRegex], n);
  }
  return "";
};
function Me(t, ...e) {
  if (t instanceof Array) {
    let n = t.reduce((r, i, o) => {
      var a;
      return r + i + ((a = R(e[o], { dt: ue })) != null ? a : "");
    }, "");
    return zn(n, ue);
  }
  return R(t, { dt: ue });
}
function Xi(t, e = {}) {
  let n = C.defaults.variable, { prefix: r = n.prefix, selector: i = n.selector, excludedKeyRegex: o = n.excludedKeyRegex } = e, a = [], l = [], s = [{ node: t, path: r }];
  for (; s.length; ) {
    let { node: c, path: d } = s.pop();
    for (let m in c) {
      let f = c[m], p = qi(f), v = le(m, o) ? lt(d) : lt(d, jn(m));
      if (z(p)) s.push({ node: p, path: v });
      else {
        let g = Bn(v), y = Un(p, v, r, [o]);
        Ji(l, g, y);
        let _ = v;
        r && _.startsWith(r + "-") && (_ = _.slice(r.length + 1)), a.push(_.replace(/-/g, "."));
      }
    }
  }
  let u = l.join("");
  return { value: l, tokens: a, declarations: u, css: pe(i, u) };
}
var M = { regex: { rules: { class: { pattern: /^\.([a-zA-Z][\w-]*)$/, resolve(t) {
  return { type: "class", selector: t, matched: this.pattern.test(t.trim()) };
} }, attr: { pattern: /^\[(.*)\]$/, resolve(t) {
  return { type: "attr", selector: `:root${t},:host${t}`, matched: this.pattern.test(t.trim()) };
} }, media: { pattern: /^@media (.*)$/, resolve(t) {
  return { type: "media", selector: t, matched: this.pattern.test(t.trim()) };
} }, system: { pattern: /^system$/, resolve(t) {
  return { type: "system", selector: "@media (prefers-color-scheme: dark)", matched: this.pattern.test(t.trim()) };
} }, custom: { resolve(t) {
  return { type: "custom", selector: t, matched: !0 };
} } }, resolve(t) {
  let e = Object.keys(this.rules).filter((n) => n !== "custom").map((n) => this.rules[n]);
  return [t].flat().map((n) => {
    var r;
    return (r = e.map((i) => i.resolve(n)).find((i) => i.matched)) != null ? r : this.rules.custom.resolve(n);
  });
} }, _toVariables(t, e) {
  return Xi(t, { prefix: e?.prefix });
}, getCommon({ name: t = "", theme: e = {}, params: n, set: r, defaults: i }) {
  var o, a, l, s, u, c, d;
  let { preset: m, options: f } = e, p, v, g, y, _, w, h;
  if (T(m) && f.transform !== "strict") {
    let { primitive: b, semantic: k, extend: A } = m, G = k || {}, { colorScheme: Z } = G, te = Y(G, ["colorScheme"]), J = A || {}, { colorScheme: ne } = J, re = Y(J, ["colorScheme"]), Q = Z || {}, { dark: ie } = Q, de = Y(Q, ["dark"]), oe = ne || {}, { dark: ce } = oe, me = Y(oe, ["dark"]), W = T(b) ? this._toVariables({ primitive: b }, f) : {}, H = T(te) ? this._toVariables({ semantic: te }, f) : {}, se = T(de) ? this._toVariables({ light: de }, f) : {}, je = T(ie) ? this._toVariables({ dark: ie }, f) : {}, fe = T(re) ? this._toVariables({ semantic: re }, f) : {}, $t = T(me) ? this._toVariables({ light: me }, f) : {}, Ot = T(ce) ? this._toVariables({ dark: ce }, f) : {}, [Xn, er] = [(o = W.declarations) != null ? o : "", W.tokens], [tr, nr] = [(a = H.declarations) != null ? a : "", H.tokens || []], [rr, ir] = [(l = se.declarations) != null ? l : "", se.tokens || []], [or, sr] = [(s = je.declarations) != null ? s : "", je.tokens || []], [ar, lr] = [(u = fe.declarations) != null ? u : "", fe.tokens || []], [ur, dr] = [(c = $t.declarations) != null ? c : "", $t.tokens || []], [cr, mr] = [(d = Ot.declarations) != null ? d : "", Ot.tokens || []];
    p = this.transformCSS(t, Xn, "light", "variable", f, r, i), v = er;
    let fr = this.transformCSS(t, `${tr}${rr}`, "light", "variable", f, r, i), pr = this.transformCSS(t, `${or}`, "dark", "variable", f, r, i);
    g = `${fr}${pr}`, y = [.../* @__PURE__ */ new Set([...nr, ...ir, ...sr])];
    let hr = this.transformCSS(t, `${ar}${ur}color-scheme:light`, "light", "variable", f, r, i), gr = this.transformCSS(t, `${cr}color-scheme:dark`, "dark", "variable", f, r, i);
    _ = `${hr}${gr}`, w = [.../* @__PURE__ */ new Set([...lr, ...dr, ...mr])], h = R(m.css, { dt: ue });
  }
  return { primitive: { css: p, tokens: v }, semantic: { css: g, tokens: y }, global: { css: _, tokens: w }, style: h };
}, getPreset({ name: t = "", preset: e = {}, options: n, params: r, set: i, defaults: o, selector: a }) {
  var l, s, u;
  let c, d, m;
  if (T(e) && n.transform !== "strict") {
    let f = t.replace("-directive", ""), p = e, { colorScheme: v, extend: g, css: y } = p, _ = Y(p, ["colorScheme", "extend", "css"]), w = g || {}, { colorScheme: h } = w, b = Y(w, ["colorScheme"]), k = v || {}, { dark: A } = k, G = Y(k, ["dark"]), Z = h || {}, { dark: te } = Z, J = Y(Z, ["dark"]), ne = T(_) ? this._toVariables({ [f]: F(F({}, _), b) }, n) : {}, re = T(G) ? this._toVariables({ [f]: F(F({}, G), J) }, n) : {}, Q = T(A) ? this._toVariables({ [f]: F(F({}, A), te) }, n) : {}, [ie, de] = [(l = ne.declarations) != null ? l : "", ne.tokens || []], [oe, ce] = [(s = re.declarations) != null ? s : "", re.tokens || []], [me, W] = [(u = Q.declarations) != null ? u : "", Q.tokens || []], H = this.transformCSS(f, `${ie}${oe}`, "light", "variable", n, i, o, a), se = this.transformCSS(f, me, "dark", "variable", n, i, o, a);
    c = `${H}${se}`, d = [.../* @__PURE__ */ new Set([...de, ...ce, ...W])], m = R(y, { dt: ue });
  }
  return { css: c, tokens: d, style: m };
}, getPresetC({ name: t = "", theme: e = {}, params: n, set: r, defaults: i }) {
  var o;
  let { preset: a, options: l } = e, s = (o = a?.components) == null ? void 0 : o[t];
  return this.getPreset({ name: t, preset: s, options: l, params: n, set: r, defaults: i });
}, getPresetD({ name: t = "", theme: e = {}, params: n, set: r, defaults: i }) {
  var o, a;
  let l = t.replace("-directive", ""), { preset: s, options: u } = e, c = ((o = s?.components) == null ? void 0 : o[l]) || ((a = s?.directives) == null ? void 0 : a[l]);
  return this.getPreset({ name: l, preset: c, options: u, params: n, set: r, defaults: i });
}, applyDarkColorScheme(t) {
  return !(t.darkModeSelector === "none" || t.darkModeSelector === !1);
}, getColorSchemeOption(t, e) {
  var n;
  return this.applyDarkColorScheme(t) ? this.regex.resolve(t.darkModeSelector === !0 ? e.options.darkModeSelector : (n = t.darkModeSelector) != null ? n : e.options.darkModeSelector) : [];
}, getLayerOrder(t, e = {}, n, r) {
  let { cssLayer: i } = e;
  return i ? `@layer ${R(i.order || i.name || "primeui", n)}` : "";
}, getCommonStyleSheet({ name: t = "", theme: e = {}, params: n, props: r = {}, set: i, defaults: o }) {
  let a = this.getCommon({ name: t, theme: e, params: n, set: i, defaults: o }), l = Object.entries(r).reduce((s, [u, c]) => s.push(`${u}="${c}"`) && s, []).join(" ");
  return Object.entries(a || {}).reduce((s, [u, c]) => {
    if (z(c) && Object.hasOwn(c, "css")) {
      let d = $e(c.css), m = `${u}-variables`;
      s.push(`<style type="text/css" data-primevue-style-id="${m}" ${l}>${d}</style>`);
    }
    return s;
  }, []).join("");
}, getStyleSheet({ name: t = "", theme: e = {}, params: n, props: r = {}, set: i, defaults: o }) {
  var a;
  let l = { name: t, theme: e, params: n, set: i, defaults: o }, s = (a = t.includes("-directive") ? this.getPresetD(l) : this.getPresetC(l)) == null ? void 0 : a.css, u = Object.entries(r).reduce((c, [d, m]) => c.push(`${d}="${m}"`) && c, []).join(" ");
  return s ? `<style type="text/css" data-primevue-style-id="${t}-variables" ${u}>${$e(s)}</style>` : "";
}, createTokens(t = {}, e, n = "", r = "", i = {}) {
  let o = function(l, s = {}, u = []) {
    if (u.includes(this.path)) return console.warn(`Circular reference detected at ${this.path}`), { colorScheme: l, path: this.path, paths: s, value: void 0 };
    u.push(this.path), s.name = this.path, s.binding || (s.binding = {});
    let c = this.value;
    if (typeof this.value == "string" && Oe.test(this.value)) {
      let d = this.value.trim().replace(Oe, (m) => {
        var f;
        let p = m.slice(1, -1), v = this.tokens[p];
        if (!v) return console.warn(`Token not found for path: ${p}`), "__UNRESOLVED__";
        let g = v.computed(l, s, u);
        return Array.isArray(g) && g.length === 2 ? `light-dark(${g[0].value},${g[1].value})` : (f = g?.value) != null ? f : "__UNRESOLVED__";
      });
      c = Fn.test(d.replace(Hn, "0")) ? `calc(${d})` : d;
    }
    return Ie(s.binding) && delete s.binding, u.pop(), { colorScheme: l, path: this.path, paths: s, value: c.includes("__UNRESOLVED__") ? void 0 : c };
  }, a = (l, s, u) => {
    Object.entries(l).forEach(([c, d]) => {
      let m = le(c, e.variable.excludedKeyRegex) ? s : s ? `${s}.${Bt(c)}` : Bt(c), f = u ? `${u}.${c}` : c;
      z(d) ? a(d, m, f) : (i[m] || (i[m] = { paths: [], computed: (p, v = {}, g = []) => {
        if (i[m].paths.length === 1) return i[m].paths[0].computed(i[m].paths[0].scheme, v.binding, g);
        if (p && p !== "none") for (let y = 0; y < i[m].paths.length; y++) {
          let _ = i[m].paths[y];
          if (_.scheme === p) return _.computed(p, v.binding, g);
        }
        return i[m].paths.map((y) => y.computed(y.scheme, v[y.scheme], g));
      } }), i[m].paths.push({ path: f, value: d, scheme: f.includes("colorScheme.light") ? "light" : f.includes("colorScheme.dark") ? "dark" : "none", computed: o, tokens: i }));
    });
  };
  return a(t, n, r), i;
}, getTokenValue(t, e, n) {
  var r;
  let i = ((l) => l.split(".").filter((s) => !le(s.toLowerCase(), n.variable.excludedKeyRegex)).join("."))(e), o = e.includes("colorScheme.light") ? "light" : e.includes("colorScheme.dark") ? "dark" : void 0, a = [(r = t[i]) == null ? void 0 : r.computed(o)].flat().filter((l) => l);
  return a.length === 1 ? a[0].value : a.reduce((l = {}, s) => {
    let u = s, { colorScheme: c } = u, d = Y(u, ["colorScheme"]);
    return l[c] = d, l;
  }, void 0);
}, getSelectorRule(t, e, n, r) {
  return n === "class" || n === "attr" ? pe(T(e) ? `${t}${e},${t} ${e}` : t, r) : pe(t, pe(e ?? ":root,:host", r));
}, transformCSS(t, e, n, r, i = {}, o, a, l) {
  if (T(e)) {
    let { cssLayer: s } = i;
    if (r !== "style") {
      let u = this.getColorSchemeOption(i, a);
      e = n === "dark" ? u.reduce((c, { type: d, selector: m }) => (T(m) && (c += m.includes("[CSS]") ? m.replace("[CSS]", e) : this.getSelectorRule(m, l, d, e)), c), "") : pe(l ?? ":root,:host", e);
    }
    if (s) {
      let u = { name: "primeui" };
      z(s) && (u.name = R(s.name, { name: t, type: r })), T(u.name) && (e = pe(`@layer ${u.name}`, e), o?.layerNames(u.name));
    }
    return e;
  }
  return "";
} }, C = { defaults: { variable: { prefix: "p", selector: ":root,:host", excludedKeyRegex: /^(primitive|semantic|components|directives|variables|colorscheme|light|dark|common|root|states|extend|css)$/gi }, options: { prefix: "p", darkModeSelector: "system", cssLayer: !1 } }, _theme: void 0, _layerNames: /* @__PURE__ */ new Set(), _loadedStyleNames: /* @__PURE__ */ new Set(), _loadingStyles: /* @__PURE__ */ new Set(), _tokens: {}, update(t = {}) {
  let { theme: e } = t;
  e && (this._theme = tt(F({}, e), { options: F(F({}, this.defaults.options), e.options) }), this._tokens = M.createTokens(this.preset, this.defaults), this.clearLoadedStyleNames());
}, get theme() {
  return this._theme;
}, get preset() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.preset) || {};
}, get options() {
  var t;
  return ((t = this.theme) == null ? void 0 : t.options) || {};
}, get tokens() {
  return this._tokens;
}, getTheme() {
  return this.theme;
}, setTheme(t) {
  this.update({ theme: t }), I.emit("theme:change", t);
}, getPreset() {
  return this.preset;
}, setPreset(t) {
  this._theme = tt(F({}, this.theme), { preset: t }), this._tokens = M.createTokens(t, this.defaults), this.clearLoadedStyleNames(), I.emit("preset:change", t), I.emit("theme:change", this.theme);
}, getOptions() {
  return this.options;
}, setOptions(t) {
  this._theme = tt(F({}, this.theme), { options: t }), this.clearLoadedStyleNames(), I.emit("options:change", t), I.emit("theme:change", this.theme);
}, getLayerNames() {
  return [...this._layerNames];
}, setLayerNames(t) {
  this._layerNames.add(t);
}, getLoadedStyleNames() {
  return this._loadedStyleNames;
}, isStyleNameLoaded(t) {
  return this._loadedStyleNames.has(t);
}, setLoadedStyleName(t) {
  this._loadedStyleNames.add(t);
}, deleteLoadedStyleName(t) {
  this._loadedStyleNames.delete(t);
}, clearLoadedStyleNames() {
  this._loadedStyleNames.clear();
}, getTokenValue(t) {
  return M.getTokenValue(this.tokens, t, this.defaults);
}, getCommon(t = "", e) {
  return M.getCommon({ name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getComponent(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetC(n);
}, getDirective(t = "", e) {
  let n = { name: t, theme: this.theme, params: e, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPresetD(n);
}, getCustomPreset(t = "", e, n, r) {
  let i = { name: t, preset: e, options: this.options, selector: n, params: r, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } };
  return M.getPreset(i);
}, getLayerOrderCSS(t = "") {
  return M.getLayerOrder(t, this.options, { names: this.getLayerNames() }, this.defaults);
}, transformCSS(t = "", e, n = "style", r) {
  return M.transformCSS(t, e, r, n, this.options, { layerNames: this.setLayerNames.bind(this) }, this.defaults);
}, getCommonStyleSheet(t = "", e, n = {}) {
  return M.getCommonStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, getStyleSheet(t, e, n = {}) {
  return M.getStyleSheet({ name: t, theme: this.theme, params: e, props: n, defaults: this.defaults, set: { layerNames: this.setLayerNames.bind(this) } });
}, onStyleMounted(t) {
  this._loadingStyles.add(t);
}, onStyleUpdated(t) {
  this._loadingStyles.add(t);
}, onStyleLoaded(t, { name: e }) {
  this._loadingStyles.size && (this._loadingStyles.delete(e), I.emit(`theme:${e}:load`, t), !this._loadingStyles.size && I.emit("theme:load"));
} }, j = {
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
};
function Ut(t, e) {
  var n = typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (!n) {
    if (Array.isArray(t) || (n = eo(t)) || e) {
      n && (t = n);
      var r = 0, i = function() {
      };
      return { s: i, n: function() {
        return r >= t.length ? { done: !0 } : { done: !1, value: t[r++] };
      }, e: function(u) {
        throw u;
      }, f: i };
    }
    throw new TypeError(`Invalid attempt to iterate non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
  }
  var o, a = !0, l = !1;
  return { s: function() {
    n = n.call(t);
  }, n: function() {
    var u = n.next();
    return a = u.done, u;
  }, e: function(u) {
    l = !0, o = u;
  }, f: function() {
    try {
      a || n.return == null || n.return();
    } finally {
      if (l) throw o;
    }
  } };
}
function eo(t, e) {
  if (t) {
    if (typeof t == "string") return zt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? zt(t, e) : void 0;
  }
}
function zt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
var ra = {
  filter: function(e, n, r, i, o) {
    var a = [];
    if (!e)
      return a;
    var l = Ut(e), s;
    try {
      for (l.s(); !(s = l.n()).done; ) {
        var u = s.value;
        if (typeof u == "string") {
          if (this.filters[i](u, r, o)) {
            a.push(u);
            continue;
          }
        } else {
          var c = Ut(n), d;
          try {
            for (c.s(); !(d = c.n()).done; ) {
              var m = d.value, f = st(u, m);
              if (this.filters[i](f, r, o)) {
                a.push(u);
                break;
              }
            }
          } catch (p) {
            c.e(p);
          } finally {
            c.f();
          }
        }
      }
    } catch (p) {
      l.e(p);
    } finally {
      l.f();
    }
    return a;
  },
  filters: {
    startsWith: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var i = D(n.toString()).toLocaleLowerCase(r), o = D(e.toString()).toLocaleLowerCase(r);
      return o.slice(0, i.length) === i;
    },
    contains: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var i = D(n.toString()).toLocaleLowerCase(r), o = D(e.toString()).toLocaleLowerCase(r);
      return o.indexOf(i) !== -1;
    },
    notContains: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var i = D(n.toString()).toLocaleLowerCase(r), o = D(e.toString()).toLocaleLowerCase(r);
      return o.indexOf(i) === -1;
    },
    endsWith: function(e, n, r) {
      if (n == null || n === "")
        return !0;
      if (e == null)
        return !1;
      var i = D(n.toString()).toLocaleLowerCase(r), o = D(e.toString()).toLocaleLowerCase(r);
      return o.indexOf(i, o.length - i.length) !== -1;
    },
    equals: function(e, n, r) {
      return n == null || n === "" ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() === n.getTime() : D(e.toString()).toLocaleLowerCase(r) == D(n.toString()).toLocaleLowerCase(r);
    },
    notEquals: function(e, n, r) {
      return n == null || n === "" ? !1 : e == null ? !0 : e.getTime && n.getTime ? e.getTime() !== n.getTime() : D(e.toString()).toLocaleLowerCase(r) != D(n.toString()).toLocaleLowerCase(r);
    },
    in: function(e, n) {
      if (n == null || n.length === 0)
        return !0;
      for (var r = 0; r < n.length; r++)
        if (bi(e, n[r]))
          return !0;
      return !1;
    },
    between: function(e, n) {
      return n == null || n[0] == null || n[1] == null ? !0 : e == null ? !1 : e.getTime ? n[0].getTime() <= e.getTime() && e.getTime() <= n[1].getTime() : n[0] <= e && e <= n[1];
    },
    lt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() < n.getTime() : e < n;
    },
    lte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() <= n.getTime() : e <= n;
    },
    gt: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() > n.getTime() : e > n;
    },
    gte: function(e, n) {
      return n == null ? !0 : e == null ? !1 : e.getTime && n.getTime ? e.getTime() >= n.getTime() : e >= n;
    },
    dateIs: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() === n.toDateString());
    },
    dateIsNot: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.toDateString() !== n.toDateString());
    },
    dateBefore: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() < n.getTime());
    },
    dateAfter: function(e, n) {
      return n == null ? !0 : e == null ? !1 : (typeof e == "string" && (e = new Date(e)), typeof n == "string" && (n = new Date(n)), e.getTime() > n.getTime());
    }
  },
  register: function(e, n) {
    this.filters[e] = n;
  }
}, to = `
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
function Ce(t) {
  "@babel/helpers - typeof";
  return Ce = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ce(t);
}
function Wt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function Kt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Wt(Object(n), !0).forEach(function(r) {
      no(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Wt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function no(t, e, n) {
  return (e = ro(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function ro(t) {
  var e = io(t, "string");
  return Ce(e) == "symbol" ? e : e + "";
}
function io(t, e) {
  if (Ce(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Ce(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function oo(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0;
  Ct() && Ct().components ? bn(t) : e ? t() : $r(t);
}
var so = 0;
function ao(t) {
  var e = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, n = q(!1), r = q(t), i = q(null), o = Vn() ? window.document : void 0, a = e.document, l = a === void 0 ? o : a, s = e.immediate, u = s === void 0 ? !0 : s, c = e.manual, d = c === void 0 ? !1 : c, m = e.name, f = m === void 0 ? "style_".concat(++so) : m, p = e.id, v = p === void 0 ? void 0 : p, g = e.media, y = g === void 0 ? void 0 : g, _ = e.nonce, w = _ === void 0 ? void 0 : _, h = e.first, b = h === void 0 ? !1 : h, k = e.onMounted, A = k === void 0 ? void 0 : k, G = e.onUpdated, Z = G === void 0 ? void 0 : G, te = e.onLoad, J = te === void 0 ? void 0 : te, ne = e.props, re = ne === void 0 ? {} : ne, Q = function() {
  }, ie = function(ce) {
    var me = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (l) {
      var W = Kt(Kt({}, re), me), H = W.name || f, se = W.id || v, je = W.nonce || w;
      i.value = l.querySelector('style[data-primevue-style-id="'.concat(H, '"]')) || l.getElementById(se) || l.createElement("style"), i.value.isConnected || (r.value = ce || t, We(i.value, {
        type: "text/css",
        id: se,
        media: y,
        nonce: je
      }), b ? l.head.prepend(i.value) : l.head.appendChild(i.value), Hi(i.value, "data-primevue-style-id", H), We(i.value, W), i.value.onload = function(fe) {
        return J?.(fe, {
          name: H
        });
      }, A?.(H)), !n.value && (Q = he(r, function(fe) {
        i.value.textContent = fe, Z?.(H);
      }, {
        immediate: !0
      }), n.value = !0);
    }
  }, de = function() {
    !l || !n.value || (Q(), Ii(i.value) && l.head.removeChild(i.value), n.value = !1, i.value = null);
  };
  return u && !d && oo(ie), {
    id: v,
    name: f,
    el: i,
    css: r,
    unload: de,
    load: ie,
    isLoaded: wr(n)
  };
}
function Te(t) {
  "@babel/helpers - typeof";
  return Te = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Te(t);
}
var Yt, qt, Gt, Zt;
function Jt(t, e) {
  return mo(t) || co(t, e) || uo(t, e) || lo();
}
function lo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function uo(t, e) {
  if (t) {
    if (typeof t == "string") return Qt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? Qt(t, e) : void 0;
  }
}
function Qt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function co(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, i, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(t)).next, e !== 0) for (; !(s = (r = o.call(n)).done) && (l.push(r.value), l.length !== e); s = !0) ;
    } catch (c) {
      u = !0, i = c;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw i;
      }
    }
    return l;
  }
}
function mo(t) {
  if (Array.isArray(t)) return t;
}
function Xt(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function nt(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? Xt(Object(n), !0).forEach(function(r) {
      fo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : Xt(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function fo(t, e, n) {
  return (e = po(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function po(t) {
  var e = ho(t, "string");
  return Te(e) == "symbol" ? e : e + "";
}
function ho(t, e) {
  if (Te(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Te(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
function Fe(t, e) {
  return e || (e = t.slice(0)), Object.freeze(Object.defineProperties(t, { raw: { value: Object.freeze(e) } }));
}
var go = function(e) {
  var n = e.dt;
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
}, vo = {}, yo = {}, x = {
  name: "base",
  css: go,
  style: to,
  classes: vo,
  inlineStyles: yo,
  load: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : function(o) {
      return o;
    }, i = r(Me(Yt || (Yt = Fe(["", ""])), e));
    return T(i) ? ao($e(i), nt({
      name: this.name
    }, n)) : {};
  },
  loadCSS: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    return this.load(this.css, e);
  },
  loadStyle: function() {
    var e = this, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "";
    return this.load(this.style, n, function() {
      var i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "";
      return C.transformCSS(n.name || e.name, "".concat(i).concat(Me(qt || (qt = Fe(["", ""])), r)));
    });
  },
  getCommonTheme: function(e) {
    return C.getCommon(this.name, e);
  },
  getComponentTheme: function(e) {
    return C.getComponent(this.name, e);
  },
  getDirectiveTheme: function(e) {
    return C.getDirective(this.name, e);
  },
  getPresetTheme: function(e, n, r) {
    return C.getCustomPreset(this.name, e, n, r);
  },
  getLayerOrderThemeCSS: function() {
    return C.getLayerOrderCSS(this.name);
  },
  getStyleSheet: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    if (this.css) {
      var r = R(this.css, {
        dt: ue
      }) || "", i = $e(Me(Gt || (Gt = Fe(["", "", ""])), r, e)), o = Object.entries(n).reduce(function(a, l) {
        var s = Jt(l, 2), u = s[0], c = s[1];
        return a.push("".concat(u, '="').concat(c, '"')) && a;
      }, []).join(" ");
      return T(i) ? '<style type="text/css" data-primevue-style-id="'.concat(this.name, '" ').concat(o, ">").concat(i, "</style>") : "";
    }
    return "";
  },
  getCommonThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
    return C.getCommonStyleSheet(this.name, e, n);
  },
  getThemeStyleSheet: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = [C.getStyleSheet(this.name, e, n)];
    if (this.style) {
      var i = this.name === "base" ? "global-style" : "".concat(this.name, "-style"), o = Me(Zt || (Zt = Fe(["", ""])), R(this.style, {
        dt: ue
      })), a = $e(C.transformCSS(i, o)), l = Object.entries(n).reduce(function(s, u) {
        var c = Jt(u, 2), d = c[0], m = c[1];
        return s.push("".concat(d, '="').concat(m, '"')) && s;
      }, []).join(" ");
      T(a) && r.push('<style type="text/css" data-primevue-style-id="'.concat(i, '" ').concat(l, ">").concat(a, "</style>"));
    }
    return r.join("");
  },
  extend: function(e) {
    return nt(nt({}, this), {}, {
      css: void 0,
      style: void 0
    }, e);
  }
}, ee = vt();
function Pe(t) {
  "@babel/helpers - typeof";
  return Pe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Pe(t);
}
function en(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function He(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? en(Object(n), !0).forEach(function(r) {
      bo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : en(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function bo(t, e, n) {
  return (e = _o(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function _o(t) {
  var e = So(t, "string");
  return Pe(e) == "symbol" ? e : e + "";
}
function So(t, e) {
  if (Pe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Pe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var wo = {
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
    text: [j.STARTS_WITH, j.CONTAINS, j.NOT_CONTAINS, j.ENDS_WITH, j.EQUALS, j.NOT_EQUALS],
    numeric: [j.EQUALS, j.NOT_EQUALS, j.LESS_THAN, j.LESS_THAN_OR_EQUAL_TO, j.GREATER_THAN, j.GREATER_THAN_OR_EQUAL_TO],
    date: [j.DATE_IS, j.DATE_IS_NOT, j.DATE_BEFORE, j.DATE_AFTER]
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
}, $o = Symbol();
function Oo(t, e) {
  var n = {
    config: Or(e)
  };
  return t.config.globalProperties.$primevue = n, t.provide($o, n), Co(), To(t, n), n;
}
var ge = [];
function Co() {
  I.clear(), ge.forEach(function(t) {
    return t?.();
  }), ge = [];
}
function To(t, e) {
  var n = q(!1), r = function() {
    var u;
    if (((u = e.config) === null || u === void 0 ? void 0 : u.theme) !== "none" && !C.isStyleNameLoaded("common")) {
      var c, d, m = ((c = x.getCommonTheme) === null || c === void 0 ? void 0 : c.call(x)) || {}, f = m.primitive, p = m.semantic, v = m.global, g = m.style, y = {
        nonce: (d = e.config) === null || d === void 0 || (d = d.csp) === null || d === void 0 ? void 0 : d.nonce
      };
      x.load(f?.css, He({
        name: "primitive-variables"
      }, y)), x.load(p?.css, He({
        name: "semantic-variables"
      }, y)), x.load(v?.css, He({
        name: "global-variables"
      }, y)), x.loadStyle(He({
        name: "global-style"
      }, y), g), C.setLoadedStyleName("common");
    }
  };
  I.on("theme:change", function(s) {
    n.value || (t.config.globalProperties.$primevue.config.theme = s, n.value = !0);
  });
  var i = he(e.config, function(s, u) {
    ee.emit("config:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), o = he(function() {
    return e.config.ripple;
  }, function(s, u) {
    ee.emit("config:ripple:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  }), a = he(function() {
    return e.config.theme;
  }, function(s, u) {
    n.value || C.setTheme(s), e.config.unstyled || r(), n.value = !1, ee.emit("config:theme:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !1
  }), l = he(function() {
    return e.config.unstyled;
  }, function(s, u) {
    !s && e.config.theme && r(), ee.emit("config:unstyled:change", {
      newValue: s,
      oldValue: u
    });
  }, {
    immediate: !0,
    deep: !0
  });
  ge.push(i), ge.push(o), ge.push(a), ge.push(l);
}
var Po = {
  install: function(e, n) {
    var r = wi(wo, n);
    Oo(e, r);
  }
}, bt = {
  name: "Portal",
  props: {
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    disabled: {
      type: Boolean,
      default: !1
    }
  },
  data: function() {
    return {
      mounted: !1
    };
  },
  mounted: function() {
    this.mounted = Vn();
  },
  computed: {
    inline: function() {
      return this.disabled || this.appendTo === "self";
    }
  }
};
function xo(t, e, n, r, i, o) {
  return o.inline ? ae(t.$slots, "default", {
    key: 0
  }) : i.mounted ? (L(), ve(_n, {
    key: 1,
    to: n.appendTo
  }, [ae(t.$slots, "default")], 8, ["to"])) : B("", !0);
}
bt.render = xo;
var X = {
  _loadedStyleNames: /* @__PURE__ */ new Set(),
  getLoadedStyleNames: function() {
    return this._loadedStyleNames;
  },
  isStyleNameLoaded: function(e) {
    return this._loadedStyleNames.has(e);
  },
  setLoadedStyleName: function(e) {
    this._loadedStyleNames.add(e);
  },
  deleteLoadedStyleName: function(e) {
    this._loadedStyleNames.delete(e);
  },
  clearLoadedStyleNames: function() {
    this._loadedStyleNames.clear();
  }
};
function ko() {
  var t = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "pc", e = Cr();
  return "".concat(t).concat(e.replace("v-", "").replaceAll("-", "_"));
}
var tn = x.extend({
  name: "common"
});
function xe(t) {
  "@babel/helpers - typeof";
  return xe = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, xe(t);
}
function Lo(t) {
  return Yn(t) || Eo(t) || Kn(t) || Wn();
}
function Eo(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function _e(t, e) {
  return Yn(t) || Ao(t, e) || Kn(t, e) || Wn();
}
function Wn() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Kn(t, e) {
  if (t) {
    if (typeof t == "string") return ut(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ut(t, e) : void 0;
  }
}
function ut(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function Ao(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, i, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(t)).next, e === 0) {
        if (Object(n) !== n) return;
        s = !1;
      } else for (; !(s = (r = o.call(n)).done) && (l.push(r.value), l.length !== e); s = !0) ;
    } catch (c) {
      u = !0, i = c;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw i;
      }
    }
    return l;
  }
}
function Yn(t) {
  if (Array.isArray(t)) return t;
}
function nn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function $(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? nn(Object(n), !0).forEach(function(r) {
      we(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : nn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function we(t, e, n) {
  return (e = Io(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Io(t) {
  var e = jo(t, "string");
  return xe(e) == "symbol" ? e : e + "";
}
function jo(t, e) {
  if (xe(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (xe(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var _t = {
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
      handler: function(e) {
        I.off("theme:change", this._loadCoreStyles), e || (this._loadCoreStyles(), this._themeChangeListener(this._loadCoreStyles));
      }
    },
    dt: {
      immediate: !0,
      handler: function(e, n) {
        var r = this;
        I.off("theme:change", this._themeScopedListener), e ? (this._loadScopedThemeStyles(e), this._themeScopedListener = function() {
          return r._loadScopedThemeStyles(e);
        }, this._themeChangeListener(this._themeScopedListener)) : this._unloadScopedThemeStyles();
      }
    }
  },
  scopedStyleEl: void 0,
  rootEl: void 0,
  uid: void 0,
  $attrSelector: void 0,
  beforeCreate: function() {
    var e, n, r, i, o, a, l, s, u, c, d, m = (e = this.pt) === null || e === void 0 ? void 0 : e._usept, f = m ? (n = this.pt) === null || n === void 0 || (n = n.originalValue) === null || n === void 0 ? void 0 : n[this.$.type.name] : void 0, p = m ? (r = this.pt) === null || r === void 0 || (r = r.value) === null || r === void 0 ? void 0 : r[this.$.type.name] : this.pt;
    (i = p || f) === null || i === void 0 || (i = i.hooks) === null || i === void 0 || (o = i.onBeforeCreate) === null || o === void 0 || o.call(i);
    var v = (a = this.$primevueConfig) === null || a === void 0 || (a = a.pt) === null || a === void 0 ? void 0 : a._usept, g = v ? (l = this.$primevue) === null || l === void 0 || (l = l.config) === null || l === void 0 || (l = l.pt) === null || l === void 0 ? void 0 : l.originalValue : void 0, y = v ? (s = this.$primevue) === null || s === void 0 || (s = s.config) === null || s === void 0 || (s = s.pt) === null || s === void 0 ? void 0 : s.value : (u = this.$primevue) === null || u === void 0 || (u = u.config) === null || u === void 0 ? void 0 : u.pt;
    (c = y || g) === null || c === void 0 || (c = c[this.$.type.name]) === null || c === void 0 || (c = c.hooks) === null || c === void 0 || (d = c.onBeforeCreate) === null || d === void 0 || d.call(c), this.$attrSelector = ko(), this.uid = this.$attrs.id || this.$attrSelector.replace("pc", "pv_id_");
  },
  created: function() {
    this._hook("onCreated");
  },
  beforeMount: function() {
    var e;
    this.rootEl = Ke(ye(this.$el) ? this.$el : (e = this.$el) === null || e === void 0 ? void 0 : e.parentElement, "[".concat(this.$attrSelector, "]")), this.rootEl && (this.rootEl.$pc = $({
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
    _hook: function(e) {
      if (!this.$options.hostName) {
        var n = this._usePT(this._getPT(this.pt, this.$.type.name), this._getOptionValue, "hooks.".concat(e)), r = this._useDefaultPT(this._getOptionValue, "hooks.".concat(e));
        n?.(), r?.();
      }
    },
    _mergeProps: function(e) {
      for (var n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
        r[i - 1] = arguments[i];
      return Je(e) ? e.apply(void 0, r) : E.apply(void 0, r);
    },
    _load: function() {
      X.isStyleNameLoaded("base") || (x.loadCSS(this.$styleOptions), this._loadGlobalStyles(), X.setLoadedStyleName("base")), this._loadThemeStyles();
    },
    _loadStyles: function() {
      this._load(), this._themeChangeListener(this._load);
    },
    _loadCoreStyles: function() {
      var e, n;
      !X.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name && (tn.loadCSS(this.$styleOptions), this.$options.style && this.$style.loadCSS(this.$styleOptions), X.setLoadedStyleName(this.$style.name));
    },
    _loadGlobalStyles: function() {
      var e = this._useGlobalPT(this._getOptionValue, "global.css", this.$params);
      T(e) && x.load(e, $({
        name: "global"
      }, this.$styleOptions));
    },
    _loadThemeStyles: function() {
      var e, n;
      if (!(this.isUnstyled || this.$theme === "none")) {
        if (!C.isStyleNameLoaded("common")) {
          var r, i, o = ((r = this.$style) === null || r === void 0 || (i = r.getCommonTheme) === null || i === void 0 ? void 0 : i.call(r)) || {}, a = o.primitive, l = o.semantic, s = o.global, u = o.style;
          x.load(a?.css, $({
            name: "primitive-variables"
          }, this.$styleOptions)), x.load(l?.css, $({
            name: "semantic-variables"
          }, this.$styleOptions)), x.load(s?.css, $({
            name: "global-variables"
          }, this.$styleOptions)), x.loadStyle($({
            name: "global-style"
          }, this.$styleOptions), u), C.setLoadedStyleName("common");
        }
        if (!C.isStyleNameLoaded((e = this.$style) === null || e === void 0 ? void 0 : e.name) && (n = this.$style) !== null && n !== void 0 && n.name) {
          var c, d, m, f, p = ((c = this.$style) === null || c === void 0 || (d = c.getComponentTheme) === null || d === void 0 ? void 0 : d.call(c)) || {}, v = p.css, g = p.style;
          (m = this.$style) === null || m === void 0 || m.load(v, $({
            name: "".concat(this.$style.name, "-variables")
          }, this.$styleOptions)), (f = this.$style) === null || f === void 0 || f.loadStyle($({
            name: "".concat(this.$style.name, "-style")
          }, this.$styleOptions), g), C.setLoadedStyleName(this.$style.name);
        }
        if (!C.isStyleNameLoaded("layer-order")) {
          var y, _, w = (y = this.$style) === null || y === void 0 || (_ = y.getLayerOrderThemeCSS) === null || _ === void 0 ? void 0 : _.call(y);
          x.load(w, $({
            name: "layer-order",
            first: !0
          }, this.$styleOptions)), C.setLoadedStyleName("layer-order");
        }
      }
    },
    _loadScopedThemeStyles: function(e) {
      var n, r, i, o = ((n = this.$style) === null || n === void 0 || (r = n.getPresetTheme) === null || r === void 0 ? void 0 : r.call(n, e, "[".concat(this.$attrSelector, "]"))) || {}, a = o.css, l = (i = this.$style) === null || i === void 0 ? void 0 : i.load(a, $({
        name: "".concat(this.$attrSelector, "-").concat(this.$style.name)
      }, this.$styleOptions));
      this.scopedStyleEl = l.el;
    },
    _unloadScopedThemeStyles: function() {
      var e;
      (e = this.scopedStyleEl) === null || e === void 0 || (e = e.value) === null || e === void 0 || e.remove();
    },
    _themeChangeListener: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
      };
      X.clearLoadedStyleNames(), I.on("theme:change", e);
    },
    _removeThemeListeners: function() {
      I.off("theme:change", this._loadCoreStyles), I.off("theme:change", this._load), I.off("theme:change", this._themeScopedListener);
    },
    _getHostInstance: function(e) {
      return e ? this.$options.hostName ? e.$.type.name === this.$options.hostName ? e : this._getHostInstance(e.$parentInstance) : e.$parentInstance : void 0;
    },
    _getPropValue: function(e) {
      var n;
      return this[e] || ((n = this._getHostInstance(this)) === null || n === void 0 ? void 0 : n[e]);
    },
    _getOptionValue: function(e) {
      var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return gt(e, n, r);
    },
    _getPTValue: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {}, o = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : !0, a = /./g.test(r) && !!i[r.split(".")[0]], l = this._getPropValue("ptOptions") || ((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, c = l.mergeProps, d = c === void 0 ? !1 : c, m = o ? a ? this._useGlobalPT(this._getPTClassValue, r, i) : this._useDefaultPT(this._getPTClassValue, r, i) : void 0, f = a ? void 0 : this._getPTSelf(n, this._getPTClassValue, r, $($({}, i), {}, {
        global: m || {}
      })), p = this._getPTDatasets(r);
      return u || !u && f ? d ? this._mergeProps(d, m, f, p) : $($($({}, m), f), p) : $($({}, f), p);
    },
    _getPTSelf: function() {
      for (var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length, r = new Array(n > 1 ? n - 1 : 0), i = 1; i < n; i++)
        r[i - 1] = arguments[i];
      return E(
        this._usePT.apply(this, [this._getPT(e, this.$name)].concat(r)),
        // Exp; <component :pt="{}"
        this._usePT.apply(this, [this.$_attrsPT].concat(r))
        // Exp; <component :pt:[passthrough_key]:[attribute]="{value}" or <component :pt:[passthrough_key]="() =>{value}"
      );
    },
    _getPTDatasets: function() {
      var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", i = "data-pc-", o = r === "root" && T((e = this.pt) === null || e === void 0 ? void 0 : e["data-pc-section"]);
      return r !== "transition" && $($({}, r === "root" && $($(we({}, "".concat(i, "name"), U(o ? (n = this.pt) === null || n === void 0 ? void 0 : n["data-pc-section"] : this.$.type.name)), o && we({}, "".concat(i, "extend"), U(this.$.type.name))), {}, we({}, "".concat(this.$attrSelector), ""))), {}, we({}, "".concat(i, "section"), U(r)));
    },
    _getPTClassValue: function() {
      var e = this._getOptionValue.apply(this, arguments);
      return V(e) || In(e) ? {
        class: e
      } : e;
    },
    _getPT: function(e) {
      var n = this, r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", i = arguments.length > 2 ? arguments[2] : void 0, o = function(l) {
        var s, u = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !1, c = i ? i(l) : l, d = U(r), m = U(n.$name);
        return (s = u ? d !== m ? c?.[d] : void 0 : c?.[d]) !== null && s !== void 0 ? s : c;
      };
      return e != null && e.hasOwnProperty("_usept") ? {
        _usept: e._usept,
        originalValue: o(e.originalValue),
        value: o(e.value)
      } : o(e, !0);
    },
    _usePT: function(e, n, r, i) {
      var o = function(v) {
        return n(v, r, i);
      };
      if (e != null && e.hasOwnProperty("_usept")) {
        var a, l = e._usept || ((a = this.$primevueConfig) === null || a === void 0 ? void 0 : a.ptOptions) || {}, s = l.mergeSections, u = s === void 0 ? !0 : s, c = l.mergeProps, d = c === void 0 ? !1 : c, m = o(e.originalValue), f = o(e.value);
        return m === void 0 && f === void 0 ? void 0 : V(f) ? f : V(m) ? m : u || !u && f ? d ? this._mergeProps(d, m, f) : $($({}, m), f) : f;
      }
      return o(e);
    },
    _useGlobalPT: function(e, n, r) {
      return this._usePT(this.globalPT, e, n, r);
    },
    _useDefaultPT: function(e, n, r) {
      return this._usePT(this.defaultPT, e, n, r);
    },
    ptm: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this._getPTValue(this.pt, e, $($({}, this.$params), n));
    },
    ptmi: function() {
      var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", r = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, i = E(this.$_attrsWithoutPT, this.ptm(n, r));
      return i?.hasOwnProperty("id") && ((e = i.id) !== null && e !== void 0 || (i.id = this.$id)), i;
    },
    ptmo: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      return this._getPTValue(e, n, $({
        instance: this
      }, r), !1);
    },
    cx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
      return this.isUnstyled ? void 0 : this._getOptionValue(this.$style.classes, e, $($({}, this.$params), n));
    },
    sx: function() {
      var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, r = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
      if (n) {
        var i = this._getOptionValue(this.$style.inlineStyles, e, $($({}, this.$params), r)), o = this._getOptionValue(tn.inlineStyles, e, $($({}, this.$params), r));
        return [o, i];
      }
    }
  },
  computed: {
    globalPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(r) {
        return R(r, {
          instance: n
        });
      });
    },
    defaultPT: function() {
      var e, n = this;
      return this._getPT((e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.pt, void 0, function(r) {
        return n._getOptionValue(r, n.$name, $({}, n.$params)) || R(r, $({}, n.$params));
      });
    },
    isUnstyled: function() {
      var e;
      return this.unstyled !== void 0 ? this.unstyled : (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.unstyled;
    },
    $id: function() {
      return this.$attrs.id || this.uid;
    },
    $inProps: function() {
      var e, n = Object.keys(((e = this.$.vnode) === null || e === void 0 ? void 0 : e.props) || {});
      return Object.fromEntries(Object.entries(this.$props).filter(function(r) {
        var i = _e(r, 1), o = i[0];
        return n?.includes(o);
      }));
    },
    $theme: function() {
      var e;
      return (e = this.$primevueConfig) === null || e === void 0 ? void 0 : e.theme;
    },
    $style: function() {
      return $($({
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
      var e;
      return {
        nonce: (e = this.$primevueConfig) === null || e === void 0 || (e = e.csp) === null || e === void 0 ? void 0 : e.nonce
      };
    },
    $primevueConfig: function() {
      var e;
      return (e = this.$primevue) === null || e === void 0 ? void 0 : e.config;
    },
    $name: function() {
      return this.$options.hostName || this.$.type.name;
    },
    $params: function() {
      var e = this._getHostInstance(this) || this.$parent;
      return {
        instance: this,
        props: this.$props,
        state: this.$data,
        attrs: this.$attrs,
        parent: {
          instance: e,
          props: e?.$props,
          state: e?.$data,
          attrs: e?.$attrs
        }
      };
    },
    $_attrsPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = _e(e, 1), r = n[0];
        return r?.startsWith("pt:");
      }).reduce(function(e, n) {
        var r = _e(n, 2), i = r[0], o = r[1], a = i.split(":"), l = Lo(a), s = ut(l).slice(1);
        return s?.reduce(function(u, c, d, m) {
          return !u[c] && (u[c] = d === m.length - 1 ? o : {}), u[c];
        }, e), e;
      }, {});
    },
    $_attrsWithoutPT: function() {
      return Object.entries(this.$attrs || {}).filter(function(e) {
        var n = _e(e, 1), r = n[0];
        return !(r != null && r.startsWith("pt:"));
      }).reduce(function(e, n) {
        var r = _e(n, 2), i = r[0], o = r[1];
        return e[i] = o, e;
      }, {});
    }
  }
}, No = `
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
`, Ro = {
  root: function(e) {
    var n = e.instance;
    return ["p-contextmenu p-component", {
      "p-contextmenu-mobile": n.queryMatches
    }];
  },
  rootList: "p-contextmenu-root-list",
  item: function(e) {
    var n = e.instance, r = e.processedItem;
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
x.extend({
  name: "contextmenu",
  style: No,
  classes: Ro
});
var Vo = `
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
`, Do = x.extend({
  name: "baseicon",
  css: Vo
});
function ke(t) {
  "@babel/helpers - typeof";
  return ke = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, ke(t);
}
function rn(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function on(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? rn(Object(n), !0).forEach(function(r) {
      Mo(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : rn(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function Mo(t, e, n) {
  return (e = Fo(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Fo(t) {
  var e = Ho(t, "string");
  return ke(e) == "symbol" ? e : e + "";
}
function Ho(t, e) {
  if (ke(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (ke(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var ia = {
  name: "BaseIcon",
  extends: _t,
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
  style: Do,
  provide: function() {
    return {
      $pcIcon: this,
      $parentInstance: this
    };
  },
  methods: {
    pti: function() {
      var e = Ie(this.label);
      return on(on({}, !this.isUnstyled && {
        class: ["p-icon", {
          "p-icon-spin": this.spin
        }]
      }), {}, {
        role: e ? void 0 : "img",
        "aria-label": e ? void 0 : this.label,
        "aria-hidden": e
      });
    }
  }
};
function Le(t) {
  "@babel/helpers - typeof";
  return Le = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Le(t);
}
function sn(t, e) {
  return Wo(t) || zo(t, e) || Uo(t, e) || Bo();
}
function Bo() {
  throw new TypeError(`Invalid attempt to destructure non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Uo(t, e) {
  if (t) {
    if (typeof t == "string") return an(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? an(t, e) : void 0;
  }
}
function an(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function zo(t, e) {
  var n = t == null ? null : typeof Symbol < "u" && t[Symbol.iterator] || t["@@iterator"];
  if (n != null) {
    var r, i, o, a, l = [], s = !0, u = !1;
    try {
      if (o = (n = n.call(t)).next, e !== 0) for (; !(s = (r = o.call(n)).done) && (l.push(r.value), l.length !== e); s = !0) ;
    } catch (c) {
      u = !0, i = c;
    } finally {
      try {
        if (!s && n.return != null && (a = n.return(), Object(a) !== a)) return;
      } finally {
        if (u) throw i;
      }
    }
    return l;
  }
}
function Wo(t) {
  if (Array.isArray(t)) return t;
}
function ln(t, e) {
  var n = Object.keys(t);
  if (Object.getOwnPropertySymbols) {
    var r = Object.getOwnPropertySymbols(t);
    e && (r = r.filter(function(i) {
      return Object.getOwnPropertyDescriptor(t, i).enumerable;
    })), n.push.apply(n, r);
  }
  return n;
}
function O(t) {
  for (var e = 1; e < arguments.length; e++) {
    var n = arguments[e] != null ? arguments[e] : {};
    e % 2 ? ln(Object(n), !0).forEach(function(r) {
      dt(t, r, n[r]);
    }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(t, Object.getOwnPropertyDescriptors(n)) : ln(Object(n)).forEach(function(r) {
      Object.defineProperty(t, r, Object.getOwnPropertyDescriptor(n, r));
    });
  }
  return t;
}
function dt(t, e, n) {
  return (e = Ko(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function Ko(t) {
  var e = Yo(t, "string");
  return Le(e) == "symbol" ? e : e + "";
}
function Yo(t, e) {
  if (Le(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Le(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var S = {
  _getMeta: function() {
    return [z(arguments.length <= 0 ? void 0 : arguments[0]) || arguments.length <= 0 ? void 0 : arguments[0], R(z(arguments.length <= 0 ? void 0 : arguments[0]) ? arguments.length <= 0 ? void 0 : arguments[0] : arguments.length <= 1 ? void 0 : arguments[1])];
  },
  _getConfig: function(e, n) {
    var r, i, o;
    return (r = (e == null || (i = e.instance) === null || i === void 0 ? void 0 : i.$primevue) || (n == null || (o = n.ctx) === null || o === void 0 || (o = o.appContext) === null || o === void 0 || (o = o.config) === null || o === void 0 || (o = o.globalProperties) === null || o === void 0 ? void 0 : o.$primevue)) === null || r === void 0 ? void 0 : r.config;
  },
  _getOptionValue: gt,
  _getPTValue: function() {
    var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, o = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : "", a = arguments.length > 3 && arguments[3] !== void 0 ? arguments[3] : {}, l = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : !0, s = function() {
      var _ = S._getOptionValue.apply(S, arguments);
      return V(_) || In(_) ? {
        class: _
      } : _;
    }, u = ((e = r.binding) === null || e === void 0 || (e = e.value) === null || e === void 0 ? void 0 : e.ptOptions) || ((n = r.$primevueConfig) === null || n === void 0 ? void 0 : n.ptOptions) || {}, c = u.mergeSections, d = c === void 0 ? !0 : c, m = u.mergeProps, f = m === void 0 ? !1 : m, p = l ? S._useDefaultPT(r, r.defaultPT(), s, o, a) : void 0, v = S._usePT(r, S._getPT(i, r.$name), s, o, O(O({}, a), {}, {
      global: p || {}
    })), g = S._getPTDatasets(r, o);
    return d || !d && v ? f ? S._mergeProps(r, f, p, v, g) : O(O(O({}, p), v), g) : O(O({}, v), g);
  },
  _getPTDatasets: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = "data-pc-";
    return O(O({}, n === "root" && dt({}, "".concat(r, "name"), U(e.$name))), {}, dt({}, "".concat(r, "section"), U(n)));
  },
  _getPT: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", r = arguments.length > 2 ? arguments[2] : void 0, i = function(a) {
      var l, s = r ? r(a) : a, u = U(n);
      return (l = s?.[u]) !== null && l !== void 0 ? l : s;
    };
    return e && Object.hasOwn(e, "_usept") ? {
      _usept: e._usept,
      originalValue: i(e.originalValue),
      value: i(e.value)
    } : i(e);
  },
  _usePT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = arguments.length > 2 ? arguments[2] : void 0, i = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0, a = function(g) {
      return r(g, i, o);
    };
    if (n && Object.hasOwn(n, "_usept")) {
      var l, s = n._usept || ((l = e.$primevueConfig) === null || l === void 0 ? void 0 : l.ptOptions) || {}, u = s.mergeSections, c = u === void 0 ? !0 : u, d = s.mergeProps, m = d === void 0 ? !1 : d, f = a(n.originalValue), p = a(n.value);
      return f === void 0 && p === void 0 ? void 0 : V(p) ? p : V(f) ? f : c || !c && p ? m ? S._mergeProps(e, m, f, p) : O(O({}, f), p) : p;
    }
    return a(n);
  },
  _useDefaultPT: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = arguments.length > 2 ? arguments[2] : void 0, i = arguments.length > 3 ? arguments[3] : void 0, o = arguments.length > 4 ? arguments[4] : void 0;
    return S._usePT(e, n, r, i, o);
  },
  _loadStyles: function() {
    var e, n = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, r = arguments.length > 1 ? arguments[1] : void 0, i = arguments.length > 2 ? arguments[2] : void 0, o = S._getConfig(r, i), a = {
      nonce: o == null || (e = o.csp) === null || e === void 0 ? void 0 : e.nonce
    };
    S._loadCoreStyles(n, a), S._loadThemeStyles(n, a), S._loadScopedThemeStyles(n, a), S._removeThemeListeners(n), n.$loadStyles = function() {
      return S._loadThemeStyles(n, a);
    }, S._themeChangeListener(n.$loadStyles);
  },
  _loadCoreStyles: function() {
    var e, n, r = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, i = arguments.length > 1 ? arguments[1] : void 0;
    if (!X.isStyleNameLoaded((e = r.$style) === null || e === void 0 ? void 0 : e.name) && (n = r.$style) !== null && n !== void 0 && n.name) {
      var o;
      x.loadCSS(i), (o = r.$style) === null || o === void 0 || o.loadCSS(i), X.setLoadedStyleName(r.$style.name);
    }
  },
  _loadThemeStyles: function() {
    var e, n, r, i = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, o = arguments.length > 1 ? arguments[1] : void 0;
    if (!(i != null && i.isUnstyled() || (i == null || (e = i.theme) === null || e === void 0 ? void 0 : e.call(i)) === "none")) {
      if (!C.isStyleNameLoaded("common")) {
        var a, l, s = ((a = i.$style) === null || a === void 0 || (l = a.getCommonTheme) === null || l === void 0 ? void 0 : l.call(a)) || {}, u = s.primitive, c = s.semantic, d = s.global, m = s.style;
        x.load(u?.css, O({
          name: "primitive-variables"
        }, o)), x.load(c?.css, O({
          name: "semantic-variables"
        }, o)), x.load(d?.css, O({
          name: "global-variables"
        }, o)), x.loadStyle(O({
          name: "global-style"
        }, o), m), C.setLoadedStyleName("common");
      }
      if (!C.isStyleNameLoaded((n = i.$style) === null || n === void 0 ? void 0 : n.name) && (r = i.$style) !== null && r !== void 0 && r.name) {
        var f, p, v, g, y = ((f = i.$style) === null || f === void 0 || (p = f.getDirectiveTheme) === null || p === void 0 ? void 0 : p.call(f)) || {}, _ = y.css, w = y.style;
        (v = i.$style) === null || v === void 0 || v.load(_, O({
          name: "".concat(i.$style.name, "-variables")
        }, o)), (g = i.$style) === null || g === void 0 || g.loadStyle(O({
          name: "".concat(i.$style.name, "-style")
        }, o), w), C.setLoadedStyleName(i.$style.name);
      }
      if (!C.isStyleNameLoaded("layer-order")) {
        var h, b, k = (h = i.$style) === null || h === void 0 || (b = h.getLayerOrderThemeCSS) === null || b === void 0 ? void 0 : b.call(h);
        x.load(k, O({
          name: "layer-order",
          first: !0
        }, o)), C.setLoadedStyleName("layer-order");
      }
    }
  },
  _loadScopedThemeStyles: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, n = arguments.length > 1 ? arguments[1] : void 0, r = e.preset();
    if (r && e.$attrSelector) {
      var i, o, a, l = ((i = e.$style) === null || i === void 0 || (o = i.getPresetTheme) === null || o === void 0 ? void 0 : o.call(i, r, "[".concat(e.$attrSelector, "]"))) || {}, s = l.css, u = (a = e.$style) === null || a === void 0 ? void 0 : a.load(s, O({
        name: "".concat(e.$attrSelector, "-").concat(e.$style.name)
      }, n));
      e.scopedStyleEl = u.el;
    }
  },
  _themeChangeListener: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : function() {
    };
    X.clearLoadedStyleNames(), I.on("theme:change", e);
  },
  _removeThemeListeners: function() {
    var e = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {};
    I.off("theme:change", e.$loadStyles), e.$loadStyles = void 0;
  },
  _hook: function(e, n, r, i, o, a) {
    var l, s, u = "on".concat($i(n)), c = S._getConfig(i, o), d = r?.$instance, m = S._usePT(d, S._getPT(i == null || (l = i.value) === null || l === void 0 ? void 0 : l.pt, e), S._getOptionValue, "hooks.".concat(u)), f = S._useDefaultPT(d, c == null || (s = c.pt) === null || s === void 0 || (s = s.directives) === null || s === void 0 ? void 0 : s[e], S._getOptionValue, "hooks.".concat(u)), p = {
      el: r,
      binding: i,
      vnode: o,
      prevVnode: a
    };
    m?.(d, p), f?.(d, p);
  },
  /* eslint-disable-next-line no-unused-vars */
  _mergeProps: function() {
    for (var e = arguments.length > 1 ? arguments[1] : void 0, n = arguments.length, r = new Array(n > 2 ? n - 2 : 0), i = 2; i < n; i++)
      r[i - 2] = arguments[i];
    return Je(e) ? e.apply(void 0, r) : E.apply(void 0, r);
  },
  _extend: function(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {}, r = function(l, s, u, c, d) {
      var m, f, p, v;
      s._$instances = s._$instances || {};
      var g = S._getConfig(u, c), y = s._$instances[e] || {}, _ = Ie(y) ? O(O({}, n), n?.methods) : {};
      s._$instances[e] = O(O({}, y), {}, {
        /* new instance variables to pass in directive methods */
        $name: e,
        $host: s,
        $binding: u,
        $modifiers: u?.modifiers,
        $value: u?.value,
        $el: y.$el || s || void 0,
        $style: O({
          classes: void 0,
          inlineStyles: void 0,
          load: function() {
          },
          loadCSS: function() {
          },
          loadStyle: function() {
          }
        }, n?.style),
        $primevueConfig: g,
        $attrSelector: (m = s.$pd) === null || m === void 0 || (m = m[e]) === null || m === void 0 ? void 0 : m.attrSelector,
        /* computed instance variables */
        defaultPT: function() {
          return S._getPT(g?.pt, void 0, function(h) {
            var b;
            return h == null || (b = h.directives) === null || b === void 0 ? void 0 : b[e];
          });
        },
        isUnstyled: function() {
          var h, b;
          return ((h = s._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.unstyled) !== void 0 ? (b = s._$instances[e]) === null || b === void 0 || (b = b.$binding) === null || b === void 0 || (b = b.value) === null || b === void 0 ? void 0 : b.unstyled : g?.unstyled;
        },
        theme: function() {
          var h;
          return (h = s._$instances[e]) === null || h === void 0 || (h = h.$primevueConfig) === null || h === void 0 ? void 0 : h.theme;
        },
        preset: function() {
          var h;
          return (h = s._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.dt;
        },
        /* instance's methods */
        ptm: function() {
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return S._getPTValue(s._$instances[e], (h = s._$instances[e]) === null || h === void 0 || (h = h.$binding) === null || h === void 0 || (h = h.value) === null || h === void 0 ? void 0 : h.pt, b, O({}, k));
        },
        ptmo: function() {
          var h = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, b = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : "", k = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return S._getPTValue(s._$instances[e], h, b, k, !1);
        },
        cx: function() {
          var h, b, k = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", A = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
          return (h = s._$instances[e]) !== null && h !== void 0 && h.isUnstyled() ? void 0 : S._getOptionValue((b = s._$instances[e]) === null || b === void 0 || (b = b.$style) === null || b === void 0 ? void 0 : b.classes, k, O({}, A));
        },
        sx: function() {
          var h, b = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : "", k = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : !0, A = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
          return k ? S._getOptionValue((h = s._$instances[e]) === null || h === void 0 || (h = h.$style) === null || h === void 0 ? void 0 : h.inlineStyles, b, O({}, A)) : void 0;
        }
      }, _), s.$instance = s._$instances[e], (f = (p = s.$instance)[l]) === null || f === void 0 || f.call(p, s, u, c, d), s["$".concat(e)] = s.$instance, S._hook(e, l, s, u, c, d), s.$pd || (s.$pd = {}), s.$pd[e] = O(O({}, (v = s.$pd) === null || v === void 0 ? void 0 : v[e]), {}, {
        name: e,
        instance: s._$instances[e]
      });
    }, i = function(l) {
      var s, u, c, d = l._$instances[e], m = d?.watch, f = function(g) {
        var y, _ = g.newValue, w = g.oldValue;
        return m == null || (y = m.config) === null || y === void 0 ? void 0 : y.call(d, _, w);
      }, p = function(g) {
        var y, _ = g.newValue, w = g.oldValue;
        return m == null || (y = m["config.ripple"]) === null || y === void 0 ? void 0 : y.call(d, _, w);
      };
      d.$watchersCallback = {
        config: f,
        "config.ripple": p
      }, m == null || (s = m.config) === null || s === void 0 || s.call(d, d?.$primevueConfig), ee.on("config:change", f), m == null || (u = m["config.ripple"]) === null || u === void 0 || u.call(d, d == null || (c = d.$primevueConfig) === null || c === void 0 ? void 0 : c.ripple), ee.on("config:ripple:change", p);
    }, o = function(l) {
      var s = l._$instances[e].$watchersCallback;
      s && (ee.off("config:change", s.config), ee.off("config:ripple:change", s["config.ripple"]), l._$instances[e].$watchersCallback = void 0);
    };
    return {
      created: function(l, s, u, c) {
        l.$pd || (l.$pd = {}), l.$pd[e] = {
          name: e,
          attrSelector: Bi("pd")
        }, r("created", l, s, u, c);
      },
      beforeMount: function(l, s, u, c) {
        var d;
        S._loadStyles((d = l.$pd[e]) === null || d === void 0 ? void 0 : d.instance, s, u), r("beforeMount", l, s, u, c), i(l);
      },
      mounted: function(l, s, u, c) {
        var d;
        S._loadStyles((d = l.$pd[e]) === null || d === void 0 ? void 0 : d.instance, s, u), r("mounted", l, s, u, c);
      },
      beforeUpdate: function(l, s, u, c) {
        r("beforeUpdate", l, s, u, c);
      },
      updated: function(l, s, u, c) {
        var d;
        S._loadStyles((d = l.$pd[e]) === null || d === void 0 ? void 0 : d.instance, s, u), r("updated", l, s, u, c);
      },
      beforeUnmount: function(l, s, u, c) {
        var d;
        o(l), S._removeThemeListeners((d = l.$pd[e]) === null || d === void 0 ? void 0 : d.instance), r("beforeUnmount", l, s, u, c);
      },
      unmounted: function(l, s, u, c) {
        var d;
        (d = l.$pd[e]) === null || d === void 0 || (d = d.instance) === null || d === void 0 || (d = d.scopedStyleEl) === null || d === void 0 || (d = d.value) === null || d === void 0 || d.remove(), r("unmounted", l, s, u, c);
      }
    };
  },
  extend: function() {
    var e = S._getMeta.apply(S, arguments), n = sn(e, 2), r = n[0], i = n[1];
    return O({
      extend: function() {
        var a = S._getMeta.apply(S, arguments), l = sn(a, 2), s = l[0], u = l[1];
        return S.extend(s, O(O(O({}, i), i?.methods), u));
      }
    }, S._extend(r, i));
  }
}, qo = `
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
`, Go = {
  root: "p-ink"
}, Zo = x.extend({
  name: "ripple-directive",
  style: qo,
  classes: Go
}), Jo = S.extend({
  style: Zo
});
function Ee(t) {
  "@babel/helpers - typeof";
  return Ee = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ee(t);
}
function Qo(t) {
  return ns(t) || ts(t) || es(t) || Xo();
}
function Xo() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function es(t, e) {
  if (t) {
    if (typeof t == "string") return ct(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? ct(t, e) : void 0;
  }
}
function ts(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function ns(t) {
  if (Array.isArray(t)) return ct(t);
}
function ct(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
function un(t, e, n) {
  return (e = rs(e)) in t ? Object.defineProperty(t, e, { value: n, enumerable: !0, configurable: !0, writable: !0 }) : t[e] = n, t;
}
function rs(t) {
  var e = is(t, "string");
  return Ee(e) == "symbol" ? e : e + "";
}
function is(t, e) {
  if (Ee(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Ee(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return (e === "string" ? String : Number)(t);
}
var os = Jo.extend("ripple", {
  watch: {
    "config.ripple": function(e) {
      e ? (this.createRipple(this.$host), this.bindEvents(this.$host), this.$host.setAttribute("data-pd-ripple", !0), this.$host.style.overflow = "hidden", this.$host.style.position = "relative") : (this.remove(this.$host), this.$host.removeAttribute("data-pd-ripple"));
    }
  },
  unmounted: function(e) {
    this.remove(e);
  },
  timeout: void 0,
  methods: {
    bindEvents: function(e) {
      e.addEventListener("mousedown", this.onMouseDown.bind(this));
    },
    unbindEvents: function(e) {
      e.removeEventListener("mousedown", this.onMouseDown.bind(this));
    },
    createRipple: function(e) {
      var n = this.getInk(e);
      n || (n = ji("span", un(un({
        role: "presentation",
        "aria-hidden": !0,
        "data-p-ink": !0,
        "data-p-ink-active": !1,
        class: !this.isUnstyled() && this.cx("root"),
        onAnimationEnd: this.onAnimationEnd.bind(this)
      }, this.$attrSelector, ""), "p-bind", this.ptm("root"))), e.appendChild(n), this.$el = n);
    },
    remove: function(e) {
      var n = this.getInk(e);
      n && (this.$host.style.overflow = "", this.$host.style.position = "", this.unbindEvents(e), n.removeEventListener("animationend", this.onAnimationEnd), n.remove());
    },
    onMouseDown: function(e) {
      var n = this, r = e.currentTarget, i = this.getInk(r);
      if (!(!i || getComputedStyle(i, null).display === "none")) {
        if (!this.isUnstyled() && Xe(i, "p-ink-active"), i.setAttribute("data-p-ink-active", "false"), !Mt(i) && !Ft(i)) {
          var o = Math.max(ze(r), Di(r));
          i.style.height = o + "px", i.style.width = o + "px";
        }
        var a = Vi(r), l = e.pageX - a.left + document.body.scrollTop - Ft(i) / 2, s = e.pageY - a.top + document.body.scrollLeft - Mt(i) / 2;
        i.style.top = s + "px", i.style.left = l + "px", !this.isUnstyled() && Ci(i, "p-ink-active"), i.setAttribute("data-p-ink-active", "true"), this.timeout = setTimeout(function() {
          i && (!n.isUnstyled() && Xe(i, "p-ink-active"), i.setAttribute("data-p-ink-active", "false"));
        }, 401);
      }
    },
    onAnimationEnd: function(e) {
      this.timeout && clearTimeout(this.timeout), !this.isUnstyled() && Xe(e.currentTarget, "p-ink-active"), e.currentTarget.setAttribute("data-p-ink-active", "false");
    },
    getInk: function(e) {
      return e && e.children ? Qo(e.children).find(function(n) {
        return Ni(n, "data-pc-name") === "ripple";
      }) : void 0;
    }
  }
});
function Ae(t) {
  "@babel/helpers - typeof";
  return Ae = typeof Symbol == "function" && typeof Symbol.iterator == "symbol" ? function(e) {
    return typeof e;
  } : function(e) {
    return e && typeof Symbol == "function" && e.constructor === Symbol && e !== Symbol.prototype ? "symbol" : typeof e;
  }, Ae(t);
}
function ss(t, e) {
  if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function");
}
function as(t, e) {
  for (var n = 0; n < e.length; n++) {
    var r = e[n];
    r.enumerable = r.enumerable || !1, r.configurable = !0, "value" in r && (r.writable = !0), Object.defineProperty(t, us(r.key), r);
  }
}
function ls(t, e, n) {
  return e && as(t.prototype, e), Object.defineProperty(t, "prototype", { writable: !1 }), t;
}
function us(t) {
  var e = ds(t, "string");
  return Ae(e) == "symbol" ? e : e + "";
}
function ds(t, e) {
  if (Ae(t) != "object" || !t) return t;
  var n = t[Symbol.toPrimitive];
  if (n !== void 0) {
    var r = n.call(t, e);
    if (Ae(r) != "object") return r;
    throw new TypeError("@@toPrimitive must return a primitive value.");
  }
  return String(t);
}
var cs = /* @__PURE__ */ (function() {
  function t(e) {
    var n = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : function() {
    };
    ss(this, t), this.element = e, this.listener = n;
  }
  return ls(t, [{
    key: "bindScrollListener",
    value: function() {
      this.scrollableParents = Mi(this.element);
      for (var n = 0; n < this.scrollableParents.length; n++)
        this.scrollableParents[n].addEventListener("scroll", this.listener);
    }
  }, {
    key: "unbindScrollListener",
    value: function() {
      if (this.scrollableParents)
        for (var n = 0; n < this.scrollableParents.length; n++)
          this.scrollableParents[n].removeEventListener("scroll", this.listener);
    }
  }, {
    key: "destroy",
    value: function() {
      this.unbindScrollListener(), this.element = null, this.listener = null, this.scrollableParents = null;
    }
  }]);
})(), ms = vt(), fs = `
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
`, ps = {
  root: function(e) {
    var n = e.props;
    return ["p-menu p-component", {
      "p-menu-overlay": n.popup
    }];
  },
  start: "p-menu-start",
  list: "p-menu-list",
  submenuLabel: "p-menu-submenu-label",
  separator: "p-menu-separator",
  end: "p-menu-end",
  item: function(e) {
    var n = e.instance;
    return ["p-menu-item", {
      "p-focus": n.id === n.focusedOptionId,
      "p-disabled": n.disabled()
    }];
  },
  itemContent: "p-menu-item-content",
  itemLink: "p-menu-item-link",
  itemIcon: "p-menu-item-icon",
  itemLabel: "p-menu-item-label"
}, hs = x.extend({
  name: "menu",
  style: fs,
  classes: ps
}), gs = {
  name: "BaseMenu",
  extends: _t,
  props: {
    popup: {
      type: Boolean,
      default: !1
    },
    model: {
      type: Array,
      default: null
    },
    appendTo: {
      type: [String, Object],
      default: "body"
    },
    autoZIndex: {
      type: Boolean,
      default: !0
    },
    baseZIndex: {
      type: Number,
      default: 0
    },
    tabindex: {
      type: Number,
      default: 0
    },
    ariaLabel: {
      type: String,
      default: null
    },
    ariaLabelledby: {
      type: String,
      default: null
    }
  },
  style: hs,
  provide: function() {
    return {
      $pcMenu: this,
      $parentInstance: this
    };
  }
}, qn = {
  name: "Menuitem",
  hostName: "Menu",
  extends: _t,
  inheritAttrs: !1,
  emits: ["item-click", "item-mousemove"],
  props: {
    item: null,
    templates: null,
    id: null,
    focusedOptionId: null,
    index: null
  },
  methods: {
    getItemProp: function(e, n) {
      return e && e.item ? R(e.item[n]) : void 0;
    },
    getPTOptions: function(e) {
      return this.ptm(e, {
        context: {
          item: this.item,
          index: this.index,
          focused: this.isItemFocused(),
          disabled: this.disabled()
        }
      });
    },
    isItemFocused: function() {
      return this.focusedOptionId === this.id;
    },
    onItemClick: function(e) {
      var n = this.getItemProp(this.item, "command");
      n && n({
        originalEvent: e,
        item: this.item.item
      }), this.$emit("item-click", {
        originalEvent: e,
        item: this.item,
        id: this.id
      });
    },
    onItemMouseMove: function(e) {
      this.$emit("item-mousemove", {
        originalEvent: e,
        item: this.item,
        id: this.id
      });
    },
    visible: function() {
      return typeof this.item.visible == "function" ? this.item.visible() : this.item.visible !== !1;
    },
    disabled: function() {
      return typeof this.item.disabled == "function" ? this.item.disabled() : this.item.disabled;
    },
    label: function() {
      return typeof this.item.label == "function" ? this.item.label() : this.item.label;
    },
    getMenuItemProps: function(e) {
      return {
        action: E({
          class: this.cx("itemLink"),
          tabindex: "-1"
        }, this.getPTOptions("itemLink")),
        icon: E({
          class: [this.cx("itemIcon"), e.icon]
        }, this.getPTOptions("itemIcon")),
        label: E({
          class: this.cx("itemLabel")
        }, this.getPTOptions("itemLabel"))
      };
    }
  },
  computed: {
    dataP: function() {
      return yt({
        focus: this.isItemFocused(),
        disabled: this.disabled()
      });
    }
  },
  directives: {
    ripple: os
  }
}, vs = ["id", "aria-label", "aria-disabled", "data-p-focused", "data-p-disabled", "data-p"], ys = ["data-p"], bs = ["href", "target"], _s = ["data-p"], Ss = ["data-p"];
function ws(t, e, n, r, i, o) {
  var a = Tr("ripple");
  return o.visible() ? (L(), N("li", E({
    key: 0,
    id: n.id,
    class: [t.cx("item"), n.item.class],
    role: "menuitem",
    style: n.item.style,
    "aria-label": o.label(),
    "aria-disabled": o.disabled(),
    "data-p-focused": o.isItemFocused(),
    "data-p-disabled": o.disabled() || !1,
    "data-p": o.dataP
  }, o.getPTOptions("item")), [rt("div", E({
    class: t.cx("itemContent"),
    onClick: e[0] || (e[0] = function(l) {
      return o.onItemClick(l);
    }),
    onMousemove: e[1] || (e[1] = function(l) {
      return o.onItemMouseMove(l);
    }),
    "data-p": o.dataP
  }, o.getPTOptions("itemContent")), [n.templates.item ? n.templates.item ? (L(), ve(Tt(n.templates.item), {
    key: 1,
    item: n.item,
    label: o.label(),
    props: o.getMenuItemProps(n.item)
  }, null, 8, ["item", "label", "props"])) : B("", !0) : Pr((L(), N("a", E({
    key: 0,
    href: n.item.url,
    class: t.cx("itemLink"),
    target: n.item.target,
    tabindex: "-1"
  }, o.getPTOptions("itemLink")), [n.templates.itemicon ? (L(), ve(Tt(n.templates.itemicon), {
    key: 0,
    item: n.item,
    class: xr(t.cx("itemIcon"))
  }, null, 8, ["item", "class"])) : n.item.icon ? (L(), N("span", E({
    key: 1,
    class: [t.cx("itemIcon"), n.item.icon],
    "data-p": o.dataP
  }, o.getPTOptions("itemIcon")), null, 16, _s)) : B("", !0), rt("span", E({
    class: t.cx("itemLabel"),
    "data-p": o.dataP
  }, o.getPTOptions("itemLabel")), Sn(o.label()), 17, Ss)], 16, bs)), [[a]])], 16, ys)], 16, vs)) : B("", !0);
}
qn.render = ws;
function dn(t) {
  return Ts(t) || Cs(t) || Os(t) || $s();
}
function $s() {
  throw new TypeError(`Invalid attempt to spread non-iterable instance.
In order to be iterable, non-array objects must have a [Symbol.iterator]() method.`);
}
function Os(t, e) {
  if (t) {
    if (typeof t == "string") return mt(t, e);
    var n = {}.toString.call(t).slice(8, -1);
    return n === "Object" && t.constructor && (n = t.constructor.name), n === "Map" || n === "Set" ? Array.from(t) : n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n) ? mt(t, e) : void 0;
  }
}
function Cs(t) {
  if (typeof Symbol < "u" && t[Symbol.iterator] != null || t["@@iterator"] != null) return Array.from(t);
}
function Ts(t) {
  if (Array.isArray(t)) return mt(t);
}
function mt(t, e) {
  (e == null || e > t.length) && (e = t.length);
  for (var n = 0, r = Array(e); n < e; n++) r[n] = t[n];
  return r;
}
var Gn = {
  name: "Menu",
  extends: gs,
  inheritAttrs: !1,
  emits: ["show", "hide", "focus", "blur"],
  data: function() {
    return {
      overlayVisible: !1,
      focused: !1,
      focusedOptionIndex: -1,
      selectedOptionIndex: -1
    };
  },
  target: null,
  outsideClickListener: null,
  scrollHandler: null,
  resizeListener: null,
  container: null,
  list: null,
  mounted: function() {
    this.popup || (this.bindResizeListener(), this.bindOutsideClickListener());
  },
  beforeUnmount: function() {
    this.unbindResizeListener(), this.unbindOutsideClickListener(), this.scrollHandler && (this.scrollHandler.destroy(), this.scrollHandler = null), this.target = null, this.container && this.autoZIndex && et.clear(this.container), this.container = null;
  },
  methods: {
    itemClick: function(e) {
      var n = e.item;
      this.disabled(n) || (n.command && n.command(e), this.overlayVisible && this.hide(), !this.popup && this.focusedOptionIndex !== e.id && (this.focusedOptionIndex = e.id));
    },
    itemMouseMove: function(e) {
      this.focused && (this.focusedOptionIndex = e.id);
    },
    onListFocus: function(e) {
      this.focused = !0, !this.popup && this.changeFocusedOptionIndex(0), this.$emit("focus", e);
    },
    onListBlur: function(e) {
      this.focused = !1, this.focusedOptionIndex = -1, this.$emit("blur", e);
    },
    onListKeyDown: function(e) {
      switch (e.code) {
        case "ArrowDown":
          this.onArrowDownKey(e);
          break;
        case "ArrowUp":
          this.onArrowUpKey(e);
          break;
        case "Home":
          this.onHomeKey(e);
          break;
        case "End":
          this.onEndKey(e);
          break;
        case "Enter":
        case "NumpadEnter":
          this.onEnterKey(e);
          break;
        case "Space":
          this.onSpaceKey(e);
          break;
        case "Escape":
          this.popup && (Ve(this.target), this.hide());
        case "Tab":
          this.overlayVisible && this.hide();
          break;
      }
    },
    onArrowDownKey: function(e) {
      var n = this.findNextOptionIndex(this.focusedOptionIndex);
      this.changeFocusedOptionIndex(n), e.preventDefault();
    },
    onArrowUpKey: function(e) {
      if (e.altKey && this.popup)
        Ve(this.target), this.hide(), e.preventDefault();
      else {
        var n = this.findPrevOptionIndex(this.focusedOptionIndex);
        this.changeFocusedOptionIndex(n), e.preventDefault();
      }
    },
    onHomeKey: function(e) {
      this.changeFocusedOptionIndex(0), e.preventDefault();
    },
    onEndKey: function(e) {
      this.changeFocusedOptionIndex(Se(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]').length - 1), e.preventDefault();
    },
    onEnterKey: function(e) {
      var n = Ke(this.list, 'li[id="'.concat("".concat(this.focusedOptionIndex), '"]')), r = n && Ke(n, 'a[data-pc-section="itemlink"]');
      this.popup && Ve(this.target), r ? r.click() : n && n.click(), e.preventDefault();
    },
    onSpaceKey: function(e) {
      this.onEnterKey(e);
    },
    findNextOptionIndex: function(e) {
      var n = Se(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), r = dn(n).findIndex(function(i) {
        return i.id === e;
      });
      return r > -1 ? r + 1 : 0;
    },
    findPrevOptionIndex: function(e) {
      var n = Se(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), r = dn(n).findIndex(function(i) {
        return i.id === e;
      });
      return r > -1 ? r - 1 : 0;
    },
    changeFocusedOptionIndex: function(e) {
      var n = Se(this.container, 'li[data-pc-section="item"][data-p-disabled="false"]'), r = e >= n.length ? n.length - 1 : e < 0 ? 0 : e;
      r > -1 && (this.focusedOptionIndex = n[r].getAttribute("id"));
    },
    toggle: function(e, n) {
      this.overlayVisible ? this.hide() : this.show(e, n);
    },
    show: function(e, n) {
      this.overlayVisible = !0, this.target = n ?? e.currentTarget;
    },
    hide: function() {
      this.overlayVisible = !1, this.target = null;
    },
    onEnter: function(e) {
      Ai(e, {
        position: "absolute",
        top: "0"
      }), this.alignOverlay(), this.bindOutsideClickListener(), this.bindResizeListener(), this.bindScrollListener(), this.autoZIndex && et.set("menu", e, this.baseZIndex || this.$primevue.config.zIndex.menu), this.popup && Ve(this.list), this.$emit("show");
    },
    onLeave: function() {
      this.unbindOutsideClickListener(), this.unbindResizeListener(), this.unbindScrollListener(), this.$emit("hide");
    },
    onAfterLeave: function(e) {
      this.autoZIndex && et.clear(e);
    },
    alignOverlay: function() {
      Ei(this.container, this.target);
      var e = ze(this.target);
      e > ze(this.container) && (this.container.style.minWidth = ze(this.target) + "px");
    },
    bindOutsideClickListener: function() {
      var e = this;
      this.outsideClickListener || (this.outsideClickListener = function(n) {
        var r = e.container && !e.container.contains(n.target), i = !(e.target && (e.target === n.target || e.target.contains(n.target)));
        e.overlayVisible && r && i ? e.hide() : !e.popup && r && i && (e.focusedOptionIndex = -1);
      }, document.addEventListener("click", this.outsideClickListener, !0));
    },
    unbindOutsideClickListener: function() {
      this.outsideClickListener && (document.removeEventListener("click", this.outsideClickListener, !0), this.outsideClickListener = null);
    },
    bindScrollListener: function() {
      var e = this;
      this.scrollHandler || (this.scrollHandler = new cs(this.target, function() {
        e.overlayVisible && e.hide();
      })), this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function() {
      this.scrollHandler && this.scrollHandler.unbindScrollListener();
    },
    bindResizeListener: function() {
      var e = this;
      this.resizeListener || (this.resizeListener = function() {
        e.overlayVisible && !Fi() && e.hide();
      }, window.addEventListener("resize", this.resizeListener));
    },
    unbindResizeListener: function() {
      this.resizeListener && (window.removeEventListener("resize", this.resizeListener), this.resizeListener = null);
    },
    visible: function(e) {
      return typeof e.visible == "function" ? e.visible() : e.visible !== !1;
    },
    disabled: function(e) {
      return typeof e.disabled == "function" ? e.disabled() : e.disabled;
    },
    label: function(e) {
      return typeof e.label == "function" ? e.label() : e.label;
    },
    onOverlayClick: function(e) {
      ms.emit("overlay-click", {
        originalEvent: e,
        target: this.target
      });
    },
    containerRef: function(e) {
      this.container = e;
    },
    listRef: function(e) {
      this.list = e;
    }
  },
  computed: {
    focusedOptionId: function() {
      return this.focusedOptionIndex !== -1 ? this.focusedOptionIndex : null;
    },
    dataP: function() {
      return yt({
        popup: this.popup
      });
    }
  },
  components: {
    PVMenuitem: qn,
    Portal: bt
  }
}, Ps = ["id", "data-p"], xs = ["id", "tabindex", "aria-activedescendant", "aria-label", "aria-labelledby"], ks = ["id"];
function Ls(t, e, n, r, i, o) {
  var a = Pt("PVMenuitem"), l = Pt("Portal");
  return L(), ve(l, {
    appendTo: t.appendTo,
    disabled: !t.popup
  }, {
    default: xt(function() {
      return [kr(Lr, E({
        name: "p-anchored-overlay",
        onEnter: o.onEnter,
        onLeave: o.onLeave,
        onAfterLeave: o.onAfterLeave
      }, t.ptm("transition")), {
        default: xt(function() {
          return [!t.popup || i.overlayVisible ? (L(), N("div", E({
            key: 0,
            ref: o.containerRef,
            id: t.$id,
            class: t.cx("root"),
            onClick: e[3] || (e[3] = function() {
              return o.onOverlayClick && o.onOverlayClick.apply(o, arguments);
            }),
            "data-p": o.dataP
          }, t.ptmi("root")), [t.$slots.start ? (L(), N("div", E({
            key: 0,
            class: t.cx("start")
          }, t.ptm("start")), [ae(t.$slots, "start")], 16)) : B("", !0), rt("ul", E({
            ref: o.listRef,
            id: t.$id + "_list",
            class: t.cx("list"),
            role: "menu",
            tabindex: t.tabindex,
            "aria-activedescendant": i.focused ? o.focusedOptionId : void 0,
            "aria-label": t.ariaLabel,
            "aria-labelledby": t.ariaLabelledby,
            onFocus: e[0] || (e[0] = function() {
              return o.onListFocus && o.onListFocus.apply(o, arguments);
            }),
            onBlur: e[1] || (e[1] = function() {
              return o.onListBlur && o.onListBlur.apply(o, arguments);
            }),
            onKeydown: e[2] || (e[2] = function() {
              return o.onListKeyDown && o.onListKeyDown.apply(o, arguments);
            })
          }, t.ptm("list")), [(L(!0), N(be, null, kt(t.model, function(s, u) {
            return L(), N(be, {
              key: o.label(s) + u.toString()
            }, [s.items && o.visible(s) && !s.separator ? (L(), N(be, {
              key: 0
            }, [s.items ? (L(), N("li", E({
              key: 0,
              id: t.$id + "_" + u,
              class: [t.cx("submenuLabel"), s.class],
              role: "none"
            }, {
              ref_for: !0
            }, t.ptm("submenuLabel")), [ae(t.$slots, t.$slots.submenulabel ? "submenulabel" : "submenuheader", {
              item: s
            }, function() {
              return [Er(Sn(o.label(s)), 1)];
            })], 16, ks)) : B("", !0), (L(!0), N(be, null, kt(s.items, function(c, d) {
              return L(), N(be, {
                key: c.label + u + "_" + d
              }, [o.visible(c) && !c.separator ? (L(), ve(a, {
                key: 0,
                id: t.$id + "_" + u + "_" + d,
                item: c,
                templates: t.$slots,
                focusedOptionId: o.focusedOptionId,
                unstyled: t.unstyled,
                onItemClick: o.itemClick,
                onItemMousemove: o.itemMouseMove,
                pt: t.pt
              }, null, 8, ["id", "item", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"])) : o.visible(c) && c.separator ? (L(), N("li", E({
                key: "separator" + u + d,
                class: [t.cx("separator"), s.class],
                style: c.style,
                role: "separator"
              }, {
                ref_for: !0
              }, t.ptm("separator")), null, 16)) : B("", !0)], 64);
            }), 128))], 64)) : o.visible(s) && s.separator ? (L(), N("li", E({
              key: "separator" + u.toString(),
              class: [t.cx("separator"), s.class],
              style: s.style,
              role: "separator"
            }, {
              ref_for: !0
            }, t.ptm("separator")), null, 16)) : (L(), ve(a, {
              key: o.label(s) + u.toString(),
              id: t.$id + "_" + u,
              item: s,
              index: u,
              templates: t.$slots,
              focusedOptionId: o.focusedOptionId,
              unstyled: t.unstyled,
              onItemClick: o.itemClick,
              onItemMousemove: o.itemMouseMove,
              pt: t.pt
            }, null, 8, ["id", "item", "index", "templates", "focusedOptionId", "unstyled", "onItemClick", "onItemMousemove", "pt"]))], 64);
          }), 128))], 16, xs), t.$slots.end ? (L(), N("div", E({
            key: 1,
            class: t.cx("end")
          }, t.ptm("end")), [ae(t.$slots, "end")], 16)) : B("", !0)], 16, Ps)) : B("", !0)];
        }),
        _: 3
      }, 16, ["onEnter", "onLeave", "onAfterLeave"])];
    }),
    _: 3
  }, 8, ["appendTo", "disabled"]);
}
Gn.render = Ls;
const Es = "data-wippy-overlay-layer";
function Zn() {
  return typeof window < "u" && typeof window.document < "u";
}
function Jn() {
  return Zn() && typeof HTMLElement < "u" && "popover" in HTMLElement.prototype;
}
function As() {
  return Jn() && typeof CSS < "u" && typeof CSS.supports == "function" && CSS.supports("anchor-name: --a") && CSS.supports("position-area", "bottom span-right") && CSS.supports("position-try-fallbacks", "flip-block") && CSS.supports("min-width", "min(anchor-size(width), 100vw)") && CSS.supports("max-width", "stretch");
}
const Is = /\bp-(?:select|multiselect|treeselect|cascadeselect)-overlay\b/;
let js = 0;
const qe = /* @__PURE__ */ new WeakMap();
function cn(t, e) {
  const n = t.style;
  n.setProperty("position", "fixed", "important"), n.setProperty("inset", "auto", "important"), n.setProperty("margin", "0", "important"), n.setProperty("position-anchor", e), n.setProperty("position-area", "bottom span-right"), n.setProperty("position-try-fallbacks", "flip-block, flip-inline, flip-block flip-inline"), n.setProperty("min-width", "min(anchor-size(width), 100vw)", "important"), n.setProperty("max-width", "stretch", "important");
}
function Ns(t, e) {
  if (!Is.test(t.className))
    return;
  const n = t.style.cssText;
  cn(t, e), t.getAttribute("popover") !== "manual" && t.setAttribute("popover", "manual");
  try {
    t.matches(":popover-open") || t.showPopover();
  } catch {
  }
  if (!t.matches(":popover-open")) {
    t.removeAttribute("popover"), t.style.cssText = n;
    return;
  }
  if (!qe.has(t)) {
    const r = new MutationObserver(() => {
      const i = t.style;
      (i.top !== "auto" || i.left !== "auto" || i.margin !== "0px" || i.getPropertyPriority("top") !== "important" || i.getPropertyPriority("left") !== "important" || i.getPropertyPriority("margin") !== "important" || i.getPropertyPriority("min-width") !== "important" || i.maxWidth !== "stretch" || i.getPropertyPriority("max-width") !== "important") && cn(t, e);
    });
    r.observe(t, { attributes: !0, attributeFilter: ["style"] }), qe.set(t, r);
  }
}
function St(t) {
  const e = qe.get(t);
  e && (e.disconnect(), qe.delete(t));
}
function Rs(t) {
  const e = t && typeof t.getRootNode == "function" ? t.getRootNode() : null;
  return e instanceof ShadowRoot ? e : null;
}
function ft(t) {
  t.style.top = "0px", t.style.left = "0px";
  const e = t.getBoundingClientRect();
  t.style.top = `${-window.scrollY - e.top}px`, t.style.left = `${-window.scrollX - e.left}px`;
}
const Ge = /* @__PURE__ */ new Set(), wt = /* @__PURE__ */ new WeakMap();
let mn = !1, pt = !1;
const fn = ["w-theme-dark", "w-theme-light"], Be = "data-wippy-theme-root", ht = /* @__PURE__ */ new WeakMap();
function Vs(t) {
  const e = [];
  let n = t ? t.parentNode : null;
  for (; n && n.nodeType === 1; )
    e.push(n), n = n.parentNode;
  return e;
}
function Ds(t, e, n) {
  const r = [...Vs(e), n.host], i = () => {
    let a;
    for (const l of r) {
      if (fn.some((s) => l.classList.contains(s))) {
        a = l;
        break;
      }
      if (l.hasAttribute(Be))
        break;
    }
    for (const l of fn)
      t.classList.toggle(l, !!(a && a.classList.contains(l)));
    a ? t.setAttribute(Be, "") : t.removeAttribute(Be);
  };
  i();
  const o = new MutationObserver(i);
  for (const a of r)
    o.observe(a, { attributes: !0, attributeFilter: ["class", Be] });
  ht.set(t, o);
}
function Qn(t) {
  ht.get(t)?.disconnect(), ht.delete(t);
}
function Ms() {
  pt = !1;
  for (const t of Ge) {
    if (!t.isConnected) {
      for (const e of Array.from(t.children))
        e instanceof HTMLElement && St(e);
      Ge.delete(t), wt.get(t)?.disconnect(), Qn(t);
      continue;
    }
    t.childElementCount > 0 && ft(t);
  }
}
function pn() {
  pt || (pt = !0, requestAnimationFrame(Ms));
}
function Fs(t) {
  const e = document.createElement("div");
  e.setAttribute(Es, "");
  const n = Jn();
  if (e.style.cssText = n ? "position:fixed;width:0 !important;height:0 !important;margin:0 !important;border:0 !important;padding:0 !important;background:transparent !important;color:inherit !important;overflow:visible !important;" : "position:fixed;top:0;left:0;width:0;height:0;", n && e.setAttribute("popover", "manual"), t.appendChild(e), n) {
    try {
      e.showPopover();
    } catch {
    }
    e.matches(":popover-open") || (e.removeAttribute("popover"), e.style.cssText = "position:fixed;top:0;left:0;width:0;height:0;");
  }
  ft(e);
  const r = new MutationObserver((i) => {
    const o = e.__wippyAnchorName;
    for (const a of i) {
      if (o)
        for (const l of Array.from(a.addedNodes))
          l instanceof HTMLElement && Ns(l, o);
      for (const l of Array.from(a.removedNodes))
        l instanceof HTMLElement && St(l);
    }
    e.isConnected && e.childElementCount > 0 && ft(e);
  });
  return r.observe(e, { childList: !0 }), wt.set(e, r), Ge.add(e), mn || (mn = !0, window.addEventListener("scroll", pn, { capture: !0, passive: !0 }), window.addEventListener("resize", pn, { passive: !0 })), e;
}
function hn(t) {
  if (!(!t.hostRoot || t.layer) && (t.layer = Fs(t.hostRoot), Ds(t.layer, t.$el, t.hostRoot), As())) {
    const e = t.$el ? t.$el.parentElement : null;
    e && (t.anchorName = `--wippy-a-${++js}`, t.anchorTrigger = e, e.style.setProperty("anchor-name", t.anchorName), t.layer.__wippyAnchorName = t.anchorName);
  }
}
function gn(t) {
  if (t.anchorTrigger && (t.anchorTrigger.style.removeProperty("anchor-name"), t.anchorTrigger = null), t.anchorName = null, t.layer) {
    for (const e of Array.from(t.layer.children))
      e instanceof HTMLElement && St(e);
    Ge.delete(t.layer), wt.get(t.layer)?.disconnect(), Qn(t.layer), t.layer.remove(), t.layer = null;
  }
}
let vn = !1;
function Hs() {
  if (vn)
    return;
  const t = Gn;
  !t.methods || typeof t.methods.bindOutsideClickListener != "function" || (t.methods.bindOutsideClickListener = function() {
    this.outsideClickListener || (this.outsideClickListener = (e) => {
      const n = e.composedPath(), r = this.container && !n.includes(this.container), i = !(this.target && n.includes(this.target));
      this.overlayVisible && r && i ? this.hide() : !this.popup && r && i && (this.focusedOptionIndex = -1);
    }, document.addEventListener("click", this.outsideClickListener, !0));
  }, vn = !0);
}
let yn = !1;
function Bs() {
  if (yn)
    return;
  yn = !0;
  const t = bt;
  t.computed = t.computed || {}, t.computed.inline = function() {
    return !!this.disabled || this.appendTo === "self";
  }, t.computed.resolvedTarget = function() {
    return this.appendTo == null || this.appendTo === "body" ? this.hostRoot ? this.layer : document.body : this.appendTo;
  }, t.data = function() {
    return { mounted: !1, hostRoot: null, layer: null, anchorName: null, anchorTrigger: null };
  }, t.mounted = function() {
    Zn() && (this.hostRoot = Rs(this.$el), this.mounted = !0, this.hostRoot && (this.inline || hn(this), this.$watch("inline", (e) => {
      e ? gn(this) : hn(this);
    })));
  }, t.render = function() {
    return this.inline ? ae(this.$slots, "default", { key: 0 }) : this.mounted ? Ar(_n, { key: 1, to: this.resolvedTarget || document.body }, [
      ae(this.$slots, "default")
    ]) : B("", !0);
  }, t.unmounted = function() {
    gn(this);
  };
}
const oa = {
  install: (t) => {
    Hs(), Bs(), t.use(Po, { theme: "none" });
  }
};
export {
  x as B,
  ra as F,
  Qs as J,
  Js as M,
  oa as P,
  Ft as R,
  Mt as T,
  Zs as W,
  qs as a,
  _t as b,
  os as c,
  T as d,
  na as e,
  yt as f,
  Ve as g,
  ye as h,
  Gs as i,
  Xs as j,
  bi as k,
  Ks as l,
  ta as m,
  Ie as n,
  Gn as o,
  st as p,
  ia as s,
  Ys as u,
  ea as v,
  Ke as z
};
